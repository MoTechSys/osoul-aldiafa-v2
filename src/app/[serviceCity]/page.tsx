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
import { SUB_PAGE_SLUGS, getSubPage, subPageFaqs } from "@/lib/pages/registry";

/**
 * Dynamic landing page — يخدم مصدرين للمحتوى بنفس المسار الجذري:
 *  1) الصفحات القديمة (service × city) من LOCAL_PAGES — نفس الروابط ونفس المخرج.
 *  2) سجل الصفحات الفرعية الجديد SUB_PAGES (جدة، ينبع، …).
 * سبب الدمج: Next.js لا يسمح بقطعتين ديناميكيتين على نفس المستوى، فلا يمكن
 * إنشاء `/[page]` بجانب `/[serviceCity]`.
 * كلا المصدرين يُعرضان عبر LocalServicePage → **نفس التصميم الأول بلا تغيير**.
 */

export function generateStaticParams(): { serviceCity: string }[] {
  return [
    ...LOCAL_PAGES.map((p) => ({ serviceCity: localSlug(p.service, p.city) })),
    ...SUB_PAGE_SLUGS.map((slug) => ({ serviceCity: slug })),
  ];
}

// Only the slugs from generateStaticParams are valid; any other slug → 404
// (proper status code, not a soft 200 not-found page).
export const dynamicParams = false;

type Props = { params: Promise<{ serviceCity: string }> };

function parseSlug(slug: string): { service: string; city: string } | null {
  const entry = LOCAL_PAGES.find((p) => localSlug(p.service, p.city) === slug);
  return entry ? { service: entry.service, city: entry.city } : null;
}

const NOT_FOUND_META: Metadata = {
  title: "غير موجود",
  robots: { index: false, follow: false },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serviceCity } = await params;

  // ── المصدر الجديد: سجل الصفحات الفرعية ──
  const sub = getSubPage(serviceCity);
  if (sub) {
    return generatePageMetadata({
      title: sub.metaTitle,
      description: sub.metaDescription,
      path: `/${serviceCity}`,
      keywords: sub.keywords,
    });
  }

  // ── المصدر القديم: service × city ──
  const parsed = parseSlug(serviceCity);
  if (!parsed) return NOT_FOUND_META;
  const data = getLocalContent(parsed.service, parsed.city);
  const cityInfo = CITIES[parsed.city];
  if (!cityInfo) return NOT_FOUND_META;

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
  const url = `${SITE_URL}/${serviceCity}`;

  // ── المصدر الجديد: سجل الصفحات الفرعية ──
  const sub = getSubPage(serviceCity);
  if (sub) {
    const breadcrumbSchema = generateBreadcrumbSchema(
      sub.breadcrumb.map((b) => ({ name: b.label, url: `${SITE_URL}${b.href}` }))
    );
    const serviceSchema = generateServiceSchema({
      name: sub.h1,
      description: sub.metaDescription,
      url,
      cityAr: sub.cityAr,
      serviceType: sub.serviceAr,
    });
    const faqs = subPageFaqs(sub);
    const webPageSchema = generateWebPageSchema({
      name: sub.metaTitle,
      description: sub.metaDescription,
      url,
    });

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(serviceSchema) }} />
        {faqs.length > 0 ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(generateFAQSchema(faqs)) }} />
        ) : null}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(webPageSchema) }} />
        <LocalServicePage
          h1={sub.h1}
          cityAr={sub.cityAr ?? "السعودية"}
          serviceAr={sub.serviceAr}
          intro={sub.intro}
          heroImage={sub.heroImage}
          heroAlt={sub.heroAlt}
          breadcrumbItems={sub.breadcrumb}
          blocks={sub.blocks}
        />
      </>
    );
  }

  // ── المصدر القديم: service × city ──
  const parsed = parseSlug(serviceCity);
  if (!parsed) {
    notFound();
  }

  const data = getLocalContent(parsed.service, parsed.city);
  const cityInfo = CITIES[parsed.city];
  if (!cityInfo) {
    notFound();
  }

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
