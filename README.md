# My Grocery List — Progressive Web App

A responsive grocery shopping list that can be installed on Android, iPhone, tablets and desktop browsers.

## Included
- Nine grocery categories and the supplied starter items
- Add custom items under each category
- Quantity × unit price = calculated item price
- Running shopping total shown at the top and bottom
- Budget tracking in South African rand (R)
- Category, checked-item and unchecked-item filters
- Global A–Z sorting
- Collapsible categories in Category sort mode
- Shopping progress, hidden when filtering checked/unchecked items
- Local device saving; checking an item does not clear quantity or prices
- Both Reset Checklist buttons do the same thing: clear budget, checked state, quantities and unit prices (custom items remain)
- Offline app shell after first successful load

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

## Data and privacy
The list is stored in this browser on this device using localStorage. It is not synchronised between devices and may be lost if browser site data is cleared. Export/backup and cloud sync are not included in this starter build.
