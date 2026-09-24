'use strict';

const I18N = window.I18N || {};
const routes = window.PORTFOLIO_ROUTES;
const base = document.querySelector('base');
const siteRoot = new URL(base.getAttribute('href'), location.href);
base.href = siteRoot.href; // Relative assets and links stay stable after pushState.
const routeParams = new URLSearchParams(location.search);
const formal = routeParams.has('formal');
const staticRoute = document.documentElement.hasAttribute('data-static-route');
if (formal) {
  document.documentElement.classList.add('is-formal');
  document.querySelectorAll('[data-nav-link][data-target="resume"], [data-page="resume"]').forEach(el => el.remove());
  // Generated pages navigate with their own href, so the variant only survives
  // if every in-site link carries it forward — otherwise Resume is one click away.
  document.querySelectorAll('[data-nav-link], [data-project-open], [data-project-back], [data-lang-toggle], [data-skill-tech]')
    .forEach(el => {
      if (!el.getAttribute('href')) return;
      const url = new URL(el.href);
      url.searchParams.set('formal', '');
      el.href = url.href;
    });
}
const pages = [...document.querySelectorAll('[data-page]')];
const pageNames = pages.map(el => el.dataset.page);
const navigationLinks = document.querySelectorAll('[data-nav-link]');
const langToggle = document.querySelector('[data-lang-toggle]');
const langLabel = document.querySelector('[data-lang-label]');
const filterBtn = document.querySelectorAll('[data-filter-btn]');
const filterItems = document.querySelectorAll('[data-filter-item]');
const categories = ['all', ...new Set([...filterItems].map(el => el.dataset.category))];
let currentPage = document.documentElement.dataset.pageDefault || 'about';
let currentFilter = 'all';
let currentTechnology = null;
let restoring = false;
let restoreFrame;

function routeURL(page, lang = document.documentElement.lang) {
  const url = new URL(routes[page][lang], siteRoot);
  if (formal) url.searchParams.set('formal', '');
  return url;
}

function applyLang(lang) {
  const dict = I18N[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    if (dict[el.dataset.i18n] != null) el.textContent = dict[el.dataset.i18n];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    if (dict[el.dataset.i18nHtml] != null) el.innerHTML = dict[el.dataset.i18nHtml];
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    if (dict[el.dataset.i18nAria] != null) el.setAttribute('aria-label', dict[el.dataset.i18nAria]);
  });
  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    if (dict[el.dataset.i18nAlt] != null) el.alt = dict[el.dataset.i18nAlt];
  });
  const cv = document.querySelector('.cv-download');
  if (cv) {
    cv.href = lang === 'ar' ? cv.dataset.cvAr : cv.dataset.cvEn;
    cv.download = lang === 'ar' ? 'Anas_Alhalabi_CV_AR.pdf' : 'Anas_Alhalabi_CV.pdf';
  }
  const next = lang === 'ar' ? 'en' : 'ar';
  langLabel.textContent = next.toUpperCase();
  langToggle.setAttribute('aria-label', next === 'ar' ? 'AR: عرض الموقع بالعربية' : 'EN: View in English');
  langToggle.hreflang = next;
  try { localStorage.setItem('lang', lang); } catch (_) { /* storage is optional */ }
}

function filterFunc(value) {
  currentFilter = categories.includes(value) ? value : 'all';
  let count = 0;
  filterItems.forEach(el => {
    const visible = (currentFilter === 'all' || el.dataset.category === currentFilter) &&
      (!currentTechnology || JSON.parse(el.dataset.technologies || '[]').includes(currentTechnology));
    el.classList.toggle('active', visible);
    if (visible) count++;
  });
  const clear = document.querySelector('[data-tech-clear]');
  if (clear) clear.hidden = !currentTechnology;
  const techLabel = document.querySelector('[data-tech-label]');
  if (techLabel) techLabel.textContent = currentTechnology || '';
  filterBtn.forEach(el => {
    const selected = el.dataset.filter === currentFilter;
    el.classList.toggle('active', selected);
    el.setAttribute('aria-pressed', String(selected));
  });
  const status = document.querySelector('[data-filter-status]');
  if (status) status.textContent = count + ' / ' + filterItems.length + ' ' + I18N[document.documentElement.lang]['projects.count'];
}

