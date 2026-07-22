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

type PixelDot = {
  // True scattered position across the full canvas — no zoom/magnification,
  // so every dot is always within bounds and nothing pops in from off-screen.
  x: number;
  y: number;
  rgb: RGB;
  size: number;
  alpha: number;
  appearAt: number;
  growMs: number;
};

const COUNT_MS = 2100;
const HOLD_MS = 200;
const PIXEL_MS = 2200;
const PIXEL_FADE_MS = 900;
const SKIP_FADE_MS = 500;
const BLOB_COUNT = 4;
const PIXEL_DOT_COUNT = 340;
const PIXEL_STAGGER_MS = 700;
const PIXEL_GROW_MIN_MS = 250;
const PIXEL_GROW_MAX_MS = 450;

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
  const [fadeMs, setFadeMs] = useState(PIXEL_FADE_MS);
  const [visible, setVisible] = useState(true);
  const dismissedRef = useRef(false);
  const phaseRef = useRef<"counting" | "pixels">("counting");
  const pixelStartRef = useRef(0);
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

  const beginPixels = () => {
    if (dismissedRef.current) return;
    phaseRef.current = "pixels";
    pixelStartRef.current = performance.now();
    setShowCounter(false);

    const fadeDelay = Math.max(PIXEL_MS - PIXEL_FADE_MS, 0);
    const t1 = window.setTimeout(() => {
      if (dismissedRef.current) return;
      setFadeMs(PIXEL_FADE_MS);
      setLeaving(true);
    }, fadeDelay);
    const t2 = window.setTimeout(() => {
      if (dismissedRef.current) return;
      dismissedRef.current = true;
      finish();
    }, PIXEL_MS);
    timersRef.current.push(t1, t2);
  };

  // Counts up to 100, holds briefly, then hands off to the pixel reveal.
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
        const holdTimer = window.setTimeout(beginPixels, HOLD_MS);
        timersRef.current.push(holdTimer);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- beginPixels is stable for the component's lifetime
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

  // Canvas: the drifting gradient-blob background runs continuously for the
  // whole entrance (never cuts), so there's no hard switch between phases.
  // Once the pixel phase begins, a field of glowy dots (matching the hero's
  // particle style) fades in on top of it, each at its true final position
  // with its own staggered delay — pixels appear throughout the screen
  // rather than emanating from one point — before the whole layer dissolves
  // into the real hero background.
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
    let pixelDots: PixelDot[] = [];

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
      // Scattered at their true final position across the whole canvas —
      // each one fades/grows in on its own schedule, so they appear
      // throughout the screen rather than emerging from a single point.
      pixelDots = Array.from({ length: PIXEL_DOT_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        rgb: sampleRamp(colors, Math.random()),
        size: 1.2 + Math.random() * 2,
        alpha: 0.45 + Math.random() * 0.45,
        appearAt: Math.random() * PIXEL_STAGGER_MS,
        growMs:
          PIXEL_GROW_MIN_MS + Math.random() * (PIXEL_GROW_MAX_MS - PIXEL_GROW_MIN_MS),
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
      const elapsed = performance.now() - pixelStartRef.current;

      ctx.shadowBlur = 6;
      for (const d of pixelDots) {
        const local = elapsed - d.appearAt;
        if (local <= 0) continue;
        const t = Math.min(local / d.growMs, 1);
        const eased = easeOutCubic(t);
        if (eased <= 0) continue;

        const [r, g, b] = d.rgb;
        const alpha = d.alpha * eased;
        const size = d.size * (0.3 + 0.7 * eased);
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    const step = () => {
      frame += 1;
      // The blob background never stops — pixels simply fade in on top of
      // it, so there's no hard cut between the two phases.
      drawBlobBackground();
      if (phaseRef.current === "pixels") {
        drawPixelDots();
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
