# OLI Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dark, cinematic, Apple-level landing page for OLI that leads with the AI agent orchestration differentiator and drives desktop app downloads.

**Architecture:** Single-page Next.js 16 app with server component layout and client components for interactive/animated sections. Framer Motion handles scroll-triggered animations and staggered reveals. All styling via Tailwind CSS 4 with custom design tokens in globals.css.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, Framer Motion, TypeScript

**Spec:** `docs/superpowers/specs/2026-03-31-landing-page-design.md`

**Next.js 16 notes:** Components are server components by default. Any component using framer-motion, useState, useEffect, or event handlers must have `'use client'` at the top. Keep layout.tsx and page.tsx as server components — import client components into them.

---

## File Structure

```
app/
  layout.tsx              — Root layout (server component). Dark theme, Geist font, OG metadata.
  globals.css             — Design tokens as CSS custom properties, grain overlay, base dark styles.
  page.tsx                — Server component composing all sections in order.
  components/
    GrainOverlay.tsx      — Fixed-position film grain texture (client: uses CSS animation).
    Navbar.tsx            — Fixed nav with scroll-aware backdrop blur (client: uses scroll listener).
    Hero.tsx              — Hero section with staggered entrance animations (client: framer-motion).
    ToolGraveyard.tsx     — Scroll-driven logo convergence animation (client: framer-motion scroll).
    BeforeAfter.tsx       — Split-screen wipe comparison (client: framer-motion scroll).
    FlowPipeline.tsx      — 4-step animated pipeline (client: framer-motion scroll + SVG).
    Features.tsx          — Three feature cards with cursor-tracking glow (client: mousemove + framer-motion).
    Roadmap.tsx           — Future integrations tease (client: framer-motion).
    FinalCTA.tsx          — Closing CTA section (client: framer-motion).
    Footer.tsx            — Minimal footer (server component — no interactivity).
    MockupFrame.tsx       — Reusable product screenshot placeholder (server component).
```

---

## Task 1: Project Setup — Dependencies, Tokens, Global Styles

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Modify: `app/page.tsx` (clear boilerplate)
- Modify: `.gitignore` (add .superpowers/)

- [ ] **Step 1: Install framer-motion**

Run: `cd /Users/pordano/ITBA/hackitba/oli-landing && npm install framer-motion`
Expected: framer-motion added to package.json dependencies

- [ ] **Step 2: Update .gitignore**

Add to the end of `/Users/pordano/ITBA/hackitba/oli-landing/.gitignore`:

```
# Superpowers brainstorm files
.superpowers/
```

- [ ] **Step 3: Replace globals.css with design tokens and base styles**

Replace the entire contents of `app/globals.css` with:

