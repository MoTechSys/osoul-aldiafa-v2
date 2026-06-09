"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import {
  HERO_IMAGES,
  TEAM_IMAGES,
  PRODUCT_IMAGES,
  SETUP_IMAGES,
  DATES_IMAGES,
  BRAND_LOGO,
  imageAlt,
} from "@/lib/images";
import { useWhatsAppUrl, WA_NUMBER } from "@/components/Navbar";
import CountUp from "@/components/CountUp";

// ─────────────────────────────────────────────────────────────
// Small primitives
// ─────────────────────────────────────────────────────────────
function Ornament() {
  return (
    <div className="flex items-center justify-center gap-3" aria-hidden>
      <span className="block h-px w-10 sm:w-16 bg-gradient-to-l from-gold to-transparent" />
      <span className="text-gold text-base">✦</span>
      <span className="block h-px w-10 sm:w-16 bg-gradient-to-r from-gold to-transparent" />
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
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
function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const parallax = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const waUrl = useWhatsAppUrl();
  const reduceMotion = useReducedMotion();

  return (
    <section
      ref={heroRef}
      className="relative h-screen min-h-[640px] max-h-[1000px] overflow-hidden"
      aria-label="الصفحة الرئيسية"
    >
      {/* parallax cinematic video background (coffee + steam) with image poster fallback */}
      <motion.div className="absolute inset-0" style={{ y: parallax }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={HERO_IMAGES.desktop}
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center motion-reduce:hidden"
        >
          <source src="/videos/hero-bg.webm" type="video/webm" />
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* image fallback layer (shows if video fails / reduced-motion) */}
        <Image
          src={HERO_IMAGES.desktop}
          alt="ركن ضيافة أصول الضيافة"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center motion-reduce:opacity-100 opacity-0"
        />
      </motion.div>

      {/* cinematic vignette overlay - golden/black gradient */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.28) 42%, rgba(10,10,10,0.45) 68%, rgba(10,10,10,0.96) 100%)"
      }} />
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 35%, rgba(226,198,142,0.22) 0%, rgba(197,160,89,0.08) 35%, transparent 68%)"
      }} />

      {/* luxury aurora glow behind the title - breathing golden light (mobile-first) */}
      <motion.div
        className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "min(120vw, 900px)",
          height: "min(70vh, 560px)",
          background: "radial-gradient(ellipse at center, rgba(226,198,142,0.28) 0%, rgba(197,160,89,0.12) 32%, transparent 66%)",
          filter: "blur(28px)",
        }}
        animate={reduceMotion ? undefined : { opacity: [0.55, 0.95, 0.55], scale: [0.92, 1.06, 0.92] }}
        transition={reduceMotion ? undefined : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />

      {/* steam/vapor effect - soft animated SVG (mobile-first: visible on phones too) */}
      <div className="absolute inset-0 opacity-30 sm:opacity-20 pointer-events-none" aria-hidden>
        <svg className="absolute w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter id="steamBlur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="45" />
            </filter>
          </defs>
          <g filter="url(#steamBlur)">
            <motion.ellipse
              cx="960"
              cy="780"
              rx="180"
              ry="90"
              fill="rgba(245,239,224,0.18)"
              animate={reduceMotion ? undefined : {
                cy: [780, 620, 480],
                rx: [180, 240, 320],
                opacity: [0.25, 0.12, 0]
              }}
              transition={reduceMotion ? undefined : { duration: 6, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.ellipse
              cx="820"
              cy="820"
              rx="140"
              ry="70"
              fill="rgba(226,198,142,0.15)"
              animate={reduceMotion ? undefined : {
                cy: [820, 680, 560],
                rx: [140, 200, 280],
                opacity: [0.22, 0.10, 0]
              }}
              transition={reduceMotion ? undefined : { duration: 7, delay: 1.2, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.ellipse
              cx="1100"
              cy="800"
              rx="160"
              ry="80"
              fill="rgba(197,160,89,0.12)"
              animate={reduceMotion ? undefined : {
                cy: [800, 640, 500],
                rx: [160, 220, 300],
                opacity: [0.20, 0.08, 0]
              }}
              transition={reduceMotion ? undefined : { duration: 6.5, delay: 2.4, repeat: Infinity, ease: "easeOut" }}
            />
          </g>
        </svg>
      </div>

      {/* floating golden sparkles - visible on mobile too (95% of users), reduced-motion aware */}
      {!reduceMotion && (
        <div aria-hidden>
          {[...Array(7)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute block rounded-full"
              style={{
                left: `${12 + ((i * 53) % 78)}%`,
                top: `${15 + ((i * 37) % 60)}%`,
                width: 2.5,
                height: 2.5,
                background: "radial-gradient(circle, #E2C68E 0%, transparent 70%)",
                boxShadow: "0 0 12px rgba(226,198,142,0.7)",
              }}
              animate={{ opacity: [0, 0.85, 0], scale: [0.5, 1.3, 0.5] }}
              transition={{ duration: 3 + (i % 2), repeat: Infinity, delay: i * 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
          {/* a few extra sparkles on larger screens */}
          <div className="hidden sm:block">
            {[...Array(4)].map((_, i) => (
              <motion.span
                key={`lg-${i}`}
                className="absolute block rounded-full"
                style={{
                  left: `${55 + ((i * 41) % 40)}%`,
                  top: `${20 + ((i * 29) % 55)}%`,
                  width: 3,
                  height: 3,
                  background: "radial-gradient(circle, #E2C68E 0%, transparent 70%)",
                  boxShadow: "0 0 14px rgba(226,198,142,0.75)",
                }}
                animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.25, 0.5] }}
                transition={{ duration: 3.5 + (i % 2), repeat: Infinity, delay: i * 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
          </div>
        </div>
      )}

      {/* content */}
      <motion.div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6" style={{ opacity: fade }}>
       {/* ✨ luxury glass card wrapping the hero content */}
       <motion.div
         initial={{ opacity: 0, scale: 0.96, y: 24 }}
         animate={{ opacity: 1, scale: 1, y: 0 }}
         transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
         className="hero-glass-card relative w-full max-w-xl sm:max-w-2xl flex flex-col items-center px-5 py-6 sm:px-10 sm:py-9"
       >
        {/* brand logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-3 sm:mb-4 floaty"
          style={{ filter: "drop-shadow(0 12px 30px rgba(212,175,55,0.35))" }}
        >
          <Image
            src={BRAND_LOGO}
            alt="أصول الضيافة"
            width={200}
            height={200}
            priority
            className="w-[100px] h-[100px] sm:w-[140px] sm:h-[140px]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="flex items-center justify-center gap-3 mb-2"
        >
          <span className="h-px w-8 bg-gradient-to-l from-gold to-transparent" />
          <span className="text-gold-bright" style={{ fontSize: "0.65rem", letterSpacing: "0.4em", fontWeight: 600 }}>
            SINCE 2017
          </span>
          <span className="h-px w-8 bg-gradient-to-r from-gold to-transparent" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="gold-text font-amiri"
          style={{
            fontSize: "clamp(1.5rem, 5vw, 2.4rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            textShadow: "0 4px 24px rgba(0,0,0,0.95), 0 2px 8px rgba(0,0,0,0.9)",
            filter: "drop-shadow(0 0 18px rgba(197,160,89,0.4))",
          }}
        >
          أصول الضيافة
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-pearl/85 mt-3 max-w-xl mx-auto"
          style={{ fontSize: "clamp(0.85rem, 2vw, 1.05rem)", lineHeight: 1.7 }}
        >
          نُحيي أصول الضيافة العربية بفريق صبّابين بزي تراثي، قهوة عربية، شاي وتمور فاخرة — تجربة تليق بأرقى المناسبات.
        </motion.p>

        {/* service pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-4"
        >
          {["فعاليات رسمية", "مؤتمرات ومحافل", "مناسبات خاصة"].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" style={{ boxShadow: "0 0 8px rgba(197,160,89,0.8)" }} />
              <span className="text-gold-bright text-xs font-medium tracking-wider">{item}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="ornament-line mt-4 mb-4 mx-auto"
          style={{ width: 110 }}
        />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.95 }}
          className="flex flex-row items-stretch justify-center gap-3 w-full"
        >
          <Link
            href={waUrl}
            target="_blank"
            className="gold-button flex-1 px-4 py-3.5 rounded-full text-xs sm:text-sm tracking-wide text-center"
          >
            احجز ضيافتك
          </Link>
          <Link
            href="/portfolio"
            className="ghost-button flex-1 px-4 py-3.5 rounded-full text-xs sm:text-sm tracking-wide text-center"
          >
            شاهد أعمالنا
          </Link>
        </motion.div>
       </motion.div>
       {/* ✨ end glass card */}

        {/* scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gold-bright/70"
        >
          <span className="text-[10px] tracking-[0.4em]">اسحب للأسفل</span>
          <motion.span
            className="block w-px h-7 sm:h-8 bg-gradient-to-b from-gold to-transparent"
            animate={reduceMotion ? undefined : { scaleY: [0.4, 1, 0.4] }}
            transition={reduceMotion ? undefined : { duration: 1.8, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Marquee strip of real photos — a strong, visual "proof" right
// under the hero (replaces the old partners marquee).
// ─────────────────────────────────────────────────────────────
function PhotoMarquee() {
  const strip = [...SETUP_IMAGES, ...TEAM_IMAGES.slice(0, 6), ...PRODUCT_IMAGES.slice(0, 5)];
  const reduceMotion = useReducedMotion();
  const [dragging, setDragging] = useState(false);
  const items = [...strip, ...strip];
  return (
    <section className="relative py-10 overflow-hidden border-y border-gold/15 bg-noir-rich">
      <motion.div
        className="flex gap-4 will-change-transform cursor-grab active:cursor-grabbing"
        style={{ width: "max-content" }}
        drag="x"
        dragConstraints={{ left: -2000, right: 0 }}
        dragElastic={0.08}
        onDragStart={() => setDragging(true)}
        onDragEnd={() => setDragging(false)}
        animate={reduceMotion || dragging ? undefined : { x: ["0%", "-50%"] }}
        transition={reduceMotion || dragging ? undefined : { duration: 55, repeat: Infinity, ease: "linear" }}
      >
        {items.map((src, i) => (
          <div
            key={i}
            className="relative h-32 sm:h-40 md:h-48 w-44 sm:w-56 md:w-72 flex-shrink-0 rounded-xl overflow-hidden pointer-events-none"
            style={{ border: "1px solid rgba(212,175,55,0.18)" }}
          >
            <Image src={src} alt={imageAlt(src)} fill sizes="(max-width:640px) 176px, 288px" className="object-cover" draggable={false} />
            <div className="absolute inset-0 bg-gradient-to-t from-noir/70 via-transparent to-transparent" />
          </div>
        ))}
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// "Why us" — fancier 4-tile grid with hover lift + stagger
// ─────────────────────────────────────────────────────────────
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
    title: "تغطية كامل المملكة",
    desc: "نتنقل بطاقمنا وعدّتنا أينما كانت مناسبتك في المملكة.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
];

function WhyUs() {
  return (
    <section className="relative py-24 px-4 bg-noir overflow-hidden aurora-section">
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
              className="card-royal p-5 sm:p-7 group cursor-pointer flex flex-col items-center text-center sm:items-start sm:text-right"
            >
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-gold mb-4 sm:mb-6 transition-all duration-500"
                style={{ background: "rgba(212,175,55,0.12)" }}
              >
                {t.icon}
              </div>
              <h3 className="font-amiri text-pearl mb-2 sm:mb-3" style={{ fontSize: "clamp(0.95rem, 3.5vw, 1.15rem)", fontWeight: 700 }}>{t.title}</h3>
              <p className="text-pearl/65 text-xs sm:text-sm leading-relaxed">{t.desc}</p>
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
const statItems: {
  to: number;
  suffix?: string;
  prefix?: string;
  label: string;
}[] = [
  { to: 7, suffix: "+", label: "سنوات من الخبرة" },
  { to: 1200, suffix: "+", label: "مناسبة أُقيمت" },
  { to: 13, suffix: "", label: "منطقة في المملكة" },
  { to: 99, suffix: "٪", label: "رضا عملائنا" },
];

function Stats() {
  return (
    <section className="relative py-20 px-4 bg-noir overflow-hidden aurora-section">
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
              className="card-royal card-luxe text-center px-4 py-8"
            >
              <div className="gold-text font-amiri leading-none" style={{ fontSize: "clamp(2.2rem, 8vw, 3.2rem)", fontWeight: 700 }}>
                <CountUp
                  to={s.to}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  arabicDigits
                  duration={1.8}
                />
              </div>
              <p className="text-pearl/70 text-sm mt-3 leading-relaxed">{s.label}</p>
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

function Pillars() {
  return (
    <section className="py-24 px-4 relative overflow-hidden aurora-section" style={{ background: "linear-gradient(180deg, #050505 0%, #0a0a0a 100%)" }}>
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionLabel label="ثلاثُ ركائز" />
        <SectionTitle>ضيافة على ثلاثة أعمدة</SectionTitle>
        <div className="ornament-line mt-5 mx-auto" style={{ width: 110 }} />

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
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
                <p className="text-pearl/60 text-sm leading-relaxed mb-5">{p.desc}</p>
                <Link href={p.href} className="inline-flex items-center gap-2 text-gold-bright text-sm font-bold group/link">
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
function Mosaic() {
  const tiles = [
    { src: SETUP_IMAGES[0], span: "row-span-2", aspect: "aspect-[3/4]" },
    { src: TEAM_IMAGES[1],  span: "",            aspect: "aspect-[4/3]" },
    { src: PRODUCT_IMAGES[8], span: "",          aspect: "aspect-[4/3]" },
    { src: SETUP_IMAGES[5], span: "col-span-2",  aspect: "aspect-[16/9]" },
    { src: DATES_IMAGES[5], span: "",            aspect: "aspect-[4/3]" },
    { src: TEAM_IMAGES[9], span: "",             aspect: "aspect-[4/3]" },
  ];
  return (
    <section className="py-24 px-4 bg-noir relative aurora-section">
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionLabel label="من أعمالنا" />
        <SectionTitle>لمحات من المناسبات</SectionTitle>
        <div className="ornament-line mt-5 mx-auto" style={{ width: 110 }} />

        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[220px]">
          {tiles.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.92 }}
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
const steps = [
  { n: "١", t: "تواصل", d: "اطلب عبر واتساب أو ابعث استفسارك." },
  { n: "٢", t: "تصميم الباقة", d: "نقترح أعداد الصبّابين والتقديمات والديكور." },
  { n: "٣", t: "تجهيز الموقع", d: "نصل قبل المناسبة بوقت كافٍ لتجهيز الركن." },
  { n: "٤", t: "ضيافة لا تُنسى", d: "نقدّم تجربة ضيافة مدروسة من البداية للنهاية." },
];

// Testimonials — آراء العملاء (أقوى إشارة ثقة). بيانات مبدئية — يستبدلها العميل بآراء حقيقية.
const testimonials = [
  { name: "أ. خالد الحربي", role: "حفل زفاف — جدة", stars: 5, quote: "فريق راقٍ ومنضبط، والقهوة والتقديم فاق توقعاتنا. ضيوفنا أثنوا على الترتيب والأناقة." },
  { name: "م. سارة القحطاني", role: "مؤتمر شركة — ينبع", stars: 5, quote: "احترافية عالية في المواعيد والتجهيز. ركن الضيافة كان واجهة أنيقة للفعالية." },
  { name: "أ. عبدالله الزهراني", role: "مناسبة عائلية — بدر", stars: 5, quote: "تمور وحلويات بعرض يخطف الأنظار، وصبّابون بزي تراثي أضفوا لمسة أصيلة." },
];

function Testimonials() {
  return (
    <section className="py-24 px-4 relative overflow-hidden aurora-section bg-noir">
      <div className="max-w-6xl mx-auto relative z-10">
        <SectionLabel label="آراء ضيوفنا" />
        <SectionTitle>قالوا عن أصول الضيافة</SectionTitle>
        <div className="ornament-line mt-5 mx-auto" style={{ width: 110 }} />
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0.001, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="card-royal card-luxe text-right px-6 py-8 flex flex-col"
            >
              <div className="flex gap-1 mb-4 justify-end" aria-label={`تقييم ${t.stars} من 5`}>
                {Array.from({ length: t.stars }).map((_, k) => (
                  <span key={k} style={{ color: "#E2C68E", fontSize: "1.05rem" }}>★</span>
                ))}
              </div>
              <p className="text-pearl/85 text-sm leading-loose flex-1">“{t.quote}”</p>
              <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(212,175,55,0.14)" }}>
                <p className="gold-text font-amiri" style={{ fontSize: "1.05rem", fontWeight: 700 }}>{t.name}</p>
                <p className="text-pearl/50 text-xs mt-1">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="py-24 px-4 relative overflow-hidden aurora-section" style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #050505 100%)" }}>
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
              className="relative card-royal pt-12 px-5 pb-6 sm:pt-14 sm:px-7 sm:pb-7 cursor-pointer"
            >
              <span
                className="absolute top-4 right-5 sm:right-6 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-amiri text-noir"
                style={{ background: "var(--gradient-royal)", fontSize: "1.3rem", fontWeight: 700, boxShadow: "0 6px 18px rgba(212,175,55,0.35)" }}
              >
                {s.n}
              </span>
              <h3 className="font-amiri text-pearl mb-2" style={{ fontSize: "clamp(1rem, 3.5vw, 1.1rem)", fontWeight: 700 }}>{s.t}</h3>
              <p className="text-pearl/60 text-xs sm:text-sm leading-relaxed">{s.d}</p>
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
function FinalCTA() {
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("السلام عليكم، أرغب في حجز خدمات أصول الضيافة.")}`;
  return (
    <section className="relative py-24 px-4 bg-noir overflow-hidden">
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
        <p className="text-pearl/65 mt-4 max-w-xl mx-auto text-sm sm:text-base leading-7">
          احجز معنا قبل اقتراب موعد مناسبتك لنضمن تجهيز فريق وتقديمات تليق بضيوفك. الاستشارة مجانية.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href={waUrl} target="_blank" className="gold-button px-9 py-4 rounded-full text-sm tracking-widest">
            تواصل عبر واتساب
          </Link>
          <a href={`tel:+${WA_NUMBER}`} className="ghost-button px-9 py-4 rounded-full text-sm tracking-widest">
            اتصل الآن
          </a>
        </div>
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────
export function HomePageClient() {
  return (
    <div className="film-grain">
      <Hero />
      <PhotoMarquee />
      <WhyUs />
      <Stats />
      <Pillars />
      <Mosaic />
      <Testimonials />
      <Process />
      <FinalCTA />
    </div>
  );
}

export default HomePageClient;
