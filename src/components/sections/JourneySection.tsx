import React, { useRef, useEffect } from 'react';
import { JOURNEY_MILESTONES } from '../../data/journey';
import { Calendar, GraduationCap, Briefcase, Rocket } from 'lucide-react';
import { gsap } from '../../lib/gsap';

interface JourneySectionProps {
  isReady?: boolean;
}

export const JourneySection: React.FC<JourneySectionProps> = ({ isReady = true }) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const timelineContainerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const beamHeadRef = useRef<HTMLDivElement | null>(null);
  const milestonesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const timelineContainer = timelineContainerRef.current;
    const track = trackRef.current;
    const line = lineRef.current;
    const beamHead = beamHeadRef.current;

    if (!section || !timelineContainer || !track || !line || !beamHead || !isReady) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      if (headerRef.current) gsap.set(headerRef.current, { opacity: 1, y: 0 });
      line.style.height = '100%';
      beamHead.style.display = 'none';
      milestonesRef.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 1, y: 0 });
      });
      return;
    }

    // 1. Header reveal
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

    // Initial state of milestones
    milestonesRef.current.forEach((el, index) => {
      if (el) gsap.set(el, { opacity: index === 0 ? 1 : 0.35, y: index === 0 ? 0 : 15 });
    });

    // 2. Physical Scroll Tracking for the Tracing Beam
    // Uses direct getBoundingClientRect() to remain 100% immune to Hero pinning or spacers
    const updateBeam = () => {
      if (!timelineContainer || !track || !line || !beamHead) return;

      const containerRect = timelineContainer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Focus line: eye-level focal plane (~52% of viewport height)
      const focusY = windowHeight * 0.52;

      // Distance from focus line to top of container
      const relativeY = focusY - containerRect.top;
      const totalHeight = track.offsetHeight || (timelineContainer.offsetHeight - 48);

      // Clamped progress from 0.0 to 1.0
      const progress = Math.max(0, Math.min(1, relativeY / totalHeight));
      const currentY = progress * totalHeight;

      // Update line height smoothly
      line.style.height = `${currentY}px`;

      // Update glowing orb position (pure vertical travel, perfectly centered on line)
      beamHead.style.transform = `translateY(${currentY}px)`;

      // Orb is visible when near/inside the timeline container
      if (relativeY > 0 && relativeY < totalHeight + 100) {
        beamHead.style.opacity = '1';
      } else {
        beamHead.style.opacity = '0';
      }

      // Activate milestone nodes and cards as the orb glides over them
      milestonesRef.current.forEach((el, index) => {
        if (!el) return;
        const node = el.querySelector('.journey-node');
        const dot = el.querySelector('.journey-node-dot');
        const card = el.querySelector('.journey-card');

        // Position of milestone relative to timelineContainer
        // On desktop node is vertically centered (top-1/2); on mobile it sits at top-4
        const isDesktop = window.innerWidth >= 1024;
        const milestoneY = isDesktop
          ? (el.offsetTop + el.offsetHeight / 2) - 16
          : el.offsetTop;

        if (currentY >= milestoneY - 20) {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.25, overwrite: 'auto' });
          if (node) {
            node.classList.add('border-emerald-400', 'bg-emerald-950/60', 'shadow-[0_0_18px_rgba(16,185,129,0.7)]');
            node.classList.remove('border-white/20', 'bg-[#050505]');
          }
          if (dot) {
            dot.classList.add('bg-emerald-400', 'shadow-[0_0_8px_#10b981]', 'scale-125');
            dot.classList.remove('bg-white/20');
          }
          if (card) {
            card.classList.add('border-emerald-500/30', 'bg-[#0c0c0c]', 'shadow-2xl');
            card.classList.remove('border-white/[0.08]', 'bg-[#080808]');
          }
        } else {
          if (index > 0) {
            gsap.to(el, { opacity: 0.35, y: 10, duration: 0.25, overwrite: 'auto' });
            if (node) {
              node.classList.remove('border-emerald-400', 'bg-emerald-950/60', 'shadow-[0_0_18px_rgba(16,185,129,0.7)]');
              node.classList.add('border-white/20', 'bg-[#050505]');
            }
            if (dot) {
              dot.classList.remove('bg-emerald-400', 'shadow-[0_0_8px_#10b981]', 'scale-125');
              dot.classList.add('bg-white/20');
            }
            if (card) {
              card.classList.remove('border-emerald-500/30', 'bg-[#0c0c0c]', 'shadow-2xl');
              card.classList.add('border-white/[0.08]', 'bg-[#080808]');
            }
          }
        }
      });
    };

    // Run on scroll and every frame via GSAP ticker for ultra-smooth 60fps tracking
    window.addEventListener('scroll', updateBeam, { passive: true });
    window.addEventListener('resize', updateBeam, { passive: true });
    gsap.ticker.add(updateBeam);

    // Initial evaluation
    updateBeam();

    return () => {
      window.removeEventListener('scroll', updateBeam);
      window.removeEventListener('resize', updateBeam);
      gsap.ticker.remove(updateBeam);
    };
  }, [isReady]);

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
              <span className="text-emerald-400 font-bold">04 //</span>
              <span>TRAJECTORY</span>
            </div>

            <h2 className="text-[clamp(1.85rem,5vw,3.75rem)] font-black font-display text-white tracking-tight uppercase leading-[0.92]">
              DEVELOPER
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/40">
                JOURNEY
              </span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm font-mono text-[#8A8A8A] max-w-sm leading-relaxed md:text-right">
            Chronological progression from CS education to shipping full-stack mobile applications and AI systems.
          </p>
        </div>

        {/* Interactive Timeline Container */}
        <div ref={timelineContainerRef} className="relative max-w-4xl mx-auto">
          {/* Background Vertical Guide Track */}
          <div
            ref={trackRef}
            className="absolute left-4 sm:left-10 lg:left-1/2 top-4 bottom-8 w-[2px] bg-white/[0.08] -translate-x-1/2 pointer-events-none"
          />

          {/* Dynamic Progress Line (Grows with Scroll) */}
          <div
            ref={lineRef}
            className="absolute left-4 sm:left-10 lg:left-1/2 top-4 w-[2px] bg-gradient-to-b from-emerald-400 via-emerald-300 to-white -translate-x-1/2 will-change-[height] shadow-[0_0_14px_rgba(16,185,129,0.7)] z-10 origin-top pointer-events-none"
            style={{ height: '0px' }}
          />

          {/* Traveling Glowing Beam Head (Scroll-driven Orb with Radiant Aura) */}
          <div
            ref={beamHeadRef}
            className="absolute left-4 sm:left-10 lg:left-1/2 top-4 z-30 pointer-events-none w-0 h-0 flex items-center justify-center will-change-transform transition-opacity duration-150"
            style={{ opacity: 0 }}
          >
            {/* Outer Radiant Glow / Halo matching Lightswind Reference */}
            <div className="absolute w-12 h-12 rounded-full bg-emerald-400/35 blur-md animate-pulse pointer-events-none" />
            <div className="absolute w-6 h-6 rounded-full bg-emerald-300/40 blur-xs pointer-events-none" />
            
            {/* Core Orb */}
            <div className="relative w-4 h-4 rounded-full bg-white border-2 border-emerald-400 shadow-[0_0_16px_#10b981,0_0_30px_rgba(16,185,129,0.8)] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
          </div>

          {/* Milestones List */}
          <div className="space-y-10 sm:space-y-14 lg:space-y-16 relative z-10">
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
                  <div className="absolute left-4 sm:left-10 lg:left-1/2 top-4 sm:top-1/2 -translate-x-1/2 lg:-translate-y-1/2 z-20">
                    <div className="journey-node w-5 h-5 rounded-full border-2 border-white/20 bg-[#050505] transition-all duration-300 flex items-center justify-center shadow-lg">
                      <div className="w-2 h-2 rounded-full bg-white/20 transition-all duration-300 journey-node-dot" />
                    </div>
                  </div>

                  {/* Left/Right Milestone Content Card */}
                  <div
                    className={`w-full lg:w-[calc(50%-2.5rem)] ml-8 sm:ml-16 lg:ml-0`}
                  >
                    <div className="journey-card p-4 sm:p-7 rounded-2xl bg-[#080808] border border-white/[0.08] transition-all duration-300 hover:border-emerald-500/30 shadow-xl group">
                      {/* Year & Category Header */}
                      <div className="flex items-center justify-between gap-3 mb-2.5 text-xs font-mono">
                        <div className="flex items-center gap-2 text-emerald-400">
                          {getCategoryIcon(item.category)}
                          <span className="font-bold tracking-widest text-sm">{item.year}</span>
                        </div>

                        <span className="px-2 py-0.5 rounded text-[10px] bg-white/[0.04] text-[#8A8A8A] font-mono tracking-wider">
                          {item.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg sm:text-xl font-bold font-display text-white mb-2.5 tracking-tight group-hover:text-emerald-300 transition-colors">
                        {item.title}
                      </h3>

                      {/* Narrative Description */}
                      <p className="text-xs sm:text-sm text-[#8A8A8A] leading-relaxed font-light">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Spacer for opposite side on Desktop */}
                  <div className="hidden lg:block lg:w-[calc(50%-2.5rem)]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};


