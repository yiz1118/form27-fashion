# FORM / 27 creator contact layer

The shared site footer now credits Alson Chua below the existing fashion-brand footer navigation and above the legal line. It identifies FORM / 27 as an independent concept project and presents his role, location, and freelance availability in the site's existing dark, acid-yellow, editorial style.

All creator information lives in `config/creator.ts`. Its `conceptProject.name` supplies the project context in WhatsApp and email messages. The default page description and author metadata also use this source.

## Contact behavior

`Start a Project` is a native, keyboard-accessible disclosure. It opens a choice of WhatsApp and email; LinkedIn and GitHub remain visible below it. WhatsApp includes a URL-encoded FORM / 27 inquiry message. Email includes the subject `Project Inquiry — FORM / 27` and a short project inquiry body. WhatsApp, LinkedIn, GitHub, and the future portfolio link open in a new tab with `rel="noopener noreferrer"`.

No message is sent by opening the disclosure. The fictional shop and newsletter interactions retain their separate purposes.

## Add the portfolio later

Replace `portfolioUrl: null` in `config/creator.ts` with the full HTTPS URL of the main portfolio, then rebuild/redeploy the website. The `View Portfolio` link will appear automatically beside or below the primary action. Null hides the link completely, with no public placeholder.

## Future analytics

The controls expose these `data-analytics-event` identifiers:

- `creator_start_project`
- `creator_email`
- `creator_whatsapp`
- `creator_linkedin`
- `creator_github`
- `creator_portfolio`

The section exposes `data-project="FORM / 27"`. These are tracking hooks only; no analytics package or data collection was added.

## Verification

- ESLint, TypeScript, and production build passed.
- Four unit tests passed, including rendering the portfolio link with a configured URL and hiding it when null.
- Twelve store/browser tests passed, including existing shopping, navigation, reduced-motion, icon, and accessibility checks.
- The creator test passed in Windows Chrome, Windows Edge, Windows WebKit, Android Chrome emulation, and iPhone WebKit emulation.
- Each creator profile was tested at 375, 390, 430, 768, 1024, and 1440 px. Keyboard/touch disclosure, contact URLs, external-link attributes, 44 px targets, visible focus, contrast, SVG semantics, and horizontal overflow checks passed.
- Screenshots of the closed and open section are in `artifacts/creator-review/`. Existing CSS rules were preserved; added styles are scoped to creator-specific classes.
- The final source audit found no Unicode UI arrows or emoji variation selectors.

Mobile profiles are emulated. These checks do not constitute physical iPhone, Android, or macOS Safari sign-off. Contact destinations and encoded messages were verified without sending an inquiry.

## Changed files

- `config/creator.ts` — centralized identity, project name, and contact URL generation.
- `components/CreatorCredit.tsx` — creator credit, disclosure, links, conditional portfolio, and analytics hooks.
- `components/SiteFooter.tsx` — footer integration.
- `app/globals.css` — scoped responsive styling.
- `app/layout.tsx` — concept and creator metadata.
- `tests/creator.test.ts` — future portfolio visibility test.
- `tests/browser/creator.spec.ts` — responsive contact and accessibility checks.
- `playwright.creator.config.ts` — five browser profiles using existing Playwright configuration.
- `CREATOR-INTEGRATION.md` — configuration and verification guide.
