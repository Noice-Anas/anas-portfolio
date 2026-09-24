# CLAUDE.md — project notes

Guidance for AI-assisted work on this repo. Read this before making changes.

## What this is

A bilingual personal portfolio for **Anas Alhalabi** — a mobile-first
**freelance Software Engineer** (iOS/iPadOS in Swift/SwiftUI, Next.js/TypeScript
web, and backend APIs; open to opportunities). Vanilla HTML/CSS/JS, no runtime
dependencies. It **used to be a single-page app**; it is now a **statically
generated multi-page site** — `npm run build` expands one source template into a
real HTML document per route, in English and Arabic, under `_site/` (see **Build
& i18n architecture** below). Every page ships only its own content, navigation
is plain `<a href>` links, and the shipped site stays pure static HTML/CSS/JS.
Deployed on **GitHub Pages** from the `Noice-Anas/anas-portfolio` repo via a
**GitHub Actions workflow** (`.github/workflows/deploy.yml`) that runs **only on
pushes to the `live-deploy` branch** (see **CI/CD** below), served at the custom
apex domain
**`https://noiceanas.com/`** (a `CNAME` file holds the domain; the underlying
Pages URL `noice-anas.github.io/anas-portfolio` still exists but redirects).
Canonical, OG, `hreflang`, `sitemap.xml`, `robots.txt`, JSON-LD `Person` schema
and Umami analytics all point at `noiceanas.com`. Built on the MIT-licensed
**vCard** template by codewithsadee, populated with real content and, in
2026-09, **re-branded "Vermilion + Ink"** from the brand review in
`ignored/branding-research/brand-review.html` (see **Brand system** below).

Real identity data: GitHub `Noice-Anas`, LinkedIn `anas-al-halabi`, personal-brand
site `noiceanas.com` — which **is** this portfolio's deploy host (the custom domain
was migrated here from the older `Noice-Anas/MyWebsite` repo, now archived and served
at `https://noice-anas.github.io/MyWebsite/`). Based in
Riyadh, Saudi Arabia. Source data lived in `~/Desktop/LinkedIn Expert` (CV, GitHub
README) — not part of this repo.

## Architecture

- **`index.html`** — the **source template**, not a shipped page. It holds every
  section as an `<article data-page="…">`; navbar links carry `data-nav-link`
  plus `data-target`. `scripts/build-site.js` renders it once per route, keeping
  only that route's article and rewriting the `<head>`, the `<base href>`, the
  nav `href`s and the JSON-LD. **Hand-edit this file, never `_site/`.**
- **`assets/js/routes.js`** — the **route table**: page key → `{ en, ar,
  description }` path pair. `require()`d by the build and loaded as a plain
  `<script>` in the browser (exposes `window.PORTFOLIO_ROUTES`), so the generator
  and the runtime can never disagree about a URL. **Adding a page or a project =
  add an entry here**, plus the `<article data-page="…">` in `index.html`.
- **`assets/css/style.css`** — all styling. The design system is CSS custom
  properties in the `:root` block at the top (see **Brand system**). One shell
  breakpoint at **1000px** (profile card beside the panel above it, header card +
  floating bottom tab bar at or below it) plus a 420px tightening of the tab bar;
  everything inside the panel responds to **container queries** on the article
  (44rem / 34rem, plus 70rem for wide panels), not the viewport. `main` is capped
  at 120rem so the shell fills large desktops. `html { overflow-anchor: none }`
  keeps Back/Forward scroll restoration on the plain offset.
- **`assets/js/script.js`** — shared by every generated page: sidebar toggle,
  project filter, the **i18n engine**, legacy-deep-link resolution, project-detail
  back/Escape behaviour, the **non-blocking link analytics** (see **Analytics**),
  the phone anti-scrape assembly and the screenshot lightbox. All selectors are
  null-guarded. It still contains a **client-side SPA path** (`pushState`,
  `stateFromURL`, `popstate`, manual scroll restoration) guarded by
  `!staticRoute`; generated pages all set `data-static-route` on `<html>`, so
  **that branch never runs in production** — it is dead weight kept for now, not
  a second supported mode. Don't build new behaviour on it.
- **`assets/js/i18n-data.js`** — the **single source of truth** for EN/AR
  translations (`I18N = { en, ar }`). Loaded as a plain `<script>` **before**
  `script.js` (exposes `window.I18N`) and also `require()`d by the build script.
  It used to live inline in `script.js`; it was extracted so the browser and the
  build share one dictionary. See **Build & i18n architecture** below.

## Build & i18n architecture

- **`npm run build` is TWO stages, in order.** `scripts/build-i18n.js` bakes the
  Arabic dictionaries into the `*-ar.html` sources, then `scripts/build-site.js`
  expands those sources into the deployable `_site/` tree. Stage 2 wipes `_site/`
  first, so a renamed or deleted route can never linger. Both use the one dev-only
  dep, `node-html-parser` (never shipped).
- **Stage 2 — `scripts/build-site.js`.** For every entry in `assets/js/routes.js`,
  in both languages, it renders `index.html` / `index-ar.html` into one real page:
  sets `<base href>` for the URL's depth, stamps `data-page-default` /
  `data-lang-lock` / `data-static-route` on `<html>`, **removes every
  `article[data-page]` except this route's**, rewrites `<title>`, description, OG,
  canonical and `hreflang`, points all `data-nav-link` / `data-project-open` /
  `data-project-back` / `[data-lang-toggle]` hrefs at real URLs, inlines a
  **per-page subset of the i18n dictionary** (only the keys that page uses) in
  place of the `i18n-data.js` `<script src>`, preloads just that language's font,
  and emits route-appropriate JSON-LD (`ProfilePage` on home with the Person
  as `mainEntity`, `WebPage` / `CollectionPage` / `CreativeWork` + `BreadcrumbList` /
  `ItemList`; every node has an `@id`). Project `<title>`s come from `seo.<slug>`
  when present (keep them ≤ 60 chars with the suffix). It finishes by writing
  `sitemap.xml` with the full bilingual `hreflang` matrix. It copies `assets`,
  `working-with-me`, `portfolio-pricing`, `formal`, `ar`, `404.html`, `CNAME`,
  `.nojekyll`, `robots.txt` and `LICENSE` verbatim — **anything not in that list
  and not a generated route is NOT deployed.**
