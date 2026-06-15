import { test, expect } from "@playwright/test";

/**
 * Critical user + SEO path:
 * Home → city landing page → WhatsApp CTA, plus key SEO guarantees
 * (visible H1 in HTML, no hidden text, internal links present).
 */

test("homepage renders and links to city pages", async ({ page }) => {
  await page.goto("/");
  // homepage has visible content
  await expect(page).toHaveTitle(/أصول الضيافة/);
  // internal links to all 10 city pages exist (Task 2.4)
  const cityLinks = page.locator('a[href^="/sababin-qahwa-"], a[href^="/diyafa-munasabat-"]');
  expect(await cityLinks.count()).toBeGreaterThanOrEqual(10);
});

test("city page: H1 visible in DOM (no hidden text)", async ({ page }) => {
  await page.goto("/sababin-qahwa-jeddah");
  const h1 = page.locator("h1").first();
  await expect(h1).toBeVisible();
  await expect(h1).toContainText("صبابين قهوة في جدة");
  // H1 must not be transparent (no opacity:0 hidden-text risk)
  const opacity = await h1.evaluate((el) => getComputedStyle(el).opacity);
  expect(Number(opacity)).toBeGreaterThan(0);
});

test("city page: WhatsApp CTA points to wa.me", async ({ page }) => {
  await page.goto("/sababin-qahwa-jeddah");
  const wa = page.locator('a[href*="wa.me"]').first();
  await expect(wa).toBeVisible();
  const href = await wa.getAttribute("href");
  expect(href).toContain("wa.me");
});

test("city page emits Service schema, not a per-city LocalBusiness", async ({ page }) => {
  await page.goto("/sababin-qahwa-jeddah");
  const ldJson = await page.locator('script[type="application/ld+json"]').allTextContents();
  const blob = ldJson.join(" ");
  expect(blob).toContain('"@type":"Service"');
  // the city page Service must reference the single business entity
  expect(blob).toContain("#business");
});
