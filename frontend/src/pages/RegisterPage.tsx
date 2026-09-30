import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, User, Briefcase, CheckCircle } from 'lucide-react';
import type { Role } from '../types';

export const RegisterPage: React.FC = () => {
  const { demoLogin } = useAuth();
  const navigate = useNavigate();
  const [roleTab, setRoleTab] = useState<Role>('CUSTOMER');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    demoLogin(roleTab);
    if (roleTab === 'PROVIDER') navigate('/provider');
    else navigate('/app');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <div className="max-w-lg w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg border border-slate-800 mb-3">
            <Wrench className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Create LankaEase Account</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Join Sri Lanka's smart services network</p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl mb-6 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setRoleTab('CUSTOMER')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
              roleTab === 'CUSTOMER'
                ? 'bg-slate-900 text-white shadow'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <User className="w-4 h-4 text-emerald-400" /> Customer
          </button>
          <button
            type="button"
            onClick={() => setRoleTab('PROVIDER')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
              roleTab === 'PROVIDER'
                ? 'bg-slate-900 text-white shadow'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Briefcase className="w-4 h-4 text-amber-400" /> Service Provider
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Kasun Fernando"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {roleTab === 'PROVIDER' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Business Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Kasun Electrical Solutions"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone (+94)</label>
              <input
                type="tel"
                required
                placeholder="+94771234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-bold text-sm rounded-xl shadow-lg border border-slate-700 flex items-center justify-center gap-2 transition-all mt-6"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Register as {roleTab === 'PROVIDER' ? 'Provider' : 'Customer'}</span>
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-slate-900 dark:text-white hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
