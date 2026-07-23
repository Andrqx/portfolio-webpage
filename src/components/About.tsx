import Image from "next/image";
import Reveal from "@/components/Reveal";
import { profile } from "@/data/content";
import { basePath } from "@/lib/basePath";

export default function About() {
  return (
    <section id="about" className="pt-20 pb-32 px-6 md:px-10">
      <div className="mx-auto max-w-6xl grid md:grid-cols-[1fr_2fr] gap-10 md:gap-20">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            01 / About
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <div className="relative w-full sm:w-64 md:w-72 aspect-[4/3] shrink-0 overflow-hidden rounded-lg border border-border">
              <Image
                src={`${basePath}/images/fsae-team.jpg`}
                alt="Andrew with the Mac Formula Electric team and car"
                fill
                sizes="(min-width: 640px) 18rem, 100vw"
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