- **Why a build step at all.** The site's Arabic is normally applied by JS at
  runtime (`applyLang('ar')`), so the HTML a crawler downloads is English — Arabic
  never got indexed. `npm run build` (→ `scripts/build-i18n.js`) fixes that: it
  bakes the `ar` strings into every `data-i18n` / `data-i18n-html` / `data-i18n-ph`
  node (mirroring `applyLang` exactly) and fixes the `<head>` for the Arabic URL
  (title, description, canonical, OG, `og:locale ar_SA`). Uses one dev-only dep,
  `node-html-parser` (never shipped).
- **The build generates TWO `*-ar.html` files** via one reusable `generateArabicPage()`
  helper (a `PAGES` array drives it):
  - `index.html` + `assets/js/i18n-data.js` → **`index-ar.html`** (`/index-ar`)
  - `working-with-me/index.html` + `working-with-me/i18n.js` → **`working-with-me/index-ar.html`**
    (`/working-with-me/index-ar`) — see **Working-with-me page**.
  Both source dictionaries expose an `ar` object with `meta.title` / `meta.description`
  keys (used for the `<head>`). Adding a third bilingual static page = add a `PAGES`
  entry + a dual-export i18n module; don't fork the generator.
- **Language lock.** Each generated page carries `data-lang-lock="ar"` on `<html>`.
  On load, the page's runtime script honours that lock over everything else (saved
  preference, crawler default) so the Arabic URL stays Arabic for *every* visitor — a
  returning visitor whose `localStorage.lang` is `en`, and a JS-rendering crawler with
  no `localStorage`. It also skips persisting, so viewing the Arabic page doesn't
  overwrite the visitor's own preference. The English sources have no lock and keep
  their saved-preference behaviour.
- **The `*-ar.html` files are BUILD ARTIFACTS.** Both are **git-ignored** and **never
  hand-edited**. To change Arabic content, edit the matching i18n module
  (`i18n-data.js` / `working-with-me/i18n.js`) — or the English structure in the source
  HTML — and re-run `npm run build`. CI regenerates them on every deploy, so the live
  Arabic pages can't drift from source.
- **Adding / changing a translated string:** add the `data-i18n*` attribute in the
  source HTML **and** the key to **both** `en` and `ar` in that page's i18n module. If a
  key is missing from any `ar` dict, `npm run build` prints it and exits non-zero
  (CI fails) — so no Arabic page is ever silently half-translated.
- **CI/CD — deploys from `live-deploy`, NOT `main`.**
  `.github/workflows/deploy.yml` runs on **pushes to the `live-deploy` branch**
  (plus manual `workflow_dispatch`, which takes a `patch`/`minor`/`major` bump
  input). `main` is the working branch and **pushing to it deploys nothing** —
  shipping means merging/pushing `main` into `live-deploy`.
  The job is `npm ci` → `npm run build` → upload **`_site/`** → deploy to Pages.
  There is no rsync any more: `build-site.js` decides what is deployable.
  A second `release` job then auto-tags the deployed commit (`vX.Y.Z`, bumped from
  the latest `v*` tag) and cuts a GitHub release with generated notes — which is
  why the workflow needs `contents: write`.
  **Repo setting required once:** Settings → Pages → Source → **"GitHub Actions"**
  (not "Deploy from a branch"). The `CNAME` custom domain carries over.
- **Local preview serves `_site/`, never the repo root.** The repo root still
  contains the legacy redirect stubs (`projects/`, `skills/`, `resume/`,
  `contact/`, `about/`), and they **shadow** the real generated pages at the same
  paths: clicking "Projects" at the root lands on the stub, which bounces to
  `/?page=projects`, which the runtime rewrites back to `/projects/` — two full
  document loads and a visible flash per click — and, because both trees have
  been served from `localhost:8000`, a **cached stub can survive the switch and
  trap you in the redirect loop above**. Preview with
  `npm run build && python3 scripts/preview-server.py 8000 _site`: same as
  `http.server` but it sends `Cache-Control: no-cache`: the browser must
  revalidate every file (a fresh build answers 200, an unchanged file 304), so a
  preview always shows what was just built while fonts and images are still
  reused between pages. It used to send `no-store`, which re-downloaded every
  font and image on each tab click (text reflowed, thumbnails popped in, a
  jitter production never has) and kept pages out of the back/forward cache.
  That is what `.vscode/tasks.json` runs; after changing the server, stop the
  old one first, because the task reuses whatever already listens on 8000.
  (`playwright.config.cjs` uses a plain `http.server` on 8765 — test browsers get
  a fresh profile, so there is no cache to go stale.) **If a page ever redirects
  in a loop locally, it is a cached stub: hard-reload (Cmd+Shift+R) or clear the
  site data for localhost.**

## Brand system (Vermilion + Ink, 2026-09)

Source of truth for the look: `ignored/branding-research/brand-review.html` and
`BRAND-BRIEF.md` next to it (git-ignored, local). Rules that the code encodes:

- **Register: an app, not a landing page.** Profile card (`.sidebar`), an
  inverted **ink tab bar** (`.navbar`, the one inverted surface, so navigation
  never blends into the paper), and one rounded panel: the route's
  `article[data-page]`. On phones the card becomes a header card whose contact
  details fold behind `.info_more-btn`, and the tab bar is `position: fixed` at
  the bottom (`main` reserves its height). Never turn it into a scrolling
  slogan-hero page.
