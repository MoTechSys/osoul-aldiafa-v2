/**
 * مكوّن مشترك لصفحات الخدمات المحلية (خدمة × مدينة).
 *
 * D6.1 — بنية الأقسام المتغيّرة:
 * الصفحة لم تعد قالبًا ثابتًا؛ الهيرو ثابت (H1 + مقدمة + CTA) وما بعده
 * مصفوفة `blocks` مرتّبة بحرّية لكل مدينة (أنواع الكتل في `local/blocks.tsx`).
 * هذا يسمح لـ D3 بإسقاط/إعادة ترتيب/إضافة أقسام لكل مدينة لكسر تشابه القالب.
 *
 * التوافق الخلفي: تمرير الحقول القديمة (sections/districts/packages/…) يبني
 * نفس التسلسل القديم حرفيًا عبر `legacyBlocks()` — صفر تغيير بصري للصفحات
 * القائمة حتى يعيد D3 كتابتها كتلة-كتلة.
 *
 * Server Component: لا "use client" — كل المحتوى يُعرض في SSR (مرئي لـ Googlebot).
 * العنوان H1 يُعرض فورًا (فوق الطية، بلا حركة) لضمان ظهوره للمستخدم والزواحف.
 * ❌ R3: كتلة الأحياء نصّ داخل الصفحة فقط — لا صفحات أحياء.
 */

import Image from "next/image";
import { Button } from "@/components/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { whatsappUrl, WHATSAPP_DISPLAY } from "@/lib/constants";
import { RenderBlock, type LocalPageBlock, type Package, type FAQ } from "@/components/local/blocks";

export type { LocalPageBlock, Package, FAQ };

export interface LocalServicePageProps {
  h1: string;
  cityAr: string;
  serviceAr: string;
  intro: string; // فقرة المقدمة (تحوي الكلمة المفتاحية في أول 100 كلمة)
  heroImage: string;
  heroAlt: string;
  breadcrumbItems: { label: string; href: string }[];

  /**
   * حزمة AEO (2026-08-29): إجابة مباشرة 40–60 كلمة على سؤال نية الصفحة،
   * تُعرض أول المحتوى بعد الهيرو داخل عنصر اقتباس دلالي — الموضع الذي
   * تلتقطه محركات الإجابة (LLMs) للاستشهاد. لا أرقام غير موثّقة (R9).
   */
  directAnswer?: string;

  /** D6.1: الأقسام المتغيّرة — عند تمريرها تُعرض هي وحدها بعد الهيرو. */
  blocks?: LocalPageBlock[];

  /** الحقول القديمة — تُحوَّل إلى كتل بنفس الترتيب القديم إن لم تُمرَّر blocks. */
  sections?: { h2: string; body: string; img?: string; imgAlt?: string }[];
  extraSections?: { h2: string; body: string }[];
  districts?: string[];
  packages?: Package[];
  pricingNote?: string;
  whyUs?: string[];
  faqs?: FAQ[];
  gallery?: { src: string; alt: string }[];
  otherCities?: { label: string; href: string }[];
}

/** يبني تسلسل الكتل المطابق حرفيًا للقالب القديم (توافق خلفي). */
function legacyBlocks(props: LocalServicePageProps, wa: string): LocalPageBlock[] {
  const blocks: LocalPageBlock[] = [];

  for (const [i, s] of (props.sections ?? []).entries()) {
    blocks.push({ type: "imageProse", h2: s.h2, body: s.body, img: s.img, imgAlt: s.imgAlt, flip: i % 2 === 1 });
  }
  for (const s of props.extraSections ?? []) {
    blocks.push({ type: "prose", h2: s.h2, body: s.body });
  }
  if (props.districts?.length) {
    blocks.push({
      type: "chips",
      h2: `الأحياء والمناطق التي نخدمها في ${props.cityAr}`,
      lead: `نصل إليك أينما كنت في ${props.cityAr} وما حولها، ومن أبرز المناطق التي نخدمها:`,
      items: props.districts,
    });
  }
  if (props.packages?.length) {
    blocks.push({
      type: "packages",
      h2: `باقات ${props.serviceAr} في ${props.cityAr}`,
      packages: props.packages,
      note: props.pricingNote,
    });
  }
  if (props.whyUs?.length) {
    blocks.push({ type: "bullets", h2: `لماذا تختار أصول الضيافة في ${props.cityAr}؟`, items: props.whyUs });
  }
  if (props.gallery?.length) {
    blocks.push({ type: "gallery", h2: "من أعمالنا", images: props.gallery });
  }
  if (props.faqs?.length) {
    blocks.push({ type: "faq", h2: `أسئلة شائعة عن ${props.serviceAr} في ${props.cityAr}`, faqs: props.faqs });
  }
  blocks.push({
    type: "links",
    h2: "نخدم أيضًا في مدن أخرى",
    links: [
      ...(props.otherCities ?? []),
      { label: "جميع خدماتنا", href: "/services" },
      { label: "تواصل معنا", href: "/contact" },
    ],
  });
  blocks.push({
    type: "cta",
    h2: `جاهزون لخدمة مناسبتك في ${props.cityAr}`,
    body: `تواصل معنا الآن لحجز ${props.serviceAr} واحصل على استشارة مجانية وعرض سعر مخصّص لمناسبتك.`,
    buttonLabel: "احجز الآن عبر واتساب",
    href: wa,
  });
  return blocks;
}

export default function LocalServicePage(props: LocalServicePageProps) {
  const wa = whatsappUrl(
    `مرحباً، أرغب بالاستفسار عن خدمة ${props.serviceAr} في ${props.cityAr}.`
  );

  const blocks = props.blocks ?? legacyBlocks(props, wa);

  return (
    <main className="bg-onyx text-pearl" dir="rtl">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={props.heroImage}
            alt={props.heroAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/65" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto py-12 sm:py-20">
          <div className="mb-4">
            <Breadcrumbs items={props.breadcrumbItems} />
          </div>
          {/* Hero H1 renders immediately (above the fold, no animation) so it is
              never transparent to users or crawlers. */}
          <h1 className="gold-text font-amiri text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-5">
            {props.h1}
          </h1>
          <p className="text-pearl/85 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            {props.intro}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Button href={wa}>احجز عبر واتساب</Button>
            <Button href={`tel:+966${WHATSAPP_DISPLAY.replace(/^0/, "")}`} variant="outline">
              اتصل: {WHATSAPP_DISPLAY}
            </Button>
          </div>
        </div>
      </section>

      {/* الأقسام المتغيّرة (D6.1) */}
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
        {/* AEO: الإجابة المباشرة — أول عنصر محتوى بعد الهيرو، قابلة للاقتباس */}
        {props.directAnswer ? (
          <section aria-label="الإجابة المباشرة" className="max-w-3xl mx-auto">
            <p
              className="border-r-2 pr-5 text-pearl/90 text-base sm:text-lg leading-loose"
              style={{ borderColor: "rgba(197,160,89,0.6)" }}
            >
              {props.directAnswer}
            </p>
          </section>
        ) : null}
        {blocks.map((b, i) => (
          <RenderBlock key={i} block={b} />
        ))}
      </div>
    </main>
  );
}
