"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { ExternalLink, Menu, X } from "lucide-react";
import { SITE } from "@/lib/site";

/**
 * Five destinations plus one CTA.
 *
 * Hick's Law: decision time grows with the number of options, and five sits
 * comfortably inside working memory (Miller's Law). Each label also carries a
 * hint, because "Recruiter" on its own doesn't tell a recruiter that's where
 * the résumé and case studies live.
 */
const links = [
  { label: "Recruiter", href: "/recruiter", hint: "Experience, impact, résumé" },
  { label: "Engineer", href: "/engineer", hint: "Interactive terminal console" },
  { label: "Blog", href: "/blog", hint: "Engineering deep dives" },
  { label: "Demos", href: "/demos", hint: "Interactive visualisations" },
  { label: "Community", href: "/community", hint: "Workshops and newsletter" },
] satisfies Array<{ label: string; href: Route; hint: string }>;

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  // Navigating away must dismiss the menu; leaving it open over new content is
  // a classic mobile-nav trap.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Escape closes and returns focus to the trigger — the behaviour users have
  // learned from every other disclosure menu (Jakob's Law).
  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        toggleRef.current?.focus();
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !panelRef.current?.contains(target) &&
        !toggleRef.current?.contains(target)
      ) {
        setMobileOpen(false);
      }
    };

    // Locking the body prevents the page scrolling behind the open panel.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur-xl">
      <nav aria-label="Main" className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="Devansh Dubey — home"
            className="tap-target -ml-2 inline-flex items-center rounded-lg px-2 text-white hover:text-neutral-300"
          >
            <span className="relative text-xl font-bold tracking-tighter">
              <span aria-hidden="true">
                <span className="text-white">D</span>
                <span className="text-neutral-400">D</span>
              </span>
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-white to-transparent"
              />
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-nav
                  title={item.hint}
                  /* aria-current is what a screen reader announces as "current
                     page"; a colour change alone can't carry that. */
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-lg px-3 py-2 text-sm font-medium ${
                    active ? "text-white" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {item.label}
                  {/* A second, non-colour cue for the active page (Von
                      Restorff, and WCAG "don't rely on colour alone"). */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-white transition-opacity duration-200 ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </Link>
              );
            })}

            {/* Serial Position Effect: the highest-value action sits at the end
                of the row, where recall is strongest. */}
            <a
              href={SITE.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-nav
              className="ml-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10"
            >
              Résumé
              <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>

          <button
            ref={toggleRef}
            type="button"
            className="tap-target inline-flex items-center justify-center rounded-lg text-white hover:bg-white/10 md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileOpen ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Kept mounted and hidden so `aria-controls` always resolves. */}
        <div
          ref={panelRef}
          id="mobile-navigation"
          hidden={!mobileOpen}
          className="pb-4 md:hidden"
        >
          <ul className="mt-2 flex flex-col gap-1 rounded-2xl border border-white/10 bg-neutral-950/95 p-2 backdrop-blur-xl">
            {links.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    /* Full-width rows: a whole strip is far easier to hit on a
                       phone than a line of small text (Fitts's Law). */
                    className={`flex min-h-[52px] flex-col justify-center rounded-xl px-4 py-2 ${
                      active
                        ? "bg-white/10 text-white"
                        : "text-neutral-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="text-sm font-semibold">{item.label}</span>
                    <span className="text-xs text-neutral-500">{item.hint}</span>
                  </Link>
                </li>
              );
            })}
            <li className="px-2 pb-1 pt-2">
              <a
                href={SITE.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                Résumé
                <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
