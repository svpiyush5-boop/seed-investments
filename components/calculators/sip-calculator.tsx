"use client";

import React, { useMemo, useRef, useEffect } from "react";
import { Section } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Container } from "@/components/ui/section";
import { calculateSip } from "@/lib/finance/sip";
import { formatCurrency, formatCurrencyShort } from "@/lib/format/currency";
import { useAnimatedCounter } from "@/hooks/use-animated-counter";
import GrowthChart from "@/components/charts/growth-chart";
import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "@/lib/motion";

interface GrowthPoint {
  year: number;
  invested: number;
  total: number;
}

const SipCalculator: React.FC = () => {
  const [monthlySip, setMonthlySip] = React.useState(5000);
  const [years, setYears] = React.useState(15);
  const [returnRate, setReturnRate] = React.useState(12);

  const result = useMemo(
    () => calculateSip(monthlySip, years, returnRate),
    [monthlySip, years, returnRate],
  );

  const futureValue = useAnimatedCounter(result.futureValue);
  const totalInvested = useAnimatedCounter(result.totalInvested);
  const estimatedReturns = useAnimatedCounter(result.estimatedReturns);

  const growthData: GrowthPoint[] = useMemo(() => {
    const data: GrowthPoint[] = [];
    for (let y = 1; y <= years; y++) {
      const r = calculateSip(monthlySip, y, returnRate);
      data.push({
        year: y,
        invested: r.totalInvested,
        total: r.futureValue,
      });
    }
    return data;
  }, [monthlySip, years, returnRate]);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartDimensions, setChartDimensions] = React.useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateSize = () => {
      if (chartContainerRef.current) {
        const rect = chartContainerRef.current.getBoundingClientRect();
        setChartDimensions({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    if (chartContainerRef.current) {
      observer.observe(chartContainerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const investedPct =
    result.futureValue > 0
      ? (result.totalInvested / result.futureValue) * 100
      : 0;
  const returnsPct = Math.max(0, 100 - investedPct);

  return (
    <Section
      id="calculator"
      className="bg-muted/30 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent dark:from-background pointer-events-none z-0" />

      <Container className="relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            The Power of SIP
          </h2>
          <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            See how your wealth compounds over time with consistent investing.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          {/* Inputs */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="lg:col-span-5"
          >
            <Card className="p-8 md:p-10">
              <CardContent className="p-0 space-y-8">
                <Slider
                  label="Monthly SIP"
                  value={monthlySip}
                  onChange={setMonthlySip}
                  min={500}
                  max={500000}
                  step={500}
                  formatValue={formatCurrency}
                  caption="Amount you invest every month"
                />
                <Slider
                  label="Investment Period"
                  value={years}
                  onChange={setYears}
                  min={1}
                  max={40}
                  step={1}
                  formatValue={(v) => v.toString()}
                  suffix=" Years"
                  caption="How long you plan to invest"
                />
                <Slider
                  label="Expected Return Rate"
                  value={returnRate}
                  onChange={setReturnRate}
                  min={5}
                  max={20}
                  step={0.5}
                  formatValue={(v) => v.toString()}
                  suffix="%"
                  caption="Annual return expectation"
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Results + Chart */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            transition={{ delay: 0.1 }}
            className="lg:col-span-7"
          >
            <Card className="p-8 md:p-10">
              <CardContent className="p-0">
                <div className="text-center mb-8">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Total Value After {years} Years
                  </p>
                  <p
                    className="font-extrabold tracking-tighter tabular-nums leading-tight text-primary"
                    style={{
                      fontSize: "clamp(2rem, 4vw, 3rem)",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {formatCurrency(futureValue)}
                  </p>
                </div>

                {/* Growth Chart */}
                <div
                  ref={chartContainerRef}
                  className="w-full h-[280px] mb-8"
                >
                  {chartDimensions.width > 0 && (
                    <GrowthChart
                      data={growthData}
                      totalYears={years}
                      formatFunction={formatCurrencyShort}
                    />
                  )}
                </div>

                {/* Breakdown */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Total Invested
                    </p>
                    <p className="text-xl font-bold tabular-nums tracking-tight text-foreground">
                      {formatCurrencyShort(totalInvested)}
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Estimated Returns
                    </p>
                    <p className="text-xl font-bold tabular-nums tracking-tight text-emerald-600 dark:text-emerald-400">
                      {formatCurrencyShort(estimatedReturns)}
                    </p>
                  </div>
                </div>

                {/* Composition Bar */}
                <div className="mt-6">
                  <div className="flex h-4 w-full rounded-full overflow-hidden bg-muted ring-1 ring-border">
                    <div
                      className="bg-blue-200 dark:bg-blue-900 transition-all duration-500 ease-out"
                      style={{ width: `${investedPct}%` }}
                    />
                    <div
                      className="bg-primary transition-all duration-500 ease-out"
                      style={{ width: `${returnsPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-200 dark:bg-blue-900" />
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Invested
                      </span>
                      <span className="text-xs font-bold tabular-nums text-foreground">
                        {investedPct.toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-primary" />
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Returns
                      </span>
                      <span className="text-xs font-bold tabular-nums text-primary">
                        {returnsPct.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center mt-10 text-sm text-muted-foreground font-medium"
        >
          Visualize how your investments and returns grow over time with the
          power of compounding.
        </motion.p>
      </Container>
    </Section>
  );
};

export default SipCalculator;
