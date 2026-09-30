import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Zap, Droplet, Sparkles, Tv, Snowflake, Wrench, Paintbrush, Hammer, Truck, Trees, Laptop, GraduationCap } from 'lucide-react';
import { SafeImage } from './SafeImage';

export interface ServiceItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  professionalsCount: number;
  image: string;
  iconName?: string;
}

interface ServiceCardProps {
  service: ServiceItem;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Droplet': return <Droplet className="w-5 h-5 text-cyan-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-emerald-400" />;
      case 'Tv': return <Tv className="w-5 h-5 text-indigo-400" />;
      case 'Snowflake': return <Snowflake className="w-5 h-5 text-blue-400" />;
      case 'Wrench': return <Wrench className="w-5 h-5 text-orange-400" />;
      case 'Paintbrush': return <Paintbrush className="w-5 h-5 text-pink-400" />;
      case 'Hammer': return <Hammer className="w-5 h-5 text-amber-500" />;
      case 'Truck': return <Truck className="w-5 h-5 text-purple-400" />;
      case 'Trees': return <Trees className="w-5 h-5 text-green-400" />;
      case 'Laptop': return <Laptop className="w-5 h-5 text-sky-400" />;
      default: return <GraduationCap className="w-5 h-5 text-brand-400" />;
    }
  };

  return (
    <Link
      to={`/providers?categoryId=${service.id}`}
      className="group relative flex-none w-[240px] sm:w-[260px] md:w-[270px] h-[340px] rounded-2xl md:rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-800 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 focus:outline-none scroll-snap-align-start"
    >
      {/* Background Photography Image */}
      <SafeImage
        src={service.image}
        alt={service.name}
        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
      />

      {/* Multi-stage Dark Gradient Overlays for High Contrast Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-transparent opacity-60" />

      {/* Top Floating Badge: Professional Count */}
      <div className="absolute top-3.5 right-3.5 px-3 py-1 bg-slate-900/75 backdrop-blur-md rounded-full border border-white/20 text-[11px] font-semibold text-slate-200 shadow-sm">
        {service.professionalsCount} professionals
      </div>

      {/* Card Bottom Details */}
      <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col justify-end text-left space-y-2">
        {/* Icon Pill */}
        <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-brand-500 group-hover:border-brand-400 transition-all duration-300">
          {getIcon(service.iconName)}
        </div>

        {/* Name */}
        <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-brand-300 transition-colors">
          {service.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
          {service.description}
        </p>

        {/* Action Button & Hover Indicator */}
        <div className="pt-2 flex items-center justify-between text-xs font-semibold text-brand-300">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-8px] group-hover:translate-x-0 duration-300">
            Book Service
          </span>
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md group-hover:bg-brand-500 text-white flex items-center justify-center ml-auto transition-colors">
            <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};
