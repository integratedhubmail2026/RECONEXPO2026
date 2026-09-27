import nodemailer, { SendMailOptions } from 'nodemailer';
import fs from 'fs';
import path from 'path';

export interface SmtpSettings {
  host: string;
  port: number;
  secure: boolean; // true for 465, false for 587 (STARTTLS)
  user: string;
  pass: string;
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
  // Email Template Header, Mailbox Icon & Footer Customization Fields
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

export interface EmailLogItem {
  id: string;
  to: string;
  toName?: string;
  subject: string;
  template: 'registration_badge' | 'payment_receipt' | 'broadcast' | 'test_ping' | 'custom' | 'visitor_vip_drip' | 'unconfirmed_vip_recovery';
  status: 'delivered' | 'failed' | 'queued';
  sentAt: string;
  messageId?: string;
  response?: string;
  error?: string;
  category?: string;
  ticketNumber?: string;
  payloadSnapshot?: any;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const SMTP_SETTINGS_FILE = path.join(DATA_DIR, 'smtp_settings.json');
const SMTP_LOGS_FILE = path.join(DATA_DIR, 'smtp_logs.json');
const UNSUBSCRIBED_EMAILS_FILE = path.join(DATA_DIR, 'unsubscribed_emails.json');

// Global unsubscribe list manager
export function getUnsubscribedEmails(): string[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(UNSUBSCRIBED_EMAILS_FILE)) {
      const raw = fs.readFileSync(UNSUBSCRIBED_EMAILS_FILE, 'utf-8');
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        return list.map(e => String(e).trim().toLowerCase()).filter(Boolean);
      }
    }
  } catch (e) {
    console.warn('[Get Unsubscribed Emails Error]', e);
  }
  return [];
}

export function addUnsubscribedEmail(email: string): boolean {
  try {
    const cleaned = String(email).trim().toLowerCase();
    if (!cleaned || !cleaned.includes('@')) return false;
    const list = getUnsubscribedEmails();
    if (!list.includes(cleaned)) {
      list.push(cleaned);
      fs.writeFileSync(UNSUBSCRIBED_EMAILS_FILE, JSON.stringify(list, null, 2), 'utf-8');
      return true;
    }
  } catch (e) {
    console.warn('[Add Unsubscribed Email Error]', e);
  }
  return false;
}

export function removeUnsubscribedEmail(email: string): boolean {
  try {
    const cleaned = String(email).trim().toLowerCase();
    if (!cleaned) return false;
    const list = getUnsubscribedEmails();
    const filtered = list.filter(e => e !== cleaned);
    if (list.length !== filtered.length) {
      fs.writeFileSync(UNSUBSCRIBED_EMAILS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
      return true;
    }
  } catch (e) {
    console.warn('[Remove Unsubscribed Email Error]', e);
  }
  return false;
}

export function isEmailUnsubscribed(email: string): boolean {
  if (!email) return false;
  const cleaned = String(email).trim().toLowerCase();
  return getUnsubscribedEmails().includes(cleaned);
}

// Default initial SMTP Settings Container
const DEFAULT_SMTP_SETTINGS: SmtpSettings = {
  host: process.env.SMTP_HOST || 'mail.afrinetgroup.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === 'false' ? false : true,
  user: process.env.SMTP_USER || 'reconexpo@afrinetgroup.com',
  pass: process.env.SMTP_PASS || 'Info@reconexpo2026',
  fromName: process.env.SMTP_FROM_NAME || 'RECON Expo 2026 Secretariat',
  fromEmail: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'reconexpo@afrinetgroup.com',
  replyTo: process.env.SMTP_REPLY_TO || 'reconexpo@afrinetgroup.com',
  bccAdmin: process.env.SMTP_BCC_ADMIN || 'reconexpo@afrinetgroup.com',
  preset: 'custom',
  autoSendOnRegistration: true,
  autoSendOnPayment: true,
  autoSendOnExhibitor: true,
  autoSendOnMarketer: true,
  autoSendOnStaff: true,
  dkimDomain: 'afrinetgroup.com',
  lastTestStatus: 'not_tested',
  headerLogoUrl: 'https://www.afrinetgroup.com/recon-logo.svg',
  headerTagline: '🏛️ 8TH REAL ESTATE & CONSTRUCTION EXPO 2026',
  headerTitle: 'RECON EXPO ABUJA',
  headerSubtitle: "October 29–31, 2026 • Shehu Musa Yar'Adua Centre, Abuja, Nigeria",
  headerBannerColor: '#012a20',
  footerOrganization: 'RECON Expo 2026 Secretariat & Organizing Committee',
  footerVenueAddress: "Shehu Musa Yar'Adua Centre, Memorial Drive, Central Business District, Abuja, FCT, Nigeria",
  footerHotlines: '+234 803 234 5678 | +234 802 987 6543',
  footerOfficialEmail: 'reconexpo@afrinetgroup.com',
  footerWebsite: 'https://reconexpo.afrinetgroup.com',
  footerDisclaimer: 'You are receiving this official communication because you registered for the 8th Real Estate & Construction Expo 2026. To manage your email preferences or update registration details, reply directly to this email or visit our secretariat portal.'
};

let runtimeSmtpSettings: SmtpSettings = { ...DEFAULT_SMTP_SETTINGS };
let emailLogsStore: EmailLogItem[] = [];

// Persistence Helpers
export function loadSmtpSettingsFromDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(SMTP_SETTINGS_FILE)) {
      const raw = fs.readFileSync(SMTP_SETTINGS_FILE, 'utf-8');
      const saved = JSON.parse(raw);
      if (saved && typeof saved === 'object') {
        runtimeSmtpSettings = { ...runtimeSmtpSettings, ...saved };
      }
    }
  } catch (e) {
    console.warn('[SMTP Settings Load Error]', e);
  }

  // Load Logs
  try {
    if (fs.existsSync(SMTP_LOGS_FILE)) {
      const rawLogs = fs.readFileSync(SMTP_LOGS_FILE, 'utf-8');
      const parsedLogs = JSON.parse(rawLogs);
      if (Array.isArray(parsedLogs)) {
        emailLogsStore = parsedLogs;
      }
    }
  } catch (e) {
    console.warn('[SMTP Logs Load Error]', e);
  }
}

export function saveSmtpSettingsToDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(SMTP_SETTINGS_FILE, JSON.stringify(runtimeSmtpSettings, null, 2), 'utf-8');
  } catch (e) {
    console.warn('[SMTP Settings Save Error]', e);
  }
}

export function saveSmtpLogsToDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    // Limit to latest 500 logs to prevent unbounded file growth
    const trimmed = emailLogsStore.slice(0, 500);
    fs.writeFileSync(SMTP_LOGS_FILE, JSON.stringify(trimmed, null, 2), 'utf-8');
  } catch (e) {
    console.warn('[SMTP Logs Save Error]', e);
  }
}

// Initialize on load
loadSmtpSettingsFromDisk();

// Mask sensitive password for client UI overview
export function maskPassword(pwd?: string): string {
  if (!pwd || pwd.trim().length === 0) return '';
  const trimmed = pwd.trim();
  if (trimmed.length <= 4) return '••••••••';
  const prefix = trimmed.substring(0, 2);
  const suffix = trimmed.substring(trimmed.length - 2);
  return `${prefix}••••••••••••${suffix}`;
}

export function getPublicSmtpConfig() {
  const hasPass = Boolean(runtimeSmtpSettings.pass && runtimeSmtpSettings.pass.trim().length > 0);
  return {
    host: runtimeSmtpSettings.host,
    port: runtimeSmtpSettings.port,
    secure: runtimeSmtpSettings.secure,
    user: runtimeSmtpSettings.user,
    hasPassword: hasPass,
    passwordMasked: hasPass ? maskPassword(runtimeSmtpSettings.pass) : '',
    fromName: runtimeSmtpSettings.fromName,
    fromEmail: runtimeSmtpSettings.fromEmail,
    replyTo: runtimeSmtpSettings.replyTo,
    bccAdmin: runtimeSmtpSettings.bccAdmin,
    preset: runtimeSmtpSettings.preset,
    autoSendOnRegistration: runtimeSmtpSettings.autoSendOnRegistration,
    autoSendOnPayment: runtimeSmtpSettings.autoSendOnPayment,
    autoSendOnExhibitor: runtimeSmtpSettings.autoSendOnExhibitor,
    autoSendOnMarketer: runtimeSmtpSettings.autoSendOnMarketer,
    autoSendOnStaff: runtimeSmtpSettings.autoSendOnStaff,
    dkimDomain: runtimeSmtpSettings.dkimDomain,
    lastTestedAt: runtimeSmtpSettings.lastTestedAt,
    lastTestStatus: runtimeSmtpSettings.lastTestStatus,
    lastTestError: runtimeSmtpSettings.lastTestError,
    // Header & Footer
    headerTagline: runtimeSmtpSettings.headerTagline || '🏛️ 8TH REAL ESTATE & CONSTRUCTION EXPO 2026',
    headerTitle: runtimeSmtpSettings.headerTitle || 'RECON EXPO ABUJA',
    headerSubtitle: runtimeSmtpSettings.headerSubtitle || "October 29–31, 2026 • Shehu Musa Yar'Adua Centre, Abuja, Nigeria",
    headerBannerColor: runtimeSmtpSettings.headerBannerColor || '#012a20',
    footerOrganization: runtimeSmtpSettings.footerOrganization || runtimeSmtpSettings.fromName || 'RECON Expo 2026 Secretariat',
    footerVenueAddress: runtimeSmtpSettings.footerVenueAddress || "Shehu Musa Yar'Adua Centre, Memorial Drive, Central Business District, Abuja, FCT, Nigeria",
    footerHotlines: runtimeSmtpSettings.footerHotlines || '+234 803 234 5678 | +234 802 987 6543',
    footerOfficialEmail: runtimeSmtpSettings.footerOfficialEmail || runtimeSmtpSettings.fromEmail || 'reconexpo@afrinetgroup.com',
    footerWebsite: runtimeSmtpSettings.footerWebsite || 'https://www.afrinetgroup.com',
    footerDisclaimer: runtimeSmtpSettings.footerDisclaimer || 'You are receiving this official communication because you registered for the 8th Real Estate & Construction Expo 2026.',
    totalSentCount: emailLogsStore.filter(l => l.status === 'delivered').length,
    totalFailedCount: emailLogsStore.filter(l => l.status === 'failed').length
  };
}

