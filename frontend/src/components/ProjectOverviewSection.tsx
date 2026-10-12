import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, HeartHandshake, CheckCircle, Sparkles } from 'lucide-react';

export const ProjectOverviewSection: React.FC = () => {
  const features = [
    {
      icon: <CheckCircle className="w-6 h-6 text-emerald-400" />,
      title: "1. Easy Mobile Booking",
      desc: "Customers select home services effortlessly from their phone in Sinhala, Tamil, or English."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: "2. Verified Local Pros",
      desc: "Background-checked Sri Lankan electricians, plumbers, cleaners, and mechanics near you."
    },
    {
      icon: <MapPin className="w-6 h-6 text-emerald-400" />,
      title: "3. Real-Time GPS Tracking",
      desc: "Track service provider arrival in real time with interactive live mapping and status timeline."
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-emerald-400" />,
      title: "4. Family Assistance Mode",
      desc: "Book and manage trusted home services remotely for aging parents or relatives."
    }
  ];

  return (
    <section className="relative py-16 md:py-20 bg-slate-900 text-white overflow-hidden border-y border-slate-800">
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
            The Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">LankaEase Solution</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-base md:text-lg leading-relaxed"
          >
            Connecting Sri Lankan households with verified local professionals, live GPS tracking, and remote family support in one seamless ecosystem.
          </motion.p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx }}
              className="p-6 rounded-3xl bg-slate-950/80 border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-slate-800/90 transition-all duration-300 hover:-translate-y-1.5 shadow-xl group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md shadow-emerald-500/10">
                {feat.icon}
              </div>
              <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">
                {feat.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed font-normal">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
