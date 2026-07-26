'use strict';

/**
 * Portfolio interactions — Anas Alhalabi
 * Based on the vCard template by codewithsadee (MIT). Adds: EN/AR i18n with
 * RTL, tab navigation, project filtering, form + mailto fallback, and
 * scroll-reveal animations.
 */


/* ------------------------------------------------------------------ *
 * i18n — English / Arabic
 * ------------------------------------------------------------------ */

/* Translations live in assets/js/i18n-data.js — the single source of truth,
 * shared with the build-time Arabic generator (scripts/build-i18n.js). That
 * file is loaded as a <script> before this one, exposing window.I18N. */
const I18N = (typeof window !== 'undefined' && window.I18N) || {};

const langToggle = document.querySelector('[data-lang-toggle]');
const langLabel = document.querySelector('[data-lang-label]');

function applyLang(lang, persist) {
  const dict = I18N[lang] || I18N.en;
  const html = document.documentElement;
  html.lang = lang;
  html.dir = lang === 'ar' ? 'rtl' : 'ltr';

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const v = dict[el.dataset.i18n];
    if (v != null) el.textContent = v;
  });
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const v = dict[el.dataset.i18nHtml];
    if (v != null) el.innerHTML = v;
  });
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
    const v = dict[el.dataset.i18nPh];
    if (v != null) el.placeholder = v;
  });

  // Serve the language-matched CV (English CV in EN, Arabic CV in AR). The link
  // may be absent (formal variant removes the Resume article), so null-guard it.
  const cvLink = document.querySelector('.cv-download');
  if (cvLink) {
    const cvUrl = lang === 'ar' ? cvLink.dataset.cvAr : cvLink.dataset.cvEn;
    if (cvUrl) {
      cvLink.href = cvUrl;
      cvLink.setAttribute('download', lang === 'ar' ? 'Anas_Alhalabi_CV_AR.pdf' : 'Anas_Alhalabi_CV.pdf');
    }
  }

  if (dict['meta.title']) document.title = dict['meta.title'];
  const langCode = lang === 'ar' ? 'EN' : 'AR';
  if (langLabel) langLabel.textContent = langCode;
  // Keep the accessible name in sync with the visible code (WCAG 2.5.3 Label in Name).
  if (langToggle) langToggle.setAttribute('aria-label', `${langCode} — Switch language / تغيير اللغة`);

  // Persist by default. Skipped when a dedicated language page (index-ar.html)
  // forces its language on load, so viewing it doesn't overwrite the visitor's
  // own saved preference for the main SPA.
  if (persist !== false) {
    try { localStorage.setItem('lang', lang); } catch (e) { /* ignore */ }
  }
}

if (langToggle) {
  langToggle.addEventListener('click', () => {
    applyLang(document.documentElement.lang === 'ar' ? 'en' : 'ar');
  });
}

/* Deep-link routing: the redirect stubs (/projects, /ar, …) forward here with
 * ?page= and/or ?lang= so a shared link opens straight on the right tab/language.
 * A bare #hash (e.g. …/#projects or …/#ar) is also honoured. */
