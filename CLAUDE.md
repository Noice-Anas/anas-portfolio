# CLAUDE.md — project notes

Guidance for AI-assisted work on this repo. Read this before making changes.

## What this is

A single-page personal portfolio for **Anas Alhalabi** — a mobile-first
**freelance Software Engineer** (iOS/iPadOS in Swift/SwiftUI, Next.js/TypeScript
web, and backend APIs; open to opportunities). Vanilla HTML/CSS/JS, no build step,
no dependencies. Deployed on **GitHub Pages** at
`https://noice-anas.github.io/anas-portfolio/` — canonical, OG, `sitemap.xml`,
`robots.txt` and Umami analytics all point there. Built on the MIT-licensed
**vCard** template by codewithsadee, re-themed (teal/cyan accent), given a
floating pill navbar, and populated with real content.

Real identity data: GitHub `Noice-Anas`, LinkedIn `anas-al-halabi`, personal-brand
site `noiceanas.com` (linked as his website, **not** the deploy host), based in
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

## Deep links & URL variants

- Pretty-URL directories (`about/`, `resume/`, `projects/`, `ar/`, `formal/`, …)
  are static stubs that `<meta refresh>` + JS-`location.replace` to the SPA with a
  query/hash (`?page=…`, `?lang=…`, `?formal`). `script.js` reads `?page=`/`#hash`
  to open a tab and `?lang=`/`#ar` to set language on load. Add a new stub by
  copying an existing one and changing the redirect target + `<title>`/`canonical`.
- **Formal variant (`?formal`, or the `/formal/` stub)** — a shareable link that
  serves the site with **no Resume tab and no CV download**, for contexts where the
  CV is provided officially instead. Handled in `script.js`: it adds `.is-formal`
  to `<html>` and **removes** the Resume nav button + `data-page="resume"` article
  from the DOM *before* the navigation code captures `pages`/`navigationLinks`, so
  the tab can't be deep-linked (`?formal&page=resume` falls back to About). The
  `/formal/` stub is `noindex`. Normal links still show Resume; `/resume/` still
  opens it.

## i18n (EN / AR)

- Single page, two languages. Translatable nodes carry `data-i18n="key"` (textContent),
  `data-i18n-html="key"` (innerHTML — used where inline `<a>`/`<strong>` must survive),
  or `data-i18n-ph="key"` (input placeholder). The `I18N = { en, ar }` dictionary in
  `script.js` is the single source of truth; `applyLang(lang)` swaps text, sets
  `<html lang/dir>`, updates `<title>`, and persists to `localStorage`.
- The globe badge on the avatar (`[data-lang-toggle]`) flips languages. Brand names
  (Swift, Next.js, Karage, …) are intentionally left out of the dict so they stay Latin.
- **RTL**: `[dir="rtl"]` overrides in the CSS mirror the article-title underline, the
  timeline dots/line, the mobile "show contacts" button, and the desktop navbar side;
  Arabic uses the Tajawal font. When adding directional CSS (`left`/`right`/`margin-left`
  …), add the matching `[dir="rtl"]` override (and at the 580/768/1024 breakpoints).
- Adding a string: add `data-i18n*` in HTML **and** the key to both `en` and `ar`.

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
- Project filters match by `data-filter` → item `data-category` (`ios`/`web`/`fullstack`),
  also decoupled from the visible (translatable) label.
- `.h4`/`.h5` use `text-transform: capitalize`; brand titles (iOS, Next.js,
  noiceanas.com) are exempted via a `text-transform: none` override — keep it when
  adding titles with intentional casing.
- External links use `target="_blank" rel="noopener"`.
- Keep it dependency-free and buildless. **All fonts and icons are self-hosted —
  no CDN, no external origins** (the only third-party request is Umami analytics).
  See **Fonts & icons** below before adding either.

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
python3 -m http.server 8000   # http://localhost:8000
```

## Do not

- Do not remove the template attribution or the `LICENSE` (MIT requires the
  original copyright notice stays).
- Do not run `git add` or `git commit` without an explicit instruction.
