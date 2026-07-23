"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { createTimeline, stagger } from "animejs";
import TechnoBackground from "@/components/TechnoBackground";
import { useEntranceReveal } from "@/hooks/useEntranceReveal";
import { profile } from "@/data/content";

const headline = profile.tagline.split(" ");

export default function Hero() {
  const { ready, flash } = useEntranceReveal();
  const roleRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false);

  // Entrance sequence, built as a single anime.js timeline so the role
  // label, headline words (staggered), buttons, and scroll hint all play
  // as one continuous move instead of four independently-timed animations.
  useEffect(() => {
    if (!ready || playedRef.current) return;
    playedRef.current = true;

    const words = headlineRef.current?.querySelectorAll<HTMLElement>(".hero-word");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      if (roleRef.current) roleRef.current.style.opacity = "1";
      words?.forEach((w) => {
        w.style.transform = "translateY(0%)";
      });
      if (buttonsRef.current) buttonsRef.current.style.opacity = "1";
      if (scrollRef.current) scrollRef.current.style.opacity = "1";
      return;
    }

    const tl = createTimeline({ defaults: { ease: "outExpo" } });
    if (roleRef.current) {
      tl.add(roleRef.current, { opacity: [0, 1], translateY: [12, 0], duration: 600 }, 0);
    }
    if (words && words.length) {
      tl.add(
        words,
        { translateY: ["110%", "0%"], duration: 700, delay: stagger(80) },
        150
      );
    }
    if (buttonsRef.current) {
      tl.add(
        buttonsRef.current,
        { opacity: [0, 1], translateY: [16, 0], duration: 600 },
        700
      );
    }
    if (scrollRef.current) {
      tl.add(scrollRef.current, { opacity: [0, 1], duration: 900 }, 1200);
    }
  }, [ready]);

  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden px-6 md:px-10"
    >
      <TechnoBackground />

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

        <h1
          ref={headlineRef}
          className="text-[13vw] md:text-[6.5vw] leading-[0.95] font-bold tracking-tight"
        >
          {headline.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden mr-4 align-top">
              <span
                style={{ transform: "translateY(110%)" }}
                className={`hero-word inline-block ${
                  i === headline.length - 1 ? "gradient-text" : ""
                }`}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

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
