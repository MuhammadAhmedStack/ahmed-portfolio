import React, { useRef, useEffect, useState } from 'react';
import { CONTACT_CONTENT, PERSONAL_INFO } from '../../data/portfolio';
import { ArrowUpRight, MapPin, Copy, Check } from 'lucide-react';
import { SpotlightCard } from '../ui/SpotlightCard';
import { BorderBeam } from '../ui/BorderBeam';
import { ShimmerButton } from '../ui/ShimmerButton';
import { gsap } from '../../lib/gsap';

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
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
              <span className="text-emerald-400 font-bold">08 //</span>
              <span>ENGAGEMENT</span>
            </div>

            <h2 className="text-[clamp(1.85rem,5vw,3.75rem)] font-black font-display text-white tracking-tight uppercase leading-[0.92]">
              INITIATE
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/40">
                CONTACT
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-wider uppercase text-[11px]">OPEN TO OPPORTUNITIES</span>
          </div>
        </div>

        {/* Main Closing Editorial Statement */}
        <div className="max-w-4xl">
          <div className="space-y-1 mb-8">
            <div className="overflow-hidden">
              <span
                ref={line1Ref}
                className="block text-[clamp(1.85rem,6.5vw,5.5rem)] font-black font-display text-white tracking-tight uppercase leading-[0.9] break-words will-change-transform"
              >
                LET'S BUILD
              </span>
            </div>

            <div className="overflow-hidden">
              <span
                ref={line2Ref}
                className="block text-[clamp(1.85rem,6.5vw,5.5rem)] font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-white/60 tracking-tight uppercase leading-[0.9] break-words will-change-transform"
              >
                SOMETHING MEANINGFUL.
              </span>
            </div>
          </div>

          {/* Supporting Copy */}
          <p
            ref={descRef}
            className="text-base sm:text-lg md:text-xl text-[#A3A3A3] font-light leading-relaxed max-w-2xl mb-8 sm:mb-12"
          >
            {CONTACT_CONTENT.subtext}
          </p>

          {/* Contact Action Card */}
          <div ref={ctaCardRef} className="mb-10">
            <SpotlightCard
              enableTilt={true}
              spotlightColor="rgba(16, 185, 129, 0.2)"
              className="p-5 sm:p-8 lg:p-10 rounded-2xl bg-[#080808]/90 border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-2xl"
            >
              <BorderBeam duration={10} colorFrom="#10b981" colorTo="#38bdf8" />
              <div>
                <div className="text-lg sm:text-xl font-bold font-display text-white mb-1 flex items-center gap-2">
                  <span>Muhammad Ahmed</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-xs font-mono text-[#8A8A8A] mb-3">
                  Software Engineer · Mobile & Full-Stack Developer
                </div>
                <div className="text-xs font-mono text-white/50 tracking-wider">
                  {PERSONAL_INFO.socialLinks.email || 'muhammadahmedstack@gmail.com'}
                </div>
              </div>

              {/* Action Buttons: Copy Email + LinkedIn */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    const email = PERSONAL_INFO.socialLinks.email || 'muhammadahmedstack@gmail.com';
                    navigator.clipboard.writeText(email);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-mono tracking-wider text-white transition-all cursor-pointer active:scale-95 touch-manipulation"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">EMAIL COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#8A8A8A]" />
                      <span>COPY EMAIL</span>
                    </>
                  )}
                </button>

                {/* Magnetic CTA Button */}
                <ShimmerButton
                  href={CONTACT_CONTENT.linkedin}
                  variant="primary"
                  className="w-full sm:w-auto justify-center"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.96 0-1.74.78-1.74 1.74 0 .97.78 1.74 1.74 1.74.96 0 1.74-.77 1.74-1.74 0-.96-.78-1.74-1.74-1.74Z" />
                  </svg>
                  <span>CONNECT ON LINKEDIN</span>
                  <ArrowUpRight className="w-4 h-4" />
                </ShimmerButton>
              </div>
            </SpotlightCard>
          </div>

          {/* Clean Location Row */}
          <div
            ref={metaBarRef}
            className="flex items-center gap-2 text-xs font-mono text-[#737373]"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{PERSONAL_INFO.location} (UTC+5)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
