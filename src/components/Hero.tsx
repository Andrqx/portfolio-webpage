"use client";

import { motion } from "framer-motion";
import TechnoBackground from "@/components/TechnoBackground";
import { useEntranceReveal } from "@/hooks/useEntranceReveal";
import { profile } from "@/data/content";

const headline = profile.tagline.split(" ");

export default function Hero() {
  const { ready, flash } = useEntranceReveal();

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
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.6 }}
          className="font-mono text-xs md:text-sm uppercase tracking-[0.3em] text-muted mb-6"
        >
          {profile.role} — {profile.location}
        </motion.p>

        <h1 className="text-[13vw] md:text-[6.5vw] leading-[0.95] font-bold tracking-tight">
          {headline.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden mr-4 align-top">
              <motion.span
                initial={{ y: "110%" }}
                animate={ready ? { y: "0%" } : { y: "110%" }}
                transition={{
                  duration: 0.7,
                  delay: 0.15 + i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`inline-block ${
                  i === headline.length - 1 ? "gradient-text" : ""
                }`}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.6, delay: 0.7 }}
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
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute z-10 bottom-10 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted flex flex-col items-center gap-2"
      >
        <span>Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-muted"
        />
      </motion.div>
    </section>
  );
}
