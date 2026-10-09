/* Schedule, league table, AI, awards, continental cup, lineup engine, live match */
/* ===== 18-team double round-robin scheduler ===== */
function sched(n) {
    n = n || TEAMS;
    const T = Array.from({ length: n }, (_, i) => i);
    const F = [];
    for (let r = 0; r < n - 1; r++) {
        const m = [];
        for (let i = 0; i < n / 2; i++) { const a = T[i], b = T[n - 1 - i]; m.push(r % 2 ? [b, a] : [a, b]) }
        F.push(m);
        T.splice(1, 0, T.pop());
    }
    const D = F.map(round => round.map(([a, b]) => [b, a]));
    return F.concat(D);
}

function mkTeam(sp, lv) { const b = 32 + lv * 1.8, k = Math.min(5, Math.floor(lv / 8)), sl = Object.values(FM[sp.id])[0].flat(), t = { n: pick([...plc(), 'Harbor', 'Valley', 'Highland', 'Riverside', 'Lakeside', 'Metro']) + ' ' + pick(SUF), camp: k, arena: k, staff: { coach: k, fit: k, phys: k, scout: k }, m: 5000 + lv * 400, rec: { w: 0, d: 0, l: 0 }, fm: '', roster: [] }; for (let i = 0; i < sp.s + 2; i++) { const o = Math.round(b + R(-6, 6)); const p = { n: pick(FN) + ' ' + pick(LN), pos: i < sl.length ? sl[i] : pick(ROLES[sp.id]), age: RI(18, 33), o, p: Math.min(99, o + RI(0, 10)), inj: 0 }; genAttrs(sp, p); t.roster.push(p) } return t }
function newLeague(sp, d) { const u = new Set(); d.lg = []; while (d.lg.length < TEAMS - 1) { const t = mkTeam(sp, d.lv); if (!u.has(t.n)) { u.add(t.n); d.lg.push(t) } } d.fx = sched(TEAMS); d.rs = []; d.rec = { w: 0, d: 0, l: 0 } }
function tbl(sp, d) { return [d, ...d.lg].map((t, i) => ({ t, i, n: i ? t.n : G.geo.n, p: pts(t), g: t.rec.w + t.rec.d + t.rec.l })).sort((a, b) => b.p - a.p || b.t.rec.w - a.t.rec.w || rate(sp, b.t) - rate(sp, a.t)) }
function ai(sp, t, L) {
    if (Math.random() < .55) return;
    let b = t.fm, bv = -1; Object.keys(FM[sp.id]).forEach(k => { t.fm = k; const v = rate(sp, t); if (v > bv) { bv = v; b = k } }); t.fm = b;
    const c = mk(sp, t), w = t.roster.reduce((a, p) => p.o < a.o ? p : a);
    if (t.m > fee(c) + 1500 && c.o > w.o + 2) { t.m -= fee(c); t.roster.push(c); if (t.roster.length > sp.s + 3) t.roster.splice(t.roster.indexOf(w), 1); L.push(`🤖 ${t.n} signed ${c.n} (ovr ${Math.round(c.o)})`) }
    const u = [['camp', t.camp, 2500 * 2 ** t.camp], ['coach', t.staff.coach, 1500 * 1.9 ** t.staff.coach], ['fit', t.staff.fit, 1500 * 1.9 ** t.staff.fit], ['phys', t.staff.phys, 1500 * 1.9 ** t.staff.phys], ['arena', t.arena, 3000 * 2 ** t.arena], ['scout', t.staff.scout, 1500 * 1.9 ** t.staff.scout]].filter(x => x[1] < 5 && t.m > x[2] * 1.5).sort((a, b) => a[1] - b[1])[0];
    if (u) { t.m -= Math.round(u[2]); if (u[0] == 'camp' || u[0] == 'arena') t[u[0]]++; else t.staff[u[0]]++; L.push(`🤖 ${t.n} upgraded ${{ camp: 'Training Camp', arena: 'Arena', coach: staffName(sp, 'coach'), fit: staffName(sp, 'fit'), phys: staffName(sp, 'phys'), scout: staffName(sp, 'scout') }[u[0]]} to level ${u[1] + 1}`) }
}
function tableHTML(sp, d) { return `<div class="w"><table><tr><th>#</th><th>Club</th><th>P</th><th>W</th>${RULES[sp.id].draw ? '<th>D</th>' : ''}<th>L</th><th>Pts</th><th>Rating</th><th>Camp</th><th>Staff</th></tr>` + tbl(sp, d).map((x, k) => `<tr class="${x.i ? '' : 'me'} ${k < PROMOTE ? 'up' : k >= TEAMS - RELEGATE ? 'dn2' : ''}"><td>${k + 1}</td><td>${x.n}</td><td>${x.g}</td><td>${x.t.rec.w}</td>${RULES[sp.id].draw ? '<td>' + x.t.rec.d + '</td>' : ''}<td>${x.t.rec.l}</td><td><b>${x.p}</b></td><td>${rate(sp, x.t).toFixed(1)}</td><td>${x.t.camp}</td><td>${Object.values(x.t.staff).reduce((a, b) => a + b, 0)}</td></tr>`).join('') + `</table></div><p class="m">Top 3 go up. First place wins the title and jumps two leagues. The bottom 3 go down. Rival clubs sign players, pick formations and upgrade their facilities on their own.</p>` }

