"use client";

import { GravityStarsBackground } from "@/components/animate-ui/components/backgrounds/gravity-stars";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * The ambient star field, in one place.
 *
 * Three reasons this exists rather than each page calling the canvas directly:
 *
 * - Reduced motion. A continuously animating particle field is exactly what
 *   `prefers-reduced-motion` is for. CSS can't stop a requestAnimationFrame
 *   loop, so the component is unmounted instead.
 * - Selective Attention. Decoration that moves competes with the content for
 *   the visitor's limited attention, so the density is tuned once, here, and
 *   the layer is marked `aria-hidden` so it never reaches the accessibility
 *   tree.
 * - Consistency (Law of Similarity). Every page previously repeated the same
 *   four props by hand; one drifting value would make a page feel "off"
 *   without anyone being able to say why.
 */
export function SiteBackground({ className = "absolute inset-0 -z-10" }: { className?: string }) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return null;

  return (
    <div aria-hidden="true" data-decorative-motion className={className}>
      <GravityStarsBackground className="size-full" starsCount={100} starsSize={2} />
    </div>
  );
}
