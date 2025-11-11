"use client";

/**
 * Historical Timeline - Journey through tech history + personal milestones
 * Features:
 * - Chronological visualization of events
 * - Filter by category (tech, personal, science, etc.)
 * - Parallax scrolling effects
 * - Vintage aesthetic for historical events
 * - Interactive event cards with details
 *
 * HCI Principles:
 * - Natural mapping: Timeline follows reading direction
 * - Grouping: Events clustered by time periods
 * - Emphasis: Important events highlighted
 * - Scannability: Quick visual identification via icons/colors
 */

import { useState, useEffect, useRef } from "react";
import { historicalTimeline, getSortedTimeline, type HistoricalEvent } from "@/lib/polymath-data";
import * as Icons from "lucide-react";
import { Calendar, ExternalLink } from "lucide-react";

const CATEGORY_CONFIG = {
  tech: {
    label: "Technology",
    color: "var(--color-technology)",
    icon: "Code",
  },
  history: {
    label: "History",
    color: "var(--color-history)",
    icon: "BookOpen",
  },
  science: {
    label: "Science",
    color: "var(--color-physics)",
    icon: "Atom",
  },
  personal: {
    label: "Personal",
    color: "var(--gold-medal)",
    icon: "Star",
  },
  economics: {
    label: "Economics",
    color: "var(--color-economics)",
    icon: "TrendingUp",
  },
} as const;

const SIGNIFICANCE_STYLES = {
  critical: {
    scale: "scale-110",
    glow: "shadow-xl",
    badge: "MILESTONE",
  },
  high: {
    scale: "scale-105",
    glow: "shadow-lg",
    badge: "KEY EVENT",
  },
  medium: {
    scale: "scale-100",
    glow: "shadow-md",
    badge: null,
  },
  low: {
    scale: "scale-100",
    glow: "shadow-sm",
    badge: null,
  },
} as const;

interface TimelineFilters {
  categories: Set<HistoricalEvent['category']>;
  minSignificance: HistoricalEvent['significance'] | null;
}

