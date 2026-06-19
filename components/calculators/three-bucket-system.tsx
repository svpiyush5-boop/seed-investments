"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  BarChart3,
  Plus,
  Droplet,
  AlertTriangle,
  RefreshCw,
  ArrowDown,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type SimulationState = "idle" | "crashing" | "recovering" | "crashed";

const StpFlowIndicator: React.FC<{ isPaused: boolean }> = ({ isPaused }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center pointer-events-none transition-opacity duration-300 ${isPaused ? "opacity-30" : "opacity-100"}`}
    >
      <span className="text-xs font-bold text-muted-foreground bg-muted/80 backdrop-blur-sm px-2 py-0.5 rounded-md shadow-sm">
        STP
      </span>
      <div className={isPaused ? "[animation-play-state:paused] opacity-50" : ""}>
        <ArrowDown className="w-5 h-5 text-muted-foreground animate-move-down" />
      </div>
    </div>
  );
};

const ThreeBucketSystem: React.FC = () => {
  const [simulationState, setSimulationState] =
    useState<SimulationState>("idle");
  const [crashProgress, setCrashProgress] = useState(0);
  const [equityFill, setEquityFill] = useState(100);
  const [equityRecoveryDrop, setEquityRecoveryDrop] = useState(0);

  const liquidTenure = 12;
  const mixedTenure = 24;
  const totalBufferMonths = liquidTenure + mixedTenure;
  const simulationDuration = totalBufferMonths * 400;
  const equitySimulationDuration = simulationDuration * 20;

  const animationFrameId = useRef<number | null>(null);
  const lastFrameTime = useRef<number>(0);

  const simulationStateRef = useRef(simulationState);
  const crashProgressRef = useRef(crashProgress);
  const equityFillRef = useRef(equityFill);

  useEffect(() => {
    simulationStateRef.current = simulationState;
  }, [simulationState]);
  useEffect(() => {
    crashProgressRef.current = crashProgress;
  }, [crashProgress]);
  useEffect(() => {
    equityFillRef.current = equityFill;
  }, [equityFill]);

  useEffect(() => {
    if (animationFrameId.current)
      cancelAnimationFrame(animationFrameId.current);

    if (simulationState === "crashing") {
      setEquityRecoveryDrop(0);
      lastFrameTime.current = performance.now();
      const animate = (timestamp: number) => {
        const deltaTime = timestamp - lastFrameTime.current;
        lastFrameTime.current = timestamp;

        const currentSimState = simulationStateRef.current;

        if (currentSimState === "crashing") {
          if (crashProgressRef.current < 100) {
            const progressChange = (deltaTime / simulationDuration) * 100;
            const newProgress = Math.min(
              100,
              crashProgressRef.current + progressChange,
            );
            setCrashProgress(newProgress);
          } else {
            const equityChange = (deltaTime / equitySimulationDuration) * 100;
            const newFill = Math.max(0, equityFillRef.current - equityChange);
            setEquityFill(newFill);
            if (newFill === 0) {
              setSimulationState("crashed");
              return;
            }
          }
        } else if (currentSimState === "recovering") {
          const progressChange = (deltaTime / simulationDuration) * 100 * 1.5;
          const newProgress = Math.max(
            0,
            crashProgressRef.current - progressChange,
          );
          setCrashProgress(newProgress);
          if (newProgress === 0) {
            setSimulationState("idle");
            return;
          }
        } else {
          return;
        }

        animationFrameId.current = requestAnimationFrame(animate);
      };
      animationFrameId.current = requestAnimationFrame(animate);
    } else if (simulationState === "recovering") {
      setEquityFill(100);
      setEquityRecoveryDrop(15);
      lastFrameTime.current = performance.now();
      const animate = (timestamp: number) => {
        const deltaTime = timestamp - lastFrameTime.current;
        lastFrameTime.current = timestamp;

        if (simulationStateRef.current === "recovering") {
          const progressChange = (deltaTime / simulationDuration) * 100 * 1.5;
          const newProgress = Math.max(
            0,
            crashProgressRef.current - progressChange,
          );
          setCrashProgress(newProgress);
          if (newProgress === 0) {
            setSimulationState("idle");
            return;
          }
        } else {
          return;
        }

        animationFrameId.current = requestAnimationFrame(animate);
      };
      animationFrameId.current = requestAnimationFrame(animate);
    } else if (simulationState === "idle") {
      setEquityRecoveryDrop(0);
      setCrashProgress(0);
      setEquityFill(100);
    }

    return () => {
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulationState]);

  const handleSimulateClick = () => {
    if (simulationState === "idle" || simulationState === "recovering") {
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
      setCrashProgress(0);
      setEquityFill(100);
      setEquityRecoveryDrop(0);
      setTimeout(() => setSimulationState("crashing"), 50);
    } else if (simulationState === "crashed") {
      setSimulationState("recovering");
    }
  };

  const mixedThreshold = (mixedTenure / totalBufferMonths) * 100;
  let mixedFill = 100;
  let liquidFill = 100;

  if (crashProgress <= mixedThreshold) {
    mixedFill = 100 - (crashProgress / mixedThreshold) * 100;
  } else {
    mixedFill = 0;
    const liquidProgress =
      (crashProgress - mixedThreshold) / (100 - mixedThreshold);
    liquidFill = 100 - liquidProgress * 100;
  }

  const elapsedMonths =
    crashProgress < 100
      ? Math.floor((crashProgress / 100) * totalBufferMonths)
      : totalBufferMonths;

  const equityHeight = equityFill - equityRecoveryDrop;

  let buttonText: string;
  let infoText: string | undefined;
  if (simulationState === "idle") {
    buttonText = "Simulate Market Crash";
  } else if (simulationState === "crashing") {
    if (crashProgress < 100) {
      buttonText = "Crashing...";
      infoText = `Market Downturn: ${elapsedMonths} / ${totalBufferMonths} months`;
    } else {
      buttonText = "Equity Depleting...";
      infoText = "Buffer Exhausted! Using Equity...";
    }
  } else if (simulationState === "crashed") {
    buttonText = "Simulate Recovery";
    infoText = "Equity buffer fully depleted.";
  } else {
    buttonText = "Recovering...";
  }

  return (
    <Section className="bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeading
          title="The 3-Bucket Retirement Waterfall"
          subtitle="A visual guide to how your retirement income stays safe during market volatility."
        />

        <div className="max-w-sm md:max-w-lg mx-auto">
          <Card className="rounded-3xl p-4 sm:p-5 shadow-xl">
            <div className="relative">
              <div className="w-full h-[500px] flex flex-col rounded-xl overflow-hidden border border-border shadow-inner bg-muted/30">
                <div className="flex-[4] flex flex-col bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                  <div
                    className="absolute bottom-0 w-full transition-all duration-[7500ms] ease-out"
                    style={{ height: `${equityHeight}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2c5282] to-[#3a6ea5]" />
                    <div className="relative z-10 h-full flex items-center justify-center text-white p-4 gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                        <BarChart3 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base">Equity</h3>
                        <p className="text-xs text-blue-200">
                          Long-term growth engine
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-[3] relative bg-muted/50 overflow-hidden">
                  <div
                    className="absolute bottom-0 w-full bg-[#4299e1] transition-all duration-300 ease-out"
                    style={{ height: `${mixedFill}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-3 p-4">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${mixedFill > 50 ? "bg-white/10" : "bg-muted"}`}
                    >
                      <Plus
                        className={`w-6 h-6 ${mixedFill > 50 ? "text-white" : "text-muted-foreground"}`}
                      />
                    </div>
                    <div>
                      <h3
                        className={`font-bold text-base transition-colors duration-300 ${mixedFill > 50 ? "text-white" : "text-muted-foreground"}`}
                      >
                        Mixed (Debt)
                      </h3>
                      <p
                        className={`text-xs transition-colors duration-300 ${mixedFill > 50 ? "text-blue-200" : "text-muted-foreground"}`}
                      >
                        2.0-yr income buffer
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-[2] relative bg-card overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center gap-3 p-4 z-10">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${liquidFill > 50 ? "bg-black/10" : "bg-muted"}`}
                    >
                      <Droplet
                        className={`w-6 h-6 ${liquidFill > 50 ? "text-white" : "text-muted-foreground"}`}
                      />
                    </div>
                    <div>
                      <h3
                        className={`font-bold text-base transition-colors duration-300 ${liquidFill > 50 ? "text-white" : "text-muted-foreground"}`}
                      >
                        Liquid
                      </h3>
                      <p
                        className={`text-xs transition-colors duration-300 ${liquidFill > 50 ? "text-white/80" : "text-muted-foreground"}`}
                      >
                        12 mos immediate income
                      </p>
                    </div>
                  </div>
                  <div
                    className="absolute bottom-0 left-0 w-full bg-[#7dc0eb] transition-all duration-300 ease-out"
                    style={{ height: `${liquidFill}%` }}
                  />
                </div>
              </div>

              <div className="absolute top-[44.5%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full">
                <StpFlowIndicator
                  isPaused={
                    simulationState === "crashing" ||
                    simulationState === "crashed"
                  }
                />
              </div>
              <div className="absolute top-[77.8%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full">
                <StpFlowIndicator isPaused={mixedFill <= 0} />
              </div>
            </div>

            <div className="flex flex-col items-center mt-2">
              <ArrowDown className="w-5 h-5 text-green-500 animate-move-down" />
              <p className="mt-1 text-sm font-semibold text-foreground">
                Monthly SWP to Bank
              </p>
              <p className="text-xs text-muted-foreground">
                Your income remains stable.
              </p>
            </div>

            {(simulationState === "crashing" ||
              simulationState === "crashed") &&
              infoText && (
                <div className="mt-2 text-center text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400 p-2 rounded-lg animate-fade-in">
                  {infoText}
                </div>
              )}

            <div className="w-full pt-4 mt-2 border-t border-border">
              <Button
                onClick={handleSimulateClick}
                disabled={
                  simulationState === "recovering" ||
                  simulationState === "crashing"
                }
                variant={
                  simulationState === "crashed" ? "outline" : "outline"
                }
                className={`w-full text-base ${
                  simulationState === "crashed"
                    ? "text-green-800 bg-green-100 hover:bg-green-200 border-green-200/50 dark:text-green-400 dark:bg-green-950"
                    : "text-red-800 bg-red-100 hover:bg-red-200 border-red-200/50 dark:text-red-400 dark:bg-red-950"
                }`}
              >
                {simulationState === "crashed" ? (
                  <RefreshCw className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
                {buttonText}
              </Button>
            </div>
          </Card>

          <Card className="mt-8 p-6 shadow-md animate-fade-in-up">
            <h3 className="text-xl font-bold text-foreground text-center mb-3">
              Why This Strategy Matters
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The 3-bucket system creates a firewall for your retirement. The{" "}
              <strong>Liquid</strong> and <strong>Mixed</strong> buckets provide
              a <strong>{totalBufferMonths}-month buffer</strong>, ensuring your
              monthly income is secure.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              During a market crash, the system automatically{" "}
              <strong>pauses transfers (STP)</strong> from your Equity bucket.
              This crucial step prevents you from selling your growth assets at
              low prices, giving your portfolio the time it needs to recover and
              grow.
            </p>
          </Card>
        </div>
      </div>
    </Section>
  );
};

export default ThreeBucketSystem;
