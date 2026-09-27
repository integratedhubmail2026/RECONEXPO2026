export interface PixelConfig {
  facebookPixelId: string;
  facebookEnabled: boolean;
  facebookTestEventCode?: string;
  
  tiktokPixelId: string;
  tiktokEnabled: boolean;

  trackPageView: boolean;
  trackViewContent: boolean;
  trackInitiateCheckout: boolean;
  trackLead: boolean;
  trackPurchase: boolean;
  trackCompleteRegistration: boolean;

  debugMode: boolean;
  updatedAt?: string;
  updatedBy?: string;
}

export type StandardPixelEvent = 
  | 'PageView'
  | 'ViewContent'
  | 'InitiateCheckout'
  | 'Lead'
  | 'Purchase'
  | 'CompleteRegistration'
  | 'Search'
  | 'Contact';

export interface PixelEventPayload {
  eventName: StandardPixelEvent;
  platform?: 'facebook' | 'tiktok' | 'both';
  contentName?: string;
  category?: string;
  value?: number;
  currency?: string;
  ticketNumber?: string;
  email?: string;
  phone?: string;
  customData?: Record<string, any>;
  timestamp?: string;
}

export interface PixelLogEntry {
  id: string;
  eventName: StandardPixelEvent;
  platforms: string[];
  payload: PixelEventPayload;
  timestamp: string;
  url?: string;
}
