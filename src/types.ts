export interface IdCardSettings {
  verticalBannerText?: string;      // Vertical right-side text (e.g., "8th Real Estate & Construction Expo")
  headerTitle?: string;              // Badge logo title (e.g., "RECON EXPO")
  headerSubtitle?: string;           // Badge subtitle (e.g., "REAL ESTATE & CONSTRUCTION EXPO")
  securityRibbonTop?: string;        // Top security ticker text
  securityRibbonBottom?: string;     // Bottom security ticker text
  backConciergeHeader?: string;      // Back-side concierge title
  wifiSsid?: string;                 // Back-side Wi-Fi SSID
  backRule1?: string;                // Back-side protocol rule 1
  backRule2?: string;                // Back-side protocol rule 2
  backRule3?: string;                // Back-side protocol rule 3
  secretariatHelpline?: string;      // Back-side emergency helpline label
  badgePassTypeLabels?: Record<string, string>; // Custom badge pass labels (press, official, vip, sponsor, etc.)
}

export interface SiteTexts {
  // Navigation Bar Texts
  navAnnouncementVenue?: string;
  navAnnouncementHelplinePrefix?: string;
  navDelegatePortalBtn?: string;
  navRegisterBtn?: string;

  // Hero Section Texts
  heroTopBadge?: string;
  heroCategory?: string;
  heroThemeLabel?: string;
  heroOrganizerLabel?: string;
  heroOrganizerText?: string;
  heroPrimaryCta?: string;
  heroSecondaryCta?: string;
  heroCountdownTitle?: string;
  heroStat1Label?: string;
  heroStat2Label?: string;
  heroStat3Label?: string;
  heroStat4Label?: string;
  heroEventInfoDateLabel?: string;
  heroEventInfoDateSubtitle?: string;
  heroEventInfoLocationLabel?: string;
  heroEventInfoTimeLabel?: string;
  heroEventInfoTimeSubtitle?: string;

  // Sectors / Ecosystem Section
  sectorsBadge?: string;
  sectorsHeading?: string;
  sectorsConveningBarTitle?: string;
  sectorsConveningPills?: string;

  // Keynotes & Speakers Section
  speakersBadge?: string;
  speakersHeading?: string;
  speakersSubtitle?: string;
  speakersCtaButton?: string;
  
  // Additional Panelists & Chairs Section
  panelistsBadge?: string;
  panelistsHeading?: string;
  panelistsSubtitle?: string;
  panelistsGuideBadge?: string;

  // Programme Section
  programmeBadge?: string;
  programmeHeading?: string;
  programmeSubtitle?: string;
  programmeDownloadBtn?: string;

  // Registration & Participation Tiers
  registrationBadge?: string;
  registrationHeading?: string;
  registrationSubtitle?: string;
  registrationCheckBadgeBtn?: string;
  registrationSecretariatNoteTitle?: string;
  registrationSecretariatNoteText?: string;
  registrationSecretariatHelplineText?: string;

  // Sponsors & Strategic Partners
  sponsorsBadge?: string;
  sponsorsHeading?: string;
  sponsorsSubtitle?: string;
  supportersHeading?: string;
  supportersSubtitle?: string;
  sponsorsCtaBadge?: string;
  sponsorsCtaTitle?: string;
  sponsorsCtaHeading?: string;
  sponsorsCtaSubtitle?: string;
  sponsorsCtaButton?: string;
  sponsorsPartnerButton?: string;

  // Marketer / Affiliate Section
  marketerBadge?: string;
  marketerHeading?: string;
  marketerSubtitle?: string;
  marketerSubtitleTag?: string;
  marketerDescription?: string;
  marketerCommissionRate?: string;
  marketerCard1Title?: string;
  marketerCard1Desc?: string;
  marketerCard2Title?: string;
  marketerCard2Desc?: string;
  marketerCard3Title?: string;
  marketerCard3Desc?: string;
  marketerCard4Title?: string;
  marketerCard4Desc?: string;
  marketerCtaBadge?: string;
  marketerCtaHeading?: string;
  marketerCtaSubtitle?: string;
  marketerBtnRegister?: string;
  marketerBtnLogin?: string;

  // FAQs Section
  faqBadge?: string;
  faqHeading?: string;
  faqSubtitle?: string;

  // Registration & Payment Pricing Settings
  registrationPaymentBtnLabel?: string;
  registrationDiscountBtnLabel?: string;
  registrationMainFeeLabel?: string;
  registrationDiscountFeeLabel?: string;
  registrationDiscountAmountLabel?: string;
  elitePaymentLink?: string;
  discountPaymentLink?: string;

  // Footer & Conversion CTA Section
  footerCtaBadge?: string;
  footerCtaHeading?: string;
  footerCtaSubtitle?: string;
  footerCtaButton?: string;
  footerPrimaryCta?: string;
  footerSecondaryCta?: string;
  footerAboutText?: string;
  footerOrganizerLabel?: string;
  footerOrganizerText?: string;
  footerQuickLinksTitle?: string;
  footerHelplineTitle?: string;
  footerSecretariatTitle?: string;
  footerSecretariatSubtitle?: string;
  footerCopyright?: string;
  footerCopyrightText?: string;
  footerDeveloperLabel?: string;
  footerDeveloperPhone?: string;
  footerDeveloperName?: string;
}

