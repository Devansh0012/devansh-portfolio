import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Engineering deep dives, hackathon stories, and behind-the-scenes logs from Devansh Dubey's work.",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

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

  const categories = Array.from(new Set(posts.map((post) => post.category)));
  const resolvedSearchParams = await searchParams;
  const activeCategory = resolvedSearchParams?.category;
  const activeTag = resolvedSearchParams?.tag;

  const filteredPosts = posts.filter((post) => {
    const categoryMatch = activeCategory ? post.category === activeCategory : true;
    const tagMatch = activeTag ? post.tags.includes(activeTag) : true;
    return categoryMatch && tagMatch;
  });

  return (
    <div className="bg-gray-950 text-gray-100">
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-20 md:pt-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-900 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
              Blog
            </p>
            <h1 className="text-4xl font-semibold md:text-5xl">Stories from the build log</h1>
            <p className="max-w-2xl text-sm text-gray-400">
              Deep dives from production incidents, design docs, hackathon sprints, and community workshops. Expect
              practical systems design takeaways and honest retrospectives.
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              <a
                href="/rss.xml"
                className="inline-flex items-center gap-2 rounded-full border border-gray-800 px-4 py-2 font-semibold text-gray-300 transition hover:border-gray-700"
              >
                Subscribe via RSS
              </a>
              <Link
                href={{ pathname: "/community" }}
                className="inline-flex items-center gap-2 rounded-full border border-gray-800 px-4 py-2 font-semibold text-gray-300 transition hover:border-gray-700"
              >
                Join the newsletter
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-300">Filter by category</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={{ pathname: "/blog" }}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  activeCategory ? "border-gray-800 text-gray-500" : "border-gray-100 bg-gray-100 text-gray-900"
                }`}
              >
                All posts
              </Link>
              {categories.map((category) => (
                <Link
                  key={category}
                  href={{ pathname: "/blog", query: { category } }}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    activeCategory === category
                      ? "border-gray-100 bg-gray-100 text-gray-900"
                      : "border-gray-800 text-gray-500 hover:border-gray-700"
                  }`}
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-800 bg-gray-900">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-6 md:grid-cols-2">
            {filteredPosts.map((post) => (
              <article key={post.slug} className="flex h-full flex-col rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500">{dateFormatter.format(new Date(post.date))}</p>
                <h2 className="mt-3 text-2xl font-semibold text-gray-100">{post.title}</h2>
                <p className="mt-2 text-sm text-gray-400">{post.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={{ pathname: "/blog", query: { tag } }}
                      className="rounded-full border border-gray-800 bg-gray-900 px-3 py-1 text-xs font-semibold text-gray-400 transition hover:border-gray-700"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
                  <span>{post.readingTime}</span>
                  <Link
                    href={`/blog/${post.slug}` as Route}
                    className="text-sm font-semibold text-gray-100"
                  >
                    Read story →
                  </Link>
                </div>
              </article>
            ))}
          </div>
          {filteredPosts.length === 0 && (
            <div className="rounded-3xl border border-gray-800 bg-gray-950 p-10 text-center">
              <p className="text-sm text-gray-400">No posts found for that filter. Try another category or tag.</p>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-gray-800 bg-gray-950">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h2 className="text-3xl font-semibold text-gray-100">Get new posts in your inbox</h2>
          <p className="mt-3 text-sm text-gray-400">
            Monthly digest with engineering deep dives, incident retrospectives, and community events. Zero spam, ever.
          </p>
          <form className="mt-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <label className="sr-only" htmlFor="blog-email">
              Email address
            </label>
            <input
              id="blog-email"
              type="email"
              placeholder="you@amazingteam.com"
              required
              className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-sm text-gray-100 shadow-sm placeholder:text-gray-500 focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
            <button
              type="submit"
              className="rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-900 shadow transition hover:bg-gray-300"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-2 text-[0.7rem] text-gray-600">You can unsubscribe at any time with one click.</p>
        </div>
      </section>
    </div>
  );
}
