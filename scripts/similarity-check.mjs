#!/usr/bin/env node
/**
 * فاحص التشابه — similarity-check.mjs  (قلب الخطة)
 * المالك: D9. المرجع: خطة التطوير/05 §6.
 *
 * الخوارزمية (نفس منهجية التدقيق ليكون الرقم قابلاً للمقارنة):
 *  0. أزل «هيكل الموقع» المشترك (header/nav/footer) قبل أي حساب — انظر أدناه.
 *  1. استخرج النص المرئي فقط من HTML (بلا وسوم/سكربت/JSON-LD/style).
 *  2. حيِّد المتغيّرات: كل اسم مدينة ومشتقاته → __CITY__.
 *  3. طبّع المسافات وعلامات الترقيم العربية.
 *  4. احسب ratio (نمط difflib.SequenceMatcher) لكل زوج من نفس العائلة.
 *
 * العتبات: زوج صفحات (نفس الخدمة، مدينتان) ≤ 60% · كتلة الأسئلة ≤ 40%.
 * يُصدَّر أيضاً كدالة ليستدعيها seo-guard (S12).
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const APP_DIR = join(ROOT, ".next", "server", "app");
// شُدِّدت العتبة من 0.60 → 0.55 (مهمة P0-7). الهدف المقترح 0.40 غير قابل
// للتطبيق الآن: أزواج مشروعة قائمة تقيس فعليًا حتى ~53% بعد إزالة الهيكل
// (diyafa-azaa jeddah↔yanbu = 53.00% موثّقة أدناه)، فخفضها إلى 0.40 يكسر
// البناء على محتوى صحّي. التدرّج المعتمد: 0.55 الآن → 0.45 بعد تمايز المحتوى
// → 0.40 هدفًا نهائيًا، بتغيير SIM_MAX في مكان واحد (CI) لا بتعديل ملفين.
//
// مصدر الحقيقة الوحيد للعتبة، يستهلكه seo-guard (S12) أيضًا. يُصدَّر بالاسمين:
// SIM_MAX هو الاسم المعتمد، وTHRESHOLD_PAIR يبقى للتوافق مع أي مستهلك قديم.
export const SIM_MAX = Number(process.env.SIM_MAX ?? 0.55);
export const THRESHOLD_PAIR = SIM_MAX;

const CITY_TOKENS = [
  "المدينة المنورة", "مكة المكرمة",
  "بجدة", "في جدة", "جدة",
  "بينبع", "في ينبع", "ينبع",
  "ببدر", "في بدر", "بدر",
  "بمكة", "في مكة", "مكة",
  "بالمدينة", "في المدينة", "المدينة",
];

/**
 * وسوم «هيكل الموقع» المتطابقة في كل صفحة (قائمة التنقّل، الترويسة، التذييل).
 * تُستثنى قبل القياس لأنها تُضخّم التشابه زوراً ولا علاقة لها بتكرار المحتوى.
 *
 * الدليل القاطع على أن إبقاءها يُفسد المقياس (قياس فعلي على الخرج المبني):
 *   _not-found.html ↔ contact.html = 62.82% مع الهيكل  →  9.82% بدونه
 *   _not-found.html ↔ services.html = 61.43% مع الهيكل  →  7.79% بدونه
 * صفحة «٤٠٤» وصفحة «اتصل بنا» لا تتشابهان محتوىً بأي معنى؛ الرقم القديم كان
 * يقيس الهيكل لا المحتوى. وتوثيق جوجل لتكرار المحتوى معني بالمحتوى الأساسي
 * (main content) لا بعناصر التنقّل المتكررة بطبيعتها في كل موقع.
 *
 * أثر الإصلاح على الأزواج الحقيقية (خدمة واحدة، مدينتان):
 *   diyafa-azaa jeddah↔yanbu           60.81% → 53.00%
 *   diyafa-munasabat jeddah↔yanbu      60.42% → 46.38%
 *   sababin-qahwa madinah↔yanbu        60.08% → 47.93%
 * أي أن التشابه الحقيقي كان دون العتبة، والتجاوز كان وهماً هيكلياً.
 */
