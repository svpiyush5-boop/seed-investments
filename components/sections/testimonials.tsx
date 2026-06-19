"use client";

import React from "react";
import { motion } from "framer-motion";
import { Section, SectionHeading, Container } from "@/components/ui/section";
import {
  staggerContainer,
  staggerItem,
  viewportOnce,
} from "@/lib/motion";

const testimonials = [
  {
    quote:
      "The transparency is refreshing. They explain everything without trying to sell me something I don't need. I appreciate how they use NSE platform and Wealth Elite dashboard — it's secure and professional.",
    name: "Priya M.",
    role: "IT Professional",
  },
  {
    quote:
      "The Wealth Elite dashboard is a game-changer. I can see everything in real-time, track my SIPs, and plan my taxes without stress. It's like having a personal accountant.",
    name: "Sneha T.",
    role: "Marketing Manager",
  },
  {
    quote:
      "Seed Investments doesn't promise unrealistic returns — they give honest guidance and consistent results. I've been investing for 5 years now with complete peace of mind.",
    name: "Rahul S.",
    role: "Entrepreneur",
  },
  {
    quote:
      "They helped me simplify my family's finances. Everything from SIPs to insurance reviews and tax reports is handled so smoothly. Truly transparent and dependable.",
    name: "Divya K.",
    role: "Finance Executive",
  },
];

const TestimonialCard: React.FC<{
  testimonial: (typeof testimonials)[0];
}> = ({ testimonial }) => {
  return (
    <div className="bg-card rounded-3xl p-8 md:p-10 border border-border/60 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
      <div className="text-5xl font-serif text-primary/10 leading-none mb-4 select-none">
        &ldquo;
      </div>
      <p className="text-base md:text-lg font-serif text-foreground leading-relaxed flex-1 italic">
        {testimonial.quote}
      </p>
      <div className="mt-8 pt-6 border-t border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center text-primary font-bold text-sm">
            {testimonial.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">
              {testimonial.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {testimonial.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Testimonials: React.FC = () => {
  return (
    <Section id="testimonials" className="bg-gradient-to-b from-muted/30 to-background">
      <Container>
        <SectionHeading
          title="Real Client Experience"
          subtitle="Hear from families and professionals who trust us with their financial journey."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className={i === 0 ? "md:col-span-2" : ""}
            >
              <TestimonialCard testimonial={t} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
};

export default Testimonials;
