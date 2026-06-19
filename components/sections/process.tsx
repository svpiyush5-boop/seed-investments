"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Search,
  UserCheck,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section, SectionHeading, Container } from "@/components/ui/section";
import {
  staggerContainer,
  staggerItem,
  viewportOnce,
} from "@/lib/motion";

interface Phase {
  icon: LucideIcon;
  title: string;
  description: string;
  steps: string[];
}

const phases: Phase[] = [
  {
    icon: Search,
    title: "Discovery",
    description:
      "Understanding your world and exploring the best options for you.",
    steps: [
      "Learn about your income, responsibilities, and aspirations",
      "Explain mutual fund categories and scheme comparisons",
      "Discuss insurance protection needs factually",
    ],
  },
  {
    icon: UserCheck,
    title: "Onboarding",
    description: "Paperless, secure onboarding and execution.",
    steps: [
      "Digital KYC verification and document processing",
      "Secure onboarding on NSE NMF II platform",
      "Transactions executed through regulated infrastructure",
    ],
  },
  {
    icon: BarChart3,
    title: "Tracking",
    description: "Real-time visibility into your entire portfolio.",
    steps: [
      "Access your portfolio anytime via Wealth Elite",
      "Track SIP progress and goal milestones",
      "View capital gains and tax reports",
    ],
  },
  {
    icon: RefreshCw,
    title: "Ongoing",
    description: "Periodic reviews, support, and comprehensive reporting.",
    steps: [
      "Regular portfolio review meetings",
      "Annual portfolio summaries and tax statements",
      "Continuous alignment with your goals",
    ],
  },
];

const ProcessStep: React.FC<{
  phase: Phase;
  index: number;
}> = ({ phase, index }) => {
  const Icon = phase.icon;
  const isLast = index === phases.length - 1;

  return (
    <div className="relative flex flex-col items-center text-center">
      {/* Connector line */}
      {!isLast && (
        <div className="absolute top-12 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-0.5 bg-gradient-to-r from-blue-200 to-blue-100 dark:from-blue-800 dark:to-blue-900 hidden lg:block" />
      )}

      <div className="w-24 h-24 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-primary shadow-sm mb-6 relative z-10 ring-4 ring-background">
        <Icon size={32} strokeWidth={1.5} />
      </div>

      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold mb-4 shadow-sm">
        {index + 1}
      </div>

      <h3 className="text-xl font-bold text-foreground mb-3">
        {phase.title}
      </h3>

      <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
        {phase.description}
      </p>

      <ul className="space-y-2.5 text-left w-full max-w-xs">
        {phase.steps.map((step, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2 flex-shrink-0" />
            <span className="text-sm text-muted-foreground leading-relaxed">
              {step}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Process: React.FC = () => {
  return (
    <Section id="process" className="bg-muted/30">
      <Container>
        <SectionHeading
          eyebrow="How We Work"
          title="A Clear & Transparent Process"
          subtitle="Our structured approach ensures clarity, security, and alignment with your financial goals at every stage."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6"
        >
          {phases.map((phase, index) => (
            <motion.div key={phase.title} variants={staggerItem}>
              <ProcessStep phase={phase} index={index} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
};

export default Process;
