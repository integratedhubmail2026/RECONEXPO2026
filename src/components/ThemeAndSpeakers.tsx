import React, { useState } from 'react';
import { SPEAKERS } from '../data/expoData';
import { Speaker } from '../types';
import { ScrollReveal } from './ScrollReveal';
import { Sparkles, Building2, Mic2, X, ExternalLink } from 'lucide-react';
import { playSound } from '../utils/soundService';

export const ThemeAndSpeakers: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSpeakerModal, setActiveSpeakerModal] = useState<Speaker | null>(null);

  const categories = ['All', 'Government', 'Keynote', 'PropTech', 'Finance', 'Architecture'];

  const filteredSpeakers = selectedCategory === 'All'
    ? SPEAKERS
    : SPEAKERS.filter(s => s.category === selectedCategory);

  const handleSpeakerClick = (speaker: Speaker) => {
    playSound('click');
    setActiveSpeakerModal(speaker);
  };

  return (
    <section id="speakers" className="py-20 relative bg-slate-950/60 border-t border-b border-emerald-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Mic2 className="w-3.5 h-3.5" />
              <span>Visionary Plenary Keynotes</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Distinguished Keynotes & Industry Titans
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Engage with federal ministers, sovereign real estate fund directors, BIM innovators, and Africa's foremost developers.
            </p>
          </div>
        </ScrollReveal>

        {/* Category Tabs */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  playSound('click');
                  setSelectedCategory(cat);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/60'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpeakers.map((speaker, index) => (
            <ScrollReveal key={speaker.id} direction="up" delay={0.1 * (index + 1)}>
              <div
                onClick={() => handleSpeakerClick(speaker)}
                className="bg-slate-900/80 border border-emerald-500/20 hover:border-emerald-500/60 rounded-2xl p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-950/60 cursor-pointer group flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shrink-0 group-hover:border-emerald-400 transition-colors shadow-md">
                      <img
                        src={speaker.photoUrl}
                        alt={speaker.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {speaker.category}
                      </span>
                      <h3 className="text-white font-extrabold text-base tracking-tight truncate group-hover:text-emerald-300 transition-colors mt-1">
                        {speaker.name}
                      </h3>
                      <p className="text-xs text-slate-300 font-medium truncate">{speaker.title}</p>
                    </div>
                  </div>

                  <p className="text-xs text-emerald-400/90 font-semibold mb-2 flex items-center gap-1 truncate">
                    <Building2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                    <span>{speaker.company}</span>
                  </p>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {speaker.bio}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px] truncate max-w-[200px]">
                    🎤 {speaker.sessions[0]}
                  </span>
                  <span className="text-emerald-400 font-bold text-[11px] group-hover:translate-x-0.5 transition-transform">
                    Bio →
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Speaker Bio Modal */}
      {activeSpeakerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setActiveSpeakerModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900 border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <img
                src={activeSpeakerModal.photoUrl}
                alt={activeSpeakerModal.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-lg"
              />
              <div>
                <span className="text-xs font-black uppercase text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {activeSpeakerModal.category}
                </span>
                <h3 className="text-xl font-black text-white mt-1">{activeSpeakerModal.name}</h3>
                <p className="text-xs text-slate-300 font-semibold">{activeSpeakerModal.title}</p>
                <p className="text-xs text-emerald-400">{activeSpeakerModal.company}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div>
                <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-1">Speaker Biography</h4>
                <p className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">{activeSpeakerModal.bio}</p>
              </div>

              <div>
                <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-1">Scheduled Keynote Session</h4>
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 text-emerald-300 font-medium">
                  {activeSpeakerModal.sessions.map((sess, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span>🎤</span>
                      <span>{sess}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveSpeakerModal(null)}
              className="mt-6 w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-emerald-400 transition-colors"
            >
              Close Speaker Profile
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
