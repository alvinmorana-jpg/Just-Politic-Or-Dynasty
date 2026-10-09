const B = [['farm', '🌾', 'Farms', 'Food +12% per level', 100], ['factory', '🏭', 'Factories', 'More income, less happiness', 130], ['market', '🛒', 'Markets', 'Steady income', 100], ['school', '🏫', 'Schools', 'Education → income', 110], ['hospital', '🏥', 'Hospitals', 'Happiness & population growth', 110], ['road', '🛣️', 'Roads', 'Boosts all income', 120], ['guard', '🛡️', 'Security', 'Order and stability', 90], ['mining', '⛏️', 'Mining', 'Big income, but hurts happiness and drains ore reserves', 140], ['logging', '🪵', 'Logging', 'Steady income; clears forest (it regrows slowly)', 100],
['datacenter', '💾', 'Data Centers', 'Big income & development (runs at 60% without a Power Plant)', 160], ['power', '🔌', 'Power Plants', 'Boosts income and powers Data Centers; −1 happy each', 140], ['port', '⚓', 'Seaports', 'Trade income and fish catch (+food)', 130], ['university', '🎓', 'Universities', 'Development, education and income', 150], ['resort', '🏨', 'Resorts & Hotels', 'Tourism income and a little happiness', 120]];
// Build tab sectors: pick one to filter, or show all grouped.
let BSEC = 'all';
const SECT = [['blue', '🧰 Blue Collar Jobs', 'Farms, factories, mines, ports and power', ['farm', 'factory', 'mining', 'logging', 'port', 'power']], ['white', '💼 White Collar Jobs', 'Offices, trade, tech and research', ['market', 'datacenter', 'university']], ['pub', '🏛️ Public Services', 'Schools, hospitals, roads and security', ['school', 'hospital', 'road', 'guard']], ['tour', '🏝️ Tourism & Leisure', 'Hotels and resorts', ['resort']]];
const secChips = () => `<div style="display:flex;flex-wrap:wrap;gap:4px;margin:6px 0">${[['all', 'All']].concat(SECT.map(q => [q[0], q[1]])).map(([k, n]) => `<button class="${BSEC == k ? 'p' : ''}" style="padding:4px 8px" onclick="BSEC='${k}';ui()">${n}</button>`).join('')}</div>`;
// Reach level 4 (★) in any building and it becomes your province's own specialization, with a permanent bonus.
const SPZ = {
    farm: ['🌾 Breadbasket', { food: .08 }], factory: ['🏭 Industrial Hub', { inc: .05 }], market: ['🛒 Trade Capital', { inc: .04, hap: 1 }], school: ['🏫 Education Province', { dev: 2, hap: 1 }], hospital: ['🏥 Health Haven', { hap: 2, pop: .002 }],
    road: ['🛣️ Transport Crossroads', { inc: .04, dev: 1 }], guard: ['🛡️ Fortress Province', { thr: -.3 }], mining: ['⛏️ Mining Powerhouse', { inc: .05 }], logging: ['🪵 Timber Country', { inc: .03, food: .02 }],
    datacenter: ['💾 Digital Hub', { inc: .06, dev: 3, int: .4 }], power: ['🔌 Energy Giant', { inc: .04, dr: .1 }], port: ['⚓ Maritime Gateway', { inc: .05, food: .04 }], university: ['🎓 Knowledge Capital', { dev: 3, inc: .03 }], resort: ['🏝️ Resort Province', { inc: .06, hap: 1 }]
};
const PR = [
    { id: 'cct', n: '4Ps Cash Transfer', d: 'Cash grants for poor families whose kids stay in school', up: 22, fx: { hap: 5, dev: 2, pop: .002 } },
    { id: 'road', n: 'Roads & Bridges Program', d: 'Farm-to-market roads connect towns', up: 25, fx: { inc: .06, dev: 2 } },
    { id: 'rice', n: 'Rice Self-Sufficiency', d: 'Seeds, irrigation and farmer training', up: 18, fx: { food: .15 } },
    { id: 'schol', n: 'Scholarship Program', d: 'Free tuition for deserving students', up: 20, fx: { inc: .05, hap: 2, dev: 3 } },
    { id: 'uhc', n: 'Universal Health Care', d: 'Rural health units and free check-ups', up: 18, fx: { pop: .004, hap: 4 } },
    { id: 'tour', n: 'Tourism Promotion', d: 'Festivals, marketing and eco-tours', up: 15, fx: { inc: .08 } },
    { id: 'drrm', n: 'Disaster Risk Reduction (DRRM)', d: 'Early warning and evacuation centers', up: 12, fx: { hap: 1, dr: .5 } },
    { id: 'peace', n: 'Peace & Order Program', d: 'Police visibility and community patrols', up: 14, fx: { hap: 3 } },
    { id: 'msme', n: 'Livelihood & MSME Loans', d: 'Low-interest loans for small businesses', up: 16, fx: { inc: .07, dev: 1 } },
    { id: 'egov', n: 'e-Governance', d: 'Online permits and digital payments (+integrity)', up: 14, fx: { inc: .04, dev: 1, int: .6 } }];
