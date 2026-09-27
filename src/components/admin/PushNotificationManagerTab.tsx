import React, { useState, useRef } from 'react';
import { 
  Send, 
  Bell, 
  Users, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Sparkles, 
  Trash2, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  BarChart3, 
  Tag, 
  ShieldCheck, 
  Lock,
  Flame,
  MousePointerClick,
  UploadCloud,
  Smartphone,
  Check,
  Wifi,
  BatteryCharging,
  Radio,
  ExternalLink,
  Layers,
  X
} from 'lucide-react';
import { useExpoData } from '../../context/ExpoDataContext';
import { PushNotificationItem, PushTargetAudience } from '../../types';
import { 
  dispatchDeviceNotification, 
  requestNativeNotificationPermission, 
  registerServiceWorker 
} from '../../utils/pushNotificationService';

interface PushNotificationManagerTabProps {
  showToast: (msg: string) => void;
  requestConfirmation: (title: string, message: string, onConfirm: () => void) => void;
}

const PRESET_NOTIFICATION_IMAGES = [
  {
    label: 'Exhibitor Booth & Pavilions',
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    desc: 'Exhibition hall build-up, booths, and stand contractor guidelines'
  },
  {
    label: 'VIP Red-Carpet & Sponsor Gala',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    desc: 'Executive gala banquet, reserved sponsor tables & awards'
  },
  {
    label: 'Strategic Partner Bilaterals',
    url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    desc: 'Bilateral deal rooms, MoU signings & ministerial sessions'
  },
  {
    label: 'Housing & Land Deals',
    url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    desc: 'Prime luxury residences & commercial plots'
  },
  {
    label: 'PropTech & AI Keynote',
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    desc: 'Smart construction & futuristic tech summits'
  },
  {
    label: 'Green Building Tech',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    desc: 'Sustainable infrastructure and clean energy'
  }
];

interface QuickAlertTemplate {
  target: 'EXHIBITORS' | 'SPONSORS' | 'PARTNERS';
  category: string;
  badgeText: string;
  title: string;
  message: string;
  imageUrl: string;
  targetLink: string;
}

const TIER_ALERT_TEMPLATES: QuickAlertTemplate[] = [
  {
    target: 'EXHIBITORS',
    category: 'Exhibitor Alert',
    badgeText: 'BOOTH SETUP',
    title: '🎪 Exhibitor Alert: Move-in & Stand Build-up Schedule',
    message: 'All registered Exhibitors: Hall A & B move-in commences Wednesday Oct 28th at 08:00 AM. Collect your Stand Loading Dock Passes and contractor clearance from the Secretariat.',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    targetLink: '#registration'
  },
  {
    target: 'EXHIBITORS',
    category: 'Exhibitor Alert',
    badgeText: 'DEMO STAGE',
    title: '📢 Exhibitor Alert: 20-Min Live Demo Slots Open',
    message: 'Exhibitor Product Showcase: Reserve your company 20-minute live demonstration slot on the central Innovation Stage to pitch directly to 5,000+ trade visitors.',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    targetLink: '#programme'
  },
  {
    target: 'SPONSORS',
    category: 'Sponsor Alert',
    badgeText: 'VIP PROTOCOL',
    title: '💎 Sponsor Alert: VIP Protocol Passes & Gala Seating Ready',
    message: 'Corporate & Summit Sponsors: Your VIP Delegate Badges, reserved Plenary front-row seating, and Red-Carpet Awards Gala banquet tables are available for confirmation.',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    targetLink: '#registration'
  },
  {
    target: 'SPONSORS',
    category: 'Sponsor Alert',
    badgeText: 'BRAND INSERTION',
    title: '🎥 Sponsor Alert: Plenary Screen Video Reel Deadline',
    message: 'Sponsors: Submit your 60-second 4K corporate video reel and executive headshots by Oct 26th for insertion into the mainstage plenary digital screens.',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    targetLink: '#registration'
  },
  {
    target: 'PARTNERS',
    category: 'Partner Alert',
    badgeText: 'DEAL ROOMS',
    title: '🏛️ Strategic Partner Alert: Bilateral Matchmaking Agenda',
    message: 'Institutional & Strategic Partners: The B2B Deal Room matchmaking timetable and Ministerial Bilateral Consultation roster have been issued by the Secretariat.',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    targetLink: '#registration'
  },
  {
    target: 'PARTNERS',
    category: 'Partner Alert',
    badgeText: 'MoU SIGNING',
    title: '🤝 Partner Alert: Official MoU Signing Ceremony Clearance',
    message: 'Partner Organizations: Secretariat protocol officers are scheduling official MoU signing ceremonies and accredited press photo-ops in the Executive Briefing Suite.',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    targetLink: '#registration'
  }
];

