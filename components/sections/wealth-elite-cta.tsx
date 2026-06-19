"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Repeat,
  FileText,
  MapPin,
  Smartphone,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import {
  staggerContainer,
  staggerItem,
  viewportOnce,
} from "@/lib/motion";

interface Feature {
  name: string;
  description: string;
  icon: LucideIcon;
}

const features: Feature[] = [
  {
    name: "Real-Time Portfolio",
    description: "See current valuation with the latest NAV updates.",
    icon: PieChart,
  },
  {
    name: "SIP Tracker",
    description: "Monitor monthly investments and returns effortlessly.",
    icon: Repeat,
  },
  {
    name: "Tax Reports",
    description: "Auto-generated capital gains summaries for ITR filing.",
    icon: FileText,
  },
  {
    name: "Goal GPS",
    description: "Track progress toward financial milestones visually.",
    icon: MapPin,
  },
  {
    name: "Mobile Access",
    description: "Manage investments 24/7 from any device.",
    icon: Smartphone,
  },
  {
    name: "Security",
    description: "Bank-grade encryption and two-factor authentication.",
    icon: ShieldCheck,
  },
];

const LoginSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gray-900 py-24 md:py-32 lg:py-40">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-blue-400/3 blur-[100px] rounded-full pointer-events-none" />

      <Container className="relative z-10">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-gray-400 tracking-wide">
                Client Portal
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-5">
              Wealth Elite{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                Dashboard
              </span>
            </h2>
            <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Access your complete investment portfolio anytime, anywhere. Your
              personal command center for real-time visibility and data-driven
              reporting.
            </p>
          </div>

          <div className="text-center mb-20">
            <Button
              variant="default"
              size="xl"
              className="bg-white text-gray-900 hover:bg-gray-100 shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:shadow-[0_0_40px_rgba(59,130,246,0.25)]"
            >
              Login to Wealth Elite
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  className="group rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-sm p-6 hover:bg-white/[0.06] transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1.5">
                    {feature.name}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default LoginSection;
