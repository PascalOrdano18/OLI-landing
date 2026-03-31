# OLI Landing Page — Design Spec

## Overview

A dark, cinematic, premium landing page for the OLI desktop app. Apple-level design craft with purposeful animations, scroll-driven narrative, and micro-interactions on every element. The page leads with OLI's killer differentiator (AI agent orchestration), uses dramatic visual storytelling to position OLI against fragmented tools (Slack, Linear, ClickUp), and drives users to download the app.

**Tone:** Confident, bold, punchy. Short imperative copy. Commands, not explanations.
**Visual DNA:** Near-black backgrounds, blue/violet accents, white text, radial light effects, massive negative space, cinematic film grain.

## Tech Stack

- **Next.js 16** (already scaffolded with Tailwind CSS 4)
- **Framer Motion** — scroll-triggered animations, staggered reveals, spring physics, viewport detection
- **Tailwind CSS** — utility-first styling with custom dark theme tokens
- **Pure CSS** — grain overlays, radial gradients, glassmorphism borders, cursor-following effects
- **Geist font** (already configured) — tight tracking on headlines, relaxed on body

## Design Tokens

```
Background:       #06060a (page base)
Surface:          #0a0a12 (cards, sections with subtle elevation)
Surface elevated: #10101a (hover states, active cards)
Border:           rgba(255, 255, 255, 0.06) (default), rgba(255, 255, 255, 0.12) (hover)
Text primary:     #f5f5f7 (headlines)
Text secondary:   rgba(255, 255, 255, 0.55) (body copy)
Text muted:       rgba(255, 255, 255, 0.35) (labels, captions)
Accent:           #6366f1 (indigo)
Accent glow:      #8b5cf6 (violet, used in radial glows)
CTA:              #ffffff background, #06060a text
```

## Typography

| Element | Size | Weight | Tracking | Line Height |
|---------|------|--------|----------|-------------|
| Hero headline | 72–80px (clamp) | 600 | -0.04em | 1.0 |
| Section headline | 44–52px (clamp) | 600 | -0.03em | 1.1 |
| Section subhead | 18–20px | 400 | 0 | 1.6 |
| Body | 16–18px | 400 | 0 | 1.6 |
| Label | 12px | 500 | 0.08em | 1.0, uppercase |
| CTA button | 16px | 500 | -0.01em | 1.0 |

## Global Effects

### Film grain overlay
A full-page fixed-position div with a CSS noise texture at ~3% opacity. Adds cinematic depth to flat dark surfaces. Uses a base64-encoded tiny noise PNG tiled with `background-repeat`.

### Radial glow spots
Positioned `absolute` divs with large radial gradients (violet→transparent). Placed behind hero headline, behind product mockups, and at section transitions. Blurred with `filter: blur(80-120px)`.

### Scroll-triggered fade-in-up
Default entrance animation for all section content: `opacity: 0 → 1`, `translateY: 40px → 0`, duration 700ms, ease-out. Triggered when element enters viewport (Framer Motion `whileInView`). Children stagger with 100-150ms delays.

## Page Structure — 7 Sections

### Section 1: Hero

**Purpose:** Stop the scroll. Show the magic immediately.

**Layout:**
- Full viewport height (100vh), centered content
- Navigation bar at top: OLI logo (left), "Download" button (right). Minimal, no burger menus, no extra links in v1.
- Centered headline: **"Your team talks. OLI codes."**
- Subtext below (max-width 520px): "One app that replaces your chat, your tracker, and your backlog — then writes the code."
- Primary CTA button: "Download OLI" (white fill, dark text, rounded-full, with subtle outer glow)
- Below CTA: large product mockup (placeholder image container) showing OLI's agent terminal mid-execution. The mockup sits in a perspective-tilted container with a soft shadow and glow emanating from behind it.

**Animations:**
- On page load (staggered sequence, total ~1.2s):
  1. Headline fades up (600ms, ease-out)
  2. Subtext fades up (200ms delay)
  3. CTA button scales in from 0.9→1.0 with opacity (400ms delay)
  4. Product mockup rises from translateY(60px) with opacity (600ms delay)
- Background: large radial gradient (violet/indigo, ~600px radius) centered behind headline, static but gives the impression of emitted light
- CTA button hover: subtle scale(1.02), box-shadow glow expands

