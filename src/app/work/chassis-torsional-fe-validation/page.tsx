import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { profile, teams } from "@/data/content";
import { basePath } from "@/lib/basePath";

export const metadata: Metadata = {
  title: `Chassis Layup Design & Torsional FE Validation | ${profile.name}`,
  description:
    "How the FSAE chassis skin layup went from C5 to C9 against the SES, and how the Ansys ACP torsional stiffness model compares to physical rig testing.",
};

function Figure({
  label,
  caption,
  aspect = "aspect-video",
  src,
  fit = "cover",
}: {
  label: string;
  caption: ReactNode;
  aspect?: string;
  src?: string;
  fit?: "cover" | "contain";
}) {
  return (
    <figure className="min-w-0">
      <div
        className={`relative w-full ${aspect} overflow-hidden rounded-lg bg-foreground/[0.03] ${
          src
            ? "border border-border"
            : "border border-dashed border-border flex items-center justify-center px-6 text-center"
        }`}
      >
        {src ? (
          <Image
            src={`${basePath}${src}`}
            alt={label}
            fill
            sizes="(min-width: 768px) 24rem, 100vw"
            className={fit === "contain" ? "object-contain" : "object-cover"}
          />
        ) : (
          <span className="font-mono text-xs uppercase tracking-widest text-muted">
            Figure placeholder: {label}
          </span>
        )}
      </div>
      <figcaption className="mt-3 text-sm text-muted leading-relaxed">
        {caption}
      </figcaption>
    </figure>
  );
}

function FigureRow({
  cols = 2,
  children,
}: {
  cols?: 1 | 2;
  children: ReactNode;
}) {
  return (
    <div className={`my-8 grid gap-6 ${cols === 2 ? "sm:grid-cols-2" : ""}`}>
      {children}
    </div>
  );
}

