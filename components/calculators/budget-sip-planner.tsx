"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Container } from "@/components/ui/section";
import { calculateSip } from "@/lib/finance/sip";
import { formatCurrency, formatCurrencyShort } from "@/lib/format/currency";
import { useAnimatedCounter } from "@/hooks/use-animated-counter";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";
import { fadeUp, viewportOnce } from "@/lib/motion";

const BudgetSipPlanner: React.FC = () => {
  const [income, setIncome] = useState(80000);
  const [rent, setRent] = useState(15000);
  const [groceries, setGroceries] = useState(8000);
  const [utilities, setUtilities] = useState(4000);
  const [transport, setTransport] = useState(3000);
  const [entertainment, setEntertainment] = useState(5000);
  const [subscriptions, setSubscriptions] = useState(1500);
  const [shopping, setShopping] = useState(3000);
  const [desiredSip, setDesiredSip] = useState(10000);
  const [openAccordion, setOpenAccordion] = useState<
    "essential" | "lifestyle" | null
  >(null);

  const totalExpenses =
    rent + groceries + utilities + transport + entertainment + subscriptions + shopping;
  const maxSip = Math.max(0, income - totalExpenses);

  // Only clamp on mount, show warning otherwise
  useEffect(() => {
    if (desiredSip > maxSip) {
      setDesiredSip(maxSip);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const effectiveSip = Math.min(desiredSip, maxSip);
  const remainingIncome = income - totalExpenses - effectiveSip;
  const totalSavingsPercent =
    income > 0
      ? ((effectiveSip + remainingIncome) / income) * 100
      : 0;
  const efficiency = Math.min(100, (totalSavingsPercent / 30) * 100);

  const budgetData = useMemo(
    () => calculateSip(effectiveSip, 15, 12),
    [effectiveSip],
  );

  const futureValue = useAnimatedCounter(budgetData.futureValue);

  useEffect(() => {
    setDesiredSip((prev) => Math.min(prev, maxSip));
  }, [maxSip]);

  const allocationData = [
    { label: "Essentials", value: rent + groceries + utilities, color: "success" as const },
    { label: "Lifestyle", value: transport + entertainment + subscriptions + shopping, color: "warning" as const },
    { label: "SIP", value: effectiveSip, color: "primary" as const },
    { label: "Savings", value: remainingIncome, color: "muted" as const },
  ];

  const totalAllocation = allocationData.reduce((s, a) => s + a.value, 0) || 1;

  // Conic gradient for donut
  const conicGradient = (() => {
    let cumulative = 0;
    const segments = allocationData
      .filter((a) => a.value > 0)
      .map((a) => {
        const pct = (a.value / totalAllocation) * 360;
        const start = cumulative;
        cumulative += pct;
        const colorMap: Record<string, string> = {
          success: "#22C55E",
          warning: "#F59E0B",
          primary: "#3B82F6",
          muted: "#CBD5E1",
        };
        return `${colorMap[a.color]} ${start}deg ${cumulative}deg`;
      });
    return segments.length > 0
      ? `conic-gradient(${segments.join(", ")})`
      : "conic-gradient(#CBD5E1 0deg 360deg)";
  })();

  return (
    <Section
      id="budget-planner"
      className="bg-muted/30 relative overflow-hidden"
    >
      <Container>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Budget SIP Planner
          </h2>
          <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            See how your monthly budget can accommodate a SIP and plan your
            expenses intelligently.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left: Inputs */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <Card className="p-8 md:p-10">
              <CardContent className="p-0 space-y-6">
                <Slider
                  label="Monthly Income"
                  value={income}
                  onChange={setIncome}
                  min={10000}
                  max={500000}
                  step={1000}
                  formatValue={formatCurrency}
                />

                <hr className="border-border/50" />

                {/* Essential Expenses */}
                <div>
                  <button
                    onClick={() =>
                      setOpenAccordion(
                        openAccordion === "essential" ? null : "essential",
                      )
                    }
                    className="flex items-center justify-between w-full text-left"
                    aria-expanded={openAccordion === "essential"}
                  >
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                      Essential Expenses
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform duration-300",
                        openAccordion === "essential" && "rotate-180",
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-500 ease-in-out",
                      openAccordion === "essential"
                        ? "grid-rows-[1fr] opacity-100 mt-4"
                        : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden space-y-5">
                      <Slider
                        label="Rent"
                        value={rent}
                        onChange={setRent}
                        min={0}
                        max={income * 0.75}
                        step={500}
                        formatValue={formatCurrency}
                        isSubSlider
                      />
                      <Slider
                        label="Groceries"
                        value={groceries}
                        onChange={setGroceries}
                        min={0}
                        max={income * 0.5}
                        step={250}
                        formatValue={formatCurrency}
                        isSubSlider
                      />
                      <Slider
                        label="Utilities"
                        value={utilities}
                        onChange={setUtilities}
                        min={0}
                        max={income * 0.3}
                        step={100}
                        formatValue={formatCurrency}
                        isSubSlider
                      />
                    </div>
                  </div>
                </div>

                {/* Lifestyle Expenses */}
                <div>
                  <button
                    onClick={() =>
                      setOpenAccordion(
                        openAccordion === "lifestyle" ? null : "lifestyle",
                      )
                    }
                    className="flex items-center justify-between w-full text-left"
                    aria-expanded={openAccordion === "lifestyle"}
                  >
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                      Lifestyle Expenses
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform duration-300",
                        openAccordion === "lifestyle" && "rotate-180",
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-500 ease-in-out",
                      openAccordion === "lifestyle"
                        ? "grid-rows-[1fr] opacity-100 mt-4"
                        : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden space-y-5">
                      <Slider
                        label="Transport"
                        value={transport}
                        onChange={setTransport}
                        min={0}
                        max={income * 0.4}
                        step={100}
                        formatValue={formatCurrency}
                        isSubSlider
                      />
                      <Slider
                        label="Entertainment"
                        value={entertainment}
                        onChange={setEntertainment}
                        min={0}
                        max={income * 0.5}
                        step={250}
                        formatValue={formatCurrency}
                        isSubSlider
                      />
                      <Slider
                        label="Subscriptions"
                        value={subscriptions}
                        onChange={setSubscriptions}
                        min={0}
                        max={income * 0.2}
                        step={50}
                        formatValue={formatCurrency}
                        isSubSlider
                      />
                      <Slider
                        label="Shopping"
                        value={shopping}
                        onChange={setShopping}
                        min={0}
                        max={income * 0.5}
                        step={250}
                        formatValue={formatCurrency}
                        isSubSlider
                      />
                    </div>
                  </div>
                </div>

                {/* Investment */}
                <div className="border-l-4 border-primary pl-4 rounded-sm">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">
                    Invest
                  </p>
                  <Slider
                    label="Desired SIP"
                    value={desiredSip}
                    onChange={(v) => setDesiredSip(Math.min(v, maxSip))}
                    min={0}
                    max={Math.max(maxSip, 500)}
                    step={500}
                    formatValue={formatCurrency}
                    thumbSize="large"
                    caption={
                      desiredSip > maxSip
                        ? `Max available: ${formatCurrencyShort(maxSip)}`
                        : undefined
                    }
                  />
                </div>

                {desiredSip > maxSip && (
                  <p className="text-xs font-medium text-warning flex items-center gap-1.5">
                    <HelpCircle className="w-3 h-3" />
                    SIP exceeds available income. Reduce expenses or increase
                    income.
                  </p>
                )}

                {/* Summary */}
                <div className="bg-muted/50 rounded-2xl p-4 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Income</span>
                    <span className="font-semibold text-foreground">
                      {formatCurrencyShort(income)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expenses</span>
                    <span className="font-semibold text-foreground">
                      {formatCurrencyShort(totalExpenses)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SIP</span>
                    <span className="font-semibold text-primary">
                      {formatCurrencyShort(effectiveSip)}
                    </span>
                  </div>
                  <hr className="border-border/50" />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Remaining</span>
                    <span
                      className={cn(
                        "font-semibold",
                        remainingIncome >= 0
                          ? "text-success"
                          : "text-error",
                      )}
                    >
                      {formatCurrencyShort(remainingIncome)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right: Results */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-8 md:p-10 h-full">
              <CardContent className="p-0 flex flex-col h-full">
                {/* Potential Corpus */}
                <div className="text-center mb-8">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Potential Corpus in 15 Years
                  </p>
                  <p className="text-4xl font-bold tracking-tight tabular-nums text-primary mb-2">
                    {formatCurrencyShort(futureValue)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    @ 12% expected annual return
                  </p>
                </div>

                {/* Donut Chart */}
                <div className="flex items-center justify-center mb-8">
                  <div className="relative w-48 h-48">
                    <div
                      className="w-full h-full rounded-full"
                      style={{ background: conicGradient }}
                    />
                    <div className="absolute inset-4 rounded-full bg-card flex items-center justify-center flex-col">
                      <span className="text-xs text-muted-foreground">
                        SIP
                      </span>
                      <span className="text-lg font-bold tabular-nums text-primary">
                        {formatCurrencyShort(effectiveSip)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <Tooltip content="Rent + Groceries + Utilities">
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
                      <span className="w-3 h-3 rounded-full bg-success flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide truncate">
                          Essentials
                        </p>
                        <p className="text-sm font-bold tabular-nums text-foreground">
                          {formatCurrencyShort(
                            rent + groceries + utilities,
                          )}
                        </p>
                      </div>
                    </div>
                  </Tooltip>
                  <Tooltip content="Transport + Entertainment + Subscriptions + Shopping">
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
                      <span className="w-3 h-3 rounded-full bg-warning flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide truncate">
                          Lifestyle
                        </p>
                        <p className="text-sm font-bold tabular-nums text-foreground">
                          {formatCurrencyShort(
                            transport +
                              entertainment +
                              subscriptions +
                              shopping,
                          )}
                        </p>
                      </div>
                    </div>
                  </Tooltip>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
                    <span className="w-3 h-3 rounded-full bg-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide truncate">
                        SIP
                      </p>
                      <p className="text-sm font-bold tabular-nums text-foreground">
                        {formatCurrencyShort(effectiveSip)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
                    <span className="w-3 h-3 rounded-full bg-muted-foreground/30 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide truncate">
                        Savings
                      </p>
                      <p className="text-sm font-bold tabular-nums text-foreground">
                        {formatCurrencyShort(remainingIncome)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-auto grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      SIP Contribution
                    </p>
                    <p className="text-2xl font-bold tabular-nums text-primary tracking-tight">
                      {formatCurrencyShort(effectiveSip)}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "text-center p-4 rounded-2xl",
                      efficiency >= 80
                        ? "bg-emerald-50/50 dark:bg-emerald-950/30"
                        : efficiency >= 50
                          ? "bg-amber-50/50 dark:bg-amber-950/30"
                          : "bg-red-50/50 dark:bg-red-950/30",
                    )}
                  >
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Budget Efficiency
                    </p>
                    <p
                      className={cn(
                        "text-2xl font-bold tabular-nums tracking-tight",
                        efficiency >= 80
                          ? "text-success"
                          : efficiency >= 50
                            ? "text-warning"
                            : "text-error",
                      )}
                    >
                      {Math.round(efficiency)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
};

export default BudgetSipPlanner;
