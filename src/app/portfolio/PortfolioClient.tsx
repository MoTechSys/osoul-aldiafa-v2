"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "motion/react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { imageAlt } from "@/lib/images";
import { PORTFOLIO_ENTRIES, type PortfolioCategory } from "@/lib/pageImages";
import { WA_NUMBER } from "@/components/Navbar";

const ITEMS_PER_PAGE = 12;

type FilterType = "all" | PortfolioCategory;

type PortfolioItem = (typeof PORTFOLIO_ENTRIES)[number];

// تُقرأ من مصدر الحقيقة الواحد (src/lib/pageImages.ts) حتى تبقى خريطة الصور
// في sitemap-images.xml مطابقة تمامًا لما تعرضه هذه الصفحة فعلاً.
const portfolioItems: readonly PortfolioItem[] = PORTFOLIO_ENTRIES;

const filters: { key: FilterType; label: string; icon: string }[] = [
  { key: "all",      label: "الكل",          icon: "◎" },
  { key: "setups",   label: "أركان الضيافة", icon: "✦" },
  { key: "team",     label: "الفريق",        icon: "👤" },
  { key: "products", label: "الأدوات",       icon: "☕" },
  { key: "dates",    label: "التمر والحلويات", icon: "🌴" },
];

const seoAlt: Record<FilterType, string> = {
  all: "تفاصيل بصرية لأساليب الضيافة السعودية",
  setups: "تكوين أركان الضيافة ومساحات التقديم",
  team: "قهوجيين وصبابين بملابس مستلهمة من الطابع السعودي",
  products: "دلال وفناجين وصواني ضمن مشاهد التقديم",
  dates: "ترتيبات التمر والحلويات في الضيافة",
};

