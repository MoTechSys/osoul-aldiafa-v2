#!/usr/bin/env node
/**
 * G-5 — فاحص السيو والمحتوى (seo-guard.mjs)
 * المالك: D9. المرجع: خطة التطوير/05 §5 (12 فحصاً) + §6 (التشابه).
 * يعمل على مخرَج `next build` الستاتيكي في .next/server/app/*.html
 *
 * S1  طول <title> > 60 أو < 30
 * S2  تكرار العلامة «أصول الضيافة» مرتين في نفس العنوان
 * S3  عنوانان متطابقان في صفحتين
 * S4  meta description غائب/ < 120 / > 158 / مكرر حرفياً
 * S5  H1 ≠ 1 · فارغ · كلمات ملتصقة حول <br>
 * S6  قفزة عناوين h2 → h4
 * S7  canonical غائب/لا يطابق المسار/بروتوكول-دومين خاطئ
 * S8  JSON-LD لا يمرّ JSON.parse · يحتوي LocalBusiness · يحتوي address
 * S9  كلمات محظورة: فرع/فروعنا/مقرنا (R2)
 * S10 أرقام غير موثّقة: «+N مناسبة» أو «N% رضا» بلا data/proof.json (R9)
 * S11 روابط داخلية < 3 · أو نص رابط عام
 * S12 التشابه > 55% (يستدعي similarity-check)
 * S14 روابط sameAs في JSON-LD تُرجع 200 (شبكي — يُفعَّل بـ CHECK_LINKS=1)
 * S15 عدد المناطق المعروض في الواجهة = عدد areaServed/serviceArea في JSON-LD
 * S16 og:image لكل صفحة في og-manifest: مطلق · تحت /og/ · alt مطابق · JPEG أولًا
 * S17 صفر صفحة من صفحات manifest بقيت على og-image.jpg (منع تغطية جزئية)
 * S18 الصفحات خارج manifest تبقى على الصورة الاحتياطية (منع اختراع صور)
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
// العتبة تأتي من similarity-check (مصدر الحقيقة الوحيد) — لا تُعرَّف هنا.
// بعد توحيد الحزمتين في فرع واحد صار الاسم SIM_MAX مؤكَّد الوجود، فسقط
// احتياط «اقبل الاسمين» الذي كان لازمًا حين كان ترتيب الدمج غير محسوم.
import { computePairs, SIM_MAX } from "./similarity-check.mjs";
import { gate } from "./baseline.mjs";

const ROOT = process.cwd();
const APP_DIR = join(ROOT, ".next", "server", "app");
const BRAND = "أصول الضيافة";
const BANNED = ["فروعنا", "مقرنا", "فرعنا", "فرع ", "فروع "];
const GENERIC_LINK_TEXT = ["اضغط هنا", "المزيد", "انقر هنا", "هنا", "اقرأ المزيد"];

if (!existsSync(APP_DIR)) {
  console.error("❌ لم يُعثر على .next/server/app — شغّل `npm run build` أولاً.");
  process.exit(1);
}

let proof = { claims: [] };
const proofPath = join(ROOT, "data", "proof.json");
if (existsSync(proofPath)) {
  try { proof = JSON.parse(readFileSync(proofPath, "utf8")); } catch { /* تجاهل */ }
}

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.name.endsWith(".html")) out.push(full);
  }
  return out;
}

function pick(re, html) { const m = html.match(re); return m ? m[1].trim() : null; }
function textOf(s) { return s ? s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() : ""; }

/**
 * حزمة AEO: الـlayout صار يصدر رسمًا موحدًا `{"@graph":[...]}` بدل كتل
 * مفردة. أي فحص يمشي على «عقد» JSON-LD يجب أن يفكّ الرسم أولًا وإلا صار
 * أعمى عن كل ما بداخله (S14 كان سيتوقف عن رؤية sameAs وS15 عن areaServed).
 */
function ldNodes(parsed) {
  const top = Array.isArray(parsed) ? parsed : [parsed];
  const out = [];
  for (const n of top) {
    if (n && Array.isArray(n["@graph"])) out.push(...n["@graph"]);
    else if (n) out.push(n);
  }
  return out;
}

const files = walk(APP_DIR);
const errors = [];
const warn = [];
const titles = new Map();
const descs = new Map();

