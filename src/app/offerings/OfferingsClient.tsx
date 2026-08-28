"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "motion/react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  OFFERINGS_COFFEE_TEA,
  OFFERINGS_DATES_SWEETS,
  OFFERINGS_SERVING,
  OfferingCard,
} from "@/lib/images";
import { WA_NUMBER } from "@/components/Navbar";

interface CategoryData {
  id: string;
  label: string;
  icon: string;
  description: string;
  items: OfferingCard[];
}

const categories: CategoryData[] = [
  {
    id: "coffee",
    label: "القهوة والشاي",
    icon: "☕",
    description: "مرجع لاختيار أسلوب المشروبات: قهوة عربية، شاي، وتفاصيل تقديم يمكن مناقشتها بحسب الطلب.",
    items: OFFERINGS_COFFEE_TEA,
  },
  {
    id: "dates",
    label: "التمور والحلويات",
    icon: "🌴",
    description: "أفكار للتمور والحلوى وطرق ترتيبها، لتحديد النوع والكمية وشكل العرض في الطلب.",
    items: OFFERINGS_DATES_SWEETS,
  },
  {
    id: "serving",
    label: "أدوات التقديم",
    icon: "✦",
    description: "مراجع بصرية للدلال والفناجين والصواني وحوامل العرض، ويُحدّد المتاح منها كتابةً.",
    items: OFFERINGS_SERVING,
  },
];