export function updateSmtpConfig(newConfig: Partial<SmtpSettings>): SmtpSettings {
  if (newConfig.host !== undefined) runtimeSmtpSettings.host = String(newConfig.host).trim();
  if (newConfig.port !== undefined) runtimeSmtpSettings.port = Number(newConfig.port) || 465;
  if (newConfig.secure !== undefined) runtimeSmtpSettings.secure = Boolean(newConfig.secure);
  if (newConfig.user !== undefined) runtimeSmtpSettings.user = String(newConfig.user).trim();
  
  // Guard: Only update password if a real non-masked string is sent
  if (newConfig.pass !== undefined && typeof newConfig.pass === 'string') {
    const trimmed = newConfig.pass.trim();
    if (trimmed && !trimmed.includes('••••') && !trimmed.includes('***')) {
      runtimeSmtpSettings.pass = trimmed;
    }
  }

  if (newConfig.fromName !== undefined) runtimeSmtpSettings.fromName = String(newConfig.fromName).trim();
  if (newConfig.fromEmail !== undefined) runtimeSmtpSettings.fromEmail = String(newConfig.fromEmail).trim();
  if (newConfig.replyTo !== undefined) runtimeSmtpSettings.replyTo = String(newConfig.replyTo).trim();
  if (newConfig.bccAdmin !== undefined) runtimeSmtpSettings.bccAdmin = String(newConfig.bccAdmin).trim();
  if (newConfig.preset !== undefined) runtimeSmtpSettings.preset = newConfig.preset;
  if (newConfig.autoSendOnRegistration !== undefined) runtimeSmtpSettings.autoSendOnRegistration = Boolean(newConfig.autoSendOnRegistration);
  if (newConfig.autoSendOnPayment !== undefined) runtimeSmtpSettings.autoSendOnPayment = Boolean(newConfig.autoSendOnPayment);
  if (newConfig.autoSendOnExhibitor !== undefined) runtimeSmtpSettings.autoSendOnExhibitor = Boolean(newConfig.autoSendOnExhibitor);
  if (newConfig.autoSendOnMarketer !== undefined) runtimeSmtpSettings.autoSendOnMarketer = Boolean(newConfig.autoSendOnMarketer);
  if (newConfig.autoSendOnStaff !== undefined) runtimeSmtpSettings.autoSendOnStaff = Boolean(newConfig.autoSendOnStaff);
  if (newConfig.dkimDomain !== undefined) runtimeSmtpSettings.dkimDomain = String(newConfig.dkimDomain).trim();

  // Header & Footer updates
  if (newConfig.headerLogoUrl !== undefined) runtimeSmtpSettings.headerLogoUrl = String(newConfig.headerLogoUrl).trim();
  if (newConfig.headerTagline !== undefined) runtimeSmtpSettings.headerTagline = String(newConfig.headerTagline).trim();
  if (newConfig.headerTitle !== undefined) runtimeSmtpSettings.headerTitle = String(newConfig.headerTitle).trim();
  if (newConfig.headerSubtitle !== undefined) runtimeSmtpSettings.headerSubtitle = String(newConfig.headerSubtitle).trim();
  if (newConfig.headerBannerColor !== undefined) runtimeSmtpSettings.headerBannerColor = String(newConfig.headerBannerColor).trim();
  if (newConfig.footerOrganization !== undefined) runtimeSmtpSettings.footerOrganization = String(newConfig.footerOrganization).trim();
  if (newConfig.footerVenueAddress !== undefined) runtimeSmtpSettings.footerVenueAddress = String(newConfig.footerVenueAddress).trim();
  if (newConfig.footerHotlines !== undefined) runtimeSmtpSettings.footerHotlines = String(newConfig.footerHotlines).trim();
  if (newConfig.footerOfficialEmail !== undefined) runtimeSmtpSettings.footerOfficialEmail = String(newConfig.footerOfficialEmail).trim();
  if (newConfig.footerWebsite !== undefined) runtimeSmtpSettings.footerWebsite = String(newConfig.footerWebsite).trim();
  if (newConfig.footerDisclaimer !== undefined) runtimeSmtpSettings.footerDisclaimer = String(newConfig.footerDisclaimer).trim();

  saveSmtpSettingsToDisk();
  return runtimeSmtpSettings;
}

// Build Nodemailer Transporter instance with solid deliverability options
export function createTransporter() {
  const host = (runtimeSmtpSettings.host || 'smtp.gmail.com').trim();
  const port = Number(runtimeSmtpSettings.port) || (runtimeSmtpSettings.secure ? 465 : 587);
  const user = (runtimeSmtpSettings.user || '').trim();
  const pass = (runtimeSmtpSettings.pass || '').trim();

  if (!user || !pass) {
    throw new Error('SMTP credentials not configured. Please enter your SMTP Username & Password/App Password.');
  }

  const transportOptions: any = {
    host,
    port,
    secure: runtimeSmtpSettings.secure, // true for 465, false for other ports
    auth: {
      user,
      pass
    },
    tls: {
      // Do not fail on invalid certs to allow custom corporate mail servers
      rejectUnauthorized: false
    },
    connectionTimeout: 10000, // 10s socket connect timeout
    greetingTimeout: 8000,
    socketTimeout: 15000
  };

  return nodemailer.createTransport(transportOptions);
}

