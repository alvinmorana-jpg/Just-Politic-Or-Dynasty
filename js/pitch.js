/* Bench cards, pitch markings, lineup UI, scouting, drag & drop */
function benchCard(p, sp) {
    const st = STm(p), na = p.inj || p.sus, on = selB == pid(p);
    genAttrs(sp, p);
    return `<div class="bc ${on ? 'on' : ''} ${na ? 'na' : ''} ${tierOf(Math.round(p.o))}" ${na ? '' : `onclick="selB=selB=='${pid(p)}'?null:'${pid(p)}';render()"`}>
        <button class="info-btn" onclick="event.stopPropagation();openP('${pid(p)}')" title="Player info">ⓘ</button>
        <span class="ov2">${Math.round(p.o)}</span>
        <div style="flex:1;min-width:0">
            <b>${p.n}${starB(p)}</b>
            <div class="m"><b>${p.pos}</b> <span class="role">${posName(sp, p.pos)} · ${Math.round(p.o)}</span></div>
            <div class="m">${p.cn || '—'} · age ${p.age} · ${p.ht}cm</div>
            ${attrGrid(sp, p, true)}
            <div class="stb"><s style="width:${st}%;background:${stCol(st)}"></s></div>
            <div class="m">Stamina ${st}% · Form ${p.fm ? p.fm.toFixed(1) : '–'}</div>
            <div class="${na ? 'bad' : 'ok'}" style="font-size:14px">${statusOf(p)}</div>
        </div>
    </div>`
}
function fieldMarkings(sp) {
    const st = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none';
    if (sp.id == 'soccer') return soccerZones() + soccerSvg();
    if (sp.id == 'futsal') return soccerSvg();
    function soccerSvg() { return `<svg viewBox="0 0 300 400" preserveAspectRatio="none" class="fmk" style="${st}"><rect x="8" y="8" width="284" height="384" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="2.5"/><line x1="8" y1="200" x2="292" y2="200" stroke="rgba(255,255,255,.85)" stroke-width="2"/><circle cx="150" cy="200" r="45" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="2"/><circle cx="150" cy="200" r="4" fill="rgba(255,255,255,.9)"/><rect x="70" y="8" width="160" height="70" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="2"/><rect x="105" y="8" width="90" height="30" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="2"/><circle cx="150" cy="78" r="4" fill="rgba(255,255,255,.9)"/><path d="M 105 78 A 45 45 0 0 0 195 78" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="2"/><rect x="70" y="322" width="160" height="70" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="2"/><rect x="105" y="362" width="90" height="30" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="2"/><circle cx="150" cy="322" r="4" fill="rgba(255,255,255,.9)"/><path d="M 105 322 A 45 45 0 0 1 195 322" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="2"/><rect x="115" y="2" width="70" height="6" fill="none" stroke="rgba(255,255,255,.95)" stroke-width="2"/><rect x="115" y="392" width="70" height="6" fill="none" stroke="rgba(255,255,255,.95)" stroke-width="2"/></svg>`; }
    function soccerZones() { return `<i class="zl" style="top:2%">ATTACK</i><i class="zl" style="top:34%;border-top:2px dashed rgba(0,0,0,.55)">MIDFIELD</i><i class="zl" style="top:62.5%;border-top:2px dashed rgba(0,0,0,.55)">DEFENCE</i>` }
    if (sp.id == 'basket') return `<svg viewBox="0 0 300 400" preserveAspectRatio="none" class="fmk" style="${st}"><rect x="10" y="10" width="280" height="380" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="2.5"/><line x1="10" y1="200" x2="290" y2="200" stroke="rgba(255,255,255,.9)" stroke-width="2"/><circle cx="150" cy="200" r="40" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="2"/><rect x="105" y="10" width="90" height="120" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="2"/><circle cx="150" cy="130" r="32" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="2"/><path d="M 25 10 L 25 40 A 165 165 0 0 0 275 40 L 275 10" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="2"/><line x1="135" y1="30" x2="165" y2="30" stroke="rgba(255,255,255,.9)" stroke-width="3"/><circle cx="150" cy="30" r="7" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="2"/><rect x="105" y="270" width="90" height="120" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="2"/><circle cx="150" cy="270" r="32" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="2"/><path d="M 25 390 L 25 360 A 165 165 0 0 1 275 360 L 275 390" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="2"/><line x1="135" y1="370" x2="165" y2="370" stroke="rgba(255,255,255,.9)" stroke-width="3"/><circle cx="150" cy="370" r="7" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="2"/></svg>`;
    if (sp.id == 'volley') return `<svg viewBox="0 0 300 400" preserveAspectRatio="none" class="fmk" style="${st}"><rect x="10" y="10" width="280" height="380" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="2.5"/><line x1="10" y1="200" x2="290" y2="200" stroke="rgba(255,255,255,.95)" stroke-width="5" stroke-dasharray="6 4"/><line x1="10" y1="150" x2="290" y2="150" stroke="rgba(255,255,255,.85)" stroke-width="2"/><line x1="10" y1="250" x2="290" y2="250" stroke="rgba(255,255,255,.85)" stroke-width="2"/><circle cx="60" cy="200" r="3" fill="rgba(255,255,255,.85)"/><circle cx="240" cy="200" r="3" fill="rgba(255,255,255,.85)"/></svg>`;
    if (sp.id == 'hockey') return `<svg viewBox="0 0 300 400" preserveAspectRatio="none" class="fmk" style="${st}"><rect x="8" y="8" width="284" height="384" rx="55" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="2.5"/><line x1="8" y1="200" x2="292" y2="200" stroke="#e74c3c" stroke-width="2.5" opacity=".85"/><line x1="8" y1="130" x2="292" y2="130" stroke="#3498db" stroke-width="3" opacity=".85"/><line x1="8" y1="270" x2="292" y2="270" stroke="#3498db" stroke-width="3" opacity=".85"/><circle cx="150" cy="200" r="35" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="1.5"/><circle cx="150" cy="200" r="4" fill="#e74c3c"/><circle cx="55" cy="65" r="20" fill="none" stroke="#e74c3c" stroke-width="1.5" opacity=".8"/><circle cx="245" cy="65" r="20" fill="none" stroke="#e74c3c" stroke-width="1.5" opacity=".8"/><circle cx="55" cy="335" r="20" fill="none" stroke="#e74c3c" stroke-width="1.5" opacity=".8"/><circle cx="245" cy="335" r="20" fill="none" stroke="#e74c3c" stroke-width="1.5" opacity=".8"/><circle cx="150" cy="65" r="20" fill="none" stroke="#e74c3c" stroke-width="1.5" opacity=".8"/><circle cx="150" cy="335" r="20" fill="none" stroke="#e74c3c" stroke-width="1.5" opacity=".8"/><path d="M 115 8 L 115 22 A 35 35 0 0 0 185 22 L 185 8" fill="none" stroke="#3498db" stroke-width="1.5" opacity=".8"/><path d="M 115 392 L 115 378 A 35 35 0 0 1 185 378 L 185 392" fill="none" stroke="#3498db" stroke-width="1.5" opacity=".8"/></svg>`;
    if (sp.id == 'base') return `<svg viewBox="0 0 300 400" preserveAspectRatio="none" class="fmk" style="${st}"><line x1="150" y1="360" x2="40" y2="40" stroke="rgba(255,255,255,.85)" stroke-width="2"/><line x1="150" y1="360" x2="260" y2="40" stroke="rgba(255,255,255,.85)" stroke-width="2"/><path d="M 40 40 A 220 220 0 0 1 260 40" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="1.5"/><polygon points="150,360 85,275 150,190 215,275" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="2"/><rect x="143" y="353" width="14" height="14" fill="rgba(255,255,255,.9)"/><rect x="78" y="268" width="14" height="14" fill="rgba(255,255,255,.9)"/><rect x="143" y="183" width="14" height="14" fill="rgba(255,255,255,.9)"/><rect x="208" y="268" width="14" height="14" fill="rgba(255,255,255,.9)"/><circle cx="150" cy="275" r="20" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="2"/><circle cx="150" cy="360" r="22" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="1"/></svg>`;
    return ''
}
function pitch(sp, LU) {
    const d = G.d[sel], sb = selB ? d.roster.find(p => p.id == selB) : null;
    return `<div class="pit" style="background:${PB[sp.id]}">${fieldMarkings(sp)}<div class="grid"></div><div class="snap"></div>` + LU.map(t => {
        const dl = sb && t.p ? Math.round((sb.o - posPenalty(sp, sb, t.pos)) * sf(sb) - t.e) : null;
        const pn = posName(sp, t.pos);
        if (t.p) genAttrs(sp, t.p);
        const eff = t.e, pen = t.pen || 0;
        const effCls = pen > 0 ? 'dn' : (pen < 0 ? 'up' : '');
        return `<div class="pl ${t.off ? 'off' : ''} ${t.custom ? 'cus' : ''}" data-k="${t.k}" title="${t.custom ? 'Custom position (' + t.grp + '): ' : ''}${t.pos} · ${pn}${t.p ? ' · ' + t.p.n : ''}" style="left:${t.x}%;top:${t.y}%"><b class="${t.p ? tierOf(Math.round(t.p.o)) : ''}">${t.p ? Math.round(t.p.o) : '?'}</b><span>${t.p ? t.p.n.split(' ')[1] + '★'.repeat(t.p.up || 0) : 'Empty'}</span><i>${t.custom ? 'C·' : ''}${t.pos}<em class="eff ${effCls}">${t.p ? Math.round(eff) : ''}</em></i><span class="role">${pn}</span>${t.p ? `<u class="sb"><s data-sm style="width:${STm(t.p)}%;background:${stCol(STm(t.p))}"></s></u>` : ''}${dl != null ? `<em class="dl ${dl >= 0 ? 'g' : 'r'}">${dl > 0 ? '+' + dl : dl}</em>` : ''}</div>`
    }).join('') + `</div>`
}

