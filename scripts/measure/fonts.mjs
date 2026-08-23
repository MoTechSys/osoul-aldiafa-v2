/**
 * تدقيق الخطوط والعناوين — قياس فعلي على iPhone 12.
 * يحدد *أي* عناصر بها خط أصغر من الحد، لا العدد فقط.
 * مؤقت — يُحذف بعد التوثيق.
 */
import { chromium, devices } from "@playwright/test";

const BASE = process.env.BASE || "http://localhost:3000";
const PAGES = (process.env.PAGES || "/services").split(",");
const LABEL = process.env.LABEL || "قياس";

const profile = devices["iPhone 12"];
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...profile });
const page = await ctx.newPage();

const out = [];

for (const path of PAGES) {
  await page.goto(BASE + path, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForLoadState("load", { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(2500);

  const data = await page.evaluate(() => {
    const hist = {};
    const offenders = [];
    const seen = new Map();

    document.querySelectorAll("*").forEach((el) => {
      // أوراق النص فقط: عنصر يحتوي نصًا مباشرًا
      const direct = Array.from(el.childNodes)
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent.trim())
        .join(" ")
        .trim();
      if (!direct) return;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;

      const fs = Math.round(parseFloat(cs.fontSize));
      hist[fs] = (hist[fs] || 0) + 1;

      if (fs < 14) {
        const key = `${el.tagName}|${(el.className || "").toString()}|${fs}`;
        if (!seen.has(key)) {
          seen.set(key, 0);
          offenders.push({
            size: fs,
            tag: el.tagName.toLowerCase(),
            cls: (el.className || "").toString().slice(0, 70),
            weight: cs.fontWeight,
            lh: cs.lineHeight,
            sample: direct.slice(0, 40),
          });
        }
        seen.set(key, seen.get(key) + 1);
      }
    });
    offenders.forEach((o) => {
      o.count = seen.get(`${o.tag.toUpperCase()}|${o.cls.length >= 70 ? "" : o.cls}|${o.size}`) || 1;
    });

    // العناوين
    const heads = [];
    document.querySelectorAll("h1,h2,h3").forEach((h) => {
      const cs = getComputedStyle(h);
      const r = h.getBoundingClientRect();
      heads.push({
        tag: h.tagName.toLowerCase(),
        size: Math.round(parseFloat(cs.fontSize)),
        lh: cs.lineHeight,
        weight: cs.fontWeight,
        top: Math.round(r.top + window.scrollY),
        text: (h.textContent || "").trim().slice(0, 34),
      });
    });

    // أول CTA
    const cta = document.querySelector("a[href^='tel:'],a[href*='wa.me']");
    const ctaTop = cta ? Math.round(cta.getBoundingClientRect().top + window.scrollY) : null;

    return {
      vw: window.innerWidth,
      vh: window.innerHeight,
      hist,
      offenders: offenders.sort((a, b) => a.size - b.size),
      heads: heads.slice(0, 12),
      ctaTop,
      docHeight: document.documentElement.scrollHeight,
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
    };
  });

  out.push({ path, ...data });
}

await browser.close();

// تقرير
for (const p of out) {
  const under14 = Object.entries(p.hist)
    .filter(([k]) => +k < 14)
    .reduce((a, [, v]) => a + v, 0);
  const total = Object.values(p.hist).reduce((a, b) => a + b, 0);
  console.log(`\n=== [${LABEL}] ${p.path} · ${p.vw}x${p.vh} ===`);
  console.log(`إجمالي عناصر النص: ${total} · أصغر من 14px: ${under14} (${((under14 / total) * 100).toFixed(0)}%)`);
  console.log(`overflowX=${p.overflowX} · docHeight=${p.docHeight} · أول CTA=${p.ctaTop}`);
  console.log(`التوزيع: ${JSON.stringify(p.hist)}`);
  console.log("— العناصر المخالفة (<14px):");
  for (const o of p.offenders) {
    console.log(`   ${o.size}px  ×${o.count}  <${o.tag}> w${o.weight} lh:${o.lh}  .${o.cls}  «${o.sample}»`);
  }
  console.log("— العناوين:");
  for (const h of p.heads) {
    console.log(`   ${h.tag} ${h.size}px w${h.weight} lh:${h.lh} top:${h.top}  «${h.text}»`);
  }
}
