import { NextResponse } from "next/server";
import vm from "node:vm";
import { z } from "zod";
import { getChallengeById } from "@/lib/challenges";
import { addLeaderboardEntry, getLeaderboard } from "@/lib/leaderboard";

const requestSchema = z.object({
  challengeId: z.string(),
  code: z.string().min(20).max(8000),
  handle: z.string().min(2).max(40),
});

type TestResult = {
  name: string;
  passed: boolean;
  received: unknown;
  expected: unknown;
  error?: string;
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parseResult = requestSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parseResult.error.flatten() },
      { status: 400 },
    );
  }

  const { challengeId, code, handle } = parseResult.data;
  const challenge = getChallengeById(challengeId);
  if (!challenge) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
  }

  const tests = challenge.tests;
  const sandbox = { console: { log: () => undefined } };
  const context = vm.createContext(sandbox, { codeGeneration: { strings: true, wasm: false } });
  const results: TestResult[] = [];
  const start = Date.now();

  try {
    const script = new vm.Script(`${code}\n;globalThis.__solution = ${challenge.functionName};`);
    script.runInContext(context, { timeout: 1500 });
  } catch (error) {
    return NextResponse.json({ error: "Code execution failed", details: String(error) }, { status: 400 });
  }

  const solution = (context as typeof context & { __solution?: unknown }).__solution;
  if (typeof solution !== "function") {
    return NextResponse.json({ error: `Expected exported function ${challenge.functionName}` }, { status: 400 });
  }

  let passedCount = 0;
  for (const test of tests) {
    try {
      const output = (solution as (...args: unknown[]) => unknown)(...test.input);
      const passed = deepEqual(output, test.expected);
      if (passed) {
        passedCount += 1;
      }
      results.push({ name: test.name, passed, received: output, expected: test.expected });
    } catch (error) {
      results.push({
        name: test.name,
        passed: false,
        received: null,
        expected: test.expected,
        error: String(error),
      });
    }
  }

  const total = tests.length;
  const runtimeMs = Date.now() - start;
  const score = Math.round((passedCount / total) * 100);

  let leaderboard = getLeaderboard();
  if (passedCount === total) {
    leaderboard = addLeaderboardEntry({
      challenge,
      handle,
      score,
      testsPassed: passedCount,
      totalTests: total,
      runtimeMs,
    });
  }

  return NextResponse.json({
    summary: {
      passed: passedCount === total,
      testsPassed: passedCount,
      totalTests: total,
      score,
      runtimeMs,
    },
    results,
    leaderboard,
  });
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((value, index) => deepEqual(value, b[index]));
  }

  if (typeof a === "object" && typeof b === "object") {
    const entriesA = Object.entries(a as Record<string, unknown>);
    const entriesB = Object.entries(b as Record<string, unknown>);
    if (entriesA.length !== entriesB.length) return false;
    return entriesA.every(([key, value]) => deepEqual(value, (b as Record<string, unknown>)[key]));
  }

  if (typeof a === "number" && typeof b === "number") {
    return Math.abs(a - b) < 1e-6;
  }

  return false;
}
