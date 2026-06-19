"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Zap,
  PieChart,
  TrendingUp,
  Heart,
  ShieldCheck,
  Landmark,
  Coins,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section, SectionHeading, Container } from "@/components/ui/section";
import { BentoCard } from "@/components/ui/bento-card";
import {
  staggerContainer,
  staggerItem,
  viewportOnce,
} from "@/lib/motion";

interface SolutionItem {
  id: string;
  title: string;
  tagline: string;
  icon: LucideIcon;
  gradient: string;
  size: "large" | "wide" | "default";
  features: string[];
}

const solutions: SolutionItem[] = [
  {
    id: "SIF",
    title: "Seed Investment Framework",
    tagline:
      "The foundational blueprint integrating all aspects of your financial journey.",
    icon: Zap,
    gradient: "#3B82F6",
    size: "large",
    features: [
      "Personalized financial roadmap",
      "Integrated MF & insurance planning",
      "Annual portfolio optimization",
      "Goal-based wealth management",
    ],
  },
  {
    id: "MF",
    title: "Mutual Funds",
    tagline:
      "Diversified portfolios across 150+ schemes for goal-based investing.",
    icon: PieChart,
    gradient: "#8B5CF6",
    size: "wide",
    features: [
      "Goal-based portfolio construction",
      "NSE/BSE execution with WealthElite",
      "SIP, STP, and SWP flexibility",
    ],
  },
  {
    id: "PMS",
    title: "Portfolio Management",
    tagline: "Bespoke discretionary PMS for HNI investors.",
    icon: TrendingUp,
    gradient: "#06B6D4",
    size: "default",
    features: [
      "Professionally curated HNI portfolios",
      "Personalized investment strategies",
    ],
  },
  {
    id: "LIFE",
    title: "Life Insurance",
    tagline: "Secure your family's future with comprehensive life cover.",
    icon: Heart,
    gradient: "#EC4899",
    size: "default",
    features: [
      "Term, ULIP & guaranteed plans",
      "Legacy & wealth transfer planning",
    ],
  },
  {
    id: "HEALTH",
    title: "Health Insurance",
    tagline: "Protect your health without compromising your financial goals.",
    icon: ShieldCheck,
    gradient: "#10B981",
    size: "wide",
    features: [
      "Top insurers, comprehensive coverage",
      "Claims, renewals & tax guidance",
    ],
  },
  {
    id: "LOAN",
    title: "Loan Against MFs",
    tagline: "Unlock liquidity without selling your investments.",
    icon: Landmark,
    gradient: "#F59E0B",
    size: "default",
    features: [
      "Instant digital loan approval",
      "Competitive interest rates",
    ],
  },
  {
    id: "DEBT",
    title: "Debt Funds",
    tagline: "Stable returns with superior post-tax efficiency.",
    icon: Coins,
    gradient: "#6366F1",
    size: "default",
    features: [
      "AAA-rated corporate bond funds",
      "Better after-tax yield than FDs",
    ],
  },
];

function getSpanClasses(size: SolutionItem["size"]): string {
  switch (size) {
    case "large":
      return "lg:col-span-2 lg:row-span-2";
    case "wide":
      return "lg:col-span-2 lg:row-span-1";
    default:
      return "lg:col-span-1 lg:row-span-1";
  }
}

function getIconSize(size: SolutionItem["size"]): number {
  switch (size) {
    case "large":
      return 32;
    case "wide":
      return 28;
    default:
      return 24;
  }
}

const FinancialSolutions: React.FC = () => {
  return (
    <Section className="relative bg-gradient-to-b from-background via-muted/30 to-background overflow-hidden">
      <Container>
        <SectionHeading
          title={
            <>
              A Complete Financial
              <br />
              <span className="text-gradient-blue">Ecosystem</span>
            </>
          }
          subtitle="From our core framework to specialized solutions, discover how our integrated services empower your financial independence."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {solutions.map((solution) => {
            const Icon = solution.icon;
            return (
              <motion.div
                key={solution.id}
                variants={staggerItem}
                className={getSpanClasses(solution.size)}
              >
                <BentoCard
                  variant={
                    solution.size === "large" ? "featured" : "default"
                  }
                  gradient={solution.gradient}
                  className="h-full"
                  icon={
                    <Icon
                      size={getIconSize(solution.size)}
                      strokeWidth={1.5}
                    />
                  }
                  title={solution.title}
                  description={solution.tagline}
                >
                  {solution.size === "large" && (
                    <ul className="space-y-2 mt-6">
                      {solution.features.map((f, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  {solution.size === "wide" && (
                    <ul className="space-y-1.5 mt-4">
                      {solution.features.map((f, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <span className="w-1 h-1 rounded-full bg-muted-foreground/40 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </BentoCard>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </Section>
  );
};

export default FinancialSolutions;
