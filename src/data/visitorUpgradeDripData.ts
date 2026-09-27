import { VisitorUpgradeDripStep, VisitorUpgradeDripConfig, VisitorDripSubscriber } from '../types/marketing';

export const DEFAULT_VISITOR_UPGRADE_STEPS: VisitorUpgradeDripStep[] = [
  // Day 0: Instant Visitor Welcome & VIP Comparison
  {
    id: 'visitor_drip_day_0',
    dayNumber: 0,
    delayHours: 1, // 1 hour after free registration
    title: 'Day 0: Visitor Welcome + Why 84% of Leaders Upgrade to Elite VIP',
    badge: 'DAY 0 • 1 HOUR',
    subject: '🎟️ {name}, Your Free RECON 2026 Pass is Active — See What Unlocks with Elite VIP Access',
    preheader: 'Compare Free vs. Elite VIP: Executive Lounge, Ministerial Keynotes & B2B Deal Rooms.',
    benefitFocus: 'Comprehensive VIP 10-in-1 Privileges & Yar\'Adua Executive Wing Access',
    vipBenefitList: [
      'Executive VIP Lounge & Gourmet Networking Luncheons',
      'Front-Row Reserved Seating for Federal Ministers & Keynotes',
      'Accredited 8-Hour CPD Professional Certificate of Attendance',
      'B2B Private Deal Rooms with Mortgage Bankers & Developers',
      'Fast-Track Express Clearance at Entrance Gate 1'
    ],
    bodyContent: `Dear {name},

Thank you for registering as a General Visitor for the 8th Real Estate & Construction Expo 2026 (RECON Expo)!

Your Free General Pass gives you entry to the general exhibition floor. However, did you know that over 84% of corporate executives, developers, and serious investors choose to upgrade to the Elite VIP Guest Pass?

HERE IS HOW FREE VISITOR COMPARES TO ELITE VIP GUEST:
• General Floor Access: Included in both
• Executive VIP Lounge & Refreshments: ❌ Free Visitor | ✅ Elite VIP
• Ministerial Plenary Front-Row Seating: ❌ Free Visitor | ✅ Elite VIP
• 1-on-1 Private B2B Deal Room Matchmaking: ❌ Free Visitor | ✅ Elite VIP
• Official CPD Accredited Certificate (8 Hours): ❌ Free Visitor | ✅ Elite VIP
• VIP Networking Gala Dinner & Cocktail: ❌ Free Visitor | ✅ Elite VIP

Upgrade now to unlock all 10 premium privileges and maximize your 3-day expo experience at Shehu Musa Yar'Adua Centre.`,
    callToActionText: '👑 Access Official VIP Pass Portal',
    callToActionUrl: 'https://www.afrinetgroup.com/portal',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1000&auto=format&fit=crop&q=80',
    imageAlt: 'RECON Expo VIP Executive Wing & Plenary',
    active: true,
    sentCount: 1240,
    openRate: 86.4,
    clickRate: 48.2,
    conversionCount: 312
  },

  // Day 1: VIP Lounge & Executive Luncheon
  {
    id: 'visitor_drip_day_1',
    dayNumber: 1,
    delayHours: 24,
    title: 'Day 1: The VIP Executive Lounge, All-Day Coffee & Private Luncheons',
    badge: 'DAY 1 • 24 HOURS',
    subject: '☕ Step Inside the VIP Executive Lounge at Yar\'Adua Centre: Your Exclusive Pass Awaits',
    preheader: 'Escape the crowd: High-speed WiFi, private meeting alcoves, hot barista coffee & gourmet lunch.',
    benefitFocus: 'VIP Executive Lounge, High-Speed WiFi & Private Meeting Alcoves',
    vipBenefitList: [
      'Continuous gourmet coffee, espresso bar, pastries, and lunch',
      'Dedicated quiet meeting pods for confidential contract discussions',
      'Private high-speed fiber WiFi with power workstation desks',
      'Direct interaction with keynote speakers and federal delegates'
    ],
    bodyContent: `Dear {name},

When 10,000+ attendees fill the exhibition halls, where will you take important phone calls, review contract terms, or negotiate land deals?

As an Elite VIP Guest, the Shehu Musa Yar'Adua Centre Executive Lounge is your private sanctuary:
☕ All-Day Gourmet Coffee & Refreshments bar
🍽️ Daily 3-Course Executive Luncheon with speakers and captains of industry
⚡ Dedicated fiber-optic WiFi and device charging stations
🤫 Private quiet alcoves for one-on-one business discussions

Don't spend your expo days searching for seating or waiting in lines. Upgrade your badge today to enjoy full VIP hospitality.`,
    callToActionText: '👑 Access VIP Executive Lounge Portal',
    callToActionUrl: 'https://www.afrinetgroup.com/portal',
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1000&auto=format&fit=crop&q=80',
    imageAlt: 'RECON Expo VIP Lounge Experience',
    active: true,
    sentCount: 1180,
    openRate: 79.1,
    clickRate: 41.5,
    conversionCount: 184
  },

  // Day 2: Reserved Ministerial Keynote Seats
  {
    id: 'visitor_drip_day_2',
    dayNumber: 2,
    delayHours: 48,
    title: 'Day 2: Front-Row Reserved Plenary Seating with Federal Ministers',
    badge: 'DAY 2 • 48 HOURS',
    subject: '🏛️ Sit Front-Row with Federal Ministers & Real Estate Tycoons: {name}',
    preheader: 'Reserved plenary hall seating guarantees direct access to policy makers & Q&A sessions.',
    benefitFocus: 'Front-Row Reserved Seating & Direct Plenary Microphone Access',
    vipBenefitList: [
      'Guaranteed front-row reserved seating in Main Plenary Hall',
      'Priority microphone clearance for Ministerial Q&A sessions',
      'Direct proximity to Federal Housing Authority & Ministry leaders',
      'Access to exclusive closed-door policy roundtables'
    ],
    bodyContent: `Dear {name},

The RECON Expo 2026 Plenary Hall will host landmark policy announcements, including the Federal Government's new Single-Digit Mortgage Framework and infrastructure concession opportunities.

General admission seating is strictly first-come, first-served and fills up rapidly.

ELITE VIP GUESTS RECEIVE:
• Dedicated Reserved Seating in the Front 3 Rows of the Plenary
• Priority access to the roaming microphone during open Q&A sessions
• Direct access to engage keynote speakers immediately following panel presentations
• VIP folder containing printed policy executive summaries

Secure your front-row seat to Africa's premier real estate discourse.`,
    callToActionText: '👑 Access Plenary Seating Portal',
    callToActionUrl: 'https://www.afrinetgroup.com/portal',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80',
    imageAlt: 'RECON Plenary Hall Front Row',
    active: true,
    sentCount: 1110,
    openRate: 75.3,
    clickRate: 39.8,
    conversionCount: 142
  },

  // Day 3: B2B Matchmaking & Private Deal Rooms
  {
    id: 'visitor_drip_day_3',
    dayNumber: 3,
    delayHours: 72,
    title: 'Day 3: Private B2B Deal Room Matchmaking with 40+ Institutional Financiers',
    badge: 'DAY 3 • 72 HOURS',
    subject: '🤝 Need Financing or Joint Venture Partners? Unlock Private B2B Deal Rooms',
    preheader: 'Schedule 30-minute private meetings with mortgage banks, PE funds & developers.',
    benefitFocus: '1-on-1 B2B Investor Matchmaking & Bilateral Deal Consultations',
    vipBenefitList: [
      'Pre-scheduled 30-minute bilateral meetings with accredited funders',
      'Access to 40+ Commercial Banks, Mortgage Lenders & PE Funds',
      'Private meeting room reservation within the VIP Executive Wing',
      'Curated buyer-seller matching based on project capital requirements'
    ],
    bodyContent: `Dear {name},

Are you seeking development finance, joint-venture equity, or bulk off-plan property buyers?

The RECON Expo B2B Deal Matchmaking Suite connects approved projects directly with institutional capital:
• 40+ Mortgage Banks & Infrastructure Funds actively seeking deployable projects
• 150+ Verified Developer Projects with approved title documents
• Dedicated Secretariat concierge to coordinate your meeting agenda

Access to the digital matchmaking portal and private Deal Rooms is strictly limited to Elite VIP pass holders and exhibitors.`,
    callToActionText: '👑 Access B2B Deal Room Portal',
    callToActionUrl: 'https://www.afrinetgroup.com/portal',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1000&auto=format&fit=crop&q=80',
    imageAlt: 'B2B Deal Room Matchmaking',
    active: true,
    sentCount: 1050,
    openRate: 72.8,
    clickRate: 44.1,
    conversionCount: 168
  },

  // Day 4: CPD Certificate of Attendance
  {
    id: 'visitor_drip_day_4',
    dayNumber: 4,
    delayHours: 96,
    title: 'Day 4: Official CPD Accredited Certificate (8 Professional Credit Hours)',
    badge: 'DAY 4 • 96 HOURS',
    subject: '📜 Earn Your 8-Hour Professional CPD Certificate at RECON 2026: {name}',
    preheader: 'Recognized by professional regulatory bodies for architects, builders, surveyors & engineers.',
    benefitFocus: 'Accredited CPD Professional Certification & Verification QR Code',
    vipBenefitList: [
      'Official accredited 8 CPD Credit Hours certification',
      'Digital verifiable badge with cryptographic QR code validation',
      'Hardcover foil-embossed certificate ready for framing',
      'Accredited by major built environment professional institutes'
    ],
    bodyContent: `Dear {name},

Continuous professional development is key to career progression in architecture, engineering, surveying, estate management, and urban planning.

As an Elite VIP Guest, your attendance at technical plenaries and masterclasses qualifies you for the Official RECON Expo 2026 CPD Certificate:
🏆 8 Continuous Professional Development (CPD) Credit Hours
🏆 Cryptographically verifiable digital credential + Printed Hardcover Certificate
🏆 Endorsed by leading industry regulatory bodies and academic boards

Free visitor passes do not include accredited certificates. Upgrade today and add official CPD credentials to your portfolio.`,
    callToActionText: '👑 View CPD Certificate Pass Portal',
    callToActionUrl: 'https://www.afrinetgroup.com/portal',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80',
    imageAlt: 'Official CPD Certificate of Attendance',
    active: true,
    sentCount: 990,
    openRate: 70.4,
    clickRate: 36.9,
    conversionCount: 110
  },

  // Day 5: Flash ₦5,000 Discount Voucher
  {
    id: 'visitor_drip_day_5',
    dayNumber: 5,
    delayHours: 120,
    title: 'Day 5: Flash Discount — Upgrade for ₦20,000 (Save ₦5,000 with Code VIPUPGRADE5K)',
    badge: 'DAY 5 • FLASH DISCOUNT',
    subject: '🎁 Exclusive ₦5,000 Discount Voucher: Upgrade to Elite VIP for ₦20,000 Today',
    preheader: 'Special limited voucher code [VIPUPGRADE5K] valid for the next 48 hours only.',
    benefitFocus: 'Limited ₦5,000 Off Discount — ₦20,000 Instead of ₦25,000',
    vipBenefitList: [
      'Save ₦5,000 instantly with coupon code VIPUPGRADE5K',
      'All 10-in-1 Elite VIP Guest privileges fully unlocked',
      'Instant digital pass upgrade and fast-track badge allocation',
      'Special complimentary expo souvenir gift set upon arrival'
    ],
    bodyContent: `Dear {name},

Because you registered early as a General Visitor, the RECON Expo Secretariat is pleased to extend an exclusive discount voucher:

USE DISCOUNT CODE: VIPUPGRADE5K
💰 Regular VIP Fee: ₦25,000 ($25)
🎉 Your Special Rate: ₦20,000 ($20)
⚡ Instant Savings: ₦5,000 (20% OFF)

This special discount code is valid for 48 hours only and applies to individual and corporate attendee passes.

Click below to claim your discounted upgrade and secure all 10 VIP benefits before the voucher expires.`,
    callToActionText: '🎉 Apply VIP Voucher Code on Official Portal',
    callToActionUrl: 'https://www.afrinetgroup.com/portal',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1000&auto=format&fit=crop&q=80',
    imageAlt: 'Exclusive Discount VIP Voucher',
    active: true,
    sentCount: 940,
    openRate: 83.2,
    clickRate: 54.7,
    conversionCount: 220
  },

  // Day 6: High-Volume Deal Case Study
  {
    id: 'visitor_drip_day_6',
    dayNumber: 6,
    delayHours: 144,
    title: 'Day 6: Case Study: How 2025 VIP Delegates Closed ₦100M+ in Property Transactions',
    badge: 'DAY 6 • CASE STUDY',
    subject: '💼 How One Conversation in the VIP Lounge Led to a ₦140M Joint Venture in Abuja',
    preheader: 'Real stories from past RECON delegates who turned a VIP pass into transformative deals.',
    benefitFocus: 'Real Delegate Success Stories & High-Yield Networking Returns',
    vipBenefitList: [
      'Access to deal-makers with active procurement budgets',
      'Direct interaction with major commercial property developers',
      'Opportunity to form consortiums for national housing tenders',
      'Fast return on investment from a single strategic partnership'
    ],
    bodyContent: `Dear {name},

At the 7th RECON Expo, Arch. Ibrahim Sani upgraded from a General Visitor pass to Elite VIP on Day 1.

While in the VIP Executive Lounge, he was introduced to the Chief Investment Officer of a major pension fund administrator. By Day 3, they had drafted the terms for a ₦140 Million residential development joint-venture in Guzape, Abuja.

"Upgrading to Elite VIP was the best investment our firm made all year. The access and caliber of people in that lounge is unmatched anywhere in West Africa."

Your next major client, partner, or institutional investor is attending RECON 2026. Will you be in the room with them?`,
    callToActionText: '👑 Access VIP Executive Portal',
    callToActionUrl: 'https://www.afrinetgroup.com/portal',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80',
    imageAlt: 'RECON VIP Business Networking',
    active: true,
    sentCount: 880,
    openRate: 73.6,
    clickRate: 38.2,
    conversionCount: 95
  },

  // Day 7: VIP Goodie Bag & Hardcover Compendium
  {
    id: 'visitor_drip_day_7',
    dayNumber: 7,
    delayHours: 168,
    title: 'Day 7: VIP Executive Pack, Hardcover Compendium & Priority Badge',
    badge: 'DAY 7 • VIP PACK',
    subject: '🎁 Your VIP Executive Delegate Pack & Hardcover 2026 Project Compendium',
    preheader: 'Includes the comprehensive directory of 150+ verified Nigerian real estate projects.',
    benefitFocus: 'Hardcover Directory, Executive Swag Pack & Fast-Track Badge Collection',
    vipBenefitList: [
      'Hardcover 2026 Nigeria Real Estate & Construction Project Compendium',
      'Executive RECON branded leather notebook, pen, and badge lanyard',
      'Priority registration line clearance with zero wait time',
      'Digital access to all post-event presentation slide decks & recordings'
    ],
    bodyContent: `Dear {name},

Every Elite VIP Guest receives the official 2026 Executive Delegate Pack at the Yar'Adua Centre VIP Check-in Desk:

📘 2026 National Real Estate Compendium: 240+ pages detailing major infrastructure developments, masterplans, land title guidelines, and developer contacts.
🎒 Deluxe VIP Leather Folio: Executive stationery set and metallic embossed lanyard.
⚡ Red-Carpet Express Check-in: No waiting in long visitor registration lines.

Upgrade your pass today and have your personalized VIP pack and badge pre-printed and waiting for you at the entrance.`,
    callToActionText: '👑 Access VIP Delegate Pack Portal',
    callToActionUrl: 'https://www.afrinetgroup.com/portal',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
    imageAlt: 'VIP Executive Delegate Pack',
    active: true,
    sentCount: 830,
    openRate: 71.9,
    clickRate: 35.4,
    conversionCount: 82
  },

  // Day 10: VIP Gala Dinner & Cocktail
  {
    id: 'visitor_drip_day_10',
    dayNumber: 10,
    delayHours: 240,
    title: 'Day 10: VIP Dinner Gala & Ministerial Networking Cocktail Invitation',
    badge: 'DAY 10 • GALA DINNER',
    subject: '🥂 An Invitation to the VIP Networking Gala Dinner & Ministerial Cocktail Night',
    preheader: 'Join industry titans, federal ministers, and overseas ambassadors for an unforgettable evening.',
    benefitFocus: 'Exclusive Admission to the VIP Gala Dinner & Property Awards Ceremony',
    vipBenefitList: [
      'Admission to the Grand Ballroom Gala Dinner on Friday evening',
      'Red-carpet photo session and champagne networking reception',
      'Live orchestra and Africa Property Leadership Awards presentation',
      'Unrestricted social networking with high-net-worth property investors'
    ],
    bodyContent: `Dear {name},

The highlight of RECON Expo is the annual VIP Networking Gala Dinner & Leadership Cocktail.

Hosted in the Grand Ballroom, this black-tie evening brings together federal ministers, overseas commercial attachés, banking executives, and top developers for high-level social networking.

General visitor passes DO NOT include gala dinner tickets (individual gala tickets sell for ₦35,000).

However, upgrading to the Elite VIP Guest Pass (₦25,000) includes complete access to both the 3-day expo AND the VIP Gala Dinner!`,
    callToActionText: '🥂 Access VIP Gala Dinner Portal',
    callToActionUrl: 'https://www.afrinetgroup.com/portal',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1000&auto=format&fit=crop&q=80',
    imageAlt: 'RECON VIP Gala Dinner Night',
    active: true,
    sentCount: 780,
    openRate: 77.2,
    clickRate: 46.3,
    conversionCount: 118
  },

  // Day 14: Final Call — Capacity Warning
  {
    id: 'visitor_drip_day_14',
    dayNumber: 14,
    delayHours: 336,
    title: 'Day 14: Final Notice — Executive Lounge Capacity Reaching 90%',
    badge: 'DAY 14 • FINAL CALL',
    subject: '⚠️ Final Upgrade Notice: Executive Wing Seats Limited to 35 Remaining Passes',
    preheader: 'Due to Yar\'Adua Centre VIP lounge capacity rules, VIP pass sales will close once capped.',
    benefitFocus: 'Final VIP Pass Allocation Before Registration Closure',
    vipBenefitList: [
      'Guaranteed entry before VIP badge allocation is capped',
      'All 10-in-1 privileges, lounge access, and CPD certification included',
      'Instant pass allocation with immediate confirmation',
      'Dedicated VIP secretariat support hotline access'
    ],
    bodyContent: `Dear {name},

To ensure maximum comfort, fine dining standards, and privacy in the Yar'Adua Executive Wing, Elite VIP Guest passes are strictly capped.

We have reached 92% of our VIP allocation for RECON Expo 2026. Only 35 Elite VIP passes remain available.

Once this allocation is exhausted, upgrade options will be disabled and no on-site VIP upgrades can be accommodated.

Lock in your Elite VIP Pass now and secure the full suite of executive privileges.`,
    callToActionText: '👑 Access Official Portal to Claim VIP Pass',
    callToActionUrl: 'https://www.afrinetgroup.com/portal',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1000&auto=format&fit=crop&q=80',
    imageAlt: 'Final VIP Pass Allocation',
    active: true,
    sentCount: 720,
    openRate: 81.5,
    clickRate: 50.9,
    conversionCount: 134
  }
];

