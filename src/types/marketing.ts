export type EmailBlockType = 
  | 'header'
  | 'hero'
  | 'image'
  | 'text'
  | 'button'
  | 'speaker_grid'
  | 'schedule_box'
  | 'qr_badge'
  | 'features_2col'
  | 'pricing_table'
  | 'countdown_badge'
  | 'social_links'
  | 'divider'
  | 'footer';

export interface EmailBlockItem {
  title: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  imageAlt?: string;
  tag?: string;
  url?: string;
}

export interface EmailBlock {
  id: string;
  type: EmailBlockType;
  title?: string;
  subtitle?: string;
  content?: string;
  buttonText?: string;
  buttonUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
  imageCaption?: string;
  imageWidth?: string; // '100%' | '80%' | '60%' | '50%' | '400px' | '280px'
  imageBorderRadius?: string; // '0px' | '8px' | '12px' | '16px' | '9999px'
  imagePosition?: 'top' | 'bottom' | 'inline' | 'left' | 'right';
  bgColor?: string;
  textColor?: string;
  align?: 'left' | 'center' | 'right';
  padding?: string;
  items?: EmailBlockItem[];
}

export interface EmailTemplate {
  id: string;
  name: string;
  category: 'onboarding' | 'announcements' | 'exhibitors' | 'sponsors' | 'schedule' | 'promotions' | 'post_event' | 'newsletter' | 'drip_nurture';
  categoryLabel: string;
  subject: string;
  preheader: string;
  description: string;
  thumbnailIcon: string;
  badge?: string;
  blocks: EmailBlock[];
  customHtml?: string;
  isCustom?: boolean;
  updatedAt?: string;
}

export interface AutomationStep {
  id: string;
  day: number; // e.g. 0, 1, 2, 3, 5, 7, 10, 14, 18, 21, 25, 28, 30, 31
  title: string;
  subtitle: string;
  targetAudience: 'all' | 'delegates' | 'visitors' | 'vip' | 'exhibitors' | 'sponsors' | 'speakers' | 'media' | 'unpaid';
  enabled: boolean;
  templateId: string;
  subject: string;
  preheader: string;
  bodyPreview: string;
  lastSentCount?: number;
}

export interface EmailAutomationSequence {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  autoEnrollNewRegistrations: boolean;
  steps: AutomationStep[];
  totalEnrolled: number;
  totalDelivered: number;
}

export interface EmailCampaign {
  id: string;
  title: string;
  subject: string;
  preheader?: string;
  targetAudience: 'all' | 'registered' | 'visitors' | 'vip' | 'exhibitors' | 'sponsors' | 'speakers' | 'media' | 'unpaid';
  templateId?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'archived';
  sentAt?: string;
  scheduledFor?: string;
  totalRecipients: number;
  deliveredCount: number;
  failedCount: number;
  openRateEstimated: number;
  clickRateEstimated: number;
  blocks?: EmailBlock[];
  rawHtml?: string;
}

export interface MarketingStats {
  totalCampaignsSent: number;
  totalEmailsDelivered: number;
  activeAutomationsCount: number;
  totalSubscribersEnrolled: number;
  overallDeliveryRate: number;
  overallOpenRate: number;
  overallClickRate: number;
  inboxPlacementRate: number;
}

// -------------------------------------------------------------
// Visitor (FREE) -> Elite VIP Guest Upgrade Daily Drip Types
// -------------------------------------------------------------
export interface VisitorUpgradeDripStep {
  id: string;
  dayNumber: number; // Day in sequence (0, 1, 2, 3, 4, 5, 6, 7, 10, 14, 21, etc.)
  delayHours: number; // Hours from registration
  title: string;
  badge: string;
  subject: string;
  preheader: string;
  benefitFocus: string; // Key VIP benefit highlighted in this email
  vipBenefitList: string[]; // List of specific VIP advantages featured
  bodyContent: string;
  callToActionText: string;
  callToActionUrl: string;
  imageUrl?: string;
  imageAlt?: string;
  active: boolean;
  sentCount: number;
  openRate: number;
  clickRate: number;
  conversionCount?: number;
}

export interface VisitorDripSubscriberHistoryItem {
  stepId: string;
  stepTitle: string;
  sentAt: string;
  subject: string;
  status: 'DELIVERED' | 'BOUNCED' | 'OPENED' | 'CLICKED';
}

