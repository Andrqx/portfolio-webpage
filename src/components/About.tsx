import Image from "next/image";
import Reveal from "@/components/Reveal";
import { profile } from "@/data/content";
import { basePath } from "@/lib/basePath";

export default function About() {
  return (
    <section id="about" className="pt-20 pb-16 px-6 md:px-10">
      <div className="mx-auto max-w-6xl grid md:grid-cols-[1fr_2fr] gap-10 md:gap-20">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            01 / About
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex flex-col sm:flex-row gap-8 items-stretch">
            <div className="relative w-full aspect-[4/3] sm:aspect-auto sm:w-80 md:w-[26rem] shrink-0 overflow-hidden rounded-lg border border-border">
              <Image
                src={`${basePath}/images/fsae-team.jpg`}
                alt="Andrew with the Mac Formula Electric team and car"
                fill
                sizes="(min-width: 768px) 26rem, (min-width: 640px) 20rem, 100vw"
                className="object-cover"
              />
            </div>
            <p className="text-xl md:text-2xl lg:text-3xl leading-tight tracking-tight">
              {profile.bio}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
