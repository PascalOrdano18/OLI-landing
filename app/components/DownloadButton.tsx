"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const TARGET_TEXT = "Download OLI";
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*<>";

export default function DownloadButton({ className = "" }: { className?: string }) {
  const [displayText, setDisplayText] = useState(TARGET_TEXT);
  const [isHovering, setIsHovering] = useState(false);
  const [isNear, setIsNear] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);

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

  // Aggressive magnetic pull — works from the zone (large area)
  const handleZoneMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = wrapperRef.current;
      const zone = zoneRef.current;
      if (!el || !zone) return;
      const zoneRect = zone.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();

      // Distance from cursor to button center
      const btnCenterX = elRect.left + elRect.width / 2;
      const btnCenterY = elRect.top + elRect.height / 2;
      const dx = e.clientX - btnCenterX;
      const dy = e.clientY - btnCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Stronger pull the closer you get (inverse falloff)
      const maxDist = zoneRect.width / 2;
      const strength = Math.max(0, 1 - dist / maxDist);
      const pull = strength * 0.45; // up to 45% pull

      el.style.transform = `translate(${dx * pull}px, ${dy * pull}px) scale(${1 + strength * 0.04})`;
    },
    []
  );

  const handleZoneMouseLeave = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    el.style.transform = "translate(0, 0) scale(1)";
    setIsHovering(false);
    setIsNear(false);
  }, []);

  const handleZoneMouseEnter = useCallback(() => {
    setIsNear(true);
  }, []);

  return (
    // Large invisible magnetic zone — 120px padding around button
    <div
      ref={zoneRef}
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ padding: "80px 120px", margin: "-80px -120px" }}
      onMouseMove={handleZoneMouseMove}
      onMouseLeave={handleZoneMouseLeave}
      onMouseEnter={handleZoneMouseEnter}
    >
      <div
        ref={wrapperRef}
        className="relative inline-flex items-center justify-center group"
        style={{ transition: "transform 0.25s cubic-bezier(0.23, 1, 0.32, 1)" }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Rotating gradient border — visible on hover */}
        <div
          className="absolute inset-[-3px] rounded-full transition-opacity duration-700"
          style={{
            opacity: isHovering ? 1 : isNear ? 0.3 : 0,
            background:
              "conic-gradient(from var(--angle, 0deg), #6366f1, #a855f7, #ec4899, #f59e0b, #22d3ee, #6366f1)",
            filter: isHovering ? "blur(8px)" : "blur(14px)",
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
              : isNear
                ? "0 0 20px rgba(99,102,241,0.15)"
                : "0 0 0 rgba(0,0,0,0)",
            transition: "box-shadow 0.5s ease",
          }}
        >
          {displayText}
        </a>
      </div>
    </div>
  );
}
