import React, { useState, useEffect } from 'react';
import { 
  getPixelConfig, 
  updatePixelConfig, 
  trackPixelEvent, 
  getPixelLogs, 
  clearPixelLogs 
} from '../../services/pixelTrackingService';
import { PixelConfig, PixelLogEntry, StandardPixelEvent } from '../../types/pixel';
import { 
  Activity, 
  Check, 
  Save, 
  RotateCcw, 
  Sparkles, 
  Eye, 
  ShieldCheck, 
  Zap, 
  Trash2, 
  Copy, 
  ExternalLink, 
  HelpCircle, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Radio, 
  Play, 
  Layers, 
  Share2, 
  Target,
  RefreshCw
} from 'lucide-react';

interface PixelTrackingTabProps {
  showToast: (msg: string) => void;
}

export const PixelTrackingTab: React.FC<PixelTrackingTabProps> = ({ showToast }) => {
  const [config, setConfig] = useState<PixelConfig>(() => getPixelConfig());
  const [logs, setLogs] = useState<PixelLogEntry[]>(() => getPixelLogs());
  const [isSaved, setIsSaved] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    setConfig(getPixelConfig());
    setLogs(getPixelLogs());
  }, []);

  const handleSave = () => {
    const updated = updatePixelConfig(config);
    setConfig(updated);
    setIsSaved(true);
    showToast('✅ Facebook & TikTok Pixel tracking configuration saved!');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleRefreshLogs = () => {
    setLogs([...getPixelLogs()]);
    showToast('Pixel activity logs refreshed.');
  };

  const handleClearLogs = () => {
    clearPixelLogs();
    setLogs([]);
    showToast('Pixel activity logs cleared.');
  };

  const handleSimulateEvent = (eventName: StandardPixelEvent, value = 25000) => {
    trackPixelEvent({
      eventName,
      contentName: '8th Real Estate & Construction Expo 2026',
      category: 'Simulated Admin Conversion',
      value: value,
      currency: 'NGN',
      ticketNumber: `RECON-TEST-${Math.floor(1000 + Math.random() * 9000)}`,
      email: 'admin.tester@afrinetgroup.com',
      phone: '+234 803 000 0000',
      customData: {
        source: 'Admin Live Simulator',
        simulatedAt: new Date().toLocaleTimeString()
      }
    });

    setLogs([...getPixelLogs()]);
    showToast(`🎯 Test event "${eventName}" fired across active pixels!`);
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      {/* Top Header & Save Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-black/80 border border-emerald-500/30 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 p-0.5 shadow-lg flex-shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
              Meta (Facebook) &amp; TikTok Pixel Manager
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Conversion Engine
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              Control Facebook and TikTok tracking pixels to measure website traffic, ad conversions, lead inquiries, and registration purchases in real time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
          >
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>{showGuide ? 'Hide Pixel Guide' : 'Pixel ID Guide'}</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className={`px-5 py-2.5 rounded-xl font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
              isSaved
                ? 'bg-emerald-400 text-emerald-950'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950'
            }`}
          >
            {isSaved ? <Check className="w-4 h-4 stroke-[3]" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Settings Saved!' : 'Save Pixel Config'}</span>
          </button>
        </div>
      </div>

      {/* Setup & ID Finder Guide (Collapsible) */}
      {showGuide && (
        <div className="p-5 rounded-2xl bg-black/60 border border-emerald-500/40 space-y-3 animate-in fade-in slide-in-from-top-3 duration-200">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>How to Find Your Facebook &amp; TikTok Pixel IDs</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 leading-relaxed">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <h4 className="font-bold text-white text-xs flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">f</span>
                <span>Meta (Facebook) Pixel ID</span>
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300">
                <li>Log in to <strong className="text-white">Meta Events Manager</strong> (<a href="https://eventsmanager.facebook.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline">eventsmanager.facebook.com</a>).</li>
                <li>Select your Business Account and Data Source / Dataset.</li>
                <li>Copy the numeric <strong className="text-amber-300 font-mono">Pixel ID</strong> (e.g., <code className="text-emerald-300 font-mono">1098273645129384</code>) from the Overview tab.</li>
                <li>Paste it in the Meta Facebook Pixel field below and click Save.</li>
              </ol>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <h4 className="font-bold text-white text-xs flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold border border-white/20">🎵</span>
                <span>TikTok Pixel ID</span>
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300">
                <li>Log in to <strong className="text-white">TikTok Ads Manager</strong> (<a href="https://ads.tiktok.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline">ads.tiktok.com</a>).</li>
                <li>Go to <strong className="text-white">Assets &rarr; Events</strong> and select Web Events.</li>
                <li>Click <strong className="text-white">Manage &rarr; Copy Pixel ID</strong> (e.g., <code className="text-emerald-300 font-mono">C1234567890TIKTOK</code>).</li>
                <li>Paste it in the TikTok Pixel field below and click Save.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Main Pixel Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CARD 1: META / FACEBOOK PIXEL */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 hover:border-blue-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-base">
                f
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Meta (Facebook) Pixel</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Track website visitors, Facebook/Instagram ad conversions &amp; custom retargeting audiences.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.facebookEnabled}
                onChange={(e) => setConfig({ ...config, facebookEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">
                Facebook Pixel ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={config.facebookPixelId || ''}
                onChange={(e) => setConfig({ ...config, facebookPixelId: e.target.value.trim() })}
                placeholder="e.g. 1098273645129384"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1 flex items-center justify-between">
                <span>Test Event Code (Optional)</span>
                <span className="text-[10px] font-mono text-slate-400">Meta Events Manager &rarr; Test Events</span>
              </label>
              <input
                type="text"
                value={config.facebookTestEventCode || ''}
                onChange={(e) => setConfig({ ...config, facebookTestEventCode: e.target.value.trim() })}
                placeholder="e.g. TEST12345"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-slate-300 font-mono text-xs focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-200 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Status:</strong> {config.facebookEnabled && config.facebookPixelId ? <span className="text-blue-300 font-bold">Active &amp; Injecting `fbq` script</span> : <span className="text-amber-300 font-bold">Disabled / ID Missing</span>}
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: TIKTOK PIXEL */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 hover:border-emerald-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-black border border-white/20 flex items-center justify-center text-white font-bold text-sm shadow-md">
                🎵
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>TikTok Pixel</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Capture TikTok ad performance, lead forms, registration signups &amp; ticket sales.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.tiktokEnabled}
                onChange={(e) => setConfig({ ...config, tiktokEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">
                TikTok Pixel ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={config.tiktokPixelId || ''}
                onChange={(e) => setConfig({ ...config, tiktokPixelId: e.target.value.trim() })}
                placeholder="e.g. C1234567890TIKTOK"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="pt-8">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-200 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Status:</strong> {config.tiktokEnabled && config.tiktokPixelId ? <span className="text-emerald-300 font-bold">Active &amp; Injecting `ttq` script</span> : <span className="text-amber-300 font-bold">Disabled / ID Missing</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* EVENT TRACKING TOGGLES & AUTOMATION CONTROLS */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Active Conversion Events to Track Automatically</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { key: 'trackPageView', label: 'PageView', desc: 'Every website page load' },
            { key: 'trackViewContent', label: 'ViewContent', desc: 'Exhibition booths & tiers' },
            { key: 'trackInitiateCheckout', label: 'InitiateCheckout', desc: 'Modal open' },
            { key: 'trackLead', label: 'Lead', desc: 'Contact & inquiry forms' },
            { key: 'trackCompleteRegistration', label: 'CompleteRegistration', desc: 'Registration signup' },
            { key: 'trackPurchase', label: 'Purchase', desc: 'Paid VIP & Stand tickets' },
          ].map((ev) => (
            <label
              key={ev.key}
              className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                (config as any)[ev.key]
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-white'
                  : 'bg-black/30 border-white/10 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-xs">{ev.label}</span>
                <input
                  type="checkbox"
                  checked={!!(config as any)[ev.key]}
                  onChange={(e) => setConfig({ ...config, [ev.key]: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 border-white/20 bg-black/60"
                />
              </div>
              <span className="text-[10px] text-slate-400">{ev.desc}</span>
            </label>
          ))}
        </div>
      </div>

      {/* LIVE EVENT SIMULATOR & TEST TRIGGER */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-emerald-500/30 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-400 fill-emerald-400/30" />
              <span>Pixel Live Simulator &amp; Event Dispatcher</span>
            </h3>
            <p className="text-xs text-slate-400">
              Click any button below to fire instant test conversion events and verify deliverability to Facebook &amp; TikTok.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold">
              Debug Console: ON
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleSimulateEvent('PageView')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Fire Test PageView</span>
          </button>

          <button
            type="button"
            onClick={() => handleSimulateEvent('ViewContent')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Fire Test ViewContent</span>
          </button>

          <button
            type="button"
            onClick={() => handleSimulateEvent('InitiateCheckout')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span>Fire Test InitiateCheckout</span>
          </button>

          <button
            type="button"
            onClick={() => handleSimulateEvent('Lead')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-teal-400 hover:text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>Fire Test Lead (Inquiry)</span>
          </button>

          <button
            type="button"
            onClick={() => handleSimulateEvent('Purchase', 25000)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>Fire Test Purchase (₦25,000)</span>
          </button>
        </div>
      </div>

      {/* REAL-TIME PIXEL AUDIT LOG MONITOR */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Pixel Activity Monitor</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-black/40 text-emerald-300 border border-white/10">
                {logs.length} Recent Events
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Live stream of conversion events triggered on the website by delegates and visitors.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefreshLogs}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Refresh Event Logs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleClearLogs}
              className="p-2 rounded-xl bg-white/10 hover:bg-red-500 hover:text-white text-slate-300 transition-colors cursor-pointer"
              title="Clear Event Logs"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {logs.length > 0 ? (
          <div className="bg-black/60 border border-white/10 rounded-xl overflow-hidden shadow-inner">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-white/5 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-white/10">
                  <tr>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Event Name</th>
                    <th className="py-2.5 px-3">Dispatched To</th>
                    <th className="py-2.5 px-3">Content / Ref</th>
                    <th className="py-2.5 px-3">Value</th>
                    <th className="py-2.5 px-3">Page URL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-2.5 px-3 text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.eventName === 'Purchase' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                          log.eventName === 'Lead' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' :
                          log.eventName === 'InitiateCheckout' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                          'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        }`}>
                          {log.eventName}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">
                        {log.platforms.join(' • ')}
                      </td>
                      <td className="py-2.5 px-3 text-white font-sans font-bold">
                        {log.payload.contentName || 'RECON Expo 2026'}
                        {log.payload.ticketNumber && (
                          <span className="block text-[10px] text-emerald-400 font-mono font-normal">
                            Ref: {log.payload.ticketNumber}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-emerald-400">
                        {log.payload.value && log.payload.value > 0 ? `₦${log.payload.value.toLocaleString()} NGN` : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-[10px] text-slate-500 truncate max-w-[200px]">
                        {log.url || '/'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-black/40 border border-white/10 rounded-xl space-y-2">
            <Radio className="w-8 h-8 text-slate-600 mx-auto animate-pulse" />
            <div className="text-slate-400 font-bold">No pixel events captured yet.</div>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Fire test events using the Live Simulator above or browse the website to see real-time conversion events captured here.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
