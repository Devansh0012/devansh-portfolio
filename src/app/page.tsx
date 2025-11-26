import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, TerminalSquare, Trophy, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/Button";
import { GravityStarsBackground } from "@/components/animate-ui/components/backgrounds/gravity-stars";
import { IntroScreen } from "@/components/IntroScreen";

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
    <IntroScreen>
      <div className="relative isolate min-h-screen bg-black text-white">
        <GravityStarsBackground className="absolute inset-0 -z-10" starsCount={100} starsSize={2} />
        <section className="mx-auto flex max-w-4xl flex-col items-center px-4 pb-24 pt-32 text-center md:pt-40">
          <p className="text-sm uppercase tracking-[0.35em] text-neutral-400">
            Software Development Engineer
          </p>
        <h1 className="text-glow mt-6 text-5xl font-semibold leading-tight text-white md:text-6xl">
          Devansh Dubey
        </h1>
        <p className="mt-6 max-w-2xl text-xl text-neutral-300">
          Building resilient systems and empowering developers through thoughtful engineering.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href={{ pathname: "/recruiter" }}>
            <Button variant="primary" size="md">
              For Recruiters
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={{ pathname: "/engineer" }}>
            <Button variant="secondary" size="md">
              For Engineers
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="grid gap-8 md:grid-cols-2">
          {modes.map(({ title, description, href, icon: Icon }) => (
            <Link key={title} href={{ pathname: href }}>
              <CardSpotlight className="group relative overflow-hidden p-8 transition-all duration-500 hover:-translate-y-1" radius={400} color="#0a0a0a">
                <BorderBeam size={200} duration={12} delay={0} colorFrom="#ffffff" colorTo="#737373" />
                <div className="relative z-20 flex flex-col gap-4">
                  <Icon className="h-8 w-8 text-white" />
                  <h2 className="text-2xl font-semibold text-white">{title}</h2>
                  <p className="text-neutral-400">{description}</p>
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">
                    Explore
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </CardSpotlight>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-24 text-center">
        <CardSpotlight className="relative overflow-hidden p-12" radius={500} color="#0a0a0a">
          <BorderBeam size={250} duration={15} delay={0} colorFrom="#ffffff" colorTo="#525252" />
          <div className="relative z-20">
            <h2 className="text-4xl font-semibold text-white">Let&apos;s build something together</h2>
            <p className="mt-4 text-xl text-neutral-300">
              I&apos;m always open to discussing new opportunities and interesting projects.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href={{ pathname: "/community" }}>
                <Button variant="primary" size="md">
                  Join Community
                  <Users className="h-4 w-4" />
                </Button>
              </Link>
              <a href="mailto:work@devanshdubey.com">
                <Button variant="secondary" size="md">
                  Get in touch
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </CardSpotlight>
      </section>
    </div>
    </IntroScreen>
  );
}