function updatePageMetadata() {
  const lang = document.documentElement.lang;
  const dict = I18N[lang];
  const article = pages.find(el => el.dataset.page === currentPage);
  const title = currentPage === 'about' ? dict['meta.title'] :
    article.querySelector('h1').textContent.trim() + (lang === 'ar' ? ' | أنس الحلبي' : ' | Anas Alhalabi');
  document.title = title;
  const description = dict[routes[currentPage].description];
  const canonical = new URL(routes[currentPage][lang], 'https://noiceanas.com/');
  document.querySelector('link[rel="canonical"]').href = canonical.href;
  const values = { 'description': description, 'og:title': title, 'twitter:title': title,
    'og:description': description, 'twitter:description': description, 'og:url': canonical.href,
    'og:locale': lang === 'ar' ? 'ar_SA' : 'en_US' };
  Object.entries(values).forEach(([name, value]) => {
    const el = document.querySelector('meta[name="' + name + '"],meta[property="' + name + '"]');
    if (el) el.content = value;
  });
  document.querySelectorAll('link[hreflang]').forEach(el => {
    const url = new URL(routes[currentPage][el.hreflang === 'ar' ? 'ar' : 'en'], 'https://noiceanas.com/');
    el.href = url.href;
  });
  document.querySelectorAll('[data-nav-link], [data-project-open], [data-project-back]').forEach(el => {
    const target = el.dataset.target || el.dataset.projectOpen || 'projects';
    if (routes[target]) el.href = routeURL(target).href;
  });
  document.querySelectorAll('[data-project-back]').forEach(el => {
    const home = history.state && history.state.returnPage === 'about';
    if (home) el.href = routeURL('about').href;
    el.querySelector('span').textContent = home ? (lang === 'ar' ? 'العودة للرئيسية' : 'Back to home') : dict['pd.back'];
  });
  document.querySelector('[data-guide-link]').href = lang === 'ar' ? new URL('working-with-me/index-ar.html', siteRoot).href : new URL('working-with-me/', siteRoot).href;
  document.querySelectorAll('[data-skill-tech]').forEach(el => { const url = routeURL('projects'); url.searchParams.set('tech', el.dataset.skillTech); el.href = url.href; });
  langToggle.href = routeURL(currentPage, lang === 'ar' ? 'en' : 'ar').href;
  const schema = document.querySelector('script[type="application/ld+json"]');
  const initialGraph = JSON.parse(schema.textContent);
  const graph = (initialGraph['@graph'] || [initialGraph]).filter(item => ['Person', 'WebSite'].includes(item['@type']));
  const page = { '@type': currentPage === 'projects' ? 'CollectionPage' : 'WebPage', '@id': canonical.href + '#page',
    url: canonical.href, name: title, description, inLanguage: lang, about: { '@id': 'https://noiceanas.com/#person' } };
  graph.push(page);
  if (currentPage.startsWith('project-')) {
    page.mainEntity = { '@id': canonical.href + '#project' };
    graph.push({ '@type': 'CreativeWork', '@id': canonical.href + '#project', url: canonical.href,
      name: article.querySelector('h1').textContent.trim(), description, inLanguage: lang,
      author: { '@id': 'https://noiceanas.com/#person' }, keywords: [...article.querySelectorAll('.pd-chip')].map(el => el.textContent.trim()) });
  }
  if (currentPage === 'projects') {
    page.mainEntity = { '@id': canonical.href + '#list' };
    graph.push({ '@type': 'ItemList', '@id': canonical.href + '#list', itemListElement:
      Object.entries(routes).filter(([key]) => key.startsWith('project-')).map(([key, route], index) => ({
        '@type': 'ListItem', position: index + 1, url: 'https://noiceanas.com/' + route[lang],
        name: pages.find(el => el.dataset.page === key).querySelector('h1').textContent.trim()
      })) });
  }
  schema.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });

}

function snapshot() {
  return { ...history.state, portfolio: 1, page: currentPage, lang: document.documentElement.lang,
    filter: currentFilter, technology: currentTechnology, scroll: window.scrollY };
}
function savePosition() {
  if (!restoring) history.replaceState(snapshot(), '', location.href);
}

