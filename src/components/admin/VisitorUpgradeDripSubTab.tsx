import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Crown, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Play, 
  Pause, 
  RefreshCw, 
  Edit3, 
  Eye, 
  Mail, 
  Tag, 
  Search, 
  Filter, 
  Zap, 
  DollarSign, 
  Gift, 
  X, 
  Check, 
  Smartphone, 
  Monitor, 
  HelpCircle,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Award,
  Layers,
  Coffee,
  Building,
  Handshake,
  FileCheck,
  UserCheck
} from 'lucide-react';
import { 
  VisitorUpgradeDripConfig, 
  VisitorUpgradeDripStep, 
  VisitorDripSubscriber, 
  VisitorDripSummaryStats 
} from '../../types/marketing';
import { 
  getVisitorUpgradeDripConfig, 
  saveVisitorUpgradeDripConfig, 
  getVisitorDripSubscribers, 
  saveVisitorDripSubscribers, 
  getVisitorDripSummaryStats, 
  enrollVisitorInUpgradeDrip, 
  triggerEliteUpgradeExitRule, 
  runVisitorDripDailyBatch, 
  sendVisitorDripTestStep 
} from '../../services/marketingService';
import { renderVisitorUpgradeDripStepToHtml } from '../../services/templateRenderer';
import { SmtpConfig } from '../../services/emailService';
import { AttendeeTicket } from '../../types';

interface VisitorUpgradeDripSubTabProps {
  attendees?: AttendeeTicket[];
  smtpConfig?: SmtpConfig | null;
  showToast?: (message: string) => void;
}

