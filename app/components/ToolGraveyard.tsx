"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const tools = [
  { name: "Slack", color: "#E01E5A" },
  { name: "Linear", color: "#5E6AD2" },
  { name: "ClickUp", color: "#7B68EE" },
  { name: "Jira", color: "#0052CC" },
  { name: "Notion", color: "#999999" },
];

const positions = [
  { x: -180, y: -60, rotate: -3 },
  { x: 160, y: -80, rotate: 2 },
  { x: -120, y: 70, rotate: -2 },
  { x: 200, y: 50, rotate: 3 },
  { x: 0, y: -120, rotate: -1 },
];

interface ToolItemProps {
  tool: { name: string; color: string };
  position: { x: number; y: number; rotate: number };
  toolOpacity: MotionValue<number>;
  toolScale: MotionValue<number>;
  toolBlur: MotionValue<number>;
  toolGrayscale: MotionValue<number>;
  convergeProgress: MotionValue<number>;
}

function ToolItem({
  tool,
  position,
  toolOpacity,
  toolScale,
  toolBlur,
  toolGrayscale,
  convergeProgress,
}: ToolItemProps) {
  const filterValue = useTransform(
    [toolBlur, toolGrayscale],
    ([blur, gray]: number[]) => `blur(${blur}px) grayscale(${gray})`
  );
  const x = useTransform(convergeProgress, [0, 1], [position.x, 0]);
  const y = useTransform(convergeProgress, [0, 1], [position.y, 0]);
  const rotate = useTransform(
    convergeProgress,
    [0, 1],
    [position.rotate, 0]
  );

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{
        opacity: toolOpacity,
        scale: toolScale,
        filter: filterValue,
        x,
        y,
        rotate,
      }}
    >
      <span
        className="inline-block px-5 py-2.5 rounded-xl text-sm font-semibold border"
        style={{
          borderColor: `${tool.color}44`,
          color: tool.color,
          background: `${tool.color}11`,
        }}
      >
        {tool.name}
      </span>
    </motion.div>
  );
}

export default function ToolGraveyard() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const toolOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const toolScale = useTransform(scrollYProgress, [0.3, 0.55], [1, 0.6]);
  const toolBlur = useTransform(scrollYProgress, [0.3, 0.55], [0, 8]);
  const toolGrayscale = useTransform(scrollYProgress, [0.3, 0.55], [0, 1]);
  const convergeProgress = useTransform(scrollYProgress, [0.3, 0.55], [0, 1]);
  const oliOpacity = useTransform(scrollYProgress, [0.5, 0.65], [0, 1]);
  const oliScale = useTransform(scrollYProgress, [0.5, 0.65], [0.8, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[200vh] flex items-start justify-center"
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-6">
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
          className="mt-4 text-4xl sm:text-5xl md:text-[52px] font-semibold tracking-[-0.03em] leading-[1.1] text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Stop juggling.
          <br />
          Start building.
        </motion.h2>

        {/* Tool logos cluster */}
        <div className="relative mt-20 w-[500px] h-[300px] max-w-full">
          {tools.map((tool, i) => (
            <ToolItem
              key={tool.name}
              tool={tool}
              position={positions[i]}
              toolOpacity={toolOpacity}
              toolScale={toolScale}
              toolBlur={toolBlur}
              toolGrayscale={toolGrayscale}
              convergeProgress={convergeProgress}
            />
          ))}

          {/* OLI logo emerging */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{ opacity: oliOpacity, scale: oliScale }}
          >
            <div
              className="glow-spot"
              style={{
                width: "300px",
                height: "300px",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)",
                position: "absolute",
              }}
            />
            <span className="text-4xl font-bold tracking-tight relative z-10">
              OLI
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
