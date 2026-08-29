/**
 * مولّد محتوى صفحات (خدمة × مدينة) — أصول الضيافة.
 * يبني props جاهزة لمكوّن LocalServicePage + FAQ لاستخدامها في schema.
 * المحتوى عربي مخصّص لكل مدينة، ويُقاس عمقه بوضوحه وتفرّده لا بعدد كلمات ثابت.
 */
import {
  TEAM_IMAGES,
  PRODUCT_IMAGES,
  SETUP_IMAGES,
  DATES_IMAGES,
} from "@/lib/images";
import { CITIES, localSlug } from "@/lib/localPages";
import type { LocalServicePageProps, LocalPageBlock, FAQ } from "@/components/LocalServicePage";
import { SITE_URL, whatsappUrl } from "@/lib/constants";
import { diyafaBlocks, sababinBlocks } from "@/lib/localContentBlocks";

const jeddahSababinBlocks: LocalPageBlock[] = [
  {
    type: "imageProse",
    h2: "فنجان أول انطباع في مناسبات جدة",
    body: "في جدة، تتنوّع المناسبات بين مجلس عائلي هادئ، وليلة زواج، ولقاء أعمال يستقبل ضيوفًا من داخل المدينة وخارجها. لذلك لا نتعامل مع خدمة القهوة كقالب جاهز. نبدأ بفهم طبيعة المجلس، وتوقيت استقبال الضيوف، ومساحة الحركة، ثم ننسّق حضور القهوجيين وصبابين القهوة بما ينسجم مع المناسبة. الفكرة بسيطة: أن يصل الفنجان في لحظته، وأن تبقى حركة التقديم هادئة، وأن يشعر المعزّب بأن تفاصيل الضيافة مرتبة من دون أن تشغله عن ضيوفه.",
    img: TEAM_IMAGES[6],
    imgAlt: "قهوجي يصب القهوة العربية في مناسبة بجدة",
  },
  {
    type: "bullets",
    h2: "ما الذي نحتاجه لتفصيل الخدمة؟",
    items: [
      "نوع المناسبة وطبيعة حضور الضيوف",
      "موقع المناسبة في جدة ومساحة مجلس الضيافة",
      "وقت الاستقبال والمدة المطلوبة للخدمة",
      "الخدمة المطلوبة: قهوجيين أو صبابين أو مباشرين",
      "وجود مجلس نسائي يحتاج إلى قهوجيات أو صبابات",
      "عناصر التقديم المراد تنسيقها ضمن الطلب",
    ],
  },
  {
    type: "prose",
    h2: "من أبحر إلى وسط جدة: المكان يغيّر ترتيب الضيافة",
    body: "المناسبة في قاعة كبيرة ليست كالعزيمة داخل منزل، والمجلس المطل على البحر في أبحر ليس كقاعة أعمال وسط جدة. اختلاف المكان يغيّر مسار الدخول، وموقع ركن القهوة، والمسافة التي يقطعها فريق التقديم، وعدد نقاط الخدمة المناسبة. لهذا نسأل عن الموقع والتوزيع قبل اقتراح الترتيب. لا نصنع صفحة لكل حي ولا نَعِد بتغطية غير موثّقة؛ نستخدم تفاصيل الموقع التي يرسلها العميل لبناء تصور عملي يخدم المناسبة نفسها.",
  },
  {
    type: "packages",
    h2: "مسارات خدمة تُفصّل بعد معرفة المناسبة",
    packages: [
      {
        name: "استقبال عائلي",
        desc: "لمجلس يحتاج إلى حضور مركز وتقديم هادئ.",
        features: ["تحديد نقطة التقديم", "تنسيق دور الصبابين", "مراعاة حركة الضيوف"],
      },
      {
        name: "ليلة زواج",
        desc: "لمناسبة تتعدد فيها لحظات الوصول ومساحات الاستقبال.",
        features: ["تخطيط استقبال الضيوف", "توزيع نقاط الضيافة", "تنسيق المسار مع برنامج المناسبة"],
      },
      {
        name: "لقاء مهني",
        desc: "لحدث يحتاج إلى ضيافة تحترم إيقاع البرنامج وصورة الجهة.",
        features: ["تقديم غير معطّل", "حضور مرتب", "تنسيق الخدمة مع جدول الحدث"],
      },
    ],
    note: "هذه مسارات لفهم الاحتياج وليست باقات سعرية ثابتة. يتحدد نطاق الخدمة بعد استلام تفاصيل المناسبة.",
  },
  {
    type: "imageProse",
    h2: "كيف نرتّب رحلة الضيافة؟",
    body: "نبدأ برسالة واضحة تجمع المدينة ونوع المناسبة وموعدها وطبيعة المكان. بعد ذلك نراجع احتياج المجلس ونقترح مسار الخدمة المتفق عليه: أين يبدأ الاستقبال، وأين يكون ركن القهوة، وكيف تتحرك الضيافة من دون ازدحام. قبل الاعتماد يعرف العميل ما العناصر التي يشملها طلبه وما التفاصيل التي ما زالت بحاجة إلى حسم. هذه الشفافية أهم من عبارة عامة مثل «خدمة متكاملة»؛ لأنها تحوّل الرغبة في ضيافة فاخرة إلى ترتيب مفهوم يمكن مراجعته.",
    img: SETUP_IMAGES[4],
    imgAlt: "ركن قهوة عربية مرتب لاستقبال الضيوف في جدة",
    flip: true,
  },
  {
    type: "gallery",
    h2: "تفاصيل من أعمال الضيافة",
    images: [
      { src: TEAM_IMAGES[7], alt: "تقديم القهوة العربية بزي مرتب" },
      { src: PRODUCT_IMAGES[2], alt: "دلال وفناجين مرتبة للتقديم" },
      { src: SETUP_IMAGES[2], alt: "ركن ضيافة عربي بتكوين هادئ" },
      { src: DATES_IMAGES[0], alt: "تمر مقدم ضمن ضيافة القهوة" },
    ],
  },
  {
    type: "faq",
    h2: "أسئلة تساعدنا على تجهيز عرض مناسبتك",
    faqs: [
      {
        question: "كيف أحدد عدد القهوجيين وصبابين القهوة؟",
        answer: "لا نستخدم رقمًا عامًا لكل المناسبات. نراجع عدد الضيوف، وتوقيت وصولهم، ومساحة المكان، وعدد المجالس، ثم نقترح الترتيب الملائم ضمن عرض الخدمة.",
      },
      {
        question: "هل تتوفر خدمة للمجالس النسائية؟",
        answer: "أرسل نوع المناسبة واحتياج المجلس عند التواصل، وسنوضح الخيارات المتاحة من قهوجيات وصبابات ضمن نطاق الطلب.",
      },
      {
        question: "هل يشمل الطلب القهوة والتمر وأدوات التقديم؟",
        answer: "تختلف العناصر بحسب العرض المتفق عليه. نذكر كل عنصر مشمول كتابةً قبل الاعتماد حتى تكون تفاصيل الخدمة واضحة للطرفين.",
      },
      {
        question: "ما المعلومات التي أرسلها للحصول على عرض؟",
        answer: "أرسل مدينة جدة، ونوع المناسبة، وتاريخها، وموقعها التقريبي، وعدد الضيوف المتوقع، والخدمات التي تفكر فيها. لا يلزم أن تكون كل التفاصيل نهائية من أول رسالة.",
      },
      {
        question: "هل يمكن تنسيق الخدمة مع قاعة أو منظم مناسبة؟",
        answer: "اذكر جهة التنسيق وطبيعة الموقع في الطلب، وسنوضح ما يمكن ترتيبه ضمن مسار الخدمة المتفق عليه من دون وعود قبل مراجعة التفاصيل.",
      },
    ],
  },
  {
    type: "links",
    h2: "استكشف خدمات الضيافة",
    links: [
      { label: "ضيافة مناسبات جدة", href: "/diyafa-munasabat-jeddah" },
      { label: "قهوجيين وصبابين جدة", href: "/qahwajiin-jeddah" },
      { label: "ركن قهوة في جدة", href: "/rukn-qahwa-jeddah" },
      { label: "ضيافة أعراس جدة", href: "/diyafa-aaras-jeddah" },
      { label: "الضيافة النسائية في جدة", href: "/diyafa-nisaiya-jeddah" },
      { label: "ضيافة الشركات في جدة", href: "/diyafa-sharikat-jeddah" },
      { label: "ضيافة استراحات جدة", href: "/diyafa-istirahat-jeddah" },
      { label: "ضيافة العزاء في جدة", href: "/diyafa-azaa-jeddah" },
      { label: "المناسبات الصغيرة في جدة", href: "/diyafa-munasabat-saghira-jeddah" },
      { label: "كيف تُبنى تكلفة الضيافة", href: "/asaar-diyafa" },
      { label: "جميع خدماتنا", href: "/services" },
      { label: "تواصل معنا", href: "/contact" },
    ],
  },
  {
    type: "cta",
    h2: "تواصل لتفصيل مناسبتك في جدة",
    body: "أرسل نوع المناسبة وتاريخها وموقعها التقريبي وعدد الضيوف المتوقع؛ ونبدأ من المعلومات المتاحة من دون افتراضات أو باقات لا تناسب مجلسك.",
    buttonLabel: "اطلب عرض مناسبتك",
    href: whatsappUrl("مرحباً، أرغب بتفصيل خدمة صبابين قهوة في جدة."),
  },
];

