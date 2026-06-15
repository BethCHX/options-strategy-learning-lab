# options-strategy-learning-lab

Portfolio-quality educational web app for learning beginner options strategies through guided selection, payoff visualization, risk-first strategy cards, and copy-ready paper-trade journal templates.

Live demo: _Vercel link placeholder_

Screenshot: _Add screenshot placeholder_

## Purpose

Option Strategy Lab helps beginners understand basic options structures without broker connectivity, market data, paid APIs, trading signals, or personalized recommendations. It is an educational portfolio project only.

## Features

- Premium fintech-style landing page with education-only disclaimer
- Guided Strategy Finder with scenario-based recommendations
- Searchable and filterable Strategy Library
- Tabbed strategy detail view with overview, structure, payoff, checklist, and paper template
- Recharts payoff visualizer for supported MVP strategies
- Beginner-friendly learning cards for core options concepts
- Responsive Next.js App Router UI ready for free Vercel deployment

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Recharts
- lucide-react
- framer-motion

## Strategy Coverage

- Long Call
- Long Put
- Covered Call
- Cash-Secured Put
- Protective Put
- Collar
- Bull Call Spread
- Bear Put Spread
- Bull Put Spread
- Bear Call Spread
- Iron Condor
- Long Straddle
- Long Strangle

Payoff calculators are implemented for Long Call, Long Put, Covered Call, Cash-Secured Put, Protective Put, Bull Call Spread, Bear Put Spread, Bull Put Spread, Bear Call Spread, and Iron Condor.

## Risk Disclaimer

This project is for education only. It does not provide investment advice, trading signals, broker execution, live market data, or personalized financial recommendations. Options involve risk and may result in significant losses. Simplified payoff examples ignore commissions, taxes, early assignment, dividends, margin, and implied volatility changes.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

## Vercel Deployment

1. Push this repository to GitHub.
2. Create a new Vercel project.
3. Import the GitHub repository.
4. Keep the default Next.js settings.
5. Deploy on the free Hobby plan.

No environment variables or API keys are required.

## Future Roadmap

- Add real option chain data
- Add saved paper journal
- Add bilingual Chinese/English mode
- Add volatility education
- Add scenario simulator
- Add PWA support
