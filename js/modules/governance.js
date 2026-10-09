const RG = [['Ilocos Region', 'Ilocos Norte,Ilocos Sur,La Union,Pangasinan'], ['Cagayan Valley', 'Batanes,Cagayan,Isabela,Nueva Vizcaya,Quirino'], ['Cordillera (CAR)', 'Abra,Apayao,Benguet,Ifugao,Kalinga,Mountain Province'], ['Central Luzon', 'Aurora,Bataan,Bulacan,Nueva Ecija,Pampanga,Tarlac,Zambales'], ['CALABARZON', 'Batangas,Cavite,Laguna,Quezon,Rizal'], ['MIMAROPA', 'Marinduque,Occidental Mindoro,Oriental Mindoro,Palawan,Romblon'], ['Bicol Region', 'Albay,Camarines Norte,Camarines Sur,Catanduanes,Masbate,Sorsogon'], ['Western Visayas', 'Aklan,Antique,Capiz,Guimaras,Iloilo,Negros Occidental'], ['Central Visayas', 'Bohol,Cebu,Negros Oriental,Siquijor'], ['Eastern Visayas', 'Biliran,Eastern Samar,Leyte,Northern Samar,Samar,Southern Leyte'], ['Zamboanga Peninsula', 'Zamboanga del Norte,Zamboanga del Sur,Zamboanga Sibugay'], ['Northern Mindanao', 'Bukidnon,Camiguin,Lanao del Norte,Misamis Occidental,Misamis Oriental'], ['Davao Region', 'Davao de Oro,Davao del Norte,Davao del Sur,Davao Occidental,Davao Oriental'], ['SOCCSKSARGEN', 'Cotabato,Sarangani,South Cotabato,Sultan Kudarat'], ['Caraga', 'Agusan del Norte,Agusan del Sur,Dinagat Islands,Surigao del Norte,Surigao del Sur'], ['BARMM', 'Basilan,Lanao del Sur,Maguindanao,Sulu,Tawi-Tawi']];
const regOf = n => RG.findIndex(r => r[1].split(',').includes(n));
const SY = {
    soc: { n: "People's Congress System", d: 'The president is chosen by the Party Congress, not by direct vote (as in China). Your party seats decide almost everything, but openness and trust suffer.', et: '🏛️ Party Congress! Delegates choose the head of state — there is no direct vote.', eb: 16, ap: 1, cost: 100, once: { hap: -5, int: -15, sup: -4 }, fx: { thr: -.2, dev: 2, inc: .03 } },
    lib: { n: 'Federal Parliamentary System', d: 'Regions gain autonomy and the leader is chosen by parliament. Coalition deals make re-election easier.', et: '🏛️ Vote of confidence! Parliament decides whether you remain leader.', eb: 6, cost: 80, once: { hap: 3, int: 4 }, fx: { inc: .05 } },
    con: { n: 'Strong Presidency Charter', d: 'A firm executive mandate confirmed by an Electoral College, with appointed local heads. Order is firm, openness suffers.', et: '🏛️ Mandate review! The Electoral College confirms or removes the president.', eb: 10, ap: 1, cost: 80, once: { sup: 4, hap: -2, int: -8 }, fx: { thr: -.3 } },
    nat: { n: 'Nationalist Referendum Charter', d: 'Key national issues go to direct citizen plebiscites that favor local producers.', et: '🏛️ National plebiscite! Citizens vote directly on your leadership.', eb: 8, cost: 70, once: { hap: 3 }, fx: { food: .06, inc: -.02 } },
    grn: { n: 'Ecological Constitution', d: "Rights of Nature and citizens' assemblies guide national policy.", et: "🏛️ Citizens' Assembly! Randomly chosen citizens review your leadership.", eb: 6, cost: 70, once: { hap: 4 }, fx: { dr: .3, food: .04, inc: -.03 } },
    tec: { n: 'Digital Democracy Charter', d: 'Secure e-voting and open data let citizens vote on policy continuously.', et: '🏛️ National e-Vote! Every citizen votes securely online.', eb: 8, cost: 80, once: { int: 10 }, fx: { int: .5, dev: 2 } }
};

