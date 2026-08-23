"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useTransform, useReducedMotion, useMotionValue, useAnimationFrame } from "motion/react";
import { TEAM_IMAGES, PRODUCT_IMAGES, SETUP_IMAGES, imageAlt } from "@/lib/images";

const wrapMarquee = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

export function PhotoMarquee() {
  const strip = [...SETUP_IMAGES, ...TEAM_IMAGES.slice(0, 6), ...PRODUCT_IMAGES.slice(0, 5)];
  const reduceMotion = useReducedMotion();
  // كانت ٤ مجموعات. قياس: الشريط ٢١ صورة، أي ٤×٢١ = ٨٤ عنصر
  // <Image> داخل شريط ارتفاعه ٢١٠ بكسل فقط — ثمن في الـDOM
  // والفكّ والـdecode لا يراه الزائر.
  // لماثا ٣ وليس ٢؟ حساب لا تقدير: عرض المجموعة الواحدة على
  // الجوّال ≈ ٢١×(١٧٦+١٦) ≈ ٤،ذ٣٢ بكسل، وعلى الشاشات العريضة
  // ≈ ٦،٠٢٤ بكسل. مجموعتان = ١٢،٠٤٨ بكسل، وأعرض شاشة شائعة
  // ٥،ȡ٠ بكسل — فالثالثة هامش أمان عند السحب العنيف، والرابعة
  // كانت زيادة بلا مقابل. الوفر: ٢١ عنصر صورة (−٢٥٪).
  const sets = [0, 1, 2];

  const contentRef = useRef<HTMLDivElement>(null);
  const baseX = useMotionValue(0);
  const [contentWidth, setContentWidth] = useState(0);
  const SPEED = 28; // بكسل/ثانية (سرعة اللف التلقائي) — كما هي

  // قياس عرض مجموعة واحدة بدقة (يُعاد بعد تحميل الصور/الخطوط وعند تغيير حجم النافذة)
  useEffect(() => {
    const measure = () => {
      if (contentRef.current) setContentWidth(contentRef.current.getBoundingClientRect().width);
    };
    measure();
    window.addEventListener("resize", measure);
    const timer = setTimeout(measure, 1000);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(timer);
    };
  }, []);

  // اللف اللحظي: في كل إطار وعند كل سحب، الموضع يُطبّع داخل النطاق فلا تظهر نهاية أبداً
  const x = useTransform(baseX, (v) => {
    if (contentWidth === 0) return 0;
    return wrapMarquee(-contentWidth, 0, v);
  });

  // لف تلقائي مستمر يسارًا (يتوقف تلقائيًا عند السحب لأن onPan يحرّك baseX)
  useAnimationFrame((_, delta) => {
    if (reduceMotion || contentWidth === 0) return;
    baseX.set(baseX.get() - (SPEED * delta) / 1000);
  });

  return (
    <section className="relative py-10 overflow-hidden border-y border-gold/15 bg-noir-rich">
      {/* dir=ltr يفصل رياضيات الحركة عن اتجاه الموقع العربي (RTL) */}
      <div dir="ltr" className="overflow-hidden touch-pan-y">
        <motion.div
          className="flex gap-4 will-change-transform w-max cursor-grab active:cursor-grabbing"
          style={{ x }}
          // onPan يحدّث baseX لحظيًا أثناء السحب → اللف يحصل في كل لحظة بلا اختفاء
          onPan={(_e, info) => {
            baseX.set(baseX.get() + info.delta.x);
          }}
        >
          {sets.map((setIndex) => (
            <div
              key={setIndex}
              ref={setIndex === 0 ? contentRef : null}
              className="flex gap-4 shrink-0 items-center"
            >
              {strip.map((src, i) => (
                <div
                  key={`${setIndex}-${i}`}
                  className="relative h-32 sm:h-40 md:h-48 w-44 sm:w-56 md:w-72 flex-shrink-0 rounded-xl overflow-hidden pointer-events-none"
                  style={{ border: "1px solid rgba(212,175,55,0.18)" }}
                >
                  {/* المجموعات المكررة (setIndex>0) مجرد حشو بصري يمنع
                      ظهور فراغ عند اللف؛ فلا حاجة لأن يتنافس تحميلها مع
                      المجموعة الأولى التي يراها الزائر فعلًا. */}
                  <Image
                    src={src}
                    alt={setIndex === 0 ? imageAlt(src) : ""}
                    aria-hidden={setIndex !== 0 ? true : undefined}
                    fill
                    loading="lazy"
                    sizes="(max-width:640px) 176px, 288px"
                    className="object-cover"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir/70 via-transparent to-transparent" />
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// "Why us" — fancier 4-tile grid with hover lift + stagger
// ─────────────────────────────────────────────────────────────
