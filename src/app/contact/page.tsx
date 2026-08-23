import { Metadata } from "next";
import ContactClient from "./ContactClient";
import { generatePageMetadata } from "@/components/SEO";
import {
  generateBreadcrumbSchema,
  generateWebPageSchema, jsonLd } from "@/lib/schema";

import { SITE_URL, EMAIL } from "@/lib/constants";

export const metadata: Metadata = generatePageMetadata({
  title: "اطلب قهوجيين وضيافة لمناسبتك الآن",
  description:
    `تواصل مع أصول الضيافة عبر واتساب 0568997316 أو البريد ${EMAIL} — استشارة مجانية لاختيار باقة الضيافة الأنسب لمناسبتك وموقعك.`,
  path: "/contact",
  keywords: [
    "تواصل أصول الضيافة",
    "حجز ضيافة",
    "استشارة ضيافة",
  ],
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "الرئيسية", url: SITE_URL },
  { name: "تواصل معنا", url: `${SITE_URL}/contact` },
]);

const webPageSchema = generateWebPageSchema({
  name: "تواصل معنا - أصول الضيافة",
  description: "تواصل مع أصول الضيافة للحجز والاستشارة المجانية",
  url: `${SITE_URL}/contact`,
});

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(webPageSchema) }} />
      <ContactClient />
    </>
  );
}
