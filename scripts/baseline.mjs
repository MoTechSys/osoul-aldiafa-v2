/**
 * baseline.mjs — وضع «لا مخالفات جديدة» (baseline-diff) للفواحص.
 * المالك: D9.
 *
 * الفكرة: الفواحص تمسح الموقع كله لا الـ diff، فخط الأساس فيه مخالفات موثّقة
 * (34 صورة كبيرة · 41 زوج تشابه · LocalBusiness…) لن تُصلَح إلا بعد اكتمال D8/D2/D3.
 * حتى لا يفشل *كل* PR بسبب دَين موجود مسبقًا، نقارن مخالفات اليوم بلقطة خط أساس
 * مثبّتة في المستودع ونفشل **فقط على المخالفات الجديدة (الانحدارات)**.
 *
 * الاستخدام داخل كل فاحص:
 *   import { gate } from "./baseline.mjs";
 *   gate({ name: "assets", errors, warn });   // يقرر الخروج
 *
 * تحديث خط الأساس بعد إصلاح دفعة (يُشغّله القائد الفني/D9 عمدًا):
 *   UPDATE_BASELINE=1 node scripts/check-assets.mjs
 *
 * كل مخالفة يجب أن تكون **مفتاحًا مستقرًا** (بلا أرقام متغيّرة تُقلّب المطابقة).
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";

const ROOT = process.cwd();
const BASELINE_DIR = join(ROOT, "scripts", "baselines");

function baselinePath(name) {
  return join(BASELINE_DIR, `${name}.json`);
}

function loadBaseline(name) {
  const p = baselinePath(name);
  if (!existsSync(p)) return [];
  try { return JSON.parse(readFileSync(p, "utf8")); } catch { return []; }
}

function saveBaseline(name, keys) {
  mkdirSync(dirname(baselinePath(name)), { recursive: true });
  writeFileSync(baselinePath(name), JSON.stringify([...keys].sort(), null, 2) + "\n", "utf8");
}

/**
 * @param {{name:string, errors:string[], warn?:string[], header?:string}} opts
 * يطبع التقرير ويستدعي process.exit المناسب.
 */
export function gate({ name, errors, warn = [], header }) {
  const update = process.env.UPDATE_BASELINE === "1";
  if (header) console.log(header);

  if (warn.length) {
    console.log(`\n⚠️  تحذيرات (${warn.length}):`);
    warn.forEach((w) => console.log("   • " + w));
  }

  if (update) {
    saveBaseline(name, errors);
    console.log(`\n📌 حُدّث خط أساس «${name}» بـ ${errors.length} مخالفة موثّقة.`);
    return;
  }

  const baseline = new Set(loadBaseline(name));
  const isNew = (e) => !baseline.has(e);
  const regressions = errors.filter(isNew);
  const fixed = [...baseline].filter((b) => !errors.includes(b));

  console.log(`\nخط الأساس «${name}»: ${baseline.size} مخالفة موثّقة · الآن: ${errors.length}`);
  if (fixed.length) console.log(`✅ أُصلحت ${fixed.length} مخالفة من خط الأساس — أحسنت.`);

  if (regressions.length) {
    console.error(`\n❌ ${regressions.length} مخالفة **جديدة** (انحدار عن خط الأساس):`);
    regressions.forEach((e) => console.error("   • " + e));
    console.error(`\nالقاعدة: لا مخالفات جديدة. أصلحها، أو إن كانت إصلاحًا مقصودًا لدفعة كاملة حدّث خط الأساس عبر UPDATE_BASELINE=1 بموافقة القائد الفني.`);
    process.exit(1);
  }

  console.log(`\n✅ لا مخالفات جديدة فوق خط الأساس «${name}».`);
}
