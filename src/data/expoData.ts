import { Speaker, Session, RegistrationTier, BoothPackage, Sponsor, ExpoDetails, HeroBackgroundSlide, SectorItem, FaqItem } from '../types';

export const EXPO_DETAILS: ExpoDetails = {
  name: "The 8th Real Estate & Construction Expo 2026",
  shortName: "RECON Expo 2026",
  theme: "Exploring Opportunities in the Real Sector for Economic Development",
  subheading: "Africa's Premier Real Estate, Construction Innovation & Infrastructure Investment Summit",
  dateRange: "29th – 30th October 2026",
  startDate: "2026-10-29T10:00:00+01:00",
  endDate: "2026-10-30T18:00:00+01:00",
  dailyTime: "10:00 AM – 6:00 PM WAT",
  venue: "Shehu Musa Yar'Adua Centre",
  venueAddress: "Plot 1161, Memorial Drive, Central Business District, Abuja, FCT, Nigeria",
  contactEmail: "reconexpo@afrinetgroup.com",
  contactPhone: "+234 (0) 9 461 4000",
  contactPhone2: "+234 803 982 7711",
  contactPhone3: "+234 802 345 6789",
  contactPhone4: "+234 818 765 4321",
  whatsapp: "+234 803 982 7711",
  totalEventDays: 2,
  stats: {
    attendees: "5,000+",
    exhibitors: "120+",
    speakers: "45+",
    countries: "22+",
    dealsProjected: "₦50B+",
    b2bMeetings: "850+",
  },
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
  },
  siteTexts: {
    // Navigation Bar
    navAnnouncementVenue: "Shehu Musa Yar'Adua Centre • Abuja, Nigeria",
    navAnnouncementHelplinePrefix: "Helplines:",
    navDelegatePortalBtn: "Registration account",
    navRegisterBtn: "REGISTER NOW",

    // Hero Section
    heroTopBadge: "AFRICA’S PREMIER REAL ESTATE & INFRASTRUCTURE SUMMIT • ABUJA 2026",
    heroCategory: "REAL ESTATE EXPO IN ABUJA, NIGERIA",
    heroThemeLabel: "OFFICIAL EXPO THEME",
    heroOrganizerLabel: "This Event Is Organized By:",
    heroOrganizerText: "Afrinet Group and Afrinex West Africa in Collaboration with Abuja Chamber of Commerce & Industry",
    heroPrimaryCta: "Register as Delegate / Visitor",
    heroSecondaryCta: "Explore Full Schedule & Speakers",
    heroCountdownTitle: "24-Hour VIP Registration & Discount Window",
    heroStat1Label: "Registered Attendees",
    heroStat2Label: "Industry Exhibitors",
    heroStat3Label: "Keynote Speakers",
    heroStat4Label: "Projected Deals",
    heroEventInfoDateLabel: "Event Date",
    heroEventInfoDateSubtitle: "2 Full Days of Action",
    heroEventInfoLocationLabel: "Location",
    heroEventInfoTimeLabel: "Daily Timing",
    heroEventInfoTimeSubtitle: "West Africa Time (WAT)",

    // Sectors & Ecosystem
    sectorsBadge: "WHO ATTENDS & COLLABORATES",
    sectorsHeading: "Uniting the Entire Real Estate, Infrastructure & PropTech Ecosystem",
    sectorsConveningBarTitle: "Convening:",
    sectorsConveningPills: "Real Estate Investors, Developers, Construction Companies, Government Officials, Financial Institutions, Architects & Engineers, Property Professionals, Tech Innovators, Diaspora Buyers",

    // Speakers & Panelists
    speakersBadge: "GLOBAL & NATIONAL THOUGHT LEADERS",
    speakersHeading: "Distinguished Keynote Speakers",
    speakersSubtitle: "Learn directly from the foremost authorities steering multi-billion naira infrastructure master plans, smart city financing, and disruptive construction technologies.",
    speakersCtaButton: "Reserve Your Seat with Speakers",

    panelistsBadge: "INDUSTRY LEADERS & PANEL DIRECTORS",
    panelistsHeading: "Additional Esteemed Industry Panelists & Chairs",
    panelistsSubtitle: "Over 45+ accredited architects, real estate lawyers, bankers, and PropTech innovators on stage.",
    panelistsGuideBadge: "Full 45+ Lineup In Official Guide",

    // Programme Agenda
    programmeBadge: "COMPREHENSIVE EXPO AGENDA",
    programmeHeading: "The Official Expo Programme",
    programmeSubtitle: "From high-level policy summits to PropTech AI hackathons and private B2B deal rooms, explore an action-packed conference schedule at Shehu Musa Yar'Adua Centre.",
    programmeDownloadBtn: "Download Full Conference Schedule (PDF)",

    // Registration & Tiers
    registrationBadge: "REGISTRATION & PARTICIPATION TIERS",
    registrationHeading: "BE PART OF THE REAL ESTATE & CONSTRUCTION FUTURE",
    registrationSubtitle: "Select your category below: Register online for Visitor Pass (Free) or Elite VIP Pass (₦25,000 / $25). Registrations for Exhibitors, Sponsors, and Strategic Partners are handled directly by the Organizing Secretariat.",
    registrationPaymentBtnLabel: "Confirm Your Registration",
    registrationDiscountBtnLabel: "Apply Promo Code",
    registrationMainFeeLabel: "₦25,000 / $25",
    registrationDiscountFeeLabel: "₦20,000 / $20",
    registrationDiscountAmountLabel: "₦5,000",
    elitePaymentLink: "https://flutterwave.com/pay/8psefp46habu",
    discountPaymentLink: "https://flutterwave.com/pay/vlg1htodborh",
    registrationCheckBadgeBtn: "Already Registered? Check Badge Status & Download Smart ID",
    registrationSecretariatNoteTitle: "Direct Organizing Secretariat Processing",
    registrationSecretariatNoteText: "Registrations for Exhibitor Booths, Corporate Sponsors, and Strategic Partners are handled exclusively by the Organizing Secretariat to guarantee prime floor allocation and custom branding.",
    registrationSecretariatHelplineText: "Helplines: +234 803 314 3612 / +234 802 360 0000",

    // Sponsors & Partners
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
    sponsorsPartnerButton: "PARTNER WITH THE EXPO",

    // Affiliate Marketer
    marketerBadge: "OFFICIAL RECON 2026 AFFILIATE PROGRAM",
    marketerHeading: "Become a Marketer",
    marketerSubtitleTag: "( Make Money by Referrals )",
    marketerDescription: "Partner with RECON Expo 2026 as an authorized affiliate promoter. Earn guaranteed instant cash commissions on every registered VIP delegate (₦5,000) and Exhibitor Booth Stand booking (10% Commission).",
    marketerCommissionRate: "Earn ₦5,000 on VIP Passes & 10% Commission on Exhibitor Booth Stands",
    marketerCard1Title: "₦5,000 VIP Commission",
    marketerCard1Desc: "Earn an instant ₦5,000 naira payout for every Executive VIP delegate or paid attendee who registers using your referral code or link.",
    marketerCard2Title: "10% Exhibitor Commission",
    marketerCard2Desc: "Earn guaranteed 10% cash commission on every Exhibitor Booth Stand booked through your referral code or link (₦35,000 to ₦150,000+ per booth).",
    marketerCard3Title: "Custom Promo Code & Link",
    marketerCard3Desc: "Choose your personalized promo code (e.g. VIP-DAVID). Share it on WhatsApp, Social Media, or Email with dedicated 1-click links!",
    marketerCard4Title: "Direct Bank Payouts",
    marketerCard4Desc: "Provide your Nigerian bank account details during sign up. Commissions are processed and paid directly to your account upon admin payment verification.",
    marketerCtaBadge: "Start Earning Money Today",
    marketerCtaHeading: "Ready to start earning with RECON 2026?",
    marketerCtaSubtitle: "Sign up as an official marketer in less than 60 seconds. Get your custom code and start inviting delegates now.",
    marketerBtnRegister: "Become a Marketer Now",
    marketerBtnLogin: "Marketer Login",

    // FAQs
    faqBadge: "DELEGATE & EXHIBITOR ESSENTIALS",
    faqHeading: "Frequently Asked Questions",
    faqSubtitle: "Key details on travel logistics, booth provisioning, and B2B investor meeting access.",

    // Footer & Call to Action
    footerCtaBadge: "JOIN OVER 5,000+ PROPERTY LEADERS",
    footerCtaHeading: "READY TO CONNECT, INVEST AND BUILD THE FUTURE?",
    footerCtaSubtitle: "Secure your delegate pass today for 2 unforgettable days of high-yield real estate networking, innovative construction demos, and direct investor deal rooms at Shehu Musa Yar'Adua Centre, Abuja.",
    footerCtaButton: "REGISTER NOW FOR EXPO 2026",
    footerPrimaryCta: "REGISTER NOW FOR EXPO 2026",
    footerSecondaryCta: "BOOK AN EXHIBITION BOOTH",
    footerAboutText: "The 8th Real Estate & Construction Expo 2026 is Nigeria’s definitive real sector platform for high-impact investments, smart housing, and construction technology.",
    footerOrganizerText: "This Event Is Organized By: Afrinet Group and Afrinex West Africa in Collaboration with Abuja Chamber of Commerce & Industry",
    footerQuickLinksTitle: "QUICK LINKS",
    footerHelplineTitle: "OFFICIAL DESK & HELPLINES",
    footerSecretariatTitle: "Contact the Organizing Secretariat",
    footerSecretariatSubtitle: "Have specific inquiries regarding VIP delegations, press accreditation, or speaking opportunities? Send us a direct dispatch.",
    footerCopyrightText: "© 2026 RECON Expo (Real Estate & Construction Expo). All Rights Reserved. Organized by Afrinet Group and Afrinex West Africa in Collaboration with Abuja Chamber of Commerce & Industry."
  }
};

