"use client";

import { useRef, useEffect } from "react";

/* ── Config ── */
const PARTICLE_COUNT = 36;
const POOL_COLOR_R = 139;
const POOL_COLOR_G = 92;
const POOL_COLOR_B = 246;
const LINE_COLOR_R = 99;
const LINE_COLOR_G = 102;
const LINE_COLOR_B = 241;

interface Particle {
  angle: number;
  speed: number;
  radius: number;
  size: number;
  opacity: number;
}

function makeParticles(baseRadius: number): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    angle: (i / PARTICLE_COUNT) * Math.PI * 2,
    speed: 0.15 + Math.random() * 0.25,
    radius: baseRadius + (Math.random() - 0.5) * 30,
    size: 1.5 + Math.random() * 2,
    opacity: 0.25 + Math.random() * 0.5,
  }));
}

interface ParticleRingProps {
  /** Radius of the orbit ring in px */
  radius?: number;
  /** 0–1 visibility. Canvas still runs but fades. */
  visibility?: number;
  /** When true, particles scatter outward rapidly */
  exploding?: boolean;
  /** External mouse position relative to container center */
  mouse?: { x: number; y: number; active: boolean };
}

export default function ParticleRing({
  radius = 210,
  visibility = 1,
  exploding = false,
  mouse,
}: ParticleRingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const startTime = useRef(Date.now());
  const particlesRef = useRef<Particle[]>(makeParticles(radius));
  const explodingRef = useRef(false);
  const explosionStart = useRef<number | null>(null);
  const visRef = useRef(visibility);
  const mouseRef = useRef(mouse ?? { x: 0, y: 0, active: false });

  // Sync refs
  useEffect(() => {
    visRef.current = visibility;
  }, [visibility]);
  useEffect(() => {
    if (mouse) mouseRef.current = mouse;
  }, [mouse]);
  useEffect(() => {
    if (exploding && !explodingRef.current) {
      explosionStart.current = Date.now();
    }
    if (!exploding) {
      explosionStart.current = null;
    }
    explodingRef.current = exploding;
  }, [exploding]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const particles = particlesRef.current;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2;
      ctx.clearRect(0, 0, w, h);

      const vis = visRef.current;
      if (vis < 0.01) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const now = Date.now();
      const elapsed = (now - startTime.current) / 1000;
      const isExploding = explodingRef.current && explosionStart.current;
      const explosionT = isExploding
        ? Math.min((now - explosionStart.current!) / 1000, 1.2)
        : 0;

      const positions: { x: number; y: number; size: number; opacity: number }[] = [];

      for (const p of particles) {
        let angle = p.angle + elapsed * p.speed;
        let r = p.radius;
        let opacity = p.opacity * vis;
        let size = p.size;

        if (isExploding) {
          const t = Math.min(explosionT / 0.8, 1);
          angle += explosionT * 4;
          r = p.radius + t * t * 800;
          opacity = p.opacity * vis * (1 - t);
          size = p.size * (1 + t);
        }

        let x = cx + Math.cos(angle) * r;
        let y = cy + Math.sin(angle) * r;

        // Cursor repulsion
        if (!isExploding && mouseRef.current.active) {
          const mx = mouseRef.current.x;
          const my = mouseRef.current.y;
          const dx = x - (cx + mx);
          const dy = y - (cy + my);
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160 && dist > 0) {
            const force = (1 - dist / 160) * 50;
            x += (dx / dist) * force;
            y += (dy / dist) * force;
            opacity = Math.min(vis, opacity + (1 - dist / 160) * 0.4 * vis);
            size = p.size + (1 - dist / 160) * 2;
          }
        }

        positions.push({ x, y, size, opacity });

        // Particle dot
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${POOL_COLOR_R}, ${POOL_COLOR_G}, ${POOL_COLOR_B}, ${opacity})`;
        ctx.fill();

        // Soft glow
        ctx.beginPath();
        ctx.arc(x, y, size * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${LINE_COLOR_R}, ${LINE_COLOR_G}, ${LINE_COLOR_B}, ${opacity * 0.1})`;
        ctx.fill();
      }

      // Connecting lines
      if (!isExploding) {
        for (let i = 0; i < positions.length; i++) {
          for (let j = i + 1; j < positions.length; j++) {
            const dx = positions[j].x - positions[i].x;
            const dy = positions[j].y - positions[i].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 90) {
              const a = 0.06 * (1 - dist / 90) * vis;
              ctx.beginPath();
              ctx.moveTo(positions[i].x, positions[i].y);
              ctx.lineTo(positions[j].x, positions[j].y);
              ctx.strokeStyle = `rgba(${LINE_COLOR_R}, ${LINE_COLOR_G}, ${LINE_COLOR_B}, ${a})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }

        // Lines to cursor
        if (mouseRef.current.active) {
          const mx = cx + mouseRef.current.x;
          const my = cy + mouseRef.current.y;
          for (const pos of positions) {
            const dx = pos.x - mx;
            const dy = pos.y - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              const a = 0.12 * (1 - dist / 120) * vis;
              ctx.beginPath();
              ctx.moveTo(pos.x, pos.y);
              ctx.lineTo(mx, my);
              ctx.strokeStyle = `rgba(${POOL_COLOR_R}, ${POOL_COLOR_G}, ${POOL_COLOR_B}, ${a})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
