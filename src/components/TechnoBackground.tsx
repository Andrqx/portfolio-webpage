"use client";

import { useEffect, useRef } from "react";

type RGB = [number, number, number];

const FALLBACK_COLORS: RGB[] = [
  [255, 46, 99], // --accent  (red)
  [162, 75, 255], // --accent-2 (purple)
  [255, 95, 210], // --accent-3 (pink)
];

function readAccentColors(): RGB[] {
  if (typeof window === "undefined") return FALLBACK_COLORS;
  const styles = getComputedStyle(document.documentElement);
  const parsed = ["--accent", "--accent-2", "--accent-3"].map((name, i) => {
    const raw = styles.getPropertyValue(name).trim();
    const hex = /^#([0-9a-f]{6})$/i.exec(raw);
    if (!hex) return FALLBACK_COLORS[i];
    const int = parseInt(hex[1], 16);
    return [(int >> 16) & 255, (int >> 8) & 255, int & 255] as RGB;
  });
  return parsed;
}

/** Lerp across the accent ramp: 0 -> red, 0.5 -> purple, 1 -> pink. */
function sampleRamp(colors: RGB[], t: number): RGB {
  const scaled = t * (colors.length - 1);
  const i = Math.min(Math.floor(scaled), colors.length - 2);
  const f = scaled - i;
  const a = colors[i];
  const b = colors[i + 1];
  return [
    Math.round(a[0] + (b[0] - a[0]) * f),
    Math.round(a[1] + (b[1] - a[1]) * f),
    Math.round(a[2] + (b[2] - a[2]) * f),
  ];
}

type Particle = {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  drift: number;
  driftPhase: number;
  rgb: RGB;
  alpha: number;
};

type Comet = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  rgb: RGB;
};

const LINK_DIST = 130;
const REPEL_RADIUS = 150;
const REPEL_STRENGTH = 2600;
const SPRING = 0.02;
const DAMPING = 0.9;
// Roughly every 5-11s at 60fps — rare enough to feel like a nice surprise,
// not a constant distraction.
const COMET_MIN_FRAMES = 300;
const COMET_MAX_FRAMES = 660;

export default function TechnoBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const colors = readAccentColors();
    const bg = "#08080a";
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let comets: Comet[] = [];
    let nextCometAt = COMET_MIN_FRAMES + Math.random() * (COMET_MAX_FRAMES - COMET_MIN_FRAMES);
    let frame = 0;
    let raf = 0;
    const pointer = { x: -9999, y: -9999, active: false };

    const spawnComet = (): Comet => {
      const fromLeft = Math.random() < 0.5;
      const y = Math.random() * height * 0.7;
      const speed = 6 + Math.random() * 4;
      const angle = (fromLeft ? 1 : -1) * (0.2 + Math.random() * 0.2);
      return {
        x: fromLeft ? -20 : width + 20,
        y,
        vx: Math.cos(angle) * speed * (fromLeft ? 1 : -1),
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 60 + Math.random() * 30,
        rgb: sampleRamp(colors, Math.random()),
      };
    };

    const makeParticle = (): Particle => {
      const homeX = Math.random() * width;
      const homeY = Math.random() * height;
      const rgb = sampleRamp(colors, Math.random());
      return {
        homeX,
        homeY,
        x: homeX,
        y: homeY,
        vx: 0,
        vy: 0,
        radius: 1.3 + Math.random() * 2.2,
        drift: 6 + Math.random() * 10,
        driftPhase: Math.random() * Math.PI * 2,
        rgb,
        alpha: 0.6 + Math.random() * 0.4,
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      const target = Math.min(Math.round((width * height) / 9000), 190);
      particles = Array.from({ length: target }, makeParticle);
    };

    const step = () => {
      frame += 1;
      const t = frame * 0.02;

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Idle wobble around each particle's home position, plus a spring
      // pulling it back home and a repulsion push away from the pointer.
      for (const p of particles) {
        const targetX = p.homeX + Math.cos(t + p.driftPhase) * p.drift;
        const targetY = p.homeY + Math.sin(t * 0.8 + p.driftPhase) * p.drift;

        p.vx += (targetX - p.x) * SPRING;
        p.vy += (targetY - p.y) * SPRING;

        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < REPEL_RADIUS * REPEL_RADIUS && dist2 > 4) {
            const dist = Math.sqrt(dist2);
            const force = (REPEL_STRENGTH / dist2) * (1 - dist / REPEL_RADIUS);
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.x += p.vx;
        p.y += p.vy;
      }

      // Faint network lines between nearby particles.
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i += 1) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j += 1) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < LINK_DIST * LINK_DIST) {
            const t2 = 1 - Math.sqrt(dist2) / LINK_DIST;
            const [r, g, bch] = a.rgb;
            ctx.strokeStyle = `rgba(${r}, ${g}, ${bch}, ${t2 * 0.22})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Dots on top of the links.
      for (const p of particles) {
        const [r, g, b] = p.rgb;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Occasional shooting stars streaking across the hero.
      if (frame >= nextCometAt) {
        comets.push(spawnComet());
        nextCometAt = frame + COMET_MIN_FRAMES + Math.random() * (COMET_MAX_FRAMES - COMET_MIN_FRAMES);
      }
      for (const c of comets) {
        const tailX = c.x - c.vx * 6;
        const tailY = c.y - c.vy * 6;
        const [r, g, b] = c.rgb;
        const fade = 1 - c.life / c.maxLife;
        const grad = ctx.createLinearGradient(tailX, tailY, c.x, c.y);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${0.7 * fade})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(c.x, c.y);
        ctx.stroke();

        c.x += c.vx;
        c.y += c.vy;
        c.life += 1;
      }
      comets = comets.filter(
        (c) => c.life < c.maxLife && c.x > -40 && c.x < width + 40
      );
    };

    const loop = () => {
      step();
      raf = requestAnimationFrame(loop);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduceMotion) raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    if (reduceMotion) {
      // Render a single static frame — no rAF, no motion.
      step();
    } else {
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerleave", onPointerLeave);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="h-full w-full" />
      {/* Vignette + bottom fade so headline text stays legible. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(8,8,10,0.35) 0%, rgba(8,8,10,0.75) 55%, #08080a 100%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
    </div>
  );
}
