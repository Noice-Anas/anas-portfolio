# CLAUDE.md — project notes

Guidance for AI-assisted work on this repo. Read this before making changes.

## What this is

A single-page personal portfolio for **Anas Alhalabi** — a mobile-first
**freelance Software Engineer** (iOS/iPadOS in Swift/SwiftUI, Next.js/TypeScript
web, and backend APIs; open to opportunities). Vanilla HTML/CSS/JS, no runtime
dependencies. There is **one small build step** — `npm run build` generates the
static Arabic page `index-ar.html` (see **Build & i18n architecture** below); the
shipped site itself stays pure static HTML/CSS/JS. Deployed on **GitHub Pages**
from the `Noice-Anas/anas-portfolio` repo via a **GitHub Actions workflow**
(`.github/workflows/deploy.yml`), served at the custom apex domain
**`https://noiceanas.com/`** (a `CNAME` file holds the domain; the underlying
Pages URL `noice-anas.github.io/anas-portfolio` still exists but redirects).
Canonical, OG, `hreflang`, `sitemap.xml`, `robots.txt`, JSON-LD `Person` schema
and Umami analytics all point at `noiceanas.com`. Built on the MIT-licensed
**vCard** template by codewithsadee, re-themed (teal/cyan accent), given a
floating pill navbar, and populated with real content.

Real identity data: GitHub `Noice-Anas`, LinkedIn `anas-al-halabi`, personal-brand
site `noiceanas.com` — which **is** this portfolio's deploy host (the custom domain
was migrated here from the older `Noice-Anas/MyWebsite` repo, now archived and served
at `https://noice-anas.github.io/MyWebsite/`). Based in
Riyadh, Saudi Arabia. Source data lived in `~/Desktop/LinkedIn Expert` (CV, GitHub
README) — not part of this repo.

## Architecture

- **`index.html`** — one page. Each tab is an `<article data-page="…">`; the
  navbar buttons carry `data-nav-link`. `assets/js/script.js` toggles the
  `.active` class to show one article at a time (no routing, no reloads).
- **`assets/css/style.css`** — all styling. The design system is CSS custom
  properties in the `:root` block at the top. Accent colour = `--accent` /
  `--accent-2` and the `--*-accent*` gradients. Mobile-first; breakpoints at
  450 / 580 / 768 / 1024 / 1250 px.
- **`assets/js/script.js`** — sidebar toggle, project filter + custom select,
  contact-form validation with a `mailto:` fallback, tab navigation, the **i18n
  engine**, and **scroll-reveal animations**. All selectors are null-guarded.
- **`assets/js/i18n-data.js`** — the **single source of truth** for EN/AR
  translations (`I18N = { en, ar }`). Loaded as a plain `<script>` **before**
  `script.js` (exposes `window.I18N`) and also `require()`d by the build script.
  It used to live inline in `script.js`; it was extracted so the browser and the
  build share one dictionary. See **Build & i18n architecture** below.

## Build & i18n architecture

- **Why a build step at all.** The site's Arabic is normally applied by JS at
  runtime (`applyLang('ar')`), so the HTML a crawler downloads is English — Arabic
  never got indexed. `npm run build` (→ `scripts/build-i18n.js`) fixes that: it
  parses `index.html`, bakes the `I18N.ar` strings into every `data-i18n` /
  `data-i18n-html` / `data-i18n-ph` node (mirroring `applyLang` exactly), fixes the
  `<head>` for the Arabic URL (title, description, canonical → `/index-ar`, OG,
  `og:locale ar_SA`), and writes **`index-ar.html`** — a real static Arabic page
  Google can index. Uses one dev-only dep, `node-html-parser` (never shipped).
- **Language lock.** The generated page carries `data-lang-lock="ar"` on `<html>`.
  On load, `script.js` honours that lock over everything else (saved preference,
  crawler default) so `/index-ar` stays Arabic for *every* visitor — a returning
  visitor whose `localStorage.lang` is `en`, and a JS-rendering crawler with no
  `localStorage`. It also skips persisting, so viewing the Arabic page doesn't
  overwrite the visitor's own preference for the main SPA. The main `index.html`
  has no lock and keeps its saved-preference behaviour.
