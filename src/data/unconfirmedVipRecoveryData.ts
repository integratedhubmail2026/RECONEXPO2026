import { 
  UnconfirmedVipRecoveryStep, 
  UnconfirmedVipRecoveryConfig, 
  UnconfirmedVipSubscriber 
} from '../types/marketing';

export const DEFAULT_UNCONFIRMED_VIP_STEPS: UnconfirmedVipRecoveryStep[] = [
  // Day 0: Immediate Incomplete / Pending Payment Notice
  {
    id: 'vip_rec_day_0',
    dayNumber: 0,
    delayHours: 1, // 1 hour after pending registration
    title: 'Day 0: Incomplete VIP Registration & Payment Hold Notice',
    badge: 'IMMEDIATE • 1 HOUR',
    subject: '🎟️ Action Required: Complete Your Elite VIP Guest Pass Registration [{ticket}]',
    preheader: 'Your VIP pass reservation is pending payment confirmation for the Yar\'Adua Executive Wing.',
    urgencyLevel: 'medium',
    vipBenefitFocus: 'Temporary Hold on 10-in-1 Elite VIP Privileges',
    vipBenefitsList: [
      'Access to Shehu Musa Yar\'Adua Centre VIP Executive Lounge',
      'Front-Row Reserved Seating for Federal Ministers & Keynote Panels',
      'B2B Deal Room Matchmaking with 40+ Mortgage Banks & PE Funds',
      'Accredited 8-Hour Professional CPD Certificate of Attendance',
      'VIP Gala Dinner & Ministerial Networking Cocktail Reception'
    ],
    bodyContent: `Dear {name},

Thank you for initiating your registration for the **Elite VIP Guest Pass** at the 8th Real Estate & Construction Expo 2026 (RECON Expo).

We noticed that your registration payment of **₦25,000 ($25)** is currently pending confirmation or was interrupted.

Your VIP pass reservation and seating allocation in the Yar'Adua Executive Wing are being held temporarily.

To ensure your personalized Smart ID Card, lanyard, and executive delegate pack are pre-printed and ready for fast-track collection, please complete your payment confirmation using the secure link below.

If you require any administrative assistance with your VIP pass confirmation, please reply directly to this email or contact our secretariat desk.`,
    paymentButtonText: 'Open Delegate Portal',
    paymentButtonUrl: 'https://reconexpo.afrinetgroup.com/',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1000&auto=format&fit=crop&q=80',
    imageAlt: 'RECON Expo VIP Executive Lounge',
    active: true,
    sentCount: 142,
    openRate: 88.6,
    clickRate: 54.2,
    recoveredCount: 48
  },

  // Day 1: VIP Lounge & Executive Hospitality
  {
    id: 'vip_rec_day_1',
    dayNumber: 1,
    delayHours: 24,
    title: 'Day 1: VIP Executive Lounge, Refreshments & Gourmet Lunch Reminder',
    badge: 'DAY 1 • 24 HOURS',
    subject: '☕ Don\'t Miss Out on the VIP Executive Lounge: Complete Your Pass Confirmation, {name}',
    preheader: 'Private meeting alcoves, high-speed fiber WiFi, barista coffee & 3-course executive luncheon.',
    urgencyLevel: 'medium',
    vipBenefitFocus: 'Executive Lounge Sanctuary & VIP Networking Lunch',
    vipBenefitsList: [
      'Daily 3-Course Gourmet Executive Luncheon with keynote speakers',
      'Continuous espresso bar, artisan pastries, and premium refreshments',
      'Private quiet meeting alcoves for confidential deal negotiations',
      'High-speed dedicated fiber WiFi and phone charging stations'
    ],
    bodyContent: `Dear {name},

As Africa's premier built environment leaders gather in Abuja this October, the VIP Executive Lounge at Shehu Musa Yar'Adua Centre serves as the nerve center for high-level networking and deal closures.

Your pending Elite VIP pass gives you unrestricted 3-day access to this private sanctuary.

Don't let your pass slip into general admission. Complete your ₦25,000 payment confirmation today to guarantee your place in the Executive Lounge.`,
    paymentButtonText: 'Open Delegate Portal',
    paymentButtonUrl: 'https://reconexpo.afrinetgroup.com/',
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1000&auto=format&fit=crop&q=80',
    imageAlt: 'VIP Executive Lounge Experience',
    active: true,
    sentCount: 110,
    openRate: 81.4,
    clickRate: 46.8,
    recoveredCount: 32
  },

  // Day 2: Reserved Front-Row Ministerial Seating
  {
    id: 'vip_rec_day_2',
    dayNumber: 2,
    delayHours: 48,
    title: 'Day 2: Hold on Front-Row Ministerial Plenary Seating',
    badge: 'DAY 2 • 48 HOURS',
    subject: '🏛️ Seat Hold Notice: Reserved Front-Row Ministerial Plenary Seats [{ticket}]',
    preheader: 'Direct proximity to Federal Housing Authority ministers, developer CEOs & keynote Q&A.',
    urgencyLevel: 'high',
    vipBenefitFocus: 'Guaranteed Front-Row Reserved Plenary Seating',
    vipBenefitsList: [
      'Front-row reserved seating in the Main Plenary Hall',
      'Priority roaming microphone access during Ministerial Q&A sessions',
      'Direct interaction with federal policy-makers and keynote panelists',
      'Printed policy briefs and executive market summaries folder'
    ],
    bodyContent: `Dear {name},

Plenary hall seating for the opening ministerial address by the Hon. Minister of Housing & Urban Development fills to capacity within minutes.

As an Elite VIP Guest, a personalized reserved seat in the front rows has been earmarked for you. However, unconfirmed seats are released to the VIP waitlist after 72 hours.

Please finalize your registration payment to lock in your front-row seat.`,
    paymentButtonText: 'Open Delegate Portal',
    paymentButtonUrl: 'https://reconexpo.afrinetgroup.com/',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80',
    imageAlt: 'RECON Plenary Hall Front Row',
    active: true,
    sentCount: 88,
    openRate: 77.3,
    clickRate: 43.1,
    recoveredCount: 24
  },

  // Day 3: B2B Deal Room Matchmaking
  {
    id: 'vip_rec_day_3',
    dayNumber: 3,
    delayHours: 72,
    title: 'Day 3: Private B2B Deal Room Matchmaking with 40+ Funders',
    badge: 'DAY 3 • 72 HOURS',
    subject: '🤝 Schedule 1-on-1 Investor Meetings: Finalize Your Elite VIP Pass, {name}',
    preheader: 'Connect with mortgage lenders, private equity funds & infrastructure developers.',
    urgencyLevel: 'high',
    vipBenefitFocus: 'B2B Deal Room Private 30-Minute Consultations',
    vipBenefitsList: [
      'Pre-scheduled 30-minute private deal rooms with institutional financiers',
      'Access to 40+ Mortgage Banks, DFIs, and Commercial Lenders',
      'Bespoke Secretariat concierge to coordinate your bilateral meeting calendar',
      'Access to verified project directory of 150+ Nigerian developments'
    ],
    bodyContent: `Dear {name},

Looking to structure debt financing, joint venture partnerships, or off-plan off-take deals?

The RECON Expo B2B Deal Room portal matches accredited projects with active capital providers. Booking slots are prioritized for confirmed Elite VIP pass holders.

Complete your payment confirmation now to unlock the matchmaking portal and schedule your investor meetings.`,
    paymentButtonText: 'Open Delegate Portal',
    paymentButtonUrl: 'https://reconexpo.afrinetgroup.com/',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1000&auto=format&fit=crop&q=80',
    imageAlt: 'B2B Deal Room Consultations',
    active: true,
    sentCount: 68,
    openRate: 74.9,
    clickRate: 40.5,
    recoveredCount: 19
  },

  // Day 4: CPD Certificate of Attendance
  {
    id: 'vip_rec_day_4',
    dayNumber: 4,
    delayHours: 96,
    title: 'Day 4: Official 8-Hour Professional CPD Certificate on Hold',
    badge: 'DAY 4 • 96 HOURS',
    subject: '📜 Professional CPD Certificate of Attendance on Hold: {name}',
    preheader: 'Verifiable 8 CPD Credit Hours credential accredited by professional institutes.',
    urgencyLevel: 'medium',
    vipBenefitFocus: 'Accredited 8 CPD Credit Hours & Foil-Embossed Hardcover Certificate',
    vipBenefitsList: [
      'Official accredited 8 CPD Credit Hours for architects, engineers, surveyors & builders',
      'Cryptographically verifiable QR code certificate for LinkedIn & professional portfolios',
      'Printed hardcover foil-embossed certificate ready for framing',
      'Complimentary access to all masterclass presentation slides & recordings'
    ],
    bodyContent: `Dear {name},

Professional accreditation and career advancement are core benefits of the Elite VIP Pass at RECON Expo 2026.

Your attendance qualifies for 8 Continuous Professional Development (CPD) Credit Hours, recognized by major regulatory and professional institutes.

Finalize your registration payment today to ensure your certificate is personalized and registered in the national registry.`,
    paymentButtonText: 'Open Delegate Portal',
    paymentButtonUrl: 'https://reconexpo.afrinetgroup.com/',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80',
    imageAlt: 'Official CPD Certificate of Attendance',
    active: true,
    sentCount: 54,
    openRate: 72.1,
    clickRate: 38.0,
    recoveredCount: 14
  },

  // Day 5: VIP Gala Dinner & Awards Night
  {
    id: 'vip_rec_day_5',
    dayNumber: 5,
    delayHours: 120,
    title: 'Day 5: VIP Gala Dinner & Ministerial Networking Cocktail Invitation',
    badge: 'DAY 5 • GALA NIGHT',
    subject: '🥂 Your Ticket to the Friday VIP Networking Gala Dinner & Cocktail Night',
    preheader: 'Black-tie gala in the Grand Ballroom with federal ministers, ambassadors & developers.',
    urgencyLevel: 'high',
    vipBenefitFocus: 'Grand Ballroom VIP Gala Dinner & Awards Night Access (₦35k Value Included)',
    vipBenefitsList: [
      'Ticket to the Friday evening Grand Ballroom Gala Dinner & Cocktail Reception',
      'Red-carpet arrival, champagne toast, and live orchestra performance',
      'Africa Property Leadership Awards presentation ceremony',
      'Unrestricted social networking with high-net-worth property developers'
    ],
    bodyContent: `Dear {name},

Individual tickets to the annual RECON VIP Networking Gala Dinner & Leadership Cocktail Night sell for ₦35,000.

However, your Elite VIP Guest Pass includes complete 3-day expo access PLUS full admission to the Gala Dinner!

Access the official portal now to ensure your dinner seat and place card are reserved in the Grand Ballroom.`,
    paymentButtonText: 'Open Delegate Portal',
    paymentButtonUrl: 'https://reconexpo.afrinetgroup.com/',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1000&auto=format&fit=crop&q=80',
    imageAlt: 'VIP Gala Dinner Night',
    active: true,
    sentCount: 42,
    openRate: 79.8,
    clickRate: 48.2,
    recoveredCount: 16
  },

  // Day 7: Final Notice before Pass Release
  {
    id: 'vip_rec_day_7',
    dayNumber: 7,
    delayHours: 168,
    title: 'Day 7: Final Call — Releasing Unconfirmed VIP Seat Allocation in 24 Hours',
    badge: 'DAY 7 • FINAL NOTICE',
    subject: '⚠️ Final Notice: Unconfirmed VIP Seat [{ticket}] Releasing in 24 Hours: {name}',
    preheader: 'Executive Wing capacity capped at Yar\'Adua Centre. Complete confirmation to avoid forfeiture.',
    urgencyLevel: 'critical',
    vipBenefitFocus: 'Final 24-Hour Pass Hold before Waitlist Re-allocation',
    vipBenefitsList: [
      'Last opportunity to confirm your 10-in-1 Elite VIP Guest Privileges',
      'Immediate pass receipt and pre-printed badge allocation',
      'Direct support hotline available for instant assistance',
      'Automatic administrative confirmation upon portal registration'
    ],
    bodyContent: `Dear {name},

Due to strict capacity limits for the Yar'Adua Executive Wing, unconfirmed VIP registrations are held for a maximum of 7 days before seat allocations are transferred to delegates on our waitlist.

This is our final follow-up notice regarding your pending Elite VIP registration ({ticket}).

To retain your Elite VIP pass, please access the official portal immediately using the link below, or contact the Organizing Secretariat support desk.`,
    paymentButtonText: 'Open Delegate Portal',
    paymentButtonUrl: 'https://reconexpo.afrinetgroup.com/',
    alternateBankTransferText: 'Emergency Secretariat Hotline: +234 803 234 5678 | Email: reconexpo@afrinetgroup.com',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1000&auto=format&fit=crop&q=80',
    imageAlt: 'Final VIP Pass Allocation',
    active: true,
    sentCount: 30,
    openRate: 84.5,
    clickRate: 52.0,
    recoveredCount: 11
  }
];

