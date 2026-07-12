فاث# Remaining — what to add before shipping

Status after wiring in real data from the CV (`Anas_Alhalabi_CV_2026-07-12`),
the GitHub README, and `noiceanas.com`. Everything below is either a missing
asset, an unverified link, or an optional enhancement. Search the code for
`TODO` to jump to the spots.

---

## 1. Must-do before publishing

- [x] **Profile photo** — done. Memoji extracted from `~/Downloads/EmojiMovie…​.mov`,
      cropped to a centered 500×500 transparent PNG at `assets/images/my-avatar.png`.
      The sidebar loads it automatically (falls back to `my-avatar.svg` if removed).
- [x] **Project screenshots** — done. Real thumbnails composited onto consistent
      dark canvases (`assets/images/project-*.png`): My Karage & Karage Kash from the
      App Store, Jamaatna & noiceanas.com from live screenshots, and the Invoicing &
      Reporting Dashboard from your provided screenshot. Optional: swap in higher-impact
      shots any time by replacing the PNGs (keep the 640×440 frame for consistency).
- [ ] **Contact form** — create a form at [formspree.io](https://formspree.io) and
      replace `{your-form-id}` in the `<form action>` in `index.html`. Until then the
      form falls back to opening the visitor's email client.
- [ ] **Confirm the CV** — `assets/cv/Anas-Alhalabi-CV.pdf` is a copy of
      `Anas_Alhalabi_CV_2026-07-12.pdf`. There's also an **iOS-specialised** version
      (`Anas_Alhalabi_CV_iOS_2026-07-12.pdf`) — decide which one the site should offer.

## 2. Verify these links

- [x] **Jamaatna** → links to `https://jamaatna.net` (live, public). Was the
      "wedding guest" project; now a full event-operations platform.
- [x] **Invoicing & Reporting Dashboard** — copy corrected: no Supabase mention, and
      it states you *supported building it and built the invoicing system inside it*
      (not that you built the whole thing). Still marked *Private — company project*
      (no public link) with your provided screenshot as the thumbnail.
- [ ] App Store links are taken from the CV and look correct — click through once to
      be sure both resolve.

## 3. Decide (deferred from the original plan)

- [ ] **Deployment target** — you already own `noiceanas.com` (which currently hosts a
      different site). Decide whether this portfolio:
  - replaces the current noiceanas.com, or
  - lives on a path / subdomain (e.g. `noiceanas.com/portfolio` or `me.noiceanas.com`), or
  - deploys to `Noice-Anas.github.io`.
  Meta tags, `sitemap.xml`, `robots.txt` and OG URLs currently point at
  `https://noiceanas.com/` — update them to match the final URL.
- [ ] **Articles / blog** — `noiceanas.com` has a "Latest Posts" section (iOS, dev tools,
      macOS productivity). Optionally add an **Articles** tab that links out to those posts.
- [ ] **Arabic (RTL) version** — you're a native Arabic speaker. An `index-ar.html` +
      RTL stylesheet pass is a nice v1.1, but real work (template is LTR-only).

## 4. Nice-to-have polish

- [ ] More projects / open-source — the GitHub README mentions reading and contributing
      to open source. Add any public repos worth showing (would strengthen the "Web"
      and a possible "Open-source" filter).
- [ ] Recommendation letter — the source folder has `Recommendation_Letter_Draft.pdf`;
      consider a short testimonial quote on the About or Contact tab.
- [ ] The four "What I'm doing" service-card icons are still the template's warm/gold
      SVGs. Recolor them to the teal accent for full visual cohesion (optional).
- [ ] Run Lighthouse (aim 90+ on Performance/Accessibility/SEO) after adding real images.

## 5. Data captured vs. not used

Pulled from the sources and already placed in the site: name, title (Software
Engineer, mobile-first), phone, location (Saudi Arabia, inferred from +966), email,
GitHub (`Noice-Anas`), LinkedIn (`anas-al-halabi`), website, full skill stack, the
Karage experience, LabLab MENA and Marn roles, University of the People degree, IELTS
and Prompt Engineering certs, and the five projects above.

Not surfaced on the site (available in the source folder if you want them): detailed
job-application materials, cover letters, and the cyber-case reports — none of which
belong on a public portfolio.
