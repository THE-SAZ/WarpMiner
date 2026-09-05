/* ══════════════════════════════════════════════════════════════
   WarpMiner Service Worker — Offline PWA
   Developed by THE SAZ 🏴‍☠️
   ══════════════════════════════════════════════════════════════ */
const VERSION = 'warpminer-v0.9.0-voyager';
const CORE = ['./','./index.html','./manifest.webmanifest','./assets/logo.svg','./assets/banner.svg',
  './assets/icon-192.png','./assets/icon-512.png','./assets/icon-maskable.png','./assets/apple-touch-icon.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin === self.location.origin) {
    e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      if (res && res.status === 200) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); }
      return res; }).catch(() => caches.match('./index.html'))));
  } else {
    e.respondWith(fetch(e.request).then(res => {
      if (res && (res.status === 200 || res.type === 'opaque')) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); }
      return res; }).catch(() => caches.match(e.request)));
  }
});
