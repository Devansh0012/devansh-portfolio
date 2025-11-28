import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { demos } from "@/lib/data";
import type { Route } from "next";

export const metadata = {
  title: "Interactive Demos - Devansh Dubey",
  description:
    "Interactive visualizations and simulations of algorithms, data structures, and systems concepts.",
};

export default function DemosPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/engineer"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Interactive Demos
              </h1>
              <p className="text-sm text-neutral-400">
                Visualizations and simulations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Demos Grid */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demos.map((demo) => (
            <Link
              key={demo.id}
              href={demo.path as Route}
              className="group bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-medium text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">
                  {demo.category}
                </span>
                <ExternalLink className="h-4 w-4 text-neutral-500 group-hover:text-white transition-colors" />
              </div>

              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {demo.title}
              </h3>

              <p className="text-sm text-neutral-400 mb-4">
                {demo.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {demo.tech.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs text-neutral-500 border border-white/10 rounded px-2 py-0.5"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            About These Demos
          </h2>
          <div className="space-y-3 text-neutral-400 text-sm">
            <p>
              These interactive demos are built to help visualize complex
              algorithms, data structures, and systems concepts. Each demo is
              fully interactive and runs entirely in your browser.
            </p>
            <p>
              The visualizations demonstrate real-world concepts used in
              production systems, from fundamental algorithms to distributed
              systems patterns.
            </p>
            <p className="text-neutral-500 text-xs mt-4">
              Built with React, TypeScript, and modern web technologies. All
              demos are open source and available in my portfolio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