export const HERO_SLIDES_INITIAL: HeroBackgroundSlide[] = [
  {
    id: "hero-1",
    url: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=2000&q=85',
    title: 'Nigerian Developers & Investors Strategy Panel',
    city: 'Shehu Musa Yar’Adua Centre, Abuja',
    edition: 'RECON Plenary & Policy Dialogue',
    description: 'Black Nigerian property executives, developers, and sovereign fund managers in keynote discussions',
    transitionEffect: 'scale-110 translate-x-3 duration-[2400ms]',
  },
  {
    id: "hero-2",
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=2000&q=85',
    title: 'Nigerian Female Real Estate Leaders & PropTech Founders',
    city: 'Eko Convention Centre, Lagos',
    edition: 'Lagos Real Estate Leadership Forum',
    description: 'High-impact address by Black Nigerian women leaders in real estate, housing finance & urban development',
    transitionEffect: 'scale-115 -translate-y-2 duration-[2400ms]',
  },
  {
    id: "hero-3",
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=2000&q=85',
    title: 'Nigerian Architectural & Urban Planning Delegation',
    city: 'Landmark Centre, Victoria Island',
    edition: 'Smart Housing & City Design Workshop',
    description: 'Black Nigerian architects, urban planners and structural engineers in interactive technical session',
    transitionEffect: 'scale-120 translate-y-3 duration-[2400ms]',
  },
  {
    id: "hero-4",
    url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=2000&q=85',
    title: 'Nigerian Real Sector Investors & Corporate Leaders Summit',
    city: 'International Conference Centre (ICC), Abuja',
    edition: 'Abuja Real Estate Executive Forum',
    description: 'Black Nigerian institutional investors, mortgage bankers, and housing authority leaders',
    transitionEffect: 'scale-110 -translate-y-3 duration-[2400ms]',
  },
  {
    id: "hero-5",
    url: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=2000&q=85',
    title: 'Nigerian Masterplan Developers & Project Management Team',
    city: 'Maitama, Abuja FCT',
    edition: 'RECON Commercial Project Review',
    description: 'Black Nigerian project directors and infrastructure developers reviewing masterplan blueprints',
    transitionEffect: 'scale-105 -translate-x-3 duration-[2400ms]',
  },
  {
    id: "hero-6",
    url: 'https://images.unsplash.com/photo-1573497491765-dccce02b29df?auto=format&fit=crop&w=2000&q=85',
    title: 'Nigerian Civil Engineers & Construction Technology Showcase',
    city: 'Transcorp Hilton Congress Hall, Abuja',
    edition: 'RECON PropTech & Engineering Showcase',
    description: 'Black Nigerian civil engineers and construction technology innovators on smart building systems',
    transitionEffect: 'scale-110 translate-x-2 -translate-y-2 duration-[2400ms]',
  },
  {
    id: "hero-7",
    url: 'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&w=2000&q=85',
    title: 'Nigerian Real Estate Finance & Mortgage Banking Symposium',
    city: 'Victoria Island, Lagos',
    edition: 'Lagos Housing Finance Summit',
    description: 'Black Nigerian investment bankers and mortgage executives discussing single-digit housing loans',
    transitionEffect: 'scale-110 translate-y-2 duration-[2400ms]',
  },
  {
    id: "hero-8",
    url: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=2000&q=85',
    title: 'Nigerian Real Estate Industry Keynote & Gala Address',
    city: 'Shehu Musa Yar’Adua Centre, Abuja',
    edition: 'RECON Inaugural Keynote Address',
    description: 'Black Nigerian real estate developer and visionary keynote address to delegates',
    transitionEffect: 'scale-115 translate-x-2 duration-[2400ms]',
  },
];


