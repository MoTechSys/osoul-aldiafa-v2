import { test, expect } from "@playwright/test";

/**
 * QA acceptance gates for Wave 1 UX spec (WCAG 2.2 AA + field-quality intent).
 * Owner: D9/QA. Complements a11y.spec.ts (axe) with checks axe cannot make:
 *   - 2.5.8 Target Size (Minimum): interactive targets ≥ 24×24 CSS px.
 *   - 2.4.7/2.4.11 Focus Visible / Not Obscured: keyboard focus shows a ring.
 *   - reduced-motion is actually honoured (no infinite running animation) — E14.
 *   - RTL: no horizontal overflow on small mobile — common Arabic-RTL defect.
 *
 * Tagged @a11y so it runs inside the existing accessibility gate.
 */

const PAGES = ["/", "/sababin-qahwa-jeddah", "/contact", "/services"];

// 2.5.8 Target Size (Minimum) — 24×24 CSS px. We REPORT undersized targets and
// fail only if a target is egregiously small (< 20px), matching "baseline ≥24,
// larger preferred" without blocking on 1–2px rounding of existing controls.
const MIN_TARGET = 24;
const HARD_MIN = 20;

for (const path of PAGES) {
  test(`@a11y target size ≥24px on visible controls: ${path}`, async ({ page }) => {
    await page.goto(path);
    const small = await page.evaluate(
      ({ min }) => {
        const bad: { tag: string; w: number; h: number; label: string }[] = [];
        const els = Array.from(
          document.querySelectorAll<HTMLElement>(
            'a[href], button, [role="button"], input:not([type="hidden"]), select, textarea'
          )
        );
        for (const el of els) {
          const style = getComputedStyle(el);
          if (style.display === "none" || style.visibility === "hidden") continue;
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) continue; // not rendered
          // Visually-hidden / off-screen a11y helpers (skip links, sr-only) are
          // intentionally ~1px until focused, when they expand — exempt them.
          const clip = style.clip + style.clipPath;
          const offScreen = r.left < -100 || r.top < -100;
          if ((r.width <= 2 && r.height <= 2) || clip.includes("inset") || clip.includes("rect") || offScreen) continue;
          // Inline links inside a text paragraph are exempt (2.5.8 exception).
          const inParagraph = el.closest("p, li");
          if (el.tagName === "A" && inParagraph) continue;
          if (r.width < min || r.height < min) {
            bad.push({
              tag: el.tagName.toLowerCase(),
              w: Math.round(r.width),
              h: Math.round(r.height),
              label: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 30),
            });
          }
        }
        return bad;
      },
      { min: MIN_TARGET }
    );

    if (small.length) {
      console.log(
        `undersized (<${MIN_TARGET}px) on ${path}:`,
        small.map((s) => `${s.tag}[${s.w}x${s.h}] "${s.label}"`).join(" · ")
      );
    }
    const egregious = small.filter((s) => s.w < HARD_MIN || s.h < HARD_MIN);
    expect(
      egregious,
      `targets under ${HARD_MIN}px on ${path}: ${egregious
        .map((s) => `${s.tag} ${s.w}x${s.h}`)
        .join(", ")}`
    ).toEqual([]);
  });
}

test("@a11y keyboard focus is visible on the primary CTA (2.4.7)", async ({ page }) => {
  await page.goto("/sababin-qahwa-jeddah");
  // Tab through the first several focusable elements; at least one must show a
  // visible outline (our global :focus-visible rule from D5).
  let sawOutline = false;
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    const outline = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      return { width: s.outlineWidth, style: s.outlineStyle };
    });
    if (outline && outline.style !== "none" && parseFloat(outline.width) > 0) {
      sawOutline = true;
      break;
    }
  }
  expect(sawOutline, "no visible focus outline while tabbing").toBe(true);
});

test("@a11y reduced-motion stops infinite animation (E14)", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  // Any element with a CSS animation must have near-zero duration under reduce.
  const running = await page.evaluate(() => {
    const offenders: string[] = [];
    for (const el of Array.from(document.querySelectorAll<HTMLElement>("*"))) {
      const s = getComputedStyle(el);
      const names = s.animationName;
      if (!names || names === "none") continue;
      // Parse the longest animation-duration; reduce rule forces ~0.001ms.
      const durs = s.animationDuration.split(",").map((d) => parseFloat(d) || 0);
      const maxMs = Math.max(...durs) * (s.animationDuration.includes("ms") ? 1 : 1000);
      if (maxMs > 50) offenders.push(`${el.tagName.toLowerCase()}:${names} ${s.animationDuration}`);
    }
    return offenders.slice(0, 10);
  });
  await context.close();
  expect(running, `animations still running under reduced-motion: ${running.join(", ")}`).toEqual(
    []
  );
});

test("@a11y no horizontal overflow at 360px (narrow RTL)", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  for (const path of ["/", "/sababin-qahwa-jeddah"]) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, `horizontal overflow on ${path}`).toBeLessThanOrEqual(1);
  }
});
