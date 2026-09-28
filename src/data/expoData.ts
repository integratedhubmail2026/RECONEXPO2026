import { Speaker, ScheduleItem, Sponsor, TicketTier, ExhibitionBooth, FaqItem, SiteContent } from '../types';

export const DEFAULT_SITE_CONTENT: SiteContent = {
  eventTitle: 'RECON Expo 2026',
  eventEdition: '8th Real Estate & Construction Expo',
  eventDates: 'October 29 – 30, 2026',
  eventVenue: 'Shehu Musa Yar\'Adua Centre',
  eventVenueAddress: 'One Memorial Drive, Central Business District, Abuja, Nigeria',
  heroHeadline: 'Shaping the Future of African Real Estate, Urban Cities & Infrastructure',
  heroSubheadline: 'West Africa\'s largest gathering of 8,500+ architects, developers, sovereign funds, policy makers, and top tier construction brands.',
  expectedAttendeesCount: '8,500+',
  exhibitingCompaniesCount: '150+',
  speakersCount: '45+',
  countriesCount: '24+',
  visitorPriceNgn: 0,
  vipPriceNgn: 25000,
  exhibitorPriceNgn: 350000,
  contactEmail: 'reconexpo@afrinetgroup.com',
  contactPhone: '+234 803 555 7890',
  whatsappNumber: '+2348035557890'
};

export const TICKET_TIERS: TicketTier[] = [
  {
    id: 'visitor',
    name: 'Standard Trade Visitor Pass',
    priceNgn: 0,
    priceUsd: 0,
    badgeTag: 'VISITOR',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    description: 'Complimentary access for trade visitors, construction professionals, and real estate buyers.',
    features: [
      'Access to Exhibition Halls A & B across both days',
      'Free Entry to 150+ Manufacturer Booths & Demos',
      'Digital Conference Badge & QR Entry Code',
      'Access to Public Keynote Sessions',
      'Event Guidebook & Exhibitor Directory App'
    ],
    accessAreas: ['Exhibition Hall A', 'Innovation Pavilion', 'Public Plenary']
  },
  {
    id: 'elite',
    name: 'Elite VIP Delegate Pass',
    priceNgn: 25000,
    priceUsd: 30,
    badgeTag: 'ELITE VIP',
    badgeColor: 'border-amber-400/60 text-amber-300 bg-amber-400/15',
    highlighted: true,
    description: 'Premier executive pass for corporate leaders, developers, investors, and government dignitaries.',
    features: [
      'All Trade Visitor privileges + Fast-track VIP Gate Access',
      'Reserved Front-Row Seating at all Ministerial Plenaries',
      'Access to Executive VIP Networking Lounge & Luncheons',
      'Direct Matchmaking with Sovereign Real Estate Funds & Banks',
      'Exclusive Investor Deal-Room & Private Roundtable Access',
      'Certificate of Attendance (CPD Points for NIA, NSE, COREN)',
      'Official Hardcover Expo Yearbook & Delegate Gift Bag'
    ],
    accessAreas: ['Exhibition Halls', 'VIP Lounge', 'Ministerial Plenary', 'Deal Room', 'Executive Luncheon']
  },
  {
    id: 'exhibitor',
    name: 'Official Exhibitor & Booth Pass',
    priceNgn: 350000,
    priceUsd: 380,
    badgeTag: 'EXHIBITOR',
    badgeColor: 'border-purple-400/60 text-purple-300 bg-purple-400/15',
    description: 'Complete 3x3m Shell Scheme Exhibition Booth + 5 All-Access Company Staff Badges.',
    features: [
      'Standard 3m x 3m Shell Scheme Booth in Main Hall',
      '5 All-Access Staff Badges with Badge Management Portal',
      'Spotlight Profile on Official Website & Mobile Directory',
      'Company Logo on Event Giant Screens & Stage Backdrops',
      'Lead Capture QR Scanner Tool for all Staff Badges',
      'Invitation to High-Level Ministerial Opening Cocktail',
      'Dedicated Social Media Feature Across All RECON Channels'
    ],
    accessAreas: ['All Halls', 'VIP Lounge', 'Exhibitor Arena', 'Press Zone', 'B2B Suites']
  }
];

