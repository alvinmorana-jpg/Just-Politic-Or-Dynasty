        function dayTick() {
            S.day++; const f = 1 / 21, b = S.b, inc = income(), ir = ira(), up = upkeep(); S.gold += (inc + ir - up) * f; econTick();
            if (S.gold < 0) { S.gold = 0; if (Object.keys(S.prog).length) { S.prog = {}; S.hap -= 3; toast('💸 Budget deficit! Programs suspended.') } else { S.hap -= .4; S.sup -= .3; if (S.day % 7 == 0) toast('💸 Unpaid salaries are hurting morale.') } }
            const prod = S.pop / 100 * (1 + .12 * b.farm + fx('food')), need = S.pop / 100; S.food = Math.min(300, S.food + (prod - need) * 3 * f);
            if (S.food < 0) { S.hap -= 4 * f; S.pop *= 1 - .01 * f; S.food = 0 } else S.pop *= 1 + (.004 + .002 * b.hospital + fx('pop')) * f;
            const P = pw(); S.thr = cl(S.thr + EXR[S.ex] + fx('thr') - (P[0] + P[1]) * .2); const tgt = 55 + S.c.hap + b.hospital * 4 + b.school * 2 + b.road * 1.5 + b.guard * 2 - b.factory * 1.5 - (b.mining * 1.2 + b.logging * .7) * (S.law.env ? .4 : 1) - labAway() * .25 - [-8, 0, 12][S.tax] + fx('hap') - S.thr / 25 + Math.min(4, P[2] * .4);
            S.hap = cl(S.hap + (tgt - S.hap) * .25 * f); S.sup = cl(S.sup + (S.hap * .7 + 25 - S.sup) * .15 * f + fx('sup')); S.int = cl(S.int + (fx('int') - .15 - (b.mining + b.logging) * .12 * (S.law.env ? 0 : 1)) * f);
            all.forEach(v => { if (v !== S.v) v.dev = Math.min(100, +(v.dev + (Math.random() * .4 + .05) * f).toFixed(3)) });
            S.jobs.forEach(j => j.left--); S.jobs.filter(j => j.left <= 0).forEach(finish); S.jobs = S.jobs.filter(j => j.left > 0);
            S.v.dev = dev(); if (S.day % 7 == 0) S.h.push(S.v.dev); chk(); if (S.day % 84 == 0 && S.day < S.end) yearReview();
            const season = Math.floor(S.day % 84 / 7) >= 6;
            if (S.hap < 12) { S.over = 1; S.msg = '💥 Revolt! You were removed from office.' }
            else if (S.day >= S.end) { const r = rank(), q = S.lv == 0 ? r <= 25 : S.lv == 1 ? S.hap >= 65 && S.sup >= 55 : 0; if (q && S.lv < 2) S.ev = promoEv(); else { S.over = 1; S.msg = `🏁 Term over. ${S.v.n} ranks #${r} of ${all.length} in development. ` + (S.lv == 2 ? '🇵🇭 You completed your presidency! ' : '') + (r == 1 ? '🏆 Outstanding leader!' : r <= 10 ? '🥈 Great work.' : r <= 30 ? 'Solid work.' : 'Keep studying the economy!') + (S.lv < 2 && !q ? ' You lacked the standing to run for higher office.' : '') } }
            else if (S.day % 252 == 0 && S.day < S.end) S.ev = election();
            else if (S.int < 30 && Math.random() < .35 / 21) S.ev = SC;
            else if (Math.random() < S.thr / 100 * .03) S.ev = BE[Math.floor(Math.random() * BE.length)];
            else if (S.fc.caf > S.fc.mil && Math.random() < .003 * S.fc.caf) S.ev = CA;
            else if (season && Math.random() < (.16 + (S.tr.includes('storm') ? .14 : 0)) / 21) S.ev = TY;
            else if (Math.random() < DF[S.dif].ev / 21) { let e; do e = EV[Math.floor(Math.random() * EV.length)]; while (e.t.includes('Armed') && !S.tr.includes('conf') && Math.random() < .8); S.ev = e }
            if (S.ev && !S.ev.px) { const k = Object.keys(XV).find(k => S.ev.t.includes(k)), x = k && XV[k][S.party]; S.ev = Object.assign({}, S.ev, { px: 1, o: x ? S.ev.o.concat([['⭐ ' + x[0], x[1], x[2]]]) : S.ev.o }) }
            refresh()
        }
        let last = 0, rt;
        function refresh() { if (document.activeElement && document.activeElement.tagName == 'INPUT') { clearTimeout(rt); rt = setTimeout(refresh, 500); return } if (Date.now() - lastTap < 700) { clearTimeout(rt); rt = setTimeout(refresh, 300); return } ui() }
        function loop(ts) {
            const dt = Math.min(.25, (ts - (last || ts)) / 1000); last = ts;
            if (S && !S.over && !S.ev && S.sp > 0) { S.t += dt * SPD[S.sp]; while (S.t >= CYC) { S.t -= CYC; dayTick(); if (S.ev || S.over) break } hud() } requestAnimationFrame(loop)
        }
        function hud() {
            const u = S.t / CYC; $('clk').textContent = clock(u); $('dt').textContent = dstr(S.day); $('tdf').style.width = u * 100 + '%'; $('night').style.opacity = dark(u) * .6;
            $('g').textContent = Math.round(S.gold); $('pop').textContent = Math.round(S.pop).toLocaleString(); $('fd').textContent = Math.round(S.food); $('dv').textContent = S.v.dev;
            [['hap', S.hap], ['sup', S.sup], ['int', S.int], ['thr', S.thr]].forEach(([k, v]) => { $(k + 'i').style.width = v + '%'; $(k + 'v').textContent = Math.round(v) });
            document.querySelectorAll('[data-j]').forEach(e => { const j = S.jobs.find(x => x.k + x.id == e.dataset.j); if (j) e.style.width = (100 * (j.tot - j.left + u) / j.tot) + '%' });
            document.querySelectorAll('[data-l]').forEach(e => { const j = S.jobs.find(x => x.k + x.id == e.dataset.l); if (j) e.textContent = Math.max(0, j.left - u).toFixed(1) })
        }
