"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import MockupFrame from "./MockupFrame";

const panels = [
  {
    number: "01",
    title: "Talk",
    subtitle: "Someone drops a bug in chat.",
    detail: "No ticket filed. No context lost. The conversation IS the source of truth.",
  },
  {
    number: "02",
    title: "Issue",
    subtitle: "The orchestrator creates a tracked issue.",
    detail: "AI reads the thread, extracts the bug, assigns priority. Zero human overhead.",
  },
  {
    number: "03",
    title: "Code",
    subtitle: "An agent picks it up and starts coding.",
    detail: "Parallel agents spin up, read the codebase, write the fix. You keep talking.",
  },
  {
    number: "04",
    title: "Ship",
    subtitle: "A PR opens. Ready for review.",
    detail: "From conversation to pull request. Minutes, not days.",
  },
];

export default function HorizontalFlow() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  // Progress line fills as you scroll
  const lineWidth = useTransform(scrollYProgress, [0.05, 0.95], ["0%", "100%"]);

  return (
    <section ref={sectionRef} className="relative h-[400vh]" id="how-it-works">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Section label */}
        <div className="absolute top-8 left-8 z-10">
          <span className="section-label">HOW IT WORKS</span>
        </div>

        {/* Progress line at bottom */}
        <div
          className="absolute bottom-12 left-8 right-8 h-[1px] z-10"
          style={{ background: "var(--border)" }}
        >
          <motion.div
            className="h-full"
            style={{
              width: lineWidth,
              background: "linear-gradient(90deg, var(--accent), var(--accent-glow))",
            }}
          />
          {/* Traveling dot */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
            style={{
              left: lineWidth,
              background: "var(--accent-glow)",
              boxShadow: "0 0 12px var(--accent-glow), 0 0 30px rgba(139,92,246,0.3)",
            }}
          />
        </div>

        {/* Horizontal panels */}
        <motion.div
          className="flex h-full"
          style={{ x, width: "400vw" }}
        >
          {panels.map((panel, i) => (
            <div
              key={panel.number}
              className="w-screen h-full flex items-center px-8 sm:px-20"
            >
              <div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Text side */}
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <span
                    className="text-sm font-mono"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {panel.number}
                  </span>
                  <h3 className="mt-2 text-[clamp(60px,8vw,100px)] font-bold tracking-[-0.05em] leading-[0.9]">
                    {panel.title}
                  </h3>
                  <p
                    className="mt-4 text-xl sm:text-2xl font-medium leading-snug"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {panel.subtitle}
                  </p>
                  <p
                    className="mt-3 text-base leading-relaxed max-w-[400px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {panel.detail}
                  </p>
                </div>

                {/* Mockup side */}
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <MockupFrame label={`${panel.title} View`} />
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
