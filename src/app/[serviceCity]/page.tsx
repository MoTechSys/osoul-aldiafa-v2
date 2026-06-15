import { Metadata } from "next";
import { notFound } from "next/navigation";
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
import { CITIES, LOCAL_PAGES, localSlug } from "@/lib/localPages";
import { SITE_URL } from "@/lib/constants";

/**
 * Dynamic (service × city) landing page. Consolidates the 10 previously
 * duplicated static pages into one file — SAME URLs, SAME SEO output.
 * Only the SERVICE/CITY/PATH constants differed across the old files; here
 * they are derived from the slug. generateStaticParams keeps them static.
 */

export function generateStaticParams(): { serviceCity: string }[] {
  return LOCAL_PAGES.map((p) => ({ serviceCity: localSlug(p.service, p.city) }));
}

// Only the slugs from generateStaticParams are valid; any other slug → 404
// (proper status code, not a soft 200 not-found page).
export const dynamicParams = false;

type Props = { params: Promise<{ serviceCity: string }> };

function parseSlug(slug: string): { service: string; city: string } | null {
  const entry = LOCAL_PAGES.find((p) => localSlug(p.service, p.city) === slug);
  return entry ? { service: entry.service, city: entry.city } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serviceCity } = await params;
  const parsed = parseSlug(serviceCity);
  if (!parsed) {
    return { title: "غير موجود", robots: { index: false, follow: false } };
  }
  const data = getLocalContent(parsed.service, parsed.city);
  const cityInfo = CITIES[parsed.city];
  if (!cityInfo) {
    return { title: "غير موجود", robots: { index: false, follow: false } };
  }

  return generatePageMetadata({
    title: data.metaTitle,
    description: data.metaDescription,
    path: `/${serviceCity}`,
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
}

export default async function Page({ params }: Props) {
  const { serviceCity } = await params;
  const parsed = parseSlug(serviceCity);
  if (!parsed) {
    notFound();
  }

  const data = getLocalContent(parsed.service, parsed.city);
  const cityInfo = CITIES[parsed.city];
  if (!cityInfo) {
    notFound();
  }

  const url = `${SITE_URL}/${serviceCity}`;

  const breadcrumbSchema = generateBreadcrumbSchema(
    data.page.breadcrumbItems.map((b) => ({ name: b.label, url: `${SITE_URL}${b.href}` }))
  );
  const serviceSchema = generateServiceSchema({
    name: `${data.page.serviceAr} في ${cityInfo.ar}`,
    description: data.metaDescription,
    url,
    cityAr: cityInfo.ar,
    serviceType: data.page.serviceAr,
  });
  const faqSchema = generateFAQSchema(data.faqs);
  const webPageSchema = generateWebPageSchema({
    name: data.metaTitle,
    description: data.metaDescription,
    url,
  });

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
