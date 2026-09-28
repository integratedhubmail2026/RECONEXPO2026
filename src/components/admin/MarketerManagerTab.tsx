import React, { useState } from 'react';
import { useExpoData } from '../../context/ExpoDataContext';
import { DollarSign, CheckCircle, Ban, Copy, Check, Users } from 'lucide-react';
import { playSound } from '../../utils/soundService';

export const MarketerManagerTab: React.FC = () => {
  const { marketers, updateMarketerStatus } = useExpoData();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const totalEarnedAll = marketers.reduce((acc, m) => acc + m.totalEarnedNgn, 0);
  const totalConversions = marketers.reduce((acc, m) => acc + m.conversionsCount, 0);

  const copyRefLink = (code: string) => {
    const url = `${window.location.origin}/?ref=${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    playSound('click');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6 text-white text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-black">Ambassador & Affiliate Marketers</h3>
          <p className="text-slate-400 text-[11px]">Track referral codes, delegate ticket conversions, and bank payout requests.</p>
        </div>
        <div className="flex gap-2">
          <span className="text-xs font-mono font-bold px-3 py-1 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-500/30">
            Total Commission: ₦{totalEarnedAll.toLocaleString()}
          </span>
          <span className="text-xs font-mono font-bold px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30">
            Conversions: {totalConversions}
          </span>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {marketers.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No ambassador accounts created yet.</p>
        ) : (
          marketers.map(m => (
            <div key={m.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-xs bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded border border-amber-400/30">
                    {m.referralCode}
                  </span>
                  <h4 className="font-bold text-white text-sm">{m.name}</h4>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    m.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {m.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">{m.email} • {m.phone}</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Payout: {m.bankName} ({m.accountNumber}) • {m.accountName}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-emerald-400 font-mono font-bold text-sm">₦{m.totalEarnedNgn.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400">{m.conversionsCount} sales ({m.totalClicks} clicks)</div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => copyRefLink(m.referralCode)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Copy Referral Link"
                  >
                    {copiedCode === m.referralCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>

                  {m.status === 'active' ? (
                    <button
                      onClick={() => updateMarketerStatus(m.id, 'suspended')}
                      className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900 text-red-400"
                      title="Suspend Marketer"
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => updateMarketerStatus(m.id, 'active')}
                      className="p-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900 text-emerald-400"
                      title="Activate Marketer"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
