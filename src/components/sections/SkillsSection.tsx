import React, { useState, useRef, useEffect } from 'react';
import { SKILL_CATEGORIES } from '../../data/skills';
import { ArrowRight, CheckCircle2, Cpu } from 'lucide-react';
import { SpotlightCard } from '../ui/SpotlightCard';
import { BorderBeam } from '../ui/BorderBeam';
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
      className="editorial-section"
    >
      <div className="editorial-container">
        {/* Standard Editorial Section Header */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 lg:mb-20 pb-6 border-b border-white/[0.08] gap-4"
        >
          <div>
            <div className="flex items-center gap-2.5 text-xs font-mono text-[#8A8A8A] tracking-[0.2em] uppercase mb-3">
              <span className="text-emerald-400 font-bold">03 //</span>
              <span>EXPERTISE</span>
            </div>

            <h2 className="text-[clamp(1.85rem,5vw,3.75rem)] font-black font-display text-white tracking-tight uppercase leading-[0.92]">
              TECHNICAL
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/40">
                SPECIALIZATION
              </span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm font-mono text-[#8A8A8A] max-w-sm leading-relaxed md:text-right">
            Production capabilities deployed across verified mobile, backend systems, and AI-assisted workflows.
          </p>
        </div>

        {/* Main Interactive Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          {/* Left Column: Category Navigation */}
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
                  onMouseEnter={() => {
                    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
                      switchCategory(category.id);
                    }
                  }}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`w-full text-left p-3.5 sm:p-5 rounded-2xl transition-all duration-300 flex items-center justify-between group cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                    isActive
                      ? 'bg-[#0A0A0A] border border-emerald-500/40 shadow-[0_4px_30px_rgba(16,185,129,0.08)] translate-x-1'
                      : 'bg-transparent border border-white/[0.04] hover:border-white/[0.12] hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
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
                      className={`text-base sm:text-lg lg:text-xl font-bold font-display tracking-wide uppercase transition-colors ${
                        isActive ? 'text-white' : 'text-white/40 group-hover:text-white/80'
                      }`}
                    >
                      {category.name}
                    </span>
                  </div>

                  {/* Active Indicator Arrow */}
                  <div
                    className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'opacity-0 text-[#525252] group-hover:opacity-60'
                    }`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Category Stage */}
          <div ref={stageCardRef} className="lg:col-span-7">
            <SpotlightCard
              role="tabpanel"
              id={`panel-${activeCategory.id}`}
              aria-labelledby={`tab-${activeCategory.id}`}
              spotlightColor="rgba(16, 185, 129, 0.18)"
              className="rounded-2xl bg-[#080808]/90 border border-white/[0.08] p-4 sm:p-8 lg:p-10 relative overflow-hidden min-h-[400px] flex flex-col justify-between shadow-2xl"
            >
              <BorderBeam duration={9} colorFrom="#10b981" colorTo="#ffffff" />
              <div>
                {/* Stage Header */}
                <div className="flex items-center justify-between text-xs font-mono text-[#8A8A8A] mb-5 pb-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Cpu className="w-4 h-4" />
                    <span className="tracking-widest font-semibold">{activeCategory.name} ARCHITECTURE</span>
                  </div>
                  <span className="text-[11px] text-[#737373]">
                    {activeCategory.skills.length} TECHNOLOGIES
                  </span>
                </div>

              {/* Narrative Description */}
              <p className="text-sm sm:text-base text-[#D4D4D4] font-light leading-relaxed mb-8 max-w-2xl">
                {activeCategory.description}
              </p>

              {/* Technology Items Matrix */}
              <div
                ref={techGridRef}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {activeCategory.skills.map((skill, sIdx) => {
                  const techNumber = (sIdx + 1).toString().padStart(2, '0');

                  return (
                    <div
                      key={skill.name}
                      className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                        skill.isPrimary
                          ? 'bg-[#111111] border-emerald-500/25 hover:border-emerald-500/50'
                          : 'bg-[#0c0c0c] border-white/[0.06] hover:border-white/[0.15]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-[11px] font-mono text-[#525252] group-hover:text-emerald-400/80 transition-colors">
                          {techNumber}
                        </span>
                        <span className="text-sm sm:text-base font-medium text-white font-display tracking-tight">
                          {skill.name}
                        </span>
                      </div>

                      {skill.isPrimary && (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/[0.08] border border-emerald-500/25 text-[10px] font-mono text-emerald-300 font-semibold tracking-wider">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>CORE</span>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </SpotlightCard>
        </div>
        </div>
      </div>
    </section>
  );
};
