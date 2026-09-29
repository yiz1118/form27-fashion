# FORM / 27 — verification report

Verified on **2026-09-28**, Windows, Node.js **24.13.0**, npm **11.6.2**. The browser acceptance suite ran against a local **Next.js 16.3.6 production build** using installed Google Chrome through Playwright. The separate review preview runs at `http://localhost:3106` while its server is active.

## Command results

| Check | Result | Evidence |
|---|---|---|
| `npm run lint` | PASS, exit 0 | No ESLint errors or warnings |
| `npm run typecheck` | PASS, exit 0 | Strict TypeScript compilation |
| `npm test` | PASS, 3 tests, 0 failures | Catalog completeness; filter grouping/URL/sorting; cart restore/merge/subtotal |
| `npm run build` | PASS, exit 0 | Successful optimized build, 17 generated static pages including eight product paths |
| `npm run test:browser` | PASS, 10 tests, 0 failures | Final run: 52.2 seconds; production server on port 3105 |
| `node scripts/review-layouts.mjs` | PASS | Six viewport review sheets; metadata decode of all 40 product WebP assets |

The test run prints an environment notice about `NO_COLOR` and `FORCE_COLOR`; it does not affect the results. The browser report is saved in `playwright-report/index.html`.

## Acceptance coverage

| Requirement | Implemented behavior and verification |
|---|---|
| Original fashion concept | FORM / 27, OFF / AXIS Collection 01, original copy, monochrome concrete imagery and citron accent; visual review and concept disclosure |
| Eight page types | Home, collection, product, lookbook, campaign, about, cart and size guide render successfully; all eight product URLs return 200; an unknown product returns 404 |
| Home and editorial shopping links | Header/footer and editorial links resolve; the lookbook's final collection CTA is exercised through the browser |
| Catalog architecture | Eight typed products: three pants, two jackets, one shirt, one tee and one limited vest; stable size-variant IDs; integer-cent USD prices; one color per product; availability is fictional |
| Five-view product imagery | Front, back, construction, textile and model assets per garment; all 40 local WebP files decode; source studies visually reviewed; front/back use uncropped garment presentation |
| Campaign continuity | Four accepted v2 images generated using extracted garment front views as references; source PNGs and exact campaign prompts retained; defining cuts, collars, pockets and knee seams visually reviewed |
| Filters and sorting | Category, size, color and maximum price; OR within each group and AND across groups; featured/price ascending/price descending; result count, active filters, clear/reset, empty state, URL reload and back/forward tested |
| Product purchase flow | Available size required; unavailable XS disabled on Axis Trouser; selected state, add feedback and cart count tested; fit/material/care disclosures and size-guide links provided |
| Gallery interaction | Thumbnails, arrow keys and native mobile horizontal scrolling tested; active caption updates; reduced-motion preferences respected |
| Mobile purchase control | Sticky bar reflects selected size; selecting no size moves focus to an available size; selected variant can be added from the bar |
| Cart | Matching variants merge; sizes remain separate; quantities, removal, empty state and subtotal tested; two Axis M pieces total $296; three pieces across M/L total $444; quantity changes update totals |
| Persistence and recovery | Reload restores the bag; unknown/unavailable variants and malformed data are rejected; a browser with storage access blocked still supports an in-memory bag |
| Demo checkout | Native dialog states that no payment information is collected and no order is created; Escape dismissal and focus return tested |
| Newsletter demo | Invalid input receives an accessible error; valid input explicitly confirms that no address is saved or subscribed |
| Size guide | Typed charts for pants, jackets/vest, shirts/tee; centimeter/inch toggle; measuring guidance; scrollable table regions are keyboard focusable |
| Local assets and typography | Local responsive Next Image assets with alt text and below-fold lazy loading; Archivo, Archivo Black and Barlow Condensed served locally; OFL license provenance recorded |
| Motion | Short hover/transform transitions and native scrolling; reduced-motion check confirms automatic scroll behavior |
| Concept disclosure | Persistent frame, footer, About and case study identify the fictional project and generated imagery; no commercial results, customer claims or operational shipping promises |
| Documentation | README setup, asset manifest, this report, and CASE-STUDY.md with every requested topic |

## Responsive and visual review

All eight page types were captured at **375, 390, 430, 768, 1024 and 1440 pixels**: **48 full-page layout captures**, with recorded document widths in `artifacts/responsive/results.json`. Every capture passed the horizontal-overflow assertion. A populated cart was separately tested and captured at the same six widths, bringing the responsive evidence to **54 captures**.

The six first-viewport review sheets in `artifacts/visual-review/` were visually inspected for image crops, type scale, navigation, gallery proportions and purchase-control placement. Full-page home, collection, product, lookbook, campaign, About, size-guide and populated-cart captures were also inspected at representative narrow and wide widths. Gallery framing, deliberate editorial crops, content hierarchy, form placement and footer layout were reviewed. Mobile purchase controls leave bottom space so the final content remains reachable.

The final visual review resolved three layout defects: oversized About principle headings at narrow widths, lookbook closing copy painted behind its image, and an order-summary heading widening the populated cart. The final browser run includes checks for the lookbook CTA and populated cart at all six widths.

Five actual rendered portfolio screenshots are saved in `artifacts/screenshots/`:

| Screenshot | Capture |
|---|---|
| `fashion-hero.png` | Homepage, 1440 × 900 viewport |
| `collection.png` | Collection, 1440 px, full page |
| `product-detail.png` | Axis Trouser, 1440 px, full page |
| `lookbook.png` | Lookbook, 1440 px, full page |
| `mobile-shop.png` | Collection, 390 px, full page |

## Accessibility and keyboard evidence

Automated Axe checks found **zero violations** across all eight page types at a 390 px mobile viewport. A populated mobile cart was scanned separately with zero violations. These results are automated checks, not a claim of complete accessibility certification.

The browser suite verifies a keyboard route from collection to product, gallery selection, size selection, add-to-bag, cart quantity adjustment and checkout dismissal. Mobile navigation and filters retain focus correctly after Escape. Newsletter error feedback and reduced motion are tested.

A separate manual review in the Codex in-app browser used Enter to navigate Shop → Axis Trouser → select M → add to bag → open bag → increase quantity → open the demo summary. The visible subtotal changed from $148 to $296. Escape closed the summary and returned focus to the checkout button; its visible focus outline was inspected. No real checkout was performed.

## Reproduce the evidence

```powershell
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run test:browser
node scripts/review-layouts.mjs
```

The browser suite starts and stops its own production server on port 3105. Installed Google Chrome is required for the configured `chrome` channel. `npm run images:prepare` can reproduce the 40 product crops from the retained source sheets. The image-generation step itself is not deterministic; its saved original outputs are the asset sources.

## Verification limits

This deliverable is verified as a local portfolio concept. Physical iOS/Android devices, Safari, Firefox, screen readers and assistive-technology combinations were not tested. No hosting deployment, real inventory, order fulfillment, payment processing, mailing-list service, sales results or customer outcomes are included. Garments, prices, availability, size measurements and generated photography remain illustrative.
