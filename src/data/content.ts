export const profile = {
  name: "Andrew Evans",
  role: "Mechanical Engineer",
  school: "McMaster University",
  gradDate: "May 2028",
  email: "evansa25@mcmaster.ca",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/andrew-evans-255366248/" },
  ],
};

// Hero. `figure` is the picture drawn as dots behind your name: now your
// photo on a patio at night, the whole scene, filling the screen.
//
// To change the photo: put the new one at assets-src/hero-scene.webp (or .jpg,
// .png; keep only one), run
//   node scripts/prepare-home-assets.mjs hero
// and it rewrites public/images/home/hero.jpg. Then set `face` to where your
// head is in the new picture, and `focus` to the part that should stay in view.
// The Rock of Cashel photo used before is assets-src/hero-scene-cashel.jpg. To
// get that hero back as it was, set HERO_SIDE_FILL in the script to 0 before
// running it, leave `span` out, and use face { x: 0.508, y: 0.475, rx: 0.055,
// ry: 0.0975 } and focus [0.508, 0.12].
//
// `figure` can also be a cutout of you on a transparent background (a .png or
// .webp, see the README), or a short looping clip ("/media/hero.mp4") shot
// against a dark background: anything darker than keyLow is treated as
// background. Set it to undefined to get the generated placeholder figure back.
export const hero: {
  figure?: string;
  /** Where the head is in the picture, as fractions from the top left: centre (between the eyes and the nose), half the face width, half the height from the top of the head (or hat) to the chin. Places the glitch streaks and keeps your head in view when a screen crops the photo; for a cutout it also centres you on the screen and places the side light. Update it whenever you change the photo. */
  face: { x: number; y: number; rx: number; ry: number };
  /** For a whole photo (a .jpg): which part stays in view when the screen crops it, [x, y] from 0 to 1, top left is [0, 0], like CSS object-position. On very wide or narrow screens the crop moves only as far as it must to keep your head (from `face`) in view. */
  focus?: [number, number];
  /** For a photo the prepare script widened: where the real photo sits across hero.jpg, [left, right] from 0 to 1 (the script prints it). Screens narrower than the photo then never show the blurred sides. Leave it out for a photo that was not widened. */
  span?: [number, number];
  /** Which side your name sits on over the hero on laptops and wider, and on phones held sideways (phones held upright put it at the bottom left). Pick the side your face is not on. */
  textSide?: "left" | "right";
  keyLow: number;
  keyHigh: number;
  /** Short line on the hero, on the side opposite your name on laptops (the left when textSide is "right"). Leave it empty to show nothing there. */
  line: string;
} = {
  figure: "/images/home/hero.jpg",
  // The prepare script widens the photo by 10% on each side with a blurred
  // continuation of its own edges, so a laptop shows more of it. These
  // numbers are for that wider hero.jpg (the script prints how to convert
  // them): measured on the photo itself, face was
  // { x: 0.244, y: 0.459, rx: 0.0625, ry: 0.067 }.
  face: { x: 0.2952, y: 0.459, rx: 0.05, ry: 0.067 },
  // The photo is taller than wide, so a laptop shows a band across it (a
  // little under half its height on a 2:1 screen): this keeps the tops of the
  // towers above your head. A phone shows the full height and about 60% of
  // the width, with you a little left of centre and the street on the right
  // (the blurred sides do not show there).
  focus: [0.29, 0.35],
  span: [0.1, 0.9],
  // you are on the left of this photo, so your name goes over the city
  textSide: "right",
  keyLow: 0.06,
  keyHigh: 0.16,
  line: "",
};

// About section paragraphs, shown under "About me" over the team photo. The
// first one is set a little larger. Leave the list empty to show only the
// heading. Each paragraph makes the about section 0.8 of a screen longer, so
// there is time to read it before the contact section comes in. At half the
// scroll speed that fits about 200 characters for the first paragraph and
// about 350 for each further one on a laptop; longer text still works, it just
// scrolls past a little faster.
// Written from the bio on the old site and the experience list below.
export const about: string[] = [
  "I'm Andrew, a 3rd year mechanical engineering student at McMaster, currently on a work term at Multimatic. I spent three years on the Mac Formula Electric chassis, the last one as chassis lead, and I'm now on the powertrain electromechanical subteam.",
];

export const skills = [
  "SolidWorks",
  "Ansys FEA",
  "Ansys ACP",
  "Siemens NX",
  "GD&T",
  "DFM",
  "Composite Design",
  "Root Cause Analysis",
  "Power BI",
  "Excel / VBA",
  "Manufacturing",
];

