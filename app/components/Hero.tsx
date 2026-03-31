"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const LINE_1 = "Your team talks.";
const LINE_2 = "OLI codes.";

export default function Hero() {
  const [charCount, setCharCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const btnRef = useRef<HTMLAnchorElement>(null);

  const fullText = `${LINE_1}\n${LINE_2}`;
  const totalChars = fullText.length;

  // Start after mount delay
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // Typing effect
  useEffect(() => {
    if (!started) return;
    if (charCount >= totalChars) {
      const t = setTimeout(() => setShowCTA(true), 800);
      return () => clearTimeout(t);
    }
    const char = fullText[charCount];
    const delay = char === "\n" ? 600 : char === "." ? 350 : 55 + Math.random() * 35;
    const t = setTimeout(() => setCharCount((c) => c + 1), delay);
    return () => clearTimeout(t);
  }, [started, charCount, fullText, totalChars]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;
    btn.style.transform = "translate(0, 0) scale(1)";
  }, []);

  const displayed = fullText.slice(0, charCount);
  const lines = displayed.split("\n");
  const typing = charCount < totalChars && started;

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Ambient glow — builds as text appears */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: charCount > LINE_1.length ? 0.6 : 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(99,102,241,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Typed text */}
        <div className="min-h-[200px] sm:min-h-[260px] flex flex-col items-center justify-center">
          {lines.map((line, i) => (
            <div
              key={i}
              className="text-[clamp(48px,9vw,110px)] font-bold leading-[1] tracking-[-0.05em]"
            >
              {i === 1 ? (
                <>
                  <span style={{ color: "var(--accent)" }}>
                    {line.slice(0, 3)}
                  </span>
                  <span>{line.slice(3)}</span>
                </>
              ) : (
                <span>{line}</span>
              )}
              {/* Cursor on the active line */}
              {typing && i === lines.length - 1 && (
                <span className="typing-cursor" />
              )}
            </div>
          ))}
          {/* Cursor before typing starts */}
          {!started && <span className="typing-cursor text-[clamp(48px,9vw,110px)]" />}
          {/* Cursor after all done */}
          {charCount >= totalChars && !showCTA && (
            <div className="text-[clamp(48px,9vw,110px)]">
              <span className="typing-cursor" />
            </div>
          )}
        </div>

        {/* CTA — fades in after typing */}
        <motion.div
          className="mt-12 flex flex-col items-center gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={showCTA ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          style={{ opacity: 0 }}
        >
          <a
            ref={btnRef}
            href="#download"
            className="magnetic-btn text-base font-medium px-10 py-4 rounded-full"
            style={{
              background: "var(--cta-bg)",
              color: "var(--cta-text)",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            Download OLI
          </a>
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>
            Scroll to see what it replaces
          </span>
        </motion.div>
      </div>
    </section>
  );
}
