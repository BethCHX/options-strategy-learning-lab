"use client";

import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { PayoffPoint } from "@/src/lib/payoff";
import { money } from "@/src/lib/format";

export function PayoffChart({ points, height = 280 }: { points: PayoffPoint[]; height?: number }) {
  return (
    <div className="h-full min-h-[220px] w-full rounded-2xl border border-white/10 bg-slate-950/35 p-3">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={points} margin={{ top: 12, right: 12, left: 0, bottom: 6 }}>
          <defs>
            <linearGradient id="payoffGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.38} />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
          <XAxis dataKey="price" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} axisLine={{ stroke: "rgba(148, 163, 184, 0.2)" }} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} tickFormatter={(value) => `$${Number(value) / 1000}k`} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: "#0f172a", border: "1px solid rgba(148, 163, 184, 0.22)", borderRadius: 14, color: "#e2e8f0" }}
            formatter={(value) => [money(Number(value)), "Payoff"]}
            labelFormatter={(label) => `Underlying price: $${label}`}
          />
          <ReferenceLine y={0} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: "Breakeven line", fill: "#fbbf24", fontSize: 11, position: "insideTopRight" }} />
          <Area type="monotone" dataKey="payoff" stroke="#22d3ee" strokeWidth={2.5} fill="url(#payoffGradient)" dot={false} activeDot={{ r: 4, fill: "#a7f3d0" }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
