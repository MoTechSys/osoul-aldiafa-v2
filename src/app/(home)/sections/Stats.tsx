"use client";

import { motion } from "motion/react";
import CountUp from "@/components/CountUp";
import { Card } from "@/components/ui";
import { SectionLabel, SectionTitle } from "./primitives";

const statItems: {
  to: number;
  suffix?: string;
  prefix?: string;
  label: string;
}[] = [
  // مبدأ R9 (إثبات الأرقام): كل رقم هنا قابل للإثبات من مصدر داخل الموقع
  // نفسه وموثّق في data/proof.json. أُزيلت ثلاثة أرقام لا دليل عليها:
  //  • «1200+ مناسبة» و«99٪ رضا» — المالك لم يؤكدهما (بند ن-٢)، وادّعاء
  //    رضا بلا مراجعات موثّقة يخالف E-E-A-T — وللموقع سابقة موثّقة في
  //    المحتوى المُختلَق (الآراء الوهمية في ق-٤) تجعل التساهل هنا خطرًا.
  //  • «13 منطقة» — كان يناقض JSON-LD الذي يعلن 5 مدن (S15 في خط الأساس):
  //    تناقض إشارة محلية أمام جوجل. المصدر الوحيد: CITIES في localPages.ts.
  { to: 7, suffix: "+", label: "سنوات من الخبرة" },
  { to: 5, suffix: "", label: "مدن نخدمها بانتظام" },
  { to: 6, suffix: "", label: "خدمات ضيافة متكاملة" },
  // ٢٤/٧ تطابق OpeningHoursSpecification في schema.ts (opens 00:00 closes 23:59)
  { to: 24, suffix: "/٧", label: "جاهزية للحجز طوال الأسبوع" },
];

export function Stats() {
  return (
    <section className="relative py-12 sm:py-20 px-4 bg-noir overflow-hidden aurora-section">
      <div className="max-w-6xl mx-auto relative z-10">
        <SectionLabel label="أرقام تتحدث عنّا" />
        <SectionTitle>ثقةٌ تُبنى بالتفاصيل</SectionTitle>
        <div className="ornament-line mt-5 mx-auto" style={{ width: 110 }} />

        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-5">
          {statItems.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 1, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card sheen className="h-full text-center px-4 py-8">
              <div className="gold-text font-amiri leading-none" style={{ fontSize: "clamp(2.2rem, 8vw, 3.2rem)", fontWeight: 700 }}>
                <CountUp
                  to={s.to}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  arabicDigits
                  duration={1.8}
                />
              </div>
              <p className="text-pearl/75 text-sm mt-3 leading-relaxed">{s.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Pillars — 3 visual service pillars with image cards
// ─────────────────────────────────────────────────────────────
