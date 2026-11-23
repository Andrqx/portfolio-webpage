import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import CaseStudyFeature from "@/components/work/CaseStudyFeature";
import ProjectArticle from "@/components/work/ProjectArticle";
import { BackLink, SectionHeading, labelClass } from "@/components/work/primitives";
import { experience, orgs, profile, projects } from "@/data/content";
import { basePath } from "@/lib/basePath";

export const dynamicParams = false;

export function generateStaticParams() {
  return orgs.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const org = orgs.find((o) => o.slug === slug);
  if (!org) return {};
  return { title: `${org.name} | ${profile.name}`, description: org.summary };
}

export default async function OrgPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const org = orgs.find((o) => o.slug === slug);
  if (!org) notFound();

  const roles = experience.filter((e) => e.org === org.name);
  const orgProjects = org.team ? projects.filter((p) => p.team === org.team) : [];
  // Projects with a write up get a big card under the header.
  const featured = orgProjects.flatMap((p) =>
    p.caseStudy ? [{ slug: p.slug, caseStudy: p.caseStudy, href: p.caseStudyHref ?? `/work/${p.slug}/` }] : [],
  );
  const [focusX, focusY] = org.imageFocus ?? [0.5, 0.5];

  return (
    <>
      <Header />
      <main className="flex-1 px-4 pb-32 pt-24 md:px-10 md:pt-32">
        <div className="mx-auto max-w-5xl">
          {/* the home page has an anchor per card, so this lands back on this one */}
          <BackLink href={`/#work-${org.slug}`}>All work</BackLink>

          <header className="mt-10 md:mt-14">
            <p className={labelClass}>{org.label}</p>
            <h1 className="mt-4 font-dot text-[clamp(2.75rem,10vw,9rem)] font-black uppercase leading-[0.85]">
              {org.name}
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-snug md:text-2xl">{org.summary}</p>
          </header>

          {/* right under the header so the write up is on the first screen */}
          {featured.map((f) => (
            <section
              key={f.slug}
              aria-labelledby={`case-study-label-${f.slug} case-study-${f.slug}`}
              className="mt-14 md:mt-20"
            >
              <SectionHeading id={`case-study-label-${f.slug}`}>Case study</SectionHeading>
              <CaseStudyFeature
                caseStudy={f.caseStudy}
                href={f.href}
                headingId={`case-study-${f.slug}`}
                className="mt-6"
              />
            </section>
          ))}
        </div>

        {org.image && (
          // capped at 80rem so the 1280 to 1600 px wide card photos are not blown up
          <div className="relative mx-auto mt-12 aspect-[4/3] max-h-[70vh] w-full max-w-7xl overflow-hidden border border-border bg-foreground/[0.03] sm:aspect-video md:mt-16 lg:aspect-[2/1]">
            <Image
              src={`${basePath}${org.image}`}
              alt=""
              fill
              sizes="(min-width: 1360px) 80rem, 100vw"
              loading="eager"
              className="object-cover"
              style={{ objectPosition: `${focusX * 100}% ${focusY * 100}%` }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-background/90 via-background/30 via-40% to-transparent"
            />
            {/* same shadow as .home-text-block, keeps the caption readable on light photos */}
            <p className="absolute inset-x-4 bottom-4 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/90 [text-shadow:0_1px_10px_rgba(0,0,0,0.9)] md:inset-x-6 md:bottom-6">
              {org.title} · {org.period}
            </p>
          </div>
        )}

        <div className="mx-auto max-w-5xl">
          {roles.length > 0 && (
            <section aria-labelledby="roles" className="mt-20 md:mt-28">
              <SectionHeading id="roles">Roles</SectionHeading>
              <ol className={`mt-6 grid gap-x-10 ${roles.length > 1 ? "md:grid-cols-2" : ""}`}>
                {roles.map((r) => (
                  <li key={`${r.role} ${r.period}`} className="border-t border-border py-8">
                    <p className={labelClass}>{r.period}</p>
                    <h3 className="mt-3 text-xl font-bold leading-tight md:text-2xl">{r.role}</h3>
                    <p className="mt-3 max-w-2xl leading-relaxed text-muted">{r.description}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {orgProjects.length > 0 && (
            <section aria-labelledby="projects" className="mt-20 md:mt-28">
              <SectionHeading id="projects">Projects</SectionHeading>
              <ol className="mt-6 border-b border-border">
                {orgProjects.map((p, i) => (
                  <li key={p.slug}>
                    <ProjectArticle project={p} index={i} />
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
