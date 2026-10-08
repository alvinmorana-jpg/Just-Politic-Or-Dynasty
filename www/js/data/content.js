        const B = [['farm', '🌾', 'Farms', 'Food +12% per level', 100], ['factory', '🏭', 'Factories', 'More income, less happiness', 130], ['market', '🛒', 'Markets', 'Steady income', 100], ['school', '🏫', 'Schools', 'Education → income', 110], ['hospital', '🏥', 'Hospitals', 'Happiness & population growth', 110], ['road', '🛣️', 'Roads', 'Boosts all income', 120], ['guard', '🛡️', 'Security', 'Order and stability', 90], ['mining', '⛏️', 'Mining', 'Big income, but hurts happiness and drains ore reserves', 140], ['logging', '🪵', 'Logging', 'Steady income; clears forest (it regrows slowly)', 100]];
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
            { id: 'opendata', p: 'tec', n: 'Open Data & AI Governance', d: 'Data-driven policy', cost: 30, s: -2, fx: { dev: 2, int: .8, hap: -1 } }];
        const TR = {
            agri: ['🌾 Farm Belt', { food: .1 }, 'Nueva Ecija,Isabela,Bukidnon,Cotabato,Tarlac,Pangasinan,Negros Occidental,Iloilo,Cagayan,Davao del Norte,Sultan Kudarat,Nueva Vizcaya'],
            tour: ['🏝️ Tourist Draw', { inc: .05 }, 'Palawan,Bohol,Batanes,Siquijor,Camiguin,Ilocos Norte,Aklan,Cebu,Benguet,Surigao del Norte,Mountain Province,Ifugao'],
            ind: ['🏭 Industrial Zone', { inc: .08 }, 'Cavite,Laguna,Bulacan,Batangas,Rizal,Pampanga,Cebu,Davao del Sur,Bataan,Misamis Oriental'],
            mine: ['⛏️ Mining Area', { inc: .05, hap: -2 }, 'Surigao del Norte,Surigao del Sur,Dinagat Islands,Zambales,Davao de Oro,Agusan del Sur,Benguet,Marinduque'],
            fish: ['🐟 Fishing Coast', { food: .05 }, 'Palawan,Masbate,Romblon,Sulu,Tawi-Tawi,Zamboanga del Norte,Siquijor,Bataan,Camarines Norte,Zamboanga Sibugay'],
            conf: ['⚠️ Unrest-Prone', { hap: -5 }, 'Maguindanao,Lanao del Sur,Sulu,Basilan,Tawi-Tawi,Cotabato'],
            storm: ['🌀 Typhoon Belt', { dr: -.3 }, 'Eastern Samar,Samar,Northern Samar,Leyte,Catanduanes,Albay,Aurora,Cagayan,Isabela,Batanes,Quezon,Sorsogon,Southern Leyte,Biliran']
        };
        const traitsOf = n => Object.keys(TR).filter(k => TR[k][2].split(',').includes(n));
