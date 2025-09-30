import type { Metadata } from "next";
import Link from "next/link";
import { getChallengeSummaries } from "@/lib/challenges";
import { getLeaderboard } from "@/lib/leaderboard";

export const metadata: Metadata = {
  title: "Arena leaderboard | Top Devansh challengers",
  description: "Track the sharpest submissions across Devansh's coding arena and study their winning runs.",
};

export default function LeaderboardPage() {
  const leaderboard = getLeaderboard();
  const challenges = getChallengeSummaries();

  const grouped = challenges.map((challenge) => ({
    challenge,
    entries: leaderboard.filter((entry) => entry.challengeId === challenge.id),
  }));

  const formatter = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto max-w-8xl space-y-12 px-6 pb-20 pt-16 bg-gray-950 min-h-screen">
      <header className="flex flex-col gap-4 rounded-3xl border border-gray-800 bg-gray-900 p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-400">Arena</p>
        <h1 className="text-4xl font-semibold text-white">Leaderboard</h1>
        <p className="max-w-2xl text-sm text-gray-300">
          Every submission runs through the same sandbox, and only the cleanest output earns a spot here. Beat the time, match every edge case, and your handle will show up instantly.
        </p>
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
          <Link href="/arena" className="rounded-full border border-gray-700 px-4 py-2 font-semibold text-gray-300 transition hover:border-gray-600">
            Return to arena →
          </Link>
          <span className="rounded-full border border-gray-700 px-4 py-2">
            Showing top 20 global finishes
          </span>
        </div>
      </header>

      <section className="space-y-10">
        {grouped.map(({ challenge, entries }) => (
          <div key={challenge.id} className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-400">{challenge.difficulty}</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{challenge.title}</h2>
              <p className="mt-2 text-sm text-gray-300">{challenge.description}</p>
            </div>

            {entries.length === 0 ? (
              <p className="rounded-3xl border border-dashed border-gray-700 bg-gray-800 px-6 py-8 text-sm text-gray-400">
                No finishes yet. Be the first to ship a spotless solution.
              </p>
            ) : (
              <ol className="space-y-3">
                {entries.map((entry, index) => (
                  <li
                    key={entry.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-gray-800 bg-gray-900 px-6 py-4 shadow-sm"
                  >
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-lg font-semibold text-gray-500">#{index + 1}</span>
                      <div>
                        <p className="text-base font-semibold text-white">{entry.handle}</p>
                        <p className="text-xs text-gray-400">{formatter.format(new Date(entry.submittedAt))}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-xs text-gray-300">
                      <div className="rounded-full bg-gray-800 px-3 py-1 font-semibold text-gray-200">Score {entry.score}</div>
                      <div>{entry.testsPassed}/{entry.totalTests} tests</div>
                      <div>{entry.runtimeMs}ms runtime</div>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
