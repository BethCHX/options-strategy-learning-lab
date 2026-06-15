"use client";

import { ArrowRight, BookOpen, ChartNoAxesCombined, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { PayoffChart } from "@/components/PayoffChart";
import { Disclaimer } from "@/components/Disclaimer";
import { calculateCashSecuredPut } from "@/src/lib/payoff";

const featureCards = [
  { title: "Strategy Finder", body: "Scenario-based matches", icon: ShieldCheck },
  { title: "Payoff Visualizer", body: "Interactive expiration chart", icon: ChartNoAxesCombined },
  { title: "Risk-first Learning", body: "Warnings before mechanics", icon: ShieldCheck }
];

export function Hero({
  onSelectStrategy,
  onNavigate
}: {
  onSelectStrategy: (id: string) => void;
  onNavigate: (sectionName: "finder" | "library") => void;
}) {
  const preview = calculateCashSecuredPut({ stockPrice: 100, strike1: 95, premium1: 2.25, contracts: 1, rangeMin: 72, rangeMax: 122 });

  return (
    <section id="top" className="soft-grid relative px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm text-cyan-100">
            <Sparkles className="h-4 w-4" />
            Education only. No trading advice.
          </div>
          <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">Option Strategy Lab</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Learn options strategies through payoff, risk, and scenario-based guidance.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => onNavigate("finder")} className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-cyan-200 px-5 py-3 text-sm font-semibold text-slate-950 shadow-glow transition hover:bg-cyan-100">
              Start Strategy Finder
              <ArrowRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => onNavigate("library")} className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:border-white/35">
              Explore Strategy Library
              <BookOpen className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-9 grid gap-3 sm:grid-cols-3">
            {featureCards.map(({ title, body, icon: Icon }) => (
              <div key={title} className="glass rounded-2xl p-4">
                <Icon className="h-5 w-5 text-emerald-200" />
                <p className="mt-3 text-sm font-semibold text-white">{title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">{body}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.65, delay: 0.08 }} className="glass rounded-[2rem] p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Sample strategy result</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">Cash-Secured Put</h2>
            </div>
            <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-xs font-medium text-amber-100">Risk: Medium</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Market view", "Mildly bullish"],
              ["Max profit", "Premium received"],
              ["Max loss", "Strike - premium"],
              ["Assignment", "Possible"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
                <p className="mt-2 text-sm font-semibold text-slate-100">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <PayoffChart points={preview.points} height={210} />
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Disclaimer compact />
            <button
              type="button"
              className="focus-ring shrink-0 rounded-full border border-cyan-300/30 px-4 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-300/10"
              onClick={() => onSelectStrategy("cash-secured-put")}
            >
              Open Strategy
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
