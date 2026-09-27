export interface EmailTemplateBlock {
  id: string;
  type: 'header' | 'hero' | 'heading' | 'text' | 'pass_badge' | 'button' | 'feature_grid' | 'countdown' | 'speaker_card' | 'divider' | 'social_footer' | 'disclaimer';
  content: Record<string, any>;
}

export interface EmailTemplate {
  id: string;
  name: string;
  category: 'tickets_passes' | 'event_programme' | 'sponsorship_sales' | 'newsletters' | 'followup_nurture' | 'announcements_alerts';
  categoryLabel: string;
  subject: string;
  preheader: string;
  description: string;
  thumbnailUrl: string;
  tags: string[];
  blocks: EmailTemplateBlock[];
  htmlContent?: string;
}

export const EMAIL_TEMPLATES_25_PLUS: EmailTemplate[] = [
  // =========================================================================
  // CATEGORY 1: TICKETS, PASSES & ACCREDITATION (5 Templates)
  // =========================================================================
  {
    id: 'tmpl_vip_pass_confirmed',
    name: '👑 Elite VIP Executive Pass Confirmation',
    category: 'tickets_passes',
    categoryLabel: 'Tickets & Passes',
    subject: '👑 Your VIP Executive Pass & Fast-Track Access: {name} [RECON 2026]',
    preheader: 'Your official VIP credential, reserved plenary seating and gala dinner access are confirmed.',
    description: 'Executive VIP pass confirmation featuring personalized digital badge with gate scan QR code, benefits list and Yar\'Adua Centre navigation.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
    tags: ['VIP', 'Ticket', 'Badge', 'QR Code', 'Clearance'],
    blocks: [
      { id: 'b1', type: 'header', content: { tagline: '🏛️ 8TH REAL ESTATE & CONSTRUCTION EXPO', title: 'RECON EXPO ABUJA', subtitle: 'Oct 29–31, 2026 • Yar\'Adua Centre' } },
      { id: 'b2', type: 'heading', content: { title: 'VIP Executive Clearance Approved', subtitle: 'Welcome to the Premier Gathering of Built-Environment Decision Makers' } },
      { id: 'b3', type: 'pass_badge', content: { tierName: 'ELITE VIP PASS', ticketNumber: '{ticket}', attendeeName: '{name}', organization: '{organization}' } },
      { id: 'b4', type: 'text', content: { text: 'Your executive credentials entitle you to Priority Red-Carpet Gate Entry, Reserved Plenary Front-Row Seating, Access to the Private B2B Deal Room, and the Executive Gala Awards Dinner.' } },
      { id: 'b5', type: 'button', content: { buttonText: 'View & Download Smart ID Card', buttonUrl: 'https://www.afrinetgroup.com' } },
      { id: 'b6', type: 'social_footer', content: { showHotlines: true, showVenue: true } }
    ]
  },
  {
    id: 'tmpl_free_visitor_badge',
    name: '🎟️ Standard Visitor Free Expo Pass',
    category: 'tickets_passes',
    categoryLabel: 'Tickets & Passes',
    subject: '🎟️ Free Expo Access Pass Confirmed: {name} [Ticket: {ticket}]',
    preheader: 'Present your QR code at the registration desk for instant badge printing.',
    description: 'Clean visitor registration confirmation email with barcode/QR code pass and exhibition floor guide.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
    tags: ['Visitor', 'Free Pass', 'Fast Track', 'QR Code'],
    blocks: [
      { id: 'b1', type: 'header', content: { tagline: '🎟️ ACCREDITED EXPO VISITOR PASS', title: 'RECON EXPO ABUJA 2026', subtitle: '3 Full Days of Construction & Housing Innovation' } },
      { id: 'b2', type: 'pass_badge', content: { tierName: 'VISITOR PASS (FREE)', ticketNumber: '{ticket}', attendeeName: '{name}', organization: '{organization}' } },
      { id: 'b3', type: 'text', content: { text: 'Thank you for registering. You have complimentary access to 150+ Exhibition Booths, Daily PropTech Masterclasses, and the Main Plenary Hall.' } },
      { id: 'b4', type: 'button', content: { buttonText: 'Download Pass & Floor Plan', buttonUrl: 'https://www.afrinetgroup.com' } }
    ]
  },
  {
    id: 'tmpl_exhibitor_staff_badge',
    name: '🎪 Exhibitor Stand & Booth Staff Pass',
    category: 'tickets_passes',
    categoryLabel: 'Tickets & Passes',
    subject: '🎪 Official Exhibitor Badge & Booth Stand Allocation: {organization}',
    preheader: 'Your booth credentials, build-up schedule, and loading dock vehicle permits are ready.',
    description: 'Dedicated exhibitor accreditation pass with booth stand number, staff badge count, loading dock instructions, and electricity guidelines.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    tags: ['Exhibitor', 'Booth', 'Stand Staff', 'Logistics'],
    blocks: [
      { id: 'b1', type: 'header', content: { tagline: '🎪 ACCREDITED EXPO EXHIBITOR', title: 'EXHIBITOR PASS & BOOTH CLEARANCE', subtitle: 'Shehu Musa Yar\'Adua Centre, Abuja' } },
      { id: 'b2', type: 'heading', content: { title: 'Booth Stand Build-Up Clearance', subtitle: 'Stand Allocation Confirmed for {organization}' } },
      { id: 'b3', type: 'text', content: { text: 'Stand setup commences Wednesday, October 28th at 08:00 AM. Please ensure all booth staff carry their official badges for seamless hall entry.' } },
      { id: 'b4', type: 'button', content: { buttonText: 'Manage Company Staff Badges', buttonUrl: 'https://www.afrinetgroup.com' } }
    ]
  },
  {
    id: 'tmpl_press_media_pass',
    name: '📸 Press & Media Accreditation Pass',
    category: 'tickets_passes',
    categoryLabel: 'Tickets & Passes',
    subject: '📸 Official Press & Media Accreditation: RECON Expo 2026',
    preheader: 'Press Center access, camera clearance, and ministerial interview slots allocated.',
    description: 'Accreditation pass for journalists, TV crews, and photojournalists with media center protocols and press conference schedules.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=600&q=80',
    tags: ['Press', 'Media', 'Journalist', 'Press Center'],
    blocks: [
      { id: 'b1', type: 'header', content: { tagline: '📰 OFFICIAL PRESS ACCREDITATION', title: 'MEDIA PASS & CLEARANCE', subtitle: 'RECON 2026 Press Secretariat' } },
      { id: 'b2', type: 'heading', content: { title: 'Accredited Media Representative', subtitle: 'Official Access to Plenary Press Row & Ministerial Press Briefings' } },
      { id: 'b3', type: 'text', content: { text: 'You are accredited for live broadcasting, plenary coverage, and exclusive executive interviews at the Yar\'Adua Centre Media Hub.' } }
    ]
  },
  {
    id: 'tmpl_speaker_chair_briefing',
    name: '🎙️ Keynote Speaker & Panel Chair Briefing',
    category: 'tickets_passes',
    categoryLabel: 'Tickets & Passes',
    subject: '🎙️ Keynote Speaker Briefing & Green Room Access: {name}',
    preheader: 'Your session schedule, stage AV technical specs, and Green Room protocol.',
    description: 'Distinguished speaker briefing template containing session time, panel co-chairs, microphone specs, presentation slide upload link, and VIP protocol.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80',
    tags: ['Speaker', 'Keynote', 'Panel', 'Green Room'],
    blocks: [
      { id: 'b1', type: 'header', content: { tagline: '🎙️ DISTINGUISHED SPEAKER PROTOCOL', title: 'RECON 2026 KEYNOTE BRIEFING', subtitle: 'Yar\'Adua Centre Plenary Auditorium' } },
      { id: 'b2', type: 'heading', content: { title: 'Session Details & Speaker Protocol', subtitle: 'Plenary Presentation & Panel Discussion Briefing' } },
      { id: 'b3', type: 'text', content: { text: 'We are honored to have you chair this critical session. Please arrive at the VIP Green Room 30 minutes prior to session commencement.' } }
    ]
  },

  // =========================================================================
  // CATEGORY 2: EVENT & PROGRAMME SCHEDULE (4 Templates)
  // =========================================================================
  {
    id: 'tmpl_3day_programme_schedule',
    name: '📅 3-Day Complete Programme Schedule',
    category: 'event_programme',
    categoryLabel: 'Event & Programme',
    subject: '📅 Official 3-Day Programme Schedule: RECON Expo 2026 (Abuja)',
    preheader: 'Explore daily ministerial keynotes, proptech masterclasses, and B2B deal rooms.',
    description: 'Comprehensive day-by-day itinerary breakdown with session timings, hall allocations, and keynote highlights.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80',
    tags: ['Schedule', 'Programme', 'Agenda', 'Sessions'],
    blocks: [
      { id: 'b1', type: 'header', content: { tagline: '🏛️ OFFICIAL PROGRAMME ITINERARY', title: 'RECON 2026 SUMMIT AGENDA', subtitle: 'October 29, 30 & 31, 2026' } },
      { id: 'b2', type: 'heading', content: { title: '3 Days of Transformative Housing Dialogues', subtitle: 'From PropTech Innovation to Mortgage Financing' } },
      { id: 'b3', type: 'text', content: { text: 'Day 1: Housing Deficit & Infrastructure Finance\nDay 2: Sustainable Green Building & PropTech Masterclasses\nDay 3: Diaspora Real Estate Investment & Awards Gala' } },
      { id: 'b4', type: 'button', content: { buttonText: 'Download Full PDF Programme', buttonUrl: 'https://www.afrinetgroup.com' } }
    ]
  },
  {
    id: 'tmpl_keynote_speakers_unveiled',
    name: '✨ Keynote Speakers & Panellists Unveiled',
    category: 'event_programme',
    categoryLabel: 'Event & Programme',
    subject: '✨ Keynote Speakers Announced: Ministers, Developers & Mortgage CEOs',
    preheader: 'Meet the 24+ industry titans shaping Africa’s built environment in 2026.',
    description: 'Visual showcase of headline keynote speakers with headshot portraits, titles, and discussion themes.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80',
    tags: ['Speakers', 'Keynote', 'Leaders', 'PropTech'],
    blocks: [
      { id: 'b1', type: 'header', content: { tagline: '🎙️ SPEAKER SPOTLIGHT', title: 'MEET THE RECON 2026 KEYNOTES', subtitle: 'Ministers, CEOs, Archs & Industry Titans' } },
      { id: 'b2', type: 'heading', content: { title: 'Leading Voices in Housing & Construction', subtitle: 'Insights from 24+ Headline Chairs' } }
    ]
  },
  {
    id: 'tmpl_masterclass_workshops',
    name: '💡 Certified Masterclass & CPD Workshops',
    category: 'event_programme',
    categoryLabel: 'Event & Programme',
    subject: '💡 Certified CPD Masterclasses & Hands-On Technical Workshops',
    preheader: 'Earn certified Professional Development units in Green Building & BIM.',
    description: 'Technical workshop invitations with CPD credits for architects, engineers, surveyors, and project managers.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80',
    tags: ['Masterclass', 'CPD', 'Workshops', 'Training'],
    blocks: [
      { id: 'b1', type: 'header', content: { tagline: '🎓 CONTINUING PROFESSIONAL DEVELOPMENT', title: 'CERTIFIED MASTERCLASSES', subtitle: 'NIA, NSE & ESVARBON Accredited' } },
      { id: 'b2', type: 'text', content: { text: 'Join certified technical sessions covering Building Information Modeling (BIM), Carbon-Neutral Concrete, and Real Estate Tokenization.' } }
    ]
  },
  {
    id: 'tmpl_floor_plan_booth_map',
    name: '🗺️ Interactive Floor Plan & Exhibition Booth Map',
    category: 'event_programme',
    categoryLabel: 'Event & Programme',
    subject: '🗺️ Exhibition Hall Floor Plan & Interactive Booth Directory',
    preheader: 'Navigate 150+ stands, plenary auditoriums, and executive VIP deal lounges.',
    description: 'Detailed expo layout guide highlighting main entrance, VIP deal rooms, food court, masterclass suites, and sponsor pavilions.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    tags: ['Floor Plan', 'Map', 'Booths', 'Halls'],
    blocks: [
      { id: 'b1', type: 'header', content: { tagline: '🗺️ VENUE NAVIGATION GUIDE', title: 'EXHIBITION FLOOR PLAN', subtitle: 'Yar\'Adua Centre Complex' } }
    ]
  },

  // =========================================================================
  // CATEGORY 3: SPONSORSHIP, SALES & PROMOTIONS (5 Templates)
  // =========================================================================
  {
    id: 'tmpl_sponsorship_prospectus',
    name: '💎 Corporate Sponsorship Prospectus & Packages',
    category: 'sponsorship_sales',
    categoryLabel: 'Sponsorship & Sales',
    subject: '💎 Position Your Brand at RECON 2026: Headline & Platinum Sponsorships',
    preheader: 'Reach 10,000+ verified investors, developers, and government dignitaries.',
    description: 'High-converting corporate sponsorship pitch deck summarizing ROI, brand exposure metrics, and VIP hospitality perks.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
    tags: ['Sponsorship', 'Corporate', 'Platinum', 'ROI'],
    blocks: [
      { id: 'b1', type: 'header', content: { tagline: '💎 CORPORATE BRAND ELEVATION', title: 'RECON 2026 SPONSORSHIP', subtitle: 'Headline, Platinum & Category Partnerships' } },
      { id: 'b2', type: 'heading', content: { title: 'Maximize Your Market Authority', subtitle: 'Direct Access to ₦50B+ in Procurement & Development Deals' } },
      { id: 'b3', type: 'button', content: { buttonText: 'Download Sponsorship Brochure', buttonUrl: 'https://www.afrinetgroup.com' } }
    ]
  },
  {
    id: 'tmpl_booth_stand_booking',
    name: '🏬 Booth Stand Booking & Space Reservation',
    category: 'sponsorship_sales',
    categoryLabel: 'Sponsorship & Sales',
    subject: '🏬 Secure Your Exhibition Booth Stand: Only 18 Premium Spaces Left!',
    preheader: 'Showcase your real estate projects and construction technologies directly to buyers.',
    description: 'Exhibition space reservation email featuring 9sqm, 12sqm, and 18sqm shell scheme package options and pricing.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
    tags: ['Booth Booking', 'Exhibitor', 'Stand', 'Space Reservation'],
    blocks: [
      { id: 'b1', type: 'header', content: { tagline: '🏬 PRIME STAND ALLOCATION', title: 'BOOK YOUR EXPO BOOTH', subtitle: 'Over 150+ Leading Brands Exhibiting' } }
    ]
  },
  {
    id: 'tmpl_early_bird_discount',
    name: '⚡ Early Bird Special Discount Offer (20% Off)',
    category: 'sponsorship_sales',
    categoryLabel: 'Sponsorship & Sales',
    subject: '⚡ Exclusive 20% Discount on Elite Passes & Exhibition Stands [Code: EARLY20]',
    preheader: 'Limited-time concession for certified developers and trade professionals.',
    description: 'Urgency-driven discount announcement featuring countdown timer and promo code for passes and stands.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80',
    tags: ['Discount', 'Promo Code', 'Early Bird', 'Sale'],
    blocks: [
      { id: 'b1', type: 'header', content: { tagline: '⚡ LIMITED TIME OFFER', title: '20% EARLY BIRD SAVINGS', subtitle: 'Use Promo Code: EARLY20' } }
    ]
  },
  {
    id: 'tmpl_gala_night_invitation',
    name: '🌟 Red-Carpet Gala Dinner & Excellence Awards',
    category: 'sponsorship_sales',
    categoryLabel: 'Sponsorship & Sales',
    subject: '🌟 Red-Carpet Gala Dinner & Built Environment Awards: Table Reservations',
    preheader: 'Celebrate outstanding architectural marvels and housing developers in Abuja.',
    description: 'Prestigious black-tie awards dinner invitation with table reservations, menu preview, and celebrity host announcements.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=600&q=80',
    tags: ['Gala Night', 'Awards', 'Red Carpet', 'Dinner'],
    blocks: [
      { id: 'b1', type: 'header', content: { tagline: '🏆 BUILT ENVIRONMENT EXCELLENCE', title: 'RECON AWARDS GALA NIGHT', subtitle: 'Grand Ballroom, Yar\'Adua Centre' } }
    ]
  },
  {
    id: 'tmpl_b2b_deal_room_invite',
    name: '🤝 Executive B2B Deal Room Matchmaking',
    category: 'sponsorship_sales',
    categoryLabel: 'Sponsorship & Sales',
    subject: '🤝 Matchmaking Invitation: Private Bilateral Deal Room Sessions',
    preheader: 'Pre-schedule 1-on-1 private meetings with institutional lenders and fund managers.',
    description: 'High-value invitation for developers and investors to book pre-matched 30-minute private deal room consultations.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80',
    tags: ['B2B', 'Deal Room', 'Investment', 'Matchmaking'],
    blocks: [
      { id: 'b1', type: 'header', content: { tagline: '🤝 BILATERAL CAPITAL MATCHMAKING', title: 'PRIVATE B2B DEAL ROOMS', subtitle: 'Pre-Schedule 1-on-1 Investor Meetings' } }
    ]
  },

  // =========================================================================
  // CATEGORY 4: NEWSLETTERS & MARKET BRIEFS (4 Templates)
  // =========================================================================
  {
    id: 'tmpl_monthly_market_newsletter',
    name: '📰 Monthly Housing Market Digest & PropTech Trends',
    category: 'newsletters',
    categoryLabel: 'Newsletters',
    subject: '📰 RECON Housing Digest: Market Trends, Land Titling & Green Building',
    preheader: 'Exclusive analysis on Abuja & Lagos property price dynamics and interest rates.',
    description: 'Editorial newsletter with featured articles, policy updates, construction material price indexes, and video links.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80',
    tags: ['Newsletter', 'Digest', 'PropTech', 'Analysis'],
    blocks: [
      { id: 'b1', type: 'header', content: { tagline: '📰 MONTHLY INDUSTRY INSIGHTS', title: 'RECON PROPERTY DIGEST', subtitle: 'Policy, Pricing & Capital Markets' } }
    ]
  },
  {
    id: 'tmpl_ministerial_policy_brief',
    name: '🏛️ National Housing Policy & Mortgage Reform Brief',
    category: 'newsletters',
    categoryLabel: 'Newsletters',
    subject: '🏛️ Policy Update: Federal Housing Strategy & Single-Digit Mortgages',
    preheader: 'New regulatory developments unveiled ahead of RECON Expo 2026.',
    description: 'Government policy briefing template summarizing ministerial directives, land registry reforms, and mortgage subsidies.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    tags: ['Policy', 'Government', 'Mortgage', 'Housing Reform'],
    blocks: [
      { id: 'b1', type: 'header', content: { tagline: '🏛️ SPECIAL POLICY BRIEFING', title: 'NATIONAL HOUSING REFORMS', subtitle: 'Federal Ministry of Housing Directives' } }
    ]
  },
  {
    id: 'tmpl_proptech_innovation_weekly',
    name: '🚀 PropTech Innovations & Digital Construction Weekly',
    category: 'newsletters',
    categoryLabel: 'Newsletters',
    subject: '🚀 PropTech Spotlight: 3D Concrete Printing & Blockchain Title Deeds',
    preheader: 'Discover the next wave of construction technology debuting at the expo.',
    description: 'Tech-focused newsletter highlighting smart building startups, AI construction estimators, and renewable micro-grids.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    tags: ['PropTech', 'Innovation', 'AI', 'Smart Cities'],
    blocks: [
      { id: 'b1', type: 'header', content: { tagline: '🚀 DISRUPTIVE TECHNOLOGIES', title: 'PROPTECH WEEKLY', subtitle: 'Smart Cities & Clean Construction' } }
    ]
  },
  {
    id: 'tmpl_diaspora_investor_report',
    name: '🌍 Diaspora Real Estate & Foreign Investor Outlook',
    category: 'newsletters',
    categoryLabel: 'Newsletters',
    subject: '🌍 Diaspora Property Investor Guide: High-Yield Residential & Commercial Hubs',
    preheader: 'Verified developers and escrow-backed property investments in Nigeria.',
    description: 'Targeted newsletter for international and diaspora buyers explaining secure title verification, escrow protections, and rental yields.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    tags: ['Diaspora', 'Foreign Investors', 'High Yield', 'Escrow'],
    blocks: [
      { id: 'b1', type: 'header', content: { tagline: '🌍 GLOBAL DIASPORA DESK', title: 'DIASPORA INVESTOR INSIGHTS', subtitle: 'Secure, Escrow-Backed Property Acquisition' } }
    ]
  },

  // =========================================================================
  // CATEGORY 5: 30-DAY NURTURE & FOLLOW-UP AUTOMATIONS (4 Templates)
  // =========================================================================
  {
    id: 'tmpl_nurture_welcome_day1',
    name: '👋 Day 1 Nurture: Welcome & Expo Survival Guide',
    category: 'followup_nurture',
    categoryLabel: '30-Day Nurture',
    subject: '👋 Welcome to RECON 2026: Your Official Survival Guide & Map [Day 1]',
    preheader: 'How to make the most of your 3 days at the Yar\'Adua Centre.',
    description: 'Part of the 30-day automated sequence: Introduces event timings, parking, shuttle services, and networking etiquette.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
    tags: ['Nurture', 'Day 1', 'Guide', 'Welcome'],
    blocks: [
      { id: 'b1', type: 'header', content: { tagline: '📚 DELEGATE ONBOARDING SERIES', title: 'EXPO SURVIVAL GUIDE', subtitle: 'Step 1 of 30-Day Nurture Sequence' } }
    ]
  },
  {
    id: 'tmpl_nurture_countdown_7days',
    name: '⏳ 7 Days Countdown: Final Badge Printing Alert',
    category: 'followup_nurture',
    categoryLabel: '30-Day Nurture',
    subject: '⏳ 7 Days to Go! Your Fast-Track Entry QR Code is Ready: {name}',
    preheader: 'Avoid queue delays at the gate by downloading your smart digital pass.',
    description: 'Automated 7-day countdown email prompting delegates to confirm attendance and save their QR badge to Apple Wallet / Phone.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80',
    tags: ['Countdown', '7 Days', 'Fast Track', 'Reminder'],
    blocks: [
      { id: 'b1', type: 'header', content: { tagline: '⏳ ONE WEEK COUNTDOWN', title: '7 DAYS TO RECON EXPO', subtitle: 'Gate Clearance & Badge Readiness' } }
    ]
  },
  {
    id: 'tmpl_nurture_24hour_reminder',
    name: '🚨 24-Hour Final Gate Pass & Parking Protocol',
    category: 'followup_nurture',
    categoryLabel: '30-Day Nurture',
    subject: '🚨 Doors Open Tomorrow at 08:30 AM! Final Gate Access Details: {ticket}',
    preheader: 'Shehu Musa Yar\'Adua Centre, Central Business District, Abuja.',
    description: 'Final 24-hour reminder email with gate opening times, VIP valet instructions, dress code, and emergency contact numbers.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
    tags: ['24h', 'Final Reminder', 'Doors Open', 'Gate Pass'],
    blocks: [
      { id: 'b1', type: 'header', content: { tagline: '🚨 FINAL GATE PASS DISPATCH', title: 'DOORS OPEN TOMORROW', subtitle: 'Shehu Musa Yar\'Adua Centre, Abuja' } }
    ]
  },
  {
    id: 'tmpl_nurture_post_event_certificate',
    name: '🎓 Post-Event: Certificate of Attendance & Presentation Slides',
    category: 'followup_nurture',
    categoryLabel: '30-Day Nurture',
    subject: '🎓 Thank You for Attending! Download Your Certificate & Plenary Slides',
    preheader: 'Access all keynote slide decks, photo galleries, and 2027 early bird registration.',
    description: 'Post-event gratitude email delivering personalized Certificate of Attendance (PDF), video replays, and feedback survey.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
    tags: ['Certificate', 'Slides', 'Post Event', 'Thank You'],
    blocks: [
      { id: 'b1', type: 'header', content: { tagline: '🎓 POST-EVENT PORTAL ACCESS', title: 'THANK YOU FOR ATTENDING', subtitle: 'Certificate & Session Resource Pack' } }
    ]
  },

  // =========================================================================
  // CATEGORY 6: TRANSACTIONAL & ANNOUNCEMENTS (4 Templates)
  // =========================================================================
  {
    id: 'tmpl_payment_success_receipt',
    name: '💳 Payment Verified & Official VAT Invoice',
    category: 'announcements_alerts',
    categoryLabel: 'Announcements & Alerts',
    subject: '💳 Official Payment Receipt & VAT Invoice: {name} [₦{amount}]',
    preheader: 'Flutterwave settlement confirmed. Your tax receipt and transaction reference.',
    description: 'Clear financial receipt template with itemized pass breakdown, VAT tax ID, transaction reference, and corporate billing details.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    tags: ['Receipt', 'Payment', 'Invoice', 'Flutterwave'],
    blocks: [
      { id: 'b1', type: 'header', content: { tagline: '💳 TRANSACTION SETTLEMENT', title: 'OFFICIAL PAYMENT RECEIPT', subtitle: 'RECON Expo 2026 Finance Secretariat' } }
    ]
  },
  {
    id: 'tmpl_venue_security_protocol',
    name: '🛡️ Venue Security & VIP Protocol Advisory',
    category: 'announcements_alerts',
    categoryLabel: 'Announcements & Alerts',
    subject: '🛡️ Important Security & Protocol Advisory for Yar\'Adua Centre Access',
    preheader: 'Security screening, valid ID requirements, and VIP escort procedures.',
    description: 'Official security advisory detailing screening checkpoints, prohibited items, biometric validation, and presidential motorcade protocols.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
    tags: ['Security', 'Protocol', 'Advisory', 'Venue'],
    blocks: [
      { id: 'b1', type: 'header', content: { tagline: '🛡️ PROTOCOL & SECURITY CLEARANCE', title: 'VENUE ENTRY ADVISORY', subtitle: 'Official Secretariat Security Protocol' } }
    ]
  },
  {
    id: 'tmpl_urgent_schedule_update',
    name: '⚠️ Urgent Programme & Plenary Schedule Adjustment',
    category: 'announcements_alerts',
    categoryLabel: 'Announcements & Alerts',
    subject: '⚠️ Important Notice: Programme Schedule & Plenary Hall Update',
    preheader: 'Please note the revised timing for tomorrow’s Ministerial Keynote session.',
    description: 'High-visibility alert template designed for urgent time adjustments, room changes, or weather/logistical advisories.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',
    tags: ['Alert', 'Urgent', 'Schedule Update', 'Notice'],
    blocks: [
      { id: 'b1', type: 'header', content: { tagline: '⚠️ OFFICIAL SECRETARIAT NOTICE', title: 'SCHEDULE UPDATE ADVISORY', subtitle: 'Revised Plenary Session Timetable' } }
    ]
  },
  {
    id: 'tmpl_marketer_commission_credited',
    name: '💵 Marketer Referral Commission Payout Alert',
    category: 'announcements_alerts',
    categoryLabel: 'Announcements & Alerts',
    subject: '💵 Referral Commission Credited! ₦{commission} Paid to Your Account',
    preheader: 'Your referral code generated a new verified registration payout.',
    description: 'Affiliate marketer notification celebrating new commission earnings, referral code performance stats, and direct bank settlement details.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80',
    tags: ['Marketer', 'Commission', 'Affiliate', 'Payout'],
    blocks: [
      { id: 'b1', type: 'header', content: { tagline: '💵 REFERRAL SYSTEM PAYOUT', title: 'COMMISSION CREDITED', subtitle: 'RECON Marketer Rewards Network' } }
    ]
  }
];
