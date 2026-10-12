import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Wrench,
  Home as HomeIcon,
  HeartHandshake,
  Sun,
  Moon,
  ChevronRight,
  LogIn,
  UserPlus,
  LogOut,
  Lock,
  Clock,
  MapPin,
  Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { Logo } from '../components/Logo';

export const WelcomeLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [isEntering, setIsEntering] = useState(false);

  // Trigger entering the main website (when authenticated)
  const handleEnterWebsite = (path: string = '/home') => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(path)}`);
      return;
    }
    if (isEntering) return;
    setIsEntering(true);

    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#10b981', '#14b8a6', '#06b6d4', '#f59e0b', '#ffffff'],
        disableForReducedMotion: true,
      });
    } catch {
      // Graceful fallback if confetti fails
    }

    // Smooth navigation delay for visual polish
    setTimeout(() => {
      navigate(path);
    }, 450);
  };

  // Keyboard shortcut: Press Enter to open main website (if auth) or open login (if not auth)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (isAuthenticated) {
          handleEnterWebsite('/home');
        } else {
          navigate('/login');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated]);

  const coreServices = [
    {
      icon: <Zap className="w-6 h-6 text-emerald-400" />,
      title: 'Electrical & Repairs',
      desc: 'Certified wiring, power installations & appliance servicing',
      badge: '24/7 Rapid Callout',
      color: 'from-emerald-500/20 to-emerald-950/40',
      border: 'border-emerald-500/30 hover:border-emerald-400',
    },
    {
      icon: <Wrench className="w-6 h-6 text-teal-400" />,
      title: 'Plumbing Solutions',
      desc: 'Pipe fittings, urgent leak stoppage & bathroom maintenance',
      badge: 'Master Plumbers',
      color: 'from-teal-500/20 to-teal-950/40',
      border: 'border-teal-500/30 hover:border-teal-400',
    },
    {
      icon: <HomeIcon className="w-6 h-6 text-cyan-400" />,
      title: 'Home & Office Care',
      desc: 'Deep cleaning, sanitisation, pest control & housekeeping',
      badge: 'Hospital-Grade Clean',
      color: 'from-cyan-500/20 to-cyan-950/40',
      border: 'border-cyan-500/30 hover:border-cyan-400',
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-amber-400" />,
      title: 'Family Assistance',
      desc: 'Care & household management for parents living in Sri Lanka',
      badge: 'Overseas-Friendly',
      color: 'from-amber-500/20 to-amber-950/40',
      border: 'border-amber-500/30 hover:border-amber-400',
    },
  ];

  const highlights = [
    { icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />, text: '100% Background-Checked' },
    { icon: <Clock className="w-4 h-4 text-teal-400" />, text: '< 30 Min Response' },
    { icon: <Star className="w-4 h-4 text-amber-400" />, text: '4.9★ Average Rating' },
    { icon: <MapPin className="w-4 h-4 text-cyan-400" />, text: 'Islandwide (25 Districts)' },
  ];

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-emerald-500 selection:text-white font-sans">
      {/* 1. Cinematic Background Layer with Ambient Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* High-Resolution Architectural & Home Photography with Subtle Blur & Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 scale-105 transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=85&w=2400')`,
          }}
        />

        {/* Deep Slate Gradient Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/85 to-slate-950" />

        {/* Glowing Luminous Orbs */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-1/3 -right-32 w-[550px] h-[550px] bg-teal-500/20 rounded-full blur-[130px]" />
        <div className="absolute -bottom-40 left-1/3 w-[700px] h-[700px] bg-cyan-600/15 rounded-full blur-[160px]" />
        <div className="absolute top-2/3 right-1/4 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[120px]" />

        {/* Subtle Isometric Blueprint Grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* 2. Top Modern Header Bar */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => {
            if (isAuthenticated) navigate('/home');
          }}
          className="cursor-pointer group flex items-center transition-transform hover:scale-[1.02]"
        >
          <Logo size="lg" showTagline={true} clickable={false} />
        </div>

        {/* Center Islandwide Live Pulse (Desktop) */}
        <div className="hidden lg:flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-emerald-500/30 backdrop-blur-md shadow-inner text-xs font-medium text-slate-300">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-emerald-400 font-bold">Live Network:</span>
          <span>Active in Colombo, Kandy, Galle & Islandwide</span>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Language Switcher */}
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 text-slate-300 hover:text-white rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 backdrop-blur-md shadow-sm transition-all hover:scale-105"
            title="Toggle theme mode"
            aria-label="Toggle theme mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          {/* Authentication Actions in Header */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEnterWebsite('/home')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <span>Go to Home</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => logout()}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-xs font-semibold text-slate-400 hover:text-red-400 bg-slate-900/80 border border-slate-800 hover:border-red-900 transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/70 backdrop-blur-md transition-all hover:border-slate-500"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sign In</span>
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full text-xs font-bold shadow-md shadow-emerald-600/30 transition-all hover:scale-105"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* 3. Main Hero Stage */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 flex flex-col justify-center items-center text-center">
        {/* Welcome Announcement Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-cyan-500/15 border border-emerald-500/30 backdrop-blur-md mb-6 shadow-lg shadow-emerald-950/40"
        >
          <Sparkles className="w-4 h-4 text-emerald-400 animate-spin-slow" />
          <span className="text-xs sm:text-sm font-bold tracking-wide uppercase bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
            Sri Lanka's Premier On-Demand Service Platform
          </span>
        </motion.div>

        {/* Main Website Welcoming Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          className="max-w-4xl space-y-3 sm:space-y-4 mb-6"
        >
          <h2 className="text-base sm:text-lg md:text-xl font-medium tracking-widest uppercase text-slate-400">
            Welcome to
          </h2>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.08] text-white">
            Lanka<span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">Ease</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-200 max-w-2xl mx-auto">
            Everyday Help, Made Seamless Across Sri Lanka.
          </p>
        </motion.div>

        {/* Short, Engaging Website Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="text-sm sm:text-base md:text-lg text-slate-300/90 max-w-2xl mx-auto leading-relaxed mb-10 font-normal"
        >
          Instantly connect with verified electricians, master plumbers, professional cleaners, and compassionate elderly family caregivers. Fast, secure, and delivered with trust right to your doorstep.
        </motion.p>

        {/* 4. PRIMARY ACCESS ACTION (Register or Sign In Required - "Enter Website" button removed) */}
        {!isAuthenticated ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="flex flex-col items-center gap-4 w-full max-w-xl mb-12 sm:mb-14"
          >
            {/* Access Restriction Notice */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-inner">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Register or Sign In Required to Access the LankaEase Website</span>
            </div>

            {/* Prominent Sign In and Register Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full max-w-lg">
              {/* Sign In Primary Action */}
              <div className="relative group flex-1">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse" />
                <button
                  onClick={() => navigate('/login')}
                  className="relative w-full px-8 py-4 sm:py-4.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-600 active:scale-95 text-white font-black text-base sm:text-lg rounded-full shadow-2xl flex items-center justify-center gap-3 transition-all duration-300 border border-emerald-400/40 cursor-pointer overflow-hidden btn-hover-shine"
                  aria-label="Sign In to access LankaEase"
                >
                  <LogIn className="w-5 h-5 text-emerald-200" />
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Register Action */}
              <div className="relative flex-1">
                <button
                  onClick={() => navigate('/register')}
                  className="relative w-full px-8 py-4 sm:py-4.5 bg-slate-900/90 hover:bg-slate-800 text-slate-100 hover:text-white font-bold text-base sm:text-lg rounded-full shadow-xl flex items-center justify-center gap-3 transition-all duration-300 border border-slate-700 hover:border-emerald-500/60 cursor-pointer active:scale-95 backdrop-blur-xl"
                  aria-label="Register a new account"
                >
                  <UserPlus className="w-5 h-5 text-emerald-400" />
                  <span>Register</span>
                </button>
              </div>
            </div>

            {/* Hint Notice */}
            <p className="text-xs text-slate-400 font-medium max-w-md">
              Please register or sign in to explore verified professionals, request services, and manage your bookings.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="flex flex-col items-center gap-4 w-full max-w-lg mb-12 sm:mb-14"
          >
            {/* Authenticated User Status */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Signed in as <strong className="text-white">{user?.fullName}</strong> ({user?.role})</span>
            </div>

            {/* Direct Access Buttons for Authenticated User */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full">
              <div className="relative group flex-1">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse" />
                <button
                  onClick={() => handleEnterWebsite('/home')}
                  disabled={isEntering}
                  className="relative w-full px-8 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-600 active:scale-95 text-white font-black text-base sm:text-lg rounded-full shadow-2xl flex items-center justify-center gap-3 transition-all duration-300 border border-emerald-400/40 cursor-pointer overflow-hidden btn-hover-shine"
                >
                  <span>Go to Website</span>
                  <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                  {isEntering && (
                    <span className="absolute inset-0 bg-emerald-500/30 flex items-center justify-center backdrop-blur-xs">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </span>
                  )}
                </button>
              </div>

              <button
                onClick={() => logout()}
                className="px-6 py-4 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-red-400 font-semibold text-sm rounded-full border border-slate-700 hover:border-red-900/60 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* 5. Interactive Core Service Previews (Quick Jump Cards) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="w-full"
        >
          <div className="text-center mb-4">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400/80">
              Popular Services Available on LankaEase
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 max-w-5xl mx-auto">
            {coreServices.map((service, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (isAuthenticated) {
                    handleEnterWebsite('/services');
                  } else {
                    navigate('/login?redirect=%2Fservices');
                  }
                }}
                className={`relative text-left p-4 sm:p-5 rounded-2xl bg-gradient-to-b ${service.color} bg-slate-900/80 backdrop-blur-xl border ${service.border} transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-950/40 cursor-pointer group`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/10 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/5">
                    {service.badge}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors mb-1">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-400 leading-snug line-clamp-2">
                  {service.desc}
                </p>

                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-semibold text-emerald-400 group-hover:text-emerald-300">
                  <span>{isAuthenticated ? 'Explore service' : 'Sign in to access'}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 6. Key Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.55 }}
          className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-400"
        >
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 backdrop-blur-md"
            >
              {item.icon}
              <span className="font-medium text-slate-300">{item.text}</span>
            </div>
          ))}
        </motion.div>
      </main>

      {/* 7. Bottom Elegant Footer Bar */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div>
          © {new Date().getFullYear()} <span className="font-bold text-slate-300">LankaEase</span>. Built with pride for Sri Lanka.
        </div>

        <div className="flex items-center gap-5 font-medium">
          <Link to="/about" className="hover:text-emerald-400 transition-colors">
            About
          </Link>
          <Link to="/services" className="hover:text-emerald-400 transition-colors">
            Services
          </Link>
          <Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">
            How It Works
          </Link>
          <Link to="/contact" className="hover:text-emerald-400 transition-colors">
            Contact
          </Link>
          {isAuthenticated ? (
            <button
              onClick={() => handleEnterWebsite('/home')}
              className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Go to Home</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
                Sign In
              </Link>
              <span className="text-slate-600">•</span>
              <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
                Register
              </Link>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default WelcomeLandingPage;
