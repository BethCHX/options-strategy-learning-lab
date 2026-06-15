"use client";

import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Disclaimer } from "@/components/Disclaimer";
import { PayoffChart } from "@/components/PayoffChart";
import { RiskBadge } from "@/components/RiskBadge";
import { strategies } from "@/src/data/strategies";
import { calculatePayoff, payoffSupported } from "@/src/lib/payoff";
import type { PayoffDefaults } from "@/src/types/strategy";

const supportedStrategies = strategies.filter((strategy) => payoffSupported(strategy.id));

export function PayoffVisualizer({ selectedStrategyId }: { selectedStrategyId: string }) {
  const initial = supportedStrategies.find((strategy) => strategy.id === selectedStrategyId) ?? supportedStrategies[0];
  const [strategyId, setStrategyId] = useState(initial.id);
  const selected = supportedStrategies.find((strategy) => strategy.id === strategyId) ?? supportedStrategies[0];
  const [inputs, setInputs] = useState<PayoffDefaults>(selected.exampleDefaults);

  useEffect(() => {
    if (payoffSupported(selectedStrategyId)) {
      const next = supportedStrategies.find((strategy) => strategy.id === selectedStrategyId);
      if (next) {
        setStrategyId(next.id);
        setInputs(next.exampleDefaults);
      }
    }
  }, [selectedStrategyId]);

  const payoff = useMemo(() => calculatePayoff(strategyId, inputs), [inputs, strategyId]);
  const needsFour = strategyId === "iron-condor";
  const needsTwo = ["bull-call-spread", "bear-put-spread", "bull-put-spread", "bear-call-spread", "iron-condor"].includes(strategyId);

  return (
    <div className="glass rounded-[2rem] p-5 lg:p-7">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-cyan-200">
            <SlidersHorizontal className="h-5 w-5" />
            <p className="text-sm font-medium">Simplified expiration payoff</p>
          </div>
          <h3 className="mt-2 text-2xl font-semibold text-white">{selected.name}</h3>
        </div>
        <Disclaimer compact />
      </div>
      <div className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
        <div className="grid gap-4 rounded-3xl border border-white/10 bg-slate-950/35 p-4 sm:grid-cols-2 xl:grid-cols-1">
          <label className="grid gap-1 sm:col-span-2 xl:col-span-1">
            <span className="text-xs font-medium text-slate-400">Strategy selector</span>
            <select
              className="focus-ring rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-sm text-white"
              value={strategyId}
              onChange={(event) => {
                const next = supportedStrategies.find((strategy) => strategy.id === event.target.value) ?? supportedStrategies[0];
                setStrategyId(next.id);
                setInputs(next.exampleDefaults);
              }}
            >
              {supportedStrategies.map((strategy) => (
                <option key={strategy.id} value={strategy.id}>
                  {strategy.name}
                </option>
              ))}
            </select>
          </label>
          <NumberField label="Current stock price" value={inputs.stockPrice} onChange={(stockPrice) => setInputs((current) => ({ ...current, stockPrice }))} />
          <NumberField label="Strike 1" value={inputs.strike1} onChange={(strike1) => setInputs((current) => ({ ...current, strike1 }))} />
          {needsTwo ? <NumberField label="Strike 2" value={inputs.strike2 ?? inputs.strike1 + 10} onChange={(strike2) => setInputs((current) => ({ ...current, strike2 }))} /> : null}
          {needsFour ? (
            <>
              <NumberField label="Strike 3" value={inputs.strike3 ?? 110} onChange={(strike3) => setInputs((current) => ({ ...current, strike3 }))} />
              <NumberField label="Strike 4" value={inputs.strike4 ?? 115} onChange={(strike4) => setInputs((current) => ({ ...current, strike4 }))} />
            </>
          ) : null}
          <NumberField label="Premium paid/received" value={inputs.premium1} step={0.25} onChange={(premium1) => setInputs((current) => ({ ...current, premium1 }))} />
          {needsTwo ? <NumberField label="Premium 2" value={inputs.premium2 ?? 0} step={0.25} onChange={(premium2) => setInputs((current) => ({ ...current, premium2 }))} /> : null}
          {needsFour ? (
            <>
              <NumberField label="Premium 3" value={inputs.premium3 ?? 0} step={0.25} onChange={(premium3) => setInputs((current) => ({ ...current, premium3 }))} />
              <NumberField label="Premium 4" value={inputs.premium4 ?? 0} step={0.25} onChange={(premium4) => setInputs((current) => ({ ...current, premium4 }))} />
            </>
          ) : null}
          <NumberField label="Contracts" value={inputs.contracts} min={1} step={1} onChange={(contracts) => setInputs((current) => ({ ...current, contracts }))} />
          <NumberField label="Range min" value={inputs.rangeMin} onChange={(rangeMin) => setInputs((current) => ({ ...current, rangeMin }))} />
          <NumberField label="Range max" value={inputs.rangeMax} onChange={(rangeMax) => setInputs((current) => ({ ...current, rangeMax }))} />
        </div>
        <div className="grid gap-4">
          <PayoffChart points={payoff.points} height={380} />
          <div className="grid gap-3 md:grid-cols-4">
            {[
              ["Max profit", payoff.maxProfit],
              ["Max loss", payoff.maxLoss],
              ["Breakeven", payoff.breakeven],
              ["Strategy type", payoff.strategyType]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
                <p className="mt-2 text-sm font-semibold leading-5 text-white">{value}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {payoff.riskNotes.map((note) => (
              <RiskBadge key={note} label={note} tone="amber" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NumberField({ label, value, onChange, min = 0, step = 1 }: { label: string; value: number; onChange: (value: number) => void; min?: number; step?: number }) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-medium text-slate-400">{label}</span>
      <input
        className="focus-ring rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-3 text-sm text-white"
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