export const SPEAKERS: Speaker[] = [
  {
    id: 'spk_1',
    name: 'Arc. Ahmed Dangiwa',
    title: 'Honourable Minister',
    company: 'Federal Ministry of Housing and Urban Development',
    bio: 'Championing national housing reforms, green building codes, and affordable mass housing initiatives across Nigeria.',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    category: 'Government',
    sessions: ['Opening Keynote: Nigeria Housing Renaissance 2030'],
    featured: true
  },
  {
    id: 'spk_2',
    name: 'Alhaji Aliko Dangote GCON',
    title: 'President & CEO',
    company: 'Dangote Industries Ltd',
    bio: 'Pioneering infrastructure industrialization, sustainable cement technology, and heavy manufacturing across the continent.',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    category: 'Keynote',
    sessions: ['Industrial Scale Infrastructure & Local Raw Material Sovereignty'],
    featured: true
  },
  {
    id: 'spk_3',
    name: 'Engr. Folasade Aina FNSE',
    title: 'Chief Technical Officer',
    company: 'West Africa InfraTech Partners',
    bio: 'Specialist in smart city sensor integration, IoT urban mobility, and earthquake-resilient structural foundations.',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    category: 'PropTech',
    sessions: ['Smart City Infrastructure: Integrating IoT and AI in Capital Cities'],
    featured: true
  },
  {
    id: 'spk_4',
    name: 'Dr. Chuka Ezeamama',
    title: 'Managing Director & Head of Real Estate',
    company: 'Africa Development Bank Real Assets Fund',
    bio: 'Managing over $1.8B in multi-asset class urban developments and social housing securitization programs.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    category: 'Finance',
    sessions: ['Financing Real Estate Megaprojects: Sovereign Wealth & Diaspora Bonds'],
    featured: true
  },
  {
    id: 'spk_5',
    name: 'Arc. Olubunmi Fashola',
    title: 'Principal Lead Architect',
    company: 'Studio Verde Abuja',
    bio: 'Award-winning proponent of climate-adaptive architecture, rammed-earth luxury residences, and net-zero carbon complexes.',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    category: 'Architecture',
    sessions: ['Climate Adaptive Architecture: Building for 45°C Sahel Realities'],
    featured: false
  },
  {
    id: 'spk_6',
    name: 'Dr. Michael Adeyemi',
    title: 'Co-Founder & CEO',
    company: 'PropEase Nigeria',
    bio: 'Digitizing land title verification, blockchain escrow payments, and automated mortgage underwriting in West Africa.',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    category: 'PropTech',
    sessions: ['Blockchain Land Registry: Ending Title Fraud in Real Estate Transactions'],
    featured: false
  }
];

export const SCHEDULE: ScheduleItem[] = [
  // Day 1
  {
    id: 'sch_1',
    day: 1,
    time: '08:00 AM - 09:30 AM',
    title: 'VIP & Delegate Registration, Accreditation & Networking Breakfast',
    description: 'Collection of smart RFID badges, VIP security screening, welcome coffee in the Yar\'Adua Centre foyer.',
    location: 'Main Foyer & Executive VIP Lounge',
    track: 'Plenary',
    speakerIds: []
  },
  {
    id: 'sch_2',
    day: 1,
    time: '09:30 AM - 10:45 AM',
    title: 'Grand Ministerial Opening Ceremony & National Anthem',
    description: 'Official opening remarks by the Minister of Housing, Presidential Special Adviser, and REDAN National President.',
    location: 'Main Auditorium (Hall A)',
    track: 'Plenary',
    speakerIds: ['spk_1', 'spk_2']
  },
  {
    id: 'sch_3',
    day: 1,
    time: '11:00 AM - 12:30 PM',
    title: 'Plenary Session 1: Unleashing $200B in African Urban Infrastructure',
    description: 'Institutional panel on closing the housing deficit, sovereign guarantees, and public-private partnerships.',
    location: 'Main Auditorium (Hall A)',
    track: 'Investment',
    speakerIds: ['spk_1', 'spk_4']
  },
  {
    id: 'sch_4',
    day: 1,
    time: '01:00 PM - 02:30 PM',
    title: 'Official Exhibition Tour, Ribbon Cutting & Networking Luncheon',
    description: 'Dignitary tour of 150+ technology and building material booths followed by an exclusive 5-course VIP luncheon.',
    location: 'Exhibition Hall A & B + Outdoor Pavilion',
    track: 'Plenary',
    speakerIds: ['spk_2']
  },
  {
    id: 'sch_5',
    day: 1,
    time: '02:45 PM - 04:15 PM',
    title: 'PropTech Summit: AI, Smart Pre-fabrication & Digital Construction',
    description: 'Deep dive into 3D concrete printing, drone site surveys, BIM automation, and blockchain title deeds.',
    location: 'Hall B - Innovation Pavilion',
    track: 'PropTech',
    speakerIds: ['spk_3', 'spk_6']
  },
  {
    id: 'sch_6',
    day: 1,
    time: '04:30 PM - 06:00 PM',
    title: 'High-Level Bilateral Deal-Room & Private Capital Matchmaking',
    description: 'Closed-door meetings connecting tier-1 real estate developers with sovereign wealth and diaspora funds.',
    location: 'Executive Boardroom 3',
    track: 'Investment',
    speakerIds: ['spk_4']
  },

  // Day 2
  {
    id: 'sch_7',
    day: 2,
    time: '09:00 AM - 10:30 AM',
    title: 'Green Building & Climate-Resilient Urbanism in Sahel Realities',
    description: 'Evaluating EDGE green building certifications, solar microgrids for gated estates, and passive cooling.',
    location: 'Main Auditorium (Hall A)',
    track: 'Green Infrastructure',
    speakerIds: ['spk_5', 'spk_3']
  },
  {
    id: 'sch_8',
    day: 2,
    time: '11:00 AM - 12:45 PM',
    title: 'Real Estate Developer Masterclass: Navigating Inflation, FX & Cost Optimization',
    description: 'Practical financial modeling, alternative local materials, hedging against FX volatility in mega-projects.',
    location: 'Hall B - Masterclass Suite',
    track: 'Masterclass',
    speakerIds: ['spk_4', 'spk_2']
  },
  {
    id: 'sch_9',
    day: 2,
    time: '02:00 PM - 03:30 PM',
    title: 'The Future of Abuja Masterplan: Satellite Towns & Transit-Oriented Real Estate',
    description: 'Federal Capital Development Authority (FCDA) urban planning chiefs unveil new investment corridors.',
    location: 'Main Auditorium (Hall A)',
    track: 'Plenary',
    speakerIds: ['spk_1', 'spk_5']
  },
  {
    id: 'sch_10',
    day: 2,
    time: '04:00 PM - 06:00 PM',
    title: 'RECON 2026 Excellence Awards Gala & Closing Cocktail',
    description: 'Honouring Nigeria\'s top real estate developers, sustainable construction innovations, and visionary architects.',
    location: 'Grand Ballroom & Yar\'Adua Gardens',
    track: 'Plenary',
    speakerIds: ['spk_1', 'spk_2', 'spk_4']
  }
];

