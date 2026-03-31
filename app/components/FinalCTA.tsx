"use client";

import { useState, useCallback, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import DownloadButton from "./DownloadButton";
import ParticleRing from "./ParticleRing";

export default function FinalCTA() {
  const [btnHovered, setBtnHovered] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const oliRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0, active: false });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start center"],
  });
  const oliScale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const oliY = useTransform(scrollYProgress, [0, 1], [60, 0]);

  const handleHoverChange = useCallback((hovering: boolean) => {
    setBtnHovered(hovering);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left - rect.width / 2;
    const my = e.clientY - rect.top - rect.height / 2;
    setMouse({ x: mx, y: my, active: true });

    if (oliRef.current) {
      const nx = mx / (rect.width / 2);
      const ny = my / (rect.height / 2);
      oliRef.current.style.transform = `perspective(800px) rotateY(${nx * 6}deg) rotateX(${-ny * 6}deg) scale(1)`;
    }
    if (glowRef.current) {
      glowRef.current.style.transform = `translate(${mx}px, ${my}px)`;
      glowRef.current.style.opacity = "1";
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouse({ x: 0, y: 0, active: false });
    if (oliRef.current) {
      oliRef.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
    }
    if (glowRef.current) {
      glowRef.current.style.opacity = "0";
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="download"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Particle ring */}
      <ParticleRing
        radius={210}
        visibility={1}
        exploding={btnHovered}
        mouse={mouse}
      />

      {/* Cursor spotlight */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none z-0"
        style={{
          width: 500,
          height: 500,
          top: "50%",
          left: "50%",
          marginLeft: -250,
          marginTop: -250,
          background:
            "radial-gradient(circle, rgba(99,102,241,0.07) 0%, rgba(139,92,246,0.03) 40%, transparent 70%)",
          borderRadius: "50%",
          opacity: 0,
          transition: "opacity 0.4s ease",
          willChange: "transform",
        }}
      />

      {/* OLI — 3D tilt + scroll entrance */}
      <motion.div
        ref={oliRef}
        className="relative z-10"
        style={{
          scale: oliScale,
          y: oliY,
          transformStyle: "preserve-3d",
          transition: "transform 0.35s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        <motion.span
          className="block text-[clamp(80px,20vw,220px)] font-bold tracking-[-0.06em] leading-none select-none"
          style={{
            background:
              "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.5) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          animate={{ opacity: btnHovered ? 0 : 1 }}
          transition={{ duration: 0.35 }}
        >
          OLI
        </motion.span>
        <motion.span
          className="absolute inset-0 block text-[clamp(80px,20vw,220px)] font-bold tracking-[-0.06em] leading-none select-none"
          style={{
            background:
              "linear-gradient(180deg, #050507 0%, rgba(5,5,7,0.6) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          animate={{ opacity: btnHovered ? 1 : 0 }}
          transition={{ duration: 0.35 }}
        >
          OLI
        </motion.span>
      </motion.div>

      <motion.h2
        className="relative z-10 mt-4 text-[clamp(24px,3.5vw,40px)] font-bold tracking-[-0.04em] leading-[1.1] text-center"
        style={{ transition: "color 0.6s cubic-bezier(0.23, 1, 0.32, 1)" }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
      >
        Stop switching. Start shipping.
      </motion.h2>

      <motion.div
        className="relative z-10 mt-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
      >
        <DownloadButton onHoverChange={handleHoverChange} />
      </motion.div>

      <motion.p
        className="relative z-10 mt-6 text-sm"
        style={{
          color: "var(--text-muted)",
          transition: "color 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
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
