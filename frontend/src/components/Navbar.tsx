import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import {
  Wrench,
  Sun,
  Moon,
  User as UserIcon,
  ShieldAlert,
  Users,
  Briefcase,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import type { Role } from '../types';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, demoLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const handleRoleSwitch = (role: Role) => {
    demoLogin(role);
    setShowRoleMenu(false);
    if (role === 'ADMIN') navigate('/admin');
    else if (role === 'PROVIDER') navigate('/provider');
    else navigate('/app');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-800 dark:text-slate-100 border-b border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        {/* Brand Logo matching image design */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <Wrench className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                LankaEase
              </span>
            </div>
            <span className="hidden sm:block text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide -mt-0.5">
              Everyday help, made easier.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold">
          <Link
            to="/"
            className={`transition-colors ${
              isActive('/')
                ? 'text-emerald-600 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 dark:border-emerald-400 pb-0.5'
                : 'text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            Home
          </Link>
          <Link
            to="/services"
            className={`transition-colors ${
              isActive('/services')
                ? 'text-emerald-600 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 dark:border-emerald-400 pb-0.5'
                : 'text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            Services
          </Link>
          <Link
            to="/providers"
            className={`transition-colors ${
              isActive('/providers')
                ? 'text-emerald-600 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 dark:border-emerald-400 pb-0.5'
                : 'text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            Providers
          </Link>
          <Link
            to="/how-it-works"
            className={`transition-colors ${
              isActive('/how-it-works')
                ? 'text-emerald-600 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 dark:border-emerald-400 pb-0.5'
                : 'text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            How It Works
          </Link>
          <Link
            to="/about"
            className={`transition-colors ${
              isActive('/about')
                ? 'text-emerald-600 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 dark:border-emerald-400 pb-0.5'
                : 'text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`transition-colors ${
              isActive('/contact')
                ? 'text-emerald-600 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 dark:border-emerald-400 pb-0.5'
                : 'text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Quick Demo Role Switcher Badge */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="px-3 py-1.5 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">{user?.role || 'Demo Role'}</span>
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 z-50 text-slate-800 dark:text-white">
                <div className="text-[10px] uppercase font-bold text-slate-400 px-2.5 py-1">Switch Persona</div>
                <button
                  onClick={() => handleRoleSwitch('CUSTOMER')}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center gap-2"
                >
                  <UserIcon className="w-3.5 h-3.5 text-emerald-600" /> Customer (Kamal)
                </button>
                <button
                  onClick={() => handleRoleSwitch('PROVIDER')}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center gap-2"
                >
                  <Briefcase className="w-3.5 h-3.5 text-amber-500" /> Provider (Kasun)
                </button>
                <button
                  onClick={() => handleRoleSwitch('ADMIN')}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center gap-2"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-purple-500" /> System Admin
                </button>
              </div>
            )}
          </div>

          {/* User Auth Buttons - Matching design screenshot */}
          {isAuthenticated ? (
            <Link
              to={user?.role === 'ADMIN' ? '/admin' : user?.role === 'PROVIDER' ? '/provider' : '/app'}
              className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow"
            >
              {user?.fullName?.charAt(0) || 'U'}
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-2 text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs md:text-sm font-bold rounded-full shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-3 shadow-2xl text-slate-900 dark:text-white">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2.5 text-sm font-bold border-b border-slate-100 dark:border-slate-800"
          >
            <span>Home</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2.5 text-sm font-bold border-b border-slate-100 dark:border-slate-800"
          >
            <span>Services</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
          <Link
            to="/providers"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2.5 text-sm font-bold border-b border-slate-100 dark:border-slate-800"
          >
            <span>Providers</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2.5 text-sm font-bold border-b border-slate-100 dark:border-slate-800"
          >
            <span>How It Works</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2.5 text-sm font-bold border-b border-slate-100 dark:border-slate-800"
          >
            <span>About</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2.5 text-sm font-bold"
          >
            <span>Contact</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>

          <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
};
