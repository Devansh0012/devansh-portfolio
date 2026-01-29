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
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/Button";
import { GravityStarsBackground } from "@/components/animate-ui/components/backgrounds/gravity-stars";

export const metadata: Metadata = {
  title: "Recruiter Mode",
  description:
    "Overview of Devansh Dubey's professional experience, case studies, testimonials, and hiring information.",
};

export default function RecruiterPage() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <GravityStarsBackground className="absolute inset-0 -z-10" starsCount={100} starsSize={2} />
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-20 md:pt-24">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
              <Briefcase className="h-3.5 w-3.5" /> Recruiter mode
            </p>
            <h1 className="text-glow text-4xl font-semibold text-white md:text-5xl">
              Precision-engineered backends, meticulous execution, empathetic leadership.
            </h1>
            <p className="max-w-2xl text-lg text-neutral-300">
              I&apos;m Devansh Dubey, a Software Engineer at Docxster. I design distributed systems that stay
              resilient under pressure, mentor developers to ship faster, and bring hackathon energy into every product
              cycle.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://drive.google.com/file/d/1aVRmVG6UTHH9mZdqqRURRYZ4F0LLBrrW/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                <Button variant="primary" size="md">
                  <Download className="h-4 w-4" /> Download resume
                </Button>
              </a>
              <a
                href="https://www.linkedin.com/in/devanshdubey1/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="md">
                  <Linkedin className="h-4 w-4" /> Connect on LinkedIn
                </Button>
              </a>
            </div>
          </div>
          <CardSpotlight className="relative overflow-hidden rounded-3xl p-6" radius={300} color="#0a0a0a">
            <BorderBeam size={150} duration={10} delay={0} colorFrom="#ffffff" colorTo="#525252" />
            <div className="relative z-20">
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Quick stats</p>
              <div className="mt-6 space-y-5">
                {heroHighlights.map((metric) => (
                  <div key={metric.label}>
                    <p className="text-xs uppercase tracking-wide text-neutral-500">{metric.label}</p>
                    <p className="text-2xl font-semibold text-white">{metric.value}</p>
                    <p className="text-sm text-neutral-400">{metric.sublabel}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardSpotlight>
        </div>
      </section>

      <section className="text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-8 md:grid-cols-2">
            {skillCategories.map((category, idx) => (
              <CardSpotlight key={category.title} className="relative overflow-hidden rounded-2xl p-6" radius={350} color="#0a0a0a">
                <BorderBeam size={180} duration={11 + idx} delay={idx * 0.5} colorFrom="#ffffff" colorTo="#737373" />
                <div className="relative z-20">
                  <h2 className="text-lg font-semibold text-white">{category.title}</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {category.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-sm font-medium text-neutral-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </CardSpotlight>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black/30">
        <div className="mx-auto max-w-6xl space-y-12 px-4 py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Experience</p>
              <h2 className="text-3xl font-semibold text-white">Roles and impact</h2>
            </div>
            <p className="max-w-xl text-sm text-neutral-400">
              Every engagement pairs technical rigor with measurable business outcomes. Here are highlights from the last
              few years.
            </p>
          </div>
          <div className="space-y-8">
            {experiences.map((experience, idx) => (
              <CardSpotlight
                key={experience.company}
                className="relative overflow-hidden rounded-3xl p-8"
                radius={400}
                color="#0a0a0a"
              >
                <BorderBeam size={220} duration={13 + idx} delay={idx * 0.3} colorFrom="#ffffff" colorTo="#525252" />
                <div className="relative z-20 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold text-white">{experience.role}</h3>
                    <p className="text-sm text-neutral-400">
                      {experience.company} · {experience.location} · {experience.start} — {experience.end}
                    </p>
                    <p className="mt-4 text-sm text-neutral-300">{experience.summary}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {experience.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold text-neutral-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <ul className="relative z-20 mt-6 space-y-3 text-sm text-neutral-300">
                  {experience.achievements.map((achievement) => (
                    <li key={achievement} className="flex gap-2">
                      <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-white" />
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
                {experience.url && (
                  <a
                    href={experience.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-20 mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-neutral-300 transition-colors"
                  >
                    Explore the work
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
              </CardSpotlight>
            ))}
          </div>
        </div>
      </section>

      <section className="text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Case studies</p>
              <h2 className="text-3xl font-semibold text-white">Recent projects</h2>
            </div>
            <p className="max-w-xl text-sm text-neutral-400">
              Blend of platform engineering, data-intensive systems, and product velocity.
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {projects.map((project, idx) => (
              <CardSpotlight key={project.title} className="relative flex h-full flex-col overflow-hidden rounded-2xl p-6" radius={350} color="#0a0a0a">
                <BorderBeam size={180} duration={12 + idx} delay={idx * 0.4} colorFrom="#ffffff" colorTo="#737373" />
                <div className="relative z-20 flex h-full flex-col">
                  <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                  <p className="mt-3 text-sm text-neutral-300">{project.description}</p>
                  {project.highlight && (
                    <p className="mt-3 text-sm font-medium text-neutral-200">{project.highlight}</p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-neutral-400">
                    {project.tech.map((tech) => (
                      <span key={tech} className="rounded-full border border-white/20 bg-white/5 px-3 py-1 shadow-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-neutral-300 transition-colors"
                  >
                    View project
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </CardSpotlight>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black/30 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Testimonials</p>
              <h2 className="text-3xl font-semibold text-white">Trusted by leaders</h2>
            </div>
            <p className="max-w-xl text-sm text-neutral-400">
              Feedback from partners and leadership teams across enterprise and community projects.
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial, idx) => (
              <CardSpotlight key={testimonial.name} className="relative overflow-hidden rounded-2xl p-6" radius={350} color="#0a0a0a">
                <BorderBeam size={180} duration={14 + idx} delay={idx * 0.5} colorFrom="#ffffff" colorTo="#525252" />
                <figure className="relative z-20">
                  <Award className="h-6 w-6 text-white" />
                  <blockquote className="mt-4 text-sm text-neutral-300">&ldquo;{testimonial.quote}&rdquo;</blockquote>
                  <figcaption className="mt-4 text-sm font-semibold text-white">
                    {testimonial.name}
                    <span className="block text-xs font-normal text-neutral-500">{testimonial.title}</span>
                  </figcaption>
                </figure>
              </CardSpotlight>
            ))}
          </div>
        </div>
      </section>

      <section className="text-white">
        <div className="mx-auto max-w-6xl space-y-8 px-4 py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Community impact</p>
              <h2 className="text-3xl font-semibold text-white">Beyond the 9 → 5</h2>
            </div>
            <p className="max-w-xl text-sm text-neutral-400">
              Empowering the developer community is a core value. Here&apos;s how I give back.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {communityMetrics.map((metric, idx) => (
              <CardSpotlight key={metric.label} className="relative overflow-hidden rounded-2xl p-6 text-center" radius={300} color="#0a0a0a">
                <BorderBeam size={150} duration={10 + idx} delay={idx * 0.3} colorFrom="#ffffff" colorTo="#737373" />
                <div className="relative z-20">
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">{metric.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{metric.value}</p>
                  <p className="mt-2 text-sm text-neutral-400">{metric.sublabel}</p>
                </div>
              </CardSpotlight>
            ))}
          </div>
        </div>
      </section>

      <section className="text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center">
          <CardSpotlight className="relative overflow-hidden rounded-3xl p-12" radius={500} color="#0a0a0a">
            <BorderBeam size={250} duration={15} delay={0} colorFrom="#ffffff" colorTo="#525252" />
            <div className="relative z-20">
              <h2 className="text-3xl font-semibold text-white">Let&apos;s explore what we can build together</h2>
              <p className="mt-4 max-w-2xl text-sm text-neutral-300">
                Whether you need someone to take ownership of complex systems, launch a new product from scratch, or coach a
                team through high-stakes launches, I&apos;d love to chat.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a href="mailto:devanshdubey0012@gmail.com">
                  <Button variant="primary" size="md">
                    Start a conversation
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </a>
                <Link href={{ pathname: "/demos" as Route }}>
                  <Button variant="secondary" size="md">
                    Preview engineer chops
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardSpotlight>
        </div>
      </section>
    </div>
  );
}
