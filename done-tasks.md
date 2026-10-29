# done-tasks.md

General work log for this repo, newest first. One dated section per session
that finished something; see **Work log** in `CLAUDE.md` for the format.

## 2026-10-29

- **Services panel: fewer iOS lines, more Claude** (owner's request). "Build and own an iOS app" and "Take over and rebuild an existing app" are now one engagement, "An iOS app, new or taken over" (proof: My Karage, Karage Kash and its version two); the `svc.rebuild.*` keys are gone. The Apple tools group stays. Added three Claude engagements next to the existing "Personal Claude courses": "Claude Code set up for you or your team", "Instructions Claude follows" (CLAUDE.md files, system prompts, skills) and "Claude workshops for teams", with EN and AR copy in `i18n-data.js`. Checked: `npm test` 24/24 passed. Committed on `main` together with the 2026-10-20 project work (as two commits), pushed, and deployed by fast-forwarding `live-deploy`.

## 2026-10-20

- **Portfolio brought up to date with the past month's work** (owner's request: survey `~/Desktop/Projects`, ask per project). Surveyed git activity since 2026-09-20 across ~50 folders. The owner chose four entries; qbill, Naqeeb, SAWAP (muzun) and Hamsha stay private for now. New case studies, each with EN and AR copy in `i18n-data.js`, a `routes.js` entry, a card and an `<article>`:
  - **Sfere** (`/projects/sfere/`): a freelance client, covering the dashboard only, per the owner. Facts come from the dashboard repo's git log and docs: design tokens and kit, onboarding, sources/destinations, the Zid flow, monitoring and profiles. On review the owner chose to strip all client internals, so the page has no former name, no architecture details and no bug story; it lists features only. No internal counts, hostnames or teammate names. The image is the public sfere.io page.
  - **Easy OCR** (`/projects/easy-ocr/`): the Apple Vision engine PR (raycast/extensions#32284), confirmed merged on 2026-10-14 with `gh`.
  - **Invoice & Task Bots** (`/projects/telegram-bots/`): one entry for both, per the owner. The image is a sample-data mock-up whose invoice card text comes from the bot's own `format_invoice_card`. No real chat, CSV or droplet IP was opened or published.
  - **Seedance Studio** (`/projects/seedance-studio/`): screenshots taken against its mock API on spare ports (8788/9911), with the real `.env` bypassed. Both servers were stopped afterwards.
- **Jamaatna brand history and corrected claims.**
  - New "Brand history" section on `/projects/jamaatna/`: v1 vs v2 logos, the v1 home page, the v2 designs page and phone view, and a five-step timeline (Jul 2026 navy/gold → 24 Sep brief → 25 Sep Pomegranate & Ivory → 29 Sep–3 Oct motion and review → 4 Oct v1.0 live). Dates come from the Jamaatna repo's `CHANGELOG.md`, `marketing/brand/` and `done-tasks.md`.
  - The hero and card thumbnail now show the live v2 site. The old screens are captioned "brand one".
  - Fixed three claims the product doesn't back: "seating management" (there is a DB column but no UI), "payments" (packages have no online checkout) and "automated reminders" (not built, per `to-do/rebrand-remaining-work.md`).
- **Also:** the Resume freelance line mentions the Sfere dashboard, and the Services "tech help" proof mentions the bots. In `tests/portfolio.spec.cjs`, the total project count went from 12 to 16. Swift was left off Easy OCR's technologies, because the merged PR uses JXA and the Swift helper is only in the local fork; that also keeps the Swift filter at 2. CLAUDE.md now records the image exceptions, the hard-coded test counts and the test count (24, not 20).
- **Checks:**
  - `npm test` passed 24/24 on the final build in 4 of 6 runs, the last one after a final pass that toned down four claims (designs "sorted by occasion", the 25 Sep rollout "applied" rather than live, the review "with a round of fixes across eight areas", and no claim that the bots' smoke tests run on deploy).
  - The other two runs had one intermittent failure in "Home project returns to home": a scroll restore landed at 1138 instead of 1420. That test only touches the home page, which these changes did not alter. It passed 16 of 16 isolated reruns, and unchanged HEAD passed 2/2 full runs in a scratch worktree.
  - Took screenshots of the Jamaatna page (EN 1280px, AR 390px), the bots page (AR) and the Projects grid. No page had horizontal overflow.
  - Not committed.

## 2026-10-18

- **Marwah Stories case study now covers the story studio** (owner's request). The studio (`/studio/` on marwah-stories-library.netlify.app, behind a sign-in) had shipped in the source repo `~/Desktop/Projects/kids-story-solution` but the portfolio never mentioned it. On `/projects/kidsstory/`: a new "A studio for the author" section (7 points: story maker, on-page text editing, layout checks, picture review, All pages and Manuscript, Send work handover, the edge-function sign-in) with a Decision note, the studio added to the answer, overview, role, "My part" fact, card line and meta description, and "Netlify Edge Functions" and "Web Speech API" chips. Following the owner's choices, the copy says "I bake it in" and does not mention Claude. Two old claims are now limited to the reader: "no English mode" applies only to the reader (the studio is bilingual), and the static-files point now notes the one edge function. Page counts updated to match the live site: 64 became 73 (34 + 39), and the unreleased square edition is left out. Three new screenshots (`kidsstory-studio-maker/review/allpages.webp`, 1280×800) were taken with Playwright from a `git archive HEAD` export of the studio, because the source repo's working tree had uncommitted changes that showed a stray "null" in the top bar. EN and AR copy in `i18n-data.js` (Arabic button names match the studio's own `admin-i18n-ar.js`); alt keys `image.62`–`64`. Checked: `npm test` 24/24 passed; screenshots of the page in EN at 1440px and AR at 1440px and 390px; `npm test` re-run before committing, 24/24. Committed and merged into `live-deploy` by PR.

- **CV downloads brought up to date.** Both PDFs in `assets/cv/` were the July 21 versions: no Claude Certified Architect (Sept 2026) entry, and the "Website" link pointed at the old `noice-anas.github.io/anas-portfolio/`. Replaced them with the current masters from `~/Desktop/LinkedIn Expert/Resume/` (`Anas_Alhalabi_CV_Master_2page.pdf` → `Anas_Alhalabi_CV.pdf`, `Anas_Alhalabi_CV_Master_2page_AR_Natural.pdf` → `Anas_Alhalabi_CV_AR.pdf`) and refreshed the `~/Downloads` copies too. Checked: text diff against the old English PDF shows only the added certification line; both PDFs are 2 pages and link to `noiceanas.com` and Credly; the Arabic PDF was rendered to images and reads correctly. Committed and merged into `live-deploy` as PR #9 (deployed, `v1.0.3`).
- **CV headline updated.** The owner changed the CV headline to "Mobile-First Full-Stack Software Engineer · Claude Certified Architect" (EN and AR masters); copied both new PDFs into `assets/cv/` and `~/Downloads`. Checked: the English text diff is that one line; both PDFs are 2 pages; the Arabic first page was rendered and reads correctly. Committed and merged into `live-deploy` by PR.

## 2026-09-25

- **Language toggle moved next to the theme toggle** (owner's request). It used to be a small ink badge pinned to the avatar's corner. Now it is an outlined 44px "globe + AR/EN" button that sits with the sun/moon button in a new `.card-controls` group (`index.html`, `assets/css/style.css`). The two share a style and read as a pair. On desktop the pair sits in the profile card's top corner. At or below 1000px it moves to the far end of the "Contact details" row, because in the corner it squeezed the name column and "Alhalabi" slid under the buttons at 320px. Checked with card screenshots at 1440/390/320 px in EN and AR/RTL (mirrors correctly, no horizontal scroll). `npm test` 24/24 passed. Stale comment in `script.js` and three CLAUDE.md mentions of the "globe badge on the avatar" updated. Committed on `feature/lang-toggle-beside-theme` and merged into `live-deploy` by PR.

## 2026-09-24

- **Arabic availability line reworded.** The profile-card `status` string in `ar` ("open to opportunities", literally translated) read oddly in Arabic; it now says "freelance, available for new projects" (`assets/js/i18n-data.js`). English unchanged. `npm test` 24/24 passed; the old phrase no longer appears anywhere in `_site/`. Committed on `fix/arabic-status-wording` and merged into `live-deploy` as PR #7.
- **First deploy of the static multi-page site.** Merging PR #7 shipped everything on `main` since `v1.0.0`. The `live-deploy` workflow's build, deploy and release jobs all passed and tagged `v1.0.1`. Checked on noiceanas.com: all EN and AR routes, `sitemap.xml` and working-with-me return 200, an unknown path returns 404, and `/index-ar` has the new wording. The only CI output was warnings: actions still on Node 20, and `ubuntu-latest` moving to Ubuntu 26 on 2026-10-19. This log update was committed with the 2026-09-25 change.
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
