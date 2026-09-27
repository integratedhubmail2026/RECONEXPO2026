import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { ReconLogo } from './ReconLogo';
import { SmartIdCard } from './SmartIdCard';
import { PhotoCaptureStudio } from './PhotoCaptureStudio';
import { FlutterwaveCheckoutModal } from './FlutterwaveCheckoutModal';
import { useExpoData } from '../context/ExpoDataContext';
import { AttendeeTicket, AttendeePassType, BoothPackage } from '../types';
import { DEFAULT_BOOTH_PACKAGES } from '../data/expoData';
import { getAttendeeProfilePhoto } from '../utils/avatarUtils';
import { playNotificationSound } from '../utils/soundService';
import { trackPixelEvent } from '../services/pixelTrackingService';
import {
  initializeFlutterwavePayment,
  verifyFlutterwavePayment,
  completeFlutterwavePayment,
  getFlutterwaveConfig,
  openFlutterwaveInlineCheckout,
  isValidFlutterwavePublicKey,
  preloadFlutterwaveCheckout,
  FlutterwaveConfigResponse
} from '../services/flutterwave';
import { 
  X, 
  CheckCircle2, 
  Sparkles, 
  QrCode, 
  Download, 
  Printer, 
  Calendar, 
  MapPin, 
  Building, 
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Briefcase,
  Crown,
  Check,
  CreditCard,
  Lock,
  RotateCw,
  Camera,
  Star,
  Zap,
  Award,
  FileCheck,
  Store,
  Users,
  Handshake,
  ExternalLink,
  AlertCircle,
  Ticket,
  Clock,
  ShieldAlert,
  Search,
  UserCheck,
  Key
} from 'lucide-react';

