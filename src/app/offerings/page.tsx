import { Metadata } from "next";
import OfferingsClient from "./OfferingsClient";
import { generatePageMetadata } from "@/components/SEO";
import {
  generateBreadcrumbSchema,
  generateServiceSchema,
  generateWebPageSchema, jsonLd } from "@/lib/schema";

const SITE_URL = "https://asoulaldiafa.com";

export const metadata: Metadata = generatePageMetadata({
  title: "تقديماتنا",
  description:
    "قهوة عربية وشاي مزهّر، تمور فاخرة، معمول ومكسرات، دلال ذهبية وفناجين منقوشة — كل تقديماتنا في مكان واحد.",
  path: "/offerings",
  keywords: [
    "قهوة عربية",
    "شاي فاخر",
    "تمور فاخرة",
    "معمول",
    "دلال ذهبية",
    "أدوات تقديم القهوة",
  ],
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "الرئيسية", url: SITE_URL },
  { name: "تقديماتنا", url: `${SITE_URL}/offerings` },
]);

const serviceSchema = generateServiceSchema({
  name: "تقديمات أصول الضيافة",
  description: "قهوة عربية، شاي، تمور فاخرة، حلويات، وأدوات تقديم ذهبية",
  url: `${SITE_URL}/offerings`,
});

const webPageSchema = generateWebPageSchema({
  name: "تقديماتنا - أصول الضيافة",
  description: "تشكيلة تقديمات أصول الضيافة الفاخرة من قهوة وتمر وأدوات تقديم",
  url: `${SITE_URL}/offerings`,
});

export default function OfferingsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(webPageSchema) }} />
      <OfferingsClient />
    </>
  );
}
