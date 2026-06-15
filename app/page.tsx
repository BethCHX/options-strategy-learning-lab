"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { BookOpen, Calculator, ExternalLink, GraduationCap, ShieldCheck } from "lucide-react";
import { FormulaCheck } from "@/components/FormulaCheck";
import { Hero } from "@/components/Hero";
import { LearnCards } from "@/components/LearnCards";
import { PayoffVisualizer } from "@/components/PayoffVisualizer";
import { Shell } from "@/components/Shell";
import { StrategyDetail } from "@/components/StrategyDetail";
import { StrategyFinder } from "@/components/StrategyFinder";
import { StrategyLibrary } from "@/components/StrategyLibrary";
import { strategies } from "@/src/data/strategies";

type SectionName = "hero" | "finder" | "library" | "detail" | "visualizer" | "formulaCheck" | "learn";

export default function Home() {
  const [selectedStrategyId, setSelectedStrategyId] = useState("cash-secured-put");
  const heroRef = useRef<HTMLDivElement | null>(null);
  const finderRef = useRef<HTMLElement | null>(null);
  const libraryRef = useRef<HTMLElement | null>(null);
  const detailRef = useRef<HTMLElement | null>(null);
  const visualizerRef = useRef<HTMLElement | null>(null);
  const formulaCheckRef = useRef<HTMLElement | null>(null);
  const learnRef = useRef<HTMLElement | null>(null);

  const selectedStrategy = useMemo(
    () => strategies.find((strategy) => strategy.id === selectedStrategyId) ?? strategies[0],
    [selectedStrategyId]
  );

  const scrollToSection = useCallback(
    (sectionName: SectionName) => {
      const sectionRefs = {
        hero: heroRef,
        finder: finderRef,
        library: libraryRef,
        detail: detailRef,
        visualizer: visualizerRef,
        formulaCheck: formulaCheckRef,
        learn: learnRef
      };

      sectionRefs[sectionName].current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    },
    []
  );

  const handleSelectStrategy = useCallback(
    (strategyId: string) => {
      setSelectedStrategyId(strategyId);
      window.requestAnimationFrame(() => scrollToSection("detail"));
    },
    [scrollToSection]
  );

  return (
    <Shell onNavigate={scrollToSection}>
      <div ref={heroRef}>
        <Hero onSelectStrategy={handleSelectStrategy} onNavigate={scrollToSection} />
      </div>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        <section id="finder" ref={finderRef} className="scroll-mt-24">
          <SectionHeader
            icon={<ShieldCheck className="h-5 w-5" />}
            kicker="Guided selection"
            title="Strategy Finder"
            description="Answer a few scenario prompts and compare education-first strategy matches. The output is not a trading signal."
          />
          <StrategyFinder onSelectStrategy={handleSelectStrategy} />
        </section>

        <section id="library" ref={libraryRef} className="scroll-mt-24">
          <SectionHeader
            icon={<BookOpen className="h-5 w-5" />}
            kicker="Reference library"
            title="Strategy Library"
            description="Search and filter beginner, intermediate, and advanced strategies by outlook, type, and risk profile."
          />
          <StrategyLibrary selectedId={selectedStrategy.id} onSelectStrategy={handleSelectStrategy} />
        </section>

        <section id="detail" ref={detailRef} className="scroll-mt-24">
          <StrategyDetail strategy={selectedStrategy} />
        </section>

        <section id="visualizer" ref={visualizerRef} className="scroll-mt-24">
          <SectionHeader
            icon={<Calculator className="h-5 w-5" />}
            kicker="Interactive payoff"
            title="Payoff Visualizer"
            description="Adjust strikes, premium, contracts, and price ranges to see simplified expiration payoff assumptions."
          />
          <PayoffVisualizer selectedStrategyId={selectedStrategy.id} />
        </section>

        <section id="formula-check" ref={formulaCheckRef} className="scroll-mt-24">
          <SectionHeader
            icon={<ShieldCheck className="h-5 w-5" />}
            kicker="Sanity check examples"
            title="Formula Check"
            description="Fixed educational examples that make the core payoff formulas easy to verify without reading code."
          />
          <FormulaCheck />
        </section>

        <section id="learn" ref={learnRef} className="scroll-mt-24">
          <SectionHeader
            icon={<GraduationCap className="h-5 w-5" />}
            kicker="Concept cards"
            title="Learn the building blocks"
            description="Short explanations for the options vocabulary that appears across strategy cards and payoff charts."
          />
          <LearnCards />
        </section>
      </main>
      <footer className="border-t border-white/10 bg-slate-950/30 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-slate-200">Option Strategy Lab</p>
            <p className="mt-1 max-w-3xl">
              This project is for education only. It does not provide investment advice, trading signals, broker execution,
              or personalized financial recommendations. Options involve risk and may result in significant losses.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-slate-500" aria-label="GitHub placeholder unavailable">
              <ExternalLink className="h-4 w-4" />
              GitHub coming soon
            </span>
            <span className="cursor-not-allowed rounded-full border border-white/10 px-4 py-2 text-slate-500" aria-label="Portfolio placeholder unavailable">
              Portfolio coming soon
            </span>
          </div>
        </div>
      </footer>
    </Shell>
  );
}

function SectionHeader({
  icon,
  kicker,
  title,
  description
}: {
  icon: ReactNode;
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-sm font-medium text-cyan-200">
        <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 p-2 text-cyan-200">{icon}</span>
        {kicker}
      </div>
      <div className="max-w-3xl">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
        <p className="mt-3 text-base leading-7 text-slate-300">{description}</p>
      </div>
    </div>
  );
}
