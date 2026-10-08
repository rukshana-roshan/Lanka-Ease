import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SafeImage } from './SafeImage';
import { Maximize2, X, Download, ShieldCheck, MapPin, HeartHandshake, CheckCircle, Sparkles } from 'lucide-react';

export const ProjectOverviewSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const features = [
    {
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
      title: "1. Easy Mobile Booking",
      desc: "Customers select home services effortlessly from their phone in Sinhala, Tamil, or English."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      title: "2. Verified Local Pros",
      desc: "Background-checked Sri Lankan electricians, plumbers, cleaners, and mechanics near you."
    },
    {
      icon: <MapPin className="w-5 h-5 text-emerald-500" />,
      title: "3. Real-Time GPS Tracking",
      desc: "Track service provider arrival in real time with interactive live mapping and status timeline."
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-emerald-500" />,
      title: "4. Family Assistance Mode",
      desc: "Book and manage trusted home services remotely for aging parents or relatives."
    }
  ];

  return (
    <section className="relative py-16 md:py-24 bg-slate-900 text-white overflow-hidden border-y border-slate-800">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Platform Ecosystem Overview
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white"
          >
            The Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">LankaEase Solution</span> in One View
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-base md:text-lg leading-relaxed"
          >
            A high-definition architectural map showcasing how LankaEase connects Sri Lankan households with verified local professionals, live tracking, and remote family support.
          </motion.p>
        </div>

        {/* High Definition Project Infographic Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden border border-emerald-500/30 bg-slate-950/80 shadow-2xl group"
        >
          {/* Top Banner Control Bar */}
          <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-all hover:scale-105 shadow-md shadow-emerald-600/30 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>View HD Fullscreen</span>
              </button>
            </div>
          </div>

          {/* Interactive Image Container */}
          <div
            onClick={() => setIsModalOpen(true)}
            className="relative cursor-pointer overflow-hidden group/img bg-slate-950 flex items-center justify-center p-2 sm:p-4"
          >
            <SafeImage
              src="/images/project-overview.jpg"
              fallbackSrc="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=90&w=2400"
              alt="Complete LankaEase Project Infographic Overview Diagram"
              className="w-full h-auto max-h-[650px] object-contain rounded-2xl group-hover/img:scale-[1.015] transition-transform duration-500"
            />

            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="px-5 py-2.5 bg-emerald-600/90 backdrop-blur-md text-white rounded-full font-bold text-sm shadow-xl flex items-center gap-2 transform translate-y-2 group-hover/img:translate-y-0 transition-transform">
                <Maximize2 className="w-4 h-4" />
                <span>Click to Expand High-Res Image</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx }}
              className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 hover:border-emerald-500/50 hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                {feat.icon}
              </div>
              <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors">
                {feat.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-normal">
                {feat.desc}
              </p>
            </motion.div>
          ))}
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
                  <h3 className="text-lg font-bold">LankaEase Platform Architecture Diagram</h3>
                  <p className="text-xs text-slate-400">High-Definition Visual Solution Map</p>
                </div>
              </div>

              <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                <a
                  href="/images/project-overview.jpg"
                  download="LankaEase_Project_Overview_HD.jpg"
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
                src="/images/project-overview.jpg"
                alt="Full High-Definition LankaEase Project Diagram"
                className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-slate-700 shadow-2xl"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