function Lightbox({
  items,
  initialIndex,
  onClose,
}: {
  items: PortfolioItem[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const dragX = useMotionValue(0);
  const bgOpacity = useTransform(dragX, [-200, 0, 200], [0.5, 1, 0.5]);
  const item = items[index];

  const goTo = useCallback(
    (next: number) => {
      if (next < 0 || next >= items.length) return;
      setDirection(next > index ? 1 : -1);
      setIndex(next);
    },
    [index, items.length]
  );

  const handleDragEnd = useCallback(
    (_: unknown, info: { velocity: { x: number }; offset: { x: number } }) => {
      const { velocity, offset } = info;
      if (velocity.x < -300 || offset.x < -80) goTo(index + 1);
      else if (velocity.x > 300 || offset.x > 80) goTo(index - 1);
      else animate(dragX, 0, { type: "spring", stiffness: 400, damping: 40 });
    },
    [goTo, index, dragX]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goTo(index - 1);
      if (e.key === "ArrowLeft") goTo(index + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, goTo, index]);

  const variants = {
    enter:  (d: number) => ({ x: d > 0 ?  300 : -300, opacity: 0, scale: 0.92 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit:   (d: number) => ({ x: d > 0 ? -300 :  300, opacity: 0, scale: 0.92 }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div className="absolute inset-0" style={{ background: "rgba(5,4,2,0.95)", backdropFilter: "blur(24px)", opacity: bgOpacity }} />

      <button
        onClick={onClose}
        className="absolute top-5 left-5 z-20 w-11 h-11 rounded-full flex items-center justify-center text-pearl/70 hover:text-pearl"
        style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(212,175,55,0.25)" }}
        aria-label="إغلاق"
      >
        ✕
      </button>
      <div className="absolute top-5 right-5 z-20 px-3 py-1.5 rounded-full text-xs text-gold-bright" style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(212,175,55,0.25)" }}>
        {index + 1} / {items.length}
      </div>

      <div className="relative z-10 w-full h-full flex items-center justify-center px-2 md:px-4" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={item.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 320, damping: 38 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            style={{ x: dragX }}
            onDragEnd={handleDragEnd}
            className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
          >
            <div className="relative w-full h-full max-w-[95vw] max-h-[85vh] md:max-w-[80vw] md:max-h-[80vh]">
              <Image
                src={item.image}
                alt={imageAlt(item.image, seoAlt[item.category])}
                fill
                sizes="100vw"
                className="object-contain shadow-2xl"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function PortfolioClient() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (activeFilter === "all" ? portfolioItems : portfolioItems.filter((p) => p.category === activeFilter)),
    [activeFilter]
  );
  const displayed = filtered.slice(0, displayCount);
  const hasMore = displayCount < filtered.length;

  // Reset pagination when the filter changes — "adjust state during render"
  // pattern (https://react.dev/learn/you-might-not-need-an-effect) avoids the
  // extra cascading render an effect-based reset would cause.
  const [prevFilter, setPrevFilter] = useState<FilterType>(activeFilter);
  if (activeFilter !== prevFilter) {
    setPrevFilter(activeFilter);
    setDisplayCount(ITEMS_PER_PAGE);
  }

  return (
    <div className="min-h-screen bg-noir pb-32">
      <Breadcrumbs />

      <section className="relative pt-6 pb-10 px-4 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--gradient-vignette)" }} />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.p initial={false} whileInView={{ opacity: [0, 1], y: [-10, 0] }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }} className="text-gold-bright mb-3" style={{ fontSize: "0.75rem", letterSpacing: "0.4em" }}>✦ معرض أعمالنا ✦</motion.p>
          <motion.h1 initial={false} whileInView={{ opacity: [0, 1], y: [30, 0] }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: 0.1, ease: [0.32, 0.72, 0, 1] }} className="text-pearl mb-4 font-amiri" style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 700, lineHeight: 1.15 }}>
            اقرأ تفاصيل الصورة<br /><span className="gold-text">قبل تحديد توجّهك</span>
          </motion.h1>
          <motion.p initial={false} whileInView={{ opacity: [0, 1], y: [20, 0] }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: 0.2, ease: [0.32, 0.72, 0, 1] }} className="text-pearl/65 max-w-xl mx-auto text-sm leading-relaxed">
            معرض بصري للاستدلال على التكوين وحركة الخدمة والأدوات؛ مصدر كل مشهد وحدوده يُفهمان من بياناته المتاحة، لا من الافتراض.
          </motion.p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-10" aria-labelledby="portfolio-reading-title">
        <div className="grid lg:grid-cols-[0.9fr_1.4fr] gap-7 lg:gap-12 items-start">
          <div>
            <p className="text-gold-bright text-xs mb-3">طريقة القراءة</p>
            <h2 id="portfolio-reading-title" className="font-amiri text-pearl text-2xl sm:text-3xl font-bold leading-snug mb-4">
              لا تبحث عن نسخة مطابقة؛ التقط القرار خلف المشهد
            </h2>
            <p className="text-pearl/70 text-sm leading-8">
              وظيفة المعرض أن يمنحك أدلة بصرية للنقاش. بعض الصور قد تكون لمنتج، أو ترتيب، أو لقطة تعريفية،
              ولا تكفي الصورة وحدها لإثبات أنها من مناسبة عميل منفّذة. لذلك اقرأ ما يظهر فعلاً، ثم اسأل عن
              إمكان تطبيق التوجّه ضمن طلبك.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <article className="rounded-2xl border border-gold/15 bg-onyx p-5">
              <h3 className="font-amiri text-gold-bright text-xl mb-2">التكوين والمساحة</h3>
              <p className="text-pearl/65 text-sm leading-7">
                راقب توزيع الارتفاعات، الفراغ حول الركن، ووضوح نقطة الاستقبال. الصورة تساعد على وصف الإيقاع
                البصري، لكنها لا تحدد القياسات أو ملاءمة الترتيب لمساحة أخرى.
              </p>
            </article>
            <article className="rounded-2xl border border-gold/15 bg-onyx p-5">
              <h3 className="font-amiri text-gold-bright text-xl mb-2">مسار الخدمة</h3>
              <p className="text-pearl/65 text-sm leading-7">
                في فئة الفريق، انتبه إلى هيئة القهوجيين والصبابين، موضع الوقوف، وكيف تبدو حركة التقديم.
                العدد والأدوار والتنظيم الفعلي لا تُستنتج من لقطة واحدة.
              </p>
            </article>
            <article className="rounded-2xl border border-gold/15 bg-onyx p-5">
              <h3 className="font-amiri text-gold-bright text-xl mb-2">الأدوات والعلاقات</h3>
              <p className="text-pearl/65 text-sm leading-7">
                اقرأ تناسق الدلة والفنجان والصينية مع الخلفية، لا لون المعدن بوصفه إثباتاً للخامة. حدّد ما
                جذبك: الشكل، النقش، درجة اللون، أو بساطة التجميع.
              </p>
            </article>
            <article className="rounded-2xl border border-gold/15 bg-onyx p-5">
              <h3 className="font-amiri text-gold-bright text-xl mb-2">حدود الاستدلال</h3>
              <p className="text-pearl/65 text-sm leading-7">
                الزاوية والإضاءة والقص تغيّر قراءة الحجم واللون. استخدم الفئة والصورة كنقطة مرجعية، ثم اطلب
                توضيح المتاح والمناسب لنوع المناسبة وعدد الضيوف والموقع.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Filter tabs — single sticky row, no icons, horizontally scrollable */}
      <div className="sticky top-0 z-50" style={{ background: "rgba(10,10,10,0.92)", backdropFilter: "blur(18px)", borderBottom: "1px solid rgba(212,175,55,0.15)" }}>
        <div className="max-w-7xl mx-auto px-3 py-3 flex flex-nowrap sm:justify-center gap-2 overflow-x-auto no-scrollbar">
          {filters.map((f) => (
            <motion.button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              whileTap={{ scale: 0.95 }}
              className="shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm whitespace-nowrap transition-all"
              style={{
                background: activeFilter === f.key ? "var(--gradient-royal)" : "rgba(212,175,55,0.06)",
                color: activeFilter === f.key ? "#0a0a0a" : "#F5EFE0",
                border: activeFilter === f.key ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(212,175,55,0.18)",
                fontWeight: activeFilter === f.key ? 700 : 500,
              }}
            >
              {f.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Masonry grid */}
      <div className="max-w-7xl mx-auto px-4 pt-10">
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {displayed.map((item, idx) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setSelectedIndex(idx)}
              className="break-inside-avoid w-full group relative rounded-2xl overflow-hidden cursor-pointer bg-onyx"
              style={{ border: "1px solid rgba(212,175,55,0.15)" }}
            >
              <Image
                src={item.image}
                alt={imageAlt(item.image, seoAlt[item.category])}
                width={600}
                height={800}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="w-full h-auto transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 img-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-black/55 backdrop-blur-md border border-gold/30">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#E2C68E" strokeWidth="2" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDisplayCount((c) => c + ITEMS_PER_PAGE)}
              className="gold-button px-9 py-3.5 rounded-full text-sm tracking-widest"
            >
              عرض المزيد ({filtered.length - displayCount} متبقي)
            </motion.button>
          </div>
        )}

        {displayed.length === 0 && (
          <div className="text-center py-12 sm:py-20">
            <p className="text-pearl/75 text-lg">لا توجد صور في هذه الفئة حالياً</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <Lightbox items={displayed} initialIndex={selectedIndex} onClose={() => setSelectedIndex(null)} />
        )}
      </AnimatePresence>

      <section className="mt-20 text-center p-8 sm:p-12 rounded-3xl mx-4 max-w-2xl sm:mx-auto card-royal" aria-labelledby="portfolio-cta-title">
        <h2 id="portfolio-cta-title" className="text-pearl mb-3 font-amiri" style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", fontWeight: 700 }}>
          شاركنا ما قرأته في الصورة
        </h2>
        <p className="text-pearl/75 text-sm leading-7 mb-6 max-w-lg mx-auto">
          اذكر اسم الفئة أو ترتيب الصورة، ثم صف ما أعجبك تحديداً: التكوين، حركة التقديم، الأداة، أو درجة
          اللون. سنناقش إمكان ترجمة المرجع إلى طلبك، ويظل النطاق النهائي هو ما يُعتمد كتابةً.
        </p>
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("السلام عليكم، مرجعي من معرض الأعمال هو فئة: ___، والصورة رقم: ___. أعجبني فيها: ___. أرغب في مناقشة توجّه قريب منها، مع اعتماد النطاق النهائي كتابةً.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="gold-button inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm tracking-widest"
        >
          صف المرجع الذي أعجبك
        </a>
      </section>
    </div>
  );
}
