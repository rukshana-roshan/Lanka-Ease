import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_CATEGORIES, MOCK_PROVIDERS } from '../services/api';
import { Search, Zap, Droplet, Hammer, Sparkles, Tv, Wrench, Car, Laptop, Smartphone, Package, Truck, Printer, FileText, GraduationCap, Home, Trees, Paintbrush, MoreHorizontal, ArrowRight, ShieldCheck } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Zap, Droplet, Hammer, Sparkles, Tv, Wrench, Car, Laptop, Smartphone, Package, Truck, Printer, FileText, GraduationCap, Home, Trees, Paintbrush, MoreHorizontal
};

export const ServicesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = MOCK_CATEGORIES.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20 pt-4">
      {/* Page Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden border border-slate-800 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
            ALL SERVICE CATEGORIES
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">
            Find Experts for Every Everyday Need
          </h1>
          <p className="text-sm md:text-base text-slate-300">
            Over 200+ verified Sri Lankan professionals across 18 specialized service categories. All categories have more than 10 active technicians ready to help.
          </p>

          {/* Search Box */}
          <div className="pt-4 relative max-w-md">
            <Search className="w-5 h-5 absolute left-3.5 top-7 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search service category (e.g. Electrical, Plumbing, Tutor)..."
              className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => {
          const IconComp = ICON_MAP[cat.iconName] || Wrench;
          const count = MOCK_PROVIDERS.filter((p) => p.categories.some((c) => c.id === cat.id)).length;

          return (
            <div
              key={cat.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-slate-800 text-emerald-400 border border-slate-800 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <IconComp className="w-7 h-7" />
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-full border border-emerald-200 dark:border-emerald-800">
                    {count}+ Pros
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {cat.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>100% Background Verified</span>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  to={`/providers?categoryId=${cat.id}`}
                  className="w-full py-3 bg-slate-900 hover:bg-black text-white dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow transition-colors"
                >
                  <span>View Professionals ({count})</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
