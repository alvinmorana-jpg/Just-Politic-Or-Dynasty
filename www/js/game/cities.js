        const RELS = ['Catholic', 'Islam', 'Protestant', 'Iglesia ni Cristo', 'Indigenous/Aglipayan'], ECO = ['Farming', 'Fishing', 'Industry', 'Tourism', 'Trade'], ECW = { Farming: ['nat', 'soc'], Fishing: ['grn', 'nat'], Industry: ['lib', 'tec'], Tourism: ['grn', 'lib'], Trade: ['lib', 'con'] };
        const NP = ['San Jose', 'Santa Maria', 'San Isidro', 'San Miguel', 'Santo Tomas', 'San Fernando', 'Santa Cruz', 'San Antonio', 'San Pedro', 'San Juan', 'Santa Rosa', 'San Pablo', 'Santa Ana', 'San Vicente', 'San Roque', 'Santo Niño', 'San Mateo', 'Santa Barbara'],
            PF = ['Maria', 'Jose', 'Juan', 'Ana', 'Pedro', 'Luz', 'Ramon', 'Elena', 'Carlos', 'Rosa', 'Miguel', 'Teresa'], PS = ['Santos', 'Reyes', 'Cruz', 'Bautista', 'Garcia', 'Mendoza', 'Torres', 'Ramos', 'Aquino', 'Villanueva', 'Dela Cruz', 'Castillo'];
        const hs = s => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0 },
            mkr = s => { let a = hs(s); return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } };
        function relOf(n, r) { const m = /Maguindanao|Lanao del Sur|Sulu|Basilan|Tawi-Tawi|BARMM/.test(n) ? [8, 85, 2, 1, 4] : /Cotabato|Sultan Kudarat|Lanao del Norte|Zamboanga|SOCCSKSARGEN|Sarangani/.test(n) ? [60, 30, 5, 2, 3] : /Benguet|Ifugao|Kalinga|Mountain|Apayao|Abra|Cordillera/.test(n) ? [40, 0, 25, 5, 30] : /Bulacan|Nueva Ecija|Rizal|Cavite|Pampanga|Tarlac|Central Luzon|CALABARZON|Isabela|Nueva Vizcaya/.test(n) ? [78, 2, 5, 10, 5] : [84, 3, 6, 4, 3]; let q = r() * 100; for (let i = 0; i < 5; i++) { if (q < m[i]) return RELS[i]; q -= m[i] } return RELS[0] }
        function uBase(L, x) {
            let rows;
            if (L == 0) { const r = mkr(x.n), n = Math.min(9, 3 + Math.floor(x.pop / 500)), w = Array.from({ length: n }, () => .4 + r()), t = w.reduce((a, b) => a + b, 0), pl = [...NP]; rows = w.map((q, i) => ({ n: i ? pl.splice(Math.floor(r() * pl.length), 1)[0] : x.n + ' City', pop: Math.max(1, Math.round(x.pop * q / t)) })) }
            else if (L == 1) rows = all.filter(v => RG[x][1].split(',').includes(v.n)).map(v => ({ n: v.n, pop: v.pop }));
            else rows = RG.map(g => ({ n: g[0], pop: all.filter(v => g[1].split(',').includes(v.n)).reduce((a, v) => a + v.pop, 0) }));
            return rows.map(u => {
                const r = mkr(L + u.n), eco = ECO[Math.floor(r() * ECO.length)], rl = relOf(L ? u.n : x.n, r), ws = Object.keys(PT).map(k => [k, .5 + r() * (ECW[eco].includes(k) ? 2 : 1)]), tw = ws.reduce((a, b) => a + b[1], 0); let q = r() * tw, fol = ws[0][0]; for (const [k, w] of ws) { if (q < w) { fol = k; break } q -= w }
                return { ...u, eco, rel: rl, fol, mn: PF[Math.floor(r() * PF.length)] + ' ' + PS[Math.floor(r() * PS.length)], b: Math.round(r() * 10 - 5) }
            })
        }
        function startUnits(v, h, P) {
            const U = uBase(0, v), ks = Object.keys(PT); U.forEach((u, i) => { u.hq = i == h; u.mp = u.hq ? P : Math.random() < .6 ? u.fol : ks[Math.floor(Math.random() * ks.length)] });
            for (let g = 0; g < 20 && U.filter(u => u.mp == P).length < Math.ceil(U.length * .3); g++) { const c = U.filter(u => u.mp != P); c[Math.floor(Math.random() * c.length)].mp = P } return U
        }
        function tierUnits() {
            const L = S.lv, U = uBase(L, L == 1 ? S.rg : 0), ks = Object.keys(PT), hn = L == 1 ? all[S.hi].n : RG[S.rg][0];
            U.forEach(u => { u.hq = u.n == hn; u.mp = u.hq ? S.party : Math.random() < .55 ? u.fol : ks[Math.floor(Math.random() * ks.length)] });
            if (S.dt == L) U.filter(u => !u.hq).slice(0, govA()).forEach(u => u.mp = S.party);
            for (let g = 0; g < 20 && U.filter(u => u.mp == S.party).length < Math.ceil(U.length * .3); g++) { const c = U.filter(u => u.mp != S.party); c[Math.floor(Math.random() * c.length)].mp = S.party } return U
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
                U.map(u => { const a = uap(u); return `<div class="it" style="display:block"><div class="row between"><b>${u.hq ? '★ ' : ''}${u.n}</b><b style="color:${a > 60 ? 'var(--ok)' : a > 40 ? 'var(--gd)' : 'var(--ac)'}">${a}% approval</b></div><div class="bar" style="margin:4px 0"><i style="width:${a}%;background:var(--ac2)"></i></div><small><span class="dot" style="background:${PT[u.mp].c}"></span>${['Mayor', 'Governor', 'Regional head'][L]} ${u.mn} · ${PT[u.mp].n}<br>🙏 ${u.rel} · follows ${PT[u.fol].n} · ${u.eco} · 👥 ${u.pop.toLocaleString()}k</small>${u.mp != S.party && a >= 80 ? `<button class="big" style="margin-top:6px" ${S.gold < recCost(u) ? 'disabled' : ''} onclick="convertCity(${U.indexOf(u)})">🤝 Bring ${UN[L]} into ${PT[S.party].n} (${recCost(u)} 💰)</button>` : ''}</div>` }).join('')
        }
