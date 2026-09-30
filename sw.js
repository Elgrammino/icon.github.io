// Офлайн-кэш: после первого открытия всё работает без интернета.
// Меняешь файлы — увеличь VERSION, чтобы телефон подтянул новое.
const VERSION = 'iwi-v1';
const ASSETS = [
  "./",
  "css/style.css",
  "icons/app-icon-192.png",
  "icons/app-icon-512.png",
  "icons/app-icon.png",
  "icons/dock/messages.png",
  "icons/dock/music.png",
  "icons/dock/safari.png",
  "icons/letters/%D0%81.png",
  "icons/letters/%D0%90.png",
  "icons/letters/%D0%91.png",
  "icons/letters/%D0%92.png",
  "icons/letters/%D0%93.png",
  "icons/letters/%D0%94.png",
  "icons/letters/%D0%95.png",
  "icons/letters/%D0%96.png",
  "icons/letters/%D0%97.png",
  "icons/letters/%D0%98.png",
  "icons/letters/%D0%99.png",
  "icons/letters/%D0%9A.png",
  "icons/letters/%D0%9B.png",
  "icons/letters/%D0%9C.png",
  "icons/letters/%D0%9F.png",
  "icons/letters/%D0%A0.png",
  "icons/letters/%D0%A1.png",
  "icons/letters/%D0%A1_2.png",
  "icons/letters/%D0%A2.png",
  "icons/letters/%D0%A3.png",
  "icons/letters/%D0%A4.png",
  "icons/letters/%D0%A5.png",
  "icons/letters/%D0%A6.png",
  "icons/letters/%D0%A6_2.png",
  "icons/letters/A.png",
  "icons/letters/B.png",
  "icons/letters/C.png",
  "icons/letters/D.png",
  "icons/letters/E.png",
  "icons/letters/F.png",
  "icons/letters/G.png",
  "icons/letters/H.png",
  "icons/letters/I.png",
  "icons/letters/J.png",
  "icons/letters/K.png",
  "icons/letters/L.png",
  "icons/letters/M.png",
  "icons/screen1/appstore.png",
  "icons/screen1/calendar.png",
  "icons/screen1/camera.png",
  "icons/screen1/clock.png",
  "icons/screen1/contacts.png",
  "icons/screen1/files.png",
  "icons/screen1/maps.png",
  "icons/screen1/messages.png",
  "icons/screen1/navigator.png",
  "icons/screen1/notes.png",
  "icons/screen1/photos.png",
  "icons/screen1/reminders.png",
  "icons/screen1/settings.png",
  "icons/screen2/books.png",
  "icons/screen2/calculator.png",
  "icons/screen2/compass.png",
  "icons/screen2/health.png",
  "icons/screen2/home.png",
  "icons/screen2/measure.png",
  "icons/screen2/music.png",
  "icons/screen2/podcasts.png",
  "icons/screen2/shortcuts.png",
  "icons/screen2/voicememos.png",
  "icons/screen2/wallet.png",
  "icons/screen2/weather.png",
  "index.html",
  "js/app.js",
  "manifest.webmanifest"
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => Promise.all(ASSETS.map(a => c.add(a).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// сначала кэш (мгновенно и офлайн), параллельно тихо обновляем из сети
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(VERSION).then(async c => {
    const hit = await c.match(e.request, {ignoreSearch: true});
    const net = fetch(e.request).then(r => { if (r.ok && new URL(e.request.url).origin === location.origin) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
