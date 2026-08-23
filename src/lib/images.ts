/**
 * Centralized image paths for أصول الضيافة (Asoul Al-Diafa).
 * All assets served locally from public/images/.
 *
 * Categories:
 *   hero/      → brand + hero shots
 *   team/      → 11 host / pourer photos (فريق)
 *   products/  → 11 dallah / cup / tray product shots (منتج)
 *   setups/    → 10 event setup / buffet shots (تجهيز)
 *   dates/     → 7 date & sweets shots (تمر-حلويات)
 *   drinks/    → 3 beverage shots (مشروبات)
 *   poster/    → brand poster (إعلان)
 */

// ═══════════════════════════════════════════════════════════════
// BRAND
// ═══════════════════════════════════════════════════════════════
export const BRAND_LOGO = "/logo.webp";
export const BRAND_LOGO_GOLD = "/logo.webp"; // dedup: identical file (md5 2d56512e…)
export const BRAND_LOGO_2 = "/logo.webp"; // dedup: identical file (md5 2d56512e…)
export const BRAND_POSTER = "/images/poster/poster-1.webp";

// ═══════════════════════════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════════════════════════
// dedup: hero/* files were byte-identical copies of these originals
//
// ⚠️⚠️ لا تستخدم HERO_IMAGES.desktop في موضع البطل (LCP).
// setup-5.webp فيها وجوه مطموسة (censored) ولا تصلح لأول ما يراه الزائر.
// المصدر الصحيح للبطل هو HERO_SAFE في أسفل هذا الملف (setup-9).
// أُبقيت HERO_IMAGES هنا لأن alt1/alt2 مستخدمتان في مواضع ثانوية،
// وحُذف التصديران الميتان HERO_IMG / HERO_MOBILE_IMG (لا مستهلك لهما)
// لأنهما كانا يسرّبان الصورة المطموسة لأي مستهلك مستقبلي.
export const HERO_IMAGES = {
  /** @deprecated وجوه مطموسة — استخدم HERO_SAFE.desktop */
  desktop: "/images/setups/setup-5.webp",
  mobile: "/images/setups/setup-10.webp",
  alt1: "/images/products/product-9.webp",
  alt2: "/images/team/team-10.webp",
};

// ═══════════════════════════════════════════════════════════════
// TEAM (hosts / pourers in traditional dress)
// ═══════════════════════════════════════════════════════════════
export const TEAM_IMAGES = Array.from(
  { length: 11 },
  (_, i) => `/images/team/team-${i + 1}.webp`
);

// ═══════════════════════════════════════════════════════════════
// PRODUCTS (golden dallahs, cups, trays)
// ═══════════════════════════════════════════════════════════════
export const PRODUCT_IMAGES = Array.from(
  { length: 11 },
  (_, i) => `/images/products/product-${i + 1}.webp`
);

// ═══════════════════════════════════════════════════════════════
// SETUPS (buffets, hospitality corners, event tables)
// ═══════════════════════════════════════════════════════════════
export const SETUP_IMAGES = Array.from(
  { length: 10 },
  (_, i) => `/images/setups/setup-${i + 1}.webp`
);

// ═══════════════════════════════════════════════════════════════
// DATES & SWEETS
// ═══════════════════════════════════════════════════════════════
export const DATES_IMAGES = Array.from(
  { length: 7 },
  (_, i) => `/images/dates/dates-${i + 1}.webp`
);

// ═══════════════════════════════════════════════════════════════
// DRINKS (hot & ornamental drink stations)
// ═══════════════════════════════════════════════════════════════
export const DRINK_IMAGES = Array.from(
  { length: 3 },
  (_, i) => `/images/drinks/drink-${i + 1}.webp`
);

// ═══════════════════════════════════════════════════════════════
// PORTFOLIO — aggregate gallery of all real photos
// (excludes brand logos / posters)
// ═══════════════════════════════════════════════════════════════
export const PORTFOLIO_IMAGES = [
  ...SETUP_IMAGES,
  ...TEAM_IMAGES,
  ...PRODUCT_IMAGES,
  ...DATES_IMAGES,
  ...DRINK_IMAGES,
];

