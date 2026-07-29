import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Rss } from "lucide-react";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { buttonVariants } from "@/components/ui/Button";
import SubscriptionForm from "@/components/SubscriptionForm";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

type Params = Promise<{ slug: string }>;

// A missing .mdx file means the slug doesn't exist and should 404; any other
// failure (broken frontmatter, MDX compile error) must surface, not be
// swallowed as a not-found.
const isMissingPost = (error: unknown) =>
  (error as NodeJS.ErrnoException)?.code === "ENOENT";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);
    return {
      title: post.title,
      description: post.description,
      openGraph: {
        title: post.title,
        description: post.description,
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.description,
      },
    } satisfies Metadata;
  } catch (error) {
    if (!isMissingPost(error)) throw error;
    return {
      title: "Blog post",
      description: "Article not found",
    } satisfies Metadata;
  }
}

/**
 * Article page, brought back onto the site's palette.
 *
 * It previously rendered on `bg-slate-900` with slate borders and slate text
 * while every other page is pure black with white hairlines. Jakob's Law cuts
 * both ways: consistency *within* a product is what lets someone stop
 * re-reading the interface. A visitor clicking from the blog index into a post
 * shouldn't feel like they've landed on a different site.
 *
 * Also added: reading progress (Goal-Gradient), true previous/next navigation
 * instead of two arbitrary "related" posts, and a subscribe prompt at the end
 * where interest peaks (Peak-End Rule).
 */
export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch((error: unknown) => {
    if (!isMissingPost(error)) throw error;
    return null;
  });
  if (!post) {
    notFound();
  }

  // Posts arrive newest-first, so the neighbours in this list are the natural
  // "newer" and "older" article — a sequence the reader can actually follow,
  // unlike the previous "first two posts that aren't this one".
  const allPosts = await getAllPosts();
  const index = allPosts.findIndex((entry) => entry.slug === slug);
  const newer = index > 0 ? allPosts[index - 1] : null;
  const older = index >= 0 && index < allPosts.length - 1 ? allPosts[index + 1] : null;

  return (
    <div className="bg-black text-white">
      <ReadingProgress />

      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pb-12 pt-12 md:pt-16">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/blog"
              className="inline-flex min-h-[40px] w-fit items-center gap-2 rounded-full text-sm font-semibold text-neutral-400 hover:text-white"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" /> All posts
            </Link>
            <Link
              href="/rss.xml"
              className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-white/15 px-3 text-xs font-semibold text-neutral-400 hover:border-white/40 hover:text-white"
            >
              <Rss aria-hidden="true" className="h-3.5 w-3.5" />
              RSS
            </Link>
          </div>

          <p className="eyebrow">{post.category}</p>
          <h1 className="text-4xl font-semibold text-white md:text-5xl">{post.title}</h1>
          <p className="text-base text-neutral-300">{post.description}</p>

          {/* Reading time next to the date sets the commitment up front —
              Parkinson's Law in reverse: a stated cost is easier to accept than
              an unknown one. */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
            <time dateTime={post.date}>{dateFormatter.format(new Date(post.date))}</time>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-neutral-700" />
            <span>{post.readingTime}</span>
          </div>

          {post.heroQuote && (
            <blockquote className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-lg italic leading-relaxed text-neutral-200">
              &ldquo;{post.heroQuote}&rdquo;
            </blockquote>
          )}
        </div>
      </header>

      {/* A fixed measure keeps lines near 70 characters. Long lines force the
          eye to hunt for the start of the next one, which is where readers of
          technical writing drop off. */}
      <article className="mx-auto max-w-[46rem] px-4 py-12">{post.content}</article>

      <nav aria-label="More posts" className="border-t border-white/10">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h2 className="eyebrow">Keep reading</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {older && <PostLink post={older} direction="older" />}
            {newer && <PostLink post={newer} direction="newer" />}
            {!older && !newer && (
              <p className="text-sm text-neutral-500">
                This is the only post so far — more on the way.
              </p>
            )}
          </div>

          <Link
            href="/blog"
            className={buttonVariants({ variant: "secondary", size: "md", className: "mt-8" })}
          >
            Browse all posts
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      {/* Zeigarnik Effect: someone who has just finished an article is at their
          most receptive to a low-cost next step, and subscribing is a two-part
          task (enter, then confirm) that stays open in mind until completed. */}
      <section aria-labelledby="post-subscribe" className="border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-xl px-4 py-14 text-center">
          <h2 id="post-subscribe" className="text-2xl font-semibold text-white">
            Get the next one by email
          </h2>
          <p className="mt-3 text-sm text-neutral-400">
            One monthly digest of engineering deep dives and incident retrospectives. No spam.
          </p>
          <div className="mx-auto mt-6 max-w-md text-left">
            <SubscriptionForm type="blog" buttonText="Subscribe" />
          </div>
        </div>
      </section>
    </div>
  );
}

function PostLink({
  post,
  direction,
}: {
  post: Awaited<ReturnType<typeof getAllPosts>>[number];
  direction: "older" | "newer";
}) {
  return (
    <Link
      href={`/blog/${post.slug}` as Route}
      className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/25 hover:bg-white/[0.06]"
    >
      <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-neutral-500">
        {direction === "older" ? (
          <>
            <ArrowLeft aria-hidden="true" className="h-3 w-3" /> Older post
          </>
        ) : (
          <>
            Newer post <ArrowRight aria-hidden="true" className="h-3 w-3" />
          </>
        )}
      </span>
      <span className="mt-3 text-lg font-semibold text-white">{post.title}</span>
      <span className="mt-2 text-sm text-neutral-400">{post.description}</span>
      <span className="mt-4 text-xs text-neutral-500">{post.readingTime}</span>
    </Link>
  );
}
