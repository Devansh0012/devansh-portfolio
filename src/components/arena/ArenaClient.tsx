"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import clsx from "clsx";
import { Brain, Trophy } from "lucide-react";
import type { ChallengeSummary } from "@/lib/challenges";
import type { LeaderboardEntry } from "@/lib/leaderboard";
import type { EditorProps } from "@monaco-editor/react";

const MonacoEditor = dynamic<EditorProps>(() => import("@monaco-editor/react").then((mod) => mod.default), {
  ssr: false,
});

type EvaluateResponse = {
  summary: {
    passed: boolean;
    testsPassed: number;
    totalTests: number;
    score: number;
    runtimeMs: number;
  };
  results: Array<{
    name: string;
    passed: boolean;
    received: unknown;
    expected: unknown;
    error?: string;
  }>;
  leaderboard: LeaderboardEntry[];
  error?: string;
};

type Props = {
  challenges: ChallengeSummary[];
};

const difficultyColors: Record<ChallengeSummary["difficulty"], string> = {
  "Basic": "bg-emerald-100 text-emerald-700",
  "Intermediate": "bg-amber-100 text-amber-700",
  "Advanced": "bg-rose-100 text-rose-700",
};

export default function ArenaClient({ challenges }: Props) {
  const [selectedId, setSelectedId] = useState<string>(challenges[0]?.id ?? "");
  const [code, setCode] = useState<string>(challenges[0]?.starterCode ?? "");
  const [handle, setHandle] = useState<string>("");
  const [summary, setSummary] = useState<EvaluateResponse["summary"] | null>(null);
  const [testResults, setTestResults] = useState<EvaluateResponse["results"] | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const challenge = useMemo(
    () => challenges.find((item) => item.id === selectedId) ?? challenges[0],
    [challenges, selectedId],
  );

  const loadLeaderboard = useCallback(async () => {
    const response = await fetch("/api/arena/leaderboard");
    if (!response.ok) return;
    const data = (await response.json()) as { leaderboard: LeaderboardEntry[] };
    setLeaderboard(data.leaderboard);
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  useEffect(() => {
    if (challenge) {
      setCode(challenge.starterCode);
      setSummary(null);
      setTestResults(null);
      setError(null);
    }
  }, [challenge]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!challenge) return;
      if (!handle.trim()) {
        setError("Add a display name to track your submission.");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/arena/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            challengeId: challenge.id,
            code,
            handle: handle.trim(),
          }),
        });
        const payload = (await response.json()) as EvaluateResponse;
        if (!response.ok || payload.error) {
          setError(payload.error ?? "Submission failed. Try again.");
          setSummary(null);
          setTestResults(null);
        } else {
          setSummary(payload.summary);
          setTestResults(payload.results);
          setLeaderboard(payload.leaderboard);
        }
      } catch (submissionError) {
        setError(String(submissionError));
      } finally {
        setLoading(false);
      }
    },
    [challenge, code, handle],
  );

  if (!challenge) {
    return <p className="text-sm text-slate-600">No challenges available right now. Check back soon!</p>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-700 p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-white">Challenges</h2>
          <div className="mt-3 flex flex-col gap-2">
            {challenges.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={clsx(
                  "rounded-2xl border px-3 py-3 text-left text-sm transition",
                  item.id === challenge.id
                    ? "border-slate-900 bg-slate-900 text-white shadow"
                    : "border-slate-200 bg-slate-300 text-slate-700 hover:border-slate-300",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{item.title}</span>
                  <span className={clsx("rounded-full px-2 py-0.5 text-[0.65rem] font-semibold", difficultyColors[item.difficulty])}>
                    {item.difficulty}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{item.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-700 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white">
            <Trophy className="h-4 w-4" /> Leaderboard
          </div>
          <div className="mt-4 space-y-3">
            {leaderboard.length === 0 && <p className="text-xs text-white">Be the first to submit a spotless run.</p>}
            {leaderboard.slice(0, 6).map((entry, index) => (
              <div key={entry.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">
                    #{index + 1} {entry.handle}
                  </span>
                  <span className="text-slate-500">{entry.score}</span>
                </div>
                <p className="mt-1 text-slate-500">{entry.challengeTitle}</p>
                <p className="text-[0.65rem] text-slate-400">
                  {entry.testsPassed}/{entry.totalTests} tests · {entry.runtimeMs}ms
                </p>
              </div>
            ))}
          </div>
          <Link href="/arena/leaderboard" className="mt-4 inline-block text-xs font-semibold text-white">
            View full leaderboard →
          </Link>
        </div>
      </aside>

      <main className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-700 p-6 shadow-sm">
          <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
            <Brain className="h-4 w-4" /> {challenge.difficulty}
          </p>
          <h1 className="mt-4 text-2xl font-semibold text-white">{challenge.title}</h1>
          <p className="mt-2 text-sm text-white">{challenge.prompt}</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-3xl border border-slate-200 bg-slate-950">
            <MonacoEditor
              height="420px"
              theme="vs-dark"
              language="typescript"
              value={code}
              onChange={(value: string | undefined) => setCode(value ?? "")}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-700 p-4 shadow-sm">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white" htmlFor="arena-handle">
              Display name
            </label>
            <input
              id="arena-handle"
              type="text"
              value={handle}
              onChange={(event) => setHandle(event.target.value)}
              placeholder="hackathon-hero"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
            <p className="mt-2 text-[0.7rem] text-white">
              Your handle appears on the leaderboard when you beat all tests.
            </p>
          </div>

          {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 shadow transition hover:-translate-y-0.5 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Evaluating…" : "Run tests"}
            </button>
            <span className="text-xs text-slate-500">
              Tests execute inside a sandboxed VM with a 1.5s time budget.
            </span>
          </div>
        </form>

        {summary && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Results</h2>
            <p className="mt-1 text-sm text-slate-600">
              {summary.testsPassed}/{summary.totalTests} tests · Score {summary.score} · Runtime {summary.runtimeMs}ms
            </p>
            <div className="mt-4 space-y-3">
              {testResults?.map((result) => (
                <div
                  key={result.name}
                  className={clsx(
                    "rounded-2xl border px-4 py-3 text-sm",
                    result.passed
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-rose-200 bg-rose-50 text-rose-700",
                  )}
                >
                  <p className="font-semibold">{result.name}</p>
                  {!result.passed && (
                    <div className="mt-2 space-y-1 text-xs">
                      <p>Expected: {formatValue(result.expected)}</p>
                      <p>Received: {formatValue(result.received)}</p>
                      {result.error && <p>Error: {result.error}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function formatValue(value: unknown) {
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}
