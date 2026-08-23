"use client";

import { useRef, useState, useEffect } from "react";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
// ⚠️ HERO_SAFE لا HERO_IMAGES: الأخيرة تشير إلى setup-5 وفيها وجوه
// مطموسة، ولا يصح أن تكون في موضع LCP (أول ما يراه الزائر).
import { HERO_SAFE, BRAND_LOGO } from "@/lib/images";
import { useWhatsAppUrl } from "@/components/Navbar";

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const parallax = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const waUrl = useWhatsAppUrl();
  const reduceMotion = useReducedMotion();

  // أداء (LCP): الفيديو الخلفي مؤجَّل — الصورة (priority) هي عنصر LCP الفوري،
  // والفيديو يُركَّب بعد خمول المتصفح فقط ثم يظهر فوقها بهدوء.
  const [videoReady, setVideoReady] = useState(false);
  useEffect(() => {
    if (reduceMotion) return;
    const start = () => setVideoReady(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(start, 1500);
    return () => clearTimeout(t);
  }, [reduceMotion]);

  return (
    <section
      ref={heroRef}
      className="relative h-screen min-h-[640px] max-h-[1000px] overflow-hidden"
      aria-label="الصفحة الرئيسية"
    >
      {/* parallax cinematic video background (coffee + steam) with image poster fallback */}
      <motion.div className="absolute inset-0" style={{ y: parallax }}>
        {/* LCP: صورة الهيرو في HTML الأولي — priority (غير كسولة) وبأبعاد المساحة كاملة */}
        <Image
          src={HERO_SAFE.desktop}
          alt="ركن ضيافة أصول الضيافة"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* الفيديو السينمائي يُركَّب بعد الخمول فقط — لا يزاحم تحميل LCP */}
        {videoReady && (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover object-center motion-reduce:hidden"
          >
            <source src="/videos/hero-bg.webm" type="video/webm" />
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
        )}
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

      {/* floating golden sparkles - visible on mobile too (95% of users), reduced-motion aware

          ⚠️ إصلاح hydration (React #418/#422) — سبب مُثبَت بتجربة A/B:
          كان هنا شرط `{!reduceMotion && (…)}` يحكم الـJSX نفسه.
          و`useReducedMotion()` يرجع false على السيرفر دائمًا (لا يعرف
          تفضيل الجهاز)، فمن يُفعّل «تقليل الحركة» يحصل على HTML فيه
          الشرر ثم يحاول React حذفه لحظة الـhydration ⇒ تباعُد في الشجرة.
          الحل: نُرسمه دائمًا ونخفيه بـCSS عبر `motion-reduce:hidden` —
          وهو النمط المُستخدم أصلًا للفيديو في السطر ٢٦، فالقرار يتخذه
          المتصفّح لا JavaScript ⇒ لا تباعُد أصلًا.                          */}
      <div aria-hidden className="motion-reduce:hidden">
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

      {/* content */}
      <motion.div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6" style={{ opacity: fade }}>
       {/* ✨ luxury glass card wrapping the hero content */}
       {/* ⚠️ أداء (LCP): حركة الدخول هنا بـ CSS (hero-in-*) وليست motion.
           السبب: initial={{opacity:0}} كان يجعل محتوى الهيرو مخفيًا في HTML
           الأولي حتى يكتمل الـhydration → LCP 2252ms مقابل FCP 896ms.
           لا تُرجعها إلى motion. الشكل النهائي مطابق تمامًا. */}
       <div className="hero-in-card hero-glass-card relative w-full max-w-xl sm:max-w-2xl flex flex-col items-center px-5 py-6 sm:px-10 sm:py-9">
        {/* brand logo — priority لأنه كان عنصر LCP فعليًا على الرئيسية */}
        <div
          className="hero-in-logo mb-3 sm:mb-4 floaty"
          style={{ filter: "drop-shadow(0 12px 30px rgba(212,175,55,0.35))" }}
        >
          <Image
            src={BRAND_LOGO}
            // alt="" مقصود: الـh1 أسفله مباشرة نصّه «أصول الضيافة» حرفيًا، فوصف
            // الشعار يجعل قارئ الشاشة ينطق الاسم مرتين. المرجع: W3C WAI Images
            // Tutorial — Decorative Images، المثال 3 (adjacent text alternative).
            alt=""
            width={200}
            height={200}
            priority
            className="w-[100px] h-[100px] sm:w-[140px] sm:h-[140px]"
          />
        </div>

        <div className="hero-in-since flex items-center justify-center gap-3 mb-2">
          <span className="h-px w-8 bg-gradient-to-l from-gold to-transparent" />
          <span className="text-gold-bright" style={{ fontSize: "0.65rem", letterSpacing: "0.4em", fontWeight: 600 }}>
            SINCE 2017
          </span>
          <span className="h-px w-8 bg-gradient-to-r from-gold to-transparent" />
        </div>

        <h1
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
        </h1>

        <p
          className="text-pearl/85 mt-3 max-w-xl mx-auto"
          style={{ fontSize: "clamp(0.85rem, 2vw, 1.05rem)", lineHeight: 1.7 }}
        >
          نُحيي أصول الضيافة العربية بفريق صبّابين بزي تراثي، قهوة عربية، شاي وتمور فاخرة — تجربة تليق بأرقى المناسبات.
        </p>

        {/* service pills */}
        <div className="hero-in-pills flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-4">
          {["فعاليات رسمية", "مؤتمرات ومحافل", "مناسبات خاصة"].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" style={{ boxShadow: "0 0 8px rgba(197,160,89,0.8)" }} />
              <span className="text-gold-bright text-xs font-medium tracking-wider">{item}</span>
            </div>
          ))}
        </div>

        <div
          className="hero-in-rule ornament-line mt-4 mb-4 mx-auto"
          style={{ width: 110 }}
        />

        <div className="flex flex-row items-stretch justify-center gap-3 w-full">
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
        </div>
       </div>
       {/* ✨ end glass card */}

        {/* scroll hint */}
        <div className="hero-in-hint absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gold-bright/70">
          <span className="text-[10px] tracking-[0.4em]">اسحب للأسفل</span>
          <motion.span
            className="block w-px h-7 sm:h-8 bg-gradient-to-b from-gold to-transparent"
            animate={reduceMotion ? undefined : { scaleY: [0.4, 1, 0.4] }}
            transition={reduceMotion ? undefined : { duration: 1.8, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Marquee strip of real photos — a strong, visual "proof" right
// under the hero (replaces the old partners marquee).
// ─────────────────────────────────────────────────────────────
// دالة رياضية لضمان التفاف الشريط (Seamless Wrap) بلا فراغ مهما سُحب بقوة — مطابقة لمنطق "كيف الضيافة"
