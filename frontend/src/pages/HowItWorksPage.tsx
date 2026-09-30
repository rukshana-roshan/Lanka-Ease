import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ArrowRight, MessageSquare } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="space-y-12 pb-24 pt-4">
      {/* Hero Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-14 text-center space-y-4 border border-slate-800 shadow-xl">
        <span className="px-3.5 py-1.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
          SIMPLE & TRANSPARENT PROCESS
        </span>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight">
          How LankaEase Works
        </h1>
        <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Connecting everyday Sri Lankan households with verified local service professionals in just 4 easy steps.
        </p>
      </div>

      {/* 4 Step Process Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-sm relative">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center font-black text-xl border border-slate-800">
            01
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Describe Your Need</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Enter your issue or select a service category (Electrical, Plumbing, AC Repair, Tutors, Cleaning & more). AI recommends the perfect expert.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-sm relative">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center font-black text-xl border border-slate-800">
            02
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Choose Verified Pro</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Browse profile pictures, verified badges, past job ratings, price estimates, and coverage cities before booking.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-sm relative">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center font-black text-xl border border-slate-800">
            03
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Real-Time Tracking</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Track your technician arrival on an interactive map. Receive direct chat and SMS updates for elderly family members.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-sm relative">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center font-black text-xl border border-slate-800">
            04
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pay Securely & Rate</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Pay safely via Cash on Completion or Digital Cards. Download official PDF invoices and leave a rating for the provider.
          </p>
        </div>
      </div>

      {/* Safety Guarantees */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 border border-slate-800 space-y-6">
        <h2 className="text-2xl font-extrabold text-center">Why Sri Lankans Trust LankaEase</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-7 h-7 text-emerald-400 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-sm">Police & NIC Verification</h4>
              <p className="text-xs text-slate-400 mt-1">Every professional submits National Identity Card, address proof, and police clearance before listing.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-sm">Transparent Pricing</h4>
              <p className="text-xs text-slate-400 mt-1">Clear upfront pricing ranges without hidden charges or surprise call-out fees.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MessageSquare className="w-7 h-7 text-emerald-400 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-sm">Trilingual Support</h4>
              <p className="text-xs text-slate-400 mt-1">Support available in English, Sinhala, and Tamil to ensure effortless communication.</p>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <RouterLink
            to="/services"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm rounded-full shadow-lg transition-transform hover:scale-105"
          >
            <span>Browse Services Now</span>
            <ArrowRight className="w-4 h-4" />
          </RouterLink>
        </div>
      </div>
    </div>
  );
};
