// =====================================================================
//  THE WORLD & DIPLOMACY: unlocked once you are President
// =====================================================================
const NATS = {
    PH: ['Philippines', '🇵🇭', .3], MY: ['Malaysia', '🇲🇾', .3], BN: ['Brunei', '🇧🇳', .1], ID: ['Indonesia', '🇮🇩', .5], SG: ['Singapore', '🇸🇬', .5],
    CN: ['China', '🇨🇳', 1], US: ['United States', '🇺🇸', .9], JP: ['Japan', '🇯🇵', .7], VN: ['Vietnam', '🇻🇳', .3], AU: ['Australia', '🇦🇺', .4]
};
// [starting relations -100..100, border/sea tension 0..1] as seen from each playable country
const DBASE = {
    PH: { MY: [20, .4], BN: [35, .1], ID: [40, .2], SG: [50, 0], CN: [-10, .8], US: [55, 0], JP: [45, .1], VN: [25, .3], AU: [45, 0] },
    MY: { PH: [20, .3], BN: [45, .2], ID: [35, .3], SG: [35, .1], CN: [25, .4], US: [30, 0], JP: [35, 0], VN: [30, .2], AU: [35, 0] },
    BN: { PH: [30, .1], MY: [55, .3], ID: [35, .1], SG: [55, 0], CN: [25, .2], US: [35, 0], JP: [30, 0], VN: [20, .1], AU: [35, 0] },
    SG: { PH: [45, 0], MY: [45, .15], BN: [60, 0], ID: [45, .1], CN: [35, .2], US: [55, 0], JP: [45, 0], VN: [45, 0], AU: [55, 0] }
};
function ensD() { if (!S || S.lv != 2 || S.dip || !DBASE[CTRY]) return; S.dip = {}; Object.keys(DBASE[CTRY]).forEach(k => S.dip[k] = { r: DBASE[CTRY][k][0], tr: 0, pa: 0, jp: 0, cd: -99 }) }
const dOn = () => !!(S && S.lv == 2 && S.dip), dnat = () => dOn() ? Object.keys(S.dip) : [];
const dRel = (k, d) => { const x = S.dip[k]; x.r = cl(x.r + d, -100, 100) };
const dBase = k => DBASE[CTRY][k][0] + (S.dip[k].tr ? 8 : 0) + (S.dip[k].pa ? 10 : 0) + (S.dip[k].jp ? 6 : 0);
const dipI = () => dOn() ? Math.min(.25, dnat().reduce((a, k) => a + (S.dip[k].tr ? NATS[k][2] * .06 * (S.dip[k].r >= 0 ? 1 : .5) : 0), 0)) : 0;
const dipT = () => dOn() ? dnat().reduce((a, k) => { const d = S.dip[k], w = DBASE[CTRY][k][1]; return a + w * (d.r < 0 ? -d.r / 100 * .5 : -d.r / 100 * .15) + (d.pa ? -.12 : 0) + (d.jp ? -.25 : 0) }, 0) : 0;
const dipUp = () => dOn() ? dnat().reduce((a, k) => a + (S.dip[k].jp ? 6 * pm() : 0), 0) : 0;
const dLab = r => r >= 70 ? 'Allies' : r >= 40 ? 'Friendly' : r >= 15 ? 'Cordial' : r > -15 ? 'Neutral' : r > -40 ? 'Tense' : 'Hostile';
const dCol = r => `hsl(${Math.round(cl((r + 100) / 200, 0, 1) * 125)},65%,48%)`;
const dCls = d => S.day - d.cd < 7;
function dipTick() {
    if (!dOn()) return; (S.pk || []).forEach(m => m.left--); const done = (S.pk || []).filter(m => m.left <= 0);
    done.forEach(m => { if (S.dip[m.c]) dRel(m.c, 6); S.sup = cl(S.sup + 2); toast('🕊️ Your peacekeepers returned from ' + NATS[m.c][0] + ' with honors (approval +2).') }); S.pk = S.pk.filter(m => m.left > 0);
    dnat().forEach(k => { const d = S.dip[k]; d.r += (dBase(k) - d.r) * .012; d.r = cl(d.r, -100, 100); if (d.jp && S.day % 21 == 0) dRel(k, .5) })
}
const DA = [
    { id: 'env', ic: '✉️', n: 'Send envoy', d: 'Open talks and ease tensions · +5 relations', c: 10, f: k => { dRel(k, 5); return '✉️ Your envoy was received in ' + NATS[k][0] + '.' } },
    { id: 'vis', ic: '🏛️', n: 'State visit', d: 'Ceremonies, handshakes and photo ops · +12 relations', c: 35, f: k => { dRel(k, 12); S.sup = cl(S.sup + 1); return '🏛️ Your state visit to ' + NATS[k][0] + ' was a success.' } },
    { id: 'aid', ic: '🎁', n: 'Send aid package', d: 'Relief and development grants · +10 relations', c: 50, f: k => { dRel(k, 10); S.int = cl(S.int + 1); return '🎁 ' + NATS[k][0] + ' thanks you for the aid.' } },
    { id: 'trd', ic: '💱', n: 'Trade agreement', d: 'Open markets for a lasting income boost. Needs relations 20+', c: 60, r: 20, once: 'tr', f: k => { dRel(k, 6); return '💱 Trade agreement signed with ' + NATS[k][0] + '.' } },
    { id: 'pac', ic: '🛡️', n: 'Border security pact', d: 'Shared intelligence: lowers border threat every day. Needs relations 35+', c: 80, r: 35, once: 'pa', f: k => { dRel(k, 6); return '🛡️ Border security pact signed with ' + NATS[k][0] + '.' } },
    { id: 'jpt', ic: '🚓', n: 'Joint border patrol', d: 'Patrol together: lowers threat strongly, small upkeep. Needs relations 25+', c: 40, r: 25, once: 'jp', f: k => { dRel(k, 4); return '🚓 Joint patrols with ' + NATS[k][0] + ' have begun.' } },
    { id: 'bt', ic: '🗺️', n: 'Border talks', d: 'Negotiate disputed borders and waters · odds rise with relations', c: 30, adj: 1, f: k => { const d = S.dip[k]; if (Math.random() < .35 + d.r / 200) { dRel(k, 4); S.thr = cl(S.thr - 8); return '🗺️ Border talks with ' + NATS[k][0] + ' succeeded: threat −8.' } dRel(k, -3); return '🗺️ Border talks with ' + NATS[k][0] + ' went nowhere.' } },
    { id: 'pro', ic: '📢', n: 'Formal protest', d: 'Free, but −8 relations. Nationalists cheer (+2 approval)', c: 0, f: k => { dRel(k, -8); S.sup = cl(S.sup + 2); return '📢 You lodged a formal protest with ' + NATS[k][0] + '.' } }];
