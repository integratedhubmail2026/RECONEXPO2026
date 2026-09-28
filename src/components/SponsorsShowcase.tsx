import React from 'react';
import { SPONSORS } from '../data/expoData';
import { ScrollReveal } from './ScrollReveal';
import { Award, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { useExpoData } from '../context/ExpoDataContext';

export const SponsorsShowcase: React.FC = () => {
  const { openModal, setSelectedTierForModal } = useExpoData();

  return (
    <section id="sponsors" className="py-20 relative bg-slate-950/40 border-t border-emerald-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Industry Leadership & Alliances</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Our Visionary Partners & Sponsors
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Backed by Nigeria's leading heavy manufacturing conglomerates, federal ministries, financial institutions, and professional architecture bodies.
            </p>
          </div>
        </ScrollReveal>

        {/* Sponsor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {SPONSORS.map((sponsor, idx) => (
            <ScrollReveal key={sponsor.id} direction="up" delay={0.1 * (idx + 1)}>
              <div className="bg-slate-900/70 border border-emerald-500/20 hover:border-emerald-500/50 rounded-2xl p-6 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/50 flex flex-col justify-between h-full group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase font-mono font-extrabold px-2.5 py-1 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
                      {sponsor.category}
                    </span>
                    {sponsor.boothNumber && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {sponsor.boothNumber}
                      </span>
                    )}
                  </div>

                  <div className="h-16 flex items-center mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-lg mr-3 shrink-0 shadow">
                      {sponsor.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-white font-extrabold text-base tracking-tight group-hover:text-emerald-300 transition-colors">
                        {sponsor.name}
                      </h3>
                      <p className="text-xs text-slate-400">Accredited Expo Partner</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {sponsor.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <a
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Visit Partner Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-slate-500 text-[11px]">Official Host</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Exhibitor / Sponsor Call to Action Banner */}
        <ScrollReveal direction="up" delay={0.4}>
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/40 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl text-center md:text-left">
              <span className="text-xs font-bold uppercase text-emerald-400 tracking-wider">Book Your Exhibition Presence</span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Showcase Your Brand to 8,500+ Qualified Buyers
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2">
                Secure your 3x3m Shell Scheme booth, 5 company staff badges, and VIP deal-room access.
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedTierForModal('exhibitor');
                openModal('registration');
              }}
              className="px-8 py-4 rounded-2xl bg-emerald-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-emerald-950/80 hover:bg-emerald-400 active:scale-95 transition-all shrink-0"
            >
              Book Exhibitor Stand (₦350,000)
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
