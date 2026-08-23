// D4.1: فُكّك الملف الأحادي (830 سطرًا) إلى أقسام مستقلة تحت src/app/(home)/sections/
// كل قسم Client Component صغير قابل للصيانة؛ التركيب هنا فقط.
import { Hero } from "./(home)/sections/Hero";
import { PhotoMarquee } from "./(home)/sections/PhotoMarquee";
import { WhyUs } from "./(home)/sections/WhyUs";
import { Stats } from "./(home)/sections/Stats";
import { Pillars } from "./(home)/sections/Pillars";
import { Mosaic } from "./(home)/sections/Mosaic";
// م-٦ — حُذف <Testimonials /> (آراء مُختلَقة = مخالفة سياسة جوجل المنشورة).
// الملف أُعيد تسميته Testimonials.tsx → Process.tsx لأن «رحلة الحجز» صارت
// محتواه الوحيد؛ التفصيل الكامل والمصدر في رأس ذلك الملف.
import { Process } from "./(home)/sections/Process";
import { FinalCTA } from "./(home)/sections/FinalCTA";

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