// Test Connection & Handshake
export async function testSmtpConnection(): Promise<{ success: boolean; message: string; details?: any }> {
  const startTime = Date.now();
  try {
    const transporter = createTransporter();
    await transporter.verify();
    const latencyMs = Date.now() - startTime;

    runtimeSmtpSettings.lastTestedAt = new Date().toISOString();
    runtimeSmtpSettings.lastTestStatus = 'success';
    runtimeSmtpSettings.lastTestError = undefined;
    saveSmtpSettingsToDisk();

    return {
      success: true,
      message: `SMTP Handshake Successful! Connected to ${runtimeSmtpSettings.host}:${runtimeSmtpSettings.port} in ${latencyMs}ms. Ready for inbox delivery.`,
      details: {
        host: runtimeSmtpSettings.host,
        port: runtimeSmtpSettings.port,
        secure: runtimeSmtpSettings.secure,
        user: runtimeSmtpSettings.user,
        latencyMs,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    const errMsg = error.message || 'Failed to authenticate with SMTP server.';

    runtimeSmtpSettings.lastTestedAt = new Date().toISOString();
    runtimeSmtpSettings.lastTestStatus = 'failed';
    runtimeSmtpSettings.lastTestError = errMsg;
    saveSmtpSettingsToDisk();

    return {
      success: false,
      message: `SMTP Connection Failed (${latencyMs}ms): ${errMsg}`,
      details: {
        host: runtimeSmtpSettings.host,
        port: runtimeSmtpSettings.port,
        error: errMsg,
        code: error.code,
        command: error.command
      }
    };
  }
}

// Build Official HTML Email Header & Layout Template for High Inbox Placement
function wrapEmailInModernTemplate(contentHtml: string, preheaderText = 'RECON Expo 2026 Secretariat Official Dispatch'): string {
  const fromName = runtimeSmtpSettings.fromName || 'RECON Expo 2026 Secretariat';
  const replyTo = runtimeSmtpSettings.replyTo || runtimeSmtpSettings.fromEmail || 'reconexpo@afrinetgroup.com';
  
  const headerLogoUrl = runtimeSmtpSettings.headerLogoUrl || 'https://www.afrinetgroup.com/recon-logo.svg';
  const headerTagline = runtimeSmtpSettings.headerTagline || '🏛️ 8TH REAL ESTATE & CONSTRUCTION EXPO 2026';
  const headerTitle = runtimeSmtpSettings.headerTitle || 'RECON EXPO ABUJA';
  const headerSubtitle = runtimeSmtpSettings.headerSubtitle || "October 29–31, 2026 • Shehu Musa Yar'Adua Centre, Abuja, Nigeria";
  
  const footerOrg = runtimeSmtpSettings.footerOrganization || fromName;
  const footerVenue = runtimeSmtpSettings.footerVenueAddress || "Shehu Musa Yar'Adua Centre, Memorial Drive, Central Business District, Abuja, FCT, Nigeria";
  const footerHotlines = runtimeSmtpSettings.footerHotlines || '+234 803 234 5678 | +234 802 987 6543';
  const footerEmail = runtimeSmtpSettings.footerOfficialEmail || replyTo;
  const footerWebsite = runtimeSmtpSettings.footerWebsite || 'https://www.afrinetgroup.com';
  const footerDisclaimer = runtimeSmtpSettings.footerDisclaimer || 'You are receiving this official communication because you registered for the 8th Real Estate & Construction Expo 2026. To manage your email preferences or update registration details, reply directly to this email or visit our secretariat portal.';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${headerTitle}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #021a14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; padding: 12px !important; }
      .mobile-stack { display: block !important; width: 100% !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #021a14; color: #e2e8f0;">
  <!-- Hidden Preheader Text for Email Inbox Preview -->
  <div style="display: none; font-size: 1px; color: #021a14; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${preheaderText} &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #021a14; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 24px 12px 40px 12px;">
        <!-- Email Container (600px max) -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #04241d; border-radius: 16px; border: 1px solid #10b981; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);" class="email-container">
          
          <!-- Top Brand Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #012a20 0%, #064e3b 100%); padding: 28px 24px; text-align: center; border-bottom: 2px solid #10b981;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background-color: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; border-radius: 9999px; padding: 6px 16px; margin-bottom: 10px;">
                      <span style="color: #34d399; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">
                        ${headerTagline}
                      </span>
                    </div>
                    <h1 style="color: #ffffff; font-size: 24px; font-weight: 900; margin: 0 0 6px 0; letter-spacing: -0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                      ${headerTitle}
                    </h1>
                    <p style="color: #a7f3d0; font-size: 13px; margin: 0; font-weight: 500;">
                      ${headerSubtitle}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Email Content Body -->
          <tr>
            <td style="padding: 32px 28px; background-color: #04241d; color: #e2e8f0; font-size: 15px; line-height: 1.6;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Official Venue & Secretariat Footer (CAN-SPAM Compliant) -->
          <tr>
            <td style="background-color: #021812; padding: 24px 28px; border-top: 1px solid #064e3b; text-align: center; color: #94a3b8; font-size: 12px; line-height: 1.6;">
              <p style="margin: 0 0 10px 0; color: #cbd5e1; font-weight: 700; font-size: 13px;">
                ${footerOrg}
              </p>
              <p style="margin: 0 0 6px 0;">
                📍 <strong>Official Venue:</strong> ${footerVenue}
              </p>
              <p style="margin: 0 0 12px 0;">
                📞 <strong>Hotlines &amp; Secretariat:</strong> ${footerHotlines}<br>
                ✉️ <strong>Official Inquiries:</strong> <a href="mailto:${footerEmail}" style="color: #34d399; text-decoration: none;">${footerEmail}</a> | 🌐 <a href="${footerWebsite}" style="color: #34d399; text-decoration: none;">${footerWebsite.replace(/^https?:\/\//, '')}</a>
              </p>
              
              <div style="border-top: 1px solid #0f382c; padding-top: 12px; margin-top: 12px; font-size: 11px; color: #64748b;">
                ${footerDisclaimer}
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Helper to attach BIMI, Mailbox Avatar, List-Unsubscribe, and deliverability headers
function buildDeliverabilityHeaders(referenceId: string, recipientEmail: string, customCategory?: string) {
  const logoUrl = runtimeSmtpSettings.headerLogoUrl || 'https://www.afrinetgroup.com/recon-logo.svg';
  const avatarUrl = 'https://www.afrinetgroup.com/email-mailbox-icon.svg';
  const replyTo = runtimeSmtpSettings.replyTo || runtimeSmtpSettings.fromEmail || 'reconexpo@afrinetgroup.com';
  const website = runtimeSmtpSettings.footerWebsite || 'https://reconexpo.afrinetgroup.com';
  const cleanWebsite = website.endsWith('/') ? website.slice(0, -1) : website;
  const encodedEmail = encodeURIComponent(recipientEmail.trim().toLowerCase());

  return {
    'X-Mailer': 'RECON-Expo-Engine/2026',
    'X-Entity-Ref-ID': referenceId,
    'List-Unsubscribe': `<mailto:${replyTo}?subject=unsubscribe&email=${encodedEmail}>, <${cleanWebsite}/unsubscribe?email=${encodedEmail}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    // Brand Indicators for Message Identification (BIMI) & Avatar Headers
    'BIMI-Selector': 'v=BIMI1; s=default;',
    'BIMI-Location': logoUrl,
    'X-Sender-Icon': logoUrl,
    'X-Company-Avatar': avatarUrl,
    'Sender-Avatar': logoUrl,
    'X-Brand-Logo': logoUrl,
    'X-Logo-Icon': logoUrl,
    'Precedence': 'bulk',
    'Feedback-ID': `RECON2026:${(customCategory || 'DIRECT').toUpperCase()}:AFRINET`,
    'Auto-Submitted': 'auto-generated',
    'X-Auto-Response-Suppress': 'OOF, AutoReply'
  };
}

// 1. Send Test Email with Handshake Diagnostics
export async function sendTestEmail(recipientEmail: string, customNote?: string): Promise<{ success: boolean; message: string; messageId?: string; details?: any }> {
  const targetEmail = (recipientEmail || runtimeSmtpSettings.user || 'integratedhubmail@gmail.com').trim();
  const startTime = Date.now();

  try {
    const transporter = createTransporter();
    const fromAddress = `"${runtimeSmtpSettings.fromName}" <${runtimeSmtpSettings.fromEmail || runtimeSmtpSettings.user}>`;

    const htmlContent = `
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="width: 56px; height: 56px; border-radius: 50%; background-color: rgba(16, 185, 129, 0.2); border: 2px solid #10b981; display: inline-flex; align-items: center; justify-content: center; font-size: 28px; line-height: 56px; margin: 0 auto 12px auto;">
          ✉️
        </div>
        <h2 style="color: #ffffff; font-size: 20px; font-weight: 800; margin: 0 0 6px 0;">
          SMTP Delivery Test Successful!
        </h2>
        <p style="color: #34d399; font-size: 14px; margin: 0; font-weight: 600;">
          100% Direct Inbox Verification Check
        </p>
      </div>

      <div style="background-color: #021a14; border: 1px solid #064e3b; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
        <h3 style="color: #ffffff; font-size: 14px; font-weight: 700; margin: 0 0 12px 0; border-bottom: 1px solid #064e3b; pb-2;">
          ⚙️ Active Server Parameters
        </h3>
        <table border="0" cellpadding="4" cellspacing="0" width="100%" style="font-size: 13px; color: #cbd5e1;">
          <tr>
            <td style="color: #94a3b8; width: 40%;">SMTP Host:</td>
            <td style="font-weight: 700; color: #ffffff; font-family: monospace;">${runtimeSmtpSettings.host}</td>
          </tr>
          <tr>
            <td style="color: #94a3b8;">Port / Encryption:</td>
            <td style="font-weight: 700; color: #ffffff; font-family: monospace;">${runtimeSmtpSettings.port} (${runtimeSmtpSettings.secure ? 'SSL/TLS' : 'STARTTLS'})</td>
          </tr>
          <tr>
            <td style="color: #94a3b8;">Authenticated User:</td>
            <td style="font-weight: 700; color: #34d399; font-family: monospace;">${runtimeSmtpSettings.user}</td>
          </tr>
          <tr>
            <td style="color: #94a3b8;">Sender Identity:</td>
            <td style="font-weight: 700; color: #ffffff;">${runtimeSmtpSettings.fromName} &lt;${runtimeSmtpSettings.fromEmail}&gt;</td>
          </tr>
          <tr>
            <td style="color: #94a3b8;">Mailbox Brand Icon / Logo:</td>
            <td style="font-weight: 700; color: #fbbf24; font-size: 11px; word-break: break-all;">${runtimeSmtpSettings.headerLogoUrl || 'Active (RECON Expo Official Logo)'}</td>
          </tr>
          <tr>
            <td style="color: #94a3b8;">Delivery Timestamp:</td>
            <td style="font-weight: 700; color: #ffffff;">${new Date().toUTCString()}</td>
          </tr>
        </table>
      </div>

      ${customNote ? `
      <div style="background-color: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 10px; padding: 14px; margin-bottom: 20px; color: #fef3c7; font-size: 13px;">
        <strong>Admin Note:</strong> ${customNote}
      </div>
      ` : ''}

      <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(4, 36, 29, 0.8) 100%); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 16px; text-align: center;">
        <p style="margin: 0; color: #a7f3d0; font-size: 13px; font-weight: 600;">
          ✅ Your email system is fully operational and configured for automated attendee ticket dispatches, payment receipts, and VIP delegate credentials.
        </p>
      </div>
    `;

    const fullHtml = wrapEmailInModernTemplate(htmlContent, '✅ RECON Expo 2026 SMTP Server Test Successful');
    const plainText = `RECON Expo 2026 SMTP Test Email\n\nYour SMTP server (${runtimeSmtpSettings.host}:${runtimeSmtpSettings.port}) is successfully connected and delivering emails.\n\nAuthenticated User: ${runtimeSmtpSettings.user}\nTimestamp: ${new Date().toISOString()}\n\nOfficial Secretariat: reconexpo@afrinetgroup.com`;

    const testRef = `TEST-${Date.now()}`;
    const mailOptions: SendMailOptions = {
      from: fromAddress,
      to: targetEmail,
      replyTo: runtimeSmtpSettings.replyTo || runtimeSmtpSettings.user,
      subject: `✅ [RECON 2026 Test] SMTP Email Server Verified (${new Date().toLocaleTimeString('en-GB')})`,
      text: plainText,
      html: fullHtml,
      headers: buildDeliverabilityHeaders(testRef, targetEmail, 'TEST')
    };

    const info = await transporter.sendMail(mailOptions);
    const latencyMs = Date.now() - startTime;

    // Record log
    const logItem: EmailLogItem = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      to: targetEmail,
      subject: mailOptions.subject as string,
      template: 'test_ping',
      status: 'delivered',
      sentAt: new Date().toISOString(),
      messageId: info.messageId,
      response: info.response
    };
    emailLogsStore.unshift(logItem);
    saveSmtpLogsToDisk();

    runtimeSmtpSettings.lastTestedAt = new Date().toISOString();
    runtimeSmtpSettings.lastTestStatus = 'success';
    runtimeSmtpSettings.lastTestError = undefined;
    saveSmtpSettingsToDisk();

    return {
      success: true,
      message: `Test email delivered successfully to ${targetEmail} in ${latencyMs}ms! (Message ID: ${info.messageId})`,
      messageId: info.messageId,
      details: {
        recipient: targetEmail,
        messageId: info.messageId,
        response: info.response,
        latencyMs
      }
    };
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    const errorMsg = err.message || 'Failed to dispatch test email.';

    const logItem: EmailLogItem = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      to: targetEmail,
      subject: `Test Email Dispatch to ${targetEmail}`,
      template: 'test_ping',
      status: 'failed',
      sentAt: new Date().toISOString(),
      error: errorMsg
    };
    emailLogsStore.unshift(logItem);
    saveSmtpLogsToDisk();

    runtimeSmtpSettings.lastTestedAt = new Date().toISOString();
    runtimeSmtpSettings.lastTestStatus = 'failed';
    runtimeSmtpSettings.lastTestError = errorMsg;
    saveSmtpSettingsToDisk();

    return {
      success: false,
      message: `Test email delivery failed (${latencyMs}ms): ${errorMsg}`,
      details: {
        error: errorMsg,
        code: err.code
      }
    };
  }
}

// 2. Automated Registration Confirmation & Digital Badge Email
export async function sendRegistrationConfirmationEmail(attendee: any): Promise<{ success: boolean; message: string; messageId?: string }> {
  if (!attendee || !attendee.email) {
    return { success: false, message: 'Invalid attendee: Email address is required.' };
  }

  try {
    const transporter = createTransporter();
    const fromAddress = `"${runtimeSmtpSettings.fromName}" <${runtimeSmtpSettings.fromEmail || runtimeSmtpSettings.user}>`;
    const attendeeName = attendee.fullName || 'Valued Delegate';
    const ticketNo = attendee.ticketNumber || `RECON26-${Date.now()}`;
    const tierName = (attendee.tier || attendee.passType || 'Visitor Pass').toUpperCase();
    const orgName = attendee.organization || 'Independent Professional';
    const isPaidPass = attendee.passType === 'elite' || attendee.passType === 'exhibitor' || attendee.passType === 'sponsor' || (attendee.amountPaid && attendee.amountPaid !== '₦0' && attendee.amountPaid !== 'Free');
    const isElitePass = attendee.passType === 'elite' || (attendee.tier || '').toLowerCase().includes('elite');
    const isApproved = attendee.adminApproved === true || attendee.adminApprovalStatus === 'APPROVED';
    const isPaymentCleared = attendee.paymentStatus === 'PAID' || attendee.paymentStatus === 'VERIFIED';
    const isUnpaidElite = isElitePass && (!isApproved || !isPaymentCleared);
    const paymentUrl = attendee.paymentUrl || attendee.flutterwaveLink || attendee.paymentLink || 'https://www.afrinetgroup.com/pay';
    const isDiscounted = attendee.isDiscounted === true || attendee.discountCode || attendee.hasDiscount === true;
    const paymentButtonText = isDiscounted 
      ? '💳 Pay Discounted Rate Online (₦20,000)' 
      : '💳 Pay Online & Complete Registration Pass';
    const paymentButtonBg = isDiscounted 
      ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
      : 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    const paymentButtonTextColor = isDiscounted ? '#022019' : '#ffffff';

    // QR Code visual generator url for email badge
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`RECON2026-PASS:${ticketNo}:${attendeeName}:${tierName}:${isUnpaidElite ? 'UNPAID' : 'CLEARED'}`)}&bgcolor=04241d&color=34d399&margin=6`;

    const htmlContent = isUnpaidElite ? `
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="display: inline-block; background-color: rgba(245, 158, 11, 0.2); border: 1px solid #f59e0b; border-radius: 9999px; padding: 5px 16px; font-size: 11px; font-weight: 800; color: #fbbf24; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 10px;">
          ⏳ REGISTRATION RECEIVED — PAYMENT UNPAID / PENDING APPROVAL
        </span>
        <h2 style="color: #ffffff; font-size: 22px; font-weight: 900; margin: 0 0 6px 0;">
          Welcome to RECON Expo 2026, ${attendeeName}!
        </h2>
        <p style="color: #fbbf24; font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">
          Status: Marked as UNPAID (Awaiting Payment Confirmation &amp; Admin Approval)
        </p>
        <p style="color: #94a3b8; font-size: 13px; margin: 0; line-height: 1.6;">
          Your Elite VIP Guest registration has been received and logged in the official secretariat records.
        </p>
      </div>

      <!-- DIGITAL SMART BADGE CARD (UNPAID NOTICE) -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(145deg, #1c1917 0%, #292524 100%); border: 2px solid #f59e0b; border-radius: 16px; overflow: hidden; margin-bottom: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
        <tr>
          <td style="padding: 18px 20px; background-color: #0c0a09; border-bottom: 1px solid #44403c;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td>
                  <span style="font-size: 10px; font-weight: 800; color: #fbbf24; letter-spacing: 1.5px; text-transform: uppercase;">
                    OFFICIAL ACCESS PASS TIER
                  </span>
                  <div style="font-size: 18px; font-weight: 900; color: #f59e0b; margin-top: 2px;">
                    ${tierName} (UNPAID)
                  </div>
                </td>
                <td align="right">
                  <span style="font-size: 10px; font-mono; color: #94a3b8; text-transform: uppercase;">Ticket Reference:</span>
                  <div style="font-size: 13px; font-weight: 800; color: #fbbf24; font-family: monospace;">
                    ${ticketNo}
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 24px 20px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td valign="middle" style="padding-right: 16px;">
                  <h3 style="color: #ffffff; font-size: 18px; font-weight: 800; margin: 0 0 4px 0;">
                    ${attendeeName}
                  </h3>
                  <p style="color: #cbd5e1; font-size: 13px; margin: 0 0 12px 0;">
                    🏢 ${orgName} ${attendee.role ? `• ${attendee.role}` : ''}
                  </p>
                  
                  <table border="0" cellpadding="2" cellspacing="0" style="font-size: 12px; color: #94a3b8;">
                    <tr>
                      <td style="padding-right: 8px;">📅 Dates:</td>
                      <td style="color: #ffffff; font-weight: 600;">Oct 29–31, 2026 (09:00 AM)</td>
                    </tr>
                    <tr>
                      <td style="padding-right: 8px;">📍 Venue:</td>
                      <td style="color: #ffffff; font-weight: 600;">Shehu Musa Yar'Adua Centre, Abuja</td>
                    </tr>
                    <tr>
                      <td style="padding-right: 8px;">💳 Payment:</td>
                      <td style="color: #f87171; font-weight: 800;">UNPAID / AWAITING ADMIN CONFIRMATION</td>
                    </tr>
                    <tr>
                      <td style="padding-right: 8px;">👑 VIP Pass:</td>
                      <td style="color: #fbbf24; font-weight: 700;">Locked until Admin approves payment</td>
                    </tr>
                  </table>
                </td>
                <td align="center" width="130" valign="middle">
                  <div style="background-color: #292524; border: 2px dashed #f59e0b; border-radius: 12px; padding: 10px; display: inline-block; text-align: center;">
                    <div style="font-size: 28px; margin-bottom: 4px;">⏳</div>
                    <div style="font-size: 9px; font-weight: 800; color: #fbbf24; text-transform: uppercase; font-family: monospace;">
                      PAYMENT PENDING
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- NEXT STEPS: PAYMENT & ADMIN APPROVAL NOTICE -->
      <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(30, 27, 75, 0.9) 100%); border: 1px solid #f59e0b; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <h4 style="color: #ffffff; font-size: 15px; font-weight: 800; margin: 0 0 10px 0;">
          ⚠️ Next Steps to Activate Your Full VIP Benefits:
        </h4>
        <p style="margin: 0 0 12px 0; color: #fde68a; font-size: 13px; line-height: 1.6;">
          Your registration is currently marked as <strong>UNPAID</strong>. As soon as the Admin Secretariat confirms and approves your payment, you will receive another official email confirming:
        </p>
        <ul style="margin: 0; padding-left: 20px; color: #cbd5e1; font-size: 13px; line-height: 1.7;">
          <li><strong>Fully Paid VIP Confirmation Email:</strong> Official payment receipt &amp; activated credentials.</li>
          <li><strong>All 10 Executive Benefits:</strong> VIP Lounge, Gala Dinner, Plenary Reserved Front Seating &amp; B2B Deal Rooms.</li>
          <li><strong>Gate Fast-Track Barcode / Smart Badge:</strong> Cleared for high-priority gate admission.</li>
        </ul>
      </div>

      <!-- DELEGATE PORTAL BUTTON -->
      <div style="text-align: center; margin-bottom: 12px;">
        <a href="https://reconexpo.afrinetgroup.com/" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #022019; font-size: 14px; font-weight: 800; padding: 14px 32px; border-radius: 12px; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(245,158,11,0.4);">
          Open Delegate Portal &amp; Verify Registration Status
        </a>
      </div>
    ` : `
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="display: inline-block; background-color: rgba(16, 185, 129, 0.2); border: 1px solid #10b981; border-radius: 9999px; padding: 4px 14px; font-size: 11px; font-weight: 800; color: #34d399; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 10px;">
          🎉 REGISTRATION CONFIRMED
        </span>
        <h2 style="color: #ffffff; font-size: 22px; font-weight: 900; margin: 0 0 6px 0;">
          Welcome to RECON Expo 2026, ${attendeeName}!
        </h2>
        <p style="color: #94a3b8; font-size: 14px; margin: 0;">
          Your official access pass for the 8th Real Estate &amp; Construction Expo has been issued.
        </p>
      </div>

      <!-- DIGITAL SMART BADGE CARD -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(145deg, #022019 0%, #03362a 100%); border: 2px solid #10b981; border-radius: 16px; overflow: hidden; margin-bottom: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
        <tr>
          <td style="padding: 20px; background-color: #011812; border-bottom: 1px solid #064e3b;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td>
                  <span style="font-size: 10px; font-weight: 800; color: #34d399; letter-spacing: 1.5px; text-transform: uppercase;">
                    OFFICIAL ACCESS PASS TIER
                  </span>
                  <div style="font-size: 18px; font-weight: 900; color: #f59e0b; margin-top: 2px;">
                    ${tierName}
                  </div>
                </td>
                <td align="right">
                  <span style="font-size: 10px; font-mono; color: #94a3b8; text-transform: uppercase;">Ticket Reference:</span>
                  <div style="font-size: 13px; font-weight: 800; color: #34d399; font-family: monospace;">
                    ${ticketNo}
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 24px 20px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td valign="middle" style="padding-right: 16px;">
                  <h3 style="color: #ffffff; font-size: 18px; font-weight: 800; margin: 0 0 4px 0;">
                    ${attendeeName}
                  </h3>
                  <p style="color: #cbd5e1; font-size: 13px; margin: 0 0 12px 0;">
                    🏢 ${orgName} ${attendee.role ? `• ${attendee.role}` : ''}
                  </p>
                  
                  <table border="0" cellpadding="2" cellspacing="0" style="font-size: 12px; color: #94a3b8;">
                    <tr>
                      <td style="padding-right: 8px;">📅 Dates:</td>
                      <td style="color: #ffffff; font-weight: 600;">Oct 29–31, 2026 (09:00 AM)</td>
                    </tr>
                    <tr>
                      <td style="padding-right: 8px;">📍 Venue:</td>
                      <td style="color: #ffffff; font-weight: 600;">Yar'Adua Centre, Abuja</td>
                    </tr>
                    <tr>
                      <td style="padding-right: 8px;">💳 Status:</td>
                      <td style="color: #34d399; font-weight: 800;">${isPaidPass ? 'VERIFIED &amp; CLEARED' : 'FREE ACCREDITED PASS'}</td>
                    </tr>
                  </table>
                </td>
                <td align="center" width="130" valign="middle">
                  <div style="background-color: #04241d; border: 2px solid #10b981; border-radius: 12px; padding: 8px; display: inline-block;">
                    <img src="${qrCodeUrl}" width="114" height="114" alt="Access QR Code" style="display: block; border-radius: 6px;" />
                    <div style="font-size: 9px; font-weight: 700; color: #34d399; margin-top: 4px; text-align: center; font-family: monospace;">
                      SCAN AT GATE
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- EVENT SCHEDULE HIGHLIGHTS -->
      <div style="background-color: #021a14; border: 1px solid #064e3b; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
        <h4 style="color: #ffffff; font-size: 14px; font-weight: 800; margin: 0 0 10px 0;">
          📋 Fast-Track Venue Entry Instructions:
        </h4>
        <ul style="margin: 0; padding-left: 20px; color: #cbd5e1; font-size: 13px; line-height: 1.7;">
          <li><strong>Digital Check-In:</strong> Present the QR Code on this email at the Expo Entrance Gate for instant badge printing and clearance.</li>
          <li><strong>Exhibition Halls:</strong> Over 150+ leading real estate developers, construction giants, and mortgage institutions.</li>
          <li><strong>Plenary Sessions:</strong> Ministerial Keynote Addresses, B2B Deal Rooms &amp; Green Construction Masterclasses start daily at 09:30 AM.</li>
        </ul>
      </div>

      <!-- CALL TO ACTION BUTTON -->
      <div style="text-align: center; margin-bottom: 12px;">
        <a href="https://reconexpo.afrinetgroup.com/" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #022019; font-size: 14px; font-weight: 800; padding: 14px 32px; border-radius: 12px; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(16,185,129,0.4);">
          Open Delegate Portal &amp; Download Badge
        </a>
      </div>
    `;

    const fullHtml = wrapEmailInModernTemplate(
      htmlContent, 
      isUnpaidElite 
        ? `⏳ Elite VIP Registration Received (UNPAID): ${attendeeName} (${ticketNo})` 
        : `🎟️ Your RECON Expo 2026 Pass: ${attendeeName} (${ticketNo})`
    );
    const plainText = isUnpaidElite
      ? `RECON Expo 2026 - Elite VIP Registration Received (UNPAID)\n\nDear ${attendeeName},\n\nYour registration for the Elite VIP Guest Pass is received and marked as UNPAID.\n\nTicket Number: ${ticketNo}\nPass Tier: ${tierName}\nStatus: UNPAID / Pending Admin Confirmation\n\nOnce Secretariat confirms your payment, a full payment confirmation email with all 10 VIP benefits and your cleared badge will be sent.\n\nOrganizing Secretariat: reconexpo@afrinetgroup.com | +234 803 234 5678`
      : `RECON Expo 2026 - Registration Confirmation\n\nDear ${attendeeName},\n\nYour registration for the 8th Real Estate & Construction Expo 2026 is confirmed.\n\nTicket Number: ${ticketNo}\nPass Tier: ${tierName}\nOrganization: ${orgName}\nDates: October 29–31, 2026\nVenue: Shehu Musa Yar'Adua Centre, Central Business District, Abuja, Nigeria\n\nPlease present this ticket reference or QR Code at the registration desk for fast-track badge collection.\n\nOrganizing Secretariat: reconexpo@afrinetgroup.com | +234 803 234 5678`;

    const mailOptions: SendMailOptions = {
      from: fromAddress,
      to: attendee.email,
      replyTo: runtimeSmtpSettings.replyTo || runtimeSmtpSettings.user,
      bcc: runtimeSmtpSettings.bccAdmin || undefined,
      subject: isUnpaidElite 
        ? `⏳ RECON Expo 2026: Elite VIP Registration Received (UNPAID / Pending Admin Approval) — ${attendeeName} [${ticketNo}]`
        : `🎟️ RECON Expo 2026 Official Pass Confirmation: ${attendeeName} [${ticketNo}]`,
      text: plainText,
      html: fullHtml,
      headers: buildDeliverabilityHeaders(ticketNo, attendee.email, attendee.passType || 'BADGE')
    };

    const info = await transporter.sendMail(mailOptions);

    const logItem: EmailLogItem = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      to: attendee.email,
      toName: attendeeName,
      subject: mailOptions.subject as string,
      template: 'registration_badge',
      status: 'delivered',
      category: attendee.passType || attendee.tier || 'Visitor',
      ticketNumber: ticketNo,
      sentAt: new Date().toISOString(),
      messageId: info.messageId,
      response: info.response,
      payloadSnapshot: { ticketNo, attendeeName, tierName, email: attendee.email }
    };
    emailLogsStore.unshift(logItem);
    saveSmtpLogsToDisk();

    return {
      success: true,
      message: `Registration badge email dispatched successfully to ${attendee.email}`,
      messageId: info.messageId
    };
  } catch (err: any) {
    const errorMsg = err.message || 'Failed to dispatch registration email.';
    const logItem: EmailLogItem = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      to: attendee.email,
      toName: attendee.fullName,
      subject: `Pass Dispatch: ${attendee.fullName}`,
      template: 'registration_badge',
      status: 'failed',
      category: attendee.passType,
      ticketNumber: attendee.ticketNumber,
      sentAt: new Date().toISOString(),
      error: errorMsg
    };
    emailLogsStore.unshift(logItem);
    saveSmtpLogsToDisk();

    return { success: false, message: `Registration email failed: ${errorMsg}` };
  }
}

// 3. Payment Receipt & VIP Clearance Dispatch Email
export async function sendPaymentReceiptEmail(attendee: any, transaction: any): Promise<{ success: boolean; message: string; messageId?: string }> {
  const recipientEmail = attendee?.email || transaction?.customer?.email;
  if (!recipientEmail) {
    return { success: false, message: 'Invalid recipient email.' };
  }

  try {
    const transporter = createTransporter();
    const fromAddress = `"${runtimeSmtpSettings.fromName}" <${runtimeSmtpSettings.fromEmail || runtimeSmtpSettings.user}>`;
    const attendeeName = attendee?.fullName || transaction?.customer?.name || 'Corporate Delegate';
    const amountFormatted = transaction?.amount ? `₦${Number(transaction.amount).toLocaleString()}` : (attendee?.amountPaid || '₦20,000');
    const txRef = transaction?.tx_ref || attendee?.paymentRef || `RECON26-FLW-${Date.now()}`;
    const flwRef = transaction?.flw_ref || `FLW-${Date.now()}`;
    const passTier = (attendee?.tier || attendee?.passType || transaction?.passType || 'Elite VIP Pass').toUpperCase();
    const ticketNo = attendee?.ticketNumber || txRef;
    const isElite = passTier.includes('ELITE') || (attendee?.passType || '').toLowerCase() === 'elite';

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`RECON2026-VIP-CLEARED:${ticketNo}:${attendeeName}:PAID`)}&bgcolor=04241d&color=34d399&margin=6`;

    const htmlContent = `
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="display: inline-block; background-color: rgba(16, 185, 129, 0.2); border: 1px solid #10b981; border-radius: 9999px; padding: 5px 18px; font-size: 11px; font-weight: 800; color: #34d399; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 10px;">
          👑 PAYMENT CONFIRMED &amp; APPROVED
        </span>
        <h2 style="color: #ffffff; font-size: 24px; font-weight: 900; margin: 0 0 6px 0;">
          Payment Verified: Fully Paid VIP Pass Active!
        </h2>
        <p style="color: #cbd5e1; font-size: 14px; margin: 0 0 4px 0;">
          Distinguished Delegate <strong>${attendeeName}</strong>, your payment has been confirmed by the Organizing Secretariat.
        </p>
        <p style="color: #34d399; font-size: 13px; font-weight: 700; margin: 0;">
          Status: FULLY PAID &amp; ACCREDITED (ALL 10 VIP BENEFITS ACTIVATED)
        </p>
      </div>

      <!-- CLEARED SMART BADGE CARD -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(145deg, #012a20 0%, #034b3b 100%); border: 2px solid #d4af37; border-radius: 16px; overflow: hidden; margin-bottom: 24px; box-shadow: 0 12px 30px rgba(0,0,0,0.6);">
        <tr>
          <td style="padding: 18px 20px; background-color: #011d16; border-bottom: 1px solid #064e3b;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td>
                  <span style="font-size: 10px; font-weight: 800; color: #d4af37; letter-spacing: 1.5px; text-transform: uppercase;">
                    OFFICIAL ACCESS STATUS
                  </span>
                  <div style="font-size: 18px; font-weight: 900; color: #facc15; margin-top: 2px;">
                    ${passTier} — FULLY PAID
                  </div>
                </td>
                <td align="right">
                  <span style="font-size: 10px; font-mono; color: #94a3b8; text-transform: uppercase;">Ticket Reference:</span>
                  <div style="font-size: 13px; font-weight: 800; color: #34d399; font-family: monospace;">
                    ${ticketNo}
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 24px 20px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td valign="middle" style="padding-right: 16px;">
                  <h3 style="color: #ffffff; font-size: 18px; font-weight: 800; margin: 0 0 4px 0;">
                    ${attendeeName}
                  </h3>
                  <p style="color: #cbd5e1; font-size: 13px; margin: 0 0 12px 0;">
                    🏢 ${attendee?.organization || 'Distinguished Delegate'} ${attendee?.role ? `• ${attendee.role}` : ''}
                  </p>
                  
                  <table border="0" cellpadding="2" cellspacing="0" style="font-size: 12px; color: #94a3b8;">
                    <tr>
                      <td style="padding-right: 8px;">📅 Dates:</td>
                      <td style="color: #ffffff; font-weight: 600;">Oct 29–31, 2026 (09:00 AM)</td>
                    </tr>
                    <tr>
                      <td style="padding-right: 8px;">📍 Venue:</td>
                      <td style="color: #ffffff; font-weight: 600;">Shehu Musa Yar'Adua Centre, Abuja</td>
                    </tr>
                    <tr>
                      <td style="padding-right: 8px;">💳 Payment Status:</td>
                      <td style="color: #34d399; font-weight: 900;">FULLY PAID (₦${amountFormatted.replace(/[^0-9,]/g, '') || '25,000'})</td>
                    </tr>
                    <tr>
                      <td style="padding-right: 8px;">🛡️ Approval:</td>
                      <td style="color: #facc15; font-weight: 800;">ADMIN CONFIRMED &amp; APPROVED</td>
                    </tr>
                  </table>
                </td>
                <td align="center" width="130" valign="middle">
                  <div style="background-color: #011d16; border: 2px solid #d4af37; border-radius: 12px; padding: 8px; display: inline-block;">
                    <img src="${qrCodeUrl}" width="114" height="114" alt="VIP Cleared QR Code" style="display: block; border-radius: 6px;" />
                    <div style="font-size: 9px; font-weight: 800; color: #d4af37; margin-top: 4px; text-align: center; font-family: monospace;">
                      VIP FAST-TRACK
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- FULL 10 VIP PRIVILEGES UNLOCKED -->
      <div style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(1, 34, 25, 0.95) 100%); border: 1px solid #d4af37; border-radius: 14px; padding: 20px; margin-bottom: 24px;">
        <h4 style="color: #facc15; font-size: 15px; font-weight: 800; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px;">
          👑 Full Executive VIP Benefits Activated:
        </h4>
        <table border="0" cellpadding="4" cellspacing="0" width="100%" style="font-size: 12px; color: #e2e8f0; line-height: 1.5;">
          <tr>
            <td width="24" valign="top">👑</td>
            <td><strong>Fast-Track Priority Entry:</strong> Dedicated VIP red-carpet gate registration clearance without queues.</td>
          </tr>
          <tr>
            <td valign="top">👑</td>
            <td><strong>Plenary Reserved Front-Row Seating:</strong> Reserved front executive seating for all keynote plenary sessions.</td>
          </tr>
          <tr>
            <td valign="top">👑</td>
            <td><strong>Exclusive VIP Lounge:</strong> Full access to private executive air-conditioned lounge with continuous refreshments.</td>
          </tr>
          <tr>
            <td valign="top">👑</td>
            <td><strong>Official Gala Dinner &amp; Cocktail:</strong> VIP admission ticket to the RECON Gala Dinner &amp; Excellence Awards night.</td>
          </tr>
          <tr>
            <td valign="top">👑</td>
            <td><strong>B2B Deal Rooms &amp; Investor Matchmaking:</strong> Facilitated closed-door introductions to developers &amp; financiers.</td>
          </tr>
          <tr>
            <td valign="top">👑</td>
            <td><strong>Ministerial Keynote &amp; Policy Roundtables:</strong> High-level executive briefings with federal authorities.</td>
          </tr>
          <tr>
            <td valign="top">👑</td>
            <td><strong>CPD Masterclass Priority Seating:</strong> Guaranteed admission to CPD-accredited technical masterclasses.</td>
          </tr>
          <tr>
            <td valign="top">👑</td>
            <td><strong>Deluxe Executive Delegate Kit:</strong> Official branded exhibition directory, VIP badge, and executive pack.</td>
          </tr>
          <tr>
            <td valign="top">👑</td>
            <td><strong>Executive VIP Certificate:</strong> Official embossed Certificate of Attendance issued by the Secretariat.</td>
          </tr>
          <tr>
            <td valign="top">👑</td>
            <td><strong>Smart Digital Credentials:</strong> Permanent digital badge with encrypted QR code and fast-track clearance.</td>
          </tr>
        </table>
      </div>

      <!-- RECEIPT SUMMARY BOX -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #021a14; border: 1px solid #064e3b; border-radius: 14px; overflow: hidden; margin-bottom: 24px;">
        <tr>
          <td style="padding: 14px 20px; background-color: #011812; border-bottom: 1px solid #064e3b;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="font-size: 12px; font-weight: 800; color: #34d399; text-transform: uppercase;">
                  PAYMENT SETTLEMENT SUMMARY
                </td>
                <td align="right" style="font-size: 11px; color: #94a3b8; font-family: monospace;">
                  ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 18px 20px;">
            <table border="0" cellpadding="4" cellspacing="0" width="100%" style="font-size: 12px; color: #cbd5e1;">
              <tr>
                <td style="color: #94a3b8; width: 45%;">Package Tier:</td>
                <td style="font-weight: 800; color: #ffffff;">${passTier}</td>
              </tr>
              <tr>
                <td style="color: #94a3b8;">Amount Cleared:</td>
                <td style="font-weight: 900; color: #34d399; font-size: 15px; font-family: monospace;">${amountFormatted}</td>
              </tr>
              <tr>
                <td style="color: #94a3b8;">Transaction Reference:</td>
                <td style="font-family: monospace; color: #fbbf24;">${txRef}</td>
              </tr>
              <tr>
                <td style="color: #94a3b8;">Payment Clearance:</td>
                <td style="color: #34d399; font-weight: bold;">Verified &amp; Cleared by Secretariat</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- CALL TO ACTION BUTTON -->
      <div style="text-align: center; margin-bottom: 12px;">
        <a href="https://reconexpo.afrinetgroup.com/" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #022019; font-size: 14px; font-weight: 900; padding: 14px 32px; border-radius: 12px; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(16,185,129,0.4);">
          Open Delegate Portal &amp; Download VIP Pass
        </a>
      </div>
    `;

    const fullHtml = wrapEmailInModernTemplate(
      htmlContent, 
      `👑 PAYMENT CONFIRMED: Fully Paid Elite VIP Registration (${ticketNo})`
    );
    const plainText = `RECON Expo 2026 - Payment Confirmation & Full VIP Benefits Activated\n\nDear ${attendeeName},\n\nYour payment for the ${passTier} is confirmed and approved by the Organizing Secretariat.\n\nTicket Number: ${ticketNo}\nAmount Cleared: ${amountFormatted}\nTransaction Ref: ${txRef}\nStatus: FULLY PAID & APPROVED\n\nAll 10 VIP benefits including Fast-Track Entry, Plenary Reserved Seating, VIP Lounge, Gala Dinner, and B2B Deal Rooms are active.\n\nSecretariat: reconexpo@afrinetgroup.com | +234 803 234 5678`;

    const mailOptions: SendMailOptions = {
      from: fromAddress,
      to: recipientEmail,
      replyTo: runtimeSmtpSettings.replyTo || runtimeSmtpSettings.user,
      bcc: runtimeSmtpSettings.bccAdmin || undefined,
      subject: `👑 PAYMENT CONFIRMED: Fully Paid Elite VIP Registration & Benefits Activated — ${attendeeName} [${ticketNo}]`,
      text: plainText,
      html: fullHtml,
      headers: buildDeliverabilityHeaders(txRef, recipientEmail, 'PAYMENT_CONFIRMED')
    };

    const info = await transporter.sendMail(mailOptions);

    const logItem: EmailLogItem = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      to: recipientEmail,
      toName: attendeeName,
      subject: mailOptions.subject as string,
      template: 'payment_receipt',
      status: 'delivered',
      category: passTier,
      ticketNumber: attendee?.ticketNumber || txRef,
      sentAt: new Date().toISOString(),
      messageId: info.messageId,
      response: info.response,
      payloadSnapshot: { txRef, amountFormatted, attendeeName }
    };
    emailLogsStore.unshift(logItem);
    saveSmtpLogsToDisk();

    return {
      success: true,
      message: `Payment receipt email dispatched to ${recipientEmail}`,
      messageId: info.messageId
    };
  } catch (err: any) {
    const errorMsg = err.message || 'Failed to dispatch payment receipt.';
    const logItem: EmailLogItem = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      to: recipientEmail,
      subject: `Payment Receipt: ${transaction?.tx_ref}`,
      template: 'payment_receipt',
      status: 'failed',
      sentAt: new Date().toISOString(),
      error: errorMsg
    };
    emailLogsStore.unshift(logItem);
    saveSmtpLogsToDisk();

    return { success: false, message: `Payment receipt email failed: ${errorMsg}` };
  }
}

// 4. Custom Broadcast & Announcement Mailer (With Dynamic Personalization Tags)
export async function sendBroadcastEmail(payload: {
  recipients: Array<{ email: string; fullName?: string; organization?: string; ticketNumber?: string; category?: string }>;
  subject: string;
  preheader?: string;
  bodyContent: string;
  categoryTag?: string;
}): Promise<{ success: boolean; deliveredCount: number; failedCount: number; errors: string[] }> {
  const { recipients, subject, preheader, bodyContent, categoryTag } = payload;
  if (!Array.isArray(recipients) || recipients.length === 0) {
    return { success: false, deliveredCount: 0, failedCount: 0, errors: ['No recipients specified.'] };
  }

  let deliveredCount = 0;
  let failedCount = 0;
  const errors: string[] = [];

  const transporter = createTransporter();
  const fromAddress = `"${runtimeSmtpSettings.fromName}" <${runtimeSmtpSettings.fromEmail || runtimeSmtpSettings.user}>`;

  for (const recipient of recipients) {
    if (!recipient.email || !recipient.email.includes('@')) {
      failedCount++;
      continue;
    }

    const recName = recipient.fullName || 'Valued Delegate';
    const recOrg = recipient.organization || 'Independent Professional';
    const recTicket = recipient.ticketNumber || 'RECON26-VIP';
    const recCat = recipient.category || 'Attendee';

    // Anti-spam Policy & Deliverability Check: Filter out unsubscribed recipients
    if (isEmailUnsubscribed(recipient.email)) {
      failedCount++;
      errors.push(`${recipient.email}: Skipped - Email has opted-out / unsubscribed.`);
      emailLogsStore.unshift({
        id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        to: recipient.email,
        toName: recName,
        subject: subject,
        template: 'broadcast',
        status: 'failed',
        category: recCat,
        ticketNumber: recTicket,
        sentAt: new Date().toISOString(),
        error: 'Skipped: Recipient has unsubscribed from RECON marketing communications.'
      });
      continue;
    }

    // Replace dynamic placeholders in subject and body
    const personalizedSubject = subject
      .replace(/{name}/gi, recName)
      .replace(/{ticket}/gi, recTicket)
      .replace(/{organization}/gi, recOrg)
      .replace(/{category}/gi, recCat);

    let personalizedHtmlBody = bodyContent
      .replace(/{name}/gi, recName)
      .replace(/{ticket}/gi, recTicket)
      .replace(/{organization}/gi, recOrg)
      .replace(/{category}/gi, recCat);

    // Convert newlines to breaks if raw text
    if (!personalizedHtmlBody.includes('<p>') && !personalizedHtmlBody.includes('<div>')) {
      personalizedHtmlBody = personalizedHtmlBody.split('\n').map(line => `<p style="margin: 0 0 12px 0;">${line}</p>`).join('');
    }

    const fullHtml = wrapEmailInModernTemplate(personalizedHtmlBody, preheader || subject);
    const plainText = `${personalizedSubject}\n\nDear ${recName},\n\n${bodyContent.replace(/<[^>]*>?/gm, '')}\n\nRECON Expo 2026 Secretariat\nreconexpo@afrinetgroup.com`;

    try {
      const mailOptions: SendMailOptions = {
        from: fromAddress,
        to: recipient.email,
        replyTo: runtimeSmtpSettings.replyTo || runtimeSmtpSettings.user,
        subject: personalizedSubject,
        text: plainText,
        html: fullHtml,
        headers: buildDeliverabilityHeaders(recTicket, recipient.email, categoryTag || 'BROADCAST')
      };

      const info = await transporter.sendMail(mailOptions);
      deliveredCount++;

      emailLogsStore.unshift({
        id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        to: recipient.email,
        toName: recName,
        subject: personalizedSubject,
        template: 'broadcast',
        status: 'delivered',
        category: recCat,
        ticketNumber: recTicket,
        sentAt: new Date().toISOString(),
        messageId: info.messageId
      });
    } catch (sendErr: any) {
      failedCount++;
      const errMsg = sendErr.message || 'Delivery error';
      errors.push(`${recipient.email}: ${errMsg}`);

      emailLogsStore.unshift({
        id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        to: recipient.email,
        toName: recName,
        subject: personalizedSubject,
        template: 'broadcast',
        status: 'failed',
        category: recCat,
        ticketNumber: recTicket,
        sentAt: new Date().toISOString(),
        error: errMsg
      });
    }
  }

  saveSmtpLogsToDisk();

  return {
    success: deliveredCount > 0,
    deliveredCount,
    failedCount,
    errors
  };
}

// 5. Get and Clear Logs
export function getEmailLogs(): EmailLogItem[] {
  return emailLogsStore;
}

export function clearEmailLogs(): void {
  emailLogsStore = [];
  saveSmtpLogsToDisk();
}

export function deleteEmailLog(logId: string): boolean {
  const initialLength = emailLogsStore.length;
  emailLogsStore = emailLogsStore.filter(l => l.id !== logId);
  if (emailLogsStore.length < initialLength) {
    saveSmtpLogsToDisk();
    return true;
  }
  return false;
}

export async function resendLoggedEmail(logId: string): Promise<{ success: boolean; message: string }> {
  const item = emailLogsStore.find(l => l.id === logId);
  if (!item) {
    return { success: false, message: 'Log item not found.' };
  }

  return sendTestEmail(item.to, `Resend of subject: "${item.subject}"`);
}

// Helper to convert HTML to clean plain text for Multi-Part MIME alternative
function stripHtmlToPlainText(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '$2 ($1)')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// 6. Direct HTML Campaign Dispatcher
export async function sendCustomHtmlCampaign(payload: {
  recipients: Array<{ email: string; fullName?: string; organization?: string; ticketNumber?: string; category?: string; booth?: string }>;
  subject: string;
  preheader?: string;
  customHtml: string;
  campaignTitle?: string;
}): Promise<{ success: boolean; deliveredCount: number; failedCount: number; errors: string[] }> {
  const transporter = createTransporter();
  const fromAddress = `"${runtimeSmtpSettings.fromName}" <${runtimeSmtpSettings.fromEmail}>`;
  const domain = runtimeSmtpSettings.dkimDomain || 'afrinetgroup.com';

  let deliveredCount = 0;
  let failedCount = 0;
  const errors: string[] = [];

  for (const recipient of payload.recipients) {
    if (!recipient.email) continue;

    const recName = recipient.fullName || 'Distinguished Delegate';
    const recTicket = recipient.ticketNumber || 'RECON-2026-TKT';
    const recOrg = recipient.organization || 'Corporate Delegate';
    const recCat = recipient.category || 'Attendee';
    const recBooth = recipient.booth || 'Main Hall';

    // Anti-spam Policy & Deliverability Check: Filter out unsubscribed recipients
    if (isEmailUnsubscribed(recipient.email)) {
      failedCount++;
      errors.push(`${recipient.email}: Skipped - Email has opted-out / unsubscribed.`);
      emailLogsStore.unshift({
        id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        to: recipient.email,
        toName: recName,
        subject: payload.subject,
        template: 'broadcast',
        status: 'failed',
        category: recCat,
        ticketNumber: recTicket,
        sentAt: new Date().toISOString(),
        error: 'Skipped: Recipient has unsubscribed from RECON marketing communications.'
      });
      continue;
    }

    let personalizedSubject = payload.subject
      .replace(/{name}/gi, recName)
      .replace(/{ticket}/gi, recTicket)
      .replace(/{category}/gi, recCat)
      .replace(/{company}/gi, recOrg)
      .replace(/{booth}/gi, recBooth);

    let personalizedHtml = payload.customHtml
      .replace(/{name}/gi, recName)
      .replace(/{email}/gi, recipient.email)
      .replace(/{ticket}/gi, recTicket)
      .replace(/{category}/gi, recCat)
      .replace(/{company}/gi, recOrg)
      .replace(/{booth}/gi, recBooth);

    const plainText = stripHtmlToPlainText(personalizedHtml);

    try {
      const cmpRef = `cmp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const mailOptions: SendMailOptions = {
        from: fromAddress,
        to: recipient.email,
        sender: runtimeSmtpSettings.fromEmail || runtimeSmtpSettings.user,
        replyTo: runtimeSmtpSettings.replyTo || runtimeSmtpSettings.user,
        subject: personalizedSubject,
        text: plainText,
        html: personalizedHtml,
        messageId: `<${Date.now()}.${Math.random().toString(36).substring(2, 9)}@${domain}>`,
        date: new Date(),
        headers: buildDeliverabilityHeaders(cmpRef, recipient.email, payload.campaignTitle || 'CAMPAIGN')
      };

      const info = await transporter.sendMail(mailOptions);
      deliveredCount++;

      emailLogsStore.unshift({
        id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        to: recipient.email,
        toName: recName,
        subject: personalizedSubject,
        template: 'broadcast',
        status: 'delivered',
        category: recCat,
        ticketNumber: recTicket,
        sentAt: new Date().toISOString(),
        messageId: info.messageId
      });
    } catch (sendErr: any) {
      failedCount++;
      const errMsg = sendErr.message || 'Delivery failed';
      errors.push(`${recipient.email}: ${errMsg}`);

      emailLogsStore.unshift({
        id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        to: recipient.email,
        toName: recName,
        subject: personalizedSubject,
        template: 'broadcast',
        status: 'failed',
        category: recCat,
        ticketNumber: recTicket,
        sentAt: new Date().toISOString(),
        error: errMsg
      });
    }
  }

  saveSmtpLogsToDisk();

  return {
    success: deliveredCount > 0,
    deliveredCount,
    failedCount,
    errors
  };
}

