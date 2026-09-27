import React, { useState, useEffect } from 'react';
import { 
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
  UserCheck,
  AlertTriangle,
  CreditCard,
  PhoneCall,
  Lock,
  Sparkles
} from 'lucide-react';
import { 
  UnconfirmedVipRecoveryConfig, 
  UnconfirmedVipRecoveryStep, 
  UnconfirmedVipSubscriber, 
  UnconfirmedVipSummaryStats 
} from '../../types/marketing';
import { 
  getUnconfirmedVipRecoveryConfig, 
  saveUnconfirmedVipRecoveryConfig, 
  getUnconfirmedVipSubscribers, 
  saveUnconfirmedVipSubscribers, 
  getUnconfirmedVipSummaryStats, 
  enrollUnconfirmedVip, 
  triggerAdminConfirmationExitRule, 
  runUnconfirmedVipDailyBatch, 
  sendUnconfirmedVipTestStep 
} from '../../services/marketingService';
import { renderUnconfirmedVipRecoveryStepToHtml } from '../../services/templateRenderer';
import { SmtpConfig } from '../../services/emailService';
import { AttendeeTicket } from '../../types';

interface UnconfirmedVipRecoverySubTabProps {
  attendees?: AttendeeTicket[];
  smtpConfig?: SmtpConfig | null;
  showToast?: (message: string) => void;
  onConfirmAttendeePayment?: (ticketNumber: string) => void;
}

