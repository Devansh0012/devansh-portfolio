import type { Metadata } from "next";
import ArenaClient from "@/components/arena/ArenaClient";
import { getChallengeSummaries } from "@/lib/challenges";

export const metadata: Metadata = {
  title: "Devansh Arena | Real-time coding gauntlet",
  description:
    "Ship production-grade solutions against streaming test suites. Submit TypeScript answers and climb the leaderboard in Devansh's arena.",
};

export default function ArenaPage() {
  const challenges = getChallengeSummaries();

  return (
    <div className="mx-auto flex max-w-8xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-700 flex-col gap-12 px-6 pb-24 pt-16">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-700 p-10 text-white shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-300">Devansh Arena</p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Ship on the clock.</h1>
        <p className="mt-4 max-w-2xl text-base text-slate-200">
          Run code directly against production-style scenarios, from rate limiters to event fan-outs. Every submission executes inside an isolated VM and updates the global leaderboard instantly.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-200">
          <div className="rounded-full border border-slate-500/60 bg-slate-800/50 px-4 py-2">
            Live TypeScript evaluator
          </div>
          <div className="rounded-full border border-slate-500/60 bg-slate-800/50 px-4 py-2">
            Real-time scoring
          </div>
          <div className="rounded-full border border-slate-500/60 bg-slate-800/50 px-4 py-2">
            Community leaderboard
          </div>
        </div>
      </section>

      <ArenaClient challenges={challenges} />

      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-700 p-8 shadow-sm md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold text-white">What gets measured?</h2>
          <p className="mt-3 text-sm leading-relaxed text-white">
            Each challenge ships with a curated set of edge cases. Passing every test awards the full score, weighted by difficulty. We also surface runtime to highlight efficient solutions.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white">
            <li>• Functional correctness across deterministic tests.</li>
            <li>• Execution time budgeted to 1.5 seconds per submission.</li>
            <li>• Bonus points for higher-difficulty prompts.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-white">Pro tips</h2>
          <p className="mt-3 text-sm leading-relaxed text-white">
            You can iterate as many times as you like—only the best run counts. Use the starter templates to align with expected function shapes, and sprinkle logs using <code className="rounded-md bg-slate-800 px-1.5 py-0.5">console.log</code> for rapid debugging.
          </p>
          <p className="mt-4 text-sm text-white">
            The arena is still evolving. Got a scenario in mind? Drop a note on the engineering page and let&apos;s build it together.
          </p>
        </div>
      </section>
    </div>
  );
}
