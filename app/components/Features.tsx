"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import MockupFrame from "./MockupFrame";

const features = [
  {
    title: "Strategy",
    description: "Real-time communication without the noise.",
    mockupLabel: "Product Screenshot — Team Chat",
  },
  {
    title: "Issues",
    description: "Track work with precision, not process.",
    mockupLabel: "Product Screenshot — Issue Tracker",
  },
  {
    title: "Agents",
    description: "Autonomous agents that turn issues into code.",
    mockupLabel: "Product Screenshot — Agent Terminal",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[number];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className="group relative rounded-2xl border p-1.5 transition-all duration-300"
      style={{
        borderColor: "var(--border)",
        background: "var(--surface)",
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: "easeOut", delay: index * 0.15 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Cursor-following radial glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(99,102,241,0.08), transparent 60%)",
        }}
      />
      <div className="relative z-10">
        <MockupFrame
          label={feature.mockupLabel}
          className="rounded-xl overflow-hidden"
        />
        <div className="px-4 py-5">
          <h3 className="text-xl font-semibold tracking-tight">
            {feature.title}
          </h3>
          <p
            className="mt-1.5 text-[15px]"
            style={{ color: "var(--text-secondary)" }}
          >
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section className="py-32 sm:py-40 px-6">
      <div className="max-w-[1200px] mx-auto">
        <motion.span
          className="section-label block text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          BUILT FOR TEAMS THAT SHIP
        </motion.span>

        <motion.h2
          className="mt-4 text-4xl sm:text-5xl md:text-[52px] font-semibold tracking-[-0.03em] leading-[1.1] text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Everything your team needs.
          <br />
          Nothing it doesn&apos;t.
        </motion.h2>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
