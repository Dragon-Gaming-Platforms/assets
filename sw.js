importScripts("https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@2.0.0-alpha/dist/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const sj = new ScramjetServiceWorker();

self.addEventListener("fetch", (event) => {
  // Only intercept requests that contain the scramjet prefix in the URL
  // All other requests (CDN scripts, images, etc.) pass through untouched
  if (event.request.url.includes('/assets/scramjet/')) {
    event.respondWith(
      (async () => {
        await sj.loadConfig();
        if (sj.route(event)) {
          return await sj.fetch(event);
        }
        // If route check fails for some reason, fall back
        return await fetch(event.request);
      })()
    );
  }
  // If the URL doesn't contain the scramjet prefix, do nothing - 
  // the browser will fetch it normally
});

self.addEventListener("install",  ()  => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));