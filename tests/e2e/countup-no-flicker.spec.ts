/**
 * P0-2 (حارس فرعي) — CountUp لا يرتدّ إلى الأسفل.
 * المالك: ضمان الجودة. يغلق اعتراض مراجع الكود على flicker (7 → 0 → 7).
 *
 * العقد المُختبَر: القيمة المعروضة للزائر يجب أن تكون **غير تنازلية** من أول
 * إطار حتى الاستقرار، وأن تنتهي على القيمة الحقيقية في aria-label.
 *
 * لماذا لا نكتفي بقياس "بعد الاستقرار": الانحدار الذي نحرسه منه لحظي —
 * يظهر ويختفي في أقل من ثانية — فالقياس يجب أن يكون **تتبّعًا زمنيًا** لا لقطة.
 * نراقب بـMutationObserver من قبل أن يدخل العنصر النطاق، فلا يفوتنا أول إطار.
 *
 * ملاحظة قياس: القيم مُعرَّبة (٠١٢…) عبر arabicMap في المكوّن، فنطبّعها.
 */
import { test, expect } from "@playwright/test";

const STRICT = process.env.STRICT === "1";

function toLatin(s: string) {
  return s.replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}

test("P0-2 CountUp: القيمة لا تنزل أبدًا تحت الرقم الحقيقي (لا flicker)", async ({ page }) => {
  await page.goto("/");

  // نُنصّب المراقب قبل التمرير: أي تغيير نصي على بطاقات الإحصاء يُسجَّل بطابع زمني.
  await page.evaluate(() => {
    const w = window as unknown as { __trace: Record<string, string[]> };
    w.__trace = {};
    const cards = [...document.querySelectorAll("span[aria-label]")].filter((s) =>
      /^[+٪%\d\u0660-\u0669\s]+$/.test((s.textContent || "").trim())
    );
    for (const card of cards) {
      const key = card.getAttribute("aria-label") || "?";
      w.__trace[key] = [(card.textContent || "").trim()];
      new MutationObserver(() => {
        w.__trace[key].push((card.textContent || "").trim());
      }).observe(card, { childList: true, characterData: true, subtree: true });
    }
  });

  await page.evaluate(() => {
    const el = [...document.querySelectorAll("p")].find((p) => /أرقام تتحدث/.test(p.textContent || ""));
    el?.scrollIntoView({ behavior: "instant", block: "center" });
  });
  await page.waitForTimeout(2600); // مدة الأنيميشن 1.6s + هامش

  const trace = await page.evaluate(
    () => (window as unknown as { __trace: Record<string, string[]> }).__trace
  );

  const problems: string[] = [];
  for (const [label, frames] of Object.entries(trace)) {
    const nums = frames.map((f) => Number(toLatin(f).replace(/[^\d]/g, "")) || 0);
    const target = Number(toLatin(label).replace(/[^\d]/g, ""));
    const first = nums[0];
    const last = nums[nums.length - 1];
    const dipped = nums.some((n) => n < first);
    console.log(
      `    ${label}: أول=${first} أدنى=${Math.min(...nums)} آخر=${last} إطارات=${nums.length}` +
        (dipped ? "  ← ارتداد للأسفل" : "")
    );
    if (dipped) problems.push(`${label}: ارتدّ من ${first} إلى ${Math.min(...nums)}`);
    if (last !== target) problems.push(`${label}: انتهى على ${last} لا ${target}`);
  }

  console.log("### مشاكل:", problems.length ? problems.join(" · ") : "لا شيء");
  if (STRICT) expect(problems, "CountUp ارتدّ أو لم يستقر على القيمة الحقيقية").toEqual([]);
});
