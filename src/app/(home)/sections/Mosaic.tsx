"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { imageAlt } from "@/lib/images";
import { HOME_MOSAIC_TILES } from "@/lib/pageImages";
import { SectionLabel, SectionTitle } from "./primitives";

export function Mosaic() {
  // البلاطات تُقرأ من مصدر الحقيقة الواحد (src/lib/pageImages.ts) لتبقى خريطة
  // الصور مطابقة لما يُعرَض فعلاً؛ تكرار القائمة هنا يجعل الخريطة تكذب بصمت.
  const tiles = HOME_MOSAIC_TILES;
  return (
    <section className="py-14 sm:py-24 px-4 bg-noir relative aurora-section">
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionLabel label="من أعمالنا" />
        <SectionTitle>لمحات من المناسبات</SectionTitle>
        <div className="ornament-line mt-5 mx-auto" style={{ width: 110 }} />

        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[220px]">
          {tiles.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 1, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`relative overflow-hidden rounded-2xl cursor-pointer glint ${t.span}`}
              style={{ border: "1px solid rgba(212,175,55,0.18)" }}
            >
              <Image src={t.src} alt={imageAlt(t.src)} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-1000" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(10,10,10,0.65))" }} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/portfolio" className="ghost-button inline-block px-9 py-3.5 rounded-full text-sm tracking-widest">
            استعرض كامل المعرض
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Process — 4-step ribbon (entirely new section)
// ─────────────────────────────────────────────────────────────
