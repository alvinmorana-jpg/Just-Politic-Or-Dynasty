        let ST = 'title';
        function go(s) { ST = s; menu(); if (s == 'map') resetV() }
        function menu() {
            $('app').dataset.step = ST;
            const hd = (n, t, b) => `<div class="row between"><div class="ov">New game · Step ${n} of 3 · ${t}</div>${b ? `<button onclick="go('${b}')">← Back</button>` : ''}</div>`;
            if (ST == 'title') {
                side.innerHTML = `<div class="card hero"><div class="ov">Philippines · 81 provinces</div><h1>Province Governor</h1><p>Lead a province for 10 years in real time: a day lasts 4 minutes of light and 1 minute of night at 1× speed. Recruit police, soldiers and CAFGU to guard your borders, run programs, pass laws through a party-split council, survive typhoons and win elections. Finish at the top in development to win votes for Regional Representative, then President, where you can rewrite how the country is run.</p>
<div class="ov">Difficulty</div><div class="seg">${Object.keys(DF).map(k => `<button class="${DIF == k ? 'on' : ''}" onclick="DIF='${k}';menu()">${DF[k].n}</button>`).join('')}</div><button class="p big" onclick="go('party')">▶ New game</button><div class="ov" style="margin-top:14px">Saved games · 2 slots max</div>${slotsHtml()}</div>`; return
            }
            if (ST == 'party') { side.innerHTML = `<div class="card">${hd(2, 'Choose your party', 'title')}${Object.keys(PT).map(k => `<div class="pcard ${PARTY == k ? 'on' : ''}" onclick="PARTY='${k}';menu()"><img class="lgo" src="${PT[k].lg}" alt=""><div><b>${PT[k].n}</b><br><small>${PT[k].d}<br>👍 ${PT[k].pk}<br>👎 ${PT[k].ck}</small></div></div>`).join('')}</div><button class="p next" onclick="go('map')">Next: choose your province →</button>`; return }
            side.innerHTML = `<div class="card">${hd(3, 'Province & host city', 'party')}<div class="row" style="margin:6px 0"><img class="lgo" style="width:30px;height:30px" src="${PT[PARTY].lg}" alt=""><small>${PT[PARTY].n} · ${DF[DIF].n}</small></div>${sel ? `<div class="ov">Selected</div><h2>${sel.n}</h2>${badges(sel.n)}<p>Population ${sel.pop.toLocaleString()}k · Development ${sel.dev}</p>${cityPick()}${newBtn()}` : '<p>👆 Tap a province on the map. Pinch or scroll to zoom, drag to move.</p>'}</div>`; draw()
        }
        function draw() {
            const z = V.w / fitW(); map.setAttribute('viewBox', vb().join(' ')); map.style.setProperty('--z', z);
            const ar = q => { let a = 0; for (let j = 0; j < q.length; j += 2) { const k = (j + 2) % q.length; a += q[j] * q[k + 1] - q[k] * q[j + 1] } return Math.abs(a / 2) };
            map.innerHTML = all.map((v, i) => {
                const d = v.r.map(q => { let t = 'M'; for (let j = 0; j < q.length; j += 2)t += (j ? 'L' : '') + q[j] + ',' + q[j + 1]; return t + 'Z' }).join('');
                const q = v.r[0], A = ar(q); let cx = 0, cy = 0; for (let j = 0; j < q.length; j += 2) { cx += q[j]; cy += q[j + 1] } cx /= q.length / 2; cy /= q.length / 2;
                return `<path data-i="${i}" d="${d}" fill="${col(v.dev)}" class="${S && TM.includes(v) ? 'me' : sel === v ? 'sel' : ''}"><title>${v.n} (dev ${v.dev})</title></path>${A > 3500 * z * z ? `<text x="${cx}" y="${cy}" style="font-size:${(A > 12000 ? 22 : 15) * z}px">${v.n}</text>` : ''}`
            }).join('');
            map.querySelectorAll('path').forEach(p => p.onclick = () => { if (!S && !moved) { sel = all[p.dataset.i]; hqI = -1; menu() } })
        }
