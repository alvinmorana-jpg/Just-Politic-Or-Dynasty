const FU = [{ id: 'pol', n: 'Police (PNP)', ic: '👮', pay: 1.05, ops: .45, eq: 4, d: 'Best at guard posts and keeping the peace' }, { id: 'mil', n: 'Military (AFP)', ic: '🪖', pay: 1, ops: .7, eq: 6, d: 'Best at border patrol and defense. Costly to equip' }, { id: 'caf', n: 'CAFGU Militia', ic: '🧑‍🌾', pay: .35, ops: .25, eq: 2, d: 'Cheap part-time reservists on a stipend, good at static watch. Too many risks abuses' }];
const EF = { pol: [.5, 1, 1], mil: [1, .8, .5], caf: [.4, .6, .6] }, EXR = [0, .5, 1, 1.6], EXN = ['', 'Low', 'Medium', 'High'];
const EXH = 'Batanes,Sulu,Tawi-Tawi,Palawan,Basilan,Davao Occidental,Cagayan,Zamboanga del Sur,Zamboanga del Norte,Zamboanga Sibugay,Sarangani'.split(','), EXM = 'Ilocos Norte,Masbate,Romblon,Surigao del Norte,Eastern Samar,Northern Samar,Dinagat Islands,Davao Oriental,Occidental Mindoro,Zambales,Camarines Norte,Isabela,Aurora,Quezon,Siquijor,Misamis Occidental,Lanao del Norte,Maguindanao,Cotabato,Agusan del Norte,Surigao del Sur'.split(',');
const exOf = n => EXH.includes(n) ? 3 : EXM.includes(n) ? 2 : 1;
const BE = [
    { t: '🚤 Smugglers are using a coastal route into your province.', o: [['Intensify patrols (−30 gold, threat −10)', s => { s.gold -= 30; s.thr -= 10; return 'Patrol boats intercepted the smugglers.' }, 30], ['Ignore it (−40 gold, threat +8)', s => { s.gold -= 40; s.thr += 8; return 'Contraband floods the markets.' }]] },
    { t: '🛥️ Foreign fishing vessels are poaching in your waters.', o: [['Send patrol boats (−40 gold, threat −12, approval +3)', s => { s.gold -= 40; s.thr -= 12; s.sup += 3; return 'The poachers are driven away.' }, 40], ['Only file a protest (threat +5, approval −3)', s => { s.thr += 5; s.sup -= 3; return 'The poaching continues.' }]] },
    { t: '🪖 Armed men cross the provincial border.', o: [['Deploy soldiers (−60 gold, threat −20)', s => { s.gold -= 60; s.thr -= 20; return 'The intruders are pushed back.' }, 60], ['Set up police checkpoints (−30 gold, 50% success)', s => { s.gold -= 30; return Math.random() < .5 ? (s.thr -= 10, 'Checkpoints stopped them.') : (s.thr += 5, s.hap -= 5, 'They slipped through. Residents panic.') }, 30]] }];
const CA = { t: '⚖️ Human-rights groups report abuses by CAFGU members.', o: [['Investigate and discipline (−30 gold, integrity +4)', s => { s.gold -= 30; s.int += 4; return 'The abusers are removed.' }, 30], ['Dismiss the complaints (approval −6, integrity −6)', s => { s.sup -= 6; s.int -= 6; return 'Public trust erodes.' }]] };
const SPD = [0, 1, 4, 20, 100], CYC = 300;
let TM = []; const TT = ['Governor', 'Regional Representative', 'President'];
const TN = {}; let hqI = -1;
// =====================================================================
//  REAL-LIFE FORCES: soldiers are paid a real monthly salary by rank, and are raised as whole
//  formations (squad, platoon, company, battalion, brigade) with a realistic rank pyramid.
//  1 gold = LOC.cur.u million of local currency, so pay is converted from real money into gold.
// =====================================================================
const RK = [['Private', 1], ['Corporal', 1.12], ['Sergeant', 1.3], ['Lieutenant', 1.55], ['Captain', 1.85], ['Major', 2.3], ['Lt. Colonel', 2.8], ['Colonel', 3.4]];
const RKA = ['Pvt', 'Cpl', 'Sgt', 'Lt', 'Cpt', 'Maj', 'LtC', 'Col'];
const RKR = [[70, 78], [7, 10], [10, 14], [3, 5], [.8, 2], [.3, 1], [.1, .4], [0, .1]]; // typical share of a force, in %
const rkn = i => (LOC.rk || RK.map(r => r[0]))[i];
const addC = (a, b, k = 1) => a.map((x, i) => x + b[i] * k);
const FM0 = [0, 0, 0, 0, 0, 0, 0, 0];
// headcount by rank: [Private, Corporal, Sergeant, Lieutenant, Captain, Major, Lt. Colonel, Colonel]
const F_SQ = [8, 1, 1, 0, 0, 0, 0, 0];
const F_PL = addC([1, 0, 1, 1, 0, 0, 0, 0], F_SQ, 3);
const F_CO = addC([8, 0, 1, 1, 1, 0, 0, 0], F_PL, 3);
const F_BN = addC([30, 4, 6, 2, 1, 2, 1, 0], F_CO, 4);
const F_BG = addC([60, 8, 10, 4, 3, 3, 1, 1], F_BN, 3);
// t = training days, q = effectiveness on [patrol, defense, peace]: small teams patrol well, big formations hold ground well
const FT = [
    { id: 'sq', n: 'Squad', ic: '👥', c: F_SQ, t: 3, q: [1.1, .9, 1], d: 'Small and nimble. Best for patrols' },
    { id: 'pl', n: 'Platoon', ic: '🪖', c: F_PL, t: 6, q: [1.05, 1, 1.05], d: '3 squads and a command team' },
    { id: 'co', n: 'Company', ic: '🚩', c: F_CO, t: 12, q: [1, 1.05, 1.1], d: '3 platoons and a company HQ' },
    { id: 'bn', n: 'Battalion', ic: '🎖️', c: F_BN, t: 24, q: [.95, 1.1, 1.1], d: '4 companies and a battalion HQ' },
    { id: 'bg', n: 'Brigade', ic: '⭐', c: F_BG, t: 42, q: [.9, 1.15, 1.05], d: '3 battalions and a brigade HQ' }];
