// Update notifier: shows a "new version available" banner and applies it on request.
// Works through the service worker (https / localhost). Without one, it falls back to
// polling version.json, so players still get notified.
(function () {
    var CHECK_MS = 30 * 60 * 1000;          // re-check every 30 minutes, and whenever the app regains focus
    var banner, waiting = null, reloading = false, loadedVersion = null;

    function show(text, onGo) {
        if (banner) return;
        banner = document.createElement('div');
        banner.id = 'updateBanner';
        banner.setAttribute('role', 'status');
        banner.innerHTML = '<span class="ut">🔔 <b>Update available</b><small>' + text + '</small></span>' +
            '<button class="up" type="button">Update now</button><button class="ul" type="button" aria-label="Later">✕</button>';
        banner.querySelector('.up').onclick = onGo;
        banner.querySelector('.ul').onclick = function () { banner.remove(); banner = null; };
        document.body.appendChild(banner);
    }

    function applyUpdate() {
        try { if (typeof save === 'function') save(); } catch (e) { }   // never lose progress
        if (waiting) { waiting.postMessage('SKIP_WAITING'); setTimeout(function () { if (!reloading) location.reload(); }, 1500); }
        else location.reload();
    }

    function watch(reg) {
        function check() { if (reg.waiting && navigator.serviceWorker.controller) { waiting = reg.waiting; show('Tap to get the latest improvements.', applyUpdate); } }
        check();
        reg.addEventListener('updatefound', function () {
            var nw = reg.installing; if (!nw) return;
            nw.addEventListener('statechange', function () { if (nw.state === 'installed') check(); });
        });
        function poll() { reg.update().catch(function () { }); }
        setInterval(poll, CHECK_MS);
        document.addEventListener('visibilitychange', function () { if (!document.hidden) poll(); });
        addEventListener('online', poll);
    }

    // Fallback when no service worker is available
    function pollVersionFile() {
        function get() { return fetch('version.json?_=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.json(); }); }
        get().then(function (j) { loadedVersion = j.version; }).catch(function () { });
        function again() {
            get().then(function (j) { if (loadedVersion && j.version !== loadedVersion) show('Reload to get version ' + j.version + '.', applyUpdate); }).catch(function () { });
        }
        setInterval(again, CHECK_MS);
        document.addEventListener('visibilitychange', function () { if (!document.hidden) again(); });
    }

    // ---- Installed app (Capacitor / APK): compare this build with the newest GitHub Release ----
    var isNative = !!(window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform());
    function buildOf(txt) { var m = String(txt || '').match(/(\d+)\s*$/); return m ? +m[1] : 0; }   // "build 5" / "v5" / "build-5" -> 5
    function checkRelease() {
        var repo = (window.APP_CONFIG || {}).githubRepo;
        if (!repo || /YOUR-REPO-NAME/.test(repo)) return;
        Promise.all([
            fetch('version.json', { cache: 'no-store' }).then(function (r) { return r.json(); }),
            fetch('https://api.github.com/repos/' + repo + '/releases/latest').then(function (r) { return r.json(); })
        ]).then(function (res) {
            var mine = res[0].build || 0, rel = res[1];
            var latest = Math.max(buildOf(rel.tag_name), buildOf(rel.name));
            if (!latest || latest <= mine) return;
            var apk = (rel.assets || []).filter(function (a) { return /\.apk$/i.test(a.name); })[0];
            var url = apk ? apk.browser_download_url : rel.html_url;
            show('Build ' + latest + ' is ready. Install it over this app, your saves are kept.', function () {
                try { save(); } catch (e) { }
                var B = window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.Browser;
                if (B && B.open) B.open({ url: url }); else window.open(url, '_blank');
            });
            if (banner) banner.querySelector('.up').textContent = 'Download';
        }).catch(function () { });
    }
    if (isNative) {
        setTimeout(checkRelease, 4000);
        setInterval(checkRelease, CHECK_MS);
        document.addEventListener('visibilitychange', function () { if (!document.hidden) checkRelease(); });
        return;                       // no service worker inside the app: files are bundled
    }

    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
        navigator.serviceWorker.addEventListener('controllerchange', function () {
            if (reloading) return; reloading = true; location.reload();
        });
        navigator.serviceWorker.register('sw.js').then(watch).catch(pollVersionFile);
    } else {
        pollVersionFile();
    }
})();
