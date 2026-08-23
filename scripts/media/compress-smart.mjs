#!/usr/bin/env node
/**
 * الضغط الذكي للصور — compress-smart.mjs
 * المالك: D9. المرجع: docs/04-research/06-معيار-ضغط-الصور.md
 *
 * لماذا «ذكي»؟ لأن المعايير العالمية تنصّ صراحة على أنه **لا يوجد إعداد واحد
 * يصلح لكل الصور**، فالسكربت يبحث عن أفضل إعداد لكل صورة على حدة:
 *
 *  المرجع ١ — Lighthouse (uses-optimized-images):
 *    «تضبط مستوى الضغط على 85، وتقارن، وتُعلِم الصورة إن كان الوفر ≥ 4 KiB».
 *    ⇒ لذلك نبدأ من جودة 85 (الأساس الرسمي) ولا نهبط إلا عند الحاجة.
 *
 *  المرجع ٢ — web.dev/articles/compress-images:
 *    «there is no one universal setting» + «be careful not to **overcompress**»
 *    + «Remove unnecessary image metadata» + «Serve scaled images».
 *    ⇒ لذلك: (أ) حرس جودة يمنع التمادي، (ب) -strip، (ج) تصغير الأبعاد.
 *
 *  المرجع ٣ — WebP Compression Study (Google):
 *    تستخدم **SSIM** كمقياس للجودة. وبما أنّ Butteraugli غير متوفّر في البيئة،
 *    نستخدم SSIM عبر ImageMagick `compare` — وهو نفس مقياس دراسة جوجل.
 *
 * الخوارزمية لكل صورة:
 *   1. قصّ «نافذة نظيفة» مقيسة بصرياً (لا نسب تخمينية) — يرفع الفخامة
 *      ويقلّل البايتات معاً. النافذة تُقاس بمسطرة نسبية فوق الأصل، ثم
 *      تُسجَّل هنا كحدود: أعلى% / أسفل% / إزاحة جانبية%.
 *      الإزاحة الجانبية تحذف خطوط الإطار الذهبية الرقيقة على الحواف.
 *   2. -strip لحذف البيانات الوصفية (EXIF).
 *   3. تصغير إلى أقصى بعد مسموح (Serve scaled images).
 *   4. بناء مرجع PNG بلا خسارة = «الحقيقة» التي نقيس عليها،
 *      حتى نفصل خسارة الضغط عن خسارة التصغير.
 *   5. البحث الهابط: 85 → 82 → 80 → 78 → 76 → 74 → 72
 *      نتوقف عند أول جودة تُحقّق الحجم المستهدف **مع** SSIM ≥ الأرضية.
 *   6. إن لم يتحقّق الهدف: نصغّر الأبعاد خطوة (بدل سحق الجودة) ونعيد.
 *      هذا هو جوهر «لا تضغط بإفراط» — نتنازل عن البكسلات لا عن النقاء.
 *   7. إن استُنفدت الخطوات: نُبلِغ بالفشل ولا نكتب ملفاً رديئاً.
 *
 * الحدود مستمدّة من بوابة G-4b (scripts/check-assets.mjs):
 *   CH1: أي صورة > 100 KB ⇒ فشل البناء ⇒ هدفنا 92 KB بهامش أمان.
 *   CH8: WebP فقط.
 *
 * الاستخدام:
 *   node scripts/media/compress-smart.mjs --manifest <file.tsv> [--dry-run]
 *   صيغة السطر (مفصولة بـ Tab):
 *     <مسار المصدر>\t<المخرج النسبي>\t<أعلى%>\t<أسفل%>\t<جانب%>
 *   حيث: أعلى% = بداية المنطقة النظيفة، أسفل% = نهايتها (100 = حتى الحافة)،
 *        جانب% = إزاحة من كل جانب لحذف خطوط الإطار.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync, statSync, rmSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const KB = 1024;

/** سقف الحجم المستهدف — أقل من CH1 (100KB) بهامش أمان. */
const TARGET_BYTES = 92 * KB;
/** أرضية الجودة: تحت هذا الرقم يُعتبر الضغط «مفرطاً» ونرفضه. */
const SSIM_FLOOR = 0.94;
/** سلّم الجودة — يبدأ من أساس Lighthouse الرسمي (85). */
const QUALITY_LADDER = [85, 82, 80, 78, 76, 74, 72];
/** سلّم الأبعاد — نتنازل عن البكسلات قبل أن نتنازل عن النقاء. */
const DIMENSION_LADDER = [1200, 1100, 1000, 900, 800];

