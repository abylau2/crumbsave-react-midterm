# CrumbSave

**Public demo:** https://abylau2.github.io/crumbsave-react-midterm/  
**Source repository:** https://github.com/abylau2/crumbsave-react-midterm

**Good food, another chance.** CrumbSave is an independently built React midterm project: a fictional surplus-food Surprise Bag marketplace for Almaty. Visitors can browse demo offers, create a demo listing, and save a demo reservation. No real shops, payments, or pickup bookings are involved.

## Features

- 120 fan-inspired seeded listings from 52 iconic food ideas: 20 per category across Bakery, Meals, Produce, Desserts, Groceries, and Drinks. These are unofficial references with fictional sellers.
- Search by title, business, description, district, or pop-culture source; category, district, price, and availability filters; deterministic sorting; 12 results per page.
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
  data/fanConcepts.js     52 named food concepts and hand-written variants
  data/seedBags.js        deterministic 120-record demo catalog
  components/             reusable navigation, catalog, cards and states
  hooks/useBags.js        loading/error/success catalog hook with cleanup
  pages/                  route-level experiences
  utils/                  catalog and validation functions
  styles/                 tokens, global rules, layout, components, responsive
public/images/fan-food/   52 locally stored reference images
public/fonts/             locally stored DM Sans and Newsreader fonts and OFL licenses
tests/                    focused unit and browser smoke tests
```

## Simulated API and persistence

All business data access goes through `src/api/bagsApi.js`: `getBags`, `getBagById`, `createBag`, `reserveBag`, and `getReservations`. Calls take about 450 ms and accept an optional `AbortSignal`. Returned values are copies so components cannot accidentally mutate storage. `reserveBag` reads the current state at commit time and writes the reduced quantity and reservation together. `createBag` validates fields again at the API boundary and uses a UUID for the new listing.

The first API read seeds `localStorage` with 120 meaningful records. The existing storage key is versioned internally. On migration from the original generic catalog, old `seed-` listings are replaced with new `fan-` listings while user-created `bag-` records and reservation snapshots remain. Reservations for retired seed listings are marked as archived, with their original details still visible. A stored empty array remains empty. Created bags, reduced quantities, and reservations survive refresh in the same browser. Browser storage can be cleared by the user, so this is a demo rather than a shared account system. To reset intentionally during development, run `localStorage.removeItem('crumbsave:demo:v1'); location.reload()` in DevTools. The API also exports `resetDemoData()` for tests.

To exercise the transient catalog error and retry state, open DevTools on the local app, run `sessionStorage.setItem('crumbsave:fail-next', 'getBags'); location.reload()`, then click **Try again**. This causes one request to reject and does not erase saved data.

## React architecture

`App.jsx` owns only the catalog preference object so filters and page selection survive a trip to a detail route. `HomePage` derives filtered, sorted, paginated records from the API result. `useBags` owns catalog request state and cancels its effect when it is replaced or unmounted. Detail and reservation pages load asynchronously with effect cleanup. `AddBagPage` owns controlled input values, field errors, and submission status. See [DEFENSE_GUIDE.md](DEFENSE_GUIDE.md) for live-defense explanations.

## Deployment

`vercel.json` supplies the SPA rewrite for Vercel. `public/_redirects` supplies the same fallback for Netlify. Both work with the root Vite build. Connect this repository to either host, use `npm run build`, set the publish directory to `dist`, and verify a direct refresh on `/bags/fan-001` and `/reservations`. No environment variables or backend service are required.

The public demo is deployed to GitHub Pages from the `gh-pages` branch. Run `npm run build:pages` to create `dist-pages` with the correct repository base path. `scripts/write-pages-fallback.mjs` writes a `404.html` redirect: GitHub Pages first responds with its missing-page status for a nested URL, then redirects to the root document, where `main.jsx` restores the route before React mounts. The final page works after refresh; Vercel or Netlify is still preferable because their rewrite rules serve nested routes directly without this intermediate redirect.

## Images and fonts

The 52 concept images in `public/images/fan-food` now depict scenes or food from the referenced films, series, and games. The Beef Wellington image comes from Gordon Ramsay's official Hell's Kitchen site. These images are third-party copyrighted material; their use is not licensed for commercial publication. Known image sources and the attribution limits are documented in [IMAGE_CREDITS.md](IMAGE_CREDITS.md). The older 16 Unsplash photos remain available for archived reservations and for newly created bags. DM Sans and Newsreader are served locally with their OFL licenses in `public/fonts/`. The images do not represent real marketplace offers or official franchise partnerships. Image URLs include a version suffix so returning visitors receive updated assets.

## Limits

This is one browser's student demo. Listings are fictional and cannot be booked in real life. There is no login, shared backend, payment, food-safety guarantee, QR pickup ticket, or physical collection verification. `localStorage` persistence is limited to the current browser profile and origin.
