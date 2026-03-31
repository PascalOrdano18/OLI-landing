"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40"
      style={{
        background: scrolled ? "rgba(5, 5, 7, 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--border)"
          : "1px solid transparent",
        transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="text-lg font-bold tracking-[-0.02em] transition-opacity duration-200 hover:opacity-70">
          OLI
        </a>
        <a
          href="#download"
          className="magnetic-btn text-sm font-medium px-5 py-2 rounded-full"
          style={{
            background: "var(--cta-bg)",
            color: "var(--cta-text)",
          }}
        >
          Download
        </a>
      </div>
    </nav>
  );
}
