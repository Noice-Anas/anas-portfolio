# Anas Alhalabi — Portfolio

A single-page portfolio for a mobile-first software engineer: dark, card-based,
tabbed layout with a fixed profile sidebar and a floating pill navbar. No frameworks
and no build step — plain HTML, CSS and JavaScript, deployable as a static site.

**Intended URL:** https://noiceanas.com/ &nbsp;(see the deployment note in
[`REMAINING.md`](./REMAINING.md) — confirm the final URL before publishing).

---

## Tech

| Layer | Choice |
|---|---|
| Markup / Style / JS | Vanilla HTML5, CSS3, JavaScript |
| Icons | [Ionicons](https://ionic.io/ionicons) + [Devicon](https://devicon.dev/) (skill tiles) via CDN |
| Fonts | Poppins (Google Fonts) |
| Contact form | [Formspree](https://formspree.io) free tier — with a `mailto:` fallback |
| Hosting | GitHub Pages |

## Sections

`About` · `Skills` · `Projects` · `Resume` · `Contact` — switched client-side via
the floating pill navbar (no page reloads). Projects can be filtered by
`All / iOS / Web / Fullstack`.

## Project structure

```
anas-portfolio/
├── index.html              # single page, all tabbed sections
├── assets/
│   ├── css/style.css       # all theming via CSS custom properties at the top
│   ├── js/script.js        # tab nav, project filter, custom select, form
│   ├── images/             # avatar, project thumbnails, favicon, OG image (SVG placeholders)
│   └── cv/                  # downloadable resume PDF (placeholder)
├── favicon → assets/images/favicon.svg
├── robots.txt              # allows all crawlers (this is a portfolio — indexing wanted)
├── sitemap.xml
├── .nojekyll               # serve files as-is on GitHub Pages
├── README.md
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
from Anas's real data — CV, GitHub profile, and `noiceanas.com`. What still needs
**real assets or decisions** (profile photo, project screenshots, Formspree endpoint,
link verification, deploy URL) is tracked in **[`REMAINING.md`](./REMAINING.md)**.
Search the code for `TODO` to find the spots.

## Deploy

Any static host works (GitHub Pages, Netlify, the existing `noiceanas.com` host).
For **GitHub Pages**:

1. Push these files to `main` on a repo under the [`Noice-Anas`](https://github.com/Noice-Anas) account.
2. Settings → Pages → **Deploy from a branch** → `main` / `root`.
3. Point the `noiceanas.com` domain at it (add a `CNAME` file + one DNS record) if this
   is replacing the current site.

> The meta tags, `sitemap.xml`, `robots.txt` and OG URLs currently assume
> `https://noiceanas.com/`. Update them if the final URL differs.

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
