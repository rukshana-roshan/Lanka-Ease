import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MOCK_CATEGORIES, MOCK_PROVIDERS, MOCK_REQUESTS } from '../services/api';
import {
  Wrench,
  Search,
  Star,
  ChevronRight,
  ShieldCheck,
  Users,
  Car
} from 'lucide-react';
import { motion } from 'framer-motion';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const activeRequest = MOCK_REQUESTS.find(
    (r) => r.status === 'ON_THE_WAY' || r.status === 'WORKING' || r.status === 'ACCEPTED'
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate('/app/request', { state: { problemDescription: query } });
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Personalized Greeting Header */}
      <div className="bg-gradient-to-r from-brand-700 to-brand-500 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-brand-100 font-semibold tracking-wide uppercase">Good Morning 👋</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold mt-0.5">{user?.fullName || 'Kamal Perera'}</h1>
            </div>
            <Link
              to="/app/family"
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Users className="w-4 h-4 text-saffron-300" />
              <span>Family Help</span>
            </Link>
          </div>

          <p className="text-xs text-brand-100 mt-3 font-medium">What do you need help with today?</p>

          {/* Quick Problem Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="🔍 Describe your problem (e.g. AC not cooling...)"
                className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 rounded-2xl text-sm shadow-inner placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-saffron-400"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Active Request Live Banner (if any) */}
      {activeRequest && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-saffron-500/10 dark:bg-saffron-950/40 border border-saffron-300 dark:border-saffron-800 p-4 rounded-2xl flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-saffron-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Car className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{activeRequest.categoryName}</h4>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-saffron-500 text-slate-950 rounded-full">
                  {activeRequest.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 truncate max-w-xs">{activeRequest.address}</p>
            </div>
          </div>

          <Link
            to={`/app/requests/${activeRequest.id}`}
            className="px-4 py-2 bg-saffron-500 hover:bg-saffron-600 text-slate-950 text-xs font-bold rounded-xl shadow flex items-center gap-1 transition-all shrink-0"
          >
            <span>Track Live</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      )}

      {/* Popular Services Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Popular Services</h3>
          <Link to="/services" className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline">
            See All
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {MOCK_CATEGORIES.slice(0, 6).map((cat) => (
            <Link
              key={cat.id}
              to={`/app/explore?categoryId=${cat.id}`}
              className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center hover:border-brand-500 transition-all shadow-sm"
            >
              <div className="w-10 h-10 mx-auto rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-2">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Nearby Professionals Carousel / Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Nearby Professionals</h3>
          <Link to="/app/explore" className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline">
            View Map
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_PROVIDERS.slice(0, 2).map((pro) => (
            <div key={pro.id} className="glass-card p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={pro.profileImage} alt={pro.fullName} className="w-12 h-12 rounded-full object-cover border-2 border-brand-500" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                    {pro.businessName}
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1 text-saffron-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-saffron-500" /> {pro.ratingAvg}
                    </span>
                    <span>• {pro.jobsCompletedCount} jobs</span>
                    <span>• 2.4 km away</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/app/request?providerId=${pro.id}`}
                className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow shrink-0"
              >
                Request
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Requests Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Recent Requests</h3>
          <Link to="/app/requests" className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline">
            View All History
          </Link>
        </div>

        <div className="space-y-3">
          {MOCK_REQUESTS.map((req) => (
            <div key={req.id} className="glass-card p-4 rounded-2xl flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{req.categoryName}</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {req.requestCode}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{req.problemDescription}</p>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                  Rs. {req.finalPrice?.toLocaleString()} • {req.createdAt.split('T')[0]}
                </div>
              </div>

              <Link
                to={`/app/requests/${req.id}`}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors shrink-0"
              >
                Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