// ═══════════════════════════════════════════════════════════════
// SERVICE PILLAR THUMBNAILS
// ═══════════════════════════════════════════════════════════════
export const SERVICE_IMAGES = {
  hosts: TEAM_IMAGES[2],          // فريق_03 - uniformed team
  pourers: TEAM_IMAGES[6],        // فريق_07 - embroidered pourers
  setups: SETUP_IMAGES[0],        // تجهيز_01 - setup w/ hosts
  drinks: DRINK_IMAGES[0],        // مشروبات_01 - hot drinks station
  dates: DATES_IMAGES[5],         // برج التمر بالمكسرات
  products: PRODUCT_IMAGES[2],    // golden coffee dallah
  ceremony: TEAM_IMAGES[1],       // مجلس فخم
  vipMajlis: SETUP_IMAGES[4],     // ركن ضيافة بالعلم السعودي
};

// ═══════════════════════════════════════════════════════════════
// QUICK SHORTCUTS (legacy names retained)
// ═══════════════════════════════════════════════════════════════
export const COFFEE_IMG = PRODUCT_IMAGES[8];   // dallah w/ cups & coffee
export const TEA_IMG = DRINK_IMAGES[2];        // golden tea tray
export const CATERING_IMG = SETUP_IMAGES[2];   // hospitality corner
export const EVENT_IMG = SETUP_IMAGES[5];      // coffee hall
export const WAITER_IMG = TEAM_IMAGES[4];      // host serving tea
export const EQUIP_IMG = PRODUCT_IMAGES[0];    // golden tray
export const GALA_IMG = SETUP_IMAGES[5];
export const HOTEL_IMG = SETUP_IMAGES[2];
export const DATES_IMG = DATES_IMAGES[5];
export const FOOD_IMG = DATES_IMAGES[0];
export const PORTFOLIO_IMG = SETUP_IMAGES[0];
export const KITCHEN_IMG = PRODUCT_IMAGES[5];
export const TEAM_IMG = TEAM_IMAGES[0];
export const CONF_IMG = SETUP_IMAGES[5];

// ═══════════════════════════════════════════════════════════════
// OFFERINGS — visible cards on /offerings (every card has a real photo)
// ═══════════════════════════════════════════════════════════════
export interface OfferingCard {
  id: string;
  title: string;
  desc: string;
  img: string;
}

export const OFFERINGS_COFFEE_TEA: OfferingCard[] = [
  { id: "arabic-coffee", title: "القهوة العربية", desc: "قهوة سعودية أصيلة تقدم من دلال ذهبية فاخرة", img: PRODUCT_IMAGES[8] },
  { id: "saudi-tea", title: "الشاي السعودي", desc: "شاي أحمر مع النعناع في صواني ذهبية", img: DRINK_IMAGES[2] },
  { id: "hot-station", title: "ركن المشروبات الساخنة", desc: "محطة كاملة لمشروبات الترحيب", img: DRINK_IMAGES[0] },
  { id: "tea-pots", title: "أباريق الشاي الفاخرة", desc: "أباريق وغلايات بتشطيبات راقية", img: PRODUCT_IMAGES[10] },
];

export const OFFERINGS_DATES_SWEETS: OfferingCard[] = [
  { id: "premium-dates", title: "التمور الفاخرة", desc: "أطباق تمر مزينة مع المكسرات والشوكولاتة", img: DATES_IMAGES[1] },
  { id: "stuffed-dates", title: "تمر محشو ومغلف", desc: "علب تمر فاخرة مغلفة لتقديم هدايا الضيافة", img: DATES_IMAGES[2] },
  { id: "maamoul", title: "المعمول الفاخر", desc: "حلويات المعمول مغلفة بشرائط ذهبية", img: DATES_IMAGES[3] },
  { id: "date-tower", title: "برج التمر بالمكسرات", desc: "عرض تقديم بانورامي يخطف الأنظار", img: DATES_IMAGES[5] },
  { id: "sweets-buffet", title: "بوفيه الحلويات", desc: "بوفيه شامل للمشروبات والحلويات والتمر", img: DATES_IMAGES[0] },
];

