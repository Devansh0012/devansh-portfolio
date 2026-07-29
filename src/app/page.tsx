import Link from "next/link";
import type { Route } from "next";
import {
  ArrowRight,
  BookOpen,
  FlaskConical,
  TerminalSquare,
  Trophy,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { BorderBeam } from "@/components/ui/border-beam";
import { buttonVariants } from "@/components/ui/Button";
import { SiteBackground } from "@/components/SiteBackground";
import { IntroScreen } from "@/components/IntroScreen";
import { SITE, mailto } from "@/lib/site";

/**
 * The landing page asks the visitor to make exactly one decision: which version
 * of this portfolio is for them.
 *
 * That choice is presented once, as two rich cards, rather than twice — the
 * previous layout offered "For Recruiters / For Engineers" buttons in the hero
 * and then repeated the identical pair as cards immediately below. Duplicated
 * options cost decision time without adding information (Hick's Law), and a
 * repeated control makes a visitor wonder whether the two lead somewhere
 * different (Occam's Razor).
 *
 * The cards below the fold are now genuinely different destinations, so
 * scrolling reveals new choices instead of the same ones twice.
 */

type Destination = {
  title: string;
  description: string;
  meta: string;
  href: Route;
  icon: LucideIcon;
};

const modes: Destination[] = [
  {
    title: "Recruiter mode",
    description:
      "Impact at Palo Alto Networks, Portkey AI, and Docxster — roles, outcomes, and focused case studies.",
    meta: "≈ 4 min read",
    href: "/recruiter" as Route,
    icon: Trophy,
  },
  {
    title: "Engineer mode",
    description:
      "A real command console: inspect the stack, browse a virtual filesystem, and launch systems demos.",
    meta: "Interactive",
    href: "/engineer" as Route,
    icon: TerminalSquare,
  },
];

const secondary: Destination[] = [
  {
    title: "Blog",
    description: "Production incidents, design docs, and honest retrospectives.",
    meta: "Deep dives",
    href: "/blog" as Route,
    icon: BookOpen,
  },
  {
    title: "Demos",
    description: "Rate limiters, Fourier transforms, sorting, and prime spirals — all in-browser.",
    meta: "5 labs",
    href: "/demos" as Route,
    icon: FlaskConical,
  },
  {
    title: "Community",
    description: "Workshops, teardowns, and a newsletter for people building infrastructure.",
    meta: "Waitlist open",
    href: "/community" as Route,
    icon: Users,
  },
];

/* Credibility above the fold. A visitor deciding whether to keep reading wants
   evidence, not adjectives — and putting it first exploits the strongest half
   of the Serial Position Effect. */
const proofPoints = [
  { value: "Palo Alto Networks", label: "Current role" },
  { value: "AI gateway + MCP", label: "Systems shipped" },
  { value: "NASA Space Apps", label: "Recognition" },
];

export default function HomePage() {
  return (
    <IntroScreen>
      <div className="relative isolate bg-black text-white">
        <SiteBackground />

        <section className="mx-auto flex max-w-4xl flex-col items-center px-4 pb-16 pt-24 text-center md:pt-32">
          <p className="text-sm uppercase tracking-[0.35em] text-neutral-400">{SITE.role}</p>
          <h1 className="text-glow mt-6 text-5xl font-semibold leading-tight text-white md:text-6xl">
            {SITE.name}
          </h1>
          <p className="mt-6 max-w-2xl text-xl text-neutral-300">
            Building production AI gateways, MCP infrastructure, and the reliability layers
            between models, tools, and developers.
          </p>

          <dl className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
            {proofPoints.map((point) => (
              /* Law of Common Region: one bounded strip, hairline-divided, so
                 the three facts read as a single credential block rather than
                 three unrelated statements. */
              <div key={point.label} className="bg-black px-4 py-5">
                <dt className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                  {point.label}
                </dt>
                <dd className="mt-2 text-base font-semibold text-white">{point.value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-12 text-sm text-neutral-500">Pick the tour that fits you</p>
        </section>

        <section aria-labelledby="choose-mode" className="mx-auto max-w-4xl px-4 pb-20">
          <h2 id="choose-mode" className="sr-only">
            Choose how to explore this portfolio
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {modes.map(({ title, description, meta, href, icon: Icon }) => (
              <Link key={title} href={href} className="group rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                <CardSpotlight
                  className="relative h-full overflow-hidden p-8 transition-transform duration-300 group-hover:-translate-y-1"
                  radius={400}
                  color="#0a0a0a"
                >
                  <BorderBeam size={200} duration={12} delay={0} colorFrom="#ffffff" colorTo="#737373" />
                  <div className="relative z-20 flex h-full flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <Icon aria-hidden="true" className="h-8 w-8 text-white" />
                      <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-neutral-400">
                        {meta}
                      </span>
                    </div>
                    <h3 className="text-2xl font-semibold text-white">{title}</h3>
                    <p className="text-neutral-400">{description}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-medium text-neutral-300 transition-colors group-hover:text-white">
                      Explore
                      <ArrowRight
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </CardSpotlight>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="explore-more" className="mx-auto max-w-4xl px-4 pb-20">
          <h2 id="explore-more" className="eyebrow">
            Or go straight to
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {secondary.map(({ title, description, meta, href, icon: Icon }) => (
              <li key={title}>
                {/* Deliberately quieter than the two mode cards above: same
                    shape, lower contrast. Law of Similarity says these read as
                    one family; the weight difference says which matters more. */}
                <Link
                  href={href}
                  className="group flex h-full flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.06]"
                >
                  <Icon aria-hidden="true" className="h-5 w-5 text-neutral-400 transition-colors group-hover:text-white" />
                  <span className="text-lg font-semibold text-white">{title}</span>
                  <span className="text-sm text-neutral-400">{description}</span>
                  <span className="mt-auto pt-2 text-xs uppercase tracking-[0.2em] text-neutral-600">
                    {meta}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Peak-End Rule: the last thing on the page is the one action worth
            remembering, given a single high-contrast treatment nothing else on
            the page competes with (Von Restorff Effect). */}
        <section aria-labelledby="contact-cta" className="mx-auto max-w-4xl px-4 pb-24 text-center">
          <CardSpotlight className="relative overflow-hidden p-12" radius={500} color="#0a0a0a">
            <BorderBeam size={250} duration={15} delay={0} colorFrom="#ffffff" colorTo="#525252" />
            <div className="relative z-20">
              <h2 id="contact-cta" className="text-4xl font-semibold text-white">
                Let&apos;s build something together
              </h2>
              <p className="measure mx-auto mt-4 text-xl text-neutral-300">
                I&apos;m always open to discussing AI infrastructure, developer platforms, and
                ambitious systems work.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a href={mailto("Hello from your portfolio")} className={buttonVariants({ size: "lg" })}>
                  Get in touch
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </a>
                <Link
                  href={{ pathname: "/community" }}
                  className={buttonVariants({ variant: "secondary", size: "lg" })}
                >
                  Join the community
                  <Users aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
              <p className="mt-6 text-sm text-neutral-500">
                Replies usually land within a day or two.
              </p>
            </div>
          </CardSpotlight>
        </section>
      </div>
    </IntroScreen>
  );
}
