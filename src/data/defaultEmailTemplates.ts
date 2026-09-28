import { EmailTemplate } from '../types/marketing';

export const SYSTEM_DEFAULT_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tmpl_badge_confirmation',
    name: 'Official Accreditation & Smart Badge Pass',
    subject: '🎟️ Your Official Pass to RECON Expo 2026 - {{ticketNumber}}',
    category: 'badge_receipt',
    variables: ['{{fullName}}', '{{ticketNumber}}', '{{passType}}', '{{organization}}', '{{qrCodeUrl}}', '{{venue}}', '{{dates}}'],
    lastModified: '2026-09-27',
    htmlContent: `<h2>Welcome to RECON Expo 2026, {{fullName}}!</h2><p>Your official accreditation is confirmed for <strong>{{dates}}</strong> at <strong>{{venue}}</strong>.</p><p>Pass Tier: <strong>{{passType}}</strong></p><p>Ticket ID: <strong>{{ticketNumber}}</strong></p>`
  },
  {
    id: 'tmpl_payment_receipt',
    name: 'Official Payment Invoice & Tax Receipt',
    subject: '🧾 Payment Confirmation & Tax Receipt - RECON Expo 2026',
    category: 'badge_receipt',
    variables: ['{{fullName}}', '{{amountPaid}}', '{{txRef}}', '{{date}}', '{{passType}}'],
    lastModified: '2026-09-27',
    htmlContent: `<h2>Payment Confirmed!</h2><p>Thank you for securing your <strong>{{passType}}</strong> pass.</p><p>Amount: <strong>₦{{amountPaid}}</strong> (Ref: {{txRef}})</p>`
  },
  {
    id: 'tmpl_vip_upgrade_drip',
    name: 'Visitor to VIP Upgrade Invitation',
    subject: '⭐ Unlock Exclusive VIP Deal-Room & Executive Luncheon Access',
    category: 'vip_upgrade',
    variables: ['{{fullName}}', '{{ticketNumber}}', '{{upgradeLink}}'],
    lastModified: '2026-09-27',
    htmlContent: `<h2>Upgrade to Elite VIP Pass</h2><p>Hi {{fullName}}, join Nigeria's top ministers and infrastructure leaders in the VIP Deal-Room.</p>`
  }
];
