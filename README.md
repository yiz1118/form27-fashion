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

The shop uses URL parameters for category, size, color, price, and sorting. Options within one group combine, while separate groups narrow results together. Product variants use stable IDs. The bag persists in `localStorage`, rejects invalid or unavailable restored variants, and merges repeated additions of the same size. The size guide shows illustrative garment measurements in centimeters or inches.

The campaign, lookbook, product content, and category-specific size charts live in `data/`. The product gallery uses five separate images per item, extracted from AI-generated source studies in `assets/source-sheets/`. Mobile galleries support native horizontal scrolling, thumbnails, and arrow keys. The purchase bar reflects the selected size. Campaign images were regenerated using the garment references; originals, exact prompts, and reference filenames are preserved in `assets/campaign-references/` and `assets/campaign-prompts.json`. Image and font provenance is recorded in [ASSET-MANIFEST.md](./ASSET-MANIFEST.md).

The newsletter only demonstrates validation and does not save addresses. The checkout button opens a demo summary. The site is marked `noindex` because it is a portfolio concept and has no live store operations.

## Project structure

```text
app/                 Eight page types, global design and metadata
components/          Navigation, catalog controls, gallery, purchase and bag UI
data/                Typed fictional product and editorial content
lib/                 Filter serialization and cart logic
assets/source-sheets/ Original generated five-view garment studies
assets/campaign-references/ Original reference-based campaign images
public/images/       Optimized garment views and campaign imagery
scripts/             Repeatable image extraction
tests/               Unit and production browser acceptance tests
artifacts/screenshots/ Portfolio captures after browser tests
artifacts/responsive/ All eight page types at six requested widths
```

Read [CASE-STUDY.md](./CASE-STUDY.md) for the design rationale. Read [VERIFICATION.md](./VERIFICATION.md) for current test evidence and known limits.