let sellState = null;
function sellPanel() { if (!sellState) return ''; return `<div class="c" style="margin-bottom:10px;border-color:var(--gold)"><b>💸 Offers for ${sellState.name}</b><div class="m">Accept an offer to sell, or cancel to keep the player.</div>` + sellState.offers.map((o, j) => `<div class="fxr"><span>${o.club}${o.big ? `<br><small class="m"><b>${{ cash: 'Cash deal', balanced: 'Balanced', clauses: 'Clause-heavy' }[o.st]}:</b> ${MM(o.init)} up front, then ${MM(Math.round((o.price - o.init) / o.weeks))} a week for ${o.weeks} weeks</small>` : ''}${o.big && (o.so || o.bon.length) ? `<br><small class="m">${o.so ? o.so + '% sell-on of profit. ' : ''}${o.bon.map(x => x.label + ' ' + MM(x.amt) + ' (' + Math.round(x.p * 100) + '% likely)').join(', ')}</small>` : ''}</span><b>${o.big ? MM(o.price) : M(o.price)}</b><span style="text-align:right"><button class="alt" style="width:auto;margin:0;padding:4px 12px" onclick="acceptSell(${j})">Accept</button></span></div>`).join('') + `<button class="alt" style="margin-top:8px" onclick="cancelSell()">Cancel</button></div>` }

