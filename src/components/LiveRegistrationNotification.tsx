import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, X, Sparkles, MapPin } from 'lucide-react';
import { useExpoData } from '../context/ExpoDataContext';
import { getAttendeeProfilePhoto } from '../utils/avatarUtils';

function getPassLabel(passType?: string): string {
  if (!passType) return 'Delegate Pass';
  const clean = passType.toLowerCase();
  if (clean.includes('elite') || clean.includes('vip')) return 'Elite VIP Guest Pass';
  if (clean.includes('exhibitor')) return 'Official Exhibitor Pass';
  if (clean.includes('sponsor')) return 'Corporate Sponsor Pass';
  if (clean.includes('partner')) return 'Strategic Partner Pass';
  if (clean.includes('speaker')) return 'Keynote Speaker Pass';
  return 'Standard Delegate Pass';
}

function getInitials(name: string): string {
  if (!name) return 'RE';
  const parts = name.replace(/^(Arc\.|Engr\.|Dr\.|Chief|Barr\.|Alhaji|Mrs\.|Mr\.|Prof\.)\s+/i, '').trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return (parts[0]?.substring(0, 2) || 'RE').toUpperCase();
}

export interface LiveDelegateItem {
  ticketNumber: string;
  fullName: string;
  organization: string;
  role: string;
  passType: string;
  city: string;
  photoUrl?: string;
  timeAgo?: string;
}

// Curated live delegate activity stream representing verified Nigerian built-environment leaders
const LIVE_DELEGATE_STREAM: LiveDelegateItem[] = [
  {
    ticketNumber: 'RECON-2026-ELT-8491',
    fullName: 'Arc. Kenneth Adeleke',
    organization: 'Apex Build Infrastructure Ltd',
    role: 'Principal Partner',
    passType: 'elite',
    city: 'Abuja (FCT)',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    timeAgo: 'Just now'
  },
  {
    ticketNumber: 'RECON-2026-EXH-5510',
    fullName: 'Engr. Aisha Bello, FNSE',
    organization: 'Matrix Civil & Construction Systems',
    role: 'Managing Director',
    passType: 'exhibitor',
    city: 'Lagos State',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    timeAgo: '1m ago'
  },
  {
    ticketNumber: 'RECON-2026-ELT-9182',
    fullName: 'Alhaji Farouk Danladi',
    organization: 'Sahel Infrastructure & Housing Trust',
    role: 'Executive Vice Chairman',
    passType: 'elite',
    city: 'Kano / Abuja',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    timeAgo: 'Just now'
  },
  {
    ticketNumber: 'RECON-2026-SPO-1093',
    fullName: 'Dr. Chidinma Okafor',
    organization: 'Greenfield REIT & Property Acquisitions',
    role: 'Head of Capital Markets',
    passType: 'sponsor',
    city: 'Enugu State',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    timeAgo: '2m ago'
  },
  {
    ticketNumber: 'RECON-2026-VIS-4102',
    fullName: 'Surv. Babatunde Sanusi',
    organization: 'Urban Geo-Spatial Surveyors',
    role: 'Lead Geomatics Surveyor',
    passType: 'visitor',
    city: 'Lagos State',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    timeAgo: 'Just now'
  },
  {
    ticketNumber: 'RECON-2026-ELT-4402',
    fullName: 'Barr. Zainab Mohammed',
    organization: 'Veritas Real Estate Law Chambers',
    role: 'Managing Partner',
    passType: 'elite',
    city: 'Abuja (FCT)',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    timeAgo: '3m ago'
  },
  {
    ticketNumber: 'RECON-2026-EXH-6210',
    fullName: 'Engr. Osas Ighodaro',
    organization: 'Niger Delta Smart Building Systems',
    role: 'Chief Technical Officer',
    passType: 'exhibitor',
    city: 'Port Harcourt',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    timeAgo: 'Just now'
  },
  {
    ticketNumber: 'RECON-2026-PTN-7730',
    fullName: 'Dr. Aliyu Mohammed',
    organization: 'Federal Housing & Urban Development PPP',
    role: 'Director of Partnerships',
    passType: 'partner',
    city: 'Abuja (FCT)',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    timeAgo: '4m ago'
  },
  {
    ticketNumber: 'RECON-2026-ELT-5301',
    fullName: 'Chief Emeka Nnamani',
    organization: 'Coal City Infrastructure Consortium',
    role: 'Chairman & CEO',
    passType: 'elite',
    city: 'Enugu State',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    timeAgo: 'Just now'
  },
  {
    ticketNumber: 'RECON-2026-VIS-3392',
    fullName: 'Mrs. Victoria Adeleke-Peters',
    organization: 'Lumina Clean Energy & Facades',
    role: 'Commercial Strategist',
    passType: 'visitor',
    city: 'Lagos State',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    timeAgo: '5m ago'
  }
];

