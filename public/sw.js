// RECON Expo 2026 - Official Background Service Worker for Native Web Push Notifications

const CACHE_NAME = 'recon-expo-2026-v2';

// Install Event - Fast Activation
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate Event - Claim all clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
        );
      })
    ])
  );
});

// Reusable function to display native OS/Browser notification
function displaySystemNotification(payload) {
  const data = payload || {};
  const title = data.title || 'RECON Expo 2026 Alert';
  
  const options = {
    body: data.message || data.body || 'New live property deal and conference update from RECON 2026 Abuja.',
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/badge-72.png',
    image: data.imageUrl || data.image || undefined,
    vibrate: [200, 100, 200, 100, 200],
    tag: data.id || data.tag || ('recon-push-' + Date.now()),
    renotify: true,
    requireInteraction: true,
    silent: false,
    data: {
      url: data.targetLink || data.url || '/'
    },
    actions: [
      { action: 'open', title: '🚀 View Update' },
      { action: 'dismiss', title: 'Close' }
    ]
  };

  return self.registration.showNotification(title, options);
}

// 1. Push Event (Triggered by Web Push Server / Background Push)
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'RECON 2026 Alert', message: event.data.text() };
    }
  }

  event.waitUntil(displaySystemNotification(data));
});

// 2. BroadcastChannel Listener for background cross-tab and service worker sync
try {
  if (typeof BroadcastChannel !== 'undefined') {
    const channel = new BroadcastChannel('recon_expo_push_sync');
    channel.onmessage = (event) => {
      if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        displaySystemNotification(event.data.payload);
      }
    };
  }
} catch (e) {
  // BroadcastChannel fallback handled by postMessage below
}

// 3. PostMessage Listener from main window / app
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SHOW_NOTIFICATION') {
    event.waitUntil(displaySystemNotification(event.data.payload));
  }
});

// 4. Notification Click Event (When user taps notification in OS tray / lock screen / desktop banner)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetUrl = (event.notification.data && event.notification.data.url) 
    ? event.notification.data.url 
    : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there is already a window open
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          if (targetUrl && targetUrl !== '/') {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      // If no window is currently open, open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
