import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ChevronRight } from "lucide-react";
import { demos } from "@/lib/data";
import type { Route } from "next";

export const metadata: Metadata = {
  // The root layout appends "| Devansh Dubey" via its title template, so the
  // old value rendered as "Interactive Demos - Devansh Dubey | Devansh Dubey".
  title: "Interactive Demos",
  description:
    "Interactive visualizations and simulations of algorithms, data structures, and systems concepts.",
};

export default function DemosPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1 text-xs text-neutral-500">
              <li>
                <Link
                  href="/engineer"
                  className="inline-flex min-h-[32px] items-center rounded px-1 hover:text-white"
                >
                  Engineer
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3 w-3" />
              </li>
              <li>
                <span aria-current="page" className="px-1 text-neutral-300">
                  Demos
                </span>
              </li>
            </ol>
          </nav>
          <div className="mt-2">
            <h1 className="text-2xl font-bold text-white">Interactive Demos</h1>
            <p className="mt-1 text-sm text-neutral-400">
              {demos.length} visualisations and simulations, all running in your browser.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {demos.map((demo) => (
            <li key={demo.id}>
              <Link
                href={demo.path as Route}
                className="group flex h-full flex-col rounded-xl border border-white/10 bg-white/5 p-6 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <span className="rounded bg-cyan-400/10 px-2 py-1 text-xs font-medium text-cyan-300">
                    {demo.category}
                  </span>
                  {/* An ExternalLink icon used to sit here, on links that stay
                      inside the site. Iconography is a promise about what
                      happens next (Jakob's Law) — an arrow that moves forward
                      is the honest version. */}
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-neutral-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white"
                  />
                </div>

                <h2 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-cyan-300">
                  {demo.title}
                </h2>

                <p className="mb-4 text-sm text-neutral-400">{demo.description}</p>

                <ul className="mt-auto flex flex-wrap gap-2">
                  {demo.tech.map((tech) => (
                    <li
                      key={tech}
                      className="rounded border border-white/10 px-2 py-0.5 text-xs text-neutral-500"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </Link>
            </li>
          ))}
        </ul>

        <section
          aria-labelledby="about-demos"
          className="mt-12 rounded-xl border border-white/10 bg-white/5 p-6"
        >
          <h2 id="about-demos" className="mb-4 text-xl font-semibold text-white">
            About these demos
          </h2>
          <div className="measure space-y-3 text-sm text-neutral-400">
            <p>
              These interactive demos visualise algorithms, data structures, and systems concepts.
              Each one is fully interactive and runs entirely in your browser — nothing is sent to
              a server.
            </p>
            <p>
              The visualisations demonstrate real-world concepts used in production systems, from
              fundamental algorithms to distributed systems patterns.
            </p>
            <p className="text-xs text-neutral-500">
              Built with React, TypeScript, WebAssembly, and WebGL.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