- **Tokens.** `--canvas #FCF2E8`, `--surface #FFFAF5`, `--line #DDCBBE`
  (decoration only, 1.42:1), `--ink #261913`, `--ink-2 #776052`, `--accent
  #B93618`, `--on-accent`; derived `--line-strong` (meaningful edges), `--wash`,
  `--accent-press` via `color-mix()`. Spacing `--s-1…9` (4px base), type
  `--t-display…--t-label`, radius `--r-panel 16 / --r 10 / --r-sm 8 / --r-phone 12`,
  motion `--dur-*` / `--ease-*`. The old vCard names (`--white-2`, `--onyx`,
  `--jet`, `--eerie-black-*`, `--ff-poppins`, gradients, shadows…) survive only as
  **aliases** at the end of `:root`, for the two standalone pages. New code uses
  the new tokens.
- **Accent budget.** Vermilion marks reasoning: margin-note rules and labels, the
  wordmark rule, view-title markers, link underlines, the focus ring, and one
  filled primary button per view. Navigation and selection use **ink** (tab bar,
  active filter chip). Never vermilion headings, body text, big fills or icons.
  Never put accent text on `--wash` (drops below 4.5:1).
- **Dark mode = explicit choice only.** Light is the default and the OS preference
  is ignored. The sun/moon `[data-theme-toggle]` in the profile card sets
  `html[data-theme="dark"]` and stores `localStorage['portfolio-theme']`; an
  inline `<head>` script restores it before paint (index.html, pricing,
  working-with-me, 404). All localStorage access sits inside `try`.
  `index.html`'s `<meta name="color-scheme">` is **`light`, never `light dark`**:
  before `style.css` arrives the browser paints the canvas from it, and `light
  dark` flashed a black frame on every page change for visitors whose OS is in
  dark mode. The head script switches the meta to `dark` for an explicit dark
  choice (pricing and working-with-me set `style.colorScheme` instead; they have
  no toggle); once `style.css` loads, its `:root` `color-scheme` takes over.
- **Signature: margin notes.** `<p class="note"><span class="note-label"
  data-i18n="note.decision|constraint|limit">…</span><span data-i18n="…">…</span></p>`,
  usually inside `.ann` (text + note column with a lead line; stacks under 44rem
  of panel width and mirrors in RTL by logical properties). At most one note per
  paragraph, ≤ 40 words, and only facts already in the case study or the brief's
  attribution limits. They are the only entrance animation: hidden states exist
  only under `html.notes-anim` (added by the inline head script when JS runs and
  motion is allowed, with a 2.5s failsafe; `script.js` `marginNotes()` adds
  `notes-ready` and reveals each note once via IntersectionObserver).
- **Copy rules.** First person, plain verbs, precise ownership ("owned", "led
  version two", "supported"); a "My part" line on every card. No em/en dashes in
  visible copy (use a colon, comma or full stop), no "senior/staff/lead" title,
  no invented numbers. Arabic is written, not translated.
- **Case-study template** (every `/projects/<slug>/`): back link, `.pd-head`
  (meta line, h1, `.pd-answer` answer-first summary `pd.<slug>.answer`, `.pd-chip`
  tags, external links), `dl.facts` tiles (`fact.*` labels, `pd.<slug>.f*`
  values), `.pd-hero`, then Overview / My role / What shipped / extra sections /
  "Worth a closer look", with notes `pd.<slug>.n.*`, then Screens.
- **Primary actions.** For people: **WhatsApp** (`.js-wa`, built at runtime from
  `phoneParts`, see **Phone number**); for bots: **email** (the static `mailto:`
  fallback href and `email` on the JSON-LD Person).
- **Certification.** A small always-visible `.cert-chip` in the profile card
  links to Credly; the full entry is the first Resume credential. The old large
  home-page card is gone.

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
- **WhatsApp links use the same parts.** Every `a.js-wa` ships with a
  `mailto:` href (the no-JS and bot fallback); `assemblePhone()` rewrites it to
  `https://wa.me/<digits>?text=<greeting>` (greeting per `<html lang>`, in the
  IIFE), with `target="_blank"`. They carry `data-track-event`, never
  `data-umami-event` (the static HTML has no `target`).
- **To change the number:** edit `phoneParts` in `script.js` (that's the single
  source for the page). The **vCard** (`assets/anas-alhalabi.vcf`) and its **QR**
  (`contact-qr.svg`) still carry the number in plaintext by design (deliberate
  "add me to contacts" download) — regenerate those together if it changes.
- **Search snippet is cached hard.** The code change won't clear the old SERP
  snippet until Google re-crawls — request re-indexing in Search Console.
  `robots.txt` is the only element-agnostic lever for compliant AI bots
  (GPTBot/ClaudeBot/CCBot/Google-Extended) and is path-level, not per-field.

## Fonts & icons (self-hosted, no CDN)

- **Fonts.** One family for both scripts: **IBM Plex Sans Arabic** (SIL OFL 1.1,
  licence in `assets/fonts/plex/OFL.txt`), weights 400/500/600/700, Latin and
  Arabic cuts declared under one `font-family: "Plex"` with non-overlapping
  `unicode-range`s in the `#FONTS` block of `style.css`, used via `var(--font)`.
  `build-site.js` preloads only the page language's 400 weight. Poppins and Year
  of Handicrafts were **retired** (the latter's Ministry of Culture licence does not
  allow redistribution, so it cannot be self-hosted). If you subset a font, keep the
  Arabic shaping features and render Arabic to check it.
- **Line icons = an inline SVG sprite.** A hidden `<svg>` of `<symbol id="i-…">`
  sits right after `<body>` in `index.html`. Each icon is
  `<svg class="icon" aria-hidden="true" focusable="false"><use href="#i-NAME"></use></svg>`.
  The `.icon` base rule (in `#RESET`) makes it a 1em square that inherits color via
  `fill: currentColor` (outline glyphs carry their own `stroke="currentColor"`), so
  the old per-icon `font-size`/`color` rules still drive size/color. **To add an
  icon:** add one `<symbol>` to the sprite (Ionicons v5 viewBox is `0 0 512 512`)
  and reference it with `#i-NAME`. No web component, no `ion-icon` tag.
- **Brand/tech logos** (`assets/images/devicon/`) are no longer shown: the Services
  view lists tools as grouped text whose technology names are `[data-skill-tech]`
  links into the filtered Projects view. The SVGs stay in the repo, unused.
- **Favicon = the brand tile** (`assets/images/favicon.svg`: an ink rounded square,
  a vermilion margin rule and one paper "A"), referenced by both `index.html` and
  `portfolio-pricing/index.html` as `rel="icon" type="image/svg+xml"`. This is the
  browser-tab mark site-wide. **Note the split:** the tab icon is the "AA" tile, but
  the pricing page's *in-page* brand mark (`.dot`) is the **avatar** (`my-avatar.webp`,
  rounded to match `.avatar-box`) — the abstract mark reads better at 16px, the face
  reads better as an on-page logo.