**Mockup placeholder:** A rounded-xl container (max-width ~1000px) with a dark background (#0a0a12), 1px border (rgba white 0.08), and inner padding showing a simplified representation of the OLI issues view with a terminal. Aspect ratio ~16:10. Labeled "Product Screenshot" for replacement.

---

### Section 2: Tool Graveyard — "One app to replace them all"

**Purpose:** Dramatic emotional moment. OLI kills your tool sprawl.

**Layout:**
- Full viewport height, centered
- Section label: "THE PROBLEM" (12px, uppercase, muted, wide tracking)
- Headline: **"Stop juggling. Start building."**
- Below: a visual composition with the logos of Slack, Linear, ClickUp (and optionally Jira, Notion) arranged in a loose cluster
- Below the cluster: the OLI logo, larger, with a radial glow

**Animations (scroll-driven):**
- As user scrolls into this section:
  1. Tool logos fade in, slightly scattered with random subtle rotation (-3° to 3°)
  2. On further scroll: logos drift toward center, desaturate (grayscale filter increases), and reduce opacity
  3. Logos blur and shrink as they converge
  4. OLI logo fades in at center with a radial light burst (scale 0.8→1.0 + opacity)
- Total sequence driven by scroll progress through the section (~400px of scroll distance)

**Logo treatment:** We use simple text-based representations of competing tool names (styled as their brand colors but desaturated) rather than actual logo images, to avoid trademark issues. Each "logo" is a styled span with the tool name in a rounded pill.

---

### Section 3: Before / After — "Context dies in the gaps"

**Purpose:** Rational proof. Show the chaos of fragmented tools vs OLI's unified view.

**Layout:**
- Full viewport height
- Section label: "WHY IT MATTERS"
- Headline: **"Context dies in the gaps."**
- Subtext: "Every time you switch apps, your team loses context. OLI keeps everything in one place."
- Below: a split-screen composition
  - LEFT ("Before"): a desaturated, slightly noisy mockup showing 4 overlapping browser windows — Slack, Linear, GitHub, Figma. Cluttered, chaotic. Label: "Your team today"
  - RIGHT ("After"): a clean, sharp, full-color mockup of OLI's unified interface. Label: "Your team on OLI"

**Animations:**
- On scroll-in: the "Before" side fades in first (slightly desaturated, with noise overlay)
- A vertical divider line with a subtle glow slides from left to right (or the "After" panel wipes in), revealing the OLI side
- The wipe/reveal is driven by scroll position — user controls the speed by scrolling
- When fully revealed, the "Before" side dims further and the "After" side gets a subtle brightness boost

**Mockup placeholders:** Both sides are rounded-xl containers with appropriate styling. The "Before" side has overlapping tilted rectangles representing app windows. The "After" side has a single clean container representing OLI.

---

### Section 4: The Flow — "Talk → Issue → Code → PR"

**Purpose:** Show how the orchestrator works. The "how it works" section.

**Layout:**
- Generous vertical spacing (not necessarily full vh — content-driven)
- Section label: "HOW IT WORKS"
- Headline: **"From conversation to pull request. Automatically."**
- Below: 4 steps laid out vertically (stacked on mobile, horizontal connecting line on desktop)
- Each step has:
  - A step number (01, 02, 03, 04) in muted text
  - A short bold title
  - A one-line description
  - A mini mockup placeholder (smaller, ~400px wide)
- Steps connected by a vertical/horizontal animated line with a traveling pulse

**The 4 steps:**
1. **"Talk"** — "Someone mentions a bug in chat." (Mini mockup: OLI chat view with a message bubble)
2. **"Issue"** — "The orchestrator creates a tracked issue." (Mini mockup: OLI issues sidebar with a new issue highlighted)
3. **"Code"** — "An agent picks it up and starts coding." (Mini mockup: OLI terminal view showing agent output)
4. **"Ship"** — "A PR opens. Ready for review." (Mini mockup: OLI diff view with green/red lines)

**Animations:**
- On scroll: the connecting line draws itself progressively (stroke-dashoffset animation)
- Each step fades in when the line reaches it (staggered by scroll position)
- A glowing dot travels along the line like data flowing through a pipeline
- Mini mockups inside each step fade/scale in with a slight delay after the step title

---

### Section 5: Features — Three Pillars

**Purpose:** Showcase the three core capabilities with product visuals.

**Layout:**
- Section label: "BUILT FOR TEAMS THAT SHIP"
- Headline: **"Everything your team needs. Nothing it doesn't."**
- Three large feature cards in a row (stacked on mobile):
  1. **"Strategy"** — Team chat, channels, calls, threads. "Real-time communication without the noise."
  2. **"Issues"** — Statuses, priorities, labels, workflows. "Track work with precision, not process."
  3. **"Agents"** — AI coding agents, terminal, diffs, PRs. "Autonomous agents that turn issues into code."

**Card design:**
- Each card: rounded-2xl, surface background (#0a0a12), 1px border (rgba white 0.06)
- Top: large mockup placeholder area (aspect ratio ~16:10, rounded-xl inside the card)
- Below mockup: card title (20px, bold), one-line description (15px, muted)
- Cards take equal width in a 3-column grid

**Card interactions:**
- Hover: card translates up 4px, border brightens to rgba(255,255,255,0.12), a radial gradient follows the cursor position across the card surface (CSS `background: radial-gradient()` positioned via JS mousemove)
- Entrance: cards stagger in from below (150ms delay between each)

---

### Section 6: Roadmap Tease — "And we're just getting started"

**Purpose:** Build anticipation. Show OLI's vision is bigger.

**Layout:**
- Compact section (not full viewport)
- Section label: "ROADMAP"
- Headline: **"And we're just getting started."**
- Subtext: "Figma, GitHub, Docs, and everything else your team uses — coming to OLI."
- Below: a row of semi-transparent tool icons/names (Figma, GitHub, Google Docs, Notion, etc.) at ~25% opacity, suggesting future integrations
- Optional: a subtle "Join the waitlist" or "Star on GitHub" secondary CTA

**Animations:**
- On scroll-in: headline fades up, then the row of icons fades in with a staggered sweep from left to right
- Icons have a subtle hover effect: opacity increases to 50%, slight scale up

---

### Section 7: Final CTA — "Download OLI"

**Purpose:** Close the deal. One more chance to convert.

**Layout:**
- Full viewport height (or at least generous), centered
- Large headline: **"Stop switching. Start shipping."**
- Primary CTA: "Download OLI" (same style as hero, white fill, glow)
- Below CTA: platform availability text (placeholder: "Available for macOS, Windows, and Linux")
- Minimal footer below: OLI logo, copyright, and a link or two (GitHub, Twitter)

**Animations:**
- Headline and CTA share the same fade-up-stagger as the hero
- Background: another radial glow (violet) centered behind the CTA — bookends the page with the hero's glow
- CTA button: same hover/click interactions as hero

---

## Navigation

**Fixed top bar:**
- Transparent background initially, gains a subtle backdrop-blur + dark background (rgba) on scroll
- Left: OLI logo (text or small mark)
- Right: "Download" CTA button (smaller version, same white style)
- Transition: `background-color` and `backdrop-filter` animate over 300ms on scroll threshold (~100px)
- Height: 64px, with horizontal padding matching content max-width

## Responsive Behavior

- **Max content width:** 1200px, centered with auto margins
- **Breakpoints:**
  - Desktop (>1024px): full layout as described
  - Tablet (768-1024px): feature cards stack 2+1, pipeline steps go vertical, mockups scale down
  - Mobile (<768px): single column throughout, hero headline scales to ~40px, section spacing reduces to 80px, pipeline is fully vertical
- **Mockup containers:** use aspect-ratio CSS and max-width to scale proportionally
- **Animations:** reduce motion for `prefers-reduced-motion` — replace all transforms/fades with instant display

## Component Structure

```
app/
  layout.tsx          — root layout (dark theme, Geist font, metadata)
  globals.css         — design tokens, grain overlay, global dark styles
  page.tsx            — imports and composes all sections

  components/
    Navbar.tsx        — fixed nav with scroll-aware background
    Hero.tsx          — hero section with staggered entrance
    ToolGraveyard.tsx — scroll-driven logo convergence animation
    BeforeAfter.tsx   — split-screen wipe comparison
    FlowPipeline.tsx  — 4-step animated pipeline
    Features.tsx      — three feature cards with cursor-tracking glow
    Roadmap.tsx       — future integrations tease
    FinalCTA.tsx      — closing CTA section
    Footer.tsx        — minimal footer
    GrainOverlay.tsx  — fixed film grain texture layer
    MockupFrame.tsx   — reusable product screenshot placeholder with glow/shadow
```

## Dependencies to Add

- `framer-motion` — animation library (scroll, springs, stagger, viewport detection)

No other dependencies needed. All visual effects achievable with Tailwind + CSS.

## Mockup Placeholder Strategy

All product mockups are placeholder containers with:
- Dark background (#0a0a12)
- 1px border (rgba white 0.08)
- Rounded-xl corners
- Inner text label: "Product Screenshot — [view name]"
- Consistent aspect ratio (16:10)
- Wrapped in `MockupFrame` component that adds the outer glow/shadow treatment

This makes swapping in real screenshots trivial — just replace the inner content with an `<Image>` tag.

## What This Spec Does NOT Cover

- Actual download links / platform detection (deferred)
- Analytics / tracking (deferred)
- Blog, changelog, or docs pages (out of scope)
- SEO beyond basic meta tags (deferred)
- Authentication or user accounts (not needed)
