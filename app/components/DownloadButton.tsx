"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const TARGET_TEXT = "Download OLI";
const SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*<>";

export default function DownloadButton({
  className = "",
}: {
  className?: string;
}) {
  const [displayText, setDisplayText] = useState(TARGET_TEXT);
  const [isHovering, setIsHovering] = useState(false);
  const [isNear, setIsNear] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  // Text scramble on hover
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
            return SCRAMBLE_CHARS[
              Math.floor(Math.random() * SCRAMBLE_CHARS.length)
            ];
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

  // Mouse position relative to button (for wipe effect)
  const handleBtnMouseMove = useCallback((e: React.MouseEvent) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  // Magnetic zone pull
  const handleZoneMouseMove = useCallback((e: React.MouseEvent) => {
    const el = wrapperRef.current;
    const zone = zoneRef.current;
    if (!el || !zone) return;
    const elRect = el.getBoundingClientRect();
    const btnCenterX = elRect.left + elRect.width / 2;
    const btnCenterY = elRect.top + elRect.height / 2;
    const dx = e.clientX - btnCenterX;
    const dy = e.clientY - btnCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = zone.getBoundingClientRect().width / 2;
    const strength = Math.max(0, 1 - dist / maxDist);
    const pull = strength * 0.45;
    el.style.transform = `translate(${dx * pull}px, ${dy * pull}px) scale(${1 + strength * 0.04})`;
  }, []);

  const handleZoneMouseLeave = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    el.style.transform = "translate(0, 0) scale(1)";
    setIsHovering(false);
    setIsNear(false);
  }, []);

  return (
    <div
      ref={zoneRef}
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ padding: "80px 120px", margin: "-80px -120px" }}
      onMouseMove={handleZoneMouseMove}
      onMouseLeave={handleZoneMouseLeave}
      onMouseEnter={() => setIsNear(true)}
    >
      <div
        ref={wrapperRef}
        className="relative inline-flex items-center justify-center"
        style={{
          transition: "transform 0.25s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        {/* Rotating gradient border */}
        <div
          className="absolute inset-[-3px] rounded-full transition-opacity duration-700"
          style={{
            opacity: isHovering ? 1 : isNear ? 0.3 : 0,
            background:
              "conic-gradient(from var(--angle, 0deg), #6366f1, #a855f7, #ec4899, #f59e0b, #22d3ee, #6366f1)",
            filter: isHovering ? "blur(10px)" : "blur(16px)",
            animation: "rotate-gradient 3s linear infinite",
          }}
        />

        {/* Orbiting particles */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 pointer-events-none"
            style={{
              width: 0,
              height: 0,
              opacity: isHovering ? 1 : 0,
              transition: "opacity 0.5s ease",
              transitionDelay: `${i * 0.05}s`,
              animation: `spin-slow ${2 + i * 0.5}s linear infinite`,
              animationDelay: `${-i * 0.5}s`,
              animationDirection: i % 2 === 0 ? "normal" : "reverse",
            }}
          >
            <div
              className="absolute rounded-full"
              style={{
                width: 2 + (i % 3),
                height: 2 + (i % 3),
                top: i % 2 === 0 ? -(32 + i * 4) : 32 + i * 4,
                left: -1.5,
                background: [
                  "#6366f1",
                  "#a855f7",
                  "#ec4899",
                  "#f59e0b",
                  "#22d3ee",
                  "#818cf8",
                  "#c084fc",
                ][i],
                boxShadow: `0 0 10px ${["#6366f1", "#a855f7", "#ec4899", "#f59e0b", "#22d3ee", "#818cf8", "#c084fc"][i]}`,
              }}
            />
          </div>
        ))}

        {/* Button with cursor-position wipe */}
        <div
          ref={btnRef}
          className="relative overflow-hidden rounded-full"
          onMouseMove={handleBtnMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Default layer: white bg, dark text */}
          <a
            href="#download"
            className="relative z-[1] block font-mono text-base font-semibold px-10 py-4 rounded-full tracking-wide select-none"
            style={{
              background: "var(--cta-bg)",
              color: "var(--cta-text)",
              animation: isNear ? "none" : "btn-breathe 3s ease-in-out infinite",
            }}
          >
            {displayText}
          </a>

          {/* Hover wipe layer: accent gradient, white text, expands from cursor */}
          <div
            className="absolute inset-0 z-[2] flex items-center justify-center font-mono text-base font-semibold tracking-wide pointer-events-none select-none rounded-full"
            style={{
              background:
                "linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)",
              color: "#ffffff",
              clipPath: `circle(${isHovering ? 300 : 0}px at ${mousePos.x}px ${mousePos.y}px)`,
              transition:
                "clip-path 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
            }}
          >
            {displayText}
          </div>
        </div>

        {/* Glow beneath button */}
        <div
          className="absolute inset-x-[-20px] bottom-[-10px] h-[20px] rounded-full pointer-events-none transition-opacity duration-500"
          style={{
            opacity: isHovering ? 0.8 : isNear ? 0.3 : 0,
            background:
              "radial-gradient(ellipse, rgba(99,102,241,0.5) 0%, transparent 70%)",
            filter: "blur(10px)",
          }}
        />
      </div>
    </div>
  );
}
