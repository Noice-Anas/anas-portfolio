# Anas Alhalabi — Portfolio

A single-page portfolio for a mobile-first **freelance software engineer** —
iOS/iPadOS in Swift/SwiftUI, Next.js/TypeScript web, and backend APIs. Dark,
card-based, tabbed layout with a fixed profile sidebar and a floating pill navbar.
**Bilingual (English / Arabic with full RTL)**, with tasteful scroll-reveal
animations. No frameworks and no build step — plain HTML, CSS and JavaScript,
deployable as a static site.

**Live URL:** https://noice-anas.github.io/anas-portfolio/ &nbsp;(GitHub Pages).
The canonical, Open Graph, `sitemap.xml`, `robots.txt` and analytics config all
point here. `noiceanas.com` still appears throughout as Anas's personal-brand
site (sidebar, contact card, vCard) — that's intentional, not the deploy host.

---

## Tech

| Layer | Choice |
|---|---|
| Markup / Style / JS | Vanilla HTML5, CSS3, JavaScript (no build step, no dependencies) |
| Icons | [Ionicons](https://ionic.io/ionicons) + [Devicon](https://devicon.dev/) (skill tiles) via CDN |
| Fonts | Poppins (Latin) + Tajawal (Arabic) — Google Fonts |
| i18n | In-house EN/AR engine in `script.js`, choice persisted to `localStorage` |
| Analytics | [Umami](https://umami.is) — cookieless, GDPR-friendly, no consent banner (see [`ANALYTICS.md`](./ANALYTICS.md)) |
| Hosting | Any static host (GitHub Pages) |

## Sections

`About` · `Skills` · `Projects` · `Resume` · `Contact` — switched client-side via
the floating pill navbar (no page reloads). Projects can be filtered by
`All / iOS / Web / Fullstack`, and each project opens a dedicated detail view.
The **Contact** tab shows contact info as cards (email, phone, GitHub, LinkedIn,
Stack Overflow, website, location) — there is no contact form. It also has an
**Add me to contacts** button (downloads `assets/anas-alhalabi.vcf`, a vCard 3.0)
and a **QR code** (`assets/images/contact-qr.svg`) that encodes the same details
for scanning from a phone.

## Deep-link routes

Although the site is a single page, it supports **shareable deep links** via a
`?page=<tab>` query string (e.g. `?page=skills`, `?page=project-jamaatna`,
`?page=ar` for Arabic). `script.js` reads the param on load and opens the matching
tab. For crawlers and clean URLs, small `noindex` redirect stubs live in
`about/`, `skills/`, `projects/`, `resume/`, `contact/`, `ar/`, and
`projects/<slug>/` — each just redirects to `../?page=…`.

## Project structure

```
anas-portfolio/
├── index.html              # single page, all tabbed sections + project detail views
├── assets/
│   ├── css/style.css       # all theming via CSS custom properties at the top
│   ├── js/script.js        # tab nav, project filter, custom select, i18n, animations
│   ├── images/             # avatar, project thumbnails, favicon, og-image.jpg, contact-qr.svg
│   ├── cv/                 # downloadable resume PDF (Anas_Alhalabi_CV_iOS_2026.pdf)
│   └── anas-alhalabi.vcf   # vCard for the "Add me to contacts" button / QR
├── about/ skills/ projects/ resume/ contact/ ar/   # deep-link redirect stubs
├── robots.txt              # allows all crawlers (this is a portfolio — indexing wanted)
├── sitemap.xml
├── .nojekyll               # serve files as-is on GitHub Pages
├── README.md
├── ANALYTICS.md            # Umami setup notes
├── CLAUDE.md               # notes for future AI-assisted edits
└── LICENSE                 # MIT (template + this work)
```

> Note: CSS and JS live under `assets/` (matching the original template layout)
> rather than at the repo root.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Content

Text content (bio, experience, education, skills, projects, contact) is populated
from Anas's real data — CV, GitHub profile, and `noiceanas.com`. Project
thumbnails and the profile photo are real images.

## Deploy

Hosted on **GitHub Pages** at
[`https://noice-anas.github.io/anas-portfolio/`](https://noice-anas.github.io/anas-portfolio/):

1. Push to `main` on the `anas-portfolio` repo under the [`Noice-Anas`](https://github.com/Noice-Anas) account.
2. Settings → Pages → **Deploy from a branch** → `main` / `root`. `.nojekyll` keeps
   files served as-is.

All self-referential URLs (canonical, `og:url`, `og:image`, `sitemap.xml`,
`robots.txt`) already point at the deploy URL above. If you ever move to a custom
domain, update those five spots plus the Umami "configured domain" (see
[`ANALYTICS.md`](./ANALYTICS.md)).

### Social link preview

Sharing the link (WhatsApp, iMessage, LinkedIn, X) renders a card from the Open
Graph tags and **`assets/images/og-image.jpg`** (1200×630, ~62 KB — raster and
small on purpose; those platforms ignore SVG and silently drop images over
~300 KB). The preview only appears once the page is **live at the `og:url`**, and
those platforms cache aggressively — after deploying or changing the card, force a
re-scrape via the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/).

## i18n (EN / AR)

The site is one page in two languages. The globe badge on the avatar flips
between English and Arabic; Arabic sets `dir="rtl"`, switches to the Tajawal font,
and mirrors directional UI (title underline, timeline, navbar). Translations live
in the `I18N = { en, ar }` dictionary in `assets/js/script.js` — the single source
of truth. See [`CLAUDE.md`](./CLAUDE.md) for how to add a translatable string.

## Theming

The colour system lives in the `:root` block at the top of `assets/css/style.css`.
This build uses a **teal → cyan** accent. To change it, edit `--accent`, `--accent-2`,
`--text-gradient-accent`, `--bg-gradient-accent-1/2` (and the matching stop colours
in the SVG assets). The dark background family is unchanged from the template.

## Credits

Built on the **[vCard – Personal Portfolio](https://github.com/codewithsadee/vcard-personal-portfolio)**
template by **[codewithsadee](https://github.com/codewithsadee)**, used under the MIT
License. This project retains that licence (see [`LICENSE`](./LICENSE)) and has been
re-themed and re-authored with original content.
