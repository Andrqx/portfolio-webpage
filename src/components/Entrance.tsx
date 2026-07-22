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

type Blob = {
  angle: number;
  angleSpeed: number;
  orbitX: number;
  orbitY: number;
  radius: number;
  rgb: RGB;
  phase: number;
};

type BurstDot = {
  // Unit-disk position — scaled up by the animating burst radius each frame.
  ux: number;
  uy: number;
  rgb: RGB;
  size: number;
  alpha: number;
};

const COUNT_MS = 2100;
const HOLD_MS = 200;
const BURST_MS = 1200;
const BURST_FADE_MS = 550;
const SKIP_FADE_MS = 500;
const BLOB_COUNT = 4;
const BURST_DOT_COUNT = 260;

/** Ease-out-cubic: a smooth, steady expand rather than an instant pop. */
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function Entrance({ onEnter }: { onEnter: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [percent, setPercent] = useState(0);
  const [showCounter, setShowCounter] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [fadeMs, setFadeMs] = useState(BURST_FADE_MS);
  const [visible, setVisible] = useState(true);
  const dismissedRef = useRef(false);
  const phaseRef = useRef<"counting" | "bursting">("counting");
  const burstStartRef = useRef(0);
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

  // Skip: fast-forward straight past both the counter and the burst.
  const handleSkip = () => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    clearTimers();
    setPercent(100);
    setShowCounter(false);
    setFadeMs(reduceMotion ? 150 : SKIP_FADE_MS);
    setLeaving(true);
    const t = window.setTimeout(finish, reduceMotion ? 150 : SKIP_FADE_MS);
    timersRef.current.push(t);
  };

  const beginBurst = () => {
    if (dismissedRef.current) return;
    phaseRef.current = "bursting";
    burstStartRef.current = performance.now();
    setShowCounter(false);

    const fadeDelay = Math.max(BURST_MS - BURST_FADE_MS, 0);
    const t1 = window.setTimeout(() => {
      if (dismissedRef.current) return;
      setFadeMs(BURST_FADE_MS);
      setLeaving(true);
    }, fadeDelay);
    const t2 = window.setTimeout(() => {
      if (dismissedRef.current) return;
      dismissedRef.current = true;
      finish();
    }, BURST_MS);
    timersRef.current.push(t1, t2);
  };

  // Counts up to 100, holds briefly, then hands off to the burst.
  useEffect(() => {
    if (reduceMotion) {
      const t = window.setTimeout(() => {
        if (dismissedRef.current) return;
        dismissedRef.current = true;
        setPercent(100);
        setShowCounter(false);
        setFadeMs(150);
        setLeaving(true);
        window.setTimeout(finish, 150);
      }, 300);
      timersRef.current.push(t);
      return () => clearTimers();
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / COUNT_MS, 1);
      const eased = 1 - Math.pow(1 - t, 2);
      setPercent(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        const holdTimer = window.setTimeout(beginBurst, HOLD_MS);
        timersRef.current.push(holdTimer);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- beginBurst is stable for the component's lifetime
  }, [reduceMotion]);

  // Canvas: drifting gradient-blob background while counting, then a small
  // cluster of glowy dots (matching the hero's particle style) that expands
  // to cover the screen, handing off into the real hero background.
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

    let blobs: Blob[] = [];
    let burstDots: BurstDot[] = [];
    let burstMaxRadius = 0;

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

    const makeBurstDots = () => {
      burstMaxRadius = Math.hypot(width, height) * 0.62;
      burstDots = Array.from({ length: BURST_DOT_COUNT }, () => {
        // Uniform distribution across a unit disk.
        const r = Math.sqrt(Math.random());
        const theta = Math.random() * Math.PI * 2;
        return {
          ux: Math.cos(theta) * r,
          uy: Math.sin(theta) * r,
          rgb: sampleRamp(colors, Math.random()),
          size: 1.3 + Math.random() * 2.2,
          alpha: 0.45 + Math.random() * 0.45,
        };
      });
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
      makeBurstDots();
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

    const drawBurst = () => {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const elapsed = performance.now() - burstStartRef.current;
      const t = Math.min(elapsed / BURST_MS, 1);
      const eased = easeOutCubic(t);
      const currentRadius = 4 + eased * burstMaxRadius;
      const rotation = eased * 0.5;
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);
      const sizeScale = 1 + eased * 1.4;

      ctx.shadowBlur = 8;
      for (const d of burstDots) {
        const rx = d.ux * cos - d.uy * sin;
        const ry = d.ux * sin + d.uy * cos;
        const x = cx + rx * currentRadius;
        const y = cy + ry * currentRadius;
        const [r, g, b] = d.rgb;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${d.alpha})`;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${d.alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, d.size * sizeScale, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    const step = () => {
      frame += 1;
      if (phaseRef.current === "counting") {
        drawBlobBackground();
      } else {
        drawBurst();
      }
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
          initial={{ opacity: 1 }}
          animate={{ opacity: leaving ? 0 : 1 }}
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
                className="relative z-10 flex flex-col items-center gap-2"
              >
                <span className="font-mono text-2xl md:text-3xl font-medium tabular-nums tracking-tight text-foreground">
                  {percent}%
                </span>
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
