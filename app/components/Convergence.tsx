"use client";

import { useRef, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  MotionValue,
} from "framer-motion";
import CircleParticles from "./CircleParticles";

const TARGET = "OLI";
const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&";

/* ── Tool text data ── */
interface Tool {
  name: string;
  x: number;
  y: number;
  size: number;
  weight: number;
  opacity: number;
  rotate: number;
  color: string;
  stagger: number;
}

const rawTools = [
  { name: "Slack", x: -480, y: -280, size: 140, weight: 800, opacity: 0.85, rotate: -15, color: "#E01E5A" },
  { name: "Linear", x: 400, y: -200, size: 100, weight: 600, opacity: 0.65, rotate: 8, color: "#5E6AD2" },
  { name: "ClickUp", x: -280, y: 260, size: 80, weight: 700, opacity: 0.45, rotate: -5, color: "#7B68EE" },
  { name: "Jira", x: 500, y: 180, size: 160, weight: 900, opacity: 0.75, rotate: 12, color: "#0052CC" },
  { name: "Notion", x: -60, y: -350, size: 120, weight: 500, opacity: 0.5, rotate: -3, color: "#999999" },
  { name: "Asana", x: 200, y: 320, size: 90, weight: 600, opacity: 0.35, rotate: 7, color: "#F06A6A" },
  { name: "Monday", x: -520, y: 40, size: 130, weight: 700, opacity: 0.55, rotate: -10, color: "#6C6CFF" },
  { name: "Discord", x: 420, y: -340, size: 110, weight: 800, opacity: 0.65, rotate: 14, color: "#5865F2" },
  { name: "Teams", x: -360, y: -100, size: 70, weight: 400, opacity: 0.3, rotate: 2, color: "#6264A7" },
  { name: "Trello", x: 120, y: 380, size: 95, weight: 600, opacity: 0.4, rotate: -8, color: "#0079BF" },
  { name: "Basecamp", x: -180, y: 180, size: 75, weight: 500, opacity: 0.25, rotate: 5, color: "#1D2D35" },
  { name: "Confluence", x: 540, y: -50, size: 105, weight: 700, opacity: 0.5, rotate: -12, color: "#1868DB" },
  { name: "Figma", x: 60, y: -180, size: 150, weight: 800, opacity: 0.7, rotate: 6, color: "#A259FF" },
  { name: "GitHub", x: -440, y: 330, size: 125, weight: 700, opacity: 0.55, rotate: -7, color: "#238636" },
];

const tools: Tool[] = rawTools.map((t) => {
  const dist = Math.sqrt(t.x * t.x + t.y * t.y);
  return { ...t, stagger: (dist / 700) * 0.04 };
});

/* ── Logo data ── */
interface Logo {
  name: string;
  file: string;
  x: number;
  y: number;
  size: number;
  rotate: number;
  opacity: number;
  stagger: number;
}

const logoFiles: Record<string, string> = {
  Slack: "/logos/slack.svg",
  Linear: "/logos/linear.svg",
  ClickUp: "/logos/clickup.svg",
  Jira: "/logos/jira.svg",
  Notion: "/logos/notion.svg",
  Asana: "/logos/asana.svg",
  Monday: "/logos/monday.svg",
  Discord: "/logos/discord.svg",
  Teams: "/logos/teams.svg",
  Trello: "/logos/trello.svg",
  Basecamp: "/logos/basecamp.svg",
  Confluence: "/logos/confluence.svg",
  Figma: "/logos/figma.svg",
  GitHub: "/logos/github.svg",
};

