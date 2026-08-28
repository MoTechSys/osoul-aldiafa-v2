/**
 * P0-2 — حارس مسار التحويل بلا JavaScript.
 * المالك: ضمان الجودة. الحكم النهائي أحمر/أخضر لإصلاح P0-2.
 *
 * لماذا هذا الملف موجود:
 *   شُغّل على Chromium وأثبت بالقياس أن /contact يُخدَّم بنموذج غير مرئي
 *   بلا JS، وأن بطاقات الإحصاء تُخدَّم بالصفر (٠+) لا بالقيمة الحقيقية.
 *
 * قاعدة القياس (مهمة):
 *   لا نستخدم toBeVisible() وحده — Playwright يعتبر عنصرًا بـopacity 0.001
 *   "مرئيًا" لأنه لا يفحص الشفافية. لذلك نقرأ getComputedStyle().opacity
 *   حرفيًا ونشترط ≥ 0.99 لكل عنصر يحمل نصًا أو هدف نقر.
 *
 * الوضع الحالي: تشخيصي (يطبع ولا يفشل) ليكون إثبات "أحمر قبل الإصلاح".
 * بعد الإصلاح: اضبط STRICT=1 ليصبح حارس انحدار يفشّل الدمج.
 */
import { test, expect } from "@playwright/test";

const STRICT = process.env.STRICT === "1";
const MIN_OPACITY = 0.99;
const PAGES = ["/", "/contact", "/services", "/portfolio"];

type Hidden = { tag: string; opacity: string; text: string };

test.use({ javaScriptEnabled: false });

async function hiddenTextNodes(page: import("@playwright/test").Page): Promise<Hidden[]> {
  return page.evaluate((min) => {
    const out: Hidden[] = [];
    document.querySelectorAll<HTMLElement>("body *").forEach((el) => {
      const cs = getComputedStyle(el);
      const op = parseFloat(cs.opacity);
      const text = (el.innerText || "").trim();
      // نتجاهل العناصر المخفية بنية (display:none) والأيقونات بلا نص.
      if (cs.display === "none" || cs.visibility === "hidden") return;
      if (op >= min || text.length <= 3) return;
      out.push({ tag: el.tagName, opacity: cs.opacity, text: text.slice(0, 45) });
    });
    return out;
  }, MIN_OPACITY);
}

for (const path of PAGES) {
  test(`P0-2 no-JS: كل نص مرئي فعليًا (opacity ≥ ${MIN_OPACITY}) — ${path}`, async ({ page }) => {
    await page.goto(path);
    const hidden = await hiddenTextNodes(page);
    console.log(`\n### ${path} — عناصر نصية بـopacity < ${MIN_OPACITY}: ${hidden.length}`);
    hidden.forEach((h) => console.log(`    ${h.tag} opacity=${h.opacity} :: ${h.text}`));
    if (STRICT) expect(hidden, `عناصر نصية مخفية بلا JS في ${path}`).toEqual([]);
  });
}

test("P0-2 no-JS: نموذج /contact وأزرار الاتصال قابلة للاستخدام", async ({ page }) => {
  await page.goto("/contact");
  const probes: Record<string, string> = {};
  for (const [name, sel] of Object.entries({
    form: "form",
    whatsapp: 'a[href*="wa.me"]',
    tel: 'a[href^="tel:"]',
    name: "#contact-name",
    phone: "#contact-phone",
    service: "#contact-service",
  })) {
    const el = page.locator(sel).first();
    const op = await el.evaluate((n) => getComputedStyle(n as HTMLElement).opacity).catch(() => "missing");
    probes[name] = op;
    console.log(`    ${name}: opacity=${op}`);
    if (STRICT) expect(Number(op), `${name} مخفي بلا JS`).toBeGreaterThanOrEqual(MIN_OPACITY);
  }
});

test("P0-2 no-JS: بطاقات الإحصاء تعرض الأرقام الحقيقية لا الصفر", async ({ page }) => {
  await page.goto("/");
  // الصفر هنا هندي-عربي (٠) لأن CountUp يُعرّبه — انظر arabicMap في المكوّن.
  const zeros = await page.evaluate(() =>
    [...document.querySelectorAll("span[aria-label]")]
      .filter((s) => /^[٠0]\s*[+٪%]?$/.test((s.textContent || "").trim()))
      .map((s) => ({ shown: (s.textContent || "").trim(), real: s.getAttribute("aria-label") }))
  );
  console.log("    بطاقات تعرض صفرًا بينما aria-label يحمل الرقم الحقيقي:", JSON.stringify(zeros));
  if (STRICT) expect(zeros, "CountUp يجب أن يُخدِّم القيمة النهائية في SSR").toEqual([]);
});