const sababinBlocksByCity: Record<string, LocalPageBlock[]> = {
  ...sababinBlocks,
  jeddah: jeddahSababinBlocks,
};

// ===== صبابين قهوة (sababin-qahwa) =====
function sababinContent(cityKey: string): {
  page: LocalServicePageProps;
  faqs: FAQ[];
  metaTitle: string;
  metaDescription: string;
  h1: string;
} {
  const c = CITIES[cityKey];
  if (!c) throw new Error(`Unknown cityKey: ${cityKey}`);
  const h1 = cityKey === "jeddah"
    ? "قهوجيين وصبابين في جدة، ضيافة تترك أثرها من أول فنجان"
    : `صبابين قهوة في ${c.ar} — قهوجيين ومباشرين لخدمة المناسبات`;

  const intro = cityKey === "jeddah"
    ? "حضورٌ مرتب وتفاصيل ضيافة تُنسّق بما يليق بمناسبتك وضيوفك. نفهم طبيعة المجلس في جدة أولًا، ثم نرتّب مسار التقديم ونطاق الخدمة المتفق عليه بوضوح."
    : `صبابين قهوة في ${c.ar} لحضور سعودي هادئ يبدأ بفهم المجلس ومسار الضيوف. نراجع موقع المناسبة في ${c.region} والعناصر المطلوبة، ثم نوضح نطاق خدمة القهوجيين والمباشرين المتفق عليه قبل الاعتماد.`;
  // حزمة AEO: إجابة مباشرة 40–60 كلمة (قابلة للاقتباس من محركات الإجابة).
  // لا أرقام غير موثّقة (R9) — المدينة والقناة والمنهجية فقط.
  const directAnswer = `توفّر أصول الضيافة صبابين قهوة وقهوجيين ومباشرين بزي تراثي في ${c.ar} للأعراس والمجالس ومناسبات العمل، مع قهوة عربية وتمور فاخرة. الحجز عبر واتساب 0568997316 باستشارة مجانية، ويُثبَّت عدد الفريق ونطاق الخدمة في عرض مكتوب قبل الاعتماد — والخدمة متاحة على مدار الساعة.`;
  const blocks = sababinBlocksByCity[cityKey];
  if (!blocks) throw new Error(`Missing sababin blocks: ${cityKey}`);
  const blockFaqs = blocks.find((block) => block.type === "faq");
  const faqs: FAQ[] = blockFaqs?.type === "faq" ? blockFaqs.faqs : [];

  return {
    h1,
    metaTitle: `صبابين قهوة ${c.ar} | قهوجيين ومباشرين للمناسبات — أصول الضيافة`,
    metaDescription: `صبابين قهوة وقهوجيين ومباشرين في ${c.ar}؛ خدمة تُفصّل بحسب المجلس ومسار الضيوف والعناصر المتفق عليها، مع عرض يوضح نطاق طلب المناسبة.`,
    faqs,
    page: {
      h1,
      cityAr: c.ar,
      serviceAr: "صبابين قهوة",
      intro,
      directAnswer,
      heroImage: TEAM_IMAGES[6],
      heroAlt: `صبابين قهوة وقهوجيين في ${c.ar} - أصول الضيافة`,
      blocks,
      breadcrumbItems: [
        { label: "الرئيسية", href: "/" },
        { label: "صبابين قهوة", href: "/services" },
        { label: c.ar, href: `/${localSlug("sababin-qahwa", cityKey)}` },
      ],
    },
  };
}

