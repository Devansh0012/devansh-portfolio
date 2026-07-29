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
  title: "Rate Limiter Simulator",
  description:
    "Compare token bucket, leaky bucket, and fixed window rate limiting against live simulated traffic.",
};

export default function DemoLayout({ children }: { children: ReactNode }) {
  return children;
}
