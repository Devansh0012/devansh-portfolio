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

export const metadata: Metadata = {
  title: "Recruiter Mode",
  description:
    "Overview of Devansh Dubey's professional experience, case studies, testimonials, and hiring information.",
};

export default function RecruiterPage() {
  return (
    <div className="bg-slate-900 text-slate-50">
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-20 md:pt-24">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_320px]"><div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              <Briefcase className="h-3.5 w-3.5" /> Recruiter mode
            </p>
            <h1 className="text-4xl font-semibold md:text-5xl">
              Precision-engineered backends, meticulous execution, empathetic leadership.
            </h1>
            <p className="max-w-2xl text-lg text-white/80">
              I&apos;m Devansh Dubey, a Software Engineer at Docxster. I design distributed systems that stay
              resilient under pressure, mentor developers to ship faster, and bring hackathon energy into every product
              cycle.
            </p>
            <div className="flex flex-wrap gap-3">
                <a
                href="https://drive.google.com/file/d/1mARtyWBZIIXVIuGLG9FT9tzj0MtBNZ-H/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow transition hover:-translate-y-0.5 hover:shadow-lg"
                download
                >
                <Download className="h-4 w-4" /> Download resume
                </a>
              <a
                href="https://www.linkedin.com/in/devanshdubey1/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-white hover:bg-white/10"
              >
                <Linkedin className="h-4 w-4" /> Connect on LinkedIn
              </a>
            </div>
          </div>
          <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">Quick stats</p>
            <div className="mt-6 space-y-5">
              {heroHighlights.map((metric) => (
                <div key={metric.label}>
                  <p className="text-xs uppercase tracking-wide text-white/60">{metric.label}</p>
                  <p className="text-2xl font-semibold text-white">{metric.value}</p>
                  <p className="text-sm text-white/70">{metric.sublabel}</p>
                </div>
              ))}
            </div>
          </aside></div>
      </section>

      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-8 md:grid-cols-2">
        {skillCategories.map((category) => (
          <div key={category.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-lg font-semibold text-white">{category.title}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
          {category.items.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/20 px-3 py-1 text-sm font-medium text-white/70"
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

      <section className="bg-slate-950">
        <div className="mx-auto max-w-6xl space-y-12 px-4 py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Experience</p>
              <h2 className="text-3xl font-semibold text-white">Roles and impact</h2>
            </div>
            <p className="max-w-xl text-sm text-white/70">
              Every engagement pairs technical rigor with measurable business outcomes. Here are highlights from the last
              few years.
            </p>
          </div>
          <div className="space-y-8">
            {experiences.map((experience) => (
              <article
                key={experience.company}
                className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold text-white">{experience.role}</h3>
                    <p className="text-sm text-white/70">
                      {experience.company} · {experience.location} · {experience.start} — {experience.end}
                    </p>
                    <p className="mt-4 text-sm text-white/80">{experience.summary}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {experience.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white/70"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-white/80">
                  {experience.achievements.map((achievement) => (
                    <li key={achievement} className="flex gap-2">
                      <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-blue-300" />
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
                {experience.url && (
                  <a
                    href={experience.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-200"
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

      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Case studies</p>
              <h2 className="text-3xl font-semibold">Recent projects</h2>
            </div>
            <p className="max-w-xl text-sm text-white/70">
              Blend of platform engineering, data-intensive systems, and product velocity.
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <article key={project.title} className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                <p className="mt-3 text-sm text-white/70">{project.description}</p>
                {project.highlight && (
                  <p className="mt-3 text-sm font-medium text-white/80">{project.highlight}</p>
                )}
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-white/60">
                  {project.tech.map((tech) => (
                    <span key={tech} className="rounded-full bg-white/10 px-3 py-1 shadow-sm">
                      {tech}
                    </span>
                  ))}
                </div>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white"
                >
                  View project
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Testimonials</p>
              <h2 className="text-3xl font-semibold">Trusted by leaders</h2>
            </div>
            <p className="max-w-xl text-sm text-white/70">
              Feedback from partners and leadership teams across enterprise and community projects.
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <figure key={testimonial.name} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <Award className="h-6 w-6 text-blue-200" />
                <blockquote className="mt-4 text-sm text-white/80">&ldquo;{testimonial.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 text-sm font-semibold">
                  {testimonial.name}
                  <span className="block text-xs font-normal text-white/60">{testimonial.title}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl space-y-8 px-4 py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Community impact</p>
              <h2 className="text-3xl font-semibold">Beyond the 9 → 5</h2>
            </div>
            <p className="max-w-xl text-sm text-white/70">
              Empowering the developer community is a core value. Here&apos;s how I give back.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {communityMetrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">{metric.label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{metric.value}</p>
                <p className="mt-2 text-sm text-white/70">{metric.sublabel}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center">
          <h2 className="text-3xl font-semibold">Let&apos;s explore what we can build together</h2>
          <p className="max-w-2xl text-sm text-white/70">
            Whether you need someone to take ownership of complex systems, launch a new product from scratch, or coach a
            team through high-stakes launches, I&apos;d love to chat.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="mailto:hello@devanshdubey.com"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Start a conversation
            </a>
            <Link
              href={{ pathname: "/arena" as Route }}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-white hover:bg-white/10"
            >
              Preview engineer chops
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