function pPl(sp, d) {
    const ids = new Set(lineup(sp, d).map(t => t.p ? pid(t.p) : null)), pf = pfil != 'all' && POS[sp.id].includes(pfil) ? pfil : 'all', n = v => v || 0;
    const sk = { o: (a, b) => b[0].o - a[0].o, p: (a, b) => b[0].p - a[0].p, age: (a, b) => a[0].age - b[0].age, st: (a, b) => STm(b[0]) - STm(a[0]), gl: (a, b) => n(b[0].gl) - n(a[0].gl), as: (a, b) => n(b[0].as) - n(a[0].as), fl: (a, b) => n(b[0].fl) - n(a[0].fl) }[psort] || ((a, b) => b[0].o - a[0].o);
    const R0 = d.roster, top = (k) => R0.reduce((a, p) => n(p[k]) > n(a && a[k]) ? p : a, null), ts = top('gl'), ta = top('as'), bf = R0.reduce((a, p) => (p.fm || 0) > ((a && a.fm) || 0) ? p : a, null), mf = top('fl'), avail = R0.filter(p => !p.inj && !p.sus).length, avg = Math.round(R0.reduce((a, p) => a + STm(p), 0) / R0.length);
    let h = sellPanel() + instPanel() + attrLegend(sp) + roleLegend(sp);
    h += `<div class="g">` + [['⚽ Top ' + GLB[sp.id].toLowerCase() + ' scorer', ts && n(ts.gl) ? ts.n + ' (' + ts.gl + ')' : '–'], ['🎯 Top assists', ta && n(ta.as) ? ta.n + ' (' + ta.as + ')' : '–'], ['⭐ Best form', bf && bf.fm ? bf.n + ' (' + bf.fm.toFixed(1) + ')' : '–'], ['🔋 Squad', avail + '/' + R0.length + ' available · avg stamina ' + avg + '%']].map(([t, v]) => `<div class="c"><div class="m">${t}</div><b>${v}</b></div>`).join('') + `</div>`;
    h += `<div class="tabs">` + ['all', ...POS[sp.id]].map(k => `<button class="tab ${pf == k ? 'on' : ''}" onclick="pfil='${k}';render()">${k == 'all' ? 'All' : k + ' · ' + posName(sp, k)}</button>`).join('') + `</div><div class="tabs">` + [['o', 'Rating'], ['p', 'Potential'], ['age', 'Youngest'], ['st', 'Stamina'], ['gl', GLB[sp.id]], ['as', 'Assists'], ['fl', 'Fouls']].map(([k, t]) => `<button class="tab ${psort == k ? 'on' : ''}" onclick="psort='${k}';render()">${t}</button>`).join('') + `<span class="sp"></span><span class="m" style="align-self:center">Squad ${R0.length}/${ROSTER_MAX}, wages ${M(R0.reduce((a, p) => a + wage(p), 0))}/wk</span></div><div class="g pg">`;
    h += R0.map((p, i) => [p, i]).filter(([p]) => pf == 'all' || basePos(sp, p.pos) == pf).sort(sk).map(([p, i]) => { genAttrs(sp, p); const st = STm(p), na = p.inj || p.sus; const con = p.con == null ? 3 : p.con; return `<div class="c pc ${na ? 'inj' : ''} ${tierOf(Math.round(p.o))}" onclick="openP('${pid(p)}')" style="cursor:pointer"><div class="pt"><span class="bd">${p.pos}</span><span class="m role" style="margin:0">${posName(sp, p.pos)} · <b style="color:var(--ink)">${Math.round(p.o)}</b></span><span class="m">age ${p.age}</span>${ids.has(pid(p)) ? '<span class="st">★ starter</span>' : ''}</div><div class="pn">${p.n}${starB(p)}</div><div class="m">🌍 ${p.cn || 'Unknown'} · ${p.ht} cm</div><div class="po"><b>${Math.round(p.o)}</b><span class="m">of ${p.p} potential</span></div>${bars(p.o, p.p)}${attrGrid(sp, p)}<div class="stl"><span class="m">Stamina</span><b>${st}%</b></div><div class="stb"><s style="width:${st}%;background:${stCol(st)}"></s></div><div class="sg2"><span><b>${p.fm ? p.fm.toFixed(1) : '–'}</b>Form</span><span><b>${n(p.ap)}</b>Apps</span><span><b>${n(p.gl)}</b>${GLB[sp.id]}</span><span><b>${n(p.as)}</b>Assists</span><span><b>${n(p.fl)}</b>Fouls</span><span><b>${n(p.yc)}</b>🟨</span></div><div class="m ${na ? 'bad' : ''}">${statusOf(p)} · ${M(wage(p))}/wk</div><div class="m">Contract: ${con} season${con > 1 ? 's' : ''}${con <= 1 ? ' <b class="bad">⚠️ expiring</b>' : ''}</div><div style="display:flex;gap:6px;margin-top:8px" onclick="event.stopPropagation()"><button class="alt" style="flex:1;width:auto;margin:0;padding:6px 4px;font-size:13px" onclick="renew(${i})">Renew</button><button class="alt" style="flex:1;width:auto;margin:0;padding:6px 4px;font-size:13px" onclick="openSell(${i})">Sell</button><button class="alt" style="flex:1;width:auto;margin:0;padding:6px 4px;font-size:13px" onclick="rel(${i})">Release</button></div></div>` }).join('') + `</div>`;
    return h
}
const allC = () => Object.keys(GEO).flatMap(c => Object.keys(GEO[c])), rcn = () => Math.random() < .6 && G && G.geo ? G.geo.k : pick(allC());
let ssOpen = false; const SS = { cn: '', age: '', pos: '', o: '', p: '' };
const ssCap = d => 55 + d.staff.scout * 7, ssNum = x => x === '' || x == null ? null : +x;
const ssCost = q => { const o = ssNum(q.o), pt = ssNum(q.p); return Math.round(600 + (q.cn ? 200 : 0) + (q.age !== '' ? 100 : 0) + (q.pos ? 100 : 0) + (o != null && !isNaN(o) ? o * o / 8 : 0) + (pt != null && !isNaN(pt) ? pt * pt / 16 : 0)) };
function ssToggle() { ssOpen = !ssOpen; render() }
function ssSet(k, v) { SS[k] = v; render() }
function posSelect(sp, cur) {
    if (sp.id == 'soccer') { const groups = [['Goalkeeper', ['GK']], ['Defence', ['SW', 'CB', 'LCB', 'RCB', 'LB', 'RB', 'LWB', 'RWB']], ['Midfield', ['CDM', 'CM', 'LCM', 'RCM', 'CAM', 'LM', 'RM']], ['Attack', ['LW', 'RW', 'CF', 'ST', 'SS']]]; return `<option value="">Any</option>` + groups.map(([g, rs]) => `<optgroup label="${g}">` + rs.map(x => `<option value="${x}" ${cur == x ? 'selected' : ''}>${x} · ${posName(sp, x)}</option>`).join('') + `</optgroup>`).join('') }
    return `<option value="">Any</option>` + POS[sp.id].map(x => `<option value="${x}" ${cur == x ? 'selected' : ''}>${x} · ${posName(sp, x)}</option>`).join('');
}
function ssPanel(sp, d) {
    if (!ssOpen) return ''; const cap = ssCap(d), o = ssNum(SS.o), pt = ssNum(SS.p), est = o != null && !isNaN(o) ? fee({ o, p: Math.max(o, pt == null || isNaN(pt) ? o : pt) }) : null;
    return `<div class="c" style="margin-top:10px"><b>🎯 Scout a specific player</b><div class="m">Leave a box empty and the scouts choose for you. Scout level ${d.staff.scout} can find ratings up to ${cap}.</div><datalist id="cl2">${allC().map(k => `<option value="${k}">`).join('')}</datalist><div class="ssg"><label>Country<input list="cl2" value="${esc(SS.cn)}" placeholder="Any country" autocomplete="off" onchange="ssSet('cn',this.value)"></label><label>Age<input type="number" min="16" max="40" value="${esc(String(SS.age))}" placeholder="Any" onchange="ssSet('age',this.value)"></label><label>Position<select onchange="ssSet('pos',this.value)">${posSelect(sp, SS.pos)}</select></label><label>Rating<input type="number" min="20" max="${cap}" value="${esc(String(SS.o))}" placeholder="Any" onchange="ssSet('o',this.value)"></label><label>Potential<input type="number" min="20" max="99" value="${esc(String(SS.p))}" placeholder="Any" onchange="ssSet('p',this.value)"></label></div><div class="m">Scouting fee <b>${M(ssCost(SS))}</b>${est ? '. Signing this player would cost about <b>' + M(est) + '</b>' : ''}. Found players join the list below.</div><button style="width:auto;margin-top:8px" onclick="ssGo()" ${G.m < ssCost(SS) ? 'disabled' : ''}>Find player for ${M(ssCost(SS))}</button></div>`
}
function ssGo() {
    const sp = cur(), d = G.d[sel], q = SS; let cn = '';
    if (q.cn.trim()) { const h = allC().find(k => k.toLowerCase() == q.cn.trim().toLowerCase()); if (!h) return say('Country not found'); cn = h }
    const age = ssNum(q.age), o = ssNum(q.o), pt = ssNum(q.p), cap = ssCap(d);
    if (age != null && (isNaN(age) || age < 16 || age > 40)) return say('Age must be between 16 and 40');
    if (o != null && (isNaN(o) || o < 20)) return say('Rating must be 20 or more');
    if (o != null && o > cap) return say('Scout level ' + d.staff.scout + ' can only find ratings up to ' + cap + '. Upgrade your Scout.');
    if (pt != null && (isNaN(pt) || pt > 99 || pt < 20)) return say('Potential must be between 20 and 99');
    if (o != null && pt != null && pt < o) return say('Potential cannot be lower than rating');
    if (!pay(ssCost({ ...q, cn }))) return;
    const b = mk(sp, d), oo = o == null ? b.o : Math.max(20, Math.min(cap + 2, Math.round(o + RI(-2, 2)))), pp = pt == null ? Math.max(oo, b.p) : Math.max(oo, Math.min(99, Math.round(pt + RI(-2, 2))));
    const p = { ...b, cn: cn || b.cn, pos: q.pos || b.pos, age: age == null ? b.age : age, o: oo, p: pp, sc: 1, con: 3, wb: 1, fam: {} };
    delete p.a; delete p.ht; genAttrs(sp, p);
    d.mkt.unshift(p); if (d.mkt.length > 12) d.mkt.length = 12; say('Found ' + p.n + ' (' + p.pos + ', ' + Math.round(p.o) + ' / ' + p.p + ')'); save(); render()
}
let drg = null, selB = null;
/* Snap grid: tokens are anchored by their CIRCLE centre (see .pl in style.css). lineup() snaps every default spot to it. */
/* Square 30 x 40 snap grid (pitch is 3:4, so every cell is a square) */
const GX = 30, GY = 40, SNAP_R2 = 25;
const SNX = v => { const c = 100 / GX; return Math.round(Math.min(100 - c, Math.max(c, Math.round(v / c) * c)) * 100) / 100 };
/* Vertical limits: the token's labels (name, code, role, stamina bar) hang ~57px BELOW the circle centre, so the lowest row
   must leave room for them (5 rows = 12.5%); the top limit (2 rows = 5%) keeps the whole circle on the pitch. */