const govN = () => S.lv == 1 ? TM.length - 1 : RG.length - 1, govA = () => S.dt == S.lv ? Math.round((S.dyn || 0) * govN()) : 0, gw = () => S.lv == 1 ? 'province' : 'regional';
function ratify(l) {
    if (!S.lv || S.sys && SY[S.party].ap) return true; const N = govN(), A = govA(), p = cl(.5 + rawAff(S.party, l) * .4 + (S.sup - 50) / 200, .3, .95); let no = 0;
    for (let i = 0; i < N - A; i++)if (Math.random() > p) no++;
    if (!no) { S.log.unshift('🤝 All ' + N + ' ' + gw() + ' ' + LOC.gv + 's approved' + (A ? ' (' + A + ' dynasty allies)' : '') + '.'); return true }
    toast('🚫 ' + no + ' of ' + N + ' ' + gw() + ' ' + LOC.gv + 's refused to approve "' + l.n + '". The law is blocked.'); return false
}
const govNote = () => !S.lv ? '' : S.sys && SY[S.party].ap ? '<p><small>🏛️ ${LOC.Gv}s are party appointees: they always approve your laws.</small></p>' : `<p><small>🤝 Every new law also needs approval from all ${govN()} ${gw()} ${LOC.gv}s${govA() ? ` — ${govA()} of them are your dynasty allies` : ''}.</small></p>`;

const RELS = ['Catholic', 'Islam', 'Protestant', 'Iglesia ni Cristo', 'Indigenous/Aglipayan'], ECO = ['Farming', 'Fishing', 'Industry', 'Tourism', 'Trade'], ECW = { Farming: ['nat', 'soc'], Fishing: ['grn', 'nat'], Industry: ['lib', 'tec'], Tourism: ['grn', 'lib'], Trade: ['lib', 'con'] };
const NP = ['San Jose', 'Santa Maria', 'San Isidro', 'San Miguel', 'Santo Tomas', 'San Fernando', 'Santa Cruz', 'San Antonio', 'San Pedro', 'San Juan', 'Santa Rosa', 'San Pablo', 'Santa Ana', 'San Vicente', 'San Roque', 'Santo Niño', 'San Mateo', 'Santa Barbara'],
    PF = ['Maria', 'Jose', 'Juan', 'Ana', 'Pedro', 'Luz', 'Ramon', 'Elena', 'Carlos', 'Rosa', 'Miguel', 'Teresa'], PS = ['Santos', 'Reyes', 'Cruz', 'Bautista', 'Garcia', 'Mendoza', 'Torres', 'Ramos', 'Aquino', 'Villanueva', 'Dela Cruz', 'Castillo'];
const hs = s => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0 },
    mkr = s => { let a = hs(s); return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } };
