export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  stack: string[];
  tags: string[];
  features?: string[];
  ctaText: string;
  accentColor: string;
}

export const PROJECTS: ProjectItem[] = [
  {
    id: "pakawnow",
    number: "01",
    title: "PAKAWNOW",
    subtitle: "AI-POWERED GROCERY & KITCHEN MANAGEMENT",
    description: "A mobile application for grocery planning, pantry management, meal planning, and food-waste reduction, combining cloud data with AI-powered assistance and offline-first fallbacks.",
    stack: [
      "React Native (Expo)",
      "Firebase Auth",
      "Firestore",
      "Gemini 2.0 Flash",
      "React Navigation",
      "Expo Notifications",
      "EAS Build"
    ],
    tags: ["AI RECIPES", "PANTRY", "MEAL PLANNER", "SMART RESCUE", "OFFLINE-FIRST"],
    features: [
      "Smart grocery list with PKR price estimation via offline fuzzy-matching engine",
      "Real-time budget tracking & automatic pantry migration after purchase",
      "Expiry-aware 'Use It or Lose It' and pantry-based 'Pantry Genius' AI recipes",
      "Strict JSON prompt engineering with Gemini 2.0 Flash and offline recipe fallback"
    ],
    ctaText: "EXPLORE PAKAWNOW →",
    accentColor: "#10b981",
  },
  {
    id: "awaaz-khata",
    number: "02",
    title: "AWAAZ KHATA",
    subtitle: "VOICE-FIRST DIGITAL LEDGER",
    description: "A voice-first mobile ledger designed around Urdu interaction, helping small shopkeepers record credit and payment transactions using natural voice input instead of manual typing.",
    stack: [
      "React Native",
      "Expo",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "Row Level Security",
      "AI / LLM APIs"
    ],
    tags: ["URDU VOICE", "UDHAAR", "AI INTERPRETATION", "SECURITY", "BILINGUAL"],
    features: [
      "Urdu voice-based transaction entry converted to structured accounting records",
      "Udhaar/credit and customer balance tracking with real-time balance computation",
      "Confirmation-first financial transaction UX with dual Urdu & English interface",
      "Robust PostgreSQL backend with Row Level Security (RLS) and server-side validation"
    ],
    ctaText: "EXPLORE AWAAZ KHATA →",
    accentColor: "#34d399",
  }
];
