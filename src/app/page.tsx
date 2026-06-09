import { Metadata } from "next";
import { HomePageClient } from "./HomePageClient";
import {
  generateBreadcrumbSchema,
  generateFAQSchema, jsonLd } from "@/lib/schema";

const SITE_URL = "https://asoulaldiafa.com";

export const metadata: Metadata = {
  title: "أصول الضيافة | خدمات الضيافة الفاخرة في المملكة العربية السعودية",
  description:
    "أصول الضيافة - نُحيي أصول الضيافة العربية بفريق صبّابين بزي تراثي، قهوة عربية، شاي وتمور فاخرة. خدمة شاملة لجميع مناطق المملكة العربية السعودية.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "أصول الضيافة | خدمات الضيافة الفاخرة في المملكة",
    description:
      "نحيي أصول الضيافة العربية الأصيلة بفريق صبّابين بزي تراثي وقهوة عربية وتمور فاخرة في جميع مناطق المملكة.",
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "أصول الضيافة - خدمات الضيافة الفاخرة",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "أصول الضيافة | خدمات الضيافة الفاخرة",
    description: "خدمات الضيافة الفاخرة في جميع مناطق المملكة العربية السعودية",
    images: [`${SITE_URL}/og-image.jpg`],
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
      "نخدم جميع مناطق المملكة العربية السعودية ونتنقل بفريقنا وعدّتنا أينما كانت مناسبتك.",
  },
  {
    question: "كيف يمكنني الحجز؟",
    answer:
      "عبر واتساب على الرقم 0568997316 أو البريد الإلكتروني info@asoulaldiafa.com، أو من خلال نموذج التواصل في صفحة \"تواصل معنا\".",
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
    </>
  );
}
