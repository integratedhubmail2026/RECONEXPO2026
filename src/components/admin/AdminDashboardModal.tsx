import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useExpoData } from '../../context/ExpoDataContext';
import { ImageUploadInput } from './ImageUploadInput';
import { ImageCropModal } from './ImageCropModal';
import { PdfUploadInput } from './PdfUploadInput';
import { generateProgrammePdf, generateProgrammePdfDataUri } from '../../utils/generateProgrammePdf';
import { GateScannerModal } from './GateScannerModal';
import { SmartIdCard } from '../SmartIdCard';
import { CompanyStaffBadgeManager } from '../CompanyStaffBadgeManager';
import { PhotoCaptureStudio } from '../PhotoCaptureStudio';
import { ReconLogo } from '../ReconLogo';
import { StaffManagerTab } from './StaffManagerTab';
import { MarketerManagerTab } from './MarketerManagerTab';
import { PushNotificationManagerTab } from './PushNotificationManagerTab';
import { SiteTextEditorTab } from './SiteTextEditorTab';
import { SystemUpdateTab } from './SystemUpdateTab';
import { SmtpSettingsTab } from './SmtpSettingsTab';
import { EmailMarketingSuiteTab } from './EmailMarketingSuiteTab';
import { PixelTrackingTab } from './PixelTrackingTab';
import { SeoSettingsTab } from './SeoSettingsTab';
import { sendAttendeeConfirmationEmail, sendPaymentReceiptEmail } from '../../services/emailService';
import { QrPassViewerModal } from './QrPassViewerModal';
import { 
  Speaker, 
  Session, 
  RegistrationTier, 
  BoothPackage,
  Sponsor, 
  SectorItem, 
  FaqItem, 
  HeroBackgroundSlide,
  AttendeeTicket 
} from '../../types';
import { DEFAULT_BOOTH_PACKAGES } from '../../data/expoData';
import { 
  Lock, 
  Unlock, 
  X, 
  Eye, 
  EyeOff, 
  LayoutDashboard, 
  Building2, 
  Sparkles, 
  Mic2, 
  CalendarDays, 
  Calendar,
  Ticket, 
  Tag,
  Award, 
  HelpCircle, 
  Users, 
  Settings, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  RotateCcw, 
  RotateCw,
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Activity, 
  MapPin, 
  Search, 
  ExternalLink,
  ShieldCheck,
  FileSpreadsheet,
  Globe,
  Layers,
  ArrowRight,
  TrendingUp,
  Image as ImageIcon,
  Zap,
  CreditCard,
  RefreshCw,
  Copy,
  Check,
  Crop,
  Key,
  DollarSign,
  Receipt,
  Send,
  FileText,
  Filter,
  Shield,
  Store,
  Handshake,
  Camera,
  QrCode,
  UserCheck,
  UserX,
  Target,
  Inbox,
  Mail,
  MessageSquare,
  Phone,
  Bell,
  BellRing,
  CheckCheck,
  UserPlus,
  ChevronRight,
  Maximize2,
  Type,
  Crown,
  CheckSquare,
  Square,
  Minimize2,
  LayoutGrid,
  List
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

// Notification Center Item Interface
interface AdminNotificationItem {
  id: string;
  type: 'registration' | 'message' | 'payment';
  title: string;
  subtitle: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  badgeText: string;
  badgeColorClass: string;
  rawMessageObj?: any;
  rawAttendeeObj?: AttendeeTicket;
}

// Relative time formatting helper
const formatNotificationTime = (isoString?: string) => {
  if (!isoString) return 'Recently';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Recently';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  } catch {
    return 'Recently';
  }
};


