import Reveal from "@/components/Reveal";
import { experience } from "@/data/content";

export default function Experience() {
  return (
    <section id="experience" className="pt-32 pb-16 px-6 md:px-10">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-4">
            03 / Experience
          </p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Where I&apos;ve been
          </h2>
        </Reveal>

        <div className="divide-y divide-border border-t border-b border-border">
          {experience.map((item, i) => (
            <Reveal key={item.role + item.org} delay={i * 0.05}>
              <div className="grid md:grid-cols-[1fr_1fr_2fr] gap-2 md:gap-8 py-8 items-baseline">
                <span className="font-mono text-xs uppercase tracking-widest text-muted">
                  {item.period}
                </span>
                <div>
                  <h3 className="text-xl font-bold tracking-tight">{item.role}</h3>
                  <p className="text-muted text-sm">{item.org}</p>
                </div>
                <p className="text-muted leading-relaxed">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
