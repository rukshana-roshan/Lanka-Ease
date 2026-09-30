import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SafeImage } from './SafeImage';
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
  Maximize2, 
  X,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PromoBanner: React.FC = () => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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
    <section className="py-10 md:py-14 bg-slate-900/90 text-white relative overflow-hidden">
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
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Your One Stop Solution for <span className="text-emerald-400">Everyday Services in Sri Lanka</span>
            </h2>
          </div>
          <Link 
            to="/services" 
            className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all shrink-0 self-start md:self-auto"
          >
            <span>Explore All Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Banner Graphic Showcase Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl md:rounded-3xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl bg-slate-950 group"
        >
          <div className="relative cursor-pointer" onClick={() => setIsLightboxOpen(true)}>
            <SafeImage
              src="/images/banner.jpg"
              fallbackSrc="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=90&w=2400"
              alt="LankaEase Banner - Your One Stop Solution for Everyday Services in Sri Lanka"
              className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-500"
            />
            {/* Click to expand hover hint */}
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-white font-bold text-sm backdrop-blur-[2px]">
              <Maximize2 className="w-5 h-5 text-emerald-400" />
              <span>Click to View Full High-Res Banner</span>
            </div>
          </div>
        </motion.div>

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

      {/* Lightbox Modal for Full Resolution Image */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md cursor-pointer"
          >
            <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute -top-12 right-0 p-2 text-slate-400 hover:text-white bg-slate-900 rounded-full border border-slate-700"
              >
                <X className="w-6 h-6" />
              </button>
              <SafeImage
                src="/images/banner.jpg"
                fallbackSrc="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=90&w=2400"
                alt="LankaEase Banner Poster Lightbox"
                className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-slate-700"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
