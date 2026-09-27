import React, { useState } from 'react';
import { useExpoData } from '../context/ExpoDataContext';
import { MarketerAccount, CommissionPaymentConfirmation, AttendeeTicket } from '../types';
import { trackPixelEvent } from '../services/pixelTrackingService';
import { 
  DollarSign, 
  Users, 
  Share2, 
  Wallet, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  Lock, 
  UserPlus, 
  LogIn, 
  Gift, 
  TrendingUp, 
  X,
  CreditCard,
  Building,
  User,
  Mail,
  Phone,
  Key,
  Receipt,
  FileCheck,
  Printer,
  Download,
  BadgeCheck,
  Calendar,
  Clock,
  ArrowDownRight,
  ExternalLink,
  Shield,
  HelpCircle,
  AlertTriangle,
  RotateCcw,
  Store
} from 'lucide-react';

interface BecomeMarketerSectionProps {
  onOpenRegister?: (tier?: string) => void;
}

export const BecomeMarketerSection: React.FC<BecomeMarketerSectionProps> = ({ onOpenRegister }) => {
  const { marketerAccounts, registerMarketer, attendees, confirmCommissionPayment, resetMarketerDashboard, marketerAuth, expoDetails } = useExpoData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'register' | 'login' | 'dashboard'>('register');
  const [dashboardSubTab, setDashboardSubTab] = useState<'referrals' | 'confirmations'>('referrals');

  // Registration Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [notes, setNotes] = useState('');

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Active Marketer Session
  const [activeMarketerId, setActiveMarketerId] = useState<string | null>(null);

  // Commission Payment Confirmation States
  const [selectedConfirmation, setSelectedConfirmation] = useState<CommissionPaymentConfirmation | null>(null);
  const [isRequestingPayout, setIsRequestingPayout] = useState(false);
  const [requestAmount, setRequestAmount] = useState<string>('');
  const [requestNotes, setRequestNotes] = useState<string>('');
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  // Status & Feedback Messages
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedExhibitorLink, setCopiedExhibitorLink] = useState(false);

  // Derive current marketer object accurately from state
  const currentMarketer: MarketerAccount | null = activeMarketerId
    ? (marketerAccounts.find(m => m.id === activeMarketerId) || null)
    : (marketerAuth?.isAuthenticated && marketerAuth.marketer ? marketerAuth.marketer : null);

  // Handle Marketer Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!fullName.trim() || !email.trim() || !phone.trim() || !referralCode.trim() || !username.trim() || !password.trim()) {
      setFormError('Please fill in all required fields (Name, Email, Phone, Referral Code, Username & Password).');
      return;
    }

    const cleanCode = referralCode.trim().toUpperCase();

    const result = registerMarketer({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      referralCode: cleanCode,
      username: username.trim(),
      password: password.trim(),
      bankDetails: {
        bankName: bankName.trim() || 'Access Bank Nigeria',
        accountNumber: accountNumber.trim() || '0123456789',
        accountName: accountName.trim() || fullName.trim()
      },
      status: 'PENDING',
      notes: notes.trim()
    });

    if (result.success && result.marketer) {
      try {
        trackPixelEvent({
          eventName: 'Lead',
          contentName: `Affiliate Marketer Signup: @${username.trim()}`,
          category: 'Marketer Partner Signup',
          email: email.trim(),
          phone: phone.trim(),
          customData: {
            referralCode: cleanCode,
            role: 'Marketer Partner'
          }
        });
      } catch {
        // safe
      }

      setFormSuccess(`🎉 Registration Submitted Successfully! Your marketer account request (@${username.trim()}, Referral Code: "${cleanCode}") has been submitted to the RECON 2026 Admin Secretariat for confirmation. Once approved by an Admin, you will be able to log in to your dashboard.`);
      setModalTab('login');
      setLoginIdentifier(username.trim());
    } else {
      setFormError(result.message || 'Failed to create marketer account.');
    }
  };

  // Handle Marketer Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const query = loginIdentifier.trim().toLowerCase();
    if (!query || !loginPassword.trim()) {
      setFormError('Please enter your Username/Referral Code and Password.');
      return;
    }

    const found = marketerAccounts.find(m => 
      (m.username && m.username.toLowerCase() === query) ||
      (m.referralCode && m.referralCode.toLowerCase() === query) ||
      (m.email && m.email.toLowerCase() === query)
    );

    if (!found) {
      setFormError('No marketer account found with that Username, Email, or Referral Code.');
      return;
    }

    if (found.password && found.password !== loginPassword.trim()) {
      setFormError('Incorrect password. Please verify your credentials.');
      return;
    }

    if (found.status === 'PENDING') {
      setFormError('⏳ Your marketer account registration is pending Admin Secretariat confirmation. Please wait for an Admin to review and confirm your account.');
      return;
    }

    if (found.status === 'SUSPENDED') {
      setFormError('🔒 This marketer account has been SUSPENDED by the Admin Secretariat.');
      return;
    }

    setActiveMarketerId(found.id);
    setModalTab('dashboard');
    setFormSuccess(`Welcome back, ${found.fullName}!`);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyDirectLink = (code: string) => {
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://reconexpo.afrinetgroup.com';
    const url = `${origin}/?ref=${code}#registration`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyExhibitorLink = (code: string) => {
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://reconexpo.afrinetgroup.com';
    const url = `${origin}/?ref=${code}&tier=exhibitor#registration`;
    navigator.clipboard.writeText(url);
    setCopiedExhibitorLink(true);
    setTimeout(() => setCopiedExhibitorLink(false), 2500);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(id);
    setTimeout(() => setCopiedRef(null), 2500);
  };

  // Helper to accurately derive commission per referred attendee (₦5,000 for VIP, 10% for Exhibitor Booth Stand)
  const getAttendeeCommission = (a: AttendeeTicket): number => {
    if (typeof a.commissionEarnedNGN === 'number' && a.commissionEarnedNGN > 0) {
      return a.commissionEarnedNGN;
    }
    const isExh = a.passType === 'exhibitor' || (a.tier && a.tier.toLowerCase().includes('exhibitor'));
    if (isExh) {
      const amount = typeof a.dealValue === 'number' && a.dealValue > 0 
        ? a.dealValue 
        : (parseInt((a.amountPaid || '').replace(/[^0-9]/g, ''), 10) || 350000);
      return Math.round(amount * 0.10);
    }
    const isElt = a.passType === 'elite' || (a.tier && a.tier.toLowerCase().includes('elite'));
    if (isElt) {
      return 5000;
    }
    return 0;
  };

  // Calculate referred attendees for active marketer
  const myReferredAttendees = currentMarketer 
    ? attendees.filter(a => 
        (a.referralCode || '').toUpperCase() === currentMarketer.referralCode.toUpperCase() || 
        a.marketerId === currentMarketer.id
      )
    : [];

  const myApprovedAttendees = myReferredAttendees.filter(a =>
    (a.adminApproved === true || a.adminApprovalStatus === 'APPROVED') &&
    (a.paymentStatus === 'PAID' || a.paymentStatus === 'VERIFIED')
  );

  const myPendingApprovalAttendees = myReferredAttendees.filter(a =>
    !((a.adminApproved === true || a.adminApprovalStatus === 'APPROVED') &&
      (a.paymentStatus === 'PAID' || a.paymentStatus === 'VERIFIED'))
  );

  // Total approved commissions (where Admin approved registration payment)
  const myApprovedTotalEarnings = currentMarketer 
    ? myApprovedAttendees.reduce((sum, a) => sum + getAttendeeCommission(a), 0)
    : 0;

  const myPendingApprovalCommission = myPendingApprovalAttendees.reduce((sum, a) => sum + getAttendeeCommission(a), 0);

  const myPaidEarnings = currentMarketer?.paidEarningsNGN || 0;
  const myPendingEarnings = Math.max(0, myApprovedTotalEarnings - myPaidEarnings);
  const paymentConfirmations = currentMarketer?.paymentConfirmations || [];

  // Handle Requesting Commission Payment Confirmation
  const handleConfirmPayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMarketer) return;

    if (myPendingEarnings <= 0) {
      setFormError(
        myPendingApprovalAttendees.length > 0
          ? `🔒 Before a marketer receives any commissions, the Admin must approve payment from registration first. You have ${myPendingApprovalAttendees.length} referral(s) currently awaiting Admin payment clearance.`
          : 'No approved commissions available for payout. Registrations must be approved by the Admin first.'
      );
      return;
    }

    const parsed = requestAmount ? parseFloat(requestAmount) : myPendingEarnings;
    if (parsed <= 0 || parsed > myPendingEarnings) {
      setFormError(`Please enter a valid payout amount (Maximum approved available: ₦${myPendingEarnings.toLocaleString()}).`);
      return;
    }

    const res = confirmCommissionPayment(
      currentMarketer.id,
      parsed,
      requestNotes || `Official commission payment confirmation generated by ${currentMarketer.fullName}.`
    );

    if (res.success && res.confirmation) {
      setIsRequestingPayout(false);
      setRequestAmount('');
      setRequestNotes('');
      setFormSuccess(res.message);
      setSelectedConfirmation(res.confirmation);
      setDashboardSubTab('confirmations');
    } else {
      setFormError(res.message || 'Failed to process commission confirmation.');
    }
  };

  // Download official voucher as formatted text/receipt
  const handleDownloadConfirmationReceipt = (conf: CommissionPaymentConfirmation) => {
    const content = `
================================================================================
           RECON 2026 • OFFICIAL COMMISSION PAYMENT CONFIRMATION RECEIPT
        Federal Republic of Nigeria • Real Estate & Construction Expo 2026
================================================================================

TRANSACTION DETAILS:
--------------------------------------------------------------------------------
Official Confirmation Ref : ${conf.referenceNumber}
Payment Status            : ${conf.status} (VERIFIED & CLEARED)
Payment Channel           : ${conf.paymentMethod}
Date & Timestamp          : ${new Date(conf.paidAt).toLocaleString()}
Authorized By             : ${conf.confirmedBy}

BENEFICIARY MARKETER:
--------------------------------------------------------------------------------
Marketer Full Name        : ${conf.marketerName}
Referral Promo Code       : ${conf.referralCode}
Bank Destination          : ${conf.bankName}
Account Number            : ${conf.accountNumber}
Account Name              : ${conf.accountName}

FINANCIAL SETTLEMENT:
--------------------------------------------------------------------------------
Net Commission Paid       : NGN ${conf.amountNGN.toLocaleString()}.00
Referred Delegates Covered: ${conf.referralCountCovered || 1} Registrations
Memo / Notes              : ${conf.notes || 'Official commission payout cleared and verified.'}

================================================================================
This is a digitally certified commission payment confirmation issued by the 
RECON 2026 Executive Planning Committee & Finance Secretariat.
Official Portal: https://reconexpo.afrinetgroup.com
================================================================================
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `RECON_Commission_Payment_${conf.referenceNumber}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Print voucher
  const handlePrintVoucher = () => {
    window.print();
  };

  return (
    <section id="become-marketer" className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-b from-[#02180e] via-[#012b1d] to-[#02180e]">
      {/* Background Lighting Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-widest shadow-lg">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>{expoDetails.siteTexts?.marketerBadge || "AFFILIATE & PARTNERSHIP PROGRAM"}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white font-heading tracking-tight leading-tight">
            {expoDetails.siteTexts?.marketerHeading || "Become a Marketer ( Make Money by Referrals )"}
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans">
            {expoDetails.siteTexts?.marketerSubtitle || "Join the official RECON 2026 Affiliate Network. Generate passive income by inviting real estate professionals, delegates, exhibitors, and investors. Earn guaranteed commissions paid directly to your bank account!"}
          </p>
        </div>

        {/* 4 Feature Highlights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          
          {/* Card 1 */}
          <div className="bg-[#02251a]/80 border border-emerald-500/30 rounded-3xl p-6 hover:border-emerald-400/60 transition-all duration-300 shadow-xl group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-emerald-950/60 mb-5 group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white font-heading mb-2">
              {expoDetails.siteTexts?.marketerCard1Title || "₦5,000 Commission"}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {expoDetails.siteTexts?.marketerCard1Desc || "Earn an instant ₦5,000 naira payout for every Executive VIP delegate or paid attendee who registers using your referral code."}
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#02251a]/80 border border-amber-500/30 rounded-3xl p-6 hover:border-amber-400/60 transition-all duration-300 shadow-xl group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-950/60 mb-5 group-hover:scale-110 transition-transform">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white font-heading mb-2">
              {expoDetails.siteTexts?.marketerCard2Title || "10% Exhibitor Commission"}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {expoDetails.siteTexts?.marketerCard2Desc || "Earn guaranteed 10% cash commission on every Exhibitor Booth Stand booked through your referral code or link (₦35,000 to ₦150,000+ per booth)."}
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#02251a]/80 border border-cyan-500/30 rounded-3xl p-6 hover:border-cyan-400/60 transition-all duration-300 shadow-xl group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-cyan-950/60 mb-5 group-hover:scale-110 transition-transform">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white font-heading mb-2">
              {expoDetails.siteTexts?.marketerCard3Title || "Custom Promo Code"}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {expoDetails.siteTexts?.marketerCard3Desc || "Choose your personalized promo code (e.g. VIP-DAVID). Share it on WhatsApp, Social Media, or Email!"}
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-[#02251a]/80 border border-purple-500/30 rounded-3xl p-6 hover:border-purple-400/60 transition-all duration-300 shadow-xl group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-purple-950/60 mb-5 group-hover:scale-110 transition-transform">
              <Wallet className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white font-heading mb-2">
              {expoDetails.siteTexts?.marketerCard4Title || "Direct Bank Payouts"}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {expoDetails.siteTexts?.marketerCard4Desc || "Provide your Nigerian bank account details during sign up. Commissions are processed and paid directly to your account."}
            </p>
          </div>

        </div>

        {/* CTA Banner Box */}
        <div className="bg-gradient-to-r from-emerald-950 via-[#013526] to-slate-950 border-2 border-emerald-500/40 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" /> {expoDetails.siteTexts?.marketerCtaBadge || "Start Earning Money Today"}
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white font-heading leading-tight">
              {expoDetails.siteTexts?.marketerCtaHeading || `Ready to start earning with ${expoDetails.shortName || "RECON 2026"}?`}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {expoDetails.siteTexts?.marketerCtaSubtitle || "Sign up as an official marketer in less than 60 seconds. Get your custom code and start inviting delegates now."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-shrink-0">
            <button
              onClick={() => {
                setModalTab('register');
                setIsModalOpen(true);
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:brightness-110 text-slate-950 font-black text-sm tracking-wide transition-all shadow-xl shadow-emerald-950/80 flex items-center justify-center gap-2.5 cursor-pointer active:scale-95"
            >
              <UserPlus className="w-5 h-5" />
              <span>{expoDetails.siteTexts?.marketerBtnRegister || "Become a Marketer Now"}</span>
            </button>

            <button
              onClick={() => {
                setModalTab('login');
                setIsModalOpen(true);
              }}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm transition-all border border-white/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <LogIn className="w-5 h-5 text-emerald-400" />
              <span>{expoDetails.siteTexts?.marketerBtnLogin || "Marketer Login"}</span>
            </button>
          </div>

        </div>

      </div>

      {/* MARKETER REGISTRATION & DASHBOARD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="bg-[#011e15] border-2 border-emerald-500/50 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-white relative space-y-6 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white font-heading">
                    {modalTab === 'register' && 'Register as an Official Marketer'}
                    {modalTab === 'login' && 'Marketer Portal Login'}
                    {modalTab === 'dashboard' && 'Your Marketer Affiliate Dashboard'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {modalTab === 'register' && 'Make money by referring delegates to RECON 2026'}
                    {modalTab === 'login' && 'Access your earnings, referral stats, and promo code'}
                    {modalTab === 'dashboard' && `Welcome back, ${currentMarketer?.fullName || 'Marketer'}!`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 text-slate-400 hover:text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error / Success Feedback Alerts */}
            {formError && (
              <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-semibold flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && modalTab !== 'dashboard' && (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{formSuccess}</span>
              </div>
            )}

            {/* MODAL TAB 1: REGISTRATION FORM */}
            {modalTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="e.g. Chidi Okafor"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="e.g. chidi@example.com"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">WhatsApp / Phone *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="e.g. +234 801 234 5678"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Custom Promo Code *</label>
                    <div className="relative">
                      <Gift className="w-4 h-4 absolute left-3 top-3 text-emerald-400" />
                      <input
                        type="text"
                        required
                        value={referralCode}
                        onChange={e => setReferralCode(e.target.value.toUpperCase())}
                        placeholder="e.g. VIP-CHIDI"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/50 border border-emerald-500/50 text-emerald-300 font-mono font-bold uppercase placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Username (for Login) *</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="e.g. chidi_marketer"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Password *</label>
                    <div className="relative">
                      <Key className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <h4 className="font-bold text-amber-300 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Bank Account Details (For Commission Payouts)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Bank Name</label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={e => setBankName(e.target.value)}
                        placeholder="e.g. GTBank / Zenith"
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white placeholder-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Account Number</label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={e => setAccountNumber(e.target.value)}
                        placeholder="0123456789"
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono placeholder-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Account Name</label>
                      <input
                        type="text"
                        value={accountName}
                        onChange={e => setAccountName(e.target.value)}
                        placeholder="Name on Account"
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white placeholder-slate-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setModalTab('login')}
                    className="text-emerald-400 hover:text-emerald-300 text-xs font-bold underline"
                  >
                    Already registered? Log in here
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition-all shadow-lg cursor-pointer"
                  >
                    Register & Get Promo Code
                  </button>
                </div>
              </form>
            )}

            {/* MODAL TAB 2: LOGIN FORM */}
            {modalTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Username or Promo Code *</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={e => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. chidi_marketer or VIP-CHIDI"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Password *</label>
                  <div className="relative">
                    <Key className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setModalTab('register')}
                    className="text-emerald-400 hover:text-emerald-300 text-xs font-bold underline"
                  >
                    Need a new marketer account? Register here
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition-all shadow-lg cursor-pointer"
                  >
                    Log In to Dashboard
                  </button>
                </div>
              </form>
            )}

            {/* MODAL TAB 3: MARKETER DASHBOARD */}
            {modalTab === 'dashboard' && currentMarketer && (
              <div className="space-y-6 text-xs animate-fade-in">
                
                {/* Marketer Dashboard Header Banner with Reset Action */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-black to-slate-900 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Marketer Portal</div>
                    <div className="text-white font-extrabold text-sm flex items-center gap-2">
                      <span>{currentMarketer.fullName}</span>
                      <span className="text-emerald-400 font-mono text-xs font-bold">({currentMarketer.referralCode})</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to reset the marketer dashboard for "${currentMarketer.fullName}" (${currentMarketer.referralCode}) to ₦0? All referral earnings and metrics will be reset to zero.`)) {
                        const res = resetMarketerDashboard(currentMarketer.id);
                        setFormSuccess(res.message);
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                    title="Reset dashboard metrics and referral earnings to ₦0"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-red-400" />
                    <span>Reset Dashboard to ₦0</span>
                  </button>
                </div>

                {/* Navigation Sub-Tabs inside Marketer Portal */}
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setDashboardSubTab('referrals')}
                    className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      dashboardSubTab === 'referrals'
                        ? 'bg-emerald-500 text-black shadow-lg'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Referrals & Promo Code</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      dashboardSubTab === 'referrals' ? 'bg-black/20 text-black' : 'bg-white/10 text-slate-300'
                    }`}>
                      {myReferredAttendees.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDashboardSubTab('confirmations')}
                    className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      dashboardSubTab === 'confirmations'
                        ? 'bg-emerald-500 text-black shadow-lg'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Commission Confirmations</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      dashboardSubTab === 'confirmations' ? 'bg-black/20 text-black' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {paymentConfirmations.length}
                    </span>
                  </button>
                </div>

                {/* SUBTAB 1: REFERRALS & PROMO CODE */}
                {dashboardSubTab === 'referrals' && (
                  <div className="space-y-5">
                    {/* Promo Code Share Banner */}
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#013b2b] to-black border border-emerald-400/50 space-y-3 shadow-xl">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Gift className="w-3.5 h-3.5 text-emerald-400" />
                          YOUR EXCLUSIVE REFERRAL PROMO CODE & LINKS
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                            ₦5,000 / VIP Delegate
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold">
                            Commission: 10% / Exhibitor Booth Stand
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <div className="flex-1 bg-black/70 border border-emerald-500/50 rounded-xl px-4 py-3 text-xl font-mono font-black text-emerald-300 tracking-widest text-center sm:text-left select-all">
                          {currentMarketer.referralCode}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopyCode(currentMarketer.referralCode)}
                            className="px-3.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg text-xs"
                          >
                            {copiedCode ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
                            <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyDirectLink(currentMarketer.referralCode)}
                            className="px-3.5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs"
                            title="Copy direct registration link with code auto-applied"
                          >
                            {copiedLink ? <Check className="w-4 h-4 text-cyan-300" /> : <Share2 className="w-4 h-4" />}
                            <span>{copiedLink ? 'VIP Link Copied!' : 'VIP Pass Link'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyExhibitorLink(currentMarketer.referralCode)}
                            className="px-3.5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs"
                            title="Copy direct exhibitor stand booking link with code auto-applied (Commission: 10%)"
                          >
                            {copiedExhibitorLink ? <Check className="w-4 h-4 text-amber-300" /> : <Store className="w-4 h-4" />}
                            <span>{copiedExhibitorLink ? 'Booth Link Copied!' : 'Exhibitor Stand Link (Commission: 10%)'}</span>
                          </button>

                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(`🏛️ Exhibit at RECON Expo Abuja 2026 (29th – 30th Oct 2026 at Shehu Musa Yar'Adua Centre). Book your Exhibition Booth Stand online using my referral link here:\n${typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://reconexpo.afrinetgroup.com'}/?ref=${currentMarketer.referralCode}&tier=exhibitor#registration`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs"
                            title="Share Exhibitor Booth Stand booking link on WhatsApp (Earn 10% Commission)"
                          >
                            <Phone className="w-4 h-4 text-emerald-300" />
                            <span>Share Booth Link</span>
                          </a>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Share your links with delegates (₦5,000 commission) and property developers, equipment brands, and construction exhibitors (guaranteed <strong className="text-amber-300 font-bold">Commission: 10%</strong> on booth bookings = ₦35,000 to ₦150,000+ per booking).
                      </p>
                    </div>

                    {/* Financial & Referrals KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1">
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Total Referrals</span>
                        <div className="text-2xl font-black text-emerald-400 font-mono">{myReferredAttendees.length}</div>
                        <p className="text-[10px] text-slate-400">Referred registrations</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-black/50 border border-emerald-500/30 space-y-1">
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Approved Commission</span>
                        <div className="text-2xl font-black text-emerald-300 font-mono">₦{myApprovedTotalEarnings.toLocaleString()}</div>
                        <p className="text-[10px] text-emerald-400/80">Payment verified by Admin</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-black/50 border border-amber-500/30 space-y-1">
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Awaiting Approval</span>
                        <div className="text-2xl font-black text-amber-300 font-mono">₦{myPendingApprovalCommission.toLocaleString()}</div>
                        <p className="text-[10px] text-amber-400/80">{myPendingApprovalAttendees.length} registration(s) on hold</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1">
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Paid to Bank</span>
                        <div className="text-2xl font-black text-cyan-300 font-mono">₦{myPaidEarnings.toLocaleString()}</div>
                        <p className="text-[10px] text-cyan-400/80 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {paymentConfirmations.length} Voucher(s)
                        </p>
                      </div>
                    </div>

                    {/* Notice if any referrals are awaiting admin payment approval */}
                    {myPendingApprovalAttendees.length > 0 && (
                      <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-3 text-xs text-slate-300">
                        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <div className="text-amber-300 font-bold text-xs">Payment Approval Required:</div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            Before a marketer receives any commissions, the RECON 2026 Admin Secretariat must review and approve payment from the attendee's registration first. You have <strong className="text-white font-bold">{myPendingApprovalAttendees.length}</strong> referred registration(s) (worth <strong className="text-amber-300 font-bold">₦{myPendingApprovalCommission.toLocaleString()}</strong>) currently awaiting Admin verification. Once approved, funds move immediately into your approved withdrawable balance.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Referred Delegates List */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-sm flex items-center gap-2">
                          <Users className="w-4 h-4 text-emerald-400" />
                          Delegates Registered Under Your Code ({myReferredAttendees.length})
                        </h4>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Auto-tracked in real-time
                        </span>
                      </div>

                      {myReferredAttendees.length === 0 ? (
                        <div className="p-8 text-center rounded-2xl bg-black/30 border border-white/10 text-slate-400 space-y-3">
                          <Users className="w-8 h-8 text-slate-600 mx-auto" />
                          <p className="font-bold text-white text-sm">No referrals recorded yet under code "{currentMarketer.referralCode}"</p>
                          <p className="text-xs text-slate-400 max-w-sm mx-auto">
                            Share your promo code or referral link across WhatsApp groups, LinkedIn, Twitter/X, and construction networks to start generating instant ₦5,000 commissions.
                          </p>
                          <button
                            type="button"
                            onClick={() => handleCopyDirectLink(currentMarketer.referralCode)}
                            className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 font-bold inline-flex items-center gap-2 cursor-pointer transition-all"
                          >
                            <Share2 className="w-4 h-4" /> Copy Direct Referral Link
                          </button>
                        </div>
                      ) : (
                        <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                          {myReferredAttendees.map((att, idx) => {
                            const isApproved = (att.adminApproved === true || att.adminApprovalStatus === 'APPROVED') && (att.paymentStatus === 'PAID' || att.paymentStatus === 'VERIFIED');
                            return (
                              <div key={idx} className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-emerald-500/30 transition-all">
                                <div>
                                  <div className="font-bold text-white flex items-center gap-2 flex-wrap">
                                    <span>{att.fullName}</span>
                                    {att.organization && (
                                      <span className="text-[10px] text-slate-400 font-normal">({att.organization})</span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-400 mt-0.5">
                                    {att.email} • <span className="text-purple-300 font-medium">{att.tier || 'VIP Delegate'}</span>
                                    {(att.passType === 'exhibitor' || (att.tier && att.tier.toLowerCase().includes('exhibitor'))) && (
                                      <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold">
                                        10% BOOTH COMMISSION
                                      </span>
                                    )}
                                    {att.registeredAt && ` • ${new Date(att.registeredAt).toLocaleDateString()}`}
                                  </div>
                                </div>
                                <div className="text-left sm:text-right flex sm:flex-col items-start sm:items-end justify-between gap-1 border-t sm:border-t-0 border-white/5 pt-1 sm:pt-0">
                                  <div className={`font-black font-mono text-sm ${isApproved ? 'text-emerald-400' : 'text-amber-300'}`}>
                                    {isApproved ? '+' : ''}₦{getAttendeeCommission(att).toLocaleString()}
                                  </div>
                                  {isApproved ? (
                                    <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold flex items-center gap-1">
                                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                                      PAYMENT APPROVED (COMMISSION CREDITED)
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold flex items-center gap-1" title="Admin must approve payment from registration before commission is released">
                                      <Clock className="w-2.5 h-2.5 text-amber-400" />
                                      AWAITING ADMIN PAYMENT APPROVAL
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SUBTAB 2: COMMISSION PAYMENT CONFIRMATIONS */}
                {dashboardSubTab === 'confirmations' && (
                  <div className="space-y-5">
                    {/* Financial Settlement Overview Card */}
                    <div className="p-5 rounded-2xl bg-black/60 border border-emerald-500/40 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Commission Settlement Ledger</span>
                          <h4 className="text-base font-extrabold text-white flex items-center gap-2 mt-0.5">
                            <Wallet className="w-4 h-4 text-amber-400" />
                            Direct Bank Payment Status
                          </h4>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase flex items-center gap-1.5 ${
                            myPendingEarnings === 0 && myPaidEarnings > 0
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                              : myPaidEarnings > 0
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                          }`}>
                            <BadgeCheck className="w-3.5 h-3.5" />
                            {myPendingEarnings === 0 && myPaidEarnings > 0 ? 'Fully Paid & Confirmed' : myPaidEarnings > 0 ? 'Partially Paid' : 'Unpaid Balance'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Approved Total</span>
                          <div className="text-xl font-black text-white font-mono mt-0.5">₦{myApprovedTotalEarnings.toLocaleString()}</div>
                          <span className="text-[10px] text-emerald-400">{myApprovedAttendees.length} approved referrals</span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30">
                          <span className="text-[10px] text-amber-400 font-bold uppercase block">Pending Approval</span>
                          <div className="text-xl font-black text-amber-300 font-mono mt-0.5">₦{myPendingApprovalCommission.toLocaleString()}</div>
                          <span className="text-[10px] text-amber-400/80">{myPendingApprovalAttendees.length} awaiting Admin</span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                          <span className="text-[10px] text-emerald-400 font-bold uppercase block">Confirmed Paid</span>
                          <div className="text-xl font-black text-emerald-300 font-mono mt-0.5">₦{myPaidEarnings.toLocaleString()}</div>
                          <span className="text-[10px] text-emerald-400/80">{paymentConfirmations.length} official voucher(s)</span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30">
                          <span className="text-[10px] text-purple-400 font-bold uppercase block">Available for Payout</span>
                          <div className="text-xl font-black text-purple-300 font-mono mt-0.5">₦{myPendingEarnings.toLocaleString()}</div>
                          <span className="text-[10px] text-purple-400/80">Approved balance</span>
                        </div>
                      </div>

                      {/* Policy Reminder for Admin Payment Approval */}
                      {myPendingApprovalAttendees.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-2.5 text-xs text-slate-300">
                          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <div className="text-amber-300 font-bold text-xs">Payment Approval Notice:</div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              Before a marketer receives any commissions, the Admin must approve payment from registration first. You have <strong className="text-white font-bold">{myPendingApprovalAttendees.length}</strong> referral(s) worth <strong className="text-amber-300 font-bold">₦{myPendingApprovalCommission.toLocaleString()}</strong> awaiting payment verification. Payouts can only be requested against verified and approved registrations.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Bank Destination Card */}
                      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-300 flex items-center gap-1.5">
                            <Building className="w-3.5 h-3.5 text-emerald-400" />
                            Payout Destination Bank Account
                          </div>
                          <div className="text-white font-bold">
                            {currentMarketer.bankDetails?.bankName || 'Direct NIP Settlement Bank'} •{' '}
                            <span className="font-mono text-emerald-300">
                              {currentMarketer.bankDetails?.accountNumber || '0123456789'}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 italic">
                            Beneficiary: {currentMarketer.bankDetails?.accountName || currentMarketer.fullName}
                          </div>
                        </div>

                        {myPendingEarnings > 0 ? (
                          <button
                            type="button"
                            onClick={() => {
                              setRequestAmount(myPendingEarnings.toString());
                              setIsRequestingPayout(true);
                            }}
                            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg flex-shrink-0 active:scale-95"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>Generate Payment Confirmation (₦{myPendingEarnings.toLocaleString()})</span>
                          </button>
                        ) : (
                          <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs font-medium flex items-center gap-2">
                            <Lock className="w-3.5 h-3.5 text-slate-500" />
                            <span>{myPendingApprovalAttendees.length > 0 ? 'Commissions Locked (Awaiting Admin Approval)' : 'No Pending Balance'}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Confirmed Payments List */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-sm flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-emerald-400" />
                          Official Commission Payment Confirmations ({paymentConfirmations.length})
                        </h4>
                        <span className="text-[11px] text-emerald-400 font-bold">
                          Digitally Certified Receipts
                        </span>
                      </div>

                      {paymentConfirmations.length === 0 ? (
                        <div className="p-8 text-center rounded-2xl bg-black/30 border border-white/10 text-slate-400 space-y-3">
                          <Receipt className="w-8 h-8 text-slate-600 mx-auto" />
                          <p className="font-bold text-white text-sm">No payment confirmations generated yet</p>
                          <p className="text-xs text-slate-400 max-w-sm mx-auto">
                            When commission payouts are approved and processed to your bank account, official digitally signed payment confirmation receipts with transaction references will appear here.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setRequestAmount(myPendingEarnings > 0 ? myPendingEarnings.toString() : '15000');
                              setIsRequestingPayout(true);
                            }}
                            className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <Receipt className="w-3.5 h-3.5" /> Confirm Commission Payout
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {paymentConfirmations.map((conf) => (
                            <div
                              key={conf.id}
                              className="p-4 rounded-2xl bg-black/50 border border-white/15 hover:border-emerald-400/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-lg text-xs">
                                    {conf.referenceNumber}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                                    <BadgeCheck className="w-3 h-3" /> CONFIRMED PAID
                                  </span>
                                </div>

                                <div className="text-xs text-slate-300 flex items-center gap-3 pt-0.5">
                                  <span className="flex items-center gap-1 text-slate-400">
                                    <Calendar className="w-3 h-3 text-slate-500" />
                                    {new Date(conf.paidAt).toLocaleDateString()} at {new Date(conf.paidAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  <span className="text-slate-400 hidden sm:inline">•</span>
                                  <span className="text-slate-300 truncate max-w-xs">
                                    {conf.bankName} (Acc: {conf.accountNumber})
                                  </span>
                                </div>

                                {conf.notes && (
                                  <p className="text-[11px] text-slate-400 italic">"{conf.notes}"</p>
                                )}
                              </div>

                              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                                <div className="text-lg font-black text-amber-300 font-mono">
                                  ₦{conf.amountNGN.toLocaleString()}
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedConfirmation(conf)}
                                    className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                                    title="View Official Payment Confirmation Certificate"
                                  >
                                    <Receipt className="w-3.5 h-3.5" />
                                    <span>View Voucher</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDownloadConfirmationReceipt(conf)}
                                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all cursor-pointer"
                                    title="Download text receipt"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleCopyText(conf.referenceNumber, conf.id)}
                                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all cursor-pointer"
                                    title="Copy Payment Reference"
                                  >
                                    {copiedRef === conf.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Account Details Footer */}
                <div className="p-4 rounded-xl bg-black/30 border border-white/10 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                  <div>
                    Payout Bank: <strong className="text-white">{currentMarketer.bankDetails?.bankName || 'Access Bank'}</strong> • Acc: <strong className="text-white font-mono">{currentMarketer.bankDetails?.accountNumber || '0123456789'}</strong>
                  </div>
                  <button
                    onClick={() => {
                      setActiveMarketerId(null);
                      setModalTab('login');
                    }}
                    className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                  >
                    Log Out of Marketer Portal
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REQUEST & CONFIRM COMMISSION PAYOUT */}
      {/* ========================================================================= */}
      {isRequestingPayout && currentMarketer && (
        <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#021d12] border border-emerald-500/50 rounded-3xl p-6 shadow-2xl text-xs space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Confirm Commission Payment</h3>
                  <p className="text-[11px] text-slate-400">Generate certified payout confirmation for RECON 2026</p>
                </div>
              </div>
              <button
                onClick={() => setIsRequestingPayout(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmPayoutSubmit} className="space-y-4">
              {/* Beneficiary Details Preview */}
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold">Marketer Beneficiary:</span>
                  <span className="text-white font-bold">{currentMarketer.fullName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold">Referral Promo Code:</span>
                  <span className="font-mono text-emerald-300 font-bold">{currentMarketer.referralCode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold">Settlement Bank:</span>
                  <span className="text-slate-200">
                    {currentMarketer.bankDetails?.bankName || 'Access Bank'} - {currentMarketer.bankDetails?.accountNumber || '0123456789'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-1.5">
                  <span className="text-slate-400 font-bold">Pending Available Commission:</span>
                  <span className="text-amber-300 font-mono font-extrabold text-sm">₦{myPendingEarnings.toLocaleString()}</span>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Commission Payout Amount (₦ NGN) *
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3 top-3 text-emerald-400" />
                  <input
                    type="number"
                    required
                    min="1000"
                    step="1000"
                    value={requestAmount}
                    onChange={e => setRequestAmount(e.target.value)}
                    placeholder={myPendingEarnings > 0 ? myPendingEarnings.toString() : '15000'}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/60 border border-emerald-500/40 text-emerald-300 font-mono text-base font-bold placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Enter the amount to settle. Default is your current pending balance.
                </p>
              </div>

              {/* Memo / Notes */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Payout Reference Note / Memo (Optional)
                </label>
                <input
                  type="text"
                  value={requestNotes}
                  onChange={e => setRequestNotes(e.target.value)}
                  placeholder="e.g. Commission payout for first batch of 3 VIP delegates."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2 text-[11px] text-emerald-300">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>An official digitally certified Payment Confirmation Voucher with unique reference ID will be generated instantly.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRequestingPayout(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Confirm Commission Payout</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: OFFICIAL COMMISSION PAYMENT CONFIRMATION VOUCHER / RECEIPT */}
      {/* ========================================================================= */}
      {selectedConfirmation && (
        <div className="fixed inset-0 z-[130] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-gradient-to-b from-[#01281a] via-[#011a11] to-[#01130d] border-2 border-emerald-400/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-xs animate-scale-up">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedConfirmation(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Official Header & Crest */}
            <div className="text-center space-y-2 border-b border-emerald-500/30 pb-5">
              <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                FEDERAL REPUBLIC OF NIGERIA
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white font-display tracking-tight">
                REAL ESTATE & CONSTRUCTION EXPO (RECON 2026)
              </h2>
              <p className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                Official Commission Payment Confirmation Voucher
              </p>
            </div>

            {/* Official Watermark / Reference Badge */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-black/60 border border-emerald-500/40">
              <div className="text-center sm:text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Transaction Reference</span>
                <span className="text-base sm:text-lg font-black text-emerald-300 font-mono tracking-wider select-all">
                  {selectedConfirmation.referenceNumber}
                </span>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-black text-xs flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-emerald-400" />
                VERIFIED & CLEARED
              </div>
            </div>

            {/* Payout Amount Highlight */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#023b2b] to-black border border-emerald-400/40 text-center space-y-1">
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">NET COMMISSION PAID TO BANK</span>
              <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono">
                ₦{selectedConfirmation.amountNGN.toLocaleString()}
                <span className="text-base font-normal text-amber-400/80">.00</span>
              </div>
              <p className="text-[11px] text-slate-300 italic">
                Direct NIP Bank Transfer Instant Settlement
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-black/40 border border-white/10 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Beneficiary Marketer</span>
                <strong className="text-white font-bold block">{selectedConfirmation.marketerName}</strong>
                <span className="text-emerald-400 font-mono text-[11px] block">Promo Code: {selectedConfirmation.referralCode}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Payment Timestamp</span>
                <strong className="text-white block font-mono">
                  {new Date(selectedConfirmation.paidAt).toLocaleDateString()}
                </strong>
                <span className="text-slate-400 text-[11px] block">
                  {new Date(selectedConfirmation.paidAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>

              <div className="space-y-1 sm:col-span-2 border-t border-white/10 pt-2.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Settlement Destination Bank Account</span>
                <div className="text-white font-bold">
                  {selectedConfirmation.bankName} – <span className="font-mono text-emerald-300">{selectedConfirmation.accountNumber}</span>
                </div>
                <div className="text-slate-400 text-[11px] italic">
                  Account Name: {selectedConfirmation.accountName}
                </div>
              </div>

              {selectedConfirmation.notes && (
                <div className="space-y-1 sm:col-span-2 border-t border-white/10 pt-2 text-[11px]">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Executive Memo</span>
                  <p className="text-slate-300 italic">"{selectedConfirmation.notes}"</p>
                </div>
              )}
            </div>

            {/* Authorization Signatures Footer */}
            <div className="border-t border-emerald-500/30 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-400">
              <div className="text-center sm:text-left space-y-0.5">
                <span className="font-bold text-slate-300 block">Authorized By:</span>
                <span className="text-emerald-300 font-medium">RECON 2026 Finance Secretariat & Organizing Committee</span>
                <span className="block text-slate-500">Security Verification Hash: RECON-VERIFIED-{selectedConfirmation.id.toUpperCase()}</span>
              </div>

              <div className="w-14 h-14 rounded-xl bg-black/80 border border-emerald-400/40 flex items-center justify-center p-1.5 flex-shrink-0 text-emerald-400" title="Digital Seal">
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleCopyText(selectedConfirmation.referenceNumber, 'modal_ref')}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedRef === 'modal_ref' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRef === 'modal_ref' ? 'Ref Copied!' : 'Copy Ref'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadConfirmationReceipt(selectedConfirmation)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintVoucher}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Voucher</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
