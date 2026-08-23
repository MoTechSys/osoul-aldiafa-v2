/**
 * تدقيق الجاهزية — قياس فعلي لكل صفحة مبنيّة.
 * لكل صفحة: عنوان، وصف، H1، صور بلا alt، روابط مكسورة داخليًا،
 * حجم HTML، نص فعلي، سكيما، أخطاء متصفح، نصوص أصغر من 12px.
 * مؤقت — يُحذف بعد التوثيق.
 */
import { chromium, devices } from "@playwright/test";



const BASE = "http://localhost:3000";

// اجمع المسارات من خريطة الموقع (المصدر الرسمي لما نريد فهرسته)
const sm = await fetch(`${BASE}/sitemap.xml`).then((r) => r.text());
const paths = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1].replace(/^https?:\/\/[^/]+/, "") || "/")
  .map((p) => (p === "" ? "/" : p));

const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices["iPhone 12"] });

const rows = [];
for (const path of paths) {
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message.slice(0, 80)));
  page.on("console", (m) => { if (m.type() === "error") errs.push(m.text().slice(0, 80)); });

  let status = 0;
  try {
    const resp = await page.goto(BASE + path, { waitUntil: "domcontentloaded", timeout: 45000 });
    status = resp?.status() ?? 0;
    await page.waitForLoadState("load", { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(1200);
  } catch {
    rows.push({ path, status: -1, note: "TIMEOUT" });
    await page.close();
    continue;
  }

  const d = await page.evaluate(() => {
    const t = document.title || "";
    const desc = document.querySelector('meta[name="description"]')?.content || "";
    const canon = document.querySelector('link[rel="canonical"]')?.href || "";
    const h1s = [...document.querySelectorAll("h1")].map((x) => x.textContent.trim());
    const h2n = document.querySelectorAll("h2").length;
    const imgs = [...document.querySelectorAll("img")];
    const noAlt = imgs.filter((i) => !i.getAttribute("alt")).length;
    const dupAlt = (() => {
      const m = {};
      imgs.forEach((i) => { const a = i.getAttribute("alt") || ""; if (a) m[a] = (m[a] || 0) + 1; });
      return Object.entries(m).filter(([, v]) => v > 1).length;
    })();
    // نص مرئي فعلي
    const body = document.body.cloneNode(true);
    body.querySelectorAll("script,style,nav,footer,header").forEach((x) => x.remove());
    const words = (body.textContent || "").trim().split(/\s+/).filter(Boolean).length;
    // سكيما
    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')];
    const types = [];
    ld.forEach((s) => { try { const j = JSON.parse(s.textContent); (Array.isArray(j) ? j : [j]).forEach((o) => { if (o["@graph"]) o["@graph"].forEach((g) => types.push(g["@type"])); else types.push(o["@type"]); }); } catch {} });
    // خطوط صغيرة
    let tiny = 0, textEls = 0;
    document.querySelectorAll("*").forEach((el) => {
      const dt = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join("").trim();
      if (!dt) return;
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") return;
      textEls++;
      if (parseFloat(cs.fontSize) < 12) tiny++;
    });
    // روابط داخلية
    const links = [...new Set([...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute("href").split("#")[0]))].filter(Boolean);
    // OG
    const og = document.querySelector('meta[property="og:image"]')?.content || "";
    return { t, desc, canon, h1s, h2n, imgCount: imgs.length, noAlt, dupAlt, words, types: [...new Set(types)], tiny, textEls, links, og,
      overflowX: document.documentElement.scrollWidth - window.innerWidth };
  });

  rows.push({ path, status, errs: errs.length, ...d });
  await page.close();
}

await browser.close();

// ── تقرير ──
console.log(`\n### تدقيق الجاهزية — ${rows.length} صفحة من خريطة الموقع\n`);
console.log("| الصفحة | HTTP | عنوان | وصف | H1 | كلمات | صور/بلا alt | <12px | أخطاء | سكيما |");
console.log("|---|---|---|---|---|---|---|---|---|---|");
for (const r of rows) {
  if (r.status === -1) { console.log(`| ${r.path} | 🔴 TIMEOUT | | | | | | | | |`); continue; }
  const tl = (r.t || "").length, dl = (r.desc || "").length;
  console.log(
    `| \`${r.path}\` | ${r.status === 200 ? "✅" : "🔴 " + r.status} | ${tl}${tl > 60 ? "🔴" : ""} | ${dl}${dl > 158 || dl === 0 ? "🔴" : ""} | ${r.h1s.length === 1 ? "✅" : "🔴 " + r.h1s.length} | ${r.words} | ${r.imgCount}/${r.noAlt}${r.noAlt ? "🔴" : ""} | ${r.tiny}/${r.textEls} | ${r.errs ? "🔴 " + r.errs : "✅"} | ${r.types.join(",") || "🔴 لا شيء"} |`
  );
}

// مشاكل مجمّعة
console.log("\n### مشاكل مجمّعة\n");
const noDesc = rows.filter((r) => r.desc !== undefined && (r.desc || "").length === 0);
const longDesc = rows.filter((r) => (r.desc || "").length > 158);
const longTitle = rows.filter((r) => (r.t || "").length > 60);
const badH1 = rows.filter((r) => r.h1s && r.h1s.length !== 1);
const noAlt = rows.filter((r) => r.noAlt > 0);
const dupAlt = rows.filter((r) => r.dupAlt > 0);
const thin = rows.filter((r) => r.words !== undefined && r.words < 300);
const werr = rows.filter((r) => r.errs > 0);
const noSchema = rows.filter((r) => r.types && r.types.length === 0);
const tinyPages = rows.filter((r) => r.tiny > 0);
const ovf = rows.filter((r) => r.overflowX > 0);

const rep = (label, arr, fmt = (r) => r.path) => {
  console.log(`- **${label}**: ${arr.length}` + (arr.length ? ` → ${arr.slice(0, 8).map(fmt).join(", ")}${arr.length > 8 ? " …" : ""}` : " ✅"));
};
rep("وصف مفقود", noDesc);
rep("وصف > 158 حرفًا", longDesc, (r) => `${r.path} (${r.desc.length})`);
rep("عنوان > 60 حرفًا", longTitle, (r) => `${r.path} (${r.t.length})`);
rep("H1 ليس واحدًا", badH1, (r) => `${r.path} (${r.h1s.length})`);
rep("صور بلا alt", noAlt, (r) => `${r.path} (${r.noAlt})`);
rep("alt مكرّر", dupAlt, (r) => `${r.path} (${r.dupAlt})`);
rep("محتوى < 300 كلمة", thin, (r) => `${r.path} (${r.words})`);
rep("أخطاء متصفح", werr, (r) => `${r.path} (${r.errs})`);
rep("بلا سكيما", noSchema);
rep("نص < 12px", tinyPages, (r) => `${r.path} (${r.tiny})`);
rep("تمدّد أفقي", ovf, (r) => `${r.path} (${r.overflowX})`);

// روابط مكسورة
const all = new Set(rows.map((r) => r.path.replace(/\/$/, "") || "/"));
const broken = new Map();
for (const r of rows) {
  for (const l of r.links || []) {
    const n = l.replace(/\/$/, "") || "/";
    if (!all.has(n)) broken.set(n, (broken.get(n) || 0) + 1);
  }
}
console.log(`- **روابط تشير لمسار خارج خريطة الموقع**: ${broken.size}` +
  (broken.size ? ` → ${[...broken.entries()].map(([k, v]) => `${k}(×${v})`).join(", ")}` : " ✅"));

const totalWords = rows.reduce((a, r) => a + (r.words || 0), 0);
console.log(`\n- إجمالي الكلمات على الموقع: **${totalWords}** · المتوسط/صفحة: **${Math.round(totalWords / rows.length)}**`);