const routeParams = new URLSearchParams(window.location.search);
const routeHash = window.location.hash.replace(/^#/, '');

/* A dedicated language page (the build-generated index-ar.html) carries
 * data-lang-lock on <html>. That URL IS that language, so it wins over every
 * other signal — including the visitor's saved preference — and does not
 * overwrite that preference. This is what keeps /index-ar Arabic for everyone:
 * a returning visitor whose localStorage says 'en', and a JS-rendering crawler
 * like Googlebot (no localStorage) that would otherwise fall through to 'en'
 * and flip the rendered page back to English. */
const langLock = document.documentElement.getAttribute('data-lang-lock');
if (langLock === 'ar' || langLock === 'en') {
  applyLang(langLock, false);
} else {
  /* Main SPA (index.html): explicit ?lang=/#ar  >  saved choice  >  page lang. */
  const pageLang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
  let savedLang = pageLang;
  try { savedLang = localStorage.getItem('lang') || pageLang; } catch (e) { /* ignore */ }
  const requestedLang = routeParams.get('lang') || (routeHash === 'ar' ? 'ar' : null);
  applyLang(requestedLang === 'ar' || requestedLang === 'en' ? requestedLang : savedLang);
}


/* ------------------------------------------------------------------ *
 * formal variant — hide the Resume tab entirely
 * ------------------------------------------------------------------ *
 * A shareable "formal" link (…/?formal, or the /formal/ redirect stub)
 * serves the portfolio with no Resume tab and no CV download, for contexts
 * where the CV is provided through official channels instead. The Resume
 * nav button and its article are removed from the DOM here — BEFORE the
 * navigation code below captures `pages`/`navigationLinks` — so the tab
 * can't be deep-linked (?formal&page=resume falls back to About) or shown. */
if (routeParams.has('formal')) {
  document.documentElement.classList.add('is-formal');
  document
    .querySelectorAll('[data-nav-link][data-target="resume"], [data-page="resume"]')
    .forEach((el) => el.remove());
}


/* ------------------------------------------------------------------ *
 * sidebar toggle (mobile)
 * ------------------------------------------------------------------ */

const elementToggleFunc = (elem) => elem.classList.toggle('active');

const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');
if (sidebarBtn) sidebarBtn.addEventListener('click', () => elementToggleFunc(sidebar));


/* ------------------------------------------------------------------ *
 * custom select + project filtering (matched by data attributes)
 * ------------------------------------------------------------------ */

const select = document.querySelector('[data-select]');
const selectItems = document.querySelectorAll('[data-select-item]');
const selectValue = document.querySelector('[data-selecct-value]');
const filterBtn = document.querySelectorAll('[data-filter-btn]');
const filterItems = document.querySelectorAll('[data-filter-item]');

if (select) select.addEventListener('click', function () { elementToggleFunc(this); });

const filterFunc = (value) => {
  for (let i = 0; i < filterItems.length; i++) {
    if (value === 'all' || value === filterItems[i].dataset.category) {
      filterItems[i].classList.add('active');
    } else {
      filterItems[i].classList.remove('active');
    }
  }
};

for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener('click', function () {
    if (selectValue) selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(this.dataset.filter);
  });
}

let lastClickedBtn = filterBtn[0];
for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener('click', function () {
    if (selectValue) selectValue.innerText = this.innerText;
    filterFunc(this.dataset.filter);
    if (lastClickedBtn) lastClickedBtn.classList.remove('active');
    this.classList.add('active');
    lastClickedBtn = this;
  });
}


/* ------------------------------------------------------------------ *
 * page navigation (tabbed sections) — matched by data-target
 * ------------------------------------------------------------------ */

const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');
const pageNames = Array.from(pages).map((p) => p.dataset.page);

/* Show one tab. `track` gates the Umami virtual pageview so the initial
 * deep-link activation doesn't double-count against the first real pageview. */
function setActivePage(target, track) {
  if (!pageNames.includes(target)) return false;

  let activeEl = null;
  for (let j = 0; j < pages.length; j++) {
    const on = pages[j].dataset.page === target;
    pages[j].classList.toggle('active', on);
    if (on) activeEl = pages[j];
  }
  /* Project detail pages aren't in the navbar; keep their parent tab
   * (data-parent="projects") highlighted while one is open. */
  const navTarget = (activeEl && activeEl.dataset.parent) || target;
  for (let k = 0; k < navigationLinks.length; k++) {
    navigationLinks[k].classList.toggle('active', navigationLinks[k].dataset.target === navTarget);
  }
  window.scrollTo(0, 0);

  /* Register a virtual pageview so Umami can measure real visit duration
   * and per-section views. This is a single-page app: switching tabs never
   * reloads or changes the URL, so without this Umami sees only one pageview
   * per visit and can't compute time-on-site (it floors to ~1s). Null-guarded
   * because the async script may be blocked or not yet loaded. */
  if (track && window.umami && typeof window.umami.track === 'function') {
    window.umami.track((props) => ({
      ...props,
      url: '/' + target,
      title: document.title,
    }));
  }
  return true;
}