const SNY_MIN = 5, SNY_MAX = 100 - 5 * (100 / GY);
const SNY = v => { const c = 100 / GY; return Math.round(Math.min(SNY_MAX, Math.max(SNY_MIN, Math.round(v / c) * c)) * 100) / 100 };
const pid = p => p.id || (p.id = Math.random().toString(36).slice(2, 9));
/* Nearest slot that currently HAS a player (ignores empty slots) */
function nearSlot(LU, k, gx, gy) {
    let b = null, bd = 1e9;
    LU.forEach(t => {
        if (t.k == k) return;
        if (!t.p) return;
        const v = (t.x - gx) ** 2 + ((t.y - gy) * 4 / 3) ** 2;
        if (v < bd) { bd = v; b = t }
    });
    return { slot: b, dist: bd };
}
function frz(sp, d) { d.as = d.as || {}; d.cp = d.cp || {}; lineup(sp, d).forEach(t => { if (t.p) d.as[t.k] = pid(t.p) }) }

/* ===== Swap-safe drop =====
   Clears source slot when the target is empty, so the auto-fill can re-fill it.
   Also removes any d.as entries pointing at a player who is no longer on the roster. */
function drop(k, gx, gy) {
    const sp = cur(), d = G.d[sel];
    frz(sp, d);
    const LU = lineup(sp, d), a = LU.find(t => t.k == k);
    if (!a) { save(); return }
    const near = nearSlot(LU, k, gx, gy);
    const SWAP_R2 = SNAP_R2;    // must drop essentially on the circle badge
    if (near.slot && near.dist < SWAP_R2) {
        const b = near.slot;
        const paId = a.p ? pid(a.p) : null;
        const pbId = pid(b.p);
        d.as[a.k] = pbId;
        if (paId) d.as[b.k] = paId; else delete d.as[b.k];
    } else {
        /* Free placement: pick the closest real position anchor so center drops = CM, not LCM/RCM */
        let hint = null;
        if (sp.id === 'soccer' && typeof SOCCER_ANCHOR !== 'undefined') {
            let bd = 1e9;
            for (const pos in SOCCER_ANCHOR) {
                const [px, py] = soccerXY(SOCCER_ANCHOR[pos]);
                const v = (px - gx) ** 2 + (py - gy) ** 2;
                if (v < bd) { bd = v; hint = pos }
            }
        }
        d.cp[k] = hint ? [gx, gy, hint] : [gx, gy];
    }
    if (typeof sanitizeLineup === 'function') sanitizeLineup(d);
    save();
}
function tap(k) { const sp = cur(), d = G.d[sel]; if (!selB) { const t = lineup(sp, d).find(x => x.k === k); if (t && t.p) { openP(pid(t.p)); return } return } frz(sp, d); d.as[k] = selB; selB = null; save() }
function autoLU() { const d = G.d[sel]; d.as = {}; d.cp = {}; selB = null; save(); render() }
function clearDragDeltas() { if (!drg || !drg.pit) return; drg.pit.querySelectorAll('.rdlt').forEach(el => el.remove()); drg.pit.querySelectorAll('.pl.ho').forEach(el => el.classList.remove('ho')) }
function addDelta(el, dl) {
    if (!el) return; const em = document.createElement('em'); em.className = 'dl rdlt ' + (dl >= 0 ? 'g' : 'r'); em.textContent = dl > 0 ? '+' + dl : dl < 0 ? '−' + (-dl) : '±0';
    /* inline so no stylesheet can stretch it into a long bar */
    em.style.cssText = 'position:absolute;display:block;box-sizing:border-box;width:auto;min-width:0;max-width:56px;height:auto;left:auto;right:-10px;top:-10px;padding:0 6px;border-radius:9px;background:#fff;font:700 11px/16px Barlow,system-ui,sans-serif;font-style:normal;white-space:nowrap;text-shadow:none;z-index:6;pointer-events:none;color:' + (dl > 0 ? '#0b7a5a' : dl < 0 ? '#c0392b' : '#4a5a6a');
    el.appendChild(em)
}
function showDragDeltas(gx, gy) {
    clearDragDeltas();
    if (!drg || !drg.k) return;
    const sp = cur(), d = G.d[sel], LU = lineup(sp, d);
    const me = LU.find(t => t.k == drg.k);
    if (!me || !me.p) return;
    const near = nearSlot(LU, drg.k, gx, gy);
    if (!near.slot || near.dist >= SNAP_R2) { addDelta(drg.el, 0); return }
    const target = near.slot;
    const myNew = (me.p.o - posPenalty(sp, me.p, target.pos)) * sf(me.p);
    const tgtNew = (target.p.o - posPenalty(sp, target.p, me.pos)) * sf(target.p);
    addDelta(drg.el, Math.round(myNew - me.e));
    const tgtEl = drg.pit.querySelector(`.pl[data-k="${target.k}"]`);
    if (tgtEl) { addDelta(tgtEl, Math.round(tgtNew - target.e)); tgtEl.classList.add('ho') }
}

