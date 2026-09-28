import React, { useState } from 'react';
import { Bell, Send, CheckCircle2 } from 'lucide-react';
import { sendLocalNotification } from '../../utils/pushNotificationService';
import { playSound } from '../../utils/soundService';

export const PushNotificationManagerTab: React.FC = () => {
  const [title, setTitle] = useState('🔴 Minister Opening Keynote Commencing!');
  const [body, setBody] = useState('Hon. Minister Ahmed Dangiwa is taking the stage in Main Auditorium Hall A.');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('chime');
    sendLocalNotification(title, { body });
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 text-white text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-black">Live Push Notification Broadcaster</h3>
          <p className="text-slate-400 text-[11px]">Send instant push notifications to attendee mobile screens.</p>
        </div>
      </div>

      <form onSubmit={handleSend} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Notification Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">Alert Content</label>
          <textarea
            rows={3}
            required
            value={body}
            onChange={e => setBody(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {sentSuccess && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Push notification dispatched to all subscribed visitors!</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase hover:bg-emerald-400 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Broadcast Push Notice</span>
          </button>
        </div>
      </form>
    </div>
  );
};
