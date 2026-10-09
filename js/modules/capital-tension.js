// =====================================================================
//  CAPITAL TENSION: the national government watches provinces that outshine it
// =====================================================================
const myRt = () => S.hap * .35 + S.sup * .3 + S.int * .2 + (100 - S.thr) * .15;
const pDist = (a, b) => { const x = PT[a].l, y = PT[b].l; return Object.keys(Object.assign({}, x, y)).reduce((t, k) => t + Math.abs((x[k] || 0) - (y[k] || 0)), 0) };
const cOn = () => !!(S && S.lv < 2 && S.np);
function ensC() {
    if (!S || S.lv >= 2 || S.np) return; const ks = Object.keys(PT); S.np = ks[Math.floor(Math.random() * ks.length)]; S.nrt = 45 + Math.random() * 20; S.ct = S.np == S.party ? 3 : 12; S.cc = -99;
}
const ctBase = () => S.np == S.party ? 0 : Math.min(35, pDist(S.np, S.party) * 12);
const ctGap = () => Math.max(0, myRt() - S.nrt);
const ctTarget = () => cl((ctBase() + ctGap() * 1.6 + (S.nrt < 45 ? (45 - S.nrt) * .5 : 0)) * (S.np == S.party ? .5 : 1));
const ctPen = () => cOn() ? Math.max(0, S.ct - 40) / 300 : 0, ctThr = () => cOn() && S.ct >= 50 ? (S.ct - 50) / 100 * .6 : 0;
const ctLab = c => c >= 85 ? 'Crackdown' : c >= 60 ? 'Stricter checkpoints' : c >= 40 ? 'Under inspection' : c >= 20 ? 'Watchful' : 'Calm';
function ctTick() {
    ensC(); if (!cOn()) return;
    S.nrt = cl(S.nrt + (50 - S.nrt) * .003 + (Math.random() - .5) * .8, 20, 80); S.ct = cl(S.ct + (ctTarget() * dfm('ct') - S.ct) * .05); if (S.pth && S.pth.aut) S.ct = Math.min(S.ct, 35);
    if (S.day && S.day % 252 == 0) { const ks = Object.keys(PT), o = S.np; S.np = ks[Math.floor(Math.random() * ks.length)]; S.nrt = 45 + Math.random() * 20; S.pr = null; ensP(); toast('🗳️ National election: ' + PT[S.np].n + ' now governs the country' + (S.np == o ? ' again.' : S.np == S.party ? ' (your party!).' : '.')) }
}
function ctEv() {
    const g = x => Math.round(x * pm()), same = S.np == S.party, who = PT[S.np].n, r = Math.random();
    if (S.ct >= 85) return { t: `🚨 The national government (${who}) declares a clampdown on your ${LOC.gv == 'governor' ? 'province' : 'territory'}: funds frozen, officials summoned.`, o: [[`Submit to oversight (−${g(120)} gold, tension −35, approval −4)`, s => { s.gold -= g(120); s.ct = cl(s.ct - 35); s.sup -= 4; return 'You submitted. The capital eases off for now.' }, g(120)], [`Negotiate through party channels (−${g(60)} gold, 50% success)`, s => { s.gold -= g(60); if (Math.random() < (same ? .75 : .5)) { s.ct = cl(s.ct - 25); return 'Back-channel talks worked.' } s.ct = cl(s.ct + 5); s.hap -= 3; return 'Talks failed. Inspectors stay.' }, g(60)], ['Defy the capital (approval +6, happiness −3, tension +10)', s => { s.sup += 6; s.hap -= 3; s.ct = cl(s.ct + 10); s.gold -= g(80); return 'Locals cheer, but the capital is furious (−' + g(80) + ' gold).' }]] };
    if (r < .5) return { t: `🔍 Auditors from the capital (${who}) arrive for a surprise provincial inspection.`, o: [[`Open the books (−${g(25)} gold, integrity +3, tension −6)`, s => { s.gold -= g(25); s.int += 3; s.ct = cl(s.ct - 6); return 'The audit found little. Tension eases.' }, g(25)], ['Stall and obstruct (tension +6, integrity −2)', s => { s.ct = cl(s.ct + 6); s.int -= 2; return 'The auditors report you as uncooperative.' }]] };
    return { t: `🛂 National troops tighten checkpoints on your border, blaming "security concerns". Trade and travel slow down.`, o: [[`Negotiate with the ministry (−${g(35)} gold, 55% success)`, s => { s.gold -= g(35); if (Math.random() < .55) { s.ct = cl(s.ct - 10); s.thr -= 5; return 'The checkpoints were relaxed.' } s.ct = cl(s.ct + 5); return 'The ministry refused.' }, g(35)], ['Protest publicly (approval +4, tension +10)', s => { s.sup += 4; s.ct = cl(s.ct + 10); return 'You made headlines. The capital took note.' }]] };
}
const CACT = [
    { id: 'del', ic: '🧳', n: 'Send a delegation to the capital', d: 'Courtesy calls on ministers · tension −12', c: 25, f: () => { S.ct = cl(S.ct - 12); return '🧳 Your delegation was received in the capital.' } },
    { id: 'cred', ic: '🎖️', n: 'Publicly credit the President', d: 'Share success with the national party · tension −8, approval −2', c: 0, f: () => { S.ct = cl(S.ct - 8); S.sup = cl(S.sup - 2); return '🎖️ You praised the President at a public event.' } },
    { id: 'sub', ic: '📦', n: 'Contribute to national programs', d: 'Fund a national scheme from the provincial treasury · tension −20', c: 60, f: () => { S.ct = cl(S.ct - 20); return '📦 The capital welcomed your contribution.' } }];
