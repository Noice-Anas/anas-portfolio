# CLAUDE.md — project notes

Guidance for AI-assisted work on this repo. Read this before making changes.

## What this is

A single-page personal portfolio for **Anas Alhalabi** — a mobile-first
**Software Engineer** (iOS/iPadOS in Swift/SwiftUI, Next.js/TypeScript web, and
backend APIs; currently at Karage). Vanilla HTML/CSS/JS, no build step, no
dependencies. Static-hosted (intended domain `noiceanas.com`). Built on the
MIT-licensed **vCard** template by codewithsadee, re-themed (teal/cyan accent),
given a floating pill navbar, and populated with real content.

Real identity data: GitHub `Noice-Anas`, LinkedIn `anas-al-halabi`, site
`noiceanas.com`, based in Saudi Arabia. Source data lived in
`~/Desktop/LinkedIn Expert` (CV, GitHub README) — not part of this repo.

## Architecture

- **`index.html`** — one page. Each tab is an `<article data-page="…">`; the
  navbar buttons carry `data-nav-link`. `assets/js/script.js` toggles the
  `.active` class to show one article at a time (no routing, no reloads).
- **`assets/css/style.css`** — all styling. The design system is CSS custom
  properties in the `:root` block at the top. Accent colour = `--accent` /
  `--accent-2` and the `--*-accent*` gradients. Mobile-first; breakpoints at
  450 / 580 / 768 / 1024 / 1250 px.
- **`assets/js/script.js`** — sidebar toggle, project filter + custom select,
  contact-form validation with a `mailto:` fallback, and tab navigation.
  All selectors are null-guarded so removing a section won't throw.

## Conventions

- Descriptive class/variable names; match the existing spacing and comment style.
- Nav button text must equal the article's `data-page` (case-insensitive) — e.g.
  a "Skills" button needs `data-page="skills"`. **Keep the number and order of
  navbar buttons in sync with the articles**, since the nav loop pairs them by index.
- Project filter categories are the `data-category` values (`ios`, `web`,
  `fullstack`) and must match the filter button labels (lowercased).
- `.h4`/`.h5` use `text-transform: capitalize`; brand titles (iOS, Next.js,
  noiceanas.com) are exempted via a `text-transform: none` override — keep it when
  adding titles with intentional casing.
- External links use `target="_blank" rel="noopener"`.
- Keep it dependency-free and buildless. Icons come from CDNs (Ionicons, Devicon).

## Remaining work

Text content is real. What still needs real **assets/decisions** is tracked in
`REMAINING.md`: profile photo, project screenshots, Formspree endpoint, link
verification (Wedding admin, App Store), and the final deploy URL. The SVGs under
`assets/images/` (avatar, `project-*`, og-image) are generated placeholders meant
to be swapped for real images. Search the code for `TODO`.

## Run

```bash
python3 -m http.server 8000   # http://localhost:8000
```

## Do not

- Do not remove the template attribution or the `LICENSE` (MIT requires the
  original copyright notice stays).
- Do not run `git add` or `git commit` without an explicit instruction.
