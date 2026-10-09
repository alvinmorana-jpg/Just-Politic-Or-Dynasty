# Province Governor

Open `index.html` in a browser. No build step, no server needed.

Scripts are plain (classic) scripts loaded in order, so they share globals exactly like the
original single file. **Do not reorder the `<script>` tags in index.html.**

```
css/            theme, base, map, components, responsive, boot, save-slots, neighbours, rotate-guard
js/data/        country maps (PH, MY, BN, SG), game content, parties, logos, locales
js/core/        device.js (phone / tablet / PC detection), state.js (shared state)
js/modules/     game systems: forces, diplomacy, capital tension, congress, history,
                content-extra, governance, economy, power-pathways, helpers, save-load, actions
js/ui/          render, map, neighbours, tab-scroll, orientation (rotate / landscape lock)
js/main.js      boot / loader (starts the game)
```
