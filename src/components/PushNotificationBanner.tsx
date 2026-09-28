import React, { useState, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { isPushSupported, getNotificationPermission, requestPushPermission } from '../utils/pushNotificationService';
import { playSound } from '../utils/soundService';

export const PushNotificationBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (isPushSupported() && getNotificationPermission() === 'default') {
      const dismissed = localStorage.getItem('recon_push_banner_dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => setShowBanner(true), 4000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleEnable = async () => {
    playSound('click');
    const granted = await requestPushPermission();
    if (granted) {
      playSound('success');
    }
    setShowBanner(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('recon_push_banner_dismissed', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm w-[calc(100vw-3rem)] bg-slate-950/95 border border-emerald-500/40 rounded-2xl p-4 shadow-2xl shadow-emerald-950/80 backdrop-blur-xl flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
        <Bell className="w-5 h-5 animate-bounce" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold text-white">Enable Expo Live Alerts</h4>
        <p className="text-[11px] text-slate-300 mt-0.5">
          Get real-time notifications for ministerial speeches, deal-room updates, and gate passes.
        </p>

        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={handleEnable}
            className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400"
          >
            Allow Alerts
          </button>
          <button
            onClick={handleDismiss}
            className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-400 text-xs hover:text-white"
          >
            Later
          </button>
        </div>
      </div>

      <button
        onClick={handleDismiss}
        className="text-slate-500 hover:text-white p-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
