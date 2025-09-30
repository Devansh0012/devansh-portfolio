import Link from "next/link";
import { ShieldAlert, Terminal } from "lucide-react";

export const metadata = {
  title: "Root Workspace",
  description: "Hidden mode unlocked via the terminal Easter egg.",
};

export default function RootWorkspacePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-emerald-200">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-24">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/90">
          <Terminal className="h-3.5 w-3.5" /> root workspace
        </div>
        <h1 className="text-4xl font-semibold text-emerald-100">You found the root console.</h1>
        <p className="text-sm text-emerald-200/80">
          This space hosts raw experiments, chaos engineering drills, and staged migrations. Access is invite-only. If
          you want a tour, mention the Easter egg in your message.
        </p>
        <div className="rounded-3xl border border-emerald-400/20 bg-black/70 p-6">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-6 w-6 text-red-300" />
            <span className="text-sm font-semibold text-emerald-100">Operational safeguards</span>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-emerald-200/80">
            <li>• Synthetic traffic generator for validating rate limiter rollouts.</li>
            <li>• Scenario framework for replaying previous incidents and postmortems.</li>
            <li>• Replay buffer for GraphQL and REST edge requests.</li>
          </ul>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="mailto:devanshdubey0012@gmail.com?subject=Root%20workspace%20tour"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow transition hover:-translate-y-0.5 hover:bg-emerald-300"
          >
            Request access
          </Link>
          <Link
            href="/arena"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:border-emerald-200"
          >
            Try the public arena
          </Link>
        </div>
      </div>
    </div>
  );
}
