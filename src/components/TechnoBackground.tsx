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
  x: number;
  y: number;
  life: number;
  maxLife: number;
  speed: number;
  color: string;
};

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
    let frame = 0;
    let raf = 0;
    const pointer = { x: 0.5, y: 0.5, active: false };

    const spawn = (): Particle => {
      const t = Math.random();
      const [r, g, b] = sampleRamp(colors, t);
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        life: 0,
        maxLife: 120 + Math.random() * 220,
        speed: 0.45 + Math.random() * 1.1,
        color: `rgba(${r}, ${g}, ${b}, 0.65)`,
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

      // Scale density with viewport area, but keep a hard ceiling for perf.
      const target = Math.min(Math.round((width * height) / 5200), 420);
      particles = Array.from({ length: target }, spawn);
    };

    // Cheap smooth vector field — no noise library needed.
    const fieldAngle = (x: number, y: number, t: number) =>
      (Math.sin(x * 0.0016 + t) + Math.cos(y * 0.0016 - t * 0.7)) * Math.PI;

    const step = () => {
      frame += 1;
      const t = frame * 0.0016;

      // Translucent wash creates the trail effect.
      ctx.fillStyle = "rgba(8, 8, 10, 0.075)";
      ctx.fillRect(0, 0, width, height);
      ctx.lineWidth = 1.1;

      for (const p of particles) {
        const angle = fieldAngle(p.x, p.y, t);
        let vx = Math.cos(angle) * p.speed;
        let vy = Math.sin(angle) * p.speed;

        // Gentle swirl away from the pointer.
        if (pointer.active) {
          const dx = p.x - pointer.x * width;
          const dy = p.y - pointer.y * height;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < 40000 && dist2 > 1) {
            const falloff = (40000 - dist2) / 40000;
            const dist = Math.sqrt(dist2);
            vx += (-dy / dist) * falloff * 1.6;
            vy += (dx / dist) * falloff * 1.6;
          }
        }

        const nx = p.x + vx;
        const ny = p.y + vy;

        ctx.strokeStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(nx, ny);
        ctx.stroke();

        p.x = nx;
        p.y = ny;
        p.life += 1;

        if (
          p.life > p.maxLife ||
          p.x < -20 ||
          p.x > width + 20 ||
          p.y < -20 ||
          p.y > height + 20
        ) {
          Object.assign(p, spawn(), { life: 0 });
        }
      }
    };

    const loop = () => {
      step();
      raf = requestAnimationFrame(loop);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (e.clientX - rect.left) / rect.width;
      pointer.y = (e.clientY - rect.top) / rect.height;
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
      // Render a static textured frame — no rAF, no motion.
      for (let i = 0; i < 70; i += 1) step();
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
            "radial-gradient(ellipse at 50% 45%, rgba(8,8,10,0.55) 0%, rgba(8,8,10,0.82) 55%, #08080a 100%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
    </div>
  );
}
