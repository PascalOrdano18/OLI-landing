"use client";

import { motion, useScroll } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-left"
      style={{
        scaleX: scrollYProgress,
        background:
          "linear-gradient(90deg, var(--accent), var(--accent-glow), #ec4899)",
        boxShadow: "0 0 10px var(--accent-glow)",
      }}
    />
  );
}
