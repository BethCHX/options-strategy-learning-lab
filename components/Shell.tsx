"use client";

import { FlaskConical, Menu } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

const navItems = [
  ["Finder", "finder"],
  ["Library", "library"],
  ["Detail", "detail"],
  ["Visualizer", "visualizer"],
  ["Formula Check", "formulaCheck"],
  ["Learn", "learn"]
] as const;

type NavSection = (typeof navItems)[number][1] | "hero";

export function Shell({ children, onNavigate }: { children: ReactNode; onNavigate: (sectionName: NavSection) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-hidden">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <button type="button" onClick={() => onNavigate("hero")} className="focus-ring flex items-center gap-3 text-left" aria-label="Option Strategy Lab home">
            <span className="rounded-xl border border-cyan-300/25 bg-cyan-300/10 p-2 text-cyan-200 shadow-glow">
              <FlaskConical className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-white">Option Strategy Lab</span>
              <span className="block text-xs text-slate-400">options-strategy-learning-lab</span>
            </span>
          </button>
          <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 md:flex">
            {navItems.map(([label, sectionName]) => (
              <button key={sectionName} type="button" onClick={() => onNavigate(sectionName)} className="focus-ring rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white">
                {label}
              </button>
            ))}
          </div>
          <button
            className="focus-ring rounded-xl border border-white/10 p-2 text-slate-200 md:hidden"
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        </nav>
        {open ? (
          <div className="border-t border-white/10 px-4 py-3 md:hidden">
            <div className="grid gap-2">
              {navItems.map(([label, sectionName]) => (
                <button
                  key={sectionName}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onNavigate(sectionName);
                  }}
                  className="focus-ring rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-slate-200"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </header>
      {children}
    </div>
  );
}
