// Syntax-checks every <script src> listed in www/index.html and confirms the files exist.
const fs = require('fs'), vm = require('vm'), path = require('path');
const www = path.join(__dirname, '..', 'www');
const html = fs.readFileSync(path.join(www, 'index.html'), 'utf8');
const srcs = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
let bad = 0;
for (const s of srcs) {
  const f = path.join(www, s);
  try { new vm.Script(fs.readFileSync(f, 'utf8'), { filename: s }); console.log('ok  ', s); }
  catch (e) { bad++; console.log('FAIL', s, '-', e.message); }
}
for (const m of html.matchAll(/href="(css\/[^"]+)"/g)) if (!fs.existsSync(path.join(www, m[1]))) { bad++; console.log('MISSING', m[1]); }
console.log(bad ? bad + ' problem(s)' : srcs.length + ' scripts OK');
process.exit(bad ? 1 : 0);
