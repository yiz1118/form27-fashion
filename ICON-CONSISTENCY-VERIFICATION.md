# FORM / 27 icon consistency verification

The site's interface icons now use SVGs from its existing `lucide-react` dependency. The shared `UiIcon` wrapper applies the site's 2 px stroke, `currentColor`, `aria-hidden="true"`, and `focusable="false"`. Text labels and icon-only control labels remain available to assistive technology.

## Changes

- Replaced all 13 source occurrences of the Unicode up-right arrow (`↗`) in calls to action, cards, mobile navigation, cart, newsletter, lookbook, and the not-found page with `ArrowUpRight` SVGs.
- Replaced the product accordion's literal plus signs with `Plus` SVGs. Existing Lucide arrows, menu, close, filter, quantity, and gallery controls now follow the same decorative icon pattern.
- Replaced native dropdown arrows on shop sort and maximum-price selects with a visible `ChevronDown` SVG, retaining the native select controls and their labels.
- Expanded the mobile menu button's clickable area to 44 × 44 px while keeping the icon centered in its original position.
- Kept the newsletter arrow white, matching its original color and the site's existing palette.

The audit covers 41 application, data, script, test, and stylesheet files (`.tsx`, `.jsx`, `.ts`, `.js`, `.html`, `.css`, `.scss`, and `.mjs`). Its final result has **zero Unicode UI arrow hits and zero emoji variation selectors**. It found no icon-bearing CSS `content` declarations. The 36 remaining matches are intentional: 26 `+` characters used in calculations, CSS sibling selectors, and tooling; eight en dashes in product codes; and two ellipses in loading text. None serves as a UI icon.

## Verification

| Check | Result |
| --- | --- |
| ESLint, TypeScript, production build | Passed |
| Unit tests | 3 passed |
| Store browser suite | 11 passed, including responsive, keyboard, reduced-motion, and accessibility checks |
| Icon browser suite | 5 passed: Windows Chrome, Windows Edge, Windows WebKit, Android Chrome emulation, iPhone WebKit emulation |
| Responsive icon and overflow audit | Nine page types at 375, 390, 430, 768, 1024, and 1440 px in each browser profile; no Unicode action glyphs or horizontal overflow |
| Interaction | Desktop CTA hover, mobile navigation touch open/close, and 44 px menu touch target passed |
| Before/after visual review | 48 full-page captures per phase, across eight key routes and six widths |

The captured page metrics show no section-size, typography, border, button-height, or navigation-height change. The mobile menu's hit area intentionally grows by 4 px; its icon remains centered. A lookbook heading shifts by about 0.6 px because the adjacent SVG has a different advance width from the previous glyph.

The WebKit results are Windows engine runs with an iPhone device profile; they are **not direct tests on iPhone Safari or macOS Safari**. The Android result is Chrome device emulation, not a physical Android device. SVG icon rendering removes the Unicode emoji fallback path, but final hardware/browser sign-off still requires those devices.

An earlier run of the existing mobile-filter test hit a checkbox-state timing failure. Its isolated retry and the final full browser run passed; the cause of that intermittent failure was not established in this icon-focused change.

## Files and evidence

Changed application files: `app/globals.css`, `app/page.tsx`, `app/about/page.tsx`, `app/campaign/page.tsx`, `app/lookbook/page.tsx`, `app/not-found.tsx`, `app/size-guide/page.tsx`, `components/CartPage.tsx`, `components/Newsletter.tsx`, `components/ProductCard.tsx`, `components/ProductExperience.tsx`, `components/ShopClient.tsx`, and `components/SiteHeader.tsx`. New shared component: `components/UiIcon.tsx`.

Audit and QA files: `scripts/audit-ui-icons.mjs`, `scripts/review-icons.mjs`, `tests/browser/icons.spec.ts`, and `playwright.icons.config.ts`. The `artifacts/icon-review/` directory contains the before/after source and screenshot records, audit JSON, layout differences, and browser report.
