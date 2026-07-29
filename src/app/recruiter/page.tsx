import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Award, Briefcase, Download, Linkedin } from "lucide-react";
import {
  communityMetrics,
  education,
  experiences,
  heroHighlights,
  projects,
  skillCategories,
  testimonials,
} from "@/lib/data";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { BorderBeam } from "@/components/ui/border-beam";
import { buttonVariants } from "@/components/ui/Button";
import { SiteBackground } from "@/components/SiteBackground";
import { SectionNav } from "@/components/SectionNav";
import { SITE, mailto } from "@/lib/site";

export const metadata: Metadata = {
  title: "Recruiter Mode",
  description:
    "Devansh Dubey's experience at Palo Alto Networks and Portkey AI building AI gateways, MCP, OAuth, provider integrations, and document infrastructure.",
};

/**
 * Long-form professional page, restructured around three ideas:
 *
 * 1. Chunking. Seven labelled, anchored sections with a sticky index, instead
 *    of one seven-screen scroll a reader can get lost inside.
 * 2. Von Restorff Effect. The animated border beam previously wrapped *every*
 *    card on the page — roughly twenty simultaneous looping animations. When
 *    everything is highlighted nothing is, so the beam is now reserved for the
 *    two cards that genuinely deserve the eye: the credentials panel at the
 *    top and the contact card at the end.
 * 3. Selective Attention. Removing that constant peripheral motion is also
 *    what lets the actual content (roles, outcomes, numbers) land.
 */

