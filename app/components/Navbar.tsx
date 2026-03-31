"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(6, 6, 10, 0.8)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--border)"
          : "1px solid transparent",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-lg font-semibold tracking-tight">OLI</span>
        <a
          href="#download"
          className="text-sm font-medium px-5 py-2 rounded-full transition-all duration-200"
          style={{
            background: "var(--cta-bg)",
            color: "var(--cta-text)",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.boxShadow =
              "0 0 20px rgba(255,255,255,0.15)";
            (e.target as HTMLElement).style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.boxShadow = "none";
            (e.target as HTMLElement).style.transform = "scale(1)";
          }}
        >
          Download
        </a>
      </div>
    </nav>
  );
}
