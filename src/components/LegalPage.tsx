"use client";

/**
 * LegalPage — قالب موحّد للصفحات القانونية (الخصوصية، الشروط).
 *
 * لماذا مكوّن مشترك؟ لأن الصفحتين متطابقتان في البنية البصرية ومختلفتان
 * في المحتوى فقط. هذا يضمن أن أي تحسين في التصميم يسري عليهما معًا،
 * ويمنع الانحراف البصري عن التصميم الأول.
 *
 * ⚠️ التصميم: يتبع التصميم الأول حرفيًا — نفس الهيرو، نفس بطاقات
 * card-royal، نفس الحدود الذهبية، نفس الخطوط (Amiri للعناوين).
 * لا يُدخل أي عنصر من تصاميم أخرى.
 *
 * ⚠️ الوصولية: العناوين متتالية منطقيًا (h1 واحد ثم h2 لكل قسم)،
 * وقائمة المحتويات مبنية على روابط مرساة حقيقية لا على JS.
 */

import Link from "next/link";
import { motion } from "motion/react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EMAIL, WHATSAPP_DISPLAY, whatsappUrl } from "@/lib/constants";

export type LegalSection = {
  /** مُعرّف الفقرة — يُستخدم للربط المرساة (#id) ويجب أن يكون فريدًا */
  id: string;
  /** عنوان القسم (h2) */
  title: string;
  /** فقرات نصية */
  paragraphs?: string[];
  /** نقاط تفصيلية */
  bullets?: string[];
};

export function LegalPage({
  eyebrow,
  title,
  intro,
  updated,
  sections,
  breadcrumb,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  /** تاريخ آخر تحديث — يُكتب يدويًا ويُحدَّث عند أي تعديل جوهري */
  updated: string;
  sections: LegalSection[];
  breadcrumb: { label: string; href: string };
}) {
  return (
    <div className="min-h-screen bg-noir">
      <Breadcrumbs
        items={[
          { label: "الرئيسية", href: "/" },
          { label: breadcrumb.label, href: breadcrumb.href },
        ]}
      />

      {/* ── الهيرو ── */}
      <section className="pt-10 pb-10 px-4 text-center">
        <motion.div
          initial={{ opacity: 1, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto"
        >
          <p
            className="text-gold-bright mb-3"
            style={{ fontSize: "0.75rem", letterSpacing: "0.4em" }}
          >
            ✦ {eyebrow} ✦
          </p>
          <h1
            className="gold-text font-amiri"
            style={{
              fontSize: "clamp(1.6rem, 5vw, 2.6rem)",
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {title}
          </h1>
          <div className="ornament-line mt-5 mx-auto" style={{ width: 110 }} />
          <p className="text-pearl/80 text-sm sm:text-base leading-relaxed mt-6">
            {intro}
          </p>
          <p className="text-pearl/55 text-xs mt-5">
            آخر تحديث لهذه الصفحة: {updated}
          </p>
        </motion.div>
      </section>

      {/* ── فهرس المحتويات — روابط مرساة حقيقية (تعمل بلا JS) ── */}
      <nav aria-label="محتويات الصفحة" className="px-4 pb-10">
        <div className="max-w-3xl mx-auto">
          <div
            className="card-royal p-5 sm:p-6"
            style={{ border: "1px solid rgba(212,175,55,0.18)" }}
          >
            <h2
              className="text-gold-bright font-amiri mb-4"
              style={{ fontSize: "1rem", fontWeight: 700 }}
            >
              محتويات الصفحة
            </h2>
            <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
              {sections.map((s, i) => (
                <li key={s.id} className="flex items-start gap-2">
                  <span className="text-gold/70 text-xs mt-1 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <a
                    href={`#${s.id}`}
                    className="text-pearl/80 text-sm hover:text-gold-bright transition-colors duration-200 min-h-[32px] flex items-center"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </nav>

      {/* ── الأقسام ── */}
      <div className="px-4 pb-16">
        <div className="max-w-3xl mx-auto flex flex-col gap-5">
          {sections.map((s, i) => (
            <motion.section
              key={s.id}
              id={s.id}
              initial={{ opacity: 1, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.55,
                delay: Math.min(i * 0.04, 0.2),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="card-royal p-6 sm:p-8 scroll-mt-28"
              style={{ border: "1px solid rgba(212,175,55,0.15)" }}
            >
              <div className="flex items-start gap-3 mb-4">
                <span
                  className="shrink-0 px-2.5 py-1 rounded-full text-[10px] tracking-widest text-gold-bright"
                  style={{
                    background: "rgba(10,10,10,0.7)",
                    border: "1px solid rgba(212,175,55,0.3)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2
                  className="text-pearl font-amiri"
                  style={{ fontSize: "clamp(1.05rem, 2.6vw, 1.3rem)", fontWeight: 700 }}
                >
                  {s.title}
                </h2>
              </div>

              {s.paragraphs?.map((p, j) => (
                <p
                  key={j}
                  className="text-pearl/78 text-sm leading-[1.9] mb-3 last:mb-0"
                >
                  {p}
                </p>
              ))}

              {s.bullets && s.bullets.length > 0 && (
                <ul className="mt-4 flex flex-col gap-2.5">
                  {s.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0"
                        style={{ boxShadow: "0 0 8px rgba(197,160,89,0.8)" }}
                        aria-hidden
                      />
                      <span className="text-pearl/78 text-sm leading-[1.85]">
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.section>
          ))}
        </div>
      </div>

      {/* ── تواصل: أي استفسار قانوني ── */}
      <section className="px-4 pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="card-royal p-7 sm:p-9"
            style={{ border: "1px solid rgba(212,175,55,0.22)" }}
          >
            <h2
              className="gold-text font-amiri mb-3"
              style={{ fontSize: "clamp(1.1rem, 3vw, 1.5rem)", fontWeight: 700 }}
            >
              عندك سؤال عن هذه الصفحة؟
            </h2>
            <p className="text-pearl/75 text-sm leading-relaxed mb-6 max-w-xl mx-auto">
              أي استفسار عن بياناتك أو عن شروط التعامل معنا — راسلنا مباشرة
              وسنجيبك بوضوح. حقّك أن تعرف قبل أن تلتزم.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3">
              <Link
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="gold-button px-7 py-3.5 rounded-full text-sm tracking-wide"
              >
                واتساب {WHATSAPP_DISPLAY}
              </Link>
              <a
                href={`mailto:${EMAIL}`}
                className="ghost-button px-7 py-3.5 rounded-full text-sm tracking-wide"
              >
                {EMAIL}
              </a>
            </div>
            <div className="mt-7 pt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2" style={{ borderTop: "1px solid rgba(212,175,55,0.12)" }}>
              {[
                { label: "سياسة الخصوصية", href: "/privacy" },
                { label: "الشروط والأحكام", href: "/terms" },
                { label: "تواصل معنا", href: "/contact" },
                { label: "من نحن", href: "/about" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-pearl/70 text-xs px-3 py-2 rounded-full hover:text-gold-bright transition-colors"
                  style={{
                    background: "rgba(212,175,55,0.06)",
                    border: "1px solid rgba(212,175,55,0.12)",
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
