/* ===== PWA glue (loads last) =====
   1. registers the service worker (sw.js)
   2. shows an "Update" banner when a newer release has been downloaded and is waiting
   3. offers to install the app once (Android / desktop Chrome: real install prompt; iPhone: how-to hint)
   4. exposes checkForUpdate() for the Settings button */
(function () {
    'use strict';
    const SW_OK = 'serviceWorker' in navigator && location.protocol !== 'file:';
    const HINT_KEY = 'dyn_pwa_hint';
    let reg = null, applying = false, reloaded = false;

    const flag = {
        get() { try { return localStorage.getItem(HINT_KEY) === '1' } catch (e) { return false } },
        set() { try { localStorage.setItem(HINT_KEY, '1') } catch (e) { } }
    };
    const standalone = () => (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;

    /* ---------- banners ---------- */
    function bar(id, msg, goLabel, onGo, onClose) {
        if (document.getElementById(id)) return;
        let host = document.getElementById('pwa');
        if (!host) { host = document.createElement('div'); host.id = 'pwa'; document.body.appendChild(host) }
        const b = document.createElement('div'), s = document.createElement('span'), go = document.createElement('button'), x = document.createElement('button');
        b.className = 'pwa-bar'; b.id = id; b.setAttribute('role', 'status');
        s.textContent = msg;
        go.className = 'pwa-go'; go.textContent = goLabel; go.onclick = onGo;
        x.className = 'pwa-x'; x.textContent = '✕'; x.setAttribute('aria-label', 'Dismiss'); x.onclick = onClose;
        b.append(s, go, x); host.appendChild(b);
    }
    const drop = id => { const b = document.getElementById(id); if (b) b.remove() };

    /* ---------- updates ---------- */
    function showUpdate() {
        if (!reg || !reg.waiting || !navigator.serviceWorker.controller) return;
        bar('pwa-update', 'A new version is ready.', 'Update', applyUpdate, () => drop('pwa-update'));
    }
    function applyUpdate() {
        const w = reg && reg.waiting; if (!w) return location.reload();
        applying = true;
        try { if (typeof save === 'function') save() } catch (e) { }   /* progress is already saved after every action; this is belt and braces */
        w.postMessage('SKIP_WAITING');
        setTimeout(reload, 4000);                                        /* safety net if controllerchange never arrives */
    }
    function reload() { if (reloaded) return; reloaded = true; location.reload() }

    window.checkForUpdate = async function () {
        if (!reg) return say('Updates work when the app is opened from its web address.');
        try { await reg.update() } catch (e) { return say('Could not check. Are you online?') }
        if (reg.waiting) showUpdate();
        else if (reg.installing) say('Downloading the update…');
        else say('You have the latest version (v' + APP_VERSION + ')');
    };

    if (SW_OK) {
        /* the new worker taking over → reload once, but only when the player asked for it (not on the very first install) */
        navigator.serviceWorker.addEventListener('controllerchange', () => { if (applying) reload() });

        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(r => {
                reg = r;
                showUpdate();                                            /* an update may already be waiting from an earlier visit */
                r.addEventListener('updatefound', () => {
                    const w = r.installing; if (!w) return;
                    w.addEventListener('statechange', () => { if (w.state === 'installed') showUpdate() });
                });
                /* look for a new release whenever the app comes back to the foreground, and hourly while it stays open */
                document.addEventListener('visibilitychange', () => { if (!document.hidden) r.update().catch(() => { }) });
                setInterval(() => r.update().catch(() => { }), 60 * 60 * 1000);
            }).catch(() => { });
        });
    }

    /* ---------- install hint (once) ---------- */
    const dismissInstall = id => { drop(id); flag.set() };
    window.addEventListener('beforeinstallprompt', () => {              /* ui.js already stores the event in deferredInstall */
        if (standalone() || flag.get()) return;
        setTimeout(() => bar('pwa-install', 'Install Dynasty Manager to play full screen, even offline.', 'Install',
            () => { dismissInstall('pwa-install'); try { installApp() } catch (e) { } },
            () => dismissInstall('pwa-install')), 2500);
    });
    window.addEventListener('appinstalled', () => dismissInstall('pwa-install'));

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (ios && !standalone() && !flag.get()) {
        setTimeout(() => bar('pwa-ios', 'To install: tap Share, then “Add to Home Screen”.', 'Got it',
            () => dismissInstall('pwa-ios'), () => dismissInstall('pwa-ios')), 4000);
    }
})();
