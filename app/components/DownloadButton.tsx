"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const TARGET_TEXT = "Download OLI";
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&";
const WAVE_COUNT = 5;

export default function DownloadButton({
  className = "",
  onHoverChange,
}: {
  className?: string;
  onHoverChange?: (hovering: boolean) => void;
}) {
  const [displayText, setDisplayText] = useState(TARGET_TEXT);
  const [isHovering, setIsHovering] = useState(false);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const currentPos = useRef({ x: 0, y: 0, rotation: 0, scale: 1 });
  const targetPos = useRef({ x: 0, y: 0, rotation: 0, scale: 1 });
  const wavesRef = useRef<HTMLDivElement[]>([]);

  // Toggle light theme on hover
  useEffect(() => {
    const html = document.documentElement;
    if (isHovering) {
      html.setAttribute("data-theme", "light");
    } else {
      html.removeAttribute("data-theme");
    }
    return () => {
      html.removeAttribute("data-theme");
    };
  }, [isHovering]);

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

  // Smooth lerp animation loop
  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const animate = () => {
      const c = currentPos.current;
      const t = targetPos.current;
      const ease = 0.12;
      c.x = lerp(c.x, t.x, ease);
      c.y = lerp(c.y, t.y, ease);
      c.rotation = lerp(c.rotation, t.rotation, ease);
      c.scale = lerp(c.scale, t.scale, ease);
      const el = btnRef.current;
      if (el) {
        el.style.transform = `translate(${c.x}px, ${c.y}px) rotate(${c.rotation}deg) scale(${c.scale})`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Fire shockwaves on hover
  useEffect(() => {
    if (!isHovering) return;
    const waves = wavesRef.current;
    waves.forEach((el, i) => {
      if (!el) return;
      // Reset
      el.style.transition = "none";
      el.style.transform = "translate(-50%, -50%) scale(0.5)";
      el.style.opacity = "1";
      // Force reflow
      void el.offsetWidth;
      // Animate with stagger
      setTimeout(() => {
        el.style.transition = `transform 1.4s cubic-bezier(0.23, 1, 0.32, 1), opacity 1.4s cubic-bezier(0.23, 1, 0.32, 1)`;
        el.style.transform = "translate(-50%, -50%) scale(12)";
        el.style.opacity = "0";
      }, i * 100);
    });
  }, [isHovering]);

  // Magnetic pull
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = btnRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = e.clientX - centerX;
      const y = e.clientY - centerY;
      const pull = isHovering ? 0.35 : 0.15;
      targetPos.current = {
        x: x * pull,
        y: y * pull,
        rotation: x * 0.05,
        scale: isHovering ? 1.08 : 1,
      };
    },
    [isHovering]
  );

  const handleMouseLeave = useCallback(() => {
    targetPos.current = { x: 0, y: 0, rotation: 0, scale: 1 };
    setIsHovering(false);
    onHoverChange?.(false);
  }, [onHoverChange]);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    onHoverChange?.(true);
  }, [onHoverChange]);

  return (
    <div ref={wrapRef} className="relative">
      {/* Shockwave rings — emanate from button center */}
      {Array.from({ length: WAVE_COUNT }, (_, i) => (
        <div
          key={i}
          ref={(el) => { if (el) wavesRef.current[i] = el; }}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 120,
            height: 120,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) scale(0.5)",
            opacity: 0,
            border: `${1.5 - i * 0.2}px solid rgba(99, 102, 241, ${0.5 - i * 0.08})`,
            boxShadow: i === 0
              ? "0 0 20px rgba(99,102,241,0.15), inset 0 0 20px rgba(99,102,241,0.05)"
              : "none",
          }}
        />
      ))}

      <a
        ref={btnRef}
        href="#download"
        className={`relative z-10 inline-flex items-center justify-center font-mono text-sm font-medium px-8 py-3.5 rounded-full tracking-wide select-none border will-change-transform ${className}`}
        style={{
          background: isHovering ? "var(--cta-bg)" : "transparent",
          borderColor: isHovering
            ? "var(--cta-bg)"
            : "rgba(255, 255, 255, 0.12)",
          color: isHovering ? "var(--cta-text)" : "var(--text-secondary)",
          boxShadow: isHovering
            ? "0 0 40px rgba(99,102,241,0.25), 0 0 80px rgba(99,102,241,0.1)"
            : "none",
          transition:
            "background 0.4s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.4s cubic-bezier(0.23, 1, 0.32, 1), color 0.4s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      >
        {displayText}
      </a>
    </div>
  );
}
