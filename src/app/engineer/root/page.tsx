import Link from "next/link";
import { ArrowLeft, ShieldAlert, Terminal } from "lucide-react";
import { mailto } from "@/lib/site";

export const metadata = {
  title: "Root Workspace",
  description: "Hidden mode unlocked via the terminal Easter egg.",
};

/**
 * Easter egg reachable from the terminal.
 *
 * Peak-End Rule: a hidden page someone *found* is a peak moment, and it's worth
 * the distinct emerald treatment — this is the one place on the site where
 * breaking the monochrome palette is the point. What it can't do is strand
 * them: previously the only ways out were a `next/link` pointing at a
 * `mailto:` (which isn't a route and skips the mail handler) and a link to the
 * demos. There's now an explicit route back to the console they came from.
 */
export default function RootWorkspacePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-emerald-200">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-20">
        <Link
          href="/engineer"
          className="inline-flex min-h-[40px] w-fit items-center gap-2 text-sm font-semibold text-emerald-300/70 hover:text-emerald-200"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back to the console
        </Link>

        <p className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/90">
          <Terminal aria-hidden="true" className="h-3.5 w-3.5" /> root workspace
        </p>
        <h1 className="text-4xl font-semibold text-emerald-100">You found the root console.</h1>
        <p className="measure text-sm leading-relaxed text-emerald-200/80">
          This space hosts raw experiments, chaos engineering drills, and staged migrations. Access
          is invite-only. If you want a tour, mention the Easter egg in your message.
        </p>

        <div className="rounded-3xl border border-emerald-400/20 bg-black/70 p-6">
          <h2 className="flex items-center gap-3 text-sm font-semibold text-emerald-100">
            <ShieldAlert aria-hidden="true" className="h-5 w-5 text-red-300" />
            Operational safeguards
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-emerald-200/80">
            {[
              "Synthetic traffic generator for validating rate limiter rollouts.",
              "Scenario framework for replaying previous incidents and postmortems.",
              "Replay buffer for GraphQL and REST edge requests.",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-[0.45rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/70"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* A plain anchor: next/link is for in-app routes, and wrapping a
              mailto: in the client router can swallow the handoff to the mail
              client entirely. */}
          <a
            href={mailto("Root workspace tour")}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-emerald-400 px-5 text-sm font-semibold text-slate-900 transition-transform hover:-translate-y-0.5 hover:bg-emerald-300"
          >
            Request access
          </a>
          <Link
            href="/demos"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-emerald-400/40 px-5 text-sm font-semibold text-emerald-200 hover:border-emerald-200"
          >
            Try the demos
          </Link>
        </div>
      </div>
    </div>
  );
}
