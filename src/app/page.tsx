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
    <div className="relative isolate overflow-hidden bg-slate-950 text-slate-50">
      <div className="absolute inset-x-0 top-0 -z-10 h-[600px] bg-gradient-to-br from-blue-500/40 via-purple-500/20 to-transparent blur-3xl" />

      <section className="mx-auto flex max-w-4xl flex-col items-center px-4 pb-24 pt-32 text-center md:pt-40">
        <p className="text-sm uppercase tracking-[0.35em] text-blue-200">
          Associate Software Engineer
        </p>
        <h1 className="mt-6 text-5xl font-semibold leading-tight text-white md:text-6xl">
          Devansh Dubey
        </h1>
        <p className="mt-6 max-w-2xl text-xl text-slate-300">
          Building resilient systems and empowering developers through thoughtful engineering.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href={{ pathname: "/recruiter" }}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            For Recruiters
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={{ pathname: "/engineer" }}
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
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
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:-translate-y-1 hover:border-white/25"
            >
              <div className="flex flex-col gap-4">
                <Icon className="h-8 w-8 text-white/60" />
                <h2 className="text-2xl font-semibold text-white">{title}</h2>
                <p className="text-slate-300">{description}</p>
                <div className="inline-flex items-center gap-2 text-sm font-medium text-blue-200 group-hover:text-blue-100">
                  Explore
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>



      <section className="mx-auto max-w-4xl px-4 pb-24 text-center">
        <h2 className="text-4xl font-semibold text-white">Let&apos;s build something together</h2>
        <p className="mt-4 text-xl text-slate-300">
          I&apos;m always open to discussing new opportunities and interesting projects.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
        href={{ pathname: "/community" }}
        className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
        Join Community
        <Users className="h-4 w-4" />
          </Link>
          <a
        href="mailto:hello@devanshdubey.com"
        className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
          >
        Get in touch
          </a>
        </div>
      </section>
    </div>
  );
}