## Deep links & URL variants

- **Every route is a real page now.** `/`, `/skills/`, `/projects/`, `/resume/`,
  `/contact/` and each `/projects/<slug>/` are generated HTML documents (plus an
  `index-ar.html` sibling each) — not redirect stubs. The stub directories still
  in the *repo root* are dead source: `build-site.js` overwrites those paths in
  `_site/`. Add a route in `assets/js/routes.js`, not by copying a stub.
- **Legacy deep links are resolved by one redirect, at load.** `?page=…`,
  `#skills`-style hashes, `?lang=en|ar`, `#ar`, the `ar/` stub and the `formal/`
  stub all still work: the `staticRoute` branch of `script.js` maps them to the
  real URL and `location.replace()`s once. Two traps live here:
  - `location.replace()` **drops the entry it left but still reports it as
    `document.referrer`**, so a same-origin referrer is not proof that `history
    .back()` goes anywhere. Every redirect records its destination under
    `sessionStorage['portfolio-redirect-entry']`, and `closeProjectDetail()`
    checks `enteredByRedirect()` before preferring `history.back()` — otherwise
    "back" from a redirected project page lands on `about:blank`.
  - A hash is only treated as a route when `routes[hash]` exists, so ordinary
    in-page anchors keep working.
- **Redirect-loop guard — the stale-stub trap.** `/skills/` (and every other
  route path) *used to be* a redirect stub pointing at `/?page=skills`, and is
  now a real page. A browser still holding the cached stub serves it **without a
  network request**, so it bounces `/?page=skills` → cached stub →
  `/?page=skills` forever, and no rebuild or redeploy can clear it. This bites
  real visitors after the first deploy (GitHub Pages caches HTML for ~10 min) and
  bites locally on `localhost:8000`, which has served both trees. `script.js`
  therefore counts hops in `sessionStorage['portfolio-redirect-hops']`, stops
  after `maxRedirectHops` (2 — one hop resolves any legitimate legacy link),
  renders whatever the current document holds, and `history.replaceState`s the
  legacy params away so a reload can't restart it. Any non-redirecting load
  resets the counter. **If you add a redirect, route it through this counter.**
- **`/index-ar` vs the `ar/` stub — don't confuse them.** `/index-ar`
  (`index-ar.html`, generated — see **Build & i18n architecture**) is the **real,
  crawlable, self-canonical Arabic page** that search engines index; it reclaims
  the exact URL the old MyWebsite ranked for. The `ar/` directory is just a
  `noindex` redirect stub; it now resolves to the real `/index-ar.html` rather
  than to JS-rendered Arabic. Only the generated pages are in the sitemap and
  paired via `hreflang`.
- **`404.html`** — GitHub Pages serves it for any unmatched URL. It is
  **self-contained** (inline CSS) and uses **root-absolute** asset paths (`/…`),
  because Pages serves it at arbitrary paths where relative `./…` would break. It
  is `noindex` and does **not** redirect (returning real 404 content avoids a
  soft-404). Links back to `/` and `/index-ar`.
- **Formal variant (`?formal`, or the `/formal/` stub)** — a shareable link that
  serves the site with **no Resume tab and no CV download**, for contexts where the
  CV is provided officially instead. Handled in `script.js`: it adds `.is-formal`
  to `<html>` and **removes** the Resume nav link + `data-page="resume"` article
  from the DOM *before* the navigation code captures `pages`/`navigationLinks`.
  Because `/resume/` is now a real URL, removing its article leaves that document
  with nothing to render — so the `staticRoute` bootstrap detects
  `formal && !pages.length` and redirects to `/?formal`. The `/formal/` stub is
  `noindex`. Normal links still show Resume; `/resume/` still opens it.

## Analytics — and the `data-track-event` rule

Umami is the only third-party request on the site (same `data-website-id`
everywhere, so all pages roll up into one property). Tagging is split in two, and
**the split is load-bearing — do not "tidy" it back into one attribute**:

- **`data-umami-event` — only on links that open a new tab, and on `<button>`s.**
  Umami's tracker registers a **capture-phase** click listener on `document`. For
  any `<a>` it finds, it calls `preventDefault()`, waits for its network request
  to `cloud.umami.is`, and *then* sets `location.href` itself. Capture phase means
  it wins over every handler the page installs. On this multi-page site that put a
  **~700 ms dead pause between the tap and the page changing** (measured: 711 ms
  median on nav links vs 79 ms without), and it silently dropped the `download`
  filename on the CV and vCard links. Umami exempts `target="_blank"`, ctrl/meta/
  shift-click and middle-click from that path, so new-tab links are safe, and
  `<button>`s were never affected.