export const SPEAKERS: Speaker[] = [
  {
    id: "spk-1",
    name: "Arc. Babatunde Sanusi, FNIA",
    title: "President & Advisory Council Chair",
    organization: "Nigerian Infrastructure & Urban Development Council",
    bio: "Pioneering sustainable urban master-planning and green architecture across West Africa with 25+ years of infrastructure leadership.",
    fullBio: "Arc. Babatunde Sanusi is a Fellow of the Nigerian Institute of Architects and former Senior Infrastructure Advisor. He has spearheaded landmark urban regeneration programs across the Federal Capital Territory and advised multilateral development banks on climate-resilient metropolitan frameworks.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    topic: "Smart Urban Planning, Master Development & Sustainable Real Estate in Abuja 2030",
    keynote: true,
    track: "Architecture",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com"
  },
  {
    id: "spk-2",
    name: "Dr. Amina Bello Yusuf",
    title: "Managing Director & CEO",
    organization: "Apex Green Capital & Real Estate Fund",
    bio: "Leading investment strategist managing over $400M in mixed-use real estate, commercial REITs, and infrastructure equity funds.",
    fullBio: "Dr. Amina Bello Yusuf holds a doctorate in Development Finance from Cambridge and chairs the Africa PropTech Investment Forum. She is renowned for bridging diaspora capital and sovereign wealth with high-yield commercial and residential developments across emerging African hubs.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    topic: "Unlocking Institutional Capital, Diaspora Inflows & PropTech Financing in West Africa",
    keynote: true,
    track: "Investment",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com"
  },
  {
    id: "spk-3",
    name: "Engr. Chukwuma Okafor, FNSE",
    title: "Chief Innovation Officer",
    organization: "BuildTech Africa & Modular Systems",
    bio: "Pioneer in AI-driven structural engineering, modular prefabrication, and low-carbon cement technologies for rapid affordable housing.",
    fullBio: "Engr. Chukwuma Okafor has engineered over 1.2 million square meters of premium industrial and residential structures. His recent projects include automated 3D-printed housing prototypes and smart digital twin monitoring systems for mega-bridges and skyscraper developments.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    topic: "Next-Gen Construction: 3D Printing, Modular Pre-fab & AI-Assisted Site Management",
    keynote: true,
    track: "Technology",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com"
  },
  {
    id: "spk-4",
    name: "Hajiya Fatima Al-Hassan",
    title: "Executive Director of Housing Delivery",
    organization: "Federal Housing Authority (FHA)",
    bio: "Spearheading national public-private partnerships to bridge Nigeria's housing deficit through innovative land access and mortgage refinancing.",
    fullBio: "Hajiya Fatima has over 20 years of public sector and mortgage banking experience. She has structured concessionary financing models that enabled the delivery of over 30,000 housing units across key geopolitical zones in Nigeria.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    topic: "Public-Private Partnerships (PPP) for Affordable Housing & Land Title Digitization",
    keynote: false,
    track: "Policy",
    linkedin: "https://linkedin.com"
  },
  {
    id: "spk-5",
    name: "Tariq Adeleke",
    title: "Founder & CTO",
    organization: "PropAI Solutions",
    bio: "Building AI valuation models, automated smart contract escrow, and digital twin analytics for commercial real estate.",
    fullBio: "Tariq Adeleke is a veteran software architect and property technologist whose algorithms process real-time geospatial property yields across Lagos, Abuja, Accra, and Nairobi.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    topic: "Artificial Intelligence in Property Valuation, Title Verification & Smart Facilities",
    keynote: false,
    track: "Technology",
    linkedin: "https://linkedin.com"
  },
  {
    id: "spk-6",
    name: "Barr. (Mrs.) Folashade Adeleke-Cole",
    title: "Senior Partner, Real Estate Law & Concessions",
    organization: "Cole & Associates Legal",
    bio: "Top legal authority on Nigerian land tenure, FCDA title regularization, REIT compliance, and construction dispute mitigation.",
    fullBio: "Barr. Folashade represents international developers, concessionaires, and financial syndicates in multimillion-dollar title securitization and infrastructure bonds across Abuja and Lagos.",
    image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=600&q=80",
    topic: "Navigating Title Security, Land Use Act Reforms & Foreign Investor Protections",
    keynote: false,
    track: "Strategy",
    linkedin: "https://linkedin.com"
  }
];

