import type { Metadata } from "next";
import TriviaArena from "@/components/TriviaArena";

export const metadata: Metadata = {
  title: "Trivia Arena | Polymath Knowledge Challenge",
  description:
    "Test your knowledge across technology, physics, economics, history, and sports. Multi-domain trivia challenges for the modern polymath.",
};

export default function TriviaPage() {
  return (
    <div className="min-h-screen text-slate-100">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-16">
        <TriviaArena />
      </div>
    </div>
  );
}
