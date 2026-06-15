import { strategies } from "@/src/data/strategies";
import type { FinderInput, StrategyRecommendation } from "@/src/types/strategy";

function byId(id: string) {
  const strategy = strategies.find((item) => item.id === id);
  if (!strategy) {
    throw new Error(`Missing strategy: ${id}`);
  }
  return strategy;
}

function recommendation(id: string, tag: StrategyRecommendation["tag"], why: string, confidence: StrategyRecommendation["confidence"], warning?: string): StrategyRecommendation {
  return { strategy: byId(id), tag, why, confidence, warning };
}

export function matchStrategies(input: FinderInput): StrategyRecommendation[] {
  const matches: StrategyRecommendation[] = [];
  const assignmentAvoided = input.assignmentComfort === "Not comfortable with assignment";
  const beginner = input.experience === "Beginner";

  if (input.outlook === "Already own shares" && input.goal === "Collect premium" && !assignmentAvoided) {
    matches.push(recommendation("covered-call", "Best first strategy to learn", "It connects premium collection to shares already owned.", "High"));
  }

  if (input.outlook === "Want to buy shares at a lower price" && input.assignmentComfort === "Comfortable with assignment") {
    matches.push(recommendation("cash-secured-put", "Best first strategy to learn", "It directly maps to learning assignment and lower-entry mechanics.", "High"));
  }

  if (input.outlook === "Mildly bullish" && input.goal === "Define maximum risk") {
    matches.push(recommendation("bull-call-spread", "Best first strategy to learn", "It defines both max loss and max profit for a bullish view.", "High"));
    if (!assignmentAvoided) {
      matches.push(recommendation("bull-put-spread", "Alternative strategy", "A credit-spread version of a mildly bullish view.", "Medium", "Learn short-option assignment mechanics before practicing."));
    }
  }

  if (input.outlook === "Strongly bullish") {
    matches.push(recommendation("long-call", "Best first strategy to learn", "It is the cleanest payoff for a strong bullish view with premium at risk.", "High", "Premium decay can still make the trade lose."));
  }

  if (input.outlook === "Mildly bearish" && input.goal === "Define maximum risk") {
    matches.push(recommendation("bear-put-spread", "Best first strategy to learn", "It defines risk while expressing a bearish directional view.", "High"));
    if (!assignmentAvoided) {
      matches.push(recommendation("bear-call-spread", "Alternative strategy", "A credit-spread version of a mildly bearish view.", "Medium", "Short-call assignment mechanics are not beginner-first."));
    }
  }

  if (input.outlook === "Strongly bearish") {
    matches.push(recommendation("long-put", "Best first strategy to learn", "It is the cleanest payoff for a strong bearish view with premium at risk.", "High", "Premium decay can still make the trade lose."));
  }

  if (input.outlook === "Neutral / range-bound") {
    matches.push(recommendation("iron-condor", "Avoid for now", "Iron Condors are advanced multi-leg short-volatility structures.", "Low", "Learn Covered Call and Cash-Secured Put mechanics first."));
    matches.push(recommendation("covered-call", "Alternative strategy", "A simpler income structure to understand short-option tradeoffs.", assignmentAvoided ? "Low" : "Medium", assignmentAvoided ? "Assignment risk makes this a poor fit for your comfort level." : undefined));
    matches.push(recommendation("cash-secured-put", "Alternative strategy", "A simpler premium collection structure with clear assignment education.", assignmentAvoided ? "Low" : "Medium", assignmentAvoided ? "Assignment risk makes this a poor fit for your comfort level." : undefined));
  }

  if (input.goal === "Protect existing position") {
    matches.push(recommendation("protective-put", "Best first strategy to learn", "It isolates the idea of buying downside protection.", "High"));
    matches.push(recommendation("collar", beginner ? "Avoid for now" : "Alternative strategy", "It combines a protective put with a covered call to reduce premium cost.", beginner ? "Low" : "Medium", beginner ? "Learn protective puts and covered calls before combining them." : undefined));
  }

  if (assignmentAvoided) {
    matches
      .filter((match) => match.strategy.assignmentRisk)
      .forEach((match) => {
        match.tag = "Avoid for now";
        match.warning = "You selected that assignment is not comfortable, so assignment-heavy strategies should wait.";
      });
  }

  if (beginner) {
    matches
      .filter((match) => match.strategy.complexity === "Advanced")
      .forEach((match) => {
        match.tag = "Avoid for now";
        match.warning = "Beginner plus high-complexity strategy: learn later.";
      });
  }

  if (matches.length === 0) {
    matches.push(recommendation("long-call", "Alternative strategy", "Start with a simple one-leg payoff before adding assignment or spread mechanics.", "Medium"));
    matches.push(recommendation("long-put", "Alternative strategy", "Compare the mirrored bearish payoff to understand directional risk.", "Medium"));
    matches.push(recommendation("protective-put", "Best first strategy to learn", "Protection structures are useful for learning defined downside.", "Medium"));
  }

  return [...new Map(matches.map((match) => [match.strategy.id, match])).values()].slice(0, 3);
}