export const PROGRAMME_SESSIONS: Session[] = [
  // DAY 1 - Thursday, 29 October 2026
  {
    id: "d1-1",
    day: 1,
    date: "Thursday, 29 October 2026",
    time: "10:00 AM – 11:30 AM",
    title: "Grand Opening Ceremony & High-Level Policy Keynote",
    description: "Official welcome address by Federal Dignitaries, FCT Administration, and RECON Expo organizers. Unveiling the 2026-2030 National Real Sector Roadmap.",
    category: "Keynote",
    speakerName: "Arc. Babatunde Sanusi, FNIA",
    speakerRole: "President, Infrastructure & Urban Development Council",
    speakerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    location: "Main Auditorium (Shehu Yar'Adua Hall)",
    iconName: "Building2",
    featured: true
  },
  {
    id: "d1-2",
    day: 1,
    date: "Thursday, 29 October 2026",
    time: "11:45 AM – 01:15 PM",
    title: "VIP Ribbon Cutting & Exhibition Floor Tour",
    description: "Opening of the 120+ showcase booths featuring leading construction giants, luxury property developers, heavy machinery tech, and architectural models.",
    category: "Exhibition & Demo",
    speakerName: "Expo Executive Committee & Dignitaries",
    speakerRole: "VIP Delegation",
    speakerImage: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=400&q=80",
    location: "Grand Expo Pavilions A & B",
    iconName: "Sparkles"
  },
  {
    id: "d1-3",
    day: 1,
    date: "Thursday, 29 October 2026",
    time: "02:00 PM – 03:15 PM",
    title: "Macroeconomic Real Estate Outlook: Financing Mega-Projects in Nigeria",
    description: "Panel discussion with leading banks, private equity titans, and REIT managers on hedging inflation, currency stability, and funding massive capital infrastructure.",
    category: "Panel Discussion",
    speakerName: "Dr. Amina Bello Yusuf",
    speakerRole: "CEO, Apex Green Capital",
    speakerImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    location: "Main Auditorium",
    iconName: "TrendingUp",
    featured: true
  },
  {
    id: "d1-4",
    day: 1,
    date: "Thursday, 29 October 2026",
    time: "03:30 PM – 04:45 PM",
    title: "PropTech, AI & Smart Building Automation Showcase",
    description: "Exploring real-time AI valuation algorithms, digital twins, IoT energy optimization, automated property registries, and blockchain smart contracts.",
    category: "Keynote",
    speakerName: "Tariq Adeleke",
    speakerRole: "Founder & CTO, PropAI Solutions",
    speakerImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    location: "Innovation Dome (Hall C)",
    iconName: "Cpu",
    featured: true
  },
  {
    id: "d1-5",
    day: 1,
    date: "Thursday, 29 October 2026",
    time: "05:00 PM – 06:30 PM",
    title: "Executive Networking Cocktail & Dealmakers Welcome Lounge",
    description: "Structured high-level networking, investor speed-meetings, and bilateral government-to-business deal structuring over curated refreshments.",
    category: "Networking",
    speakerName: "RECON VIP Networking Host",
    speakerRole: "Dealmakers Lounge",
    speakerImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=80",
    location: "Emerald Garden & VIP Terrace",
    iconName: "Users"
  },

  // DAY 2 - Friday, 30 October 2026
  {
    id: "d2-1",
    day: 2,
    date: "Friday, 30 October 2026",
    time: "10:00 AM – 11:30 AM",
    title: "Future of Construction: 3D Concrete Printing, Pre-Fab & Drone Surveying",
    description: "Live demonstration of robotic mortar printing, industrialized prefabricated wall systems, and high-altitude photogrammetry for construction site supervision.",
    category: "Keynote",
    speakerName: "Engr. Chukwuma Okafor, FNSE",
    speakerRole: "CIO, BuildTech Africa",
    speakerImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    location: "Outdoor Tech Arena & Main Hall",
    iconName: "HardHat",
    featured: true
  },
  {
    id: "d2-2",
    day: 2,
    date: "Friday, 30 October 2026",
    time: "11:45 AM – 01:15 PM",
    title: "Sustainable Architecture, Green Materials & Zero-Carbon Cities",
    description: "How cutting-edge Nigerian architects and engineering firms are utilizing solar microgrids, green concrete, passive cooling, and indigenous sustainable materials.",
    category: "Panel Discussion",
    speakerName: "Hajiya Fatima Al-Hassan",
    speakerRole: "Executive Director, FHA",
    speakerImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    location: "Main Auditorium",
    iconName: "Leaf"
  },
  {
    id: "d2-3",
    day: 2,
    date: "Friday, 30 October 2026",
    time: "02:00 PM – 03:30 PM",
    title: "B2B Investment Deal Rooms & Legal Masterclass (C-of-O & Title Perfection)",
    description: "Direct pitch sessions with 15 pre-vetted land developments and masterclass on legal strategies for safeguarding acquisitions, ancestral rights, and FCDA allocations.",
    category: "Investor Pitch",
    speakerName: "Dr. Amina Bello Yusuf & Barr. Folashade Adeleke-Cole",
    speakerRole: "Investment Syndicate & Legal Partners",
    speakerImage: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80",
    location: "Executive Deal Room A & B",
    iconName: "Coins",
    featured: true
  },
  {
    id: "d2-4",
    day: 2,
    date: "Friday, 30 October 2026",
    time: "03:45 PM – 05:15 PM",
    title: "Startup Pitch Finale: ₦25,000,000 PropTech & Green Building Grant",
    description: "Top 8 shortlisted innovators pitch live to a celebrity venture jury for non-dilutive grant funding and incubation contracts with top developers.",
    category: "Investor Pitch",
    speakerName: "Venture Jury Panel & Taskforce",
    speakerRole: "Innovation Fund",
    speakerImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    location: "Innovation Dome (Hall C)",
    iconName: "Sparkles",
    featured: true
  },
  {
    id: "d2-5",
    day: 2,
    date: "Friday, 30 October 2026",
    time: "06:00 PM – 09:30 PM",
    title: "RECON Excellence Awards Gala Dinner & Closing Banquet",
    description: "The premier red-carpet black-tie gala celebrating Nigeria's finest architectural landmarks, sustainable developers, innovation leaders, and outstanding lifetime contributors.",
    category: "Awards",
    speakerName: "Distinguished Guests & Awardees",
    speakerRole: "Annual Gala Council",
    speakerImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=80",
    location: "Grand Yar'Adua Banquet Hall",
    iconName: "Trophy",
    featured: true
  }
];

