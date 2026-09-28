import React, { useState } from 'react';
import { DEFAULT_SEO_METADATA, applySeoMetadata, SeoMetadata } from '../../services/seoService';
import { Globe, Save, CheckCircle2 } from 'lucide-react';
import { playSound } from '../../utils/soundService';

export const SeoSettingsTab: React.FC = () => {
  const [seo, setSeo] = useState<SeoMetadata>(() => {
    try {
      const s = localStorage.getItem('recon_seo_metadata');
      if (s) return JSON.parse(s);
    } catch (e) {}
    return DEFAULT_SEO_METADATA;
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('recon_seo_metadata', JSON.stringify(seo));
    applySeoMetadata(seo);
    playSound('success');
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 text-white text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-black">Search Engine Optimization & OpenGraph</h3>
          <p className="text-slate-400 text-[11px]">Configure social sharing preview cards and Google search metadata.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Page Title & Meta Title</label>
          <input
            type="text"
            required
            value={seo.metaTitle}
            onChange={e => setSeo({ ...seo, metaTitle: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Meta Description</label>
          <textarea
            rows={2}
            required
            value={seo.metaDescription}
            onChange={e => setSeo({ ...seo, metaDescription: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Social Share Image (OG Image URL)</label>
          <input
            type="text"
            value={seo.ogImageUrl}
            onChange={e => setSeo({ ...seo, ogImageUrl: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
          />
        </div>

        {saved && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>SEO metadata applied live!</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase hover:bg-emerald-400 flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save SEO Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
