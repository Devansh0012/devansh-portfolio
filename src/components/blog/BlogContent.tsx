"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Route } from "next";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { BorderBeam } from "@/components/ui/border-beam";
import { Tabs } from "@/components/ui/Tabs";

type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  readingTime: string;
};

type Props = {
  posts: Post[];
  initialTag?: string;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

// Define tab categories and their mappings
const tabCategories = {
  all: { label: "All posts", categories: [] as string[] },
  "tech-deep-dives": { label: "Tech deep dives", categories: ["Engineering", "Systems", "Architecture"] },
  "hackathon-stories": { label: "Hackathon stories", categories: ["Hackathon", "Projects", "Community"] },
};

const tabs = [
  { value: "all", label: "All posts" },
  { value: "tech-deep-dives", label: "Tech deep dives" },
  { value: "hackathon-stories", label: "Hackathon stories" },
];

export default function BlogContent({ posts, initialTag }: Props) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string | undefined>(initialTag);

  // Filter posts based on active tab and selected tag
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Tab filtering
      let tabMatch = true;
      if (activeTab !== "all") {
        const allowedCategories = tabCategories[activeTab as keyof typeof tabCategories].categories;
        tabMatch = allowedCategories.some((cat) =>
          post.category.toLowerCase().includes(cat.toLowerCase())
        );
      }

      // Tag filtering
      const tagMatch = selectedTag ? post.tags.includes(selectedTag) : true;

      return tabMatch && tagMatch;
    });
  }, [posts, activeTab, selectedTag]);

  // Get all unique tags from filtered posts
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    filteredPosts.forEach((post) => {
      post.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [filteredPosts]);

  return (
    <>
      {/* Tabs for main category filtering */}
      <div className="flex justify-center">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Tag filter pills */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Filter by tag:</span>
          <button
            onClick={() => setSelectedTag(undefined)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
              !selectedTag
                ? "border-white bg-white text-black"
                : "border-white/20 text-neutral-400 hover:border-white/30 hover:text-white"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                selectedTag === tag
                  ? "border-white bg-white text-black"
                  : "border-white/20 text-neutral-400 hover:border-white/30 hover:text-white"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Blog posts grid */}
      <section className="border-t border-white/5 bg-black/30 -mx-4 px-4 py-16 md:rounded-3xl">
        <div className="grid gap-6 md:grid-cols-2">
          {filteredPosts.map((post, idx) => (
            <CardSpotlight
              key={post.slug}
              className="relative flex h-full flex-col overflow-hidden rounded-2xl p-6"
              radius={350}
              color="#0a0a0a"
            >
              <BorderBeam size={180} duration={12 + idx * 0.5} delay={idx * 0.3} colorFrom="#ffffff" colorTo="#737373" />
              <article className="relative z-20 flex h-full flex-col">
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                  {dateFormatter.format(new Date(post.date))}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-white">{post.title}</h2>
                <p className="mt-2 text-sm text-neutral-300">{post.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold text-neutral-400 transition hover:border-white/30 hover:bg-white/10"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
                <div className="mt-auto pt-6 flex items-center justify-between text-xs text-neutral-500">
                  <span>{post.readingTime}</span>
                  <Link
                    href={`/blog/${post.slug}` as Route}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-neutral-300 transition-colors"
                  >
                    Read story →
                  </Link>
                </div>
              </article>
            </CardSpotlight>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <CardSpotlight className="relative overflow-hidden rounded-3xl p-10 text-center" radius={400} color="#0a0a0a">
            <BorderBeam size={200} duration={12} delay={0} colorFrom="#ffffff" colorTo="#737373" />
            <div className="relative z-20">
              <p className="text-sm text-neutral-400">
                No posts found for the selected filters. Try a different category or tag.
              </p>
            </div>
          </CardSpotlight>
        )}
      </section>
    </>
  );
}
