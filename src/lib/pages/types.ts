/**
 * سجل الصفحات الفرعية الموحّد — أصول الضيافة v3.
 *
 * كل صفحة فرعية جديدة = مدخل واحد في `PAGES` (src/lib/pages/registry.ts).
 * المسار `/[page]` يقرأ السجل، يبني الميتا والـschema، ويعرض المحتوى عبر
 * `LocalServicePage` — أي: **نفس التصميم الأول حرفيًا**، لا قالب جديد.
 *
 * قواعد ملزمة مطبّقة في هذا النوع:
 *  - N1: لا حقل «حي» ولا مفتاح يبني صفحة من اسم حي. الأحياء نصّ داخل الصفحة فقط.
 *  - N8: لا LocalBusiness ولا address — الـschema من نوع Service/WebPage.
 *  - N9: كلمة «فرع» ممنوعة في كل النصوص.
 *  - N11: لا أرقام إثبات غير موثّقة.
 *  - H6: كل مدخل يجب أن يحمل محتوى فريدًا كافيًا (يقيسه سكربت التشابه).
 */

import type { LocalPageBlock } from "@/components/local/blocks";

/** تصنيف الصفحة — يحدد الأولوية في sitemap وشكل الربط الداخلي. */
export type PageKind =
  /** صفحة خدمة × مدينة عميقة (جدة، ينبع…) */
  | "city"
  /** صفحة خدمة وطنية بلا مدينة (أسعار، نسائية، عزاء…) */
  | "service"
  /** صفحة دليل/محور تجمع صفحات أخرى */
  | "guide";

export type SubPage = {
  /** المسار بعد الجذر بلا شرطة مائلة: "qahwajiin-jeddah" */
  slug: string;
  kind: PageKind;

  // ── SEO (TT1–TT7, MD1–MD5, H1–H7) ──
  /** ≤ 60 حرفًا مرئيًا قبل اسم الموقع */
  metaTitle: string;
  /** 140–160 حرفًا، يحمل الكلمة المستهدفة ودعوة واضحة */
  metaDescription: string;
  /** H1 واحد فقط، مختلف عن metaTitle */
  h1: string;
  keywords: string[];

  // ── الهيرو (نفس تصميم الصفحة الأولى) ──
  intro: string;
  heroImage: string;
  heroAlt: string;

  // ── فتات الخبز ──
  breadcrumb: { label: string; href: string }[];

  // ── المحتوى ──
  blocks: LocalPageBlock[];

  /** اسم المدينة العربي — للـschema (serviceArea) فقط، لا address. */
  cityAr?: string;
  /** اسم الخدمة العربي — يستخدم في الـschema وأزرار الهيرو. */
  serviceAr: string;

  /** أولوية sitemap؛ الافتراضي يُشتق من kind. */
  priority?: number;
};

export const PRIORITY_BY_KIND: Record<PageKind, number> = {
  city: 0.9,
  service: 0.85,
  guide: 0.8,
};
