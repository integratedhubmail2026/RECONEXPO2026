import React, { useState } from 'react';
import { useExpoData } from '../../context/ExpoDataContext';
import { SiteTexts } from '../../types';
import { 
  Type, 
  Save, 
  Sparkles, 
  Globe, 
  Layers, 
  Users, 
  Calendar, 
  Ticket, 
  Award, 
  DollarSign, 
  HelpCircle, 
  Footprints,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
  Sliders,
  Flame,
  Building,
  Eye
} from 'lucide-react';

interface SiteTextEditorTabProps {
  onShowToast?: (msg: string) => void;
}

export const SiteTextEditorTab: React.FC<SiteTextEditorTabProps> = ({ onShowToast }) => {
  const { expoDetails, updateExpoDetails } = useExpoData();
  const [activeSection, setActiveSection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Local state copy for siteTexts to allow smooth editing and one-click saving
  const [texts, setTexts] = useState<SiteTexts>(() => ({
    ...(expoDetails.siteTexts || {})
  }));

  const handleTextChange = (key: keyof SiteTexts, value: string) => {
    setTexts(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    updateExpoDetails({
      siteTexts: {
        ...(expoDetails.siteTexts || {}),
        ...texts
      }
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    if (onShowToast) {
      onShowToast("All home page texts updated and published live!");
    }
  };

  const sections = [
    {
      id: 'navbar',
      title: 'Navigation & Top Bar',
      icon: Globe,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10 border-sky-500/20',
      fields: [
        { key: 'announcementBanner', label: 'Top Announcement Banner Text', type: 'text', placeholder: 'Official 8th Real Estate & Construction Expo 2026 • Oct 15 - 17, 2026' },
        { key: 'navLogoText', label: 'Navigation Logo Label (Optional Override)', type: 'text', placeholder: 'RECON 2026' },
        { key: 'navRegisterBtn', label: 'Navigation Register Button Text', type: 'text', placeholder: 'REGISTER NOW' },
        { key: 'navDelegatePortalBtn', label: 'Navigation Delegate Portal Button Text', type: 'text', placeholder: 'DELEGATE PORTAL' }
      ]
    },
    {
      id: 'hero',
      title: 'Hero Section (Main Banner)',
      icon: Flame,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10 border-red-500/20',
      fields: [
        { key: 'heroTopBadge', label: 'Hero Top Live Badge', type: 'text', placeholder: 'AFRICA’S PREMIER REAL ESTATE & INFRASTRUCTURE SUMMIT • ABUJA 2026' },
        { key: 'heroCategory', label: 'Hero Category Sub-heading', type: 'text', placeholder: 'REAL ESTATE EXPO IN ABUJA, NIGERIA' },
        { key: 'heroThemeLabel', label: 'Hero Official Theme Label', type: 'text', placeholder: 'OFFICIAL EXPO THEME' },
        { key: 'heroOrganizerLabel', label: 'Organizer Attribution Prefix', type: 'text', placeholder: 'This Event Is Organized By:' },
        { key: 'heroOrganizerText', label: 'Organizer Organizations Text', type: 'textarea', placeholder: 'Afrinet Group and Afrinex West Africa in Collaboration with Abuja Chamber of Commerce and Industry(ACCI)' },
        { key: 'heroCountdownTitle', label: '24-Hour Countdown Timer Box Header', type: 'text', placeholder: '24-Hour VIP Registration & Discount Window' },
        { key: 'heroPrimaryCta', label: 'Hero Primary Action Button', type: 'text', placeholder: 'REGISTER NOW' },
        { key: 'heroSecondaryCta', label: 'Hero Secondary Action Button', type: 'text', placeholder: 'EXPLORE EXPO' },
        { key: 'heroEventInfoDateLabel', label: 'Event Info Card 1 (Date Label)', type: 'text', placeholder: 'Event Date' },
        { key: 'heroEventInfoDateSubtitle', label: 'Event Info Card 1 (Date Subtitle)', type: 'text', placeholder: '2 Full Days of Action' },
        { key: 'heroEventInfoLocationLabel', label: 'Event Info Card 2 (Location Label)', type: 'text', placeholder: 'Location' },
        { key: 'heroEventInfoTimeLabel', label: 'Event Info Card 3 (Time Label)', type: 'text', placeholder: 'Daily Timing' },
        { key: 'heroEventInfoTimeSubtitle', label: 'Event Info Card 3 (Time Subtitle)', type: 'text', placeholder: 'West Africa Time (WAT)' },
        { key: 'heroStat1Label', label: 'Stat Ribbon 1 Label', type: 'text', placeholder: 'Registered Attendees' },
        { key: 'heroStat2Label', label: 'Stat Ribbon 2 Label', type: 'text', placeholder: 'Industry Exhibitors' },
        { key: 'heroStat3Label', label: 'Stat Ribbon 3 Label', type: 'text', placeholder: 'Keynote Speakers' },
        { key: 'heroStat4Label', label: 'Stat Ribbon 4 Label', type: 'text', placeholder: 'Deals Pipeline' }
      ]
    },
    {
      id: 'sectors',
      title: 'Industry Sectors & Value Pillars',
      icon: Layers,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
      fields: [
        { key: 'sectorsBadge', label: 'Sectors Section Top Badge', type: 'text', placeholder: 'SECTOR SPECTRUM & VALUE PILLARS' },
        { key: 'sectorsHeading', label: 'Sectors Main Heading', type: 'text', placeholder: 'Pioneering Sectors Transforming African Real Estate' },
        { key: 'sectorsSubtitle', label: 'Sectors Description Subtitle', type: 'textarea', placeholder: 'Explore dedicated showcases spanning sustainable construction, smart proptech, commercial development, diaspora investments, and infrastructure finance.' },
        { key: 'sectorsCtaNote', label: 'Sectors Bottom Callout Note', type: 'textarea', placeholder: 'Exhibitors are grouped into specialized pavilions to maximize targeted buyer traffic and lead generation.' }
      ]
    },
    {
      id: 'speakers',
      title: 'Theme & Distinguished Keynote Speakers',
      icon: Users,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
      fields: [
        { key: 'speakersBadge', label: 'Speakers Section Top Badge', type: 'text', placeholder: 'SUMMIT THEME & THOUGHT LEADERSHIP' },
        { key: 'speakersHeading', label: 'Summit Main Heading', type: 'text', placeholder: 'The 8th Real Estate & Construction Expo 2026' },
        { key: 'speakersSubtitle', label: 'Summit Overview Subtitle', type: 'textarea', placeholder: 'Convening the most influential developers, institutional investors, government ministers, and built-environment innovators from across Africa and the globe.' },
        { key: 'speakersSectionTitle', label: 'Keynote Speakers Sub-header', type: 'text', placeholder: 'Distinguished Keynote Speakers' },
        { key: 'speakersSectionSubtitle', label: 'Keynote Speakers Description', type: 'textarea', placeholder: 'Hear directly from Africa’s top property innovators, institutional capital allocators, and public sector leaders.' },
        { key: 'speakersBadgePill', label: 'Keynote Speaker Badge Pill', type: 'text', placeholder: 'KEYNOTE LEADER' },
        { key: 'speakersNominateBtn', label: 'Nominate Speaker Button Text', type: 'text', placeholder: 'Nominate a Speaker / Secretariat Inquiries' }
      ]
    },
    {
      id: 'programme',
      title: 'Expo Programme & Schedule',
      icon: Calendar,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
      fields: [
        { key: 'programmeBadge', label: 'Programme Top Badge', type: 'text', placeholder: 'OFFICIAL 2-DAY EXPO SCHEDULE' },
        { key: 'programmeHeading', label: 'Programme Main Heading', type: 'text', placeholder: 'The Official Expo Programme' },
        { key: 'programmeSubtitle', label: 'Programme Subtitle', type: 'textarea', placeholder: 'A meticulously curated 2-day lineup of high-impact plenary keynotes, investor deal rooms, architecture masterclasses, and executive gala banquets.' },
        { key: 'programmeSearchPlaceholder', label: 'Schedule Search Box Placeholder', type: 'text', placeholder: 'Search sessions by topic, keynote speaker, or venue hall...' },
        { key: 'programmePdfBtn', label: 'Download PDF Schedule Button Text', type: 'text', placeholder: 'Download Full Conference Schedule (PDF)' },
        { key: 'programmeLivestreamBtn', label: 'Live Stream Schedule Button Text', type: 'text', placeholder: 'Virtual Stream Access' },
        { key: 'programmeSecretariatHelpBtn', label: 'Secretariat Help Button Text', type: 'text', placeholder: 'Contact Programme Secretariat' }
      ]
    },
    {
      id: 'registration',
      title: 'Registration & Participation Tiers',
      icon: Ticket,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10 border-yellow-500/20',
      fields: [
        { key: 'registrationBadge', label: 'Registration Top Badge', type: 'text', placeholder: 'REGISTRATION & PARTICIPATION TIERS' },
        { key: 'registrationHeading', label: 'Registration Main Heading', type: 'text', placeholder: 'BE PART OF THE REAL ESTATE & CONSTRUCTION FUTURE' },
        { key: 'registrationSubtitle', label: 'Registration Subtitle', type: 'textarea', placeholder: 'Select your standalone category below: register for a Free Visitor Pass, upgrade to Elite VIP Pass (₦25,000 / $25), book an exhibitor stand, sponsor the summit, or join as a strategic partner.' },
        { key: 'registrationPaymentBtnLabel', label: 'Main Payment Button Text', type: 'text', placeholder: 'Confirm Your Registration' },
        { key: 'elitePaymentLink', label: 'Elite VIP Guest (₦25,000) Direct Payment Link URL', type: 'text', placeholder: 'https://flutterwave.com/pay/8psefp46habu' },
        { key: 'registrationDiscountBtnLabel', label: 'Apply Discount / Promo Button Text', type: 'text', placeholder: 'Apply Promo Code' },
        { key: 'discountPaymentLink', label: 'Discount Payment Direct Link URL', type: 'text', placeholder: 'https://flutterwave.com/pay/vlg1htodborh' },
        { key: 'registrationMainFeeLabel', label: 'Main VIP Registration Fee Text', type: 'text', placeholder: '₦25,000 / $25' },
        { key: 'registrationDiscountFeeLabel', label: 'Discounted VIP Fee Text', type: 'text', placeholder: '₦20,000 / $20' },
        { key: 'registrationDiscountAmountLabel', label: 'Promo Discount Value Text', type: 'text', placeholder: '₦5,000' },
        { key: 'registrationCheckBadgeBtn', label: 'Retrieve Pass / Registration Button', type: 'text', placeholder: 'Already Registered? Access Registration Account & Retrieve ID Card' },
        { key: 'registrationSecretariatNoteTitle', label: 'Registration Guarantee Title', type: 'text', placeholder: 'Official Registration Portal • Instant Smart ID Badges for Visitors & Elite VIP • Exhibitors, Sponsors & Partners Handled by Organizing Secretariat' },
        { key: 'registrationSecretariatNoteText', label: 'Registration Guarantee Details Text', type: 'textarea', placeholder: 'Registrations, stand allocations, and executive ID credentials for Exhibitors, Sponsors, and Strategic Partners are handled directly by the RECON 2026 Organizing Secretariat.' }
      ]
    },
    {
      id: 'sponsors',
      title: 'Sponsors & Strategic Partners',
      icon: Award,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/20',
      fields: [
        { key: 'sponsorsBadge', label: 'Sponsors Top Badge', type: 'text', placeholder: 'INDUSTRY LEADERS & STRATEGIC ALLIANCES' },
        { key: 'sponsorsHeading', label: 'Sponsors Main Heading', type: 'text', placeholder: 'OUR PREMIUM SPONSORS' },
        { key: 'sponsorsSubtitle', label: 'Sponsors Subtitle', type: 'textarea', placeholder: 'We are proud to collaborate with Africa’s most respected real estate developers, financial powerhouses, government agencies, and technology pioneers.' },
        { key: 'sponsorsHeadlineTitle', label: 'Headline Sponsors Header', type: 'text', placeholder: 'OFFICIAL HEADLINE & PLATINUM SPONSORS' },
        { key: 'sponsorsPartnersTitle', label: 'Strategic Partners Header', type: 'text', placeholder: 'STRATEGIC ALLIANCES, MEDIA & INDUSTRY BODIES' },
        { key: 'sponsorsApplyBtn', label: 'Apply As Sponsor Button Text', type: 'text', placeholder: 'Apply for Brand Sponsorship' },
        { key: 'sponsorsCustomNote', label: 'Custom Sponsorship Note', type: 'textarea', placeholder: 'Need a customized brand authority activation, exclusive cocktail sponsorship, or keynote keynote session?' }
      ]
    },
    {
      id: 'marketer',
      title: 'Become a Marketer (Affiliate Program)',
      icon: DollarSign,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
      fields: [
        { key: 'marketerBadge', label: 'Marketer Top Badge', type: 'text', placeholder: 'AFFILIATE & PARTNERSHIP PROGRAM' },
        { key: 'marketerHeading', label: 'Marketer Main Heading', type: 'text', placeholder: 'Become a Marketer ( Make Money by Referrals )' },
        { key: 'marketerSubtitle', label: 'Marketer Subtitle', type: 'textarea', placeholder: 'Join the official RECON 2026 Affiliate Network. Generate passive income by inviting real estate professionals, delegates, exhibitors, and investors. Earn guaranteed commissions paid directly to your bank account!' },
        { key: 'marketerCard1Title', label: 'Card 1 Title (Commission)', type: 'text', placeholder: '₦5,000 Commission' },
        { key: 'marketerCard1Desc', label: 'Card 1 Description', type: 'textarea', placeholder: 'Earn an instant ₦5,000 naira payout for every Executive VIP delegate or paid attendee who registers using your referral code.' },
        { key: 'marketerCard2Title', label: 'Card 2 Title (Guaranteed Commission)', type: 'text', placeholder: 'Guaranteed Payout' },
        { key: 'marketerCard2Desc', label: 'Card 2 Description', type: 'textarea', placeholder: 'Earn ₦5,000 commission for every verified VIP delegate. All referrals are securely attributed to your account and paid directly to your bank upon admin verification.' },
        { key: 'marketerCard3Title', label: 'Card 3 Title (Custom Promo Code)', type: 'text', placeholder: 'Custom Promo Code' },
        { key: 'marketerCard3Desc', label: 'Card 3 Description', type: 'textarea', placeholder: 'Choose your personalized promo code (e.g. VIP-DAVID). Share it on WhatsApp, Social Media, or Email!' },
        { key: 'marketerCard4Title', label: 'Card 4 Title (Direct Bank Payouts)', type: 'text', placeholder: 'Direct Bank Payouts' },
        { key: 'marketerCard4Desc', label: 'Card 4 Description', type: 'textarea', placeholder: 'Provide your Nigerian bank account details during sign up. Commissions are processed and paid directly to your account.' },
        { key: 'marketerCtaBadge', label: 'Marketer Bottom CTA Badge', type: 'text', placeholder: 'Start Earning Money Today' },
        { key: 'marketerCtaHeading', label: 'Marketer Bottom CTA Heading', type: 'text', placeholder: 'Ready to start earning with RECON 2026?' },
        { key: 'marketerCtaSubtitle', label: 'Marketer Bottom CTA Subtitle', type: 'textarea', placeholder: 'Sign up as an official marketer in less than 60 seconds. Get your custom code and start inviting delegates now.' },
        { key: 'marketerBtnRegister', label: 'Marketer Register Button Text', type: 'text', placeholder: 'Become a Marketer Now' },
        { key: 'marketerBtnLogin', label: 'Marketer Login Button Text', type: 'text', placeholder: 'Marketer Login' }
      ]
    },
    {
      id: 'faq',
      title: 'Frequently Asked Questions (FAQ)',
      icon: HelpCircle,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/20',
      fields: [
        { key: 'faqBadge', label: 'FAQ Top Badge', type: 'text', placeholder: 'HELP & PARTICIPATION GUIDELINES' },
        { key: 'faqHeading', label: 'FAQ Main Heading', type: 'text', placeholder: 'Frequently Asked Questions' },
        { key: 'faqSubtitle', label: 'FAQ Subtitle', type: 'textarea', placeholder: 'Find prompt answers to common questions regarding delegate ticketing, exhibitor stands, B2B deal rooms, and venue logistics.' },
        { key: 'faqHelpdeskTitle', label: 'FAQ Helpdesk Card Title', type: 'text', placeholder: 'Still have questions? Our Organizing Secretariat is on standby.' },
        { key: 'faqHelpdeskSubtitle', label: 'FAQ Helpdesk Card Subtitle', type: 'textarea', placeholder: 'Contact our delegate support team directly for fast assistance regarding visas, stand bookings, or partnership agreements.' },
        { key: 'faqContactBtn', label: 'FAQ WhatsApp / Secretariat Action Button', type: 'text', placeholder: 'Chat on WhatsApp / Inquire Secretariat' }
      ]
    },
    {
      id: 'footer',
      title: 'Footer & Secretariat Contact Section',
      icon: Footprints,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10 border-teal-500/20',
      fields: [
        { key: 'footerCtaBadge', label: 'Footer Conversion Banner Badge', type: 'text', placeholder: 'JOIN OVER 5,000+ PROPERTY LEADERS' },
        { key: 'footerCtaHeading', label: 'Footer Conversion Main Heading', type: 'text', placeholder: 'READY TO CONNECT, INVEST AND BUILD THE FUTURE?' },
        { key: 'footerCtaSubtitle', label: 'Footer Conversion Subtitle', type: 'textarea', placeholder: 'Secure your delegate pass today for 2 unforgettable days of high-yield real estate networking, innovative construction demos, and direct investor deal rooms at Shehu Musa Yar\'Adua Centre, Abuja.' },
        { key: 'footerPrimaryCta', label: 'Footer Primary Button', type: 'text', placeholder: 'REGISTER NOW FOR EXPO 2026' },
        { key: 'footerSecondaryCta', label: 'Footer Secondary Button', type: 'text', placeholder: 'BOOK AN EXHIBITION BOOTH' },
        { key: 'footerOrganizerLabel', label: 'Footer Organizer Label', type: 'text', placeholder: 'This Event Is Organized By:' },
        { key: 'footerOrganizerText', label: 'Footer Organizer Organizations Text', type: 'textarea', placeholder: 'Afrinet Group and Afrinex West Africa in Collaboration with Abuja Chamber of Commerce and Industry(ACCI)' },
        { key: 'footerAboutText', label: 'Footer About Expo Paragraph', type: 'textarea', placeholder: 'The 8th Real Estate & Construction Expo 2026 is Nigeria’s definitive real sector platform for high-impact investments, smart housing, and construction technology.' },
        { key: 'footerSecretariatTitle', label: 'Secretariat Form Header', type: 'text', placeholder: 'Contact the Organizing Secretariat' },
        { key: 'footerSecretariatSubtitle', label: 'Secretariat Form Sub-description', type: 'textarea', placeholder: 'Have specific inquiries regarding VIP delegations, press accreditation, or speaking opportunities? Send us a direct dispatch.' },
        { key: 'footerCopyright', label: 'Footer Copyright Notice', type: 'text', placeholder: '© 2026 RECON Expo (Real Estate & Construction Expo). All Rights Reserved. Organized by Afrinet Group and Afrinex West Africa in Collaboration with Abuja Chamber of Commerce and Industry(ACCI).' },
        { key: 'footerDeveloperLabel', label: 'Website Designer Label', type: 'text', placeholder: 'This website is designed by:' },
        { key: 'footerDeveloperName', label: 'Website Designer Name', type: 'text', placeholder: 'Integrated Hub Nigeria' },
        { key: 'footerDeveloperPhone', label: 'Website Designer Phone', type: 'text', placeholder: '08100449449' }
      ]
    }
  ];

  // Filtering based on search query or section
  const filteredSections = sections.filter(sec => {
    if (activeSection !== 'all' && sec.id !== activeSection) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchesSec = sec.title.toLowerCase().includes(q);
    const matchesFields = sec.fields.some(f => 
      f.label.toLowerCase().includes(q) || 
      (texts[f.key as keyof SiteTexts] || '').toLowerCase().includes(q) ||
      f.placeholder.toLowerCase().includes(q)
    );
    return matchesSec || matchesFields;
  });

  return (
    <div className="space-y-6">
      {/* Header with Save Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-emerald-950 via-[#012f22] to-slate-950 p-5 rounded-2xl border border-emerald-500/30 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Type className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white font-display">
              Home Page Visual Text & Copy Editor
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
              Live Real-Time
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl">
            Edit every text, heading, tagline, button label, and description across all sections of the home page. Changes update in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/60 cursor-pointer transition-all active:scale-95"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                <span>Saved & Published Live!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Text Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search any home page text, heading, badge, or button..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-400"
          />
        </div>

        {/* Section Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <button
            type="button"
            onClick={() => setActiveSection('all')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all ${
              activeSection === 'all'
                ? 'bg-emerald-500 text-emerald-950 shadow-sm'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            All Sections ({sections.length})
          </button>
          {sections.map(sec => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all ${
                activeSection === sec.id
                  ? 'bg-emerald-500 text-emerald-950 shadow-sm'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {sec.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Sections Accordion / Grid */}
      <div className="space-y-6">
        {filteredSections.map(sec => {
          const Icon = sec.icon;
          const sectionKeys = sec.fields.map(f => f.key as keyof SiteTexts);

          return (
            <div 
              key={sec.id}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-lg"
            >
              {/* Section Header */}
              <div className="p-4 sm:p-5 bg-white/5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border ${sec.bgColor} ${sec.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white font-display flex items-center gap-2">
                      {sec.title}
                      <span className="text-[11px] font-normal text-slate-400 font-sans">
                        ({sec.fields.length} editable texts)
                      </span>
                    </h3>
                  </div>
                </div>
              </div>

              {/* Section Fields Grid */}
              <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                {sec.fields.map(field => {
                  const currentValue = texts[field.key as keyof SiteTexts] || '';

                  return (
                    <div 
                      key={field.key}
                      className={`space-y-1.5 ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <span>{field.label}</span>
                          {currentValue ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-400" title="Customized text active" />
                          ) : (
                            <span className="text-[10px] text-slate-500 font-mono font-normal">
                              (Default Active)
                            </span>
                          )}
                        </label>
                        {currentValue && (
                          <button
                            type="button"
                            onClick={() => handleTextChange(field.key as keyof SiteTexts, '')}
                            className="text-[10px] text-slate-400 hover:text-red-300 underline cursor-pointer"
                          >
                            Clear override
                          </button>
                        )}
                      </div>

                      {field.type === 'textarea' ? (
                        <textarea
                          rows={2}
                          value={currentValue}
                          placeholder={field.placeholder}
                          onChange={(e) => handleTextChange(field.key as keyof SiteTexts, e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-400 leading-relaxed font-sans"
                        />
                      ) : (
                        <input
                          type="text"
                          value={currentValue}
                          placeholder={field.placeholder}
                          onChange={(e) => handleTextChange(field.key as keyof SiteTexts, e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-sans"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Sticky Save Bar */}
      <div className="p-4 rounded-2xl bg-[#01251a] border border-emerald-500/40 shadow-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>All text changes will be saved to your event database and visible immediately to all website visitors.</span>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save & Apply All Texts</span>
        </button>
      </div>
    </div>
  );
};
