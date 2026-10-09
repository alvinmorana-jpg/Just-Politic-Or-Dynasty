    // Try to lock landscape on phones. Browsers only allow this in fullscreen
    // (Android Chrome); iOS Safari ignores it, so the overlay above covers that case.
    (function () {
        if (!window.DEVICE || !DEVICE.isPhone) return;   // PCs and tablets are never locked
        function lock() {
            try {
                var el = document.documentElement;
                var fs = el.requestFullscreen ? el.requestFullscreen() : (el.webkitRequestFullscreen && el.webkitRequestFullscreen());
                Promise.resolve(fs).catch(function () { }).then(function () {
                    if (screen.orientation && screen.orientation.lock) {
                        return screen.orientation.lock('landscape').catch(function () { });
                    }
                });
            } catch (e) { }
        }
        function once() { lock(); removeEventListener('touchend', once); removeEventListener('click', once); }
        addEventListener('touchend', once, { passive: true });
        addEventListener('click', once);
    })();
