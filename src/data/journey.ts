export interface JourneyMilestone {
  year: string;
  title: string;
  description: string;
  category: "EDUCATION" | "WORK" | "ENGINEERING";
}

export const JOURNEY_MILESTONES: JourneyMilestone[] = [
  {
    year: "2022",
    title: "Computer Science Foundation",
    description: "Commenced Bachelor's Degree in Computer Science at Sir Syed University of Engineering and Technology (SSUET), building core algorithmic and computational fundamentals.",
    category: "EDUCATION",
  },
  {
    year: "2023",
    title: "PHP & Database Integrations",
    description: "Part-time software role developing PHP and MySQL applications, handling API integrations, rigorous debugging, and database query optimization.",
    category: "WORK",
  },
  {
    year: "2025",
    title: "Web Engineering Internship",
    description: "Web development internship at Metagenix International focusing on WordPress solutions, modular frontends, debugging, and team collaboration.",
    category: "WORK",
  },
  {
    year: "2026",
    title: "Software Engineering & Flagship Products",
    description: "Completed Computer Science degree with dedicated focus on modern mobile engineering (React Native), cloud architectures, and production AI products.",
    category: "ENGINEERING",
  },
];
