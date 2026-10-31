import React from 'react';
import { Link } from 'react-router-dom';
import { House } from 'lucide-react';
interface LogoProps { size?: 'sm' | 'md' | 'lg' | 'xl'; showTagline?: boolean; clickable?: boolean; className?: string; to?: string }
export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = true, clickable = true, className = '', to = '/home' }) => {
  const content = <span className={`brand-lockup brand-${size} ${className}`}><span className="brand-symbol"><House strokeWidth={1.7} /><i /></span><span><span className="brand-name">Lanka<span>Ease</span></span>{showTagline && <span className="brand-tagline">Everyday, made easier.</span>}</span></span>;
  return clickable ? <Link className="brand-link" to={to} aria-label="LankaEase home">{content}</Link> : content;
};
