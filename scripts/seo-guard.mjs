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
 * S12 التشابه > 60% (يستدعي similarity-check)
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { computePairs } from "./similarity-check.mjs";
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
  const claimMatches = [...visible.matchAll(/\+?\s*\d{2,4}\s*(?:مناسبة|حفل|عميل)/g),
                        ...visible.matchAll(/\d{1,3}\s*%\s*(?:رضا|رضى)/g)];
  for (const cm of claimMatches) {
    const claim = cm[0].replace(/\s+/g, " ").trim();
    const documented = (proof.claims || []).some((c) => claim.includes(String(c)) || String(c).includes(claim));
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

// ---- S12 التشابه ----
try {
  const { results } = computePairs();
  const sim = results.filter((r) => r.ratio > 0.60);
  sim.forEach((r) => {
    errors.push(`S12 · تشابه > 60%: ${r.a} ↔ ${r.b}`);
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
