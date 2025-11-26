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
    <header className="glass sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl shadow-lg shadow-black/50">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center justify-center rounded-lg p-2 text-white hover:text-neutral-300 transition-all duration-300 hover:-translate-y-0.5">
            <div className="relative">
              <div className="text-xl font-bold tracking-tighter">
                <span className="text-white">D</span>
                <span className="text-neutral-400">D</span>
              </div>
              <div className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-white to-transparent"></div>
            </div>
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
                      ? "text-white"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <a
              href="https://drive.google.com/file/d/1aVRmVG6UTHH9mZdqqRURRYZ4F0LLBrrW/view?usp=sharing"
              className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:border-white/40"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Resume
            </a>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-white transition-all md:hidden hover:text-neutral-300"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="pb-4 md:hidden">
            <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-neutral-900/90 p-4 shadow-lg mt-2 backdrop-blur-xl">
              {links.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-sm font-medium transition-colors ${
                      isActive ? "text-white" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <a
                href="https://drive.google.com/file/d/1aVRmVG6UTHH9mZdqqRURRYZ4F0LLBrrW/view?usp=sharing"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-white/10"
                target="_blank"
                rel="noopener noreferrer"
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
