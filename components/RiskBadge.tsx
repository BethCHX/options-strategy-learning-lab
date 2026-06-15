import type { Complexity, RiskLevel, RiskType } from "@/src/types/strategy";

export function RiskBadge({ label, tone }: { label: RiskLevel | RiskType | Complexity | string; tone?: "cyan" | "emerald" | "amber" | "violet" | "slate" }) {
  const color = tone ?? colorFor(label);
  const classes: Record<NonNullable<typeof tone>, string> = {
    cyan: "border-cyan-300/25 bg-cyan-300/10 text-cyan-100",
    emerald: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
    amber: "border-amber-300/25 bg-amber-300/10 text-amber-100",
    violet: "border-violet-300/25 bg-violet-300/10 text-violet-100",
    slate: "border-slate-300/20 bg-slate-300/10 text-slate-200"
  };
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${classes[color]}`}>{label}</span>;
}

function colorFor(label: string): "cyan" | "emerald" | "amber" | "violet" | "slate" {
  if (label === "Low" || label === "Beginner" || label === "Defined risk") return "emerald";
  if (label === "Medium" || label === "Intermediate" || label === "Premium at risk") return "cyan";
  if (label === "High" || label === "Advanced" || label === "Advanced multi-leg") return "amber";
  if (label === "Assignment risk") return "violet";
  return "slate";
}