- **`index-ar.html` is a BUILD ARTIFACT.** It is **git-ignored** and **never
  hand-edited**. To change Arabic content, edit `assets/js/i18n-data.js` (or the
  English structure in `index.html`) and re-run `npm run build`. CI regenerates it
  on every deploy, so the live Arabic page can't drift from source.
- **Adding / changing a translated string:** add the `data-i18n*` attribute in
  `index.html` **and** the key to **both** `en` and `ar` in `i18n-data.js`. If a
  key is missing from `I18N.ar`, `npm run build` prints it and exits non-zero
  (CI fails) — so the Arabic page is never silently half-translated.
- **CI/CD.** `.github/workflows/deploy.yml` runs on every push to `main`:
  `npm ci` → `npm run build` → rsync the deployable files into `_site/`
  (excluding `node_modules`, `scripts`, `package*.json`, docs) → deploy to Pages.
  **Repo setting required once:** Settings → Pages → Source → **"GitHub Actions"**
  (not "Deploy from a branch"). The `CNAME` custom domain carries over.
- **Local preview:** run `npm run build` first (so `index-ar.html` exists), then
  `python3 -m http.server 8000`.
  engine**, **scroll-reveal animations**, and the **phone anti-scrape assembly**
  (see below). All selectors are null-guarded.

## Phone number (anti-scrape)

- The phone number is **never plaintext in the static HTML** — not the visible
  text, not a `tel:` href. Both contact spots (sidebar + Contact tab) use an
  `<a class="js-phone">` with an inner `<span class="js-phone-value"
  data-nosnippet>`. The `assemblePhone()` IIFE at the end of `script.js` holds
  the digits as a `phoneParts` array, builds the `tel:` href + display text at
  runtime, and fills both. This keeps the number out of the raw HTML that dumb
  scrapers / non-JS AI crawlers read, while real visitors still get a working
  tap-to-call link.
- `data-nosnippet` is the **Google-specific** lever: Googlebot renders JS and
  would otherwise re-expose the assembled number in the search snippet (this is
  what put "Phone +966…" in the SERP). Keep the span wrapper — `data-nosnippet`
  only works on `span`/`div`/`section`, not on the `<a>`/`<li>`/`<p>`.
- **To change the number:** edit `phoneParts` in `script.js` (that's the single
  source for the page). The **vCard** (`assets/anas-alhalabi.vcf`) and its **QR**
  (`contact-qr.svg`) still carry the number in plaintext by design (deliberate
  "add me to contacts" download) — regenerate those together if it changes.
- **Search snippet is cached hard.** The code change won't clear the old SERP
  snippet until Google re-crawls — request re-indexing in Search Console.
  `robots.txt` is the only element-agnostic lever for compliant AI bots
  (GPTBot/ClaudeBot/CCBot/Google-Extended) and is path-level, not per-field.

## Fonts & icons (self-hosted, no CDN)

- **Fonts.** Latin body = **Poppins** self-hosted from `assets/fonts/poppins/`
  (weights 300/400/500/600, latin + latin-ext) via `@font-face` in the `#FONTS`
  block at the top of `style.css`. Arabic = **Year of Handicrafts** self-hosted in
  the `#RTL` block. No Google Fonts `<link>`. To add a weight, drop the woff2 in
  `assets/fonts/poppins/` and add a matching `@font-face` (copy an existing one,
  keep the `unicode-range`s and `font-display: swap`).
- **Line icons = an inline SVG sprite.** A hidden `<svg>` of `<symbol id="i-…">`
  sits right after `<body>` in `index.html`. Each icon is
  `<svg class="icon" aria-hidden="true" focusable="false"><use href="#i-NAME"></use></svg>`.
  The `.icon` base rule (in `#RESET`) makes it a 1em square that inherits color via
  `fill: currentColor` (outline glyphs carry their own `stroke="currentColor"`), so
  the old per-icon `font-size`/`color` rules still drive size/color. **To add an
  icon:** add one `<symbol>` to the sprite (Ionicons v5 viewBox is `0 0 512 512`)
  and reference it with `#i-NAME`. No web component, no `ion-icon` tag.
- **Brand/tech logos = local SVGs** in `assets/images/devicon/` (from Devicon, brand
  fill baked into the root `<svg>`), used as `<img class="skill-tile-icon">`. Next.js
  is baked light so it reads on the dark tiles. To add one, save the SVG there and
  add an `<img>`.
