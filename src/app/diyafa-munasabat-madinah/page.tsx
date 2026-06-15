import { Metadata } from "next";
import LocalServicePage from "@/components/LocalServicePage";
import { getLocalContent } from "@/lib/localContent";
import { generatePageMetadata } from "@/components/SEO";
import {
  generateBreadcrumbSchema,
  generateServiceSchema,
  generateFAQSchema,
  generateWebPageSchema,
  jsonLd,
} from "@/lib/schema";
import { CITIES } from "@/lib/localPages";
import { SITE_URL } from "@/lib/constants";

const SERVICE = "diyafa-munasabat";
const CITY = "madinah";
const PATH = "/diyafa-munasabat-madinah";

const data = getLocalContent(SERVICE, CITY);
const cityInfo = CITIES[CITY];

export const metadata: Metadata = generatePageMetadata({
  title: data.metaTitle,
  description: data.metaDescription,
  path: PATH,
  keywords: [
    `${data.page.serviceAr} ${cityInfo.ar}`,
    `قهوجي ${cityInfo.ar}`,
    `قهوجيين ${cityInfo.ar}`,
    `مباشرين ${cityInfo.ar}`,
    `ضيافة ${cityInfo.ar}`,
    `صبابات قهوة ${cityInfo.ar}`,
    `أفضل ${data.page.serviceAr} في ${cityInfo.ar}`,
  ],
});

const breadcrumbSchema = generateBreadcrumbSchema(
  data.page.breadcrumbItems.map((b) => ({ name: b.label, url: `${SITE_URL}${b.href}` }))
);
const serviceSchema = generateServiceSchema({
  name: `${data.page.serviceAr} في ${cityInfo.ar}`,
  description: data.metaDescription,
  url: `${SITE_URL}${PATH}`,
  cityAr: cityInfo.ar,
  serviceType: data.page.serviceAr,
});
const faqSchema = generateFAQSchema(data.faqs);
const webPageSchema = generateWebPageSchema({
  name: data.metaTitle,
  description: data.metaDescription,
  url: `${SITE_URL}${PATH}`,
});

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(serviceSchema) }} />      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(webPageSchema) }} />
      <LocalServicePage {...data.page} />
    </>
  );
}
