export interface AutomationStep {
  id: string;
  dayNumber: number; // Day in the 30-day sequence (0 to 30)
  delayHours: number; // Delay in hours from previous step or registration
  title: string;
  badge: string;
  description?: string;
  targetAudience: 'ALL' | 'VISITOR' | 'ELITE' | 'EXHIBITOR' | 'SPONSOR';
  targetAudienceLabel: string;
  subject: string;
  preheader: string;
  bodyContent: string;
  callToActionText: string;
  callToActionUrl: string;
  active: boolean;
  sentCount: number;
  openRate: number; // e.g. 78.4%
  clickRate: number; // e.g. 34.2%
}

export const INITIAL_30_DAY_AUTOMATION_STEPS: AutomationStep[] = [
  {
    id: 'auto_day_0',
    dayNumber: 0,
    delayHours: 0, // Immediate
    title: 'Day 0: Instant Pass & Gate QR Access Code',
    badge: 'IMMEDIATE',
    targetAudience: 'ALL',
    targetAudienceLabel: 'All Registered Leads',
    subject: '🎟️ Registration Confirmed! Your RECON Expo 2026 Pass: {name} [Ticket: {ticket}]',
    preheader: 'Your official access pass, QR code, and fast-track clearance for Abuja.',
    bodyContent: `Dear {name},

Welcome to the 8th Real Estate & Construction Expo 2026 (RECON Expo)!

Your registration has been successfully logged and verified in the official organizing secretariat database.

TICKET SUMMARY:
• Ticket Number: {ticket}
• Pass Category: {category}
• Organization: {organization}
• Dates: October 29–31, 2026 (08:30 AM Daily)
• Venue: Shehu Musa Yar'Adua Centre, Central Business District, Abuja

Please keep this email handy or save your Smart ID Card to your mobile device for fast-track badge collection at the entrance.`,
    callToActionText: 'View & Download Smart ID Pass',
    callToActionUrl: 'https://reconexpo.afrinetgroup.com/',
    active: true,
    sentCount: 1420,
    openRate: 88.5,
    clickRate: 52.1
  },
  {
    id: 'auto_day_1',
    dayNumber: 1,
    delayHours: 24,
    title: 'Day 1: Expo Survival Guide & Venue Navigation',
    badge: 'DAY 1 (24H)',
    targetAudience: 'ALL',
    targetAudienceLabel: 'All Attendees',
    subject: '🗺️ Day 1 Briefing: Expo Survival Guide, Directions & Parking at Yar\'Adua Centre',
    preheader: 'How to make the most of your 3 days: Parking, WiFi, floor plan & schedule.',
    bodyContent: `Dear {name},

We are excited to count down to RECON Expo 2026 with you!

To ensure your experience in Abuja is seamless, here is your essential Expo Survival Guide:

📍 LOCATION & PARKING:
• Venue: Shehu Musa Yar'Adua Centre, Memorial Drive, CBD, Abuja.
• Dedicated Delegate Parking is available at Gate 2 with valet options for Elite VIP pass holders.

🕒 EVENT TIMINGS:
• Exhibition Halls open at 09:00 AM daily.
• Ministerial Plenary Keynotes commence at 09:30 AM prompt.
• High-Speed Delegate WiFi network credentials will be provided upon gate badge check-in.`,
    callToActionText: 'Explore Interactive Floor Plan',
    callToActionUrl: 'https://reconexpo.afrinetgroup.com/',
    active: true,
    sentCount: 1380,
    openRate: 74.2,
    clickRate: 38.6
  },
  {
    id: 'auto_day_3',
    dayNumber: 3,
    delayHours: 72,
    title: 'Day 3: Keynote Speaker & Ministerial Spotlight',
    badge: 'DAY 3',
    targetAudience: 'ALL',
    targetAudienceLabel: 'All Attendees',
    subject: '🎙️ Meet the Keynotes: Federal Ministers, Leading Developers & PropTech CEOs',
    preheader: 'Discover the headline chairs driving Africa\'s housing & infrastructure revolution.',
    bodyContent: `Dear {name},

At RECON Expo 2026, policy meets execution. Over 24+ renowned thought leaders will chair plenary debates and technical panels across 3 days.

HIGHLIGHTED KEYNOTE CHAIRS:
• Arc. Musa Bello — Minister of Housing & Urban Development (Keynote Address: Single-Digit Mortgages)
• Engr. Fatima Danjuma — CEO, Apex Green Infra (Sustainable Concrete Technologies)
• Dr. Adeyemi Alabi — Managing Director, ShelterBuild Urban Ltd (PropTech & Smart Cities)

Which sessions are on your calendar? Review the complete speaker roster and prepare your questions.`,
    callToActionText: 'View Speaker Lineup & Sessions',
    callToActionUrl: 'https://reconexpo.afrinetgroup.com/',
    active: true,
    sentCount: 1320,
    openRate: 69.8,
    clickRate: 31.4
  },
  {
    id: 'auto_day_5',
    dayNumber: 5,
    delayHours: 120,
    title: 'Day 5: Private B2B Deal Room Matchmaking',
    badge: 'DAY 5',
    targetAudience: 'ELITE',
    targetAudienceLabel: 'VIP Delegates & Exhibitors',
    subject: '🤝 B2B Deal Room Matchmaking: Book 1-on-1 Investor & Developer Meetings',
    preheader: 'Pre-schedule 30-minute private deal consultations with institutional financiers.',
    bodyContent: `Dear {name},

RECON Expo is more than an exhibition — it is where high-volume commercial real estate transactions are closed.

As an accredited delegate, you have exclusive access to our Digital B2B Matchmaking Portal:
• Connect with 40+ Mortgage Lenders and Private Equity Funds
• Review 150+ Pre-Vetted Housing & Infrastructure Projects
• Pre-Book Private 30-Minute Bilateral Deal Rooms in the VIP Executive Wing

Spots in the Deal Rooms are allocated on a first-confirmed basis.`,
    callToActionText: 'Access B2B Matchmaking Portal',
    callToActionUrl: 'https://reconexpo.afrinetgroup.com/',
    active: true,
    sentCount: 450,
    openRate: 81.3,
    clickRate: 46.8
  },
  {
    id: 'auto_day_7',
    dayNumber: 7,
    delayHours: 168,
    title: 'Day 7: Exhibitors Showcase & Exclusive Discounts',
    badge: 'DAY 7',
    targetAudience: 'ALL',
    targetAudienceLabel: 'All Registrants',
    subject: '🏬 150+ Exhibitors Unveiled: Exclusive Property Deals & Material Discounts',
    preheader: 'Explore housing developments in Abuja, Lagos, and Port Harcourt with up to 20% discount.',
    description: 'Weekly exhibitor showcase highlighting top property developments, discounts, and construction materials.',
    bodyContent: `Dear {name},

Looking to invest in residential property, commercial plazas, or construction technology?

Over 150+ certified exhibitors will showcase at RECON 2026, offering exclusive discounts available ONLY to registered expo delegates:
• Off-Plan Housing Developments with flexible 5-year installment plans
• Heavy Construction Equipment & Prefabricated Building Systems
• Solar Energy Micro-Grids and Smart Home Automation Providers

Browse our interactive Exhibitor Directory and bookmark the booths you want to visit.`,
    callToActionText: 'Browse Exhibitor Directory',
    callToActionUrl: 'https://reconexpo.afrinetgroup.com/',
    active: true,
    sentCount: 1240,
    openRate: 65.4,
    clickRate: 28.9
  },
  {
    id: 'auto_day_10',
    dayNumber: 10,
    delayHours: 240,
    title: 'Day 10: VIP Gala Dinner & Built Environment Awards',
    badge: 'DAY 10',
    targetAudience: 'VISITOR',
    targetAudienceLabel: 'Free Visitors (Upsell to VIP)',
    subject: '🌟 Upgrade to Elite VIP: Red-Carpet Gala Dinner & Executive Networking',
    preheader: 'Join industry titans at the black-tie Awards Banquet on October 30th.',
    bodyContent: `Dear {name},

Want to take your networking to the highest executive level?

Upgrade your pass to the Elite VIP Pass (₦20,000) and unlock:
✅ Seat at the Red-Carpet Built Environment Excellence Gala Dinner
✅ Reserved Front-Row Plenary Seating & Fast-Track Gate Security
✅ Access to the Executive Networking Luncheon with Keynote Ministers
✅ Complimentary Digital B2B Deal Room Matchmaking

Spaces at the Gala Dinner tables are strictly capped at 250 executives.`,
    callToActionText: 'Upgrade to Elite VIP Pass (₦20,000)',
    callToActionUrl: 'https://reconexpo.afrinetgroup.com/',
    active: true,
    sentCount: 950,
    openRate: 61.2,
    clickRate: 24.5
  },
  {
    id: 'auto_day_14',
    dayNumber: 14,
    delayHours: 336,
    title: 'Day 14: Sustainable Green Building & CPD Masterclasses',
    badge: 'DAY 14',
    targetAudience: 'ALL',
    targetAudienceLabel: 'All Attendees',
    subject: '🌱 Certified Green Building Masterclasses: Earn CPD Units at RECON 2026',
    preheader: 'Accredited technical workshops for architects, engineers, and project leaders.',
    bodyContent: `Dear {name},

Sustainability is no longer optional in real estate.

Join our certified Continuing Professional Development (CPD) Masterclasses covering:
1. Carbon-Neutral Cement and Low-Energy Building Design
2. Building Information Modeling (BIM) for Large-Scale Developments
3. Real Estate Tokenization & Smart Contracts on the Blockchain

All participants receive official CPD Certificates endorsed by leading professional regulatory councils.`,
    callToActionText: 'Reserve Your Masterclass Seat',
    callToActionUrl: 'https://reconexpo.afrinetgroup.com/',
    active: true,
    sentCount: 1100,
    openRate: 58.7,
    clickRate: 22.3
  },
  {
    id: 'auto_day_18',
    dayNumber: 18,
    delayHours: 432,
    title: 'Day 18: Housing Finance & Mortgage Clinic',
    badge: 'DAY 18',
    targetAudience: 'ALL',
    targetAudienceLabel: 'All Registrants',
    subject: '💰 National Mortgage Clinic: Get Pre-Approved for Single-Digit Home Loans',
    preheader: 'Direct consultation with mortgage banks and the Federal Mortgage Bank of Nigeria.',
    bodyContent: `Dear {name},

Financing is the key that unlocks real estate wealth.

At RECON 2026, the National Mortgage Clinic will provide on-site credit assessment and pre-qualification:
• Single-Digit Interest Mortgage Products for Salary Earners & Business Owners
• National Housing Fund (NHF) Loan Applications & Advisory
• Diaspora Mortgage Schemes backed by central escrow guarantees

Bring your financial documents to the Mortgage Suite at the Yar'Adua Centre for instant review.`,
    callToActionText: 'Learn About the Mortgage Clinic',
    callToActionUrl: 'https://reconexpo.afrinetgroup.com/',
    active: true,
    sentCount: 1050,
    openRate: 63.1,
    clickRate: 35.4
  },
  {
    id: 'auto_day_21',
    dayNumber: 21,
    delayHours: 504,
    title: 'Day 21: One Week to Build-Up (Exhibitor Logistics)',
    badge: 'DAY 21',
    targetAudience: 'EXHIBITOR',
    targetAudienceLabel: 'Exhibitors Only',
    subject: '🎪 One Week to Setup: Exhibitor Stand Build-Up & Vehicle Loading Protocols',
    preheader: 'Loading dock passes, electricity connections, and staff badge collection.',
    bodyContent: `Dear Exhibitor Partner ({organization}),

Stand construction commences in exactly one week at the Yar'Adua Centre.

CRITICAL SETUP CHECKLIST:
1. Stand Build-Up: Wednesday, October 28th (08:00 AM – 08:00 PM)
2. Loading Dock Permits: Required for all transport trucks entering Gate 3
3. Fascia Board Names: Verify your company display spelling in the portal
4. Company Staff Badges: Register all booth representatives by Monday

Our Technical Operations team will be on-site to assist with power sockets, lighting, and furniture rentals.`,
    callToActionText: 'Manage Exhibitor Portal & Badges',
    callToActionUrl: 'https://reconexpo.afrinetgroup.com/',
    active: true,
    sentCount: 120,
    openRate: 91.2,
    clickRate: 64.7
  },
  {
    id: 'auto_day_25',
    dayNumber: 25,
    delayHours: 600,
    title: 'Day 25: 5-Day Final Countdown & Schedule Briefing',
    badge: 'DAY 25',
    targetAudience: 'ALL',
    targetAudienceLabel: 'All Attendees',
    subject: '⏳ 5 Days Countdown! Final Schedule & Plenary Briefing: RECON 2026',
    preheader: 'Final updates on plenary timings, minister arrivals, and registration desks.',
    bodyContent: `Dear {name},

In just 5 days, the doors of the Shehu Musa Yar'Adua Centre will open for the 8th Real Estate & Construction Expo!

FINAL EVENT TIMETABLE:
• Day 1 (Oct 29): Opening Ceremony & Ministerial Plenary
• Day 2 (Oct 30): PropTech Masterclasses & VIP Gala Awards
• Day 3 (Oct 31): B2B Deal Closing & Diaspora Investment Summit

Make sure to arrive early (08:30 AM) to complete badge check-in and secure prime seating in the Plenary Auditorium.`,
    callToActionText: 'View Final Agenda & Timetable',
    callToActionUrl: 'https://reconexpo.afrinetgroup.com/',
    active: true,
    sentCount: 1390,
    openRate: 77.8,
    clickRate: 41.2
  },
  {
    id: 'auto_day_28',
    dayNumber: 28,
    delayHours: 672,
    title: 'Day 28: 48-Hour Final Gate Pass & Security Advisory',
    badge: 'DAY 28',
    targetAudience: 'ALL',
    targetAudienceLabel: 'All Registered Leads',
    subject: '🚨 48 Hours to Go! Your Fast-Track Entry QR Badge: {name} [{ticket}]',
    preheader: 'Avoid queue delays at the gate by downloading your smart digital pass.',
    bodyContent: `Dear {name},

Your digital gate pass is ready for RECON Expo 2026!

GATE ACCESS INSTRUCTIONS:
1. Have your QR Code ready on your phone screen upon arrival at Gate 1.
2. Fast-Track Scanner desks will immediately print your customized lanyard badge.
3. Bring a valid government ID (Driver's License, NIN, or Passport) for security verification.

We look forward to welcoming you to the capital city of Abuja!`,
    callToActionText: 'Download Your Fast-Track Pass',
    callToActionUrl: 'https://reconexpo.afrinetgroup.com/',
    active: true,
    sentCount: 1410,
    openRate: 84.6,
    clickRate: 59.3
  },
  {
    id: 'auto_day_29',
    dayNumber: 29,
    delayHours: 696,
    title: 'Day 29: Tomorrow is the Day! (Doors Open at 08:30 AM)',
    badge: 'DAY 29 (EVE)',
    targetAudience: 'ALL',
    targetAudienceLabel: 'All Attendees',
    subject: '🔥 Tomorrow is the Day! RECON Expo 2026 Opens at 08:30 AM (Abuja)',
    preheader: 'Everything is set at the Yar\'Adua Centre. See you tomorrow morning!',
    bodyContent: `Dear {name},

Tomorrow morning, the built-environment industry convenes at the Shehu Musa Yar'Adua Centre, Abuja!

DOORS OPEN AT 08:30 AM:
• 08:30 AM: Fast-Track Registration & Networking Coffee
• 09:30 AM: Opening Ministerial Keynote Address
• 11:00 AM: Ribbon Cutting & Exhibition Hall Tour

Travel safely and prepare for 3 transformative days of housing innovation, B2B deal making, and executive networking.`,
    callToActionText: 'Get Turn-by-Turn Directions',
    callToActionUrl: 'https://reconexpo.afrinetgroup.com/',
    active: true,
    sentCount: 1420,
    openRate: 89.2,
    clickRate: 63.8
  },
  {
    id: 'auto_day_30',
    dayNumber: 30,
    delayHours: 720,
    title: 'Day 30: Thank You, Certificate of Attendance & 2027 Early Bird',
    badge: 'DAY 30 (POST)',
    targetAudience: 'ALL',
    targetAudienceLabel: 'All Attendees',
    subject: '🎓 Thank You for Attending RECON 2026! Download Certificate & Slides',
    preheader: 'Access plenary slide decks, photo albums, and 2027 VIP early bird rates.',
    bodyContent: `Dear {name},

On behalf of the Organizing Secretariat and our partners, thank you for making RECON Expo 2026 a resounding success!

YOUR POST-EVENT RESOURCES:
1. Official Certificate of Attendance (Downloadable in your delegate portal)
2. Complete Plenary Presentation Slides & Technical Whitepapers
3. Official High-Resolution Photo Albums & Video Replays
4. Early Bird Reservations for RECON Expo 2027 (Save 30% on booths and VIP tables)

Please take 2 minutes to complete our brief attendee feedback survey to help us serve you even better next year.`,
    callToActionText: 'Download Certificate & Slides',
    callToActionUrl: 'https://reconexpo.afrinetgroup.com/',
    active: true,
    sentCount: 1390,
    openRate: 72.4,
    clickRate: 48.9
  }
];
