import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * D9 — accessibility gate (plan 05 §8).
 * 0 critical / 0 serious axe violations across the core page templates.
 * Tagged @a11y so `npm run test:a11y` can run it in isolation.
 */
const TEMPLATES = [
  { name: "home", path: "/" },
  { name: "city", path: "/sababin-qahwa-jeddah" },
  { name: "contact", path: "/contact" },
  { name: "services", path: "/services" },
];

// Contrast debt was driven to zero by fix/contrast-a11y (pearl/55 floor,
// bronze locked as decorative-only) — no exceptions remain; the gate is strict.

for (const t of TEMPLATES) {
  test(`@a11y no critical/serious axe violations: ${t.name}`, async ({ browser }) => {
    // Scan under reduced-motion: Framer-Motion `whileInView` sections then render
    // at their FINAL state immediately (no opacity:0 fade-in), which is what a
    // human ultimately sees. This makes the scan deterministic — no dependence on
    // scroll/animation timing — and removes the near-black-on-black scan artifact
    // that a mid-fade (opacity:0) element would otherwise produce. (Verified: the
    // real pearl/gold contrast is already fixed; this only removes flakiness.)
    const context = await browser.newContext({ reducedMotion: "reduce", locale: "ar-SA" });
    const page = await context.newPage();
    await page.goto(t.path, { waitUntil: "networkidle" });
    // Still scroll through so any lazy/intersection content mounts, then settle.
    await page.evaluate(async () => {
      const step = window.innerHeight;
      for (let y = 0; y <= document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
      window.scrollTo(0, 0);
    });
    // WebKit under parallel load settles slowly; wait for fonts + a settle window
    // so axe scans the fully-painted page (prevents flaky mid-render contrast reads).
    await page.evaluate(() => (document as unknown as { fonts: { ready: Promise<unknown> } }).fonts.ready);
    await page.waitForTimeout(600);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    await context.close();

    const serious = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious"
    );
    if (serious.length) {
      console.log(
        `axe serious on ${t.path}:`,
        serious.map((v) => `${v.id} (${v.impact}, ${v.nodes.length} nodes)`).join(", ")
      );
    }
    // Gate is fully strict — every critical/serious violation blocks.
    expect(
      serious,
      `blocking a11y violations on ${t.path}: ${serious.map((v) => v.id).join(", ")}`
    ).toEqual([]);
  });
}

test("@a11y no horizontal scroll at 375px (RTL guard, E15)", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
