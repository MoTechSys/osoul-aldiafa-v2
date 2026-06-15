"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TEAM_IMAGES, SETUP_IMAGES, PRODUCT_IMAGES } from "@/lib/images";

const values = [
  {
    title: "أصالة لا تُجامل",
    desc: "نقدّم الضيافة كما توارثناها — قهوة، تمر، وصبٌّ على الأصول.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
  {
    title: "ذوقٌ في كل قطعة",
    desc: "كل دلّة وفنجان وصينية اخترناها بعناية لتعكس مستوى ضيوفك.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347" />
      </svg>
    ),
  },
  {
    title: "احترافية حقيقية",
    desc: "فريق منضبط، ملابس مرتّبة، وتعامل راقٍ مع جميع شرائح الضيوف.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3" />
      </svg>
    ),
  },
  {
    title: "تنسيقٌ بصري",
    desc: "نُفكّر بكاميرا ضيوفك — كل ركن تنسّقه أيدينا يستحق صورة.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
  },
];

export default function AboutClient() {
  return (
    <div>
      <Breadcrumbs />

      <section className="relative pt-6 pb-10 px-4 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--gradient-vignette)" }} />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-gold-bright mb-3" style={{ fontSize: "0.75rem", letterSpacing: "0.4em" }}>✦ تعرّف علينا ✦</motion.p>
          <motion.h1 initial={false} whileInView={{ opacity: [0, 1], y: [30, 0] }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }} className="text-pearl mb-4 font-amiri" style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 700, lineHeight: 1.15 }}>
            من نحن في<br /><span className="gold-text">أصول الضيافة</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-pearl/65 max-w-xl mx-auto text-sm leading-relaxed">
            منذ 2017 ونحن نُحيي أصول الضيافة العربية في مناسبات كبرى عبر المملكة العربية السعودية.
          </motion.p>
        </div>
      </section>

      {/* Story + stacked image */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative grid grid-cols-2 gap-3"
          >
            <div className="relative rounded-3xl overflow-hidden" style={{ aspectRatio: "3/4", border: "1px solid rgba(212,175,55,0.18)" }}>
              <Image src={TEAM_IMAGES[2]} alt="فريق أصول الضيافة" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
            </div>
            <div className="space-y-3">
              <div className="relative rounded-3xl overflow-hidden" style={{ aspectRatio: "1/1", border: "1px solid rgba(212,175,55,0.18)" }}>
                <Image src={SETUP_IMAGES[4]} alt="ركن ضيافة بالعلم السعودي" fill sizes="25vw" className="object-cover" />
              </div>
              <div className="relative rounded-3xl overflow-hidden" style={{ aspectRatio: "4/5", border: "1px solid rgba(212,175,55,0.18)" }}>
                <Image src={PRODUCT_IMAGES[2]} alt="دلال قهوة ذهبية" fill sizes="25vw" className="object-cover" />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}>
            <p className="text-gold-bright text-xs mb-3" style={{ letterSpacing: "0.35em" }}>✦ قصّتنا ✦</p>
            <h2 className="text-pearl mb-5 font-amiri" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)", fontWeight: 700 }}>
              ضيافة بأصولها… حضورٌ بمعناها
            </h2>
            <p className="text-pearl/65 text-sm leading-8 mb-6">
              بدأت أصول الضيافة عام 2017 بفكرة بسيطة: أن نُعيد للضيافة العربية حضورها كما عرفها الأجداد —
              زيٌّ تراثي، دلّة، فنجان، وصبٌّ بأدبٍ ومهارة. كبرنا منذ ذلك الحين خدمةً للمناسبات الرسمية،
              فعاليات الشركات، الأعراس، والمحافل الكبرى في جميع مناطق المملكة، ونحرص في كل مناسبة على
              أن نترك أثراً يبقى في ذاكرة الضيوف.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { num: "2017", label: "سنة التأسيس" },
                { num: "+7",   label: "سنوات خبرة" },
                { num: "✦",    label: "تغطية شاملة" },
                { num: "100%", label: "إتقان" },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center p-4 rounded-2xl"
                  style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)" }}
                >
                  <p className="gold-text font-amiri" style={{ fontSize: "1.5rem", fontWeight: 700 }}>{s.num}</p>
                  <p className="text-pearl/55 text-xs mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 sm:py-20 px-4" style={{ background: "linear-gradient(180deg, #050505 0%, #0a0a0a 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <p className="text-gold-bright mb-3" style={{ fontSize: "0.75rem", letterSpacing: "0.4em" }}>✦ قيمنا ✦</p>
            <h2 className="text-pearl font-amiri" style={{ fontSize: "clamp(1.6rem, 4.5vw, 2.4rem)", fontWeight: 700 }}>ما يميّز ضيافتنا</h2>
            <div className="ornament-line mt-5 mx-auto" style={{ width: 110 }} />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card-royal p-6 text-center"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-gold mx-auto mb-5" style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.25)" }}>
                  {v.icon}
                </div>
                <h3 className="text-pearl mb-3 font-amiri" style={{ fontSize: "1.05rem", fontWeight: 700 }}>{v.title}</h3>
                <p className="text-pearl/55 text-sm">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
