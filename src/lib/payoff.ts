import type { PayoffDefaults } from "@/src/types/strategy";

const SHARES_PER_CONTRACT = 100;

export type PayoffPoint = {
  price: number;
  payoff: number;
};

export type PayoffSummary = {
  points: PayoffPoint[];
  maxProfit: string;
  maxLoss: string;
  breakeven: string;
  strategyType: string;
  riskNotes: string[];
};

export type PayoffInputs = Required<Pick<PayoffDefaults, "stockPrice" | "strike1" | "premium1" | "contracts" | "rangeMin" | "rangeMax">> &
  Partial<Pick<PayoffDefaults, "strike2" | "strike3" | "strike4" | "premium2" | "premium3" | "premium4">>;

function multiplier(contracts: number): number {
  return contracts * SHARES_PER_CONTRACT;
}

function buildPoints(rangeMin: number, rangeMax: number, payoffAt: (price: number) => number): PayoffPoint[] {
  const steps = 56;
  const span = Math.max(1, rangeMax - rangeMin);
  return Array.from({ length: steps + 1 }, (_, index) => {
    const price = Number((rangeMin + (span * index) / steps).toFixed(2));
    return { price, payoff: Number(payoffAt(price).toFixed(2)) };
  });
}

function finiteMaxLoss(points: PayoffPoint[]): string {
  return `$${Math.abs(Math.min(...points.map((point) => point.payoff))).toFixed(0)}`;
}

function finiteMaxProfit(points: PayoffPoint[]): string {
  return `$${Math.max(...points.map((point) => point.payoff)).toFixed(0)} in displayed range`;
}

export function calculateLongCall(input: PayoffInputs): PayoffSummary {
  const points = buildPoints(input.rangeMin, input.rangeMax, (price) => (Math.max(0, price - input.strike1) - input.premium1) * multiplier(input.contracts));
  return {
    points,
    maxProfit: "Unlimited upside after premium cost",
    maxLoss: `$${(input.premium1 * multiplier(input.contracts)).toFixed(0)}`,
    breakeven: `$${(input.strike1 + input.premium1).toFixed(2)}`,
    strategyType: "Directional debit",
    riskNotes: ["Premium can decay to zero", "No assignment risk from a simple long call at expiration"]
  };
}

export function calculateLongPut(input: PayoffInputs): PayoffSummary {
  const points = buildPoints(input.rangeMin, input.rangeMax, (price) => (Math.max(0, input.strike1 - price) - input.premium1) * multiplier(input.contracts));
  return {
    points,
    maxProfit: `$${((input.strike1 - input.premium1) * multiplier(input.contracts)).toFixed(0)} if stock goes to zero`,
    maxLoss: `$${(input.premium1 * multiplier(input.contracts)).toFixed(0)}`,
    breakeven: `$${(input.strike1 - input.premium1).toFixed(2)}`,
    strategyType: "Directional debit",
    riskNotes: ["Premium can decay to zero", "Downside profit is capped by stock reaching zero"]
  };
}

export function calculateCoveredCall(input: PayoffInputs): PayoffSummary {
  const points = buildPoints(input.rangeMin, input.rangeMax, (price) => ((price - input.stockPrice) - Math.max(0, price - input.strike1) + input.premium1) * multiplier(input.contracts));
  return {
    points,
    maxProfit: `$${((input.strike1 - input.stockPrice + input.premium1) * multiplier(input.contracts)).toFixed(0)}`,
    maxLoss: `$${((input.stockPrice - input.premium1) * multiplier(input.contracts)).toFixed(0)} if stock goes to zero`,
    breakeven: `$${(input.stockPrice - input.premium1).toFixed(2)}`,
    strategyType: "Income with shares",
    riskNotes: ["Upside is capped at the short call strike", "Assignment can sell shares at the strike"]
  };
}

