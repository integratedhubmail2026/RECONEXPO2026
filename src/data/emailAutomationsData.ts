import { AutomationTrigger } from '../types/marketing';

export const EMAIL_AUTOMATIONS: AutomationTrigger[] = [
  {
    id: 'auto_visitor_reg',
    name: 'Instant Visitor Badge Dispatch',
    eventType: 'on_visitor_registered',
    templateId: 'tmpl_badge_confirmation',
    delayMinutes: 0,
    enabled: true
  },
  {
    id: 'auto_vip_receipt',
    name: 'VIP Invoice & Accreditation Dispatch',
    eventType: 'on_vip_registered',
    templateId: 'tmpl_payment_receipt',
    delayMinutes: 0,
    enabled: true
  },
  {
    id: 'auto_upgrade_nudge',
    name: '24hr Visitor VIP Upgrade Drip',
    eventType: 'drip_day_1',
    templateId: 'tmpl_vip_upgrade_drip',
    delayMinutes: 1440,
    enabled: true
  }
];
