import React, { useState, useEffect } from 'react';
import { useExpoData } from '../context/ExpoDataContext';
import {
  Calendar,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Users,
  Building2,
  Trophy,
  CheckCircle2
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const HeroSection: React.FC = () => {
  const { siteContent, openModal, setSelectedTierForModal } = useExpoData();

  // Dynamic Countdown Timer to Oct 29, 2026
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2026-10-29T08:00:00+01:00').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenRegistration = (tier: 'visitor' | 'elite') => {
    setSelectedTierForModal(tier);
    openModal('registration');
  };

  return (
    <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
      {/* Background Architectural Ambient Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-emerald-600/15 via-teal-800/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Tag Banner */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold tracking-tight shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{siteContent.eventEdition} • Federal Capital Territory</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-slate-300 border border-slate-800 text-xs font-medium">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>{siteContent.eventDates}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-slate-300 border border-slate-800 text-xs font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{siteContent.eventVenue}</span>
            </span>
          </div>
        </ScrollReveal>

        {/* Hero Main Headline */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="text-center max-w-4xl mx-auto mb-8">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6">
              Shaping Africa's <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-300">
                Built Environment & Megaprojects
              </span>
            </h1>
            <p className="text-slate-300 text-base sm:text-xl leading-relaxed max-w-2xl mx-auto font-normal">
              {siteContent.heroSubheadline}
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Countdown Clock */}
        <ScrollReveal direction="up" delay={0.3}>
          <div className="max-w-xl mx-auto mb-10 bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-2xl shadow-emerald-950/60 flex items-center justify-around text-center">
            <div className="flex flex-col">
              <span className="text-2xl sm:text-4xl font-black text-white font-mono">{timeLeft.days}</span>
              <span className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 tracking-wider">Days</span>
            </div>
            <div className="text-emerald-500 font-bold text-xl sm:text-2xl">:</div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-4xl font-black text-emerald-400 font-mono">{timeLeft.hours}</span>
              <span className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 tracking-wider">Hours</span>
            </div>
            <div className="text-emerald-500 font-bold text-xl sm:text-2xl">:</div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-4xl font-black text-teal-300 font-mono">{timeLeft.minutes}</span>
              <span className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 tracking-wider">Mins</span>
            </div>
            <div className="text-emerald-500 font-bold text-xl sm:text-2xl">:</div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-4xl font-black text-amber-400 font-mono">{timeLeft.seconds}</span>
              <span className="text-[10px] sm:text-xs uppercase font-bold text-slate-400 tracking-wider">Secs</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Action Call to Actions */}
        <ScrollReveal direction="up" delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => handleOpenRegistration('visitor')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 text-slate-950 font-black text-base shadow-2xl shadow-emerald-950/80 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Get Free Trade Visitor Pass</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleOpenRegistration('elite')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 border-2 border-amber-400/50 hover:border-amber-400 text-amber-300 font-black text-base shadow-xl hover:bg-amber-400/10 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Elite VIP Pass (₦25,000)</span>
            </button>
          </div>
        </ScrollReveal>

        {/* Real Estate & Construction Metric Stats */}
        <ScrollReveal direction="up" delay={0.5}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            <div className="bg-slate-950/70 border border-emerald-500/20 rounded-2xl p-5 text-center backdrop-blur-md">
              <Users className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl sm:text-3xl font-black text-white">{siteContent.expectedAttendeesCount}</div>
              <p className="text-xs text-slate-400 font-medium mt-1">Delegates & Buyers</p>
            </div>

            <div className="bg-slate-950/70 border border-emerald-500/20 rounded-2xl p-5 text-center backdrop-blur-md">
              <Building2 className="w-6 h-6 text-teal-400 mx-auto mb-2" />
              <div className="text-2xl sm:text-3xl font-black text-white">{siteContent.exhibitingCompaniesCount}</div>
              <p className="text-xs text-slate-400 font-medium mt-1">Exhibiting Brands</p>
            </div>

            <div className="bg-slate-950/70 border border-emerald-500/20 rounded-2xl p-5 text-center backdrop-blur-md">
              <Trophy className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <div className="text-2xl sm:text-3xl font-black text-white">{siteContent.speakersCount}</div>
              <p className="text-xs text-slate-400 font-medium mt-1">Ministers & CEOs</p>
            </div>

            <div className="bg-slate-950/70 border border-emerald-500/20 rounded-2xl p-5 text-center backdrop-blur-md">
              <ShieldCheck className="w-6 h-6 text-emerald-300 mx-auto mb-2" />
              <div className="text-2xl sm:text-3xl font-black text-white">8th Edition</div>
              <p className="text-xs text-slate-400 font-medium mt-1">Established Legacy</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
