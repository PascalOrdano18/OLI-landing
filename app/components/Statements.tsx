"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const statements = [
  {
    label: "CHAT",
    title: "One chat.",
    accent: "Zero noise.",
    description:
      "Real-time communication built into the same surface as your work. No more pasting links between apps.",
  },
  {
    label: "ISSUES",
    title: "One tracker.",
    accent: "Full clarity.",
    description:
      "Issues created from conversations, enriched by AI, tracked without process overhead.",
  },
  {
    label: "AGENTS",
    title: "One agent.",
    accent: "Infinite output.",
    description:
      "An orchestrator that reads every message, creates issues, and dispatches coding agents. Autonomously.",
  },
];

function StatementBlock({
  statement,
  index,
}: {
  statement: (typeof statements)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0.15, 0.35, 0.65, 0.85], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0.15, 0.35], [80, 0]);
  const scale = useTransform(scrollYProgress, [0.15, 0.35, 0.65, 0.85], [0.95, 1, 1, 0.95]);

  return (
    <motion.div
      ref={ref}
      className="h-screen flex items-center justify-center px-6"
      style={{ opacity, scale }}
    >
      <div className="max-w-[900px] text-center">
        <motion.span className="section-label" style={{ opacity }}>
          {statement.label}
        </motion.span>

        <motion.h2
          className="mt-6 text-[clamp(50px,8vw,96px)] font-bold tracking-[-0.05em] leading-[0.9]"
          style={{ y }}
        >
          {statement.title}
          <br />
          <span style={{ color: "var(--accent)" }}>{statement.accent}</span>
        </motion.h2>

        <motion.p
          className="mt-6 text-lg sm:text-xl leading-relaxed mx-auto max-w-[560px]"
          style={{
            color: "var(--text-secondary)",
            y: useTransform(scrollYProgress, [0.18, 0.38], [40, 0]),
          }}
        >
          {statement.description}
        </motion.p>
      </div>
    </motion.div>
  );
}

export default function Statements() {
  return (
    <section>
      {statements.map((statement, i) => (
        <StatementBlock key={statement.label} statement={statement} index={i} />
      ))}
    </section>
  );
}
