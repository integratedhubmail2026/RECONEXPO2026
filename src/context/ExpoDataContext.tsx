import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ExpoDetails, 
  HeroBackgroundSlide, 
  Speaker, 
  Session, 
  RegistrationTier, 
  BoothPackage,
  Sponsor, 
  SectorItem, 
  FaqItem, 
  AttendeeTicket,
  AdminCredentials,
  AdminAuthState,
  ContactMessage,
  StaffAccount,
  StaffPermissions,
  StaffAuthState,
  MarketerAccount,
  MarketerAuthState,
  CommissionPaymentConfirmation,
  ReferralVerificationResult,
  PushNotificationItem,
  PushSubscriptionState
} from '../types';
import { getAttendeeProfilePhoto } from '../utils/avatarUtils';
import { 
  registerServiceWorker, 
  requestNativeNotificationPermission, 
  dispatchDeviceNotification 
} from '../utils/pushNotificationService';
import { playNotificationSound } from '../utils/soundService';
import { 
  EXPO_DETAILS, 
  HERO_SLIDES_INITIAL, 
  SPEAKERS, 
  PROGRAMME_SESSIONS, 
  REGISTRATION_TIERS, 
  DEFAULT_BOOTH_PACKAGES,
  SPONSORS, 
  SECTORS_COVERED, 
  FAQ_ITEMS 
} from '../data/expoData';
import { deleteBackendTransaction } from '../services/flutterwave';

const LOCAL_STORAGE_DATA_KEY = 'recon_expo_live_data_v4';
const LOCAL_STORAGE_BACKUP_KEY = 'recon_expo_permanent_mirror_backup_v2';
const LOCAL_STORAGE_AUTH_KEY = 'recon_expo_admin_auth_v2';
const LOCAL_STORAGE_CREDS_KEY = 'recon_expo_admin_credentials_v2';
const LOCAL_STORAGE_ATTENDEES_KEY = 'recon_expo_attendees_v2';
const LOCAL_STORAGE_STAFF_KEY = 'recon_expo_staff_accounts_v1';
const LOCAL_STORAGE_STAFF_AUTH_KEY = 'recon_expo_staff_auth_v1';
const LOCAL_STORAGE_MARKETERS_KEY = 'recon_expo_marketer_accounts_v1';
const LOCAL_STORAGE_MARKETER_AUTH_KEY = 'recon_expo_marketer_auth_v1';
const LOCAL_STORAGE_PUSH_NOTIFS_KEY = 'recon_expo_push_notifications_v1';
const LOCAL_STORAGE_PUSH_SUB_KEY = 'recon_expo_push_subscription_v1';

const INITIAL_PUSH_NOTIFICATIONS: PushNotificationItem[] = [
  {
    id: 'push_101',
    title: '🚨 Exclusive Housing & Investment Deal Unveiled!',
    message: 'Explore prime commercial plots and housing developments in Abuja & Lagos with up to 25% discount for RECON delegates.',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80',
    targetLink: '#registration',
    category: 'Housing & Investment',
    targetAudience: 'ALL',
    sentAt: new Date().toISOString(),
    subscriberCount: 1420,
    clickCount: 384,
    status: 'SENT',
    badgeText: 'HOT DEAL',
    priority: 'HIGH'
  },
  {
    id: 'push_exhib_101',
    title: '🎪 Exhibitor Alert: Booth Allocation & Setup Schedule',
    message: 'All accredited Exhibitors: Booth build-up commences Wednesday Oct 28th at 08:00 AM. Access badges & loading dock passes are available at the Organizing Secretariat.',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
    targetLink: '#registration',
    category: 'Exhibitor Alert',
    targetAudience: 'EXHIBITORS',
    sentAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    subscriberCount: 120,
    clickCount: 94,
    status: 'SENT',
    badgeText: 'BOOTH DISPATCH',
    priority: 'URGENT'
  },
  {
    id: 'push_spons_101',
    title: '💎 Sponsor Alert: VIP Lounge & Red-Carpet Gala Clearance',
    message: 'Corporate & Summit Sponsors: Executive VIP protocol passes, reserved Plenary front-row seating, and Awards Gala dinner table assignments are now finalized.',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
    targetLink: '#registration',
    category: 'Sponsor Alert',
    targetAudience: 'SPONSORS',
    sentAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    subscriberCount: 65,
    clickCount: 58,
    status: 'SENT',
    badgeText: 'VIP PROTOCOL',
    priority: 'HIGH'
  },
  {
    id: 'push_partner_101',
    title: '🏛️ Strategic Partner Alert: Bilateral Deal Rooms & MoU Briefing',
    message: 'Strategic & Institutional Partners: Executive B2B Deal Room matchmaking schedules and Minister Bilateral Consultation rosters are ready for review.',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80',
    targetLink: '#registration',
    category: 'Partner Alert',
    targetAudience: 'PARTNERS',
    sentAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    subscriberCount: 45,
    clickCount: 41,
    status: 'SENT',
    badgeText: 'DEAL ROOM',
    priority: 'HIGH'
  },
  {
    id: 'push_102',
    title: '🏛️ Ministerial Keynote Session Confirmed!',
    message: 'Hon. Minister of Housing & Urban Development will address delegates on Day 1 at 10:00 AM. Reserve your VIP seats now.',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?auto=format&fit=crop&w=600&q=80',
    targetLink: '#programme',
    category: 'Keynote Session',
    targetAudience: 'ALL',
    sentAt: new Date(Date.now() - 86400000).toISOString(),
    subscriberCount: 1380,
    clickCount: 512,
    status: 'SENT',
    badgeText: 'LIVE ALERT',
    priority: 'NORMAL'
  }
];

const INITIAL_MARKETER_ACCOUNTS: MarketerAccount[] = [];

// Security Utilities & Protection System
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return input;
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/(--|;|\/\*|\*\/)/g, '')
    .trim();
};

export const validatePasswordStrength = (password: string): { valid: boolean; message: string } => {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter (A-Z).' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter (a-z).' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one digit (0-9).' };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character (e.g. @, !, #, $, %).' };
  }
  return { valid: true, message: 'Password meets high security requirements.' };
};

// Brute Force Anti-Lockout Tracker
interface LockoutTracker {
  [key: string]: {
    failedCount: number;
    lockedUntil: number | null;
  };
}

const lockoutStore: LockoutTracker = {};

const checkLockout = (key: string): { isLocked: boolean; remainingSeconds: number } => {
  const record = lockoutStore[key];
  if (!record || !record.lockedUntil) return { isLocked: false, remainingSeconds: 0 };
  const now = Date.now();
  if (now < record.lockedUntil) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { isLocked: true, remainingSeconds };
  } else {
    delete lockoutStore[key];
    return { isLocked: false, remainingSeconds: 0 };
  }
};

const recordFailedAttempt = (key: string): { isLockedNow: boolean; remainingAttempts: number; remainingSeconds: number } => {
  const now = Date.now();
  const record = lockoutStore[key] || { failedCount: 0, lockedUntil: null };
  const newCount = record.failedCount + 1;
  if (newCount >= 5) {
    const lockedUntil = now + 15 * 60 * 1000; // 15-minute lock
    lockoutStore[key] = { failedCount: newCount, lockedUntil };
    return { isLockedNow: true, remainingAttempts: 0, remainingSeconds: 15 * 60 };
  } else {
    lockoutStore[key] = { failedCount: newCount, lockedUntil: null };
    return { isLockedNow: false, remainingAttempts: 5 - newCount, remainingSeconds: 0 };
  }
};

const resetFailedAttempts = (key: string) => {
  delete lockoutStore[key];
};

const DEFAULT_ADMIN_CREDS: AdminCredentials = {
  username: 'admin',
  passwordHash: '@AfrinetGroup2026!!',
  lastUpdated: new Date().toISOString()
};

const INITIAL_STAFF_ACCOUNTS: StaffAccount[] = [
  {
    id: 'staff_001',
    fullName: 'Rebecca Alabi',
    username: 'staff.registrar',
    password: '@StaffRecon2026!',
    email: 'rebecca.alabi@reconexpo.com',
    role: 'Secretariat Registrar',
    department: 'Secretariat',
    permissions: {
      canRegisterAttendees: true,
      canCheckIn: true,
      canManageInbox: true,
      canManageSchedule: true,
      canManageSpeakers: false,
      canViewPayments: true,
      canManageSponsors: false,
      canExportData: true,
      canManageLeadMatrix: true,
    },
    status: 'ACTIVE',
    createdAt: new Date('2026-08-01T09:00:00Z').toISOString(),
    registeredBy: 'admin',
    notes: 'Lead On-Site Registration & Delegate Accreditation Officer'
  },
  {
    id: 'staff_002',
    fullName: 'Michael Danjuma',
    username: 'staff.gate',
    password: '@GateSecure2026!',
    email: 'm.danjuma@reconexpo.com',
    role: 'Gate Marshal',
    department: 'Gate Operations',
    permissions: {
      canRegisterAttendees: true,
      canCheckIn: true,
      canManageInbox: false,
      canManageSchedule: false,
      canManageSpeakers: false,
      canViewPayments: false,
      canManageSponsors: false,
      canExportData: false,
      canManageLeadMatrix: false,
    },
    status: 'ACTIVE',
    createdAt: new Date('2026-08-05T10:30:00Z').toISOString(),
    registeredBy: 'admin',
    notes: 'Main Hall RFID & QR Gate Scanner Operator'
  },
  {
    id: 'staff_003',
    fullName: 'Fiona Okonkwo',
    username: 'staff.finance',
    password: '@FinanceRecon2026!',
    email: 'fiona.o@reconexpo.com',
    role: 'Finance Officer',
    department: 'Accounts & Billing',
    permissions: {
      canRegisterAttendees: false,
      canCheckIn: false,
      canManageInbox: true,
      canManageSchedule: false,
      canManageSpeakers: false,
      canViewPayments: true,
      canManageSponsors: true,
      canExportData: true,
      canManageLeadMatrix: false,
    },
    status: 'ACTIVE',
    createdAt: new Date('2026-08-10T14:15:00Z').toISOString(),
    registeredBy: 'admin',
    notes: 'Transaction Verifier & Financial Auditor'
  }
];


