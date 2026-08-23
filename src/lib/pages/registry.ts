/**
 * السجل الموحّد للصفحات الفرعية — أصول الضيافة v3.
 *
 * كل صفحة فرعية جديدة تُضاف هنا فقط؛ المسار `/[serviceCity]` يقرأ السجل
 * ويولّد الصفحة ستاتيكيًا عبر generateStaticParams، وsitemap يقرأ نفس السجل.
 * لا ملف راوت جديد لكل صفحة، ولا قالب تصميم جديد: كل شيء يُعرض من خلال
 * `LocalServicePage` — نفس تصميم الصفحة الأولى حرفيًا.
 */

import type { SubPage } from "./types";
import { PRIORITY_BY_KIND } from "./types";
import { JEDDAH_PAGES } from "./jeddah";
import { YANBU_PAGES } from "./yanbu";
import { NATIONAL_PAGES } from "./national";
import { REGION_PAGES } from "./regions";

/**
 * مجموعات السجل — كل مجموعة مربوطة بملف مصدرها، ليقرأ sitemap تاريخ git
 * الصحيح لكل صفحة بدل تخمينه من الـslug.
 */
const GROUPS: { source: string; pages: SubPage[] }[] = [
  { source: "src/lib/pages/jeddah.ts", pages: JEDDAH_PAGES },
  { source: "src/lib/pages/yanbu.ts", pages: YANBU_PAGES },
  { source: "src/lib/pages/national.ts", pages: NATIONAL_PAGES },
  { source: "src/lib/pages/regions.ts", pages: REGION_PAGES },
];

/** كل الصفحات الفرعية المسجّلة. الترتيب لا يؤثر على شيء. */
export const SUB_PAGES: SubPage[] = GROUPS.flatMap((g) => g.pages);

/** ملف المصدر لكل slug — يستخدمه sitemap في حساب lastmod. */
const SOURCE_BY_SLUG: Record<string, string> = GROUPS.reduce<Record<string, string>>(
  (acc, group) => {
    for (const page of group.pages) acc[page.slug] = group.source;
    return acc;
  },
  {}
);

export function subPageSource(slug: string): string | undefined {
  return SOURCE_BY_SLUG[slug];
}

/** خريطة سريعة slug → صفحة. */
const BY_SLUG: Record<string, SubPage> = SUB_PAGES.reduce<Record<string, SubPage>>(
  (acc, page) => {
    if (acc[page.slug]) {
      throw new Error(`[pages/registry] slug مكرر: ${page.slug}`);
    }
    acc[page.slug] = page;
    return acc;
  },
  {}
);

export const SUB_PAGE_SLUGS: string[] = SUB_PAGES.map((p) => p.slug);

export function getSubPage(slug: string): SubPage | null {
  return BY_SLUG[slug] ?? null;
}

/** أولوية sitemap — من الصفحة نفسها أو مشتقّة من نوعها. */
export function subPagePriority(page: SubPage): number {
  return page.priority ?? PRIORITY_BY_KIND[page.kind];
}

/** استخراج الأسئلة الشائعة من كتل الصفحة (لبناء FAQ schema). */
export function subPageFaqs(page: SubPage): { question: string; answer: string }[] {
  const block = page.blocks.find((b) => b.type === "faq");
  return block && block.type === "faq" ? block.faqs : [];
}
