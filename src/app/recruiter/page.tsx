import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { ArrowUpRight, Award, Briefcase, Download, Linkedin } from "lucide-react";
import {
  communityMetrics,
  experiences,
  heroHighlights,
  projects,
  skillCategories,
  testimonials,
} from "@/lib/data";
import SportsStatsShowcase from "@/components/SportsStatsShowcase";
import EconomicDashboard from "@/components/EconomicDashboard";

export const metadata: Metadata = {
  title: "Recruiter Mode",
  description:
    "Overview of Devansh Dubey's professional experience, case studies, testimonials, and hiring information.",
};

export default function RecruiterPage() {
  return (
    <div className="min-h-screen text-slate-100">
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-20 md:pt-24">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-slate-500/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
              <Briefcase className="h-3.5 w-3.5" /> Recruiter mode
            </p>
            <h1 className="text-glow text-4xl font-semibold text-slate-100 md:text-5xl">
              Precision-engineered backends, meticulous execution, empathetic leadership.
            </h1>
            <p className="max-w-2xl text-lg text-slate-300">
              I&apos;m Devansh Dubey, a Software Engineer at Docxster. I design distributed systems that stay
              resilient under pressure, mentor developers to ship faster, and bring hackathon energy into every product
              cycle.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://drive.google.com/file/d/1aVRmVG6UTHH9mZdqqRURRYZ4F0LLBrrW/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card glass-hover inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-100 shadow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25"
                download
              >
                <Download className="h-4 w-4" /> Download resume
              </a>
              <a
                href="https://www.linkedin.com/in/devanshdubey1/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-500/30 px-4 py-2 text-sm font-semibold text-slate-300 transition-all duration-300 hover:border-slate-400 hover:bg-slate-700/20"
              >
                <Linkedin className="h-4 w-4" /> Connect on LinkedIn
              </a>
            </div>
          </div>
          <aside className="glass-card rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Quick stats</p>
            <div className="mt-6 space-y-5">
              {heroHighlights.map((metric) => (
                <div key={metric.label}>
                  <p className="text-xs uppercase tracking-wide text-slate-400">{metric.label}</p>
                  <p className="text-2xl font-semibold text-slate-100">{metric.value}</p>
                  <p className="text-sm text-slate-300">{metric.sublabel}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="text-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-8 md:grid-cols-2">
            {skillCategories.map((category) => (
              <div key={category.title} className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-slate-100">{category.title}</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-slate-500/30 px-3 py-1 text-sm font-medium text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950/50">
        <div className="mx-auto max-w-6xl space-y-12 px-4 py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Experience</p>
              <h2 className="text-3xl font-semibold text-slate-100">Roles and impact</h2>
            </div>
            <p className="max-w-xl text-sm text-slate-300">
              Every engagement pairs technical rigor with measurable business outcomes. Here are highlights from the last
              few years.
            </p>
          </div>
          <div className="space-y-8">
            {experiences.map((experience) => (
              <article
                key={experience.company}
                className="glass-card rounded-3xl p-8"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-100">{experience.role}</h3>
                    <p className="text-sm text-slate-300">
                      {experience.company} · {experience.location} · {experience.start} — {experience.end}
                    </p>
                    <p className="mt-4 text-sm text-slate-300">{experience.summary}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {experience.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-slate-500/30 px-3 py-1 text-xs font-semibold text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-slate-300">
                  {experience.achievements.map((achievement) => (
                    <li key={achievement} className="flex gap-2">
                      <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-blue-400" />
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
                {experience.url && (
                  <a
                    href={experience.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 hover:text-blue-200"
                  >
                    Explore the work
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="text-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Case studies</p>
              <h2 className="text-3xl font-semibold text-slate-100">Recent projects</h2>
            </div>
            <p className="max-w-xl text-sm text-slate-300">
              Blend of platform engineering, data-intensive systems, and product velocity.
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <article key={project.title} className="glass-card flex h-full flex-col rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-slate-100">{project.title}</h3>
                <p className="mt-3 text-sm text-slate-300">{project.description}</p>
                {project.highlight && (
                  <p className="mt-3 text-sm font-medium text-slate-200">{project.highlight}</p>
                )}
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-400">
                  {project.tech.map((tech) => (
                    <span key={tech} className="rounded-full bg-slate-700/30 px-3 py-1 shadow-sm">
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
                  View project
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950/50 text-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <SportsStatsShowcase />
        </div>
      </section>

      <section className="bg-slate-900/50 text-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <EconomicDashboard />
        </div>
      </section>

      <section className="bg-slate-950/50 text-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Testimonials</p>
              <h2 className="text-3xl font-semibold text-slate-100">Trusted by leaders</h2>
            </div>
            <p className="max-w-xl text-sm text-slate-300">
              Feedback from partners and leadership teams across enterprise and community projects.
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <figure key={testimonial.name} className="glass-card rounded-2xl p-6">
                <Award className="h-6 w-6 text-blue-400" />
                <blockquote className="mt-4 text-sm text-slate-300">&ldquo;{testimonial.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-slate-100">
                  {testimonial.name}
                  <span className="block text-xs font-normal text-slate-400">{testimonial.title}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="text-slate-100">
        <div className="mx-auto max-w-6xl space-y-8 px-4 py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Community impact</p>
              <h2 className="text-3xl font-semibold text-slate-100">Beyond the 9 → 5</h2>
            </div>
            <p className="max-w-xl text-sm text-slate-300">
              Empowering the developer community is a core value. Here&apos;s how I give back.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {communityMetrics.map((metric) => (
              <div key={metric.label} className="glass-card rounded-2xl p-6 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{metric.label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-100">{metric.value}</p>
                <p className="mt-2 text-sm text-slate-300">{metric.sublabel}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="text-slate-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center">
          <div className="glass-card rounded-3xl p-12">
            <h2 className="text-3xl font-semibold text-slate-100">Let&apos;s explore what we can build together</h2>
            <p className="mt-4 max-w-2xl text-sm text-slate-300">
              Whether you need someone to take ownership of complex systems, launch a new product from scratch, or coach a
              team through high-stakes launches, I&apos;d love to chat.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="mailto:devanshdubey0012@gmail.com"
                className="glass-card glass-hover inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-100 shadow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25"
              >
                Start a conversation
              </a>
              <Link
                href={{ pathname: "/arena" as Route }}
                className="inline-flex items-center gap-2 rounded-full border border-slate-500/30 px-4 py-2 text-sm font-semibold text-slate-300 transition-all duration-300 hover:border-slate-400 hover:bg-slate-700/20"
              >
                Preview engineer chops
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
