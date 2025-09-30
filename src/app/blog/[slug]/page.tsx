import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

type Params = Promise<{ slug: string }>;

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
  } catch {
    return {
      title: "Blog post",
      description: "Article not found",
    } satisfies Metadata;
  }
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post) {
    notFound();
  }

  const relatedPosts = (await getAllPosts()).filter((related) => related.slug !== slug).slice(0, 2);

  return (
    <div className="bg-slate-900 text-slate-100">
      <section className="border-b border-slate-700 bg-slate-800">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 pb-12 pt-20 md:pt-24">
          <Link href="/blog" className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-300">
            <ArrowLeft className="h-4 w-4" /> Back to all posts
          </Link>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{post.category}</p>
          <h1 className="text-4xl font-semibold text-slate-100 md:text-5xl">{post.title}</h1>
          <p className="text-sm text-slate-300">{post.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span>{dateFormatter.format(new Date(post.date))}</span>
            <span className="h-1 w-1 rounded-full bg-slate-600" />
            <span>{post.readingTime}</span>
          </div>
          {post.heroQuote && (
            <blockquote className="mt-6 rounded-3xl border border-slate-700 bg-slate-900 p-6 text-lg italic text-slate-300 shadow-lg">
              "{post.heroQuote}"
            </blockquote>
          )}
        </div>
      </section>

      <article className="mx-auto max-w-3xl space-y-6 px-4 py-12">
        {post.content}
      </article>

      <section className="border-t border-slate-700 bg-slate-800">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <h2 className="text-xl font-semibold text-slate-100">Keep exploring</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {relatedPosts.map((related) => (
                      <Link
                        key={related.slug}
                        href={`/blog/${related.slug}`}
                        className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg transition hover:border-slate-600"
                      >
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{related.category}</p>
                <h3 className="mt-3 text-lg font-semibold text-slate-100">{related.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{related.description}</p>
                <p className="mt-4 text-xs text-slate-500">{related.readingTime}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
