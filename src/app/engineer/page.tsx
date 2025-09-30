import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, Cpu, Joystick, ListTree, NotebookPen } from "lucide-react";
import TerminalIntro from "@/components/TerminalIntro";
import MiniDemos from "@/components/MiniDemos";
import { projects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Engineer Mode",
  description:
    "Dive into Devansh Dubey's engineering playground featuring terminal interactions, build logs, demos, and tooling.",
};

export default function EngineerPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-emerald-200">
      <section className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-16 pt-20 md:pt-24">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300/90">
              <Cpu className="h-3.5 w-3.5" /> Engineer mode
            </p>
            <h1 className="text-4xl font-semibold text-emerald-100 md:text-5xl">
              Welcome to the playground. Type, ship, and explore the systems powering my favourite builds.
            </h1>
            <p className="max-w-2xl text-lg text-emerald-200/80">
              This space mirrors the day-to-day command center—terminal logs, observability snapshots, and rapidly
              iterated experiments. Feel free to poke around.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={{ pathname: "/arena" as Route }}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow transition hover:-translate-y-0.5 hover:bg-emerald-300"
              >
                Enter the code arena
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-emerald-400/30 bg-black/70 shadow-2xl">
            <TerminalIntro />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-400/20 bg-black/50 p-6">
            <ListTree className="h-5 w-5 text-emerald-300" />
            <h3 className="mt-4 text-lg font-semibold text-emerald-50">Playable logs</h3>
            <p className="mt-2 text-sm text-emerald-200/80">
              Trace deploys, incidents, and heroic fixes as JSON logs rendered beautifully.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-400/20 bg-black/50 p-6">
            <Joystick className="h-5 w-5 text-emerald-300" />
            <h3 className="mt-4 text-lg font-semibold text-emerald-50">Mini demos</h3>
            <p className="mt-2 text-sm text-emerald-200/80">
              Launch live experiments for rate limiters, pub/sub, and broadcast systems.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-400/20 bg-black/50 p-6">
            <NotebookPen className="h-5 w-5 text-emerald-300" />
            <h3 className="mt-4 text-lg font-semibold text-emerald-50">Deep dives</h3>
            <p className="mt-2 text-sm text-emerald-200/80">
              Read engineering notes that inspired blogs, talks, and community workshops.
            </p>
          </div>
        </div>
      </section>

  <section id="projects" className="border-t border-emerald-500/10 bg-black/70">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-400/80">Projects</p>
              <h2 className="text-3xl font-semibold text-emerald-100">Latest experiments</h2>
            </div>
            <p className="max-w-xl text-sm text-emerald-200/80">
              Each project emphasises resilience, observability, and developer experience.
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <article key={project.title} className="flex h-full flex-col rounded-2xl border border-emerald-500/20 bg-slate-950 p-6">
                <h3 className="text-xl font-semibold text-emerald-100">{project.title}</h3>
                <p className="mt-3 text-sm text-emerald-200/80">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-emerald-300/80">
                  {project.tech.map((tech) => (
                    <span key={tech} className="rounded-full border border-emerald-400/30 px-3 py-1">
                      {tech}
                    </span>
                  ))}
                </div>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-200"
                >
                  Inspect repository
                  <ArrowRight className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="demos" className="border-t border-emerald-500/10 bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-400/80">Playground</p>
              <h2 className="text-3xl font-semibold text-emerald-100">Mini demos</h2>
            </div>
            <p className="max-w-xl text-sm text-emerald-200/80">
              Quick simulations of the tooling I use to reason about resilience and broadcast guarantees.
            </p>
          </div>
          <div className="mt-8">
            <MiniDemos />
          </div>
        </div>
      </section>

      <section className="border-t border-emerald-500/10 bg-black/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center">
          <h2 className="text-3xl font-semibold text-emerald-100">Want to test the systems?</h2>
          <p className="max-w-2xl text-sm text-emerald-200/80">
            The Code Challenge Arena simulates real-world constraints—rate limits, latency budgets, and multi-service
            choreography. Submit your solution and climb the leaderboard.
          </p>
          <Link
            href={{ pathname: "/arena" as Route }}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow transition hover:-translate-y-0.5 hover:bg-emerald-300"
          >
            Launch arena
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