function awardScore(sp, p) { const w = (W[sp.id] && (W[sp.id][p.pos] || W[sp.id][basePos(sp, p.pos)])) || {}; let s = 0, t = 0; ATTR_KEYS.forEach(k => { const wt = w[k] == null ? .5 : w[k]; s += (p.a[k] || 50) * wt; t += wt }); return t ? s / t : 50 }
function awardLeaders(sp, d) {
    const list = AWARDS[sp.id] || AWARDS.soccer, all = [d, ...d.lg], pool = [];
    all.forEach((t, i) => t.roster.forEach(p => { genAttrs(sp, p); pool.push({ p, club: i ? t.n : G.geo.n, me: !i }) }));
    return list.map(a => {
        const prize = Math.round(a.base * (1 + d.lv * .35));
        const cand = a.pos ? pool.filter(x => a.pos.includes(x.p.pos) || a.pos.includes(basePos(sp, x.p.pos))) : pool;
        let w = null, bv = -Infinity, val = 0;
        cand.forEach(x => { const p = x.p, g = p.gl || 0, as = p.as || 0, r = awardScore(sp, p); let v; if (a.stat) { const st = p[a.stat] || 0; v = st * 1000 + r + g * .1 + as * .1 } else if (a.id == 'mvp') v = r * .6 + g * 1.6 + as * 1 + (p.ap || 0) * .3; else v = r + g * .5 + as * .4; if (v > bv) { bv = v; w = x; val = a.stat ? (p[a.stat] || 0) : v } });
        return { a, w, val, prize }
    })
}
function awardCard(sp, r) { const a = r.a, w = r.w; return `<div class="rc ${w && w.me ? 't3' : ''}"><div class="rh"><span>${a.e} ${a.n}</span><span>${M(r.prize)}</span></div><div class="rb">` + (w ? `<div class="pn">${w.p.n}${w.me ? ' <span class="ok">★</span>' : ''}</div><div class="m">${w.club} · ${w.p.pos} ${posName(sp, w.p.pos)}</div><div class="po"><b>${a.stat ? Math.round(r.val) : r.val.toFixed(1)}</b><span class="m">${a.stat ? GLB[sp.id] : 'award score'}</span></div><div class="m">Age ${w.p.age} · OVR ${Math.round(w.p.o)} · ${w.me ? '<b class="ok">your player</b>' : 'rival club'}</div>` : '<div class="m">No eligible players</div>') + `</div></div>` }
function awardHTML(sp, d) { const rows = awardLeaders(sp, d); const mine = rows.filter(r => r.w && r.w.me).length; return `<div class="c"><b>🏅 ${LAD[d.lv]} awards</b><div class="m">Best performers in your league this season. Every award pays a different cash prize to the winning club when the season ends. Prizes scale with league level. You currently lead ${mine} of ${rows.length}.</div></div><div class="g rg" style="margin-top:10px">` + rows.map(r => awardCard(sp, r)).join('') + `</div>` }
function awardCeremony(sp, d, L) { awardLeaders(sp, d).forEach(r => { if (!r.w) return; const t = d.lg.find(x => x.n == r.w.club); if (r.w.me) { G.m += r.prize; L.push(`${r.a.e} ${r.a.n}: ${r.w.p.n} (${G.geo.n}) wins ${M(r.prize)}`) } else { if (t) t.m += r.prize; L.push(`${r.a.e} ${r.a.n}: ${r.w.p.n} (${r.w.club}) wins ${M(r.prize)}`) } }) }

