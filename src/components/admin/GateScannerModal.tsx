import React, { useState } from 'react';
import { useExpoData } from '../../context/ExpoDataContext';
import { X, QrCode, CheckCircle2, AlertCircle, Sparkles, User, ShieldCheck } from 'lucide-react';
import { playSound } from '../../utils/soundService';

export const GateScannerModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { checkInAttendee, attendees } = useExpoData();
  const [ticketInput, setTicketInput] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; attendee?: any } | null>(null);

  const handleManualCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;

    const result = checkInAttendee(ticketInput);
    setScanResult(result);
    setTicketInput('');
  };

  const handleQuickSelect = (ticketNumber: string) => {
    const result = checkInAttendee(ticketNumber);
    setScanResult(result);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-emerald-500/50 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-white">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl bg-slate-900 border border-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <QrCode className="w-4 h-4" />
            <span>Yar'Adua Centre Security Gate Scanner</span>
          </div>
          <h2 className="text-2xl font-black text-white">Live Gate Accreditation Check-In</h2>
          <p className="text-xs text-slate-400 mt-1">Scan physical smart RFID badges or enter ticket code.</p>
        </div>

        {/* Input barcode simulator */}
        <form onSubmit={handleManualCheckIn} className="flex gap-2 mb-6">
          <input
            type="text"
            required
            value={ticketInput}
            onChange={e => setTicketInput(e.target.value.toUpperCase())}
            placeholder="e.g. RECON-VIP-1234 or RECON-VIS-5678"
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono uppercase"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 flex items-center gap-1.5 shrink-0"
          >
            <span>Scan Pass</span>
          </button>
        </form>

        {/* Scan Status Alert Result */}
        {scanResult && (
          <div className={`p-4 rounded-2xl border mb-6 flex items-start gap-3.5 ${
            scanResult.success
              ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
              : 'bg-red-950/40 border-red-500/60 text-red-300'
          }`}>
            {scanResult.success ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
            )}

            <div className="flex-1 text-xs">
              <h4 className="font-extrabold text-sm mb-1">{scanResult.message}</h4>
              {scanResult.attendee && (
                <div className="space-y-1 text-slate-300 pt-1">
                  <p>Delegate: <strong className="text-white">{scanResult.attendee.fullName}</strong></p>
                  <p>Organization: {scanResult.attendee.organization}</p>
                  <p>Pass: <span className="font-bold uppercase text-amber-400">{scanResult.attendee.passType}</span></p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Check-in Queue */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Registered Attendees Queue ({attendees.length})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {attendees.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">No registered attendees in system.</p>
            ) : (
              attendees.map(a => (
                <div
                  key={a.id}
                  onClick={() => handleQuickSelect(a.ticketNumber)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    a.checkedIn
                      ? 'bg-slate-900/40 border-slate-800 opacity-60'
                      : 'bg-slate-900 border-emerald-500/30 hover:border-emerald-400'
                  }`}
                >
                  <div className="text-xs">
                    <span className="font-mono font-bold text-emerald-400">{a.ticketNumber}</span>
                    <p className="font-bold text-white mt-0.5">{a.fullName}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      a.checkedIn
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {a.checkedIn ? 'CHECKED IN ✓' : 'TAP TO ACCREDIT'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
