"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { dispatchEntranceComplete } from "@/hooks/useEntranceReveal";

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

type Blob = {
  angle: number;
  angleSpeed: number;
  orbitX: number;
  orbitY: number;
  radius: number;
  rgb: RGB;
  phase: number;
};

type PixelDot = {
  // True scattered position across the full canvas.
  x: number;
  y: number;
  rgb: RGB;
  size: number;
  alpha: number;
  // Reveal is driven by the loading percentage itself, not elapsed time —
  // this dot starts appearing once percent passes revealAt, and is fully
  // in by revealAt + growSpan (both in percent-points, capped at 100).
  revealAt: number;
  growSpan: number;
  fadeOutOffset: number;
  fadeOutMs: number;
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

const COUNT_MS = 2600;
const HOLD_AT_100_MS = 350;
const FADE_MS = 900;
const SKIP_FADE_MS = 500;
const BLOB_COUNT = 4;
const PIXEL_DOT_COUNT = 340;
const PIXEL_FADEOUT_STAGGER_MS = 300;
const PIXEL_FADEOUT_MIN_MS = 400;
const PIXEL_FADEOUT_MAX_MS = 700;

/** Ease-out-cubic: a smooth, steady motion rather than an instant pop. */
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function Entrance({ onEnter }: { onEnter: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const counterCanvasRef = useRef<HTMLCanvasElement>(null);
  const [percent, setPercent] = useState(0);
  const [showCounter, setShowCounter] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [fadeMs, setFadeMs] = useState(FADE_MS);
  const [visible, setVisible] = useState(true);
  const dismissedRef = useRef(false);
  const percentRef = useRef(0);
  const fadeStartRef = useRef(0);
  const timersRef = useRef<number[]>([]);
  const reduceMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  const finish = () => {
    setVisible(false);
    onEnter();
  };

  const beginFadeOut = () => {
    if (dismissedRef.current) return;
    setShowCounter(false);
    setFadeMs(FADE_MS);
    setLeaving(true);
    fadeStartRef.current = performance.now();
    dispatchEntranceComplete();
    const t = window.setTimeout(() => {
      if (dismissedRef.current) return;
      dismissedRef.current = true;
      finish();
    }, FADE_MS);
    timersRef.current.push(t);
  };

  // Skip: fast-forward straight to 100% and fade out immediately.
  const handleSkip = () => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    clearTimers();
    percentRef.current = 100;
    setPercent(100);
    setShowCounter(false);
    setFadeMs(reduceMotion ? 150 : SKIP_FADE_MS);
    setLeaving(true);
    fadeStartRef.current = performance.now();
    dispatchEntranceComplete();
    const t = window.setTimeout(finish, reduceMotion ? 150 : SKIP_FADE_MS);
    timersRef.current.push(t);
  };

  // Counts up to 100 — pixels reveal in lockstep with the percentage via
  // percentRef, which the canvas loop reads directly (see below). Once it
  // hits 100, holds briefly on the full field before fading to the hero.
  useEffect(() => {
    if (reduceMotion) {
      const t = window.setTimeout(() => {
        if (dismissedRef.current) return;
        percentRef.current = 100;
        setPercent(100);
        beginFadeOut();
      }, 300);
      timersRef.current.push(t);
      return () => clearTimers();
    }

    let raf = 0;
    const start = performance.now();
    let totalPaused = 0;
    let pausedUntil = 0;
    // A couple of brief stalls partway through, like a real progress bar
    // hitting a slow chunk of work — rather than a mathematically perfect
    // curve straight to 100.
    const pausePoints = [
      { threshold: 25 + Math.random() * 15, hold: 90 + Math.random() * 140, triggered: false },
      { threshold: 55 + Math.random() * 20, hold: 90 + Math.random() * 140, triggered: false },
    ];

    const tick = (now: number) => {
      if (now < pausedUntil) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const t = Math.min((now - start - totalPaused) / COUNT_MS, 1);
      const eased = 1 - Math.pow(1 - t, 2);
      const pct = Math.round(eased * 100);

      for (const p of pausePoints) {
        if (!p.triggered && pct >= p.threshold) {
          p.triggered = true;
          pausedUntil = now + p.hold;
          totalPaused += p.hold;
        }
      }

      percentRef.current = pct;
      setPercent(pct);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        const holdTimer = window.setTimeout(beginFadeOut, HOLD_AT_100_MS);
        timersRef.current.push(holdTimer);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- beginFadeOut is stable for the component's lifetime
  }, [reduceMotion]);

  // Pixelated counter: render the percentage onto a tiny low-res canvas, then
  // hard-threshold every pixel's alpha to fully on/off. Font anti-aliasing
  // leaves soft gray edges that read as blur once the browser upscales the
  // canvas with `image-rendering: pixelated` — thresholding removes that,
  // so every displayed pixel is a crisp block instead of a soft-edged one.
  useEffect(() => {
    const c = counterCanvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#f2f1ec";
    ctx.font = "700 12px ui-monospace, 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${percent}%`, c.width / 2, c.height / 2 + 1);

    const img = ctx.getImageData(0, 0, c.width, c.height);
    const { data } = img;
    for (let i = 3; i < data.length; i += 4) {
      data[i] = data[i] > 90 ? 255 : 0;
    }
    ctx.putImageData(img, 0, 0);
  }, [percent]);

  // Canvas: a drifting gradient-blob background runs continuously for the
  // whole entrance (never cuts). Pixel dots reveal in step with the loading
  // percentage — more of the field lights up as it climbs, all of it lit by
  // 100 — then the whole layer dissolves into the real hero background.
  // Occasional shooting stars streak across while the loading is active.
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
    let nextCometAt = 70 + Math.random() * 100;

    let blobs: Blob[] = [];
    let pixelDots: PixelDot[] = [];
    let comets: Comet[] = [];

    const makeBlobs = () => {
      blobs = Array.from({ length: BLOB_COUNT }, (_, i) => ({
        angle: (i / BLOB_COUNT) * Math.PI * 2,
        angleSpeed: 0.0009 + Math.random() * 0.0007,
        orbitX: width * (0.22 + Math.random() * 0.14),
        orbitY: height * (0.18 + Math.random() * 0.12),
        radius: Math.min(width, height) * (0.32 + Math.random() * 0.16),
        rgb: colors[i % colors.length],
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const makePixelDots = () => {
      // Scattered at their true final position across the whole canvas.
      // revealAt/growSpan are chosen so every dot finishes appearing by
      // percent === 100, spread across the climb rather than at the end.
      pixelDots = Array.from({ length: PIXEL_DOT_COUNT }, () => {
        const revealAt = Math.random() * 78;
        const growSpan = 14 + Math.random() * 8;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          rgb: sampleRamp(colors, Math.random()),
          size: 1.2 + Math.random() * 2,
          alpha: 0.28 + Math.random() * 0.32,
          revealAt,
          growSpan,
          fadeOutOffset: Math.random() * PIXEL_FADEOUT_STAGGER_MS,
          fadeOutMs:
            PIXEL_FADEOUT_MIN_MS +
            Math.random() * (PIXEL_FADEOUT_MAX_MS - PIXEL_FADEOUT_MIN_MS),
        };
      });
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

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeBlobs();
      makePixelDots();
    };

    const drawBlobBackground = () => {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      ctx.globalCompositeOperation = "lighter";
      for (const b of blobs) {
        const a = b.angle + frame * b.angleSpeed;
        const x = cx + Math.cos(a) * b.orbitX;
        const y = cy + Math.sin(a * 1.3 + b.phase) * b.orbitY;
        const pulse = 0.85 + 0.15 * Math.sin(frame * 0.01 + b.phase);

        const grad = ctx.createRadialGradient(x, y, 0, x, y, b.radius * pulse);
        const [r, g, bl] = b.rgb;
        grad.addColorStop(0, `rgba(${r}, ${g}, ${bl}, 0.22)`);
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const drawPixelDots = () => {
      const now = performance.now();
      const fadeElapsed = fadeStartRef.current ? now - fadeStartRef.current : -1;
      const currentPercent = percentRef.current;

      // A cheap two-circle glow (soft wide + bright core) instead of
      // ctx.shadowBlur, which is expensive to run per-shape at this count.
      for (const d of pixelDots) {
        const t = Math.min(
          Math.max((currentPercent - d.revealAt) / d.growSpan, 0),
          1
        );
        const eased = easeOutCubic(t);
        if (eased <= 0) continue;

        // Each dot dissolves on its own staggered schedule too, so the
        // pixels visibly fade away rather than just riding the container's
        // single uniform opacity fade.
        let fadeMultiplier = 1;
        if (fadeElapsed >= 0) {
          const fadeLocal = fadeElapsed - d.fadeOutOffset;
          if (fadeLocal > 0) {
            const fadeT = Math.min(fadeLocal / d.fadeOutMs, 1);
            fadeMultiplier = Math.pow(1 - fadeT, 3);
          }
        }
        if (fadeMultiplier <= 0) continue;

        const [r, g, b] = d.rgb;
        const alpha = d.alpha * eased * fadeMultiplier;
        const size = d.size * (0.3 + 0.7 * eased);

        ctx.beginPath();
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.35})`;
        ctx.arc(d.x, d.y, size * 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.arc(d.x, d.y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawComets = () => {
      if (!fadeStartRef.current && frame >= nextCometAt) {
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
    };

    const step = () => {
      frame += 1;
      drawBlobBackground();
      drawComets();
      drawPixelDots();
      raf = requestAnimationFrame(step);
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduceMotion) {
      drawBlobBackground();
    } else {
      raf = requestAnimationFrame(step);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="button"
          tabIndex={0}
          aria-label="Skip intro"
          onClick={handleSkip}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleSkip();
            }
          }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: leaving ? 0 : 1, scale: leaving ? 1.04 : 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: fadeMs / 1000,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center bg-background outline-none"
        >
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

          <AnimatePresence>
            {showCounter && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 flex flex-col items-center gap-3"
              >
                <canvas
                  ref={counterCanvasRef}
                  width={44}
                  height={22}
                  style={{
                    width: 88,
                    height: 44,
                    imageRendering: "pixelated",
                  }}
                />
                <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">
                  Loading experience
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