function showPage(state, { focus = false, track = false } = {}) {
  currentPage = pageNames.includes(state.page) ? state.page : 'about';
  applyLang(state.lang === 'ar' ? 'ar' : 'en');
  currentTechnology = state.technology || null;
  filterFunc(state.filter);
  const navTarget = currentPage.startsWith('project-') ? 'projects' : currentPage;
  pages.forEach(el => el.classList.toggle('active', el.dataset.page === currentPage));
  navigationLinks.forEach(el => {
    const active = el.dataset.target === navTarget;
    el.classList.toggle('active', active);
    if (active) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current');
  });
  updatePageMetadata();
  const article = pages.find(el => el.dataset.page === currentPage);
  const returnTrigger = state.focusProject && article.querySelector('[data-project-open="' + state.focusProject + '"]');
  if (focus) {
    (returnTrigger || article.querySelector('h1')).focus({ preventScroll: true });
  }
  cancelAnimationFrame(restoreFrame);
  restoring = true;
  restoreFrame = requestAnimationFrame(() => {
    // Restore the card to the same place in the viewport. This remains stable
    // when fonts, filters, or a different phone height change the page length.
    const anchoredTop = returnTrigger && Number.isFinite(state.returnOffset)
      ? returnTrigger.getBoundingClientRect().top + window.scrollY - state.returnOffset
      : state.scroll;
    window.scrollTo({ top: Math.max(0, anchoredTop || 0), behavior: 'instant' });
    restoring = false;
  });
  if (track && window.umami && typeof window.umami.track === 'function') {
    window.umami.track(props => ({ ...props, url: '/' + currentPage, title: document.title }));
  }
}

function navigate(page, options = {}) {
  if (!pageNames.includes(page)) return;
  const lang = options.lang || document.documentElement.lang;
  if (page === currentPage && lang === document.documentElement.lang) return;
  savePosition();
  if (options.technology) { currentTechnology = options.technology; currentFilter = 'all'; }
  if (page.startsWith('project-') && !currentPage.startsWith('project-')) {
    history.replaceState({
      ...history.state,
      focusProject: page,
      returnOffset: options.trigger ? options.trigger.getBoundingClientRect().top : null
    }, '', location.href);
  }
  const state = { portfolio: 1, page, lang, filter: currentFilter, technology: currentTechnology,
    returnPage: page.startsWith('project-') && !currentPage.startsWith('project-') ? currentPage : history.state.returnPage,
    scroll: page === currentPage ? window.scrollY : 0,
    returnDepth: page.startsWith('project-') && !currentPage.startsWith('project-') ? 1 :
      page === currentPage && history.state.returnDepth ? history.state.returnDepth + 1 : 0 };
  const url = routeURL(page, lang);
  if (page === 'projects' && currentTechnology) url.searchParams.set('tech', currentTechnology);
  history.pushState(state, '', url);
  showPage(state, { focus: true, track: true });
}

function plainClick(e) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}
const returnStorageKey = 'portfolio-project-return';
const redirectEntryKey = 'portfolio-redirect-entry';
/* location.replace() drops the entry it navigated away from but still reports it
 * as document.referrer, so a same-origin referrer is not proof that going back
 * lands anywhere useful. Record the destination of every redirect we perform and
 * treat it as a fresh entry point instead. */
function rememberRedirectEntry(url) {
  try { sessionStorage.setItem(redirectEntryKey, url.href); } catch (_) { /* storage is optional */ }
}
function enteredByRedirect() {
  try { return sessionStorage.getItem(redirectEntryKey) === location.href; }
  catch (_) { return false; }
}
/* A cached copy of an old redirect stub at the destination sends us straight
 * back here, and the browser serves it without touching the network — an
 * unbreakable ping-pong. (Real case: `/skills/` used to be a stub redirecting to
 * `/?page=skills`; after the switch to real pages, anyone holding that cached
 * stub — a returning visitor, or a dev whose localhost served the repo root —
 * bounces forever.) Count the hops and give up rather than loop. */