for (const file of files) {
  const rel = relative(ROOT, file);
  const html = readFileSync(file, "utf8");
  const isDoc = /<html[\s>]/i.test(html);
  if (!isDoc) continue; // تجاهل أجزاء RSC غير الكاملة

  const bare = rel.replace(/^\.next\/server\/app\//, "").replace(/\.html$/, "");
  // تجاهل صفحات النظام
  if (/^(_not-found|_global-error|404|500|robots|sitemap|opengraph-image)/.test(bare)) continue;

  /**
   * تجاهل صفحات noindex.
   * المرجع الرسمي — Google «Block search indexing with noindex»:
   *   https://developers.google.com/search/docs/crawling-indexing/block-indexing
   *   «Google will drop that page entirely from Google Search results»
   * فحص طول العنوان/الوصف على صفحة مُسقَطة كليًا من النتائج إنذار كاذب:
   *   نصٌّ لا يُعرَض قطّ لا يمكن أن يكون قصيرًا "أمام المستخدم".
   * أُدخِل هذا الاستثناء بعد أن أطلقت /luxe-demo (noindex, nofollow) تحذير
   * S4 «description 53 حرفاً» بلا أي أثر واقعي على الظهور في البحث.
   */
  const robotsMeta =
    pick(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i, html) ||
    pick(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']robots["']/i, html);
  if (robotsMeta && /\bnoindex\b/i.test(robotsMeta)) continue;

  // ---- S1/S2/S3 title ----
  const rawTitle = pick(/<title[^>]*>([\s\S]*?)<\/title>/i, html);
  const title = textOf(rawTitle);
  if (!title) {
    errors.push(`S1 · ${bare}: <title> غائب`);
  } else {
    if (title.length > 60) { errors.push(`S1 · ${bare}: title > 60`); warn.push(`S1 · ${bare}: title ${title.length} حرفاً: «${title}»`); }
    if (title.length < 30) warn.push(`S1 · ${bare}: title ${title.length} حرفاً (< 30): «${title}»`);
    const brandCount = title.split(BRAND).length - 1;
    if (brandCount >= 2) errors.push(`S2 · ${bare}: تكرار العلامة في العنوان`);
    if (titles.has(title)) errors.push(`S3 · ${bare}: title مطابق لـ ${titles.get(title)}`);
    else titles.set(title, bare);
  }

  // ---- S4 description ----
  const desc = pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i, html)
            || pick(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i, html);
  if (!desc) {
    errors.push(`S4 · ${bare}: meta description غائب`);
  } else {
    if (desc.length < 120) warn.push(`S4 · ${bare}: description ${desc.length} حرفاً (< 120)`);
    if (desc.length > 158) { errors.push(`S4 · ${bare}: description > 158`); warn.push(`S4 · ${bare}: description ${desc.length} حرفاً`); }
    if (descs.has(desc)) errors.push(`S4 · ${bare}: description مطابق حرفياً لـ ${descs.get(desc)}`);
    else descs.set(desc, bare);
  }

  // ---- S5 H1 ----
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
  if (h1s.length !== 1) {
    errors.push(`S5 · ${bare}: عدد H1 ≠ 1`);
    warn.push(`S5 · ${bare}: عدد H1 = ${h1s.length}`);
  } else {
    const raw = h1s[0][1];
    if (!textOf(raw)) errors.push(`S5 · ${bare}: H1 فارغ`);
    // كلمات ملتصقة حول <br> بلا مسافة
    if (/[^\s>]<br\s*\/?>[^\s<]/i.test(raw)) errors.push(`S5 · ${bare}: كلمات ملتصقة حول <br> في H1`);
  }

  // ---- S6 تسلسل العناوين ----
  const heads = [...html.matchAll(/<h([1-6])[^>]*>/gi)].map((m) => Number(m[1]));
  for (let i = 1; i < heads.length; i++) {
    if (heads[i] - heads[i - 1] > 1) { warn.push(`S6 · ${bare}: قفزة عناوين h${heads[i-1]}→h${heads[i]}`); break; }
  }

  // ---- S7 canonical ----
  const canon = pick(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i, html)
             || pick(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i, html);
  if (!canon) warn.push(`S7 · ${bare}: canonical غائب`);
  else if (!/^https:\/\/asoulaldiafa\.com/.test(canon)) errors.push(`S7 · ${bare}: canonical دومين/بروتوكول خاطئ: ${canon}`);

  // ---- S8 JSON-LD ----
  for (const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    const jsonText = m[1].replace(/\\u003c/g, "<").replace(/\\u003e/g, ">").replace(/\\u0026/g, "&");
    try {
      const parsed = JSON.parse(jsonText);
      const flat = JSON.stringify(parsed);
      if (flat.includes('"LocalBusiness"')) errors.push(`S8 · ${bare}: JSON-LD يحتوي LocalBusiness (R5)`);
      if (/"address"\s*:/.test(flat)) errors.push(`S8 · ${bare}: JSON-LD يحتوي address (النشاط SAB بلا مقر)`);
      // ---- S13 نموذج SAB: الكيان الأساسي لازم areaServed لا serviceArea المهجورة ----
      if (flat.includes('"ProfessionalService"')) {
        if (!/"areaServed"\s*:/.test(flat))
          errors.push(`S13 · ${bare}: ProfessionalService بلا areaServed (نموذج SAB يتطلّب مناطق خدمة)`);
        if (/"serviceArea"\s*:/.test(flat))
          errors.push(`S13 · ${bare}: JSON-LD يستخدم serviceArea المهجورة — استخدم areaServed`);
      }
    } catch {
      errors.push(`S8 · ${bare}: JSON-LD لا يمرّ JSON.parse`);
    }
  }

  // ---- النص المرئي للفحوص النصية ----
  const visible = html.replace(/<script[\s\S]*?<\/script>/gi, " ")
                      .replace(/<style[\s\S]*?<\/style>/gi, " ")
                      .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

  // S9 كلمات محظورة
  for (const w of BANNED) {
    if (visible.includes(w)) { errors.push(`S9 · ${bare}: كلمة محظورة «${w.trim()}» (R2)`); break; }
  }

  // S10 أرقام غير موثّقة
  // ثقب مُصلَح: النمط القديم كان \d فقط، وCountUp يعرض أرقامًا هندية-عربية
  // (٠١٢…، انظر arabicMap في src/components/CountUp.tsx) فكان الحارس أعمى
  // عن الأرقام المعروضة فعليًا للزائر. النطاق الآن يشمل الصيغتين، وكذلك ٪.
  const D = "[\\d\u0660-\u0669]";
  // CountUp يُصدِر في SSR القيمة الابتدائية (٠) والقيمة الحقيقية في aria-label
  // (مثال: aria-label="99٪" مع نصّ مرئي «٠٪»). فحص النصّ المرئي وحده يُبلّغ عن
  // «0٪ رضا» — رقم غير موجود — فيبدو الحارس مخطئًا ويُدرَّب الفريق على تجاهله.
  // نُسقِط قيمة aria-label مكان النصّ لتُقرأ المطالبة كما يراها الزائر بعد التحرك.
  const visibleClaims = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(
      new RegExp(`<span[^>]*aria-label="(${D}{1,4})([+\u066A%]?)"[^>]*>[\\s\\S]{0,80}?<\\/span>`, "g"),
      (_m, real, suffix) => ` ${real}${suffix} `
    )
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
  const claimMatches = [
    ...visibleClaims.matchAll(new RegExp(`\\+?\\s*${D}{2,4}\\s*\\+?\\s*(?:مناسبة|حفل|عميل)`, "g")),
    ...visibleClaims.matchAll(new RegExp(`${D}{1,3}\\s*[%\u066A]\\s*(?:رضا|رضى)`, "g")),
    ...visibleClaims.matchAll(new RegExp(`${D}{1,2}\\s*(?:سنة|سنوات)\\s*(?:من\\s*)?(?:الخبرة|خبرة)`, "g")),
  ];
  const arabicToLatin = (t) => t.replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660));
  for (const cm of claimMatches) {
    const claim = arabicToLatin(cm[0].replace(/\s+/g, " ").trim());
    const claimDigits = (claim.match(/\d+/g) || []).join("");
    // «موثّق» = مؤكَّد من المالك، لا مجرد مُدرَج. إدراج رقم في proof.json بـ
    // verified_by_owner:false يعني «معلَّق» — لو مرّ الحارس عليه صار الملف
    // قائمةَ تجاوزات لا سجلَّ إثبات، وهو نقيض R9.
    const documented = (proof.claims || []).some((c) => {
      const obj = typeof c === "object" && c !== null;
      const v = String(obj ? c.value : c);
      const ok = !obj || c.verified_by_owner === true;
      return ok && (claimDigits === v || claim.includes(v) || v.includes(claim));
    });
    if (!documented) errors.push(`S10 · ${bare}: رقم غير موثّق «${claim}» (R9 — أضِفه إلى data/proof.json)`);
  }

  // S11 روابط داخلية
  const internalLinks = [...html.matchAll(/<a[^>]+href=["'](\/[^"'#][^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  const contentLinks = internalLinks.filter((m) => !/nav|footer|menu/i.test(m[0]));
  if (contentLinks.length < 3) warn.push(`S11 · ${bare}: روابط داخلية محتوائية = ${contentLinks.length} (< 3)`);
  for (const m of internalLinks) {
    const t = textOf(m[2]);
    if (GENERIC_LINK_TEXT.includes(t)) { warn.push(`S11 · ${bare}: نص رابط عام «${t}»`); break; }
  }
}

// ---- S16/S17/S18 صور OG لكل صفحة ----
// عيب محروس: تغطية جزئية صامتة. لو مرّت صفحة واحدة بالصورة القديمة فقد
// يمرّ الـPR ويُشارَك رابطها بصورة خاطئة — والعيب لا يظهر إلا لعميل.
try {
  const manifestPath = join(ROOT, "src", "data", "og-manifest.json");
  if (existsSync(manifestPath)) {
    const man = JSON.parse(readFileSync(manifestPath, "utf8"));
    const byPath = new Map(man.map((e) => [e.path, e]));
    for (const file of files) {
      const bare = relative(APP_DIR, file).replace(/\.html$/, "");
      const route = bare === "index" ? "/" : `/${bare}`;
      const html = readFileSync(file, "utf8");
      const imgs = [...html.matchAll(/property="og:image"[^>]*content="([^"]*)"/g)].map((m) => m[1]);
      const alts = [...html.matchAll(/property="og:image:alt"[^>]*content="([^"]*)"/g)].map((m) => m[1]);
      const entry = byPath.get(route);
      if (entry) {
        const webp = `https://asoulaldiafa.com${entry.image}`;
        const jpg = webp.replace(/\.webp$/, ".jpg");
        if (!imgs.includes(webp) || !imgs.includes(jpg)) {
          errors.push(`S16 · ${bare}: og:image لا يحمل نسختي الصورة المخصّصة (JPEG+WebP)`);
        }
        if (imgs[0] !== jpg) {
          errors.push(`S16 · ${bare}: أول og:image ليس JPEG (توافق معاينات واتساب)`);
        }
        if (imgs.some((u) => !/^https:\/\/asoulaldiafa\.com\/og\//.test(u))) {
          errors.push(`S16 · ${bare}: og:image غير مطلق أو خارج /og/`);
        }
        if (alts.length && alts[0] !== entry.alt) {
          errors.push(`S16 · ${bare}: og:image:alt لا يطابق manifest`);
        }
        if (imgs.some((u) => /og-image\.jpg/.test(u))) {
          errors.push(`S17 · ${bare}: صفحة في manifest ما زالت على الصورة الاحتياطية`);
        }
      } else if (imgs.length && imgs.some((u) => /\/og\//.test(u))) {
        errors.push(`S18 · ${bare}: صفحة خارج manifest أُسنِدت لها صورة مخصّصة`);
      }
    }
  }
} catch (e) {
  warn.push(`S16 · تعذّر فحص صور OG: ${e.message}`);
}

// ---- S14 روابط sameAs تُرجع 200 (شبكي، اختياري) ----
// ثقب مُصلَح: الحارس لم يكن يفحص sameAs إطلاقًا، ولهذا مرّ رابط سناب شات
// المكسور (404) الموجود في src/lib/constants.ts. رابط ميت في sameAs يُضعف
// ربط الكيان عند جوجل. شبكي فلا يعمل افتراضيًا — يُفعَّل بـ CHECK_LINKS=1.
if (process.env.CHECK_LINKS === "1") {
  const sameAs = new Set();
  for (const file of files) {
    const html = readFileSync(file, "utf8");
    for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
      try {
        const j = JSON.parse(m[1].replace(/\\u003c/g, "<").replace(/\\u003e/g, ">").replace(/\\u0026/g, "&"));
        for (const node of ldNodes(j)) {
          for (const u of [].concat(node.sameAs || [])) if (/^https?:/.test(u)) sameAs.add(u);
        }
      } catch { /* S8 يتولّى أخطاء التحليل */ }
    }
  }
  for (const url of sameAs) {
    try {
      const res = await fetch(url, { redirect: "follow", headers: { "user-agent": "Mozilla/5.0 (seo-guard)" } });
      // 403/429 = حجب مضاد للبوتات لا رابط ميت (x.com يُرجع 403 لأي عميل آلي).
      // نُبلغ عنه تحذيرًا لا خطأ، وإلا صار الحارس مصدر إنذارات كاذبة تُدرَّب
      // الفِرَق على تجاهلها — وحارس يُتجاهَل أسوأ من غياب الحارس.
      if (res.status === 403 || res.status === 429) {
        warn.push(`S14 · ${url} أرجع ${res.status} (حجب مضاد للبوتات — تحقّق يدويًا)`);
      } else if (!res.ok) {
        errors.push(`S14 · رابط sameAs لا يُرجع 200 (${res.status}): ${url}`);
      }
    } catch (e) {
      warn.push(`S14 · تعذّر فحص ${url}: ${e.message}`);
    }
  }
  console.log(`S14 · روابط sameAs مفحوصة: ${sameAs.size}`);
}

// ---- S15 اتساق عدد المناطق: الواجهة ↔ البيانات المنظمة ----
// عيب مرصود: بطاقة الرئيسية تقول «13 منطقة نصل إليها» بينما schema تعلن
// 5 GeoCircle فقط. تناقض إشارة محلية يجب أن ينكسر عليه البناء لا أن يمرّ.
try {
  const homeFile = files.find((f) => /(^|[\\/])index\.html$/.test(f));
  if (homeFile) {
    const html = readFileSync(homeFile, "utf8");
    let declared = 0;
    for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
      try {
        const j = JSON.parse(m[1].replace(/\\u003c/g, "<").replace(/\\u003e/g, ">").replace(/\\u0026/g, "&"));
        for (const node of ldNodes(j)) {
          const areas = [].concat(node.serviceArea || node.areaServed || []);
          declared = Math.max(declared, areas.filter((a) => a && typeof a === "object").length);
        }
      } catch { /* S8 */ }
    }
    const claimed = html.match(/aria-label="(\d{1,3})"[^>]*>[^<]*<\/span>[\s\S]{0,200}?منطقة/);
    const claimedN = claimed ? Number(claimed[1]) : null;
    if (claimedN !== null && declared > 0 && claimedN !== declared) {
      errors.push(`S15 · عدد المناطق في الواجهة (${claimedN}) ≠ عدد المناطق في JSON-LD (${declared})`);
    }
  }
} catch (e) {
  warn.push(`S15 · تعذّر فحص اتساق المناطق: ${e.message}`);
}

// ---- S12 التشابه ----
try {
  const { results } = computePairs();
  // العتبة تأتي من similarity-check (مصدر الحقيقة الوحيد) — لا تعريف مستقل هنا،
  // وإلا تعارض المصدران عند التدرّج إلى 0.45.
  const sim = results.filter((r) => r.ratio > SIM_MAX);
  sim.forEach((r) => {
    errors.push(`S12 · تشابه > ${(SIM_MAX * 100).toFixed(0)}%: ${r.a} ↔ ${r.b}`);
    warn.push(`S12 · ${(r.ratio * 100).toFixed(2)}%: ${r.a} ↔ ${r.b}`);
  });
} catch (e) {
  warn.push(`S12 · تعذّر حساب التشابه: ${e.message}`);
}

// ---- التقرير (وضع خط الأساس: يفشل فقط على المخالفات الجديدة) ----
gate({
  name: "seo",
  errors,
  warn,
  header: `── G-5 فاحص السيو والمحتوى ──\nصفحات مفحوصة: ${titles.size}`,
});
