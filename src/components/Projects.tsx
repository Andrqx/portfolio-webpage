"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { projects, teams } from "@/data/content";

const MotionLink = motion(Link);

export default function Projects() {
  const [activeTeam, setActiveTeam] = useState(teams[0].key);
  const activeProjects = projects.filter((p) => p.team === activeTeam);

  return (
    <section id="work" className="pt-16 pb-16 px-6 md:px-10">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-4">
            02 / Work
          </p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Projects + Work
          </h2>
        </Reveal>

        <Reveal delay={0.05} className="mb-12">
          <div className="flex flex-wrap gap-4">
            {teams.map((team) => {
              const active = team.key === activeTeam;
              return (
                <motion.button
                  key={team.key}
                  type="button"
                  onClick={() => setActiveTeam(team.key)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  style={
                    active
                      ? {
                          background:
                            "linear-gradient(100deg, var(--accent), var(--accent-2), var(--accent-3))",
                          boxShadow:
                            "0 0 28px rgba(255,46,99,0.5), 0 0 52px rgba(162,75,255,0.3)",
                        }
                      : undefined
                  }
                  className={`font-mono text-xs md:text-sm uppercase tracking-widest rounded-full px-6 py-3 border-2 transition-colors ${
                    active
                      ? "border-transparent text-white font-bold"
                      : "border-border text-muted hover:text-foreground hover:border-accent/60"
                  }`}
                >
                  {team.label}
                </motion.button>
              );
            })}
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTeam}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="grid md:grid-cols-2 gap-px bg-border"
          >
            {activeProjects.map((project) => (
              <MotionLink
                key={project.slug}
                href={`/work/${project.slug}`}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group block bg-background p-8 md:p-10 h-full hover:bg-foreground/[0.03] transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <span className="font-mono text-xs text-muted shrink-0">
                    {project.period}
                  </span>
                </div>
                <p className="text-muted leading-relaxed mb-6">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] uppercase tracking-widest border border-border rounded-full px-3 py-1 text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </MotionLink>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
