// Basic Service Worker for PWA
self.addEventListener('install', (event) => {
  console.log('SW installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('SW activated');
});

self.addEventListener('fetch', (event) => {
  // Simple pass-through for now
  // You can add caching logic here later
  event.respondWith(fetch(event.request));
});