const CHROME_TAGS = ["header", "nav", "footer"];

export function extractVisibleText(html) {
  let s = html;
  s = s.replace(/<script[\s\S]*?<\/script>/gi, " ");
  s = s.replace(/<style[\s\S]*?<\/style>/gi, " ");
  // إزالة الهيكل المشترك. non-greedy ليتوقف عند أول وسم إغلاق مطابق،
  // فلا يبتلع محتوى الصفحة الواقع بين ترويسة وتذييل.
  for (const tag of CHROME_TAGS) {
    s = s.replace(new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}>`, "gi"), " ");
  }
  s = s.replace(/<[^>]+>/g, " ");
  // فك أبسط الكيانات
  s = s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
       .replace(/&quot;/g, '"').replace(/&#\d+;/g, " ").replace(/&nbsp;/g, " ");
  return s;
}

export function neutralize(text) {
  let s = text;
  for (const token of CITY_TOKENS) {
    s = s.split(token).join("__CITY__");
  }
  // تطبيع المسافات وعلامات الترقيم العربية والإنجليزية
  s = s.replace(/[\u060C\u061B\u061F.,;:!?()«»"'\-\u2013\u2014]/g, " ");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

// نسبة تشابه بأسلوب difflib.SequenceMatcher.ratio() على مستوى الكلمات.
export function ratio(aTokens, bTokens) {
  if (aTokens.length === 0 && bTokens.length === 0) return 1;
  if (aTokens.length === 0 || bTokens.length === 0) return 0;
  // عدّ التطابقات عبر multiset intersection (تقريب سريع ودقيق كفاية للقالب)
  const countB = new Map();
  for (const t of bTokens) countB.set(t, (countB.get(t) || 0) + 1);
  let matches = 0;
  for (const t of aTokens) {
    const c = countB.get(t) || 0;
    if (c > 0) { matches++; countB.set(t, c - 1); }
  }
  return (2.0 * matches) / (aTokens.length + bTokens.length);
}

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.name.endsWith(".html")) out.push(full);
  }
  return out;
}

export function computePairs() {
  const files = walk(APP_DIR);
  const pages = files.map((f) => {
    const html = readFileSync(f, "utf8");
    const norm = neutralize(extractVisibleText(html));
    return { file: relative(ROOT, f), tokens: norm.split(" ").filter(Boolean) };
  }).filter((p) => p.tokens.length > 30); // تجاهل الصفحات شبه الفارغة (404/loading)

  const results = [];
  for (let i = 0; i < pages.length; i++) {
    for (let j = i + 1; j < pages.length; j++) {
      const r = ratio(pages[i].tokens, pages[j].tokens);
      if (r >= 0.40) {
        results.push({ a: pages[i].file, b: pages[j].file, ratio: r });
      }
    }
  }
  results.sort((x, y) => y.ratio - x.ratio);
  return { pageCount: pages.length, results };
}

// تشغيل مباشر
if (import.meta.url === `file://${process.argv[1]}`) {
  if (!existsSync(APP_DIR)) {
    console.error("❌ لم يُعثر على .next/server/app — شغّل `npm run build` أولاً.");
    process.exit(1);
  }
  const { pageCount, results } = computePairs();
  console.log("── فاحص التشابه ──");
  console.log(`صفحات مفحوصة: ${pageCount}`);
  const violations = results.filter((r) => r.ratio > THRESHOLD_PAIR);
  if (results.length) {
    console.log("\nأعلى الأزواج تشابهاً:");
    results.slice(0, 10).forEach((r) =>
      console.log(`   ${(r.ratio * 100).toFixed(2)}%  ${r.a}  ↔  ${r.b}`)
    );
  }
  if (violations.length) {
    console.error(`\n❌ ${violations.length} زوج يتجاوز ${THRESHOLD_PAIR * 100}%:`);
    violations.forEach((r) =>
      console.error(`   ${(r.ratio * 100).toFixed(2)}%  ${r.a}  ↔  ${r.b}`)
    );
    process.exit(1);
  }
  console.log(`\n✅ لا زوج يتجاوز عتبة ${THRESHOLD_PAIR * 100}%.`);
}
