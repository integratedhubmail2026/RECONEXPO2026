import React, { useState } from 'react';
import { Mail, Send, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { VisitorUpgradeDripSubTab } from './VisitorUpgradeDripSubTab';
import { UnconfirmedVipRecoverySubTab } from './UnconfirmedVipRecoverySubTab';
import { DEFAULT_EMAIL_TEMPLATES } from '../../services/marketingService';
import { playSound } from '../../utils/soundService';

export const EmailMarketingSuiteTab: React.FC = () => {
  const [subTab, setSubTab] = useState<'broadcast' | 'drip' | 'recovery'>('broadcast');
  const [broadcastSubject, setBroadcastSubject] = useState('Important Update: RECON Expo 2026 Keynote Schedule & Gate Pass Instructions');
  const [broadcastMessage, setBroadcastMessage] = useState('Dear Accredited Delegate,\n\nWe look forward to welcoming you to the Shehu Musa Yar\'Adua Centre for RECON Expo 2026.');
  const [isSending, setIsSending] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    playSound('click');

    try {
      await fetch('/api/smtp/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: broadcastSubject, message: broadcastMessage, recipientType: 'all' })
      });
      setBroadcastSuccess(true);
      playSound('success');
    } catch (e) {}
    setIsSending(false);
  };

  return (
    <div className="space-y-6 text-white text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-black">Email Marketing & Automations Suite</h3>
          <p className="text-slate-400 text-[11px]">Send mass delegate announcements, visitor upgrade drips, and template workflows.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSubTab('broadcast')}
            className={`px-3 py-1.5 rounded-xl font-bold ${subTab === 'broadcast' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
          >
            Broadcast
          </button>
          <button
            onClick={() => setSubTab('drip')}
            className={`px-3 py-1.5 rounded-xl font-bold ${subTab === 'drip' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
          >
            Upgrade Drip
          </button>
          <button
            onClick={() => setSubTab('recovery')}
            className={`px-3 py-1.5 rounded-xl font-bold ${subTab === 'recovery' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
          >
            VIP Recovery
          </button>
        </div>
      </div>

      {subTab === 'drip' && <VisitorUpgradeDripSubTab />}
      {subTab === 'recovery' && <UnconfirmedVipRecoverySubTab />}

      {subTab === 'broadcast' && (
        <form onSubmit={handleSendBroadcast} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Broadcast Email Subject</label>
            <input
              type="text"
              required
              value={broadcastSubject}
              onChange={e => setBroadcastSubject(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Message Body</label>
            <textarea
              rows={4}
              required
              value={broadcastMessage}
              onChange={e => setBroadcastMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {broadcastSuccess && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Broadcast queued and delivered to all registered delegates!</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSending}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-emerald-400 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Dispatching...' : 'Dispatch Email Broadcast'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
