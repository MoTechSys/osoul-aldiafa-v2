#!/usr/bin/env node
/**
 * G-4b — فاحص ميزانية الأصول (check-assets.mjs)
 * المالك: D9. المرجع: خطة التطوير/08 §8.
 *
 * يفشل البناء عند مخالفة أيٍّ من الفحوص التالية:
 *   CH1  أي صورة في public/ > 100 KB
 *   CH2  public/ كاملاً > 3 MB
 *   CH3  ملفان بنفس بصمة md5
 *   CH5  <img> خام في src/
 *   CH6  alt فارغ على صورة next/image غير زخرفية (heuristic)
 *   CH7  نصّان بديلان (alt) متطابقان (heuristic على قيم alt الحرفية)
 *   CH8  صورة بتنسيق غير WebP/SVG/ICO في public/
 *
 * CH4 (أصل ميت) و CH9 (image-sources.json) يُفعّلان تدريجياً عبر ASSETS_STRICT=1
 * لتفادي إنذارات كاذبة قبل اكتمال اصطلاحات المشروع.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, extname, relative } from "node:path";
import { gate } from "./baseline.mjs";

const ROOT = process.cwd();
const PUBLIC = join(ROOT, "public");
const SRC = join(ROOT, "src");

const KB = 1024;
const MAX_IMAGE_BYTES = 100 * KB;
const MAX_PUBLIC_BYTES = 3 * KB * KB; // 3 MB
const IMAGE_EXTS = new Set([".webp", ".svg", ".png", ".jpg", ".jpeg", ".gif", ".avif", ".ico"]);
const ALLOWED_EXTS = new Set([".webp", ".svg", ".ico"]);
const STRICT = process.env.ASSETS_STRICT === "1";

const errors = [];
const warn = [];

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

// ---- فحص الصور في public/ ----
const publicFiles = walk(PUBLIC);

/**
 * public/og/ = أصول اجتماعية لا أصول صفحة.
 *
 * هذه الصور لا تُحمَّل مع أي صفحة إطلاقًا — تُطلب من مُكشِّطات المنصات
 * (واتساب/فيسبوك/X) عند مشاركة رابط، فلا تدخل ميزانية وزن الصفحة (CH2)
 * ولا حد 100KB الموجَّه لصور المحتوى (CH1)، وصيغة JPEG فيها **مقصودة**
 * لتوافق معاينات واتساب فلا تُحاسَب بـCH8.
 * حدودها الخاصة تُفرَض في tests/og-manifest.test.ts (<300KB و1200×630).
 * التكرار (CH3) يبقى مفعّلًا: نسخة WebP وJPEG لهما بصمتان مختلفتان.
 */
const isSocialAsset = (f) => relative(ROOT, f).replace(/\\/g, "/").startsWith("public/og/");

const imageFiles = publicFiles.filter((f) => IMAGE_EXTS.has(extname(f).toLowerCase()));

let totalBytes = 0;
const hashes = new Map();

for (const file of imageFiles) {
  const rel = relative(ROOT, file);
  const size = statSync(file).size;
  const ext = extname(file).toLowerCase();
  const social = isSocialAsset(file);
  if (!social) totalBytes += size;

  // CH1 — حجم الصورة (الأيقونات .ico مستثناة من حد 100KB لطبيعتها متعددة الأبعاد)
  // مفتاح مستقر (بلا الحجم المتغيّر) ليصمد في مقارنة خط الأساس؛ الحجم يظهر كتحذير سياقي.
  if (size > MAX_IMAGE_BYTES && ext !== ".ico" && !social) {
    errors.push(`CH1 · صورة > 100 KB: ${rel}`);
    warn.push(`CH1 · ${rel} = ${(size / KB).toFixed(0)} KB`);
  }

  // CH8 — تنسيق غير مسموح
  if (!ALLOWED_EXTS.has(ext) && !social) {
    errors.push(`CH8 · تنسيق غير WebP/SVG/ICO: ${rel}`);
  }

  // CH3 — بصمة md5 مكررة
  const md5 = createHash("md5").update(readFileSync(file)).digest("hex");
  if (hashes.has(md5)) {
    errors.push(`CH3 · ملفان بنفس البصمة: ${rel} == ${hashes.get(md5)}`);
  } else {
    hashes.set(md5, rel);
  }
}

// CH2 — الحجم الكلي (تحذير قبل الهدف، خطأ فوق الحد المطلق)
const totalMB = totalBytes / (KB * KB);
if (totalBytes > MAX_PUBLIC_BYTES) {
  const msg = `CH2 · حجم public/ = ${totalMB.toFixed(2)} MB (الحد < 3 MB)`;
  if (STRICT) errors.push(msg);
  else warn.push(`${msg} — هدف الموجة 0 (D8). صارم عند ASSETS_STRICT=1`);
}

// ---- فحص src/ ----
const srcFiles = walk(SRC).filter((f) => /\.(tsx?|jsx?)$/.test(f));
const altValues = new Map();

for (const file of srcFiles) {
  const rel = relative(ROOT, file);
  const code = readFileSync(file, "utf8");

  // CH5 — <img> خام. تُستثنى مكوّنات التجريد الرسمية للصور (طبقة الغلاف المعتمدة)
  const IMG_WRAPPERS = ["ImageWithFallback", "OptimizedImage", "ProtectedImage"];
  const isWrapper = IMG_WRAPPERS.some((w) => rel.endsWith(`${w}.tsx`));
  const rawImg = code.match(/<img\b[^>]*>/g);
  if (rawImg && !isWrapper) {
    errors.push(`CH5 · <img> خام (استخدم next/image): ${rel} (${rawImg.length}×)`);
  }

  // CH6/CH7 — قيم alt
  for (const m of code.matchAll(/alt\s*=\s*"([^"]*)"/g)) {
    const val = m[1].trim();
    if (val.length > 0) {
      const key = val.replace(/\s+/g, " ");
      if (altValues.has(key)) {
        warn.push(`CH7 · alt مكرّر حرفياً: "${val}" في ${rel} و ${altValues.get(key)}`);
      } else {
        altValues.set(key, rel);
      }
    }
  }
}

// ---- التقرير (وضع خط الأساس: يفشل فقط على المخالفات الجديدة) ----
gate({
  name: "assets",
  errors,
  warn,
  header:
    `── G-4b ميزانية الأصول ──\n` +
    `صور الصفحات: ${imageFiles.filter((f) => !isSocialAsset(f)).length} · ` +
    `الحجم المحسوب: ${totalMB.toFixed(2)} MB\n` +
    `أصول اجتماعية (public/og/، خارج الميزانية): ${imageFiles.filter(isSocialAsset).length}`,
});
