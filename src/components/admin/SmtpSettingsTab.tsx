import React, { useState, useEffect } from 'react';
import { Mail, ShieldCheck, RefreshCw, Send, CheckCircle2, AlertCircle, Trash2, Eye } from 'lucide-react';
import { testSmtpPing, fetchEmailLogs, clearAllEmailLogs, deleteEmailLogItem, EmailLogEntry } from '../../services/emailService';
import { playSound } from '../../utils/soundService';

export const SmtpSettingsTab: React.FC = () => {
  const [config, setConfig] = useState<any>({
    host: 'mail.afrinetgroup.com',
    port: 465,
    secure: true,
    user: 'reconexpo@afrinetgroup.com',
    fromName: 'RECON Expo 2026 Secretariat',
    fromEmail: 'reconexpo@afrinetgroup.com',
    replyTo: 'reconexpo@afrinetgroup.com',
    bccAdmin: 'integratedhubmail@gmail.com',
    hasPassword: true
  });

  const [testEmail, setTestEmail] = useState('integratedhubmail@gmail.com');
  const [testStatus, setTestStatus] = useState<{ loading: boolean; message?: string; success?: boolean } | null>(null);
  const [logs, setLogs] = useState<EmailLogEntry[]>([]);
  const [previewLog, setPreviewLog] = useState<EmailLogEntry | null>(null);

  const loadConfig = async () => {
    try {
      const res = await fetch('/api/smtp/config');
      const data = await res.json();
      if (data.config) setConfig(data.config);
    } catch (e) {}
  };

  const loadLogs = async () => {
    const l = await fetchEmailLogs();
    setLogs(l);
  };

  useEffect(() => {
    loadConfig();
    loadLogs();
  }, []);

  const handleTestPing = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestStatus({ loading: true });
    playSound('click');

    const res = await testSmtpPing(testEmail, 'Live system check from Admin Dashboard');
    setTestStatus({ loading: false, message: res.message, success: res.success });
    if (res.success) {
      playSound('success');
    } else {
      playSound('error');
    }
    loadLogs();
  };

  const handleClearLogs = async () => {
    if (confirm('Clear all email logs?')) {
      await clearAllEmailLogs();
      loadLogs();
      playSound('click');
    }
  };

  const handleDeleteLog = async (id: string) => {
    await deleteEmailLogItem(id);
    loadLogs();
    playSound('click');
  };

  return (
    <div className="space-y-6 text-white text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-black">SMTP Mail Server & Email Outbox</h3>
          <p className="text-slate-400 text-[11px]">Manage outgoing mail credentials, DKIM deliverability, and live outbox dispatch logs.</p>
        </div>
        <button
          onClick={loadLogs}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Quick Test Email Dispatch */}
      <form onSubmit={handleTestPing} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
        <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Test Mail Dispatch</h4>
        <div className="flex gap-2">
          <input
            type="email"
            required
            value={testEmail}
            onChange={e => setTestEmail(e.target.value)}
            placeholder="Recipient email address"
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none font-mono"
          />
          <button
            type="submit"
            disabled={testStatus?.loading}
            className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{testStatus?.loading ? 'Sending...' : 'Send Test Ping'}</span>
          </button>
        </div>

        {testStatus?.message && (
          <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs ${
            testStatus.success ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300' : 'bg-red-950/30 border-red-500/50 text-red-300'
          }`}>
            {testStatus.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{testStatus.message}</span>
          </div>
        )}
      </form>

      {/* Email Outbox Logs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
            Email Delivery Outbox Logs ({logs.length})
          </h4>
          {logs.length > 0 && (
            <button
              onClick={handleClearLogs}
              className="text-red-400 hover:text-red-300 text-[11px] font-semibold flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear All Logs</span>
            </button>
          )}
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-slate-500 text-center py-6">No emails sent yet.</p>
          ) : (
            logs.map(log => (
              <div key={log.id} className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-emerald-400 font-bold">{log.to}</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {log.template}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold">✓ DELIVERED</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">{log.subject}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {new Date(log.sentAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`/api/smtp/preview/${log.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400"
                    title="View Rendered Email Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDeleteLog(log.id)}
                    className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900 text-red-400"
                    title="Delete Log"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
