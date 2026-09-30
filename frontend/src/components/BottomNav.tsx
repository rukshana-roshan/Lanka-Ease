import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, PlusCircle, MessageSquare, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const BottomNav: React.FC = () => {
  const { user } = useAuth();
  const basePath = user?.role === 'PROVIDER' ? '/provider' : user?.role === 'ADMIN' ? '/admin' : '/app';

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        <NavLink
          to={basePath}
          end
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
              isActive ? 'text-brand-600 dark:text-brand-400 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </NavLink>

        <NavLink
          to={`${basePath}/explore`}
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
              isActive ? 'text-brand-600 dark:text-brand-400 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`
          }
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Explore</span>
        </NavLink>

        {/* Emphasized Center Request Button */}
        <NavLink
          to="/app/request"
          className="flex flex-col items-center -mt-6 group"
        >
          <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-brand-700 to-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/40 group-hover:scale-105 transition-transform border-4 border-slate-50 dark:border-slate-950 p-3">
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-brand-700 dark:text-brand-400 mt-0.5">Request</span>
        </NavLink>

        <NavLink
          to={`${basePath}/messages`}
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
              isActive ? 'text-brand-600 dark:text-brand-400 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`
          }
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Messages</span>
        </NavLink>

        <NavLink
          to={`${basePath}/profile`}
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
              isActive ? 'text-brand-600 dark:text-brand-400 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`
          }
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Profile</span>
        </NavLink>
      </div>
    </nav>
  );
};
