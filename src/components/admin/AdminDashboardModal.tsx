import React, { useState } from 'react';
import { useExpoData } from '../../context/ExpoDataContext';
import { StaffManagerTab } from './StaffManagerTab';
import { MarketerManagerTab } from './MarketerManagerTab';
import { SmtpSettingsTab } from './SmtpSettingsTab';
import { EmailMarketingSuiteTab } from './EmailMarketingSuiteTab';
import { PushNotificationManagerTab } from './PushNotificationManagerTab';
import { SiteTextEditorTab } from './SiteTextEditorTab';
import { PixelTrackingTab } from './PixelTrackingTab';
import { SeoSettingsTab } from './SeoSettingsTab';
import { SystemUpdateTab } from './SystemUpdateTab';
import { GateScannerModal } from './GateScannerModal';
import { QrPassViewerModal } from './QrPassViewerModal';
import { Attendee, PassTier } from '../../types';
import {
  X,
  Users,
  QrCode,
  Mail,
  Share2,
  Bell,
  Edit3,
  Activity,
  Globe,
  Database,
  Search,
  CheckCircle2,
  Trash2,
  Eye,
  Download,
  Plus,
  ShieldCheck,
  DollarSign
} from 'lucide-react';
import { playSound } from '../../utils/soundService';

export const AdminDashboardModal: React.FC = () => {
  const {
    activeModal,
    closeModal,
    attendees,
    deleteAttendee,
    updateAttendee,
    registerAttendee
  } = useExpoData();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'attendees' | 'scanner' | 'smtp' | 'marketing' | 'staff' | 'marketers' | 'push' | 'content' | 'pixel' | 'seo' | 'system'
  >('overview');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [selectedAttendeeForBadge, setSelectedAttendeeForBadge] = useState<Attendee | null>(null);
  const [showAddAttendeeModal, setShowAddAttendeeModal] = useState(false);

  // Quick manual add delegate state
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newOrg, setNewOrg] = useState('');
  const [newRole, setNewRole] = useState('Senior Architect');
  const [newTier, setNewTier] = useState<PassTier>('visitor');

  if (activeModal !== 'adminDashboard') return null;

  // Overview metrics
  const totalAttendees = attendees.length;
  const vipAttendees = attendees.filter(a => a.passType === 'elite').length;
  const exhibitorAttendees = attendees.filter(a => a.passType === 'exhibitor').length;
  const checkedInCount = attendees.filter(a => a.checkedIn).length;
  const totalRevenueNgn = attendees.reduce((sum, a) => sum + (a.amountPaid || 0), 0);

  // Filtered attendees
  const filteredAttendees = attendees.filter(a => {
    const matchesQuery =
      a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.organization.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTier = filterTier === 'all' || a.passType === filterTier;
    return matchesQuery && matchesTier;
  });

  const handleCreateManualAttendee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newEmail) return;

    registerAttendee({
      fullName: newFullName,
      email: newEmail,
      phone: newPhone,
      organization: newOrg || 'Independent Consultant',
      role: newRole,
      passType: newTier,
      city: 'Abuja (FCT)',
      amountPaid: newTier === 'elite' ? 25000 : newTier === 'exhibitor' ? 350000 : 0,
      paymentStatus: newTier === 'visitor' ? 'FREE' : 'PAID'
    });

    setNewFullName('');
    setNewEmail('');
    setNewPhone('');
    setNewOrg('');
    setShowAddAttendeeModal(false);
  };

  const handleExportCsv = () => {
    playSound('badge_print');
    const headers = ['Ticket Number', 'Full Name', 'Email', 'Phone', 'Organization', 'Role', 'Pass Tier', 'Payment Status', 'Checked In', 'Registered At'];
    const rows = attendees.map(a => [
      a.ticketNumber,
      `"${a.fullName}"`,
      a.email,
      a.phone,
      `"${a.organization}"`,
      `"${a.role}"`,
      a.passType,
      a.paymentStatus,
      a.checkedIn ? 'YES' : 'NO',
      a.registeredAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RECON_EXPO_ATTENDEES_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-950 border border-emerald-500/40 rounded-3xl max-w-6xl w-full h-[90vh] flex flex-col shadow-2xl relative my-auto overflow-hidden text-white">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-slate-950 font-black text-base shadow">
              R
            </div>
            <div>
              <h2 className="text-base font-black text-white">RECON Secretariat Admin Command Suite</h2>
              <p className="text-[11px] text-emerald-400">8th Real Estate & Construction Expo 2026 • Yar'Adua Centre</p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sidebar & Main Content Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-60 bg-slate-950 border-r border-slate-800 p-3 space-y-1 overflow-x-auto md:overflow-y-auto shrink-0 flex md:flex-col gap-1 md:gap-0">
            {[
              { id: 'overview', label: 'Overview Analytics', icon: Activity },
              { id: 'attendees', label: `Attendees (${totalAttendees})`, icon: Users },
              { id: 'scanner', label: 'Gate QR Scanner', icon: QrCode },
              { id: 'smtp', label: 'SMTP & Outbox', icon: Mail },
              { id: 'marketing', label: 'Email Marketing', icon: Mail },
              { id: 'staff', label: 'Staff Passes', icon: Users },
              { id: 'marketers', label: 'Ambassadors', icon: Share2 },
              { id: 'push', label: 'Push Broadcasts', icon: Bell },
              { id: 'content', label: 'Site Content', icon: Edit3 },
              { id: 'pixel', label: 'Meta Pixel Tracking', icon: Activity },
              { id: 'seo', label: 'SEO & Metadata', icon: Globe },
              { id: 'system', label: 'Diagnostics & Backup', icon: Database }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playSound('click');
                    setActiveTab(tab.id as any);
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/50'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Panes */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-950/60">
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6 text-xs">
                <div>
                  <h3 className="text-lg font-black text-white">Expo Operations Dashboard</h3>
                  <p className="text-slate-400 text-[11px]">Real-time delegate registrations, badge verifications, and ticketing metrics.</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-900 p-5 rounded-2xl border border-emerald-500/20">
                    <p className="text-slate-400 text-[11px] font-bold uppercase">Total Registrations</p>
                    <p className="text-3xl font-black text-white font-mono mt-1">{totalAttendees}</p>
                    <p className="text-emerald-400 text-[10px] mt-1 font-semibold">100% Real Manual Entries</p>
                  </div>

                  <div className="bg-slate-900 p-5 rounded-2xl border border-amber-500/20">
                    <p className="text-slate-400 text-[11px] font-bold uppercase">Elite VIP Passes</p>
                    <p className="text-3xl font-black text-amber-400 font-mono mt-1">{vipAttendees}</p>
                    <p className="text-slate-400 text-[10px] mt-1">{((vipAttendees / (totalAttendees || 1)) * 100).toFixed(0)}% VIP share</p>
                  </div>

                  <div className="bg-slate-900 p-5 rounded-2xl border border-teal-500/20">
                    <p className="text-slate-400 text-[11px] font-bold uppercase">Gate Check-Ins</p>
                    <p className="text-3xl font-black text-teal-300 font-mono mt-1">{checkedInCount}</p>
                    <p className="text-slate-400 text-[10px] mt-1">Yar'Adua security gates</p>
                  </div>

                  <div className="bg-slate-900 p-5 rounded-2xl border border-emerald-500/20">
                    <p className="text-slate-400 text-[11px] font-bold uppercase">Total Revenue</p>
                    <p className="text-3xl font-black text-emerald-400 font-mono mt-1">₦{totalRevenueNgn.toLocaleString()}</p>
                    <p className="text-slate-400 text-[10px] mt-1">Paid ticketing & booths</p>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <button
                    onClick={() => setActiveTab('attendees')}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 text-left transition-all"
                  >
                    <Users className="w-5 h-5 text-emerald-400 mb-2" />
                    <h4 className="font-bold text-white text-sm">Manage Delegates</h4>
                    <p className="text-slate-400 text-[11px] mt-1">Search, print badges, update credentials.</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('scanner')}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 text-left transition-all"
                  >
                    <QrCode className="w-5 h-5 text-amber-400 mb-2" />
                    <h4 className="font-bold text-white text-sm">Gate Scanner</h4>
                    <p className="text-slate-400 text-[11px] mt-1">Accredit physical delegate badges at venue entrance.</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('smtp')}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 text-left transition-all"
                  >
                    <Mail className="w-5 h-5 text-teal-400 mb-2" />
                    <h4 className="font-bold text-white text-sm">SMTP Outbox</h4>
                    <p className="text-slate-400 text-[11px] mt-1">Inspect dispatched badge receipts and test ping.</p>
                  </button>
                </div>
              </div>
            )}

            {/* 2. ATTENDEES TAB */}
            {activeTab === 'attendees' && (
              <div className="space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-black text-white">Delegates & Smart Badges Registry</h3>
                    <p className="text-slate-400 text-[11px]">All manual attendee registrations with encrypted QR access codes.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportCsv}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                    <button
                      onClick={() => setShowAddAttendeeModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Register Delegate</span>
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search name, ticket no., email, company..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none pl-9"
                    />
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  </div>

                  <select
                    value={filterTier}
                    onChange={e => setFilterTier(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="all">All Pass Tiers</option>
                    <option value="visitor">Trade Visitors</option>
                    <option value="elite">Elite VIP Passes</option>
                    <option value="exhibitor">Exhibitor Passes</option>
                  </select>
                </div>

                {/* Attendees Table */}
                <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="p-3.5">Ticket ID</th>
                          <th className="p-3.5">Delegate</th>
                          <th className="p-3.5">Organization</th>
                          <th className="p-3.5">Tier</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5">Gate Check-in</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {filteredAttendees.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-slate-500">
                              No attendees matching query. Click "Register Delegate" above to add real manual attendees.
                            </td>
                          </tr>
                        ) : (
                          filteredAttendees.map(att => (
                            <tr key={att.id} className="hover:bg-slate-800/40 transition-colors">
                              <td className="p-3.5 font-mono font-bold text-emerald-400">
                                {att.ticketNumber}
                              </td>
                              <td className="p-3.5 font-bold text-white">
                                <div>{att.fullName}</div>
                                <div className="text-[10px] text-slate-400 font-mono font-normal">{att.email}</div>
                              </td>
                              <td className="p-3.5 text-slate-300">
                                {att.organization}
                              </td>
                              <td className="p-3.5">
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                  att.passType === 'elite'
                                    ? 'bg-amber-500/20 text-amber-300'
                                    : att.passType === 'exhibitor'
                                    ? 'bg-purple-500/20 text-purple-300'
                                    : 'bg-emerald-500/20 text-emerald-400'
                                }`}>
                                  {att.passType}
                                </span>
                              </td>
                              <td className="p-3.5">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  att.paymentStatus === 'PAID' || att.paymentStatus === 'FREE'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-red-500/20 text-red-400'
                                }`}>
                                  {att.paymentStatus}
                                </span>
                              </td>
                              <td className="p-3.5">
                                {att.checkedIn ? (
                                  <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Accredited</span>
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => updateAttendee(att.id, { checkedIn: true, checkedInAt: new Date().toISOString() })}
                                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold"
                                  >
                                    Check In
                                  </button>
                                )}
                              </td>
                              <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setSelectedAttendeeForBadge(att)}
                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400"
                                    title="View & Print Smart ID Card"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => deleteAttendee(att.id)}
                                    className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900 text-red-400"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 3. GATE SCANNER TAB */}
            {activeTab === 'scanner' && (
              <GateScannerModal onClose={() => setActiveTab('overview')} />
            )}

            {/* 4. SMTP TAB */}
            {activeTab === 'smtp' && <SmtpSettingsTab />}

            {/* 5. MARKETING TAB */}
            {activeTab === 'marketing' && <EmailMarketingSuiteTab />}

            {/* 6. STAFF TAB */}
            {activeTab === 'staff' && <StaffManagerTab />}

            {/* 7. MARKETERS TAB */}
            {activeTab === 'marketers' && <MarketerManagerTab />}

            {/* 8. PUSH NOTIFICATIONS TAB */}
            {activeTab === 'push' && <PushNotificationManagerTab />}

            {/* 9. CONTENT TAB */}
            {activeTab === 'content' && <SiteTextEditorTab />}

            {/* 10. PIXEL TAB */}
            {activeTab === 'pixel' && <PixelTrackingTab />}

            {/* 11. SEO TAB */}
            {activeTab === 'seo' && <SeoSettingsTab />}

            {/* 12. SYSTEM TAB */}
            {activeTab === 'system' && <SystemUpdateTab />}
          </div>
        </div>
      </div>

      {/* View Smart ID Card Modal from Admin */}
      {selectedAttendeeForBadge && (
        <QrPassViewerModal
          attendee={selectedAttendeeForBadge}
          onClose={() => setSelectedAttendeeForBadge(null)}
        />
      )}

      {/* Register Manual Delegate Dialog from Admin */}
      {showAddAttendeeModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-emerald-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-white">
            <button
              onClick={() => setShowAddAttendeeModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl bg-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-white mb-1">Manual Delegate Registration</h3>
            <p className="text-xs text-slate-400 mb-4">Add verified attendee into the official database.</p>

            <form onSubmit={handleCreateManualAttendee} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={e => setNewFullName(e.target.value)}
                  placeholder="Arc. Mustapha Bello"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="mustapha@design.ng"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Organization</label>
                <input
                  type="text"
                  value={newOrg}
                  onChange={e => setNewOrg(e.target.value)}
                  placeholder="Bello & Associates Ltd"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Pass Tier</label>
                <select
                  value={newTier}
                  onChange={e => setNewTier(e.target.value as PassTier)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="visitor">Trade Visitor (Free)</option>
                  <option value="elite">Elite VIP Pass (₦25,000)</option>
                  <option value="exhibitor">Official Exhibitor (₦350,000)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAttendeeModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400"
                >
                  Save & Issue Badge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
