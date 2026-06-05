import { Metadata } from "next";
import ServicesClient from "./ServicesClient";
import { generatePageMetadata } from "@/components/SEO";
import {
  generateBreadcrumbSchema,
  generateServiceSchema,
  generateWebPageSchema, jsonLd } from "@/lib/schema";

const SITE_URL = "https://osoulaldiafa.com";

export const metadata: Metadata = generatePageMetadata({
  title: "خدماتنا",
  description:
    "صبّابو قهوة بزي تراثي، أركان ضيافة، بوفيهات تمر وحلويات، تأجير عدّة تقديم ذهبية، وضيافة الفعاليات في كامل المملكة.",
  path: "/services",
  keywords: [
    "صبابين قهوة",
    "تجهيز ركن ضيافة",
    "بوفيه تمر",
    "تأجير دلال قهوة",
    "ضيافة فعاليات",
    "ضيافة مؤتمرات",
  ],
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "الرئيسية", url: SITE_URL },
  { name: "خدماتنا", url: `${SITE_URL}/services` },
]);

const serviceSchema = generateServiceSchema({
  name: "خدمات أصول الضيافة",
  description:
    "صبّابو قهوة بزي تراثي، أركان ضيافة، بوفيهات تمر وحلويات، تأجير عدّة تقديم ذهبية، وضيافة الفعاليات",
  url: `${SITE_URL}/services`,
});

const webPageSchema = generateWebPageSchema({
  name: "خدماتنا - أصول الضيافة",
  description: "باقات ضيافة شاملة لمناسباتك في كامل المملكة العربية السعودية",
  url: `${SITE_URL}/services`,
});

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(webPageSchema) }} />
      <ServicesClient />
    </>
  );
}