export type TeamKey = "FSAE" | "Multimatic" | "General Dynamics";

export const teams: { key: TeamKey; label: string; org: string }[] = [
  { key: "FSAE", label: "FSAE", org: "Mac Formula Electric" },
  { key: "Multimatic", label: "Multimatic", org: "Multimatic" },
  { key: "General Dynamics", label: "General Dynamics", org: "General Dynamics" },
];

export type Project = {
  slug: string;
  title: string;
  team: TeamKey;
  period: string;
  description: string;
  detail: string[];
  tags: string[];
  caseStudyHref?: string;
  /** Shown as a feature at the top of the experience page when the project has a case study. */
  caseStudy?: { title: string; summary: string; image: string; imageAlt: string };
};

export const projects: Project[] = [
  {
    slug: "carbon-fiber-monocoque-chassis",
    title: "Carbon Fiber Monocoque & Chassis",
    team: "FSAE",
    period: "June 2025 - June 2026",
    description:
      "Led carbon fiber monocoque and chassis design for a 20 engineer team, cutting weight 20% while validating structural performance.",
    detail: [
      "As Chassis Lead Engineer for Mac Formula Electric, I ran chassis and monocoque design for a 20 engineer team, from layup strategy through structural validation.",
      "This redesign cut chassis weight 20% while keeping most of the structural integrity, and I mentored teammates in SolidWorks and composite design along the way.",
      "With the capstone team, I validated the chassis FE model against physical torsional stiffness testing, landing within 13.3% of the measured result using our own material data.",
    ],
    tags: ["SolidWorks", "Ansys ACP", "Ansys FEA"],
    caseStudyHref: "/work/chassis-torsional-fe-validation",
    caseStudy: {
      title: "Chassis Layup Design & Torsional FE Validation",
      summary:
        "How the FSAE chassis skin layup went from C5 to C9 against the SES, and how the Ansys ACP torsional stiffness model compares to physical rig testing. Simulated torsional stiffness came out to 4500 N·m/deg. The physical rig measured 3900 N·m/deg.",
      image: "/images/fe-stress-animation.gif",
      imageAlt: "FE equivalent stress under torsional load",
    },
  },
  {
    slug: "firewall-dfm-redesign",
    title: "Firewall Redesign for Manufacturability",
    team: "FSAE",
    period: "Feb 2024 - June 2025",
    description:
      "Redesigned the vehicle's firewall for manufacturability, cutting weight 31% using SolidWorks and Ansys FEA.",
    detail: [
      "As Chassis Engineer, I redesigned the firewall for manufacturability (DFM), simplifying the geometry and cutting material without giving up protection.",
      "I modeled it in SolidWorks and validated the new design in Ansys FEA, landing a 31% weight reduction.",
    ],
    tags: ["SolidWorks", "Ansys FEA", "DFM"],
  },
  {
    slug: "inspection-fixture-root-cause-redesign",
    title: "Inspection Fixture Fracture Root Cause & Redesign",
    team: "Multimatic",
    period: "May 2026 - Present",
    description:
      "Root caused a repeat fracture in a Delrin inspection fixture and redesigned it, cutting bending stress from 115 MPa to 1.4 MPa and raising stiffness roughly 40x.",
    detail: [
      "A Delrin cantilever inspection fixture kept fracturing. I traced it to a hollow cross section on an overlong moment arm, which put 115 MPa of peak bending stress on the Delrin against a flexural strength of roughly 90 MPa at the 150 N service load it saw in use.",
      "I redesigned it to a shortened solid section with a steel sleeve, which dropped the bending stress in the Delrin to 1.4 MPa and raised bending stiffness roughly 40x. That held the positional repeatability the fixture needed for a cobot vision check.",
    ],
    tags: ["Root Cause Analysis", "Tooling Design", "Manufacturing"],
  },
  {
    slug: "dyno-failure-root-cause-analysis",
    title: "Damper First Pass Yield Investigation",
    team: "Multimatic",
    period: "May 2026 - Present",
    description:
      "Investigating damper first pass yield with a cross functional team, tracing failures on six torn down units to out of spec tolerances and evaluating bore honing as the fix.",
    detail: [
      "Dampers were failing first pass yield, so I joined a cross functional team investigating why. I ran dyno characterization for a customer design office trial, looking at rod rotation and bleed past the piston, and tore down six failed units to trace the failures to out of spec tolerances.",
      "I flagged that the dyno's velocity roll off near end of stroke understates bleed effects, since orifice force scales with v^2. Bore honing is the leading fix so far, and I'm evaluating it on cost per unit against the pass rate gain, alongside a tolerance sweep on the moving components.",
    ],
    tags: ["Root Cause Analysis", "GD&T", "Manufacturing"],
  },
  {
    slug: "damper-line-part-buffer-cart",
    title: "Damper Line Part Buffer Cart",
    team: "Multimatic",
    period: "May 2026 - Present",
    description:
      "Designed and built an overflow parts cart in house for $4k against a $12k external quote, using a single piece CNC tray for up to 9x the bending stiffness of the original bolted design.",
    detail: [
      "To buffer output between a robotic cell and a downstream assembly station, I designed and built an overflow parts cart, delivering it in house for $4k all in against a $12k external quote.",
      "The original design was a three board bolted tray. I replaced it with a single piece CNC tray, which eliminated shear slip at the bolted joints and raised bending stiffness up to 9x at the same material thickness.",
    ],
    tags: ["Manufacturing", "Tooling Design", "DFM"],
  },
  {
    slug: "hull-assembly-design-solutions",
    title: "Hull Assembly Design Solutions",
    team: "General Dynamics",
    period: "May 2025 - Aug 2025",
    description:
      "Resolved high priority assembly issues with design solutions engineered in Siemens NX.",
    detail: [
      "I resolved high priority assembly issues in Siemens NX, working across Hull Additions, Propulsion, and manufacturing teams.",
      "The goal on every fix was the same: an integrated, production ready solution, not just a patch that pushed the problem downstream.",
    ],
    tags: ["Siemens NX", "GD&T"],
  },
  {
    slug: "bilge-adapter-design",
    title: "Bilge Adapter Design for Water Evacuation Testing",
    team: "General Dynamics",
    period: "May 2025 - Aug 2025",
    description:
      "Supported bilge adapter design in Siemens NX for water evacuation testing, applying GD&T and verifying it through prototype testing.",
    detail: [
      "I supported bilge adapter design in Siemens NX for water evacuation testing, applying GD&T to keep it within tolerance through manufacturing and assembly.",
      "I also verified it through prototype testing to confirm it performed as intended before sign off.",
    ],
    tags: ["Siemens NX", "GD&T"],
  },
  {
    slug: "automated-weight-verification-tool",
    title: "Automated Weight Verification Tool",
    team: "General Dynamics",
    period: "May 2025 - Aug 2025",
    description:
      "Built an automated tool that pulls real part data into Excel for precise weight verification and mass roll ups.",
    detail: [
      "I built an automated tool that pulls real part data into Excel for precise mobility assembly mass roll ups.",
      "This improved the accuracy of vehicle weight compliance reporting and cut the manual effort needed to keep it current.",
    ],
    tags: ["Excel / VBA", "GD&T"],
  },
  {
    slug: "gear-oil-durability-test-sow",
    title: "Gear Oil Durability Test Specification",
    team: "General Dynamics",
    period: "May 2025 - Aug 2025",
    description:
      "Authored a Statement of Work specifying ASME/ISO durability tests for new gear oils.",
    detail: [
      "I authored a Statement of Work specifying ASME/ISO durability tests to validate new gear oils for mobility systems.",
      "The test plan addressed known failure risks, like seal wear and carbon buildup, so any new oil had to meet performance requirements before reaching the field.",
    ],
    tags: ["ASME", "ISO", "Root Cause Analysis"],
  },
];