const FLUTTERWAVE_PAYMENT_LINK = 'https://flutterwave.com/pay/8psefp46habu';
const FLUTTERWAVE_DISCOUNT_PAYMENT_LINK = 'https://flutterwave.com/pay/vlg1htodborh';
const LOCAL_STORAGE_LOGGED_IN_KEY = 'recon_expo_logged_in_delegate_v1';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTier?: string; // 'attendee', 'visitor', 'elite', 'exhibitor', 'sponsor', 'partner'
  defaultDiscounted?: boolean;
  onOpenDelegatePortal?: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  defaultTier = 'visitor',
  defaultDiscounted = false,
  onOpenDelegatePortal,
}) => {
  const { tiers, boothPackages, expoDetails, registerAttendee, attendees, refreshAttendees, verifyReferralCode, addContactMessage } = useExpoData();

  // Dynamic Tier Pricing & Editable Button Labels
  const eliteTier = tiers.find(t => t.id === 'elite');
  const mainPriceNGN = eliteTier?.priceNGN || expoDetails.siteTexts?.registrationMainFeeLabel || '₦25,000';
  const mainPriceUSD = eliteTier?.priceUSD || '$25';
  const discountedPriceNGN = eliteTier?.discountPriceNGN || expoDetails.siteTexts?.registrationDiscountFeeLabel || '₦20,000';
  const discountedPriceUSD = eliteTier?.discountPriceUSD || '$20';
  const discountAmountNGN = eliteTier?.discountAmountNGN || expoDetails.siteTexts?.registrationDiscountAmountLabel || '₦5,000';
  const mainPaymentBtnText = expoDetails.siteTexts?.registrationPaymentBtnLabel || eliteTier?.ctaText || 'Confirm Your Registration';
  const discountBtnText = expoDetails.siteTexts?.registrationDiscountBtnLabel || eliteTier?.discountCtaText || 'Apply Code';

  const configuredElitePaymentLink = eliteTier?.paymentLink || expoDetails.siteTexts?.elitePaymentLink || FLUTTERWAVE_PAYMENT_LINK;
  const configuredDiscountPaymentLink = eliteTier?.discountPaymentLink || expoDetails.siteTexts?.discountPaymentLink || FLUTTERWAVE_DISCOUNT_PAYMENT_LINK;

  const basePriceNum = parseInt(mainPriceNGN.replace(/[^0-9]/g, ''), 10) || 25000;
  const discountedPriceNum = parseInt(discountedPriceNGN.replace(/[^0-9]/g, ''), 10) || 20000;

  // Dynamic Exhibition Booth Stand Packages from Admin / Context
  const availableBoothPackages = useMemo(() => {
    const list = boothPackages && boothPackages.length > 0 ? boothPackages : DEFAULT_BOOTH_PACKAGES;
    const activeOnly = list.filter(b => b.active !== false);
    return activeOnly.length > 0 ? activeOnly : list;
  }, [boothPackages]);

  // Exhibitor Booth Stand Selection State
  const [selectedBoothPackage, setSelectedBoothPackage] = useState<string>(() => {
    return availableBoothPackages[0]?.id || 'standard_9sqm';
  });

  // Keep selectedBoothPackage in sync if current selected id was removed
  useEffect(() => {
    if (!availableBoothPackages.some(b => b.id === selectedBoothPackage)) {
      if (availableBoothPackages[0]) {
        setSelectedBoothPackage(availableBoothPackages[0].id);
      }
    }
  }, [availableBoothPackages, selectedBoothPackage]);

  const currentBoothObj = availableBoothPackages.find(b => b.id === selectedBoothPackage) || availableBoothPackages[0] || DEFAULT_BOOTH_PACKAGES[0];
  const selectedBoothPrice = currentBoothObj.priceNGN;

  // Referral Code State
  const [referralCodeInput, setReferralCodeInput] = useState('');
  const [referralVerification, setReferralVerification] = useState<any | null>(null);
  const [referralStatusMsg, setReferralStatusMsg] = useState<string | null>(null);

  const isDiscountApplied = !!(referralVerification && referralVerification.valid && (referralVerification.discountAppliedNGN || 0) > 0);

  // Lookup existing ticket state
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupError, setLookupError] = useState<string | null>(null);

  const handleLookup = () => {
    const q = lookupQuery.trim().toLowerCase();
    if (!q) {
      setLookupError('Please enter a Ticket Number, Email, or Phone number.');
      return;
    }
    setLookupError(null);
    const latestList = refreshAttendees();
    const cleanQ = q.replace(/[^0-9a-z@.]/g, '');

    const found = (latestList || attendees).find(a => {
      const tNum = (a.ticketNumber || '').toLowerCase();
      const email = (a.email || '').toLowerCase();
      const phone = (a.phone || '').toLowerCase().replace(/[^0-9]/g, '');

      return tNum.includes(q) || email === q || (cleanQ && phone && phone.includes(cleanQ));
    });

    if (found) {
      setGeneratedTicket({ ...found });
      setCurrentStep('preview');
      setLookupQuery('');
    } else {
      setLookupError(`No registration record found matching "${lookupQuery}". Please check your details or register a new pass below.`);
    }
  };

  // Selected pass type: 'visitor' | 'elite' | 'exhibitor' | 'sponsor' | 'partner'
  const [passType, setPassType] = useState<AttendeePassType>(
    defaultTier === 'elite' ? 'elite' : defaultTier === 'exhibitor' ? 'exhibitor' : defaultTier === 'sponsor' ? 'sponsor' : defaultTier === 'partner' ? 'partner' : 'visitor'
  );

  // Category filter for Step 1: 'all' | 'visitor' | 'elite' | 'attendee' | 'exhibitor' | 'sponsor' | 'partner'
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'visitor' | 'elite' | 'attendee' | 'exhibitor' | 'sponsor' | 'partner'>('all');

  // Flow steps: 'select_tier' -> 'details' -> 'photo' -> 'payment' (for elite) -> 'id_card_preview'
  const [currentStep, setCurrentStep] = useState<'tier' | 'details' | 'photo' | 'payment' | 'preview'>('tier');

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    jobTitle: '',
    city: 'Abuja (FCT)',
    photoUrl: '',
    paymentMethod: 'flutterwave' as const,
  });

  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentStatusMessage, setPaymentStatusMessage] = useState('');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [livePaymentLink, setLivePaymentLink] = useState<string | null>(null);
  const [gatewayConfig, setGatewayConfig] = useState<FlutterwaveConfigResponse | null>(null);
  const [generatedTicket, setGeneratedTicket] = useState<AttendeeTicket | null>(null);
  const [activeTxRef, setActiveTxRef] = useState<string | null>(null);
  const [showFlutterwaveModal, setShowFlutterwaveModal] = useState(false);
  const [selectedPaymentChannel, setSelectedPaymentChannel] = useState<'card' | 'transfer' | 'ussd' | 'qr'>('card');

  // Fetch Flutterwave gateway configuration and preload SDK on mount
  useEffect(() => {
    preloadFlutterwaveCheckout();
    getFlutterwaveConfig().then(cfg => {
      setGatewayConfig(cfg);
    });
  }, []);

  // Sync draft form data from sessionStorage so progress is never lost on refresh or redirect
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('recon_pending_reg_form');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setFormData(prev => ({
            ...prev,
            fullName: prev.fullName || parsed.fullName || '',
            email: prev.email || parsed.email || '',
            phone: prev.phone || parsed.phone || '',
            organization: prev.organization || parsed.organization || '',
            jobTitle: prev.jobTitle || parsed.jobTitle || '',
            city: prev.city || parsed.city || 'Abuja (FCT)',
            photoUrl: prev.photoUrl || parsed.photoUrl || ''
          }));
        }
      }
    } catch {
      // safe
    }
  }, []);

  // Save draft form data to sessionStorage whenever user enters info
  useEffect(() => {
    if (formData.fullName || formData.email || formData.phone || formData.photoUrl) {
      try {
        sessionStorage.setItem('recon_pending_reg_form', JSON.stringify(formData));
      } catch {
        // safe
      }
    }
  }, [formData]);

  // Ensure active transaction reference exists whenever user is on the payment step
  useEffect(() => {
    if (currentStep === 'payment' && passType === 'elite' && !activeTxRef) {
      setActiveTxRef(`RECON26-FLW-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  }, [currentStep, passType, activeTxRef]);

  // Pre-warm Flutterwave checkout, sync tier, and check URL referral code when modal opens
  useEffect(() => {
    if (isOpen) {
      preloadFlutterwaveCheckout();
      if (defaultTier === 'elite') {
        setPassType('elite');
      } else if (defaultTier === 'exhibitor') {
        setPassType('exhibitor');
      } else if (defaultTier === 'sponsor') {
        setPassType('sponsor');
      } else if (defaultTier === 'partner') {
        setPassType('partner');
      } else if (defaultTier === 'visitor' || defaultTier === 'attendee') {
        setPassType('visitor');
      }
      setPaymentError(null);
      setPaymentStatusMessage('');
      setLivePaymentLink(null);

      // Check URL for referral code parameter e.g. ?ref=MKT-1234 and tier param
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const refFromUrl = urlParams.get('ref') || urlParams.get('referral') || urlParams.get('referralCode');
        const tierParam = urlParams.get('tier') || urlParams.get('pass');
        const resolvedPass = (tierParam === 'exhibitor' || defaultTier === 'exhibitor') ? 'exhibitor' :
                             (tierParam === 'elite' || defaultTier === 'elite') ? 'elite' :
                             (tierParam === 'sponsor' || defaultTier === 'sponsor') ? 'sponsor' :
                             (tierParam === 'partner' || defaultTier === 'partner') ? 'partner' :
                             (defaultTier === 'visitor' ? 'visitor' : passType);

        if (refFromUrl && !referralVerification) {
          const codeUpper = refFromUrl.trim().toUpperCase();
          setReferralCodeInput(codeUpper);
          const effectiveBase = resolvedPass === 'exhibitor' ? selectedBoothPrice : 25000;
          const res = verifyReferralCode(codeUpper, resolvedPass, effectiveBase);
          if (res.valid) {
            setReferralVerification(res);
            if (resolvedPass === 'exhibitor') {
              const commAmount = res.commissionEarnedNGN || Math.round(effectiveBase * 0.10);
              setReferralStatusMsg(`✅ Exhibitor Booth Stand Referral Code (${codeUpper}) Active! Marketer (${res.marketer?.fullName || 'Marketer'}) receives Commission: 10% (₦${commAmount.toLocaleString()} NGN) upon Secretariat payment confirmation.`);
            } else {
              setReferralStatusMsg(`✅ Referral Code Verified: ${res.message}`);
            }
          }
        } else if (defaultDiscounted && !referralVerification) {
          handleSelectDiscountedPrice('RECON2026');
        }
      } catch {
        // safe
      }
    }
  }, [isOpen, defaultTier, defaultDiscounted]);

  // Dynamically keep referral verification and commission in sync with selected passType and booth package
  useEffect(() => {
    if (referralCodeInput.trim()) {
      const effectivePrice = isExhibitor ? selectedBoothPrice : basePriceNum;
      const res = verifyReferralCode(referralCodeInput.trim(), passType, effectivePrice);
      if (res.valid) {
        setReferralVerification(res);
        if (isExhibitor) {
          const comm = Math.round(selectedBoothPrice * 0.10);
          setReferralStatusMsg(`✅ Exhibitor Booth Stand Referral Code (${referralCodeInput.trim()}) Active! Marketer (${res.marketer?.fullName || 'Marketer'}) receives Commission: 10% (₦${comm.toLocaleString()} NGN) on this booth booking upon Secretariat payment confirmation.`);
        } else if (isElite) {
          setReferralStatusMsg(`✅ Marketer Code (${referralCodeInput.trim()}) Active! Discount Applied: ${discountedPriceNGN} / ${discountedPriceUSD}. ₦5,000 Marketer Commission earned.`);
        } else {
          setReferralStatusMsg(`✅ Referral Code Verified: Registered under Marketer (${res.marketer?.fullName || 'Marketer'}).`);
        }
      }
    }
  }, [passType, selectedBoothPackage, selectedBoothPrice]);

  const handleSelectStandardPrice = () => {
    setReferralCodeInput('');
    setReferralVerification(null);
    setReferralStatusMsg(null);
  };

  const handleSelectDiscountedPrice = (codeToApply: string = 'RECON2026') => {
    const cleanCode = (codeToApply || referralCodeInput || 'RECON2026').trim().toUpperCase();
    setReferralCodeInput(cleanCode);
    const res = verifyReferralCode(cleanCode, 'elite', basePriceNum);
    if (res.valid) {
      setReferralVerification(res);
      setReferralStatusMsg(`✅ Marketer Promo Code (${cleanCode}) Verified! Discount Applied: ${discountedPriceNGN} / ${discountedPriceUSD}.`);
    } else {
      setReferralVerification(null);
      setReferralStatusMsg(`❌ Could not apply discount code: ${res.message}`);
    }
  };

  const handleApplyReferralCode = () => {
    if (!referralCodeInput.trim()) {
      setReferralStatusMsg('Please enter a referral code.');
      setReferralVerification(null);
      return;
    }
    const effectivePrice = isExhibitor ? selectedBoothPrice : basePriceNum;
    const res = verifyReferralCode(referralCodeInput.trim(), passType, effectivePrice);
    if (res.valid) {
      setReferralVerification(res);
      setReferralStatusMsg(`✅ ${res.message}`);
    } else {
      setReferralVerification(null);
      setReferralStatusMsg(`❌ ${res.message}`);
    }
  };

  // Handle Flutterwave external hosted page return redirects (?tx_ref=...&status=successful)
  useEffect(() => {
    if (!isOpen) return;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const txRef = urlParams.get('tx_ref');
      const status = urlParams.get('status') || urlParams.get('payment_status');

      if (txRef && (status === 'successful' || status === 'completed')) {
        setActiveTxRef(txRef);
        setPaymentProcessing(true);
        setPaymentError(null);
        setPaymentStatusMessage('Verifying payment confirmation with Flutterwave gateway...');

        verifyFlutterwavePayment(txRef)
          .then(verifyRes => {
            if (verifyRes.success && (verifyRes.verified || verifyRes.status === 'successful')) {
              const flwRef = verifyRes.data?.flw_ref || `FLW-${txRef.replace('RECON26-FLW-', '')}`;
              finalizeRegistration(txRef, String(flwRef));
              // Clean up URL parameters cleanly
              window.history.replaceState({}, document.title, window.location.pathname);
            } else {
              setPaymentError(
                verifyRes.error || 'Payment not yet confirmed by Flutterwave. Please click "Verify Completed Payment" to retry.'
              );
            }
          })
          .catch(err => {
            setPaymentError(err.message || 'Error verifying completed payment.');
          })
          .finally(() => {
            setPaymentProcessing(false);
            setPaymentStatusMessage('');
          });
      }
    } catch (e) {
      console.warn('[Redirect Params Check Error]', e);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isElite = passType === 'elite';
  const isVisitor = passType === 'visitor';
  const isExhibitor = passType === 'exhibitor';
  const isSponsor = passType === 'sponsor';
  const isPartner = passType === 'partner';

  // 10 Elite Guest Access Benefits
  const ELITE_BENEFITS = [
    "Full Access to All Exhibition Pavilions & Product Booths",
    "Priority Front-Row VIP Seating in Main Auditorium & Keynote Plenaries",
    "Exclusive Access to Executive B2B Deal Rooms & Private Investor Pitch Lounges",
    "Invitation & Reserved Table Seat at RECON Excellence Awards & Gala Banquet",
    "Fast-Track VIP Priority Registration Desk & Express Security Clearance",
    "Executive Lounge Access with High-Speed Wi-Fi & Premium Refreshments",
    "Digital Smart ID Badge with Gold Holographic Foil, Barcode & NFC Pass",
    "Full 2026 Nigerian Real Estate & Construction Market Intelligence Report (PDF)",
    "Lifetime Access to Speaker Slide Decks, Keynote Recordings & Transcripts",
    "1-on-1 Business Matchmaking Concierge with Top Developers & Exhibitors"
  ];

  // Visitor Access Scope
  const VISITOR_BENEFITS = [
    "Access to Expo Exhibition Halls & Product Pavilions Only",
    "Direct Interaction with 120+ Property Developers & Manufacturers",
    "Digital Smart ID Visitor Badge with Scannable Barcode & QR Code",
    "Access to Public Networking Foyers & Outdoor Tech Demos",
    "Standard Expo Digital Exhibitor Directory Access"
  ];

  // Exhibitor Benefits
  const EXHIBITOR_BENEFITS = [
    "Standard 9sqm – 36sqm Prime Shell Scheme Exhibition Stand Space",
    "2 to 4 Official Staff Event Smart ID Badges with Scannable QR & Barcode",
    "Featured Company Logo & Profile in Official RECON 2026 Expo Directory",
    "Direct B2B Deal Room Access & Investor Matchmaking Concierge",
    "Complimentary Passes to Opening Keynotes & Networking Foyers"
  ];

  // Sponsor Benefits
  const SPONSOR_BENEFITS = [
    "Headline / Platinum / Gold Corporate Brand Visibility across All Media",
    "Executive Keynote Address / Panel Presentation Slot in Main Plenary",
    "VIP Table for 8 Guests at RECON Excellence Awards & Gala Banquet",
    "Brand Logo Featured on 5,000+ Delegate Smart ID Badges & Lanyards",
    "Full-Page Feature in Expo Market Intelligence Report & Directory"
  ];

  // Partner Benefits
  const PARTNER_BENEFITS = [
    "Strategic Institutional, Association or Media Partner Accreditation",
    "Co-Branded Expo Marketing Banners & Press Conference Access",
    "Closed-Door Policy Roundtables & Bilateral Summit Room Access",
    "Media Broadcast Interviews & Press Release Distribution",
    "VIP Executive Delegate Passes for Institutional Leadership Delegation"
  ];

  const handleNextFromDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      alert('Please fill in your Full Name, Email, and Phone number.');
      return;
    }
    // Exhibitors, Sponsors, and Strategic Partners submit an Application directly.
    // Their ID badges are generated and issued exclusively by the Super Admin Secretariat!
    if (isExhibitor || isSponsor || isPartner) {
      finalizeRegistration();
    } else {
      setCurrentStep('photo');
    }
  };

  const handleNextFromPhoto = () => {
    if (isElite) {
      setCurrentStep('payment');
    } else {
      finalizeRegistration();
    }
  };

  const handleManualVerifyPayment = async () => {
    if (!activeTxRef) {
      setPaymentError('No active transaction reference found to verify. Please choose a payment channel below.');
      setShowFlutterwaveModal(true);
      return;
    }
    setPaymentProcessing(true);
    setPaymentError(null);
    setPaymentStatusMessage('Verifying payment confirmation with Flutterwave API...');
    try {
      const verifyRes = await verifyFlutterwavePayment(activeTxRef);
      if (verifyRes.success && (verifyRes.verified || verifyRes.status === 'successful')) {
        const flwRef = verifyRes.data?.flw_ref || `FLW-${activeTxRef.replace('RECON26-FLW-', '')}`;
        setPaymentStatusMessage('Payment reference recorded! Submitting registration for manual admin verification...');
        finalizeRegistration(activeTxRef, String(flwRef));
      } else {
        const statusText = verifyRes.status || 'pending';
        setPaymentError(
          verifyRes.error || 
          `Payment status is "${statusText}". Complete settlement in the checkout window below to issue your pass immediately.`
        );
        setShowFlutterwaveModal(true);
      }
    } catch (err: any) {
      setPaymentError(err.message || 'Error verifying payment with Flutterwave.');
      setShowFlutterwaveModal(true);
    } finally {
      setPaymentProcessing(false);
      setPaymentStatusMessage('');
    }
  };

  const handlePaymentAndFinalize = async (simulatedChannel: 'card' | 'transfer' | 'ussd' | 'qr' = 'card') => {
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setPaymentError('Please complete your full name, email address, and phone number before proceeding with payment.');
      return;
    }

    const isDiscountVerified = !!(referralVerification && referralVerification.valid && (referralVerification.discountAppliedNGN || 0) > 0);
    const amountToCharge = isDiscountVerified ? (referralVerification.finalPriceNGN || discountedPriceNum) : basePriceNum;
    const activePaymentLink = isDiscountVerified ? configuredDiscountPaymentLink : configuredElitePaymentLink;

    const tx_ref = activeTxRef || `RECON26-FLW-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setActiveTxRef(tx_ref);
    setSelectedPaymentChannel(simulatedChannel);
    setPaymentError(null);
    setPaymentProcessing(true);
    setPaymentStatusMessage('Connecting to Flutterwave 256-bit secure gateway...');

    try {
      // 1. Fetch config to test for real live public key
      const cfg = await getFlutterwaveConfig();
      const rawPublicKey = cfg?.fullPublicKey;

      // 2. Pre-initialize backend record
      const initPromise = initializeFlutterwavePayment({
        tx_ref,
        amount: amountToCharge,
        currency: 'NGN',
        email: formData.email.trim(),
        name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        passType: 'elite',
        metadata: {
          organization: formData.organization,
          city: formData.city,
          paymentChannel: simulatedChannel,
          referralCode: referralVerification?.code
        }
      });

      // 3. Try official Flutterwave Inline Checkout if valid live public key is loaded
      if (rawPublicKey && isValidFlutterwavePublicKey(rawPublicKey)) {
        const inlineRes = await openFlutterwaveInlineCheckout({
          public_key: rawPublicKey,
          tx_ref,
          amount: amountToCharge,
          currency: 'NGN',
          payment_options: 'card,banktransfer,ussd,account,qr,mobilemoney',
          customer: {
            email: formData.email.trim(),
            phone_number: formData.phone.trim(),
            name: formData.fullName.trim()
          },
          customizations: {
            title: 'RECON Expo 2026 - Elite VIP Guest Pass',
            description: "8th Real Estate & Construction Expo 2026, Shehu Musa Yar'Adua Centre, Abuja",
            logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=80'
          },
          callback: async (response: any) => {
            if (response && (response.status === 'successful' || response.status === 'completed' || response.chargeResponseCode === '00' || response.txRef === tx_ref)) {
              setPaymentStatusMessage('Payment reference recorded! Submitting registration for manual admin verification...');
              const flwRef = response.flw_ref || response.transaction_id || `FLW-${tx_ref.replace('RECON26-FLW-', '')}`;
              await completeFlutterwavePayment({
                tx_ref,
                flw_ref: String(flwRef),
                amount: amountToCharge,
                currency: 'NGN',
                email: formData.email.trim(),
                name: formData.fullName.trim(),
                phone: formData.phone.trim(),
                passType: 'elite',
                payment_type: 'flutterwave_gateway'
              });
              setPaymentProcessing(false);
              finalizeRegistration(tx_ref, String(flwRef));
            } else {
              setPaymentError(`Payment was not completed (Status: ${response?.status || 'Incomplete'}).`);
              setPaymentProcessing(false);
            }
          },
          onclose: () => {
            setPaymentProcessing(false);
            setPaymentStatusMessage('');
            setShowFlutterwaveModal(true);
          }
        });

        if (inlineRes.opened) {
          setPaymentProcessing(false);
          setPaymentStatusMessage('');
          return;
        }
      }

      // Check init result for hosted link
      const initRes = await initPromise;
      if (initRes.payment_link && initRes.payment_link.startsWith('http')) {
        setLivePaymentLink(initRes.payment_link);
      } else {
        setLivePaymentLink(activePaymentLink);
      }

      setPaymentProcessing(false);
      setPaymentStatusMessage('');
      setShowFlutterwaveModal(true);
    } catch (err: any) {
      console.warn('[Payment Gateway Connect]', err);
      setPaymentProcessing(false);
      setPaymentStatusMessage('');
      setShowFlutterwaveModal(true);
    }
  };

  const finalizeRegistration = (customTxnRef?: string, customFlwRef?: string) => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const prefix = isElite ? 'ELT' : isVisitor ? 'VIS' : isExhibitor ? 'EXH' : isSponsor ? 'SPN' : 'PTN';
    const ticketId = `RECON26-${prefix}-${randomNum}`;
    const txnRef = customTxnRef || (isElite ? `FLW-RECON-${Math.floor(1000000 + Math.random() * 9000000)}` : 'OFFICIAL-PASS');

    const benefits = isElite 
      ? ELITE_BENEFITS 
      : isExhibitor 
      ? EXHIBITOR_BENEFITS 
      : isSponsor 
      ? SPONSOR_BENEFITS 
      : isPartner 
      ? PARTNER_BENEFITS 
      : VISITOR_BENEFITS;

    const tierName = isElite 
      ? 'Elite Guest (Paid)' 
      : isVisitor 
      ? 'Visitor (Free)' 
      : isExhibitor 
      ? 'Exhibitor Booth Stand' 
      : isSponsor 
      ? 'Corporate Sponsor' 
      : 'Strategic Partner';

    const accessLevel = isElite 
      ? 'Full 10 VIP Benefits + Gala Dinner' 
      : isVisitor 
      ? 'Exhibition Pavilions Only' 
      : isExhibitor 
      ? 'Exhibitor Booth & Staff Pass' 
      : isSponsor 
      ? 'Corporate Sponsorship & Keynote Access' 
      : 'Strategic Partner Summit Access';

    const isEliteDiscountApplied = isElite && isDiscountApplied;
    const isExhibitorReferral = isExhibitor && !!(referralVerification?.code || referralCodeInput.trim());
    const exhibitorCommission = isExhibitorReferral ? Math.round(selectedBoothPrice * (currentBoothObj.commissionRate !== undefined ? currentBoothObj.commissionRate : 0.10)) : 0;
    const commissionEarned = isElite 
      ? ((referralVerification?.code || referralCodeInput.trim()) ? 5000 : 0)
      : exhibitorCommission;

    const amountPaid = isElite 
      ? (isEliteDiscountApplied ? '₦20,000' : '₦25,000') 
      : isExhibitor 
      ? currentBoothObj.priceFormatted 
      : isSponsor 
      ? 'By Proposal / Custom' 
      : isPartner 
      ? 'Strategic MoU Alliance' 
      : '₦0 (Free)';

    const finalAmountPaid = amountPaid;

    const hasConfirmedPayment = isVisitor; // Strictly free visitor passes auto-approve; all paid passes require manual admin approval

    const assignedPhoto = getAttendeeProfilePhoto(formData.photoUrl, undefined, formData.fullName);

    const ticket: AttendeeTicket = {
      ticketNumber: ticketId,
      tier: isExhibitor ? `Exhibitor Booth Stand (${currentBoothObj.name.split('(')[0].trim()})` : tierName,
      passType: passType,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      organization: formData.organization || 'Independent Delegate',
      role: formData.jobTitle || (isElite ? 'Elite Executive' : isExhibitor ? 'Exhibitor Delegate' : isSponsor ? 'Corporate Sponsor' : isPartner ? 'Strategic Partner' : 'Industry Delegate'),
      city: formData.city,
      photoUrl: assignedPhoto,
      avatarUrl: assignedPhoto,
      registeredAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      accessDays: `${expoDetails.dateRange} (All ${expoDetails.totalEventDays || 2} Days)`,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=RECON2026_${prefix}_${ticketId}_${encodeURIComponent(formData.fullName)}`,
      barcode: ticketId.replace(/[^0-9A-Z]/g, ''),
      amountPaid: finalAmountPaid,
      dealValue: isExhibitor ? selectedBoothPrice : isElite ? 25000 : 0,
      paymentRef: customFlwRef ? `${txnRef} (${customFlwRef})` : txnRef,
      paymentStatus: isVisitor ? 'FREE' : 'PENDING',
      accessLevel: accessLevel,
      benefits: benefits,
      rfidCode: `RFID-${Math.floor(10000000 + Math.random() * 90000000)}`,
      adminApproved: hasConfirmedPayment,
      adminApprovalStatus: hasConfirmedPayment ? 'APPROVED' : 'PENDING',
      adminApprovedAt: hasConfirmedPayment ? new Date().toISOString() : undefined,
      maxStaffBadges: isExhibitor ? currentBoothObj.badges : (isElite ? 1 : isSponsor ? 5 : isPartner ? 4 : 1),
      referralCode: referralVerification?.code || referralCodeInput.trim().toUpperCase() || undefined,
      marketerId: referralVerification?.marketer?.id || referralVerification?.marketerId || undefined,
      marketerName: referralVerification?.marketer?.fullName || undefined,
      discountAmountNGN: isDiscountApplied ? 5000 : 0,
      discountAppliedNGN: isDiscountApplied ? 5000 : 0,
      commissionEarnedNGN: commissionEarned,
      commissionPaidNGN: 0,
      commissionCredited: false,
      commissionApprovedAt: undefined,
      commissionApprovedBy: undefined,
      leadNotes: isExhibitor 
        ? `Exhibitor Stand: ${currentBoothObj.name} (${currentBoothObj.priceFormatted}). ${isExhibitorReferral ? `Referral: ${referralVerification?.code || referralCodeInput.trim()} (${referralVerification?.marketer?.fullName || 'Marketer'}) - Commission: 10% (₦${exhibitorCommission.toLocaleString()} NGN)` : 'Direct Secretariat Inquiry'}`
        : undefined
    };

    registerAttendee(ticket);

    // Fire Meta (Facebook) & TikTok Pixel Conversion Events
    try {
      trackPixelEvent({
        eventName: 'CompleteRegistration',
        contentName: `RECON Expo ${tierName}`,
        category: 'Registration Complete',
        value: ticket.dealValue || 0,
        currency: 'NGN',
        ticketNumber: ticketId,
        email: formData.email,
        phone: formData.phone
      });

      if (isExhibitor || isSponsor || isPartner) {
        trackPixelEvent({
          eventName: 'Lead',
          contentName: `Corporate Lead Application: ${tierName}`,
          category: 'B2B Corporate Application',
          value: ticket.dealValue || 0,
          currency: 'NGN',
          ticketNumber: ticketId,
          email: formData.email,
          phone: formData.phone
        });
      }

      if (ticket.dealValue && ticket.dealValue > 0) {
        trackPixelEvent({
          eventName: 'Purchase',
          contentName: `RECON Expo Pass Purchase (${tierName})`,
          category: 'Ticket Sale',
          value: ticket.dealValue,
          currency: 'NGN',
          ticketNumber: ticketId,
          email: formData.email,
          phone: formData.phone
        });
      }
    } catch {
      // safe
    }

    // Play notification sound alert based on registration type and payment confirmation
    try {
      if (isElite) {
        playNotificationSound('elite_vip');
      } else if (hasConfirmedPayment) {
        playNotificationSound('payment_approval');
      } else {
        playNotificationSound('registration');
      }
    } catch {
      // safe
    }

    // If an Exhibitor, Sponsor, or Partner applies, log the official application message directly in the Super Admin Secretariat Inbox
    if (isExhibitor || isSponsor || isPartner) {
      const inquiryCategory = isExhibitor 
        ? 'Exhibition Stand Application' 
        : isSponsor 
        ? 'Corporate Sponsorship Application' 
        : 'Strategic Partner Application';
      
      const boothDetailText = isExhibitor ? `• Booth Package: ${currentBoothObj.name} (${currentBoothObj.priceFormatted})\n• Staff Passes: ${currentBoothObj.badges} Badges\n` : '';
      const referralDetailText = (isExhibitor && isExhibitorReferral) 
        ? `• Referred by Marketer: ${referralVerification?.code || referralCodeInput.trim()} (${referralVerification?.marketer?.fullName || 'Marketer'})\n• Marketer Commission: 10% (₦${exhibitorCommission.toLocaleString()} NGN - Pending Admin payment approval)\n`
        : '';

      const inquiryMessage = `Official application submitted via Organizing Secretariat for ${tierName}.\n` +
        `• Organization/Company: ${formData.organization || 'Independent Organization'}\n` +
        `• Lead Representative: ${formData.fullName} (${formData.jobTitle || 'Lead Delegate'})\n` +
        `• Contact Info: Phone: ${formData.phone} | Email: ${formData.email}\n` +
        `• City/Location: ${formData.city || 'Abuja (FCT)'}\n` +
        `• Application Reference: ${ticketId}\n` +
        `• Tier/Pass: ${passType.toUpperCase()} (${tierName})\n` +
        boothDetailText +
        referralDetailText +
        `Note: ID Badges and booth accreditation for exhibitors, sponsors, and partners are generated exclusively in the Super Admin area.`;

      addContactMessage({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        inquiryType: inquiryCategory,
        message: inquiryMessage
      });
    }

    setGeneratedTicket(ticket);
    try {
      localStorage.setItem(LOCAL_STORAGE_LOGGED_IN_KEY, JSON.stringify(ticket));
    } catch {
      // safe
    }
    setCurrentStep('preview');

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#fbbf24', '#ffffff', '#ef4444']
      });
    } catch {
      // safe
    }
  };

  return (
    <div 
      id="registration-flow-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl bg-[#022c22]/95 border border-white/20 rounded-3xl p-5 sm:p-8 shadow-[0_0_70px_rgba(0,0,0,0.85)] backdrop-blur-2xl my-6 text-left max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          id="reg-modal-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-red-600 transition-colors cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Breadcrumb Progress Header */}
        <div className="mb-6 border-b border-white/10 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Official Event Registration & Smart ID Pass</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {expoDetails.dateRange} • Abuja
            </span>
          </div>

          {/* Stepper Progress Badges */}
          <div className="flex items-center gap-2 text-xs font-bold overflow-x-auto py-1">
            <span className={`px-2.5 py-1 rounded-lg flex items-center gap-1 ${
              currentStep === 'tier' ? 'bg-emerald-500 text-emerald-950' : 'bg-white/10 text-slate-300'
            }`}>
              1. Choose Category
            </span>
            <span className="text-white/20">→</span>
            <span className={`px-2.5 py-1 rounded-lg flex items-center gap-1 ${
              currentStep === 'details' ? 'bg-emerald-500 text-emerald-950' : 'bg-white/10 text-slate-300'
            }`}>
              2. {isExhibitor || isSponsor || isPartner ? 'Corporate Details' : 'Details'}
            </span>

            {isExhibitor || isSponsor || isPartner ? (
              <>
                <span className="text-white/20">→</span>
                <span className={`px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                  currentStep === 'preview' ? 'bg-emerald-500 text-emerald-950 font-black' : 'bg-white/10 text-slate-300'
                }`}>
                  3. Secretariat Clearance
                </span>
              </>
            ) : (
              <>
                <span className="text-white/20">→</span>
                <span className={`px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                  currentStep === 'photo' ? 'bg-emerald-500 text-emerald-950' : 'bg-white/10 text-slate-300'
                }`}>
                  3. ID Photo
                </span>
                {isElite && (
                  <>
                    <span className="text-white/20">→</span>
                    <span className={`px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                      currentStep === 'payment' ? 'bg-amber-500 text-black' : 'bg-white/10 text-slate-300'
                    }`}>
                      4. Payment
                    </span>
                  </>
                )}
                <span className="text-white/20">→</span>
                <span className={`px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                  currentStep === 'preview' ? 'bg-emerald-500 text-emerald-950 font-black' : 'bg-white/10 text-slate-300'
                }`}>
                  {isElite ? '5. Smart ID Card' : '4. Smart ID Card'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* ================= STEP 1: SELECT PARTICIPATION CATEGORY & PASS ================= */}
        {currentStep === 'tier' && (
          <div className="space-y-6">
            {/* Quick Lookup Bar for Existing Registrations */}
            <div className="p-4 rounded-2xl bg-[#011e15] border border-amber-500/40 text-xs shadow-lg shadow-black/40">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-left w-full sm:w-auto">
                  <strong className="block text-white font-black text-sm flex items-center gap-1.5">
                    <Search className="w-4 h-4 text-amber-400" />
                    Already Registered? Check Payment Approval Status
                  </strong>
                  <span className="text-slate-300 text-[11px] block mt-0.5">
                    Enter your Ticket Number (e.g. RECON-2026-...), Email, or Phone to retrieve your status & ID Card.
                  </span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <input
                    type="text"
                    placeholder="Ticket #, Email, or Phone..."
                    value={lookupQuery}
                    onChange={(e) => {
                      setLookupQuery(e.target.value);
                      setLookupError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleLookup();
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-black/70 border border-white/20 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-amber-400 w-full sm:w-56"
                  />
                  <button
                    type="button"
                    onClick={handleLookup}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs whitespace-nowrap transition-all cursor-pointer shrink-0 shadow-md hover:scale-105"
                  >
                    Check Status
                  </button>
                </div>
              </div>
              {lookupError && (
                <p className="mt-2 text-red-400 text-[11px] font-bold bg-red-950/40 p-2 rounded-lg border border-red-500/30">
                  {lookupError}
                </p>
              )}
            </div>

            <div className="text-center max-w-xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                Choose Participation Category
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Select your pass as a <strong className="text-emerald-400">Visitor</strong>, <strong className="text-amber-400">Elite VIP</strong>, <strong className="text-emerald-300">Exhibitor</strong>, <strong className="text-red-400">Sponsor</strong>, or <strong className="text-purple-300">Partner</strong>.
              </p>
            </div>

            {/* Mobile-Friendly Category Switcher Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pb-1 px-0.5">
              <button
                type="button"
                onClick={() => setCategoryFilter(prev => prev === 'visitor' ? 'all' : 'visitor')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 min-h-[44px] ${
                  categoryFilter === 'visitor'
                    ? 'bg-emerald-500 text-emerald-950 shadow-md shadow-emerald-950/40'
                    : 'bg-white/10 hover:bg-white/15 text-slate-300 border border-white/10'
                }`}
              >
                <Ticket className="w-3.5 h-3.5 text-emerald-400" />
                <span>Visitor (Free)</span>
              </button>

              <button
                type="button"
                onClick={() => setCategoryFilter(prev => prev === 'elite' ? 'all' : 'elite')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 min-h-[44px] ${
                  categoryFilter === 'elite'
                    ? 'bg-amber-400 text-black shadow-md shadow-amber-950/40'
                    : 'bg-white/10 hover:bg-white/15 text-slate-300 border border-white/10'
                }`}
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Elite VIP (₦25k / $25)</span>
              </button>

              <button
                type="button"
                onClick={() => setCategoryFilter(prev => prev === 'exhibitor' ? 'all' : 'exhibitor')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 min-h-[44px] ${
                  categoryFilter === 'exhibitor'
                    ? 'bg-emerald-500 text-emerald-950 shadow-md shadow-emerald-950/40'
                    : 'bg-white/10 hover:bg-white/15 text-slate-300 border border-white/10'
                }`}
              >
                <Store className="w-3.5 h-3.5 text-emerald-400" />
                <span>Exhibitors</span>
              </button>

              <button
                type="button"
                onClick={() => setCategoryFilter(prev => prev === 'sponsor' ? 'all' : 'sponsor')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 min-h-[44px] ${
                  categoryFilter === 'sponsor'
                    ? 'bg-red-600 text-white shadow-md shadow-red-950/40'
                    : 'bg-white/10 hover:bg-white/15 text-slate-300 border border-white/10'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
                <span>Sponsors</span>
              </button>

              <button
                type="button"
                onClick={() => setCategoryFilter(prev => prev === 'partner' ? 'all' : 'partner')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 min-h-[44px] ${
                  categoryFilter === 'partner'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
                    : 'bg-white/10 hover:bg-white/15 text-slate-300 border border-white/10'
                }`}
              >
                <Handshake className="w-3.5 h-3.5 text-purple-300" />
                <span>Partners</span>
              </button>
            </div>

            {/* Standalone Category Selection Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto justify-center">
              
              {/* 1. STANDALONE VISITOR PASS CARD */}
              {(categoryFilter === 'all' || categoryFilter === 'visitor' || categoryFilter === 'attendee') && (
                <div 
                  id="category-card-visitor"
                  className={`rounded-3xl p-5 sm:p-6 border-2 transition-all flex flex-col justify-between relative ${
                    isVisitor
                      ? 'border-sky-400/80 bg-sky-950/30 shadow-[0_0_35px_rgba(56,189,248,0.2)]'
                      : 'border-white/15 bg-white/5 hover:border-white/30'
                  }`}
                >
                  <div className="absolute -top-3 left-6 z-10">
                    <span className="px-3 py-1 rounded-full bg-sky-400 text-sky-950 text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                      <Ticket className="w-3 h-3" />
                      COMPLIMENTARY ACCESS
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3 mt-1">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30">
                          <Ticket className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-white font-heading">
                            VISITOR PASS
                          </h4>
                          <p className="text-[11px] text-sky-300 font-bold">
                            General Trade & Exhibition Delegate
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-sm sm:text-base font-black text-sky-300 font-display">
                          FREE
                        </span>
                        <span className="text-[10px] text-slate-400">Approx $0 USD</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                      Complimentary access to explore 120+ housing developments, smart city pavilions, live machine demos, and open exhibition halls.
                    </p>

                    {/* Features */}
                    <div className="space-y-1.5 pt-3 border-t border-white/10">
                      {VISITOR_BENEFITS.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                          <Check className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="button"
                      id="modal-select-visitor-btn"
                      onClick={() => {
                        setPassType('visitor');
                        setCurrentStep('details');
                      }}
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-xs tracking-wider transition-all bg-sky-500 hover:bg-sky-400 text-sky-950 flex items-center justify-center gap-2 cursor-pointer shadow-md min-h-[46px]"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>SELECT VISITOR PASS (FREE)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* 2. STANDALONE ELITE VIP GUEST CARD */}
              {(categoryFilter === 'all' || categoryFilter === 'elite' || categoryFilter === 'attendee') && (
                <div 
                  id="category-card-elite"
                  className={`rounded-3xl p-5 sm:p-6 border-2 transition-all flex flex-col justify-between relative ${
                    isElite
                      ? 'border-amber-400/90 bg-amber-950/30 shadow-[0_0_35px_rgba(251,191,36,0.25)]'
                      : 'border-white/15 bg-white/5 hover:border-amber-400/40'
                  }`}
                >
                  <div className="absolute -top-3 left-6 z-10">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-black text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      VIP PRIVILEGES & GALA DINNER
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3 mt-1">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          <Crown className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-white font-heading">
                            ELITE VIP GUEST
                          </h4>
                          <p className="text-[11px] text-amber-300 font-bold">
                            Executive All-Access & Awards Gala
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-sm sm:text-base font-black text-amber-400 font-display">
                          {mainPriceNGN}
                        </span>
                        <span className="text-[10px] text-slate-400">Approx {mainPriceUSD} USD</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                      All 10 VIP privileges including red-carpet Awards Gala Dinner, private deal-making suites, executive lounge, and priority seating.
                    </p>

                    {/* Features */}
                    <div className="space-y-1.5 pt-3 border-t border-white/10">
                      {ELITE_BENEFITS.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                          <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-5">
                    <button
                      type="button"
                      id="modal-select-elite-btn"
                      onClick={() => {
                        setPassType('elite');
                        setCurrentStep('details');
                      }}
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-xs tracking-wider transition-all bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black flex items-center justify-between cursor-pointer shadow-md shadow-amber-950/40 min-h-[46px]"
                    >
                      <span className="flex items-center gap-1.5 font-black">
                        <Crown className="w-4 h-4 text-black" />
                        <span>{isDiscountApplied ? 'REGISTER FOR ELITE VIP (DISCOUNTED)' : 'REGISTER FOR ELITE VIP PASS'}</span>
                      </span>
                      <span className="font-extrabold bg-black/20 px-2.5 py-1 rounded-lg text-[11px]">
                        {isDiscountApplied ? `${discountedPriceNGN} (${discountedPriceUSD})` : `${mainPriceNGN} (${mainPriceUSD})`}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* 2. STANDALONE EXHIBITORS CARD */}
              {(categoryFilter === 'all' || categoryFilter === 'exhibitor') && (
                <div 
                  id="category-card-exhibitor"
                  className={`rounded-3xl p-5 sm:p-6 border-2 transition-all flex flex-col justify-between relative ${
                    isExhibitor
                      ? 'border-emerald-400 bg-emerald-950/40 shadow-[0_0_35px_rgba(52,211,153,0.25)]'
                      : 'border-white/15 bg-white/5 hover:border-white/30'
                  }`}
                >
                  <div className="absolute -top-3 left-6 z-10">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                      <Store className="w-3 h-3" />
                      COMMISSION: 10% • BOOTH STAND
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3 mt-1">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <Store className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-white font-heading">
                            EXHIBITOR BOOTH STAND
                          </h4>
                          <p className="text-[11px] text-emerald-300 font-bold">
                            Trade Showcase • Marketer gets 10% Commission
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-sm sm:text-base font-black text-emerald-300 font-display">
                          Direct Inquire
                        </span>
                        <span className="text-[10px] text-amber-300 font-extrabold uppercase bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-400/20">Commission: 10%</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                      Showcase real estate developments, heavy construction equipment, building materials, and smart technologies to 5,000+ buyers.
                    </p>

                    {/* Features */}
                    <div className="space-y-1.5 pt-3 border-t border-white/10">
                      {EXHIBITOR_BENEFITS.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                          <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="button"
                      id="modal-select-exhibitor-btn"
                      onClick={() => {
                        setPassType('exhibitor');
                        setCurrentStep('details');
                      }}
                      className="w-full py-3.5 px-4 rounded-xl font-black text-xs tracking-wider transition-all bg-emerald-400 hover:bg-emerald-300 text-emerald-950 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/60 min-h-[46px]"
                    >
                      <Store className="w-4 h-4" />
                      <span>REGISTER VIA SECRETARIAT</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* 3. STANDALONE SPONSORS CARD */}
              {(categoryFilter === 'all' || categoryFilter === 'sponsor') && (
                <div 
                  id="category-card-sponsor"
                  className={`rounded-3xl p-5 sm:p-6 border-2 transition-all flex flex-col justify-between relative ${
                    isSponsor
                      ? 'border-red-500 bg-red-950/30 shadow-[0_0_35px_rgba(239,68,68,0.25)]'
                      : 'border-white/15 bg-white/5 hover:border-white/30'
                  }`}
                >
                  <div className="absolute -top-3 left-6 z-10">
                    <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                      <Award className="w-3 h-3 fill-current" />
                      BESPOKE PACKAGES
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3 mt-1">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-white font-heading">
                            SPONSOR PACKAGE
                          </h4>
                          <p className="text-[11px] text-red-300 font-bold">
                            Bespoke Sponsorship Packages
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-sm sm:text-base font-black text-red-400 font-display">
                          Direct Inquire
                        </span>
                        <span className="text-[10px] text-slate-400">Bespoke Packages</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                      Command industry authority with headline plenary exposure, keynote presentation slots, and exclusive VIP banquet dinner tables.
                    </p>

                    {/* Features */}
                    <div className="space-y-1.5 pt-3 border-t border-white/10">
                      {SPONSOR_BENEFITS.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                          <Check className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="button"
                      id="modal-select-sponsor-btn"
                      onClick={() => {
                        setPassType('sponsor');
                        setCurrentStep('details');
                      }}
                      className="w-full py-3.5 px-4 rounded-xl font-black text-xs tracking-wider transition-all bg-red-600 hover:bg-red-500 text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-950/70 min-h-[46px]"
                    >
                      <Award className="w-4 h-4" />
                      <span>REGISTER VIA SECRETARIAT</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* 4. STANDALONE PARTNERS CARD */}
              {(categoryFilter === 'all' || categoryFilter === 'partner') && (
                <div 
                  id="category-card-partner"
                  className={`rounded-3xl p-5 sm:p-6 border-2 transition-all flex flex-col justify-between relative ${
                    isPartner
                      ? 'border-purple-400 bg-purple-950/30 shadow-[0_0_35px_rgba(168,85,247,0.25)]'
                      : 'border-white/15 bg-white/5 hover:border-white/30'
                  }`}
                >
                  <div className="absolute -top-3 left-6 z-10">
                    <span className="px-3 py-1 rounded-full bg-purple-500/30 border border-purple-400/40 text-purple-200 text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                      <Handshake className="w-3 h-3" />
                      INSTITUTIONAL ALLIANCE
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3 mt-1">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          <Handshake className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-white font-heading">
                            STRATEGIC PARTNER
                          </h4>
                          <p className="text-[11px] text-purple-300 font-bold">
                            Strategic Institutional Alliance
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-sm sm:text-base font-black text-purple-300 font-display">
                          Direct Inquire
                        </span>
                        <span className="text-[10px] text-slate-400">MoU Agreement</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                      Collaborate as a government MDA, professional institute, trade chamber, or media broadcast house with bilateral summit access.
                    </p>

                    {/* Features */}
                    <div className="space-y-1.5 pt-3 border-t border-white/10">
                      {PARTNER_BENEFITS.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                          <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="button"
                      id="modal-select-partner-btn"
                      onClick={() => {
                        setPassType('partner');
                        setCurrentStep('details');
                      }}
                      className="w-full py-3.5 px-4 rounded-xl font-black text-xs tracking-wider transition-all bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-950/60 min-h-[46px]"
                    >
                      <Handshake className="w-4 h-4" />
                      <span>REGISTER VIA SECRETARIAT</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ================= STEP 2: DELEGATE INFORMATION FORM / SECRETARIAT REGISTRATION ================= */}
        {currentStep === 'details' && (
          <form onSubmit={handleNextFromDetails} className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-extrabold text-white font-heading">
                  {isExhibitor || isSponsor || isPartner ? 'Corporate Application' : 'Delegate Profile & Credentials'}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Selected Pass: <strong className={isElite ? 'text-amber-300 font-black' : isExhibitor ? 'text-emerald-300 font-bold' : isSponsor ? 'text-red-400 font-bold' : isPartner ? 'text-purple-300 font-bold' : 'text-emerald-400 font-bold'}>
                    {isElite ? 'ELITE GUEST (₦25,000 / $25)' : isVisitor ? 'VISITOR (FREE)' : `${passType.toUpperCase()} (DIRECT INQUIRE)`}
                  </strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep('tier')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Change Pass
              </button>
            </div>

            {/* Organizing Secretariat Notice Banner for Exhibitor/Sponsor/Partner */}
            {(isExhibitor || isSponsor || isPartner) && (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>RECON 2026 Organizing Secretariat</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Registrations for Exhibitors, Sponsors, and Strategic Partners are handled directly by the Organizing Secretariat. Submit your organization's details below; our Secretariat will reach out within 24 hours to finalize your stand allocation, custom branding, and issue official executive credentials.
                </p>
                <div className="flex flex-wrap gap-4 pt-1 text-[11px] text-emerald-200">
                  <span>Helplines: <strong className="text-white">+234 803 314 3612</strong> / <strong className="text-white">+234 802 360 0000</strong></span>
                  <span>Email: <strong className="text-white">reconexpo@afrinetgroup.com</strong></span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name / Lead Representative */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  {isExhibitor || isSponsor || isPartner ? 'Lead Representative / Contact Person *' : 'Full Name (As printed on ID Badge) *'}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arc. Oladipo Adeleke"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  {isExhibitor || isSponsor || isPartner ? (
                    'Corporate / Official Email *'
                  ) : (
                    <>
                      Email Address <span className="text-amber-300 font-extrabold">(For Event Updates and Opportunities)</span> *
                    </>
                  )}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. o.adeleke@firm.ng"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Phone Number / WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +234 803 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>
              </div>

              {/* City / State */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  City / State Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Abuja (FCT) / Lagos / Rivers"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>
              </div>

              {/* Company / Organization */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Company / Organization Name {isExhibitor || isSponsor || isPartner ? '*' : ''}
                </label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required={isExhibitor || isSponsor || isPartner}
                    placeholder="e.g. Apex Infrastructure & Properties"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>
              </div>

              {/* Job Title / Designation */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Job Title / Designation
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Managing Director / Principal Architect"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Exhibitor Booth Stand Selection */}
            {isExhibitor && (
              <div className="p-4 rounded-2xl bg-black/50 border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                  <label className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 font-extrabold">
                    <Store className="w-4 h-4 text-emerald-400" />
                    <span>Select Exhibition Booth Stand Package</span>
                  </label>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                    Trade Floor Showcase
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {availableBoothPackages.map((booth) => {
                    const isSelected = selectedBoothPackage === booth.id;
                    const commRate = booth.commissionRate !== undefined ? booth.commissionRate : 0.10;
                    const commissionAmount = Math.round(booth.priceNGN * commRate);
                    return (
                      <div
                        key={booth.id}
                        onClick={() => {
                          setSelectedBoothPackage(booth.id);
                          if (referralCodeInput.trim()) {
                            const res = verifyReferralCode(referralCodeInput.trim(), 'exhibitor', booth.priceNGN);
                            if (res.valid) {
                              setReferralVerification(res);
                              setReferralStatusMsg(`✅ Marketer Code (${referralCodeInput.trim()}) Active! Commission: ${Math.round(commRate * 100)}% (₦${commissionAmount.toLocaleString()} NGN) allocated to Marketer (${res.marketer?.fullName || 'Marketer'}).`);
                            }
                          }
                        }}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-950/70 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.25)] ring-1 ring-emerald-400/40'
                            : 'bg-black/40 border-white/10 hover:border-white/20 hover:bg-white/5 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                            {booth.name}
                          </span>
                          <span className={`text-xs font-mono font-black ${isSelected ? 'text-emerald-300' : 'text-slate-400'}`}>
                            {booth.priceFormatted || `₦${booth.priceNGN.toLocaleString()}`}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight">
                          {booth.desc}
                        </p>
                        <div className="mt-1.5 flex items-center justify-between text-[10px]">
                          <span className="text-slate-300 font-medium">Includes {booth.badges} Staff Badges</span>
                          <span className="font-bold text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                            Commission: {Math.round(commRate * 100)}% (₦{commissionAmount.toLocaleString()})
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Marketer Referral Code Box (Available for Elite VIP and Exhibitor Booth Stand) */}
            {(isElite || isExhibitor) && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-emerald-500/20 pb-2">
                  <label className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 font-extrabold">
                    <Ticket className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Have a Marketer Referral Code / Link?</span>
                  </label>
                  <span className="text-[11px] font-bold text-slate-300">
                    {isElite ? (
                      <>Active Rate: <strong className={isDiscountApplied ? 'text-emerald-300 font-extrabold' : 'text-amber-300 font-extrabold'}>{isDiscountApplied ? `${discountedPriceNGN} (${discountedPriceUSD})` : `${mainPriceNGN} (${mainPriceUSD})`}</strong></>
                    ) : (
                      <>Marketer Commission: <strong className="text-amber-300 font-extrabold">Commission: 10% (₦{Math.round(selectedBoothPrice * 0.10).toLocaleString()} NGN)</strong></>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Key className="absolute left-3 top-2.5 w-4 h-4 text-emerald-400/70" />
                    <input
                      type="text"
                      placeholder={isExhibitor ? "Enter referral code e.g. MKT-101 or VIP-DAVID" : "Enter code e.g. MKT-101 or RECON2026"}
                      value={referralCodeInput}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        setReferralCodeInput(val);
                        if (!val.trim()) {
                          setReferralVerification(null);
                          setReferralStatusMsg(null);
                        } else {
                          const res = verifyReferralCode(val.trim(), passType, isExhibitor ? selectedBoothPrice : basePriceNum);
                          if (res.valid) {
                            setReferralVerification(res);
                            if (isExhibitor) {
                              setReferralStatusMsg(`✅ Exhibitor Booth Stand Referral Code (${val.trim()}) Active! Marketer (${res.marketer?.fullName || 'Marketer'}) receives Commission: 10% (₦${Math.round(selectedBoothPrice * 0.10).toLocaleString()} NGN) on this booth booking upon Secretariat payment confirmation.`);
                            } else {
                              setReferralStatusMsg(`✅ Marketer Code (${val.trim()}) Active! Discounted Price Automatically Applied: ${discountedPriceNGN} / ${discountedPriceUSD}.`);
                            }
                          } else {
                            setReferralVerification(null);
                            setReferralStatusMsg(null);
                          }
                        }
                      }}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/60 border border-emerald-500/30 text-white placeholder-slate-500 text-xs uppercase font-mono font-bold focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyReferralCode}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs transition-colors cursor-pointer flex-shrink-0"
                  >
                    {isExhibitor ? 'Apply Code' : discountBtnText}
                  </button>
                </div>

                {referralStatusMsg && (
                  <p className={`text-xs font-bold ${referralVerification?.valid ? 'text-emerald-300' : 'text-amber-300'}`}>
                    {referralStatusMsg}
                  </p>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setCurrentStep('tier')}
                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                id="btn-submit-details"
                className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/60"
              >
                <span>
                  {isExhibitor 
                    ? 'Submit Registration to Organizing Secretariat' 
                    : isSponsor 
                    ? 'Submit Registration to Organizing Secretariat' 
                    : isPartner 
                    ? 'Submit Registration to Organizing Secretariat' 
                    : 'Proceed to ID Photo Studio'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 3: SMART ID PHOTO CAPTURE STUDIO ================= */}
        {currentStep === 'photo' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-extrabold text-white font-heading">
                  Event ID Card Photo Studio
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Delegate: <strong className="text-white">{formData.fullName || 'Registered Delegate'}</strong> • {formData.jobTitle || 'Industry Professional'}
                </p>
              </div>
            </div>

            {/* Interactive Photo Capture / Upload Component */}
            <PhotoCaptureStudio
              fullName={formData.fullName}
              currentPhotoUrl={formData.photoUrl}
              onPhotoSelected={(url) => setFormData({ ...formData, photoUrl: url })}
            />

            {/* ID Card Specs Note */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 flex items-start gap-2 mb-6">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Smart Digital ID Pass Feature:</p>
                <p>Your photograph will be rendered directly on your official RECON 2026 Smart Holographic ID Badge with encrypted QR verification and scannable barcode.</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setCurrentStep('details')}
                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Details</span>
              </button>

              <button
                type="button"
                id="btn-confirm-photo-proceed"
                onClick={handleNextFromPhoto}
                className={`py-3 px-6 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg ${
                  isElite
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black shadow-amber-950/60'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 shadow-emerald-950/60'
                }`}
              >
                <span>{isElite ? `${mainPaymentBtnText} (${(referralVerification?.valid && referralVerification?.discountAppliedNGN) ? `${discountedPriceNGN} / ${discountedPriceUSD}` : `${mainPriceNGN} / ${mainPriceUSD}`})` : 'Generate Smart ID Badge (Free)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: ONE CHECKOUT PAYMENT GATEWAY ================= */}
        {currentStep === 'payment' && isElite && (() => {
          const hasAttribution = !!(referralVerification && referralVerification.valid);
          const isDiscountVerified = hasAttribution && (referralVerification.discountAppliedNGN || 0) > 0;
          const payableAmountStr = isDiscountVerified ? discountedPriceNGN : mainPriceNGN;
          const targetPaymentLink = isDiscountVerified ? configuredDiscountPaymentLink : configuredElitePaymentLink;

          return (
            <div>
              <div className="text-center max-w-md mx-auto mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-black font-black flex items-center justify-center mx-auto mb-3 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                  <Crown className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-white font-heading tracking-tight">
                  Elite Guest Pass One Checkout
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Official 256-bit encrypted single-step VIP registration & payment
                </p>

                <div className="mt-3 p-3.5 rounded-2xl bg-black/60 border border-amber-500/30 space-y-2">
                  {isDiscountVerified ? (
                    <div className="space-y-1 text-center">
                      <div className="flex items-center justify-center gap-2 text-xs">
                        <span className="line-through text-slate-500 font-bold">{mainPriceNGN} ({mainPriceUSD})</span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-black border border-emerald-500/40 text-[10px] flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-400" />
                          REFERRAL DISCOUNT APPLIED (-{discountAmountNGN})
                        </span>
                      </div>
                      <strong className="text-3xl text-emerald-400 block font-display font-black tracking-tight">{discountedPriceNGN} NGN ({discountedPriceUSD} USD)</strong>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <strong className="text-3xl text-amber-300 block font-display font-black tracking-tight text-center">{mainPriceNGN} NGN ({mainPriceUSD} USD)</strong>
                      <p className="text-[11px] text-slate-400 font-medium">Standard Elite Pass Rate</p>
                    </div>
                  )}

                  {hasAttribution && (
                    <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-emerald-300 font-bold px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                      <Ticket className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Referral Code: {referralVerification?.code} • {discountAmountNGN} Marketer Discount Applied</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Exclusive One Checkout Gateway Card */}
              <div className="rounded-3xl border-2 border-amber-400/80 bg-gradient-to-b from-amber-950/50 via-black/80 to-black p-5 sm:p-6 mb-6 shadow-[0_0_50px_rgba(245,158,11,0.2)] relative overflow-hidden">
                
                {/* Flutterwave Brand Header */}
                <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#fb923c]/20 border border-[#fb923c]/40 flex items-center justify-center text-[#fb923c]">
                      <Zap className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-extrabold text-white">Flutterwave One Checkout</h4>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                          Verified
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Cards • Direct Bank Transfer • USSD • Mobile Money • QR
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[11px] text-slate-300">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>256-Bit PCI-DSS Level 1 Encrypted</span>
                  </div>
                </div>

                {/* Delegate Billing Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Delegate Name</span>
                    <span className="text-white font-bold">{formData.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Pass Tier</span>
                    <span className="text-amber-300 font-bold">Elite VIP Guest Pass</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Billing Email</span>
                    <span className="text-slate-200">{formData.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone Number</span>
                    <span className="text-slate-200">{formData.phone}</span>
                  </div>
                </div>

                {/* Status Message & Error Alert */}
                {paymentStatusMessage && (
                  <div className="mb-4 p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2.5">
                    <RotateCw className="w-4 h-4 animate-spin text-amber-400 flex-shrink-0" />
                    <span className="font-medium">{paymentStatusMessage}</span>
                  </div>
                )}

                {paymentError && (
                  <div className="mb-4 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-red-300 font-bold mb-0.5">Payment Notice:</strong>
                      <span>{paymentError}</span>
                    </div>
                  </div>
                )}

                {/* Active Transaction Reference Box */}
                {activeTxRef && (
                  <div className="mb-4 p-3.5 rounded-2xl bg-black/60 border border-amber-500/30 text-xs">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-1 pb-1 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        <span className="text-[11px] font-mono text-amber-300 font-bold">
                          Ref: {activeTxRef}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase border border-amber-500/30">
                        Checkout Active
                      </span>
                    </div>
                  </div>
                )}

                {/* Single Primary CTA Button */}
                <div>
                  <button
                    type="button"
                    id="btn-complete-flutterwave-payment"
                    disabled={paymentProcessing}
                    onClick={() => handlePaymentAndFinalize()}
                    className="w-full py-4 px-8 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 cursor-pointer shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all hover:scale-[1.02] bg-gradient-to-r from-[#fb923c] via-amber-400 to-[#f59e0b] hover:from-[#f97316] hover:to-amber-300 text-black"
                  >
                    {paymentProcessing ? (
                      <>
                        <RotateCw className="w-5 h-5 animate-spin text-black" />
                        <span>PROCESSING REGISTRATION...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-950" />
                        <span>Confirm Your Registration ({payableAmountStr})</span>
                        <ArrowRight className="w-5 h-5 text-black" />
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* Navigation & Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setCurrentStep('photo')}
                  className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Photo</span>
                </button>
              </div>
            </div>
          );
        })()}

        {/* ================= STEP 5: EVENT ID CARD GENERATOR WITH LIVE PREVIEW / SECRETARIAT CONFIRMATION ================= */}
        {currentStep === 'preview' && generatedTicket && (() => {
          const liveTicket = attendees.find(a => a.ticketNumber === generatedTicket.ticketNumber) || generatedTicket;
          const isCorporate = liveTicket.passType === 'exhibitor' || liveTicket.passType === 'sponsor' || liveTicket.passType === 'partner';
          const isVisitor = liveTicket.passType === 'visitor' || liveTicket.tier.toLowerCase().includes('visitor') || liveTicket.tier.toLowerCase().includes('free') || liveTicket.amountPaid === '₦0' || liveTicket.amountPaid === 'Free' || liveTicket.amountPaid === '$0';
          const isApproved = isVisitor || liveTicket.adminApproved === true || liveTicket.adminApprovalStatus === 'APPROVED';
          const isDeclined = !isVisitor && (liveTicket.adminApprovalStatus === 'DECLINED' || liveTicket.paymentStatus === 'DECLINED');

          // 1. DEDICATED VIEW FOR EXHIBITORS, SPONSORS, AND PARTNERS (NO PUBLIC ID CARD GENERATOR - ADMIN ONLY)
          if (isCorporate) {
            const isExh = liveTicket.passType === 'exhibitor';
            const isSpn = liveTicket.passType === 'sponsor';
            const accentBg = isExh ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                             isSpn ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                             'bg-purple-500/20 text-purple-400 border-purple-500/40';

            return (
              <div className="space-y-6">
                <div className="text-center max-w-xl mx-auto">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border ${accentBg}`}>
                    {isExh ? <Store className="w-8 h-8" /> : isSpn ? <Award className="w-8 h-8" /> : <Handshake className="w-8 h-8" />}
                  </div>

                  <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3 border ${accentBg}`}>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Application Logged with Secretariat</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                    Application Received & Submitted
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed">
                    Thank you, <strong className="text-white">{liveTicket.fullName}</strong>. Your application for <strong className="text-emerald-300">{liveTicket.tier}</strong> representing <strong className="text-white">{liveTicket.organization}</strong> has been logged in the RECON Expo Secretariat system.
                  </p>
                </div>

                {/* ID Card Policy Restriction Notice */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-relaxed flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
                  <div>
                    <strong className="block text-white font-bold mb-1">
                      Super Admin ID Card Issuance Notice:
                    </strong>
                    Public self-service ID card generation is disabled for Exhibitor, Sponsor, and Strategic Partner categories. Official Executive ID Badges, Booth Allocations, and Digital Access Passes are generated and issued exclusively by the <strong>Super Admin Secretariat</strong> following application review and vetting.
                  </div>
                </div>

                {/* Application Reference Summary */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-3 shadow-lg">
                  <div className="flex justify-between items-center pb-2.5 border-b border-white/10">
                    <span className="text-slate-400 uppercase font-bold text-[10px]">Application Ref #:</span>
                    <span className="text-emerald-400 font-mono font-bold text-sm">{liveTicket.ticketNumber}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2.5 border-b border-white/10">
                    <span className="text-slate-400 uppercase font-bold text-[10px]">Organization:</span>
                    <span className="text-white font-bold">{liveTicket.organization}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2.5 border-b border-white/10">
                    <span className="text-slate-400 uppercase font-bold text-[10px]">Lead Representative:</span>
                    <span className="text-slate-200">{liveTicket.fullName} ({liveTicket.role})</span>
                  </div>
                  <div className="flex justify-between items-center pb-2.5 border-b border-white/10">
                    <span className="text-slate-400 uppercase font-bold text-[10px]">Official Contact:</span>
                    <span className="text-slate-200">{liveTicket.phone} • {liveTicket.email}</span>
                  </div>
                  {liveTicket.referralCode && (
                    <div className="flex justify-between items-center pb-2.5 border-b border-white/10">
                      <span className="text-slate-400 uppercase font-bold text-[10px]">Referral Attribution:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-emerald-300 font-mono font-bold text-xs">{liveTicket.referralCode}</span>
                        {liveTicket.marketerName && <span className="text-slate-300 text-xs">({liveTicket.marketerName})</span>}
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30">
                          Commission: 10% (₦{(liveTicket.commissionEarnedNGN || Math.round((liveTicket.dealValue || 350000) * 0.10)).toLocaleString()} NGN)
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 uppercase font-bold text-[10px]">Accreditation Status:</span>
                    <span className="px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      Awaiting Super Admin Clearance
                    </span>
                  </div>
                </div>

                {/* Secretariat Contacts */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-3">
                  <div>
                    <span className="font-bold text-white text-sm block">RECON 2026 Organizing Secretariat</span>
                    <span className="text-[11px] text-slate-400">Our Secretariat will review your submission and reach out within 24 hours regarding booth placement, exhibition floor map, and badge logistics.</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <a
                      href="https://wa.me/2348033143612?text=Hello%20RECON%20Secretariat,%20I%20have%20submitted%20a%20corporate%20registration%20application."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp Secretariat</span>
                    </a>
                    <a
                      href="tel:+2348033143612"
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span>Call +234 803 314 3612</span>
                    </a>
                    <a
                      href="mailto:reconexpo@afrinetgroup.com"
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Email Secretariat</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep('tier');
                      setGeneratedTicket(null);
                    }}
                    className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Register Another Delegate</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs uppercase tracking-wider cursor-pointer shadow-lg"
                  >
                    Done / Close
                  </button>
                </div>
              </div>
            );
          }

          if (!isApproved) {
            return (
              <div>
                <div className="text-center max-w-xl mx-auto mb-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg ${
                    isDeclined 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.25)]'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.25)] animate-pulse'
                  }`}>
                    {isDeclined ? <ShieldAlert className="w-8 h-8 text-red-400" /> : <Clock className="w-8 h-8" />}
                  </div>

                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm sm:text-base font-black uppercase tracking-wider mb-3 ${
                    isDeclined
                      ? 'bg-red-500/20 text-red-300 border border-red-400/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-md'
                  }`}>
                    <ShieldAlert className="w-5 h-5" />
                    <span>{isDeclined ? 'Payment Declined by Admin' : 'Pending Admin Payment Approval'}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                    {isDeclined ? 'Payment Status: Declined' : 'Registration Submitted & Payment Pending'}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed">
                    {isDeclined ? (
                      <>Your registration payment for <strong className="text-red-300">{liveTicket.tier}</strong> was reviewed by the RECON Secretariat and marked as <strong className="text-red-400 font-bold">Declined</strong>.</>
                    ) : (
                      <>Thank you, <strong className="text-white">{liveTicket.fullName}</strong>. Your registration for <strong className="text-amber-300">{liveTicket.tier}</strong> has been logged in the RECON Expo Secretariat system.</>
                    )}
                  </p>

                  <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs sm:text-sm text-emerald-300 font-bold flex items-center justify-center gap-1.5 max-w-md mx-auto">
                    <Key className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Account Active for <strong className="text-white">{liveTicket.email}</strong>. Log in anytime using Email or Ticket # ({liveTicket.ticketNumber}).</span>
                  </div>
                </div>

                {/* Ticket & Payment Summary Card */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-sm text-slate-300 mb-6 space-y-3 shadow-lg">
                  <div className="flex justify-between items-center pb-2.5 border-b border-white/10">
                    <span className="text-slate-400 uppercase font-bold text-xs">Ticket Number:</span>
                    <span className="text-emerald-400 font-mono font-bold text-base">{liveTicket.ticketNumber}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2.5 border-b border-white/10">
                    <span className="text-slate-400 uppercase font-bold text-xs">Payment Reference:</span>
                    <span className="text-amber-300 font-mono font-bold text-sm">{liveTicket.paymentRef || 'FLW-PAY-8PSEFP46HABU'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2.5 border-b border-white/10">
                    <span className="text-slate-400 uppercase font-bold text-xs">Pass Clearance:</span>
                    <span className="text-white font-bold text-sm">{liveTicket.tier}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 uppercase font-bold text-xs">Smart ID Status:</span>
                    <span className={`px-3 py-1 rounded-full font-black text-xs uppercase flex items-center gap-1.5 ${
                      isDeclined
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {isDeclined ? <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> : <Clock className="w-3.5 h-3.5 text-amber-400" />}
                      {isDeclined ? 'Declined by Admin' : 'Awaiting Admin Approval'}
                    </span>
                  </div>
                </div>

                {/* Policy Notice Box */}
                <div className={`p-4 sm:p-5 rounded-2xl text-sm sm:text-base mb-6 leading-relaxed flex items-start gap-3.5 ${
                  isDeclined
                    ? 'bg-red-500/10 border border-red-500/30 text-red-200'
                    : 'bg-amber-500/10 border border-amber-500/30 text-amber-200'
                }`}>
                  <ShieldCheck className={`w-6 h-6 shrink-0 mt-0.5 ${isDeclined ? 'text-red-400' : 'text-amber-400'}`} />
                  <div className="space-y-1.5">
                    <strong className="block text-white font-extrabold text-base sm:text-lg">
                      {isDeclined ? 'Payment Approval Declined:' : 'Payment Approval Gate:'}
                    </strong>
                    <div className="text-amber-300 font-black text-sm sm:text-base">
                      Payment process by: <span className="text-white underline decoration-amber-400 font-extrabold">Afrinex West Africa Limited.</span>
                    </div>
                    <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed pt-1">
                      {isDeclined 
                        ? 'The Secretariat was unable to verify your payment. Please ensure your Flutterwave transaction completed successfully, or contact the Secretariat.' 
                        : 'Admin payment approval is required before your official Smart ID Card is generated and downloadable. Once the RECON Expo Secretariat verifies your Flutterwave payment, your Smart ID Card will unlock automatically.'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const latestList = refreshAttendees();
                        const fresh = (latestList && latestList.length > 0 ? latestList : attendees).find(a => 
                          a.ticketNumber === liveTicket.ticketNumber || 
                          (a.email && liveTicket.email && a.email.toLowerCase() === liveTicket.email.toLowerCase())
                        );
                        if (fresh) {
                          setGeneratedTicket({ ...fresh });
                          if (fresh.adminApproved || fresh.adminApprovalStatus === 'APPROVED') {
                            alert(`✅ Payment Approved for ${fresh.fullName}! Your official Smart ID Card is now unlocked for download.`);
                          } else if (fresh.adminApprovalStatus === 'DECLINED' || fresh.paymentStatus === 'DECLINED') {
                            alert(`❌ Payment Status: DECLINED\n\nThe RECON Secretariat was unable to verify your payment. Please complete payment or contact Admin.`);
                          } else {
                            alert(`⏳ Approval Pending for ${fresh.fullName}\n\nThe RECON Secretariat has not approved your payment yet.\n\nTip for Admin: Open Admin Access Portal -> Registrations Database -> set Payment Approval dropdown to "Approve" for ${fresh.fullName}.`);
                          }
                        } else {
                          alert('⏳ Checking Status... No update recorded yet.');
                        }
                      }}
                      className="flex-1 py-3 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <RotateCw className="w-4 h-4 text-emerald-400" />
                      <span>Check Payment Approval Status</span>
                    </button>

                    <button
                      type="button"
                      onClick={onClose}
                      className="py-3 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs cursor-pointer"
                    >
                      Done / Close
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div>
              <div className="text-center max-w-xl mx-auto mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-black uppercase tracking-wider mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Pass Issued & Approved by Admin!</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                  Your Official Event Smart ID Pass
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {!isVisitor 
                    ? "Your registration is confirmed! Official Smart ID Card downloads for paid passes and partners are managed exclusively by the Secretariat Admin; your physical RFID badge will be issued at the VIP Accreditation Desk."
                    : "Present this digital smart badge or download the printable high-resolution badge for entrance clearance at Shehu Musa Yar'Adua Centre, Abuja."}
                </p>
              </div>

              {/* Smart ID Card Live Interactive Component */}
              <div className="flex justify-center p-6 sm:p-8 bg-black/40 border border-white/10 rounded-3xl mb-6">
                <SmartIdCard ticket={liveTicket} isAdmin={false} />
              </div>

              {/* Registered Summary Details */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Ticket Number:</span>
                  <span className="text-white font-mono font-bold">{liveTicket.ticketNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Pass Clearance:</span>
                  <span className={isElite ? 'text-amber-300 font-bold' : 'text-emerald-400 font-bold'}>
                    {liveTicket.tier}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Transaction Ref:</span>
                  <span className="text-slate-200 font-mono">{liveTicket.paymentRef}</span>
                </div>
              </div>

              {/* Done / Register Another Action */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep('tier');
                    setGeneratedTicket(null);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Register Another Delegate</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs uppercase tracking-wider cursor-pointer shadow-lg"
                >
                  Done / Close
                </button>
              </div>
            </div>
          );
        })()}

      </div>

      {/* Interactive In-App Flutterwave Payment Gateway Modal */}
      {showFlutterwaveModal && (
        <FlutterwaveCheckoutModal
          isOpen={showFlutterwaveModal}
          onClose={() => {
            setShowFlutterwaveModal(false);
            setPaymentProcessing(false);
          }}
          tx_ref={activeTxRef || `RECON26-FLW-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`}
          amount={isDiscountApplied ? (referralVerification?.finalPriceNGN || discountedPriceNum) : basePriceNum}
          currency="NGN"
          customer={{
            email: formData.email.trim() || 'delegate@afrinetgroup.com',
            name: formData.fullName.trim() || 'Elite VIP Delegate',
            phone: formData.phone.trim() || '+234 800 000 0000'
          }}
          initialChannel={selectedPaymentChannel}
          livePaymentLink={livePaymentLink || (isDiscountApplied ? configuredDiscountPaymentLink : configuredElitePaymentLink)}
          onPaymentSuccess={({ tx_ref, flw_ref }) => {
              setShowFlutterwaveModal(false);
              setPaymentProcessing(false);
              setPaymentStatusMessage('Payment reference recorded! Submitting for manual admin verification...');
              finalizeRegistration(tx_ref, flw_ref);
            }}
          />
        )}
    </div>
  );
};
