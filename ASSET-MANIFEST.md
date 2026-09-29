# Asset manifest

All fashion images were generated for this fictional concept with the built-in `image_gen` tool on 2026-09-28. No existing fashion brand imagery, product photography, or client assets were used. Generated files are concept visuals rather than evidence of manufactured garments.

## Product studies

The eight original 1536 × 1024 PNG studies are preserved in `assets/source-sheets/`. Each study depicts one described garment across front, back, construction, textile, and model views. `npm run images:prepare` extracts these into 40 project-local WebP images in `public/images/products/` without creative alterations.

| Source sheet | Garment reference used in the generation prompt |
|---|---|
| `axis-trouser.png` | Coal heavyweight cotton twill, very wide leg, angled knee seam, concrete studio |
| `fold-trouser.png` | Chalk cotton canvas, extra-wide wrap front, articulated folds |
| `line-trouser.png` | Graphite technical weave, double pleat, relaxed taper |
| `shell-jacket.png` | Chalk cropped boxy shell, funnel collar and zip |
| `frame-jacket.png` | Coal cropped utility jacket, geometric pockets |
| `plane-shirt.png` | Stone oversized poplin shirt, angular chest pocket |
| `base-tee.png` | Coal boxy heavyweight jersey tee, ribbed crew neck |
| `shift-vest.png` | Pale citron technical vest, angular pocket and two-way zip |

The shared product prompt requested a coherent five-view contact sheet, premium realistic fashion photography, directional daylight, a concrete studio, and no logo, text, or watermark. Individual prompts fixed each garment’s color, cut, material, and construction details. Source sheets and extracted views were visually checked for those features. Some generated construction views remain illustrative rather than manufacturing specifications.

## Campaign images

| Served file | Original source | References and direction |
|---|---|---|
| `public/images/campaign/hero-v2.webp` | `assets/campaign-references/hero-v2.png` | Axis Trouser, Shell Jacket, Frame Jacket, Fold Trouser; two models on concrete stairs; empty wall for HTML type |
| `public/images/campaign/campaign-one-v2.webp` | `assets/campaign-references/campaign-one-v2.png` | Axis Trouser and Shell Jacket; full-body model moving through a concrete colonnade |
| `public/images/campaign/campaign-two-v2.webp` | `assets/campaign-references/campaign-two-v2.png` | Axis Trouser, Shell Jacket, Frame Jacket, Fold Trouser; two models on a concrete rooftop |
| `public/images/campaign/lookbook-detail-v2.webp` | `assets/campaign-references/lookbook-detail-v2.png` | Axis Trouser and Shell Jacket; cropped construction study against concrete |

The accepted campaign images were generated with the extracted front-view garment images supplied as references. The exact prompts, reference filenames, original source paths, tool, and date are saved in `assets/campaign-prompts.json`. Prompts preserve the Axis Trouser's clean thigh and angled knee seam, Shell Jacket's plain zip front and funnel collar, Frame Jacket's geometric flap pockets, and Fold Trouser's wrap front. The output was visually reviewed for those defining features before acceptance. WebP versions were optimized with Sharp and retain the source compositions.

The four unreferenced first-pass PNG campaign images remain in `public/images/campaign/` as superseded studies; no application route uses them. The accepted v2 images improve continuity with the catalog. All generated fabric and construction remain illustrative, and the review does not certify manufacturing accuracy.

## Typography

`@fontsource/archivo`, `@fontsource/archivo-black`, and `@fontsource/barlow-condensed` are bundled locally. All three installed npm packages declare the **SIL Open Font License 1.1 (OFL-1.1)** and include a `LICENSE` file. Font files are served through the Next.js build; no remote font request is needed.

Archivo provides reading and navigation, Archivo Black provides display headlines, and Barlow Condensed provides editorial indices. Interface icons come from the installed MIT-licensed `lucide-react` package. The wordmark is styled text made for this concept.