export const SPONSORS: Sponsor[] = [
  {
    id: 'spon_1',
    name: 'Dangote Cement Plc',
    category: 'Titanium Headline',
    logoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?auto=format&fit=crop&w=300&q=80',
    website: 'https://dangote.com',
    boothNumber: 'Booth A-01 (Auditorium Front)',
    description: 'Africa\'s leading cement manufacturer producing high-strength, eco-friendly 42.5R Falcon and 32.5 grade cement.'
  },
  {
    id: 'spon_2',
    name: 'BUA Cement & Infrastructure',
    category: 'Platinum Partner',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80',
    website: 'https://buagroup.com',
    boothNumber: 'Booth A-02',
    description: 'Major industrial conglomerate driving modern housing technologies and national logistics hubs.'
  },
  {
    id: 'spon_3',
    name: 'Federal Ministry of Housing',
    category: 'Platinum Partner',
    logoUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=300&q=80',
    website: 'https://housingandurban.gov.ng',
    boothNumber: 'Booth A-05 (Government Pavilion)',
    description: 'Leading national policies, mortgage bank recapitalizations, and the Renewed Hope Cities programme.'
  },
  {
    id: 'spon_4',
    name: 'Real Estate Developers Association of Nigeria (REDAN)',
    category: 'Gold Sponsor',
    logoUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80',
    website: 'https://redanonline.org.ng',
    boothNumber: 'Booth B-10',
    description: 'The principal organized private sector body for real estate development throughout Nigeria.'
  },
  {
    id: 'spon_5',
    name: 'Shelter Afrique Development Bank',
    category: 'Gold Sponsor',
    logoUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=300&q=80',
    website: 'https://shelterafrique.org',
    boothNumber: 'Booth B-14',
    description: 'Pan-African housing development finance institution supporting affordable housing projects across 44 member countries.'
  },
  {
    id: 'spon_6',
    name: 'Nigerian Institute of Architects (NIA)',
    category: 'Silver Sponsor',
    logoUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=300&q=80',
    website: 'https://nia.ng',
    boothNumber: 'Booth B-22',
    description: 'The professional body of architects in Nigeria advancing architectural education and excellence.'
  }
];

