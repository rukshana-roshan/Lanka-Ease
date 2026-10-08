import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { SafeImage } from '../components/SafeImage';
import { Wrench, User, Briefcase, CheckCircle, Camera, Upload } from 'lucide-react';
import type { Role } from '../types';

export const RegisterPage: React.FC = () => {
  const { login, demoLogin, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [roleTab, setRoleTab] = useState<Role>('CUSTOMER');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [profileImage, setProfileImage] = useState(
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProfileImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let res = null;
    if (roleTab === 'PROVIDER') {
      res = await api.registerProvider({ fullName, email, password, phone, businessName });
    } else {
      res = await api.registerCustomer({ fullName, email, password, phone });
    }

    if (res && res.token && res.user) {
      login(res.token, res.user);
      updateUser({ profileImage });
      if (roleTab === 'PROVIDER') navigate('/provider');
      else navigate('/app');
    } else {
      demoLogin(roleTab);
      updateUser({
        fullName: fullName || (roleTab === 'PROVIDER' ? 'Kasun Fernando' : 'Kamal Perera'),
        email: email || (roleTab === 'PROVIDER' ? 'kasun@lankaease.lk' : 'customer@lankaease.lk'),
        phone: phone || '+94772345678',
        profileImage,
      });
      if (roleTab === 'PROVIDER') navigate('/provider');
      else navigate('/app');
    }
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
          {/* User Profile Picture Picker */}
          <div className="flex flex-col items-center justify-center space-y-2 pb-2">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <SafeImage
                src={profileImage}
                alt="Profile Preview"
                className="w-20 h-20 rounded-full object-cover border-3 border-emerald-500 shadow-md"
              />
              <div className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 text-white rounded-full border-2 border-white dark:border-slate-900">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <Upload className="w-3 h-3" /> Add User Picture
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

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
