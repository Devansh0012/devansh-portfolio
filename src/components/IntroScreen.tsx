"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LetterRadialIntro } from "@/components/LetterRadialIntro";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { SITE } from "@/lib/site";

interface IntroScreenProps {
  children: React.ReactNode;
}

const nameLetters = "DEVANSHDUBEY".split("");

/**
 * A brand moment that a visitor can always walk out of.
 *
 * The previous version held every first-time visitor behind an opaque overlay
 * for a fixed three seconds with no way out. Three problems:
 *
 * - Doherty Threshold: interaction should feel unbroken past ~400ms. Three
 *   seconds of enforced waiting is roughly seven times that, and the visitor
 *   has nothing to do in the meantime.
 * - Paradox of the Active User: people don't wait to be introduced to an
 *   interface, they start using it. Any key, click, tap, or scroll now
 *   dismisses the overlay, plus there's an explicit "Skip" button for anyone
 *   who wants to be told they can leave.
 * - Reduced motion: an animated full-screen takeover is precisely what that
 *   preference exists to suppress, so it's skipped outright.
 *
 * The duration is also cut to 1.8s — long enough to land as deliberate
 * (Peak-End Rule: openings are disproportionately remembered), short enough
 * not to read as a loading screen.
 */
const INTRO_DURATION_MS = 1800;
const SEEN_KEY = "hasSeenIntro";

export function IntroScreen({ children }: IntroScreenProps) {
  const reducedMotion = useReducedMotion();
  const [showIntro, setShowIntro] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  const dismiss = React.useCallback(() => {
    setShowIntro(false);
    // Recorded on dismissal *and* on show, so navigating away mid-intro never
    // resurfaces it later in the same session.
    try {
      sessionStorage.setItem(SEEN_KEY, "true");
    } catch {
      // Private browsing can throw on write; the intro simply repeats.
    }
  }, []);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted || reducedMotion) return;

    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "true";
    } catch {
      seen = false;
    }
    if (seen) return;

    try {
      sessionStorage.setItem(SEEN_KEY, "true");
    } catch {
      // Ignore; see above.
    }

    setShowIntro(true);
    const timer = window.setTimeout(() => setShowIntro(false), INTRO_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [mounted, reducedMotion]);

  // Any intent to interact ends the intro immediately.
  React.useEffect(() => {
    if (!showIntro) return;

    const onKeyDown = () => dismiss();
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("wheel", dismiss, { passive: true });
    window.addEventListener("touchstart", dismiss, { passive: true });

    // Freeze the page underneath so a scroll gesture doesn't move content the
    // visitor can't yet see.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("touchstart", dismiss);
      document.body.style.overflow = previousOverflow;
    };
  }, [showIntro, dismiss]);

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={dismiss}
            /* Announced as a modal so assistive tech reports something is
               covering the page, and the first thing inside it is the way
               out. The overlay can't be aria-hidden: it holds a focusable
               control, and hiding focusable content strands keyboard users. */
            role="dialog"
            aria-modal="true"
            aria-labelledby="intro-name"
            className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-black"
          >
            <div className="flex flex-col items-center gap-8">
              <div aria-hidden="true">
                <LetterRadialIntro letters={nameLetters} stageSize={320} letterSize={60} />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-center"
              >
                {/* A <p>, not an <h1> — the hero underneath owns the page's
                    single top-level heading. */}
                <p id="intro-name" className="text-5xl font-semibold text-white md:text-6xl">
                  {SITE.name}
                </p>
                <p className="mt-3 text-sm uppercase tracking-[0.35em] text-neutral-400">
                  {SITE.role}
                </p>
              </motion.div>
            </div>

            <button
              type="button"
              autoFocus
              onClick={dismiss}
              className="absolute bottom-8 right-8 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-medium text-neutral-400 hover:border-white/50 hover:text-white"
            >
              Skip intro
              <span aria-hidden="true">→</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
