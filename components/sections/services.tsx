"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Shield,
  FileText,
  BarChart3,
  Heart,
  ShieldCheck,
  ClipboardCheck,
  Check,
  ChevronDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section, SectionHeading, Container } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import {
  staggerContainer,
  staggerItem,
  viewportOnce,
} from "@/lib/motion";

interface ServiceItem {
  icon: LucideIcon;
  title: string;
  tagline: string;
  points: string[];
}

const mutualFundData: ServiceItem[] = [
  {
    icon: FileText,
    title: "Factual Explanation & Onboarding",
    tagline: "Effortless and transparent mutual fund investing.",
    points: [
      "Comprehensive scheme explanations",
      "Non-prescriptive, goal-linked discussions",
      "KYC, CKYC, & FATCA assistance",
      "Risk profiling & suitability assessment",
    ],
  },
  {
    icon: BarChart3,
    title: "NSE NMF II Execution",
    tagline: "Secure, SEBI-regulated execution via the NSE platform.",
    points: [
      "Fast, compliant transaction processing",
      "SIP, STP & lumpsum investments",
      "Real-time redemption & switch operations",
      "Direct AMC and RTA integration",
    ],
  },
  {
    icon: TrendingUp,
    title: "Wealth Elite Dashboard",
    tagline: "Visualize and track your family's entire wealth ecosystem.",
    points: [
      "Real-time portfolio view",
      "SIP & goal progress tracking",
      "Capital gains and taxation reports",
      "Family-level grouping & insights",
    ],
  },
];

const insuranceData: ServiceItem[] = [
  {
    icon: Heart,
    title: "Life Insurance Advisory",
    tagline: "Long-term financial security for your family.",
    points: [
      "Comprehensive need analysis",
      "Term plan comparison & premium optimization",
      "Claim support & policy tracking",
      "Legacy planning integration",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Health Insurance Planning",
    tagline: "Protect your health and your wealth.",
    points: [
      "Family floater & individual plan design",
      "Cashless network hospital curation",
      "Claim assistance & renewal reminders",
      "IRDAI-compliant advisory approach",
    ],
  },
  {
    icon: ClipboardCheck,
    title: "Protection Portfolio Review",
    tagline: "Annual review for balance and adequacy.",
    points: [
      "Identify coverage gaps",
      "Consolidate and re-align existing policies",
      "Adjust sum assured based on life stage",
      "Periodic reminders & action suggestions",
    ],
  },
];

const ServiceAccordion: React.FC<{
  service: ServiceItem;
  isOpen: boolean;
  onClick: () => void;
}> = ({ service, isOpen, onClick }) => {
  const Icon = service.icon;

  return (
    <div className="border-b border-border/50 last:border-b-0">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-4 text-left group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-primary flex-shrink-0">
            <Icon size={20} strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
              {service.title}
            </h4>
            <p className="text-xs text-muted-foreground truncate">
              {service.tagline}
            </p>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-300 ml-2",
            isOpen && "rotate-180",
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-400 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden pb-4">
          <ul className="space-y-2">
            {service.points.map((point, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const PillarCard: React.FC<{
  icon: LucideIcon;
  title: string;
  tagline: string;
  services: ServiceItem[];
  accentColor: "blue" | "emerald";
}> = ({ icon: Icon, title, tagline, services, accentColor }) => {
  const [openService, setOpenService] = useState<string | null>(
    services[0]?.title ?? null,
  );

  return (
    <div
      className={cn(
        "rounded-3xl border p-8 md:p-10 shadow-sm bg-card",
        accentColor === "blue"
          ? "border-blue-200/60 dark:border-blue-800/30"
          : "border-emerald-200/60 dark:border-emerald-800/30",
      )}
    >
      <div className="flex items-center gap-4 mb-6">
        <div
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm",
            accentColor === "blue"
              ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
              : "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
          )}
        >
          <Icon size={28} strokeWidth={1.5} />
        </div>
        <div>
          <h3
            className={cn(
              "text-2xl font-extrabold tracking-tight",
              accentColor === "blue"
                ? "text-blue-600 dark:text-blue-400"
                : "text-emerald-600 dark:text-emerald-400",
            )}
          >
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{tagline}</p>
        </div>
      </div>
      <div>
        {services.map((service) => (
          <ServiceAccordion
            key={service.title}
            service={service}
            isOpen={openService === service.title}
            onClick={() =>
              setOpenService((prev) =>
                prev === service.title ? null : service.title,
              )
            }
          />
        ))}
      </div>
    </div>
  );
};

const Services: React.FC = () => {
  return (
    <Section className="bg-gradient-to-b from-background to-muted/30">
      <Container>
        <SectionHeading
          title="Two Pillars of Financial Well-being"
          subtitle="Comprehensive services built on creating wealth and protecting it for the long term."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <motion.div variants={staggerItem}>
            <PillarCard
              icon={TrendingUp}
              title="Wealth Creation"
              tagline="Strategic mutual fund services for long-term growth."
              services={mutualFundData}
              accentColor="blue"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <PillarCard
              icon={Shield}
              title="Wealth Protection"
              tagline="Comprehensive insurance advisory for peace of mind."
              services={insuranceData}
              accentColor="emerald"
            />
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
};

export default Services;
