import React, { useState } from 'react';
import { ReconLogo } from './ReconLogo';
import { useExpoData } from '../context/ExpoDataContext';
import { 
  Mail, 
  Phone, 
  PhoneCall,
  MapPin, 
  Calendar, 
  ArrowRight, 
  Send, 
  CheckCircle2, 
  Sparkles,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Video,
  Clock,
  Building,
  Lock
} from 'lucide-react';

interface FooterSectionProps {
  onOpenRegister: (tier?: string) => void;
  onOpenAdmin?: () => void;
  onOpenDiagnostics?: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ 
  onOpenRegister, 
  onOpenAdmin,
  onOpenDiagnostics 
}) => {
  const { expoDetails, addContactMessage, adminAuth } = useExpoData();
  const [contactForm, setContactForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    inquiryType: 'General Attendee Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.fullName || !contactForm.email) return;
    
    addContactMessage({
      fullName: contactForm.fullName,
      email: contactForm.email,
      phone: contactForm.phone,
      inquiryType: contactForm.inquiryType,
      message: contactForm.message || 'General Secretariat Inquiry submitted via website footer form.'
    });

    setSubmitted(true);
  };

  const quickLinks = [
    { name: 'About Expo', href: '#theme' },
    { name: 'Keynote Speakers', href: '#speakers' },
    { name: 'Expo Programme', href: '#programme' },
    { name: 'Exhibitor Packages', href: '#registration' },
    { name: 'Sponsors & Partners', href: '#sponsors' },
    { name: 'Registration Tiers', href: '#registration' },
    { name: 'Contact Secretariat', href: '#contact' },
  ];

  return (
    <footer id="contact" className="relative bg-[#022c22]/70 text-slate-300 pt-20 pb-12 border-t border-white/10 overflow-hidden">
      {/* Glow Backdrops */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 1. FINAL BIG CONVERSION CTA BANNER IN FROSTED GLASS */}
        <div className="mb-20 p-8 sm:p-12 rounded-3xl glass-panel border border-white/15 shadow-2xl text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-emerald-300 uppercase tracking-widest mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              {expoDetails.siteTexts?.footerCtaBadge || "JOIN OVER 5,000+ PROPERTY LEADERS"}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-display frosted-title-glow mb-3 tracking-tight">
              {expoDetails.siteTexts?.footerCtaHeading || "READY TO CONNECT, INVEST AND BUILD THE FUTURE?"}
            </h2>
            <p className="text-sm sm:text-base text-slate-200 mb-8 leading-relaxed">
              {expoDetails.siteTexts?.footerCtaSubtitle || "Secure your delegate pass today for 3 unforgettable days of high-yield real estate networking, innovative construction demos, and direct investor deal rooms at Shehu Musa Yar'Adua Centre, Abuja."}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="footer-final-register-btn"
                onClick={() => onOpenRegister('attendee')}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm tracking-wider transition-all shadow-xl shadow-red-950/50 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{expoDetails.siteTexts?.footerPrimaryCta || "REGISTER NOW FOR EXPO 2026"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                id="footer-exhibitor-btn"
                onClick={() => onOpenRegister('exhibitor')}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-emerald-300 hover:text-white font-bold text-sm tracking-wider transition-all cursor-pointer backdrop-blur-md"
              >
                {expoDetails.siteTexts?.footerSecondaryCta || "BOOK AN EXHIBITION BOOTH"}
              </button>
            </div>
          </div>
        </div>

        {/* 2. CONTACT FORM & EVENT INFO MEGA GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 pb-16 border-b border-white/10">
          
          {/* Column 1: Event Details & Brand (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="mb-4">
              <ReconLogo size="md" glow={true} showSubtitle={true} />
              
              {/* Event Organizer Attribution under Logo */}
              <div className="mt-4 pt-3.5 border-t border-white/10">
                <p className="text-xs text-slate-300 font-medium mb-1.5">
                  {expoDetails.siteTexts?.footerOrganizerLabel || "This Event Is Organized By:"}
                </p>
                <div className="text-sm sm:text-base font-black text-white leading-relaxed">
                  {(() => {
                    const text = expoDetails.siteTexts?.footerOrganizerText;
                    const isLegacy = !text ||
                      text.includes("Organized by the RECON Expo Secretariat") ||
                      text.includes("Real Estate Development Associations") ||
                      text.includes("Federal Ministries") ||
                      text.includes("Abuja Chamber of Commerce & Industry");
                    if (isLegacy) {
                      return (
                        <>
                          <span className="text-emerald-400">Afrinet Group</span>{' '}
                          <span className="text-slate-300 font-medium text-xs sm:text-sm">and</span>{' '}
                          <span className="text-emerald-400">Afrinex West Africa</span>{' '}
                          <span className="text-amber-300 font-bold text-xs sm:text-sm block sm:inline mt-1 sm:mt-0">in Collaboration with</span>{' '}
                          <span className="text-emerald-400">Abuja Chamber of Commerce and Industry(ACCI)</span>
                        </>
                      );
                    }
                    return <span className="text-emerald-400">{text}</span>;
                  })()}
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <p className="text-slate-300 leading-relaxed">
                {expoDetails.siteTexts?.footerAboutText || "The 8th Real Estate & Construction Expo 2026 is Nigeria’s definitive real sector platform for high-impact investments, smart housing, and construction technology."}
              </p>

              <div className="p-4 rounded-2xl glass-panel space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Event Date:</p>
                    <p className="text-xs text-slate-300">{expoDetails.dateRange}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Daily Time:</p>
                    <p className="text-xs text-slate-300">{expoDetails.dailyTime}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Venue:</p>
                    <p className="text-xs text-slate-300">{expoDetails.venue}</p>
                    <p className="text-[11px] text-slate-400">{expoDetails.venueAddress}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links & Contact info (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h4 className="text-sm font-extrabold uppercase tracking-widest text-white mb-4 border-b border-white/10 pb-2">
                QUICK LINKS
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-slate-300 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
                    >
                      <ArrowRight className="w-3 h-3 text-emerald-400" />
                      <span>{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-extrabold uppercase tracking-widest text-white mb-3 border-b border-white/10 pb-2 flex items-center justify-between">
                <span>OFFICIAL DESK & HELPLINES</span>
                <span className="text-[10px] text-emerald-400 font-semibold lowercase bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  4 active lines
                </span>
              </h4>
              <div className="space-y-2.5 text-xs text-slate-300">
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <a href={`mailto:${expoDetails.contactEmail}`} className="hover:text-emerald-300 transition-colors break-all">
                    {expoDetails.contactEmail}
                  </a>
                </p>

                {/* Line 1 */}
                <div className="flex items-start gap-2 pt-1 border-t border-white/5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <a 
                      href={`tel:${expoDetails.contactPhone.replace(/[^+\d]/g, '')}`} 
                      className="text-white hover:text-emerald-300 font-bold transition-colors block"
                    >
                      {expoDetails.contactPhone}
                    </a>
                    <span className="text-[10px] text-slate-400 block leading-tight">
                      Line 1: Secretariat & General Desk
                    </span>
                  </div>
                </div>

                {/* Line 2 */}
                <div className="flex items-start gap-2 pt-1 border-t border-white/5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <a 
                      href={`tel:${expoDetails.contactPhone2.replace(/[^+\d]/g, '')}`} 
                      className="text-white hover:text-emerald-300 font-bold transition-colors block"
                    >
                      {expoDetails.contactPhone2}
                    </a>
                    <span className="text-[10px] text-slate-400 block leading-tight">
                      Line 2: Delegate & VIP Registration
                    </span>
                  </div>
                </div>

                {/* Line 3 */}
                <div className="flex items-start gap-2 pt-1 border-t border-white/5">
                  <PhoneCall className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <a 
                      href={`tel:${(expoDetails.contactPhone3 || '+234 802 345 6789').replace(/[^+\d]/g, '')}`} 
                      className="text-white hover:text-amber-300 font-bold transition-colors block"
                    >
                      {expoDetails.contactPhone3 || '+234 802 345 6789'}
                    </a>
                    <span className="text-[10px] text-slate-400 block leading-tight">
                      Line 3: Exhibitions & Booth Allocations
                    </span>
                  </div>
                </div>

                {/* Line 4 */}
                <div className="flex items-start gap-2 pt-1 border-t border-white/5">
                  <PhoneCall className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <a 
                      href={`tel:${(expoDetails.contactPhone4 || '+234 818 765 4321').replace(/[^+\d]/g, '')}`} 
                      className="text-white hover:text-red-300 font-bold transition-colors block"
                    >
                      {expoDetails.contactPhone4 || '+234 818 765 4321'}
                    </a>
                    <span className="text-[10px] text-slate-400 block leading-tight">
                      Line 4: Sponsorships & Media Protocol
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Secretariat Contact Form (5 cols) */}
          <div className="lg:col-span-5">
            <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/15">
              <h4 className="text-lg font-extrabold text-white font-heading mb-1 flex items-center gap-2">
                <Mail className="w-5 h-5 text-emerald-400" />
                {expoDetails.siteTexts?.footerSecretariatTitle || "Contact the Organizing Secretariat"}
              </h4>
              <p className="text-xs text-slate-300 mb-5">
                {expoDetails.siteTexts?.footerSecretariatSubtitle || "Have specific inquiries regarding VIP delegations, press accreditation, or speaking opportunities? Send us a direct dispatch."}
              </p>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-center backdrop-blur-md">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                  <h5 className="text-base font-bold text-white">Message Dispatched!</h5>
                  <p className="text-xs text-slate-200 mt-1">
                    Thank you, {contactForm.fullName}. Our Expo Secretariat will contact you via {contactForm.email} within 2 business hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-xs font-bold text-emerald-300 underline hover:text-white"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Full Name / Organization</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Arc. Oladipo Johnson"
                      value={contactForm.fullName}
                      onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+234 803 000 0000"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Inquiry Category</label>
                    <select
                      value={contactForm.inquiryType}
                      onChange={(e) => setContactForm({ ...contactForm, inquiryType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#022c22] border border-white/10 text-white focus:outline-none focus:border-emerald-400"
                    >
                      <option>General Attendee Inquiry</option>
                      <option>Exhibition Booth Booking</option>
                      <option>Sponsorship & Brand Authority Package</option>
                      <option>Media & Press Accreditation</option>
                      <option>B2B Deal Room Participation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Message</label>
                    <textarea
                      rows={3}
                      placeholder="How can our secretariat assist your organization?"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-emerald-400 text-emerald-950 font-extrabold tracking-wider hover:bg-emerald-300 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>SUBMIT OFFICIAL INQUIRY</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* 3. SOCIAL MEDIA CHANNELS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-wider mb-1">
              CONNECT ON OFFICIAL SOCIAL CHANNELS
            </p>
            <p className="text-[11px] text-slate-300">
              Follow #RECONExpo2026 #AbujaRealEstate for live updates, speaker teasers & deal room highlights.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <a
              id="social-link-facebook"
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-[#1877f2] transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              id="social-link-instagram"
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-[#e4405f] transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              id="social-link-linkedin"
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-[#0a66c2] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              id="social-link-twitter"
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-black transition-colors"
              aria-label="X (formerly Twitter)"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              id="social-link-youtube"
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-[#ff0000] transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              id="social-link-tiktok"
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-[#010101] transition-colors"
              aria-label="TikTok"
            >
              <Video className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 3. SEO, AEO & LLM INTERNAL LINKING MATRIX */}
        <div className="mb-10 p-6 rounded-2xl bg-black/40 border border-white/10 text-xs text-slate-300">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 mb-3 flex items-center gap-2">
            <span>RECON EXPO 2026 OFFICIAL INDEX &amp; INTERNAL DIRECTORY</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px]">
            <div>
              <p className="font-bold text-white mb-1.5 border-b border-white/10 pb-1">Summit Sections</p>
              <ul className="space-y-1 text-slate-400">
                <li><a href="#theme" className="hover:text-emerald-300 transition-colors">Abuja Expo Theme &amp; Vision</a></li>
                <li><a href="#speakers" className="hover:text-emerald-300 transition-colors">Keynote Speakers &amp; Panelists</a></li>
                <li><a href="#programme" className="hover:text-emerald-300 transition-colors">2-Day Official Expo Agenda</a></li>
                <li><a href="#sponsors" className="hover:text-emerald-300 transition-colors">Sponsors &amp; Institutional Backers</a></li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-white mb-1.5 border-b border-white/10 pb-1">Pass Categories</p>
              <ul className="space-y-1 text-slate-400">
                <li><a href="#registration" className="hover:text-emerald-300 transition-colors">Free Visitor Pass Signup</a></li>
                <li><a href="#registration" className="hover:text-emerald-300 transition-colors">Elite VIP Executive Pass (₦25,000)</a></li>
                <li><a href="#registration" className="hover:text-emerald-300 transition-colors">Exhibitor Booth Stand Allocation</a></li>
                <li><a href="#registration" className="hover:text-emerald-300 transition-colors">Corporate Sponsorship Packages</a></li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-white mb-1.5 border-b border-white/10 pb-1">Exhibition Sectors</p>
              <ul className="space-y-1 text-slate-400">
                <li><a href="#theme" className="hover:text-emerald-300 transition-colors">Residential &amp; Commercial Real Estate</a></li>
                <li><a href="#theme" className="hover:text-emerald-300 transition-colors">PropTech &amp; Smart Building Automation</a></li>
                <li><a href="#theme" className="hover:text-emerald-300 transition-colors">Building Materials &amp; Pre-fab Systems</a></li>
                <li><a href="#theme" className="hover:text-emerald-300 transition-colors">Mortgage Banking &amp; Diaspora Inflows</a></li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-white mb-1.5 border-b border-white/10 pb-1">Venue &amp; Logistics</p>
              <ul className="space-y-1 text-slate-400">
                <li><a href="#contact" className="hover:text-emerald-300 transition-colors">Shehu Musa Yar'Adua Centre CBD</a></li>
                <li><a href="#faqs" className="hover:text-emerald-300 transition-colors">Delegate Travel &amp; Hotel Logistics</a></li>
                <li><a href="#marketers" className="hover:text-emerald-300 transition-colors">Affiliate Promoter Partnership</a></li>
                <li><a href="#contact" className="hover:text-emerald-300 transition-colors">Secretariat Helplines &amp; Support</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4. COPYRIGHT & ACCREDITATION */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4 border-t border-white/10">
          <div className="text-center md:text-left">
            <p>
              {(() => {
                const text = expoDetails.siteTexts?.footerCopyright || expoDetails.siteTexts?.footerCopyrightText;
                if (
                  !text ||
                  (text.includes("Real Estate & Construction Expo. All Rights Reserved.") && !text.includes("Afrinet Group")) ||
                  text.includes("Organized by the RECON Expo Secretariat") ||
                  text.includes("Real Estate Development Associations") ||
                  text.includes("Federal Ministries") ||
                  text.includes("Abuja Chamber of Commerce & Industry")
                ) {
                  return "© 2026 RECON Expo (Real Estate & Construction Expo). All Rights Reserved. Organized by Afrinet Group and Afrinex West Africa in Collaboration with Abuja Chamber of Commerce and Industry(ACCI).";
                }
                return text;
              })()}
            </p>
          </div>

          {/* Center Accreditation */}
          <div className="text-center flex flex-col items-center justify-center gap-0.5">
            <span className="text-xs text-slate-400 font-medium">
              {expoDetails.siteTexts?.footerDeveloperLabel || "This website is designed by:"}
            </span>
            <a
              href={`tel:${(expoDetails.siteTexts?.footerDeveloperPhone || "08100449449").replace(/[^+\d]/g, '')}`}
              className="text-sm sm:text-base font-black text-emerald-400 hover:text-emerald-300 hover:underline transition-colors tracking-wide"
            >
              {expoDetails.siteTexts?.footerDeveloperName || "Integrated Hub Nigeria"}
            </a>
          </div>

          {/* Right Links & Admin Button */}
          <div className="flex flex-wrap items-center justify-center md:justify-end space-x-3 sm:space-x-4 text-[11px]">
            <a href="#theme" className="hover:text-emerald-300 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#programme" className="hover:text-emerald-300 transition-colors">Terms of Participation</a>
            {onOpenAdmin && (
              <>
                <span>•</span>
                <button
                  id="footer-bottom-admin-btn"
                  onClick={onOpenAdmin}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    adminAuth?.isAuthenticated
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/30'
                      : 'text-amber-300/90 hover:text-amber-200 bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/20 shadow-sm'
                  }`}
                  title="Admin Dashboard (Edit website info & Secretariat Controls)"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{adminAuth?.isAuthenticated ? 'Admin Active' : 'Admin Portal'}</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
