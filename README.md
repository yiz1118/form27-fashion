# FORM / 27 — OFF / AXIS

FORM / 27 is a standalone fashion e-commerce **concept project**. It presents a fictional independent label, eight illustrative garments, an editorial campaign, and a working browser-only shopping flow. Nothing is sold; checkout creates no order and collects no payment information.

## Run locally

Use Node.js 24 and npm. From this folder:

```powershell
npm ci
npm run dev
```

Open `http://localhost:3000`. The application has no secrets, external content API, database, or account service.

To run the production version:

```powershell
npm run build
npm run start -- -p 3106
```

Open `http://localhost:3106`. Stop the server with Ctrl+C when finished.

| Command | Purpose |
|---|---|
| `npm run dev` | Local development |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm test` | Catalog, filtering, and cart logic |
| `npm run build` | Production build |
| `npm run test:browser` | Production-server Playwright checks; run after `build` |
| `npm run images:prepare` | Re-extract five optimized views from the saved source sheets |

The browser suite uses installed Chrome and a local production server on port 3105. Screenshots are written to `artifacts/screenshots/`, the 48 page/width captures plus six populated-bag captures and width measurements to `artifacts/responsive/`, and test reports to `playwright-report/`. Port 3105 must be available before running the suite. After the suite, run `node scripts/review-layouts.mjs` to regenerate the six visual review sheets and decode the 40 product assets.

## Product behavior

The shop uses URL parameters for category, size, color, price, and sorting, and renders per request so a shared filter link arrives already filtered. Filter controls respond immediately and the URL follows. Options within one group combine, while separate groups narrow results together. Product variants use stable IDs. The bag persists in `localStorage`, rejects invalid or unavailable restored variants, and merges repeated additions of the same size. The size guide shows illustrative garment measurements in centimeters or inches.

The campaign, lookbook, product content, and category-specific size charts live in `data/`. The product gallery uses five separate images per item, extracted from AI-generated source studies in `assets/source-sheets/`. Mobile galleries support native horizontal scrolling, thumbnails, and arrow keys. The purchase bar reflects the selected size. Campaign images were regenerated using the garment references; originals, exact prompts, and reference filenames are preserved in `assets/campaign-references/` and `assets/campaign-prompts.json`. Image and font provenance is recorded in [ASSET-MANIFEST.md](./ASSET-MANIFEST.md).

The newsletter only demonstrates validation and does not save addresses. The checkout button opens a demo summary. The site is marked `noindex` because it is a portfolio concept and has no live store operations.

## Design direction: The Axis Plan

The site is drawn as an architect's plan of the collection. Columns are lettered axes (A–H), rows are numbered, and each of the eight pieces is pinned to its own axis. Pieces rest slightly off-axis and register square when hovered, focused or opened. Citron (#d7f247) is reserved for the active state and the one off-axis line. Mona Sans (variable width) carries display type; Martian Mono carries dimensions, sheet notes and labels. Labels follow what they name, like captions under a detail, never as eyebrows above headings. The direction and its rules are recorded in [PRODUCT.md](./PRODUCT.md), [DESIGN.md](./DESIGN.md) and `.impeccable/surfaces/app-page-tsx.md`.

## Motion and interaction

Motion uses Motion for React (`motion/react`) through `LazyMotion` with the `domMax` feature set, plus CSS and the Web Animations API.

| Surface | Interaction |
|---|---|
| Home hero | Plan lines draw, axis bubbles land, the photograph drops onto the sheet. The pointer steers the citron axis line and a live angle readout; scrolling tilts it further. |
| Eight pieces on axis | On wide screens the section pins and the rail travels A→H with scroll; a progress scale follows. Keyboard focus scrolls the page to the focused piece. Narrow screens use a native snap carousel. |
| Section headlines | Scroll speed drives the Mona Sans width axis (narrower going up, wider going down). The stretch measures its container and stops short of the edge. |
| The Axis Trouser elevation | Datum lines, dimension strings and the citron knee seam draw on; choosing a size re-measures waist, hip and inseam with counting numbers. |
| Section cut and frame stack | The colonnade photograph parallaxes and turns in its window. The top lookbook frame can be dragged away or stepped with a button; the new frame is announced. |
| Shop | Filter changes animate the plan with shared layout; PLAN / SCHEDULE switches between plates and a door-schedule table. |
| Product sheet | Drag or swipe the gallery to turn the garment, a square loupe magnifies under a fine pointer, and adding to the bag flies the current view into the bag count. |

`components/MotionReveal.tsx` still provides the one-time editorial reveals (clipped type, horizontal crop, photographic scale). Content is server-rendered and visible without JavaScript, and reveals release every animation effect when they finish. Hover colour changes are immediate; only presses and arrows travel.

### Reduced motion and the MOTION toggle

The operating-system setting is respected by default. `lib/motion-pref.ts` resolves a choice of `system`, `full` or `reduced` and stores an explicit choice in `localStorage` (`form27-motion`). An inline boot script sets `data-motion-mode` and `data-motion-choice` on `<html>` before first paint. The MOTION button in the top strip lets a visitor whose system reduces motion opt in, or anyone opt out. With reduced motion there is no travel, rotation, stretching or parallax; colour and state feedback stay. Without JavaScript, a `prefers-reduced-motion` media fallback applies the same rules.

On Windows, a site that shows no movement usually means **Settings → Accessibility → Visual effects → Animation effects** is off; browsers report that as reduced motion.

After building, run the motion checks on Chrome, WebKit and mobile emulations:

```powershell
npx playwright test --config playwright.motion.config.ts
```

This suite starts its production server on port 3108. Screenshots and traces are saved under ignored `test-results/motion/`; its HTML report is in `test-results/motion-report/`. Physical-device Safari and Android verification remains a separate check.

## Project structure

```text
app/                 Eight page types, global design and metadata
components/          Navigation, catalog controls, gallery, purchase and bag UI
components/home/     Hero plan, axis track, elevation, section cut, frame stack
components/plan/     The lettered plan grid used across the site
data/                Typed fictional product and editorial content
lib/                 Filter serialization, cart logic and motion preference
assets/source-sheets/ Original generated five-view garment studies
assets/campaign-references/ Original reference-based campaign images
public/images/       Optimized garment views and campaign imagery
scripts/             Repeatable image extraction
tests/               Unit and production browser acceptance tests
artifacts/screenshots/ Portfolio captures after browser tests
artifacts/responsive/ All eight page types at six requested widths
```

Read [CASE-STUDY.md](./CASE-STUDY.md) for the design rationale. Read [VERIFICATION.md](./VERIFICATION.md) for current test evidence and known limits.