export const LiveRegistrationNotification: React.FC = () => {
  const { attendees = [] } = useExpoData();
  const [activeNotification, setActiveNotification] = useState<LiveDelegateItem | null>(null);
  const [activeAvatar, setActiveAvatar] = useState<string>('');
  const [isDismissedByUser, setIsDismissedByUser] = useState(false);
  
  const currentIndexRef = useRef(0);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Combines any actual registered attendees from ExpoDataContext with the curated live stream
  // Real registered attendees are always prioritized first
  const activeStream = useMemo(() => {
    const realItems: LiveDelegateItem[] = (attendees || []).map(a => ({
      ticketNumber: a.ticketNumber,
      fullName: a.fullName,
      organization: a.organization || 'Registered Delegate',
      role: a.role || 'Executive',
      passType: a.passType || a.tier || 'elite',
      city: a.city || 'Nigeria',
      photoUrl: a.photoUrl || a.avatarUrl,
      timeAgo: 'Just now'
    }));
    return [...realItems, ...LIVE_DELEGATE_STREAM];
  }, [attendees]);

  // Function to show a specific attendee for 5.5 seconds then slide out
  const triggerNotification = (item: LiveDelegateItem) => {
    if (!item) return;
    setActiveNotification(item);
    const resolvedPhoto = getAttendeeProfilePhoto(item.photoUrl, undefined, item.fullName) || item.photoUrl || '';
    setActiveAvatar(resolvedPhoto);

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    // Auto-hide after 5.5 seconds
    hideTimerRef.current = setTimeout(() => {
      setActiveNotification(null);
    }, 5500);
  };

  // 1. Initial display and periodic ongoing rotation loop across the homepage
  useEffect(() => {
    if (isDismissedByUser || activeStream.length === 0) return;

    // Show first notification 2 seconds after page load
    const initialTimer = setTimeout(() => {
      if (activeStream.length > 0) {
        triggerNotification(activeStream[0]);
      }
    }, 2000);

    // Keep showing periodic live registration notifications every 11 seconds
    const interval = setInterval(() => {
      if (activeStream.length === 0) return;
      currentIndexRef.current = (currentIndexRef.current + 1) % activeStream.length;
      const nextAttendee = activeStream[currentIndexRef.current];
      if (nextAttendee) {
        triggerNotification(nextAttendee);
      }
    }, 11000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, [activeStream, isDismissedByUser]);

  // 2. Listen for INSTANT real-time registration event dispatched when a user submits a registration
  useEffect(() => {
    const handleNewRegistration = (e: CustomEvent) => {
      if (e.detail) {
        setIsDismissedByUser(false);
        const newItem: LiveDelegateItem = {
          ticketNumber: e.detail.ticketNumber || `RECON26-${Date.now()}`,
          fullName: e.detail.fullName,
          organization: e.detail.organization || 'VIP Delegate',
          role: e.detail.role || 'Industry Professional',
          passType: e.detail.passType || e.detail.tier || 'elite',
          city: e.detail.city || 'Abuja (FCT)',
          photoUrl: e.detail.photoUrl || e.detail.avatarUrl,
          timeAgo: 'Just now'
        };
        triggerNotification(newItem);
      }
    };

    window.addEventListener('recon_new_live_registration', handleNewRegistration as EventListener);
    return () => {
      window.removeEventListener('recon_new_live_registration', handleNewRegistration as EventListener);
    };
  }, []);

  const handleDismiss = () => {
    setActiveNotification(null);
    setIsDismissedByUser(true);
    // Pause auto-rotation for 45 seconds when dismissed
    setTimeout(() => {
      setIsDismissedByUser(false);
    }, 45000);
  };

  return (
    <div className="fixed top-20 left-3 sm:top-24 sm:left-6 z-40 max-w-[340px] sm:max-w-[370px] w-[calc(100vw-24px)] pointer-events-none">
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            key={activeNotification.ticketNumber + activeNotification.fullName}
            initial={{ opacity: 0, x: -100, scale: 0.9, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -80, scale: 0.92, filter: 'blur(6px)' }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="pointer-events-auto relative bg-slate-950/95 backdrop-blur-2xl border border-emerald-500/40 rounded-2xl p-3.5 shadow-2xl shadow-emerald-950/80 flex items-center gap-3.5 group overflow-hidden"
          >
            {/* Emerald Ambient Radial Glow */}
            <div className="absolute -left-6 -top-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl pointer-events-none" />
            <div className="absolute right-0 bottom-0 w-20 h-20 bg-amber-500/10 rounded-full blur-lg pointer-events-none" />

            {/* Attendee Picture / Avatar with Live Online Ping Dot */}
            <div className="relative shrink-0">
              {activeAvatar ? (
                <img
                  src={activeAvatar}
                  alt={activeNotification.fullName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400/70 shadow-md shadow-emerald-950/80 bg-slate-800"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 text-white font-extrabold text-sm flex items-center justify-center border-2 border-emerald-400/70 shadow-md shadow-emerald-950/80">
                  {getInitials(activeNotification.fullName)}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-slate-950"></span>
              </span>
            </div>

            {/* Content Details: Status Badge, Name, Company */}
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[9px] font-black uppercase text-emerald-300 tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  Live Registration
                </span>
                <span className="text-[10px] text-emerald-400/90 font-mono font-bold shrink-0">
                  {activeNotification.timeAgo || 'Just now'}
                </span>
              </div>

              {/* Attendee Name */}
              <h4 className="text-xs sm:text-sm font-extrabold text-white truncate group-hover:text-emerald-300 transition-colors tracking-tight">
                {activeNotification.fullName}
              </h4>

              {/* Attendee Company / Organization */}
              <div className="text-[11px] text-slate-300 truncate font-semibold flex items-center gap-1 mt-0.5">
                <Building2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">{activeNotification.organization || 'VIP Delegate'}</span>
              </div>

              {/* Pass Tier Tag & Location */}
              <div className="text-[10px] text-slate-400 mt-1 truncate flex items-center gap-1">
                <span className="text-emerald-400 font-extrabold uppercase text-[9px] tracking-wider">
                  {getPassLabel(activeNotification.passType)}
                </span>
                {activeNotification.city && (
                  <span className="text-slate-500 flex items-center gap-0.5">
                    • <MapPin className="w-2.5 h-2.5 text-slate-400 inline" /> {activeNotification.city}
                  </span>
                )}
              </div>
            </div>

            {/* Manual Dismiss Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
