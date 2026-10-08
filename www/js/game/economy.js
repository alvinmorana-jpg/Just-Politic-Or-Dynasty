        const mrich = () => .6 + hs(S.v.n + 'ore') % 100 / 100 * .9, sb = () => Math.min(S.pop, 20000) / 50 * [1, 1.4, 2.2][S.lv || 0];
        const miInc = () => Math.round(sb() * .22 * S.b.mining * S.rs.min / 100 * mrich() * (S.law.env ? .7 : 1)), loInc = () => Math.round(sb() * .12 * S.b.logging * S.rs.log / 100 * (S.law.env ? .7 : 1));
        const labCap = () => Math.max(2, Math.round(S.pop / 500)), labAway = () => S.lab ? Object.values(S.lab.c).reduce((a, n) => a + n, 0) : 0, labHire = () => Math.round(30 * pm());
        const labRate = n => { const v = all.find(x => x.n == n); return 7 * pm() * (1.3 - (v ? v.dev : 50) / 100) * S.lab.dem[n] };
        const labInc = () => S.lab && !S.lv ? Math.round(S.lab.nb.reduce((a, n) => a + S.lab.c[n] * labRate(n), 0)) : 0, resInc = () => miInc() + loInc();
        function mkLab() {
            const r = mkr(S.v.n + 'labor'), ri = regOf(S.v.n); let pool = ri >= 0 ? all.filter(v => v !== S.v && RG[ri][1].split(',').includes(v.n)) : []; if (pool.length < 4) pool = pool.concat(all.filter(v => v !== S.v && !pool.includes(v)).sort((a, b) => hs(S.v.n + a.n) - hs(S.v.n + b.n)).slice(0, 4 - pool.length));
            const nb = []; while (nb.length < 4 && pool.length) nb.push(pool.splice(Math.floor(r() * pool.length), 1)[0].n); const L = { nb, c: {}, dem: {} }; nb.forEach(n => { L.c[n] = 0; L.dem[n] = .8 + r() * .6 }); return L
        }
        function ens() { B.forEach(x => { if (S.b[x[0]] == null) S.b[x[0]] = 0 }); if (!S.rs) S.rs = { min: 100, log: 100 }; if (!S.lab && !S.lv) S.lab = mkLab() }
        function econTick() {
            const b = S.b, e = S.law.env ? 1 : 0; S.rs.min = cl(S.rs.min - .07 * b.mining * (e ? .6 : 1)); S.rs.log = cl(S.rs.log - .09 * b.logging * (e ? .6 : 1) + .03 + (e ? .04 : 0));
            if (b.mining && S.rs.min < 20 && !S.w1) { S.w1 = 1; toast('⛏️ The ore reserves are almost exhausted!') } if (S.rs.min > 30) S.w1 = 0; if (b.logging && S.rs.log < 20 && !S.w2) { S.w2 = 1; toast('🪵 The forests are almost cleared!') } if (S.rs.log > 30) S.w2 = 0;
            if (S.lab && !S.lv && S.day % 28 == 0) { S.lab.nb.forEach(n => S.lab.dem[n] = .6 + Math.random() * .9); const hi = S.lab.nb.find(n => S.lab.dem[n] >= 1.35); if (hi) S.log.unshift('👷 ' + hi + ' is short on workers: labor rent is high this month.') }
        }
        function labor(i, d) {
            const L = S.lab; if (!L || S.lv) return; const n = L.nb[i]; if (d > 0) { if (S.gold < labHire() || labAway() >= labCap() || L.c[n] >= 3) return; S.gold -= labHire(); L.c[n]++; toast('👷 Work crew sent to ' + n) } else if (L.c[n] > 0) { L.c[n]--; toast('Crew called back from ' + n) } ui()
        }
        function econHtml() {
            ens(); const st = Math.round(mrich() * 2), bar = (v, c) => `<div class="bar" style="margin:3px 0"><i style="width:${v}%;background:${c}"></i></div>`;
            let h = `<div class="ov" style="margin-top:12px">Resource income</div><small>⛏️ Ore reserve ${Math.round(S.rs.min)}% · richness ${'★'.repeat(st)}${'☆'.repeat(3 - st)} · <b>+${miInc()}</b>/qtr</small>${bar(S.rs.min, 'var(--gd)')}<small>🪵 Forest ${Math.round(S.rs.log)}% · <b>+${loInc()}</b>/qtr</small>${bar(S.rs.log, 'var(--ok)')}<small>${S.law.env ? '✔ Regulated by the Environmental Code: −30% income, but less harm and slower depletion.' : '⚠ Unregulated: more income, but happiness and integrity suffer. The Environmental Code regulates it.'}</small>`;
            h += `<div class="ov" style="margin-top:12px">👷 Labor Work Service</div>`;
            if (S.lv || !S.lab) return h + '<small>Neighboring provinces rent your work crews while you govern a province.</small>';
            h += `<small>Nearby provinces rent your work crews and pay you each quarter. Crews away: <b>${labAway()}/${labCap()}</b> (they lower local happiness a little). Sending a crew costs ${labHire()} 💰. Total rent: <b>+${labInc()}</b>/qtr.</small>`;
            return h + S.lab.nb.map((n, i) => { const v = all.find(x => x.n == n), dm = S.lab.dem[n], c = S.lab.c[n]; return `<div class="it"><div style="flex:1">🏗️ <b>${n}</b> <span class="pips">${'●'.repeat(c) || '○'}</span><br><small>Demand: ${dm >= 1.2 ? '🔥 High' : dm >= .85 ? 'Normal' : '❄️ Low'} · ${Math.round(labRate(n))} 💰/crew/qtr · dev ${v ? v.dev : '?'}</small></div><button ${c ? '' : 'disabled'} onclick="labor(${i},-1)">−</button><button ${S.gold < labHire() || labAway() >= labCap() || c >= 3 ? 'disabled' : ''} onclick="labor(${i},1)">+</button></div>` }).join('')
        }
        const income = () => { ens(); const b = S.b, s = Math.min(S.pop, 20000) / 50; return Math.round(s * [1, 1.4, 2.2][S.lv || 0] * (.5 + .12 * b.factory + .08 * b.market + .05 * b.school) * (1 + .08 * b.road) * [.6, 1, 1.5][S.tax] * S.c.cm * (1 + fx('inc')) * (.85 + .15 * S.int / 100) * (1 - S.thr / 500)) + resInc() + labInc() };
        const ira = () => Math.round(Math.min(S.pop, 20000) / 50 * .4 * (1.5 - S.v.dev / 100) * DF[S.dif].ira);
        const dev = () => { const b = S.b; return Math.min(100, Math.round(S.v.d0 + (b.farm + b.factory + b.market + b.school + b.hospital + b.road) * 2 + fx('dev') + (S.hap - 60) * .1)) };