const rawLogos: Omit<Logo, "stagger">[] = [
  // Spread across full viewport including center — varied positions, sizes, rotations
  { name: "Slack", file: logoFiles["Slack"], x: -420, y: -220, size: 130, rotate: -12, opacity: 0.8 },
  { name: "Linear", file: logoFiles["Linear"], x: 320, y: -150, size: 95, rotate: 6, opacity: 0.6 },
  { name: "ClickUp", file: logoFiles["ClickUp"], x: -180, y: 200, size: 75, rotate: -4, opacity: 0.45 },
  { name: "Jira", file: logoFiles["Jira"], x: 480, y: 140, size: 145, rotate: 10, opacity: 0.7 },
  { name: "Notion", file: logoFiles["Notion"], x: -30, y: -300, size: 110, rotate: -2, opacity: 0.5 },
  { name: "Asana", file: logoFiles["Asana"], x: 150, y: 280, size: 85, rotate: 7, opacity: 0.4 },
  { name: "Monday", file: logoFiles["Monday"], x: -500, y: 30, size: 120, rotate: -9, opacity: 0.55 },
  { name: "Discord", file: logoFiles["Discord"], x: 380, y: -310, size: 100, rotate: 13, opacity: 0.6 },
  { name: "Teams", file: logoFiles["Teams"], x: -280, y: -80, size: 65, rotate: 3, opacity: 0.35 },
  { name: "Trello", file: logoFiles["Trello"], x: 80, y: 350, size: 90, rotate: -7, opacity: 0.4 },
  { name: "Basecamp", file: logoFiles["Basecamp"], x: -120, y: 100, size: 60, rotate: 5, opacity: 0.3 },
  { name: "Confluence", file: logoFiles["Confluence"], x: 520, y: -40, size: 100, rotate: -11, opacity: 0.5 },
  { name: "Figma", file: logoFiles["Figma"], x: 20, y: -120, size: 140, rotate: 4, opacity: 0.65 },
  { name: "GitHub", file: logoFiles["GitHub"], x: -380, y: 300, size: 115, rotate: -6, opacity: 0.55 },
  // Extra fills — closer to center and in gaps
  { name: "Slack", file: logoFiles["Slack"], x: 600, y: -350, size: 75, rotate: 17, opacity: 0.35 },
  { name: "Jira", file: logoFiles["Jira"], x: -650, y: -280, size: 80, rotate: -14, opacity: 0.3 },
  { name: "Figma", file: logoFiles["Figma"], x: -50, y: 420, size: 70, rotate: 9, opacity: 0.3 },
  { name: "Discord", file: logoFiles["Discord"], x: -200, y: -400, size: 65, rotate: 11, opacity: 0.3 },
  { name: "GitHub", file: logoFiles["GitHub"], x: 650, y: 320, size: 80, rotate: -5, opacity: 0.3 },
  { name: "Linear", file: logoFiles["Linear"], x: 200, y: -50, size: 55, rotate: -8, opacity: 0.35 },
  { name: "Monday", file: logoFiles["Monday"], x: 500, y: -430, size: 65, rotate: -10, opacity: 0.25 },
  { name: "Notion", file: logoFiles["Notion"], x: -550, y: 380, size: 70, rotate: 8, opacity: 0.25 },
];

const logos: Logo[] = rawLogos.map((l) => {
  const dist = Math.sqrt(l.x * l.x + l.y * l.y);
  return { ...l, stagger: (dist / 800) * 0.04 };
});

/* ── Screenshot mockup data ── */
type MockupType = "chat" | "kanban" | "issues" | "docs" | "code" | "design";

interface Screenshot {
  type: MockupType;
  color: string;
  x: number;
  y: number;
  width: number;
  rotate: number;
  opacity: number;
  stagger: number;
}

