import type { Metadata } from "next";
import Link from "next/link";
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
    <div className="min-h-screen text-slate-100">
      <div className="mx-auto flex max-w-8xl flex-col gap-12 px-6 pb-24 pt-16">
        <section className="glass-card rounded-3xl p-10 shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-300">Devansh Arena</p>
          <h1 className="text-glow mt-4 text-4xl font-semibold text-slate-100 sm:text-5xl">Ship on the clock.</h1>
          <p className="mt-4 max-w-2xl text-base text-slate-300">
            Run code directly against production-style scenarios, from rate limiters to event fan-outs. Every submission executes inside an isolated VM and updates the global leaderboard instantly.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-300">
            <div className="glass-card rounded-full px-4 py-2">
              Live TypeScript evaluator
            </div>
            <div className="glass-card rounded-full px-4 py-2">
              Real-time scoring
            </div>
            <div className="glass-card rounded-full px-4 py-2">
              Community leaderboard
            </div>
          </div>
        </section>

        <ArenaClient challenges={challenges} />

        <section className="glass-card rounded-3xl p-8 shadow-sm">
          <h2 className="mb-6 text-center text-2xl font-semibold text-slate-100">More Challenges</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/trivia"
              className="glass-card group rounded-2xl p-6 text-left transition-all hover:-translate-y-1 hover:border-violet-500/50"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/20">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-violet-100">Trivia Arena</h3>
              <p className="text-sm text-slate-300">
                Test your polymath knowledge across technology, physics, economics, history, and sports.
              </p>
            </Link>
            <Link
              href="/connections"
              className="glass-card group rounded-2xl p-6 text-left transition-all hover:-translate-y-1 hover:border-blue-500/50"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-blue-100">Connections Game</h3>
              <p className="text-sm text-slate-300">
                Find groups of four related words in this NYT-style puzzle spanning multiple domains.
              </p>
            </Link>
          </div>
        </section>

        <section className="glass-card grid gap-6 rounded-3xl p-8 shadow-sm md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold text-slate-100">What gets measured?</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Each challenge ships with a curated set of edge cases. Passing every test awards the full score, weighted by difficulty. We also surface runtime to highlight efficient solutions.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li>• Functional correctness across deterministic tests.</li>
              <li>• Execution time budgeted to 1.5 seconds per submission.</li>
              <li>• Bonus points for higher-difficulty prompts.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-100">Pro tips</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              You can iterate as many times as you like—only the best run counts. Use the starter templates to align with expected function shapes, and sprinkle logs using <code className="rounded-md bg-slate-700/50 px-1.5 py-0.5 text-blue-300">console.log</code> for rapid debugging.
            </p>
            <p className="mt-4 text-sm text-slate-300">
              The arena is still evolving. Got a scenario in mind? Drop a note on the engineering page and let&apos;s build it together.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
