export const profile = {
  name: "Andrew Evans",
  role: "Mechanical Engineer",
  heroIntro: {
    greeting: "Hey",
    greetingFollowup: "Nice to meet you",
    lines: ["Wanna learn more about me?", "Just scroll down"],
  },
  bio: "I'm Andrew, a 3rd year mechanical engineering student currently on my work term, available for work terms from September 2026 through August 2027. I'd love to chat about my experience, so reach out!",
  location: "Toronto, ON, Canada",
  school: "McMaster University",
  gradDate: "May 2028",
  email: "evansa25@mcmaster.ca",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/andrew-evans-255366248/" },
  ],
};

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
      "As Chassis Lead Engineer for Mac Formula Electric, I run chassis and monocoque design for a 20 engineer team, from layup strategy through structural validation.",
      "This redesign cut chassis weight 20% while keeping most of the structural integrity, and I mentored teammates in SolidWorks and composite design along the way.",
      "With the capstone team, I validated the chassis FE model against physical torsional stiffness testing, landing within 13.3% of the measured result using our own material data.",
    ],
    tags: ["SolidWorks", "Ansys ACP", "Ansys FEA"],
    caseStudyHref: "/work/chassis-torsional-fe-validation",
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
    role: "Project Engineering Intern",
    org: "Town of Ajax",
    period: "May 2024 - Aug 2024",
    description:
      "Cut costs 14% on a $3M infrastructure budget through resource calibration and cost analysis, and ran quality inspections against engineering drawings and standards.",
  },
  {
    role: "Data Analytics Intern",
    org: "Nokia",
    period: "July 2022 - Aug 2022",
    description:
      "Built interactive Power BI dashboards for key network performance indicators and automated Excel reporting, cutting manual processing time 40%.",
  },
];
