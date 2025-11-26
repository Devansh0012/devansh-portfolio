"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { LeaderboardEntry } from "@/lib/leaderboard";
import type { ChallengeSummary } from "@/lib/challenges";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/Button";
import { Trophy, ArrowLeft } from "lucide-react";

type Props = {
  challenges: ChallengeSummary[];
};

export default function LeaderboardClient({ challenges }: Props) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch("/api/arena/leaderboard");
        if (response.ok) {
          const data = await response.json();
          setLeaderboard(data.leaderboard || []);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  const grouped = challenges.map((challenge) => ({
    challenge,
    entries: leaderboard.filter((entry) => entry.challengeId === challenge.id).slice(0, 20),
  }));

  const formatter = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <>
      <CardSpotlight className="relative overflow-hidden rounded-3xl p-8" radius={400} color="#0a0a0a">
        <BorderBeam size={220} duration={12} delay={0} colorFrom="#ffffff" colorTo="#737373" />
        <div className="relative z-20 space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-white" />
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-neutral-400">Arena</p>
          </div>
          <h1 className="text-glow text-4xl font-semibold text-white">Leaderboard</h1>
          <p className="max-w-2xl text-sm text-neutral-300">
            Every submission runs through the same sandbox, and only the cleanest output earns a spot here. Beat the time, match every edge case, and your handle will show up instantly.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href="/arena">
              <Button variant="secondary" size="md">
                <ArrowLeft className="h-4 w-4" />
                Return to arena
              </Button>
            </Link>
            <span className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs text-neutral-400">
              Showing top 20 per challenge
            </span>
          </div>
        </div>
      </CardSpotlight>

      <section className="space-y-10">
        {grouped.map(({ challenge, entries }) => (
          <div key={challenge.id} className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-neutral-500">{challenge.difficulty}</p>
              <h2 className="text-2xl font-semibold text-white">{challenge.title}</h2>
              <p className="text-sm text-neutral-300">{challenge.description}</p>
            </div>

            {entries.length === 0 ? (
              <CardSpotlight className="relative overflow-hidden rounded-3xl p-8 text-center" radius={350} color="#0a0a0a">
                <BorderBeam size={180} duration={12} delay={0} colorFrom="#ffffff" colorTo="#737373" />
                <div className="relative z-20">
                  <p className="text-sm text-neutral-400">No finishes yet. Be the first to ship a spotless solution.</p>
                </div>
              </CardSpotlight>
            ) : (
              <div className="space-y-3">
                {entries.map((entry, index) => (
                  <CardSpotlight
                    key={entry.id}
                    className="relative overflow-hidden rounded-2xl p-6"
                    radius={300}
                    color="#0a0a0a"
                  >
                    <BorderBeam size={150} duration={10 + index * 0.5} delay={index * 0.2} colorFrom="#ffffff" colorTo="#737373" />
                    <div className="relative z-20 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-lg font-semibold text-white">
                          #{index + 1}
                        </span>
                        <div>
                          <p className="text-base font-semibold text-white">{entry.handle}</p>
                          <p className="text-xs text-neutral-400">{formatter.format(new Date(entry.submittedAt))}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-300">
                        <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-semibold text-white">
                          Score {entry.score}
                        </div>
                        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                          {entry.testsPassed}/{entry.totalTests} tests
                        </div>
                        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                          {entry.runtimeMs}ms
                        </div>
                      </div>
                    </div>
                  </CardSpotlight>
                ))}
              </div>
            )}
          </div>
        ))}

        {leaderboard.length === 0 && (
          <CardSpotlight className="relative overflow-hidden rounded-3xl p-12 text-center" radius={400} color="#0a0a0a">
            <BorderBeam size={220} duration={14} delay={0} colorFrom="#ffffff" colorTo="#525252" />
            <div className="relative z-20 space-y-4">
              <Trophy className="mx-auto h-12 w-12 text-neutral-400" />
              <h3 className="text-xl font-semibold text-white">No submissions yet</h3>
              <p className="text-sm text-neutral-400">Be the first to conquer the arena challenges!</p>
              <div className="pt-4">
                <Link href="/arena">
                  <Button variant="primary" size="md">
                    Start coding
                  </Button>
                </Link>
              </div>
            </div>
          </CardSpotlight>
        )}
      </section>
    </>
  );
}
