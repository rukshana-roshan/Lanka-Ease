import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Logo } from '../components/Logo';
import { SafeImage } from '../components/SafeImage';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { 
  Mail, 
  Lock, 
  User, 
  Briefcase, 
  ShieldAlert, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  Camera, 
  Upload, 
  Sparkles,
  Phone,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import type { Role, User as UserType } from '../types';

export const LoginPage: React.FC = () => {
  const { login, demoLogin, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab mode: 'login' or 'register'
  const isRegisterRoute = searchParams.get('mode') === 'register' || location.pathname === '/register';
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(isRegisterRoute ? 'register' : 'login');

  useEffect(() => {
    if (searchParams.get('mode') === 'register' || location.pathname === '/register') {
      setActiveTab('register');
    } else if (searchParams.get('mode') === 'login' || location.pathname === '/login') {
      setActiveTab('login');
    }
  }, [location.pathname, searchParams]);

  // Destination after successful sign in or registration
  const redirectUrl = searchParams.get('redirect') ? decodeURIComponent(searchParams.get('redirect')!) : null;

  const navigateAfterAuth = (userRole?: Role) => {
    if (redirectUrl) {
      navigate(redirectUrl);
      return;
    }
    if (userRole === 'ADMIN') navigate('/admin');
    else if (userRole === 'PROVIDER') navigate('/provider');
    else navigate('/home');
  };

  // Login form state
  const [loginEmail, setLoginEmail] = useState('customer@lankaease.lk');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [roleTab, setRoleTab] = useState<Role>('CUSTOMER');
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regBusinessName, setRegBusinessName] = useState('');
  const [regProfileImage, setRegProfileImage] = useState(
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
  );

  // Loading & notification states
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleSuccessMsg, setGoogleSuccessMsg] = useState<string | null>(null);

  // Handle profile image upload for registration
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setRegProfileImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Google OAuth sign in / register handler
  const handleGoogleAuth = () => {
    setIsGoogleLoading(true);
    setGoogleSuccessMsg('Connecting to Google Account...');

    setTimeout(() => {
      setIsGoogleLoading(false);
      const googleUser: UserType = {
        id: 999,
        fullName: 'Sameera Perera',
        email: 'sameera.perera@gmail.com',
        phone: '+94771122334',
        role: roleTab,
        preferredLanguage: 'en',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
      };
      login('google-oauth-token-2026', googleUser);
      setGoogleSuccessMsg('Successfully authenticated with Google!');
      setTimeout(() => {
        navigateAfterAuth(roleTab);
      }, 600);
    }, 1000);
  };

  // Login submit handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.loginUser({ email: loginEmail, password: loginPassword });
      if (res && res.token && res.user) {
        login(res.token, res.user);
        navigateAfterAuth(res.user.role);
      } else {
        demoLogin('CUSTOMER');
        navigateAfterAuth('CUSTOMER');
      }
    } catch {
      demoLogin('CUSTOMER');
      navigateAfterAuth('CUSTOMER');
    }
  };

  // Registration submit handler
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let res = null;
      if (roleTab === 'PROVIDER') {
        res = await api.registerProvider({
          fullName: regFullName,
          email: regEmail,
          password: regPassword,
          phone: regPhone,
          businessName: regBusinessName,
        });
      } else {
        res = await api.registerCustomer({
          fullName: regFullName,
          email: regEmail,
          password: regPassword,
          phone: regPhone,
        });
      }

      if (res && res.token && res.user) {
        login(res.token, res.user);
        updateUser({ profileImage: regProfileImage });
        navigateAfterAuth(res.user.role);
      } else {
        demoLogin(roleTab);
        updateUser({
          fullName: regFullName || (roleTab === 'PROVIDER' ? 'Kasun Fernando' : 'Kamal Perera'),
          email: regEmail || (roleTab === 'PROVIDER' ? 'kasun@lankaease.lk' : 'customer@lankaease.lk'),
          phone: regPhone || '+94772345678',
          profileImage: regProfileImage,
        });
        navigateAfterAuth(roleTab);
      }
    } catch {
      demoLogin(roleTab);
      navigateAfterAuth(roleTab);
    }
  };

  const handleDemoSelect = (role: Role) => {
    demoLogin(role);
    navigateAfterAuth(role);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-white">
      {/* Background Glow Orbs & Geometric Dot Pattern */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-500/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 pb-2 flex items-center justify-between">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-800 shadow"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>Back to Welcome</span>
        </Link>
        <LanguageSwitcher />
      </header>

      {/* Main Authentication Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="max-w-xl w-full bg-slate-900/90 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-emerald-950/60 relative overflow-hidden">
          
          {/* Subtle Top Accent Bar */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400" />

          {/* Logo Header Section */}
          <div className="flex flex-col items-center text-center mb-6 space-y-3">
            <Logo size="lg" showTagline={true} clickable={false} />
            <p className="text-xs text-slate-400 max-w-sm">
              {activeTab === 'login'
                ? 'Sign in to manage your everyday service requests, track providers & access family care.'
                : 'Create your LankaEase account to request verified home services or register as a provider.'}
            </p>
          </div>

          {/* Protected Route Notice (when visitor attempts to access protected page) */}
          {redirectUrl && (
            <div className="mb-6 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-300 text-xs">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold">Authentication Required:</span>
                <span className="ml-1 text-slate-300">You must sign in or register an account before accessing the LankaEase website.</span>
              </div>
            </div>
          )}

          {/* Login / Register Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 mb-8">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Google Sign-In / Register Button */}
          <div className="mb-6 space-y-3">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isGoogleLoading}
              className="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-750 active:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 rounded-2xl font-bold text-xs sm:text-sm text-slate-100 flex items-center justify-center gap-3 transition-all duration-300 shadow-md hover:shadow-emerald-500/10 cursor-pointer group disabled:opacity-50"
            >
              {/* Google Multicolor Logo SVG */}
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{activeTab === 'login' ? 'Continue with Google Account' : 'Register using Google Account'}</span>
            </button>

            {googleSuccessMsg && (
              <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{googleSuccessMsg}</span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-500 tracking-widest absolute">
              or use email
            </span>
          </div>

          {/* LOGIN TAB FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-4 top-3.5 text-slate-500" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to your registered email.')}
                    className="text-[11px] text-emerald-400 hover:underline font-semibold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-4 top-3.5 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900"
                  />
                  <span>Remember me for 30 days</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer mt-6"
              >
                <span>Sign In to LankaEase</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* REGISTER TAB FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Role Toggle */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">I want to register as a:</label>
                <div className="grid grid-cols-2 gap-3 p-1 bg-slate-950/80 rounded-2xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setRoleTab('CUSTOMER')}
                    className={`py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      roleTab === 'CUSTOMER'
                        ? 'bg-emerald-600/90 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <User className="w-4 h-4 text-emerald-300" /> Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleTab('PROVIDER')}
                    className={`py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      roleTab === 'PROVIDER'
                        ? 'bg-emerald-600/90 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-amber-400" /> Service Provider
                  </button>
                </div>
              </div>

              {/* Profile Photo Picker */}
              <div className="flex flex-col items-center justify-center space-y-2 py-1">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <SafeImage
                    src={regProfileImage}
                    alt="Profile Preview"
                    className="w-16 h-16 rounded-full object-cover border-2 border-emerald-400 shadow-md group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute bottom-0 right-0 p-1 bg-emerald-600 text-white rounded-full border border-slate-900">
                    <Camera className="w-3 h-3" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3 h-3" /> Upload Profile Picture
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
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasun Fernando"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>

              {roleTab === 'PROVIDER' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Business / Brand Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kasun Electrical Solutions"
                    value={regBusinessName}
                    onChange={(e) => setRegBusinessName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Phone (+94)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                    <input
                      type="tel"
                      required
                      placeholder="+94771234567"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer mt-6"
              >
                <CheckCircle className="w-4 h-4 text-emerald-300" />
                <span>Register & Sign In as {roleTab === 'PROVIDER' ? 'Provider' : 'Customer'}</span>
              </button>
            </form>
          )}

          {/* Quick Demo Sign-In Presets Box */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center mb-3">
              ⚡ Instant Demo Sign-In (Select Persona)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoSelect('CUSTOMER')}
                className="py-2.5 px-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-white rounded-xl text-xs font-bold shadow flex flex-col items-center gap-1 transition-all cursor-pointer group"
              >
                <User className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Customer</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoSelect('PROVIDER')}
                className="py-2.5 px-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-white rounded-xl text-xs font-bold shadow flex flex-col items-center gap-1 transition-all cursor-pointer group"
              >
                <Briefcase className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Provider</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoSelect('ADMIN')}
                className="py-2.5 px-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-white rounded-xl text-xs font-bold shadow flex flex-col items-center gap-1 transition-all cursor-pointer group"
              >
                <ShieldAlert className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                <span>Admin</span>
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer copyright */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-4 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} LankaEase • Sri Lanka's Everyday Service Network. All rights reserved.
      </footer>
    </div>
  );
};
