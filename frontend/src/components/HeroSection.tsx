import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, Star, MapPin, CheckCircle2, ChevronLeft, ChevronRight, Pause, Play, Image as ImageIcon, Sparkles } from 'lucide-react';
import { HeroSearchPanel } from './HeroSearchPanel';
import { SafeImage } from './SafeImage';

export interface HeroSlide {
  id: number;
  image: string;
  fallback: string;
  tag: string;
  headline: string;
  subhead: string;
  proName: string;
  proRole: string;
  proRating: string;
  proReviews: number;
  proDistance: string;
  proAvatar: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=90&w=2400',
    fallback: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=90&w=2400',
    tag: 'Electrical & Repairs',
    headline: 'Everyday help,\nmade easier.',
    subhead: 'Find trusted local professionals, request services, track your job and manage everything in one place.',
    proName: 'Kasun Electrical',
    proRole: 'Certified Electrician',
    proRating: '4.9',
    proReviews: 124,
    proDistance: '2.1 km away',
    proAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=90&w=2400',
    fallback: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=90&w=2400',
    tag: 'Home Cleaning & Hygiene',
    headline: 'Sparkling clean homes,\neffortlessly delivered.',
    subhead: 'Professional, background-verified cleaning experts for your home or office space across Sri Lanka.',
    proName: 'Nimali Cleaning',
    proRole: 'House Care Specialist',
    proRating: '4.95',
    proReviews: 98,
    proDistance: '1.4 km away',
    proAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=90&w=2400',
    fallback: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=90&w=2400',
    tag: 'Plumbing & Repairs',
    headline: 'Fast plumbing fixes,\nzero hassle.',
    subhead: 'Urgent leak repairs, pipe fitting, and bathroom maintenance by local certified plumbers.',
    proName: 'Silva Plumbing',
    proRole: 'Master Plumber',
    proRating: '4.88',
    proReviews: 142,
    proDistance: '3.0 km away',
    proAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=90&w=2400',
    fallback: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=90&w=2400',
    tag: 'Appliance & AC Care',
    headline: 'Cooling & Appliances,\nexpertly restored.',
    subhead: 'Keep your household running smoothly with verified AC technicians and appliance specialists.',
    proName: 'Lanka AC Care',
    proRole: 'HVAC Specialist',
    proRating: '4.92',
    proReviews: 210,
    proDistance: '0.8 km away',
    proAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=90&w=2400',
    fallback: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=90&w=2400',
    tag: 'Family & Elder Assistance',
    headline: 'Care for loved ones,\neven from afar.',
    subhead: 'Book trusted household support, companion services, and elder care for family members back home.',
    proName: 'CarePlus Lanka',
    proRole: 'Family Assistant',
    proRating: '4.98',
    proReviews: 87,
    proDistance: '1.2 km away',
    proAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300'
  }
];

