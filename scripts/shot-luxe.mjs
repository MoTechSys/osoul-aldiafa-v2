import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";

const URL = "http://localhost:3000/luxe-demo";
const OUT = "/tmp/shots";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

// ---- Desktop full page ----
const d = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  locale: "ar-SA",
});
const dp = await d.newPage();
await dp.goto(URL, { waitUntil: "load", timeout: 60000 });
await dp.waitForTimeout(1500);
await dp.evaluate(async () => {
  await new Promise((res) => {
    let y = 0;
    const t = setInterval(() => {
      window.scrollBy(0, 600);
      y += 600;
      if (y >= document.body.scrollHeight) {
        clearInterval(t);
        window.scrollTo(0, 0);
        res();
      }
    }, 60);
  });
});
await dp.waitForTimeout(1200);
await dp.screenshot({ path: `${OUT}/desktop-full.png`, fullPage: true });
await dp.screenshot({ path: `${OUT}/desktop-hero.png` });

// section shots
const secs = await dp.locator("section").all();
console.log("sections:", secs.length);
for (let i = 0; i < secs.length; i++) {
  try {
    await secs[i].scrollIntoViewIfNeeded();
    await dp.waitForTimeout(500);
    await secs[i].screenshot({ path: `${OUT}/sec-${i + 1}.png` });
  } catch (e) {
    console.log("skip sec", i + 1, e.message);
  }
}

// ---- a11y ----
const results = await new AxeBuilder({ page: dp })
  .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
  .analyze();
const bad = results.violations.filter((v) => ["critical", "serious"].includes(v.impact));
console.log("AXE total violations:", results.violations.length, "| critical/serious:", bad.length);
for (const v of results.violations) {
  console.log(` - [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} nodes)`);
  for (const n of v.nodes.slice(0, 3)) console.log("     ", n.target.join(" "), "|", (n.failureSummary || "").split("\n")[1] || "");
}
fs.writeFileSync(`${OUT}/axe.json`, JSON.stringify(results.violations, null, 2));

// ---- Mobile ----
const m = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  locale: "ar-SA",
});
const mp = await m.newPage();
await mp.goto(URL, { waitUntil: "load", timeout: 60000 });
await mp.waitForTimeout(1200);
await mp.evaluate(async () => {
  await new Promise((res) => {
    let y = 0;
    const t = setInterval(() => {
      window.scrollBy(0, 500);
      y += 500;
      if (y >= document.body.scrollHeight) {
        clearInterval(t);
        window.scrollTo(0, 0);
        res();
      }
    }, 60);
  });
});
await mp.waitForTimeout(1000);
await mp.screenshot({ path: `${OUT}/mobile-full.png`, fullPage: true });
await mp.screenshot({ path: `${OUT}/mobile-hero.png` });

await browser.close();
console.log("done");
