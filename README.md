# Muhammad Ahmed — Portfolio

> **Software Engineer · Mobile & Full-Stack Developer**  
> Karachi, Pakistan · [LinkedIn Profile](https://www.linkedin.com/in/muhammadahmedstack/)

A cinematic, editorial personal portfolio built with React, TypeScript, Tailwind CSS, GSAP, Lenis, and Three.js. Features a scroll-synchronized 360° turntable image sequence, interactive domain architecture showcase, progressive engineering timeline, and case studies for mobile and cloud applications.

---

## Key Highlights

- **Cinematic Turntable Experience**: High-performance 110-frame WebP canvas sequence with 0-latency scroll scrubbing, `requestAnimationFrame` coalescing, and real-time bearing telemetry.
- **Dark Editorial Aesthetic**: Deep dark theme (`#050505`) with emerald accents, masked typographic entrances, and subtle ambient 3D depth.
- **Flagship Case Studies**: Interactive mobile device simulations showcasing real-world offline resilience, AI prompt pipelines, and security architectures.
- **Accessibility & Motion Hardening**: Comprehensive `prefers-reduced-motion` compliance across all components, full keyboard tab navigation, and ARIA-compliant drawers.
- **Zero Scroll Stutter**: Virtual smooth scrolling powered by Lenis, tightly coupled to GSAP ScrollTrigger ticker.

---

## Featured Projects

### 01 // PakawNow
**AI-Powered Grocery & Kitchen Management (React Native, Expo, Firebase, Gemini 2.0 Flash)**
- Offline-first smart grocery list with PKR price estimation using a custom fuzzy-matching engine.
- Real-time pantry tracking with automated migration of purchased items and budget analytics.
- Expiry-aware *"Use It or Lose It"* rescue recipes and *"Pantry Genius"* meal generation via strictly typed JSON prompts.

### 02 // Awaaz Khata
**Voice-First Digital Ledger for Small Businesses (React Native, Expo, Supabase, PostgreSQL, AI APIs)**
- Voice-based transaction entry converted into structured double-entry accounting records via Urdu speech interpretation.
- Udhaar (credit) and customer balance management with real-time balance computation.
- Confirmation-first financial UX with dual Urdu and English interfaces, defended by PostgreSQL Row Level Security (RLS).

---

## Technical Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript, Vite |
| **Styling & Design** | Tailwind CSS v4, Custom Design Tokens |
| **Animation & Scroll** | GSAP 3, ScrollTrigger, Lenis Smooth Scroll |
| **3D & Graphics** | Three.js, React Three Fiber (R3F), HTML5 Canvas 2D |
| **Icons & Typography** | Lucide React, Space Grotesk, Inter |
| **Code Quality** | Oxlint, TypeScript strict mode |

---

## Project Structure

```
├── public/
│   ├── favicon.svg               # SVG brand favicon
│   ├── icons.svg                 # SVG sprite sheet
│   └── media/
│       ├── hero-poster.webp      # Instant poster image
│       └── hero-sequence/        # 110-frame WebP 360° turntable
├── src/
│   ├── components/
│   │   ├── 3d/                   # Lightweight Three.js ambient background
│   │   ├── common/               # Progress loader & shared UI
│   │   ├── hero/                 # Canvas turntable & hero typography
│   │   ├── layout/               # Global footer & wrappers
│   │   ├── navigation/           # Responsive navbar with drawer
│   │   ├── projects/             # Device mockup interactive preview
│   │   └── sections/             # About, Expertise, Journey, Experience, Approach, Contact
│   ├── data/                     # Authenticated portfolio content & metadata
│   ├── hooks/                    # Lenis smooth scroll & window resize hooks
│   ├── lib/                      # GSAP & ScrollTrigger configuration
│   ├── App.tsx                   # Main layout container
│   ├── index.css                 # Core CSS reset & typography imports
│   └── main.tsx                  # Application entry point
├── scripts/
│   └── extract-frames.cjs        # Automated WebP sequence generation script
├── .env.example                  # Safe environment template
├── .gitignore                    # Comprehensive repository ignore rules
├── vite.config.ts                # Vite build & chunking configuration
└── package.json                  # Dependencies and build scripts
```

---

## Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (v9 or higher)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/ahmed-portfolio.git
   cd ahmed-portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure environment variables (Optional)**:
   ```bash
   cp .env.example .env.local
   ```

4. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

5. **Build for production**:
   ```bash
   npm run build
   ```
   Preview the production build locally:
   ```bash
   npm run preview
   ```

---

## Security & Verification

This repository does not require or expose any private API credentials. All case study content is static and authentic. If you discover a vulnerability, please review our [Security Policy](SECURITY.md).

---

## License

This project is created by **Muhammad Ahmed**. All rights reserved.
