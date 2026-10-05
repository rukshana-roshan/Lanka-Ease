import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProviderCard } from './ProviderCard';
import type { ProviderItem } from './ProviderCard';

const DEMO_PROVIDERS: ProviderItem[] = [
  {
    id: 1,
    fullName: 'Kasun Fernando',
    businessName: 'Kasun Electrical',
    profession: 'Master Electrician',
    isVerified: true,
    ratingAvg: 4.9,
    jobsCount: 124,
    distanceKm: 2.1,
    isAvailable: true,
    priceMin: 1500,
    priceMax: 3000,
    city: 'Colombo',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 2,
    fullName: 'Nimal Silva',
    businessName: 'Nimal Plumbing',
    profession: 'Plumbing & Pipe Expert',
    isVerified: true,
    ratingAvg: 4.8,
    jobsCount: 98,
    distanceKm: 3.2,
    isAvailable: true,
    priceMin: 1200,
    priceMax: 2500,
    city: 'Colombo',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 3,
    fullName: 'Saman Rathnayake',
    businessName: 'Saman Home Repairs',
    profession: 'Appliance Specialist',
    isVerified: true,
    ratingAvg: 4.6,
    jobsCount: 76,
    distanceKm: 4.8,
    isAvailable: true,
    priceMin: 1000,
    priceMax: 2000,
    city: 'Dehiwala',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 4,
    fullName: 'Tharushi Jayawardena',
    businessName: 'Tharushi Cleaning',
    profession: 'Deep Home Cleaning',
    isVerified: true,
    ratingAvg: 4.9,
    jobsCount: 112,
    distanceKm: 2.1,
    isAvailable: true,
    priceMin: 2500,
    priceMax: 8500,
    city: 'Nugegoda',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 5,
    fullName: 'Ruwan Perera',
    businessName: 'Ruwan Motors',
    profession: 'Mobile Mechanic',
    isVerified: true,
    ratingAvg: 4.5,
    jobsCount: 64,
    distanceKm: 5.6,
    isAvailable: true,
    priceMin: 1500,
    priceMax: 4000,
    city: 'Colombo',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
  },
];

export const ProviderCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1.5">
              NEARBY PROFESSIONALS
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Trusted experts near you
            </h2>
          </div>

          <div className="flex items-center gap-4 self-end md:self-auto">
            <Link
              to="/providers"
              className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 hover:underline"
            >
              View all providers →
            </Link>

            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={scrollLeft}
                className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 flex items-center justify-center shadow-sm transition-all focus:outline-none"
                aria-label="Previous providers"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={scrollRight}
                className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 flex items-center justify-center shadow-sm transition-all focus:outline-none"
                aria-label="Next providers"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1 snap-x snap-mandatory"
        >
          {DEMO_PROVIDERS.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      </div>
    </section>
  );
};
