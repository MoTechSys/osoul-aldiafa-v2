import type { Metadata } from "next";
import {
  SITE_URL,
  SITE_NAME,
  PHONE_TEL,
  EMAIL as SITE_EMAIL,
  WHATSAPP_NUMBER,
  WHATSAPP_DISPLAY, OG_IMAGE_URL } from "@/lib/constants";
import ogManifest from "@/data/og-manifest.json";

const DEFAULT_OG_IMAGE = OG_IMAGE_URL;

/**
 * صور OG المخصّصة لكل صفحة (49 صفحة) — مصدر واحد: src/data/og-manifest.json.
 *
 * لماذا هنا: هذا هو المولّد المركزي للميتاداتا، فمطابقة واحدة بالمسار تغطي
 * كل الصفحات بلا لمس ملفات الصفحات (لا هارد-كود في 49 ملفًا).
 *
 * لماذا وسمان (JPEG ثم WebP) لا WebP وحده:
 * التوثيق الرسمي لفيسبوك/X يذكر WebP، لكن معاينات واتساب تفشل معه ميدانيًا
 * بشكل متكرر — وواتساب هو قناة التحويل الوحيدة في هذا الموقع (النموذج نفسه
 * يرسل عبره). المُكشِّطات تأخذ أول og:image تفهمه، فنضع JPEG أولًا لأقصى
 * توافق ونُلحق WebP للمنصات التي تفضّله. مكسب SEO محفوظ، ومخاطرة واتساب صفر.
 * (التعليق أدناه في هذا الملف يوثّق أن الفريق واجه رفض معاينة بسبب نوع خاطئ.)
 */
type OgEntry = { path: string; image: string; alt: string };
const OG_BY_PATH = new Map<string, OgEntry>(
  (ogManifest as OgEntry[]).map((e) => [e.path, e])
);

function normalizePath(path: string): string {
  if (!path || path === "/") return "/";
  const p = path.split("?")[0].split("#")[0];
  return p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
}

/** يُرجع صور OG للمسار: [JPEG, WebP] إن وُجدت الصفحة في manifest، وإلا الافتراضية. */
export function ogImagesFor(path: string): { url: string; alt: string; type: string }[] {
  const entry = OG_BY_PATH.get(normalizePath(path));
  if (!entry) {
    return [{ url: DEFAULT_OG_IMAGE, alt: `${SITE_NAME}`, type: "image/jpeg" }];
  }
  const webp = `${SITE_URL}${entry.image}`;
  const jpg = `${SITE_URL}${entry.image.replace(/\.webp$/, ".jpg")}`;
  return [
    { url: jpg, alt: entry.alt, type: "image/jpeg" },
    { url: webp, alt: entry.alt, type: "image/webp" },
  ];
}

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
  ogImage,
  ogImageAlt,
  ogType = "website",
  twitterCard = "summary_large_image",
  keywords = [],
  noIndex = false,
  publishedTime,
  modifiedTime,
}: SEOProps): Metadata {
  const url = `${SITE_URL}${path}`;

  // صورة مخصّصة من manifest حسب المسار؛ ogImage الصريح (إن مُرِّر) يتقدّم عليها.
  const resolved = ogImagesFor(path);
  const images = ogImage
    ? [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogImageAlt ?? `${SITE_NAME} - ${title}`,
          type: ogImage.endsWith(".webp")
            ? "image/webp"
            : ogImage.endsWith(".png")
              ? "image/png"
              : "image/jpeg",
        },
      ]
    : resolved.map((r) => ({
        url: r.url,
        width: 1200,
        height: 630,
        alt: ogImageAlt ?? r.alt,
        type: r.type,
      }));

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
      // ⚠️ النوع يطابق الامتداد الفعلي دائمًا — إعلان image/webp لملف JPEG
      // يجعل واتساب/تويتر يرفض المعاينة أحيانًا (عيب واجهه الفريق سابقًا).
      images,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: twitterCard,
      title: fullTitle,
      description,
      images: images.map((i) => i.url),
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
