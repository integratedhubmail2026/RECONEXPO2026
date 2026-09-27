import React, { useState } from 'react';
import { useExpoData } from '../context/ExpoDataContext';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const { faqs, expoDetails } = useExpoData();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="relative py-20 bg-[#022c22]/40 border-t border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2 backdrop-blur-md">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            {expoDetails.siteTexts?.faqBadge || "DELEGATE & EXHIBITOR ESSENTIALS"}
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-display frosted-title-glow tracking-tight">
            {expoDetails.siteTexts?.faqHeading || "Frequently Asked Questions"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            {expoDetails.siteTexts?.faqSubtitle || "Key details on travel logistics, booth provisioning, and B2B investor meeting access."}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={item.id || idx}
                id={`faq-item-${idx + 1}`}
                className="rounded-2xl glass-panel border border-white/10 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-heading font-bold text-sm sm:text-base text-white hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-red-400 font-mono">0{idx + 1}.</span>
                    <span>{item.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/10 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
