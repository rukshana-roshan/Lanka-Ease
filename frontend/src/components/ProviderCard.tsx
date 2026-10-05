import React, { useState } from 'react';
import { ShieldCheck, Star, MapPin, ArrowRight } from 'lucide-react';
import { SafeImage } from './SafeImage';
import { ProviderDetailModal } from './ProviderDetailModal';
import type { Provider } from '../types';

export interface ProviderItem {
  id: number;
  fullName: string;
  businessName: string;
  profession: string;
  isVerified: boolean;
  ratingAvg: number;
  jobsCount: number;
  distanceKm: number;
  isAvailable: boolean;
  priceMin: number;
  priceMax: number;
  image: string;
  city: string;
  rawProvider?: Provider;
}

interface ProviderCardProps {
  provider: ProviderItem;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider }) => {
  const [showModal, setShowModal] = useState(false);

  // Fallback Provider object for modal if rawProvider not passed
  const modalProvider: Provider = provider.rawProvider || {
    id: provider.id,
    userId: 100 + provider.id,
    fullName: provider.fullName,
    businessName: provider.businessName,
    description: `${provider.businessName} provides expert ${provider.profession} services in ${provider.city}. Trusted Sri Lankan professional with high rating.`,
    experienceYears: 7,
    priceMin: provider.priceMin,
    priceMax: provider.priceMax,
    isVerified: provider.isVerified,
    verificationStatus: 'APPROVED',
    ratingAvg: provider.ratingAvg,
    jobsCompletedCount: provider.jobsCount,
    responseTimeMinutes: 15,
    isAvailable: provider.isAvailable,
    currentLatitude: 6.9271,
    currentLongitude: 79.8612,
    profileImage: provider.image,
    phone: '+94773456789',
    email: 'contact@lankaease.lk',
    categories: [{ id: 1, name: provider.profession, slug: 'service', description: '', iconName: 'Wrench', isActive: true }],
    serviceCities: [provider.city, 'Colombo', 'Kandy'],
  };

  return (
    <>
      <div className="flex-none w-[260px] sm:w-[280px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group snap-scroll-start">
        <div>
          {/* Top Header: Avatar & Verified Badge */}
          <div className="flex items-start justify-between mb-3">
            <button
              onClick={() => setShowModal(true)}
              className="relative text-left focus:outline-none"
              title="Click to view profile"
            >
              <SafeImage
                src={provider.image}
                alt={provider.fullName}
                className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow-sm group-hover:scale-105 transition-transform"
              />
              {provider.isAvailable && (
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" title="Available now" />
              )}
            </button>

            {provider.isVerified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified
              </span>
            )}
          </div>

          {/* Business Name & Profession */}
          <button
            onClick={() => setShowModal(true)}
            className="text-left w-full focus:outline-none"
          >
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors line-clamp-1 flex items-center gap-1">
              <span>{provider.businessName}</span>
              <span className="text-emerald-600 font-bold">✓</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              {provider.profession}
            </p>
          </button>

          {/* Ratings & Distance */}
          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span>{provider.ratingAvg}</span>
              <span className="text-slate-400 font-normal">({provider.jobsCount} reviews)</span>
            </div>
            <div className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-600" />
              <span>{provider.distanceKm} km • <strong className="text-emerald-600 dark:text-emerald-400">Available</strong></span>
            </div>
            <div className="text-slate-600 dark:text-slate-300 font-semibold text-xs pt-1">
              Rs. {provider.priceMin.toLocaleString()} - {provider.priceMax.toLocaleString()}
            </div>
          </div>
        </div>

        {/* View Profile Action Link matching design screenshot */}
        <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setShowModal(true)}
            className="w-full py-1.5 px-3 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl flex items-center justify-between transition-colors"
          >
            <span>View Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {showModal && (
        <ProviderDetailModal
          provider={modalProvider}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};
