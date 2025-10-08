import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, TerminalSquare, Trophy, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const modes = [
  {
    title: "Recruiter Mode",
    description: "Snapshot of impact, team leadership, and case studies tailored for hiring conversations.",
    href: "/recruiter",
    icon: Trophy,
  },
  {
    title: "Engineer Mode",
    description: "Interactive terminal, engineering logs, and demos that dive into systems design decisions.",
    href: "/engineer",
    icon: TerminalSquare,
  },
] satisfies Array<{ title: string; description: string; href: Route; icon: LucideIcon }>;

export default function HomePage() {
  return (
    <div className="relative isolate min-h-screen text-slate-100">
      <div className="absolute inset-x-0 top-0 -z-10 h-[600px] bg-gradient-to-br from-blue-500/20 via-violet-500/10 to-transparent blur-3xl" />

      <section className="mx-auto flex max-w-4xl flex-col items-center px-4 pb-24 pt-32 text-center md:pt-40">
        <p className="text-sm uppercase tracking-[0.35em] text-blue-300">
          Associate Software Engineer
        </p>
        <h1 className="text-glow mt-6 text-5xl font-semibold leading-tight text-slate-100 md:text-6xl">
          Devansh Dubey
        </h1>
        <p className="mt-6 max-w-2xl text-xl text-slate-300">
          Building resilient systems and empowering developers through thoughtful engineering.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href={{ pathname: "/recruiter" }}
            className="glass-card glass-hover inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-slate-100 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25"
          >
            For Recruiters
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={{ pathname: "/engineer" }}
            className="inline-flex items-center gap-2 rounded-full border border-slate-500/30 px-6 py-3 text-sm font-semibold text-slate-100 transition-all duration-300 hover:border-slate-400 hover:bg-slate-700/20"
          >
            For Engineers
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="grid gap-8 md:grid-cols-2">
          {modes.map(({ title, description, href, icon: Icon }) => (
            <Link
              key={title}
              href={{ pathname: href }}
              className="glass-card glass-hover group overflow-hidden rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="flex flex-col gap-4">
                <Icon className="h-8 w-8 text-blue-400" />
                <h2 className="text-2xl font-semibold text-slate-100">{title}</h2>
                <p className="text-slate-300">{description}</p>
                <div className="inline-flex items-center gap-2 text-sm font-medium text-blue-300 group-hover:text-blue-200">
                  Explore
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-24 text-center">
        <div className="glass-card rounded-3xl p-12">
          <h2 className="text-4xl font-semibold text-slate-100">Let&apos;s build something together</h2>
          <p className="mt-4 text-xl text-slate-300">
            I&apos;m always open to discussing new opportunities and interesting projects.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={{ pathname: "/community" }}
              className="glass-hover inline-flex items-center gap-2 rounded-full border border-blue-500/50 bg-blue-500/20 px-6 py-3 text-sm font-semibold text-slate-100 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25"
            >
              Join Community
              <Users className="h-4 w-4" />
            </Link>
            <a
              href="mailto:work@devanshdubey.com"
              className="inline-flex items-center gap-2 rounded-full border border-slate-500/30 px-6 py-3 text-sm font-semibold text-slate-100 transition-all duration-300 hover:border-slate-400 hover:bg-slate-700/20"
            >
              Get in touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
