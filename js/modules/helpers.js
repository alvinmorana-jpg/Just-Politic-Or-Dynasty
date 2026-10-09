// HDI (0-1): geometric mean of health, education and income indices, like the UN formula. Other provinces are estimated from their development score.
const hdiOf = (d, h = 0, e = 0, n = 0) => { const q = x => Math.max(.2, Math.min(1, x)), b = .3 + .65 * d / 100; return +Math.cbrt(q(b + h) * q(b + e) * q(b + n)).toFixed(3) };
const hdi = () => { const b = S.b, p = S.prog || {}, l = S.law || {}; return hdiOf(S.v.dev, (b.hospital || 0) * .012 + (p.uhc ? .02 : 0) + (S.hap - 60) * .0006 + (S.food > 100 ? .01 : -.01), ((b.school || 0) + (b.university || 0)) * .012 + (p.schol ? .02 : 0) + (l.edu ? .015 : 0), ((b.market + b.factory + b.road) + (b.datacenter || 0) + (b.port || 0) + (b.resort || 0) || 0) * .008 + (p.msme ? .01 : 0) + (p.road ? .01 : 0)) };

const rawAff = (p, l) => { const t = LT[l.id]; let d = 0; for (const k in t) d += (PT[p].l[k] || 0) * t[k]; return cl(.5 + d * .6, .08, .92) }, aff = (p, l) => { const a = rawAff(p, l); return p == S.party ? Math.min(.97, a + .3) : a };
const tag = l => { const r = rawAff(S.party, l); return r > .7 ? ' · ✔ fits your party' : r < .3 ? ' · ⚠ against your party' : '' }, pa = () => Math.round(pt().act.c * pm());
function pact() { const a = pt().act; if (S.day - S.aCd < 28 || S.gold < pa()) return; S.gold -= pa(); a.fn(S); S.aCd = S.day; toast('⭐ ' + a.n); ui() }
const lch = l => Math.round(cl(Object.keys(S.seats).reduce((a, p) => a + S.seats[p] / 100 * aff(p, l), 0) * 100, 5, 95));

const dark = u => u < .7 ? 0 : u < .8 ? (u - .7) / .1 : u < .95 ? 1 : (1 - u) / .05, hrs = u => u < .8 ? 6 + u / .8 * 12 : (18 + (u - .8) / .2 * 12) % 24;
const clock = u => { const h = hrs(u); return (u < .8 ? '☀️ ' : '🌙 ') + String(Math.floor(h)).padStart(2, '0') + ':' + String(Math.floor(h % 1 * 60)).padStart(2, '0') };
const dstr = d => `Year ${(S && S.y0 || 2026) + Math.floor(d / 84)} · Month ${Math.floor(d % 84 / 7) + 1} · Day ${d % 7 + 1}`;
const job = (k, id) => S.jobs.find(j => j.k == k && j.id == id), addJob = (k, id, n, x) => S.jobs.push(Object.assign({ k, id, left: n, tot: n }, x));
const money = (n, k) => { const c = (LOCS[k || CTRY] || LOCS.PH).cur, m = Math.abs(n) * c.u, sg = n < 0 ? '−' : ''; if (!m) return c.sym + '0'; return sg + c.sym + (m >= 1000 ? (m >= 10000 ? Math.round(m / 1000) : Math.round(m / 10) / 100) + 'B' : m >= 1 ? Math.round(m) + 'M' : Math.round(m * 1000) + 'K') }, mt = s => String(s).replace(/ompanys\b/g, 'ompanies').replace(/(\d+(?:\.\d+)?) gold\b/g, (_, n) => money(+n));
function toast(t) { t = mt(t); S.log.unshift(t); const e = $('toast'); e.textContent = t; e.className = 'on'; clearTimeout(toast.t); toast.t = setTimeout(() => e.className = '', 2600) }
