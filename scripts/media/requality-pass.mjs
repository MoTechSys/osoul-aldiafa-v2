#!/usr/bin/env node
/**
 * تمريرة إعادة ضغط خفيفة — requality-pass.mjs
 * الهدف: النزول بحجم public/ تحت 3MB (هدف الموجة 0 / CH2) دون المساس بالفخامة.
 * متوافقة مع معيار docs/04-research/06-معيار-ضغط-الصور.md:
 *  - نبدأ من q85 وننزل تدريجياً (82→78→75)
 *  - حارس جودة SSIM عبر ImageMagick compare (نفس مقياس دراسة جوجل)
 *  - نقبل النتيجة فقط إذا SSIM ≥ 0.985 والوفر ≥ 4KiB (عتبة Lighthouse)
 */
import { execSync } from "node:child_process";
import { readdirSync, statSync, copyFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";
import sharp from "sharp";

const ROOT = new URL("../../public", import.meta.url).pathname;
const MIN_SAVING = 4096; // 4KiB — عتبة Lighthouse
const MIN_SSIM = 0.985;  // حارس الفخامة
const QUALITIES = [85, 82, 78, 75];

function* walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

function ssim(a, b) {
  try {
    const out = execSync(
      `compare -metric SSIM "${a}" "${b}" null: 2>&1 || true`,
      { encoding: "utf8" }
    ).trim();
    const m = out.match(/([\d.]+)/);
    return m ? parseFloat(m[1]) : 0;
  } catch {
    return 0;
  }
}

const files = [...walk(ROOT)]
  .filter((f) => extname(f) === ".webp")
  .map((f) => ({ f, size: statSync(f).size }))
  .sort((a, b) => b.size - a.size);

let totalSaved = 0;
for (const { f, size } of files) {
  if (size < 40 * 1024) continue; // الصغيرة لا تستحق
  let best = null;
  for (const q of QUALITIES) {
    const tmp = f + `.tmp-q${q}.webp`;
    await sharp(f).webp({ quality: q, effort: 6 }).toFile(tmp);
    const newSize = statSync(tmp).size;
    if (size - newSize < MIN_SAVING) { unlinkSync(tmp); continue; }
    const s = ssim(f, tmp);
    if (s >= MIN_SSIM) { if (best) unlinkSync(best.tmp); best = { tmp, newSize, q, s }; }
    else { unlinkSync(tmp); break; } // الجودة الأدنى ستكون أسوأ — توقف
  }
  if (best) {
    copyFileSync(best.tmp, f);
    unlinkSync(best.tmp);
    totalSaved += size - best.newSize;
    console.log(
      `✓ ${f.replace(ROOT, "")} ${(size / 1024).toFixed(0)}K → ${(best.newSize / 1024).toFixed(0)}K (q${best.q}, SSIM ${best.s.toFixed(4)})`
    );
  }
}
console.log(`\nالوفر الكلي: ${(totalSaved / 1024).toFixed(0)} KiB`);