export const OFFERINGS_SERVING: OfferingCard[] = [
  { id: "gold-tray", title: "صواني تقديم ذهبية", desc: "صواني فاخرة بتطعيمات ذهبية", img: PRODUCT_IMAGES[0] },
  { id: "coffee-set", title: "طقم تقديم القهوة", desc: "طقم متكامل لمراسم القهوة الملكية", img: PRODUCT_IMAGES[1] },
  { id: "gold-dallah", title: "دلال القهوة الذهبية", desc: "دلال ذهبية لامعة بتصميم تراثي راقي", img: PRODUCT_IMAGES[2] },
  { id: "tea-dallah", title: "دلال شاي ذهبية وفضية", desc: "تشكيلة دلال شاي بتشطيبات معدنية فاخرة", img: PRODUCT_IMAGES[3] },
  { id: "glass-cups", title: "أكواب زجاجية مذهبة", desc: "أكواب راقية بتطعيمات ذهبية", img: PRODUCT_IMAGES[4] },
  { id: "ornate-cups", title: "أكواب مزخرفة بالذهب", desc: "أكواب بزخارف ذهبية يدوية فاخرة", img: PRODUCT_IMAGES[7] },
  { id: "gold-stands", title: "حوامل ودلال ذهبية", desc: "حوامل بأشكال ملكية للعرض الراقي", img: PRODUCT_IMAGES[9] },
  { id: "coffee-pour", title: "تقديم القهوة العربية", desc: "فناجين وكاسات مع دلة قهوة طازجة", img: PRODUCT_IMAGES[8] },
];

export const OFFERINGS_ALL = [
  ...OFFERINGS_COFFEE_TEA,
  ...OFFERINGS_DATES_SWEETS,
  ...OFFERINGS_SERVING,
];

