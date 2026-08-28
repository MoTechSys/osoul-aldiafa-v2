import { test, expect } from "@playwright/test";

/**
 * P0-2 — حارس انحدار: المحتوى الحرج مرئي بلا JS.
 *
 * الجذر الذي يحرسه هذا الملف (اكتشاف ضمان الجودة، تحقيق مهنس 4.8 بالكود):
 *   محتوى مرئي حالته الابتدائية معتمدة على تنفيذ JS على العميل — عدّاد
 *   الإحصاءات يبدأ من 0 (CountUp: useState(from)) وعناصر تبدأ opacity:0 عبر
 *   motion — فإن فشل/تأخّر JS أو زار Googlebot دون تنفيذ كامل، رأى صفرًا/نصًّا
 *   مخفيًا.
 *
 * الإصلاح: القيمة/الرؤية النهائية هي الحالة الأولية في HTML الخادم، والأنيميشن
 *   تحسين تدريجي فوقها. هذا الاختبار يعطّل JS ويؤكّد أن:
 *     1. أرقام الإحصاءات النهائية موجودة في HTML (لا "0" ولا "٠").
 *     2. عنوان H1 في الصفحات الفرعية مرئي (opacity != 0) بلا JS.
 *
 * كان يجب أن يفشل قبل الإصلاح (أحمر-قبل-الإصلاح) ويمرّ بعده.
 */

// سياق بلا JavaScript — يحاكي Googlebot/فشل الهيدرشن.
test.use({ javaScriptEnabled: false });

test("الصفحة الرئيسية: أرقام الإحصاءات النهائية مرئية في HTML بلا JS", async ({
  page,
}) => {
  await page.goto("/");

  // الأرقام الحقيقية من Stats.tsx — يجب أن تُقدَّم من الخادم لا أن تبدأ صفرًا.
  // نتحقق من ظهور النص النهائي (بالأرقام العربية-الهندية كما يعرضها CountUp).
  const body = await page.locator("body").innerText();

  // 7 سنوات · 1200 مناسبة · 13 منطقة · 99٪ رضا (arabicDigits=true → ٧ ١٢٠٠ ١٣ ٩٩)
  expect(body).toMatch(/[٧7]\s*\+/); // 7+
  expect(body).toMatch(/[١1][٢2][٠0][٠0]\s*\+/); // 1200+
  expect(body).toMatch(/[٩9][٩9]\s*٪/); // 99٪

  // لا يجوز أن تكون بطاقة إحصاء نصّها "0"/"٠" فقط (حالة الصفر الابتدائية).
  const zeroOnly = await page
    .locator("text=/^\\s*[٠0]\\s*\\+?\\s*$/")
    .count();
  expect(zeroOnly).toBe(0);
});

test("صفحة الاتصال: العنوان H1 مرئي بلا JS (opacity != 0)", async ({ page }) => {
  await page.goto("/contact");
  const h1 = page.locator("h1").first();
  await expect(h1).toBeVisible();
  const opacity = await h1.evaluate((el) => getComputedStyle(el).opacity);
  expect(Number(opacity)).toBeGreaterThan(0);
});

test("قسم مناطق الخدمة في /contact مرئي بلا JS", async ({ page }) => {
  await page.goto("/contact");
  // قسم «مناطق نخدمها» يجب أن يُقدَّم مرئيًا (لا يعتمد على whileInView + JS).
  const section = page.locator("#service-areas");
  await expect(section).toBeVisible();
  const opacity = await section.evaluate((el) =>
    getComputedStyle(el).opacity
  );
  expect(Number(opacity)).toBeGreaterThan(0);
});

// حارس flicker للعدّاد (اعتراض المراجعة): مع تفعيل JS، يجب ألّا تنزل قيمة أي
// بطاقة إحصاء تحت قيمتها النهائية أثناء العدّ — أي لا وميض 7→0→7. نراقب النص
// خلال أول ~600ms بعد ظهور القسم ونتأكد أنه لا يعرض «0/٠» منفردة بعد أن كان
// يعرض الرقم النهائي في SSR.
test.describe("عدّاد الإحصاءات بلا وميض (JS مفعّل)", () => {
  test.use({ javaScriptEnabled: true });
  test("لا تعرض بطاقة الإحصاء صفرًا منفردًا أثناء العدّ", async ({ page }) => {
    await page.goto("/");
    // مرّر إلى قسم الإحصاءات لتشغيل العدّ.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    const zeroSnapshots: number[] = [];
    // عيّنات متتابعة خلال نافذة الأنيميشن.
    for (let i = 0; i < 12; i++) {
      const zeros = await page
        .locator("text=/^\\s*[٠0]\\s*٪?\\s*$/")
        .count();
      zeroSnapshots.push(zeros);
      await page.waitForTimeout(50);
    }
    // ولو مرة واحدة ظهر صفر منفرد = وميض ارتداد القيمة (7→0). يجب أن يبقى 0.
    expect(Math.max(...zeroSnapshots)).toBe(0);
  });
});
