import React, { useState } from 'react';
import { FAQS } from '../data/expoData';
import { ScrollReveal } from './ScrollReveal';
import { HelpCircle, ChevronDown, MessageSquare } from 'lucide-react';
import { playSound } from '../utils/soundService';

export const FaqSection: React.FC = () => {
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQS[0]?.id || null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'General', 'Registration & Passes', 'Exhibition & Booths', 'Venue & Logistics'];

  const filteredFaqs = selectedCategory === 'All'
    ? FAQS
    : FAQS.filter(f => f.category === selectedCategory);

  const toggleFaq = (id: string) => {
    playSound('click');
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 relative bg-slate-950/60 border-t border-emerald-500/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Frequently Asked Questions</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Everything You Need to Know
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Find instant answers regarding trade visitor accreditation, VIP deal-room privileges, exhibition stands, and venue security.
            </p>
          </div>
        </ScrollReveal>

        {/* Category Filter */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  playSound('click');
                  setSelectedCategory(cat);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Accordion list */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openFaqId === faq.id;
            return (
              <ScrollReveal key={faq.id} direction="up" delay={0.05 * (idx + 1)}>
                <div
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-slate-900/90 border-emerald-500/50 shadow-lg shadow-emerald-950/40'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 select-none"
                  >
                    <span className="text-sm sm:text-base font-bold text-white tracking-tight">
                      {faq.question}
                    </span>
                    <div className={`p-1.5 rounded-lg bg-slate-800 text-emerald-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 bg-emerald-500 text-slate-950' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 mt-1">
                      {faq.answer}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
