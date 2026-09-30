import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Star, MapPin, CheckCircle2 } from 'lucide-react';
import { HeroSearchPanel } from './HeroSearchPanel';
import { SafeImage } from './SafeImage';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[85vh] lg:min-h-[88vh] flex flex-col justify-between overflow-hidden bg-slate-900 text-white">
      {/* Background Photographic Image */}
      <div className="absolute inset-0 z-0">
        <SafeImage
          src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=90&w=2400"
          fallbackSrc="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=90&w=2400"
          alt="Sri Lankan professional technician working on service equipment"
          className="w-full h-full object-cover object-right md:object-center filter brightness-105 contrast-105 saturate-105"
        />
        {/* Soft Vignette & Text Readability Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/30" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-12 w-full flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white"
            >
              Everyday help, <br />
              <span className="text-emerald-400">
                made easier.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-base sm:text-lg md:text-xl text-slate-200 max-w-xl font-normal leading-relaxed"
            >
              Find trusted local professionals, request services, track your job and manage everything in one place.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link
                to="/register"
                className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm md:text-base rounded-full shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all hover:scale-105"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/services"
                className="px-7 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 font-semibold text-sm md:text-base rounded-full backdrop-blur-md transition-all hover:scale-105"
              >
                Explore Services
              </Link>
            </motion.div>

            {/* Sub-tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="pt-4 text-xs sm:text-sm text-slate-300/90 font-medium italic tracking-wide"
            >
              Local experts. Real people. Better service.
            </motion.div>
          </div>

          {/* Right Floating Badge / Verified Pro Showcase Card */}
          <div className="lg:col-span-5 hidden lg:flex justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="bg-white/95 text-slate-900 backdrop-blur-xl border border-white/50 p-4 sm:p-5 rounded-2xl shadow-2xl w-80 space-y-3 transform hover:-translate-y-1 transition-transform"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Professional</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>2.1 km away</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <SafeImage
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
                  alt="Kasun Fernando - Electrician"
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Kasun Electrical</h4>
                  <p className="text-xs text-slate-500">Electrician Specialist</p>
                  <div className="flex items-center gap-2 text-xs font-semibold mt-1">
                    <span className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500" /> 4.9 (124)
                    </span>
                    <span className="text-slate-400 text-[11px] flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-emerald-600" /> Colombo
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Hero Search Floating Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 md:mt-14 w-full"
        >
          <HeroSearchPanel />
        </motion.div>
      </div>
    </section>
  );
};
