import { useEffect, useRef, useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import { Compass } from 'lucide-react';

export interface HeroPortraitHandle {
  updateProgress: (progress: number) => void;
  getWrapperElement: () => HTMLDivElement | null;
}

interface HeroPortraitProps {
  isReady?: boolean;
}

const TOTAL_FRAMES = 110;

const getFrameUrl = (index: number): string => {
  const frameNum = (index + 1).toString().padStart(3, '0');
  return `/media/hero-sequence/frame-${frameNum}.webp`;
};

export const HeroPortrait = forwardRef<HeroPortraitHandle, HeroPortraitProps>(({ isReady = true }, ref) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const angleDisplayRef = useRef<HTMLSpanElement | null>(null);
  const compassIndicatorRef = useRef<HTMLDivElement | null>(null);
  const progressDialRef = useRef<SVGCircleElement | null>(null);

  // Preloaded image frames stored in ref (0 React re-renders during loading/scrubbing)
  const framesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const currentFrameIndexRef = useRef<number>(0);
  const pendingFrameRef = useRef<number>(0);
  const pendingDegreesRef = useRef<number>(0);
  const pendingProgressRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  const [initialFrameLoaded, setInitialFrameLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Draw a specific image onto the canvas with full-subject containment math
  const drawImageToCanvas = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Enable high-fidelity interpolation for razor-sharp image rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const width = canvas.width;
    const height = canvas.height;
    if (width === 0 || height === 0) return;

    // Verified source sequence specifications:
    // Natural frame: 720x1280.
    // The actual video content area is 720x960 (3:4 ratio), situated between y=160 and y=1120.
    // In this content area:
    // - Highest hair pixel across all 110 frames: y = 187 (giving 32px of safe headroom from y=155)
    // - Lowest suit jacket pixel: y = 1119 (reaches y=1120)
    // - Full body width spans 0..719
    const SRC_X = 0;
    const SRC_Y = 155;
    const SRC_W = 720;
    const SRC_H = 965;
    const srcRatio = SRC_W / SRC_H; // ~0.746 (3:4)

    const canvasRatio = width / height;

    let drawW: number;
    let drawH: number;
    let drawX: number;
    let drawY: number;

    // Full contain: guarantees head, hair, shoulders, suit jacket, and waist are 100% visible
    if (canvasRatio > srcRatio) {
      drawH = height;
      drawW = height * srcRatio;
      drawX = (width - drawW) / 2;
      drawY = 0;
    } else {
      drawW = width;
      drawH = width / srcRatio;
      drawX = 0;
      drawY = (height - drawH) / 2;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, SRC_X, SRC_Y, SRC_W, SRC_H, drawX, drawY, drawW, drawH);
  }, []);

  // Find nearest loaded frame if the target frame is still downloading
  const getNearestLoadedFrame = useCallback((targetIdx: number): HTMLImageElement | null => {
    const frames = framesRef.current;
    if (frames[targetIdx]) return frames[targetIdx];

    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = targetIdx - offset;
      if (prev >= 0 && frames[prev]) return frames[prev];

      const next = targetIdx + offset;
      if (next < TOTAL_FRAMES && frames[next]) return frames[next];
    }
    return null;
  }, []);

  // Coalesced render function run inside requestAnimationFrame
  const renderFrame = useCallback(() => {
    rafIdRef.current = null;

    const targetIndex = pendingFrameRef.current;
    const degrees = pendingDegreesRef.current;
    const clampedProgress = pendingProgressRef.current;

    currentFrameIndexRef.current = targetIndex;

    const imgToDraw = getNearestLoadedFrame(targetIndex);
    if (imgToDraw) {
      drawImageToCanvas(imgToDraw);
    }

    // 2. Update angle readout directly via ref
    if (angleDisplayRef.current) {
      angleDisplayRef.current.textContent = `${degrees.toString().padStart(3, '0')}°`;
    }

    // 3. Update compass dial rotation directly via ref
    if (compassIndicatorRef.current) {
      compassIndicatorRef.current.style.transform = `rotate(${degrees}deg)`;
    }

    // 4. Update SVG progress ring stroke directly via ref
    if (progressDialRef.current) {
      const circumference = 2 * Math.PI * 40; // r=40
      const offset = circumference - clampedProgress * circumference;
      progressDialRef.current.style.strokeDashoffset = `${offset}`;
    }
  }, [drawImageToCanvas, getNearestLoadedFrame]);

  // Expose imperative update method for parent ScrollTrigger (0 React re-renders on scroll)
  useImperativeHandle(ref, () => ({
    getWrapperElement: () => wrapperRef.current,
    updateProgress: (progress: number) => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const clampedProgress = Math.max(0, Math.min(1, progress));
      const degrees = Math.round(clampedProgress * 360);
      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.floor(clampedProgress * TOTAL_FRAMES))
      );

      pendingFrameRef.current = frameIndex;
      pendingDegreesRef.current = degrees;
      pendingProgressRef.current = clampedProgress;

      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(renderFrame);
      }
    },
  }));

  // Initial setup: SVG progress ring & canvas sizing
  useEffect(() => {
    if (progressDialRef.current) {
      const circumference = 2 * Math.PI * 40;
      progressDialRef.current.style.strokeDasharray = `${circumference}`;
      progressDialRef.current.style.strokeDashoffset = `${circumference}`;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle high-DPI canvas resizing with native devicePixelRatio
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2.5));
      const targetW = Math.round(rect.width * dpr);
      const targetH = Math.round(rect.height * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      // Redraw current frame
      const currentImg = getNearestLoadedFrame(currentFrameIndexRef.current);
      if (currentImg) {
        drawImageToCanvas(currentImg);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && wrapperRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateCanvasSize();
      });
      resizeObserver.observe(wrapperRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (resizeObserver) resizeObserver.disconnect();
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [drawImageToCanvas, getNearestLoadedFrame]);

  // Progressive Preloading Strategy
  useEffect(() => {
    let isCancelled = false;

    // Check prefers-reduced-motion: if enabled, only load frame 0
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Phase A: Load initial Frame 0 immediately with high priority
    const initialImg = new Image();
    initialImg.src = getFrameUrl(0);

    initialImg.onload = () => {
      if (isCancelled) return;
      framesRef.current[0] = initialImg;
      setInitialFrameLoaded(true);

      // Draw initial frame immediately
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2.5));
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
        drawImageToCanvas(initialImg);
      }

      if (prefersReducedMotion) return;

      // Phase B: Preload remaining sequence in background
      // Preload in batches or sequential loop to avoid network choking
      for (let i = 1; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = getFrameUrl(i);
        img.onload = () => {
          if (!isCancelled) {
            framesRef.current[i] = img;
          }
        };
      }
    };

    initialImg.onerror = () => {
      if (!isCancelled) {
        setLoadError(true);
      }
    };

    return () => {
      isCancelled = true;
    };
  }, [drawImageToCanvas]);

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full aspect-[3/4] max-w-[min(100%,380px)] sm:max-w-[500px] md:max-w-[580px] lg:max-w-[680px] xl:max-w-[760px] 2xl:max-w-[840px] mx-auto flex items-center justify-center will-change-transform hero-portrait-sizing transition-opacity duration-1000 ${
        isReady ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Deep Atmospheric Ambient Halo behind the subject */}
      <div className="absolute -inset-12 sm:-inset-20 bg-gradient-to-tr from-emerald-500/25 via-emerald-400/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-4 bg-radial from-white/[0.08] via-emerald-500/15 to-transparent rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Soft Blurred Outer Aura / Border Glow (No rigid box) */}
      <div className="absolute -inset-2 sm:-inset-3 rounded-[3.5rem] sm:rounded-[4.5rem] bg-gradient-to-b from-white/20 via-emerald-500/20 to-transparent blur-xl pointer-events-none -z-10 opacity-75" />

      {/* Cinematic Organic Frame with Soft Blurred Edge */}
      <div className="relative w-full h-full rounded-[3rem] sm:rounded-[4rem] overflow-hidden flex items-center justify-center group">
        {/* Soft Blurred Luminous Rim */}
        <div className="absolute -inset-0.5 rounded-[3rem] sm:rounded-[4rem] bg-gradient-to-b from-white/20 via-emerald-500/20 to-transparent blur-[2px] pointer-events-none z-20 opacity-70" />
        <div className="absolute inset-0 rounded-[3rem] sm:rounded-[4rem] border border-emerald-500/20 pointer-events-none z-20 shadow-[0_0_40px_rgba(16,185,129,0.15)]" />

        {/* High-Performance 360° Portrait Canvas Sequence (100% full subject visibility & crystal-sharp clarity) */}
        <canvas
          ref={canvasRef}
          className={`w-full h-full object-contain transition-opacity duration-700 relative z-10 ${
            initialFrameLoaded && !loadError ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'
          }`}
        />

        {/* Soft Bottom Dissolve so suit jacket merges smoothly into background */}
        <div className="absolute inset-x-0 bottom-0 h-28 sm:h-36 bg-gradient-to-t from-[#050505] via-[#050505]/75 to-transparent pointer-events-none z-20" />

        {/* High-End Editorial Monogram Fallback (Rendered when sequence is loading/errored) */}
        {(!initialFrameLoaded || loadError) && (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 sm:p-8 text-center relative overflow-hidden bg-gradient-to-b from-[#0e0e0e] via-[#080808] to-[#050505] z-10">
            {/* Central Subject Monogram Badge with Radial Progress Gauge */}
            <div className="relative z-10 w-28 h-28 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center mb-5 shadow-2xl">
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                <circle
                  cx="56"
                  cy="56"
                  r="42"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="2"
                />
                <circle
                  ref={progressDialRef}
                  cx="56"
                  cy="56"
                  r="42"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="transition-all duration-75 ease-out"
                />
              </svg>

              <span className="font-display text-3xl font-extrabold text-white tracking-wider">
                MA
              </span>
            </div>

            {/* Subject Label */}
            <div className="relative z-10 font-display text-base font-semibold tracking-widest text-white uppercase mb-1">
              MUHAMMAD AHMED
            </div>
            <div className="relative z-10 text-xs font-mono tracking-wider text-[#8A8A8A]">
              360° Interactive Portrait
            </div>
          </div>
        )}

        {/* Top HUD Telemetry Floating Pills */}
        <div className="absolute top-3 inset-x-3 sm:top-4 sm:inset-x-5 flex items-center justify-between z-30 pointer-events-none">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-[#050505]/65 px-2.5 sm:px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-xl shadow-2xl text-[9px] sm:text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-widest text-white/90">360° PORTRAIT</span>
          </div>

          {/* Real-time Angle Readout (Updated via ScrollTrigger) */}
          <div className="flex items-center gap-1.5 bg-[#050505]/65 px-2.5 sm:px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-xl shadow-2xl text-[9px] sm:text-[10px] font-mono">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span ref={angleDisplayRef} className="text-emerald-400 font-bold font-mono tracking-wider">
              000°
            </span>
          </div>
        </div>

        {/* Bottom HUD: Dynamic Compass & Scroll Prompt Floating Pills */}
        <div className="absolute bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-5 flex items-center justify-between z-30 pointer-events-none text-[9px] sm:text-[10px] font-mono">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-[#050505]/65 px-2.5 sm:px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-xl shadow-2xl text-[#8A8A8A]">
            <div
              ref={compassIndicatorRef}
              className="w-3.5 h-3.5 rounded-full border border-emerald-500/50 flex items-center justify-center will-change-transform"
            >
              <div className="w-1 h-1.5 bg-emerald-400 rounded-full" />
            </div>
            <span className="tracking-wider text-[#A3A3A3]">BEARING</span>
          </div>

          <div className="bg-[#050505]/65 px-2.5 sm:px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-xl shadow-2xl tracking-widest text-white/60">
            SCROLL TO ROTATE
          </div>
        </div>
      </div>
    </div>
  );
});

HeroPortrait.displayName = 'HeroPortrait';
