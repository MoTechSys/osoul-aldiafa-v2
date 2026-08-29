import { MetadataRoute } from "next";
import { execSync } from "node:child_process";
import { LOCAL_PAGES, localSlug } from "@/lib/localPages";
import { SERVICE_HUB_SLUGS } from "@/lib/serviceHubs";
import { SUB_PAGES, subPagePriority, subPageSource } from "@/lib/pages/registry";
import { SITE_URL } from "@/lib/constants";

/**
 * D1.4 — lastmod ديناميكي وصادق:
 * يُشتق وقت آخر تعديل من تاريخ git الفعلي لملفات مصدر كل صفحة وقت البناء.
 * - لا `new Date()`: كل بناء لا يغيّر lastmod ما لم يتغيّر المصدر فعلاً.
 * - لا تاريخ ثابت مكتوب يدوياً: التاريخ يعكس آخر commit لمس مصدر الصفحة.
 */
function gitLastModified(paths: string[]): string | undefined {
  if (isShallowClone()) return undefined; // انظر التعليق في isShallowClone
  try {
    const out = execSync(
      `git log -1 --format=%cI -- ${paths.map((p) => JSON.stringify(p)).join(" ")}`,
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
    ).trim();
    return out ? out.slice(0, 10) : undefined;
  } catch {
    return undefined; // بيئة بلا git (نادر): نُسقط lastmod بدل الكذب فيه
  }
}

/**
 * عيب مُثبَت: Vercel يستنسخ المستودع بعمق 1 (shallow clone). في هذه الحالة
 * `git log -1` ينجح لكنه يُرجع **نفس** تاريخ الـcommit الوحيد لكل الملفات،
 * فتخرج كل الصفحات بـ lastmod متطابق — وهذا تضليل لجوجل لا مجرد نقص.
 *
 * السياسة: إن كان الاستنساخ سطحيًا نُسقط lastmod كليًا. غياب الحقل مسموح
 * في معيار sitemaps.org، أما تاريخ خاطئ فيُضعف الثقة بالخريطة كلها.
 * الحل الجذري (خارج الكود): ضبط VERCEL_DEEP_CLONE / git fetch --unshallow.
 */
let shallowCache: boolean | undefined;
function isShallowClone(): boolean {
  if (shallowCache !== undefined) return shallowCache;
  try {
    const out = execSync("git rev-parse --is-shallow-repository", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    shallowCache = out === "true";
  } catch {
    shallowCache = false;
  }
  return shallowCache;
}

// المصادر المشتركة التي يغيّر تعديلها محتوى كل الصفحات المحلية/المحاور
const LOCAL_SOURCES = ["src/lib/localContent.tsx", "src/lib/localPages.ts", "src/components/LocalServicePage.tsx"];
const HUB_SOURCES = ["src/lib/hubContent.tsx", "src/lib/serviceHubs.ts", "src/components/LocalServicePage.tsx"];
const SUB_SOURCES = [
  "src/lib/pages/registry.ts",
  "src/lib/pages/kit.ts",
  "src/components/local/blocks.tsx",
  "src/components/LocalServicePage.tsx",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const coreRoutes = [
    { path: "/", sources: ["src/app/page.tsx", "src/app/HomePageClient.tsx"], priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/services", sources: ["src/app/services"], priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/offerings", sources: ["src/app/offerings"], priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/portfolio", sources: ["src/app/portfolio"], priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/about", sources: ["src/app/about"], priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact", sources: ["src/app/contact"], priority: 0.8, changeFrequency: "monthly" as const },
    // صفحة الروابط: بوابة التواصل السريع التي تُلصق في «bio» الحسابات
    // الاجتماعية. أولويتها ٠٫٧ لا ٠٫٩: هي صفحة تحويل لا صفحة محتوى،
    // فلا نريدها تنافس /services على كلمات البحث الرئيسية.
    { path: "/links", sources: ["src/app/links", "src/lib/linksPlatforms.ts"], priority: 0.7, changeFrequency: "monthly" as const },
    // الصفحات القانونية: أولوية منخفضة (ليست هدف بحث) لكن فهرستها مطلوبة
    // لأن جوجل أدس تتحقق من وجودها فعليًا عند مراجعة تجربة صفحة الوصول.
    { path: "/privacy", sources: ["src/app/privacy", "src/components/LegalPage.tsx"], priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/terms", sources: ["src/app/terms", "src/components/LegalPage.tsx"], priority: 0.3, changeFrequency: "yearly" as const },
  ];

  // صفحات (خدمة × مدينة) — أولوية عالية لاستهداف الكلمات المحلية،
  // وجدة وينبع تأخذان الأعلى (قرار المالك 2026-08-29: تركيز SEO عليهما).
  const localRoutes = LOCAL_PAGES.map((p) => ({
    path: `/${localSlug(p.service, p.city)}`,
    sources: ["src/app/[serviceCity]", ...LOCAL_SOURCES],
    priority: p.city === "jeddah" || p.city === "yanbu" ? 0.95 : 0.9,
    changeFrequency: "weekly" as const,
  }));

  const hubRoutes = SERVICE_HUB_SLUGS.map((slug) => ({
    path: `/${slug}`,
    sources: [`src/app/${slug}`, ...HUB_SOURCES],
    priority: 0.85,
    changeFrequency: "weekly" as const,
  }));

  // الصفحات الفرعية العميقة (السجل الموحّد) — كل صفحة تُشتق lastmod من ملف مدينتها
  const subRoutes = SUB_PAGES.map((page) => ({
    path: `/${page.slug}`,
    sources: [subPageSource(page.slug) ?? "src/lib/pages/registry.ts", ...SUB_SOURCES],
    priority: subPagePriority(page),
    changeFrequency: "weekly" as const,
  }));

  // ملاحظة مُثبَتة بالمصدر: Next 14.2.35 لا يدعم خرائط الصور في sitemap.ts.
  // المُولّد node_modules/next/dist/build/webpack/loaders/metadata/resolve-route-data.js
  // (دالة resolveSitemap) يُصدر loc / xhtml:link / lastmod / changefreq / priority فقط،
  // ونوع MetadataRoute.Sitemap لا يحتوي حقل images أصلاً. لذلك خريطة الصور
  // مُنفَّذة يدويًا في src/app/sitemap-images.xml/route.ts وفق معيار جوجل.
  return [...coreRoutes, ...hubRoutes, ...localRoutes, ...subRoutes].map((route) => {
    const lastModified = gitLastModified(route.sources);
    return {
      url: `${SITE_URL}${route.path}`,
      ...(lastModified && { lastModified }),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    };
  });
}
