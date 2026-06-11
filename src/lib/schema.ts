// Centralized Schema.org structured data generators for أصول الضيافة
import {
  SITE_URL,
  SITE_NAME,
  PHONE_TEL as PHONE,
  EMAIL,
  WHATSAPP_NUMBER,
} from "@/lib/constants";

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
    ],
  };
}

// فروع/مواقع الخدمة — إحداثيات دقيقة من خرائط جوجل (تحسين الظهور المحلي + "بالقرب مني")
export const BRANCHES = [
  {
    name: "أصول الضيافة - بدر",
    addressLocality: "بدر",
    addressRegion: "منطقة المدينة المنورة",
    lat: 23.773033,
    lng: 38.796941,
    mapUrl: "https://maps.app.goo.gl/GHth1VbP8bnCJjn88",
  },
  {
    name: "أصول الضيافة - ينبع البحر (دوار السفينة)",
    addressLocality: "ينبع البحر",
    addressRegion: "منطقة المدينة المنورة",
    lat: 24.106080,
    lng: 38.045997,
    mapUrl: "https://maps.app.goo.gl/e83Y1bG7aNJ4SpJ77",
  },
  {
    name: "أصول الضيافة - الهيئة الملكية بينبع",
    addressLocality: "ينبع الصناعية",
    addressRegion: "منطقة المدينة المنورة",
    lat: 24.021181,
    lng: 38.179746,
    mapUrl: "https://maps.app.goo.gl/JJFp64FPWPHSutBLA",
  },
  {
    name: "أصول الضيافة - جدة (الحمدانية)",
    addressLocality: "جدة",
    addressRegion: "منطقة مكة المكرمة",
    lat: 21.754844,
    lng: 39.207821,
    mapUrl: "https://maps.app.goo.gl/GG7gyREBTHMYJxUN9",
  },
] as const;

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    alternateName: "Asoul Al-Diafa",
    description:
      "أصول الضيافة - خدمات ضيافة فاخرة في جميع مناطق المملكة العربية السعودية. قهوة عربية، شاي، تمور، وفريق صبّابين بزي تراثي. فروع في بدر وينبع وجدة.",
    url: SITE_URL,
    telephone: PHONE,
    email: EMAIL,
    image: `${SITE_URL}/logo.webp`,
    logo: `${SITE_URL}/logo.webp`,
    address: {
      "@type": "PostalAddress",
      addressCountry: "SA",
      addressLocality: "ينبع",
      addressRegion: "منطقة المدينة المنورة",
    },
    // الموقع الرئيسي (ينبع البحر) — إحداثيات لخرائط جوجل
    geo: {
      "@type": "GeoCoordinates",
      latitude: 24.106080,
      longitude: 38.045997,
    },
    // المناطق المخدومة فعلياً (تقوّي الظهور في كل مدينة)
    areaServed: BRANCHES.map((b) => ({
      "@type": "City",
      name: b.addressLocality,
    })),
    // فروع متعددة → كل فرع يظهر محلياً
    location: BRANCHES.map((b) => ({
      "@type": "Place",
      name: b.name,
      hasMap: b.mapUrl,
      address: {
        "@type": "PostalAddress",
        addressCountry: "SA",
        addressLocality: b.addressLocality,
        addressRegion: b.addressRegion,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: b.lat,
        longitude: b.lng,
      },
    })),
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
    priceRange: "$$$$",
    servesCuisine: "Arabic Hospitality",
    // ملاحظة: أُزيلت aggregateRating/review الذاتية — التقييمات الذاتية على موقع الشركة
    // مخالفة لسياسة Google (self-serving reviews) وقد تُسقط النتائج الغنية. التقييمات
    // الحقيقية تُعرض عبر Google Business Profile لا عبر schema الموقع.
    sameAs: [
      `https://wa.me/${WHATSAPP_NUMBER}`,
    ],
  };
}

/**
 * LocalBusiness خاص بمدينة معيّنة — لصفحات (خدمة × مدينة).
 * يقوّي الظهور المحلي لكل مدينة على حدة (geo + addressLocality دقيقان).
 */
export function generateCityLocalBusinessSchema(city: {
  ar: string;
  region: string;
  url: string;
  lat?: number;
  lng?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${SITE_NAME} - ${city.ar}`,
    image: `${SITE_URL}/logo.webp`,
    url: city.url,
    telephone: PHONE,
    email: EMAIL,
    priceRange: "$$$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "SA",
      addressLocality: city.ar,
      addressRegion: city.region,
    },
    ...(city.lat && city.lng
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: city.lat,
            longitude: city.lng,
          },
        }
      : {}),
    areaServed: { "@type": "City", name: city.ar },
    parentOrganization: { "@type": "Organization", name: SITE_NAME, "@id": `${SITE_URL}/#business` },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    sameAs: [`https://wa.me/${WHATSAPP_NUMBER}`],
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
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: service.url,
    provider: {
      "@type": "LocalBusiness",
      name: SITE_NAME,
      "@id": `${SITE_URL}/#business`,
    },
    areaServed: {
      "@type": "Country",
      name: "Saudi Arabia",
    },
    serviceType: "Hospitality Services",
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
  return JSON.stringify(obj)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
