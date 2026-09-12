export interface PersonalInfo {
  name: string;
  role: string;
  tagline: string;
  location: string;
  education: {
    degree: string;
    institution: string;
    period: string;
  };
  focus: string;
  interests: string[];
  socialLinks: {
    linkedin: string;
    github?: string;
    email?: string;
  };
}

export const PERSONAL_INFO: PersonalInfo = {
  name: "Muhammad Ahmed",
  role: "Software Engineer · Mobile & Full-Stack Developer",
  tagline: "I build modern software products across mobile, backend, and AI-powered experiences.",
  location: "Karachi, Pakistan",
  education: {
    degree: "Bachelor's Degree in Computer Science",
    institution: "SSUET",
    period: "2022 – 2026",
  },
  focus: "Software Engineering",
  interests: ["Mobile Development", "Backend Systems", "AI-Powered Experiences"],
  socialLinks: {
    linkedin: "https://www.linkedin.com/in/muhammadahmedstack/",
  },
};

export const HERO_CONTENT = {
  eyebrow: "MUHAMMAD AHMED",
  headline: "SOFTWARE ENGINEER",
  description: "I build modern software products across mobile, backend, and AI-powered experiences.",
  ctaPrimary: "VIEW PROJECTS",
  ctaSecondary: "CONTACT ME",
  helper: "SCROLL TO EXPLORE",
  status: "AVAILABLE FOR ROLES & CONTRACTS",
};

export const ABOUT_CONTENT = {
  heading: "BUILDING WITH PURPOSE.",
  bio: "I'm Muhammad Ahmed, a Computer Science graduate focused on building practical software experiences across mobile development, backend systems, and AI-powered applications.",
  metadata: [
    { label: "LOCATION", value: "Karachi, Pakistan" },
    { label: "EDUCATION", value: "BS Computer Science — SSUET" },
    { label: "FOCUS", value: "Software Engineering" },
    { label: "INTERESTS", value: "Mobile · Backend · AI" },
  ],
};

export const ENGINEERING_APPROACH = [
  { step: "01", title: "UNDERSTAND", description: "Clarify the problem, user needs, constraints, and expected outcome." },
  { step: "02", title: "ARCHITECT", description: "Choose a maintainable structure, data flow, and integration approach." },
  { step: "03", title: "BUILD", description: "Implement the core experience with clean, reusable components." },
  { step: "04", title: "TEST", description: "Verify functionality, edge cases, and user experience." },
  { step: "05", title: "OPTIMIZE", description: "Improve loading, rendering, reliability, and mobile performance." },
  { step: "06", title: "SHIP", description: "Package, deploy, monitor, and iterate." },
];

export const CONTACT_CONTENT = {
  headline: "LET'S BUILD SOMETHING MEANINGFUL.",
  subtext: "Open to software engineering, mobile development, backend, and AI-focused opportunities.",
  cta: "LET'S TALK",
  linkedin: "https://www.linkedin.com/in/muhammadahmedstack/",
};
