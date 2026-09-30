import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Share2, MessageSquare, Globe2, PhoneCall, ShieldCheck, CreditCard, Navigation, Smartphone } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SafeImage } from './SafeImage';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-slate-950 text-slate-400 text-xs border-t border-slate-900/90 overflow-hidden">
      {/* Background Image Layer - High quality Sri Lanka atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-25 transition-opacity duration-700">
        <SafeImage
          src="/images/footer-bg.jpg"
          fallbackSrc="https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&q=80&w=1920"
          alt="Sri Lanka Colombo Skyline & Lotus Tower Background"
          className="w-full h-full object-cover object-center filter brightness-90 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-emerald-950/40" />
      </div>

      {/* Ambient Emerald Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Footer Contents */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Feature Visual Banner Card - Full Width LankaEase Footer Banner */}
        <div className="mb-12 relative rounded-2xl md:rounded-3xl overflow-hidden border border-emerald-500/30 bg-slate-900 shadow-2xl group transition-all">
          <div className="relative w-full">
            <SafeImage
              src="/images/lanka_ease_footer_banner.png"
              fallbackSrc="/images/footer-banner.png"
              alt="LankaEase - Your One Stop Solution for Trusted Local Services in Sri Lanka"
              className="w-full h-auto object-cover rounded-2xl md:rounded-3xl group-hover:scale-[1.01] transition-transform duration-500"
            />
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

        {/* LankaEase Value Badges Bar - Matching Design Overview Bottom Strip */}
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

        {/* Bottom copyright & language bar matching design */}
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