/* ===== Continental Cup: every 4 seasons ===== */
const BIGCLUBS = ['Royal Capital FC', 'Atlas Giants', 'Northern Lions', 'Crimson Dynamo', 'Golden Harbor', 'Iron Republic', 'Sapphire Athletic', 'Phoenix Metropolitan', 'Imperial Stars', 'Titan United', 'Sovereign FC', 'Maritime Rovers', 'Alpine Kings', 'Continental City'];
const CUP_NAMES = { 'Asia': 'Asian Champions League', 'Europe': 'UEFA European League', 'Africa': 'African Champions Cup', 'North America': 'CONCACAF Champions Cup', 'South America': 'Copa Libertadores', 'Oceania': 'OFC Champions League' };
function runContinental(sp, d, L) {
    const season = Math.floor(G.w / SEASON);
    if (season === 0 || season % CUP_CYCLE !== 0 || G.cupSeason === season) return;
    G.cupSeason = season;
    const cupName = CUP_NAMES[G.geo.c] || (G.geo.c + ' Champions Cup');
    const qual = (d.lastPos || 99) <= 4;
    const clubs = [];
    for (let i = 0; i < 8; i++) {
        if (i === 0 && qual) clubs.push({ n: G.geo.n, r: rate(sp, d), me: true });
        else clubs.push({ n: pick(BIGCLUBS), r: 60 + d.lv * .8 + RI(-5, 8) });
    }
    let round = clubs; const log = [];
    while (round.length > 1) {
        const next = [];
        for (let i = 0; i < round.length; i += 2) {
            const a = round[i], b = round[i + 1];
            const aWins = Math.random() < 1 / (1 + Math.exp((b.r - a.r) / 6));
            const winner = aWins ? a : b, loser = aWins ? b : a;
            const ws = RI(1, 3), ls = RI(0, Math.max(0, ws - 1));
            const sa = aWins ? ws : ls, sb = aWins ? ls : ws;
            log.push({ a: a.n, b: b.n, sa, sb });
            next.push(winner);
        }
        round = next;
    }
    const champ = round[0];
    const prize = 50000 + d.lv * 5000;
    if (champ.me) { G.m += prize; L.push(`🏆 ${G.geo.n} won the ${cupName}! Prize ${M(prize)}`); G.cupsWon = (G.cupsWon || 0) + 1 }
    else L.push(`🏆 ${champ.n} won the ${cupName}.`);
    G.cups = G.cups || [];
    G.cups.push({ season, continent: G.geo.c, cup: cupName, winner: champ.n, mine: !!champ.me, log, prize });
}

