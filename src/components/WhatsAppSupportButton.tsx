import React from 'react';
import { useExpoData } from '../context/ExpoDataContext';
import { MessageCircle } from 'lucide-react';
import { playSound } from '../utils/soundService';

export const WhatsAppSupportButton: React.FC = () => {
  const { siteContent } = useExpoData();

  const handleWhatsApp = () => {
    playSound('click');
    const msg = encodeURIComponent(`Hello RECON Expo 2026 Secretariat, I have an inquiry regarding registration / exhibition booths at Shehu Musa Yar'Adua Centre.`);
    const cleanNum = (siteContent.whatsappNumber || '+2348035557890').replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNum}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={handleWhatsApp}
        className="px-4 py-3 rounded-full bg-[#25D366] text-white font-extrabold text-xs shadow-2xl shadow-emerald-950/80 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 border-2 border-white/20 group"
        title="Chat with RECON Secretariat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline">WhatsApp Help Desk</span>
      </button>
    </div>
  );
};