const redirectHopsKey = 'portfolio-redirect-hops';
const maxRedirectHops = 2; // one hop resolves any legitimate legacy link
function redirectHops(value) {
  try {
    if (value == null) return Number(sessionStorage.getItem(redirectHopsKey)) || 0;
    if (value === 0) sessionStorage.removeItem(redirectHopsKey);
    else sessionStorage.setItem(redirectHopsKey, String(value));
  } catch (_) { /* storage is optional */ }
  return value || 0;
}
function readProjectReturn() {
  try { return JSON.parse(sessionStorage.getItem(returnStorageKey) || 'null'); }
  catch (_) { return null; }
}
function writeProjectReturn(value) {
  try { sessionStorage.setItem(returnStorageKey, JSON.stringify(value)); }
  catch (_) { /* browser history still provides a safe fallback */ }
}
function closeProjectDetail() {
  if (staticRoute) {
    const savedReturn = readProjectReturn();
    if (savedReturn && savedReturn.project === currentPage && savedReturn.depth > 0) {
      try { sessionStorage.removeItem(returnStorageKey); } catch (_) { /* optional storage */ }
      history.go(-savedReturn.depth);
      return;
    }
    const referrer = document.referrer && new URL(document.referrer);
    if (!enteredByRedirect() && referrer && referrer.origin === location.origin && history.length > 1) history.back();
    else location.href = routeURL('projects').href;
    return;
  }
  if (history.state && history.state.returnDepth) history.go(-history.state.returnDepth);
  else navigate('projects');
}
for (const link of document.querySelectorAll('[data-nav-link], [data-project-open]')) {
  if (staticRoute) continue;
  link.addEventListener('click', e => {
    if (!plainClick(e)) return;
    e.preventDefault();
    const target = link.dataset.target || link.dataset.projectOpen;
    if (target === 'projects' && currentPage.startsWith('project-')) closeProjectDetail();
    else navigate(target, { trigger: link });
  });
}
if (staticRoute) document.querySelectorAll('[data-project-open]').forEach(link => {
  link.addEventListener('click', e => {
    if (!plainClick(e)) return;
    const project = link.dataset.projectOpen;
    history.replaceState({ ...history.state, focusProject: project }, '', location.href);
    writeProjectReturn({ project, depth: 1 });
  });
});
document.querySelectorAll('[data-project-back]').forEach(el => el.addEventListener('click', e => {
  if (!plainClick(e)) return;
  e.preventDefault(); closeProjectDetail();
}));
if (!staticRoute) langToggle.addEventListener('click', e => {
  if (!plainClick(e)) return;
  e.preventDefault(); navigate(currentPage, { lang: document.documentElement.lang === 'ar' ? 'en' : 'ar' });
});
if (staticRoute) langToggle.addEventListener('click', e => {
  if (!plainClick(e) || !currentPage.startsWith('project-')) return;
  const savedReturn = readProjectReturn();
  if (savedReturn && savedReturn.project === currentPage) {
    writeProjectReturn({ ...savedReturn, depth: savedReturn.depth + 1 });
  }
});
filterBtn.forEach(el => el.addEventListener('click', () => {
  filterFunc(el.dataset.filter);
  if (staticRoute) {
    const url = new URL(location.href);
    if (currentFilter === 'all') url.searchParams.delete('category');
    else url.searchParams.set('category', currentFilter);
    history.replaceState(history.state, '', url);
  } else savePosition();
}));
document.querySelectorAll('[data-skill-tech]').forEach(el => el.addEventListener('click', e => {
  if (staticRoute) return;
  if (!plainClick(e)) return;
  e.preventDefault(); navigate('projects', { technology: el.dataset.skillTech });
}));
const technologyClear = document.querySelector('[data-tech-clear]');
if (technologyClear) technologyClear.addEventListener('click', () => {
  currentTechnology = null; filterFunc(currentFilter);
  const url = new URL(location.href); url.searchParams.delete('tech');
  history.replaceState(snapshot(), '', url);
  document.querySelector('[data-filter-btn].active').focus({ preventScroll: true });
});
const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');
sidebarBtn.addEventListener('click', () => {
  const expanded = sidebar.classList.toggle('active');
  sidebarBtn.setAttribute('aria-expanded', String(expanded));
});

/* ------------------------------------------------------------------ *
 * analytics for same-tab links — fire without delaying the navigation
 * ------------------------------------------------------------------ *
 * Umami's own [data-umami-event] handler runs on document capture: for any <a>
 * it calls preventDefault(), waits for its tracking request, and only then sets
 * location.href. On a multi-page site that stalls every tap behind a round-trip
 * to cloud.umami.is (the visible hitch on click) and it drops the `download`
 * filename on the CV / vCard links. Links that open in a new tab are exempt in
 * Umami's own code, so they keep data-umami-event; every same-tab link carries
 * `data-track-event` (+ optional data-track-event-* props) instead, which Umami
 * never sees, and we report it here on pointerdown — before the browser starts
 * the navigation — leaving the click itself completely untouched.
 */
function trackLink(el) {
  if (!window.umami || typeof window.umami.track !== 'function') return;
  const props = {};
  for (const name of el.getAttributeNames()) {
    const prop = name.match(/^data-track-event-(.+)$/);
    if (prop) props[prop[1]] = el.getAttribute(name);
  }
  window.umami.track(el.dataset.trackEvent, props);
}
document.addEventListener('pointerdown', e => {
  const el = e.target.closest('[data-track-event]');
  if (el) trackLink(el);
}, true);
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const el = e.target.closest && e.target.closest('[data-track-event]');
  if (el) trackLink(el);
}, true);

