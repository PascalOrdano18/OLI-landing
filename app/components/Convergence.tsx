"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  MotionValue,
} from "framer-motion";

const TARGET = "OLI";
const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&";

interface Tool {
  name: string;
  x: number;
  y: number;
  size: number;
  weight: number;
  opacity: number;
  rotate: number;
  color: string;
  stagger: number;
}

const rawTools = [
  { name: "Slack", x: -480, y: -280, size: 140, weight: 800, opacity: 0.85, rotate: -15, color: "#E01E5A" },
  { name: "Linear", x: 400, y: -200, size: 100, weight: 600, opacity: 0.65, rotate: 8, color: "#5E6AD2" },
  { name: "ClickUp", x: -280, y: 260, size: 80, weight: 700, opacity: 0.45, rotate: -5, color: "#7B68EE" },
  { name: "Jira", x: 500, y: 180, size: 160, weight: 900, opacity: 0.75, rotate: 12, color: "#0052CC" },
  { name: "Notion", x: -60, y: -350, size: 120, weight: 500, opacity: 0.5, rotate: -3, color: "#999999" },
  { name: "Asana", x: 200, y: 320, size: 90, weight: 600, opacity: 0.35, rotate: 7, color: "#F06A6A" },
  { name: "Monday", x: -520, y: 40, size: 130, weight: 700, opacity: 0.55, rotate: -10, color: "#6C6CFF" },
  { name: "Discord", x: 420, y: -340, size: 110, weight: 800, opacity: 0.65, rotate: 14, color: "#5865F2" },
  { name: "Teams", x: -360, y: -100, size: 70, weight: 400, opacity: 0.3, rotate: 2, color: "#6264A7" },
  { name: "Trello", x: 120, y: 380, size: 95, weight: 600, opacity: 0.4, rotate: -8, color: "#0079BF" },
  { name: "Basecamp", x: -180, y: 180, size: 75, weight: 500, opacity: 0.25, rotate: 5, color: "#1D2D35" },
  { name: "Confluence", x: 540, y: -50, size: 105, weight: 700, opacity: 0.5, rotate: -12, color: "#1868DB" },
  { name: "Figma", x: 60, y: -180, size: 150, weight: 800, opacity: 0.7, rotate: 6, color: "#A259FF" },
  { name: "GitHub", x: -440, y: 330, size: 125, weight: 700, opacity: 0.55, rotate: -7, color: "#238636" },
];

// Compute stagger: tools closer to center scramble first (ripple outward)
const tools: Tool[] = rawTools.map((t) => {
  const dist = Math.sqrt(t.x * t.x + t.y * t.y);
  return { ...t, stagger: (dist / 700) * 0.05 };
});

/** Scroll-driven text scramble: from → random noise → to */
function scrambleText(from: string, to: string, progress: number): string {
  if (progress <= 0) return from;
  if (progress >= 1) return to;

  // Length shrinks from original to target over first 70% of progress
  const len = Math.round(
    from.length - (from.length - to.length) * Math.min(progress * 1.5, 1)
  );

  // Target chars lock in left-to-right after 35% progress
  const lockRatio = Math.max(0, (progress - 0.35) / 0.65);
  const locked = Math.floor(lockRatio * to.length);

  // Original chars survive if their position hasn't been "eaten" yet
  const eatThreshold = progress * 1.8;

  let out = "";
  for (let i = 0; i < len; i++) {
    if (i < locked && i < to.length) {
      out += to[i];
    } else if (i < from.length && i / from.length > eatThreshold) {
      out += from[i];
    } else {
      out += POOL[Math.floor(Math.random() * POOL.length)];
    }
  }
  return out;
}