for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener('click', function () {
    setActivePage(this.dataset.target, true);
  });
}

/* Honour a deep link on load: ?page=projects, or a bare #projects hash.
 * (#ar is reserved for language and handled above, not as a tab.) */
const requestedPage = routeParams.get('page') || (routeHash && routeHash !== 'ar' ? routeHash : null);
if (requestedPage) setActivePage(requestedPage, false);


/* ------------------------------------------------------------------ *
 * project detail views — a card opens its own data-page article; the
 * back button, Esc, or the navbar return to the Projects list.
 * ------------------------------------------------------------------ */

const projectOpeners = document.querySelectorAll('[data-project-open]');
const projectBackBtns = document.querySelectorAll('[data-project-back]');
let lastProjectTrigger = null;

function openProjectDetail(target) {
  if (!setActivePage(target, true)) return;
  const article = document.querySelector('[data-page="' + target + '"]');
  const heading = article && article.querySelector('[data-pd-title]');
  if (heading) heading.focus();
}

function closeProjectDetail() {
  setActivePage('projects', true);
  if (lastProjectTrigger) {
    lastProjectTrigger.focus();
    lastProjectTrigger = null;
  }
}

for (let i = 0; i < projectOpeners.length; i++) {
  projectOpeners[i].addEventListener('click', function (e) {
    e.preventDefault();          // href is a deep-link fallback; open in-page instead
    lastProjectTrigger = this;
    openProjectDetail(this.dataset.projectOpen);
  });
}

for (let i = 0; i < projectBackBtns.length; i++) {
  projectBackBtns[i].addEventListener('click', closeProjectDetail);
}

/* Esc closes an open detail view (its article carries data-parent). When the
 * screenshot lightbox is open it owns Escape first (see imageLightbox below),
 * so bail here — a second Escape, with the lightbox already closed, then closes
 * the detail. */
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape') return;
  if (document.documentElement.classList.contains('lb-open')) return;
  const active = document.querySelector('article.active[data-page]');
  if (active && active.dataset.parent) closeProjectDetail();
});


/* ------------------------------------------------------------------ *
 * scroll-reveal animations + animated skill bars
 * ------------------------------------------------------------------ */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('.reveal');

const fillBars = (root) => {
  root.querySelectorAll('.skill-progress-fill').forEach((f) => {
    if (f.dataset.width) f.style.width = f.dataset.width + '%';
  });
};

