# Province Governor – Philippines (APK project)

The game is split into small files under `www/`. It is plain HTML/CSS/JS (no bundler), wrapped as an Android app with [Capacitor](https://capacitorjs.com).

## Layout
```
www/
  index.html            markup + <link>/<script> tags (load order matters)
  css/                  theme → base → map → panels → controls → boot → slots
  assets/logos/*.png    party emblems (were base64 inside the HTML)
  js/
    data/    map.js (province shapes) · content.js (buildings, programs, laws, traits)
             events.js · parties.js · policies.js (party-exclusive content)
    core/    state.js · helpers.js · utils.js · save.js
    game/    forces.js · politics.js · cities.js · promotion.js · economy.js
             laws.js · actions.js · election.js · tick.js
    ui/      panels.js · menu.js · map.js
    main.js  boot sequence
```
Scripts are classic (not ES modules) and share one global scope, exactly like the original single file, so the inline `onclick="..."` handlers keep working. **Load order in `index.html` is the original order; keep it.** To add a module, create the file and add a `<script>` tag in the right place.

Run `npm run check` to syntax-check every file.

## Build the APK without Android Studio (GitHub)
1. Push this folder to a GitHub repo.
2. Open **Actions → Build APK → Run workflow**.
3. Download `province-governor-debug-apk` from the run, unzip, and install `app-debug.apk` (allow "install unknown apps").

## Build locally
Needs Node 18+, JDK 17 and the Android SDK (Android Studio installs it).
```
npm install
npm run android:add     # once
npm run icons           # optional, makes launcher icons from assets/
npm run sync
npm run apk             # → android/app/build/outputs/apk/debug/app-debug.apk
```
Or `npm run open` and use Build ▸ Build APK(s) in Android Studio.

## Notes
- The debug APK is for testing. A Play Store release needs a signed release build (keystore) and a unique `appId` in `capacitor.config.json`.
- Saves use `localStorage` inside the app's WebView; they persist between launches but are removed if the app is uninstalled or its data is cleared.
- Changing the game: edit files in `www/`, then `npm run sync` and rebuild.
