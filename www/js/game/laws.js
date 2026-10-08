        const rawAff = (p, l) => { const t = LT[l.id]; let d = 0; for (const k in t) d += (PT[p].l[k] || 0) * t[k]; return cl(.5 + d * .6, .08, .92) }, aff = (p, l) => { const a = rawAff(p, l); return p == S.party ? Math.min(.97, a + .3) : a };
        const tag = l => { const r = rawAff(S.party, l); return r > .7 ? ' · ✔ fits your party' : r < .3 ? ' · ⚠ against your party' : '' }, pa = () => Math.round(pt().act.c * pm());
        function pact() { const a = pt().act; if (S.day - S.aCd < 28 || S.gold < pa()) return; S.gold -= pa(); a.fn(S); S.aCd = S.day; toast('⭐ ' + a.n); ui() }
        const lch = l => Math.round(cl(Object.keys(S.seats).reduce((a, p) => a + S.seats[p] / 100 * aff(p, l), 0) * 100, 5, 95));
