"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";
import { CalendarClock, Filter } from "lucide-react";
import { timeline } from "@/lib/data";

const allTags = Array.from(new Set(timeline.flatMap((entry) => entry.tags)));

export default function LogTimeline() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredEntries = useMemo(() => {
    if (!selectedTag) return timeline;
    return timeline.filter((entry) => entry.tags.includes(selectedTag));
  }, [selectedTag]);

  return (
    <div className="rounded-3xl border border-emerald-500/20 bg-black/60 p-6 shadow-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-emerald-400/80">
            <CalendarClock className="h-4 w-4" /> timeline
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-emerald-100">Interactive deployment feed</h3>
          <p className="text-sm text-emerald-200/80">
            Filter moments by theme to explore how incidents were handled and features shipped.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            className={clsx(
              "inline-flex items-center gap-1 rounded-full border px-3 py-1 font-semibold transition",
              selectedTag === null
                ? "border-emerald-300 bg-emerald-400 text-slate-900"
                : "border-emerald-500/30 text-emerald-200 hover:border-emerald-200"
            )}
          >
            <Filter className="h-3 w-3" /> All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag((prev) => (prev === tag ? null : tag))}
              className={clsx(
                "rounded-full border px-3 py-1 font-semibold transition",
                selectedTag === tag
                  ? "border-emerald-300 bg-emerald-400 text-slate-900"
                  : "border-emerald-500/30 text-emerald-200 hover:border-emerald-200"
              )}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {filteredEntries.map((entry, index) => (
          <div
            key={entry.id}
            className="relative rounded-2xl border border-emerald-500/20 bg-slate-950/60 p-6"
          >
            <div className="absolute left-4 top-6 h-2 w-2 -translate-x-1/2 rounded-full bg-emerald-400" />
            {index !== filteredEntries.length - 1 && (
              <div className="absolute left-4 top-8 bottom-0 w-px bg-emerald-500/20" />
            )}
            <div className="pl-6">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-400/80">{entry.timestamp}</p>
              <h4 className="mt-3 text-lg font-semibold text-emerald-100">{entry.title}</h4>
              <p className="mt-2 text-sm text-emerald-200/80">{entry.body}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-emerald-400/30 px-3 py-1 text-xs font-semibold text-emerald-300/90"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
