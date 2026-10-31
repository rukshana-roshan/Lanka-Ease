import { PageIntro } from '../components/PageIntro';
import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, MapPin, Award, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="designed-page about-page space-y-12 pb-24 pt-4">
      {/* Hero Section */}
      <PageIntro eyebrow="ROOTED IN SRI LANKA" title="Good people. Happier homes." description="We bring everyday household needs and local skills together, making it easier to care for your home and the people in it." image="/images/ease-home-v2.png" />

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center border border-slate-800">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Our Mission</h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            To provide Sri Lanka’s most trusted, accessible, and transparent digital platform for everyday home services, empowering technicians with dignity while giving families complete peace of mind.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center border border-slate-800">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Quality & Safety First</h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Every professional on LankaEase undergoes strict identity verification, skills assessment, and background screening. Over 98% of jobs receive 4.5+ star customer ratings.
          </p>
        </div>
      </div>

      {/* Coverage Cities Grid */}
      <div className="bg-slate-900 text-white p-8 md:p-12 rounded-3xl border border-slate-800 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Islandwide Coverage</h2>
          <p className="text-xs text-slate-400">Serving major districts and towns across Sri Lanka</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {['Colombo & Suburbs', 'Kandy & Peradeniya', 'Galle & Matara', 'Gampaha & Negombo', 'Kurunegala', 'Kalutara & Panadura', 'Jaffna & North', 'Batticaloa & East'].map((city, idx) => (
            <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
              <MapPin className="w-5 h-5 mx-auto text-emerald-400" />
              <span className="text-xs font-bold text-slate-200 block">{city}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4 pt-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Ready to experience effortless service?</h3>
        <Link
          to="/providers"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-black text-white font-bold text-sm rounded-full shadow-lg transition-transform hover:scale-105"
        >
          <span>Explore Verified Professionals</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
