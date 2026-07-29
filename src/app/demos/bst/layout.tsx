import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * The demo page itself is a client component, so it can't export metadata.
 * Without this layout every demo inherited the site-wide default title —
 * meaning five open tabs, five identical labels, and no way to tell them apart
 * in history or search results. A page's title is its primary identifier
 * outside the page (Jakob's Law), so each one gets its own.
 */
export const metadata: Metadata = {
  title: "Binary Search Tree Visualizer",
  description:
    "Interactive binary search tree: insert, delete, and watch in-order, pre-order, and post-order traversals run step by step.",
};

export default function DemoLayout({ children }: { children: ReactNode }) {
  return children;
}
