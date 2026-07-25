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

function applyLang(lang) {
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

  try { localStorage.setItem('lang', lang); } catch (e) { /* ignore */ }
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

/* Default to the language the document was SERVED in (its <html lang>), not a
 * hardcoded 'en'. This matters for the build-generated Arabic page (index-ar.html,
 * <html lang="ar">): a JS-rendering crawler like Googlebot has no localStorage, so
 * without this it would fall through to 'en' and applyLang would flip the rendered
 * DOM back to English — defeating the whole point of the static Arabic page.
 * Precedence: explicit ?lang=/#ar  >  the visitor's saved choice  >  page lang. */
const pageLang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
let savedLang = pageLang;
try { savedLang = localStorage.getItem('lang') || pageLang; } catch (e) { /* ignore */ }
const requestedLang = routeParams.get('lang') || (routeHash === 'ar' ? 'ar' : null);
applyLang(requestedLang === 'ar' || requestedLang === 'en' ? requestedLang : savedLang);


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

/* Esc closes an open detail view (its article carries data-parent). */
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape') return;
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
