import { Check, CircleDollarSign } from "lucide-react";

type FormulaExample = {
  name: string;
  inputs: string[];
  expectedBreakeven: string;
  expectedMaxProfit: string;
  expectedMaxLoss: string;
  rows: Array<{
    expirationPrice: number;
    profitLoss: number;
  }>;
};

const examples: FormulaExample[] = [
  {
    name: "Long Call",
    inputs: ["Strike 100", "Premium paid 5", "Contract multiplier 100"],
    expectedBreakeven: "105",
    expectedMaxProfit: "Unlimited",
    expectedMaxLoss: "$500",
    rows: [
      { expirationPrice: 90, profitLoss: -500 },
      { expirationPrice: 100, profitLoss: -500 },
      { expirationPrice: 105, profitLoss: 0 },
      { expirationPrice: 110, profitLoss: 500 }
    ]
  },
  {
    name: "Long Put",
    inputs: ["Strike 100", "Premium paid 5", "Contract multiplier 100"],
    expectedBreakeven: "95",
    expectedMaxProfit: "$9,500 if stock goes to zero",
    expectedMaxLoss: "$500",
    rows: [
      { expirationPrice: 110, profitLoss: -500 },
      { expirationPrice: 100, profitLoss: -500 },
      { expirationPrice: 95, profitLoss: 0 },
      { expirationPrice: 90, profitLoss: 500 }
    ]
  },
  {
    name: "Cash-Secured Put",
    inputs: ["Strike 100", "Premium received 5", "Contract multiplier 100"],
    expectedBreakeven: "95",
    expectedMaxProfit: "$500",
    expectedMaxLoss: "$9,500",
    rows: [
      { expirationPrice: 110, profitLoss: 500 },
      { expirationPrice: 100, profitLoss: 500 },
      { expirationPrice: 95, profitLoss: 0 },
      { expirationPrice: 90, profitLoss: -500 }
    ]
  },
  {
    name: "Covered Call",
    inputs: ["Own stock at cost 100", "Sell call strike 105", "Premium received 3", "Contract multiplier 100"],
    expectedBreakeven: "97",
    expectedMaxProfit: "$800",
    expectedMaxLoss: "Substantial stock downside",
    rows: [
      { expirationPrice: 90, profitLoss: -700 },
      { expirationPrice: 100, profitLoss: 300 },
      { expirationPrice: 105, profitLoss: 800 },
      { expirationPrice: 110, profitLoss: 800 }
    ]
  },
  {
    name: "Bull Call Spread",
    inputs: ["Buy call strike 100, premium paid 5", "Sell call strike 110, premium received 2", "Net debit 3", "Contract multiplier 100"],
    expectedBreakeven: "103",
    expectedMaxProfit: "$700",
    expectedMaxLoss: "$300",
    rows: [
      { expirationPrice: 95, profitLoss: -300 },
      { expirationPrice: 100, profitLoss: -300 },
      { expirationPrice: 103, profitLoss: 0 },
      { expirationPrice: 110, profitLoss: 700 },
      { expirationPrice: 120, profitLoss: 700 }
    ]
  }
];

export function FormulaCheck() {
  return (
    <div className="space-y-5">
      <div className="glass rounded-[2rem] p-5 lg:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-200">Educational validation</p>
            <h3 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Formula Check</h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              These fixed examples help verify the payoff logic without reading code. Compare the inputs, breakeven,
              max profit, max loss, and expiration P/L table for each strategy.
            </p>
          </div>
          <div className="flex max-w-xl gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
            <CircleDollarSign className="mt-0.5 h-4 w-4 shrink-0" />
            These examples are simplified and ignore commissions, taxes, dividends, early assignment, margin, and IV changes.
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {examples.map((example) => (
          <article key={example.name} className="glass rounded-3xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Sanity check example</p>
                <h4 className="mt-2 text-xl font-semibold text-white">{example.name}</h4>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                <Check className="h-3.5 w-3.5" />
                Fixed case
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Inputs</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {example.inputs.map((input) => (
                    <li key={input}>{input}</li>
                  ))}
                </ul>
              </div>
              <div className="grid gap-3">
                <Metric label="Expected breakeven" value={example.expectedBreakeven} />
                <Metric label="Expected max profit" value={example.expectedMaxProfit} />
                <Metric label="Expected max loss" value={example.expectedMaxLoss} />
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-white/[0.05] text-xs uppercase tracking-[0.14em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Expiration price</th>
                    <th className="px-4 py-3 font-semibold">Expected P/L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-slate-950/25">
                  {example.rows.map((row) => (
                    <tr key={`${example.name}-${row.expirationPrice}`}>
                      <td className="px-4 py-3 text-slate-200">${row.expirationPrice}</td>
                      <td className={`px-4 py-3 font-semibold ${row.profitLoss > 0 ? "text-emerald-200" : row.profitLoss < 0 ? "text-rose-200" : "text-slate-100"}`}>
                        {formatProfitLoss(row.profitLoss)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function formatProfitLoss(value: number): string {
  if (value === 0) {
    return "$0";
  }
  return `${value > 0 ? "+" : "-"}$${Math.abs(value).toLocaleString("en-US")}`;
}
