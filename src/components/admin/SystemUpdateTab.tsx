import React, { useState } from 'react';
import { useExpoData } from '../../context/ExpoDataContext';
import { Download, RefreshCw, Database, CheckCircle2, AlertTriangle } from 'lucide-react';
import { playSound } from '../../utils/soundService';

export const SystemUpdateTab: React.FC = () => {
  const { attendees, staffBadges, marketers, booths } = useExpoData();
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleExportBackup = () => {
    playSound('badge_print');
    const data = {
      exportedAt: new Date().toISOString(),
      attendees,
      staffBadges,
      marketers,
      booths
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RECON_EXPO_BACKUP_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (confirm('WARNING: Reset all local cache and reload default application dataset?')) {
      localStorage.clear();
      playSound('click');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 text-white text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-black">System Diagnostics & Database Backup</h3>
          <p className="text-slate-400 text-[11px]">Export JSON data dumps and manage local cache state.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
          <p className="text-[10px] text-slate-400 uppercase font-bold">Attendees</p>
          <p className="text-xl font-black text-white font-mono mt-1">{attendees.length}</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
          <p className="text-[10px] text-slate-400 uppercase font-bold">Staff Passes</p>
          <p className="text-xl font-black text-white font-mono mt-1">{staffBadges.length}</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
          <p className="text-[10px] text-slate-400 uppercase font-bold">Ambassadors</p>
          <p className="text-xl font-black text-white font-mono mt-1">{marketers.length}</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
          <p className="text-[10px] text-slate-400 uppercase font-bold">Booths</p>
          <p className="text-xl font-black text-white font-mono mt-1">{booths.length}</p>
        </div>
      </div>

      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-white text-sm">Download Full Database JSON Backup</h4>
          <p className="text-slate-400 text-[11px]">Save complete registration records, marketers, and staff badges to local file.</p>
        </div>
        <button
          onClick={handleExportBackup}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase hover:bg-emerald-400 flex items-center gap-1.5 shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Backup JSON</span>
        </button>
      </div>

      <div className="bg-red-950/20 border border-red-500/30 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-red-300 text-sm">Purge Local Cache & Re-seed</h4>
          <p className="text-slate-400 text-[11px]">Clear browser local storage and restore default system config.</p>
        </div>
        <button
          onClick={handleResetData}
          className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs uppercase hover:bg-red-500 flex items-center gap-1.5 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Cache</span>
        </button>
      </div>
    </div>
  );
};