// 7. Dedicated Visitor (FREE) -> Elite VIP Upgrade Drip Mail Dispatcher
export async function sendVisitorUpgradeDripMail(payload: {
  recipient: { email: string; fullName?: string; organization?: string; ticketNumber?: string; phone?: string };
  step: {
    id: string;
    dayNumber: number;
    title: string;
    badge: string;
    subject: string;
    preheader: string;
    benefitFocus: string;
    vipBenefitList: string[];
    bodyContent: string;
    callToActionText: string;
    callToActionUrl: string;
    imageUrl?: string;
    imageAlt?: string;
  };
  htmlBody: string;
}): Promise<{ success: boolean; message: string; messageId?: string }> {
  const transporter = createTransporter();
  const fromAddress = `"${runtimeSmtpSettings.fromName}" <${runtimeSmtpSettings.fromEmail}>`;
  const domain = runtimeSmtpSettings.dkimDomain || 'afrinetgroup.com';

  const recName = payload.recipient.fullName || 'Distinguished Visitor';
  const recTicket = payload.recipient.ticketNumber || 'RECON-2026-VIS-TKT';
  const recEmail = payload.recipient.email;

  let personalizedSubject = payload.step.subject
    .replace(/{name}/gi, recName)
    .replace(/{ticket}/gi, recTicket)
    .replace(/{email}/gi, recEmail)
    .replace(/{discount_price}/gi, '₦20,000');

  // Anti-spam Policy & Deliverability Check: Filter out unsubscribed recipients
  if (isEmailUnsubscribed(recEmail)) {
    emailLogsStore.unshift({
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      to: recEmail,
      toName: recName,
      subject: personalizedSubject,
      template: 'visitor_vip_drip',
      status: 'failed',
      category: 'Visitor (Free Access)',
      ticketNumber: recTicket,
      sentAt: new Date().toISOString(),
      error: 'Skipped: Recipient has unsubscribed from RECON marketing communications.'
    });
    saveSmtpLogsToDisk();
    return {
      success: false,
      message: `Skipped delivery to ${recEmail}: recipient is globally unsubscribed.`
    };
  }

  let personalizedHtml = payload.htmlBody
    .replace(/{name}/gi, recName)
    .replace(/{ticket}/gi, recTicket)
    .replace(/{email}/gi, recEmail)
    .replace(/{discount_price}/gi, '₦20,000');

  const plainText = stripHtmlToPlainText(personalizedHtml);

  try {
    const dripRef = `drip_${payload.step.id}_${Date.now()}`;
    const mailOptions: SendMailOptions = {
      from: fromAddress,
      to: recEmail,
      sender: runtimeSmtpSettings.fromEmail || runtimeSmtpSettings.user,
      replyTo: runtimeSmtpSettings.replyTo || runtimeSmtpSettings.user,
      subject: personalizedSubject,
      text: plainText,
      html: personalizedHtml,
      messageId: `<${Date.now()}.${Math.random().toString(36).substring(2, 9)}@${domain}>`,
      date: new Date(),
      headers: buildDeliverabilityHeaders(dripRef, recEmail, 'VISITOR_VIP_UPGRADE')
    };

    const info = await transporter.sendMail(mailOptions);

    emailLogsStore.unshift({
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      to: recEmail,
      toName: recName,
      subject: personalizedSubject,
      template: 'visitor_vip_drip',
      status: 'delivered',
      category: 'Visitor (Free Access)',
      ticketNumber: recTicket,
      sentAt: new Date().toISOString(),
      messageId: info.messageId
    });

    saveSmtpLogsToDisk();

    return {
      success: true,
      message: `Visitor VIP Upgrade email (${payload.step.badge}) delivered to ${recEmail}`,
      messageId: info.messageId
    };
  } catch (err: any) {
    const errMsg = err.message || 'SMTP delivery failed';

    emailLogsStore.unshift({
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      to: recEmail,
      toName: recName,
      subject: personalizedSubject,
      template: 'visitor_vip_drip',
      status: 'failed',
      category: 'Visitor (Free Access)',
      ticketNumber: recTicket,
      sentAt: new Date().toISOString(),
      error: errMsg
    });

    saveSmtpLogsToDisk();

    return {
      success: false,
      message: `Failed sending to ${recEmail}: ${errMsg}`
    };
  }
}

