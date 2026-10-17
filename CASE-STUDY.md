# FORM / 27 — OFF / AXIS

**Project Name:** FORM / 27 — OFF / AXIS, Collection 01  
**Project Type:** Concept Project; fictional brand and fictional catalog  
**Industry:** Independent fashion, clothing, pants, and e-commerce  
**Target Customer:** Style-aware shoppers interested in gender-inclusive proportions, utility detail, and independent labels. This is a design persona, not a claim about real customers.

## Business Goal

Demonstrate a shopping experience in which products can be discovered, understood, selected, and added to a bag. The site also shows how a campaign and lookbook can give an independent label a distinct identity while linking back to relevant products. No sales or conversion outcomes are claimed.

## Visual Identity

FORM / 27 explores sculptural utility through hard architectural lines and loose silhouettes. The redesign, **The Axis Plan**, draws the store as an architect's plan: lettered column axes, numbered rows, title blocks, section cuts, elevations with dimension strings, and a door schedule for the catalogue. Each of the eight pieces is pinned to its own axis and rests a few degrees off it until the visitor engages, when it registers square. Paper, concrete and poché black carry the sheet; citron is reserved for the active state and the one off-axis line. Mona Sans (variable width) carries display type and stretches with scroll speed; Martian Mono carries dimensions and sheet notes. Editorial photography uses concrete, strong shadows, and deliberately asymmetric cropping. The label, merchandise, campaign, and photography were created for this concept.

## UX Strategy

The campaign occupies the first impression, while Shop remains one clear action away. Collection filters are direct and shareable through the URL. Product cards use model imagery to make silhouette legible before the detail page. Motion explains the product rather than decorating it: the hero axis follows the pointer, the pieces rail travels A→H, the elevation re-measures for a chosen size, the gallery turns under a drag, and a purchase flies into the bag. Mobile navigation and filters use native modal dialogs. Reduced-motion preferences are respected by default, and a visible MOTION toggle lets visitors choose.

## Product Architecture

Eight typed products cover three pants, two jackets, a shirt, a tee, and a limited vest. Catalog records contain integer-cent USD pricing, a single color, five gallery views, size variants, fit, material, care, and descriptive copy. Category, size, color, and price filters live in query parameters. Bag entries refer to stable variant IDs and are validated when restored from local storage.

## Product Detail Strategy

Each garment offers separate front, back, construction, fabric, and model views. The purchase panel makes price, color, size availability, fit, materials, care, and the size guide accessible before adding to the bag. A size must be selected; unavailable options are visibly disabled. The gallery is intentionally larger than the text panel on desktop. A compact purchase bar keeps the selected piece visible on mobile.

## Mobile Strategy

The same catalog and cart flow work at narrow widths. Navigation and filters open as keyboard-accessible dialogs. Product imagery gets the largest share of the viewport; galleries use native horizontal scrolling with thumbnails and arrow-key support. The purchase bar reflects the selected size and moves focus to size selection when needed. Layouts are checked at 375, 390, 430, 768, 1024, and 1440 pixels. These are browser viewport checks; physical-device testing is not claimed.

## Technology

Next.js App Router, React, TypeScript, Tailwind CSS, Motion for React, project-local variable fonts, Next Image, Playwright, and a small set of pure catalog/cart utilities. Data is local and simulated. The checkout summary collects no payment information or order details. Newsletter interaction stores no addresses.

## What This Project Demonstrates

This concept demonstrates brand direction, campaign composition, editorial page design, structured e-commerce data, purchase-path UX, responsive implementation, and production-build testing. All merchandise, inventory, measurements, model photography, and brand statements are illustrative. AI-generated images were reviewed for visual consistency and prepared as separate gallery assets; they are not photographs of manufactured products.
