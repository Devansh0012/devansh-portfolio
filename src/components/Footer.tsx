import Link from "next/link";
import type { Route } from "next";
import { ArrowUp } from "lucide-react";
import { SITE } from "@/lib/site";

/**
 * Grouped into labelled regions rather than one undifferentiated row.
 *
 * Law of Common Region + Law of Proximity: a visitor scanning the footer should
 * be able to tell "places to go" from "ways to reach me" without reading every
 * label. Serial Position Effect also makes the footer the second-most-recalled
 * part of a long page, so it repeats the primary destinations instead of only
 * listing social icons.
 */

const explore = [
  { label: "Recruiter", href: "/recruiter" },
  { label: "Engineer", href: "/engineer" },
  { label: "Blog", href: "/blog" },
  { label: "Demos", href: "/demos" },
  { label: "Community", href: "/community" },
] satisfies Array<{ label: string; href: Route }>;

const elsewhere = [
  { label: "Email", href: `mailto:${SITE.email}`, external: false },
  { label: "GitHub", href: SITE.github, external: true },
  { label: "LinkedIn", href: SITE.linkedin, external: true },
  { label: "Résumé", href: SITE.resumeUrl, external: true },
  { label: "RSS feed", href: "/rss.xml", external: false },
];

const linkClass =
  "inline-flex min-h-[36px] items-center rounded text-neutral-400 hover:text-white";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="text-lg font-semibold text-white">{SITE.name}</p>
            <p className="mt-2 max-w-xs text-sm text-neutral-400">{SITE.role}</p>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-4 inline-flex min-h-[40px] items-center text-sm font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
            >
              {SITE.email}
            </a>
          </div>

          <nav aria-labelledby="footer-explore">
            <h2 id="footer-explore" className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Explore
            </h2>
            <ul className="mt-4 space-y-1 text-sm">
              {explore.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-elsewhere">
            <h2 id="footer-elsewhere" className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Elsewhere
            </h2>
            <ul className="mt-4 space-y-1 text-sm">
              {elsewhere.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={linkClass}
                    /* These previously opened in the same tab with no rel —
                       losing the visitor's place and leaking window.opener. */
                    {...(item.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {item.label}
                    {item.external && (
                      <span className="sr-only"> (opens in a new tab)</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-white/10 pt-6 text-sm text-neutral-500 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          {/* Peak-End Rule: the bottom of a long page is the last thing a
              visitor experiences — give them a one-tap way out instead of a
              long scroll back. */}
          <a
            href="#main-content"
            className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-white/15 px-4 text-neutral-400 hover:border-white/30 hover:text-white"
          >
            <ArrowUp aria-hidden="true" className="h-3.5 w-3.5" />
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