export default function ChassisFEValidationPage() {
  const team = teams.find((t) => t.key === "FSAE");

  return (
    <>
      <Nav />
      <main className="pt-40 pb-32 px-6 md:px-10">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/#work"
            className="font-mono text-xs uppercase tracking-widest text-muted hover:text-foreground transition-colors"
          >
            ← Back to work
          </Link>

          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mt-8 mb-4">
            {team?.org} · Chassis Skin (C9)
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-10">
            Chassis Layup Design &amp; Torsional FE Validation
          </h1>

          <div className="flex flex-wrap gap-2 mb-16">
            {["Ansys ACP", "Ansys FEA", "Composite Design"].map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] uppercase tracking-widest border border-border rounded-full px-3 py-1 text-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          <section>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-4">
              01 / Constraints
            </p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
              What the chassis actually has to survive
            </h2>
            <div className="space-y-6">
              <p className="text-lg text-muted leading-relaxed">
                FSAE doesn&apos;t set a hard torsional stiffness number to
                hit. Stiffness is a design points criterion, not a safety
                requirement. The real safety gate is the SES (Structural
                Equivalency Sheet). It benchmarks composite panels against a
                steel tube baseline instead of an absolute strength value.
                Side impact, for example, has to equal or beat three 1&quot;
                OD steel tubes (0.095&quot; wall, 1020 mild steel) under the
                same load.
              </p>
              <p className="text-lg text-muted leading-relaxed">
                Qualifying a panel means building it, testing it (3 point
                bend, then puncture/shear), and uploading the
                force displacement data to the SES tool. It checks each zone
                against its steel tube equivalent requirement.
              </p>
              <FigureRow>
                <Figure
                  src="/images/three-point-bend-test.jpg"
                  label="3 point bend test rig"
                  caption="The MTS Criterion rig set up for 3 point bend qualification testing."
                />
                <Figure
                  src="/images/three-point-bend-force-displacement.png"
                  label="3 point bend force displacement data"
                  fit="contain"
                  caption="Force displacement curve from the 3 point bend test, with the linear fit and max load marked."
                />
                <Figure
                  src="/images/puncture-shear-test.jpg"
                  label="Puncture/shear test rig"
                  caption="Perimeter shear setup, the second qualification test that runs alongside it."
                />
                <Figure
                  src="/images/puncture-shear-force-displacement.png"
                  label="Puncture/shear force displacement data"
                  fit="contain"
                  caption="Force displacement curve from the puncture/shear test, with the first peak marked."
                />
              </FigureRow>
              <p className="text-lg text-muted leading-relaxed">
                Two rules shaped how much design freedom that left. Layer
                count can be doubled to claim double the tested properties,
                no retest needed. Foam core thickness can be scaled ±50% off
                the tested thickness, also no retest. So development could
                focus on one efficient baseline layup and scale it, instead
                of testing every configuration on the car.
              </p>
            </div>
          </section>

          <section className="mt-16">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-4">
              02 / Design Iteration
            </p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
              From C5 to C9
            </h2>
            <div className="space-y-6">
              <p className="text-lg text-muted leading-relaxed">
                C9 is a 4 layer quasi isotropic layup over foam core: 45°
                biaxial twill, 0° UD, 90° UD, then a combined 0/90 UD layer.
                It&apos;s the fourth iteration on this chassis skin, and it
                matches or beats the previous baseline, C5, at roughly 20%
                less weight, in one fewer layer.
              </p>
              <p className="text-lg text-muted leading-relaxed">
                C5 ran five layers (45° biaxial twill, 0° UD, 45° twill, 90°
                UD, 45° twill), weighted heavily toward 45°, which
                contributes less to torsional stiffness than 0°/90°. That
                mattered because the team&apos;s 3 point bend rig is
                0° biased, so a twill heavy layup underperforms on the exact
                test used to qualify it. C6, C7, and C8 were tested the
                following summer. All three were rejected: none matched or
                beat C5.
              </p>
              <FigureRow>
                <Figure
                  src="/images/chassis-outer-skin-layup.jpg"
                  label="Outer skin carbon in the mold"
                  aspect="aspect-[4/3]"
                  caption="Outer skin carbon laid dry into the mold. These plies go down first."
                />
                <Figure
                  src="/images/chassis-dry-layup-mold.jpg"
                  label="Foam core laid over the skin plies"
                  aspect="aspect-[4/3]"
                  caption="H80 PVC foam core going in next, on top of those plies. Still dry at this point, before infusion."
                />
              </FigureRow>
              <p className="text-lg text-muted leading-relaxed">
                C9 clears the SES while weighted more toward 0°, where the
                bend test actually loads it. Higher load zones like side
                impact use &quot;double C9,&quot; the same stack doubled to
                eight layers under the no retest rule, instead of a
                separately qualified layup.
              </p>
              <FigureRow cols={1}>
                <Figure
                  src="/images/layup-schedule.png"
                  label="Monocoque layup schedule"
                  fit="contain"
                  caption="Every layup used across the monocoque. C9 is the baseline, C9 x2 is the same stack doubled, and the coloured headers key into the zone map below."
                />
              </FigureRow>
              <FigureRow>
                <Figure
                  src="/images/layup-zone-map.png"
                  label="Chassis layup zone map"
                  fit="contain"
                  caption="Chassis coloured by layup zone, matching the schedule headers. Most of the tub runs C9 x2, with C9N, C9 x3, and H2 x2 zones called out separately."
                />
                <Figure
                  src="/images/c9-quasi-isotropic-distribution.png"
                  label="C9 quasi isotropic modulus and UTS distribution"
                  fit="contain"
                  caption="Estimated skin modulus and UTS by direction, showing how close to isotropic C9 actually is."
                />
              </FigureRow>
            </div>
          </section>

          <section className="mt-16">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-4">
              03 / FE Model
            </p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
              Modeling it in Ansys ACP
            </h2>
            <div className="space-y-6">
              <p className="text-lg text-muted leading-relaxed">
                The chassis is modeled in Ansys ACP (Composite PrepPost) as
                one continuous layered shell. Plies build inward from the
                outer surface, no solid elements. It&apos;s zoned by actual
                layup: skin only regions, single C9, double C9, 1&quot; foam
                core, 0.5&quot; foam core, and so on.
              </p>
              <FigureRow>
                <Figure
                  src="/images/acp-setup.png"
                  label="Ansys ACP element wise thickness"
                  fit="contain"
                  caption="Element wise laminate thickness in Ansys ACP, showing how the zoning varies across the chassis."
                />
                <Figure
                  src="/images/boundary-conditions.png"
                  label="Torsional load case boundary conditions"
                  fit="contain"
                  caption="Remote forces of 2000 N at the front pickups in opposite directions, rear suspension mounts fixed."
                />
              </FigureRow>
              <p className="text-lg text-muted leading-relaxed">
                The geometry itself is a simplified version of the chassis.
                Hardpoints, inserts, and mounting hardware are left out
                entirely, and zone boundaries are merged into continuous
                shell edges with no overlap geometry or discrete bonded
                joints. That&apos;s a simplification of the model, not a
                design decision. The real chassis has overlapping dry carbon
                at every joint and hardpoints at every suspension and
                harness mount, and none of that is in here.
              </p>
              <p className="text-lg text-muted leading-relaxed">
                Material properties come from the team&apos;s own coupon
                testing, not Ansys&apos; default carbon library: tensile
                tests on biaxial and unidirectional coupons at 0°, 45°, and
                90°, five per direction, averaged into modulus, shear
                modulus, and Poisson&apos;s ratio, strain gauge validated
                along the way. That number is a mean, not a
                knockdown derated property. No fiber volume fraction or
                void content adjustment has been applied yet. The coupons
                were made under close to ideal conditions (small,
                vacuum infused, smooth glass tooling). The full chassis is
                vacuum infused at a much larger scale and doesn&apos;t hit
                the same infusion quality. Microscopy of the coupon
                cross sections shows voids even under those ideal
                conditions, the visual version of that gap.
              </p>
              <FigureRow>
                <Figure
                  src="/images/coupon-glass-tooling-infusion.jpg"
                  label="Coupon vacuum infusion on glass tooling"
                  aspect="aspect-[4/3]"
                  caption="Coupons vacuum infused on smooth glass tooling, the near ideal conditions referenced above."
                />
                <Figure
                  src="/images/coupon-microscope-voids.png"
                  label="Microscope image, voids in coupon cross section"
                  aspect="aspect-[4/3]"
                  fit="contain"
                  caption="Coupon cross section at 20 µm scale, showing voids even under near ideal, small scale infusion."
                />
              </FigureRow>
              <p className="text-lg text-muted leading-relaxed">
                The load case applies a 2000 N remote force at the front
                suspension pickups, up on one side and down on the other,
                forming a torsional couple. The rear suspension mounts stay
                fully fixed, everything else is free.
                It mirrors the physical torsion rig exactly, built and
                tested a year earlier by the capstone team, who also ran the
                coupon testing. The mesh is capped at 32,000 elements, the
                ceiling of the Ansys student license, not a
                convergence driven choice. No mesh convergence study has
                been run yet.
              </p>
            </div>
          </section>

          <section className="mt-16">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-4">
              04 / Results
            </p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
              Simulated vs. measured
            </h2>
            <div className="space-y-6">
              <p className="text-lg text-muted leading-relaxed">
                Simulated torsional stiffness came out to 4500 N·m/deg. The
                physical rig measured 3900 N·m/deg. That&apos;s about a
                15.4% overprediction relative to measured (13.3% relative
                to simulated). Sim stiffer than real is the direction FE
                torsion models usually miss in: shell models tend to leave
                out compliance sources the real structure has.
              </p>
              <FigureRow>
                <Figure
                  src="/images/physical-torsional-stiffness-rig.jpg"
                  label="Physical torsion rig"
                  caption="The physical torsion rig used to measure chassis stiffness, built and tested by the capstone team."
                />
                <Figure
                  label="Predicted vs. actual torsional stiffness"
                  caption="Simulated (4500 N·m/deg) vs. measured (3900 N·m/deg) torsional stiffness."
                />
              </FigureRow>
              <FigureRow>
                <Figure
                  src="/images/fe-deflection-animation.gif"
                  label="FE Y axis deflection under torsional load"
                  fit="contain"
                  caption="Simulated directional deformation under the torsional couple at the front pickups."
                />
                <Figure
                  src="/images/fe-stress-animation.gif"
                  label="FE equivalent stress under torsional load"
                  fit="contain"
                  caption="Simulated equivalent (von Mises) stress under the same torsional load case."
                />
              </FigureRow>
              <p className="text-lg text-muted leading-relaxed">
                Four things likely contribute to that gap. None of them has
                been isolated or quantified: the coupon to part knockdown gap
                above (plus build variability from a multi person layup
                process), the unmodeled joint overlap, unmodeled
                bonded joint compliance at bulkheads and pickups, and the
                uncertain effect of the 32k element mesh cap. My guess is
                the build quality gap and the two joint related sources
                matter most, but that&apos;s a guess, not something
                I&apos;ve proven.
              </p>
            </div>
          </section>

          <section className="mt-16">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-4">
              05 / Next Steps
            </p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
              What I&apos;d change
            </h2>
            <div className="space-y-6">
              <p className="text-lg text-muted leading-relaxed">
                Four things would tighten this up. A mesh convergence study,
                to check whether the 32k element result is actually
                converged and not just license limited. A measured knockdown
                factor on the coupon properties, ideally backed by a
                fiber volume fraction or void content measurement on
                chassis representative panels instead of small coupons.
                Explicit modeling of joint overlap, hardpoints, and
                bonded joint compliance instead of merged shell edges.
                Longer term, isolating the four error sources individually
                instead of lumping them together, to see which one actually
                dominates.
              </p>
            </div>
          </section>

          <section className="mt-20 pt-10 border-t border-border">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-4">
              Still needed to finish this page
            </p>
            <ul className="space-y-2 text-muted list-disc list-inside">
              <li>Predicted vs actual stiffness comparison chart</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
