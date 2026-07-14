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
    'about.p2': "I've shipped two apps to the App Store in Swift &amp; SwiftUI — one reaching 5,000+ users — plus fullstack products like <strong>Jamaatna</strong>, an events platform with elegant digital invitations, one-tap RSVP and a live attendance dashboard. I also build Next.js/TypeScript reporting dashboards and ASP.NET Core microservices, so I've seen products from the UI down to the database.",
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
    'cat.4service': 'Web · Car-service center',
    'desc.4service': 'A bilingual (Arabic & English, RTL) marketing site for a car-service center in Saudi Arabia — maintenance, inspection and detailing services, a services gallery, customer reviews and one-tap WhatsApp contact. Vanilla HTML/CSS/JS, hosted on GitHub Pages.',
    'cat.website': 'Web · Personal site',
    'desc.website': 'My personal site and blog — writing on iOS development, macOS productivity and AI-assisted dev workflows.',
    'link.live': 'Live',
    'note.private': 'Private — company project',

    /* project detail pages */
    'pd.back': 'Back to projects',
    'pd.overview': 'Overview',
    'pd.role': 'My role',
    'pd.features': 'What I built',
    'pd.highlights': 'Highlights',
    'pd.status': 'Status',
    'pd.screens': 'Screens',

    'pd.mykarage.tagline': 'iOS · Swift & SwiftUI · 5,000+ users · 2022–2026',
    'pd.mykarage.overview': "A customer-facing iOS app for anyone who owns a car and wants to keep it maintained. It stores each car's maintenance history and invoices, maps a full network of relevant garages, surfaces offers, and handles booking and payments end to end. It grew to 5,000+ users.",
    'pd.mykarage.role': 'I owned the entire app end to end — architecture, UI/UX and every feature in Swift & SwiftUI — talking to a backend built in ASP.NET by the backend team.',
    'pd.mykarage.f1': 'Maintenance history & saved invoices — every service and receipt kept per car.',
    'pd.mykarage.f2': 'Garage network — browse and search a full network of relevant garages.',
    'pd.mykarage.f3': 'Offers feed — promotions and discounts surfaced to users.',
    'pd.mykarage.f4': 'Payment flow via Moyasar, with OAuth2 auth and login.',
    'pd.mykarage.f5': 'Push notifications, deep linking and a referral flow.',
    'pd.mykarage.f6': 'Image upload/download and in-app PDF generation.',
    'pd.mykarage.f7': 'Profile, settings and full Arabic/English localization.',
    'pd.mykarage.f8': 'Analytics and session tracking with AppsFlyer and Smartlook.',
    'pd.mykarage.f9': 'Prototyped an internal AI assistant with car context (not shipped).',
    'pd.mykarage.highlight': 'I designed and shipped the whole app in 2021–2022, before AI coding tools existed. Adding deep linking and push notifications was a major piece of work that meant refactoring and reworking the app end to end.',
    'pd.mykarage.status': 'First shipped in 2022; maintained and updated through 2026.',
    'pd.mykarage.s.home': 'Home & service categories',
    'pd.mykarage.s.garage': 'Garage profile',
    'pd.mykarage.s.reviews': 'Ratings & reviews',
    'pd.mykarage.s.car': 'Car details & history',
    'pd.mykarage.s.offers': 'Offers feed',
    'pd.mykarage.s.account': 'Account & settings',
    'pd.mykarage.s.about': 'About & policies',

    /* Karage Kash */
    'pd.karagekash.tagline': 'iPadOS · Swift & SwiftUI · Point of sale · 2025',
    'pd.karagekash.overview': 'An iPadOS point-of-sale app for car-service stores. The cashier rings up services, builds the cart and issues the invoice — all from a single, always-visible screen built for speed and reliability at the counter.',
    'pd.karagekash.role': 'A v1 already existed; I came in and built v2 — restructuring it for cleaner code, a new design, faster launch and load times, and a better UI/UX with new features. Another developer later joined on smaller features; I led the team and managed the GitHub repo.',
    'pd.karagekash.f1': 'Rebuilt the app end to end for v2 — architecture, design and performance.',
    'pd.karagekash.f2': 'Cart and checkout for day-to-day car-service sales.',
    'pd.karagekash.f3': 'Invoice creation and receipts from a single screen.',
    'pd.karagekash.f4': 'Receipt printing via Epson printers (integrated with a teammate).',
    'pd.karagekash.f5': 'Faster launch and load times, and a refreshed UI/UX over v1.',
    'pd.karagekash.highlight': 'The hardest part was keeping the whole flow on one screen. Building an invoice and cart is a long, multi-step process, so I designed it to stay on a single page the entire time — the cashier never loses context mid-sale.',
    'pd.karagekash.status': 'Built in about three months and shipped in 2025; in production use.',

    /* Jamaatna */
    'pd.jamaatna.tagline': 'Fullstack · Next.js · Supabase · Events platform · 2026',
    'pd.jamaatna.overview': 'Jamaatna (جمعتنا) is an all-in-one platform to run weddings and events from the invite to the door — elegant digital invitations, one-tap RSVP, QR entry codes and a live attendance dashboard. Fully bilingual Arabic & English (RTL).',
    'pd.jamaatna.role': 'This is my own startup. I do everything — product design, frontend, backend, localization, business and marketing.',
    'pd.jamaatna.f1': 'Elegant digital invitations with one-tap RSVP.',
    'pd.jamaatna.f2': 'QR entry codes and a scanner check-in flow.',
    'pd.jamaatna.f3': 'Live attendance dashboard that updates in real time.',
    'pd.jamaatna.f4': 'Guest-list and seating management.',
    'pd.jamaatna.f5': 'Multiple event types with a host dashboard.',
    'pd.jamaatna.f6': 'Payments, analytics and automated reminders.',
    'pd.jamaatna.f7': 'Full Arabic/English (RTL) localization.',
    'pd.jamaatna.highlight': "The check-in is the flashy part: scan a guest's QR at the door and the live attendance dashboard updates in real time — no refresh, everyone watching sees the count move.",
    'pd.jamaatna.status': 'Live — launched in 2026.',
    'pd.jamaatna.s.dashboard': 'Host dashboard',
    'pd.jamaatna.s.invitation': 'Digital invitation',
    'pd.jamaatna.s.create': 'Create an event',
    'pd.jamaatna.s.guests': 'Guest list',
    'pd.jamaatna.s.checkin': 'QR check-in',

    /* MyVenue */
    'pd.myvenue.tagline': 'Fullstack · Replit · Mapbox · Venue booking · 2026 (MVP)',
    'pd.myvenue.overview': 'An Airbnb-style marketplace for booking event venues in Riyadh — map search, categories (halls, chalets, farms, majlis), ratings, favorites and bookings. Arabic-first with English.',
    'pd.myvenue.role': "A freelance build for Howamesh — I built both the frontend and backend on Replit. It's an MVP.",
    'pd.myvenue.f1': 'Map-based search with venue categories (halls, chalets, farms, majlis).',
    'pd.myvenue.f2': 'Venue detail pages with photos, ratings and reviews.',
    'pd.myvenue.f3': 'Booking flow, favorites and a host listing flow.',
    'pd.myvenue.f4': 'Admin and payments.',
    'pd.myvenue.f5': 'Arabic-first UI with English.',
    'pd.myvenue.highlight': 'Map search over Mapbox with an Arabic-first, RTL layout — browsing venues on the map the way locals actually search.',
    'pd.myvenue.status': 'Built in 2026 as an MVP.',

    /* Invoicing & Reporting Dashboard */
    'pd.dashboard.tagline': 'Web · Next.js · ZATCA Phase 2 · 2025',
    'pd.dashboard.overview': 'A Next.js & TypeScript dashboard for a car-services business, used by owners and garages. I supported the wider dashboard and built the invoicing system inside it — ZATCA Phase 2 tax invoices (simplified & A4), quotations and reporting.',
    'pd.dashboard.role': "I owned the invoicing system's UI and UX inside the dashboard. The rest of the dashboard — reporting, analytics, customer management, inventory and staff — I supported.",
    'pd.dashboard.f1': 'Invoicing UI/UX for simplified and A4 tax invoices.',
    'pd.dashboard.f2': 'ZATCA Phase 2 compliant tax invoices.',
    'pd.dashboard.f3': 'Quotations flowing into invoices.',
    'pd.dashboard.f4': 'Supported the wider dashboard: reporting, analytics, customers, inventory and staff.',
    'pd.dashboard.highlight': 'The invoicing had to be ZATCA Phase 2 compliant — the Saudi e-invoicing standard — rendering correct simplified and A4 tax invoices that owners and garages rely on daily.',
    'pd.dashboard.status': 'Built in 2025; in use through 2026. Private company project.',

    /* 4service.co */
    'pd.4service.tagline': 'Web · Vanilla HTML/CSS/JS · Car-service center · 2025',
    'pd.4service.overview': 'A bilingual (Arabic & English, RTL) marketing site for a car-service center in Saudi Arabia — maintenance, inspection and detailing services, a services gallery, customer reviews and one-tap WhatsApp contact.',
    'pd.4service.role': 'A freelance client project — I designed and built the whole thing from scratch.',
    'pd.4service.f1': 'Bilingual Arabic/English with full RTL.',
    'pd.4service.f2': 'Services sections, a gallery and customer reviews.',
    'pd.4service.f3': 'One-tap WhatsApp contact.',
    'pd.4service.f4': 'SEO work and custom-domain setup.',
    'pd.4service.f5': 'Built from scratch in vanilla HTML/CSS/JS on GitHub Pages.',
    'pd.4service.highlight': 'Built from scratch with no framework — just vanilla HTML, CSS and JS — fully bilingual with RTL and one-tap WhatsApp deep-linking, plus SEO and a custom domain.',
    'pd.4service.status': 'Shipped in 2025.',
    'pd.4service.s.mobile': 'Mobile · Arabic (RTL)',

    /* noiceanas.com */
    'pd.website.tagline': 'Web · Personal site & blog',
    'pd.website.overview': 'My personal site and blog — where I write about iOS development, macOS productivity and AI-assisted dev workflows, and where I experiment with new technologies. One post so far, with more to come.',

    'resume.title': 'Resume',
    'resume.download': 'Download CV (PDF)',
    'resume.experience': 'Experience',
    'exp.freelance.t': 'Freelance Software Engineer',
    'exp.freelance.badge': 'Open to opportunities',
    'exp.freelance.d': 'Jun 2026 — Present',
    'exp.freelance.x': 'Building personal projects and taking on freelance work across iOS, web and backend — and open to new opportunities. Recent independent work includes Jamaatna, a fullstack events platform.',
    'exp.karage.t': 'Software Engineer — Karage',
    'exp.karage.d': 'Dec 2021 — Jun 2026',
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
    'about.p2': 'أطلقتُ تطبيقَين على App Store بـ Swift و SwiftUI — أحدهما تجاوز 5,000 مستخدم — إلى جانب منتجات متكاملة مثل <strong>Jamaatna</strong>، منصة مناسبات فيها دعوات رقمية أنيقة وتأكيد حضور بنقرة ولوحة حضور مباشرة. كما أبني لوحات تقارير بـ Next.js و TypeScript وخدمات مصغّرة بـ ASP.NET Core — فرأيت المنتجات من الواجهة حتى قاعدة البيانات.',
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
    'cat.4service': 'ويب · مركز خدمات سيارات',
    'desc.4service': 'موقع تعريفي ثنائي اللغة (عربي وإنجليزي، بدعم الكتابة من اليمين لليسار) لمركز خدمات سيارات في السعودية — خدمات الصيانة والفحص والعناية بالسيارة، ومعرض للخدمات، وتقييمات العملاء، وتواصل مباشر عبر واتساب. مبني بـ HTML/CSS/JS بدون أي أدوات بناء، ومستضاف على GitHub Pages.',
    'cat.website': 'ويب · موقع شخصي',
    'desc.website': 'موقعي الشخصي ومدوّنتي — أكتب عن تطوير iOS وإنتاجية macOS وسير عمل التطوير بمساعدة الذكاء الاصطناعي.',
    'link.live': 'زيارة',
    'note.private': 'خاص — مشروع شركة',

    /* project detail pages */
    'pd.back': 'العودة إلى المشاريع',
    'pd.overview': 'نبذة',
    'pd.role': 'دوري',
    'pd.features': 'ما الذي بنيته',
    'pd.highlights': 'أبرز النقاط',
    'pd.status': 'الحالة',
    'pd.screens': 'لقطات من التطبيق',

    'pd.mykarage.tagline': 'iOS · Swift و SwiftUI · أكثر من 5,000 مستخدم · 2022–2026',
    'pd.mykarage.overview': 'تطبيق iOS موجّه للعملاء لكل من يملك سيارة ويريد صيانتها. يحفظ سجلّ صيانة كل سيارة وفواتيرها، ويعرض شبكة كاملة من الورش المناسبة، ويُبرز العروض، ويتولّى الحجز والدفع من البداية للنهاية. نما إلى أكثر من 5,000 مستخدم.',
    'pd.mykarage.role': 'امتلكتُ التطبيق بالكامل من البداية للنهاية — البنية وتجربة المستخدم وكل ميزة بـ Swift و SwiftUI — بالتواصل مع خلفية مبنية بـ ASP.NET من فريق الـ backend.',
    'pd.mykarage.f1': 'سجلّ الصيانة والفواتير المحفوظة — كل خدمة وإيصال محفوظ لكل سيارة.',
    'pd.mykarage.f2': 'شبكة الورش — تصفّح وبحث في شبكة كاملة من الورش المناسبة.',
    'pd.mykarage.f3': 'قائمة العروض — عروض وخصومات تُعرض للمستخدمين.',
    'pd.mykarage.f4': 'مسار دفع عبر Moyasar، مع مصادقة وتسجيل دخول بـ OAuth2.',
    'pd.mykarage.f5': 'إشعارات فورية، وروابط عميقة (deep linking)، ونظام إحالات.',
    'pd.mykarage.f6': 'رفع وتنزيل الصور وإنشاء ملفات PDF داخل التطبيق.',
    'pd.mykarage.f7': 'الملف الشخصي والإعدادات ودعم كامل للعربية والإنجليزية.',
    'pd.mykarage.f8': 'تحليلات وتتبّع الجلسات عبر AppsFlyer و Smartlook.',
    'pd.mykarage.f9': 'بنيتُ نموذجًا أوليًا لمساعد ذكاء اصطناعي داخلي يعرف بيانات سيارتك (لم يُطلَق).',
    'pd.mykarage.highlight': 'صمّمتُ التطبيق وأطلقتُه بالكامل في 2021–2022، قبل وجود أدوات البرمجة بالذكاء الاصطناعي. وكانت إضافة الروابط العميقة والإشعارات الفورية عملًا كبيرًا استلزم إعادة هيكلة التطبيق بأكمله.',
    'pd.mykarage.status': 'أُطلق أول مرة في 2022؛ ويُصان ويُحدَّث حتى 2026.',
    'pd.mykarage.s.home': 'الرئيسية وتصنيفات الخدمات',
    'pd.mykarage.s.garage': 'صفحة الورشة',
    'pd.mykarage.s.reviews': 'التقييمات والمراجعات',
    'pd.mykarage.s.car': 'تفاصيل السيارة وسجلّها',
    'pd.mykarage.s.offers': 'العروض',
    'pd.mykarage.s.account': 'الحساب والإعدادات',
    'pd.mykarage.s.about': 'حول التطبيق',

    /* Karage Kash */
    'pd.karagekash.tagline': 'iPadOS · Swift و SwiftUI · نقاط بيع · 2025',
    'pd.karagekash.overview': 'تطبيق نقاط بيع لـ iPadOS لمتاجر خدمات السيارات. يُنشئ الكاشير الطلب ويبني السلة ويُصدر الفاتورة — كل ذلك من شاشة واحدة ظاهرة دائمًا، مصمّمة للسرعة والموثوقية عند الكاونتر.',
    'pd.karagekash.role': 'كان هناك إصدار أول للتطبيق؛ دخلتُ وبنيتُ الإصدار الثاني — بإعادة هيكلته لكود أنظف، وتصميم جديد، وأوقات إطلاق وتحميل أسرع، وتجربة استخدام أفضل مع ميزات جديدة. لاحقًا انضمّ مطوّر آخر للعمل على ميزات أصغر؛ وقدتُ الفريق وأدرتُ مستودع GitHub.',
    'pd.karagekash.f1': 'أعدتُ بناء التطبيق بالكامل للإصدار الثاني — البنية والتصميم والأداء.',
    'pd.karagekash.f2': 'السلة والدفع لمبيعات خدمات السيارات اليومية.',
    'pd.karagekash.f3': 'إنشاء الفواتير والإيصالات من شاشة واحدة.',
    'pd.karagekash.f4': 'طباعة الإيصالات عبر طابعات Epson (بالتكامل مع زميل في الفريق).',
    'pd.karagekash.f5': 'أوقات إطلاق وتحميل أسرع، وتجربة استخدام محدَّثة مقارنةً بالإصدار الأول.',
    'pd.karagekash.highlight': 'كان الأصعب هو إبقاء المسار كله في شاشة واحدة. إنشاء الفاتورة والسلة عملية طويلة متعددة الخطوات، فصمّمتُها لتبقى في صفحة واحدة طوال الوقت — فلا يفقد الكاشير سياق العملية في منتصفها.',
    'pd.karagekash.status': 'بُني في نحو ثلاثة أشهر وأُطلق في 2025؛ وهو قيد الاستخدام في الإنتاج.',

    /* Jamaatna */
    'pd.jamaatna.tagline': 'متكامل · Next.js · Supabase · منصة مناسبات · 2026',
    'pd.jamaatna.overview': 'جمعتنا منصة متكاملة لإدارة الأعراس والمناسبات من الدعوة حتى الاستقبال — دعوات رقمية أنيقة، وتأكيد حضور بنقرة واحدة، ورموز QR للدخول، ولوحة حضور مباشرة. ثنائية اللغة بالكامل عربي وإنجليزي (RTL).',
    'pd.jamaatna.role': 'هذه شركتي الناشئة. أقوم بكل شيء — تصميم المنتج، والواجهة الأمامية، والخلفية، والتوطين، والأعمال، والتسويق.',
    'pd.jamaatna.f1': 'دعوات رقمية أنيقة مع تأكيد حضور بنقرة واحدة.',
    'pd.jamaatna.f2': 'رموز QR للدخول ومسار تسجيل دخول عبر ماسح ضوئي.',
    'pd.jamaatna.f3': 'لوحة حضور مباشرة تتحدّث في الوقت الحقيقي.',
    'pd.jamaatna.f4': 'إدارة قائمة المدعوّين وتوزيع الجلوس.',
    'pd.jamaatna.f5': 'أنواع مناسبات متعددة مع لوحة للمضيف.',
    'pd.jamaatna.f6': 'مدفوعات وتحليلات وتذكيرات آلية.',
    'pd.jamaatna.f7': 'توطين كامل بالعربية والإنجليزية (RTL).',
    'pd.jamaatna.highlight': 'تسجيل الدخول هو الجزء اللافت: امسح رمز QR للضيف عند الباب فتتحدّث لوحة الحضور المباشرة في الوقت الحقيقي — دون إعادة تحميل، ويرى الجميع العدّاد يتحرّك.',
    'pd.jamaatna.status': 'مباشرة — أُطلقت في 2026.',
    'pd.jamaatna.s.dashboard': 'لوحة المضيف',
    'pd.jamaatna.s.invitation': 'الدعوة الرقمية',
    'pd.jamaatna.s.create': 'إنشاء مناسبة',
    'pd.jamaatna.s.guests': 'قائمة المدعوّين',
    'pd.jamaatna.s.checkin': 'تسجيل الدخول عبر QR',

    /* MyVenue */
    'pd.myvenue.tagline': 'متكامل · Replit · Mapbox · حجز قاعات · 2026 (نسخة أولية)',
    'pd.myvenue.overview': 'سوق على نمط Airbnb لحجز قاعات المناسبات في الرياض — بحث عبر الخريطة، وتصنيفات (قاعات، شاليهات، مزارع، مجالس)، وتقييمات ومفضّلة وحجوزات. عربي أولًا مع الإنجليزية.',
    'pd.myvenue.role': 'عمل حرّ لشركة هوامش — بنيتُ الواجهة الأمامية والخلفية على Replit. وهو نسخة أولية (MVP).',
    'pd.myvenue.f1': 'بحث عبر الخريطة مع تصنيفات القاعات (قاعات، شاليهات، مزارع، مجالس).',
    'pd.myvenue.f2': 'صفحات تفاصيل للقاعات مع الصور والتقييمات والمراجعات.',
    'pd.myvenue.f3': 'مسار حجز، ومفضّلة، ومسار إدراج للمضيف.',
    'pd.myvenue.f4': 'لوحة إدارة ومدفوعات.',
    'pd.myvenue.f5': 'واجهة عربية أولًا مع الإنجليزية.',
    'pd.myvenue.highlight': 'بحث عبر خرائط Mapbox بتصميم عربي أولًا من اليمين لليسار — تصفّح القاعات على الخريطة بالطريقة التي يبحث بها السكان فعلًا.',
    'pd.myvenue.status': 'بُني في 2026 كنسخة أولية.',

    /* لوحة الفوترة والتقارير */
    'pd.dashboard.tagline': 'ويب · Next.js · هيئة الزكاة والضريبة (المرحلة الثانية) · 2025',
    'pd.dashboard.overview': 'لوحة بـ Next.js و TypeScript لأعمال خدمات السيارات، يستخدمها الملّاك والورش. ساهمتُ في اللوحة الأوسع وبنيتُ نظام الفوترة داخلها — فواتير ضريبية للمرحلة الثانية من هيئة الزكاة والضريبة (مبسّطة و A4)، وعروض أسعار وتقارير.',
    'pd.dashboard.role': 'امتلكتُ واجهة وتجربة استخدام نظام الفوترة داخل اللوحة. أما بقية اللوحة — التقارير والتحليلات وإدارة العملاء والمخزون والموظفين — فقد ساهمتُ فيها.',
    'pd.dashboard.f1': 'واجهة وتجربة الفوترة لفواتير ضريبية مبسّطة و A4.',
    'pd.dashboard.f2': 'فواتير ضريبية متوافقة مع المرحلة الثانية من هيئة الزكاة والضريبة.',
    'pd.dashboard.f3': 'عروض أسعار تتحوّل إلى فواتير.',
    'pd.dashboard.f4': 'دعم اللوحة الأوسع: التقارير والتحليلات والعملاء والمخزون والموظفين.',
    'pd.dashboard.highlight': 'كان على الفوترة أن تتوافق مع المرحلة الثانية من هيئة الزكاة والضريبة — معيار الفوترة الإلكترونية السعودي — بعرض فواتير ضريبية مبسّطة و A4 صحيحة يعتمد عليها الملّاك والورش يوميًا.',
    'pd.dashboard.status': 'بُني في 2025؛ وقيد الاستخدام حتى 2026. مشروع شركة خاص.',

    /* 4service.co */
    'pd.4service.tagline': 'ويب · HTML/CSS/JS بدون أدوات بناء · مركز خدمات سيارات · 2025',
    'pd.4service.overview': 'موقع تعريفي ثنائي اللغة (عربي وإنجليزي، RTL) لمركز خدمات سيارات في السعودية — خدمات الصيانة والفحص والعناية بالسيارة، ومعرض للخدمات، وتقييمات العملاء، وتواصل مباشر عبر واتساب بنقرة واحدة.',
    'pd.4service.role': 'مشروع لعميل بالعمل الحرّ — صمّمتُه وبنيتُه بالكامل من الصفر.',
    'pd.4service.f1': 'ثنائي اللغة عربي/إنجليزي بدعم كامل للكتابة من اليمين لليسار.',
    'pd.4service.f2': 'أقسام للخدمات، ومعرض، وتقييمات العملاء.',
    'pd.4service.f3': 'تواصل مباشر عبر واتساب بنقرة واحدة.',
    'pd.4service.f4': 'تحسين لمحركات البحث (SEO) وإعداد نطاق مخصّص.',
    'pd.4service.f5': 'مبني من الصفر بـ HTML/CSS/JS بدون أدوات بناء، ومستضاف على GitHub Pages.',
    'pd.4service.highlight': 'مبني من الصفر دون أي إطار عمل — فقط HTML و CSS و JS — ثنائي اللغة بالكامل مع دعم RTL وروابط واتساب مباشرة بنقرة واحدة، إضافةً إلى تحسين محركات البحث ونطاق مخصّص.',
    'pd.4service.status': 'أُطلق في 2025.',
    'pd.4service.s.mobile': 'الجوال · العربية (RTL)',

    /* noiceanas.com */
    'pd.website.tagline': 'ويب · موقع شخصي ومدوّنة',
    'pd.website.overview': 'موقعي الشخصي ومدوّنتي — أكتب فيه عن تطوير iOS وإنتاجية macOS وسير عمل التطوير بمساعدة الذكاء الاصطناعي، وأجرّب فيه التقنيات الجديدة. تدوينة واحدة حتى الآن، والمزيد قادم.',

    'resume.title': 'السيرة الذاتية',
    'resume.download': 'تحميل السيرة الذاتية (PDF)',
    'resume.experience': 'الخبرات',
    'exp.freelance.t': 'مهندس برمجيات مستقل',
    'exp.freelance.badge': 'متاح لفرص جديدة',
    'exp.freelance.d': 'يونيو 2026 — حتى الآن',
    'exp.freelance.x': 'أبني مشاريع شخصية وأتولّى أعمالًا مستقلة في iOS والويب والـ backend — ومنفتح على فرص جديدة. من أحدث أعمالي المستقلة Jamaatna، منصة مناسبات متكاملة.',
    'exp.karage.t': 'مهندس برمجيات — Karage',
    'exp.karage.d': 'ديسمبر 2021 — يونيو 2026',
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

let savedLang = 'en';
try { savedLang = localStorage.getItem('lang') || 'en'; } catch (e) { /* ignore */ }
const requestedLang = routeParams.get('lang') || (routeHash === 'ar' ? 'ar' : null);
applyLang(requestedLang === 'ar' || requestedLang === 'en' ? requestedLang : savedLang);


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
