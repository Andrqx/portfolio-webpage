"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { projects } from "@/data/content";

export default function Projects() {
  return (
    <section id="work" className="py-32 px-6 md:px-10">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-4">
            02 / Work
          </p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Selected projects
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-px bg-border">
          {projects.map((project, i) => (
            <Reveal key={project.title} delay={i * 0.05}>
              <motion.a
                href={project.href}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group block bg-background p-8 md:p-10 h-full hover:bg-foreground/[0.03] transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <span className="font-mono text-xs text-muted shrink-0">
                    {project.year}
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
              </motion.a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
