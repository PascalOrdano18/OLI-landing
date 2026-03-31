"use client";

import { motion } from "framer-motion";

const futureTools = [
  "Figma",
  "GitHub",
  "Google Docs",
  "Notion",
  "Confluence",
  "VS Code",
  "Sentry",
  "Datadog",
];

export default function Roadmap() {
  return (
    <section className="py-32 sm:py-40 px-6" style={{ background: "var(--surface-alt)" }}>
      <div className="max-w-[1200px] mx-auto text-center">
        <motion.span
          className="section-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          ROADMAP
        </motion.span>

        <motion.h2
          className="mt-5 text-[clamp(36px,5vw,56px)] font-bold tracking-[-0.04em] leading-[1]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
        >
          And we&apos;re just getting started.
        </motion.h2>

        <motion.p
          className="mt-5 text-lg max-w-lg mx-auto leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Figma, GitHub, Docs, and everything else your team uses &mdash; coming to
          OLI.
        </motion.p>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          {futureTools.map((tool, i) => (
            <motion.span
              key={tool}
              className="px-6 py-3 rounded-xl text-sm font-medium border cursor-default"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-muted)",
                background: "var(--surface)",
                transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                ease: [0.23, 1, 0.32, 1],
                delay: 0.3 + i * 0.06,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-glow)";
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2), 0 0 15px rgba(99,102,241,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text-muted)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {tool}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
