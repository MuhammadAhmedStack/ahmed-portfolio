import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Code2 } from 'lucide-react';
import { PERSONAL_INFO } from '../../data/portfolio';
import { BorderBeam } from '../ui/BorderBeam';
import { ShimmerButton } from '../ui/ShimmerButton';

interface NavItem {
  name: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'ABOUT', href: '#about' },
  { name: 'EXPERTISE', href: '#skills' },
  { name: 'JOURNEY', href: '#journey' },
  { name: 'PROJECTS', href: '#projects' },
  { name: 'EXPERIENCE', href: '#experience' },
  { name: 'APPROACH', href: '#approach' },
  { name: 'CONTACT', href: '#contact' },
];

interface NavbarProps {
  isReady?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isReady = true }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (href === '#' || href === '#hero') {
      if ((window as any).__lenis) {
        (window as any).__lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      if ((window as any).__lenis) {
        (window as any).__lenis.scrollTo(target);
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
        isReady ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      } ${
        isScrolled
          ? 'bg-[#050505]/85 backdrop-blur-md border-b border-white/[0.06] py-3.5'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="editorial-container flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          className="group flex items-center gap-2 text-white text-lg font-bold tracking-wider transition-opacity hover:opacity-90 font-display"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded bg-white/[0.05] border border-white/10 group-hover:border-emerald-500/50 transition-colors">
            <Code2 className="w-4 h-4 text-emerald-400" />
          </span>
          <span className="tracking-widest">
            AHMED<span className="text-emerald-400">.</span>
          </span>
        </a>

        {/* Desktop Navigation Links (Visible on large screens where spacing is comfortable) */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className="text-xs font-medium tracking-widest text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors duration-200"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Action & Availability Badge */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="relative overflow-hidden flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/[0.08] border border-emerald-500/25 text-[11px] font-mono text-emerald-300">
            <BorderBeam duration={8} colorFrom="#10b981" colorTo="#ffffff" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>AVAILABLE</span>
          </div>

          <ShimmerButton
            href={PERSONAL_INFO.socialLinks.linkedin}
            variant="secondary"
            className="!py-1.5 !px-4 !text-xs !normal-case"
          >
            <span>CONNECT</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8A8A8A]" />
          </ShimmerButton>
        </div>

        {/* Mobile / Tablet Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg bg-white/[0.05] border border-white/10 text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation-menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-menu"
          className="lg:hidden absolute inset-x-0 top-full bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 flex flex-col gap-5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-4.5rem)] overflow-y-auto"
        >
          <div className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="text-sm font-medium tracking-widest text-[#8A8A8A] hover:text-white active:text-emerald-400 active:bg-white/[0.04] transition-colors py-3 px-3 rounded-lg border-b border-white/[0.04] touch-manipulation"
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-white/[0.06]">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for engineering roles</span>
            </div>
            <a
              href={PERSONAL_INFO.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-white underline underline-offset-4 touch-manipulation py-2"
            >
              <span>LinkedIn</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
