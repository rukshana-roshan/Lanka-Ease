import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { ProjectOverviewSection } from '../components/ProjectOverviewSection';
import { PromoBanner } from '../components/PromoBanner';
import { ServiceCarousel } from '../components/ServiceCarousel';
import { AISmartHelp } from '../components/AISmartHelp';
import { HowItWorks } from '../components/HowItWorks';
import { ProviderCarousel } from '../components/ProviderCarousel';
import { LiveTrackingSection } from '../components/LiveTrackingSection';
import { FamilyAssistanceSection } from '../components/FamilyAssistanceSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { AppDownloadSection } from '../components/AppDownloadSection';

export const LandingPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col overflow-x-hidden selection:bg-brand-500 selection:text-white">
      {/* Main Landing Content */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* 1. HERO SECTION (With Auto Scrolling HD Background & Floating Search Panel) */}
        <HeroSection />

        {/* 2. PROJECT OVERVIEW DIAGRAM (High Definition Architecture Image & Workflow) */}
        <div id="project-overview">
          <ProjectOverviewSection />
        </div>

        {/* 3. LANKAEASE PROMO BANNER SHOWCASE */}
        <PromoBanner />

        {/* 4. POPULAR SERVICES (Horizontal Carousel with Realistic Photographic Images) */}
        <ServiceCarousel />

        {/* 5. AI SMART HELP (Interactive AI Assistant Flow) */}
        <AISmartHelp />

        {/* 6. HOW IT WORKS (Clean Process Steps) */}
        <HowItWorks />

        {/* 7. TRUSTED PROFESSIONALS (Horizontal Provider Carousel) */}
        <ProviderCarousel />

        {/* 8. LIVE SERVICE TRACKING (Ride/Service Map Graphic & Status Timeline) */}
        <LiveTrackingSection />

        {/* 9. FAMILY ASSISTANCE (Request for Parents & Relatives) */}
        <FamilyAssistanceSection />

        {/* 10. CUSTOMER TESTIMONIALS (Real Sri Lankan Customer Reviews) */}
        <TestimonialsSection />

        {/* 11. MOBILE APP DOWNLOAD BANNER */}
        <AppDownloadSection />
      </div>
    </div>
  );
};

export default LandingPage;
