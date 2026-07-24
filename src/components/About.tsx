import Image from "next/image";
import Reveal from "@/components/Reveal";
import { profile } from "@/data/content";
import { basePath } from "@/lib/basePath";

export default function About() {
  return (
    <section id="about" className="pt-20 pb-16 px-6 md:px-10">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-6">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            01 / About
          </p>
        </Reveal>
        <div className="grid md:grid-cols-[3fr_4fr] gap-10 md:gap-20 items-center">
          <Reveal delay={0.1}>
            <div className="relative w-full aspect-[2/1] overflow-hidden rounded-lg border border-border">
              <Image
                src={`${basePath}/images/fsae-team.jpg`}
                alt="Andrew with the Mac Formula Electric team and car"
                fill
                sizes="(min-width: 768px) 43vw, 100vw"
                className="object-cover scale-125"
              />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-base md:text-lg lg:text-xl leading-snug tracking-tight">
              {profile.bio}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
