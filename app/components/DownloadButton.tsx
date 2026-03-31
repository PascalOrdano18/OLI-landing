"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const TARGET_TEXT = "Download OLI";
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*<>";

export default function DownloadButton({ className = "" }: { className?: string }) {
  const [displayText, setDisplayText] = useState(TARGET_TEXT);
  const [isHovering, setIsHovering] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Text scramble effect on hover
  useEffect(() => {
    if (!isHovering) {
      setDisplayText(TARGET_TEXT);
      return;
    }

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        TARGET_TEXT.split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < iteration) return TARGET_TEXT[i];
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join("")
      );
      iteration += 1 / 3;
      if (iteration >= TARGET_TEXT.length) {
        clearInterval(interval);
        setDisplayText(TARGET_TEXT);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isHovering]);

  // Strong magnetic pull
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
    setIsHovering(false);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`relative inline-flex items-center justify-center group ${className}`}
      style={{ transition: "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovering(true)}
    >
      {/* Rotating gradient border — visible on hover */}
      <div
        className="absolute inset-[-3px] rounded-full transition-opacity duration-700"
        style={{
          opacity: isHovering ? 1 : 0,
          background:
            "conic-gradient(from var(--angle, 0deg), #6366f1, #a855f7, #ec4899, #f59e0b, #22d3ee, #6366f1)",
          filter: "blur(8px)",
          animation: "rotate-gradient 3s linear infinite",
        }}
      />

      {/* Static subtle border glow — always visible */}
      <div
        className="absolute inset-[-1px] rounded-full"
        style={{
          background:
            "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.1))",
          opacity: isHovering ? 0 : 0.6,
          transition: "opacity 0.5s ease",
        }}
      />

      {/* Orbiting particles */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 pointer-events-none"
          style={{
            width: 0,
            height: 0,
            opacity: isHovering ? 1 : 0,
            transition: "opacity 0.6s ease",
            transitionDelay: `${i * 0.08}s`,
            animation: `spin-slow ${2.5 + i * 0.6}s linear infinite`,
            animationDelay: `${-i * 0.7}s`,
            animationDirection: i % 2 === 0 ? "normal" : "reverse",
          }}
        >
          <div
            className="absolute rounded-full"
            style={{
              width: 3,
              height: 3,
              top: i % 2 === 0 ? -(28 + i * 3) : 28 + i * 3,
              left: -1.5,
              background: ["#6366f1", "#a855f7", "#ec4899", "#f59e0b", "#22d3ee"][i],
              boxShadow: `0 0 8px ${["#6366f1", "#a855f7", "#ec4899", "#f59e0b", "#22d3ee"][i]}`,
            }}
          />
        </div>
      ))}

      {/* The button itself */}
      <a
        href="#download"
        className="relative z-10 font-mono text-base font-semibold px-10 py-4 rounded-full tracking-wide select-none"
        style={{
          background: "var(--cta-bg)",
          color: "var(--cta-text)",
          boxShadow: isHovering
            ? "0 0 40px rgba(99,102,241,0.4), 0 0 80px rgba(139,92,246,0.15)"
            : "0 0 0 rgba(0,0,0,0)",
          transition: "box-shadow 0.5s ease",
        }}
      >
        {displayText}
      </a>
    </div>
  );
}
