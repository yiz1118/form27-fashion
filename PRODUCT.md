# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, both inferred from the repository and pending the owner's confirmation:

- **Primary (real):** prospective clients reviewing Alson Chua's portfolio, such as fashion and lifestyle brands, founders and agencies. They judge whether he can build a memorable, working fashion commerce experience.
- **Design persona (fictional):** style-aware shoppers interested in gender-inclusive proportions, utility detail and independent labels (CASE-STUDY.md). This is a persona, not a claim about real customers.

## Product Purpose

FORM / 27 is a standalone fashion e-commerce concept for a fictional independent label and its first collection, OFF / AXIS (Collection 01, 2026). It must make the label feel real and desirable, and let a visitor discover, understand, select and add garments to a bag. Success means the visitor remembers the label and completes the browse → piece → size → bag flow, then reaches the creator credit to contact Alson.

## Positioning

Sculptural utility clothing: hard architectural lines, loose silhouettes, room for the body to move. The collection idea is OFF / AXIS: "clothes in service of movement", "change your angle", "form follows feeling".

## Operating Context

Visitors arrive from Alson's portfolio or a shared link, on desktop and phone. Many evaluate it quickly, as a showcase. Some browse it like a real store.

## Capabilities and Constraints

- **Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind 4, local fonts, Next Image. No backend, database or payments.
- **Catalogue:** eight typed products (three pants, two jackets, a shirt, a tee, a limited vest). Each has five views (front, back, construction detail, fabric, on model), size variants with illustrative availability, and integer-cent USD prices.
- **Imagery:** four campaign images (hero, colonnade, rooftop, construction detail).
- **Shop:** URL-driven filters (category, size, colour, max price) and sorting.
- **Bag and checkout:** the bag persists in localStorage with validated restore. The checkout is a demo dialog that collects nothing.
- **Other pages:** size guide (cm/in), newsletter demo that stores nothing, and a creator credit with contact links.
- **Disclosures:** concept-project labels and AI-imagery disclosures must remain visible.

## Brand Commitments

Pending confirmation:

- **Keep:** the name FORM / 27, the collection name OFF / AXIS, the product names, codes and copy lines, and the generated campaign and product imagery.
- **Replaceable:** the visual treatment (citron, Archivo Black, layout).

## Evidence on Hand

- 40 product images and 4 campaign images, with provenance in ASSET-MANIFEST.md and prompts in `assets/campaign-prompts.json`.
- No real customers, sales, reviews or press exist. Never fabricate them; the label and products are fictional.

## Product Principles

1. The garment leads: silhouette and movement are the story.
2. Shopping stays real and fast, even when the brand is expressive.
3. Honest about being a concept: disclosures stay visible.
4. Every interaction should say "change your angle".

## Accessibility & Inclusion

WCAG 2.1 AA, keyboard-complete shopping flow, visible focus, 44px targets, and a reduced-motion path that keeps gentle, non-spatial feedback rather than removing all motion.
