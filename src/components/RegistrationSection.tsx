import React, { useState } from 'react';
import { useExpoData } from '../context/ExpoDataContext';
import { 
  Users, 
  Store, 
  Sparkles, 
  Handshake, 
  Check, 
  ArrowRight, 
  Zap,
  Star,
  Award,
  Crown,
  Ticket,
  Search,
  UserCheck
} from 'lucide-react';

interface RegistrationSectionProps {
  onOpenRegister: (tier: string, isDiscounted?: boolean) => void;
  onOpenDelegatePortal?: () => void;
}

export const RegistrationSection: React.FC<RegistrationSectionProps> = ({ 
  onOpenRegister,
  onOpenDelegatePortal 
}) => {
  const { tiers, expoDetails } = useExpoData();
  const [activeCategory, setActiveCategory] = useState<'all' | 'visitor' | 'elite' | 'exhibitor' | 'sponsor' | 'partner'>('all');

  const getTierIcon = (id: string) => {
    switch (id) {
      case 'visitor': return <Ticket className="w-6 h-6 text-sky-400" />;
      case 'elite': return <Crown className="w-6 h-6 text-amber-400" />;
      case 'exhibitor': return <Store className="w-6 h-6 text-emerald-400" />;
      case 'sponsor': return <Sparkles className="w-6 h-6 text-red-400" />;
      case 'partner': return <Handshake className="w-6 h-6 text-purple-300" />;
      case 'attendee': return <Users className="w-6 h-6 text-amber-400" />;
      default: return <Users className="w-6 h-6 text-sky-400" />;
    }
  };

  const filteredTiers = activeCategory === 'all' 
    ? tiers 
    : tiers.filter(t => t.id === activeCategory);

  return (
    <section id="registration" className="relative py-20 sm:py-24 bg-[#022c22]/50 overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            {expoDetails.siteTexts?.registrationBadge || "REGISTRATION & PARTICIPATION TIERS"}
          </div>

          <h2 
            id="registration-main-heading"
            className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-display frosted-title-glow mb-3 tracking-tight"
          >
            {expoDetails.siteTexts?.registrationHeading || "BE PART OF THE REAL ESTATE & CONSTRUCTION FUTURE"}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {expoDetails.siteTexts?.registrationSubtitle || "Select your standalone category below: register for a Free Visitor Pass, upgrade to Elite VIP Pass (₦25,000 / $25), book an exhibitor stand, sponsor the summit, or join as a strategic partner."}
          </p>

          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={() => onOpenDelegatePortal ? onOpenDelegatePortal() : onOpenRegister('attendee')}
              className="px-5 py-2.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md hover:scale-105"
            >
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>{expoDetails.siteTexts?.registrationCheckBadgeBtn || "Already Registered? Access Registration Account & Retrieve ID Card"}</span>
            </button>
          </div>
        </div>

        {/* Standalone Category Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 sm:mb-12 px-1">
          <button
            type="button"
            onClick={() => setActiveCategory(prev => prev === 'visitor' ? 'all' : 'visitor')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold tracking-wide transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 min-h-[46px] shadow-sm ${
              activeCategory === 'visitor'
                ? 'bg-sky-500 text-sky-950 shadow-sky-950/40 ring-2 ring-sky-300'
                : 'bg-white/10 hover:bg-white/15 text-sky-200 border border-sky-500/20'
            }`}
          >
            <Ticket className="w-4 h-4 text-sky-400" />
            <span>Visitor (Free)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory(prev => prev === 'elite' ? 'all' : 'elite')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold tracking-wide transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 min-h-[46px] shadow-sm ${
              activeCategory === 'elite'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-amber-950/50 ring-2 ring-amber-300'
                : 'bg-white/10 hover:bg-white/15 text-amber-200 border border-amber-500/20'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Elite VIP (₦25,000 / $25)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory(prev => prev === 'exhibitor' ? 'all' : 'exhibitor')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold tracking-wide transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 min-h-[46px] shadow-sm ${
              activeCategory === 'exhibitor'
                ? 'bg-emerald-500 text-emerald-950 shadow-emerald-950/40 ring-2 ring-emerald-300'
                : 'bg-white/10 hover:bg-white/15 text-emerald-200 border border-emerald-500/20'
            }`}
          >
            <Store className="w-4 h-4 text-emerald-400" />
            <span>Exhibitors</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory(prev => prev === 'sponsor' ? 'all' : 'sponsor')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold tracking-wide transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 min-h-[46px] shadow-sm ${
              activeCategory === 'sponsor'
                ? 'bg-red-600 text-white shadow-red-950/40 ring-2 ring-red-400'
                : 'bg-white/10 hover:bg-white/15 text-red-200 border border-red-500/20'
            }`}
          >
            <Sparkles className="w-4 h-4 text-red-400" />
            <span>Sponsors</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory(prev => prev === 'partner' ? 'all' : 'partner')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold tracking-wide transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 min-h-[46px] shadow-sm ${
              activeCategory === 'partner'
                ? 'bg-purple-600 text-white shadow-purple-950/40 ring-2 ring-purple-400'
                : 'bg-white/10 hover:bg-white/15 text-purple-200 border border-purple-500/20'
            }`}
          >
            <Handshake className="w-4 h-4 text-purple-300" />
            <span>Partners</span>
          </button>
        </div>

        {/* REGISTRATION CARDS GRID IN SPACIOUS, CENTRALIZED STANDALONE FORMAT */}
        <div className={`grid gap-6 justify-center items-stretch w-full mx-auto ${
          activeCategory === 'all'
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 max-w-7xl'
            : 'grid-cols-1 max-w-md'
        }`}>
          {filteredTiers.map((tier) => {
            const isVisitor = tier.id === 'visitor';
            const isElite = tier.id === 'elite';
            const isSponsor = tier.id === 'sponsor';
            const isPartner = tier.id === 'partner';
            const isExhibitor = tier.id === 'exhibitor';

            return (
              <div
                key={tier.id}
                id={`registration-tier-card-${tier.id}`}
                className={`glass-panel glass-panel-hover rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative border ${
                  isElite
                    ? 'border-amber-400/60 bg-amber-950/20 shadow-[0_0_35px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/40'
                    : isVisitor
                    ? 'border-sky-400/50 bg-sky-950/30 shadow-[0_0_30px_rgba(56,189,248,0.2)] ring-1 ring-sky-400/30'
                    : isExhibitor
                    ? 'border-emerald-400/40 bg-emerald-950/20 shadow-[0_0_30px_rgba(52,211,153,0.18)]'
                    : isSponsor
                    ? 'border-red-500/40 bg-red-950/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]'
                    : isPartner
                    ? 'border-purple-400/40 bg-purple-950/20 shadow-[0_0_30px_rgba(168,85,247,0.2)]'
                    : 'border-white/10 bg-white/5 shadow-md'
                }`}
              >
                {/* Top Badge Pill */}
                {isElite && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-black text-[10px] font-black tracking-wider uppercase shadow-md flex items-center gap-1 whitespace-nowrap">
                      <Crown className="w-3 h-3 fill-current" />
                      ★ VIP ACCESS & GALA
                    </span>
                  </div>
                )}
                {isVisitor && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                    <span className="px-3 py-1 rounded-full bg-sky-400 text-sky-950 text-[10px] font-black tracking-wider uppercase shadow-md flex items-center gap-1 whitespace-nowrap">
                      <Star className="w-3 h-3 fill-current" />
                      FREE ADMISSION
                    </span>
                  </div>
                )}
                {isSponsor && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                    <span className="px-3.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-black tracking-wider uppercase shadow-md flex items-center gap-1 whitespace-nowrap">
                      <Award className="w-3 h-3 fill-current" />
                      {tier.badge || 'HEADLINE BRAND'}
                    </span>
                  </div>
                )}
                {isPartner && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                    <span className="px-3.5 py-1 rounded-full bg-purple-500/40 border border-purple-400/50 text-purple-200 text-[10px] font-black tracking-wider uppercase shadow-md flex items-center gap-1 whitespace-nowrap">
                      <Handshake className="w-3 h-3" />
                      MoU & MEDIA
                    </span>
                  </div>
                )}
                {isExhibitor && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                    <span className="px-3.5 py-1 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-[10px] font-black tracking-wider uppercase shadow-md flex items-center gap-1 whitespace-nowrap">
                      <Store className="w-3 h-3" />
                      COMMISSION: 10% • BOOTH STAND
                    </span>
                  </div>
                )}

                <div>
                  {/* Icon & Title */}
                  <div className="flex items-center justify-between mb-3 mt-1">
                    <div className={`p-2.5 rounded-2xl border shadow-sm backdrop-blur-md ${
                      isElite ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' :
                      isVisitor ? 'bg-sky-500/20 border-sky-500/40 text-sky-300' :
                      isExhibitor ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' :
                      isSponsor ? 'bg-red-500/15 border-red-500/30 text-red-400' :
                      'bg-purple-500/15 border-purple-500/30 text-purple-300'
                    }`}>
                      {getTierIcon(tier.id)}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      isElite ? 'text-amber-300' :
                      isVisitor ? 'text-sky-300' :
                      isExhibitor ? 'text-emerald-300' :
                      isSponsor ? 'text-red-300' :
                      'text-purple-300'
                    }`}>
                      {tier.title}
                    </span>
                  </div>

                  {/* Main Tier Name */}
                  <h3 className="text-lg sm:text-xl font-extrabold text-white font-heading mb-1">
                    {tier.tagline}
                  </h3>

                  {/* Price info / Secretariat Application Info */}
                  <div className={`my-3 py-2.5 px-3 rounded-2xl border backdrop-blur-md ${
                    isElite ? 'bg-amber-500/10 border-amber-500/30' :
                    isVisitor ? 'bg-sky-500/10 border-sky-500/30' :
                    isExhibitor ? 'bg-emerald-500/10 border-emerald-500/30' :
                    isSponsor ? 'bg-red-500/10 border-red-500/30' :
                    'bg-purple-500/10 border-purple-500/30'
                  }`}>
                    {isVisitor || isElite ? (
                      <div>
                        <div className="flex items-baseline justify-between">
                          <p className={`text-lg sm:text-xl font-black ${
                            isElite ? 'text-amber-300' : 'text-sky-300'
                          }`}>
                            {tier.priceNGN}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {tier.priceUSD ? `Approx ${tier.priceUSD}` : ''}
                          </p>
                        </div>
                        <p className="text-[10px] text-slate-300 mt-0.5">
                          {isVisitor ? 'Complimentary Exhibition Entry Pass' : 'VIP Access, Deal Rooms & Gala Banquet'}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline justify-between">
                          <p className={`text-sm sm:text-base font-black ${
                            isExhibitor ? 'text-emerald-300' :
                            isSponsor ? 'text-red-400' :
                            'text-purple-300'
                          }`}>
                            {tier.priceNGN}
                          </p>
                          <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {isExhibitor ? 'Commission: 10%' : 'Direct Inquire'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-300 mt-0.5">
                          Direct Allocation & Official Badges Handled by Secretariat
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Target audience description */}
                  <p className="text-xs text-slate-300 mb-4 leading-relaxed line-clamp-3">
                    {tier.targetAudience}
                  </p>

                  {/* Features List */}
                  <div className="space-y-1.5 mb-5 pt-3 border-t border-white/10">
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${
                      isElite ? 'text-amber-400' :
                      isVisitor ? 'text-sky-300' :
                      isExhibitor ? 'text-emerald-400' :
                      isSponsor ? 'text-red-400' :
                      'text-purple-300'
                    }`}>
                      Package Inclusions:
                    </p>
                    {tier.features.slice(0, 5).map((feat, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-slate-200">
                        <Check className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                          isElite ? 'text-amber-400' :
                          isVisitor ? 'text-sky-400' :
                          isExhibitor ? 'text-emerald-400' :
                          isSponsor ? 'text-red-400' :
                          'text-purple-400'
                        }`} />
                        <span className="line-clamp-2">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="pt-3">
                  {isElite ? (
                    <button
                      id="reg-cta-btn-elite"
                      onClick={() => onOpenRegister('elite')}
                      className="w-full py-3 px-3 rounded-xl font-black text-xs tracking-wider transition-all duration-200 flex items-center justify-between cursor-pointer min-h-[46px] shadow-md bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black shadow-amber-950/40 hover:scale-[1.02]"
                    >
                      <span className="flex items-center gap-1.5 font-black">
                        <Crown className="w-4 h-4" />
                        <span>REGISTER FOR ELITE VIP</span>
                      </span>
                      <span className="font-extrabold text-[11px] bg-black/20 px-2.5 py-1 rounded-lg">
                        ₦25,000 / $25
                      </span>
                    </button>
                  ) : (
                    <button
                      id={`reg-cta-btn-${tier.id}`}
                      onClick={() => onOpenRegister(tier.id)}
                      className={`w-full py-3 px-3 rounded-xl font-black text-xs tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer min-h-[46px] shadow-md ${
                        isVisitor
                          ? 'bg-sky-500 hover:bg-sky-400 text-sky-950 shadow-sky-950/40'
                          : isExhibitor
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 shadow-emerald-950/40'
                          : isSponsor
                          ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40'
                          : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/40'
                      }`}
                    >
                      <span>{tier.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

