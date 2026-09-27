import React, { useState, useEffect } from 'react';
import { 
  getSeoConfig, 
  updateSeoConfig, 
  generateAutoKeywords,
  generateEventSchema,
  generateSpeakersSchema,
  generateOrganizationSchema,
  generateFaqSchema,
  generateBreadcrumbSchema,
  generateWebSiteSchema,
  getLlmKnowledgeText,
  SeoConfig 
} from '../../services/seoService';
import { 
  Globe, 
  Search, 
  Check, 
  Save, 
  Sparkles, 
  Copy, 
  CheckCircle2, 
  ExternalLink, 
  HelpCircle, 
  Code, 
  Layers, 
  Bot, 
  FileText, 
  Link as LinkIcon, 
  ShieldCheck, 
  RefreshCw, 
  Tag, 
  CheckSquare, 
  Eye, 
  Cpu
} from 'lucide-react';

interface SeoSettingsTabProps {
  showToast: (msg: string) => void;
}

export const SeoSettingsTab: React.FC<SeoSettingsTabProps> = ({ showToast }) => {
  const [config, setConfig] = useState<SeoConfig>(() => getSeoConfig());
  const [keywordInput, setKeywordInput] = useState('');
  const [activeSchemaTab, setActiveSchemaTab] = useState<'event' | 'speakers' | 'org' | 'faq' | 'breadcrumb' | 'website'>('event');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedLlmText, setCopiedLlmText] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setConfig(getSeoConfig());
  }, []);

  const handleSave = () => {
    const updated = updateSeoConfig(config);
    setConfig(updated);
    setIsSaved(true);
    showToast('✅ SEO, Meta Tags & Google/Bing Structured Data schemas saved!');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAutoGenerateKeywords = () => {
    const generated = generateAutoKeywords();
    setConfig(prev => ({
      ...prev,
      keywords: Array.from(new Set([...prev.keywords, ...generated]))
    }));
    showToast('✨ Auto-generated 20+ targeted SEO/AEO keywords for RECON Expo 2026!');
  };

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = keywordInput.trim();
    if (clean && !config.keywords.includes(clean)) {
      setConfig(prev => ({
        ...prev,
        keywords: [...prev.keywords, clean]
      }));
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setConfig(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== kw)
    }));
  };

  const getCurrentSchemaObject = () => {
    switch (activeSchemaTab) {
      case 'event': return generateEventSchema();
      case 'speakers': return generateSpeakersSchema();
      case 'org': return generateOrganizationSchema();
      case 'faq': return generateFaqSchema();
      case 'breadcrumb': return generateBreadcrumbSchema();
      case 'website': return generateWebSiteSchema();
      default: return generateEventSchema();
    }
  };

  const handleCopySchema = () => {
    const schemaStr = JSON.stringify(getCurrentSchemaObject(), null, 2);
    navigator.clipboard.writeText(schemaStr);
    setCopiedSchema(true);
    showToast(`📋 Copied ${activeSchemaTab.toUpperCase()} JSON-LD schema to clipboard!`);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  const handleCopyLlmText = () => {
    navigator.clipboard.writeText(getLlmKnowledgeText());
    setCopiedLlmText(true);
    showToast('🤖 Copied llms.txt AI Bot Knowledge Base to clipboard!');
    setTimeout(() => setCopiedLlmText(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      {/* Top Header & Save Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-teal-950/50 to-black/80 border border-emerald-500/30 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 p-0.5 shadow-lg flex-shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400">
              <Globe className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
              SEO, AEO &amp; AI Bot Schema Engine
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                100% Google &amp; LLM Ready
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              Optimize RECON Expo 2026 for Google, Bing, ChatGPT, Claude, Perplexity &amp; Gemini with rich JSON-LD structured data, auto-generated keywords &amp; internal link architecture.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
            <span>{isSaved ? 'Settings Saved!' : 'Save SEO & Schemas'}</span>
          </button>
        </div>
      </div>

      {/* SEARCH ENGINE & AI LLM CONTROLS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CARD 1: META TITLE & DESCRIPTION */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 hover:border-emerald-500/40 transition-all shadow-lg">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Search className="w-4 h-4 text-emerald-400" />
            <span>Google &amp; Bing Meta Tag Customizer</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1 flex items-center justify-between">
                <span>Page Meta Title (&lt;title&gt;)</span>
                <span className="text-[10px] text-slate-400 font-mono">{config.title.length} / 60 chars</span>
              </label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-sans text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1 flex items-center justify-between">
                <span>Page Meta Description (&lt;meta name="description"&gt;)</span>
                <span className="text-[10px] text-slate-400 font-mono">{config.description.length} / 160 chars</span>
              </label>
              <textarea
                rows={3}
                value={config.description}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-slate-200 font-sans text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">
                Canonical Base URL
              </label>
              <input
                type="text"
                value={config.canonicalUrl}
                onChange={(e) => setConfig({ ...config, canonicalUrl: e.target.value })}
                placeholder="https://www.afrinetgroup.com"
                className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-emerald-300 font-mono text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>
        </div>

        {/* CARD 2: AEO & AI BOT INDEXING TOGGLES */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 hover:border-teal-500/40 transition-all shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Bot className="w-4 h-4 text-teal-400" />
              <span>AEO &amp; AI Bot Indexing Controls</span>
            </h3>

            <div className="space-y-3 mt-3">
              <label className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-bold text-white text-xs">Allow AI Bot &amp; Search Crawlers</div>
                  <div className="text-[10px] text-slate-400">Googlebot, Bingbot, GPTBot, ClaudeBot, PerplexityBot</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableAiBotIndexing}
                  onChange={(e) => setConfig({ ...config, enableAiBotIndexing: e.target.checked })}
                  className="w-4 h-4 text-emerald-500 rounded border-white/20 bg-black/60"
                />
              </label>

              <label className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-bold text-white text-xs">Inject Dynamic JSON-LD Schemas</div>
                  <div className="text-[10px] text-slate-400">Inject Event, Speakers, Organization &amp; FAQ Schemas into &lt;head&gt;</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableSchemaMarkup}
                  onChange={(e) => setConfig({ ...config, enableSchemaMarkup: e.target.checked })}
                  className="w-4 h-4 text-emerald-500 rounded border-white/20 bg-black/60"
                />
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2">
            <a
              href="/llms.txt"
              target="_blank"
              rel="noreferrer"
              className="w-full px-3 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 font-bold flex items-center justify-between transition-colors border border-teal-500/30"
            >
              <span className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5" />
                <span>View `/llms.txt` Knowledge Base</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className="w-full px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-between transition-colors border border-emerald-500/30"
            >
              <span className="flex items-center gap-2">
                <LinkIcon className="w-3.5 h-3.5" />
                <span>View `/sitemap.xml` Route</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>

      {/* GOOGLE & BING RICH SNIPPET VISUAL CARD PREVIEW */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-black border border-blue-500/30 space-y-4 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-400" />
              <span>Google &amp; Bing Search Result Rich Snippet Preview</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                Google Verified Schema
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Live visual simulation of how RECON Expo 2026 appears on Google Search results with rich event dates, venue location, ticket prices &amp; speaker cards.
            </p>
          </div>
        </div>

        {/* Mockup Google Search Result Card */}
        <div className="p-5 rounded-2xl bg-white text-slate-900 space-y-3 font-sans shadow-xl border border-slate-200 max-w-3xl">
          {/* URL & Favicon line */}
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px]">R</div>
            <div className="truncate">
              <span className="font-medium text-slate-900">RECON Expo Abuja</span>
              <span className="text-slate-400 font-mono text-[11px] ml-1">https://www.afrinetgroup.com &rsaquo; event</span>
            </div>
          </div>

          {/* Title Link */}
          <h4 className="text-base font-semibold text-blue-800 hover:underline cursor-pointer leading-tight">
            The 8th Real Estate &amp; Construction Expo 2026 (RECON Expo Abuja)
          </h4>

          {/* Meta Description */}
          <p className="text-xs text-slate-700 leading-relaxed">
            Official Portal for the 8th Real Estate &amp; Construction Expo 2026 at Shehu Musa Yar'Adua Centre, Abuja (29th – 30th October 2026). Connect with 5,000+ investors, developers, architects, and government policymakers.
          </p>

          {/* Rich Snippet Event Badge Grid */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">📅 Event Dates</div>
              <div className="font-bold text-slate-900 text-xs">Oct 29 – 30, 2026</div>
              <div className="text-[10px] text-slate-500">10:00 AM – 6:00 PM WAT</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">📍 Venue Location</div>
              <div className="font-bold text-slate-900 text-xs truncate">Yar'Adua Centre, Abuja</div>
              <div className="text-[10px] text-slate-500 truncate">Plot 1161 Memorial Drive</div>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-0.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">🎟️ Passes &amp; Offers</div>
              <div className="font-bold text-emerald-900 text-xs">Free Visitor / ₦25,000 VIP</div>
              <div className="text-[10px] text-emerald-700 font-medium">Verified by Google Offer Schema</div>
            </div>
          </div>

          {/* Speakers Rich Entity Row */}
          <div className="pt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
            <span className="font-bold text-slate-800">Featured Keynote Performers:</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-medium">Arc Babatunde Sanusi</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-medium">Dr Amina Bello Yusuf</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-medium">Engr Chukwuma Okafor</span>
          </div>
        </div>
      </div>

      {/* AUTO-GENERATED TARGET KEYWORDS MANAGEMENT */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-400" />
              <span>Target SEO / AEO Keywords Index</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                {config.keywords.length} Active Keywords
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Keywords injected into HTML meta tags, OpenGraph cards, and schema descriptions for search indexing and AI query matching.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAutoGenerateKeywords}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>Auto-Generate Targeted Keywords</span>
          </button>
        </div>

        {/* Add keyword form */}
        <form onSubmit={handleAddKeyword} className="flex items-center gap-2">
          <input
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            placeholder="Type custom keyword or keyphrase and press Enter (e.g., 'Best Construction Expo Nigeria 2026')..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold transition-colors cursor-pointer"
          >
            Add Keyword
          </button>
        </form>

        {/* Keyword chips */}
        <div className="flex flex-wrap gap-2 pt-2 max-h-48 overflow-y-auto p-2 bg-black/40 rounded-xl border border-white/10">
          {config.keywords.map((kw, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium flex items-center gap-1.5 hover:border-emerald-400 transition-colors"
            >
              <span>{kw}</span>
              <button
                type="button"
                onClick={() => handleRemoveKeyword(kw)}
                className="hover:text-red-400 cursor-pointer font-bold ml-1"
                title="Remove keyword"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* SCHEMA.ORG RICH RESULTS INSPECTOR */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-400" />
              <span>Google &amp; Bing Schema.org JSON-LD Inspector</span>
            </h3>
            <p className="text-xs text-slate-400">
              Select a schema structure below to inspect the live JSON-LD injected into the page for Google Rich Snippets &amp; AI Bot indexing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySchema}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1.5 transition-colors border border-emerald-500/40 cursor-pointer"
            >
              {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSchema ? 'Copied Schema!' : 'Copy Schema JSON'}</span>
            </button>
          </div>
        </div>

        {/* Schema Sub-Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-black/60 rounded-xl border border-white/10">
          {[
            { id: 'event', label: 'Event Schema (@type: Event)' },
            { id: 'speakers', label: 'Speakers Schema (@type: Person)' },
            { id: 'org', label: 'Organization Schema' },
            { id: 'faq', label: 'FAQPage Schema' },
            { id: 'breadcrumb', label: 'BreadcrumbList Schema' },
            { id: 'website', label: 'WebSite & SearchAction' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSchemaTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSchemaTab === tab.id
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* JSON-LD Code Block */}
        <div className="bg-black border border-white/15 rounded-xl p-4 overflow-x-auto font-mono text-[11px] text-emerald-300 shadow-inner max-h-80">
          <pre>{JSON.stringify(getCurrentSchemaObject(), null, 2)}</pre>
        </div>
      </div>

    </div>
  );
};
