import React, { useState } from 'react';
import { useExpoData } from '../context/ExpoDataContext';
import { PhotoCaptureStudio } from './PhotoCaptureStudio';
import { SmartIdCard } from './SmartIdCard';
import { FlutterwaveCheckoutModal } from './FlutterwaveCheckoutModal';
import { PassTier, Attendee } from '../types';
import { TICKET_TIERS } from '../data/expoData';
import { X, UserPlus, Sparkles, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';
import { playSound } from '../utils/soundService';

export const RegistrationModal: React.FC = () => {
  const {
    activeModal,
    closeModal,
    selectedTierForModal,
    setSelectedTierForModal,
    registerAttendee,
    marketers
  } = useExpoData();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('Principal Architect / Developer');
  const [city, setCity] = useState('Abuja (FCT)');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [referralCode, setReferralCode] = useState('');
  const [notes, setNotes] = useState('');

  const [showPaymentCheckout, setShowPaymentCheckout] = useState(false);
  const [createdAttendee, setCreatedAttendee] = useState<Attendee | null>(null);

  if (activeModal !== 'registration') return null;

  const currentTier = TICKET_TIERS.find(t => t.id === selectedTierForModal) || TICKET_TIERS[0];
  const requiresPayment = currentTier.priceNgn > 0;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    if (requiresPayment) {
      setShowPaymentCheckout(true);
    } else {
      // Free Trade Visitor pass
      const newAtt = registerAttendee({
        fullName,
        email,
        phone,
        organization: organization || 'Independent Consultant',
        role,
        passType: 'visitor',
        city,
        photoUrl,
        referralCode: referralCode.trim().toUpperCase(),
        amountPaid: 0,
        paymentStatus: 'FREE'
      });
      setCreatedAttendee(newAtt);
    }
  };

  const handlePaymentSuccess = (txData: any) => {
    setShowPaymentCheckout(false);
    const newAtt = registerAttendee({
      fullName,
      email,
      phone,
      organization: organization || 'Corporate Enterprise',
      role,
      passType: selectedTierForModal,
      city,
      photoUrl,
      referralCode: referralCode.trim().toUpperCase(),
      amountPaid: currentTier.priceNgn,
      paymentStatus: 'PAID',
      paymentRef: txData.tx_ref
    });
    setCreatedAttendee(newAtt);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      {showPaymentCheckout ? (
        <FlutterwaveCheckoutModal
          amount={currentTier.priceNgn}
          currency="NGN"
          attendeeName={fullName}
          attendeeEmail={email}
          attendeePhone={phone}
          passTitle={currentTier.name}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPaymentCheckout(false)}
        />
      ) : (
        <div className="bg-slate-950 border border-emerald-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 text-white">
          <button
            onClick={closeModal}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl bg-slate-900 border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          {createdAttendee ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-400 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white">Official Accreditation Confirmed!</h3>
              <p className="text-xs text-emerald-400 font-mono font-bold mb-6">
                Ticket Number: {createdAttendee.ticketNumber}
              </p>

              {/* Render the Smart ID Badge */}
              <div className="my-6">
                <SmartIdCard attendee={createdAttendee} onClose={closeModal} />
              </div>

              <p className="text-xs text-slate-400 mt-4">
                A digital confirmation copy and printable pass has been dispatched to <strong>{createdAttendee.email}</strong>.
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                  <UserPlus className="w-4 h-4" />
                  <span>Official Delegate Accreditation Portal</span>
                </div>
                <h2 className="text-2xl font-black text-white">RECON Expo 2026 Registration</h2>
                <p className="text-xs text-slate-400 mt-1">Fill out your badge credentials to generate your encrypted smart ID card.</p>
              </div>

              {/* Pass Tier Selector Tabs */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {TICKET_TIERS.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      playSound('click');
                      setSelectedTierForModal(t.id);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedTierForModal === t.id
                        ? 'border-emerald-400 bg-emerald-500/20 ring-1 ring-emerald-400'
                        : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-400'
                    }`}
                  >
                    <div className="text-[10px] font-bold uppercase">{t.badgeTag}</div>
                    <div className="text-xs font-extrabold text-white mt-0.5">
                      {t.priceNgn === 0 ? 'FREE' : `₦${(t.priceNgn / 1000).toFixed(0)}k`}
                    </div>
                  </button>
                ))}
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Photo Studio */}
                <PhotoCaptureStudio
                  onPhotoCaptured={(url) => setPhotoUrl(url)}
                  initialPhotoUrl={photoUrl}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Full Name (with Title)</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Arc. Babatunde Sanusi"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="babatunde@sanusiarchitects.ng"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+234 803 123 4567"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Organization / Firm</label>
                    <input
                      type="text"
                      value={organization}
                      onChange={e => setOrganization(e.target.value)}
                      placeholder="e.g. Skyline Urban Developers Ltd"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Designation / Role</label>
                    <input
                      type="text"
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      placeholder="e.g. Managing Director"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Location / State</label>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="Abuja (FCT)"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Marketer Referral Code */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Ambassador / Referral Code (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={referralCode}
                      onChange={e => setReferralCode(e.target.value.toUpperCase())}
                      placeholder="e.g. EMMA2026"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono uppercase"
                    />
                    <Tag className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-2.5" />
                  </div>
                </div>

                {/* Total & Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-emerald-950/80 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span>
                      {requiresPayment ? `Proceed to Secure Payment (₦${currentTier.priceNgn.toLocaleString()})` : 'Confirm Free Visitor Accreditation'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
