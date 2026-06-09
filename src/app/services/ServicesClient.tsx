"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  TEAM_IMAGES,
  PRODUCT_IMAGES,
  SETUP_IMAGES,
  DRINK_IMAGES,
  DATES_IMAGES,
  imageAlt,
} from "@/lib/images";
import { WA_NUMBER } from "@/components/Navbar";

interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  img: string;
  features: string[];
  gallery: string[];
}

const services: ServiceItem[] = [
  {
    id: "pourers",
    title: "صبّابون ومباشرون بزي تراثي",
    subtitle: "Traditional Pourers & Hosts",
    description:
      "فريقنا الأساسي: صبّابون ومباشرون بزي سعودي مطرّز يصبّون القهوة العربية بأسلوب موروث ويباشرون الضيافة باحترافية تليق بكبار الضيوف.",
    img: TEAM_IMAGES[6],
    features: [
      "زيٌّ سعودي مطرز",
      "خبرة في صبّ القهوة",
      "بروتوكول ترحيب رسمي",
      "تنسيق كامل مع منظم المناسبة",
    ],
    gallery: [TEAM_IMAGES[6], TEAM_IMAGES[3], TEAM_IMAGES[7], TEAM_IMAGES[8], TEAM_IMAGES[10]],
  },
  {
    id: "coffee-ceremony",
    title: "مراسم القهوة العربية",
    subtitle: "Arabic Coffee Ceremony",
    description:
      "نقدّم القهوة من دلال نحاسية وذهبية على الأصول، مع تمر فاخر وفناجين منقوشة — تجربة بصريّة وصوتيّة تترك أثراً.",
    img: TEAM_IMAGES[1],
    features: [
      "قهوة عربية طازجة",
      "دلال نحاسية وذهبية",
      "تمر فاخر مرافق",
      "تقديم على الأصول",
    ],
    gallery: [TEAM_IMAGES[1], TEAM_IMAGES[4], TEAM_IMAGES[7], PRODUCT_IMAGES[8], PRODUCT_IMAGES[2]],
  },
  {
    id: "majlis",
    title: "أركان الضيافة وتجهيزها",
    subtitle: "Hospitality Corner Setup",
    description:
      "نُجهّز ركن قهوة وشاي متكاملاً بألوان وطنيّة، طاولات وضع راقية، وعدّة تقديم ذهبية ومضاءة — جاهز لاستقبال ضيوفك بصورة لا تُنسى.",
    img: SETUP_IMAGES[4],
    features: [
      "تنسيق ركن خاص",
      "إضاءة وتشطيب فاخر",
      "أعلام وطنيّة عند الطلب",
      "توصيل وتركيب",
    ],
    gallery: [SETUP_IMAGES[4], SETUP_IMAGES[2], SETUP_IMAGES[5], SETUP_IMAGES[7], SETUP_IMAGES[8]],
  },
  {
    id: "buffet",
    title: "بوفيهات المشروبات والحلويات",
    subtitle: "Drinks & Sweets Buffet",
    description:
      "بوفيه متكامل يضمّ مشروبات ساخنة، شاي مزهّر، تمراً محشوّاً، معمول، وأبراج تمر بالمكسرات — للاستقبالات والمناسبات الكبرى.",
    img: DATES_IMAGES[0],
    features: [
      "مشروبات متنوعة",
      "تمر وحلويات فاخرة",
      "تنسيق بصري راقي",
      "متابعة فريق مختص",
    ],
    gallery: [DATES_IMAGES[0], DATES_IMAGES[5], DATES_IMAGES[2], DRINK_IMAGES[0], DRINK_IMAGES[1]],
  },
  {
    id: "equipment",
    title: "تأجير عدّة التقديم الذهبية",
    subtitle: "Premium Serving Equipment",
    description:
      "دلال قهوة وشاي ذهبية، صواني تقديم، فناجين مزخرفة، حوامل عرض — كلها من تجهيزاتنا الفاخرة لإيجارها لمناسبتك.",
    img: PRODUCT_IMAGES[2],
    features: [
      "دلال وغلايات ذهبية",
      "أكواب وفناجين منقوشة",
      "صواني وحوامل فاخرة",
      "توصيل واستلام",
    ],
    gallery: [PRODUCT_IMAGES[2], PRODUCT_IMAGES[3], PRODUCT_IMAGES[7], PRODUCT_IMAGES[9], PRODUCT_IMAGES[10]],
  },
  {
    id: "events",
    title: "ضيافة الفعاليات والمؤتمرات",
    subtitle: "Events & Conferences",
    description:
      "نخدم فعاليات الشركات والمؤتمرات والمحافل الحكومية بفريق منضبط، تجهيز سريع، ومستوى تقديم يضع علامة فارقة.",
    img: SETUP_IMAGES[5],
    features: [
      "تجهيز ميداني سريع",
      "فريق منظّم بالكامل",
      "خدمة طويلة الأمد",
      "تنسيق مع منظم المناسبة",
    ],
    gallery: [SETUP_IMAGES[5], SETUP_IMAGES[0], TEAM_IMAGES[2], TEAM_IMAGES[0], SETUP_IMAGES[8]],
  },
];

