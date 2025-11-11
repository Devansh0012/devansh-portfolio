"use client";

import { useState } from "react";
import { BookOpen, Star, BookMarked, Check, Clock, ExternalLink, Sparkles } from "lucide-react";
import { books, getBooksByCategory, getBooksByStatus, getCurrentlyReading, getTopRatedBooks } from "@/lib/reading-room-data";
import type { Book } from "@/lib/polymath-data";

type FilterType = "all" | "technology" | "physics" | "history" | "economics" | "sports" | "general";
type StatusFilter = "all" | "read" | "reading" | "want-to-read";

const categoryConfig = {
  technology: { color: "amber", label: "Technology" },
  physics: { color: "blue", label: "Physics" },
  history: { color: "emerald", label: "History" },
  economics: { color: "orange", label: "Economics" },
  sports: { color: "violet", label: "Sports" },
  general: { color: "pink", label: "Interdisciplinary" },
};

const statusConfig = {
  read: { icon: Check, label: "Read", color: "emerald" },
  reading: { icon: Clock, label: "Reading", color: "amber" },
  "want-to-read": { icon: BookMarked, label: "Want to Read", color: "slate" },
};

function BookCard({ book }: { book: Book }) {
  const [expanded, setExpanded] = useState(false);
  const category = categoryConfig[book.category as keyof typeof categoryConfig];
  const status = statusConfig[book.status];
  const StatusIcon = status.icon;

  return (
    <div className="group relative">
      {/* Library Card Aesthetic */}
      <div className="relative overflow-hidden rounded-lg border border-slate-700/50 bg-slate-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-slate-600 hover:bg-slate-900/80">
        {/* Dewey Decimal Style Number */}
        <div className="absolute right-4 top-4 font-mono text-xs text-slate-600">
          {book.id.split("-")[2]}
        </div>

        {/* Book Spine Edge Effect */}
        <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-${category.color}-500/50 to-${category.color}-500/20`} />

        {/* Header */}
        <div className="mb-4">
          <div className="mb-2 flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="mb-1 text-lg font-semibold text-slate-100 group-hover:text-white">
                {book.title}
              </h3>
              <p className="text-sm text-slate-400">{book.author}</p>
            </div>
          </div>

          {/* Category & Status Tags */}
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full bg-${category.color}-500/10 px-3 py-1 text-xs text-${category.color}-400 border border-${category.color}-500/20`}>
              {category.label}
            </span>
            <span className={`flex items-center gap-1 rounded-full bg-${status.color}-500/10 px-3 py-1 text-xs text-${status.color}-400 border border-${status.color}-500/20`}>
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          {book.description}
        </p>

        {/* Rating */}
        {book.rating && (
          <div className="mb-4 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < book.rating!
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-600"
                }`}
              />
            ))}
            <span className="ml-2 text-xs text-slate-400">
              {book.rating}/5
            </span>
          </div>
        )}

        {/* Expandable Section */}
        {(book.keyTakeaways || book.notes) && (
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400 transition-colors hover:text-slate-300"
            >
              {expanded ? "Hide" : "Show"} Details ▾
            </button>

            {expanded && (
              <div className="space-y-3 border-t border-slate-700/50 pt-4">
                {/* Notes */}
                {book.notes && (
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                      <Sparkles className="h-3 w-3" />
                      Personal Notes
                    </div>
                    <p className="text-sm italic text-slate-300">
                      &quot;{book.notes}&quot;
                    </p>
                  </div>
                )}

                {/* Key Takeaways */}
                {book.keyTakeaways && book.keyTakeaways.length > 0 && (
                  <div>
                    <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                      Key Takeaways
                    </div>
                    <ul className="space-y-1">
                      {book.keyTakeaways.map((takeaway, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-slate-300"
                        >
                          <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-slate-500" />
                          {takeaway}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Amazon Link */}
        {book.amazonLink && (
          <a
            href={book.amazonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-xs text-slate-400 transition-colors hover:text-slate-300"
          >
            View on Amazon
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}

export default function ReadingRoom() {
  const [categoryFilter, setCategoryFilter] = useState<FilterType>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredBooks = books.filter((book) => {
    const matchesCategory = categoryFilter === "all" || book.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || book.status === statusFilter;
    return matchesCategory && matchesStatus;
  });

  const currentlyReading = getCurrentlyReading();
  const topRated = getTopRatedBooks(5);
  const readCount = getBooksByStatus("read").length;
  const readingCount = currentlyReading.length;
  const wantCount = getBooksByStatus("want-to-read").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <BookOpen className="h-8 w-8 text-amber-400" />
          <h2 className="text-4xl font-bold text-slate-100">Reading Room</h2>
        </div>
        <p className="mx-auto max-w-2xl text-slate-300">
          A curated collection spanning technology, physics, history, economics, and sports.
          Books that shaped my thinking across disciplines.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 rounded-lg border border-slate-700/50 bg-slate-900/50 p-6 backdrop-blur-sm">
        <div className="text-center">
          <div className="mb-1 text-3xl font-bold text-emerald-400">{readCount}</div>
          <div className="text-xs uppercase tracking-wide text-slate-400">Books Read</div>
        </div>
        <div className="text-center">
          <div className="mb-1 text-3xl font-bold text-amber-400">{readingCount}</div>
          <div className="text-xs uppercase tracking-wide text-slate-400">Currently Reading</div>
        </div>
        <div className="text-center">
          <div className="mb-1 text-3xl font-bold text-slate-400">{wantCount}</div>
          <div className="text-xs uppercase tracking-wide text-slate-400">Want to Read</div>
        </div>
      </div>

      {/* Currently Reading Highlight */}
      {currentlyReading.length > 0 && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-amber-400">
            <Clock className="h-4 w-4" />
            Currently Reading
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {currentlyReading.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="space-y-4">
        <div>
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            Filter by Category
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                categoryFilter === "all"
                  ? "bg-slate-700 text-slate-100"
                  : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300"
              }`}
            >
              All ({books.length})
            </button>
            {Object.entries(categoryConfig).map(([key, config]) => {
              const count = getBooksByCategory(key).length;
              return (
                <button
                  key={key}
                  onClick={() => setCategoryFilter(key as FilterType)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    categoryFilter === key
                      ? `bg-${config.color}-500/20 text-${config.color}-400 border border-${config.color}-500/30`
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300"
                  }`}
                >
                  {config.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            Filter by Status
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                statusFilter === "all"
                  ? "bg-slate-700 text-slate-100"
                  : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300"
              }`}
            >
              All Status
            </button>
            {Object.entries(statusConfig).map(([key, config]) => {
              const count = getBooksByStatus(key as Book["status"]).length;
              const Icon = config.icon;
              return (
                <button
                  key={key}
                  onClick={() => setStatusFilter(key as StatusFilter)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    statusFilter === key
                      ? `bg-${config.color}-500/20 text-${config.color}-400 border border-${config.color}-500/30`
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {config.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="py-12 text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-600" />
          <p className="text-slate-400">No books match your filters.</p>
        </div>
      )}
    </div>
  );
}
