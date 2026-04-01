"use client";

import { useRef, useEffect } from "react";

/* ── Config ── */
const PARTICLE_COUNT = 42;
const POOL_COLOR_R = 139;
const POOL_COLOR_G = 92;
const POOL_COLOR_B = 246;
const LINE_COLOR_R = 99;
const LINE_COLOR_G = 102;
const LINE_COLOR_B = 241;

interface Particle {
  angle: number;
  speed: number;
  /** Offset from circle edge — oscillates positive (outside) and negative (inside) */
  waveAmp: number;
  waveFreq: number;
  wavePhase: number;
  size: number;
  baseOpacity: number;
}

interface Ripple {
  x: number;
  y: number;
  born: number;
  maxRadius: number;
  outward: boolean; // true = exiting circle, false = entering
}

function makeParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    angle: (i / PARTICLE_COUNT) * Math.PI * 2,
    speed: 0.12 + Math.random() * 0.2,
    waveAmp: 15 + Math.random() * 35, // how far in/out they oscillate
    waveFreq: 0.4 + Math.random() * 0.8, // oscillation speed
    wavePhase: Math.random() * Math.PI * 2,
    size: 1.5 + Math.random() * 2,
    baseOpacity: 0.3 + Math.random() * 0.5,
  }));
}

interface ParticleRingProps {
  radius?: number;
  visibility?: number;
  exploding?: boolean;
  mouse?: { x: number; y: number; active: boolean };
  /** Radius of central circle for droplet interaction (0 = normal orbit) */
  circleRadius?: number;
}

export default function ParticleRing({
  radius = 210,
  visibility = 1,
  exploding = false,
  mouse,
  circleRadius = 0,
}: ParticleRingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const startTime = useRef(Date.now());
  const particlesRef = useRef<Particle[]>(makeParticles());
  const explodingRef = useRef(false);
  const explosionStart = useRef<number | null>(null);
  const visRef = useRef(visibility);
  const mouseRef = useRef(mouse ?? { x: 0, y: 0, active: false });
  const circleRadiusRef = useRef(circleRadius);
  const ripplesRef = useRef<Ripple[]>([]);
  // Track whether each particle was inside or outside last frame (for crossing detection)
  const wasInsideRef = useRef<boolean[]>(new Array(PARTICLE_COUNT).fill(false));

  useEffect(() => { visRef.current = visibility; }, [visibility]);
  useEffect(() => { if (mouse) mouseRef.current = mouse; }, [mouse]);
  useEffect(() => { circleRadiusRef.current = circleRadius; }, [circleRadius]);
  useEffect(() => {
    if (exploding && !explodingRef.current) explosionStart.current = Date.now();
    if (!exploding) explosionStart.current = null;
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

      const cR = circleRadiusRef.current;
      const ripples = ripplesRef.current;
      const wasInside = wasInsideRef.current;
      const useCircle = cR > 0;
      // Orbit radius: if circle exists, orbit around its edge; otherwise use prop
      const orbitBase = useCircle ? cR : radius;

      const positions: { x: number; y: number; size: number; opacity: number }[] = [];

      for (let pi = 0; pi < particles.length; pi++) {
        const p = particles[pi];
        let angle = p.angle + elapsed * p.speed;
        let opacity = p.baseOpacity * vis;
        let size = p.size;

        if (isExploding) {
          const t = Math.min(explosionT / 0.8, 1);
          angle += explosionT * 4;
          const r = orbitBase + p.waveAmp + t * t * 800;
          opacity = p.baseOpacity * vis * (1 - t);
          size = p.size * (1 + t);
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          positions.push({ x, y, size, opacity });
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${POOL_COLOR_R}, ${POOL_COLOR_G}, ${POOL_COLOR_B}, ${opacity})`;
          ctx.fill();
          continue;
        }

        // Radial oscillation: particle moves in and out through the circle surface
        const wave = Math.sin(elapsed * p.waveFreq + p.wavePhase) * p.waveAmp;
        const r = orbitBase + wave;
        const isInside = useCircle && r < cR;

        // Detect boundary crossing → spawn ripple
        if (useCircle && wasInside[pi] !== isInside) {
          const crossAngle = angle;
          ripples.push({
            x: cx + Math.cos(crossAngle) * cR,
            y: cy + Math.sin(crossAngle) * cR,
            born: now,
            maxRadius: 10 + Math.random() * 15,
            outward: !isInside, // true if particle just exited
          });
          wasInside[pi] = isInside;
        }

        let x = cx + Math.cos(angle) * r;
        let y = cy + Math.sin(angle) * r;

        // Proximity to circle surface — affects visuals
        if (useCircle) {
          const distFromSurface = Math.abs(r - cR);
          const surfaceProximity = Math.max(0, 1 - distFromSurface / 20);

          if (isInside) {
            // Inside the circle: fade out, shrink — "submerging"
            const depth = (cR - r) / p.waveAmp;
            opacity *= Math.max(0.05, 1 - depth * 0.85);
            size *= Math.max(0.3, 1 - depth * 0.5);
          }

          // Glow when near surface (transition effect)
          if (surfaceProximity > 0) {
            size += surfaceProximity * 2;
            opacity = Math.min(1, opacity + surfaceProximity * 0.3 * vis);
          }
        }

        // Cursor repulsion
        if (mouseRef.current.active) {
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

        // Surface emergence glow — bright flash when crossing the boundary
        if (useCircle) {
          const distFromSurface = Math.abs(r - cR);
          if (distFromSurface < 8) {
            ctx.beginPath();
            ctx.arc(x, y, size * 6, 0, Math.PI * 2);
            const flash = (1 - distFromSurface / 8) * 0.2 * vis;
            ctx.fillStyle = `rgba(255, 255, 255, ${flash})`;
            ctx.fill();
          }
        }
      }

      // Draw ripples at crossing points
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        const age = (now - rip.born) / 1000;
        const life = 0.6;
        if (age > life) {
          ripples.splice(i, 1);
          continue;
        }
        const t = age / life;
        const ripR = t * rip.maxRadius;
        const ripAlpha = (1 - t * t) * 0.5 * vis;

        // Main ripple ring
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, ripR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${ripAlpha})`;
        ctx.lineWidth = 2 * (1 - t);
        ctx.stroke();

        // Secondary inner ring
        if (ripR > 4) {
          ctx.beginPath();
          ctx.arc(rip.x, rip.y, ripR * 0.55, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${POOL_COLOR_R}, ${POOL_COLOR_G}, ${POOL_COLOR_B}, ${ripAlpha * 0.6})`;
          ctx.lineWidth = 1.2 * (1 - t);
          ctx.stroke();
        }
      }

      // Connecting lines between nearby particles (only outside circle)
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
  }, [radius]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
