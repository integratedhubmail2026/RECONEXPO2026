import React, { useState, useEffect } from 'react';
import { useExpoData } from '../context/ExpoDataContext';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowRight, 
  ChevronDown, 
  Sparkles, 
  ShieldCheck,
  TrendingUp,
  Building2,
  Users2,
  Award,
  Flame
} from 'lucide-react';

interface HeroSectionProps {
  onOpenRegister: (tier?: string) => void;
  onExploreExpo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenRegister,
  onExploreExpo,
}) => {
  const { expoDetails, heroSlides } = useExpoData();

  // Current Background Image index for animated fast transitions
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [transitionSpeed, setTransitionSpeed] = useState<number>(2200); // 2.2 seconds fast interval default

  // Safe slides list
  const slides = heroSlides && heroSlides.length > 0 ? heroSlides : [
    {
      url: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=2000&q=85',
      title: 'Nigerian Developers & Investors Strategy Panel',
      city: 'Shehu Musa Yar’Adua Centre, Abuja',
      edition: 'RECON Plenary & Policy Dialogue',
      description: 'Black Nigerian property executives, developers, and sovereign fund managers in keynote discussions',
      transitionEffect: 'scale-110 translate-x-3 duration-[2400ms]',
    }
  ];

  // Fast background rotation interval with dynamic speed
  useEffect(() => {
    if (slides.length <= 1) return;
    const bgInterval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % slides.length);
    }, transitionSpeed);
    return () => clearInterval(bgInterval);
  }, [transitionSpeed, slides.length]);

  // Persistent 24-Hour Countdown Timer that NEVER auto-resets on refresh or reload
  const LOCAL_STORAGE_COUNTDOWN_KEY = 'recon_expo_24h_countdown_target_v1';

  const [timeLeft, setTimeLeft] = useState<{
    days?: number;
    hours: number;
    minutes: number;
    seconds: number;
    is24HourMode: boolean;
  }>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_COUNTDOWN_KEY);
      let targetMs: number;
      if (saved) {
        targetMs = parseInt(saved, 10);
      } else {
        targetMs = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem(LOCAL_STORAGE_COUNTDOWN_KEY, String(targetMs));
      }
      const diff = Math.max(0, targetMs - Date.now());
      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        is24HourMode: true,
      };
    } catch {
      return { hours: 23, minutes: 59, seconds: 59, is24HourMode: true };
    }
  });

  useEffect(() => {
    // Determine target timestamp: persistently stored 24-hour countdown end
    let targetMs: number;
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_COUNTDOWN_KEY);
      if (saved) {
        targetMs = parseInt(saved, 10);
        if (isNaN(targetMs) || targetMs <= 0) {
          targetMs = Date.now() + 24 * 60 * 60 * 1000;
          localStorage.setItem(LOCAL_STORAGE_COUNTDOWN_KEY, String(targetMs));
        }
      } else {
        // Initialize exactly 24 hours from first visitor load
        targetMs = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem(LOCAL_STORAGE_COUNTDOWN_KEY, String(targetMs));
      }
    } catch {
      targetMs = Date.now() + 24 * 60 * 60 * 1000;
    }

    const updateTimer = () => {
      const now = Date.now();
      const difference = targetMs - now;

      if (difference > 0) {
        const totalHours = Math.floor(difference / (1000 * 60 * 60));
        const hours = totalHours;
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds, is24HourMode: true });
      } else {
        // When timer runs down, hold at 00:00:00 — NEVER AUTO RESET!
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, is24HourMode: true });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    // Listen for manual reset event from Admin if administrator explicitly initiates one
    const handleManualReset = (e: CustomEvent) => {
      const newMs = e.detail?.targetMs || (Date.now() + 24 * 60 * 60 * 1000);
      targetMs = newMs;
      try {
        localStorage.setItem(LOCAL_STORAGE_COUNTDOWN_KEY, String(targetMs));
      } catch {}
      updateTimer();
    };

    window.addEventListener('recon_manual_reset_24h_timer', handleManualReset as EventListener);

    return () => {
      clearInterval(interval);
      window.removeEventListener('recon_manual_reset_24h_timer', handleManualReset as EventListener);
    };
  }, []);

  const activeSlide = slides[currentBgIndex % slides.length] || slides[0];

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-36 md:pb-28 flex flex-col justify-center items-center overflow-hidden px-3 sm:px-6 lg:px-8"
    >
      {/* 1. ANIMATED PAST REAL ESTATE EXHIBITIONS BACKGROUND CAROUSEL WITH FAST TRANSITIONS */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {slides.map((img, index) => {
          const isActive = index === (currentBgIndex % slides.length);
          return (
            <div
              key={img.url + index}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out filter brightness-115 contrast-110 saturate-110 ${
                isActive
                  ? `opacity-75 ${img.transitionEffect || 'scale-110 translate-x-3 duration-[2400ms]'}`
                  : 'opacity-0 scale-100'
              }`}
              style={{
                backgroundImage: `url('${img.url}')`,
              }}
            />
          );
        })}

        {/* Crisp Frosted Glass Gradient Overlays ensuring exhibition photos are bright & text is crisp */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#022c22] via-[#022c22]/50 to-[#022c22]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(16,185,129,0.15),transparent_60%)]" />
        <div className="absolute top-1/4 -right-20 w-72 h-72 sm:w-96 sm:h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 sm:w-96 sm:h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Architectural Stage Grid & Smooth Blended Light Lines */}
        <div className="absolute inset-0 frosted-dotted-pattern opacity-40" />
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-emerald-400/20 via-emerald-300/10 to-transparent opacity-60 blur-[0.5px]" />
        <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-red-500/15 via-red-400/10 to-transparent opacity-60 blur-[0.5px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto text-center flex flex-col items-center">
        
        {/* Top Glowing Frosted Pill Badge & Fast Speed Transition Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-4 sm:mb-6 max-w-full">
          <div 
            id="hero-top-badge"
            className="inline-flex items-center justify-center text-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs font-semibold shadow-[0_0_20px_rgba(16,185,129,0.2)] animate-float backdrop-blur-xl max-w-full"
          >
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#4ade80] flex-shrink-0"></span>
            <span className="leading-tight">
              {expoDetails.siteTexts?.heroTopBadge || "AFRICA’S PREMIER REAL ESTATE & INFRASTRUCTURE SUMMIT • ABUJA 2026"}
            </span>
          </div>

          {/* Interactive Past Exhibition Scene & Fast-Speed Control Tag */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-2xl sm:rounded-full bg-slate-900/80 border border-emerald-500/30 backdrop-blur-md text-[10px] sm:text-[11px] text-slate-200 shadow-xl max-w-full">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[9px] sm:text-[10px] uppercase tracking-wide border border-emerald-400/30 flex-shrink-0">
              <MapPin className="w-3 h-3 text-emerald-400" />
              {activeSlide.city}
            </span>
            <span className="font-semibold text-white truncate max-w-[130px] sm:max-w-[240px]">
              {activeSlide.title}
            </span>
            
            {/* Speed Selector Buttons */}
            <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-full border border-white/10">
              <span className="text-[9px] text-emerald-300 font-mono font-bold mr-0.5">Speed:</span>
              <button
                onClick={() => setTransitionSpeed(1400)}
                title="1.4s Turbo Speed Transition"
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all ${
                  transitionSpeed === 1400 ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                1.4s
              </button>
              <button
                onClick={() => setTransitionSpeed(2200)}
                title="2.2s Fast Speed Transition"
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all ${
                  transitionSpeed === 2200 ? 'bg-emerald-500 text-emerald-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                2.2s
              </button>
              <button
                onClick={() => setTransitionSpeed(3500)}
                title="3.5s Smooth Transition"
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all ${
                  transitionSpeed === 3500 ? 'bg-emerald-500 text-emerald-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                3.5s
              </button>
            </div>

            {/* Slide Dots */}
            <div className="flex items-center gap-1">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentBgIndex(i)}
                  aria-label={`Switch to exhibition slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    i === (currentBgIndex % slides.length) ? 'w-3.5 bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'w-1.5 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <div className="mb-2 max-w-3xl px-2">
          <p className="text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.2em] text-red-400 mb-1 font-display">
            {expoDetails.siteTexts?.heroCategory || "REAL ESTATE EXPO IN ABUJA, NIGERIA"}
          </p>
          <h1 
            id="hero-main-title"
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug font-display"
          >
            {expoDetails.name.includes("2026") ? (
              <>
                {expoDetails.name.replace(/2026.*/, '')}
                <span className="bg-gradient-to-r from-emerald-400 via-white to-red-400 bg-clip-text text-transparent">
                  2026
                </span>
              </>
            ) : (
              expoDetails.name
            )}
          </h1>
        </div>

        {/* Theme Tagline - Extra Large & Prominent */}
        <div className="w-full max-w-4xl mx-auto my-4 sm:my-6 px-3.5 py-3.5 sm:px-6 sm:py-5 rounded-2xl glass-panel border border-emerald-400/30 shadow-lg">
          <span className="block text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-emerald-400 mb-1">
            {expoDetails.siteTexts?.heroThemeLabel || "OFFICIAL EXPO THEME"}
          </span>
          <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl text-white font-black font-display leading-tight italic frosted-title-glow break-words">
            “{expoDetails.theme}”
          </p>
        </div>

        {/* 3 EVENT INFORMATION CARDS (DATE, VENUE, TIME) IN FROSTED GLASS */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 max-w-4xl mx-auto mb-6 sm:mb-10 justify-center">
          {/* Card 1: Date */}
          <div 
            id="hero-date-card"
            className="glass-panel glass-panel-hover p-3.5 sm:p-5 rounded-2xl flex items-center justify-start space-x-3.5 transition-all duration-300 text-left border border-white/10"
          >
            <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-inner flex-shrink-0">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                {expoDetails.siteTexts?.heroEventInfoDateLabel || "Event Date"}
              </p>
              <p className="text-sm sm:text-lg font-extrabold text-white font-heading leading-snug">
                {expoDetails.dateRange}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-400">
                {expoDetails.siteTexts?.heroEventInfoDateSubtitle || `${expoDetails.totalEventDays || 2} Full Days of Action`}
              </p>
            </div>
          </div>

          {/* Card 2: Venue */}
          <div 
            id="hero-venue-card"
            className="glass-panel glass-panel-hover p-3.5 sm:p-5 rounded-2xl flex items-center justify-start space-x-3.5 transition-all duration-300 text-left border border-white/10"
          >
            <div className="p-2.5 sm:p-3 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30 shadow-inner flex-shrink-0">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-red-300">
                {expoDetails.siteTexts?.heroEventInfoLocationLabel || "Location"}
              </p>
              <p className="text-sm sm:text-lg font-extrabold text-white font-heading leading-snug truncate">
                {expoDetails.venue}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">{expoDetails.venueAddress.split(',')[2] || 'Abuja, Nigeria'}</p>
            </div>
          </div>

          {/* Card 3: Time */}
          <div 
            id="hero-time-card"
            className="glass-panel glass-panel-hover p-3.5 sm:p-5 rounded-2xl flex items-center justify-start space-x-3.5 transition-all duration-300 text-left border border-white/10"
          >
            <div className="p-2.5 sm:p-3 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-inner flex-shrink-0">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-sky-300">
                {expoDetails.siteTexts?.heroEventInfoTimeLabel || "Daily Timing"}
              </p>
              <p className="text-sm sm:text-lg font-extrabold text-white font-heading leading-snug">
                {expoDetails.dailyTime.split('–')[0]?.trim() || '10:00 AM'}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-400">
                {expoDetails.siteTexts?.heroEventInfoTimeSubtitle || "West Africa Time (WAT)"}
              </p>
            </div>
          </div>
        </div>

        {/* LIVE 24-HOUR COUNTDOWN TIMER IN FROSTED GLASS (PERSISTENT & NEVER AUTO-RESETS) */}
        <div 
          id="hero-countdown-box"
          className="w-full max-w-xs sm:max-w-sm mx-auto mb-6 p-2.5 sm:p-3 rounded-2xl glass-panel shadow-lg border border-amber-400/30 bg-black/60 backdrop-blur-xl"
        >
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
              {expoDetails.siteTexts?.heroCountdownTitle || "24-Hour Priority Registration & Discount Window"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            {/* Hours */}
            <div className="bg-white/5 backdrop-blur-md py-2 px-1 rounded-xl border border-amber-400/25 shadow-inner">
              <span className="block text-base sm:text-xl font-black text-white font-display tabular-nums leading-none mb-1">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] font-bold uppercase text-amber-300/90 tracking-wider leading-none">
                Hours
              </span>
            </div>
            {/* Minutes */}
            <div className="bg-white/5 backdrop-blur-md py-2 px-1 rounded-xl border border-white/10 shadow-inner">
              <span className="block text-base sm:text-xl font-black text-white font-display tabular-nums leading-none mb-1">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] font-bold uppercase text-emerald-400 tracking-wider leading-none">
                Mins
              </span>
            </div>
            {/* Seconds */}
            <div className="bg-white/5 backdrop-blur-md py-2 px-1 rounded-xl border border-red-500/25 shadow-inner">
              <span className="block text-base sm:text-xl font-black text-red-400 font-display tabular-nums leading-none mb-1">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] font-bold uppercase text-red-300 tracking-wider leading-none">
                Secs
              </span>
            </div>
          </div>
        </div>

        {/* HERO CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md mx-auto mb-8 sm:mb-12">
          {/* Primary CTA */}
          <button
            id="hero-primary-register-btn"
            onClick={() => onOpenRegister('attendee')}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm sm:text-base tracking-wider transition-all cursor-pointer shadow-xl shadow-red-900/40 border border-red-500/30 active:scale-95"
          >
            <Flame className="w-5 h-5 text-amber-300" />
            <span>{expoDetails.siteTexts?.heroPrimaryCta || "REGISTER NOW"}</span>
            <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1.5 transition-transform" />
          </button>

          {/* Secondary CTA */}
          <button
            id="hero-secondary-explore-btn"
            onClick={onExploreExpo}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-sm sm:text-base tracking-wide transition-all duration-200 cursor-pointer backdrop-blur-md shadow-lg active:scale-95"
          >
            <span>{expoDetails.siteTexts?.heroSecondaryCta || "EXPLORE EXPO"}</span>
            <ChevronDown className="w-4 h-4 text-emerald-400" />
          </button>
        </div>

        {/* Blended Soft Gradient Divider Line */}
        <div className="w-full flex items-center justify-center my-2 sm:my-3">
          <div className="w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-emerald-400/30 via-white/20 to-transparent blur-[0.3px]" />
        </div>

        {/* KEY HIGHLIGHT STATS TICKER IN FROSTED GLASS */}
        <div 
          id="hero-stats-ribbon"
          className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 max-w-4xl mx-auto justify-center"
        >
          <div className="text-center p-3 sm:p-3.5 rounded-2xl glass-panel">
            <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-emerald-400 font-display">
              {expoDetails.stats.attendees}
            </p>
            <p className="text-[11px] sm:text-xs text-slate-300 font-medium">
              {expoDetails.siteTexts?.heroStat1Label || "Registered Attendees"}
            </p>
          </div>
          <div className="text-center p-3 sm:p-3.5 rounded-2xl glass-panel">
            <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-red-400 font-display">
              {expoDetails.stats.exhibitors}
            </p>
            <p className="text-[11px] sm:text-xs text-slate-300 font-medium">
              {expoDetails.siteTexts?.heroStat2Label || "Industry Exhibitors"}
            </p>
          </div>
          <div className="text-center p-3 sm:p-3.5 rounded-2xl glass-panel">
            <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-display">
              {expoDetails.stats.speakers}
            </p>
            <p className="text-[11px] sm:text-xs text-slate-300 font-medium">
              {expoDetails.siteTexts?.heroStat3Label || "Keynote Speakers"}
            </p>
          </div>
          <div className="text-center p-3 sm:p-3.5 rounded-2xl glass-panel">
            <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-300 font-display">
              {expoDetails.stats.dealsProjected}
            </p>
            <p className="text-[11px] sm:text-xs text-slate-300 font-medium">
              {expoDetails.siteTexts?.heroStat4Label || "Deals Pipeline"}
            </p>
          </div>
        </div>

        {/* Animated Scroll Down Indicator */}
        <div className="mt-8 sm:mt-12 flex flex-col items-center animate-bounce opacity-75">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-emerald-300 font-semibold mb-1">
            Scroll to Discover
          </span>
          <ChevronDown className="w-5 h-5 text-emerald-400" />
        </div>

      </div>

      {/* Bottom Hero Page Blend & Fade Overlay with Soft Horizon Line */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#022c22] via-[#022c22]/60 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 flex justify-center pointer-events-none z-20">
        <div className="w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-emerald-400/25 via-emerald-300/35 to-transparent blur-[0.5px]" />
      </div>
    </section>
  );
};
