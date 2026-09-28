import React, { useEffect } from 'react';
import { ExpoDataProvider, useExpoData } from './context/ExpoDataContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { BackgroundParticles } from './components/BackgroundParticles';
import { LiveRegistrationNotification } from './components/LiveRegistrationNotification';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ThemeAndSpeakers } from './components/ThemeAndSpeakers';
import { ProgrammeSection } from './components/ProgrammeSection';
import { SponsorsShowcase } from './components/SponsorsShowcase';
import { RegistrationSection } from './components/RegistrationSection';
import { BecomeMarketerSection } from './components/BecomeMarketerSection';
import { FaqSection } from './components/FaqSection';
import { FooterSection } from './components/FooterSection';
import { WhatsAppSupportButton } from './components/WhatsAppSupportButton';
import { PushNotificationBanner } from './components/PushNotificationBanner';

// Interactive Modals
import { RegistrationModal } from './components/RegistrationModal';
import { FloorPlanModal } from './components/FloorPlanModal';
import { DelegateAccountModal } from './components/DelegateAccountModal';
import { CompanyStaffBadgeManager } from './components/CompanyStaffBadgeManager';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';
import { logPixelEvent } from './services/pixelTrackingService';

const MainLayout: React.FC = () => {
  const { setActiveReferralCode } = useExpoData();

  useEffect(() => {
    // Check URL for ?ref=MARKETER_CODE
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const refCode = params.get('ref');
      if (refCode) {
        setActiveReferralCode(refCode.toUpperCase());
        // Track affiliate landing
        logPixelEvent('AffiliateReferralVisit', { referralCode: refCode });
      }
    }
    // Track PageView
    logPixelEvent('PageView');
  }, [setActiveReferralCode]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Dynamic Animated Particles Background */}
      <BackgroundParticles />

      {/* Real-time Manual Registration Alerts Only */}
      <LiveRegistrationNotification />

      {/* Global Navigation Bar */}
      <Navbar />

      {/* Hero with dynamic countdown & fast accreditation CTAs */}
      <HeroSection />

      {/* Ministerial Keynotes & Industry Speakers */}
      <ThemeAndSpeakers />

      {/* 2-Day Conference & Masterclass Schedule */}
      <ProgrammeSection />

      {/* Titanium & Gold Partners Showcase */}
      <SponsorsShowcase />

      {/* Pass Comparison Matrix & Registration Triggers */}
      <RegistrationSection />

      {/* 15% Ambassador Affiliate Portal Section */}
      <BecomeMarketerSection />

      {/* Categorized FAQ & Secretariat Information */}
      <FaqSection />

      {/* Footer with Afriview Group details */}
      <FooterSection />

      {/* Floating WhatsApp Direct Support Button */}
      <WhatsAppSupportButton />

      {/* Web Push Notification Opt-in Prompt */}
      <PushNotificationBanner />

      {/* Interactive Global Modals */}
      <RegistrationModal />
      <FloorPlanModal />
      <DelegateAccountModal />
      <CompanyStaffBadgeManager />
      <AdminDashboardModal />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <ExpoDataProvider>
        <MainLayout />
      </ExpoDataProvider>
    </ErrorBoundary>
  );
}