```css
@import "tailwindcss";

:root {
  --bg: #06060a;
  --surface: #0a0a12;
  --surface-elevated: #10101a;
  --border: rgba(255, 255, 255, 0.06);
  --border-hover: rgba(255, 255, 255, 0.12);
  --text-primary: #f5f5f7;
  --text-secondary: rgba(255, 255, 255, 0.55);
  --text-muted: rgba(255, 255, 255, 0.35);
  --accent: #6366f1;
  --accent-glow: #8b5cf6;
  --cta-bg: #ffffff;
  --cta-text: #06060a;
}

@theme inline {
  --color-background: var(--bg);
  --color-foreground: var(--text-primary);
  --color-surface: var(--surface);
  --color-surface-elevated: var(--surface-elevated);
  --color-accent: var(--accent);
  --color-accent-glow: var(--accent-glow);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

body {
  background: var(--bg);
  color: var(--text-primary);
  font-family: var(--font-geist-sans), system-ui, sans-serif;
  overflow-x: hidden;
}

/* Grain overlay texture */
.grain-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  pointer-events: none;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
}

/* Radial glow utility */
.glow-spot {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(100px);
}

/* Section label style */
.section-label {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 4: Update layout.tsx with dark theme and OLI metadata**

Replace the entire contents of `app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OLI — Your team talks. OLI codes.",
  description:
    "One app that replaces your chat, your tracker, and your backlog — then writes the code. Download OLI for macOS, Windows, and Linux.",
  openGraph: {
    title: "OLI — Your team talks. OLI codes.",
    description:
      "One app that replaces your chat, your tracker, and your backlog — then writes the code.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OLI — Your team talks. OLI codes.",
    description:
      "One app that replaces your chat, your tracker, and your backlog — then writes the code.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
```

- [ ] **Step 5: Clear page.tsx boilerplate**

Replace the entire contents of `app/page.tsx` with:

```tsx
export default function Home() {
  return (
    <main>
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          Your team talks. OLI codes.
        </h1>
      </div>
    </main>
  );
}
```

- [ ] **Step 6: Verify the dev server runs**

Run: `cd /Users/pordano/ITBA/hackitba/oli-landing && npm run dev`
Expected: Server starts on localhost:3000 with dark background, white headline centered on screen.

- [ ] **Step 7: Commit**

```bash
git add app/layout.tsx app/globals.css app/page.tsx package.json package-lock.json .gitignore
git commit -m "chore: setup design tokens, dark theme, and framer-motion dependency"
```

---

## Task 2: GrainOverlay and MockupFrame Components

**Files:**
- Create: `app/components/GrainOverlay.tsx`
- Create: `app/components/MockupFrame.tsx`

- [ ] **Step 1: Create GrainOverlay component**

Create `app/components/GrainOverlay.tsx`:

```tsx
export default function GrainOverlay() {
  return <div className="grain-overlay" aria-hidden="true" />;
}
```

- [ ] **Step 2: Create MockupFrame component**

Create `app/components/MockupFrame.tsx`:

```tsx
interface MockupFrameProps {
  label: string;
  aspectRatio?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function MockupFrame({
  label,
  aspectRatio = "16/10",
  className = "",
  children,
}: MockupFrameProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Glow behind frame */}
      <div
        className="glow-spot -z-10"
        style={{
          width: "60%",
          height: "60%",
          top: "20%",
          left: "20%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
        }}
      />
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          aspectRatio,
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        {children ?? (
          <div className="w-full h-full flex items-center justify-center">
            <span
              className="text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              {label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Add GrainOverlay to page.tsx**

Replace `app/page.tsx` with:

```tsx
import GrainOverlay from "./components/GrainOverlay";

export default function Home() {
  return (
    <>
      <GrainOverlay />
      <main>
        <div className="h-screen flex items-center justify-center">
          <h1 className="text-4xl font-semibold tracking-tight">
            Your team talks. OLI codes.
          </h1>
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 4: Verify grain overlay is visible**

Run: `npm run dev` (if not already running)
Check: Page should show the headline with a very subtle film grain texture over the dark background. The grain is barely visible (3% opacity) but adds depth.

- [ ] **Step 5: Commit**

```bash
git add app/components/GrainOverlay.tsx app/components/MockupFrame.tsx app/page.tsx
git commit -m "feat: add grain overlay and mockup frame components"
```

---

## Task 3: Navbar Component

**Files:**
- Create: `app/components/Navbar.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create Navbar component**

Create `app/components/Navbar.tsx`:

```tsx
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
```

- [ ] **Step 2: Add Navbar to page.tsx**

Replace `app/page.tsx` with:

```tsx
import GrainOverlay from "./components/GrainOverlay";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <>
      <GrainOverlay />
      <Navbar />
      <main>
        <div className="h-screen flex items-center justify-center">
          <h1 className="text-4xl font-semibold tracking-tight">
            Your team talks. OLI codes.
          </h1>
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify navbar behavior**

Run: `npm run dev`
Check: Fixed nav at top. "OLI" on left, "Download" button on right. Scroll down — nav gets a blurred dark background with a subtle border.

- [ ] **Step 4: Commit**

```bash
git add app/components/Navbar.tsx app/page.tsx
git commit -m "feat: add scroll-aware navbar with backdrop blur"
```

---

## Task 4: Hero Section

**Files:**
- Create: `app/components/Hero.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create Hero component**

Create `app/components/Hero.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import MockupFrame from "./MockupFrame";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16 overflow-hidden">
      {/* Background glow */}
      <div
        className="glow-spot -z-10"
        style={{
          width: "800px",
          height: "600px",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(99,102,241,0.06) 40%, transparent 70%)",
        }}
      />

      <div className="max-w-[1200px] w-full flex flex-col items-center text-center">
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-semibold leading-[1] tracking-[-0.04em] max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Your team talks.
          <br />
          OLI codes.
        </motion.h1>

        <motion.p
          className="mt-6 text-lg sm:text-xl max-w-[520px]"
          style={{ color: "var(--text-secondary)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          One app that replaces your chat, your tracker, and your backlog —
          then writes the code.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
        >
          <a
            href="#download"
            className="mt-10 inline-flex items-center gap-2 text-base font-medium px-8 py-3.5 rounded-full transition-all duration-200"
            style={{
              background: "var(--cta-bg)",
              color: "var(--cta-text)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.boxShadow = "0 0 30px rgba(255,255,255,0.2)";
              el.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.boxShadow = "none";
              el.style.transform = "scale(1)";
            }}
          >
            Download OLI
          </a>
        </motion.div>

        <motion.div
          className="mt-16 w-full max-w-[1000px]"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
        >
          <MockupFrame label="Product Screenshot — Agent Terminal View" />
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add Hero to page.tsx**

Replace `app/page.tsx` with:

```tsx
import GrainOverlay from "./components/GrainOverlay";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

export default function Home() {
  return (
    <>
      <GrainOverlay />
      <Navbar />
      <main>
        <Hero />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify hero section**

Run: `npm run dev`
Check: Full-viewport hero with staggered animations on load — headline fades up first, then subtext, then CTA button scales in, then the mockup rises from below. Violet glow behind the headline. CTA button has hover glow.

- [ ] **Step 4: Commit**

```bash
git add app/components/Hero.tsx app/page.tsx
git commit -m "feat: add hero section with staggered entrance animations"
```

---

## Task 5: Tool Graveyard Section

**Files:**
- Create: `app/components/ToolGraveyard.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create ToolGraveyard component**

Create `app/components/ToolGraveyard.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const tools = [
  { name: "Slack", color: "#E01E5A" },
  { name: "Linear", color: "#5E6AD2" },
  { name: "ClickUp", color: "#7B68EE" },
  { name: "Jira", color: "#0052CC" },
  { name: "Notion", color: "#999999" },
];

const positions = [
  { x: -180, y: -60, rotate: -3 },
  { x: 160, y: -80, rotate: 2 },
  { x: -120, y: 70, rotate: -2 },
  { x: 200, y: 50, rotate: 3 },
  { x: 0, y: -120, rotate: -1 },
];

export default function ToolGraveyard() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const toolOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const toolScale = useTransform(scrollYProgress, [0.3, 0.55], [1, 0.6]);
  const toolBlur = useTransform(scrollYProgress, [0.3, 0.55], [0, 8]);
  const toolGrayscale = useTransform(scrollYProgress, [0.3, 0.55], [0, 1]);
  const convergeProgress = useTransform(scrollYProgress, [0.3, 0.55], [0, 1]);
  const oliOpacity = useTransform(scrollYProgress, [0.5, 0.65], [0, 1]);
  const oliScale = useTransform(scrollYProgress, [0.5, 0.65], [0.8, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[200vh] flex items-start justify-center"
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-6">
        <motion.span
          className="section-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          THE PROBLEM
        </motion.span>

        <motion.h2
          className="mt-4 text-4xl sm:text-5xl md:text-[52px] font-semibold tracking-[-0.03em] leading-[1.1] text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Stop juggling.
          <br />
          Start building.
        </motion.h2>

        {/* Tool logos cluster */}
        <div className="relative mt-20 w-[500px] h-[300px] max-w-full">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.name}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                opacity: toolOpacity,
                scale: toolScale,
                filter: useTransform(
                  [toolBlur, toolGrayscale],
                  ([blur, gray]) =>
                    `blur(${blur}px) grayscale(${gray})`
                ),
                x: useTransform(
                  convergeProgress,
                  [0, 1],
                  [positions[i].x, 0]
                ),
                y: useTransform(
                  convergeProgress,
                  [0, 1],
                  [positions[i].y, 0]
                ),
                rotate: useTransform(
                  convergeProgress,
                  [0, 1],
                  [positions[i].rotate, 0]
                ),
              }}
            >
              <span
                className="inline-block px-5 py-2.5 rounded-xl text-sm font-semibold border"
                style={{
                  borderColor: `${tool.color}44`,
                  color: tool.color,
                  background: `${tool.color}11`,
                }}
              >
                {tool.name}
              </span>
            </motion.div>
          ))}

          {/* OLI logo emerging */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{ opacity: oliOpacity, scale: oliScale }}
          >
            <div
              className="glow-spot"
              style={{
                width: "300px",
                height: "300px",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)",
                position: "absolute",
              }}
            />
            <span className="text-4xl font-bold tracking-tight relative z-10">
              OLI
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add ToolGraveyard to page.tsx**

Replace `app/page.tsx` with:

```tsx
import GrainOverlay from "./components/GrainOverlay";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ToolGraveyard from "./components/ToolGraveyard";

export default function Home() {
  return (
    <>
      <GrainOverlay />
      <Navbar />
      <main>
        <Hero />
        <ToolGraveyard />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify tool graveyard**

Run: `npm run dev`
Check: Scroll past hero. Tool logos (Slack, Linear, ClickUp, Jira, Notion) appear scattered, then converge toward center as you scroll, blurring and desaturating. OLI logo emerges at center with violet glow. The animation is driven by scroll position.

- [ ] **Step 4: Commit**

```bash
git add app/components/ToolGraveyard.tsx app/page.tsx
git commit -m "feat: add scroll-driven tool graveyard section"
```

---

## Task 6: Before/After Section

**Files:**
- Create: `app/components/BeforeAfter.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create BeforeAfter component**

Create `app/components/BeforeAfter.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const chaosApps = [
  { name: "Slack", rotate: -6, x: -20, y: -15, color: "#E01E5A" },
  { name: "Linear", rotate: 4, x: 30, y: 10, color: "#5E6AD2" },
  { name: "GitHub", rotate: -3, x: -10, y: 25, color: "#238636" },
  { name: "Figma", rotate: 5, x: 20, y: -25, color: "#A259FF" },
];

export default function BeforeAfter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const wipeProgress = useTransform(scrollYProgress, [0.3, 0.6], [0, 100]);
  const beforeDim = useTransform(scrollYProgress, [0.5, 0.65], [1, 0.4]);
  const afterBrightness = useTransform(
    scrollYProgress,
    [0.5, 0.65],
    [0.8, 1]
  );

  return (
    <section ref={sectionRef} className="relative min-h-[180vh]">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-6">
        <motion.span
          className="section-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          WHY IT MATTERS
        </motion.span>

        <motion.h2
          className="mt-4 text-4xl sm:text-5xl md:text-[52px] font-semibold tracking-[-0.03em] leading-[1.1] text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Context dies in the gaps.
        </motion.h2>

        <motion.p
          className="mt-4 text-lg text-center max-w-lg"
          style={{ color: "var(--text-secondary)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Every time you switch apps, your team loses context. OLI keeps
          everything in one place.
        </motion.p>

        {/* Split comparison */}
        <div className="mt-12 w-full max-w-[1000px] relative h-[400px] sm:h-[480px] rounded-2xl overflow-hidden border"
          style={{ borderColor: "var(--border)" }}
        >
          {/* Before side - full width background */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              background: "var(--surface)",
              opacity: beforeDim,
            }}
          >
            <span
              className="absolute top-4 left-5 text-xs font-medium tracking-wide uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              Your team today
            </span>
            <div className="relative w-[320px] h-[240px]">
              {chaosApps.map((app, i) => (
                <div
                  key={app.name}
                  className="absolute rounded-lg border px-6 py-4 text-sm font-medium"
                  style={{
                    transform: `rotate(${app.rotate}deg) translate(${app.x}px, ${app.y}px)`,
                    top: `${20 + i * 40}px`,
                    left: `${10 + i * 30}px`,
                    borderColor: `${app.color}33`,
                    background: `${app.color}0a`,
                    color: `${app.color}99`,
                    filter: "grayscale(0.5)",
                  }}
                >
                  {app.name}
                </div>
              ))}
            </div>
          </motion.div>

          {/* After side - clips from left */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              background: "var(--surface-elevated)",
              clipPath: useTransform(
                wipeProgress,
                (v) => `inset(0 ${100 - v}% 0 0)`
              ),
              filter: useTransform(
                afterBrightness,
                (v) => `brightness(${v})`
              ),
            }}
          >
            <span
              className="absolute top-4 left-5 text-xs font-medium tracking-wide uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              Your team on OLI
            </span>
            <div
              className="rounded-xl border w-[320px] h-[200px] flex items-center justify-center"
              style={{
                borderColor: "var(--border-hover)",
                background: "var(--surface)",
              }}
            >
              <span
                className="text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                Product Screenshot — Unified OLI View
              </span>
            </div>
          </motion.div>

          {/* Wipe line glow */}
          <motion.div
            className="absolute top-0 bottom-0 w-[2px] z-10"
            style={{
              left: useTransform(wipeProgress, (v) => `${v}%`),
              background:
                "linear-gradient(180deg, transparent, var(--accent-glow), transparent)",
              boxShadow: "0 0 12px var(--accent-glow)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add BeforeAfter to page.tsx**

Replace `app/page.tsx` with:

```tsx
import GrainOverlay from "./components/GrainOverlay";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ToolGraveyard from "./components/ToolGraveyard";
import BeforeAfter from "./components/BeforeAfter";

export default function Home() {
  return (
    <>
      <GrainOverlay />
      <Navbar />
      <main>
        <Hero />
        <ToolGraveyard />
        <BeforeAfter />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify before/after section**

Run: `npm run dev`
Check: Scroll into section. The "Before" (chaotic overlapping app windows) is visible. As you scroll, a glowing violet wipe line moves left-to-right, revealing the clean "After" OLI view. The before side dims, the after side brightens.

- [ ] **Step 4: Commit**

```bash
git add app/components/BeforeAfter.tsx app/page.tsx
git commit -m "feat: add scroll-driven before/after comparison section"
```

---

## Task 7: Flow Pipeline Section

**Files:**
- Create: `app/components/FlowPipeline.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create FlowPipeline component**

Create `app/components/FlowPipeline.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import MockupFrame from "./MockupFrame";

const steps = [
  {
    number: "01",
    title: "Talk",
    description: "Someone mentions a bug in chat.",
    mockupLabel: "Product Screenshot — Chat View",
  },
  {
    number: "02",
    title: "Issue",
    description: "The orchestrator creates a tracked issue.",
    mockupLabel: "Product Screenshot — Issues Sidebar",
  },
  {
    number: "03",
    title: "Code",
    description: "An agent picks it up and starts coding.",
    mockupLabel: "Product Screenshot — Agent Terminal",
  },
  {
    number: "04",
    title: "Ship",
    description: "A PR opens. Ready for review.",
    mockupLabel: "Product Screenshot — Diff View",
  },
];

export default function FlowPipeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0.15, 0.75], ["0%", "100%"]);
  const dotTop = useTransform(scrollYProgress, [0.15, 0.75], ["0%", "100%"]);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 sm:py-40 px-6"
    >
      <div className="max-w-[1200px] mx-auto">
        <motion.span
          className="section-label block text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          HOW IT WORKS
        </motion.span>

        <motion.h2
          className="mt-4 text-4xl sm:text-5xl md:text-[52px] font-semibold tracking-[-0.03em] leading-[1.1] text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          From conversation to
          <br />
          pull request. Automatically.
        </motion.h2>

        <div className="mt-20 relative">
          {/* Vertical line */}
          <div
            className="absolute left-6 sm:left-8 top-0 bottom-0 w-[1px]"
            style={{ background: "var(--border)" }}
          >
            <motion.div
              className="absolute top-0 left-0 w-full"
              style={{
                height: lineHeight,
                background:
                  "linear-gradient(180deg, var(--accent), var(--accent-glow))",
              }}
            />
            {/* Traveling dot */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
              style={{
                top: dotTop,
                background: "var(--accent-glow)",
                boxShadow: "0 0 12px var(--accent-glow)",
              }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-20 sm:space-y-28">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                className="relative pl-16 sm:pl-20"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
              >
                {/* Step number dot on line */}
                <div
                  className="absolute left-[18px] sm:left-[26px] top-1 w-4 h-4 rounded-full border-2 z-10"
                  style={{
                    borderColor: "var(--accent)",
                    background: "var(--bg)",
                  }}
                />

                <span
                  className="text-sm font-mono"
                  style={{ color: "var(--text-muted)" }}
                >
                  {step.number}
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">
                  {step.title}
                </h3>
                <p
                  className="text-base mt-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {step.description}
                </p>
                <motion.div
                  className="mt-6 max-w-[480px]"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                    delay: 0.2,
                  }}
                >
                  <MockupFrame label={step.mockupLabel} />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add FlowPipeline to page.tsx**

Replace `app/page.tsx` with:

```tsx
import GrainOverlay from "./components/GrainOverlay";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ToolGraveyard from "./components/ToolGraveyard";
import BeforeAfter from "./components/BeforeAfter";
import FlowPipeline from "./components/FlowPipeline";

export default function Home() {
  return (
    <>
      <GrainOverlay />
      <Navbar />
      <main>
        <Hero />
        <ToolGraveyard />
        <BeforeAfter />
        <FlowPipeline />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify flow pipeline**

Run: `npm run dev`
Check: Scroll into section. Vertical line on the left draws itself progressively. A glowing dot travels along the line. Each of the 4 steps (Talk, Issue, Code, Ship) fades in with a mockup as you scroll past. Step numbers appear on the line.

- [ ] **Step 4: Commit**

```bash
git add app/components/FlowPipeline.tsx app/page.tsx
git commit -m "feat: add animated flow pipeline section"
```

---

## Task 8: Features Section (Three Pillars)

**Files:**
- Create: `app/components/Features.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create Features component**

Create `app/components/Features.tsx`:

```tsx
"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import MockupFrame from "./MockupFrame";

const features = [
  {
    title: "Strategy",
    description: "Real-time communication without the noise.",
    mockupLabel: "Product Screenshot — Team Chat",
  },
  {
    title: "Issues",
    description: "Track work with precision, not process.",
    mockupLabel: "Product Screenshot — Issue Tracker",
  },
  {
    title: "Agents",
    description: "Autonomous agents that turn issues into code.",
    mockupLabel: "Product Screenshot — Agent Terminal",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[number];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className="group relative rounded-2xl border p-1.5 transition-all duration-300"
      style={{
        borderColor: "var(--border)",
        background: "var(--surface)",
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: "easeOut", delay: index * 0.15 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Cursor-following radial glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(99,102,241,0.08), transparent 60%)",
        }}
      />
      <div className="relative z-10">
        <MockupFrame
          label={feature.mockupLabel}
          className="rounded-xl overflow-hidden"
        />
        <div className="px-4 py-5">
          <h3 className="text-xl font-semibold tracking-tight">
            {feature.title}
          </h3>
          <p
            className="mt-1.5 text-[15px]"
            style={{ color: "var(--text-secondary)" }}
          >
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section className="py-32 sm:py-40 px-6">
      <div className="max-w-[1200px] mx-auto">
        <motion.span
          className="section-label block text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          BUILT FOR TEAMS THAT SHIP
        </motion.span>

        <motion.h2
          className="mt-4 text-4xl sm:text-5xl md:text-[52px] font-semibold tracking-[-0.03em] leading-[1.1] text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Everything your team needs.
          <br />
          Nothing it doesn&apos;t.
        </motion.h2>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add Features to page.tsx**

Replace `app/page.tsx` with:

```tsx
import GrainOverlay from "./components/GrainOverlay";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ToolGraveyard from "./components/ToolGraveyard";
import BeforeAfter from "./components/BeforeAfter";
import FlowPipeline from "./components/FlowPipeline";
import Features from "./components/Features";

export default function Home() {
  return (
    <>
      <GrainOverlay />
      <Navbar />
      <main>
        <Hero />
        <ToolGraveyard />
        <BeforeAfter />
        <FlowPipeline />
        <Features />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify features section**

Run: `npm run dev`
Check: Three cards stagger in from below. Hovering a card lifts it 4px, brightens the border, and a radial indigo glow follows the cursor across the card surface.

- [ ] **Step 4: Commit**

```bash
git add app/components/Features.tsx app/page.tsx
git commit -m "feat: add feature cards with cursor-tracking glow"
```

---

## Task 9: Roadmap Section

**Files:**
- Create: `app/components/Roadmap.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create Roadmap component**

Create `app/components/Roadmap.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";

const futureTools = [
  "Figma",
  "GitHub",
  "Google Docs",
  "Notion",
  "Confluence",
  "VS Code",
  "Sentry",
];

export default function Roadmap() {
  return (
    <section className="py-24 sm:py-32 px-6">
      <div className="max-w-[1200px] mx-auto text-center">
        <motion.span
          className="section-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          ROADMAP
        </motion.span>

        <motion.h2
          className="mt-4 text-4xl sm:text-5xl md:text-[52px] font-semibold tracking-[-0.03em] leading-[1.1]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          And we&apos;re just getting started.
        </motion.h2>

        <motion.p
          className="mt-4 text-lg max-w-lg mx-auto"
          style={{ color: "var(--text-secondary)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Figma, GitHub, Docs, and everything else your team uses — coming to
          OLI.
        </motion.p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {futureTools.map((tool, i) => (
            <motion.span
              key={tool}
              className="px-5 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 cursor-default"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-muted)",
                background: "var(--surface)",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: 0.3 + i * 0.07,
              }}
              whileHover={{
                scale: 1.05,
                color: "var(--text-secondary)",
                borderColor: "var(--border-hover)",
              }}
            >
              {tool}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add Roadmap to page.tsx**

Replace `app/page.tsx` with:

```tsx
import GrainOverlay from "./components/GrainOverlay";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ToolGraveyard from "./components/ToolGraveyard";
import BeforeAfter from "./components/BeforeAfter";
import FlowPipeline from "./components/FlowPipeline";
import Features from "./components/Features";
import Roadmap from "./components/Roadmap";

export default function Home() {
  return (
    <>
      <GrainOverlay />
      <Navbar />
      <main>
        <Hero />
        <ToolGraveyard />
        <BeforeAfter />
        <FlowPipeline />
        <Features />
        <Roadmap />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify roadmap section**

Run: `npm run dev`
Check: Tool pills sweep in from below with a staggered delay. Hovering a pill slightly scales it up and brightens the text/border.

- [ ] **Step 4: Commit**

```bash
git add app/components/Roadmap.tsx app/page.tsx
git commit -m "feat: add roadmap tease section"
```

---

## Task 10: Final CTA and Footer

**Files:**
- Create: `app/components/FinalCTA.tsx`
- Create: `app/components/Footer.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create FinalCTA component**

Create `app/components/FinalCTA.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";

export default function FinalCTA() {
  return (
    <section
      id="download"
      className="relative min-h-[80vh] flex flex-col items-center justify-center px-6"
    >
      {/* Background glow */}
      <div
        className="glow-spot -z-10"
        style={{
          width: "700px",
          height: "500px",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(99,102,241,0.05) 40%, transparent 70%)",
        }}
      />

      <motion.h2
        className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.04em] leading-[1] text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Stop switching.
        <br />
        Start shipping.
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      >
        <a
          href="#download"
          className="mt-10 inline-flex items-center gap-2 text-base font-medium px-8 py-3.5 rounded-full transition-all duration-200"
          style={{
            background: "var(--cta-bg)",
            color: "var(--cta-text)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.boxShadow = "0 0 30px rgba(255,255,255,0.2)";
            el.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.boxShadow = "none";
            el.style.transform = "scale(1)";
          }}
        >
          Download OLI
        </a>
      </motion.div>

      <motion.p
        className="mt-6 text-sm"
        style={{ color: "var(--text-muted)" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        Available for macOS, Windows, and Linux
      </motion.p>
    </section>
  );
}
```

- [ ] **Step 2: Create Footer component**

Create `app/components/Footer.tsx`:

```tsx
export default function Footer() {
  return (
    <footer
      className="py-8 px-6 border-t"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm font-semibold tracking-tight">OLI</span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          &copy; {new Date().getFullYear()} OLI. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Compose final page.tsx with all sections**

Replace `app/page.tsx` with:

```tsx
import GrainOverlay from "./components/GrainOverlay";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ToolGraveyard from "./components/ToolGraveyard";
import BeforeAfter from "./components/BeforeAfter";
import FlowPipeline from "./components/FlowPipeline";
import Features from "./components/Features";
import Roadmap from "./components/Roadmap";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <GrainOverlay />
      <Navbar />
      <main>
        <Hero />
        <ToolGraveyard />
        <BeforeAfter />
        <FlowPipeline />
        <Features />
        <Roadmap />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Verify complete page**

Run: `npm run dev`
Check: Scroll through the entire page end-to-end. All 7 sections render. Final CTA has violet glow, download button, and platform text. Footer shows OLI logo and copyright. Navbar stays fixed and transitions on scroll.

- [ ] **Step 5: Commit**

```bash
git add app/components/FinalCTA.tsx app/components/Footer.tsx app/page.tsx
git commit -m "feat: add final CTA and footer, complete page composition"
```

---

## Task 11: Build Verification and Cleanup

**Files:**
- Modify: `app/page.tsx` (if any build errors)

- [ ] **Step 1: Run production build**

Run: `cd /Users/pordano/ITBA/hackitba/oli-landing && npm run build`
Expected: Build succeeds with no errors. Some pages may be marked as "Static" or "Dynamic" — both are fine.

- [ ] **Step 2: Run linter**

Run: `cd /Users/pordano/ITBA/hackitba/oli-landing && npm run lint`
Expected: No errors. Warnings are acceptable.

- [ ] **Step 3: Remove default boilerplate assets**

Run:
```bash
cd /Users/pordano/ITBA/hackitba/oli-landing
rm -f public/next.svg public/vercel.svg public/file.svg public/globe.svg public/window.svg
```

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: remove boilerplate assets, verify production build"
```