- **`data-track-event` (+ optional `data-track-event-*` props) — every same-tab
  link.** Umami never sees this attribute. `script.js` reports it from a
  `pointerdown` (and Enter/Space `keydown`) listener, which fires *before* the
  browser starts the navigation and leaves the click itself completely native.
  The two standalone pages (`/portfolio-pricing/`, `/working-with-me/`) carry the
  same ~15-line tracker at the end of their own inline `<script>`.
- **Adding a tagged link:** new tab → `data-umami-event`; same tab → 
  `data-track-event`. If a click ever feels like it hangs for half a second,
  check this first.

## Testing

`npm test` = `npm run build` + **Playwright** (`playwright.config.cjs`,
`tests/portfolio.spec.cjs`), which serves **`_site/`** on `127.0.0.1:8765` and
runs 20 tests: history/back/forward with filter + scroll + focus restoration,
skill→project deep links, legacy/formal/storage-denied links, the lightbox focus
trap, **no-JS crawlability of every EN and AR route**, layout overflow at
320/390/768/1024/1440 px in both directions, **axe WCAG AA**, and a sitemap
completeness check. The suite aborts `cloud.umami.is`, so it does **not** catch
the analytics trap above. `@axe-core/playwright` and `lighthouse` are dev-only
deps; nothing here ships.

## Portfolio-pricing page (`/portfolio-pricing/`)

- **A standalone page, NOT one of the generated route pages** — this is the one place
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
  self-hosted `@font-face` (IBM Plex Sans Arabic), `::selection`,
  focus styles, custom scrollbar, and the **automatic Arabic font via
  `html[lang="ar"]`** — re-theming the site (accent, fonts) cascades here for free.
  The page's own `<style>` holds **layout only**; every colour is a site token
  (`var(--accent)`, `var(--white-2)`, `var(--onyx)`, `var(--jet)`, …) or derived
  from one with `color-mix()`; the old vCard names resolve through the aliases at
  the end of `style.css`'s `:root`. Flat surfaces only: no gradients, glass or glow
  shadows (brand rule). `<html class="standalone">` opts the page into the vCard-era
  reset kept in `style.css`'s `#STANDALONE` block (zero specificity via `:where()`),
  and the same pre-paint `portfolio-theme` script as `index.html` carries a dark
  choice over. Same for `/working-with-me/`.
- **Inheritance gotchas (why the page dodges/overrides a few site rules):** linking
  `style.css` drags in bare-element rules meant for the SPA. Two matter here:
  `span { display:block }` and `a { display:block }` (the standalone reset) would stack the
  headline spans and footer links — overridden by `h1 span, .head-meta span,
  .foot a { display:inline }`. And `article { … ; display:none }` (route articles)
  would **hide the cards** — so the tier cards are `<div class="card">`, not
  `<article>`. The main site's `.feat` (home featured rows) would box the
  feature lists, so they are `.pp-feat`. Also the site already defines a `.lang-toggle` class (the avatar
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
- **Referral discount (specific referrers only).** `portfolio-pricing/referral-discounts.json`
  (`{ discountPercent, referrers: [...] }`) lists the referrer names that get a
  discount — matched against `?ref=` **case-insensitively**. **To add/remove a
  referrer, just edit that JSON array** — no code change needed; it's a plain
  static file, fetched client-side, no build step. When `?ref=` matches, the
  inline script (`checkReferralDiscount()`) shows the discounted price with the
  original struck through (`.orig-price`) + a `.discount-note` per tier, folds the
  discount into each tier's WhatsApp message (replaces the base price with
  `<discounted> (<percent>% off)`), and updates the ref chip copy — in both
  languages. This is **client-side display only, not enforced** (final price is
  agreed manually over WhatsApp) — treat it as a courtesy/marketing nicety, not a
  payment gate; someone could technically probe `?ref=` values, which is an
  accepted tradeoff for a no-backend static site. Fires a guarded
  `umami.track('referral-discount-applied', { ref, percent })` event.
- **Analytics.** The page loads the same **Umami** script as the main site (same
  `data-website-id` → one unified property; `noindex` does not block analytics). The
  WhatsApp CTAs carry `data-track-event="pp-whatsapp"` + `data-track-event-tier=…`
  (same-tab links — see **Analytics**; the page has its own inline tracker that
  forwards `data-track-event-*` props)
  (essential/signature/premium/special), and the lang toggle / brand link are tagged
  too — so tier interest is measurable, not just the `?ref` attribution above.

## Working-with-me page (`/working-with-me/`)

- **A standalone page like the pricing page, NOT a generated route page.**
  `working-with-me/index.html` is a complete, **hand-maintained** HTML document — a
  bilingual "personal user manual" / *"A Personal Guide to Working With Me"* (work
  rhythm, communication, feedback, decision-making, collaboration, motivation +
  a closing note). Source content lived in `~/Desktop/LinkedIn Expert/Resources/
  A personal guide to working with me.md` (not part of this repo). Unlike the
  `noindex` pricing page, this one is **`index, follow`**, self-canonical, and
  **in `sitemap.xml`** — a public "here's how I collaborate" signal for recruiters.
- **Bilingual with a REAL static Arabic page — full SEO parity with the main SPA.**
  The dictionary lives in **`working-with-me/i18n.js`** (`WWM_I18N = { en, ar }`),
  which — exactly like the site-wide `assets/js/i18n-data.js` — is **both** loaded as a
  plain `<script>` (exposes `window.WWM_I18N`, used by the inline `applyLang()` at
  runtime) **and** `require()`d by `scripts/build-i18n.js` at build time. The build
  generates **`working-with-me/index-ar.html`**, a real crawlable Arabic page at
  **`/working-with-me/index-ar`**, self-canonical, `data-lang-lock="ar"`, `og:locale
  ar_SA`. Both wwm pages carry the same **hreflang** trio (en / ar / x-default) and
  both are in `sitemap.xml`. **`index-ar.html` here is a BUILD ARTIFACT** — git-ignored,
  never hand-edited; change Arabic content in `i18n.js` and re-run `npm run build`. See
  **Build & i18n architecture** — the build now generates **two** `*-ar.html` files.
