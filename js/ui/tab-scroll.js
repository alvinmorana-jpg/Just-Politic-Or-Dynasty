    // Keep the active tab visible in the scrollable tab bar after every render
    (function () {
        function fix() {
            var on = document.querySelector('.seg.tabs button.on');
            if (on) { var bar = on.parentElement; bar.scrollLeft = on.offsetLeft - (bar.clientWidth - on.offsetWidth) / 2; }
        }
        new MutationObserver(fix).observe(document.body, { childList: true, subtree: true });
        fix();
    })();
