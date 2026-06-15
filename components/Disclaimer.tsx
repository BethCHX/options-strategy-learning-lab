import { TriangleAlert } from "lucide-react";

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/10 text-amber-100 ${compact ? "px-3 py-2 text-xs" : "p-4 text-sm"}`}>
      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
      <p>
        Education only. No investment advice, trading signals, live market data, broker connection, or trade execution.
        Simplified payoff assumptions ignore commissions, taxes, early assignment, dividends, margin, and IV changes.
      </p>
    </div>
  );
}
