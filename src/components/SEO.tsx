import type { Metadata } from "next";
import {
  SITE_URL,
  SITE_NAME,
  PHONE_TEL,
  EMAIL as SITE_EMAIL,
  WHATSAPP_NUMBER,
  WHATSAPP_DISPLAY, OG_IMAGE_URL } from "@/lib/constants";

const DEFAULT_OG_IMAGE = OG_IMAGE_URL;

export interface SEOProps {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogType?: "website" | "article" | "profile";
  twitterCard?: "summary" | "summary_large_image";
  keywords?: string[];
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

export function generatePageMetadata({
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  ogImageAlt = `${SITE_NAME} - ${title}`,
  ogType = "website",
  twitterCard = "summary_large_image",
  keywords = [],
  noIndex = false,
  publishedTime,
  modifiedTime,
}: SEOProps): Metadata {
  const url = `${SITE_URL}${path}`;

  // D1.1/D1.2: العلامة تُدار هنا حصريًا — نزيل أي علامة واردة من المصدر ثم
  // نلحقها مرة واحدة فقط إن سمح طول 60 حرفًا. النتيجة: صفر تكرار، صفر عنوان طويل.
  const stripped = title
    .replace(new RegExp(`\\s*[|\\-—–]\\s*${SITE_NAME}\\s*`, "g"), " ")
    .replace(new RegExp(`\\s*${SITE_NAME}\\s*[|\\-—–]\\s*`, "g"), " ")
    .replace(/\s{2,}/g, " ")
    .trim();
  const withBrand = `${stripped} | ${SITE_NAME}`;
  const fullTitle = stripped.includes(SITE_NAME)
    ? stripped
    : withBrand.length <= 60
      ? withBrand
      : stripped;

  const defaultKeywords = [
    "أصول الضيافة",
    "خدمات ضيافة",
    "ضيافة فاخرة",
    "قهوة عربية",
    "صبابين قهوة",
    "ضيافة السعودية",
    "ضيافة المملكة",
    "ضيافة مناسبات",
    "قهوجي",
    "Asoul Al-Diafa",
    "Saudi hospitality",
  ];

  return {
    title: fullTitle,
    description,
    keywords: [...defaultKeywords, ...keywords],
    alternates: {
      canonical: url,
      // languages omitted: monolingual Arabic site (see layout.tsx).
    },
    openGraph: {
      type: ogType,
      siteName: SITE_NAME,
      locale: "ar_SA",
      title: fullTitle,
      description,
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
          // ⚠️ يجب أن يطابق الامتداد الفعلي للملف. og-image.jpg هو JPEG.
          // إعلان image/webp لملف JPEG يجعل واتساب/تويتر يرفض المعاينة أحيانًا.
          type: ogImage.endsWith(".webp")
            ? "image/webp"
            : ogImage.endsWith(".png")
              ? "image/png"
              : "image/jpeg",
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: twitterCard,
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

export const SEO_CONSTANTS = {
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  PHONE: PHONE_TEL,
  EMAIL: SITE_EMAIL,
  WHATSAPP: WHATSAPP_NUMBER,
  WHATSAPP_DISPLAY,
  ADDRESS: {
    region: "المملكة العربية السعودية",
    country: "SA",
    countryName: "المملكة العربية السعودية",
  },
} as const;
