import type { Metadata } from "next";
import Link from "next/link";
import HistoricalTimeline from "@/components/HistoricalTimeline";
import KnowledgeGraph from "@/components/KnowledgeGraph";
import PolymathFactsWidget from "@/components/PolymathFactsWidget";
import ReadingRoom from "@/components/ReadingRoom";
import PhysicsPlayground from "@/components/PhysicsPlayground";
import { BookOpen, Atom, TrendingUp, Trophy, Code, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Explorer Mode",
  description:
    "Dive into the intersection of history, physics, economics, sports, and technology. Explore timelines, knowledge graphs, and fascinating facts across multiple domains.",
};

export default function ExplorerPage() {
  return (
    <div className="min-h-screen text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="constellation-bg stars">
          <div className="mx-auto max-w-6xl px-4 pb-16 pt-20 text-center md:pt-24">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-600/30 bg-amber-600/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400 mb-6">
              <Sparkles className="h-3 w-3" />
              Explorer Mode
            </div>
            <h1 className="text-glow mb-6 text-4xl font-semibold leading-tight text-slate-100 md:text-6xl">
              The Polymath&apos;s Observatory
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-slate-300 leading-relaxed">
              Where history meets technology, physics intersects with coding, economics explains innovation,
              and sports analogies make complex systems intuitive. Explore the connections that shape how we
              build resilient software.
            </p>
          </div>
        </div>
      </section>

      {/* Interest Pillars */}
      <section className="border-t border-slate-800/50 bg-slate-950/50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-100">
            Six Domains, Infinite Connections
          </h2>
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
            <div className="glass-card group cursor-pointer rounded-2xl p-6 text-center transition-all hover:-translate-y-2">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-600/20">
                <BookOpen className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="mb-2 text-sm font-semibold text-amber-400">History</h3>
              <p className="text-xs text-slate-400">Learning from tech evolution</p>
            </div>

            <div className="glass-card group cursor-pointer rounded-2xl p-6 text-center transition-all hover:-translate-y-2">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/20">
                <Atom className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="mb-2 text-sm font-semibold text-blue-400">Physics</h3>
              <p className="text-xs text-slate-400">Laws governing our systems</p>
            </div>

            <div className="glass-card group cursor-pointer rounded-2xl p-6 text-center transition-all hover:-translate-y-2">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/20">
                <TrendingUp className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="mb-2 text-sm font-semibold text-emerald-400">Economics</h3>
              <p className="text-xs text-slate-400">Value & resource optimization</p>
            </div>

            <div className="glass-card group cursor-pointer rounded-2xl p-6 text-center transition-all hover:-translate-y-2">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-600/20">
                <Trophy className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="mb-2 text-sm font-semibold text-orange-400">Sports</h3>
              <p className="text-xs text-slate-400">Performance & strategy</p>
            </div>

            <div className="glass-card group cursor-pointer rounded-2xl p-6 text-center transition-all hover:-translate-y-2">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-violet-600/20">
                <Code className="h-6 w-6 text-violet-400" />
              </div>
              <h3 className="mb-2 text-sm font-semibold text-violet-400">Technology</h3>
              <p className="text-xs text-slate-400">Systems that scale & endure</p>
            </div>

            <div className="glass-card group cursor-pointer rounded-2xl p-6 text-center transition-all hover:-translate-y-2">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-pink-600/20">
                <Sparkles className="h-6 w-6 text-pink-400" />
              </div>
              <h3 className="mb-2 text-sm font-semibold text-pink-400">Synthesis</h3>
              <p className="text-xs text-slate-400">Where all knowledge meets</p>
            </div>
          </div>
        </div>
      </section>

      {/* Polymath Facts Widget */}
      <section className="border-t border-slate-800/50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-100">Daily Polymath Facts</h2>
            <p className="text-slate-400">
              Fascinating insights spanning history, physics, economics, sports, and technology
            </p>
          </div>
          <PolymathFactsWidget />
        </div>
      </section>

      {/* Knowledge Graph */}
      <section className="border-t border-slate-800/50 bg-slate-950/50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-100">Knowledge Graph</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Interactive visualization showing how different domains connect and influence each other.
              Hover over nodes to explore relationships.
            </p>
          </div>
          <div className="glass-card rounded-3xl p-8">
            <KnowledgeGraph />
          </div>
        </div>
      </section>

      {/* Historical Timeline - Main Feature */}
      <section className="border-t border-slate-800/50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <HistoricalTimeline />
        </div>
      </section>

      {/* Reading Room */}
      <section className="border-t border-slate-800/50 bg-slate-950/50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <ReadingRoom />
        </div>
      </section>

      {/* Physics Playground */}
      <section className="border-t border-slate-800/50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <PhysicsPlayground />
        </div>
      </section>

      {/* Call to Action */}
      <section className="border-t border-slate-800/50 bg-slate-950/50">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h2 className="mb-6 text-3xl font-bold text-slate-100">
            Build Together
          </h2>
          <p className="mb-8 text-lg text-slate-300">
            These connections inform how I approach software engineering - resilient systems inspired
            by physics, economically sustainable architecture, and performance metrics borrowed from sports.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/engineer"
              className="glass-card glass-hover inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-blue-400 transition-all hover:-translate-y-1"
            >
              <Code className="h-4 w-4" />
              View Engineering Work
            </Link>
            <Link
              href="/arena"
              className="glass-card glass-hover inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-violet-400 transition-all hover:-translate-y-1"
            >
              <Trophy className="h-4 w-4" />
              Test Your Skills in Arena
            </Link>
            <Link
              href="/blog"
              className="glass-card glass-hover inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-emerald-400 transition-all hover:-translate-y-1"
            >
              <BookOpen className="h-4 w-4" />
              Read Deep Dives
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
