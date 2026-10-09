/* Fixtures UI, player status/stamina, position familiarity, squad & AI stats */
function stSet(x) { G.d[sel].fm = FS[sel][x][0]; selB = null; save(); render() }
function fk(v) { v = v.trim().toLowerCase(); if (!v) return; const all = Object.keys(GEO).flatMap(c => Object.keys(GEO[c]).map(k => [c, k])), h = all.find(x => x[1].toLowerCase() == v) || all.find(x => x[1].toLowerCase().startsWith(v)) || all.find(x => x[1].toLowerCase().includes(v)); if (!h) return say('No country found'); S.c = h[0]; S.k = h[1]; S.r = GEO[h[0]][h[1]][0]; render() }
const cmpTxt = (d, p) => { const s = d.roster.filter(q => basePos(cur(), q.pos) == basePos(cur(), p.pos)); if (!s.length) return 'Fills an empty ' + p.pos + ' slot'; const dl = Math.round(p.o) - Math.round(Math.max(...s.map(q => q.o))); return (dl > 0 ? '+' + dl : dl < 0 ? '−' + (-dl) : '±0') + ' vs your best ' + p.pos };
const VR = {};
function fxGo(id, r) { VR[id] = r; render() }
function fixUI(sp, d) {
    const nm = i => i ? d.lg[i - 1].n : G.geo.n, pl = G.w % SEASON, v = VR[sp.id] == null ? pl : VR[sp.id], nx = nxt(sp, d), k = koOf(sp);
    const ko = koOfAt(sp, v);
    const res = (r, j) => { const x = d.rs[r] && d.rs[r][j]; if (!x) return ''; const a = d.fx[r][j][0], me = a == 0 ? x[0] : x[1], op = a == 0 ? x[1] : x[0]; return me > op ? 'W' : me < op ? 'L' : 'D' };
    const mj = r => d.fx[r].findIndex(x => x.includes(0));
    let h = `<div class="nm"><div><small>Next match</small><div class="big" style="font-size:26px">${nx.h ? G.geo.n + ' v ' + nx.n : nx.n + ' v ' + G.geo.n}</div></div><div style="text-align:right"><b>${fd(k)}</b><small>${cd(k - G.c)} · ${nx.h ? 'Home' : 'Away'}</small></div></div>`;
    h += `<div class="tabs"><button class="tab" onclick="fxGo('${sp.id}',${Math.max(0, v - 1)})">◀</button>` + Array.from({ length: SEASON }, (_, r) => { const o = res(r, mj(r)); return `<button class="tab ${r == v ? 'on' : ''}" onclick="fxGo('${sp.id}',${r})">MD${r + 1}${r == pl ? ' •' : ''}${o ? ' · ' + o : ''}</button>` }).join('') + `<button class="tab" onclick="fxGo('${sp.id}',${Math.min(SEASON - 1, v + 1)})">▶</button></div>`;
    h += `<div class="c" style="padding:8px 10px"><div style="display:flex;justify-content:space-between;align-items:center;padding:4px 2px 8px"><b>Matchday ${v + 1}${v < pl ? ' · played' : v == pl ? ' · next' : ' · upcoming'}</b><span class="m">${fd(ko)}</span></div>` + d.fx[v].map(([a, b], j) => { const x = d.rs[v] && d.rs[v][j], mine = !a || !b, o = mine ? res(v, j) : ''; return `<div class="mt ${mine ? 'me' : ''}"><span class="tn">${nm(a)}</span><span class="scr">${x ? x[0] + ' – ' + x[1] : 'vs'}</span><span class="tn r">${nm(b)}</span>${o ? `<div class="mx"><span class="rs ${o.toLowerCase()}">${{ W: 'Win', D: 'Draw', L: 'Loss' }[o]}</span></div>` : ''}</div>` }).join('') + `</div>`;
    const played = d.rs.filter(x => x).length;
    const calDays = Array.from({ length: SEASON }, (_, i) => {
        const done = i < pl, next = i === pl;
        const dt = koOfAt(sp, i);
        return `<div class="d ${done ? 'done' : ''} ${next ? 'next' : ''} ${i % 9 === 0 && i > 0 ? 'hi' : ''}"><i>${i + 1}</i><b>${new Date(dt).toLocaleString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })}</b><span>${(new Date(dt).toLocaleString('en-GB', { weekday: 'short', timeZone: 'UTC' }))}</span></div>`;
    }).join('');
    h += `<div class="c" style="margin-top:10px"><b>📅 Season calendar</b><div class="m">34 matchdays a season. ${sp.n} is played on ${['Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays', 'Sundays'][KO[sp.id][0]]} at ${String(KO[sp.id][1]).padStart(2, '0')}:${String(KO[sp.id][2]).padStart(2, '0')}, as in the real sport. Matchdays average one every ${MD_DAYS} days: a week apart, with a break week now and then for recovery, training and international fixtures. Grey = played, green outline = next, tinted = every 9th matchday.</div><div class="cal">${calDays}</div></div>`;
    return h
}
const INJ = ['Hamstring strain', 'Ankle sprain', 'Knee strain', 'Calf tear', 'Back spasm', 'Concussion', 'Groin pull', 'Shoulder knock'], FR = { soccer: 2, basket: 4, volley: 1, futsal: 3, hockey: 3, base: 1 }, ATK = { soccer: { GK: .02, SW: .1, CB: .15, LCB: .15, RCB: .15, LB: .5, RB: .5, LWB: .7, RWB: .7, CDM: .5, CM: 1.5, LCM: 1.5, RCM: 1.5, CAM: 2.5, LM: 2, RM: 2, LW: 3.5, RW: 3.5, CF: 4, ST: 5, SS: 4.5, DF: .7, MF: 2.5, FW: 5 }, futsal: { GK: .05, DF: .8, PV: 2.5, FW: 5 }, hockey: { G: .02, D: 1, C: 4, LW: 3.5, RW: 3.5 } }, GLB = { soccer: 'Goals', basket: 'Points', volley: 'Points', futsal: 'Goals', hockey: 'Goals', base: 'Runs' };

