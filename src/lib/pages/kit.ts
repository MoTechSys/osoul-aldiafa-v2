/**
 * أدوات بناء كتل المحتوى — تختصر التكرار التقني (روابط واتساب، فتات الخبز،
 * أشرطة العرض) **دون** أن تولّد نصًا متشابهًا: كل نص يُكتب يدويًا في ملف
 * المدينة/الخدمة. هذه الأدوات لا تنتج فقرات جاهزة أبدًا.
 */

import type { LocalPageBlock } from "@/components/local/blocks";
import { whatsappUrl } from "@/lib/constants";

/** رسالة واتساب مخصّصة لكل بطاقة/صفحة (تظهر جاهزة في محادثة العميل). */
export const wa = (message: string) => whatsappUrl(message);

/** فتات خبز موحّد الشكل — الروابط تختلف لكل صفحة. */
export const crumbs = (
  ...items: { label: string; href: string }[]
): { label: string; href: string }[] => [
  { label: "الرئيسية", href: "/" },
  ...items,
];

type ShowcaseItem = { src: string; caption: string; href?: string };

/**
 * شريط «من أعمالنا» — الصورة الأولى كبيرة والباقي ٢×٢ على الجوال.
 * كل صورة تحمل رابطًا مباشرًا لصفحتها.
 */
export function works(args: {
  h2: string;
  lead?: string;
  items: ShowcaseItem[];
  moreHref?: string;
  moreLabel?: string;
}): LocalPageBlock {
  return {
    type: "showcase",
    label: "من أعمالنا",
    h2: args.h2,
    lead: args.lead,
    items: args.items,
    moreHref: args.moreHref ?? "/portfolio",
    moreLabel: args.moreLabel ?? "شاهد أعمالًا أخرى",
    layout: "feature",
  };
}

/**
 * شريط «من تقديماتنا» — نفس الإيقاع البصري، محتوى مختلف: عناصر الضيافة
 * نفسها لا المناسبات.
 */
export function offerings(args: {
  h2: string;
  lead?: string;
  items: ShowcaseItem[];
  moreHref?: string;
  moreLabel?: string;
  layout?: "feature" | "even";
}): LocalPageBlock {
  return {
    type: "showcase",
    label: "من تقديماتنا",
    h2: args.h2,
    lead: args.lead,
    items: args.items,
    moreHref: args.moreHref ?? "/offerings",
    moreLabel: args.moreLabel ?? "تصفّح كل التقديمات",
    layout: args.layout ?? "feature",
  };
}

type Card = {
  src: string;
  title: string;
  body?: string;
  tag?: string;
  href: string;
  cta?: string;
  waMessage?: string;
};

/** شبكة بطاقات بأزرار انتقال + واتساب. cols: أعمدة الجوال (١ أو ٢). */
export function cards(args: {
  h2: string;
  lead?: string;
  items: Card[];
  cols?: 1 | 2;
  lgCols?: 2 | 3 | 4;
}): LocalPageBlock {
  return {
    type: "linkCards",
    h2: args.h2,
    lead: args.lead,
    cards: args.items,
    cols: args.cols ?? 1,
    lgCols: args.lgCols ?? 3,
  };
}

/** كتلة نص حر. */
export const prose = (h2: string, body: string): LocalPageBlock => ({
  type: "prose",
  h2,
  body,
});

/** كتلة نص + صورة (تبديل الجهة عبر flip). */
export const imageProse = (args: {
  h2: string;
  body: string;
  img: string;
  imgAlt: string;
  flip?: boolean;
}): LocalPageBlock => ({
  type: "imageProse",
  h2: args.h2,
  body: args.body,
  img: args.img,
  imgAlt: args.imgAlt,
  flip: args.flip,
});

/** قائمة نقاط. */
export const bullets = (h2: string, items: string[]): LocalPageBlock => ({
  type: "bullets",
  h2,
  items,
});

/**
 * أسماء أحياء/مواقع كنص داخل الصفحة — ❌ N1: لا تُبنى منها أي صفحة.
 */
export const chips = (h2: string, lead: string, items: string[]): LocalPageBlock => ({
  type: "chips",
  h2,
  lead,
  items,
});

/** مسارات خدمة (ليست باقات سعرية ثابتة). */
export const tracks = (args: {
  h2: string;
  items: { name: string; desc: string; features: string[] }[];
  note?: string;
}): LocalPageBlock => ({
  type: "packages",
  h2: args.h2,
  packages: args.items,
  note:
    args.note ??
    "هذه مسارات لفهم الاحتياج وليست قائمة أسعار ثابتة؛ كل مناسبة تُقدّر على حسبها بعد استلام تفاصيلها.",
});

/** أسئلة شائعة — يجب أن تكون حصرية للصفحة (≥٣ أسئلة لا تصلح لغيرها). */
export const faq = (
  h2: string,
  faqs: { question: string; answer: string }[]
): LocalPageBlock => ({ type: "faq", h2, faqs });

/** روابط داخلية سياقية (L1: ≥٣ روابط داخل المحتوى). */
export const links = (
  h2: string,
  items: { label: string; href: string }[]
): LocalPageBlock => ({ type: "links", h2, links: items });

/** دعوة ختامية بزر واتساب. */
export const cta = (args: {
  h2: string;
  body: string;
  buttonLabel?: string;
  waMessage: string;
}): LocalPageBlock => ({
  type: "cta",
  h2: args.h2,
  body: args.body,
  buttonLabel: args.buttonLabel ?? "أرسل تفاصيل مناسبتك",
  href: wa(args.waMessage),
});
