/**
 * scripts/shot-mobile.mjs — لقطات الجوال بدقة معقولة.
 * الملف الأصلي shot-luxe.mjs يستخدم deviceScaleFactor:3 فتفشل
 * لقطة الصفحة الكاملة (timeout) لأن الارتفاع الحقيقي > 30k بكسل.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const URL = process.env.URL ?? "http://localhost:3000/luxe-demo";
const OUT = "/tmp/shots-m";
mkdirSync(OUT, { recursive: true });

const b = await chromium.launch();
const ctx = await b.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  locale: "ar-SA",
  isMobile: true,
  hasTouch: true,
});
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "load", timeout: 60000 });

// تمرير كامل لتحميل الصور المؤجّلة
await page.evaluate(async () => {
  const step = 600;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 110));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(2500);

const secs = await page.locator("main > section").all();
console.log("sections:", secs.length);
for (let i = 0; i < secs.length; i++) {
  await secs[i].scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await secs[i].screenshot({
    path: `${OUT}/m-${i + 1}.jpg`,
    type: "jpeg",
    quality: 86,
    timeout: 60000,
  });
}
await b.close();
console.log("done →", OUT);