const LW = [
    { id: 'revcode', n: 'Local Revenue Code', d: 'Higher business and property taxes', cost: 30, s: -5, fx: { inc: .10, hap: -3 } },
    { id: 'foi', n: 'Transparency & Anti-Corruption Ordinance', d: 'Open budgets, fewer kickbacks', cost: 20, s: 4, fx: { inc: .03, hap: 2, dev: 1, int: 1 } },
    { id: 'wage', n: 'Minimum Wage Ordinance', d: 'Higher pay for workers, costlier business', cost: 25, s: 3, fx: { hap: 5, inc: -.04 } },
    { id: 'env', n: 'Environmental Code', d: 'Ban illegal logging and mining', cost: 25, s: 0, fx: { hap: 2, inc: -.03, dev: 2, food: .03 } },
    { id: 'invest', n: 'Investment Incentives Code', d: 'Tax holidays for new businesses', cost: 35, s: -2, fx: { inc: .12, hap: -1 } },
    { id: 'zone', n: 'Land Use & Zoning Ordinance', d: 'Protect farmland, plan growth', cost: 30, s: 0, fx: { food: .05, dev: 2 } },
    { id: 'senior', n: 'Senior Citizens & PWD Welfare', d: 'Discounts and social pensions', cost: 20, s: 4, fx: { hap: 4 } },
    { id: 'edu', n: 'Compulsory Education Ordinance', d: 'Every child must attend school', cost: 25, s: 0, fx: { inc: .05, hap: 1, dev: 2 } },
    { id: 'code', n: 'Disaster-Resilient Building Code', d: 'Stronger houses and buildings', cost: 30, s: 0, fx: { dr: .3, dev: 1 } },
    { id: 'eodb', p: 'lib', n: 'Ease of Doing Business Act', d: 'Fast permits, fewer rules', cost: 30, s: -1, fx: { inc: .10, int: -.2 } },
    { id: 'libcharter', p: 'lib', n: 'Civil Liberties Charter', d: 'Free speech, weaker policing', cost: 25, s: 4, fx: { hap: 3, thr: .15 } },
    { id: 'landref', p: 'soc', n: 'Land Reform Ordinance', d: 'Redistribute idle farmland', cost: 35, s: 3, fx: { food: .12, hap: 4, inc: -.04 } },
    { id: 'coop', p: 'soc', n: "Workers' Cooperative Act", d: 'Worker-owned enterprises', cost: 30, s: 2, fx: { hap: 3, dev: 2, inc: .02 } },
    { id: 'curfew', p: 'con', n: 'Anti-Crime & Curfew Ordinance', d: 'Strict policing, less freedom', cost: 25, s: -2, fx: { thr: -.35, hap: -1 } },
    { id: 'family', p: 'con', n: 'Heritage & Family Code', d: 'Traditional values, church-backed programs', cost: 20, s: 5, fx: { hap: 2, inc: .02 } },
    { id: 'buylocal', p: 'nat', n: 'Buy Local Act', d: 'Favor local farmers and products', cost: 25, s: 3, fx: { food: .1, inc: .03, dev: 1 } },
    { id: 'reserve', p: 'nat', n: 'Reservist Service Act', d: 'Citizen reserve guards the border', cost: 30, s: 2, fx: { thr: -.3, hap: 1 } },
    { id: 'renew', p: 'grn', n: 'Renewable Energy Ordinance', d: 'Solar and wind microgrids', cost: 35, s: 2, fx: { dev: 3, inc: -.02, dr: .2 } },
    { id: 'protect', p: 'grn', n: 'Protected Areas Act', d: 'Eco-parks and reef sanctuaries', cost: 25, s: 3, fx: { inc: .05, food: .04, hap: 1 } },
    { id: 'smart', p: 'tec', n: 'Smart Province Digital Act', d: 'Digital IDs and online services', cost: 35, s: 0, fx: { inc: .06, dev: 3, int: .5 } },
    { id: 'opendata', p: 'tec', n: 'Open Data & AI Governance', d: 'Data-driven policy', cost: 30, s: -2, fx: { dev: 2, int: .8, hap: -1 } },
    // Dynasty politics: reformist parties can ban political dynasties; traditional parties can protect family rule. 'ad' = anti-dynasty, 'pd' = pro-dynasty.
    { id: 'antidyn', p: 'lib', ad: 1, n: 'Anti-Political Dynasty Act', d: 'Bars close relatives from holding or succeeding to office. Ends dynasty networks and blocks new ones', cost: 35, s: 3, fx: { int: 1.2, hap: 1, inc: -.01 } },
    { id: 'antidyn2', p: 'soc', ad: 1, n: 'Fair Representation & Anti-Dynasty Law', d: 'Opens seats to ordinary citizens and ends family rule', cost: 30, s: 4, fx: { hap: 2, int: .8 } },
    { id: 'antidyn3', p: 'tec', ad: 1, n: 'Open Candidacy & Anti-Dynasty Registry', d: 'A public registry of kin in office; dynasties are blocked', cost: 30, s: 1, fx: { int: 1, dev: 1 } },
    { id: 'prodyn', p: 'con', pd: 1, n: 'Family Governance & Continuity Act', d: 'Protects family political traditions: building a dynasty is cheaper and costs less integrity', cost: 25, s: -2, fx: { hap: 1, int: -.6 } },
    { id: 'prodyn2', p: 'nat', pd: 1, n: 'Local Leadership Heritage Act', d: 'Honors long-established local families: building a dynasty is cheaper and costs less integrity', cost: 25, s: 2, fx: { hap: 1, int: -.5 } }];
