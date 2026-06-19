"use client";

import React, { useState, useMemo } from "react";
import { ChevronDown, Plus, Trash2, Target } from "lucide-react";
import { Section, Container } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAnimatedCounter } from "@/hooks/use-animated-counter";
import { formatCurrencyShort } from "@/lib/format/currency";
import {
  calculateGoalPlan,
  type Goal,
} from "@/lib/finance/goal-planner";
import GoalChart from "@/components/charts/goal-chart";
import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

const FinancialGoalPlanner: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      name: "Retirement",
      amount: 50000000,
      horizon: 15,
      inflation: 6,
    },
  ]);
  const [openGoalId, setOpenGoalId] = useState<number | null>(1);
  const [nextId, setNextId] = useState(2);

  const [initialSavings, setInitialSavings] = useState(500000);
  const [monthlySip, setMonthlySip] = useState(25000);
  const [sipIncrease, setSipIncrease] = useState(10);
  const [cagr, setCagr] = useState(12);

  const plannerData = useMemo(
    () =>
      calculateGoalPlan(goals, initialSavings, monthlySip, sipIncrease, cagr),
    [goals, initialSavings, monthlySip, sipIncrease, cagr],
  );

  const handleGoalChange = (
    id: number,
    field: keyof Goal,
    value: string | number,
  ) => {
    setGoals(
      goals.map((g) => (g.id === id ? { ...g, [field]: value } : g)),
    );
  };

  const addGoal = () => {
    const newGoal: Goal = {
      id: nextId,
      name: `New Goal ${nextId}`,
      amount: 10000000,
      horizon: 10,
      inflation: 6,
    };
    setGoals([...goals, newGoal]);
    setOpenGoalId(nextId);
    setNextId(nextId + 1);
  };

  const removeGoal = (id: number) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  const animatedProjectedValue = useAnimatedCounter(
    plannerData.projectedInvestmentValue,
  );
  const animatedTotalGoalValue = useAnimatedCounter(
    plannerData.totalFutureGoalValue,
  );

  const statusClasses = {
    success: {
      text: "text-green-700 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-950",
    },
    warning: {
      text: "text-amber-700 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950",
    },
    danger: {
      text: "text-red-700 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-950",
    },
  };
  const currentStatusStyle = statusClasses[plannerData.statusClass];

  return (
    <Section id="goal-planner" className="bg-muted/30">
      <Container>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Financial Goal Planner
          </h2>
          <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Visualize your path to financial independence by planning for all
            your life goals.
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
            <Card className="p-8 md:p-10 space-y-8">
              {/* Goals */}
              <div>
                <h3 className="text-base font-semibold text-foreground mb-4">
                  Your Goals
                </h3>
                <div className="space-y-3">
                  {goals.map((goal) => {
                    const isOpen = openGoalId === goal.id;
                    return (
                      <div
                        key={goal.id}
                        className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden"
                      >
                        {/* FIX: Input is OUTSIDE the button - siblings */}
                        <div className="flex items-center justify-between p-4 gap-2">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <Target className="w-4 h-4 text-primary flex-shrink-0" />
                            <Input
                              value={goal.name}
                              onChange={(e) =>
                                handleGoalChange(
                                  goal.id,
                                  "name",
                                  e.target.value,
                                )
                              }
                              className="h-auto py-0 border-0 bg-transparent font-semibold text-foreground px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                              aria-label="Goal name"
                            />
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {goals.length > 1 && (
                              <button
                                onClick={() => removeGoal(goal.id)}
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-error hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                                aria-label={`Remove ${goal.name}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() =>
                                setOpenGoalId(isOpen ? null : goal.id)
                              }
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                              aria-expanded={isOpen}
                              aria-label={
                                isOpen
                                  ? "Collapse goal details"
                                  : "Expand goal details"
                              }
                            >
                              <ChevronDown
                                className={cn(
                                  "w-4 h-4 transition-transform duration-300",
                                  isOpen && "rotate-180",
                                )}
                              />
                            </button>
                          </div>
                        </div>
                        <div
                          className={cn(
                            "grid transition-all duration-300 ease-in-out",
                            isOpen
                              ? "grid-rows-[1fr] opacity-100"
                              : "grid-rows-[0fr] opacity-0",
                          )}
                        >
                          <div className="overflow-hidden space-y-4 px-4 pb-4">
                            <Slider
                              label="Goal value (today)"
                              value={goal.amount}
                              min={100000}
                              max={100000000}
                              step={100000}
                              onChange={(v) =>
                                handleGoalChange(goal.id, "amount", v)
                              }
                              formatValue={formatCurrencyShort}
                            />
                            <Slider
                              label="Time horizon"
                              value={goal.horizon}
                              min={1}
                              max={40}
                              step={1}
                              onChange={(v) =>
                                handleGoalChange(goal.id, "horizon", v)
                              }
                              formatValue={(v) => v.toString()}
                              suffix=" Yrs"
                            />
                            <Slider
                              label="Inflation"
                              value={goal.inflation}
                              min={2}
                              max={12}
                              step={0.5}
                              onChange={(v) =>
                                handleGoalChange(goal.id, "inflation", v)
                              }
                              formatValue={(v) => v.toString()}
                              suffix="%"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Button
                  onClick={addGoal}
                  variant="outline"
                  className="mt-3 w-full"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Another Goal
                </Button>
              </div>

              {/* Investment Plan */}
              <div>
                <h3 className="text-base font-semibold text-foreground mb-4">
                  Your Investment Plan
                </h3>
                <div className="bg-muted/50 rounded-2xl p-5 space-y-6 border border-border/50">
                  {/* Required SIP suggestion - FIX: no longer auto-overwrites */}
                  <div className="text-center bg-card rounded-xl border border-dashed border-primary/40 p-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                      Suggested Monthly SIP for All Goals
                    </p>
                    <p className="text-xl font-bold text-primary tracking-tight">
                      {formatCurrencyShort(plannerData.totalRequiredSip)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-xs"
                      onClick={() =>
                        setMonthlySip(
                          Math.round(plannerData.totalRequiredSip / 500) * 500,
                        )
                      }
                    >
                      Use Suggested Amount
                    </Button>
                  </div>

                  <Slider
                    label="Your Monthly SIP"
                    value={monthlySip}
                    min={500}
                    max={Math.max(500000, plannerData.totalRequiredSip * 2)}
                    step={500}
                    onChange={setMonthlySip}
                    formatValue={formatCurrencyShort}
                  />
                  <Slider
                    label="Current Savings"
                    value={initialSavings}
                    min={0}
                    max={10000000}
                    step={50000}
                    onChange={setInitialSavings}
                    formatValue={formatCurrencyShort}
                  />
                  <Slider
                    label="SIP Increase (yrly)"
                    value={sipIncrease}
                    min={0}
                    max={25}
                    step={1}
                    onChange={setSipIncrease}
                    formatValue={(v) => v.toString()}
                    suffix="%"
                  />
                  <Slider
                    label="Exp. Return (CAGR)"
                    value={cagr}
                    min={5}
                    max={20}
                    step={0.5}
                    onChange={setCagr}
                    formatValue={(v) => v.toString()}
                    suffix="%"
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Right: Results + Chart */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-8 md:p-10 flex flex-col h-full">
              {/* Status Banner */}
              <div
                key={plannerData.status}
                className={cn(
                  "animate-fade-in rounded-xl py-2.5 px-4 text-center text-xs font-medium mb-6",
                  currentStatusStyle.bg,
                  currentStatusStyle.text,
                )}
              >
                {plannerData.status}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 rounded-2xl bg-muted/50">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Total Goal Value
                  </p>
                  <p className="text-xl font-bold tabular-nums text-foreground">
                    {formatCurrencyShort(animatedTotalGoalValue)}
                  </p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Projected Corpus
                  </p>
                  <p className="text-xl font-bold tabular-nums text-primary">
                    {formatCurrencyShort(animatedProjectedValue)}
                  </p>
                </div>
              </div>

              {/* Chart */}
              <div className="flex-grow min-h-[250px]">
                <GoalChart
                  investmentData={plannerData.investmentGrowthData}
                  goalData={plannerData.goalGrowthData}
                  timeHorizon={plannerData.maxHorizon}
                  formatFunction={formatCurrencyShort}
                  goalMarkers={plannerData.goalMarkers}
                />
              </div>

              {/* Goal Legend */}
              {plannerData.goalMarkers.length > 0 && (
                <div className="mt-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Goal Status
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {plannerData.goalMarkers.map((marker) => (
                      <span
                        key={marker.id}
                        className="text-xs text-muted-foreground"
                      >
                        <span className="font-semibold text-foreground">
                          {marker.name}
                        </span>
                        :{" "}
                        <span
                          className={
                            marker.status === "met"
                              ? "text-success font-medium"
                              : "text-warning font-medium"
                          }
                        >
                          {marker.status === "met"
                            ? "On Track"
                            : "Needs Review"}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
};

export default FinancialGoalPlanner;
