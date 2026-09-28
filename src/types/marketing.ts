export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  category: 'welcome' | 'badge_receipt' | 'payment_reminder' | 'vip_upgrade' | 'speaker_broadcast' | 'custom';
  htmlContent: string;
  variables: string[];
  lastModified: string;
}

export interface AutomationTrigger {
  id: string;
  name: string;
  eventType: 'on_visitor_registered' | 'on_vip_registered' | 'on_exhibitor_registered' | 'on_abandoned_checkout' | 'drip_day_1';
  templateId: string;
  delayMinutes: number;
  enabled: boolean;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  targetAudience: 'all' | 'vip_only' | 'visitors_only' | 'exhibitors_only';
  sentCount: number;
  openRate: number;
  clickRate: number;
  status: 'draft' | 'scheduled' | 'sent';
  sentAt?: string;
}