- **Favicon = the "AA" tile** (`assets/images/favicon.svg`, dark rounded square with
  "AA" in the teal→cyan gradient), referenced by both `index.html` and
  `portfolio-pricing/index.html` as `rel="icon" type="image/svg+xml"`. This is the
  browser-tab mark site-wide. **Note the split:** the tab icon is the "AA" tile, but
  the pricing page's *in-page* brand mark (`.dot`) is the **avatar** (`my-avatar.webp`,
  rounded to match `.avatar-box`) — the abstract mark reads better at 16px, the face
  reads better as an on-page logo.

## Deep links & URL variants

- Pretty-URL directories (`about/`, `resume/`, `projects/`, `ar/`, `formal/`, …)
  are static stubs that `<meta refresh>` + JS-`location.replace` to the SPA with a
  query/hash (`?page=…`, `?lang=…`, `?formal`). `script.js` reads `?page=`/`#hash`
  to open a tab and `?lang=`/`#ar` to set language on load. Add a new stub by
  copying an existing one and changing the redirect target + `<title>`/`canonical`.
- **`/index-ar` vs the `ar/` stub — don't confuse them.** `/index-ar`
  (`index-ar.html`, generated — see **Build & i18n architecture**) is the **real,
  crawlable, self-canonical Arabic page** that search engines index; it reclaims
  the exact URL the old MyWebsite ranked for. The `ar/` directory is just a
  `noindex` redirect stub to `?lang=ar` (JS-rendered Arabic, a convenience for
  humans). Only `/index-ar` is in the sitemap and paired via `hreflang`.
- **`404.html`** — GitHub Pages serves it for any unmatched URL. It is
  **self-contained** (inline CSS) and uses **root-absolute** asset paths (`/…`),
  because Pages serves it at arbitrary paths where relative `./…` would break. It
  is `noindex` and does **not** redirect (returning real 404 content avoids a
  soft-404). Links back to `/` and `/index-ar`.
- **Formal variant (`?formal`, or the `/formal/` stub)** — a shareable link that
  serves the site with **no Resume tab and no CV download**, for contexts where the
  CV is provided officially instead. Handled in `script.js`: it adds `.is-formal`
  to `<html>` and **removes** the Resume nav button + `data-page="resume"` article
  from the DOM *before* the navigation code captures `pages`/`navigationLinks`, so
  the tab can't be deep-linked (`?formal&page=resume` falls back to About). The
  `/formal/` stub is `noindex`. Normal links still show Resume; `/resume/` still
  opens it.

## Portfolio-pricing page (`/portfolio-pricing/`)

- **A standalone page, NOT a SPA tab or a redirect stub** — this is the one place
  that breaks the "everything is `index.html`" rule. `portfolio-pricing/index.html`
  is a complete HTML document, **hand-maintained directly in the repo** (edit the
  file; there is no build step and no generator — an earlier scratchpad generator
  was removed because session-bound tooling is not a source of truth). It's a
  client-facing sales sheet for the freelance portfolio-building service (three
  tiers + maintenance + add-ons + "what I need from you" + special-request) and
  **`noindex`** (a "hidden" page shared by URL / referral link; keep it out of
  `sitemap.xml`).
- **Hidden entry point:** the only in-site link is an easter-egg — clicking the
  sidebar **avatar** (`.avatar-box img`) navigates to `portfolio-pricing/`. It's a
  JS-only handler at the end of `script.js` (`avatarPricingEntry` IIFE, next to
  `assemblePhone`) with no href/cursor/affordance, and binds the image only (not the
  globe language toggle that shares `.avatar-box`). There is no footer/nav link.
- **It inherits the site's design system** — do not hardcode colours/fonts here.
  The page `<link>`s `../assets/css/style.css`, so it gets the `:root` tokens, the
  self-hosted `@font-face` (Poppins + Year of Handicrafts), the reset, `::selection`,
  focus styles, custom scrollbar, and the **automatic Arabic font via
  `html[lang="ar"]`** — re-theming the site (accent, fonts) cascades here for free.
  The page's own `<style>` holds **layout only**; every colour is a site token
  (`var(--accent)`, `var(--white-2)`, `var(--onyx)`, `var(--jet)`, …) or derived
  from one with `color-mix()` (accent tints, translucent borders). Page-local
  convenience vars (`--pp-grad`, `--pp-soft`, `--pp-card`, `--pp-r`, …) are defined
  on `.wrap` and all reference site tokens.