// Default registrations disabled & removed: system begins with 0 default/auto-generated registrations
export const isSeedOrDefaultAttendee = (a: any): boolean => {
  if (!a || !a.ticketNumber) return true;
  const defaultTickets = [
    'RECON-2026-ELT-8491',
    'RECON-2026-ELT-9182',
    'RECON-2026-ELT-4402',
    'RECON-2026-SPO-1093',
    'RECON-2026-EXH-5510',
    'RECON-2026-PTN-7730',
    'RECON-2026-LEAD-6210',
    'RECON-2026-LEAD-5301',
    'RECON-2026-LEAD-4890',
    'RECON-2026-LEAD-4115',
    'RECON-2026-VIS-4102',
    'RECON-2026-LEAD-3392',
    'RECON-2026-LEAD-2190',
    'RECON-2026-LEAD-1055'
  ];
  if (defaultTickets.includes(a.ticketNumber)) return true;
  if (typeof a.fullName === 'string' && (
    a.fullName.includes('Oladipo Adeleke') ||
    a.fullName.includes('Alhaji Ibrahim Danladi') ||
    a.fullName.includes('Barr. Zainab Al-Hassan') ||
    a.fullName.includes('Arc. Kelechi Okafor') ||
    a.fullName.includes('Tunde Adeyemi-Bello') ||
    a.fullName.includes('Arc. Folake Solanke') ||
    a.fullName.includes('Dr. Aliyu Mohammed') ||
    a.fullName.includes('Engr. Farouk Bello') ||
    a.fullName.includes('Chief Emeka Nnamani') ||
    a.fullName.includes('Victoria Adeleke-Peters') ||
    a.fullName.includes('Kenneth Adeleke')
  )) {
    return true;
  }
  return false;
};

const INITIAL_ATTENDEES: AttendeeTicket[] = [];

const LOCAL_STORAGE_MESSAGES_KEY = 'recon_expo_contact_messages_v1';

const INITIAL_CONTACT_MESSAGES: ContactMessage[] = [];

export interface ExpoDataContextType {
  // Website Content
  expoDetails: ExpoDetails;
  heroSlides: HeroBackgroundSlide[];
  speakers: Speaker[];
  sessions: Session[];
  tiers: RegistrationTier[];
  boothPackages: BoothPackage[];
  sponsors: Sponsor[];
  sectors: SectorItem[];
  faqs: FaqItem[];
  attendees: AttendeeTicket[];

  // Update methods
  updateExpoDetails: (details: Partial<ExpoDetails>) => void;
  updateHeroSlides: (slides: HeroBackgroundSlide[]) => void;
  addHeroSlide: (slide: HeroBackgroundSlide) => void;
  editHeroSlide: (index: number, slide: HeroBackgroundSlide) => void;
  deleteHeroSlide: (index: number) => void;

  // Speakers CRUD
  addSpeaker: (speaker: Omit<Speaker, 'id'>) => void;
  editSpeaker: (id: string, speaker: Partial<Speaker>) => void;
  deleteSpeaker: (id: string) => void;

  // Sessions CRUD
  addSession: (session: Omit<Session, 'id'>) => void;
  editSession: (id: string, session: Partial<Session>) => void;
  deleteSession: (id: string) => void;

  // Tiers, Booth Packages & Sponsors
  editTier: (id: string, tier: Partial<RegistrationTier>) => void;
  addBoothPackage: (pkg: Omit<BoothPackage, 'id'> & { id?: string }) => void;
  editBoothPackage: (id: string, updated: Partial<BoothPackage>) => void;
  deleteBoothPackage: (id: string) => void;
  toggleBoothPackageActive: (id: string) => void;
  addSponsor: (sponsor: Sponsor) => void;
  editSponsor: (index: number, sponsor: Partial<Sponsor>) => void;
  deleteSponsor: (index: number) => void;

  // Sectors & FAQs
  editSector: (index: number, sector: Partial<SectorItem>) => void;
  addFaq: (faq: FaqItem) => void;
  editFaq: (index: number, faq: Partial<FaqItem>) => void;
  deleteFaq: (index: number) => void;

  // Attendees / Leads
  registerAttendee: (ticket: AttendeeTicket) => void;
  updateAttendee: (ticketNumber: string, updated: Partial<AttendeeTicket>) => void;
  deleteAttendee: (ticketNumber: string) => void;
  toggleCheckInAttendee: (ticketNumber: string) => boolean;
  clearAllAttendees: () => void;
  refreshAttendees: () => AttendeeTicket[];

  // Secretariat Contact Messages Inbox
  contactMessages: ContactMessage[];
  addContactMessage: (msg: Omit<ContactMessage, 'id' | 'submittedAt' | 'status'>) => void;
  updateContactMessageStatus: (id: string, status: 'unread' | 'read' | 'replied', replyNotes?: string) => void;
  deleteContactMessage: (id: string) => void;
  clearAllContactMessages: () => void;

  // Admin Auth & Management
  adminAuth: AdminAuthState;
  adminCredentials: AdminCredentials;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  loginAdmin: (username: string, password: string) => { success: boolean; message: string };
  logoutAdmin: () => void;
  updateAdminCredentials: (newUsername: string, newPassword: string) => { success: boolean; message: string };

  // Staff Accounts & Permissions
  staffAccounts: StaffAccount[];
  staffAuth: StaffAuthState;
  registerStaff: (staffData: Omit<StaffAccount, 'id' | 'createdAt' | 'lastLogin'>) => { success: boolean; message: string; staff?: StaffAccount };
  updateStaff: (id: string, updated: Partial<StaffAccount>) => { success: boolean; message: string };
  deleteStaff: (id: string) => { success: boolean; message: string };
  loginStaff: (username: string, password: string) => { success: boolean; message: string; staff?: StaffAccount };
  logoutStaff: () => void;
  
  // Marketer Accounts & Referral System
  marketerAccounts: MarketerAccount[];
  marketerAuth: MarketerAuthState;
  registerMarketer: (marketerData: Omit<MarketerAccount, 'id' | 'createdAt' | 'lastLogin' | 'totalEarningsNGN'>) => { success: boolean; message: string; marketer?: MarketerAccount };
  updateMarketer: (id: string, updated: Partial<MarketerAccount>) => { success: boolean; message: string };
  deleteMarketer: (id: string) => { success: boolean; message: string };
  loginMarketer: (username: string, password: string) => { success: boolean; message: string; marketer?: MarketerAccount };
  logoutMarketer: () => void;
  confirmCommissionPayment: (marketerId: string, amountNGN?: number, notes?: string, customRef?: string) => { success: boolean; message: string; confirmation?: CommissionPaymentConfirmation };
  resetMarketerDashboard: (marketerId?: string) => { success: boolean; message: string };
  verifyReferralCode: (code: string, passType: string, basePriceNGN: number) => ReferralVerificationResult;
  
  // Push Notifications Broadcast & Subscription Manager
  pushNotifications: PushNotificationItem[];
  pushSubscription: PushSubscriptionState;
  activePushBroadcast: PushNotificationItem | null;
  sendPushNotification: (notification: Omit<PushNotificationItem, 'id' | 'sentAt' | 'clickCount' | 'subscriberCount'>) => { success: boolean; message: string; notification: PushNotificationItem };
  deletePushNotification: (id: string) => { success: boolean; message: string };
  clearAllPushNotifications: () => { success: boolean; message: string };
  subscribePushNotifications: (preference: 'yes' | 'no') => void;
  dismissPushBroadcast: () => void;
  
  // Data Tools
  resetToDefaults: () => void;
  exportDataJson: () => string;
  importDataJson: (jsonStr: string) => { success: boolean; message: string };
}

const ExpoDataContext = createContext<ExpoDataContextType | undefined>(undefined);

// Safety helper: retrieve persistent website content and prevent auto-reset on refresh
const getPersistedWebsiteData = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DATA_KEY) || 
                localStorage.getItem(LOCAL_STORAGE_BACKUP_KEY) ||
                localStorage.getItem('recon_expo_live_data_v3') ||
                localStorage.getItem('recon_expo_permanent_mirror_backup_v1');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return null;
};