const rawScreenshots: Omit<Screenshot, "stagger">[] = [
  // Spread across full area including center — mix of close and far
  { type: "chat", color: "#E01E5A", x: -550, y: -160, width: 150, rotate: -10, opacity: 0.5 },
  { type: "chat", color: "#5865F2", x: 500, y: -240, width: 130, rotate: 8, opacity: 0.4 },
  { type: "chat", color: "#6264A7", x: -100, y: 150, width: 110, rotate: 3, opacity: 0.35 },
  { type: "chat", color: "#E01E5A", x: 250, y: 60, width: 95, rotate: -5, opacity: 0.3 },
  { type: "chat", color: "#5865F2", x: -700, y: -330, width: 100, rotate: -18, opacity: 0.2 },
  { type: "kanban", color: "#0079BF", x: 560, y: 100, width: 155, rotate: 7, opacity: 0.45 },
  { type: "kanban", color: "#6C6CFF", x: -450, y: 220, width: 120, rotate: -6, opacity: 0.35 },
  { type: "kanban", color: "#0079BF", x: -60, y: -200, width: 100, rotate: 11, opacity: 0.3 },
  { type: "kanban", color: "#6C6CFF", x: 700, y: -150, width: 90, rotate: -13, opacity: 0.2 },
  { type: "issues", color: "#0052CC", x: 300, y: 340, width: 140, rotate: -5, opacity: 0.4 },
  { type: "issues", color: "#5E6AD2", x: -250, y: -350, width: 125, rotate: 12, opacity: 0.45 },
  { type: "issues", color: "#7B68EE", x: 120, y: -380, width: 105, rotate: -9, opacity: 0.3 },
  { type: "issues", color: "#F06A6A", x: -170, y: 380, width: 105, rotate: -2, opacity: 0.25 },
  { type: "issues", color: "#0052CC", x: 680, y: 400, width: 95, rotate: 20, opacity: 0.15 },
  { type: "docs", color: "#999999", x: -580, y: -340, width: 135, rotate: -3, opacity: 0.35 },
  { type: "docs", color: "#1868DB", x: 440, y: -370, width: 115, rotate: 10, opacity: 0.3 },
  { type: "docs", color: "#999999", x: 160, y: -80, width: 90, rotate: -6, opacity: 0.25 },
  { type: "docs", color: "#1868DB", x: -700, y: 150, width: 85, rotate: 5, opacity: 0.2 },
  { type: "code", color: "#238636", x: -400, y: 370, width: 145, rotate: 3, opacity: 0.4 },
  { type: "code", color: "#238636", x: 620, y: -40, width: 115, rotate: -14, opacity: 0.3 },
  { type: "code", color: "#238636", x: -30, y: 50, width: 95, rotate: 7, opacity: 0.25 },
  { type: "design", color: "#A259FF", x: 400, y: 380, width: 130, rotate: -8, opacity: 0.35 },
  { type: "design", color: "#A259FF", x: -620, y: 50, width: 110, rotate: 6, opacity: 0.25 },
  { type: "design", color: "#A259FF", x: 50, y: 260, width: 85, rotate: -4, opacity: 0.2 },
];

const screenshots: Screenshot[] = rawScreenshots.map((s) => {
  const dist = Math.sqrt(s.x * s.x + s.y * s.y);
  return { ...s, stagger: (dist / 800) * 0.04 };
});

/* ── Mockup content renderers ── */
function ChatMockup({ color }: { color: string }) {
  return (
    <div className="flex flex-col gap-1.5 p-2">
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full" style={{ background: color, opacity: 0.7 }} />
        <div className="h-1.5 rounded-full bg-white/20 w-10" />
        <div className="h-1.5 rounded-full bg-white/10 w-6 ml-auto" />
      </div>
      <div className="h-2 rounded bg-white/8 w-full" />
      <div className="h-2 rounded bg-white/6 w-3/4" />
      <div className="h-1 my-0.5" />
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-white/15" />
        <div className="h-1.5 rounded-full bg-white/15 w-8" />
        <div className="h-1.5 rounded-full bg-white/10 w-5 ml-auto" />
      </div>
      <div className="h-2 rounded bg-white/8 w-full" />
      <div className="h-2 rounded bg-white/5 w-5/6" />
      <div className="h-2 rounded bg-white/6 w-2/3" />
      <div className="h-1 my-0.5" />
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full" style={{ background: color, opacity: 0.5 }} />
        <div className="h-1.5 rounded-full bg-white/20 w-12" />
      </div>
      <div className="h-2 rounded bg-white/7 w-full" />
      <div className="h-2 rounded bg-white/5 w-1/2" />
    </div>
  );
}

