"use client";

import { useEffect, useState } from "react";

type Section = { id: string; label: string };

/**
 * A sticky, self-highlighting index for long single-scroll pages.
 *
 * The recruiter page is seven stacked sections deep. Without a map, a visitor
 * has no idea how much is left or how to get back to a section they've already
 * passed:
 *
 * - Chunking / Miller's Law: naming the parts turns one undifferentiated scroll
 *   into a handful of labelled units someone can actually hold in mind.
 * - Goal-Gradient Effect: seeing "5 of 7" makes finishing feel close, which is
 *   exactly when people speed up rather than bounce.
 * - Fitts's Law: the section a visitor wants is one click away instead of an
 *   indeterminate amount of scrolling.
 */
export function SectionNav({ sections }: { sections: Section[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null);

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // The topmost section currently intersecting wins, so the highlight
        // tracks reading position rather than whichever entry fired last.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActiveId(visible[0].target.id);
      },
      {
        // Bias the detection band to the upper part of the viewport: the
        // heading a reader is "on" is the one near the top, not the middle.
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0,
      }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sections]);

  const activeIndex = sections.findIndex((section) => section.id === activeId);

  return (
    <nav
      aria-label="Page sections"
      className="sticky top-16 z-40 -mx-4 border-y border-white/10 bg-black/85 px-4 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-4">
        <ul className="flex flex-1 gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sections.map((section) => {
            const active = section.id === activeId;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={active ? "true" : undefined}
                  className={`inline-flex min-h-[36px] items-center whitespace-nowrap rounded-full px-3 text-xs font-semibold ${
                    active
                      ? "bg-white text-black"
                      : "text-neutral-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {section.label}
                </a>
              </li>
            );
          })}
        </ul>
        <p className="hidden shrink-0 text-xs tabular-nums text-neutral-500 sm:block">
          {Math.max(activeIndex + 1, 1)} / {sections.length}
        </p>
      </div>
    </nav>
  );
}