const antiDyn = () => LW.some(l => l.ad && S.law[l.id]), proDyn = () => LW.some(l => l.pd && S.law[l.id]);
const TR = {
    agri: ['🌾 Farm Belt', { food: .1 }, 'Nueva Ecija,Isabela,Bukidnon,Cotabato,Tarlac,Pangasinan,Negros Occidental,Iloilo,Cagayan,Davao del Norte,Sultan Kudarat,Nueva Vizcaya,Abra,Agusan del Norte,Antique,Apayao,Camarines Sur,Capiz,Davao Occidental,Davao Oriental,Guimaras,Ilocos Sur,Kalinga,La Union,Lanao del Norte,Misamis Occidental,Negros Oriental,Occidental Mindoro,Oriental Mindoro,Quirino,Sarangani,South Cotabato,Zamboanga del Sur'],
    tour: ['🏝️ Tourist Draw', { inc: .05 }, 'Palawan,Bohol,Batanes,Siquijor,Camiguin,Ilocos Norte,Aklan,Cebu,Benguet,Surigao del Norte,Mountain Province,Ifugao,Camarines Sur,Guimaras,Ilocos Sur,Kalinga,La Union,Negros Oriental,Oriental Mindoro'],
    ind: ['🏭 Industrial Zone', { inc: .08 }, 'Cavite,Laguna,Bulacan,Batangas,Rizal,Pampanga,Cebu,Davao del Sur,Bataan,Misamis Oriental,Lanao del Norte,South Cotabato'],
    mine: ['⛏️ Mining Area', { inc: .05, hap: -2 }, 'Surigao del Norte,Surigao del Sur,Dinagat Islands,Zambales,Davao de Oro,Agusan del Sur,Benguet,Marinduque,Agusan del Norte,Apayao,Davao Oriental,Sarangani,South Cotabato'],
    fish: ['🐟 Fishing Coast', { food: .05 }, 'Palawan,Masbate,Romblon,Sulu,Tawi-Tawi,Zamboanga del Norte,Siquijor,Bataan,Camarines Norte,Zamboanga Sibugay,Agusan del Norte,Antique,Camarines Sur,Capiz,Davao Occidental,Davao Oriental,Guimaras,La Union,Misamis Occidental,Negros Oriental,Occidental Mindoro,Oriental Mindoro,Sarangani,Zamboanga del Sur'],
    conf: ['⚠️ Unrest-Prone', { hap: -5 }, 'Maguindanao,Lanao del Sur,Sulu,Basilan,Tawi-Tawi,Cotabato'],
    storm: ['🌀 Typhoon Belt', { dr: -.3 }, 'Eastern Samar,Samar,Northern Samar,Leyte,Catanduanes,Albay,Aurora,Cagayan,Isabela,Batanes,Quezon,Sorsogon,Southern Leyte,Biliran,Camarines Sur,Davao Oriental']
};
const traitsOf = n => Object.keys(TR).filter(k => TR[k][2].split(',').includes(n));

