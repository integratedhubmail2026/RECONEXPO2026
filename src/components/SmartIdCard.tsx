import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { ReconLogo } from './ReconLogo';
import { AttendeeTicket, CompanyStaffBadge } from '../types';
import { useExpoData } from '../context/ExpoDataContext';
import { getAttendeeProfilePhoto } from '../utils/avatarUtils';
import { 
  QrCode, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Download, 
  Printer, 
  RotateCw, 
  Sparkles, 
  Crown, 
  Building, 
  User, 
  CheckCircle2,
  ExternalLink,
  Wifi,
  AlertCircle,
  Lock,
  Shield,
  Store,
  Handshake,
  Camera,
  Building2,
  Zap,
  Award,
  FileText,
  X
} from 'lucide-react';

interface SmartIdCardProps {
  ticket: AttendeeTicket;
  activeStaffBadge?: CompanyStaffBadge;
  onDownload?: () => void;
  showActions?: boolean;
  isAdmin?: boolean;
}

export const SmartIdCard: React.FC<SmartIdCardProps> = ({ 
  ticket, 
  activeStaffBadge,
  onDownload,
  showActions = true,
  isAdmin
}) => {
  const { expoDetails, adminAuth } = useExpoData();
  const effectiveIsAdmin = isAdmin !== undefined ? isAdmin : (adminAuth?.isAuthenticated || false);

  const [isFlipped, setIsFlipped] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadModalData, setDownloadModalData] = useState<{
    dataUrl: string;
    blobUrl: string;
    filename: string;
    sideLabel: string;
  } | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const cardFrontRef = useRef<HTMLDivElement>(null);
  const cardBackRef = useRef<HTMLDivElement>(null);
  const exportFrontRef = useRef<HTMLDivElement>(null);
  const exportBackRef = useRef<HTMLDivElement>(null);

  const displayName = activeStaffBadge ? activeStaffBadge.fullName : ticket.fullName;
  const displayRole = activeStaffBadge ? activeStaffBadge.role : ticket.role;
  const displayPhoto = activeStaffBadge?.photoUrl || getAttendeeProfilePhoto(ticket.photoUrl, ticket.avatarUrl, displayName);
  const displayBadgeNumber = activeStaffBadge ? activeStaffBadge.badgeNumber : ticket.ticketNumber;

  const isElite = ticket.passType === 'elite' || ticket.tier.toLowerCase().includes('elite');
  const isVisitor = ticket.passType === 'visitor' || ticket.tier.toLowerCase().includes('visitor') || ticket.tier.toLowerCase().includes('free') || ticket.amountPaid === '₦0' || ticket.amountPaid === 'Free' || ticket.amountPaid === '$0';
  const isExhibitor = ticket.passType === 'exhibitor' || ticket.tier.toLowerCase().includes('exhibitor');
  const isSponsor = ticket.passType === 'sponsor' || ticket.tier.toLowerCase().includes('sponsor');
  const isPartner = ticket.passType === 'partner' || ticket.tier.toLowerCase().includes('partner');

  const isApproved = isVisitor || ticket.adminApproved === true || ticket.adminApprovalStatus === 'APPROVED';

  // Only Visitor passes can be downloaded by standard attendees. All other pass tiers are restricted to Admin download.
  const isRestrictedTier = !isVisitor;
  const canDownload = effectiveIsAdmin || isVisitor;

  const isPress = ticket.passType === 'press' || ticket.tier.toLowerCase().includes('press') || ticket.tier.toLowerCase().includes('media');
  const isOfficial = ticket.passType === 'official' || ticket.tier.toLowerCase().includes('official') || ticket.tier.toLowerCase().includes('organizer') || ticket.tier.toLowerCase().includes('secretariat');
  const isSecurity = ticket.passType === 'security' || ticket.tier.toLowerCase().includes('security') || ticket.tier.toLowerCase().includes('police') || ticket.tier.toLowerCase().includes('law');
  const isCrew = ticket.passType === 'crew' || ticket.tier.toLowerCase().includes('crew') || ticket.tier.toLowerCase().includes('tech');
  const isMedical = ticket.passType === 'medical' || ticket.tier.toLowerCase().includes('medical') || ticket.tier.toLowerCase().includes('emergency');

  // Synthetic security hash and barcode numbers
  const barcodeNumber = ticket.barcode || displayBadgeNumber.replace(/[^0-9A-Z]/g, '');
  const securityHash = `SHA256-${displayBadgeNumber.slice(-4)}${displayName.slice(0, 2).toUpperCase()}-2026-FCT`;

  // Capture exact rendered HTML card as ultra-high-definition PNG image
  const handleDownloadImage = async () => {
    if (!isApproved) {
      alert('❌ Smart ID Card Download Locked!\n\nAdmin payment approval is required before you can download your Smart ID Card. Once the RECON Secretariat approves your payment, downloading will unlock automatically.');
      return;
    }

    if (isRestrictedTier && !effectiveIsAdmin) {
      alert('🔒 Official ID Card Download Restricted to Admin!\n\nOnly the RECON Expo Secretariat Admin can download and print official ID cards for Elite VIP Guests, Exhibitors, Sponsors, and Partners.\n\nYour physical RFID Smart ID Badge will be issued to you by the Secretariat at the venue VIP Accreditation Desk.');
      return;
    }

    setIsDownloading(true);

    try {
      const targetNode = isFlipped ? exportBackRef.current : exportFrontRef.current;
      if (!targetNode) {
        throw new Error('Export element not found');
      }

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      // Capture exact rendered DOM element at 3x HD resolution (1230px x 1800px)
      const dataUrl = await toPng(targetNode, {
        pixelRatio: 3,
        quality: 1.0,
        cacheBust: true,
        backgroundColor: '#ffffff',
      });

      const sideLabel = isFlipped ? 'Back' : 'Pass';
      const fileSlug = displayName.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `RECON2026_Smart_ID_${sideLabel}_${fileSlug}.png`;

      try {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setDownloadModalData({
          dataUrl,
          blobUrl,
          filename,
          sideLabel,
        });
      } catch (blobErr) {
        console.warn('Blob URL fallback:', blobErr);
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setDownloadModalData({
          dataUrl,
          blobUrl: dataUrl,
          filename,
          sideLabel,
        });
      }

      setIsDownloading(false);
      if (onDownload) onDownload();
    } catch (err) {
      console.error('HD capture failed:', err);
      alert('Error generating HD ID Card image. Please try again.');
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    if (!isApproved) {
      alert('❌ Smart ID Card Print Locked!\n\nAdmin payment approval is required before you can print your Smart ID Card.');
      return;
    }
    if (isRestrictedTier && !effectiveIsAdmin) {
      alert('🔒 Official ID Card Printing Restricted to Admin!\n\nOfficial ID Card printing for Elite VIP Guests, Exhibitors, Sponsors, and Partners is managed exclusively by the RECON Expo Secretariat & Admin Accreditation Desk.');
      return;
    }
    window.print();
  };

  // ==========================================
  // SHARED CARD FRONT JSX TEMPLATE
  // ==========================================
  const renderCardFront = (isExport: boolean) => (
    <div 
      id={isExport ? "smart-id-card-front-export" : "smart-id-card-front"}
      ref={isExport ? exportFrontRef : cardFrontRef}
      className={
        isExport
          ? `w-[410px] min-h-[600px] rounded-3xl p-5 pr-9 flex flex-col justify-between shadow-2xl relative overflow-hidden bg-white text-slate-900 border-2 ${
              isElite 
                ? 'border-amber-400/90 ring-4 ring-amber-400/20' 
                : isSponsor
                ? 'border-red-500/90 ring-4 ring-red-500/20'
                : 'border-emerald-500/90 ring-4 ring-emerald-500/20'
            }`
          : `w-full rounded-3xl p-5 pr-9 min-h-[600px] flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden transition-all duration-300 backface-hidden bg-white text-slate-900 border-2 ${
              isElite 
                ? 'border-amber-400/90 ring-4 ring-amber-400/20' 
                : isSponsor
                ? 'border-red-500/90 ring-4 ring-red-500/20'
                : 'border-emerald-500/90 ring-4 ring-emerald-500/20'
            }`
      }
    >
      {/* Top Multi-Color Holographic Circuit Accent Strip */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-amber-400 via-red-500 via-teal-400 to-emerald-600 shadow-xs" />

      {/* VERTICAL SIDE TEXT ON THE RIGHT */}
      <div className="absolute right-0.5 top-6 bottom-6 z-20 flex items-center justify-center pointer-events-none select-none opacity-80">
        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.18em] font-display whitespace-nowrap [writing-mode:vertical-rl] rotate-180 bg-gradient-to-b from-emerald-600 via-amber-500 via-red-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-1.5">
          <span className="text-amber-500">★</span>
          <span>{expoDetails.idCard?.verticalBannerText || '8th Real Estate & Construction Expo'}</span>
          <span className="text-indigo-500">★</span>
        </span>
      </div>
      
      {/* BACKGROUND VECTOR PATTERNS */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <svg className="absolute -top-12 -right-12 w-64 h-64 opacity-[0.06] text-emerald-800" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="1" />
          <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
          <path d="M100,10 L100,190 M10,100 L190,100" stroke="currentColor" strokeWidth="1" />
        </svg>

        <svg className="absolute top-1/3 -left-16 w-56 h-56 opacity-[0.05] text-slate-900" viewBox="0 0 200 200" fill="none">
          <polygon points="100,20 170,170 30,170" stroke="currentColor" strokeWidth="1.5" />
          <polygon points="100,50 150,150 50,150" stroke="currentColor" strokeWidth="1" />
        </svg>

        <svg className="absolute -bottom-16 -right-16 w-72 h-72 opacity-[0.05] text-emerald-800" viewBox="0 0 200 200" fill="none">
          <ellipse cx="100" cy="100" rx="90" ry="40" stroke="currentColor" strokeWidth="1.2" />
          <ellipse cx="100" cy="100" rx="40" ry="90" stroke="currentColor" strokeWidth="1.2" />
          <path d="M0,75 Q100,130 200,75 T400,75" fill="none" stroke="currentColor" strokeWidth="0.8" />
        </svg>

        <div className="absolute top-12 -left-12 rotate-[-25deg] text-[6.5px] font-mono font-bold tracking-[0.2em] text-emerald-900/15 uppercase whitespace-nowrap">
          {expoDetails.idCard?.securityRibbonTop || 'RECON EXPO 2026 • OFFICIAL ACCREDITATION • ABUJA NIGERIA • INTERNATIONAL DELEGATE •'}
        </div>
        <div className="absolute bottom-16 -right-12 rotate-[-25deg] text-[6.5px] font-mono font-bold tracking-[0.2em] text-slate-900/15 uppercase whitespace-nowrap">
          {expoDetails.idCard?.securityRibbonBottom || 'SECURE SMART BADGE • RFID/NFC ACTIVATED • VERIFIED CREDENTIALS •'}
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(#0f172a_0.75px,transparent_0.75px)] [background-size:14px_14px] opacity-[0.03]" />
      </div>

      {/* Top Hardware Lanyard Slot */}
      <div className="relative z-10 flex justify-center mb-1.5 pt-0.5">
        <div className="w-20 h-3 rounded-full bg-gradient-to-b from-slate-200 to-slate-100 border border-slate-300 shadow-inner flex items-center justify-center">
          <div className="w-14 h-1 rounded-full bg-slate-400/80 shadow-xs" />
        </div>
      </div>

      {/* PROMINENT CENTERED LOGO */}
      <div className="relative z-10 flex flex-col items-center justify-center my-1 text-center">
        <div className="w-full flex justify-center py-0.5">
          <ReconLogo size="md" align="center" glow={false} />
        </div>

        {/* Event Date */}
        <div className="flex items-center justify-center gap-1.5 text-[12px] sm:text-[13px] font-extrabold text-emerald-900 bg-emerald-50 border border-emerald-300/80 px-3 py-1 rounded-full shadow-xs mt-1 font-heading">
          <Calendar className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span className="tracking-wide">{expoDetails.dateRange}</span>
        </div>

        {/* Venue */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-[12.5px] font-bold text-slate-800 mt-1 max-w-[340px] px-2 leading-tight font-classic">
          <MapPin className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
          <span className="tracking-wide">{expoDetails.venue}, Abuja</span>
        </div>
      </div>

      {/* DELEGATE PROFILE SECTION */}
      <div className="relative z-10 flex flex-col items-center text-center my-1.5">
        {/* Delegate Photo */}
        <div className="relative mb-2">
          <div className={`relative w-32 h-32 sm:w-38 sm:h-38 rounded-2xl p-1.5 shadow-md overflow-hidden bg-gradient-to-tr ${
            isElite 
              ? 'from-amber-400 via-yellow-300 to-amber-500 ring-3 ring-amber-400/30' 
              : isVisitor
              ? 'from-sky-400 via-cyan-300 to-blue-500 ring-3 ring-sky-400/30'
              : isExhibitor
              ? 'from-emerald-500 via-teal-400 to-emerald-600 ring-3 ring-emerald-400/30'
              : isSponsor
              ? 'from-red-500 via-rose-400 to-red-600 ring-3 ring-red-400/30'
              : 'from-purple-500 via-violet-400 to-indigo-600 ring-3 ring-purple-400/30'
          }`}>
            {displayPhoto ? (
              <img 
                src={displayPhoto} 
                alt={displayName} 
                className="w-full h-full object-cover rounded-xl bg-slate-100"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-slate-100 rounded-xl flex flex-col items-center justify-center text-slate-400">
                <User className="w-14 h-14 text-slate-400 mb-1" />
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Biometric Profile</span>
              </div>
            )}

            <div className="absolute top-1.5 left-1.5 text-[9px] font-mono font-bold text-white/80 drop-shadow-md select-none pointer-events-none">
              [+]
            </div>
            <div className="absolute top-1.5 right-1.5 text-[9px] font-mono font-bold text-white/80 drop-shadow-md select-none pointer-events-none">
              [+]
            </div>
            <div className="absolute bottom-1.5 left-1.5 text-[9px] font-mono font-bold text-white/80 drop-shadow-md select-none pointer-events-none">
              [+]
            </div>
          </div>

          {/* VERIFIED SECURITY STAMP */}
          <div 
            id="id-badge-passport-security-stamp"
            className="absolute -bottom-1.5 -right-1.5 w-12 h-12 sm:w-14 sm:h-14 pointer-events-none select-none -rotate-14 opacity-[0.78] mix-blend-multiply z-20"
            aria-hidden="true"
          >
            <svg viewBox="0 0 200 200" className={`w-full h-full ${
              isElite ? 'text-amber-900' : isSponsor ? 'text-red-900' : 'text-emerald-900'
            }`}>
              <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="4.5" />
              <circle cx="100" cy="100" r="81" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 4" />
              <circle cx="100" cy="100" r="74" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <g className="font-sans font-black text-center" fill="currentColor">
                <text x="100" y="52" textAnchor="middle" fontSize="12" fontWeight="900" letterSpacing="2">★ OFFICIAL PASS ★</text>
                <text x="100" y="96" textAnchor="middle" fontSize="24" fontWeight="900" letterSpacing="3">VERIFIED</text>
                <text x="100" y="118" textAnchor="middle" fontSize="11" fontWeight="700" letterSpacing="1.5">RECON EXPO 2026</text>
                <text x="100" y="152" textAnchor="middle" fontSize="12" fontWeight="900" letterSpacing="2">★ ABUJA FCT ★</text>
              </g>
            </svg>
          </div>
        </div>

        {/* Delegate Name */}
        <h3 
          id="id-badge-delegate-name"
          className="text-lg sm:text-xl font-black text-slate-900 font-heading uppercase tracking-tight leading-snug px-1"
        >
          {displayName}
        </h3>

        {/* Role / Designation */}
        <p className={`text-xs sm:text-[13px] font-black uppercase tracking-wider mt-0.5 font-heading ${
          isElite ? 'text-amber-700' : isSponsor ? 'text-red-600' : 'text-emerald-700'
        }`}>
          {displayRole || 'Industry Delegate'}
        </p>

        {/* Organization */}
        <p className="text-[11px] sm:text-xs text-slate-600 font-bold flex items-center justify-center gap-1 mt-0.5">
          <Building className="w-3.5 h-3.5 text-slate-400" />
          <span>{ticket.organization || 'Independent Delegate'}</span>
        </p>
      </div>

      {/* DIGITAL SMART MODULE: SCANNABLE QR & BARCODE */}
      <div className="relative z-10 bg-slate-50/90 backdrop-blur-xs rounded-xl p-2.5 sm:p-3 border border-slate-200 mt-1 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          {/* QR Code Frame */}
          <div className="relative p-1 bg-white border border-slate-300 rounded-lg shadow-xs flex-shrink-0">
            <img 
              src={ticket.qrCodeUrl} 
              alt="Ticket QR Code" 
              className="w-14 h-14 sm:w-17 sm:h-17 object-contain"
              crossOrigin="anonymous"
            />
            <div className="absolute top-0.5 left-0.5 w-2 h-2 border-t-2 border-l-2 border-emerald-600 rounded-tl-xs pointer-events-none" />
            <div className="absolute top-0.5 right-0.5 w-2 h-2 border-t-2 border-r-2 border-emerald-600 rounded-tr-xs pointer-events-none" />
            <div className="absolute bottom-0.5 left-0.5 w-2 h-2 border-b-2 border-l-2 border-emerald-600 rounded-bl-xs pointer-events-none" />
            <div className="absolute bottom-0.5 right-0.5 w-2 h-2 border-b-2 border-r-2 border-emerald-600 rounded-br-xs pointer-events-none" />
          </div>

          {/* Scannable Barcode & Cryptographic Token */}
          <div className="flex-1 flex flex-col items-center justify-center overflow-hidden">
            <div className="w-full flex items-center justify-between text-[8px] sm:text-[9px] font-mono text-slate-500 mb-0.5 px-0.5">
              <span className="flex items-center gap-0.5 font-bold">
                <Lock className="w-2.5 h-2.5 text-emerald-600" />
                ENCRYPTED
              </span>
              <span className="font-semibold">{securityHash}</span>
            </div>

            <div className="w-full flex items-center justify-center gap-0.5 h-7 sm:h-8 px-0.5">
              {Array.from({ length: 32 }).map((_, idx) => {
                const heights = ['h-6', 'h-7', 'h-5', 'h-8'];
                const widths = idx % 4 === 0 ? 'w-[3px]' : idx % 3 === 0 ? 'w-[2px]' : 'w-[1.2px]';
                return (
                  <div 
                    key={idx} 
                    className={`bg-slate-900 ${widths} ${heights[idx % 4]} flex-shrink-0`} 
                  />
                );
              })}
            </div>
            <span className="font-mono text-[10px] sm:text-[11.5px] font-black text-slate-900 tracking-widest mt-1">
              *{displayBadgeNumber}*
            </span>
          </div>
        </div>
      </div>

      {/* PASS CATEGORY BANNER (FOOTER) */}
      <div className="relative z-10 mt-1">
        {isElite ? (
          <div 
            id="id-badge-tier-elite"
            className="w-full py-2.5 sm:py-3 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-black text-center uppercase tracking-wider shadow-md border border-amber-300 flex items-center justify-center gap-1.5"
          >
            <Crown className="w-4 h-4 fill-black text-black" />
            <span className="text-xs sm:text-[13.5px] font-black font-heading">★ ELITE GUEST VIP PASS ★</span>
          </div>
        ) : isPress ? (
          <div 
            id="id-badge-tier-press"
            className="w-full py-2.5 sm:py-3 px-3 rounded-xl bg-gradient-to-r from-fuchsia-600 via-pink-500 to-purple-700 text-white font-black text-center uppercase tracking-wider shadow-md border border-fuchsia-300 flex items-center justify-center gap-1.5"
          >
            <Camera className="w-4 h-4 text-fuchsia-100" />
            <span className="text-xs sm:text-[13.5px] font-black font-heading">📸 PRESS &amp; MEDIA CORPS PASS</span>
          </div>
        ) : isOfficial ? (
          <div 
            id="id-badge-tier-official"
            className="w-full py-2.5 sm:py-3 px-3 rounded-xl bg-gradient-to-r from-blue-700 via-indigo-600 to-slate-900 text-white font-black text-center uppercase tracking-wider shadow-md border border-amber-400 flex items-center justify-center gap-1.5"
          >
            <Building2 className="w-4 h-4 text-amber-300" />
            <span className="text-xs sm:text-[13.5px] font-black font-heading">🏛️ OFFICIAL ORGANIZER PASS</span>
          </div>
        ) : isSecurity ? (
          <div 
            id="id-badge-tier-security"
            className="w-full py-2.5 sm:py-3 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-600 to-amber-700 text-slate-950 font-black text-center uppercase tracking-wider shadow-md border border-amber-300 flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-slate-950" />
            <span className="text-xs sm:text-[13.5px] font-black font-heading">🛡️ SECURITY &amp; PROTOCOL PASS</span>
          </div>
        ) : isCrew ? (
          <div 
            id="id-badge-tier-crew"
            className="w-full py-2.5 sm:py-3 px-3 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-500 to-slate-800 text-white font-black text-center uppercase tracking-wider shadow-md border border-cyan-400 flex items-center justify-center gap-1.5"
          >
            <Zap className="w-4 h-4 text-cyan-200" />
            <span className="text-xs sm:text-[13.5px] font-black font-heading">🛠️ TECHNICAL CREW PASS</span>
          </div>
        ) : isMedical ? (
          <div 
            id="id-badge-tier-medical"
            className="w-full py-2.5 sm:py-3 px-3 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white font-black text-center uppercase tracking-wider shadow-md border border-rose-300 flex items-center justify-center gap-1.5"
          >
            <Shield className="w-4 h-4 text-white" />
            <span className="text-xs sm:text-[13.5px] font-black font-heading">🚑 EMERGENCY MEDICAL PASS</span>
          </div>
        ) : isVisitor ? (
          <div 
            id="id-badge-tier-visitor"
            className="w-full py-2.5 sm:py-3 px-3 rounded-xl bg-gradient-to-r from-sky-600 via-cyan-500 to-sky-700 text-white font-black text-center uppercase tracking-wider shadow-md border border-sky-400 flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-sky-100" />
            <span className="text-xs sm:text-[13.5px] font-black font-heading">VISITOR PASS (FREE ADMISSION)</span>
          </div>
        ) : isExhibitor ? (
          <div 
            id="id-badge-tier-exhibitor"
            className="w-full py-2.5 sm:py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 text-white font-black text-center uppercase tracking-wider shadow-md border border-emerald-400 flex items-center justify-center gap-1.5"
          >
            <Store className="w-4 h-4 text-emerald-100" />
            <span className="text-xs sm:text-[13.5px] font-black font-heading">EXHIBITOR STAND PASS</span>
          </div>
        ) : isSponsor ? (
          <div 
            id="id-badge-tier-sponsor"
            className="w-full py-2.5 sm:py-3 px-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-500 to-red-700 text-white font-black text-center uppercase tracking-wider shadow-md border border-red-400 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span className="text-xs sm:text-[13.5px] font-black font-heading">SUMMIT SPONSOR PASS</span>
          </div>
        ) : isPartner ? (
          <div 
            id="id-badge-tier-partner"
            className="w-full py-2.5 sm:py-3 px-3 rounded-xl bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-700 text-white font-black text-center uppercase tracking-wider shadow-md border border-purple-400 flex items-center justify-center gap-1.5"
          >
            <Handshake className="w-4 h-4 text-purple-200" />
            <span className="text-xs sm:text-[13.5px] font-black font-heading">STRATEGIC PARTNER PASS</span>
          </div>
        ) : (
          <div 
            id="id-badge-tier-default"
            className="w-full py-2.5 sm:py-3 px-3 rounded-xl bg-gradient-to-r from-sky-600 via-cyan-500 to-sky-700 text-white font-black text-center uppercase tracking-wider shadow-md border border-sky-400 flex items-center justify-center gap-1.5"
          >
            <Award className="w-4 h-4 text-sky-100" />
            <span className="text-xs sm:text-[13.5px] font-black font-heading">{ticket.tier.toUpperCase()} PASS</span>
          </div>
        )}
      </div>
    </div>
  );

  // ==========================================
  // SHARED CARD BACK JSX TEMPLATE
  // ==========================================
  const renderCardBack = (isExport: boolean) => (
    <div 
      id={isExport ? "smart-id-card-back-export" : "smart-id-card-back"}
      ref={isExport ? exportBackRef : cardBackRef}
      className={
        isExport
          ? `w-[410px] min-h-[600px] rounded-3xl p-6 shadow-2xl relative overflow-hidden bg-white text-slate-900 border-2 flex flex-col justify-between ${
              isElite 
                ? 'border-amber-400/90 ring-4 ring-amber-400/20' 
                : isVisitor
                ? 'border-sky-400/90 ring-4 ring-sky-400/20'
                : isExhibitor
                ? 'border-emerald-500/90 ring-4 ring-emerald-500/20'
                : isSponsor
                ? 'border-red-500/90 ring-4 ring-red-500/20'
                : 'border-purple-500/90 ring-4 ring-purple-500/20'
            }`
          : `absolute inset-0 w-full h-full rounded-3xl p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.35)] overflow-hidden transition-all duration-300 rotate-y-180 backface-hidden bg-white text-slate-900 border-2 flex flex-col justify-between ${
              isElite 
                ? 'border-amber-400/90 ring-4 ring-amber-400/20' 
                : isVisitor
                ? 'border-sky-400/90 ring-4 ring-sky-400/20'
                : isExhibitor
                ? 'border-emerald-500/90 ring-4 ring-emerald-500/20'
                : isSponsor
                ? 'border-red-500/90 ring-4 ring-red-500/20'
                : 'border-purple-500/90 ring-4 ring-purple-500/20'
            }`
      }
    >
      {/* Top Accent Strip */}
      <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-emerald-500 via-amber-400 via-red-500 via-teal-400 to-emerald-600" />
      
      {/* Background Vector Art */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <svg className="absolute -top-10 -left-10 w-72 h-72 opacity-[0.05] text-emerald-800" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="1.5" />
          <ellipse cx="100" cy="100" rx="90" ry="40" stroke="currentColor" strokeWidth="1.2" />
          <ellipse cx="100" cy="100" rx="40" ry="90" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <div className="absolute inset-0 bg-[radial-gradient(#0f172a_0.75px,transparent_0.75px)] [background-size:14px_14px] opacity-[0.03]" />
      </div>

      {/* Top Hardware Lanyard Slot */}
      <div className="relative z-10 flex justify-center mb-1 pt-1">
        <div className="w-20 h-3 rounded-full bg-slate-200 border border-slate-300 shadow-inner flex items-center justify-center">
          <div className="w-14 h-1.2 rounded-full bg-slate-400" />
        </div>
      </div>

      <div className="relative z-10">
        {/* Back Header */}
        <div className="flex flex-col items-center text-center mb-2.5">
          <div className="w-full flex justify-center mb-1">
            <ReconLogo size="sm" align="center" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200 font-mono">
            {expoDetails.idCard?.backConciergeHeader || 'INTERNATIONAL DELEGATE CONCIERGE & PROTOCOL'}
          </span>
        </div>

        {/* Wi-Fi, Venue & Hours Grid */}
        <div className="space-y-1.5 text-xs mb-2.5">
          <div className="p-2.5 rounded-xl bg-slate-50/90 border border-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-700 text-xs font-semibold">
              <Wifi className="w-4 h-4 text-emerald-600" />
              High-Speed Summit Wi-Fi:
            </span>
            <span className="font-mono text-emerald-700 font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-xs">
              {expoDetails.idCard?.wifiSsid || 'RECON2026_GUEST'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50/90 border border-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-700 text-xs font-semibold">
              <MapPin className="w-4 h-4 text-red-500" />
              Official Venue:
            </span>
            <span className="text-slate-900 font-bold text-xs font-classic truncate max-w-[200px]">
              {expoDetails.venue}, Abuja
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50/90 border border-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-700 text-xs font-semibold">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Exhibition Hours:
            </span>
            <span className="text-slate-800 font-bold text-[11px]">
              {expoDetails.dailyTime}
            </span>
          </div>
        </div>

        {/* Verification & Badge Security Rules */}
        <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-200 text-[10px] text-slate-600 space-y-1.5 mb-1.5 leading-relaxed">
          <p className="font-bold text-slate-900 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            International Accreditation Protocol:
          </p>
          <p>{expoDetails.idCard?.backRule1 || '1. This digital smart badge must remain visibly worn around the neck throughout exhibition pavilions, plenary halls, and B2B deal rooms.'}</p>
          <p>{expoDetails.idCard?.backRule2 || '2. Tap your badge or present your QR code at sponsor booths to receive instant digital project brochures and investment prospectuses.'}</p>
          <p>{expoDetails.idCard?.backRule3 || '3. This pass is strictly non-transferable. Valid government-issued photo identification may be requested at security checkpoints.'}</p>
        </div>
      </div>

      {/* Secretariat Helpline Footer */}
      <div className="relative z-10 border-t border-slate-200 pt-2 text-center text-xs">
        <p className="text-[9px] text-slate-500 mb-0.5 font-medium">{expoDetails.idCard?.secretariatHelpline || 'Secretariat Support & Emergency Desk'}:</p>
        <p className="font-mono text-emerald-700 font-black text-xs">
          {expoDetails.contactPhone} • {expoDetails.contactEmail}
        </p>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center">
      {/* 3D Flip Interactive Physical Card Container */}
      <motion.div 
        className="w-full max-w-[410px] sm:max-w-[430px] card-perspective cursor-pointer group relative my-2"
        ref={cardRef}
        onClick={() => setIsFlipped(!isFlipped)}
        initial={{ opacity: 0, scale: 0.92, y: 16, rotateX: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
        whileHover={{ scale: 1.025, y: -5, rotateX: -3 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          type: 'spring',
          stiffness: 240,
          damping: 22,
        }}
      >
        {/* Floating Interactive 3D Flip Pill Badge */}
        <div className="absolute -top-3.5 right-4 z-30 bg-slate-950/90 text-emerald-300 border border-emerald-500/50 text-[10px] font-mono font-bold px-3 py-1 rounded-full shadow-xl backdrop-blur-md flex items-center gap-1.5 pointer-events-none group-hover:border-emerald-400 group-hover:scale-105 transition-all">
          <RotateCw className={`w-3 h-3 text-emerald-400 transition-transform duration-700 ${isFlipped ? 'rotate-180' : ''}`} />
          <span>{isFlipped ? '3D BACK SIDE' : 'CLICK TO FLIP 3D'}</span>
        </div>

        {/* 3D Rotating Card Body */}
        <motion.div 
          className="relative w-full preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{
            duration: 0.75,
            ease: [0.34, 1.56, 0.64, 1], // Physical spring cubic-bezier with realistic momentum
          }}
        >
          {/* Holographic light reflection sheen overlay sweeping across the card on flip */}
          <motion.div 
            className="absolute inset-0 z-40 rounded-3xl pointer-events-none bg-gradient-to-tr from-transparent via-white/30 to-transparent"
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ 
              opacity: [0, 0.5, 0],
              x: ['-100%', '100%']
            }}
            key={isFlipped ? 'flipped-back' : 'flipped-front'}
            transition={{ duration: 0.75, ease: 'easeInOut' }}
          />

          {renderCardFront(false)}
          {renderCardBack(false)}
        </motion.div>
      </motion.div>

      {/* OFFSCREEN CLEAN FLAT EXPORT TARGETS (EXACT PIXEL-PERFECT DOM CLONES FOR HIGH-RES DOWNLOADING) */}
      <div className="fixed -left-[9999px] -top-[9999px] pointer-events-none opacity-100 z-[-1]" aria-hidden="true">
        {renderCardFront(true)}
        {renderCardBack(true)}
      </div>

      {/* Interactive ID Card Action Controls */}
      {showActions && (
        <div className="w-full max-w-[410px] sm:max-w-[430px] mt-5 flex flex-col gap-2.5">
          {!isApproved ? (
            <div className="w-full p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-amber-300 font-extrabold text-xs uppercase tracking-wider">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Smart ID Card Locked — Admin Approval Required</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Your official event Smart ID Card and download button will unlock automatically once the RECON Expo Secretariat approves your payment.
              </p>
            </div>
          ) : isRestrictedTier && !effectiveIsAdmin ? (
            <>
              {/* Flip Card Button for Delegate viewing front and back */}
              <button
                id="flip-smart-id-card-btn"
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer backdrop-blur-md shadow-sm"
              >
                <RotateCw className="w-4 h-4 text-emerald-400" />
                <span>{isFlipped ? 'View Front Side' : 'Flip to Back Side'}</span>
              </button>

              {/* Notice: ID Card Download is Restricted to Admin */}
              <div className="w-full p-4 rounded-2xl bg-gradient-to-b from-amber-950/40 to-black/60 border border-amber-500/40 text-center space-y-2 shadow-lg">
                <div className="flex items-center justify-center gap-2 text-amber-300 font-extrabold text-xs uppercase tracking-wider">
                  <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>ID Card Download Restricted to Admin</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Official Smart ID Card badge downloads for <strong className="text-amber-300">{ticket.tier || 'Paid Delegates & Partners'}</strong> are issued exclusively by the RECON Expo Secretariat and Admin Accreditation Desk. Only Visitor passes can be downloaded directly by delegates.
                </p>
                <div className="pt-1 flex items-center justify-center gap-1.5 text-[10px] text-emerald-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Your physical RFID Smart ID Badge will be issued at the VIP Secretariat Desk</span>
                </div>
              </div>
            </>
          ) : (
            <>
              {effectiveIsAdmin && isRestrictedTier && (
                <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-[10px] text-amber-300 font-bold">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Admin Accreditation Clearance</span>
                  </span>
                  <span className="font-mono text-slate-300 uppercase">{isElite ? 'Elite VIP' : isExhibitor ? 'Exhibitor' : isSponsor ? 'Sponsor' : 'Partner'}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                {/* Flip Card Button */}
                <button
                  id="flip-smart-id-card-btn"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer backdrop-blur-md shadow-sm"
                >
                  <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isFlipped ? 'View Front Side' : 'Flip to Back Side'}</span>
                </button>

                {/* Print ID Card Button */}
                <button
                  id="print-smart-id-card-btn"
                  onClick={handlePrint}
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer backdrop-blur-md shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-300" />
                  <span>Print Badge</span>
                </button>
              </div>

              {/* Download Full HD ID Pass */}
              <button
                id="download-smart-id-pass-btn"
                onClick={handleDownloadImage}
                disabled={isDownloading}
                className={`w-full py-3.5 px-4 rounded-xl font-black text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl ${
                  isElite 
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black shadow-amber-950/50' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-emerald-950 shadow-emerald-950/50'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>
                  {isDownloading 
                    ? 'CAPTURING HD PASS (EXACT PIXEL-PERFECT CLONE)...' 
                    : isFlipped 
                    ? 'DOWNLOAD BACK SIDE (PNG)' 
                    : 'DOWNLOAD SMART ID PASS (PNG)'}
                </span>
              </button>
            </>
          )}
        </div>
      )}

      {/* DOWNLOAD READY PREVIEW & SAVE OPTIONS MODAL */}
      {downloadModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl text-white space-y-4 text-center relative">
            <button 
              onClick={() => setDownloadModalData(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-black font-heading text-white">Smart ID Badge Download Ready</h3>
              <p className="text-xs text-slate-300 mt-1">Your high-resolution {downloadModalData.sideLabel} badge has been generated!</p>
            </div>

            <div className="p-2 bg-slate-950 rounded-2xl border border-slate-800 flex justify-center max-h-[320px] overflow-auto">
              <img 
                src={downloadModalData.dataUrl} 
                alt="Smart ID Pass HD Preview" 
                className="max-h-[300px] rounded-xl object-contain shadow-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => {
                  const a = document.createElement('a');
                  a.href = downloadModalData.blobUrl;
                  a.download = downloadModalData.filename;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
                className="py-3 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Save PNG Image</span>
              </button>

              <button
                onClick={() => {
                  try {
                    const pdf = new jsPDF({
                      orientation: 'portrait',
                      unit: 'mm',
                      format: [85.6, 125],
                    });
                    pdf.addImage(downloadModalData.dataUrl, 'PNG', 0, 0, 85.6, 125);
                    pdf.save(downloadModalData.filename.replace(/\.png$/i, '.pdf'));
                  } catch (err) {
                    console.error('PDF generation error:', err);
                    alert('PDF generation error. Please save as PNG image.');
                  }
                }}
                className="py-3 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <FileText className="w-4 h-4" />
                <span>Save PDF Pass</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-3">
              <a 
                href={downloadModalData.blobUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Image in New Tab</span>
              </a>

              <button 
                onClick={() => setDownloadModalData(null)} 
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