// ═════════════════════════════════════════════════════════════════
// ALT MAP — نصوص alt وصفية غنية بـ SEO لكل صورة (عربي)
// تستخدمها imageAlt(src) حيثما كان alt فارغاً.
// ═════════════════════════════════════════════════════════════════
export const IMAGE_ALT: Record<string, string> = {
  "/logo.webp": "شعار أصول الضيافة - خدمات الضيافة الفاخرة في السعودية",
  "/images/poster/poster-1.webp": "أصول الضيافة - تنسيق المناسبات والحفلات بالقهوة العربية والشاي",
  "/images/drinks/drink-1.webp": "ركن ضيافة فاخر بأنواع الشاي والقهوة العربية والفناجين الفضية لحفلات أصول الضيافة",
  "/images/drinks/drink-2.webp": "أباريق شاي زجاجية ذهبية فاخرة لتقديم المشروبات في مناسبات الضيافة السعودية",
  "/images/drinks/drink-3.webp": "تقديم الشاي في أكواب استكانة ذهبية ضمن خدمة الضيافة السعودية الراقية",
  "/images/dates/dates-1.webp": "ركن ضيافة متكامل بالمشروبات والحلويات والتمور للحفلات والمناسبات",
  "/images/dates/dates-2.webp": "طبق تمور محشي فاخر مزين بالمكسرات وجوز الهند لضيافة المناسبات",
  "/images/dates/dates-3.webp": "طبق تمور محشي مغلّف مزين بالفستق والمكسرات هدية مثالية للضيافة",
  "/images/dates/dates-4.webp": "أطباق معمول فاخرة مغلّفة بشرائط أنيقة هدايا للأعراس والمناسبات",
  "/images/dates/dates-5.webp": "طبق تمر محشو بالمكسرات والفستق واللوز لضيافة المناسبات السعودية",
  "/images/dates/dates-6.webp": "برج تمر فاخر مزين بالورد والمكسرات مع دلة ذهبية للضيافة العربية",
  "/images/dates/dates-7.webp": "طبق تمر سعودي فاخر مع العسل والقشطة لضيافة الأعراس والمناسبات",
  "/images/products/product-1.webp": "صينية تقديم ذهبية مزخرفة لتقديم القهوة والتمر في الضيافة السعودية",
  "/images/products/product-2.webp": "طقم ضيافة سعودي كامل دلال ذهبية وفناجين قهوة وأكواب شاي للمناسبات",
  "/images/products/product-3.webp": "دلال قهوة عربية ذهبية فاخرة ومباخر للضيافة التراثية السعودية",
  "/images/products/product-4.webp": "دلال قهوة عربية ذهبية وفضية مصفوفة لتقديم القهوة العربية من أصول الضيافة",
  "/images/products/product-5.webp": "طقم فناجين قهوة عربية زجاجية بحواف ذهبية في علبة فاخرة من أصول الضيافة",
  "/images/products/product-6.webp": "دلال قهوة ذهبية وبراريد شاي ستيل لضيافة المناسبات من أصول الضيافة",
  "/images/products/product-7.webp": "دلال قهوة عربية ذهبية فاخرة بتصميم تراثي لضيافة الأفراح",
  "/images/products/product-8.webp": "طقم فناجين قهوة زجاجية بنقوش ذهبية فاخرة في علبة هدايا من أصول الضيافة",
  "/images/products/product-9.webp": "دلة وفنجان قهوة عربية ذهبية مع حبوب البن والهيل تجسد الضيافة العربية",
  "/images/products/product-10.webp": "مباخر بخور نحاسية ذهبية ودلال قهوة عربية بنقش النخلة والسيفين - أصول الضيافة",
  "/images/products/product-11.webp": "دلال قهوة عربية ذهبية وأباريق شاي للضيافة السعودية - أصول الضيافة",
  "/images/setups/setup-1.webp": "ركن ضيافة سعودي بمباشرين بالزي التراثي وأباريق شاي وحلويات - أصول الضيافة",
  "/images/setups/setup-2.webp": "تجهيز طاولة ضيافة سعودية بأباريق شاي وقهوة وتمر ومياه - أصول الضيافة",
  "/images/setups/setup-3.webp": "بوفيه ضيافة سعودي بأباريق شاي ودلال ذهبية وأكواب تقديم - أصول الضيافة",
  "/images/setups/setup-4.webp": "مباشرو ضيافة سعوديون بالزي التراثي وطاولة شاي وقهوة في قاعة أفراح",
  "/images/setups/setup-5.webp": "مباشرو ضيافة سعودية بالزي التقليدي مع دلال قهوة وأباريق شاي وعلم السعودية في حفل",
  "/images/setups/setup-6.webp": "طاولات ضيافة قهوة عربية بدلال فضية وفناجين وورود في قاعة أفراح فاخرة",
  "/images/setups/setup-7.webp": "فناجين قهوة عربية بشعار النخلة والسيفين على صينية ذهبية مع دلال للضيافة",
  "/images/setups/setup-8.webp": "ركن ضيافة شاي وقهوة بأباريق ملونة وشوكولاتة وتمر لحفل مناسبات خارجي",
  "/images/setups/setup-9.webp": "بوفيه شاي وقهوة عربية بأباريق ملونة ودلال ذهبية وعلم السعودية في قاعة فاخرة",
  "/images/setups/setup-10.webp": "أباريق شاي زجاجية ملونة على قواعد فضية بجانب علم المملكة في ضيافة سعودية",
  "/images/team/team-1.webp": "صبابين قهوة سعوديين بالزي الشعبي المزخرف والشماغ الأحمر - أصول الضيافة",
  "/images/team/team-2.webp": "مضيفون يصبّون القهوة العربية بالدلة الذهبية في مجلس فاخر - خدمات ضيافة سعودية",
  "/images/team/team-3.webp": "فريق صبابين بالثوب الأبيض والحزام الجلدي لخدمة المناسبات الكبرى - أصول الضيافة",
  "/images/team/team-4.webp": "مضيفون بالبشت المطرّز الفضي والشماغ السعودي لاستقبال الضيوف - أصول الضيافة",
  "/images/team/team-5.webp": "صباب قهوة سعودي يقدّم الشاي بصينية ذهبية وزي مطرّز - خدمات ضيافة احترافية",
  "/images/team/team-6.webp": "مضيفون شباب بالزي المطرّز الفاخر لخدمة الحفلات والمناسبات - أصول الضيافة",
  "/images/team/team-7.webp": "صبابين قهوة عربية بالزي السعودي التراثي في قاعة مناسبات فاخرة - أصول الضيافة",
  "/images/team/team-8.webp": "صباب قهوة عربية يقدم القهوة من دلة ذهبية في حفل مسائي - أصول الضيافة",
  "/images/team/team-9.webp": "مضيف ضيافة سعودي بثوب مطرز يحمل دلة القهوة الذهبية - فريق أصول الضيافة",
  "/images/team/team-10.webp": "فريق صبابين ومضيفي أصول الضيافة بالزي السعودي الموحد في قاعة فاخرة للمناسبات",
  "/images/team/team-11.webp": "صبابين قهوة بالزي التراثي يحملان الدلال الذهبية لتقديم القهوة العربية - أصول الضيافة",
};

