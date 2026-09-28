import React, { useState } from 'react';
import { useExpoData } from '../../context/ExpoDataContext';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { playSound } from '../../utils/soundService';

export const UnconfirmedVipRecoverySubTab: React.FC = () => {
  const { attendees } = useExpoData();
  const unconfirmed = attendees.filter(a => a.passType === 'elite' && a.paymentStatus === 'PENDING');
  const [isSending, setIsSending] = useState(false);
  const [sentNotice, setSentNotice] = useState(false);

  const handleRecover = () => {
    setIsSending(true);
    playSound('click');
    setTimeout(() => {
      setIsSending(false);
      setSentNotice(true);
      playSound('success');
    }, 1000);
  };

  return (
    <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-white text-sm">Unconfirmed VIP & Exhibitor Recovery</h4>
          <p className="text-slate-400 text-[11px]">Send recovery links to delegates with pending payments.</p>
        </div>
        <span className="font-mono font-bold text-red-300 bg-red-500/20 px-2.5 py-1 rounded-lg border border-red-500/30">
          {unconfirmed.length} Pending
        </span>
      </div>

      {sentNotice && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Payment reminders sent!</span>
        </div>
      )}

      <button
        onClick={handleRecover}
        disabled={isSending || unconfirmed.length === 0}
        className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-bold text-xs uppercase hover:bg-red-400 flex items-center gap-1.5 disabled:opacity-50"
      >
        <Mail className="w-3.5 h-3.5" />
        <span>{isSending ? 'Sending...' : `Send Recovery Reminder (${unconfirmed.length})`}</span>
      </button>
    </div>
  );
};
