"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const tools = [
  { name: "Slack", x: -480, y: -280, size: 140, weight: 800, opacity: 0.85, rotate: -15, color: "#E01E5A" },
  { name: "Linear", x: 400, y: -200, size: 100, weight: 600, opacity: 0.6, rotate: 8, color: "#5E6AD2" },
  { name: "ClickUp", x: -280, y: 260, size: 80, weight: 700, opacity: 0.4, rotate: -5, color: "#7B68EE" },
  { name: "Jira", x: 500, y: 180, size: 160, weight: 900, opacity: 0.75, rotate: 12, color: "#0052CC" },
  { name: "Notion", x: -60, y: -350, size: 120, weight: 500, opacity: 0.5, rotate: -3, color: "#999999" },
  { name: "Asana", x: 200, y: 320, size: 90, weight: 600, opacity: 0.35, rotate: 7, color: "#F06A6A" },
  { name: "Monday", x: -520, y: 40, size: 130, weight: 700, opacity: 0.55, rotate: -10, color: "#6C6CFF" },
  { name: "Discord", x: 420, y: -340, size: 110, weight: 800, opacity: 0.65, rotate: 14, color: "#5865F2" },
  { name: "Teams", x: -360, y: -100, size: 70, weight: 400, opacity: 0.3, rotate: 2, color: "#6264A7" },
  { name: "Trello", x: 120, y: 380, size: 95, weight: 600, opacity: 0.4, rotate: -8, color: "#0079BF" },
  { name: "Basecamp", x: -180, y: 180, size: 75, weight: 500, opacity: 0.25, rotate: 5, color: "#1D2D35" },
  { name: "Confluence", x: 540, y: -50, size: 105, weight: 700, opacity: 0.45, rotate: -12, color: "#1868DB" },
  { name: "Figma", x: 60, y: -180, size: 150, weight: 800, opacity: 0.7, rotate: 6, color: "#A259FF" },
  { name: "GitHub", x: -440, y: 330, size: 125, weight: 700, opacity: 0.5, rotate: -7, color: "#238636" },
];

function ConvergenceItem({
  tool,
  scrollYProgress,
}: {
  tool: (typeof tools)[number];
  scrollYProgress: MotionValue<number>;
}) {
  const angle = Math.atan2(-tool.y, -tool.x) * (180 / Math.PI);

  // KEY FIX: tools hold scattered for a long time (0.08–0.36),
  // then convergence is a SNAP (0.36–0.44), but opacity/blur kill
  // visibility BEFORE they reach center, so the ugly overlap is never seen.

  // Position: hold scattered → snap to center
  const x = useTransform(
    scrollYProgress,
    [0.08, 0.36, 0.40, 0.44],
    [tool.x, tool.x, tool.x * 0.15, 0]
  );
  const y = useTransform(
    scrollYProgress,
    [0.08, 0.36, 0.40, 0.44],
    [tool.y, tool.y, tool.y * 0.15, 0]
  );

  // Rotation: stay natural → snap toward center
  const rotate = useTransform(
    scrollYProgress,
    [0.36, 0.40, 0.44],
    [tool.rotate, tool.rotate * 0.3, angle]
  );

  // Stretch distortion only during the fast snap
  const scaleX = useTransform(
    scrollYProgress,
    [0.36, 0.39, 0.42, 0.44],
    [1, 1, 4, 0]
  );
  const scaleY = useTransform(
    scrollYProgress,
    [0.36, 0.39, 0.42, 0.44],
    [1, 1, 0.2, 0]
  );

  // Opacity: fade in → hold → AGGRESSIVELY fade out before overlap
  const opacity = useTransform(
    scrollYProgress,
    [0.05, 0.14, 0.36, 0.40],
    [0, tool.opacity, tool.opacity, 0]
  );

  // Blur: crisp while scattered → heavy blur as they move
  const blur = useTransform(
    scrollYProgress,
    [0.36, 0.39, 0.44],
    [0, 8, 40]
  );
  const filterVal = useTransform(blur, (v) => `blur(${v}px)`);

  return (
    <motion.span
      className="absolute left-1/2 top-1/2 whitespace-nowrap select-none pointer-events-none"
      style={{
        x,
        y,
        rotate,
        scaleX,
        scaleY,
        opacity,
        filter: filterVal,
        fontSize: tool.size,
        fontWeight: tool.weight,
        color: tool.color,
        translateX: "-50%",
        translateY: "-50%",
        lineHeight: 1,
      }}
    >
      {tool.name}
    </motion.span>
  );
}

export default function Convergence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Flash at singularity — right as tools disappear
  const flashOpacity = useTransform(
    scrollYProgress,
    [0.40, 0.43, 0.48],
    [0, 0.8, 0]
  );

  // Shockwave ring
  const shockwaveScale = useTransform(
    scrollYProgress,
    [0.42, 0.56],
    [0, 5]
  );
  const shockwaveOpacity = useTransform(
    scrollYProgress,
    [0.42, 0.45, 0.56],
    [0, 0.6, 0]
  );

  // OLI emergence — starts right after flash
  const oliScale = useTransform(
    scrollYProgress,
    [0.43, 0.62],
    [0, 1]
  );
  const oliOpacity = useTransform(
    scrollYProgress,
    [0.43, 0.52],
    [0, 1]
  );
  const oliBlur = useTransform(
    scrollYProgress,
    [0.43, 0.54],
    [30, 0]
  );
  const oliFilterVal = useTransform(oliBlur, (v) => `blur(${v}px)`);

  // Glow behind OLI
  const glowOpacity = useTransform(
    scrollYProgress,
    [0.43, 0.58],
    [0, 1]
  );
  const glowScale = useTransform(
    scrollYProgress,
    [0.43, 0.62],
    [0.2, 1.2]
  );

  // Subtitle
  const subtitleOpacity = useTransform(
    scrollYProgress,
    [0.58, 0.68],
    [0, 1]
  );
  const subtitleY = useTransform(
    scrollYProgress,
    [0.58, 0.68],
    [30, 0]
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[400vh] flex items-start justify-center"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Scattered tool names — pure typography */}
        <div className="absolute inset-0">
          {tools.map((tool) => (
            <ConvergenceItem
              key={tool.name}
              tool={tool}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* White flash at singularity */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            opacity: flashOpacity,
            background:
              "radial-gradient(circle 250px at 50% 50%, rgba(255,255,255,0.95), transparent 65%)",
          }}
        />

        {/* Shockwave ring */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            border: "2px solid rgba(139,92,246,0.6)",
            scale: shockwaveScale,
            opacity: shockwaveOpacity,
            boxShadow:
              "0 0 40px rgba(139,92,246,0.3), inset 0 0 40px rgba(139,92,246,0.1)",
          }}
        />

        {/* OLI emergence */}
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
              filter: oliFilterVal,
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
