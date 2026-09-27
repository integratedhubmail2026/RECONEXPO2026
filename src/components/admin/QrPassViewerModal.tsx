import React, { useRef } from 'react';
import { 
  X, 
  QrCode, 
  Download, 
  Printer, 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Sparkles, 
  Store, 
  Handshake, 
  Ticket, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { AttendeeTicket } from '../../types';

interface QrPassViewerModalProps {
  ticket: AttendeeTicket | null;
  onClose: () => void;
  onToggleCheckIn: (ticketNumber: string) => boolean;
  onViewFullIdCard: (ticket: AttendeeTicket) => void;
  showToast: (msg: string) => void;
}

export const QrPassViewerModal: React.FC<QrPassViewerModalProps> = ({
  ticket,
  onClose,
  onToggleCheckIn,
  onViewFullIdCard,
  showToast
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  if (!ticket) return null;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(ticket.ticketNumber)}&margin=10`;
  const isExhibitor = (ticket.passType || ticket.tier || '').toLowerCase().includes('exhibitor');
  const isSponsor = (ticket.passType || ticket.tier || '').toLowerCase().includes('sponsor');
  const isPartner = (ticket.passType || ticket.tier || '').toLowerCase().includes('partner');
  const isElite = (ticket.passType || ticket.tier || '').toLowerCase().includes('elite') || (ticket.passType || ticket.tier || '').toLowerCase().includes('vip');

  const handleDownloadQrImage = async () => {
    try {
      showToast('Downloading high-resolution QR code image...');
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `QR_Code_${ticket.fullName.replace(/\s+/g, '_')}_${ticket.ticketNumber}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      showToast('QR Code image downloaded successfully!');
    } catch (err) {
      console.error(err);
      window.open(qrImageUrl, '_blank');
    }
  };

  const handlePrintQrPass = () => {
    const printWindow = window.open('', '_blank', 'width=600,height=750');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Digital QR Pass - ${ticket.fullName}</title>
          <style>
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              background-color: #f8fafc;
              margin: 0;
              padding: 40px 20px;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .pass-card {
              width: 380px;
              background: #022c22;
              color: #ffffff;
              border-radius: 20px;
              padding: 28px;
              text-align: center;
              box-shadow: 0 10px 30px rgba(0,0,0,0.3);
              border: 3px solid #10b981;
            }
            .header-title {
              font-size: 18px;
              font-weight: 900;
              color: #10b981;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 4px;
            }
            .sub-header {
              font-size: 11px;
              color: #a7f3d0;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 18px;
            }
            .qr-container {
              background: #ffffff;
              padding: 16px;
              border-radius: 16px;
              display: inline-block;
              margin-bottom: 18px;
            }
            .qr-img {
              width: 220px;
              height: 220px;
              display: block;
            }
            .ticket-num {
              font-family: monospace;
              font-size: 16px;
              font-weight: bold;
              color: #34d399;
              letter-spacing: 1px;
              margin-bottom: 12px;
            }
            .delegate-name {
              font-size: 20px;
              font-weight: 800;
              color: #ffffff;
              margin-bottom: 4px;
            }
            .delegate-org {
              font-size: 13px;
              color: #cbd5e1;
              margin-bottom: 14px;
            }
            .pass-badge {
              display: inline-block;
              padding: 6px 16px;
              background: #059669;
              color: #ffffff;
              font-size: 12px;
              font-weight: bold;
              border-radius: 20px;
              text-transform: uppercase;
            }
            @media print {
              body { background: none; padding: 0; }
              .pass-card { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="pass-card">
            <div class="header-title">RECON EXPO 2026</div>
            <div class="sub-header">Official Gate Access Credential</div>
            
            <div class="qr-container">
              <img src="${qrImageUrl}" class="qr-img" alt="QR Code" />
            </div>

            <div class="ticket-num">${ticket.ticketNumber}</div>
            <div class="delegate-name">${ticket.fullName}</div>
            <div class="delegate-org">${ticket.organization || 'Registered Delegate'} • ${ticket.role || 'Official'}</div>
            <div class="pass-badge">${ticket.tier || 'OFFICIAL PASS'}</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-5 animate-scale-up">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                Digital QR Check-In Pass
              </h3>
              <p className="text-[11px] text-slate-400">Scan at venue entrance gate</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Pass Printable Card Box */}
        <div 
          ref={cardRef}
          className="bg-gradient-to-b from-slate-950 via-[#022c22] to-slate-950 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-4 shadow-inner relative overflow-hidden"
        >
          {/* Subtle Background Badge Ribbon */}
          <div className="text-[10px] uppercase font-mono font-bold tracking-widest text-emerald-400/80 bg-emerald-500/10 py-1 px-3 rounded-full border border-emerald-500/20 inline-block">
            RECON EXPO 2026 • OFFICIAL ACCESS
          </div>

          {/* High-Res QR Code Image Container */}
          <div className="flex justify-center my-2">
            <div className="p-3.5 bg-white rounded-2xl shadow-xl border-2 border-emerald-400/60 inline-block">
              <img 
                src={qrImageUrl} 
                alt={`QR Code for ${ticket.ticketNumber}`}
                className="w-52 h-52 block object-contain"
              />
            </div>
          </div>

          {/* Ticket Number & Barcode display */}
          <div>
            <span className="font-mono text-base font-bold text-emerald-300 tracking-wider block">
              {ticket.ticketNumber}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Barcode: {ticket.barcode || ticket.ticketNumber.replace(/-/g, '')}
            </span>
          </div>

          {/* Delegate / Exhibitor Details */}
          <div className="pt-2 border-t border-slate-800">
            <h4 className="text-lg font-bold text-white leading-tight">{ticket.fullName}</h4>
            <p className="text-xs text-slate-300 mt-0.5">{ticket.organization || 'Independent Delegate'} • <span className="text-slate-400">{ticket.role || 'Participant'}</span></p>

            <div className="flex items-center justify-center gap-2 mt-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border flex items-center gap-1 ${
                isExhibitor ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                isSponsor ? 'bg-red-600/30 text-red-200 border-red-500/40' :
                isPartner ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                isElite ? 'bg-amber-400/20 text-amber-300 border-amber-400/40' :
                'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                {isExhibitor && <Store className="w-3.5 h-3.5 text-amber-400" />}
                {isSponsor && <Sparkles className="w-3.5 h-3.5 text-red-400" />}
                {isPartner && <Handshake className="w-3.5 h-3.5 text-purple-300" />}
                {isElite && <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />}
                {!isExhibitor && !isSponsor && !isPartner && !isElite && <Ticket className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{ticket.tier || ticket.passType?.toUpperCase()}</span>
              </span>

              {/* Gate Check-In Status Tag */}
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase flex items-center gap-1 ${
                ticket.checkedIn 
                  ? 'bg-emerald-500 text-emerald-950' 
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {ticket.checkedIn ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                <span>{ticket.checkedIn ? 'CHECKED IN' : 'PENDING GATE'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-2 pt-1">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDownloadQrImage}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download QR PNG</span>
            </button>

            <button
              onClick={handlePrintQrPass}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>Print Pass Badge</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const ok = onToggleCheckIn(ticket.ticketNumber);
                if (ok) {
                  showToast(ticket.checkedIn ? `Gate check-in cancelled` : `Checked In: ${ticket.fullName}`);
                }
              }}
              className={`flex-1 py-2.5 px-4 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                ticket.checkedIn 
                  ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>{ticket.checkedIn ? 'Cancel Check-In' : 'Mark Checked In at Gate'}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onViewFullIdCard(ticket);
              }}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title="View full Smart ID Card with vertical ribbons & details"
            >
              <span>Full Badge</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
