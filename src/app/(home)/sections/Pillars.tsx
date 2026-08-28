"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { TEAM_IMAGES, SETUP_IMAGES, DATES_IMAGES } from "@/lib/images";
import { SectionLabel, SectionTitle } from "./primitives";

const pillars = [
  {
    title: "فريق ضيافة بزي تراثي",
    desc: "صبّابون ومباشرون مدربون على أصول تقديم القهوة العربية، بزي سعودي مطرز.",
    img: TEAM_IMAGES[2],
    href: "/services",
    cta: "تعرف على الفريق",
  },
  {
    title: "أركان ضيافة فاخرة",
    desc: "تجهيز ركن قهوة وشاي بطاولات وأدوات ذهبية تليق بكبار الضيوف.",
    img: SETUP_IMAGES[4],
    href: "/services",
    cta: "شاهد التجهيزات",
  },
  {
    title: "تمر وحلويات وضيافة بصرية",
    desc: "أبراج تمر ومعمول مغلف بشرائط ذهبية وبوفيهات مشروبات تتفنّن في التقديم.",
    img: DATES_IMAGES[5],
    href: "/offerings",
    cta: "تصفّح التقديمات",
  },
];

export function Pillars() {
  return (
    <section className="py-14 sm:py-24 px-4 relative overflow-hidden aurora-section" style={{ background: "linear-gradient(180deg, #050505 0%, #0a0a0a 100%)" }}>
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionLabel label="ثلاثُ ركائز" />
        <SectionTitle>ضيافة على ثلاثة أعمدة</SectionTitle>
        <div className="ornament-line mt-5 mx-auto" style={{ width: 110 }} />

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 1, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
              className="card-royal overflow-hidden group cursor-pointer"
            >
              <div className="relative aspect-[4/3] overflow-hidden glint">
                <Image
                  src={p.img}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover kenburns-slow"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(10,10,10,0.85))" }} />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] tracking-widest text-gold-bright" style={{ background: "rgba(10,10,10,0.7)", border: "1px solid rgba(212,175,55,0.3)" }}>
                  0{i + 1}
                </span>
              </div>
              <div className="p-6 sm:p-7">
                <h3 className="font-amiri text-pearl mb-3" style={{ fontSize: "1.2rem", fontWeight: 700 }}>{p.title}</h3>
                <p className="text-pearl/75 text-sm leading-relaxed mb-5">{p.desc}</p>
                <Link href={p.href} className="inline-flex items-center gap-2 py-2 -my-2 text-gold-bright text-sm font-bold group/link">
                  <span>{p.cta}</span>
                  <span className="transition-transform group-hover/link:-translate-x-1">←</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// "Mosaic" — masonry preview of real photos with hover zoom
// ─────────────────────────────────────────────────────────────
