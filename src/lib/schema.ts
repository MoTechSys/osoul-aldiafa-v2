// Centralized Schema.org structured data generators for أصول الضيافة
import {
  SITE_URL,
  SITE_NAME,
  PHONE_TEL as PHONE,
  EMAIL,
  SOCIAL_LINKS,
} from "@/lib/constants";
import { CITIES } from "@/lib/localPages";

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: "Asoul Al-Diafa",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.webp`,
    foundingDate: "2017",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: PHONE,
      contactType: "customer service",
      availableLanguage: ["Arabic", "English"],
      areaServed: {
        "@type": "Country",
        name: "Saudi Arabia",
      },
    },
    // sameAs — تعريف جوجل الحرفي (توثيق Organization structured data):
    // «URL of a page on another website with additional information about your
    //  organization … profile page on a social media or review site».
    // رابط wa.me رابط إجراء (فتح محادثة) لا صفحة ملف تعريفي — أُزيل من هنا
    // (تدقيق معايير جوجل 2026-08-29، انظر docs/04-research/) وبقي في
    // الواجهة وllms.txt كقناة تواصل.
    sameAs: [
      SOCIAL_LINKS.tiktok,
      SOCIAL_LINKS.instagram,
      SOCIAL_LINKS.snapchat,
      SOCIAL_LINKS.x,
      SOCIAL_LINKS.facebook,
    ],
  };
}

/**
 * مناطق الخدمة — النشاط مزوّد خدمة متنقّل (SAB) بلا مقر أو موقع فيزيائي.
 * كل مدينة مخدومة تمثَّل بدائرة GeoCircle حول مركزها (لا address ولا geo للنشاط نفسه).
 */
export const SERVICE_AREAS = Object.values(CITIES).map((c) => ({
  "@type": "GeoCircle" as const,
  name: c.ar,
  geoMidpoint: {
    "@type": "GeoCoordinates" as const,
    latitude: c.lat,
    longitude: c.lng,
  },
  geoRadius: 30000,
}));

/**
 * قرار المالك (2026-08-29، نهائي): التغطية **كل مناطق المملكة**، مع تركيز
 * تشغيلي وSEO قوي على **جدة وينبع** تحديدًا.
 *
 * التمثيل في schema.org: areaServed مصفوفة تجمع Country (السعودية كاملة —
 * يفتح الظهور لأي بحث محلي في المملكة) مع دوائر GeoCircle للمدن الخمس
 * (إشارة كثافة/أولوية للمناطق الأساسية — جوجل يقرأ العنصرين معًا ولا
 * تعارض بينهما: الدوائر تخصيص داخل نطاق الدولة لا استثناء منه).
 * هذا يحل بند ق-٢ في docs/01-status/02-قرارات-معلّقة.md من الاتجاه الثاني
 * (كنا نخسر أسواق بقية المناطق بإعلان 5 مدن فقط).
 */
export const AREA_SERVED_KINGDOM_WITH_FOCUS = [
  {
    "@type": "Country" as const,
    name: "Saudi Arabia",
    alternateName: "المملكة العربية السعودية",
  },
  ...SERVICE_AREAS,
];

export function generateProfessionalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    alternateName: "Asoul Al-Diafa",
    description:
      "أصول الضيافة — خدمات ضيافة فاخرة متنقّلة في كل مناطق المملكة، وبتركيز خاص على جدة وينبع: قهوة عربية، شاي، تمور، وفريق صبّابين وقهوجيين بزي تراثي يصل إليك أينما كانت مناسبتك.",
    url: SITE_URL,
    telephone: PHONE,
    email: EMAIL,
    image: `${SITE_URL}/logo.webp`,
    logo: `${SITE_URL}/logo.webp`,
    // SAB: مناطق خدمة فقط — بلا address وبلا geo (R5 / SC2 / SC3).
    // نستخدم areaServed (الخاصية الحديثة في schema.org التي تَخلُف serviceArea
    // المهجورة) — واتّساقًا مع generateServiceSchema أدناه الذي يستخدم areaServed.
    // قرار المالك 2026-08-29: المملكة كاملة + دوائر التركيز الخمس.
    areaServed: AREA_SERVED_KINGDOM_WITH_FOCUS,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    // نطاق سعري يشمل المتوسط والفاخر (قرار المالك: "فاخرة ومتوسطة ليظهر لكل
    // الناس"). "$$-$$$$" نطاق صالح في schema.org يغطّي من المتوسط إلى الفاخر.
    // (الصياغة النهائية بين "$$-$$$$" و"$$$" لمراجع الكود في مراجعة الـPR.)
    priceRange: "$$-$$$$",
    // ملاحظة: أُزيلت aggregateRating/review الذاتية — التقييمات الذاتية على موقع الشركة
    // مخالفة لسياسة Google (self-serving reviews) وقد تُسقط النتائج الغنية.
    // sameAs: ملفات تعريفية فقط (بلا wa.me — راجع التعليق في generateOrganizationSchema).
    sameAs: [
      SOCIAL_LINKS.tiktok,
      SOCIAL_LINKS.instagram,
      SOCIAL_LINKS.snapchat,
      SOCIAL_LINKS.x,
      SOCIAL_LINKS.facebook,
    ],
  };
}

/**
 * حزمة AEO (2026-08-29) — الرسم الموحّد @graph للـlayout.
 *
 * بدل ثلاث كتل JSON-LD منفصلة (Organization + ProfessionalService + WebSite)
 * كانت تصف الكيان نفسه بلا رابط بينها، يبني هذا المولّد **رسمًا واحدًا**
 * بعُقد مترابطة عبر @id:
 *
 *   ┌─ #business  (ProfessionalService + Organization — كيان واحد بنوعين،
 *   │              لأن النشاط التجاري *هو* المنظمة؛ عقدتان منفصلتان بلا رابط
 *   │              كانتا تبدوان لمحركات الإجابة ككيانين مختلفين)
 *   │    └── logo → @id #logo
 *   ├─ #logo      (ImageObject — يُشار إليه من العقدتين بلا تكرار)
 *   └─ #website   (WebSite — publisher → @id #business)
 *
 * وترتبط به بقية الصفحات خارجيًا:
 *   - Service.provider        → @id #business  (generateServiceSchema)
 *   - WebPage.isPartOf        → @id #website   (generateWebPageSchema)
 *
 * ⚠️ AggregateRating — قرار موثّق بالرفض (طلب المالك «بأرقام موثقة فقط»):
 * لا يوجد اليوم أي مصدر تقييم خارجي موثّق للكيان (لا ملف نشاط تجاري على
 * جوجل ولا منصة مراجعات مستقلة). نشر aggregateRating بأرقام ذاتية على موقع
 * الشركة نفسها مخالفة صريحة لسياسة Google (self-serving reviews) وقد يُسقط
 * كل النتائج الغنية للموقع. يُضاف الحقل فقط بعد توفر مصدر خارجي قابل
 * للتحقق (ملف Google Business Profile بمراجعات حقيقية هو الطريق الأقصر).
 */
export function generateSiteGraph() {
  // نسخ العقد من المولدات المفردة (مصدر الحقيقة يبقى واحدًا) مع إسقاط
  // @context الداخلي — الرسم يحمل @context واحدًا على الجذر.
  const org = generateOrganizationSchema() as Record<string, unknown>;
  const pro = generateProfessionalServiceSchema() as Record<string, unknown>;
  delete org["@context"];
  delete pro["@context"];
  delete org["@type"]; // يُستبدل بالنوع المركّب أدناه
  delete pro["@type"];
  delete pro["logo"]; // يُستبدل بمرجع @id للعقدة #logo
  delete pro["image"];
  delete org["logo"];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        // كيان الأعمال الموحّد: المنظمة والنشاط المهني شيء واحد.
        "@type": ["ProfessionalService", "Organization"],
        "@id": `${SITE_URL}/#business`,
        ...org,
        ...pro,
        logo: { "@id": `${SITE_URL}/#logo` },
        image: { "@id": `${SITE_URL}/#logo` },
      },
      {
        "@type": "ImageObject",
        "@id": `${SITE_URL}/#logo`,
        url: `${SITE_URL}/logo.webp`,
        contentUrl: `${SITE_URL}/logo.webp`,
        caption: SITE_NAME,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        alternateName: "Asoul Al-Diafa",
        url: SITE_URL,
        inLanguage: "ar",
        publisher: { "@id": `${SITE_URL}/#business` },
      },
    ],
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateWebPageSchema(page: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": page.url,
    name: page.name,
    description: page.description,
    url: page.url,
    // مرجع @id خالص — العقدة الكاملة #website معرّفة مرة واحدة في رسم
    // الـlayout (generateSiteGraph)؛ تكرار تعريفها هنا كان يخلق نسختين.
    isPartOf: { "@id": `${SITE_URL}/#website` },
    inLanguage: "ar",
    about: { "@id": `${SITE_URL}/#business` },
  };
}

