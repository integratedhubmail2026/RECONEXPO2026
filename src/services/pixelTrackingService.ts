import { PixelSettings, PixelEventLog } from '../types/pixel';

export const DEFAULT_PIXEL_SETTINGS: PixelSettings = {
  metaPixelId: '',
  metaPixelEnabled: false,
  googleTagId: '',
  googleTagEnabled: false,
  trackPageView: true,
  trackRegistrations: true,
  trackVipPurchases: true,
  trackExhibitorInquiries: true,
  customHeaderScript: ''
};

export const logPixelEvent = (eventName: string, data?: Record<string, any>) => {
  try {
    const savedLogs = localStorage.getItem('recon_pixel_logs');
    const logs: PixelEventLog[] = savedLogs ? JSON.parse(savedLogs) : [];
    
    const newLog: PixelEventLog = {
      id: `px_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      eventName,
      platform: 'Internal',
      data: data || {},
      timestamp: new Date().toISOString()
    };

    logs.unshift(newLog);
    if (logs.length > 50) logs.pop();
    localStorage.setItem('recon_pixel_logs', JSON.stringify(logs));

    // Simulated Meta Pixel fbq call if available
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', eventName, data);
    }
    // Simulated Google gtag call if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, data);
    }
  } catch (err) {
    console.debug('Pixel track error:', err);
  }
};
