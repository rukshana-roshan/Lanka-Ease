import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MOCK_CATEGORIES, MOCK_PROVIDERS } from '../services/api';
import { Search, ShieldCheck, Star, MessageSquare } from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('categoryId');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCatId, setSelectedCatId] = useState<number | null>(initialCategory ? Number(initialCategory) : null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);

  const filteredProviders = useMemo(() => {
    return MOCK_PROVIDERS.filter((p) => {
      if (selectedCatId && !p.categories.some((c) => c.id === selectedCatId)) return false;
      if (verifiedOnly && !p.isVerified) return false;
      if (availableOnly && !p.isAvailable) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = p.businessName.toLowerCase().includes(term) || p.fullName.toLowerCase().includes(term);
        const matchesCity = p.serviceCities.some((c) => c.toLowerCase().includes(term));
        if (!matchesName && !matchesCity) return false;
      }
      return true;
    });
  }, [selectedCatId, verifiedOnly, availableOnly, searchTerm]);

  return (
    <div className="space-y-6 pb-24 pt-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Explore Professionals</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Search trusted Sri Lankan local service providers near you</p>
      </div>

      {/* Global Search & Filters Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search provider name or city (e.g., Kasun, Colombo, Kandy)..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedCatId(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCatId === null ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            All Services
          </button>
          {MOCK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCatId(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCatId === cat.id ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Checkbox Toggles */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="rounded text-brand-600 focus:ring-brand-500"
            />
            <span>✓ Verified Only</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="rounded text-brand-600 focus:ring-brand-500"
            />
            <span>🟢 Available Now</span>
          </label>
        </div>
      </div>

      {/* Provider List Results */}
      {filteredProviders.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No professionals found</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try clearing your filters or increasing your search radius.</p>
          <button
            onClick={() => { setSelectedCatId(null); setSearchTerm(''); setVerifiedOnly(false); setAvailableOnly(false); }}
            className="mt-4 px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProviders.map((pro) => (
            <div key={pro.id} className="glass-card p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img src={pro.profileImage} alt={pro.fullName} className="w-14 h-14 rounded-full object-cover border-2 border-brand-500" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                      {pro.businessName}
                      {pro.isVerified && <ShieldCheck className="w-4 h-4 text-brand-600" />}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{pro.fullName} • {pro.experienceYears} yrs exp</p>
                    <div className="flex items-center gap-2 text-xs font-semibold mt-1">
                      <span className="flex items-center gap-1 text-saffron-500">
                        <Star className="w-3.5 h-3.5 fill-saffron-500" /> {pro.ratingAvg}
                      </span>
                      <span className="text-slate-400">• {pro.jobsCompletedCount} jobs</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">{pro.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {pro.serviceCities.map((city, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-400 rounded-md">
                      📍 {city}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to={`/app/messages?conversationWith=${pro.userId}`}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Chat
                </Link>
                <Link
                  to={`/app/request?providerId=${pro.id}`}
                  className="flex-1 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl text-center shadow"
                >
                  Request Service
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
