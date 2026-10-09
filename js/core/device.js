// Device detection: sets  <html data-device="phone|tablet|pc" data-orient="portrait|landscape">
// and exposes window.DEVICE = { type, isPhone, isTablet, isPC, isTouch, isIOS, orient }.
(function () {
    var nav = navigator, ua = nav.userAgent || '';
    var uad = nav.userAgentData;                       // Chromium: { mobile: bool }
    var touchPts = nav.maxTouchPoints || 0;
    var coarse = matchMedia('(pointer:coarse)').matches;
    var noHover = matchMedia('(hover:none)').matches;
    var shortSide = Math.min(screen.width, screen.height);  // physical screen, not the window size

    var isIPad = /iPad/.test(ua) || (/Macintosh/.test(ua) && touchPts > 1); // iPadOS pretends to be a Mac
    var isIOS = /iPhone|iPod/.test(ua) || isIPad;
    var phoneUA = /iPhone|iPod|Windows Phone|BlackBerry|Opera Mini|IEMobile/.test(ua) ||
        (/Android/.test(ua) && /Mobile/.test(ua)) || (uad && uad.mobile === true && !isIPad);
    var tabletUA = isIPad || (/Android/.test(ua) && !/Mobile/.test(ua));

    var type;
    if (tabletUA) type = 'tablet';
    else if (phoneUA) type = 'phone';
    else if (coarse && noHover && shortSide <= 820) type = 'phone';   // unknown touch device, small screen
    else if (coarse && noHover && shortSide > 820) type = 'tablet';
    else type = 'pc';                                                 // mouse / trackpad / keyboard

    var D = window.DEVICE = {
        type: type, isPhone: type === 'phone', isTablet: type === 'tablet', isPC: type === 'pc',
        isTouch: touchPts > 0 || coarse, isIOS: isIOS, orient: 'landscape'
    };

    function apply() {
        D.orient = innerHeight > innerWidth ? 'portrait' : 'landscape';
        var h = document.documentElement;
        h.setAttribute('data-device', D.type);
        h.setAttribute('data-orient', D.orient);
    }
    apply();
    addEventListener('resize', apply);
    addEventListener('orientationchange', apply);
})();
