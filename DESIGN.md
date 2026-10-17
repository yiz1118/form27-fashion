# FORM / 27 design system — The Axis Plan

The store is drawn as an architect's plan of the concrete building where OFF / AXIS was shot. Every page is a sheet: a lettered grid, a title block, labels that read like drawing notes. Every garment rests a few degrees off its axis and registers square when you engage with it. The rules below are the contract; `app/globals.css` is the source of truth for values.

## Colour

| Token | Value | Use |
|---|---|---|
| `--paper` | `#ecebe6` | Ground of every sheet |
| `--sheet` | `#f4f3ef` | Raised plates: product frames, cart summary, dialogs |
| `--concrete` | `#d3d2cc` | Fields that hold photographs and elevations |
| `--concrete-deep` | `#c2c1ba` | Pressed and hover fields |
| `--ink` | `#121212` | Type, rules, borders |
| `--ink-2` | `#34342f` | Body copy |
| `--muted` | `#5b5b56` | Sheet notes and secondary labels (5.7:1 on paper, 4.5:1 on concrete) |
| `--hair` / `--hair-2` | ink at 13% / 32% | Plan lines, datums, dividers |
| `--citron` | `#d7f247` | The one accent: active state, highlights, the off-axis line |
| `--citron-ink` | `#5f6d00` | Citron-family text on paper where citron itself would fail contrast |
| `--poche` | `#121212` | Solid section-cut bands (the cut, the creator credit) |

Citron is never decoration. It marks what is active now (current nav axis, selected size, pressed view), the highlighted word in a display line, and the axis line itself. Never place citron text on paper.

## Type

- **Display:** Mona Sans Variable, weight 820, width 112%, tracking −0.035em, line height 0.88, uppercase. Headlines that use `StretchHeading` move along the width axis with scroll speed (84%–125%, capped to fit the container).
- **Reading:** Mona Sans at 100% width, 16–26px, line height 1.3–1.5.
- **Labels and dimensions:** Martian Mono Variable, 10–13px, weight 600, uppercase, tracking 0.04em, tabular numbers.
- Page titles scale to their own column with container units (`clamp(40px, 14cqi, 150px)`), so long words never clip.
- One highlighted word per display heading: an inline-block citron field behind the word, line height 0.84.

## Plan grid and labels

- `PlanGrid` draws the structural grid: columns lettered A–H, rows numbered 1–4, circled axis bubbles on the top and left edges. Used on the home hero and the footer; page intros carry the column lines only.
- **Sheet tags:** a page's identifying label sits in the top-right corner in a hairline box, like a sheet number.
- **Sheet notes:** every other label follows the thing it names, with a short leader rule before it (`.sheet-note`). Labels never sit above a heading as an eyebrow.
- **Datums:** elevations and the product gallery carry reference lines (ground, waistband, centre front) instead of graph paper.
- **Title blocks:** the hero and footer end in a bordered `dl` of project, sheet, collection and status.

## Components

- **Product plate** (`ProductCard`): photograph in a sheet frame with an axis bubble (A–H) and a code tag. Rests at its own angle (`--axis`, −3.4° to 3.2°), turns square with a spring on hover or focus, swaps to the front view, and shows "TURN TO FRONT · EXPLORE". No card chrome; the plate's shadow is the only elevation.
- **Buttons:** square corners, mono uppercase 12px, 54px tall (44px minimum for every control). Black, outline and citron (hero) variants. Hover colour flips immediately; the arrow travels 4px on hover and keyboard focus.
- **Schedule:** the shop's table view, styled as a door schedule: axis, code, piece, type, colour swatch, sizes, price.
- **Dialogs:** native `<dialog>` for menu, filters and checkout demo. The checkout demo carries an "Issued for review · Not for sale" stamp.

## Motion

| Token | Value | Role |
|---|---|---|
| `--ease` | `cubic-bezier(.16, 1, .3, 1)` | Settling: reveals, draws, rises |
| `--snap` | `linear()` spring with ~7% overshoot | A plate registering onto its axis |
| Motion default | spring, stiffness 260, damping 26 | `MotionConfig` default transition |

Principles:
1. Motion explains the plan: things travel along axes, register onto them, or get measured. Nothing loops.
2. Entrances land in one beat on load (≤1.3s total); navigation never waits for animation.
3. Only transforms, opacity, clip-path, stroke-dashoffset and the font width axis animate. Layout never animates, except the shop's shared-layout reflow.
4. Reveals release every animation effect when they finish (`MotionReveal`), and drawings animate outside the photograph's reveal.
5. **Reduced motion:** `html[data-motion-mode="reduced"]` removes travel, rotation, stretching, parallax, drag flings and the bag flight. Colour, opacity and state feedback stay. The OS preference is the default; the MOTION toggle (`lib/motion-pref.ts`, key `form27-motion`) lets a visitor override it either way. A no-JavaScript media fallback applies the same rules.

## Layout

- Gutter `--g: clamp(16px, 4vw, 56px)`. Breakpoints at 1050px (two columns collapse) and 800px (mobile header, single-column sheets, mobile buy bar), plus 560px for the product plan.
- The home pieces track pins only at 900px and wider; below that it is a native snap carousel.
- No horizontal page scroll at any width from 375px; wide tables and rails scroll inside their own regions.

## Accessibility commitments

- Every interactive control is at least 44px tall, with visible focus.
- Decorative drawing (axis bubbles, callouts, datums, bag flight) is `aria-hidden`; the same information is available as text (size readout with `aria-live`, frame status).
- Icons are monochrome SVG with `aria-hidden`, stroke following the text colour.
