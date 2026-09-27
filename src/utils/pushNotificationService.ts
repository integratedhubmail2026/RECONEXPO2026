// RECON Expo 2026 - Web Push & Native Device Notification Utility Service
import { playNotificationSound } from './soundService';

export interface PushNotificationPayload {
  id?: string;
  title: string;
  message: string;
  imageUrl?: string;
  targetLink?: string;
  category?: string;
  badgeText?: string;
  tag?: string;
}

// Global broadcast channel for cross-tab & service-worker background notification sync
let pushSyncChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    pushSyncChannel = new BroadcastChannel('recon_expo_push_sync');
  }
} catch (e) {
  // BroadcastChannel unavailable
}

// 1. Register Background Service Worker
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });
    
    await navigator.serviceWorker.ready;
    return registration;
  } catch (error) {
    console.warn('[PushService] Service worker registration notice:', error);
    return null;
  }
}

// 2. Request Native System Notification Permission
export async function requestNativeNotificationPermission(): Promise<'granted' | 'denied' | 'default' | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  try {
    if (Notification.permission === 'granted') {
      return 'granted';
    }
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.warn('[PushService] Error requesting notification permission:', error);
    return 'denied';
  }
}

// 3. Dispatch Native System Notification (Shows directly from Browser / OS in background)
export async function dispatchDeviceNotification(payload: PushNotificationPayload): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const title = payload.title || 'RECON Expo 2026 Alert';
  const body = payload.message || 'Latest update from RECON Expo 2026 Abuja.';
  const icon = '/icon-192.png';
  const badge = '/badge-72.png';
  const image = payload.imageUrl || undefined;
  const targetUrl = payload.targetLink || '/';
  const tag = payload.id || `recon-push-${Date.now()}`;

  const formattedPayload = {
    id: tag,
    title,
    message: body,
    icon,
    badge,
    imageUrl: image,
    targetLink: targetUrl,
    category: payload.category,
    badgeText: payload.badgeText
  };

  // Ring audible chime sound for every notification
  try {
    playNotificationSound();
  } catch {
    // safe
  }

  // Broadcast to BroadcastChannel so background workers and open tabs synchronize
  try {
    if (pushSyncChannel) {
      pushSyncChannel.postMessage({
        type: 'SHOW_NOTIFICATION',
        payload: formattedPayload
      });
    }
  } catch (e) {
    // Channel broadcast optional
  }

  // Check and request permission if needed
  if ('Notification' in window) {
    if (Notification.permission === 'default') {
      try {
        await Notification.requestPermission();
      } catch (e) {
        // user declined or ignored
      }
    }

    if (Notification.permission === 'granted') {
      let shownBySW = false;

      // Method A: Dispatch via ServiceWorker registration (Best for mobile phone background, lock screen & top status bar)
      if ('serviceWorker' in navigator) {
        try {
          const reg = await navigator.serviceWorker.ready;
          if (reg && 'showNotification' in reg) {
            await reg.showNotification(title, {
              body,
              icon,
              badge,
              image,
              vibrate: [200, 100, 200, 100, 200],
              tag,
              renotify: true,
              requireInteraction: true,
              data: { url: targetUrl },
              actions: [
                { action: 'open', title: '🚀 View Update' },
                { action: 'dismiss', title: 'Close' }
              ]
            } as NotificationOptions);
            shownBySW = true;
          }
        } catch (swErr) {
          console.warn('[PushService] SW showNotification notice:', swErr);
        }

        // Also post message to active service worker controller
        try {
          if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
              type: 'SHOW_NOTIFICATION',
              payload: formattedPayload
            });
          }
        } catch (msgErr) {
          // Ignored
        }
      }

      if (shownBySW) {
        return true;
      }

      // Method B: Standard Browser Notification Constructor
      try {
        const notif = new Notification(title, {
          body,
          icon,
          badge,
          image,
          tag,
          requireInteraction: true,
          data: { url: targetUrl }
        } as NotificationOptions);

        notif.onclick = function (e) {
          e.preventDefault();
          window.focus();
          if (targetUrl.startsWith('#')) {
            const el = document.querySelector(targetUrl);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          } else if (targetUrl.startsWith('http')) {
            window.location.href = targetUrl;
          }
          notif.close();
        };

        return true;
      } catch (notifErr) {
        console.warn('[PushService] Window Notification fallback notice:', notifErr);
      }
    }
  }

  return false;
}