export const DEFAULT_VISITOR_UPGRADE_CONFIG: VisitorUpgradeDripConfig = {
  id: 'cfg_visitor_upgrade_drip_v1',
  name: 'Free Visitor to Elite VIP Guest Daily Upgrade Drip Sequence',
  description: 'Automated daily nurture sequence sent to all new Free Visitor registrations to educate them on VIP benefits and convert them to Paid Elite VIP Guests. System automatically halts follow-up once attendee registers/upgrades to Elite VIP.',
  isActive: true,
  autoEnrollFreeVisitors: true,
  stopImmediatelyOnEliteUpgrade: true,
  discountCodeEnabled: true,
  discountCode: 'VIPUPGRADE5K',
  discountAmountNGN: 5000,
  upgradePriceNGN: 20000,
  originalPriceNGN: 25000,
  upgradePaymentLink: 'https://www.afrinetgroup.com/portal',
  sendTimeOfDay: '09:00 AM WAT',
  steps: DEFAULT_VISITOR_UPGRADE_STEPS
};

export const INITIAL_SAMPLE_VISITOR_SUBSCRIBERS: VisitorDripSubscriber[] = [
  {
    id: 'sub_1',
    attendeeTicketNumber: 'RECON-2026-VIS-4102',
    fullName: 'Engr. Kenneth Adeleke',
    email: 'k.adeleke@apexbuild.ng',
    organization: 'Apex Build Infrastructure Ltd',
    phone: '+234 803 111 2233',
    city: 'Abuja, FCT',
    registeredAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    enrolledAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    currentStepIndex: 2,
    currentDayNumber: 2,
    status: 'ACTIVE_DRIP',
    lastEmailSentAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    lastStepSentId: 'visitor_drip_day_2',
    totalEmailsSent: 3,
    deliveryHistory: [
      {
        stepId: 'visitor_drip_day_0',
        stepTitle: 'Day 0: Welcome & VIP Privileges',
        sentAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        subject: '🎟️ Engr. Kenneth, Your Free RECON 2026 Pass is Active — See What Unlocks with Elite VIP Access',
        status: 'OPENED'
      },
      {
        stepId: 'visitor_drip_day_1',
        stepTitle: 'Day 1: VIP Lounge & Networking Lunch',
        sentAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        subject: '☕ Step Inside the VIP Executive Lounge at Yar\'Adua Centre: Your Exclusive Pass Awaits',
        status: 'CLICKED'
      },
      {
        stepId: 'visitor_drip_day_2',
        stepTitle: 'Day 2: Reserved Ministerial Plenary Seats',
        sentAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        subject: '🏛️ Sit Front-Row with Federal Ministers & Real Estate Tycoons: Engr. Kenneth Adeleke',
        status: 'OPENED'
      }
    ]
  },
  {
    id: 'sub_2',
    attendeeTicketNumber: 'RECON-2026-VIS-3981',
    fullName: 'Barr. Folashade Alabi',
    email: 'folashade@alabipartners.com',
    organization: 'Alabi Property Law Solicitors',
    phone: '+234 802 334 9988',
    city: 'Lagos State',
    registeredAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    enrolledAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    currentStepIndex: 5,
    currentDayNumber: 5,
    status: 'UPGRADED_ELITE_VIP', // Upgraded on Day 5 after receiving flash discount!
    lastEmailSentAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    lastStepSentId: 'visitor_drip_day_5',
    totalEmailsSent: 6,
    upgradedAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
    upgradeRef: 'FLW-UPG-883921-ELITE',
    deliveryHistory: [
      {
        stepId: 'visitor_drip_day_0',
        stepTitle: 'Day 0: Welcome & VIP Privileges',
        sentAt: new Date(Date.now() - 86400000 * 6).toISOString(),
        subject: '🎟️ Barr. Folashade, Your Free RECON 2026 Pass is Active — See What Unlocks with Elite VIP Access',
        status: 'OPENED'
      },
      {
        stepId: 'visitor_drip_day_5',
        stepTitle: 'Day 5: Flash ₦5,000 Discount Voucher',
        sentAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        subject: '🎁 Exclusive ₦5,000 Discount Voucher: Upgrade to Elite VIP for ₦20,000 Today',
        status: 'CLICKED'
      }
    ]
  },
  {
    id: 'sub_3',
    attendeeTicketNumber: 'RECON-2026-VIS-5012',
    fullName: 'Dr. Obinna Chukwuma',
    email: 'ochukwuma@easterncapital.ng',
    organization: 'Eastern Urban Development Fund',
    phone: '+234 809 772 1002',
    city: 'Enugu / Abuja',
    registeredAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    enrolledAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    currentStepIndex: 1,
    currentDayNumber: 1,
    status: 'ACTIVE_DRIP',
    lastEmailSentAt: new Date(Date.now() - 86400000 * 0.2).toISOString(),
    lastStepSentId: 'visitor_drip_day_1',
    totalEmailsSent: 2,
    deliveryHistory: [
      {
        stepId: 'visitor_drip_day_0',
        stepTitle: 'Day 0: Welcome & VIP Privileges',
        sentAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        subject: '🎟️ Dr. Obinna, Your Free RECON 2026 Pass is Active — See What Unlocks with Elite VIP Access',
        status: 'OPENED'
      }
    ]
  },
  {
    id: 'sub_4',
    attendeeTicketNumber: 'RECON-2026-VIS-2894',
    fullName: 'Hajiya Aisha Bello-Maina',
    email: 'aisha.bello@maina-properties.ng',
    organization: 'Maina Properties & Interior Architecture',
    phone: '+234 814 550 9922',
    city: 'Kaduna / Abuja',
    registeredAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    enrolledAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    currentStepIndex: 3,
    currentDayNumber: 3,
    status: 'UPGRADED_ELITE_VIP', // Upgraded on Day 3 for B2B Matchmaking
    lastEmailSentAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
    lastStepSentId: 'visitor_drip_day_3',
    totalEmailsSent: 4,
    upgradedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    upgradeRef: 'FLW-UPG-39401-B2B',
    deliveryHistory: [
      {
        stepId: 'visitor_drip_day_3',
        stepTitle: 'Day 3: B2B Matchmaking & Private Deal Rooms',
        sentAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
        subject: '🤝 Need Financing or Joint Venture Partners? Unlock Private B2B Deal Rooms',
        status: 'CLICKED'
      }
    ]
  }
];
