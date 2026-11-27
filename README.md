# Cartiva v1.1 — Progressive Web App

A responsive grocery shopping PWA for Android, iPhone, tablets and desktop browsers.

## Features
- Nine grocery categories and starter grocery items
- Categories start collapsed each time Cartiva opens; expand or collapse manually
- Delete icon at the start of every item row (built-in and custom items)
- Add custom items under each category
- Quantity selector from 1 to 10
- Quantity × unit price = calculated item price
- Running shopping total at the top and bottom
- Budget tracking in South African rand (R)
- Category, checked-item and unchecked-item filters
- Global A–Z sorting
- Shopping progress, hidden when filtering checked/unchecked items
- Save multiple named shopping lists, reopen them and delete saved copies
- Share the current list using the device's native share sheet where supported
- Local device saving; checking an item does not clear quantity or prices
- Reset Checklist clears budget, checked state, quantities and unit prices; custom/deleted items and saved lists remain
- Offline app shell after first successful load
- Responsive layouts, iPhone safe-area spacing and touch-friendly controls

## Sharing note
On supported browsers, Share opens the operating system's share sheet. The user can then choose an available contact or app (for example WhatsApp, Messages or email). A standard web app cannot silently read or browse the phone's contacts database. If Web Share is unavailable, Cartiva copies the list text to the clipboard where supported, with a fallback copy method.

## Data and privacy
The current working list and saved lists are stored in this browser on this device using localStorage. They are not synchronised between devices. Clearing browser site data may remove them. Sharing sends only when the user chooses a destination in the native share interface.

## Run locally
A PWA requires HTTPS or localhost (opening index.html directly with `file://` will not enable installation or service-worker offline caching).

From this folder, run:
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`.

## Publish online
Upload the contents of this folder to a static web host that provides HTTPS (for example GitHub Pages, Netlify or Cloudflare Pages). Open the deployed HTTPS address on your phone.

## Install
- **Android / Chrome:** open the HTTPS site, then use the browser menu → Install app (or Add to Home screen).
- **iPhone / Safari:** open the HTTPS site, tap Share → Add to Home Screen.
