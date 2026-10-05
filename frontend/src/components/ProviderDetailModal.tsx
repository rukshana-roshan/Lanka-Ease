import React from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  CheckCircle,
  Briefcase,
  MessageSquare,
  Calendar,
  Award
} from 'lucide-react';
import { SafeImage } from './SafeImage';
import type { Provider } from '../types';

interface ProviderDetailModalProps {
  provider: Provider | null;
  onClose: () => void;
}

export const ProviderDetailModal: React.FC<ProviderDetailModalProps> = ({ provider, onClose }) => {
  if (!provider) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Background Cover Banner */}
        <div className="h-32 bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 relative p-4 flex justify-end items-start">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="px-6 pb-6 pt-0 relative">
          
          {/* Avatar and Verification Badge Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-16 mb-4 gap-4">
            <div className="relative">
              <SafeImage
                src={provider.profileImage}
                alt={provider.fullName}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-slate-900 shadow-xl"
              />
              {provider.isAvailable && (
                <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow" title="Available now" />
              )}
            </div>

            <div className="flex items-center gap-2">
              {provider.isVerified && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold border border-brand-200 dark:border-brand-800 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  Verified Provider
                </span>
              )}
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                provider.isAvailable
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {provider.isAvailable ? '🟢 Available Today' : '🔴 Busy / Booked'}
              </span>
            </div>
          </div>

          {/* Name & Profession */}
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              {provider.businessName}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-semibold mt-0.5 flex items-center gap-2">
              <span>{provider.fullName}</span>
              <span>•</span>
              <span className="text-brand-600 dark:text-brand-400 font-bold">{provider.categories[0]?.name || 'Service Specialist'}</span>
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs">
            <div className="space-y-0.5">
              <span className="text-slate-400 font-medium text-[11px]">Rating</span>
              <div className="flex items-center gap-1 font-extrabold text-amber-500 text-sm">
                <Star className="w-4 h-4 fill-amber-500" />
                <span>{provider.ratingAvg} / 5.0</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-400 font-medium text-[11px]">Jobs Done</span>
              <div className="font-extrabold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>{provider.jobsCompletedCount}+ completed</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-400 font-medium text-[11px]">Experience</span>
              <div className="font-extrabold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-1">
                <Award className="w-4 h-4 text-brand-500" />
                <span>{provider.experienceYears} Years</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-slate-400 font-medium text-[11px]">Avg Response</span>
              <div className="font-extrabold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-1">
                <Clock className="w-4 h-4 text-purple-500" />
                <span>~{provider.responseTimeMinutes} mins</span>
              </div>
            </div>
          </div>

          {/* Description Bio */}
          <div className="space-y-2 mb-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">About Professional</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal bg-slate-50/50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
              {provider.description}
            </p>
          </div>

          {/* Details & Coverage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-500" />
                <span>Service Coverage Cities</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {provider.serviceCities.map((city, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg">
                    📍 {city}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-brand-500" />
                <span>Pricing Rates</span>
              </h4>
              <div className="p-2.5 bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200/80 dark:border-brand-900 rounded-xl">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Estimated Price Range:</span>
                <strong className="text-sm text-brand-700 dark:text-brand-300 font-extrabold">
                  Rs. {provider.priceMin.toLocaleString()} - {provider.priceMax.toLocaleString()}
                </strong>
              </div>
            </div>
          </div>

          {/* Direct Contact info */}
          <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs mb-6 font-semibold">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Phone className="w-4 h-4 text-emerald-500" />
              <span>{provider.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Mail className="w-4 h-4 text-brand-500" />
              <span>{provider.email}</span>
            </div>
          </div>

          {/* Action Buttons: Request / Message */}
          <div className="flex items-center gap-3 pt-2">
            <Link
              to={`/app/messages?conversationWith=${provider.userId}`}
              onClick={onClose}
              className="px-4 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-900 dark:text-slate-100 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Direct Chat</span>
            </Link>

            <Link
              to={`/app/request?providerId=${provider.id}`}
              onClick={onClose}
              className="flex-1 py-3 bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Calendar className="w-4 h-4" />
              <span>Book & Request Service Now</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
