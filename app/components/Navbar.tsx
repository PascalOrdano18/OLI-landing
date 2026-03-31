"use client";

import { useEffect, useState, useRef, useCallback } from "react";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const BTN_TEXT = "Download";
const LOGO_TEXT = "OLI";
const PULL = 0.9;
const MAX_DIST = 250;

function useMagnetic() {
  const ref = useRef<HTMLAnchorElement>(null);
  const current = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const restCenter = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);
  const active = useRef(false);

  // Capture rest center (original position without any transform offset)
  const captureRest = useCallback(() => {
    const el = ref.current;
    if (!el || active.current) return;
    const rect = el.getBoundingClientRect();
    restCenter.current = {
      x: rect.left + rect.width / 2 - current.current.x,
      y: rect.top + rect.height / 2 - current.current.y,
    };
  }, []);

  useEffect(() => {
    captureRest();

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const animate = () => {
      const ease = active.current ? 0.07 : 0.1;
      current.current.x = lerp(current.current.x, target.current.x, ease);
      current.current.y = lerp(current.current.y, target.current.y, ease);
      if (ref.current) {
        ref.current.style.transform = `translate(${current.current.x}px, ${current.current.y}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);

    window.addEventListener("scroll", captureRest, { passive: true });
    window.addEventListener("resize", captureRest);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("scroll", captureRest);
      window.removeEventListener("resize", captureRest);
    };
  }, [captureRest]);

  // Global mousemove while active — element follows cursor anywhere on screen
  useEffect(() => {
    if (!active.current) return;

    const onGlobalMove = (e: MouseEvent) => {
      const dx = e.clientX - restCenter.current.x;
      const dy = e.clientY - restCenter.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Clamp distance so it doesn't fly across the entire page
      if (dist > MAX_DIST) {
        const scale = MAX_DIST / dist;
        target.current = { x: dx * scale * PULL, y: dy * scale * PULL };
      } else {
        target.current = { x: dx * PULL, y: dy * PULL };
      }
    };

    window.addEventListener("mousemove", onGlobalMove);
    return () => window.removeEventListener("mousemove", onGlobalMove);
  });

  const activate = useCallback(() => {
    captureRest();
    active.current = true;
  }, [captureRest]);

  const deactivate = useCallback(() => {
    active.current = false;
    target.current = { x: 0, y: 0 };
  }, []);

  return { ref, activate, deactivate };
}

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const [btnText, setBtnText] = useState(BTN_TEXT);
  const [logoText, setLogoText] = useState(LOGO_TEXT);

  const logo = useMagnetic();
  const btn = useMagnetic();

  useEffect(() => {
    const show = () => setVisible(true);
    window.addEventListener("hero-typing-done", show);
    // Also show if user has already scrolled past hero (e.g. page refresh mid-scroll)
    if (window.scrollY > window.innerHeight * 0.8) setVisible(true);
    return () => window.removeEventListener("hero-typing-done", show);
  }, []);

  // Button text scramble
  useEffect(() => {
    if (!btnHovered) { setBtnText(BTN_TEXT); return; }
    let i = 0;
    const iv = setInterval(() => {
      setBtnText(BTN_TEXT.split("").map((c, j) => {
        if (c === " ") return " ";
        if (j < i) return BTN_TEXT[j];
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }).join(""));
      i += 1 / 3;
      if (i >= BTN_TEXT.length) { clearInterval(iv); setBtnText(BTN_TEXT); }
    }, 30);
    return () => clearInterval(iv);
  }, [btnHovered]);

  // Logo text scramble
  useEffect(() => {
    if (!logoHovered) { setLogoText(LOGO_TEXT); return; }
    let i = 0;
    const iv = setInterval(() => {
      setLogoText(LOGO_TEXT.split("").map((c, j) => {
        if (j < i) return LOGO_TEXT[j];
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }).join(""));
      i += 1 / 3;
      if (i >= LOGO_TEXT.length) { clearInterval(iv); setLogoText(LOGO_TEXT); }
    }, 30);
    return () => clearInterval(iv);
  }, [logoHovered]);

  // Deactivate magnetics when cursor is far enough from either element
  useEffect(() => {
    if (!logoHovered && !btnHovered) return;

    const checkDistance = (e: MouseEvent) => {
      if (logoHovered) {
        const el = logo.ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2);
        if (dist > MAX_DIST + 40) {
          logo.deactivate();
          setLogoHovered(false);
        }
      }
      if (btnHovered) {
        const el = btn.ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2);
        if (dist > MAX_DIST + 40) {
          btn.deactivate();
          setBtnHovered(false);
        }
      }
    };

    window.addEventListener("mousemove", checkDistance);
    return () => window.removeEventListener("mousemove", checkDistance);
  }, [logoHovered, btnHovered, logo, btn]);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 overflow-visible"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        background: "color-mix(in srgb, var(--bg) 85%, transparent)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        borderBottom: "1px solid var(--border)",
        transition:
          "opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1), background 0.6s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between overflow-visible">
        {/* Logo */}
        <a
          ref={logo.ref}
          href="#"
          className="text-base font-bold tracking-[-0.02em] will-change-transform select-none"
          style={{
            color: logoHovered ? "var(--accent)" : "var(--text-primary)",
            transition: "color 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
          }}
          onMouseEnter={() => {
            setLogoHovered(true);
            logo.activate();
          }}
        >
          {logoText}
        </a>

        {/* Download button */}
        <a
          ref={btn.ref}
          href="#download"
          className="font-mono text-xs font-medium px-5 py-2 rounded-full will-change-transform select-none"
          style={{
            background: btnHovered ? "var(--accent)" : "var(--cta-bg)",
            color: btnHovered ? "#ffffff" : "var(--cta-text)",
            boxShadow: btnHovered
              ? "0 0 25px rgba(99,102,241,0.35), 0 0 60px rgba(99,102,241,0.15)"
              : "none",
            transition:
              "background 0.3s cubic-bezier(0.23, 1, 0.32, 1), color 0.3s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
          }}
          onMouseEnter={() => {
            setBtnHovered(true);
            btn.activate();
          }}
        >
          {btnText}
        </a>
      </div>
    </nav>
  );
}