const TMP = "/tmp/.compress-smart";

function sh(bin, args) {
  return execFileSync(bin, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
}

/** يقيس SSIM بين مرجع ومخرج. 1.0 = تطابق تام. */
function ssim(refPath, outPath) {
  try {
    execFileSync("compare", ["-metric", "SSIM", refPath, outPath, "null:"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return 1;
  } catch (err) {
    const text = String(err.stderr || err.stdout || "");
    const match = text.match(/^([0-9.]+)/);
    return match ? parseFloat(match[1]) : NaN;
  }
}

/** أبعاد الأصل بالبكسل. */
function sourceDimensions(src) {
  const [w, h] = sh("identify", ["-format", "%w %h", src]).trim().split(/\s+/).map(Number);
  return { width: w, height: h };
}

/**
 * يحوّل النافذة النظيفة المقيسة (نِسَب) إلى هندسة قصّ بالبكسل.
 * نحسب بالبكسل لا بالنِّسَب لأن ImageMagick يقرّب النِّسَب فتنجو
 * شرائح بكسل من خط الإطار الذهبي على الحافة.
 */
function cropGeometry(src, { top, bottom, side }) {
  const { width, height } = sourceDimensions(src);
  const y = Math.round((height * top) / 100);
  const h = Math.round((height * (bottom - top)) / 100);
  const x = Math.round((width * side) / 100);
  const w = Math.round((width * (100 - 2 * side)) / 100);
  return { geometry: `${w}x${h}+${x}+${y}`, w, h };
}

/**
 * يبني مرجعاً PNG بلا خسارة بعد القصّ والتصغير.
 * هذا المرجع هو ما نقيس عليه، لعزل خسارة الضغط عن خسارة التصغير.
 */
function buildReference(src, refOut, { top, bottom, side, maxDim }) {
  const { geometry } = cropGeometry(src, { top, bottom, side });
  sh("convert", [
    src,
    "-strip",
    "-auto-orient",
    "-crop", geometry,
    "+repage",
    "-resize", `${maxDim}x${maxDim}>`,
    "-quality", "100",
    refOut,
  ]);
}

/** يرمّز WebP بأفضل إعدادات libwebp لحفاظ الحواف (النص العربي المحروق). */
function encodeWebp(refPath, outPath, quality) {
  sh("convert", [
    refPath,
    "-strip",
    "-define", "webp:method=6",          // أبطأ ترميز = أصغر حجم لنفس الجودة
    "-define", "webp:use-sharp-yuv=true", // يحفظ حِدّة الحواف والنص
    "-quality", String(quality),
    outPath,
  ]);
}

/**
 * البحث الذكي: نجرب الجودة تنازلياً، ثم الأبعاد تنازلياً.
 * نُعيد أفضل نتيجة تحقّق (الحجم ≤ الهدف) و(SSIM ≥ الأرضية).
 */
function findBestEncoding(src, absOut, opts) {
  mkdirSync(TMP, { recursive: true });
  const refPath = join(TMP, "ref.png");
  const tryPath = join(TMP, "try.webp");
  const attempts = [];

  for (const maxDim of DIMENSION_LADDER) {
    buildReference(src, refPath, { ...opts, maxDim });

    for (const quality of QUALITY_LADDER) {
      encodeWebp(refPath, tryPath, quality);
      const bytes = statSync(tryPath).size;
      const score = ssim(refPath, tryPath);
      attempts.push({ maxDim, quality, bytes, score });

      // الشرط المزدوج: صغير بما يكفي **و** نقي بما يكفي.
      if (bytes <= TARGET_BYTES && score >= SSIM_FLOOR) {
        sh("cp", [tryPath, absOut]);
        const dims = sh("identify", ["-format", "%wx%h", absOut]).trim();
        return { ok: true, maxDim, quality, bytes, score, dims, attempts };
      }
      // لو الجودة نزلت تحت الأرضية فلا جدوى من مزيد هبوط — صغّر الأبعاد.
      if (score < SSIM_FLOOR) break;
    }
  }
  return { ok: false, attempts };
}

function parseManifest(path) {
  return readFileSync(path, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const [src, out, top = "0", bottom = "100", side = "0"] = line.split("\t");
      return { src, out, top: Number(top), bottom: Number(bottom), side: Number(side) };
    });
}

function main() {
  const argv = process.argv.slice(2);
  const manifestPath = argv[argv.indexOf("--manifest") + 1];
  const dryRun = argv.includes("--dry-run");

  if (!manifestPath || !existsSync(manifestPath)) {
    console.error("الاستخدام: node scripts/media/compress-smart.mjs --manifest <file.tsv> [--dry-run]");
    process.exit(2);
  }

  const rows = parseManifest(manifestPath);
  const publicDir = resolve(process.cwd(), "public");

  console.log("الضغط الذكي — المعيار: Lighthouse q85 + حرس SSIM (منع الضغط المفرط)");
  console.log(`الهدف ≤ ${(TARGET_BYTES / KB).toFixed(0)} KB · أرضية SSIM ${SSIM_FLOOR} · ${rows.length} صورة\n`);

  let totalBefore = 0;
  let totalAfter = 0;
  const failures = [];

  for (const row of rows) {
    if (!existsSync(row.src)) {
      failures.push(`${row.out} — المصدر غير موجود`);
      continue;
    }
    const before = statSync(row.src).size;
    const absOut = join(publicDir, row.out);
    mkdirSync(dirname(absOut), { recursive: true });

    if (dryRun) {
      console.log(`[تجربة] ${row.out}  (${(before / KB).toFixed(0)} KB)`);
      continue;
    }

    const result = findBestEncoding(row.src, absOut, row);
    if (!result.ok) {
      const best = result.attempts[result.attempts.length - 1];
      failures.push(
        `${row.out} — تعذّر تحقيق الهدف بلا ضغط مفرط ` +
          `(أفضل محاولة: ${(best.bytes / KB).toFixed(0)}KB · SSIM ${best.score.toFixed(4)})`
      );
      continue;
    }

    totalBefore += before;
    totalAfter += result.bytes;
    const saved = (100 * (1 - result.bytes / before)).toFixed(0);
    console.log(
      `✅ ${row.out.padEnd(42)} ${String(Math.round(before / KB)).padStart(4)}KB → ` +
        `${String(Math.round(result.bytes / KB)).padStart(3)}KB  (وفر ${saved}%)  ` +
        `${result.dims} · q${result.quality} · SSIM ${result.score.toFixed(4)}`
    );
  }

  if (!dryRun && totalBefore > 0) {
    console.log(
      `\nالإجمالي: ${(totalBefore / KB / KB).toFixed(2)} MB → ${(totalAfter / KB / KB).toFixed(2)} MB ` +
        `(وفر ${(100 * (1 - totalAfter / totalBefore)).toFixed(0)}%)`
    );
  }

  if (failures.length) {
    console.error(`\n❌ ${failures.length} فشل — لم نكتب ملفاً رديئاً (القاعدة: لا ضغط مفرط):`);
    failures.forEach((f) => console.error("   • " + f));
    process.exit(1);
  }

  if (existsSync(TMP)) rmSync(TMP, { recursive: true, force: true });
  console.log("\n✅ تمّ. القاعدة المحفوظة: لا صورة تحت أرضية SSIM، ولا صورة فوق الهدف.");
}

main();
