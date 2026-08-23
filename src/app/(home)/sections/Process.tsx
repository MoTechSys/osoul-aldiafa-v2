"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui";
import { SectionLabel, SectionTitle } from "./primitives";

const steps = [
  { n: "١", t: "تواصل", d: "اطلب عبر واتساب أو ابعث استفسارك." },
  { n: "٢", t: "تصميم الباقة", d: "نقترح أعداد الصبّابين والتقديمات والديكور." },
  { n: "٣", t: "تجهيز الموقع", d: "نصل قبل المناسبة بوقت كافٍ لتجهيز الركن." },
  { n: "٤", t: "ضيافة لا تُنسى", d: "نقدّم تجربة ضيافة مدروسة من البداية للنهاية." },
];

// م-٦ (٢٢ أغسطس ٢٠٢٦) — حُذف قسم «آراء ضيوفنا» بالكامل، ومعه مصفوفة
// testimonials التي كانت تحمل ثلاثة أسماء مُختلَقة («أ. خالد الحربي»،
// «م. سارة القحطاني»، «أ. عبدالله الزهراني») بتقييم خمس نجوم لكلٍّ منها.
//
// السبب ليس جماليًا بل مخالفة صريحة لسياسة جوجل المنشورة. النص الحرفي من
// Review snippet — Technical guidelines:
//   «Don't include fake or undisclosed incentivized reviews on your page
//    or in your structured data markup. Examples include: Reviews that
//    aren't based on a genuine experience of a product or service.»
// المصدر: developers.google.com/search/docs/appearance/structured-data/review-snippet
//
// لاحظ عبارة «on your page OR in your structured data» — فإزالة
// aggregateRating من الـ Schema سابقًا لم تُعالج المخالفة، لأن النصوص
// المرئية نفسها كانت لا تزال منشورة على الإنتاج (قِيس في ٢٢ أغسطس:
//   curl -s https://asoulaldiafa.com/ | grep -c "خالد الحربي"  →  1).
//
// وسياسة المراجعات للأنشطة المحلية أشدّ: «If the entity that's being
// reviewed controls the reviews about itself … their pages … are
// ineligible for star review feature» — أي أن آراءً يكتبها الموقع عن
// نفسه لا تكسب نجومًا في نتائج البحث أصلًا، فالمخالفة كانت بلا مقابل.
//
// البديل ليس الحذف الدائم: تُعرَض على المالك ثلاثة مسارات لآراء حقيقية
// موثّقة في docs/01-status/02-قرارات-معلّقة.md (أقواها ربط ملف النشاط
// التجاري في جوجل، لأنه يجعل جوجل نفسها هي مصدر الرأي لا نحن).
//
// وبقاء الملف باسم Process.tsx: القسم الوحيد الباقي فيه هو «رحلة الحجز».

export function Process() {
  return (
    <section className="py-14 sm:py-24 px-4 relative overflow-hidden aurora-section" style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #050505 100%)" }}>
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionLabel label="رحلة الحجز" />
        <SectionTitle>أربع خطوات نجمع فيها أصول الضيافة</SectionTitle>
        <div className="ornament-line mt-5 mx-auto" style={{ width: 110 }} />

        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.97 }}
            >
              {/* الحشوة على غلاف داخلي لا على Card نفسها: غلاف Card الداخلي (div.relative)
                  هو مرجع تموضع الشارة، فلو بقيت الحشوة على Card لانزاحت الشارة تحتها وتداخلت مع النص */}
              <Card className="h-full">
                <span
                  className="absolute top-4 left-5 sm:left-6 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-amiri text-noir"
                  style={{ background: "var(--gradient-royal)", fontSize: "1.3rem", fontWeight: 700, boxShadow: "0 6px 18px rgba(212,175,55,0.35)" }}
                >
                  {s.n}
                </span>
                <div className="pt-16 px-5 pb-6 sm:pt-20 sm:px-7 sm:pb-7">
                  <h3 className="font-amiri text-pearl mb-2" style={{ fontSize: "clamp(1rem, 3.5vw, 1.1rem)", fontWeight: 700 }}>{s.t}</h3>
                  <p className="text-pearl/75 text-xs sm:text-sm leading-relaxed">{s.d}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Final CTA
// ─────────────────────────────────────────────────────────────
