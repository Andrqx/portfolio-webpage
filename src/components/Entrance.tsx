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

type ZoomDot = {
  // True scattered position across the full canvas.
  tx: number;
  ty: number;
  rgb: RGB;
  size: number;
  alpha: number;
};

const COUNT_MS = 2100;
const HOLD_MS = 200;
const ZOOM_MS = 1400;
const ZOOM_FADE_MS = 650;
const SKIP_FADE_MS = 500;
const BLOB_COUNT = 4;
const ZOOM_DOT_COUNT = 340;
const ZOOM_START_SCALE = 3.4;

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
  const [fadeMs, setFadeMs] = useState(ZOOM_FADE_MS);
  const [visible, setVisible] = useState(true);
  const dismissedRef = useRef(false);
  const phaseRef = useRef<"counting" | "zoom">("counting");
  const zoomStartRef = useRef(0);
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

  const beginZoom = () => {
    if (dismissedRef.current) return;
    phaseRef.current = "zoom";
    zoomStartRef.current = performance.now();
    setShowCounter(false);

    const fadeDelay = Math.max(ZOOM_MS - ZOOM_FADE_MS, 0);
    const t1 = window.setTimeout(() => {
      if (dismissedRef.current) return;
      setFadeMs(ZOOM_FADE_MS);
      setLeaving(true);
    }, fadeDelay);
    const t2 = window.setTimeout(() => {
      if (dismissedRef.current) return;
      dismissedRef.current = true;
      finish();
    }, ZOOM_MS);
    timersRef.current.push(t1, t2);
  };

  // Counts up to 100, holds briefly, then hands off to the zoom-out reveal.
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
        const holdTimer = window.setTimeout(beginZoom, HOLD_MS);
        timersRef.current.push(holdTimer);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- beginZoom is stable for the component's lifetime
  }, [reduceMotion]);

  // Pixelated counter: render the percentage onto a tiny low-res canvas and
  // let the browser upscale it with hard edges (no manual pixel math needed).
  useEffect(() => {
    const c = counterCanvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#f2f1ec";
    ctx.font = "700 11px ui-monospace, 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${percent}%`, c.width / 2, c.height / 2 + 1);
  }, [percent]);

  // Canvas: drifting gradient-blob background while counting, then a field
  // of glowy dots (matching the hero's particle style) scattered across the
  // whole screen that zooms out from a magnified view to its true scale,
  // handing off into the real hero background as it settles.
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
    let zoomDots: ZoomDot[] = [];

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

    const makeZoomDots = () => {
      // Scattered across the whole canvas — the zoom animation reveals
      // them by pulling back from a magnified view of just the center.
      zoomDots = Array.from({ length: ZOOM_DOT_COUNT }, () => ({
        tx: Math.random() * width,
        ty: Math.random() * height,
        rgb: sampleRamp(colors, Math.random()),
        size: 1.2 + Math.random() * 2,
        alpha: 0.45 + Math.random() * 0.45,
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
      makeZoomDots();
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

    const drawZoom = () => {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const elapsed = performance.now() - zoomStartRef.current;
      const t = Math.min(elapsed / ZOOM_MS, 1);
      const eased = easeOutCubic(t);
      // Camera-style zoom: scale starts high (magnified, only a few dots
      // near center are on-screen and look big) and eases down to 1
      // (true positions/sizes), pulling back to reveal the full field.
      const scale = ZOOM_START_SCALE - eased * (ZOOM_START_SCALE - 1);

      ctx.shadowBlur = 6;
      for (const d of zoomDots) {
        const x = cx + (d.tx - cx) * scale;
        const y = cy + (d.ty - cy) * scale;
        if (x < -20 || x > width + 20 || y < -20 || y > height + 20) continue;
        const [r, g, b] = d.rgb;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${d.alpha})`;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${d.alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, d.size * scale, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    const step = () => {
      frame += 1;
      if (phaseRef.current === "counting") {
        drawBlobBackground();
      } else {
        drawZoom();
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
