import { AudioWaveform, CalendarClock, ChartLine, CircleDollarSign, Gauge, Layers, Timer, TrendingDown, TrendingUp, WalletCards } from "lucide-react";

const cards = [
  ["What is a call?", "A call gives the holder the right to buy shares at a strike price before expiration.", TrendingUp, "cyan"],
  ["What is a put?", "A put gives the holder the right to sell shares at a strike price before expiration.", TrendingDown, "violet"],
  ["What is premium?", "Premium is the option price paid by the buyer and received by the seller.", CircleDollarSign, "emerald"],
  ["What is strike?", "The strike is the price where the option contract can be exercised.", Gauge, "amber"],
  ["What is expiration?", "Expiration is the date when the option contract stops existing.", CalendarClock, "cyan"],
  ["What is assignment?", "Assignment is when an option seller is required to fulfill contract obligations.", WalletCards, "violet"],
  ["What is defined risk?", "Defined risk means the maximum possible loss is known in the simplified structure.", Layers, "emerald"],
  ["What is theta decay?", "Theta decay describes option value lost as time passes, all else equal.", Timer, "amber"],
  ["What is implied volatility?", "Implied volatility is the market's embedded expectation of future movement.", AudioWaveform, "cyan"],
  ["What is breakeven?", "Breakeven is the underlying price where payoff equals zero at expiration.", ChartLine, "emerald"]
] as const;

export function LearnCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map(([title, body, Icon, tone]) => (
        <article key={title} className="glass rounded-2xl p-5">
          <div className={`mb-4 inline-flex rounded-2xl border p-3 ${iconTone(tone)}`}>
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{body}</p>
        </article>
      ))}
    </div>
  );
}

function iconTone(tone: string): string {
  if (tone === "cyan") return "border-cyan-300/25 bg-cyan-300/10 text-cyan-100";
  if (tone === "emerald") return "border-emerald-300/25 bg-emerald-300/10 text-emerald-100";
  if (tone === "amber") return "border-amber-300/25 bg-amber-300/10 text-amber-100";
  return "border-violet-300/25 bg-violet-300/10 text-violet-100";
}
