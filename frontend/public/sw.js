/* FanStay Service Worker
 * Caches images (and other static assets) for faster repeat loads.
 * Registration is gated on user consent — see consent.js / CookieConsent.jsx.
 */

const CACHE_NAME = 'fanstay-image-cache-v1';
const MAX_ENTRIES = 200;

// Trim the cache so it doesn't grow unbounded
const trimCache = async (cacheName, maxEntries) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxEntries) {
    // Delete oldest entries first (FIFO)
    await cache.delete(keys[0]);
    await trimCache(cacheName, maxEntries);
  }
};

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Cache-first strategy for images (Cloudinary, Unsplash, pravatar, placeholders, local assets)
self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const isImageRequest =
    request.destination === 'image' ||
    /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(new URL(request.url).pathname);

  if (!isImageRequest) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) {
        return cached;
      }

      try {
        const response = await fetch(request);
        // Only cache successful, basic/CORS-OK responses
        if (response.ok && (response.type === 'basic' || response.type === 'cors')) {
          cache.put(request, response.clone());
          trimCache(CACHE_NAME, MAX_ENTRIES);
        }
        return response;
      } catch (err) {
        // Network failed and nothing cached — let it fail naturally
        return cached || Promise.reject(err);
      }
    })
  );
});

// Allow the page to tell the SW to clear the image cache (e.g. on consent withdrawal)
self.addEventListener('message', (event) => {
  if (event.data?.type === 'CLEAR_IMAGE_CACHE') {
    caches.delete(CACHE_NAME);
  }
});