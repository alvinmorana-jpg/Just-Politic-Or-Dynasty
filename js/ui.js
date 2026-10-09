/* Display preferences (device layout, text size, theme, motion), install prompt, animation helpers */
const UI_KEY = 'dyn_ui';
const UI = { dev: 'auto', scale: 'm', theme: 'auto', motion: 'on', vib: true };
try { Object.assign(UI, JSON.parse(localStorage.getItem(UI_KEY) || '{}')) } catch (e) { }
let uiOpen = false, deferredInstall = null;
const DEVICES = [
    ['auto', '✨', 'Auto', 'Fits this screen'],
    ['phone', '📱', 'Phone', 'Android / iPhone'],
    ['tablet', '📲', 'Tablet', 'iPad / Android tablet'],
    ['desktop', '💻', 'PC', 'Laptop / desktop'],
    ['tv', '🖥️', 'Big screen', 'TV / wide monitor']
];
const DEV_NAME = { phone: 'Phone', tablet: 'Tablet', desktop: 'PC', tv: 'Big screen' };
function detectDev() { const w = (typeof window !== 'undefined' && window.innerWidth) || 1024; return w < 700 ? 'phone' : w < 1100 ? 'tablet' : w < 1700 ? 'desktop' : 'tv' }
function curDev() { return UI.dev == 'auto' ? detectDev() : UI.dev }
function applyUI() {
    try {
        const h = document.documentElement; if (!h || !h.dataset) return;
        h.dataset.dev = curDev(); h.dataset.scale = UI.scale; h.dataset.motion = UI.motion;
        if (UI.theme == 'auto') h.removeAttribute('data-theme'); else h.dataset.theme = UI.theme;
    } catch (e) { }
}
function saveUI() { try { localStorage.setItem(UI_KEY, JSON.stringify(UI)) } catch (e) { } }
function setUI(k, v) { UI[k] = v; saveUI(); applyUI(); lastAnimKey = ''; render() }
function openUI() { uiOpen = true; render() }
function closeUI() { uiOpen = false; render() }
function uiReset() { Object.assign(UI, { dev: 'auto', scale: 'm', theme: 'auto', motion: 'on', vib: true }); saveUI(); applyUI(); render() }
function buzz(ms) { try { if (UI.vib && navigator.vibrate) navigator.vibrate(ms || 12) } catch (e) { } }
function toggleFull() { try { const d = document; if (d.fullscreenElement) d.exitFullscreen(); else d.documentElement.requestFullscreen() } catch (e) { say('Full screen is not available here') } }
function installApp() { if (!deferredInstall) return say('Use your browser menu: Add to Home screen'); deferredInstall.prompt(); deferredInstall = null; render() }
try {
    window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstall = e; if (uiOpen) render() });
    window.addEventListener('resize', () => { if (UI.dev == 'auto') { const d = detectDev(), h = document.documentElement; if (h.dataset.dev != d) { applyUI(); lastAnimKey = ''; render() } } });
} catch (e) { }
applyUI();

