import React, { useEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/gsap';

export const PointerFollower: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [actionText, setActionText] = useState<string>('');
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Smooth physics interpolator for arrow motion
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.1, ease: 'power2.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.1, ease: 'power2.out' });
    const rotateTo = gsap.quickTo(cursor, 'rotation', { duration: 0.25, ease: 'power2.out' });

    let lastX = 0;
    let hasInitialized = false;

    const handleMouseMove = (e: MouseEvent) => {
      // If user is moving mouse, activate custom cursor
      if (!hasInitialized) {
        hasInitialized = true;
        setIsVisible(true);
        document.body.classList.add('has-custom-cursor');
      }

      const { clientX, clientY } = e;
      // Precise offset so arrow tip (2.5, 1.5) lands exactly on mouse coordinates
      xTo(clientX - 2.5);
      yTo(clientY - 1.5);

      // Subtle dynamic angle tilt based on horizontal velocity
      const deltaX = clientX - lastX;
      const tiltAngle = Math.max(-20, Math.min(20, deltaX * 1.2));
      rotateTo(tiltAngle);

      lastX = clientX;

      // Check clickable element beneath cursor
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const clickable = target.closest('a, button, [role="button"], input, textarea, .cursor-pointer');
      if (clickable) {
        setIsHoveringClickable(true);
        if (clickable.closest('#projects')) {
          setActionText('VIEW');
        } else if (clickable.closest('#contact')) {
          setActionText('CONNECT');
        } else {
          setActionText('');
        }
      } else {
        setIsHoveringClickable(false);
        setActionText('');
      }
    };

    const handleMouseLeave = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.2 });
    };

    const handleMouseEnter = () => {
      gsap.to(cursor, { opacity: 1, duration: 0.2 });
    };

    const handleMouseDown = () => {
      gsap.to(cursor, { scale: 0.85, duration: 0.1 });
    };

    const handleMouseUp = () => {
      gsap.to(cursor, { scale: isHoveringClickable ? 1.12 : 1, duration: 0.15 });
    };

    // If pure touch event fires, gracefully hide custom cursor
    const handleTouchStart = () => {
      setIsVisible(false);
      document.body.classList.remove('has-custom-cursor');
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('has-custom-cursor');
    };
  }, [isHoveringClickable]);

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[99999] will-change-transform transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        transform: 'translate(-100px, -100px)',
      }}
    >
      {/* 1. Sleek Modern Pointer Arrow matching Lightswind Reference */}
      <div className="relative flex items-center">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-150 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] ${
            isHoveringClickable ? 'scale-110' : 'scale-100'
          }`}
        >
          {/* Classic Pointer Arrow Outline & Fill */}
          <path
            d="M2.5 1.5L18.5 11.5L11.5 13.5L8 21.5L2.5 1.5Z"
            fill="#000000"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M4 4L15.5 11.2L10.8 12.6L7.8 18.2L4 4Z"
            fill={isHoveringClickable ? '#10b981' : '#050505'}
            className="transition-colors duration-200"
          />
        </svg>

        {/* 2. Interactive Action Tag / Badge */}
        {actionText && (
          <span
            ref={labelRef}
            className="ml-2.5 px-2 py-0.5 rounded-full bg-emerald-400 text-black text-[9px] font-mono font-bold tracking-widest shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-in fade-in zoom-in-95 duration-150"
          >
            {actionText}
          </span>
        )}
      </div>
    </div>
  );
};

