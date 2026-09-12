import React, { useRef, useEffect } from 'react';
import { JOURNEY_MILESTONES } from '../../data/journey';
import { Calendar, GraduationCap, Briefcase, Rocket, Terminal } from 'lucide-react';
import { gsap, ScrollTrigger } from '../../lib/gsap';

export const JourneySection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const milestonesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([headerRef.current, lineRef.current, ...milestonesRef.current], {
          opacity: 1,
          scaleY: 1,
          y: 0,
        });
        return;
      }

      // Initial state
      gsap.set(headerRef.current, { opacity: 0, y: 30 });
      if (lineRef.current) {
        gsap.set(lineRef.current, { scaleY: 0, transformOrigin: 'top center' });
      }
      milestonesRef.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0.25, y: 20 });
      });

      // 1. Header reveal
      gsap.to(headerRef.current, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      // 2. Progressive line draw tied to scroll
      if (lineRef.current) {
        gsap.to(lineRef.current, {
          scrollTrigger: {
            trigger: section,
            start: 'top 65%',
            end: 'bottom 85%',
            scrub: 0.5,
          },
          scaleY: 1,
          ease: 'none',
        });
      }

      // 3. Sequential activation of each milestone
      milestonesRef.current.forEach((el, index) => {
        if (!el) return;

        ScrollTrigger.create({
          trigger: el,
          start: 'top 75%',
          end: 'bottom 40%',
          onEnter: () => {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
            });
            const node = el.querySelector('.journey-node');
            const card = el.querySelector('.journey-card');
            if (node) {
              node.classList.add('border-emerald-400', 'bg-emerald-500/20');
              node.classList.remove('border-white/20', 'bg-[#050505]');
            }
            if (card) {
              card.classList.add('border-white/20', 'bg-[#0A0A0A]');
              card.classList.remove('border-white/[0.06]', 'bg-[#070707]');
            }
          },
          onLeaveBack: () => {
            if (index > 0) {
              gsap.to(el, { opacity: 0.35, duration: 0.4 });
              const node = el.querySelector('.journey-node');
              const card = el.querySelector('.journey-card');
              if (node) {
                node.classList.remove('border-emerald-400', 'bg-emerald-500/20');
                node.classList.add('border-white/20', 'bg-[#050505]');
              }
              if (card) {
                card.classList.remove('border-white/20', 'bg-[#0A0A0A]');
                card.classList.add('border-white/[0.06]', 'bg-[#070707]');
              }
            }
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'EDUCATION':
        return <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />;
      case 'WORK':
        return <Briefcase className="w-3.5 h-3.5 text-emerald-400" />;
      case 'ENGINEERING':
        return <Rocket className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Calendar className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative py-28 sm:py-36 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-white/[0.06] overflow-hidden"
    >
      {/* Background Watermark Index */}
      <div className="absolute top-12 right-6 lg:right-12 text-[100px] sm:text-[140px] font-black font-display text-white/[0.015] select-none pointer-events-none -z-10 leading-none">
        04
      </div>

      {/* Top Header */}
      <div
        ref={headerRef}
        className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-24 border-b border-white/[0.06] pb-6"
      >
        <div>
          <div className="flex items-center gap-3 text-xs font-mono text-[#8A8A8A] tracking-widest uppercase mb-4">
            <span className="text-emerald-400 font-bold">04 //</span>
            <span>ENGINEERING TRAJECTORY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display text-white tracking-tight uppercase leading-[0.92]">
            DEVELOPER
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/40">
              JOURNEY
            </span>
          </h2>
        </div>

        <p className="text-xs sm:text-sm font-mono text-[#8A8A8A] max-w-md mt-6 md:mt-0 leading-relaxed">
          Chronological evolution from computer science foundations at SSUET to shipping full-stack mobile applications and AI products.
        </p>
      </div>

      {/* Timeline Container */}
      <div className="relative max-w-5xl mx-auto">
        {/* Background Vertical Guide Track */}
        <div className="absolute left-6 sm:left-12 lg:left-1/2 top-4 bottom-8 w-[2px] bg-white/[0.06] -translate-x-1/2" />

        {/* Dynamic Progress Line (Grows with Scroll) */}
        <div
          ref={lineRef}
          className="absolute left-6 sm:left-12 lg:left-1/2 top-4 bottom-8 w-[2px] bg-gradient-to-b from-emerald-400 via-emerald-300 to-white/40 -translate-x-1/2 will-change-transform shadow-[0_0_12px_rgba(16,185,129,0.5)]"
        />

        {/* Milestones List */}
        <div className="space-y-12 sm:space-y-20 relative z-10">
          {JOURNEY_MILESTONES.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={item.year}
                ref={(el) => {
                  milestonesRef.current[index] = el;
                }}
                className={`relative flex flex-col lg:flex-row items-start lg:items-center gap-6 sm:gap-10 transition-all duration-300 ${
                  isEven ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Center Node Marker */}
                <div className="absolute left-6 sm:left-12 lg:left-1/2 top-1.5 sm:top-1/2 -translate-x-1/2 lg:-translate-y-1/2 z-20">
                  <div className="journey-node w-5 h-5 rounded-full border-2 border-white/20 bg-[#050505] transition-all duration-300 flex items-center justify-center shadow-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                </div>

                {/* Left/Right Milestone Content Card */}
                <div
                  className={`w-full lg:w-[calc(50%-3rem)] ml-14 sm:ml-24 lg:ml-0 ${
                    isEven ? 'lg:text-left' : 'lg:text-left'
                  }`}
                >
                  <div className="journey-card p-6 sm:p-8 rounded-2xl bg-[#070707] border border-white/[0.06] transition-all duration-300 hover:border-emerald-500/30 shadow-xl group">
                    
                    {/* Year & Category Header */}
                    <div className="flex items-center justify-between gap-3 mb-3 text-xs font-mono">
                      <div className="flex items-center gap-2 text-emerald-400">
                        {getCategoryIcon(item.category)}
                        <span className="font-bold tracking-widest text-sm">{item.year}</span>
                      </div>

                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-[10px] text-[#8A8A8A] font-mono tracking-wider">
                        {item.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-white mb-3 tracking-tight group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </h3>

                    {/* Narrative Description */}
                    <p className="text-xs sm:text-sm text-[#8A8A8A] leading-relaxed font-light">
                      {item.description}
                    </p>

                    {/* Subtle Corner Marker */}
                    <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-[#525252]">
                      <span>STAGE 0{index + 1}</span>
                      <span className="flex items-center gap-1 text-emerald-400/80">
                        <Terminal className="w-3 h-3" />
                        <span>VERIFIED</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Spacer for opposite side on Desktop */}
                <div className="hidden lg:block lg:w-[calc(50%-3rem)]" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