function ScrambleItem({
  tool,
  scrollYProgress,
}: {
  tool: Tool;
  scrollYProgress: MotionValue<number>;
}) {
  const textRef = useRef<HTMLSpanElement>(null);

  const scrambleStart = 0.28 + tool.stagger;
  const scrambleEnd = 0.44 + tool.stagger;

  // Direct DOM manipulation for text — no React re-renders during scroll
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const el = textRef.current;
    if (!el) return;
    if (v < scrambleStart) {
      el.textContent = tool.name;
    } else if (v >= scrambleEnd) {
      el.textContent = TARGET;
    } else {
      const p = (v - scrambleStart) / (scrambleEnd - scrambleStart);
      el.textContent = scrambleText(tool.name, TARGET, p);
    }
  });

  // Opacity: fade in → hold → fade out (cross-fade with big OLI)
  const opacity = useTransform(
    scrollYProgress,
    [0.05, 0.14, 0.50, 0.56],
    [0, tool.opacity, tool.opacity, 0]
  );

  // Color: brand → white as scramble progresses
  const color = useTransform(
    scrollYProgress,
    [scrambleStart, scrambleEnd],
    [tool.color, "#ffffff"]
  );

  // Rotation normalizes to 0 during scramble (chaos → order)
  const rotate = useTransform(
    scrollYProgress,
    [scrambleStart, scrambleEnd],
    [tool.rotate, 0]
  );

  // Weight increases slightly (solidifying effect)
  const fontWeight = useTransform(
    scrollYProgress,
    [scrambleStart, scrambleEnd],
    [tool.weight, 800]
  );

  return (
    <motion.span
      className="absolute left-1/2 top-1/2 whitespace-nowrap select-none pointer-events-none"
      style={{
        x: tool.x,
        y: tool.y,
        rotate,
        opacity,
        color,
        fontWeight,
        fontSize: tool.size,
        translateX: "-50%",
        translateY: "-50%",
        lineHeight: 1,
      }}
    >
      <span ref={textRef}>{tool.name}</span>
    </motion.span>
  );
}

export default function Convergence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Big OLI cross-fades in as scattered OLIs fade out
  const oliOpacity = useTransform(scrollYProgress, [0.50, 0.58], [0, 1]);
  const oliScale = useTransform(scrollYProgress, [0.50, 0.66], [0.5, 1]);
  const oliBlur = useTransform(scrollYProgress, [0.50, 0.60], [20, 0]);
  const oliFilter = useTransform(oliBlur, (v) => `blur(${v}px)`);

  // Glow builds behind OLI
  const glowOpacity = useTransform(scrollYProgress, [0.50, 0.62], [0, 1]);
  const glowScale = useTransform(scrollYProgress, [0.50, 0.64], [0.3, 1.2]);

  // Subtitle
  const subtitleOpacity = useTransform(scrollYProgress, [0.64, 0.74], [0, 1]);
  const subtitleY = useTransform(scrollYProgress, [0.64, 0.74], [30, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[400vh] flex items-start justify-center"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Scattered tool names that scramble into OLI */}
        <div className="absolute inset-0">
          {tools.map((tool) => (
            <ScrambleItem
              key={tool.name}
              tool={tool}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* The final massive OLI — cross-fades in */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none"
          style={{ opacity: oliOpacity }}
        >
          {/* Layered glows */}
          <motion.div
            className="absolute inset-0"
            style={{
              opacity: glowOpacity,
              scale: glowScale,
              background:
                "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(139,92,246,0.3) 0%, rgba(99,102,241,0.1) 30%, transparent 60%)",
            }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              opacity: glowOpacity,
              scale: glowScale,
              background:
                "radial-gradient(circle 250px at 50% 50%, rgba(139,92,246,0.4) 0%, transparent 70%)",
            }}
          />

          {/* OLI text */}
          <motion.span
            className="relative z-10 text-[clamp(150px,30vw,400px)] font-bold tracking-[-0.06em] leading-none select-none"
            style={{
              scale: oliScale,
              filter: oliFilter,
              background:
                "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.65) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            OLI
          </motion.span>

          {/* Subtitle */}
          <motion.p
            className="relative z-10 mt-6 text-xl sm:text-2xl font-medium tracking-tight"
            style={{
              opacity: subtitleOpacity,
              y: subtitleY,
              color: "var(--text-secondary)",
            }}
          >
            All your tools. One mind.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
