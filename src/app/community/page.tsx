import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SubscriptionForm from "@/components/SubscriptionForm";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { BorderBeam } from "@/components/ui/border-beam";
import { SiteBackground } from "@/components/SiteBackground";
import { mailto } from "@/lib/site";

export const metadata: Metadata = {
  title: "Community Mode",
  description: "Join Devansh's developer community for workshops, newsletters, and upcoming events.",
};

const whatsComing = [
  "Monthly live teardown sessions on resiliency patterns.",
  "Async book club on systems design and developer tooling.",
  "Early invites to community-led hackathons and AMAs.",
];

export default function CommunityPage() {
  return (
    <div className="relative bg-black text-white">
      <SiteBackground />

      <section className="mx-auto flex max-w-4xl flex-col gap-6 px-4 pb-20 pt-24 text-center">
        <p className="inline-flex w-fit items-center self-center rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
          Community
        </p>
        <h1 className="text-glow text-4xl font-semibold sm:text-5xl">
          Build, learn, and ship together.
        </h1>
        <p className="measure mx-auto text-base text-neutral-300">
          Community mode is where we share deep dives before they hit the blog, run mini-workshops
          on distributed systems, and co-design ambitious hackathon projects.
        </p>

        {/* Setting the expectation explicitly. "Shipping soon" with no shape to
            it asks someone to hand over an email address against an unknown —
            saying what arrives, and roughly when, is what makes the ask
            answerable. */}
        <p className="mx-auto inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-neutral-400">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Not open yet — the waitlist gets first access, and nothing else until then
        </p>

        <div className="mt-6 grid gap-4 text-left sm:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-semibold text-white">What&apos;s coming</h2>
            <ul className="mt-4 space-y-3 text-sm text-neutral-400">
              {whatsComing.map((item) => (
                <li key={item} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-[0.45rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-white/60"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* The single animated card on the page, because it holds the single
              action the page exists for (Von Restorff Effect). */}
          <CardSpotlight className="relative overflow-hidden rounded-3xl p-6" radius={350} color="#0a0a0a">
            <BorderBeam size={180} duration={13} delay={0} colorFrom="#ffffff" colorTo="#737373" />
            <div className="relative z-20">
              <h2 className="text-lg font-semibold text-white">Join the waitlist</h2>
              <p className="mt-2 text-sm text-neutral-400">
                One email when the doors open. That&apos;s the whole commitment.
              </p>
              <div className="mt-4">
                <SubscriptionForm type="community" buttonText="Notify me" />
              </div>
            </div>
          </CardSpotlight>
        </div>

        <div className="mt-10">
          <p className="text-sm text-neutral-500">In the meantime</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
            {[
              { label: "Read the blog", href: "/blog" as const },
              { label: "Try the demos", href: "/demos" as const },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 font-semibold text-white hover:border-white/40 hover:bg-white/10"
              >
                {item.label}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            ))}
            <a
              href={mailto("Hello from the community page")}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 font-semibold text-white hover:border-white/40 hover:bg-white/10"
            >
              Say hello
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
