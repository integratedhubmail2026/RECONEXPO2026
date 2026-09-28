import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, X, Sparkles, MapPin } from 'lucide-react';
import { useExpoData, isSeedOrDefaultAttendee } from '../context/ExpoDataContext';
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

function formatTimeAgo(registeredAt?: string): string {
  if (!registeredAt) return 'Just now';
  const now = Date.now();
  const registeredTime = new Date(registeredAt).getTime();
  if (isNaN(registeredTime)) return 'Just now';
  const diffSec = Math.max(0, Math.floor((now - registeredTime) / 1000));
  if (diffSec < 90) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return 'Recently';
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

export const LiveRegistrationNotification: React.FC = () => {
  const { attendees = [] } = useExpoData();
  const [activeNotification, setActiveNotification] = useState<LiveDelegateItem | null>(null);
  const [activeAvatar, setActiveAvatar] = useState<string>('');
  const [isDismissedByUser, setIsDismissedByUser] = useState(false);
  
  const currentIndexRef = useRef(0);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // STRICT FILTER: Only genuine, real manually registered attendees
  // All fake/curated dummy streams have been completely stopped and removed
  const realAttendees = useMemo(() => {
    return (attendees || []).filter(a => 
      a && 
      a.fullName && 
      a.ticketNumber && 
      !isSeedOrDefaultAttendee(a)
    );
  }, [attendees]);

  // Convert only real registered attendees into live notification stream items
  const activeStream = useMemo<LiveDelegateItem[]>(() => {
    return realAttendees.map(a => ({
      ticketNumber: a.ticketNumber,
      fullName: a.fullName,
      organization: a.organization || 'Registered Delegate',
      role: a.role || 'Executive',
      passType: a.passType || a.tier || 'attendee',
      city: a.city || 'Nigeria',
      photoUrl: a.photoUrl || a.avatarUrl,
      timeAgo: formatTimeAgo(a.registeredAt)
    }));
  }, [realAttendees]);

  // Function to show a specific attendee notification for 5.5 seconds then slide out
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

  // 1. Initial display and rotation ONLY if real manual registrations exist
  useEffect(() => {
    // If user manually dismissed or there are NO real manual registrations, show nothing
    if (isDismissedByUser || activeStream.length === 0) return;

    // Show latest real attendee after a short delay on page load
    const initialTimer = setTimeout(() => {
      if (activeStream.length > 0) {
        triggerNotification(activeStream[0]);
      }
    }, 3000);

    // If multiple real attendees exist, cycle calmly every 24 seconds
    let interval: NodeJS.Timeout | null = null;
    if (activeStream.length > 1) {
      interval = setInterval(() => {
        if (activeStream.length <= 1) return;
        currentIndexRef.current = (currentIndexRef.current + 1) % activeStream.length;
        const nextAttendee = activeStream[currentIndexRef.current];
        if (nextAttendee) {
          triggerNotification(nextAttendee);
        }
      }, 24000);
    }

    return () => {
      clearTimeout(initialTimer);
      if (interval) clearInterval(interval);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, [activeStream, isDismissedByUser]);

  // 2. Listen for INSTANT real-time manual registration event dispatched when a real user submits registration
  useEffect(() => {
    const handleNewRegistration = (e: CustomEvent) => {
      if (e.detail && !isSeedOrDefaultAttendee(e.detail)) {
        setIsDismissedByUser(false);
        const newItem: LiveDelegateItem = {
          ticketNumber: e.detail.ticketNumber || `RECON26-${Date.now()}`,
          fullName: e.detail.fullName,
          organization: e.detail.organization || 'VIP Delegate',
          role: e.detail.role || 'Industry Professional',
          passType: e.detail.passType || e.detail.tier || 'attendee',
          city: e.detail.city || 'Nigeria',
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

  // 3. Listen for cross-tab real manual registrations via BroadcastChannel
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel('recon_live_registration_channel');
        channel.onmessage = (event) => {
          if (event.data?.type === 'NEW_REGISTRATION' && event.data.attendee) {
            const att = event.data.attendee;
            if (!isSeedOrDefaultAttendee(att)) {
              setIsDismissedByUser(false);
              const newItem: LiveDelegateItem = {
                ticketNumber: att.ticketNumber || `RECON26-${Date.now()}`,
                fullName: att.fullName,
                organization: att.organization || 'Registered Delegate',
                role: att.role || 'Industry Professional',
                passType: att.passType || att.tier || 'attendee',
                city: att.city || 'Nigeria',
                photoUrl: att.photoUrl || att.avatarUrl,
                timeAgo: 'Just now'
              };
              triggerNotification(newItem);
            }
          }
        };
      }
    } catch {
      // safe
    }

    return () => {
      if (channel) {
        channel.close();
      }
    };
  }, []);

  const handleDismiss = () => {
    setActiveNotification(null);
    setIsDismissedByUser(true);
    // Pause auto-rotation for 60 seconds when dismissed
    setTimeout(() => {
      setIsDismissedByUser(false);
    }, 60000);
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
