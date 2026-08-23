#!/usr/bin/env node
/**
 * قياس تشابه الصفحات (حماية من Doorway) — يقرأ الصفحات من السيرفر المحلي،
 * ينزع الوسوم والسكربتات وهيكل الموقع المشترك، ثم يحسب:
 *  - Jaccard على مستوى الكلمات لكل زوج (الهدف < 0.60)
 *  - نسبة الكلمات الحصرية لكل صفحة (الهدف ≥ 0.25)
 * لا يعتمد على أي مكتبة خارجية.
 *
 * ⚠️ كيف تُقرأ النتيجة — خطأ تفسير حصل فعلًا:
 * 1) Jaccard هو المقياس المعتمَد لخطر Doorway، وهو ثنائي (زوج ↔ زوج)
 *    ولا يتأثر بعدد الصفحات الممرَّرة. اقرأه دائمًا.
 * 2) «الكلمات الحصرية» مقياس نسبي يعتمد على حجم المجموعة: كلمة تُحسب
 *    غير حصرية إن ظهرت في أي صفحة أخرى ضمن الاستدعاء. لذلك تمرير ٤٠
 *    صفحة يخفض النسبة ميكانيكيًا (١٤٪–٢٤٪) بينما تمرير عائلة واحدة
 *    (٣–٥ صفحات تتنافس على نفس الاستعلام فعلًا) يعطي ٤٥٪–٦٥٪ للصفحات
 *    نفسها بلا تغيير حرف واحد في المحتوى.
 *    ⇒ الأساس الصحيح للحكم هو *العائلة* لا كامل الموقع، لأن جوجل
 *      يقارن الصفحات المتنافسة على نفس النية، لا كل صفحات النطاق.
 *    مثال تشغيل صحيح:
 *      node scripts/similarity.mjs sababin-qahwa-jeddah sababin-qahwa-yanbu \
 *        sababin-qahwa-badr sababin-qahwa-madinah sababin-qahwa-makkah
 */
const BASE = process.env.BASE ?? "http://localhost:3000";
const SLUGS = process.argv.slice(2);
if (SLUGS.length < 2) {
  console.error("usage: node scripts/similarity.mjs slug-a slug-b [...]");
  process.exit(1);
}

const strip = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<(header|footer|nav)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;|&#\d+;/gi, " ");

const tokens = (text) =>
  text
    .replace(/[^\u0600-\u06FF\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);

const pages = new Map();
for (const slug of SLUGS) {
  const res = await fetch(`${BASE}/${slug}`);
  if (!res.ok) {
    console.error(`✗ ${slug} → HTTP ${res.status}`);
    continue;
  }
  const words = tokens(strip(await res.text()));
  pages.set(slug, { words, set: new Set(words) });
}

const entries = [...pages.entries()];

console.log("\n── تشابه الأزواج (Jaccard، الهدف < 0.60) ──");
let worst = { pair: "", value: 0 };
for (let i = 0; i < entries.length; i++) {
  for (let j = i + 1; j < entries.length; j++) {
    const [aSlug, a] = entries[i];
    const [bSlug, b] = entries[j];
    let inter = 0;
    for (const w of a.set) if (b.set.has(w)) inter++;
    const union = a.set.size + b.set.size - inter;
    const jac = union ? inter / union : 0;
    if (jac > worst.value) worst = { pair: `${aSlug} ↔ ${bSlug}`, value: jac };
    if (jac >= 0.5) {
      console.log(`${jac >= 0.6 ? "✗" : "⚠"} ${jac.toFixed(3)}  ${aSlug} ↔ ${bSlug}`);
    }
  }
}
console.log(`أعلى تشابه: ${worst.value.toFixed(3)} (${worst.pair})`);

console.log("\n── الكلمات الحصرية لكل صفحة (الهدف ≥ 0.25) ──");
for (const [slug, page] of entries) {
  const others = new Set();
  for (const [s, p] of entries) if (s !== slug) for (const w of p.set) others.add(w);
  let exclusive = 0;
  for (const w of page.set) if (!others.has(w)) exclusive++;
  const ratio = exclusive / page.set.size;
  const mark = ratio >= 0.25 ? "✓" : ratio >= 0.15 ? "⚠" : "✗";
  console.log(`${mark} ${(ratio * 100).toFixed(1)}%  (${exclusive}/${page.set.size})  ${slug}`);
}
console.log("");
