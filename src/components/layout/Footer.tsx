import React from 'react';
import { Code2, ArrowUp } from 'lucide-react';
import { PERSONAL_INFO } from '../../data/portfolio';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    if ((window as any).__lenis) {
      (window as any).__lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#050505] py-14 px-6 sm:px-8 lg:px-12 relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Brand & Identity */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2 text-base font-display font-bold tracking-widest text-white">
            <span className="flex items-center justify-center w-7 h-7 rounded bg-white/[0.05] border border-white/10">
              <Code2 className="w-4 h-4 text-emerald-400" />
            </span>
            <span>
              AHMED<span className="text-emerald-400">.</span>
            </span>
          </div>

          <div className="hidden sm:block w-[1px] h-4 bg-white/20" />

          <div className="text-xs font-mono text-[#8A8A8A] tracking-wider">
            {PERSONAL_INFO.name.toUpperCase()} · SOFTWARE ENGINEER
          </div>
        </div>

        {/* Links & Back to Top */}
        <div className="flex items-center gap-6 text-xs font-mono text-[#8A8A8A]">
          <a
            href={PERSONAL_INFO.socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            LinkedIn Profile ↗
          </a>

          <div className="w-[1px] h-3 bg-white/10" />

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-2 text-white/70 hover:text-emerald-400 transition-colors cursor-pointer group"
            aria-label="Scroll to top"
          >
            <span className="tracking-widest">BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>

      {/* Bottom Copyright & Credit */}
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-[#525252] text-center sm:text-left">
        <div>
          © 2026 {PERSONAL_INFO.name.toUpperCase()}. ALL RIGHTS RESERVED.
        </div>
        <div className="text-[#404040]">
          BUILT WITH REACT · TYPESCRIPT · TAILWIND · GSAP · LENIS
        </div>
      </div>
    </footer>
  );
};
