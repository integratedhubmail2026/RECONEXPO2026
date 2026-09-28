export interface PixelSettings {
  metaPixelId: string;
  metaPixelEnabled: boolean;
  googleTagId: string;
  googleTagEnabled: boolean;
  trackPageView: boolean;
  trackRegistrations: boolean;
  trackVipPurchases: boolean;
  trackExhibitorInquiries: boolean;
  customHeaderScript: string;
}

export interface PixelEventLog {
  id: string;
  eventName: string;
  platform: 'Meta' | 'Google' | 'Internal';
  data: Record<string, any>;
  timestamp: string;
}