export interface ExpoDetails {
  name: string;
  shortName: string;
  theme: string;
  subheading: string;
  dateRange: string;
  startDate: string;
  endDate: string;
  dailyTime: string;
  venue: string;
  venueAddress: string;
  contactEmail: string;
  contactPhone: string;
  contactPhone2: string;
  contactPhone3?: string;
  contactPhone4?: string;
  whatsapp?: string;
  totalEventDays?: number;
  logoUrl?: string;
  logoType?: 'default' | 'custom';
  stats: {
    attendees: string;
    exhibitors: string;
    speakers: string;
    countries: string;
    dealsProjected: string;
    b2bMeetings: string;
  };
  programmePdfUrl?: string;
  programmePdfName?: string;
  programmePdfSize?: string;
  programmePdfUpdatedAt?: string;
  idCard?: IdCardSettings;
  siteTexts?: SiteTexts;
}

export interface HeroBackgroundSlide {
  id?: string;
  url: string;
  title: string;
  city: string;
  edition: string;
  description: string;
  transitionEffect: string;
}

export interface SectorItem {
  id?: string;
  title: string;
  desc: string;
  icon: string;
}

export interface FaqItem {
  id?: string;
  q: string;
  a: string;
}

export interface Speaker {
  id: string;
  name: string;
  title: string;
  organization: string;
  bio: string;
  fullBio: string;
  image: string;
  topic: string;
  keynote: boolean;
  track: 'Strategy' | 'Investment' | 'Technology' | 'Architecture' | 'Policy' | string;
  linkedin?: string;
  twitter?: string;
}

export interface Session {
  id: string;
  day: number;
  date: string;
  time: string;
  title: string;
  description: string;
  category: 'Keynote' | 'Panel Discussion' | 'Workshop' | 'Exhibition & Demo' | 'Networking' | 'Investor Pitch' | 'Awards' | string;
  speakerId?: string;
  speakerName?: string;
  speakerRole?: string;
  speakerImage?: string;
  location: string;
  iconName: string;
  featured?: boolean;
}

export interface BoothPackage {
  id: string;
  name: string;
  priceNGN: number;
  priceFormatted: string;
  badges: number;
  commissionRate: number; // e.g. 0.10 for 10%
  desc: string;
  active?: boolean;
}

export interface RegistrationTier {
  id: 'attendee' | 'exhibitor' | 'sponsor' | 'partner' | string;
  title: string;
  badge: string;
  tagline: string;
  targetAudience: string;
  priceNGN: string;
  priceUSD: string;
  discountPriceNGN?: string;
  discountPriceUSD?: string;
  discountAmountNGN?: string;
  popular?: boolean;
  features: string[];
  ctaText: string;
  discountCtaText?: string;
  paymentLink?: string;
  discountPaymentLink?: string;
  accentColor: 'green' | 'red' | 'emerald' | string;
  defaultMaxStaffBadges?: number;
}

export interface Sponsor {
  id?: string;
  name: string;
  category: 'headline' | 'platinum' | 'gold' | 'silver' | 'bronze' | 'tech' | 'institutional' | 'strategic' | 'media' | string;
  tierType?: 'sponsor' | 'partner';
  logoPlaceholder: string;
  logoUrl?: string;
  tagline: string;
  industry: string;
  country: string;
  website?: string;
}

export type AttendeePassType = 'visitor' | 'elite' | 'exhibitor' | 'sponsor' | 'partner';

export type LeadLevelNumber = 1 | 2 | 3 | 4 | 5 | 6;

export interface LeadLevelConfig {
  level: LeadLevelNumber;
  code: string;
  name: string;
  shortName: string;
  category: 'Top of Funnel' | 'Middle of Funnel' | 'Bottom of Funnel' | 'Accredited';
  badgeColor: string;
  description: string;
  actionPrompt: string;
  targetConversionRate: number;
}

export interface CompanyStaffBadge {
  id: string;
  fullName: string;
  role: string;
  photoUrl?: string;
  badgeNumber: string;
  registeredAt?: string;
}

