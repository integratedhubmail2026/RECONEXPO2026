import React, { useState, useEffect } from 'react';
import { ReconLogo } from './ReconLogo';
import { useExpoData } from '../context/ExpoDataContext';
import { 
  UserCheck,
  Menu, 
  X, 
  Calendar, 
  MapPin, 
  Phone,
  PhoneCall,
  ArrowRight
} from 'lucide-react';

interface NavbarProps {
  onOpenRegister: (tier?: string) => void;
  onOpenFloorPlan: () => void;
  onOpenDiagnostics?: () => void;
  onOpenDelegatePortal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenRegister,
  onOpenFloorPlan,
  onOpenDiagnostics,
  onOpenDelegatePortal,
}) => {
  const { expoDetails } = useExpoData();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About Expo', href: '#theme' },
    { name: 'Speakers', href: '#speakers' },
    { name: 'Programme', href: '#programme' },
    { name: 'Exhibitors', href: '#registration' },
    { name: 'Sponsors', href: '#sponsors' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      id="main-navigation-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#022c22]/85 backdrop-blur-xl border-b border-white/10 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
          : 'bg-gradient-to-b from-[#022c22]/90 via-[#022c22]/40 to-transparent py-5'
      }`}
    >
      {/* Top micro-announcement banner on initial render */}
      {!scrolled && (
        <div className="hidden lg:block w-full border-b border-white/10 bg-white/5 backdrop-blur-md py-1 px-4 mb-2 text-xs text-slate-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center text-emerald-400 font-semibold">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                {expoDetails.dateRange}
              </span>
              <span className="text-white/20">•</span>
              <span className="inline-flex items-center text-slate-300">
                <MapPin className="w-3.5 h-3.5 mr-1 text-red-400" />
                {expoDetails.venue}, Abuja
              </span>
              <span className="text-white/20">•</span>
              <a 
                href="#contact" 
                className="inline-flex items-center gap-1.5 text-emerald-300/90 hover:text-emerald-200 transition-colors font-medium"
                title="4 Active Helplines Available"
              >
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>{expoDetails.siteTexts?.navAnnouncementHelplinePrefix || "Helplines:"} <strong className="text-white">{expoDetails.contactPhone}</strong> / <strong className="text-white">{expoDetails.contactPhone2}</strong></span>
              </a>
            </div>
            <div className="flex items-center space-x-5 text-xs">
              <span className="inline-flex items-center text-emerald-300/80 font-medium">
                {expoDetails.siteTexts?.navAnnouncementVenue || `${expoDetails.venue} • Abuja, Nigeria`}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Event Logo */}
        <a 
          id="nav-logo-link"
          href="#hero" 
          className="flex items-center group transition-transform active:scale-95"
          aria-label={`${expoDetails.name || "RECON Expo 2026"} Home`}
        >
          <ReconLogo size="sm" glow={scrolled} showSubtitle={false} />
        </a>

        {/* Desktop Nav Links in Frosted Glass Capsule */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-xl shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.name}
              id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
              href={link.href}
              className="text-sm font-medium text-slate-200 hover:text-emerald-400 hover:bg-white/10 px-3 py-1.5 rounded-full transition-all duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center space-x-3">
          {onOpenDelegatePortal && (
            <button
              id="nav-delegate-portal-btn"
              onClick={onOpenDelegatePortal}
              className="px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 shadow-sm"
              title="Access your Registration account, check payment approval & download Smart ID Card"
            >
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>{expoDetails.siteTexts?.navDelegatePortalBtn || "Registration account"}</span>
            </button>
          )}

          <button
            id="nav-register-now-btn"
            onClick={() => onOpenRegister('attendee')}
            className="relative group overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer shadow-lg shadow-red-900/30"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-red-600 via-emerald-500 to-red-600 rounded-full" />
            <span className="relative flex items-center gap-2 px-6 py-2 rounded-full bg-red-600 group-hover:bg-red-500 text-white text-sm font-bold tracking-wide transition-colors">
              <span>{expoDetails.siteTexts?.navRegisterBtn || "REGISTER NOW"}</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center md:hidden space-x-2">
          <button
            id="mobile-register-quick-btn"
            onClick={() => onOpenRegister('attendee')}
            className="text-xs font-bold bg-red-600 text-white px-3.5 py-1.5 rounded-full active:scale-95 transition-transform shadow-md shadow-red-900/40"
          >
            Register
          </button>
          
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 text-slate-200 border border-white/15 focus:outline-none backdrop-blur-md"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-red-400" /> : <Menu className="w-6 h-6 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden bg-[#022c22]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 transition-all duration-300"
        >
          <div className="flex flex-col space-y-3 mb-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                id={`mobile-nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-200 hover:text-emerald-400 py-2 border-b border-white/5 flex items-center justify-between"
              >
                <span>{link.name}</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </a>
            ))}
          </div>

          {/* 4 Contact Helplines */}
          <div className="mb-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" /> Official Helplines
              </span>
              <span className="text-[10px] text-slate-400 font-normal">4 Lines</span>
            </p>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              <a 
                href={`tel:${expoDetails.contactPhone.replace(/[^+\d]/g, '')}`}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-black/20 hover:bg-emerald-500/10 text-slate-200 hover:text-emerald-300 transition-colors"
              >
                <span className="font-bold">{expoDetails.contactPhone}</span>
                <span className="text-[10px] text-slate-400">Secretariat</span>
              </a>
              <a 
                href={`tel:${expoDetails.contactPhone2.replace(/[^+\d]/g, '')}`}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-black/20 hover:bg-emerald-500/10 text-slate-200 hover:text-emerald-300 transition-colors"
              >
                <span className="font-bold">{expoDetails.contactPhone2}</span>
                <span className="text-[10px] text-slate-400">Delegates</span>
              </a>
              <a 
                href={`tel:${(expoDetails.contactPhone3 || '+234 802 345 6789').replace(/[^+\d]/g, '')}`}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-black/20 hover:bg-emerald-500/10 text-slate-200 hover:text-amber-300 transition-colors"
              >
                <span className="font-bold">{expoDetails.contactPhone3 || '+234 802 345 6789'}</span>
                <span className="text-[10px] text-slate-400">Exhibitions</span>
              </a>
              <a 
                href={`tel:${(expoDetails.contactPhone4 || '+234 818 765 4321').replace(/[^+\d]/g, '')}`}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-black/20 hover:bg-emerald-500/10 text-slate-200 hover:text-red-300 transition-colors"
              >
                <span className="font-bold">{expoDetails.contactPhone4 || '+234 818 765 4321'}</span>
                <span className="text-[10px] text-slate-400">Sponsors</span>
              </a>
            </div>
          </div>

          <div className="mb-4 space-y-2">
            {onOpenDelegatePortal && (
              <button
                id="mobile-drawer-delegate-portal-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDelegatePortal();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500/20 border border-amber-400/50 text-xs font-black text-amber-300 backdrop-blur-md shadow-md"
              >
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>My Registration account</span>
              </button>
            )}
          </div>

          <button
            id="mobile-drawer-register-btn"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenRegister('attendee');
            }}
            className="w-full py-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-sm tracking-wide text-center shadow-lg shadow-red-900/40"
          >
            REGISTER FOR EXPO 2026
          </button>
        </div>
      )}
    </header>
  );
};

