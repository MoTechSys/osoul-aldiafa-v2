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
  { to: 7, suffix: "+", label: "سنوات من الخبرة" },
  { to: 1200, suffix: "+", label: "مناسبة أُقيمت" },
  // قرار المالك (٢٣ أغسطس): يبقى الرقم ١٣ كما هو. وأُزيل التناقض
  // الظاهر مع «تغطية جدة وينبع والمدينة» في قسم WhyUs بتوضيح أن هذا
  // نطاق الوصول لا مقرّ الفريق — فلا يقرأ الزائر رقمين متضاربين.
  { to: 13, suffix: "", label: "منطقة نصل إليها" },
  { to: 99, suffix: "٪", label: "رضا عملائنا" },
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
              initial={{ opacity: 0.001, y: 26 }}
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
