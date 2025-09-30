"use client";

import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Recruiter", href: "/recruiter" },
  { label: "Engineer", href: "/engineer" },
  { label: "Blog", href: "/blog" },
  { label: "Arena", href: "/arena" },
  { label: "Leaderboard", href: "/arena/leaderboard" },
  { label: "Community", href: "/community" },
] satisfies Array<{ label: string; href: Route }>;

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight text-slate-100">
            Devansh Dubey
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium text-slate-300 transition-colors hover:text-white ${
                    isActive ? "text-blue-400" : "text-slate-300"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <a
              href="https://drive.google.com/file/d/1aVRmVG6UTHH9mZdqqRURRYZ4F0LLBrrW/view?usp=sharing"
              className="inline-flex items-center rounded-full border border-slate-700 bg-blue-500 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-400"
              download
            >
              Download Resume
            </a>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-200 transition hover:bg-slate-800 md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="pb-4 md:hidden">
            <div className="flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-900 p-4 shadow">
              {links.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-sm font-medium transition-colors ${
                      isActive ? "text-blue-400" : "text-slate-200"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <a
                href="/resume.pdf"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-blue-500 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-400"
                download
              >
                Download Resume
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
