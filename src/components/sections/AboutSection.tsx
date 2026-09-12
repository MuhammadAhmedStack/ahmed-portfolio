import React, { useRef, useEffect } from 'react';
import { ABOUT_CONTENT, PERSONAL_INFO } from '../../data/portfolio';
import { ArrowUpRight } from 'lucide-react';
import { SpotlightCard } from '../ui/SpotlightCard';
import { BorderBeam } from '../ui/BorderBeam';
import { gsap } from '../../lib/gsap';

export const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const title1Ref = useRef<HTMLSpanElement | null>(null);
  const title2Ref = useRef<HTMLSpanElement | null>(null);
  const subtitleRef = useRef<HTMLHeadingElement | null>(null);
  const bioRef = useRef<HTMLParagraphElement | null>(null);
  const quoteRef = useRef<HTMLDivElement | null>(null);
  const metaContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          [
            headerRef.current,
            title1Ref.current,
            title2Ref.current,
            subtitleRef.current,
            bioRef.current,
            quoteRef.current,
            metaContainerRef.current?.children,
          ],
          { opacity: 1, y: 0, yPercent: 0, filter: 'none' }
        );
        return;
      }

      // Initial state
      gsap.set([headerRef.current, subtitleRef.current, bioRef.current, quoteRef.current], {
        opacity: 0,
        y: 24,
      });
      gsap.set([title1Ref.current, title2Ref.current], {
        yPercent: 120,
      });
      if (metaContainerRef.current) {
        gsap.set(metaContainerRef.current.children, {
          opacity: 0,
          x: 20,
        });
      }

      // ScrollTrigger timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
        defaults: { ease: 'power3.out' },
      });

      tl
        // 1. Header label
        .to(headerRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.7,
        })
        // 2. Large display name
        .to(
          title1Ref.current,
          {
            yPercent: 0,
            duration: 0.9,
            ease: 'power4.out',
          },
          '-=0.4'
        )
        .to(
          title2Ref.current,
          {
            yPercent: 0,
            duration: 0.9,
            ease: 'power4.out',
          },
          '-=0.7'
        )
        // 3. Subtitle / purpose heading
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          '-=0.5'
        )
        // 4. Biography
        .to(
          bioRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          '-=0.5'
        )
        // 5. Quote box
        .to(
          quoteRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          '-=0.5'
        )
        // 6. Metadata rows stagger
        .to(
          metaContainerRef.current?.children || [],
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power2.out',
          },
          '-=0.6'
        );
    }, section);

    return () => ctx.revert();
  }, []);

  const metadataItems = [
    {
      index: '01',
      label: 'BASED IN',
      value: PERSONAL_INFO.location,
      badge: 'UTC+5 · KARACHI',
    },
    {
      index: '02',
      label: 'EDUCATION',
      value: `${PERSONAL_INFO.education.degree}`,
      badge: `${PERSONAL_INFO.education.institution} (2022–2026)`,
    },
    {
      index: '03',
      label: 'FOCUS',
      value: PERSONAL_INFO.focus,
      badge: 'PRODUCTION SYSTEMS',
    },
    {
      index: '04',
      label: 'SPECIALIZATION',
      value: 'Mobile · Backend · AI',
      badge: 'FLAGSHIP PRODUCTS',
    },
    {
      index: '05',
      label: 'CURRENT STATUS',
      value: 'Available for Roles & Contracts',
      badge: 'ACTIVE',
      isAccent: true,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
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
              <span className="text-emerald-400 font-bold">02 //</span>
              <span>ABOUT & IDENTITY</span>
            </div>
            <h2 className="text-[clamp(1.85rem,5vw,3.75rem)] font-black font-display text-white tracking-tight uppercase leading-[0.92]">
              ENGINEERING
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/40">
                PHILOSOPHY
              </span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm font-mono text-[#8A8A8A] max-w-sm leading-relaxed md:text-right">
            Disciplined software engineering grounded in computer science fundamentals and provable architecture.
          </p>
        </div>

        {/* Main Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 items-start">
          {/* Left Column: Biography & Mentality */}
          <div className="lg:col-span-7 flex flex-col justify-start">
            {/* Masked Display Name */}
            <div className="space-y-1 mb-6">
              <div className="overflow-hidden">
                <span
                  ref={title1Ref}
                  className="block text-[clamp(1.85rem,6vw,4.25rem)] font-black font-display tracking-tight text-[#F5F5F5] leading-[0.88] uppercase will-change-transform"
                >
                  MUHAMMAD
                </span>
              </div>
              <div className="overflow-hidden">
                <span
                  ref={title2Ref}
                  className="block text-[clamp(1.85rem,6vw,4.25rem)] font-black font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/40 leading-[0.88] uppercase will-change-transform"
                >
                  AHMED
                </span>
              </div>
            </div>

            {/* Heading Statement */}
            <h3
              ref={subtitleRef}
              className="text-base sm:text-xl font-bold font-display text-emerald-400 tracking-wide uppercase mb-5 flex items-center gap-2"
            >
              <span className="w-4 h-[2px] bg-emerald-400 inline-block" />
              <span>{ABOUT_CONTENT.heading}</span>
            </h3>

            {/* Approved Biography Copy */}
            <p
              ref={bioRef}
              className="text-base sm:text-lg text-[#A3A3A3] font-light leading-relaxed mb-8 max-w-2xl"
            >
              {ABOUT_CONTENT.bio}
            </p>

            {/* Engineering Mentality Card */}
            <div ref={quoteRef}>
              <SpotlightCard
                enableTilt={true}
                className="p-6 sm:p-7 rounded-2xl bg-[#080808]/90 border border-white/[0.08] relative overflow-hidden transition-all duration-300 hover:border-emerald-500/30 shadow-xl"
              >
                <BorderBeam duration={10} colorFrom="#10b981" colorTo="#ffffff" />
                <div className="text-xs font-mono text-emerald-400 tracking-widest uppercase mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>PHILOSOPHY</span>
                </div>

                <p className="text-sm sm:text-base text-[#D4D4D4] font-light leading-relaxed mb-4">
                  "{PERSONAL_INFO.tagline}"
                </p>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-[#737373]">
                  <span>SOFTWARE ENGINEER</span>
                  <span className="text-[#8A8A8A]">FULL-STACK & MOBILE</span>
                </div>
              </SpotlightCard>
            </div>
          </div>

          {/* Right Column: Architectural Metadata */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <div className="text-xs font-mono text-[#8A8A8A] tracking-[0.2em] uppercase mb-4">
              SPECIFICATION
            </div>

            <div
              ref={metaContainerRef}
              className="space-y-3"
            >
              {metadataItems.map((item) => (
                <SpotlightCard
                  key={item.index}
                  spotlightColor={item.isAccent ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.08)'}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                    item.isAccent
                      ? 'bg-emerald-500/[0.03] border-emerald-500/25 hover:border-emerald-500/40'
                      : 'bg-[#080808] border-white/[0.08] hover:border-white/[0.16]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#8A8A8A] mb-1.5">
                    <span className="tracking-widest flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold">{item.index} //</span>
                      <span>{item.label}</span>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        item.isAccent
                          ? 'bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/30'
                          : 'bg-white/[0.04] text-[#A3A3A3]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <div className="text-sm sm:text-base font-medium text-white font-display">
                    {item.value}
                  </div>
                </SpotlightCard>
              ))}
            </div>

            {/* Verified LinkedIn Profile CTA */}
            <div className="mt-6 pt-4 border-t border-white/[0.06]">
              <a
                href={PERSONAL_INFO.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono text-[#8A8A8A] hover:text-white transition-colors group"
              >
                <span>View verified experience on LinkedIn</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
