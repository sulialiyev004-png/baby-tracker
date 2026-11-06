# baby-tracker (Körpə gündəliyi)

Offline PWA for logging a baby's feeding, sleep, diapers and medicine. No server, no accounts, no build step.
All data lives in the phone's browser storage (localStorage). Use **Settings → Save backup** regularly.

## Files
- `index.html`, `app.js`, `style.css`: the app
- `manifest.json`, `service-worker.js`, `icons/`: install + offline support
- `icons/icon.svg`: source of the PNG icons

## Run locally
```
cd baby-tracker
python -m http.server 8000
```
Open http://localhost:8000 (Chrome DevTools → device toolbar → iPhone for a phone view).

## Updating the app later
After changing any file, bump `VERSION` in `service-worker.js` (e.g. `v1.0.1`) and push.
Installed phones pick up the new version the next time the app is opened online (sometimes it takes a second open).
