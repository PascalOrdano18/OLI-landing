"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const tools = [
  { name: "Slack", color: "#E01E5A" },
  { name: "Linear", color: "#5E6AD2" },
  { name: "ClickUp", color: "#7B68EE" },
  { name: "Jira", color: "#0052CC" },
  { name: "Notion", color: "#999999" },
  { name: "Asana", color: "#F06A6A" },
  { name: "Monday", color: "#6C6CFF" },
  { name: "Discord", color: "#5865F2" },
  { name: "Teams", color: "#6264A7" },
  { name: "Trello", color: "#0079BF" },
  { name: "Basecamp", color: "#1D2D35" },
  { name: "Confluence", color: "#1868DB" },
];

// Spread tools across the full viewport
const positions = [
  { x: -420, y: -200, rotate: -6, scale: 1.1 },
  { x: 380, y: -180, rotate: 5, scale: 0.9 },
  { x: -300, y: 160, rotate: -3, scale: 1.0 },
  { x: 440, y: 120, rotate: 7, scale: 1.2 },
  { x: 0, y: -260, rotate: -2, scale: 0.85 },
  { x: -150, y: 240, rotate: 4, scale: 1.0 },
  { x: 280, y: -60, rotate: -5, scale: 0.95 },
  { x: -450, y: 30, rotate: 2, scale: 1.05 },
  { x: 180, y: 220, rotate: -4, scale: 0.9 },
  { x: -250, y: -120, rotate: 3, scale: 1.1 },
  { x: 350, y: -240, rotate: -1, scale: 0.8 },
  { x: -80, y: 280, rotate: 6, scale: 0.95 },
];

function ToolItem({
  tool,
  position,
  index,
  toolOpacity,
  toolBlur,
  toolGrayscale,
  convergeProgress,
}: {
  tool: { name: string; color: string };
  position: { x: number; y: number; rotate: number; scale: number };
  index: number;
  toolOpacity: MotionValue<number>;
  toolBlur: MotionValue<number>;
  toolGrayscale: MotionValue<number>;
  convergeProgress: MotionValue<number>;
}) {
  const filterValue = useTransform(
    [toolBlur, toolGrayscale],
    ([blur, gray]: number[]) => `blur(${blur}px) grayscale(${gray})`
  );
  const x = useTransform(convergeProgress, [0, 1], [position.x, 0]);
  const y = useTransform(convergeProgress, [0, 1], [position.y, 0]);
  const rotate = useTransform(convergeProgress, [0, 1], [position.rotate, 0]);
  const scale = useTransform(convergeProgress, [0, 0.6, 1], [position.scale, position.scale * 0.6, 0]);
  const itemOpacity = useTransform(convergeProgress, [0, 0.7, 1], [1, 0.5, 0]);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{
        opacity: useTransform(
          [toolOpacity, itemOpacity],
          ([tO, iO]: number[]) => tO * iO
        ),
        scale,
        filter: filterValue,
        x,
        y,
        rotate,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <span
        className="inline-block px-6 py-3 rounded-2xl text-base font-bold border-2 whitespace-nowrap backdrop-blur-sm"
        style={{
          borderColor: `${tool.color}44`,
          color: tool.color,
          background: `${tool.color}12`,
          fontSize: `${14 + (index % 3) * 4}px`,
        }}
      >
        {tool.name}
      </span>
    </motion.div>
  );
}

const marqueeTools = [
  "Slack", "Linear", "ClickUp", "Jira", "Notion", "Asana",
  "Monday", "Discord", "Teams", "Trello", "Basecamp", "Figma",
];