/** يرجع alt وصفي غني بـ SEO لمسار صورة، مع fallback آمن. */
export function imageAlt(src: string, fallback = "أصول الضيافة - خدمات الضيافة السعودية الفاخرة"): string {
  return IMAGE_ALT[src] ?? CLEAN_ALT[src] ?? HOSPITALITY_ALT[src] ?? fallback;
}

// ═══════════════════════════════════════════════════════════════════
//  CURATED — المجموعة المنتقاة بعد فرز بصري لكل الـ43 صورة
//
//  لماذا نحتاج هذه القائمة؟ لأن الأرشيف الحالي مختلط الجودة:
//    · product-1  ⇒ الصينية داخل صندوق بلاستيك أزرق
//    · product-11 · dates-2 ⇒ لقطات شاشة جوال بأشرطة واجهة ظاهرة
//    · team-10 · team-11 · setup-1 · setup-4 · setup-5 ⇒ وجوه مطموسة بمربعات
//    · setup-3 (ممر مول) · setup-8 (بالونات) ⇒ خلفيات خارج هوية العلامة
//  الصورة المعطوبة في مكان بطولي تُلغي أثر التصميم كله.
//
//  CLEAN_IMAGES = نسخ مُصلَّحة فعليًا (قص + تنظيف + ضغط ذكي ≤70KB).
//  PREMIUM_*    = ما يُسمح بظهوره في المواضع البطولية فقط.
// ═══════════════════════════════════════════════════════════════════

/** النسخ المُنظَّفة — قُصّت لإزالة العيوب ثم أُعيد ضغطها بذكاء */
export const CLEAN_IMAGES = {
  /** صف دلال ذهبية — قُصّ شريط واجهة الجوال (من product-11) */
  dallahRow: "/images/clean/dallah-row-gold.webp",
  /** برج تمر — قُصّ إطار الجوال وأيقوناته (من dates-2) */
  datesTower: "/images/clean/dates-tower.webp",
  /** طاولة ضيافة بالعلم — قُصّت الوجوه المطموسة (من setup-5) */
  setupTable: "/images/clean/setup-table-flag.webp",
  /** نسيج ذهبي مصقول — قُصّ من داخل الصينية بلا صندوق بلاستيك (من product-1) */
  goldTexture: "/images/clean/gold-texture.webp",
} as const;

// ═══════════════════════════════════════════════════════════════════
//  صور الضيافة (hospitality) — أنقى مجموعة في المشروع
//
//  المصدر: تصاميم تسويقية أصلية (٦٧ صورة) فُحصت واحدة واحدة بصريًا.
//  رُفضت ٦٢ منها (نصّ محروق، وجوه مطموسة، شعارات، إطارات ذهبية)،
//  ونجت ٥ فقط بعد قياس «النافذة النظيفة» بمسطرة نسبية على كل صورة
//  ثم القصّ بالبكسل — لا بالتخمين. راجع docs/04-research/06.
//
//  كل ملف هنا اجتاز فحصًا صارمًا: صفر نصّ، صفر شعار، صفر خط إطار،
//  قصّ طبيعي، وبلا آثار ضغط. الحجم ≤ 91KB و SSIM ≥ 0.954.
// ═══════════════════════════════════════════════════════════════════

