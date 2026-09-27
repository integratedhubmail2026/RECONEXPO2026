import React, { useState } from 'react';
import { useExpoData } from '../context/ExpoDataContext';
import { Speaker } from '../types';
import { 
  Building, 
  TrendingUp, 
  Cpu, 
  Landmark, 
  Banknote, 
  Compass, 
  Linkedin, 
  Twitter, 
  ArrowUpRight, 
  CheckCircle2,
  X,
  Calendar,
  Layers,
  Award
} from 'lucide-react';

interface ThemeAndSpeakersProps {
  onOpenRegister: (tier?: string) => void;
}

export const ThemeAndSpeakers: React.FC<ThemeAndSpeakersProps> = ({ onOpenRegister }) => {
  const { speakers, sectors, expoDetails } = useExpoData();
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);

  // Icon mapper helper
  const getSectorIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-[#22c55e]" />;
      case 'Building': return <Building className="w-5 h-5 text-[#22c55e]" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-[#22c55e]" />;
      case 'Landmark': return <Landmark className="w-5 h-5 text-[#22c55e]" />;
      case 'Banknote': return <Banknote className="w-5 h-5 text-[#22c55e]" />;
      case 'Compass': return <Compass className="w-5 h-5 text-[#22c55e]" />;
      default: return <Building className="w-5 h-5 text-[#22c55e]" />;
    }
  };

  return (
    <section id="theme" className="relative py-20 bg-[#022c22]/50 overflow-hidden">
      {/* Background Neon Elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 1. THE 11 KEY STAKEHOLDER GROUPS / SECTOR PILLARS */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <span className="text-xs font-extrabold uppercase tracking-widest text-red-400">
              {expoDetails.siteTexts?.sectorsBadge || "WHO ATTENDS & COLLABORATES"}
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1 font-heading">
              {expoDetails.siteTexts?.sectorsHeading || "Uniting the Entire Real Estate, Infrastructure & PropTech Ecosystem"}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto justify-center">
            {sectors.map((sector, index) => (
              <div
                key={sector.id || sector.title}
                id={`sector-card-${index + 1}`}
                className="glass-panel glass-panel-hover p-6 rounded-2xl transition-all duration-300 border border-white/10 group"
              >
                <div className="flex items-center space-x-3.5 mb-3">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/15 group-hover:scale-110 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 transition-all duration-300 shadow-sm backdrop-blur-md">
                    {getSectorIcon(sector.icon)}
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white font-heading group-hover:text-emerald-300 transition-colors">
                    {sector.title}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {sector.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Stakeholders Pill Bar */}
          <div className="mt-8 p-4 rounded-2xl glass-panel flex flex-wrap items-center justify-center gap-2 text-xs text-slate-200">
            <span className="font-bold text-emerald-300 mr-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {expoDetails.siteTexts?.sectorsConveningBarTitle || "Convening:"}
            </span>
            {(expoDetails.siteTexts?.sectorsConveningPills 
              ? expoDetails.siteTexts.sectorsConveningPills.split(',').map(s => s.trim()).filter(Boolean)
              : [
                "Real Estate Investors",
                "Developers",
                "Construction Companies",
                "Government Officials",
                "Financial Institutions",
                "Architects & Engineers",
                "Property Professionals",
                "Tech Innovators",
                "Diaspora Buyers"
              ]
            ).map((item, pIdx) => (
              <span key={pIdx} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* 3. KEYNOTE SPEAKERS SHOWCASE */}
        <div id="speakers" className="pt-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-xs font-bold text-red-300 uppercase tracking-widest mb-3 backdrop-blur-md">
                <Award className="w-3.5 h-3.5 text-red-400" />
                {expoDetails.siteTexts?.speakersBadge || "GLOBAL & NATIONAL THOUGHT LEADERS"}
              </div>
              <h2 
                id="speakers-main-heading"
                className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-display frosted-title-glow tracking-tight"
              >
                {expoDetails.siteTexts?.speakersHeading || "Distinguished Keynote Speakers"}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl">
                {expoDetails.siteTexts?.speakersSubtitle || "Learn directly from the foremost authorities steering multi-billion naira infrastructure master plans, smart city financing, and disruptive construction technologies."}
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <button
                id="speakers-register-cta-btn"
                onClick={() => onOpenRegister('attendee')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-emerald-300 hover:text-white hover:bg-white/15 text-sm font-bold transition-all cursor-pointer backdrop-blur-md"
              >
                <span>{expoDetails.siteTexts?.speakersCtaButton || "Reserve Your Seat with Speakers"}</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>

          {/* 3 Premium Speaker Profile Cards in Frosted Glass */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto justify-center">
            {(speakers.filter(s => s.keynote).length > 0 ? speakers.filter(s => s.keynote) : speakers).map((speaker, idx) => (
              <div
                key={speaker.id}
                id={`speaker-card-${idx + 1}`}
                className="glass-panel glass-panel-hover rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 border border-white/10 hover:border-emerald-500/40 group relative overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-emerald-950/40"
              >
                {/* Top Corner Accent Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <span className="px-3.5 py-1 rounded-full bg-red-600 text-white text-[11px] font-black tracking-wider uppercase shadow-lg border border-red-400/40">
                    {speaker.keynote ? 'Keynote' : 'Speaker'}
                  </span>
                </div>

                <div>
                  {/* Premium Medium-Shot Speaker Image Frame */}
                  <div className="relative w-full h-72 sm:h-80 md:h-80 lg:h-96 rounded-2xl overflow-hidden mb-5 bg-[#011e15] border-2 border-emerald-500/30 group-hover:border-emerald-400/80 shadow-[0_0_25px_rgba(16,185,129,0.2)] group-hover:shadow-[0_0_35px_rgba(16,185,129,0.35)] transition-all duration-300">
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="w-full h-full object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#02180e]/80 via-transparent to-transparent pointer-events-none opacity-70 group-hover:opacity-40 transition-opacity" />
                  </div>

                  {/* Speaker Info */}
                  <div className="text-center mb-4">
                    <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 text-[11px] font-bold tracking-wide uppercase mb-2">
                      {speaker.track} Track
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white font-heading group-hover:text-emerald-300 transition-colors leading-snug">
                      {speaker.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-red-400 mt-1">
                      {speaker.title}
                    </p>
                    <p className="text-xs text-slate-300 font-semibold mt-0.5">
                      {speaker.organization}
                    </p>
                  </div>

                  {/* Keynote Topic Box */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 mb-4 text-left backdrop-blur-md">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 mb-1">
                      Keynote Topic:
                    </p>
                    <p className="text-xs sm:text-sm text-slate-200 font-medium line-clamp-2 italic leading-relaxed">
                      "{speaker.topic}"
                    </p>
                  </div>

                  {/* Short Bio */}
                  <p className="text-xs text-slate-300 line-clamp-3 mb-6 text-center leading-relaxed">
                    {speaker.bio}
                  </p>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {speaker.linkedin && (
                      <a
                        id={`speaker-linkedin-${idx + 1}`}
                        href={speaker.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-white/5 text-slate-300 hover:text-emerald-400 hover:bg-white/15 transition-colors border border-white/10"
                        aria-label={`${speaker.name} LinkedIn`}
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {speaker.twitter && (
                      <a
                        id={`speaker-twitter-${idx + 1}`}
                        href={speaker.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-white/5 text-slate-300 hover:text-emerald-400 hover:bg-white/15 transition-colors border border-white/10"
                        aria-label={`${speaker.name} Twitter`}
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <button
                    id={`speaker-view-bio-${idx + 1}`}
                    onClick={() => setSelectedSpeaker(speaker)}
                    className="text-xs font-black text-emerald-300 hover:text-white flex items-center gap-1.5 group/btn cursor-pointer py-2 px-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all"
                  >
                    <span>Full Profile & Bio</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Secondary Featured Panelists Grid in Frosted Glass */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl glass-panel">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-2">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{expoDetails.siteTexts?.panelistsBadge || "INDUSTRY LEADERS & PANEL DIRECTORS"}</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-white font-heading">
                  {expoDetails.siteTexts?.panelistsHeading || "Additional Esteemed Industry Panelists & Chairs"}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {expoDetails.siteTexts?.panelistsSubtitle || "Over 45+ accredited architects, real estate lawyers, bankers, and PropTech innovators on stage."}
                </p>
              </div>
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20 self-start sm:self-auto">
                {expoDetails.siteTexts?.panelistsGuideBadge || "Full 45+ Lineup In Official Guide"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {speakers.filter(s => !s.keynote).map((spk, i) => (
                <div 
                  key={spk.id}
                  id={`panelist-item-${i + 1}`}
                  onClick={() => setSelectedSpeaker(spk)}
                  className="rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-white/10 transition-all duration-300 flex flex-col cursor-pointer group backdrop-blur-md shadow-xl hover:shadow-2xl hover:shadow-emerald-950/50 overflow-hidden"
                >
                  {/* Full High-Resolution Medium-Shot Photo Frame */}
                  <div className="relative w-full h-72 sm:h-80 md:h-80 lg:h-88 bg-[#011e15] overflow-hidden border-b border-white/10">
                    <img
                      src={spk.image}
                      alt={spk.name}
                      className="w-full h-full object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#02180e]/90 via-transparent to-transparent pointer-events-none opacity-70 group-hover:opacity-40 transition-opacity" />
                  </div>

                  {/* Card Content Beneath the Image */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-[10px] font-bold uppercase tracking-wider">
                          Panel Chair
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                          {spk.track}
                        </span>
                      </div>

                      <h5 className="text-lg sm:text-xl font-black text-white group-hover:text-emerald-300 transition-colors leading-snug">
                        {spk.name}
                      </h5>

                      <p className="text-xs sm:text-sm font-semibold text-emerald-300/90 leading-relaxed">
                        {spk.title}
                      </p>

                      <p className="text-xs text-slate-300 font-medium">
                        {spk.organization}
                      </p>

                      {spk.topic && (
                        <div className="p-3 rounded-xl bg-black/40 border border-white/5 mt-3">
                          <p className="text-[10px] uppercase font-extrabold text-emerald-400/90 tracking-wider mb-1">
                            Discussion Focus:
                          </p>
                          <p className="text-xs text-slate-200 line-clamp-2 italic">
                            "{spk.topic}"
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-emerald-400 font-bold group-hover:text-white transition-colors">
                      <span>View Full Profile & Session</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* SPEAKER DETAILS MODAL IN FROSTED GLASS */}
      {selectedSpeaker && (
        <div 
          id="speaker-bio-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-2xl bg-[#022c22]/95 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-left backdrop-blur-2xl">
            {/* Top Close Button */}
            <button
              id="speaker-modal-close-btn"
              onClick={() => setSelectedSpeaker(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-red-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-6">
              <div className="w-32 h-44 sm:w-40 sm:h-52 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl bg-[#011e15] shrink-0 relative">
                <img
                  src={selectedSpeaker.image}
                  alt={selectedSpeaker.name}
                  className="w-full h-full object-cover object-[center_20%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#02180e]/60 via-transparent to-transparent pointer-events-none" />
              </div>
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                  {selectedSpeaker.track} Track • {selectedSpeaker.keynote ? 'Keynote' : 'Panel Chair'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                  {selectedSpeaker.name}
                </h3>
                <p className="text-sm font-bold text-red-400">
                  {selectedSpeaker.title}
                </p>
                <p className="text-xs text-slate-300 font-medium">
                  {selectedSpeaker.organization}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-5 backdrop-blur-md">
              <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 mb-1">
                Featured Presentation Topic:
              </p>
              <p className="text-sm text-white font-semibold">
                "{selectedSpeaker.topic}"
              </p>
            </div>

            <div className="mb-6 max-h-48 overflow-y-auto pr-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p className="font-bold text-white mb-1">Biography & Executive Background:</p>
              <p>{selectedSpeaker.fullBio}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-xs text-slate-400">
                Session at Shehu Musa Yar'Adua Centre
              </span>
              <button
                id="speaker-modal-book-pass-btn"
                onClick={() => {
                  setSelectedSpeaker(null);
                  onOpenRegister('attendee');
                }}
                className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold tracking-wider transition-all shadow-lg cursor-pointer"
              >
                BOOK ATTENDEE PASS
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
