// =====================================================================
//  CONGRESS LAWS: national bills need a Congress vote, then the President's signature
// =====================================================================
const CL = [
    { id: 'natwage', n: 'National Minimum Wage Act', d: 'A higher wage floor across the country', cost: 50, s: 3, fx: { hap: 3, inc: -.03 } },
    { id: 'uhc', n: 'Universal Healthcare Act', d: 'Free basic care for every citizen', cost: 70, s: 4, fx: { hap: 3, dev: 1, pop: .002 } },
    { id: 'devolve', n: 'Local Government Devolution Act', d: 'More national funds and powers pass to local governments', cost: 50, s: 2, fx: { inc: .06, int: .2 } },
    { id: 'defmod', n: 'Defense Modernization Act', d: 'New equipment and training for the armed forces', cost: 60, s: 0, fx: { thr: -.4, hap: -.5 } },
    { id: 'infra', n: 'National Infrastructure Program', d: 'Highways, ports and bridges nationwide', cost: 70, s: 2, fx: { dev: 2, inc: .04 } },
    { id: 'fdi', n: 'Foreign Investment Liberalization Act', d: 'Open more industries to foreign owners', cost: 50, s: -1, fx: { inc: .08, hap: -1 } },
    { id: 'digital', n: 'National Digital Infrastructure Act', d: 'Fiber, towers and e-government for all', cost: 55, s: 1, fx: { dev: 2, inc: .03, int: .3 } },
    { id: 'agrarian', n: 'Agrarian Reform Extension Act', d: 'Land for tenant farmers, credit and support', cost: 50, s: 3, fx: { food: .1, hap: 2, inc: -.02 } },
    { id: 'renew', n: 'National Renewable Energy Act', d: 'Solar, wind and hydro targets with incentives', cost: 55, s: 2, fx: { dev: 1, hap: 1, inc: -.01 } },
    { id: 'anticorr', n: 'Anti-Corruption Commission Act', d: 'A powerful independent graft watchdog', cost: 45, s: 2, fx: { int: .6, hap: 1 } },
    { id: 'coastguard', n: 'Coast Guard & Border Security Act', d: 'More ships, bases and border posts', cost: 55, s: 0, fx: { thr: -.5 } },
    { id: 'taxreform', n: 'Comprehensive Tax Reform Act', d: 'Broader tax base, lower rates for business', cost: 50, s: -2, fx: { inc: .05, hap: -1.5 } }];