export function calculateCashSecuredPut(input: PayoffInputs): PayoffSummary {
  const points = buildPoints(input.rangeMin, input.rangeMax, (price) => (input.premium1 - Math.max(0, input.strike1 - price)) * multiplier(input.contracts));
  return {
    points,
    maxProfit: `$${(input.premium1 * multiplier(input.contracts)).toFixed(0)}`,
    maxLoss: `$${((input.strike1 - input.premium1) * multiplier(input.contracts)).toFixed(0)} if stock goes to zero`,
    breakeven: `$${(input.strike1 - input.premium1).toFixed(2)}`,
    strategyType: "Income credit",
    riskNotes: ["Assignment can create share ownership", "Cash collateral is assumed in this educational model"]
  };
}

export function calculateProtectivePut(input: PayoffInputs): PayoffSummary {
  const points = buildPoints(input.rangeMin, input.rangeMax, (price) => ((price - input.stockPrice) + Math.max(0, input.strike1 - price) - input.premium1) * multiplier(input.contracts));
  return {
    points,
    maxProfit: "Unlimited upside after put premium",
    maxLoss: `$${((input.stockPrice - input.strike1 + input.premium1) * multiplier(input.contracts)).toFixed(0)}`,
    breakeven: `$${(input.stockPrice + input.premium1).toFixed(2)}`,
    strategyType: "Protection",
    riskNotes: ["The put defines downside below the strike", "Premium cost can reduce returns if protection is repeated"]
  };
}

export function calculateBullCallSpread(input: PayoffInputs): PayoffSummary {
  const strike2 = input.strike2 ?? input.strike1 + 10;
  const premium2 = input.premium2 ?? 0;
  const netDebit = input.premium1 - premium2;
  const width = strike2 - input.strike1;
  const points = buildPoints(input.rangeMin, input.rangeMax, (price) => (Math.max(0, price - input.strike1) - Math.max(0, price - strike2) - netDebit) * multiplier(input.contracts));
  return {
    points,
    maxProfit: `$${((width - netDebit) * multiplier(input.contracts)).toFixed(0)}`,
    maxLoss: `$${(netDebit * multiplier(input.contracts)).toFixed(0)}`,
    breakeven: `$${(input.strike1 + netDebit).toFixed(2)}`,
    strategyType: "Defined-risk debit spread",
    riskNotes: ["Upside is capped at the higher strike", "Net debit is the simplified max loss"]
  };
}

export function calculateBearPutSpread(input: PayoffInputs): PayoffSummary {
  const strike2 = input.strike2 ?? input.strike1 - 10;
  const premium2 = input.premium2 ?? 0;
  const netDebit = input.premium1 - premium2;
  const width = input.strike1 - strike2;
  const points = buildPoints(input.rangeMin, input.rangeMax, (price) => (Math.max(0, input.strike1 - price) - Math.max(0, strike2 - price) - netDebit) * multiplier(input.contracts));
  return {
    points,
    maxProfit: `$${((width - netDebit) * multiplier(input.contracts)).toFixed(0)}`,
    maxLoss: `$${(netDebit * multiplier(input.contracts)).toFixed(0)}`,
    breakeven: `$${(input.strike1 - netDebit).toFixed(2)}`,
    strategyType: "Defined-risk debit spread",
    riskNotes: ["Downside profit is capped at the lower strike", "Net debit is the simplified max loss"]
  };
}

export function calculateBullPutSpread(input: PayoffInputs): PayoffSummary {
  const strike2 = input.strike2 ?? input.strike1 - 10;
  const premium2 = input.premium2 ?? 0;
  const netCredit = input.premium1 - premium2;
  const width = input.strike1 - strike2;
  const points = buildPoints(input.rangeMin, input.rangeMax, (price) => (netCredit - Math.max(0, input.strike1 - price) + Math.max(0, strike2 - price)) * multiplier(input.contracts));
  return {
    points,
    maxProfit: `$${(netCredit * multiplier(input.contracts)).toFixed(0)}`,
    maxLoss: `$${((width - netCredit) * multiplier(input.contracts)).toFixed(0)}`,
    breakeven: `$${(input.strike1 - netCredit).toFixed(2)}`,
    strategyType: "Defined-risk credit spread",
    riskNotes: ["Short put assignment mechanics still matter", "Loss is bounded by the long put in this simplified model"]
  };
}

