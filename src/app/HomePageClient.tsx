// D4.1: فُكّك الملف الأحادي (830 سطرًا) إلى أقسام مستقلة تحت src/app/(home)/sections/
// كل قسم Client Component صغير قابل للصيانة؛ التركيب هنا فقط.
//
// P-LCP (2026-08-29): الأقسام تحت الطية تُحمَّل عبر next/dynamic (مع بقاء
// SSR مفعّلًا — المحتوى كامل في HTML لأجل SEO). الهدف: تقسيم حزمة JS بحيث
// يترطّب Hero (عنصر LCP) أولًا وتتأخر ترطيبات بقية الأقسام، فينخفض
// Script Evaluation الحاجب على المسار الحرج.
import dynamic from "next/dynamic";
import { Hero } from "./(home)/sections/Hero";

const PhotoMarquee = dynamic(
  () => import("./(home)/sections/PhotoMarquee").then((m) => m.PhotoMarquee)
);
const WhyUs = dynamic(() => import("./(home)/sections/WhyUs").then((m) => m.WhyUs));
const Stats = dynamic(() => import("./(home)/sections/Stats").then((m) => m.Stats));
const Pillars = dynamic(() => import("./(home)/sections/Pillars").then((m) => m.Pillars));
const Mosaic = dynamic(() => import("./(home)/sections/Mosaic").then((m) => m.Mosaic));
// م-٦ — حُذف <Testimonials /> (آراء مُختلَقة = مخالفة سياسة جوجل المنشورة).
// الملف أُعيد تسميته Testimonials.tsx → Process.tsx لأن «رحلة الحجز» صارت
// محتواه الوحيد؛ التفصيل الكامل والمصدر في رأس ذلك الملف.
const Process = dynamic(() => import("./(home)/sections/Process").then((m) => m.Process));
const FinalCTA = dynamic(() => import("./(home)/sections/FinalCTA").then((m) => m.FinalCTA));

export function HomePageClient() {
  return (
    <div className="film-grain">
      <Hero />
      <PhotoMarquee />
      <WhyUs />
      <Stats />
      <Pillars />
      <Mosaic />
      <Process />
      <FinalCTA />
    </div>
  );
}

export default HomePageClient;