export const BOOTHS: ExhibitionBooth[] = [
  { id: 'A-01', name: 'Dangote Mega Pavilion', hall: 'Hall A - Main Auditorium', size: '6m x 6m', priceNgn: 1200000, status: 'occupied', exhibitorName: 'Dangote Industries', category: 'Heavy Materials' },
  { id: 'A-02', name: 'BUA Industrial Stand', hall: 'Hall A - Main Auditorium', size: '6m x 6m', priceNgn: 1200000, status: 'occupied', exhibitorName: 'BUA Group', category: 'Cement & Construction' },
  { id: 'A-03', name: 'Prime PropTech Hub', hall: 'Hall A - Main Auditorium', size: '3m x 3m', priceNgn: 350000, status: 'available', category: 'PropTech' },
  { id: 'A-04', name: 'Cosgrove Smart Estates', hall: 'Hall A - Main Auditorium', size: '3m x 3m', priceNgn: 350000, status: 'occupied', exhibitorName: 'Cosgrove Investment Ltd', category: 'Luxury Real Estate' },
  { id: 'A-05', name: 'Federal Housing Pavilion', hall: 'Hall A - Main Auditorium', size: '6m x 3m', priceNgn: 700000, status: 'occupied', exhibitorName: 'FMHUD Govt Pavilion', category: 'Government Agency' },
  { id: 'A-06', name: 'Abuja Luxury Homes Stand', hall: 'Hall A - Main Auditorium', size: '3m x 3m', priceNgn: 350000, status: 'available', category: 'Real Estate Developer' },
  { id: 'B-01', name: 'SolarEdge Clean Energy Stand', hall: 'Hall B - Innovation Pavilion', size: '3m x 3m', priceNgn: 350000, status: 'available', category: 'Renewable Power' },
  { id: 'B-02', name: 'Schneider Electric Smart Home', hall: 'Hall B - Innovation Pavilion', size: '3m x 3m', priceNgn: 350000, status: 'reserved', exhibitorName: 'Schneider Electric Nig', category: 'Smart Automation' },
  { id: 'B-03', name: 'AfriSteel Reinforcement Stand', hall: 'Hall B - Innovation Pavilion', size: '3m x 3m', priceNgn: 350000, status: 'available', category: 'Steel & Metals' },
  { id: 'B-04', name: 'Verde Green Architecture', hall: 'Hall B - Innovation Pavilion', size: '3m x 3m', priceNgn: 350000, status: 'available', category: 'Architectural Design' },
  { id: 'OUT-01', name: 'Caterpillar Heavy Machinery Demo', hall: 'Outdoor Plaza', size: '10m x 10m', priceNgn: 2500000, status: 'occupied', exhibitorName: 'Mantrac Nigeria / CAT', category: 'Heavy Equipment' },
  { id: 'OUT-02', name: 'Precast Concrete Field Display', hall: 'Outdoor Plaza', size: '8m x 8m', priceNgn: 1800000, status: 'available', category: 'Prefab & Modular' }
];

export const FAQS: FaqItem[] = [
  {
    id: 'faq_1',
    category: 'General',
    question: 'When and where is RECON Expo 2026 taking place?',
    answer: 'The 8th Real Estate & Construction Expo takes place on October 29th and 30th, 2026, at the Shehu Musa Yar\'Adua Centre, One Memorial Drive, Central Business District, Abuja, Nigeria. Doors open daily at 8:00 AM.'
  },
  {
    id: 'faq_2',
    category: 'Registration & Passes',
    question: 'Is Trade Visitor entry really free of charge?',
    answer: 'Yes! Standard Trade Visitor registration is 100% free of charge and gives you complete access to both Exhibition Halls, over 150 manufacturer displays, and open plenary sessions. Prior online registration is mandatory for badge generation.'
  },
  {
    id: 'faq_3',
    category: 'Registration & Passes',
    question: 'What are the benefits of the Elite VIP Pass (₦25,000)?',
    answer: 'Elite VIP delegates receive fast-track gate entry, reserved front-row seating at ministerial plenaries, complimentary executive luncheon, access to the VIP Deal-Room for direct financing matchmaking, hardcover conference guide, and an accredited Certificate of Attendance with CPD points.'
  },
  {
    id: 'faq_4',
    category: 'Exhibition & Booths',
    question: 'How can our company book an exhibition booth?',
    answer: 'You can book directly via the Official Exhibitor tier (₦350,000 for a standard 3x3m shell scheme) which includes 5 all-access staff badges, booth branding, and lead capture tools, or contact our secretariat at reconexpo@afrinetgroup.com / +234 803 555 7890.'
  },
  {
    id: 'faq_5',
    category: 'Registration & Passes',
    question: 'How do I receive my digital pass and entry QR code?',
    answer: 'Immediately upon completing registration, your high-resolution digital Smart ID Badge is generated with a unique encrypted QR code. You can download it as PNG or save it on your mobile device. An automated confirmation email with your digital badge will also be delivered to your inbox.'
  },
  {
    id: 'faq_6',
    category: 'Venue & Logistics',
    question: 'Is parking and security provided at Yar\'Adua Centre?',
    answer: 'Yes, Shehu Musa Yar\'Adua Centre features secure fenced multi-level parking with round-the-clock paramilitary and private security personnel. VIP delegates have access to the reserved executive VIP parking courtyard.'
  }
];
