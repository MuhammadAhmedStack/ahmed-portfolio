import React, { useEffect, useState } from 'react';

interface LoaderProps {
  onComplete: () => void;
}

export const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 100 : 0
  );
  const [isExiting, setIsExiting] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      const timer = setTimeout(() => {
        onComplete();
      }, 50);
      return () => clearTimeout(timer);
    }

    // Quick, smooth progress increment reaching 100% in ~1s
    const startTime = performance.now();
    const duration = 1050; // ms

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed < duration) {
        requestAnimationFrame(frame);
      } else {
        setIsExiting(true);
        setTimeout(() => {
          onComplete();
        }, 400);
      }
    };

    const animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] transition-all duration-500 ease-out ${
        isExiting ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
    >
      {/* Subtle backdrop ambient aura */}
      <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6">
        {/* Brand Wordmark */}
        <div className="text-2xl sm:text-3xl font-bold font-display tracking-widest text-white mb-6">
          AHMED<span className="text-emerald-400">.</span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-[2px] bg-white/[0.08] rounded-full overflow-hidden relative mb-4">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-75 ease-out shadow-[0_0_12px_rgba(16,185,129,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Technical Telemetry Text */}
        <div className="w-full flex items-center justify-between text-[11px] font-mono text-[#8A8A8A]">
          <span className="tracking-wider">INITIALIZING DIGITAL EXPERIENCE</span>
          <span className="text-emerald-400">{progress.toString().padStart(3, '0')}%</span>
        </div>
      </div>
    </div>
  );
};
