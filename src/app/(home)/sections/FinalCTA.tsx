"use client";

import { motion } from "motion/react";
import { WA_NUMBER } from "@/components/Navbar";
import { Button } from "@/components/ui";
import { Ornament } from "./primitives";

export function FinalCTA() {
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("السلام عليكم، أرغب في حجز خدمات أصول الضيافة.")}`;
  return (
    <section className="relative py-14 sm:py-24 px-4 bg-noir overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative max-w-4xl mx-auto rounded-[28px] overflow-hidden text-center p-10 sm:p-14"
        style={{
          background: "linear-gradient(160deg, rgba(31,28,23,0.92), rgba(10,10,10,0.96))",
          border: "1px solid rgba(212,175,55,0.28)",
          boxShadow: "0 20px 80px rgba(0,0,0,0.55)",
        }}
      >
        <Ornament />
        <h2 className="font-amiri text-pearl mt-5" style={{ fontSize: "clamp(1.8rem, 5vw, 2.6rem)", fontWeight: 700 }}>
          مناسبتك تستحق <span className="gold-text">أصول الضيافة</span>
        </h2>
        <p className="text-pearl/75 mt-4 max-w-xl mx-auto text-sm sm:text-base leading-7">
          احجز معنا قبل اقتراب موعد مناسبتك لنضمن تجهيز فريق وتقديمات تليق بضيوفك. الاستشارة مجانية.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button href={waUrl}>تواصل عبر واتساب</Button>
          <Button href={`tel:+${WA_NUMBER}`} variant="outline">اتصل الآن</Button>
        </div>
      </motion.div>
    </section>
  );
}
