import React, { useState } from 'react';
import { useExpoData } from '../context/ExpoDataContext';
import { X, CreditCard, ShieldCheck, CheckCircle2, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { processSimulatedFlutterwavePayment } from '../services/flutterwave';
import { playSound } from '../utils/soundService';

interface FlutterwaveCheckoutModalProps {
  onSuccess: (txData: any) => void;
  onClose: () => void;
  amount: number;
  currency?: 'NGN' | 'USD';
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  passTitle: string;
}

export const FlutterwaveCheckoutModal: React.FC<FlutterwaveCheckoutModalProps> = ({
  onSuccess,
  onClose,
  amount,
  currency = 'NGN',
  attendeeName,
  attendeeEmail,
  attendeePhone,
  passTitle
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'ussd'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('5399 4100 8923 1290');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('883');

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    playSound('click');

    try {
      const tx = await processSimulatedFlutterwavePayment(
        amount,
        currency,
        { name: attendeeName, email: attendeeEmail, phone: attendeePhone },
        passTitle
      );
      playSound('success');
      onSuccess(tx);
    } catch (err) {
      playSound('error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-emerald-500/50 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-white">
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl bg-slate-900 border border-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Flutterwave Branded Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm border border-amber-500/40">
              FLW
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight">Flutterwave Secure Checkout</h3>
              <p className="text-[10px] text-slate-400">256-bit Encrypted SSL Gateway</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-emerald-400 font-mono">
              ₦{amount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 mb-6 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Pass Type:</span>
            <span className="text-white font-bold">{passTitle}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Delegate:</span>
            <span className="text-white">{attendeeName}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Email:</span>
            <span className="text-white font-mono">{attendeeEmail}</span>
          </div>
        </div>

        {/* Payment Channels */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
              paymentMethod === 'card'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Debit / Credit Card
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('transfer')}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
              paymentMethod === 'transfer'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Bank Transfer
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('ussd')}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
              paymentMethod === 'ussd'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            USSD *737#
          </button>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePay} className="space-y-4">
          {paymentMethod === 'card' && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
                  />
                  <CreditCard className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    required
                    value={expiry}
                    onChange={e => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">CVV / CVC</label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    value={cvv}
                    onChange={e => setCvv(e.target.value)}
                    placeholder="123"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </>
          )}

          {paymentMethod === 'transfer' && (
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <p className="font-semibold text-white">Transfer to Wema Bank / Flutterwave Virtual Account:</p>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-emerald-400 font-bold text-center">
                0129849201 • RECON Expo Secretariat
              </div>
              <p className="text-[11px] text-slate-400">Instant automated confirmation within 30 seconds of transfer.</p>
            </div>
          )}

          {paymentMethod === 'ussd' && (
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2 text-center">
              <p className="font-semibold text-white">Dial on your registered phone:</p>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-amber-400 font-bold text-base">
                *737*50*25000*849#
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-emerald-950/80 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Pay ₦{amount.toLocaleString()} Now</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
