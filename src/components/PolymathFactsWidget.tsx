"use client";

/**
 * Polymath Facts Widget - Rotating facts from multiple domains
 * Features:
 * - Auto-rotating carousel of interesting facts
 * - Manual navigation controls
 * - Category filtering
 * - "On This Day" special facts
 * - Smooth transitions and animations
 *
 * HCI Principles:
 * - Feedback: Immediate response to navigation
 * - Control: User can pause/navigate manually
 * - Visibility: Clear indicators of current position
 * - Consistency: Standard carousel patterns
 */

import { useState, useEffect, useCallback } from "react";
import { polymathFacts, getTodayFacts, type PolymathFact, type FactCategory } from "@/lib/polymath-data";
import { ChevronLeft, ChevronRight, Pause, Play, Calendar, Sparkles } from "lucide-react";

const CATEGORY_COLORS: Record<FactCategory, string> = {
  history: "var(--color-history)",
  physics: "var(--color-physics)",
  economics: "var(--color-economics)",
  sports: "var(--color-sports)",
  technology: "var(--color-technology)",
  general: "var(--color-general)",
};

const CATEGORY_LABELS: Record<FactCategory, string> = {
  history: "History",
  physics: "Physics",
  economics: "Economics",
  sports: "Sports",
  technology: "Technology",
  general: "General",
};

const AUTO_ROTATE_INTERVAL = 8000; // 8 seconds

interface PolymathFactsWidgetProps {
  autoRotate?: boolean;
  showControls?: boolean;
  filterCategory?: FactCategory;
}

export default function PolymathFactsWidget({
  autoRotate = true,
  showControls = true,
  filterCategory,
}: PolymathFactsWidgetProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoRotate);
  const [facts, setFacts] = useState<PolymathFact[]>([]);

  // Initialize facts based on filter
  useEffect(() => {
    const todayFacts = getTodayFacts();
    let allFacts = filterCategory
      ? polymathFacts.filter((f) => f.category === filterCategory)
      : polymathFacts;

    // Prepend today's facts if any exist
    if (todayFacts.length > 0 && !filterCategory) {
      allFacts = [...todayFacts, ...allFacts.filter((f) => !todayFacts.includes(f))];
    }

    setFacts(allFacts);
  }, [filterCategory]);

  // Auto-rotation logic
  useEffect(() => {
    if (!isPlaying || facts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % facts.length);
    }, AUTO_ROTATE_INTERVAL);

    return () => clearInterval(interval);
  }, [isPlaying, facts.length]);

  const currentFact = facts[currentIndex];
  const todayFacts = getTodayFacts();
  const isOnThisDay = currentFact && todayFacts.some((f) => f.id === currentFact.id);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + facts.length) % facts.length);
    setIsPlaying(false);
  }, [facts.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % facts.length);
    setIsPlaying(false);
  }, [facts.length]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  if (!currentFact) return null;

  const categoryColor = CATEGORY_COLORS[currentFact.category];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-400" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-slate-200">
            {isOnThisDay ? "On This Day" : "Polymath Insights"}
          </h3>
        </div>

        {showControls && (
          <div className="flex items-center gap-2">
            {/* Category indicator */}
            <span
              className="text-xs px-3 py-1 rounded-full font-semibold"
              style={{
                backgroundColor: `${categoryColor}20`,
                color: categoryColor,
                borderColor: categoryColor,
                borderWidth: 1,
              }}
            >
              {CATEGORY_LABELS[currentFact.category]}
            </span>

            {/* Navigation controls */}
            <div className="flex items-center gap-1 glass-card rounded-lg p-1">
              <button
                onClick={handlePrevious}
                className="p-1.5 hover:bg-slate-700/50 rounded transition-colors"
                aria-label="Previous fact"
              >
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={togglePlayPause}
                className="p-1.5 hover:bg-slate-700/50 rounded transition-colors"
                aria-label={isPlaying ? "Pause rotation" : "Resume rotation"}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-slate-400" />
                ) : (
                  <Play className="w-4 h-4 text-slate-400" />
                )}
              </button>

              <button
                onClick={handleNext}
                className="p-1.5 hover:bg-slate-700/50 rounded transition-colors"
                aria-label="Next fact"
              >
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Fact card */}
      <div
        className="glass-card rounded-xl p-6 relative overflow-hidden fade-in-up"
        style={{
          borderLeftWidth: 4,
          borderLeftColor: categoryColor,
        }}
        role="region"
        aria-live="polite"
        aria-label="Rotating fact display"
      >
        {/* On This Day badge */}
        {isOnThisDay && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 border border-amber-500/40 rounded-full">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-amber-400">On This Day</span>
            </div>
          </div>
        )}

        {/* Fact content */}
        <div className="pr-24">
          <h4
            className="text-xl font-bold mb-3 leading-tight"
            style={{ color: categoryColor }}
          >
            {currentFact.title}
          </h4>

          <p className="text-slate-300 leading-relaxed mb-4">
            {currentFact.description}
          </p>

          {/* Tags */}
          {currentFact.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {currentFact.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded bg-slate-700/50 text-slate-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Related interests */}
          {currentFact.relatedInterests.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Related to:</span>
              {currentFact.relatedInterests.map((interest, idx) => (
                <span key={interest}>
                  {CATEGORY_LABELS[interest]}
                  {idx < currentFact.relatedInterests.length - 1 && ", "}
                </span>
              ))}
            </div>
          )}

          {/* Source attribution */}
          {currentFact.source && (
            <p className="text-xs text-slate-500 mt-3 italic">
              Source: {currentFact.source}
            </p>
          )}
        </div>

        {/* Progress indicator */}
        <div className="mt-4 flex gap-1">
          {facts.map((_, idx) => (
            <div
              key={idx}
              className="h-1 flex-1 rounded-full overflow-hidden bg-slate-700/30"
            >
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: idx === currentIndex ? "100%" : "0%",
                  backgroundColor: categoryColor,
                }}
              />
            </div>
          ))}
        </div>

        {/* Page counter */}
        <div className="absolute bottom-4 right-4 text-xs text-slate-500">
          {currentIndex + 1} / {facts.length}
        </div>
      </div>

      {/* Accessibility: Screen reader announcements */}
      <div className="sr-only" role="status" aria-live="polite">
        {`Showing fact ${currentIndex + 1} of ${facts.length}: ${currentFact.title}`}
      </div>
    </div>
  );
}

/**
 * Compact version for sidebar/smaller spaces
 */
export function PolymathFactsCompact() {
  const [currentFact, setCurrentFact] = useState<PolymathFact | null>(null);

  useEffect(() => {
    const todayFacts = getTodayFacts();
    const fact = todayFacts.length > 0
      ? todayFacts[0]
      : polymathFacts[Math.floor(Math.random() * polymathFacts.length)];
    setCurrentFact(fact);
  }, []);

  if (!currentFact) return null;

  const categoryColor = CATEGORY_COLORS[currentFact.category];

  return (
    <div
      className="glass-card rounded-lg p-4 border-l-4"
      style={{ borderLeftColor: categoryColor }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${categoryColor}20` }}
        >
          <Sparkles className="w-5 h-5" style={{ color: categoryColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-200 mb-1 line-clamp-2">
            {currentFact.title}
          </h4>
          <p className="text-xs text-slate-400 line-clamp-3">
            {currentFact.description}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                backgroundColor: `${categoryColor}15`,
                color: categoryColor,
              }}
            >
              {CATEGORY_LABELS[currentFact.category]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
