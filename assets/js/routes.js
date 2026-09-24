'use strict';

// Shared by the static build and browser. Existing public slugs stay stable.
(function (root, factory) {
  const routes = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = routes;
  else root.PORTFOLIO_ROUTES = routes;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const paths = {
    about: '', skills: 'skills/', projects: 'projects/', resume: 'resume/', contact: 'contact/',
    'project-mykarage': 'projects/mykarage/',
    'project-karagekash': 'projects/karage-kash/',
    'project-jamaatna': 'projects/jamaatna/',
    'project-myvenue': 'projects/myvenue/',
    'project-dashboard': 'projects/dashboard/',
    'project-4service': 'projects/4service/',
    'project-saleh': 'projects/saleh/',
    'project-goldprice': 'projects/goldprice/',
    'project-turathiyat': 'projects/turathiyat/',
    'project-kidsstory': 'projects/kidsstory/',
    'project-howamesh': 'projects/howamesh/',
    'project-alnajim': 'projects/alnajim/'
  };
  return Object.fromEntries(Object.entries(paths).map(([page, path]) => [page, {
    en: path,
    ar: path + 'index-ar.html',
    description: page.startsWith('project-') ? 'desc.' + page.slice(8) :
      page === 'projects' ? 'projects.intro' : page === 'contact' ? 'contact.intro' : 'meta.description'
  }]));
});
