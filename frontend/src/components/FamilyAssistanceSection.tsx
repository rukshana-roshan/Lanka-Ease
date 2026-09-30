import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight } from 'lucide-react';
import { SafeImage } from './SafeImage';

const FAMILY_MEMBERS_DEMO = [
  {
    id: 1,
    name: 'Mother',
    fullName: 'Kamala Perera',
    location: 'Kandy',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 2,
    name: 'Father',
    fullName: 'Sunil Perera',
    location: 'Kurunegala',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 3,
    name: 'Brother',
    fullName: 'Nalin Perera',
    location: 'Gampaha',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 4,
    name: 'Sister',
    fullName: 'Hiruni Perera',
    location: 'Galle',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  },
];

export const FamilyAssistanceSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 p-6 sm:p-10 lg:p-12 rounded-3xl md:rounded-[2.5rem] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Photo & Text Column */}
            <div className="lg:col-span-6 flex flex-col sm:flex-row items-center gap-6 text-left">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden shadow-md shrink-0 border-2 border-white dark:border-slate-800">
                <SafeImage
                  src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=400"
                  alt="Sri Lankan Family"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3">
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                  FAMILY ASSISTANCE
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                  Need help for your family?
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Request services for your loved ones, even if you're not there.
                </p>

                <div className="pt-1">
                  <Link
                    to="/app/family"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-full shadow-md shadow-emerald-600/30 transition-all hover:scale-105"
                  >
                    <span>Request for Family</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Interactive Family Cards Grid matching design screenshot */}
            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {FAMILY_MEMBERS_DEMO.map((member) => (
                  <Link
                    key={member.id}
                    to={`/app/request?familyMemberId=${member.id}`}
                    className="group bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all flex flex-col items-center text-center"
                  >
                    <SafeImage
                      src={member.image}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow mb-1.5 group-hover:scale-105 transition-transform"
                    />
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600">
                      {member.name}
                    </h4>
                  </Link>
                ))}

                {/* Add Member Card */}
                <Link
                  to="/app/family"
                  className="group bg-white/70 dark:bg-slate-900/70 p-3 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 transition-all flex flex-col items-center justify-center text-center min-h-[96px]"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 group-hover:text-emerald-600">
                    Add Member
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
