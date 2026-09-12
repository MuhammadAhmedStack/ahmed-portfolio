import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  User,
  Cpu,
  FolderGit2,
  Briefcase,
  Mail,
} from 'lucide-react';

const GithubIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.96 0-1.74.78-1.74 1.74 0 .97.78 1.74 1.74 1.74.96 0 1.74-.77 1.74-1.74 0-.96-.78-1.74-1.74-1.74Z" />
  </svg>
);

interface DockItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  isExternal?: boolean;
}

const DOCK_ITEMS: DockItem[] = [
  { id: 'hero', label: 'Index', icon: Home, href: '#hero' },
  { id: 'about', label: 'About', icon: User, href: '#about' },
  { id: 'skills', label: 'Skills', icon: Cpu, href: '#skills' },
  { id: 'projects', label: 'Projects', icon: FolderGit2, href: '#projects' },
  { id: 'experience', label: 'Experience', icon: Briefcase, href: '#experience' },
  { id: 'contact', label: 'Contact', icon: Mail, href: '#contact' },
  {
    id: 'github',
    label: 'GitHub',
    icon: GithubIcon,
    href: 'https://github.com/MuhammadAhmedStack',
    isExternal: true,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: LinkedinIcon,
    href: 'https://www.linkedin.com/in/muhammadahmedstack/',
    isExternal: true,
  },
];

export const FloatingDock: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('hero');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const lastScrollYRef = useRef<number>(0);

  // Active section tracking via IntersectionObserver
  useEffect(() => {
    const sections = ['hero', 'about', 'skills', 'journey', 'projects', 'experience', 'approach', 'contact'];
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(id);
            }
          });
        },
        { threshold: 0.25, rootMargin: '-10% 0px -40% 0px' }
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  // Subtle auto-hide on fast downward scroll, reveal on upward scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollYRef.current + 15) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollYRef.current - 10) {
        setIsVisible(true);
      }
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isExternal?: boolean) => {
    if (isExternal) return;
    e.preventDefault();

    const targetEl = document.querySelector(href);
    if (!targetEl) return;

    if ((window as any).__lenis) {
      (window as any).__lenis.scrollTo(targetEl, { offset: -40 });
    } else {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 pointer-events-auto ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <nav
        onMouseLeave={() => setHoveredIdx(null)}
        className="flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-full bg-[#0a0a0a]/80 border border-white/[0.12] backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_1px_rgba(255,255,255,0.2)] ring-1 ring-white/[0.05]"
      >
        {DOCK_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;
          const isHovered = hoveredIdx === idx;
          const isNeighbor = hoveredIdx !== null && Math.abs(hoveredIdx - idx) === 1;

          // Lightswind magnification scale formula
          let scale = 1;
          if (isHovered) scale = 1.25;
          else if (isNeighbor) scale = 1.1;

          return (
            <div
              key={item.id}
              className={`relative items-center justify-center ${
                item.isExternal ? 'hidden sm:flex' : 'flex'
              }`}
            >
              {/* Tooltip Pill (Desktop hover only) */}
              <div
                className={`hidden md:block absolute -top-10 px-2.5 py-1 rounded-md bg-[#111111] border border-white/10 text-[10px] font-mono tracking-wider text-white shadow-xl pointer-events-none transition-all duration-200 ${
                  isHovered ? 'opacity-100 -translate-y-1 scale-100' : 'opacity-0 translate-y-1 scale-90'
                }`}
              >
                {item.label}
              </div>

              {/* Dock Icon Button */}
              <a
                href={item.href}
                target={item.isExternal ? '_blank' : undefined}
                rel={item.isExternal ? 'noopener noreferrer' : undefined}
                onClick={(e) => handleNavClick(e, item.href, item.isExternal)}
                onMouseEnter={() => setHoveredIdx(idx)}
                style={{
                  transform: `scale(${scale})`,
                  transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                className={`relative flex items-center justify-center w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-full transition-colors duration-200 cursor-pointer touch-manipulation active:scale-95 ${
                  isActive
                    ? 'bg-white/15 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                    : 'text-[#8A8A8A] hover:text-white hover:bg-white/10 active:bg-white/10'
                }`}
                aria-label={item.label}
              >
                <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform" />

                {/* Active Indicator Dot */}
                {isActive && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                )}
              </a>
            </div>
          );
        })}
      </nav>
    </div>
  );
};