function stateFromURL() {
  const url = new URL(location.href);
  const path = url.pathname.slice(siteRoot.pathname.length).replace(/index\.html$/, '');
  const match = Object.entries(routes).find(([, route]) => route.en === path || route.ar === path || route.ar.replace(/\.html$/, '') === path);
  let page = url.searchParams.get('page') || (url.hash && url.hash !== '#ar' ? url.hash.slice(1) : null) || (match && match[0]) || document.documentElement.dataset.pageDefault;
  const language = url.searchParams.get('lang');
  const lang = language === 'en' || language === 'ar' ? language :
    path.includes('index-ar') || url.hash === '#ar' || url.searchParams.get('page') === 'ar' ? 'ar' : 'en';
  if (!pageNames.includes(page)) page = 'about';
  return { portfolio: 1, page, lang, filter: 'all', technology: url.searchParams.get('tech'), scroll: 0 };
}
if (staticRoute) {
  // Legacy deep links (?page=…, ?lang=…, the ar/ and formal/ stubs) predate the
  // per-page URLs, so resolve them to the real page instead of re-rendering here.
  // #skills / #projects / #ar are the pre-routing hash links; a hash that is not
  // a known page is left alone so ordinary in-page anchors keep working.
  const legacyHash = location.hash.slice(1);
  const legacyPage = routeParams.get('page') || (routes[legacyHash] ? legacyHash : null);
  const legacyLang = routeParams.get('lang') ||
    (legacyPage === 'ar' || legacyHash === 'ar' ? 'ar' : null);
  const pageLang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
  const wantedLang = legacyLang === 'ar' ? 'ar' : legacyLang === 'en' ? 'en' : pageLang;
  // The formal variant ships no Resume tab, so /resume/?formal has nothing left
  // to show — send it home rather than render an empty document.
  const redirectTo = formal && !pages.length ? 'about'
    : legacyPage && legacyPage !== 'ar' && routes[legacyPage] ? legacyPage
    : wantedLang !== pageLang ? (routes[currentPage] ? currentPage : 'about')
    : null;
  const hops = redirectHops();
  if (redirectTo && hops >= maxRedirectHops) {
    // Bouncing. Stop, keep whatever this document can render, and tidy the URL
    // so the stale legacy params can't start the same loop on the next reload.
    redirectHops(0);
    history.replaceState(history.state, '', routeURL(currentPage, pageLang));
  } else if (redirectTo) {
    const destination = routeURL(redirectTo, wantedLang);
    const tech = routeParams.get('tech');
    if (tech && redirectTo === 'projects') destination.searchParams.set('tech', tech);
    redirectHops(hops + 1);
    rememberRedirectEntry(destination);
    location.replace(destination);
  }
  if (!redirectTo || hops >= maxRedirectHops) {
    redirectHops(0);
    applyLang(document.documentElement.lang === 'ar' ? 'ar' : 'en');
    currentTechnology = routeParams.get('tech');
    filterFunc(routeParams.get('category') || 'all');
    window.addEventListener('pageshow', () => {
      const trigger = history.state && history.state.focusProject &&
        document.querySelector('[data-project-open="' + history.state.focusProject + '"]');
      if (trigger) trigger.focus({ preventScroll: true });
    });
  }
} else {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const initial = history.state && history.state.portfolio ? history.state : stateFromURL();
  const initialURL = routeURL(initial.page, initial.lang);
  if (initial.page === 'projects' && initial.technology) initialURL.searchParams.set('tech', initial.technology);
  history.replaceState(initial, '', initialURL);
  showPage(initial);
  // Font metrics and reserved image dimensions make restoration reliable on reload.
  document.fonts.ready.then(() => {
    if (history.state === null || currentPage !== initial.page) return;
    if (initial.scroll) window.scrollTo({ top: initial.scroll, behavior: 'instant' });
  });
  window.addEventListener('popstate', e => {
    document.dispatchEvent(new Event('portfolio:navigate'));
    showPage(e.state && e.state.portfolio ? e.state : stateFromURL(), { focus: true, track: true });
  });
  document.addEventListener('scrollend', savePosition);
  window.addEventListener('pagehide', savePosition);
  document.addEventListener('visibilitychange', () => { if (document.hidden) savePosition(); });
}
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape' || document.documentElement.classList.contains('lb-open')) return;
  if (currentPage.startsWith('project-')) closeProjectDetail();
});

/* ------------------------------------------------------------------ *
 * scroll-reveal animations + animated skill bars
 * ------------------------------------------------------------------ */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    if (trigger) { trigger.focus({ preventScroll: true }); trigger = null; }
  }

  document.addEventListener('portfolio:navigate', () => { if (!overlay.hidden) close(); });
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