export const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Auto scrolling background timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const active = HERO_SLIDES[currentSlide];

  return (
    <section
      className="relative min-h-[88vh] lg:min-h-[90vh] flex flex-col justify-between overflow-hidden bg-slate-950 text-white group/hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Auto-Scrolling Ultra HD Background Image Carousel with Smooth Fade Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0 z-0"
        >
          <SafeImage
            src={active.image}
            fallbackSrc={active.fallback}
            alt={`${active.tag} - LankaEase Professional Service`}
            className="w-full h-full object-cover object-center filter brightness-105 contrast-105 saturate-105 transition-all duration-1000"
          />
          {/* Multi-layered cinematic overlays for extreme legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/40" />
        </motion.div>
      </AnimatePresence>

      {/* Top Slide Progress Bar */}
      <div className="absolute top-0 inset-x-0 z-20 flex h-1 bg-slate-900/50">
        {HERO_SLIDES.map((slide, idx) => (
          <div key={slide.id} className="flex-1 h-full relative overflow-hidden bg-white/10">
            {idx === currentSlide && (
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: isPaused ? '100%' : '100%' }}
                transition={{ duration: 4.5, ease: 'linear' }}
                className="h-full bg-emerald-500 shadow-lg shadow-emerald-500/50"
              />
            )}
            {idx < currentSlide && <div className="h-full bg-emerald-600/80 w-full" />}
          </div>
        ))}
      </div>

      {/* Main Hero Contents */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-20 pb-10 w-full flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Category Tag Pill */}
            <motion.div
              key={`tag-${active.id}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 text-emerald-300 font-bold text-xs uppercase tracking-wider shadow-lg"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{active.tag}</span>
            </motion.div>

            {/* Dynamic Animated Headline */}
            <motion.h1
              key={`headline-${active.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white"
            >
              {active.headline.split('\n')[0]} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                {active.headline.split('\n')[1]}
              </span>
            </motion.h1>

            {/* Subhead */}
            <motion.p
              key={`subhead-${active.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-slate-200 max-w-xl font-normal leading-relaxed drop-shadow"
            >
              {active.subhead}
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
                className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm md:text-base rounded-full shadow-xl shadow-emerald-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 group/btn"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/services"
                className="px-7 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 hover:border-emerald-500/50 font-semibold text-sm md:text-base rounded-full backdrop-blur-md transition-all hover:scale-105"
              >
                Explore Services
              </Link>

              <a
                href="#project-overview"
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-emerald-300 border border-white/20 font-semibold text-xs md:text-sm rounded-full backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105"
              >
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>View Project Diagram</span>
              </a>
            </motion.div>

            {/* Auto Scrolling Slide Selector Bar & Controls */}
            <div className="pt-4 flex items-center gap-4 text-slate-300">
              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-slate-900/80 hover:bg-emerald-600 hover:text-white border border-slate-700 transition-all hover:scale-110 cursor-pointer"
                  title="Previous Image"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-2 rounded-full bg-slate-900/80 hover:bg-emerald-600 hover:text-white border border-slate-700 transition-all hover:scale-110 cursor-pointer"
                  title={isPaused ? "Resume Auto Scroll" : "Pause Auto Scroll"}
                  aria-label="Toggle Auto Scroll"
                >
                  {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
                </button>

                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-slate-900/80 hover:bg-emerald-600 hover:text-white border border-slate-700 transition-all hover:scale-110 cursor-pointer"
                  title="Next Image"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Indicator Dots */}
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800 backdrop-blur-md">
                {HERO_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentSlide
                        ? 'w-6 bg-emerald-400'
                        : 'w-2 bg-slate-600 hover:bg-slate-400'
                    }`}
                    title={`Slide ${idx + 1}: ${slide.tag}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                HD 4K • {currentSlide + 1} of {HERO_SLIDES.length}
              </span>
            </div>
          </div>

          {/* Right Floating Showcase Card for current active pro */}
          <div className="lg:col-span-5 hidden lg:flex justify-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={`pro-${active.id}`}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white/95 text-slate-900 backdrop-blur-xl border border-white/60 p-5 rounded-2xl shadow-2xl w-80 space-y-3 transform hover:-translate-y-1.5 transition-all duration-300 hover:shadow-emerald-500/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Professional</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{active.proDistance}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <SafeImage
                    src={active.proAvatar}
                    alt={active.proName}
                    className="w-13 h-13 rounded-full object-cover border-2 border-emerald-500 shadow-md group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{active.proName}</h4>
                    <p className="text-xs text-slate-500 font-medium">{active.proRole}</p>
                    <div className="flex items-center gap-2 text-xs font-semibold mt-1">
                      <span className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-500" /> {active.proRating} ({active.proReviews})
                      </span>
                      <span className="text-slate-400 text-[11px] flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-emerald-600" /> Sri Lanka
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">Available Today</span>
                  <Link to="/providers" className="font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline">
                    View Profile →
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Hero Search Floating Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 md:mt-12 w-full"
        >
          <HeroSearchPanel />
        </motion.div>
      </div>
    </section>
  );
};
