"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TabsProps {
  tabs: {
    value: string;
    label: string;
  }[];
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  const [hoveredTab, setHoveredTab] = React.useState<string | null>(null);

  return (
    <div
      className={cn(
        "relative inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 p-1 backdrop-blur-xl",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        const isHovered = hoveredTab === tab.value;

        return (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            onMouseEnter={() => setHoveredTab(tab.value)}
            onMouseLeave={() => setHoveredTab(null)}
            className={cn(
              "relative z-10 px-4 py-2 text-sm font-semibold transition-colors duration-300",
              isActive ? "text-black" : "text-neutral-400 hover:text-white"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 rounded-full bg-white"
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 30,
                }}
              />
            )}
            {!isActive && isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-full bg-white/10"
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
