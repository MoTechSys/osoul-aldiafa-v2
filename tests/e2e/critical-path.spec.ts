import { test, expect } from "@playwright/test";

/**
 * Critical user + SEO path (mobile-first — 96% of traffic).
 * Home → city landing page → WhatsApp CTA, plus key SEO guarantees.
 *
 * D9.6 fix: the previous spec grabbed `a[href*="wa.me"].first()`, which on
 * mobile resolves to the desktop-only navbar CTA (`hidden md:flex`) and is
 * therefore not visible. We now assert that at least one wa.me link exists and
 * that a VISIBLE WhatsApp affordance is reachable on the current viewport
 * (floating button on mobile, navbar CTA on desktop).
 */

test("homepage renders and links to city pages", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/أصول الضيافة/);
  const cityLinks = page.locator(
    'a[href^="/sababin-qahwa-"], a[href^="/diyafa-munasabat-"]'
  );
  expect(await cityLinks.count()).toBeGreaterThanOrEqual(10);
});

test("city page: H1 visible in DOM (no hidden text)", async ({ page }) => {
  await page.goto("/sababin-qahwa-jeddah");
  const h1 = page.locator("h1").first();
  await expect(h1).toBeVisible();
  // Assert the H1 is meaningful and city-specific WITHOUT pinning the exact
  // wording — D3 deepens per-city copy to break template similarity, so a
  // brittle exact-string match would fail every content improvement. We only
  // require a non-trivial heading that mentions the city (جدة).
  const h1Text = (await h1.textContent())?.trim() ?? "";
  expect(h1Text.length).toBeGreaterThan(8);
  await expect(h1).toContainText("جدة");
  const opacity = await h1.evaluate((el) => getComputedStyle(el).opacity);
  expect(Number(opacity)).toBeGreaterThan(0);
});

test("city page: at least one VISIBLE WhatsApp CTA points to wa.me with prefilled text", async ({
  page,
}) => {
  await page.goto("/sababin-qahwa-jeddah");
  const waLinks = page.locator('a[href*="wa.me"]');
  const count = await waLinks.count();
  expect(count).toBeGreaterThan(0);

  // Find the first VISIBLE wa.me link on this viewport.
  let visibleHref: string | null = null;
  for (let i = 0; i < count; i++) {
    const link = waLinks.nth(i);
    if (await link.isVisible()) {
      visibleHref = await link.getAttribute("href");
      break;
    }
  }
  expect(visibleHref, "no visible wa.me link on this viewport").toBeTruthy();
  expect(visibleHref).toContain("wa.me");
  // Prefilled Arabic message improves the commercial path.
  expect(visibleHref).toContain("text=");
});

test("city page emits Service schema referencing the single business entity", async ({
  page,
}) => {
  await page.goto("/sababin-qahwa-jeddah");
  const ldJson = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  const blob = ldJson.join(" ");
  expect(blob).toContain('"@type":"Service"');
  expect(blob).toContain("#business");
});

test("home: a VISIBLE WhatsApp affordance exists (mobile floating or desktop CTA)", async ({
  page,
}) => {
  await page.goto("/");
  const wa = page.locator('a[href*="wa.me"]');
  const count = await wa.count();
  let anyVisible = false;
  for (let i = 0; i < count; i++) {
    if (await wa.nth(i).isVisible()) {
      anyVisible = true;
      break;
    }
  }
  expect(anyVisible, "expected at least one visible WhatsApp link").toBe(true);
});