- **Inheritance gotchas (why the page dodges/overrides a few site rules):** linking
  `style.css` drags in bare-element rules meant for the SPA. Two matter here:
  `span { display:block }` and `a { display:block }` (reset) would stack the
  headline spans and footer links — overridden by `h1 span, .head-meta span,
  .foot a { display:inline }`. And `article { … ; display:none }` (SPA tab panels)
  would **hide the cards** — so the tier cards are `<div class="card">`, not
  `<article>`. Also the site already defines a `.lang-toggle` class (the avatar
  globe badge, `position:absolute`), so this page's toggle is namespaced
  **`.pp-lang-toggle`**. Before adding a new class here, grep `style.css` for a
  collision; before relying on a bare element, check the reset. **If you edit
  `style.css`'s reset or add bare-element/`.lang-toggle`/`article` rules, re-check
  this page.**
- **Bilingual**, self-contained i18n: `data-i18n` (textContent) / `data-i18n-html`
  (innerHTML) nodes, a local `I18N = { en, ar }` dict in the inline `<script>`, a
  `[data-lang-toggle]` button, `applyLang()` sets `<html lang/dir>` (the Arabic font
  then applies automatically via the inherited `html[lang="ar"]` rule), persists to
  `localStorage` (`pp_lang`), and honours `?lang=ar|en`. **RTL is fully mirrored**
  (feature checkmarks, the "Most popular" tag, step-number chips, header alignment)
  via `[dir="rtl"]` overrides — prices/`wa.me` numbers stay LTR. Verify RTL by
  serving (`python3 -m http.server`) and toggling, never by eyeballing the EN render.
- **WhatsApp CTAs (anti-scrape, same philosophy as the phone).** Each package's
  button is `<a class="js-wa" data-wa-key="t1|t2|t3|special">`. The number is
  **never in the static HTML** — the inline script assembles it from a
  `WA_PARTS = ['966','50','037','0664']` array at runtime and builds
  `https://wa.me/966500370664?text=<encoded per-tier, per-language message>`. No-JS
  fallback: the `href` ships as `/contact/` so the button still works with JS off.
  If the phone number changes, update `WA_PARTS` here **and** `phoneParts` in
  `script.js`.
- **Referral tracking (no backend).** Give each referrer a unique link
  `noiceanas.com/portfolio-pricing?ref=<name>`. The script reads `?ref=`, shows a
  welcome chip, and **appends `(Referral: <name>)` to the prefilled WhatsApp
  message** so the source shows up in-chat. Because `ref` is a normal URL param,
  **Umami logs it too** — so referrals are attributed even for visitors who never
  click WhatsApp. The value is sanitised (`[^\w \-]` stripped, 40-char cap) before
  it's put in the DOM/URL. Use readable names, not opaque codes.

## i18n (EN / AR)

- Single page, two languages. Translatable nodes carry `data-i18n="key"` (textContent),
  `data-i18n-html="key"` (innerHTML — used where inline `<a>`/`<strong>` must survive),
  or `data-i18n-ph="key"` (input placeholder). The `I18N = { en, ar }` dictionary in
  **`assets/js/i18n-data.js`** (not `script.js` anymore) is the single source of
  truth — shared by `applyLang(lang)` at runtime and by `scripts/build-i18n.js` at
  build time. `applyLang(lang)` swaps text, sets `<html lang/dir>`, updates
  `<title>`, and persists to `localStorage`.
- The globe badge on the avatar (`[data-lang-toggle]`) flips languages. Brand names
  (Swift, Next.js, Karage, …) are intentionally left out of the dict so they stay Latin.
- **Language-matched assets.** `applyLang` also swaps the Resume tab's CV download to
  the language's PDF: the `.cv-download` link carries `data-cv-en` / `data-cv-ar`, and
  `applyLang` sets its `href` + `download` filename per language (EN →
  `assets/cv/Anas_Alhalabi_CV.pdf`, AR → `assets/cv/Anas_Alhalabi_CV_AR.pdf`). Null-guarded
  because the formal variant removes the Resume article. Same source PDFs live in
  `~/Downloads` as `Anas_Alhalabi_CV.pdf` / `Anas_Alhalabi_CV_AR.pdf` — regenerate both together.
