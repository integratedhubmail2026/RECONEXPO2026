import React, { useState } from 'react';
import { 
  X, 
  Building, 
  MapPin, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Coffee, 
  Users, 
  Mic2,
  Store
} from 'lucide-react';

interface FloorPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookBooth: () => void;
}

export const FloorPlanModal: React.FC<FloorPlanModalProps> = ({
  isOpen,
  onClose,
  onBookBooth,
}) => {
  const [selectedZone, setSelectedZone] = useState<'auditorium' | 'pavilionA' | 'pavilionB' | 'dealRooms' | 'vipLounge'>('pavilionA');

  if (!isOpen) return null;

  const zones = [
    {
      id: 'pavilionA' as const,
      name: 'Pavilion A: Construction & Heavy Tech',
      booths: 'Booths A01 – A40',
      description: 'Houses 40 prime 3x3m and 6x6m booths showcasing pre-fabricated modular systems, cement conglomerates, heavy equipment, and 3D printing robotics.',
      status: '85% Booked (6 Booths Remaining)',
      icon: Store,
      color: '#22c55e'
    },
    {
      id: 'pavilionB' as const,
      name: 'Pavilion B: Luxury Real Estate & PropTech AI',
      booths: 'Booths B01 – B45',
      description: 'Dedicated to luxury residential developers, commercial REITs, smart home IoT automation, and real estate AI software showcases.',
      status: '90% Booked (4 Island Booths Remaining)',
      icon: Building,
      color: '#ef4444'
    },
    {
      id: 'auditorium' as const,
      name: 'Main Yar\'Adua Auditorium',
      booths: '1,200 Delegate Capacity',
      description: 'Grand Plenary Hall for Keynote presentations, Opening Ceremony, Federal Policy dialogues, and the RECON Excellence Awards Gala.',
      status: 'Fully Equipped with Dual 4K LED Walls',
      icon: Mic2,
      color: '#fbbf24'
    },
    {
      id: 'dealRooms' as const,
      name: 'Executive B2B Deal Rooms (1 & 2)',
      booths: 'Private Syndicate Suites',
      description: 'Acoustically isolated high-security deal structuring suites with multimedia projection, simultaneous translation, and private legal notary desk.',
      status: 'Reserved for VIP Delegates & Sponsors',
      icon: Users,
      color: '#38bdf8'
    },
    {
      id: 'vipLounge' as const,
      name: 'Emerald VIP Lounge & Networking Terrace',
      booths: 'All-Day Executive Hospitality',
      description: 'Curated networking lounge featuring barista coffee bars, open champagne buffet, and high-speed satellite Wi-Fi for C-level delegates.',
      status: 'All-Access Pass & Exhibitors',
      icon: Coffee,
      color: '#a855f7'
    }
  ];

  const currentZone = zones.find(z => z.id === selectedZone) || zones[0];

  return (
    <div 
      id="floor-plan-explorer-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-[#022c22]/95 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl my-8 text-left">
        
        {/* Close Button */}
        <button
          id="floorplan-modal-close-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-red-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider mb-2 backdrop-blur-sm">
            <Building className="w-3.5 h-3.5 text-emerald-400" />
            Interactive Venue & Expo Hall Layout
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Shehu Musa Yar'Adua Centre Layout
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Central Business District, Abuja • 3 Connected Exhibition Wings & Plenary Auditoriums
          </p>
        </div>

        {/* Zone Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
          {zones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => setSelectedZone(zone.id)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer backdrop-blur-sm ${
                selectedZone === zone.id
                  ? 'bg-emerald-500/25 border-emerald-400 text-white shadow-sm'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <zone.icon className="w-4 h-4 mb-1" style={{ color: zone.color }} />
              <p className="text-xs font-bold truncate">{zone.name.split(':')[0]}</p>
            </button>
          ))}
        </div>

        {/* Interactive Schematic Diagram & Zone Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* 2D/3D Style Vector Blueprint Floorplan */}
          <div className="lg:col-span-7 p-6 rounded-2xl glass-panel border border-white/15 relative overflow-hidden">
            <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider mb-3 flex items-center justify-between">
              <span>EXPO HALL BLUEPRINT SCHEMATIC</span>
              <span className="text-emerald-300">NORTH ENTRANCE ⬆</span>
            </div>

            {/* Visual Floor Grid Representation */}
            <div className="grid grid-cols-4 gap-2.5 p-3 bg-black/30 rounded-xl border border-white/10 text-center text-xs font-mono">
              {/* Entrance Foyer */}
              <div className="col-span-4 p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold">
                REGISTRATION FOYER & MAIN VIP ATRIUM
              </div>

              {/* Pavilion A */}
              <div 
                onClick={() => setSelectedZone('pavilionA')}
                className={`col-span-2 p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedZone === 'pavilionA'
                    ? 'bg-emerald-500/30 border-emerald-400 text-white shadow-md'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:border-emerald-500/50'
                }`}
              >
                <Store className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                <p className="font-bold">PAVILION A</p>
                <p className="text-[10px] text-slate-300">Construction Tech</p>
              </div>

              {/* Pavilion B */}
              <div 
                onClick={() => setSelectedZone('pavilionB')}
                className={`col-span-2 p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedZone === 'pavilionB'
                    ? 'bg-red-500/30 border-red-400 text-white shadow-md'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:border-red-400/50'
                }`}
              >
                <Building className="w-5 h-5 mx-auto mb-1 text-red-400" />
                <p className="font-bold">PAVILION B</p>
                <p className="text-[10px] text-slate-300">Luxury RE & AI</p>
              </div>

              {/* Auditorium */}
              <div 
                onClick={() => setSelectedZone('auditorium')}
                className={`col-span-4 p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedZone === 'auditorium'
                    ? 'bg-amber-500/30 border-amber-400 text-white shadow-md'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:border-amber-400/50'
                }`}
              >
                <Mic2 className="w-5 h-5 mx-auto mb-1 text-amber-300" />
                <p className="font-bold">MAIN PLENARY AUDITORIUM</p>
                <p className="text-[10px] text-slate-300">1,200 Seats • Keynotes & Gala</p>
              </div>

              {/* Deal Rooms & VIP Lounge */}
              <div 
                onClick={() => setSelectedZone('dealRooms')}
                className={`col-span-2 p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedZone === 'dealRooms'
                    ? 'bg-sky-500/30 border-sky-400 text-white'
                    : 'bg-white/5 border-white/10 text-slate-300'
                }`}
              >
                <p className="font-bold text-[11px]">B2B Deal Rooms</p>
              </div>

              <div 
                onClick={() => setSelectedZone('vipLounge')}
                className={`col-span-2 p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedZone === 'vipLounge'
                    ? 'bg-purple-500/30 border-purple-400 text-white'
                    : 'bg-white/5 border-white/10 text-slate-300'
                }`}
              >
                <p className="font-bold text-[11px]">VIP Emerald Lounge</p>
              </div>
            </div>

            <p className="text-[10px] text-slate-300 text-center mt-3">
              Click on any hall or wing above to view details & booth availability.
            </p>
          </div>

          {/* Zone Details Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl glass-panel border border-white/15">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">
                SELECTED ZONE
              </span>
              <h4 className="text-xl font-extrabold text-white font-heading mt-1">
                {currentZone.name}
              </h4>
              <p className="text-xs text-red-400 font-semibold mt-0.5">
                {currentZone.booths}
              </p>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                {currentZone.description}
              </p>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-emerald-300">
                <span>Status:</span>
                <span>{currentZone.status}</span>
              </div>
            </div>

            {/* Quick Action Button */}
            <button
              id="floorplan-reserve-booth-btn"
              onClick={() => {
                onClose();
                onBookBooth();
              }}
              className="w-full py-3.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-extrabold text-xs tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>RESERVE BOOTH IN THIS ZONE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
