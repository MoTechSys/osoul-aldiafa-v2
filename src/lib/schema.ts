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
    alternateName: "Osoul Al-Diafa",
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

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    alternateName: "Osoul Al-Diafa",
    description:
      "أصول الضيافة - خدمات ضيافة فاخرة في جميع مناطق المملكة العربية السعودية. قهوة عربية، شاي، تمور، وفريق صبّابين بزي تراثي.",
    url: SITE_URL,
    telephone: PHONE,
    email: EMAIL,
    image: `${SITE_URL}/logo.webp`,
    address: {
      "@type": "PostalAddress",
      addressCountry: "SA",
      addressRegion: "المملكة العربية السعودية",
    },
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
    areaServed: {
      "@type": "Country",
      name: "Saudi Arabia",
    },
    sameAs: [
      `https://wa.me/${WHATSAPP_NUMBER}`,
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
    alternateName: "Osoul Al-Diafa",
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
