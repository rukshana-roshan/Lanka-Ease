import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Share2, MessageSquare, Globe2, PhoneCall, ShieldCheck, CreditCard, Navigation, Smartphone, ArrowRight, Sparkles } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-slate-950 text-slate-400 text-xs border-t border-slate-900/90 overflow-hidden">
      {/* Ambient Emerald & Teal Background Glows - Pure CSS, No Images */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Footer Contents */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Feature Visual Banner Card - Sleek Gradient Container (No Images) */}
        <div className="mb-12 relative rounded-2xl md:rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/60 p-6 md:p-8 shadow-2xl overflow-hidden group">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sri Lanka's Premier Service Platform</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Ready to solve your household service needs?
              </h3>
              <p className="text-slate-300 text-xs md:text-sm max-w-xl font-normal">
                Join thousands of satisfied customers across Colombo, Kandy, Galle and beyond. Verified local professionals at your fingertips.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/register"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs md:text-sm rounded-full shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all hover:scale-105"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-10">
          {/* Column 1: Brand Info */}
          <div className="col-span-2 space-y-3 pr-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-transform">
                <Wrench className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xl font-black text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                LankaEase
              </span>
            </Link>
            <p className="text-slate-400 text-[11px] leading-relaxed max-w-xs font-medium">
              Everyday help, made easier. Connecting Sri Lankan households with trusted, verified local professionals.
            </p>

            <div className="flex items-center gap-2 pt-2 text-slate-400">
              <Link to="/contact" className="p-2 rounded-full bg-slate-900/80 hover:bg-emerald-600 hover:text-white border border-slate-800 transition-colors" title="Facebook">
                <Share2 className="w-3.5 h-3.5" />
              </Link>
              <Link to="/contact" className="p-2 rounded-full bg-slate-900/80 hover:bg-emerald-600 hover:text-white border border-slate-800 transition-colors" title="Instagram">
                <MessageSquare className="w-3.5 h-3.5" />
              </Link>
              <Link to="/about" className="p-2 rounded-full bg-slate-900/80 hover:bg-emerald-600 hover:text-white border border-slate-800 transition-colors" title="LinkedIn">
                <Globe2 className="w-3.5 h-3.5" />
              </Link>
              <Link to="/contact" className="p-2 rounded-full bg-slate-900/80 hover:bg-emerald-600 hover:text-white border border-slate-800 transition-colors" title="Contact">
                <PhoneCall className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-200">Services</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link to="/services" className="hover:text-emerald-400 transition-colors">Electrical</Link></li>
              <li><Link to="/services" className="hover:text-emerald-400 transition-colors">Plumbing</Link></li>
              <li><Link to="/services" className="hover:text-emerald-400 transition-colors">Cleaning</Link></li>
              <li><Link to="/services" className="hover:text-emerald-400 transition-colors">Repairs</Link></li>
              <li><Link to="/services" className="hover:text-emerald-400 font-semibold transition-colors">All Services →</Link></li>
            </ul>
          </div>

          {/* Column 3: For Customers */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-200">For Customers</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</Link></li>
              <li><Link to="/providers" className="hover:text-emerald-400 transition-colors">Track Request</Link></li>
              <li><Link to="/app/invoices" className="hover:text-emerald-400 transition-colors font-medium">Payments</Link></li>
              <li><Link to="/app/family" className="hover:text-emerald-400 transition-colors">Family Assistance</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Column 4: For Providers */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-200">For Providers</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link to="/provider" className="hover:text-emerald-400 transition-colors">Become a Provider</Link></li>
              <li><Link to="/provider" className="hover:text-emerald-400 transition-colors">Earnings</Link></li>
              <li><Link to="/provider" className="hover:text-emerald-400 transition-colors">Resources</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* Column 5: Company & Legal */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-200">Company</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">Careers</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* LankaEase Value Badges Bar */}
        <div className="py-4 px-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-300 mb-8">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Trusted Providers</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <CreditCard className="w-4 h-4" />
            <span>Secure Payments</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <Navigation className="w-4 h-4" />
            <span>Real-time Tracking</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <Globe2 className="w-4 h-4" />
            <span>Multi-language</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <Smartphone className="w-4 h-4" />
            <span>PWA Ready</span>
          </div>
        </div>

        {/* Bottom copyright & language bar */}
        <div className="pt-6 border-t border-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[10px]">
          <div>
            © {new Date().getFullYear()} LankaEase. All rights reserved. Built for Sri Lanka.
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <span className="text-slate-700">|</span>
            <span className="font-medium text-slate-300">Everyday help, made easier.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
