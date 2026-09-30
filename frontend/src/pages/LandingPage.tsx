import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { PromoBanner } from '../components/PromoBanner';
import { ServiceCarousel } from '../components/ServiceCarousel';
import { AISmartHelp } from '../components/AISmartHelp';
import { HowItWorks } from '../components/HowItWorks';
import { ProviderCarousel } from '../components/ProviderCarousel';
import { LiveTrackingSection } from '../components/LiveTrackingSection';
import { FamilyAssistanceSection } from '../components/FamilyAssistanceSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { AppDownloadSection } from '../components/AppDownloadSection';
import { SafeImage } from '../components/SafeImage';

export const LandingPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col overflow-x-hidden selection:bg-brand-500 selection:text-white">
      {/* Landing Page Ambient Background Image Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.08] dark:opacity-[0.18]">
        <SafeImage
          src="https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&q=80&w=1920"
          fallbackSrc="https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&q=80&w=1920"
          alt="Landing Page Background Texture"
          className="w-full h-full object-cover filter brightness-110 contrast-125 saturate-120"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/90 via-transparent to-slate-50/95 dark:from-slate-950/95 dark:via-slate-950/80 dark:to-slate-950" />
      </div>

      {/* Main Landing Content */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* 1. HERO SECTION (With Visual Background Worker & Floating Search Panel) */}
        <HeroSection />

        {/* 2. LANKAEASE PROMO BANNER SHOWCASE */}
        <PromoBanner />

        {/* 3. POPULAR SERVICES (Horizontal Carousel with Realistic Photographic Images) */}
        <ServiceCarousel />

        {/* 3. AI SMART HELP (Interactive AI Assistant Flow Matching Visual Mockup) */}
        <AISmartHelp />

        {/* 4. HOW IT WORKS (Clean 5-Step Process) */}
        <HowItWorks />

        {/* 5. TRUSTED PROFESSIONALS (Horizontal Provider Carousel) */}
        <ProviderCarousel />

        {/* 6. LIVE SERVICE TRACKING (Ride/Service Map Graphic & Status Timeline) */}
        <LiveTrackingSection />

        {/* 7. FAMILY ASSISTANCE (Request for Parents & Relatives) */}
        <FamilyAssistanceSection />

        {/* 8. CUSTOMER TESTIMONIALS (Real Sri Lankan Customer Reviews) */}
        <TestimonialsSection />

        {/* 9. MOBILE APP DOWNLOAD BANNER */}
        <AppDownloadSection />
      </div>
    </div>
  );
};

export default LandingPage;