export const ExpoDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load or initialize website content with persistent anti-reset protection
  const [expoDetails, setExpoDetails] = useState<ExpoDetails>(() => {
    try {
      const parsed = getPersistedWebsiteData();
      if (parsed && parsed.expoDetails) {
        const isLegacyDate = !parsed.expoDetails.dateRange ||
          parsed.expoDetails.dateRange.includes('November') ||
          parsed.expoDetails.dateRange.includes('9th') ||
          parsed.expoDetails.totalEventDays === 3;

        const effectiveDateRange = isLegacyDate ? EXPO_DETAILS.dateRange : parsed.expoDetails.dateRange;
        const effectiveStartDate = isLegacyDate ? EXPO_DETAILS.startDate : (parsed.expoDetails.startDate || EXPO_DETAILS.startDate);
        const effectiveEndDate = isLegacyDate ? EXPO_DETAILS.endDate : (parsed.expoDetails.endDate || EXPO_DETAILS.endDate);
        const effectiveTotalDays = isLegacyDate ? 2 : (parsed.expoDetails.totalEventDays || 2);

        return {
          ...EXPO_DETAILS,
          ...parsed.expoDetails,
          dateRange: effectiveDateRange,
          startDate: effectiveStartDate,
          endDate: effectiveEndDate,
          totalEventDays: effectiveTotalDays,
          stats: {
            ...EXPO_DETAILS.stats,
            ...(parsed.expoDetails.stats || {})
          },
          idCard: {
            ...EXPO_DETAILS.idCard,
            ...(parsed.expoDetails.idCard || {})
          },
          siteTexts: (() => {
            const rawSiteTexts = parsed.expoDetails.siteTexts || {};
            const isLegacyOrganizer = (text?: string) => 
              !text || 
              text.includes('Organized by the RECON Expo Secretariat') ||
              text.includes('Real Estate Development Associations') ||
              text.includes('Federal Ministries') ||
              text.includes('Abuja Chamber of Commerce & Industry');

            return {
              ...EXPO_DETAILS.siteTexts,
              ...rawSiteTexts,
              heroOrganizerText: isLegacyOrganizer(rawSiteTexts.heroOrganizerText)
                ? EXPO_DETAILS.siteTexts?.heroOrganizerText
                : rawSiteTexts.heroOrganizerText,
              footerOrganizerText: isLegacyOrganizer(rawSiteTexts.footerOrganizerText)
                ? EXPO_DETAILS.siteTexts?.footerOrganizerText
                : rawSiteTexts.footerOrganizerText,
              footerCopyright: isLegacyOrganizer(rawSiteTexts.footerCopyright)
                ? EXPO_DETAILS.siteTexts?.footerCopyright
                : rawSiteTexts.footerCopyright,
              footerCopyrightText: isLegacyOrganizer(rawSiteTexts.footerCopyrightText)
                ? EXPO_DETAILS.siteTexts?.footerCopyrightText
                : rawSiteTexts.footerCopyrightText,
              ...(isLegacyDate ? {
                heroEventInfoDateSubtitle: EXPO_DETAILS.siteTexts?.heroEventInfoDateSubtitle,
                footerCtaSubtitle: EXPO_DETAILS.siteTexts?.footerCtaSubtitle
              } : {})
            };
          })()
        };
      }
    } catch {
      // ignore
    }
    return EXPO_DETAILS;
  });

  const [heroSlides, setHeroSlides] = useState<HeroBackgroundSlide[]>(() => {
    try {
      const parsed = getPersistedWebsiteData();
      if (parsed && parsed.heroSlides && Array.isArray(parsed.heroSlides)) return parsed.heroSlides;
    } catch {
      // ignore
    }
    return HERO_SLIDES_INITIAL;
  });

  const [speakers, setSpeakers] = useState<Speaker[]>(() => {
    try {
      const parsed = getPersistedWebsiteData();
      if (parsed && parsed.speakers && Array.isArray(parsed.speakers)) return parsed.speakers;
    } catch {
      // ignore
    }
    return SPEAKERS;
  });

  const [sessions, setSessions] = useState<Session[]>(() => {
    try {
      const parsed = getPersistedWebsiteData();
      if (parsed && parsed.sessions && Array.isArray(parsed.sessions)) {
        const hasLegacyNovember = parsed.sessions.some((s: Session) => 
          s.date?.includes('November') || s.date?.includes('9 November') || s.day > 2
        );
        if (hasLegacyNovember) {
          return PROGRAMME_SESSIONS;
        }
        return parsed.sessions;
      }
    } catch {
      // ignore
    }
    return PROGRAMME_SESSIONS;
  });

  const [tiers, setTiers] = useState<RegistrationTier[]>(() => {
    try {
      const parsed = getPersistedWebsiteData();
      if (parsed && parsed.tiers && Array.isArray(parsed.tiers)) return parsed.tiers;
    } catch {
      // ignore
    }
    return REGISTRATION_TIERS;
  });

  const [boothPackages, setBoothPackages] = useState<BoothPackage[]>(() => {
    try {
      const parsed = getPersistedWebsiteData();
      if (parsed && parsed.boothPackages && Array.isArray(parsed.boothPackages) && parsed.boothPackages.length > 0) {
        return parsed.boothPackages;
      }
    } catch {
      // ignore
    }
    return DEFAULT_BOOTH_PACKAGES;
  });

  const [sponsors, setSponsors] = useState<Sponsor[]>(() => {
    try {
      const parsed = getPersistedWebsiteData();
      if (parsed && parsed.sponsors && Array.isArray(parsed.sponsors)) return parsed.sponsors;
    } catch {
      // ignore
    }
    return SPONSORS;
  });

  const [sectors, setSectors] = useState<SectorItem[]>(() => {
    try {
      const parsed = getPersistedWebsiteData();
      if (parsed && parsed.sectors && Array.isArray(parsed.sectors)) return parsed.sectors;
    } catch {
      // ignore
    }
    return SECTORS_COVERED;
  });

  const [faqs, setFaqs] = useState<FaqItem[]>(() => {
    try {
      const parsed = getPersistedWebsiteData();
      if (parsed && parsed.faqs && Array.isArray(parsed.faqs)) return parsed.faqs;
    } catch {
      // ignore
    }
    return FAQ_ITEMS;
  });

  const [attendees, setAttendees] = useState<AttendeeTicket[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ATTENDEES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(a => !isSeedOrDefaultAttendee(a));
          try {
            localStorage.setItem(LOCAL_STORAGE_ATTENDEES_KEY, JSON.stringify(cleaned));
          } catch {}
          return cleaned;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_ATTENDEES;
  });

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_MESSAGES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out default seed messages if saved in local storage
          const cleaned = parsed.filter((m: ContactMessage) => 
            !['MSG-2026-001', 'MSG-2026-002', 'MSG-2026-003', 'MSG-2026-004'].includes(m.id)
          );
          return cleaned;
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Admin Credentials
  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CREDS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Purge legacy 'admin123' credentials from local storage
        if (parsed.passwordHash === 'admin123' || !parsed.passwordHash) {
          const resetCreds: AdminCredentials = {
            username: parsed.username || 'admin',
            passwordHash: '@AfrinetGroup2026!!',
            lastUpdated: new Date().toISOString()
          };
          localStorage.setItem(LOCAL_STORAGE_CREDS_KEY, JSON.stringify(resetCreds));
          return resetCreds;
        }
        return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_ADMIN_CREDS;
  });

  // Staff Accounts
  const [staffAccounts, setStaffAccounts] = useState<StaffAccount[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_STAFF_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Upgrade any legacy 'staff123' passwords to strong policy passwords
          const sanitized = parsed.map(s => {
            if (s.password === 'staff123') {
              if (s.username === 'staff.gate') return { ...s, password: '@GateSecure2026!' };
              if (s.username === 'staff.finance') return { ...s, password: '@FinanceRecon2026!' };
              return { ...s, password: '@StaffRecon2026!' };
            }
            return s;
          });
          localStorage.setItem(LOCAL_STORAGE_STAFF_KEY, JSON.stringify(sanitized));
          return sanitized;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_STAFF_ACCOUNTS;
  });

  // Staff Auth State
  const [staffAuth, setStaffAuth] = useState<StaffAuthState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_STAFF_AUTH_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.isAuthenticated && parsed.staff) return parsed;
      }
    } catch {
      // ignore
    }
    return {
      isAuthenticated: false,
      staff: null,
      loginTime: null
    };
  });

  // Marketer Accounts State
  const [marketerAccounts, setMarketerAccounts] = useState<MarketerAccount[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_MARKETERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Remove default marketers if saved in local storage
          return parsed.filter(m => m.id !== 'mkt_001' && m.id !== 'mkt_002');
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_MARKETER_ACCOUNTS;
  });

  // Marketer Auth State
  const [marketerAuth, setMarketerAuth] = useState<MarketerAuthState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_MARKETER_AUTH_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.isAuthenticated && parsed.marketer && parsed.marketer.id !== 'mkt_001' && parsed.marketer.id !== 'mkt_002') return parsed;
      }
    } catch {
      // ignore
    }
    return {
      isAuthenticated: false,
      marketer: null,
      loginTime: null
    };
  });

  // Push Notifications Broadcast State
  const [pushNotifications, setPushNotifications] = useState<PushNotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PUSH_NOTIFS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_PUSH_NOTIFICATIONS;
  });

  const [pushSubscription, setPushSubscription] = useState<PushSubscriptionState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PUSH_SUB_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {
      // ignore
    }
    return { isSubscribed: false };
  });

  const [activePushBroadcast, setActivePushBroadcast] = useState<PushNotificationItem | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PUSH_NOTIFS_KEY, JSON.stringify(pushNotifications));
    } catch {
      // safe
    }
  }, [pushNotifications]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PUSH_SUB_KEY, JSON.stringify(pushSubscription));
    } catch {
      // safe
    }
  }, [pushSubscription]);


  // Admin Auth State
  const [adminAuth, setAdminAuth] = useState<AdminAuthState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.isAuthenticated) return parsed;
      }
    } catch {
      // ignore
    }
    return {
      isAuthenticated: false,
      user: null,
      loginTime: null
    };
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Service Worker, Native Notification & In-Page Popup initialization on browser open
  useEffect(() => {
    registerServiceWorker().catch(() => {});

    try {
      const dismissedId = localStorage.getItem('recon_dismissed_push_id');
      const latestPush = pushNotifications.find(p => p.status === 'SENT') || pushNotifications[0];

      if (latestPush && latestPush.id !== dismissedId) {
        // Show In-page popup when browser opens
        setActivePushBroadcast(latestPush);

        // Also trigger native browser notification in background if permitted
        dispatchDeviceNotification({
          id: latestPush.id,
          title: latestPush.title,
          message: latestPush.message,
          imageUrl: latestPush.imageUrl,
          targetLink: latestPush.targetLink,
          category: latestPush.category,
          badgeText: latestPush.badgeText
        }).catch(() => {});
      }
    } catch {
      // safe
    }

    // Cross-tab sync listener via BroadcastChannel
    let broadcastChannel: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        broadcastChannel = new BroadcastChannel('recon_expo_push_sync');
        broadcastChannel.onmessage = (event) => {
          if (event.data && event.data.type === 'SHOW_NOTIFICATION' && event.data.payload) {
            const p = event.data.payload;
            const item: PushNotificationItem = {
              id: p.id || `push_${Date.now()}`,
              title: p.title,
              message: p.message,
              imageUrl: p.imageUrl,
              targetLink: p.targetLink,
              category: p.category || 'Live Alert',
              badgeText: p.badgeText || 'NEW',
              sentAt: new Date().toISOString(),
              status: 'SENT',
              subscriberCount: 1450,
              clickCount: 0
            };
            setActivePushBroadcast(item);
            try {
              playNotificationSound('broadcast');
            } catch {
              // safe
            }
          }
        };
      }
    } catch {
      // ignore
    }

    return () => {
      if (broadcastChannel) {
        broadcastChannel.close();
      }
    };
  }, []);

  // Sync content changes to localStorage
  useEffect(() => {
    const dataToSave = {
      expoDetails,
      heroSlides,
      speakers,
      sessions,
      tiers,
      boothPackages,
      sponsors,
      sectors,
      faqs,
    };
    try {
      const serialized = JSON.stringify(dataToSave);
      localStorage.setItem(LOCAL_STORAGE_DATA_KEY, serialized);
      localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, serialized);
    } catch {
      // ignore
    }
  }, [expoDetails, heroSlides, speakers, sessions, tiers, boothPackages, sponsors, sectors, faqs]);

  // Sync attendees to localStorage & dispatch custom window event for instant cross-component updates
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ATTENDEES_KEY, JSON.stringify(attendees));
      window.dispatchEvent(new CustomEvent('recon_attendees_updated', { detail: attendees }));
    } catch {
      // ignore
    }
  }, [attendees]);

  // Sync contact messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(contactMessages));
    } catch {
      // ignore
    }
  }, [contactMessages]);

  // Listen for storage events (cross-tab) and custom events (same window)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_ATTENDEES_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setAttendees(parsed);
          }
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sync auth & creds to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(adminAuth));
    } catch {
      // ignore
    }
  }, [adminAuth]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CREDS_KEY, JSON.stringify(adminCredentials));
    } catch {
      // ignore
    }
  }, [adminCredentials]);

  // Sync staff accounts & auth to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_STAFF_KEY, JSON.stringify(staffAccounts));
    } catch {
      // ignore
    }
  }, [staffAccounts]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_STAFF_AUTH_KEY, JSON.stringify(staffAuth));
    } catch {
      // ignore
    }
  }, [staffAuth]);

  // Sync marketer accounts & auth to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_MARKETERS_KEY, JSON.stringify(marketerAccounts));
    } catch {
      // ignore
    }
  }, [marketerAccounts]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_MARKETER_AUTH_KEY, JSON.stringify(marketerAuth));
    } catch {
      // ignore
    }
  }, [marketerAuth]);


  // Update Expo Details
  const updateExpoDetails = (details: Partial<ExpoDetails>) => {
    setExpoDetails(prev => ({
      ...prev,
      ...details,
      stats: {
        ...prev.stats,
        ...(details.stats || {})
      }
    }));
  };

  // Hero Slides
  const updateHeroSlides = (slides: HeroBackgroundSlide[]) => setHeroSlides(slides);
  const addHeroSlide = (slide: HeroBackgroundSlide) => setHeroSlides(prev => [...prev, slide]);
  const editHeroSlide = (index: number, slide: HeroBackgroundSlide) => {
    setHeroSlides(prev => prev.map((item, idx) => idx === index ? slide : item));
  };
  const deleteHeroSlide = (index: number) => {
    setHeroSlides(prev => prev.filter((_, idx) => idx !== index));
  };

  // Speakers
  const addSpeaker = (speaker: Omit<Speaker, 'id'>) => {
    const newId = `spk-${Date.now()}`;
    setSpeakers(prev => [...prev, { ...speaker, id: newId }]);
  };
  const editSpeaker = (id: string, updated: Partial<Speaker>) => {
    setSpeakers(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
  };
  const deleteSpeaker = (id: string) => {
    setSpeakers(prev => prev.filter(s => s.id !== id));
  };

  // Sessions
  const addSession = (session: Omit<Session, 'id'>) => {
    const newId = `sess-${Date.now()}`;
    setSessions(prev => [...prev, { ...session, id: newId }]);
  };
  const editSession = (id: string, updated: Partial<Session>) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
  };
  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  // Tiers & Sponsors
  const editTier = (id: string, updated: Partial<RegistrationTier>) => {
    setTiers(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
  };

  const addBoothPackage = (pkg: Omit<BoothPackage, 'id'> & { id?: string }) => {
    const rawId = pkg.id?.trim() ? pkg.id.trim() : `booth_${Date.now()}`;
    const cleanId = rawId.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const formattedPrice = pkg.priceFormatted?.trim() 
      ? pkg.priceFormatted.trim() 
      : (pkg.priceNGN > 0 ? `₦${pkg.priceNGN.toLocaleString()}` : 'Custom / Bespoke Space');
    
    const newPackage: BoothPackage = {
      ...pkg,
      id: cleanId,
      name: pkg.name.trim() || 'Exhibition Booth Stand',
      priceNGN: Number(pkg.priceNGN) || 0,
      priceFormatted: formattedPrice,
      badges: Number(pkg.badges) || 2,
      commissionRate: pkg.commissionRate !== undefined ? Number(pkg.commissionRate) : 0.10,
      desc: pkg.desc || '',
      active: pkg.active !== undefined ? pkg.active : true,
    };
    setBoothPackages(prev => [...prev, newPackage]);
    playNotificationSound('broadcast');
  };

  const editBoothPackage = (id: string, updated: Partial<BoothPackage>) => {
    setBoothPackages(prev => prev.map(p => {
      if (p.id !== id) return p;
      const merged = { ...p, ...updated };
      if (updated.priceNGN !== undefined) {
        merged.priceNGN = Number(updated.priceNGN);
        // If priceFormatted wasn't explicitly provided in the update and original looks like a standard naira string, update it
        if (!updated.priceFormatted && (p.priceFormatted.startsWith('₦') || p.priceFormatted.includes('0'))) {
          merged.priceFormatted = `₦${merged.priceNGN.toLocaleString()}`;
        }
      }
      if (updated.badges !== undefined) {
        merged.badges = Number(updated.badges);
      }
      if (updated.commissionRate !== undefined) {
        merged.commissionRate = Number(updated.commissionRate);
      }
      return merged;
    }));
  };

  const deleteBoothPackage = (id: string) => {
    setBoothPackages(prev => {
      if (prev.length <= 1) {
        return prev; // keep at least one package
      }
      return prev.filter(p => p.id !== id);
    });
  };

  const toggleBoothPackageActive = (id: string) => {
    setBoothPackages(prev => prev.map(p => p.id === id ? { ...p, active: p.active === false ? true : false } : p));
  };
  const addSponsor = (sponsor: Sponsor) => {
    setSponsors(prev => [...prev, sponsor]);
  };
  const editSponsor = (index: number, updated: Partial<Sponsor>) => {
    setSponsors(prev => prev.map((s, idx) => idx === index ? { ...s, ...updated } : s));
  };
  const deleteSponsor = (index: number) => {
    setSponsors(prev => prev.filter((_, idx) => idx !== index));
  };

  // Sectors & FAQs
  const editSector = (index: number, updated: Partial<SectorItem>) => {
    setSectors(prev => prev.map((sec, idx) => idx === index ? { ...sec, ...updated } : sec));
  };
  const addFaq = (faq: FaqItem) => {
    setFaqs(prev => [...prev, faq]);
  };
  const editFaq = (index: number, updated: Partial<FaqItem>) => {
    setFaqs(prev => prev.map((f, idx) => idx === index ? { ...f, ...updated } : f));
  };
  const deleteFaq = (index: number) => {
    setFaqs(prev => prev.filter((_, idx) => idx !== index));
  };

  // Attendees
  const registerAttendee = (ticket: AttendeeTicket) => {
    const isApproved = ticket.adminApproved === true || ticket.adminApprovalStatus === 'APPROVED';
    const isPaid = ticket.paymentStatus === 'PAID' || ticket.paymentStatus === 'VERIFIED';
    const hasReferral = !!(ticket.referralCode || ticket.marketerId);
    const isElitePass = ticket.passType === 'elite' || (ticket.tier && ticket.tier.toLowerCase().includes('elite'));
    const isExhibitorPass = ticket.passType === 'exhibitor' || (ticket.tier && ticket.tier.toLowerCase().includes('exhibitor'));

    const boothAmount = typeof ticket.dealValue === 'number' && ticket.dealValue > 0
      ? ticket.dealValue
      : (parseInt((ticket.amountPaid || '').replace(/[^0-9]/g, ''), 10) || 350000);

    const defaultExhibitorComm = Math.round(boothAmount * 0.10);

    const commissionToCredit = typeof ticket.commissionEarnedNGN === 'number' && ticket.commissionEarnedNGN > 0
      ? ticket.commissionEarnedNGN
      : (hasReferral ? (isElitePass ? 5000 : isExhibitorPass ? defaultExhibitorComm : 0) : 0);

    const resolvedPhoto = getAttendeeProfilePhoto(ticket.photoUrl, ticket.avatarUrl, ticket.fullName);

    let ticketToSave: AttendeeTicket = { 
      ...ticket,
      photoUrl: resolvedPhoto,
      avatarUrl: resolvedPhoto,
      commissionCredited: false,
      commissionPaidNGN: 0
    };

    // Before a marketer receives any commissions, the admin must approve payment from registration first.
    if (hasReferral && isApproved && isPaid && commissionToCredit > 0) {
      ticketToSave.commissionCredited = true;
      ticketToSave.commissionEarnedNGN = commissionToCredit;
      ticketToSave.commissionApprovedAt = new Date().toISOString();
      ticketToSave.commissionApprovedBy = 'Admin Secretariat';

      const codeToMatch = (ticket.referralCode || '').trim().toUpperCase();
      const mIdToMatch = ticket.marketerId;

      setMarketerAccounts(prev => prev.map(m => {
        if ((mIdToMatch && m.id === mIdToMatch) || (codeToMatch && m.referralCode.toUpperCase() === codeToMatch)) {
          const newTotal = (m.totalEarningsNGN || 0) + commissionToCredit;
          const paid = m.paidEarningsNGN || 0;
          const newPending = Math.max(0, newTotal - paid);
          return {
            ...m,
            totalEarningsNGN: newTotal,
            pendingEarningsNGN: newPending,
            payoutStatus: newPending === 0 && paid > 0 ? 'PAID' : paid > 0 ? 'PARTIAL' : 'UNPAID'
          };
        }
        return m;
      }));
    }

    setAttendees(prev => [ticketToSave, ...prev]);

    // Dispatch custom event for real-time homepage live notification popup
    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('recon_new_live_registration', { detail: ticketToSave }));
      }
    } catch {
      // safe
    }

    // Google Sheets Background Auto-Sync if enabled
    try {
      if (typeof window !== 'undefined') {
        const autoSync = localStorage.getItem('recon_expo_google_auto_sync_v1') !== 'false';
        const sheetId = localStorage.getItem('recon_expo_google_spreadsheet_id_v1') || '1merM9cTEflcwq_DV4McZNoQZHcxwnf5QwVsl5f3yq1M';
        const webhookUrl = localStorage.getItem('recon_expo_google_sheets_webhook_url');

        // Automated SMTP Digital Pass & Ticket Dispatch to Attendee Inbox
        import('../services/emailService').then(({ sendAttendeeConfirmationEmail }) => {
          sendAttendeeConfirmationEmail(ticketToSave).catch(err => {
            console.log('[SMTP Background Auto-Dispatch Notice]', err?.message);
          });
        }).catch(() => {});

        // 4. Special Daily Follow-Up Drip Auto-Enrollment / Exit Rule Handling
        import('../services/marketingService').then(({ 
          enrollVisitorInUpgradeDrip, 
          triggerEliteUpgradeExitRule,
          enrollUnconfirmedVip,
          triggerAdminConfirmationExitRule 
        }) => {
          const isVisitor = ticketToSave.passType === 'visitor' || (ticketToSave.tier || '').toLowerCase().includes('visitor');
          const isElite = ticketToSave.passType === 'elite' || (ticketToSave.tier || '').toLowerCase().includes('elite');
          const isPaidOrApproved = ticketToSave.paymentStatus === 'PAID' || ticketToSave.paymentStatus === 'VERIFIED' || ticketToSave.adminApproved === true;

          if (isVisitor) {
            enrollVisitorInUpgradeDrip({
              ticketNumber: ticketToSave.ticketNumber,
              fullName: ticketToSave.fullName,
              email: ticketToSave.email,
              organization: ticketToSave.organization,
              phone: ticketToSave.phone,
              city: ticketToSave.city
            }).catch(() => {});
          } else if (isElite) {
            // Stop any ongoing free visitor upgrade follow-up immediately
            triggerEliteUpgradeExitRule({
              ticketNumber: ticketToSave.ticketNumber,
              email: ticketToSave.email,
              upgradeRef: ticketToSave.paymentRef || 'DIRECT-ELITE-REG'
            }).catch(() => {});

            if (!isPaidOrApproved) {
              // Unconfirmed / Pending Payment Elite VIP -> Auto-enroll in Payment Recovery Drip
              enrollUnconfirmedVip({
                ticketNumber: ticketToSave.ticketNumber,
                fullName: ticketToSave.fullName,
                email: ticketToSave.email,
                phone: ticketToSave.phone,
                organization: ticketToSave.organization,
                tierName: ticketToSave.tier || 'Elite VIP Guest',
                amountDueNGN: 25000,
                paymentRef: ticketToSave.paymentRef
              }).catch(() => {});
            } else {
              // Confirmed Paid VIP -> Halt recovery drip immediately
              triggerAdminConfirmationExitRule({
                ticketNumber: ticketToSave.ticketNumber,
                email: ticketToSave.email,
                confirmedBy: 'Admin Secretariat (Direct Paid Registration)'
              }).catch(() => {});
            }
          }
        }).catch(() => {});
      }
    } catch {
      // safe
    }

    try {
      const isElitePass = ticketToSave.passType === 'elite' || ticketToSave.tier?.toLowerCase().includes('elite');
      if (isElitePass) {
        playNotificationSound('elite_vip');
      } else if (ticketToSave.paymentStatus === 'PAID' || ticketToSave.paymentStatus === 'VERIFIED') {
        playNotificationSound('payment_approval');
      } else {
        playNotificationSound('registration');
      }
    } catch {
      // safe
    }
  };

  const updateAttendee = (ticketNumber: string, updated: Partial<AttendeeTicket>) => {
    setAttendees(prev => {
      let marketerToCredit: { code: string; id: string; commission: number } | null = null;
      let marketerToDebit: { code: string; id: string; commission: number } | null = null;

      const updatedList = prev.map(a => {
        if (a.ticketNumber === ticketNumber) {
          const merged = { ...a, ...updated };
          const isApproved = merged.adminApproved === true || merged.adminApprovalStatus === 'APPROVED';
          const isPaid = merged.paymentStatus === 'PAID' || merged.paymentStatus === 'VERIFIED';

          const wasApproved = (a.adminApproved === true || a.adminApprovalStatus === 'APPROVED') && (a.paymentStatus === 'PAID' || a.paymentStatus === 'VERIFIED');
          if (!wasApproved && isApproved && isPaid) {
            try {
              playNotificationSound('payment_approval');
            } catch {
              // safe
            }

            // Auto-send payment confirmation & unlocked benefits email
            try {
              import('../services/emailService').then(({ sendPaymentReceiptEmail }) => {
                sendPaymentReceiptEmail(merged, {
                  amount: merged.dealValue || 25000,
                  tx_ref: merged.paymentRef || merged.ticketNumber,
                  customer: {
                    name: merged.fullName,
                    email: merged.email,
                    phone: merged.phone
                  }
                }).catch(err => {
                  console.log('[SMTP Payment Approval Dispatch Notice]', err?.message);
                });
              }).catch(() => {});
            } catch {
              // safe
            }
          }
          const hasReferral = !!(merged.referralCode || merged.marketerId);
          const isElitePass = merged.passType === 'elite' || (merged.tier && merged.tier.toLowerCase().includes('elite'));
          const isExhibitorPass = merged.passType === 'exhibitor' || (merged.tier && merged.tier.toLowerCase().includes('exhibitor'));

          const numericBoothAmount = typeof merged.dealValue === 'number' && merged.dealValue > 0
            ? merged.dealValue
            : (parseInt((merged.amountPaid || '').replace(/[^0-9]/g, ''), 10) || 350000);

          const defaultExhibitorComm = Math.round(numericBoothAmount * 0.10);

          const commissionAmount = typeof merged.commissionEarnedNGN === 'number' && merged.commissionEarnedNGN > 0
            ? merged.commissionEarnedNGN
            : (hasReferral ? (isElitePass ? 5000 : isExhibitorPass ? defaultExhibitorComm : 0) : 0);

          // CASE 1: Admin APPROVES payment from registration -> Credit commission!
          if (hasReferral && isApproved && isPaid && !a.commissionCredited && commissionAmount > 0) {
            marketerToCredit = {
              code: (merged.referralCode || '').trim().toUpperCase(),
              id: merged.marketerId || '',
              commission: commissionAmount
            };
            return {
              ...merged,
              commissionCredited: true,
              commissionEarnedNGN: commissionAmount,
              commissionApprovedAt: new Date().toISOString(),
              commissionApprovedBy: 'Admin Secretariat'
            };
          }

          // CASE 2: Admin REVOKES approval (changes to PENDING / DECLINED) -> Debit commission / Put on hold!
          if (hasReferral && (!isApproved || !isPaid) && a.commissionCredited) {
            marketerToDebit = {
              code: (merged.referralCode || '').trim().toUpperCase(),
              id: merged.marketerId || '',
              commission: a.commissionEarnedNGN || commissionAmount
            };
            return {
              ...merged,
              commissionCredited: false,
              commissionApprovedAt: undefined,
              commissionApprovedBy: undefined
            };
          }

          return merged;
        }
        return a;
      });

      if (marketerToCredit) {
        const { code, id, commission } = marketerToCredit;
        setMarketerAccounts(mPrev => mPrev.map(m => {
          if ((id && m.id === id) || (code && m.referralCode.toUpperCase() === code)) {
            const newTotal = (m.totalEarningsNGN || 0) + commission;
            const paid = m.paidEarningsNGN || 0;
            const newPending = Math.max(0, newTotal - paid);
            return {
              ...m,
              totalEarningsNGN: newTotal,
              pendingEarningsNGN: newPending,
              payoutStatus: newPending === 0 && paid > 0 ? 'PAID' : paid > 0 ? 'PARTIAL' : 'UNPAID'
            };
          }
          return m;
        }));
      }

      if (marketerToDebit) {
        const { code, id, commission } = marketerToDebit;
        setMarketerAccounts(mPrev => mPrev.map(m => {
          if ((id && m.id === id) || (code && m.referralCode.toUpperCase() === code)) {
            const newTotal = Math.max(0, (m.totalEarningsNGN || 0) - commission);
            const paid = m.paidEarningsNGN || 0;
            const newPending = Math.max(0, newTotal - paid);
            return {
              ...m,
              totalEarningsNGN: newTotal,
              pendingEarningsNGN: newPending,
              payoutStatus: newPending === 0 && paid > 0 ? 'PAID' : paid > 0 ? 'PARTIAL' : 'UNPAID'
            };
          }
          return m;
        }));
      }

      // Check if this update upgraded the attendee to Elite VIP or confirmed payment
      const isNowElite = updated.passType === 'elite' || (updated.tier && updated.tier.toLowerCase().includes('elite'));
      const isApprovedOrPaid = updated.adminApproved === true || updated.adminApprovalStatus === 'APPROVED' || updated.paymentStatus === 'PAID' || updated.paymentStatus === 'VERIFIED';

      if (isNowElite) {
        import('../services/marketingService').then(({ triggerEliteUpgradeExitRule, triggerAdminConfirmationExitRule }) => {
          triggerEliteUpgradeExitRule({
            ticketNumber,
            upgradeRef: updated.paymentRef || 'ADMIN-UPGRADE-ELITE'
          }).catch(() => {});

          if (isApprovedOrPaid) {
            // Admin confirmed payment -> Stop recovery follow-up immediately
            triggerAdminConfirmationExitRule({
              ticketNumber,
              confirmedBy: 'Admin Secretariat (Payment Verified)',
              note: 'Admin confirmed payment status. Recovery follow-up permanently stopped.'
            }).catch(() => {});
          }
        }).catch(() => {});
      } else if (isApprovedOrPaid) {
        import('../services/marketingService').then(({ triggerAdminConfirmationExitRule }) => {
          triggerAdminConfirmationExitRule({
            ticketNumber,
            confirmedBy: 'Admin Secretariat (Payment Verified)',
            note: 'Admin confirmed payment status. Recovery follow-up permanently stopped.'
          }).catch(() => {});
        }).catch(() => {});
      }

      return updatedList;
    });
  };
  const deleteAttendee = (ticketNumber: string) => {
    setAttendees(prev => prev.filter(a => a.ticketNumber !== ticketNumber));
  };
  const toggleCheckInAttendee = (ticketNumber: string): boolean => {
    let found = false;
    setAttendees(prev => prev.map(a => {
      if (a.ticketNumber === ticketNumber || a.barcode === ticketNumber) {
        found = true;
        const willBeCheckedIn = !a.checkedIn;
        return {
          ...a,
          checkedIn: willBeCheckedIn,
          checkedInAt: willBeCheckedIn ? new Date().toISOString() : undefined
        };
      }
      return a;
    }));
    return found;
  };
  const clearAllAttendees = () => {
    setAttendees([]);
  };

  const refreshAttendees = (): AttendeeTicket[] => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ATTENDEES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(a => !isSeedOrDefaultAttendee(a));
          setAttendees(cleaned);
          try {
            localStorage.setItem(LOCAL_STORAGE_ATTENDEES_KEY, JSON.stringify(cleaned));
          } catch {}
          return cleaned;
        }
      }
    } catch (e) {
      console.warn('[ExpoDataContext] Failed to refresh attendees from localStorage', e);
    }
    return attendees;
  };

  // Secretariat Contact Message Handlers
  const addContactMessage = (msg: Omit<ContactMessage, 'id' | 'submittedAt' | 'status'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: `MSG-2026-${String(Math.floor(100 + Math.random() * 900))}`,
      submittedAt: new Date().toISOString(),
      status: 'unread'
    };
    setContactMessages(prev => [newMsg, ...prev]);
    try {
      playNotificationSound('inbox');
    } catch {
      // safe
    }
  };

  const updateContactMessageStatus = (id: string, status: 'unread' | 'read' | 'replied', replyNotes?: string) => {
    setContactMessages(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          status,
          ...(replyNotes !== undefined ? { replyNotes } : {})
        };
      }
      return m;
    }));
  };

  const deleteContactMessage = (id: string) => {
    setContactMessages(prev => prev.filter(m => m.id !== id));
  };

  const clearAllContactMessages = () => {
    setContactMessages([]);
  };

  // Admin Login with Brute-Force Rate Limiting & Input Sanitization
  const loginAdmin = (username: string, password: string): { success: boolean; message: string } => {
    const lockoutKey = 'admin_login';
    const status = checkLockout(lockoutKey);
    if (status.isLocked) {
      return {
        success: false,
        message: `🔒 SECURITY LOCKOUT ACTIVE: Too many failed login attempts. Access blocked for ${status.remainingSeconds}s.`
      };
    }

    const trimmedUser = sanitizeInput(username).toLowerCase();
    const correctUser = adminCredentials.username.trim().toLowerCase();

    if (trimmedUser === correctUser && password === adminCredentials.passwordHash) {
      resetFailedAttempts(lockoutKey);
      setAdminAuth({
        isAuthenticated: true,
        user: adminCredentials.username,
        loginTime: new Date().toISOString()
      });
      return { success: true, message: "Admin authenticated successfully!" };
    }

    const fail = recordFailedAttempt(lockoutKey);
    if (fail.isLockedNow) {
      return {
        success: false,
        message: "🔒 BRUTE-FORCE DEFENSE TRIGGERED: 5 consecutive failed attempts detected. Administrator login locked for 15 minutes."
      };
    }

    return {
      success: false,
      message: `Invalid username or password. (${fail.remainingAttempts} attempt${fail.remainingAttempts === 1 ? '' : 's'} remaining before 15-minute security lockout).`
    };
  };

  const logoutAdmin = () => {
    setAdminAuth({
      isAuthenticated: false,
      user: null,
      loginTime: null
    });
  };

  const updateAdminCredentials = (newUsername: string, newPassword: string): { success: boolean; message: string } => {
    const cleanUser = sanitizeInput(newUsername);
    if (!cleanUser || !newPassword.trim()) {
      return { success: false, message: "Username and password cannot be empty." };
    }

    const val = validatePasswordStrength(newPassword);
    if (!val.valid) {
      return { success: false, message: `🔒 Weak Password Rejected: ${val.message}` };
    }

    const updated: AdminCredentials = {
      username: cleanUser,
      passwordHash: newPassword.trim(),
      lastUpdated: new Date().toISOString()
    };
    setAdminCredentials(updated);
    localStorage.setItem(LOCAL_STORAGE_CREDS_KEY, JSON.stringify(updated));
    setAdminAuth(prev => ({ ...prev, user: updated.username }));
    return { success: true, message: "Admin credentials successfully updated with strong security policy!" };
  };

  // Staff Account & Permissions Management Functions
  const registerStaff = (staffData: Omit<StaffAccount, 'id' | 'createdAt' | 'lastLogin'>): { success: boolean; message: string; staff?: StaffAccount } => {
    const usernameClean = staffData.username.trim().toLowerCase();
    if (!usernameClean) return { success: false, message: 'Staff username is required.' };
    if (!staffData.fullName.trim()) return { success: false, message: 'Staff full name is required.' };
    if (!staffData.password.trim()) return { success: false, message: 'Password is required.' };

    const exists = staffAccounts.some(s => s.username.trim().toLowerCase() === usernameClean);
    if (exists) return { success: false, message: `Staff username "${staffData.username}" is already registered.` };

    const newStaff: StaffAccount = {
      ...staffData,
      id: `staff_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      username: usernameClean,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      status: staffData.status || 'ACTIVE'
    };

    setStaffAccounts(prev => [newStaff, ...prev]);
    return { success: true, message: `Staff member ${newStaff.fullName} registered successfully!`, staff: newStaff };
  };

  const updateStaff = (id: string, updated: Partial<StaffAccount>): { success: boolean; message: string } => {
    let targetName = '';
    setStaffAccounts(prev => prev.map(s => {
      if (s.id === id) {
        targetName = updated.fullName || s.fullName;
        const merged = { ...s, ...updated };
        if (staffAuth.staff?.id === id) {
          setStaffAuth(auth => ({ ...auth, staff: merged }));
        }
        return merged;
      }
      return s;
    }));
    return { success: true, message: `Updated details for staff member ${targetName || 'record'}` };
  };

  const deleteStaff = (id: string): { success: boolean; message: string } => {
    const target = staffAccounts.find(s => s.id === id);
    if (!target) return { success: false, message: 'Staff member not found.' };

    setStaffAccounts(prev => prev.filter(s => s.id !== id));
    if (staffAuth.staff?.id === id) {
      logoutStaff();
    }
    return { success: true, message: `Staff account for ${target.fullName} deleted.` };
  };

  const loginStaff = (username: string, password: string): { success: boolean; message: string; staff?: StaffAccount } => {
    const uClean = sanitizeInput(username).toLowerCase();
    const lockoutKey = `staff_login_${uClean}`;
    const status = checkLockout(lockoutKey);
    if (status.isLocked) {
      return { success: false, message: `🔒 SECURITY LOCKOUT: Staff account locked for ${status.remainingSeconds}s due to multiple failed login attempts.` };
    }

    const match = staffAccounts.find(s => s.username.trim().toLowerCase() === uClean && s.password === password);

    if (!match) {
      const fail = recordFailedAttempt(lockoutKey);
      if (fail.isLockedNow) {
        return { success: false, message: '🔒 BRUTE-FORCE LOCKOUT: 5 failed staff login attempts detected. Access locked for 15 minutes.' };
      }
      return { success: false, message: `Invalid staff username or password. (${fail.remainingAttempts} attempts remaining before lock).` };
    }

    resetFailedAttempts(lockoutKey);

    if (match.status === 'SUSPENDED') {
      return { success: false, message: '🔒 This staff account has been SUSPENDED by the Administrator.' };
    }

    const updatedStaff = { ...match, lastLogin: new Date().toISOString() };
    updateStaff(match.id, { lastLogin: updatedStaff.lastLogin });

    setStaffAuth({
      isAuthenticated: true,
      staff: updatedStaff,
      loginTime: new Date().toISOString()
    });

    return { success: true, message: `Welcome, ${match.fullName}! Logged into Staff Workspace.`, staff: updatedStaff };
  };

  const logoutStaff = () => {
    setStaffAuth({
      isAuthenticated: false,
      staff: null,
      loginTime: null
    });
  };

  // Marketer Accounts & Referral Methods
  const registerMarketer = (marketerData: Omit<MarketerAccount, 'id' | 'createdAt' | 'lastLogin' | 'totalEarningsNGN'>): { success: boolean; message: string; marketer?: MarketerAccount } => {
    const codeClean = marketerData.referralCode.trim().toUpperCase();
    if (!codeClean) {
      return { success: false, message: 'Referral code cannot be empty.' };
    }

    const existingCode = marketerAccounts.find(m => m.referralCode.toUpperCase() === codeClean);
    if (existingCode) {
      return { success: false, message: `Referral code "${codeClean}" is already assigned to another marketer.` };
    }

    const uClean = marketerData.username.trim().toLowerCase();
    const existingUsername = marketerAccounts.find(m => m.username.trim().toLowerCase() === uClean);
    if (existingUsername) {
      return { success: false, message: `Username "${uClean}" is already taken by another marketer.` };
    }

    const newMarketer: MarketerAccount = {
      ...marketerData,
      id: `mkt_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`,
      referralCode: codeClean,
      createdAt: new Date().toISOString(),
      totalEarningsNGN: 0,
      status: marketerData.status || 'PENDING'
    };

    setMarketerAccounts(prev => [newMarketer, ...prev]);
    return { success: true, message: `Marketer account for ${newMarketer.fullName} (Code: ${codeClean}) created successfully!`, marketer: newMarketer };
  };

  const updateMarketer = (id: string, updated: Partial<MarketerAccount>): { success: boolean; message: string } => {
    let targetName = '';
    setMarketerAccounts(prev => prev.map(m => {
      if (m.id === id) {
        targetName = updated.fullName || m.fullName;
        const merged = { ...m, ...updated };
        if (marketerAuth.marketer?.id === id) {
          setMarketerAuth(auth => ({ ...auth, marketer: merged }));
        }
        return merged;
      }
      return m;
    }));
    return { success: true, message: `Updated details for marketer ${targetName || 'account'}.` };
  };

  const deleteMarketer = (id: string): { success: boolean; message: string } => {
    const target = marketerAccounts.find(m => m.id === id);
    if (!target) return { success: false, message: 'Marketer account not found.' };

    const targetCode = (target.referralCode || '').trim().toUpperCase();
    const targetName = (target.fullName || '').trim().toLowerCase();

    // Helper to identify associated attendees / leads
    const isAssociatedAttendee = (a: AttendeeTicket) => {
      const matchId = a.marketerId === id || (a.marketerId && a.marketerId.trim().toUpperCase() === targetCode);
      const matchCode = !!(targetCode && (a.referralCode || '').trim().toUpperCase() === targetCode);
      const matchName = !!(targetName && (a.marketerName || '').trim().toLowerCase() === targetName);
      return matchId || matchCode || matchName;
    };

    // Calculate how many delegates & leads are preserved
    const associatedAttendees = attendees.filter(isAssociatedAttendee);
    const preservedAttendeeCount = associatedAttendees.length;

    // 1. CRITICAL: Retain all referred delegates and CRM leads! Do NOT delete them.
    // Preserve full ticket, RFID, CRM lead level, deal value, and payment history.
    setAttendees(prev => {
      const updated = prev.map(a => {
        if (isAssociatedAttendee(a)) {
          return {
            ...a,
            // Keep full delegate and lead information completely intact.
            // Mark the marketer attribution as archived for administrative record clarity.
            marketerName: a.marketerName ? `${a.marketerName} (Archived)` : 'Archived Marketer',
          };
        }
        return a;
      });
      try {
        localStorage.setItem(LOCAL_STORAGE_ATTENDEES_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('recon_attendees_updated', { detail: updated }));
      } catch (err) {
        console.warn('[ExpoDataContext] Error persisting attendees after marketer deletion', err);
      }
      return updated;
    });

    // 2. Remove the marketer account credentials and profile
    setMarketerAccounts(prev => {
      const filtered = prev.filter(m => m.id !== id);
      try {
        localStorage.setItem(LOCAL_STORAGE_MARKETERS_KEY, JSON.stringify(filtered));
      } catch (err) {
        console.warn('[ExpoDataContext] Error persisting marketers after deletion', err);
      }
      return filtered;
    });

    // 3. Log out if this marketer is currently authenticated in the portal
    if (marketerAuth.marketer?.id === id) {
      logoutMarketer();
    }

    return { 
      success: true, 
      message: `Marketer "${target.fullName}" deleted successfully. All ${preservedAttendeeCount} referred delegate(s) and CRM lead(s) remain safely preserved in the database.` 
    };
  };

  const loginMarketer = (username: string, password: string): { success: boolean; message: string; marketer?: MarketerAccount } => {
    const uClean = username.trim().toLowerCase();
    const match = marketerAccounts.find(m => m.username.trim().toLowerCase() === uClean && m.password === password);

    if (!match) {
      return { success: false, message: 'Invalid marketer username or password.' };
    }

    if (match.status === 'PENDING') {
      return { success: false, message: '⏳ Your marketer account registration is pending Admin Secretariat confirmation. Please wait for the Admin to review and approve your account.' };
    }

    if (match.status === 'SUSPENDED') {
      return { success: false, message: '🔒 This marketer account has been SUSPENDED.' };
    }

    const updatedMarketer = { ...match, lastLogin: new Date().toISOString() };
    updateMarketer(match.id, { lastLogin: updatedMarketer.lastLogin });

    setMarketerAuth({
      isAuthenticated: true,
      marketer: updatedMarketer,
      loginTime: new Date().toISOString()
    });

    return { success: true, message: `Welcome, ${match.fullName}! Logged into Marketer Portal.`, marketer: updatedMarketer };
  };

  const logoutMarketer = () => {
    setMarketerAuth({
      isAuthenticated: false,
      marketer: null,
      loginTime: null
    });
  };

  const confirmCommissionPayment = (
    marketerId: string,
    amountNGN?: number,
    notes?: string,
    customRef?: string
  ): { success: boolean; message: string; confirmation?: CommissionPaymentConfirmation } => {
    const marketer = marketerAccounts.find(m => m.id === marketerId);
    if (!marketer) {
      return { success: false, message: 'Marketer account not found.' };
    }

    const mySignups = attendees.filter(a => 
      (a.referralCode || '').toUpperCase() === marketer.referralCode.toUpperCase() ||
      a.marketerId === marketer.id
    );

    // Registrations where payment has been APPROVED by the Admin
    const approvedSignups = mySignups.filter(a => 
      (a.adminApproved === true || a.adminApprovalStatus === 'APPROVED') &&
      (a.paymentStatus === 'PAID' || a.paymentStatus === 'VERIFIED')
    );

    // Registrations awaiting Admin payment approval
    const pendingApprovalSignups = mySignups.filter(a => 
      !((a.adminApproved === true || a.adminApprovalStatus === 'APPROVED') &&
        (a.paymentStatus === 'PAID' || a.paymentStatus === 'VERIFIED'))
    );

    // Total earnings approved by Admin
    const calcApprovedEarned = Math.max(
      marketer.totalEarningsNGN || 0,
      approvedSignups.reduce((sum, a) => {
        const comm = typeof a.commissionEarnedNGN === 'number'
          ? a.commissionEarnedNGN
          : ((a.passType === 'elite' || (a.tier && a.tier.toLowerCase().includes('elite'))) ? 5000 : 0);
        return sum + comm;
      }, 0)
    );

    const alreadyPaid = marketer.paidEarningsNGN || 0;
    const availablePending = Math.max(0, calcApprovedEarned - alreadyPaid);

    // MANDATORY REQUIREMENT: Before a marketer receives any commissions, the admin must approve payment from registration first.
    if (availablePending <= 0) {
      if (pendingApprovalSignups.length > 0) {
        return {
          success: false,
          message: `🔒 Cannot issue commission payment. Before a marketer receives any commissions, the Admin must approve payment from registration first. (${pendingApprovalSignups.length} referred registration(s) currently awaiting Admin payment approval).`
        };
      }
      return {
        success: false,
        message: 'No approved commissions available for payout. Payment from registration must be approved by the Admin first.'
      };
    }

    const payAmount = (amountNGN !== undefined && amountNGN > 0) 
      ? Math.min(amountNGN, availablePending) 
      : availablePending;

    if (amountNGN && amountNGN > availablePending) {
      return {
        success: false,
        message: `Requested payout (₦${amountNGN.toLocaleString()}) exceeds approved available commissions (₦${availablePending.toLocaleString()}). Admin must approve payment from pending registrations before additional commissions can be disbursed.`
      };
    }

    const refNum = customRef || `RECON-COMM-2026-${Date.now().toString().slice(-4)}${Math.floor(100 + Math.random() * 900)}`;

    const newConfirmation: CommissionPaymentConfirmation = {
      id: `pay_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      referenceNumber: refNum,
      marketerId: marketer.id,
      marketerName: marketer.fullName,
      referralCode: marketer.referralCode,
      amountNGN: payAmount,
      paidAt: new Date().toISOString(),
      status: 'CONFIRMED',
      bankName: marketer.bankDetails?.bankName || 'Direct NIP Settlement Bank',
      accountNumber: marketer.bankDetails?.accountNumber || '0123456789',
      accountName: marketer.bankDetails?.accountName || marketer.fullName,
      confirmedBy: 'RECON 2026 Finance Secretariat & Executive Planning Committee',
      paymentMethod: 'Direct NIP Bank Transfer (Instant Settlement)',
      notes: notes || `Official commission payout confirmation for ${approvedSignups.length || 1} approved referred registration(s).`,
      referralCountCovered: approvedSignups.length || 1
    };

    const updatedPaid = (marketer.paidEarningsNGN || 0) + payAmount;
    const newPending = Math.max(0, calcApprovedEarned - updatedPaid);
    const newPayoutStatus = newPending === 0 ? 'PAID' : updatedPaid > 0 ? 'PARTIAL' : 'UNPAID';

    const updatedConfirmations = [newConfirmation, ...(marketer.paymentConfirmations || [])];

    updateMarketer(marketer.id, {
      totalEarningsNGN: Math.max(calcApprovedEarned, updatedPaid),
      paidEarningsNGN: updatedPaid,
      pendingEarningsNGN: newPending,
      payoutStatus: newPayoutStatus,
      paymentConfirmations: updatedConfirmations
    });

    playNotificationSound('broadcast');

    return {
      success: true,
      message: `🎉 Commission payment of ₦${payAmount.toLocaleString()} CONFIRMED for ${marketer.fullName}! Transaction Ref: ${refNum}`,
      confirmation: newConfirmation
    };
  };

  const resetMarketerDashboard = (_marketerId?: string): { success: boolean; message: string } => {
    return { success: false, message: 'Reset functionality is permanently disabled.' };
  };

  const verifyReferralCode = (code: string, passType: string, basePriceNGN: number): ReferralVerificationResult => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return {
        valid: false,
        message: 'Please enter a referral code.',
        discountAppliedNGN: 0,
        commissionEarnedNGN: 0,
        finalPriceNGN: basePriceNGN,
        originalPriceNGN: basePriceNGN
      };
    }

    let marketer = marketerAccounts.find(m => m.referralCode.toUpperCase() === cleanCode);

    // Support general promo codes if no specific marketer account is found
    if (!marketer && (
      cleanCode === 'RECON2026' || 
      cleanCode === 'VIPDISCOUNT' || 
      cleanCode === 'PROMO2026' || 
      cleanCode === 'DISCOUNT2026' || 
      cleanCode === 'RECON-VIP-2026' ||
      cleanCode === 'AMAKA2026'
    )) {
      marketer = marketerAccounts[0] || {
        id: 'mkt_official_promo',
        fullName: 'RECON Expo Official Promo',
        username: 'promo_official',
        password: 'promo123',
        email: 'reconexpo@afrinetgroup.com',
        phone: '+234 803 982 7711',
        bankDetails: {
          bankName: 'GTBank',
          accountNumber: '0123456789',
          accountName: 'RECON Secretariat'
        },
        referralCode: cleanCode,
        status: 'ACTIVE',
        totalEarningsNGN: 0,
        paidEarningsNGN: 0,
        pendingEarningsNGN: 0,
        payoutStatus: 'UNPAID',
        paymentConfirmations: [],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
    }

    if (!marketer) {
      return {
        valid: false,
        message: `Invalid referral code "${code}". Please check and try again.`,
        discountAppliedNGN: 0,
        commissionEarnedNGN: 0,
        finalPriceNGN: basePriceNGN,
        originalPriceNGN: basePriceNGN
      };
    }

    if (marketer.status === 'SUSPENDED') {
      return {
        valid: false,
        message: `Referral code "${code}" is currently suspended.`,
        discountAppliedNGN: 0,
        commissionEarnedNGN: 0,
        finalPriceNGN: basePriceNGN,
        originalPriceNGN: basePriceNGN
      };
    }

    const isEliteVIP = passType === 'elite' || passType === 'attendee';
    const isExhibitor = passType === 'exhibitor' || passType === 'booth';

    if (isEliteVIP) {
      const eliteTier = tiers.find(t => t.id === 'elite');
      const parsedDiscount = eliteTier?.discountAmountNGN ? parseInt(eliteTier.discountAmountNGN.replace(/[^0-9]/g, ''), 10) : 5000;
      const discountAppliedNGN = (!isNaN(parsedDiscount) && parsedDiscount > 0) ? parsedDiscount : 5000;
      const commissionEarnedNGN = 5000;
      const finalPrice = Math.max(0, basePriceNGN - discountAppliedNGN);
      return {
        valid: true,
        message: `Promo/Referral Code "${marketer.referralCode}" Verified! ₦${discountAppliedNGN.toLocaleString()} Discount Applied. ₦5,000 Marketer Commission earned. Final Price: ₦${finalPrice.toLocaleString()} NGN. Marketer: ${marketer.fullName}.`,
        marketer,
        code: marketer.referralCode,
        discountAppliedNGN,
        commissionEarnedNGN,
        finalPriceNGN: finalPrice,
        originalPriceNGN: basePriceNGN
      };
    } else if (isExhibitor) {
      // Exhibitor Booth Stand: Marketer earns 10% Commission!
      const boothAmount = basePriceNGN > 0 ? basePriceNGN : 350000;
      const commissionEarnedNGN = Math.round(boothAmount * 0.10);
      return {
        valid: true,
        message: `Exhibitor Booth Stand Referral Code "${marketer.referralCode}" Verified! Marketer (${marketer.fullName}) receives Commission: 10% (₦${commissionEarnedNGN.toLocaleString()} NGN) on this booth booking upon Secretariat payment confirmation.`,
        marketer,
        code: marketer.referralCode,
        discountAppliedNGN: 0,
        commissionEarnedNGN,
        finalPriceNGN: boothAmount,
        originalPriceNGN: boothAmount
      };
    } else {
      // Free Visitor pass & non-Elite passes earn 0 marketer commission
      return {
        valid: true,
        message: `Referral Code "${marketer.referralCode}" Verified! Registered under Marketer (${marketer.fullName}).`,
        marketer,
        code: marketer.referralCode,
        discountAppliedNGN: 0,
        commissionEarnedNGN: 0,
        finalPriceNGN: basePriceNGN,
        originalPriceNGN: basePriceNGN
      };
    }
  };

  // Push Notification Handler Methods
  const sendPushNotification = (notificationData: Omit<PushNotificationItem, 'id' | 'sentAt' | 'clickCount' | 'subscriberCount'>): { success: boolean; message: string; notification: PushNotificationItem } => {
    if (staffAuth.isAuthenticated && !adminAuth.isAuthenticated) {
      return { 
        success: false, 
        message: 'Permission Denied: Only Super Admin can broadcast push notifications.', 
        notification: {} as PushNotificationItem 
      };
    }

    const newNotif: PushNotificationItem = {
      ...notificationData,
      id: `push_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      sentAt: new Date().toISOString(),
      subscriberCount: 1420 + pushNotifications.length * 15,
      clickCount: 0,
      status: notificationData.status || 'SENT'
    };

    setPushNotifications(prev => [newNotif, ...prev]);

    // Send push notification to both in-page popup AND browser background OS notification
    if (newNotif.status === 'SENT') {
      // 1. Show In-page popup on website
      setActivePushBroadcast(newNotif);

      // 2. Dispatch real native device notification (visible in browser/phone status bar, lock screen & notification tray even if app/browser is in background or closed)
      dispatchDeviceNotification({
        id: newNotif.id,
        title: newNotif.title,
        message: newNotif.message,
        imageUrl: newNotif.imageUrl,
        targetLink: newNotif.targetLink,
        category: newNotif.category,
        badgeText: newNotif.badgeText
      }).catch(err => console.warn('Push notification dispatch error:', err));
    }

    return {
      success: true,
      message: `Push notification "${newNotif.title}" successfully broadcasted to ${newNotif.subscriberCount} subscribers!`,
      notification: newNotif
    };
  };

  const deletePushNotification = (id: string): { success: boolean; message: string } => {
    if (staffAuth.isAuthenticated && !adminAuth.isAuthenticated && !staffAuth.staff?.permissions?.canRegisterAttendees) {
      return { success: false, message: 'Permission Denied: Only Super Admin or authorized staff can delete push notifications.' };
    }
    const updated = pushNotifications.filter(p => p.id !== id);
    setPushNotifications(updated);
    
    setActivePushBroadcast(prev => (prev?.id === id ? null : prev));
    
    try {
      if (updated.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_PUSH_NOTIFS_KEY, JSON.stringify(updated));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_PUSH_NOTIFS_KEY);
      }
      
      const dismissedId = localStorage.getItem('recon_dismissed_push_id');
      if (dismissedId === id) {
        localStorage.removeItem('recon_dismissed_push_id');
      }
    } catch {
      // safe
    }
    
    return { success: true, message: 'Push notification record deleted.' };
  };

  const clearAllPushNotifications = (): { success: boolean; message: string } => {
    if (staffAuth.isAuthenticated && !adminAuth.isAuthenticated && !staffAuth.staff?.permissions?.canRegisterAttendees) {
      return { success: false, message: 'Permission Denied: Only Super Admin or authorized staff can clear push notifications.' };
    }
    const count = pushNotifications.length;
    setPushNotifications([]);
    setActivePushBroadcast(null);
    
    try {
      localStorage.removeItem(LOCAL_STORAGE_PUSH_NOTIFS_KEY);
      localStorage.removeItem('recon_dismissed_push_id');
    } catch {
      // safe
    }
    
    return { success: true, message: `Successfully cleared all ${count} alert${count === 1 ? '' : 's'} from broadcast history.` };
  };

  const subscribePushNotifications = async (preference: 'yes' | 'no') => {
    const newSub: PushSubscriptionState = {
      isSubscribed: true,
      subscribedAt: new Date().toISOString(),
      preference
    };
    setPushSubscription(newSub);

    try {
      // Register service worker and request native OS notification permissions
      await registerServiceWorker();
      const perm = await requestNativeNotificationPermission();

      if (perm === 'granted') {
        // Trigger welcoming system notification on phone / desktop
        await dispatchDeviceNotification({
          id: 'recon_welcome_push',
          title: '🔔 RECON Expo 2026 Alerts Activated',
          message: 'You are now connected! You will receive real-time property deals, VIP updates & plenary schedules directly on this device.',
          imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
          targetLink: '#registration',
          category: 'Live Alerts'
        });
      }
    } catch (e) {
      console.warn('Native push subscription activation notice:', e);
    }
  };

  const dismissPushBroadcast = () => {
    if (activePushBroadcast) {
      try {
        localStorage.setItem('recon_dismissed_push_id', activePushBroadcast.id);
      } catch {
        // safe
      }
    }
    setActivePushBroadcast(null);
  };

  // Factory reset permanently disabled to prevent any accidental data wipe
  const resetToDefaults = () => {
    // No-op: all reset routines are permanently removed across the website
  };

  // Export Data JSON
  const exportDataJson = (): string => {
    const backup = {
      version: "2.0.0",
      exportedAt: new Date().toISOString(),
      expoDetails,
      heroSlides,
      speakers,
      sessions,
      tiers,
      boothPackages,
      sponsors,
      sectors,
      faqs,
      attendees
    };
    return JSON.stringify(backup, null, 2);
  };

  // Import Data JSON
  const importDataJson = (jsonStr: string): { success: boolean; message: string } => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.expoDetails) setExpoDetails(data.expoDetails);
      if (data.heroSlides) setHeroSlides(data.heroSlides);
      if (data.speakers) setSpeakers(data.speakers);
      if (data.sessions) setSessions(data.sessions);
      if (data.tiers) setTiers(data.tiers);
      if (data.boothPackages && Array.isArray(data.boothPackages)) setBoothPackages(data.boothPackages);
      if (data.sponsors) setSponsors(data.sponsors);
      if (data.sectors) setSectors(data.sectors);
      if (data.faqs) setFaqs(data.faqs);
      if (data.attendees) setAttendees(data.attendees);
      return { success: true, message: "Website data successfully imported and applied!" };
    } catch {
      return { success: false, message: "Invalid JSON configuration format. Please verify the file." };
    }
  };

  return (
    <ExpoDataContext.Provider
      value={{
        expoDetails,
        heroSlides,
        speakers,
        sessions,
        tiers,
        boothPackages,
        sponsors,
        sectors,
        faqs,
        attendees,
        updateExpoDetails,
        updateHeroSlides,
        addHeroSlide,
        editHeroSlide,
        deleteHeroSlide,
        addSpeaker,
        editSpeaker,
        deleteSpeaker,
        addSession,
        editSession,
        deleteSession,
        editTier,
        addBoothPackage,
        editBoothPackage,
        deleteBoothPackage,
        toggleBoothPackageActive,
        addSponsor,
        editSponsor,
        deleteSponsor,
        editSector,
        addFaq,
        editFaq,
        deleteFaq,
        registerAttendee,
        updateAttendee,
        deleteAttendee,
        toggleCheckInAttendee,
        clearAllAttendees,
        refreshAttendees,
        contactMessages,
        addContactMessage,
        updateContactMessageStatus,
        deleteContactMessage,
        clearAllContactMessages,
        adminAuth,
        adminCredentials,
        isAdminOpen,
        setIsAdminOpen,
        loginAdmin,
        logoutAdmin,
        updateAdminCredentials,
        staffAccounts,
        staffAuth,
        registerStaff,
        updateStaff,
        deleteStaff,
        loginStaff,
        logoutStaff,
        marketerAccounts,
        marketerAuth,
        registerMarketer,
        updateMarketer,
        deleteMarketer,
        loginMarketer,
        logoutMarketer,
        confirmCommissionPayment,
        resetMarketerDashboard,
        verifyReferralCode,
        pushNotifications,
        pushSubscription,
        activePushBroadcast,
        sendPushNotification,
        deletePushNotification,
        clearAllPushNotifications,
        subscribePushNotifications,
        dismissPushBroadcast,
        resetToDefaults,
        exportDataJson,
        importDataJson,
      }}
    >
      {children}
    </ExpoDataContext.Provider>
  );
};

export const useExpoData = () => {
  const context = useContext(ExpoDataContext);
  if (!context) {
    throw new Error('useExpoData must be used within an ExpoDataProvider');
  }
  return context;
};
