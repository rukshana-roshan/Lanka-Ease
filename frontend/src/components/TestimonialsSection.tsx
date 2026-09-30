import React from 'react';
import { Star } from 'lucide-react';
import { SafeImage } from './SafeImage';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Nadeesha Perera',
    location: 'Colombo 03',
    rating: 5.0,
    quote: 'Finding an electrician used to take hours. LankaEase matched me with Kasun in 10 minutes, and I tracked his arrival live!',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 2,
    name: 'Samanthi Silva',
    location: 'Kandy',
    rating: 5.0,
    quote: 'I ordered a water tank repair for my elderly parents in Kandy while working in Colombo. Fantastic family assistance feature!',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 3,
    name: 'Dilshan Fernando',
    location: 'Galle',
    rating: 4.9,
    quote: 'The AC repair technician was extremely professional. Itemized PDF invoice and digital payment made it completely hassle-free.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1.5">
              REAL STORIES
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              What our customers say
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-2 self-end md:self-auto">
            <button
              className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-600 hover:text-white flex items-center justify-center shadow-sm transition-all"
              aria-label="Previous story"
            >
              ‹
            </button>
            <button
              className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-600 hover:text-white flex items-center justify-center shadow-sm transition-all"
              aria-label="Next story"
            >
              ›
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-3">
                <SafeImage
                  src={t.image}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-emerald-500"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</h4>
                  <p className="text-[10px] text-slate-400">{t.location}</p>
                </div>
                <div className="ml-auto flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{t.rating.toFixed(1)}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "{t.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
