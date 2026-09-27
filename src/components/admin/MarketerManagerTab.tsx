import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  MarketerAccount, 
  AttendeeTicket,
  CommissionPaymentConfirmation
} from '../../types';
import { useExpoData } from '../../context/ExpoDataContext';
import { 
  UserPlus, 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  Copy, 
  Eye, 
  EyeOff, 
  Building2, 
  DollarSign, 
  Percent, 
  Tag, 
  Share2, 
  Wallet, 
  Award, 
  Calendar, 
  ExternalLink, 
  Key, 
  FileText, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  UserCheck, 
  Phone, 
  Mail, 
  CreditCard,
  BarChart3,
  PieChart as PieChartIcon,
  Receipt,
  BadgeCheck,
  Printer,
  FileCheck,
  AlertTriangle,
  Clock,
  RotateCcw
} from 'lucide-react';

interface MarketerManagerTabProps {
  marketerAccounts: MarketerAccount[];
  attendees: AttendeeTicket[];
  isMainAdmin: boolean;
  onRegisterMarketer: (data: Omit<MarketerAccount, 'id' | 'createdAt' | 'lastLogin' | 'totalEarningsNGN'>) => { success: boolean; message: string; marketer?: MarketerAccount };
  onUpdateMarketer: (id: string, updated: Partial<MarketerAccount>) => { success: boolean; message: string };
  onDeleteMarketer: (id: string) => { success: boolean; message: string };
  onConfirmCommissionPayment?: (marketerId: string, amountNGN?: number, notes?: string, customRef?: string) => { success: boolean; message: string; confirmation?: CommissionPaymentConfirmation };
  onTestLoginMarketer: (username: string, pass: string) => void;
  showToast: (msg: string) => void;
}

