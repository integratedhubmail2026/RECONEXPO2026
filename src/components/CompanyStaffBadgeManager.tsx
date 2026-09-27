import React, { useState } from 'react';
import { AttendeeTicket, CompanyStaffBadge } from '../types';
import { SmartIdCard } from './SmartIdCard';
import { PhotoCaptureStudio } from './PhotoCaptureStudio';
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  UserPlus, 
  QrCode, 
  ShieldCheck, 
  Camera, 
  X, 
  Building2, 
  BadgeCheck, 
  Award,
  Sparkles
} from 'lucide-react';

interface CompanyStaffBadgeManagerProps {
  ticket: AttendeeTicket;
  isAdmin?: boolean;
  onUpdateTicket: (ticketNumber: string, updated: Partial<AttendeeTicket>) => void;
  showToast?: (msg: string) => void;
}

export const CompanyStaffBadgeManager: React.FC<CompanyStaffBadgeManagerProps> = ({
  ticket,
  isAdmin = false,
  onUpdateTicket,
  showToast
}) => {
  // Determine max allowed staff badges (default based on pass type, max 10)
  const defaultMax = 
    ticket.passType === 'sponsor' ? 5 :
    ticket.passType === 'exhibitor' ? 3 :
    ticket.passType === 'partner' ? 4 : 1;

  const maxStaffBadges = ticket.maxStaffBadges || defaultMax;
  
  // Ensure staffBadges array exists with at least the primary attendee if empty
  const initialStaffList: CompanyStaffBadge[] = ticket.staffBadges && ticket.staffBadges.length > 0 
    ? ticket.staffBadges 
    : [{
        id: `sb-primary-${ticket.ticketNumber}`,
        fullName: ticket.fullName,
        role: ticket.role || 'Primary Executive Delegate',
        photoUrl: ticket.photoUrl,
        badgeNumber: `${ticket.ticketNumber}-S01`,
        registeredAt: ticket.registeredAt || new Date().toISOString()
      }];

  const [staffList, setStaffList] = useState<CompanyStaffBadge[]>(initialStaffList);
  const [activeStaffId, setActiveStaffId] = useState<string>(initialStaffList[0]?.id || '');
  
  // Form modal state for adding / editing staff
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [pendingDeleteStaffMember, setPendingDeleteStaffMember] = useState<{ id: string; name: string } | null>(null);
  
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formPhotoUrl, setFormPhotoUrl] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Sync back to ticket state
  const saveStaffListToTicket = (newList: CompanyStaffBadge[], updatedMax?: number) => {
    setStaffList(newList);
    onUpdateTicket(ticket.ticketNumber, {
      staffBadges: newList,
      ...(updatedMax !== undefined ? { maxStaffBadges: updatedMax } : {})
    });
  };

  // Admin handles changing the assigned number of ID card generations (up to 10)
  const handleMaxCountChange = (delta: number) => {
    const nextMax = Math.min(10, Math.max(1, maxStaffBadges + delta));
    onUpdateTicket(ticket.ticketNumber, { maxStaffBadges: nextMax });
    if (showToast) {
      showToast(`Assigned ID Card Generation Allowance updated to ${nextMax} per payment.`);
    }
  };

  const isVisitor = ticket.passType === 'visitor' || ticket.tier.toLowerCase().includes('visitor') || ticket.tier.toLowerCase().includes('free') || ticket.amountPaid === '₦0' || ticket.amountPaid === 'Free' || ticket.amountPaid === '$0';
  const isApproved = isVisitor || ticket.adminApproved === true || ticket.adminApprovalStatus === 'APPROVED';

  // Open add staff form
  const handleOpenAddForm = () => {
    if (!isAdmin && !isApproved) {
      alert('🔒 Extra Staff ID Cards Locked!\n\nExhibitors, Sponsors, and Partners must make their payment and be confirmed by the Admin before extra staff ID cards can be assigned.');
      return;
    }
    if (staffList.length >= maxStaffBadges) {
      alert(`ID Card Generation limit reached (${maxStaffBadges} max per payment). Admin can increase the limit up to 10.`);
      return;
    }
    setFormName('');
    setFormRole('Exhibition Staff / Delegate');
    setFormPhotoUrl('');
    setEditingStaffId(null);
    setIsAddingStaff(true);
    setIsCameraActive(false);
  };

  // Open edit staff form
  const handleOpenEditForm = (staff: CompanyStaffBadge) => {
    if (!isAdmin && !isApproved) {
      alert('🔒 Extra Staff ID Cards Locked!\n\nExhibitors, Sponsors, and Partners must make their payment and be confirmed by the Admin before staff details can be edited.');
      return;
    }
    setFormName(staff.fullName);
    setFormRole(staff.role);
    setFormPhotoUrl(staff.photoUrl || '');
    setEditingStaffId(staff.id);
    setIsAddingStaff(true);
    setIsCameraActive(false);
  };

  // Save new or edited staff member
  const handleSaveStaffForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Please enter the staff member\'s Full Name.');
      return;
    }

    if (editingStaffId) {
      // Update existing staff
      const updatedList = staffList.map(s => 
        s.id === editingStaffId 
          ? { ...s, fullName: formName.trim(), role: formRole.trim() || 'Exhibition Staff', photoUrl: formPhotoUrl }
          : s
      );
      saveStaffListToTicket(updatedList);
      if (showToast) showToast(`Updated staff details for ${formName}`);
    } else {
      // Add new staff
      const nextIndex = staffList.length + 1;
      const indexStr = nextIndex < 10 ? `0${nextIndex}` : `${nextIndex}`;
      const newStaff: CompanyStaffBadge = {
        id: `sb-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        fullName: formName.trim(),
        role: formRole.trim() || 'Exhibition Staff',
        photoUrl: formPhotoUrl,
        badgeNumber: `${ticket.ticketNumber}-S${indexStr}`,
        registeredAt: new Date().toISOString()
      };
      const updatedList = [...staffList, newStaff];
      saveStaffListToTicket(updatedList);
      setActiveStaffId(newStaff.id);
      if (showToast) showToast(`Added staff ID card for ${newStaff.fullName}`);
    }

    setIsAddingStaff(false);
    setEditingStaffId(null);
  };

  // Remove staff member
  const handleDeleteStaff = (staffId: string, name: string) => {
    if (staffList.length <= 1) {
      if (showToast) showToast('At least one primary delegate ID card must remain on the registration record.');
      return;
    }
    setPendingDeleteStaffMember({ id: staffId, name });
  };

  const confirmDeleteStaffMember = () => {
    if (!pendingDeleteStaffMember) return;
    const { id: staffId, name } = pendingDeleteStaffMember;
    const updatedList = staffList.filter(s => s.id !== staffId);
    saveStaffListToTicket(updatedList);
    if (activeStaffId === staffId) {
      setActiveStaffId(updatedList[0]?.id || '');
    }
    if (showToast) showToast(`Removed staff ID card for ${name}`);
    setPendingDeleteStaffMember(null);
  };

  const activeStaffMember = staffList.find(s => s.id === activeStaffId) || staffList[0];

  return (
    <div className="space-y-6 bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-5 sm:p-6 text-white shadow-2xl">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Building2 className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 font-mono">
              Corporate Staff ID Card Management
            </span>
          </div>
          <h3 className="text-xl font-black text-white font-heading mt-1">
            {ticket.organization || ticket.fullName}
          </h3>
          <p className="text-xs text-slate-400">
            Pass Tier: <strong className="text-white">{ticket.tier}</strong> ({ticket.ticketNumber})
          </p>
        </div>

        {/* Assigned ID Card Generation Allowance Counter */}
        <div className="bg-black/60 border border-emerald-500/40 rounded-2xl p-3 flex items-center gap-4 shrink-0 shadow-inner">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">
              Staff ID Cards Allowed
            </div>
            <div className="text-sm font-black text-emerald-300 flex items-center gap-1">
              <BadgeCheck className="w-4 h-4 text-emerald-400" />
              <span>{staffList.length} of {maxStaffBadges} Generated</span>
            </div>
          </div>

          {/* Admin Allowance Adjustment Controls (up to 10) */}
          {isAdmin ? (
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/15">
              <button
                type="button"
                onClick={() => handleMaxCountChange(-1)}
                disabled={maxStaffBadges <= 1}
                className="w-7 h-7 rounded-lg bg-black/50 hover:bg-black text-white font-bold flex items-center justify-center disabled:opacity-40 cursor-pointer text-sm"
                title="Decrease ID card allowance"
              >
                -
              </button>
              <span className="px-2 font-mono font-black text-emerald-300 text-sm">
                {maxStaffBadges}
              </span>
              <button
                type="button"
                onClick={() => handleMaxCountChange(1)}
                disabled={maxStaffBadges >= 10}
                className="w-7 h-7 rounded-lg bg-black/50 hover:bg-black text-white font-bold flex items-center justify-center disabled:opacity-40 cursor-pointer text-sm"
                title="Increase ID card allowance (Max 10)"
              >
                +
              </button>
            </div>
          ) : (
            <div className="text-[10px] text-slate-400 max-w-[120px] leading-tight">
              Admin assigned limit (up to 10 per payment)
            </div>
          )}
        </div>
      </div>

      {/* Staff ID Cards List & Add Button */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Assigned Staff ID Badges ({staffList.length}/{maxStaffBadges})</span>
          </span>

          {staffList.length < maxStaffBadges && (
            <button
              type="button"
              onClick={handleOpenAddForm}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-emerald-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Add Staff Member</span>
            </button>
          )}
        </div>

        {/* Staff Cards Selector Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {staffList.map((staff, index) => {
            const isSelected = staff.id === activeStaffMember?.id;
            return (
              <div
                key={staff.id}
                onClick={() => setActiveStaffId(staff.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-emerald-950/80 border-emerald-400 shadow-lg ring-2 ring-emerald-500/30'
                    : 'bg-black/40 border-white/10 hover:border-emerald-500/40 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    {staff.photoUrl ? (
                      <img
                        src={staff.photoUrl}
                        alt={staff.fullName}
                        className="w-10 h-10 rounded-xl object-cover border border-emerald-400/60"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-xs border border-emerald-500/30">
                        {staff.fullName.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-emerald-950 text-[8px] font-black flex items-center justify-center">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="font-extrabold text-xs text-white truncate">
                      {staff.fullName}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {staff.role}
                    </div>
                    <div className="text-[9px] text-emerald-400 font-mono truncate">
                      {staff.badgeNumber}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => handleOpenEditForm(staff)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Edit staff details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  {staffList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteStaff(staff.id, staff.fullName)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Delete staff ID card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Staff Modal Form Overlay */}
      {isAddingStaff && (
        <div className="p-5 rounded-2xl bg-black/90 border-2 border-emerald-500/60 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h4 className="font-black text-sm text-emerald-300 uppercase tracking-wider flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span>{editingStaffId ? 'Edit Staff Member Details' : 'Add New Staff Member for ID Card Generation'}</span>
            </h4>
            <button
              type="button"
              onClick={() => setIsAddingStaff(false)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveStaffForm} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-200 mb-1">
                  Staff Member Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engr. Chidi Okafor"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-200 mb-1">
                  Job Designation / Role *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Technical Director / Booth Engineer"
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Photo Capture & Upload Studio */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-slate-200 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>Staff Member Portrait Photo (Optional / Snap Camera)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsCameraActive(!isCameraActive)}
                  className="text-[11px] font-bold text-emerald-400 hover:underline cursor-pointer"
                >
                  {isCameraActive ? 'Close Camera' : 'Snap Live Portrait'}
                </button>
              </div>

              {isCameraActive ? (
                <PhotoCaptureStudio
                  currentPhotoUrl={formPhotoUrl}
                  fullName={formName || 'Staff Member'}
                  onPhotoSelected={(url) => {
                    setFormPhotoUrl(url);
                    setIsCameraActive(false);
                  }}
                />
              ) : formPhotoUrl ? (
                <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10">
                  <img src={formPhotoUrl} alt="Staff Preview" className="w-12 h-12 rounded-xl object-cover" />
                  <div className="text-[11px] text-emerald-300 font-mono">Portrait photo attached</div>
                  <button
                    type="button"
                    onClick={() => setFormPhotoUrl('')}
                    className="ml-auto text-xs text-red-400 hover:underline"
                  >
                    Remove Photo
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic">
                  No photo attached. You can snap a photo with your webcam or use default company profile icon.
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsAddingStaff(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold cursor-pointer shadow-md"
              >
                {editingStaffId ? 'Update Staff Member' : 'Generate Staff ID Card'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Render Selected Staff Smart ID Card */}
      {activeStaffMember && (
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <QrCode className="w-4 h-4" />
              <span>Smart ID Card Preview: {activeStaffMember.fullName} ({activeStaffMember.badgeNumber})</span>
            </span>
          </div>

          <div className="p-6 sm:p-8 bg-black/60 rounded-3xl border border-emerald-500/40 flex justify-center">
            <SmartIdCard
              ticket={ticket}
              activeStaffBadge={activeStaffMember}
              isAdmin={isAdmin}
            />
          </div>
        </div>
      )}

      {/* Delete Staff Member Confirmation Modal */}
      {pendingDeleteStaffMember && (
        <div className="fixed inset-0 z-[350] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#031d17] border border-red-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0 mt-0.5">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white font-display">Remove Staff Delegate</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Remove staff ID card record for <strong className="text-white">"{pendingDeleteStaffMember.name}"</strong>?
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setPendingDeleteStaffMember(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteStaffMember}
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