/** صور الضيافة النقية — تصلح لكل المواضع بلا استثناء */
export const HOSPITALITY_IMAGES = {
  /**
   * ركن ضيافة: دلة ذهبية + ٣ فناجين بحافة ذهبية + طبق تمر على رخام داكن
   * 1200×884 · 87KB — بديلة (استبدال ٢٢ أغسطس، أمر المالك س٤)
   */
  sabbAlqahwa: "/images/hospitality/rukn-diyafa-dallah-dhahabiya-wa-fanajin.webp",
  /**
   * حامل ذهبي ثلاثي الطوابق بالمعمول والحلويات بالفستق والتمر
   * 1200×912 · 62KB — بديلة (استبدال ٢٢ أغسطس، أمر المالك س٤)
   */
  buffetHalawiyat: "/images/hospitality/halawiyat-wa-tamr-ala-hamil-dhahabi.webp",
  /** قهوجي بالثوب والشماغ يسكب في ركن ضيافة فخم — 1037×1190 · 87KB */
  rukunDiyafa: "/images/hospitality/qahwaji-yasub-fi-rukn-diyafa.webp",
  /**
   * دلّتان مزخرفتان + منديل كتّان + وعاء تمر ذهبي على كونسول رخام في مجلس
   * 1037×1190 · 84KB — بديلة (استبدال ٢٢ أغسطس، أمر المالك س٤)
   */
  diyafaAaras: "/images/hospitality/rukn-diyafa-dilal-wa-tamr-fi-majlis.webp",
  /** تمر محشو بالفستق واللوز والجوز مقرَّب — 1200×1192 · 89KB */
  tamrMahshi: "/images/hospitality/tamr-mahshi-bilfustuq-wallawz.webp",
} as const;

/** ترتيب معرض — من الأقوى بصريًا إلى الأقل */
export const HOSPITALITY_GALLERY = [
  HOSPITALITY_IMAGES.rukunDiyafa,
  HOSPITALITY_IMAGES.diyafaAaras,
  HOSPITALITY_IMAGES.buffetHalawiyat,
  HOSPITALITY_IMAGES.sabbAlqahwa,
  HOSPITALITY_IMAGES.tamrMahshi,
] as const;

/** تجهيزات نظيفة الخلفية — تصلح للمواضع البطولية */
export const PREMIUM_SETUPS = [
  "/images/setups/setup-7.webp",  // فناجين النخلة والسيفين على صينية ذهبية
  "/images/setups/setup-9.webp",  // أباريق ملونة + دلال + علم في قاعة
  "/images/setups/setup-10.webp", // أباريق زجاجية على قواعد فضية + العلم
  "/images/setups/setup-6.webp",  // طاولات قاعة أفراح بدلال فضية
  "/images/setups/setup-2.webp",  // تجهيز طاولة كامل
] as const;

/** أدوات ضيافة معدنية — لقطات المنتج الأنظف */
export const PREMIUM_PRODUCTS = [
  "/images/products/product-9.webp",  // دلة + فنجان + بن وهيل (أفضل لقطة إضاءة)
  "/images/products/product-3.webp",  // صف دلال ذهبية ومباخر
  "/images/products/product-4.webp",  // دلال ذهبية وفضية مصفوفة
  "/images/products/product-2.webp",  // طقم ضيافة كامل
  "/images/products/product-6.webp",  // دلال ذهبية + براريد ستيل
  "/images/products/product-10.webp", // مباخر نحاسية + نقش النخلة والسيفين
] as const;

/** تمور وحلويات نظيفة */
export const PREMIUM_DATES = [
  "/images/dates/dates-3.webp",  // طبق تمر محشي بالفستق
  "/images/dates/dates-1.webp",  // ركن ضيافة متكامل
  "/images/dates/dates-6.webp",  // برج تمر بالورد + دلة ذهبية
] as const;

