"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading, Container } from "@/components/ui/section";
import {
  staggerContainer,
  staggerItem,
  viewportOnce,
} from "@/lib/motion";

interface BlogPost {
  title: string;
  summary: string;
  tag: string;
  cta: string;
  gradient: string;
}

const posts: BlogPost[] = [
  {
    title: "The Compounding Effect: How SIPs Turn Discipline into Wealth",
    summary:
      "Discover how consistent SIP investing helps you build long-term wealth through exponential compounding.",
    tag: "Investing Fundamentals",
    cta: "Read More",
    gradient: "from-blue-500/20 via-blue-400/10 to-transparent",
  },
  {
    title: "Corporate Bonds vs Fixed Deposits: What Works Better in 2025?",
    summary:
      "Compare risk, returns, and post-tax outcomes — and see why AAA-rated bond funds are emerging as smarter alternatives.",
    tag: "Debt Strategies",
    cta: "Explore",
    gradient: "from-emerald-500/20 via-emerald-400/10 to-transparent",
  },
  {
    title: "Smart Tax Planning Through Mutual Funds",
    summary:
      "Learn how ELSS and hybrid funds can help you save tax while maintaining liquidity and growth potential.",
    tag: "Tax Planning",
    cta: "Read",
    gradient: "from-orange-500/20 via-orange-400/10 to-transparent",
  },
];

const BlogCard: React.FC<{ post: BlogPost; large?: boolean }> = ({
  post,
  large = false,
}) => {
  return (
    <div className="group relative bg-card rounded-3xl overflow-hidden border border-border/60 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
      <div
        className={`h-48 md:${large ? "h-56" : "h-40"} bg-gradient-to-br ${post.gradient} flex items-center justify-center`}
      >
        <div className="w-16 h-16 rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl font-serif text-muted-foreground/40">
          ✦
        </div>
      </div>

      <div className="p-6 md:p-8 flex flex-col flex-1">
        <span className="inline-block px-3 py-1 mb-3 text-[10px] font-bold tracking-wider text-primary uppercase bg-blue-50 dark:bg-blue-950 rounded-full w-fit">
          {post.tag}
        </span>

        <h3
          className={`font-serif font-semibold text-foreground leading-snug group-hover:text-primary transition-colors duration-300 mb-3 ${
            large ? "text-2xl" : "text-lg"
          }`}
        >
          {post.title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed flex-1">
          {post.summary}
        </p>

        <div className="mt-5 pt-4 border-t border-border/50">
          <Link
            href="/blog"
            className="inline-flex items-center text-xs font-bold text-primary hover:text-primary-dark transition-colors"
          >
            {post.cta}
            <ArrowRight className="h-3.5 w-3.5 ml-1.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const BlogSection: React.FC = () => {
  return (
    <Section className="bg-gradient-to-b from-background to-muted/30">
      <Container>
        <SectionHeading
          title="Insights & Market Perspectives"
          subtitle="Stay informed with expert takes, financial insights, and investment strategies curated by Seed Investments."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <motion.div
            variants={staggerItem}
            className="lg:col-span-2 lg:row-span-1"
          >
            <BlogCard post={posts[0]!} large />
          </motion.div>
          <motion.div variants={staggerItem} className="lg:col-span-1">
            <BlogCard post={posts[1]!} />
          </motion.div>
          <motion.div variants={staggerItem} className="lg:col-span-1">
            <BlogCard post={posts[2]!} />
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
};

export default BlogSection;
