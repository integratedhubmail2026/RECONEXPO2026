import { PixelConfig, StandardPixelEvent, PixelEventPayload, PixelLogEntry } from '../types/pixel';

export const DEFAULT_PIXEL_CONFIG: PixelConfig = {
  facebookPixelId: '1098273645129384',
  facebookEnabled: true,
  facebookTestEventCode: '',
  
  tiktokPixelId: 'C1234567890TIKTOK',
  tiktokEnabled: true,

  trackPageView: true,
  trackViewContent: true,
  trackInitiateCheckout: true,
  trackLead: true,
  trackPurchase: true,
  trackCompleteRegistration: true,

  debugMode: true,
  updatedAt: new Date().toISOString(),
  updatedBy: 'Organizing Secretariat Admin'
};

const PIXEL_CONFIG_STORAGE_KEY = 'recon_expo_pixel_config_v2';
const PIXEL_LOGS_STORAGE_KEY = 'recon_expo_pixel_logs_v2';

let currentConfig: PixelConfig = (() => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(PIXEL_CONFIG_STORAGE_KEY);
      if (saved) return { ...DEFAULT_PIXEL_CONFIG, ...JSON.parse(saved) };
    } catch {
      // safe fallback
    }
  }
  return DEFAULT_PIXEL_CONFIG;
})();

let pixelLogs: PixelLogEntry[] = (() => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(PIXEL_LOGS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // safe
    }
  }
  return [];
})();

let fbScriptInjected = false;
let tiktokScriptInjected = false;

// Initialize & inject Meta Facebook Pixel SDK
function injectFacebookPixel(pixelId: string, testCode?: string) {
  if (typeof window === 'undefined' || !pixelId) return;

  if ((window as any).fbq) {
    try {
      (window as any).fbq('init', pixelId);
      if (testCode) {
        (window as any).fbq('set', 'testEventCode', testCode);
      }
    } catch (e) {
      console.warn('[Facebook Pixel Init Warning]', e);
    }
    return;
  }

  /* eslint-disable */
  (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function() {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */

  try {
    (window as any).fbq('init', pixelId);
    if (testCode) {
      (window as any).fbq('set', 'testEventCode', testCode);
    }
    fbScriptInjected = true;
    console.log(`[Meta Facebook Pixel Active]: ID ${pixelId}`);
  } catch (err) {
    console.warn('[Facebook Pixel Injection Error]', err);
  }
}

// Initialize & inject TikTok Pixel SDK
function injectTikTokPixel(pixelId: string) {
  if (typeof window === 'undefined' || !pixelId) return;

  if ((window as any).ttq) {
    try {
      (window as any).ttq.load(pixelId);
      (window as any).ttq.page();
    } catch (e) {
      console.warn('[TikTok Pixel Init Warning]', e);
    }
    return;
  }

  /* eslint-disable */
  (function(w: any, d: any, t: any) {
    w.TiktokAnalyticsObject = t;
    var ttq = w[t] = w[t] || [];
    ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"];
    ttq.setAndDefer = function(t: any, e: any) {
      t[e] = function() {
        t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
      };
    };
    for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
    ttq.instance = function(t: any) {
      for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
      return e;
    };
    ttq.load = function(e: any, n: any) {
      var i = "https://analytics.tiktok.com/i18n/pixel/events.js";
      ttq._i = ttq._i || {};
      ttq._i[e] = [];
      ttq._i[e]._u = i;
      ttq._t = ttq._t || {};
      ttq._t[e] = +new Date();
      ttq._o = ttq._o || {};
      ttq._o[e] = n || {};
      var o = d.createElement("script");
      o.type = "text/javascript";
      o.async = true;
      o.src = i + "?sdkid=" + e + "&lib=" + t;
      var a = d.getElementsByTagName("script")[0];
      a.parentNode.insertBefore(o, a);
    };
  })(window, document, 'ttq');
  /* eslint-enable */

  try {
    (window as any).ttq.load(pixelId);
    (window as any).ttq.page();
    tiktokScriptInjected = true;
    console.log(`[TikTok Pixel Active]: ID ${pixelId}`);
  } catch (err) {
    console.warn('[TikTok Pixel Injection Error]', err);
  }
}

// Master init method called on app boot & configuration change
export function initPixelTracking(config?: Partial<PixelConfig>): PixelConfig {
  if (config) {
    currentConfig = { ...currentConfig, ...config };
    if (typeof window !== 'undefined') {
      localStorage.setItem(PIXEL_CONFIG_STORAGE_KEY, JSON.stringify(currentConfig));
    }
  }

  // Load from server API in background to sync across devices
  if (typeof window !== 'undefined') {
    fetch('/api/pixel/config')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.config) {
          currentConfig = { ...currentConfig, ...data.config };
          localStorage.setItem(PIXEL_CONFIG_STORAGE_KEY, JSON.stringify(currentConfig));
          applyPixels();
        }
      })
      .catch(() => {});
  }

  applyPixels();
  return currentConfig;
}

