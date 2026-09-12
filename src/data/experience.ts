export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  type: string;
  period: string;
  location: string;
  summary: string;
  skills: string[];
}

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: "metagenix",
    role: "WordPress Developer",
    company: "Metagenix International",
    type: "Internship",
    period: "Jun 2025 – Nov 2025",
    location: "Karachi, Pakistan (On-site)",
    summary: "Supported web development, WordPress implementation, frontend debugging, QA testing, and cross-functional team collaboration.",
    skills: ["WordPress", "JavaScript", "HTML5", "CSS3", "PHP", "Debugging"],
  },
  {
    id: "ivew",
    role: "PHP Developer",
    company: "iVEW Solutions, LLC",
    type: "Part-time",
    period: "May 2023 – Oct 2023",
    location: "Karachi, Pakistan",
    summary: "Worked with PHP and MySQL backend logic, supported software integrations, debugging, database queries, and project feature delivery.",
    skills: ["PHP", "MySQL", "Backend Development", "REST APIs", "Testing"],
  },
];
