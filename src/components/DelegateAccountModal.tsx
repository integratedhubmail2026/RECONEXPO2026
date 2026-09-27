import React, { useState, useEffect } from 'react';
import { useExpoData } from '../context/ExpoDataContext';
import { AttendeeTicket } from '../types';
import { getAttendeeProfilePhoto } from '../utils/avatarUtils';
import { SmartIdCard } from './SmartIdCard';
import { CompanyStaffBadgeManager } from './CompanyStaffBadgeManager';
import { PhotoCaptureStudio } from './PhotoCaptureStudio';
import { 
  User, 
  UserCheck, 
  ShieldCheck, 
  Clock, 
  ShieldAlert, 
  Search, 
  CreditCard, 
  ExternalLink, 
  RotateCw, 
  LogOut, 
  CheckCircle2, 
  X, 
  QrCode, 
  Mail, 
  Phone, 
  Building, 
  Briefcase, 
  MapPin, 
  Calendar, 
  Sparkles,
  Award,
  Key,
  Ticket,
  ChevronRight,
  Lock,
  Download,
  Camera
} from 'lucide-react';

const FLUTTERWAVE_PAYMENT_LINK = 'https://flutterwave.com/pay/8psefp46habu';
const LOCAL_STORAGE_LOGGED_IN_KEY = 'recon_expo_logged_in_delegate_v1';

interface DelegateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister?: (tier?: string) => void;
}

