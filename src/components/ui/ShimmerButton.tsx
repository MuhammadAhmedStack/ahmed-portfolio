import React from 'react';

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: (e: React.MouseEvent<any>) => void;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const ShimmerButton: React.FC<ShimmerButtonProps> = ({
  children,
  className = '',
  href,
  onClick,
  variant = 'primary',
  ...props
}) => {
  const baseClasses =
    'group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full font-semibold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 active:scale-95 cursor-pointer select-none';

  const variantClasses = {
    primary:
      'bg-white text-black hover:bg-emerald-400 shadow-[0_0_25px_rgba(255,255,255,0.18)] hover:shadow-[0_0_35px_rgba(16,185,129,0.45)] px-6 sm:px-8 py-3.5 sm:py-4',
    secondary:
      'bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10 hover:border-white/20 backdrop-blur-md px-5 sm:px-7 py-3.5 sm:py-4',
    outline:
      'bg-transparent hover:bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60 px-5 sm:px-7 py-3 sm:py-3.5',
  };

  const content = (
    <>
      {/* Moving Shimmer Sheen */}
      <div
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 animate-shimmer-sweep"
        aria-hidden="true"
      />

      {/* Button Content */}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {content}
    </button>
  );
};