export default function ToolGraveyard() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Phase 1: tools appear (0.05 → 0.2)
  const toolOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);

  // Phase 2: tools converge and dissolve (0.25 → 0.5)
  const toolBlur = useTransform(scrollYProgress, [0.25, 0.5], [0, 14]);
  const toolGrayscale = useTransform(scrollYProgress, [0.25, 0.5], [0, 1]);
  const convergeProgress = useTransform(scrollYProgress, [0.25, 0.55], [0, 1]);

  // Phase 3: OLI takes over (0.45 → 0.65)
  const oliOpacity = useTransform(scrollYProgress, [0.45, 0.58], [0, 1]);
  const oliScale = useTransform(scrollYProgress, [0.45, 0.65], [0.3, 1]);
  const oliBlur = useTransform(scrollYProgress, [0.45, 0.55], [20, 0]);

  // Glow intensifies
  const glowOpacity = useTransform(scrollYProgress, [0.45, 0.6], [0, 1]);
  const glowScale = useTransform(scrollYProgress, [0.45, 0.65], [0.5, 1]);

  // Headline fades out as OLI takes over
  const headlineOpacity = useTransform(scrollYProgress, [0.4, 0.5], [1, 0]);

  // Marquee fades out
  const marqueeOpacity = useTransform(scrollYProgress, [0.3, 0.45], [0.07, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[300vh] flex items-start justify-center"
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center w-full overflow-hidden">
        {/* Marquee ticker — fades out during convergence */}
        <motion.div
          className="absolute top-16 left-0 right-0 overflow-hidden"
          style={{ opacity: marqueeOpacity }}
        >
          <div className="marquee-track">
            {[...marqueeTools, ...marqueeTools].map((t, i) => (
              <span
                key={`${t}-${i}`}
                className="text-[clamp(60px,12vw,140px)] font-bold tracking-[-0.04em] mx-8 whitespace-nowrap"
                style={{ color: "var(--text-primary)" }}
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Second marquee row — opposite direction */}
        <motion.div
          className="absolute bottom-16 left-0 right-0 overflow-hidden"
          style={{ opacity: marqueeOpacity }}
        >
          <div className="marquee-track" style={{ animationDirection: "reverse", animationDuration: "40s" }}>
            {[...marqueeTools, ...marqueeTools].reverse().map((t, i) => (
              <span
                key={`${t}-rev-${i}`}
                className="text-[clamp(50px,10vw,120px)] font-bold tracking-[-0.04em] mx-8 whitespace-nowrap"
                style={{ color: "var(--text-primary)" }}
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Headline — fades out as OLI takes over */}
        <motion.div
          className="relative z-10 flex flex-col items-center px-6"
          style={{ opacity: headlineOpacity }}
        >
          <motion.span
            className="section-label"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            THE PROBLEM
          </motion.span>

          <motion.h2
            className="mt-5 text-[clamp(40px,6vw,64px)] font-bold tracking-[-0.04em] leading-[0.95] text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
          >
            Stop juggling.
            <br />
            Start building.
          </motion.h2>
        </motion.div>

        {/* Tool logos — spread across full viewport */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-[1200px]">
            {tools.map((tool, i) => (
              <ToolItem
                key={tool.name}
                tool={tool}
                position={positions[i]}
                index={i}
                toolOpacity={toolOpacity}
                toolBlur={toolBlur}
                toolGrayscale={toolGrayscale}
                convergeProgress={convergeProgress}
              />
            ))}
          </div>
        </div>

        {/* OLI TAKEOVER — full viewport */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none"
          style={{ opacity: oliOpacity }}
        >
          {/* Multiple layered glows for intensity */}
          <motion.div
            className="absolute inset-0"
            style={{
              opacity: glowOpacity,
              scale: glowScale,
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.25) 0%, rgba(99,102,241,0.1) 30%, transparent 60%)",
            }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              opacity: glowOpacity,
              scale: glowScale,
              background:
                "radial-gradient(circle 300px at 50% 50%, rgba(139,92,246,0.35) 0%, transparent 70%)",
            }}
          />

          {/* OLI text — massive, viewport-filling */}
          <motion.span
            className="relative z-10 text-[clamp(120px,25vw,280px)] font-bold tracking-[-0.06em] leading-none select-none"
            style={{
              scale: oliScale,
              filter: useTransform(oliBlur, (v) => `blur(${v}px)`),
              background: "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            OLI
          </motion.span>

          {/* Subtitle appears after OLI */}
          <motion.p
            className="relative z-10 mt-4 text-lg sm:text-xl font-medium tracking-tight"
            style={{
              opacity: useTransform(scrollYProgress, [0.58, 0.68], [0, 1]),
              y: useTransform(scrollYProgress, [0.58, 0.68], [20, 0]),
              color: "var(--text-secondary)",
            }}
          >
            All-in-one. As it should be.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
