# done-tasks.md

General work log for this repo, newest first. One dated section per session
that finished something; see **Work log** in `CLAUDE.md` for the format.

## 2026-09-24

- **Arabic availability line reworded.** The profile-card `status` string in `ar` ("open to opportunities", literally translated) read oddly in Arabic; it now says "freelance, available for new projects" (`assets/js/i18n-data.js`). English unchanged. `npm test` 24/24 passed; the old phrase no longer appears anywhere in `_site/`. Committed on `fix/arabic-status-wording` and opened as a PR into `live-deploy`.
- **Navigation jitter fixed** (from the owner's screen recording: every tab click showed a blank frame, a black frame, then the page painting in pieces and the cards bouncing). Four causes, three of them in production too. Committed.
  - **Black frame:** `<meta name="color-scheme" content="light dark">` let the browser paint its dark default canvas before `style.css` loaded whenever macOS was in dark mode. Now `light`; the head script flips it (or `style.colorScheme` on pricing and working-with-me) only for an explicit dark choice.
  - **Bounce:** `blockReveal()` gave on-screen blocks a 14px rise that could only start after `document.fonts.ready`, so each page painted, snapped down and slid back, now on every click since each route is its own document. On-screen blocks no longer move; below-the-fold blocks still reveal on scroll. `.reveal-rise` CSS removed.
  - **Blank gap between pages:** added a cross-document view transition (`@view-transition { navigation: auto }`, a 180ms root crossfade, instant under reduced motion).
  - **Local-only pops:** `scripts/preview-server.py` sends `no-cache` instead of `no-store`, so fonts and images are revalidated (304) rather than re-downloaded on every click. The stale-stub protection still holds.
  - **Checked:** a Playwright repro failed on the old code and passes on the new: pre-CSS canvas with a dark OS went 18,18,18 to 255,255,255; the first project card's top moved from 354.6 to 340.6px over the first 1.6s before, and is steady after; `pagereveal` reports a view transition on most clicks in Playwright's headless shell and in headed Chrome (4 of 5 repeated Home to Projects clicks in headed Chrome; a skipped one falls back to a plain navigation, and Playwright's new headless mode never runs them). Dark-theme visitors still get a dark pre-CSS canvas on the main, pricing and working-with-me pages, with the OS in either mode. The server answers 304 on `If-Modified-Since`. `npm test` 24/24 on two runs. A 25fps headless screen recording could not show the flash even with the old code, so it was not used as evidence.

- **Tab-bar wave:** on every page load, four staggered ink rings ripple out from the navbar for exactly 4s so visitors notice where navigation is (off under reduced motion; first built as once per session, then changed to every load on request). CSS in `style.css` after the navbar rules, flag in the `index.html` head script. Checked in Playwright at 1280px and 390px: animations end at 3.2s and 4.0s, the wave plays again on the next page load and not at all under reduced motion, and `npm test` passes 24/24. Committed.
- Follow-ups on the rebrand. Committed.
  - **Home:** Jamaatna replaced Marwah Stories as a featured project, and the margin notes were removed from the featured cards (the owner said they did not make sense there).
  - **Services:** three new engagements, EN + AR: personal Claude courses, personal portfolio sites, and tech help and automation.
  - **Resume:** the point on the current entries pulses.
  - **Motion:** blocks rise in under a curtain as you scroll, and cards lift on hover. Opacity fades failed axe contrast, and a clip-path wipe blocked clicks.
  - **Desktop:** the shell now fills wide screens (120rem cap, fluid gutters, wider card).
  - **Checked:** `npm test` 24/24 on two consecutive runs, plus screenshots at 2000px.
- Applied the brand review to the whole site. What changed:
  - **Style:** new Vermilion + Ink tokens (light default, dark only by explicit toggle, stored as `portfolio-theme`), one app shell (profile card, inverted ink tab bar that floats at the bottom on phones, one panel), container-query layouts and margin notes as the only animation, all in a rewritten `assets/css/style.css`.
  - **Fonts:** IBM Plex Sans Arabic replaces Poppins and Year of Handicrafts (both folders deleted; Year of Handicrafts could not be redistributed).
  - **Copy, EN + AR:** new home (first-person headline, "5+ years", WhatsApp as the main button and email second, three featured projects with notes, four offer tiles), Skills renamed Services (engagements plus tools as text links), a tidied resume with the new credential entry, and a contact page with an FAQ.
  - **Certification:** the big home card is gone; a small Claude Certified Architect badge now sits in the profile card at all widths.
  - **Case studies:** all 12 use the new template (answer-first summary, fact tiles, Decision / Constraint / Limit notes written only from existing facts and the brief's attribution limits). Old colon-for-dash artifacts in the long strings were cleaned up.
  - **SEO:** per-project SEO titles, a ProfilePage on home, and email plus alternate names on the JSON-LD Person.
  - **Other pages:** pricing, working-with-me and 404 re-themed; new favicon and a new 1200x630 OG image (37 KB).
  - **Arabic:** reviewed for native phrasing and consistent terms.
- How it was checked: parallel subagents did the Arabic review, visual QA in both languages and themes, and a brand and facts audit, and I applied their fixes.
  - One audit suggestion was not applied: "nearly 5 years", because the owner set "5+ years".
  - `npm test` passes 24/24 on two consecutive runs. Before that, the fixed-position tab bar and instant on-screen notes resolved axe target-size and contrast flakes.
- Committed.

- Rebrand review (`/rebrand`): wrote `ignored/branding-research/BRAND-BRIEF.md` and a
  standalone brand review page, `ignored/branding-research/brand-review.html` (plus
  self-hosted IBM Plex Sans Arabic woff2 files and their OFL licence in
  `brand-review-assets/fonts/`). It keeps the site's app shell (profile card, tab bar,
  switching views, filters, in-app project detail) in the Vermilion + Ink palette. It adds
  "My part" ownership lines and vermilion margin notes (Decision / Constraint / Limit) as the
  signature, an Arabic RTL sample, and the full identity system, SEO/GEO plan and evidence
  ledger. A first pass that became a scrolling landing page was rejected and rebuilt; the tab
  bar was then made an inverted ink bar (15:1 against the canvas) because it blended in. Checked
  with a Playwright run: no overflow at 320/375/768/1440 in any view, all five tabs fit at 320 px, light on a dark OS,
  theme persists, tabs/filters/detail/back work, fonts load from `file://`, no broken
  images or links, no-JS shows every view and the contact details, reduced motion hides nothing, and axe WCAG AA is
  clean in both themes. Local Lighthouse: Accessibility 100, Best Practices 100,
  Performance 90 (lab). Production files untouched; everything is in git-ignored
  `ignored/`. Committed.
- Added the **Work log: done-tasks.md** rule to `CLAUDE.md` (new section before
  **Do not**) so every session that finishes work leaves a dated entry here, and
  created this file. Checked by re-reading the section in place; no build or tests
  needed (docs only). Committed.
