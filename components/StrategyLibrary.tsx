"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { StrategyCard } from "@/components/StrategyCard";
import { strategies } from "@/src/data/strategies";
import type { Complexity, RiskType, StrategyCategory } from "@/src/types/strategy";

const all = "All";

export function StrategyLibrary({ selectedId, onSelectStrategy }: { selectedId: string; onSelectStrategy: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [outlook, setOutlook] = useState(all);
  const [category, setCategory] = useState<typeof all | StrategyCategory>(all);
  const [complexity, setComplexity] = useState<typeof all | Complexity>(all);
  const [riskType, setRiskType] = useState<typeof all | RiskType>(all);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return strategies.filter((strategy) => {
      const matchesSearch = !normalized || `${strategy.name} ${strategy.summary} ${strategy.outlook}`.toLowerCase().includes(normalized);
      return (
        matchesSearch &&
        (outlook === all || strategy.outlook === outlook) &&
        (category === all || strategy.category === category) &&
        (complexity === all || strategy.complexity === complexity) &&
        (riskType === all || strategy.riskType === riskType)
      );
    });
  }, [category, complexity, outlook, query, riskType]);

  return (
    <div className="space-y-5">
      <div className="glass rounded-3xl p-4">
        <div className="grid gap-3 lg:grid-cols-[1.2fr_repeat(4,0.7fr)]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              className="focus-ring w-full rounded-2xl border border-white/10 bg-slate-950/40 px-10 py-3 text-sm text-white placeholder:text-slate-500"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search strategies"
            />
          </label>
          <Filter value={outlook} onChange={setOutlook} options={[all, ...Array.from(new Set(strategies.map((strategy) => strategy.outlook)))]} label="Outlook" />
          <Filter value={category} onChange={(value) => setCategory(value as typeof all | StrategyCategory)} options={[all, "Directional", "Income", "Protection", "Spread", "Volatility"]} label="Type" />
          <Filter value={complexity} onChange={(value) => setComplexity(value as typeof all | Complexity)} options={[all, "Beginner", "Intermediate", "Advanced"]} label="Complexity" />
          <Filter value={riskType} onChange={(value) => setRiskType(value as typeof all | RiskType)} options={[all, "Defined risk", "Assignment risk", "Premium at risk", "Advanced multi-leg"]} label="Risk type" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((strategy) => (
          <StrategyCard key={strategy.id} strategy={strategy} selected={strategy.id === selectedId} onSelect={onSelectStrategy} />
        ))}
      </div>
    </div>
  );
}

function Filter({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-medium text-slate-400">{label}</span>
      <select className="focus-ring rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-3 text-sm text-white" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
