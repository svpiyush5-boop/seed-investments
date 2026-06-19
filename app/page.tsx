import Hero from "@/components/sections/hero";
import FinancialSolutions from "@/components/sections/financial-solutions";
import Technology from "@/components/sections/technology";
import Services from "@/components/sections/services";
import Process from "@/components/sections/process";
import SipCalculator from "@/components/calculators/sip-calculator";
import BudgetSipPlanner from "@/components/calculators/budget-sip-planner";
import FinancialGoalPlanner from "@/components/calculators/goal-planner";
import NriCorner from "@/components/sections/nri-corner";
import AmcPartners from "@/components/sections/amc-partners";
import BlogSection from "@/components/sections/blog-preview";
import Testimonials from "@/components/sections/testimonials";
import LoginSection from "@/components/sections/wealth-elite-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <FinancialSolutions />
      <Technology />
      <Services />
      <Process />
      <SipCalculator />
      <BudgetSipPlanner />
      <FinancialGoalPlanner />
      <NriCorner />
      <AmcPartners />
      <BlogSection />
      <Testimonials />
      <LoginSection />
    </>
  );
}
