"use client";

import { motion } from "framer-motion";
import MockupFrame from "./MockupFrame";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16 overflow-hidden">
      {/* Background glow */}
      <div
        className="glow-spot -z-10"
        style={{
          width: "800px",
          height: "600px",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(99,102,241,0.06) 40%, transparent 70%)",
        }}
      />

      <div className="max-w-[1200px] w-full flex flex-col items-center text-center">
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-semibold leading-[1] tracking-[-0.04em] max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Your team talks.
          <br />
          OLI codes.
        </motion.h1>

        <motion.p
          className="mt-6 text-lg sm:text-xl max-w-[520px]"
          style={{ color: "var(--text-secondary)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          One app that replaces your chat, your tracker, and your backlog —
          then writes the code.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
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

        <motion.div
          className="mt-16 w-full max-w-[1000px]"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
        >
          <MockupFrame label="Product Screenshot — Agent Terminal View" />
        </motion.div>
      </div>
    </section>
  );
}
