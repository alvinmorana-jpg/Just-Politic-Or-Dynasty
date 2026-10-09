// ---- Neighbouring countries: drawn greyed-out beside the one you play, at their real-life position ----
// Each country map was traced separately (own scale/offset), so each has a lon/lat calibration:
// pixel (x0,y0) = (lon0,lat0) and sx/sy = pixels per degree. Malaysia's peninsula and Borneo were drawn at
// different scales, so it has two groups. 'c' = rough centre (lon,lat) of a group: each neighbour is placed with the host group nearest to it.
const GEO = {
    PH: { g: [{ c: [122, 12], x0: 212, lon0: 116.95, sx: 117.5, y0: 90, lat0: 20.8, sy: 117.5 }], home: 0 },
    MY: { g: [{ c: [113.5, 4.5], n: 'Sabah,Sarawak', x0: 938, lon0: 109.62, sx: 77.8, y0: 612, lat0: .85, sy: 77.8 }, { c: [102, 4.5], x0: 179, lon0: 99.62, sx: 117.6, y0: 168, lat0: 6.72, sy: 127.7 }], home: 0 },
    BN: { g: [{ c: [114.7, 4.5], x0: 20, lon0: 114.071, sx: 870, y0: 20, lat0: 5.047, sy: 870 }], home: 0 },
    SG: { g: [{ c: [103.82, 1.35], x0: 0, lon0: 103.595, sx: 2600, y0: 0, lat0: 1.475, sy: 2600 }], home: 0 }
};
const OVER = { BN: 1, SG: 1 };
const pathD = r => r.map(q => { let t = 'M'; for (let j = 0; j < q.length; j += 2)t += (j ? 'L' : '') + q[j] + ',' + q[j + 1]; return t + 'Z' }).join('');
function nbBuild(k) { // every other country, re-projected into country k's pixel frame
    if (!GEO[k]) return []; const HG = GEO[k].g;
    return Object.keys(C).filter(o => o != k && GEO[o]).map(o => ({
        c: o, name: C[o].name, over: !!OVER[o], pv: C[o].pv.map(([n, r]) => {
            const G = GEO[o].g, g = G.find(x => x.n && x.n.split(',').includes(n)) || G[G.length - 1];
            const lo = g.lon0 + (r[0][0] - g.x0) / g.sx, la = g.lat0 - (r[0][1] - g.y0) / g.sy, dz = z => Math.hypot(z.c[0] - lo, z.c[1] - la), h = HG.reduce((a, b) => dz(a) <= dz(b) ? a : b);
            const rr = r.map(q => { const t = []; for (let j = 0; j < q.length; j += 2) t.push(+(h.x0 + (g.lon0 + (q[j] - g.x0) / g.sx - h.lon0) * h.sx).toFixed(1), +(h.y0 + (h.lat0 - (g.lat0 - (q[j + 1] - g.y0) / g.sy)) * h.sy).toFixed(1)); return t });
            return { n, r: rr, d: pathD(rr) }
        })
    }))
}
function viewBounds(k, m) { // country bbox, grown only towards neighbouring land that lies within m x its size
    const [x, y, w, hh] = C[k].bb, e = m * Math.max(w, hh); let a = x, b = y, c = x + w, d = y + hh;
    NB.forEach(o => o.pv.forEach(p => p.r.forEach(q => { for (let j = 0; j < q.length; j += 2) { const X = q[j], Y = q[j + 1]; if (X > x - e && X < x + w + e && Y > y - e && Y < y + hh + e) { a = Math.min(a, X); c = Math.max(c, X); b = Math.min(b, Y); d = Math.max(d, Y) } } })));
    return [a, b, c - a, d - b]
}
function nbLabels(k) { // one label per neighbour, in the open part of its visible land (clear of your own land and the view edges)
    const [x, y, w, hh] = B0, G = 36, out = [], own = C[k].pv.flatMap(p => p[1]);
    const inP = (X, Y, q) => { let s = false; for (let i = 0, j = q.length - 2; i < q.length; j = i, i += 2) if ((q[i + 1] > Y) != (q[j + 1] > Y) && X < (q[j] - q[i]) * (Y - q[i + 1]) / (q[j + 1] - q[i + 1]) + q[i]) s = !s; return s };
    const boxed = rs => rs.map(q => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (let j = 0; j < q.length; j += 2) { a = Math.min(a, q[j]); c = Math.max(c, q[j]); b = Math.min(b, q[j + 1]); d = Math.max(d, q[j + 1]) } return { q, a, b, c, d } });
    const inAny = (X, Y, R) => R.some(r => X >= r.a && X <= r.c && Y >= r.b && Y <= r.d && inP(X, Y, r.q)), ob = boxed(own), sd = (X, Y, q) => { let m = 1e9; for (let i = 0, j = q.length - 2; i < q.length; j = i, i += 2) { const ax = q[j], ay = q[j + 1], bx = q[i] - ax, by = q[i + 1] - ay, L = bx * bx + by * by, u = L ? Math.max(0, Math.min(1, ((X - ax) * bx + (Y - ay) * by) / L)) : 0; m = Math.min(m, Math.hypot(X - ax - u * bx, Y - ay - u * by)) } return m };
    NB.forEach(o => {
        const rs = boxed(o.pv.flatMap(p => p.r)); let best = null, n = 0;
        for (let a = 0; a < G; a++) for (let b = 0; b < G; b++) {
            const X = x + (a + .5) * w / G, Y = y + (b + .5) * hh / G; if (!inAny(X, Y, rs) || inAny(X, Y, ob)) continue; n++;
            let c = Math.min(X - x, x + w - X, Y - y, y + hh - Y); for (const r of ob) c = Math.min(c, sd(X, Y, r.q)); if (!best || c > best.c) best = { c, x: X, y: Y }
        }
        if (best && n >= 8) out.push({ c: o.c, t: o.name.toUpperCase(), x: +best.x.toFixed(1), y: +best.y.toFixed(1) })
    });
    return out
}
function setView(k) { NB = nbBuild(k); B0 = viewBounds(k, .12); WB = viewBounds(k, .6); NBL = nbLabels(k); nbDirty = true }
const nbHtml = over => NB.filter(o => o.over == over).map(o => { const dd = dOn() && S.dip[o.c], st = dd ? ` style="fill:hsla(${Math.round(cl((dd.r + 100) / 200, 0, 1) * 125)},60%,50%,.4)"` : ''; return '<g>' + o.pv.map(p => `<path class="nb" data-c="${o.c}"${st} d="${p.d}"/>`).join('') + '</g>' }).join(''), nbLab = () => NBL.map(l => { const dd = dOn() && S.dip[l.c]; return `<text class="nbl" data-c="${l.c}" x="${l.x}" y="${l.y}">${dd ? NATS[l.c][1] + ' ' : ''}${l.t}${dd ? ` <tspan style="fill:${dCol(dd.r)}">●</tspan>` : ''}</text>` }).join('');
const thumb = k => C[k].pv.map(([n, r]) => `<path d="${r.map(q => { let t = 'M'; for (let j = 0; j < q.length; j += 2)t += (j ? 'L' : '') + q[j] + ',' + q[j + 1]; return t + 'Z' }).join('')}"/>`).join('');
function pickCountry(k) { setCountry(k); menu(); resetV() }
