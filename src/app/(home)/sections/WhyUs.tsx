"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui";
import { SectionLabel, SectionTitle } from "./primitives";

const whyTiles = [
  {
    title: "خبرة منذ 2017",
    desc: "سبع سنوات نضع فيها معايير ضيافة لا تخذل ضيوفك أبداً.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
  {
    title: "فريق بزيٍّ تراثي",
    desc: "صبّابون ومباشرون بزي سعودي مطرّز، يقدمون القهوة على الأصول.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    title: "أدوات ذهبية فاخرة",
    desc: "دلال وصواني وفناجين بتطعيمات ذهبية وحضور بصري لا يُنسى.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
      </svg>
    ),
  },
  {
    // كان النص «تغطية مكة والمدينة» فقط، فكان يبدو متناقضًا مع رقم
    // «١٣ منطقة» في قسم الأرقام على بُعد نصف شاشة منه. أمر المالك:
    // يُذكر اسم جدة وينبع صراحةً — وهما أهم مدينتين للطلب.
    title: "تغطية جدة وينبع والمدينة",
    desc: "طاقمنا وعدّتنا يتنقلون إلى جدة وينبع والمدينة المنورة وبدر، ونصل لبقية مناطق المملكة بالتنسيق المسبق.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
];

export function WhyUs() {
  return (
    <section className="relative py-14 sm:py-24 px-4 bg-noir overflow-hidden aurora-section">
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionLabel label="لماذا أصول الضيافة" />
        <SectionTitle>تفاصيلٌ تُصنع منها التجارب الفاخرة</SectionTitle>
        <div className="ornament-line mt-5 mx-auto" style={{ width: 110 }} />

        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {whyTiles.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.97, y: -4 }}
            >
              <Card className="p-5 sm:p-7 h-full group flex flex-col items-center text-center sm:items-start sm:text-right">
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-gold mb-4 sm:mb-6 transition-all duration-500"
                style={{ background: "rgba(212,175,55,0.12)" }}
              >
                {t.icon}
              </div>
              <h3 className="font-amiri text-pearl mb-2 sm:mb-3" style={{ fontSize: "clamp(0.95rem, 3.5vw, 1.15rem)", fontWeight: 700 }}>{t.title}</h3>
              <p className="text-pearl/75 text-xs sm:text-sm leading-relaxed">{t.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Stats — animated CountUp metrics (mobile-first, touch-safe)
// ─────────────────────────────────────────────────────────────
