"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Brain, Trophy } from "lucide-react";
import AdvancedEditor, { type SupportedLanguage } from "./AdvancedEditor";
import type { ChallengeSummary } from "@/lib/challenges";
import type { LeaderboardEntry } from "@/lib/leaderboard";

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
  details?: string;
  hint?: string;
  transformedCode?: string;
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
  const [language, setLanguage] = useState<SupportedLanguage>("typescript");
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
            language,
          }),
        });
        const payload = (await response.json()) as EvaluateResponse;
        if (!response.ok || payload.error) {
          // Show detailed error information for debugging
          let errorMessage = payload.error ?? "Submission failed. Try again.";
          if (payload.details) {
            errorMessage += `\n\nDetails: ${payload.details}`;
          }
          if (payload.hint) {
            errorMessage += `\n\nHint: ${payload.hint}`;
          }
          if (payload.transformedCode) {
            errorMessage += `\n\nTransformed Code:\n${payload.transformedCode}`;
          }
          setError(errorMessage);
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
    [challenge, code, handle, language],
  );

  const handleRunCode = useCallback(() => {
    // Create a synthetic form event
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>;
    handleSubmit(syntheticEvent);
  }, [handleSubmit]);

  if (!challenge) {
    return <p className="text-sm text-slate-400">No challenges available right now. Check back soon!</p>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <div className="glass-card rounded-3xl p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-100">Challenges</h2>
          <div className="mt-3 flex flex-col gap-2">
            {challenges.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={clsx(
                  "rounded-2xl border px-3 py-3 text-left text-sm transition-all duration-300",
                  item.id === challenge.id
                    ? "glass-card border-blue-500/50 bg-blue-500/20 text-slate-100 shadow-lg shadow-blue-500/20"
                    : "glass-hover border-slate-500/30 text-slate-300 hover:border-slate-400 hover:text-slate-100",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{item.title}</span>
                  <span className={clsx("rounded-full px-2 py-0.5 text-[0.65rem] font-semibold", difficultyColors[item.difficulty])}>
                    {item.difficulty}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">{item.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-100">
            <Trophy className="h-4 w-4 text-blue-400" /> Leaderboard
          </div>
          <div className="mt-4 space-y-3">
            {leaderboard.length === 0 && <p className="text-xs text-slate-400">Be the first to submit a spotless run.</p>}
            {leaderboard.slice(0, 6).map((entry, index) => (
              <div key={entry.id} className="glass-hover rounded-2xl border border-slate-500/30 p-3 text-xs transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">
                    #{index + 1} {entry.handle}
                  </span>
                  <span className="text-blue-400 font-bold">{entry.score}</span>
                </div>
                <p className="mt-1 text-slate-400">{entry.challengeTitle}</p>
                <p className="text-[0.65rem] text-slate-500">
                  {entry.testsPassed}/{entry.totalTests} tests · {entry.runtimeMs}ms
                </p>
              </div>
            ))}
          </div>
          <Link href="/arena/leaderboard" className="mt-4 inline-block text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
            View full leaderboard →
          </Link>
        </div>
      </aside>

      <main className="space-y-6">
        <div className="glass-card rounded-3xl p-6 shadow-sm">
          <p className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">
            <Brain className="h-4 w-4" /> {challenge.difficulty}
          </p>
          <h1 className="text-glow mt-4 text-2xl font-semibold text-slate-100">{challenge.title}</h1>
          <p className="mt-2 text-sm text-slate-300">{challenge.prompt}</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <AdvancedEditor
            value={code}
            onChange={setCode}
            language={language}
            onLanguageChange={setLanguage}
            onRun={handleRunCode}
            isLoading={loading}
            placeholder="Start coding here..."
          />

          <div className="glass-card rounded-3xl p-4 shadow-sm">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300" htmlFor="arena-handle">
              Display name
            </label>
            <input
              id="arena-handle"
              type="text"
              value={handle}
              onChange={(event) => setHandle(event.target.value)}
              placeholder="hackathon-hero"
              className="mt-2 w-full rounded-xl border border-slate-500/30 bg-slate-700/50 px-4 py-3 text-sm text-slate-100 placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
            />
            <p className="mt-2 text-[0.7rem] text-slate-400">
              Your handle appears on the leaderboard when you beat all tests.
            </p>
          </div>

          {error && (
            <div className="glass-card rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <pre className="text-sm text-red-300 whitespace-pre-wrap font-mono">{error}</pre>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="glass-card glass-hover inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-100 shadow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Evaluating…" : "Run tests"}
            </button>
            <span className="text-xs text-slate-400">
              Tests execute inside a sandboxed VM with a 1.5s time budget.
            </span>
          </div>
        </form>

        {summary && (
          <div className="glass-card rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-100">Results</h2>
            <p className="mt-1 text-sm text-slate-300">
              {summary.testsPassed}/{summary.totalTests} tests · Score {summary.score} · Runtime {summary.runtimeMs}ms
            </p>
            <div className="mt-4 space-y-3">
              {testResults?.map((result) => (
                <div
                  key={result.name}
                  className={clsx(
                    "rounded-2xl border px-4 py-3 text-sm",
                    result.passed
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border-red-500/30 bg-red-500/10 text-red-300",
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
