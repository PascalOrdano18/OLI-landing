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
      className="group relative rounded-2xl border p-[1px] transition-all duration-500 cursor-default"
      style={{
        borderColor: "var(--border)",
        background: "var(--surface)",
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: index * 0.12 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-glow)";
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3), 0 0 30px rgba(99,102,241,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Cursor-following radial glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(99,102,241,0.1), transparent 50%)",
        }}
      />
      {/* Border glow overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(99,102,241,0.15), transparent 50%)",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />
      <div className="relative z-10 p-1.5">
        <MockupFrame
          label={feature.mockupLabel}
          className="rounded-xl overflow-hidden"
        />
        <div className="px-5 py-6">
          <h3 className="text-xl font-bold tracking-tight">
            {feature.title}
          </h3>
          <p
            className="mt-2 text-[15px] leading-relaxed"
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
    <section className="py-40 sm:py-52 px-6" style={{ background: "var(--surface-alt)" }}>
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
          className="mt-5 text-[clamp(36px,5vw,56px)] font-bold tracking-[-0.04em] leading-[1] text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
        >
          Everything your team needs.
          <br />
          Nothing it doesn&apos;t.
        </motion.h2>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