- **Shared language preference.** Unlike the pricing page (which isolates to
  `pp_lang`), this page reads **and writes the main site's `localStorage.lang`** — so
  language carries across the personal-brand site (arriving from an Arabic session
  opens in Arabic). Also honours `?lang=ar|en`. Like `/index-ar`, the generated Arabic
  page honours its `data-lang-lock="ar"` over everything and **skips persisting**, so
  viewing it never overwrites the visitor's own preference for the main SPA.
- **Layout is a BENTO grid (no ragged gaps).** A 6-track CSS grid: row 1 pairs the
  narrow **Work Style** tile (`.wwm-w2`, span 2) with the wide **Communication**
  feature tile (`.wwm-feature`, span 4) whose point-list runs in **two internal
  columns** so the feature stays as short as its row-mate instead of towering. Rows
  2–3 are equal-width pairs (span 3) of similar-length cards, and `align-items:stretch`
  equalises each row — so tiles are height-matched, not ragged. CSS Grid can't do true
  masonry with arbitrary heights, so the fix is *pairing by content length*, not
  spanning tall tiles. Collapses to one column ≤900px (feature list → 1 col); the
  feature's 2-col list also drops to 1 col in the 901–1080px band (it gets cramped).
  Verify layout changes by **serving + screenshotting EN and AR/RTL**, never by
  eyeballing the source — the RTL mirror (feature on the left, bullets right) is free
  via `dir` but must be checked.
- **Scroll-reveal animation, JS-gated so it never hides indexed content.** An inline
  `<head>` script adds `html.wwm-anim` **only** when JS runs *and* motion is allowed;
  CSS applies the hidden state (`opacity:0; translateY`) *only* under that class, so
  crawlers and no-JS visitors always get full content. An `IntersectionObserver` adds
  `.is-in` with a per-group stagger; everything is neutralised under
  `prefers-reduced-motion` (also kills the card hover-lift). **Never** set `opacity:0`
  as an unconditional base state here.
