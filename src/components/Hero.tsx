"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { createTimeline } from "animejs";
import { useEntranceReveal } from "@/hooks/useEntranceReveal";
import { profile } from "@/data/content";

export default function Hero() {
  const { ready, flash } = useEntranceReveal();
  const roleRef = useRef<HTMLParagraphElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false);

  // Entrance sequence, built as a single anime.js timeline: the role
  // label plays first, then each hero line plays only once the previous
  // one has fully finished (default sequential timeline behavior — no
  // explicit position offsets needed), then buttons, then the scroll hint.
  useEffect(() => {
    if (!ready || playedRef.current) return;
    playedRef.current = true;

    const lines = linesRef.current?.querySelectorAll<HTMLElement>(".hero-line");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      if (roleRef.current) roleRef.current.style.opacity = "1";
      lines?.forEach((l) => {
        l.style.opacity = "1";
        l.style.transform = "translateY(0)";
      });
      if (buttonsRef.current) buttonsRef.current.style.opacity = "1";
      if (scrollRef.current) scrollRef.current.style.opacity = "1";
      return;
    }

    const tl = createTimeline({ defaults: { ease: "outExpo" } });
    if (roleRef.current) {
      tl.add(roleRef.current, { opacity: [0, 1], translateY: [12, 0], duration: 500 });
    }
    lines?.forEach((line) => {
      tl.add(line, { opacity: [0, 1], translateY: [24, 0], duration: 550 });
    });
    if (buttonsRef.current) {
      tl.add(buttonsRef.current, { opacity: [0, 1], translateY: [16, 0], duration: 500 });
    }
    if (scrollRef.current) {
      tl.add(scrollRef.current, { opacity: [0, 1], duration: 700 });
    }
  }, [ready]);

  return (
    <section
      id="top"
      className="relative min-h-[88svh] flex flex-col justify-center overflow-hidden px-6 md:px-10"
    >
      <div
        className={`relative z-10 mx-auto max-w-6xl w-full ${
          flash ? "animate-lightning-flash" : ""
        }`}
      >
        <p
          ref={roleRef}
          style={{ opacity: 0 }}
          className="font-mono text-xs md:text-sm uppercase tracking-[0.3em] text-muted mb-6"
        >
          {profile.role} — {profile.school}
        </p>

        <div ref={linesRef} className="flex flex-col gap-1 md:gap-2">
          {profile.heroLines.map((line, i) => (
            <p
              key={line}
              style={{ opacity: 0, transform: "translateY(24px)" }}
              className={`hero-line text-[9vw] sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] ${
                i === profile.heroLines.length - 1 ? "gradient-text" : ""
              }`}
            >
              {line}
            </p>
          ))}
        </div>

        <div
          ref={buttonsRef}
          style={{ opacity: 0 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#work"
            className="font-mono text-xs uppercase tracking-widest bg-foreground text-background rounded-full px-6 py-3 hover:opacity-90 transition-opacity"
          >
            View work
          </a>
          <a
            href="#contact"
            className="font-mono text-xs uppercase tracking-widest border border-border rounded-full px-6 py-3 hover:bg-foreground hover:text-background transition-colors"
          >
            Get in touch
          </a>
        </div>
      </div>

      <div
        ref={scrollRef}
        style={{ opacity: 0 }}
        className="absolute z-10 bottom-10 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted flex flex-col items-center gap-2"
      >
        <span>Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-muted"
        />
      </div>
    </section>
  );
}
