import React, { useRef, useEffect } from 'react';
import { ENGINEERING_APPROACH } from '../../data/portfolio';
import { ArrowRight, CheckCircle2, Cpu } from 'lucide-react';
import { gsap } from '../../lib/gsap';

export const ApproachSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stepCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([headerRef.current, ...stepCardsRef.current], { opacity: 1, y: 0 });
        return;
      }

      // 1. Header entrance
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        {
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        }
      );

      // 2. Sequential card progression
      stepCardsRef.current.forEach((card, idx) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { opacity: 0, y: 30 },
          {
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: (idx % 3) * 0.12,
            ease: 'power3.out',
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="approach"
      className="relative py-28 sm:py-36 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-white/[0.06] overflow-hidden"
    >
      {/* Background Watermark Index */}
      <div className="absolute top-12 right-6 lg:right-12 text-[100px] sm:text-[140px] font-black font-display text-white/[0.015] select-none pointer-events-none -z-10 leading-none">
        07
      </div>

      {/* Top Header */}
      <div
        ref={headerRef}
        className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-24 border-b border-white/[0.06] pb-6"
      >
        <div>
          <div className="flex items-center gap-3 text-xs font-mono text-[#8A8A8A] tracking-widest uppercase mb-4">
            <span className="text-emerald-400 font-bold">07 //</span>
            <span>METHODOLOGY & EXECUTION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display text-white tracking-tight uppercase leading-[0.92]">
            ENGINEERING
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/40">
              APPROACH
            </span>
          </h2>
        </div>

        <p className="text-xs sm:text-sm font-mono text-[#8A8A8A] max-w-md mt-6 md:mt-0 leading-relaxed">
          How I architect and deliver software. A systematic 6-stage lifecycle prioritizing requirement clarity, clean architecture, edge-case testing, and production speed.
        </p>
      </div>

      {/* Process Pipeline Matrix */}
      <div ref={trackRef} className="relative">
        
        {/* Desktop Pipeline Connecting Dividers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 relative z-10">
          {ENGINEERING_APPROACH.map((item, index) => {
            return (
              <div
                key={item.step}
                ref={(el) => {
                  stepCardsRef.current[index] = el;
                }}
                className="p-7 sm:p-8 rounded-2xl bg-[#080808] border border-white/[0.07] hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between group shadow-xl relative overflow-hidden"
              >
                {/* Subtle Hover Glow Corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.02] rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/[0.06] transition-all" />

                <div>
                  {/* Step Top Bar */}
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-6 pb-3 border-b border-white/[0.05]">
                    <span className="font-bold tracking-widest text-sm">
                      {item.step} //
                    </span>
                    <span className="text-[10px] text-[#737373] tracking-wider uppercase flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-emerald-400/80" />
                      <span>PHASE 0{index + 1}</span>
                    </span>
                  </div>

                  {/* Step Title */}
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white mb-3 tracking-tight group-hover:text-emerald-300 transition-colors uppercase">
                    {item.title}
                  </h3>

                  {/* Step Description */}
                  <p className="text-xs sm:text-sm text-[#A3A3A3] font-light leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Step Footer Indicator */}
                <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-[#525252]">
                  <span className="flex items-center gap-1 text-emerald-400/80">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>SYSTEMATIC</span>
                  </span>
                  {index < ENGINEERING_APPROACH.length - 1 ? (
                    <ArrowRight className="w-3.5 h-3.5 text-[#525252] group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                  ) : (
                    <span className="text-emerald-400 font-bold">DEPLOYED</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
