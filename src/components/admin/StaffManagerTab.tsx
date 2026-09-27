import React, { useState } from 'react';
import { 
  StaffAccount, 
  StaffPermissions 
} from '../../types';
import { 
  UserPlus, 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  Copy, 
  Eye, 
  EyeOff, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  QrCode,
  Inbox,
  CalendarDays,
  Mic2,
  Receipt,
  Award,
  Download,
  Target,
  Sparkles,
  UserCheck,
  Phone,
  Key,
  RefreshCw,
  Briefcase,
  Filter,
  Mail,
  FileText
} from 'lucide-react';

interface StaffManagerTabProps {
  staffAccounts: StaffAccount[];
  adminUsername: string;
  onRegisterStaff: (staffData: Omit<StaffAccount, 'id' | 'createdAt' | 'lastLogin'>) => { success: boolean; message: string; staff?: StaffAccount };
  onUpdateStaff: (id: string, updated: Partial<StaffAccount>) => { success: boolean; message: string };
  onDeleteStaff: (id: string) => { success: boolean; message: string };
  onTestLoginStaff: (username: string, pass: string) => void;
  showToast: (msg: string) => void;
}

const DEFAULT_PERMISSIONS: StaffPermissions = {
  canRegisterAttendees: true,
  canCheckIn: true,
  canManageInbox: true,
  canManageSchedule: false,
  canManageSpeakers: false,
  canViewPayments: true,
  canManageSponsors: false,
  canExportData: true,
  canManageLeadMatrix: true,
};

const STANDARD_DEPARTMENTS = [
  'Secretariat',
  'Gate Operations & Security',
  'Accounts & Billing',
  'Exhibitions & Sponsorships',
  'Media & Communications',
  'VIP & Guest Relations',
  'Technical & IT Support',
  'Executive Secretariat',
];

