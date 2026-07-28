import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { profile, teams } from "@/data/content";

export const metadata: Metadata = {
  title: `Chassis Layup Design & Torsional FE Validation — ${profile.name}`,
  description:
    "How the FSAE chassis skin layup (C5 → C9) was developed against the SES, and how the Ansys ACP torsional stiffness model compares to physical rig testing.",
};

function Figure({
  label,
  caption,
  aspect = "aspect-video",
}: {
  label: string;
  caption: ReactNode;
  aspect?: string;
}) {
  return (
    <figure className="my-8">
      <div
        className={`relative w-full ${aspect} rounded-lg border border-dashed border-border bg-foreground/[0.03] flex items-center justify-center px-6 text-center`}
      >
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          Figure placeholder: {label}
        </span>
      </div>
      <figcaption className="mt-3 text-sm text-muted leading-relaxed">
        {caption}
      </figcaption>
    </figure>
  );
}

function Todo({ children }: { children: ReactNode }) {
  return <span className="font-mono text-sm text-accent">{children}</span>;
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
            {team?.org} — Chassis Skin (C9)
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
                FSAE doesn&apos;t set a hard torsional-stiffness number to
                hit. Stiffness is a design-points criterion, not a safety
                requirement. The real safety gate is the SES (Structural
                Equivalency Sheet), which benchmarks composite panels against
                a steel-tube baseline instead of an absolute strength value.
                Side impact, for example, has to equal or beat three 1&quot;
                OD steel tubes (0.095&quot; wall, 1020 mild steel) under the
                same load.
              </p>
              <p className="text-lg text-muted leading-relaxed">
                Qualifying a panel means building it, running a 3-point bend
                test and a puncture/shear test, then uploading the
                force-displacement data to the SES tool, which checks each
                zone against its steel-tube-equivalent requirement.
              </p>
              <Figure
                label="Force-displacement plot, SES qualification testing"
                caption="Force-displacement data from the 3-point bend and puncture/shear tests used to qualify a panel against its SES steel-tube-equivalent requirement."
              />
              <p className="text-lg text-muted leading-relaxed">
                Two rules shaped how much design freedom that left. Layer
                count can be doubled to claim double the tested properties
                without retesting, and foam core thickness can be scaled
                ±50% without retesting. So development could focus on one
                efficient baseline layup and scale it, instead of testing
                every configuration on the car.
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
                The current chassis skin, C9, is the fourth iteration since
                the previous baseline, C5. C5 ran five layers (45° biaxial
                twill, 0° UD, 45° twill, 90° UD, 45° twill), weighted heavily
                toward 45°, which contributes less to torsional stiffness
                than 0°/90°. That mattered because the team&apos;s 3-point
                bend rig is 0°-biased, so a twill-heavy layup underperforms on
                the exact test used to qualify it. C6, C7, and C8 were tested
                the following summer and all rejected: none matched or beat
                C5.
              </p>
              <p className="text-lg text-muted leading-relaxed">
                C9 replaced that five-layer stack with four layers over a
                foam core (45° biaxial twill, 0° UD, 90° UD, and a combined
                0°/90° UD layer), quasi-isotropic enough to clear the SES but
                weighted more toward 0°, where the bend test actually loads
                it.
              </p>
              <Figure
                label="C9 layup cross-section (vs. C5)"
                caption="Layer-by-layer cross-section of the C9 layup, shown alongside C5 for comparison."
              />
              <p className="text-lg text-muted leading-relaxed">
                The result matches or beats C5&apos;s stiffness at roughly
                20% less weight, in one fewer layer. Higher-load zones like
                side impact use &quot;double C9,&quot; the same stack doubled
                to eight layers under the no-retest rule, instead of a
                separately qualified layup.
              </p>
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
                one continuous layered shell, plies built inward from the
                outer surface, no solid elements. It&apos;s zoned by actual
                layup: skin-only regions, single C9, double C9, 1&quot; foam
                core, 0.5&quot; foam core, and so on.
              </p>
              <Figure
                label="FE model, layup zoning and boundary conditions"
                caption={
                  <>
                    Ansys ACP zone map by layup and the torsional load case
                    boundary conditions.{" "}
                    <Todo>
                      TODO(andrew): confirm full zone map of single vs.
                      double C9 regions.
                    </Todo>
                  </>
                }
              />
              <p className="text-lg text-muted leading-relaxed">
                Zone boundaries are merged into continuous shell edges, with
                no overlap geometry or discrete bonded joints modeled there.
                That&apos;s a simplification of the model, not a design
                decision. The physical chassis has overlapping dry carbon at
                every joint, and none of that is represented here.
              </p>
              <p className="text-lg text-muted leading-relaxed">
                Material properties come from the team&apos;s own coupon
                testing, not Ansys&apos; default carbon library: tensile
                tests on biaxial and unidirectional coupons at 0°, 45°, and
                90°, five per direction, averaged into modulus, shear
                modulus, and Poisson&apos;s ratio, strain-gauge validated
                along the way. One thing worth being precise about: that&apos;s
                a mean, not a knockdown-derated property. No
                fiber-volume-fraction or void-content adjustment has been
                applied yet. The coupons were made under close to ideal
                conditions (small, vacuum-infused, smooth glass tooling),
                while the full chassis is vacuum-infused at a much larger
                scale and doesn&apos;t hit the same infusion quality.
                Microscopy of the coupon cross-sections shows voids even
                under those conditions, which is basically the visual proof
                of that gap.
              </p>
              <Figure
                label="Microscope image, voids in coupon cross-section"
                caption="Cross-section of a test coupon at 20 µm scale, showing voids even under near-ideal, small-scale vacuum infusion."
                aspect="aspect-square"
              />
              <p className="text-lg text-muted leading-relaxed">
                The load case applies a remote force at the front suspension
                pickups, up on one side and down on the other, forming a
                torsional couple (
                <Todo>TODO(andrew): specify applied load magnitude</Todo>),
                while the rear suspension mounts stay fully fixed and
                everything else is free. It mirrors the physical torsion rig
                exactly, built and tested a year earlier by the capstone
                team, who also ran the coupon testing. The mesh is capped at
                32,000 elements, the ceiling of the Ansys student license,
                not a convergence-driven choice. No mesh convergence study
                has been run yet.
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
                physical rig measured 3900 N·m/deg, so the model over-predicts
                by about 15.4% relative to the measured value (13.3% relative
                to the simulated value). Sim-stiffer-than-real is the
                direction FE torsion models usually miss in, since shell
                models tend to leave out compliance sources the real
                structure has.
              </p>
              <Figure
                label="Physical torsion rig"
                caption="The physical torsion rig used to measure chassis stiffness, built and tested by the capstone team."
              />
              <Figure
                label="FE deformed shape and stress under the torsional load case"
                caption="Simulated deformation and equivalent stress under the torsional couple at the front suspension pickups."
              />
              <p className="text-lg text-muted leading-relaxed">
                Four things likely contribute to that gap, and none of them
                has been isolated or quantified: the coupon-to-part knockdown
                gap described above (plus build variability from a
                multi-person layup process), the unmodeled joint overlap,
                unmodeled bonded-joint compliance at bulkheads and pickups,
                and the uncertain effect of the 32k-element mesh cap. My
                guess is that the build-quality gap and the two joint-related
                sources are the biggest contributors, but that&apos;s a
                hypothesis, not something I&apos;ve actually proven.
              </p>
              <Figure
                label="Predicted vs. actual torsional stiffness"
                caption="Simulated (4500 N·m/deg) vs. measured (3900 N·m/deg) torsional stiffness: about a 15.4% over-prediction relative to measured."
              />
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
                to check whether the 32k-element result is actually converged
                and not just license-limited. A measured knockdown factor on
                the coupon properties, ideally backed by a
                fiber-volume-fraction or void-content measurement on
                chassis-representative panels instead of small coupons.
                Explicit modeling of joint overlap and/or bonded-joint
                compliance instead of merged shell edges. And longer-term,
                isolating the four error sources individually instead of
                lumping them together, to see which one actually dominates.
              </p>
            </div>
          </section>

          <section className="mt-20 pt-10 border-t border-border">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted mb-4">
              Still needed to finish this page
            </p>
            <ul className="space-y-2 text-muted list-disc list-inside">
              <li>Microscope images of voids in coupon cross-sections</li>
              <li>
                Layup diagram / cross-section of C9 (ideally with C5
                alongside for comparison)
              </li>
              <li>
                Force-displacement plots from 3-point bend and puncture/shear
                tests
              </li>
              <li>
                FE model screenshots: layup zoning, boundary conditions,
                deformed shape under torsional load
              </li>
              <li>Photos of the physical torsion rig</li>
              <li>Predicted-vs-actual stiffness comparison chart</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
