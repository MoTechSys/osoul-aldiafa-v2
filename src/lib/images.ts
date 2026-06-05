/**
 * Centralized image paths for أصول الضيافة (Osoul Al-Diafa).
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
export const BRAND_LOGO_GOLD = "/images/hero/logo-gold.webp";
export const BRAND_LOGO_2 = "/images/hero/logo-2.webp";
export const BRAND_POSTER = "/images/poster/poster-1.webp";

// ═══════════════════════════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════════════════════════
export const HERO_IMAGES = {
  desktop: "/images/hero/hero-desktop.webp",
  mobile: "/images/hero/hero-mobile.webp",
  alt1: "/images/hero/hero-alt-1.webp",
  alt2: "/images/hero/hero-alt-2.webp",
};
export const HERO_IMG = HERO_IMAGES.desktop;
export const HERO_MOBILE_IMG = HERO_IMAGES.mobile;

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
