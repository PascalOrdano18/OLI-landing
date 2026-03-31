"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import MockupFrame from "./MockupFrame";

export default function Hero() {
  const btnRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;
    btn.style.transform = "translate(0, 0) scale(1)";
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-24 overflow-hidden">
      {/* Background glow — larger, more dramatic */}
      <div
        className="glow-spot -z-10"
        style={{
          width: "1000px",
          height: "800px",
          top: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(ellipse, rgba(139,92,246,0.15) 0%, rgba(99,102,241,0.07) 35%, transparent 65%)",
        }}
      />
      {/* Second subtle glow for depth */}
      <div
        className="glow-spot -z-10"
        style={{
          width: "600px",
          height: "400px",
          bottom: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-[1200px] w-full flex flex-col items-center text-center">
        <motion.h1
          className="text-[clamp(48px,8vw,96px)] font-bold leading-[0.95] tracking-[-0.05em]"
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          Your team talks.
          <br />
          <span style={{ color: "var(--accent)" }}>OLI</span> codes.
        </motion.h1>

        <motion.p
          className="mt-7 text-lg sm:text-xl max-w-[540px] leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
        >
          One app that replaces your chat, your tracker, and your backlog
          &mdash; then writes the code.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
        >
          <a
            ref={btnRef}
            href="#download"
            className="magnetic-btn text-base font-medium px-9 py-4 rounded-full"
            style={{
              background: "var(--cta-bg)",
              color: "var(--cta-text)",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            Download OLI
          </a>
          <a
            href="#how-it-works"
            className="group inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            See how it works
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>

        <motion.div
          className="mt-20 w-full max-w-[1060px]"
          initial={{ opacity: 0, y: 80, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 1,
            ease: [0.23, 1, 0.32, 1],
            delay: 0.5,
          }}
        >
          <MockupFrame label="Product Screenshot — Agent Terminal View" />
        </motion.div>
      </div>
    </section>
  );
}
