"use client";

import React, { useState, useMemo } from "react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { formatCurrency, formatINR } from "@/lib/format/currency";
import {
  simulateCashFlow,
  formatLifespan,
} from "@/lib/finance/cashflow";
import CashflowChart from "@/components/charts/cashflow-chart";

const CashflowSimulator: React.FC = () => {
  const [initialPortfolio, setInitialPortfolio] = useState(20000000);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(100000);
  const [years, setYears] = useState(30);
  const [liquidMonths, setLiquidMonths] = useState(12);
  const [mixedMonths, setMixedMonths] = useState(24);
  const [rLiq, setRLiq] = useState(5);
  const [rMix, setRMix] = useState(8);
  const [rEq, setREq] = useState(12);

  const simulationResult = useMemo(
    () =>
      simulateCashFlow({
        initialPortfolio,
        monthlyWithdrawal,
        years,
        liquidMonths,
        mixedMonths,
        r_liq: rLiq / 100,
        r_mix: rMix / 100,
        r_eq: rEq / 100,
      }),
    [
      initialPortfolio,
      monthlyWithdrawal,
      years,
      liquidMonths,
      mixedMonths,
      rLiq,
      rMix,
      rEq,
    ],
  );

  const { timeline } = simulationResult;
  const finalValue =
    timeline.length > 0 ? timeline[timeline.length - 1]!.total : 0;
  const exhaustedMonth = timeline.find((d) => d.total <= 0);
  const lifespan = formatLifespan(exhaustedMonth, years);

  return (
    <Section id="cashflow-simulator" className="bg-muted/30 py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Retirement Cash Flow Simulator"
          subtitle="Model your post-retirement cash flow using a three-bucket strategy (Liquid, Mixed, Equity) to see how long your corpus might last."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
          <Card className="p-8 border-border/40">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">
                  Core Setup
                </h3>
                <Slider label="Initial Corpus" value={initialPortfolio} min={1000000} max={100000000} step={500000} onChange={setInitialPortfolio} formatValue={formatCurrency} />
                <Slider label="Monthly Pension" value={monthlyWithdrawal} min={10000} max={500000} step={5000} onChange={setMonthlyWithdrawal} formatValue={formatCurrency} />
                <Slider label="Simulation Period" value={years} min={10} max={50} step={1} onChange={setYears} formatValue={(v) => v.toString()} suffix=" Yrs" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">
                  Bucket Strategy
                </h3>
                <Slider label="Emergency Fund" value={liquidMonths} min={6} max={36} step={1} onChange={setLiquidMonths} formatValue={(v) => v.toString()} suffix=" Mos" />
                <Slider label="Short-Term Fund" value={mixedMonths} min={12} max={60} step={1} onChange={setMixedMonths} formatValue={(v) => v.toString()} suffix=" Mos" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-foreground mt-6 mb-4 pt-6 border-t border-border">
              Return Assumptions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6">
              <Slider label="Liquid" value={rLiq} min={3} max={8} step={0.5} onChange={setRLiq} formatValue={(v) => v.toString()} suffix="%" />
              <Slider label="Mixed" value={rMix} min={5} max={12} step={0.5} onChange={setRMix} formatValue={(v) => v.toString()} suffix="%" />
              <Slider label="Equity" value={rEq} min={8} max={18} step={0.5} onChange={setREq} formatValue={(v) => v.toString()} suffix="%" />
            </div>
          </Card>

          <Card className="p-6 border-border/40 flex flex-col">
            <div className="grid grid-cols-2 gap-4 text-center mb-4">
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                  Portfolio Lifespan
                </p>
                <p
                  className={`text-2xl font-extrabold tracking-tight mt-1 ${exhaustedMonth ? "text-red-600" : "text-green-600"}`}
                >
                  {lifespan}
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                  Final Value
                </p>
                <p className="text-2xl font-extrabold text-foreground tracking-tight mt-1">
                  {formatINR(finalValue)}
                </p>
              </div>
            </div>
            <div className="flex-grow min-h-[300px]">
              <CashflowChart data={timeline} years={years} formatFunction={formatINR} />
            </div>
            <div className="flex justify-center items-center gap-6 pt-4 text-xs font-medium text-muted-foreground">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 bg-[#93C5FD]" />
                Liquid
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 bg-[#60A5FA]" />
                Mixed
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 bg-[#2563EB]" />
                Equity
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
};

export default CashflowSimulator;
