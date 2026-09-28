import React, { useState } from 'react';
import { SCHEDULE } from '../data/expoData';
import { ScrollReveal } from './ScrollReveal';
import { Calendar, Clock, MapPin, Download, Tag, CheckCircle2 } from 'lucide-react';
import { generateAndDownloadProgrammePdf } from '../utils/generateProgrammePdf';
import { playSound } from '../utils/soundService';

export const ProgrammeSection: React.FC = () => {
  const [activeDay, setActiveDay] = useState<1 | 2>(1);
  const [selectedTrack, setSelectedTrack] = useState<string>('All');

  const tracks = ['All', 'Plenary', 'PropTech', 'Green Infrastructure', 'Investment', 'Masterclass'];

  const daySchedule = SCHEDULE.filter(s => s.day === activeDay);
  const filteredSchedule = selectedTrack === 'All'
    ? daySchedule
    : daySchedule.filter(s => s.track === selectedTrack);

  const handleDownloadPdf = () => {
    playSound('badge_print');
    generateAndDownloadProgrammePdf();
  };

  return (
    <section id="programme" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-3">
                <Calendar className="w-3.5 h-3.5" />
                <span>Executive Conference Agenda</span>
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Two Days of High-Impact Sessions
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl">
                Explore plenaries, live technology demonstrations, and closed-door deal rooms at Shehu Musa Yar'Adua Centre.
              </p>
            </div>

            {/* Download PDF button */}
            <button
              onClick={handleDownloadPdf}
              className="px-5 py-3 rounded-2xl bg-slate-900 border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 hover:text-white hover:bg-slate-800 text-xs font-bold transition-all shadow-lg flex items-center gap-2 self-start md:self-auto shrink-0"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download Printable Programme PDF</span>
            </button>
          </div>
        </ScrollReveal>

        {/* Day Selector Buttons */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-slate-950/80 p-2 rounded-2xl border border-emerald-500/20 backdrop-blur-md">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  playSound('click');
                  setActiveDay(1);
                }}
                className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
                  activeDay === 1
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-lg shadow-emerald-950/60'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>DAY 1 • Thursday, 29th Oct 2026</span>
              </button>

              <button
                onClick={() => {
                  playSound('click');
                  setActiveDay(2);
                }}
                className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
                  activeDay === 2
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-lg shadow-emerald-950/60'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>DAY 2 • Friday, 30th Oct 2026</span>
              </button>
            </div>

            {/* Track Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto justify-start sm:justify-end">
              {tracks.map(t => (
                <button
                  key={t}
                  onClick={() => {
                    playSound('click');
                    setSelectedTrack(t);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                    selectedTrack === t
                      ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Schedule Timeline Cards */}
        <div className="space-y-4">
          {filteredSchedule.map((item, idx) => (
            <ScrollReveal key={item.id} direction="up" delay={0.05 * (idx + 1)}>
              <div className="bg-slate-950/70 border border-emerald-500/20 hover:border-emerald-500/50 rounded-2xl p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.time}</span>
                    </span>

                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.track}
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{item.location}</span>
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed max-w-3xl">
                    {item.description}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2 self-start md:self-center">
                  <span className="text-[11px] font-bold text-emerald-400 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    Day {item.day} Confirmed
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