function Lightbox({
  items,
  initialIndex,
  onClose,
}: {
  items: OfferingCard[];
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
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0, scale: 0.92 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0, scale: 0.92 }),
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
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

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          style={{ x: dragX }}
          onDragEnd={handleDragEnd}
          className="relative w-full max-w-4xl px-4 flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full h-screen max-h-[78vh] rounded-2xl overflow-hidden shadow-2xl border border-gold/15">
            <Image src={item.img} alt={item.title} fill className="object-contain" />
          </div>
          <div className="mt-6 text-center">
            <h3 className="text-2xl font-amiri text-gold-bright mb-2">{item.title}</h3>
            <p className="text-pearl/70 text-sm max-w-md mx-auto">{item.desc}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function Tabs({ active, onChange }: { active: string; onChange: (id: string) => void }) {
  return (
    <div className="sticky top-[68px] z-40 mt-2" style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(18px)", borderBottom: "1px solid rgba(212,175,55,0.15)" }}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-center gap-2 sm:gap-3">
        {categories.map((c) => (
          <motion.button
            key={c.id}
            onClick={() => onChange(c.id)}
            className="relative flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full transition-all"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{
              background: active === c.id ? "var(--gradient-royal)" : "rgba(212,175,55,0.06)",
              color: active === c.id ? "#0a0a0a" : "#F5EFE0",
              border: active === c.id ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(212,175,55,0.18)",
              fontWeight: active === c.id ? 700 : 500,
              fontSize: "0.85rem",
            }}
          >
            <span>{c.icon}</span>
            <span>{c.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default function OfferingsClient() {
  const [activeTab, setActiveTab] = useState("coffee");
  const [lightbox, setLightbox] = useState<{ items: OfferingCard[]; index: number } | null>(null);

  const current = categories.find((c) => c.id === activeTab) || categories[0];

  return (
    <main className="min-h-screen bg-noir pb-32">
      <Breadcrumbs items={[{ label: "تقديماتنا", href: "/offerings" }]} />

      <section className="relative pt-6 pb-8 px-4 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--gradient-vignette)" }} />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.p initial={{ opacity: 1, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-gold-bright mb-3" style={{ fontSize: "0.75rem", letterSpacing: "0.4em" }}>✦ تقديماتنا ✦</motion.p>
          <motion.h1 initial={false} whileInView={{ opacity: [0, 1], y: [30, 0] }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }} className="text-pearl mb-4 font-amiri" style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 700, lineHeight: 1.15 }}>
            دليل اختيار عناصر<br /><span className="gold-text">الضيافة السعودية</span>
          </motion.h1>
          <motion.p initial={{ opacity: 1, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-pearl/65 max-w-xl mx-auto text-sm leading-relaxed">
            تصفّح الصور كخيارات ومراجع تساعدك على صياغة طلب واضح، لا كقائمة ثابتة أو وعد بتوفّر كل عنصر ظاهر.
          </motion.p>
        </div>
      </section>

      <Tabs active={activeTab} onChange={setActiveTab} />

      <section className="max-w-5xl mx-auto px-4 pt-12" aria-labelledby="offerings-guide-title">
        <div className="card-royal rounded-3xl p-6 sm:p-10">
          <p className="text-gold-bright text-xs mb-3">دليل القرار</p>
          <h2 id="offerings-guide-title" className="font-amiri text-pearl text-2xl sm:text-3xl font-bold mb-5">
            ابدأ بالمشهد الذي تريد أن يعيشه ضيفك
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-pearl/75 text-sm leading-8">
            <div>
              <p className="mb-4">
                هذه الصفحة كتالوج إلهام يساعدك على تسمية العناصر قبل التواصل. الصور توضّح اتجاهات في اللون،
                الترتيب، وأسلوب التقديم؛ وقد يجمع طلبك بين أكثر من مرجع. ظهور منتج أو أداة في صورة لا يعني
                أنه متاح دائماً أو داخل كل نطاق، لذلك يُراجع الاختيار ويُثبت في التفاصيل المكتوبة.
              </p>
              <p>
                فكّر أولاً في لحظة الاستقبال: هل تفضّل حضور القهوة العربية، تنويع الشاي، أم مساراً يجمعهما؟
                بعد ذلك انتقل إلى التمور والحلويات، وحدّد هل المطلوب ضيافة فردية هادئة أم ترتيب عرض بارز.
              </p>
            </div>
            <div>
              <p className="mb-4">
                قسم الأدوات ليس حزمة جاهزة؛ بل قاموس بصري للدلال والفناجين والصواني والحوامل. استخدمه لوصف
                الطابع الذي يناسب المناسبة، مثل نقوش تراثية، خطوط بسيطة، أو درجات معدنية دافئة، من دون افتراض
                خامة بعينها من الصورة وحدها.
              </p>
              <p>
                إذا احتجت قهوجيين أو صبابين، اذكر ذلك صراحةً مع نوع المناسبة وعدد الضيوف وموقعها. بهذه
                المعلومات يصبح النقاش أدق، ويظل النطاق النهائي مرهوناً بما يُعتمد كتابةً بين الطرفين.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pt-10">
        <div className="mb-8 text-center">
          <h2 className="text-gold-bright font-amiri text-2xl mb-2">{current.label}</h2>
          <p className="text-pearl/60 text-sm max-w-lg mx-auto">{current.description}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {current.items.map((item, idx) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 1, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              whileHover={{ y: -4 }}
              onClick={() => setLightbox({ items: current.items, index: idx })}
              className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-[4/5] text-right"
              style={{ border: "1px solid rgba(212,175,55,0.18)" }}
            >
              <Image
                src={item.img}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 img-overlay" />
              <div className="absolute inset-0 bg-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "rgba(212,175,55,0.08)" }} />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-amiri text-pearl" style={{ fontSize: "1.05rem", fontWeight: 700 }}>{item.title}</h3>
                <p className="text-pearl/75 text-xs mt-1 line-clamp-2">{item.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <Lightbox items={lightbox.items} initialIndex={lightbox.index} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>

      <div className="mt-20 text-center p-8 sm:p-12 rounded-3xl mx-4 max-w-2xl mx-auto card-royal">
        <h2 className="text-pearl mb-3 font-amiri" style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", fontWeight: 700 }}>حوّل اختياراتك إلى قائمة</h2>
        <p className="text-pearl/75 text-sm mb-6 max-w-lg mx-auto">
          أرسل العناصر التي ترغب بها تحت عناوين: المشروبات، التمور أو الحلويات، الأدوات، والكوادر. أضف عدد
          الضيوف ونوع المناسبة وموقعها، ثم نراجع المتاح ونوثّق النطاق المتفق عليه كتابةً.
        </p>
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("السلام عليكم، أرغب في بناء طلب ضيافة. العناصر التي أفضّلها: المشروبات: ___، التمور أو الحلويات: ___، الأدوات: ___، القهوجيين أو الصبابين: ___. نوع المناسبة وعدد الضيوف والموقع: ___.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="gold-button inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm tracking-widest"
        >
          أرسل قائمة العناصر
        </a>
      </div>
    </main>
  );
}
