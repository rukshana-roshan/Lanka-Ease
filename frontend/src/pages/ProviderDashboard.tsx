import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_REQUESTS } from '../services/api';
import {
  Star,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export const ProviderDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);

  return (
    <div className="space-y-6 pb-24 pt-4">
      {/* Header & Availability Switch */}
      <div className="bg-gradient-to-r from-slate-900 to-brand-950 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-brand-400 font-bold uppercase tracking-wider">Provider Hub</span>
          <h1 className="text-2xl font-bold mt-0.5">{user?.fullName || 'Kasun Fernando'}</h1>
          <p className="text-xs text-slate-300 mt-1">Kasun Electrical Solutions • Certified Electrician</p>
        </div>

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
    </div>
  );
};
