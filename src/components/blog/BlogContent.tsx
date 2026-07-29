"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Route } from "next";
import { X } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import type { BlogSummary } from "@/lib/blog";

type Props = {
  posts: BlogSummary[];
  initialTag?: string;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const tabCategories: Record<string, string[]> = {
  all: [],
  "tech-deep-dives": ["Engineering", "Systems", "Architecture"],
  "hackathon-stories": ["Hackathon", "Projects", "Community"],
};

const tabLabels: Record<string, string> = {
  all: "All posts",
  "tech-deep-dives": "Tech deep dives",
  "hackathon-stories": "Hackathon stories",
};

const matchesTab = (post: BlogSummary, tab: string) => {
  const allowed = tabCategories[tab] ?? [];
  if (!allowed.length) return true;
  return allowed.some((category) =>
    post.category.toLowerCase().includes(category.toLowerCase())
  );
};

export default function BlogContent({ posts, initialTag }: Props) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string | undefined>(initialTag);

  // Posts matching the category tab only. This is the pool the tag list is
  // built from.
  const tabFiltered = useMemo(
    () => posts.filter((post) => matchesTab(post, activeTab)),
    [posts, activeTab]
  );

  const filteredPosts = useMemo(
    () => (selectedTag ? tabFiltered.filter((post) => post.tags.includes(selectedTag)) : tabFiltered),
    [tabFiltered, selectedTag]
  );

  /**
   * Tags come from the tab-filtered pool, *not* from the already tag-filtered
   * results.
   *
   * Deriving them from the final result set was a dead end: selecting a tag
   * removed every tag that didn't co-occur with it, so the visitor could
   * narrow but never sideways-switch — the only way out was to notice the
   * separate "All" pill. Now the full set of reachable tags stays visible, and
   * the selected one is simply marked.
   */
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    tabFiltered.forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [tabFiltered]);

  const tabs = useMemo(
    () =>
      Object.keys(tabCategories).map((value) => ({
        value,
        label: tabLabels[value],
        count: posts.filter((post) => matchesTab(post, value)).length,
      })),
    [posts]
  );

  const isFiltered = activeTab !== "all" || Boolean(selectedTag);

  const clearFilters = () => {
    setActiveTab("all");
    setSelectedTag(undefined);
  };

  return (
    <>
      <div className="flex justify-center">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          label="Filter posts by category"
        />
      </div>

      {/* Law of Common Region: filters live inside one bounded panel so it's
          obvious which controls act on the list below. */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Filter by tag
          </span>
          {allTags.map((tag) => {
            const active = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                // Clicking the active tag turns it off, so the control that
                // applied the filter is also the one that removes it.
                onClick={() => setSelectedTag(active ? undefined : tag)}
                aria-pressed={active}
                className={`inline-flex min-h-[36px] items-center gap-1 rounded-full border px-3 text-xs font-semibold ${
                  active
                    ? "border-white bg-white text-black"
                    : "border-white/20 text-neutral-400 hover:border-white/40 hover:text-white"
                }`}
              >
                #{tag}
                {active && <X aria-hidden="true" className="h-3 w-3" />}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
          {/* Immediate, announced feedback that the filter did something —
              otherwise a click that changes nothing visible reads as broken
              (Doherty Threshold). */}
          <p aria-live="polite" className="text-xs text-neutral-500">
            Showing {filteredPosts.length} of {posts.length} post
            {posts.length === 1 ? "" : "s"}
          </p>
          {isFiltered && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-white/20 px-3 text-xs font-semibold text-neutral-300 hover:border-white/40 hover:text-white"
            >
              <X aria-hidden="true" className="h-3 w-3" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      <section aria-label="Blog posts" className="pb-4 pt-4">
        <ul className="grid gap-6 md:grid-cols-2">
          {filteredPosts.map((post) => (
            <li
              key={post.slug}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/25 hover:bg-white/[0.06] focus-within:border-white/40"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                <time dateTime={post.date}>{dateFormatter.format(new Date(post.date))}</time>
              </p>

              <h2 className="mt-3 text-2xl font-semibold text-white">
                {/* Stretched link. Previously only the "Read story →" text at
                    the bottom was clickable — a ~90px target inside a card the
                    visitor already reads as one clickable unit. The pseudo
                    element makes the whole card the target (Fitts's Law) while
                    keeping a single, correctly-labelled link in the a11y tree. */}
                <Link
                  href={`/blog/${post.slug}` as Route}
                  className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
                >
                  {post.title}
                </Link>
              </h2>

              <p className="mt-2 text-sm text-neutral-300">{post.description}</p>

              {/* Sits above the stretched link so tags stay independently
                  clickable. */}
              <ul className="relative z-10 mt-4 flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <li key={tag}>
                    <button
                      type="button"
                      onClick={() => setSelectedTag(tag)}
                      className="inline-flex min-h-[32px] items-center rounded-full border border-white/20 bg-white/5 px-3 text-xs font-semibold text-neutral-400 hover:border-white/40 hover:bg-white/10 hover:text-white"
                    >
                      #{tag}
                      <span className="sr-only">— filter by this tag</span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex items-center justify-between pt-6 text-xs text-neutral-500">
                <span>{post.readingTime}</span>
                <span
                  aria-hidden="true"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-300 transition-colors group-hover:text-white"
                >
                  Read story
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </li>
          ))}
        </ul>

        {filteredPosts.length === 0 && (
          /* An empty state that offers the way out, rather than only reporting
             the problem. */
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <p className="text-sm text-neutral-300">
              No posts match {selectedTag ? `#${selectedTag}` : "these filters"}
              {activeTab !== "all" ? ` in ${tabLabels[activeTab]}` : ""}.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black hover:bg-neutral-200"
            >
              Show all posts
            </button>
          </div>
        )}
      </section>
    </>
  );
}
