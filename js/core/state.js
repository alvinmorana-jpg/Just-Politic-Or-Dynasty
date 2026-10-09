const $ = id => document.getElementById(id), side = $('side'), map = $('map');
let sel = null, S = null, all = [], DIF = 'n', PARTY = 'lib', lastTap = 0; const KEY = 'pgov5'; let CTRY = 'PH', askSlot = false, delAsk = 0; const SK = n => KEY + '_s' + n;