export function generateServiceSchema(service: {
  name: string;
  description: string;
  url: string;
  /** Arabic city name; when provided, areaServed is the specific City (for city×service pages). */
  cityAr?: string;
  /** Service type label, e.g. "صبابين قهوة". Falls back to a generic label. */
  serviceType?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: service.url,
    // Reference the SINGLE business entity by pure @id — never create a
    // new per-city business entity (that implies a physical location = doorway signal).
    // العقدة الكاملة #business معرّفة في generateSiteGraph (الـlayout).
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: service.cityAr
      ? { "@type": "City", name: service.cityAr }
      : { "@type": "Country", name: "Saudi Arabia" },
    serviceType: service.serviceType ?? "Hospitality Services",
  };
}

export function generateFAQSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// محذوف: generateWebSiteSchema() — كان كودًا ميتًا (صفر استخدامات) يعرّف
// نسخة ثانية متضاربة من عقدة #website (publisher مدمج بدل مرجع @id).
// العقدة الوحيدة المعتمدة لـ WebSite داخل generateSiteGraph أعلاه.
// (تدقيق معايير جوجل 2026-08-29)

/**
 * تسلسل آمن لـ JSON-LD يمنع XSS عبر هروب < و > و &
 * Safe JSON-LD serializer (escapes <, >, & to prevent XSS in <script>)
 */
export function jsonLd(obj: unknown): string {
  // Escape characters that can break either the <script> tag boundary (< > &)
  // or a JavaScript string literal (U+2028 line sep, U+2029 paragraph sep).
  return JSON.stringify(obj)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
