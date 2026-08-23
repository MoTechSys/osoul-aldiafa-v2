"use client";

import { motion } from "motion/react";

export function Ornament() {
  return (
    <div className="flex items-center justify-center gap-3" aria-hidden>
      <span className="block h-px w-10 sm:w-16 bg-gradient-to-l from-gold to-transparent" />
      <span className="text-gold text-base">✦</span>
      <span className="block h-px w-10 sm:w-16 bg-gradient-to-r from-gold to-transparent" />
    </div>
  );
}

export function SectionLabel({ label }: { label: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="text-gold-bright text-center mb-3"
      style={{ fontSize: "0.72rem", letterSpacing: "0.45em", fontWeight: 600 }}
    >
      ✦ {label} ✦
    </motion.p>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      initial={false}
      whileInView={{ opacity: [0, 1], y: [24, 0] }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="text-pearl text-center font-amiri"
      style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 700, lineHeight: 1.25 }}
    >
      {children}
    </motion.h2>
  );
}

// ─────────────────────────────────────────────────────────────
// Hero — full-screen poster of the brand logo on a parallax photo
// Composition is intentionally different from the legacy site:
// the brand mark is centered & oversized, the team photo sits to
// the side (desktop) / behind (mobile).
// ─────────────────────────────────────────────────────────────
