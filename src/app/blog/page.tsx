import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/blog";
import SubscriptionForm from "@/components/SubscriptionForm";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { BorderBeam } from "@/components/ui/border-beam";
import BlogContent from "@/components/blog/BlogContent";
import { GravityStarsBackground } from "@/components/animate-ui/components/backgrounds/gravity-stars";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Engineering deep dives, hackathon stories, and behind-the-scenes logs from Devansh Dubey's work.",
};

type BlogSearchParams = { category?: string; tag?: string };

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<BlogSearchParams>;
}) {
  const posts = await getAllPosts();
  if (!posts.length) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;

  return (
    <div className="relative min-h-screen bg-black text-white">
      <GravityStarsBackground className="absolute inset-0 -z-10" starsCount={100} starsSize={2} />
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-20 md:pt-24">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
              Blog
            </p>
            <h1 className="text-glow text-4xl font-semibold md:text-5xl">Stories from the build log</h1>
            <p className="max-w-2xl text-sm text-neutral-300">
              Deep dives from production incidents, design docs, hackathon sprints, and community workshops. Expect
              practical systems design takeaways and honest retrospectives.
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              <a
                href="/rss.xml"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 font-semibold text-neutral-300 transition hover:bg-white/10"
              >
                Subscribe via RSS
              </a>
            </div>
          </div>

          <BlogContent
            posts={posts}
            initialTag={resolvedSearchParams?.tag}
          />
        </div>
      </section>

      <section className="border-t border-white/5 bg-black">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <CardSpotlight className="relative overflow-hidden rounded-3xl p-12" radius={500} color="#0a0a0a">
            <BorderBeam size={250} duration={15} delay={0} colorFrom="#ffffff" colorTo="#525252" />
            <div className="relative z-20">
              <h2 className="text-3xl font-semibold text-white">Get new posts in your inbox</h2>
              <p className="mt-3 text-sm text-neutral-300">
                Monthly digest with engineering deep dives, incident retrospectives, and community events. Zero spam, ever.
              </p>
              <div className="mt-6 max-w-md mx-auto">
                <SubscriptionForm
                  type="blog"
                  placeholder="you@amazingteam.com"
                  buttonText="Subscribe"
                  className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"
                />
              </div>
            </div>
          </CardSpotlight>
        </div>
      </section>
    </div>
  );
}
