// ---- Country packs: map bounds, flag and local wording for each playable country ----
C.PH.flag = '🇵🇭'; C.PH.bb = [197, 75, 1162, 1930]; C.MY.flag = '🇲🇾';
const LOCS = {
    PH: { cur: { sym: '₱', u: 10 }, pay: 29668, rk: ['Private', 'Corporal', 'Sergeant', 'Lieutenant', 'Captain', 'Major', 'Lt. Colonel', 'Colonel'], nat: 'Republic of the Philippines', gv: 'governor', Gv: 'Governor', season: m => m >= 6, storm: 'typhoons' },
    MY: {
        cur: { sym: 'RM', u: .8 }, pay: 2000, rk: ['Prebet', 'Koperal', 'Sarjan', 'Leftenan', 'Kapten', 'Mejar', 'Lt. Kolonel', 'Kolonel'], nat: 'Malaysia', gv: 'chief minister', Gv: 'Chief Minister', storm: 'monsoon floods', season: m => m >= 10 || m <= 2,
        tt: ['Chief Minister', 'Regional Representative', 'Prime Minister'],
        rg: [['Northern Region', 'Perlis,Kedah,Pulau Pinang,Perak'], ['East Coast Region', 'Kelantan,Terengganu,Pahang'], ['Central Region', 'Selangor,Kuala Lumpur,Putrajaya,Negeri Sembilan'], ['Southern Region', 'Melaka,Johor'], ['Borneo Region', 'Sabah,Sarawak']],
        fu: { pol: ['Police (PDRM)'], mil: ['Military (ATM)'], caf: ['RELA Volunteers'] },
        sub: [[/CAFGU/g, 'RELA'], [/4Ps/g, 'Cash Aid']],
        names: { cct: 'BR1M/STR Cash Aid', negosyo: 'SME Corp One-Stop Centres', taxinc: 'Pioneer Status Investor Incentives', meals: 'School Supplementary Food Programme (RMT)', house: 'PPR & Rumah Mesra Rakyat Housing', tanod: 'Rukun Tetangga & Anti-Drug Councils', rotc: 'National Service (PLKN) Citizen Training', rcef: 'Padi Subsidy & Rice Mechanisation Fund', lokal: 'Buy Malaysian Products Fair', mangrove: 'Mangrove & Reef Restoration', waste: 'Solid Waste & Community Solar Drive', wifi: 'Free Public Wi-Fi (JENDELA)', natid: 'MyKad Digital ID & e-Wallet', compet: 'Fair Competition & Anti-Monopoly Ordinance', tenure: 'Security of Tenure Ordinance (anti-contract abuse)', antiterror: 'Anti-Terrorism Cooperation Ordinance', farmers: 'Smallholder Farmers Support Ordinance', solid: 'Ecological Waste Management Ordinance', privacy: 'Data Privacy & Cybersecurity Ordinance (PDPA)' },
        desc: { tanod: 'Community watch and drug-free neighborhoods' },
        trN: { storm: '🌊 Flood-Prone' },
        tr: {
            agri: 'Kedah,Perlis,Kelantan,Pahang,Perak,Johor,Sarawak,Sabah,Negeri Sembilan',
            tour: 'Pulau Pinang,Melaka,Sabah,Sarawak,Kedah,Pahang,Terengganu,Kuala Lumpur,Johor,Putrajaya',
            ind: 'Selangor,Pulau Pinang,Johor,Kuala Lumpur,Perak,Negeri Sembilan,Melaka,Putrajaya',
            mine: 'Pahang,Perak,Terengganu,Sarawak,Sabah,Kelantan',
            fish: 'Terengganu,Kelantan,Sabah,Sarawak,Pulau Pinang,Perlis,Melaka,Johor,Kedah,Perak,Pahang',
            conf: 'Sabah',
            storm: 'Kelantan,Terengganu,Pahang,Kedah,Perlis,Johor,Sabah,Sarawak'
        },
        exh: 'Sabah,Sarawak,Kelantan', exm: 'Perlis,Kedah,Perak,Johor,Terengganu,Melaka,Pahang',
        np: ['Bandar Baru', 'Kampung Baru', 'Taman Jaya', 'Seri Indah', 'Bukit Jaya', 'Sungai Besar', 'Kota Damai', 'Pekan Lama', 'Teluk Murni', 'Port Sentosa', 'Bandar Maju', 'Kuala Selatan', 'Batu Sari', 'Lembah Jaya', 'Padang Emas', 'Tanjung Bunga', 'Bukit Mutiara', 'Bandar Perdana'],
        pf: ['Ahmad', 'Siti', 'Mohd', 'Nurul', 'Lim', 'Tan', 'Raj', 'Aisha', 'Faizal', 'Wong', 'Devi', 'Hafiz'],
        ps: ['Abdullah', 'Ismail', 'Hassan', 'Lee', 'Chong', 'Rahman', 'Singh', 'Ali', 'Yusof', 'Ng', 'Nair', 'Omar'],
        cap: { Johor: 'Johor Bahru', Kedah: 'Alor Setar', Kelantan: 'Kota Bharu', Melaka: 'Bandar Melaka', 'Negeri Sembilan': 'Seremban', Pahang: 'Kuantan', Perak: 'Ipoh', Perlis: 'Kangar', 'Pulau Pinang': 'George Town', Sabah: 'Kota Kinabalu', Sarawak: 'Kuching', Selangor: 'Shah Alam', Terengganu: 'Kuala Terengganu', 'Kuala Lumpur': 'Kuala Lumpur', Putrajaya: 'Putrajaya' },
        ty: '🌊 Monsoon floods threaten the state!', sc: [[/Ombudsman/g, 'MACC']],
        rel: (n, r) => {
            const R = ['Islam', 'Buddhism', 'Christianity', 'Hinduism', 'Folk/Other'];
            const m = /Kelantan|Terengganu|Perlis|East Coast/.test(n) ? [94, 3, 1, 1, 1] : /Kedah/.test(n) ? [80, 10, 3, 6, 1] : /Pahang/.test(n) ? [80, 10, 4, 3, 3] : /Pulau Pinang/.test(n) ? [45, 34, 5, 14, 2] : /Sarawak/.test(n) ? [32, 12, 52, 2, 2] : /Sabah/.test(n) ? [66, 6, 26, 1, 1] : /Borneo/.test(n) ? [49, 9, 39, 2, 1] : /Kuala Lumpur|Selangor|Putrajaya|Central/.test(n) ? [60, 19, 9, 9, 3] : /Johor|Melaka|Negeri Sembilan|Southern/.test(n) ? [62, 18, 6, 9, 5] : /Perak|Northern/.test(n) ? [58, 22, 6, 12, 2] : [64, 19, 9, 6, 2];
            let q = r() * 100; for (let i = 0; i < 5; i++) { if (q < m[i]) return R[i]; q -= m[i] } return R[0]
        }
    }
};
LOCS.BN = {
    cur: { sym: 'B$', u: .24 }, pay: 1100, rk: ['Prebet', 'Koperal', 'Sarjan', 'Leftenan', 'Kapten', 'Mejar', 'Lt. Kolonel', 'Kolonel'], nat: 'Brunei Darussalam', gv: 'district officer', Gv: 'District Officer', storm: 'monsoon floods', season: m => m >= 10 || m <= 2,
    tt: ['District Officer', 'Regional Representative', 'Prime Minister'],
    rg: [['Eastern Brunei', 'Brunei-Muara,Temburong'], ['Western Brunei', 'Tutong,Belait']],
    fu: { pol: ['Royal Brunei Police Force'], mil: ['Royal Brunei Armed Forces'], caf: ['GRU Reserve Guards'] },
    sub: [[/CAFGU/g, 'GRU'], [/4Ps/g, 'Welfare Aid']],
    names: { cct: 'JAPEM Welfare Allowance', negosyo: 'Darussalam Enterprise (DARe) Support', taxinc: 'Pioneer Status Investor Incentives', meals: 'Free School Meals & Milk', house: 'National Housing Scheme (RPN) & STKRJ Land Grants', tanod: 'Ketua Kampung Community Watch', rotc: 'Youth Service & Citizen Training', rcef: 'Local Rice (Laila) Self-Sufficiency Fund', lokal: 'Buy Local (Produk Tempatan) Fair', mangrove: 'Mangrove & Reef Restoration', waste: 'Solid Waste & Recycling Drive', wifi: 'Free Public Wi-Fi', natid: 'National Digital ID & e-Wallet', compet: 'Competition Order & Anti-Monopoly Rules', tenure: 'Security of Tenure Order (anti-contract abuse)', antiterror: 'Anti-Terrorism Cooperation Order', farmers: 'Smallholder Farmers Support Order', solid: 'Ecological Waste Management Order', privacy: 'Data Protection & Cybersecurity Order', drrm: 'Disaster Management (NDMC)' },
    desc: { tanod: 'Ketua Kampung community watch and anti-drug awareness' },
    trN: { storm: '🌊 Flood-Prone' },
    tr: {
        agri: 'Tutong,Temburong,Brunei-Muara', tour: 'Temburong,Brunei-Muara', ind: 'Brunei-Muara,Belait', mine: 'Belait', fish: 'Brunei-Muara,Tutong,Belait', conf: '', storm: 'Temburong,Tutong,Belait'
    },
    exh: 'Temburong,Belait', exm: 'Tutong',
    np: ['Kampong Baru', 'Bandar Maju', 'Kampong Sinaut', 'Seri Kenangan', 'Bukit Jaya', 'Sungai Besar', 'Kota Damai', 'Pekan Lama', 'Teluk Murni', 'Port Sentosa', 'Kampong Mulaut', 'Batu Sari', 'Lembah Jaya', 'Padang Emas', 'Tanjong Bunga', 'Bukit Mutiara', 'Bandar Perdana', 'Kampong Lumut'],
    pf: ['Awang', 'Dayang', 'Haji', 'Hajah', 'Pengiran', 'Hasnah', 'Ahmad', 'Nurul', 'Lim', 'Tan', 'Wong', 'Siti'],
    ps: ['Abdullah', 'Ismail', 'Hassan', 'Rahman', 'Yusof', 'Omar', 'Lim', 'Tan', 'Chong', 'Ali', 'Mohamed', 'Bakar'],
    cap: { 'Brunei-Muara': 'Bandar Seri Begawan', Belait: 'Kuala Belait', Tutong: 'Tutong', Temburong: 'Bangar' },
    ty: '🌊 Monsoon floods threaten the district!', sc: [[/Ombudsman/g, 'ACB']],
    rel: (n, r) => {
        const R = ['Islam', 'Buddhism', 'Christianity', 'Hinduism', 'Folk/Other'];
        const m = /Belait|Western/.test(n) ? [70, 10, 11, 1, 8] : /Tutong/.test(n) ? [84, 5, 5, 1, 5] : /Temburong/.test(n) ? [76, 4, 8, 1, 11] : [79, 8, 9, 1, 3];
        let q = r() * 100; for (let i = 0; i < 5; i++) { if (q < m[i]) return R[i]; q -= m[i] } return R[0]
    }
};
LOCS.SG = {
    cur: { sym: 'S$', u: .24 }, pay: 2300, rk: ['Private', 'Corporal', 'Sergeant', 'Lieutenant', 'Captain', 'Major', 'Lt. Colonel', 'Colonel'], nat: 'Republic of Singapore', gv: 'regional mayor', Gv: 'Regional Mayor', storm: 'monsoon floods', season: m => m >= 10 || m <= 2,
    tt: ['Regional Mayor', 'Regional Representative', 'Prime Minister'],
    rg: [['Central & Eastern Singapore', 'Central Region,East Region,North-East Region'], ['Western & Northern Singapore', 'West Region,North Region']],
    fu: { pol: ['Police (SPF)'], mil: ['Military (SAF)'], caf: ['NSmen Reservists'] },
    sub: [[/CAFGU/g, 'NSmen'], [/4Ps/g, 'Cash Aid']],
    names: { cct: 'ComCare & Workfare Income Supplement', negosyo: 'Enterprise Singapore (EnterpriseSG) Support', taxinc: 'Pioneer Certificate Investor Incentives', meals: 'Subsidised School Meals & Edusave', house: 'HDB Public Housing & Grants', tanod: 'Neighbourhood Police Posts & Community Watch', rotc: 'National Service (NS) Citizen Training', rcef: 'Local Farming Fund (30 by 30 Food Goal)', lokal: 'Buy Local (SG Made) Fair', mangrove: 'Mangrove & Coastal Protection Programme', waste: 'Zero Waste & Semakau Landfill Programme', wifi: 'Wireless@SG Free Public Wi-Fi', natid: 'Singpass Digital ID & e-Wallet', compet: 'Competition & Consumer Commission Rules', tenure: 'Employment Security Act (anti-contract abuse)', antiterror: 'Anti-Terrorism Cooperation Act', farmers: 'Urban Farmers Support Act', solid: 'Ecological Waste Management Act', privacy: 'Data Privacy & Cybersecurity Act (PDPA)', drrm: 'Civil Defence & Flood Management (SCDF/PUB)', rice: 'Food Security & Rice Stockpile', uhc: 'Healthier SG & MediShield Life', road: 'MRT & Road Network Programme', egov: 'Smart Nation & e-Government', wage: 'Progressive Wage Model', zone: 'Land Use & Master Plan (URA)', edu: 'Compulsory Education Act', foi: 'Transparency & Anti-Corruption Act (CPIB)', senior: 'Silver Support & Seniors Welfare' },
    desc: { tanod: 'Neighbourhood police posts, town councils and community watch' },
    trN: { storm: '🌊 Flood-Prone' },
    tr: { agri: 'North Region', tour: 'Central Region,East Region', ind: 'West Region,North Region,East Region', mine: '', fish: 'North Region,North-East Region', conf: '', storm: 'Central Region,East Region' },
    exh: 'North Region,West Region', exm: 'North-East Region,East Region',
    np: ['Bishan Heights', 'Marina Gardens', 'Tanjong Rhu', 'Bukit Gombak', 'Jurong Gateway', 'Punggol Waterway', 'Kampong Glam', 'Telok Ayer', 'Tiong Bahru', 'Pasir Ris Park', 'Sembawang Hills', 'Toa Payoh Central', 'Boon Lay Way', 'Tengah Garden', 'Sengkang West', 'Bedok Reservoir', 'Serangoon North', 'Clementi Woods'],
    pf: ['Wei', 'Mei', 'Ahmad', 'Siti', 'Raj', 'Priya', 'Jun', 'Hui', 'Farid', 'Li', 'Kumar', 'Aisha'],
    ps: ['Tan', 'Lim', 'Lee', 'Ng', 'Chua', 'Wong', 'Goh', 'Teo', 'Rahman', 'Singh', 'Abdullah', 'Pillai'],
    cap: { 'Central Region': 'Downtown Core', 'East Region': 'Tampines', 'North Region': 'Woodlands', 'North-East Region': 'Hougang', 'West Region': 'Jurong East' },
    ty: '🌊 Flash floods threaten the region!', sc: [[/Ombudsman/g, 'CPIB']],
    rel: (n, r) => {
        const R = ['Islam', 'Buddhism', 'Christianity', 'Hinduism', 'Folk/Other'];
        const m = /North-East/.test(n) ? [14, 32, 20, 5, 29] : /West/.test(n) ? [16, 30, 18, 4, 32] : /North/.test(n) ? [24, 26, 14, 7, 29] : /East/.test(n) ? [20, 28, 19, 4, 29] : [14, 29, 20, 6, 31];
        let q = r() * 100; for (let i = 0; i < 5; i++) { if (q < m[i]) return R[i]; q -= m[i] } return R[0]
    }
};
let LOC = LOCS.PH, BASE = null;
function snapBase() {
    if (BASE) return; const pl = [...PR, ...LW];
    BASE = { tt: [...TT], rg: RG.map(r => [...r]), fu: FU.map(u => [u.n, u.d]), tr: Object.fromEntries(Object.keys(TR).map(k => [k, [TR[k][0], TR[k][2]]])), exh: [...EXH], exm: [...EXM], np: [...NP], pf: [...PF], ps: [...PS], pl: Object.fromEntries(pl.map(p => [p.id, [p.n, p.d]])), pt: Object.fromEntries(Object.keys(PT).map(k => [k, [PT[k].pk, PT[k].ck]])), ty: TY.t, sc: SC.o[0][0], ca: CA.t, ms: MS.map(m => m.t) }
}
const fillArr = (a, v) => { a.length = 0; a.push(...v) };
function setCountry(k) {
    snapBase(); const b = BASE, L = LOCS[k] || {}; CTRY = k; LOC = Object.assign({}, LOCS.PH, L);
    const sub = s => (L.sub || []).reduce((a, [re, to]) => a.replace(re, to), s);
    fillArr(TT, L.tt || b.tt); RG.length = 0; (L.rg || b.rg).forEach(r => RG.push([...r]));
    FU.forEach((u, i) => { const o = L.fu && L.fu[u.id]; u.n = o ? o[0] : b.fu[i][0]; u.d = o && o[1] ? o[1] : b.fu[i][1] });
    Object.keys(TR).forEach(t => { TR[t][0] = (L.trN && L.trN[t]) || b.tr[t][0]; TR[t][2] = L.tr && L.tr[t] != null ? L.tr[t] : b.tr[t][1] });
    fillArr(EXH, L.exh ? L.exh.split(',') : b.exh); fillArr(EXM, L.exm ? L.exm.split(',') : b.exm);
    fillArr(NP, L.np || b.np); fillArr(PF, L.pf || b.pf); fillArr(PS, L.ps || b.ps);
    [...PR, ...LW].forEach(p => { p.n = L.names && L.names[p.id] || b.pl[p.id][0]; p.d = L.desc && L.desc[p.id] || b.pl[p.id][1] });
    Object.keys(PT).forEach(p => { PT[p].pk = sub(b.pt[p][0]); PT[p].ck = sub(b.pt[p][1]) });
    TY.t = L.ty || b.ty; SC.o[0][0] = (L.sc || []).concat(L.sub || []).reduce((a, [re, to]) => a.replace(re, to), b.sc); CA.t = sub(b.ca); MS.forEach((m, i) => m.t = sub(b.ms[i]));
    UN[1] = LOC.gv; setView(k); build(); sel = null; hqI = -1
}
