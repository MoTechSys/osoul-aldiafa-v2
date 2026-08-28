/**
 * خريطة صور يدوية — G-SEO.
 *
 * لماذا يدويًا؟ عيب مُثبَت بالمصدر: Next 14.2.35 لا يدعم خرائط الصور في
 * sitemap.ts. المُولّد
 *   node_modules/next/dist/build/webpack/loaders/metadata/resolve-route-data.js
 * (دالة resolveSitemap) يُصدر loc / xhtml:link / lastmod / changefreq / priority
 * فقط، ونوع MetadataRoute.Sitemap لا يحتوي حقل images أصلاً. أي حقل images
 * يُمرَّر هناك يُتجاهَل بصمت (تحقّقنا: صفر وسم image:image في الخرج).
 *
 * المعيار المُتّبع — توثيق جوجل الرسمي «Image sitemaps»:
 *   https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
 *   • النطاق: xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
 *   • الوسمان المطلوبان فقط: <image:image> و <image:loc>
 *   • حد أقصى 1000 <image:image> لكل <url>
 *   • مهجورة ولا تُستخدم: image:caption / image:title / image:geo_location / image:license
 *   • «You can create a separate image sitemap … either approach is equally fine»
 *     لذلك خريطة منفصلة سليمة معياريًا، وتُعلَن في robots.txt.
 */
import { SITE_URL } from "@/lib/constants";
import { PAGE_IMAGES, MAX_IMAGES_PER_URL } from "@/lib/pageImages";
import ogManifest from "@/data/og-manifest.json";

/**
 * دمج صور OG المخصّصة في خريطة الصور القائمة (لا ملف منفصل ثانٍ):
 * توثيق جوجل يقبل الطريقتين، والدمج يبقي مصدرًا واحدًا للصور ويُغني عن
 * سطر Sitemap إضافي في robots.txt. نضيف نسخة WebP فقط للفهرسة (JPEG نسخة
 * توافق للمعاينات الاجتماعية لا للبحث، وإدراج الاثنتين يُنتج تكرارًا).
 */
const OG_BY_PATH = new Map<string, string>(
  (ogManifest as { path: string; image: string }[]).map((e) => [e.path, e.image])
);

export const dynamic = "force-static";

/** تهريب الأحرف الخمسة المحجوزة في XML — عنوان بمحرف & يُفسد الملف كله. */
function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** عنوان مطلق: معيار sitemaps.org يشترط عناوين كاملة لا نسبية. */
function absolute(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

export function GET(): Response {
  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
  ];

  const paths = new Set([...Object.keys(PAGE_IMAGES), ...OG_BY_PATH.keys()]);
  for (const path of paths) {
    const ogImage = OG_BY_PATH.get(path);
    const images = [
      ...(PAGE_IMAGES[path as keyof typeof PAGE_IMAGES] ?? []),
      ...(ogImage ? [ogImage] : []),
    ];
    if (images.length === 0) continue; // <url> بلا صور لا معنى له في خريطة صور
    lines.push("  <url>");
    lines.push(`    <loc>${xmlEscape(absolute(path))}</loc>`);
    for (const src of images.slice(0, MAX_IMAGES_PER_URL)) {
      lines.push("    <image:image>");
      lines.push(`      <image:loc>${xmlEscape(absolute(src))}</image:loc>`);
      lines.push("    </image:image>");
    }
    lines.push("  </url>");
  }

  lines.push("</urlset>");

  return new Response(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