if (reduceMotion) {
  revealEls.forEach((el) => el.classList.add('is-visible'));
  fillBars(document);
} else {
  // light stagger based on position among reveal siblings
  revealEls.forEach((el) => {
    const sibs = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    const idx = sibs.indexOf(el);
    el.style.setProperty('--reveal-delay', Math.min(idx, 8) * 70 + 'ms');
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      fillBars(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el) => io.observe(el));
}


/**
 * -----------------------------------------------------------------------------
 * PHONE NUMBER — anti-scrape assembly
 * -----------------------------------------------------------------------------
 * The number is assembled from parts at runtime so it never appears as
 * plaintext (nor in a `tel:` href) in the static HTML that dumb scrapers and
 * non-JS AI crawlers read. For Googlebot — which renders JS and would otherwise
 * see the assembled value — the visible text lives inside a `data-nosnippet`
 * span in the markup, keeping it out of the search-result snippet. Real
 * visitors still get a working tap-to-call link. Null-guarded (the formal
 * variant and JS-off both degrade gracefully to no phone shown).
 */
(function assemblePhone() {
  const phoneParts = ['+966', '50', '037', '0664'];
  const phoneHref = 'tel:' + phoneParts.join('');
  const phoneText = phoneParts.join(' ');
  document.querySelectorAll('.js-phone').forEach((phoneLink) => {
    phoneLink.setAttribute('href', phoneHref);
    const phoneValue = phoneLink.querySelector('.js-phone-value');
    if (phoneValue) phoneValue.textContent = phoneText;
  });
})();


/**
 * -----------------------------------------------------------------------------
 * HIDDEN ENTRY — avatar → portfolio-pricing page
 * -----------------------------------------------------------------------------
 * Clicking the avatar ("the head") quietly navigates to the unlisted
 * /portfolio-pricing/ sales sheet. Deliberately undiscoverable: no href, no
 * pointer cursor, no affordance — only the avatar IMAGE (not the globe language
 * toggle sharing the .avatar-box) triggers it. Null-guarded. Relative path so it
 * resolves under both the apex domain and the github.io/anas-portfolio base.
 */
(function avatarPricingEntry() {
  const avatar = document.querySelector('.avatar-box img');
  if (!avatar) return;
  avatar.addEventListener('click', () => {
    window.location.href = 'portfolio-pricing/';
  });
})();


/**
 * -----------------------------------------------------------------------------
 * SCREENSHOT LIGHTBOX — full-screen preview with swipe / arrow navigation
 * -----------------------------------------------------------------------------
 * Every screenshot inside a project detail (the .pd-hero image and each
 * .pd-gallery image) becomes previewable. Within one detail page the hero +
 * gallery images form a single group you page through with the on-screen arrows,
 * the keyboard (←/→, Esc), or a horizontal touch swipe. Direction-aware so it
 * behaves correctly in RTL. Progressive enhancement: with JS off the images are
 * just images. Motion is gated behind the module-scoped `reduceMotion`, and
 * Umami gets a guarded open event. Null-guarded throughout.
 */
(function imageLightbox() {
  const details = document.querySelectorAll('.project-detail');
  if (!details.length) return;

  /* screen-reader labels; digits stay Western (as elsewhere on the site) */
  const TXT = {
    en: { close: 'Close', prev: 'Previous', next: 'Next', view: 'View screenshot', of: 'of' },
    ar: { close: 'إغلاق', prev: 'السابق', next: 'التالي', view: 'عرض لقطة الشاشة', of: 'من' },
  };
  const t = () => TXT[document.documentElement.lang === 'ar' ? 'ar' : 'en'];

  /* Gather previewable images per detail page, hero first then gallery order,
   * and tag each with its group + index. */
  details.forEach((detail) => {
    const imgs = detail.querySelectorAll('.pd-hero img, .pd-gallery img');
    if (!imgs.length) return;
    const group = [...imgs];
    group.forEach((img, i) => {
      img.classList.add('pd-zoomable');
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img._lbGroup = group;
      img._lbIndex = i;
      const open = (e) => { e.preventDefault(); openAt(group, i, img); };
      img.addEventListener('click', open);
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') open(e);
      });
    });
  });

  /* Build the overlay once. */
  const NS = 'http://www.w3.org/2000/svg';
  const svgUse = (id) => {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    const use = document.createElementNS(NS, 'use');
    use.setAttribute('href', '#' + id);
    svg.appendChild(use);
    return svg;
  };

  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.hidden = true;

  const backdrop = document.createElement('div');
  backdrop.className = 'lb-backdrop';

  const btnClose = document.createElement('button');
  btnClose.type = 'button';
  btnClose.className = 'lb-close';
  btnClose.appendChild(svgUse('i-close-outline'));

  const btnPrev = document.createElement('button');
  btnPrev.type = 'button';
  btnPrev.className = 'lb-nav lb-prev';
  btnPrev.appendChild(svgUse('i-chevron-back'));

  const btnNext = document.createElement('button');
  btnNext.type = 'button';
  btnNext.className = 'lb-nav lb-next';
  btnNext.appendChild(svgUse('i-chevron-forward'));

  const figure = document.createElement('figure');
  figure.className = 'lb-figure';
  const imgEl = document.createElement('img');
  imgEl.className = 'lb-img';
  imgEl.alt = '';
  const caption = document.createElement('figcaption');
  caption.className = 'lb-caption';
  figure.append(imgEl, caption);

  const counter = document.createElement('div');
  counter.className = 'lb-counter';
  counter.setAttribute('aria-hidden', 'true');

  overlay.append(backdrop, btnClose, btnPrev, btnNext, figure, counter);
  document.body.appendChild(overlay);

  let group = [];
  let index = 0;
  let trigger = null;

  function labelControls() {
    const L = t();
    btnClose.setAttribute('aria-label', L.close);
    btnPrev.setAttribute('aria-label', L.prev);
    btnNext.setAttribute('aria-label', L.next);
    overlay.setAttribute('aria-label', L.view);
  }

  function render() {
    const src = group[index];
    imgEl.src = src.currentSrc || src.src;
    /* Visible caption comes ONLY from a translated <figcaption>; the source
     * `alt` is an accessibility attribute (English site-wide) and must not be
     * promoted to visible text, or /index-ar would show English under every
     * hero. Heroes have no figcaption → no caption, in both languages. `alt`
     * still feeds the overlay image's accessible name. */
    const fig = src.closest('figure');
    const cap = fig && fig.querySelector('figcaption');
    const capText = (cap && cap.textContent.trim()) || '';
    caption.textContent = capText;
    caption.hidden = !capText;
    imgEl.alt = src.alt || capText;
    const multi = group.length > 1;
    btnPrev.hidden = !multi;
    btnNext.hidden = !multi;
    counter.hidden = !multi;
    if (multi) counter.textContent = (index + 1) + ' ' + t().of + ' ' + group.length;
  }

  function go(delta) {
    if (group.length < 2) return;
    index = (index + delta + group.length) % group.length;
    render();
  }

  function openAt(g, i, trg) {
    group = g;
    index = i;
    trigger = trg || null;
    labelControls();
    render();
    document.documentElement.classList.add('lb-open');
    overlay.hidden = false;
    if (!reduceMotion) {
      overlay.classList.add('lb-animate');
      // drop the class after the entrance so re-opening replays it
      setTimeout(() => overlay.classList.remove('lb-animate'), 300);
    }
    btnClose.focus();

    /* Umami: one guarded open event (project + image file). */
    if (window.umami && typeof window.umami.track === 'function') {
      const detail = trigger && trigger.closest('.project-detail');
      const src = group[index].getAttribute('src') || '';
      window.umami.track('lightbox-open', {
        project: (detail && detail.dataset.page) || 'unknown',
        image: src.split('/').pop(),
      });
    }
  }

  function close() {
    overlay.hidden = true;
    overlay.classList.remove('lb-animate');
    document.documentElement.classList.remove('lb-open');
    imgEl.removeAttribute('src');
    if (trigger) { trigger.focus(); trigger = null; }
  }

  backdrop.addEventListener('click', close);
  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', () => go(-1));
  btnNext.addEventListener('click', () => go(1));

  /* Keyboard: Esc closes; ←/→ page (mapping flips for RTL). */
  document.addEventListener('keydown', (e) => {
    if (overlay.hidden) return;
    const rtl = document.documentElement.dir === 'rtl';
    if (e.key === 'Escape') { e.stopPropagation(); close(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(rtl ? -1 : 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(rtl ? 1 : -1); }
    else if (e.key === 'Tab') {
      /* trap focus among the visible controls (prev/next hide for single images) */
      const focusables = [btnClose, btnPrev, btnNext].filter((el) => !el.hidden);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !overlay.contains(active))) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && (active === last || !overlay.contains(active))) {
        e.preventDefault(); first.focus();
      }
    }
  });

  /* Touch swipe: dragging the image toward the reading direction advances. */
  let startX = null;
  let startY = null;
  overlay.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  overlay.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    startX = startY = null;
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return; // ignore taps / vertical
    const rtl = document.documentElement.dir === 'rtl';
    const forward = dx < 0 ? !rtl : rtl; // swipe-left = forward in LTR
    go(forward ? 1 : -1);
  }, { passive: true });

  /* Re-label controls if the language is toggled while the page is open. */
  const langToggle = document.querySelector('[data-lang-toggle]');
  if (langToggle) langToggle.addEventListener('click', () => {
    if (!overlay.hidden) { labelControls(); render(); }
  });
})();
