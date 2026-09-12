import { useEffect, useRef, useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import { Sparkles, Compass } from 'lucide-react';

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

  // Draw a specific image onto the canvas with object-cover math
  const drawImageToCanvas = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Source image dimensions (720x1280, aspect ratio = 9/16 = 0.5625)
    const imgRatio = img.naturalWidth / img.naturalHeight || 720 / 1280;
    const canvasRatio = width / height;

    let drawW = width;
    let drawH = height;
    let offsetX = 0;
    let offsetY = 0;

    // Object-cover calculation
    if (canvasRatio > imgRatio) {
      drawW = width;
      drawH = width / imgRatio;
      offsetY = (height - drawH) / 2;
    } else {
      drawH = height;
      drawW = height * imgRatio;
      offsetX = (width - drawW) / 2;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
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

    // Handle high-DPI canvas resizing
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);

      // Redraw current frame
      const currentImg = getNearestLoadedFrame(currentFrameIndexRef.current);
      if (currentImg) {
        drawImageToCanvas(currentImg);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
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
        const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);
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
      className={`relative w-full max-w-[320px] sm:max-w-[380px] md:max-w-[430px] lg:max-w-[470px] aspect-[4/5] mx-auto flex items-center justify-center will-change-transform transition-opacity duration-1000 ${
        isReady ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Dynamic Ambient Aura (multi-layered radial glow behind subject) */}
      <div className="absolute -inset-6 sm:-inset-10 bg-gradient-to-tr from-emerald-500/15 via-emerald-400/5 to-transparent rounded-[2.5rem] blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-4 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Main Integrated Frame */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/[0.08] bg-[#070707] shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex items-center justify-center group">
        
        {/* Architectural Subtle Grid */}
        <div className="absolute inset-0 bg-subtle-grid opacity-20 pointer-events-none z-10" />

        {/* Cinematic Edge Mask & Vignette: feathers the edges into the dark page background */}
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            boxShadow: 'inset 0 0 50px 15px #070707, inset 0 0 100px 30px rgba(5,5,5,0.7)',
          }}
        />

        {/* Linear feathering top and bottom to integrate cleanly */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#070707] via-[#070707]/60 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#070707] via-[#070707]/70 to-transparent pointer-events-none z-20" />

        {/* High-Performance 360° Portrait Canvas Sequence */}
        <canvas
          ref={canvasRef}
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            initialFrameLoaded && !loadError ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'
          }`}
          style={{
            maskImage: 'radial-gradient(ellipse at 50% 50%, black 65%, transparent 98%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 65%, transparent 98%)',
          }}
        />

        {/* High-End Editorial Monogram & Telemetry Fallback (Rendered when sequence is loading/errored) */}
        {(!initialFrameLoaded || loadError) && (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 sm:p-8 text-center relative overflow-hidden bg-gradient-to-b from-[#0e0e0e] via-[#080808] to-[#050505]">
            
            {/* Concentric Sensor Rings & Radar Line */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 rounded-full border border-emerald-500/[0.08] animate-[spin_30s_linear_infinite]" />
              <div className="w-56 h-56 rounded-full border border-dashed border-white/[0.06] animate-[spin_40s_linear_infinite_reverse]" />
              <div className="w-40 h-40 rounded-full border border-white/[0.04]" />
            </div>

            {/* Central Subject Monogram Badge with Radial Progress Gauge */}
            <div className="relative z-10 w-28 h-28 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
              {/* Rotating SVG Progress Gauge */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                <circle
                  cx="56"
                  cy="56"
                  r="40"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="2"
                />
                <circle
                  ref={progressDialRef}
                  cx="56"
                  cy="56"
                  r="40"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="transition-all duration-75 ease-out"
                />
              </svg>

              {/* Monogram Initials */}
              <div className="flex flex-col items-center">
                <span className="font-display text-3xl font-extrabold text-white tracking-wider">
                  MA
                </span>
                <span className="text-[9px] font-mono text-emerald-400 tracking-widest mt-0.5">
                  TURNTABLE
                </span>
              </div>
            </div>

            {/* Subject Label */}
            <div className="relative z-10 font-display text-sm sm:text-base font-semibold tracking-widest text-white uppercase mb-1">
              MUHAMMAD AHMED
            </div>
            <div className="relative z-10 text-[11px] font-mono tracking-wider text-emerald-400/90 mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SPATIAL SENSOR ACTIVE</span>
            </div>

            {/* Telemetry Status Caption */}
            <div className="relative z-10 text-[11px] font-mono text-[#737373] max-w-[260px] leading-relaxed border-t border-white/[0.06] pt-3">
              Spatial 360° Capture Module · 110-Frame Canvas Turntable.
            </div>
          </div>
        )}

        {/* Top HUD Telemetry Bar */}
        <div className="absolute top-3.5 inset-x-4 flex items-center justify-between z-30 pointer-events-none text-[10px] font-mono text-[#8A8A8A]">
          <div className="flex items-center gap-1.5 bg-[#050505]/70 px-2 py-1 rounded border border-white/[0.06] backdrop-blur-sm">
            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
            <span className="tracking-widest text-white/80">360° TURNTABLE</span>
          </div>

          {/* Real-time Angle Readout (Updated via ScrollTrigger) */}
          <div className="flex items-center gap-1.5 bg-[#050505]/70 px-2.5 py-1 rounded border border-white/[0.06] backdrop-blur-sm">
            <Compass className="w-3 h-3 text-emerald-400" />
            <span ref={angleDisplayRef} className="text-emerald-400 font-bold font-mono tracking-wider">
              000°
            </span>
          </div>
        </div>

        {/* Bottom HUD: Dynamic Compass & Cardinal Marks */}
        <div className="absolute bottom-3.5 inset-x-4 flex items-center justify-between z-30 pointer-events-none text-[10px] font-mono text-[#737373]">
          <div className="flex items-center gap-2">
            <div
              ref={compassIndicatorRef}
              className="w-4 h-4 rounded-full border border-emerald-500/40 flex items-center justify-center will-change-transform"
            >
              <div className="w-1 h-1.5 bg-emerald-400 rounded-full" />
            </div>
            <span className="tracking-wider text-[#8A8A8A]">ROTATION BEARING</span>
          </div>

          <div className="flex items-center gap-1 text-[9px] text-white/50">
            <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
            <span>110F CANVAS</span>
          </div>
        </div>

        {/* Precision HUD Corner Brackets */}
        <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t-2 border-l-2 border-white/20 pointer-events-none z-30" />
        <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 border-t-2 border-r-2 border-white/20 pointer-events-none z-30" />
        <div className="absolute bottom-2.5 left-2.5 w-2.5 h-2.5 border-b-2 border-l-2 border-white/20 pointer-events-none z-30" />
        <div className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b-2 border-r-2 border-white/20 pointer-events-none z-30" />
      </div>
    </div>
  );
});

HeroPortrait.displayName = 'HeroPortrait';