export type ExperienceItem = {
  role: string;
  org: string;
  period: string;
  description: string;
};

export const experience: ExperienceItem[] = [
  {
    role: "Powertrain Electromechanical Member",
    org: "Mac Formula Electric",
    period: "June 2026 - Present",
    description:
      "Just joined the powertrain electromechanical subteam, moving from three years on chassis and composites into the systems that put power down.",
  },
  {
    role: "Ride Dynamics Manufacturing Intern",
    org: "Multimatic",
    period: "May 2026 - Present",
    description:
      "Root caused and redesigned a fracturing Delrin inspection fixture, joined a cross functional team investigating damper first pass yield, and built an overflow parts cart in house for $4k against a $12k outside quote.",
  },
  {
    role: "Chassis Lead Engineer",
    org: "Mac Formula Electric",
    period: "June 2025 - June 2026",
    description:
      "Led the carbon fiber monocoque and chassis subsystems for a 20 engineer team, cutting chassis weight 20% while mentoring teammates in SolidWorks and composite design.",
  },
  {
    role: "Mobility Systems Design Engineer Intern",
    org: "General Dynamics",
    period: "May 2025 - Aug 2025",
    description:
      "Resolved high priority assembly issues in Siemens NX, built an automated weight verification tool for mass roll ups, and wrote a Statement of Work for new gear oil durability tests.",
  },
  {
    role: "Data Analytics Intern",
    org: "Nokia",
    period: "July 2022 - Aug 2022",
    description:
      "Built interactive Power BI dashboards for key network performance indicators and automated Excel reporting, cutting manual processing time 40%.",
  },
];