export const REGISTRATION_TIERS: RegistrationTier[] = [
  {
    id: "visitor",
    title: "VISITOR PASS",
    badge: "Free Admission",
    tagline: "General Visitor Pass",
    targetAudience: "For trade visitors, buyers, real estate enthusiasts, students & professionals seeking expo exhibition hall access.",
    priceNGN: "FREE",
    priceUSD: "Free",
    popular: false,
    features: [
      "Access to all Expo Exhibition Halls & Product Pavilions",
      "Entry to 120+ Developer, Builder & Innovation Booths",
      "Digital Smart ID Visitor Badge with QR & Barcode",
      "Access to Open Networking Lounges & Coffee Areas",
      "Official Expo Directory & Exhibitor Catalog Access",
      "Access to Public Technology Demo Stages"
    ],
    ctaText: "REGISTER AS VISITOR (FREE)",
    accentColor: "sky",
    defaultMaxStaffBadges: 1
  },
  {
    id: "elite",
    title: "ELITE VIP GUEST",
    badge: "Most Popular VIP Pass",
    tagline: "Elite VIP Guest Pass",
    targetAudience: "For executives, investors, corporate buyers and delegates desiring full VIP summit access & Gala banquet.",
    priceNGN: "₦25,000",
    priceUSD: "$25",
    discountPriceNGN: "₦20,000",
    discountPriceUSD: "$20",
    discountAmountNGN: "₦5,000",
    paymentLink: "https://flutterwave.com/pay/8psefp46habu",
    discountPaymentLink: "https://flutterwave.com/pay/vlg1htodborh",
    popular: true,
    features: [
      "All Expo Exhibition Halls & Product Pavilions Access",
      "All 12+ Keynote & Technical Industry Plenary Presentations",
      "Red-Carpet National Real Estate & Construction Gala Dinner",
      "VIP Fast-Track Registration & Executive RFID/QR Smart Badge",
      "Private B2B Ministerial & Institutional Investor Deal Rooms",
      "VIP Executive Lounge Access with Complimentary Refreshments",
      "Priority Reserved Front-Row Seating at Keynote Stages",
      "Official Certified Certificate of Participation & CPD Credits"
    ],
    ctaText: "GET ELITE VIP PASS (₦25,000)",
    accentColor: "amber",
    defaultMaxStaffBadges: 1
  },
  {
    id: "exhibitor",
    title: "EXHIBITORS",
    badge: "Commission: 10%",
    tagline: "Exhibitor Booth Stand • Commission: 10%",
    targetAudience: "For property developers, construction companies, technology providers, financial institutions and building brands.",
    priceNGN: "Direct Inquire",
    priceUSD: "10% Referral Comm.",
    features: [
      "Marketers earn guaranteed Commission: 10% on every booth stand booked using referral code or link",
      "Registration handled directly by RECON 2026 Organizing Secretariat",
      "Fully Furnished 3x3m (9sqm), 6x3m (18sqm) or 6x6m (36sqm) Prime Stand Allocation",
      "Direct face-to-face access to 5,000+ verified buyers & investors",
      "Company Profile featured in Official Printed & Digital Guide",
      "Official Corporate ID Badges generated & issued exclusively by Secretariat",
      "Dedicated Onsite Secretariat Liaison & Technical Support"
    ],
    ctaText: "REGISTER VIA SECRETARIAT",
    accentColor: "emerald",
    defaultMaxStaffBadges: 3
  },
  {
    id: "sponsor",
    title: "SPONSORS",
    badge: "Bespoke Packages",
    tagline: "Corporate Summit Sponsorship",
    targetAudience: "For premium brands seeking headline industry authority, media spotlight, keynote plenary slots and bilateral deal rooms.",
    priceNGN: "Direct Inquire",
    priceUSD: "Bespoke Packages",
    features: [
      "Registration handled directly by RECON 2026 Organizing Secretariat",
      "Headline / Platinum / Gold branding across all event collaterals",
      "Keynote Speaking & Panel Chairing on the Main Plenary Stage",
      "Prime Double Island Exhibition space in VIP entrance atrium",
      "Official Sponsor Executive Badges issued exclusively by Secretariat",
      "Exclusive access to Private Ministerial & Investor Deal Rooms"
    ],
    ctaText: "REGISTER VIA SECRETARIAT",
    accentColor: "red",
    defaultMaxStaffBadges: 5
  },
  {
    id: "partner",
    title: "PARTNERS",
    badge: "Institutional Alliance",
    tagline: "Strategic Partner Alliance",
    targetAudience: "For professional bodies, government MDAs, trade chambers, media broadcast houses and institutional collaborators.",
    priceNGN: "Direct Inquire",
    priceUSD: "MoU Agreement",
    features: [
      "Registration handled directly by RECON 2026 Organizing Secretariat",
      "Co-branding on official delegate collateral, lanyards and bags",
      "Special breakout session hosting & thought-leadership track",
      "Joint press release and institutional endorsement highlights",
      "Official Partner Executive Badges issued exclusively by Secretariat",
      "VIP networking privileges for executive leadership delegation"
    ],
    ctaText: "REGISTER VIA SECRETARIAT",
    accentColor: "purple",
    defaultMaxStaffBadges: 4
  },
];

