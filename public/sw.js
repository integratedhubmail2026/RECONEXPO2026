const CACHE_NAME = 'recon-cache-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
  // Let network handle dynamic API requests
  if (e.request.url.includes('/api/')) {
    return;
  }
});

self.addEventListener('push', (e) => {
  const data = e.data ? e.data.json() : { title: 'RECON Expo 2026', body: 'New conference announcement!' };
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/badge-72.svg',
      badge: '/badge-72.svg'
    })
  );
});
