/**
 * بيانات صفحات الخدمات المحلية (خدمة × مدينة) — أصول الضيافة
 * مصدر واحد للحقيقة لكل صفحات الـ SEO المحلية (slug لاتيني، محتوى عربي).
 * يُستهلك من: page.tsx لكل صفحة + sitemap.ts.
 */

export type LocalCity = {
  slug: string; // جزء المدينة في الـ URL (لاتيني)
  ar: string; // اسم المدينة بالعربي
  region: string; // المنطقة الإدارية
  districts: string[]; // أحياء/مناطق فرعية بالاسم (إشارة جغرافية)
  lat?: number;
  lng?: number;
  intro: string; // جملة سياق خاصة بالمدينة
};

export const CITIES: Record<string, LocalCity> = {
  jeddah: {
    slug: "jeddah",
    ar: "جدة",
    region: "منطقة مكة المكرمة",
    districts: [
      "أبحر الشمالية",
      "الشاطئ",
      "الحمراء",
      "الروضة",
      "الصفا",
      "النعيم",
      "الخالدية",
      "الزهراء",
      "البساتين",
      "الحمدانية",
      "أبحر الجنوبية",
      "السلامة",
    ],
    lat: 21.754844,
    lng: 39.207821,
    intro:
      "نخدم عروس البحر الأحمر بكل أحيائها، من أبحر شمالاً حتى الحمدانية، بفريق ضيافة متنقّل جاهز لأي مناسبة.",
  },
  yanbu: {
    slug: "yanbu",
    ar: "ينبع",
    region: "منطقة المدينة المنورة",
    districts: [
      "ينبع البحر",
      "ينبع الصناعية",
      "الهيئة الملكية",
      "دوار السفينة",
      "النواة",
      "الصبيب",
      "شربا",
      "ينبع النخل",
      "الفيصلية",
    ],
    lat: 24.10608,
    lng: 38.045997,
    intro:
      "موطن فرعنا الرئيسي — نغطّي ينبع البحر وينبع الصناعية والهيئة الملكية بخدمة ضيافة حاضرة بسرعة وكفاءة.",
  },
  badr: {
    slug: "badr",
    ar: "بدر",
    region: "منطقة المدينة المنورة",
    districts: [
      "وسط بدر",
      "حي الملك فهد",
      "حي الأمير عبدالمجيد",
      "المخطط الجنوبي",
      "القرى المجاورة",
    ],
    lat: 23.773033,
    lng: 38.796941,
    intro:
      "نخدم محافظة بدر ومراكزها بفريق ضيافة تراثي — خدمة نادرة في المنطقة نوفّرها بأعلى جودة.",
  },
  madinah: {
    slug: "madinah",
    ar: "المدينة المنورة",
    region: "منطقة المدينة المنورة",
    districts: [
      "قباء",
      "العوالي",
      "الحرة الشرقية",
      "شوران",
      "العزيزية",
      "الدفاع",
      "الملك فهد",
      "النصر",
    ],
    lat: 24.524654,
    lng: 39.569184,
    intro:
      "نقدّم ضيافة تليق بمدينة رسول الله ﷺ، لأعراس وفعاليات ومؤتمرات المدينة المنورة وأحيائها.",
  },
  makkah: {
    slug: "makkah",
    ar: "مكة المكرمة",
    region: "منطقة مكة المكرمة",
    districts: [
      "العزيزية",
      "الششة",
      "النسيم",
      "العوالي",
      "الزاهر",
      "الشوقية",
      "الرصيفة",
      "بطحاء قريش",
    ],
    lat: 21.422510,
    lng: 39.826168,
    intro:
      "نخدم مكة المكرمة وأحياءها بضيافة عربية أصيلة لمناسبات أهل مكة وزوّارها.",
  },
};

export type ServiceKind = {
  slug: string; // جزء الخدمة في الـ URL (لاتيني)
  ar: string; // اسم الخدمة بالعربي
  short: string; // وصف قصير
};

export const SERVICES: Record<string, ServiceKind> = {
  "sababin-qahwa": {
    slug: "sababin-qahwa",
    ar: "صبابين قهوة",
    short: "صبّابون وقهوجيون ومباشرون بزي تراثي",
  },
  "diyafa-munasabat": {
    slug: "diyafa-munasabat",
    ar: "ضيافة مناسبات",
    short: "تجهيز ضيافة متكاملة للأعراس والمؤتمرات والفعاليات",
  },
};

/** كل صفحات (خدمة × مدينة) المفعّلة — تُستخدم في sitemap */
export const LOCAL_PAGES: { service: string; city: string }[] = [
  { service: "sababin-qahwa", city: "jeddah" },
  { service: "sababin-qahwa", city: "yanbu" },
  { service: "sababin-qahwa", city: "badr" },
  { service: "sababin-qahwa", city: "madinah" },
  { service: "sababin-qahwa", city: "makkah" },
  { service: "diyafa-munasabat", city: "jeddah" },
  { service: "diyafa-munasabat", city: "yanbu" },
  { service: "diyafa-munasabat", city: "badr" },
  { service: "diyafa-munasabat", city: "madinah" },
  { service: "diyafa-munasabat", city: "makkah" },
];

export function localSlug(service: string, city: string): string {
  return `${service}-${city}`;
}
