importScripts("https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@2.0.0-alpha/dist/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const sj = new ScramjetServiceWorker();

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      try {
        // Load config if available; if not initialized yet, just continue
        try {
          await sj.loadConfig();
        } catch (configError) {
          // Config not available yet - that's fine for non-scramjet requests
        }

        // Check if this request is a scramjet proxy request
        if (sj.route(event)) {
          return await sj.fetch(event);
        }
      } catch (err) {
        // If anything goes wrong, fall back to normal fetch
        console.error('[SW] Scramjet error:', err);
      }

      // Default: normal fetch for all non-scramjet requests
      return await fetch(event.request);
    })()
  );
});

self.addEventListener("install",  ()  => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));