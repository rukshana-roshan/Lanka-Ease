import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation, Clock, CheckCircle2, Circle, ArrowRight, ShieldCheck } from 'lucide-react';
import { SafeImage } from './SafeImage';

export const LiveTrackingSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-slate-950 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0b2520] dark:bg-slate-900 border border-emerald-900/80 rounded-3xl md:rounded-[2.5rem] p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Text Column */}
            <div className="lg:col-span-5 space-y-5 text-left">
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                LIVE TRACKING
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Know exactly where your professional is
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Track your service request in real-time with live location and status updates.
              </p>

              <div className="pt-3">
                <Link
                  to="/app/requests"
                  className="inline-flex items-center gap-2 px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-full shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Live Map & Status Timeline Graphic */}
            <div className="lg:col-span-7">
              <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
                {/* Map Graphic Header */}
                <div className="relative h-60 sm:h-72 rounded-2xl overflow-hidden border border-slate-800 bg-[#0c1824] flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />

                  {/* Lotus Tower Landmarks Silhouette Background */}
                  <svg className="absolute bottom-0 right-4 w-40 opacity-20 text-slate-400" viewBox="0 0 100 200" fill="currentColor">
                    <rect x="45" y="60" width="10" height="140" />
                    <circle cx="50" cy="50" r="20" />
                    <polygon points="50,10 40,40 60,40" />
                  </svg>

                  {/* Route Line */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M 100 180 Q 200 100 360 120 T 480 70"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3.5"
                      strokeDasharray="6 4"
                      className="animate-pulse"
                    />
                  </svg>

                  {/* Pin 1: Customer Home Pin */}
                  <div className="absolute top-[25%] right-[20%] flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white animate-ping absolute" />
                    <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow" />
                  </div>

                  {/* Pin 2: Provider Vehicle Pin */}
                  <div className="absolute bottom-[30%] left-[20%] flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-emerald-500 border-2 border-white shadow-xl flex items-center justify-center text-white z-10">
                      <Navigation className="w-4 h-4 transform rotate-45" />
                    </div>
                  </div>

                  {/* Floating ETA & Provider Quick Badge */}
                  <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-slate-900/95 backdrop-blur-md border border-slate-700 p-3 rounded-2xl flex items-center gap-3 shadow-xl">
                    <SafeImage
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
                      alt="Kasun Fernando"
                      className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="font-bold text-xs text-white">Kasun Electrical</h4>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> On the way • ETA 12 min (2.1 km)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Timeline Steps Bar */}
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-[10px] font-semibold">
                  <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 flex flex-col items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mb-1" />
                    <span>Request Created</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 flex flex-col items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mb-1" />
                    <span>Provider Accepted</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-900/90 border border-emerald-500 text-emerald-100 flex flex-col items-center animate-pulse">
                    <Navigation className="w-3.5 h-3.5 text-emerald-400 mb-1" />
                    <span>On The Way</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 flex flex-col items-center">
                    <Circle className="w-3.5 h-3.5 text-slate-600 mb-1" />
                    <span>Arrived</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 flex flex-col items-center">
                    <Circle className="w-3.5 h-3.5 text-slate-600 mb-1" />
                    <span>Working</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 flex flex-col items-center">
                    <Circle className="w-3.5 h-3.5 text-slate-600 mb-1" />
                    <span>Completed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
