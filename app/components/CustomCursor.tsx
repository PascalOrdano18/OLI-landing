"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = -100,
      my = -100,
      rx = -100,
      ry = -100;
    let raf: number;
    let hovering = false;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const loop = () => {
      // Dot follows instantly
      dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;

      // Ring follows with spring lerp
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.transform = `translate(${rx - 20}px, ${ry - 20}px) scale(${hovering ? 1.4 : 1})`;

      raf = requestAnimationFrame(loop);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-hover]")) {
        hovering = true;
        ring.style.borderColor = "rgba(99, 102, 241, 0.5)";
        ring.style.background = "rgba(99, 102, 241, 0.04)";
        dot.style.opacity = "0.4";
        dot.style.transform = `translate(${mx - 4}px, ${my - 4}px) scale(0.5)`;
      }
    };

    const onOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-hover]")) {
        hovering = false;
        ring.style.borderColor = "rgba(255, 255, 255, 0.12)";
        ring.style.background = "transparent";
        dot.style.opacity = "1";
      }
    };

    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const onEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[60] mix-blend-difference"
        style={{
          background: "#ffffff",
          boxShadow: "0 0 10px rgba(99,102,241,0.6)",
          transition: "opacity 0.3s, transform 0.1s",
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[60]"
        style={{
          border: "1px solid rgba(255, 255, 255, 0.12)",
          transition:
            "border-color 0.3s, background 0.3s, opacity 0.3s, width 0.3s, height 0.3s",
        }}
      />
    </>
  );
}