/** مشروبات */
export const PREMIUM_DRINKS = [
  "/images/drinks/drink-3.webp", // صينية استكانات ذهبية محمولة
  "/images/drinks/drink-1.webp", // ركن شاي وقهوة + العلم
  "/images/drinks/drink-2.webp", // أباريق زجاجية ذهبية + ورود
] as const;

/**
 * صور البطل الآمنة — تحل مشكلة HERO_IMAGES.desktop
 * الذي كان يشير إلى setup-5 (وجوه مطموسة) في موضع LCP.
 */
export const HERO_SAFE = {
  desktop: "/images/setups/setup-9.webp",
  mobile: "/images/setups/setup-10.webp",
  detail: "/images/products/product-9.webp",
  texture: CLEAN_IMAGES.goldTexture,
} as const;

/** كل ما يُمنع من المواضع البطولية (عيب بصري مُثبَت) */
export const REJECTED_FOR_HERO = [
  "/images/products/product-1.webp",  // صندوق بلاستيك أزرق
  "/images/products/product-11.webp", // لقطة شاشة جوال
  "/images/dates/dates-2.webp",       // لقطة شاشة جوال
  "/images/team/team-10.webp",        // وجوه مطموسة + علامة مائية
  "/images/team/team-11.webp",        // وجوه مطموسة
  "/images/setups/setup-1.webp",      // وجوه مطموسة
  "/images/setups/setup-4.webp",      // وجوه مطموسة
  "/images/setups/setup-5.webp",      // وجوه مطموسة
  "/images/setups/setup-3.webp",      // ممر مول
  "/images/setups/setup-8.webp",      // بالونات
] as const;

// ═══ alt للصور المُنظَّفة ═══
export const CLEAN_ALT: Record<string, string> = {
  "/images/clean/dallah-row-gold.webp":
    "صف دلال قهوة عربية ذهبية وبراريد شاي معدنية جاهزة لخدمة ضيافة المناسبات - أصول الضيافة",
  "/images/clean/dates-tower.webp":
    "برج تمر محشو بالفستق وجوز الهند على طبق مزخرف بحواف ذهبية لضيافة الأعراس - أصول الضيافة",
  "/images/clean/setup-table-flag.webp":
    "طاولة ضيافة سعودية بأباريق شاي ملونة ودلال ذهبية وفناجين مرتبة لحفل - أصول الضيافة",
  "/images/clean/gold-texture.webp":
    "سطح صينية تقديم ذهبية مصقولة بزخارف نباتية محفورة - أدوات ضيافة أصول الضيافة",
};

// ═══ alt لصور الضيافة — كل نصّ فريد (يمنع مخالفة CH7) ═══
export const HOSPITALITY_ALT: Record<string, string> = {
  "/images/hospitality/rukn-diyafa-dallah-dhahabiya-wa-fanajin.webp":
    "دلة قهوة عربية ذهبية منقوشة مع ثلاثة فناجين بحافة ذهبية وطبق تمر بالفستق على سطح رخام داكن",
  "/images/hospitality/halawiyat-wa-tamr-ala-hamil-dhahabi.webp":
    "حامل تقديم ذهبي ثلاثي الطوابق محمّل بالمعمول وحلويات الفستق والتمر في ركن ضيافة فاخر",
  "/images/hospitality/qahwaji-yasub-fi-rukn-diyafa.webp":
    "قهوجي بالثوب والشماغ يصبّ القهوة من دلة ذهبية في ركن ضيافة فخم مع أطباق تمر ومعمول",
  "/images/hospitality/rukn-diyafa-dilal-wa-tamr-fi-majlis.webp":
    "دلّتان مزخرفتان بنقوش ذهبية ومنديل كتّان ووعاء تمر ذهبي على كونسول رخام أسود داخل مجلس مضاء",
  "/images/hospitality/tamr-mahshi-bilfustuq-wallawz.webp":
    "تمر محشو بالفستق الحلبي ورقائق اللوز وحبات الجوز في طبق تقديم أبيض مزخرف",
};