function cact(id) { const a = CACT.find(x => x.id == id), c = Math.round(a.c * pm()); if (!a || S.gold < c || S.day - S.cc < 14) return; S.gold -= c; S.cc = S.day; toast(a.f()); ui() }
function natHtml() {
    ensC(); if (!cOn()) return ''; const p = PT[S.np], same = S.np == S.party, gap = ctGap(), tg = ctTarget();
    const why = same ? '✅ Same party as the President: trust is high.' : '⚠ Your party differs from the President\'s: base tension ' + Math.round(ctBase()) + '.';
    const thr = gap > 3 ? `📈 Your ${LOC.gv == 'governor' ? 'province' : 'territory'} (rating ${Math.round(myRt())}) outshines the national government (${Math.round(S.nrt)}): the capital sees you as a political threat.` : `Your rating (${Math.round(myRt())}) does not outshine the national government (${Math.round(S.nrt)}).`;
    return `<div class="it" style="display:block;margin-bottom:8px"><div class="row between"><div><img src="${p.lg}" alt="" style="width:26px;height:26px;vertical-align:middle;margin-right:6px;object-fit:contain"><b>National government</b><br><small>${p.n}${same ? ' ⭐ your party' : ''} · national rating ${Math.round(S.nrt)}</small></div><b style="color:${S.ct > 60 ? 'var(--ac)' : S.ct > 40 ? 'var(--gd)' : 'var(--ok)'}">${Math.round(S.ct)}</b></div><div class="bar" style="margin:4px 0"><i style="width:${S.ct}%;background:${S.ct > 60 ? 'var(--ac)' : 'var(--gd)'}"></i></div><small><b>${ctLab(S.ct)}</b> · heading toward ${Math.round(tg)}<br>${why}<br>${thr}<br>From 40: inspections · from 50: stricter checkpoints (more border threat) · from 60: lost income · from 85: clampdowns.</small>` + CACT.map(a => { const c = Math.round(a.c * pm()), w = S.day - S.cc < 14; return `<div class="row between" style="margin-top:6px;gap:8px"><div style="flex:1"><b>${a.ic} ${a.n}</b><br><small>${a.d}</small></div><button ${w || S.gold < c ? 'disabled' : ''} onclick="cact('${a.id}')">${w ? 'Wait ' + (14 - S.day + S.cc) + 'd' : c ? money(c) : 'Free'}</button></div>` }).join('') + `</div>`
}