export const DelegateAccountModal: React.FC<DelegateAccountModalProps> = ({
  isOpen,
  onClose,
  onOpenRegister
}) => {
  const { attendees, refreshAttendees, updateAttendee, expoDetails, tiers, verifyReferralCode } = useExpoData();
  const eliteTier = tiers?.find(t => t.id === 'elite');
  const elitePaymentLink = eliteTier?.paymentLink || expoDetails.siteTexts?.elitePaymentLink || FLUTTERWAVE_PAYMENT_LINK;
  const discountPaymentLink = eliteTier?.discountPaymentLink || expoDetails.siteTexts?.discountPaymentLink || elitePaymentLink;

  // Login & Session state
  const [loggedInTicket, setLoggedInTicket] = useState<AttendeeTicket | null>(null);
  const [loginQuery, setLoginQuery] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isViewingCard, setIsViewingCard] = useState(false);
  const [isSnappingPhoto, setIsSnappingPhoto] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Promo Code State for Account Portal
  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState<string | null>(null);

  const handleApplyPromoCode = () => {
    if (!loggedInTicket) return;
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setPromoMsg('Please enter a valid marketer discount code.');
      return;
    }
    const res = verifyReferralCode(code, 'elite', 25000);
    if (res.valid) {
      const updated: AttendeeTicket = {
        ...loggedInTicket,
        referralCode: res.code,
        discountAppliedNGN: res.discountAppliedNGN || 5000,
        amountPaid: '₦20,000'
      };
      updateAttendee(loggedInTicket.ticketNumber, updated);
      setLoggedInTicket(updated);
      localStorage.setItem(LOCAL_STORAGE_LOGGED_IN_KEY, JSON.stringify(updated));
      setPromoMsg(`✅ Discount Code "${res.code}" Applied! Fee reduced from ₦25,000 to ₦20,000.`);
    } else {
      setPromoMsg(res.message || 'Invalid marketer discount code.');
    }
  };

  // Restore logged in user session on mount or modal open
  useEffect(() => {
    if (isOpen) {
      try {
        const latestList = refreshAttendees();
        const stored = localStorage.getItem(LOCAL_STORAGE_LOGGED_IN_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Sync with fresh data from attendees list
          const currentList = latestList && latestList.length > 0 ? latestList : attendees;
          const fresh = currentList.find(a => 
            a.ticketNumber === parsed.ticketNumber || 
            (a.email && parsed.email && a.email.toLowerCase() === parsed.email.toLowerCase())
          );
          if (fresh) {
            setLoggedInTicket(fresh);
            setIsViewingCard(true);
          } else {
            setLoggedInTicket(parsed);
            setIsViewingCard(true);
          }
        }
      } catch (e) {
        // safe
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle passwordless account login
  const handleLogin = (queryToUse?: string) => {
    const q = (queryToUse || loginQuery).trim().toLowerCase();
    if (!q) {
      setLoginError('Please enter your Email, Ticket Number, or Phone Number.');
      return;
    }
    setLoginError(null);
    const latestList = refreshAttendees();
    const currentList = latestList && latestList.length > 0 ? latestList : attendees;
    const cleanQ = q.replace(/[^0-9a-z@.]/g, '');

    const found = currentList.find(a => {
      const tNum = (a.ticketNumber || '').toLowerCase();
      const email = (a.email || '').toLowerCase();
      const phone = (a.phone || '').toLowerCase().replace(/[^0-9]/g, '');

      return tNum.includes(q) || email === q || (cleanQ && phone && phone.includes(cleanQ));
    });

    if (found) {
      setLoggedInTicket(found);
      setIsViewingCard(true);
      localStorage.setItem(LOCAL_STORAGE_LOGGED_IN_KEY, JSON.stringify(found));
      setLoginQuery('');
      setLoginError(null);
      setStatusMessage(`Welcome back, ${found.fullName}! Logged into your account.`);
      setTimeout(() => setStatusMessage(null), 4000);
    } else {
      setLoginError(`No registration account found matching "${queryToUse || loginQuery}". Please check your details or register a pass.`);
    }
  };

  const handleLogout = () => {
    setLoggedInTicket(null);
    setIsViewingCard(false);
    localStorage.removeItem(LOCAL_STORAGE_LOGGED_IN_KEY);
    setStatusMessage('Logged out of registration account.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleCheckStatus = () => {
    if (!loggedInTicket) return;
    const latestList = refreshAttendees();
    const fresh = (latestList && latestList.length > 0 ? latestList : attendees).find(a => 
      a.ticketNumber === loggedInTicket.ticketNumber || 
      (a.email && loggedInTicket.email && a.email.toLowerCase() === loggedInTicket.email.toLowerCase())
    );

    if (fresh) {
      setLoggedInTicket(fresh);
      localStorage.setItem(LOCAL_STORAGE_LOGGED_IN_KEY, JSON.stringify(fresh));
      
      const isApproved = fresh.adminApproved || fresh.adminApprovalStatus === 'APPROVED';
      const isDeclined = fresh.adminApprovalStatus === 'DECLINED' || fresh.paymentStatus === 'DECLINED';

      if (isApproved) {
        setStatusMessage(`✅ Payment Approved for ${fresh.fullName}! Smart ID Card is unlocked.`);
      } else if (isDeclined) {
        setStatusMessage(`❌ Payment Status: DECLINED by RECON Secretariat.`);
      } else {
        setStatusMessage(`⏳ Approval Pending: The RECON Secretariat has not approved payment yet.`);
      }
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  // Determine current ticket live status
  const liveTicket = loggedInTicket ? (
    attendees.find(a => a.ticketNumber === loggedInTicket.ticketNumber) || loggedInTicket
  ) : null;

  const isVisitor = liveTicket ? (
    liveTicket.passType === 'visitor' || 
    liveTicket.tier.toLowerCase().includes('visitor') || 
    liveTicket.tier.toLowerCase().includes('free') || 
    liveTicket.amountPaid === '₦0' || 
    liveTicket.amountPaid === 'Free' || 
    liveTicket.amountPaid === '$0'
  ) : false;

  const isCorporate = liveTicket ? (
    liveTicket.passType === 'exhibitor' || 
    liveTicket.passType === 'sponsor' || 
    liveTicket.passType === 'partner'
  ) : false;

  const isApproved = liveTicket ? (isVisitor || liveTicket.adminApproved === true || liveTicket.adminApprovalStatus === 'APPROVED') : false;
  const isDeclined = liveTicket ? (!isVisitor && (liveTicket.adminApprovalStatus === 'DECLINED' || liveTicket.paymentStatus === 'DECLINED')) : false;

  return (
    <div 
      id="delegate-account-portal-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn"
    >
      <div className="relative w-full max-w-3xl bg-[#011a12] border border-amber-500/40 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden my-6">
        
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-[#01271b] via-[#023e2b] to-[#01271b] p-5 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/40 flex items-center justify-center shadow-md">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white font-heading tracking-wide">
                  Registration User Account Portal
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider hidden sm:inline-flex items-center gap-1">
                  <Key className="w-3 h-3 text-emerald-400" />
                  Direct Access
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {liveTicket ? `Welcome, ${liveTicket.fullName}` : 'Access your registration, payment approval status & Smart ID Card'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Toast Notification */}
        {statusMessage && (
          <div className="bg-gradient-to-r from-amber-500/30 via-emerald-500/30 to-amber-500/30 border-b border-amber-400/40 py-2.5 px-4 text-center text-xs font-extrabold text-white animate-pulse">
            {statusMessage}
          </div>
        )}

        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* ================= MODE 1: LOGGED OUT / PASSWORDLESS SIGN IN ================= */}
          {!liveTicket ? (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center mx-auto shadow-xl shadow-amber-950/50">
                  <Key className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white font-heading">
                  Account Access
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Every RECON Expo 2026 registration automatically creates a <strong className="text-amber-300">User Account</strong>. Enter your Email, Ticket Number, or Phone Number to log in.
                </p>
              </div>

              {/* Passwordless Sign-In Box */}
              <div className="p-5 rounded-2xl bg-[#022a1d] border-2 border-amber-500/40 shadow-xl space-y-3">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-amber-400" />
                  Account Identifier (Email, Ticket #, or Phone):
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="e.g. danladi.investments@gmail.com, RECON-2026-ELT-8491, or +234803..."
                    value={loginQuery}
                    onChange={(e) => {
                      setLoginQuery(e.target.value);
                      setLoginError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleLogin();
                    }}
                    className="flex-1 px-4 py-3.5 rounded-xl bg-black/80 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-400 font-mono shadow-inner"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => handleLogin()}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all hover:scale-105 shrink-0"
                  >
                    <span>Sign In</span>
                    <ChevronRight className="w-4 h-4 text-black" />
                  </button>
                </div>

                {loginError && (
                  <p className="text-red-400 text-xs font-bold bg-red-950/60 p-3 rounded-xl border border-red-500/40">
                    {loginError}
                  </p>
                )}
              </div>

              {/* Registration Callout */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2">
                <p className="text-xs text-slate-300">
                  Haven't registered for RECON Expo 2026 yet? Register now to automatically get your account!
                </p>
                {onOpenRegister && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenRegister('attendee');
                    }}
                    className="px-5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Register New Pass</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            
            /* ================= MODE 2: LOGGED IN USER ACCOUNT DASHBOARD ================= */
            <div className="space-y-6">
              
              {/* Account Header Profile Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#012a1d] via-[#023a28] to-[#012a1d] border-2 border-amber-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={getAttendeeProfilePhoto(liveTicket.photoUrl, liveTicket.avatarUrl, liveTicket.fullName)} 
                      alt={liveTicket.fullName} 
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-lg bg-slate-800"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-900 flex items-center justify-center ${
                      isApproved ? 'bg-emerald-500 text-black' : isDeclined ? 'bg-red-500 text-white' : 'bg-amber-500 text-black'
                    }`}>
                      {isApproved ? <CheckCircle2 className="w-3 h-3" /> : isDeclined ? <ShieldAlert className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-black text-white font-heading">
                        {liveTicket.fullName}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${
                        liveTicket.passType === 'visitor' || isVisitor
                          ? 'bg-sky-500/20 text-sky-300 border-sky-400/40'
                          : liveTicket.passType === 'elite'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                          : liveTicket.passType === 'exhibitor'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                          : liveTicket.passType === 'sponsor'
                          ? 'bg-red-500/20 text-red-300 border-red-400/40'
                          : 'bg-purple-500/20 text-purple-300 border-purple-400/40'
                      }`}>
                        {liveTicket.tier}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{liveTicket.role} • <strong className="text-white">{liveTicket.organization}</strong></span>
                    </p>

                    <p className="text-[11px] text-slate-400 mt-1 font-mono flex items-center gap-2">
                      <span>Ticket: <strong className="text-amber-300">{liveTicket.ticketNumber}</strong></span>
                      <span>•</span>
                      <span>Email: <strong className="text-slate-200">{liveTicket.email}</strong></span>
                    </p>
                  </div>
                </div>

                {/* Account Actions */}
                <div className="flex sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1">
                    <Key className="w-3 h-3 text-emerald-400" />
                    Registration account
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-white/15 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer ml-auto sm:ml-0"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Switch / Logout</span>
                  </button>
                </div>
              </div>

              {/* PAYMENT APPROVAL & SMART ID CARD GATE STATUS */}
              <div className={`p-5 sm:p-6 rounded-2xl border-2 shadow-2xl transition-all ${
                isApproved 
                  ? 'bg-emerald-950/40 border-emerald-500/60 shadow-emerald-950/40' 
                  : isDeclined 
                  ? 'bg-red-950/40 border-red-500/60 shadow-red-950/40' 
                  : 'bg-amber-950/40 border-amber-500/60 shadow-amber-950/40'
              }`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                      isApproved ? 'bg-emerald-500 text-black shadow-emerald-500/30' : isDeclined ? 'bg-red-500 text-white shadow-red-500/30' : 'bg-amber-500 text-black shadow-amber-500/30 animate-pulse'
                    }`}>
                      {isApproved ? <ShieldCheck className="w-7 h-7" /> : isDeclined ? <ShieldAlert className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm sm:text-base font-black uppercase tracking-wider px-3.5 py-1 rounded-full border ${
                          isApproved ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' : isDeclined ? 'bg-red-500/20 text-red-300 border-red-400/40' : 'bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-md'
                        }`}>
                          {isApproved ? 'Payment Approved' : isDeclined ? 'Payment Declined' : 'Pending Admin Payment Approval'}
                        </span>
                      </div>
                      <h4 className="text-xl sm:text-2xl font-black text-white font-heading mt-1.5">
                        {isApproved 
                          ? 'Official Smart ID Card Clearance Granted!' 
                          : isDeclined 
                          ? 'Payment Verification Declined' 
                          : 'Awaiting Admin Payment Verification'}
                      </h4>
                      {!isApproved && (
                        <div className="text-amber-300 font-extrabold text-sm sm:text-base mt-1">
                          Payment process by: <span className="text-white underline decoration-amber-400 font-extrabold">Afrinex West Africa Limited.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckStatus}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 border border-white/20"
                    title="Refresh status from Secretariat database"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Re-Check Status</span>
                  </button>
                </div>

                {/* Status Explanation */}
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-5">
                  {isCorporate ? (
                    isApproved ? (
                      <>Your <strong className="text-emerald-300">{liveTicket.tier}</strong> accreditation has been verified and cleared by the Super Admin Secretariat. Your official badge record is active in the Secretariat Registry.</>
                    ) : (
                      <>Your application for <strong className="text-amber-300">{liveTicket.tier}</strong> is under review by the RECON Secretariat. Official corporate ID badges and booth allocations are generated and issued exclusively by the <strong>Super Admin Secretariat</strong> following clearance.</>
                    )
                  ) : isVisitor ? (
                    <>Your <strong className="text-emerald-300">Visitor (Free) Pass</strong> for RECON Expo 2026 is auto-cleared! Click <strong className="text-amber-300">GET VIP GUEST PASS</strong> below to snap your photo and instantly generate your Smart ID Card.</>
                  ) : isApproved ? (
                    <>Your payment for <strong className="text-emerald-300">{liveTicket.tier}</strong> has been verified and approved by the RECON Expo Secretariat. Your printable Smart ID Card is fully unlocked.</>
                  ) : isDeclined ? (
                    <>The RECON Secretariat was unable to verify your Flutterwave payment. Please click below to complete your payment or re-check status.</>
                  ) : (
                    <>Your registration for <strong className="text-amber-300">{liveTicket.tier}</strong> has been logged. Admin payment approval is required before your Smart ID Card can be generated. Once verified by Secretariat, your pass unlocks automatically.</>
                  )}
                </p>

                {/* Reference Details Pill */}
                <div className="p-3.5 rounded-xl bg-black/60 border border-white/15 text-xs font-mono grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Transaction / Ref:</span>
                    <span className="text-amber-300 font-bold truncate block">{isVisitor ? 'FREE-VISITOR-PASS' : (liveTicket.paymentRef || 'N/A')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Billing Status:</span>
                    <span className="text-white font-bold">{isCorporate ? 'Secretariat Invoiced' : isVisitor ? 'Free (₦0)' : (liveTicket.amountPaid || '₦25,000')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Registration Date:</span>
                    <span className="text-slate-300">{liveTicket.registeredAt}</span>
                  </div>
                </div>

                {/* Main Action Buttons */}
                <div className="space-y-4">
                  {/* 1. FLUTTERWAVE PAYMENT BUTTON / VERIFIED BADGE (Only for Elite VIP) */}
                  {!isVisitor && !isCorporate && (
                    isApproved ? (
                      <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-center space-y-1 shadow-md">
                        <div className="flex items-center justify-center gap-2 text-emerald-300 font-extrabold text-sm sm:text-base uppercase tracking-wider font-heading">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <span>Payment Verified &amp; Cleared ({(liveTicket.amountPaid && liveTicket.amountPaid !== '₦0') ? liveTicket.amountPaid : '₦25,000'})</span>
                        </div>
                        <p className="text-xs text-slate-300 font-medium">
                          Your registration payment has been verified and cleared by the RECON Secretariat. Your official VIP Guest Smart ID pass is active below.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {!(liveTicket.referralCode || (liveTicket.discountAppliedNGN && liveTicket.discountAppliedNGN > 0) || liveTicket.amountPaid === '₦20,000') && (
                          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                              <span className="flex items-center gap-1.5 font-extrabold">
                                <Ticket className="w-3.5 h-3.5 text-emerald-400" />
                                Have a Marketer Discount Code?
                              </span>
                              <span className="text-[10px] text-emerald-400 font-black uppercase">(Save ₦5,000)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Enter Code (e.g. AMAKA2026)"
                                value={promoInput}
                                onChange={(e) => {
                                  setPromoInput(e.target.value.toUpperCase());
                                  setPromoMsg(null);
                                }}
                                className="flex-1 px-3 py-1.5 rounded-xl bg-black/60 border border-emerald-500/30 text-white text-xs font-mono font-bold uppercase focus:outline-none focus:border-emerald-400"
                              />
                              <button
                                type="button"
                                onClick={handleApplyPromoCode}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs transition-colors cursor-pointer shrink-0"
                              >
                                Apply
                              </button>
                            </div>
                            {promoMsg && (
                              <p className={`text-[11px] font-bold ${promoMsg.includes('✅') ? 'text-emerald-300' : 'text-amber-300'}`}>
                                {promoMsg}
                              </p>
                            )}
                          </div>
                        )}

                        <a
                          href={(liveTicket.referralCode || (liveTicket.discountAppliedNGN && liveTicket.discountAppliedNGN > 0) || liveTicket.amountPaid === '₦20,000') ? discountPaymentLink : elitePaymentLink}
                          target="_blank"
                          rel="noreferrer"
                          id="delegate-flutterwave-payment-btn"
                          className="w-full py-4 px-6 rounded-2xl font-black text-base sm:text-lg uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl cursor-pointer text-center transition-all hover:scale-[1.01] bg-gradient-to-r from-[#fb923c] via-amber-400 to-[#f59e0b] hover:from-[#f97316] hover:to-amber-300 text-black shadow-amber-950/60"
                        >
                          <CreditCard className="w-6 h-6" />
                          <span>MAKE PAYMENT ON FLUTTERWAVE ({(liveTicket.referralCode || (liveTicket.discountAppliedNGN && liveTicket.discountAppliedNGN > 0) || liveTicket.amountPaid === '₦20,000') ? '₦20,000' : (liveTicket.amountPaid && liveTicket.amountPaid !== '₦25,000' ? liveTicket.amountPaid : '₦25,000')})</span>
                          <ExternalLink className="w-5 h-5 ml-1" />
                        </a>
                        <p className="text-[11px] text-amber-300/90 text-center font-semibold">
                          Official RECON Expo 2026 Flutterwave Gateway • Pay {(liveTicket.referralCode || (liveTicket.discountAppliedNGN && liveTicket.discountAppliedNGN > 0) || liveTicket.amountPaid === '₦20,000') ? '₦20,000 / $20 (₦5k Promo Discount Applied)' : (liveTicket.amountPaid && liveTicket.amountPaid !== '₦25,000' ? liveTicket.amountPaid : '₦25,000 / $25')}
                        </p>
                      </div>
                    )
                  )}

                  {/* 2. ID CARD BUTTON */}
                  {isCorporate ? (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
                      <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Super Admin Secretariat Badge Issuance</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Official ID cards for Exhibitors, Sponsors, and Strategic Partners are generated and issued exclusively by the <strong>Super Admin Secretariat</strong>.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <button
                        type="button"
                        id="delegate-get-vip-guest-pass-btn"
                        onClick={() => {
                          if (isApproved) {
                            const nextState = !isViewingCard;
                            setIsViewingCard(nextState);
                            // Auto open photo snap studio if no photo is attached yet
                            if (nextState && !liveTicket.photoUrl && !liveTicket.avatarUrl) {
                              setIsSnappingPhoto(true);
                            }
                          } else {
                            alert(
                              '🔒 GET VIP GUEST PASS — ADMIN APPROVAL REQUIRED\n\nAdmin payment approval is required before your VIP Guest Pass can be activated.\n\nInstructions:\n1. Click "MAKE PAYMENT ON FLUTTERWAVE" above to pay.\n2. Once approved by the RECON Secretariat in the Admin Dashboard, click "Re-Check Status".\n3. Your VIP Guest Pass will instantly unlock for photo capture & digital preview! (Official physical RFID Smart ID badges are issued by the Secretariat at the VIP Accreditation desk).'
                            );
                          }
                        }}
                        className={`w-full py-4 px-6 rounded-2xl transition-all flex flex-col items-center justify-center gap-1 cursor-pointer shadow-xl border ${
                          isApproved
                            ? 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-black border-emerald-300/50 shadow-emerald-950/80 hover:scale-[1.01]'
                            : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/40 shadow-amber-950/40'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-black text-base sm:text-xl tracking-wider">
                          {isApproved ? <QrCode className="w-6 h-6 text-black" /> : <Lock className="w-5 h-5 text-amber-400" />}
                          <span className="font-heading">
                            {isViewingCard ? 'HIDE VIP GUEST PASS' : 'GET VIP GUEST PASS'}
                          </span>
                          {isApproved ? <Sparkles className="w-5 h-5 text-black" /> : <ShieldAlert className="w-4 h-4 text-amber-400" />}
                        </div>
                        <span className="text-xs text-slate-200 normal-case font-normal tracking-normal">
                          {isApproved
                            ? '(payment approved — click to snap photo, preview & download your official VIP pass)'
                            : '(requires admin payment approval before VIP pass activation)'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* SMART ID CARD & PHOTO CAPTURE DISPLAY AREA */}
              {isApproved && liveTicket && isViewingCard && (
                <div className="pt-2 border-t border-white/10 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-emerald-400" />
                      Official VIP Guest Pass Smart Badge
                    </h4>
                    
                    <button
                      type="button"
                      onClick={() => setIsSnappingPhoto(prev => !prev)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-amber-400" />
                      <span>{isSnappingPhoto ? 'Close Camera Studio' : '📸 Snap / Change Pass Photo'}</span>
                    </button>
                  </div>

                  {/* Camera Snap Studio Accordion */}
                  {isSnappingPhoto && (
                    <div className="p-4 rounded-3xl bg-black/80 border-2 border-amber-500/50 space-y-3 animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <h5 className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-2">
                          <Camera className="w-4 h-4 text-amber-400" />
                          Snap or Upload Official Pass Photo
                        </h5>
                        <button
                          onClick={() => setIsSnappingPhoto(false)}
                          className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-white/10 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      <PhotoCaptureStudio
                        fullName={liveTicket.fullName}
                        currentPhotoUrl={liveTicket.photoUrl || liveTicket.avatarUrl}
                        onPhotoSelected={(newUrl) => {
                          updateAttendee(liveTicket.ticketNumber, { 
                            photoUrl: newUrl, 
                            avatarUrl: newUrl 
                          });
                          const updated = { 
                            ...liveTicket, 
                            photoUrl: newUrl, 
                            avatarUrl: newUrl 
                          };
                          setLoggedInTicket(updated);
                          try {
                            localStorage.setItem(LOCAL_STORAGE_LOGGED_IN_KEY, JSON.stringify(updated));
                          } catch {
                            // safe
                          }
                          setIsSnappingPhoto(false);
                          setStatusMessage('✅ Photo snapped & saved! Your VIP Guest Pass ID Card is updated below.');
                          setTimeout(() => setStatusMessage(null), 5000);
                        }}
                      />
                    </div>
                  )}

                  {/* Generated Smart ID Card Component */}
                  <div className="bg-black/60 p-6 sm:p-8 rounded-3xl border border-emerald-500/40 flex justify-center">
                    <SmartIdCard ticket={liveTicket} isAdmin={false} />
                  </div>
                </div>
              )}

              {/* Corporate Staff Badges Management (for Exhibitor, Sponsor, Partner or multi-badge pass) */}
              {(liveTicket.passType === 'exhibitor' || liveTicket.passType === 'sponsor' || liveTicket.passType === 'partner' || (liveTicket.maxStaffBadges && liveTicket.maxStaffBadges > 1)) && (
                <div className="pt-2 border-t border-white/10">
                  {isApproved ? (
                    <CompanyStaffBadgeManager
                      ticket={liveTicket}
                      isAdmin={false}
                      onUpdateTicket={(tNum, updated) => {
                        updateAttendee(tNum, updated);
                        const fresh = { ...liveTicket, ...updated };
                        setLoggedInTicket(fresh);
                        try {
                          localStorage.setItem(LOCAL_STORAGE_LOGGED_IN_KEY, JSON.stringify(fresh));
                        } catch {
                          // safe
                        }
                      }}
                      showToast={(msg) => {
                        setStatusMessage(msg);
                        setTimeout(() => setStatusMessage(null), 4000);
                      }}
                    />
                  ) : (
                    <div className="p-5 rounded-3xl bg-amber-500/10 border-2 border-amber-500/40 text-center space-y-3 shadow-xl">
                      <div className="flex items-center justify-center gap-2 text-amber-300 font-extrabold text-sm sm:text-base uppercase tracking-wider font-heading">
                        <Lock className="w-5 h-5 text-amber-400" />
                        <span>Extra Staff ID Card Assignment Locked</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed max-w-lg mx-auto font-medium">
                        Exhibitors, Sponsors, and Partners must complete their registration payment and receive official payment confirmation from the RECON Secretariat before extra staff ID cards can be assigned and generated for team members.
                      </p>
                      <div className="pt-1 flex justify-center">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 shadow-sm">
                          <ShieldAlert className="w-4 h-4 text-amber-400" />
                          <span>Status: Awaiting Payment &amp; Admin Confirmation</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Profile Overview Details */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-amber-400" />
                  Registration Account Credentials:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Full Name:</span>
                    <strong className="text-white text-sm block mt-0.5">{liveTicket.fullName}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone Number:</span>
                    <strong className="text-white text-sm block mt-0.5">{liveTicket.phone}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Organization:</span>
                    <strong className="text-slate-200 block mt-0.5">{liveTicket.organization}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Designation / Role:</span>
                    <strong className="text-slate-200 block mt-0.5">{liveTicket.role}</strong>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-[#012217] p-4 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>RECON Expo 2026 Secretariat • Registration Security System</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs cursor-pointer transition-colors w-full sm:w-auto text-center"
          >
            Close Account Portal
          </button>
        </div>

      </div>
    </div>
  );
};
