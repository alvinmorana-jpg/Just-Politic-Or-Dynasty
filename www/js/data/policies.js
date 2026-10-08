        PR.push(
            { id: 'negosyo', p: 'lib', n: 'Go Negosyo Centers (RA 10644)', d: 'One-stop help desks for small entrepreneurs', up: 15, fx: { inc: .07, int: .3 } },
            { id: 'taxinc', p: 'lib', n: 'CREATE-style Investor Incentives (RA 11534)', d: 'Lower business taxes to attract investors', up: 20, fx: { inc: .09, hap: -1 } },
            { id: 'meals', p: 'soc', n: 'Masustansyang Pagkain Feeding Program (RA 11037)', d: 'Free nutritious meals for schoolchildren', up: 16, fx: { hap: 3, pop: .002, dev: 1 } },
            { id: 'house', p: 'soc', n: 'Pambansang Pabahay Socialized Housing', d: 'Affordable homes for informal settlers', up: 22, fx: { hap: 4, dev: 2 } },
            { id: 'tanod', p: 'con', n: 'Barangay Tanod & Anti-Drug Councils', d: 'Community watch and drug-free barangays', up: 14, fx: { hap: 2, thr: -.15 } },
            { id: 'rotc', p: 'con', n: 'NSTP / ROTC Citizen Training (RA 9163)', d: 'Youth discipline and reserve preparedness', up: 14, fx: { thr: -.25, hap: 1 } },
            { id: 'rcef', p: 'nat', n: 'Rice Competitiveness Enhancement Fund (RA 11203)', d: 'Machinery and seeds for local rice farmers', up: 18, fx: { food: .12, inc: .02 } },
            { id: 'lokal', p: 'nat', n: 'Go Lokal Pinoy Products Fair', d: 'Market local products nationwide', up: 14, fx: { inc: .05, food: .03 } },
            { id: 'mangrove', p: 'grn', n: 'Mangrove & Reef Restoration (RA 8550)', d: 'Protect fisheries and coastlines from storms', up: 14, fx: { food: .06, dr: .3, hap: 1 } },
            { id: 'waste', p: 'grn', n: 'Solid Waste & Community Solar Drive (RA 9003)', d: 'Segregation, composting and rooftop solar', up: 15, fx: { dev: 2, hap: 1, inc: .01 } },
            { id: 'wifi', p: 'tec', n: 'Free Public Wi-Fi (RA 10929)', d: 'Internet hotspots in plazas, schools and clinics', up: 16, fx: { dev: 2, inc: .04 } },
            { id: 'natid', p: 'tec', n: 'PhilSys National ID & e-Payments (RA 11055)', d: 'Digital identity and cashless services', up: 14, fx: { int: .5, inc: .04 } });
        LW.push(
            { id: 'compet', p: 'lib', n: 'Fair Competition & Anti-Monopoly Ordinance (RA 10667)', d: 'Break local cartels, open markets', cost: 30, s: 2, fx: { inc: .06, hap: 1 } },
            { id: 'tenure', p: 'soc', n: 'Security of Tenure Ordinance (anti-"endo")', d: 'End abusive short-term contracts', cost: 25, s: 4, fx: { hap: 4, inc: -.03 } },
            { id: 'antiterror', p: 'con', n: 'Anti-Terrorism Cooperation Ordinance (RA 11479)', d: 'Tough security tools against armed groups', cost: 30, s: -1, fx: { thr: -.4, hap: -2 } },
            { id: 'farmers', p: 'nat', n: 'Small Farmers Magna Carta Ordinance (RA 7607)', d: 'Credit, storage and price support for farmers', cost: 25, s: 3, fx: { food: .1, hap: 2 } },
            { id: 'solid', p: 'grn', n: 'Ecological Waste Management Ordinance (RA 9003)', d: 'Segregation, recycling and dump closures', cost: 25, s: 3, fx: { hap: 2, dev: 1, inc: -.01 } },
            { id: 'privacy', p: 'tec', n: 'Data Privacy & Cybersecurity Ordinance (RA 10173)', d: 'Protect citizen data and public systems', cost: 25, s: 1, fx: { int: .4, dev: 1, hap: 1 } });
        Object.assign(LT, { compet: { b: .7, r: .4 }, tenure: { w: 1, b: -.5 }, antiterror: { o: 1, r: -.5 }, farmers: { w: .5, g: .3 }, solid: { g: 1 }, privacy: { r: .6, b: .2 } });
        MS.push(
            { id: 'gl1', p: 'lib', t: 'Build 4 Markets and 2 Factories', r: 130, f: () => S.b.market >= 4 && S.b.factory >= 2 },
            { id: 'gl2', p: 'lib', t: 'Hold 800 gold in the treasury', r: 150, f: () => S.gold >= 800 },
            { id: 'gs1', p: 'soc', t: 'Run 4Ps, Feeding and Housing programs together', r: 150, f: () => S.prog.cct && S.prog.meals && S.prog.house },
            { id: 'gs2', p: 'soc', t: 'Reach happiness 85', r: 150, f: () => S.hap >= 85 },
            { id: 'gc1', p: 'con', t: 'Drive border threat below 12', r: 150, f: () => S.thr < 12 },
            { id: 'gc2', p: 'con', t: 'Field 6 units of police and military', r: 120, f: () => S.fc.pol + S.fc.mil >= 6 },
            { id: 'gn1', p: 'nat', t: 'Stockpile 250 food', r: 130, f: () => S.food >= 250 },
            { id: 'gn2', p: 'nat', t: 'Pass the Small Farmers and Buy Local laws', r: 150, f: () => S.law.farmers && S.law.buylocal },
            { id: 'gg1', p: 'grn', t: 'Pass the Environmental Code, Protected Areas and Renewable Energy laws', r: 170, f: () => S.law.env && S.law.protect && S.law.renew },
            { id: 'gg2', p: 'grn', t: 'Run DRRM and Mangrove Restoration programs', r: 120, f: () => S.prog.drrm && S.prog.mangrove },
            { id: 'gt1', p: 'tec', t: 'Push integrity above 90', r: 150, f: () => S.int >= 90 },
            { id: 'gt2', p: 'tec', t: 'Run Wi-Fi and National ID programs and pass the Data Privacy law', r: 160, f: () => S.prog.wifi && S.prog.natid && S.law.privacy });
