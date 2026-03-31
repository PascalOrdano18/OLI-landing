"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const agents = [
  { id: 1, task: "fixing auth-middleware.ts", target: 0.82 },
  { id: 2, task: "adding /api/tasks endpoint", target: 0.64 },
  { id: 3, task: "writing integration tests", target: 0.45 },
];

function AgentLine({
  agent,
  index,
  scrollYProgress,
}: {
  agent: (typeof agents)[number];
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const delay = index * 0.02;
  const progress = useTransform(
    scrollYProgress,
    [0.45 + delay, 0.60],
    [0, agent.target]
  );
  const width = useTransform(progress, (v) => `${v * 100}%`);
  const lineOpacity = useTransform(
    scrollYProgress,
    [0.43 + delay, 0.48 + delay],
    [0, 1]
  );

  return (
    <motion.div
      className="flex items-center gap-3 sm:gap-4 py-3 font-mono text-xs sm:text-sm"
      style={{ opacity: lineOpacity }}
    >
      <span
        className="shrink-0 w-2 h-2 rounded-full"
        style={{
          background: "var(--accent-glow)",
          boxShadow: "0 0 8px var(--accent-glow)",
        }}
      />
      <span className="shrink-0" style={{ color: "var(--text-secondary)" }}>
        Agent #{agent.id}
      </span>
      <span
        className="flex-1 truncate hidden sm:block"
        style={{ color: "var(--text-muted)" }}
      >
        {agent.task}
      </span>
      <div
        className="w-20 sm:w-28 h-1.5 rounded-full overflow-hidden shrink-0"
        style={{ background: "var(--border)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            width,
            background:
              "linear-gradient(90deg, var(--accent), var(--accent-glow))",
            boxShadow: "0 0 8px var(--accent-glow)",
          }}
        />
      </div>
    </motion.div>
  );
}

export default function OrchestratorShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Phase 1: "One context" — centralized
  const p1Opacity = useTransform(
    scrollYProgress,
    [0.08, 0.16, 0.28, 0.35],
    [0, 1, 1, 0]
  );
  const p1Y = useTransform(scrollYProgress, [0.08, 0.16], [80, 0]);

  // Phase 2: "Parallel execution" + agent visualization
  const p2Opacity = useTransform(
    scrollYProgress,
    [0.33, 0.42, 0.62, 0.70],
    [0, 1, 1, 0]
  );
  const p2Y = useTransform(scrollYProgress, [0.33, 0.42], [80, 0]);

  // Phase 2 subtitle
  const p2SubOpacity = useTransform(
    scrollYProgress,
    [0.38, 0.46, 0.62, 0.70],
    [0, 1, 1, 0]
  );

  // Phase 3: Closing statement
  const p3Opacity = useTransform(
    scrollYProgress,
    [0.68, 0.76, 0.88, 0.95],
    [0, 1, 1, 0]
  );
  const p3Y = useTransform(scrollYProgress, [0.68, 0.76], [50, 0]);

  // Ambient glow behind agents
  const glowOpacity = useTransform(
    scrollYProgress,
    [0.40, 0.50, 0.62, 0.70],
    [0, 0.8, 0.8, 0]
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[350vh] flex items-start justify-center"
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Ambient glow */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: 600,
            height: 400,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 70%)",
            opacity: glowOpacity,
          }}
        />

        {/* Phase 1: One context */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-6"
          style={{ opacity: p1Opacity }}
        >
          <span className="section-label">THE ADVANTAGE</span>
          <motion.h2
            className="mt-6 text-[clamp(50px,9vw,110px)] font-bold tracking-[-0.05em] leading-[0.9] text-center"
            style={{ y: p1Y }}
          >
            One context.
          </motion.h2>
          <motion.p
            className="mt-6 text-lg sm:text-xl max-w-[620px] text-center leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Chat, issues, and code in the same place means AI sees everything.
            No more lost threads. No more &ldquo;can you paste that link again?&rdquo;
            <br />
            <span style={{ color: "var(--text-primary)" }}>
              Full context. Full picture. Always.
            </span>
          </motion.p>
        </motion.div>

        {/* Phase 2: Parallel execution + agents */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-6"
          style={{ opacity: p2Opacity }}
        >
          <motion.h2
            className="text-[clamp(50px,9vw,110px)] font-bold tracking-[-0.05em] leading-[0.9] text-center"
            style={{ y: p2Y }}
          >
            Parallel agents.
          </motion.h2>
          <motion.p
            className="mt-5 text-lg sm:text-xl max-w-[600px] text-center leading-relaxed"
            style={{ color: "var(--text-secondary)", opacity: p2SubOpacity }}
          >
            The conductor reads your conversations, creates issues from context,
            and dispatches parallel coding agents — each tackling a different task
            across your codebase. Simultaneously.
          </motion.p>

          {/* Agent terminal visualization */}
          <motion.div
            className="mt-10 w-full max-w-[550px] rounded-xl border p-5 sm:p-6"
            style={{
              borderColor: "var(--border)",
              background: "rgba(10, 10, 16, 0.8)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--accent-glow)" }}
              />
              <span
                className="text-xs font-mono"
                style={{ color: "var(--text-muted)" }}
              >
                conductor — active
              </span>
            </div>
            {agents.map((agent, i) => (
              <AgentLine
                key={agent.id}
                agent={agent}
                index={i}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Phase 3: Closing */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-6"
          style={{ opacity: p3Opacity }}
        >
          <motion.h2
            className="text-[clamp(36px,6vw,72px)] font-bold tracking-[-0.04em] leading-[1] text-center"
            style={{ y: p3Y }}
          >
            From conversation to code.
            <br />
            <span style={{ color: "var(--accent)" }}>Automatically.</span>
          </motion.h2>
          <motion.p
            className="mt-6 text-lg max-w-[500px] text-center leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            No tickets filed. No standups. No context switching.
            <br />
            Just talk, and OLI handles the rest.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