function relOf(n, r) { if (LOC.rel) return LOC.rel(n, r); const m = /Maguindanao|Lanao del Sur|Sulu|Basilan|Tawi-Tawi|BARMM/.test(n) ? [8, 85, 2, 1, 4] : /Cotabato|Sultan Kudarat|Lanao del Norte|Zamboanga|SOCCSKSARGEN|Sarangani/.test(n) ? [60, 30, 5, 2, 3] : /Benguet|Ifugao|Kalinga|Mountain|Apayao|Abra|Cordillera/.test(n) ? [40, 0, 25, 5, 30] : /Bulacan|Nueva Ecija|Rizal|Cavite|Pampanga|Tarlac|Central Luzon|CALABARZON|Isabela|Nueva Vizcaya/.test(n) ? [78, 2, 5, 10, 5] : [84, 3, 6, 4, 3]; let q = r() * 100; for (let i = 0; i < 5; i++) { if (q < m[i]) return RELS[i]; q -= m[i] } return RELS[0] }
function uBase(L, x) {
    let rows;
    if (L == 0) { const r = mkr(x.n), n = Math.min(9, 3 + Math.floor(x.pop / 500)), w = Array.from({ length: n }, () => .4 + r()), t = w.reduce((a, b) => a + b, 0), pl = [...NP]; rows = w.map((q, i) => ({ n: i ? pl.splice(Math.floor(r() * pl.length), 1)[0] : (LOC.cap && LOC.cap[x.n]) || x.n + ' City', pop: Math.max(1, Math.round(x.pop * q / t)) })) }
    else if (L == 1) rows = all.filter(v => RG[x][1].split(',').includes(v.n)).map(v => ({ n: v.n, pop: v.pop }));
    else rows = RG.map(g => ({ n: g[0], pop: all.filter(v => g[1].split(',').includes(v.n)).reduce((a, v) => a + v.pop, 0) }));
    return rows.map(u => {
        const r = mkr(L + u.n), eco = ECO[Math.floor(r() * ECO.length)], rl = relOf(L ? u.n : x.n, r), ws = Object.keys(PT).map(k => [k, .5 + r() * (ECW[eco].includes(k) ? 2 : 1)]), tw = ws.reduce((a, b) => a + b[1], 0); let q = r() * tw, fol = ws[0][0]; for (const [k, w] of ws) { if (q < w) { fol = k; break } q -= w }
        return { ...u, eco, rel: rl, fol, mn: PF[Math.floor(r() * PF.length)] + ' ' + PS[Math.floor(r() * PS.length)], b: Math.round(r() * 10 - 5) }
    })
}
// your party starts with about 20% of the council seats (host city always yours); reviews move it up or down from there
function fit20(U, P) {
    const want = Math.max(1, Math.round(U.length * .2)), ks = Object.keys(PT).filter(k => k != P);
    let mine = U.filter(u => u.mp == P);
    while (mine.length > want) { const c = mine.filter(u => !u.hq); if (!c.length) break; const u = c[Math.floor(Math.random() * c.length)]; u.mp = ks[Math.floor(Math.random() * ks.length)]; mine = U.filter(x => x.mp == P) }
    while (mine.length < want) { const c = U.filter(u => u.mp != P); if (!c.length) break; c[Math.floor(Math.random() * c.length)].mp = P; mine = U.filter(x => x.mp == P) }
}
function monthReview() {
    const rt = S.hap * .35 + S.sup * .3 + S.int * .2 + (100 - S.thr) * .15, d = rt - 55; if (Math.abs(d) < 5 || Math.random() > Math.min(.3, Math.abs(d) / 50)) return;
    const b = S.seats[S.party]; shift(d > 0 ? 100 / S.cities.length : -100 / S.cities.length);
    if (S.seats[S.party] != b) toast(d > 0 ? '📈 Your party gained a council seat (rating ' + Math.round(rt) + ').' : '📉 Your party lost a council seat (rating ' + Math.round(rt) + ').')
}
function startUnits(v, h, P) {
    const U = uBase(0, v), ks = Object.keys(PT); U.forEach((u, i) => { u.hq = i == h; u.mp = u.hq ? P : Math.random() < .6 ? u.fol : ks[Math.floor(Math.random() * ks.length)] });
    fit20(U, P); return U
}
function tierUnits() {
    const L = S.lv, U = uBase(L, L == 1 ? S.rg : 0), ks = Object.keys(PT), hn = L == 1 ? all[S.hi].n : RG[S.rg][0];
    U.forEach(u => { u.hq = u.n == hn; u.mp = u.hq ? S.party : Math.random() < .55 ? u.fol : ks[Math.floor(Math.random() * ks.length)] });
    fit20(U, S.party); if (S.dt == L) U.filter(u => !u.hq && u.mp != S.party).slice(0, govA()).forEach(u => u.mp = S.party); return U
}
const uap = u => cl(Math.round(S.sup + (S.int - 50) * .1 - (S.thr - 30) * .08 + (u.fol == S.party ? 12 : -3) + (u.hq ? 10 : 0) + u.b + (u.mp == S.party ? 4 : 0)), 0, 100);
function sync() { const n = S.cities.length, s = {}; Object.keys(PT).forEach(k => s[k] = 0); S.cities.forEach(u => s[u.mp] += 100 / n); S.seats = s }
function shift(n) {
    const U = S.cities, k = Math.floor(Math.abs(n) / 100 * U.length + Math.random()), ks = Object.keys(PT).filter(p => p != S.party);
    for (let i = 0; i < k; i++) { if (n > 0) { const c = U.filter(u => u.mp != S.party).sort((a, b) => uap(b) - uap(a))[0]; if (c) c.mp = S.party } else { const c = U.filter(u => u.mp == S.party && !u.hq); if (c.length) c[Math.floor(Math.random() * c.length)].mp = ks[Math.floor(Math.random() * ks.length)] } } sync()
}
const UN = ['mayor', 'governor', 'regional head'];
function yearReview() {
    const rt = S.hap * .35 + S.sup * .3 + S.int * .2 + (100 - S.thr) * .15, d = rt - 55, k = Math.min(3, Math.round(Math.abs(d) / 6)), U = S.cities, ks = Object.keys(PT).filter(p => p != S.party), moved = [];
    if (d >= 3 && k) U.filter(u => u.mp != S.party && uap(u) >= 50).sort((a, b) => uap(b) - uap(a)).slice(0, k).forEach(u => { moved.push(u.n + ' joined you'); u.mp = S.party });
    else if (d <= -3 && k) U.filter(u => u.mp == S.party && !u.hq && uap(u) <= 60).sort((a, b) => uap(a) - uap(b)).slice(0, k).forEach(u => { const to = u.fol != S.party ? u.fol : ks[Math.floor(Math.random() * ks.length)]; moved.push(u.n + ' left for ' + PT[to].n); u.mp = to });
    sync();
    const det = '😊 ' + Math.round(S.hap) + ' · 👍 ' + Math.round(S.sup) + ' · ⚖️ ' + Math.round(S.int) + ' · 🛂 border safety ' + Math.round(100 - S.thr);
    S.rv = { day: S.day, rt: Math.round(rt), det, txt: moved.length ? moved.join('; ') : 'No seats changed hands.' };
    toast('📊 Annual council review: rating ' + Math.round(rt) + '. ' + S.rv.txt)
}
function convertCity(i) {
    const u = S.cities[i]; if (!u || u.mp == S.party || uap(u) < 80) return; const c = recCost(u); if (S.gold < c) return;
    S.gold -= c; u.mp = S.party; sync(); toast('🤝 ' + u.n + ' ' + UN[S.lv || 0] + ' ' + u.mn + ' switched to ' + PT[S.party].n + '!'); ui()
}
const recCost = u => Math.round(50 * pm() * (u.fol == S.party ? 1 : 1.5));
const cityPick = () => `<div class="ov" style="margin-top:8px">Choose the city that will host your party (${PT[PARTY].n})</div>` + uBase(0, sel).map((u, i) => `<div class="pcard ${hqI == i ? 'on' : ''}" onclick="hqI=${i};menu()"><div><b>${hqI == i ? '★ ' : ''}${u.n}</b><br><small>👥 ${u.pop.toLocaleString()}k · ${u.rel} · follows ${PT[u.fol].n} · ${u.eco}</small></div></div>`).join('');
function unitsHtml() {
    const L = S.lv || 0, U = S.cities, tp = U.reduce((a, u) => a + u.pop, 0) || 1, av = Math.round(U.reduce((a, u) => a + uap(u) * u.pop, 0) / tp), rl = {}; U.forEach(u => rl[u.rel] = (rl[u.rel] || 0) + u.pop);
    return `<small>${['Cities', 'Provinces', 'Regions'][L]} of <b>${S.v.n}</b> · ${U.length} council seats · population-weighted approval <b>${av}%</b><br>🙏 ${Object.entries(rl).sort((a, b) => b[1] - a[1]).map(([k, v]) => k + ' ' + Math.round(v / tp * 100) + '%').join(' · ')}<br>★ = party host ${['city', 'province', 'region'][L]}</small>` +
        U.map(u => { const a = uap(u); return `<div class="it" style="display:block"><div class="row between"><b>${u.hq ? '★ ' : ''}${u.n}</b><b style="color:${a > 60 ? 'var(--ok)' : a > 40 ? 'var(--gd)' : 'var(--ac)'}">${a}% approval</b></div><div class="bar" style="margin:4px 0"><i style="width:${a}%;background:var(--ac2)"></i></div><small><span class="dot" style="background:${PT[u.mp].c}"></span>${['Mayor', LOC.Gv, 'Regional head'][L]} ${u.mn} · ${PT[u.mp].n}<br>🙏 ${u.rel} · follows ${PT[u.fol].n} · ${u.eco} · 👥 ${u.pop.toLocaleString()}k</small>${u.mp != S.party && a >= 80 ? `<button class="big" style="margin-top:6px" ${S.gold < recCost(u) ? 'disabled' : ''} onclick="convertCity(${U.indexOf(u)})">🤝 Bring ${UN[L]} into ${PT[S.party].n} (${money(recCost(u))})</button>` : ''}</div>` }).join('')
}