const DF = {
    e: { n: 'Easy', g: 1.5, ev: .2, ira: 1.2, inc: 1.12, up: .85, thr: .75, ct: .7, pr: .1, el: 6, hd: -2, d: 'Rich start, generous aid, calmer border, friendlier capital and easier elections.' },
    n: { n: 'Normal', g: 1, ev: .28, ira: 1, inc: 1, up: 1, thr: 1, ct: 1, pr: 0, el: 0, hd: 0, d: 'The standard game.' },
    h: { n: 'Hard', g: .7, ev: .38, ira: .8, inc: .9, up: 1.2, thr: 1.35, ct: 1.4, pr: -.1, el: -6, hd: 3, d: 'Poorer start, more crises, costlier upkeep, a hostile border and capital, tougher elections.' },
    r: { n: 'Realistic', g: .6, ev: .3, ira: .9, inc: .95, up: 1.15, thr: 1.15, ct: 1.2, pr: -.05, el: -4, hd: 1.5, real: 1, d: 'Starts in the year 2000 and replays the real events of the era (9/11, SARS, the 2008 crash, typhoons, COVID-19). Salaries follow real-life inflation, and laws and training take longer.' }
};
const EV = [
    { t: '🌾 A drought hits your harvests.', o: [['Buy emergency grain (−60 gold)', s => { s.gold -= 60; return 'Grain bought. Crisis averted.' }], ['Do nothing', s => { s.food -= 80; s.hap -= 6; return 'Hunger spreads.' }]] },
    { t: '🏗️ A foreign investor wants to build a plant.', o: [['Accept (+90 gold, −4 happy)', s => { s.gold += 90; s.hap -= 4; return 'Money flows in, locals grumble.' }], ['Decline (+3 happy)', s => { s.hap += 3; return 'Locals approve.' }]] },
    { t: '✊ Workers demand better conditions.', o: [['Give raises (−50 gold, +7 happy)', s => { s.gold -= 50; s.hap += 7; return 'Calm returns.' }], ['Refuse (−8 happy)', s => { s.hap -= 8; return 'Strikes slow the province.' }]] },
    { t: '🎉 Big festival proposed in the capital town.', o: [['Fund it (−40 gold, +6 happy)', s => { s.gold -= 40; s.hap += 6; return 'A great celebration!' }], ['Skip', s => 'Nothing happens.']] },
    { t: '🦠 Epidemic outbreak!', o: [['Quarantine (−70 gold)', s => { s.gold -= 70; return 'Contained quickly.' }], ['Ignore', s => { s.pop *= .96; s.hap -= 5; return 'Many fall ill.' }]] },
    { t: '💼 A contractor offers you a kickback on a road project.', o: [['Accept (+80 gold, integrity −15)', s => { s.gold += 80; s.int -= 15; return 'Easy money… for now.' }], ['Refuse and report (integrity +6)', s => { s.int += 6; s.sup += 2; return 'The council respects your stand.' }]] },
    { t: '🔥 Fire destroys the public market.', o: [['Rebuild now (−60 gold)', s => { s.gold -= 60; s.hap += 2; return 'Traders return quickly.' }], ['Ask national aid (50% chance)', s => Math.random() < .5 ? (s.gold += 60, 'Aid arrives: +60 gold.') : (s.hap -= 5, 'No aid came. Traders are angry.')]] },
    { t: '🤝 The national government offers a livelihood grant if you match funds.', o: [['Match funds (−50, receive +130)', s => { s.gold += 80; return 'Net gain of 80 gold.' }, 50], ['Decline', s => 'Opportunity passes.']] },
    { t: '🪖 Armed clashes reported near the border of your province.', o: [['Deploy police (−50 gold, +2 happy)', s => { s.gold -= 50; s.hap += 2; return 'Order restored.' }, 50], ['Negotiate (−20 gold, 50% success)', s => { s.gold -= 20; return Math.random() < .5 ? 'Peace talks succeed.' : (s.hap -= 7, 'Talks fail. Residents flee.') }]] }];
