function buy(k) { const c = cost(k); if (S.gold < c || S.over || job('b', k) || S.jobs.filter(j => j.k == 'b').length >= 3) return; S.gold -= c; addJob('b', k, 5 + 2 * S.b[k]); toast('Construction started: ' + B.find(x => x[0] == k)[2]); ui() }
function tp(id) { const p = PR.find(x => x.id == id); if (S.prog[id]) { delete S.prog[id]; toast('Stopped ' + p.n) } else if (!job('p', id) && S.gold >= pc(p)) { addJob('p', id, 4); toast('Rolling out ' + p.n) } S.v.dev = dev(); ui() }
function propose(id) { const l = LW.find(x => x.id == id), c = lc(l); if (S.gold < c || S.law[id] || job('l', id)) return; S.gold -= c; addJob('l', id, S.real ? 12 : 8); toast('Bill filed: ' + l.n); ui() }
function lobby() { const c = Math.round(40 * pm()); if (S.gold < c || S.day - S.lobCd < 14) return; S.gold -= c; S.lobCd = S.day; shift(3); toast('🤝 Lobbying won you 3 more council seats.'); ui() }
function setSp(i) { S.sp = i; if (i) S.lsp = i; ui() }
function finish(j) {
    if (j.k == 'c') return congVote(j); if (j.k == 'x') return presDecide(j);
    if (j.k == 'r') { const [br, ft] = jsplit(j), f = FT.find(x => x.id == ft); S.fm[br][ft] += j.n; toast('✅ ' + j.n + ' ' + f.n + (j.n > 1 ? 's' : '') + ' of ' + FU.find(u => u.id == br).n + ' trained (' + j.n * f.sz + ' soldiers)') } else if (j.k == 'b') { S.b[j.id]++; if (j.id == 'factory') S.hap -= 2; if (j.id == 'power') S.hap -= 1; if (j.id == 'resort') S.hap += 1; if (S.b[j.id] >= 4 && !(S.spz || (S.spz = {}))[j.id]) { S.spz[j.id] = 1; toast('🏆 Your province now specializes in ' + SPZ[j.id][0] + '!') } toast('✅ Built ' + B.find(x => x[0] == j.id)[2] + ' (L' + S.b[j.id] + ')') }
    else if (j.k == 'p') { S.prog[j.id] = 1; toast('✅ Program live: ' + PR.find(x => x.id == j.id).n) }
    else { const l = LW.find(x => x.id == j.id); if (Math.random() * 100 < lch(l)) { if (!ratify(l)) { S.gold += Math.round(lc(l) / 2); S.sup = cl(S.sup - 2); return } S.law[j.id] = 1; if (l.ad && S.dyn) { S.dyn = 0; S.dt = 0; S.log.unshift('🚫 The Anti-Dynasty law dissolves your family political network.') } S.sup = cl(S.sup + l.s); toast('📜 Council PASSED: ' + l.n); const ra = rawAff(S.party, l); if (ra < .3) { shift(-4); S.log.unshift('⚠ Your party is angry: −4 council seats.') } else if (ra > .7) shift(2) } else { S.gold += Math.round(lc(l) / 2); S.sup = cl(S.sup - 2); toast('❌ Council rejected: ' + l.n) } }
}
function chk() { MS.forEach(m => { if ((!m.p || m.p == S.party) && !S.done[m.id] && m.f()) { S.done[m.id] = 1; S.gold += m.r; toast('🎯 Goal done: ' + m.t + ' (+' + m.r + ')') } }) }
function pick(i) { const o = S.ev.o[i]; S.ev = null; toast(o[1](S)); S.hap = cl(S.hap); S.int = cl(S.int); S.sup = cl(S.sup); S.thr = cl(S.thr); S.v.dev = dev(); chk(); ui() }

function election() {
    const base = () => S.hap * .45 + S.sup * .3 + S.int * .15 + S.seats[S.party] * .15 + cl((50 - rank()) / 6, -6, 6), run = sp => s => { s.gold -= sp; const sc = base() + dfm('el') + sp / 15 + (S.sys ? SY[S.party].eb : 0) + Math.random() * 16 - 8; if (sc >= 44) { s.sup = cl(s.sup + 8); s.hap += 3; shift(6); return '🗳️ You WON re-election! (' + Math.round(sc) + ' pts). Your party gains seats.' } s.over = 1; s.msg = '🗳️ You lost the election (' + Math.round(sc) + ' pts) and your term ends. Final rank: #' + rank() + '.'; return 'You lost the election.' };
    return { t: (S.sys ? SY[S.party].et : '🗳️ Election Day! Voters decide if you keep your seat.') + ' Happiness, approval, integrity, your party\'s council seats and your ranking all count.', o: [['Run on your record', run(0)], ['Ad campaign (−60 gold, +4 pts)', run(60), 60], ['Big rally (−120 gold, +8 pts)', run(120), 120]] }
}