const nxt = (sp, d) => { const m = d.fx[G.w % SEASON].find(x => x.includes(0)), h = m[0] == 0, o = tm(d, h ? m[1] : m[0]); return { n: o.n, r: rate(sp, o), h } };
const esc = t => t.replace(/[<>&"]/g, c => '&#' + c.charCodeAt(0) + ';');
const fd = (ms, y) => new Date(ms).toLocaleString('en-GB', Object.assign({ weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' }, y ? { year: 'numeric' } : {}));
const cd = ms => { if (ms <= 0) return 'Awaiting result'; const m = Math.floor(ms / 6e4); return Math.floor(m / 1440) + 'd ' + Math.floor(m % 1440 / 60) + 'h ' + m % 60 + 'm' };
/* Kickoffs always land on the sport's real matchday weekday (T0 is a Monday). Matchdays still average one every 10 days:
   the date is the nominal 10-day slot pushed forward to the next such weekday, so gaps are 7 or 14 days (a break week now and then). */
const koOfAt = (sp, md) => { const season = Math.floor(G.w / SEASON), base = season * SEASON * MD_DAYS + md * MD_DAYS, wd = KO[sp.id][0], day = Math.ceil((base - wd) / 7) * 7 + wd; return T0 + day * DAY + (KO[sp.id][1] * 60 + KO[sp.id][2]) * 6e4 };
const koOf = sp => koOfAt(sp, G.w % SEASON);
function lineup(sp, d) {
    const fm = FM[sp.id], nm = fm[d.fm] ? d.fm : Object.keys(fm)[0], rows = fm[nm], pool = d.roster.filter(p => !p.inj && !p.sus).sort((a, b) => b.o - a.o), used = new Set(), L = [];
    rows.forEach((rw, ri) => rw.forEach((pos, ci) => L.push({ pos, p: null, ri, ci, n: rw.length, R: rows.length, k: nm + L.length })));
    { /* custom positions: a player dragged off his spot takes the role of the nearest spot on the pitch, leaning attack/defence by formation style */
        const grp = Object.keys(FS[sp.id]).find(g => FS[sp.id][g].includes(nm)) || 'Balance', bias = grp == 'Offense' ? -12 : grp == 'Defence' ? 12 : 0, gk = rows[0][0];
        L.forEach(t => { t.bx = COL[t.n][t.ci]; t.by = ROW[t.R][t.ri]; t.base = t.pos; t.grp = grp });
        if (sp.id == 'soccer') { /* follow the EPL chart: each role sits at its own spot; duplicates of a role spread across the width */
            const cnt = {}, seen = {}; L.forEach(t => { cnt[t.pos] = (cnt[t.pos] || 0) + 1 });
            L.forEach(t => {
                const a = SOCCER_ANCHOR[t.pos]; if (!a) return; const [x, y] = soccerXY(a), n = cnt[t.pos], i = seen[t.pos] = (seen[t.pos] == null ? 0 : seen[t.pos] + 1); t.by = y;
                t.bx = n == 1 ? x : Math.max(10, Math.min(90, Math.round(x + (i - (n - 1) / 2) * (n == 2 ? 28 : 24))))
            });
            /* same-depth roles from different lines never overlap: nudge a role sharing a spot */
            const taken = new Set(); L.forEach(t => { let k = t.bx + ',' + t.by; while (taken.has(k)) { t.by += 6; k = t.bx + ',' + t.by } taken.add(k) })
        }
        /* snap every default spot to the 30x40 pitch grid (see SNX/SNY in pitch.js) so tokens sit on grid intersections */
        L.forEach(t => { t.bx = SNX(t.bx); t.by = SNY(t.by) });
        L.forEach(t => {
            const c = d.cp && d.cp[t.k]; if (!c || (c[0] == t.bx && c[1] == t.by)) return; t.custom = 1; if (t.base === gk && t.ri === 0) return;
            /* New: if drop() stored a position hint, use it directly */
            if (c[2]) { t.pos = c[2]; return }
            /* Legacy fallback for saves with 2-element cp */
            let best = null, bd = 1e9; L.forEach(u => { if (u.base === gk && u.ri === 0) return; const dx = u.bx - c[0], dy = u.by - (c[1] + bias), v = dx * dx + dy * dy; if (v < bd) { bd = v; best = u } });
            if (best) t.pos = best.base
        })
    }
    L.forEach(t => { const id = d.as && d.as[t.k], p = id && pool.find(q => q.id == id && !used.has(q)); if (p) { used.add(p); t.p = p; t.man = 1; t.off = basePos(sp, p.pos) != basePos(sp, t.pos) ? 1 : 0 } });
    L.forEach(t => { if (!t.p) { const p = pool.find(q => !used.has(q) && q.pos === t.pos); if (p) { used.add(p); t.p = p } } });
    [...L].sort((a, b) => (PC[sp.id].spec[b.pos] || 0) - (PC[sp.id].spec[a.pos] || 0)).forEach(t => { if (!t.p) { let b = null, bv = -1e9; pool.forEach(q => { if (used.has(q)) return; const v = (q.o - posPenalty(sp, q, t.pos)) * sf(q); if (v > bv) { bv = v; b = q } }); if (b) { used.add(b); t.p = b } } });
    { const fr = L.filter(t => !t.man && t.p), ev = (q, t) => (q.o - posPenalty(sp, q, t.pos)) * sf(q); for (let it = 0; it < 3; it++) { let ch = false; for (let i = 0; i < fr.length; i++) for (let j = i + 1; j < fr.length; j++) { const a = fr[i], b = fr[j]; if (ev(a.p, b) + ev(b.p, a) > ev(a.p, a) + ev(b.p, b) + .01) { const x = a.p; a.p = b.p; b.p = x; ch = true } } if (!ch) break } }
    L.forEach(t => { if (t.p) { t.pen = posPenalty(sp, t.p, t.pos); t.off = t.p.pos !== t.pos ? 1 : 0; t.e = (t.p.o - t.pen) * sf(t.p) } else { t.pen = 0; t.e = 20 } const c = d.cp && d.cp[t.k]; t.x = SNX(c ? c[0] : t.bx); t.y = SNY(c ? c[1] : t.by) });
    return L
}
function live() {
    const rows = SP.filter(x => G.d[x.id].open).map(sp => { const d = G.d[sp.id], n = nxt(sp, d), k = koOf(sp), pw = 1 / (1 + Math.exp((n.r - rate(sp, d) + (n.h ? -2 : 2)) / 8)); return `<tr><td>${sp.e} ${sp.n}</td><td>${LAD[d.lv]}</td><td>${n.h ? G.geo.n + ' v ' + n.n : n.n + ' v ' + G.geo.n}</td><td>${fd(k)}</td><td><b>${cd(k - G.c)}</b></td><td>${Math.round(pw * 100)}%</td><td>${(d.form || []).join(' ') || '-'}</td></tr>` }).join('');
    return `<div class="big" style="font-size:30px;margin:8px 0">🕒 ${fd(G.c, 1)}</div><div class="w"><table><tr><th>Sport</th><th>League</th><th>Fixture</th><th>Kickoff</th><th>Starts in</th><th>Win chance</th><th>Form</th></tr>${rows}</table></div>`
}
function liveBroadcastUI(sp) {
    if (!sp || !G.d[sp.id] || !G.d[sp.id].open) return '';
    const d = G.d[sp.id], LU = lineup(sp, d), nm = nxt(sp, d), k = koOf(sp), plan = matchPlan(sp), R0 = RULES[sp.id], me = k + matchDur(sp, plan), now = G.c;
    const status = now < k ? 'pre' : now < me ? 'live' : 'post';
    const myR = rate(sp, d), oppR = nm.r, perf = 1 / (1 + Math.exp((oppR - myR + (nm.h ? -2 : 2)) / 8));
    let clock, label;
    if (status == 'pre') { clock = cd(k - now); label = R0.start + ' in' }
    else if (status == 'live') { const s = matchState(sp, now - k, plan) || { clock: '…', phase: '', sub: '' }; clock = s.clock; label = s.brk ? '⏸ ' + s.phase : '● LIVE · ' + (s.sub || s.phase) }
    else if (R0.end == 'Full time') { clock = 'FT'; label = 'Full time' }
    else { clock = 'Final'; label = plan.sets ? plan.sets + ' sets played' : plan.ot ? 'Decided in ' + R0.otName : 'Game over' }
    const pc = perf > .6 ? 'var(--acc)' : perf > .4 ? 'var(--gold)' : 'var(--bad)';
    return `<div class="lb-head"><div><b>${nm.h ? G.geo.n + ' v ' + nm.n : nm.n + ' v ' + G.geo.n}</b><div class="m">${LAD[d.lv]} · ${nm.h ? 'Home' : 'Away'}</div></div><div class="lb-clock"><div class="big" style="font-size:34px;color:${status == 'live' ? 'var(--bad)' : 'var(--ink)'}" class="${status == 'live' ? 'lb-live' : ''}">${clock}</div><div class="m">${label}</div></div></div>${pitch(sp, LU)}<div class="lb-perf"><div class="stl"><span class="m">Performance vs opponent</span><b style="color:${pc}">${Math.round(perf * 100)}%</b></div><div class="stb"><s data-sm style="width:${perf * 100}%;background:${pc}"></s></div><div class="m" style="display:flex;justify-content:space-between;margin-top:4px"><span>You: ${myR.toFixed(1)}</span><span>Opp: ${oppR.toFixed(1)}</span></div></div><div class="m lb-rules" style="margin-top:8px">📏 ${R0.info}</div>`;
}
