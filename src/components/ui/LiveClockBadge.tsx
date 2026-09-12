import React, { useState, useEffect } from 'react';

interface LiveClockBadgeProps {
  className?: string;
  showSeconds?: boolean;
}

export const LiveClockBadge: React.FC<LiveClockBadgeProps> = ({
  className = '',
  showSeconds = true,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      // Calculate current time in Karachi (Asia/Karachi, UTC+5)
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Karachi',
        hour: '2-digit',
        minute: '2-digit',
        second: showSeconds ? '2-digit' : undefined,
        hour12: false,
      };
      const formatted = new Intl.DateTimeFormat('en-GB', options).format(now);
      setTimeStr(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [showSeconds]);

  return (
    <div className={`inline-flex items-center gap-2 font-mono text-xs text-[#8A8A8A] ${className}`}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
      </span>
      <span className="tracking-widest text-[#A3A3A3]">KARACHI, PK</span>
      <span className="text-white/30">·</span>
      <span className="text-emerald-400 font-bold tabular-nums tracking-wider">{timeStr || '12:00:00'}</span>
      <span className="text-white/40 text-[10px]">UTC+5</span>
    </div>
  );
};
