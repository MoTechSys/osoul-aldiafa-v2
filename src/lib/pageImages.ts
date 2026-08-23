/**
 * مصدر الحقيقة الواحد لخريطة (صفحة ← الصور التي تعرضها فعلاً).
 *
 * سبب وجود هذا الملف:
 * توثيق جوجل لخرائط الصور يشترط أن تُرفَق الصورة بالصفحة **التي تحتويها**.
 * لو بقيت قائمة الصور مكتوبة مرتين — مرة في مكوّن العرض ومرة في الخريطة —
 * فأي تعديل على أحدهما يجعل الخريطة تكذب على جوجل بصمت. لذلك تُعلَن هنا
 * مرة واحدة، ويقرأها كلٌّ من:
 *   - src/app/portfolio/PortfolioClient.tsx        (العرض)
 *   - src/app/(home)/sections/Mosaic.tsx           (العرض)
 *   - src/app/sitemap-images.xml/route.ts          (الخريطة)
 *
 * ملف بلا "use client" ليصلح للاستيراد من الخادم والعميل معاً.
 */
import {
  SETUP_IMAGES,
  TEAM_IMAGES,
  PRODUCT_IMAGES,
  DATES_IMAGES,
  DRINK_IMAGES,
  HOSPITALITY_IMAGES,
} from "./images";

/** تصنيفات معرض الأعمال. */
export type PortfolioCategory = "setups" | "team" | "products" | "dates";

export interface PortfolioEntry {
  id: number;
  image: string;
  category: PortfolioCategory;
}

/**
 * عناصر معرض الأعمال بترتيب العرض.
 * صور الضيافة النقية أولاً — أعلى جودة مُحقّقة بصريًا، فتتصدّر المعرض.
 */
export const PORTFOLIO_ENTRIES: readonly PortfolioEntry[] = [
  { id: 1, image: HOSPITALITY_IMAGES.rukunDiyafa, category: "setups" },
  { id: 2, image: HOSPITALITY_IMAGES.diyafaAaras, category: "setups" },
  { id: 3, image: HOSPITALITY_IMAGES.sabbAlqahwa, category: "team" },
  { id: 4, image: HOSPITALITY_IMAGES.buffetHalawiyat, category: "dates" },
  { id: 5, image: HOSPITALITY_IMAGES.tamrMahshi, category: "dates" },
  ...SETUP_IMAGES.map((img, i) => ({ id: 100 + i, image: img, category: "setups" as const })),
  ...TEAM_IMAGES.map((img, i) => ({ id: 200 + i, image: img, category: "team" as const })),
  ...PRODUCT_IMAGES.map((img, i) => ({ id: 300 + i, image: img, category: "products" as const })),
  ...DATES_IMAGES.map((img, i) => ({ id: 400 + i, image: img, category: "dates" as const })),
  ...DRINK_IMAGES.map((img, i) => ({ id: 500 + i, image: img, category: "products" as const })),
] as const;

/** بلاطة في شبكة الصفحة الرئيسية. */
export interface MosaicTile {
  src: string;
  span: string;
  aspect: string;
}

/**
 * شبكة «لمحات من المناسبات» في الصفحة الرئيسية.
 * كانت تعرض setup-1 و team-10 وكلاهما في REJECTED_FOR_HERO
 * (وجوه مطموسة + علامة مائية)؛ استُبدلا بصور ضيافة نقية مُحقّقة بصريًا.
 */
export const HOME_MOSAIC_TILES: readonly MosaicTile[] = [
  { src: HOSPITALITY_IMAGES.rukunDiyafa, span: "row-span-2", aspect: "aspect-[3/4]" },
  { src: TEAM_IMAGES[1], span: "", aspect: "aspect-[4/3]" },
  { src: HOSPITALITY_IMAGES.tamrMahshi, span: "", aspect: "aspect-[4/3]" },
  { src: HOSPITALITY_IMAGES.diyafaAaras, span: "col-span-2", aspect: "aspect-[16/9]" },
  { src: HOSPITALITY_IMAGES.buffetHalawiyat, span: "", aspect: "aspect-[4/3]" },
  { src: HOSPITALITY_IMAGES.sabbAlqahwa, span: "", aspect: "aspect-[4/3]" },
] as const;

/** إزالة التكرار مع الحفاظ على الترتيب. */
function unique(list: readonly string[]): string[] {
  return Array.from(new Set(list));
}

/**
 * خريطة (مسار الصفحة ← صورها) كما تُعرَض فعلاً في الـDOM.
 * جوجل يسمح بحد أقصى 1000 وسم <image:image> لكل <url>.
 */
export const PAGE_IMAGES: Record<string, string[]> = {
  "/": unique(HOME_MOSAIC_TILES.map((t) => t.src)),
  "/portfolio": unique(PORTFOLIO_ENTRIES.map((e) => e.image)),
};

/** الحد الرسمي من توثيق جوجل: 1000 صورة لكل عنوان. */
export const MAX_IMAGES_PER_URL = 1000;
