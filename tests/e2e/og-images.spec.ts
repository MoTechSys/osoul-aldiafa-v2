import { test, expect } from "@playwright/test";
const SAMPLE = ["/", "/sababin-qahwa-jeddah", "/diyafa-aaras", "/asaar-diyafa", "/qahwajiin-yanbu"];
for (const p of SAMPLE) {
  test(`OG images served + tags correct: ${p}`, async ({ page, request }) => {
    const res = await page.goto(p);
    expect(res?.status()).toBe(200);
    const imgs = await page.locator('meta[property="og:image"]').evaluateAll((els) =>
      els.map((e) => e.getAttribute("content") || "")
    );
    const alt = await page.locator('meta[property="og:image:alt"]').first().getAttribute("content");
    console.log(`  ${p}\n    imgs: ${imgs.join(" | ")}\n    alt: ${alt}`);
    expect(imgs.length).toBe(2);
    expect(imgs[0]).toMatch(/\.jpg$/);
    expect(imgs[1]).toMatch(/\.webp$/);
    expect(alt).toBeTruthy();
    for (const u of imgs) {
      const local = u.replace("https://asoulaldiafa.com", "");
      const r = await request.get(local);
      const ct = r.headers()["content-type"] || "";
      console.log(`    ${local} -> ${r.status()} ${ct}`);
      expect(r.status()).toBe(200);
      expect(ct).toMatch(local.endsWith(".webp") ? /image\/webp/ : /image\/jpeg/);
    }
  });
}
