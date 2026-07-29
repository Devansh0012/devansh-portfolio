import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

/**
 * Shared header for every interactive demo.
 *
 * Replaces the icon-only back arrow each demo page had duplicated. Three
 * problems with that arrow:
 *
 * - It had no accessible name, so it reached screen readers as an unlabelled
 *   link — the user was told there was a link but not where it went.
 * - It pointed at `/engineer`, but almost everyone arrives from `/demos`. A
 *   "back" control that doesn't go back breaks the mental model of where you
 *   are in the site.
 * - A 20px icon is a hard target on a phone (Fitts's Law).
 *
 * A breadcrumb fixes all three at once and, unlike a back arrow, also answers
 * "where am I?" — which is the question a visitor who landed here from search
 * actually has.
 */
export function DemoHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-neutral-500">
            <li>
              <Link
                href="/engineer"
                className="inline-flex min-h-[32px] items-center rounded px-1 hover:text-white"
              >
                Engineer
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3 w-3" />
            </li>
            <li>
              <Link
                href="/demos"
                className="inline-flex min-h-[32px] items-center rounded px-1 hover:text-white"
              >
                Demos
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3 w-3" />
            </li>
            <li>
              <span aria-current="page" className="px-1 text-neutral-300">
                {title}
              </span>
            </li>
          </ol>
        </nav>

        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white sm:text-2xl">{title}</h1>
            <p className="mt-1 text-sm text-neutral-400">{description}</p>
          </div>
          {actions}
        </div>
      </div>
    </div>
  );
}
