// Offline: all files are saved on the phone at first launch and served from there.
// When any file changes, bump the version here AND in js/version.js,
// otherwise users keep the old version from the cache.
const CACHE_NAME = "calculator-1.74";

// paths are relative to sw.js
const ASSETS = [
    "./",
    "./index.html",
    "./readme.html",
    "./manifest.json",
    "./css/main.css",
    "./js/version.js",
    "./js/i18n/i18n_en.js",
    "./js/i18n/i18n_ru.js",
    "./js/i18n/i18n.js",
    "./js/i18n/i18nextBrowserLanguageDetector.min.js",
    "./js/i18n/i18next.js",
    "./js/peerjs.min.js",
    "./js/calculator.js",
    "./js/magic.js",
    "./js/rc.js",
    "./old/",
    "./old/index.html",
    "./old/css/main.css",
    "./old/js/calculator.js",
    "./images/icon-192.png",
    "./images/icon-512.png",
    "./images/maskable-icon-512.png",
    "./images/donate-button.png",
    "./fonts/SFMono-Light.woff2",
    "./fonts/SFProDisplay-Light.woff2",
    "./fonts/SFProDisplay-Regular.woff2",
    "./fonts/SFProDisplay-Semibold.woff2",
    "./fonts/unbounded-semibold.woff2",
    "./fonts/manrope-medium.woff2",
    "./fonts/manrope-semibold.woff2",
    "./fonts/manrope-bold.woff2"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            // "reload" bypasses the browser HTTP cache so a new version gets fresh files
            .then(cache => cache.addAll(ASSETS.map(url => new Request(url, { cache: "reload" }))))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        Promise.all([
            caches.keys().then(keys =>
                Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
            ),
            self.clients.claim()
        ])
    );
});

self.addEventListener("fetch", event => {
    const request = event.request;
    // only own files; remote control (PeerJS) and other servers go to the network as usual
    if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {
        return;
    }
    event.respondWith(
        // ignoreSearch: the page opened with ?hostPeerId=... is the same cached index.html
        caches.match(request, { ignoreSearch: request.mode === "navigate" })
            .then(cached => cached || fetch(request).then(response => {
                if (response.ok) {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
                }
                return response;
            }))
            .catch(() => request.mode === "navigate" ? caches.match("./index.html") : Response.error())
    );
});
