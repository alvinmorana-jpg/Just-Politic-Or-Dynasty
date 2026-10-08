        function buy(k) { const c = cost(k); if (S.gold < c || S.over || job('b', k) || S.jobs.filter(j => j.k == 'b').length >= 3) return; S.gold -= c; addJob('b', k, 5 + 2 * S.b[k]); toast('Construction started: ' + B.find(x => x[0] == k)[2]); ui() }
        function tp(id) { const p = PR.find(x => x.id == id); if (S.prog[id]) { delete S.prog[id]; toast('Stopped ' + p.n) } else if (!job('p', id) && S.gold >= pc(p)) { addJob('p', id, 4); toast('Rolling out ' + p.n) } S.v.dev = dev(); ui() }
        function propose(id) { const l = LW.find(x => x.id == id), c = lc(l); if (S.gold < c || S.law[id] || job('l', id)) return; S.gold -= c; addJob('l', id, 8); toast('Bill filed: ' + l.n); ui() }
        function lobby() { const c = Math.round(40 * pm()); if (S.gold < c || S.day - S.lobCd < 14) return; S.gold -= c; S.lobCd = S.day; shift(3); toast('🤝 Lobbying won you 3 more council seats.'); ui() }
        function setSp(i) { S.sp = i; if (i) S.lsp = i; ui() }
        function finish(j) {
            if (j.k == 'r') { S.fc[j.id] += j.n; toast('✅ ' + j.n + ' ' + FU.find(u => u.id == j.id).n + ' unit(s) trained') } else if (j.k == 'b') { S.b[j.id]++; if (j.id == 'factory') S.hap -= 2; toast('✅ Built ' + B.find(x => x[0] == j.id)[2] + ' (L' + S.b[j.id] + ')') }
            else if (j.k == 'p') { S.prog[j.id] = 1; toast('✅ Program live: ' + PR.find(x => x.id == j.id).n) }
            else { const l = LW.find(x => x.id == j.id); if (Math.random() * 100 < lch(l)) { if (!ratify(l)) { S.gold += Math.round(lc(l) / 2); S.sup = cl(S.sup - 2); return } S.law[j.id] = 1; S.sup = cl(S.sup + l.s); toast('📜 Council PASSED: ' + l.n); const ra = rawAff(S.party, l); if (ra < .3) { shift(-4); S.log.unshift('⚠ Your party is angry: −4 council seats.') } else if (ra > .7) shift(2) } else { S.gold += Math.round(lc(l) / 2); S.sup = cl(S.sup - 2); toast('❌ Council rejected: ' + l.n) } }
        }
        function chk() { MS.forEach(m => { if ((!m.p || m.p == S.party) && !S.done[m.id] && m.f()) { S.done[m.id] = 1; S.gold += m.r; toast('🎯 Goal done: ' + m.t + ' (+' + m.r + ')') } }) }
        function pick(i) { const o = S.ev.o[i]; S.ev = null; toast(o[1](S)); S.hap = cl(S.hap); S.int = cl(S.int); S.sup = cl(S.sup); S.thr = cl(S.thr); S.v.dev = dev(); chk(); ui() }
