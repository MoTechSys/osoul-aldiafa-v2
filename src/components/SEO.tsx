import type { Metadata } from "next";
import {
  SITE_URL,
  SITE_NAME,
  PHONE_TEL,
  EMAIL as SITE_EMAIL,
  WHATSAPP_NUMBER,
  WHATSAPP_DISPLAY,
} from "@/lib/constants";

const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

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
    title,
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
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
          type: "image/webp",
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: twitterCard,
      title: `${title} | ${SITE_NAME}`,
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