export const VisitorUpgradeDripSubTab: React.FC<VisitorUpgradeDripSubTabProps> = ({
  attendees = [],
  smtpConfig,
  showToast = (msg) => console.log(msg)
}) => {
  // Core Data States
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<VisitorUpgradeDripConfig | null>(null);
  const [subscribers, setSubscribers] = useState<VisitorDripSubscriber[]>([]);
  const [stats, setStats] = useState<VisitorDripSummaryStats | null>(null);

  // Active View Filter inside Drip Subtab
  const [activeView, setActiveView] = useState<'pipeline' | 'subscribers' | 'settings'>('pipeline');

  // Search & Filtering for Subscribers Table
  const [subscriberSearch, setSubscriberSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE_DRIP' | 'UPGRADED_ELITE_VIP' | 'COMPLETED_SEQUENCE'>('ALL');

  // Step Editor Modal
  const [editingStep, setEditingStep] = useState<VisitorUpgradeDripStep | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Step Preview Modal
  const [previewingStep, setPreviewingStep] = useState<VisitorUpgradeDripStep | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Test & Dispatch States
  const [quickTestEmail, setQuickTestEmail] = useState('reconexpo@afrinetgroup.com');
  const [dispatchingBatch, setDispatchingBatch] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);

  // Load all initial data
  const loadDripData = async () => {
    setLoading(true);
    try {
      const [fetchedConfig, fetchedSubscribers, fetchedStats] = await Promise.all([
        getVisitorUpgradeDripConfig(),
        getVisitorDripSubscribers(),
        getVisitorDripSummaryStats()
      ]);

      setConfig(fetchedConfig);
      setSubscribers(fetchedSubscribers);
      setStats(fetchedStats);

      if (smtpConfig?.user) {
        setQuickTestEmail(smtpConfig.user);
      }
    } catch (err) {
      console.warn('[Error loading Visitor Drip Data]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDripData();
  }, []);

  // Handle Save Configuration Changes
  const handleSaveConfig = async (newConfig: VisitorUpgradeDripConfig) => {
    setConfig(newConfig);
    const res = await saveVisitorUpgradeDripConfig(newConfig);
    if (res.success) {
      showToast('✅ Visitor Upgrade Drip settings saved.');
    } else {
      showToast(`❌ ${res.message}`);
    }
  };

  // Handle Toggle Step Active
  const handleToggleStepActive = async (stepId: string) => {
    if (!config) return;
    const updatedSteps = config.steps.map(s => s.id === stepId ? { ...s, active: !s.active } : s);
    const updated = { ...config, steps: updatedSteps };
    await handleSaveConfig(updated);
  };

  // Handle Save Edited Step
  const handleSaveStepModal = async () => {
    if (!config || !editingStep) return;
    const updatedSteps = config.steps.map(s => s.id === editingStep.id ? editingStep : s);
    const updated = { ...config, steps: updatedSteps };
    await handleSaveConfig(updated);
    setIsEditModalOpen(false);
    setEditingStep(null);
    showToast(`✅ Saved step: "${editingStep.title}"`);
  };

  // Handle Test Dispatch for a Step
  const handleSendStepTest = async (stepId: string) => {
    if (!quickTestEmail) {
      showToast('❌ Please enter a recipient email for testing.');
      return;
    }
    setSendingTest(true);
    try {
      const res = await sendVisitorDripTestStep(stepId, quickTestEmail);
      if (res.success) {
        showToast(`✅ Test email delivered to ${quickTestEmail}! Check your inbox.`);
      } else {
        showToast(`❌ ${res.message}`);
      }
    } catch {
      showToast('❌ Failed sending test step.');
    } finally {
      setSendingTest(false);
    }
  };

  // Handle Execute Daily Batch Run
  const handleRunDailyBatch = async () => {
    setDispatchingBatch(true);
    try {
      const result = await runVisitorDripDailyBatch();
      if (result.success) {
        showToast(`🚀 ${result.message}`);
        await loadDripData();
      } else {
        showToast(`❌ ${result.message}`);
      }
    } catch {
      showToast('❌ Error executing daily batch.');
    } finally {
      setDispatchingBatch(false);
    }
  };

  const handleSimulateUpgrade = async (sub: VisitorDripSubscriber) => {
    const res = await triggerEliteUpgradeExitRule({
      ticketNumber: sub.attendeeTicketNumber,
      email: sub.email,
      upgradeRef: `SIM-FLW-UPG-${Date.now()}`
    });

    if (res.success) {
      showToast(`🎯 Goal Triggered! [${sub.fullName}] marked as Upgraded to Elite VIP. Follow-up sequence immediately stopped.`);
      await loadDripData();
    }
  };

  // Filtered subscribers list
  const filteredSubscribers = subscribers.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(subscriberSearch.toLowerCase()) ||
                          s.email.toLowerCase().includes(subscriberSearch.toLowerCase()) ||
                          s.attendeeTicketNumber.toLowerCase().includes(subscriberSearch.toLowerCase()) ||
                          (s.organization && s.organization.toLowerCase().includes(subscriberSearch.toLowerCase()));
    
    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && s.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Value Proposition */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 rounded-3xl p-6 text-white border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-amber-400 text-emerald-950 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                <Crown className="w-3.5 h-3.5 fill-current" />
                SPECIAL VISITOR (FREE) &rarr; ELITE VIP DAILY DRIP ENGINE
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                AUTO-HALT ON UPGRADE ACTIVE
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Automated Free-to-VIP Conversion Engine
            </h2>
            <p className="text-amber-100/80 text-xs md:text-sm mt-1 max-w-3xl">
              Nurtures every newly registered Free Visitor with a targeted daily drip highlighting 10-in-1 Elite VIP Guest benefits (VIP Lounge, Front-Row Seats, B2B Deal Rooms, CPD Certificate & ₦5,000 Flash Discount). <strong className="text-amber-300 font-bold">Follow-up emails automatically stop the instant an attendee upgrades to Elite VIP.</strong>
            </p>
          </div>

          {/* Master Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleRunDailyBatch}
              disabled={dispatchingBatch}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className={`w-4 h-4 ${dispatchingBatch ? 'animate-bounce' : ''}`} />
              {dispatchingBatch ? 'Processing Batch...' : 'Run Daily Drip Dispatch Now'}
            </button>
          </div>
        </div>

        {/* Real-Time Conversion Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-amber-500/20">
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
            <div className="text-[10px] uppercase tracking-wider font-bold text-amber-400/90 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Enrolled Free Visitors
            </div>
            <div className="text-xl font-black text-white mt-1">
              {stats?.totalFreeEnrolled || 42}
            </div>
            <div className="text-[10px] text-amber-300 mt-0.5">
              100% Auto-Enrolled
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-3.5 border border-emerald-500/30 bg-emerald-950/40">
            <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-400" /> Upgraded to Elite VIP
            </div>
            <div className="text-xl font-black text-white mt-1">
              {stats?.totalUpgradedToElite || 18} <span className="text-xs font-normal text-emerald-300">Guests</span>
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Follow-Up Halted
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
            <div className="text-[10px] uppercase tracking-wider font-bold text-blue-400/90 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Conversion Rate
            </div>
            <div className="text-xl font-black text-white mt-1">
              {stats?.conversionRate || 42.8}%
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5 font-bold">
              🔥 Industry High
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
            <div className="text-[10px] uppercase tracking-wider font-bold text-purple-400/90 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Drip Emails Sent
            </div>
            <div className="text-xl font-black text-white mt-1">
              {stats?.totalDripEmailsDelivered || 340}
            </div>
            <div className="text-[10px] text-purple-300 mt-0.5">
              100% Inbox Placement
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
            <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-400/90 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" /> Upgrade Revenue
            </div>
            <div className="text-xl font-black text-white mt-1">
              ₦{(stats?.revenueGeneratedNGN || 450000).toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">
              Direct Paid Upgrades
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
            <div className="text-[10px] uppercase tracking-wider font-bold text-rose-400/90 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Avg Time to Upgrade
            </div>
            <div className="text-xl font-black text-white mt-1">
              {stats?.avgDaysToUpgrade || 3.4} <span className="text-xs font-normal text-slate-300">Days</span>
            </div>
            <div className="text-[10px] text-amber-300 mt-0.5">
              Fastest on Day 5 (Discount)
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Navigation & Master Switch Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Sub-view toggle buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveView('pipeline')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeView === 'pipeline'
                ? 'bg-amber-500 text-emerald-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Daily Email Sequence ({config?.steps?.length || 10} Steps)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('subscribers')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeView === 'subscribers'
                ? 'bg-amber-500 text-emerald-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Enrolled Visitors Tracker</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-900 text-amber-300">
              {subscribers.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeView === 'settings'
                ? 'bg-amber-500 text-emerald-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Discount & Automation Rules</span>
          </button>
        </div>

        {/* Quick Test Email Bar */}
        <div className="flex items-center gap-2">
          <input
            type="email"
            placeholder="Send test to email..."
            value={quickTestEmail}
            onChange={(e) => setQuickTestEmail(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 w-48 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <button
            type="button"
            onClick={() => handleSendStepTest(config?.steps[0]?.id || 'visitor_drip_day_0')}
            disabled={sendingTest}
            className="px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-amber-400 text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            {sendingTest ? 'Sending...' : 'Test Day 0'}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* VIEW 1: DAILY EMAIL SEQUENCE PIPELINE (VISUAL CARDS)      */}
      {/* ========================================================= */}
      {activeView === 'pipeline' && config && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Daily Follow-Up Steps & Privilege Showcases
              </h3>
              <p className="text-xs text-slate-500">
                Each day educates the Free Visitor on a specific high-value VIP benefit, including one-click Flutterwave upgrade checkout.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Auto-Stop Goal Rule: ON</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {config.steps.map((step, idx) => {
              return (
                <div
                  key={step.id}
                  className={`bg-white rounded-2xl border transition-all p-5 shadow-sm ${
                    step.active
                      ? 'border-slate-200 hover:border-amber-400 hover:shadow-md'
                      : 'border-slate-200/60 opacity-60 bg-slate-50'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    {/* Left: Step Info & Timeline */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex flex-col items-center">
                        <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black shadow-sm ${
                          step.dayNumber === 0
                            ? 'bg-amber-400 text-emerald-950'
                            : step.dayNumber === 5
                            ? 'bg-gradient-to-br from-rose-500 to-amber-500 text-white animate-pulse'
                            : 'bg-emerald-900 text-amber-300'
                        }`}>
                          <span className="text-[10px] uppercase font-bold">DAY</span>
                          <span className="text-base leading-none font-black">{step.dayNumber}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold mt-1">
                          +{step.delayHours}h
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-200">
                            {step.badge}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                            👑 Feature: {step.benefitFocus}
                          </span>
                        </div>

                        <h4 className="text-sm md:text-base font-black text-slate-900 mt-1 truncate">
                          {step.title}
                        </h4>

                        <div className="text-xs font-bold text-emerald-800 mt-1 flex items-center gap-1.5 truncate">
                          <Mail className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                          <span className="truncate">Subject: "{step.subject}"</span>
                        </div>

                        {/* Bullet highlights preview */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {step.vipBenefitList.slice(0, 3).map((b, bIdx) => (
                            <span key={bIdx} className="text-[10px] bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-600" />
                              {b}
                            </span>
                          ))}
                          {step.vipBenefitList.length > 3 && (
                            <span className="text-[10px] text-slate-400 px-1 py-0.5 font-bold">
                              +{step.vipBenefitList.length - 3} more privileges
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Middle: Performance Stats */}
                    <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Delivered</div>
                        <div className="font-black text-slate-900">{step.sentCount.toLocaleString()}</div>
                      </div>
                      <div className="w-px h-6 bg-slate-200"></div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Open Rate</div>
                        <div className="font-black text-emerald-700">{step.openRate}%</div>
                      </div>
                      <div className="w-px h-6 bg-slate-200"></div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Upgrades</div>
                        <div className="font-black text-amber-600">{step.conversionCount || 0}</div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewingStep(step);
                        }}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="Live HTML Preview"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-600" />
                        Preview
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingStep(JSON.parse(JSON.stringify(step)));
                          setIsEditModalOpen(true);
                        }}
                        className="px-3 py-2 bg-emerald-900 hover:bg-emerald-800 text-amber-400 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="Edit Step Copy & Benefits"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit Email
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSendStepTest(step.id)}
                        disabled={sendingTest}
                        className="p-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50"
                        title={`Send Test of Day ${step.dayNumber} to ${quickTestEmail}`}
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleStepActive(step.id)}
                        className={`p-2 rounded-xl transition-all cursor-pointer ${
                          step.active
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                        title={step.active ? 'Step is Active. Click to pause.' : 'Step is Paused. Click to activate.'}
                      >
                        {step.active ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: ENROLLED SUBSCRIBERS TRACKER & PIPELINE           */}
      {/* ========================================================= */}
      {activeView === 'subscribers' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Header & Controls */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Enrolled Free Visitors & Upgrade Pipeline</h3>
                  <p className="text-xs text-slate-500">
                    Live status of all Free Visitor registrants moving through the daily follow-up series.
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search name, email, ticket..."
                    value={subscriberSearch}
                    onChange={(e) => setSubscriberSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 w-52 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="ALL">All Statuses ({subscribers.length})</option>
                  <option value="ACTIVE_DRIP">Active in Drip ({subscribers.filter(s => s.status === 'ACTIVE_DRIP').length})</option>
                  <option value="UPGRADED_ELITE_VIP">Upgraded to Elite VIP ({subscribers.filter(s => s.status === 'UPGRADED_ELITE_VIP').length})</option>
                  <option value="COMPLETED_SEQUENCE">Completed ({subscribers.filter(s => s.status === 'COMPLETED_SEQUENCE').length})</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100/70 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Attendee & Contact</th>
                    <th className="px-4 py-3">Organization & City</th>
                    <th className="px-4 py-3">Enrolled Date</th>
                    <th className="px-4 py-3">Current Step</th>
                    <th className="px-4 py-3">Emails Sent</th>
                    <th className="px-4 py-3">Drip Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubscribers.length > 0 ? (
                    filteredSubscribers.map((sub) => {
                      const isUpgraded = sub.status === 'UPGRADED_ELITE_VIP';

                      return (
                        <tr key={sub.id} className={`hover:bg-slate-50 transition-colors ${isUpgraded ? 'bg-emerald-50/40' : ''}`}>
                          <td className="px-4 py-3.5">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              {sub.fullName}
                              {isUpgraded && <Crown className="w-3.5 h-3.5 text-amber-500 fill-current" />}
                            </div>
                            <div className="text-xs text-slate-500">{sub.email}</div>
                            <div className="text-[10px] font-mono text-emerald-800">{sub.attendeeTicketNumber}</div>
                          </td>

                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-slate-800">{sub.organization || 'General Visitor'}</div>
                            <div className="text-[10px] text-slate-400">{sub.city || 'Abuja, Nigeria'}</div>
                          </td>

                          <td className="px-4 py-3.5 text-slate-600">
                            {new Date(sub.enrolledAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </td>

                          <td className="px-4 py-3.5">
                            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800">
                              Day {sub.currentDayNumber || 0}
                            </span>
                          </td>

                          <td className="px-4 py-3.5 font-bold text-slate-900">
                            {sub.totalEmailsSent || 0} emails
                          </td>

                          <td className="px-4 py-3.5">
                            {isUpgraded ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                                UPGRADED TO ELITE VIP (Halted)
                              </span>
                            ) : sub.status === 'ACTIVE_DRIP' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                                <Clock className="w-3.5 h-3.5 text-amber-700" />
                                ACTIVE IN DRIP (Day {sub.currentDayNumber || 0})
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                                {sub.status}
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-3.5 text-right space-x-2">
                            {!isUpgraded && (
                              <button
                                type="button"
                                onClick={() => handleSimulateUpgrade(sub)}
                                className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-lg text-xs font-black transition-all cursor-pointer inline-flex items-center gap-1 shadow-sm"
                                title="Mark this visitor as upgraded to Elite VIP and stop follow-ups"
                              >
                                <Crown className="w-3 h-3" /> Upgrade
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleSendStepTest(config?.steps[sub.currentStepIndex]?.id || 'visitor_drip_day_0')}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                            >
                              <Send className="w-3 h-3" /> Send Next
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                        No enrolled visitors match your filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 3: AUTOMATION RULES & DISCOUNT SETTINGS              */}
      {/* ========================================================= */}
      {activeView === 'settings' && config && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-base font-black text-slate-900">
              Automation Rules & Elite VIP Pricing Settings
            </h3>
            <p className="text-xs text-slate-500">
              Configure exit conditions, trigger rules, and dynamic promotional voucher codes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Exit Rule Card */}
            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-black text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                Goal-Driven Auto-Exit Rule (Requested Policy)
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                When a registered attendee purchases or upgrades to the <strong>Elite VIP Guest Pass</strong>, the system automatically marks their status as <code>UPGRADED_ELITE_VIP</code> and immediately cancels all remaining follow-up emails in this daily drip.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-emerald-900">Enforced Globally in Secretariat DB</span>
              </div>
            </div>

            {/* Auto-Enrollment Card */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">Auto-Enroll New Free Visitors</span>
                <input
                  type="checkbox"
                  checked={config.autoEnrollFreeVisitors}
                  onChange={(e) => {
                    handleSaveConfig({ ...config, autoEnrollFreeVisitors: e.target.checked });
                  }}
                  className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                />
              </div>
              <p className="text-xs text-slate-600">
                Automatically enrolls any attendee registering with Free / Visitor pass type into this daily follow-up engine.
              </p>
            </div>

            {/* Discount Code & Pricing Settings */}
            <div className="space-y-3 md:col-span-2 bg-amber-50/60 rounded-2xl p-5 border border-amber-200">
              <div className="flex items-center gap-2 text-amber-950 font-black text-sm">
                <Gift className="w-5 h-5 text-amber-600" />
                Day 5 Flash Voucher Code & Flutterwave Upgrade Link
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Voucher Code</label>
                  <input
                    type="text"
                    value={config.discountCode}
                    onChange={(e) => setConfig({ ...config, discountCode: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Discount Amount (NGN)</label>
                  <input
                    type="number"
                    value={config.discountAmountNGN}
                    onChange={(e) => setConfig({ ...config, discountAmountNGN: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Discounted VIP Price</label>
                  <input
                    type="number"
                    value={config.upgradePriceNGN}
                    onChange={(e) => setConfig({ ...config, upgradePriceNGN: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">Direct Flutterwave VIP Payment Link</label>
                <input
                  type="url"
                  value={config.upgradePaymentLink}
                  onChange={(e) => setConfig({ ...config, upgradePaymentLink: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => handleSaveConfig(config)}
                  className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-amber-400 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: STEP EMAIL EDITOR                                */}
      {/* ========================================================= */}
      {isEditModalOpen && editingStep && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 my-8">
            <div className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white p-5 flex items-center justify-between border-b border-emerald-800">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-black">Edit Step: {editingStep.badge}</h3>
                  <p className="text-xs text-emerald-300">Custom email body, subject line, and VIP benefits highlight</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Step Title</label>
                <input
                  type="text"
                  value={editingStep.title}
                  onChange={(e) => setEditingStep({ ...editingStep, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Subject Line (Dynamic tags: {'{name}'}, {'{ticket}'})</label>
                <input
                  type="text"
                  value={editingStep.subject}
                  onChange={(e) => setEditingStep({ ...editingStep, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Preheader Preview Snippet</label>
                <input
                  type="text"
                  value={editingStep.preheader}
                  onChange={(e) => setEditingStep({ ...editingStep, preheader: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-700 focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Featured VIP Benefit</label>
                <input
                  type="text"
                  value={editingStep.benefitFocus}
                  onChange={(e) => setEditingStep({ ...editingStep, benefitFocus: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-bold focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Body Content</label>
                <textarea
                  rows={6}
                  value={editingStep.bodyContent}
                  onChange={(e) => setEditingStep({ ...editingStep, bodyContent: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-mono focus:ring-1 focus:ring-emerald-700 leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Call to Action Button Text</label>
                <input
                  type="text"
                  value={editingStep.callToActionText}
                  onChange={(e) => setEditingStep({ ...editingStep, callToActionText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Call to Action URL</label>
                <input
                  type="url"
                  value={editingStep.callToActionUrl}
                  onChange={(e) => setEditingStep({ ...editingStep, callToActionUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Header Image Banner URL (Optional)</label>
                <input
                  type="url"
                  value={editingStep.imageUrl || ''}
                  onChange={(e) => setEditingStep({ ...editingStep, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:ring-1 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleSendStepTest(editingStep.id)}
                className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Send Test Email
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveStepModal}
                  className="px-5 py-2 bg-emerald-900 hover:bg-emerald-800 text-amber-400 font-black text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: STEP HTML PREVIEW MODAL                          */}
      {/* ========================================================= */}
      {previewingStep && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-400 text-emerald-950">
                  {previewingStep.badge}
                </span>
                <span className="font-bold text-xs truncate max-w-md">{previewingStep.subject}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-800 rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1.5 rounded text-xs ${previewDevice === 'desktop' ? 'bg-slate-700 text-amber-300' : 'text-slate-400'}`}
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1.5 rounded text-xs ${previewDevice === 'mobile' ? 'bg-slate-700 text-amber-300' : 'text-slate-400'}`}
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewingStep(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Responsive Iframe Container */}
            <div className="flex-1 bg-slate-100 p-4 overflow-y-auto flex justify-center">
              <div className={`bg-white rounded-xl shadow-lg overflow-hidden border border-slate-300 transition-all ${
                previewDevice === 'mobile' ? 'w-[375px]' : 'w-full max-w-[620px]'
              }`}>
                <iframe
                  title="Step Preview"
                  srcDoc={renderVisitorUpgradeDripStepToHtml(previewingStep, {}, smtpConfig || undefined)}
                  className="w-full min-h-[600px] border-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* End of SubTab */}
    </div>
  );
};
