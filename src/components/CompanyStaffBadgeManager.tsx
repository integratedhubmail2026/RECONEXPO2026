import React, { useState } from 'react';
import { useExpoData } from '../context/ExpoDataContext';
import { X, Users, Plus, Trash2, ShieldCheck, Printer } from 'lucide-react';
import { playSound } from '../utils/soundService';

export const CompanyStaffBadgeManager: React.FC = () => {
  const { activeModal, closeModal, staffBadges, addStaffBadge, deleteStaffBadge } = useExpoData();
  const [exhibitorName, setExhibitorName] = useState('');
  const [boothNumber, setBoothNumber] = useState('Booth A-03');
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('Technical Sales Lead');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  if (activeModal !== 'staffManager') return null;

  const handleAdd = (e: React.FormEvent) => {
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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-950 border border-emerald-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 text-white">
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl bg-slate-900 border border-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Exhibitor Portal</span>
          </div>
          <h2 className="text-2xl font-black text-white">Company Staff Badges Manager</h2>
          <p className="text-xs text-slate-400 mt-1">Generate and print up to 5 complimentary exhibitor staff passes for your booth team.</p>
        </div>

        {/* Add Staff Form */}
        <form onSubmit={handleAdd} className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3 mb-6">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Company / Exhibitor</label>
              <input
                type="text"
                required
                value={exhibitorName}
                onChange={e => setExhibitorName(e.target.value)}
                placeholder="e.g. Dangote Cement"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Booth Location</label>
              <input
                type="text"
                value={boothNumber}
                onChange={e => setBoothNumber(e.target.value)}
                placeholder="Booth A-01"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Staff Full Name</label>
              <input
                type="text"
                required
                value={staffName}
                onChange={e => setStaffName(e.target.value)}
                placeholder="e.g. Engr. Yusuf Bello"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Staff Designation</label>
              <input
                type="text"
                value={staffRole}
                onChange={e => setStaffRole(e.target.value)}
                placeholder="Booth Demonstrator"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-950/40"
            >
              <Plus className="w-4 h-4" />
              <span>Generate Staff Badge</span>
            </button>
          </div>
        </form>

        {/* Existing Staff Badges List */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Issued Staff Passes ({staffBadges.length})
          </h4>
          {staffBadges.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">No staff badges issued yet.</p>
          ) : (
            staffBadges.map(staff => (
              <div
                key={staff.id}
                className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                      {staff.badgeCode}
                    </span>
                    <h4 className="text-xs font-bold text-white">{staff.staffName}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {staff.staffRole} • <span className="text-emerald-400">{staff.exhibitorName} ({staff.boothNumber})</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      playSound('badge_print');
                      window.print();
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Print Staff Pass"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteStaffBadge(staff.id)}
                    className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400"
                    title="Revoke Badge"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
