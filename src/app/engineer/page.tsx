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
    <div className="min-h-screen text-slate-100">
      <section className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-16 pt-20 md:pt-24">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">
              <Cpu className="h-3.5 w-3.5" /> Engineer mode
            </p>
            <h1 className="text-glow text-4xl font-semibold text-slate-100 md:text-5xl">
              Welcome to the playground. Type, ship, and explore the systems powering my favourite builds.
            </h1>
            <p className="max-w-2xl text-lg text-slate-300">
              This space mirrors the day-to-day command center—terminal logs, observability snapshots, and rapidly
              iterated experiments. Feel free to poke around.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={{ pathname: "/arena" as Route }}
                className="glass-card glass-hover inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-100 shadow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25"
              >
                Enter the code arena
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="glass-card overflow-hidden rounded-3xl shadow-2xl">
            <TerminalIntro />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="glass-card rounded-2xl p-6">
            <ListTree className="h-5 w-5 text-blue-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-100">Playable logs</h3>
            <p className="mt-2 text-sm text-slate-300">
              Trace deploys, incidents, and heroic fixes as JSON logs rendered beautifully.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <Joystick className="h-5 w-5 text-blue-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-100">Mini demos</h3>
            <p className="mt-2 text-sm text-slate-300">
              Launch live experiments for rate limiters, pub/sub, and broadcast systems.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <NotebookPen className="h-5 w-5 text-blue-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-100">Deep dives</h3>
            <p className="mt-2 text-sm text-slate-300">
              Read engineering notes that inspired blogs, talks, and community workshops.
            </p>
          </div>
        </div>
      </section>

      <section id="projects" className="border-t border-slate-500/10 bg-slate-950/50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Projects</p>
              <h2 className="text-3xl font-semibold text-slate-100">Latest experiments</h2>
            </div>
            <p className="max-w-xl text-sm text-slate-300">
              Each project emphasises resilience, observability, and developer experience.
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <article key={project.title} className="glass-card flex h-full flex-col rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-slate-100">{project.title}</h3>
                <p className="mt-3 text-sm text-slate-300">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-400">
                  {project.tech.map((tech) => (
                    <span key={tech} className="rounded-full border border-slate-500/30 px-3 py-1">
                      {tech}
                    </span>
                  ))}
                </div>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 hover:text-blue-200"
                >
                  Inspect repository
                  <ArrowRight className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="demos" className="border-t border-slate-500/10">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Playground</p>
              <h2 className="text-3xl font-semibold text-slate-100">Mini demos</h2>
            </div>
            <p className="max-w-xl text-sm text-slate-300">
              Quick simulations of the tooling I use to reason about resilience and broadcast guarantees.
            </p>
          </div>
          <div className="mt-8">
            <MiniDemos />
          </div>
        </div>
      </section>

      <section className="border-t border-slate-500/10 bg-slate-950/50">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center">
          <div className="glass-card rounded-3xl p-12">
            <h2 className="text-3xl font-semibold text-slate-100">Want to test the systems?</h2>
            <p className="mt-4 max-w-2xl text-sm text-slate-300">
              The Code Challenge Arena simulates real-world constraints—rate limits, latency budgets, and multi-service
              choreography. Submit your solution and climb the leaderboard.
            </p>
            <Link
              href={{ pathname: "/arena" as Route }}
              className="glass-card glass-hover mt-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-100 shadow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25"
            >
              Launch arena
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
