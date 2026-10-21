# CrumbSave

**Good food, another chance.** CrumbSave is an independently built React midterm project: a fictional surplus-food Surprise Bag marketplace for Almaty. Visitors can browse demo offers, create a demo listing, and save a demo reservation. No real shops, payments, or pickup bookings are involved.

## Features

- 120 usable seeded listings: 20 per category across Bakery, Meals, Produce, Desserts, Groceries, and Drinks.
- Search by title, business, description, and district; category, district, price, and availability filters; deterministic sorting; 12 results per page.
- Individual `/bags/:id` details with a working reservation action, quantity decrement, and duplicate prevention.
- Controlled add-bag form with inline validation and an API-backed success state.
- Persistent reservations and listings in browser `localStorage`.
- Loading skeletons, error and retry, empty results, empty reservations, sold-out, success, invalid bag, and custom 404 states.
- Responsive layouts and mobile navigation.

## Stack

React 19, Vite 6, JavaScript/JSX, React Router, Lucide React, standard CSS with custom properties, a simulated Promise API, and localStorage. The application does not require a backend.

## Run locally

Requires Node.js 18 or newer and npm.

```bash
npm install
npm run dev
```

Open the URL printed by Vite. To verify the production bundle:

```bash
npm run build
npm run preview
```

`npm test` runs focused Node tests for data quality, search, combined filtering, price boundaries, sorting, pagination, form validation, seeding, creation, reservations, transient failure, and cancellation. With Python Playwright and Google Chrome installed, start the production preview on port 4173 and run `python3 tests/browser_smoke.py` for an end-to-end smoke check.

## Routes

| Route | Purpose |
|---|---|
| `/` | Editorial home and catalog |
| `/bags/:id` | Bag details and demo reservation |
| `/add` | Controlled listing form |
| `/reservations` | Saved demo reservations |
| `*` | Custom 404 |

## Project structure

```text
src/
  api/bagsApi.js          asynchronous data and persistence boundary
  data/seedBags.js        deterministic 120-record demo catalog
  components/             reusable navigation, catalog, cards and states
  hooks/useBags.js        loading/error/success catalog hook with cleanup
  pages/                  route-level experiences
  utils/                  catalog and validation functions
  styles/                 tokens, global rules, layout, components, responsive
public/images/            16 locally stored food photographs
public/fonts/             locally stored DM Sans and Newsreader font files
tests/                    focused unit and browser smoke tests
```

## Simulated API and persistence

All business data access goes through `src/api/bagsApi.js`: `getBags`, `getBagById`, `createBag`, `reserveBag`, and `getReservations`. Calls take about 450 ms and accept an optional `AbortSignal`. Returned values are copies so components cannot accidentally mutate storage. `reserveBag` reads the current state at commit time and writes the reduced quantity and reservation together. `createBag` validates fields again at the API boundary and uses a UUID for the new listing.

The first API read seeds `localStorage` with 120 meaningful records. A stored empty array remains empty; the API only seeds when the storage key is absent. Created bags, reduced quantities, and reservations survive refresh in the same browser. Browser storage can be cleared by the user, so this is a demo rather than a shared account system. To reset intentionally during development, run `localStorage.removeItem('crumbsave:demo:v1'); location.reload()` in DevTools. The API also exports `resetDemoData()` for tests.

To exercise the transient catalog error and retry state, open DevTools on the local app, run `sessionStorage.setItem('crumbsave:fail-next', 'getBags'); location.reload()`, then click **Try again**. This causes one request to reject and does not erase saved data.

## React architecture

`App.jsx` owns only the catalog preference object so filters and page selection survive a trip to a detail route. `HomePage` derives filtered, sorted, paginated records from the API result. `useBags` owns catalog request state and cancels its effect when it is replaced or unmounted. Detail and reservation pages load asynchronously with effect cleanup. `AddBagPage` owns controlled input values, field errors, and submission status. See [DEFENSE_GUIDE.md](DEFENSE_GUIDE.md) for live-defense explanations.

## Deployment

`vercel.json` supplies the SPA rewrite for Vercel. `public/_redirects` supplies the same fallback for Netlify. Both work with the root Vite build. Connect this repository to either host, use `npm run build`, set the publish directory to `dist`, and verify a direct refresh on `/bags/seed-001` and `/reservations`. No environment variables or backend service are required.

For GitHub Pages, build with `npm run build -- --base=/REPOSITORY_NAME/` and use the matching React Router basename already derived from Vite's `BASE_URL`. GitHub Pages lacks native SPA rewrites; a `404.html` fallback can render nested routes but returns HTTP 404. Vercel or Netlify is preferable for clean nested-route responses.

## Images and fonts

The 16 local food photos in `public/images` are downloaded from Unsplash and used under the [Unsplash License](https://unsplash.com/license), which permits free use without required attribution. Source URLs, matching each file stem, are recorded in [IMAGE_CREDITS.md](IMAGE_CREDITS.md). The DM Sans and Newsreader font files are served locally from Google Fonts. Every listing image is an existing local file; listing visuals and businesses are simulated examples.

## Limits

This is one browser's student demo. Listings are fictional and cannot be booked in real life. There is no login, shared backend, payment, food-safety guarantee, QR pickup ticket, or physical collection verification. `localStorage` persistence is limited to the current browser profile and origin.
