import type { Metadata } from "next";
import Link from "next/link";
import SubscriptionForm from "@/components/SubscriptionForm";

export const metadata: Metadata = {
  title: "Community Mode",
  description: "Join Devansh's developer community for workshops, newsletters, and upcoming events.",
};

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex max-w-4xl flex-col gap-6 px-4 pb-24 pt-24 text-center">
        <div className="inline-flex w-fit items-center self-center rounded-full border border-slate-700/60 bg-slate-900/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Community
        </div>
        <h1 className="text-4xl font-semibold sm:text-5xl">Build, learn, and ship together.</h1>
        <p className="text-sm text-slate-400">
          Community mode is where we share deep dives before they hit the blog, run mini-workshops on distributed
          systems, and co-design ambitious hackathon projects. The full portal is shipping soon—get on the early list
          and you&apos;ll be the first to know when we open the doors.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-800/60 bg-slate-900/70 p-6 text-left">
            <h2 className="text-lg font-semibold text-slate-100">What&apos;s coming</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>• Monthly live teardown sessions on resiliency patterns.</li>
              <li>• Async book club on systems design and developer tooling.</li>
              <li>• Early invites to community-led hackathons and AMAs.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-800/60 bg-slate-900/70 p-6 text-left">
            <h2 className="text-lg font-semibold text-slate-100">Join the waitlist</h2>
            <div className="mt-3">
              <SubscriptionForm 
                type="community" 
                placeholder="you@amazingteam.com"
                buttonText="Notify me"
              />
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3 text-sm text-slate-400">
          <p>In the meantime, explore:</p>
          <Link href="/blog" className="inline-flex items-center gap-2 rounded-full border border-slate-800 px-4 py-2 font-semibold text-slate-200 transition hover:border-slate-600">
            Blog
          </Link>
          <Link href="/arena" className="inline-flex items-center gap-2 rounded-full border border-slate-800 px-4 py-2 font-semibold text-slate-200 transition hover:border-slate-600">
            Code Arena
          </Link>
          <a
            href="mailto:devanshdubey0012@gmail.com"
            className="inline-flex items-center gap-2 rounded-full border border-slate-800 px-4 py-2 font-semibold text-slate-200 transition hover:border-slate-600"
          >
            Say hello
          </a>
        </div>
      </section>
    </div>
  );
}
