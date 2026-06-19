"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useMotionValue,
  type MotionValue,
} from "framer-motion";
import {
  ArrowRight,
  PieChart,
  BarChart3,
  Target,
  Shield,
  Coins,
  ArrowUpRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// --- TYPES ---
interface ChapterStrategy {
  title: string;
  description: string;
  buttonText: string;
  visualIcon: LucideIcon;
}

interface Chapter {
  id: string;
  label: string;
  numericAge: number;
  strategy: ChapterStrategy;
}

interface BlogPost {
  id: number;
  category: string;
  title: string;
  description: string;
}

// --- DATA ---
const chapters: Chapter[] = [
  {
    id: "20s",
    label: "20s",
    numericAge: 20,
    strategy: {
      title: "Launchpad for Life",
      description:
        "Time is your greatest asset. Start small, build habits, and let compounding do the heavy lifting.",
      buttonText: "Start a Simple SIP",
      visualIcon: BarChart3,
    },
  },
  {
    id: "30s",
    label: "30s",
    numericAge: 30,
    strategy: {
      title: "Building Foundations",
      description:
        "Life gets busier. Give every rupee a job and align investments strictly with your life goals.",
      buttonText: "Align SIPs With Goals",
      visualIcon: PieChart,
    },
  },
  {
    id: "40s",
    label: "40s",
    numericAge: 40,
    strategy: {
      title: "Accelerating Wealth",
      description:
        "Income peaks here. Maximize savings and diversify to protect the empire you are building.",
      buttonText: "Start SIP Step-Up",
      visualIcon: Target,
    },
  },
  {
    id: "50s",
    label: "50s",
    numericAge: 50,
    strategy: {
      title: "Securing the Horizon",
      description:
        "Protection beats aggressive growth. Shift your focus from accumulation to preservation.",
      buttonText: "Review Balance",
      visualIcon: Shield,
    },
  },
  {
    id: "60s",
    label: "60+",
    numericAge: 60,
    strategy: {
      title: "Golden Legacy",
      description:
        "Freedom, not accumulation. Wealth should now serve you with a worry-free income stream.",
      buttonText: "Income Plans",
      visualIcon: Coins,
    },
  },
];

const blogPosts: BlogPost[] = [
  {
    id: 1,
    category: "Market Insight",
    title: "Why the Bear Market is your best friend.",
    description:
      "Understanding market cycles can turn fear into opportunity.",
  },
  {
    id: 2,
    category: "Strategy",
    title: "The hidden cost of 'Waiting for the dip'.",
    description:
      "Time in the market beats timing the market almost every time.",
  },
  {
    id: 3,
    category: "Mindset",
    title: "Stop checking your portfolio every day.",
    description:
      "Long term wealth creation requires a detached approach.",
  },
  {
    id: 4,
    category: "Tax",
    title: "Smart ways to save tax this season.",
    description:
      "Legal ways to optimize your returns post-tax using ELSS.",
  },
];

// --- ANIMATION VARIANTS ---
const itemVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 20 : -20,
    opacity: 0,
    filter: "blur(4px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 20 : -20,
    opacity: 0,
    filter: "blur(4px)",
    transition: { duration: 0.3, ease: "easeIn" },
  }),
};

const buttonVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 15 : -15,
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1],
      delay: 0.1,
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 15 : -15,
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.2 },
  }),
};

const containerVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 30 : -30,
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" },
  }),
};

// --- SUB-COMPONENTS ---

const AnimatedCounter = ({ springValue }: { springValue: MotionValue<number> }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = String(Math.round(springValue.get()));
    }
    const unsubscribe = springValue.on("change", (latest: number) => {
      if (ref.current) {
        ref.current.textContent = String(Math.round(latest));
      }
    });
    return unsubscribe;
  }, [springValue]);

  return <span ref={ref}>{Math.round(springValue.get())}</span>;
};

