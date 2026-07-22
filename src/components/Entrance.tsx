"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

type Point = {
  // Fixed position on the unit sphere.
  sx: number;
  sy: number;
  sz: number;
  rgb: RGB;
  radius: number;
  // Explode-animation state (screen space).
  ex: number;
  ey: number;
  evx: number;
  evy: number;
};

const PARTICLE_COUNT = 480;
const EXPLODE_MS = 850;

/** Evenly distributes N points on a sphere via a golden-angle spiral. */
function fibonacciSphere(count: number): Array<[number, number, number]> {
  const points: Array<[number, number, number]> = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = golden * i;
    points.push([Math.cos(theta) * radiusAtY, y, Math.sin(theta) * radiusAtY]);
  }
  return points;
}

export default function Entrance({ onEnter }: { onEnter: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [exploding, setExploding] = useState(false);
  const [visible, setVisible] = useState(true);
  const reduceMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const colors = readAccentColors();
    const bg = "#08080a";
    let width = 0;
    let height = 0;
    let raf = 0;
    let frame = 0;
    let explodeStart = 0;

    const sphere = fibonacciSphere(PARTICLE_COUNT);
    const points: Point[] = sphere.map(([sx, sy, sz]) => ({
      sx,
      sy,
      sz,
      rgb: sampleRamp(colors, Math.random()),
      radius: 1.4 + Math.random() * 1.8,
      ex: 0,
      ey: 0,
      evx: 0,
      evy: 0,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const project = (
      p: Point,
      rotY: number,
      rotX: number,
      radius: number,
      cx: number,
      cy: number
    ) => {
      // Rotate around Y, then X.
      const x1 = p.sx * Math.cos(rotY) - p.sz * Math.sin(rotY);
      const z1 = p.sx * Math.sin(rotY) + p.sz * Math.cos(rotY);
      const y2 = p.sy * Math.cos(rotX) - z1 * Math.sin(rotX);
      const z2 = p.sy * Math.sin(rotX) + z1 * Math.cos(rotX);

      const perspective = 2.6 / (2.6 - z2);
      const screenX = cx + x1 * radius * perspective;
      const screenY = cy + y2 * radius * perspective;
      const depth = (z2 + 1) / 2; // 0 (back) -> 1 (front)
      return { screenX, screenY, depth, perspective };
    };

    const step = () => {
      frame += 1;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const globeRadius = Math.min(width, height) * 0.26;
      const rotY = frame * 0.0032;
      const rotX = Math.sin(frame * 0.0011) * 0.25;

      const elapsed = explodeStart ? performance.now() - explodeStart : 0;
      const explodeT = explodeStart ? Math.min(elapsed / EXPLODE_MS, 1) : 0;

      for (const p of points) {
        const { screenX, screenY, depth, perspective } = project(
          p,
          rotY,
          rotX,
          globeRadius,
          cx,
          cy
        );

        let drawX = screenX;
        let drawY = screenY;
        let alpha = 0.25 + depth * 0.65;

        if (explodeStart) {
          if (p.evx === 0 && p.evy === 0) {
            const dx = screenX - cx || 0.001;
            const dy = screenY - cy || 0.001;
            const dist = Math.hypot(dx, dy) || 1;
            const speed = 6 + Math.random() * 10;
            p.evx = (dx / dist) * speed;
            p.evy = (dy / dist) * speed;
            p.ex = screenX;
            p.ey = screenY;
          }
          p.ex += p.evx;
          p.ey += p.evy;
          drawX = p.ex;
          drawY = p.ey;
          alpha = (0.25 + depth * 0.65) * (1 - explodeT);
        }

        const [r, g, b] = p.rgb;
        const size = (1.4 + depth * 1.6) * perspective * (explodeStart ? 1 + explodeT * 1.5 : 1);

        ctx.beginPath();
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.max(alpha, 0)})`;
        ctx.arc(drawX, drawY, Math.max(size, 0.4), 0, Math.PI * 2);
        ctx.fill();
      }

      if (explodeStart && explodeT >= 1) {
        cancelAnimationFrame(raf);
        return;
      }

      raf = requestAnimationFrame(step);
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduceMotion) {
      step();
    } else {
      raf = requestAnimationFrame(step);
    }

    const trigger = () => {
      explodeStart = performance.now();
    };
    canvas.dataset.ready = "true";
    (canvas as HTMLCanvasElement & { __triggerExplode?: () => void }).__triggerExplode =
      trigger;

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduceMotion]);

  const handleEnter = () => {
    if (exploding) return;
    setExploding(true);

    const canvas = canvasRef.current as
      | (HTMLCanvasElement & { __triggerExplode?: () => void })
      | null;
    canvas?.__triggerExplode?.();

    const delay = reduceMotion ? 250 : EXPLODE_MS;
    window.setTimeout(() => {
      setVisible(false);
      onEnter();
    }, delay);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="button"
          tabIndex={0}
          aria-label="Enter site"
          onClick={handleEnter}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleEnter();
            }
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: exploding ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: reduceMotion ? 0.25 : EXPLODE_MS / 1000,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center bg-background outline-none"
        >
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: exploding ? 0 : 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative z-10 flex flex-col items-center gap-4"
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="font-mono text-xs uppercase tracking-[0.35em] text-muted"
            >
              Click to enter
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