export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen: propsIsOpen,
  onClose: propsOnClose
}) => {
  const {
    expoDetails,
    heroSlides,
    speakers,
    sessions,
    tiers,
    boothPackages = [],
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
    deleteAttendee,
    toggleCheckInAttendee,
    clearAllAttendees,
    contactMessages = [],
    updateContactMessageStatus,
    deleteContactMessage,
    clearAllContactMessages,
    adminAuth,
    adminCredentials,
    isAdminOpen: contextIsOpen,
    setIsAdminOpen,
    loginAdmin,
    logoutAdmin,
    updateAdminCredentials,
    staffAccounts = [],
    staffAuth,
    registerStaff,
    updateStaff,
    deleteStaff,
    loginStaff,
    logoutStaff,
    marketerAccounts = [],
    marketerAuth,
    registerMarketer,
    updateMarketer,
    deleteMarketer,
    loginMarketer,
    logoutMarketer,
    confirmCommissionPayment,
    verifyReferralCode,
    resetToDefaults,
    exportDataJson,
    importDataJson,
    registerAttendee,
    updateAttendee
  } = useExpoData();

  // Combine props and context open state for seamless reliability
  const isModalOpen = propsIsOpen !== undefined ? propsIsOpen : contextIsOpen;
  const handleClose = () => {
    if (propsOnClose) {
      propsOnClose();
    }
    setIsAdminOpen(false);
  };

  // Login Mode State ('admin' | 'staff')
  const [loginMode, setLoginMode] = useState<'admin' | 'staff'>('admin');

  // Admin Login form state
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Staff Login form state
  const [staffLoginUser, setStaffLoginUser] = useState('');
  const [staffLoginPass, setStaffLoginPass] = useState('');
  const [showStaffPassword, setShowStaffPassword] = useState(false);
  const [staffLoginError, setStaffLoginError] = useState('');

  const handleGlobalLogout = () => {
    let msg = "";
    if (staffAuth?.isAuthenticated) {
      logoutStaff();
      msg = "Logged out of Staff Workspace.";
    }
    if (adminAuth?.isAuthenticated) {
      logoutAdmin();
      msg = "Logged out of Admin Console.";
    }
    showToast(msg || "Logged out.");
  };
  const [activeTab, setActiveTab] = useState<
    'overview' | 'registration' | 'inbox' | 'general' | 'id_card' | 'hero' | 'speakers' | 'programme' | 'tiers' | 'booth_packages' | 'sponsors' | 'sectors' | 'faqs' | 'attendees' | 'special_badges' | 'staff' | 'marketer' | 'push_notif' | 'settings' | 'site_texts' | 'system_update' | 'email_marketing' | 'smtp' | 'pixel_tracking' | 'seo_engine'
  >('overview');

  // Staff Session & Department Permission Filtering
  const isStaffSession = staffAuth?.isAuthenticated && !adminAuth?.isAuthenticated;
  const isMainAdmin = adminAuth?.isAuthenticated;
  const canDelete = isMainAdmin || isStaffSession;
  const staffPerms = staffAuth?.staff?.permissions;

  const canSeeTab = (tab: string): boolean => {
    if (!isStaffSession) return true; // Super Admin has unrestricted access to all tabs
    if (!staffPerms) return false;

    switch (tab) {
      case 'overview':
        return true;
      case 'registration':
        return !!staffPerms.canRegisterAttendees;
      case 'inbox':
        return !!staffPerms.canManageInbox;
      case 'speakers':
        return !!staffPerms.canManageSpeakers;
      case 'programme':
        return !!staffPerms.canManageSchedule;
      case 'sponsors':
      case 'tiers':
      case 'booth_packages':
      case 'sectors':
        return !!staffPerms.canManageSponsors;
      case 'attendees':
        return !!staffPerms.canRegisterAttendees || !!staffPerms.canCheckIn || !!staffPerms.canViewPayments;
      case 'id_card':
        return !!staffPerms.canCheckIn || !!staffPerms.canRegisterAttendees;
      case 'special_badges':
        return !!staffPerms.canRegisterAttendees || !!staffPerms.canCheckIn;
      case 'marketer':
        return !!staffPerms.canRegisterAttendees || !!staffPerms.canViewPayments;
      case 'email_marketing':
      case 'smtp':
      case 'pixel_tracking':
      case 'push_notif':
      case 'site_texts':
      case 'system_update':
        return !isStaffSession; // Restricted to Super Admin
      default:
        return false; // All other configuration tabs (general, hero, faqs, staff, settings) are Super Admin restricted
    }
  };

  useEffect(() => {
    if (isStaffSession && !canSeeTab(activeTab)) {
      setActiveTab('overview');
    }
  }, [isStaffSession, activeTab, staffAuth?.staff]);

  // On-Site Registration Form State
  const [regPassType, setRegPassType] = useState<'visitor' | 'elite' | 'exhibitor' | 'sponsor' | 'partner' | 'press' | 'official'>('visitor');
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regOrganization, setRegOrganization] = useState('');
  const [regRole, setRegRole] = useState('');
  const [regCity, setRegCity] = useState('Abuja (FCT)');
  const [regPaymentStatus, setRegPaymentStatus] = useState<'PAID' | 'FREE' | 'VERIFIED' | 'PENDING'>('FREE');
  const [regAmountPaid, setRegAmountPaid] = useState('FREE');
  const [regAccessDays, setRegAccessDays] = useState('All Days (Oct 15 - 17, 2026)');
  const [regNotes, setRegNotes] = useState('');
  const [lastRegisteredTicket, setLastRegisteredTicket] = useState<AttendeeTicket | null>(null);

  const handleRegisterOnSiteAttendee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regEmail.trim()) {
      showToast("Please enter delegate full name and email address.");
      return;
    }

    const ticketPrefix = regPassType === 'visitor' ? 'VIS' :
                         regPassType === 'elite' ? 'VIP' :
                         regPassType === 'exhibitor' ? 'EXH' :
                         regPassType === 'sponsor' ? 'SPO' :
                         regPassType === 'partner' ? 'PTN' :
                         regPassType === 'press' ? 'PRS' : 'SEC';

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const ticketNum = `RECON-2026-${ticketPrefix}-${randomNum}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${ticketNum}`;

    const assignedOff = staffAuth?.staff ? `${staffAuth.staff.fullName} (${staffAuth.staff.department})` : (adminAuth?.user || 'Organizing Secretariat');

    let tierLabel = 'Visitor Delegate Pass';
    if (regPassType === 'elite') tierLabel = 'VIP Executive Delegate';
    else if (regPassType === 'exhibitor') tierLabel = 'Exhibitor Booth Stand';
    else if (regPassType === 'sponsor') tierLabel = 'Corporate Sponsor Delegate';
    else if (regPassType === 'partner') tierLabel = 'Strategic Partner Delegate';
    else if (regPassType === 'press') tierLabel = 'Press & Media Accreditation';
    else if (regPassType === 'official') tierLabel = 'Official Secretariat Staff';

    const newTicket: AttendeeTicket = {
      ticketNumber: ticketNum,
      tier: tierLabel,
      passType: regPassType,
      fullName: regFullName.trim(),
      email: regEmail.trim().toLowerCase(),
      organization: regOrganization.trim() || 'Individual Delegate',
      role: regRole.trim() || 'Delegate',
      phone: regPhone.trim() || '+234',
      city: regCity.trim(),
      registeredAt: new Date().toISOString(),
      accessDays: regAccessDays,
      qrCodeUrl: qrUrl,
      barcode: ticketNum.replace(/[^A-Z0-9]/g, ''),
      amountPaid: regAmountPaid,
      paymentStatus: regPaymentStatus,
      adminApproved: true,
      adminApprovalStatus: 'APPROVED',
      leadLevel: 1,
      leadScore: 85,
      leadSource: 'On-Site Secretariat Registration Desk',
      assignedOfficer: assignedOff,
      leadNotes: regNotes.trim() || 'Registered on-site at RECON Expo 2026 Secretariat station.'
    };

    registerAttendee(newTicket);
    setLastRegisteredTicket(newTicket);
    showToast(`Registered ${regFullName.trim()}! Ticket: ${ticketNum}`);

    // Reset form fields
    setRegFullName('');
    setRegEmail('');
    setRegPhone('');
    setRegOrganization('');
    setRegRole('');
    setRegNotes('');
  };

  // Staff Account & Permissions Management State (In Admin Console)
  const [staffSearch, setStaffSearch] = useState('');
  const [staffStatusFilter, setStaffStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED'>('ALL');
  const [isRegisterStaffModalOpen, setIsRegisterStaffModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);

  // Staff Registration Form State
  const [staffFormName, setStaffFormName] = useState('');
  const [staffFormUsername, setStaffFormUsername] = useState('');
  const [staffFormPassword, setStaffFormPassword] = useState('');
  const [staffFormEmail, setStaffFormEmail] = useState('');
  const [staffFormRole, setStaffFormRole] = useState('Secretariat Registrar');
  const [staffFormDepartment, setStaffFormDepartment] = useState('Secretariat');
  const [staffFormNotes, setStaffFormNotes] = useState('');
  const [staffFormPermissions, setStaffFormPermissions] = useState({
    canRegisterAttendees: true,
    canCheckIn: true,
    canManageInbox: true,
    canManageSchedule: false,
    canManageSpeakers: false,
    canViewPayments: true,
    canManageSponsors: false,
    canExportData: true,
    canManageLeadMatrix: true,
  });


  // Secretariat Inbox Filter State
  const [inboxSearch, setInboxSearch] = useState('');
  const [inboxCategoryFilter, setInboxCategoryFilter] = useState('ALL');
  const [inboxStatusFilter, setInboxStatusFilter] = useState<'ALL' | 'unread' | 'read' | 'replied'>('ALL');
  const [replyingMessageId, setReplyingMessageId] = useState<string | null>(null);
  const [replyNotesInput, setReplyNotesInput] = useState('');

  // Special Personnel Badge Generator State
  const [specialPassCategory, setSpecialPassCategory] = useState<'press' | 'official' | 'security' | 'vip' | 'crew' | 'medical'>('press');
  const [specialFullName, setSpecialFullName] = useState('Engr. Fatima Bello');
  const [specialRole, setSpecialRole] = useState('Chief Photojournalist & Broadcast Crew');
  const [specialOrg, setSpecialOrg] = useState('NTA News Network / AIT');
  const [specialPhone, setSpecialPhone] = useState('+234 803 456 7890');
  const [specialEmail, setSpecialEmail] = useState('press@media.ng');
  const [specialAccessDays, setSpecialAccessDays] = useState('Full Expo + All-Zone Media Center Pass');
  const [specialPhotoUrl, setSpecialPhotoUrl] = useState('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80');
  const [specialPhotoStudioOpen, setSpecialPhotoStudioOpen] = useState(false);
  const [specialCategoryFilter, setSpecialCategoryFilter] = useState<string>('all');

  // ID Card Customizer Preview Pass Type State
  const [previewPassType, setPreviewPassType] = useState<'visitor' | 'exhibitor' | 'elite' | 'press' | 'sponsor'>('visitor');

  // Website Logo Preview Background Mode
  const [logoPreviewBg, setLogoPreviewBg] = useState<'dark' | 'light'>('dark');

  // Screen Width Maximizer State
  const [isMaximized, setIsMaximized] = useState<boolean>(true);

  // QR Code Pass Modal & View Mode State
  const [viewingQrPassTicket, setViewingQrPassTicket] = useState<AttendeeTicket | null>(null);
  const [attendeeDisplayMode, setAttendeeDisplayMode] = useState<'table' | 'qr_grid'>('table');

  // Exhibition Booth Stand Packages Sub-Tab & Creation State
  const [tiersSubTab, setTiersSubTab] = useState<'booth_packages' | 'registration_tiers'>('booth_packages');
  const [isAddingBoothPackage, setIsAddingBoothPackage] = useState(false);
  const [newBoothForm, setNewBoothForm] = useState({
    id: '',
    name: '',
    priceNGN: 350000,
    priceFormatted: '₦350,000',
    badges: 2,
    commissionRate: 0.10,
    desc: 'Includes shell scheme partitions, fascia nameboard, spotlights, 1 table, 2 chairs, 13A socket, 2 staff badges.',
    active: true
  });

  // Notification Bell Center State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationCategoryFilter, setNotificationCategoryFilter] = useState<'ALL' | 'REGISTRATIONS' | 'MESSAGES' | 'PAYMENTS'>('ALL');
  const [notificationSearchQuery, setNotificationSearchQuery] = useState('');
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('recon_admin_read_notification_ids');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Sync read notification IDs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('recon_admin_read_notification_ids', JSON.stringify(readNotificationIds));
    } catch {
      // ignore
    }
  }, [readNotificationIds]);

  // Cleared / Deleted alerts state
  const [clearedNotificationIds, setClearedNotificationIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('recon_admin_cleared_notification_ids');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Sync cleared notification IDs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('recon_admin_cleared_notification_ids', JSON.stringify(clearedNotificationIds));
    } catch {
      // ignore
    }
  }, [clearedNotificationIds]);

  // Aggregate all notifications from contactMessages and attendees in real time
  const allNotificationItems: AdminNotificationItem[] = useMemo(() => {
    const items: AdminNotificationItem[] = [];

    // 1. Process Messages
    (contactMessages || []).forEach((msg) => {
      const isRead = msg.status === 'read' || msg.status === 'replied' || readNotificationIds.includes(`msg-${msg.id}`);
      items.push({
        id: `msg-${msg.id}`,
        type: 'message',
        title: msg.fullName,
        subtitle: msg.inquiryType || 'Secretariat Contact Form',
        body: msg.message,
        timestamp: msg.submittedAt || new Date().toISOString(),
        isRead,
        badgeText: msg.status === 'replied' ? 'REPLIED' : msg.status === 'read' ? 'MESSAGE' : 'NEW MESSAGE',
        badgeColorClass: msg.status === 'unread' 
          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 font-bold animate-pulse' 
          : 'bg-slate-700/50 text-slate-300 border-slate-600/30',
        rawMessageObj: msg
      });
    });

    // 2. Process Registrations
    (attendees || []).forEach((att) => {
      const isRead = readNotificationIds.includes(`reg-${att.ticketNumber}`);
      items.push({
        id: `reg-${att.ticketNumber}`,
        type: 'registration',
        title: `New Registration: ${att.fullName}`,
        subtitle: `${att.tier} • ${att.organization || att.city || 'Individual'}`,
        body: `Ticket #${att.ticketNumber} (${att.amountPaid || 'Free Pass'}) - Clearance: ${att.adminApprovalStatus || 'APPROVED'}`,
        timestamp: att.registeredAt || new Date().toISOString(),
        isRead,
        badgeText: att.passType ? att.passType.toUpperCase() : 'NEW REGISTRATION',
        badgeColorClass: att.passType === 'elite' || att.passType === 'sponsor'
          ? 'bg-purple-500/20 text-purple-300 border-purple-500/30 font-bold'
          : att.passType === 'exhibitor'
          ? 'bg-blue-500/20 text-blue-300 border-blue-500/30 font-bold'
          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold',
        rawAttendeeObj: att
      });

      // 3. Process Payments
      const isPaymentApproved = (att.paymentStatus === 'PAID' || att.paymentStatus === 'VERIFIED') || (att.adminApproved === true || att.adminApprovalStatus === 'APPROVED');
      const isPaidTier = (att.amountPaid && att.amountPaid !== '₦0 (Free)' && att.amountPaid !== 'Free' && att.amountPaid !== '₦0');

      if (isPaymentApproved && isPaidTier) {
        const payRead = readNotificationIds.includes(`pay-${att.ticketNumber}`);
        items.push({
          id: `pay-${att.ticketNumber}`,
          type: 'payment',
          title: `Payment APPROVED: ${att.fullName}`,
          subtitle: `Amount: ${att.amountPaid} • Ref: ${att.paymentRef || att.ticketNumber}`,
          body: `Registered for ${att.tier}. Payment Status: APPROVED • Smart ID Unlocked`,
          timestamp: att.adminApprovedAt || att.registeredAt || new Date().toISOString(),
          isRead: payRead,
          badgeText: 'PAYMENT APPROVED',
          badgeColorClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold',
          rawAttendeeObj: att
        });
      } else if (!isPaymentApproved && isPaidTier && att.adminApprovalStatus !== 'DECLINED') {
        const payRead = readNotificationIds.includes(`pay-pending-${att.ticketNumber}`);
        items.push({
          id: `pay-pending-${att.ticketNumber}`,
          type: 'payment',
          title: `PENDING PAYMENT APPROVAL: ${att.fullName}`,
          subtitle: `Amount: ${att.amountPaid} • Ref: ${att.paymentRef || att.ticketNumber}`,
          body: `Registered for ${att.tier}. Payment Reference Recorded — Awaiting Manual Admin Approval`,
          timestamp: att.registeredAt || new Date().toISOString(),
          isRead: payRead,
          badgeText: 'ACTION REQUIRED (PENDING APPROVAL)',
          badgeColorClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold animate-pulse',
          rawAttendeeObj: att
        });
      }
    });

    // 4. Process Pending Marketer Registration Requests
    marketerAccounts.filter(m => m.status === 'PENDING').forEach(mkt => {
      const mktRead = readNotificationIds.includes(`mkt-pending-${mkt.id}`);
      items.push({
        id: `mkt-pending-${mkt.id}`,
        type: 'registration',
        title: `NEW MARKETER REGISTRATION: ${mkt.fullName}`,
        subtitle: `Username: @${mkt.username} • Code: ${mkt.referralCode} • Email: ${mkt.email}`,
        body: `Registered on Homepage. Account status: PENDING ADMIN CONFIRMATION. Go to Marketer Manager tab to confirm & activate.`,
        timestamp: mkt.createdAt || new Date().toISOString(),
        isRead: mktRead,
        badgeText: 'MARKETER PENDING CONFIRMATION',
        badgeColorClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold animate-pulse'
      });
    });

    // Sort descending by timestamp and filter out cleared/deleted alert items
    return items
      .filter(item => !clearedNotificationIds.includes(item.id))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [contactMessages, attendees, marketerAccounts, readNotificationIds, clearedNotificationIds]);

  // Filtered notifications based on active filter and search query
  const filteredNotificationItems = useMemo(() => {
    return allNotificationItems.filter(item => {
      // Category filter
      if (notificationCategoryFilter === 'REGISTRATIONS' && item.type !== 'registration') return false;
      if (notificationCategoryFilter === 'MESSAGES' && item.type !== 'message') return false;
      if (notificationCategoryFilter === 'PAYMENTS' && item.type !== 'payment') return false;

      // Search query
      if (notificationSearchQuery.trim()) {
        const q = notificationSearchQuery.toLowerCase().trim();
        return (
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.body.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allNotificationItems, notificationCategoryFilter, notificationSearchQuery]);

  // Dynamic counts for notification header & filter pills
  const unreadMessagesCount = useMemo(() => (contactMessages || []).filter(m => m.status === 'unread').length, [contactMessages]);
  const unreadRegistrationsCount = useMemo(() => (attendees || []).filter(a => !readNotificationIds.includes(`reg-${a.ticketNumber}`)).length, [attendees, readNotificationIds]);
  const unreadPaymentsCount = useMemo(() => (attendees || []).filter(a => ((a.paymentStatus === 'PAID' || a.paymentStatus === 'VERIFIED' || a.adminApproved === true || a.adminApprovalStatus === 'APPROVED') && (a.amountPaid && a.amountPaid !== '₦0 (Free)' && a.amountPaid !== 'Free' && a.amountPaid !== '₦0')) && !readNotificationIds.includes(`pay-${a.ticketNumber}`)).length, [attendees, readNotificationIds]);
  const totalUnreadCount = useMemo(() => allNotificationItems.filter(i => !i.isRead).length, [allNotificationItems]);

  // Handler to mark notification as read and navigate to tab
  const handleSelectNotification = (item: AdminNotificationItem) => {
    // Mark ID as read in local storage array
    if (!readNotificationIds.includes(item.id)) {
      setReadNotificationIds(prev => [...prev, item.id]);
    }

    if (item.type === 'message' && item.rawMessageObj) {
      updateContactMessageStatus(item.rawMessageObj.id, 'read');
      setActiveTab('inbox');
      setInboxSearch(item.rawMessageObj.fullName);
      showToast(`Viewing Secretariat message from ${item.rawMessageObj.fullName}`);
    } else if (item.type === 'registration' && item.rawAttendeeObj) {
      setActiveTab('attendees');
      setAttendeeSearch(item.rawAttendeeObj.ticketNumber);
      setViewingIdCardTicket(item.rawAttendeeObj);
      showToast(`Loaded ID Card for ${item.rawAttendeeObj.fullName}`);
    } else if (item.type === 'payment' && item.rawAttendeeObj) {
      setActiveTab('attendees');
      setAttendeeSearch(item.rawAttendeeObj.ticketNumber || item.rawAttendeeObj.fullName);
      showToast(`Viewing attendee payment details for ${item.rawAttendeeObj.fullName}`);
    }

    setIsNotificationsOpen(false);
  };

  // Handler to mark all notifications as read
  const handleMarkAllAsRead = () => {
    (contactMessages || []).forEach(m => {
      if (m.status === 'unread') {
        updateContactMessageStatus(m.id, 'read');
      }
    });

    const allIds = allNotificationItems.map(i => i.id);
    setReadNotificationIds(prev => Array.from(new Set([...prev, ...allIds])));
    showToast("All notifications marked as read.");
  };


  // Confirmation Dialog State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void | Promise<void>;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const handleApplySpecialPreset = (category: 'press' | 'official' | 'security' | 'vip' | 'crew' | 'medical') => {
    setSpecialPassCategory(category);
    if (category === 'press') {
      setSpecialFullName('Engr. Fatima Bello');
      setSpecialRole('Chief Photojournalist & Broadcast Crew');
      setSpecialOrg('NTA News Network / AIT');
      setSpecialPhone('+234 803 456 7890');
      setSpecialEmail('press@media.ng');
      setSpecialAccessDays('Full Expo + All-Zone Media Center Pass');
      setSpecialPhotoUrl('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80');
    } else if (category === 'official') {
      setSpecialFullName('Dr. Aliyu O. Mohammed');
      setSpecialRole('Secretariat Protocol Director & Expo Marshal');
      setSpecialOrg('RECON Expo 2026 Organizing Committee');
      setSpecialPhone('+234 802 112 3344');
      setSpecialEmail('aliyu.mohammed@afrinetgroup.com');
      setSpecialAccessDays('24/7 VIP Secretariat All-Access Clearance');
      setSpecialPhotoUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80');
    } else if (category === 'security') {
      setSpecialFullName('Captain Chukwudi Nnamdi');
      setSpecialRole('Chief Security Detail & Armed Escort Officer');
      setSpecialOrg('Federal Capital Territory Command / SSS');
      setSpecialPhone('+234 818 999 8877');
      setSpecialEmail('security.command@fct.gov.ng');
      setSpecialAccessDays('24/7 All-Gate Security & Emergency Clearance');
      setSpecialPhotoUrl('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80');
    } else if (category === 'vip') {
      setSpecialFullName('Senator (Dr.) Rabiu Kwankwaso');
      setSpecialRole('Keynote VIP Special Guest & Summit Speaker');
      setSpecialOrg('Federal Ministry of Housing & Urban Development');
      setSpecialPhone('+234 803 777 1122');
      setSpecialEmail('vip.office@housing.gov.ng');
      setSpecialAccessDays('Presidential Suite & VIP Lounge All-Access');
      setSpecialPhotoUrl('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80');
    } else if (category === 'crew') {
      setSpecialFullName('Sunday Okonkwo');
      setSpecialRole('Lead Stage Logistics & AV System Engineer');
      setSpecialOrg('StageCraft Global Sound & Lighting');
      setSpecialPhone('+234 805 443 2211');
      setSpecialEmail('sunday@stagecraft.ng');
      setSpecialAccessDays('Exhibition Floor & Backstage Tech Clearance');
      setSpecialPhotoUrl('https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80');
    } else if (category === 'medical') {
      setSpecialFullName('Dr. Sarah Adewale');
      setSpecialRole('Chief Medical Officer & First Responder');
      setSpecialOrg('National Emergency Management Agency (NEMA)');
      setSpecialPhone('+234 809 112 9900');
      setSpecialEmail('medical@nema.gov.ng');
      setSpecialAccessDays('24/7 First Aid Clinic & Emergency Clearance');
      setSpecialPhotoUrl('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80');
    }
  };

  const handleGenerateAndSaveSpecialBadge = () => {
    if (!specialFullName.trim()) {
      alert("Please enter the personnel's full name.");
      return;
    }
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newTicket: AttendeeTicket = {
      ticketNumber: `RECON-2026-${specialPassCategory.toUpperCase()}-${randomNum}`,
      tier: `${specialPassCategory.toUpperCase()} PASS`,
      passType: specialPassCategory,
      fullName: specialFullName.trim(),
      email: specialEmail.trim() || `official.${randomNum}@reconexpo.ng`,
      organization: specialOrg.trim() || 'RECON Secretariat',
      role: specialRole.trim() || `${specialPassCategory.toUpperCase()} Personnel`,
      phone: specialPhone.trim() || '+234 800 000 0000',
      city: 'Abuja (FCT)',
      photoUrl: specialPhotoUrl,
      registeredAt: new Date().toISOString(),
      accessDays: specialAccessDays,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=RECON-2026-${specialPassCategory.toUpperCase()}-${randomNum}`,
      barcode: `RECON26${specialPassCategory.toUpperCase()}${randomNum}`,
      amountPaid: 'COMPLIMENTARY / OFFICIAL',
      paymentStatus: 'VERIFIED',
      adminApproved: true,
      adminApprovalStatus: 'APPROVED'
    };

    registerAttendee(newTicket);
    showToast(`Issued Official ${specialPassCategory.toUpperCase()} Badge for ${specialFullName}! Saved to Secretariat Database.`);
  };

  const requestConfirmation = (title: string, message: string, onConfirm: () => void | Promise<void>) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: async () => {
        try {
          await onConfirm();
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  // Notification clear & delete handlers
  const handleDeleteNotification = (id: string, title?: string) => {
    setClearedNotificationIds(prev => Array.from(new Set([...prev, id])));
    showToast(`Alert cleared${title ? ` for "${title}"` : ''}.`);
  };

  const handleClearAllNotifications = () => {
    if (allNotificationItems.length === 0) return;
    requestConfirmation(
      "Clear All Alerts",
      `Are you sure you want to clear and delete all ${allNotificationItems.length} alerts from the Admin Notification Center? You can restore them anytime using "Restore Cleared".`,
      () => {
        const idsToClear = allNotificationItems.map(i => i.id);
        setClearedNotificationIds(prev => Array.from(new Set([...prev, ...idsToClear])));
        showToast("All alerts cleared from notification center.");
      }
    );
  };

  const handleRestoreClearedNotifications = () => {
    setClearedNotificationIds([]);
    showToast("All cleared alerts restored to notification center.");
  };

  // Feedback Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // State for editing items
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
  const [isAddingSpeaker, setIsAddingSpeaker] = useState(false);
  const [speakerSearch, setSpeakerSearch] = useState('');
  const [croppingSpeaker, setCroppingSpeaker] = useState<Speaker | null>(null);

  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [isAddingSession, setIsAddingSession] = useState(false);
  const [sessionDayFilter, setSessionDayFilter] = useState<number>(1);

  const [editingSlide, setEditingSlide] = useState<{ index: number; slide: HeroBackgroundSlide } | null>(null);
  const [isAddingSlide, setIsAddingSlide] = useState(false);

  const [editingSponsor, setEditingSponsor] = useState<{ index: number; sponsor: Sponsor } | null>(null);
  const [isAddingSponsor, setIsAddingSponsor] = useState(false);

  const [editingFaq, setEditingFaq] = useState<{ index: number; faq: FaqItem } | null>(null);
  const [isAddingFaq, setIsAddingFaq] = useState(false);

  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [attendeeTierFilter, setAttendeeTierFilter] = useState('all');
  const [attendeePaymentFilter, setAttendeePaymentFilter] = useState<'all' | 'paid' | 'free'>('all');
  const [selectedAttendeeTickets, setSelectedAttendeeTickets] = useState<string[]>([]);
  const [isGateScannerOpen, setIsGateScannerOpen] = useState(false);
  const [viewingIdCardTicket, setViewingIdCardTicket] = useState<AttendeeTicket | null>(null);
  const [isSnappingPhotoForAdmin, setIsSnappingPhotoForAdmin] = useState(false);

  // Live updated reference to the viewing delegate ticket
  const liveViewingTicket = viewingIdCardTicket
    ? (attendees.find(a => a.ticketNumber === viewingIdCardTicket.ticketNumber) || viewingIdCardTicket)
    : null;

  // Change Admin Credentials state
  const [newAdminUser, setNewAdminUser] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [confirmAdminPass, setConfirmAdminPass] = useState('');

  // Import JSON file input ref
  const [importJsonText, setImportJsonText] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  if (!isModalOpen) return null;

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = loginAdmin(loginUser, loginPass);
    if (res.success) {
      setLoginUser('');
      setLoginPass('');
      showToast("Welcome to RECON Expo Admin Console!");
    } else {
      setLoginError(res.message);
    }
  };

  // Helper to check if a registration is Paid vs Free
  const isPaidRegistration = (a: AttendeeTicket) => {
    const status = (a.paymentStatus || '').toUpperCase();
    if (status === 'PAID' || status === 'VERIFIED') return true;
    const num = parseInt((a.amountPaid || '0').replace(/[^0-9]/g, ''), 10) || 0;
    if (num > 0) return true;
    const pt = (a.passType || '').toLowerCase();
    const tr = (a.tier || '').toLowerCase();
    if (pt === 'elite' || pt === 'exhibitor' || pt === 'sponsor' || pt === 'partner' || tr.includes('paid') || tr.includes('elite')) {
      return true;
    }
    return false;
  };

  // Export CSV of attendees (supports filtered or selected subsets)
  const handleExportAttendeesCsv = (customList?: AttendeeTicket[], label = 'Delegates') => {
    const listToExport = customList || attendees;
    if (listToExport.length === 0) {
      alert("No attendee registrations available to export.");
      return;
    }
    const headers = [
      "Ticket Number", 
      "Full Name", 
      "Email", 
      "Phone", 
      "Organization", 
      "Role", 
      "Pass Type", 
      "Tier", 
      "Payment Type",
      "Amount Paid", 
      "Payment Status",
      "Gate Status",
      "Check-In Time",
      "Registered Date", 
      "Access Details",
      "Referral Code",
      "Marketer Name"
    ];
    const rows = listToExport.map(a => {
      const isPaid = isPaidRegistration(a);
      return [
        `"${a.ticketNumber}"`,
        `"${a.fullName.replace(/"/g, '""')}"`,
        `"${a.email.replace(/"/g, '""')}"`,
        `"${a.phone || ''}"`,
        `"${(a.organization || '').replace(/"/g, '""')}"`,
        `"${(a.role || '').replace(/"/g, '""')}"`,
        `"${a.passType}"`,
        `"${(a.tier || '').replace(/"/g, '""')}"`,
        `"${isPaid ? 'PAID' : 'FREE'}"`,
        `"${a.amountPaid || (isPaid ? 'Paid' : '₦0')}"`,
        `"${a.paymentStatus || (isPaid ? 'PAID' : 'FREE')}"`,
        `"${a.checkedIn ? 'CHECKED IN' : 'UNCHECKED'}"`,
        `"${a.checkedInAt ? new Date(a.checkedInAt).toLocaleString() : ''}"`,
        `"${new Date(a.registeredAt).toLocaleString()}"`,
        `"${(a.accessDays || '').replace(/"/g, '""')}"`,
        `"${a.referralCode || ''}"`,
        `"${(a.marketerName || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RECON_Expo_2026_${label.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`${listToExport.length} ${label} registrations exported to CSV!`);
  };

  // Export selected attendees as JSON
  const handleExportSelectedJson = (customList?: AttendeeTicket[], label = 'Registrations') => {
    const listToExport = customList || attendees;
    const jsonStr = JSON.stringify(listToExport, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RECON_Expo_2026_${label.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Exported ${listToExport.length} registrations to JSON!`);
  };

  // Download full site JSON backup
  const handleDownloadBackup = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RECON_Expo_Website_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Full website configuration JSON backup downloaded!");
  };

  // Add dummy test attendee
  const handleAddSampleAttendee = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const sampleTiers = ['visitor', 'elite', 'exhibitor', 'sponsor', 'partner'];
    const selectedTier = sampleTiers[Math.floor(Math.random() * sampleTiers.length)];
    
    registerAttendee({
      ticketNumber: `RECON-2026-${selectedTier.toUpperCase().slice(0,3)}-${randomNum}`,
      tier: selectedTier === 'elite' ? 'Elite Guest (Paid)' : selectedTier === 'visitor' ? 'Visitor (Free)' : selectedTier,
      passType: selectedTier,
      fullName: `Engr. Oladipo Adeleke ${randomNum}`,
      email: `adeleke.${randomNum}@abuja-properties.ng`,
      organization: `Adeleke Infrastructure Holdings`,
      role: `Chief Operating Officer`,
      phone: `+234 803 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}`,
      city: 'Abuja (FCT)',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      registeredAt: new Date().toISOString(),
      accessDays: selectedTier === 'elite' ? 'All 10 VIP Benefits + Gala' : selectedTier === 'visitor' ? 'Exhibition Pavilions Only' : 'Full Conference & Expo Access',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=RECON-2026-${randomNum}`,
      barcode: `RECON26${randomNum}`,
      amountPaid: selectedTier === 'elite' ? '₦25,000' : '₦0 (Free)',
      paymentRef: selectedTier === 'elite' ? `PAY-RECON-${randomNum}` : 'FREE-GATE',
      paymentStatus: selectedTier === 'elite' ? 'PAID' : 'FREE'
    });
    showToast("New test delegate registered successfully!");
  };

  return (
    <div 
      id="admin-dashboard-modal-backdrop"
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 bg-black/85 backdrop-blur-xl overflow-y-auto ${
        isMaximized ? 'p-1 sm:p-2 md:p-3' : 'p-2 sm:p-4 md:p-6'
      }`}
    >
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[60] flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-2xl animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ------------------------------------------------------------- */}
      {/* VIEW 1: UNIFIED PORTAL LOGIN SCREEN (If not authenticated) */}
      {/* ------------------------------------------------------------- */}
      {!adminAuth.isAuthenticated && !staffAuth.isAuthenticated ? (
        <div className="relative w-full max-w-lg bg-gradient-to-b from-[#022c22] to-[#01140e] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-200">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer z-10"
            aria-label="Close Portal Login"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Login Portal Mode Tabs Switcher */}
          <div className="flex items-center p-1 rounded-2xl bg-black/50 border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => setLoginMode('admin')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                loginMode === 'admin'
                  ? 'bg-emerald-500 text-emerald-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Administrator Login</span>
            </button>

            <button
              type="button"
              onClick={() => setLoginMode('staff')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                loginMode === 'staff'
                  ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Staff Login Panel</span>
            </button>
          </div>

          {/* MODE A: ADMINISTRATOR LOGIN FORM */}
          {loginMode === 'admin' ? (
            <div>
              <div className="flex flex-col items-center text-center mb-5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mb-2.5 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                  <Lock className="w-7 h-7 text-emerald-400" />
                </div>
                <span className="text-[10px] font-extrabold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 mb-1">
                  RECON EXPO 2026 SECRETARIAT
                </span>
                <h2 className="text-xl font-black text-white font-display">Administrator Access Portal</h2>
                <p className="text-xs text-slate-400 mt-0.5 max-w-xs">
                  Full control over event details, staff permissions, speakers, pricing, and backups.
                </p>
              </div>

              {/* High Security Admin Badge */}
              <div className="mb-5 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Secured Secretariat Access</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                  Anti-Brute Force Active
                </span>
              </div>

              {loginError && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Admin Username
                  </label>
                  <input
                    type="text"
                    required
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                    placeholder="e.g. admin"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      placeholder="Enter administrator password"
                      className="w-full px-4 py-2.5 pr-10 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-emerald-950 font-black text-sm tracking-wide shadow-lg shadow-emerald-900/40 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>LOG IN TO ADMIN CONSOLE</span>
                </button>
              </form>
            </div>
          ) : (
            /* MODE B: STAFF LOGIN PANEL FORM */
            <div>
              <div className="flex flex-col items-center text-center mb-5">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center mb-2.5 shadow-[0_0_25px_rgba(6,182,212,0.3)]">
                  <UserPlus className="w-7 h-7 text-cyan-400" />
                </div>
                <span className="text-[10px] font-extrabold tracking-widest text-cyan-300 uppercase bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 mb-1">
                  AUTHORIZED STAFF WORKSPACE
                </span>
                <h2 className="text-xl font-black text-white font-display">Staff Portal Login</h2>
                <p className="text-xs text-slate-400 mt-0.5 max-w-xs">
                  Access assigned secretariat tools, QR gate check-in, registration counters, and message inbox.
                </p>
              </div>

              {/* High Security Staff Badge */}
              <div className="mb-5 p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Secured Staff Portal</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30">
                  Rate-Limiting Active
                </span>
              </div>

              {staffLoginError && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{staffLoginError}</span>
                </div>
              )}

              <form onSubmit={(e) => {
                e.preventDefault();
                setStaffLoginError('');
                const res = loginStaff(staffLoginUser, staffLoginPass);
                if (res.success) {
                  showToast(res.message);
                  setStaffLoginUser('');
                  setStaffLoginPass('');
                } else {
                  setStaffLoginError(res.message);
                }
              }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Staff Portal Username
                  </label>
                  <input
                    type="text"
                    required
                    value={staffLoginUser}
                    onChange={(e) => setStaffLoginUser(e.target.value)}
                    placeholder="e.g. staff.registrar"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Staff Password
                  </label>
                  <div className="relative">
                    <input
                      type={showStaffPassword ? 'text' : 'password'}
                      required
                      value={staffLoginPass}
                      onChange={(e) => setStaffLoginPass(e.target.value)}
                      placeholder="Enter staff password"
                      className="w-full px-4 py-2.5 pr-10 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowStaffPassword(!showStaffPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showStaffPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-cyan-950/50 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>LOG IN TO STAFF WORKSPACE</span>
                </button>
              </form>
            </div>
          )}
        </div>
      ) : (
        /* ------------------------------------------------------------- */
        /* VIEW 2: FULL ADMIN DASHBOARD CONSOLE (Authenticated) */
        /* ------------------------------------------------------------- */
        <div className={`relative w-full flex flex-col bg-[#021f18] border border-emerald-500/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden text-slate-200 transition-all duration-300 ${
          isMaximized 
            ? 'max-w-[99vw] xl:max-w-[1920px] h-[97vh] sm:h-[98vh]' 
            : 'max-w-7xl h-[92vh]'
        }`}>
          
          {/* TOP ADMIN HEADER BAR */}
          <div className="flex-shrink-0 bg-[#01140e] border-b border-white/10 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-white text-base sm:text-lg tracking-tight">
                    {staffAuth?.isAuthenticated && !adminAuth?.isAuthenticated
                      ? `RECON 2026 Staff Portal (${staffAuth.staff?.department || 'Staff Workspace'})`
                      : 'RECON 2026 Admin Console'}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {staffAuth?.isAuthenticated && !adminAuth?.isAuthenticated ? 'Staff Session Active' : 'Live Website Active'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  {staffAuth?.isAuthenticated && !adminAuth?.isAuthenticated ? (
                    <>Logged in as Staff: <strong className="text-cyan-300">{staffAuth.staff?.fullName}</strong> ({staffAuth.staff?.role}) • Department: <strong className="text-emerald-300">{staffAuth.staff?.department}</strong></>
                  ) : (
                    <>Logged in as Admin: <strong className="text-emerald-300">{adminAuth.user}</strong> • All edits update website instantaneously</>
                  )}
                </p>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 relative">
              {/* NOTIFICATION BELL DROPDOWN CONTAINER */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  title="Admin Real-Time Notifications & Alerts"
                  className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    totalUnreadCount > 0
                      ? 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/50 text-amber-200 shadow-lg shadow-amber-950/40 ring-1 ring-amber-400/40'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    {totalUnreadCount > 0 ? (
                      <BellRing className="w-4 h-4 text-amber-400 animate-bounce" />
                    ) : (
                      <Bell className="w-4 h-4 text-slate-300" />
                    )}
                    {totalUnreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-[#01140e] animate-ping" />
                    )}
                  </div>
                  <span className="hidden sm:inline">Alerts</span>
                  {totalUnreadCount > 0 ? (
                    <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black shadow-md">
                      {totalUnreadCount} NEW
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-slate-400 text-[10px] font-bold">
                      {allNotificationItems.length}
                    </span>
                  )}
                </button>

                {/* NOTIFICATIONS DROPDOWN PANEL POPOVER */}
                <AnimatePresence>
                  {isNotificationsOpen && (
                    <>
                      {/* Transparent backdrop to close dropdown when clicking outside */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsNotificationsOpen(false)} 
                      />

                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute right-0 mt-2.5 w-80 sm:w-96 md:w-[440px] bg-[#011710] border border-emerald-500/40 rounded-3xl shadow-2xl z-50 overflow-hidden text-slate-200 backdrop-blur-2xl ring-1 ring-black/80"
                      >
                        {/* Popover Header */}
                        <div className="p-4 bg-[#01140e] border-b border-white/10 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                              <Bell className="w-4 h-4 text-amber-400" />
                            </div>
                            <div>
                              <h3 className="font-extrabold text-white text-sm tracking-tight flex items-center gap-2">
                                Admin Notification Center
                                {totalUnreadCount > 0 && (
                                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-black">
                                    {totalUnreadCount} UNREAD
                                  </span>
                                )}
                              </h3>
                              <p className="text-[11px] text-slate-400">
                                Live alerts for new registrations & Secretariat messages
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            {totalUnreadCount > 0 && (
                              <button
                                type="button"
                                onClick={handleMarkAllAsRead}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                title="Mark all notifications as read"
                              >
                                <CheckCheck className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Mark Read</span>
                              </button>
                            )}

                            {allNotificationItems.length > 0 && (
                              <button
                                type="button"
                                onClick={handleClearAllNotifications}
                                className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 hover:text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                title="Clear and delete all alerts from list"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Clear All</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Category Filter Tabs Bar */}
                        <div className="p-2.5 bg-[#011a12] border-b border-white/10 flex items-center gap-1 overflow-x-auto">
                          <button
                            onClick={() => setNotificationCategoryFilter('ALL')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                              notificationCategoryFilter === 'ALL'
                                ? 'bg-emerald-500 text-emerald-950 font-black shadow-md'
                                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                            }`}
                          >
                            <span>All</span>
                            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-black/30 font-mono">
                              {allNotificationItems.length}
                            </span>
                          </button>

                          <button
                            onClick={() => setNotificationCategoryFilter('REGISTRATIONS')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                              notificationCategoryFilter === 'REGISTRATIONS'
                                ? 'bg-emerald-500 text-emerald-950 font-black shadow-md'
                                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                            }`}
                          >
                            <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Registrations</span>
                            {unreadRegistrationsCount > 0 && (
                              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-red-500 text-white font-mono font-black">
                                {unreadRegistrationsCount}
                              </span>
                            )}
                          </button>

                          <button
                            onClick={() => setNotificationCategoryFilter('MESSAGES')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                              notificationCategoryFilter === 'MESSAGES'
                                ? 'bg-emerald-500 text-emerald-950 font-black shadow-md'
                                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                            }`}
                          >
                            <Mail className="w-3.5 h-3.5 text-amber-400" />
                            <span>Messages</span>
                            {unreadMessagesCount > 0 && (
                              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-amber-500 text-black font-mono font-black">
                                {unreadMessagesCount}
                              </span>
                            )}
                          </button>

                          <button
                            onClick={() => setNotificationCategoryFilter('PAYMENTS')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                              notificationCategoryFilter === 'PAYMENTS'
                                ? 'bg-emerald-500 text-emerald-950 font-black shadow-md'
                                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                            }`}
                          >
                            <CreditCard className="w-3.5 h-3.5 text-purple-400" />
                            <span>Payments</span>
                            {unreadPaymentsCount > 0 && (
                              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-purple-500 text-white font-mono font-black">
                                {unreadPaymentsCount}
                              </span>
                            )}
                          </button>
                        </div>

                        {/* Search Input Bar */}
                        <div className="p-2.5 bg-[#01140e] border-b border-white/5">
                          <div className="relative">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                              type="text"
                              value={notificationSearchQuery}
                              onChange={(e) => setNotificationSearchQuery(e.target.value)}
                              placeholder="Search alerts by name, email, or topic..."
                              className="w-full pl-8 pr-8 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                            />
                            {notificationSearchQuery && (
                              <button
                                onClick={() => setNotificationSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Notification Items List Container */}
                        <div className="max-h-80 sm:max-h-96 overflow-y-auto p-2.5 space-y-2">
                          {filteredNotificationItems.length === 0 ? (
                            <div className="py-8 px-4 text-center space-y-2">
                              <Inbox className="w-8 h-8 text-slate-600 mx-auto" />
                              <p className="text-xs font-bold text-slate-300">No notifications found</p>
                              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                                {notificationSearchQuery
                                  ? `No results match "${notificationSearchQuery}". Try clearing your search query.`
                                  : 'All quiet! New registrations and Secretariat messages will appear here in real time.'}
                              </p>
                            </div>
                          ) : (
                            filteredNotificationItems.map((item) => (
                              <div
                                key={item.id}
                                onClick={() => handleSelectNotification(item)}
                                className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 relative group ${
                                  item.isRead
                                    ? 'bg-black/30 border-white/5 hover:bg-white/5 hover:border-white/15'
                                    : 'bg-[#012218] border-emerald-500/40 hover:bg-[#022e22] hover:border-emerald-400/60 shadow-lg shadow-emerald-950/30'
                                }`}
                              >
                                {/* Left Category Icon */}
                                <div className="flex-shrink-0 mt-0.5">
                                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                                    item.type === 'message'
                                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                                      : item.type === 'registration'
                                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                                      : 'bg-purple-500/15 border-purple-500/30 text-purple-400'
                                  }`}>
                                    {item.type === 'message' ? (
                                      <Mail className="w-4 h-4" />
                                    ) : item.type === 'registration' ? (
                                      <UserPlus className="w-4 h-4" />
                                    ) : (
                                      <CreditCard className="w-4 h-4" />
                                    )}
                                  </div>
                                </div>

                                {/* Main Item Body */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <div className="flex items-center gap-1.5 truncate flex-1 min-w-0">
                                      {!item.isRead && (
                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                                      )}
                                      <h4 className="text-xs font-black text-white truncate">
                                        {item.title}
                                      </h4>
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                      <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                                        {formatNotificationTime(item.timestamp)}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteNotification(item.id, item.title);
                                        }}
                                        className="p-1 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                                        title="Delete / Dismiss this alert"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`px-2 py-0.2 text-[9px] rounded-full border uppercase ${item.badgeColorClass}`}>
                                      {item.badgeText}
                                    </span>
                                    <span className="text-[11px] text-slate-300 font-semibold truncate">
                                      {item.subtitle}
                                    </span>
                                  </div>

                                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-1">
                                    {item.body}
                                  </p>

                                  <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/5 text-emerald-400 group-hover:text-emerald-300 font-bold">
                                    <span>
                                      {item.type === 'message'
                                        ? 'View in Secretariat Inbox'
                                        : item.type === 'registration'
                                        ? 'Inspect Smart ID Badge'
                                        : 'View Payment Details'}
                                    </span>
                                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Popover Footer Bar */}
                        <div className="p-3 bg-[#01140e] border-t border-white/10 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span>
                              Showing <strong className="text-white">{filteredNotificationItems.length}</strong> alerts
                            </span>
                            {clearedNotificationIds.length > 0 && (
                              <button
                                type="button"
                                onClick={handleRestoreClearedNotifications}
                                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 transition-colors cursor-pointer hover:underline"
                                title="Restore all cleared alerts"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Restore Cleared ({clearedNotificationIds.length})</span>
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setActiveTab('inbox');
                                setIsNotificationsOpen(false);
                              }}
                              className="text-amber-400 hover:text-amber-300 text-[11px] font-bold hover:underline"
                            >
                              Go to Inbox ({unreadMessagesCount})
                            </button>
                            <span>•</span>
                            <button
                              onClick={() => {
                                setActiveTab('attendees');
                                setIsNotificationsOpen(false);
                              }}
                              className="text-emerald-400 hover:text-emerald-300 text-[11px] font-bold hover:underline"
                            >
                              Go to Attendees
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Screen Width Maximizer Toggle Button */}
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                title={isMaximized ? "Restore Standard View (1280px)" : "Maximize Screen to Ultra-Wide (Full Width)"}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isMaximized
                    ? 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-400/40 text-emerald-300 shadow-md'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                }`}
              >
                {isMaximized ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">Restore</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">Maximize</span>
                  </>
                )}
              </button>

              {isMainAdmin && (
                <>
                  <button
                    onClick={handleDownloadBackup}
                    title="Download JSON Data Backup"
                    className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Backup JSON</span>
                  </button>

                  <div 
                    title="Website auto-reset is permanently disabled. All custom content and admin edits are preserved."
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400 select-none"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Auto-Reset: Disabled</span>
                  </div>
                </>
              )}

              <button
                onClick={handleClose}
                title="View Live Website"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-xs font-bold text-emerald-300 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Preview Live Site</span>
              </button>

              <button
                onClick={handleGlobalLogout}
                title={staffAuth?.isAuthenticated ? "Log Out of Staff Portal" : "Log Out of Admin"}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-600/30 border border-red-500/30 hover:border-red-500/50 text-xs font-bold text-red-200 hover:text-white transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">
                  Logout {staffAuth?.isAuthenticated && !adminAuth?.isAuthenticated ? 'Staff' : 'Admin'}
                </span>
              </button>

              <button
                onClick={handleClose}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* MAIN DASHBOARD BODY (Sidebar Tabs + Content Area) */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* SIDEBAR NAVIGATION TABS */}
            <div className="w-full md:w-64 bg-[#01140e]/90 border-b md:border-b-0 md:border-r border-white/10 p-2 md:p-4 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto flex-shrink-0">
              
              {/* STAFF SESSION BANNER CARD */}
              {staffAuth?.isAuthenticated && !adminAuth?.isAuthenticated && (
                <div className="bg-gradient-to-br from-cyan-950 via-[#012d22] to-emerald-950 border border-cyan-500/40 rounded-2xl p-3 mb-2 space-y-2.5 shadow-lg flex-shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-black flex items-center justify-center text-xs shadow-inner flex-shrink-0">
                      {staffAuth.staff?.fullName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-black text-white truncate font-display">
                        {staffAuth.staff?.fullName}
                      </h4>
                      <span className="text-[10px] font-bold text-cyan-300 truncate block">
                        {staffAuth.staff?.role}
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-300 bg-black/50 px-2.5 py-1.5 rounded-xl border border-white/10 flex items-center justify-between">
                    <span className="text-slate-400 font-semibold">Department:</span>
                    <strong className="text-emerald-300 font-bold">{staffAuth.staff?.department}</strong>
                  </div>

                  <button
                    onClick={handleGlobalLogout}
                    className="w-full py-1.5 px-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-red-400" />
                    <span>LOGOUT STAFF WORKSPACE</span>
                  </button>
                </div>
              )}
              
              {canSeeTab('overview') && (
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'overview'
                      ? 'bg-emerald-500 text-emerald-950 shadow-md shadow-emerald-950/40'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
                  <span>Dashboard Overview</span>
                </button>
              )}

              {canSeeTab('registration') && (
                <button
                  onClick={() => setActiveTab('registration')}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'registration'
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-emerald-950 font-black shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-300'
                      : 'text-emerald-300 hover:bg-emerald-500/10 hover:text-emerald-200 border border-emerald-500/20'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <UserPlus className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>On-Site Registration</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-400/30 text-emerald-200 font-mono font-bold border border-emerald-400/40">
                    NEW
                  </span>
                </button>
              )}

              {canSeeTab('inbox') && (
                <button
                  onClick={() => setActiveTab('inbox')}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'inbox'
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-emerald-950 font-black shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-300'
                      : 'text-amber-300/90 hover:bg-amber-500/10 hover:text-amber-200 border border-amber-500/20'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Inbox className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>Secretariat Inbox</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    (contactMessages || []).filter(m => m.status === 'unread').length > 0
                      ? 'bg-red-500 text-white animate-pulse shadow-md'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {(contactMessages || []).filter(m => m.status === 'unread').length > 0
                      ? `${(contactMessages || []).filter(m => m.status === 'unread').length} NEW`
                      : `${contactMessages.length}`}
                  </span>
                </button>
              )}

              {canSeeTab('general') && (
                <button
                  onClick={() => setActiveTab('general')}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'general'
                      ? 'bg-emerald-500 text-emerald-950 shadow-md'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 flex-shrink-0" />
                    <span>Event Info & WhatsApp</span>
                  </span>
                  {expoDetails.logoUrl && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-400/30 text-emerald-200 font-bold border border-emerald-400/40">
                      LOGO
                    </span>
                  )}
                </button>
              )}

              {canSeeTab('site_texts') && (
                <button
                  onClick={() => setActiveTab('site_texts')}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'site_texts'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-md'
                      : 'text-emerald-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Type className="w-4 h-4 flex-shrink-0" />
                    <span>Home Page Texts</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-400/30 text-emerald-100 font-bold border border-emerald-400/40">
                    ALL
                  </span>
                </button>
              )}

              {canSeeTab('id_card') && (
                <button
                  onClick={() => setActiveTab('id_card')}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'id_card'
                      ? 'bg-gradient-to-r from-emerald-500 to-amber-400 text-emerald-950 font-black shadow-lg shadow-amber-950/40'
                      : 'text-amber-300/90 hover:bg-amber-500/10 hover:text-amber-200 border border-amber-500/20'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>ID Card Customizer</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-400/30 text-amber-100 font-bold border border-amber-400/40">
                    LIVE CARD
                  </span>
                </button>
              )}

              {canSeeTab('hero') && (
                <button
                  onClick={() => setActiveTab('hero')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'hero'
                      ? 'bg-emerald-500 text-emerald-950 shadow-md'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 flex-shrink-0" />
                  <span>Hero & Slideshow</span>
                </button>
              )}

              {canSeeTab('speakers') && (
                <button
                  onClick={() => setActiveTab('speakers')}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'speakers'
                      ? 'bg-emerald-500 text-emerald-950 shadow-md'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Mic2 className="w-4 h-4 flex-shrink-0" />
                    <span>Keynote & Speakers</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/30 font-mono">
                    {speakers.length}
                  </span>
                </button>
              )}

              {canSeeTab('programme') && (
                <button
                  onClick={() => setActiveTab('programme')}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'programme'
                      ? 'bg-emerald-500 text-emerald-950 shadow-md'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <CalendarDays className="w-4 h-4 flex-shrink-0" />
                    <span>Programme Schedule</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/30 font-mono">
                    {sessions.length}
                  </span>
                </button>
              )}

              {canSeeTab('booth_packages') && (
                <button
                  onClick={() => {
                    setActiveTab('booth_packages');
                    setTiersSubTab('booth_packages');
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'booth_packages' || (activeTab === 'tiers' && tiersSubTab === 'booth_packages')
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-300'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Store className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Exhibition Booth Packages</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-950 text-emerald-200 font-mono font-black border border-emerald-400/30">
                    {boothPackages.length}
                  </span>
                </button>
              )}

              {canSeeTab('tiers') && (
                <button
                  onClick={() => {
                    setActiveTab('tiers');
                    setTiersSubTab('registration_tiers');
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'tiers' && tiersSubTab === 'registration_tiers'
                      ? 'bg-emerald-500 text-emerald-950 shadow-md font-black'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Ticket className="w-4 h-4 flex-shrink-0" />
                    <span>Delegate & Visitor Tiers</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/30 font-mono">
                    {tiers.length}
                  </span>
                </button>
              )}

              {canSeeTab('sponsors') && (
                <button
                  onClick={() => setActiveTab('sponsors')}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'sponsors'
                      ? 'bg-emerald-500 text-emerald-950 shadow-md'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 flex-shrink-0" />
                    <span>Sponsors & Partners</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/30 font-mono">
                    {sponsors.length}
                  </span>
                </button>
              )}

              {canSeeTab('sectors') && (
                <button
                  onClick={() => setActiveTab('sectors')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'sectors'
                      ? 'bg-emerald-500 text-emerald-950 shadow-md'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4 flex-shrink-0" />
                  <span>Industry Sectors</span>
                </button>
              )}

              {canSeeTab('faqs') && (
                <button
                  onClick={() => setActiveTab('faqs')}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'faqs'
                      ? 'bg-emerald-500 text-emerald-950 shadow-md'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 flex-shrink-0" />
                    <span>FAQs Manager</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/30 font-mono">
                    {faqs.length}
                  </span>
                </button>
              )}

              {canSeeTab('attendees') && (
                <button
                  onClick={() => setActiveTab('attendees')}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'attendees'
                      ? 'bg-emerald-500 text-emerald-950 shadow-md'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span>Delegates & Leads</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-red-600 text-white font-mono font-bold">
                    {attendees.length}
                  </span>
                </button>
              )}

              {canSeeTab('special_badges') && (
                <button
                  onClick={() => setActiveTab('special_badges')}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'special_badges'
                      ? 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-white font-extrabold shadow-md shadow-purple-950/40'
                      : 'text-purple-300 hover:bg-purple-500/10 hover:text-purple-200 border border-purple-500/20'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-purple-300 flex-shrink-0" />
                    <span>Special ID Badge Gen</span>
                  </span>
                  <span className="px-1 py-0.2 rounded text-[9px] bg-purple-500/30 text-purple-200 font-mono font-bold">
                    PRESS/SEC
                  </span>
                </button>
              )}

              {adminAuth.isAuthenticated && canSeeTab('staff') && (
                <button
                  onClick={() => setActiveTab('staff')}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'staff'
                      ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-black shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-300'
                      : 'text-cyan-300/90 hover:bg-cyan-500/10 hover:text-cyan-200 border border-cyan-500/20'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <UserPlus className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span>Staff Accounts & Roles</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-cyan-500/20 text-cyan-200 font-mono font-bold border border-cyan-400/30">
                    {staffAccounts.length}
                  </span>
                </button>
              )}

              {canSeeTab('marketer') && (
                <button
                  onClick={() => setActiveTab('marketer')}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'marketer'
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-300'
                      : 'text-emerald-300/90 hover:bg-emerald-500/10 hover:text-emerald-200 border border-emerald-500/20'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Tag className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Marketer Referral System</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-emerald-500/20 text-emerald-200 font-mono font-bold border border-emerald-400/30">
                    {marketerAccounts.length}
                  </span>
                </button>
              )}

              {canSeeTab('push_notif') && (
                <button
                  onClick={() => setActiveTab('push_notif')}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'push_notif'
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 text-slate-950 font-black shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-300'
                      : 'text-emerald-300/90 hover:bg-emerald-500/10 hover:text-emerald-200 border border-emerald-500/20'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Bell className="w-4 h-4 text-emerald-400 flex-shrink-0 fill-emerald-400/30 animate-pulse" />
                    <span>Push Notification Manager</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-emerald-500/20 text-emerald-200 font-mono font-bold border border-emerald-400/30">
                    LIVE
                  </span>
                </button>
              )}

              {canSeeTab('system_update') && (
                <button
                  onClick={() => setActiveTab('system_update')}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'system_update'
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 text-slate-950 font-black shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-300'
                      : 'text-amber-300/90 hover:bg-amber-500/10 hover:text-amber-200 border border-amber-500/20'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Upload className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>System & Feature Zip Update</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-400/30 text-amber-100 font-bold border border-amber-400/40">
                    ZIP UPDATE
                  </span>
                </button>
              )}

              {canSeeTab('email_marketing') && (
                <button
                  onClick={() => setActiveTab('email_marketing')}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'email_marketing'
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 text-slate-950 font-black shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-300'
                      : 'text-emerald-300/90 hover:bg-emerald-500/10 hover:text-emerald-200 border border-emerald-500/20'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Send className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>Email Marketing & 30D Drip</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-400/30 text-amber-200 font-bold border border-amber-400/40">
                    30D + 33+ TMPL
                  </span>
                </button>
              )}

              {canSeeTab('smtp') && (
                <button
                  onClick={() => setActiveTab('smtp')}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'smtp'
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 text-slate-950 font-black shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-300'
                      : 'text-emerald-300/90 hover:bg-emerald-500/10 hover:text-emerald-200 border border-emerald-500/20'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>SMTP Email Server</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-200 font-mono font-bold border border-emerald-400/30">
                    INBOX 100%
                  </span>
                </button>
              )}

              {canSeeTab('pixel_tracking') && (
                <button
                  onClick={() => setActiveTab('pixel_tracking')}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'pixel_tracking'
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 text-slate-950 font-black shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-300'
                      : 'text-emerald-300/90 hover:bg-emerald-500/10 hover:text-emerald-200 border border-emerald-500/20'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Activity className="w-4 h-4 text-emerald-400 flex-shrink-0 animate-pulse" />
                    <span>FB &amp; TikTok Pixel Tracker</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-200 font-mono font-bold border border-emerald-400/30">
                    LIVE TRACK
                  </span>
                </button>
              )}

              {canSeeTab('seo_engine') && (
                <button
                  onClick={() => setActiveTab('seo_engine')}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'seo_engine'
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 text-slate-950 font-black shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-300'
                      : 'text-emerald-300/90 hover:bg-emerald-500/10 hover:text-emerald-200 border border-emerald-500/20'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-emerald-400 flex-shrink-0 animate-spin-slow" />
                    <span>SEO, AEO &amp; AI Schemas</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-200 font-mono font-bold border border-emerald-400/30">
                    100% SEO/AI
                  </span>
                </button>
              )}

              {canSeeTab('settings') && (
                <div className="pt-2 mt-auto border-t border-white/10 hidden md:block">
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'settings'
                        ? 'bg-emerald-500 text-emerald-950 shadow-md'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Settings className="w-4 h-4 flex-shrink-0" />
                    <span>Security & Backups</span>
                  </button>
                </div>
              )}
            </div>

            {/* TAB CONTENT VIEWPORT */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#021f18]/60">
              
              {/* ========================================================= */}
              {/* TAB 1: OVERVIEW */}
              {/* ========================================================= */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Active Staff Member Workspace Welcome Banner */}
                  {isStaffSession && staffAuth?.staff && (
                    <div className="bg-gradient-to-r from-emerald-950/90 via-[#012f24] to-teal-950/80 border border-emerald-500/40 rounded-2xl p-5 shadow-xl space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-black text-emerald-300 text-lg">
                            {staffAuth.staff.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                STAFF WORKSPACE
                              </span>
                              <span className="text-xs font-bold text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded-full border border-teal-500/30">
                                {staffAuth.staff.department} Department
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-white mt-1">
                              Welcome, {staffAuth.staff.fullName}
                            </h3>
                            <p className="text-xs text-slate-300">
                              Assigned Role: <strong className="text-emerald-300">{staffAuth.staff.role}</strong>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleGlobalLogout}
                            className="px-3.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-bold transition-colors cursor-pointer"
                          >
                            Logout Staff Account
                          </button>
                        </div>
                      </div>

                      {/* Quick Action Shortcuts for department permissions */}
                      <div className="pt-3 border-t border-white/10 flex flex-wrap gap-2 text-xs">
                        {staffAuth.staff.permissions.canRegisterAttendees && (
                          <button
                            onClick={() => setActiveTab('registration')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500 text-emerald-950 font-bold flex items-center gap-1.5 hover:bg-emerald-400 transition-colors cursor-pointer"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>On-Site Registration Desk</span>
                          </button>
                        )}
                        {staffAuth.staff.permissions.canCheckIn && (
                          <button
                            onClick={() => setIsGateScannerOpen(true)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold flex items-center gap-1.5 hover:brightness-110 transition-all cursor-pointer"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Gate QR Camera Scanner</span>
                          </button>
                        )}
                        {staffAuth.staff.permissions.canManageInbox && (
                          <button
                            onClick={() => setActiveTab('inbox')}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1.5 hover:bg-amber-500/30 transition-colors cursor-pointer"
                          >
                            <Inbox className="w-3.5 h-3.5" />
                            <span>Secretariat Messages Inbox ({contactMessages.filter(m => m.status === 'unread').length})</span>
                          </button>
                        )}
                        {staffAuth.staff.permissions.canManageSchedule && (
                          <button
                            onClick={() => setActiveTab('programme')}
                            className="px-3 py-1.5 rounded-xl bg-white/10 text-slate-200 border border-white/15 font-bold flex items-center gap-1.5 hover:bg-white/20 transition-colors cursor-pointer"
                          >
                            <CalendarDays className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Programme Sessions</span>
                          </button>
                        )}
                        {staffAuth.staff.permissions.canManageSpeakers && (
                          <button
                            onClick={() => setActiveTab('speakers')}
                            className="px-3 py-1.5 rounded-xl bg-white/10 text-slate-200 border border-white/15 font-bold flex items-center gap-1.5 hover:bg-white/20 transition-colors cursor-pointer"
                          >
                            <Mic2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Keynote Speakers</span>
                          </button>
                        )}
                        {staffAuth.staff.permissions.canManageSponsors && (
                          <button
                            onClick={() => setActiveTab('sponsors')}
                            className="px-3 py-1.5 rounded-xl bg-white/10 text-slate-200 border border-white/15 font-bold flex items-center gap-1.5 hover:bg-white/20 transition-colors cursor-pointer"
                          >
                            <Award className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Sponsors & Partners</span>
                          </button>
                        )}
                        {staffAuth.staff.permissions.canViewPayments && (
                          <button
                            onClick={() => setActiveTab('attendees')}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1.5 hover:bg-amber-500/30 transition-colors cursor-pointer"
                          >
                            <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                            <span>Attendee Payments</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                      Expo Secretariat Command Center
                    </h2>
                    <p className="text-xs text-slate-400">
                      Real-time overview of the 8th Real Estate & Construction Expo 2026 website parameters.
                    </p>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Confirmed Speakers</span>
                      <span className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">{speakers.length}</span>
                      <span className="text-[11px] text-slate-400 mt-auto pt-2">{speakers.filter(s => s.keynote).length} Keynote Chairs</span>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Programme Sessions</span>
                      <span className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">{sessions.length}</span>
                      <span className="text-[11px] text-slate-400 mt-auto pt-2">Across 3 full days</span>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sponsors & Partners</span>
                      <span className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">{sponsors.length}</span>
                      <span className="text-[11px] text-slate-400 mt-auto pt-2">Headline & Institutional</span>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Registered Leads</span>
                      <span className="text-2xl sm:text-3xl font-black text-red-400 mt-1">{attendees.length}</span>
                      <span className="text-[11px] text-slate-400 mt-auto pt-2">Live attendee bookings</span>
                    </div>
                  </div>

                  {/* Event Snapshot Card */}
                  <div className="bg-gradient-to-r from-emerald-950/60 via-[#022c22] to-black/40 border border-emerald-500/20 rounded-2xl p-5 sm:p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                          ACTIVE THEME
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-white mt-1.5 font-display">
                          "{expoDetails.theme}"
                        </h3>
                        <p className="text-xs text-slate-300 mt-0.5">
                          {expoDetails.subheading}
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('general')}
                        className="px-4 py-2 rounded-xl bg-emerald-500 text-emerald-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
                      >
                        Edit Event Theme & Info
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10 text-xs">
                      <div>
                        <span className="text-slate-400">Date Range:</span>
                        <p className="font-bold text-white">{expoDetails.dateRange}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Venue:</span>
                        <p className="font-bold text-white">{expoDetails.venue}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Secretariat Email:</span>
                        <p className="font-bold text-white">{expoDetails.contactEmail}</p>
                      </div>
                    </div>
                  </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
                    <button
                      onClick={() => setActiveTab('general')}
                      className="p-4 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 text-left transition-all group cursor-pointer shadow-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <ImageIcon className="w-5 h-5 text-emerald-400" />
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        Change Logo
                        {expoDetails.logoUrl && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1">
                        {expoDetails.logoUrl ? 'Custom logo active. Click to update.' : 'Upload official logo or restore default.'}
                      </p>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('speakers');
                        setIsAddingSpeaker(true);
                      }}
                      className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Mic2 className="w-5 h-5 text-emerald-400" />
                        <Plus className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <h4 className="text-sm font-bold text-white">Add New Speaker</h4>
                      <p className="text-xs text-slate-400 mt-1">Upload profile, bio, topic and social links.</p>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('programme');
                        setIsAddingSession(true);
                      }}
                      className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <CalendarDays className="w-5 h-5 text-emerald-400" />
                        <Plus className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <h4 className="text-sm font-bold text-white">Add Session</h4>
                      <p className="text-xs text-slate-400 mt-1">Insert keynote, panel, workshop or demo slot.</p>
                    </button>

                    <button
                      onClick={() => setActiveTab('programme')}
                      className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-emerald-500/20 text-left transition-all group cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <FileText className="w-5 h-5 text-emerald-400" />
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <h4 className="text-sm font-bold text-white">Upload Schedule PDF</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        {expoDetails.programmePdfUrl ? 'Custom PDF active.' : 'Upload official booklet PDF.'}
                      </p>
                    </button>

                    <button
                      onClick={() => setActiveTab('attendees')}
                      className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <FileSpreadsheet className="w-5 h-5 text-red-400" />
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-400 transition-colors" />
                      </div>
                      <h4 className="text-sm font-bold text-white">Registrations ({attendees.length})</h4>
                      <p className="text-xs text-slate-400 mt-1">Export attendee tickets to CSV or manage records.</p>
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB: ON-SITE DELEGATE & ACCREDITATION REGISTRATION */}
              {/* ========================================================= */}
              {activeTab === 'registration' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <UserPlus className="w-7 h-7 text-emerald-400" />
                        <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                          On-Site Accreditation & Registration Desk
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                          LIVE SECRETARIAT STATION
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Register walk-in delegates, VIP guests, exhibitors, sponsors, press media, and official partners directly at the venue.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsGateScannerOpen(true)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-emerald-950 font-black text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Open Gate Camera Scanner</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('attendees')}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5 text-emerald-400" />
                        <span>View All ({attendees.length}) Registrations</span>
                      </button>
                    </div>
                  </div>

                  {/* Main Grid: Registration Form + Live Smart ID Badge Preview */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left 7 Columns: Registration Form */}
                    <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 space-y-5">
                      <div className="border-b border-white/10 pb-3">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <UserPlus className="w-4 h-4 text-emerald-400" />
                          <span>Delegate Accreditation Form</span>
                        </h3>
                        <p className="text-xs text-slate-400">
                          Select the pass category and enter delegate details to generate a verified ticket and smart ID badge.
                        </p>
                      </div>

                      <form onSubmit={handleRegisterOnSiteAttendee} className="space-y-4">
                        {/* Category Selector Pills */}
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-2">
                            Select Pass Category / Tier *
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                            {[
                              { id: 'visitor', label: 'Visitor Delegate', fee: 'FREE', icon: Ticket },
                              { id: 'elite', label: 'VIP Executive Pass', fee: '₦25,000', icon: Sparkles },
                              { id: 'exhibitor', label: 'Exhibitor Stand', fee: boothPackages[0]?.priceFormatted || '₦350,000', icon: Store },
                              { id: 'sponsor', label: 'Sponsor Corporate', fee: '₦500,000', icon: Award },
                              { id: 'partner', label: 'Strategic Partner', fee: 'COMPLIMENTARY', icon: Handshake },
                              { id: 'press', label: 'Press & Media', fee: 'FREE', icon: Camera },
                              { id: 'official', label: 'Secretariat Staff', fee: 'FREE', icon: ShieldCheck },
                            ].map((cat) => {
                              const Icon = cat.icon;
                              const isSelected = regPassType === cat.id;
                              return (
                                <button
                                  type="button"
                                  key={cat.id}
                                  onClick={() => {
                                    setRegPassType(cat.id as any);
                                    if (cat.id === 'visitor' || cat.id === 'press' || cat.id === 'official') {
                                      setRegPaymentStatus('FREE');
                                      setRegAmountPaid('FREE');
                                    } else if (cat.id === 'partner') {
                                      setRegPaymentStatus('FREE');
                                      setRegAmountPaid('COMPLIMENTARY');
                                    } else if (cat.id === 'exhibitor') {
                                      setRegPaymentStatus('PAID');
                                      setRegAmountPaid(boothPackages[0]?.priceFormatted || '₦350,000');
                                    } else {
                                      setRegPaymentStatus('PAID');
                                      setRegAmountPaid(cat.fee);
                                    }
                                  }}
                                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-1 cursor-pointer ${
                                    isSelected
                                      ? 'bg-emerald-500 text-emerald-950 border-emerald-400 font-extrabold shadow-lg scale-[1.02]'
                                      : 'bg-black/30 text-slate-300 border-white/10 hover:bg-white/5'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-950' : 'text-emerald-400'}`} />
                                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                                      isSelected ? 'bg-emerald-950 text-emerald-200' : 'bg-white/10 text-slate-300'
                                    }`}>
                                      {cat.fee}
                                    </span>
                                  </div>
                                  <span className="text-[11px] leading-tight font-bold">{cat.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Exhibitor Specific Booth Stand Package Selector */}
                        {regPassType === 'exhibitor' && (
                          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 font-extrabold">
                                <Store className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Selected Exhibition Booth Stand Package</span>
                              </label>
                              <span className="text-[10px] text-emerald-400 font-mono font-bold">
                                {boothPackages.length} Packages Available
                              </span>
                            </div>
                            <select
                              value={regAmountPaid}
                              onChange={(e) => setRegAmountPaid(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-emerald-500/30 text-white text-xs font-medium focus:outline-none focus:border-emerald-400"
                            >
                              {boothPackages.map(pkg => (
                                <option key={pkg.id} value={pkg.priceFormatted || `₦${pkg.priceNGN.toLocaleString()}`}>
                                  {pkg.name} — {pkg.priceFormatted || `₦${pkg.priceNGN.toLocaleString()}`} ({pkg.badges} Staff Badges)
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* Delegate Personal Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block text-slate-300 font-bold mb-1">Full Name *</label>
                            <input
                              type="text"
                              required
                              value={regFullName}
                              onChange={(e) => setRegFullName(e.target.value)}
                              placeholder="e.g. Chief Dr. Emmanuel Nnamdi"
                              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-300 font-bold mb-1">Email Address *</label>
                            <input
                              type="email"
                              required
                              value={regEmail}
                              onChange={(e) => setRegEmail(e.target.value)}
                              placeholder="e.g. e.nnamdi@realestategroup.ng"
                              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-300 font-bold mb-1">Phone / WhatsApp *</label>
                            <input
                              type="text"
                              value={regPhone}
                              onChange={(e) => setRegPhone(e.target.value)}
                              placeholder="e.g. +234 803 123 4567"
                              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-300 font-bold mb-1">City / State</label>
                            <input
                              type="text"
                              value={regCity}
                              onChange={(e) => setRegCity(e.target.value)}
                              placeholder="e.g. Abuja (FCT)"
                              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                            />
                          </div>
                        </div>

                        {/* Organization & Role */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block text-slate-300 font-bold mb-1">Organization / Company Name</label>
                            <input
                              type="text"
                              value={regOrganization}
                              onChange={(e) => setRegOrganization(e.target.value)}
                              placeholder="e.g. Federal Ministry of Housing / Zenith Bank"
                              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-300 font-bold mb-1">Job Title / Designation</label>
                            <input
                              type="text"
                              value={regRole}
                              onChange={(e) => setRegRole(e.target.value)}
                              placeholder="e.g. Managing Director / Principal Partner"
                              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                            />
                          </div>
                        </div>

                        {/* Payment & Access Days */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div>
                            <label className="block text-slate-300 font-bold mb-1">Payment Status</label>
                            <select
                              value={regPaymentStatus}
                              onChange={(e) => setRegPaymentStatus(e.target.value as any)}
                              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-emerald-400"
                            >
                              <option value="PAID">PAID (POS / Cash / Transfer)</option>
                              <option value="FREE">FREE (Complimentary)</option>
                              <option value="VERIFIED">VERIFIED (Online Payment)</option>
                              <option value="PENDING">PENDING (Pay Later)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-300 font-bold mb-1">Amount Paid / Fee</label>
                            <input
                              type="text"
                              value={regAmountPaid}
                              onChange={(e) => setRegAmountPaid(e.target.value)}
                              placeholder="e.g. ₦25,000 or FREE"
                              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-300 font-bold mb-1">Access Days</label>
                            <select
                              value={regAccessDays}
                              onChange={(e) => setRegAccessDays(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-emerald-400"
                            >
                              <option value="All Days (Oct 15 - 17, 2026)">All Days (Oct 15 - 17, 2026)</option>
                              <option value="Day 1 Only (Opening Ceremony & Plenary)">Day 1 Only (Opening Ceremony)</option>
                              <option value="Day 2 Only (B2B Summit & Exhibition)">Day 2 Only (B2B Summit)</option>
                              <option value="Day 3 Only (Closing Keynote & Gala)">Day 3 Only (Closing Gala)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1 text-xs">Special Secretariat Notes</label>
                          <textarea
                            rows={2}
                            value={regNotes}
                            onChange={(e) => setRegNotes(e.target.value)}
                            placeholder="e.g. Protocol clearance requested, VIP seating allocated, walk-in cash registration..."
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-emerald-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50 transition-all cursor-pointer active:scale-95"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>ISSUE ACCREDITATION & GENERATE SMART BADGE</span>
                        </button>
                      </form>
                    </div>

                    {/* Right 5 Columns: Live Badge Preview / Last Registered Badge & Quick Stats */}
                    <div className="lg:col-span-5 space-y-4">
                      {lastRegisteredTicket ? (
                        <div className="bg-gradient-to-br from-emerald-950 via-[#01261d] to-black border border-emerald-500/40 rounded-2xl p-5 space-y-4 shadow-xl">
                          <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              ACCREDITATION GENERATED
                            </span>
                            <span className="font-mono text-xs text-emerald-300 font-bold">
                              {lastRegisteredTicket.ticketNumber}
                            </span>
                          </div>

                          <div className="p-4 rounded-xl bg-black/50 border border-white/10 flex items-start gap-4">
                            <img
                              src={lastRegisteredTicket.qrCodeUrl}
                              alt="QR Code"
                              className="w-20 h-20 bg-white p-1 rounded-lg flex-shrink-0"
                            />
                            <div className="space-y-1 text-xs">
                              <h4 className="font-black text-white text-sm">
                                {lastRegisteredTicket.fullName}
                              </h4>
                              <p className="text-emerald-300 font-medium">
                                {lastRegisteredTicket.organization}
                              </p>
                              <p className="text-slate-400 text-[11px]">
                                Role: {lastRegisteredTicket.role}
                              </p>
                              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                                {lastRegisteredTicket.tier}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setViewingIdCardTicket(lastRegisteredTicket)}
                              className="flex-1 py-2 rounded-xl bg-emerald-500 text-emerald-950 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-400 transition-colors"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>View & Print Smart Badge</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setLastRegisteredTicket(null)}
                              className="px-3 py-2 rounded-xl bg-white/10 text-slate-300 text-xs font-bold hover:bg-white/20"
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center space-y-3">
                          <CreditCard className="w-10 h-10 text-emerald-400/50 mx-auto" />
                          <h4 className="text-sm font-bold text-white">Live Smart Badge Display</h4>
                          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                            Fill out the accreditation form on the left to immediately generate a verified delegate ticket, QR code, and print-ready smart badge.
                          </p>
                        </div>
                      )}

                      {/* On-Site Recent Registrations List */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs">
                          <h4 className="font-bold text-white flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Recent Secretariat Registrations</span>
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Total: {attendees.length}
                          </span>
                        </div>

                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                          {attendees.slice(-6).reverse().map((att) => (
                            <div
                              key={att.ticketNumber}
                              onClick={() => setViewingIdCardTicket(att)}
                              className="p-2.5 rounded-xl bg-black/40 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between gap-2 cursor-pointer group"
                            >
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-white truncate group-hover:text-emerald-400">
                                  {att.fullName}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate">
                                  {att.organization} • <span className="text-emerald-300 font-mono">{att.ticketNumber}</span>
                                </div>
                              </div>
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase flex-shrink-0">
                                {att.passType}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB: SECRETARIAT MESSAGES INBOX */}
              {/* ========================================================= */}
              {activeTab === 'inbox' && (
                <div className="space-y-6">
                  
                  {/* Header & Stats Banner */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <Inbox className="w-7 h-7 text-amber-400" />
                        <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                          Organizing Secretariat Inbox & Inquiry Desk
                        </h2>
                        {contactMessages.filter(m => m.status === 'unread').length > 0 && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-500 text-white animate-pulse shadow-md uppercase tracking-wider">
                            {contactMessages.filter(m => m.status === 'unread').length} UNREAD DISPATCHES
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Central inbox capturing all direct inquiries submitted to the Expo Secretariat via the public website footer form.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {contactMessages.some(m => m.status === 'unread') && (
                        <button
                          type="button"
                          onClick={() => {
                            contactMessages.forEach(m => {
                              if (m.status === 'unread') {
                                updateContactMessageStatus(m.id, 'read');
                              }
                            });
                            showToast("All messages marked as read.");
                          }}
                          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Mark All Read</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          if (contactMessages.length === 0) {
                            showToast("No messages to export.");
                            return;
                          }
                          const headers = ["Message ID", "Full Name", "Email", "Phone", "Inquiry Category", "Status", "Submitted At", "Message Content", "Reply Notes"];
                          const rows = contactMessages.map(m => [
                            m.id,
                            `"${(m.fullName || '').replace(/"/g, '""')}"`,
                            `"${(m.email || '').replace(/"/g, '""')}"`,
                            `"${(m.phone || '').replace(/"/g, '""')}"`,
                            `"${(m.inquiryType || '').replace(/"/g, '""')}"`,
                            m.status,
                            m.submittedAt,
                            `"${(m.message || '').replace(/"/g, '""')}"`,
                            `"${(m.replyNotes || '').replace(/"/g, '""')}"`
                          ]);
                          const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
                          const encodedUri = encodeURI(csvContent);
                          const link = document.createElement("a");
                          link.setAttribute("href", encodedUri);
                          link.setAttribute("download", `Secretariat_Inquiries_RECON_Expo_${new Date().toISOString().slice(0,10)}.csv`);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          showToast("Exported Secretariat messages to CSV!");
                        }}
                        className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-xs font-bold text-emerald-300 flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Export CSV</span>
                      </button>

                      {(isMainAdmin || canDelete) && contactMessages.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            requestConfirmation(
                              "Clear Secretariat Inbox",
                              "Are you sure you want to permanently clear all messages in the Secretariat inbox? This action cannot be undone.",
                              () => {
                                clearAllContactMessages();
                                showToast("Secretariat inbox cleared.");
                              }
                            );
                          }}
                          className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-bold text-red-400 flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          <span>Clear Inbox</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-1">
                        <span>Total Inquiries</span>
                        <Inbox className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-2xl font-black text-white font-mono">{contactMessages.length}</div>
                      <div className="text-[10px] text-slate-400 mt-1">Direct website dispatches</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                      <div className="flex items-center justify-between text-red-300 text-xs font-bold mb-1">
                        <span>Unread / Pending</span>
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      </div>
                      <div className="text-2xl font-black text-red-300 font-mono">
                        {contactMessages.filter(m => m.status === 'unread').length}
                      </div>
                      <div className="text-[10px] text-red-400/80 mt-1">Requires Secretariat review</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                      <div className="flex items-center justify-between text-amber-300 text-xs font-bold mb-1">
                        <span>High-Value Leads</span>
                        <Sparkles className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-2xl font-black text-amber-300 font-mono">
                        {contactMessages.filter(m => m.inquiryType.includes('Booth') || m.inquiryType.includes('Exhib') || m.inquiryType.includes('Sponsor') || m.inquiryType.includes('Partner') || m.inquiryType.includes('VIP')).length}
                      </div>
                      <div className="text-[10px] text-amber-400/80 mt-1">Exhibitors, Sponsors & Partners</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                      <div className="flex items-center justify-between text-emerald-300 text-xs font-bold mb-1">
                        <span>Replied & Handled</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-2xl font-black text-emerald-300 font-mono">
                        {contactMessages.filter(m => m.status === 'replied').length}
                      </div>
                      <div className="text-[10px] text-emerald-400/80 mt-1">Official responses dispatched</div>
                    </div>
                  </div>

                  {/* Search & Filter Bar */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      
                      {/* Search Bar (5 cols) */}
                      <div className="md:col-span-5 relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          value={inboxSearch}
                          onChange={(e) => setInboxSearch(e.target.value)}
                          placeholder="Search sender, organization, email or keyword..."
                          className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs placeholder-slate-400 focus:outline-none focus:border-emerald-400"
                        />
                      </div>

                      {/* Category Filter Dropdown (4 cols) */}
                      <div className="md:col-span-4">
                        <select
                          value={inboxCategoryFilter}
                          onChange={(e) => setInboxCategoryFilter(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#022c22] border border-white/15 text-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-400"
                        >
                          <option value="ALL">All Inquiry Categories</option>
                          <option value="Exhibition Stand Application">Exhibition Stand Applications</option>
                          <option value="Corporate Sponsorship Application">Corporate Sponsorship Applications</option>
                          <option value="Strategic Partner Application">Strategic Partner Applications</option>
                          <option value="Exhibition Booth Booking">Exhibition Booth Inquiries</option>
                          <option value="Sponsorship & Brand Authority Package">Sponsorship & Brand Packages</option>
                          <option value="Media & Press Accreditation">Media & Press Accreditation</option>
                          <option value="VIP & Ministerial Delegation">VIP & Ministerial Delegation</option>
                          <option value="B2B Deal Room Participation">B2B Deal Room Participation</option>
                          <option value="General Attendee Inquiry">General Attendee Inquiries</option>
                        </select>
                      </div>

                      {/* Status Filter Tabs (3 cols) */}
                      <div className="md:col-span-3 flex items-center justify-end bg-black/40 rounded-xl p-1 border border-white/10 text-xs font-bold">
                        <button
                          type="button"
                          onClick={() => setInboxStatusFilter('ALL')}
                          className={`flex-1 py-1 rounded-lg text-center transition-all cursor-pointer ${
                            inboxStatusFilter === 'ALL' ? 'bg-emerald-500 text-emerald-950 font-black' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          All ({contactMessages.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setInboxStatusFilter('unread')}
                          className={`flex-1 py-1 rounded-lg text-center transition-all cursor-pointer ${
                            inboxStatusFilter === 'unread' ? 'bg-red-500 text-white font-black' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Unread ({contactMessages.filter(m => m.status === 'unread').length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setInboxStatusFilter('replied')}
                          className={`flex-1 py-1 rounded-lg text-center transition-all cursor-pointer ${
                            inboxStatusFilter === 'replied' ? 'bg-emerald-400 text-emerald-950 font-black' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Replied
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* Message Cards List */}
                  {(() => {
                    const filteredMessages = contactMessages.filter(m => {
                      // Category Filter
                      if (inboxCategoryFilter !== 'ALL' && !m.inquiryType.toLowerCase().includes(inboxCategoryFilter.toLowerCase())) {
                        return false;
                      }
                      // Status Filter
                      if (inboxStatusFilter !== 'ALL' && m.status !== inboxStatusFilter) {
                        return false;
                      }
                      // Search Query
                      if (inboxSearch.trim()) {
                        const q = inboxSearch.toLowerCase();
                        const matchName = m.fullName.toLowerCase().includes(q);
                        const matchEmail = m.email.toLowerCase().includes(q);
                        const matchPhone = (m.phone || '').toLowerCase().includes(q);
                        const matchCategory = m.inquiryType.toLowerCase().includes(q);
                        const matchMsg = m.message.toLowerCase().includes(q);
                        return matchName || matchEmail || matchPhone || matchCategory || matchMsg;
                      }
                      return true;
                    });

                    if (filteredMessages.length === 0) {
                      return (
                        <div className="p-12 text-center bg-white/5 border border-white/10 rounded-3xl space-y-3">
                          <Inbox className="w-12 h-12 text-slate-500 mx-auto" />
                          <h3 className="text-base font-bold text-white">No Messages Found</h3>
                          <p className="text-xs text-slate-400 max-w-md mx-auto">
                            {inboxSearch || inboxCategoryFilter !== 'ALL' || inboxStatusFilter !== 'ALL'
                              ? "No secretariat dispatches match your search filters. Try resetting search or category filters."
                              : "The Secretariat inbox is currently empty. Direct website inquiries will appear here automatically."}
                          </p>
                          {(inboxSearch || inboxCategoryFilter !== 'ALL' || inboxStatusFilter !== 'ALL') && (
                            <button
                              onClick={() => {
                                setInboxSearch('');
                                setInboxCategoryFilter('ALL');
                                setInboxStatusFilter('ALL');
                              }}
                              className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs cursor-pointer border border-emerald-500/30"
                            >
                              Reset All Filters
                            </button>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-4">
                        {filteredMessages.map((msg) => {
                          const isReplying = replyingMessageId === msg.id;

                          // Color schemes for Inquiry Categories
                          let categoryColor = 'bg-slate-500/20 text-slate-300 border-slate-500/30';
                          if (msg.inquiryType.includes('Booth') || msg.inquiryType.includes('Exhib')) {
                            categoryColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
                          } else if (msg.inquiryType.includes('Sponsor')) {
                            categoryColor = 'bg-red-500/20 text-red-300 border-red-500/30';
                          } else if (msg.inquiryType.includes('Partner')) {
                            categoryColor = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
                          } else if (msg.inquiryType.includes('VIP') || msg.inquiryType.includes('Ministerial')) {
                            categoryColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
                          } else if (msg.inquiryType.includes('Media') || msg.inquiryType.includes('Press')) {
                            categoryColor = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
                          }

                          return (
                            <div
                              key={msg.id}
                              className={`p-5 sm:p-6 rounded-3xl border transition-all ${
                                msg.status === 'unread'
                                  ? 'bg-[#032018] border-emerald-500/40 shadow-xl shadow-emerald-950/40'
                                  : msg.status === 'replied'
                                  ? 'bg-black/40 border-white/10 opacity-90'
                                  : 'bg-white/5 border-white/10'
                              }`}
                            >
                              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                                <div className="space-y-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${categoryColor}`}>
                                      {msg.inquiryType}
                                    </span>

                                    {msg.status === 'unread' && (
                                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-red-500 text-white animate-pulse">
                                        UNREAD DISPATCH
                                      </span>
                                    )}

                                    {msg.status === 'read' && (
                                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                        READ
                                      </span>
                                    )}

                                    {msg.status === 'replied' && (
                                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                        <span>REPLIED</span>
                                      </span>
                                    )}

                                    <span className="text-[10px] text-slate-400 font-mono">
                                      ID: {msg.id}
                                    </span>
                                  </div>

                                  <h3 className="text-base font-extrabold text-white font-display pt-1">
                                    {msg.fullName}
                                  </h3>
                                </div>

                                <div className="text-right">
                                  <div className="text-xs text-slate-400 flex items-center gap-1 justify-end font-mono">
                                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                                    <span>{new Date(msg.submittedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Sender Contact Bar */}
                              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 py-2 border-y border-white/10 my-3">
                                <div className="flex items-center gap-1.5">
                                  <Mail className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                  <a
                                    href={`mailto:${msg.email}?subject=RECON%20Expo%202026%20Secretariat%20Response:%20${encodeURIComponent(msg.inquiryType)}`}
                                    className="text-emerald-300 hover:text-white font-semibold underline decoration-emerald-500/40"
                                  >
                                    {msg.email}
                                  </a>
                                </div>

                                {msg.phone && (
                                  <div className="flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                                    <a href={`tel:${msg.phone}`} className="hover:text-amber-200 font-mono">
                                      {msg.phone}
                                    </a>
                                  </div>
                                )}
                              </div>

                              {/* Message Content Box */}
                              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                                {msg.message}
                              </div>

                              {/* Display Saved Reply Notes if present */}
                              {msg.replyNotes && (
                                <div className="mt-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span>Secretariat Response / Dispatch Record:</span>
                                  </div>
                                  <p className="text-slate-300 italic">{msg.replyNotes}</p>
                                </div>
                              )}

                              {/* Inline Reply Drawer */}
                              {isReplying && (
                                <div className="mt-4 p-4 rounded-2xl bg-[#011a12] border border-emerald-500/40 space-y-3">
                                  <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                                    <span className="flex items-center gap-1.5">
                                      <Send className="w-3.5 h-3.5 text-emerald-400" />
                                      <span>Dispatch Official Reply / Internal Log</span>
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setReplyingMessageId(null)}
                                      className="text-slate-400 hover:text-white underline text-[11px]"
                                    >
                                      Cancel
                                    </button>
                                  </div>

                                  <textarea
                                    rows={3}
                                    value={replyNotesInput}
                                    onChange={(e) => setReplyNotesInput(e.target.value)}
                                    placeholder="Type official response notes, dispatch reference, or actions taken..."
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-emerald-500/30 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                                  />

                                  <div className="flex flex-wrap items-center justify-end gap-2">
                                    <a
                                      href={`mailto:${msg.email}?subject=RECON%20Expo%202026%20Secretariat%20Response:%20${encodeURIComponent(msg.inquiryType)}&body=${encodeURIComponent(replyNotesInput || '')}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      onClick={() => {
                                        updateContactMessageStatus(msg.id, 'replied', replyNotesInput || 'Dispatched response email via email client.');
                                        setReplyingMessageId(null);
                                        showToast(`Opened email client & marked message as replied.`);
                                      }}
                                      className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                                      <span>Open Email Client & Mark Replied</span>
                                    </a>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (!replyNotesInput.trim()) {
                                          showToast("Please enter reply notes before saving.");
                                          return;
                                        }
                                        updateContactMessageStatus(msg.id, 'replied', replyNotesInput);
                                        setReplyingMessageId(null);
                                        showToast("Reply dispatch log saved & message marked as replied.");
                                      }}
                                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                                    >
                                      <Save className="w-3.5 h-3.5" />
                                      <span>Save Response Record</span>
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Message Action Footer Bar */}
                              <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-white/10 text-xs">
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const nextStatus = msg.status === 'unread' ? 'read' : 'unread';
                                      updateContactMessageStatus(msg.id, nextStatus);
                                      showToast(`Message marked as ${nextStatus}.`);
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold cursor-pointer transition-all text-[11px] flex items-center gap-1.5"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                                    <span>{msg.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setReplyingMessageId(isReplying ? null : msg.id);
                                      setReplyNotesInput(msg.replyNotes || '');
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 font-bold cursor-pointer transition-all text-[11px] flex items-center gap-1.5"
                                  >
                                    <Send className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>{isReplying ? 'Close Reply Box' : 'Reply / Log Dispatch'}</span>
                                  </button>
                                </div>

                                {(isMainAdmin || canDelete) && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      requestConfirmation(
                                        "Delete Message",
                                        `Delete message from ${msg.fullName}?`,
                                        () => {
                                          deleteContactMessage(msg.id);
                                          showToast("Message deleted from Secretariat inbox.");
                                        }
                                      );
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold cursor-pointer transition-all text-[11px] flex items-center gap-1.5"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                    <span>Delete</span>
                                  </button>
                                )}
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                </div>
              )}

              {/* ========================================================= */}
              {/* TAB: HOME PAGE TEXTS & COPY EDITOR */}
              {/* ========================================================= */}
              {activeTab === 'site_texts' && (
                <div className="space-y-6 max-w-5xl">
                  <SiteTextEditorTab onShowToast={showToast} />
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 2: GENERAL EVENT INFO & STATS */}
              {/* ========================================================= */}
              {activeTab === 'general' && (
                <div className="space-y-6 max-w-4xl">
                  <div>
                    <h2 className="text-xl font-bold text-white font-display">General Event Information & Branding</h2>
                    <p className="text-xs text-slate-400">
                      Update official website logo, event title, dates, countdown timers, venue address, contact channels, and metric counters.
                    </p>
                  </div>

                  {/* ========================================================= */}
                  {/* WEBSITE BRAND LOGO & VISUAL IDENTITY */}
                  {/* ========================================================= */}
                  <div id="admin-logo-settings-card" className="bg-gradient-to-b from-white/10 to-white/5 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white flex items-center gap-2 font-display">
                            Website Brand Logo & Visual Identity
                            {expoDetails.logoUrl ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Custom Logo Active
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                Official Default Vector Logo Active
                              </span>
                            )}
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Controls the primary brand logo displayed across the Header Navigation, Mobile Menu, Footer, and Digital Attendee NFC Passes.
                          </p>
                        </div>
                      </div>

                      {expoDetails.logoUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            requestConfirmation(
                              "Restore Official Default Logo",
                              "Are you sure you want to revert to the built-in official RECON Expo 2026 vector logo?",
                              () => {
                                updateExpoDetails({ logoUrl: '' });
                                showToast("Restored official default vector logo.");
                              }
                            );
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-bold transition-all cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Restore Default Logo</span>
                        </button>
                      )}
                    </div>

                    {/* Live Interactive Logo Preview on Dark & Light backgrounds */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <span>Live Logo Preview:</span>
                          <span className="text-[11px] font-normal text-slate-400">
                            (Updates automatically in real time across the entire site)
                          </span>
                        </label>
                        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-[11px]">
                          <button
                            type="button"
                            onClick={() => setLogoPreviewBg('dark')}
                            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                              logoPreviewBg === 'dark'
                                ? 'bg-emerald-500 text-emerald-950 shadow-sm'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Dark Backdrop (Header/Footer)
                          </button>
                          <button
                            type="button"
                            onClick={() => setLogoPreviewBg('light')}
                            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                              logoPreviewBg === 'light'
                                ? 'bg-white text-slate-950 shadow-sm'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Light Backdrop (Pass/Badges)
                          </button>
                        </div>
                      </div>

                      <div
                        className={`w-full py-6 px-4 rounded-2xl border transition-all flex items-center justify-center min-h-[130px] ${
                          logoPreviewBg === 'dark'
                            ? 'bg-[#01140e] border-emerald-500/30 shadow-inner'
                            : 'bg-white border-slate-300 shadow-inner'
                        }`}
                      >
                        <ReconLogo size="xl" align="center" glow={false} />
                      </div>
                    </div>

                    {/* Image Upload Input */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-300">
                        Upload New Logo File (PNG, SVG, JPG, WEBP) or Enter Direct Image URL
                      </label>
                      <ImageUploadInput
                        name="expoLogo"
                        label="Website Official Logo"
                        placeholder="Click to browse image file, or drag & drop PNG/SVG logo here..."
                        initialValue={expoDetails.logoUrl || ''}
                        maxWidth={1200}
                        quality={0.92}
                        onImageChange={(newLogoUrl) => {
                          updateExpoDetails({ logoUrl: newLogoUrl });
                          if (newLogoUrl) {
                            showToast("Website logo updated successfully!");
                          } else {
                            showToast("Custom logo cleared; official default vector logo active.");
                          }
                        }}
                      />
                      <div className="p-3 rounded-xl bg-black/30 border border-white/10 text-[11px] text-slate-300 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white">Recommendations:</strong> For optimal visual contrast across both dark navigation bars and white delegate passes, upload a transparent <strong>PNG</strong> or scalable <strong>SVG</strong> with a horizontal aspect ratio (approx 3:1 or 4:1 ratio).
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                      Event Titles & Theme
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Full Event Name</label>
                        <input
                          type="text"
                          value={expoDetails.name}
                          onChange={(e) => updateExpoDetails({ name: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Short Brand Name</label>
                        <input
                          type="text"
                          value={expoDetails.shortName}
                          onChange={(e) => updateExpoDetails({ shortName: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Central Expo Theme</label>
                      <textarea
                        rows={2}
                        value={expoDetails.theme}
                        onChange={(e) => updateExpoDetails({ theme: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Subheading / Tagline</label>
                      <input
                        type="text"
                        value={expoDetails.subheading}
                        onChange={(e) => updateExpoDetails({ subheading: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  {/* Dates & Countdown */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                          Dates, Schedule & Duration
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Configure the exact date range and number of official event days.
                        </p>
                      </div>

                      {/* Number of Days Control */}
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-black/50 border border-amber-500/40">
                        <Calendar className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-black text-white whitespace-nowrap">Event Duration:</span>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = expoDetails.totalEventDays || 2;
                            if (cur > 1) {
                              const nextVal = cur - 1;
                              updateExpoDetails({ totalEventDays: nextVal });
                              showToast(`Event duration updated to ${nextVal} Days`);
                            }
                          }}
                          className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center cursor-pointer"
                          title="Decrease total event days"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={1}
                          max={30}
                          value={expoDetails.totalEventDays || 2}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            updateExpoDetails({ totalEventDays: val });
                          }}
                          className="w-14 text-center font-black text-amber-300 text-sm py-1 rounded-lg bg-black/60 border border-amber-400/50"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const cur = expoDetails.totalEventDays || 2;
                            const nextVal = cur + 1;
                            updateExpoDetails({ totalEventDays: nextVal });
                            showToast(`Event duration increased to ${nextVal} Days`);
                          }}
                          className="w-7 h-7 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs flex items-center justify-center cursor-pointer"
                          title="Increase total event days"
                        >
                          +
                        </button>
                        <span className="text-xs text-amber-300 font-bold pr-1">Days</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Display Date Range</label>
                        <input
                          type="text"
                          value={expoDetails.dateRange}
                          onChange={(e) => updateExpoDetails({ dateRange: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Countdown Start (ISO/Date)</label>
                        <input
                          type="text"
                          value={expoDetails.startDate}
                          onChange={(e) => updateExpoDetails({ startDate: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Daily Operating Time</label>
                        <input
                          type="text"
                          value={expoDetails.dailyTime}
                          onChange={(e) => updateExpoDetails({ dailyTime: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                    </div>

                    {/* 24-Hour Urgency Countdown & Anti-Reset Policy Container */}
                    <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-black/60 to-emerald-950/40 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          <h4 className="text-xs font-black uppercase tracking-wider text-amber-300">
                            24-Hour Countdown Mode (Never Auto-Resets)
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                            PROTECTED
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          The homepage countdown displays the 24-Hour VIP Registration Window. Website auto-reset is permanently disabled—the timer and all website edits will never reset or wipe when delegates refresh or reload the page.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          requestConfirmation(
                            "Manual 24-Hour Timer Restart",
                            "Do you want to manually start a brand new 24-hour cycle from this exact moment? All other website settings and content remain permanently intact.",
                            () => {
                              const newTarget = Date.now() + 24 * 60 * 60 * 1000;
                              try {
                                localStorage.setItem('recon_expo_24h_countdown_target_v1', String(newTarget));
                              } catch {}
                              window.dispatchEvent(new CustomEvent('recon_manual_reset_24h_timer', { detail: { targetMs: newTarget } }));
                              showToast("24-Hour Registration Countdown restarted from 24:00:00 (Auto-reset remains disabled).");
                            }
                          );
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-extrabold text-xs whitespace-nowrap transition-all cursor-pointer flex items-center gap-2"
                        title="Manually restart the 24-hour countdown window"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                        <span>Manual 24-Hour Restart</span>
                      </button>
                    </div>
                  </div>

                  {/* Venue & Contact */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                      Venue Location & Secretariat Contacts
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Venue Name</label>
                        <input
                          type="text"
                          value={expoDetails.venue}
                          onChange={(e) => updateExpoDetails({ venue: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Venue Detailed Address</label>
                        <input
                          type="text"
                          value={expoDetails.venueAddress}
                          onChange={(e) => updateExpoDetails({ venueAddress: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Contact Email</label>
                        <input
                          type="email"
                          value={expoDetails.contactEmail}
                          onChange={(e) => updateExpoDetails({ contactEmail: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Phone Line 1 (Organizing Secretariat)</label>
                        <input
                          type="text"
                          value={expoDetails.contactPhone}
                          onChange={(e) => updateExpoDetails({ contactPhone: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Phone Line 2 (Delegate & VIP Desk)</label>
                        <input
                          type="text"
                          value={expoDetails.contactPhone2}
                          onChange={(e) => updateExpoDetails({ contactPhone2: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Phone Line 3 (Exhibitions & Stands)</label>
                        <input
                          type="text"
                          value={expoDetails.contactPhone3 || ''}
                          placeholder="+234 802 345 6789"
                          onChange={(e) => updateExpoDetails({ contactPhone3: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Phone Line 4 (Sponsorships & Partners)</label>
                        <input
                          type="text"
                          value={expoDetails.contactPhone4 || ''}
                          placeholder="+234 818 765 4321"
                          onChange={(e) => updateExpoDetails({ contactPhone4: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                      <div className="sm:col-span-2 bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 mt-1">
                        <label className="block text-xs font-bold text-emerald-300 mb-1">WhatsApp Support Number (Floating Chat Widget)</label>
                        <input
                          type="text"
                          value={expoDetails.whatsapp || ''}
                          placeholder="+234 803 982 7711"
                          onChange={(e) => updateExpoDetails({ whatsapp: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-emerald-400/40 text-emerald-200 text-xs font-mono font-bold focus:outline-none focus:border-emerald-400"
                        />
                        <p className="text-[10px] text-emerald-400/80 mt-1">This number powers the floating WhatsApp support button on the bottom right corner of the website.</p>
                      </div>
                    </div>
                  </div>

                  {/* Key Stats Counter Numbers */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                      Live Metric Counter Numbers
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Attendees Target</label>
                        <input
                          type="text"
                          value={expoDetails.stats.attendees}
                          onChange={(e) => updateExpoDetails({ stats: { ...expoDetails.stats, attendees: e.target.value } })}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Exhibitors Target</label>
                        <input
                          type="text"
                          value={expoDetails.stats.exhibitors}
                          onChange={(e) => updateExpoDetails({ stats: { ...expoDetails.stats, exhibitors: e.target.value } })}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Speakers</label>
                        <input
                          type="text"
                          value={expoDetails.stats.speakers}
                          onChange={(e) => updateExpoDetails({ stats: { ...expoDetails.stats, speakers: e.target.value } })}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Countries</label>
                        <input
                          type="text"
                          value={expoDetails.stats.countries}
                          onChange={(e) => updateExpoDetails({ stats: { ...expoDetails.stats, countries: e.target.value } })}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Deals Projected</label>
                        <input
                          type="text"
                          value={expoDetails.stats.dealsProjected}
                          onChange={(e) => updateExpoDetails({ stats: { ...expoDetails.stats, dealsProjected: e.target.value } })}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">B2B Meetings</label>
                        <input
                          type="text"
                          value={expoDetails.stats.b2bMeetings}
                          onChange={(e) => updateExpoDetails({ stats: { ...expoDetails.stats, b2bMeetings: e.target.value } })}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Official Conference Schedule PDF Management */}
                  <PdfUploadInput
                    currentPdfUrl={expoDetails.programmePdfUrl}
                    currentPdfName={expoDetails.programmePdfName}
                    currentPdfSize={expoDetails.programmePdfSize}
                    currentPdfUpdatedAt={expoDetails.programmePdfUpdatedAt}
                    onPdfChange={(pdfData) => {
                      updateExpoDetails({
                        programmePdfUrl: pdfData ? pdfData.url : undefined,
                        programmePdfName: pdfData ? pdfData.name : undefined,
                        programmePdfSize: pdfData ? pdfData.size : undefined,
                        programmePdfUpdatedAt: pdfData ? pdfData.updatedAt : undefined
                      });
                      if (pdfData) {
                        showToast("Full Conference Schedule PDF updated successfully!");
                      } else {
                        showToast("Custom PDF removed. Reverted to dynamic schedule generator.");
                      }
                    }}
                    onGenerateDefaultPdf={async () => {
                      showToast(`Generating dynamic ${expoDetails.totalEventDays || 2}-day schedule PDF preview...`);
                      await generateProgrammePdf({ sessions, expoDetails });
                      showToast("Schedule PDF preview downloaded!");
                    }}
                    onSyncLivePdf={() => {
                      try {
                        const { dataUri, sizeFormatted, name } = generateProgrammePdfDataUri({ sessions, expoDetails });
                        const now = new Date().toLocaleString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric',
                          hour: '2-digit', 
                          minute: '2-digit' 
                        });
                        updateExpoDetails({
                          programmePdfUrl: dataUri,
                          programmePdfName: name,
                          programmePdfSize: sizeFormatted,
                          programmePdfUpdatedAt: now
                        });
                        showToast("Live database compiled & saved as the active Conference Schedule PDF!");
                      } catch (err) {
                        console.error('Failed to sync live PDF:', err);
                        showToast("Failed to compile live PDF. Please try again.");
                      }
                    }}
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={() => showToast("Event details saved successfully!")}
                      className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save & Apply Changes</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 2.5: ID CARD CUSTOMIZER */}
              {/* ========================================================= */}
              {activeTab === 'id_card' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-amber-400" />
                        <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                          Smart ID Card & Accreditation Customizer
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-black uppercase tracking-wider">
                          Real-Time Live
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Customize all text, vertical banner branding, security ribbons, back-side Wi-Fi rules, and badge titles printed on official attendee ID cards.
                      </p>
                    </div>

                    {isMainAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          updateExpoDetails({
                            idCard: {
                              verticalBannerText: "8th Real Estate & Construction Expo",
                              headerTitle: "RECON EXPO",
                              headerSubtitle: "REAL ESTATE & CONSTRUCTION EXPO",
                              securityRibbonTop: "RECON EXPO 2026 • OFFICIAL ACCREDITATION • ABUJA NIGERIA • INTERNATIONAL DELEGATE •",
                              securityRibbonBottom: "SECURE SMART BADGE • RFID/NFC ACTIVATED • VERIFIED CREDENTIALS •",
                              backConciergeHeader: "INTERNATIONAL DELEGATE CONCIERGE & PROTOCOL",
                              wifiSsid: "RECON2026_GUEST",
                              backRule1: "1. This digital smart badge must remain visibly worn around the neck throughout exhibition pavilions, plenary halls, and B2B deal rooms.",
                              backRule2: "2. Tap your badge or present your QR code at sponsor booths to receive instant digital project brochures and investment prospectuses.",
                              backRule3: "3. This pass is strictly non-transferable. Valid government-issued photo identification may be requested at security checkpoints.",
                              secretariatHelpline: "Secretariat Support & Emergency Desk",
                              badgePassTypeLabels: {
                                elite: "★ ELITE GUEST VIP PASS ★",
                                press: "📸 PRESS & MEDIA CORPS PASS",
                                official: "🏛️ OFFICIAL ORGANIZER PASS",
                                security: "🛡️ SECURITY & PROTOCOL PASS",
                                crew: "🛠️ TECHNICAL CREW PASS",
                                medical: "🚑 MEDICAL & FIRST RESPONDER PASS",
                                sponsor: "SUMMIT SPONSOR PASS",
                                partner: "STRATEGIC PARTNER PASS",
                                exhibitor: "EXHIBITOR BOOTH PASS",
                                visitor: "VISITOR PASS"
                              }
                            }
                          });
                          showToast("ID Card text reset to default RECON Expo layout.");
                        }}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                        <span>Reset Card Defaults</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* LEFT COLUMN: FORM CONTROLS (7 cols) */}
                    <div className="lg:col-span-7 space-y-5">
                      
                      {/* Section 1: Front Side Vertical Banner & Ribbons */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm border-b border-white/10 pb-2">
                          <Sparkles className="w-4 h-4" />
                          <span>Front Side Vertical Text & Security Ribbons</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Vertical Right-Side Text (Colorful & Faded)
                          </label>
                          <input
                            type="text"
                            value={expoDetails.idCard?.verticalBannerText || ''}
                            onChange={(e) => updateExpoDetails({
                              idCard: { ...expoDetails.idCard, verticalBannerText: e.target.value }
                            })}
                            placeholder="e.g. 8th Real Estate & Construction Expo"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-emerald-500/30 text-emerald-300 text-xs font-semibold focus:outline-none focus:border-emerald-400"
                          />
                          <p className="text-[10px] text-slate-400 mt-1">
                            Rotated 90° along the right edge of the ID card in colorful gradient text.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">
                              Guilloche Top Security Ticker Text
                            </label>
                            <input
                              type="text"
                              value={expoDetails.idCard?.securityRibbonTop || ''}
                              onChange={(e) => updateExpoDetails({
                                idCard: { ...expoDetails.idCard, securityRibbonTop: e.target.value }
                              })}
                              className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-slate-200 text-xs font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">
                              Guilloche Bottom Security Ticker Text
                            </label>
                            <input
                              type="text"
                              value={expoDetails.idCard?.securityRibbonBottom || ''}
                              onChange={(e) => updateExpoDetails({
                                idCard: { ...expoDetails.idCard, securityRibbonBottom: e.target.value }
                              })}
                              className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-slate-200 text-xs font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Back Side Concierge, Wi-Fi & Protocol Rules */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm border-b border-white/10 pb-2">
                          <Building2 className="w-4 h-4" />
                          <span>Back Side Concierge, Wi-Fi & Instructions</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">
                              Back Header Banner
                            </label>
                            <input
                              type="text"
                              value={expoDetails.idCard?.backConciergeHeader || ''}
                              onChange={(e) => updateExpoDetails({
                                idCard: { ...expoDetails.idCard, backConciergeHeader: e.target.value }
                              })}
                              className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-slate-200 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">
                              Summit Wi-Fi Network Name (SSID)
                            </label>
                            <input
                              type="text"
                              value={expoDetails.idCard?.wifiSsid || ''}
                              onChange={(e) => updateExpoDetails({
                                idCard: { ...expoDetails.idCard, wifiSsid: e.target.value }
                              })}
                              className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-emerald-300 text-xs font-mono font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Protocol Instruction Rule 1
                          </label>
                          <textarea
                            rows={2}
                            value={expoDetails.idCard?.backRule1 || ''}
                            onChange={(e) => updateExpoDetails({
                              idCard: { ...expoDetails.idCard, backRule1: e.target.value }
                            })}
                            className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-slate-200 text-xs leading-relaxed"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Protocol Instruction Rule 2
                          </label>
                          <textarea
                            rows={2}
                            value={expoDetails.idCard?.backRule2 || ''}
                            onChange={(e) => updateExpoDetails({
                              idCard: { ...expoDetails.idCard, backRule2: e.target.value }
                            })}
                            className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-slate-200 text-xs leading-relaxed"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Protocol Instruction Rule 3
                          </label>
                          <textarea
                            rows={2}
                            value={expoDetails.idCard?.backRule3 || ''}
                            onChange={(e) => updateExpoDetails({
                              idCard: { ...expoDetails.idCard, backRule3: e.target.value }
                            })}
                            className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-slate-200 text-xs leading-relaxed"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Secretariat Support Desk Label
                          </label>
                          <input
                            type="text"
                            value={expoDetails.idCard?.secretariatHelpline || ''}
                            onChange={(e) => updateExpoDetails({
                              idCard: { ...expoDetails.idCard, secretariatHelpline: e.target.value }
                            })}
                            className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-slate-200 text-xs"
                          />
                        </div>
                      </div>

                      {/* Section 3: Pass Type Banner Labels */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                        <div className="flex items-center gap-2 text-purple-400 font-bold text-sm border-b border-white/10 pb-2">
                          <Award className="w-4 h-4" />
                          <span>Special Personnel Badge Type Banner Labels</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block font-bold text-slate-300 mb-1">📸 Press & Media Label</label>
                            <input
                              type="text"
                              value={expoDetails.idCard?.badgePassTypeLabels?.press || '📸 PRESS & MEDIA CORPS PASS'}
                              onChange={(e) => updateExpoDetails({
                                idCard: {
                                  ...expoDetails.idCard,
                                  badgePassTypeLabels: {
                                    ...expoDetails.idCard?.badgePassTypeLabels,
                                    press: e.target.value
                                  }
                                }
                              })}
                              className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/15 text-slate-200 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-300 mb-1">🏛️ Official Organizer Label</label>
                            <input
                              type="text"
                              value={expoDetails.idCard?.badgePassTypeLabels?.official || '🏛️ OFFICIAL ORGANIZER PASS'}
                              onChange={(e) => updateExpoDetails({
                                idCard: {
                                  ...expoDetails.idCard,
                                  badgePassTypeLabels: {
                                    ...expoDetails.idCard?.badgePassTypeLabels,
                                    official: e.target.value
                                  }
                                }
                              })}
                              className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/15 text-slate-200 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-300 mb-1">🛡️ Security Protocol Label</label>
                            <input
                              type="text"
                              value={expoDetails.idCard?.badgePassTypeLabels?.security || '🛡️ SECURITY & PROTOCOL PASS'}
                              onChange={(e) => updateExpoDetails({
                                idCard: {
                                  ...expoDetails.idCard,
                                  badgePassTypeLabels: {
                                    ...expoDetails.idCard?.badgePassTypeLabels,
                                    security: e.target.value
                                  }
                                }
                              })}
                              className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/15 text-slate-200 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-300 mb-1">★ Elite / VIP Label</label>
                            <input
                              type="text"
                              value={expoDetails.idCard?.badgePassTypeLabels?.elite || '★ ELITE GUEST VIP PASS ★'}
                              onChange={(e) => updateExpoDetails({
                                idCard: {
                                  ...expoDetails.idCard,
                                  badgePassTypeLabels: {
                                    ...expoDetails.idCard?.badgePassTypeLabels,
                                    elite: e.target.value
                                  }
                                }
                              })}
                              className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/15 text-slate-200 text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => showToast("ID Card configuration updated & live!")}
                          className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save ID Card Settings</span>
                        </button>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: REAL-TIME LIVE ID CARD PREVIEW (5 cols) */}
                    <div className="lg:col-span-5 sticky top-2 space-y-3 bg-[#01140e] border border-emerald-500/30 rounded-3xl p-4 shadow-2xl">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                          <h3 className="text-sm font-black text-white font-display uppercase tracking-wider">
                            Live ID Card Preview
                          </h3>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Updates as you type
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400">
                        Test how your vertical text, logo, security ribbons, and protocol rules render on actual delegate badges:
                      </p>

                      {/* Pass Category Switcher Tabs */}
                      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-black/40 border border-white/10">
                        <button
                          type="button"
                          onClick={() => setPreviewPassType('visitor')}
                          className={`flex-1 min-w-[70px] py-1.5 px-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                            previewPassType === 'visitor'
                              ? 'bg-sky-500 text-slate-950 shadow-md font-black'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Visitor
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewPassType('exhibitor')}
                          className={`flex-1 min-w-[70px] py-1.5 px-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                            previewPassType === 'exhibitor'
                              ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Exhibitor
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewPassType('elite')}
                          className={`flex-1 min-w-[70px] py-1.5 px-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                            previewPassType === 'elite'
                              ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Elite VIP
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewPassType('press')}
                          className={`flex-1 min-w-[70px] py-1.5 px-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                            previewPassType === 'press'
                              ? 'bg-fuchsia-500 text-white shadow-md font-black'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Press
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewPassType('sponsor')}
                          className={`flex-1 min-w-[70px] py-1.5 px-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                            previewPassType === 'sponsor'
                              ? 'bg-red-500 text-white shadow-md font-black'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Sponsor
                        </button>
                      </div>

                      {/* Render Smart ID Card Component */}
                      <div className="w-full flex justify-center py-4 px-4 sm:px-6 bg-[#01140e] border border-white/10 rounded-3xl shadow-2xl">
                        <SmartIdCard
                          ticket={{
                            ticketNumber: `RECON-2026-${previewPassType.toUpperCase()}-8842`,
                            tier: previewPassType === 'visitor' 
                              ? (expoDetails.idCard?.badgePassTypeLabels?.visitor || 'VISITOR PASS (FREE ADMISSION)')
                              : previewPassType === 'exhibitor'
                              ? (expoDetails.idCard?.badgePassTypeLabels?.exhibitor || 'EXHIBITOR PASS')
                              : previewPassType === 'elite'
                              ? (expoDetails.idCard?.badgePassTypeLabels?.elite || '★ ELITE GUEST VIP PASS ★')
                              : previewPassType === 'press'
                              ? (expoDetails.idCard?.badgePassTypeLabels?.press || '📸 PRESS & MEDIA CORPS PASS')
                              : (expoDetails.idCard?.badgePassTypeLabels?.sponsor || 'SUMMIT SPONSOR PASS'),
                            passType: previewPassType,
                            fullName: 'Engr. Fatima Bello',
                            email: 'fatima.bello@reconstruction.ng',
                            organization: 'Abuja Urban Development Authority',
                            role: previewPassType === 'visitor' ? 'Registered Visitor' : previewPassType === 'exhibitor' ? 'Lead Exhibitor' : previewPassType === 'elite' ? 'Keynote VIP Delegate' : previewPassType === 'press' ? 'Chief Photojournalist' : 'Summit Sponsor Director',
                            phone: '+234 803 456 7890',
                            city: 'Abuja (FCT)',
                            photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
                            registeredAt: new Date().toISOString(),
                            accessDays: 'Full Expo Pass',
                            qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=RECON-2026-8842',
                            barcode: `RECON26${previewPassType.toUpperCase()}8842`,
                            amountPaid: previewPassType === 'visitor' ? 'Free' : '₦150,000',
                            paymentStatus: 'VERIFIED',
                            adminApproved: true,
                            adminApprovalStatus: 'APPROVED'
                          }}
                          isAdmin={true}
                        />
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 3: HERO & PAST EXHIBITIONS SLIDESHOW */}
              {/* ========================================================= */}
              {activeTab === 'hero' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white font-display">Hero Background Photo Carousel</h2>
                      <p className="text-xs text-slate-400">
                        Manage past Nigerian real estate exhibition photographs, captions, location badges, and kinetic transitions.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsAddingSlide(true)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Exhibition Photo</span>
                    </button>
                  </div>

                  {/* Add / Edit Slide Form Modal */}
                  {(isAddingSlide || editingSlide) && (
                    <div className="p-5 rounded-2xl bg-black/60 border border-emerald-500/40 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-emerald-400">
                          {editingSlide ? 'Edit Exhibition Slide' : 'Add New Exhibition Photo'}
                        </h3>
                        <button
                          onClick={() => {
                            setIsAddingSlide(false);
                            setEditingSlide(null);
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const form = e.currentTarget;
                          const formData = new FormData(form);
                          const slideData: HeroBackgroundSlide = {
                            url: formData.get('url') as string,
                            title: formData.get('title') as string,
                            city: formData.get('city') as string,
                            edition: formData.get('edition') as string,
                            description: formData.get('description') as string,
                            transitionEffect: (formData.get('transitionEffect') as string) || 'scale-110 translate-x-3 duration-[2400ms]'
                          };

                          if (editingSlide) {
                            editHeroSlide(editingSlide.index, slideData);
                            showToast("Slide updated successfully!");
                          } else {
                            addHeroSlide(slideData);
                            showToast("New exhibition photo added to hero carousel!");
                          }
                          setIsAddingSlide(false);
                          setEditingSlide(null);
                        }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs"
                      >
                        <div className="sm:col-span-2">
                          <ImageUploadInput
                            name="url"
                            initialValue={editingSlide?.slide.url || ''}
                            label="Exhibition Slide Photo (Upload File)"
                            placeholder="Select or drag high-resolution exhibition photo file"
                            maxWidth={1400}
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Caption / Event Title</label>
                          <input
                            name="title"
                            type="text"
                            required
                            defaultValue={editingSlide?.slide.title || ''}
                            placeholder="e.g. Nigerian Developers & Investors Strategy Panel"
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">City / Venue Badge</label>
                          <input
                            name="city"
                            type="text"
                            required
                            defaultValue={editingSlide?.slide.city || ''}
                            placeholder="e.g. Shehu Musa Yar’Adua Centre, Abuja"
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Edition Tag</label>
                          <input
                            name="edition"
                            type="text"
                            required
                            defaultValue={editingSlide?.slide.edition || ''}
                            placeholder="e.g. RECON Plenary & Policy Dialogue"
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Kinetic Transition Class</label>
                          <input
                            name="transitionEffect"
                            type="text"
                            defaultValue={editingSlide?.slide.transitionEffect || 'scale-110 translate-x-3 duration-[2400ms]'}
                            placeholder="scale-115 -translate-y-2 duration-[2400ms]"
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-[11px]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-bold text-slate-300 mb-1">Description</label>
                          <input
                            name="description"
                            type="text"
                            defaultValue={editingSlide?.slide.description || ''}
                            placeholder="Black Nigerian property executives and sovereign fund managers in keynote discussions"
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          />
                        </div>

                        <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingSlide(false);
                              setEditingSlide(null);
                            }}
                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold"
                          >
                            {editingSlide ? 'Update Slide' : 'Add Slide'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Slides List Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {heroSlides.map((slide, idx) => (
                      <div
                        key={idx}
                        className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex flex-col"
                      >
                        <div className="h-40 w-full relative overflow-hidden bg-black/50">
                          <img
                            src={slide.url}
                            alt={slide.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-emerald-300 border border-emerald-400/30">
                            {slide.city}
                          </span>
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-white">
                            Slide #{idx + 1}
                          </span>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-white text-xs line-clamp-1">{slide.title}</h4>
                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{slide.description}</p>
                          </div>

                          <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10 text-xs">
                            <span className="text-[10px] text-slate-500 font-mono truncate max-w-[120px]">
                              {slide.edition}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => setEditingSlide({ index: idx, slide })}
                                className="p-1.5 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-emerald-950 text-slate-300 transition-colors cursor-pointer"
                                title="Edit Slide"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              {(isMainAdmin || canDelete) && (
                                <button
                                  onClick={() => {
                                    if (heroSlides.length <= 1) {
                                      showToast("You must keep at least 1 hero background slide.");
                                      return;
                                    }
                                    requestConfirmation(
                                      "Delete Hero Slide",
                                      "Delete this exhibition background slide?",
                                      () => {
                                        deleteHeroSlide(idx);
                                        showToast("Slide removed.");
                                      }
                                    );
                                  }}
                                  className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500 hover:text-white text-slate-300 transition-colors cursor-pointer"
                                  title="Delete Slide"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 4: SPEAKERS & KEYNOTES */}
              {/* ========================================================= */}
              {activeTab === 'speakers' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white font-display">Speakers & Industry Leaders</h2>
                      <p className="text-xs text-slate-400">
                        Add, edit, or remove keynote chairs, panelists, architects, and sovereign investment executives.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search speaker..."
                          value={speakerSearch}
                          onChange={(e) => setSpeakerSearch(e.target.value)}
                          className="pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                        />
                      </div>

                      {isMainAdmin ? (
                        <button
                          onClick={() => setIsAddingSpeaker(true)}
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Speaker</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-400" />
                          <span>Adding Speakers Restricted to Super Admin</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add / Edit Speaker Modal Form */}
                  {(isAddingSpeaker || editingSpeaker) && (
                    <div className="p-5 rounded-2xl bg-black/70 border border-emerald-500/40 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-emerald-400">
                          {editingSpeaker ? `Edit Profile: ${editingSpeaker.name}` : 'Add New Speaker'}
                        </h3>
                        <button
                          onClick={() => {
                            setIsAddingSpeaker(false);
                            setEditingSpeaker(null);
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const form = e.currentTarget;
                          const formData = new FormData(form);
                          const spkData = {
                            name: formData.get('name') as string,
                            title: formData.get('title') as string,
                            organization: formData.get('organization') as string,
                            topic: formData.get('topic') as string,
                            track: formData.get('track') as any,
                            keynote: formData.get('keynote') === 'true',
                            image: formData.get('image') as string,
                            bio: formData.get('bio') as string,
                            fullBio: formData.get('fullBio') as string,
                            linkedin: formData.get('linkedin') as string,
                            twitter: formData.get('twitter') as string,
                          };

                          if (editingSpeaker) {
                            editSpeaker(editingSpeaker.id, spkData);
                            showToast("Speaker profile updated!");
                          } else {
                            addSpeaker(spkData);
                            showToast("New speaker added successfully!");
                          }
                          setIsAddingSpeaker(false);
                          setEditingSpeaker(null);
                        }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs"
                      >
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Full Name & Honorific</label>
                          <input
                            name="name"
                            type="text"
                            required
                            defaultValue={editingSpeaker?.name || ''}
                            placeholder="e.g. Arc. Babatunde Sanusi, FNIA"
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Job Title / Designation</label>
                          <input
                            name="title"
                            type="text"
                            required
                            defaultValue={editingSpeaker?.title || ''}
                            placeholder="e.g. President & Advisory Council Chair"
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Company / Organization</label>
                          <input
                            name="organization"
                            type="text"
                            required
                            defaultValue={editingSpeaker?.organization || ''}
                            placeholder="e.g. Nigerian Infrastructure & Urban Development Council"
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <ImageUploadInput
                            name="image"
                            initialValue={editingSpeaker?.image || ''}
                            label={editingSpeaker?.keynote ? "Keynote Chair Headshot (Upload & Crop)" : "Keynote / Panelist Photo (Upload & Crop)"}
                            placeholder="Select or drag executive speaker headshot photo to frame & crop"
                            maxWidth={800}
                            enableCrop={true}
                            cropAspectRatio="1:1"
                            cropTitle={editingSpeaker?.keynote ? "Crop & Frame Keynote Chair Headshot" : "Crop & Frame Keynote / Panelist Headshot"}
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Conference Track</label>
                          <select
                            name="track"
                            defaultValue={editingSpeaker?.track || 'Strategy'}
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          >
                            <option value="Strategy">Strategy</option>
                            <option value="Investment">Investment</option>
                            <option value="Technology">Technology</option>
                            <option value="Architecture">Architecture</option>
                            <option value="Policy">Policy</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Keynote Speaker Status</label>
                          <select
                            name="keynote"
                            defaultValue={editingSpeaker?.keynote ? 'true' : 'false'}
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          >
                            <option value="true">Yes, Highlighted Keynote Chair</option>
                            <option value="false">No, Regular Panelist / Speaker</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-bold text-slate-300 mb-1">Presentation / Keynote Topic</label>
                          <input
                            name="topic"
                            type="text"
                            required
                            defaultValue={editingSpeaker?.topic || ''}
                            placeholder="e.g. Smart Urban Planning, Master Development & Sustainable Real Estate in Abuja 2030"
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-bold text-slate-300 mb-1">Short Bio</label>
                          <textarea
                            name="bio"
                            rows={2}
                            required
                            defaultValue={editingSpeaker?.bio || ''}
                            placeholder="Brief 1-2 sentence bio for speaker card..."
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-bold text-slate-300 mb-1">Extended Full Biography</label>
                          <textarea
                            name="fullBio"
                            rows={3}
                            defaultValue={editingSpeaker?.fullBio || ''}
                            placeholder="Full detailed professional biography for modal view..."
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">LinkedIn URL (Optional)</label>
                          <input
                            name="linkedin"
                            type="url"
                            defaultValue={editingSpeaker?.linkedin || ''}
                            placeholder="https://linkedin.com/in/..."
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Twitter / X URL (Optional)</label>
                          <input
                            name="twitter"
                            type="url"
                            defaultValue={editingSpeaker?.twitter || ''}
                            placeholder="https://twitter.com/..."
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          />
                        </div>

                        <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingSpeaker(false);
                              setEditingSpeaker(null);
                            }}
                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold"
                          >
                            {editingSpeaker ? 'Save Profile' : 'Add Speaker'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Speakers Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {speakers
                      .filter(s => 
                        s.name.toLowerCase().includes(speakerSearch.toLowerCase()) ||
                        s.organization.toLowerCase().includes(speakerSearch.toLowerCase()) ||
                        s.topic.toLowerCase().includes(speakerSearch.toLowerCase())
                      )
                      .map((speaker) => (
                        <div
                          key={speaker.id}
                          className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between group hover:border-emerald-500/30 transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <img
                              src={speaker.image}
                              alt={speaker.name}
                              referrerPolicy="no-referrer"
                              className="w-14 h-14 rounded-xl object-cover border border-white/20 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  {speaker.track}
                                </span>
                                {speaker.keynote && (
                                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-600 text-white">
                                    Keynote
                                  </span>
                                )}
                              </div>
                              <h4 className="font-bold text-white text-xs truncate mt-1">{speaker.name}</h4>
                              <p className="text-[11px] text-slate-400 truncate">{speaker.title}</p>
                              <p className="text-[10px] text-slate-500 truncate">{speaker.organization}</p>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                            <p className="text-[10px] text-emerald-300 line-clamp-1 italic">
                              "{speaker.topic}"
                            </p>
                            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                              {(isMainAdmin || canDelete) && (
                                <>
                                  <button
                                    onClick={() => setCroppingSpeaker(speaker)}
                                    className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 hover:text-emerald-950 text-emerald-300 transition-colors cursor-pointer border border-emerald-500/30"
                                    title={`Crop & Frame ${speaker.keynote ? 'Keynote Chair' : 'Panelist'} Photo`}
                                  >
                                    <Crop className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setEditingSpeaker(speaker)}
                                    className="p-1.5 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-emerald-950 text-slate-300 transition-colors cursor-pointer"
                                    title="Edit Speaker"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      requestConfirmation(
                                        "Delete Speaker",
                                        `Remove speaker ${speaker.name}?`,
                                        () => {
                                          deleteSpeaker(speaker.id);
                                          showToast("Speaker removed.");
                                        }
                                      );
                                    }}
                                    className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500 hover:text-white text-slate-300 transition-colors cursor-pointer"
                                    title="Delete Speaker"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Quick Crop Modal for Keynote & Panelist from Speakers List */}
                  {croppingSpeaker && (
                    <ImageCropModal
                      isOpen={!!croppingSpeaker}
                      imageUrl={croppingSpeaker.image}
                      title={`Crop & Frame ${croppingSpeaker.keynote ? 'Keynote Chair' : 'Panelist'} Photo: ${croppingSpeaker.name}`}
                      aspectRatio="1:1"
                      outputMaxWidth={800}
                      onApplyCrop={(croppedUrl) => {
                        editSpeaker(croppingSpeaker.id, {
                          ...croppingSpeaker,
                          image: croppedUrl
                        });
                        showToast(`${croppingSpeaker.keynote ? 'Keynote Chair' : 'Panelist'} photo cropped and updated!`);
                        setCroppingSpeaker(null);
                      }}
                      onClose={() => setCroppingSpeaker(null)}
                    />
                  )}
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 5: PROGRAMME SESSIONS */}
              {/* ========================================================= */}
              {activeTab === 'programme' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white font-display">Expo Programme Schedule</h2>
                      <p className="text-xs text-slate-400">
                        Manage plenary keynotes, breakout panels, exhibition tours, PropTech demos, and upload the official printable Full Conference Schedule (PDF).
                      </p>
                    </div>

                    {isMainAdmin ? (
                      <button
                        onClick={() => setIsAddingSession(true)}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Session</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-400" />
                        <span>Adding Sessions Restricted to Super Admin</span>
                      </span>
                    )}
                  </div>

                  {/* PDF Upload Management Card */}
                  {isMainAdmin ? (
                    <PdfUploadInput
                      currentPdfUrl={expoDetails.programmePdfUrl}
                      currentPdfName={expoDetails.programmePdfName}
                      currentPdfSize={expoDetails.programmePdfSize}
                      currentPdfUpdatedAt={expoDetails.programmePdfUpdatedAt}
                      onPdfChange={(pdfData) => {
                        updateExpoDetails({
                          programmePdfUrl: pdfData ? pdfData.url : undefined,
                          programmePdfName: pdfData ? pdfData.name : undefined,
                          programmePdfSize: pdfData ? pdfData.size : undefined,
                          programmePdfUpdatedAt: pdfData ? pdfData.updatedAt : undefined
                        });
                        if (pdfData) {
                          showToast("Full Conference Schedule PDF updated successfully!");
                        } else {
                          showToast("Custom PDF removed. Reverted to automatic schedule generator.");
                        }
                      }}
                      onGenerateDefaultPdf={async () => {
                        showToast("Generating dynamic schedule PDF test...");
                        await generateProgrammePdf({ sessions, expoDetails });
                        showToast("Auto-generated PDF downloaded for testing!");
                      }}
                      onSyncLivePdf={() => {
                        try {
                          const { dataUri, sizeFormatted, name } = generateProgrammePdfDataUri({ sessions, expoDetails });
                          const now = new Date().toLocaleString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric',
                            hour: '2-digit', 
                            minute: '2-digit' 
                          });
                          updateExpoDetails({
                            programmePdfUrl: dataUri,
                            programmePdfName: name,
                            programmePdfSize: sizeFormatted,
                            programmePdfUpdatedAt: now
                          });
                          showToast("Live database compiled & saved as the active Conference Schedule PDF!");
                        } catch (err) {
                          console.error('Failed to sync live PDF:', err);
                          showToast("Failed to compile live PDF. Please try again.");
                        }
                      }}
                    />
                  ) : (
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs text-slate-300 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-emerald-400" />
                        <span>
                          Schedule PDF: <strong>{expoDetails.programmePdfName || 'Built-in Dynamic Schedule'}</strong>
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-400" />
                        <span>PDF Schedule Upload Restricted to Super Admin</span>
                      </span>
                    </div>
                  )}

                  {/* Day Filter Tabs & Dynamic Day Management Bar */}
                  {(() => {
                    const maxSessionDay = Math.max(...sessions.map(s => Number(s.day) || 1), 1);
                    const targetDaysCount = Math.max(expoDetails.totalEventDays || 2, maxSessionDay);
                    const adminDaysList = Array.from({ length: targetDaysCount }, (_, i) => i + 1);

                    return (
                      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-black/50 rounded-2xl border border-white/10 shadow-lg">
                        <div className="flex flex-wrap items-center gap-2">
                          {adminDaysList.map((dayNum) => {
                            const daySessions = sessions.filter(s => (Number(s.day) || 1) === dayNum);
                            return (
                              <button
                                key={dayNum}
                                onClick={() => setSessionDayFilter(dayNum)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                                  sessionDayFilter === dayNum
                                    ? 'bg-emerald-500 text-emerald-950 shadow-md font-extrabold scale-105'
                                    : 'text-slate-300 hover:text-white bg-white/5 hover:bg-white/10'
                                }`}
                              >
                                <span>Day {dayNum}</span>
                                <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-black/20 text-emerald-950 font-bold">
                                  {daySessions.length} sessions
                                </span>
                              </button>
                            );
                          })}

                          {/* Add New Day Button */}
                          <button
                            type="button"
                            onClick={() => {
                              const nextDayNum = adminDaysList.length + 1;
                              const newDayDate = `Day ${nextDayNum} Date`;
                              updateExpoDetails({ totalEventDays: nextDayNum });
                              addSession({
                                day: nextDayNum,
                                date: newDayDate,
                                time: '10:00 AM – 11:30 AM',
                                title: `Day ${nextDayNum} Plenary Keynote & Exhibition Opening`,
                                description: `Keynote speeches, Tech Demonstrations, and B2B Deal Rooms for Day ${nextDayNum}.`,
                                category: 'Keynote',
                                location: 'Main Auditorium',
                                iconName: 'Building2',
                                featured: true
                              });
                              setSessionDayFilter(nextDayNum);
                              showToast(`Day ${nextDayNum} added to event duration & programme!`);
                            }}
                            className="px-3.5 py-2 rounded-xl text-xs font-black bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                            title="Add a new Day to the event duration & programme"
                          >
                            <Plus className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Add Day {adminDaysList.length + 1}</span>
                          </button>
                        </div>

                        {/* Remove Current Day Action */}
                        {(isMainAdmin || canDelete) && adminDaysList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              requestConfirmation(
                                `Delete Day ${sessionDayFilter}`,
                                `Are you sure you want to delete Day ${sessionDayFilter} and all its ${sessions.filter(s => s.day === sessionDayFilter).length} session(s)?`,
                                () => {
                                  const sessionsToDelete = sessions.filter(s => s.day === sessionDayFilter);
                                  sessionsToDelete.forEach(s => deleteSession(s.id));
                                  const remainingDays = adminDaysList.filter(d => d !== sessionDayFilter);
                                  setSessionDayFilter(remainingDays[0] || 1);
                                  showToast(`Day ${sessionDayFilter} and associated sessions deleted.`);
                                }
                              );
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all cursor-pointer flex items-center gap-1.5"
                            title={`Delete Day ${sessionDayFilter} and its sessions`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Day {sessionDayFilter}</span>
                          </button>
                        )}
                      </div>
                    );
                  })()}

                  {/* Add / Edit Session Modal Form */}
                  {(isAddingSession || editingSession) && (
                    <div className="p-5 rounded-2xl bg-black/70 border border-emerald-500/40 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-emerald-400">
                          {editingSession ? `Edit Session: ${editingSession.title}` : 'Add New Programme Session'}
                        </h3>
                        <button
                          onClick={() => {
                            setIsAddingSession(false);
                            setEditingSession(null);
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const form = e.currentTarget;
                          const formData = new FormData(form);
                          const sessData = {
                            day: Number(formData.get('day')),
                            date: formData.get('date') as string,
                            time: formData.get('time') as string,
                            title: formData.get('title') as string,
                            description: formData.get('description') as string,
                            category: formData.get('category') as any,
                            speakerName: formData.get('speakerName') as string,
                            speakerRole: formData.get('speakerRole') as string,
                            speakerImage: formData.get('speakerImage') as string,
                            location: formData.get('location') as string,
                            iconName: (formData.get('iconName') as string) || 'Building2',
                            featured: formData.get('featured') === 'true'
                          };

                          if (editingSession) {
                            editSession(editingSession.id, sessData);
                            showToast("Programme session updated!");
                          } else {
                            addSession(sessData);
                            showToast("New session added to programme!");
                          }
                          setIsAddingSession(false);
                          setEditingSession(null);
                        }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs"
                      >
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Expo Day</label>
                          <select
                            name="day"
                            defaultValue={editingSession?.day || sessionDayFilter}
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          >
                            {Array.from(new Set(sessions.map(s => Number(s.day) || 1))).sort((a: number, b: number) => a - b).map(d => (
                              <option key={d} value={d}>
                                Day {d}
                              </option>
                            ))}
                            <option value={Math.max(...sessions.map(s => Number(s.day) || 1), 0) + 1}>
                              ➕ Create New Day (Day {Math.max(...sessions.map(s => Number(s.day) || 1), 0) + 1})
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Date Text (e.g. Thursday, 29 October 2026)</label>
                          <input
                            name="date"
                            type="text"
                            required
                            defaultValue={editingSession?.date || sessions.find(s => s.day === sessionDayFilter)?.date || `Day ${sessionDayFilter} Date`}
                            placeholder="e.g. Friday, 30 October 2026"
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Time Slot</label>
                          <input
                            name="time"
                            type="text"
                            required
                            defaultValue={editingSession?.time || '10:00 AM – 11:30 AM'}
                            placeholder="e.g. 10:00 AM – 11:30 AM"
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-bold text-slate-300 mb-1">Session Title</label>
                          <input
                            name="title"
                            type="text"
                            required
                            defaultValue={editingSession?.title || ''}
                            placeholder="e.g. Macroeconomic Real Estate Outlook: Financing Mega-Projects in Nigeria"
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Category / Format</label>
                          <select
                            name="category"
                            defaultValue={editingSession?.category || 'Panel Discussion'}
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          >
                            <option value="Keynote">Keynote</option>
                            <option value="Panel Discussion">Panel Discussion</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Exhibition & Demo">Exhibition & Demo</option>
                            <option value="Networking">Networking</option>
                            <option value="Investor Pitch">Investor Pitch</option>
                            <option value="Awards">Awards</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Room / Hall Location</label>
                          <input
                            name="location"
                            type="text"
                            required
                            defaultValue={editingSession?.location || 'Main Auditorium'}
                            placeholder="e.g. Main Auditorium (Shehu Yar'Adua Hall)"
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Lead Speaker / Moderator Name</label>
                          <input
                            name="speakerName"
                            type="text"
                            defaultValue={editingSession?.speakerName || ''}
                            placeholder="e.g. Dr. Amina Bello Yusuf"
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Speaker Role / Company</label>
                          <input
                            name="speakerRole"
                            type="text"
                            defaultValue={editingSession?.speakerRole || ''}
                            placeholder="e.g. CEO, Apex Green Capital"
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <ImageUploadInput
                            name="speakerImage"
                            initialValue={editingSession?.speakerImage || ''}
                            label="Speaker / Panelist Headshot Photo (Upload & Crop)"
                            placeholder="Upload session presenter or panelist headshot photo"
                            maxWidth={800}
                            enableCrop={true}
                            cropAspectRatio="1:1"
                            cropTitle="Crop Speaker / Panelist Headshot"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Featured Flag</label>
                          <select
                            name="featured"
                            defaultValue={editingSession?.featured ? 'true' : 'false'}
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          >
                            <option value="false">Standard Session</option>
                            <option value="true">Featured Session (Highlighted)</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-bold text-slate-300 mb-1">Detailed Description</label>
                          <textarea
                            name="description"
                            rows={3}
                            required
                            defaultValue={editingSession?.description || ''}
                            placeholder="Full outline of session topics, panel themes, and delegate takeaways..."
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          />
                        </div>

                        <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingSession(false);
                              setEditingSession(null);
                            }}
                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold"
                          >
                            {editingSession ? 'Save Session' : 'Add Session'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Sessions List */}
                  <div className="space-y-3">
                    {sessions
                      .filter(s => s.day === sessionDayFilter)
                      .map((session) => (
                        <div
                          key={session.id}
                          className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                {session.time}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/10 text-slate-300">
                                {session.category}
                              </span>
                              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-red-400" />
                                {session.location}
                              </span>
                            </div>
                            <h4 className="font-bold text-white text-sm">{session.title}</h4>
                            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{session.description}</p>
                            {session.speakerName && (
                              <p className="text-[11px] text-emerald-400 mt-1">
                                Speaker: <span className="text-white font-medium">{session.speakerName}</span> ({session.speakerRole})
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0 self-end sm:self-center">
                            {(isMainAdmin || canDelete) && (
                              <>
                                <button
                                  onClick={() => setEditingSession(session)}
                                  className="p-2 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-emerald-950 text-slate-300 transition-colors cursor-pointer"
                                  title="Edit Session"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    requestConfirmation(
                                      "Delete Session",
                                      `Delete session "${session.title}"?`,
                                      () => {
                                        deleteSession(session.id);
                                        showToast("Session deleted.");
                                      }
                                    );
                                  }}
                                  className="p-2 rounded-xl bg-white/10 hover:bg-red-500 hover:text-white text-slate-300 transition-colors cursor-pointer"
                                  title="Delete Session"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 6: TIERS & BOOTH PACKAGES */}
              {/* ========================================================= */}
              {(activeTab === 'tiers' || activeTab === 'booth_packages') && (
                <div className="space-y-6">
                  {/* Tab Header with Sub-Navigation */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-white font-display flex items-center gap-2.5">
                        <Store className="w-5 h-5 text-emerald-400" />
                        <span>Registration Tiers & Exhibition Booth Packages</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Configure floor packages for Exhibitors to select during registration, and manage Delegate & VIP ticket tiers.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-black/50 p-1 rounded-2xl border border-white/10">
                      <button
                        type="button"
                        onClick={() => setTiersSubTab('booth_packages')}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                          tiersSubTab === 'booth_packages'
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-300'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Store className="w-4 h-4 flex-shrink-0" />
                        <span>Exhibition Booth Packages</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-black ${
                          tiersSubTab === 'booth_packages' ? 'bg-emerald-950 text-emerald-200' : 'bg-white/10 text-slate-300'
                        }`}>
                          {boothPackages.length}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTiersSubTab('registration_tiers')}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                          tiersSubTab === 'registration_tiers'
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-300'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Ticket className="w-4 h-4 flex-shrink-0" />
                        <span>Delegate & Visitor Tiers</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-black ${
                          tiersSubTab === 'registration_tiers' ? 'bg-emerald-950 text-emerald-200' : 'bg-white/10 text-slate-300'
                        }`}>
                          {tiers.length}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* SUB-TAB 1: EXHIBITION BOOTH PACKAGES */}
                  {tiersSubTab === 'booth_packages' && (
                    <div className="space-y-6">
                      {/* Top Action Bar & Stats Banner */}
                      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-black/60 border border-emerald-500/30">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                            <span className="text-[11px] text-slate-300">Total Packages:</span>
                            <span className="text-xs font-black font-mono text-emerald-400">{boothPackages.length}</span>
                          </div>
                          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                            <span className="text-[11px] text-slate-300">Active on Form:</span>
                            <span className="text-xs font-black font-mono text-emerald-300">
                              {boothPackages.filter(b => b.active !== false).length}
                            </span>
                          </div>
                          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
                            <span className="text-[11px] text-amber-200">Marketer Commission:</span>
                            <span className="text-xs font-black font-mono text-amber-300">10% Guaranteed</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('Reset booth packages to default RECON 2026 options (Standard 9sqm, Executive 18sqm, Island 36sqm, Custom)?')) {
                                DEFAULT_BOOTH_PACKAGES.forEach(def => {
                                  if (!boothPackages.some(b => b.id === def.id)) {
                                    addBoothPackage(def);
                                  } else {
                                    editBoothPackage(def.id, def);
                                  }
                                });
                                showToast('Default booth packages restored!');
                              }
                            }}
                            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all border border-white/10 flex items-center gap-1.5"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Restore Defaults</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setNewBoothForm({
                                id: `booth_${Date.now()}`,
                                name: '',
                                priceNGN: 450000,
                                priceFormatted: '₦450,000',
                                badges: 2,
                                commissionRate: 0.10,
                                desc: 'Includes shell scheme partitions, fascia nameboard, spotlights, 1 table, 2 chairs, 13A socket, 2 staff badges.',
                                active: true
                              });
                              setIsAddingBoothPackage(true);
                            }}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition-all"
                          >
                            <Plus className="w-4 h-4 stroke-[3]" />
                            <span>Add Booth Package</span>
                          </button>
                        </div>
                      </div>

                      {/* ADD NEW BOOTH PACKAGE MODAL / DRAWER */}
                      {isAddingBoothPackage && (
                        <div className="p-5 rounded-2xl bg-black/80 border-2 border-emerald-500/50 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
                          <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <div>
                              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Plus className="w-4 h-4 text-emerald-400" />
                                <span>Create New Exhibition Booth Stand Package</span>
                              </h3>
                              <p className="text-[11px] text-slate-400">
                                This package will become immediately available in the Exhibitor registration form.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsAddingBoothPackage(false)}
                              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Quick Preset Templates */}
                          <div>
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                              Quick Preset Templates (1-Click Fill)
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {[
                                {
                                  label: 'Startup Pod (4sqm)',
                                  name: 'Startup Innovation Pod (4sqm - 2x2m)',
                                  id: 'startup_4sqm',
                                  priceNGN: 180000,
                                  priceFormatted: '₦180,000',
                                  badges: 1,
                                  commissionRate: 0.10,
                                  desc: 'Tailored for proptech startups and green innovations. Includes 4sqm partition shell, 1 barstool, branded fascia, 13A socket, 1 staff badge.'
                                },
                                {
                                  label: 'Corner Stand (12sqm)',
                                  name: 'Prime Corner Stand (12sqm - 4x3m)',
                                  id: 'corner_12sqm',
                                  priceNGN: 480000,
                                  priceFormatted: '₦480,000',
                                  badges: 3,
                                  commissionRate: 0.10,
                                  desc: 'Double-facing open corner stand, illuminated fascia, 3 spotlights, 1 conference table, 3 chairs, dual sockets, 3 staff badges.'
                                },
                                {
                                  label: 'Executive Double (18sqm)',
                                  name: 'Executive Double Stand (18sqm - 6x3m)',
                                  id: 'executive_18sqm_v2',
                                  priceNGN: 700000,
                                  priceFormatted: '₦700,000',
                                  badges: 3,
                                  commissionRate: 0.10,
                                  desc: 'Double corner/linear stand, premium fascia, 4 spotlights, 2 tables, 4 chairs, dual sockets, 3 staff badges.'
                                },
                                {
                                  label: 'Mega Pavilion (72sqm)',
                                  name: 'Anchor Mega Pavilion (72sqm - 12x6m)',
                                  id: 'mega_72sqm',
                                  priceNGN: 2800000,
                                  priceFormatted: '₦2,800,000',
                                  badges: 6,
                                  commissionRate: 0.10,
                                  desc: 'Exclusive anchor brand pavilion at hall entrance, heavy truss rig, private lounge booth, 6 corporate staff badges.'
                                },
                                {
                                  label: 'Custom Bespoke Stand',
                                  name: 'Custom Space Allocation (Direct Inquire)',
                                  id: 'custom_bespoke',
                                  priceNGN: 350000,
                                  priceFormatted: 'Custom / Bespoke Space',
                                  badges: 4,
                                  commissionRate: 0.10,
                                  desc: 'Tailored floor layout and square meter allocation as agreed with Secretariat.'
                                }
                              ].map((preset, idx) => (
                                <button
                                  type="button"
                                  key={idx}
                                  onClick={() => {
                                    setNewBoothForm({
                                      id: `${preset.id}_${Date.now().toString().slice(-4)}`,
                                      name: preset.name,
                                      priceNGN: preset.priceNGN,
                                      priceFormatted: preset.priceFormatted,
                                      badges: preset.badges,
                                      commissionRate: preset.commissionRate,
                                      desc: preset.desc,
                                      active: true
                                    });
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 text-[11px] font-bold border border-white/10 hover:border-emerald-500/30 transition-all"
                                >
                                  + {preset.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="block text-slate-300 font-bold mb-1">Package Stand Name *</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Corner Shell Scheme (12sqm - 4x3m)"
                                value={newBoothForm.name}
                                onChange={(e) => {
                                  const nameVal = e.target.value;
                                  const autoId = nameVal.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 30);
                                  setNewBoothForm(prev => ({
                                    ...prev,
                                    name: nameVal,
                                    id: prev.id && !prev.id.startsWith('booth_') ? prev.id : (autoId || `booth_${Date.now()}`)
                                  }));
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                              />
                            </div>

                            <div>
                              <label className="block text-slate-300 font-bold mb-1">Package Identifier / Slug *</label>
                              <input
                                type="text"
                                placeholder="e.g. standard_9sqm, corner_12sqm"
                                value={newBoothForm.id}
                                onChange={(e) => setNewBoothForm({ ...newBoothForm, id: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-slate-300 font-mono text-xs focus:outline-none focus:border-emerald-400"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                              <label className="block text-slate-300 font-bold mb-1">Price (NGN Number) *</label>
                              <input
                                type="number"
                                min={0}
                                step={50000}
                                value={newBoothForm.priceNGN}
                                onChange={(e) => {
                                  const num = Number(e.target.value) || 0;
                                  setNewBoothForm(prev => ({
                                    ...prev,
                                    priceNGN: num,
                                    priceFormatted: prev.priceFormatted.startsWith('₦') || !prev.priceFormatted ? `₦${num.toLocaleString()}` : prev.priceFormatted
                                  }));
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-emerald-400 font-bold font-mono focus:outline-none focus:border-emerald-400"
                              />
                            </div>

                            <div>
                              <label className="block text-slate-300 font-bold mb-1">Display Price Formatted</label>
                              <input
                                type="text"
                                placeholder="e.g. ₦350,000 or Custom / Bespoke"
                                value={newBoothForm.priceFormatted}
                                onChange={(e) => setNewBoothForm({ ...newBoothForm, priceFormatted: e.target.value })}
                                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-bold focus:outline-none focus:border-emerald-400"
                              />
                            </div>

                            <div>
                              <label className="block text-slate-300 font-bold mb-1">Staff ID Badges Allowance</label>
                              <input
                                type="number"
                                min={1}
                                max={20}
                                value={newBoothForm.badges}
                                onChange={(e) => setNewBoothForm({ ...newBoothForm, badges: Number(e.target.value) || 1 })}
                                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono focus:outline-none focus:border-emerald-400"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="block text-slate-300 font-bold mb-1">
                                Marketer Commission Rate (Default: 0.10 for 10%)
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min={0}
                                  max={1}
                                  step={0.01}
                                  value={newBoothForm.commissionRate}
                                  onChange={(e) => setNewBoothForm({ ...newBoothForm, commissionRate: Number(e.target.value) || 0.10 })}
                                  className="w-32 px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-amber-300 font-bold font-mono focus:outline-none focus:border-emerald-400"
                                />
                                <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 px-2 py-1.5 rounded-xl border border-amber-500/20">
                                  Commission: {Math.round(newBoothForm.commissionRate * 100)}% (₦{Math.round(newBoothForm.priceNGN * newBoothForm.commissionRate).toLocaleString()} NGN)
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-6">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={newBoothForm.active}
                                  onChange={(e) => setNewBoothForm({ ...newBoothForm, active: e.target.checked })}
                                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 border-white/20 bg-black/60"
                                />
                                <span className="text-xs font-bold text-white">Active on Registration Form (Visible to Exhibitors)</span>
                              </label>
                            </div>
                          </div>

                          <div>
                            <label className="block text-slate-300 font-bold mb-1">
                              Included Amenities & Stand Specifications
                            </label>
                            <textarea
                              rows={2}
                              value={newBoothForm.desc}
                              onChange={(e) => setNewBoothForm({ ...newBoothForm, desc: e.target.value })}
                              placeholder="e.g. Includes shell scheme partitions, fascia nameboard, spotlights, 1 table, 2 chairs, 13A socket, 2 staff badges."
                              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                            <button
                              type="button"
                              onClick={() => setIsAddingBoothPackage(false)}
                              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold transition-all"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (!newBoothForm.name.trim()) {
                                  showToast('Please enter a package name');
                                  return;
                                }
                                addBoothPackage(newBoothForm);
                                setIsAddingBoothPackage(false);
                                showToast(`✅ Booth package "${newBoothForm.name}" created!`);
                              }}
                              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-950/40 transition-all flex items-center gap-1.5"
                            >
                              <Check className="w-4 h-4 stroke-[3]" />
                              <span>Save Booth Package</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* LIST OF BOOTH PACKAGES */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {boothPackages.map((booth) => {
                          const isActive = booth.active !== false;
                          const commRate = booth.commissionRate !== undefined ? booth.commissionRate : 0.10;
                          const calculatedCommission = Math.round(booth.priceNGN * commRate);

                          return (
                            <div
                              key={booth.id}
                              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                                isActive
                                  ? 'bg-white/5 border-emerald-500/30 hover:border-emerald-500/50'
                                  : 'bg-black/40 border-white/10 opacity-70 hover:opacity-90'
                              }`}
                            >
                              <div>
                                {/* Header Card row */}
                                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2 mb-3">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                                        isActive
                                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                          : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                                      }`}
                                    >
                                      {isActive ? 'Active On Form' : 'Hidden / Draft'}
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-400">
                                      ID: {booth.id}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        toggleBoothPackageActive(booth.id);
                                        showToast(`Package "${booth.name}" ${isActive ? 'hidden' : 'activated'}!`);
                                      }}
                                      title={isActive ? 'Click to hide from registration form' : 'Click to make active on registration form'}
                                      className={`p-1.5 rounded-lg border text-xs transition-all ${
                                        isActive
                                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                                          : 'bg-slate-800 text-slate-400 border-white/10 hover:text-white'
                                      }`}
                                    >
                                      {isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        const cloneId = `${booth.id}_copy_${Date.now().toString().slice(-4)}`;
                                        addBoothPackage({
                                          ...booth,
                                          id: cloneId,
                                          name: `${booth.name} (Copy)`
                                        });
                                        showToast(`Duplicated package "${booth.name}"!`);
                                      }}
                                      title="Duplicate this booth package"
                                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      type="button"
                                      disabled={boothPackages.length <= 1}
                                      onClick={() => {
                                        if (window.confirm(`Delete booth package "${booth.name}"?`)) {
                                          deleteBoothPackage(booth.id);
                                          showToast(`Deleted "${booth.name}"!`);
                                        }
                                      }}
                                      title="Delete booth package"
                                      className={`p-1.5 rounded-lg border transition-all ${
                                        boothPackages.length <= 1
                                          ? 'opacity-30 cursor-not-allowed bg-white/5 border-white/5 text-slate-500'
                                          : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20 hover:border-red-500/40'
                                      }`}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Package Name & ID */}
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Stand Package Name</label>
                                    <input
                                      type="text"
                                      value={booth.name}
                                      onChange={(e) => editBoothPackage(booth.id, { name: e.target.value })}
                                      className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-bold focus:outline-none focus:border-emerald-400"
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Price (NGN Numerical)</label>
                                      <input
                                        type="number"
                                        min={0}
                                        step={50000}
                                        value={booth.priceNGN}
                                        onChange={(e) => editBoothPackage(booth.id, { priceNGN: Number(e.target.value) || 0 })}
                                        className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-emerald-400 text-xs font-mono font-bold focus:outline-none focus:border-emerald-400"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Display Formatted Price</label>
                                      <input
                                        type="text"
                                        value={booth.priceFormatted || `₦${booth.priceNGN.toLocaleString()}`}
                                        onChange={(e) => editBoothPackage(booth.id, { priceFormatted: e.target.value })}
                                        className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-bold focus:outline-none focus:border-emerald-400"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Staff Badges Allowance</label>
                                      <input
                                        type="number"
                                        min={1}
                                        max={20}
                                        value={booth.badges}
                                        onChange={(e) => editBoothPackage(booth.id, { badges: Number(e.target.value) || 1 })}
                                        className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-emerald-400"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-[11px] font-bold text-amber-300 mb-1">Commission Rate</label>
                                      <input
                                        type="number"
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        value={commRate}
                                        onChange={(e) => editBoothPackage(booth.id, { commissionRate: Number(e.target.value) || 0.10 })}
                                        className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold focus:outline-none focus:border-amber-400"
                                      />
                                    </div>
                                  </div>

                                  {/* Marketer Commission Dynamic Preview */}
                                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-[11px]">
                                    <span className="text-amber-200 font-medium">Marketer Earnings on Referral:</span>
                                    <span className="font-extrabold text-amber-300 font-mono">
                                      Commission: {Math.round(commRate * 100)}% (₦{calculatedCommission.toLocaleString()} NGN)
                                    </span>
                                  </div>

                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                                      Stand Inclusions & Amenities
                                    </label>
                                    <textarea
                                      rows={2}
                                      value={booth.desc}
                                      onChange={(e) => editBoothPackage(booth.id, { desc: e.target.value })}
                                      className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                                <span className="text-[11px] text-slate-400">
                                  Badges: <strong className="text-white">{booth.badges} Staff Passes</strong>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => showToast(`✅ "${booth.name}" package saved!`)}
                                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  <span>Save Package</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 2: GENERAL REGISTRATION & DELEGATE TIERS */}
                  {tiersSubTab === 'registration_tiers' && (
                    <div className="space-y-6">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-white">Delegate Ticket Tiers</h3>
                          <p className="text-xs text-slate-400">
                            Configure standard Free Visitor, Elite VIP (₦25,000 / ₦20,000 with promo), Sponsor, and Strategic Partner passes.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {tiers.map((tier) => (
                          <div
                            key={tier.id}
                            className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  {tier.badge}
                                </span>
                                <span className="text-xs font-mono text-slate-400 uppercase">
                                  ID: {tier.id}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-3 mt-3">
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Tier Title</label>
                                  <input
                                    type="text"
                                    value={tier.title}
                                    onChange={(e) => editTier(tier.id, { title: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Tagline</label>
                                  <input
                                    type="text"
                                    value={tier.tagline}
                                    onChange={(e) => editTier(tier.id, { tagline: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3 mt-3">
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Main Price (NGN)</label>
                                  <input
                                    type="text"
                                    value={tier.priceNGN}
                                    onChange={(e) => editTier(tier.id, { priceNGN: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-bold text-emerald-400"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Main Price (USD)</label>
                                  <input
                                    type="text"
                                    value={tier.priceUSD}
                                    onChange={(e) => editTier(tier.id, { priceUSD: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-bold text-emerald-400"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-3 mt-3">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-300 mb-1">Discounted Price (NGN)</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. ₦20,000"
                                    value={tier.discountPriceNGN || ''}
                                    onChange={(e) => editTier(tier.id, { discountPriceNGN: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-bold text-amber-300"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-300 mb-1">Discounted Price (USD)</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. $20"
                                    value={tier.discountPriceUSD || ''}
                                    onChange={(e) => editTier(tier.id, { discountPriceUSD: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-bold text-amber-300"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-300 mb-1">Discount Off (NGN)</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. ₦5,000"
                                    value={tier.discountAmountNGN || ''}
                                    onChange={(e) => editTier(tier.id, { discountAmountNGN: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-bold text-emerald-400"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3 mt-3">
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Main Payment Button Text</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Confirm Your Registration"
                                    value={tier.ctaText}
                                    onChange={(e) => editTier(tier.id, { ctaText: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Discount Button Text</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Apply Promo Code"
                                    value={tier.discountCtaText || ''}
                                    onChange={(e) => editTier(tier.id, { discountCtaText: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3 mt-3">
                                <div>
                                  <label className="block text-[10px] font-bold text-amber-300 mb-1 flex items-center gap-1">
                                    <span>Main / Elite VIP Payment Link URL</span>
                                  </label>
                                  <input
                                    type="url"
                                    placeholder="https://flutterwave.com/pay/..."
                                    value={tier.paymentLink || ''}
                                    onChange={(e) => editTier(tier.id, { paymentLink: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-amber-500/30 text-amber-200 text-xs font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-emerald-300 mb-1 flex items-center gap-1">
                                    <span>Discount Payment Link URL</span>
                                  </label>
                                  <input
                                    type="url"
                                    placeholder="https://flutterwave.com/pay/vlg1htodborh"
                                    value={tier.discountPaymentLink || ''}
                                    onChange={(e) => editTier(tier.id, { discountPaymentLink: e.target.value })}
                                    className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-emerald-500/30 text-emerald-200 text-xs font-mono"
                                  />
                                </div>
                              </div>

                              <div className="mt-3">
                                <label className="block text-[11px] font-bold text-slate-300 mb-1">Target Audience</label>
                                <textarea
                                  rows={2}
                                  value={tier.targetAudience}
                                  onChange={(e) => editTier(tier.id, { targetAudience: e.target.value })}
                                  className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                                />
                              </div>

                              <div className="mt-3">
                                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                                  Included Features (1 per line)
                                </label>
                                <textarea
                                  rows={4}
                                  value={tier.features.join('\n')}
                                  onChange={(e) => editTier(tier.id, { features: e.target.value.split('\n').filter(f => f.trim()) })}
                                  className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-mono"
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-white/10">
                              <span className="text-[11px] text-slate-400">
                                CTA: <strong>{tier.ctaText}</strong>
                              </span>
                              <button
                                type="button"
                                onClick={() => showToast(`${tier.title} tier saved!`)}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>Save Tier</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 7: SPONSORS & PARTNERS */}
              {/* ========================================================= */}
              {activeTab === 'sponsors' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white font-display">Sponsors & Strategic Partners</h2>
                      <p className="text-xs text-slate-400">
                        Manage corporate logos, headline infrastructure sponsors, mortgage institutions, government backers, and customize all section text and captions.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        id="btn-save-sponsors-top"
                        onClick={() => {
                          updateExpoDetails(expoDetails);
                          showToast("✅ Sponsors & Strategic Partners changes saved successfully!");
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-emerald-950 font-black text-xs flex items-center gap-1.5 shadow-lg cursor-pointer transition-all active:scale-95"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </button>

                      <button
                        onClick={() => setIsAddingSponsor(true)}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                      >
                        <Plus className="w-4 h-4 text-emerald-400" />
                        <span>Add Logo / Brand</span>
                      </button>
                    </div>
                  </div>

                  {/* ========================================================= */}
                  {/* LOGO AREA HEADINGS, CAPTIONS & CTA TEXTS CUSTOMIZER */}
                  {/* ========================================================= */}
                  <div id="admin-logo-area-texts-editor" className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-emerald-500/30 space-y-5 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                          <Type className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-white font-display flex items-center gap-2">
                            Logo Area Headings, Captions & Button Texts
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Live Editable
                            </span>
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Modify every badge, headline, descriptive caption, and CTA button in the Sponsors & Supporters showcase.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          requestConfirmation(
                            "Restore Default Showcase Texts",
                            "Revert all headlines, captions, and button labels in the logo area to the official RECON 2026 default wording?",
                            () => {
                              updateExpoDetails({
                                siteTexts: {
                                  ...expoDetails.siteTexts,
                                  sponsorsBadge: "INDUSTRY TITANS & INSTITUTIONAL BACKERS",
                                  sponsorsHeading: "OUR PREMIUM SPONSORS",
                                  sponsorsSubtitle: "Backed by Nigeria’s leading civil engineering conglomerates, tier-1 mortgage banks, luxury estate developers, and infrastructure pioneers.",
                                  supportersHeading: "OUR SUPPORTERS & PARTNERS",
                                  supportersSubtitle: "Endorsed by Federal Ministries, Chartered Institutes, and Architectural Councils across Nigeria.",
                                  sponsorsCtaBadge: "ELEVATE YOUR BRAND AUTHORITY",
                                  sponsorsCtaHeading: "Position Your Brand in Front of 5,000+ Key Decision Makers",
                                  sponsorsCtaTitle: "Position Your Brand in Front of 5,000+ Key Decision Makers",
                                  sponsorsCtaSubtitle: "Gain direct access to high-net-worth real estate buyers, state commissioners, major building contractors, and sovereign fund managers.",
                                  sponsorsCtaButton: "BECOME A SPONSOR",
                                  sponsorsPartnerButton: "PARTNER WITH THE EXPO"
                                }
                              });
                              showToast("Restored default logo area texts.");
                            }
                          );
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Defaults</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Top Sponsors Texts */}
                      <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                        <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                          <Crown className="w-3.5 h-3.5" />
                          <span>1. Main Sponsors Section Headings</span>
                        </h4>

                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">Top Badge Tag</label>
                          <input
                            type="text"
                            value={expoDetails.siteTexts?.sponsorsBadge || ''}
                            onChange={(e) => updateExpoDetails({
                              siteTexts: { ...expoDetails.siteTexts, sponsorsBadge: e.target.value }
                            })}
                            placeholder="e.g. INDUSTRY TITANS & INSTITUTIONAL BACKERS"
                            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">Main Section Heading (H2)</label>
                          <input
                            type="text"
                            value={expoDetails.siteTexts?.sponsorsHeading || ''}
                            onChange={(e) => updateExpoDetails({
                              siteTexts: { ...expoDetails.siteTexts, sponsorsHeading: e.target.value }
                            })}
                            placeholder="e.g. OUR PREMIUM SPONSORS"
                            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">Section Subtitle / Description Caption</label>
                          <textarea
                            rows={3}
                            value={expoDetails.siteTexts?.sponsorsSubtitle || ''}
                            onChange={(e) => updateExpoDetails({
                              siteTexts: { ...expoDetails.siteTexts, sponsorsSubtitle: e.target.value }
                            })}
                            placeholder="e.g. Backed by Nigeria’s leading civil engineering conglomerates..."
                            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white leading-relaxed"
                          />
                        </div>
                      </div>

                      {/* Supporters & Partners Texts */}
                      <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                        <h4 className="font-bold text-blue-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                          <Handshake className="w-3.5 h-3.5" />
                          <span>2. Supporters & Partners Subsection</span>
                        </h4>

                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">Subsection Heading (H3)</label>
                          <input
                            type="text"
                            value={expoDetails.siteTexts?.supportersHeading || ''}
                            onChange={(e) => updateExpoDetails({
                              siteTexts: { ...expoDetails.siteTexts, supportersHeading: e.target.value }
                            })}
                            placeholder="e.g. OUR SUPPORTERS & PARTNERS"
                            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">Subsection Caption / Endorsement Note</label>
                          <textarea
                            rows={3}
                            value={expoDetails.siteTexts?.supportersSubtitle || ''}
                            onChange={(e) => updateExpoDetails({
                              siteTexts: { ...expoDetails.siteTexts, supportersSubtitle: e.target.value }
                            })}
                            placeholder="e.g. Endorsed by Federal Ministries, Chartered Institutes, and Architectural Councils across Nigeria."
                            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white leading-relaxed"
                          />
                        </div>
                      </div>

                      {/* Bottom Sponsorship CTA Banner Texts */}
                      <div className="md:col-span-2 p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                        <h4 className="font-bold text-red-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>3. Sponsorship Call-to-Action Banner & Buttons</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-semibold text-slate-300 mb-1">Banner Top Badge</label>
                            <input
                              type="text"
                              value={expoDetails.siteTexts?.sponsorsCtaBadge || ''}
                              onChange={(e) => updateExpoDetails({
                                siteTexts: { ...expoDetails.siteTexts, sponsorsCtaBadge: e.target.value }
                              })}
                              placeholder="e.g. ELEVATE YOUR BRAND AUTHORITY"
                              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-300 mb-1">Banner Main Heading (H3)</label>
                            <input
                              type="text"
                              value={expoDetails.siteTexts?.sponsorsCtaHeading || expoDetails.siteTexts?.sponsorsCtaTitle || ''}
                              onChange={(e) => updateExpoDetails({
                                siteTexts: { 
                                  ...expoDetails.siteTexts, 
                                  sponsorsCtaHeading: e.target.value,
                                  sponsorsCtaTitle: e.target.value 
                                }
                              })}
                              placeholder="e.g. Position Your Brand in Front of 5,000+ Key Decision Makers"
                              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white font-bold"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block font-semibold text-slate-300 mb-1">Banner Subtitle / Value Proposition Caption</label>
                            <textarea
                              rows={2}
                              value={expoDetails.siteTexts?.sponsorsCtaSubtitle || ''}
                              onChange={(e) => updateExpoDetails({
                                siteTexts: { ...expoDetails.siteTexts, sponsorsCtaSubtitle: e.target.value }
                              })}
                              placeholder="e.g. Gain direct access to high-net-worth real estate buyers, state commissioners, major building contractors..."
                              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white leading-relaxed"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-300 mb-1">Sponsorship Primary Button Label</label>
                            <input
                              type="text"
                              value={expoDetails.siteTexts?.sponsorsCtaButton || ''}
                              onChange={(e) => updateExpoDetails({
                                siteTexts: { ...expoDetails.siteTexts, sponsorsCtaButton: e.target.value }
                              })}
                              placeholder="e.g. BECOME A SPONSOR"
                              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-emerald-300 font-bold"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-300 mb-1">Partnership Secondary Button Label</label>
                            <input
                              type="text"
                              value={expoDetails.siteTexts?.sponsorsPartnerButton || ''}
                              onChange={(e) => updateExpoDetails({
                                siteTexts: { ...expoDetails.siteTexts, sponsorsPartnerButton: e.target.value }
                              })}
                              placeholder="e.g. PARTNER WITH THE EXPO"
                              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-slate-200 font-bold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Card Save Action Footer */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10 mt-2">
                        <p className="text-[11px] text-slate-400 font-medium">
                          Click <strong className="text-emerald-400 font-bold">Save Text Changes</strong> to update live headings, captions, and button labels across the portal.
                        </p>
                        <button
                          type="button"
                          id="btn-save-logo-texts"
                          onClick={() => {
                            updateExpoDetails(expoDetails);
                            showToast("✅ Sponsors & Partners section texts saved successfully!");
                          }}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-emerald-950 font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95 ml-auto"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save Text & Heading Changes</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Add / Edit Sponsor Form */}
                  {(isAddingSponsor || editingSponsor) && (
                    <div className="p-5 rounded-2xl bg-black/70 border border-emerald-500/40 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-emerald-400">
                          {editingSponsor ? 'Edit Sponsor' : 'Add New Sponsor / Partner'}
                        </h3>
                        <button
                          onClick={() => {
                            setIsAddingSponsor(false);
                            setEditingSponsor(null);
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const form = e.currentTarget;
                          const formData = new FormData(form);
                          const tierTypeVal = (formData.get('tierType') as 'sponsor' | 'partner') || 'sponsor';
                          const spData: Sponsor = {
                            name: formData.get('name') as string,
                            category: formData.get('category') as any,
                            tierType: tierTypeVal,
                            logoPlaceholder: formData.get('logoPlaceholder') as string,
                            logoUrl: formData.get('logoUrl') as string,
                            tagline: formData.get('tagline') as string,
                            industry: formData.get('industry') as string,
                            country: formData.get('country') as string,
                            website: formData.get('website') as string,
                          };

                          if (editingSponsor) {
                            editSponsor(editingSponsor.index, spData);
                            showToast("Logo / Brand updated!");
                          } else {
                            addSponsor(spData);
                            showToast("New Sponsor / Partner added!");
                          }
                          setIsAddingSponsor(false);
                          setEditingSponsor(null);
                        }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs"
                      >
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Company / Institution Name</label>
                          <input
                            name="name"
                            type="text"
                            required
                            defaultValue={editingSponsor?.sponsor.name || ''}
                            placeholder="e.g. Dangote Cement & Infrastructure"
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Entity Role Type (Sponsor or Partner)</label>
                          <select
                            name="tierType"
                            defaultValue={editingSponsor?.sponsor.tierType || (['headline', 'platinum', 'gold', 'silver', 'bronze'].includes(editingSponsor?.sponsor.category || '') ? 'sponsor' : 'partner')}
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white font-bold text-emerald-400"
                          >
                            <option value="sponsor">Corporate Sponsor</option>
                            <option value="partner">Strategic / Institutional Partner</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Classification & Tier</label>
                          <select
                            name="category"
                            defaultValue={editingSponsor?.sponsor.category || 'platinum'}
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          >
                            <optgroup label="Sponsorship Tiers">
                              <option value="headline">Headline Sponsor (Top Tier)</option>
                              <option value="platinum">Platinum Sponsor</option>
                              <option value="gold">Gold Sponsor</option>
                              <option value="silver">Silver Sponsor</option>
                              <option value="bronze">Bronze Sponsor</option>
                            </optgroup>
                            <optgroup label="Partnership Tiers">
                              <option value="tech">Technology / PropTech Partner</option>
                              <option value="institutional">Institutional & Government Body</option>
                              <option value="strategic">Strategic Industry Partner</option>
                              <option value="media">Media & Press Partner</option>
                            </optgroup>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Logo Text Brand</label>
                          <input
                            name="logoPlaceholder"
                            type="text"
                            required
                            defaultValue={editingSponsor?.sponsor.logoPlaceholder || ''}
                            placeholder="e.g. DANGOTE"
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white font-bold"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <ImageUploadInput
                            name="logoUrl"
                            initialValue={editingSponsor?.sponsor.logoUrl || ''}
                            label="Sponsor / Partner Logo Image (Upload File)"
                            placeholder="Select or drag brand logo image"
                            maxWidth={800}
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Industry Sector</label>
                          <input
                            name="industry"
                            type="text"
                            required
                            defaultValue={editingSponsor?.sponsor.industry || ''}
                            placeholder="e.g. Heavy Construction Materials"
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Brand Tagline</label>
                          <input
                            name="tagline"
                            type="text"
                            required
                            defaultValue={editingSponsor?.sponsor.tagline || ''}
                            placeholder="e.g. Building Africa's Future with High-Performance Cement & Steel"
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Country / Region</label>
                          <input
                            name="country"
                            type="text"
                            defaultValue={editingSponsor?.sponsor.country || 'Nigeria'}
                            placeholder="Nigeria"
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Website URL (Optional)</label>
                          <input
                            name="website"
                            type="url"
                            defaultValue={editingSponsor?.sponsor.website || ''}
                            placeholder="https://company.com"
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          />
                        </div>

                        <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingSponsor(false);
                              setEditingSponsor(null);
                            }}
                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold cursor-pointer"
                          >
                            {editingSponsor ? 'Update Brand' : 'Add Brand'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Sponsors & Partners Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sponsors.map((sponsor, idx) => {
                      const isSpons = sponsor.tierType ? sponsor.tierType === 'sponsor' : ['headline', 'platinum', 'gold', 'silver', 'bronze'].includes(sponsor.category.toLowerCase());

                      return (
                        <div
                          key={idx}
                          className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                isSpons
                                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              }`}>
                                {isSpons ? 'SPONSOR' : 'PARTNER'} • {sponsor.category}
                              </span>
                              <span className="text-[10px] text-slate-400">{sponsor.country}</span>
                            </div>
                            <h4 className="font-extrabold text-white text-sm mt-2">{sponsor.name}</h4>
                            {sponsor.logoUrl ? (
                              <div className="w-full h-14 rounded-xl overflow-hidden bg-white border border-white/20 my-2 flex items-center justify-center p-1.5 shadow-sm">
                                <img src={sponsor.logoUrl} alt={sponsor.name} className="w-full h-full object-contain rounded-lg" referrerPolicy="no-referrer" />
                              </div>
                            ) : (
                              <p className="text-[11px] text-emerald-400 font-mono mt-0.5">{sponsor.logoPlaceholder}</p>
                            )}
                            <p className="text-[11px] text-slate-400 mt-1 italic">"{sponsor.tagline}"</p>
                          </div>

                          <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10 text-xs">
                            <span className="text-[10px] text-slate-500">{sponsor.industry}</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => setEditingSponsor({ index: idx, sponsor })}
                                className="p-1.5 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-emerald-950 text-slate-300 transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              {(isMainAdmin || canDelete) && (
                                <button
                                  onClick={() => {
                                    requestConfirmation(
                                      "Delete Sponsor",
                                      `Remove sponsor ${sponsor.name}?`,
                                      () => {
                                        deleteSponsor(idx);
                                        showToast("Sponsor removed.");
                                      }
                                    );
                                  }}
                                  className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500 hover:text-white text-slate-300 transition-colors cursor-pointer"
                                  title="Delete Sponsor"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Section Bottom Action Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-black to-emerald-950/60 border border-emerald-500/30 mt-6 shadow-xl">
                    <div className="flex items-center gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Sponsors & Partners configuration is up to date. Click <strong className="text-white">Save Changes</strong> to store all updates.</span>
                    </div>
                    <button
                      type="button"
                      id="btn-save-sponsors-bottom"
                      onClick={() => {
                        updateExpoDetails(expoDetails);
                        showToast("✅ All Sponsors & Strategic Partners changes saved successfully!");
                      }}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-emerald-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95 flex-shrink-0"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 8: INDUSTRY SECTORS */}
              {/* ========================================================= */}
              {activeTab === 'sectors' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white font-display">Industry Sectors Covered</h2>
                    <p className="text-xs text-slate-400">
                      Customize the 6 core industry pillars featured in the central exhibition theme section.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sectors.map((sec, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-emerald-400 uppercase">Sector #{idx + 1}</span>
                          <span className="text-[10px] font-mono text-slate-400">Icon: {sec.icon}</span>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">Sector Title</label>
                          <input
                            type="text"
                            value={sec.title}
                            onChange={(e) => editSector(idx, { title: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">Description</label>
                          <textarea
                            rows={2}
                            value={sec.desc}
                            onChange={(e) => editSector(idx, { desc: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 9: FAQS */}
              {/* ========================================================= */}
              {activeTab === 'faqs' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white font-display">Frequently Asked Questions</h2>
                      <p className="text-xs text-slate-400">
                        Manage attendee inquiries, hotel discounts, booth guidelines, and B2B room access.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsAddingFaq(true)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add FAQ</span>
                    </button>
                  </div>

                  {/* Add / Edit FAQ Form */}
                  {(isAddingFaq || editingFaq) && (
                    <div className="p-5 rounded-2xl bg-black/70 border border-emerald-500/40 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-emerald-400">
                          {editingFaq ? 'Edit FAQ Item' : 'Add New FAQ'}
                        </h3>
                        <button
                          onClick={() => {
                            setIsAddingFaq(false);
                            setEditingFaq(null);
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const form = e.currentTarget;
                          const formData = new FormData(form);
                          const fData = {
                            q: formData.get('q') as string,
                            a: formData.get('a') as string,
                          };

                          if (editingFaq) {
                            editFaq(editingFaq.index, fData);
                            showToast("FAQ updated!");
                          } else {
                            addFaq(fData);
                            showToast("New FAQ added!");
                          }
                          setIsAddingFaq(false);
                          setEditingFaq(null);
                        }}
                        className="space-y-3 text-xs"
                      >
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Question</label>
                          <input
                            name="q"
                            type="text"
                            required
                            defaultValue={editingFaq?.faq.q || ''}
                            placeholder="e.g. How can international delegates obtain visa assistance?"
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Detailed Answer</label>
                          <textarea
                            name="a"
                            rows={3}
                            required
                            defaultValue={editingFaq?.faq.a || ''}
                            placeholder="Provide thorough answer with links and secretariat contact instructions..."
                            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingFaq(false);
                              setEditingFaq(null);
                            }}
                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold"
                          >
                            {editingFaq ? 'Update FAQ' : 'Add FAQ'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* FAQs List */}
                  <div className="space-y-3">
                    {faqs.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-bold text-white text-sm">
                            <span className="text-emerald-400 mr-2">Q{idx + 1}:</span>
                            {item.q}
                          </h4>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={() => setEditingFaq({ index: idx, faq: item })}
                              className="p-1.5 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-emerald-950 text-slate-300 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            {(isMainAdmin || canDelete) && (
                              <button
                                onClick={() => {
                                  requestConfirmation(
                                    "Delete FAQ Item",
                                    "Delete this FAQ item?",
                                    () => {
                                      deleteFaq(idx);
                                      showToast("FAQ deleted.");
                                    }
                                  );
                                }}
                                className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500 hover:text-white text-slate-300 transition-colors cursor-pointer"
                                title="Delete FAQ"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-2">
                          {item.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 10: REGISTERED DELEGATES, EXHIBITORS, SPONSORS & PARTNERS */}
              {/* ========================================================= */}
              {activeTab === 'attendees' && (() => {
                const getCategory = (att: any) => {
                  const pt = (att.passType || '').toLowerCase();
                  const tr = (att.tier || '').toLowerCase();
                  if (pt === 'exhibitor' || tr.includes('exhibitor')) return 'exhibitor';
                  if (pt === 'sponsor' || tr.includes('sponsor')) return 'sponsor';
                  if (pt === 'partner' || tr.includes('partner')) return 'partner';
                  return 'attendee';
                };

                const attendeeCount = attendees.filter(a => getCategory(a) === 'attendee').length;
                const exhibitorCount = attendees.filter(a => getCategory(a) === 'exhibitor').length;
                const sponsorCount = attendees.filter(a => getCategory(a) === 'sponsor').length;
                const partnerCount = attendees.filter(a => getCategory(a) === 'partner').length;

                const paidRegistrations = attendees.filter(isPaidRegistration);
                const freeRegistrations = attendees.filter(a => !isPaidRegistration(a));
                const paidCount = paidRegistrations.length;
                const freeCount = freeRegistrations.length;
                const totalPaidRevenue = paidRegistrations.reduce((sum, a) => {
                  const val = parseInt((a.amountPaid || '0').replace(/[^0-9]/g, ''), 10) || 0;
                  return sum + val;
                }, 0);

                // Filtered attendee list based on Search, Category, and Payment Filter
                const filteredAttendees = attendees.filter(a => {
                  const q = attendeeSearch.toLowerCase().trim();
                  const matchesSearch = !q || 
                    a.fullName.toLowerCase().includes(q) ||
                    a.email.toLowerCase().includes(q) ||
                    (a.organization || '').toLowerCase().includes(q) ||
                    a.ticketNumber.toLowerCase().includes(q) ||
                    (a.referralCode || '').toLowerCase().includes(q);

                  const cat = getCategory(a);
                  const matchesCategory = 
                    attendeeTierFilter === 'all' ||
                    (attendeeTierFilter === 'attendee' && cat === 'attendee') ||
                    (attendeeTierFilter === 'exhibitor' && cat === 'exhibitor') ||
                    (attendeeTierFilter === 'sponsor' && cat === 'sponsor') ||
                    (attendeeTierFilter === 'partner' && cat === 'partner');

                  const isPaid = isPaidRegistration(a);
                  const matchesPayment = 
                    attendeePaymentFilter === 'all' ||
                    (attendeePaymentFilter === 'paid' && isPaid) ||
                    (attendeePaymentFilter === 'free' && !isPaid);

                  return matchesSearch && matchesCategory && matchesPayment;
                });

                // Selection Helpers
                const isAllFilteredSelected = filteredAttendees.length > 0 && filteredAttendees.every(a => selectedAttendeeTickets.includes(a.ticketNumber));
                const isSomeFilteredSelected = filteredAttendees.some(a => selectedAttendeeTickets.includes(a.ticketNumber)) && !isAllFilteredSelected;

                const toggleSelectAllFiltered = () => {
                  if (isAllFilteredSelected) {
                    const filteredIds = new Set(filteredAttendees.map(a => a.ticketNumber));
                    setSelectedAttendeeTickets(prev => prev.filter(id => !filteredIds.has(id)));
                  } else {
                    const combined = new Set([...selectedAttendeeTickets, ...filteredAttendees.map(a => a.ticketNumber)]);
                    setSelectedAttendeeTickets(Array.from(combined));
                  }
                };

                const handleSelectOnlyPaid = () => {
                  const paidInFiltered = filteredAttendees.filter(isPaidRegistration).map(a => a.ticketNumber);
                  setSelectedAttendeeTickets(paidInFiltered);
                  showToast(`Selected ${paidInFiltered.length} Paid registrations.`);
                };

                const handleSelectOnlyFree = () => {
                  const freeInFiltered = filteredAttendees.filter(a => !isPaidRegistration(a)).map(a => a.ticketNumber);
                  setSelectedAttendeeTickets(freeInFiltered);
                  showToast(`Selected ${freeInFiltered.length} Free registrations.`);
                };

                const toggleSelectOne = (ticketNum: string) => {
                  setSelectedAttendeeTickets(prev => 
                    prev.includes(ticketNum) ? prev.filter(t => t !== ticketNum) : [...prev, ticketNum]
                  );
                };

                const selectedAttendeesList = attendees.filter(a => selectedAttendeeTickets.includes(a.ticketNumber));
                const selectedTotalRev = selectedAttendeesList.reduce((sum, a) => {
                  const val = parseInt((a.amountPaid || '0').replace(/[^0-9]/g, ''), 10) || 0;
                  return sum + val;
                }, 0);

                // Batch Operations
                const handleBatchCheckIn = () => {
                  if (selectedAttendeeTickets.length === 0) return;
                  let count = 0;
                  selectedAttendeeTickets.forEach(tNum => {
                    const ok = toggleCheckInAttendee(tNum);
                    if (ok) count++;
                  });
                  showToast(`Batch gate check-in applied to ${count} delegates.`);
                };

                const handleBatchApprovePayment = () => {
                  if (selectedAttendeeTickets.length === 0) return;
                  selectedAttendeeTickets.forEach(tNum => {
                    updateAttendee(tNum, {
                      adminApproved: true,
                      adminApprovalStatus: 'APPROVED',
                      adminApprovedAt: new Date().toISOString(),
                      paymentStatus: 'PAID'
                    });
                  });
                  showToast(`Payment APPROVED for ${selectedAttendeeTickets.length} selected registrations.`);
                };

                return (
                  <div className="space-y-6">
                    {/* Top Header & Export Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-white font-display">Registration Management Database</h2>
                        <p className="text-xs text-slate-400">
                          View, filter, and manage separated registration records for <strong className="text-emerald-300">Attendees</strong>, <strong className="text-amber-300">Exhibitors</strong>, <strong className="text-red-400">Sponsors</strong>, and <strong className="text-purple-300">Partners</strong>.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => setIsGateScannerOpen(true)}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-emerald-950 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
                          title="Open Live Camera QR Scanner to verify badges at the venue gate"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Gate Camera Scanner</span>
                        </button>

                        <button
                          onClick={handleAddSampleAttendee}
                          className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Simulate a new registration booking"
                        >
                          <Plus className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Add Sample Record</span>
                        </button>

                        {/* Direct Download Actions */}
                        <div className="flex items-center gap-1 bg-black/40 border border-white/10 p-1 rounded-xl">
                          <button
                            onClick={() => handleExportAttendeesCsv(attendees, 'All')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Download all registrations as CSV"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Export All CSV</span>
                          </button>

                          <button
                            onClick={() => handleExportAttendeesCsv(paidRegistrations, 'Paid_Only')}
                            className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Download only Paid registrations as CSV"
                          >
                            <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Paid CSV</span>
                          </button>

                          <button
                            onClick={() => handleExportAttendeesCsv(freeRegistrations, 'Free_Only')}
                            className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Download only Free registrations as CSV"
                          >
                            <Ticket className="w-3.5 h-3.5 text-purple-300" />
                            <span>Free CSV</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Category Filter Pills Bar */}
                    <div className="flex flex-wrap items-center gap-2 pb-1 border-b border-white/10">
                      <button
                        onClick={() => setAttendeeTierFilter('all')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                          attendeeTierFilter === 'all'
                            ? 'bg-white text-black shadow-md font-black'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                        }`}
                      >
                        <Users className="w-3.5 h-3.5 text-slate-700" />
                        <span>All Registrations</span>
                        <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px] font-mono">
                          {attendees.length}
                        </span>
                      </button>

                      <button
                        onClick={() => setAttendeeTierFilter('attendee')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                          attendeeTierFilter === 'attendee'
                            ? 'bg-emerald-500 text-emerald-950 shadow-md font-black'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                        }`}
                      >
                        <Ticket className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Attendees (Visitors & Elite VIP)</span>
                        <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-emerald-200 text-[10px] font-mono">
                          {attendeeCount}
                        </span>
                      </button>

                      <button
                        onClick={() => setAttendeeTierFilter('exhibitor')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                          attendeeTierFilter === 'exhibitor'
                            ? 'bg-amber-500 text-black shadow-md font-black'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                        }`}
                      >
                        <Store className="w-3.5 h-3.5 text-amber-400" />
                        <span>Exhibitors (Booth Stands)</span>
                        <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-amber-200 text-[10px] font-mono">
                          {exhibitorCount}
                        </span>
                      </button>

                      <button
                        onClick={() => setAttendeeTierFilter('sponsor')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                          attendeeTierFilter === 'sponsor'
                            ? 'bg-red-600 text-white shadow-md font-black'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-red-400" />
                        <span>Sponsors (Corporate)</span>
                        <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-red-200 text-[10px] font-mono">
                          {sponsorCount}
                        </span>
                      </button>

                      <button
                        onClick={() => setAttendeeTierFilter('partner')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                          attendeeTierFilter === 'partner'
                            ? 'bg-purple-600 text-white shadow-md font-black'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                        }`}
                      >
                        <Handshake className="w-3.5 h-3.5 text-purple-300" />
                        <span>Partners (Strategic & Media)</span>
                        <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-purple-200 text-[10px] font-mono">
                          {partnerCount}
                        </span>
                      </button>
                    </div>

                    {/* PAYMENT TYPE SELECTION & FILTER BAR */}
                    <div className="bg-gradient-to-r from-black/60 via-emerald-950/20 to-black/60 border border-white/10 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3">
                      {/* Payment Filter Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Payment Filter:
                        </span>

                        <button
                          onClick={() => setAttendeePaymentFilter('all')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            attendeePaymentFilter === 'all'
                              ? 'bg-white text-black shadow-md font-extrabold'
                              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                          }`}
                        >
                          <span>All Types</span>
                          <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px] font-mono">
                            {attendees.length}
                          </span>
                        </button>

                        <button
                          onClick={() => setAttendeePaymentFilter('paid')}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            attendeePaymentFilter === 'paid'
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-black shadow-md font-extrabold'
                              : 'bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/30'
                          }`}
                          title="Filter registrations with payment records (VIP, Exhibitors, Sponsors, Partners)"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>Paid Only</span>
                          <span className="px-2 py-0.2 rounded-full bg-black/40 text-[10px] font-mono font-bold">
                            {paidCount} • ₦{totalPaidRevenue.toLocaleString()}
                          </span>
                        </button>

                        <button
                          onClick={() => setAttendeePaymentFilter('free')}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            attendeePaymentFilter === 'free'
                              ? 'bg-purple-500 text-white shadow-md font-extrabold'
                              : 'bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-500/30'
                          }`}
                          title="Filter standard free visitor passes"
                        >
                          <Ticket className="w-3.5 h-3.5" />
                          <span>Free Only</span>
                          <span className="px-2 py-0.2 rounded-full bg-black/40 text-[10px] font-mono font-bold">
                            {freeCount}
                          </span>
                        </button>
                      </div>

                      {/* Batch Selection Quick-Select Tools */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">Quick Select:</span>
                        <button
                          onClick={handleSelectOnlyPaid}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold cursor-pointer"
                        >
                          Select Only Paid
                        </button>
                        <button
                          onClick={handleSelectOnlyFree}
                          className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-bold cursor-pointer"
                        >
                          Select Only Free
                        </button>
                        {selectedAttendeeTickets.length > 0 && (
                          <button
                            onClick={() => setSelectedAttendeeTickets([])}
                            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                          >
                            Clear ({selectedAttendeeTickets.length})
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Search Bar & View Mode Toggle */}
                    <div className="p-3 bg-black/40 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="relative flex-1 w-full">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search registrations by name, email, company, ticket number, promo code..."
                          value={attendeeSearch}
                          onChange={(e) => setAttendeeSearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                        />
                      </div>

                      <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-white/10 shrink-0">
                        <button
                          type="button"
                          onClick={() => setAttendeeDisplayMode('table')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            attendeeDisplayMode === 'table'
                              ? 'bg-emerald-500 text-emerald-950 font-black shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <List className="w-3.5 h-3.5" />
                          <span>Table Roster</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setAttendeeDisplayMode('qr_grid')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            attendeeDisplayMode === 'qr_grid'
                              ? 'bg-emerald-500 text-emerald-950 font-black shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                          <span>QR Digital Passes ({filteredAttendees.length})</span>
                        </button>
                      </div>
                    </div>

                    {/* STICKY / FLOATING BATCH ACTION BAR WHEN SELECTIONS EXIST */}
                    {selectedAttendeeTickets.length > 0 && (
                      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/50 rounded-2xl p-3.5 shadow-xl flex flex-wrap items-center justify-between gap-3 animate-fade-in">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-black text-sm font-mono">
                            {selectedAttendeeTickets.length}
                          </div>
                          <div>
                            <strong className="text-white text-xs block">
                              {selectedAttendeeTickets.length} Registration{selectedAttendeeTickets.length > 1 ? 's' : ''} Selected
                            </strong>
                            <span className="text-[11px] text-slate-400 font-mono">
                              Total Value: <span className="text-emerald-300 font-bold">₦{selectedTotalRev.toLocaleString()}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => handleExportAttendeesCsv(selectedAttendeesList, `Selected_${selectedAttendeeTickets.length}`)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download CSV ({selectedAttendeeTickets.length})</span>
                          </button>

                          <button
                            onClick={() => handleExportSelectedJson(selectedAttendeesList, `Selected_${selectedAttendeeTickets.length}`)}
                            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>JSON</span>
                          </button>

                          <button
                            onClick={handleBatchCheckIn}
                            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Batch Check-In</span>
                          </button>

                          <button
                            onClick={handleBatchApprovePayment}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                            <span>Approve Payment</span>
                          </button>

                          {(isMainAdmin || canDelete) && (
                            <button
                              onClick={() => {
                                const count = selectedAttendeeTickets.length;
                                requestConfirmation(
                                  "Delete Selected Registrations",
                                  `Permanently delete ${count} selected attendee registration record${count > 1 ? 's' : ''}?`,
                                  () => {
                                    selectedAttendeeTickets.forEach(t => deleteAttendee(t));
                                    setSelectedAttendeeTickets([]);
                                    showToast(`Successfully deleted ${count} attendee records.`);
                                  }
                                );
                              }}
                              className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-400" />
                              <span>Delete Selected ({selectedAttendeeTickets.length})</span>
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedAttendeeTickets([])}
                            className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                          >
                            Deselect All
                          </button>
                        </div>
                      </div>
                    )}

                    {/* QR Cards Grid View or Table View */}
                    {attendeeDisplayMode === 'qr_grid' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredAttendees.map((att) => {
                          const category = getCategory(att);
                          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(att.ticketNumber)}&margin=5`;

                          return (
                            <div 
                              key={att.ticketNumber}
                              className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-lg transition-all relative group"
                            >
                              <div 
                                onClick={() => setViewingQrPassTicket(att)}
                                className="p-2.5 bg-white rounded-xl shadow-md border-2 border-emerald-400/60 cursor-pointer hover:scale-105 transition-transform"
                                title="Click to view & print full QR Check-In Pass"
                              >
                                <img 
                                  src={qrUrl} 
                                  alt={`QR Code ${att.ticketNumber}`}
                                  className="w-32 h-32 block object-contain"
                                />
                              </div>

                              <div className="w-full">
                                <button
                                  type="button"
                                  onClick={() => setViewingQrPassTicket(att)}
                                  className="font-mono text-xs font-bold text-emerald-300 hover:underline block truncate mx-auto cursor-pointer"
                                >
                                  {att.ticketNumber}
                                </button>
                                <h4 className="text-sm font-bold text-white truncate mt-0.5">{att.fullName}</h4>
                                <p className="text-[11px] text-slate-400 truncate">{att.organization || 'Registered Delegate'}</p>
                              </div>

                              <div className="flex items-center justify-center gap-1.5 w-full flex-wrap">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                                  category === 'sponsor' ? 'bg-red-600/30 text-red-200 border-red-500/40' :
                                  category === 'exhibitor' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                                  category === 'partner' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                }`}>
                                  {att.tier}
                                </span>

                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase flex items-center gap-1 ${
                                  att.checkedIn ? 'bg-emerald-500 text-emerald-950' : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {att.checkedIn ? <UserCheck className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                                  <span>{att.checkedIn ? 'Checked-In' : 'Pending'}</span>
                                </span>
                              </div>

                              <div className="flex items-center gap-2 w-full pt-2 border-t border-slate-800">
                                <button
                                  type="button"
                                  onClick={() => setViewingQrPassTicket(att)}
                                  className="flex-1 py-1.5 px-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs rounded-xl border border-emerald-500/30 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                >
                                  <QrCode className="w-3.5 h-3.5" />
                                  <span>QR Pass</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const ok = toggleCheckInAttendee(att.ticketNumber);
                                    if (ok) showToast(att.checkedIn ? 'Check-in cancelled' : `Checked In: ${att.fullName}`);
                                  }}
                                  className={`p-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                                    att.checkedIn ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300 hover:text-white'
                                  }`}
                                  title={att.checkedIn ? 'Cancel Gate Check-In' : 'Mark Checked In'}
                                >
                                  <UserCheck className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      /* Table View */
                      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-lg">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs text-slate-300">
                          <thead className="bg-black/60 text-[10px] uppercase tracking-wider text-slate-400 border-b border-white/10 font-bold">
                            <tr>
                              <th className="py-3 px-3 w-10 text-center">
                                <button
                                  type="button"
                                  onClick={toggleSelectAllFiltered}
                                  className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
                                  title={isAllFilteredSelected ? "Deselect all visible" : "Select all visible"}
                                >
                                  {isAllFilteredSelected ? (
                                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                                  ) : isSomeFilteredSelected ? (
                                    <CheckSquare className="w-4 h-4 text-emerald-400/60" />
                                  ) : (
                                    <Square className="w-4 h-4 text-slate-500" />
                                  )}
                                </button>
                              </th>
                              <th className="py-3 px-4">Ticket No.</th>
                              <th className="py-3 px-4">Delegate / Lead Name</th>
                              <th className="py-3 px-4">Organization & Role</th>
                              <th className="py-3 px-4">Category / Pass</th>
                              <th className="py-3 px-4">Payment Type</th>
                              <th className="py-3 px-4">Gate Status</th>
                              <th className="py-3 px-4">Amount / Payment</th>
                              <th className="py-3 px-4">Phone / Contact</th>
                              <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {filteredAttendees.map((att) => {
                              const category = getCategory(att);
                              const isPaid = isPaidRegistration(att);
                              const isSelected = selectedAttendeeTickets.includes(att.ticketNumber);

                              return (
                                <tr 
                                  key={att.ticketNumber} 
                                  className={`transition-colors ${
                                    isSelected 
                                      ? 'bg-emerald-950/40 border-l-2 border-emerald-400' 
                                      : 'hover:bg-white/5'
                                  }`}
                                >
                                  <td className="py-3 px-3 text-center">
                                    <button
                                      type="button"
                                      onClick={() => toggleSelectOne(att.ticketNumber)}
                                      className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
                                    >
                                      {isSelected ? (
                                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                                      ) : (
                                        <Square className="w-4 h-4 text-slate-600" />
                                      )}
                                    </button>
                                  </td>
                                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                                    <button 
                                      type="button"
                                      onClick={() => setViewingIdCardTicket(att)}
                                      className="hover:underline text-emerald-300 flex items-center gap-1 cursor-pointer"
                                      title="Click to view Delegate Account & Generated Smart ID Card"
                                    >
                                      <span>{att.ticketNumber}</span>
                                      <QrCode className="w-3 h-3 text-emerald-400" />
                                    </button>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div 
                                      onClick={() => setViewingIdCardTicket(att)}
                                      className="font-bold text-white flex items-center gap-1.5 flex-wrap cursor-pointer hover:text-emerald-400 transition-colors"
                                      title="Click to view Delegate Account & Generated Smart ID Card"
                                    >
                                      <span>{att.fullName}</span>
                                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-blue-600/90 text-white text-[9px] font-black border border-blue-400">
                                        <CheckCircle2 className="w-2.5 h-2.5 fill-white text-blue-600" />
                                        <span>VERIFIED</span>
                                      </span>
                                    </div>
                                    <div className="text-[11px] text-slate-400">{att.email}</div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="text-white font-medium">{att.organization}</div>
                                    <div className="text-[10px] text-slate-400">{att.role}</div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border flex items-center gap-1 w-fit ${
                                      category === 'sponsor' ? 'bg-red-600/30 text-red-200 border-red-500/40' :
                                      category === 'exhibitor' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                                      category === 'partner' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                                      'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    }`}>
                                      {category === 'sponsor' && <Sparkles className="w-3 h-3 text-red-400" />}
                                      {category === 'exhibitor' && <Store className="w-3 h-3 text-amber-400" />}
                                      {category === 'partner' && <Handshake className="w-3 h-3 text-purple-300" />}
                                      {category === 'attendee' && <Ticket className="w-3 h-3 text-emerald-400" />}
                                      <span>{att.tier}</span>
                                    </span>
                                    {att.referralCode && (
                                      <div className="mt-1 flex items-center gap-1.5 text-[9px] text-amber-300 font-bold font-mono">
                                        <span>Ref: {att.referralCode}</span>
                                        {category === 'exhibitor' && (
                                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold">
                                            Commission: 10% (₦{(att.commissionEarnedNGN || Math.round((att.dealValue || 350000) * 0.10)).toLocaleString()})
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border inline-flex items-center gap-1 ${
                                      isPaid 
                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                                        : 'bg-purple-500/20 text-purple-300 border-purple-400/40'
                                    }`}>
                                      {isPaid ? <DollarSign className="w-3 h-3 text-emerald-400" /> : <Ticket className="w-3 h-3 text-purple-300" />}
                                      <span>{isPaid ? 'PAID' : 'FREE'}</span>
                                    </span>
                                  </td>
                                  <td className="py-3 px-4">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const ok = toggleCheckInAttendee(att.ticketNumber);
                                        if (ok) {
                                          showToast(att.checkedIn ? `Check-in cancelled for ${att.fullName}` : `Checked In: ${att.fullName}`);
                                        }
                                      }}
                                      className={`px-2.5 py-1 rounded-xl text-[10px] font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 ${
                                        att.checkedIn
                                          ? 'bg-emerald-500 text-emerald-950 hover:bg-emerald-400'
                                          : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/15'
                                      }`}
                                      title={att.checkedIn ? `Checked in at ${att.checkedInAt ? new Date(att.checkedInAt).toLocaleTimeString() : 'Gate'}` : 'Click to mark checked in'}
                                    >
                                      {att.checkedIn ? (
                                        <>
                                          <UserCheck className="w-3 h-3" />
                                          <span>CHECKED IN</span>
                                        </>
                                      ) : (
                                        <>
                                          <Clock className="w-3 h-3 text-slate-400" />
                                          <span>PENDING</span>
                                        </>
                                      )}
                                    </button>
                                    {att.checkedIn && att.checkedInAt && (
                                      <div className="text-[9px] text-emerald-400/80 font-mono mt-0.5">
                                        {new Date(att.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </div>
                                    )}
                                  </td>
                                  <td className="py-3 px-4 font-mono text-[11px]">
                                    <div className="font-bold text-white">{att.amountPaid || (isPaid ? 'Paid' : '₦0 (Free)')}</div>
                                    <div className="mt-1">
                                      <select
                                        value={
                                          att.adminApprovalStatus || 
                                          (att.adminApproved ? 'APPROVED' : att.paymentStatus === 'DECLINED' ? 'DECLINED' : 'PENDING')
                                        }
                                        onChange={(e) => {
                                          const val = e.target.value as 'APPROVED' | 'DECLINED' | 'PENDING';
                                          const isApproved = val === 'APPROVED';
                                          updateAttendee(att.ticketNumber, {
                                            adminApproved: isApproved,
                                            adminApprovalStatus: val,
                                            adminApprovedAt: isApproved ? new Date().toISOString() : undefined,
                                            paymentStatus: isApproved ? 'PAID' : val === 'DECLINED' ? 'DECLINED' : 'PENDING'
                                          });
                                          if (val === 'APPROVED') {
                                            showToast(`✅ Payment APPROVED for ${att.fullName} — Smart ID Card unlocked.`);
                                          } else if (val === 'DECLINED') {
                                            showToast(`❌ Payment DECLINED for ${att.fullName} — ID Card locked.`);
                                          } else {
                                            showToast(`⏳ Payment set to PENDING for ${att.fullName}.`);
                                          }
                                        }}
                                        className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer border outline-none transition-all shadow-sm ${
                                          att.adminApproved || att.adminApprovalStatus === 'APPROVED'
                                            ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/60 hover:bg-emerald-900'
                                            : (att.adminApprovalStatus === 'DECLINED' || att.paymentStatus === 'DECLINED')
                                            ? 'bg-red-950/90 text-red-300 border-red-500/60 hover:bg-red-900'
                                            : 'bg-amber-950/90 text-amber-300 border-amber-500/60 hover:bg-amber-900 animate-pulse'
                                        }`}
                                        title="Set Payment Approval status for ID Card clearance"
                                      >
                                        <option value="APPROVED" className="bg-slate-900 text-emerald-300 font-bold">Approve</option>
                                        <option value="DECLINED" className="bg-slate-900 text-red-300 font-bold">Decline</option>
                                        <option value="PENDING" className="bg-slate-900 text-amber-300 font-bold">Pending</option>
                                      </select>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 font-mono text-[11px]">
                                    {att.phone}
                                  </td>
                                  <td className="py-3 px-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          showToast(`📧 Dispatching digital pass to ${att.email}...`);
                                          const res = await sendAttendeeConfirmationEmail(att);
                                          if (res.success) {
                                            showToast(`✅ Pass delivered to inbox: ${att.email}`);
                                          } else {
                                            showToast(`❌ Delivery notice: ${res.message}`);
                                          }
                                        }}
                                        className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-emerald-500/20 hover:border-emerald-500/40 text-emerald-300 border border-white/15 font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
                                        title={`Dispatch official digital pass & QR code to ${att.email}`}
                                      >
                                        <Mail className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>Email Pass</span>
                                      </button>
                                      {(isPaid || att.adminApproved || (att.passType === 'elite' || (att.tier || '').toLowerCase().includes('elite'))) && (
                                        <button
                                          type="button"
                                          onClick={async () => {
                                            showToast(`👑 Dispatching Payment Confirmation & VIP Benefits email to ${att.email}...`);
                                            const res = await sendPaymentReceiptEmail(att, {
                                              amount: att.dealValue || 25000,
                                              tx_ref: att.paymentRef || att.ticketNumber,
                                              customer: { name: att.fullName, email: att.email, phone: att.phone }
                                            });
                                            if (res.success) {
                                              showToast(`✅ Payment & VIP Benefits email delivered: ${att.email}`);
                                            } else {
                                              showToast(`❌ Delivery notice: ${res.message}`);
                                            }
                                          }}
                                          className="px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 hover:border-amber-400/50 text-amber-300 border border-amber-500/30 font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
                                          title={`Dispatch official Payment Confirmation & VIP Benefits Activation email to ${att.email}`}
                                        >
                                          <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                                          <span>Paid VIP Email</span>
                                        </button>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => setViewingIdCardTicket(att)}
                                        className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-emerald-950 font-black text-[11px] flex items-center gap-1.5 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 whitespace-nowrap"
                                        title={`View Delegate Account & Generated ID Card for ${att.fullName}`}
                                      >
                                        <QrCode className="w-3.5 h-3.5" />
                                        <span>View ID Card</span>
                                      </button>
                                      {(isMainAdmin || canDelete) && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            requestConfirmation(
                                              "Delete Record",
                                              `Remove registration record for ${att.fullName} (${att.ticketNumber})?`,
                                              () => {
                                                deleteAttendee(att.ticketNumber);
                                                showToast("Record removed.");
                                              }
                                            );
                                          }}
                                          className="p-1.5 rounded bg-white/10 hover:bg-red-500 hover:text-white text-slate-400 transition-colors cursor-pointer"
                                          title="Delete Record"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>

                        {filteredAttendees.length === 0 && (
                          <div className="p-8 text-center text-slate-400 text-xs">
                            No registration records match your selected category, payment filter, or search query.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
              })()}

              {/* ========================================================= */}
              {/* TAB: SPECIAL ID BADGE GENERATOR (PRESS, OFFICIAL, SECURITY, CREW, VIP) */}
              {/* ========================================================= */}
              {activeTab === 'special_badges' && (() => {
                const constructedSpecialTicket: AttendeeTicket = {
                  ticketNumber: `RECON-2026-${specialPassCategory.toUpperCase()}-0001`,
                  tier: `${specialPassCategory.toUpperCase()} PASS`,
                  passType: specialPassCategory,
                  fullName: specialFullName.trim() || 'Special Personnel',
                  email: specialEmail.trim() || 'official@afrinetgroup.com',
                  organization: specialOrg.trim() || 'RECON Secretariat',
                  role: specialRole.trim() || `${specialPassCategory.toUpperCase()} Personnel`,
                  phone: specialPhone.trim() || '+234 800 000 0000',
                  city: 'Abuja (FCT)',
                  photoUrl: specialPhotoUrl,
                  registeredAt: new Date().toISOString(),
                  accessDays: specialAccessDays,
                  qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=RECON-2026-${specialPassCategory.toUpperCase()}-0001`,
                  barcode: `RECON26${specialPassCategory.toUpperCase()}0001`,
                  amountPaid: 'COMPLIMENTARY / OFFICIAL',
                  paymentStatus: 'VERIFIED',
                  adminApproved: true,
                  adminApprovalStatus: 'APPROVED'
                };

                const issuedSpecialBadges = attendees.filter(a => 
                  ['press', 'official', 'security', 'vip', 'crew', 'medical'].includes(a.passType) ||
                  a.ticketNumber.includes('SPEC') ||
                  a.ticketNumber.includes('PRESS') ||
                  a.ticketNumber.includes('OFFICIAL') ||
                  a.ticketNumber.includes('SECURITY') ||
                  a.tier.toLowerCase().includes('press') ||
                  a.tier.toLowerCase().includes('official') ||
                  a.tier.toLowerCase().includes('security') ||
                  a.tier.toLowerCase().includes('crew') ||
                  a.tier.toLowerCase().includes('medical')
                );

                const filteredIssuedSpecialBadges = issuedSpecialBadges.filter(a => {
                  if (specialCategoryFilter !== 'all') {
                    return a.passType === specialCategoryFilter || a.tier.toLowerCase().includes(specialCategoryFilter);
                  }
                  return true;
                });

                return (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-lg shadow-purple-950/50">
                            <Award className="w-6 h-6" />
                          </div>
                          <div>
                            <h2 className="text-xl font-extrabold text-white font-display">Special Personnel Smart ID Card Generator</h2>
                            <p className="text-xs text-slate-400">
                              Generate, customize, and issue official accreditation Smart ID Cards for <strong className="text-fuchsia-300">Press &amp; Media</strong>, <strong className="text-blue-300">Secretariat Officials</strong>, <strong className="text-amber-300">Security Personnel</strong>, <strong className="text-emerald-300">Technical Crew</strong>, and <strong className="text-rose-300">Medical Responders</strong>.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Quick Presets Bar */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden lg:inline">Quick Presets:</span>
                        <button
                          type="button"
                          onClick={() => handleApplySpecialPreset('press')}
                          className="px-3 py-1.5 rounded-xl bg-fuchsia-500/20 hover:bg-fuchsia-500/30 text-fuchsia-200 border border-fuchsia-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                        >
                          <Camera className="w-3.5 h-3.5 text-fuchsia-300" />
                          <span>📸 Press</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApplySpecialPreset('official')}
                          className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                        >
                          <Building2 className="w-3.5 h-3.5 text-blue-300" />
                          <span>🏛️ Official</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApplySpecialPreset('security')}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                          <span>🛡️ Security</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApplySpecialPreset('vip')}
                          className="px-3 py-1.5 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 border border-yellow-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                          <span>👑 VIP</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApplySpecialPreset('crew')}
                          className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                        >
                          <Zap className="w-3.5 h-3.5 text-cyan-300" />
                          <span>🛠️ Crew</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApplySpecialPreset('medical')}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                        >
                          <Shield className="w-3.5 h-3.5 text-rose-300" />
                          <span>🚑 Medical</span>
                        </button>
                      </div>
                    </div>

                    {/* Main Generator Layout: Form + Live Smart ID Card Preview */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      {/* Left Col: Special Badge Creation Form (6 cols) */}
                      <div className="lg:col-span-6 bg-[#011710] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                            <Plus className="w-4 h-4 text-purple-400" />
                            <span>Special ID Card Form</span>
                          </h3>
                          <span className="text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 px-2.5 py-1 rounded-full border border-purple-500/30">
                            SECRETARIAT ID ISSUANCE
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          {/* Category Selector */}
                          <div className="sm:col-span-2">
                            <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                              Special Pass Category
                            </label>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                              {[
                                { id: 'press', label: 'PRESS', icon: Camera },
                                { id: 'official', label: 'OFFICIAL', icon: Building2 },
                                { id: 'security', label: 'SECURITY', icon: ShieldCheck },
                                { id: 'vip', label: 'VIP', icon: Sparkles },
                                { id: 'crew', label: 'CREW', icon: Zap },
                                { id: 'medical', label: 'MEDICAL', icon: Shield },
                              ].map(cat => (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onClick={() => setSpecialPassCategory(cat.id as any)}
                                  className={`py-2 px-2 rounded-xl text-xs font-black flex flex-col items-center gap-1 transition-all border cursor-pointer ${
                                    specialPassCategory === cat.id
                                      ? 'bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white border-white/40 shadow-lg ring-2 ring-purple-400/40 scale-[1.02]'
                                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                                  }`}
                                >
                                  <cat.icon className="w-4 h-4" />
                                  <span className="text-[10px] tracking-wider">{cat.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Name */}
                          <div>
                            <label className="block font-bold text-slate-300 mb-1">Full Name &amp; Title</label>
                            <input
                              type="text"
                              required
                              value={specialFullName}
                              onChange={(e) => setSpecialFullName(e.target.value)}
                              placeholder="e.g. Engr. Fatima Bello"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 text-xs"
                            />
                          </div>

                          {/* Official Role */}
                          <div>
                            <label className="block font-bold text-slate-300 mb-1">Designated Role / Title</label>
                            <input
                              type="text"
                              required
                              value={specialRole}
                              onChange={(e) => setSpecialRole(e.target.value)}
                              placeholder="e.g. Chief Photojournalist"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 text-xs"
                            />
                          </div>

                          {/* Organization / Agency */}
                          <div>
                            <label className="block font-bold text-slate-300 mb-1">Organization / Agency</label>
                            <input
                              type="text"
                              required
                              value={specialOrg}
                              onChange={(e) => setSpecialOrg(e.target.value)}
                              placeholder="e.g. NTA News Network / AIT"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 text-xs"
                            />
                          </div>

                          {/* Security Access / Zone Clearance */}
                          <div>
                            <label className="block font-bold text-slate-300 mb-1">Access Zone / Clearance</label>
                            <input
                              type="text"
                              value={specialAccessDays}
                              onChange={(e) => setSpecialAccessDays(e.target.value)}
                              placeholder="e.g. All-Zone 24/7 Clearance"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 text-xs"
                            />
                          </div>

                          {/* Phone */}
                          <div>
                            <label className="block font-bold text-slate-300 mb-1">Contact Phone</label>
                            <input
                              type="text"
                              value={specialPhone}
                              onChange={(e) => setSpecialPhone(e.target.value)}
                              placeholder="+234 803 000 0000"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 text-xs"
                            />
                          </div>

                          {/* Email */}
                          <div>
                            <label className="block font-bold text-slate-300 mb-1">Contact Email</label>
                            <input
                              type="email"
                              value={specialEmail}
                              onChange={(e) => setSpecialEmail(e.target.value)}
                              placeholder="official@agency.gov.ng"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 text-xs"
                            />
                          </div>

                          {/* Photo Section */}
                          <div className="sm:col-span-2 bg-black/30 border border-white/10 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              {specialPhotoUrl ? (
                                <img
                                  src={specialPhotoUrl}
                                  alt="Photo Preview"
                                  className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-400 shadow-md"
                                />
                              ) : (
                                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-slate-400">
                                  <Camera className="w-6 h-6" />
                                </div>
                              )}
                              <div>
                                <h4 className="font-bold text-white text-xs">Biometric Passport Photo</h4>
                                <p className="text-[10px] text-slate-400">
                                  Take live photo using webcam or select preset image
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setSpecialPhotoStudioOpen(true)}
                                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-400 hover:to-fuchsia-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
                              >
                                <Camera className="w-4 h-4" />
                                <span>Camera Studio</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={handleGenerateAndSaveSpecialBadge}
                            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-emerald-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/60 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Issue &amp; Save To Official Database</span>
                          </button>
                        </div>
                      </div>

                      {/* Right Col: Live Generated Smart ID Card Component (6 cols) */}
                      <div className="lg:col-span-6 flex flex-col items-center">
                        <div className="w-full bg-[#01140e] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-2xl space-y-4">
                          <div className="w-full flex items-center justify-between border-b border-white/10 pb-3">
                            <span className="text-xs font-black text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-purple-400" />
                              Live Smart ID Card Render
                            </span>
                            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                              410px × 600px ISO STANDARD
                            </span>
                          </div>

                          {/* Live Rendered Card Component */}
                          <div className="w-full flex justify-center py-3">
                            <SmartIdCard
                              ticket={constructedSpecialTicket}
                              showActions={true}
                              isAdmin={true}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Issued Special Badges Database Register Table */}
                    <div className="bg-[#01140e] border border-white/10 rounded-3xl p-5 shadow-xl space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                        <div>
                          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-400" />
                            <span>Issued Special Badges Register ({issuedSpecialBadges.length})</span>
                          </h3>
                          <p className="text-xs text-slate-400">
                            List of all accreditation passes issued for Press, Officials, Security, VIPs, Crew, and Emergency Medical.
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Filter Buttons */}
                          {['all', 'press', 'official', 'security', 'vip', 'crew', 'medical'].map(cat => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setSpecialCategoryFilter(cat)}
                              className={`px-3 py-1 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                                specialCategoryFilter === cat
                                  ? 'bg-purple-500 text-white font-black shadow-md'
                                  : 'bg-white/5 hover:bg-white/10 text-slate-400 border border-white/10'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Register Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                              <th className="py-2.5 px-3">Badge Number</th>
                              <th className="py-2.5 px-3">Personnel Name</th>
                              <th className="py-2.5 px-3">Category</th>
                              <th className="py-2.5 px-3">Role / Designation</th>
                              <th className="py-2.5 px-3">Organization</th>
                              <th className="py-2.5 px-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-slate-200">
                            {filteredIssuedSpecialBadges.length > 0 ? (
                              filteredIssuedSpecialBadges.map((badge) => (
                                <tr key={badge.ticketNumber} className="hover:bg-white/5 transition-colors">
                                  <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                                    {badge.ticketNumber}
                                  </td>
                                  <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                                    {badge.photoUrl ? (
                                      <img src={badge.photoUrl} alt="" className="w-7 h-7 rounded-full object-cover border border-purple-400" />
                                    ) : (
                                      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs">
                                        👤
                                      </div>
                                    )}
                                    <span>{badge.fullName}</span>
                                  </td>
                                  <td className="py-3 px-3">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                      badge.passType === 'press' ? 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40' :
                                      badge.passType === 'official' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                                      badge.passType === 'security' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                                      badge.passType === 'vip' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' :
                                      badge.passType === 'crew' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' :
                                      'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                    }`}>
                                      {badge.passType.toUpperCase()}
                                    </span>
                                  </td>
                                  <td className="py-3 px-3 text-slate-300">{badge.role}</td>
                                  <td className="py-3 px-3 text-slate-300">{badge.organization}</td>
                                  <td className="py-3 px-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSpecialPassCategory(badge.passType as any);
                                          setSpecialFullName(badge.fullName);
                                          setSpecialRole(badge.role);
                                          setSpecialOrg(badge.organization);
                                          setSpecialPhone(badge.phone || '');
                                          setSpecialEmail(badge.email || '');
                                          setSpecialAccessDays(badge.accessDays);
                                          if (badge.photoUrl) setSpecialPhotoUrl(badge.photoUrl);
                                          showToast(`Loaded ${badge.fullName}'s badge for preview.`);
                                        }}
                                        className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/30 font-bold text-[11px] cursor-pointer"
                                      >
                                        Preview
                                      </button>

                                      {(isMainAdmin || canDelete) && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            requestConfirmation(
                                              "Revoke Special Badge",
                                              `Revoke and delete special badge for ${badge.fullName} (${badge.ticketNumber})?`,
                                              () => {
                                                deleteAttendee(badge.ticketNumber);
                                                showToast(`Revoked badge ${badge.ticketNumber}.`);
                                              }
                                            );
                                          }}
                                          className="p-1 rounded-lg bg-white/10 hover:bg-red-500 hover:text-white text-slate-400 transition-colors cursor-pointer"
                                          title="Revoke Badge"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                                  No special badges issued yet for this category. Fill out the form above to issue an official accreditation pass.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Photo Capture Studio Modal */}
                    {specialPhotoStudioOpen && (
                      <PhotoCaptureStudio
                        isOpen={specialPhotoStudioOpen}
                        onClose={() => setSpecialPhotoStudioOpen(false)}
                        onPhotoCaptured={(url) => {
                          setSpecialPhotoUrl(url);
                          setSpecialPhotoStudioOpen(false);
                          showToast("Passport photo captured &amp; applied to special badge!");
                        }}
                      />
                    )}
                  </div>
                );
              })()}

              {/* ========================================================= */}
              {/* TAB 12: ADMIN SECURITY & BACKUPS */}
              {/* ========================================================= */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-3xl">
                  <div>
                    <h2 className="text-xl font-bold text-white font-display">Admin Security & Data Backups</h2>
                    <p className="text-xs text-slate-400">
                      Update your administrator credentials, download full website JSON snapshots, or restore backups.
                    </p>
                  </div>

                  {/* Change Credentials Card */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      <span>Change Administrator Username & Password</span>
                    </h3>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (newAdminPass !== confirmAdminPass) {
                          alert("New password and confirmation do not match.");
                          return;
                        }
                        const res = updateAdminCredentials(newAdminUser || adminCredentials.username, newAdminPass);
                        if (res.success) {
                          showToast(res.message);
                          setNewAdminPass('');
                          setConfirmAdminPass('');
                        } else {
                          alert(res.message);
                        }
                      }}
                      className="space-y-3 text-xs"
                    >
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">Administrator Username</label>
                        <input
                          type="text"
                          required
                          defaultValue={adminCredentials.username}
                          onChange={(e) => setNewAdminUser(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">New Password (Min 5 chars)</label>
                          <input
                            type="password"
                            required
                            value={newAdminPass}
                            onChange={(e) => setNewAdminPass(e.target.value)}
                            placeholder="Enter new strong password"
                            className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Confirm New Password</label>
                          <input
                            type="password"
                            required
                            value={confirmAdminPass}
                            onChange={(e) => setConfirmAdminPass(e.target.value)}
                            placeholder="Re-type new password"
                            className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold"
                        >
                          Update Admin Password
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* JSON Backup & Restore Card */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      <span>Full Website Data Backup & Restore</span>
                    </h3>
                    <p className="text-xs text-slate-300">
                      Download a single JSON file containing all event text, speakers, programmes, tiers, and registrations. You can restore this file at any time.
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={handleDownloadBackup}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Complete Website JSON Backup</span>
                      </button>

                      <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Upload className="w-4 h-4 text-emerald-400" />
                        <span>Restore from JSON</span>
                      </button>
                    </div>

                    {isImportModalOpen && (
                      <div className="p-4 rounded-xl bg-black/60 border border-white/15 space-y-3 mt-4">
                        <h4 className="font-bold text-white text-xs">Paste Backup JSON to Restore</h4>
                        <textarea
                          rows={6}
                          value={importJsonText}
                          onChange={(e) => setImportJsonText(e.target.value)}
                          placeholder="Paste full JSON backup content here..."
                          className="w-full p-2.5 rounded-xl bg-black/50 border border-white/15 text-white font-mono text-[10px]"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setIsImportModalOpen(false);
                              setImportJsonText('');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-white/10 text-slate-300 text-xs"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              if (!importJsonText.trim()) return;
                              const res = importDataJson(importJsonText);
                              if (res.success) {
                                showToast(res.message);
                                setIsImportModalOpen(false);
                                setImportJsonText('');
                              } else {
                                alert(res.message);
                              }
                            }}
                            className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs"
                          >
                            Import & Apply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 13: STAFF ACCOUNTS & PERMISSIONS MANAGER */}
              {/* ========================================================= */}
              {activeTab === 'staff' && (
                adminAuth.isAuthenticated ? (
                  <StaffManagerTab
                    staffAccounts={staffAccounts}
                    adminUsername={adminAuth.user || 'admin'}
                    onRegisterStaff={registerStaff}
                    onUpdateStaff={updateStaff}
                    onDeleteStaff={deleteStaff}
                    onTestLoginStaff={(usr, pwd) => {
                      const res = loginStaff(usr, pwd);
                      if (res.success) {
                        showToast(`Switched session to Staff Member "${usr}"`);
                      }
                    }}
                    showToast={showToast}
                  />
                ) : (
                  <div className="p-8 text-center bg-white/5 border border-white/10 rounded-3xl space-y-3">
                    <Lock className="w-12 h-12 text-amber-400 mx-auto" />
                    <h3 className="text-lg font-bold text-white font-display">Administrator Access Required</h3>
                    <p className="text-xs text-slate-300 max-w-md mx-auto">
                      Staff account creation and permissions management can only be accessed by the System Administrator.
                    </p>
                  </div>
                )
              )}

              {/* ========================================================= */}
              {/* TAB 14: MARKETER REFERRAL SYSTEM & COMMISSIONS */}
              {/* ========================================================= */}
              {activeTab === 'marketer' && (
                <MarketerManagerTab
                  marketerAccounts={marketerAccounts}
                  attendees={attendees}
                  isMainAdmin={isMainAdmin || false}
                  onRegisterMarketer={registerMarketer}
                  onUpdateMarketer={updateMarketer}
                  onDeleteMarketer={deleteMarketer}
                  onConfirmCommissionPayment={confirmCommissionPayment}
                  onTestLoginMarketer={(usr, pwd) => {
                    const res = loginMarketer(usr, pwd);
                    if (res.success) {
                      showToast(`Logged into Marketer Account "${usr}"`);
                    }
                  }}
                  showToast={showToast}
                />
              )}

              {/* ========================================================= */}
              {/* TAB 15: PUSH NOTIFICATION MANAGER */}
              {/* ========================================================= */}
              {activeTab === 'push_notif' && (
                <PushNotificationManagerTab
                  showToast={showToast}
                  requestConfirmation={requestConfirmation}
                />
              )}

              {/* ========================================================= */}
              {/* TAB 16: SYSTEM & FEATURE ZIP UPDATE */}
              {/* ========================================================= */}
              {activeTab === 'system_update' && (
                <SystemUpdateTab showToast={showToast} />
              )}

              {/* ========================================================= */}
              {/* TAB 18: EMAIL MARKETING & 30-DAY AUTOMATIONS SUITE */}
              {/* ========================================================= */}
              {activeTab === 'email_marketing' && (
                <EmailMarketingSuiteTab
                  attendees={attendees}
                  showToast={showToast}
                  onOpenSmtpSettings={() => setActiveTab('smtp')}
                  onConfirmAttendeePayment={(ticketNum) => {
                    updateAttendee(ticketNum, {
                      adminApproved: true,
                      adminApprovalStatus: 'APPROVED',
                      adminApprovedAt: new Date().toISOString(),
                      paymentStatus: 'PAID'
                    });
                    showToast(`✅ Admin confirmed payment for ticket ${ticketNum}. Automatic drip follow-up halted.`);
                  }}
                />
              )}

              {/* ========================================================= */}
              {/* TAB 19: SMTP EMAIL SERVER & INBOX DELIVERABILITY */}
              {/* ========================================================= */}
              {activeTab === 'smtp' && (
                <SmtpSettingsTab
                  attendees={attendees}
                  showToast={showToast}
                />
              )}

              {/* ========================================================= */}
              {/* TAB 20: META (FACEBOOK) & TIKTOK PIXEL CONVERSION TRACKER */}
              {/* ========================================================= */}
              {activeTab === 'pixel_tracking' && (
                <PixelTrackingTab showToast={showToast} />
              )}

              {/* ========================================================= */}
              {/* TAB 21: SEO, AEO (AI LLM) & GOOGLE/BING SCHEMA ENGINE */}
              {/* ========================================================= */}
              {activeTab === 'seo_engine' && (
                <SeoSettingsTab showToast={showToast} />
              )}

            </div>
          </div>
        </div>
      )}
      {/* Confirmation Dialog Modal with Portal */}
      {confirmModal.isOpen && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        >
          <div 
            className="bg-[#031d17] border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0 mt-0.5">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white font-display">{confirmModal.title || 'Confirm Action'}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{confirmModal.message}</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal(prev => ({ ...prev, isOpen: false }));
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold transition-all cursor-pointer shadow-lg"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
      {/* Delegate User Account & Generated ID Card Inspector Modal */}
      {liveViewingTicket && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-5 sm:p-6 max-w-4xl w-full max-h-[94vh] overflow-y-auto space-y-5 shadow-2xl relative my-auto">
            
            {/* Modal Top Banner & Close Button */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-emerald-950 font-black shadow-lg">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Delegate Account & Generated Smart ID Card</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">{liveViewingTicket.fullName}</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Ticket #: <strong className="text-emerald-300">{liveViewingTicket.ticketNumber}</strong> • Pass Tier: <strong className="text-amber-300 uppercase">{liveViewingTicket.tier}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setViewingIdCardTicket(null);
                  setIsSnappingPhotoForAdmin(false);
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Close Inspector"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Delegate Credentials & Status Controls */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* Account Details */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Account Credentials</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                      VERIFIED ACCOUNT
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Organization</span>
                      <span className="font-bold text-white line-clamp-1">{liveViewingTicket.organization || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Job Title / Role</span>
                      <span className="font-bold text-white line-clamp-1">{liveViewingTicket.role || 'Delegate'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Email Address</span>
                      <span className="font-mono text-emerald-300 line-clamp-1">{liveViewingTicket.email}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Phone Number</span>
                      <span className="font-mono text-white">{liveViewingTicket.phone || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Amount Paid</span>
                      <span className="font-mono font-bold text-emerald-400">{liveViewingTicket.amountPaid || '₦0'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Payment Ref</span>
                      <span className="font-mono text-[10px] text-amber-300 line-clamp-1">{liveViewingTicket.paymentRef || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Admin Clearance & Payment Override Box */}
                <div className="bg-black/50 border border-emerald-500/30 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Pass Clearance & ID Card Status</span>
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      liveViewingTicket.adminApproved || liveViewingTicket.adminApprovalStatus === 'APPROVED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {liveViewingTicket.adminApproved || liveViewingTicket.adminApprovalStatus === 'APPROVED' ? 'UNLOCKED (APPROVED)' : 'LOCKED (PENDING)'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {liveViewingTicket.adminApproved || liveViewingTicket.adminApprovalStatus === 'APPROVED'
                      ? '✅ Delegate account is verified and cleared. Smart ID Card is fully active for venue entry, QR scanning, and PDF/PNG export.'
                      : '🔒 Payment clearance pending. Click below to approve and immediately unlock this delegate\'s Smart ID Card.'}
                  </p>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const isCurrentlyApproved = liveViewingTicket.adminApproved || liveViewingTicket.adminApprovalStatus === 'APPROVED';
                        const nextVal = !isCurrentlyApproved;
                        updateAttendee(liveViewingTicket.ticketNumber, {
                          adminApproved: nextVal,
                          adminApprovalStatus: nextVal ? 'APPROVED' : 'PENDING',
                          adminApprovedAt: nextVal ? new Date().toISOString() : undefined,
                          paymentStatus: nextVal ? 'PAID' : 'PENDING'
                        });
                        showToast(nextVal ? `✅ Payment APPROVED for ${liveViewingTicket.fullName} — Smart ID Card unlocked.` : `⏳ Clearance set to Pending for ${liveViewingTicket.fullName}`);
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl font-black text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-95 ${
                        liveViewingTicket.adminApproved || liveViewingTicket.adminApprovalStatus === 'APPROVED'
                          ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                      }`}
                    >
                      {liveViewingTicket.adminApproved || liveViewingTicket.adminApprovalStatus === 'APPROVED' ? (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Revoke Clearance (Lock ID Card)</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="w-4 h-4" />
                          <span>Approve Payment & Unlock ID Card</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Gate Attendance Control */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-white text-xs block">Gate Attendance Status</span>
                    <span className="text-[10px] text-slate-400">
                      {liveViewingTicket.checkedIn
                        ? `Checked in at ${liveViewingTicket.checkedInAt ? new Date(liveViewingTicket.checkedInAt).toLocaleTimeString() : 'Gate'}`
                        : 'Not checked in yet'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const ok = toggleCheckInAttendee(liveViewingTicket.ticketNumber);
                      if (ok) {
                        showToast(liveViewingTicket.checkedIn ? `Check-in cancelled` : `Checked In: ${liveViewingTicket.fullName}`);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      liveViewingTicket.checkedIn
                        ? 'bg-emerald-500 text-emerald-950'
                        : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/15'
                    }`}
                  >
                    {liveViewingTicket.checkedIn ? 'CHECKED IN' : 'Mark Checked In'}
                  </button>
                </div>

                {/* Photo Capture / Upload Control for Admin */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white text-xs flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Delegate Badge Portrait Photo</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsSnappingPhotoForAdmin(!isSnappingPhotoForAdmin)}
                      className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                    >
                      {isSnappingPhotoForAdmin ? 'Close Studio' : 'Update / Snap Photo'}
                    </button>
                  </div>

                  {isSnappingPhotoForAdmin && (
                    <div className="pt-2 border-t border-white/10">
                      <PhotoCaptureStudio
                        currentPhotoUrl={liveViewingTicket.photoUrl}
                        fullName={liveViewingTicket.fullName}
                        onPhotoSelected={(newPhotoUrl) => {
                          updateAttendee(liveViewingTicket.ticketNumber, { photoUrl: newPhotoUrl });
                          setIsSnappingPhotoForAdmin(false);
                          showToast(`Updated profile photo for ${liveViewingTicket.fullName}`);
                        }}
                      />
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: Embedded Smart ID Card Badge */}
              <div className="lg:col-span-7 bg-black/70 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 flex flex-col items-center space-y-4 shadow-inner">
                <div className="w-full flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <QrCode className="w-4 h-4" />
                    <span>Generated Smart ID Card Badge</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Official Venue Credential
                  </span>
                </div>

                {/* Smart ID Card Renderer */}
                <div className="w-full flex justify-center pt-2">
                  <SmartIdCard ticket={liveViewingTicket} isAdmin={true} />
                </div>
              </div>

            </div>

            {/* Corporate Staff Badges Management (Exhibitors, Sponsors, Partners) */}
            {(liveViewingTicket.passType === 'exhibitor' || liveViewingTicket.passType === 'sponsor' || liveViewingTicket.passType === 'partner' || (liveViewingTicket.maxStaffBadges && liveViewingTicket.maxStaffBadges > 1)) && (
              <div className="pt-4 border-t border-white/10">
                <CompanyStaffBadgeManager
                  ticket={liveViewingTicket}
                  isAdmin={true}
                  onUpdateTicket={(tNum, updated) => {
                    updateAttendee(tNum, updated);
                  }}
                  showToast={showToast}
                />
              </div>
            )}

          </div>
        </div>
      )}

      {/* Gate QR & Barcode Camera Scanner Modal */}
      <GateScannerModal
        isOpen={isGateScannerOpen}
        onClose={() => setIsGateScannerOpen(false)}
        attendees={attendees}
        onToggleCheckIn={(ticketNumber: string) => {
          const ok = toggleCheckInAttendee(ticketNumber);
          if (ok) {
            showToast("Attendee gate status updated.");
          }
          return ok;
        }}
      />

      {/* Digital QR Check-In Pass Viewer Modal */}
      <QrPassViewerModal
        ticket={viewingQrPassTicket}
        onClose={() => setViewingQrPassTicket(null)}
        onToggleCheckIn={(ticketNumber: string) => {
          const ok = toggleCheckInAttendee(ticketNumber);
          if (ok) {
            showToast("Delegate gate status updated.");
          }
          return ok;
        }}
        onViewFullIdCard={(ticket) => {
          setViewingIdCardTicket(ticket);
        }}
        showToast={showToast}
      />
    </div>
  );
};
