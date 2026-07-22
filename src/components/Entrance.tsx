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

type Star = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rgb: RGB;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  // Explode-animation state (screen space) — stars scatter too.
  evx: number;
  evy: number;
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

const PARTICLE_COUNT = 480;
const STAR_COUNT = 220;
const EXPLODE_MS = 1500;
const FLASH_MS = 220;
const RING_CONFIGS = [
  { rxFactor: 1.55, ryFactor: 0.42, speed: 0.0016, tilt: -0.32, colorIndex: 1 },
  { rxFactor: 1.85, ryFactor: 0.55, speed: -0.001, tilt: 0.22, colorIndex: 2 },
];

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
    let nextCometAt = 90 + Math.random() * 150;
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let comets: Comet[] = [];

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

    let stars: Star[] = [];
    const makeStars = () => {
      stars = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        radius: 0.6 + Math.random() * 1.5,
        rgb: sampleRamp(colors, Math.random()),
        baseAlpha: 0.32 + Math.random() * 0.45,
        twinkleSpeed: 0.008 + Math.random() * 0.02,
        twinklePhase: Math.random() * Math.PI * 2,
        evx: 0,
        evy: 0,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeStars();
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

    const spawnComet = (): Comet => {
      const fromLeft = Math.random() < 0.5;
      const y = Math.random() * height * 0.6;
      const speed = 7 + Math.random() * 5;
      const angle = (fromLeft ? 1 : -1) * (0.25 + Math.random() * 0.2);
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

    const step = () => {
      frame += 1;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const globeRadius = Math.min(width, height) * 0.26;

      const elapsed = explodeStart ? performance.now() - explodeStart : 0;
      const explodeT = explodeStart ? Math.min(elapsed / EXPLODE_MS, 1) : 0;
      const flashT = explodeStart ? Math.min(elapsed / FLASH_MS, 1) : 1;

      // Ambient starfield fills the rest of the viewport so it never reads
      // as empty black space. Stars drift slowly and wrap at the edges;
      // on explode they scatter outward like everything else, just slower.
      for (const s of stars) {
        let sx = s.x;
        let sy = s.y;
        let alpha =
          s.baseAlpha *
          (0.5 + 0.5 * Math.sin(frame * s.twinkleSpeed + s.twinklePhase));

        if (explodeStart) {
          if (s.evx === 0 && s.evy === 0) {
            const dx = s.x - cx || 0.001;
            const dy = s.y - cy || 0.001;
            const dist = Math.hypot(dx, dy) || 1;
            const speed = 1.5 + Math.random() * 3;
            s.evx = (dx / dist) * speed;
            s.evy = (dy / dist) * speed;
          }
          s.x += s.evx;
          s.y += s.evy;
          alpha *= 1 - explodeT;
        } else {
          s.x = (s.x + s.vx + width) % width;
          s.y = (s.y + s.vy + height) % height;
        }
        sx = s.x;
        sy = s.y;

        const [r, g, b] = s.rgb;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.max(alpha, 0)})`;
        ctx.arc(sx, sy, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Occasional shooting stars streaking across the scene.
      if (!explodeStart) {
        if (frame >= nextCometAt) {
          comets.push(spawnComet());
          nextCometAt = frame + 150 + Math.random() * 220;
        }
        for (const c of comets) {
          const tailX = c.x - c.vx * 6;
          const tailY = c.y - c.vy * 6;
          const [r, g, b] = c.rgb;
          const fade = 1 - c.life / c.maxLife;
          const grad = ctx.createLinearGradient(tailX, tailY, c.x, c.y);
          grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
          grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${0.75 * fade})`);
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
      }

      // Glow behind the globe for atmosphere.
      if (explodeT < 1) {
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, globeRadius * 2.6);
        const [gr, gg, gb] = colors[1];
        glow.addColorStop(0, `rgba(${gr}, ${gg}, ${gb}, ${0.34 * (1 - explodeT)})`);
        glow.addColorStop(0.6, `rgba(${gr}, ${gg}, ${gb}, ${0.12 * (1 - explodeT)})`);
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }

      // Gentle auto-rotation plus a subtle tilt toward the pointer.
      pointer.x += (pointer.targetX - pointer.x) * 0.04;
      pointer.y += (pointer.targetY - pointer.y) * 0.04;
      const rotY = frame * 0.0032 + pointer.x * 0.35;
      const rotX = Math.sin(frame * 0.0011) * 0.25 + pointer.y * 0.2;

      // Slow-rotating orbit rings around the globe, HUD-style.
      if (explodeT < 1) {
        for (const ring of RING_CONFIGS) {
          const [r, g, b] = colors[ring.colorIndex];
          const ringAlpha = 0.42 * (1 - explodeT);
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(ring.tilt + frame * ring.speed);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${ringAlpha})`;
          ctx.lineWidth = 1.4;
          ctx.setLineDash([3, 7]);
          ctx.beginPath();
          ctx.ellipse(
            0,
            0,
            globeRadius * ring.rxFactor,
            globeRadius * ring.ryFactor,
            0,
            0,
            Math.PI * 2
          );
          ctx.stroke();
          ctx.restore();
        }
        ctx.setLineDash([]);
      }

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
            const speed = 9 + Math.random() * 16;
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
        const size =
          (1.4 + depth * 1.6) * perspective * (explodeStart ? 1 + explodeT * 1.8 : 1);

        ctx.beginPath();
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.max(alpha, 0)})`;
        ctx.arc(drawX, drawY, Math.max(size, 0.4), 0, Math.PI * 2);
        ctx.fill();
      }

      // Shockwave ring + bright flash at the moment of the click. Eased
      // (rather than linear) so the ring builds up gradually instead of
      // snapping straight to full size.
      if (explodeStart) {
        const shockEase = explodeT * explodeT * (3 - 2 * explodeT); // smoothstep
        const shockRadius = shockEase * Math.max(width, height) * 0.75;
        const [sr, sg, sb] = colors[0];
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${sr}, ${sg}, ${sb}, ${0.55 * (1 - explodeT)})`;
        ctx.lineWidth = 2.5 * (1 - explodeT) + 0.5;
        ctx.arc(cx, cy, Math.max(shockRadius, 0), 0, Math.PI * 2);
        ctx.stroke();

        if (flashT < 1) {
          const flash = ctx.createRadialGradient(
            cx,
            cy,
            0,
            cx,
            cy,
            Math.max(width, height) * 0.6
          );
          flash.addColorStop(0, `rgba(255, 255, 255, ${0.55 * (1 - flashT)})`);
          flash.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.fillStyle = flash;
          ctx.fillRect(0, 0, width, height);
        }
      }

      if (explodeStart && explodeT >= 1) {
        cancelAnimationFrame(raf);
        return;
      }

      raf = requestAnimationFrame(step);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.targetX = (e.clientX - rect.left) / rect.width - 0.5;
      pointer.targetY = (e.clientY - rect.top) / rect.height - 0.5;
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduceMotion) {
      step();
    } else {
      window.addEventListener("pointermove", onPointerMove);
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
      window.removeEventListener("pointermove", onPointerMove);
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
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: exploding ? 0 : 1, scale: exploding ? 1.12 : 1 }}
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
