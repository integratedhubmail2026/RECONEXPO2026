import React, { useState } from 'react';
import { useExpoData } from '../../context/ExpoDataContext';
import { Users, Plus, Trash2, Printer } from 'lucide-react';
import { playSound } from '../../utils/soundService';

export const StaffManagerTab: React.FC = () => {
  const { staffBadges, addStaffBadge, deleteStaffBadge } = useExpoData();
  const [exhibitorName, setExhibitorName] = useState('');
  const [boothNumber, setBoothNumber] = useState('Booth A-01');
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('Senior Sales Lead');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exhibitorName || !staffName) return;

    addStaffBadge({
      exhibitorName,
      boothNumber,
      staffName,
      staffRole,
      email,
      phone
    });

    setStaffName('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="space-y-6 text-white text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-black">Exhibitor Staff Passes Registry</h3>
          <p className="text-slate-400 text-[11px]">Issue and manage complimentary staff passes for all corporate exhibition stands.</p>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1 bg-purple-500/20 text-purple-300 rounded-xl border border-purple-500/30">
          Total Staff: {staffBadges.length}
        </span>
      </div>

      <form onSubmit={handleCreate} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
        <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-2">Issue New Staff Pass</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Exhibiting Company</label>
            <input
              type="text"
              required
              value={exhibitorName}
              onChange={e => setExhibitorName(e.target.value)}
              placeholder="e.g. Dangote Cement Plc"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Booth Number</label>
            <input
              type="text"
              value={boothNumber}
              onChange={e => setBoothNumber(e.target.value)}
              placeholder="Booth A-01"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Staff Full Name</label>
            <input
              type="text"
              required
              value={staffName}
              onChange={e => setStaffName(e.target.value)}
              placeholder="e.g. Engr. Aliyu Hassan"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Staff Role</label>
            <input
              type="text"
              value={staffRole}
              onChange={e => setStaffRole(e.target.value)}
              placeholder="Technical Demonstrator"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-950/50"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Official Staff Pass</span>
          </button>
        </div>
      </form>

      <div className="space-y-2 max-h-72 overflow-y-auto">
        {staffBadges.map(staff => (
          <div key={staff.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">
                  {staff.badgeCode}
                </span>
                <h4 className="font-bold text-white text-xs">{staff.staffName}</h4>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {staff.staffRole} • <span className="text-emerald-400 font-semibold">{staff.exhibitorName} ({staff.boothNumber})</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playSound('badge_print');
                  window.print();
                }}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Print Pass"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteStaffBadge(staff.id)}
                className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900 text-red-400"
                title="Revoke Pass"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
