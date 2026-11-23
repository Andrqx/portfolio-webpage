import HomeStage, { type HomeCard } from "@/components/home/HomeStage";
import { about, experience, hero, homeCopy, orgs, profile, scenes } from "@/data/content";
import { basePath } from "@/lib/basePath";

// Static files are referenced from a client component (the WebGL stage), so
// the basePath has to be applied here on the server and passed down.
const asset = (path?: string) => (path ? `${basePath}${path}` : null);

const ANCHOR = { bottom: 0, middle: 0.5, top: 1 } as const;

export default function Home() {
  const cards: HomeCard[] = orgs.map((org, i) => {
    const roles = experience.filter((e) => e.org === org.name);
    return {
      slug: org.slug,
      name: org.name,
      label: org.label,
      lines: roles.map((r) => `${r.role} · ${r.period}`),
      art: {
        index: String(i + 1).padStart(2, "0"),
        name: org.name,
        title: org.title,
        period: org.period,
        image: asset(org.image),
        focus: org.imageFocus ?? [0.5, 0.5],
        logo: asset(org.logo),
        showName: org.showName ?? true,
        tone: org.tone,
      },
    };
  });

  return (
    <HomeStage
      name={profile.name}
      year={new Date().getFullYear()}
      eyebrow={`${profile.role} · ${profile.school}`}
      tagline={hero.line}
      heroSide={hero.textSide ?? "left"}
      workHeading={homeCopy.workHeading}
      cards={cards}
      about={{ label: homeCopy.aboutLabel, lead: about[0] ?? "", body: about.slice(1) }}
      contact={{
        headline: homeCopy.contactHeadline,
        sub: homeCopy.contactSub,
        email: profile.email,
        links: profile.socials,
      }}
      media={{
        hero: asset(hero.figure),
        heroKey: [hero.keyLow, hero.keyHigh],
        heroFace: hero.face,
        heroFocus: hero.focus ?? [hero.face.x, 0.5],
        heroSpan: hero.span ?? [0, 1],
        about: asset(scenes.about),
        contact: asset(scenes.contact),
        contactAnchor: ANCHOR[scenes.contactAnchor],
      }}
    />
  );
}
