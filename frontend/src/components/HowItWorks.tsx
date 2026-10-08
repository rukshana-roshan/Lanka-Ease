import React from 'react';
import { MessageSquareText, Search, MapPin, CreditCard, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const STEPS = [
  {
    number: 1,
    icon: MessageSquareText,
    title: 'Tell us what you need',
    description: 'Describe your problem in simple words or use AI smart detection.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    number: 2,
    icon: Search,
    title: 'Find the right professional',
    description: 'We match you with background-checked local experts near you.',
    color: 'from-brand-500 to-emerald-500',
  },
  {
    number: 3,
    icon: MapPin,
    title: 'Track your service',
    description: 'See real-time map updates on your provider arrival status.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    number: 4,
    icon: CreditCard,
    title: 'Pay securely',
    description: 'Itemized invoices with PayHere, card, or cash payment options.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    number: 5,
    icon: Star,
    title: 'Review your experience',
    description: 'Rate your professional to maintain high platform quality.',
    color: 'from-purple-500 to-indigo-500',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1.5">
              HOW IT WORKS
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Get help in 5 simple steps
            </h2>
          </div>

          <div className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
            It's fast, easy and secure.
          </div>
        </div>

        {/* 5 Steps Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          {STEPS.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all flex flex-col text-left relative group hover-lift"
              >
                {/* Step Top Bar: Icon + Number */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold text-slate-400 group-hover:text-emerald-500 transition-colors">
                    0{step.number}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
