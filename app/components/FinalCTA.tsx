"use client";

import { motion } from "framer-motion";
import DownloadButton from "./DownloadButton";

export default function FinalCTA() {
  return (
    <section
      id="download"
      className="relative min-h-screen flex flex-col items-center justify-center px-6"
    >
      {/* Pulsing glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 700,
          height: 700,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.04) 40%, transparent 70%)",
          animation: "pulse-glow 4s ease-in-out infinite",
          borderRadius: "50%",
        }}
      />

      {/* OLI callback */}
      <motion.span
        className="text-[clamp(80px,20vw,220px)] font-bold tracking-[-0.06em] leading-none select-none"
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
        className="mt-4 text-[clamp(24px,3.5vw,40px)] font-bold tracking-[-0.04em] leading-[1.1] text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.7,
          ease: [0.23, 1, 0.32, 1],
          delay: 0.15,
        }}
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
        <DownloadButton />
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