const AWARDS = {
    soccer: [{ id: 'scorer', n: 'Top Scorer', e: '🥇', stat: 'gl', base: 4000 }, { id: 'assist', n: 'Top Assists', e: '🎯', stat: 'as', base: 3000 }, { id: 'gk', n: 'Best Goalkeeper', e: '🧤', pos: ['GK'], base: 2000 }, { id: 'def', n: 'Best Defender', e: '🛡️', pos: ['SW', 'CB', 'LCB', 'RCB', 'LB', 'RB', 'LWB', 'RWB'], base: 2500 }, { id: 'mid', n: 'Best Midfielder', e: '🎨', pos: ['CDM', 'CM', 'LCM', 'RCM', 'CAM', 'LM', 'RM'], base: 3000 }, { id: 'fwd', n: 'Best Forward', e: '⚡', pos: ['LW', 'RW', 'CF', 'ST', 'SS'], base: 3000 }, { id: 'mvp', n: 'Most Valuable Player', e: '⭐', base: 6000 }],
    basket: [{ id: 'scorer', n: 'Top Scorer', e: '🥇', stat: 'gl', base: 4000 }, { id: 'assist', n: 'Top Assists', e: '🎯', stat: 'as', base: 3000 }, { id: 'guard', n: 'Best Guard', e: '🛡️', pos: ['PG', 'SG'], base: 2500 }, { id: 'fwd', n: 'Best Forward', e: '⚡', pos: ['SF', 'PF'], base: 2500 }, { id: 'cen', n: 'Best Center', e: '🗼', pos: ['C'], base: 2500 }, { id: 'mvp', n: 'Most Valuable Player', e: '⭐', base: 6000 }],
    volley: [{ id: 'scorer', n: 'Top Scorer', e: '🥇', stat: 'gl', base: 4000 }, { id: 'assist', n: 'Top Assists', e: '🎯', stat: 'as', base: 3000 }, { id: 'set', n: 'Best Setter', e: '🎨', pos: ['S'], base: 2500 }, { id: 'oh', n: 'Best Outside Hitter', e: '⚡', pos: ['OH'], base: 2500 }, { id: 'mb', n: 'Best Middle Blocker', e: '🛡️', pos: ['MB'], base: 2500 }, { id: 'lib', n: 'Best Libero', e: '🧤', pos: ['L'], base: 2000 }, { id: 'mvp', n: 'Most Valuable Player', e: '⭐', base: 6000 }],
    futsal: [{ id: 'scorer', n: 'Top Scorer', e: '🥇', stat: 'gl', base: 4000 }, { id: 'assist', n: 'Top Assists', e: '🎯', stat: 'as', base: 3000 }, { id: 'gk', n: 'Best Goalkeeper', e: '🧤', pos: ['GK'], base: 2000 }, { id: 'def', n: 'Best Defender', e: '🛡️', pos: ['DF'], base: 2500 }, { id: 'pv', n: 'Best Pivot', e: '⚡', pos: ['PV'], base: 3000 }, { id: 'fw', n: 'Best Forward', e: '🔥', pos: ['FW'], base: 3000 }, { id: 'mvp', n: 'Most Valuable Player', e: '⭐', base: 6000 }],
    hockey: [{ id: 'scorer', n: 'Top Scorer', e: '🥇', stat: 'gl', base: 4000 }, { id: 'assist', n: 'Top Assists', e: '🎯', stat: 'as', base: 3000 }, { id: 'g', n: 'Best Goalkeeper', e: '🧤', pos: ['G'], base: 2000 }, { id: 'd', n: 'Best Defender', e: '🛡️', pos: ['D'], base: 2500 }, { id: 'w', n: 'Best Winger', e: '⚡', pos: ['LW', 'RW'], base: 2500 }, { id: 'c', n: 'Best Center', e: '🎨', pos: ['C'], base: 3000 }, { id: 'mvp', n: 'Most Valuable Player', e: '⭐', base: 6000 }],
    base: [{ id: 'scorer', n: 'Top Hitter', e: '🥇', stat: 'gl', base: 4000 }, { id: 'assist', n: 'Top Assists', e: '🎯', stat: 'as', base: 3000 }, { id: 'p', n: 'Best Pitcher', e: '🧤', pos: ['P'], base: 3000 }, { id: 'c', n: 'Best Catcher', e: '🛡️', pos: ['C'], base: 2000 }, { id: 'if', n: 'Best Infielder', e: '⚡', pos: ['IF'], base: 2500 }, { id: 'of', n: 'Best Outfielder', e: '🔥', pos: ['OF'], base: 2500 }, { id: 'mvp', n: 'Most Valuable Player', e: '⭐', base: 6000 }]
};