FT.forEach(f => f.sz = f.c.reduce((a, b) => a + b, 0));
const mkFm = () => ({ sq: 0, pl: 0, co: 0, bn: 0, bg: 0 }), mkDp = () => ({ sq: [0, 0, 0], pl: [0, 0, 0], co: [0, 0, 0], bn: [0, 0, 0], bg: [0, 0, 0] });
function startF() {
    const fm = { pol: Object.assign(mkFm(), { pl: 3 }), mil: Object.assign(mkFm(), { pl: 1, sq: 1 }), caf: mkFm() }, dp = { pol: mkDp(), mil: mkDp(), caf: mkDp() };
    dp.pol.pl = [0, 2, 1]; dp.mil.pl = [1, 0, 0]; dp.mil.sq = [1, 0, 0]; return { fm, dp, pk: [] }
}
function ensF() { // old saves counted vague "units"; turn each into a platoon
    if (!S || S.fm) return; const fm = {}, dp = {};
    FU.forEach(u => { fm[u.id] = mkFm(); dp[u.id] = mkDp(); fm[u.id].pl = (S.fc && S.fc[u.id]) || 0; const a = (S.as && S.as[u.id]) || [0, 0, 0]; dp[u.id].pl = [a[0], a[1], a[2]] });
    S.fm = fm; S.dp = dp; S.pk = S.pk || []; delete S.fc; delete S.as; S.jobs.forEach(j => { if (j.k == 'r' && String(j.id).indexOf('.') < 0) j.id = j.id + '.pl' })
}
const lm = n => LOC.cur.sym + Math.round(n).toLocaleString();
const loc2g = v => v / (LOC.cur.u * 1e6);
const pkN = (br, ft) => (S.pk || []).reduce((a, m) => a + (m.br == br && m.ft == ft ? m.n : 0), 0);
const freeF = (br, ft) => S.fm[br][ft] - S.dp[br][ft][0] - S.dp[br][ft][1] - S.dp[br][ft][2] - pkN(br, ft);
const fMen = br => FT.reduce((a, f) => a + S.fm[br][f.id] * f.sz, 0), menAll = () => FU.reduce((a, u) => a + fMen(u.id), 0);
const rkVec = br => FT.reduce((a, f) => addC(a, f.c, S.fm[br][f.id]), FM0);
const payF = () => S.real ? Math.pow(1.035, yrNow() - 2026) : 1, rkPay = (br, i) => LOC.pay * payF() * RK[i][1] * FU.find(u => u.id == br).pay; // real monthly salary, local currency
const fmPayQ = (br, ft) => loc2g(FT.find(f => f.id == ft).c.reduce((a, n, i) => a + n * rkPay(br, i) * 3, 0)); // one formation, one quarter, in gold
const payQ = br => loc2g(rkVec(br).reduce((a, n, i) => a + n * rkPay(br, i) * 3, 0));
const fu = () => FU.reduce((a, u) => a + payQ(u.id) * (1 + u.ops), 0);
const fcap = () => Math.max(250, Math.round(Math.min(S.pop, 20000) * .9));
const jsplit = j => { const s = String(j.id).split('.'); return [s[0], s[1] || 'pl'] };
const tot = () => menAll() + S.jobs.reduce((a, j) => { if (j.k != 'r') return a; const [, ft] = jsplit(j); return a + j.n * FT.find(f => f.id == ft).sz }, 0);
const rcF = (br, ft, n) => { const f = FT.find(x => x.id == ft), u = FU.find(x => x.id == br); return loc2g(f.c.reduce((a, k, i) => a + k * rkPay(br, i) * u.eq, 0)) * n * (n >= 5 ? .9 : 1) * ((pt().fd || {})[br] || 1) };
const canR = (br, ft, n) => !job('r', br + '.' + ft) && S.gold >= rcF(br, ft, n) && tot() + n * FT.find(f => f.id == ft).sz <= fcap();
const pw = () => { const r = [0, 0, 0]; FU.forEach(u => FT.forEach(f => S.dp[u.id][f.id].forEach((n, i) => r[i] += n * f.sz / 50 * EF[u.id][i] * f.q[i]))); return r };
function recruit(br, ft, n) {
    if (!canR(br, ft, n)) return; const f = FT.find(x => x.id == ft); S.gold -= rcF(br, ft, n);
    addJob('r', br + '.' + ft, Math.round((f.t + Math.floor(n / 5) * 2) * (S.real ? 1.3 : 1)), { n }); toast('Raising ' + n + ' ' + f.n + (n > 1 ? 's' : '') + ' (' + n * f.sz + ' soldiers)'); ui()
}
function asg(br, ft, i, d) { const a = S.dp[br][ft]; if (d > 0 && freeF(br, ft) < 1 || d < 0 && a[i] < 1) return; a[i] += d; ui() }
function asgAll(br, ft, i) { const k = freeF(br, ft); if (k < 1) return; S.dp[br][ft][i] += k; ui() }
function disb(br, ft) { if (freeF(br, ft) < 1) return; S.fm[br][ft]--; toast('Disbanded 1 ' + FT.find(f => f.id == ft).n + ' of ' + FU.find(u => u.id == br).n + '. Their pay stops.'); ui() }
function tn(id, el) { TN[id] = Math.max(1, Math.floor(+el.value) || 1); const [br, ft] = id.split('.'); $('rb-' + id).disabled = !canR(br, ft, TN[id]); $('rn-' + id).textContent = TN[id]; $('rc-' + id).textContent = money(rcF(br, ft, TN[id])) }
const compStr = c => c.map((n, i) => n ? n + ' ' + RKA[i] : '').filter(Boolean).reverse().join(' · ');
function forcesHtml() {
    ensF(); const p = pw(), b = S.fb && FU.some(x => x.id == S.fb) ? S.fb : 'pol', u = FU.find(x => x.id == b), n = menAll();
    const vec = FU.reduce((a, x) => addC(a, rkVec(x.id)), FM0), tv = vec.reduce((a, c) => a + c, 0) || 1, pay = FU.reduce((a, x) => a + payQ(x.id), 0);
    const rows = RK.map((r, i) => { const sh = vec[i] / tv * 100, warn = tv >= 150 && (sh < RKR[i][0] * .7 || sh > RKR[i][1] * 1.3 + .05); return `<tr><td>${rkn(i)}</td><td>${vec[i].toLocaleString()}</td><td style="color:${warn ? 'var(--gd)' : 'inherit'}">${sh.toFixed(1)}% <small>(${RKR[i][0]}–${RKR[i][1]}%)</small></td><td>${lm(rkPay(b, i))}</td></tr>` }).join('');
    let h = `<small>Border exposure: <b>${EXN[S.ex]}</b> · Personnel <b>${n.toLocaleString()}</b> of ${fcap().toLocaleString()} allowed. Soldiers draw a <b>real salary by rank</b> (a ${rkn(0)} earns about <b>${lm(LOC.pay * payF())}</b> a month${S.real ? ' in ' + yrNow() + ' money' : ''}, rounded from published pay scales). Raise whole <b>squads, platoons, companies, battalions or brigades</b>, then assign them to <b>Border Patrol</b> (mobile and sea patrols), <b>Border Defense</b> (checkpoints and posts) or <b>Peacekeeping</b> (order at home). Threat grows daily with exposure and shrinks with patrol and defense power.</small>`;
    h += `<p><small>Power · Patrol ${p[0].toFixed(1)} · Defense ${p[1].toFixed(1)} · Peace ${p[2].toFixed(1)}<br>Payroll ${money(pay)}/qtr + equipment &amp; operations ${money(fu() - pay)}/qtr</small></p>`;
    { const bs = borderSec(); h += `<div class="it" style="display:block"><b>🛡️ Border Security: ${bs.score}/100 ${bs.lbl}</b><br><small>Safety ${bs.safety} (inverse of border threat) · Force coverage ${bs.cover}% (patrol + defense ${bs.have.toFixed(1)} of ${bs.need.toFixed(1)} needed to hold the line) · Guard posts ${bs.posts}</small><div class="bar" style="margin:4px 0"><i style="width:${bs.score}%;background:${bs.score >= 55 ? 'var(--ok)' : 'var(--ac)'}"></i></div><small>Raise it by training patrol/defense units, building Security posts, or passing defense laws.</small></div>`; }
    if (S.law.draft) h += `<div class="it" style="display:block"><b>🪖 Mandatory service (3 years)</b><br><small>Choose where conscripts serve. ${(S.dr || []).reduce((a, x) => a + x.n * 33, 0).toLocaleString()} conscripts are serving now.</small><div class="seg" style="margin-top:6px">${FU.map(x => `<button class="${(S.cs || 'mil') == x.id ? 'on' : ''}" onclick="S.cs='${x.id}';ui()">${x.ic} ${x.n}</button>`).join('')}</div></div>`;
    h += `<details style="margin:6px 0 10px"><summary><b>📊 Rank structure &amp; pay</b> <small>(${u.n})</small></summary><table class="rt"><tr><th>Rank</th><th>Soldiers</th><th>Share <small>(typical)</small></th><th>Pay / month</th></tr>${rows}</table><small>${u.n} pay is ${Math.round(u.pay * 100)}% of the base scale. Real forces are about 3 in 4 enlisted, with roughly 1 officer for every 10 soldiers. Amber means your mix has drifted from the typical range. Larger formations include their own officers and staff.</small></details>`;
    h += `<div class="seg" style="margin-bottom:8px">${FU.map(x => `<button class="${x.id == b ? 'on' : ''}" onclick="S.fb='${x.id}';ui()">${x.ic} ${fMen(x.id).toLocaleString()}</button>`).join('')}</div>`;
    h += `<div class="it" style="display:block"><b>${u.ic} ${u.n}</b><br><small>${u.d} · ${fMen(b).toLocaleString()} personnel · ${money(payQ(b))} payroll/qtr</small></div>`;
    h += FT.map(f => {
        const a = S.dp[b][f.id], fr = freeF(b, f.id), j = job('r', b + '.' + f.id), q = TN[b + '.' + f.id] || 1, id = b + '.' + f.id;
        return `<div class="it" style="display:block"><div class="row between"><div><b>${f.ic} ${f.n}</b> <small>${f.sz.toLocaleString()} soldiers</small><br><small>${compStr(f.c)}<br>${f.d} · ${money(fmPayQ(b, f.id))} payroll/qtr each</small></div><div style="text-align:right"><b>${S.fm[b][f.id]}</b><small> formed<br>${fr} free</small></div></div>` +
            (S.fm[b][f.id] ? `<div class="stps">${['Patrol', 'Defense', 'Peace'].map((nm, i) => `<div class="stp"><small>${nm}</small><div><button onclick="asg('${b}','${f.id}',${i},-1)" ${a[i] < 1 ? 'disabled' : ''}>−</button><b ondblclick="asgAll('${b}','${f.id}',${i})" title="Double-click to assign every free one">${a[i]}</b><button onclick="asg('${b}','${f.id}',${i},1)" ${fr < 1 ? 'disabled' : ''}>+</button></div></div>`).join('')}</div><div class="row" style="margin-top:6px"><button onclick="disb('${b}','${f.id}')" ${fr < 1 ? 'disabled' : ''}>Disband 1 free</button><small>&nbsp;Double-click a number to assign all free ${f.n.toLowerCase()}s</small></div>` : '') +
            (j ? jb('r', id, 'Training ' + j.n + ' ' + f.n.toLowerCase() + (j.n > 1 ? 's' : '')) : `<div class="row" style="margin-top:8px"><input type="number" inputmode="numeric" min="1" step="1" value="${q}" aria-label="${f.n}s to raise" style="width:84px;font:inherit;padding:8px;border-radius:11px;border:1px solid var(--bd);background:var(--card);color:var(--fg)" oninput="tn('${id}',this)"><button id="rb-${id}" ${canR(b, f.id, q) ? '' : 'disabled'} onclick="recruit('${b}','${f.id}',TN['${id}']||1)">Raise <span id="rn-${id}">${q}</span> · <span id="rc-${id}">${money(rcF(b, f.id, q))}</span></button></div><small>Recruiting &amp; equipment cost, ${f.t + Math.floor(q / 5) * 2}+ days of training</small>`) + `</div>`
    }).join('');
    if (S.pk && S.pk.length) h += `<p><small>🕊️ Abroad on peacekeeping: ${S.pk.map(m => NATS[m.c][1] + ' ' + m.n + ' ' + FT.find(f => f.id == m.ft).n.toLowerCase() + (m.n > 1 ? 's' : '') + ' (' + Math.max(0, m.left) + ' days left)').join(', ')}</small></p>`;
    return h
}
