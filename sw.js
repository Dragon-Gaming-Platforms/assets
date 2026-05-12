importScripts("https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@2.0.0-alpha/dist/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const sj = new ScramjetServiceWorker();

self.addEventListener("fetch", (event) => {
  // Only intercept if it matches scramjet's route pattern
  if (sj.route(event)) {
    event.respondWith(
      (async () => {
        await sj.loadConfig();
        return await sj.fetch(event);
      })()
    );
  }
  // Otherwise let the request pass through normally (don't call respondWith)
});

self.addEventListener("install",  ()  => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));