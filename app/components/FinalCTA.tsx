"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";

export default function FinalCTA() {
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
    <section
      id="download"
      className="relative min-h-screen flex flex-col items-center justify-center px-6"
    >
      {/* Pulsing glow behind OLI */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.05) 40%, transparent 70%)",
          animation: "pulse-glow 4s ease-in-out infinite",
          borderRadius: "50%",
        }}
      />

      {/* OLI returns — callback to convergence */}
      <motion.span
        className="text-[clamp(80px,18vw,200px)] font-bold tracking-[-0.06em] leading-none select-none"
        style={{
          background:
            "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.5) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
      >
        OLI
      </motion.span>

      <motion.h2
        className="mt-6 text-[clamp(28px,4vw,48px)] font-bold tracking-[-0.04em] leading-[1] text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
      >
        Stop switching. Start shipping.
      </motion.h2>

      <motion.div
        className="mt-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
      >
        <a
          ref={btnRef}
          href="#download"
          className="magnetic-btn text-base font-medium px-10 py-4 rounded-full"
          style={{
            background: "var(--cta-bg)",
            color: "var(--cta-text)",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          Download OLI
        </a>
      </motion.div>

      <motion.p
        className="mt-6 text-sm"
        style={{ color: "var(--text-muted)" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.45 }}
      >
        Available for macOS, Windows, and Linux
      </motion.p>
    </section>
  );
}
