import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { Attendee } from '../types';
import { Download, Printer, ShieldCheck, Sparkles, Building2, MapPin, QrCode } from 'lucide-react';
import { playSound } from '../utils/soundService';
import { getInitials, getAvatarGradient } from '../utils/avatarUtils';

interface SmartIdCardProps {
  attendee: Attendee;
  onClose?: () => void;
}

export const SmartIdCard: React.FC<SmartIdCardProps> = ({ attendee, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    QRCode.toDataURL(
      JSON.stringify({
        t: attendee.ticketNumber,
        n: attendee.fullName,
        p: attendee.passType,
        o: attendee.organization,
        c: attendee.city,
        r: attendee.registeredAt
      }),
      {
        width: 320,
        margin: 1,
        color: {
          dark: '#022c22',
          light: '#ffffff'
        }
      }
    )
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR code error:', err));
  }, [attendee]);

  const handlePrint = () => {
    playSound('badge_print');
    window.print();
  };

  const passBadgeDetails = {
    visitor: { label: 'TRADE VISITOR', color: 'from-emerald-600 to-teal-800', textColor: 'text-emerald-300', tag: 'ACCESS: ALL EXHIBITION HALLS' },
    elite: { label: 'ELITE VIP DELEGATE', color: 'from-amber-500 via-amber-600 to-amber-900', textColor: 'text-amber-300', tag: 'FAST-TRACK • VIP DEAL-ROOM • LUNCHEON' },
    exhibitor: { label: 'OFFICIAL EXHIBITOR', color: 'from-purple-600 to-indigo-900', textColor: 'text-purple-300', tag: 'ALL-ACCESS • BOOTH & PRESS ARENA' }
  }[attendee.passType || 'visitor'];

  return (
    <div className="flex flex-col items-center">
      {/* Lanyard Strap Visual */}
      <div className="flex flex-col items-center mb-1 select-none">
        <div className="w-10 h-3 bg-slate-700 rounded-t-md border border-slate-600 shadow" />
        <div className="w-6 h-5 bg-gradient-to-b from-slate-400 to-slate-600 rounded-b-md shadow-md flex items-center justify-center">
          <div className="w-3 h-1 bg-slate-900 rounded-full" />
        </div>
      </div>

      {/* Vertical ID Badge Canvas */}
      <div
        ref={cardRef}
        onClick={() => setFlipped(!flipped)}
        className="w-[300px] sm:w-[330px] h-[500px] rounded-3xl bg-slate-950 border-2 border-emerald-500/50 shadow-2xl shadow-emerald-950/90 relative overflow-hidden flex flex-col justify-between p-5 text-white cursor-pointer select-none group transform transition-all duration-300 hover:scale-[1.02]"
      >
        {/* Holographic Security Overlay Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)] bg-[size:12px_12px] opacity-70 pointer-events-none" />
        <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-amber-400/15 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-black text-xs">
                R
              </div>
              <div>
                <h4 className="text-xs font-black tracking-wider text-white">RECON EXPO 2026</h4>
                <p className="text-[9px] text-emerald-400 font-medium">8th Real Estate & Construction</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-emerald-500/30 text-emerald-300 font-bold">
                {attendee.ticketNumber}
              </span>
            </div>
          </div>

          {/* Pass Tier Banner */}
          <div className={`w-full py-1.5 px-3 rounded-xl bg-gradient-to-r ${passBadgeDetails.color} shadow-lg text-center flex items-center justify-center gap-1.5`}>
            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
            <span className="text-xs font-black tracking-widest text-white uppercase drop-shadow">
              {passBadgeDetails.label}
            </span>
          </div>
        </div>

        {/* Center: Attendee Photo & Info */}
        <div className="relative z-10 flex flex-col items-center text-center my-auto">
          <div className="relative mb-3">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-emerald-400/60 shadow-xl bg-slate-900 flex items-center justify-center relative">
              {attendee.photoUrl ? (
                <img src={attendee.photoUrl} alt={attendee.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${getAvatarGradient(attendee.fullName)} flex items-center justify-center text-white font-black text-2xl`}>
                  {getInitials(attendee.fullName)}
                </div>
              )}
            </div>
            {/* Hologram Badge Seal */}
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 px-1.5 py-0.5 rounded-full text-[9px] font-black border-2 border-slate-950 flex items-center gap-1 shadow-md">
              <ShieldCheck className="w-3 h-3" />
              <span>ACCREDITED</span>
            </div>
          </div>

          <h3 className="text-lg font-black text-white tracking-tight leading-tight max-w-[260px] truncate">
            {attendee.fullName}
          </h3>
          <p className="text-xs text-emerald-400 font-semibold mt-0.5 flex items-center gap-1 justify-center">
            <span>{attendee.role || 'Official Delegate'}</span>
          </p>
          <p className="text-[11px] text-slate-300 font-medium truncate max-w-[240px] mt-0.5 flex items-center gap-1 justify-center">
            <Building2 className="w-3 h-3 text-slate-400" />
            <span>{attendee.organization || 'Independent Professional'}</span>
          </p>
        </div>

        {/* Bottom: Crisp QR Code & Venue Metadata */}
        <div className="relative z-10 pt-2 border-t border-emerald-500/20 flex items-center justify-between gap-3">
          <div className="flex-1 text-left">
            <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Venue</p>
            <p className="text-[10px] text-white font-bold truncate">Shehu Musa Yar'Adua Centre</p>
            <p className="text-[9px] text-emerald-400">Abuja • 29-30 Oct 2026</p>
            <p className="text-[8px] text-slate-400 mt-1">{passBadgeDetails.tag}</p>
          </div>

          <div className="w-20 h-20 bg-white rounded-xl p-1 shadow-lg flex items-center justify-center shrink-0">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Gate Pass QR" className="w-full h-full object-contain" />
            ) : (
              <QrCode className="w-12 h-12 text-slate-900" />
            )}
          </div>
        </div>

        {/* Hover Hint */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[8px] text-slate-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          Click to Flip Badge
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/60 hover:bg-emerald-400 transition-all flex items-center gap-2"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Pass</span>
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700 transition-all"
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
};
