"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const chaosApps = [
  { name: "Slack", rotate: -8, x: -30, y: -20, color: "#E01E5A", w: 140 },
  { name: "Linear", rotate: 5, x: 40, y: 15, color: "#5E6AD2", w: 120 },
  { name: "GitHub", rotate: -4, x: -15, y: 35, color: "#238636", w: 130 },
  { name: "Figma", rotate: 7, x: 25, y: -30, color: "#A259FF", w: 110 },
  { name: "Notion", rotate: -2, x: 50, y: 40, color: "#999999", w: 125 },
];

export default function BeforeAfter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const wipeProgress = useTransform(scrollYProgress, [0.3, 0.6], [0, 100]);
  const beforeDim = useTransform(scrollYProgress, [0.5, 0.65], [1, 0.3]);
  const afterBrightness = useTransform(scrollYProgress, [0.5, 0.65], [0.7, 1]);
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
          className="mt-5 text-[clamp(36px,5.5vw,60px)] font-bold tracking-[-0.04em] leading-[0.95] text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
        >
          Context dies in the gaps.
        </motion.h2>

        <motion.p
          className="mt-5 text-lg text-center max-w-lg leading-relaxed"
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
          className="mt-14 w-full max-w-[1060px] relative h-[420px] sm:h-[500px] rounded-2xl overflow-hidden border shadow-2xl shadow-black/40"
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
              className="absolute top-5 left-6 text-xs font-semibold tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              Your team today
            </span>
            <div className="relative w-[360px] h-[260px]">
              {chaosApps.map((app, i) => (
                <div
                  key={app.name}
                  className="absolute rounded-lg border px-5 py-3 text-sm font-medium"
                  style={{
                    width: app.w,
                    transform: `rotate(${app.rotate}deg) translate(${app.x}px, ${app.y}px)`,
                    top: `${15 + i * 38}px`,
                    left: `${5 + i * 25}px`,
                    borderColor: `${app.color}22`,
                    background: `${app.color}08`,
                    color: `${app.color}66`,
                    filter: "grayscale(0.6)",
                  }}
                >
                  {app.name}
                </div>
              ))}
            </div>
          </motion.div>

          {/* After side */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              background: "var(--surface-elevated)",
              clipPath,
              filter: brightnessFilter,
            }}
          >
            <span
              className="absolute top-5 left-6 text-xs font-semibold tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              Your team on OLI
            </span>
            {/* Simulated OLI UI */}
            <div
              className="rounded-xl border w-[360px] h-[240px] overflow-hidden flex"
              style={{
                borderColor: "var(--border-hover)",
                background: "var(--surface)",
              }}
            >
              {/* Mini sidebar */}
              <div className="w-[30%] border-r p-3 flex flex-col gap-2" style={{ borderColor: "var(--border)" }}>
                <div className="h-2 w-3/4 rounded" style={{ background: "rgba(99,102,241,0.3)" }} />
                <div className="h-2 w-1/2 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
                <div className="h-2 w-2/3 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
                <div className="h-2 w-1/2 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
              </div>
              {/* Mini content */}
              <div className="flex-1 p-3 flex flex-col gap-2">
                <div className="h-2.5 w-2/5 rounded" style={{ background: "rgba(255,255,255,0.1)" }} />
                <div className="h-2 w-full rounded" style={{ background: "rgba(255,255,255,0.05)" }} />
                <div className="h-2 w-4/5 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
                <div className="mt-1 flex-1 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }} />
              </div>
            </div>
          </motion.div>

          {/* Wipe line glow */}
          <motion.div
            className="absolute top-0 bottom-0 w-[2px] z-10"
            style={{
              left: wipeLeft,
              background:
                "linear-gradient(180deg, transparent 5%, var(--accent-glow), transparent 95%)",
              boxShadow: "0 0 20px var(--accent-glow), 0 0 60px rgba(139,92,246,0.2)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