export const DEFAULT_UNCONFIRMED_VIP_CONFIG: UnconfirmedVipRecoveryConfig = {
  id: 'cfg_unconfirmed_vip_recovery_v1',
  name: 'Elite VIP Unconfirmed / Pending Registration Daily Drip',
  description: 'Automated daily follow-up system that tracks pending or incomplete Elite VIP registrations and sends personalized benefit reminders with direct portal links. Follow-up immediately halts the moment admin confirms attendee.',
  isActive: true,
  autoEnrollUnpaidVips: true,
  stopImmediatelyOnAdminConfirmation: true, // Core rule: Stop upon admin confirmation
  maxFollowUpDays: 7,
  sendTimeOfDay: '09:30 AM WAT',
  flutterwavePaymentLink: 'https://reconexpo.afrinetgroup.com/',
  bankDetails: {
    bankName: 'Official Online Portal (Secretariat Verification)',
    accountName: 'Afrinet Group Limited (RECON Expo Secretariat)',
    accountNumber: 'Official Pass Portal Access',
    accountSortCode: 'PORTAL-ONLINE'
  },
  secretariatSupportPhone: '+234 803 234 5678',
  secretariatSupportEmail: 'reconexpo@afrinetgroup.com',
  steps: DEFAULT_UNCONFIRMED_VIP_STEPS
};

