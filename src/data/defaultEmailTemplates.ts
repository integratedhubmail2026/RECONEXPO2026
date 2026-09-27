import { EmailTemplate, EmailAutomationSequence } from '../types/marketing';

export const DEFAULT_EMAIL_TEMPLATES: EmailTemplate[] = [
  // 1. VIP Welcome & QR Digital Pass
  {
    id: 'tmpl-vip-welcome',
    name: '🎟️ VIP Official Digital Pass & Welcome Pack',
    category: 'onboarding',
    categoryLabel: 'Onboarding & Passes',
    subject: '🎟️ Your Official RECON Expo 2026 Digital Pass & VIP Registration',
    preheader: 'Present this digital badge at the fast-track VIP entrance at Yar\'Adua Centre, Abuja.',
    description: 'Sent immediately upon registration or VIP clearance with barcode, pass credentials, and event entry logistics.',
    thumbnailIcon: 'QrCode',
    badge: 'AUTOMATION #1',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON EXPO ABUJA 2026',
        subtitle: '8th Real Estate & Construction Expo • Oct 29–31, 2026',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'Registration Confirmed & Verified',
        subtitle: 'Welcome to West Africa’s premier real estate, construction, and infrastructure summit.',
        content: 'Dear {name},\n\nWe are delighted to confirm your registration for the 8th Annual Real Estate & Construction Expo (RECON 2026) in Abuja, Nigeria.\n\nYour official digital pass has been provisioned and is linked to ticket number #{ticket}. Please keep this email accessible on your smartphone for instant contact-free check-in at the security gate.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'qr_badge',
        title: 'OFFICIAL ACCESS CREDENTIALS',
        subtitle: 'Fast-Track Entry Gate Badge',
        content: 'Delegate: {name}\nCategory: {category}\nOrganization: {company}\nTicket: #{ticket}\nVenue: Shehu Musa Yar\'Adua Centre, Abuja',
        bgColor: '#0d382d',
        textColor: '#ffffff'
      },
      {
        id: 'b4',
        type: 'button',
        buttonText: '📥 Download Digital PDF Pass',
        buttonUrl: 'https://www.afrinetgroup.com/portal',
        align: 'center',
        bgColor: '#d4af37',
        textColor: '#012a20'
      },
      {
        id: 'b5',
        type: 'schedule_box',
        title: 'QUICK EVENT SUMMARY',
        items: [
          { title: '📅 Dates', description: 'October 29 – 31, 2026 (09:00 AM – 06:00 PM Daily)' },
          { title: '📍 Venue', description: 'Shehu Musa Yar\'Adua Centre, Memorial Drive, CBD, Abuja' },
          { title: '👔 Dress Code', description: 'Business Formal / Executive Corporate' },
          { title: '🚗 Parking', description: 'Free designated delegate parking inside the Yar\'Adua compound' }
        ]
      },
      {
        id: 'b6',
        type: 'footer'
      }
    ]
  },

  // 2. Exhibitor Stand Confirmation & Manual
  {
    id: 'tmpl-exhibitor-stand',
    name: '🏢 Exhibitor Stand Confirmation & Setup Manual',
    category: 'exhibitors',
    categoryLabel: 'Exhibitors',
    subject: '🏢 RECON 2026: Official Booth Stand Confirmation & Exhibitor Portal',
    preheader: 'Access your exhibition booth allocations, setup guidelines, and power requirements.',
    description: 'Comprehensive onboarding guide for booked exhibition booths, load-in dates, and vendor passes.',
    thumbnailIcon: 'Building',
    badge: 'EXHIBITOR',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON EXPO 2026 • EXHIBITOR SECRETARIAT',
        subtitle: 'Booth Stand Reservation & Technical Guidelines',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'Booth #{booth} Reserved For {company}',
        subtitle: 'Stand Package: {package_name} • Exhibition Hall A & B',
        content: 'Dear {name},\n\nThank you for choosing RECON Expo 2026 to showcase your innovative real estate projects, building materials, and construction technology.\n\nYour exhibition stand space is confirmed. Our logistics committee has assigned your stand coordinates in the main pavilion.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'features_2col',
        title: 'EXHIBITOR PREPARATION TIMELINE',
        items: [
          { title: '🛠️ Stand Build & Setup', description: 'October 28, 2026: 08:00 AM – 10:00 PM (Pre-Event Load-in)' },
          { title: '⚡ Power & AV Delivery', description: 'Standard 220V 13A socket, spotlights, and fascia nameboard included' },
          { title: '👥 Staff Badges', description: 'Register up to 4 on-stand booth representatives via the Exhibitor Portal' },
          { title: '📦 Heavy Freight Deliveries', description: 'Freight handling dock opens October 27 at 12:00 PM' }
        ]
      },
      {
        id: 'b4',
        type: 'button',
        buttonText: 'Manage Exhibitor Portal & Badges',
        buttonUrl: 'https://www.afrinetgroup.com/exhibitors',
        align: 'center',
        bgColor: '#d4af37',
        textColor: '#012a20'
      },
      {
        id: 'b5',
        type: 'footer'
      }
    ]
  },

  // 3. Keynote Speaker Announcement
  {
    id: 'tmpl-keynote-speakers',
    name: '📢 Keynote Speakers & Executive Faculty Unveiling',
    category: 'announcements',
    categoryLabel: 'Announcements',
    subject: '📢 Keynote Lineup Announced: Ministers, Developers & Industry Titans at RECON 2026',
    preheader: 'Hear from the Honourable Minister of Housing, Federal Mortgage Bank executives, and top property developers.',
    description: 'Highlighting high-profile speakers, government leaders, and international investors attending the summit.',
    thumbnailIcon: 'Mic',
    badge: 'FEATURED',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON 2026 • KEYNOTE FACULTY',
        subtitle: 'Thought Leadership in Housing, Construction & Infrastructure',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'Distinguished Speakers & Thought Leaders',
        subtitle: 'Shaping the Future of Nigeria’s $2.5T Built Environment',
        content: 'Dear {name},\n\nWe are proud to unveil the stellar lineup of keynote speakers, policy drivers, and top real estate executives headlining RECON Expo 2026.\n\nFrom national mortgage reforms to sustainable green cities and PropTech breakthroughs, our 20+ panel sessions will deliver actionable intelligence for your business.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'speaker_grid',
        title: 'HEADLINE KEYNOTE SPEAKERS',
        items: [
          { title: 'Hon. Arc. Ahmed Musa Dangiwa', description: 'Honourable Minister of Housing and Urban Development, Federal Republic of Nigeria', tag: 'Policy Keynote' },
          { title: 'Shehu Usman Osidi', description: 'Managing Director / CEO, Federal Mortgage Bank of Nigeria (FMBN)', tag: 'Mortgage & Finance' },
          { title: 'Dr. Bamidele Onalaja', description: 'President, Real Estate Developers Association of Nigeria (REDAN)', tag: 'Industry Outlook' },
          { title: 'Engr. Titi Omo-Ettu', description: 'President, Council for the Regulation of Engineering in Nigeria (COREN)', tag: 'Engineering Standards' }
        ]
      },
      {
        id: 'b4',
        type: 'button',
        buttonText: 'View Full Speaker Lineup & Sessions',
        buttonUrl: 'https://www.afrinetgroup.com/speakers',
        align: 'center',
        bgColor: '#d4af37',
        textColor: '#012a20'
      },
      {
        id: 'b5',
        type: 'footer'
      }
    ]
  },

  // 4. 3-Day Programme Schedule Breakdown
  {
    id: 'tmpl-programme-schedule',
    name: '📅 3-Day Master Schedule & Daily Agenda',
    category: 'schedule',
    categoryLabel: 'Schedule & Logistics',
    subject: '📅 Official Programme Agenda: 3 Days of High-Impact Sessions at RECON 2026',
    preheader: 'Plan your schedule across 3 halls, technical masterclasses, and executive B2B lounges.',
    description: 'Detailed breakdown of day-by-day sessions, tea breaks, VIP lunches, and panel timings.',
    thumbnailIcon: 'Calendar',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'OFFICIAL SUMMIT PROGRAMME',
        subtitle: 'October 29 – 31, 2026 • Yar\'Adua Centre, Abuja',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'Maximize Your RECON 2026 Experience',
        subtitle: 'Curated 3-Day Master Itinerary for Leaders and Delegates',
        content: 'Dear {name},\n\nTo ensure you don’t miss the sessions most critical to your organization, here is the day-by-day outline for RECON Expo 2026:',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'schedule_box',
        title: 'SUMMIT SCHEDULE BREAKDOWN',
        items: [
          { 
            title: 'DAY 1 (Thursday, Oct 29) • Plenary & Infrastructure Forum', 
            description: '08:30 AM – Delegate Accreditation & Fast-Track Badge Collection\n09:30 AM – Ribbon Cutting Ceremony & Ministerial Exhibition Tour\n10:30 AM – Executive Opening Plenary: National Housing Policy Reform\n12:30 PM – Networking Tea Break & B2B Exhibition Floor Opening\n02:00 PM – Housing Deficit Plenary: Mortgages, Financing & Diaspora Capital\n04:00 PM – Panel Debate: PPPs in Affordable Real Estate Development\n05:30 PM – Day 1 Closing Remarks & Evening Reception' 
          },
          { 
            title: 'DAY 2 (Friday, Oct 30) • PropTech & Green Construction', 
            description: '09:00 AM – Doors Open & Morning Exhibitor Matchmaking\n09:30 AM – Plenary: Carbon-Neutral Building & Green Materials\n11:00 AM – PropTech Panel: AI, Smart Cities & Land Digitization\n01:00 PM – VIP Networking Luncheon & Investment Deal Signing\n02:30 PM – Technical Workshop: BIM, Revit & Prefabricated Engineering\n04:00 PM – Panel: Real Estate Crowdfunding & Blockchain Titles\n05:30 PM – Day 2 Closing & VIP Wine Tasting Lounge' 
          },
          { 
            title: 'DAY 3 (Saturday, Oct 31) • Capital Deals, Demos & Gala Night', 
            description: '09:30 AM – CPD Professional Masterclass: NIA, NSE Accreditations\n11:00 AM – Live Heavy Machinery Demonstration & Auctions\n01:00 PM – B2B Matchmaking Pitch Session & Venture Funding Rounds\n03:00 PM – Closing General Assembly & Resolutions Communiqué\n07:30 PM – Red-Carpet Awards Gala Dinner & Leadership Ceremony' 
          }
        ]
      },
      {
        id: 'b4',
        type: 'button',
        buttonText: 'Add Schedule to Google / Apple Calendar',
        buttonUrl: 'https://www.afrinetgroup.com/programme',
        align: 'center',
        bgColor: '#d4af37',
        textColor: '#012a20'
      },
      {
        id: 'b5',
        type: 'footer'
      }
    ]
  },

  // 5. B2B Matchmaking & Deal-Making Invite
  {
    id: 'tmpl-b2b-matchmaking',
    name: '🤝 B2B Matchmaking & Private Deal Room Access',
    category: 'announcements',
    categoryLabel: 'Networking',
    subject: '🤝 Book 1-on-1 Executive B2B Meetings with Investors & Developers at RECON 2026',
    preheader: 'Access the VIP Matchmaking Lounge to close high-ticket real estate and procurement deals.',
    description: 'Invitation to pre-book 15-minute 1-on-1 meetings with institutional investors, government buyers, and contractors.',
    thumbnailIcon: 'Users',
    badge: 'NETWORKING',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON 2026 B2B MATCHMAKING PORTAL',
        subtitle: 'Direct Deal-Making & Strategic Partnerships',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'Connect with Key Decision Makers',
        subtitle: 'Pre-schedule Private 1-on-1 Executive Meetings',
        content: 'Dear {name},\n\nRECON Expo is more than an exhibition — it is where Nigeria’s largest construction contracts, development syndications, and property acquisitions are sealed.\n\nAs a registered delegate #{ticket}, your profile is enabled for our private B2B Matchmaking Concierge. You can pre-book dedicated 15-minute slots in the Executive Deal Lounge with over 80 verified developers, fund managers, and government procurement directors.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'features_2col',
        title: 'WHO YOU CAN MEET IN THE DEAL ROOM',
        items: [
          { title: '🏦 Institutional Financiers', description: 'Private equity partners, commercial banks, and diaspora mortgage lenders.' },
          { title: '🏗️ Tier-1 Contractors', description: 'Civil engineering firms, project managers, and MEP sub-contractors.' },
          { title: '🏛️ Government Agencies', description: 'Federal & State Housing Authorities, FCDA, and Infrastructure Concessionaires.' },
          { title: '📦 Material Manufacturers', description: 'Direct manufacturers of cement, steel, smart home tech, and renewable energy.' }
        ]
      },
      {
        id: 'b4',
        type: 'button',
        buttonText: 'Reserve Your 1-on-1 Meeting Slots Now',
        buttonUrl: 'https://www.afrinetgroup.com/matchmaking',
        align: 'center',
        bgColor: '#d4af37',
        textColor: '#012a20'
      },
      {
        id: 'b5',
        type: 'footer'
      }
    ]
  },

  // 6. Investor Pitch Deck & Sponsor Showcase
  {
    id: 'tmpl-investor-showcase',
    name: '💼 Investor Showcase & Sponsorship Opportunities',
    category: 'sponsors',
    categoryLabel: 'Sponsors & Investors',
    subject: '💼 High-Yield Real Estate Syndications & Sponsorship at RECON 2026',
    preheader: 'Position your brand in front of 10,000+ accredited investors, developers, and corporate buyers.',
    description: 'Pitching corporate sponsorship tiers and private equity deals to qualified high-net-worth delegates.',
    thumbnailIcon: 'DollarSign',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON 2026 CAPITAL & SPONSORSHIP',
        subtitle: 'Unlocking Capital for West Africa Infrastructure',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'Elevate Your Brand to 10,000+ Built Environment Leaders',
        subtitle: 'Headline Sponsorship & Deal Room Syndication',
        content: 'Dear {name},\n\nWith over 10,000 in-person attendees, 150+ exhibiting brands, and nationwide media coverage on NTA, Channels TV, and Arise News, RECON Expo 2026 offers unmatched commercial visibility.\n\nExplore our remaining Platinum, Gold, and Technology Partner packages before sponsorship slots close.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'pricing_table',
        title: 'PREMIUM SPONSORSHIP PACKAGES',
        items: [
          { title: '🥇 Platinum Partner', description: '₦15,000,000 • 36sqm Prime Pavilion • Keynote Plenary • Full Page Manual Ad • 15 VIP Passes', tag: 'Limited' },
          { title: '🥈 Gold Sponsor', description: '₦8,500,000 • 18sqm Stand • Panel Seat • Logo on All Passes • 8 VIP Passes', tag: 'Popular' },
          { title: '🥉 Silver Sponsor', description: '₦4,500,000 • 9sqm Shell Scheme • Half Page Ad • 4 VIP Passes', tag: 'Standard' }
        ]
      },
      {
        id: 'b4',
        type: 'button',
        buttonText: 'Download Official Sponsorship Deck',
        buttonUrl: 'https://www.afrinetgroup.com/sponsorship',
        align: 'center',
        bgColor: '#d4af37',
        textColor: '#012a20'
      },
      {
        id: 'b5',
        type: 'footer'
      }
    ]
  },

  // 7. Construction & Heavy Machinery Showcase
  {
    id: 'tmpl-machinery-showcase',
    name: '🏗️ Heavy Machinery & Construction Tech Pavilion',
    category: 'announcements',
    categoryLabel: 'Exhibition Highlights',
    subject: '🏗️ Live Machinery Demos & Advanced Building Materials at RECON Expo 2026',
    preheader: 'Explore excavators, concrete batching, solar roofing, and pre-fab construction solutions live in Abuja.',
    description: 'Spotlighting construction heavy equipment, civil engineering solutions, and live technology demos.',
    thumbnailIcon: 'Tool',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON 2026 CONSTRUCTION TECH PAVILION',
        subtitle: 'Civil Engineering, Heavy Plant & Modern Building Methods',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'See Next-Gen Building Equipment Live in Action',
        subtitle: 'Outdoor Machinery Demos & Direct Manufacturer Pricing',
        content: 'Dear {name},\n\nThe construction sector is undergoing rapid transformation with automated plant machinery, modular pre-cast concrete, and green steel manufacturing.\n\nAt RECON 2026, over 40 machinery manufacturers from Nigeria, Germany, Turkey, and China will showcase heavy plant equipment with on-site purchase financing options.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'button',
        buttonText: 'Explore Machinery Pavilion Exhibitors',
        buttonUrl: 'https://www.afrinetgroup.com/machinery',
        align: 'center',
        bgColor: '#d4af37',
        textColor: '#012a20'
      },
      {
        id: 'b4',
        type: 'footer'
      }
    ]
  },

  // 8. Luxury Real Estate Project Showcase
  {
    id: 'tmpl-luxury-realestate',
    name: '🏡 Luxury Real Estate & Smart Homes Pavilion',
    category: 'announcements',
    categoryLabel: 'Real Estate Projects',
    subject: '🏡 Exclusive Launch: Luxury Estates, Smart Villas & Off-Plan Opportunities at RECON 2026',
    preheader: 'Browse prime residential & commercial developments in Abuja, Lagos, Port Harcourt, and Kigali.',
    description: 'Promoting premier housing developments, luxury off-plan investments, and developer discount perks.',
    thumbnailIcon: 'Home',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON 2026 REAL ESTATE PAVILION',
        subtitle: 'Luxury Estates, Commercial Hubs & Smart Communities',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'Discover Nigeria’s Most Lucrative Property Investments',
        subtitle: 'Direct Developer Sales • Guaranteed Titles • Flexible Payment Plans',
        content: 'Dear {name},\n\nWhether you are expanding your corporate portfolio, securing a luxury residence in Maitama/Guzape, or seeking 25%+ annual yield commercial developments, the RECON 2026 Real Estate Pavilion brings 60+ verified developers under one roof.\n\nTake advantage of exclusive event-only discounts of up to 15% off standard listing prices.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'button',
        buttonText: 'Preview Featured Housing Projects',
        buttonUrl: 'https://www.afrinetgroup.com/projects',
        align: 'center',
        bgColor: '#d4af37',
        textColor: '#012a20'
      },
      {
        id: 'b4',
        type: 'footer'
      }
    ]
  },

  // 9. Abuja Hotel Discounts & Travel Guide
  {
    id: 'tmpl-hotel-travel',
    name: '🏨 Official Abuja Travel Guide & Hotel Discounts',
    category: 'schedule',
    categoryLabel: 'Logistics & Hospitality',
    subject: '🏨 Exclusive RECON Delegate Hotel Discounts & Abuja Travel Logistics',
    preheader: 'Save up to 35% on Transcorp Hilton, Fraser Suites, and nearby partner hotels in Abuja CBD.',
    description: 'Essential travel information, flight partner discounts, and negotiated hotel accommodation rates.',
    thumbnailIcon: 'MapPin',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON 2026 HOSPITALITY & TRAVEL CONCIERGE',
        subtitle: 'Special Rates for Delegates, Exhibitors & International Visitors',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'Special Accommodation Rates in Abuja CBD',
        subtitle: 'Negotiated Discounts within 5 Minutes of the Yar\'Adua Centre',
        content: 'Dear {name},\n\nTraveling to Abuja for RECON Expo 2026? We have partnered with leading luxury hotels and serviced residences to offer discounted group rates for our delegates.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'features_2col',
        title: 'OFFICIAL HOTEL PARTNERS',
        items: [
          { title: '🏨 Transcorp Hilton Abuja', description: '5-Star Luxury • Maitama (7 mins to venue) • 25% Off with Code: RECON2026' },
          { title: '🏨 Fraser Suites Abuja', description: 'Luxury Serviced Apartments • CBD (3 mins to venue) • 30% Off' },
          { title: '🏨 Bolton White Hotel', description: 'Business Hotel • Area 11, Garki (4 mins to venue) • Special Delegate Rate' },
          { title: '🚗 Airport Shuttle Services', description: 'Direct shuttle buses from Nnamdi Azikiwe Airport (ABV) to official hotels' }
        ]
      },
      {
        id: 'b4',
        type: 'button',
        buttonText: 'Book Partner Hotels with Discount Code',
        buttonUrl: 'https://www.afrinetgroup.com/hotels',
        align: 'center',
        bgColor: '#d4af37',
        textColor: '#012a20'
      },
      {
        id: 'b5',
        type: 'footer'
      }
    ]
  },

  // 10. Early Bird Ticket Expiry Alert
  {
    id: 'tmpl-early-bird-expiry',
    name: '⏰ Early-Bird Ticket Price Increase Alert',
    category: 'promotions',
    categoryLabel: 'Promotions',
    subject: '⏰ Final 48 Hours: Early-Bird Discount Ends for RECON 2026 Passes',
    preheader: 'Prices will increase by 40% this Friday at midnight. Lock in your VIP pass now.',
    description: 'High-urgency conversion email for unconverted registrations and prospects.',
    thumbnailIcon: 'Clock',
    badge: 'URGENT',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON 2026 TICKETING DEADLINE',
        subtitle: 'Early-Bird Rates Expiring Soon',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'Early-Bird Passes Closing in 48 Hours',
        subtitle: 'Lock in Your Savings Before the Standard Rates Take Effect',
        content: 'Dear {name},\n\nThis is a courtesy reminder that Early-Bird registration discounts for the 8th Real Estate & Construction Expo 2026 expire this Friday at 11:59 PM (WAT).\n\nUpgrade to VIP or Corporate Pass now to secure your access to all keynote sessions, the investor lounge, and executive networking dinner.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'button',
        buttonText: 'Secure Your Pass at Early-Bird Rate',
        buttonUrl: 'https://www.afrinetgroup.com/register',
        align: 'center',
        bgColor: '#d4af37',
        textColor: '#012a20'
      },
      {
        id: 'b4',
        type: 'footer'
      }
    ]
  },

  // 11. 48-Hour Countdown & Gate Fast-Track Pass
  {
    id: 'tmpl-48h-countdown',
    name: '🚨 48-Hour Final Countdown & Gate Check-in',
    category: 'schedule',
    categoryLabel: 'Event Countdown',
    subject: '🚨 48 Hours to RECON Expo 2026: Fast-Track Gate Access & Final Checklist',
    preheader: 'Everything you need for Day 1: Entrance gates, parking, badges, and keynote times.',
    description: 'Crucial logistical briefing sent 2 days prior to event kickoff.',
    thumbnailIcon: 'Zap',
    badge: 'COUNTDOWN',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON 2026 • FINAL 48-HOUR BRIEFING',
        subtitle: 'Doors Open Thursday, October 29 at 08:30 AM',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'We Are Ready to Welcome You!',
        subtitle: 'Here is your final readiness checklist for RECON 2026 in Abuja',
        content: 'Dear {name},\n\nThe stage is set at the Shehu Musa Yar\'Adua Centre in Abuja. With 150+ exhibitors and 10,000+ registered delegates, RECON 2026 is West Africa’s biggest built environment event of the year.\n\nYour fast-track digital pass #{ticket} is ready for scanning at Gate A and Gate B.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'qr_badge',
        title: 'DIGITAL PASS BARCODE',
        subtitle: 'Show this at Security Registration Desk',
        content: 'Name: {name}\nTicket: #{ticket}\nCategory: {category}',
        bgColor: '#0d382d',
        textColor: '#ffffff'
      },
      {
        id: 'b4',
        type: 'footer'
      }
    ]
  },

  // 12. Africa Property Leadership Awards Gala
  {
    id: 'tmpl-awards-gala',
    name: '🏆 Africa Property Leadership & Excellence Awards Gala',
    category: 'announcements',
    categoryLabel: 'Awards & Gala',
    subject: '🏆 Invitation: RECON Africa Property Leadership Awards Gala Night',
    preheader: 'Celebrating outstanding excellence in architecture, property development, and engineering.',
    description: 'Black-tie gala dinner invitation celebrating industry champions and lifetime achievement winners.',
    thumbnailIcon: 'Award',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON AWARDS GALA NIGHT 2026',
        subtitle: 'Celebrating Excellence, Integrity & Innovation',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'An Evening of Elegance, Recognition & Glamour',
        subtitle: 'Saturday, October 31, 2026 • 07:00 PM • Banquet Hall',
        content: 'Dear {name},\n\nYou are cordially invited to the grand finale of RECON Expo 2026: The Africa Property Leadership & Excellence Awards Gala.\n\nJoin ministers, ambassadors, CEOs, and leading developers for a 5-course black-tie banquet honoring top achievers in 24 prestigious categories.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'button',
        buttonText: 'Reserve Awards Gala Table / VIP Seat',
        buttonUrl: 'https://www.afrinetgroup.com/awards',
        align: 'center',
        bgColor: '#d4af37',
        textColor: '#012a20'
      },
      {
        id: 'b4',
        type: 'footer'
      }
    ]
  },

  // 13. Masterclass & CPD Training Certification
  {
    id: 'tmpl-masterclass-cpd',
    name: '🎓 Executive Masterclasses & CPD Certification',
    category: 'announcements',
    categoryLabel: 'Training & Masterclasses',
    subject: '🎓 Earn CPD Points: Executive Masterclasses in Real Estate & Engineering at RECON 2026',
    preheader: 'Certified training modules for architects, civil engineers, quantity surveyors, and project managers.',
    description: 'Professional development sessions offering recognized Continuing Professional Development points.',
    thumbnailIcon: 'FileText',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON 2026 EXECUTIVE MASTERCLASSES',
        subtitle: 'Earn Recognized CPD Professional Development Credits',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'Advance Your Professional Standing',
        subtitle: 'Direct Certification from Accredited Industry Bodies',
        content: 'Dear {name},\n\nEnhance your technical expertise with intensive masterclasses led by world-class professors and project directors at RECON 2026.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'features_2col',
        title: 'AVAILABLE MASTERCLASS SESSIONS',
        items: [
          { title: '📐 Masterclass 1: FIDIC Contracts & Risk', description: 'Dispute adjudication, contract drafting, and claims management in large capital projects.' },
          { title: '🏗️ Masterclass 2: Green Building & EDGE', description: 'Designing IFC-certified EDGE green buildings for reduced energy consumption and ESG compliance.' },
          { title: '💻 Masterclass 3: BIM & AI in Construction', description: 'Building Information Modeling (BIM) workflows and drone surveying for cost estimation.' },
          { title: '📊 Masterclass 4: Real Estate Valuation Models', description: 'Financial modeling, DCF valuations, and REIT structuring in inflationary markets.' }
        ]
      },
      {
        id: 'b4',
        type: 'button',
        buttonText: 'Enroll in Certified Masterclass Sessions',
        buttonUrl: 'https://www.afrinetgroup.com/masterclasses',
        align: 'center',
        bgColor: '#d4af37',
        textColor: '#012a20'
      },
      {
        id: 'b5',
        type: 'footer'
      }
    ]
  },

  // 14. Monthly Industry Newsletter (Issue Edition)
  {
    id: 'tmpl-industry-newsletter',
    name: '📰 Monthly RECON Industry Newsletter (Issue Edition)',
    category: 'newsletter',
    categoryLabel: 'Newsletters',
    subject: '📰 RECON Built Environment Insights: Housing Deficit Reforms, PropTech & Deal Trends',
    preheader: 'Your monthly executive briefing on West African real estate, mortgage trends, and infrastructure data.',
    description: 'Comprehensive editorial newsletter template with feature articles, market data charts, and sponsor highlights.',
    thumbnailIcon: 'Mail',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON MONTHLY INDUSTRY BRIEFING',
        subtitle: 'West Africa Built Environment Intelligence • Edition #12',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'Inside This Month’s Market Analysis',
        subtitle: 'Mortgage Refinancing, Urban Infrastructure & Cement Price Dynamics',
        content: 'Dear {name},\n\nWelcome to this month’s edition of the RECON Industry Executive Briefing.\n\nAs Nigeria steps up efforts to bridge the 28-million-unit housing deficit, public-private partnerships and innovative financing mechanisms are taking center stage. Here are the key developments shaping the market this quarter.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'features_2col',
        title: 'MONTHLY MARKET HIGHLIGHTS',
        items: [
          { title: '📈 FMBN Single-Digit Mortgage Expansion', description: 'New 6% interest mortgage schemes launched for diaspora and civil service contributors.' },
          { title: '🏗️ Infrastructure Bond Approvals', description: 'Over ₦450 Billion in sub-national infrastructure bonds approved for road and rail corridors.' },
          { title: '🌱 Solar Mini-Grids for Gated Estates', description: 'Developers in Abuja and Lagos shifting to hybrid solar grids to reduce tenant operational costs.' },
          { title: '⚖️ Real Estate Regulatory Act Updates', description: 'Enhanced protections against title fraud and mandatory developer escrow accounts.' }
        ]
      },
      {
        id: 'b4',
        type: 'button',
        buttonText: 'Read Full Whitepaper & Market Report',
        buttonUrl: 'https://www.afrinetgroup.com/insights',
        align: 'center',
        bgColor: '#d4af37',
        textColor: '#012a20'
      },
      {
        id: 'b5',
        type: 'footer'
      }
    ]
  },

  // 15. Flash Booth Space Sale
  {
    id: 'tmpl-flash-booth-sale',
    name: '💰 Flash Sale: 20% Off Remaining Prime Booth Stands',
    category: 'promotions',
    categoryLabel: 'Promotions',
    subject: '💰 Last Call: 20% Discount on Remaining Prime Exhibition Booths at RECON 2026',
    preheader: 'Only 8 prime booths left in Hall A and Main Entrance. Claim your discounted stand today.',
    description: 'Urgent promotional email targeting prospective exhibitors with direct stand discounts.',
    thumbnailIcon: 'Tag',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON 2026 EXHIBITION FLASH SALE',
        subtitle: 'Limited Stand Availability in Main Exhibition Hall',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'Only 8 Prime Stands Remaining in Hall A',
        subtitle: 'Claim 20% Off Standard Rates Before Floorplan is Sealed',
        content: 'Dear {name},\n\nWith over 85% of exhibition space sold out to top developers, banks, and building material suppliers, we are offering an exclusive 20% Flash Discount on the final remaining 8 prime booths in Hall A.\n\nPut your company directly in the walking path of 10,000+ verified corporate buyers and property investors.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'button',
        buttonText: 'Claim 20% Off Booth Space Now',
        buttonUrl: 'https://www.afrinetgroup.com/booth-packages',
        align: 'center',
        bgColor: '#d4af37',
        textColor: '#012a20'
      },
      {
        id: 'b4',
        type: 'footer'
      }
    ]
  },

  // 16. Panel Discussion: Green Building & ESG
  {
    id: 'tmpl-green-building',
    name: '🌱 Special Panel: Green Building, Solar & ESG',
    category: 'announcements',
    categoryLabel: 'Sessions & Panels',
    subject: '🌱 Special Session: Green Building, Carbon Credits & ESG Standards at RECON 2026',
    preheader: 'Discover how sustainable architecture and solar energy cut operational costs by 40%.',
    description: 'Highlighting sustainability, renewable energy, and eco-friendly construction materials.',
    thumbnailIcon: 'Globe',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON 2026 SUSTAINABILITY & ESG FORUM',
        subtitle: 'Decarbonizing Africa’s Urban Landscape',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'The Green Building Revolution in Nigeria',
        subtitle: 'Financing, Certification & Lowering Energy Costs',
        content: 'Dear {name},\n\nJoin global green finance leaders and eco-architects for a high-level panel exploring how EDGE-certified sustainable properties yield higher rental valuations and qualify for international green bonds.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'button',
        buttonText: 'Reserve Your Seat for the ESG Panel',
        buttonUrl: 'https://www.afrinetgroup.com/sessions/esg',
        align: 'center',
        bgColor: '#d4af37',
        textColor: '#012a20'
      },
      {
        id: 'b4',
        type: 'footer'
      }
    ]
  },

  // 17. Exhibitor Logistics & Freight Guidelines
  {
    id: 'tmpl-exhibitor-logistics',
    name: '🛡️ Exhibitor Logistics, Freight & Security Manual',
    category: 'exhibitors',
    categoryLabel: 'Exhibitors',
    subject: '🛡️ RECON 2026 Exhibitor Logistics: Freight Delivery, Setup Times & Security Rules',
    preheader: 'Crucial instructions for your stand setup team, delivery trucks, and equipment badges.',
    description: 'Operational guidelines for booth contractors, delivery schedules, and security pass collections.',
    thumbnailIcon: 'Truck',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON 2026 LOGISTICS & OPERATIONS',
        subtitle: 'Stand Construction & Freight Regulations',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'Exhibitor Stand Setup & Security Protocol',
        subtitle: 'Official Guidelines for {company} (Stand #{booth})',
        content: 'Dear {name},\n\nPlease review these mandatory logistics rules to ensure smooth setup for your team at the Yar\'Adua Centre.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'features_2col',
        title: 'KEY LOGISTICS TIMINGS',
        items: [
          { title: '🚛 Freight Ingest', description: 'Oct 28: 07:00 AM – 06:00 PM via Yar\'Adua Centre Loading Bay 2' },
          { title: '🔨 Stand Construction Cutoff', description: 'Oct 28: 10:00 PM (No heavy construction permitted on show days)' },
          { title: '🔒 Overnight Security', description: '24/7 armed security and CCTV monitoring throughout the exhibition hall' },
          { title: '📦 Breakdown & Move-Out', description: 'Oct 31: 06:30 PM – 11:59 PM (All equipment must be cleared)' }
        ]
      },
      {
        id: 'b4',
        type: 'footer'
      }
    ]
  },

  // 18. Official Mobile App Download
  {
    id: 'tmpl-mobile-app',
    name: '📱 Official RECON Mobile App Download & Digital Badge',
    category: 'onboarding',
    categoryLabel: 'Digital Tools',
    subject: '📱 Download the Official RECON Expo 2026 Mobile App & Sync Your Digital Badge',
    preheader: 'Access live floorplans, instant QR badge scanner, 1-on-1 attendee messaging, and session alerts.',
    description: 'Encourages delegates to download the interactive event app for seamless networking.',
    thumbnailIcon: 'Smartphone',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON EXPO MOBILE APP',
        subtitle: 'Your Smart Pocket Guide to RECON 2026',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'Everything You Need in One App',
        subtitle: 'Available for iOS & Android Devices',
        content: 'Dear {name},\n\nGet ready for RECON 2026 by downloading the official event app. Network with fellow delegates, bookmark your favorite speakers, and scan exhibitor QR codes to collect brochures instantly.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'features_2col',
        title: 'POWERFUL APP FEATURES',
        items: [
          { title: '🗺️ Interactive Floorplan', description: 'Navigate 150+ stands with turn-by-turn indoor routing' },
          { title: '💬 1-on-1 Delegate Chat', description: 'Send direct messages to CEOs, investors, and exhibitors' },
          { title: '🔔 Live Session Reminders', description: 'Get alerts 10 minutes before your bookmarked keynotes start' },
          { title: '📇 Digital Business Cards', description: 'Exchange contact cards in 1 tap via QR scan' }
        ]
      },
      {
        id: 'b4',
        type: 'button',
        buttonText: 'Download RECON App on App Store & Google Play',
        buttonUrl: 'https://www.afrinetgroup.com/app',
        align: 'center',
        bgColor: '#d4af37',
        textColor: '#012a20'
      },
      {
        id: 'b5',
        type: 'footer'
      }
    ]
  },

  // 19. Virtual Livestream Pass & Webcast Access
  {
    id: 'tmpl-virtual-livestream',
    name: '🌐 Virtual Livestream Pass & Webcast Access',
    category: 'onboarding',
    categoryLabel: 'Virtual Access',
    subject: '🌐 Your Virtual Access Link: Watch RECON 2026 Live from Anywhere in the World',
    preheader: 'Access HD 1080p live streams of all main stage keynotes and panel Q&A sessions.',
    description: 'Sent to virtual and international delegates with private stream URLs and interaction logins.',
    thumbnailIcon: 'Video',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON 2026 GLOBAL VIRTUAL SUMMIT',
        subtitle: 'HD Webcast & Real-Time Interactive Q&A',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'Experience RECON 2026 Wherever You Are',
        subtitle: 'High-Definition Streaming of All 3 Summit Days',
        content: 'Dear {name},\n\nCan’t make it to Abuja in person? Your Virtual Pass gives you front-row digital access to all ministerial addresses, plenary sessions, and digital exhibit rooms.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'button',
        buttonText: 'Enter Virtual Livestream Broadcast Room',
        buttonUrl: 'https://www.afrinetgroup.com/live',
        align: 'center',
        bgColor: '#d4af37',
        textColor: '#012a20'
      },
      {
        id: 'b4',
        type: 'footer'
      }
    ]
  },

  // 20. Post-Event Photo Album & Highlights
  {
    id: 'tmpl-post-photos',
    name: '📸 Official RECON 2026 Photo Album & Highlights Reel',
    category: 'post_event',
    categoryLabel: 'Post-Event',
    subject: '📸 RECON 2026 in Photos: Official High-Resolution Photo Gallery & Video Highlights',
    preheader: 'Relive the best moments, executive handshakes, exhibition booths, and awards night.',
    description: 'Post-summit visual recap with download links to official high-resolution photography.',
    thumbnailIcon: 'Image',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON EXPO 2026 • PHOTO VAULT',
        subtitle: 'Official High-Resolution Photography & Press Gallery',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'Relive the Energy of RECON 2026',
        subtitle: 'Over 2,500 High-Resolution Photos Now Available',
        content: 'Dear {name},\n\nThank you for making the 8th Real Estate & Construction Expo a monumental success! Our media team has curated the complete high-resolution photo gallery covering all sessions, exhibition stands, and the gala dinner.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'button',
        buttonText: 'Browse & Download Your Event Photos',
        buttonUrl: 'https://www.afrinetgroup.com/photos',
        align: 'center',
        bgColor: '#d4af37',
        textColor: '#012a20'
      },
      {
        id: 'b4',
        type: 'footer'
      }
    ]
  },

  // 21. Post-Expo Slide Deck & Whitepaper Access
  {
    id: 'tmpl-post-slides',
    name: '📑 Official Presentation Slides & Whitepapers',
    category: 'post_event',
    categoryLabel: 'Post-Event',
    subject: '📑 Download All Speaker Slides, Research Papers & Whitepapers from RECON 2026',
    preheader: 'Access 35+ presentations, housing policy briefs, and construction industry datasets.',
    description: 'Delivers full presentation slide decks, technical whitepapers, and delegate resource kits.',
    thumbnailIcon: 'Download',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON 2026 KNOWLEDGE REPOSITORY',
        subtitle: 'Official Presentation Slides & Technical Whitepapers',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'All Summit Presentations in One Place',
        subtitle: 'Download Speaker Slide Decks, Datasets & Policy Briefs',
        content: 'Dear {name},\n\nAs promised, all approved presentation slides, mortgage policy whitepapers, and green building technical guides from RECON 2026 are now available for delegate download.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'button',
        buttonText: 'Access Knowledge Hub & Download Slides',
        buttonUrl: 'https://www.afrinetgroup.com/slides',
        align: 'center',
        bgColor: '#d4af37',
        textColor: '#012a20'
      },
      {
        id: 'b4',
        type: 'footer'
      }
    ]
  },

  // 22. Verified Certificate of Attendance
  {
    id: 'tmpl-certificate-attendance',
    name: '🎖️ Official Certificate of Attendance & CPD Points',
    category: 'post_event',
    categoryLabel: 'Certificates & CPD',
    subject: '🎖️ Your Official Verified Certificate of Attendance for RECON Expo 2026',
    preheader: 'Issued in recognition of your participation at the 8th Real Estate & Construction Summit.',
    description: 'Personalized certificate with QR verification code and CPD point recognition.',
    thumbnailIcon: 'CheckCircle',
    badge: 'CERTIFICATE',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'CERTIFICATE OF PARTICIPATION',
        subtitle: '8th Real Estate & Construction Expo 2026',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'Official Recognition of Attendance',
        subtitle: 'Awarded to: {name} • Ticket #{ticket}',
        content: 'This is to certify that {name} of {company} actively participated in the 8th Annual Real Estate & Construction Expo held at the Shehu Musa Yar\'Adua Centre, Abuja, Nigeria on October 29–31, 2026.\n\nThis certificate validates 15 hours of Continuing Professional Development (CPD) in Built Environment, Architecture, and Project Engineering.',
        align: 'center'
      },
      {
        id: 'b3',
        type: 'button',
        buttonText: 'Download Verified PDF Certificate',
        buttonUrl: 'https://www.afrinetgroup.com/certificate/{ticket}',
        align: 'center',
        bgColor: '#d4af37',
        textColor: '#012a20'
      },
      {
        id: 'b4',
        type: 'footer'
      }
    ]
  },

  // 23. Post-Event Feedback & Survey (Win Prize)
  {
    id: 'tmpl-feedback-survey',
    name: '💡 Post-Event Feedback Survey (Win a Free Stand/Pass)',
    category: 'post_event',
    categoryLabel: 'Feedback & Surveys',
    subject: '💡 How Was Your RECON 2026 Experience? Share 2 Mins of Feedback & Win VIP Perks',
    preheader: 'Help us improve next year’s expo and enter the draw for a free VIP Pass or Booth discount.',
    description: 'Collects structured delegate feedback to improve future editions and boost engagement.',
    thumbnailIcon: 'HelpCircle',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON 2026 FEEDBACK & EVALUATION',
        subtitle: 'Your Voice Shapes the Future of the Expo',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'Tell Us What You Loved & How We Can Improve',
        subtitle: '2-Minute Survey • Enter the 2027 VIP Pass Raffle',
        content: 'Dear {name},\n\nWe would love to hear your thoughts on RECON Expo 2026. Which sessions did you find most valuable? What would you like to see more of next year?\n\nAs a thank you, all survey respondents will be entered into our raffle for complimentary passes and hotel stays for RECON 2027.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'button',
        buttonText: 'Complete the 2-Minute Feedback Survey',
        buttonUrl: 'https://www.afrinetgroup.com/feedback',
        align: 'center',
        bgColor: '#d4af37',
        textColor: '#012a20'
      },
      {
        id: 'b4',
        type: 'footer'
      }
    ]
  },

  // 24. Cart / Unfinished Registration Reminder
  {
    id: 'tmpl-cart-reminder',
    name: '🔔 Incomplete Registration / Payment Recovery',
    category: 'promotions',
    categoryLabel: 'Recovery',
    subject: '🔔 Incomplete Registration: Complete Your RECON 2026 Ticket in 1 Click',
    preheader: 'We saved your details. Complete your registration to guarantee your delegate pass.',
    description: 'Automated recovery email for abandoned checkout or uncompleted delegate registrations.',
    thumbnailIcon: 'AlertCircle',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON 2026 REGISTRATION CONCIERGE',
        subtitle: 'Your Seat is Reserved for 24 Hours',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'You are Almost There, {name}!',
        subtitle: 'Complete Your Registration to Secure Your Official Badge',
        content: 'Dear {name},\n\nWe noticed you started registering for RECON Expo 2026 but didn’t complete checkout.\n\nBecause delegate seats and VIP passes are strictly limited to venue capacity at the Yar\'Adua Centre, we can hold your reservation for only 24 more hours.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'button',
        buttonText: 'Open Delegate Portal',
        buttonUrl: 'https://reconexpo.afrinetgroup.com/',
        align: 'center',
        bgColor: '#10b981',
        textColor: '#ffffff'
      },
      {
        id: 'b4',
        type: 'footer'
      }
    ]
  },

  // 25. Onboarding welcome countdown template
  {
    id: 'tmpl-drip-day1',
    name: '🌟 Countdown: Welcome & Orientation',
    category: 'onboarding',
    categoryLabel: 'Onboarding & Passes',
    subject: '🌟 RECON 2026: Welcome to the 30-Day Countdown & Executive Onboarding',
    preheader: 'Here is what to expect over the next 30 days leading up to the summit in Abuja.',
    description: 'Day 1 of the countdown journey onboarding registrants into the event ecosystem.',
    thumbnailIcon: 'Sparkles',
    badge: 'WELCOME COUNTDOWN',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON 2026 • 30-DAY COUNTDOWN INITIATIVE',
        subtitle: 'Executive Onboarding & Summit Readiness',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'Welcome to the RECON Community, {name}!',
        subtitle: '30 Days of Insights, Networking & Deal Preparations',
        content: 'Dear {name},\n\nOver the next 30 days, you will receive our exclusive weekly briefing series covering key exhibitors, pre-event deal rooms, hotel discount codes, and thought leadership reports.\n\nMake sure to add reconexpo@afrinetgroup.com to your address book so you never miss an official announcement.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'footer'
      }
    ]
  },

  // 26. Educational Built Environment Trends template
  {
    id: 'tmpl-drip-day10',
    name: '🚀 Educational: Built Environment Trends',
    category: 'newsletter',
    categoryLabel: 'Newsletters',
    subject: '🚀 RECON 2026: 5 Mega Trends Transforming Nigerian Real Estate',
    preheader: 'PropTech, alternative building materials, and mortgage innovations ahead of RECON 2026.',
    description: 'High-value educational content nurturing subscribers ahead of the summit.',
    thumbnailIcon: 'Zap',
    badge: 'EDUCATIONAL',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON 2026 • THOUGHT LEADERSHIP SERIES',
        subtitle: 'Exclusive Delegate Research Briefing #2',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: '5 Macro Trends Driving the 2026 Property Boom',
        subtitle: 'Prepared by RECON Research & Intelligence Advisory',
        content: 'Dear {name},\n\nAs we count down to RECON Expo in Abuja, here are 5 key market forces that every developer, architect, investor, and contractor should be prepared to discuss on the exhibition floor.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'features_2col',
        title: 'KEY THEMES FOR RECON 2026',
        items: [
          { title: '1. Industrialized Construction', description: 'Pre-engineered steel frames and dry construction cutting project schedules by 40%.' },
          { title: '2. Currency Hedged Real Estate', description: 'Dollar-indexed and diaspora-targeted residential yields exceeding 12% in Abuja.' },
          { title: '3. ESG & Solar Mandates', description: 'Commercial office tenants demanding green certifications and captive renewable power.' },
          { title: '4. Title Digitization & AI', description: 'State land registries modernizing to GIS and blockchain-backed property records.' }
        ]
      },
      {
        id: 'b4',
        type: 'button',
        buttonText: 'Join the Pre-Event Discussion on LinkedIn',
        buttonUrl: 'https://linkedin.com/company/recon-expo',
        align: 'center',
        bgColor: '#d4af37',
        textColor: '#012a20'
      },
      {
        id: 'b5',
        type: 'footer'
      }
    ]
  },

  // 27. Partner / Media Accreditation Welcome
  {
    id: 'tmpl-media-partner',
    name: '🤝 Partner & Press / Media Accreditation Confirmation',
    category: 'onboarding',
    categoryLabel: 'Press & Media',
    subject: '🤝 RECON Expo 2026: Official Press & Media Accreditation Approved',
    preheader: 'Access credentials for the Press Conference Room, Media Lounge, and Executive Interview Studio.',
    description: 'Accreditation confirmation for accredited journalists, TV broadcasters, and media partners.',
    thumbnailIcon: 'Radio',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON 2026 MEDIA & PRESS SECRETARIAT',
        subtitle: 'Official Press Accreditation & Media Lounge Access',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'Media Accreditation Confirmed',
        subtitle: 'Press Pass Assigned to: {name} ({company})',
        content: 'Dear {name},\n\nWe are pleased to inform you that your media and press accreditation for the 8th Real Estate & Construction Expo 2026 has been approved.\n\nYou have full access to the Media Center, Press Briefing Room, and reserved seating in the Main Keynote Hall.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'button',
        buttonText: 'Download Media Press Kit & Schedule',
        buttonUrl: 'https://www.afrinetgroup.com/press-kit',
        align: 'center',
        bgColor: '#d4af37',
        textColor: '#012a20'
      },
      {
        id: 'b4',
        type: 'footer'
      }
    ]
  },

  // 28. 30-Day Promo Countdown Broadcast Template
  {
    id: 'tmpl-promo-30day-broadcast',
    name: '💰 30-Day Promotional Countdown Broadcast Pass',
    category: 'promotions',
    categoryLabel: 'Promotions',
    subject: '⏳ 30 Days To Go: Secure Your Official RECON Expo 2026 Pass [Special Promo Rate]',
    preheader: 'Only 30 days left until the 8th Real Estate & Construction Expo. Save 20% on all registrations today.',
    description: 'A dedicated 30-day broadcast promotional template to blast to leads and encourage pass purchases.',
    thumbnailIcon: 'DollarSign',
    badge: '30-DAY PROMO',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: '30-DAY COUNTDOWN • RECON 2026',
        subtitle: 'West Africa’s Construction & Property Event',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'The Countdown is On: Exactly 30 Days Remaining!',
        subtitle: 'Secure Your Official Delegate Pass & Unlock Exclusive Expo Rates',
        content: 'Dear {name},\n\nWe are officially 30 days away from the opening ceremony of the 8th annual Real Estate & Construction Expo (RECON 2026) at the Shehu Musa Yar\'Adua Centre, Abuja!\n\nThis year’s edition is set to host over 150+ exhibitors, 20+ keynote speakers, and 10,000+ industry professionals. To celebrate our 30-day milestone, we are releasing a limited number of discount passes at 20% off for the next 48 hours.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'features_2col',
        title: 'WHAT TO EXPECT AT RECON 2026',
        items: [
          { title: '🏆 Industry Plenary', description: 'Hear directly from federal ministers and leading real estate CEOs.' },
          { title: '🏗️ Machinery Showcase', description: 'See live demonstrations of heavy machinery and innovative building systems.' },
          { title: '💼 B2B Matchmaking', description: 'Schedule 1-on-1 private meetings with mortgage financiers and developers.' },
          { title: '🌱 Sustainability Hub', description: 'Participate in CPD-certified green building and smart materials workshops.' }
        ]
      },
      {
        id: 'b4',
        type: 'button',
        buttonText: 'Claim Your 20% Discount Pass Now',
        buttonUrl: 'https://reconexpo.afrinetgroup.com/',
        align: 'center',
        bgColor: '#10b981',
        textColor: '#ffffff'
      },
      {
        id: 'b5',
        type: 'footer'
      }
    ]
  },

  // 29. VIP Networking Cocktail & Executive Reception
  {
    id: 'tmpl-activity-cocktail',
    name: '🍷 VIP Networking Cocktail & Executive Reception',
    category: 'schedule',
    categoryLabel: 'Event Activities',
    subject: '🍷 Invitation: RECON 2026 Executive VIP Cocktail Reception & Partner Meet',
    preheader: 'Join industry titans, executive developers, and institutional investors for an evening of high-value connections.',
    description: 'An elegant evening reception template to invite VIP delegates and speakers to network after hours.',
    thumbnailIcon: 'PartyPopper',
    badge: 'VIP ACTIVITY',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON 2026 • AFTER-HOURS VIP RECEPTION',
        subtitle: 'Connecting Capitals, Developers & Policy Makers',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'Exclusive Executive Networking Cocktail Reception',
        subtitle: 'Thursday, October 29 • 06:30 PM • Yar\'Adua Centre Fountain Garden',
        content: 'Dear {name},\n\nYou are cordially invited to join us for the official RECON Expo 2026 VIP & Partner Cocktail Reception.\n\nFollowing a high-impact opening day of discussions and deal-making, this exclusive evening gathering offers a premium, relaxed environment to connect with international real estate investors, state governors, and leading construction conglomerates over dry mocktails, premium wine, and finger foods.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'features_2col',
        title: 'RECEPTION HIGHLIGHTS',
        items: [
          { title: '🤝 High-Net-Worth Networking', description: 'Exchange contacts directly with over 200+ pre-vetted institutional buyers, developers, and directors.' },
          { title: '🎷 Live Jazz & Premium Catering', description: 'Enjoy soothing live instrumental jazz alongside a curated selection of fine wines and gourmet Nigerian-fusion appetizers.' },
          { title: '🎤 Opening Toast by Dignitaries', description: 'Join us for a brief welcome address and industry toast by the Honourable Minister of Housing.' }
        ]
      },
      {
        id: 'b4',
        type: 'button',
        buttonText: 'RSVP to Confirm VIP Attendance',
        buttonUrl: 'https://reconexpo.afrinetgroup.com/cocktail-rsvp',
        align: 'center',
        bgColor: '#d4af37',
        textColor: '#012a20'
      },
      {
        id: 'b5',
        type: 'footer'
      }
    ]
  },

  // 30. Guided Construction Site Tour & Project Walk
  {
    id: 'tmpl-activity-sitetour',
    name: '🏗️ Guided Construction Site Tour & Property Walk',
    category: 'schedule',
    categoryLabel: 'Event Activities',
    subject: '🏗️ RECON 2026 Guided Site Tour: Inspect Abuja\'s Mega Projects & Smart Estates',
    preheader: 'Hop onto our luxury executive shuttle buses to inspect prime off-plan residential developments and major infrastructure projects.',
    description: 'Logistics and invitation template for the organized construction and property field tour.',
    thumbnailIcon: 'MapPin',
    badge: 'GUIDED TOUR',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON 2026 FIELD STUDY TOUR',
        subtitle: 'Ground Inspection of Abuja\'s Fast-Growing Luxury Corridors',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'Abuja Smart Estates & Mega Infrastructure Site Tour',
        subtitle: 'Friday, October 30 • Departure: 08:00 AM Sharp from Yar\'Adua Centre',
        content: 'Dear {name},\n\nExperience real estate development from the ground up. We are hosting an exclusive, fully-guided Construction Site Tour for select delegates, developers, and foreign investors.\n\nWe will visit 3 of Abuja’s most ambitious smart communities and premium high-rise projects currently under construction. Meet the principal engineers, inspect quality controls, and analyze real construction methodologies live on-site.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'schedule_box',
        title: 'TOUR ITINERARY & DEPARTURE LOGISTICS',
        items: [
          { title: '🚐 07:45 AM – Boarding & Delegate Briefing', description: 'Shuttles load at the Yar\'Adua Centre Main Gate. Safety helmets, reflective vests, and travel snack packs will be distributed.' },
          { title: '🏢 Stop 1: Centenary City Smart Villa Infrastructure', description: 'Inspect advanced sub-soil compaction, fiber-optic trenching, and smart energy grid integration.' },
          { title: '🏗️ Stop 2: Guzape Hills Luxury High-Rise Structural Frame', description: 'Witness live post-tensioned concrete slab casting and talk with structural engineers about high-strength cement standards.' },
          { title: '🍱 01:30 PM – Networking Lunch & Debrief', description: 'Enjoy a catered buffet lunch with developer executives followed by a return trip to the main expo centre.' }
        ]
      },
      {
        id: 'b4',
        type: 'button',
        buttonText: 'Book Your Site Tour Seat (Limit: 50 Delegates)',
        buttonUrl: 'https://reconexpo.afrinetgroup.com/site-tour',
        align: 'center',
        bgColor: '#10b981',
        textColor: '#ffffff'
      },
      {
        id: 'b5',
        type: 'footer'
      }
    ]
  },

  // 31. Women in Construction & Real Estate Leadership Breakfast
  {
    id: 'tmpl-activity-women-breakfast',
    name: '💼 Women in Construction & Real Estate Executive Breakfast',
    category: 'announcements',
    categoryLabel: 'Event Activities',
    subject: '💼 Invitation: Women in Real Estate & Construction Leadership Breakfast [RECON 2026]',
    preheader: 'Connect, empower, and discuss growth strategies with West Africa\'s leading female property pioneers and directors.',
    description: 'Exclusive breakfast invitation template focusing on female property leaders, engineers, and developers.',
    thumbnailIcon: 'Coffee',
    badge: 'LEADERSHIP BREAKFAST',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON 2026 WOMEN IN BUILT ENVIRONMENT',
        subtitle: 'Empowering Diversity, Innovation & Executive Excellence',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'Women in Construction & Real Estate Executive Breakfast',
        subtitle: 'Friday, October 30 • 08:30 AM – 10:00 AM • VIP Private Lounge',
        content: 'Dear {name},\n\nWe are delighted to invite you to the annual Women in Construction & Real Estate Executive Breakfast at RECON 2026.\n\nThis high-profile session convenes outstanding female executives, leading architects, seasoned developers, and finance directors to address equity, funding gaps, and career-advancement pathways in West Africa\'s built environment.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'features_2col',
        title: 'DISTINGUISHED BREAKFAST FACULTY',
        items: [
          { title: '🎤 Keynote Address', description: 'Delivered by top industry pioneers discussing how female developers are changing the skyline in Abuja and Lagos.' },
          { title: '💬 Panel Discussion: Breaking the Brick Ceiling', description: 'How to scale construction operations, win government contracts, and secure capital as female founders.' },
          { title: '☕ Structured Roundtable & Connections', description: 'Pre-matched roundtable networking to foster long-term mentorship and partnership opportunities.' }
        ]
      },
      {
        id: 'b4',
        type: 'button',
        buttonText: 'Reserve Your Breakfast Invitation',
        buttonUrl: 'https://reconexpo.afrinetgroup.com/women-breakfast',
        align: 'center',
        bgColor: '#d4af37',
        textColor: '#012a20'
      },
      {
        id: 'b5',
        type: 'footer'
      }
    ]
  },

  // 32. PropTech Startup Pitch Battle & Innovation Showcase
  {
    id: 'tmpl-activity-proptech-pitch',
    name: '⚡ PropTech Startup Pitch Battle & Innovation Showcase',
    category: 'announcements',
    categoryLabel: 'Event Activities',
    subject: '⚡ RECON 2026: Watch the Live PropTech Startup Pitch Battle & Vote for the Winner',
    preheader: 'See 8 high-growth startups present groundbreaking building automation, AI costing software, and blockchain land registries.',
    description: 'High-energy template announcing the PropTech startup pitch battle and voting.',
    thumbnailIcon: 'Zap',
    badge: 'INNOVATION STAGE',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON 2026 PROPTECH INNOVATION HUB',
        subtitle: 'The Future of Built Environment Software & IoT Devices',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'Live PropTech Pitch Battle: 8 Startups, ₦5,000,000 Grand Prize',
        subtitle: 'Friday, October 30 • 03:30 PM • Main Plenary Stage B',
        content: 'Dear {name},\n\nInnovation is accelerating in the built environment! We invite you to be a part of the audience for the high-octane RECON 2026 PropTech Pitch Battle.\n\nWatch 8 of Nigeria\'s most promising real estate technology startups pitch their solutions live to a panel of venture capitalists, institutional developers, and government GIS specialists. Discover technologies that can cut your operational costs by up to 30%.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'features_2col',
        title: 'FEATURED TECHNOLOGIES ON DISPLAY',
        items: [
          { title: '🤖 AI Construction Estimation', description: 'Cloud software that translates 3D BIM models into instant, inflation-adjusted cost sheets and material bills.' },
          { title: '⛓️ GIS-Linked Land Record Blockchain', description: 'A secure, decentralized protocol allowing title verification and purchase escrow in under 10 minutes.' },
          { title: '🌱 IoT Energy & Gated Community Grids', description: 'Smart meters and power-shifting algorithms that optimize solar grid performance for residential estates.' }
        ]
      },
      {
        id: 'b4',
        type: 'button',
        buttonText: 'Add Pitch Battle to Your Schedule & Reserve Seat',
        buttonUrl: 'https://reconexpo.afrinetgroup.com/proptech-stage',
        align: 'center',
        bgColor: '#10b981',
        textColor: '#ffffff'
      },
      {
        id: 'b5',
        type: 'footer'
      }
    ]
  },

  // 33. Heavy Equipment & Building Materials Live Auction
  {
    id: 'tmpl-activity-machinery-auction',
    name: '🔨 Heavy Equipment & Building Materials Live Auction',
    category: 'schedule',
    categoryLabel: 'Event Activities',
    subject: '🔨 Live Auction: Bid on Heavy Machinery & Premium Construction Overstock',
    preheader: 'Save up to 50% on certified excavators, mixers, premium tiles, and structural steel at the RECON 2026 Liquidation Auction.',
    description: 'Promotional invitation template for the Live Material and Machinery Auction.',
    thumbnailIcon: 'Hammer',
    badge: 'LIVE AUCTION',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON EXPO 2026 LIQUIDATION AUCTION',
        subtitle: 'Certified Fleet Clearout & Premium Overstock Building Materials',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'Live Liquidation Auction: Up to 50% Off Fleet Assets',
        subtitle: 'Saturday, October 31 • 02:00 PM – 05:00 PM • Outdoor Pavilion C',
        content: 'Dear {name},\n\nAre you looking to expand your contracting fleet or procure bulk building finishes at unmatched prices? Do not miss the official RECON Expo 2026 Live Auction.\n\nWe have partnered with leading plant leasing corporations and premium material manufacturers to auction off over ₦150 Million worth of certified heavy equipment, structural steel lots, solar kits, and bulk premium ceramic finishes. All bidding starts at 40-50% below retail value!',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'schedule_box',
        title: 'FEATURED AUCTION LOTS & TERMS',
        items: [
          { title: '🚜 Lot #1–4: Certified Used CAT Excavators & Mixers', description: 'Fully serviced, low working hours, complete documentation, with standard 3-month performance warranties.' },
          { title: '🧱 Lot #12–15: Premium Spanish Vitrified Tiles (15,000 sqm)', description: 'Perfect bulk premium tiles packaged in original crates, ready for immediate delivery to Maitama or Lagos.' },
          { title: '⚡ Lot #21–25: Smart Estate 50kVA Hybrid Solar Inverter Kits', description: 'Industrial lithium-ion battery banks, high-efficiency solar arrays, and custom control panel rigs.' },
          { title: '📝 Registration & Bidder Credentials', description: 'Refundable bidder commitment deposit of ₦100,000 required at the auction gate to receive your official bidding paddle.' }
        ]
      },
      {
        id: 'b4',
        type: 'button',
        buttonText: 'Register as a Verified Bidder & Download Catalog',
        buttonUrl: 'https://reconexpo.afrinetgroup.com/auction-catalog',
        align: 'center',
        bgColor: '#d4af37',
        textColor: '#012a20'
      },
      {
        id: 'b5',
        type: 'footer'
      }
    ]
  },
  // 34. 30-Day Exclusive Promotional Broadcast Pass
  {
    id: 'tmpl-promo-30day-exclusive',
    name: '💰 30-Day Exclusive Countdown Promotion Pass',
    category: 'promotions',
    categoryLabel: 'Promotions',
    subject: '🔥 Limited Offer: 30 Days Left! Get Your Premium Pass at 30% Off Today',
    preheader: 'The ultimate built environment gathering is exactly 30 days away. Claim your exclusive discount code.',
    description: 'A premium 30-day broadcast countdown campaign layout with pricing tiers to maximize conversions.',
    thumbnailIcon: 'Gift',
    badge: '30-DAY countdown',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON EXPO ABUJA • 30-DAY COUNTDOWN',
        subtitle: '8th Real Estate & Construction Expo • Oct 29–31, 2026',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: '30 Days Left: Save 30% on Premium passes!',
        subtitle: 'The Gavel Falls in 30 Days • Secure Your Seat Among Industry Leaders',
        content: 'Dear {name},\n\nWe are officially 30 days away from RECON Expo 2026! As the clock counts down, premium developer stands and Elite VIP delegate passes are selling out rapidly.\n\nTo mark this 30-day milestone, we are offering an exclusive 30% discount to our VIP newsletter subscribers for the next 48 hours. Use code RECON30OFF to save instantly.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'pricing_table',
        title: 'PROMOTIONAL DELEGATE RATES',
        items: [
          { title: '🎟️ General Access Pass', description: 'Access to Exhibition Floor, Tech Stage, and General Sessions.', tag: '₦10,000' },
          { title: '👑 Elite VIP Guest Pass', description: 'Fast-track access, private lounge, delegate bag, lunch, and cocktail reception.', tag: '₦17,500' }
        ]
      },
      {
        id: 'b4',
        type: 'button',
        buttonText: 'Claim Your 30% Promo Pass',
        buttonUrl: 'https://reconexpo.afrinetgroup.com/register',
        align: 'center',
        bgColor: '#d4af37',
        textColor: '#012a20'
      },
      {
        id: 'b5',
        type: 'footer'
      }
    ]
  },
  // 35. Executive B2B Networking Dinner & Investor Matchmaking
  {
    id: 'tmpl-activity-b2b-networking',
    name: '🤝 Executive B2B Networking Dinner & Matchmaking',
    category: 'schedule',
    categoryLabel: 'Event Activities',
    subject: '🤝 Invitation: Executive B2B Networking Dinner & Private Investor Matchmaking',
    preheader: 'Connect with institutional investors, venture capitalists, and premium property developers in Abuja.',
    description: 'Official invitation template for the exclusive executive matchmaking dinner.',
    thumbnailIcon: 'Briefcase',
    badge: 'NETWORKING',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON 2026 EXECUTIVE MATCHMAKING',
        subtitle: 'High-Value Property Syndications & Private Deal Room',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'An Evening of Elite Property & Finance Networking',
        subtitle: 'Thursday, October 29 • 07:00 PM • Capital Suite, Yar\'Adua Centre',
        content: 'Dear {name},\n\nUnlock high-value corporate connections at the official RECON Expo 2026 Executive Matchmaking Dinner.\n\nJoin 120+ verified real estate executives, development directors, policy makers, and private equity managers for a closed-door networking reception designed to facilitate joint ventures, land acquisitions, and project financing.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'schedule_box',
        title: 'DINNER AGENDA & PRIVILEGES',
        items: [
          { title: '🍷 07:00 PM: Welcome Cocktail & Icebreaker', description: 'Premium wine tasting paired with light Hors d’oeuvres in the courtyard.' },
          { title: '🎙️ 07:45 PM: Executive Fireside Chat', description: 'Brief briefing on West Africa’s construction financing outlook for 2027.' },
          { title: '🍽️ 08:15 PM: Multi-Course Networking Dinner', description: 'Pre-matched seating arrangements based on investment profiles.' }
        ]
      },
      {
        id: 'b4',
        type: 'button',
        buttonText: 'Request VIP Matchmaking Invite',
        buttonUrl: 'https://reconexpo.afrinetgroup.com/networking-dinner',
        align: 'center',
        bgColor: '#d4af37',
        textColor: '#012a20'
      },
      {
        id: 'b5',
        type: 'footer'
      }
    ]
  },
  // 36. ESG & Sustainable Green Building Technical Workshop
  {
    id: 'tmpl-activity-esg-masterclass',
    name: '🌱 ESG & Sustainable Green Building Technical Workshop',
    category: 'schedule',
    categoryLabel: 'Event Activities',
    subject: '🌱 Technical Workshop: Mastering ESG & Eco-Friendly Green Building Materials',
    preheader: 'Earn recognized CPD technical training credits and explore sustainable architecture trends.',
    description: 'Educational event activity template focusing on green building, ESG standards, and carbon-smart materials.',
    thumbnailIcon: 'Leaf',
    badge: 'WORKSHOP',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON 2026 SUSTAINABILITY WORKSHOPS',
        subtitle: 'Green Architecture, Carbon-Smart Cement, and Solar Integration',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'ESG Mastery: Build Smart, Build Green, Save Millions',
        subtitle: 'Saturday, October 31 • 10:00 AM • Seminar Hall 3',
        content: 'Dear {name},\n\nAs energy prices rise and global capital increasingly favors carbon-smart developments, sustainable construction is no longer optional—it is a competitive necessity.\n\nParticipate in this technical masterclass to learn practical methods for deploying hybrid solar systems, sourcing locally-manufactured insulated wall systems, and certifying your building designs under international green building codes.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'features_2col',
        title: 'CPD CERTIFIED SESSIONS INCLUDE',
        items: [
          { title: '⚡ Gated Community Solar Grids', description: 'Learn how to model, finance, and deploy decentralized solar arrays.' },
          { title: '🧱 Eco-Friendly Insulated Prefabs', description: 'Explore fast-assembly modular panel materials that cut cooling costs by 40%.' },
          { title: '📜 Green Building Certifications', description: 'Step-by-step guide to EDGE and LEED rating registration in Nigeria.' }
        ]
      },
      {
        id: 'b4',
        type: 'button',
        buttonText: 'Reserve Your Technical Workshop Seat',
        buttonUrl: 'https://reconexpo.afrinetgroup.com/green-workshop',
        align: 'center',
        bgColor: '#10b981',
        textColor: '#ffffff'
      },
      {
        id: 'b5',
        type: 'footer'
      }
    ]
  },
  // 37. PropTech & Smart Infrastructure Summit Panel Discussion
  {
    id: 'tmpl-activity-proptech-panel',
    name: '💡 PropTech & Smart Infrastructure Panel Discussion',
    category: 'announcements',
    categoryLabel: 'Event Activities',
    subject: '💡 Panel Unveiled: PropTech & Smart Infrastructure Revolution in Africa',
    preheader: 'How AI, IoT, and digital title management are transforming the property market.',
    description: 'Promotional activity template highlighting PropTech panels, smart infrastructure, and IoT grids.',
    thumbnailIcon: 'Cpu',
    badge: 'EXECUTIVE PANEL',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON 2026 PROPTECH EXECUTIVE SUMMIT',
        subtitle: 'AI Estimation, Smart Meter Grids, and Gated Communities',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'Unlocking High-Yield Efficiency with PropTech Innovations',
        subtitle: 'Friday, October 30 • 11:30 AM • Main Auditorium A',
        content: 'Dear {name},\n\nTechnology is revolutionizing property management, land titles, and building automation across Africa.\n\nOur executive panel brings together leading PropTech founders, real estate managers, and system engineers to discuss practical integrations of smart meters, automated access gates, and automated cost sheets.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'speaker_grid',
        title: 'PROPTECH PANELISTS LIST',
        items: [
          { title: 'Engr. Kolawole Balogun', description: 'Chairman, Momas Electricity Meters Manufacturing Company Ltd (MEMMCOL)', tag: 'Smart Grids' },
          { title: 'Chioma Obi, PhD', description: 'Head of Smart Cities Innovation, African Digital Infrastructure Lab', tag: 'IoT Gates' },
          { title: 'Alhaji Ibrahim Danladi', description: 'Co-Founder & Chief Product Officer, LandTrust Blockchain Protocol', tag: 'Land Records' }
        ]
      },
      {
        id: 'b4',
        type: 'button',
        buttonText: 'Add Panel to Calendar',
        buttonUrl: 'https://reconexpo.afrinetgroup.com/proptech-panel',
        align: 'center',
        bgColor: '#d4af37',
        textColor: '#012a20'
      },
      {
        id: 'b5',
        type: 'footer'
      }
    ]
  },
  // 38. Drip Nurture Campaign Series Starter
  {
    id: 'tmpl-drip-nurture-series',
    name: '🔄 Multi-Day Drip & Nurture Campaign Series Starter',
    category: 'drip_nurture',
    categoryLabel: 'Drip Nurture',
    subject: '🔄 The Smart Builder’s Weekly Digest: Insights & Exclusive Updates',
    preheader: 'Your weekly blueprint of real estate developments, materials supply, and capital financing.',
    description: 'An editable multi-block newsletter template tailored for long-term subscriber list drip nurture sequences.',
    thumbnailIcon: 'GitFork',
    badge: 'DRIP SERIES',
    blocks: [
      {
        id: 'b1',
        type: 'header',
        title: 'RECON EXPO DRIP NURTURE SERIES',
        subtitle: 'Weekly Construction Insights & Property Intel',
        bgColor: '#012a20',
        textColor: '#d4af37'
      },
      {
        id: 'b2',
        type: 'hero',
        title: 'Building for the Future: Maximizing ROI on Real Estate Developments',
        subtitle: 'Issue No. 12 • Smart Developer Insights Series',
        content: 'Dear {name},\n\nNurturing a lead from curiosity to commitment is the foundation of high-performing real estate development. In this week’s digest, we analyze how smart developers leverage construction technologies to de-risk projects, secure off-plan buyers, and access competitive housing finance models.',
        align: 'left'
      },
      {
        id: 'b3',
        type: 'features_2col',
        title: 'WEEKLY DEVELOPMENT CORNER',
        items: [
          { title: '📈 De-risking Capital Projects', description: 'Analyze why phased development models outperform massive speculative builds in high-inflation environments.' },
          { title: '🚪 Smart Amenities Buyers Crave', description: 'Studies show automated security access and hybrid power back-ups increase off-plan sales velocity by 35%.' }
        ]
      },
      {
        id: 'b4',
        type: 'button',
        buttonText: 'Access Free Developer Resource Center',
        buttonUrl: 'https://reconexpo.afrinetgroup.com/resources',
        align: 'center',
        bgColor: '#1e3a8a',
        textColor: '#ffffff'
      },
      {
        id: 'b5',
        type: 'footer'
      }
    ]
  }
];