function dayTick() {
    ensF(); ensD(); S.day++; const f = 1 / 21, b = S.b, inc = income(), ir = ira(), up = upkeep(); S.gold += (inc + ir - up) * f; econTick();
    if (S.gold < 0) { S.gold = 0; if (Object.keys(S.prog).length) { S.prog = {}; S.hap -= 3; toast('💸 Budget deficit! Programs suspended.') } else { S.hap -= .4; S.sup -= .3; if (S.day % 7 == 0) toast('💸 Unpaid salaries are hurting morale.') } }
    const prod = S.pop / 100 * (1 + .12 * b.farm + .04 * (b.port || 0) + fx('food')), need = S.pop / 100; S.food = Math.min(300, S.food + (prod - need) * 3 * f);
    if (S.food < 0) { S.hap -= 4 * f; S.pop *= 1 - .01 * f; S.food = 0 } else S.pop *= 1 + (.004 + .002 * b.hospital + fx('pop')) * f;
    const P = pw(); S.thr = cl(S.thr + EXR[S.ex] * dfm('thr') + fx('thr') + dipT() + ctThr() - (P[0] + P[1]) * .2); const tgt = 55 + S.c.hap + b.hospital * 4 + b.school * 2 + b.road * 1.5 + b.guard * 2 - b.factory * 1.5 - (b.mining * 1.2 + b.logging * .7) * (S.law.env ? .4 : 1) - labAway() * .25 - [-8, 0, 12][S.tax] + fx('hap') - dfm('hd') - S.thr / 25 + Math.min(4, P[2] * .4);
    S.hap = cl(S.hap + (tgt - S.hap) * .25 * f); S.sup = cl(S.sup + (S.hap * .7 + 25 - S.sup) * .15 * f + fx('sup')); S.int = cl(S.int + (fx('int') - .15 - (b.mining + b.logging) * .12 * (S.law.env ? 0 : 1)) * f);
    all.forEach(v => { if (v !== S.v) v.dev = Math.min(100, +(v.dev + (Math.random() * .4 + .05) * f).toFixed(3)) });
    ctTick(); histTick(); draftTick(); if (S.day % 7 == 0) monthReview(); dipTick(); S.jobs.forEach(j => j.left--); S.jobs.filter(j => j.left <= 0).forEach(finish); S.jobs = S.jobs.filter(j => j.left > 0);
    S.v.dev = dev(); if (S.day % 7 == 0) S.h.push(S.v.dev); chk(); if (S.day % 84 == 0 && S.day < S.end) yearReview();
    const season = LOC.season(Math.floor(S.day % 84 / 7));
    if (S.hap < 12) { S.over = 1; S.msg = '💥 Revolt! You were removed from office.' }
    else if (S.day >= S.end) { const r = rank(), q = S.lv == 0 ? r <= 25 : S.lv == 1 ? S.hap >= 65 && S.sup >= 55 : 0; if (q && S.lv < 2) S.ev = promoEv(); else { S.over = 1; S.msg = `🏁 Term over. ${S.v.n} ranks #${r} of ${all.length} in development. ` + (S.lv == 2 ? '🇵🇭 You completed your presidency! ' : '') + (r == 1 ? '🏆 Outstanding leader!' : r <= 10 ? '🥈 Great work.' : r <= 30 ? 'Solid work.' : 'Keep studying the economy!') + (S.lv < 2 && !q ? ' You lacked the standing to run for higher office.' : '') } }
    else if (S.day % 252 == 0 && S.day < S.end) S.ev = election();
    else if (S.int < 30 && Math.random() < .35 / 21) S.ev = SC;
    else if (Math.random() < S.thr / 100 * .03) S.ev = BE[Math.floor(Math.random() * BE.length)];
    else if (fMen('caf') > fMen('mil') && Math.random() < .003 * fMen('caf') / 50) S.ev = CA;
    else if (dOn() && Math.random() < .03) S.ev = dipEv();
    else if (cOn() && S.ct >= 40 && Math.random() < (S.ct - 30) / 100 * .025 * (S.np == S.party ? .4 : 1)) S.ev = ctEv();
    else if (season && Math.random() < (.16 + (S.tr.includes('storm') ? .14 : 0)) / 21) S.ev = TY;
    else if (Math.random() < DF[S.dif].ev / 21) { let e; do e = EV[Math.floor(Math.random() * EV.length)]; while (e.t.includes('Armed') && !S.tr.includes('conf') && Math.random() < .8); S.ev = e }
    if (S.ev && !S.ev.px) { const k = Object.keys(XV).find(k => S.ev.t.includes(k)), x = k && XV[k][S.party]; S.ev = Object.assign({}, S.ev, { px: 1, o: x ? S.ev.o.concat([['⭐ ' + x[0], x[1], x[2]]]) : S.ev.o }) }
    if (S.pev && !S.ev && !S.over) { S.ev = S.pev; S.pev = null }
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
    $('g').textContent = money(S.gold); $('pop').textContent = Math.round(S.pop).toLocaleString(); $('fd').textContent = Math.round(S.food); $('dv').textContent = S.v.dev; if ($('hdi')) $('hdi').textContent = hdi().toFixed(3);
    [['hap', S.hap], ['sup', S.sup], ['int', S.int], ['thr', S.thr], ['bsec', borderSec().score]].concat(cOn() ? [['ct', S.ct]] : []).forEach(([k, v]) => { $(k + 'i').style.width = v + '%'; $(k + 'v').textContent = Math.round(v) });
    document.querySelectorAll('[data-j]').forEach(e => { const j = S.jobs.find(x => x.k + x.id == e.dataset.j); if (j) e.style.width = (100 * (j.tot - j.left + u) / j.tot) + '%' });
    document.querySelectorAll('[data-l]').forEach(e => { const j = S.jobs.find(x => x.k + x.id == e.dataset.l); if (j) e.textContent = Math.max(0, j.left - u).toFixed(1) })
}
