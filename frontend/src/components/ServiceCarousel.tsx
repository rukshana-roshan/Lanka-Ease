import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ServiceCard } from './ServiceCard';
import type { ServiceItem } from './ServiceCard';

const REALISTIC_SERVICES: ServiceItem[] = [
  {
    id: 1,
    name: 'Electrical',
    slug: 'electrical',
    description: 'Electricians and electrical repairs, tripping fixes & wiring.',
    professionalsCount: 124,
    iconName: 'Zap',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 2,
    name: 'Plumbing',
    slug: 'plumbing',
    description: 'Plumbing, leaks, pipe repairs & water tank installations.',
    professionalsCount: 98,
    iconName: 'Droplet',
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 4,
    name: 'Home Cleaning',
    slug: 'cleaning',
    description: 'House cleaning, deep sanitization & sofa shampooing.',
    professionalsCount: 76,
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 5,
    name: 'Appliance Repair',
    slug: 'appliance-repair',
    description: 'Washing machine, refrigerator and appliance repairs.',
    professionalsCount: 64,
    iconName: 'Tv',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 7,
    name: 'Vehicle Service',
    slug: 'vehicle-service',
    description: 'Mobile mechanic, vehicle repair & breakdown service.',
    professionalsCount: 52,
    iconName: 'Wrench',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 10,
    name: 'Moving & Delivery',
    slug: 'delivery',
    description: 'Moving, transport, lorry hire & document delivery.',
    professionalsCount: 47,
    iconName: 'Truck',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 17,
    name: 'Painting',
    slug: 'painting',
    description: 'House and commercial interior/exterior wall painting.',
    professionalsCount: 39,
    iconName: 'Paintbrush',
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 3,
    name: 'Carpentry',
    slug: 'carpentry',
    description: 'Furniture repair, door fitting, locks & woodwork.',
    professionalsCount: 42,
    iconName: 'Hammer',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 16,
    name: 'Gardening',
    slug: 'gardening',
    description: 'Garden maintenance, lawn mowing & landscaping.',
    professionalsCount: 31,
    iconName: 'Trees',
    image: 'https://images.unsplash.com/photo-1558904541-efa8c196b27d?auto=format&fit=crop&q=80&w=600',
  },
];

export const ServiceCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-950 border-y border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1.5">
              POPULAR SERVICES
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Choose from a wide range of services
            </h2>
          </div>

          <div className="flex items-center gap-4 self-end md:self-auto">
            <Link
              to="/services"
              className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 hover:underline"
            >
              View all services →
            </Link>

            {/* Carousel Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={scrollLeft}
                className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 flex items-center justify-center shadow-sm transition-all focus:outline-none"
                aria-label="Previous services"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={scrollRight}
                className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 flex items-center justify-center shadow-sm transition-all focus:outline-none"
                aria-label="Next services"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Carousel Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1 snap-x snap-mandatory"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {REALISTIC_SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};
