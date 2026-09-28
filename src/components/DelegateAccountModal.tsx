import React, { useState } from 'react';
import { useExpoData } from '../context/ExpoDataContext';
import { SmartIdCard } from './SmartIdCard';
import { Attendee } from '../types';
import { X, Search, UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { playSound } from '../utils/soundService';

export const DelegateAccountModal: React.FC = () => {
  const { activeModal, closeModal, attendees } = useExpoData();
  const [query, setQuery] = useState('');
  const [foundAttendee, setFoundAttendee] = useState<Attendee | null>(null);
  const [searched, setSearched] = useState(false);

  if (activeModal !== 'delegateAccount') return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const q = query.trim().toLowerCase();
    const match = attendees.find(
      a => a.ticketNumber.toLowerCase() === q || a.email.toLowerCase() === q || a.phone.includes(q)
    );

    setSearched(true);
    if (match) {
      playSound('success');
      setFoundAttendee(match);
    } else {
      playSound('error');
      setFoundAttendee(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-950 border border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8 text-white">
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl bg-slate-900 border border-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <UserCheck className="w-4 h-4" />
            <span>Delegate Self-Service Portal</span>
          </div>
          <h2 className="text-2xl font-black text-white">Find & Reprint Smart Badge</h2>
          <p className="text-xs text-slate-400 mt-1">Enter your ticket number (e.g. RECON-VIS-1234) or registered email address.</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            required
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ticket No. or Email Address"
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 flex items-center gap-1.5 shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </form>

        {searched && !foundAttendee && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold">No registration found for "{query}"</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Please check for typos or register a new pass.</p>
            </div>
          </div>
        )}

        {foundAttendee && (
          <div className="py-2 flex flex-col items-center">
            <SmartIdCard attendee={foundAttendee} onClose={closeModal} />
          </div>
        )}
      </div>
    </div>
  );
};
