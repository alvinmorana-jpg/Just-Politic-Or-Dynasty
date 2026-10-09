/* Setup, build timers, ticker, saves, menu, matchday simulation, transfers */
function crest(n, big) { const w = String(n || '?').replace(/&#\d+;/g, '').split(/\s+/).filter(Boolean), t = ((w[0] || '?')[0] + ((w[1] || '')[0] || '')).toUpperCase(); let h = 0; for (const c of String(n)) h = (h * 31 + c.charCodeAt(0)) % 360; return `<span class="crest ${big ? 'big' : ''}" style="--h:${h}">${t}</span>` }
function setup() {
    const o = (a, v) => a.map(x => `<option ${x == v ? 'selected' : ''}>${x}</option>`).join('');
    const nm = S.n.trim() || S.r + ' United';
    return `<div class="setup"><div class="setup-card c"><div class="setup-top"><button class="alt ic" onclick="reset()" title="Back" aria-label="Back to menu">←</button><div><h1 class="title sm">New career</h1><div class="m">Choose where your club is based.</div></div><span class="sp"></span><button class="alt ic" onclick="openUI()" title="Display & device">⚙</button></div>
    <div class="club-prev">${crest(nm, 1)}<div><b class="cn">${nm}</b><div class="m">${(SP.find(x => x.id == S.sp) || SP[0]).e} ${(SP.find(x => x.id == S.sp) || SP[0]).n} · 📍 ${S.r}, ${S.k} · ${S.c}</div></div></div>
    <div class="m" style="margin:8px 0 6px"><b>🎯 Choose your starting sport</b> — it's free to found; you can unlock the others later.</div>
    <div class="sportpick">${SP.map(x => `<button class="sp-card ${S.sp == x.id ? 'on' : ''}" onclick="pickSport('${x.id}')"><span class="se">${x.e}</span><b>${x.n}</b><small>${x.s} on court · ${S.sp == x.id ? 'free start' : 'later ' + M(x.id == 'soccer' && S.sp != 'soccer' ? 15000 : x.c)}</small></button>`).join('')}</div>
    <p class="m">Every sport starts in Village III and climbs toward the World League. Each season runs 34 matchdays over about 11 months, with a Continental Cup every 4 seasons.</p>
    <label>🔎 Search country<input list="cl" placeholder="Type a country name" autocomplete="off" onchange="fk(this.value)"><datalist id="cl">${Object.keys(GEO).map(c => Object.keys(GEO[c]).map(k => `<option value="${k}" label="${c}">`).join('')).join('')}</datalist></label>
    <div class="selg"><label>Continent<select onchange="pk('c',this.value)">${o(Object.keys(GEO), S.c)}</select></label><label>Country<select onchange="pk('k',this.value)">${o(Object.keys(GEO[S.c]), S.k)}</select></label><label>Region<select onchange="pk('r',this.value)">${o(GEO[S.c][S.k], S.r)}</select></label></div>
    <label>Club name<input value="${esc(S.n)}" placeholder="${S.r} United" oninput="S.n=this.value" onchange="render()"></label>
    <button class="go wide" onclick="start()">▶ Start club</button></div></div>`
}
function pickSport(id) { S.sp = id; render() }
function pk(f, v) { S[f] = v; if (f == 'c') { S.k = Object.keys(GEO[v])[0]; S.r = GEO[v][S.k][0] } if (f == 'k') S.r = GEO[S.c][v][0]; render() }
function start() { const sid = S.sp || 'soccer', sp0 = SP.find(x => x.id == sid) || SP[0]; G = fresh(sp0.id); G.geo = { c: S.c, k: S.k, r: S.r, n: esc(S.n.trim() || S.r + ' United') }; G.log = [`Welcome to ${S.r}, ${S.k}. Your ${sp0.n} club starts in ${LAD[0]}. Climb to the World League. Season runs 34 matchdays.`]; G.start = sp0.id; sel = sp0.id; pg = 'home'; newLeague(sp0, G.d[sp0.id]); save(); render() }
function spd(v) { G.sp = v; save(); render() }
function fmSet(k) { G.d[sel].fm = k; save(); render() }

function tickBuild() {
    if (slot == null || !G || !G.geo) return false;
    let changed = false;
    SP.forEach(s => {
        const d = G.d[s.id];
        if (!d.open || !d.build) return;
        Object.keys(d.build).forEach(k => {
            const b = d.build[k];
            if (G.c >= b.end) {
                if (k.startsWith('staff:')) d.staff[k.slice(6)] = b.target;
                else if (k.startsWith('coach:')) { d.coaches = d.coaches || {}; d.coaches[k.slice(6)] = b.target }
                else d[k] = b.target;
                delete d.build[k];
                G.log.unshift(`🏗️ ${s.e} ${b.label} upgraded to level ${b.target}.`);
                changed = true;
            }
        });
    });
    if (changed) save();
    return changed
}

setInterval(() => {
    if (slot == null || !G.geo || !G.sp || G.m < -5000) return;
    G.c += G.sp * 3.6e6;
    /* Daily stamina recovery */
    if (G.stTick == null) G.stTick = G.c;
    const daysPassed = Math.floor((G.c - G.stTick) / DAY);
    if (daysPassed > 0) {
        SP.forEach(s => {
            const d = G.d[s.id]; if (!d.open) return;
            const rate = 1.5 + (d.staff.fit || 0) * 0.30 + (d.staff.phys || 0) * 0.15;
            [d, ...d.lg].forEach(t => t.roster.forEach(p => {
                if (p.st == null) p.st = 100;
                if (p.st >= 100) return;
                const mult = p.inj ? 0.55 : 1;
                p.st = Math.min(100, p.st + rate * mult * daysPassed);
            }));
        });
        G.stTick += daysPassed * DAY;
    }
    const built = tickBuild();
    let s0 = cur(); if (!s0 || !G.d[s0.id].open) s0 = SP.find(x => G.d[x.id] && G.d[x.id].open) || s0;
    if (s0 && G.d[s0.id].open && G.c >= koOf(s0) + matchDur(s0)) { adv(); return }
    if (built) { render(); return }
    const e = document.getElementById('live'); if (e) e.innerHTML = live();
    const e2 = document.getElementById('livePitchBox'); if (e2) swapHTML(e2, liveBroadcastUI(s0));
    tickProgress()
}, 1000);

function mk(sp, d, free) { const age = RI(17, 33), o = RI(30, 46) + (d ? d.staff.scout * 3 : 0) + (free ? 0 : RI(0, 8)); const p = { n: pick(FN) + ' ' + pick(LN), pos: pick(ROLES[sp.id]), age, o, p: Math.min(99, Math.round(o + RI(4, 24) * (age < 24 ? 1.4 : .7))), inj: 0, st: 100, fl: 0, yc: 0, rd: 0, ap: 0, gl: 0, as: 0, sus: 0, fm: 0, cn: rcn(), con: RI(2, 4), wb: 1, fam: {}, fav: false }; genAttrs(sp, p); return p }
function mkYouth(sp, d) { const age = RI(16, 19), acad = d.acad || 0, o = RI(28, 40) + acad * 2; const p = { n: pick(FN) + ' ' + pick(LN), pos: pick(ROLES[sp.id]), age, o, p: Math.min(99, Math.round(o + RI(15, 35) * (1 + acad * .06))), inj: 0, st: 100, fl: 0, yc: 0, rd: 0, ap: 0, gl: 0, as: 0, sus: 0, fm: 0, cn: G.geo.k, con: 3, wb: 1, fam: {}, fav: false }; genAttrs(sp, p); return p }
function mkt(sp, d) { d.mkt = [0, 1, 2, 3, 4, 5].map(() => mk(sp, d)); d.favs = d.favs || [] }
/* Market refresh: always 6 new recruits. Favorites live in d.favs and survive. */
function refreshMkt(sp, d) {
    d.mkt = Array.from({ length: 6 }, () => mk(sp, d));
    if (!d.favs) d.favs = [];
}
function init(sp, d) { d.open = true; d.roster = Array.from({ length: sp.s + 1 }, (_, i) => { const p = mk(sp, null, true), sl = Object.values(FM[sp.id])[0].flat(); if (i < sl.length) { p.pos = sl[i]; delete p.a; delete p.ht; genAttrs(sp, p) } p.con = 3; return p }); d.favs = []; mkt(sp, d); newLeague(sp, d); if (!d.build) d.build = {}; if (d.acad == null) d.acad = 0; if (!d.coaches) d.coaches = {} }
function fresh(startId) { const g = { m: 20000, w: 0, t: 0, c: T0, stTick: T0, sp: 0, geo: null, log: ['Welcome, chairman. Climb from Village III to the World League and become champions. Season runs 34 matchdays over ~11 months with a Continental Cup every 4 seasons.'], d: {}, cups: [], cupsWon: 0 }; SP.forEach(s => g.d[s.id] = { open: false, lv: 0, camp: 0, arena: 0, acad: 0, staff: { coach: 0, fit: 0, phys: 0, scout: 0 }, coaches: {}, rec: { w: 0, d: 0, l: 0 }, ti: 0, roster: [], mkt: [], favs: [], build: {} }); const s0 = SP.find(x => x.id == startId) || SP[0]; init(s0, g.d[s0.id]); return g }
const K = i => 'dyn5_slot' + i, peek = i => { try { const g = JSON.parse(localStorage.getItem(K(i))); return g && g.geo ? g : null } catch (e) { return null } };
let slot = null, dAsk = -1;
try { const o = localStorage.getItem('dyn4'), f = [0, 1, 2, 3].find(j => !peek(j)); if (o && f != null && JSON.parse(o).geo) { localStorage.setItem(K(f), o); localStorage.removeItem('dyn4') } } catch (e) { }
G = fresh();
const save = () => { if (slot == null || !G.geo) return; try { localStorage.setItem(K(slot), JSON.stringify(G)) } catch (e) { } };
function menu() {
    const sl = [0, 1, 2, 3].map(peek), full = sl.every(Boolean); let last = -1; try { last = +localStorage.getItem('dyn_last') } catch (e) { }
    const cont = sl[last] ? last : sl.findIndex(Boolean), nm = SP.map(x => x.e);
    const card = (g, i) => { if (!g) return `<div class="c slot empty" style="--i:${i}"><div class="sn">Slot ${i + 1}</div><div class="plus">＋</div><div class="m">Empty career slot</div><button class="alt" onclick="newCareer(${i})">Start here</button></div>`; const best = Math.max(...SP.map(x => (g.d[x.id] || {}).lv || 0)), open = SP.filter(x => g.d[x.id] && g.d[x.id].open), md = g.w % SEASON;
        return `<div class="c slot ${i == cont ? 'cur' : ''}" style="--i:${i}"><div class="sn">Slot ${i + 1}${i == cont ? ' · last played' : ''}</div><div class="srow">${crest(g.geo.n, 1)}<div style="min-width:0"><b class="cn">${g.geo.n}</b><div class="m">${g.geo.r}, ${g.geo.k}</div></div></div><div class="sico">${SP.map(x => `<span class="${g.d[x.id] && g.d[x.id].open ? 'on' : ''}">${x.e}</span>`).join('')}</div>
        <div class="stl"><span class="m">Season ${Math.floor(g.w / SEASON) + 1} · MD ${md}/34</span><b>${LAD[best]}</b></div><div class="bar2"><i style="width:${md / 34 * 100}%"></i></div>
        <div class="stl"><span class="m">Climb to World League</span><b>${Math.round(best / (LAD.length - 1) * 100)}%</b></div><div class="bar2 gold"><i style="width:${best / (LAD.length - 1) * 100}%"></i></div>
        <div class="m">🏆 ${g.t} titles · ${g.cupsWon || 0} cups · ${open.length}/6 sports · ${M(g.m)}</div>
        <div class="sbtn"><button onclick="loadSlot(${i})">▶ Continue</button><button class="alt" onclick="delSlot(${i})">${dAsk == i ? 'Tap again to delete' : 'Delete'}</button></div></div>` };
    return `<section class="hero"><div class="hero-bg"><i></i><i></i><i></i><i></i></div><div class="hero-in"><div class="hero-top"><span class="sp"></span><button class="alt ic" onclick="openUI()" title="Display & device" aria-label="Display and device settings">⚙</button></div>
    <div class="logo">🏆</div><h1 class="title">Dynasty <span>Manager</span></h1><p class="tag">Build a multi-sport sporting empire. Start in Village III, climb every league and rule the world.</p>
    <div class="floaters">${nm.map((e, i) => `<span style="--i:${i}">${e}</span>`).join('')}</div>
    <div class="hero-btns">${cont >= 0 ? `<button class="go big" onclick="loadSlot(${cont})">▶ Continue career</button>` : ''}<button class="${cont >= 0 ? 'alt' : 'go big'}" onclick="newCareer()">＋ New career</button><button class="alt" onclick="openUI()">📱 Display &amp; device</button></div>
    ${full ? '<p class="ban">All 4 slots are full. Delete one to start a new career.</p>' : ''}
    <div class="chips2"><span>🌍 119 nations</span><span>⚽🏀🏐🥅🏒⚾ 6 sports</span><span>📅 34 matchdays</span><span>🏅 Continental cups</span></div></div></section>
    <h2 class="sec">Your careers</h2><div class="g slots">` + sl.map(card).join('') + `</div><p class="m foot">Works on Android, iPhone, tablets and PCs. Open ⚙ to pick your device layout, theme and text size.</p>`
}
function newCareer(i) { if (i == null) { i = [0, 1, 2, 3].find(j => !peek(j)); if (i == null) { say('All 4 slots are full. Delete one first.'); return } } slot = i; try { localStorage.setItem('dyn_last', i) } catch (e) { } G = fresh(); S.n = ''; dAsk = -1; render() }
function loadSlot(i) { const g = peek(i); if (!g) return render(); try { localStorage.setItem('dyn_last', i) } catch (e) { } G = g; G.sp = 0; slot = i; sel = (SP.find(s => G.d[s.id] && G.d[s.id].open) || SP[0]).id; pg = 'home'; lg = lt = null; sellState = null; modalPid = null; rfil = 'all'; G.stTick = G.c; SP.forEach(s => { const d = G.d[s.id]; if (!d.build) d.build = {}; if (d.acad == null) d.acad = 0; if (!d.staff) d.staff = { coach: 0, fit: 0, phys: 0, scout: 0 }; if (!d.coaches) d.coaches = {}; if (!d.favs) d.favs = []; (d.roster || []).forEach(p => { if (!p.fam) p.fam = {} }); (d.mkt || []).forEach(p => { if (!p.fam) p.fam = {} }); d.favs.forEach(p => { if (!p.fam) p.fam = {}; p.fav = true }); sanitizeLineup(d) }); render() }
function delSlot(i) { if (dAsk != i) { dAsk = i; return render() } dAsk = -1; try { localStorage.removeItem(K(i)) } catch (e) { } say('Slot ' + (i + 1) + ' deleted'); render() }
const cur = () => SP.find(s => s.id == sel);
function say(m) { const t = document.getElementById('t'); try { buzz(10) } catch (e) { } t.textContent = m; t.style.display = 'block'; clearTimeout(say.x); say.x = setTimeout(() => t.style.display = 'none', 1800) }
function rate(sp, d) { return lineup(sp, d).reduce((a, t) => a + t.e, 0) / sp.s + d.staff.fit * 1.5 }

/* ===== Lineup sanity =====
   Removes d.as entries pointing to players no longer on the roster, and clears any
   duplicate player IDs so a swap can never leave two slots pointing at the same man. */
function sanitizeLineup(d) {
    if (!d) return;
    d.as = d.as || {};
    d.cp = d.cp || {};
    const valid = new Set((d.roster || []).map(p => pid(p)));
    const seen = new Set();
    Object.keys(d.as).forEach(k => {
        const id = d.as[k];
        if (!valid.has(id)) { delete d.as[k]; return }
        if (seen.has(id)) { delete d.as[k]; return }
        seen.add(id);
    });
}
/* Call after any roster mutation to strip stale d.as entries for a specific player */
function dropStale(d, id) {
    if (!d) return;
    d.as = d.as || {};
    Object.keys(d.as).forEach(k => { if (d.as[k] === id) delete d.as[k] });
}

function renew(i) { const d = G.d[sel], p = d.roster[i]; if (!p) return; const cost = Math.round(wage(p) * 12); if (G.m < cost) return say('Need ' + M(cost) + ' to renew'); G.m -= cost; p.con = 3; p.wb = Math.round(((p.wb || 1) + 0.1) * 100) / 100; G.log.unshift(`📝 Renewed ${p.n} for ${M(cost)}. New wage ${M(wage(p))}/wk, contract 3 seasons.`); save(); render() }

/* ===== Favorites: ID-based so a market refresh mid-click can't swap the target ===== */
function toggleFavId(id) {
    const d = G.d[sel]; if (!d) return;
    d.mkt = d.mkt || [];
    const i = d.mkt.findIndex(p => pid(p) === id);
    if (i < 0) return;
    const p = d.mkt.splice(i, 1)[0];
    d.favs = d.favs || [];
    p.fav = true;
    d.favs.push(p);
    save(); render();
}
function unfavId(id) {
    const d = G.d[sel]; if (!d) return;
    d.favs = d.favs || [];
    const i = d.favs.findIndex(p => pid(p) === id);
    if (i < 0) return;
    const p = d.favs.splice(i, 1)[0];
    p.fav = false;
    d.mkt = d.mkt || [];
    d.mkt.unshift(p);
    save(); render();
}
function toggleFav(i) { const d = G.d[sel]; const p = (d.mkt || [])[i]; if (p) toggleFavId(pid(p)) }
function unfav(i) { const d = G.d[sel]; const p = (d.favs || [])[i]; if (p) unfavId(pid(p)) }

function openSell(i) { const d = G.d[sel], p = d.roster[i]; if (!p) return; const base = fee(p); if (p.up) { sellState = { idx: i, name: p.n + ' ' + '★'.repeat(p.up), offers: bigOffers(p, base) }; modalPid = null; pg = 'pl'; render(); return } const pool = d.lg.filter(t => t.m > base * .7); if (!pool.length) return say('No clubs can afford this player right now'); const shuffled = pool.slice().sort(() => Math.random() - .5).slice(0, Math.min(pool.length, RI(1, 3))); const offers = shuffled.map(t => ({ club: t.n, price: Math.round(base * R(.75, 1.35)) })); sellState = { idx: i, name: p.n, offers }; modalPid = null; pg = 'pl'; render() }
function acceptSell(j) { if (!sellState) return; const d = G.d[sel], p = d.roster[sellState.idx], o = sellState.offers[j]; if (!p || !o) return; if (o.big) { G.m += o.init; (G.inst = G.inst || []).push({ club: o.club, who: p.n, amt: Math.round((o.price - o.init) / o.weeks), left: o.weeks }); const pe = (G.pend = G.pend || []); if (o.so) pe.push({ t: 'sellon', club: o.club, who: p.n, pct: o.so, base: o.price, at: G.w + RI(20, 45) }); o.bon.forEach(b => pe.push({ t: 'bonus', club: o.club, who: p.n, amt: b.amt, p: b.p, label: b.label, at: G.w + b.at })); const id = pid(p); d.roster.splice(sellState.idx, 1); dropStale(d, id); sanitizeLineup(d); G.log.unshift(`💸 Sold ${p.n} ${'★'.repeat(p.up || 0)} to ${o.club} for ${MM(o.price)}: ${MM(o.init)} now, the rest over ${o.weeks} weeks.`); sellState = null; save(); render(); return } const id = pid(p); G.m += o.price; const t = d.lg.find(x => x.n == o.club); if (t) { t.m = Math.max(0, t.m - o.price); t.roster.push(p); if (t.roster.length > cur().s + 3) { const w = t.roster.reduce((a, q) => q.o < a.o ? q : a); t.roster.splice(t.roster.indexOf(w), 1) } } d.roster.splice(sellState.idx, 1); dropStale(d, id); sanitizeLineup(d); G.log.unshift(`💸 Sold ${p.n} to ${o.club} for ${M(o.price)}.`); sellState = null; save(); render() }
function cancelSell() { sellState = null; render() }

/* ===== Unified sign from anywhere =====
   Order matters: remove from source BEFORE deducting money, so a failed remove can never charge the user. */
function hireP(p) {
    const sp = cur(), d = G.d[sp.id];
    if (!p) return say('Player not found');
    if (d.roster.length >= ROSTER_MAX) return say('Roster full (' + ROSTER_MAX + ' players): release someone first');
    const price = fee(p);
    if (G.m < price) return say('Not enough cash');
    let removed = false;
    let idx = (d.mkt || []).indexOf(p);
    if (idx >= 0) { d.mkt.splice(idx, 1); removed = true; }
    else { idx = (d.favs || []).indexOf(p); if (idx >= 0) { d.favs.splice(idx, 1); removed = true; } }
    if (!removed) return say('Player no longer available');
    G.m -= price;
    if (p.con == null) p.con = 3;
    if (!p.fam) p.fam = {};
    p.fav = false;
    d.roster.push(p);
    sanitizeLineup(d);
    save();
    say('✅ Signed ' + p.n + ' for ' + M(price));
    pg = 'pl';
    pfil = 'all';
    psort = 'o';
    sellState = null;
    modalPid = null;
    render();
}
function hireById(id) {
    const d = G.d[sel]; if (!d) return;
    const p = (d.mkt || []).find(x => pid(x) === id) || (d.favs || []).find(x => pid(x) === id);
    if (!p) return say('Player no longer available');
    hireP(p);
}
/* Legacy index-based calls — kept for safety */
function hire(i) { const d = G.d[sel]; const p = (d.mkt || [])[i]; if (p) hireP(p) }
function hireFav(i) { const d = G.d[sel]; const p = (d.favs || [])[i]; if (p) hireP(p) }

let modalPid = null;
function openP(id) { modalPid = id; render() }
function closeP() { modalPid = null; render() }
function findPlayer(id) {
    const d = G.d[sel]; if (!d) return null;
    return (d.roster || []).find(p => pid(p) === id) ||
        (d.mkt || []).find(p => pid(p) === id) ||
        (d.favs || []).find(p => pid(p) === id) || null;
}
function renewFromModal() { const d = G.d[sel], p = findPlayer(modalPid); if (!p) return; const i = d.roster.indexOf(p); if (i >= 0) renew(i) }
function sellFromModal() { const d = G.d[sel], p = findPlayer(modalPid); if (!p) return; const i = d.roster.indexOf(p); if (i >= 0) openSell(i) }
function releaseFromModal() { const d = G.d[sel], p = findPlayer(modalPid); if (!p) return; const i = d.roster.indexOf(p); if (i >= 0) { modalPid = null; rel(i) } }
function hireFromModal() { const id = modalPid; modalPid = null; hireById(id) }
function favFromModal() {
    const d = G.d[sel], p = findPlayer(modalPid);
    if (!p) return;
    const id = pid(p);
    const inFavs = (d.favs || []).indexOf(p) >= 0;
    if (inFavs) unfavId(id); else toggleFavId(id);
}
function playerModal() {
    if (!modalPid) return '';
    const p = findPlayer(modalPid); if (!p) { modalPid = null; return '' }
    const sp = cur(), d = G.d[sel]; genAttrs(sp, p);
    const st = STm(p), n = v => v || 0;
    const inRoster = d.roster.indexOf(p) >= 0;
    const inMarket = (d.mkt || []).indexOf(p) >= 0;
    const inFavs = (d.favs || []).indexOf(p) >= 0;
    const fam = p.fam || {}, posList = ROLES[sp.id] || [];
    const famRows = posList.filter(pos => (fam[pos] || 0) > 0 || pos === p.pos).sort((a, b) => (fam[b] || 0) - (fam[a] || 0) || (a === p.pos ? -1 : b === p.pos ? 1 : 0)).map(pos => { const f = fam[pos] || 0, learned = Math.min(100, Math.round(f / ADP[sp.id] * 100)), isNat = pos === p.pos, pen = posPenalty(sp, p, pos); const penTxt = pen > 0 ? '−' + pen : '±0', penCls = pen > 0 ? 'bad' : 'ok'; return `<div class="fam-row"><b class="bd">${pos}</b><span class="m" style="min-width:70px">${posName(sp, pos)}</span><div class="fam-bar"><i style="width:${isNat ? 100 : learned}%"></i></div><span class="m" style="min-width:60px;text-align:right">${isNat ? 'Natural' : (f + ' game' + (f === 1 ? '' : 's'))}</span><b class="${penCls}" style="min-width:36px;text-align:right">${penTxt}</b></div>` }).join('');
    return `<div class="modal-bg" onclick="if(event.target===this)closeP()"><div class="modal"><button class="modal-close" onclick="closeP()">✕</button><div class="pt" style="margin-bottom:8px;padding-right:36px"><span class="bd" style="font-size:15px">${p.pos}</span><span class="m role" style="margin:0;font-size:13px;font-style:normal">${posName(sp, p.pos)}</span><span class="m">age ${p.age}</span>${p.fav ? ' <span class="ust">⭐</span>' : ''}</div><div class="pn" style="font-size:28px;margin:2px 0">${p.n}${starB(p)}</div><div class="m">🌍 ${p.cn || 'Unknown'} · ${p.ht} cm</div><div class="po" style="margin-top:6px"><b>${Math.round(p.o)}</b><span class="m">now · potential ${p.p}</span></div>${bars(p.o, p.p)}<h2 style="margin:14px 0 4px;font-size:17px">Attributes</h2>${attrGrid(sp, p)}<h2 style="margin:14px 0 4px;font-size:17px">Status &amp; Stats</h2><div class="stl"><span class="m">Stamina</span><b>${st}%</b></div><div class="stb"><s style="width:${st}%;background:${stCol(st)}"></s></div><div class="sg2"><span><b>${p.fm ? p.fm.toFixed(1) : '–'}</b>Form</span><span><b>${n(p.ap)}</b>Apps</span><span><b>${n(p.gl)}</b>${GLB[sp.id]}</span><span><b>${n(p.as)}</b>Assists</span><span><b>${n(p.fl)}</b>Fouls</span><span><b>${n(p.yc)}</b>🟨</span><span><b>${n(p.rd)}</b>🟥</span><span><b>${n(p.ap - p.sus)}</b>Played</span><span><b>${Object.keys(fam).length}</b>Pos.</span></div><div class="m ${p.inj || p.sus ? 'bad' : 'ok'}" style="margin-top:4px">${statusOf(p)}</div><h2 style="margin:14px 0 4px;font-size:17px">Position Familiarity</h2><div class="m" style="margin-bottom:6px">Players adapt to a position the more they play there. The out-of-position penalty shrinks toward zero across roughly ${ADP[sp.id]} matches. Same-family positions start with only a small penalty; cross-family ones start large.</div>${famRows || '<div class="m">No positional history yet — play matches to build familiarity.</div>'}<h2 style="margin:14px 0 4px;font-size:17px">Contract</h2><div class="m">Contract: <b>${(p.con || 3)}</b> season${(p.con || 3) > 1 ? 's' : ''} · Wage ${M(wage(p))}/wk · Transfer value ${M(fee(p))}</div>${inRoster ? `<div style="display:flex;gap:8px;margin-top:12px"><button class="alt" style="flex:1" onclick="renewFromModal()">Renew</button><button class="alt" style="flex:1" onclick="sellFromModal()">Sell</button><button class="alt" style="flex:1" onclick="releaseFromModal()">Release</button></div>` : ''}${(inMarket || inFavs) ? `<div style="display:flex;gap:8px;margin-top:12px"><button style="flex:2" onclick="hireFromModal()" ${G.m < fee(p) || d.roster.length >= ROSTER_MAX ? 'disabled' : ''}>Sign for ${M(fee(p))}</button><button class="alt" style="flex:1" onclick="favFromModal()">${inFavs ? '⭐ Unstar' : '☆ Star'}</button></div>` : ''}</div></div>`
}

function adv() {
    if (G.m < -5000) { const i = slot; try { localStorage.removeItem(K(i)) } catch (e) { } slot = null; G = fresh(); say('The board fired you. Slot ' + (i + 1) + ' is free.'); return render() }
    const s0 = cur(), PL = {};
    SP.forEach(s => { if (G.d[s.id].open) PL[s.id] = matchPlan(s) });   /* this matchday's sets / overtime, rolled once, so live screen and result agree */
    const me = (s0 && G.d[s0.id].open) ? koOf(s0) + matchDur(s0, PL[s0.id]) : T0 + G.w * MD_DAYS * DAY;
    G.w++; G.c = Math.max(G.c, me); const L = [], rd = (G.w - 1) % SEASON;
    (G.inst || []).forEach(x => { G.m += x.amt; x.left--; L.push(`💰 ${x.club} paid ${MM(x.amt)} for ${x.who} (${x.left} payments left)`) }); G.inst = (G.inst || []).filter(x => x.left > 0);
    (G.pend || []).forEach(x => { if (G.w < x.at) return; x.done = 1; if (x.t == 'sellon') { const rs = Math.round(x.base * R(1.2, 2.4)), py = Math.round((rs - x.base) * x.pct / 100); G.m += py; L.push(`🔁 ${x.club} resold ${x.who} for ${MM(rs)}. Your ${x.pct}% sell-on paid ${MM(py)}`) } else if (Math.random() < x.p) { G.m += x.amt; L.push(`🎁 ${x.label} for ${x.who} paid ${MM(x.amt)}`) } else L.push(`${x.label} for ${x.who} was not triggered`) }); G.pend = (G.pend || []).filter(x => !x.done);
    SP.forEach(sp => {
        const d = G.d[sp.id]; if (!d.open) return; const all = [d, ...d.lg], nm = i => i ? d.lg[i - 1].n : G.geo.n;
        all.forEach(t => t.roster.forEach(p => {
            if (p.inj > 0) p.inj--;
            if (p.o < p.p) p.o = Math.min(p.p, p.o + R(.1, 1) * (.5 + t.camp * .35 + t.staff.coach * .3) * (p.age < 24 ? 1.4 : p.age > 30 ? .4 : 1));
            if (t === d && d.coaches && p.age <= 31) {
                if (!p.a) genAttrs(sp, p);
                const ageK = p.age < 24 ? 1.6 : p.age < 30 ? 1 : 0.3;
                coachList(sp).forEach(c => {
                    const stars = d.coaches[c.k] || 0;
                    if (!stars) return;
                    if (c.pos && !c.pos.includes(basePos(sp, p.pos))) return;
                    const mult = stars * 0.03 * ageK;
                    if (c.pos) {
                        ATTR_KEYS.forEach(k => { if (p.a[k] < 99 && Math.random() < mult) p.a[k] = Math.min(99, p.a[k] + 1) });
                    } else if (c.attr === 'SPD') {
                        ['SPD', 'SPR'].forEach(k => { if (p.a[k] < 99 && Math.random() < mult) p.a[k] = Math.min(99, p.a[k] + 1) });
                    } else {
                        if (p.a[c.attr] < 99 && Math.random() < mult) p.a[c.attr] = Math.min(99, p.a[c.attr] + 1);
                    }
                });
            }
        }));
        d.rs[rd] = d.fx[rd].map(([a, b]) => {
            const A = tm(d, a), B = tm(d, b), ra = rate(sp, A) + 2, rb = rate(sp, B), pw = 1 / (1 + Math.exp((rb - ra) / 8)), r = Math.random(), x = RULES[sp.id].draw ? (r < pw * .9 ? 'w' : r < pw * .9 + .1 ? 'd' : 'l') : (r < pw ? 'w' : 'l'), y = { w: 'l', d: 'd', l: 'w' }[x];
            A.rec[x]++; B.rec[y]++;
            [[A, a, x, ra, 1, b], [B, b, y, rb, 0, a]].forEach(([t, i, res, q, h, o]) => { const gate = (800 + q * 20) * (.5 + sp.s * .12) * (1 + .35 * t.arena) * (h ? 1 : .7) * { w: 1, d: .6, l: .35 }[res]; const prize = Math.round(MATCH_PRIZE(d.lv) * { w: 1, d: .5, l: .25 }[res] * (h ? 1.1 : .9)); const inc = gate + prize; const cost = t.roster.reduce((z, p) => z + wage(p), 0) + Object.values(t.staff).reduce((z, v) => z + v, 0) * 80; if (i) t.m = Math.max(-2000, t.m + inc - cost); else { G.m += inc - cost; d.form = (d.form || []).concat(res.toUpperCase()).slice(-5); L.push(`${sp.e} ${{ w: 'Win', d: 'Draw', l: 'Loss' }[res]} vs ${nm(o)} (${LAD[d.lv]}): ${M(gate)} gate, ${M(prize)} prize, ${M(cost)} wages`) } });
            const rs = score(x, GS[sp.id], (!a || !b) ? PL[sp.id] : rollPlan(sp)), pf = sp.id == 'volley' ? vPts : (u => u); if (a) aiStats(sp, A, pf(rs[0], rs[1])); if (b) aiStats(sp, B, pf(rs[1], rs[0])); return rs
        });
        squadStep(sp, d, rd, L);
        all.forEach(t => t.roster.forEach(p => { if (!p.inj && Math.random() < .05 * (1 - t.staff.phys * .15) * (t === d ? 1 + (100 - STm(p)) / 120 : 1)) { p.inj = Math.max(1, Math.round(RI(1, 4) * (1 - t.staff.phys * .1))); p.it = pick(INJ); if (t === d) L.push(`🤕 ${p.n} (${sp.n}): ${p.it}, out ${p.inj} weeks`) } }));
        d.lg.forEach(t => ai(sp, t, sp.id == sel ? L : []))
    });
    /* Market refresh: wipe d.mkt to exactly 6 fresh recruits, keep d.favs untouched */
    SP.forEach(sp => { const d = G.d[sp.id]; if (d.open) refreshMkt(sp, d); });
    if (G.w % SEASON == 0) SP.forEach(sp => {
        const d = G.d[sp.id]; if (!d.open) return; const pos = tbl(sp, d).findIndex(x => !x.i) + 1, f = d.lv, pr = Math.round((TEAMS + 1 - pos) * 200 * (1 + f * .4)); G.m += pr;
        d.lastPos = pos;
        let s = `🏁 ${sp.n} ${LAD[f]}: finished ${pos} of ${TEAMS}, prize ${M(pr)}.`;
        if (pos == 1) { d.ti++; G.t++; s += ' 🏆 CHAMPIONS!'; if (f == LAD.length - 1) d.wc = 1 }
        awardCeremony(sp, d, L);
        const jump = pos == 1 ? 2 : pos <= PROMOTE ? 1 : pos > TEAMS - RELEGATE ? -1 : 0;
        d.lv = Math.max(0, Math.min(LAD.length - 1, f + jump));
        s += d.lv > f ? ` Promoted to ${LAD[d.lv]}.` : d.lv < f ? ` Relegated to ${LAD[d.lv]}.` : ` Stay in ${LAD[f]}.`;
        L.push(s);
        [d, ...d.lg].forEach(t => t.roster.forEach(p => { if (t === d) { p.st = 100; p.fl = 0; p.yc = 0; p.rd = 0; p.sus = 0 } p.ap = 0; p.gl = 0; p.as = 0; p.age++; if (p.age > 31) p.o = Math.max(20, p.o - RI(1, 3)); if (p.age >= 30 && !p.up) p.p = Math.min(p.p, Math.round(p.o)) }));
        d.roster = d.roster.filter(p => { p.con = (p.con == null ? 3 : p.con) - 1; if (p.con <= 0) { L.push(`👋 ${p.n} (${p.pos}, ${Math.round(p.o)}) left on a free transfer.`); return false } return true });
        sanitizeLineup(d);
        while (d.roster.length < sp.s) { const q = mk(sp, d, true); q.con = 3; d.roster.push(q); L.push(`🔁 ${q.n} joins on a free to fill the squad.`) }
        if ((d.acad || 0) > 0) { const n = 1 + (Math.random() < d.acad / 10 ? 1 : 0); for (let i = 0; i < n; i++) { const y = mkYouth(sp, d); const toSquad = d.roster.length < ROSTER_MAX; if (toSquad) d.roster.push(y); else d.mkt.unshift(y); L.push(`🎓 Academy graduate: ${y.n} (${y.pos}, ${Math.round(y.o)}/${y.p}) ${toSquad ? 'joins the squad' : 'goes to the market'}.`) } }
        if (d.lv != f) newLeague(sp, d); else { d.fx = sched(TEAMS); d.rs = [];[d, ...d.lg].forEach(t => { t.rec = { w: 0, d: 0, l: 0 } }) }
        refreshMkt(sp, d);
        runContinental(sp, d, L);
    });
    G.log = L.reverse().concat(G.log).slice(0, 24); save(); render()
}
function rel(i) { const d = G.d[sel]; if (d.roster.length <= cur().s) return say('You need a full squad'); const p = d.roster[i]; const id = p ? pid(p) : null; say(p.n + ' released'); d.roster.splice(i, 1); if (id) dropStale(d, id); sanitizeLineup(d); save(); render() }
function pay(c) { if (G.m < c) { say('Not enough cash'); return false } G.m -= c; return true }

function up(k) { const d = G.d[sel], sp = cur(); if (d.build && d.build[k]) return say('Already upgrading'); const maxLv = k == 'acad' ? 10 : 5; if ((d[k] || 0) >= maxLv) return; const base = k == 'camp' ? 2500 : k == 'lab' ? 6000 : 3000; const mult = k == 'acad' ? 1.5 : 2; const cost = Math.round(base * mult ** (d[k] || 0)); if (!pay(cost)) return; d.build = d.build || {}; const label = k == 'camp' ? 'Training Camp' : k == 'arena' ? 'Arena' : k == 'lab' ? 'Potential Lab' : sp.n + ' Academy'; d.build[k] = { start: G.c, end: G.c + ((d[k] || 0) + 1) * DAY, target: (d[k] || 0) + 1, label }; save(); render() }
function stf(k) { const d = G.d[sel], key = 'staff:' + k; if (d.build && d.build[key]) return say('Already upgrading'); if (d.staff[k] >= 5) return; const cost = Math.round(1500 * 1.9 ** d.staff[k]); if (!pay(cost)) return; d.build = d.build || {}; d.build[key] = { start: G.c, end: G.c + (d.staff[k] + 1) * DAY, target: d.staff[k] + 1, label: staffName(cur(), k) }; save(); render() }
function coachUp(k) { const d = G.d[sel], sp = cur(), key = 'coach:' + k; if (d.build && d.build[key]) return say('Already upgrading'); const spec = coachList(sp).find(x => x.k === k); if (!spec) return say('This sport has no such coach'); d.coaches = d.coaches || {}; const stars = d.coaches[k] || 0; if (stars >= COACH_MAX) return say('Already at 7 stars'); const cost = coachCost(stars); if (!pay(cost)) return; d.build = d.build || {}; d.build[key] = { start: G.c, end: G.c + (stars + 1) * DAY * 0.6, target: stars + 1, label: spec.n }; save(); render() }
const ucost = sp => sp.c || (G.start && G.start !== sp.id && sp.id === 'soccer' ? 15000 : 0);
function unlock() { const sp = cur(); if (pay(ucost(sp))) { init(sp, G.d[sp.id]); G.log.unshift(`${sp.e} ${sp.n} division founded!`); save(); render() } }
function scoutMore() {
    const sp = cur();
    const dd = G.d[sp.id];
    const have = (dd.mkt || []).length;
    const need = Math.max(0, 6 - have);
    if (!need) return say('Market already has 6 recruits');
    if (!pay(300)) return;
    dd.mkt = (dd.mkt || []).concat(Array.from({ length: need }, () => mk(sp, dd)));
    save(); render();
}
function reset() { save(); slot = null; render() }