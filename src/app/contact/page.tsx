import { Metadata } from "next";
import ContactClient from "./ContactClient";
import { generatePageMetadata } from "@/components/SEO";
import {
  generateBreadcrumbSchema,
  generateWebPageSchema, jsonLd } from "@/lib/schema";

const SITE_URL = "https://asoulaldiafa.com";

export const metadata: Metadata = generatePageMetadata({
  title: "تواصل معنا",
  description:
    "تواصل مع أصول الضيافة عبر واتساب 0568997316 أو osoulaldiafa@gmail.com — استشارة مجانية لاختيار باقة الضيافة المناسبة.",
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
