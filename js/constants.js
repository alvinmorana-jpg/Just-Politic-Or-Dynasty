/* Sports, roles, attributes, staff, names, league ladder */
const SP = [{ id: 'soccer', n: 'Soccer', e: '⚽', s: 11, c: 0 }, { id: 'basket', n: 'Basketball', e: '🏀', s: 5, c: 15000 }, { id: 'volley', n: 'Volleyball', e: '🏐', s: 6, c: 25000 }, { id: 'futsal', n: 'Futsal', e: '🥅', s: 5, c: 40000 }, { id: 'hockey', n: 'Hockey', e: '🏒', s: 6, c: 60000 }, { id: 'base', n: 'Baseball', e: '⚾', s: 9, c: 90000 }];

/* ===== Season length: 34 matchdays, one every 10 days = ~10 months ===== */
const SEASON = 34;
const TEAMS = 18;
const MD_DAYS = 10;
const PROMOTE = 3;
const RELEGATE = 3;
const CUP_CYCLE = 4;

const SOCCER_ROLES = ['GK', 'SW', 'CB', 'LCB', 'RCB', 'LB', 'RB', 'LWB', 'RWB', 'CDM', 'CM', 'LCM', 'RCM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'CF', 'ST', 'SS'];
const POS = { soccer: ['GK', 'DF', 'MF', 'FW'], basket: ['PG', 'SG', 'SF', 'PF', 'C'], volley: ['S', 'OH', 'MB', 'L'], futsal: ['GK', 'DF', 'PV', 'FW'], hockey: ['G', 'D', 'LW', 'C', 'RW'], base: ['P', 'C', 'IF', 'OF'] };
const ROLES = { soccer: SOCCER_ROLES, basket: ['PG', 'SG', 'SF', 'PF', 'C'], volley: ['S', 'OH', 'MB', 'L'], futsal: ['GK', 'DF', 'PV', 'FW'], hockey: ['G', 'D', 'LW', 'C', 'RW'], base: ['P', 'C', 'IF', 'OF'] };
const PN = {
    soccer: { GK: 'Goalkeeper', DF: 'Defender', MF: 'Midfielder', FW: 'Forward', SW: 'Sweeper', CB: 'Center Back', LCB: 'Left Center Back', RCB: 'Right Center Back', LB: 'Left Back', RB: 'Right Back', LWB: 'Left Wing Back', RWB: 'Right Wing Back', CDM: 'Defensive Mid', CM: 'Central Mid', LCM: 'Left Central Mid', RCM: 'Right Central Mid', CAM: 'Attacking Mid', LM: 'Left Mid', RM: 'Right Mid', LW: 'Left Wing', RW: 'Right Wing', CF: 'Center Forward', ST: 'Striker', SS: 'Second Striker' },
    basket: { PG: 'Point Guard', SG: 'Shooting Guard', SF: 'Small Forward', PF: 'Power Forward', C: 'Center' },
    volley: { S: 'Setter', OH: 'Outside Hitter', MB: 'Middle Blocker', L: 'Libero' },
    futsal: { GK: 'Goalkeeper', DF: 'Defender', PV: 'Pivot', FW: 'Forward' },
    hockey: { G: 'Goalkeeper', D: 'Defender', LW: 'Left Wing', C: 'Center', RW: 'Right Wing' },
    base: { P: 'Pitcher', C: 'Catcher', IF: 'Infielder', OF: 'Outfielder' }
};
const posName = (sp, p) => (PN[sp.id] && PN[sp.id][p]) || p;
const ROLE_BASE = {
    soccer: { GK: 'GK', SW: 'DF', CB: 'DF', LCB: 'DF', RCB: 'DF', LB: 'DF', RB: 'DF', LWB: 'DF', RWB: 'DF', CDM: 'MF', CM: 'MF', LCM: 'MF', RCM: 'MF', CAM: 'MF', LM: 'MF', RM: 'MF', LW: 'FW', RW: 'FW', CF: 'FW', ST: 'FW', SS: 'FW' },
    basket: { PG: 'PG', SG: 'SG', SF: 'SF', PF: 'PF', C: 'C' },
    volley: { S: 'S', OH: 'OH', MB: 'MB', L: 'L' },
    futsal: { GK: 'GK', DF: 'DF', PV: 'PV', FW: 'FW' },
    hockey: { G: 'G', D: 'D', LW: 'LW', C: 'C', RW: 'RW' },
    base: { P: 'P', C: 'C', IF: 'IF', OF: 'OF' }
};
function basePos(sp, pos) { return (ROLE_BASE[sp.id] && ROLE_BASE[sp.id][pos]) || pos }

const ATTR_KEYS = ['SPD', 'SHT', 'SPR', 'DEF', 'POS', 'CRD', 'STR', 'STA'];
const ATTR_LABEL = {
    soccer: { SPD: 'Speed', SHT: 'Shooting', SPR: 'Sprinting', DEF: 'Defense', POS: 'Positioning', CRD: 'Coordination', STR: 'Strength', STA: 'Stamina' },
    basket: { SPD: 'Speed', SHT: 'Shooting', SPR: 'Sprinting', DEF: 'Defense', POS: 'Positioning', CRD: 'Coordination', STR: 'Strength', STA: 'Stamina' },
    volley: { SPD: 'Speed', SHT: 'Spike', SPR: 'Sprinting', DEF: 'Block', POS: 'Positioning', CRD: 'Setting', STR: 'Strength', STA: 'Stamina' },
    futsal: { SPD: 'Speed', SHT: 'Shooting', SPR: 'Sprinting', DEF: 'Defense', POS: 'Positioning', CRD: 'Coordination', STR: 'Strength', STA: 'Stamina' },
    hockey: { SPD: 'Speed', SHT: 'Shooting', SPR: 'Sprinting', DEF: 'Defense', POS: 'Positioning', CRD: 'Stick Handling', STR: 'Strength', STA: 'Stamina' },
    base: { SPD: 'Speed', SHT: 'Hitting', SPR: 'Sprinting', DEF: 'Fielding', POS: 'Positioning', CRD: 'Throwing', STR: 'Strength', STA: 'Stamina' }
};
const W = {
    soccer: { GK: { SPD: .3, SHT: .1, SPR: .2, DEF: .95, POS: .95, CRD: .5, STR: .7, STA: .6 }, SW: { SPD: .5, SHT: .2, SPR: .5, DEF: .98, POS: .95, CRD: .6, STR: .8, STA: .75 }, CB: { SPD: .55, SHT: .2, SPR: .55, DEF: .98, POS: .92, CRD: .5, STR: .95, STA: .8 }, LCB: { SPD: .6, SHT: .25, SPR: .6, DEF: .95, POS: .9, CRD: .55, STR: .9, STA: .8 }, RCB: { SPD: .6, SHT: .25, SPR: .6, DEF: .95, POS: .9, CRD: .55, STR: .9, STA: .8 }, LB: { SPD: .85, SHT: .3, SPR: .85, DEF: .88, POS: .8, CRD: .7, STR: .7, STA: .9 }, RB: { SPD: .85, SHT: .3, SPR: .85, DEF: .88, POS: .8, CRD: .7, STR: .7, STA: .9 }, LWB: { SPD: .95, SHT: .4, SPR: .95, DEF: .7, POS: .75, CRD: .8, STR: .6, STA: .95 }, RWB: { SPD: .95, SHT: .4, SPR: .95, DEF: .7, POS: .75, CRD: .8, STR: .6, STA: .95 }, CDM: { SPD: .7, SHT: .4, SPR: .7, DEF: .9, POS: .9, CRD: .85, STR: .85, STA: .95 }, CM: { SPD: .75, SHT: .55, SPR: .8, DEF: .72, POS: .82, CRD: .95, STR: .65, STA: .95 }, LCM: { SPD: .8, SHT: .65, SPR: .8, DEF: .65, POS: .8, CRD: .92, STR: .6, STA: .95 }, RCM: { SPD: .8, SHT: .65, SPR: .8, DEF: .65, POS: .8, CRD: .92, STR: .6, STA: .95 }, CAM: { SPD: .8, SHT: .85, SPR: .8, DEF: .4, POS: .9, CRD: .98, STR: .55, STA: .85 }, LM: { SPD: .9, SHT: .65, SPR: .9, DEF: .55, POS: .8, CRD: .85, STR: .6, STA: .9 }, RM: { SPD: .9, SHT: .65, SPR: .9, DEF: .55, POS: .8, CRD: .85, STR: .6, STA: .9 }, LW: { SPD: .98, SHT: .85, SPR: .95, DEF: .35, POS: .85, CRD: .85, STR: .6, STA: .85 }, RW: { SPD: .98, SHT: .85, SPR: .95, DEF: .35, POS: .85, CRD: .85, STR: .6, STA: .85 }, CF: { SPD: .85, SHT: .92, SPR: .85, DEF: .35, POS: .9, CRD: .85, STR: .75, STA: .85 }, ST: { SPD: .9, SHT: .98, SPR: .9, DEF: .3, POS: .9, CRD: .75, STR: .8, STA: .85 }, SS: { SPD: .9, SHT: .9, SPR: .9, DEF: .4, POS: .9, CRD: .88, STR: .65, STA: .85 } },
    basket: { PG: { SPD: .95, SHT: .75, SPR: .95, DEF: .7, POS: .85, CRD: .95, STR: .5, STA: .95 }, SG: { SPD: .85, SHT: .95, SPR: .85, DEF: .65, POS: .8, CRD: .7, STR: .6, STA: .85 }, SF: { SPD: .8, SHT: .8, SPR: .8, DEF: .8, POS: .75, CRD: .75, STR: .75, STA: .85 }, PF: { SPD: .6, SHT: .6, SPR: .6, DEF: .9, POS: .75, CRD: .55, STR: .95, STA: .8 }, C: { SPD: .5, SHT: .5, SPR: .5, DEF: .95, POS: .8, CRD: .45, STR: .98, STA: .75 } },
    volley: { S: { SPD: .7, SHT: .5, SPR: .7, DEF: .5, POS: .95, CRD: .98, STR: .5, STA: .85 }, OH: { SPD: .85, SHT: .95, SPR: .85, DEF: .65, POS: .8, CRD: .6, STR: .8, STA: .85 }, MB: { SPD: .55, SHT: .7, SPR: .55, DEF: .98, POS: .8, CRD: .45, STR: .85, STA: .8 }, L: { SPD: .95, SHT: .3, SPR: .95, DEF: .95, POS: .9, CRD: .7, STR: .4, STA: .9 } },
    futsal: { GK: { SPD: .4, SHT: .2, SPR: .4, DEF: .95, POS: .95, CRD: .6, STR: .6, STA: .6 }, DF: { SPD: .75, SHT: .4, SPR: .75, DEF: .95, POS: .85, CRD: .8, STR: .75, STA: .8 }, PV: { SPD: .7, SHT: .9, SPR: .7, DEF: .5, POS: .95, CRD: .85, STR: .9, STA: .8 }, FW: { SPD: .95, SHT: .95, SPR: .9, DEF: .4, POS: .85, CRD: .85, STR: .6, STA: .85 } },
    hockey: { G: { SPD: .5, SHT: .2, SPR: .5, DEF: .95, POS: .95, CRD: .6, STR: .7, STA: .7 }, D: { SPD: .7, SHT: .5, SPR: .7, DEF: .95, POS: .85, CRD: .7, STR: .85, STA: .85 }, LW: { SPD: .95, SHT: .9, SPR: .9, DEF: .5, POS: .8, CRD: .85, STR: .65, STA: .85 }, C: { SPD: .85, SHT: .85, SPR: .85, DEF: .65, POS: .9, CRD: .9, STR: .7, STA: .9 }, RW: { SPD: .95, SHT: .9, SPR: .9, DEF: .5, POS: .8, CRD: .85, STR: .65, STA: .85 } },
    base: { P: { SPD: .5, SHT: .4, SPR: .5, DEF: .9, POS: .9, CRD: .85, STR: .7, STA: .75 }, C: { SPD: .5, SHT: .6, SPR: .5, DEF: .95, POS: .85, CRD: .85, STR: .8, STA: .7 }, IF: { SPD: .85, SHT: .75, SPR: .85, DEF: .85, POS: .8, CRD: .8, STR: .65, STA: .85 }, OF: { SPD: .95, SHT: .85, SPR: .9, DEF: .65, POS: .75, CRD: .7, STR: .7, STA: .85 } }
};
const HT = {
    soccer: { GK: [187, 200], SW: [180, 192], CB: [182, 195], LCB: [182, 195], RCB: [182, 195], LB: [170, 183], RB: [170, 183], LWB: [170, 185], RWB: [170, 185], CDM: [178, 190], CM: [172, 185], LCM: [172, 185], RCM: [172, 185], CAM: [170, 183], LM: [172, 185], RM: [172, 185], LW: [170, 183], RW: [170, 183], CF: [178, 190], ST: [175, 192], SS: [172, 185] },
    basket: { PG: [183, 193], SG: [190, 200], SF: [198, 208], PF: [203, 213], C: [208, 220] },
    volley: { S: [185, 200], OH: [190, 208], MB: [198, 213], L: [170, 183] },
    futsal: { GK: [178, 192], DF: [172, 185], PV: [178, 192], FW: [168, 182] },
    hockey: { G: [175, 190], D: [178, 192], LW: [172, 185], C: [175, 188], RW: [172, 185] },
    base: { P: [185, 200], C: [178, 192], IF: [175, 190], OF: [178, 193] }
};
function genAttrs(sp, p) {
    if (p.a && p.ht) return p;
    const w = (W[sp.id] && W[sp.id][p.pos]) || (W[sp.id] && W[sp.id][basePos(sp, p.pos)]) || {};
    p.a = {};
    const base = p.o || 50;
    ATTR_KEYS.forEach(k => { const wt = w[k] == null ? .5 : w[k]; p.a[k] = Math.max(20, Math.min(99, Math.round(base * (0.55 + 0.5 * wt) + R(-4, 4)))) });
    const hr = (HT[sp.id] && HT[sp.id][p.pos]) || (HT[sp.id] && HT[sp.id][basePos(sp, p.pos)]) || [170, 195];
    p.ht = RI(hr[0], hr[1]);
    return p;
}
function attrGrid(sp, p, compact) {
    const L = ATTR_LABEL[sp.id] || ATTR_LABEL.soccer;
    const keys = compact ? ['SPD', 'SHT', 'DEF', 'STA'] : ATTR_KEYS;
    return `<div class="attrg">` + keys.map(k => `<div><span title="${L[k] || k}">${k}</span><b>${p.a[k]}</b></div>`).join('') + `</div>` + (compact ? '' : `<div class="htl"><span class="m">Height</span><b>${p.ht} cm</b></div>`);
}
function attrLegend(sp) { const L = ATTR_LABEL[sp.id] || ATTR_LABEL.soccer; return `<div class="c" style="margin-bottom:10px"><b>Attribute guide</b><div class="legend">` + ATTR_KEYS.map(k => `<span><b>${k}</b> ${L[k]}</span>`).join('') + `<span><b>HGT</b> Height (cm)</span></div></div>` }
function roleLegend(sp) {
    const list = ROLES[sp.id] || [];
    if (sp.id == 'soccer') { const groups = [['Goalkeeper', ['GK']], ['Defence', ['SW', 'CB', 'LCB', 'RCB', 'LB', 'RB', 'LWB', 'RWB']], ['Midfield', ['CDM', 'CM', 'LCM', 'RCM', 'CAM', 'LM', 'RM']], ['Attack', ['LW', 'RW', 'CF', 'ST', 'SS']]]; return `<div class="c" style="margin-bottom:10px"><b>Soccer positions</b><div class="legend">` + groups.map(([g, rs]) => `<span class="grp">${g}</span>` + rs.map(p => `<span><b>${p}</b> ${posName(sp, p)}</span>`).join('')).join('') + `</div></div>` }
    return `<div class="c" style="margin-bottom:10px"><b>Position roles</b><div class="legend">` + list.map(p => `<span><b>${p}</b> ${posName(sp, p)}</span>`).join('') + `</div></div>`;
}

const STAFF = [['coach', 'Head Coach', '🧑‍🏫', 'Players grow faster'], ['fit', 'Fitness Coach', '💪', 'Better match form'], ['phys', 'Physio', '🩺', 'Fewer, shorter injuries'], ['scout', 'Scout', '🔭', 'Stronger recruits']];
const STAFF_NAME = { coach: 'Head Coach', fit: 'Fitness Coach', phys: 'Physio', scout: 'Scout' };
/* Real-world job titles: baseball clubs are run by a Manager, and North American sports call the physio an Athletic Trainer. */
const staffName = (sp, k) => (k == 'coach' && sp.id == 'base') ? 'Manager' : (k == 'phys' && ['basket', 'hockey', 'base'].includes(sp.id)) ? 'Athletic Trainer' : STAFF_NAME[k];
const FN = 'Alex Ben Carlos Dion Eli Finn Gus Hiro Ivan Jae Kai Leo Mateo Niko Omar Pablo Rafa Sam Teo Vik Wes Yuri Zane'.split(' '), LN = 'Reyes Cruz Santos Tanaka Silva Novak Okoye Moreau Costa Park Rossi Diaz Kim Bauer Ito Vega Lopez Marsh'.split(' ');
const R = (a, b) => a + Math.random() * (b - a), RI = (a, b) => Math.floor(R(a, b + 1)), pick = a => a[RI(0, a.length - 1)], M = n => '$' + Math.round(n).toLocaleString();
const wage = p => Math.round(p.o * p.o / 50 * (p.wb || 1)), fee = p => Math.round(p.o * p.o / 2 * (1 + (p.p - p.o) / 50)), lv = n => '■'.repeat(n) + '□'.repeat(5 - n);
const LG = [['Village', 3], ['City', 4], ['Province', 8], ['Region', 10], ['National', 4], ['Country', 3], ['Continental', 2], ['World', 1]], RN = 'I II III IV V VI VII VIII IX X'.split(' '), LAD = []; LG.forEach(([n, c]) => { for (let i = c; i > 0; i--)LAD.push(n == 'World' ? 'World League' : n + ' ' + RN[i - 1]) });
const MATCH_PRIZE = lv => 500 + lv * 250;
const ROSTER_MAX = 30;
let G, sel = 'soccer';

/* ===== Specialist coaches: each raises one attribute's growth rate, up to 7 stars =====
   Every sport has its own staff, named like the real job (Setting Coach in volleyball, Pitching Coach in baseball, ...).
   The keys are stable because saves store stars under them. Key 'gk' is the POSITION SPECIALIST slot: it trains every
   attribute, but only for the base positions in `pos` (goalkeepers, goalies, liberos, pitchers, big men). */
const CO = (k, n, e, attr, pos) => ({ k, n, e, attr, pos });
const SOCCER_COACHES = [CO('attack', 'Attacking Coach', '⚔️', 'SHT'), CO('defense', 'Defensive Coach', '🛡️', 'DEF'), CO('positioning', 'Positioning Coach', '🧭', 'POS'), CO('coordination', 'Coordination Coach', '🎯', 'CRD'), CO('gk', 'Goalkeeper Coach', '🧤', 'ALL', ['GK']), CO('speed', 'Speed Coach', '⚡', 'SPD'), CO('strength', 'Strength Coach', '💪', 'STR'), CO('stamina', 'Stamina Coach', '🔋', 'STA')];
const COACHES = {
    soccer: SOCCER_COACHES,
    futsal: SOCCER_COACHES,
    basket: [CO('attack', 'Shooting Coach', '🏀', 'SHT'), CO('defense', 'Defensive Coach', '🛡️', 'DEF'), CO('positioning', 'Positioning Coach', '🧭', 'POS'), CO('coordination', 'Ball-Handling Coach', '🎯', 'CRD'), CO('gk', 'Big Man Coach', '🗼', 'ALL', ['C', 'PF']), CO('speed', 'Speed Coach', '⚡', 'SPD'), CO('strength', 'Strength Coach', '💪', 'STR'), CO('stamina', 'Stamina Coach', '🔋', 'STA')],
    volley: [CO('attack', 'Hitting Coach', '⚔️', 'SHT'), CO('defense', 'Blocking Coach', '🛡️', 'DEF'), CO('positioning', 'Positioning Coach', '🧭', 'POS'), CO('coordination', 'Setting Coach', '🎯', 'CRD'), CO('gk', 'Libero Coach', '🧤', 'ALL', ['L']), CO('speed', 'Speed Coach', '⚡', 'SPD'), CO('strength', 'Strength Coach', '💪', 'STR'), CO('stamina', 'Stamina Coach', '🔋', 'STA')],
    hockey: [CO('attack', 'Shooting Coach', '⚔️', 'SHT'), CO('defense', 'Defensive Coach', '🛡️', 'DEF'), CO('positioning', 'Positioning Coach', '🧭', 'POS'), CO('coordination', 'Stick-Handling Coach', '🎯', 'CRD'), CO('gk', 'Goaltending Coach', '🧤', 'ALL', ['G']), CO('speed', 'Skating Coach', '⚡', 'SPD'), CO('strength', 'Strength Coach', '💪', 'STR'), CO('stamina', 'Stamina Coach', '🔋', 'STA')],
    base: [CO('attack', 'Hitting Coach', '⚔️', 'SHT'), CO('defense', 'Fielding Coach', '🛡️', 'DEF'), CO('positioning', 'Positioning Coach', '🧭', 'POS'), CO('coordination', 'Throwing Coach', '🎯', 'CRD'), CO('gk', 'Pitching Coach', '⚾', 'ALL', ['P']), CO('speed', 'Baserunning Coach', '⚡', 'SPD'), CO('strength', 'Strength Coach', '💪', 'STR'), CO('stamina', 'Stamina Coach', '🔋', 'STA')]
};
const plural = s => /[sx]$/.test(s) ? s + 'es' : s + 's';
/* The sport's specialists with a description built from the sport's own attribute names (Spike, Block, Setting, Hitting, ...) */
function coachList(sp) {
    const L = ATTR_LABEL[sp.id] || ATTR_LABEL.soccer;
    return (COACHES[sp.id] || SOCCER_COACHES).map(c => Object.assign({}, c, {
        desc: c.pos ? 'Speeds up every attribute, but only for ' + c.pos.map(p => plural(posName(sp, p))).join(' and ') + '.'
            : c.attr == 'SPD' ? 'Speeds up ' + L.SPD + ' and ' + L.SPR + ' growth for the whole squad.'
                : 'Speeds up ' + L[c.attr] + ' growth for the whole squad.'
    }));
}
const COACH_MAX = 7;
const coachCost = stars => Math.round(800 * 1.9 ** stars);