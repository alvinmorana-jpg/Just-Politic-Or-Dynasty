// Service worker: caches the game so it works offline, and detects new versions.
// VERSION is stamped automatically by tools/bump-version.py. Any change to this file
// (even just the version) makes the browser fetch it and flag an update.
const VERSION = '2026.10.09-4aa82dc';
const CACHE = 'pg-' + VERSION;
const ASSETS = ["./", "assets/apple-touch-icon.png", "assets/favicon.png", "assets/icon-192.png", "assets/icon-512.png", "assets/logo.png", "css/base.css", "css/boot.css", "css/components.css", "css/map.css", "css/neighbours.css", "css/responsive.css", "css/rotate-guard.css", "css/save-slots.css", "css/theme.css", "css/update.css", "index.html", "js/config.js", "js/core/device.js", "js/core/state.js", "js/data/country-bn.js", "js/data/country-my.js", "js/data/country-ph.js", "js/data/country-sg.js", "js/data/game-content.js", "js/data/locales.js", "js/data/logos.js", "js/data/politics.js", "js/main.js", "js/modules/actions.js", "js/modules/capital-tension.js", "js/modules/congress.js", "js/modules/content-extra.js", "js/modules/diplomacy.js", "js/modules/economy.js", "js/modules/forces.js", "js/modules/governance.js", "js/modules/helpers.js", "js/modules/history.js", "js/modules/power-pathways.js", "js/modules/save-load.js", "js/ui/map.js", "js/ui/neighbours.js", "js/ui/orientation.js", "js/ui/render.js", "js/ui/tab-scroll.js", "js/ui/update.js", "manifest.webmanifest"];

self.addEventListener('install', e => {
    // No skipWaiting here: the new version waits until the player taps "Update now".
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k.startsWith('pg-') && k !== CACHE).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('message', e => {
    if (e.data === 'SKIP_WAITING') self.skipWaiting();
    if (e.data === 'GET_VERSION' && e.source) e.source.postMessage({ type: 'VERSION', version: VERSION });
});

self.addEventListener('fetch', e => {
    const req = e.request;
    if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
    // version.json is always fetched fresh so update checks never see a stale copy
    if (req.url.endsWith('version.json')) { e.respondWith(fetch(req, { cache: 'no-store' }).catch(() => caches.match(req))); return; }
    e.respondWith(
        caches.match(req).then(hit => hit || fetch(req).then(res => {
            if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
            return res;
        }).catch(() => caches.match('./index.html')))
    );
});
