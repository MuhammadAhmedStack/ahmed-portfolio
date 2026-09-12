import React, { useRef, useEffect } from 'react';
import { ArrowDown, ArrowRight, Sparkles, Terminal } from 'lucide-react';
import { HERO_CONTENT } from '../../data/portfolio';
import { HeroPortrait, type HeroPortraitHandle } from './HeroPortrait';
import { gsap, ScrollTrigger } from '../../lib/gsap';

interface HeroProps {
  isReady?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ isReady = true }) => {
  const pinnedWrapperRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const portraitRef = useRef<HeroPortraitHandle | null>(null);

  // Animation element refs
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const word1Ref = useRef<HTMLSpanElement | null>(null);
  const word2Ref = useRef<HTMLSpanElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const ctaGroupRef = useRef<HTMLDivElement | null>(null);
  const topBarRef = useRef<HTMLDivElement | null>(null);
  const bottomBarRef = useRef<HTMLDivElement | null>(null);
  const textContainerRef = useRef<HTMLDivElement | null>(null);
  const portraitContainerRef = useRef<HTMLDivElement | null>(null);
  const ambientHaloRef = useRef<HTMLDivElement | null>(null);

  // 1. Initial Entrance Choreography
  useEffect(() => {
    if (!isReady || !sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // Immediate display without stagger
        gsap.set(
          [
            eyebrowRef.current,
            word1Ref.current,
            word2Ref.current,
            descRef.current,
            ctaGroupRef.current,
            topBarRef.current,
            bottomBarRef.current,
            portraitContainerRef.current,
          ],
          { opacity: 1, y: 0, yPercent: 0, filter: 'none' }
        );
        return;
      }

      // Initial state setup for masked typography and elements
      gsap.set([eyebrowRef.current, descRef.current, ctaGroupRef.current], {
        opacity: 0,
        y: 24,
      });
      gsap.set([topBarRef.current, bottomBarRef.current], {
        opacity: 0,
      });
      gsap.set([word1Ref.current, word2Ref.current], {
        yPercent: 125,
        rotateX: 10,
        transformOrigin: '0% 100%',
      });
      gsap.set(portraitContainerRef.current, {
        opacity: 0,
        scale: 0.94,
        filter: 'blur(10px)',
      });

      // Master Entrance Timeline
      const tl = gsap.timeline({
        delay: 0.15,
        defaults: { ease: 'power3.out' },
      });

      tl
        // 1. Top status bar reveals
        .to(topBarRef.current, {
          opacity: 1,
          duration: 0.8,
        })
        // 2. Identity eyebrow slides in
        .to(
          eyebrowRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          '-=0.5'
        )
        // 3. Display Word 1 "SOFTWARE" slides up from mask
        .to(
          word1Ref.current,
          {
            yPercent: 0,
            rotateX: 0,
            duration: 1.1,
            ease: 'power4.out',
          },
          '-=0.6'
        )
        // 4. Display Word 2 "ENGINEER" slides up from mask
        .to(
          word2Ref.current,
          {
            yPercent: 0,
            rotateX: 0,
            duration: 1.1,
            ease: 'power4.out',
          },
          '-=0.85'
        )
        // 5. Supporting description fades in
        .to(
          descRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          '-=0.7'
        )
        // 6. Action CTAs stagger in
        .to(
          ctaGroupRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          '-=0.6'
        )
        // 7. Portrait settles into position with subtle depth scale
        .to(
          portraitContainerRef.current,
          {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.2,
            ease: 'power2.out',
          },
          '-=0.9'
        )
        // 8. Bottom scroll telemetry fades in
        .to(
          bottomBarRef.current,
          {
            opacity: 1,
            duration: 0.9,
          },
          '-=0.6'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [isReady]);

  // 2. Scroll Choreography & Pinned Turntable Scrub
  useEffect(() => {
    const wrapper = pinnedWrapperRef.current;
    if (!wrapper || !isReady) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const isDesktop = window.innerWidth >= 1024;

    const ctx = gsap.context(() => {
      // Desktop gets intentional pinned scrub; mobile gets in-flow smooth scrub
      ScrollTrigger.create({
        trigger: wrapper,
        start: 'top top',
        end: isDesktop ? '+=120%' : '+=80%',
        pin: isDesktop,
        pinSpacing: isDesktop,
        anticipatePin: 1,
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress;

          // A. Drive portrait canvas image sequence & 360° telemetry angle directly via ref
          if (portraitRef.current) {
            portraitRef.current.updateProgress(p);
          }

          // B. Transform typography with subtle cinematic depth
          if (textContainerRef.current) {
            gsap.set(textContainerRef.current, {
              y: -p * 50,
              opacity: Math.max(0.2, 1 - p * 0.8),
            });
          }

          // C. Fade out top and bottom telemetry as user scrolls into the narrative
          if (topBarRef.current) {
            gsap.set(topBarRef.current, {
              opacity: Math.max(0, 1 - p * 2.5),
            });
          }
          if (bottomBarRef.current) {
            gsap.set(bottomBarRef.current, {
              opacity: Math.max(0, 1 - p * 2.5),
            });
          }

          // D. Portrait subtle scale and depth translation
          if (portraitContainerRef.current) {
            gsap.set(portraitContainerRef.current, {
              scale: 1 + p * 0.05,
              y: -p * 20,
            });
          }
        },
      });
    }, wrapper);

    return () => ctx.revert();
  }, [isReady]);

  // 3. Desktop Mouse Parallax (Restrained & physics-based)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion || window.innerWidth < 1024) return;

    // Smooth interpolators via gsap.quickTo
    const portraitEl = portraitContainerRef.current;
    const textEl = textContainerRef.current;
    const haloEl = ambientHaloRef.current;

    if (!portraitEl || !textEl) return;

    const pX = gsap.quickTo(portraitEl, 'x', { duration: 0.8, ease: 'power3.out' });
    const pY = gsap.quickTo(portraitEl, 'y', { duration: 0.8, ease: 'power3.out' });
    const tX = gsap.quickTo(textEl, 'x', { duration: 1.0, ease: 'power3.out' });
    const tY = gsap.quickTo(textEl, 'y', { duration: 1.0, ease: 'power3.out' });
    const hX = haloEl ? gsap.quickTo(haloEl, 'x', { duration: 1.2, ease: 'power3.out' }) : () => {};
    const hY = haloEl ? gsap.quickTo(haloEl, 'y', { duration: 1.2, ease: 'power3.out' }) : () => {};

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // Normalized coordinates from -1 to +1
      const normX = (clientX / innerWidth) * 2 - 1;
      const normY = (clientY / innerHeight) * 2 - 1;

      // Restrained shifts: portrait moves ±10px, text moves ±4px, halo moves opposite
      pX(normX * 10);
      pY(normY * 10);
      tX(normX * 4);
      tY(normY * 4);
      hX(normX * -18);
      hY(normY * -18);
    };

    const handleMouseLeave = () => {
      pX(0);
      pY(0);
      tX(0);
      tY(0);
      hX(0);
      hY(0);
    };

    section.addEventListener('mousemove', handleMouseMove);
    section.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const scrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.querySelector('#projects');
    if (el) {
      if ((window as any).__lenis) {
        (window as any).__lenis.scrollTo(el);
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.querySelector('#contact');
    if (el) {
      if ((window as any).__lenis) {
        (window as any).__lenis.scrollTo(el);
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div ref={pinnedWrapperRef} className="relative w-full">
      <section
        ref={sectionRef}
        id="hero"
        className="relative min-h-[100svh] flex flex-col justify-between pt-28 sm:pt-32 pb-10 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto overflow-hidden select-none"
      >
        {/* Dynamic Background Halo for Parallax Depth */}
        <div
          ref={ambientHaloRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[500px] sm:h-[600px] bg-radial-glow opacity-30 pointer-events-none -z-10 blur-3xl will-change-transform"
        />

        {/* 1. Top Telemetry & Index Bar */}
        <div
          ref={topBarRef}
          className="flex items-center justify-between text-[11px] font-mono text-[#8A8A8A] mb-8 border-b border-white/[0.06] pb-3"
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-white">
              <Terminal className="w-3 h-3 text-emerald-400" />
              <span>INDEX 01</span>
            </span>
            <span className="hidden sm:inline tracking-widest text-[#737373]">
              PORTFOLIO CORE // 2026
            </span>
          </div>

          <div className="flex items-center gap-2 text-emerald-400">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span className="tracking-wider text-[11px]">{HERO_CONTENT.status}</span>
          </div>
        </div>

        {/* 2. Main Editorial Grid: Typography (Left) + 360° Portrait (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center my-auto w-full">
          
          {/* Left Column: Masked Display Typography & Copy */}
          <div
            ref={textContainerRef}
            className="lg:col-span-7 flex flex-col justify-center z-10 will-change-transform"
          >
            {/* Small Editorial Identity Eyebrow */}
            <div
              ref={eyebrowRef}
              className="flex items-center gap-3 text-xs sm:text-sm font-mono tracking-[0.25em] text-[#8A8A8A] uppercase mb-4 sm:mb-6"
            >
              <span className="w-6 h-[1.5px] bg-emerald-400" />
              <span className="text-white/90 font-medium">{HERO_CONTENT.eyebrow}</span>
            </div>

            {/* Display Words with Masked Overflow */}
            <div className="space-y-1 sm:space-y-2 mb-6 sm:mb-8">
              {/* Word 1: SOFTWARE */}
              <div className="overflow-hidden">
                <span
                  ref={word1Ref}
                  className="inline-block text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black font-display tracking-tight text-[#F5F5F5] leading-[0.88] uppercase will-change-transform"
                >
                  SOFTWARE
                </span>
              </div>

              {/* Word 2: ENGINEER */}
              <div className="overflow-hidden">
                <span
                  ref={word2Ref}
                  className="inline-block text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/40 leading-[0.88] uppercase will-change-transform"
                >
                  ENGINEER
                </span>
              </div>
            </div>

            {/* Concise Supporting Copy */}
            <p
              ref={descRef}
              className="text-base sm:text-lg md:text-xl text-[#8A8A8A] max-w-xl font-light leading-relaxed mb-8 sm:mb-10"
            >
              {HERO_CONTENT.description}
            </p>

            {/* Action CTAs */}
            <div ref={ctaGroupRef} className="flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                onClick={scrollToProjects}
                className="group relative inline-flex items-center gap-3 px-7 sm:px-9 py-4 rounded-full bg-white text-black font-semibold text-xs sm:text-sm tracking-widest hover:bg-emerald-400 transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.18)] hover:shadow-[0_0_35px_rgba(16,185,129,0.45)] cursor-pointer"
              >
                <span>{HERO_CONTENT.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="#contact"
                onClick={scrollToContact}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-4 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-[#F5F5F5] font-medium text-xs sm:text-sm tracking-widest transition-all duration-200 cursor-pointer"
              >
                <span>{HERO_CONTENT.ctaSecondary}</span>
              </a>
            </div>
          </div>

          {/* Right Column: 360-degree Rotating Portrait Visual */}
          <div
            ref={portraitContainerRef}
            className="lg:col-span-5 flex justify-center lg:justify-end z-0 will-change-transform"
          >
            <HeroPortrait ref={portraitRef} isReady={isReady} />
          </div>
        </div>

        {/* 3. Bottom Telemetry & Scroll Prompt */}
        <div
          ref={bottomBarRef}
          className="flex items-center justify-between pt-6 sm:pt-8 border-t border-white/[0.06] text-[#8A8A8A] text-xs font-mono"
        >
          <div className="flex items-center gap-2.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="tracking-widest text-[#A3A3A3]">KARACHI, PK · UTC+5</span>
          </div>

          <div className="flex items-center gap-2 tracking-widest text-[11px] text-emerald-400/90 animate-bounce">
            <span>{HERO_CONTENT.helper}</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </div>
        </div>
      </section>
    </div>
  );
};
