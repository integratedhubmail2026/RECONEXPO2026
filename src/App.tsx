/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ThemeAndSpeakers } from './components/ThemeAndSpeakers';
import { ProgrammeSection } from './components/ProgrammeSection';
import { RegistrationSection } from './components/RegistrationSection';
import { SponsorsShowcase } from './components/SponsorsShowcase';
import { BecomeMarketerSection } from './components/BecomeMarketerSection';
import { FaqSection } from './components/FaqSection';
import { FooterSection } from './components/FooterSection';
import { RegistrationModal } from './components/RegistrationModal';
import { FloorPlanModal } from './components/FloorPlanModal';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';
import { DelegateAccountModal } from './components/DelegateAccountModal';
import { BackgroundParticles } from './components/BackgroundParticles';
import { PushNotificationBanner } from './components/PushNotificationBanner';
import { LiveRegistrationNotification } from './components/LiveRegistrationNotification';
import { WhatsAppSupportButton } from './components/WhatsAppSupportButton';
import { ScrollReveal } from './components/ScrollReveal';
import { useExpoData } from './context/ExpoDataContext';
import { initPixelTracking, trackPixelEvent } from './services/pixelTrackingService';
import { injectSeoMetadata } from './services/seoService';

export default function App() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerTier, setRegisterTier] = useState<string>('attendee');
  const [registerDiscounted, setRegisterDiscounted] = useState<boolean>(false);
  const [isFloorPlanOpen, setIsFloorPlanOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isDelegatePortalOpen, setIsDelegatePortalOpen] = useState(false);

  const { adminAuth } = useExpoData();

  // Initialize Facebook & TikTok Pixels and SEO/AEO Schemas on boot
  useEffect(() => {
    try {
      injectSeoMetadata();
      initPixelTracking();
      trackPixelEvent({
        eventName: 'PageView',
        contentName: "RECON Expo 2026 Landing Page",
        category: 'Website Visitors'
      });
    } catch {
      // safe
    }
  }, []);

  // Check for return redirect from Flutterwave checkout or incoming referral / tier link
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const txRef = params.get('tx_ref');
      const status = params.get('status') || params.get('payment_status');
      const refCode = params.get('ref') || params.get('referral') || params.get('referralCode');
      const tierParam = params.get('tier') || params.get('pass') || params.get('category');

      if (txRef && (status === 'successful' || status === 'completed')) {
        setRegisterTier('elite');
        setIsRegisterOpen(true);
      } else if (refCode || tierParam || window.location.hash === '#registration') {
        const resolvedTier = tierParam === 'exhibitor' ? 'exhibitor' :
                             tierParam === 'elite' ? 'elite' :
                             tierParam === 'sponsor' ? 'sponsor' :
                             tierParam === 'partner' ? 'partner' :
                             tierParam === 'visitor' ? 'visitor' :
                             (tierParam || 'attendee');
        setRegisterTier(resolvedTier);
        setIsRegisterOpen(true);
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, []);

  // Keyboard shortcut listener: 
  // Alt + A (Admin Console)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        setIsAdminOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenRegister = (tier: string = 'attendee', isDiscounted: boolean = false) => {
    setRegisterTier(tier);
    setRegisterDiscounted(isDiscounted);
    setIsRegisterOpen(true);

    try {
      trackPixelEvent({
        eventName: 'InitiateCheckout',
        contentName: `RECON Expo Pass (${tier.toUpperCase()})`,
        category: 'Registration Checkout',
        value: tier === 'elite' ? 25000 : tier === 'exhibitor' ? 350000 : 0,
        currency: 'NGN'
      });
    } catch {
      // safe
    }
  };

  const handleExploreExpo = () => {
    const themeEl = document.getElementById('theme');
    if (themeEl) {
      themeEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#02180e] text-[#f1f5f9] relative overflow-x-hidden selection:bg-[#22c55e] selection:text-[#02180e]">
      {/* Client-Side Fade Slide-Down Push Notification Subscription Banner & Broadcast Toast */}
      <PushNotificationBanner />

      {/* Real-Time Live Registration Notification Popup (Top Left Corner) */}
      <LiveRegistrationNotification />

      {/* Floating WhatsApp Support Widget (Bottom Right Corner) */}
      <WhatsAppSupportButton />

      {/* Background Animated Particle Canvas */}
      <BackgroundParticles />

      {/* 1. Header Navigation */}
      <Navbar
        onOpenRegister={handleOpenRegister}
        onOpenFloorPlan={() => setIsFloorPlanOpen(true)}
        onOpenDelegatePortal={() => setIsDelegatePortalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="relative z-10 space-y-4">
        {/* Section 1: Hero Section */}
        <HeroSection
          onOpenRegister={handleOpenRegister}
          onExploreExpo={handleExploreExpo}
        />

        {/* Section 2: Central Theme & Keynote Speakers */}
        <ScrollReveal yOffset={40}>
          <ThemeAndSpeakers onOpenRegister={handleOpenRegister} />
        </ScrollReveal>

        {/* Section 3: Official Expo Programme */}
        <ScrollReveal yOffset={40}>
          <ProgrammeSection onOpenRegister={handleOpenRegister} />
        </ScrollReveal>

        {/* Section 4: Registration & Participation Tiers */}
        <ScrollReveal yOffset={40}>
          <RegistrationSection 
            onOpenRegister={handleOpenRegister} 
            onOpenDelegatePortal={() => setIsDelegatePortalOpen(true)}
          />
        </ScrollReveal>

        {/* Section 5: Premium Sponsors & Supporters */}
        <ScrollReveal yOffset={40}>
          <SponsorsShowcase onOpenRegister={handleOpenRegister} />
        </ScrollReveal>

        {/* Section 6: Become a Marketer (Make Money by Referrals) */}
        <ScrollReveal yOffset={40}>
          <BecomeMarketerSection onOpenRegister={handleOpenRegister} />
        </ScrollReveal>

        {/* Frequently Asked Questions */}
        <ScrollReveal yOffset={40}>
          <FaqSection />
        </ScrollReveal>

        {/* Section 7: Mega Footer & Secretariat Contact */}
        <ScrollReveal yOffset={30}>
          <FooterSection 
            onOpenRegister={handleOpenRegister} 
            onOpenAdmin={() => setIsAdminOpen(true)}
          />
        </ScrollReveal>
      </main>

      {/* Interactive Modals */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        defaultTier={registerTier}
        defaultDiscounted={registerDiscounted}
        onOpenDelegatePortal={() => setIsDelegatePortalOpen(true)}
      />

      <DelegateAccountModal
        isOpen={isDelegatePortalOpen}
        onClose={() => setIsDelegatePortalOpen(false)}
        onOpenRegister={handleOpenRegister}
      />

      <FloorPlanModal
        isOpen={isFloorPlanOpen}
        onClose={() => setIsFloorPlanOpen(false)}
        onBookBooth={() => handleOpenRegister('exhibitor')}
      />

      {/* Admin Content Management Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}

