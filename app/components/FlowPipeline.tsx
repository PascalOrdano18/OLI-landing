"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import MockupFrame from "./MockupFrame";

const steps = [
  {
    number: "01",
    title: "Talk",
    description: "Someone mentions a bug in chat.",
    mockupLabel: "Product Screenshot — Chat View",
  },
  {
    number: "02",
    title: "Issue",
    description: "The orchestrator creates a tracked issue.",
    mockupLabel: "Product Screenshot — Issues Sidebar",
  },
  {
    number: "03",
    title: "Code",
    description: "An agent picks it up and starts coding.",
    mockupLabel: "Product Screenshot — Agent Terminal",
  },
  {
    number: "04",
    title: "Ship",
    description: "A PR opens. Ready for review.",
    mockupLabel: "Product Screenshot — Diff View",
  },
];

export default function FlowPipeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0.15, 0.75], ["0%", "100%"]);
  const dotTop = useTransform(scrollYProgress, [0.15, 0.75], ["0%", "100%"]);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-40 sm:py-52 px-6"
    >
      <div className="max-w-[1200px] mx-auto">
        <motion.span
          className="section-label block text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          HOW IT WORKS
        </motion.span>

        <motion.h2
          className="mt-5 text-[clamp(36px,5.5vw,60px)] font-bold tracking-[-0.04em] leading-[0.95] text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
        >
          From conversation to
          <br />
          pull request. Automatically.
        </motion.h2>

        <div className="mt-24 relative">
          {/* Vertical line */}
          <div
            className="absolute left-6 sm:left-8 top-0 bottom-0 w-[1px]"
            style={{ background: "var(--border)" }}
          >
            <motion.div
              className="absolute top-0 left-0 w-full"
              style={{
                height: lineHeight,
                background:
                  "linear-gradient(180deg, var(--accent), var(--accent-glow))",
              }}
            />
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
              style={{
                top: dotTop,
                background: "var(--accent-glow)",
                boxShadow: "0 0 16px var(--accent-glow), 0 0 40px rgba(139,92,246,0.2)",
              }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-24 sm:space-y-32">
            {steps.map((step) => (
              <motion.div
                key={step.number}
                className="relative pl-16 sm:pl-20"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              >
                <div
                  className="absolute left-[18px] sm:left-[26px] top-1 w-4 h-4 rounded-full border-2 z-10"
                  style={{
                    borderColor: "var(--accent)",
                    background: "var(--bg)",
                  }}
                />

                <span
                  className="text-sm font-mono"
                  style={{ color: "var(--text-muted)" }}
                >
                  {step.number}
                </span>
                <h3 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] mt-1">
                  {step.title}
                </h3>
                <p
                  className="text-base mt-3 leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {step.description}
                </p>
                <motion.div
                  className="mt-8 max-w-[500px]"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.7,
                    ease: [0.23, 1, 0.32, 1],
                    delay: 0.15,
                  }}
                >
                  <MockupFrame label={step.mockupLabel} />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