const ChapterIndicator = ({
  chapter,
  direction,
  ageSpring,
}: {
  chapter: Chapter;
  direction: number;
  ageSpring: MotionValue<number>;
}) => {
  const VisualIcon = chapter.strategy.visualIcon;
  const isSixtyPlus = chapter.numericAge === 60;

  return (
    <div className="flex items-center gap-5 md:gap-6 mb-6 md:mb-8">
      <motion.div
        variants={itemVariants}
        custom={direction}
        className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-2xl glass-panel text-[#E6B04A] shadow-2xl shadow-black/50"
      >
        <VisualIcon size={24} className="md:w-7 md:h-7" strokeWidth={1.5} />
      </motion.div>

      <motion.div
        variants={itemVariants}
        custom={direction}
        className="flex flex-col"
      >
        <div className="flex items-baseline gap-1">
          <span className="text-4xl md:text-5xl font-semibold text-white tracking-tighter flex">
            <AnimatedCounter springValue={ageSpring} />
            {isSixtyPlus && "+"}
          </span>
          <span className="text-2xl md:text-3xl text-gray-500 font-medium">
            s
          </span>
        </div>
        <span className="text-[10px] md:text-xs font-bold text-[#E6B04A] tracking-[0.2em] uppercase mt-1 opacity-80">
          Chapter
        </span>
      </motion.div>
    </div>
  );
};

const ContentCard = ({
  chapter,
  direction,
}: {
  chapter: Chapter;
  direction: number;
}) => {
  return (
    <div className="flex flex-col justify-center">
      <motion.h2
        variants={itemVariants}
        custom={direction}
        className="text-3xl md:text-5xl lg:text-6xl font-semibold text-white mb-4 md:mb-6 leading-[1.1] tracking-tight"
      >
        {chapter.strategy.title}
      </motion.h2>

      <motion.p
        variants={itemVariants}
        custom={direction}
        className="text-base md:text-lg text-gray-300 leading-relaxed max-w-xl mb-8 md:mb-10 font-normal"
      >
        {chapter.strategy.description}
      </motion.p>

      <motion.button
        variants={buttonVariants}
        custom={direction}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group flex items-center gap-3 px-5 py-3 md:px-6 md:py-3 bg-white text-black rounded-full w-full md:w-max justify-center md:justify-start shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] will-change-transform"
      >
        <span className="text-sm md:text-base font-semibold tracking-wide">
          {chapter.strategy.buttonText}
        </span>
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
      </motion.button>
    </div>
  );
};