- **RTL**: `[dir="rtl"]` overrides in the CSS mirror the article-title underline, the
  timeline dots/line, the mobile "show contacts" button, and the desktop navbar side;
  Arabic uses the Tajawal font. When adding directional CSS (`left`/`right`/`margin-left`
  …), add the matching `[dir="rtl"]` override (and at the 580/768/1024 breakpoints).
- Adding a string: add `data-i18n*` in HTML **and** the key to both `en` and `ar`
  in `i18n-data.js`, then run `npm run build` to refresh `index-ar.html`.

## Animations

- Elements with class `reveal` fade/slide in via an IntersectionObserver (staggered by
  DOM index). Skill bars carry `data-width` and fill on reveal. Everything is gated by
  `prefers-reduced-motion`.
- **Gotcha:** the page-load entrance on `.sidebar` and `.main-content` is **opacity-only**.
  A `transform` on `.main-content` makes it a containing block and breaks the
  `position:fixed` mobile navbar (it detaches from the viewport). Never add a transform
  animation to those two elements.

## Conventions

- Descriptive class/variable names; match the existing spacing and comment style.
- Nav buttons match articles by `data-target` → article `data-page` (NOT by text, so
  labels can be translated). A "Skills" button needs `data-target="skills"`.
- Project filters match by `data-filter` → item `data-category`
  (`ios`/`web`/`fullstack`/`tools` — `tools` is for Raycast/CLI/dev-tool projects like
  the Gold Price Raycast extension), also decoupled from the visible (translatable)
  label. A category needs a button in **both** `.filter-list` and the mobile
  `.select-list`, plus a `filter.<name>` key in the `en` and `ar` dicts.
- `.h4`/`.h5` use `text-transform: capitalize`; brand titles (iOS, Next.js,
  noiceanas.com) are exempted via a `text-transform: none` override — keep it when
  adding titles with intentional casing.
- External links use `target="_blank" rel="noopener"`.
- Keep the **shipped site** dependency-free. The only tooling is the build-time
  `node-html-parser` dev-dependency (generates `index-ar.html`); it is never
  served. **All fonts and icons are self-hosted — no CDN, no external origins**
  (the only third-party request is Umami analytics). See **Fonts & icons** below
  before adding either.

## Status

Content, images and links are real and the deploy URL is final (GitHub Pages,
above). The profile photo (`my-avatar.webp`), project thumbnails and app
screenshots (`project-*.webp`, `mykarage-*`, `jamaatna-*`, `4service-mobile.webp`)
and the social-share card (`og-image.jpg`, 1200×630) are all real image assets;
the `.svg` siblings (`my-avatar.svg`, `og-image.svg`) are fallbacks/sources. All
photographic screenshots are **WebP** (re-encoded from the original PNGs with
`cwebp` — ~96% smaller); if you regenerate one, keep the `.webp` extension so the
`<img src>` in `index.html` still resolves. The OG card is the exception below. The Contact tab has an **Add me to
contacts** vCard button + QR (`assets/anas-alhalabi.vcf`, `contact-qr.svg`) —
both are generated from one source, so regenerate them together if contact
details change. Search the code for `TODO` for any remaining spots.

Social-share card: `og:image` must stay a **raster** JPG/PNG at an absolute URL on
the deploy domain and under ~300 KB, or WhatsApp/iMessage/Facebook silently show
no preview. Previews only appear once the page is live at `og:url`, and are cached
hard — force a re-scrape via the Facebook Sharing Debugger after changes.

## Run

```bash
npm install                   # once — installs the build dep (node-html-parser)
npm run build                 # generate index-ar.html (do this before serving)
python3 -m http.server 8000   # http://localhost:8000
```

`SEO.md` documents the post-deploy Search Console steps and how to retire the old
`MyWebsite` from search.

## Do not

- Do not remove the template attribution or the `LICENSE` (MIT requires the
  original copyright notice stays).
- Do not run `git add` or `git commit` without an explicit instruction.
- Do not hand-edit `index-ar.html` — it is generated. Edit `i18n-data.js` /
  `index.html` and run `npm run build`.