// ===== ضيافة مناسبات (diyafa-munasabat) =====
function diyafaContent(cityKey: string): {
  page: LocalServicePageProps;
  faqs: FAQ[];
  metaTitle: string;
  metaDescription: string;
  h1: string;
} {
  const c = CITIES[cityKey];
  if (!c) throw new Error(`Unknown cityKey: ${cityKey}`);
  const h1 = `ضيافة مناسبات في ${c.ar} — تجربة ضيافة سعودية فاخرة`;

  const intro = `ضيافة مناسبات في ${c.ar} تُبنى حول مقام اللقاء وموقعه في ${c.region}. نفهم رحلة الضيف والعناصر التي ترغب فيها، ثم نوضح ما يمكن إدراجه ضمن عرض مكتوب يليق بالمناسبة من دون افتراضات جاهزة.`;
  // حزمة AEO: إجابة مباشرة قابلة للاقتباس — بلا أرقام غير موثّقة (R9).
  const directAnswer = `تقدّم أصول الضيافة تجهيز ضيافة متكاملًا للمناسبات في ${c.ar}: قهوجيين وصبّابين، وركن قهوة عربية، وتمورًا فاخرة، وتنسيقًا يُبنى على نوع المناسبة ومكانها. أرسل تفاصيل مناسبتك عبر واتساب 0568997316 وتحصل على استشارة مجانية وعرض مكتوب يفصّل كل عنصر قبل الاعتماد.`;
  const blocks = diyafaBlocks[cityKey];
  if (!blocks) throw new Error(`Missing diyafa blocks: ${cityKey}`);
  const blockFaqs = blocks.find((block) => block.type === "faq");
  const faqs: FAQ[] = blockFaqs?.type === "faq" ? blockFaqs.faqs : [];

  return {
    h1,
    metaTitle: `ضيافة مناسبات ${c.ar} | تجهيز ضيافة أعراس ومؤتمرات — أصول الضيافة`,
    metaDescription: `ضيافة مناسبات في ${c.ar} بتفاصيل تُختار وفق مقام اللقاء والموقع ورحلة الضيف، مع عرض واضح للعناصر المختارة ونطاق الطلب المتفق عليه.`,
    faqs,
    page: {
      h1,
      cityAr: c.ar,
      serviceAr: "ضيافة مناسبات",
      intro,
      directAnswer,
      heroImage: SETUP_IMAGES[5],
      heroAlt: `ضيافة مناسبات فاخرة في ${c.ar} - أصول الضيافة`,
      blocks,
      breadcrumbItems: [
        { label: "الرئيسية", href: "/" },
        { label: "ضيافة مناسبات", href: "/services" },
        { label: c.ar, href: `/${localSlug("diyafa-munasabat", cityKey)}` },
      ],
    },
  };
}

export function getLocalContent(service: string, cityKey: string) {
  if (service === "sababin-qahwa") return sababinContent(cityKey);
  if (service === "diyafa-munasabat") return diyafaContent(cityKey);
  throw new Error(`Unknown service: ${service}`);
}

export { SITE_URL };
