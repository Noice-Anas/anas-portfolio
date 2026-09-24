'use strict';

// Assemble only public files. Source redirect stubs are replaced by real pages.
const fs = require('node:fs');
const path = require('node:path');
const { parse } = require('node-html-parser');
const routes = require('../assets/js/routes');
const dictionaries = require('../assets/js/i18n-data');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, '_site');
const SITE = 'https://noiceanas.com/';
// Start from an empty _site so a renamed or deleted route cannot linger.
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
for (const file of ['assets', 'working-with-me', 'portfolio-pricing', 'formal', 'ar', '404.html', 'CNAME', '.nojekyll', 'robots.txt', 'LICENSE']) {
  fs.cpSync(path.join(ROOT, file), path.join(OUT, file), { recursive: true });
}
const escape = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const sources = { en: fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'), ar: fs.readFileSync(path.join(ROOT, 'index-ar.html'), 'utf8') };
const urls = [];
for (const [page, route] of Object.entries(routes)) {
  for (const lang of ['en', 'ar']) {
    const root = parse(sources[lang], { comment: true });
    const dict = dictionaries[lang];
    const url = SITE + route[lang];
    const filename = route[lang].endsWith('.html') ? route[lang] : route[lang] + 'index.html';
    const depth = filename.split('/').length - 1;
    root.querySelector('base').setAttribute('href', depth ? '../'.repeat(depth) : './');
    root.querySelector('html').setAttribute('data-page-default', page);
    root.querySelector('html').setAttribute('data-lang-lock', lang);
    root.querySelector('html').setAttribute('data-static-route', '');
    root.querySelectorAll('article[data-page]').forEach(el => {
      el.classList.remove('active');
      if (el.getAttribute('data-page') === page) el.classList.add('active');
    });
    const article = root.querySelector('[data-page="' + page + '"]');
    const name = article.querySelector('h1').textContent.trim();
    const title = page === 'about' ? dict['meta.title'] : name + (lang === 'ar' ? ' | أنس الحلبي' : ' | Anas Alhalabi');
    const description = dict[route.description];
    root.querySelector('title').set_content(escape(title));
    const meta = (key, value) => {
      const el = root.querySelector('meta[name="' + key + '"], meta[property="' + key + '"]');
      if (el) el.setAttribute('content', value);
    };
    meta('description', description); meta('og:title', title); meta('twitter:title', title);
    meta('og:description', description); meta('twitter:description', description); meta('og:url', url);
    root.querySelector('link[rel="canonical"]').setAttribute('href', url);
    root.querySelectorAll('link[hreflang]').forEach(el => el.setAttribute('href', SITE + route[el.getAttribute('hreflang') === 'ar' ? 'ar' : 'en']));
    root.querySelectorAll('[data-nav-link], [data-project-open], [data-project-back]').forEach(el => {
      const target = el.getAttribute('data-target') || el.getAttribute('data-project-open') || 'projects';
      el.setAttribute('href', routes[target][lang] || './');
      if (el.hasAttribute('data-nav-link')) {
        const active = target === (page.startsWith('project-') ? 'projects' : page);
        el.classList.remove('active'); el.removeAttribute('aria-current');
        if (active) { el.classList.add('active'); el.setAttribute('aria-current', 'page'); }
      }
    });
    const next = lang === 'ar' ? 'en' : 'ar';
    const toggle = root.querySelector('[data-lang-toggle]');
    toggle.setAttribute('href', route[next] || './'); toggle.setAttribute('hreflang', next);
    toggle.setAttribute('aria-label', next === 'ar' ? 'AR: عرض الموقع بالعربية' : 'EN: View in English');
    root.querySelector('[data-lang-label]').set_content(next.toUpperCase());
    const cv = root.querySelector('.cv-download');
    cv.setAttribute('href', cv.getAttribute(lang === 'ar' ? 'data-cv-ar' : 'data-cv-en'));
    cv.setAttribute('download', lang === 'ar' ? 'Anas_Alhalabi_CV_AR.pdf' : 'Anas_Alhalabi_CV.pdf');
    const personID = SITE + '#person';
    const person = { '@type': 'Person', '@id': personID, name: 'Anas Alhalabi', alternateName: 'أنس الحلبي', url: SITE,
      image: SITE + 'assets/images/my-avatar.webp', jobTitle: 'Software Engineer',
      address: { '@type': 'PostalAddress', addressLocality: 'Riyadh', addressCountry: 'SA' },
      knowsLanguage: ['Arabic', 'English'], knowsAbout: ['Swift', 'SwiftUI', 'iOS development', 'Next.js', 'TypeScript', 'Backend APIs'],
      sameAs: ['https://github.com/Noice-Anas', 'https://www.linkedin.com/in/anas-al-halabi/', 'https://stackoverflow.com/users/19689601/anas-alhalabi'] };
    const webpage = { '@type': page === 'projects' ? 'CollectionPage' : 'WebPage', '@id': url + '#page', url,
      name: title, description, inLanguage: lang, about: { '@id': personID }, isPartOf: { '@id': SITE + '#website' } };
    const graph = [person, { '@type': 'WebSite', '@id': SITE + '#website', url: SITE, name: 'Anas Alhalabi', inLanguage: ['en','ar'], publisher: { '@id': personID } }, webpage];
    if (page.startsWith('project-')) {
      const work = { '@type': 'CreativeWork', '@id': url + '#project', name, description, url, inLanguage: lang,
        author: { '@id': personID }, keywords: article.querySelectorAll('.pd-chip').map(el => el.textContent.trim()) };
      webpage.mainEntity = { '@id': work['@id'] }; graph.push(work);
      graph.push({ '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: dict['nav.projects'], item: SITE + routes.projects[lang] },
        { '@type': 'ListItem', position: 2, name, item: url }
      ] });
    }
    if (page === 'projects') {
      const list = { '@type': 'ItemList', '@id': url + '#list', itemListElement: Object.entries(routes).filter(([key]) => key.startsWith('project-')).map(([key,r], index) => ({ '@type': 'ListItem', position: index + 1, url: SITE + r[lang], name: root.querySelector('[data-page="' + key + '"] h1').textContent.trim() })) };
      webpage.mainEntity = { '@id': list['@id'] }; graph.push(list);
    }
    root.querySelector('script[type="application/ld+json"]').set_content(JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c'));
    // Each public URL ships only its own content. Navigation uses real links,
    // which gives browsers reliable history and reduces parsing on phones.
    root.querySelectorAll('article[data-page]').forEach(el => {
      if (el.getAttribute('data-page') !== page) el.remove();
    });
    const usedKeys = new Set();
    root.querySelectorAll('[data-i18n], [data-i18n-html], [data-i18n-aria], [data-i18n-alt]').forEach(el => {
      const key = el.getAttribute('data-i18n') || el.getAttribute('data-i18n-html') ||
        el.getAttribute('data-i18n-aria') || el.getAttribute('data-i18n-alt');
      if (key) usedKeys.add(key);
    });
    usedKeys.add('projects.count');
    usedKeys.add('pd.back');
    const pageDictionary = Object.fromEntries([...usedKeys]
      .filter(key => dict[key] != null)
      .map(key => [key, dict[key]]));
    const i18nScript = root.querySelector('script[src$="assets/js/i18n-data.js"]');
    i18nScript.removeAttribute('src');
    i18nScript.set_content('window.I18N=' + JSON.stringify({ en: pageDictionary, ar: pageDictionary }).replace(/</g, '\\u003c') + ';');
    // Preload only the font used by this language. Keep screenshot loading lazy.
    root.querySelector('head').insertAdjacentHTML('beforeend', '<link rel="preload" as="font" type="font/woff2" crossorigin href="assets/fonts/' + (lang === 'ar' ? 'year-of-handicrafts/YearofHandicrafts-Regular.woff2' : 'poppins/poppins-400-latin.woff2') + '">');
    const target = path.join(OUT, filename); fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, root.toString()); urls.push({ url, en: SITE + route.en, ar: SITE + route.ar });
  }
}
// Preserve /about/ without creating a second indexable homepage.
fs.mkdirSync(path.join(OUT, 'about'), { recursive: true });
fs.copyFileSync(path.join(OUT, 'index.html'), path.join(OUT, 'about/index.html'));
const about = path.join(OUT, 'about/index.html');
fs.writeFileSync(about, fs.readFileSync(about, 'utf8').replace('<base href="./">', '<base href="../">'));
for (const lang of ['en', 'ar']) urls.push({ url: SITE + 'working-with-me/' + (lang === 'ar' ? 'index-ar' : ''), en: SITE + 'working-with-me/', ar: SITE + 'working-with-me/index-ar' });
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + urls.map(r => '  <url><loc>' + r.url + '</loc>' + ['en','ar','x-default'].map(lang => '<xhtml:link rel="alternate" hreflang="' + lang + '" href="' + r[lang === 'ar' ? 'ar' : 'en'] + '"/>').join('') + '</url>').join('\n') + '\n</urlset>\n';
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), sitemap);
console.log('Built ' + (urls.length - 2) + ' portfolio pages in English and Arabic in _site/.');