const TY = { t: '🌀 A typhoon approaches the province!', o: [['Evacuate early (−40 gold)', s => { s.gold -= 40; return 'Evacuations saved many lives.' }], ['Wait and see', s => { const k = 1 - Math.min(.7, fx('dr')); s.gold -= Math.round(90 * k); s.hap -= Math.round(9 * k); s.food -= Math.round(60 * k); return k < 1 ? 'Preparations softened the blow.' : 'Heavy damage and no preparation.' }]] };
const SC = { t: '📰 A corruption scandal is exposed in your office!', o: [['Cooperate with the Ombudsman (−60 gold, integrity +12)', s => { s.gold -= 60; s.int += 12; s.hap -= 2; return 'You clean house. Trust slowly returns.' }, 60], ['Cover it up (council −8, happy −6)', s => { s.sup -= 8; s.hap -= 6; return 'The cover-up leaks. Public anger grows.' }]] };
const MS = [
    { id: 'm1', t: 'Raise happiness to 75', r: 80, f: () => S.hap >= 75 }, { id: 'm2', t: 'Pass 3 laws', r: 100, f: () => Object.keys(S.law).length >= 3 },
    { id: 'm3', t: 'Run 4 programs at once', r: 100, f: () => Object.keys(S.prog).length >= 4 }, { id: 'm4', t: 'Grow population by 20%', r: 120, f: () => S.pop >= S.v.pop * 1.2 },
    { id: 'm5', t: 'Reach top 20 nationwide', r: 150, f: () => rank() <= 20 }, { id: 'm6', t: 'Keep integrity above 80', r: 100, f: () => S.int >= 80 }, { id: 'm7', t: 'Reach development 70', r: 200, f: () => S.v.dev >= 70 }, { id: 'm8', t: 'Hold border threat below 15', r: 120, f: () => S.day > 14 && S.thr < 15 }, { id: 'm9', t: 'Field 150 soldiers in the military', r: 100, f: () => fMen('mil') >= 150 }];
