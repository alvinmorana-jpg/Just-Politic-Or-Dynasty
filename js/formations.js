/* Team-name parts, formations, pitch grid layout, formation groups */
const row = (p, n) => Array(n).fill(p), SUF = ['United', 'City', 'Rovers', 'Athletic', 'Wanderers', 'Town', 'Dynamo', 'Stars'], DAY = 864e5, T0 = Date.UTC(2026, 7, 3);

const FM = {
    soccer: {
        '4-4-2': [['GK'], ['LB', 'LCB', 'RCB', 'RB'], ['LM', 'LCM', 'RCM', 'RM'], ['ST', 'ST']],
        '4-3-3': [['GK'], ['LB', 'LCB', 'RCB', 'RB'], ['LCM', 'CM', 'RCM'], ['LW', 'ST', 'RW']],
        '4-2-3-1': [['GK'], ['LB', 'LCB', 'RCB', 'RB'], ['CDM', 'CDM'], ['LW', 'CAM', 'RW'], ['ST']],
        '4-1-4-1': [['GK'], ['LB', 'LCB', 'RCB', 'RB'], ['CDM'], ['LM', 'LCM', 'RCM', 'RM'], ['ST']],
        '4-4-1-1': [['GK'], ['LB', 'LCB', 'RCB', 'RB'], ['LM', 'LCM', 'RCM', 'RM'], ['SS'], ['ST']],
        '4-5-1': [['GK'], ['LB', 'LCB', 'RCB', 'RB'], ['LM', 'LCM', 'CDM', 'RCM', 'RM'], ['ST']],
        '4-2-4': [['GK'], ['LB', 'LCB', 'RCB', 'RB'], ['LCM', 'RCM'], ['LW', 'ST', 'ST', 'RW']],
        '3-5-2': [['GK'], ['LCB', 'CB', 'RCB'], ['LWB', 'LCM', 'CM', 'RCM', 'RWB'], ['ST', 'ST']],
        '3-4-3': [['GK'], ['LCB', 'CB', 'RCB'], ['LWB', 'LCM', 'RCM', 'RWB'], ['LW', 'ST', 'RW']],
        '5-3-2': [['GK'], ['LWB', 'LCB', 'CB', 'RCB', 'RWB'], ['LCM', 'CM', 'RCM'], ['ST', 'ST']],
        '5-4-1': [['GK'], ['LWB', 'LCB', 'CB', 'RCB', 'RWB'], ['LM', 'LCM', 'RCM', 'RM'], ['ST']],
        '4-4-2 Diamond': [['GK'], ['LB', 'LCB', 'RCB', 'RB'], ['CDM'], ['LCM', 'RCM'], ['CAM'], ['ST', 'ST']],
        '4-3-3 Holding': [['GK'], ['LB', 'LCB', 'RCB', 'RB'], ['CDM'], ['LCM', 'RCM'], ['LW', 'ST', 'RW']],
        '4-3-3 Attacking': [['GK'], ['LB', 'LCB', 'RCB', 'RB'], ['CDM'], ['CAM', 'CAM'], ['LW', 'ST', 'RW']],
        '4-3-3 False 9': [['GK'], ['LB', 'LCB', 'RCB', 'RB'], ['LCM', 'CM', 'RCM'], ['LW', 'CF', 'RW']],
        '3-1-4-2': [['GK'], ['LCB', 'CB', 'RCB'], ['CDM'], ['LM', 'LCM', 'RCM', 'RM'], ['ST', 'ST']],
        '3-4-1-2': [['GK'], ['LCB', 'CB', 'RCB'], ['LM', 'LCM', 'RCM', 'RM'], ['CAM'], ['ST', 'ST']],
        '3-4-2-1': [['GK'], ['LCB', 'CB', 'RCB'], ['LWB', 'LCM', 'RCM', 'RWB'], ['LW', 'RW'], ['ST']],
        '3-4-3 Diamond': [['GK'], ['LCB', 'CB', 'RCB'], ['CDM'], ['LCM', 'RCM'], ['CAM'], ['LW', 'ST', 'RW']],
        '4-2-3-1 Wide': [['GK'], ['LB', 'LCB', 'RCB', 'RB'], ['CDM', 'CDM'], ['LM', 'CAM', 'RM'], ['ST']],
        '4-2-3-1 Deep': [['GK'], ['LB', 'LCB', 'RCB', 'RB'], ['CDM', 'CDM'], ['LCM', 'CM', 'RCM'], ['ST']],
        '4-5-1 Low Block': [['GK'], ['LB', 'LCB', 'RCB', 'RB'], ['CDM', 'LCM', 'CM', 'RCM', 'CDM'], ['ST']],
        '4-2-2-2 Box': [['GK'], ['LB', 'LCB', 'RCB', 'RB'], ['CDM', 'CDM'], ['CAM', 'CAM'], ['ST', 'ST']],
        '3-2-2-3 W-M': [['GK'], ['LB', 'CB', 'RB'], ['LCM', 'RCM'], ['CAM', 'CAM'], ['LW', 'ST', 'RW']],
        '2-3-5 Pyramid': [['GK'], ['LB', 'RB'], ['LCM', 'CM', 'RCM'], ['LW', 'CF', 'ST', 'CF', 'RW']],
        '2-3-2-3 Metodo': [['GK'], ['LCB', 'RCB'], ['LCM', 'CDM', 'RCM'], ['CAM', 'CAM'], ['LW', 'ST', 'RW']],
        '1-3-3-3 Catenaccio': [['GK'], ['SW'], ['LCB', 'CB', 'RCB'], ['LCM', 'CM', 'RCM'], ['LW', 'ST', 'RW']],
        '1-4-3-2 Catenaccio': [['GK'], ['SW'], ['LB', 'LCB', 'RCB', 'RB'], ['LCM', 'CM', 'RCM'], ['ST', 'ST']]
    },
    basket: { Classic: [['PG'], ['SG', 'SF'], ['PF', 'C']], 'Small ball': [['PG'], ['SG', 'SF', 'PF'], ['C']] },
    volley: { Standard: [['OH', 'L', 'OH'], ['MB', 'S', 'MB']], Attack: [['OH', 'L', 'S'], ['OH', 'MB', 'MB']] },
    futsal: { '2-2': [['GK'], ['DF', 'DF'], ['PV', 'FW']], Diamond: [['GK'], ['DF'], ['PV'], ['FW', 'FW']] },
    hockey: { Standard: [['G'], ['D', 'D'], ['LW', 'C', 'RW']], Defensive: [['G'], ['D', 'D', 'C'], ['LW', 'RW']] },
    base: { Standard: [['C'], ['P'], row('IF', 4), row('OF', 3)], 'Deep outfield': [['C'], ['P'], row('IF', 3), row('OF', 4)] }
};
const KO = { soccer: [5, 15, 0], basket: [4, 19, 30], volley: [2, 20, 0], futsal: [3, 19, 0], hockey: [6, 18, 0], base: [6, 13, 0] }, PB = { soccer: '#2f8f46', futsal: '#2d78b8', basket: '#c8914f', volley: '#e0b252', hockey: '#d7edf8', base: '#4a9a3c' };
/* ===== Real-world match rules, per sport =====
   KO = [weekday counted from Monday, hour, minute] of the usual kickoff (soccer Saturday 15:00, basketball Friday night, ...).
   RULES[sport].ph(plan) lists the phases of one match in order. Each phase:
     l = label, m = minutes of REAL elapsed time (stoppages and breaks included, like a TV broadcast),
     c = 'up'  clock counts up from a to b, added time shows as b+n   (soccer)
         'dn'  clock counts down from len minutes                      (basketball, hockey, futsal)
         none  no game clock at all, the label is shown instead         (volleyball sets, baseball innings)
     brk = a break, s = short code shown on the clock, sub = rule reminder shown under a clock-less phase.
   draw = a league match may end level.  otP = chance a level game goes to overtime / extra innings.
   The plan ({ sets, ot }) is rolled once per matchday (see matchPlan) so the live screen and the final score agree. */
