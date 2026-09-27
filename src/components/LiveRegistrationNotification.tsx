import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, X } from 'lucide-react';
import { useExpoData } from '../context/ExpoDataContext';
import { AttendeeTicket } from '../types';
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

export const LiveRegistrationNotification: React.FC = () => {
  const { attendees = [] } = useExpoData();
  const [activeNotification, setActiveNotification] = useState<AttendeeTicket | null>(null);
  const [activeAvatar, setActiveAvatar] = useState<string>('');
  const [isDismissedByUser, setIsDismissedByUser] = useState(false);
  
  const currentIndexRef = useRef(0);
  const prevCountRef = useRef(attendees.length);

  // Function to show a specific attendee for 5.5 seconds then slide out
  const triggerNotification = (attendee: AttendeeTicket) => {
    if (!attendee) return;
    setActiveNotification(attendee);
    setActiveAvatar(getAttendeeProfilePhoto(attendee.photoUrl, attendee.avatarUrl, attendee.fullName));

    // Auto-hide after 5.5 seconds
    setTimeout(() => {
      setActiveNotification(null);
    }, 5500);
  };

  // 1. Listen for INSTANT real-time registration event dispatched when a user submits a registration
  useEffect(() => {
    const handleNewRegistration = (e: CustomEvent) => {
      if (e.detail) {
        setIsDismissedByUser(false);
        triggerNotification(e.detail);
      }
    };

    window.addEventListener('recon_new_live_registration', handleNewRegistration as EventListener);
    return () => {
      window.removeEventListener('recon_new_live_registration', handleNewRegistration as EventListener);
    };
  }, []);

  // 2. Watch for changes in attendees context array (real user registrations)
  useEffect(() => {
    if (attendees.length > prevCountRef.current) {
      const latestAttendee = attendees[0];
      if (latestAttendee) {
        setIsDismissedByUser(false);
        triggerNotification(latestAttendee);
      }
    }
    prevCountRef.current = attendees.length;
  }, [attendees]);

  // Periodic simulated / auto loop disabled completely per user specification.
  // Live registration popups only trigger when an actual user completes registration.

  const handleDismiss = () => {
    setActiveNotification(null);
    setIsDismissedByUser(true);
    // Pause auto-rotation for 90 seconds
    setTimeout(() => {
      setIsDismissedByUser(false);
    }, 90000);
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
              <img
                src={activeAvatar}
                alt={activeNotification.fullName}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400/70 shadow-md shadow-emerald-950/80 bg-slate-800"
              />
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
                  Live Registration
                </span>
                <span className="text-[10px] text-emerald-400/90 font-mono font-bold shrink-0">Just now</span>
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

              {/* Pass Tier Tag */}
              <div className="text-[10px] text-slate-400 mt-1 truncate flex items-center gap-1">
                <span className="text-emerald-400 font-extrabold uppercase text-[9px] tracking-wider">
                  {getPassLabel(activeNotification.passType || activeNotification.tier)}
                </span>
                {activeNotification.city && <span className="text-slate-500">• {activeNotification.city}</span>}
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
