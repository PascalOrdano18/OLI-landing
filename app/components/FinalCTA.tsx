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
      className="relative min-h-[90vh] flex flex-col items-center justify-center px-6"
    >
      {/* Background glow */}
      <div
        className="glow-spot -z-10"
        style={{
          width: "900px",
          height: "600px",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, rgba(99,102,241,0.06) 35%, transparent 65%)",
        }}
      />

      <motion.h2
        className="text-[clamp(44px,7vw,80px)] font-bold tracking-[-0.05em] leading-[0.95] text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      >
        Stop switching.
        <br />
        Start shipping.
      </motion.h2>

      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
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
        className="mt-7 text-sm"
        style={{ color: "var(--text-muted)" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        Available for macOS, Windows, and Linux
      </motion.p>
    </section>
  );
}