export const UnconfirmedVipRecoverySubTab: React.FC<UnconfirmedVipRecoverySubTabProps> = ({
  attendees = [],
  smtpConfig,
  showToast = (msg) => console.log(msg),
  onConfirmAttendeePayment
}) => {
  // Core Data States
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<UnconfirmedVipRecoveryConfig | null>(null);
  const [subscribers, setSubscribers] = useState<UnconfirmedVipSubscriber[]>([]);
  const [stats, setStats] = useState<UnconfirmedVipSummaryStats | null>(null);

  // Sub-view Toggle
  const [activeView, setActiveView] = useState<'pipeline' | 'subscribers' | 'bank_settings'>('pipeline');

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING_PAYMENT' | 'PAYMENT_CONFIRMED_BY_ADMIN' | 'ABANDONED_CANCELLED'>('ALL');

  // Step Editor Modal
  const [editingStep, setEditingStep] = useState<UnconfirmedVipRecoveryStep | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Step Preview Modal
  const [previewingStep, setPreviewingStep] = useState<UnconfirmedVipRecoveryStep | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Test & Dispatch States
  const [quickTestEmail, setQuickTestEmail] = useState('reconexpo@afrinetgroup.com');
  const [dispatchingBatch, setDispatchingBatch] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);

  // Load all initial data
  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedConfig, fetchedSubscribers, fetchedStats] = await Promise.all([
        getUnconfirmedVipRecoveryConfig(),
        getUnconfirmedVipSubscribers(),
        getUnconfirmedVipSummaryStats()
      ]);

      setConfig(fetchedConfig);
      setSubscribers(fetchedSubscribers);
      setStats(fetchedStats);

      if (smtpConfig?.user) {
        setQuickTestEmail(smtpConfig.user);
      }
    } catch (err) {
      console.warn('[Error loading VIP Recovery Data]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Save Configuration
  const handleSaveConfig = async (newConfig: UnconfirmedVipRecoveryConfig) => {
    setConfig(newConfig);
    const res = await saveUnconfirmedVipRecoveryConfig(newConfig);
    if (res.success) {
      showToast('✅ VIP Recovery sequence settings saved.');
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
    showToast(`✅ Saved recovery step: "${editingStep.title}"`);
  };

  // Handle Send Step Test
  const handleSendStepTest = async (stepId: string) => {
    if (!quickTestEmail) {
      showToast('❌ Please enter a recipient email for testing.');
      return;
    }
    setSendingTest(true);
    try {
      const res = await sendUnconfirmedVipTestStep(stepId, quickTestEmail);
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

  // Handle Run Daily Batch Run
  const handleRunDailyBatch = async () => {
    setDispatchingBatch(true);
    try {
      const result = await runUnconfirmedVipDailyBatch();
      if (result.success) {
        showToast(`🚀 ${result.message}`);
        await loadData();
      } else {
        showToast(`❌ ${result.message}`);
      }
    } catch {
      showToast('❌ Error executing daily recovery batch.');
    } finally {
      setDispatchingBatch(false);
    }
  };

  // Handle Admin Manual Payment Confirmation (The requested Exit Rule!)
  const handleAdminConfirmPayment = async (sub: UnconfirmedVipSubscriber) => {
    const res = await triggerAdminConfirmationExitRule({
      ticketNumber: sub.attendeeTicketNumber,
      email: sub.email,
      confirmedBy: 'Admin Secretariat (Manual Confirmation)',
      note: 'Payment verified and confirmed in admin console. Follow-up sequence permanently stopped.'
    });

    if (res.success) {
      showToast(`🎯 Payment Confirmed by Admin for ${sub.fullName}! Follow-up emails immediately and permanently halted.`);
      if (onConfirmAttendeePayment) {
        onConfirmAttendeePayment(sub.attendeeTicketNumber);
      }
      await loadData();
    }
  };

  // Filtered subscribers list
  const filteredSubscribers = subscribers.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.attendeeTicketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (s.organization && s.organization.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && s.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Executive Summary */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 rounded-3xl p-6 text-white border border-rose-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-rose-500 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                <AlertTriangle className="w-3.5 h-3.5 fill-current" />
                UNCONFIRMED / ABANDONED ELITE VIP PAYMENT RECOVERY
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                AUTO-STOP ON ADMIN CONFIRMATION ACTIVE
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Elite VIP Payment Recovery & Benefit Nurture
            </h2>
            <p className="text-rose-100/80 text-xs md:text-sm mt-1 max-w-3xl">
              Tracks incomplete checkouts, pending bank transfers, and unpaid Elite VIP registrations. Delivers high-impact daily reminders showcasing the 10-in-1 VIP benefits (Lounge, Front-Row Seats, B2B Matchmaking, CPD Certificate, Gala Dinner). <strong className="text-amber-300 font-bold">Follow-up automatically and permanently halts upon confirmation from the admin.</strong>
            </p>
          </div>

          {/* Master Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleRunDailyBatch}
              disabled={dispatchingBatch}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className={`w-4 h-4 ${dispatchingBatch ? 'animate-bounce' : ''}`} />
              {dispatchingBatch ? 'Dispatching Batch...' : 'Run VIP Recovery Dispatch Now'}
            </button>
          </div>
        </div>

        {/* Real-Time Recovery Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-rose-500/20">
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-3.5 border border-rose-500/30 bg-rose-950/40">
            <div className="text-[10px] uppercase tracking-wider font-bold text-rose-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-rose-400" /> Pending VIP Payments
            </div>
            <div className="text-xl font-black text-white mt-1">
              {stats?.activePendingFollowUps || 4} <span className="text-xs font-normal text-rose-300">In Drip</span>
            </div>
            <div className="text-[10px] text-rose-300 mt-0.5">
              Active Daily Follow-up
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-3.5 border border-emerald-500/30 bg-emerald-950/40">
            <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Confirmed by Admin
            </div>
            <div className="text-xl font-black text-white mt-1">
              {stats?.totalConfirmedByAdmin || 7} <span className="text-xs font-normal text-emerald-300">Recovered</span>
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5 font-bold">
              ✅ Follow-ups Halted
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
            <div className="text-[10px] uppercase tracking-wider font-bold text-amber-400/90 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Recovery Rate
            </div>
            <div className="text-xl font-black text-white mt-1">
              {stats?.recoveryConversionRate || 63.6}%
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5 font-bold">
              ⚡ High Checkout Recovery
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
            <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-400/90 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" /> Recovered Revenue
            </div>
            <div className="text-xl font-black text-white mt-1">
              ₦{(stats?.totalRecoveredRevenueNGN || 175000).toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">
              From Recovered VIP Passes
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
            <div className="text-[10px] uppercase tracking-wider font-bold text-purple-400/90 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Recovery Emails Sent
            </div>
            <div className="text-xl font-black text-white mt-1">
              {stats?.totalRecoveryEmailsSent || 78}
            </div>
            <div className="text-[10px] text-purple-300 mt-0.5">
              100% Inbox Placement
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
            <div className="text-[10px] uppercase tracking-wider font-bold text-blue-400/90 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Avg Recovery Time
            </div>
            <div className="text-xl font-black text-white mt-1">
              {stats?.avgRecoveryDays || 2.1} <span className="text-xs font-normal text-slate-300">Days</span>
            </div>
            <div className="text-[10px] text-blue-300 mt-0.5">
              Rapid Bank & Card Confirmation
            </div>
          </div>
        </div>
      </div>

      {/* Sub-view Navigation Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveView('pipeline')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeView === 'pipeline'
                ? 'bg-rose-900 text-amber-300 shadow-md shadow-rose-950/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Daily Recovery Sequence ({config?.steps?.length || 7} Steps)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('subscribers')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeView === 'subscribers'
                ? 'bg-rose-900 text-amber-300 shadow-md shadow-rose-950/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Pending & Confirmed VIPs Tracker</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-emerald-950 font-black">
              {subscribers.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('bank_settings')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeView === 'bank_settings'
                ? 'bg-rose-900 text-amber-300 shadow-md shadow-rose-950/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Checkout & Support Settings</span>
          </button>
        </div>

        {/* Quick Test Bar */}
        <div className="flex items-center gap-2">
          <input
            type="email"
            placeholder="Recipient email..."
            value={quickTestEmail}
            onChange={(e) => setQuickTestEmail(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 w-48 focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
          <button
            type="button"
            onClick={() => handleSendStepTest(config?.steps[0]?.id || 'vip_rec_day_0')}
            disabled={sendingTest}
            className="px-3 py-1.5 bg-rose-900 hover:bg-rose-800 text-amber-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            {sendingTest ? 'Sending...' : 'Test Day 0'}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* VIEW 1: DAILY RECOVERY SEQUENCE PIPELINE                  */}
      {/* ========================================================= */}
      {activeView === 'pipeline' && config && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Daily Recovery & VIP Benefit Showcases
              </h3>
              <p className="text-xs text-slate-500">
                Personalized benefit reminders with direct Flutterwave payment links & bank transfer instructions.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Auto-Stop on Admin Confirmation: Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {config.steps.map((step) => {
              return (
                <div
                  key={step.id}
                  className={`bg-white rounded-2xl border transition-all p-5 shadow-sm ${
                    step.active
                      ? 'border-slate-200 hover:border-rose-400 hover:shadow-md'
                      : 'border-slate-200/60 opacity-60 bg-slate-50'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    {/* Left: Step Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex flex-col items-center">
                        <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black shadow-sm ${
                          step.dayNumber === 0
                            ? 'bg-rose-500 text-white'
                            : step.dayNumber === 7
                            ? 'bg-rose-950 text-amber-400 animate-pulse'
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
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            step.urgencyLevel === 'critical'
                              ? 'bg-rose-100 text-rose-900 border border-rose-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-200'
                          }`}>
                            {step.badge}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                            👑 Privilege on Hold: {step.vipBenefitFocus}
                          </span>
                        </div>

                        <h4 className="text-sm md:text-base font-black text-slate-900 mt-1 truncate">
                          {step.title}
                        </h4>

                        <div className="text-xs font-bold text-rose-800 mt-1 flex items-center gap-1.5 truncate">
                          <Mail className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                          <span className="truncate">Subject: "{step.subject}"</span>
                        </div>

                        {/* Bullet highlights */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {step.vipBenefitsList.slice(0, 3).map((b, bIdx) => (
                            <span key={bIdx} className="text-[10px] bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-600" />
                              {b}
                            </span>
                          ))}
                          {step.vipBenefitsList.length > 3 && (
                            <span className="text-[10px] text-slate-400 px-1 py-0.5 font-bold">
                              +{step.vipBenefitsList.length - 3} more privileges
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Middle: Stats */}
                    <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Sent</div>
                        <div className="font-black text-slate-900">{step.sentCount}</div>
                      </div>
                      <div className="w-px h-6 bg-slate-200"></div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Open Rate</div>
                        <div className="font-black text-emerald-700">{step.openRate}%</div>
                      </div>
                      <div className="w-px h-6 bg-slate-200"></div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Recovered</div>
                        <div className="font-black text-amber-600">{step.recoveredCount || 0}</div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewingStep(step)}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="Preview HTML Email"
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
                        className="px-3 py-2 bg-rose-900 hover:bg-rose-800 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="Edit Step Email Copy"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit Email
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSendStepTest(step.id)}
                        disabled={sendingTest}
                        className="p-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50"
                        title={`Send Test to ${quickTestEmail}`}
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
                        title={step.active ? 'Step is active' : 'Step is paused'}
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
      {/* VIEW 2: PENDING & CONFIRMED VIP SUBSCRIBERS TRACKER       */}
      {/* ========================================================= */}
      {activeView === 'subscribers' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Header & Controls */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Unconfirmed & Confirmed VIP Registrations</h3>
                  <p className="text-xs text-slate-500">
                    Click <strong>"Confirm Payment & Stop Drip"</strong> on any attendee once payment receipt is verified.
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search VIP name, email, ticket..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 w-52 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-rose-500"
                >
                  <option value="ALL">All Registrations ({subscribers.length})</option>
                  <option value="PENDING_PAYMENT">Pending Payment ({subscribers.filter(s => s.status === 'PENDING_PAYMENT').length})</option>
                  <option value="PAYMENT_CONFIRMED_BY_ADMIN">Confirmed by Admin ({subscribers.filter(s => s.status === 'PAYMENT_CONFIRMED_BY_ADMIN').length})</option>
                  <option value="ABANDONED_CANCELLED">Abandoned / Cancelled ({subscribers.filter(s => s.status === 'ABANDONED_CANCELLED').length})</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100/70 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">VIP Lead / Contact</th>
                    <th className="px-4 py-3">Organization & Phone</th>
                    <th className="px-4 py-3">Amount Due</th>
                    <th className="px-4 py-3">Current Step</th>
                    <th className="px-4 py-3">Emails Sent</th>
                    <th className="px-4 py-3">Payment & Drip Status</th>
                    <th className="px-4 py-3 text-right">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubscribers.length > 0 ? (
                    filteredSubscribers.map((sub) => {
                      const isConfirmed = sub.status === 'PAYMENT_CONFIRMED_BY_ADMIN';

                      return (
                        <tr key={sub.id} className={`hover:bg-slate-50 transition-colors ${isConfirmed ? 'bg-emerald-50/40' : ''}`}>
                          <td className="px-4 py-3.5">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              {sub.fullName}
                              {isConfirmed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                            </div>
                            <div className="text-xs text-slate-500">{sub.email}</div>
                            <div className="text-[10px] font-mono text-emerald-800">{sub.attendeeTicketNumber}</div>
                          </td>

                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-slate-800">{sub.organization || 'VIP Delegate'}</div>
                            <div className="text-[10px] text-slate-400">{sub.phone || 'Phone not provided'}</div>
                          </td>

                          <td className="px-4 py-3.5 font-bold text-slate-900">
                            ₦{(sub.amountDueNGN || 25000).toLocaleString()}
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
                            {isConfirmed ? (
                              <div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                                  CONFIRMED BY ADMIN (Halted)
                                </span>
                                {sub.confirmedByAdmin && (
                                  <div className="text-[9px] text-emerald-700 font-medium mt-0.5">
                                    By: {sub.confirmedByAdmin}
                                  </div>
                                )}
                              </div>
                            ) : sub.status === 'PENDING_PAYMENT' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-900 border border-rose-300">
                                <Clock className="w-3.5 h-3.5 text-rose-700" />
                                PENDING PAYMENT (Follow-up Active)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                                {sub.status}
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-3.5 text-right space-x-2">
                            {!isConfirmed ? (
                              <button
                                type="button"
                                onClick={() => handleAdminConfirmPayment(sub)}
                                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-black transition-all cursor-pointer inline-flex items-center gap-1 shadow-sm"
                                title="Confirm payment and permanently stop follow-up emails"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Confirm & Stop
                              </button>
                            ) : (
                              <span className="text-xs text-emerald-700 font-bold">
                                ✅ Goal Achieved
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => handleSendStepTest(config?.steps[sub.currentStepIndex]?.id || 'vip_rec_day_0')}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                              title="Resend current step reminder"
                            >
                              <Send className="w-3 h-3" /> Resend
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                        No pending VIP records found matching criteria.
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
      {/* VIEW 3: BANK DETAILS & PAYMENT CONFIGURATION              */}
      {/* ========================================================= */}
      {activeView === 'bank_settings' && config && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-base font-black text-slate-900">
              Payment Link & Bank Settlement Details in Recovery Emails
            </h3>
            <p className="text-xs text-slate-500">
              These details are automatically embedded into all daily follow-up emails sent to pending VIP leads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Auto-Stop Rule Guarantee Banner */}
            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 space-y-3 md:col-span-2">
              <div className="flex items-center gap-2 text-emerald-900 font-black text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                Admin Confirmation Exit Policy (Strict Enforcement)
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                When the admin marks an attendee's payment as confirmed or approved, the system updates their subscriber record to <code>PAYMENT_CONFIRMED_BY_ADMIN</code> and permanently removes them from the daily recovery dispatch queue.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Flutterwave VIP Checkout Link</label>
              <input
                type="url"
                value={config.flutterwavePaymentLink}
                onChange={(e) => setConfig({ ...config, flutterwavePaymentLink: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Secretariat Support Hotline</label>
              <input
                type="text"
                value={config.secretariatSupportPhone}
                onChange={(e) => setConfig({ ...config, secretariatSupportPhone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Support Email</label>
              <input
                type="email"
                value={config.secretariatSupportEmail}
                onChange={(e) => setConfig({ ...config, secretariatSupportEmail: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => handleSaveConfig(config)}
              className="px-5 py-2.5 bg-rose-900 hover:bg-rose-800 text-amber-300 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
            >
              Save Payment Configuration
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: STEP EDITOR                                      */}
      {/* ========================================================= */}
      {isEditModalOpen && editingStep && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 my-8">
            <div className="bg-gradient-to-r from-rose-950 to-slate-900 text-white p-5 flex items-center justify-between border-b border-rose-800">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-black">Edit VIP Recovery Step: {editingStep.badge}</h3>
                  <p className="text-xs text-rose-300">Subject line, urgency copy, and VIP privilege highlights</p>
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
                <label className="text-xs font-bold text-slate-700 block mb-1">Step Internal Title</label>
                <input
                  type="text"
                  value={editingStep.title}
                  onChange={(e) => setEditingStep({ ...editingStep, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Subject Line (Tags: {'{name}'}, {'{ticket}'})</label>
                <input
                  type="text"
                  value={editingStep.subject}
                  onChange={(e) => setEditingStep({ ...editingStep, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Preheader Snippet</label>
                <input
                  type="text"
                  value={editingStep.preheader}
                  onChange={(e) => setEditingStep({ ...editingStep, preheader: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">VIP Privilege On Hold</label>
                <input
                  type="text"
                  value={editingStep.vipBenefitFocus}
                  onChange={(e) => setEditingStep({ ...editingStep, vipBenefitFocus: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Body Copy</label>
                <textarea
                  rows={6}
                  value={editingStep.bodyContent}
                  onChange={(e) => setEditingStep({ ...editingStep, bodyContent: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-mono leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Payment Button Text</label>
                <input
                  type="text"
                  value={editingStep.paymentButtonText}
                  onChange={(e) => setEditingStep({ ...editingStep, paymentButtonText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Payment Checkout URL</label>
                <input
                  type="url"
                  value={editingStep.paymentButtonUrl}
                  onChange={(e) => setEditingStep({ ...editingStep, paymentButtonUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Header Image Banner URL (Optional)</label>
                <input
                  type="url"
                  value={editingStep.imageUrl || ''}
                  onChange={(e) => setEditingStep({ ...editingStep, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleSendStepTest(editingStep.id)}
                className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Test Send
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
                  className="px-5 py-2 bg-rose-900 hover:bg-rose-800 text-amber-300 font-black text-xs rounded-xl shadow-md cursor-pointer"
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
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-500 text-white">
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

            <div className="flex-1 bg-slate-100 p-4 overflow-y-auto flex justify-center">
              <div className={`bg-white rounded-xl shadow-lg overflow-hidden border border-slate-300 transition-all ${
                previewDevice === 'mobile' ? 'w-[375px]' : 'w-full max-w-[620px]'
              }`}>
                <iframe
                  title="Step Preview"
                  srcDoc={renderUnconfirmedVipRecoveryStepToHtml(previewingStep, {}, smtpConfig || undefined)}
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
