'use strict';

/**
 * WWM_I18N — EN/AR dictionary for the "working with me" page. SINGLE SOURCE
 * OF TRUTH for this page's translations, shared by two consumers (same pattern
 * as assets/js/i18n-data.js):
 *   - the browser → loaded as a plain <script> before the page's inline script
 *                   (exposes window.WWM_I18N); applyLang() swaps text at runtime.
 *   - the build   → require()d by scripts/build-i18n.js, which bakes the ar
 *                   values into a static working-with-me/index-ar.html so Google
 *                   indexes real Arabic HTML (run: npm run build).
 *
 * Add a string: add the key to BOTH `en` and `ar` here (and the matching
 * data-i18n* attribute in working-with-me/index.html). Do not re-declare it.
 */
(function (root, factory) {
  const data = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
  else root.WWM_I18N = data;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const WWM_I18N = {
    en: {
      'meta.title': 'Anas Alhalabi — A Personal Guide to Working With Me',
      'meta.description': 'A short, honest guide to how Anas Alhalabi works best — rhythm, communication, feedback, decision-making and collaboration. Shared early so working together is faster.',
      eyebrow: 'A personal guide',
      h1a: 'A personal guide to',
      h1grad: 'working with me.',
      byline: 'By <b>Anas Al-Halabi</b>',
      lede: "A short, honest guide to how I work best — my rhythm, how I communicate, and what brings out my best work. I share it early because good collaboration is faster when we skip the guesswork. None of this is fixed in stone: I'm always learning and adjusting, so treat it as a starting point, not a rulebook.",

      c1_title: 'Work Style & Daily Rhythm',
      c1_1l: 'Peak hours', c1_1d: "I do my sharpest work after lunch, especially when working remotely. That's when I like to take on the large, focused tasks.",
      c1_2l: 'Deep focus', c1_2d: "I do my best work in deep focus, and I'm deliberate about protecting blocks of uninterrupted time for complex problems. Give me the space to go deep and I'll give you my best thinking.",
      c1_3l: 'Meetings', c1_3d: 'I keep early mornings light and favour late morning to early afternoon for syncs, planning, and alignment — my natural window for real-time work with the team.',

      c2_title: 'Communication Preferences',
      c2_1l: 'Team chat', c2_1d: 'My go-to for day-to-day collaboration (Slack or similar).',
      c2_2l: 'Direct message', c2_2d: 'For time-sensitive or personal matters.',
      c2_3l: 'Email', c2_3d: 'Best for formal or documented asks, like permissions and access requests.',
      c2_4l: 'Response time', c2_4d: "I reply as soon as I can. If I'm heads-down and slow to respond, I'll always circle back.",
      c2_5l: 'Spontaneous calls', c2_5d: "Not my favourite. A quick heads-up first goes a long way — unless it's genuinely urgent, in which case, call.",
      c2_6l: 'Message style', c2_6d: "I lean toward clear, detailed communication, but I'll keep it brief when brevity serves the moment.",

      c3_title: 'Feedback Style',
      c3_1l: 'Giving feedback', c3_1d: "I adapt to the person, but I'm always respectful. Sometimes direct, sometimes more contextual — whatever helps the message land.",
      c3_2l: 'Receiving feedback', c3_2d: "Give it to me direct and blunt. As long as it's respectful and constructive, that's exactly how I want it.",
      c3_3l: 'Frequency', c3_3d: 'I value ongoing, casual check-ins over saved-up feedback — especially around major milestones or wins.',

      c4_title: 'Decision-Making & Problem Solving',
      c4_1l: 'Pace', c4_1d: 'I like to sit with important decisions and give them proper thought before acting.',
      c4_2l: 'Style', c4_2d: "I aim for consensus, but I'll make the final call when one is needed.",
      c4_3l: 'Approach', c4_3d: "I'm data- and metrics-oriented. I like having numbers behind a choice, not just a gut feeling.",

      c5_title: 'Collaboration & Team Expectations',
      c5_1l: 'What I value in others', c5_1d: "Support, initiative, and a real willingness to engage with the problem. Let's move together.",
      c5_2l: 'Collab mode', c5_2d: 'I love real-time collaboration — video calls, screen-sharing, working through a problem side by side.',
      c5_3l: 'Meetings', c5_3d: 'A clear agenda, please. I value time and staying on point.',
      c5_4l: 'What slows us down', c5_4d: '"I\'m busy" with no timeframe for follow-up. A simple "I\'ll get to this by Thursday" keeps everyone unblocked.',

      c6_title: 'What Drives Me',
      c6_1l: 'Motivation', c6_1d: 'Learning, making a real impact, and being recognised for good work. Those are my fuel.',
      c6_2l: 'Curiosity', c6_2d: "I get genuinely absorbed when I'm learning something new. It's one of my biggest strengths — and if it ever pulls me too deep, a gentle nudge back to priorities is welcome.",
      c6_3l: 'At my best', c6_3d: "I thrive with clear priorities. When the workload gets heavy, the most helpful thing is aligning on what matters most first — that's when I do my best work.",
      c6_4l: 'How to disagree with me', c6_4d: 'Start by hearing my view, then show me specifically how your idea works better. Make the case and I\'ll listen.',

      note_title: 'One last thing',
      note_text: "This guide exists to make working together smoother and more productive. I'm always learning and evolving, so if something here should change — tell me. That conversation is exactly the kind I want to have.",

      cta_home: 'Back to my portfolio',
      cta_contact: 'Get in touch',
      foot_note: 'A living document — last reviewed with care, and open to change.'
    },
    ar: {
      'meta.title': 'أنس الحلبي — دليل شخصي للعمل معي',
      'meta.description': 'دليل قصير وصادق عن الطريقة التي يعمل بها أنس الحلبي في أفضل حالاته — الإيقاع والتواصل والملاحظات واتخاذ القرار والتعاون. يُشارَك مبكرًا ليكون العمل معًا أسرع.',
      eyebrow: 'دليل شخصي',
      h1a: 'دليل شخصي',
      h1grad: 'للعمل معي.',
      byline: 'بقلم <b>أنس الحلبي</b>',
      lede: 'دليل قصير وصادق عن الطريقة التي أعمل بها في أفضل حالاتي — إيقاعي، وكيف أتواصل، وما الذي يُخرج أفضل ما لديّ. أشاركه مبكرًا لأن التعاون الجيد يكون أسرع حين نستغني عن التخمين. لا شيء هنا محفور في الحجر: أنا دائم التعلّم والتطوّر، فاعتبره نقطة انطلاق لا قائمة قواعد.',

      c1_title: 'أسلوب العمل والإيقاع اليومي',
      c1_1l: 'ساعات الذروة', c1_1d: 'أقدّم أفضل ما لديّ بعد الغداء، خصوصًا في العمل عن بُعد. هذا وقتي المفضّل للمهام الكبيرة التي تحتاج تركيزًا.',
      c1_2l: 'التركيز العميق', c1_2d: 'أنجز أفضل أعمالي في تركيز عميق، وأحرص عمدًا على حماية فترات متواصلة دون مقاطعة للمشكلات المعقّدة. امنحني المساحة للتعمّق وسأمنحك أفضل تفكيري.',
      c1_3l: 'الاجتماعات', c1_3d: 'أُبقي الصباح الباكر خفيفًا، وأفضّل من أواخر الصباح إلى بدايات بعد الظهر للاجتماعات والتخطيط والتنسيق — نافذتي الطبيعية للعمل المباشر مع الفريق.',

      c2_title: 'تفضيلات التواصل',
      c2_1l: 'محادثة الفريق', c2_1d: 'وسيلتي المفضّلة للتعاون اليومي (سلاك أو ما شابهه).',
      c2_2l: 'الرسائل المباشرة', c2_2d: 'للأمور العاجلة أو الشخصية.',
      c2_3l: 'البريد الإلكتروني', c2_3d: 'الأنسب للطلبات الرسمية أو الموثّقة، مثل الأذونات وطلبات الوصول.',
      c2_4l: 'وقت الرد', c2_4d: 'أردّ بأسرع ما أستطيع. وإن كنت منغمسًا في العمل وتأخّر ردّي، فسأعود إليك دائمًا.',
      c2_5l: 'المكالمات المفاجئة', c2_5d: 'ليست المفضّلة لديّ. تنبيه بسيط مسبق يصنع فرقًا كبيرًا — إلا إن كان الأمر عاجلًا فعلًا، فحينها اتصل.',
      c2_6l: 'أسلوب الرسائل', c2_6d: 'أميل إلى تواصل واضح ومفصّل، لكنني أختصر حين يكون الاختصار هو الأنسب.',

      c3_title: 'أسلوب الملاحظات',
      c3_1l: 'حين أقدّم الملاحظات', c3_1d: 'أتكيّف مع الشخص، لكنني محترم دائمًا. أحيانًا بصراحة مباشرة، وأحيانًا بمزيد من السياق — بما يساعد الرسالة على الوصول.',
      c3_2l: 'حين أتلقّى الملاحظات', c3_2d: 'قدّمها لي مباشرة وصريحة. ما دامت محترمة وبنّاءة، فهذه تمامًا الطريقة التي أريدها.',
      c3_3l: 'التكرار', c3_3d: 'أقدّر المتابعات المستمرة وغير الرسمية أكثر من الملاحظات المؤجَّلة — خصوصًا عند المحطات المهمة أو الإنجازات.',

      c4_title: 'اتخاذ القرار وحل المشكلات',
      c4_1l: 'الإيقاع', c4_1d: 'أحبّ أن أمنح القرارات المهمة وقتها من التفكير قبل التصرّف.',
      c4_2l: 'الأسلوب', c4_2d: 'أسعى إلى التوافق، لكنني أتّخذ القرار النهائي حين يكون لازمًا.',
      c4_3l: 'المنهج', c4_3d: 'أعتمد على البيانات والمقاييس. أحبّ أن تكون خلف الاختيار أرقام، لا مجرد حدس.',

      c5_title: 'التعاون وتوقّعات الفريق',
      c5_1l: 'ما أقدّره في الآخرين', c5_1d: 'الدعم، والمبادرة، ورغبة حقيقية في الانخراط بالمشكلة. لنمضِ معًا.',
      c5_2l: 'طريقة التعاون', c5_2d: 'أحبّ التعاون المباشر — مكالمات الفيديو ومشاركة الشاشة والعمل على المشكلة جنبًا إلى جنب.',
      c5_3l: 'الاجتماعات', c5_3d: 'أجندة واضحة من فضلك. أقدّر الوقت والبقاء في صلب الموضوع.',
      c5_4l: 'ما الذي يبطئنا', c5_4d: '«أنا مشغول» دون موعد للمتابعة. جملة بسيطة مثل «سأنجز هذا بحلول الخميس» تُبقي الجميع غير معطَّلين.',

      c6_title: 'ما الذي يحرّكني',
      c6_1l: 'الدافع', c6_1d: 'التعلّم، وترك أثر حقيقي، والتقدير على العمل الجيد. هذا وقودي.',
      c6_2l: 'الفضول', c6_2d: 'أنغمس فعلًا حين أتعلّم شيئًا جديدًا. إنها من أكبر نقاط قوّتي — وإن جرّني ذلك إلى العمق أكثر من اللازم، فتذكيرٌ لطيف بالأولويات مُرحَّب به.',
      c6_3l: 'في أفضل حالاتي', c6_3d: 'أزدهر مع أولويات واضحة. حين يثقل حجم العمل، أكثر ما يفيد هو الاتفاق أولًا على الأهمّ — فحينها أقدّم أفضل ما لديّ.',
      c6_4l: 'كيف تختلف معي', c6_4d: 'ابدأ بالإنصات إلى وجهة نظري، ثم أرِني تحديدًا كيف تكون فكرتك أفضل. اعرض حجّتك وسأصغي.',

      note_title: 'كلمة أخيرة',
      note_text: 'هذا الدليل موجود ليجعل العمل معًا أكثر سلاسة وإنتاجية. أنا دائم التعلّم والتطوّر، فإن رأيت أن شيئًا هنا يستحق التغيير — أخبرني. فهذا بالضبط نوع الحوار الذي أرغب فيه.',

      cta_home: 'العودة إلى موقعي',
      cta_contact: 'تواصل معي',
      foot_note: 'وثيقة حيّة — رُوجعت بعناية، وتظل مفتوحة للتغيير.'
    }
  };
  return WWM_I18N;
});
