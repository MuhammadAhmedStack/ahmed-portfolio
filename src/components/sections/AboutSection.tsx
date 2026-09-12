import React, { useRef, useEffect } from 'react';
import { ABOUT_CONTENT, PERSONAL_INFO } from '../../data/portfolio';
import { ArrowUpRight, ShieldCheck, Sparkles, Terminal } from 'lucide-react';
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
      className="relative py-28 sm:py-36 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-white/[0.06] overflow-hidden"
    >
      {/* Subtle architectural background watermarks */}
      <div className="absolute top-12 right-6 lg:right-12 text-[100px] sm:text-[140px] font-black font-display text-white/[0.015] select-none pointer-events-none -z-10 leading-none">
        02
      </div>

      {/* Top Editorial Index Label */}
      <div
        ref={headerRef}
        className="flex items-center justify-between text-xs font-mono text-[#8A8A8A] tracking-widest uppercase mb-12 sm:mb-16 border-b border-white/[0.06] pb-4"
      >
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-bold">02 //</span>
          <span className="text-white/80">ABOUT & IDENTITY</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#737373]">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>SPECIFICATION // VERIFIED PROFILE</span>
        </div>
      </div>

      {/* Main Asymmetrical Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Editorial Display Typography & Biography */}
        <div className="lg:col-span-7 flex flex-col justify-start">
          
          {/* Masked Display Name */}
          <div className="space-y-1 mb-6">
            <div className="overflow-hidden">
              <span
                ref={title1Ref}
                className="block text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-[#F5F5F5] leading-[0.88] uppercase will-change-transform"
              >
                MUHAMMAD
              </span>
            </div>
            <div className="overflow-hidden">
              <span
                ref={title2Ref}
                className="block text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/40 leading-[0.88] uppercase will-change-transform"
              >
                AHMED
              </span>
            </div>
          </div>

          {/* Heading Statement */}
          <h3
            ref={subtitleRef}
            className="text-lg sm:text-2xl font-bold font-display text-emerald-400 tracking-wide uppercase mb-6 flex items-center gap-2"
          >
            <span className="w-4 h-[2px] bg-emerald-400 inline-block" />
            <span>{ABOUT_CONTENT.heading}</span>
          </h3>

          {/* Approved Biography Copy */}
          <p
            ref={bioRef}
            className="text-base sm:text-xl text-[#A3A3A3] font-light leading-relaxed mb-8 max-w-2xl"
          >
            {ABOUT_CONTENT.bio}
          </p>

          {/* Technical Philosophy Card */}
          <div
            ref={quoteRef}
            className="p-6 rounded-xl bg-[#0A0A0A] border border-white/[0.08] relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300 shadow-xl"
          >
            {/* Subtle glow edge */}
            <div className="absolute top-0 left-0 w-1.5 inset-y-0 bg-emerald-400" />
            
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="tracking-wider">CORE ENGINEERING MENTALITY</span>
            </div>

            <p className="text-xs sm:text-sm font-mono text-[#D4D4D4] leading-relaxed">
              "{PERSONAL_INFO.tagline}"
            </p>

            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#737373]">
              <span>SOFTWARE ENGINEER</span>
              <span className="text-white/40">NO ARBITRARY CLAIMS · PROVABLE ARCHITECTURE</span>
            </div>
          </div>
        </div>

        {/* Right Column: Architectural Metadata Rows */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <div className="text-xs font-mono text-[#737373] tracking-widest uppercase mb-4 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AUTHENTICATED METADATA</span>
          </div>

          <div
            ref={metaContainerRef}
            className="space-y-3"
          >
            {metadataItems.map((item) => (
              <div
                key={item.index}
                className={`p-5 rounded-xl border transition-all duration-200 group ${
                  item.isAccent
                    ? 'bg-emerald-500/[0.04] border-emerald-500/20 hover:border-emerald-500/40'
                    : 'bg-[#0A0A0A] border-white/[0.07] hover:border-white/[0.15]'
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
              </div>
            ))}
          </div>

          {/* LinkedIn Verification CTA */}
          <div className="mt-6 pt-4 border-t border-white/[0.06]">
            <a
              href={PERSONAL_INFO.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono text-[#8A8A8A] hover:text-white transition-colors group"
            >
              <span>Verify credentials on LinkedIn profile</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