export default function HistoricalTimeline() {
  const [filters, setFilters] = useState<TimelineFilters>({
    categories: new Set(),
    minSignificance: null,
  });
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Track scroll progress for parallax
  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(1, (window.innerHeight - rect.top) / (rect.height + window.innerHeight))
      );
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleCategory = (category: HistoricalEvent['category']) => {
    setFilters((prev) => {
      const newCategories = new Set(prev.categories);
      if (newCategories.has(category)) {
        newCategories.delete(category);
      } else {
        newCategories.add(category);
      }
      return { ...prev, categories: newCategories };
    });
  };

  // Filter events
  const sortedTimeline = getSortedTimeline();
  const filteredEvents = sortedTimeline.filter((event) => {
    if (filters.categories.size > 0 && !filters.categories.has(event.category)) {
      return false;
    }
    return true;
  });

  // Group events by decade
  const eventsByDecade = filteredEvents.reduce((acc, event) => {
    const decade = Math.floor(event.year / 10) * 10;
    if (!acc[decade]) acc[decade] = [];
    acc[decade].push(event);
    return acc;
  }, {} as Record<number, HistoricalEvent[]>);

  const decades = Object.keys(eventsByDecade)
    .map(Number)
    .sort((a, b) => b - a); // Newest first

  return (
    <div className="w-full" ref={timelineRef}>
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="glow-history">Timeline of Innovation</span>
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-6">
          A journey through history - from groundbreaking inventions to personal milestones
        </p>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
            const isActive = filters.categories.has(key as HistoricalEvent['category']);
            const IconComponent = Icons[config.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

            return (
              <button
                key={key}
                onClick={() => toggleCategory(key as HistoricalEvent['category'])}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? "glass-card border-2 category-filter-active"
                    : "bg-slate-800/30 hover:bg-slate-800/50"
                }`}
                data-category={key}
                aria-pressed={isActive}
              >
                <IconComponent className="w-4 h-4" />
                {config.label}
              </button>
            );
          })}

          {filters.categories.size > 0 && (
            <button
              onClick={() => setFilters({ ...filters, categories: new Set() })}
              className="px-4 py-2 rounded-full text-sm font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="sticky top-0 z-10 mb-8">
        <div className="h-1 bg-slate-800/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-blue-500 to-violet-500 transition-all duration-300"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-blue-500/30 to-transparent timeline-line" />

        {/* Decades and events */}
        <div className="space-y-16">
          {decades.map((decade) => (
            <div key={decade} className="relative">
              {/* Decade marker */}
              <div className="flex items-center justify-center md:justify-start mb-12">
                <div className="vintage-paper px-6 py-3 rounded-full inline-flex items-center gap-3 relative z-10">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  <span className="text-2xl font-bold text-amber-600">
                    {decade}s
                  </span>
                </div>
              </div>

              {/* Events */}
              <div className="space-y-8">
                {eventsByDecade[decade].map((event, idx) => {
                  const isLeft = idx % 2 === 0;
                  const config = CATEGORY_CONFIG[event.category];
                  const styles = SIGNIFICANCE_STYLES[event.significance];
                  const isExpanded = expandedEvent === event.id;
                  const iconName = event.icon || config.icon;
                  const IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType<{ className?: string; style?: React.CSSProperties }>;

                  // Parallax offset based on scroll progress
                  const parallaxOffset = (idx % 3) * 20 * scrollProgress;

                  return (
                    <div
                      key={event.id}
                      className={`relative flex items-center ${
                        isLeft ? "md:flex-row" : "md:flex-row-reverse"
                      } fade-in-up`}
                      style={{
                        transform: `translateY(${parallaxOffset}px)`,
                        transition: "transform 0.3s ease-out",
                      }}
                    >
                      {/* Content */}
                      <div
                        className={`w-full md:w-5/12 ${isLeft ? "md:pr-12" : "md:pl-12"}`}
                      >
                        <button
                          onClick={() =>
                            setExpandedEvent(isExpanded ? null : event.id)
                          }
                          className={`w-full text-left vintage-paper rounded-xl p-6 transition-all ${styles.scale} ${styles.glow} hover:shadow-2xl group`}
                          style={{
                            borderColor: config.color,
                            borderLeftWidth: 4,
                          }}
                          aria-expanded={isExpanded}
                        >
                          {/* Badge for significant events */}
                          {styles.badge && (
                            <div className="mb-3">
                              <span
                                className="text-xs font-bold px-2 py-1 rounded"
                                style={{
                                  backgroundColor: `${config.color}20`,
                                  color: config.color,
                                }}
                              >
                                {styles.badge}
                              </span>
                            </div>
                          )}

                          <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div
                              className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{
                                backgroundColor: `${config.color}20`,
                                borderColor: config.color,
                                borderWidth: 2,
                              }}
                            >
                              {IconComponent && (
                                <IconComponent
                                  className="w-6 h-6"
                                  style={{ color: config.color }}
                                />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <time
                                  className="text-sm font-semibold"
                                  style={{ color: config.color }}
                                >
                                  {event.month && event.day
                                    ? `${event.month}/${event.day}/${event.year}`
                                    : event.month
                                    ? `${event.month}/${event.year}`
                                    : event.year}
                                </time>
                                {event.link && (
                                  <ExternalLink className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                              </div>

                              <h3 className="text-lg font-bold text-slate-200 mb-2">
                                {event.title}
                              </h3>

                              <p
                                className={`text-sm text-slate-400 leading-relaxed ${
                                  isExpanded ? "" : "line-clamp-2"
                                }`}
                              >
                                {event.description}
                              </p>

                              {!isExpanded && (
                                <div className="mt-3 text-xs text-blue-400 hover:text-blue-300">
                                  Click to read more →
                                </div>
                              )}

                              {isExpanded && event.link && (
                                <a
                                  href={event.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-3 inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Learn more
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        </button>
                      </div>

                      {/* Timeline dot */}
                      <div className="absolute left-0 md:left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <div
                          className="w-4 h-4 rounded-full border-4 border-slate-900"
                          style={{ backgroundColor: config.color }}
                        />
                      </div>

                      {/* Spacer for opposite side */}
                      <div className="hidden md:block w-5/12" />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* End marker */}
        <div className="flex justify-center mt-16">
          <div className="vintage-paper px-6 py-3 rounded-full inline-flex items-center gap-2">
            <Icons.Sparkles className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-semibold text-amber-600">
              The journey continues...
            </span>
          </div>
        </div>
      </div>

      {/* Event count */}
      <div className="text-center mt-12 text-sm text-slate-500">
        Showing {filteredEvents.length} of {historicalTimeline.length} events
      </div>
    </div>
  );
}
