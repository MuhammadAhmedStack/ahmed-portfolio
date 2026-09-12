import React, { useRef, useEffect } from 'react';
import { ENGINEERING_APPROACH } from '../../data/portfolio';
import { ArrowRight } from 'lucide-react';
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
              <span className="text-emerald-400 font-bold">07 //</span>
              <span>METHODOLOGY</span>
            </div>

            <h2 className="text-[clamp(1.85rem,5vw,3.75rem)] font-black font-display text-white tracking-tight uppercase leading-[0.92]">
              ENGINEERING
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/40">
                APPROACH
              </span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm font-mono text-[#8A8A8A] max-w-sm leading-relaxed md:text-right">
            Systematic 6-stage lifecycle prioritizing requirement clarity, clean architecture, edge-case testing, and production speed.
          </p>
        </div>

        {/* Process Pipeline Matrix */}
        <div ref={trackRef} className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 relative z-10">
            {ENGINEERING_APPROACH.map((item, index) => {
              const isLast = index === ENGINEERING_APPROACH.length - 1;

              return (
                <div
                  key={item.step}
                  ref={(el) => {
                    stepCardsRef.current[index] = el;
                  }}
                  className="p-5 sm:p-7 rounded-2xl bg-[#080808] border border-white/[0.08] hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between group shadow-xl relative overflow-hidden"
                >
                  <div>
                    {/* Step Top Bar */}
                    <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-5 pb-3 border-b border-white/[0.06]">
                      <span className="font-bold tracking-widest text-sm">
                        {item.step} //
                      </span>
                      <span className="text-xs text-[#8A8A8A] font-mono tracking-widest">
                        0{index + 1} / 06
                      </span>
                    </div>

                    {/* Step Title */}
                    <h3 className="text-lg sm:text-xl font-bold font-display text-white mb-2.5 tracking-tight group-hover:text-emerald-300 transition-colors uppercase">
                      {item.title}
                    </h3>

                    {/* Step Description */}
                    <p className="text-xs sm:text-sm text-[#A3A3A3] font-light leading-relaxed mb-6">
                      {item.description}
                    </p>
                  </div>

                  {/* Step Footer Flow Indicator */}
                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-[#737373]">
                    <span className="tracking-wider text-[11px]">
                      {isLast ? 'FINAL STAGE' : `STAGE 0${index + 1}`}
                    </span>
                    {!isLast ? (
                      <ArrowRight className="w-3.5 h-3.5 text-[#525252] group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                    ) : (
                      <span className="text-emerald-400 font-bold text-[11px] tracking-wider">DEPLOYED</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