export function calculateBearCallSpread(input: PayoffInputs): PayoffSummary {
  const strike2 = input.strike2 ?? input.strike1 + 10;
  const premium2 = input.premium2 ?? 0;
  const netCredit = input.premium1 - premium2;
  const width = strike2 - input.strike1;
  const points = buildPoints(input.rangeMin, input.rangeMax, (price) => (netCredit - Math.max(0, price - input.strike1) + Math.max(0, price - strike2)) * multiplier(input.contracts));
  return {
    points,
    maxProfit: `$${(netCredit * multiplier(input.contracts)).toFixed(0)}`,
    maxLoss: `$${((width - netCredit) * multiplier(input.contracts)).toFixed(0)}`,
    breakeven: `$${(input.strike1 + netCredit).toFixed(2)}`,
    strategyType: "Defined-risk credit spread",
    riskNotes: ["Short call assignment mechanics still matter", "Loss is bounded by the long call in this simplified model"]
  };
}

export function calculateIronCondor(input: PayoffInputs): PayoffSummary {
  const strike2 = input.strike2 ?? input.strike1 + 5;
  const strike3 = input.strike3 ?? strike2 + 20;
  const strike4 = input.strike4 ?? strike3 + 5;
  const premium2 = input.premium2 ?? 0;
  const premium3 = input.premium3 ?? 0;
  const premium4 = input.premium4 ?? 0;
  const netCredit = premium2 + premium3 - input.premium1 - premium4;
  const lowerWidth = strike2 - input.strike1;
  const upperWidth = strike4 - strike3;
  const points = buildPoints(input.rangeMin, input.rangeMax, (price) => {
    const longPut = Math.max(0, input.strike1 - price);
    const shortPut = -Math.max(0, strike2 - price);
    const shortCall = -Math.max(0, price - strike3);
    const longCall = Math.max(0, price - strike4);
    return (longPut + shortPut + shortCall + longCall + netCredit) * multiplier(input.contracts);
  });
  return {
    points,
    maxProfit: `$${(netCredit * multiplier(input.contracts)).toFixed(0)}`,
    maxLoss: `$${((Math.max(lowerWidth, upperWidth) - netCredit) * multiplier(input.contracts)).toFixed(0)}`,
    breakeven: `$${(strike2 - netCredit).toFixed(2)} / $${(strike3 + netCredit).toFixed(2)}`,
    strategyType: "Advanced range-bound credit",
    riskNotes: ["Four-leg strategy with assignment risk", "Educational model assumes equal expiration and ignores early assignment"]
  };
}

export function calculatePayoff(strategyId: string, input: PayoffInputs): PayoffSummary {
  const calculators: Record<string, (input: PayoffInputs) => PayoffSummary> = {
    "long-call": calculateLongCall,
    "long-put": calculateLongPut,
    "covered-call": calculateCoveredCall,
    "cash-secured-put": calculateCashSecuredPut,
    "protective-put": calculateProtectivePut,
    "bull-call-spread": calculateBullCallSpread,
    "bear-put-spread": calculateBearPutSpread,
    "bull-put-spread": calculateBullPutSpread,
    "bear-call-spread": calculateBearCallSpread,
    "iron-condor": calculateIronCondor
  };
  return (calculators[strategyId] ?? calculateLongCall)(input);
}

export function payoffSupported(strategyId: string): boolean {
  return ["long-call", "long-put", "covered-call", "cash-secured-put", "protective-put", "bull-call-spread", "bear-put-spread", "bull-put-spread", "bear-call-spread", "iron-condor"].includes(strategyId);
}
