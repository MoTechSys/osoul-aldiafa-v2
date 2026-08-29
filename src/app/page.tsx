import { Metadata } from "next";
import { HomePageClient } from "./HomePageClient";
import { ServiceAreas } from "@/components/ServiceAreas";
import {
  generateBreadcrumbSchema,
  generateFAQSchema, jsonLd } from "@/lib/schema";

import { SITE_URL, EMAIL } from "@/lib/constants";
import { ogImagesFor } from "@/components/SEO";

const HOME_OG = ogImagesFor("/");

export const metadata: Metadata = {
  title: "أصول الضيافة | قهوجيين وصبابين وضيافة فاخرة في السعودية",
  // حاجز-1 — يجب أن يطابق وصف layout.tsx حرفيًا: هذا الملف يتجاوز وصف
  // الجذر للصفحة الرئيسية، فتركه قديمًا يُبقي المقتطف القديم على أكثر
  // الصفحات زيارةً — وهي نفس مصيدة تجاوز صورة OG التي أُصلحت سابقًا.
  description:
    "قهوجيين وصبّابين قهوة عربية وتمور فاخرة بزي تراثي في جدة وينبع — نخدم كل مناطق المملكة، ومكة والمدينة وبدر بانتظام. استشارة مجانية قبل الحجز.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    siteName: "أصول الضيافة",
    locale: "ar_SA",
    title: "أصول الضيافة | خدمات الضيافة الفاخرة في المملكة",
    description:
      "نحيي أصول الضيافة العربية الأصيلة بفريق صبّابين بزي تراثي وقهوة عربية وتمور فاخرة في جدة وينبع، ونصل إلى كل مناطق المملكة.",
    url: SITE_URL,
    // صور الرئيسية من og-manifest (JPEG أولًا للتوافق مع واتساب، ثم WebP).
    images: HOME_OG.map((i) => ({
      url: i.url,
      width: 1200,
      height: 630,
      alt: i.alt,
      type: i.type,
    })),
  },
  twitter: {
    card: "summary_large_image",
    // @asoulaldiafa — حساب X الرسمي بنفس اسم الدومين (قرار المالك 2026-08-29).
    site: "@asoulaldiafa",
    creator: "@asoulaldiafa",
    title: "أصول الضيافة | خدمات الضيافة الفاخرة",
    description: "خدمات الضيافة الفاخرة في جدة وينبع وكل مناطق المملكة",
    images: HOME_OG.map((i) => i.url),
  },
};

const faqSchema = generateFAQSchema([
  {
    question: "ما الذي تقدّمه أصول الضيافة؟",
    answer:
      "نقدّم خدمات ضيافة فاخرة شاملة تتضمن: صبّابي قهوة ومباشرين بزي تراثي سعودي، تجهيز أركان ضيافة، تقديم قهوة عربية وشاي، توزيع تمر وحلويات فاخرة، وأدوات تقديم ذهبية.",
  },
  {
    question: "ما هي المناطق التي تغطّيها أصول الضيافة؟",
    answer:
      "نخدم كل مناطق المملكة. تركيزنا الأساسي وتواجدنا الأقوى في جدة وينبع، ونغطي بانتظام مكة المكرمة والمدينة المنورة وبدر، ونصل إلى بقية المدن — الرياض والدمام وغيرها — بترتيب مسبق يضمن نفس مستوى الخدمة.",
  },
  {
    question: "كيف يمكنني الحجز؟",
    answer:
      `عبر واتساب على الرقم 0568997316 أو البريد الإلكتروني ${EMAIL}، أو من خلال نموذج التواصل في صفحة "تواصل معنا".`,
  },
  {
    question: "هل تقدّمون استشارة قبل الحجز؟",
    answer:
      "نعم، نقدّم استشارة مجانية لاقتراح الباقة الأنسب لعدد الضيوف ونوع المناسبة. تواصل معنا عبر واتساب.",
  },
]);

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "الرئيسية", url: SITE_URL },
]);

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />
      <HomePageClient />
      <ServiceAreas />
    </>
  );
}
