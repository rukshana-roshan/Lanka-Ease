import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Droplet, 
  Car, 
  Home, 
  Sparkles, 
  Wrench, 
  Flower2, 
  Laptop, 
  ShieldCheck, 
  Search, 
  MapPin, 
  Clock, 
  ArrowRight,
  Maximize2,
  X,
  Download,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SafeImage } from './SafeImage';

export const PromoBanner: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    { icon: Zap, name: 'Electricians', color: 'bg-amber-500/10 text-amber-500 border-amber-500/30' },
    { icon: Droplet, name: 'Plumbers', color: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
    { icon: Car, name: 'Vehicle Services', color: 'bg-red-500/10 text-red-500 border-red-500/30' },
    { icon: Home, name: 'Home Services', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' },
    { icon: Sparkles, name: 'Cleaning', color: 'bg-purple-500/10 text-purple-500 border-purple-500/30' },
    { icon: Wrench, name: 'Repair & Maintenance', color: 'bg-orange-500/10 text-orange-500 border-orange-500/30' },
    { icon: Flower2, name: 'Beauty & Wellness', color: 'bg-pink-500/10 text-pink-500 border-pink-500/30' },
    { icon: Laptop, name: 'IT & Tech Support', color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30' },
  ];

  const highlights = [
    { icon: ShieldCheck, title: 'Trusted Professionals', desc: 'Verified identity & background checked' },
    { icon: Search, title: 'Fast & Easy Search', desc: 'Connect with local pros in seconds' },
    { icon: MapPin, title: 'Local Services Across Sri Lanka', desc: 'Available in Colombo, Kandy, Galle & more' },
    { icon: Clock, title: 'Save Time & Effort', desc: 'Seamless booking & transparent pricing' },
  ];

  return (
    <section className="py-12 md:py-16 bg-slate-900/90 text-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> LankaEase Promo Showcase
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Your One Stop Solution for <span className="text-emerald-400">Everyday Services in Sri Lanka</span>
            </h2>
          </div>
          <Link 
            to="/services" 
            className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all shrink-0 self-start md:self-auto hover:scale-105"
          >
            <span>Explore All Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Ultra High Definition LankaEase Promo Showcase Image Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-emerald-500/30 bg-slate-950/90 shadow-2xl group">
          {/* Top Control Bar */}
          <div className="px-5 py-2.5 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-mono text-slate-400 ml-2 hidden sm:inline">LankaEase Showcase • Ultra HD 4K</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> High HD Quality
              </span>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs transition-all hover:scale-105 shadow-md shadow-emerald-600/30 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">View Full HD</span>
              </button>
            </div>
          </div>

          {/* Interactive HD Showcase Image */}
          <div 
            onClick={() => setIsModalOpen(true)}
            className="relative cursor-pointer overflow-hidden bg-slate-950 flex items-center justify-center p-2 sm:p-4 group/img"
          >
            <SafeImage
              src="/images/lanka_ease_promo_hd.jpg"
              fallbackSrc="/images/banner.jpg"
              alt="LankaEase High HD Quality Promo Showcase Banner"
              className="w-full h-auto max-h-[550px] object-cover rounded-2xl group-hover/img:scale-[1.015] transition-transform duration-700 shadow-xl"
            />

            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="px-5 py-2.5 bg-emerald-600/95 backdrop-blur-md text-white rounded-full font-bold text-xs sm:text-sm shadow-2xl flex items-center gap-2 transform translate-y-2 group-hover/img:translate-y-0 transition-transform">
                <Maximize2 className="w-4 h-4" />
                <span>Click to Expand Ultra HD Image</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-2">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                to="/services"
                className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 flex flex-col items-center text-center space-y-2 group transition-all hover:-translate-y-1"
              >
                <div className={`p-2.5 rounded-xl border ${cat.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors line-clamp-1">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* 4 Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
          {highlights.map((h, i) => {
            const Icon = h.icon;
            return (
              <div key={i} className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{h.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{h.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Fullscreen HD Image Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col p-4 sm:p-8 overflow-auto"
            onClick={() => setIsModalOpen(false)}
          >
            <div className="flex items-center justify-between text-white mb-4 max-w-7xl mx-auto w-full">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-600 rounded-xl">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">LankaEase Promo Showcase</h3>
                  <p className="text-xs text-slate-400">Ultra HD High Quality Promo Showcase Banner</p>
                </div>
              </div>

              <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                <a
                  href="/images/lanka_ease_promo_hd.jpg"
                  download="LankaEase_Promo_Showcase_HD.jpg"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Image</span>
                </a>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div
              className="flex-1 flex items-center justify-center max-w-7xl mx-auto w-full overflow-auto py-2"
              onClick={(e) => e.stopPropagation()}
            >
              <SafeImage
                src="/images/lanka_ease_promo_hd.jpg"
                fallbackSrc="/images/banner.jpg"
                alt="Full High-Definition LankaEase Promo Showcase Image"
                className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-slate-700 shadow-2xl"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

