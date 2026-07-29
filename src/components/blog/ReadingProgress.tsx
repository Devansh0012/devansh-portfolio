"use client";

import { useEffect, useState } from "react";

/**
 * Thin progress bar pinned under the navbar while reading an article.
 *
 * Goal-Gradient Effect: motivation to finish rises the closer the end feels.
 * A long technical post with no visible end looks like an open-ended
 * commitment; showing "you're 70% through" is what converts a skim into a
 * finished read.
 *
 * It's deliberately a 2px hairline — this is ambient feedback, not a control,
 * and it must never compete with the article for attention.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      // A page shorter than the viewport has nothing to track.
      setProgress(scrollable <= 0 ? 0 : Math.min(window.scrollY / scrollable, 1));
    };

    // Coalesce to one measurement per frame; reading layout on every scroll
    // event is the classic way to make a page feel heavier than it is.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      role="progressbar"
      aria-label="Article reading progress"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="sticky top-16 z-40 h-0.5 w-full bg-white/10"
    >
      <div
        className="reading-progress h-full bg-white"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
