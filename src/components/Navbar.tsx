import React, { useState } from 'react';
import { ReconLogo } from './ReconLogo';
import { useExpoData } from '../context/ExpoDataContext';
import {
  Menu,
  X,
  Volume2,
  VolumeX,
  ShieldAlert,
  UserCheck,
  Building,
  DollarSign,
  QrCode,
  LayoutGrid,
  Calendar,
  Users
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { soundEnabled, toggleSound, openModal, setSelectedTierForModal } = useExpoData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRegisterClick = (tier: 'visitor' | 'elite' | 'exhibitor' = 'visitor') => {
    setSelectedTierForModal(tier);
    openModal('registration');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-emerald-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <a href="#" className="flex items-center">
            <ReconLogo size="md" showSubtitle={true} />
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            <a href="#about" className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">
              About
            </a>
            <a href="#speakers" className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">
              Speakers
            </a>
            <a href="#programme" className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">
              Schedule
            </a>
            <a href="#sponsors" className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">
              Sponsors
            </a>
            <button
              onClick={() => openModal('floorPlan')}
              className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-emerald-400" />
              <span>Floor Plan</span>
            </button>
            <a href="#passes" className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">
              Passes
            </a>
            <a href="#faq" className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors">
              FAQ
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
              title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Delegate Self-Service Lookup */}
            <button
              onClick={() => openModal('delegateAccount')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-emerald-500/20 text-slate-200 hover:text-emerald-300 hover:border-emerald-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
              title="Find your registered badge"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>My Badge</span>
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={() => openModal('adminDashboard')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
              title="Secretariat Admin Portal"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin</span>
            </button>

            {/* Register Free / VIP Primary CTA */}
            <button
              onClick={() => handleRegisterClick('visitor')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/60 hover:brightness-110 active:scale-95 transition-all"
            >
              Register Pass
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleSound}
              className="p-2 rounded-lg bg-slate-900 text-slate-400"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-slate-950/95 border-b border-emerald-500/20 px-4 pt-2 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pt-2">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-slate-900/60 text-xs font-semibold text-slate-200"
            >
              About Expo
            </a>
            <a
              href="#speakers"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-slate-900/60 text-xs font-semibold text-slate-200"
            >
              Speakers
            </a>
            <a
              href="#programme"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-slate-900/60 text-xs font-semibold text-slate-200"
            >
              Schedule
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openModal('floorPlan');
              }}
              className="px-3 py-2 rounded-lg bg-slate-900/60 text-xs font-semibold text-emerald-300 text-left"
            >
              Floor Plan
            </button>
            <a
              href="#passes"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-slate-900/60 text-xs font-semibold text-slate-200"
            >
              Pass Tiers
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-slate-900/60 text-xs font-semibold text-slate-200"
            >
              FAQ
            </a>
          </div>

          <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openModal('delegateAccount');
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-emerald-400 font-bold text-xs border border-emerald-500/20 flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Lookup Badge</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openModal('adminDashboard');
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-amber-300 font-bold text-xs border border-amber-500/20 flex items-center justify-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>

          <button
            onClick={() => handleRegisterClick('visitor')}
            className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-950/60"
          >
            Register Now
          </button>
        </div>
      )}
    </nav>
  );
};