const uiOpt = (k, v, label) => `<button class="opt ${UI[k] == v ? 'on' : ''}" onclick="setUI('${k}','${v}')">${label}</button>`;
function settingsModal() {
    if (!uiOpen) return '';
    let canVib = false, canFull = false; try { canVib = !!navigator.vibrate; canFull = !!(document.documentElement && document.documentElement.requestFullscreen) } catch (e) { }
    return `<div class="modal-bg" onclick="if(event.target===this)closeUI()"><div class="modal ui-modal"><button class="modal-close" onclick="closeUI()">✕</button>
    <h2 style="margin:0 0 2px">⚙ Display &amp; device</h2><div class="m">Pick the layout that matches your screen. Layout now: <b>${DEV_NAME[curDev()]}</b>.</div>
    <h3 class="ui-h">Device</h3><div class="devgrid">${DEVICES.map(([k, e, t, s]) => `<button class="dev ${UI.dev == k ? 'on' : ''}" onclick="setUI('dev','${k}')"><span class="de">${e}</span><b>${t}</b><small>${s}</small></button>`).join('')}</div>
    <h3 class="ui-h">Text &amp; size</h3><div class="optrow">${uiOpt('scale', 's', 'Small')}${uiOpt('scale', 'm', 'Normal')}${uiOpt('scale', 'l', 'Large')}</div>
    <h3 class="ui-h">Theme</h3><div class="optrow">${uiOpt('theme', 'auto', '🌗 Auto')}${uiOpt('theme', 'light', '☀️ Light')}${uiOpt('theme', 'dark', '🌙 Dark')}</div>
    <h3 class="ui-h">Animations</h3><div class="optrow">${uiOpt('motion', 'on', '✨ Full')}${uiOpt('motion', 'low', '🌿 Reduced')}${uiOpt('motion', 'off', '⏹ Off')}</div>
    ${canVib ? `<h3 class="ui-h">Touch feedback</h3><div class="optrow"><button class="opt ${UI.vib ? 'on' : ''}" onclick="UI.vib=!UI.vib;saveUI();buzz(30);render()">${UI.vib ? '📳 Vibration on' : 'Vibration off'}</button></div>` : ''}
    <h3 class="ui-h">App</h3><div class="optrow">${deferredInstall ? `<button class="opt" onclick="installApp()">⬇ Install app</button>` : ''}${canFull ? `<button class="opt" onclick="toggleFull()">⛶ Full screen</button>` : ''}${typeof checkForUpdate == 'function' ? `<button class="opt" onclick="checkForUpdate()">🔄 Check for updates</button>` : ''}<button class="opt" onclick="uiReset()">↺ Reset display</button></div>
    <div class="m" style="margin-top:10px">Tip: on Android Chrome open the ⋮ menu and choose <b>Add to Home screen</b> to play like a real app. Settings are remembered on this device.</div><div class="m" style="margin-top:6px">Version ${typeof APP_VERSION != 'undefined' ? APP_VERSION : '–'}</div></div></div>`
}

/* club name with optional flag/emoji */
const clubLabel = (n, f) => f ? f + ' ' + n : n;

/* live-update the width/time of upgrade progress bars without re-rendering the page */
function tickProgress() {
    try {
        if (!G || !document.querySelectorAll) return;
        document.querySelectorAll('.prog[data-s]').forEach(el => {
            const s = +el.dataset.s, e = +el.dataset.e, p = Math.max(0, Math.min(100, (G.c - s) / (e - s) * 100)), i = el.firstElementChild, nx = el.nextElementSibling;
            if (i) i.style.width = p + '%';
            if (nx) { const t = nx.querySelector('.pp'), r = nx.querySelector('.pl2'); if (t) t.textContent = Math.round(p) + '%'; if (r) r.textContent = cd(e - G.c) }
        })
    } catch (e) { }
}
/* replace html but glide any [data-sm] bar from its old width to the new one */
function swapHTML(el, html) {
    if (!el) return;
    let old = []; try { old = [...el.querySelectorAll('[data-sm]')].map(x => x.style.width) } catch (e) { }
    el.innerHTML = html;
    try { [...el.querySelectorAll('[data-sm]')].forEach((x, i) => { const t = x.style.width; if (old[i] != null && old[i] !== t) { x.style.width = old[i]; x.getBoundingClientRect(); x.style.width = t } }) } catch (e) { }
}
/* animate numbers in elements marked data-count */
function countUps() {
    try {
        if (UI.motion == 'off') return;
        document.querySelectorAll('[data-count]').forEach(el => {
            const to = +el.dataset.count, pre = el.dataset.pre || '', dur = 700, t0 = performance.now();
            if (isNaN(to)) return;
            const step = t => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = pre + Math.round(to * e).toLocaleString(); if (k < 1) requestAnimationFrame(step) };
            requestAnimationFrame(step)
        })
    } catch (e) { }
}
