"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LetterRadialIntro } from "@/components/LetterRadialIntro";

interface IntroScreenProps {
  children: React.ReactNode;
}

// Split "DEVANSH DUBEY" into individual letters
const nameLetters = "DEVANSHDUBEY".split("");

export function IntroScreen({ children }: IntroScreenProps) {
  const [showIntro, setShowIntro] = React.useState(false);

  React.useEffect(() => {
    // Check if intro has been shown before
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");

    if (!hasSeenIntro) {
      setShowIntro(true);

      // Hide intro after 3 seconds
      const timer = setTimeout(() => {
        setShowIntro(false);
        sessionStorage.setItem("hasSeenIntro", "true");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          >
            <div className="flex flex-col items-center gap-8">
              <LetterRadialIntro letters={nameLetters} stageSize={320} letterSize={60} />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-center"
              >
                <h1 className="text-5xl font-semibold text-white md:text-6xl">
                  Devansh Dubey
                </h1>
                <p className="mt-3 text-sm uppercase tracking-[0.35em] text-neutral-400">
                  Software Development Engineer
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