const NavSlider = ({
  chapters,
  activeIndex,
  onChange,
  idPrefix = "nav",
}: {
  chapters: Chapter[];
  activeIndex: number;
  onChange: (index: number) => void;
  idPrefix?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const activeElement = container?.querySelector(
      `button[data-index="${activeIndex}"]`,
    ) as HTMLButtonElement | null;

    if (container && activeElement) {
      const scrollLeft =
        activeElement.offsetLeft -
        container.offsetWidth / 2 +
        activeElement.offsetWidth / 2;
      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  return (
    <div
      ref={containerRef}
      className="glass-panel backdrop-blur-xl p-2 rounded-full flex gap-2 shadow-2xl overflow-x-auto hide-scrollbar w-fit max-w-full mx-auto md:mx-0"
    >
      {chapters.map((chapter, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={chapter.id}
            data-index={index}
            onClick={() => onChange(index)}
            className={`relative px-5 py-3 md:px-8 md:py-4 rounded-full flex-shrink-0 text-sm md:text-base lg:text-lg font-medium transition-all duration-300 ${
              isActive ? "text-gray-100" : "text-gray-500 hover:text-white"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={`${idPrefix}-activeTab`}
                className="absolute inset-0 bg-white/10 border border-white/10 rounded-full shadow-lg"
                transition={{
                  type: "spring",
                  bounce: 0.2,
                  duration: 0.6,
                }}
              />
            )}
            <span className="relative z-10">{chapter.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// --- MAIN HERO COMPONENT ---
const Hero: React.FC = () => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);

  const ageMotionValue = useMotionValue(chapters[0]!.numericAge);
  const ageSpring = useSpring(ageMotionValue, { stiffness: 45, damping: 15 });

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setActiveChapterIndex((prev) => (prev + 1) % chapters.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    ageMotionValue.set(chapters[activeChapterIndex]!.numericAge);
  }, [activeChapterIndex, ageMotionValue]);

  useEffect(() => {
    const currentSentinel = bottomSentinelRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) setIsNavVisible(!entry.isIntersecting);
      },
      { root: null, threshold: 0.1 },
    );

    if (currentSentinel) observer.observe(currentSentinel);
    return () => {
      if (currentSentinel) observer.unobserve(currentSentinel);
    };
  }, []);

  const changeChapter = (newIndex: number) => {
    setDirection(newIndex > activeChapterIndex ? 1 : -1);
    setActiveChapterIndex(newIndex);
  };

  const activeChapter = chapters[activeChapterIndex]!;

  return (
    <section className="min-h-screen flex flex-col bg-black selection:bg-[#E6B04A] selection:text-black w-full overflow-x-hidden">
      <main className="flex-grow flex flex-col justify-center px-5 md:px-12 lg:px-24 pt-20 pb-12 md:pt-32 max-w-[1800px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 lg:gap-24 items-center">
          {/* Left Column */}
          <div className="lg:col-span-5 flex flex-col items-start space-y-6 md:space-y-10">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6 md:mb-10">
                A Financial System <br />
                <span className="text-[#E6B04A]">That Grows With You.</span>
              </h1>
            </div>

            <div className="hidden lg:block w-full">
              <NavSlider
                idPrefix="desktop"
                chapters={chapters}
                activeIndex={activeChapterIndex}
                onChange={changeChapter}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7 w-full relative min-h-[450px] md:min-h-[500px] flex flex-col justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E6B04A] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeChapter.id}
                custom={direction}
                variants={containerVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full transform-gpu"
              >
                <div className="md:hidden mobile-glass-card p-6 rounded-3xl">
                  <ChapterIndicator
                    chapter={activeChapter}
                    direction={direction}
                    ageSpring={ageSpring}
                  />
                  <ContentCard chapter={activeChapter} direction={direction} />
                </div>

                <div className="hidden md:block border-l border-white/10 pl-12 ml-8">
                  <ChapterIndicator
                    chapter={activeChapter}
                    direction={direction}
                    ageSpring={ageSpring}
                  />
                  <ContentCard chapter={activeChapter} direction={direction} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Blog Preview Footer */}
      <footer className="w-full border-t border-white/5 bg-black/40 backdrop-blur-md pb-48 md:pb-0 relative z-10">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-10">
          <div className="flex gap-8 overflow-x-auto hide-scrollbar pb-4 md:pb-0">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="min-w-[280px] md:min-w-[350px] group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#E6B04A] uppercase tracking-wider">
                    {post.category}
                  </span>
                  <ArrowUpRight className="text-gray-400 w-4 h-4 group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-gray-200 font-medium text-lg leading-snug mb-2 group-hover:text-white transition-colors">
                  {post.title}
                </h4>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {post.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div
          ref={bottomSentinelRef}
          className="absolute bottom-10 left-0 w-full h-1 pointer-events-none"
        />
      </footer>

      {/* Mobile Navigation Dock */}
      <AnimatePresence>
        {isNavVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0, x: "-50%" }}
            animate={{ y: 0, opacity: 1, x: "-50%" }}
            exit={{ y: 100, opacity: 0, x: "-50%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="lg:hidden fixed bottom-6 left-1/2 z-[100] w-[90vw] max-w-md flex justify-center"
          >
            <NavSlider
              idPrefix="mobile"
              chapters={chapters}
              activeIndex={activeChapterIndex}
              onChange={changeChapter}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