function KanbanMockup({ color }: { color: string }) {
  return (
    <div className="flex gap-1.5 p-2 h-full">
      {[0.8, 0.5, 0.3].map((op, col) => (
        <div key={col} className="flex-1 flex flex-col gap-1">
          <div className="h-1.5 rounded-full w-8 mb-1" style={{ background: color, opacity: op }} />
          {Array.from({ length: 3 - col }, (_, i) => (
            <div key={i} className="rounded bg-white/8 p-1.5">
              <div className="h-1.5 rounded bg-white/15 w-full mb-1" />
              <div className="h-1 rounded bg-white/8 w-2/3" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function IssuesMockup({ color }: { color: string }) {
  return (
    <div className="flex flex-col gap-1 p-2">
      {[1, 0.7, 0.5, 0.4, 0.3, 0.25].map((op, i) => (
        <div key={i} className="flex items-center gap-1.5 py-0.5" style={{ opacity: op }}>
          <div className="w-2 h-2 rounded-sm" style={{ background: color }} />
          <div className="h-1.5 rounded-full bg-white/20 flex-1" />
          <div className="h-1.5 rounded-full bg-white/10 w-4" />
        </div>
      ))}
    </div>
  );
}

function DocsMockup() {
  return (
    <div className="flex flex-col gap-1.5 p-2.5">
      <div className="h-2.5 rounded bg-white/20 w-3/4" />
      <div className="h-1 my-0.5" />
      <div className="h-1.5 rounded bg-white/10 w-full" />
      <div className="h-1.5 rounded bg-white/8 w-full" />
      <div className="h-1.5 rounded bg-white/10 w-5/6" />
      <div className="h-1.5 rounded bg-white/6 w-full" />
      <div className="h-1 my-0.5" />
      <div className="h-2 rounded bg-white/15 w-1/2" />
      <div className="h-1.5 rounded bg-white/8 w-full" />
      <div className="h-1.5 rounded bg-white/6 w-4/5" />
      <div className="h-1.5 rounded bg-white/8 w-full" />
    </div>
  );
}

function CodeMockup({ color }: { color: string }) {
  return (
    <div className="flex flex-col gap-0.5 p-2 font-mono text-[4px]">
      {[
        { indent: 0, w: "70%", op: 0.3 },
        { indent: 1, w: "85%", op: 0.2 },
        { indent: 2, w: "60%", op: 0.25 },
        { indent: 2, w: "90%", op: 0.2 },
        { indent: 2, w: "45%", op: 0.15 },
        { indent: 1, w: "30%", op: 0.2 },
        { indent: 0, w: "0%", op: 0 },
        { indent: 0, w: "50%", op: 0.3 },
        { indent: 1, w: "75%", op: 0.2 },
        { indent: 2, w: "65%", op: 0.25 },
        { indent: 1, w: "20%", op: 0.2 },
      ].map((line, i) => (
        <div key={i} className="flex items-center gap-1">
          <span className="text-white/15 w-2 text-right shrink-0">{i + 1}</span>
          <div
            className="h-1.5 rounded-sm"
            style={{
              width: line.w,
              marginLeft: line.indent * 6,
              background: i === 2 || i === 9 ? color : `rgba(255,255,255,${line.op})`,
              opacity: i === 2 || i === 9 ? 0.5 : 1,
            }}
          />
        </div>
      ))}
    </div>
  );
}

function DesignMockup({ color }: { color: string }) {
  return (
    <div className="relative p-2 h-full">
      {/* Canvas grid dots */}
      <div className="absolute inset-2 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "8px 8px",
        }}
      />
      <div className="w-8 h-6 rounded-sm border absolute top-4 left-3" style={{ borderColor: color, opacity: 0.5 }} />
      <div className="w-5 h-5 rounded-full border absolute top-3 right-4" style={{ borderColor: color, opacity: 0.4 }} />
      <div className="w-10 h-3 rounded-sm absolute bottom-4 left-1/2 -translate-x-1/2" style={{ background: color, opacity: 0.2 }} />
      <div className="w-6 h-8 rounded-sm border absolute bottom-3 right-3" style={{ borderColor: `${color}80` }} />
    </div>
  );
}

const mockupRenderers: Record<MockupType, (props: { color: string }) => React.ReactNode> = {
  chat: ChatMockup,
  kanban: KanbanMockup,
  issues: IssuesMockup,
  docs: DocsMockup,
  code: CodeMockup,
  design: DesignMockup,
};

/* ── Screenshot component with scroll animation ── */
function ScreenshotItem({
  screenshot,
  scrollYProgress,
}: {
  screenshot: Screenshot;
  scrollYProgress: MotionValue<number>;
}) {
  const s = screenshot;
  const Renderer = mockupRenderers[s.type];

  const x = useTransform(
    scrollYProgress,
    [0.03, 0.24, 0.38, 0.50],
    [s.x, s.x, s.x * 0.2, 0]
  );
  const y = useTransform(
    scrollYProgress,
    [0.03, 0.24, 0.38, 0.50],
    [s.y, s.y, s.y * 0.2, 0]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0.03, 0.12, 0.40, 0.48, 0.52],
    [0, s.opacity, Math.min(s.opacity + 0.15, 0.7), 0.5, 0]
  );
  const rotate = useTransform(
    scrollYProgress,
    [0.24, 0.42],
    [s.rotate, 0]
  );
  const scale = useTransform(
    scrollYProgress,
    [0.03, 0.12, 0.44, 0.52],
    [0.8, 1, 1, 0.3]
  );
  const blur = useTransform(scrollYProgress, [0.42, 0.50], [0, 8]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  const aspect = s.type === "kanban" || s.type === "design" ? 1.3 : 1.5;

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 pointer-events-none select-none"
      style={{
        x,
        y,
        rotate,
        scale,
        opacity,
        filter,
        translateX: "-50%",
        translateY: "-50%",
        width: s.width,
        height: s.width / aspect,
      }}
    >
      <div
        className="w-full h-full rounded-lg overflow-hidden"
        style={{
          background: "rgba(15, 15, 22, 0.9)",
          border: `1px solid ${s.color}20`,
          boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 1px ${s.color}30`,
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center gap-1 px-2 py-1"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white/15" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          <div className="h-1 rounded-full bg-white/10 w-8 ml-2" />
        </div>
        {/* Content */}
        <Renderer color={s.color} />
      </div>
    </motion.div>
  );
}

/* ── Logo component — same animation as the old text items ── */
function LogoItem({
  logo,
  scrollYProgress,
}: {
  logo: Logo;
  scrollYProgress: MotionValue<number>;
}) {
  const l = logo;

  const x = useTransform(
    scrollYProgress,
    [0.05, 0.26, 0.40, 0.52],
    [l.x, l.x, l.x * 0.25, 0]
  );
  const y = useTransform(
    scrollYProgress,
    [0.05, 0.26, 0.40, 0.52],
    [l.y, l.y, l.y * 0.25, 0]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0.05, 0.14, 0.44, 0.50, 0.56],
    [0, l.opacity, Math.min(l.opacity + 0.3, 1), 0.9, 0]
  );
  const rotate = useTransform(
    scrollYProgress,
    [0.26, 0.42],
    [l.rotate, 0]
  );
  const scale = useTransform(
    scrollYProgress,
    [0.26, 0.44, 0.52],
    [1, 1, 0.3]
  );
  const blur = useTransform(scrollYProgress, [0.44, 0.52], [0, 6]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 pointer-events-none select-none"
      style={{
        x,
        y,
        rotate,
        scale,
        opacity,
        filter,
        translateX: "-50%",
        translateY: "-50%",
        width: l.size,
        height: l.size,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={l.file}
        alt=""
        width={l.size}
        height={l.size}
        className="w-full h-full object-contain"
        draggable={false}
      />
    </motion.div>
  );
}

/* ── Text scramble helpers ── */
function scrambleText(from: string, to: string, progress: number): string {
  if (progress <= 0) return from;
  if (progress >= 1) return to;

  const len = Math.round(
    from.length - (from.length - to.length) * Math.min(progress * 1.5, 1)
  );
  const lockRatio = Math.max(0, (progress - 0.35) / 0.65);
  const locked = Math.floor(lockRatio * to.length);
  const eatThreshold = progress * 1.8;

  let out = "";
  for (let i = 0; i < len; i++) {
    if (i < locked && i < to.length) {
      out += to[i];
    } else if (i < from.length && i / from.length > eatThreshold) {
      out += from[i];
    } else {
      out += POOL[Math.floor(Math.random() * POOL.length)];
    }
  }
  return out;
}

function ScrambleItem({
  tool,
  scrollYProgress,
}: {
  tool: Tool;
  scrollYProgress: MotionValue<number>;
}) {
  const textRef = useRef<HTMLSpanElement>(null);

  const scrambleStart = 0.26 + tool.stagger;
  const scrambleEnd = 0.42 + tool.stagger;

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const el = textRef.current;
    if (!el) return;
    if (v < scrambleStart) {
      el.textContent = tool.name;
    } else if (v >= scrambleEnd) {
      el.textContent = TARGET;
    } else {
      const p = (v - scrambleStart) / (scrambleEnd - scrambleStart);
      el.textContent = scrambleText(tool.name, TARGET, p);
    }
  });

  const x = useTransform(
    scrollYProgress,
    [0.05, 0.26, 0.40, 0.52],
    [tool.x, tool.x, tool.x * 0.25, 0]
  );
  const y = useTransform(
    scrollYProgress,
    [0.05, 0.26, 0.40, 0.52],
    [tool.y, tool.y, tool.y * 0.25, 0]
  );

  const normalizedScale = 100 / tool.size;
  const scale = useTransform(
    scrollYProgress,
    [0.26, 0.44, 0.52],
    [1, 1, normalizedScale]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0.05, 0.14, 0.44, 0.50, 0.56],
    [0, tool.opacity, Math.min(tool.opacity + 0.3, 1), 0.9, 0]
  );

  const color = useTransform(
    scrollYProgress,
    [scrambleStart, scrambleEnd],
    [tool.color, "#a78bfa"]
  );

  const rotate = useTransform(
    scrollYProgress,
    [0.26, 0.42],
    [tool.rotate, 0]
  );

  const blur = useTransform(scrollYProgress, [0.44, 0.52], [0, 6]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  return (
    <motion.span
      className="absolute left-1/2 top-1/2 whitespace-nowrap select-none pointer-events-none"
      style={{
        x,
        y,
        rotate,
        scale,
        opacity,
        color,
        filter,
        fontSize: tool.size,
        fontWeight: tool.weight,
        translateX: "-50%",
        translateY: "-50%",
        lineHeight: 1,
      }}
    >
      <span ref={textRef}>{tool.name}</span>
    </motion.span>
  );
}

/* ── Main component ── */
export default function Convergence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const [mouse, setMouse] = useState({ x: 0, y: 0, active: false });
  const [particleVis, setParticleVis] = useState(0);
  const [circleR, setCircleR] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // Particles fade in with the circle, fade out before text fly-through
    if (v < 0.54) setParticleVis(0);
    else if (v < 0.62) setParticleVis((v - 0.54) / 0.08);
    else if (v < 0.68) setParticleVis(1);
    else if (v < 0.74) setParticleVis(1 - (v - 0.68) / 0.06);
    else setParticleVis(0);

    // Match circle logo size
    if (v > 0.54) {
      const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
      setCircleR(Math.min(Math.max(120, vw * 0.22), 280) / 2);
    } else {
      setCircleR(0);
    }
  });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = stickyRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
      active: true,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouse({ x: 0, y: 0, active: false });
  }, []);

  const oliOpacity = useTransform(scrollYProgress, [0.50, 0.58], [0, 1]);
  const oliScale = useTransform(scrollYProgress, [0.50, 0.66], [0.6, 1]);
  const oliBlur = useTransform(scrollYProgress, [0.50, 0.60], [16, 0]);
  const oliFilter = useTransform(oliBlur, (v) => `blur(${v}px)`);

  const glowOpacity = useTransform(scrollYProgress, [0.48, 0.60], [0, 1]);
  const glowScale = useTransform(scrollYProgress, [0.48, 0.62], [0.3, 1.3]);

  const subtitleOpacity = useTransform(scrollYProgress, [0.64, 0.74], [0, 1]);
  const subtitleY = useTransform(scrollYProgress, [0.64, 0.74], [30, 0]);

  // OLI text fly-through: starts tiny in circle center, blows up past the screen
  const oliTextScale = useTransform(scrollYProgress, [0.70, 0.82], [0.05, 18]);
  const oliTextOpacity = useTransform(
    scrollYProgress,
    [0.70, 0.73, 0.78, 0.82],
    [0, 1, 0.9, 0]
  );
  const oliTextBlur = useTransform(scrollYProgress, [0.70, 0.74, 0.79, 0.82], [8, 0, 0, 4]);
  const oliTextFilter = useTransform(oliTextBlur, (v) => `blur(${v}px)`);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[400vh] flex items-start justify-center"
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Screenshots — behind text, converge with it */}
        <div className="absolute inset-0 z-0">
          {screenshots.map((s, i) => (
            <ScreenshotItem
              key={i}
              screenshot={s}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* Logos — large, replacing text names */}
        <div className="absolute inset-0 z-10">
          {logos.map((l, i) => (
            <LogoItem
              key={i}
              logo={l}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* Particles orbiting the circle */}
        <div className="absolute inset-0 z-25 pointer-events-none">
          <CircleParticles circleRadius={circleR} visibility={particleVis} mouse={mouse} />
        </div>

        {/* The massive OLI */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none"
          style={{ opacity: oliOpacity }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              opacity: glowOpacity,
              scale: glowScale,
              background:
                "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(139,92,246,0.35) 0%, rgba(99,102,241,0.12) 35%, transparent 65%)",
            }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              opacity: glowOpacity,
              scale: glowScale,
              background:
                "radial-gradient(circle 300px at 50% 50%, rgba(167,139,250,0.5) 0%, rgba(139,92,246,0.2) 30%, transparent 65%)",
            }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              opacity: glowOpacity,
              scale: glowScale,
              background:
                "radial-gradient(circle 200px at 55% 48%, rgba(236,72,153,0.15) 0%, transparent 60%)",
            }}
          />

          {/* White circle logo */}
          <motion.div
            className="relative z-10"
            style={{
              scale: oliScale,
              filter: oliFilter,
              width: "clamp(120px, 22vw, 280px)",
              height: "clamp(120px, 22vw, 280px)",
            }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background: "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.85) 100%)",
                boxShadow: "0 0 60px rgba(255,255,255,0.15), 0 0 120px rgba(139,92,246,0.1)",
              }}
            />
          </motion.div>

          <motion.p
            className="relative z-10 mt-6 text-xl sm:text-2xl font-medium tracking-tight"
            style={{
              opacity: subtitleOpacity,
              y: subtitleY,
              color: "var(--text-secondary)",
            }}
          >
            All your tools. One mind.
          </motion.p>
        </motion.div>

        {/* OLI text fly-through — explodes from circle center past the screen */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
          style={{ opacity: oliTextOpacity }}
        >
          <motion.span
            className="font-black tracking-tighter select-none whitespace-nowrap"
            style={{
              scale: oliTextScale,
              filter: oliTextFilter,
              fontSize: "clamp(60px, 10vw, 140px)",
              lineHeight: 1,
              background: "linear-gradient(180deg, #ffffff 30%, rgba(139,92,246,0.6) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            OLI
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}
