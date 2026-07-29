"use client";

import { useEffect, useState } from "react";

/**
 * Tracks the user's `prefers-reduced-motion` setting.
 *
 * CSS handles most of the reduced-motion work, but a few effects here are
 * JavaScript-driven (canvas particle fields, the intro overlay, smooth
 * scrolling) and have to be skipped rather than sped up.
 *
 * Starts `false` so server and first client render agree, then corrects on
 * mount.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
