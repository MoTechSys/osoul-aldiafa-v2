import { Metadata } from "next";
import LocalServicePage from "@/components/LocalServicePage";
import { getHubContent } from "@/lib/hubContent";
import { SERVICE_HUBS } from "@/lib/serviceHubs";
import { generatePageMetadata } from "@/components/SEO";
import {
  generateBreadcrumbSchema,
  generateServiceSchema,
  generateFAQSchema,
  generateWebPageSchema,
  jsonLd,
} from "@/lib/schema";
import { SITE_URL } from "@/lib/constants";

const SLUG = "rukn-qahwa-arabiya";
const hub = SERVICE_HUBS[SLUG];
const PATH = `/${SLUG}`;
const data = getHubContent(SLUG);

export const metadata: Metadata = generatePageMetadata({
  title: hub.metaTitle,
  description: hub.metaDescription,
  path: PATH,
  keywords: hub.keywords,
});

const breadcrumbSchema = generateBreadcrumbSchema(
  data.page.breadcrumbItems.map((b) => ({ name: b.label, url: `${SITE_URL}${b.href}` }))
);
const serviceSchema = generateServiceSchema({
  name: hub.ar,
  description: hub.metaDescription,
  url: `${SITE_URL}${PATH}`,
});
const faqSchema = generateFAQSchema(data.faqs);
const webPageSchema = generateWebPageSchema({
  name: hub.metaTitle,
  description: hub.metaDescription,
  url: `${SITE_URL}${PATH}`,
});

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(webPageSchema) }} />
      <LocalServicePage {...data.page} />
    </>
  );
}
