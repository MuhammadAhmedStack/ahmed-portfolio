export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  skills: {
    name: string;
    isPrimary?: boolean;
    level?: string;
  }[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "mobile",
    name: "MOBILE",
    description: "Production mobile engineering with deep React Native and Expo ecosystem expertise.",
    skills: [
      { name: "React Native", isPrimary: true },
      { name: "Expo", isPrimary: true },
      { name: "TypeScript", isPrimary: true },
      { name: "JavaScript", isPrimary: true },
      { name: "React Navigation", isPrimary: false },
    ],
  },
  {
    id: "backend",
    name: "BACKEND",
    description: "Structured backend APIs and enterprise application architectures.",
    skills: [
      { name: "ASP.NET Core", isPrimary: true },
      { name: "C#", isPrimary: true },
      { name: "REST APIs", isPrimary: true },
      { name: "Entity Framework Core", isPrimary: false },
      { name: "MVC Architecture", isPrimary: false },
    ],
  },
  {
    id: "data",
    name: "DATA & SECURITY",
    description: "Reliable database design, real-time subscriptions, and security rules.",
    skills: [
      { name: "PostgreSQL", isPrimary: true },
      { name: "Supabase", isPrimary: true },
      { name: "Firebase / Firestore", isPrimary: true },
      { name: "Row Level Security (RLS)", isPrimary: true },
      { name: "Authentication Systems", isPrimary: false },
      { name: "SQL", isPrimary: false },
    ],
  },
  {
    id: "ai",
    name: "AI INTEGRATION",
    description: "Building production apps with LLM APIs and strict structured outputs.",
    skills: [
      { name: "Google Gemini 2.0 API", isPrimary: true },
      { name: "Prompt Engineering (JSON)", isPrimary: true },
      { name: "AI/LLM APIs", isPrimary: true },
      { name: "Generative AI Workflows", isPrimary: false },
    ],
  },
  {
    id: "tools",
    name: "TOOLS & DEPLOYMENT",
    description: "Version control, mobile build pipelines, and continuous integration.",
    skills: [
      { name: "Git", isPrimary: true },
      { name: "GitHub", isPrimary: true },
      { name: "EAS Build", isPrimary: true },
    ],
  },
];
