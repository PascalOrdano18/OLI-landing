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
];

export default function Roadmap() {
  return (
    <section className="py-24 sm:py-32 px-6">
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
          className="mt-4 text-4xl sm:text-5xl md:text-[52px] font-semibold tracking-[-0.03em] leading-[1.1]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          And we&apos;re just getting started.
        </motion.h2>

        <motion.p
          className="mt-4 text-lg max-w-lg mx-auto"
          style={{ color: "var(--text-secondary)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Figma, GitHub, Docs, and everything else your team uses — coming to
          OLI.
        </motion.p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {futureTools.map((tool, i) => (
            <motion.span
              key={tool}
              className="px-5 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 cursor-default"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-muted)",
                background: "var(--surface)",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: 0.3 + i * 0.07,
              }}
              whileHover={{
                scale: 1.05,
                color: "var(--text-secondary)",
                borderColor: "var(--border-hover)",
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
