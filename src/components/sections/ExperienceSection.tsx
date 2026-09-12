import React, { useRef, useEffect } from 'react';
import { EXPERIENCES } from '../../data/experience';
import { Briefcase, Building2, MapPin } from 'lucide-react';
import { SpotlightCard } from '../ui/SpotlightCard';
import { gsap } from '../../lib/gsap';

export const ExperienceSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([headerRef.current, ...cardsRef.current], { opacity: 1, y: 0 });
        return;
      }

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

      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { opacity: 0, y: 35 },
          {
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.15,
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
      id="experience"
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
              <span className="text-emerald-400 font-bold">06 //</span>
              <span>CAREER</span>
            </div>

            <h2 className="text-[clamp(1.85rem,5vw,3.75rem)] font-black font-display text-white tracking-tight uppercase leading-[0.92]">
              PROFESSIONAL
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/40">
                EXPERIENCE
              </span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm font-mono text-[#8A8A8A] max-w-sm leading-relaxed md:text-right">
            Verified software and web development roles adhering to documented professional track record.
          </p>
        </div>

        {/* Experience Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {EXPERIENCES.map((item, index) => {
            return (
              <div
                key={item.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
              >
                <SpotlightCard
                  enableTilt={true}
                  spotlightColor="rgba(16, 185, 129, 0.16)"
                  className="p-5 sm:p-8 lg:p-10 rounded-2xl bg-[#080808]/90 border border-white/[0.08] hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between group shadow-2xl relative overflow-hidden h-full"
                >
                  <div>
                    {/* Meta Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-emerald-400 mb-6 pb-4 border-b border-white/[0.06]">
                      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 font-medium">
                        <Briefcase className="w-3 h-3" />
                        {item.type}
                      </span>

                      <span className="text-xs text-[#8A8A8A] font-mono tracking-wider">
                        {item.period}
                      </span>
                    </div>

                    {/* Company Name */}
                    <div className="flex items-center gap-2 text-xs font-mono text-[#A3A3A3] mb-2 uppercase tracking-widest">
                      <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{item.company}</span>
                    </div>

                    {/* Role Title */}
                    <h3 className="text-2xl sm:text-3xl font-bold font-display text-white mb-3 tracking-tight group-hover:text-emerald-300 transition-colors">
                      {item.role}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-xs font-mono text-[#737373] mb-6">
                      <MapPin className="w-3 h-3 text-[#525252]" />
                      <span>{item.location}</span>
                    </div>

                    {/* Summary */}
                    <p className="text-sm sm:text-base text-[#B3B3B3] font-light leading-relaxed mb-8">
                      {item.summary}
                    </p>
                  </div>

                  {/* Skills Footer */}
                  <div>
                    <div className="text-[11px] font-mono text-[#737373] mb-2.5 tracking-wider">
                      APPLIED TECHNOLOGIES:
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/[0.06]">
                      {item.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs font-mono text-[#D4D4D4] group-hover:border-white/[0.12] transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
