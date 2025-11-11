import type { Metadata } from "next";
import ConnectionsGame from "@/components/ConnectionsGame";

export const metadata: Metadata = {
  title: "Connections Game | Word Puzzle Challenge",
  description:
    "Find groups of four related words in this NYT-style puzzle game. Categories span technology, physics, economics, sports, and more.",
};

export default function ConnectionsPage() {
  return (
    <div className="min-h-screen text-slate-100">
      <div className="mx-auto max-w-4xl px-4 pb-24 pt-16">
        <ConnectionsGame />
      </div>
    </div>
  );
}
