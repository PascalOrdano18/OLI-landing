"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const chaosApps = [
  { name: "Slack", rotate: -6, x: -20, y: -15, color: "#E01E5A" },
  { name: "Linear", rotate: 4, x: 30, y: 10, color: "#5E6AD2" },
  { name: "GitHub", rotate: -3, x: -10, y: 25, color: "#238636" },
  { name: "Figma", rotate: 5, x: 20, y: -25, color: "#A259FF" },
];

export default function BeforeAfter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const wipeProgress = useTransform(scrollYProgress, [0.3, 0.6], [0, 100]);
  const beforeDim = useTransform(scrollYProgress, [0.5, 0.65], [1, 0.4]);
  const afterBrightness = useTransform(scrollYProgress, [0.5, 0.65], [0.8, 1]);

  // Pre-compute motion values for style props (no hooks in JSX)
  const clipPath = useTransform(wipeProgress, (v) => `inset(0 ${100 - v}% 0 0)`);
  const brightnessFilter = useTransform(afterBrightness, (v) => `brightness(${v})`);
  const wipeLeft = useTransform(wipeProgress, (v) => `${v}%`);

  return (
    <section ref={sectionRef} className="relative min-h-[180vh]">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-6">
        <motion.span
          className="section-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          WHY IT MATTERS
        </motion.span>

        <motion.h2
          className="mt-4 text-4xl sm:text-5xl md:text-[52px] font-semibold tracking-[-0.03em] leading-[1.1] text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Context dies in the gaps.
        </motion.h2>

        <motion.p
          className="mt-4 text-lg text-center max-w-lg"
          style={{ color: "var(--text-secondary)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Every time you switch apps, your team loses context. OLI keeps
          everything in one place.
        </motion.p>

        {/* Split comparison */}
        <div
          className="mt-12 w-full max-w-[1000px] relative h-[400px] sm:h-[480px] rounded-2xl overflow-hidden border"
          style={{ borderColor: "var(--border)" }}
        >
          {/* Before side */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              background: "var(--surface)",
              opacity: beforeDim,
            }}
          >
            <span
              className="absolute top-4 left-5 text-xs font-medium tracking-wide uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              Your team today
            </span>
            <div className="relative w-[320px] h-[240px]">
              {chaosApps.map((app, i) => (
                <div
                  key={app.name}
                  className="absolute rounded-lg border px-6 py-4 text-sm font-medium"
                  style={{
                    transform: `rotate(${app.rotate}deg) translate(${app.x}px, ${app.y}px)`,
                    top: `${20 + i * 40}px`,
                    left: `${10 + i * 30}px`,
                    borderColor: `${app.color}33`,
                    background: `${app.color}0a`,
                    color: `${app.color}99`,
                    filter: "grayscale(0.5)",
                  }}
                >
                  {app.name}
                </div>
              ))}
            </div>
          </motion.div>

          {/* After side - clips from left */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              background: "var(--surface-elevated)",
              clipPath,
              filter: brightnessFilter,
            }}
          >
            <span
              className="absolute top-4 left-5 text-xs font-medium tracking-wide uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              Your team on OLI
            </span>
            <div
              className="rounded-xl border w-[320px] h-[200px] flex items-center justify-center"
              style={{
                borderColor: "var(--border-hover)",
                background: "var(--surface)",
              }}
            >
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                Product Screenshot — Unified OLI View
              </span>
            </div>
          </motion.div>

          {/* Wipe line glow */}
          <motion.div
            className="absolute top-0 bottom-0 w-[2px] z-10"
            style={{
              left: wipeLeft,
              background:
                "linear-gradient(180deg, transparent, var(--accent-glow), transparent)",
              boxShadow: "0 0 12px var(--accent-glow)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