export interface VisitorDripSubscriber {
  id: string;
  attendeeTicketNumber: string;
  fullName: string;
  email: string;
  organization?: string;
  phone?: string;
  city?: string;
  registeredAt: string;
  enrolledAt: string;
  currentStepIndex: number;
  currentDayNumber: number;
  status: 'ACTIVE_DRIP' | 'UPGRADED_ELITE_VIP' | 'COMPLETED_SEQUENCE' | 'PAUSED' | 'UNSUBSCRIBED';
  lastEmailSentAt?: string;
  lastStepSentId?: string;
  totalEmailsSent: number;
  upgradedAt?: string;
  upgradeRef?: string;
  deliveryHistory: VisitorDripSubscriberHistoryItem[];
}

export interface VisitorUpgradeDripConfig {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  autoEnrollFreeVisitors: boolean;
  stopImmediatelyOnEliteUpgrade: boolean; // Goal rule: Halt sequence when upgraded
  discountCodeEnabled: boolean;
  discountCode: string; // e.g. "VIPUPGRADE5K"
  discountAmountNGN: number; // e.g. 5000
  upgradePriceNGN: number; // e.g. 20000
  originalPriceNGN: number; // e.g. 25000
  upgradePaymentLink: string;
  sendTimeOfDay: string; // e.g. "09:00 AM WAT"
  steps: VisitorUpgradeDripStep[];
}

export interface VisitorDripSummaryStats {
  totalFreeEnrolled: number;
  activeInDrip: number;
  totalUpgradedToElite: number;
  conversionRate: number; // e.g. 38.5%
  totalDripEmailsDelivered: number;
  revenueGeneratedNGN: number; // e.g. 450,000 NGN
  avgDaysToUpgrade: number;
}

// -----------------------------------------------------------------------------
// Unconfirmed / Abandoned Payment Elite VIP Guest Daily Follow-Up Drip Types
// -----------------------------------------------------------------------------
export interface UnconfirmedVipRecoveryStep {
  id: string;
  dayNumber: number; // Day in recovery sequence (0, 1, 2, 3, 4, 5, 7, etc.)
  delayHours: number; // Delay hours from unconfirmed registration
  title: string;
  badge: string; // e.g. "IMMEDIATE REMINDER", "DAY 1 • RESERVED SEAT", "DAY 2 • B2B ACCESS", etc.
  subject: string;
  preheader: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  vipBenefitFocus: string; // Specific VIP privilege highlighted
  vipBenefitsList: string[]; // Bulleted benefits
  bodyContent: string;
  paymentButtonText: string;
  paymentButtonUrl: string;
  alternateBankTransferText?: string;
  imageUrl?: string;
  imageAlt?: string;
  active: boolean;
  sentCount: number;
  openRate: number;
  clickRate: number;
  recoveredCount?: number;
}

export interface UnconfirmedVipSubscriberHistoryItem {
  stepId: string;
  stepTitle: string;
  sentAt: string;
  subject: string;
  status: 'DELIVERED' | 'BOUNCED' | 'OPENED' | 'CLICKED';
}

export interface UnconfirmedVipSubscriber {
  id: string;
  attendeeTicketNumber: string;
  fullName: string;
  email: string;
  phone?: string;
  organization?: string;
  tierName?: string;
  amountDueNGN: number; // e.g. 25,000
  currency: string;
  paymentRef?: string;
  registeredAt: string;
  enrolledAt: string;
  currentStepIndex: number;
  currentDayNumber: number;
  status: 'PENDING_PAYMENT' | 'PAYMENT_CONFIRMED_BY_ADMIN' | 'ABANDONED_CANCELLED' | 'PAUSED';
  lastEmailSentAt?: string;
  lastStepSentId?: string;
  totalEmailsSent: number;
  confirmedAt?: string;
  confirmedByAdmin?: string; // Admin officer who confirmed
  confirmationNote?: string;
  deliveryHistory: UnconfirmedVipSubscriberHistoryItem[];
}

export interface UnconfirmedVipRecoveryConfig {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  autoEnrollUnpaidVips: boolean;
  stopImmediatelyOnAdminConfirmation: boolean; // Goal rule: Halt sequence when confirmed by admin
  maxFollowUpDays: number;
  sendTimeOfDay: string;
  flutterwavePaymentLink: string;
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    accountSortCode?: string;
  };
  secretariatSupportPhone: string;
  secretariatSupportEmail: string;
  steps: UnconfirmedVipRecoveryStep[];
}

export interface UnconfirmedVipSummaryStats {
  totalUnconfirmedEnrolled: number;
  activePendingFollowUps: number;
  totalConfirmedByAdmin: number;
  recoveryConversionRate: number; // e.g. 64.2%
  totalRecoveryEmailsSent: number;
  totalRecoveredRevenueNGN: number; // e.g. 350,000 NGN
  avgRecoveryDays: number;
}
