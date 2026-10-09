const boot = $('boot'), MIN_LOAD = 1600, wait = ms => new Promise(r => setTimeout(r, ms));
const TIPS = ['Press Space to pause or resume time.', 'Typhoon season (Philippines) runs from Month 7 to 12; monsoon floods hit Malaysia, Brunei and Singapore from Month 11 to 3.', 'Elections come at the end of years 3, 6 and 9.', 'Laws that fit your party are cheaper and strengthen your council seats.', 'Time pauses while you decide on an event.', 'Mines and forests run out: spread your income and rent out work crews to nearby provinces.'];
async function loadGame() {
    const t0 = Date.now(), bar = $('bpi'), st = $('bst'); $('btip').textContent = '💡 ' + TIPS[Math.floor(Math.random() * TIPS.length)];
    const steps = [['Charting the map…', () => { setView(CTRY); build() }], ['Printing party emblems…', () => Promise.all(Object.keys(PT).map(k => { const i = new Image(); i.src = PT[k].lg; return i.decode ? i.decode().catch(() => { }) : 0 }))], ['Opening your saved games…', () => migrate()], ['Drawing the map…', () => resetV()]];
    try {
        for (let i = 0; i < steps.length; i++) { st.textContent = steps[i][0]; await wait(30); await steps[i][1](); bar.style.width = ((i + 1) / steps.length * 100) + '%'; await wait(Math.max(0, (i + 1) * MIN_LOAD / steps.length - (Date.now() - t0))) }
        st.textContent = 'Ready!'; menu(); await wait(250); $('app').removeAttribute('inert'); boot.classList.add('done'); setTimeout(() => boot.remove(), 700)
    }
    catch (e) { st.innerHTML = 'Could not load the game. <button onclick="location.reload()">Reload</button>' }
}
loadGame(); side.addEventListener('pointerdown', () => lastTap = Date.now()); document.addEventListener('keydown', e => { if (e.code == 'Space' && S && !S.over && !S.ev && !/BUTTON|INPUT/.test(e.target.tagName)) { e.preventDefault(); setSp(S.sp ? 0 : S.lsp) } }); requestAnimationFrame(loop);
