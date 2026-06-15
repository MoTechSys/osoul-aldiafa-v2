/**
 * مكوّن مشترك لصفحات الخدمات المحلية (خدمة × مدينة).
 * يعرض محتوى عربي غني (H1 + H2s + باقات + أحياء + لماذا نحن + أسعار + FAQ + CTA)
 * بالهوية البصرية للموقع (gold-text / font-amiri / card-royal).
 *
 * Server Component: لا "use client" — كل المحتوى يُعرض في SSR (مرئي لـ Googlebot).
 * الحركة معزولة في leaf مكوّن RevealOnScroll ('use client').
 */

import Image from "next/image";
import Link from "next/link";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { whatsappUrl, WHATSAPP_DISPLAY } from "@/lib/constants";

export type Package = { name: string; desc: string; features: string[] };
export type FAQ = { question: string; answer: string };

export interface LocalServicePageProps {
  h1: string;
  cityAr: string;
  serviceAr: string;
  intro: string; // فقرة المقدمة (تحوي الكلمة المفتاحية في أول 100 كلمة)
  heroImage: string;
  heroAlt: string;
  sections: { h2: string; body: string; img?: string; imgAlt?: string }[];
  extraSections?: { h2: string; body: string }[];
  districts: string[];
  packages: Package[];
  pricingNote: string;
  whyUs: string[];
  faqs: FAQ[];
  gallery: { src: string; alt: string }[];
  otherCities: { label: string; href: string }[];
  breadcrumbItems: { label: string; href: string }[];
}