function dact(k, id) {
    const a = DA.find(x => x.id == id); if (!a) return; const d = S.dip[k], c = Math.round(a.c * pm()); if (dCls(d) || S.gold < c || (a.r && d.r < a.r) || (a.once && d[a.once])) return;
    S.gold -= c; d.cd = S.day; if (a.once) d[a.once] = 1; toast(a.f(k)); ui()
}
function dend(k, key) { const d = S.dip[k]; if (!d[key]) return; d[key] = 0; dRel(k, key == 'jp' ? -2 : -10); toast('You ended the agreement with ' + NATS[k][0] + '.'); ui() }
function sendPK(k, ft) {
    const d = S.dip[k], f = FT.find(x => x.id == ft), c = fmPayQ('mil', ft) * 1.5; if (dCls(d) || freeF('mil', ft) < 1 || S.gold < c || S.pk.some(m => m.c == k)) return;
    S.gold -= c; d.cd = S.day; S.pk.push({ c: k, br: 'mil', ft, n: 1, left: 42 }); dRel(k, 10); toast('🕊️ A ' + f.n.toLowerCase() + ' (' + f.sz + ' soldiers) is deployed to ' + NATS[k][0] + ' as peacekeepers (+10 relations).'); ui()
}
function dipEv() {
    const ks = dnat(), w = ks.map(k => .25 + DBASE[CTRY][k][1] * 2 + (S.dip[k].r < 0 ? .5 : 0)); let q = Math.random() * w.reduce((a, b) => a + b, 0), i = 0; while (i < ks.length - 1 && q >= w[i]) q -= w[i++];
    const k = ks[i], nm = NATS[k][0], fl = NATS[k][1], g = x => Math.round(x * pm());
    const T = [
        { t: `🛥️ ${fl} ${nm} fishing boats and coast guard clash with yours in contested waters.`, o: [[`Send a diplomatic note (−${g(20)} gold, relations +4)`, s => { s.gold -= g(20); dRel(k, 4); return 'The note calmed things down.' }, g(20)], [`Deploy the navy (−${g(50)} gold, threat −8, relations −10)`, s => { s.gold -= g(50); s.thr -= 8; dRel(k, -10); return 'Your ships drove them off. ' + nm + ' is furious.' }, g(50)], ['Stay silent (approval −3, threat +5)', s => { s.sup -= 3; s.thr += 5; return 'Critics say you look weak.' }]] },
        { t: `🤝 ${fl} ${nm} proposes a summit on trade and security.`, o: [[`Attend the summit (−${g(30)} gold, relations +10, approval +2)`, s => { s.gold -= g(30); dRel(k, 10); s.sup += 2; return 'The summit produced warm headlines.' }, g(30)], ['Decline politely (relations −4)', s => { dRel(k, -4); return nm + ' is disappointed.' }]] },
        { t: `🌪️ A disaster strikes ${fl} ${nm} and it appeals for help.`, o: [[`Send relief teams (−${g(60)} gold, relations +14, approval +2)`, s => { s.gold -= g(60); dRel(k, 14); s.sup += 2; return 'Your relief teams were welcomed as heroes.' }, g(60)], ['Offer sympathy only (relations +2)', s => { dRel(k, 2); return 'Kind words, little else.' }]] },
        { t: `🕵️ A spy scandal: ${fl} ${nm} diplomats are accused of espionage.`, o: [['Expel the diplomats (relations −12, approval +4, integrity +2)', s => { dRel(k, -12); s.sup += 4; s.int += 2; return 'You expelled them. ' + nm + ' retaliates with harsh words.' }], ['Handle it quietly (relations −2, integrity −2)', s => { dRel(k, -2); s.int -= 2; return 'The matter was buried.' }]] }];
    return T[Math.floor(Math.random() * T.length)]
}
