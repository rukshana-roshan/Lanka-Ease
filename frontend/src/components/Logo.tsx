import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  clickable?: boolean;
  className?: string;
  to?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = true,
  clickable = true,
  className = '',
  to = '/home',
}) => {
  const iconSizes = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-2xl',
    lg: 'w-12 h-12 rounded-2xl',
    xl: 'w-16 h-16 rounded-3xl',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl sm:text-4xl',
  };

  const taglineSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-[11px]',
    xl: 'text-xs',
  };

  const logoContent = (
    <div className={`flex items-center gap-3 group/logo ${className}`}>
      {/* High-end Professional Logo Shield Emblem */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]} bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-600/30 group-hover/logo:scale-105 transition-all duration-300 ring-2 ring-emerald-400/40`}>
        {/* Ambient glow ring */}
        <div className="absolute inset-0 rounded-inherit bg-emerald-400/20 blur-md pointer-events-none group-hover/logo:opacity-100 opacity-60 transition-opacity" />
        
        {/* Custom SVG Emblem Shield */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/5 h-3/5 relative z-10 text-white drop-shadow"
        >
          <path
            d="M12 2L3 6V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V6L12 2Z"
            fill="currentColor"
            fillOpacity="0.25"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M9 12L11 14L15 10"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1">
          <span className={`font-black tracking-tight text-slate-900 dark:text-white ${textSizes[size]}`}>
            Lanka<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400">Ease</span>
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
        </div>
        {showTagline && (
          <span className={`text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase ${taglineSizes[size]} -mt-0.5`}>
            Sri Lanka's Service Network
          </span>
        )}
      </div>
    </div>
  );

  if (clickable) {
    return (
      <Link to={to} className="inline-block focus:outline-none">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};
