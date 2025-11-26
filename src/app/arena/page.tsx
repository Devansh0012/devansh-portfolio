import type { Metadata } from "next";
import ArenaClient from "@/components/arena/ArenaClient";
import { getChallengeSummaries } from "@/lib/challenges";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { BorderBeam } from "@/components/ui/border-beam";
import { GravityStarsBackground } from "@/components/animate-ui/components/backgrounds/gravity-stars";

export const metadata: Metadata = {
  title: "Devansh Arena | Real-time coding gauntlet",
  description:
    "Ship production-grade solutions against streaming test suites. Submit TypeScript answers and climb the leaderboard in Devansh's arena.",
};

export default function ArenaPage() {
  const challenges = getChallengeSummaries();

  return (
    <div className="relative min-h-screen bg-black text-white">
      <GravityStarsBackground className="absolute inset-0 -z-10" starsCount={100} starsSize={2} />
      <div className="mx-auto flex max-w-8xl flex-col gap-12 px-6 pb-24 pt-16">
        <CardSpotlight className="relative overflow-hidden rounded-3xl p-10 shadow-xl" radius={400} color="#0a0a0a">
          <BorderBeam size={220} duration={12} delay={0} colorFrom="#ffffff" colorTo="#737373" />
          <div className="relative z-20">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-neutral-400">Devansh Arena</p>
            <h1 className="text-glow mt-4 text-4xl font-semibold text-white sm:text-5xl">Ship on the clock.</h1>
            <p className="mt-4 max-w-2xl text-base text-neutral-300">
              Run code directly against production-style scenarios, from rate limiters to event fan-outs. Every submission executes inside an isolated VM and updates the global leaderboard instantly.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-neutral-300">
              <div className="rounded-full border border-white/20 bg-white/5 px-4 py-2">
                Live TypeScript evaluator
              </div>
              <div className="rounded-full border border-white/20 bg-white/5 px-4 py-2">
                Real-time scoring
              </div>
              <div className="rounded-full border border-white/20 bg-white/5 px-4 py-2">
                Community leaderboard
              </div>
            </div>
          </div>
        </CardSpotlight>

        <ArenaClient challenges={challenges} />

        <CardSpotlight className="relative grid gap-6 overflow-hidden rounded-3xl p-8 shadow-sm md:grid-cols-2" radius={400} color="#0a0a0a">
          <BorderBeam size={220} duration={14} delay={0} colorFrom="#ffffff" colorTo="#525252" />
          <div className="relative z-20">
            <h2 className="text-2xl font-semibold text-white">What gets measured?</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-300">
              Each challenge ships with a curated set of edge cases. Passing every test awards the full score, weighted by difficulty. We also surface runtime to highlight efficient solutions.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-neutral-300">
              <li>• Functional correctness across deterministic tests.</li>
              <li>• Execution time budgeted to 1.5 seconds per submission.</li>
              <li>• Bonus points for higher-difficulty prompts.</li>
            </ul>
          </div>
          <div className="relative z-20">
            <h2 className="text-2xl font-semibold text-white">Pro tips</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-300">
              You can iterate as many times as you like—only the best run counts. Use the starter templates to align with expected function shapes, and sprinkle logs using <code className="rounded-md bg-neutral-800 px-1.5 py-0.5 text-neutral-300">console.log</code> for rapid debugging.
            </p>
            <p className="mt-4 text-sm text-neutral-300">
              The arena is still evolving. Got a scenario in mind? Drop a note on the engineering page and let&apos;s build it together.
            </p>
          </div>
        </CardSpotlight>
      </div>
    </div>
  );
}
