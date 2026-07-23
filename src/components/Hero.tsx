"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { createTimeline } from "animejs";
import { useEntranceReveal } from "@/hooks/useEntranceReveal";
import { profile } from "@/data/content";

const DOT_GAP_MS = "+=200";
const AFTER_DOTS_GAP_MS = "+=500";
const LINE_GAP_MS = "+=500";

export default function Hero() {
  const { ready, flash } = useEntranceReveal();
  const roleRef = useRef<HTMLParagraphElement>(null);
  const line1Ref = useRef<HTMLParagraphElement>(null);
  const heyRef = useRef<HTMLSpanElement>(null);
  const niceRef = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLParagraphElement>(null);
  const line3Ref = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false);

  // Entrance sequence as a single anime.js timeline: role label, then
  // "Hey" + its three dots (each with a 0.2s gap between them), a 0.5s
  // pause, then "Nice to meet you" on the same line, another 0.5s pause,
  // "Wanna see what I'm capable of?", another 0.5s pause, "Check out
  // below :)", then the buttons and scroll hint.
  useEffect(() => {
    if (!ready || playedRef.current) return;
    playedRef.current = true;

    const dots = line1Ref.current?.querySelectorAll<HTMLElement>(".hero-dot");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      [
        roleRef.current,
        heyRef.current,
        niceRef.current,
        line2Ref.current,
        line3Ref.current,
        buttonsRef.current,
        scrollRef.current,
      ].forEach((el) => {
        if (el) el.style.opacity = "1";
      });
      dots?.forEach((d) => {
        d.style.opacity = "1";
        d.style.transform = "scale(1)";
      });
      return;
    }

    const tl = createTimeline({ defaults: { ease: "outExpo" } });
    if (roleRef.current) {
      tl.add(roleRef.current, { opacity: [0, 1], translateY: [12, 0], duration: 500 });
    }
    if (heyRef.current) {
      tl.add(heyRef.current, { opacity: [0, 1], translateY: [20, 0], duration: 450 });
    }
    dots?.forEach((dot, i) => {
      tl.add(
        dot,
        { opacity: [0, 1], scale: [0, 1], duration: 150 },
        i === 0 ? undefined : DOT_GAP_MS
      );
    });
    if (niceRef.current) {
      tl.add(
        niceRef.current,
        { opacity: [0, 1], translateY: [20, 0], duration: 450 },
        AFTER_DOTS_GAP_MS
      );
    }
    if (line2Ref.current) {
      tl.add(
        line2Ref.current,
        { opacity: [0, 1], translateY: [24, 0], duration: 550 },
        LINE_GAP_MS
      );
    }
    if (line3Ref.current) {
      tl.add(
        line3Ref.current,
        { opacity: [0, 1], translateY: [24, 0], duration: 550 },
        LINE_GAP_MS
      );
    }
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

        <div className="flex flex-col gap-1 md:gap-2">
          <p
            ref={line1Ref}
            className="text-[9vw] sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
          >
            <span ref={heyRef} style={{ opacity: 0 }} className="inline-block">
              {profile.heroIntro.greeting}
            </span>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{ opacity: 0, transform: "scale(0)" }}
                className="hero-dot inline-block"
              >
                .
              </span>
            ))}
            <span ref={niceRef} style={{ opacity: 0 }} className="inline-block ml-3">
              {profile.heroIntro.greetingFollowup}
            </span>
          </p>

          <p
            ref={line2Ref}
            style={{ opacity: 0, transform: "translateY(24px)" }}
            className="text-[9vw] sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
          >
            {profile.heroIntro.lines[0]}
          </p>

          <p
            ref={line3Ref}
            style={{ opacity: 0, transform: "translateY(24px)" }}
            className="text-[9vw] sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] gradient-text"
          >
            {profile.heroIntro.lines[1]}
          </p>
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
