import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, Mail, Lock, User, Briefcase, ShieldAlert, ArrowRight } from 'lucide-react';
import type { Role } from '../types';

export const LoginPage: React.FC = () => {
  const { demoLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('customer@lankaease.lk');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    demoLogin('CUSTOMER');
    navigate('/app');
  };

  const handleDemoSelect = (role: Role) => {
    demoLogin(role);
    if (role === 'ADMIN') navigate('/admin');
    else if (role === 'PROVIDER') navigate('/provider');
    else navigate('/app');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg border border-slate-800 mb-3">
            <Wrench className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Welcome to LankaEase</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sign in to manage your services and requests</p>
        </div>

        {/* Quick Demo Login Preset Buttons */}
        <div className="mb-6 p-3.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-2">
            ⚡ Quick Demo Sign In
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoSelect('CUSTOMER')}
              className="py-2.5 px-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow flex flex-col items-center gap-1 transition-all"
            >
              <User className="w-4 h-4 text-emerald-400" />
              <span>Customer</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoSelect('PROVIDER')}
              className="py-2.5 px-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow flex flex-col items-center gap-1 transition-all"
            >
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Provider</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoSelect('ADMIN')}
              className="py-2.5 px-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow flex flex-col items-center gap-1 transition-all"
            >
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-bold text-sm rounded-xl shadow-lg border border-slate-700 flex items-center justify-center gap-2 transition-all mt-4"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-slate-900 dark:text-white hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};
