import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MOCK_CATEGORIES, MOCK_PROVIDERS } from '../services/api';
import { Search, ShieldCheck, Star, Eye, MessageSquare, Calendar } from 'lucide-react';
import { SafeImage } from '../components/SafeImage';
import { ProviderDetailModal } from '../components/ProviderDetailModal';
import type { Provider } from '../types';

export const ProvidersPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCatId = searchParams.get('categoryId');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCatId, setSelectedCatId] = useState<number | null>(initialCatId ? Number(initialCatId) : null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selectedProviderModal, setSelectedProviderModal] = useState<Provider | null>(null);

  const filteredProviders = useMemo(() => {
    return MOCK_PROVIDERS.filter((p) => {
      if (selectedCatId && !p.categories.some((c) => c.id === selectedCatId)) return false;
      if (verifiedOnly && !p.isVerified) return false;
      if (availableOnly && !p.isAvailable) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = p.businessName.toLowerCase().includes(term) || p.fullName.toLowerCase().includes(term);
        const matchesCity = p.serviceCities.some((c) => c.toLowerCase().includes(term));
        const matchesCat = p.categories.some((c) => c.name.toLowerCase().includes(term));
        if (!matchesName && !matchesCity && !matchesCat) return false;
      }
      return true;
    });
  }, [selectedCatId, verifiedOnly, availableOnly, searchTerm]);

  return (
    <div className="space-y-6 pb-24 pt-4">
      {/* Page Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
            PRO DIRECTORY
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">Verified Local Professionals</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Showing {filteredProviders.length} active service providers. Click any profile to view full credentials, contact details & rates.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs font-bold text-slate-300">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Every Category has &gt;10 Verified Experts</span>
        </div>
      </div>

      {/* Global Search & Category Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search provider name, city (e.g. Kasun, Colombo, Kandy), or profession..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedCatId(null)}
            className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              selectedCatId === null ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            All Categories ({MOCK_PROVIDERS.length})
          </button>
          {MOCK_CATEGORIES.map((cat) => {
            const count = MOCK_PROVIDERS.filter((p) => p.categories.some((c) => c.id === cat.id)).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCatId(cat.id)}
                className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCatId === cat.id ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Checkbox Toggles */}
        <div className="flex items-center gap-5 text-xs font-bold text-slate-700 dark:text-slate-300 pt-3 border-t border-slate-100 dark:border-slate-800">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="rounded text-slate-900 focus:ring-slate-900"
            />
            <span>✓ Verified Professionals Only</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="rounded text-slate-900 focus:ring-slate-900"
            />
            <span>🟢 Available Today Only</span>
          </label>
        </div>
      </div>

      {/* Provider Card Grid */}
      {filteredProviders.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <p className="text-base font-bold text-slate-800 dark:text-slate-200">No professionals found</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Try changing your filters or searching another keyword.</p>
          <button
            onClick={() => { setSelectedCatId(null); setSearchTerm(''); setVerifiedOnly(false); setAvailableOnly(false); }}
            className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProviders.map((pro) => (
            <div
              key={pro.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSelectedProviderModal(pro)} className="relative text-left">
                      <SafeImage
                        src={pro.profileImage}
                        alt={pro.fullName}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-500 shadow-md group-hover:scale-105 transition-transform"
                      />
                      {pro.isAvailable && (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                      )}
                    </button>
                    <div>
                      <h3
                        onClick={() => setSelectedProviderModal(pro)}
                        className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors cursor-pointer line-clamp-1"
                      >
                        {pro.businessName}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {pro.fullName} • {pro.categories[0]?.name || 'Specialist'}
                      </p>
                    </div>
                  </div>

                  {pro.isVerified && (
                    <span className="p-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400" title="Verified Pro">
                      <ShieldCheck className="w-5 h-5" />
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                  {pro.description}
                </p>

                {/* Rating & Rate Badges */}
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl space-y-1 text-xs mb-3">
                  <div className="flex items-center justify-between font-bold">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-amber-500" />
                      <span>{pro.ratingAvg}</span>
                      <span className="text-slate-400 font-normal">({pro.jobsCompletedCount} jobs)</span>
                    </div>
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                      Rs. {pro.priceMin.toLocaleString()} - {pro.priceMax.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Cities */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {pro.serviceCities.map((city, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-400 rounded-md">
                      📍 {city}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons: View Profile Modal & Book */}
              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setSelectedProviderModal(pro)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-black text-white dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Full Profile</span>
                </button>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/app/messages?conversationWith=${pro.userId}`}
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Chat
                  </Link>
                  <Link
                    to={`/app/request?providerId=${pro.id}`}
                    className="flex-1 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl text-center shadow flex items-center justify-center gap-1"
                  >
                    <Calendar className="w-3.5 h-3.5" /> Request Service
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Provider Details View Modal */}
      {selectedProviderModal && (
        <ProviderDetailModal
          provider={selectedProviderModal}
          onClose={() => setSelectedProviderModal(null)}
        />
      )}
    </div>
  );
};
