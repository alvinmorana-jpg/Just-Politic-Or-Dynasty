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

## Releasing an update
1. Edit the game files.
2. Run `python3 tools/bump-version.py` (stamps a new version into `sw.js` and `version.json`).
3. Upload everything. Players with the old version see an **Update available** banner.

Notes: the update system needs the game served over **https** (or localhost). Opening `index.html`
straight from disk still works, but there is no offline cache or update banner.

## Android app: updating without uninstalling
Android only installs an APK **over** the old one if all three match:
1. **Same app id** (`appId` in `capacitor.config.json`) - never change it.
2. **Same signing key** - sign every release with the same keystore (keep it in GitHub Secrets). Debug builds
   made fresh on each CI run use a new key every time, and Android then refuses the update ("App not installed").
3. **Higher `versionCode`** in `android/app/build.gradle` (e.g. use the GitHub run number).

In-app: set `githubRepo` in `js/config.js`. When a newer Release exists the app shows
**Update available -> Download**; the player installs the APK and keeps their saves
(saves live in app storage, which survives an in-place update).
Name each Release/tag with the build number printed by `tools/bump-version.py` (e.g. `build 6`).
