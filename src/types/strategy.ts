export type StrategyCategory = "Directional" | "Income" | "Protection" | "Spread" | "Volatility";
export type Complexity = "Beginner" | "Intermediate" | "Advanced";
export type RiskLevel = "Low" | "Medium" | "High";
export type RiskType = "Defined risk" | "Assignment risk" | "Premium at risk" | "Advanced multi-leg";

export type StrategyLeg = {
  action: "Buy" | "Sell" | "Hold" | "Reserve";
  quantity: string;
  instrument: string;
  detail: string;
};

export type Strategy = {
  id: string;
  name: string;
  category: StrategyCategory;
  outlook: string;
  complexity: Complexity;
  riskLevel: RiskLevel;
  riskType: RiskType;
  assignmentRisk: boolean;
  summary: string;
  bestFor: string;
  avoidWhen: string;
  legs: StrategyLeg[];
  maxProfitExplanation: string;
  maxLossExplanation: string;
  breakevenExplanation: string;
  greeksSummary: string;
  commonMistakes: string[];
  beginnerWarning: string;
  exampleDefaults: PayoffDefaults;
};

export type PayoffDefaults = {
  stockPrice: number;
  strike1: number;
  strike2?: number;
  strike3?: number;
  strike4?: number;
  premium1: number;
  premium2?: number;
  premium3?: number;
  premium4?: number;
  contracts: number;
  rangeMin: number;
  rangeMax: number;
};

export type FinderInput = {
  outlook: string;
  goal: string;
  riskPreference: RiskLevel;
  assignmentComfort: string;
  experience: "Beginner" | "Intermediate";
};

export type StrategyRecommendation = {
  strategy: Strategy;
  tag: "Best first strategy to learn" | "Alternative strategy" | "Avoid for now";
  why: string;
  confidence: "High" | "Medium" | "Low";
  warning?: string;
};
