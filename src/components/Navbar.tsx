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
    <header className="glass sticky top-0 z-50 shadow-lg shadow-slate-900/20">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight text-slate-100 hover:text-blue-400 transition-colors">
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
                  className={`text-sm font-medium transition-colors ${
                    isActive 
                      ? "text-blue-400" 
                      : "text-slate-300 hover:text-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <a
              href="https://drive.google.com/file/d/1aVRmVG6UTHH9mZdqqRURRYZ4F0LLBrrW/view?usp=sharing"
              className="glass-card glass-hover inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Resume
            </a>
          </div>

          <button
            type="button"
            className="glass-card glass-hover inline-flex items-center justify-center rounded-md p-2 text-slate-200 transition-all md:hidden hover:text-slate-100"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="pb-4 md:hidden">
            <div className="glass-card flex flex-col gap-3 rounded-lg p-4 shadow-lg mt-2">
              {links.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-sm font-medium transition-colors ${
                      isActive ? "text-blue-400" : "text-slate-200 hover:text-slate-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <a
                href="/resume.pdf"
                onClick={() => setMobileOpen(false)}
                className="glass-hover inline-flex items-center justify-center rounded-full border border-slate-600/50 px-4 py-2 text-sm font-semibold text-slate-100 shadow-sm transition-all hover:-translate-y-0.5"
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