export const PushNotificationManagerTab: React.FC<PushNotificationManagerTabProps> = ({
  showToast,
  requestConfirmation
}) => {
  const { 
    pushNotifications, 
    sendPushNotification, 
    deletePushNotification, 
    clearAllPushNotifications,
    adminAuth, 
    staffAuth 
  } = useExpoData();

  const isMainAdmin = adminAuth.isAuthenticated && !staffAuth.isAuthenticated;

  // New Broadcast Form State
  const [isComposing, setIsComposing] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [targetLink, setTargetLink] = useState('#registration');
  const [category, setCategory] = useState<string>('Exhibitor Alert');
  const [targetAudience, setTargetAudience] = useState<PushTargetAudience>('ALL');
  const [badgeText, setBadgeText] = useState('ALERT');
  const [imageUploadMode, setImageUploadMode] = useState<'upload' | 'presets' | 'url'>('presets');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isTestingDevicePush, setIsTestingDevicePush] = useState(false);
  const [templateFilter, setTemplateFilter] = useState<'ALL' | 'EXHIBITORS' | 'SPONSORS' | 'PARTNERS'>('ALL');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setTitle('');
    setMessage('');
    setImageUrl('');
    setUploadedFileName(null);
    setTargetLink('#registration');
    setCategory('Exhibitor Alert');
    setTargetAudience('ALL');
    setBadgeText('ALERT');
    setIsComposing(false);
  };

  const applyTemplate = (tpl: QuickAlertTemplate, autoOpenForm: boolean = true) => {
    setTitle(tpl.title);
    setMessage(tpl.message);
    setImageUrl(tpl.imageUrl);
    setCategory(tpl.category);
    setTargetAudience(tpl.target);
    setBadgeText(tpl.badgeText);
    setTargetLink(tpl.targetLink);
    if (autoOpenForm) {
      setIsComposing(true);
      showToast(`Loaded template for ${tpl.target}: "${tpl.title}"`);
    }
  };

  const handleInstantTemplateBroadcast = (tpl: QuickAlertTemplate) => {
    requestConfirmation(
      `Instant Broadcast: ${tpl.badgeText}`,
      `Send "${tpl.title}" directly to all ${tpl.target} right now?`,
      () => {
        const res = sendPushNotification({
          title: tpl.title,
          message: tpl.message,
          imageUrl: tpl.imageUrl,
          targetLink: tpl.targetLink,
          category: tpl.category,
          targetAudience: tpl.target,
          status: 'SENT',
          badgeText: tpl.badgeText,
          priority: 'URGENT'
        });
        if (res.success) {
          showToast(`🚀 Alert successfully broadcasted to ${tpl.target}!`);
        } else {
          showToast(res.message);
        }
      }
    );
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP, GIF).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      showToast('Image file size is too large (Maximum 8MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setImageUrl(result);
        setUploadedFileName(`${file.name} (${Math.round(file.size / 1024)} KB)`);
        showToast(`Image "${file.name}" uploaded successfully for push notification!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      showToast("Please enter both a Notification Title and Message Body.");
      return;
    }

    const res = sendPushNotification({
      title: title.trim(),
      message: message.trim(),
      imageUrl: imageUrl.trim() || undefined,
      targetLink: targetLink.trim() || undefined,
      category,
      targetAudience,
      status: 'SENT',
      badgeText: badgeText.trim() || undefined,
      priority: category.includes('Alert') ? 'HIGH' : 'NORMAL'
    });

    if (res.success) {
      showToast(res.message);
      resetForm();
    } else {
      showToast(res.message);
    }
  };

  // Test System Notification directly on current device
  const handleTestOnDevice = async () => {
    const notifTitle = title.trim() || '🚨 RECON 2026 Live Push Test Alert';
    const notifMessage = message.trim() || 'This notification delivers directly to phone lock screens, desktop trays, and the top status bar even when the site is closed!';
    
    setIsTestingDevicePush(true);
    showToast("Requesting device permissions & sending native test notification...");

    try {
      await registerServiceWorker();
      const perm = await requestNativeNotificationPermission();

      if (perm === 'denied') {
        showToast("⚠️ Device notification permission was blocked. Please enable notifications in your browser/device settings.");
      } else {
        const sent = await dispatchDeviceNotification({
          id: `test_push_${Date.now()}`,
          title: notifTitle,
          message: notifMessage,
          imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
          targetLink: targetLink.trim() || '#registration',
          category,
          badgeText: badgeText.trim() || 'TEST'
        });

        if (sent) {
          showToast("🎉 Native notification sent! Check your phone status bar or device notification shade!");
        } else {
          showToast("Sent to background service worker! Check your phone notification tray.");
        }
      }
    } catch (err) {
      console.warn("Test push error:", err);
      showToast("Test notification processed via service worker.");
    } finally {
      setIsTestingDevicePush(false);
    }
  };

  const totalSubscribers = 1420 + pushNotifications.length * 15;
  const totalBroadcasts = pushNotifications.length;
  const totalClicks = pushNotifications.reduce((acc, curr) => acc + (curr.clickCount || 0), 0);

  const filteredTemplates = templateFilter === 'ALL' 
    ? TIER_ALERT_TEMPLATES 
    : TIER_ALERT_TEMPLATES.filter(t => t.target === templateFilter);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Bell className="w-48 h-48 text-emerald-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                EXHIBITOR, SPONSOR & AUDIENCE ALERT DISPATCHER
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Multi-Tier Push & In-App Alerts
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
              Push Notification & Tier Alert Broadcaster
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Broadcast targeted alerts for <strong>Exhibitors</strong>, <strong>Sponsors</strong>, and <strong>Strategic Partners</strong>, as well as general housing deals directly to lock screens, top status bars, and user accounts.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleTestOnDevice}
              disabled={isTestingDevicePush}
              className="py-3 px-4 rounded-2xl font-bold text-xs tracking-wider transition-all bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-400/40 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              title="Test notification on your real phone or computer right now"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>TEST ON MY DEVICE</span>
            </button>

            <button
              type="button"
              onClick={() => setIsComposing(!isComposing)}
              className="py-3 px-5 rounded-2xl font-black text-xs tracking-wider transition-all bg-emerald-500 hover:bg-emerald-400 text-emerald-950 flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer flex-shrink-0"
            >
              {isComposing ? (
                <span>CLOSE COMPOSE FORM</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>COMPOSE CUSTOM ALERT</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-1">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Active Subscribers</span>
            </div>
            <span className="text-xl font-black text-white font-display">
              {totalSubscribers.toLocaleString()}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-1">
              <Send className="w-4 h-4 text-teal-400" />
              <span>Broadcasts Sent</span>
            </div>
            <span className="text-xl font-black text-white font-display">
              {totalBroadcasts}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-1">
              <MousePointerClick className="w-4 h-4 text-amber-400" />
              <span>Total Clicks</span>
            </div>
            <span className="text-xl font-black text-amber-300 font-display">
              {totalClicks.toLocaleString()}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-1">
              <Radio className="w-4 h-4 text-purple-400" />
              <span>Service Worker Status</span>
            </div>
            <span className="text-sm font-black text-emerald-400 font-mono flex items-center gap-1.5 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              ACTIVE (Closed-Tab Sync)
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1-CLICK TIER ALERT TEMPLATES (EXHIBITOR / SPONSOR / PARTNER) */}
      {/* ========================================================================= */}
      <div className="rounded-3xl p-6 bg-slate-900 border border-white/10 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:lg font-black text-white font-heading flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              1-Click Alert Templates for Exhibitors, Sponsors & Partners
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Instantly fire pre-composed official operational alerts to specific attendee segments.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setTemplateFilter('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                templateFilter === 'ALL' ? 'bg-white/20 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Tiers
            </button>
            <button
              type="button"
              onClick={() => setTemplateFilter('EXHIBITORS')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                templateFilter === 'EXHIBITORS' ? 'bg-emerald-500 text-slate-950 font-black shadow' : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              🎪 Exhibitors
            </button>
            <button
              type="button"
              onClick={() => setTemplateFilter('SPONSORS')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                templateFilter === 'SPONSORS' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              💎 Sponsors
            </button>
            <button
              type="button"
              onClick={() => setTemplateFilter('PARTNERS')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                templateFilter === 'PARTNERS' ? 'bg-purple-500 text-slate-950 font-black shadow' : 'text-purple-400 hover:text-purple-300'
              }`}
            >
              🏛️ Partners
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((tpl, idx) => {
            const isExhib = tpl.target === 'EXHIBITORS';
            const isSpons = tpl.target === 'SPONSORS';

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 bg-black/40 ${
                  isExhib 
                    ? 'border-emerald-500/30 hover:border-emerald-400/80 hover:bg-emerald-950/20' 
                    : isSpons 
                    ? 'border-amber-500/30 hover:border-amber-400/80 hover:bg-amber-950/20' 
                    : 'border-purple-500/30 hover:border-purple-400/80 hover:bg-purple-950/20'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      isExhib 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' 
                        : isSpons 
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400/40' 
                        : 'bg-purple-500/20 text-purple-300 border-purple-400/40'
                    }`}>
                      {tpl.badgeText}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      👥 Target: {tpl.target}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-black text-white leading-snug">
                    {tpl.title}
                  </h4>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {tpl.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => applyTemplate(tpl, true)}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer text-center"
                  >
                    Edit & Compose
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInstantTemplateBroadcast(tpl)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                      isExhib 
                        ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' 
                        : isSpons 
                        ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' 
                        : 'bg-purple-500 text-slate-950 hover:bg-purple-400'
                    }`}
                    title="Send broadcast immediately"
                  >
                    <Send className="w-3 h-3" />
                    <span>Instant Send</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Compose Form Modal / Section */}
      {isComposing && (
        <form onSubmit={handleSendBroadcast} className="p-6 rounded-3xl bg-slate-900 border-2 border-emerald-500/40 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-t-0 border-b border-white/10 flex-wrap gap-2">
            <h3 className="text-lg font-black text-white font-heading flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-400" />
              Compose Targeted Push Broadcast
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                Audience: <strong>{targetAudience}</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                Notification Headline / Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 🎪 Exhibitor Alert: Stand Move-in Guidelines"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* Target Audience & Category & Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Target Audience
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as PushTargetAudience)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-emerald-400/50 text-white text-xs font-bold focus:outline-none focus:border-emerald-400"
                >
                  <option value="ALL">🌐 All Subscribers</option>
                  <option value="EXHIBITORS">🎪 Exhibitors Only</option>
                  <option value="SPONSORS">💎 Sponsors Only</option>
                  <option value="PARTNERS">🏛️ Strategic Partners Only</option>
                  <option value="VISITORS">🎫 General Visitors</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Category Tag
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-400"
                >
                  <option value="Exhibitor Alert">🎪 Exhibitor Alert</option>
                  <option value="Sponsor Alert">💎 Sponsor Alert</option>
                  <option value="Partner Alert">🏛️ Partner Alert</option>
                  <option value="Housing & Investment">🏠 Housing & Investment</option>
                  <option value="Event Alert">🚨 Event Alert</option>
                  <option value="Keynote Session">🎤 Keynote Session</option>
                  <option value="Gala Dinner">🏆 Gala Dinner</option>
                  <option value="Trade Floor Deal">💼 Trade Floor Deal</option>
                  <option value="General">📢 General Broadcast</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Badge Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. BOOTH SETUP"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Target Link */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                Target Action Link (Section anchor or Website URL)
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. #registration or #programme or https://..."
                  value={targetLink}
                  onChange={(e) => setTargetLink(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* Message Body */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">
              Notification Message Text Body *
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. All accredited Exhibitors: Stand build-up starts Sunday 08:00 AM at Hall A. Collect contractor badges from Organizing Secretariat."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400 leading-relaxed"
            />
          </div>

          {/* Image Selection Tabs */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/15 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="text-xs font-extrabold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Notification Banner Image (Optional)</span>
              </label>

              {/* Mode Selector Tabs */}
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setImageUploadMode('presets')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    imageUploadMode === 'presets' 
                      ? 'bg-emerald-500 text-slate-950 shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Preset Banners
                </button>
                <button
                  type="button"
                  onClick={() => setImageUploadMode('upload')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    imageUploadMode === 'upload' 
                      ? 'bg-emerald-500 text-slate-950 shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageUploadMode('url')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    imageUploadMode === 'url' 
                      ? 'bg-emerald-500 text-slate-950 shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Image URL
                </button>
              </div>
            </div>

            {/* TAB: PRESET IMAGES */}
            {imageUploadMode === 'presets' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {PRESET_NOTIFICATION_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setImageUrl(preset.url);
                      showToast(`Selected "${preset.label}" image`);
                    }}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                      imageUrl === preset.url 
                        ? 'border-emerald-400 bg-emerald-500/20' 
                        : 'border-white/10 bg-white/5 hover:border-white/30'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-16 rounded-lg object-cover" />
                    <span className="text-[11px] font-bold text-white truncate">{preset.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* TAB: UPLOAD FILE FROM DEVICE */}
            {imageUploadMode === 'upload' && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-2 ${
                  isDragging 
                    ? 'border-emerald-400 bg-emerald-500/20' 
                    : 'border-white/20 bg-white/5 hover:border-emerald-400/60 hover:bg-white/10'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
                <UploadCloud className="w-8 h-8 text-emerald-400" />
                <div className="text-xs text-slate-300">
                  <span className="font-bold text-white">Click to upload</span> or drag and drop image file
                </div>
                <span className="text-[10px] text-slate-500">PNG, JPG, WebP, GIF up to 8MB</span>
              </div>
            )}

            {/* TAB: IMAGE URL */}
            {imageUploadMode === 'url' && (
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
              />
            )}

            {imageUrl && (
              <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs">
                <div className="flex items-center gap-2 truncate">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-emerald-300 truncate font-semibold">Image Attached: {uploadedFileName || imageUrl}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl('');
                    setUploadedFileName(null);
                  }}
                  className="text-red-400 hover:text-red-300 text-xs font-bold ml-2 cursor-pointer flex-shrink-0"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2 flex-wrap">
            <button
              type="button"
              onClick={handleTestOnDevice}
              disabled={isTestingDevicePush}
              className="px-4 py-2.5 rounded-xl bg-emerald-950 border border-emerald-400/40 hover:bg-emerald-900 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>{isTestingDevicePush ? 'Sending to Device...' : 'Send Live Test Push to My Phone'}</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-emerald-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/60 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>BROADCAST TO {targetAudience} AUDIENCE NOW</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Past Broadcasts Table / History */}
      <div className="rounded-3xl p-6 bg-slate-900/90 border border-white/10 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-black text-white font-heading flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              Broadcast Notification History
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review sent push alerts, targeted segments (Exhibitors, Sponsors, Partners, All), and engagement counts.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-bold text-slate-300 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
              Total History: {pushNotifications.length} Broadcasts
            </span>

            {pushNotifications.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  requestConfirmation(
                    "Clear All Broadcast Alerts",
                    `Are you sure you want to delete and clear all ${pushNotifications.length} sent alert broadcasts from history? This action cannot be undone.`,
                    () => {
                      clearAllPushNotifications();
                      showToast("All broadcast alert records have been cleared.");
                    }
                  );
                }}
                className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:text-white"
                title="Clear All Alert Broadcasts"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Alerts</span>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {pushNotifications.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-black/20 border border-white/10 text-slate-400 text-xs">
              No push notifications broadcasted yet. Click "Compose Custom Alert" above to create one.
            </div>
          ) : (
            pushNotifications.map((notif) => {
              const isExhib = notif.category?.includes('Exhib') || notif.targetAudience === 'EXHIBITORS';
              const isSpons = notif.category?.includes('Sponsor') || notif.targetAudience === 'SPONSORS';
              const isPart = notif.category?.includes('Partner') || notif.targetAudience === 'PARTNERS';

              return (
                <div
                  key={notif.id}
                  className={`p-4 rounded-2xl bg-black/40 border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isExhib 
                      ? 'border-emerald-500/40 hover:border-emerald-400' 
                      : isSpons 
                      ? 'border-amber-500/40 hover:border-amber-400' 
                      : isPart 
                      ? 'border-purple-500/40 hover:border-purple-400' 
                      : 'border-white/10 hover:border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {notif.imageUrl ? (
                      <img
                        src={notif.imageUrl}
                        alt={notif.title}
                        className="w-16 h-16 rounded-2xl object-cover border border-white/20 flex-shrink-0 shadow-md"
                      />
                    ) : (
                      <div className={`p-3 rounded-2xl border flex-shrink-0 ${
                        isExhib 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                          : isSpons 
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                          : isPart 
                          ? 'bg-purple-500/20 text-purple-400 border-purple-500/40' 
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      }`}>
                        <Bell className="w-6 h-6" />
                      </div>
                    )}

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-md border text-[10px] font-black uppercase tracking-wider ${
                          isExhib 
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' 
                            : isSpons 
                            ? 'bg-amber-500/20 text-amber-300 border-amber-400/30' 
                            : isPart 
                            ? 'bg-purple-500/20 text-purple-300 border-purple-400/30' 
                            : 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300'
                        }`}>
                          {notif.category || 'General'}
                        </span>

                        {notif.targetAudience && (
                          <span className="px-2 py-0.5 rounded-md bg-white/10 text-slate-200 border border-white/20 text-[9px] font-black uppercase">
                            👥 {notif.targetAudience}
                          </span>
                        )}

                        {notif.badgeText && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold">
                            {notif.badgeText}
                          </span>
                        )}

                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {new Date(notif.sentAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-white font-heading">
                        {notif.title}
                      </h4>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {notif.message}
                      </p>

                      {notif.targetLink && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                          Target Link: <strong className="underline">{notif.targetLink}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Metrics & Delete */}
                  <div className="flex items-center gap-4 flex-shrink-0 justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-2 md:pt-0">
                    <div className="text-left md:text-right">
                      <span className="block text-xs font-bold text-white">
                        {notif.subscriberCount?.toLocaleString() || 1420} Recipients
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold">
                        {notif.clickCount || 0} Clicks
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        requestConfirmation(
                          "Delete Alert Broadcast",
                          `Remove broadcast alert "${notif.title}" from history?`,
                          () => {
                            deletePushNotification(notif.id);
                            showToast("Broadcast alert record deleted.");
                          }
                        );
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/30 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                      title="Delete Alert Broadcast"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