function terr() {
    const h = all[S.hi]; if (!S.lv) { TM = [h]; return h }
    TM = S.lv == 1 ? all.filter(v => RG[S.rg][1].split(',').includes(v.n)) : all; const sm = k => TM.reduce((a, v) => a + v[k], 0);
    return { n: S.lv == 1 ? RG[S.rg][0] : LOC.nat, r: h.r, pop: sm('pop'), dev: Math.round(sm('dev') / TM.length), d0: Math.round(sm('d0') / TM.length) }
}
function promote() {
    const s = S; s.lv++; if (s.lv == 1) s.rg = Math.max(0, regOf(all[s.hi].n)); s.v = terr(); s.cities = tierUnits(); sync(); s.pop = s.v.pop; s.end = s.day + 504;
    s.ex = s.lv == 1 ? Math.max(...TM.map(v => exOf(v.n))) : 3; s.thr = cl(15 + s.ex * 5); s.tr = s.lv == 1 ? [...new Set(TM.flatMap(v => traitsOf(v.n)))] : [];
    s.gold += 150; s.sup = cl(s.sup + 5); s.h = [s.v.dev]; resetV(); if (s.lv == 2) s.ev = reformEv()
}
function promoEv() {
    const nx = TT[S.lv + 1], sc0 = () => S.hap * .45 + S.sup * .3 + S.int * .15 + S.seats[S.party] * .15 + cl((50 - rank()) / 6, -6, 6),
        run = sp => s => {
            s.gold -= sp; const sc = sc0() + sp / 15 + (S.dt == S.lv + 1 ? 10 : 0) + ((S.pth && S.pth.vb) || 0) * 2.5 + Math.random() * 16 - 8; if (sc >= 46) { promote(); return '🗳️ You WON the vote (' + Math.round(sc) + ' pts)! You are now ' + TT[s.lv] + ' of ' + s.v.n + '.' }
            s.over = 1; s.msg = '🗳️ You lost the race for ' + nx + ' (' + Math.round(sc) + ' pts). Your career ends here.'; return 'You lost the vote.'
        };
    return {
        px: 1, t: '🏅 Your term is over and your record is strong! Run for ' + nx + '? Voters in the wider ' + (S.lv ? 'country' : 'region') + ' will judge happiness, approval, integrity, party seats and ranking.' + (S.dt == S.lv + 1 ? ' 👪 Your dynasty network is ready (+10 pts).' : ''),
        o: [['Run for ' + nx, run(0)], ...(S.dt == S.lv + 1 || antiDyn() ? [] : [['👪 Invoke a political dynasty (−' + (proDyn() ? 90 : 150) + ' gold, integrity −' + (proDyn() ? 5 : 10) + ', approval −' + (proDyn() ? 2 : 4) + '): relatives take the governorships of the ' + (S.lv ? 'regions' : 'region') + ' you will lead, +10 pts, and they back your laws', s => { const pd = proDyn(); s.gold -= pd ? 90 : 150; s.int -= pd ? 5 : 10; s.sup -= pd ? 2 : 4; s.dyn = .6; s.dt = s.lv + 1; s.ev = promoEv(); return '👪 Your family network is in place. Critics call it a political dynasty.' }, proDyn() ? 90 : 150]]), ['Big campaign (−120 gold, +8 pts)', run(120), 120], ['Retire with honors', s => { s.over = 1; s.msg = '🏁 You retired as ' + TT[s.lv] + ' of ' + s.v.n + '. Rank #' + rank() + '.'; return 'You retire.' }]]
    }
}
function reformEv() {
    const y = SY[S.party]; return {
        px: 1, t: '🏛️ You are ' + TT[2] + ', and the Constitution is in your hands. As a ' + pt().n + ' leader you may reform how the country is run: ' + y.n + '. ' + y.d + (y.ap ? ' ' + LOC.Gv + 's become appointees and always approve your laws.' : ''),
        o: [['Pass the ' + y.n + ' (−' + y.cost + ' gold)', s => { s.gold -= y.cost; s.sys = 1; for (const k in y.once) s[k] += y.once[k]; s.v.dev = dev(); return '📜 ' + y.n + ' is now in force. Elections work differently from now on.' }, y.cost], ['Keep direct presidential elections', s => 'You respect the current system.']]
    }
}