/* ===== Drag only starts from the circle. Name/code/stamina taps open info, never swap. ===== */
document.addEventListener('pointerdown', e => {
    const circle = e.target.closest && e.target.closest('.pl b');
    if (!circle) return;
    const el = circle.closest('.pl');
    if (!el) return;
    e.preventDefault();
    const cr = circle.getBoundingClientRect();
    drg = { el, pit: el.closest('.pit'), k: el.dataset.k, x0: e.clientX, y0: e.clientY, mv: 0, ox: e.clientX - (cr.left + cr.width / 2), oy: e.clientY - (cr.top + cr.height / 2) };
    drg.pit.classList.add('dr');
    try { el.setPointerCapture(e.pointerId) } catch (x) { }
});
document.addEventListener('pointermove', e => { if (!drg) return; const r = drg.pit.getBoundingClientRect(), x = (e.clientX - drg.ox - r.left) / r.width * 100, y = (e.clientY - drg.oy - r.top) / r.height * 100, sn = drg.pit.querySelector('.snap'); if (Math.abs(e.clientX - drg.x0) + Math.abs(e.clientY - drg.y0) > 5) drg.mv = 1; const sx = SNX(x), sy = SNY(y); drg.el.style.left = sx + '%'; drg.el.style.top = sy + '%'; drg.el.style.zIndex = 5; sn.style.left = sx + '%'; sn.style.top = sy + '%'; if (drg.mv) showDragDeltas(sx, sy) });
document.addEventListener('pointerup', e => { if (!drg) return; const D = drg, r = D.pit.getBoundingClientRect(); drg = null; if (D.mv) drop(D.k, SNX((e.clientX - D.ox - r.left) / r.width * 100), SNY((e.clientY - D.oy - r.top) / r.height * 100)); else tap(D.k); render() });
document.addEventListener('pointercancel', () => { if (drg) { drg = null; render() } });
/* Clicking a player card (except the circle) opens info — never swaps */
document.addEventListener('click', e => {
    if (drg) return;
    if (e.target.closest && e.target.closest('.pl b')) return;
    const pl = e.target.closest && e.target.closest('.pl[data-k]');
    if (!pl) return;
    const k = pl.dataset.k;
    const sp = cur(), d = G.d[sel];
    const t = lineup(sp, d).find(x => x.k === k);
    if (t && t.p) openP(pid(t.p));
});
const GS = { soccer: 1, futsal: 2, hockey: 1, volley: 3, base: 3, basket: 30 }, tm = (d, i) => i ? d.lg[i - 1] : d, pts = t => t.rec.w * 3 + t.rec.d, plc = () => G && G.geo ? GEO[G.geo.c][G.geo.k] : [];
/* score(result, scale, plan): volleyball is counted in SETS (best of 5, so 3-0, 3-1 or 3-2, number of sets from the plan);
   a game decided in overtime / extra innings is always tight; everything else keeps the usual spread. */
const score = (x, k, pl) => {
    if (pl && pl.sets) { const l = pl.sets - 3; return x == 'l' ? [l, 3] : [3, l] }
    let w = RI(1, 3) * k + RI(0, k > 1 ? k - 1 : 1), l;
    if (x == 'd') l = w;
    else if (pl && pl.ot) { const mg = k >= 30 ? RI(1, 6) : k == 3 ? RI(1, 2) : 1; w = Math.max(w, mg + (k == 1 ? 0 : 1)); l = w - mg }
    else l = RI(0, Math.max(0, Math.round(w * .7) - 1));
    return x == 'l' ? [l, w] : [w, l]
};