export default function LocalServicePage(props: LocalServicePageProps) {
  const wa = whatsappUrl(
    `مرحباً، أرغب بالاستفسار عن خدمة ${props.serviceAr} في ${props.cityAr}.`
  );

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
          <RevealOnScroll
            as="h1"
            className="gold-text font-amiri text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-5"
          >
            {props.h1}
          </RevealOnScroll>
          <p className="text-pearl/85 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            {props.intro}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3 rounded-full bg-gold text-onyx font-bold hover:brightness-110 transition"
            >
              احجز عبر واتساب
            </a>
            <a
              href={`tel:+966${WHATSAPP_DISPLAY.replace(/^0/, "")}`}
              className="px-7 py-3 rounded-full border border-gold/40 text-pearl hover:bg-gold/10 transition"
            >
              اتصل: {WHATSAPP_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      {/* Sections (H2s) */}
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
        {props.sections.map((s, i) => (
          <section key={i} className="grid md:grid-cols-2 gap-8 items-center">
            <div className={i % 2 === 1 ? "md:order-2" : ""}>
              <h2 className="text-gold-bright font-amiri text-2xl sm:text-3xl font-bold mb-4">
                {s.h2}
              </h2>
              <p className="text-pearl/80 leading-loose whitespace-pre-line">
                {s.body}
              </p>
            </div>
            {s.img && (
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden card-royal">
                <Image
                  src={s.img}
                  alt={s.imgAlt || s.h2}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            )}
          </section>
        ))}

        {/* أقسام نصية إضافية (تعميق المحتوى) */}
        {props.extraSections?.map((s, i) => (
          <section key={`extra-${i}`}>
            <h2 className="text-gold-bright font-amiri text-2xl sm:text-3xl font-bold mb-4">
              {s.h2}
            </h2>
            <p className="text-pearl/80 leading-loose whitespace-pre-line">
              {s.body}
            </p>
          </section>
        ))}

        {/* الأحياء */}
        <section>
          <h2 className="text-gold-bright font-amiri text-2xl sm:text-3xl font-bold mb-4">
            الأحياء والمناطق التي نخدمها في {props.cityAr}
          </h2>
          <p className="text-pearl/80 leading-loose mb-4">
            نصل إليك أينما كنت في {props.cityAr} وما حولها، ومن أبرز المناطق التي
            نخدمها:
          </p>
          <div className="flex flex-wrap gap-2">
            {props.districts.map((d) => (
              <span
                key={d}
                className="px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-pearl/85 text-sm"
              >
                {d}
              </span>
            ))}
          </div>
        </section>

        {/* الباقات */}
        <section>
          <h2 className="text-gold-bright font-amiri text-2xl sm:text-3xl font-bold mb-6">
            باقات {props.serviceAr} في {props.cityAr}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {props.packages.map((p) => (
              <div key={p.name} className="card-royal rounded-2xl p-6">
                <h3 className="text-pearl font-amiri text-xl font-bold mb-2">
                  {p.name}
                </h3>
                <p className="text-pearl/70 text-sm mb-4 leading-relaxed">
                  {p.desc}
                </p>
                <ul className="space-y-2">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-pearl/80 text-sm"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-pearl/60 text-sm mt-6 leading-relaxed">
            {props.pricingNote}
          </p>
        </section>

        {/* لماذا نحن */}
        <section>
          <h2 className="text-gold-bright font-amiri text-2xl sm:text-3xl font-bold mb-4">
            لماذا تختار أصول الضيافة في {props.cityAr}؟
          </h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {props.whyUs.map((w) => (
              <li
                key={w}
                className="flex items-start gap-2 text-pearl/80 leading-relaxed"
              >
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                {w}
              </li>
            ))}
          </ul>
        </section>

        {/* المعرض */}
        {props.gallery.length > 0 && (
          <section>
            <h2 className="text-gold-bright font-amiri text-2xl sm:text-3xl font-bold mb-6">
              من أعمالنا
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {props.gallery.map((g, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-xl overflow-hidden card-royal"
                >
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section>
          <h2 className="text-gold-bright font-amiri text-2xl sm:text-3xl font-bold mb-6">
            أسئلة شائعة عن {props.serviceAr} في {props.cityAr}
          </h2>
          <div className="space-y-3">
            {props.faqs.map((f) => (
              <details
                key={f.question}
                className="card-royal rounded-xl p-5 group"
              >
                <summary className="cursor-pointer text-pearl font-semibold list-none flex items-center justify-between">
                  {f.question}
                  <span className="text-gold group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="text-pearl/75 text-sm leading-relaxed mt-3">
                  {f.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* روابط المدن الأخرى */}
        <section>
          <h2 className="text-gold-bright font-amiri text-2xl sm:text-3xl font-bold mb-4">
            نخدم أيضًا في مدن أخرى
          </h2>
          <div className="flex flex-wrap gap-3">
            {props.otherCities.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="px-4 py-2 rounded-full bg-gold/10 border border-gold/25 text-pearl/85 hover:bg-gold/20 transition text-sm"
              >
                {c.label}
              </Link>
            ))}
            <Link
              href="/services"
              className="px-4 py-2 rounded-full bg-gold/10 border border-gold/25 text-pearl/85 hover:bg-gold/20 transition text-sm"
            >
              جميع خدماتنا
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 rounded-full bg-gold/10 border border-gold/25 text-pearl/85 hover:bg-gold/20 transition text-sm"
            >
              تواصل معنا
            </Link>
          </div>
        </section>

        {/* CTA نهائي */}
        <section className="text-center card-royal rounded-3xl p-10">
          <h2 className="gold-text font-amiri text-2xl sm:text-3xl font-bold mb-3">
            جاهزون لخدمة مناسبتك في {props.cityAr}
          </h2>
          <p className="text-pearl/75 mb-6 max-w-xl mx-auto leading-relaxed">
            تواصل معنا الآن لحجز {props.serviceAr} واحصل على استشارة مجانية وعرض
            سعر مخصّص لمناسبتك.
          </p>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3.5 rounded-full bg-gold text-onyx font-bold hover:brightness-110 transition"
          >
            احجز الآن عبر واتساب
          </a>
        </section>
      </div>
    </main>
  );
}