export const DEFAULT_30_DAY_SEQUENCE: EmailAutomationSequence = {
  id: 'recon-30-day-master-drip',
  name: 'RECON 2026 Master 30-Day Attendee & VIP Follow-up Automation',
  description: 'Automated 12-step follow-up and nurture journey delivered over 30 days to every registered delegate, exhibitor, and attendee to ensure 100% summit attendance and VIP engagement.',
  isActive: true,
  autoEnrollNewRegistrations: true,
  totalEnrolled: 148,
  totalDelivered: 894,
  steps: [
    {
      id: 'step-d0',
      day: 0,
      title: 'Day 0 (Immediate): Official Ticket & Digital QR Pass',
      subtitle: 'Dispatched immediately upon successful registration',
      targetAudience: 'all',
      enabled: true,
      templateId: 'tmpl-vip-welcome',
      subject: '🎟️ Official Digital Pass & Registration Confirmation: RECON Expo 2026',
      preheader: 'Your fast-track entry barcode and delegate ticket number #{ticket}.',
      bodyPreview: 'Welcome {name}! Your registration for RECON 2026 in Abuja is confirmed. Keep your digital badge accessible for contact-free entry.',
      lastSentCount: 148
    },
    {
      id: 'step-d1',
      day: 1,
      title: 'Day 1: Welcome & 30-Day Summit Orientation',
      subtitle: 'Introduction to summit ecosystem, app download, and logistics',
      targetAudience: 'all',
      enabled: true,
      templateId: 'tmpl-drip-day1',
      subject: '🌟 RECON 2026: Welcome to the 30-Day Countdown & Executive Onboarding',
      preheader: 'Here is what to expect over the next 30 days leading up to the summit in Abuja.',
      bodyPreview: 'Dear {name}, thank you for registering! Here is your 30-day preparation guide for RECON Expo 2026 at Yar\'Adua Centre.',
      lastSentCount: 142
    },
    {
      id: 'step-d2',
      day: 2,
      title: 'Day 2: Headline Keynote Speakers & Faculty Unveiling',
      subtitle: 'Ministerial faculty, housing authority chiefs, and top developers',
      targetAudience: 'all',
      enabled: true,
      templateId: 'tmpl-keynote-speakers',
      subject: '📢 Keynote Lineup Announced: Ministers, Developers & Industry Titans at RECON 2026',
      preheader: 'Hear from the Honourable Minister of Housing, FMBN chiefs, and REDAN leadership.',
      bodyPreview: 'Dear {name}, explore the high-profile speakers leading our 20+ plenary and technical sessions.',
      lastSentCount: 139
    },
    {
      id: 'step-d3',
      day: 3,
      title: 'Day 3: B2B Matchmaking & 1-on-1 Deal Room Setup',
      subtitle: 'Enable profile for private investor matchmaking and meetings',
      targetAudience: 'all',
      enabled: true,
      templateId: 'tmpl-b2b-matchmaking',
      subject: '🤝 Book 1-on-1 Executive B2B Meetings with Investors & Developers at RECON 2026',
      preheader: 'Pre-schedule dedicated 15-minute deal room sessions with institutional buyers.',
      bodyPreview: 'Pre-book your 1-on-1 meetings in the Executive Deal Lounge with over 80 verified developers and financiers.',
      lastSentCount: 135
    },
    {
      id: 'step-d5',
      day: 5,
      title: 'Day 5: Exhibition Floorplan & Booth Directory Preview',
      subtitle: 'Navigate 150+ exhibiting brands in Halls A, B & Outdoor Pavilion',
      targetAudience: 'all',
      enabled: true,
      templateId: 'tmpl-luxury-realestate',
      subject: '🏢 Exhibition Floorplan Live: 150+ Brands, Smart Homes & Machinery Demos',
      preheader: 'Preview the interactive floorplan and bookmark your favorite stands.',
      bodyPreview: 'Browse over 150 exhibiting companies showcasing luxury housing, building materials, and smart technology.',
      lastSentCount: 128
    },
    {
      id: 'step-d7',
      day: 7,
      title: 'Day 7: Hotel Discounts, Flights & Abuja Travel Guide',
      subtitle: 'Up to 35% discount codes for Transcorp Hilton & Fraser Suites',
      targetAudience: 'all',
      enabled: true,
      templateId: 'tmpl-hotel-travel',
      subject: '🏨 Exclusive RECON Delegate Hotel Discounts & Abuja Travel Logistics',
      preheader: 'Save up to 35% on partner hotels in Abuja CBD with your delegate code.',
      bodyPreview: 'Special accommodation rates negotiated for delegates within 5 minutes of the Yar\'Adua Centre venue.',
      lastSentCount: 120
    },
    {
      id: 'step-d10',
      day: 10,
      title: 'Day 10: Construction Tech & Innovation Showcase',
      subtitle: 'Heavy machinery, pre-fab modular building, and green cement',
      targetAudience: 'all',
      enabled: true,
      templateId: 'tmpl-drip-day10',
      subject: '🚀 RECON 2026 [Day 10 Drip]: 5 Mega Trends Transforming Nigerian Real Estate',
      preheader: 'PropTech, alternative building materials, and mortgage innovations ahead of RECON 2026.',
      bodyPreview: 'Dive into the macro trends shaping the built environment and see what machinery will be demoed live.',
      lastSentCount: 114
    },
    {
      id: 'step-d14',
      day: 14,
      title: 'Day 14: Mid-Point Masterclasses & CPD Training Booking',
      subtitle: 'Earn recognized Continuing Professional Development points',
      targetAudience: 'all',
      enabled: true,
      templateId: 'tmpl-masterclass-cpd',
      subject: '🎓 Earn CPD Points: Executive Masterclasses in Real Estate & Engineering at RECON 2026',
      preheader: 'Certified training modules for architects, civil engineers, and project managers.',
      bodyPreview: 'Reserve your seat for certified FIDIC contracts, BIM workflows, and green building masterclasses.',
      lastSentCount: 98
    },
    {
      id: 'step-d18',
      day: 18,
      title: 'Day 18: Sponsor Showcase & Deal Room Opportunities',
      subtitle: 'Private equity deals and high-yield real estate syndications',
      targetAudience: 'all',
      enabled: true,
      templateId: 'tmpl-investor-showcase',
      subject: '💼 High-Yield Real Estate Syndications & Sponsorship at RECON 2026',
      preheader: 'Discover high-yield property investment portfolios and developer syndications.',
      bodyPreview: 'Connect with institutional capital and explore prime off-plan residential developments.',
      lastSentCount: 88
    },
    {
      id: 'step-d21',
      day: 21,
      title: 'Day 21: Official Mobile App & Digital Badge Sync',
      subtitle: 'Download app on iOS / Android for live floorplan & QR scanner',
      targetAudience: 'all',
      enabled: true,
      templateId: 'tmpl-mobile-app',
      subject: '📱 Download the Official RECON Expo 2026 Mobile App & Sync Your Digital Badge',
      preheader: 'Access live floorplans, instant QR badge scanner, 1-on-1 attendee messaging.',
      bodyPreview: 'Download the app to build your custom schedule, message attendees, and collect exhibitor cards.',
      lastSentCount: 82
    },
    {
      id: 'step-d25',
      day: 25,
      title: 'Day 25: 5-Day Final Countdown & Awards Gala Invitation',
      subtitle: 'Africa Property Leadership & Excellence Awards Gala Night',
      targetAudience: 'all',
      enabled: true,
      templateId: 'tmpl-awards-gala',
      subject: '🏆 5 Days to Go: Invitation to RECON Africa Property Leadership Awards Gala',
      preheader: 'Join industry titans for an exclusive black-tie gala dinner on Saturday, Oct 31.',
      bodyPreview: 'Reserve your seat or table for the prestigious Africa Property Leadership Awards Gala Night.',
      lastSentCount: 75
    },
    {
      id: 'step-d28',
      day: 28,
      title: 'Day 28: 48-Hour Fast-Track Gate Pass & Arrival Briefing',
      subtitle: 'Fast-track barcode, security gates, parking, and daily schedule',
      targetAudience: 'all',
      enabled: true,
      templateId: 'tmpl-48h-countdown',
      subject: '🚨 48 Hours to RECON Expo 2026: Fast-Track Gate Access & Final Checklist',
      preheader: 'Everything you need for Day 1: Entrance gates, parking, badges, and keynote times.',
      bodyPreview: 'Final briefing: Doors open at 08:30 AM at Yar\'Adua Centre. Have your digital barcode #{ticket} ready for fast-track entry.',
      lastSentCount: 70
    },
    {
      id: 'step-d30',
      day: 30,
      title: 'Day 30: Day 1 Summit Kickoff & Live Schedule Guide',
      subtitle: 'Live session notifications, floor coordination, and networking lounge',
      targetAudience: 'all',
      enabled: true,
      templateId: 'tmpl-programme-schedule',
      subject: '🚀 RECON Expo 2026 is LIVE: Today’s Keynote Schedule & Gate Pass',
      preheader: 'Opening Ceremony starts at 09:30 AM in the Main Auditorium.',
      bodyPreview: 'We are live in Abuja! Head to Hall A for the Opening Plenary and visit 150+ stands across the venue.',
      lastSentCount: 65
    },
    {
      id: 'step-d31',
      day: 31,
      title: 'Day 31+: Post-Expo Slides, Verified Certificate & Photo Gallery',
      subtitle: 'Download presentation slides, verified CPD certificate, and photos',
      targetAudience: 'all',
      enabled: true,
      templateId: 'tmpl-certificate-attendance',
      subject: '🎖️ RECON 2026 Summary: Your Verified Certificate of Attendance & Slide Decks',
      preheader: 'Download your official CPD certificate, presentation slides, and photo album.',
      bodyPreview: 'Thank you for attending RECON 2026! Access your official verified certificate, speaker slide decks, and photo album.',
      lastSentCount: 60
    }
  ]
};
