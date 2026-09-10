const STATIC_CACHE = "kisansetu-static-v1";
const API_CACHE = "kisansetu-api-v1";
const APP_SHELL = ["/", "/offline.html", "/manifest.webmanifest", "/icons/kisansetu.svg"];

self.addEventListener("install", (event) => event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())));
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.pathname === "/api/prices") {
    event.respondWith(caches.open(API_CACHE).then(async (cache) => {
      try { const fresh = await fetch(request); cache.put(request, fresh.clone()); return fresh; }
      catch { return (await cache.match(request)) || new Response(JSON.stringify({ prices: [] }), { headers: { "Content-Type": "application/json" } }); }
    }));
    return;
  }
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match("/").then((response) => response || caches.match("/offline.html"))));
    return;
  }
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    if (url.origin === location.origin && response.ok) caches.open(STATIC_CACHE).then((cache) => cache.put(request, response.clone()));
    return response;
  })));
});
