"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface TabsProps {
  tabs: {
    value: string;
    label: string;
    /** Optional count shown beside the label so the choice is informed. */
    count?: number;
  }[];
  activeTab: string;
  onTabChange: (value: string) => void;
  /** Describes the group for screen readers, e.g. "Filter posts by category". */
  label: string;
  className?: string;
}

/**
 * Segmented filter control.
 *
 * These are filters, not tab panels, so they're exposed as a group of toggle
 * buttons with `aria-pressed` rather than the ARIA tabs pattern — claiming
 * `role="tab"` without the matching `tabpanel` wiring and arrow-key handling
 * promises keyboard behaviour that doesn't exist.
 *
 * Counts are shown per option because a filter that leads to zero results is
 * only discovered after the click; showing the number up front removes the
 * wasted round trip (Doherty Threshold) and the dead end.
 */
export function Tabs({ tabs, activeTab, onTabChange, label, className }: TabsProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "relative inline-flex flex-wrap items-center gap-1 rounded-full border border-white/20 bg-white/5 p-1 backdrop-blur-xl",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onTabChange(tab.value)}
            aria-pressed={isActive}
            className={cn(
              "relative z-10 inline-flex min-h-[40px] items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors duration-200",
              isActive ? "text-black" : "text-neutral-400 hover:bg-white/10 hover:text-white"
            )}
          >
            {isActive &&
              (reducedMotion ? (
                <span className="absolute inset-0 rounded-full bg-white" />
              ) : (
                <motion.span
                  layoutId="active-tab"
                  className="absolute inset-0 rounded-full bg-white"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              ))}
            <span className="relative z-10">{tab.label}</span>
            {typeof tab.count === "number" && (
              <span
                className={cn(
                  "relative z-10 text-xs tabular-nums",
                  isActive ? "text-black/60" : "text-neutral-600"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
