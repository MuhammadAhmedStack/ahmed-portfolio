import React, { useRef, useEffect } from 'react';
import { CONTACT_CONTENT, PERSONAL_INFO } from '../../data/portfolio';
import { ArrowUpRight, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { gsap } from '../../lib/gsap';

export const ContactSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const line1Ref = useRef<HTMLSpanElement | null>(null);
  const line2Ref = useRef<HTMLSpanElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const ctaCardRef = useRef<HTMLDivElement | null>(null);
  const metaBarRef = useRef<HTMLDivElement | null>(null);
  const magneticButtonRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          [
            headerRef.current,
            line1Ref.current,
            line2Ref.current,
            descRef.current,
            ctaCardRef.current,
            metaBarRef.current,
          ],
          { opacity: 1, y: 0, yPercent: 0 }
        );
        return;
      }

      gsap.set([headerRef.current, descRef.current, ctaCardRef.current, metaBarRef.current], {
        opacity: 0,
        y: 30,
      });
      gsap.set([line1Ref.current, line2Ref.current], {
        yPercent: 120,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
        defaults: { ease: 'power3.out' },
      });

      tl.to(headerRef.current, { opacity: 1, y: 0, duration: 0.8 })
        .to(line1Ref.current, { yPercent: 0, duration: 1.0, ease: 'power4.out' }, '-=0.5')
        .to(line2Ref.current, { yPercent: 0, duration: 1.0, ease: 'power4.out' }, '-=0.8')
        .to(descRef.current, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
        .to(ctaCardRef.current, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
        .to(metaBarRef.current, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6');
    }, section);

    return () => ctx.revert();
  }, []);

  // Desktop subtle magnetic button interaction
  useEffect(() => {
    const btn = magneticButtonRef.current;
    if (!btn) return;

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion || window.innerWidth < 1024) return;

    const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      xTo(relX * 0.25);
      yTo(relY * 0.25);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    btn.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      btn.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-32 sm:py-44 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-white/[0.06] overflow-hidden"
    >
      {/* Background Watermark Index */}
      <div className="absolute top-12 right-6 lg:right-12 text-[100px] sm:text-[140px] font-black font-display text-white/[0.015] select-none pointer-events-none -z-10 leading-none">
        08
      </div>

      {/* Dynamic Ambient Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header */}
      <div
        ref={headerRef}
        className="flex items-center justify-between text-xs font-mono text-[#8A8A8A] tracking-widest uppercase mb-16 sm:mb-20 border-b border-white/[0.06] pb-4"
      >
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-bold">08 //</span>
          <span>INITIATE CONTACT</span>
        </div>
        <div className="flex items-center gap-2 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px]">OPEN TO OPPORTUNITIES</span>
        </div>
      </div>

      {/* Main Closing Editorial Statement */}
      <div className="max-w-4xl">
        <div className="space-y-1 mb-8">
          <div className="overflow-hidden">
            <span
              ref={line1Ref}
              className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-display text-white tracking-tight uppercase leading-[0.9] will-change-transform"
            >
              LET'S BUILD
            </span>
          </div>

          <div className="overflow-hidden">
            <span
              ref={line2Ref}
              className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-white/60 tracking-tight uppercase leading-[0.9] will-change-transform"
            >
              SOMETHING MEANINGFUL.
            </span>
          </div>
        </div>

        {/* Supporting Copy */}
        <p
          ref={descRef}
          className="text-base sm:text-xl text-[#A3A3A3] font-light leading-relaxed max-w-2xl mb-12"
        >
          {CONTACT_CONTENT.subtext}
        </p>

        {/* Contact Action Card */}
        <div
          ref={ctaCardRef}
          className="p-8 sm:p-10 rounded-2xl bg-[#080808] border border-white/[0.08] mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden shadow-2xl"
        >
          <div>
            <div className="text-xs font-mono text-emerald-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DIRECT PROFESSIONAL NETWORK</span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-display text-white mb-1">
              Muhammad Ahmed
            </div>
            <div className="text-xs font-mono text-[#8A8A8A]">
              Software Engineer · Mobile & Full-Stack Developer
            </div>
          </div>

          {/* Magnetic CTA Button */}
          <a
            ref={magneticButtonRef}
            href={CONTACT_CONTENT.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-black font-semibold text-xs sm:text-sm font-mono tracking-widest hover:bg-emerald-400 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] cursor-pointer shrink-0 will-change-transform"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.96 0-1.74.78-1.74 1.74 0 .97.78 1.74 1.74 1.74.96 0 1.74-.77 1.74-1.74 0-.96-.78-1.74-1.74-1.74Z" />
            </svg>
            <span>CONNECT ON LINKEDIN</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Telemetry Status Row */}
        <div
          ref={metaBarRef}
          className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-mono text-[#737373] pt-4"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{PERSONAL_INFO.location} (UTC+5)</span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>AUTHENTIC PORTFOLIO SPECIFICATION</span>
          </div>
        </div>
      </div>
    </section>
  );
};