// 8. Dedicated Unconfirmed / Abandoned Elite VIP Payment Recovery Mail Dispatcher
export async function sendUnconfirmedVipRecoveryMail(payload: {
  recipient: { email: string; fullName?: string; organization?: string; ticketNumber?: string; phone?: string; amountDue?: string };
  step: {
    id: string;
    dayNumber: number;
    title: string;
    badge: string;
    subject: string;
    preheader: string;
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
    vipBenefitFocus: string;
    vipBenefitsList: string[];
    bodyContent: string;
    paymentButtonText: string;
    paymentButtonUrl: string;
    alternateBankTransferText?: string;
    imageUrl?: string;
    imageAlt?: string;
  };
  htmlBody: string;
}): Promise<{ success: boolean; message: string; messageId?: string }> {
  const transporter = createTransporter();
  const fromAddress = `"${runtimeSmtpSettings.fromName}" <${runtimeSmtpSettings.fromEmail}>`;
  const domain = runtimeSmtpSettings.dkimDomain || 'afrinetgroup.com';

  const recName = payload.recipient.fullName || 'Distinguished VIP Guest';
  const recTicket = payload.recipient.ticketNumber || 'RECON-2026-VIP-TKT';
  const recEmail = payload.recipient.email;
  const recAmount = payload.recipient.amountDue || '₦25,000 ($25)';

  let personalizedSubject = payload.step.subject
    .replace(/{name}/gi, recName)
    .replace(/{ticket}/gi, recTicket)
    .replace(/{email}/gi, recEmail)
    .replace(/{amount_due}/gi, recAmount);

  // Anti-spam Policy & Deliverability Check: Filter out unsubscribed recipients
  if (isEmailUnsubscribed(recEmail)) {
    emailLogsStore.unshift({
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      to: recEmail,
      toName: recName,
      subject: personalizedSubject,
      template: 'unconfirmed_vip_recovery',
      status: 'failed',
      category: 'Elite Guest (Pending Payment)',
      ticketNumber: recTicket,
      sentAt: new Date().toISOString(),
      error: 'Skipped: Recipient has unsubscribed from RECON marketing communications.'
    });
    saveSmtpLogsToDisk();
    return {
      success: false,
      message: `Skipped delivery to ${recEmail}: recipient is globally unsubscribed.`
    };
  }

  let personalizedHtml = payload.htmlBody
    .replace(/{name}/gi, recName)
    .replace(/{ticket}/gi, recTicket)
    .replace(/{email}/gi, recEmail)
    .replace(/{amount_due}/gi, recAmount);

  const plainText = stripHtmlToPlainText(personalizedHtml);

  try {
    const recoveryRef = `recovery_${payload.step.id}_${Date.now()}`;
    const mailOptions: SendMailOptions = {
      from: fromAddress,
      to: recEmail,
      sender: runtimeSmtpSettings.fromEmail || runtimeSmtpSettings.user,
      replyTo: runtimeSmtpSettings.replyTo || runtimeSmtpSettings.user,
      subject: personalizedSubject,
      text: plainText,
      html: personalizedHtml,
      messageId: `<${Date.now()}.${Math.random().toString(36).substring(2, 9)}@${domain}>`,
      date: new Date(),
      headers: buildDeliverabilityHeaders(recoveryRef, recEmail, 'VIP_PAYMENT_RECOVERY')
    };

    const info = await transporter.sendMail(mailOptions);

    emailLogsStore.unshift({
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      to: recEmail,
      toName: recName,
      subject: personalizedSubject,
      template: 'unconfirmed_vip_recovery',
      status: 'delivered',
      category: 'Elite Guest (Pending Payment)',
      ticketNumber: recTicket,
      sentAt: new Date().toISOString(),
      messageId: info.messageId
    });

    saveSmtpLogsToDisk();

    return {
      success: true,
      message: `Unconfirmed VIP Payment Recovery email (${payload.step.badge}) delivered to ${recEmail}`,
      messageId: info.messageId
    };
  } catch (err: any) {
    const errMsg = err.message || 'SMTP delivery failed';

    emailLogsStore.unshift({
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      to: recEmail,
      toName: recName,
      subject: personalizedSubject,
      template: 'unconfirmed_vip_recovery',
      status: 'failed',
      category: 'Elite Guest (Pending Payment)',
      ticketNumber: recTicket,
      sentAt: new Date().toISOString(),
      error: errMsg
    });

    saveSmtpLogsToDisk();

    return {
      success: false,
      message: `Failed sending to ${recEmail}: ${errMsg}`
    };
  }
}



