import React, { useState } from 'react';
import { DEFAULT_PIXEL_SETTINGS } from '../../services/pixelTrackingService';
import { PixelSettings } from '../../types/pixel';
import { Save, CheckCircle2, Activity } from 'lucide-react';
import { playSound } from '../../utils/soundService';

export const PixelTrackingTab: React.FC = () => {
  const [settings, setSettings] = useState<PixelSettings>(() => {
    try {
      const s = localStorage.getItem('recon_pixel_settings');
      if (s) return JSON.parse(s);
    } catch (e) {}
    return DEFAULT_PIXEL_SETTINGS;
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('recon_pixel_settings', JSON.stringify(settings));
    playSound('success');
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 text-white text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-black">Meta Pixel & Conversion Tracking</h3>
          <p className="text-slate-400 text-[11px]">Configure Meta Pixel ID and Google Analytics conversion tracking.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Meta (Facebook) Pixel ID</label>
            <input
              type="text"
              value={settings.metaPixelId}
              onChange={e => setSettings({ ...settings, metaPixelId: e.target.value })}
              placeholder="e.g. 1928374659102"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Google Tag / GA4 Measurement ID</label>
            <input
              type="text"
              value={settings.googleTagId}
              onChange={e => setSettings({ ...settings, googleTagId: e.target.value })}
              placeholder="e.g. G-ABC123XYZ"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.trackRegistrations}
              onChange={e => setSettings({ ...settings, trackRegistrations: e.target.checked })}
              className="rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-0"
            />
            <span>Track CompleteRegistration events (Free Trade Visitors)</span>
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.trackVipPurchases}
              onChange={e => setSettings({ ...settings, trackVipPurchases: e.target.checked })}
              className="rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-0"
            />
            <span>Track Purchase conversions for Elite VIP & Exhibitor passes</span>
          </label>
        </div>

        {saved && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Pixel settings saved!</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase hover:bg-emerald-400 flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
