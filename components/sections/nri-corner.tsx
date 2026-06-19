"use client";

import React from "react";
import { Globe } from "@/components/charts/globe";
import { Section, SectionHeading, Container } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Globe as GlobeIcon,
  FileCheck,
  ShieldCheck,
  Banknote,
  Target,
  Headphones,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  staggerContainer,
  staggerItem,
  viewportOnce,
} from "@/lib/motion";

const features = [
  {
    title: "Global Access, Local Expertise",
    desc: "Invest in India's top mutual funds and bonds from anywhere.",
    icon: GlobeIcon,
  },
  {
    title: "100% Online, Paperless Onboarding",
    desc: "Digital KYC and NSE platform execution made seamless.",
    icon: FileCheck,
  },
  {
    title: "Regulatory Clarity & Compliance",
    desc: "SEBI & FEMA-compliant investment process for NRIs.",
    icon: ShieldCheck,
  },
  {
    title: "Tax Guidance & Repatriation",
    desc: "End-to-end support for NRI taxation and fund transfers.",
    icon: Banknote,
  },
  {
    title: "Goal-Based Wealth Planning",
    desc: "Tailored portfolios for education, retirement, and legacy.",
    icon: Target,
  },
  {
    title: "Dedicated Relationship Support",
    desc: "Personal advisory from our NRI Desk across time zones.",
    icon: Headphones,
  },
];

const GlobeVisual: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="relative h-[300px] w-[300px] lg:h-[350px] lg:w-[350px]">
        <div className="absolute inset-0 bg-blue-500/5 blur-[60px] rounded-full" />
        <Globe
          className="h-full w-full relative z-10"
          globeConfig={{
            globeColor: "#f9fafb",
            lineColor: "rgba(0,0,0,0.1)",
            borderColor: "rgba(0,0,0,0.15)",
          }}
          initialCoordinates={{ lat: 20.5937, lng: 78.9629 }}
          autoRotate={true}
          isRotating={true}
          enablePointerInteraction={false}
          markers={[
            { location: [20.5937, 78.9629], size: 0.25, color: "#2563EB" },
            { location: [40.7128, -74.006], size: 0.18, color: "#93C5FD" },
            { location: [25.276987, 55.296249], size: 0.18, color: "#93C5FD" },
            { location: [-33.8688, 151.2093], size: 0.18, color: "#93C5FD" },
            { location: [51.5072, -0.1276], size: 0.18, color: "#93C5FD" },
            { location: [43.6532, -79.3832], size: 0.18, color: "#93C5FD" },
            { location: [24.7136, 46.6753], size: 0.18, color: "#93C5FD" },
          ]}
          arcs={[
            {
              start: [40.7128, -74.006],
              end: [20.5937, 78.9629],
              color: "#60A5FA",
            },
            {
              start: [25.276987, 55.296249],
              end: [20.5937, 78.9629],
              color: "#60A5FA",
            },
            {
              start: [-33.8688, 151.2093],
              end: [20.5937, 78.9629],
              color: "#60A5FA",
            },
            {
              start: [51.5072, -0.1276],
              end: [20.5937, 78.9629],
              color: "#60A5FA",
            },
            {
              start: [43.6532, -79.3832],
              end: [20.5937, 78.9629],
              color: "#60A5FA",
            },
            {
              start: [24.7136, 46.6753],
              end: [20.5937, 78.9629],
              color: "#60A5FA",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default function NriCorner() {
  return (
    <Section
      id="nri-corner"
      className="relative bg-gradient-to-b from-background to-muted/30 overflow-hidden"
    >
      <Container>
        <SectionHeading
          eyebrow="NRI Corner"
          title="Invest in India with Confidence"
          subtitle="Empowering NRIs across the world to build, protect, and grow their wealth in India — with transparent execution and regulatory clarity."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {features.map((item, index) => {
              const Icon = item.icon as LucideIcon;
              return (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  className="group p-5 rounded-2xl bg-card border border-border/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <h4 className="text-foreground font-semibold text-sm mb-1">
                    {item.title}
                  </h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex items-center justify-center lg:pl-6"
          >
            <GlobeVisual />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-16"
        >
          <Button variant="gradient" size="lg">
            Start Your NRI Investment →
          </Button>
        </motion.div>
      </Container>
    </Section>
  );
}
