/* Navigation and every page (home, tactics, league, cup, facilities, staff, players, recruits) */
const GST = []; LG.reduce((a, [n, c]) => { GST.push(a); return a + c }, 0);
let pg = 'home', lg = null, lt = null, lsub = 'table', psort = 'o', rfil = 'all';
const NAV = [['home', '🏠', 'Home'], ['tac', '🧩', 'Tactics'], ['lg', '🏆', 'League'], ['cup', '🌍', 'Cups'], ['pl', '👥', 'Players'], ['rc', '🔎', 'Recruits'], ['fa', '🏋️', 'Facilities'], ['st', '🧑‍🏫', 'Staff'], ['nw', '📰', 'News']];
const grp = v => GST.filter(x => x <= v).length - 1, sumS = t => Object.values(t.staff).reduce((a, b) => a + b, 0);
const bars = (o, p) => `<div class="pb"><i class="gh" style="width:${p}%"></i><i style="width:${o}%"></i></div>`, segsN = (n, mx) => '<div class="sg">' + Array.from({ length: mx }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('') + '</div>', segs = n => segsN(n, 5);
function sr(seed, fn) { const o = Math.random; let x = seed % 2147483646 + 1; Math.random = () => (x = x * 16807 % 2147483647) / 2147483647; try { return fn() } finally { Math.random = o } }
const go = p => { pg = p; if (p != 'pl' && p != 'rc') sellState = null; if (p != 'pl' && p != 'rc' && p != 'tac') modalPid = null; render() }, tab = id => { sel = id; lg = lt = null; sellState = null; modalPid = null; render() }, lgPick = i => { const v = G.d[sel].lv; lg = i; lt = grp(v) == i ? v : GST[i]; render() }, ltPick = v => { lt = v; render() };

function pHome(sp, d) { return `<div class="g"><div class="c"><b>Team rating</b><div class="big" style="font-size:40px">${rate(sp, d).toFixed(1)}</div><span class="m">${d.roster.filter(p => p.inj).length} injured</span></div><div class="c"><b>League</b><div class="big" style="font-size:40px">${LAD[d.lv]}</div><span class="m">${d.ti} titles won here</span></div><div class="c"><b>Table position</b><div class="big" style="font-size:40px">${tbl(sp, d).findIndex(x => !x.i) + 1} of ${TEAMS}</div><span class="m">Record ${RULES[sp.id].draw ? d.rec.w + '-' + d.rec.d + '-' + d.rec.l : d.rec.w + '-' + d.rec.l}</span></div></div><h2>Live Broadcast</h2><div class="c"><div class="ctl" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px"><b>${G.geo.n}, ${G.geo.r}, ${G.geo.k}</b><span class="sp"></span>` + [[0, '⏸ Pause'], [1, '▶ Live'], [6, '⏩ Fast']].map(([v, t]) => `<button class="${G.sp == v ? '' : 'alt'}" onclick="spd(${v})">${t}</button>`).join('') + `</div><div id="livePitchBox">${liveBroadcastUI(sp)}</div></div><h2>All matches</h2><div class="c"><div id="live">${live()}</div></div>` }
function pTac(sp, d) { const fk = Object.keys(FM[sp.id]), fn = FM[sp.id][d.fm] ? d.fm : fk[0], fs = FS[sp.id], st = Object.keys(fs).find(x => fs[x].includes(fn)), LU = lineup(sp, d), ids = new Set(LU.map(t => t.p)), bn = d.roster.filter(p => !ids.has(p)).sort((a, b) => b.o - a.o); return `<div class="tabs">` + Object.keys(fs).map(x => `<button class="tab ${x == st ? 'on' : ''}" onclick="stSet('${x}')">${{ Offense: '⚔️', Defence: '🛡️', Balance: '⚖️' }[x]} ${x}</button>`).join('') + `<span class="sp"></span><button class="alt" onclick="autoLU()">Auto lineup</button></div><div class="tabs">` + fs[st].map(k => `<button class="tab ${k == fn ? 'on' : ''}" onclick="fmSet('${k}')">${k}</button>`).join('') + `</div>` + pitch(sp, LU) + `<p class="m" style="text-align:center">Rating ${rate(sp, d).toFixed(1)}, position penalty ${LU.reduce((a, t) => a + (t.pen || 0), 0).toFixed(1)} across ${LU.filter(t => t.pen > 0).length} players. Tap any player to open their info popup. Drag a player onto another to preview the rating change. Drop to swap. Red = out of position.</p>` + roleLegend(sp) + attrLegend(sp) + `<h2>Bench</h2><div class="g bn">` + (bn.map(p => benchCard(p, sp)).join('') || '<span class="m">No bench players.</span>') + `</div>` + (selB ? `<p class="m">Now tap a player on the pitch to swap. The green or red number on each player is the rating change.</p>` : '') }
function pLg(sp, d) {
    const ig = lg == null ? grp(d.lv) : lg, it = lt == null ? d.lv : lt, gc = LG[ig][1], g0 = GST[ig];
    const winPrize = MATCH_PRIZE(d.lv), drawPrize = Math.round(winPrize * .5), lossPrize = Math.round(winPrize * .25);
    let h = `<div class="tabs">` + LG.map(([n], i) => `<button class="tab ${i == ig ? 'on' : ''}" onclick="lgPick(${i})">${n}${grp(d.lv) == i ? ' ★' : ''}</button>`).join('') + `</div><div class="c"><div class="bar"><i style="width:${d.lv / (LAD.length - 1) * 100}%"></i></div><div class="m">You are in ${LAD[d.lv]} (league ${d.lv + 1} of ${LAD.length}, marked ★). Each league runs ${TEAMS} clubs over 34 matchdays. Pick a group, then a tier, to see its clubs.</div><div class="m" style="margin-top:6px">💰 Match prize this tier: win <b class="ok">${M(winPrize)}</b>, ${RULES[sp.id].draw ? 'draw <b>' + M(drawPrize) + '</b>, ' : ''}loss <b class="bad">${M(lossPrize)}</b>. Home matches pay 10% more, away 10% less. Promotion: top ${PROMOTE}, relegation: bottom ${RELEGATE}.</div></div><div class="tabs">` + Array.from({ length: gc }, (_, k) => g0 + k).map(v => `<button class="tab ${v == it ? 'on' : ''}" onclick="ltPick(${v})">${LAD[v]}${v == d.lv ? ' ★' : ''}</button>`).join('') + `</div>`;
    if (it == d.lv) return h + `<div class="tabs">` + [['table', 'Table'], ['fix', 'Fixtures and results'], ['aw', '🏅 Awards']].map(([k, t]) => `<button class="tab ${lsub == k ? 'on' : ''}" onclick="lsub='${k}';render()">${t}</button>`).join('') + `</div>` + (lsub == 'table' ? tableHTML(sp, d) : lsub == 'aw' ? awardHTML(sp, d) : fixUI(sp, d));
    const T = sr(it * 101 + SP.indexOf(sp) * 13 + Math.floor(G.w / SEASON), () => Array.from({ length: TEAMS }, () => mkTeam(sp, it))).map(t => ({ t, r: rate(sp, t) })).sort((a, b) => b.r - a.r), df = Math.abs(it - d.lv);
    return h + `<div class="c"><b>${LAD[it]} clubs</b> <span class="m">Scouting view, ${df} league${df > 1 ? 's' : ''} ${it > d.lv ? 'above' : 'below'} you. Your rating is ${rate(sp, d).toFixed(1)}.</span></div><div class="w"><table><tr><th>#</th><th>Club</th><th>Rating</th><th>Camp</th><th>Arena</th><th>Staff</th></tr>` + T.slice(0, 18).map((x, k) => `<tr><td>${k + 1}</td><td>${clubLabel(x.t.n, x.t.flag)}</td><td><b>${x.r.toFixed(1)}</b></td><td>${x.t.camp}</td><td>${x.t.arena}</td><td>${sumS(x.t)}</td></tr>`).join('') + `</table></div>`
}
function pCup(sp, d) {
    const cups = G.cups || [];
    const nextSeason = Math.ceil((Math.floor(G.w / SEASON) + 1) / CUP_CYCLE) * CUP_CYCLE;
    const seasonsToNext = nextSeason - Math.floor(G.w / SEASON);
    const qual = (d.lastPos || 99) <= 4;
    let h = `<div class="c"><b>🌍 Continental Cup</b><div class="m">A continental tournament runs after the season ends, every ${CUP_CYCLE} seasons. Top 4 finishers in their league qualify. Champions from every continent meet in the World Championship the season after.</div></div>`;
    h += `<div class="g" style="margin-top:10px"><div class="c"><div class="m">Your continent</div><b>${G.geo.c}</b></div><div class="c"><div class="m">Competition</div><b>${CUP_NAMES[G.geo.c] || (G.geo.c + ' Champions Cup')}</b></div><div class="c"><div class="m">Cups won</div><b>${G.cupsWon || 0}</b></div><div class="c"><div class="m">Next edition</div><b>Season ${nextSeason + 1}</b><div class="m">${seasonsToNext === 0 ? 'This season' : seasonsToNext + ' season' + (seasonsToNext > 1 ? 's' : '') + ' away'}</div></div></div>`;
    h += `<div class="c" style="margin-top:10px"><b>Qualification</b><div class="m">${qual ? '✅ You qualified last season (top 4).' : '❌ You did not qualify last season. You need a top-4 finish.'} Your last finish: <b>${d.lastPos ? d.lastPos + ' of ' + TEAMS : 'no season completed yet'}</b>.</div></div>`;
    if (cups.length) {
        h += `<h2>Recent cup history</h2>`;
        cups.slice(-6).reverse().forEach(c => {
            h += `<div class="c" style="margin-top:8px"><div style="display:flex;justify-content:space-between;align-items:baseline"><b>${c.cup}</b><span class="m">Season ${c.season + 1}</span></div><div class="m">Winner: <b>${c.winner}</b>${c.winnerFlag ? ' (' + c.winnerFlag + ')' : ''}${c.mine ? ' <span class="ok">★ YOUR CLUB</span>' : ''} · Prize pool ${M(c.prize)}</div>`;
            if (c.log && c.log.length) {
                h += `<details style="margin-top:6px"><summary>Bracket</summary><div class="cup-b">` + c.log.map(m => `<div class="cup-m ${m.a === G.geo.n || m.b === G.geo.n ? 'me' : ''}"><span class="tt">${m.a}${m.af ? ' <span class="m">(' + m.af + ')</span>' : ''}</span><b>${m.sa} – ${m.sb}</b><span class="tt">${m.b}${m.bf ? ' <span class="m">(' + m.bf + ')</span>' : ''}</span></div>`).join('') + `</div></details>`;
            }
            h += `</div>`;
        });
    } else {
        h += `<p class="m">No continental cups played yet. Keep building — your first opportunity is coming.</p>`;
    }
    return h;
}

/* ===== Recruits page — All tab (live market, always 6) + Favorites tab (persistent saved list) ===== */
function pRc(sp, d) {
    d.favs = d.favs || [];
    const mkt = d.mkt || [];
    const favs = d.favs;
    const isFavView = rfil === 'fav';
    const list = isFavView ? favs : mkt;

    const card = (p, i, isFav) => {
        genAttrs(sp, p);
        const price = fee(p);
        const canSign = G.m >= price && d.roster.length < ROSTER_MAX;
        return `<div class="rc ${tierOf(Math.round(p.o))}" onclick="openP('${pid(p)}')" style="cursor:pointer;${isFav ? 'box-shadow:0 0 0 2px var(--gold)' : ''}">
            <div class="rh"><span>${p.pos} · ${posName(sp, p.pos)}</span><span>age ${p.age}</span></div>
            <div class="rb">
                <div class="pn">${p.n}${starB(p)}${isFav ? ' <span class="ust">⭐</span>' : ''}</div>
                <div class="m">🌍 ${p.cn || 'Unknown'} · ${p.ht} cm${p.sc ? ' · 🎯 Scouted' : ''}</div>
                <div class="po"><b>${Math.round(p.o)}</b><span class="m">now</span><b style="margin-left:14px">${p.p}</b><span class="m">peak</span></div>
                ${bars(p.o, p.p)}
                ${attrGrid(sp, p)}
                <div class="m">Wage ${M(wage(p))}/wk</div>
                <div class="m">${cmpTxt(d, p)}</div>
                <div style="display:flex;gap:6px;margin-top:8px" onclick="event.stopPropagation()">
                    <button onclick="${isFav ? `hireFav(${i})` : `hire(${i})`}" ${!canSign ? 'disabled' : ''} style="flex:2">Sign for ${M(price)}</button>
                    <button class="alt" onclick="${isFav ? `unfav(${i})` : `toggleFav(${i})`}" style="flex:1;margin:0" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}">${isFav ? '★ Unstar' : '☆ Star'}</button>
                </div>
            </div>
        </div>`;
    };

    return `<div class="c" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><div><b>Transfer market</b><div class="m">Scout level ${d.staff.scout}. Squad ${d.roster.length}/${ROSTER_MAX}. Cash ${M(G.m)}</div></div><span class="sp"></span><button class="alt" style="width:auto;margin:0" onclick="scoutMore()">Scout new players ($300)</button><button style="width:auto;margin:0" onclick="ssToggle()">🎯 Scout specific player</button></div>
    <div class="tabs">
        <button class="tab ${rfil == 'all' ? 'on' : ''}" onclick="rfil='all';render()">All (${mkt.length})</button>
        <button class="tab ${rfil == 'fav' ? 'on' : ''}" onclick="rfil='fav';render()">⭐ Favorites (${favs.length})</button>
    </div>
    ${ssPanel(sp, d)}
    ${attrLegend(sp)}
    <div class="c" style="margin-bottom:10px"><div class="m">🌟 The market always shows 6 recruits and fully refreshes every matchday. Star a player to keep him forever in the Favorites tab — his card stays there until you sign or unstar him.</div></div>
    <div class="g rg" style="margin-top:0">${list.length ? list.map((p, i) => card(p, i, isFavView)).join('') : `<p class="m">${isFavView ? 'No favorites yet — tap ☆ Star on any recruit to save him here.' : 'No recruits right now. Play a matchday or scout for more.'}</p>`}</div>`;
}

function facCard(k, e, t, x, f, baseCost, mult, maxLv, note) { const d = G.d[sel], sp = cur(), n = d[k] || 0, bld = d.build && d.build[k], busy = !!bld, full = n >= maxLv; const cost = Math.round(baseCost * mult ** n); let prog = ''; if (busy) { const pct = Math.min(100, Math.max(0, (G.c - bld.start) / (bld.end - bld.start) * 100)); prog = `<div class="prog" data-s="${bld.start}" data-e="${bld.end}"><i style="width:${pct}%"></i></div><div class="m">Upgrading to level ${bld.target} · <b class="pp">${Math.round(pct)}%</b> · <span class="pl2">${cd(bld.end - G.c)}</span> left</div>` } return `<div class="c fc"><div class="fe">${e}</div><h2 style="margin:0">${t}</h2><div class="m">Level ${n} of ${maxLv}</div>${segsN(n, maxLv)}<div>${x}: <b>${f(n)}</b>${!full && !busy ? ', next level <b class="ok">' + f(n + 1) + '</b>' : ''}</div>${note ? `<div class="m" style="margin-top:4px">${note}</div>` : ''}${prog}<button onclick="up('${k}')" ${full || busy || G.m < cost ? 'disabled' : ''}>${full ? 'Max level' : busy ? 'In progress…' : 'Upgrade for ' + M(cost)}</button></div>` }
const LABREQ = [1, 3, 5], STAR_MULT = [1, 25, 120, 600], MM = n => n >= 1e6 ? '$' + (n / 1e6).toFixed(2) + 'M' : n >= 1e4 ? '$' + Math.round(n / 1e3) + 'K' : M(n);
const starB = p => p.up ? ` <span class="ust">${'★'.repeat(p.up)}</span>` : '';
const upCost = p => Math.round(p.o * p.o * (1.2 + .8 * (p.up || 0))), upReady = p => p.o >= p.p - 1 && (p.up || 0) < 3 && p.age <= 29 && p.p < 99, bigVal = p => fee(p) * STAR_MULT[p.up || 0];
function labUp(i) { const d = G.d[sel], p = d.roster[i]; if (!p) return; const lv = d.lab || 0, st = p.up || 0; if (st >= 3) return say('Already at 3 stars'); if (lv < LABREQ[st]) return say('Potential Lab level ' + LABREQ[st] + ' needed'); if (!upReady(p)) return say('Player has not reached potential yet'); if (!pay(upCost(p))) return; const f = p.age <= 24 ? 1 : p.age <= 28 ? .85 : .65, boost = Math.max(3, Math.round((RI(4, 7) + lv) * f)); p.p = Math.min(99, p.p + boost); p.up = st + 1; G.log.unshift(`🧬 ${p.n} reached ${'★'.repeat(p.up)}: potential +${boost} (now ${p.p}).`); save(); render() }
function bigOffers(p, base) { const val = base * STAR_MULT[p.up]; return [...BIGCLUBS].sort(() => Math.random() - .5).slice(0, RI(3, 5)).map(c => { const st = pick(['cash', 'balanced', 'clauses']), price = Math.round(val * R(.75, 1.3) * (st == 'cash' ? .9 : st == 'clauses' ? 1.1 : 1)); const o = { club: c, price, st, big: 1, weeks: RI(3, 10), init: Math.round(price * (st == 'cash' ? R(.55, .7) : st == 'clauses' ? R(.2, .3) : R(.35, .5))), so: st == 'cash' ? 0 : st == 'clauses' ? pick([15, 20]) : 10, bon: [] }; if (st != 'cash') o.bon.push({ label: 'Appearance bonus', amt: Math.round(price * R(.04, .1)), at: 10, p: .9 }); if (st == 'clauses') o.bon.push({ label: 'Trophy bonus', amt: Math.round(price * R(.06, .15)), at: RI(9, 18), p: .4 }); return o }).sort((a, b) => b.price - a.price) }
function instPanel() { const a = G.inst || [], b = G.pend || []; if (!a.length && !b.length) return ''; return `<div class="c" style="margin-bottom:10px"><b>💰 Incoming transfer money</b>` + a.map(x => `<div class="m">${x.club} pays ${MM(x.amt)} a week for ${x.who}, ${x.left} payments left</div>`).join('') + b.map(x => `<div class="m">${x.t == 'sellon' ? 'Sell-on ' + x.pct + '% of profit' : x.label + ' ' + MM(x.amt) + ' (' + Math.round(x.p * 100) + '% likely)'} from ${x.club} for ${x.who}, due in about ${Math.max(0, x.at - G.w)} weeks</div>`).join('') + `</div>` }
function labPanel(sp, d) { const lv = d.lab || 0, all = d.roster.map((p, i) => [p, i]), rd = all.filter(([p]) => upReady(p)), stars = all.filter(([p]) => p.up); return `<h2>🧬 Potential Lab</h2><div class="c"><div class="m">${lv ? 'Lab level ' + lv + '. ' : 'Build the Potential Lab above first. '}A player who reaches his potential (age 29 or under) can be upgraded for a new star, up to 3. Each star raises his potential and makes him worth far more to big clubs.</div></div>` + (rd.length ? `<div class="g" style="margin-top:10px">` + rd.map(([p, i]) => { const s0 = p.up || 0, need = LABREQ[s0], ok = lv >= need; return `<div class="c"><b>${p.n}${starB(p)}</b><div class="m">${p.pos}, age ${p.age}, rating ${Math.round(p.o)} at potential ${p.p}</div><div class="m">Next: star ${s0 + 1}, needs lab level ${need}</div><button onclick="labUp(${i})" ${!ok || G.m < upCost(p) ? 'disabled' : ''}>${ok ? 'Upgrade for ' + M(upCost(p)) : 'Lab level ' + need + ' needed'}</button></div>` }).join('') + `</div>` : `<p class="m">No player is at his potential yet. Keep training them.</p>`) + (stars.length ? `<h2>Star players</h2><div class="g">` + stars.map(([p, i]) => `<div class="c"><b>${p.n}${starB(p)}</b><div class="m">Rating ${Math.round(p.o)} of ${p.p}. Big clubs value him around ${MM(bigVal(p))}</div><button class="alt" onclick="openSell(${i})">See offers</button></div>`).join('') + `</div>` : '') }
function pFa(sp, d) { return `<div class="g fa">` + facCard('camp', '🏋️', 'Training Camp', 'Training speed', n => 'x' + (.5 + n * .35).toFixed(2), 2500, 2, 5, 'Players grow faster each week.') + facCard('arena', '🏟️', 'Arena', 'Match income', n => 'x' + (1 + .35 * n).toFixed(2), 3000, 2, 5, 'Bigger crowds = more gate money.') + facCard('lab', '🧬', 'Potential Lab', 'Star boost', n => n ? '+' + (4 + n) + ' to +' + (7 + n) + ' potential' : 'locked', 6000, 2, 5, 'Level 1 unlocks the 1st star, level 3 the 2nd, level 5 the 3rd. Higher levels give bigger boosts.') + facCard('acad', '🎓', sp.n + ' Academy', 'Youth intake quality', n => n + '/10', 3000, 1.5, 10, `Each season produces 1–2 youth players with better base ratings and potential as the academy grows.`) + `</div>` + `<div class="c" style="margin-top:10px"><b>How progression works</b><div class="m">Upgrades take time and show a live progress bar. The higher the level, the longer the build. Progress continues even while the clock is paused — the bar updates whenever time passes. Facilities carry over between seasons.</div></div>` + labPanel(sp, d) }

function pSt(sp, d) {
    d.coaches = d.coaches || {};
    let h = `<div class="c"><b>General staff payroll</b> ${M(sumS(d) * 80)}/wk · ${Object.values(d.staff).filter(v => v).length} of 4 general roles filled</div>`;
    h += `<h2>General Staff <span class="m" style="font-size:14px;font-weight:400">(5★ max)</span></h2><div class="g sf" style="margin-top:10px">` + STAFF.map(([k, t0, i, x]) => {
        const t = staffName(sp, k), n = d.staff[k], key = 'staff:' + k, bld = d.build && d.build[key], busy = !!bld, full = n >= 5, c = Math.round(1500 * 1.9 ** n);
        let prog = '';
        if (busy) { const pct = Math.min(100, Math.max(0, (G.c - bld.start) / (bld.end - bld.start) * 100)); prog = `<div class="prog" data-s="${bld.start}" data-e="${bld.end}"><i style="width:${pct}%"></i></div><div class="m">Promoting to level ${bld.target} · <b class="pp">${Math.round(pct)}%</b> · <span class="pl2">${cd(bld.end - G.c)}</span> left</div>` }
        return `<div class="c sc"><div class="av">${i}</div><div style="flex:1"><b>${t}</b><div class="stars">${'★'.repeat(n) + '☆'.repeat(5 - n)}</div><div class="m">${x}. Wage ${M(n * 80)}/wk</div>${prog}<button onclick="stf('${k}')" ${full || busy || G.m < c ? 'disabled' : ''}>${full ? 'Max level' : busy ? 'In progress…' : (n ? 'Promote for ' : 'Hire for ') + M(c)}</button></div></div>`;
    }).join('') + `</div>`;

    h += `<h2>Specialist Coaches <span class="m" style="font-size:14px;font-weight:400">(7★ max)</span></h2>`;
    h += `<div class="c"><div class="m">Each specialist accelerates growth of one attribute across the whole squad, week by week. ${(() => { const pc = coachList(sp).find(c => c.pos); return pc ? pc.n + ' only affects ' + pc.pos.map(p => plural(posName(sp, p)).toLowerCase()).join(' and ') + '. ' : '' })()}Higher stars = faster growth and steeper cost. Players over 31 no longer train.</div></div>`;
    h += `<div class="g sf" style="margin-top:10px">` + coachList(sp).map(c => {
        const stars = d.coaches[c.k] || 0;
        const key = 'coach:' + c.k;
        const bld = d.build && d.build[key];
        const busy = !!bld;
        const full = stars >= COACH_MAX;
        const cost = coachCost(stars);
        let prog = '';
        if (busy) { const pct = Math.min(100, Math.max(0, (G.c - bld.start) / (bld.end - bld.start) * 100)); prog = `<div class="prog" data-s="${bld.start}" data-e="${bld.end}"><i style="width:${pct}%"></i></div><div class="m">Promoting to ${bld.target}★ · <b class="pp">${Math.round(pct)}%</b> · <span class="pl2">${cd(bld.end - G.c)}</span> left</div>` }
        const starStrip = '<span class="ust">' + '★'.repeat(stars) + '</span>' + '☆'.repeat(COACH_MAX - stars);
        return `<div class="c sc"><div class="av">${c.e}</div><div style="flex:1"><b>${c.n}</b><div class="stars" style="font-size:16px;letter-spacing:1px">${starStrip}</div><div class="m">${c.desc}</div><div class="m" style="margin-top:2px">Growth bonus: <b>+${(stars * 3).toFixed(0)}%</b> per match${stars >= 5 ? ' · elite' : ''}</div>${prog}<button onclick="coachUp('${c.k}')" ${full || busy || G.m < cost ? 'disabled' : ''}>${full ? 'Max stars (7★)' : busy ? 'In progress…' : (stars ? 'Promote to ' + (stars + 1) + '★ for ' : 'Hire for ') + M(cost)}</button></div></div>`;
    }).join('') + `</div>`;

    return h;
}

const pNw = () => `<div class="c"><ul class="log">` + G.log.map(l => `<li>${l}</li>`).join('') + `</ul></div>`, PG = { home: pHome, tac: pTac, lg: pLg, cup: pCup, pl: pPl, rc: pRc, fa: pFa, st: pSt, nw: pNw };