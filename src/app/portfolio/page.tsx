import { Metadata } from "next";
import PortfolioClient from "./PortfolioClient";
import { generatePageMetadata } from "@/components/SEO";
import {
  generateBreadcrumbSchema,
  generateWebPageSchema, jsonLd } from "@/lib/schema";

const SITE_URL = "https://asoulaldiafa.com";

export const metadata: Metadata = generatePageMetadata({
  title: "معرض الأعمال",
  description:
    "صور حقيقية من مناسبات أصول الضيافة — أركان ضيافة، صبّابون بزي تراثي، أدوات تقديم ذهبية وبوفيهات تمر فاخرة.",
  path: "/portfolio",
  keywords: [
    "معرض أعمال ضيافة",
    "ضيافة فعاليات",
    "ركن قهوة عربية",
    "صور ضيافة سعودية",
  ],
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "الرئيسية", url: SITE_URL },
  { name: "معرض الأعمال", url: `${SITE_URL}/portfolio` },
]);

const webPageSchema = generateWebPageSchema({
  name: "معرض الأعمال - أصول الضيافة",
  description: "صور توضح خبرتنا في تقديم الضيافة الفاخرة عبر المملكة",
  url: `${SITE_URL}/portfolio`,
});

export default function PortfolioPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(webPageSchema) }} />
      <PortfolioClient />
    </>
  );
}