- **Inherits the site's design system** — `<link>`s `../assets/css/style.css` for the
  `:root` tokens, self-hosted `@font-face`, reset, and the automatic Arabic font via
  `html[lang="ar"]`. The page's own `<style>` is **layout only**; every colour is a
  site token or `color-mix()` of one. **Same inheritance gotchas as the pricing page:**
  the reset's `span{display:block}` / `a{display:block}` are guarded (`h1 span,
  .wwm-eyebrow span, .wwm-foot a, .wwm-point b { display:inline }`) and the guide
  cards are `<div class="wwm-card">`, **not** `<article>` (which the SPA reset hides).
  All page classes are namespaced **`wwm-`** and the lang toggle is **`.wwm-lang-toggle`**
  (the site already owns `.lang-toggle`). Section icons are **emoji** (no icon assets).
- **In-site entry point (unlike pricing's easter-egg):** the `.guide-line` at the foot
  of the Home view (`guide.desc` + the `[data-guide-link]` link `guide.link`, EN+AR in
  `i18n-data.js`); `build-site.js` points its href at the page language's edition. Because it's a translated string in
  the shared dict, **`npm run build` bakes it into `index-ar.html` too** — so adding/
  editing the About link follows the normal i18n flow (edit `i18n-data.js`, re-run build).
- **Analytics + OG.** Loads the same **Umami** script as the main site (same
  `data-website-id`). The lang toggle (a `<button>`) keeps `data-umami-event`;
  the same-tab links (`wwm-brand-home`, `wwm-cta-portfolio`, `wwm-cta-contact`,
  footer links) use **`data-track-event`** and the page's own inline
  `pointerdown` tracker — see **Analytics** for why. OG card reuses the site's
  main `og-image.jpg` (no dedicated card). Deployment: `build-site.js` copies
  `working-with-me/` verbatim (including `i18n.js` and the generated
  `index-ar.html`), so no CI change is needed.

## i18n (EN / AR)

- Two languages, one dictionary. Translatable nodes carry `data-i18n="key"`
  (textContent), `data-i18n-html="key"` (innerHTML — used where inline
  `<a>`/`<strong>` must survive), `data-i18n-aria="key"` (aria-label),
  `data-i18n-alt="key"` (image alt) or `data-i18n-ph="key"` (input placeholder).
  **All five are handled by both** `applyLang(lang)` at runtime and
  `scripts/build-i18n.js` at build time — add a new one to both or Arabic silently
  drifts. The `I18N = { en, ar }` dictionary in **`assets/js/i18n-data.js`** (not
  `script.js`) is the single source of truth; `build-site.js` inlines only the
  subset of keys each generated page actually uses. `applyLang(lang)` swaps text,
  sets `<html lang/dir>`, and persists to `localStorage`.
- The globe badge on the avatar (`[data-lang-toggle]`) flips languages. Brand names
  (Swift, Next.js, Karage, …) are intentionally left out of the dict so they stay Latin.
- **Language-matched assets.** `applyLang` also swaps the Resume tab's CV download to
  the language's PDF: the `.cv-download` link carries `data-cv-en` / `data-cv-ar`, and
  `applyLang` sets its `href` + `download` filename per language (EN →
  `assets/cv/Anas_Alhalabi_CV.pdf`, AR → `assets/cv/Anas_Alhalabi_CV_AR.pdf`). Null-guarded
  because the formal variant removes the Resume article. Same source PDFs live in
  `~/Downloads` as `Anas_Alhalabi_CV.pdf` / `Anas_Alhalabi_CV_AR.pdf` — regenerate both together.
- **RTL**: the stylesheet is written with **logical properties** (`inset-inline-*`,
  `padding-inline-*`, `border-inline-start`…), so notes, lead lines, the timeline, the
  wordmark rule and the tab bar mirror by construction. Only genuinely physical
  things get a `[dir="rtl"]` override (arrow icons, the disclosure chevron, the lead
  line's transform-origin). On Arabic pages the wordmark puts the Arabic name first
  (`html[lang="ar"] .mark-ar { order: -1 }`). Never letter-space Arabic.
- Adding a string: add `data-i18n*` in HTML **and** the key to both `en` and `ar`
  in `i18n-data.js`, then run `npm run build`. A key missing from `ar` fails the
  build.

## Animations

- **Motion layers** (all gated behind `html.notes-anim`, which the inline head
  script adds only when JS runs and motion is allowed; reduced motion kills all):
  - **Block reveal** (`blockReveal()` in `script.js`): panel blocks (featured rows,
    offer tiles, cards, facts, sections, gallery figures, timeline rows, contact
    cards, FAQ) rise in as they scroll into view, under a **panel-coloured curtain**
    (`.reveal::before`, `pointer-events: none`) that slides away. It is deliberately
    **not an opacity fade**: axe flags text held at opacity 0 or mid-fade, and a
    `clip-path` wipe made links unclickable mid-reveal (Playwright then re-scrolled
    and broke the scroll-return test). **Blocks on screen at load never move**:
    every route is its own document, so a load animation replays on every tab
    click, and since it can only start after `document.fonts.ready` it painted the
    page, snapped it down and slid it back (the old `.reveal-rise`, removed as the
    navigation jitter). Classification waits for `document.fonts.ready`; the
    observer fires on the first visible pixel; and Back/Forward loads skip it
    entirely, so the restored scroll position lands where the visitor left.
  - **Page changes** use a cross-document view transition (`@view-transition {
    navigation: auto }` in `#MOTION`): the current page stays up until the next
    one is ready, then a `--dur-fast` root crossfade. No `view-transition-name`s:
    from a page scrolled to the top, the profile card and tab bar are identical
    pixels on both sides, so only the panel visibly changes. Browsers without
    cross-document view transitions, and any navigation Chrome decides to skip
    one for, simply navigate as before. Check it with a `pagereveal` listener
    (`event.viewTransition` non-null); Playwright's new headless mode never runs
    them, the default headless shell and headed Chrome do. Do not add a load
    animation to above-the-fold content; it runs on every click.
  - **Margin notes** reveal once in view (notes already on screen at load are
    instant, `.is-instant`).
  - **Tab-bar wave** (`html.nav-wave`, set by the inline head script on every
    page load when motion is allowed): four staggered ink rings ripple out from
    `.navbar` via its `::before`/`::after` for exactly 4s, to point visitors at
    navigation. Plays on every load by the owner's choice (it was once per
    session at first).
  - **Hover lift** on cards/tiles/cert chip (`@media (hover: hover)`), and the
    **pulsing point** on the resume's current entries (`.timeline-item.now::after`).
  - Never make `opacity: 0` an unconditional base state (crawlers, no-JS, and the
    no-JS test's `article.active` opacity check).
- A global `@media (prefers-reduced-motion: reduce)` rule kills every animation
  and transition site-wide. Its `*` selector does not reach the
  `::view-transition-*` pseudo-elements, so they have their own `animation:
  none` line there (pages then swap instantly, still without a blank frame).
- **Gotcha:** never put a `transform` (or filter) on `main`, `.sidebar` or
  `.main-content`: it makes them a containing block and detaches the
  `position:fixed` mobile tab bar from the viewport.

## Certification (profile card + Resume)

- The **Claude Certified Architect, Foundations (CCA-F)** credential from Anthropic
  (issued Sep 2026, valid until Sep 2027) shows as a small `.cert-chip` badge in the
  profile card, always visible (it sits in the part of the header card that never
  folds on phones) and linking to Credly. Its full entry is the first item under
  Resume → Education and credentials (`.cert-line`), with the other Anthropic course
  completions listed under it.
- The badge is **self-hosted** (`assets/images/claude-certified-architect-badge.webp`,
  taken from Credly) — never hotlink Credly. The "Verify on Credly" links open a new
  tab, so they use `data-umami-event="cert-verify"`, not `data-track-event`.
- The credential is also in the JSON-LD `Person` as `hasCredential`, which is built in
  **`scripts/build-site.js`** (the generator replaces the template's JSON-LD per route,
  so editing the `<head>` of `index.html` alone has no effect). On renewal, update the
  dates in the dict (`edu.cca.*`) **and** in `build-site.js`.

## Screenshot lightbox

- **What it is.** Every screenshot inside a **project detail** — the `.pd-hero`
  image and each `.pd-gallery` image — is previewable. Clicking (or Enter/Space on)
  one opens a full-screen overlay you page through. It's the `imageLightbox()` IIFE at
  the end of `script.js` (next to `assemblePhone` / `avatarPricingEntry`), with styles
  under the `#LIGHTBOX` block in `style.css`. Card thumbnails are **not** lightboxed —
  they already navigate to the detail page.
- **Grouping.** Per `.project-detail`, the hero + gallery images form **one** group in
  DOM order (hero first). The counter reads "n of m"; nav controls hide when a group has
  one image. Add a screenshot and it joins its page's group automatically — no wiring.
- **Interaction.** Prev/next buttons, ←/→ keys, and horizontal touch **swipe**, plus
  click-backdrop / close-button / **Esc** to dismiss. Fully **RTL-aware**: `goPrev`/
  `goNext` are logical, nav buttons are positioned with `inset-inline-*` (mirror for
  free), chevron icons flip via `[dir="rtl"] .lb-nav .icon`, and the arrow-key **and**
  swipe direction map through a `dir` factor. Focus moves to the close button on open and
  is **restored to the triggering image** on close; motion is gated behind the
  module-scoped `reduceMotion`.
- **Esc precedence.** The overlay sets `.lb-open` on `<html>` while open; the project-
  detail Esc handler bails when that class is present, so **one Esc closes the lightbox,
  a second closes the detail**. If you touch either Esc handler, preserve this.
- **Captions.** The overlay caption uses the image's `<figcaption>` if present, else its
  `alt`. Gallery images have translated figcaptions; heroes have no figcaption, so their
  caption falls back to the (English, per site convention) `alt` even on `/index-ar`.
- **Labels & i18n.** Control `aria-label`s and the counter word come from a small local
  `TXT = { en, ar }` dict in the IIFE (keyed off `<html lang>`), and re-apply if the
  language is toggled while a detail page is open — they are **not** in `i18n-data.js`.
- **Icons.** Uses three sprite symbols added for it: `i-close-outline`, `i-chevron-back`,
  `i-chevron-forward` (Ionicons v5). It also fires a guarded `umami.track('lightbox-open',
  { project, image })` event on open.

## Conventions

- Descriptive class/variable names; match the existing spacing and comment style.
- Nav **links** (`<a data-nav-link>`, formerly buttons) match articles by
  `data-target` → article `data-page` (NOT by text, so labels can be translated).
  A "Skills" link needs `data-target="skills"`, and `routes.js` needs a `skills`
  entry — `build-site.js` derives the `href` from the route table, so a
  `data-target` with no route will throw at build time.
- Project cards use `data-project-open="project-<slug>"` and detail pages use
  `data-project-back`; both also get their `href` rewritten from `routes.js`.
- Project filters match by `data-filter` → item `data-category`
  (`ios`/`web`/`fullstack`/`tools` — `tools` is for Raycast/CLI/dev-tool projects like
  the Gold Price Raycast extension), also decoupled from the visible (translatable)
  label. A category needs one button in `.filter-list` (the old mobile
  `.select-list` custom dropdown is gone — the filter list wraps on small screens
  now) plus a `filter.<name>` key in the `en` and `ar` dicts.
- `.h4`/`.h5` use `text-transform: capitalize`; brand titles (iOS, Next.js,
  noiceanas.com) are exempted via a `text-transform: none` override — keep it when
  adding titles with intentional casing.
- External links use `target="_blank" rel="noopener"`.
- Keep the **shipped site** dependency-free. All deps are dev-only and never
  served: `node-html-parser` (the build), `@playwright/test` + `@axe-core/
  playwright` + `lighthouse` (the test suite). **All fonts and icons are self-hosted — no CDN, no external origins**
  (the only third-party request is Umami analytics). See **Fonts & icons** below
  before adding either.

## Status

Content, images and links are real and the deploy URL is final (GitHub Pages,
above). The profile photo (`my-avatar.webp`), project thumbnails and app
screenshots (`project-*.webp`, `mykarage-*`, `jamaatna-*`, `saleh-*`,
`turathiyat-*`, `kidsstory-*`, `howamesh-*`, `alnajim-*`, `4service-mobile.webp`) and the social-share card
(`og-image.jpg`, 1200×630) are all real image assets;
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
npm install                                      # once — installs the dev deps
npm run build                                    # generate _site/ (required before serving)
python3 scripts/preview-server.py 8000 _site     # http://localhost:8000 (no-cache)
npm test                                         # build + the Playwright/axe suite
```

**Serve `_site/` via `scripts/preview-server.py`, never the repo root and never
plain `http.server`** — see **Local preview** under *Build & i18n architecture*:
the root gives you a double page load per click, and a cacheable server can trap
you in a redirect loop with a stub from an older build.

**VS Code:** `Cmd+Shift+B` (or Terminal → Run Build Task) runs **"Preview: Build,
Serve & Open Browser"** — builds `_site/`, starts the local server on port 8000
against that directory (reuses one already running instead of erroring), and
opens it in the browser. `F5` does the same but launches Chrome under the
debugger. Run the **"stop: preview server"** task (Cmd+Shift+P → Run Task) to kill
the server. Defined in `.vscode/tasks.json` / `.vscode/launch.json`.

`ignored/SEO.md` documents the post-deploy Search Console steps and how to retire
the old `MyWebsite` from search. It lives in the git-ignored `ignored/` directory
— it is a local working note, not a shipped doc.

## Work log: done-tasks.md

- Before ending any session where something got done (a feature, fix, refactor, config
  change, anything finished), add a dated entry to `done-tasks.md` at the repo root.
  Do it without being asked.
- If the file doesn't exist yet, create it with a short header saying it is the
  general work log, newest first.
- Format: a `## YYYY-MM-DD` heading, then one bullet per item. Each bullet says what
  changed, why, how it was checked (tests, checks, numbers), and whether it was
  committed ("Not committed." when it wasn't).
- It is separate from `CHANGELOG.md` (one entry per deploy/release) and from any
  growth/SEO log. It covers everything, so overlapping with those is fine. (This repo
  has no `CHANGELOG.md` today; per-deploy notes are the GitHub releases the `release`
  job in `deploy.yml` auto-generates.)
- Don't log sessions that only answered questions or changed nothing.
- Follow the existing rules: no `git add`/`git commit`, and no Claude attribution in
  the file.

## Do not

- Do not remove the template attribution or the `LICENSE` (MIT requires the
  original copyright notice stays).
- Do not run `git add` or `git commit` without an explicit instruction.
- Do not hand-edit `index-ar.html` — it is generated. Edit `i18n-data.js` /
  `index.html` and run `npm run build`.
- Do not hand-edit anything in `_site/` — the whole directory is wiped and
  regenerated by `npm run build`.
- Do not put `data-umami-event` on a same-tab link. Use `data-track-event`; see
  **Analytics**.
- Do not preview by serving the repo root, and do not preview with a caching
  server. Use `scripts/preview-server.py`.
- Do not expect a push to `main` to deploy — the workflow only runs on
  `live-deploy`.
