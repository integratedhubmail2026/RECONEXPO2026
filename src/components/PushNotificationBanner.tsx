import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Sparkles, CheckCircle2, X, ShieldCheck, ExternalLink, Tag } from 'lucide-react';
import { useExpoData } from '../context/ExpoDataContext';

export const PushNotificationBanner: React.FC = () => {
  const { 
    pushSubscription, 
    subscribePushNotifications,
    activePushBroadcast,
    dismissPushBroadcast
  } = useExpoData();

  const [isVisible, setIsVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto show subscription prompt after 800ms if not already subscribed
  useEffect(() => {
    if (!pushSubscription.isSubscribed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [pushSubscription.isSubscribed]);

  const handleChoice = async (preference: 'yes' | 'no') => {
    // Subscribe user and trigger native browser permission prompt
    await subscribePushNotifications(preference);
    setIsVisible(false);
    
    setToastMessage("🔔 Browser Push Notifications Activated! Real-time alerts will show directly in your device notification tray.");
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleCtaClick = (targetLink?: string) => {
    dismissPushBroadcast();
    if (!targetLink) return;

    if (targetLink.startsWith('#')) {
      const element = document.querySelector(targetLink);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (targetLink.startsWith('http')) {
      window.open(targetLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      {/* 1. SLIDE-UP SUBSCRIPTION PROMPT BANNER FOR NEW VISITORS (BOTTOM OF SCREEN) */}
      <AnimatePresence>
        {isVisible && !pushSubscription.isSubscribed && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 border-t-2 border-emerald-500/40 text-white shadow-[0_-10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl"
          >
            <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
              {/* Left Side: Icon & Copy */}
              <div className="flex items-start sm:items-center gap-3 w-full md:w-auto">
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-950/60 flex-shrink-0 mt-0.5 sm:mt-0 animate-bounce">
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-wider">
                      NATIVE BROWSER PUSH ALERTS
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-slate-400">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> Background Device Delivery
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-extrabold text-white font-heading leading-tight">
                    Get Our Event Updates (Housing and Investment Opportunities)
                  </h4>
                  <p className="text-xs text-slate-300 leading-snug">
                    Receive instant push notifications from your browser for prime real estate deals, VIP keynote schedules & trade floor announcements.
                  </p>
                </div>
              </div>

              {/* Right Side: Action Buttons */}
              <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-end flex-shrink-0 pt-1 md:pt-0 border-t md:border-t-0 border-white/10">
                <button
                  type="button"
                  id="push-banner-btn-yes"
                  onClick={() => handleChoice('yes')}
                  className="flex-1 md:flex-initial py-2.5 px-5 rounded-xl font-black text-xs tracking-wider transition-all bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:brightness-110 text-slate-950 flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/50 cursor-pointer min-h-[42px]"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>YES, ENABLE NOTIFICATIONS</span>
                </button>

                <button
                  type="button"
                  id="push-banner-btn-no"
                  onClick={() => handleChoice('no')}
                  className="flex-1 md:flex-initial py-2.5 px-4 rounded-xl font-bold text-xs transition-all bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 flex items-center justify-center gap-1.5 cursor-pointer min-h-[42px]"
                >
                  <span>NO</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsVisible(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-1 cursor-pointer"
                  title="Close Banner"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING RE-ENABLE PUSH BUTTON AT BOTTOM LEFT */}
      {!isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          className="fixed bottom-5 left-5 z-40 p-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-2xl hover:scale-110 transition-all border-2 border-emerald-300 cursor-pointer flex items-center gap-2 group"
          title="Browser Push Alerts"
        >
          <Bell className="w-5 h-5 fill-current animate-pulse" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-black pr-1">
            Browser Push Alerts
          </span>
        </button>
      )}

      {/* 2. IN-PAGE POPUP NOTIFICATION MODAL / CARD (SHOWN IN PAGE ON LOAD & ON BROADCAST) */}
      <AnimatePresence>
        {activePushBroadcast && (
          <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 260 }}
            className={`fixed bottom-5 right-3 sm:right-6 left-3 sm:left-auto z-50 sm:max-w-md w-auto bg-slate-950/95 text-white rounded-3xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl ring-1 ${
              activePushBroadcast.category?.includes('Exhib') || activePushBroadcast.targetAudience === 'EXHIBITORS'
                ? 'border-2 border-emerald-400 ring-emerald-500/50'
                : activePushBroadcast.category?.includes('Sponsor') || activePushBroadcast.targetAudience === 'SPONSORS'
                ? 'border-2 border-amber-400 ring-amber-500/50'
                : activePushBroadcast.category?.includes('Partner') || activePushBroadcast.targetAudience === 'PARTNERS'
                ? 'border-2 border-purple-400 ring-purple-500/50'
                : 'border-2 border-emerald-400/90 ring-emerald-500/50'
            }`}
          >
            {/* Header with tags and dismiss */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                  activePushBroadcast.category?.includes('Exhib')
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50'
                    : activePushBroadcast.category?.includes('Sponsor')
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/50'
                    : activePushBroadcast.category?.includes('Partner')
                    ? 'bg-purple-500/20 text-purple-300 border-purple-400/50'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                }`}>
                  <Tag className="w-3 h-3" />
                  {activePushBroadcast.category || 'LIVE BROADCAST'}
                </span>

                {activePushBroadcast.targetAudience && activePushBroadcast.targetAudience !== 'ALL' && (
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-200 border border-white/20 text-[9px] font-black uppercase">
                    👥 For: {activePushBroadcast.targetAudience}
                  </span>
                )}

                {activePushBroadcast.badgeText && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold">
                    {activePushBroadcast.badgeText}
                  </span>
                )}
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  LIVE ALERT
                </span>
              </div>

              <button
                type="button"
                onClick={dismissPushBroadcast}
                className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                title="Dismiss In-Page Notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Attached Image inside in-page popup */}
            {activePushBroadcast.imageUrl && (
              <div className="rounded-2xl overflow-hidden border border-white/15 mb-2.5 shadow-md">
                <img
                  src={activePushBroadcast.imageUrl}
                  alt={activePushBroadcast.title}
                  className="w-full h-36 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}

            {/* Title & Body Message */}
            <div className="space-y-1">
              <h5 className="text-sm sm:text-base font-black text-white font-heading leading-tight">
                {activePushBroadcast.title}
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {activePushBroadcast.message}
              </p>
            </div>

            {/* Action CTA Button */}
            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
              {activePushBroadcast.targetLink ? (
                <button
                  type="button"
                  onClick={() => handleCtaClick(activePushBroadcast.targetLink)}
                  className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/60 transition-all cursor-pointer"
                >
                  <span>Explore Deal & Register</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={dismissPushBroadcast}
                  className="flex-1 py-2 px-4 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs cursor-pointer"
                >
                  OK, Got It
                </button>
              )}

              <button
                type="button"
                onClick={dismissPushBroadcast}
                className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. SUBSCRIPTION CONFIRMATION TOAST */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-400 text-emerald-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold backdrop-blur-md"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
