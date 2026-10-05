import React from 'react';
import { MapPin, Navigation, Car, ShieldCheck } from 'lucide-react';

interface InteractiveMapProps {
  address: string;
  providerName?: string;
  providerPhone?: string;
  etaMinutes?: number;
  distanceKm?: number;
  status?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  address,
  providerName = 'Sunil Rathnayake',
  etaMinutes = 18,
  distanceKm = 2.4,
  status = 'ON_THE_WAY',
}) => {
  return (
    <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-inner group">
      {/* Map Graphic Canvas Simulation */}
      <div className="absolute inset-0 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:16px_16px] opacity-20 dark:opacity-30" />
      
      {/* Simulated Road Grid Lines */}
      <svg className="absolute inset-0 w-full h-full stroke-slate-300/40 dark:stroke-slate-700/40 stroke-2" fill="none">
        <path d="M 0 100 Q 150 120 300 80 T 600 150" />
        <path d="M 50 0 Q 120 180 200 300" />
        <path d="M 250 0 L 250 300" />
        {/* Active Animated Provider Route Line */}
        <path
          d="M 60 80 L 150 140 L 260 210"
          className="stroke-brand-600 dark:stroke-brand-400 stroke-[4] stroke-dasharray-[6] animate-[pulse_2s_infinite]"
          fill="none"
        />
      </svg>

      {/* Customer Location Pin */}
      <div className="absolute left-[65%] top-[65%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-md shadow-md whitespace-nowrap mb-1">
          📍 Destination
        </div>
        <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg animate-bounce">
          <MapPin className="w-5 h-5" />
        </div>
      </div>

      {/* Live Moving Provider Marker */}
      <div className="absolute left-[35%] top-[40%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="px-2.5 py-1 bg-brand-700 text-white text-[10px] font-bold rounded-full shadow-lg flex items-center gap-1 mb-1">
          <Car className="w-3 h-3 animate-pulse" /> {providerName}
        </div>
        <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-xl ring-4 ring-brand-300/50">
          <Navigation className="w-5 h-5 rotate-45" />
        </div>
      </div>

      {/* Top Floating ETA Card */}
      <div className="absolute top-3 left-3 right-3 md:left-4 md:right-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-xs">
            {etaMinutes}m
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
              <span>Estimated Arrival</span>
              <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              Distance: {distanceKm} km away • {status}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Address Info Badge */}
      <div className="absolute bottom-3 left-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md flex items-center gap-2 text-xs">
        <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
        <span className="truncate text-slate-700 dark:text-slate-300 font-medium">{address}</span>
      </div>
    </div>
  );
};
