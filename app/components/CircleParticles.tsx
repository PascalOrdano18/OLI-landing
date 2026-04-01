"use client";

import { useRef, useEffect } from "react";

const TAU = Math.PI * 2;
const COUNT = 50;

interface Dot {
  angle: number;
  speed: number;          // rad/s — all positive (same direction)
  orbitR: number;         // distance from center
  size: number;
  alpha: number;
  // Position state for physics
  px: number;
  py: number;
  vx: number;
  vy: number;
}

function createDots(cR: number): Dot[] {
  return Array.from({ length: COUNT }, () => {
    // Orbits spread from 1.3x to 2.8x the circle radius — clearly around the whole circle
    const orbit = cR * (1.3 + Math.random() * 1.5);
    const angle = Math.random() * TAU;
    const speed = 0.15 + Math.random() * 0.3; // all clockwise
    return {
      angle,
      speed,
      orbitR: orbit,
      size: 1.5 + Math.random() * 2,
      alpha: 0.25 + Math.random() * 0.45,
      px: Math.cos(angle) * orbit,
      py: Math.sin(angle) * orbit,
      vx: 0,
      vy: 0,
    };
  });
}

interface Props {
  circleRadius: number;
  visibility: number;
  mouse: { x: number; y: number; active: boolean };
}

export default function CircleParticles({ circleRadius, visibility, mouse }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const dotsRef = useRef<Dot[]>(createDots(circleRadius || 100));
  const visRef = useRef(visibility);
  const mouseRef = useRef(mouse);
  const cRRef = useRef(circleRadius);
  const prevTime = useRef(Date.now());

  useEffect(() => { visRef.current = visibility; }, [visibility]);
  useEffect(() => { mouseRef.current = mouse; }, [mouse]);
  useEffect(() => {
    if (circleRadius > 0 && Math.abs(circleRadius - cRRef.current) > 5) {
      dotsRef.current = createDots(circleRadius);
      cRRef.current = circleRadius;
    }
  }, [circleRadius]);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d")!;

    const resize = () => {
      const dpr = devicePixelRatio || 1;
      const rect = cvs.getBoundingClientRect();
      cvs.width = rect.width * dpr;
      cvs.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    addEventListener("resize", resize);

    const frame = () => {
      const rect = cvs.getBoundingClientRect();
      const w = rect.width, h = rect.height;
      const cx = w / 2, cy = h / 2;
      ctx.clearRect(0, 0, w, h);

      const vis = visRef.current;
      if (vis < 0.01) { rafRef.current = requestAnimationFrame(frame); return; }

      const now = Date.now();
      const dt = Math.min((now - prevTime.current) / 1000, 0.05);
      prevTime.current = now;

      const cR = cRRef.current;
      const m = mouseRef.current;
      const dots = dotsRef.current;

      for (const d of dots) {
        // Advance orbital angle
        d.angle += d.speed * dt;

        // Target position on orbit
        const tx = Math.cos(d.angle) * d.orbitR;
        const ty = Math.sin(d.angle) * d.orbitR;

        // Spring toward orbital target
        const springK = 3;
        const damping = 0.92;
        const ax = (tx - d.px) * springK;
        const ay = (ty - d.py) * springK;
        d.vx = (d.vx + ax * dt) * damping;
        d.vy = (d.vy + ay * dt) * damping;

        // Mouse repulsion
        if (m.active) {
          const dx = d.px - m.x;
          const dy = d.py - m.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const range = 180;
          if (dist < range && dist > 1) {
            const strength = (1 - dist / range);
            const force = strength * strength * 800;
            d.vx += (dx / dist) * force * dt;
            d.vy += (dy / dist) * force * dt;
          }
        }

        // Circle collision — water-like: deflect tangentially, dampen radial velocity
        const nextX = d.px + d.vx * dt;
        const nextY = d.py + d.vy * dt;
        const nextDist = Math.sqrt(nextX * nextX + nextY * nextY);

        if (nextDist < cR + 2) {
          // Normal vector pointing outward from circle center
          const nx = nextX / nextDist;
          const ny = nextY / nextDist;

          // Radial velocity component
          const radialV = d.vx * nx + d.vy * ny;

          if (radialV < 0) {
            // Moving inward — reflect and dampen (water splash feel)
            d.vx -= 1.5 * radialV * nx;
            d.vy -= 1.5 * radialV * ny;

            // Add tangential splash — push along the surface
            const tangentX = -ny;
            const tangentY = nx;
            const splashForce = Math.abs(radialV) * 0.4;
            d.vx += tangentX * splashForce;
            d.vy += tangentY * splashForce;
          }

          // Push out to surface
          d.px = nx * (cR + 3);
          d.py = ny * (cR + 3);
        } else {
          d.px += d.vx * dt;
          d.py += d.vy * dt;
        }

        // Screen position
        const sx = cx + d.px;
        const sy = cy + d.py;

        // Distance from circle edge for glow effect
        const currentDist = Math.sqrt(d.px * d.px + d.py * d.py);
        const edgeDist = currentDist - cR;
        const nearSurface = edgeDist > 0 && edgeDist < 25;

        let alpha = d.alpha;
        let sz = d.size;

        // Brighten near surface
        if (nearSurface) {
          const prox = 1 - edgeDist / 25;
          alpha = Math.min(1, alpha + prox * 0.4);
          sz *= 1 + prox * 0.5;
        }

        // Velocity-based stretching (water feel)
        const speed = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
        const stretch = Math.min(speed / 100, 2);

        if (stretch > 0.2) {
          // Draw elongated dot in velocity direction
          const velAngle = Math.atan2(d.vy, d.vx);
          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(velAngle);
          ctx.scale(1 + stretch, 1 / (1 + stretch * 0.3));

          // Glow
          const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, sz * 4);
          grd.addColorStop(0, `rgba(139, 92, 246, ${alpha * vis * 0.12})`);
          grd.addColorStop(1, "rgba(139, 92, 246, 0)");
          ctx.beginPath();
          ctx.arc(0, 0, sz * 4, 0, TAU);
          ctx.fillStyle = grd;
          ctx.fill();

          // Core
          ctx.beginPath();
          ctx.arc(0, 0, sz, 0, TAU);
          ctx.fillStyle = `rgba(220, 210, 255, ${alpha * vis})`;
          ctx.fill();

          ctx.restore();
        } else {
          // Normal round dot
          // Glow
          const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, sz * 4);
          grd.addColorStop(0, `rgba(139, 92, 246, ${alpha * vis * 0.12})`);
          grd.addColorStop(1, "rgba(139, 92, 246, 0)");
          ctx.beginPath();
          ctx.arc(sx, sy, sz * 4, 0, TAU);
          ctx.fillStyle = grd;
          ctx.fill();

          // Core
          ctx.beginPath();
          ctx.arc(sx, sy, sz, 0, TAU);
          ctx.fillStyle = `rgba(220, 210, 255, ${alpha * vis})`;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(rafRef.current); removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
