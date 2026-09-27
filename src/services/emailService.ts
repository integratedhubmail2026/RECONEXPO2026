export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  hasPassword?: boolean;
  passwordMasked?: string;
  fromName: string;
  fromEmail: string;
  replyTo: string;
  bccAdmin: string;
  preset: 'gmail' | 'brevo' | 'sendgrid' | 'ses' | 'zoho' | 'outlook' | 'custom';
  autoSendOnRegistration: boolean;
  autoSendOnPayment: boolean;
  autoSendOnExhibitor: boolean;
  autoSendOnMarketer: boolean;
  autoSendOnStaff: boolean;
  dkimDomain: string;
  lastTestedAt?: string;
  lastTestStatus?: 'success' | 'failed' | 'not_tested';
  lastTestError?: string;
  totalSentCount?: number;
  totalFailedCount?: number;
  // Editable Email Template Header, Mailbox Icon & Footer Information
  headerLogoUrl?: string;
  headerTagline?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  headerBannerColor?: string;
  footerOrganization?: string;
  footerVenueAddress?: string;
  footerHotlines?: string;
  footerOfficialEmail?: string;
  footerWebsite?: string;
  footerDisclaimer?: string;
}

export interface EmailLogEntry {
  id: string;
  to: string;
  toName?: string;
  subject: string;
  template: 'registration_badge' | 'payment_receipt' | 'broadcast' | 'test_ping' | 'custom';
  status: 'delivered' | 'failed' | 'queued';
  sentAt: string;
  messageId?: string;
  response?: string;
  error?: string;
  category?: string;
  ticketNumber?: string;
}

// Fetch active SMTP configuration from backend
export async function getSmtpConfig(): Promise<SmtpConfig | null> {
  try {
    const res = await fetch('/api/smtp/config');
    if (!res.ok) return null;
    const data = await res.json();
    return data.config || null;
  } catch (err) {
    console.warn('[Error fetching SMTP config]', err);
    return null;
  }
}

// Update SMTP configuration
export async function updateSmtpConfig(config: Partial<SmtpConfig> & { pass?: string }): Promise<{ success: boolean; message: string; config?: SmtpConfig }> {
  try {
    const res = await fetch('/api/smtp/config/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error updating SMTP configuration' };
  }
}

// Test SMTP connection & socket handshake
export async function testSmtpConnection(): Promise<{ success: boolean; message: string; details?: any }> {
  try {
    const res = await fetch('/api/smtp/test-connection', {
      method: 'POST'
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error testing SMTP connection' };
  }
}

// Send live test email to inbox
export async function sendSmtpTestEmail(recipientEmail: string, customNote?: string): Promise<{ success: boolean; message: string; messageId?: string; details?: any }> {
  try {
    const res = await fetch('/api/smtp/send-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientEmail, customNote })
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error sending test email' };
  }
}

// Dispatch Attendee Registration Badge Email
export async function sendAttendeeConfirmationEmail(attendee: any): Promise<{ success: boolean; message: string; messageId?: string }> {
  try {
    const res = await fetch('/api/smtp/send-badge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attendee })
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error sending attendee email' };
  }
}

// Dispatch Payment Receipt Email
export async function sendPaymentReceiptEmail(attendee: any, transaction: any): Promise<{ success: boolean; message: string; messageId?: string }> {
  try {
    const res = await fetch('/api/smtp/send-receipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attendee, transaction })
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error sending receipt email' };
  }
}

// Broadcast Custom Email to Attendees
export async function sendBroadcastEmail(payload: {
  recipients: Array<{ email: string; fullName?: string; organization?: string; ticketNumber?: string; category?: string }>;
  subject: string;
  preheader?: string;
  bodyContent: string;
  categoryTag?: string;
}): Promise<{ success: boolean; deliveredCount: number; failedCount: number; errors: string[] }> {
  try {
    const res = await fetch('/api/smtp/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      deliveredCount: 0,
      failedCount: payload.recipients.length,
      errors: [err.message || 'Network error broadcasting emails']
    };
  }
}

// Get Email Delivery Logs
export async function getEmailLogs(): Promise<EmailLogEntry[]> {
  try {
    const res = await fetch('/api/smtp/logs');
    if (!res.ok) return [];
    const data = await res.json();
    return data.logs || [];
  } catch (err) {
    console.warn('[Error fetching email logs]', err);
    return [];
  }
}

// Clear Email Logs
export async function clearEmailLogs(): Promise<boolean> {
  try {
    const res = await fetch('/api/smtp/logs/clear', { method: 'POST' });
    const data = await res.json();
    return Boolean(data.success);
  } catch {
    return false;
  }
}

// Delete Single Email Log
export async function deleteEmailLog(logId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/smtp/logs/delete/${logId}`, { method: 'POST' });
    const data = await res.json();
    return Boolean(data.success);
  } catch {
    return false;
  }
}

// Resend Logged Email
export async function resendLoggedEmail(logId: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`/api/smtp/resend/${logId}`, { method: 'POST' });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error resending email' };
  }
}

// Fetch list of globally unsubscribed email addresses for deliverability check
export async function getUnsubscribedEmailsList(): Promise<string[]> {
  try {
    const res = await fetch('/api/marketing/unsubscribed-list');
    if (!res.ok) return [];
    const data = await res.json();
    return data.unsubscribed || [];
  } catch (err) {
    console.warn('[Error fetching unsubscribed list]', err);
    return [];
  }
}

// Add an email to the global unsubscribe list manually
export async function addEmailToUnsubscribeList(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/marketing/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error adding email to unsubscribe list' };
  }
}

// Remove an email from the global unsubscribe list (resubscribe)
export async function removeEmailFromUnsubscribeList(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/marketing/resubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error resubscribing email' };
  }
}