export const DEFAULT_BOOTH_PACKAGES: BoothPackage[] = [
  {
    id: 'standard_9sqm',
    name: 'Standard Shell Scheme (9sqm - 3x3m)',
    priceNGN: 350000,
    priceFormatted: '₦350,000',
    badges: 2,
    commissionRate: 0.10,
    desc: 'Includes shell scheme partitions, fascia nameboard, spotlights, 1 table, 2 chairs, 13A socket, 2 staff badges.',
    active: true
  },
  {
    id: 'executive_18sqm',
    name: 'Executive Double Stand (18sqm - 6x3m)',
    priceNGN: 700000,
    priceFormatted: '₦700,000',
    badges: 3,
    commissionRate: 0.10,
    desc: 'Double corner/linear stand, premium fascia, 4 spotlights, 2 tables, 4 chairs, dual sockets, 3 staff badges.',
    active: true
  },
  {
    id: 'island_36sqm',
    name: 'Prime Island Pavilion (36sqm - 6x6m)',
    priceNGN: 1500000,
    priceFormatted: '₦1,500,000',
    badges: 4,
    commissionRate: 0.10,
    desc: '4-side open prime central pavilion, custom truss rig, VIP lounge access, 4 staff badges.',
    active: true
  },
  {
    id: 'custom_stand',
    name: 'Custom Space Allocation (Direct Inquire)',
    priceNGN: 350000,
    priceFormatted: 'Custom / Bespoke Space',
    badges: 4,
    commissionRate: 0.10,
    desc: 'Tailored floor layout and square meter allocation as agreed with Secretariat.',
    active: true
  }
];