export const INITIAL_SAMPLE_UNCONFIRMED_VIP_SUBSCRIBERS: UnconfirmedVipSubscriber[] = [
  {
    id: 'vip_sub_1',
    attendeeTicketNumber: 'RECON-2026-LEAD-5301',
    fullName: 'Chief Emeka Nnamani',
    email: 'emeka.nnamani@enugu-prop.com',
    phone: '+234 805 771 2233',
    organization: 'Coal City Infrastructure Consortium',
    tierName: 'Elite Guest (Paid)',
    amountDueNGN: 25000,
    currency: 'NGN',
    paymentRef: 'FLW-PAY-LINK-5301',
    registeredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    enrolledAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    currentStepIndex: 1,
    currentDayNumber: 1,
    status: 'PENDING_PAYMENT',
    lastEmailSentAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    lastStepSentId: 'vip_rec_day_1',
    totalEmailsSent: 2,
    deliveryHistory: [
      {
        stepId: 'vip_rec_day_0',
        stepTitle: 'Day 0: Incomplete VIP Registration Notice',
        sentAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        subject: '🎟️ Action Required: Complete Your Elite VIP Guest Pass Registration [RECON-2026-LEAD-5301]',
        status: 'OPENED'
      },
      {
        stepId: 'vip_rec_day_1',
        stepTitle: 'Day 1: VIP Executive Lounge & Lunch Reminder',
        sentAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        subject: '☕ Don\'t Miss Out on the VIP Executive Lounge: Complete Your Pass Confirmation, Chief Emeka Nnamani',
        status: 'CLICKED'
      }
    ]
  },
  {
    id: 'vip_sub_2',
    attendeeTicketNumber: 'RECON-2026-VIP-9942',
    fullName: 'Engr. Dapo Olawale',
    email: 'dapo.olawale@greenstructures.ng',
    phone: '+234 802 119 4488',
    organization: 'Green Structures & PropTech Ltd',
    tierName: 'Elite VIP Guest',
    amountDueNGN: 25000,
    currency: 'NGN',
    paymentRef: 'BANK-TRF-9942',
    registeredAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    enrolledAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    currentStepIndex: 3,
    currentDayNumber: 3,
    status: 'PAYMENT_CONFIRMED_BY_ADMIN', // Admin confirmed after reviewing bank receipt!
    lastEmailSentAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
    lastStepSentId: 'vip_rec_day_3',
    totalEmailsSent: 4,
    confirmedAt: new Date(Date.now() - 86400000 * 0.8).toISOString(),
    confirmedByAdmin: 'Admin Secretariat (Finance Officer)',
    confirmationNote: 'Verified bank transfer receipt ref: ZEN-098812349. Marked PAID and follow-up halted.',
    deliveryHistory: [
      {
        stepId: 'vip_rec_day_0',
        stepTitle: 'Day 0: Incomplete VIP Registration Notice',
        sentAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        subject: '🎟️ Action Required: Complete Your Elite VIP Guest Pass Registration [RECON-2026-VIP-9942]',
        status: 'OPENED'
      },
      {
        stepId: 'vip_rec_day_3',
        stepTitle: 'Day 3: B2B Deal Room Matchmaking',
        sentAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
        subject: '🤝 Schedule 1-on-1 Investor Meetings: Finalize Your Elite VIP Pass, Engr. Dapo Olawale',
        status: 'CLICKED'
      }
    ]
  },
  {
    id: 'vip_sub_3',
    attendeeTicketNumber: 'RECON-2026-VIP-8710',
    fullName: 'Dr. Fatima Sanusi',
    email: 'f.sanusi@northernurban.org',
    phone: '+234 818 440 2211',
    organization: 'Northern Urban Housing Initiative',
    tierName: 'Elite VIP Guest',
    amountDueNGN: 25000,
    currency: 'NGN',
    paymentRef: 'FLW-INT-8710',
    registeredAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    enrolledAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    currentStepIndex: 0,
    currentDayNumber: 0,
    status: 'PENDING_PAYMENT',
    lastEmailSentAt: new Date(Date.now() - 86400000 * 0.3).toISOString(),
    lastStepSentId: 'vip_rec_day_0',
    totalEmailsSent: 1,
    deliveryHistory: [
      {
        stepId: 'vip_rec_day_0',
        stepTitle: 'Day 0: Incomplete VIP Registration Notice',
        sentAt: new Date(Date.now() - 86400000 * 0.3).toISOString(),
        subject: '🎟️ Action Required: Complete Your Elite VIP Guest Pass Registration [RECON-2026-VIP-8710]',
        status: 'OPENED'
      }
    ]
  }
];
