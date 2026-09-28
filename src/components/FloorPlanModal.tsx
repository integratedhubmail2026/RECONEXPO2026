import React, { useState } from 'react';
import { useExpoData } from '../context/ExpoDataContext';
import { X, LayoutGrid, CheckCircle2, Building2, Search, Info } from 'lucide-react';
import { ExhibitionBooth } from '../types';
import { playSound } from '../utils/soundService';

export const FloorPlanModal: React.FC = () => {
  const { activeModal, closeModal, booths, reserveBooth } = useExpoData();
  const [selectedHall, setSelectedHall] = useState<string>('All');
  const [selectedBooth, setSelectedBooth] = useState<ExhibitionBooth | null>(null);
  const [reserveCompanyName, setReserveCompanyName] = useState('');
  const [reserveSuccess, setReserveSuccess] = useState(false);

  if (activeModal !== 'floorPlan') return null;

  const halls = ['All', 'Hall A - Main Auditorium', 'Hall B - Innovation Pavilion', 'Outdoor Plaza'];

  const filteredBooths = selectedHall === 'All'
    ? booths
    : booths.filter(b => b.hall === selectedHall);

  const handleBoothClick = (booth: ExhibitionBooth) => {
    playSound('click');
    setSelectedBooth(booth);
    setReserveSuccess(false);
  };

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooth || !reserveCompanyName) return;
    const ok = reserveBooth(selectedBooth.id, reserveCompanyName);
    if (ok) {
      playSound('success');
      setReserveSuccess(true);
      setReserveCompanyName('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-950 border border-emerald-500/40 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        <button
          onClick={closeModal}
          className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded-xl bg-slate-900 border border-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <LayoutGrid className="w-4 h-4" />
            <span>Interactive Exhibition Hall & Booth Map</span>
          </div>
          <h2 className="text-2xl font-black text-white">Shehu Musa Yar'Adua Centre Floor Plan</h2>
          <p className="text-xs text-slate-400 mt-1">Browse available shell scheme exhibition booths and reserve space for your brand.</p>
        </div>

        {/* Hall Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {halls.map(hall => (
            <button
              key={hall}
              onClick={() => {
                playSound('click');
                setSelectedHall(hall);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedHall === hall
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {hall}
            </button>
          ))}
        </div>

        {/* Booth Grid Map */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6 max-h-72 overflow-y-auto p-2 bg-slate-900/50 rounded-2xl border border-slate-800">
          {filteredBooths.map(booth => (
            <div
              key={booth.id}
              onClick={() => handleBoothClick(booth)}
              className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                selectedBooth?.id === booth.id
                  ? 'ring-2 ring-emerald-400 bg-emerald-950/60 border-emerald-400'
                  : booth.status === 'available'
                  ? 'bg-emerald-950/20 border-emerald-500/40 hover:bg-emerald-900/30'
                  : booth.status === 'reserved'
                  ? 'bg-amber-950/20 border-amber-500/40 opacity-80'
                  : 'bg-slate-900/60 border-slate-700 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-xs text-white">{booth.id}</span>
                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                  booth.status === 'available'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : booth.status === 'reserved'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {booth.status}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-200 truncate">{booth.name}</p>
              <p className="text-[10px] text-slate-400 mt-1">{booth.size} • ₦{(booth.priceNgn / 1000).toFixed(0)}k</p>
              {booth.exhibitorName && (
                <p className="text-[10px] text-emerald-400 font-medium truncate mt-1">👤 {booth.exhibitorName}</p>
              )}
            </div>
          ))}
        </div>

        {/* Selected Booth Details Drawer */}
        {selectedBooth && (
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                  {selectedBooth.id} • {selectedBooth.hall}
                </span>
                <h3 className="text-lg font-black text-white mt-1">{selectedBooth.name}</h3>
                <p className="text-xs text-slate-300">
                  Size: <strong className="text-white">{selectedBooth.size}</strong> • Price: <strong className="text-emerald-400">₦{selectedBooth.priceNgn.toLocaleString()}</strong>
                </p>
              </div>

              {selectedBooth.status === 'available' ? (
                reserveSuccess ? (
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Booth Reserved Successfully!</span>
                  </div>
                ) : (
                  <form onSubmit={handleReserve} className="flex gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      required
                      value={reserveCompanyName}
                      onChange={e => setReserveCompanyName(e.target.value)}
                      placeholder="Company Name"
                      className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 whitespace-nowrap"
                    >
                      Reserve Booth
                    </button>
                  </form>
                )
              ) : (
                <div className="text-xs text-slate-400 font-medium">
                  Status: <span className="uppercase text-amber-400 font-bold">{selectedBooth.status}</span> by {selectedBooth.exhibitorName || 'Official Sponsor'}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={closeModal}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-800"
          >
            Close Floor Plan
          </button>
        </div>
      </div>
    </div>
  );
};