const STm = p => p.st == null ? 100 : Math.round(p.st), sf = p => .85 + .15 * STm(p) / 100, stCol = s => s < 35 ? '#e74c3c' : s < 60 ? '#f1c40f' : '#3ddc97';
const statusOf = p => p.inj ? '🤕 ' + (p.it || 'Injured') + ' (' + p.inj + 'w)' : p.sus ? '🟥 Suspended (' + p.sus + 'w)' : STm(p) < 35 ? '😮‍💨 Exhausted' : STm(p) < 60 ? 'Tired' : 'Fit';
const tierOf = o => o >= 90 ? 't5' : o >= 80 ? 't4' : o >= 70 ? 't3' : o >= 51 ? 't2' : 't1';
let pfil = 'all';

const PC = {
    soccer: { k: [2.6, 2.2], spec: { GK: 30 }, r: { GK: [0, 0], SW: [1, 0], CB: [1, 0], LCB: [1, -.5], RCB: [1, .5], LB: [1, -1], RB: [1, 1], LWB: [1.8, -1], RWB: [1.8, 1], CDM: [2.2, 0], CM: [2.8, 0], LCM: [2.8, -.5], RCM: [2.8, .5], LM: [3, -1], RM: [3, 1], CAM: [3.6, 0], LW: [4.3, -1], RW: [4.3, 1], SS: [4.2, 0], CF: [4.5, 0], ST: [5, 0], DF: [1, 0], MF: [2.8, 0], FW: [4.6, 0] } },
    basket: { k: [3.2, 0], spec: {}, r: { PG: [0, 0], SG: [1, 0], SF: [2, 0], PF: [3, 0], C: [4, 0] } },
    volley: { k: [6, 0], spec: { S: 14, L: 12 }, r: { S: [0, 0], OH: [0, 0], MB: [1, 0], L: [0, 0] } },
    futsal: { k: [3.6, 0], spec: { GK: 28 }, r: { GK: [0, 0], DF: [1, 0], PV: [2, 0], FW: [3, 0] } },
    hockey: { k: [3, 2.5], spec: { G: 30 }, r: { G: [0, 0], D: [1, 0], C: [2, 0], LW: [2.6, -1], RW: [2.6, 1] } },
    base: { k: [5, 0], spec: { P: 28, C: 22 }, r: { P: [0, 0], C: [0, 0], IF: [1, 0], OF: [2, 0] } }
}, ADP = { soccer: 22, basket: 14, volley: 30, futsal: 16, hockey: 20, base: 28 };
function basePen(sp, a, b) { const c = PC[sp.id], A = c.r[a], B = c.r[b]; if (!A || !B) return 9; const x = Math.max(c.spec[a] || 0, c.spec[b] || 0); if (x) return x; return Math.min(16, c.k[0] * Math.abs(A[0] - B[0]) + c.k[1] * Math.abs(A[1] - B[1])) }
function posPenalty(sp, p, t) { if (p.pos === t) return 0; const c = PC[sp.id], raw = basePen(sp, p.pos, t), cap = (c.spec[p.pos] || c.spec[t]) ? .6 : .85, ad = Math.min(1, ((p.fam && p.fam[t]) || 0) / ADP[sp.id]); return Math.round(raw * (1 - ad * cap) * 10) / 10 }

