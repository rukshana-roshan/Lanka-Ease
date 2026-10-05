import React from 'react';
import type { RequestStatus } from '../types';
import { CheckCircle2, Clock, Car, Wrench, Check, Star } from 'lucide-react';

interface RequestTimelineProps {
  status: RequestStatus;
}

const STEPS: { key: RequestStatus; label: string; icon: React.ReactNode }[] = [
  { key: 'CREATED', label: 'Request Created', icon: <Clock className="w-4 h-4" /> },
  { key: 'PROVIDER_FOUND', label: 'Provider Found', icon: <CheckCircle2 className="w-4 h-4" /> },
  { key: 'ACCEPTED', label: 'Accepted', icon: <Check className="w-4 h-4" /> },
  { key: 'ON_THE_WAY', label: 'On The Way', icon: <Car className="w-4 h-4" /> },
  { key: 'ARRIVED', label: 'Arrived', icon: <CheckCircle2 className="w-4 h-4" /> },
  { key: 'WORKING', label: 'Work In Progress', icon: <Wrench className="w-4 h-4" /> },
  { key: 'COMPLETED', label: 'Completed', icon: <CheckCircle2 className="w-4 h-4" /> },
  { key: 'REVIEWED', label: 'Reviewed', icon: <Star className="w-4 h-4" /> },
];

export const RequestTimeline: React.FC<RequestTimelineProps> = ({ status }) => {
  const getStatusIndex = (st: RequestStatus) => {
    switch (st) {
      case 'DRAFT': return -1;
      case 'CREATED': return 0;
      case 'PROVIDER_FOUND': return 1;
      case 'ACCEPTED': return 2;
      case 'ON_THE_WAY': return 3;
      case 'ARRIVED': return 4;
      case 'WORKING': return 5;
      case 'COMPLETED': return 6;
      case 'REVIEWED': return 7;
      default: return 0;
    }
  };

  const currentIndex = getStatusIndex(status);

  return (
    <div className="w-full py-4">
      <div className="relative flex items-center justify-between">
        {/* Progress Line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-800 z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-600 dark:bg-brand-500 z-0 transition-all duration-500"
          style={{ width: `${(Math.max(0, currentIndex) / (STEPS.length - 1)) * 100}%` }}
        />

        {/* Step Nodes */}
        {STEPS.map((step, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isCurrent
                    ? 'bg-brand-600 text-white ring-4 ring-brand-100 dark:ring-brand-950/80 scale-110 shadow-lg'
                    : isDone
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {step.icon}
              </div>
              <span
                className={`hidden md:block text-[10px] font-semibold mt-2 text-center max-w-[70px] truncate ${
                  isCurrent
                    ? 'text-brand-700 dark:text-brand-400 font-bold'
                    : isDone
                    ? 'text-slate-800 dark:text-slate-200'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Current Status Display */}
      <div className="md:hidden mt-3 text-center">
        <span className="text-xs font-bold text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-3 py-1 rounded-full border border-brand-200 dark:border-brand-800">
          Status: {STEPS[Math.max(0, currentIndex)]?.label || status}
        </span>
      </div>
    </div>
  );
};