export interface AttendeeTicket {
  ticketNumber: string;
  tier: string;
  passType: 'visitor' | 'elite' | 'exhibitor' | 'sponsor' | 'partner' | string;
  category?: string;
  fullName: string;
  email: string;
  organization: string;
  role: string;
  phone: string;
  city?: string;
  registeredAt: string;
  accessDays: string;
  qrCodeUrl: string;
  barcode?: string;
  photoUrl?: string;
  amountPaid?: string;
  paymentRef?: string;
  paymentStatus?: 'FREE' | 'PAID' | 'VERIFIED' | 'PENDING' | 'DECLINED';
  accessLevel?: string;
  benefits?: string[];
  rfidCode?: string;
  checkedIn?: boolean;
  checkedInAt?: string;
  adminApproved?: boolean;
  adminApprovedAt?: string;
  adminApprovalStatus?: 'APPROVED' | 'DECLINED' | 'PENDING';
  // Staff ID Badges Allowance per corporate payment
  maxStaffBadges?: number;
  staffBadges?: CompanyStaffBadge[];
  // Lead Generation Matrix & Level Process Properties
  leadLevel?: LeadLevelNumber;
  leadScore?: number;
  dealValue?: number;
  leadSource?: string;
  leadNotes?: string;
  assignedOfficer?: string;
  lastContactedAt?: string;
  industrySector?: string;
  priorityLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'VIP_CRITICAL';
  // Referral & Marketer Commission Properties
  referralCode?: string;
  marketerId?: string;
  marketerName?: string;
  discountAppliedNGN?: number;
  commissionEarnedNGN?: number;
  discountAmountNGN?: number;
  commissionPaidNGN?: number;
  commissionCredited?: boolean;
  commissionApprovedAt?: string;
  commissionApprovedBy?: string;
  avatarUrl?: string;
}

export interface CommissionPaymentConfirmation {
  id: string;
  referenceNumber: string;
  reference?: string;
  marketerId: string;
  marketerCode?: string;
  marketerName: string;
  referralCode: string;
  amountNGN: number;
  paidAt: string;
  paymentDate?: string;
  status: 'CONFIRMED' | 'PROCESSING' | 'PENDING';
  bankName: string;
  accountNumber: string;
  accountName: string;
  confirmedBy: string;
  paidByAdminName?: string;
  paymentMethod: string;
  notes?: string;
  referralCountCovered?: number;
  verificationHash?: string;
}

export interface MarketerAccount {
  id: string;
  fullName: string;
  username: string;
  password: string;
  email: string;
  phone?: string;
  referralCode: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  createdAt: string;
  lastLogin?: string | null;
  totalEarningsNGN: number;
  paidEarningsNGN?: number;
  pendingEarningsNGN?: number;
  payoutStatus?: 'UNPAID' | 'PARTIAL' | 'PAID';
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  notes?: string;
  paymentConfirmations?: CommissionPaymentConfirmation[];
}

export interface MarketerAuthState {
  isAuthenticated: boolean;
  marketer: MarketerAccount | null;
  loginTime: string | null;
}

export interface ReferralVerificationResult {
  valid: boolean;
  message: string;
  marketer?: MarketerAccount;
  code?: string;
  discountAppliedNGN: number;
  commissionEarnedNGN: number;
  finalPriceNGN: number;
  originalPriceNGN: number;
}

export interface AdminCredentials {
  username: string;
  passwordHash: string; // or plain for client-side demo
  lastUpdated: string;
}

export interface AdminAuthState {
  isAuthenticated: boolean;
  user: string | null;
  loginTime: string | null;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  inquiryType: string;
  message: string;
  submittedAt: string;
  status: 'unread' | 'read' | 'replied';
  replyNotes?: string;
}

export interface StaffPermissions {
  canRegisterAttendees: boolean;
  canCheckIn: boolean;
  canManageInbox: boolean;
  canManageSchedule: boolean;
  canManageSpeakers: boolean;
  canViewPayments: boolean;
  canManageSponsors: boolean;
  canExportData: boolean;
  canManageLeadMatrix: boolean;
}

export interface StaffAccount {
  id: string;
  fullName: string;
  username: string;
  password: string;
  email: string;
  phone?: string;
  role: string;
  department: string;
  permissions: StaffPermissions;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
  lastLogin?: string | null;
  registeredBy?: string;
  notes?: string;
}

export interface StaffAuthState {
  isAuthenticated: boolean;
  staff: StaffAccount | null;
  loginTime: string | null;
  permissions?: StaffPermissions;
}

export type PushNotificationCategory = 
  | 'Exhibitor Alert' 
  | 'Sponsor Alert' 
  | 'Partner Alert' 
  | 'Housing & Investment' 
  | 'Event Alert' 
  | 'Keynote Session' 
  | 'Gala Dinner' 
  | 'Trade Floor Deal'
  | 'General' 
  | string;

export type PushTargetAudience = 
  | 'ALL' 
  | 'EXHIBITORS' 
  | 'SPONSORS' 
  | 'PARTNERS' 
  | 'VISITORS' 
  | 'DELEGATES' 
  | string;

export interface PushNotificationItem {
  id: string;
  title: string;
  message: string;
  imageUrl?: string;
  targetLink?: string;
  category: PushNotificationCategory;
  targetAudience?: PushTargetAudience;
  sentAt: string;
  subscriberCount?: number;
  clickCount?: number;
  status: 'SENT' | 'SCHEDULED' | 'DRAFT';
  badgeText?: string;
  priority?: 'HIGH' | 'NORMAL' | 'URGENT';
}

export interface PushSubscriptionState {
  isSubscribed: boolean;
  subscribedAt?: string;
  preference?: 'yes' | 'no' | 'all';
  deviceToken?: string;
}

