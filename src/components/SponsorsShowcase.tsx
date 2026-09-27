import React from 'react';
import { useExpoData } from '../context/ExpoDataContext';
import { 
  Sparkles, 
  Handshake, 
  ArrowRight, 
  Award,
  Globe2
} from 'lucide-react';

interface SponsorsShowcaseProps {
  onOpenRegister: (tier: string) => void;
}

export const SponsorsShowcase: React.FC<SponsorsShowcaseProps> = ({ onOpenRegister }) => {
  const { sponsors, expoDetails } = useExpoData();
  const premiumSponsors = sponsors.filter(s => ['headline', 'platinum', 'gold'].includes(s.category));
  const techAndInstitutional = sponsors.filter(s => ['tech', 'institutional'].includes(s.category));

  return (
    <section id="sponsors" className="relative py-24 bg-[#022c22]/40 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* TOP SPONSORS HEADING */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 backdrop-blur-md">
            <Award className="w-3.5 h-3.5 text-red-400" />
            {expoDetails.siteTexts?.sponsorsBadge || "INDUSTRY TITANS & INSTITUTIONAL BACKERS"}
          </div>

          <h2 
            id="sponsors-main-heading"
            className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-display frosted-title-glow mb-3 tracking-tight"
          >
            {expoDetails.siteTexts?.sponsorsHeading || "OUR PREMIUM SPONSORS"}
          </h2>

          <p className="text-sm sm:text-base text-slate-300">
            {expoDetails.siteTexts?.sponsorsSubtitle || "Backed by Nigeria’s leading civil engineering conglomerates, tier-1 mortgage banks, luxury estate developers, and infrastructure pioneers."}
          </p>
        </div>

        {/* 1. PREMIUM SPONSORS GRID (Headline & Platinum) IN FROSTED GLASS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 max-w-5xl mx-auto justify-center">
          {premiumSponsors.map((sponsor, index) => (
            <div
              key={sponsor.name}
              id={`sponsor-item-${index + 1}`}
              className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 group border border-white/10 relative"
            >
              {/* Category tag */}
              <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full mb-3 ${
                sponsor.category === 'headline' ? 'bg-red-600 text-white' :
                sponsor.category === 'platinum' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                'bg-white/10 text-slate-300'
              }`}>
                {sponsor.category} Sponsor
              </span>

              {/* Logo Emblem & Brand Image Box */}
              <div className="w-full h-24 flex flex-col items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300">
                {sponsor.logoUrl ? (
                  <div className="relative w-full h-18 sm:h-20 rounded-xl overflow-hidden bg-white p-2 border border-white/30 flex items-center justify-center shadow-md">
                    <img 
                      src={sponsor.logoUrl} 
                      alt={`${sponsor.name} logo`}
                      className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-all duration-300"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-18 sm:h-20 rounded-xl bg-white p-2 border border-white/30 flex items-center justify-center shadow-md">
                    <div className="text-base sm:text-lg font-black tracking-wider text-slate-900 font-display">
                      {sponsor.logoPlaceholder}
                    </div>
                  </div>
                )}
              </div>

              {/* Tagline */}
              <p className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors line-clamp-2">
                {sponsor.name}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {sponsor.industry}
              </p>
            </div>
          ))}
        </div>

        {/* 2. SUPPORTERS & INSTITUTIONAL PARTNERS */}
        <div className="pt-8 border-t border-white/10 mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 
              id="supporters-heading"
              className="text-2xl sm:text-3xl font-bold text-white font-display"
            >
              {expoDetails.siteTexts?.supportersHeading || "OUR SUPPORTERS & PARTNERS"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {expoDetails.siteTexts?.supportersSubtitle || "Endorsed by Federal Ministries, Chartered Institutes, and Architectural Councils across Nigeria."}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto justify-center">
            {techAndInstitutional.map((partner, idx) => (
              <div
                key={partner.name}
                id={`partner-logo-box-${idx + 1}`}
                className="p-5 rounded-2xl glass-panel flex flex-col items-center justify-center text-center transition-all duration-300 group cursor-default"
              >
                {partner.logoUrl ? (
                  <div className="w-full h-14 rounded-xl overflow-hidden bg-white p-2 border border-white/30 mb-2 flex items-center justify-center shadow-md">
                    <img
                      src={partner.logoUrl}
                      alt={`${partner.name} logo`}
                      className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <Globe2 className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 transition-colors mb-2" />
                )}
                <h4 className="text-xs sm:text-sm font-bold text-slate-300 group-hover:text-white transition-colors">
                  {partner.name}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {partner.industry}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. PREMIUM SPONSORSHIP CTAS BANNER IN FROSTED GLASS */}
        <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-white/15 shadow-2xl relative overflow-hidden max-w-5xl mx-auto">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center lg:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2 block">
                {expoDetails.siteTexts?.sponsorsCtaBadge || "ELEVATE YOUR BRAND AUTHORITY"}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                {expoDetails.siteTexts?.sponsorsCtaHeading || expoDetails.siteTexts?.sponsorsCtaTitle || "Position Your Brand in Front of 5,000+ Key Decision Makers"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2">
                {expoDetails.siteTexts?.sponsorsCtaSubtitle || "Gain direct access to high-net-worth real estate buyers, state commissioners, major building contractors, and sovereign fund managers."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <button
                id="sponsor-section-become-sponsor-btn"
                onClick={() => onOpenRegister('sponsor')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold tracking-wider transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{expoDetails.siteTexts?.sponsorsCtaButton || "BECOME A SPONSOR"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="sponsor-section-partner-btn"
                onClick={() => onOpenRegister('partner')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-emerald-300 hover:text-white text-xs font-extrabold tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 backdrop-blur-md"
              >
                <span>{expoDetails.siteTexts?.sponsorsPartnerButton || "PARTNER WITH THE EXPO"}</span>
                <Handshake className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
