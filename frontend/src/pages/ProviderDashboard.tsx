import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_REQUESTS } from '../services/api';
import { SafeImage } from '../components/SafeImage';
import { ProviderProfileModal } from '../components/ProviderProfileModal';
import {
  Star,
  ToggleLeft,
  ToggleRight,
  Camera,
  ShieldCheck,
  MapPin,
  CheckCircle,
  Briefcase
} from 'lucide-react';

export const ProviderDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [providerInfo, setProviderInfo] = useState({
    businessName: 'Kasun Electrical Solutions',
    profession: 'Certified Electrician & Technician',
    profileImage: user?.profileImage || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    ratingAvg: 4.9,
    jobsCompletedCount: 124,
    serviceCities: 'Colombo, Dehiwala, Nugegoda',
  });

  const handleSaveProvider = (updated: any) => {
    setProviderInfo((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  return (
    <div className="space-y-6 pb-24 pt-4">
      {/* Header & Provider Picture Section */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/80 p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Provider Picture Avatar & Info */}
        <div className="flex items-center gap-4 relative z-10">
          <div
            onClick={() => setIsProfileModalOpen(true)}
            className="relative group cursor-pointer shrink-0"
            title="Click to edit provider picture"
          >
            <SafeImage
              src={providerInfo.profileImage}
              fallbackSrc="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300"
              alt={providerInfo.businessName}
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-full object-cover border-3 border-amber-500 shadow-xl group-hover:scale-105 transition-transform"
            />
            <div className="absolute bottom-0 right-0 p-1.5 bg-amber-500 text-slate-950 rounded-full shadow border-2 border-white dark:border-slate-900 group-hover:scale-110 transition-transform">
              <Camera className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">Provider Hub</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified Pro
              </span>
            </div>
            <h1 className="text-2xl font-bold">{providerInfo.businessName}</h1>
            <p className="text-xs text-slate-300 font-medium">
              {user?.fullName || 'Kasun Fernando'} • {providerInfo.profession}
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-0.5">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> {providerInfo.ratingAvg} ({providerInfo.jobsCompletedCount} jobs)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" /> {providerInfo.serviceCities}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-2xl flex items-center gap-2 transition-all hover:scale-105 cursor-pointer shadow-md"
          >
            <Camera className="w-4 h-4" />
            <span>Change Provider Picture</span>
          </button>

          <button
            onClick={() => setIsAvailable(!isAvailable)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-lg transition-all ${
              isAvailable ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
            }`}
          >
            {isAvailable ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
            <span>{isAvailable ? '🟢 Available for Jobs' : '⚪ Unavailable'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">New Requests</span>
          <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">2</p>
        </div>
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Jobs</span>
          <p className="text-2xl font-extrabold text-saffron-500">1</p>
        </div>
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Today's Earnings</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">Rs. 14,500</p>
        </div>
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Rating</span>
          <p className="text-2xl font-extrabold text-saffron-500 flex items-center gap-1">
            4.9 <Star className="w-5 h-5 fill-saffron-500 inline" />
          </p>
        </div>
      </div>

      {/* Provider Incoming Requests Feed */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">Incoming Service Requests</h3>
        <div className="space-y-4">
          {MOCK_REQUESTS.map((req) => (
            <div key={req.id} className="glass-card p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{req.customerName}</h4>
                  <p className="text-xs text-slate-500">📍 {req.address}</p>
                </div>
                <span className="px-2.5 py-1 bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold rounded-full">
                  {req.status}
                </span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                {req.problemDescription}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Est. Price: Rs. {req.estimatedPrice}</span>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 text-xs font-bold rounded-xl">Reject</button>
                  <button className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow">Accept Job</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Provider Section Profile Picture Modal */}
      <ProviderProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSaveProvider={handleSaveProvider}
      />
    </div>
  );
};
