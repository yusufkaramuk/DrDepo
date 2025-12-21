const CACHE_NAME = 'ilac-stok-v2'; // Updated for new features

// Don't cache - always fetch fresh
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Delete all old caches
                    return caches.delete(cacheName);
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Network-first strategy - always try to fetch fresh content
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                return response;
            })
            .catch(() => {
                // Return offline page if network fails
                return new Response('Offline - İnternet bağlantısı yok', {
                    headers: { 'Content-Type': 'text/plain' }
                });
            })
    );
});
