import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useExpoData } from '../context/ExpoDataContext';

export const WhatsAppSupportButton: React.FC = () => {
  const { expoDetails } = useExpoData();
  const [showTooltip, setShowTooltip] = useState(true);

  // Get WhatsApp number from Admin config, with fallback
  const rawNumber = expoDetails.whatsapp || expoDetails.contactPhone2 || expoDetails.contactPhone || '+234 803 982 7711';
  
  // Format digits for wa.me URL
  let digits = rawNumber.replace(/[^0-9]/g, '');
  if (digits.startsWith('0')) {
    digits = '234' + digits.slice(1);
  }
  if (!digits.startsWith('234') && digits.length === 10) {
    digits = '234' + digits;
  }
  const cleanPhone = digits || '2348039827711';

  const defaultMsg = encodeURIComponent('Hello RECON Expo Secretariat, I would like to inquire about registration, delegate passes, or exhibition booths.');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${defaultMsg}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 group">
      {/* Tooltip Badge */}
      {showTooltip && (
        <div className="relative bg-slate-900/95 backdrop-blur-md text-white text-xs px-3.5 py-2 rounded-2xl border border-emerald-500/30 shadow-2xl shadow-emerald-950/80 flex items-center gap-2 animate-bounce-slow max-w-[240px]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <div className="leading-tight">
            <span className="font-bold text-emerald-300 block text-[11px]">Secretariat Online</span>
            <span className="text-[10px] text-slate-300">Need help? Chat with us on WhatsApp</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-400 hover:text-white p-0.5 rounded-full hover:bg-white/10 transition-colors ml-1"
            title="Dismiss"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white p-3.5 sm:p-4 rounded-full shadow-2xl shadow-emerald-500/50 border border-emerald-300/40 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group/btn"
      >
        {/* Pulsing Outer Ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-pulse pointer-events-none"></span>

        {/* Custom WhatsApp SVG Icon */}
        <svg
          className="w-7 h-7 fill-current text-white relative z-10 transition-transform group-hover/btn:rotate-6"
          viewBox="0 0 24 24"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.285-.143-1.687-.833-1.947-.928-.26-.095-.45-.143-.639.143-.19.286-.736.928-.902 1.118-.166.19-.332.214-.618.071-.285-.143-1.204-.444-2.293-1.415-.848-.756-1.42-1.691-1.587-1.977-.166-.286-.018-.44.125-.582.128-.128.285-.333.428-.5.143-.166.19-.286.285-.476.095-.19.047-.357-.024-.5-.071-.143-.639-1.537-.876-2.106-.23-.554-.464-.479-.639-.488-.166-.009-.357-.01-.548-.01-.19 0-.5.071-.761.357-.26.286-.999.977-.999 2.381 0 1.405 1.023 2.762 1.166 2.953.143.19 2.013 3.074 4.877 4.312.682.295 1.214.471 1.629.603.685.218 1.308.187 1.8.114.549-.082 1.687-.69 1.925-1.357.238-.667.238-1.238.166-1.357-.071-.119-.26-.19-.545-.333z" />
        </svg>

        {/* Badge Label on Desktop Hover */}
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover/btn:max-w-xs transition-all duration-300 ease-in-out font-bold text-xs pl-0 group-hover/btn:pl-2">
          Chat Secretariat
        </span>
      </a>
    </div>
  );
};
