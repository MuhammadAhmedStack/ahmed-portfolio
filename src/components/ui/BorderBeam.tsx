import React from 'react';

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
}

export const BorderBeam: React.FC<BorderBeamProps> = ({
  className = '',
  duration = 8,
  borderWidth = 1.5,
  colorFrom = '#10b981',
  colorTo = '#ffffff',
}) => {
  return (
    <div
      style={
        {
          '--duration': `${duration}s`,
          '--border-width': `${borderWidth}px`,
          '--color-from': colorFrom,
          '--color-to': colorTo,
        } as React.CSSProperties
      }
      className={`pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden z-20 ${className}`}
    >
      <div
        className="absolute -inset-[100%] aspect-square w-auto"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 290deg, ${colorFrom} 330deg, ${colorTo} 360deg)`,
          animation: `laser-spin ${duration}s linear infinite`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: `${borderWidth}px`,
        }}
      />
    </div>
  );
};
