self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open('static-v1').then(cache => {
      return cache.addAll(['/','/index.html','/manifest.json']);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Notification';
  const options = {
    body: data.body || 'You have a new notification.',
    icon: '/icon.svg'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
