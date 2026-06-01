const CACHE_NAME = 'gc2026-v1';

self.addEventListener('install', (event) => {
  console.log('SW installed');
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Very basic minimal cache
      return cache.addAll([
        '/',
        '/manifest.webmanifest',
        '/icon-192x192.png',
        '/icon-512x512.png'
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('SW activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only process GET requests
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Skip API routes
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response and cache it
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails
        return caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          // If both network and cache fail, we could return a generic offline page here.
          // For now, return the root page as a fallback for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
          return new Response('Offline content not available', {
            status: 503,
            statusText: 'Service Unavailable',
          });
        });
      })
  );
});
