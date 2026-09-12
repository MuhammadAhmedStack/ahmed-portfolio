import { useState } from 'react';
import { useLenis } from './hooks/useLenis';
import { Loader } from './components/common/Loader';
import { Navbar } from './components/navigation/Navbar';
import { Hero } from './components/hero/Hero';
import { AboutSection } from './components/sections/AboutSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { JourneySection } from './components/sections/JourneySection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { ApproachSection } from './components/sections/ApproachSection';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/layout/Footer';
import { Scene } from './components/3d/Scene';
import { FloatingDock } from './components/ui/FloatingDock';
import { PointerFollower } from './components/ui/PointerFollower';

import { ScrollTrigger } from './lib/gsap';

export function App() {
  const [loading, setLoading] = useState(true);

  // Initialize Lenis smooth scroll connected to GSAP ScrollTrigger
  useLenis();

  const handleLoaderComplete = () => {
    setLoading(false);
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] relative selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Intro Loader */}
      {loading && <Loader onComplete={handleLoaderComplete} />}

      {/* Interactive Lightswind Custom Arrow Pointer */}
      {!loading && <PointerFollower />}

      {/* Subtle Background 3D Atmosphere */}
      <Scene />

      {/* Navigation */}
      <Navbar isReady={!loading} />

      {/* Main Page Sections */}
      <main className="relative z-10">
        <Hero isReady={!loading} />
        <AboutSection />
        <SkillsSection />
        <JourneySection isReady={!loading} />
        <ProjectsSection />
        <ExperienceSection />
        <ApproachSection />
        <ContactSection />
      </main>

      {/* Interactive Lightswind Floating Navigation Dock */}
      {!loading && <FloatingDock />}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
