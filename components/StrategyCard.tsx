"use client";

import { ArrowUpRight } from "lucide-react";
import { RiskBadge } from "@/components/RiskBadge";
import type { Strategy } from "@/src/types/strategy";

export function StrategyCard({
  strategy,
  selected,
  onSelect
}: {
  strategy: Strategy;
  selected?: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <article className={`glass flex h-full flex-col rounded-2xl p-5 transition hover:-translate-y-1 hover:border-cyan-300/35 ${selected ? "border-cyan-300/45" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{strategy.category}</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{strategy.name}</h3>
        </div>
        <RiskBadge label={strategy.complexity} />
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">{strategy.summary}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <RiskBadge label={strategy.riskType} />
        <RiskBadge label={strategy.riskLevel} />
        {strategy.assignmentRisk ? <RiskBadge label="Assignment risk" /> : <RiskBadge label="No assignment risk" tone="slate" />}
      </div>
      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-sm text-slate-300">
        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Outlook</p>
        <p className="mt-1 font-medium text-slate-100">{strategy.outlook}</p>
      </div>
      <button
        type="button"
        onClick={() => onSelect(strategy.id)}
        className="focus-ring mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white transition hover:border-cyan-300/40"
      >
        View details
        <ArrowUpRight className="h-4 w-4" />
      </button>
    </article>
  );
}
