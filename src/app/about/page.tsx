import { Metadata } from "next";
import AboutClient from "./AboutClient";
import { generatePageMetadata } from "@/components/SEO";
import {
  generateBreadcrumbSchema,
  generateWebPageSchema, jsonLd } from "@/lib/schema";

const SITE_URL = "https://asoulaldiafa.com";

export const metadata: Metadata = generatePageMetadata({
  title: "من نحن",
  description:
    "أصول الضيافة منذ 2017 — نُحيي أصول الضيافة العربية بفريق صبّابين بزي تراثي وأدوات تقديم ذهبية، في كل بقاع المملكة.",
  path: "/about",
  keywords: [
    "عن أصول الضيافة",
    "شركة ضيافة سعودية",
    "ضيافة تراثية",
  ],
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "الرئيسية", url: SITE_URL },
  { name: "من نحن", url: `${SITE_URL}/about` },
]);

const webPageSchema = generateWebPageSchema({
  name: "من نحن - أصول الضيافة",
  description: "قصّتنا ورسالتنا وقيمنا في تقديم الضيافة العربية الأصيلة",
  url: `${SITE_URL}/about`,
});

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(webPageSchema) }} />
      <AboutClient />
    </>
  );
}
