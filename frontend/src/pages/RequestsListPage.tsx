import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_REQUESTS } from '../services/api';
import { ChevronRight } from 'lucide-react';

export const RequestsListPage: React.FC = () => {
  const [tab, setTab] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');

  const filtered = MOCK_REQUESTS.filter((req) => {
    if (tab === 'ACTIVE') return req.status === 'ACCEPTED' || req.status === 'ON_THE_WAY' || req.status === 'WORKING';
    if (tab === 'COMPLETED') return req.status === 'COMPLETED' || req.status === 'REVIEWED';
    return true;
  });

  return (
    <div className="space-y-6 pb-24 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Service Requests</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Track your request status and service history</p>
        </div>
        <Link
          to="/app/request"
          className="px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl shadow"
        >
          + New Request
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
        {(['ALL', 'ACTIVE', 'COMPLETED'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              tab === t ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow' : 'text-slate-500'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((req) => (
          <div key={req.id} className="glass-card p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{req.categoryName}</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {req.requestCode}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  {req.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">{req.problemDescription}</p>
              <div className="text-[11px] text-slate-400 mt-2 flex flex-wrap gap-4">
                <span>📍 {req.address}</span>
                <span>📅 {req.preferredDate} ({req.preferredTime})</span>
                <span>Urgency: {req.urgency}</span>
              </div>
            </div>

            <Link
              to={`/app/requests/${req.id}`}
              className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow flex items-center justify-center gap-1 shrink-0"
            >
              <span>Track & Details</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
