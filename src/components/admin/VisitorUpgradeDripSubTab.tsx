import React, { useState } from 'react';
import { useExpoData } from '../../context/ExpoDataContext';
import { Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { playSound } from '../../utils/soundService';

export const VisitorUpgradeDripSubTab: React.FC = () => {
  const { attendees } = useExpoData();
  const visitors = attendees.filter(a => a.passType === 'visitor');
  const [isSending, setIsSending] = useState(false);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  const handleBroadcastDrip = async () => {
    if (visitors.length === 0) return;
    setIsSending(true);
    playSound('click');

    setTimeout(() => {
      setIsSending(false);
      setSuccessCount(visitors.length);
      playSound('success');
    }, 1200);
  };

  return (
    <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-white text-sm">Visitor-to-VIP Automated Upgrade Drip</h4>
          <p className="text-slate-400 text-[11px]">Automatically invite trade visitors to upgrade to the Elite VIP pass.</p>
        </div>
        <span className="font-mono font-bold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30">
          {visitors.length} Trade Visitors
        </span>
      </div>

      {successCount !== null && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Broadcast sent to {successCount} visitors successfully!</span>
        </div>
      )}

      <button
        onClick={handleBroadcastDrip}
        disabled={isSending || visitors.length === 0}
        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:brightness-110 flex items-center gap-1.5 disabled:opacity-50"
      >
        <Send className="w-3.5 h-3.5" />
        <span>{isSending ? 'Sending Drips...' : `Broadcast VIP Upgrade to ${visitors.length} Visitors`}</span>
      </button>
    </div>
  );
};
