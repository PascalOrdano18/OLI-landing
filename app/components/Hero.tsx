"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DownloadButton from "./DownloadButton";

const LINE_1 = "Your team talks.";
const LINE_2 = "OLI codes.";

export default function Hero() {
  const [charCount, setCharCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [showCTA, setShowCTA] = useState(false);

  const fullText = `${LINE_1}\n${LINE_2}`;
  const totalChars = fullText.length;

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!started) return;
    if (charCount >= totalChars) {
      const t = setTimeout(() => setShowCTA(true), 800);
      return () => clearTimeout(t);
    }
    const char = fullText[charCount];
    const delay =
      char === "\n" ? 600 : char === "." ? 350 : 55 + Math.random() * 35;
    const t = setTimeout(() => setCharCount((c) => c + 1), delay);
    return () => clearTimeout(t);
  }, [started, charCount, fullText, totalChars]);

  const displayed = fullText.slice(0, charCount);
  const lines = displayed.split("\n");
  const typing = charCount < totalChars && started;

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Ambient glow */}
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
        <div className="min-h-[180px] sm:min-h-[240px] flex flex-col items-center justify-center">
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
              {typing && i === lines.length - 1 && (
                <span className="typing-cursor" />
              )}
            </div>
          ))}
          {!started && (
            <span className="typing-cursor text-[clamp(48px,9vw,110px)]" />
          )}
          {charCount >= totalChars && !showCTA && (
            <div className="text-[clamp(48px,9vw,110px)]">
              <span className="typing-cursor" />
            </div>
          )}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-12 flex flex-col items-center gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={showCTA ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          style={{ opacity: 0 }}
        >
          <DownloadButton />
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>
            Scroll to see what it replaces ↓
          </span>
        </motion.div>
      </div>
    </section>
  );
}
