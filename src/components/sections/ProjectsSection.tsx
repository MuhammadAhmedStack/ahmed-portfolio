import React, { useRef, useEffect } from 'react';
import { PROJECTS } from '../../data/projects';
import { ProjectDeviceMockup } from '../projects/ProjectDeviceMockup';
import { CheckCircle2, Mic, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { gsap } from '../../lib/gsap';

export const ProjectsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const projectCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([headerRef.current, ...projectCardsRef.current], {
          opacity: 1,
          y: 0,
        });
        return;
      }

      // 1. Header Entrance
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

      // 2. Individual Project Reveals
      projectCardsRef.current.forEach((card) => {
        if (!card) return;

        const textContent = card.querySelector('.project-text');
        const mediaContent = card.querySelector('.project-media');
        const featureItems = card.querySelectorAll('.feature-item');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
          defaults: { ease: 'power3.out' },
        });

        tl.fromTo(
          card,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8 }
        )
          .fromTo(
            mediaContent,
            { scale: 0.94, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.9, ease: 'power2.out' },
            '-=0.6'
          )
          .fromTo(
            textContent,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.8 },
            '-=0.7'
          )
          .fromTo(
            featureItems,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
            '-=0.5'
          );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative py-28 sm:py-36 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-white/[0.06] overflow-hidden"
    >
      {/* Background Watermark Index */}
      <div className="absolute top-12 right-6 lg:right-12 text-[100px] sm:text-[140px] font-black font-display text-white/[0.015] select-none pointer-events-none -z-10 leading-none">
        05
      </div>

      {/* Top Header */}
      <div
        ref={headerRef}
        className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-24 border-b border-white/[0.06] pb-6"
      >
        <div>
          <div className="flex items-center gap-3 text-xs font-mono text-[#8A8A8A] tracking-widest uppercase mb-4">
            <span className="text-emerald-400 font-bold">05 //</span>
            <span>VERIFIED CASE STUDIES</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display text-white tracking-tight uppercase leading-[0.92]">
            FLAGSHIP
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/40">
              PROJECTS
            </span>
          </h2>
        </div>

        <p className="text-xs sm:text-sm font-mono text-[#8A8A8A] max-w-md mt-6 md:mt-0 leading-relaxed">
          Deep-dive into verified mobile applications engineered with offline resilience, cloud security, and production AI integration.
        </p>
      </div>

      {/* Flagship Projects Showcase List */}
      <div className="space-y-24 sm:space-y-36">
        {PROJECTS.map((project, index) => {
          const isReversed = index % 2 !== 0;

          return (
            <div
              key={project.id}
              ref={(el) => {
                projectCardsRef.current[index] = el;
              }}
              className="rounded-3xl border border-white/[0.08] bg-[#070707] p-7 sm:p-12 lg:p-14 relative overflow-hidden shadow-2xl transition-all duration-300 hover:border-white/[0.16]"
            >
              {/* Radial Accent Glow */}
              <div
                className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-10 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${project.accentColor} 0%, transparent 70%)` }}
              />

              <div
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center ${
                  isReversed ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Left/Right Project Narrative Column */}
                <div
                  className={`project-text lg:col-span-7 flex flex-col justify-between ${
                    isReversed ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div>
                    {/* Project Number & Status */}
                    <div className="flex items-center gap-3 text-xs font-mono text-emerald-400 mb-4 tracking-widest">
                      <span className="font-bold text-sm">{project.number} //</span>
                      <span>FLAGSHIP MOBILE PRODUCT</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display text-white mb-2 tracking-tight uppercase">
                      {project.title}
                    </h3>

                    {/* Subtitle */}
                    <div className="text-xs sm:text-sm font-mono text-[#8A8A8A] tracking-wider uppercase mb-6 flex items-center gap-2">
                      <span className="w-4 h-[1.5px] bg-emerald-400 inline-block" />
                      <span>{project.subtitle}</span>
                    </div>

                    {/* Approved Description */}
                    <p className="text-sm sm:text-base text-[#B3B3B3] font-light leading-relaxed mb-8 max-w-2xl">
                      {project.description}
                    </p>

                    {/* Awaaz Khata Visual Workflow Narrative (Only for Awaaz Khata) */}
                    {project.id === 'awaaz-khata' && (
                      <div className="mb-8 p-4 rounded-xl bg-[#0F0F0F] border border-white/[0.08]">
                        <div className="text-[11px] font-mono text-emerald-400 mb-3 flex items-center gap-2">
                          <Mic className="w-3.5 h-3.5" />
                          <span className="tracking-widest">INTERACTION PIPELINE</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px] font-mono">
                          <div className="p-2.5 rounded bg-black/60 border border-white/[0.06] flex flex-col items-center">
                            <span className="text-emerald-400 font-bold mb-1">01 VOICE</span>
                            <span className="text-[#8A8A8A]">Urdu Speech</span>
                          </div>
                          <div className="p-2.5 rounded bg-black/60 border border-white/[0.06] flex flex-col items-center">
                            <span className="text-emerald-400 font-bold mb-1">02 AI PARSER</span>
                            <span className="text-[#8A8A8A]">JSON Intent</span>
                          </div>
                          <div className="p-2.5 rounded bg-black/60 border border-white/[0.06] flex flex-col items-center">
                            <span className="text-emerald-400 font-bold mb-1">03 CONFIRM</span>
                            <span className="text-[#8A8A8A]">Shopkeeper UI</span>
                          </div>
                          <div className="p-2.5 rounded bg-black/60 border border-white/[0.06] flex flex-col items-center">
                            <span className="text-emerald-400 font-bold mb-1">04 LEDGER</span>
                            <span className="text-[#8A8A8A]">PostgreSQL DB</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PakawNow Architectural Highlight Feature Strip */}
                    {project.id === 'pakawnow' && (
                      <div className="mb-8 p-4 rounded-xl bg-[#0F0F0F] border border-white/[0.08]">
                        <div className="text-[11px] font-mono text-emerald-400 mb-3 flex items-center gap-2">
                          <Cpu className="w-3.5 h-3.5" />
                          <span className="tracking-widest">SYSTEM ARCHITECTURE HIGHLIGHTS</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-[#A3A3A3]">
                          <div className="p-2.5 rounded bg-black/60 border border-white/[0.06] flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Offline Fuzzy PKR Pricing</span>
                          </div>
                          <div className="p-2.5 rounded bg-black/60 border border-white/[0.06] flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Expiry "Use It / Lose It"</span>
                          </div>
                          <div className="p-2.5 rounded bg-black/60 border border-white/[0.06] flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Pantry Auto-Migration</span>
                          </div>
                          <div className="p-2.5 rounded bg-black/60 border border-white/[0.06] flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Offline-First Fallbacks</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Feature Highlights List */}
                    {project.features && (
                      <div className="mb-8">
                        <div className="text-xs font-mono text-white/80 mb-3 tracking-wider flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>CORE CAPABILITIES</span>
                        </div>
                        <div className="space-y-2.5">
                          {project.features.map((feat, fIdx) => (
                            <div
                              key={fIdx}
                              className="feature-item flex items-start gap-2.5 text-xs sm:text-sm text-[#A3A3A3] font-light leading-relaxed"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Technology Stack Chips */}
                    <div className="mb-8 pt-4 border-t border-white/[0.06]">
                      <div className="text-[11px] font-mono text-[#737373] mb-3 tracking-wider">
                        VERIFIED TECHNOLOGY STACK:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.stack.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-[#D4D4D4]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Project Action CTA */}
                  <div className="pt-2">
                    <a
                      href="#contact"
                      className="group inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 rounded-full bg-white text-black font-semibold text-xs font-mono tracking-wider hover:bg-emerald-400 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] cursor-pointer"
                    >
                      <span>{project.ctaText}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>

                {/* Right/Left Project Device Visual Column */}
                <div
                  className={`project-media lg:col-span-5 flex justify-center ${
                    isReversed ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <ProjectDeviceMockup
                    projectId={project.id}
                    accentColor={project.accentColor}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
