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

// Function to strip TypeScript types and convert to JavaScript
function stripTypeScript(code: string): string {
  let jsCode = code;
  
  // Simple approach: just remove type annotations from function parameters
  // Match function declarations with typed parameters
  jsCode = jsCode.replace(
    /function\s+(\w+)\s*\(([^)]*)\)/g,
    (match: string, funcName: string, params: string) => {
      // Clean up parameters by removing type annotations
      const cleanParams = params
        .split(',')
        .map((param: string) => param.trim().split(':')[0].trim())
        .filter((param: string) => param.length > 0)
        .join(', ');
      return `function ${funcName}(${cleanParams})`;
    }
  );
  
  // Also handle arrow functions with types (if any)
  jsCode = jsCode.replace(
    /\(([^)]*)\)\s*:\s*[^{]+\s*=>/g,
    (match: string, params: string) => {
      const cleanParams = params
        .split(',')
        .map((param: string) => param.trim().split(':')[0].trim())
        .filter((param: string) => param.length > 0)
        .join(', ');
      return `(${cleanParams}) =>`;
    }
  );
  
  return jsCode;
}

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
  const sandbox = { 
    console: { log: () => undefined },
    exports: {},
    module: { exports: {} }
  };
  const context = vm.createContext(sandbox, { codeGeneration: { strings: true, wasm: false } });
  const results: TestResult[] = [];
  const start = Date.now();
  let transformedCode = "";

  try {
    // First strip TypeScript types to convert to JavaScript
    transformedCode = stripTypeScript(code);
    
    // Handle "export function functionName" pattern
    const exportFunctionMatch = transformedCode.match(/export\s+function\s+(\w+)/);
    if (exportFunctionMatch) {
      const funcName = exportFunctionMatch[1];
      transformedCode = transformedCode.replace(/export\s+function/, 'function');
      transformedCode += `\nglobalThis.__solution = ${funcName};`;
    } else {
      // Handle "export { functionName }" or "export default" patterns
      const exportMatch = transformedCode.match(/export\s*{\s*(\w+)\s*}/);
      const exportDefaultMatch = transformedCode.match(/export\s+default\s+(\w+)/);
      
      if (exportMatch) {
        const funcName = exportMatch[1];
        transformedCode = transformedCode.replace(/export\s*{\s*\w+\s*}/, '');
        transformedCode += `\nglobalThis.__solution = ${funcName};`;
      } else if (exportDefaultMatch) {
        const funcName = exportDefaultMatch[1];
        transformedCode = transformedCode.replace(/export\s+default\s+\w+/, '');
        transformedCode += `\nglobalThis.__solution = ${funcName};`;
      } else {
        // Fallback: try to find the function and make it available
        transformedCode += `\nglobalThis.__solution = ${challenge.functionName};`;
      }
    }

    const script = new vm.Script(transformedCode);
    script.runInContext(context, { timeout: 1500 });
  } catch (error) {
    return NextResponse.json({ 
      error: "Code execution failed", 
      details: String(error),
      hint: "Make sure your code exports the required function and has valid syntax.",
      transformedCode: transformedCode // Add this for debugging
    }, { status: 400 });
  }

  const solution = (context as typeof context & { __solution?: unknown }).__solution;
  if (typeof solution !== "function") {
    return NextResponse.json({ 
      error: `Expected exported function '${challenge.functionName}' but found ${typeof solution}`,
      hint: `Make sure to export a function named '${challenge.functionName}' from your code.`
    }, { status: 400 });
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
