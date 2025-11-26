import type { Metadata } from "next";
import { getChallengeSummaries } from "@/lib/challenges";
import LeaderboardClient from "@/components/arena/LeaderboardClient";
import { GravityStarsBackground } from "@/components/animate-ui/components/backgrounds/gravity-stars";

export const metadata: Metadata = {
  title: "Arena leaderboard | Top Devansh challengers",
  description: "Track the sharpest submissions across Devansh's coding arena and study their winning runs.",
};

export default function LeaderboardPage() {
  const challenges = getChallengeSummaries();

  return (
    <div className="relative min-h-screen bg-black text-white">
      <GravityStarsBackground className="absolute inset-0 -z-10" starsCount={100} starsSize={2} />
      <div className="mx-auto max-w-8xl space-y-12 px-6 pb-20 pt-16">
        <LeaderboardClient challenges={challenges} />
      </div>
    </div>
  );
}
