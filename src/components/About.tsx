import Reveal from "@/components/Reveal";
import { profile } from "@/data/content";

export default function About() {
  return (
    <section id="about" className="py-32 px-6 md:px-10">
      <div className="mx-auto max-w-6xl grid md:grid-cols-[1fr_2fr] gap-10 md:gap-20">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            01 / About
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-2xl md:text-4xl leading-tight tracking-tight">
            {profile.bio}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