Object.assign(LT, { natwage: { w: 1, b: -.6 }, uhc: { w: 1, g: .2 }, devolve: { b: .3, r: .4 }, defmod: { o: 1 }, infra: { b: .6, g: -.2 }, fdi: { b: 1, w: -.3 }, digital: { r: .8 }, agrarian: { w: .8, g: .3 }, renew: { g: 1 }, anticorr: { r: .5, w: .2 }, coastguard: { o: 1 }, taxreform: { b: .6 } });
const PRT = { pop: ['Populist', 'loves laws that make people happy and win applause'], hawk: ['Hawk', 'backs security and border laws above all'], tech: ['Technocrat', 'prefers integrity, growth and development'], prag: ['Pragmatist', 'a deal-maker: good relations with the capital win favors'] };
function ensP() {
    if (!S) return; S.cl = S.cl || {}; S.cv = S.cv || {}; S.pq = S.pq || {};
    const rp = S.lv == 2 ? S.party : S.np; if (!rp) return;
    if (!S.pr || S.pr.p != rp) { const ks = Object.keys(PRT); S.pr = { n: PF[Math.floor(Math.random() * PF.length)] + ' ' + PS[Math.floor(Math.random() * PS.length)], tr: ks[Math.floor(Math.random() * ks.length)], p: rp }; S.pq = {} }
    if (!S.cgs || S.cgl != S.lv || S.cgp != rp) { const w = Object.keys(PT).map(k => [k, .5 + Math.random() + (k == rp ? 1.2 : 0)]), t = w.reduce((a, x) => a + x[1], 0); S.cgs = {}; w.forEach(([k, x]) => S.cgs[k] = x / t * 100); S.cgl = S.lv; S.cgp = rp }
}
const clc = l => Math.round(l.cost * pm()), cAct = () => S.jobs.filter(j => j.k == 'c' || j.k == 'x').length;
const congP = l => cl(Object.keys(S.cgs).reduce((a, p) => a + S.cgs[p] * rawAff(p, l), 0) + (S.sup - 50) / 5 + 8 + dfm('pr') * 40, 5, 95);
const pqf = (l, k) => { const key = k + l.id; if (S.pq[key] == null) S.pq[key] = (Math.random() - .5) * (k == 'q' ? .44 : .24); return S.pq[key] };
function presP(l) { // chance the President signs: party view + personality + a personal quirk + your relationship with the capital
    const pr = S.pr, f = l.fx; let p = .2 + rawAff(S.np, l) * .6 + pqf(l, 'q') + dfm('pr');
    if (pr.tr == 'pop') p += (f.hap || 0) * .04 + l.s * .03; else if (pr.tr == 'hawk') p += -(f.thr || 0) * .5; else if (pr.tr == 'tech') p += (f.int || 0) * .1 + (f.inc || 0) * 3 + (f.dev || 0) * .03; else p += (50 - S.ct) / 300;
    if (S.np == S.party) p += .1; p -= S.ct / 200; return cl(p, .05, .95)
}
const lean = l => { const p = presP(l) + pqf(l, 'h'); return p > .62 ? ['Likely to sign', 'var(--ok)'] : p < .38 ? ['Likely to veto', 'var(--ac)'] : ['Undecided', 'var(--gd)'] };
function enact(l, k) { S.cl[l.id] = k; S.sup = cl(S.sup + l.s * (k == 2 ? .5 : 1)); S.v.dev = dev() }
function fileBill(id) {
    const l = CL.find(x => x.id == id), c = clc(l); if (!l || S.gold < c || S.cl[id] || job('c', id) || job('x', id) || cAct() >= 2 || (S.cv[id] && S.day - S.cv[id] < 28)) return;
    S.gold -= c; addJob('c', id, S.real ? 18 : 12); toast('📜 Bill filed in Congress: ' + l.n); ui()
}
function congVote(j) {
    const l = CL.find(x => x.id == j.id), p = congP(l);
    if (Math.random() * 100 < p) { if (S.lv == 2) { enact(l, 1); toast('✍️ Congress passed it and you signed: ' + l.n) } else { addJob('x', l.id, 5); toast('🏛️ Congress PASSED ' + l.n + '. It now awaits the ' + TT[2] + '\'s signature.') } }
    else { S.gold += Math.round(clc(l) * .4); S.sup = cl(S.sup - 1); S.cv[l.id] = S.day; toast('❌ Congress rejected: ' + l.n) }
}
function presDecide(j) {
    const l = CL.find(x => x.id == j.id), p = presP(l), r = Math.random(), nm = TT[2] + ' ' + S.pr.n;
    if (r < p) { enact(l, 1); toast('✍️ ' + nm + ' SIGNED: ' + l.n); if (S.np != S.party) S.ct = cl(S.ct - 2); return }
    S.cv[l.id] = S.day; S.pev = vetoEv(l, r < p + .2)
}
function vetoEv(l, soft) {
    const g = x => Math.round(x * pm()), ov = cl((congP(l) - 40) / 50, .05, .9), nm = TT[2] + ' ' + S.pr.n;
    return {
        t: soft ? `📝 ${nm} will not sign "${l.n}" as written and sends it back demanding amendments.` : `🛑 ${nm} VETOES "${l.n}"!`, o: [
            [soft ? 'Accept the amendments (law passes at half strength, tension −3)' : `Negotiate a watered-down version (−${g(20)} gold, half strength, tension −3)`, s => { if (!soft) s.gold -= g(20); enact(l, 2); s.ct = cl(s.ct - 3); return 'A diluted ' + l.n + ' became law.' }, soft ? 0 : g(20)],
            [`Lobby Congress to override (−${g(40)} gold, ${Math.round(ov * 100)}% success, tension +8)`, s => { s.gold -= g(40); s.ct = cl(s.ct + 8); if (Math.random() < ov) { enact(l, 1); return '💪 Congress overrode the veto! ' + l.n + ' is law.' } s.sup -= 2; return 'The override failed. The bill is dead.' }, g(40)],
            ['Drop the bill (refund 40%)', s => { s.gold += Math.round(clc(l) * .4); return 'You let the bill die.' }]]
    }
}
const lawSeg = () => `<div class="seg" style="margin-bottom:8px"><button class="${S.lt == 'c' ? '' : 'on'}" onclick="S.lt='p';ui()">${['Provincial', 'Regional', 'National Council'][S.lv || 0]} Laws</button><button class="${S.lt == 'c' ? 'on' : ''}" onclick="S.lt='c';ui()">🏛️ Congress Laws</button></div>`;
function congressHtml() {
    ensP(); ensC(); const ks = Object.keys(S.cgs).sort((a, b) => S.cgs[b] - S.cgs[a]), pr = S.pr, pp = PT[S.lv == 2 ? S.party : S.np];
    let h = `<div class="ov">National Congress · seats by party</div><div class="seats">${ks.map(k => `<i style="width:${S.cgs[k]}%;background:${PT[k].c}" title="${PT[k].n} ${S.cgs[k].toFixed(0)}%"></i>`).join('')}</div><small>${ks.slice(0, 3).map(k => PT[k].n + ' ' + S.cgs[k].toFixed(0) + '%').join(' · ')}. A bill is debated 12 days, then Congress votes by seats and ideology.${S.lv == 2 ? ' As ' + TT[2] + ' you sign passed bills yourself.' : ' Passed bills go to the ' + TT[2] + ', who may sign, demand amendments or veto.'}</small>`;
    if (S.lv < 2) h += `<div class="it" style="display:block;margin:8px 0"><img src="${pp.lg}" alt="" style="width:26px;height:26px;vertical-align:middle;margin-right:6px;object-fit:contain"><b>${TT[2]} ${pr.n}</b> · ${pp.n}${S.np == S.party ? ' ⭐' : ''}<br><small>${PRT[pr.tr][0]}: ${PRT[pr.tr][1]}. Capital tension ${Math.round(S.ct)}: a tense relationship makes a signature less likely. Even friendly presidents have their own views, and signals can be wrong.</small></div>`;
    return h + CL.map(l => {
        const jc = job('c', l.id), jx = job('x', l.id), done = S.cl[l.id], c = clc(l), ln = lean(l), cd = S.cv[l.id] && S.day - S.cv[l.id] < 28 ? 28 - (S.day - S.cv[l.id]) : 0;
        return `<div class="it"><div style="flex:1"><b>${l.n}</b><br>${jc ? jb('c', l.id, 'In Congress') : jx ? jb('x', l.id, 'On the ' + TT[2] + '\'s desk') : `<small>${l.d} · Congress support ${Math.round(congP(l))}%${S.lv < 2 ? ` · <span style="color:${ln[1]}">${TT[2]}: ${ln[0]}</span>` : ''}</small>`}</div>${done ? `<b>${done == 2 ? '✔ Law (diluted)' : '✔ Law'}</b>` : `<button ${jc || jx || S.gold < c || cAct() >= 2 || cd ? 'disabled' : ''} onclick="fileBill('${l.id}')">${jc || jx ? '⏳' : cd ? cd + 'd' : money(c)}</button>`}</div>`
    }).join('') + '<small>Up to 2 national bills at once. A rejected or vetoed bill can be re-filed after 28 days.</small>'
}
