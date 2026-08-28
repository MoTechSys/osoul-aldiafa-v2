// Centralized Schema.org structured data generators for أصول الضيافة
import {
  SITE_URL,
  SITE_NAME,
  PHONE_TEL as PHONE,
  EMAIL,
  WHATSAPP_NUMBER,
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
    sameAs: [
      `https://wa.me/${WHATSAPP_NUMBER}`,
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

export function generateProfessionalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    alternateName: "Asoul Al-Diafa",
    description:
      "أصول الضيافة — خدمات ضيافة فاخرة متنقّلة في جدة وينبع أساسًا، مع خدمة تصل إلى بقية مناطق المملكة: قهوة عربية، شاي، تمور، وفريق صبّابين وقهوجيين بزي تراثي يصل إليك أينما كانت مناسبتك.",
    url: SITE_URL,
    telephone: PHONE,
    email: EMAIL,
    image: `${SITE_URL}/logo.webp`,
    logo: `${SITE_URL}/logo.webp`,
    // SAB: مناطق خدمة فقط — بلا address وبلا geo (R5 / SC2 / SC3).
    // نستخدم areaServed (الخاصية الحديثة في schema.org التي تَخلُف serviceArea
    // المهجورة) — واتّساقًا مع generateServiceSchema أدناه الذي يستخدم areaServed.
    areaServed: SERVICE_AREAS,
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
    sameAs: [
      `https://wa.me/${WHATSAPP_NUMBER}`,
      SOCIAL_LINKS.tiktok,
      SOCIAL_LINKS.instagram,
      SOCIAL_LINKS.snapchat,
      SOCIAL_LINKS.x,
      SOCIAL_LINKS.facebook,
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
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    inLanguage: "ar",
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
    // Reference the SINGLE ProfessionalService entity by @id — never create a
    // new per-city business entity (that implies a physical location = doorway signal).
    provider: {
      "@type": "ProfessionalService",
      name: SITE_NAME,
      "@id": `${SITE_URL}/#business`,
    },
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

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: "Asoul Al-Diafa",
    url: SITE_URL,
    inLanguage: "ar",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.webp`,
      },
    },
  };
}

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