export const SPONSORS: Sponsor[] = [
  {
    name: "Dangote Cement & Infrastructure",
    category: "headline",
    tierType: "sponsor",
    logoPlaceholder: "DANGOTE",
    logoUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=300&auto=format&fit=crop&q=80",
    tagline: "Building Africa's Future with High-Performance Cement & Steel",
    industry: "Heavy Construction Materials",
    country: "Nigeria"
  },
  {
    name: "Julius Berger Nigeria Plc",
    category: "headline",
    tierType: "sponsor",
    logoPlaceholder: "JULIUS BERGER",
    logoUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=300&auto=format&fit=crop&q=80",
    tagline: "Engineering Excellence & Infrastructure Landmark Construction",
    industry: "Engineering & Civil Construction",
    country: "Nigeria / Germany"
  },
  {
    name: "BUA Estate & Cement",
    category: "platinum",
    tierType: "sponsor",
    logoPlaceholder: "BUA GROUP",
    logoUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&auto=format&fit=crop&q=80",
    tagline: "Pioneering Sustainable Urban Development & Manufacturing",
    industry: "Real Estate & Manufacturing",
    country: "Nigeria"
  },
  {
    name: "Access Bank Real Estate Advisory",
    category: "platinum",
    tierType: "sponsor",
    logoPlaceholder: "ACCESS BANK",
    logoUrl: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=300&auto=format&fit=crop&q=80",
    tagline: "Innovative Mortgage Financing, REITs & Development Capital",
    industry: "Banking & Infrastructure Finance",
    country: "Nigeria / Pan-Africa"
  },
  {
    name: "Stanbic IBTC Infrastructure Fund",
    category: "platinum",
    tierType: "sponsor",
    logoPlaceholder: "STANBIC IBTC",
    logoUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&auto=format&fit=crop&q=80",
    tagline: "Unlocking Long-Term Institutional Capital for Mega Assets",
    industry: "Wealth & Asset Management",
    country: "Nigeria"
  },
  {
    name: "Mixta Africa",
    category: "gold",
    tierType: "sponsor",
    logoPlaceholder: "MIXTA AFRICA",
    logoUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&auto=format&fit=crop&q=80",
    tagline: "Master-Planned Luxury Communities & Modern Living",
    industry: "Real Estate Development",
    country: "Pan-Africa"
  },
  {
    name: "Brain & Hammers Real Estate",
    category: "gold",
    tierType: "sponsor",
    logoPlaceholder: "BRAIN & HAMMERS",
    logoUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&auto=format&fit=crop&q=80",
    tagline: "Architectural Elegance & High-Yield Residential Gated Estates",
    industry: "Luxury Housing",
    country: "Nigeria"
  },
  {
    name: "Schneider Electric West Africa",
    category: "tech",
    tierType: "partner",
    logoPlaceholder: "SCHNEIDER",
    logoUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&auto=format&fit=crop&q=80",
    tagline: "AI Smart Home Automation, Microgrids & Energy Efficiency",
    industry: "Smart Building Energy",
    country: "Global"
  },
  {
    name: "Federal Ministry of Housing & Urban Dev.",
    category: "institutional",
    tierType: "partner",
    logoPlaceholder: "FEDERAL HOUSING",
    logoUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=300&auto=format&fit=crop&q=80",
    tagline: "Official Endorsement & National Renewed Hope Housing Agenda",
    industry: "Government & Policy",
    country: "Nigeria"
  },
  {
    name: "Nigerian Institute of Architects (NIA)",
    category: "institutional",
    tierType: "partner",
    logoPlaceholder: "NIA ABUJA",
    logoUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&auto=format&fit=crop&q=80",
    tagline: "Promoting Architectural Standards, Innovation & Heritage",
    industry: "Professional Body",
    country: "Nigeria"
  },
  {
    name: "Real Estate Developers Assoc. of Nigeria (REDAN)",
    category: "institutional",
    tierType: "partner",
    logoPlaceholder: "REDAN",
    logoUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&auto=format&fit=crop&q=80",
    tagline: "The Apex Body for Organized Real Estate Developers in Nigeria",
    industry: "Industry Association",
    country: "Nigeria"
  },
  {
    name: "Nigerian Society of Engineers (NSE)",
    category: "institutional",
    tierType: "partner",
    logoPlaceholder: "NSE",
    logoUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&auto=format&fit=crop&q=80",
    tagline: "Advancing Engineering Standards & Structural Safety",
    industry: "Engineering Council",
    country: "Nigeria"
  }
];

