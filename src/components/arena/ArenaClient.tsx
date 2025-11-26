"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Brain, Trophy } from "lucide-react";
import AdvancedEditor, { type SupportedLanguage } from "./AdvancedEditor";
import type { ChallengeSummary } from "@/lib/challenges";
import type { LeaderboardEntry } from "@/lib/leaderboard";
import { Button } from "@/components/ui/Button";

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
  "Basic": "bg-neutral-200 text-neutral-800",
  "Intermediate": "bg-neutral-300 text-neutral-900",
  "Advanced": "bg-neutral-100 text-neutral-700",
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
    return <p className="text-sm text-neutral-400">No challenges available right now. Check back soon!</p>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur-xl">
          <h2 className="text-sm font-semibold text-white">Challenges</h2>
          <div className="mt-3 flex flex-col gap-2">
            {challenges.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={clsx(
                  "rounded-2xl border px-3 py-3 text-left text-sm transition-all duration-300",
                  item.id === challenge.id
                    ? "border-white/50 bg-white/20 text-white shadow-lg shadow-white/20"
                    : "border-white/10 text-neutral-300 hover:border-white/30 hover:bg-white/5 hover:text-white",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{item.title}</span>
                  <span className={clsx("rounded-full px-2 py-0.5 text-[0.65rem] font-semibold", difficultyColors[item.difficulty])}>
                    {item.difficulty}
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-400">{item.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white">
            <Trophy className="h-4 w-4 text-white" /> Leaderboard
          </div>
          <div className="mt-4 space-y-3">
            {leaderboard.length === 0 && <p className="text-xs text-neutral-400">Be the first to submit a spotless run.</p>}
            {leaderboard.slice(0, 6).map((entry, index) => (
              <div key={entry.id} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs transition-all duration-300 hover:bg-white/10">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-200">
                    #{index + 1} {entry.handle}
                  </span>
                  <span className="text-white font-bold">{entry.score}</span>
                </div>
                <p className="mt-1 text-neutral-400">{entry.challengeTitle}</p>
                <p className="text-[0.65rem] text-neutral-500">
                  {entry.testsPassed}/{entry.totalTests} tests · {entry.runtimeMs}ms
                </p>
              </div>
            ))}
          </div>
          <Link href="/arena/leaderboard" className="mt-4 inline-block text-xs font-semibold text-white hover:text-neutral-300 transition-colors">
            View full leaderboard →
          </Link>
        </div>
      </aside>

      <main className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-300">
            <Brain className="h-4 w-4" /> {challenge.difficulty}
          </p>
          <h1 className="text-glow mt-4 text-2xl font-semibold text-white">{challenge.title}</h1>
          <p className="mt-2 text-sm text-neutral-300">{challenge.prompt}</p>
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

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur-xl">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-300" htmlFor="arena-handle">
              Display name
            </label>
            <input
              id="arena-handle"
              type="text"
              value={handle}
              onChange={(event) => setHandle(event.target.value)}
              placeholder="hackathon-hero"
              className="mt-2 w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-400 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
            <p className="mt-2 text-[0.7rem] text-neutral-400">
              Your handle appears on the leaderboard when you beat all tests.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 backdrop-blur-xl">
              <pre className="text-sm text-red-300 whitespace-pre-wrap font-mono">{error}</pre>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="submit"
              disabled={loading}
              variant="secondary"
              size="md"
            >
              {loading ? "Evaluating…" : "Run tests"}
            </Button>
            <span className="text-xs text-neutral-400">
              Tests execute inside a sandboxed VM with a 1.5s time budget.
            </span>
          </div>
        </form>

        {summary && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-white">Results</h2>
            <p className="mt-1 text-sm text-neutral-300">
              {summary.testsPassed}/{summary.totalTests} tests · Score {summary.score} · Runtime {summary.runtimeMs}ms
            </p>
            <div className="mt-4 space-y-3">
              {testResults?.map((result) => (
                <div
                  key={result.name}
                  className={clsx(
                    "rounded-2xl border px-4 py-3 text-sm",
                    result.passed
                      ? "border-white/30 bg-white/10 text-neutral-200"
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