const sections = [
  { id: "highlights", label: "Highlights" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Case studies" },
  { id: "skills", label: "Skills" },
  { id: "testimonials", label: "Testimonials" },
  { id: "education", label: "Education" },
  { id: "community", label: "Community" },
];

/** Consistent heading block, so every section is parsed the same way. */
function SectionHeader({
  eyebrow,
  title,
  blurb,
  id,
}: {
  eyebrow: string;
  title: string;
  blurb: string;
  id: string;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={`${id}-heading`} className="mt-2 text-3xl font-semibold text-white">
          {title}
        </h2>
      </div>
      <p className="max-w-xl text-sm text-neutral-400">{blurb}</p>
    </div>
  );
}

/** Shared card shell. One border radius, one border colour, one hover response. */
const cardClass =
  "relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.05]";

const chipClass =
  "rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold text-neutral-300";

export default function RecruiterPage() {
  return (
    <div className="relative bg-black text-white">
      <SiteBackground />

      <section className="mx-auto max-w-6xl px-4 pb-12 pt-16 md:pt-20">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
              <Briefcase aria-hidden="true" className="h-3.5 w-3.5" /> Recruiter mode
            </p>
            <h1 className="text-glow text-4xl font-semibold text-white md:text-5xl">
              Production AI infrastructure, from provider integrations to MCP reliability.
            </h1>
            <p className="max-w-2xl text-lg text-neutral-300">
              I&apos;m {SITE.name}, a Software Engineer at Palo Alto Networks. I joined Portkey AI
              as an SDE-1 Backend engineer and continue building its gateway and protocol layers
              following the acquisition—connecting production applications to models, providers,
              and enterprise tools.
            </p>
            <div className="flex flex-wrap gap-3">
              {/* One primary action. The résumé is what a recruiter came for;
                  everything else on this page is supporting evidence. */}
              <a
                href={SITE.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ size: "md" })}
              >
                <Download aria-hidden="true" className="h-4 w-4" />
                Download résumé
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <a
                href={SITE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "secondary", size: "md" })}
              >
                <Linkedin aria-hidden="true" className="h-4 w-4" />
                Connect on LinkedIn
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>

          <CardSpotlight className="relative overflow-hidden rounded-3xl p-6" radius={300} color="#0a0a0a">
            <BorderBeam size={150} duration={10} delay={0} colorFrom="#ffffff" colorTo="#525252" />
            <div className="relative z-20">
              <p className="eyebrow">Quick stats</p>
              <dl className="mt-6 space-y-5">
                {heroHighlights.map((metric) => (
                  <div key={metric.label}>
                    <dt className="text-xs uppercase tracking-wide text-neutral-500">
                      {metric.label}
                    </dt>
                    <dd>
                      <span className="block text-2xl font-semibold text-white">
                        {metric.value}
                      </span>
                      <span className="block text-sm text-neutral-400">{metric.sublabel}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </CardSpotlight>
        </div>
      </section>

      <SectionNav sections={sections} />

      {/* Highlights ---------------------------------------------------------- */}
      <section id="highlights" aria-labelledby="highlights-heading" className="scroll-mt-32">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <SectionHeader
            id="highlights"
            eyebrow="At a glance"
            title="What I work on"
            blurb="A three-line summary for anyone skimming before they commit to reading."
          />
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "AI gateway infrastructure",
                body: "Provider integrations, routing, and the reliability layer between applications and models.",
              },
              {
                title: "Protocols and auth",
                body: "MCP servers and clients, OAuth 2.1 and OpenID Connect flows for enterprise tooling.",
              },
              {
                title: "Backend and platform",
                body: "Go and TypeScript services on Kubernetes, with the observability to run them.",
              },
            ].map((item) => (
              <li key={item.title} className={cardClass}>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-neutral-400">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Experience ---------------------------------------------------------- */}
      <section id="experience" aria-labelledby="experience-heading" className="scroll-mt-32 bg-black/40">
        <div className="mx-auto max-w-6xl space-y-8 px-4 py-16">
          <SectionHeader
            id="experience"
            eyebrow="Experience"
            title="Roles and impact"
            blurb="Recent work spans AI gateway infrastructure, MCP and OAuth, document automation, and developer-facing product systems."
          />
          <ol className="space-y-6">
            {experiences.map((experience) => (
              <li key={experience.company} className={`${cardClass} rounded-3xl p-8`}>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold text-white">{experience.role}</h3>
                    <p className="text-sm text-neutral-400">
                      {experience.company} · {experience.location} · {experience.start} —{" "}
                      {experience.end}
                    </p>
                    <p className="mt-4 max-w-2xl text-sm text-neutral-300">{experience.summary}</p>
                  </div>
                  <ul className="flex flex-wrap gap-2 md:justify-end">
                    {experience.tech.map((tech) => (
                      <li key={tech} className={chipClass}>
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-neutral-300">
                  {experience.achievements.map((achievement) => (
                    <li key={achievement} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.45rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-white"
                      />
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
                {experience.url && (
                  <a
                    href={experience.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex min-h-[40px] w-fit items-center gap-2 text-sm font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
                  >
                    Explore {experience.company}
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Case studies -------------------------------------------------------- */}
      <section id="projects" aria-labelledby="projects-heading" className="scroll-mt-32">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <SectionHeader
            id="projects"
            eyebrow="Case studies"
            title="Systems and products"
            blurb="Current AI infrastructure work alongside earlier document systems and independent products."
          />
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <li key={project.title} className={`${cardClass} group h-full`}>
                <h3 className="text-xl font-semibold text-white">
                  {/* Stretched link: the entire card is the target, not just
                      the four words at the bottom (Fitts's Law). */}
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="after:absolute after:inset-0 focus-visible:outline-none group-focus-within:underline"
                  >
                    {project.title}
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </h3>
                <p className="mt-3 text-sm text-neutral-300">{project.description}</p>
                {project.highlight && (
                  <p className="mt-3 text-sm font-medium text-neutral-200">{project.highlight}</p>
                )}
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <li key={tech} className={chipClass}>
                      {tech}
                    </li>
                  ))}
                </ul>
                <span
                  aria-hidden="true"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-neutral-300 transition-colors group-hover:text-white"
                >
                  View project
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Skills -------------------------------------------------------------- */}
      <section id="skills" aria-labelledby="skills-heading" className="scroll-mt-32 bg-black/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <SectionHeader
            id="skills"
            eyebrow="Stack"
            title="Tools I reach for"
            blurb="Grouped by role in the system rather than listed alphabetically, so the shape of the stack is readable at a glance."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {skillCategories.map((category) => (
              <div key={category.title} className={cardClass}>
                <h3 className="text-lg font-semibold text-white">{category.title}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <li key={item} className={chipClass}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials -------------------------------------------------------- */}
      <section id="testimonials" aria-labelledby="testimonials-heading" className="scroll-mt-32">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <SectionHeader
            id="testimonials"
            eyebrow="Testimonials"
            title="Trusted by leaders"
            blurb="Feedback from partners and leadership teams across enterprise and community projects."
          />
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <li key={testimonial.name} className={cardClass}>
                <figure>
                  <Award aria-hidden="true" className="h-6 w-6 text-white" />
                  <blockquote className="mt-4 text-sm leading-relaxed text-neutral-300">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4 text-sm font-semibold text-white">
                    {testimonial.name}
                    <span className="block text-xs font-normal text-neutral-500">
                      {testimonial.title}
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Education ----------------------------------------------------------- */}
      <section id="education" aria-labelledby="education-heading" className="scroll-mt-32 bg-black/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <SectionHeader
            id="education"
            eyebrow="Education"
            title="Academic foundation"
            blurb="Information Technology graduate with a foundation in algorithms, systems, and applied engineering."
          />
          <ul className="mt-8 grid gap-6">
            {education.map((item) => (
              <li key={item.degree} className={cardClass}>
                <div className="md:flex md:items-start md:justify-between md:gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{item.degree}</h3>
                    <p className="mt-2 text-sm text-neutral-300">{item.institution}</p>
                    <p className="text-sm text-neutral-500">
                      {item.university} · Class of {item.graduation}
                    </p>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-2 md:mt-0 md:justify-end">
                    {item.highlights.map((highlight) => (
                      <li key={highlight} className={chipClass}>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Community ----------------------------------------------------------- */}
      <section id="community" aria-labelledby="community-heading" className="scroll-mt-32">
        <div className="mx-auto max-w-6xl space-y-8 px-4 py-16">
          <SectionHeader
            id="community"
            eyebrow="Community impact"
            title="Beyond the 9 → 5"
            blurb="Empowering the developer community is a core value. Here's how I give back."
          />
          <dl className="grid gap-6 md:grid-cols-3">
            {communityMetrics.map((metric) => (
              <div key={metric.label} className={`${cardClass} text-center`}>
                <dt className="eyebrow">{metric.label}</dt>
                <dd>
                  <span className="mt-3 block text-3xl font-semibold text-white">
                    {metric.value}
                  </span>
                  <span className="mt-2 block text-sm text-neutral-400">{metric.sublabel}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Peak-End Rule: the end of a long page is disproportionately what gets
          remembered, so it gets the page's only other animated card and its
          single clearest next step. */}
      <section aria-labelledby="recruiter-cta" className="px-4 pb-24">
        <div className="mx-auto max-w-4xl text-center">
          <CardSpotlight className="relative overflow-hidden rounded-3xl p-12" radius={500} color="#0a0a0a">
            <BorderBeam size={250} duration={15} delay={0} colorFrom="#ffffff" colorTo="#525252" />
            <div className="relative z-20">
              <h2 id="recruiter-cta" className="text-3xl font-semibold text-white">
                Let&apos;s explore what we can build together
              </h2>
              <p className="measure mx-auto mt-4 text-sm text-neutral-300">
                If you&apos;re building AI infrastructure, developer platforms, or distributed
                product systems, I&apos;d love to compare notes.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href={mailto("Opportunity for Devansh Dubey")}
                  className={buttonVariants({ size: "md" })}
                >
                  Start a conversation
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </a>
                <Link
                  href={{ pathname: "/demos" }}
                  className={buttonVariants({ variant: "secondary", size: "md" })}
                >
                  See the engineering demos
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
              <p className="mt-6 text-sm text-neutral-500">
                Or email {SITE.email} directly.
              </p>
            </div>
          </CardSpotlight>
        </div>
      </section>
    </div>
  );
}
