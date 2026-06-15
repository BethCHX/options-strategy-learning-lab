"use client";

import { useMemo, useState } from "react";
import { ChartLine, Check, ClipboardList, Layers, NotebookTabs, ShieldAlert } from "lucide-react";
import { Disclaimer } from "@/components/Disclaimer";
import { PayoffChart } from "@/components/PayoffChart";
import { RiskBadge } from "@/components/RiskBadge";
import { calculatePayoff, payoffSupported } from "@/src/lib/payoff";
import type { Strategy } from "@/src/types/strategy";

const tabs = [
  ["Overview", NotebookTabs],
  ["Structure", Layers],
  ["Payoff", ChartLine],
  ["Risk Checklist", ShieldAlert],
  ["Paper Template", ClipboardList]
] as const;

export function StrategyDetail({ strategy }: { strategy: Strategy }) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number][0]>("Overview");
  const payoff = useMemo(() => calculatePayoff(strategy.id, strategy.exampleDefaults), [strategy]);
  const supported = payoffSupported(strategy.id);

  return (
    <div className="glass rounded-[2rem] p-5 lg:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan-200">Strategy detail</p>
          <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">{strategy.name}</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">{strategy.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <RiskBadge label={strategy.category} tone="cyan" />
            <RiskBadge label={strategy.complexity} />
            <RiskBadge label={strategy.riskType} />
            <RiskBadge label={strategy.riskLevel} />
          </div>
        </div>
        <Disclaimer compact />
      </div>

      <div className="mt-7 flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/35 p-2">
        {tabs.map(([label, Icon]) => (
          <button
            key={label}
            type="button"
            onClick={() => setActiveTab(label)}
            className={`focus-ring inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              activeTab === label ? "bg-cyan-200 text-slate-950" : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "Overview" ? <Overview strategy={strategy} /> : null}
        {activeTab === "Structure" ? <Structure strategy={strategy} /> : null}
        {activeTab === "Payoff" ? <Payoff strategy={strategy} supported={supported} payoff={payoff} /> : null}
        {activeTab === "Risk Checklist" ? <Checklist strategy={strategy} /> : null}
        {activeTab === "Paper Template" ? <PaperTemplate strategy={strategy} /> : null}
      </div>
    </div>
  );
}

function Overview({ strategy }: { strategy: Strategy }) {
  const cards = [
    ["When to use", strategy.bestFor],
    ["When not to use", strategy.avoidWhen],
    ["How it makes money", strategy.maxProfitExplanation],
    ["How it loses money", strategy.maxLossExplanation],
    ["Greeks snapshot", strategy.greeksSummary],
    ["Beginner warning", strategy.beginnerWarning]
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map(([title, body]) => (
        <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">{body}</p>
        </div>
      ))}
    </div>
  );
}

function Structure({ strategy }: { strategy: Strategy }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="text-sm font-semibold text-white">Leg structure</p>
        <div className="mt-4 grid gap-3">
          {strategy.legs.map((leg, index) => (
            <div key={`${leg.action}-${leg.instrument}-${index}`} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/35 p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-300/10 text-sm font-semibold text-cyan-100">{index + 1}</span>
              <div>
                <p className="font-semibold text-white">
                  {leg.action} {leg.quantity} {leg.instrument}
                </p>
                <p className="text-sm text-slate-400">{leg.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="text-sm font-semibold text-white">Common mistakes</p>
        <div className="mt-4 grid gap-3">
          {strategy.commonMistakes.map((mistake) => (
            <div key={mistake} className="flex gap-3 rounded-2xl border border-amber-300/15 bg-amber-300/10 p-4 text-sm text-amber-100">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              {mistake}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Payoff({ strategy, supported, payoff }: { strategy: Strategy; supported: boolean; payoff: ReturnType<typeof calculatePayoff> }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
      {supported ? <PayoffChart points={payoff.points} height={320} /> : <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-6 text-slate-300">Standalone calculator support for this strategy is planned after the MVP set.</div>}
      <div className="grid gap-3">
        {[
          ["Max profit", strategy.maxProfitExplanation],
          ["Max loss", strategy.maxLossExplanation],
          ["Breakeven", strategy.breakevenExplanation],
          ["Model output", `${payoff.maxProfit} max profit / ${payoff.maxLoss} max loss / breakeven ${payoff.breakeven}`]
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-100">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Checklist({ strategy }: { strategy: Strategy }) {
  const items = [
    "Do I understand max loss?",
    "Do I understand assignment?",
    "Do I understand expiration?",
    "Do I know my exit plan?",
    "Am I using this for education/paper practice only?"
  ];
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item) => (
        <label key={item} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-200">
          <input type="checkbox" className="h-4 w-4 accent-cyan-300" />
          {item}
        </label>
      ))}
      <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100 md:col-span-2">
        {strategy.assignmentRisk ? "This strategy includes assignment risk. Understand what assignment would mean before using a paper template." : "This strategy is modeled without short-option assignment risk, but expiration and liquidity assumptions still matter."}
      </div>
    </div>
  );
}

function PaperTemplate({ strategy }: { strategy: Strategy }) {
  const template = [
    "Ticker:",
    `Strategy: ${strategy.name}`,
    `Market view: ${strategy.outlook}`,
    "Entry reason:",
    "Expiration:",
    "Strike(s):",
    "Premium:",
    `Max profit: ${strategy.maxProfitExplanation}`,
    `Max loss: ${strategy.maxLossExplanation}`,
    "Exit rule:",
    "What would prove me wrong:",
    "Lesson after exit:"
  ].join("\n");

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
      <pre className="overflow-auto rounded-2xl border border-white/10 bg-slate-950/60 p-5 text-sm leading-7 text-slate-200">{template}</pre>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-center gap-2 text-emerald-100">
          <Check className="h-5 w-5" />
          <p className="font-semibold">Educational paper template only</p>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          This template is a learning journal prompt. It does not place orders, connect to brokers, or use live market data.
        </p>
      </div>
    </div>
  );
}
