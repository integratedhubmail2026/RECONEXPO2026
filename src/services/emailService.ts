import { Attendee } from '../types';

export interface EmailLogEntry {
  id: string;
  to: string;
  toName?: string;
  subject: string;
  template: 'registration_badge' | 'payment_receipt' | 'broadcast' | 'test_ping' | 'custom' | 'visitor_vip_drip' | 'unconfirmed_vip_recovery';
  status: 'delivered' | 'failed' | 'queued';
  sentAt: string;
  messageId?: string;
  errorMessage?: string;
  previewUrl?: string;
  renderedHtml?: string;
  deliveryMode?: string;
}

export const sendBadgeEmail = async (attendee: Attendee): Promise<{ success: boolean; message: string; previewUrl?: string }> => {
  try {
    const res = await fetch('/api/smtp/send-badge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attendee })
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to dispatch email' };
  }
};

export const sendReceiptEmail = async (attendee: Attendee, transaction: any): Promise<{ success: boolean; message: string; previewUrl?: string }> => {
  try {
    const res = await fetch('/api/smtp/send-receipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attendee, transaction })
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to dispatch receipt' };
  }
};

export const testSmtpPing = async (recipientEmail: string, customNote?: string) => {
  try {
    const res = await fetch('/api/smtp/send-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientEmail, customNote })
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err?.message || 'Test ping failed' };
  }
};

export const fetchEmailLogs = async (): Promise<EmailLogEntry[]> => {
  try {
    const res = await fetch('/api/smtp/logs');
    const data = await res.json();
    return data.logs || [];
  } catch (err) {
    console.warn('Failed to fetch logs:', err);
    return [];
  }
};

export const clearAllEmailLogs = async (): Promise<boolean> => {
  try {
    const res = await fetch('/api/smtp/logs/clear', { method: 'POST' });
    const data = await res.json();
    return data.success;
  } catch (err) {
    return false;
  }
};

export const deleteEmailLogItem = async (id: string): Promise<boolean> => {
  try {
    const res = await fetch(`/api/smtp/logs/delete/${id}`, { method: 'POST' });
    const data = await res.json();
    return data.success;
  } catch (err) {
    return false;
  }
};

export const resendEmailLogItem = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await fetch(`/api/smtp/resend/${id}`, { method: 'POST' });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err?.message || 'Resend failed' };
  }
};
