import React, { useState } from 'react';
import { useExpoData } from '../context/ExpoDataContext';
import { Session } from '../types';
import { generateProgrammePdf } from '../utils/generateProgrammePdf';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  Building2, 
  TrendingUp, 
  Cpu, 
  Leaf, 
  Coins, 
  ShieldCheck, 
  HardHat, 
  Award, 
  Trophy,
  Users,
  Bookmark,
  BookmarkCheck,
  Share2,
  CalendarPlus,
  Filter,
  Download,
  FileText,
  CheckCircle2,
  Loader2
} from 'lucide-react';

interface ProgrammeSectionProps {
  onOpenRegister: (tier?: string) => void;
}

export const ProgrammeSection: React.FC<ProgrammeSectionProps> = ({ onOpenRegister }) => {
  const { sessions, expoDetails } = useExpoData();
  
  // Derive all available unique days up to configured totalEventDays or maximum session day
  const sessionDays = sessions.map(s => Number(s.day) || 1);
  const targetDaysCount = Math.max(expoDetails.totalEventDays || 2, ...sessionDays, 1);
  const daysList = Array.from({ length: targetDaysCount }, (_, i) => i + 1);

  const [activeDay, setActiveDay] = useState<number>(daysList[0] || 1);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [savedSessions, setSavedSessions] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  const currentActiveDay = daysList.includes(activeDay) ? activeDay : (daysList[0] || 1);

  const toggleSaveSession = (id: string) => {
    setSavedSessions(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      
      // If a custom PDF was uploaded in the admin dashboard, download it directly
      if (expoDetails.programmePdfUrl) {
        const link = document.createElement('a');
        link.href = expoDetails.programmePdfUrl;
        link.download = expoDetails.programmePdfName || 'RECON_Expo_2026_Full_Conference_Programme.pdf';
        if (!expoDetails.programmePdfUrl.startsWith('data:')) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Otherwise compile dynamically from the live session database
        await generateProgrammePdf({ sessions, expoDetails });
      }

      setPdfDownloaded(true);
      setTimeout(() => setPdfDownloaded(false), 4000);
    } catch (error) {
      console.error('Failed to download/generate PDF schedule:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const getSessionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2': return <Building2 className="w-4 h-4 text-[#22c55e]" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-[#ef4444]" />;
      case 'TrendingUp': return <TrendingUp className="w-4 h-4 text-[#22c55e]" />;
      case 'Users': return <Users className="w-4 h-4 text-[#38bdf8]" />;
      case 'Cpu': return <Cpu className="w-4 h-4 text-[#22c55e]" />;
      case 'Leaf': return <Leaf className="w-4 h-4 text-[#4ade80]" />;
      case 'Coins': return <Coins className="w-4 h-4 text-[#fbbf24]" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-[#22c55e]" />;
      case 'HardHat': return <HardHat className="w-4 h-4 text-[#f97316]" />;
      case 'Award': return <Award className="w-4 h-4 text-[#ef4444]" />;
      case 'Trophy': return <Trophy className="w-4 h-4 text-[#fbbf24]" />;
      default: return <Building2 className="w-4 h-4 text-[#22c55e]" />;
    }
  };

  // Filter sessions by Day and Category
  const daySessions = sessions.filter(s => s.day === currentActiveDay);
  const filteredSessions = activeCategory === 'All' 
    ? daySessions 
    : daySessions.filter(s => s.category.toLowerCase().includes(activeCategory.toLowerCase()));

  // Calendar Export helper
  const handleAddToCalendar = (session: Session) => {
    const title = encodeURIComponent(`RECON Expo 2026: ${session.title}`);
    const details = encodeURIComponent(`${session.description}\nSpeaker: ${session.speakerName}\nVenue: ${session.location}`);
    const location = encodeURIComponent(`Shehu Musa Yar'Adua Centre, Abuja - ${session.location}`);
    
    // Day dates mapping
    const datesMap: Record<number, { start: string, end: string }> = {
      1: { start: '20261029T090000Z', end: '20261029T170000Z' },
      2: { start: '20261030T090000Z', end: '20261030T210000Z' },
    };

    const d = datesMap[session.day];
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${d.start}/${d.end}`;
    window.open(googleCalUrl, '_blank');
  };

  return (
    <section id="programme" className="relative py-24 bg-[#022c22]/40 overflow-hidden frosted-dotted-pattern">
      {/* Glow Backdrops */}
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 backdrop-blur-md">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            {expoDetails.siteTexts?.programmeBadge || "COMPREHENSIVE EXPO AGENDA"}
          </div>
          <h2 
            id="programme-main-heading"
            className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-display frosted-title-glow mb-3 tracking-tight"
          >
            {expoDetails.siteTexts?.programmeHeading || "The Official Expo Programme"}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mb-6">
            {expoDetails.siteTexts?.programmeSubtitle || "From high-level policy summits to PropTech AI hackathons and private B2B deal rooms, explore an action-packed conference schedule at Shehu Musa Yar'Adua Centre."}
          </p>

          {/* Prominent PDF Download Button in Header */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              id="programme-download-pdf-top-btn"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs sm:text-sm font-extrabold shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed border border-emerald-300/40"
              title="Download official schedule as printable PDF"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-950" />
                  <span>Compiling PDF Schedule...</span>
                </>
              ) : pdfDownloaded ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                  <span>PDF Downloaded Successfully!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-emerald-950" />
                  <span>{expoDetails.siteTexts?.programmeDownloadBtn || "Download Full Conference Schedule (PDF)"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* DYNAMIC PROGRAMME TABS IN FROSTED GLASS */}
        <div className={`grid grid-cols-1 ${daysList.length === 2 ? 'sm:grid-cols-2' : daysList.length === 3 ? 'sm:grid-cols-3' : daysList.length >= 4 ? 'sm:grid-cols-2 md:grid-cols-4' : 'sm:grid-cols-1'} gap-3 sm:gap-4 max-w-5xl mx-auto mb-10 justify-center`}>
          {daysList.map((dayNum) => {
            const daySess = sessions.filter(s => s.day === dayNum);
            const sampleDate = daySess[0]?.date || `Day ${dayNum} Schedule`;
            const dayTitle = daySess[0]?.title || (dayNum === 1 ? 'Grand Opening, Keynotes & VIP Expo Tour' : dayNum === 2 ? 'Future of Construction, Pitch & Gala Awards' : `Special Agenda & Sessions for Day ${dayNum}`);
            const dayShort = sampleDate.includes('Monday') ? 'Mon' : sampleDate.includes('Tuesday') ? 'Tue' : sampleDate.includes('Wednesday') ? 'Wed' : sampleDate.includes('Thursday') ? 'Thu' : sampleDate.includes('Friday') ? 'Fri' : sampleDate.includes('Saturday') ? 'Sat' : sampleDate.includes('Sunday') ? 'Sun' : `Day ${dayNum}`;

            return (
              <button
                key={dayNum}
                id={`programme-tab-day-${dayNum}`}
                onClick={() => setActiveDay(dayNum)}
                className={`p-5 rounded-2xl transition-all duration-300 text-left border relative overflow-hidden cursor-pointer backdrop-blur-xl ${
                  currentActiveDay === dayNum
                    ? 'bg-white/15 border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.25)] scale-[1.02]'
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 opacity-80 hover:opacity-100'
                }`}
              >
                {currentActiveDay === dayNum && (
                  <span className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-400/20 to-transparent pointer-events-none" />
                )}
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-extrabold tracking-widest uppercase ${currentActiveDay === dayNum ? 'text-emerald-300' : 'text-slate-400'}`}>
                    DAY {dayNum}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white">
                    {dayShort}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-white font-heading truncate">
                  {sampleDate}
                </h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                  {dayTitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Category Filters Bar in Frosted Glass */}
        <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3 max-w-5xl mx-auto mb-8 glass-panel p-3 rounded-2xl">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold px-2">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span>Filter Tracks:</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {['All', 'Keynote', 'Panel Discussion', 'Workshop', 'Investor Pitch', 'Awards'].map((cat) => (
              <button
                key={cat}
                id={`filter-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-emerald-400 text-emerald-950 font-extrabold shadow-sm'
                    : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {savedSessions.length > 0 && (
              <div className="text-xs text-emerald-300 font-bold px-2">
                ★ {savedSessions.length} saved
              </div>
            )}

            <button
              id="programme-download-pdf-filter-btn"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-emerald-950 text-white text-xs font-bold transition-all border border-white/15 cursor-pointer disabled:opacity-50"
              title="Download Full Conference PDF Schedule"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : pdfDownloaded ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">PDF Schedule</span>
            </button>
          </div>
        </div>

        {/* TIMELINE SESSIONS LIST IN FROSTED GLASS */}
        <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
          {filteredSessions.map((session) => {
            const isSaved = savedSessions.includes(session.id);

            return (
              <div
                key={session.id}
                id={`session-card-${session.id}`}
                className={`glass-panel glass-panel-hover rounded-2xl p-5 sm:p-6 transition-all duration-300 border ${
                  session.featured
                    ? 'border-emerald-500/30 bg-white/8'
                    : 'border-white/10'
                } relative`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                  
                  {/* Left Column: Time & Category Badge */}
                  <div className="md:w-56 flex-shrink-0">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-emerald-300 mb-2 backdrop-blur-sm">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{session.time}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wide ${
                        session.category === 'Keynote' ? 'bg-red-600 text-white' :
                        session.category === 'Awards' ? 'bg-amber-400 text-black' :
                        session.category === 'Investor Pitch' ? 'bg-emerald-400 text-emerald-950' :
                        'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {session.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-3 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                      <span className="truncate">{session.location}</span>
                    </div>
                  </div>

                  {/* Middle Column: Topic & Description */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                        {getSessionIcon(session.iconName)}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white font-heading hover:text-emerald-300 transition-colors">
                        {session.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                      {session.description}
                    </p>

                    {/* Speaker Info Row */}
                    {session.speakerName && (
                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10 w-fit backdrop-blur-md">
                        {session.speakerImage && (
                          <img
                            src={session.speakerImage}
                            alt={session.speakerName}
                            className="w-9 h-9 rounded-full object-cover border border-emerald-500/40"
                          />
                        )}
                        <div>
                          <p className="text-xs font-bold text-white">
                            {session.speakerName}
                          </p>
                          <p className="text-[11px] text-emerald-300">
                            {session.speakerRole}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Actions (Save, Add to Calendar) */}
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-white/10">
                    <button
                      id={`session-save-btn-${session.id}`}
                      onClick={() => toggleSaveSession(session.id)}
                      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer ${
                        isSaved
                          ? 'bg-emerald-400 text-emerald-950 font-extrabold shadow-sm'
                          : 'bg-white/5 text-slate-300 hover:text-white border border-white/10 hover:bg-white/10'
                      }`}
                      title={isSaved ? 'Remove from My Agenda' : 'Bookmark Session'}
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Bookmark'}</span>
                    </button>

                    <button
                      id={`session-cal-btn-${session.id}`}
                      onClick={() => handleAddToCalendar(session)}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-white/5 text-emerald-300 hover:bg-white/10 hover:text-white border border-white/10 transition-all cursor-pointer backdrop-blur-sm"
                      title="Add to Google Calendar"
                    >
                      <CalendarPlus className="w-4 h-4 text-emerald-400" />
                      <span className="hidden sm:inline">Add to Cal</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Programme Banner CTA */}
        <div className="mt-14 max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl glass-panel border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div>
            <h4 className="text-xl font-extrabold text-white font-heading">
              Want Guaranteed Seating in All Keynote Masterclasses?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              VIP Delegate passes include reserved front-row auditorium seating and executive cocktail access.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto justify-end">
            <button
              id="programme-bottom-download-pdf-btn"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-full bg-white/10 hover:bg-emerald-500 hover:text-emerald-950 text-white text-xs font-extrabold tracking-wider transition-all border border-white/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : pdfDownloaded ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>DOWNLOAD PDF</span>
            </button>

            <button
              id="programme-bottom-register-btn"
              onClick={() => onOpenRegister('attendee')}
              className="flex-1 sm:flex-initial px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold tracking-wider transition-all shadow-lg shadow-red-900/40 cursor-pointer text-center"
            >
              CLAIM ATTENDEE PASS
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