function squadStep(sp, d, rd, L) {
    d.roster.forEach(p => { if (p.st == null) { p.st = 100; p.fl = 0; p.yc = 0; p.rd = 0; p.ap = 0; p.gl = 0; p.as = 0; p.sus = 0; p.fm = 0 } if (p.con == null) p.con = 3; if (p.wb == null) p.wb = 1; if (!p.fam) p.fam = {} });
    const LU = lineup(sp, d), ps = LU.filter(t => t.p), on = new Set(ps.map(t => t.p)), fit = d.staff.fit;
    d.roster.forEach(p => { if (p.sus > 0) p.sus-- });

    /* ===== Tactic group determines stamina cost ===== */
    const tacGroup = Object.keys(FS[sp.id]).find(g => FS[sp.id][g].includes(d.fm)) || 'Balance';
    const staminaMult = tacGroup === 'Offense' ? 1.35 : tacGroup === 'Defence' ? 0.75 : 1.0;

    const j = d.fx[rd].findIndex(x => x.includes(0)), sc = d.rs[rd][j], home = d.fx[rd][j][0] == 0, gf = home ? sc[0] : sc[1], ga = home ? sc[1] : sc[0], res = gf > ga ? 1 : gf < ga ? -1 : 0, gs = new Map(), gp = sp.id == 'volley' ? vPts(gf, ga) : gf;
    const wt = t => ATK[sp.id] ? (ATK[sp.id][t.pos] == null ? (ATK[sp.id][basePos(sp, t.pos)] == null ? 1 : ATK[sp.id][basePos(sp, t.pos)]) : ATK[sp.id][t.pos]) : 1, tot = ps.reduce((a, t) => a + wt(t), 0);
    const am = new Map();
    if (ps.length) for (let i = 0; i < gp; i++) { let r = Math.random() * tot, k = 0; while (k < ps.length - 1 && (r -= wt(ps[k])) > 0) k++; const sk = ps[k].p; gs.set(sk, (gs.get(sk) || 0) + 1); if (ps.length > 1 && Math.random() < .7) { const ot = ps.filter(t => t.p !== sk), t2 = ot.reduce((a, t) => a + wt(t), 0); let r2 = Math.random() * t2, k2 = 0; while (k2 < ot.length - 1 && (r2 -= wt(ot[k2])) > 0) k2++; const ak = ot[k2].p; am.set(ak, (am.get(ak) || 0) + 1) } }
    const gsc = sp.id == 'basket' ? 12 : sp.id == 'volley' ? 10 : sp.id == 'base' ? 3 : 1;
    ps.forEach(t => {
        const p = t.p, g = gs.get(p) || 0, a = am.get(p) || 0; p.ap++; p.gl += g; p.as = (p.as || 0) + a;
        /* Stamina drain: base 6-12, scaled by tactic group and lowered by Fitness coach */
        const base = RI(6, 12) * staminaMult;
        p.st = Math.max(0, Math.min(100, p.st - base + fit * 1.5));
        if (!p.fam) p.fam = {}; p.fam[t.pos] = (p.fam[t.pos] || 0) + 1;
        p.fm = Math.max(3, Math.min(10, Math.round((6 + res * .9 + R(-1.1, 1.1) + Math.min(g / gsc, 4) * .4) * 10) / 10));
        const nf = RI(0, FR[sp.id]); p.fl += nf;
        for (let i = 0; i < nf; i++) { const r = Math.random(); if (r < .1) { p.yc++; if (p.yc % 3 == 0) { p.sus = Math.max(p.sus, 1); L.push(`🟨 ${p.n} (${sp.n}) banned for 1 match after ${p.yc} yellow cards`) } } else if (r < .112) { p.rd++; p.sus = Math.max(p.sus, RI(1, 3)); L.push(`🟥 ${p.n} (${sp.n}) sent off, banned ${p.sus} match${p.sus > 1 ? 'es' : ''}`); break } }
    });
    /* Bench stamina recovery now happens every game-day in the ticker (see game.js). No per-matchday bonus. */
}

