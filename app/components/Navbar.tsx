"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        background: "rgba(5, 5, 7, 0.85)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        borderBottom: "1px solid var(--border)",
        transition: "opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
        <a
          href="#"
          className="text-base font-bold tracking-[-0.02em] transition-opacity duration-200 hover:opacity-70"
        >
          OLI
        </a>
        <a
          href="#download"
          className="magnetic-btn text-xs font-medium px-5 py-2 rounded-full"
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