function applyPixels() {
  if (currentConfig.facebookEnabled && currentConfig.facebookPixelId) {
    injectFacebookPixel(currentConfig.facebookPixelId, currentConfig.facebookTestEventCode);
  }
  if (currentConfig.tiktokEnabled && currentConfig.tiktokPixelId) {
    injectTikTokPixel(currentConfig.tiktokPixelId);
  }
}

export function updatePixelConfig(newConfig: Partial<PixelConfig>): PixelConfig {
  currentConfig = { 
    ...currentConfig, 
    ...newConfig, 
    updatedAt: new Date().toISOString() 
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(PIXEL_CONFIG_STORAGE_KEY, JSON.stringify(currentConfig));
    
    // Save to backend API
    fetch('/api/pixel/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config: currentConfig })
    }).catch(() => {});
  }

  applyPixels();
  return currentConfig;
}

export function getPixelConfig(): PixelConfig {
  return currentConfig;
}

export function getPixelLogs(): PixelLogEntry[] {
  return pixelLogs;
}

export function clearPixelLogs() {
  pixelLogs = [];
  if (typeof window !== 'undefined') {
    localStorage.removeItem(PIXEL_LOGS_STORAGE_KEY);
  }
}

// Master Pixel Event Tracking Method
export function trackPixelEvent(payload: PixelEventPayload) {
  if (typeof window === 'undefined') return;

  const {
    eventName,
    contentName = 'RECON Expo 2026',
    category = 'Event Registration',
    value = 0,
    currency = 'NGN',
    ticketNumber,
    email,
    phone,
    customData = {}
  } = payload;

  // Check event toggles
  if (eventName === 'PageView' && !currentConfig.trackPageView) return;
  if (eventName === 'ViewContent' && !currentConfig.trackViewContent) return;
  if (eventName === 'InitiateCheckout' && !currentConfig.trackInitiateCheckout) return;
  if (eventName === 'Lead' && !currentConfig.trackLead) return;
  if (eventName === 'Purchase' && !currentConfig.trackPurchase) return;
  if (eventName === 'CompleteRegistration' && !currentConfig.trackCompleteRegistration) return;

  const activePlatforms: string[] = [];

  // 1. Meta / Facebook Pixel Dispatch
  if (currentConfig.facebookEnabled && currentConfig.facebookPixelId && (window as any).fbq) {
    try {
      const fbData: Record<string, any> = {
        content_name: contentName,
        content_category: category,
        value: value,
        currency: currency,
        ...customData
      };
      if (ticketNumber) fbData.content_ids = [ticketNumber];

      (window as any).fbq('track', eventName, fbData);
      activePlatforms.push('Facebook Pixel');
    } catch (e) {
      console.warn('[Facebook Pixel Track Error]', e);
    }
  }

  // 2. TikTok Pixel Dispatch
  if (currentConfig.tiktokEnabled && currentConfig.tiktokPixelId && (window as any).ttq) {
    try {
      // Map standard event names to TikTok equivalents
      let ttEvent = eventName as string;
      if (eventName === 'InitiateCheckout') ttEvent = 'InitiateCheckout';
      if (eventName === 'Purchase') ttEvent = 'CompletePayment';
      if (eventName === 'CompleteRegistration') ttEvent = 'CompleteRegistration';
      if (eventName === 'Lead') ttEvent = 'SubmitForm';
      if (eventName === 'ViewContent') ttEvent = 'ViewContent';

      const ttData: Record<string, any> = {
        content_name: contentName,
        content_category: category,
        value: value,
        currency: currency,
        ...customData
      };
      if (ticketNumber) ttData.content_id = ticketNumber;

      (window as any).ttq.track(ttEvent, ttData);
      activePlatforms.push('TikTok Pixel');
    } catch (e) {
      console.warn('[TikTok Pixel Track Error]', e);
    }
  }

  // Record Audit Log Entry for Admin Console
  const logEntry: PixelLogEntry = {
    id: `px_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    eventName,
    platforms: activePlatforms.length > 0 ? activePlatforms : ['Simulation / Console Log'],
    payload: {
      eventName,
      contentName,
      category,
      value,
      currency,
      ticketNumber,
      email: email ? `${email.slice(0, 3)}***@${email.split('@')[1] || 'mail.com'}` : undefined,
      phone,
      customData
    },
    timestamp: new Date().toISOString(),
    url: window.location.href
  };

  pixelLogs.unshift(logEntry);
  if (pixelLogs.length > 100) pixelLogs = pixelLogs.slice(0, 100);

  try {
    localStorage.setItem(PIXEL_LOGS_STORAGE_KEY, JSON.stringify(pixelLogs));
  } catch {
    // safe
  }

  if (currentConfig.debugMode) {
    console.log(`🎯 [Pixel Conversion Event Fired]: ${eventName}`, {
      platforms: activePlatforms,
      payload
    });
  }
}