/* Volleyball results are stored as sets; player 'Points' need rally points: a set won is about 25, a set lost about 21 */
const vPts = (setsFor, setsAgainst) => setsFor * 25 + setsAgainst * 21;
const pickW = (arr, wf, tot) => { let r = Math.random() * tot, k = 0; while (k < arr.length - 1 && (r -= wf(arr[k])) > 0) k++; return arr[k] };
function aiStats(sp, t, gf) {
    const rw = t.roster.filter(p => !p.inj && !p.sus); if (!rw.length) return;
    const wt = p => ATK[sp.id] ? (ATK[sp.id][p.pos] == null ? (ATK[sp.id][basePos(sp, p.pos)] == null ? 1 : ATK[sp.id][basePos(sp, p.pos)]) : ATK[sp.id][p.pos]) : 1;
    rw.forEach(p => { p.ap = (p.ap || 0) + 1; p.gl = p.gl || 0; p.as = p.as || 0 });
    const tot = rw.reduce((a, p) => a + wt(p), 0) || 1;
    for (let i = 0; i < gf; i++) { const sk = pickW(rw, wt, tot); sk.gl++; if (rw.length > 1 && Math.random() < .7) { const ot = rw.filter(p => p !== sk), t2 = ot.reduce((a, p) => a + wt(p), 0) || 1; pickW(ot, wt, t2).as++ } }
}