// Colour of a reel card that has no photo yet.
export type CardTone = "dark" | "light" | "accent" | "blue";

// One card per org on the "Selected work" reel, in this order.
// Each card links to /experience/<slug>, which lists the matching roles from
// `experience` (matched on `name`) and the projects whose team is `team`.
export type Org = {
  slug: string;
  /** Must match `org` on the experience entries. */
  name: string;
  label: string;
  team?: TeamKey;
  summary: string;
  /** Line under the big name on the reel card. */
  title: string;
  /** Smaller line under the title on the reel card. */
  period: string;
  /**
   * Optional official logo file under public/ (SVG or PNG with a transparent
   * background). When set it replaces the name set in type on the card. Check
   * the company's brand guidelines before using one.
   */
  logo?: string;
  /** Optional photo under public/, shown behind the name. Without one the card is plain type in `tone`. */
  image?: string;
  /** Which part of the photo to keep when the card crops it: [x, y] from 0 to 1, top left is [0, 0]. */
  imageFocus?: [number, number];
  /** Set to false when the photo already shows the company's name, so it is not written twice. */
  showName?: boolean;
  tone: CardTone;
};

export const orgs: Org[] = [
  {
    slug: "fsae",
    title: "Chassis Lead | Carbon Fiber Monocoque",
    period: "June 2025 - June 2026",
    name: "Mac Formula Electric",
    label: "FSAE",
    team: "FSAE",
    summary:
      "Three years on the carbon fiber monocoque and chassis, the last one as Chassis Lead for a 20 engineer team. Chassis weight came down 20%, and the FE model landed within 13.3% of the physical torsion test.",
    // the team with the Canadian flag and car 101 (from assets-src/card-fsae.webp);
    // a little above centre, so wide crops keep the top row's heads
    image: "/images/home/card-fsae.jpg",
    imageFocus: [0.5, 0.42],
    tone: "dark",
  },
  {
    slug: "multimatic",
    title: "Manufacturing Engineering | Ride Dynamics",
    period: "May 2026 - Present",
    name: "Multimatic",
    label: "Internship",
    team: "Multimatic",
    summary:
      "Ride dynamics manufacturing. Root caused a fracturing Delrin fixture and cut its peak bending stress from 115 MPa to 1.4 MPa. Built an overflow parts cart in house for $4k against a $12k outside quote.",
    image: "/images/home/card-multimatic.jpg",
    imageFocus: [0.5, 0.5],
    tone: "dark",
  },
  {
    slug: "general-dynamics",
    title: "Design Engineering | Mobility Systems",
    period: "May 2025 - Aug 2025",
    name: "General Dynamics",
    label: "Internship",
    team: "General Dynamics",
    summary:
      "Mobility systems design in Siemens NX. Fixed high priority hull assembly issues, built a weight verification tool for mass roll ups, and wrote the durability test spec for new gear oils.",
    image: "/images/home/card-general-dynamics.jpg",
    imageFocus: [0.5, 0.55],
    tone: "accent",
  },
  {
    slug: "nokia",
    title: "Data Analytics | Network Performance",
    period: "July 2022 - Aug 2022",
    name: "Nokia",
    label: "Internship",
    summary:
      "Power BI dashboards for network performance indicators and automated Excel reporting. Manual processing time dropped 40%.",
    image: "/images/home/card-nokia.jpg",
    imageFocus: [0.7, 0.5],
    // the photo has Nokia's own logo across the middle
    showName: false,
    tone: "blue",
  },
];

// Full screen pictures on the home page, relative to /public. Set one to
// undefined to get a generated stand-in.
export const scenes: {
  about?: string;
  contact?: string;
  /** Which part of the contact picture stays in view when the screen crops it. */
  contactAnchor: "top" | "middle" | "bottom";
} = {
  // behind "About me": the team at the racetrack, prepared by
  // scripts/prepare-home-assets.mjs
  about: "/images/home/about-team.jpg",
  // behind the contact section: a lavender field under a blue sky, prepared by
  // scripts/prepare-home-assets.mjs
  contact: "/images/home/contact.jpg",
  contactAnchor: "middle",
};

// Headings on the home page.
export const homeCopy = {
  workHeading: "Selected work",
  aboutLabel: "About me",
  contactHeadline: "Reach out, happy to talk.",
  contactSub: "Email is the fastest way to reach me.",
};