export const SECTORS_COVERED = [
  {
    title: "Real Estate Investors & REITs",
    desc: "Connecting institutional wealth, private family offices, and diaspora syndicates with high-yield commercial and residential assets.",
    icon: "TrendingUp"
  },
  {
    title: "Developers & Construction Giants",
    desc: "Showcasing transformative residential towers, commercial plazas, master-planned smart communities, and mixed-use developments.",
    icon: "Building"
  },
  {
    title: "PropTech & AI Innovators",
    desc: "Pioneering geospatial valuation, digital twin project management, smart contract escrows, and IoT energy-saving automation.",
    icon: "Cpu"
  },
  {
    title: "Government & Regulatory Bodies",
    desc: "Facilitating direct dialogues on Abuja Master Plan compliance, title digitization, tax incentives, and public-private partnerships.",
    icon: "Landmark"
  },
  {
    title: "Financial Institutions & Mortgages",
    desc: "Unlocking structured project finance, commercial construction loans, off-plan guarantees, and flexible single-digit mortgage products.",
    icon: "Banknote"
  },
  {
    title: "Architects, Engineers & Surveyors",
    desc: "Presenting sustainable climate-smart designs, zero-carbon modular materials, 3D concrete printing, and BIM engineering workflows.",
    icon: "Compass"
  }
];

export const FAQ_ITEMS = [
  {
    q: "When and where is RECON Expo 2026 taking place?",
    a: "The 8th Real Estate & Construction Expo 2026 takes place from Thursday, 29th October to Friday, 30th October 2026 at the prestigious Shehu Musa Yar'Adua Centre, Memorial Drive, Central Business District, Abuja, Nigeria. Daily sessions run from 10:00 AM to 6:00 PM WAT."
  },
  {
    q: "Who should attend the Expo?",
    a: "The expo is designed for real estate investors, property buyers, civil engineers, architects, building contractors, PropTech founders, mortgage bankers, land surveyors, government officials, and entrepreneurs seeking strategic high-yield partnerships in Nigeria's booming real sector."
  },
  {
    q: "How can my company book an exhibition booth?",
    a: "You can click 'Become an Exhibitor' in our Registration section or contact our Exhibition Secretariat directly at exhibitors@afrinetgroup.com or +234 803 982 7711. Booth allocations are made on a first-come, first-served basis with prime entrance island spaces filling rapidly."
  },
  {
    q: "Are there hotel discounts for interstate and international delegates?",
    a: "Yes! RECON Expo 2026 has partnered with premier 5-star hotels in Abuja's Central Business District (including Transcorp Hilton Abuja and Fraser Suites) offering up to 35% exclusive delegate discounts. Details and promo codes are sent immediately upon registration confirmation."
  },
  {
    q: "Will there be opportunities for 1-on-1 investor meetings and deal closures?",
    a: "Absolutely. We provide dedicated VIP B2B Deal Rooms with pre-scheduled matchmaking sessions between property developers, private equity funds, diaspora investment syndicates, and sovereign wealth representatives throughout Days 1 and 2."
  }
];
