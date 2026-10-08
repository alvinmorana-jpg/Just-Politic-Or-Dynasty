        function build() { all = []; for (const k in C) C[k].pv.forEach(([n, r, pop, dev]) => all.push({ c: k, n, r, pop, dev, d0: dev })) }
        const col = d => `hsl(${40 + d},${45 + d * .2}%,${88 - d * .5}%)`, cl = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v)), rank = () => 1 + all.filter(v => v.dev > S.v.dev).length;
        const pt = () => PT[S.party];
        const fx = k => PR.reduce((a, p) => a + (S.prog[p.id] ? (p.fx[k] || 0) : 0), 0) + LW.reduce((a, l) => a + (S.law[l.id] ? (l.fx[k] || 0) : 0), 0) + S.tr.reduce((a, t) => a + (TR[t][1][k] || 0), 0) + (pt().fx[k] || 0) + (S.sys ? (SY[S.party].fx[k] || 0) : 0) + (S.dyn && S.dt == S.lv && k == 'int' ? -.25 : 0);
        const pm = () => Math.min(4, .6 + S.pop / 6000), pc = p => Math.round(p.up * pm() * (pt().pd[p.id] || 1)), lc = l => { const r = rawAff(S.party, l); return Math.round(l.cost * pm() * (r > .7 ? .85 : r < .3 ? 1.25 : 1)) };
        const upkeep = () => PR.reduce((a, p) => a + (S.prog[p.id] ? pc(p) : 0), 0) + fu(), cost = k => Math.round(B.find(x => x[0] == k)[4] * Math.pow(1.45, S.b[k]) * pm() * (pt().bd[k] || 1));
