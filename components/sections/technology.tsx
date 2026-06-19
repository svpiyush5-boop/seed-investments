"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, BarChart3, Shield, LayoutDashboard } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section, SectionHeading, Container } from "@/components/ui/section";
import {
  staggerContainer,
  staggerItem,
  viewportOnce,
} from "@/lib/motion";

interface TechPlatform {
  id: string;
  name: string;
  title: string;
  description: string;
  features: string[];
  icon: LucideIcon;
  gradient: string;
  size: "featured" | "default";
  visual: React.ReactNode;
}

const NseVisual: React.FC = () => (
  <div className="relative w-full h-32 md:h-40 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 overflow-hidden">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1.5">
          {[60, 40, 75, 55].map((h, i) => (
            <div
              key={i}
              className="w-2 rounded-full bg-blue-400/60 dark:bg-blue-500/40 transition-all"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="flex flex-col gap-1.5 items-center px-4">
          <div className="w-16 h-8 rounded-lg border-2 border-blue-300 dark:border-blue-700 flex items-center justify-center">
            <div className="w-8 h-0.5 bg-blue-400 rounded" />
            <div className="w-8 h-0.5 bg-blue-400 rounded ml-1" />
          </div>
          <div className="flex gap-1">
            {["#22C55E", "#3B82F6", "#F59E0B"].map((c) => (
              <div
                key={c}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const RedvisionVisual: React.FC = () => (
  <div className="relative w-full h-32 md:h-40 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 overflow-hidden">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex items-end gap-2 h-20">
        {[35, 60, 45, 80, 55, 70, 40].map((h, i) => (
          <div
            key={i}
            className="w-4 md:w-5 rounded-t-md transition-all"
            style={{
              height: `${h}%`,
              background: `linear-gradient(to top, hsl(221, 83%, ${40 + i * 5}%), hsl(221, 83%, ${50 + i * 5}%))`,
              opacity: 0.6 + i * 0.05,
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

const WealthEliteVisual: React.FC = () => (
  <div className="relative w-full h-32 md:h-40 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20 overflow-hidden">
    <div className="absolute inset-0 flex items-center justify-center">
      <svg
        viewBox="0 0 120 50"
        className="w-40 md:w-52 h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path
          d="M0 40 C 15 35, 25 30, 35 32 S 55 20, 65 18 S 85 8, 100 12 S 115 5, 120 8 L 120 50 L 0 50 Z"
          fill="url(#areaGrad)"
        />
        <path
          d="M0 40 C 15 35, 25 30, 35 32 S 55 20, 65 18 S 85 8, 100 12 S 115 5, 120 8"
          fill="none"
          stroke="#10B981"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  </div>
);

const platforms: TechPlatform[] = [
  {
    id: "wealthElite",
    name: "Wealth Elite Dashboard",
    title: "Wealth Elite Dashboard",
    description:
      "Your personal investment command center — complete portfolio visibility 24/7.",
    features: [
      "Live portfolio valuation with latest NAV",
      "Goal GPS for milestone tracking",
      "Segregated capital gains for tax planning",
      "Secure mobile app access (iOS & Android)",
    ],
    icon: LayoutDashboard,
    gradient: "#10B981",
    size: "featured",
    visual: <WealthEliteVisual />,
  },
  {
    id: "nse",
    name: "NSE NMF II Execution",
    title: "NSE NMF II Execution",
    description:
      "SEBI-regulated transaction platform with direct AMC and RTA integration.",
    features: [
      "Fast, compliant transaction processing",
      "SIP, STP & lumpsum investments",
    ],
    icon: Shield,
    gradient: "#3B82F6",
    size: "default",
    visual: <NseVisual />,
  },
  {
    id: "redvision",
    name: "RedVision Access",
    title: "RedVision Analytics",
    description:
      "Data-driven insights on 150+ schemes with real-time analytics.",
    features: [
      "Real-time factsheets & compliance data",
      "Dynamic performance dashboards",
    ],
    icon: BarChart3,
    gradient: "#8B5CF6",
    size: "default",
    visual: <RedvisionVisual />,
  },
];

const Technology: React.FC = () => {
  return (
    <Section className="bg-background">
      <Container>
        <SectionHeading
          title="Powered by Industry-Leading Technology"
          subtitle="We leverage a robust, secure, and transparent technology stack to manage your investments with precision."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {platforms.map((platform) => {
            const Icon = platform.icon;
            const isFeatured = platform.size === "featured";
            return (
              <motion.div
                key={platform.id}
                variants={staggerItem}
                className={isFeatured ? "lg:col-span-1 lg:row-span-1" : ""}
              >
                <div
                  className={`relative overflow-hidden rounded-3xl border transition-all duration-300 h-full flex flex-col ${
                    isFeatured
                      ? "bg-card border-primary/20 dark:border-primary/10 shadow-md hover:shadow-lg"
                      : "bg-card border-border/60 shadow-sm hover:shadow-md"
                  }`}
                >
                  <div
                    className="absolute inset-0 opacity-[0.02] pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 30% 20%, ${platform.gradient}, transparent 60%)`,
                    }}
                  />
                  <div className="relative z-10 p-8 md:p-10">
                    <div className="mb-5 w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-primary shadow-sm">
                      <Icon size={24} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">
                      {platform.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      {platform.description}
                    </p>
                    <ul className="space-y-3">
                      {platform.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2
                            className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                            strokeWidth={2}
                          />
                          <span className="text-sm text-muted-foreground">
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto relative z-10 px-8 md:px-10 pb-8 md:pb-10">
                    {platform.visual}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </Section>
  );
};

export default Technology;