export const StaffManagerTab: React.FC<StaffManagerTabProps> = ({
  staffAccounts,
  adminUsername,
  onRegisterStaff,
  onUpdateStaff,
  onDeleteStaff,
  onTestLoginStaff,
  showToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED'>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [pendingDeleteStaff, setPendingDeleteStaff] = useState<StaffAccount | null>(null);

  // Form Profile State
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Secretariat Registrar');
  const [departmentChoice, setDepartmentChoice] = useState('Secretariat');
  const [customDepartment, setCustomDepartment] = useState('');
  const [notes, setNotes] = useState('');
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [permissions, setPermissions] = useState<StaffPermissions>(DEFAULT_PERMISSIONS);

  // Get list of unique departments from existing staff for filter
  const allUniqueDepartments = Array.from(
    new Set([...STANDARD_DEPARTMENTS, ...staffAccounts.map(s => s.department)])
  ).filter(Boolean);

  // Filter staff list
  const filteredStaff = staffAccounts.filter(s => {
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchesDept = departmentFilter === 'ALL' || s.department.toLowerCase() === departmentFilter.toLowerCase();
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q || 
      s.fullName.toLowerCase().includes(q) ||
      s.username.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      (s.phone && s.phone.toLowerCase().includes(q)) ||
      s.role.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q);

    return matchesStatus && matchesDept && matchesSearch;
  });

  const activeCount = staffAccounts.filter(s => s.status === 'ACTIVE').length;
  const suspendedCount = staffAccounts.filter(s => s.status === 'SUSPENDED').length;

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let gen = '';
    for (let i = 0; i < 10; i++) {
      gen += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(gen);
    setShowFormPassword(true);
    showToast('Generated secure random staff password.');
  };

  const handleOpenRegisterModal = () => {
    setEditingStaffId(null);
    setFullName('');
    setUsername('');
    setPassword('staff' + Math.floor(100 + Math.random() * 900));
    setEmail('');
    setPhone('');
    setRole('Secretariat Registrar');
    setDepartmentChoice('Secretariat');
    setCustomDepartment('');
    setNotes('On-Site Accreditation & Registration Officer');
    setPermissions(DEFAULT_PERMISSIONS);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (staff: StaffAccount) => {
    setEditingStaffId(staff.id);
    setFullName(staff.fullName);
    setUsername(staff.username);
    setPassword(staff.password);
    setEmail(staff.email);
    setPhone(staff.phone || '');
    setRole(staff.role);
    if (STANDARD_DEPARTMENTS.includes(staff.department)) {
      setDepartmentChoice(staff.department);
      setCustomDepartment('');
    } else {
      setDepartmentChoice('CUSTOM');
      setCustomDepartment(staff.department);
    }
    setNotes(staff.notes || '');
    setPermissions(staff.permissions);
    setIsModalOpen(true);
  };

  const handleApplyPreset = (preset: 'gate' | 'secretariat' | 'finance' | 'full') => {
    if (preset === 'gate') {
      setRole('Gate Security Marshal');
      setDepartmentChoice('Gate Operations & Security');
      setPermissions({
        canRegisterAttendees: true,
        canCheckIn: true,
        canManageInbox: false,
        canManageSchedule: false,
        canManageSpeakers: false,
        canViewPayments: false,
        canManageSponsors: false,
        canExportData: false,
        canManageLeadMatrix: false,
      });
    } else if (preset === 'secretariat') {
      setRole('Secretariat Registrar');
      setDepartmentChoice('Secretariat');
      setPermissions({
        canRegisterAttendees: true,
        canCheckIn: true,
        canManageInbox: true,
        canManageSchedule: true,
        canManageSpeakers: false,
        canViewPayments: true,
        canManageSponsors: false,
        canExportData: true,
        canManageLeadMatrix: true,
      });
    } else if (preset === 'finance') {
      setRole('Finance Auditor');
      setDepartmentChoice('Accounts & Billing');
      setPermissions({
        canRegisterAttendees: false,
        canCheckIn: false,
        canManageInbox: true,
        canManageSchedule: false,
        canManageSpeakers: false,
        canViewPayments: true,
        canManageSponsors: true,
        canExportData: true,
        canManageLeadMatrix: false,
      });
    } else if (preset === 'full') {
      setRole('Supervising Staff Lead');
      setDepartmentChoice('Executive Secretariat');
      setPermissions({
        canRegisterAttendees: true,
        canCheckIn: true,
        canManageInbox: true,
        canManageSchedule: true,
        canManageSpeakers: true,
        canViewPayments: true,
        canManageSponsors: true,
        canExportData: true,
        canManageLeadMatrix: true,
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      alert('Please enter staff full name.');
      return;
    }
    if (!username.trim()) {
      alert('Please enter staff portal username.');
      return;
    }

    const finalDepartment = departmentChoice === 'CUSTOM'
      ? (customDepartment.trim() || 'General Operations')
      : departmentChoice;

    if (editingStaffId) {
      const updatePayload: Partial<StaffAccount> = {
        fullName: fullName.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim(),
        phone: phone.trim(),
        role: role.trim(),
        department: finalDepartment,
        notes: notes.trim(),
        permissions,
      };
      if (password.trim()) {
        updatePayload.password = password.trim();
      }
      const res = onUpdateStaff(editingStaffId, updatePayload);
      showToast(res.message);
      setIsModalOpen(false);
    } else {
      if (!password.trim()) {
        alert('Please enter staff initial password.');
        return;
      }
      const res = onRegisterStaff({
        fullName: fullName.trim(),
        username: username.trim().toLowerCase(),
        password: password.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: role.trim(),
        department: finalDepartment,
        notes: notes.trim(),
        permissions,
        status: 'ACTIVE',
        registeredBy: adminUsername || 'admin'
      });
      if (res.success) {
        showToast(res.message);
        setIsModalOpen(false);
      } else {
        alert(res.message);
      }
    }
  };

  const handleToggleStatus = (staff: StaffAccount) => {
    const nextStatus = staff.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const res = onUpdateStaff(staff.id, { status: nextStatus });
    showToast(res.message);
  };

  const handleCopyCreds = (staff: StaffAccount) => {
    const text = `RECON EXPO 2026 Staff Portal Credentials\nFullName: ${staff.fullName}\nDepartment: ${staff.department}\nUsername: ${staff.username}\nPassword: ${staff.password}\nRole: ${staff.role}`;
    navigator.clipboard.writeText(text);
    setCopiedId(staff.id);
    showToast(`Copied credentials for ${staff.fullName}`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const togglePasswordReveal = (staffId: string) => {
    setRevealedPasswords(prev => ({ ...prev, [staffId]: !prev[staffId] }));
  };

  const getDepartmentBadgeStyle = (dept: string) => {
    const d = dept.toLowerCase();
    if (d.includes('gate') || d.includes('security')) {
      return 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30';
    }
    if (d.includes('account') || d.includes('finance') || d.includes('billing')) {
      return 'bg-amber-500/20 text-amber-300 border-amber-400/30';
    }
    if (d.includes('sponsor') || d.includes('exhibition')) {
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
    }
    if (d.includes('media') || d.includes('comm')) {
      return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
    }
    if (d.includes('vip') || d.includes('guest')) {
      return 'bg-rose-500/20 text-rose-300 border-rose-400/30';
    }
    if (d.includes('tech') || d.includes('it')) {
      return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
    }
    if (d.includes('executive')) {
      return 'bg-teal-500/20 text-teal-300 border-teal-400/30';
    }
    return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30';
  };

  const permissionItemsKeys: { key: keyof StaffPermissions; label: string; desc: string; icon: React.ReactNode }[] = [
    { key: 'canRegisterAttendees', label: 'On-Site Registration', desc: 'Register new visitors, exhibitors, sponsors on-site', icon: <UserPlus className="w-3.5 h-3.5 text-emerald-400" /> },
    { key: 'canCheckIn', label: 'QR Gate Check-In', desc: 'Scan delegate QR badges & verify RFID status', icon: <QrCode className="w-3.5 h-3.5 text-cyan-400" /> },
    { key: 'canManageInbox', label: 'Secretariat Inbox', desc: 'Read & reply to public contact inquiries', icon: <Inbox className="w-3.5 h-3.5 text-amber-400" /> },
    { key: 'canManageSchedule', label: 'Programme Sessions', desc: 'Edit conference sessions & times', icon: <CalendarDays className="w-3.5 h-3.5 text-purple-400" /> },
    { key: 'canManageSpeakers', label: 'Keynote Speakers', desc: 'Update speaker bios & topics', icon: <Mic2 className="w-3.5 h-3.5 text-rose-400" /> },
    { key: 'canViewPayments', label: 'Payment Ledger', desc: 'View attendee payments & verify registration transactions', icon: <Receipt className="w-3.5 h-3.5 text-green-400" /> },
    { key: 'canManageSponsors', label: 'Sponsors & Partners', desc: 'Manage exhibitor logos & sponsor categories', icon: <Award className="w-3.5 h-3.5 text-yellow-400" /> },
    { key: 'canExportData', label: 'Export Data', desc: 'Download CSV reports & JSON data backups', icon: <Download className="w-3.5 h-3.5 text-blue-400" /> },
    { key: 'canManageLeadMatrix', label: 'Lead Matrix Funnel', desc: 'Manage L1-L6 lead pipeline levels & assignment', icon: <Target className="w-3.5 h-3.5 text-teal-400" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#012017] via-[#012d20] to-[#021f18] border border-emerald-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-mono text-[10px] font-extrabold tracking-widest uppercase">
                ADMINISTRATION & DEPARTMENT PROVISIONING
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[10px] font-bold">
                {staffAccounts.length} Staff Accounts
              </span>
            </div>

            <h2 className="text-2xl font-black text-white font-display flex items-center gap-2.5">
              <UserPlus className="w-7 h-7 text-emerald-400" />
              <span>Staff Management & Department Roles</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Super Admin can assign staff members to specific departments, set up full profile details (Full Name, Contact Phone, Email, Role, Department), generate portal usernames and passwords, and configure granular permissions.
            </p>
          </div>

          <button
            onClick={handleOpenRegisterModal}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-emerald-950 font-black text-xs sm:text-sm tracking-wide shadow-xl shadow-emerald-950/50 transition-all cursor-pointer flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>+ REGISTER NEW STAFF MEMBER</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="bg-black/40 border border-white/10 rounded-2xl p-3.5 flex flex-col">
            <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Total Staff</span>
            <strong className="text-xl font-black text-white font-mono mt-0.5">{staffAccounts.length}</strong>
            <span className="text-[10px] text-slate-400 mt-1">Personnel Registered</span>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3.5 flex flex-col">
            <span className="text-[10px] uppercase text-emerald-400 font-bold tracking-wider">Active Staff</span>
            <strong className="text-xl font-black text-emerald-300 font-mono mt-0.5">{activeCount}</strong>
            <span className="text-[10px] text-emerald-400/80 mt-1">Authorized Access</span>
          </div>

          <div className="bg-red-950/30 border border-red-500/30 rounded-2xl p-3.5 flex flex-col">
            <span className="text-[10px] uppercase text-red-400 font-bold tracking-wider">Suspended</span>
            <strong className="text-xl font-black text-red-300 font-mono mt-0.5">{suspendedCount}</strong>
            <span className="text-[10px] text-red-400/80 mt-1">Access Suspended</span>
          </div>

          <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-2xl p-3.5 flex flex-col">
            <span className="text-[10px] uppercase text-cyan-300 font-bold tracking-wider">Departments</span>
            <strong className="text-xl font-black text-cyan-200 font-mono mt-0.5">{allUniqueDepartments.length}</strong>
            <span className="text-[10px] text-cyan-400/80 mt-0.5">Assigned Units</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar with Department Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-2xl p-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search staff by name, phone, username, email, role, or department..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Department Filter Select */}
          <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] uppercase font-bold text-slate-400">Dept:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-white">All Departments</option>
              {allUniqueDepartments.map((dept) => (
                <option key={dept} value={dept} className="bg-slate-900 text-white">
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-xl p-0.5">
            {(['ALL', 'ACTIVE', 'SUSPENDED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-emerald-500 text-emerald-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st === 'ALL' ? 'All Status' : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Staff Roster Grid */}
      {filteredStaff.length === 0 ? (
        <div className="p-12 text-center bg-white/5 border border-white/10 rounded-3xl space-y-3">
          <Users className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No Staff Accounts Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'ALL' || departmentFilter !== 'ALL'
              ? 'No staff accounts match your current search and department filter criteria.'
              : 'No staff members registered yet. Click "Register New Staff Member" to add personnel.'}
          </p>
          <button
            onClick={handleOpenRegisterModal}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-emerald-950 text-xs font-bold inline-flex items-center gap-1.5 mt-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register First Staff Member</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaff.map((staff) => {
            const isSuspended = staff.status === 'SUSPENDED';
            const isPasswordRevealed = revealedPasswords[staff.id];
            const deptStyle = getDepartmentBadgeStyle(staff.department);

            // Count enabled permissions
            const enabledPerms = Object.entries(staff.permissions).filter(([_, val]) => val === true);

            return (
              <div
                key={staff.id}
                className={`bg-gradient-to-b from-[#012218] to-[#011610] border rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4 transition-all relative overflow-hidden ${
                  isSuspended 
                    ? 'border-red-500/40 opacity-80' 
                    : 'border-emerald-500/30 hover:border-emerald-400/60'
                }`}
              >
                {/* Status Indicator Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${isSuspended ? 'bg-red-500' : 'bg-emerald-500'}`} />

                <div>
                  {/* Top Row: Avatar & Status Badge */}
                  <div className="flex items-start justify-between gap-3 pt-1 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-base font-black border shadow-inner ${
                        isSuspended
                          ? 'bg-red-500/20 text-red-300 border-red-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      }`}>
                        {staff.fullName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-white text-base leading-tight font-display">
                          {staff.fullName}
                        </h3>
                        <span className="text-xs font-bold text-emerald-400 block mt-0.5">
                          {staff.role}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleStatus(staff)}
                      title={isSuspended ? 'Click to Activate Account' : 'Click to Suspend Account'}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border transition-all cursor-pointer flex items-center gap-1 ${
                        isSuspended
                          ? 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 hover:bg-emerald-500/30'
                      }`}
                    >
                      {isSuspended ? <ShieldAlert className="w-3 h-3 text-red-400" /> : <ShieldCheck className="w-3 h-3 text-emerald-400" />}
                      <span>{staff.status}</span>
                    </button>
                  </div>

                  {/* Assigned Department Badge */}
                  <div className="mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase border ${deptStyle}`}>
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{staff.department}</span>
                    </span>
                  </div>

                  {/* Profile Details & Credentials Box */}
                  <div className="bg-black/50 border border-white/10 rounded-2xl p-3 space-y-2 mb-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                        <Key className="w-3 h-3 text-emerald-400" />
                        Username
                      </span>
                      <strong className="font-mono text-emerald-300 select-all">{staff.username}</strong>
                    </div>

                    <div className="flex items-center justify-between text-xs border-t border-white/5 pt-1.5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-400" />
                        Password
                      </span>
                      <div className="flex items-center gap-2">
                        <strong className="font-mono text-amber-300 select-all">
                          {isPasswordRevealed ? staff.password : '••••••••'}
                        </strong>
                        <button
                          onClick={() => togglePasswordReveal(staff.id)}
                          className="text-slate-400 hover:text-white cursor-pointer"
                          title="Toggle show password"
                        >
                          {isPasswordRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {staff.email && (
                      <div className="text-[11px] text-slate-300 border-t border-white/5 pt-1.5 flex items-center gap-1.5 truncate">
                        <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{staff.email}</span>
                      </div>
                    )}

                    {staff.phone && (
                      <div className="text-[11px] text-slate-300 border-t border-white/5 pt-1.5 flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="font-mono">{staff.phone}</span>
                      </div>
                    )}

                    {staff.notes && (
                      <div className="text-[10px] text-slate-400 border-t border-white/5 pt-1.5 flex items-start gap-1 italic">
                        <FileText className="w-3 h-3 text-slate-500 flex-shrink-0 mt-0.5" />
                        <span>"{staff.notes}"</span>
                      </div>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-3 px-1">
                    <span>Registered By: <strong className="text-slate-300">{staff.registeredBy || 'Admin'}</strong></span>
                    {staff.lastLogin ? (
                      <span>Last Active: <strong className="text-emerald-400">{new Date(staff.lastLogin).toLocaleDateString()}</strong></span>
                    ) : (
                      <span className="text-amber-400 italic">Never logged in</span>
                    )}
                  </div>

                  {/* Permissions Summary Badges */}
                  <div className="space-y-1.5 border-t border-white/10 pt-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-300">Assigned Feature Access</span>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {enabledPerms.length} / {permissionItemsKeys.length} Granted
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {permissionItemsKeys.map((item) => {
                        const isGranted = staff.permissions[item.key];
                        if (!isGranted) return null;
                        return (
                          <span
                            key={item.key}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold"
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyCreds(staff)}
                      title="Copy Staff Credentials"
                      className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedId === staff.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline">{copiedId === staff.id ? 'Copied' : 'Share'}</span>
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(staff)}
                      title="Edit Profile Details & Department"
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {!isSuspended && (
                      <button
                        onClick={() => onTestLoginStaff(staff.username, staff.password)}
                        title="Test Log In as this Staff Member"
                        className="px-2.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 text-cyan-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="hidden sm:inline">Test Login</span>
                      </button>
                    )}

                    <button
                      onClick={() => setPendingDeleteStaff(staff)}
                      title="Delete Staff Account"
                      className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* REGISTER / EDIT STAFF MEMBER & DEPARTMENT PROVISIONING MODAL */}
      {/* ------------------------------------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#011a12] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-200 my-8 max-h-[90vh] flex flex-col">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="text-[10px] font-extrabold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                SUPER ADMIN STAFF PROVISIONING
              </span>
              <h2 className="text-2xl font-black text-white font-display mt-1">
                {editingStaffId ? 'Edit Staff Profile & Department' : 'Register New Staff Member'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Assign department, profile details, username, password, and portal permissions for secretariat personnel.
              </p>
            </div>

            {/* Form Scroll Body */}
            <form onSubmit={handleFormSubmit} className="space-y-5 overflow-y-auto pr-2 flex-1">
              
              {/* Preset Quick Select Buttons */}
              <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-2xl p-3.5 space-y-2">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Quick Role & Department Presets (One-Click Auto-Fill)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('gate')}
                    className="p-2 rounded-xl bg-black/40 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-400/40 text-xs font-bold text-slate-200 hover:text-emerald-300 transition-all text-left flex flex-col cursor-pointer"
                  >
                    <span>🚪 Gate Security</span>
                    <span className="text-[9px] text-slate-400 font-normal">Gate Operations & QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyPreset('secretariat')}
                    className="p-2 rounded-xl bg-black/40 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-400/40 text-xs font-bold text-slate-200 hover:text-emerald-300 transition-all text-left flex flex-col cursor-pointer"
                  >
                    <span>📋 Secretariat</span>
                    <span className="text-[9px] text-slate-400 font-normal">Registrations & Inbox</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyPreset('finance')}
                    className="p-2 rounded-xl bg-black/40 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-400/40 text-xs font-bold text-slate-200 hover:text-emerald-300 transition-all text-left flex flex-col cursor-pointer"
                  >
                    <span>💳 Finance Auditor</span>
                    <span className="text-[9px] text-slate-400 font-normal">Accounts & Billing</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyPreset('full')}
                    className="p-2 rounded-xl bg-black/40 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-400/40 text-xs font-bold text-slate-200 hover:text-emerald-300 transition-all text-left flex flex-col cursor-pointer"
                  >
                    <span>🌟 Executive Lead</span>
                    <span className="text-[9px] text-slate-400 font-normal">Full Access Rights</span>
                  </button>
                </div>
              </div>

              {/* 1. DEPARTMENT & PROFILE DETAILS */}
              <div className="space-y-3 p-4 bg-black/30 border border-white/10 rounded-2xl">
                <h3 className="text-xs font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  1. Department Assignment & Profile Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Assigned Department *
                    </label>
                    <select
                      value={departmentChoice}
                      onChange={(e) => setDepartmentChoice(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-bold text-xs focus:outline-none focus:border-emerald-400 cursor-pointer"
                    >
                      {STANDARD_DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept} className="bg-slate-900 text-white">
                          {dept}
                        </option>
                      ))}
                      <option value="CUSTOM" className="bg-slate-900 text-amber-300 font-bold">
                        ➕ Custom / Other Department...
                      </option>
                    </select>
                  </div>

                  {departmentChoice === 'CUSTOM' ? (
                    <div>
                      <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                        Type Custom Department Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customDepartment}
                        onChange={(e) => setCustomDepartment(e.target.value)}
                        placeholder="e.g. VIP Protocol & Security"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-amber-500/40 text-amber-200 text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Role Title / Position
                      </label>
                      <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g. Secretariat Registrar"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Staff Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => {
                        const name = e.target.value;
                        setFullName(name);
                        // Auto-suggest clean username if empty or creating new
                        if (!editingStaffId && name && !username) {
                          const suggested = 'staff.' + name.toLowerCase().replace(/[^a-z0-9]/g, '');
                          setUsername(suggested);
                        }
                      }}
                      placeholder="e.g. Rebecca Alabi"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rebecca@reconexpo.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      Contact Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +234 803 123 4567"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Task Notes / Responsibilities
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Lead Gate 2 Scanner Operator"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
              </div>

              {/* 2. PORTAL LOGIN CREDENTIALS */}
              <div className="space-y-3 p-4 bg-black/30 border border-white/10 rounded-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-amber-400" />
                    2. Staff Portal Credentials
                  </h3>

                  <button
                    type="button"
                    onClick={generateStrongPassword}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3 text-amber-400" />
                    <span>Generate Strong Password</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Portal Username *
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. staff.rebecca"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showFormPassword ? 'text' : 'password'}
                        required={!editingStaffId}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-black/60 border border-white/15 text-amber-300 font-mono text-xs focus:outline-none focus:border-emerald-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowFormPassword(!showFormPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                      >
                        {showFormPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. PERMISSIONS CHECKBOX MATRIX */}
              <div className="space-y-2 border-t border-white/10 pt-4">
                <label className="block text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                  3. Granular Feature Access Permissions
                </label>
                <p className="text-[11px] text-slate-400">
                  Select which sections this staff member can view and interact with upon logging into the Staff Workspace.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {permissionItemsKeys.map((item) => {
                    const checked = permissions[item.key];
                    return (
                      <label
                        key={item.key}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          checked
                            ? 'bg-emerald-950/60 border-emerald-500/50 text-white'
                            : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            setPermissions(prev => ({
                              ...prev,
                              [item.key]: e.target.checked
                            }));
                          }}
                          className="mt-1 rounded border-white/20 text-emerald-500 focus:ring-emerald-400 accent-emerald-500"
                        />
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold flex items-center gap-1.5 text-white">
                            {item.icon}
                            <span>{item.label}</span>
                          </span>
                          <p className="text-[10px] text-slate-400 leading-tight">{item.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-emerald-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition-all cursor-pointer flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{editingStaffId ? 'SAVE STAFF PROFILE UPDATES' : 'CREATE & PROVISION STAFF ACCOUNT'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Account Delete Confirmation Dialog */}
      {pendingDeleteStaff && (
        <div className="fixed inset-0 z-[350] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#031d17] border border-red-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0 mt-0.5">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white font-display">Revoke & Delete Staff Account</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Are you sure you want to permanently revoke and delete the staff account for <strong className="text-white">"{pendingDeleteStaff.fullName}"</strong> (@{pendingDeleteStaff.username})? This user will immediately lose system access.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setPendingDeleteStaff(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const res = onDeleteStaff(pendingDeleteStaff.id);
                  showToast(res.message);
                  setPendingDeleteStaff(null);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold transition-all cursor-pointer shadow-lg"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
