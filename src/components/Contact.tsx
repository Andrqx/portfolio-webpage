"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { profile } from "@/data/content";

export default function Contact() {
  return (
    <section id="contact" className="py-32 px-6 md:px-10">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-4">
            04 / Contact
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <motion.a
            href={`mailto:${profile.email}`}
            data-cursor-hover
            whileHover={{ letterSpacing: "0.01em" }}
            className="block text-[10vw] md:text-[5.5vw] leading-none font-bold tracking-tight gradient-text mb-12"
          >
            Let&apos;s build<br />something great.
          </motion.a>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="flex flex-wrap gap-x-10 gap-y-4 font-mono text-sm uppercase tracking-widest text-muted">
            <a href={`mailto:${profile.email}`} data-cursor-hover className="hover:text-foreground transition-colors">
              {profile.email}
            </a>
            {profile.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                className="hover:text-foreground transition-colors"
              >
                {social.label}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
