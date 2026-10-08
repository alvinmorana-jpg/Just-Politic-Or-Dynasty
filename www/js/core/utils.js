        const dark = u => u < .7 ? 0 : u < .8 ? (u - .7) / .1 : u < .95 ? 1 : (1 - u) / .05, hrs = u => u < .8 ? 6 + u / .8 * 12 : (18 + (u - .8) / .2 * 12) % 24;
        const clock = u => { const h = hrs(u); return (u < .8 ? '☀️ ' : '🌙 ') + String(Math.floor(h)).padStart(2, '0') + ':' + String(Math.floor(h % 1 * 60)).padStart(2, '0') };
        const dstr = d => `Year ${2026 + Math.floor(d / 84)} · Month ${Math.floor(d % 84 / 7) + 1} · Day ${d % 7 + 1}`;
        const job = (k, id) => S.jobs.find(j => j.k == k && j.id == id), addJob = (k, id, n, x) => S.jobs.push(Object.assign({ k, id, left: n, tot: n }, x));
        function toast(t) { S.log.unshift(t); const e = $('toast'); e.textContent = t; e.className = 'on'; clearTimeout(toast.t); toast.t = setTimeout(() => e.className = '', 2600) }
