        function terr() {
            const h = all[S.hi]; if (!S.lv) { TM = [h]; return h }
            TM = S.lv == 1 ? all.filter(v => RG[S.rg][1].split(',').includes(v.n)) : all; const sm = k => TM.reduce((a, v) => a + v[k], 0);
            return { n: S.lv == 1 ? RG[S.rg][0] : 'Republic of the Philippines', r: h.r, pop: sm('pop'), dev: Math.round(sm('dev') / TM.length), d0: Math.round(sm('d0') / TM.length) }
        }
        function promote() {
            const s = S; s.lv++; if (s.lv == 1) s.rg = Math.max(0, regOf(all[s.hi].n)); s.v = terr(); s.cities = tierUnits(); sync(); s.pop = s.v.pop; s.end = s.day + 504;
            s.ex = s.lv == 1 ? Math.max(...TM.map(v => exOf(v.n))) : 3; s.thr = cl(15 + s.ex * 5); s.tr = s.lv == 1 ? [...new Set(TM.flatMap(v => traitsOf(v.n)))] : [];
            s.gold += 150; s.sup = cl(s.sup + 5); s.h = [s.v.dev]; resetV(); if (s.lv == 2) s.ev = reformEv()
        }
        function promoEv() {
            const nx = S.lv ? 'President' : 'Regional Representative', sc0 = () => S.hap * .45 + S.sup * .3 + S.int * .15 + S.seats[S.party] * .15 + cl((50 - rank()) / 6, -6, 6),
                run = sp => s => {
                    s.gold -= sp; const sc = sc0() + sp / 15 + (S.dt == S.lv + 1 ? 10 : 0) + Math.random() * 16 - 8; if (sc >= 46) { promote(); return '🗳️ You WON the vote (' + Math.round(sc) + ' pts)! You are now ' + TT[s.lv] + ' of ' + s.v.n + '.' }
                    s.over = 1; s.msg = '🗳️ You lost the race for ' + nx + ' (' + Math.round(sc) + ' pts). Your career ends here.'; return 'You lost the vote.'
                };
            return {
                px: 1, t: '🏅 Your term is over and your record is strong! Run for ' + nx + '? Voters in the wider ' + (S.lv ? 'country' : 'region') + ' will judge happiness, approval, integrity, party seats and ranking.' + (S.dt == S.lv + 1 ? ' 👪 Your dynasty network is ready (+10 pts).' : ''),
                o: [['Run for ' + nx, run(0)], ...(S.dt == S.lv + 1 ? [] : [['👪 Invoke a political dynasty (−150 gold, integrity −10, approval −4): relatives take the governorships of the ' + (S.lv ? 'regions' : 'region') + ' you will lead, +10 pts, and they back your laws', s => { s.gold -= 150; s.int -= 10; s.sup -= 4; s.dyn = .6; s.dt = s.lv + 1; s.ev = promoEv(); return '👪 Your family network is in place. Critics call it a political dynasty.' }, 150]]), ['Big campaign (−120 gold, +8 pts)', run(120), 120], ['Retire with honors', s => { s.over = 1; s.msg = '🏁 You retired as ' + TT[s.lv] + ' of ' + s.v.n + '. Rank #' + rank() + '.'; return 'You retire.' }]]
            }
        }
        function reformEv() {
            const y = SY[S.party]; return {
                px: 1, t: '🏛️ You are President, and the Constitution is in your hands. As a ' + pt().n + ' leader you may reform how the country is run: ' + y.n + '. ' + y.d + (y.ap ? ' Governors become appointees and always approve your laws.' : ''),
                o: [['Pass the ' + y.n + ' (−' + y.cost + ' gold)', s => { s.gold -= y.cost; s.sys = 1; for (const k in y.once) s[k] += y.once[k]; s.v.dev = dev(); return '📜 ' + y.n + ' is now in force. Elections work differently from now on.' }, y.cost], ['Keep direct presidential elections', s => 'You respect the current system.']]
            }
        }
