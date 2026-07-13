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

const I18N = {
  en: {
    'meta.title': 'Anas Alhalabi — Software Engineer',
    'role': 'Software Engineer',
    'showContacts': 'Show Contacts',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.location': 'Location',
    'contact.website': 'Website',
    'location': 'Riyadh, Saudi Arabia',

    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.projects': 'Projects',
    'nav.resume': 'Resume',
    'nav.contact': 'Contact',

    'about.title': 'About me',
    'about.p1': "I'm a software engineer with a mobile-first focus and 4+ years building production apps, dashboards and backend services. I bounce between iOS, web and backend — jack of all trades, maybe, but I try to do each one well.",
    'about.p2': "At Karage I built and shipped two App Store apps: <strong>My Karage</strong>, a customer-facing iOS app with booking and payments that reached 5,000+ users, and <strong>Karage Kash</strong>, an iPadOS point-of-sale app in Swift &amp; SwiftUI. Alongside the apps I work on a Next.js/TypeScript reporting dashboard and ASP.NET Core microservices — so I've seen products from the UI down to the database.",
    'about.p3': "I'm not a fan of quick fixes that break in a month. I write code for the person who maintains it later (usually me), I genuinely enjoy code reviews, and I lean on AI tools like Claude Code daily to move faster without shipping sloppy work. Always learning, always building, always shipping.",
    'about.doing': "What I'm doing",
    'svc.ios.t': 'iOS & iPadOS Development',
    'svc.ios.d': 'Native apps in Swift & SwiftUI — booking, payments and point-of-sale, shipped to the App Store.',
    'svc.web.t': 'Web & Dashboards',
    'svc.web.d': 'Next.js & TypeScript front-ends and reporting dashboards backed by Node.js and Supabase.',
    'svc.api.t': 'Backend & APIs',
    'svc.api.d': 'ASP.NET Core & Node.js microservices, REST APIs and PostgreSQL — with CI/CD and unit tests.',
    'svc.ai.t': 'AI-Assisted Development',
    'svc.ai.d': 'Using Claude Code daily to prototype, debug and document — reviewing every output before it ships.',

    'skills.title': 'Skills',
    'skills.tools': 'Tools & technologies',
    'skill.cicd': 'CI/CD & Testing',
    'skill.i18n': 'i18n (EN / AR)',
    'skills.comfort': 'Comfort level',
    'bar.swift': 'Swift / SwiftUI (iOS)',
    'bar.ts': 'TypeScript / Next.js',
    'bar.backend': 'Backend — Node.js / ASP.NET Core',
    'bar.db': 'PostgreSQL / Supabase',

    'projects.title': 'Projects',
    'filter.all': 'All',
    'filter.ios': 'iOS',
    'filter.web': 'Web',
    'filter.fullstack': 'Fullstack',
    'filter.select': 'Select category',
    'cat.mykarage': 'iOS · 5,000+ users',
    'desc.mykarage': 'Customer-facing iOS app with booking and payments, integrating REST APIs and secure storage. Grew to 5,000+ users with measurable gains in booking experience.',
    'cat.karagekash': 'iPadOS · Point of sale',
    'desc.karagekash': 'An iPadOS point-of-sale app built in Swift and SwiftUI, focused on reliability and accessibility for day-to-day store operations.',
    'cat.jamaatna': 'Fullstack · Events platform',
    'desc.jamaatna': 'An all-in-one platform to run weddings and events from the invite to the door — elegant digital invitations, one-tap RSVP, QR entry codes, and a live attendance dashboard. Arabic & English (RTL).',
    'cat.myvenue': 'Fullstack · Venue booking',
    'desc.myvenue': 'An Airbnb-style marketplace for booking event venues in Riyadh, Saudi Arabia — map search, categories (halls, chalets, farms, majlis), ratings, favorites and bookings. Arabic-first with English.',
    'title.dashboard': 'Invoicing & Reporting Dashboard',
    'cat.dashboard': 'Web · Next.js',
    'desc.dashboard': 'A Next.js & TypeScript dashboard for a car-services business. I supported building it and built the invoicing system inside it — ZATCA-style simplified & A4 tax invoices, quotations and reporting.',
    'cat.website': 'Web · Personal site',
    'desc.website': 'My personal site and blog — writing on iOS development, macOS productivity and AI-assisted dev workflows.',
    'title.portfolio': 'Personal Portfolio',
    'cat.portfolio': 'Web · HTML/CSS/JS',
    'desc.portfolio': 'This site — a mobile-first, bilingual (English/Arabic) single-page portfolio built with vanilla HTML, CSS and JavaScript. No build step, no dependencies; scroll-reveal animations, RTL support and a custom i18n engine.',
    'link.live': 'Live',
    'note.private': 'Private — company project',

    'resume.title': 'Resume',
    'resume.download': 'Download CV (PDF)',
    'resume.experience': 'Experience',
    'exp.karage.t': 'Software Engineer — Karage',
    'exp.karage.d': 'Dec 2021 — Present',
    'exp.karage.x': 'Shipped two App Store apps (My Karage, 5,000+ users; Karage Kash, iPadOS POS). Improved a Next.js/TypeScript reporting dashboard and ASP.NET Core microservices, added unit tests (~80% coverage) and CI pipelines, and led code reviews and architecture standards.',
    'exp.lablab.t': 'Volunteer Mentor Lead — LabLab MENA',
    'exp.lablab.d': 'May 2023 — Jul 2023',
    'exp.lablab.x': 'Mentored hackathon teams on technical execution, architecture and deployment; ran workshops and provided developer support to raise project quality.',
    'exp.marn.t': 'Website Developer — Marn',
    'exp.marn.d': 'Sep 2021 — Dec 2021',
    'exp.marn.x': 'Built Webflow CMS solutions and collaborated with designers to deliver responsive web experiences.',
    'resume.education': 'Education & Certifications',
    'edu.degree.t': 'B.Sc. Software Engineering — University of the People',
    'edu.degree.d': 'Graduated Jun 2025',
    'edu.degree.x': 'Bachelor of Science in Software Engineering.',
    'edu.ielts.t': 'IELTS Academic — Band 7',
    'edu.ielts.x': 'Professional English proficiency.<br>Arabic — native.',
    'edu.prompt.t': 'Prompt Engineering — DeepLearning.AI',
    'edu.prompt.x': 'Applied prompt engineering for AI-assisted development workflows.',
    'cert': 'Certification',

    'contact.title': 'Contact',
    'contact.intro': "I'm open to opportunities and collaboration — reach me through any of these."
  },

  ar: {
    'meta.title': 'أنس الحلبي — مهندس برمجيات',
    'role': 'مهندس برمجيات',
    'showContacts': 'إظهار معلومات التواصل',
    'contact.email': 'البريد الإلكتروني',
    'contact.phone': 'الهاتف',
    'contact.location': 'الموقع',
    'contact.website': 'الموقع الإلكتروني',
    'location': 'المملكة العربية السعودية',

    'nav.about': 'نبذة',
    'nav.skills': 'المهارات',
    'nav.projects': 'المشاريع',
    'nav.resume': 'السيرة',
    'nav.contact': 'تواصل',

    'about.title': 'نبذة عني',
    'about.p1': 'مهندس برمجيات بتركيز على تطبيقات الجوّال، ولديّ أكثر من 4 سنوات في بناء تطبيقات ولوحات تحكم وخدمات خلفية في بيئة الإنتاج. أتنقّل بين iOS والويب والأنظمة الخلفية — وأحرص أن أُتقن كلًّا منها.',
    'about.p2': 'في <strong>Karage</strong> أطلقت تطبيقَين على App Store: <strong>My Karage</strong>، تطبيق iOS موجّه للعملاء للحجز والدفع تجاوز 5,000 مستخدم، و<strong>Karage Kash</strong>، تطبيق نقاط بيع لـ iPadOS مبني بـ Swift و SwiftUI. وإلى جانب التطبيقات أعمل على لوحة تقارير بـ Next.js و TypeScript وخدمات مصغّرة بـ ASP.NET Core — فرأيت المنتجات من الواجهة حتى قاعدة البيانات.',
    'about.p3': 'لست من محبّي الحلول السريعة التي تنهار بعد شهر. أكتب الكود من أجل من سيصونه لاحقًا (وغالبًا أكون أنا)، وأستمتع فعلًا بمراجعات الكود، وأعتمد يوميًا على أدوات الذكاء الاصطناعي مثل Claude Code لأنجز أسرع دون التفريط في الجودة. دائمًا أتعلّم، دائمًا أبني، دائمًا أُطلق.',
    'about.doing': 'ما الذي أعمل عليه',
    'svc.ios.t': 'تطوير iOS و iPadOS',
    'svc.ios.d': 'تطبيقات أصلية بـ Swift و SwiftUI — حجز ودفع ونقاط بيع، منشورة على App Store.',
    'svc.web.t': 'الويب ولوحات التحكم',
    'svc.web.d': 'واجهات ولوحات تقارير بـ Next.js و TypeScript مدعومة بـ Node.js و Supabase.',
    'svc.api.t': 'الأنظمة الخلفية وواجهات البرمجة',
    'svc.api.d': 'خدمات مصغّرة بـ ASP.NET Core و Node.js وواجهات REST و PostgreSQL — مع CI/CD واختبارات وحدة.',
    'svc.ai.t': 'التطوير بمساعدة الذكاء الاصطناعي',
    'svc.ai.d': 'استخدام Claude Code يوميًا للنماذج الأولية والتصحيح والتوثيق — مع مراجعة كل مخرَج قبل إطلاقه.',

    'skills.title': 'المهارات',
    'skills.tools': 'الأدوات والتقنيات',
    'skill.cicd': 'CI/CD والاختبارات',
    'skill.i18n': 'التوطين (عربي/إنجليزي)',
    'skills.comfort': 'مستوى الإتقان',
    'bar.swift': 'Swift / SwiftUI (iOS)',
    'bar.ts': 'TypeScript / Next.js',
    'bar.backend': 'الخلفية — Node.js / ASP.NET Core',
    'bar.db': 'PostgreSQL / Supabase',

    'projects.title': 'المشاريع',
    'filter.all': 'الكل',
    'filter.ios': 'iOS',
    'filter.web': 'الويب',
    'filter.fullstack': 'متكامل',
    'filter.select': 'اختر التصنيف',
    'cat.mykarage': 'iOS · أكثر من 5,000 مستخدم',
    'desc.mykarage': 'تطبيق iOS موجّه للعملاء للحجز والدفع، مع تكامل مع واجهات REST وتخزين آمن. نما إلى أكثر من 5,000 مستخدم مع تحسّن ملموس في تجربة الحجز.',
    'cat.karagekash': 'iPadOS · نقاط بيع',
    'desc.karagekash': 'تطبيق نقاط بيع لـ iPadOS مبني بـ Swift و SwiftUI، يركّز على الموثوقية وسهولة الوصول في العمليات اليومية للمتجر.',
    'cat.jamaatna': 'متكامل · منصة مناسبات',
    'desc.jamaatna': 'منصة متكاملة لإدارة الأعراس والمناسبات من الدعوة حتى الاستقبال — دعوات رقمية أنيقة، تأكيد حضور بنقرة واحدة، رموز QR للدخول، ولوحة حضور مباشرة. بالعربية والإنجليزية (RTL).',
    'cat.myvenue': 'متكامل · حجز قاعات',
    'desc.myvenue': 'سوق على نمط Airbnb لحجز قاعات المناسبات في السعودية — بحث عبر الخريطة، تصنيفات (قاعات، شاليهات، مزارع، مجالس)، تقييمات ومفضّلة وحجوزات. عربي أولًا مع الإنجليزية.',
    'title.dashboard': 'لوحة الفوترة والتقارير',
    'cat.dashboard': 'ويب · Next.js',
    'desc.dashboard': 'لوحة بـ Next.js و TypeScript لأعمال خدمات السيارات. ساهمتُ في بنائها وبنيتُ نظام الفوترة داخلها — فواتير ضريبية مبسّطة و A4 على نمط هيئة الزكاة والضريبة، وعروض أسعار وتقارير.',
    'cat.website': 'ويب · موقع شخصي',
    'desc.website': 'موقعي الشخصي ومدوّنتي — أكتب عن تطوير iOS وإنتاجية macOS وسير عمل التطوير بمساعدة الذكاء الاصطناعي.',
    'title.portfolio': 'الموقع الشخصي',
    'cat.portfolio': 'ويب · HTML/CSS/JS',
    'desc.portfolio': 'هذا الموقع — بورتفوليو من صفحة واحدة، يعمل أولاً على الجوال وثنائي اللغة (الإنجليزية/العربية)، مبني بـ HTML و CSS و JavaScript خام. بلا خطوة بناء ولا اعتماديات؛ مع حركات تظهر عند التمرير، ودعم الكتابة من اليمين لليسار، ومحرّك تعريب مخصّص.',
    'link.live': 'زيارة',
    'note.private': 'خاص — مشروع شركة',

    'resume.title': 'السيرة الذاتية',
    'resume.download': 'تحميل السيرة الذاتية (PDF)',
    'resume.experience': 'الخبرات',
    'exp.karage.t': 'مهندس برمجيات — Karage',
    'exp.karage.d': 'ديسمبر 2021 — حتى الآن',
    'exp.karage.x': 'أطلقتُ تطبيقَين على App Store (My Karage بأكثر من 5,000 مستخدم؛ Karage Kash لنقاط البيع على iPadOS). طوّرتُ لوحة تقارير بـ Next.js و TypeScript وخدمات ASP.NET Core المصغّرة، وأضفتُ اختبارات وحدة (تغطية ~80%) ومسارات CI، وقدتُ مراجعات الكود ومعايير البنية.',
    'exp.lablab.t': 'قائد إرشاد تطوّعي — LabLab MENA',
    'exp.lablab.d': 'مايو 2023 — يوليو 2023',
    'exp.lablab.x': 'أرشدتُ فرق الهاكاثون في التنفيذ التقني والبنية والنشر؛ وقدّمتُ ورش عمل ودعمًا للمطوّرين لرفع جودة المشاريع.',
    'exp.marn.t': 'مطوّر مواقع — Marn',
    'exp.marn.d': 'سبتمبر 2021 — ديسمبر 2021',
    'exp.marn.x': 'بنيتُ حلول Webflow CMS وتعاونتُ مع المصمّمين لتقديم تجارب ويب متجاوبة.',
    'resume.education': 'التعليم والشهادات',
    'edu.degree.t': 'بكالوريوس هندسة البرمجيات — University of the People',
    'edu.degree.d': 'تخرّج يونيو 2025',
    'edu.degree.x': 'بكالوريوس العلوم في هندسة البرمجيات.',
    'edu.ielts.t': 'آيلتس أكاديمي — الدرجة 7',
    'edu.ielts.x': 'إتقان الإنجليزية على المستوى المهني.<br>العربية — لغة أم.',
    'edu.prompt.t': 'هندسة الأوامر — DeepLearning.AI',
    'edu.prompt.x': 'تطبيق هندسة الأوامر في سير عمل التطوير بمساعدة الذكاء الاصطناعي.',
    'cert': 'شهادة',

    'contact.title': 'تواصل',
    'contact.intro': 'منفتح على الفرص والتعاون — تواصل معي عبر أيٍّ من هذه الوسائل.'
  }
};

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

  if (dict['meta.title']) document.title = dict['meta.title'];
  if (langLabel) langLabel.textContent = lang === 'ar' ? 'EN' : 'AR';

  try { localStorage.setItem('lang', lang); } catch (e) { /* ignore */ }
}

if (langToggle) {
  langToggle.addEventListener('click', () => {
    applyLang(document.documentElement.lang === 'ar' ? 'en' : 'ar');
  });
}

let savedLang = 'en';
try { savedLang = localStorage.getItem('lang') || 'en'; } catch (e) { /* ignore */ }
applyLang(savedLang);


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

for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener('click', function () {
    const target = this.dataset.target;
    for (let j = 0; j < pages.length; j++) {
      pages[j].classList.toggle('active', pages[j].dataset.page === target);
    }
    for (let k = 0; k < navigationLinks.length; k++) {
      navigationLinks[k].classList.toggle('active', navigationLinks[k] === this);
    }
    window.scrollTo(0, 0);

    /* Register a virtual pageview so Umami can measure real visit duration
     * and per-section views. This is a single-page app: switching tabs never
     * reloads or changes the URL, so without this Umami sees only one pageview
     * per visit and can't compute time-on-site (it floors to ~1s). Null-guarded
     * because the async script may be blocked or not yet loaded. */
    if (window.umami && typeof window.umami.track === 'function') {
      window.umami.track((props) => ({
        ...props,
        url: '/' + target,
        title: document.title,
      }));
    }
  });
}


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