const ord = n => n + (n % 10 == 1 && n != 11 ? 'st' : n % 10 == 2 && n != 12 ? 'nd' : n % 10 == 3 && n != 13 ? 'rd' : 'th');
const brk = (l, m, s) => ({ l, m, s, brk: 1 });
const RULES = {
    soccer: {
        draw: true, otP: 0, start: 'Kickoff', end: 'Full time', otName: '',
        info: 'IFAB rules: 2 × 45 min with a 15 min half-time. Referees add stoppage time. League matches can end level.',
        ph: () => [{ l: '1st half', m: 47, c: 'up', a: 0, b: 45 }, brk('Half time', 15, 'HT'), { l: '2nd half', m: 48, c: 'up', a: 45, b: 90 }]
    },
    futsal: {
        draw: true, otP: 0, start: 'Kickoff', end: 'Full time', otName: '',
        info: 'FIFA Futsal Laws: 2 × 20 min on a stopped clock, 15 min half-time, one timeout per team each half. League matches can end level.',
        ph: () => [{ l: '1st half', m: 27, c: 'dn', len: 20 }, brk('Half time', 15, 'HT'), { l: '2nd half', m: 27, c: 'dn', len: 20 }]
    },
    basket: {
        draw: false, otP: .06, start: 'Tip-off', end: 'Final', otName: 'OT',
        info: 'FIBA rules: 4 × 10 min quarters on a stopped clock, 2 min between quarters, 15 min half-time. A tie goes to 5 min overtime, so no draws.',
        ph: p => [{ l: 'Quarter 1', m: 25, c: 'dn', len: 10 }, brk('Quarter break', 2), { l: 'Quarter 2', m: 25, c: 'dn', len: 10 }, brk('Half time', 15, 'HT'), { l: 'Quarter 3', m: 25, c: 'dn', len: 10 }, brk('Quarter break', 2), { l: 'Quarter 4', m: 25, c: 'dn', len: 10 }]
            .concat(p && p.ot ? [brk('Overtime break', 2), { l: 'Overtime', m: 8, c: 'dn', len: 5 }] : [])
    },
    volley: {
        draw: false, otP: 0, start: 'First serve', end: 'Final', otName: '',
        info: 'FIVB rules: best of 5 sets. Sets 1–4 go to 25 points, the 5th to 15, always win by 2. No game clock, 3 min between sets, so no draws.',
        ph: p => { const n = (p && p.sets) || 3, out = []; for (let i = 1; i <= n; i++) { if (i > 1) out.push(brk('Set break', 3)); out.push({ l: 'Set ' + i, m: i == 5 ? 17 : 27, sub: i == 5 ? 'Deciding set: first to 15, win by 2' : 'First to 25, win by 2' }) } return out }
    },
    hockey: {
        draw: false, otP: .23, start: 'Puck drop', end: 'Final', otName: 'OT',
        info: 'IIHF / NHL rules: 3 × 20 min on a stopped clock with 15 min intermissions. A tie goes to 5 min sudden-death overtime, then a shootout, so no draws.',
        ph: p => [{ l: 'Period 1', m: 40, c: 'dn', len: 20 }, brk('Intermission', 15), { l: 'Period 2', m: 40, c: 'dn', len: 20 }, brk('Intermission', 15), { l: 'Period 3', m: 40, c: 'dn', len: 20 }]
            .concat(p && p.ot ? [brk('Overtime break', 2), { l: 'Overtime', m: 8, c: 'dn', len: 5 }] : [])
    },
    base: {
        draw: false, otP: .09, start: 'First pitch', end: 'Final', otName: 'extra innings',
        info: 'MLB / WBSC rules: 9 innings, each split into a top and a bottom half, with no game clock. A tie goes to extra innings, so no draws.',
        ph: p => { const n = p && p.ot ? 10 : 9, out = []; for (let i = 1; i <= n; i++) { const sub = i > 9 ? 'Extra innings' : 'Inning ' + i + ' of 9'; out.push({ l: 'Top ' + ord(i), m: 9, sub }, { l: 'Bottom ' + ord(i), m: 9, sub }) } return out }
    }
};
/* Level games: volleyball always needs 3, 4 or 5 sets (real-world split about 38 / 36 / 26 %) */
function rollPlan(sp) {
    const R0 = RULES[sp.id]; let sets = 0;
    if (sp.id == 'volley') { const r = Math.random(); sets = r < .38 ? 3 : r < .74 ? 4 : 5 }
    return { sets, ot: !R0.draw && Math.random() < (R0.otP || 0) };
}
/* The plan of YOUR match this matchday: rolled once, kept in the save, so the live screen never contradicts the result. */
function matchPlan(sp) {
    G.plan = G.plan || {};
    let p = G.plan[sp.id];
    if (!p || p.w !== G.w) p = G.plan[sp.id] = Object.assign({ w: G.w }, rollPlan(sp));
    return p;
}
const matchDur = (sp, plan) => RULES[sp.id].ph(plan || matchPlan(sp)).reduce((a, p) => a + p.m, 0) * 6e4;
/* What the scoreboard shows `elMs` milliseconds after the start. */
function matchState(sp, elMs, plan) {
    const ph = RULES[sp.id].ph(plan), el = elMs / 6e4; let t = 0;
    for (const p of ph) {
        if (el < t + p.m) {
            const em = el - t; let clock;
            if (p.brk) clock = p.s || 'Break';
            else if (p.c == 'up') { const reg = p.b - p.a; clock = em <= reg ? Math.min(p.b, Math.floor(p.a + em) + 1) + "'" : p.b + '+' + Math.ceil(em - reg) + "'" }
            else if (p.c == 'dn') { const sec = Math.max(0, Math.ceil(p.len * 60 * (1 - em / p.m))); clock = Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0') }
            else clock = p.l;
            return { clock, phase: p.l, sub: p.sub || '', brk: !!p.brk }
        }
        t += p.m
    }
    return null
}
let S = { c: 'Asia', k: 'Philippines', r: 'Bicol', n: '', sp: 'soccer' };
const COL = { 1: [50], 2: [30, 70], 3: [20, 50, 80], 4: [20, 40, 60, 80], 5: [10, 30, 50, 70, 90] }, ROW = { 1: [50], 2: [70, 30], 3: [80, 50, 20], 4: [90, 70, 40, 20], 5: [90, 70, 50, 30, 10] };
for (let n = 6; n <= 12; n++) { COL[n] = Array.from({ length: n }, (_, i) => Math.round(10 + 80 * i / (n - 1))); ROW[n] = Array.from({ length: n }, (_, i) => Math.round(90 - 80 * i / (n - 1))); }
Object.assign(FM.basket, { Triangle: [['PG'], ['SG', 'SF'], ['PF'], ['C']], 'Twin towers': [['PG'], ['SG'], ['SF'], ['PF', 'C']], 'Five out': [['PG', 'SG'], ['SF', 'PF'], ['C']] });
Object.assign(FM.volley, { '6-2': [['OH', 'L', 'OH'], ['S', 'MB', 'S']], 'Triple block': [['L', 'OH', 'S'], ['MB', 'MB', 'MB']], 'Wide attack': [['OH', 'OH', 'L'], ['OH', 'S', 'MB']] });
Object.assign(FM.futsal, { Box: [['GK'], ['DF', 'DF'], ['FW', 'FW']], '3-1': [['GK'], ['DF', 'DF', 'DF'], ['FW']], '1-2-1': [['GK'], ['DF'], ['PV', 'PV'], ['FW']] });
Object.assign(FM.hockey, { Trap: [['G'], ['D', 'D'], ['C'], ['LW', 'RW']], Forecheck: [['G'], ['D'], ['C', 'C'], ['LW', 'RW']], Overload: [['G'], ['D'], ['LW', 'RW'], ['C', 'C']] });
Object.assign(FM.base, { 'Infield in': [['C'], ['P'], row('IF', 5), row('OF', 2)], 'Double shift': [['C'], ['P'], row('IF', 2), row('IF', 2), row('OF', 3)], 'Wall outfield': [['C'], ['P'], row('IF', 2), row('OF', 5)] });
Object.assign(FM.basket, { 'Two-guard': [['PG', 'SG'], ['SF', 'PF', 'C']], 'Run and gun': [['PG', 'SG'], ['SF', 'PF', 'SF']], 'Paint lock': [['SG'], ['SF'], ['PF', 'C', 'C']] });
Object.assign(FM.volley, { Power: [['OH', 'OH', 'S'], ['OH', 'MB', 'OH']], 'Block wall': [['L', 'L', 'OH'], ['MB', 'S', 'MB']], 'Libero double': [['L', 'OH', 'L'], ['MB', 'S', 'MB']] });
Object.assign(FM.futsal, { '1-3': [['GK'], ['DF'], ['PV', 'FW', 'FW']], '2-1-1': [['GK'], ['DF', 'PV'], ['FW'], ['FW']] });
Object.assign(FM.hockey, { 'Two-way': [['G'], ['D', 'C'], ['LW', 'C', 'RW']], Aggressive: [['G'], ['D'], ['LW', 'C', 'RW', 'C']], 'Power play': [['G'], ['D'], ['LW', 'RW'], ['C', 'C']] });
Object.assign(FM.base, { Slugger: [['C'], ['P'], row('IF', 2), row('OF', 5)], 'Infield shift': [['C'], ['P'], row('IF', 5), row('OF', 2)] });
const FS = { soccer: { Offense: ['4-3-3', '3-4-3', '4-2-4'], Defence: ['5-3-2', '5-4-1', '4-5-1'], Balance: ['4-4-2', '3-5-2', '4-2-3-1', '4-1-4-1', '4-4-1-1'] }, basket: { Offense: ['Small ball', 'Run and gun', 'Five out'], Defence: ['Twin towers', 'Paint lock'], Balance: ['Classic', 'Two-guard', 'Triangle'] }, volley: { Offense: ['Attack', 'Power', 'Wide attack'], Defence: ['Block wall', 'Libero double', 'Triple block'], Balance: ['Standard', '6-2'] }, futsal: { Offense: ['1-3', '2-1-1'], Defence: ['3-1', 'Box'], Balance: ['2-2', 'Diamond', '1-2-1'] }, hockey: { Offense: ['Aggressive', 'Power play', 'Forecheck', 'Overload'], Defence: ['Defensive', 'Trap'], Balance: ['Standard', 'Two-way'] }, base: { Offense: ['Slugger'], Defence: ['Deep outfield', 'Infield shift', 'Wall outfield', 'Infield in'], Balance: ['Standard', 'Double shift'] } };
FS.soccer.Offense.push('4-3-3 Holding', '4-3-3 Attacking', '4-3-3 False 9', '3-4-2-1', '3-4-3 Diamond', '3-2-2-3 W-M', '2-3-5 Pyramid');
FS.soccer.Defence.push('4-5-1 Low Block', '4-2-2-2 Box', '1-3-3-3 Catenaccio', '1-4-3-2 Catenaccio');
FS.soccer.Balance.push('4-4-2 Diamond', '3-1-4-2', '3-4-1-2', '4-2-3-1 Wide', '4-2-3-1 Deep', '2-3-2-3 Metodo');

/* Soccer role anchors, taken from the EPL positions chart (x = depth 0-100 from own goal, y = left→right across the pitch).
   Rotated so the team attacks up the screen: pitch x = chart y, pitch y = 90 - (chart x - 5) * .94 */
const SOCCER_ANCHOR = { GK: [5, 50], SW: [12.4, 50], CB: [20, 50], LCB: [20, 33], RCB: [20, 67], LB: [20, 14], RB: [20, 87], LWB: [29, 14], RWB: [29, 87], CDM: [40, 50], CM: [49.5, 50], LCM: [49, 33], RCM: [49.5, 67], LM: [49, 18], RM: [49, 83], CAM: [59.6, 50], LW: [72, 18], RW: [72, 83], SS: [72, 50], CF: [80, 50], ST: [89.5, 50] };
function soccerXY(a, cnt) {
    const [dx, dy] = a, y = Math.round(90 - (dx - 5) * .94);
    let x = dy;
    return [x, y]
}
