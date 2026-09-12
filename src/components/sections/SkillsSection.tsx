import React, { useState, useRef, useEffect } from 'react';
import { SKILL_CATEGORIES } from '../../data/skills';
import { ArrowRight, CheckCircle2, Cpu, Sparkles } from 'lucide-react';
import { gsap } from '../../lib/gsap';

export const SkillsSection: React.FC = () => {
  const [activeCategoryId, setActiveCategoryId] = useState(SKILL_CATEGORIES[0].id);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const categoryListRef = useRef<HTMLDivElement | null>(null);
  const stageCardRef = useRef<HTMLDivElement | null>(null);
  const techGridRef = useRef<HTMLDivElement | null>(null);

  const activeCategory =
    SKILL_CATEGORIES.find((c) => c.id === activeCategoryId) || SKILL_CATEGORIES[0];

  // 1. Initial Scroll Entrance Animation
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([headerRef.current, categoryListRef.current, stageCardRef.current], {
          opacity: 1,
          y: 0,
        });
        return;
      }

      gsap.set([headerRef.current, stageCardRef.current], {
        opacity: 0,
        y: 30,
      });
      if (categoryListRef.current) {
        gsap.set(categoryListRef.current.children, {
          opacity: 0,
          x: -25,
        });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
        defaults: { ease: 'power3.out' },
      });

      tl
        // 1. Header reveal
        .to(headerRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
        })
        // 2. Categories reveal sequentially
        .to(
          categoryListRef.current?.children || [],
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power2.out',
          },
          '-=0.4'
        )
        // 3. Stage card reveals
        .to(
          stageCardRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
          },
          '-=0.5'
        );
    }, section);

    return () => ctx.revert();
  }, []);

  // 2. Animated Category Switch Transition
  const switchCategory = (id: string) => {
    if (id === activeCategoryId) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setActiveCategoryId(id);
      return;
    }

    const techGrid = techGridRef.current;
    if (!techGrid) {
      setActiveCategoryId(id);
      return;
    }

    // Animate out old category skills quickly
    gsap.to(techGrid.children, {
      opacity: 0,
      y: -10,
      duration: 0.15,
      stagger: 0.02,
      ease: 'power2.in',
      onComplete: () => {
        setActiveCategoryId(id);
        // Once state updates, animate in new category skills
        requestAnimationFrame(() => {
          if (techGridRef.current) {
            gsap.fromTo(
              techGridRef.current.children,
              { opacity: 0, y: 12 },
              {
                opacity: 1,
                y: 0,
                duration: 0.35,
                stagger: 0.04,
                ease: 'power3.out',
              }
            );
          }
        });
      },
    });
  };

  // Keyboard Navigation handler for category tabs
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (index + 1) % SKILL_CATEGORIES.length;
      switchCategory(SKILL_CATEGORIES[nextIndex].id);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (index - 1 + SKILL_CATEGORIES.length) % SKILL_CATEGORIES.length;
      switchCategory(SKILL_CATEGORIES[prevIndex].id);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative py-28 sm:py-36 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-white/[0.06] overflow-hidden"
    >
      {/* Background Watermark Index */}
      <div className="absolute top-12 right-6 lg:right-12 text-[100px] sm:text-[140px] font-black font-display text-white/[0.015] select-none pointer-events-none -z-10 leading-none">
        03
      </div>

      {/* Top Section Header */}
      <div
        ref={headerRef}
        className="flex flex-col md:flex-row md:items-end justify-between mb-14 sm:mb-20 border-b border-white/[0.06] pb-6"
      >
        <div>
          <div className="flex items-center gap-3 text-xs font-mono text-[#8A8A8A] tracking-widest uppercase mb-4">
            <span className="text-emerald-400 font-bold">03 //</span>
            <span>EXPERTISE & ARCHITECTURE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display text-white tracking-tight uppercase leading-[0.92]">
            TECHNICAL
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/40">
              SPECIALIZATION
            </span>
          </h2>
        </div>

        <p className="text-xs sm:text-sm font-mono text-[#8A8A8A] max-w-md mt-6 md:mt-0 leading-relaxed">
          Production capabilities deployed across verified mobile, backend systems, and AI-assisted workflows. No arbitrary proficiency scores.
        </p>
      </div>

      {/* Main Interactive Editorial Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Editorial Category Selector (Interactive Menu) */}
        <div
          ref={categoryListRef}
          role="tablist"
          aria-label="Expertise Categories"
          className="lg:col-span-5 flex flex-col gap-2"
        >
          {SKILL_CATEGORIES.map((category, index) => {
            const isActive = category.id === activeCategoryId;
            const formattedIndex = (index + 1).toString().padStart(2, '0');

            return (
              <button
                key={category.id}
                role="tab"
                id={`tab-${category.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${category.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => switchCategory(category.id)}
                onMouseEnter={() => switchCategory(category.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`w-full text-left p-5 sm:p-6 rounded-xl transition-all duration-300 flex items-center justify-between group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  isActive
                    ? 'bg-[#0A0A0A] border border-emerald-500/40 shadow-[0_4px_30px_rgba(16,185,129,0.08)] translate-x-1 sm:translate-x-2'
                    : 'bg-transparent border border-white/[0.04] hover:border-white/[0.12] hover:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Category Index */}
                  <span
                    className={`text-xs font-mono tracking-wider transition-colors ${
                      isActive ? 'text-emerald-400 font-bold' : 'text-[#525252] group-hover:text-[#8A8A8A]'
                    }`}
                  >
                    {formattedIndex} //
                  </span>

                  {/* Category Name */}
                  <span
                    className={`text-lg sm:text-2xl font-bold font-display tracking-wide uppercase transition-colors ${
                      isActive ? 'text-white' : 'text-white/40 group-hover:text-white/80'
                    }`}
                  >
                    {category.name}
                  </span>
                </div>

                {/* Active Indicator Arrow */}
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rotate-0'
                      : 'opacity-0 text-[#525252] -rotate-45 group-hover:opacity-60'
                  }`}
                >
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Active Category Stage */}
        <div
          ref={stageCardRef}
          role="tabpanel"
          id={`panel-${activeCategory.id}`}
          aria-labelledby={`tab-${activeCategory.id}`}
          className="lg:col-span-7 rounded-2xl bg-[#0A0A0A] border border-white/[0.08] p-7 sm:p-10 relative overflow-hidden min-h-[440px] flex flex-col justify-between shadow-2xl"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none" />

          <div>
            {/* Stage Header */}
            <div className="flex items-center justify-between text-xs font-mono text-[#8A8A8A] mb-4 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 text-emerald-400">
                <Cpu className="w-4 h-4" />
                <span className="tracking-widest font-semibold">{activeCategory.name} ARCHITECTURE</span>
              </div>
              <span className="text-[11px] text-[#737373]">
                {activeCategory.skills.length} VERIFIED TECHNOLOGIES
              </span>
            </div>

            {/* Narrative Description */}
            <p className="text-sm sm:text-base text-[#D4D4D4] font-light leading-relaxed mb-8 max-w-2xl">
              {activeCategory.description}
            </p>

            {/* Technology Items Matrix */}
            <div
              ref={techGridRef}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
            >
              {activeCategory.skills.map((skill, sIdx) => {
                const techNumber = (sIdx + 1).toString().padStart(2, '0');

                return (
                  <div
                    key={skill.name}
                    className={`p-4 sm:p-5 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                      skill.isPrimary
                        ? 'bg-[#111111] border-emerald-500/25 hover:border-emerald-500/50'
                        : 'bg-[#0e0e0e] border-white/[0.06] hover:border-white/[0.15]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-[#525252] group-hover:text-emerald-400/80 transition-colors">
                        {techNumber}
                      </span>
                      <span className="text-sm sm:text-base font-medium text-white font-display tracking-tight">
                        {skill.name}
                      </span>
                    </div>

                    {skill.isPrimary && (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/[0.08] border border-emerald-500/25 text-[10px] font-mono text-emerald-300 font-semibold tracking-wider">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>CORE</span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Telemetry Footer */}
          <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#737373]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>STACK CERTIFIED // DOCUMENTED CODEBASE</span>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>PRODUCTION GRADE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
