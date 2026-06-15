"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, CircleAlert, Sparkles } from "lucide-react";
import { RiskBadge } from "@/components/RiskBadge";
import { matchStrategies } from "@/src/lib/strategyMatcher";
import type { FinderInput } from "@/src/types/strategy";

const outlooks = ["Strongly bullish", "Mildly bullish", "Neutral / range-bound", "Mildly bearish", "Strongly bearish", "Already own shares", "Want to buy shares at a lower price"];
const goals = ["Learn payoff", "Collect premium", "Define maximum risk", "Protect existing position", "Reduce entry cost", "Trade directional move"];
const assignmentOptions = ["Comfortable with assignment", "Not comfortable with assignment", "Not applicable / I do not know"];

export function StrategyFinder({ onSelectStrategy }: { onSelectStrategy: (id: string) => void }) {
  const [input, setInput] = useState<FinderInput>({
    outlook: "Want to buy shares at a lower price",
    goal: "Collect premium",
    riskPreference: "Medium",
    assignmentComfort: "Comfortable with assignment",
    experience: "Beginner"
  });
  const matches = useMemo(() => matchStrategies(input), [input]);

  return (
    <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="glass rounded-3xl p-5">
        <div className="grid gap-5">
          <Segmented label="Market outlook" value={input.outlook} options={outlooks} onChange={(outlook) => setInput((current) => ({ ...current, outlook }))} />
          <Segmented label="Goal" value={input.goal} options={goals} onChange={(goal) => setInput((current) => ({ ...current, goal }))} />
          <Segmented label="Risk preference" value={input.riskPreference} options={["Low", "Medium", "High"]} onChange={(riskPreference) => setInput((current) => ({ ...current, riskPreference: riskPreference as FinderInput["riskPreference"] }))} />
          <Segmented label="Assignment comfort" value={input.assignmentComfort} options={assignmentOptions} onChange={(assignmentComfort) => setInput((current) => ({ ...current, assignmentComfort }))} />
          <Segmented label="Experience level" value={input.experience} options={["Beginner", "Intermediate"]} onChange={(experience) => setInput((current) => ({ ...current, experience: experience as FinderInput["experience"] }))} />
        </div>
      </div>

      <div className="grid gap-4">
        {matches.map((match) => (
          <article key={match.strategy.id} className="glass rounded-3xl p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                    <Sparkles className="h-3.5 w-3.5" />
                    {match.tag}
                  </span>
                  <RiskBadge label={`Confidence: ${match.confidence}`} tone={match.confidence === "High" ? "emerald" : match.confidence === "Medium" ? "cyan" : "amber"} />
                </div>
                <h3 className="text-2xl font-semibold text-white">{match.strategy.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{match.why}</p>
              </div>
              <button
                type="button"
                className="focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white hover:border-cyan-300/40"
                onClick={() => onSelectStrategy(match.strategy.id)}
              >
                Open Strategy
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <RiskBadge label={match.strategy.riskLevel} />
              <RiskBadge label={match.strategy.complexity} />
              <RiskBadge label={match.strategy.assignmentRisk ? "Assignment risk exists" : "No assignment risk"} tone={match.strategy.assignmentRisk ? "violet" : "slate"} />
            </div>
            {match.warning ? (
              <div className="mt-4 flex gap-2 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-3 text-sm text-amber-100">
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                {match.warning}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}

function Segmented({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-slate-200">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`focus-ring rounded-full border px-3 py-2 text-sm transition ${
              value === option ? "border-cyan-300/60 bg-cyan-300/15 text-cyan-50" : "border-white/10 bg-white/[0.025] text-slate-300 hover:border-white/25"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
