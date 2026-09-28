import React, { useState } from 'react';
import { useExpoData } from '../../context/ExpoDataContext';
import { Save, CheckCircle2, Edit3 } from 'lucide-react';
import { playSound } from '../../utils/soundService';

export const SiteTextEditorTab: React.FC = () => {
  const { siteContent, updateSiteContent } = useExpoData();
  const [formData, setFormData] = useState({ ...siteContent });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent(formData);
    playSound('success');
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 text-white text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-black">Live Content & Copy Editor</h3>
          <p className="text-slate-400 text-[11px]">Edit event titles, dates, venue addresses, and ticket prices in real time.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Event Edition</label>
            <input
              type="text"
              value={formData.eventEdition}
              onChange={e => setFormData({ ...formData, eventEdition: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Dates</label>
            <input
              type="text"
              value={formData.eventDates}
              onChange={e => setFormData({ ...formData, eventDates: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Venue Name</label>
            <input
              type="text"
              value={formData.eventVenue}
              onChange={e => setFormData({ ...formData, eventVenue: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Contact Email</label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Hero Subheadline</label>
          <textarea
            rows={2}
            value={formData.heroSubheadline}
            onChange={e => setFormData({ ...formData, heroSubheadline: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {saved && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Site content updated successfully!</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase hover:bg-emerald-400 flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
