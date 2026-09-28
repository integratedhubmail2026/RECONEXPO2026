import React from 'react';
import { ReconLogo } from './ReconLogo';
import { useExpoData } from '../context/ExpoDataContext';
import { MapPin, Mail, Phone, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export const FooterSection: React.FC = () => {
  const { siteContent, openModal } = useExpoData();

  return (
    <footer className="bg-slate-950 border-t border-emerald-500/20 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Overview */}
          <div className="space-y-4">
            <ReconLogo size="md" />
            <p className="text-slate-400 leading-relaxed text-xs">
              The 8th Real Estate & Construction Expo 2026 is West Africa's leading platform uniting developers, sovereign funds, architects, and government policymakers.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Accredited Trade Exhibition</span>
            </div>
          </div>

          {/* Col 2: Venue & Dates */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">Event Venue</h4>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="font-bold text-white">{siteContent.eventVenue}</p>
              <p className="flex items-start gap-1.5 text-slate-400">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{siteContent.eventVenueAddress}</span>
              </p>
              <p className="text-emerald-400 font-semibold pt-1">
                📅 {siteContent.eventDates} (08:00 AM Daily)
              </p>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">Expo Portals</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => openModal('delegateAccount')} className="hover:text-emerald-400 transition-colors">
                  🎟️ Find / Reprint My Smart Badge
                </button>
              </li>
              <li>
                <button onClick={() => openModal('staffManager')} className="hover:text-emerald-400 transition-colors">
                  👥 Exhibitor Company Staff Portal
                </button>
              </li>
              <li>
                <button onClick={() => openModal('floorPlan')} className="hover:text-emerald-400 transition-colors">
                  🗺️ Shehu Yar'Adua Floor Plan Map
                </button>
              </li>
              <li>
                <a href="#affiliate" className="hover:text-emerald-400 transition-colors">
                  💼 Become an Ambassador (15% Commission)
                </a>
              </li>
              <li>
                <button onClick={() => openModal('adminDashboard')} className="hover:text-amber-400 transition-colors">
                  🔒 Secretariat Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Secretariat Contact */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">Official Secretariat</h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${siteContent.contactEmail}`} className="hover:text-white transition-colors">
                  {siteContent.contactEmail}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${siteContent.contactPhone}`} className="hover:text-white transition-colors">
                  {siteContent.contactPhone}
                </a>
              </p>
              <p className="text-slate-400 text-[11px] pt-2">
                Organized by <strong>Afriview International Group</strong> in strategic partnership with Federal Ministry of Housing and REDAN.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 RECON Expo (8th Edition). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Federal Republic of Nigeria</span>
            <span>•</span>
            <span>Abuja CBD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
