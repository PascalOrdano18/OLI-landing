"use client";

import { motion } from "framer-motion";

export default function FinalCTA() {
  return (
    <section
      id="download"
      className="relative min-h-[80vh] flex flex-col items-center justify-center px-6"
    >
      {/* Background glow */}
      <div
        className="glow-spot -z-10"
        style={{
          width: "700px",
          height: "500px",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(99,102,241,0.05) 40%, transparent 70%)",
        }}
      />

      <motion.h2
        className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.04em] leading-[1] text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Stop switching.
        <br />
        Start shipping.
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      >
        <a
          href="#download"
          className="mt-10 inline-flex items-center gap-2 text-base font-medium px-8 py-3.5 rounded-full transition-all duration-200"
          style={{
            background: "var(--cta-bg)",
            color: "var(--cta-text)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.boxShadow = "0 0 30px rgba(255,255,255,0.2)";
            el.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.boxShadow = "none";
            el.style.transform = "scale(1)";
          }}
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
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        Available for macOS, Windows, and Linux
      </motion.p>
    </section>
  );
}
