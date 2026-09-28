import React from 'react';
import { TICKET_TIERS } from '../data/expoData';
import { useExpoData } from '../context/ExpoDataContext';
import { PassTier } from '../types';
import { ScrollReveal } from './ScrollReveal';
import { Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const RegistrationSection: React.FC = () => {
  const { openModal, setSelectedTierForModal } = useExpoData();

  const handleSelectTier = (tierId: PassTier) => {
    setSelectedTierForModal(tierId);
    openModal('registration');
  };

  return (
    <section id="passes" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official Passes & Accreditation</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Select Your Accreditation Tier
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Join thousands of architects, developers, policy leaders, and contractors. Free trade passes and exclusive VIP privileges available.
            </p>
          </div>
        </ScrollReveal>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {TICKET_TIERS.map((tier, idx) => (
            <ScrollReveal key={tier.id} direction="up" delay={0.1 * (idx + 1)}>
              <div
                className={`relative rounded-3xl p-8 flex flex-col justify-between h-full transition-all duration-300 ${
                  tier.highlighted
                    ? 'bg-gradient-to-b from-slate-900 via-slate-950 to-emerald-950/40 border-2 border-amber-400/80 shadow-2xl shadow-emerald-950/80 scale-105 z-10'
                    : 'bg-slate-950/80 border border-emerald-500/20 hover:border-emerald-500/40 backdrop-blur-xl'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Most Popular VIP Pass</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${tier.badgeColor}`}>
                      {tier.badgeTag}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
                    {tier.name}
                  </h3>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                      {tier.priceNgn === 0 ? 'FREE' : `₦${tier.priceNgn.toLocaleString()}`}
                    </span>
                    {tier.priceUsd > 0 && (
                      <span className="text-xs text-slate-400 font-semibold">
                        (~${tier.priceUsd} USD)
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                    {tier.description}
                  </p>

                  <div className="space-y-3 mb-8 pt-4 border-t border-slate-800">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Included Privileges:
                    </p>
                    {tier.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleSelectTier(tier.id)}
                  className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg ${
                    tier.highlighted
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:brightness-110 shadow-amber-950/40'
                      : tier.id === 'visitor'
                      ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-950/40'
                      : 'bg-purple-600 text-white hover:bg-purple-500 shadow-purple-950/40'
                  }`}
                >
                  <span>{tier.priceNgn === 0 ? 'Register Free Pass' : `Secure ${tier.name}`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
