import React, { useState } from 'react';
import { useExpoData } from '../context/ExpoDataContext';
import { ScrollReveal } from './ScrollReveal';
import { DollarSign, Share2, Users, CheckCircle2, Copy, Check } from 'lucide-react';
import { playSound } from '../utils/soundService';

export const BecomeMarketerSection: React.FC = () => {
  const { registerMarketer } = useExpoData();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [bankName, setBankName] = useState('Zenith Bank');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [createdMarketer, setCreatedMarketer] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !referralCode) return;

    const m = registerMarketer({
      name,
      email,
      phone,
      referralCode: referralCode.trim().toUpperCase(),
      commissionRate: 15,
      bankName,
      accountNumber,
      accountName: accountName || name
    });

    setCreatedMarketer(m);
  };

  const copyLink = () => {
    if (!createdMarketer) return;
    const url = `${window.location.origin}/?ref=${createdMarketer.referralCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    playSound('click');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="affiliate" className="py-20 relative bg-gradient-to-b from-slate-950/80 to-slate-950 border-t border-emerald-500/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            {/* Accent background glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider mb-3">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Affiliate Partner Programme</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
                Earn 15% Commission as an Official RECON Ambassador
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Invite architects, developers, investors, and corporate delegates with your custom referral code. Earn ₦3,750 on every VIP ticket and ₦52,500 on every Exhibitor booth.
              </p>
            </div>

            {createdMarketer ? (
              <div className="max-w-md mx-auto bg-slate-950 border border-emerald-500/50 rounded-2xl p-6 text-center shadow-xl">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white">Ambassador Profile Created!</h3>
                <p className="text-xs text-emerald-400 font-mono font-bold mt-1">Code: {createdMarketer.referralCode}</p>
                <p className="text-xs text-slate-300 mt-2 mb-4">Share your personal accreditation link:</p>

                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-2 mb-4">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/?ref=${createdMarketer.referralCode}`}
                    className="bg-transparent text-xs text-slate-200 flex-1 outline-none font-mono"
                  />
                  <button
                    onClick={copyLink}
                    className="p-2 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-[11px] text-slate-400">
                  Track your clicks and payouts live through the Secretariat Admin portal.
                </p>
              </div>
            ) : !showForm ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setShowForm(true)}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-950/40 hover:brightness-110 active:scale-95 transition-all"
                >
                  Join Ambassador Program
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3 bg-slate-950/80 p-6 rounded-2xl border border-slate-800">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Arc. David Ibrahim"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="david@company.ng"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Custom Referral Code</label>
                    <input
                      type="text"
                      required
                      value={referralCode}
                      onChange={e => setReferralCode(e.target.value)}
                      placeholder="DAVID2026"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none uppercase font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Bank Name</label>
                    <input
                      type="text"
                      required
                      value={bankName}
                      onChange={e => setBankName(e.target.value)}
                      placeholder="Zenith Bank"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Account Number</label>
                    <input
                      type="text"
                      required
                      value={accountNumber}
                      onChange={e => setAccountNumber(e.target.value)}
                      placeholder="0123456789"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider hover:bg-amber-300"
                  >
                    Generate Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