function Modal({ service, onClose }: { service: ServiceItem; onClose: () => void }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const waMsg = encodeURIComponent(`السلام عليكم، أرغب في الاستفسار عن خدمة: ${service.title}`);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center p-2 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 30 }}
        transition={{ type: "spring", damping: 26, stiffness: 250 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl flex flex-col md:flex-row card-royal"
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-30 w-10 h-10 rounded-full flex items-center justify-center text-pearl/70 hover:text-pearl transition-colors"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)" }}
          aria-label="إغلاق"
        >
          ✕
        </button>

        <div className="relative w-full md:w-1/2 aspect-[4/5] md:aspect-auto md:min-h-[480px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={service.gallery[current]}
                alt={service.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 img-overlay pointer-events-none md:hidden" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:hidden">
            <p className="text-gold-bright text-xs" style={{ letterSpacing: "0.2em" }}>{service.subtitle}</p>
            <h2 className="text-pearl font-amiri" style={{ fontSize: "1.7rem", fontWeight: 700 }}>{service.title}</h2>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-5 sm:p-8 overflow-y-auto bg-onyx/30 backdrop-blur-sm">
          <div className="hidden md:block mb-6">
            <p className="text-gold-bright text-xs" style={{ letterSpacing: "0.2em" }}>{service.subtitle}</p>
            <h2 className="text-pearl font-amiri" style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1.2 }}>{service.title}</h2>
          </div>

          <p className="text-pearl/70 text-sm leading-relaxed">{service.description}</p>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-6">
            {service.features.map((f) => (
              <div key={f} className="flex items-center gap-2 text-pearl/80 text-[12px]">
                <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>

          <div className="pt-6 mt-6 border-t border-gold/15">
            <p className="text-gold-bright text-[10px] font-bold mb-3 tracking-widest">صور من الخدمة</p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {service.gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all duration-300"
                  style={{
                    border: current === i ? "1.5px solid #C5A059" : "1.5px solid rgba(212,175,55,0.15)",
                    opacity: current === i ? 1 : 0.55,
                  }}
                  aria-label={`صورة ${i + 1}`}
                >
                  <Image src={g} alt={imageAlt(g)} fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          <a
            href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 gold-button flex items-center justify-center gap-3 w-full py-4 rounded-full text-sm tracking-widest"
          >
            احجز هذه الخدمة
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ServicesClient() {
  const [selected, setSelected] = useState<ServiceItem | null>(null);

  return (
    <div>
      <Breadcrumbs />

      <section className="relative pt-6 pb-10 px-4 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--gradient-vignette)" }} />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-gold-bright mb-3" style={{ fontSize: "0.75rem", letterSpacing: "0.4em" }}>✦ خدماتنا ✦</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-pearl mb-4 font-amiri" style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 700, lineHeight: 1.15 }}>
            باقات ضيافة على<br /><span className="gold-text">أصول التقديم العربي</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-pearl/65 max-w-xl mx-auto text-sm leading-relaxed">
            من صبّابي القهوة بالزي التراثي إلى تجهيز أركان الضيافة وبوفيهات التمر — كلٌّ بإتقان وذوقٍ لا يُجامل.
          </motion.p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {services.map((s, i) => (
              <motion.button
                key={s.id}
                onClick={() => setSelected(s)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                whileTap={{ scale: 0.97 }}
                className="text-right card-royal overflow-hidden cursor-pointer group"
              >
                <div className="relative aspect-[4/3] overflow-hidden glint">
                  <Image
                    src={s.img}
                    alt={s.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover kenburns-slow"
                  />
                  <div className="absolute inset-0 img-overlay" />
                  <span className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] tracking-widest text-gold-bright" style={{ background: "rgba(10,10,10,0.7)", border: "1px solid rgba(212,175,55,0.3)" }}>
                    {s.subtitle}
                  </span>
                </div>
                <div className="p-3.5 sm:p-6">
                  <h3 className="font-amiri text-pearl mb-1.5 sm:mb-2" style={{ fontSize: "clamp(0.95rem, 3.5vw, 1.15rem)", fontWeight: 700 }}>{s.title}</h3>
                  <p className="text-pearl/60 text-xs sm:text-sm leading-relaxed line-clamp-2">{s.description}</p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center p-8 sm:p-12 rounded-3xl relative overflow-hidden card-royal">
            <h2 className="text-pearl mb-3 font-amiri" style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", fontWeight: 700 }}>
              لم تجد الباقة المثاليّة؟
            </h2>
            <p className="text-pearl/55 text-sm mb-6 max-w-lg mx-auto">صمّم معنا باقة ضيافة خاصة بمناسبتك. فريقنا جاهز للاستشارة.</p>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("السلام عليكم، أرغب في تصميم باقة ضيافة مخصصة.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="gold-button inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm tracking-widest"
            >
              تواصل عبر واتساب
            </a>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selected && <Modal service={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
