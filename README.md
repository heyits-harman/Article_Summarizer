# Extension Demo

A small browser extension demo containing a popup, options page, content script, and background script. This repository is a minimal example for experimenting with extension APIs and building small utilities.

## Contents

- `manifest.json` — Extension manifest and permissions.
- `background.js` — Background/service worker script (event/page lifecycle handlers).
- `content.js` — Content script injected into web pages.
- `popup.html` / `popup.js` — Popup UI shown when the extension icon is clicked.
- `options.html` / `options.js` — Options page for persistent settings.

## Installation (Development)

1. Open Chrome (or Edge) and go to `chrome://extensions/`.
2. Enable "Developer mode" (top-right).
3. Click "Load unpacked" and select this project folder (the folder containing `manifest.json`).
4. The extension should appear in the toolbar; use the puzzle icon to pin it.

After making changes to scripts or HTML, click the reload button on the extension card in `chrome://extensions/` to apply updates.

## Usage

- Click the extension icon to open the popup (`popup.html`).
- Open the extension Options to change settings saved by `options.js`.
- The content script (`content.js`) runs on pages configured in `manifest.json` — inspect the page to see its effects.

## Development notes

- Check `manifest.json` to review permissions and the content script match patterns.
- If your background script is a persistent background page (Manifest V2) or a service worker (Manifest V3), lifecycle behaviours differ — consult Chrome extension docs when updating.
- Use the browser console and extension background console for debugging:
  - Inspect popup: right-click popup → Inspect
  - Inspect background: open the extension in `chrome://extensions/` and click "background page" or "service worker" (Inspect views)

## Contributing

This is a small demo — feel free to experiment. For larger changes, open an issue or submit a PR describing the goal.

## License

Specify a license if you plan to share this project (e.g., MIT). Currently unlicensed.

---
Generated README for local extension development.
