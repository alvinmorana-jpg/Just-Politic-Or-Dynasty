let B0 = [197, 75, 1162, 1930], WB = B0, NB = [], NBL = [], nbDirty = true; let moved = false, V = { cx: B0[0] + B0[2] / 2, cy: B0[1] + B0[3] / 2, w: B0[2] };
const ar = () => { const r = map.getBoundingClientRect(); return r.width ? r.height / r.width : 1.6 }, fitW = () => Math.max(B0[2], B0[3] / ar()), maxW = () => Math.max(WB[2], WB[3] / ar()), vb = () => { const h = V.w * ar(); return [V.cx - V.w / 2, V.cy - h / 2, V.w, h] };
function clampV() { const f = fitW(); V.w = Math.min(maxW(), Math.max(f / 10, V.w)); V.cx = Math.min(WB[0] + WB[2], Math.max(WB[0], V.cx)); V.cy = Math.min(WB[1] + WB[3], Math.max(WB[1], V.cy)) }
function resetV() { V = { cx: B0[0] + B0[2] / 2, cy: B0[1] + B0[3] / 2, w: fitW() }; draw() }
function zoomAt(f, x, y) { const w = V.w; V.w = w * f; clampV(); const k = V.w / w; V.cx = x - (x - V.cx) * k; V.cy = y - (y - V.cy) * k; clampV(); draw() }
function toSvg(px, py) { const r = map.getBoundingClientRect(), b = vb(); return [b[0] + (px - r.left) / r.width * b[2], b[1] + (py - r.top) / r.height * b[3]] }
function zoomC(f) { zoomAt(f, V.cx, V.cy) }
function focusV(v) { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; v.r[0].forEach((n, j) => { if (j % 2) { b = Math.min(b, n); d = Math.max(d, n) } else { a = Math.min(a, n); c = Math.max(c, n) } }); V.cx = (a + c) / 2; V.cy = (b + d) / 2; V.w = Math.max((c - a) * 3, (d - b) * 3 / ar(), fitW() / 8); clampV(); draw() }
$('zi').onclick = () => zoomC(.6); $('zo').onclick = () => zoomC(1 / .6); $('zr').onclick = resetV;
map.addEventListener('wheel', e => { e.preventDefault(); const [x, y] = toSvg(e.clientX, e.clientY); zoomAt(e.deltaY < 0 ? .8 : 1.25, x, y) }, { passive: false });
const ptr = new Map(); let pd0 = 0, sx, sy;
map.addEventListener('pointerdown', e => { ptr.set(e.pointerId, [e.clientX, e.clientY]); moved = false; sx = e.clientX; sy = e.clientY; if (ptr.size == 2) { const [a, b] = [...ptr.values()]; pd0 = Math.hypot(a[0] - b[0], a[1] - b[1]) } });
window.addEventListener('pointermove', e => {
    if (!ptr.has(e.pointerId)) return; const o = ptr.get(e.pointerId); ptr.set(e.pointerId, [e.clientX, e.clientY]);
    if (ptr.size == 2) { const [a, b] = [...ptr.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (pd0 && Math.abs(d - pd0) > 6) { moved = true; const [x, y] = toSvg((a[0] + b[0]) / 2, (a[1] + b[1]) / 2); zoomAt(pd0 / d, x, y); pd0 = d } return }
    if (!moved && Math.hypot(e.clientX - sx, e.clientY - sy) < 6) return; moved = true; const r = map.getBoundingClientRect();
    V.cx -= (e.clientX - o[0]) / r.width * V.w; V.cy -= (e.clientY - o[1]) / r.width * V.w; clampV(); map.setAttribute('viewBox', vb().join(' '))
});
['pointerup', 'pointercancel'].forEach(t => window.addEventListener(t, e => { ptr.delete(e.pointerId); pd0 = 0; setTimeout(() => { if (!ptr.size) moved = false }, 0) }));
window.addEventListener('resize', () => { clampV(); draw() });