export const MarketerManagerTab: React.FC<MarketerManagerTabProps> = ({
  marketerAccounts,
  attendees,
  isMainAdmin,
  onRegisterMarketer,
  onUpdateMarketer,
  onDeleteMarketer,
  onConfirmCommissionPayment,
  onTestLoginMarketer,
  showToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'ACTIVE' | 'SUSPENDED'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMarketerId, setEditingMarketerId] = useState<string | null>(null);
  const [viewingSignupsMarketer, setViewingSignupsMarketer] = useState<MarketerAccount | null>(null);
  const [signupsModalSubTab, setSignupsModalSubTab] = useState<'signups' | 'confirmations'>('signups');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [pendingDeleteMarketer, setPendingDeleteMarketer] = useState<MarketerAccount | null>(null);

  // Commission Payment Confirmation States for Admin
  const [confirmingPayoutMarketer, setConfirmingPayoutMarketer] = useState<MarketerAccount | null>(null);
  const [adminPayoutAmount, setAdminPayoutAmount] = useState<string>('');
  const [adminPayoutNotes, setAdminPayoutNotes] = useState<string>('');
  const [viewingConfirmation, setViewingConfirmation] = useState<CommissionPaymentConfirmation | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'SUSPENDED' | 'PENDING'>('ACTIVE');
  const [payoutStatus, setPayoutStatus] = useState<'UNPAID' | 'PARTIAL' | 'PAID'>('UNPAID');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [notes, setNotes] = useState('');
  const [showFormPassword, setShowFormPassword] = useState(false);

  // Active Tab Mode: 'marketers' | 'activity' | 'analytics'
  const [viewMode, setViewMode] = useState<'marketers' | 'activity' | 'analytics'>('marketers');

  // Calculate Overall Referral Performance Metrics
  const referralAttendees = attendees.filter(a => a.referralCode || a.marketerId);
  const totalReferralSignups = referralAttendees.length;

  // Helper to accurately derive commission per referred attendee (₦5,000 for VIP, 10% for Exhibitor Booth Stand)
  const getAttendeeCommission = (a: AttendeeTicket): number => {
    if (typeof a.commissionEarnedNGN === 'number' && a.commissionEarnedNGN > 0) {
      return a.commissionEarnedNGN;
    }
    const isExh = a.passType === 'exhibitor' || (a.tier && a.tier.toLowerCase().includes('exhibitor'));
    if (isExh) {
      const amount = typeof a.dealValue === 'number' && a.dealValue > 0 
        ? a.dealValue 
        : (parseInt((a.amountPaid || '').replace(/[^0-9]/g, ''), 10) || 350000);
      return Math.round(amount * 0.10);
    }
    const isElt = a.passType === 'elite' || (a.tier && a.tier.toLowerCase().includes('elite'));
    if (isElt) {
      return 5000;
    }
    return 0;
  };

  const totalReferralRevenue = referralAttendees.reduce((acc, curr) => {
    const paidStr = (curr.amountPaid || '0').replace(/[^0-9]/g, '');
    return acc + (parseInt(paidStr, 10) || 0);
  }, 0);

  const totalDiscountsGiven = referralAttendees.reduce((acc, curr) => {
    return acc + (curr.discountAppliedNGN || 0);
  }, 0);

  const totalCommissionsEarned = marketerAccounts.reduce((acc, m) => {
    return acc + (m.totalEarningsNGN || 0);
  }, 0);

  // Prepare Marketer Performance Data for Recharts
  const marketerPerformanceData = marketerAccounts.map(m => {
    const mktAttendees = attendees.filter(a => 
      (a.referralCode || '').toUpperCase() === m.referralCode.toUpperCase() || a.marketerId === m.id
    );
    const totalReferrals = mktAttendees.length;
    const totalCommission = m.totalEarningsNGN || mktAttendees.reduce((sum, a) => sum + getAttendeeCommission(a), 0);
    const totalRevenue = mktAttendees.reduce((sum, a) => {
      const val = parseInt((a.amountPaid || '0').replace(/[^0-9]/g, ''), 10) || 0;
      return sum + val;
    }, 0);

    return {
      name: m.fullName.length > 12 ? `${m.fullName.split(' ')[0]}` : m.fullName,
      fullName: m.fullName,
      code: m.referralCode,
      referrals: totalReferrals,
      commission: totalCommission,
      revenue: totalRevenue,
    };
  });

  // Prepare Pass Tier Referral Breakdown
  const tierDistributionMap: Record<string, { count: number; commission: number; revenue: number }> = {};
  referralAttendees.forEach(a => {
    const tierName = a.tier || 'Other Pass';
    if (!tierDistributionMap[tierName]) {
      tierDistributionMap[tierName] = { count: 0, commission: 0, revenue: 0 };
    }
    tierDistributionMap[tierName].count += 1;
    tierDistributionMap[tierName].commission += getAttendeeCommission(a);
    const paidVal = parseInt((a.amountPaid || '0').replace(/[^0-9]/g, ''), 10) || 0;
    tierDistributionMap[tierName].revenue += paidVal;
  });

  const CHART_COLORS = ['#10b981', '#f59e0b', '#06b6d4', '#a855f7', '#ec4899', '#3b82f6'];

  const tierChartData = Object.entries(tierDistributionMap).map(([name, stat]) => ({
    name,
    value: stat.count,
    commission: stat.commission,
    revenue: stat.revenue
  }));

  // Filter Marketers
  const filteredMarketers = marketerAccounts.filter(m => {
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q || 
      m.fullName.toLowerCase().includes(q) ||
      m.username.toLowerCase().includes(q) ||
      m.referralCode.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.phone && m.phone.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  const generateReferralCode = (nameStr: string) => {
    const prefix = nameStr.trim().split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '') || 'PROMO';
    const year = '2026';
    const num = Math.floor(10 + Math.random() * 90);
    return `${prefix}${year}${num}`;
  };

  const handleOpenRegisterModal = () => {
    setEditingMarketerId(null);
    setFullName('');
    setUsername('');
    setPassword('mkt' + Math.floor(100 + Math.random() * 900));
    setEmail('');
    setPhone('');
    setReferralCode(generateReferralCode('PROMO'));
    setStatus('ACTIVE');
    setPayoutStatus('UNPAID');
    setBankName('');
    setAccountNumber('');
    setAccountName('');
    setNotes('Event Affiliate Marketer');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (mkt: MarketerAccount) => {
    setEditingMarketerId(mkt.id);
    setFullName(mkt.fullName);
    setUsername(mkt.username);
    setPassword(mkt.password);
    setEmail(mkt.email);
    setPhone(mkt.phone || '');
    setReferralCode(mkt.referralCode);
    setStatus(mkt.status);
    setPayoutStatus(mkt.payoutStatus || 'UNPAID');
    setBankName(mkt.bankDetails?.bankName || '');
    setAccountNumber(mkt.bankDetails?.accountNumber || '');
    setAccountName(mkt.bankDetails?.accountName || '');
    setNotes(mkt.notes || '');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      alert('Please enter marketer full name.');
      return;
    }
    if (!username.trim()) {
      alert('Please enter marketer portal username.');
      return;
    }
    if (!referralCode.trim()) {
      alert('Please specify a unique referral code.');
      return;
    }

    if (editingMarketerId) {
      const res = onUpdateMarketer(editingMarketerId, {
        fullName: fullName.trim(),
        username: username.trim(),
        password,
        email: email.trim(),
        phone: phone.trim(),
        referralCode: referralCode.trim().toUpperCase(),
        status,
        payoutStatus,
        bankDetails: {
          bankName: bankName.trim(),
          accountNumber: accountNumber.trim(),
          accountName: accountName.trim()
        },
        notes: notes.trim()
      });
      showToast(res.message);
      if (res.success) setIsModalOpen(false);
    } else {
      const res = onRegisterMarketer({
        fullName: fullName.trim(),
        username: username.trim(),
        password,
        email: email.trim(),
        phone: phone.trim(),
        referralCode: referralCode.trim().toUpperCase(),
        status,
        payoutStatus,
        bankDetails: {
          bankName: bankName.trim(),
          accountNumber: accountNumber.trim(),
          accountName: accountName.trim()
        },
        notes: notes.trim()
      });
      showToast(res.message);
      if (res.success) setIsModalOpen(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    showToast(`Referral Code "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyLink = (code: string) => {
    const link = `https://reconexpo.afrinetgroup.com/?ref=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedId(`link_${code}`);
    showToast(`Direct Marketer Referral Link copied: ${link}`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const togglePasswordReveal = (id: string) => {
    setRevealedPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleStatus = (mkt: MarketerAccount) => {
    let newStatus: 'ACTIVE' | 'SUSPENDED' | 'PENDING' = 'ACTIVE';
    if (mkt.status === 'PENDING') {
      newStatus = 'ACTIVE';
    } else if (mkt.status === 'ACTIVE') {
      newStatus = 'SUSPENDED';
    } else {
      newStatus = 'ACTIVE';
    }
    const res = onUpdateMarketer(mkt.id, { status: newStatus });
    showToast(mkt.status === 'PENDING' ? `✅ Confirmed & Activated marketer account for ${mkt.fullName}!` : res.message);
  };

  // Helper to get marketer's signups
  const getMarketerSignups = (mktCode: string) => {
    return attendees.filter(a => (a.referralCode || '').toUpperCase() === mktCode.toUpperCase() || a.marketerId === mktCode);
  };

  // Download Marketers List as CSV (Spreadsheet)
  const handleDownloadMarketersCsv = (targetList: MarketerAccount[] = filteredMarketers) => {
    if (targetList.length === 0) {
      showToast("No marketer records to download.");
      return;
    }

    const headers = [
      "Marketer ID",
      "Full Name",
      "Username",
      "Email Address",
      "Phone Number",
      "Referral Code",
      "Referral Link",
      "Account Status",
      "Payout Status",
      "Total Referrals (Count)",
      "Total Revenue Generated (NGN)",
      "Total Commission Earned (NGN)",
      "Bank Name",
      "Account Number",
      "Account Name",
      "Registered Date",
      "Last Login",
      "Notes"
    ];

    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    const rows = targetList.map(m => {
      const mktAttendees = attendees.filter(a => 
        (a.referralCode || '').toUpperCase() === m.referralCode.toUpperCase() || a.marketerId === m.id
      );
      const referralCount = mktAttendees.length;
      const totalRev = mktAttendees.reduce((sum, a) => {
        const val = parseInt((a.amountPaid || '0').replace(/[^0-9]/g, ''), 10) || 0;
        return sum + val;
      }, 0);
      const totalComm = m.totalEarningsNGN || mktAttendees.reduce((sum, a) => sum + getAttendeeCommission(a), 0);

      return [
        `"${m.id}"`,
        `"${m.fullName.replace(/"/g, '""')}"`,
        `"${m.username.replace(/"/g, '""')}"`,
        `"${m.email.replace(/"/g, '""')}"`,
        `"${m.phone || ''}"`,
        `"${m.referralCode}"`,
        `"https://reconexpo.afrinetgroup.com/?ref=${m.referralCode}"`,
        `"${m.status}"`,
        `"${m.payoutStatus || 'UNPAID'}"`,
        `"${referralCount}"`,
        `"${totalRev}"`,
        `"${totalComm}"`,
        `"${(m.bankDetails?.bankName || '').replace(/"/g, '""')}"`,
        `"${m.bankDetails?.accountNumber || ''}"`,
        `"${(m.bankDetails?.accountName || '').replace(/"/g, '""')}"`,
        `"${m.createdAt ? new Date(m.createdAt).toLocaleDateString() : ''}"`,
        `"${m.lastLogin ? new Date(m.lastLogin).toLocaleString() : 'Never'}"`,
        `"${(m.notes || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RECON_Expo_2026_Marketers_List_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded ${targetList.length} marketer records (CSV)!`);
  };

  // Download Marketers List as JSON
  const handleDownloadMarketersJson = (targetList: MarketerAccount[] = filteredMarketers) => {
    const jsonStr = JSON.stringify(targetList, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RECON_Expo_2026_Marketers_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Marketers list exported to JSON file!");
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-200">
      {/* ------------------------------------------------------------- */}
      {/* HEADER & METRICS BANNER */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-gradient-to-r from-[#011e15] via-[#022c20] to-[#011e15] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-wider mb-3">
              <Tag className="w-4 h-4 text-emerald-400" />
              <span>Affiliate Marketing & Commission Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
              Marketer Accounts & Referral System
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Track affiliate marketers, unique promo codes, <strong>₦5,000 Elite VIP guest discounts</strong>, and <strong>Commission: 10% on Exhibitor Booth Stands</strong> on referred registrations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setViewMode('marketers')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                viewMode === 'marketers' ? 'bg-emerald-500 text-black font-black' : 'bg-white/10 hover:bg-white/15 text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Marketers List</span>
            </button>

            <button
              onClick={() => setViewMode('analytics')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                viewMode === 'analytics' ? 'bg-emerald-500 text-black font-black' : 'bg-white/10 hover:bg-white/15 text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Summary Charts</span>
            </button>

            <button
              onClick={() => setViewMode('activity')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                viewMode === 'activity' ? 'bg-emerald-500 text-black font-black' : 'bg-white/10 hover:bg-white/15 text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Activity Log</span>
            </button>

            <button
              onClick={() => handleDownloadMarketersCsv()}
              className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95"
              title="Download full list of Marketers with commission stats as CSV Spreadsheet"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download CSV</span>
            </button>

            <button
              onClick={handleOpenRegisterModal}
              className="px-4 py-2 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Marketer</span>
            </button>
          </div>
        </div>

        {/* METRICS CARDS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Active Marketers
            </span>
            <div className="text-2xl font-black text-white font-mono flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <span>{marketerAccounts.filter(m => m.status === 'ACTIVE').length}</span>
            </div>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Referral Signups
            </span>
            <div className="text-2xl font-black text-emerald-300 font-mono flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>{totalReferralSignups}</span>
            </div>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Referral Revenue
            </span>
            <div className="text-xl font-black text-cyan-300 font-mono">
              ₦{totalReferralRevenue.toLocaleString()}
            </div>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Marketer Commissions Earned
            </span>
            <div className="text-xl font-black text-amber-300 font-mono flex items-center gap-1">
              <Wallet className="w-4 h-4 text-amber-400" />
              <span>₦{totalCommissionsEarned.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SEARCH, STATUS FILTER & CONTROLS */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'marketers' && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/40 border border-white/10 rounded-2xl p-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search marketer name, code, phone, email..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>

            {(['ALL', 'PENDING', 'ACTIVE', 'SUSPENDED'] as const).map(st => {
              const count = st === 'ALL' ? marketerAccounts.length : marketerAccounts.filter(m => m.status === st).length;
              return (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    statusFilter === st
                      ? 'bg-emerald-500 text-black font-extrabold shadow-md'
                      : st === 'PENDING' && count > 0
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 font-bold'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                  }`}
                >
                  <span>{st}</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-extrabold">
                    {count}
                  </span>
                </button>
              );
            })}

            <div className="h-4 w-px bg-white/15 mx-1 hidden sm:block" />

            <button
              onClick={() => handleDownloadMarketersCsv(filteredMarketers)}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              title="Download filtered marketer records as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => handleDownloadMarketersJson(filteredMarketers)}
              className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-medium transition-all flex items-center gap-1 cursor-pointer"
              title="Download filtered marketer records as JSON"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MARKETERS GRID / LIST */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'marketers' && (
        filteredMarketers.length === 0 ? (
          <div className="bg-black/30 border border-white/10 rounded-3xl p-12 text-center">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Marketers Found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
              No marketer accounts match your current search query or filter. Register a marketer to start issuing referral codes.
            </p>
            <button
              onClick={handleOpenRegisterModal}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs"
            >
              Register First Marketer
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMarketers.map(mkt => {
              const signups = getMarketerSignups(mkt.referralCode);
              const isPending = mkt.status === 'PENDING';
              const isSuspended = mkt.status === 'SUSPENDED';
              const isPasswordRevealed = revealedPasswords[mkt.id];

              // Package breakdown count
              const vipCount = signups.filter(s => s.passType === 'elite' || s.passType === 'attendee').length;
              const exhibitorCount = signups.filter(s => s.passType === 'exhibitor').length;
              const sponsorCount = signups.filter(s => s.passType === 'sponsor').length;
              const partnerCount = signups.filter(s => s.passType === 'partner').length;
              const visitorCount = signups.filter(s => s.passType === 'visitor').length;

              return (
                <div
                  key={mkt.id}
                  className={`bg-black/60 border rounded-3xl p-5 shadow-xl transition-all relative flex flex-col justify-between ${
                    isPending 
                      ? 'border-amber-500/50 bg-amber-950/20 shadow-amber-900/20' 
                      : isSuspended 
                      ? 'border-red-500/30 bg-red-950/10' 
                      : 'border-emerald-500/30 hover:border-emerald-400/50'
                  }`}
                >
                  <div>
                    {/* Top Row: Avatar & Status */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-base font-black border ${
                          isPending
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
                            : isSuspended 
                            ? 'bg-red-500/20 text-red-300 border-red-500/40' 
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                        }`}>
                          {mkt.fullName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-white text-base leading-tight font-display">
                            {mkt.fullName}
                          </h3>
                          <span className="text-xs text-slate-400 font-mono block mt-0.5">
                            @{mkt.username}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleStatus(mkt)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                          isPending
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30 font-black'
                            : isSuspended
                            ? 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 hover:bg-emerald-500/30'
                        }`}
                        title={isPending ? 'Click to confirm & activate marketer account' : 'Toggle status'}
                      >
                        {isPending ? <Clock className="w-3 h-3 text-amber-400" /> : isSuspended ? <ShieldAlert className="w-3 h-3 text-red-400" /> : <ShieldCheck className="w-3 h-3 text-emerald-400" />}
                        <span>{isPending ? 'PENDING CONFIRMATION' : mkt.status}</span>
                      </button>
                    </div>

                    {/* Pending Confirmation CTA Banner */}
                    {isPending && (
                      <div className="bg-amber-500/15 border border-amber-500/40 rounded-2xl p-3 mb-3 text-xs space-y-2">
                        <div className="flex items-center gap-2 text-amber-300 font-bold">
                          <Clock className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
                          <span>Registered on Homepage — Awaiting Admin Confirmation</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-snug">
                          Confirm this marketer account to activate their referral code (<strong className="text-white">{mkt.referralCode}</strong>) and enable dashboard login.
                        </p>
                        <button
                          onClick={() => {
                            onUpdateMarketer(mkt.id, { status: 'ACTIVE' });
                            showToast(`✅ Marketer account for ${mkt.fullName} (Code: ${mkt.referralCode}) has been confirmed and activated!`);
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-950/40 transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4 text-black" />
                          <span>CONFIRM & APPROVE MARKETER ACCOUNT</span>
                        </button>
                      </div>
                    )}

                    {/* Referral Code Promo Badge */}
                    <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3 mb-3 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                          Assigned Referral Code
                        </span>
                        <strong className="text-lg font-black text-white font-mono tracking-widest select-all">
                          {mkt.referralCode}
                        </strong>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopyCode(mkt.referralCode)}
                          title="Copy Promo Code"
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedId === mkt.referralCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="text-[10px]">Code</span>
                        </button>

                        <button
                          onClick={() => handleCopyLink(mkt.referralCode)}
                          title="Copy Direct Referral Link"
                          className="px-2.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 text-cyan-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedId === `link_${mkt.referralCode}` ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Share2 className="w-3.5 h-3.5" />}
                          <span className="text-[10px]">Link</span>
                        </button>
                      </div>
                    </div>

                    {/* Earnings & Wallet Card */}
                    <div className="bg-black/50 border border-white/10 rounded-2xl p-3 space-y-2 mb-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                          <Wallet className="w-3.5 h-3.5 text-amber-400" />
                          Total Earned
                        </span>
                        <strong className="text-base font-black text-amber-300 font-mono">
                          ₦{(mkt.totalEarningsNGN || 0).toLocaleString()}
                        </strong>
                      </div>

                      {/* Paid vs Pending Breakdown */}
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5 text-[11px]">
                        <div className="bg-emerald-950/30 rounded-xl p-1.5 border border-emerald-500/20">
                          <span className="text-[9px] text-emerald-400 font-bold uppercase block">Paid Out</span>
                          <span className="font-mono font-bold text-emerald-300 text-xs">
                            ₦{(mkt.paidEarningsNGN || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="bg-amber-950/30 rounded-xl p-1.5 border border-amber-500/20">
                          <span className="text-[9px] text-amber-400 font-bold uppercase block">Pending</span>
                          <span className="font-mono font-bold text-amber-300 text-xs">
                            ₦{(mkt.pendingEarningsNGN ?? Math.max(0, (mkt.totalEarningsNGN || 0) - (mkt.paidEarningsNGN || 0))).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs border-t border-white/5 pt-1.5">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Payout Status</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            mkt.payoutStatus === 'PAID' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                          }`}>
                            {mkt.payoutStatus || 'UNPAID'}
                          </span>

                          <button
                            type="button"
                            onClick={() => {
                              const pending = mkt.pendingEarningsNGN ?? Math.max(0, (mkt.totalEarningsNGN || 0) - (mkt.paidEarningsNGN || 0));
                              setAdminPayoutAmount(pending > 0 ? pending.toString() : '15000');
                              setAdminPayoutNotes('');
                              setConfirmingPayoutMarketer(mkt);
                            }}
                            className="px-2 py-0.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-extrabold flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                            title="Confirm Commission Payment for this Marketer"
                          >
                            <Receipt className="w-3 h-3" />
                            <span>Confirm Payout</span>
                          </button>
                        </div>
                      </div>

                      {/* Credentials & Contact */}
                      <div className="border-t border-white/5 pt-1.5 space-y-1 text-xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-slate-500" /> Password:
                          </span>
                          <div className="flex items-center gap-1">
                            <strong className="font-mono text-slate-200">
                              {isPasswordRevealed ? mkt.password : '••••••••'}
                            </strong>
                            <button
                              onClick={() => togglePasswordReveal(mkt.id)}
                              className="text-slate-400 hover:text-white"
                            >
                              {isPasswordRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>

                        {mkt.email && (
                          <div className="text-[11px] text-slate-300 flex items-center gap-1 truncate">
                            <Mail className="w-3 h-3 text-slate-500 flex-shrink-0" />
                            <span className="truncate">{mkt.email}</span>
                          </div>
                        )}
                        {mkt.phone && (
                          <div className="text-[11px] text-slate-300 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-500 flex-shrink-0" />
                            <span className="font-mono">{mkt.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Bank Details */}
                      {mkt.bankDetails?.bankName && (
                        <div className="bg-white/5 rounded-xl p-2 text-[10px] space-y-0.5 border border-white/5 mt-1">
                          <span className="font-bold text-slate-400 block uppercase">Bank Payout Info:</span>
                          <div className="text-slate-200 font-bold">{mkt.bankDetails.bankName} – <span className="font-mono text-emerald-300">{mkt.bankDetails.accountNumber}</span></div>
                          <div className="text-slate-400 italic">{mkt.bankDetails.accountName}</div>
                        </div>
                      )}
                    </div>

                    {/* Referred Packages Breakdown */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-300">Total Referrals</span>
                        <strong className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          {signups.length} Signups
                        </strong>
                      </div>

                      <div className="flex flex-wrap gap-1 text-[10px]">
                        {vipCount > 0 && <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">Elite VIP ({vipCount})</span>}
                        {exhibitorCount > 0 && <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">Exhibitors ({exhibitorCount})</span>}
                        {sponsorCount > 0 && <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">Sponsors ({sponsorCount})</span>}
                        {partnerCount > 0 && <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">Partners ({partnerCount})</span>}
                        {visitorCount > 0 && <span className="px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-bold">Visitors ({visitorCount})</span>}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-1.5">
                    <button
                      onClick={() => setViewingSignupsMarketer(mkt)}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Signups ({signups.length})</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDownloadMarketersCsv([mkt])}
                        className="p-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-colors cursor-pointer"
                        title="Download this Marketer Profile & Statement as CSV"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(mkt)}
                        className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                        title="Edit Marketer Profile"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onTestLoginMarketer(mkt.username, mkt.password)}
                        className="p-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 text-cyan-300 text-xs font-bold transition-colors cursor-pointer"
                        title="Test Login as Marketer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setPendingDeleteMarketer(mkt)}
                        className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-colors cursor-pointer"
                        title="Delete Marketer Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* ------------------------------------------------------------- */}
      {/* ALL REFERRAL ACTIVITY TABLE VIEW */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'activity' && (
        <div className="bg-black/60 border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white font-display">
              Master Referral Registrations Log
            </h3>
            <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {totalReferralSignups} Referred Registrations
            </span>
          </div>

          {totalReferralSignups === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Tag className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-xs">No referral registrations recorded yet. Share marketer promo codes to track sales.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 uppercase font-bold text-[10px]">
                    <th className="py-3 px-3">Ticket #</th>
                    <th className="py-3 px-3">Registrant</th>
                    <th className="py-3 px-3">Package / Tier</th>
                    <th className="py-3 px-3">Promo Code</th>
                    <th className="py-3 px-3">Marketer</th>
                    <th className="py-3 px-3">Amount Paid</th>
                    <th className="py-3 px-3">Payment Status</th>
                    <th className="py-3 px-3">Marketer Commission</th>
                    <th className="py-3 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {referralAttendees.map(att => {
                    const isApproved = (att.adminApproved === true || att.adminApprovalStatus === 'APPROVED') && (att.paymentStatus === 'PAID' || att.paymentStatus === 'VERIFIED');
                    return (
                      <tr key={att.ticketNumber} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-emerald-400">{att.ticketNumber}</td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-white">{att.fullName}</div>
                          <div className="text-[10px] text-slate-400">{att.organization || att.email}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-200">
                            {att.tier}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-amber-300">{att.referralCode}</td>
                        <td className="py-3 px-3 text-slate-300 font-medium">{att.marketerName || 'Assigned Marketer'}</td>
                        <td className="py-3 px-3 font-mono font-bold text-cyan-300">{att.amountPaid || '₦25,000'}</td>
                        <td className="py-3 px-3">
                          {isApproved ? (
                            <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold inline-flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              Approved
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold inline-flex items-center gap-1" title="Pending Admin payment approval">
                              <Clock className="w-2.5 h-2.5" />
                              Awaiting Approval
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono text-emerald-300 font-black">
                          {att.commissionEarnedNGN ? `₦${att.commissionEarnedNGN.toLocaleString()}` : '₦5,000'}
                        </td>
                        <td className="py-3 px-3 text-slate-400 text-[10px]">
                          {new Date(att.registeredAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUMMARY CHARTS & VISUAL ANALYTICS VIEW */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'analytics' && (
        <div className="space-y-6 animate-fade-in">
          {/* Summary KPIs Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-black/50 border border-emerald-500/30 rounded-2xl p-5 relative overflow-hidden shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Referrals</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-emerald-300 font-mono mt-2">{totalReferralSignups}</div>
              <p className="text-[11px] text-slate-400 mt-1">Registrations using affiliate promo codes</p>
            </div>

            <div className="bg-black/50 border border-amber-500/30 rounded-2xl p-5 relative overflow-hidden shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Disbursed Commission</span>
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-black text-amber-300 font-mono mt-2">₦{totalCommissionsEarned.toLocaleString()}</div>
              <p className="text-[11px] text-slate-400 mt-1">Total marketer affiliate earnings</p>
            </div>

            <div className="bg-black/50 border border-cyan-500/30 rounded-2xl p-5 relative overflow-hidden shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Referral Revenue</span>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-black text-cyan-300 font-mono mt-2">₦{totalReferralRevenue.toLocaleString()}</div>
              <p className="text-[11px] text-slate-400 mt-1">Gross sales generated via promo codes</p>
            </div>
          </div>

          {/* MAIN CHART: Marketer Referrals & Commission Bar Chart */}
          <div className="bg-[#011e15] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2 font-display">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  Marketer Performance: Total Referrals vs Commission Disbursed
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Comparison of total referral signups (left axis) and total commission earnings disbursed (right axis in ₦) per marketer.
                </p>
              </div>
            </div>

            <div className="w-full pt-2">
              {marketerPerformanceData.length === 0 ? (
                <div className="text-center py-12 text-slate-400">No marketer records available.</div>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={marketerPerformanceData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                    <YAxis yAxisId="left" stroke="#10b981" tick={{ fill: '#6ee7b7', fontSize: 11 }} allowDecimals={false} label={{ value: 'Referrals Count', angle: -90, position: 'insideLeft', fill: '#10b981', fontSize: 10 }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" tick={{ fill: '#fcd34d', fontSize: 11 }} tickFormatter={(val) => `₦${(val / 1000).toFixed(0)}k`} label={{ value: 'Commission (₦)', angle: 90, position: 'insideRight', fill: '#f59e0b', fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#012f24', borderColor: '#10b981', borderRadius: '16px', color: '#fff', fontSize: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                      formatter={(value: any, name: any) => {
                        if (name === 'Commission Disbursed (₦)' || name === 'commission') return [`₦${Number(value).toLocaleString()}`, 'Commission Disbursed'];
                        if (name === 'Referrals Count' || name === 'referrals') return [`${value} Delegates`, 'Referral Signups'];
                        return [value, name];
                      }}
                      labelFormatter={(label: string, payload: any[]) => {
                        const full = payload && payload[0] ? payload[0].payload.fullName : label;
                        const code = payload && payload[0] ? payload[0].payload.code : '';
                        return `${full} (${code})`;
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px', color: '#cbd5e1' }} />
                    <Bar yAxisId="left" dataKey="referrals" name="Referrals Count" fill="#10b981" radius={[6, 6, 0, 0]} barSize={28} />
                    <Bar yAxisId="right" dataKey="commission" name="Commission Disbursed (₦)" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* TWO COLUMN CHARTS: Pass Tier Pie Chart & Sales vs Commission Area Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PIE CHART: Referrals by Pass Tier */}
            <div className="bg-[#011e15] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2 font-display">
                  <PieChartIcon className="w-5 h-5 text-amber-400" />
                  Referral Signups Distribution by Pass Tier
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">Proportion of referred attendees across VIP, Exhibitor, and Sponsor tiers.</p>
              </div>

              <div className="w-full pt-2">
                {tierChartData.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">No referral signups recorded yet to display breakdown.</div>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={tierChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                      >
                        {tierChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#012f24', borderColor: '#f59e0b', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                        formatter={(val: any, name: any, props: any) => [
                          `${val} Signups (₦${(props.payload.commission || 0).toLocaleString()} Commission)`,
                          props.payload.name
                        ]}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* AREA CHART: Revenue vs Commission Trend */}
            <div className="bg-[#011e15] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2 font-display">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  Referral Revenue vs Commission Disbursed
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">Gross registration revenue compared against marketer commission payouts.</p>
              </div>

              <div className="w-full pt-2">
                {marketerPerformanceData.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">No data available.</div>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={marketerPerformanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                      <YAxis stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} tickFormatter={(val) => `₦${(val / 1000).toFixed(0)}k`} />
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#012f24', borderColor: '#06b6d4', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                        formatter={(val: any) => [`₦${Number(val).toLocaleString()}`, 'Amount']}
                      />
                      <Area type="monotone" dataKey="revenue" name="Referral Sales Revenue (₦)" stroke="#06b6d4" fillOpacity={1} fill="url(#colorRevenue)" />
                      <Area type="monotone" dataKey="commission" name="Commission Disbursed (₦)" stroke="#f59e0b" fillOpacity={1} fill="url(#colorCommission)" />
                      <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* REGISTER / EDIT MARKETER MODAL */}
      {/* ------------------------------------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#011e15] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-200 my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-display">
                  {editingMarketerId ? 'Edit Marketer Profile & Code' : 'Register New Affiliate Marketer'}
                </h3>
                <p className="text-xs text-slate-400">
                  Assign custom referral promo code, commission tracking, and bank payout details.
                </p>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => {
                      setFullName(e.target.value);
                      if (!editingMarketerId && !referralCode) {
                        setReferralCode(generateReferralCode(e.target.value));
                      }
                    }}
                    placeholder="e.g. Amaka Okafor"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Portal Username <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="e.g. amaka.marketer"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:border-emerald-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Referral Promo Code <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={referralCode}
                      onChange={e => setReferralCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                      placeholder="e.g. AMAKA2026"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-emerald-500/40 text-xs text-emerald-300 font-mono font-black tracking-widest focus:border-emerald-400 uppercase"
                    />
                    <button
                      type="button"
                      onClick={() => setReferralCode(generateReferralCode(fullName || 'PROMO'))}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-300"
                    >
                      Gen
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Portal Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    type={showFormPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:border-emerald-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="amaka@reconexpo.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+234 802 111 2233"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:border-emerald-400 font-mono"
                  />
                </div>
              </div>

              {/* Commission Rule Summary Box */}
              <div className="bg-emerald-950/50 border border-emerald-500/30 rounded-2xl p-3 text-xs space-y-1 text-slate-300">
                <span className="font-black text-emerald-400 uppercase block">Automatic Commission Rules:</span>
                <div>• <strong>Elite VIP Guest Pass:</strong> Registrant gets ₦5,000 discount + ₦5,000 added to Marketer Wallet.</div>
                <div>• <strong>Exhibitor Booth Stand:</strong> Marketer earns guaranteed <strong>Commission: 10%</strong> (₦35,000 to ₦150,000+ per booth) after using their referral code or link.</div>
              </div>

              {/* Bank Account Payout Section */}
              <div className="border-t border-white/10 pt-3">
                <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  Bank Account Details for Payouts
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={bankName}
                    onChange={e => setBankName(e.target.value)}
                    placeholder="Bank Name (e.g. GTBank)"
                    className="px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={e => setAccountNumber(e.target.value)}
                    placeholder="Account Number"
                    className="px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white font-mono"
                  />
                  <input
                    type="text"
                    value={accountName}
                    onChange={e => setAccountName(e.target.value)}
                    placeholder="Account Name"
                    className="px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Account Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Payout Status</label>
                  <select
                    value={payoutStatus}
                    onChange={e => setPayoutStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white"
                  >
                    <option value="UNPAID">UNPAID</option>
                    <option value="PARTIAL">PARTIAL</option>
                    <option value="PAID">PAID</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black"
                >
                  {editingMarketerId ? 'Save Changes' : 'Create Marketer Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW MARKETER SIGNUPS MODAL */}
      {/* ------------------------------------------------------------- */}
      {viewingSignupsMarketer && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#011e15] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-200 my-8 max-h-[85vh] flex flex-col">
            <button
              onClick={() => setViewingSignupsMarketer(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-bold text-lg">
                {viewingSignupsMarketer.fullName.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white font-display">
                  {viewingSignupsMarketer.fullName}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Promo Code: <span className="text-emerald-300 font-bold">{viewingSignupsMarketer.referralCode}</span> • Total: <span className="text-amber-300 font-bold">₦{(viewingSignupsMarketer.totalEarningsNGN || 0).toLocaleString()}</span> • Paid: <span className="text-emerald-300 font-bold">₦{(viewingSignupsMarketer.paidEarningsNGN || 0).toLocaleString()}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 mr-8">
                <button
                  onClick={() => {
                    const pending = viewingSignupsMarketer.pendingEarningsNGN ?? Math.max(0, (viewingSignupsMarketer.totalEarningsNGN || 0) - (viewingSignupsMarketer.paidEarningsNGN || 0));
                    setAdminPayoutAmount(pending > 0 ? pending.toString() : '15000');
                    setAdminPayoutNotes('');
                    setConfirmingPayoutMarketer(viewingSignupsMarketer);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Issue Payment</span>
                </button>

                {getMarketerSignups(viewingSignupsMarketer.referralCode).length > 0 && (
                  <button
                    onClick={() => {
                      const signups = getMarketerSignups(viewingSignupsMarketer.referralCode);
                      const headers = ["Ticket Number", "Delegate Name", "Email", "Phone", "Organization", "Role", "Tier", "Amount Paid", "Discount", "Commission", "Registered Date"];
                      const rows = signups.map(a => [
                        `"${a.ticketNumber}"`,
                        `"${a.fullName}"`,
                        `"${a.email}"`,
                        `"${a.phone}"`,
                        `"${a.organization}"`,
                        `"${a.role}"`,
                        `"${a.tier}"`,
                        `"${a.amountPaid || '₦0'}"`,
                        `"${a.discountAppliedNGN || 0}"`,
                        `"${a.commissionEarnedNGN || 0}"`,
                        `"${new Date(a.registeredAt).toLocaleString()}"`
                      ]);
                      const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", `Marketer_${viewingSignupsMarketer.referralCode}_Signups_${new Date().toISOString().slice(0, 10)}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      showToast(`Exported ${signups.length} referrals for ${viewingSignupsMarketer.fullName}`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    title="Download this marketer's referral list as CSV"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                )}
              </div>
            </div>

            {/* Subtabs for Signups vs Confirmations */}
            <div className="flex items-center gap-2 mb-4 bg-black/40 p-1 rounded-2xl border border-white/10 w-fit">
              <button
                type="button"
                onClick={() => setSignupsModalSubTab('signups')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  signupsModalSubTab === 'signups'
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Signups ({getMarketerSignups(viewingSignupsMarketer.referralCode).length})</span>
              </button>

              <button
                type="button"
                onClick={() => setSignupsModalSubTab('confirmations')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  signupsModalSubTab === 'confirmations'
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BadgeCheck className="w-3.5 h-3.5" />
                <span>Payment Confirmations ({(viewingSignupsMarketer.paymentConfirmations || []).length})</span>
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-3 pr-1">
              {signupsModalSubTab === 'signups' ? (
                getMarketerSignups(viewingSignupsMarketer.referralCode).length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Tag className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs">No registrations have used code "{viewingSignupsMarketer.referralCode}" yet.</p>
                  </div>
                ) : (
                  getMarketerSignups(viewingSignupsMarketer.referralCode).map(att => {
                    const isApproved = (att.adminApproved === true || att.adminApprovalStatus === 'APPROVED') && (att.paymentStatus === 'PAID' || att.paymentStatus === 'VERIFIED');
                    return (
                    <div key={att.ticketNumber} className="bg-black/50 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-emerald-400 font-bold text-xs">{att.ticketNumber}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-200">{att.tier}</span>
                        </div>
                        <h4 className="font-bold text-white text-sm mt-0.5">{att.fullName}</h4>
                        <p className="text-xs text-slate-400">{att.organization || att.email} • {att.phone}</p>
                      </div>

                      <div className="text-right border-t sm:border-t-0 border-white/10 pt-2 sm:pt-0 space-y-1">
                        <div className="text-xs font-mono font-bold text-cyan-300">Paid: {att.amountPaid || '₦25,000'}</div>
                        <div className={`text-xs font-black ${isApproved ? 'text-emerald-300' : 'text-amber-300'}`}>
                          Commission: {isApproved ? '+' : ''}₦{getAttendeeCommission(att).toLocaleString()}
                        </div>
                        {isApproved ? (
                          <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold inline-flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Payment Approved
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold inline-flex items-center gap-1" title="Payment must be approved in Registrations tab before commission is unlocked">
                            <Clock className="w-2.5 h-2.5" />
                            Awaiting Admin Approval
                          </span>
                        )}
                      </div>
                    </div>
                  );})
                )
              ) : (
                // Payment Confirmations List
                (viewingSignupsMarketer.paymentConfirmations || []).length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Receipt className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs">No confirmed payout receipts issued for this marketer yet.</p>
                    <button
                      type="button"
                      onClick={() => {
                        const pending = viewingSignupsMarketer.pendingEarningsNGN ?? Math.max(0, (viewingSignupsMarketer.totalEarningsNGN || 0) - (viewingSignupsMarketer.paidEarningsNGN || 0));
                        setAdminPayoutAmount(pending > 0 ? pending.toString() : '15000');
                        setAdminPayoutNotes('');
                        setConfirmingPayoutMarketer(viewingSignupsMarketer);
                      }}
                      className="mt-3 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Receipt className="w-4 h-4" />
                      Issue First Payment Confirmation
                    </button>
                  </div>
                ) : (
                  (viewingSignupsMarketer.paymentConfirmations || []).map(conf => (
                    <div key={conf.id} className="bg-black/60 border border-emerald-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-500/40 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-emerald-400 font-extrabold text-xs">{conf.reference}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                            <BadgeCheck className="w-3 h-3" />
                            {conf.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300">
                          Paid by <strong className="text-white">{conf.paidByAdminName || 'Expo Finance'}</strong> via <strong className="text-emerald-300">{conf.paymentMethod}</strong>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {conf.accountNumber ? `${conf.bankName} - ${conf.accountNumber} (${conf.accountName})` : 'Direct Bank Payout'}
                        </div>
                        {conf.notes && <div className="text-[11px] text-slate-400 italic">"{conf.notes}"</div>}
                        <div className="text-[10px] text-slate-500 font-mono">
                          {new Date(conf.paymentDate).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 border-white/10 pt-2 sm:pt-0">
                        <div className="text-base font-black text-amber-300 font-mono">
                          ₦{conf.amountNGN.toLocaleString()}
                        </div>
                        <button
                          type="button"
                          onClick={() => setViewingConfirmation(conf)}
                          className="px-3 py-1 rounded-xl bg-white/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>View Voucher</span>
                        </button>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CONFIRM COMMISSION PAYMENT MODAL (ADMIN ACTION) */}
      {/* ------------------------------------------------------------- */}
      {confirmingPayoutMarketer && (
        <div className="fixed inset-0 z-[320] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#011e15] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-200 my-8">
            <button
              onClick={() => setConfirmingPayoutMarketer(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">Confirm Commission Payment</h3>
                <p className="text-xs text-slate-400">Marketer: <strong className="text-emerald-300">{confirmingPayoutMarketer.fullName}</strong> ({confirmingPayoutMarketer.referralCode})</p>
              </div>
            </div>

            {(() => {
              const mySignups = attendees.filter(a => 
                (a.referralCode || '').toUpperCase() === confirmingPayoutMarketer.referralCode.toUpperCase() ||
                a.marketerId === confirmingPayoutMarketer.id
              );
              const approvedSignups = mySignups.filter(a => 
                (a.adminApproved === true || a.adminApprovalStatus === 'APPROVED') &&
                (a.paymentStatus === 'PAID' || a.paymentStatus === 'VERIFIED')
              );
              const pendingApprovalSignups = mySignups.filter(a => 
                !((a.adminApproved === true || a.adminApprovalStatus === 'APPROVED') &&
                  (a.paymentStatus === 'PAID' || a.paymentStatus === 'VERIFIED'))
              );
              const approvedEarned = Math.max(
                confirmingPayoutMarketer.totalEarningsNGN || 0,
                approvedSignups.reduce((sum, a) => sum + getAttendeeCommission(a), 0)
              );
              const alreadyPaid = confirmingPayoutMarketer.paidEarningsNGN || 0;
              const approvedAvailablePending = Math.max(0, approvedEarned - alreadyPaid);
              const pendingApprovalCommission = pendingApprovalSignups.reduce((sum, a) => sum + getAttendeeCommission(a), 0);

              return (
                <>
                  <div className="bg-black/50 border border-white/10 rounded-2xl p-4 mb-4 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Referrals:</span>
                      <span className="font-mono font-bold text-slate-200">{mySignups.length} ({approvedSignups.length} approved)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Approved Total Earned:</span>
                      <span className="font-mono font-bold text-emerald-300">₦{approvedEarned.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Previously Paid Out:</span>
                      <span className="font-mono font-bold text-cyan-300">₦{alreadyPaid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-white/5 pt-1.5">
                      <span className="text-slate-300 font-bold">Approved Available for Payout:</span>
                      <span className="font-mono font-black text-amber-300 text-sm">
                        ₦{approvedAvailablePending.toLocaleString()}
                      </span>
                    </div>
                    {confirmingPayoutMarketer.bankDetails?.accountNumber && (
                      <div className="bg-white/5 rounded-xl p-2.5 mt-2 border border-white/5 text-[11px]">
                        <span className="text-slate-400 font-bold block uppercase text-[9px]">Destination Account:</span>
                        <div className="text-white font-bold">{confirmingPayoutMarketer.bankDetails.bankName} – {confirmingPayoutMarketer.bankDetails.accountNumber}</div>
                        <div className="text-slate-400 italic text-[10px]">{confirmingPayoutMarketer.bankDetails.accountName}</div>
                      </div>
                    )}
                  </div>

                  {pendingApprovalSignups.length > 0 && (
                    <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-3 mb-4 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Policy Check: Pending Registrations Awaiting Approval</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Before a marketer receives any commissions, the Admin must approve payment from registration first. 
                        This marketer has <strong className="text-white font-bold">{pendingApprovalSignups.length}</strong> referral(s) worth <strong className="text-amber-300 font-bold">₦{pendingApprovalCommission.toLocaleString()}</strong> in commission awaiting payment verification. Commissions can only be paid against verified registrations.
                      </p>
                    </div>
                  )}

                  {approvedAvailablePending <= 0 ? (
                    <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-2xl text-center text-xs text-red-300 space-y-2 mb-4">
                      <Lock className="w-5 h-5 text-red-400 mx-auto" />
                      <p className="font-bold">No Approved Commissions Available</p>
                      <p className="text-[11px] text-slate-300">
                        {pendingApprovalSignups.length > 0
                          ? `The ${pendingApprovalSignups.length} pending registration(s) must be reviewed and approved in the "Registrations" tab before commission can be released to this marketer.`
                          : 'This marketer currently has no pending or unpaid commissions.'}
                      </p>
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => setConfirmingPayoutMarketer(null)}
                          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold"
                        >
                          Close Window
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const amt = parseFloat(adminPayoutAmount);
                        if (isNaN(amt) || amt <= 0) {
                          showToast('Please enter a valid payout amount');
                          return;
                        }
                        if (onConfirmCommissionPayment) {
                          const res = onConfirmCommissionPayment(
                            confirmingPayoutMarketer.id,
                            amt,
                            adminPayoutNotes.trim() || 'Official commission settlement approved by Admin'
                          );
                          showToast(res.message);
                          if (res.success && res.confirmation) {
                            setViewingConfirmation(res.confirmation);
                          }
                        } else {
                          showToast(`Successfully confirmed payment of ₦${amt.toLocaleString()}!`);
                        }
                        setConfirmingPayoutMarketer(null);
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                          Payment Amount to Settle (₦ NGN) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₦</span>
                          <input
                            type="number"
                            min="1000"
                            max={approvedAvailablePending}
                            step="500"
                            value={adminPayoutAmount}
                            onChange={(e) => setAdminPayoutAmount(e.target.value)}
                            className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-black/60 border border-emerald-500/30 text-white font-mono font-bold focus:border-emerald-400 focus:outline-none"
                            placeholder={`Max ₦${approvedAvailablePending.toLocaleString()}`}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                          Payment Reference / Admin Notes
                        </label>
                        <input
                          type="text"
                          value={adminPayoutNotes}
                          onChange={(e) => setAdminPayoutNotes(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:border-emerald-400 focus:outline-none"
                          placeholder="e.g. NIBSS Direct Bank Transfer Ref #99283 / Batch #4"
                        />
                      </div>

                      <div className="pt-2 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setConfirmingPayoutMarketer(null)}
                          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                        >
                          <Receipt className="w-4 h-4" />
                          <span>Confirm & Generate Voucher</span>
                        </button>
                      </div>
                    </form>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* COMMISSION PAYMENT CONFIRMATION VOUCHER MODAL */}
      {/* ------------------------------------------------------------- */}
      {viewingConfirmation && (
        <div className="fixed inset-0 z-[340] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl my-8 border-4 border-emerald-600 print:m-0 print:border-none">
            <button
              onClick={() => setViewingConfirmation(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Voucher Header */}
            <div className="text-center border-b-2 border-emerald-600 pb-6 mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mb-2">
                <BadgeCheck className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                Official Commission Payout Voucher
              </h2>
              <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase mt-1">
                Kano International Trade Exhibition & Expo 2026
              </p>
              <div className="mt-3 inline-block bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs px-3 py-1 rounded-full font-mono font-bold">
                Payment Ref: {viewingConfirmation.reference}
              </div>
            </div>

            {/* Voucher Details Table */}
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Beneficiary Marketer</span>
                  <strong className="text-base text-slate-900 font-bold block">{viewingConfirmation.marketerName}</strong>
                  <span className="text-xs font-mono text-emerald-700 font-bold">Code: {viewingConfirmation.marketerCode}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Amount Settled</span>
                  <strong className="text-2xl font-black text-emerald-700 font-mono block">
                    ₦{viewingConfirmation.amountNGN.toLocaleString()}
                  </strong>
                  <span className="text-[10px] font-bold text-slate-500">Nigerian Naira (NGN)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs border border-slate-200 rounded-2xl p-4 bg-white">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Payment Date</span>
                  <strong className="text-slate-800 font-mono">{new Date(viewingConfirmation.paymentDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Payment Method</span>
                  <strong className="text-slate-800">{viewingConfirmation.paymentMethod}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Status</span>
                  <span className="inline-flex items-center gap-1 font-black text-emerald-700 uppercase">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {viewingConfirmation.status}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Bank Name</span>
                  <strong className="text-slate-800">{viewingConfirmation.bankName || 'Direct Transfer'}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Account Number</span>
                  <strong className="text-slate-800 font-mono">{viewingConfirmation.accountNumber || '—'}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Account Name</span>
                  <strong className="text-slate-800 truncate block">{viewingConfirmation.accountName || viewingConfirmation.marketerName}</strong>
                </div>
              </div>

              {viewingConfirmation.notes && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Payment Description / Notes:</span>
                  <p className="text-slate-700 italic mt-0.5">{viewingConfirmation.notes}</p>
                </div>
              )}

              {/* Security & Verification Footer */}
              <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
                <div className="space-y-0.5">
                  <div>Authorized by: <strong className="text-slate-800">{viewingConfirmation.paidByAdminName || 'Expo Central Finance'}</strong></div>
                  <div className="font-mono text-[9px] text-slate-400">Security Hash: {viewingConfirmation.verificationHash || 'EXPO-VERIFIED-VOUCHER'}</div>
                </div>

                <div className="flex items-center gap-2 print:hidden">
                  <button
                    type="button"
                    onClick={() => {
                      const printWindow = window.open('', '_blank');
                      if (printWindow) {
                        printWindow.document.write(`
                          <html>
                            <head>
                              <title>Payment Voucher - ${viewingConfirmation.reference}</title>
                              <style>
                                body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #1e293b; }
                                .box { border: 3px solid #059669; border-radius: 16px; padding: 30px; max-width: 650px; margin: 0 auto; }
                                .header { text-align: center; border-bottom: 2px solid #059669; padding-bottom: 20px; margin-bottom: 20px; }
                                .amount { font-size: 28px; font-weight: 900; color: #059669; font-family: monospace; }
                                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
                                .label { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: bold; }
                                .val { font-weight: bold; font-size: 14px; }
                              </style>
                            </head>
                            <body>
                              <div class="box">
                                <div class="header">
                                  <h2>KANO INTERNATIONAL EXPO 2026</h2>
                                  <h3>OFFICIAL COMMISSION PAYMENT VOUCHER</h3>
                                  <p><strong>Ref: ${viewingConfirmation.reference}</strong></p>
                                </div>
                                <div class="grid">
                                  <div>
                                    <div class="label">Marketer</div>
                                    <div class="val">${viewingConfirmation.marketerName} (${viewingConfirmation.marketerCode})</div>
                                  </div>
                                  <div style="text-align: right;">
                                    <div class="label">Amount Paid</div>
                                    <div class="amount">₦${viewingConfirmation.amountNGN.toLocaleString()}</div>
                                  </div>
                                </div>
                                <div class="grid">
                                  <div>
                                    <div class="label">Date</div>
                                    <div class="val">${new Date(viewingConfirmation.paymentDate).toLocaleString()}</div>
                                  </div>
                                  <div>
                                    <div class="label">Payment Method</div>
                                    <div class="val">${viewingConfirmation.paymentMethod}</div>
                                  </div>
                                </div>
                                <div class="grid">
                                  <div>
                                    <div class="label">Bank & Account</div>
                                    <div class="val">${viewingConfirmation.bankName || ''} - ${viewingConfirmation.accountNumber || ''}</div>
                                  </div>
                                  <div>
                                    <div class="label">Account Holder</div>
                                    <div class="val">${viewingConfirmation.accountName || viewingConfirmation.marketerName}</div>
                                  </div>
                                </div>
                                <p style="font-size: 12px; color: #64748b; font-style: italic;">Notes: ${viewingConfirmation.notes || 'Settled'}</p>
                                <p style="font-size: 10px; color: #94a3b8; margin-top: 30px; text-align: center;">Verified & Authorized by Expo Finance Authority • Hash: ${viewingConfirmation.verificationHash}</p>
                              </div>
                            </body>
                          </html>
                        `);
                        printWindow.document.close();
                        printWindow.focus();
                        printWindow.print();
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Receipt</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Marketer Account Delete Confirmation Dialog */}
      {pendingDeleteMarketer && (
        <div className="fixed inset-0 z-[350] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#031d17] border border-red-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0 mt-0.5">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white font-display">Delete Marketer & All Associated Data</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Are you sure you want to permanently delete the marketer account for <strong className="text-white">"{pendingDeleteMarketer.fullName}"</strong> (Referral Code: <span className="font-mono text-emerald-400">{pendingDeleteMarketer.referralCode}</span>)?
                </p>
              </div>
            </div>

            {/* Delegate and lead preservation notice */}
            {(() => {
              const code = pendingDeleteMarketer.referralCode.toUpperCase();
              const mktSignups = attendees.filter(a => 
                (a.referralCode || '').toUpperCase() === code || 
                a.marketerId === pendingDeleteMarketer.id ||
                a.marketerId === pendingDeleteMarketer.referralCode ||
                (a.marketerName && a.marketerName.trim().toLowerCase() === pendingDeleteMarketer.fullName.trim().toLowerCase())
              );
              return (
                <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Delegates & CRM Leads Preserved:</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Deleting this marketer will permanently remove their profile and login credentials, but <strong className="text-emerald-300">will NOT delete any registered delegates or CRM leads</strong>:
                  </p>
                  <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                    <li>
                      <strong className="text-white">{mktSignups.length}</strong> referred delegate(s) & lead(s) will remain active with full ticket passes intact.
                    </li>
                    <li>
                      Their payment confirmations, RFID credentials, and CRM history remain safely preserved in the database.
                    </li>
                  </ul>
                </div>
              );
            })()}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setPendingDeleteMarketer(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const res = onDeleteMarketer(pendingDeleteMarketer.id);
                  showToast(res.message);
                  if (viewingSignupsMarketer?.id === pendingDeleteMarketer.id) {
                    setViewingSignupsMarketer(null);
                  }
                  if (confirmingPayoutMarketer?.id === pendingDeleteMarketer.id) {
                    setConfirmingPayoutMarketer(null);
                  }
                  if (editingMarketerId === pendingDeleteMarketer.id) {
                    setEditingMarketerId(null);
                    setIsModalOpen(false);
                  }
                  setPendingDeleteMarketer(null);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold transition-all cursor-pointer shadow-lg"
              >
                Confirm Delete (Cascade)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
