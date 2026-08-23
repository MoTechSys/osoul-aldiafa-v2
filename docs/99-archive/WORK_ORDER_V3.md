# 📋 أمر تشغيل محكم — أصول الضيافة V3
### Work Order for a 10-Developer Team
> المستودع: `github.com/MoTechSys/osoul-aldiafa-v3` · الفرع الأساس: `main` · نقطة البداية: commit `7afd95f`
> النطاق: **65 صفحة جديدة + إصلاح حرج + 240 أصل بصري** · المدة: **13 أسبوع** · الحجم: 10 مطورين

---

# 0. اقرأ هذا أولاً — قواعد لا تُكسر (Non-Negotiables)

## 0.1 القواعد الحمراء 🔴
| # | القاعدة | لماذا |
|---|---|---|
| R1 | **ممنوع توليد أي صورة بالذكاء الاصطناعي.** لا Midjourney، لا DALL·E، لا Nano Banana، لا شيء. | قرار مالك المشروع. مخالفته = رفض الـPR فوراً. |
| R2 | **ممنوع ادعاء وجود فروع.** الشركة **مزوّد خدمة متنقّل** بلا مقرات يزورها العميل. أي نص فيه «فرع/فروع/مقرنا/زورونا في» = مرفوض. | الشركة فعلياً ما عندها فروع. ادعاء كاذب = عقوبة Google. |
| R3 | **ممنوع Doorway Pages.** لا صفحة لكل صيغة إملائية («فجده» / «في جده» / «في جدة»). صفحة واحدة لكل **نية بحث**. | مخالفة صريحة لسياسة Google. |
| R4 | **ممنوع صور من Getty / Shutterstock / Alamy / iStock / Adobe Stock / Freepik Premium.** | خطر قانوني حقيقي. |
| R5 | **ممنوع `LocalBusiness` schema** بعد المرحلة 0. النوع المعتمد: `ProfessionalService`. | نموذج SAB الصحيح. |
| R6 | **ممنوع الدفع المباشر إلى `main`.** كل شيء عبر PR + مراجعة. | حماية الأساس. |
| R7 | **ممنوع تعديل ملف خارج ملكيتك** (انظر §3 مصفوفة الملكية) بدون إذن Lead. | منع تعارض 10 مطورين. |
| R8 | **ممنوع نسخ/لصق محتوى صفحة وتبديل اسم المدينة/الحي فقط.** كل صفحة تحتاج ≥40% محتوى فريد فعلي. | Thin/Duplicate Content = عقوبة. |

## 0.2 القواعد الخضراء ✅
- كل نص عربي، `dir="rtl"`، خط `font-amiri` للعناوين.
- كل صفحة **Server Component** افتراضياً. `"use client"` فقط للتفاعل الحقيقي.
- كل صفحة جديدة **يجب** أن تُضاف إلى `sitemap.ts` وإلى شبكة الروابط الداخلية.
- كل صفحة **يجب** أن تحوي `Breadcrumbs` + JSON-LD (breadcrumb + service/article + FAQ + webpage).
- التزم بالهوية: `gold-text` · `card-royal` · `ghost-button` · `gold-shine` · `film-grain` · `bg-onyx` · `text-pearl`.

---

# 1. العقود التقنية (Technical Contracts) — احفظها

## 1.1 البيئة
```
Next.js 14 App Router · TypeScript 5 (strict) · Tailwind CSS 3
Motion (framer) v12 · Embla Carousel · Vitest + Playwright
Node 20+ · النشر: Vercel  (⚠️ ليس Cloudflare)
```
**لا يُسمح بترقية Next 16 / React 19 / Tailwind 4** — جُرِّبت وفشلت، راجع `docs/REFACTOR_LOG.md`. أي PR فيه ترقية = مرفوض.

## 1.2 عقد المكوّن الرئيسي — `LocalServicePage`
كل صفحة محتوى تُبنى بهذا المكوّن. **الـprops الإجبارية:**
```ts
export interface LocalServicePageProps {
  h1: string;
  cityAr: string;
  serviceAr: string;
  intro: string;              // الكلمة المفتاحية في أول 100 كلمة — إلزامي
  heroImage: string;
  heroAlt: string;            // عربي وصفي — إلزامي
  sections: { h2: string; body: string; img?: string; imgAlt?: string }[];
  extraSections?: { h2: string; body: string }[];
  districts: string[];
  packages: { name: string; desc: string; features: string[] }[];
  pricingNote: string;
  whyUs: string[];
  faqs: { question: string; answer: string }[];
  gallery: { src: string; alt: string }[];
  otherCities: { label: string; href: string }[];
  breadcrumbItems: { label: string; href: string }[];
}
```

## 1.3 القالب الإلزامي لأي صفحة جديدة
انسخ هذا حرفياً وبدّل الثوابت فقط:
```tsx
import { Metadata } from "next";
import LocalServicePage from "@/components/LocalServicePage";
import { getHubContent } from "@/lib/hubContent";
import { SERVICE_HUBS } from "@/lib/serviceHubs";
import { generatePageMetadata } from "@/components/SEO";
import {
  generateBreadcrumbSchema, generateServiceSchema,
  generateFAQSchema, generateWebPageSchema, jsonLd,
} from "@/lib/schema";
import { SITE_URL } from "@/lib/constants";

const SLUG = "<your-slug>";
const hub  = SERVICE_HUBS[SLUG];
const PATH = `/${SLUG}`;
const data = getHubContent(SLUG);

export const metadata: Metadata = generatePageMetadata({
  title: hub.metaTitle, description: hub.metaDescription,
  path: PATH, keywords: hub.keywords,
});

const breadcrumbSchema = generateBreadcrumbSchema(
  data.page.breadcrumbItems.map((b) => ({ name: b.label, url: `${SITE_URL}${b.href}` }))
);
const serviceSchema  = generateServiceSchema({ name: hub.ar, description: hub.metaDescription, url: `${SITE_URL}${PATH}` });
const faqSchema      = generateFAQSchema(data.faqs);
const webPageSchema  = generateWebPageSchema({ name: hub.metaTitle, description: hub.metaDescription, url: `${SITE_URL}${PATH}` });

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(webPageSchema) }} />
      <LocalServicePage {...data.page} />
    </>
  );
}
```

## 1.4 عقد الثوابت — لا تكتبها يدوياً أبداً
```ts
import { SITE_URL, SITE_NAME, WHATSAPP_NUMBER, WHATSAPP_DISPLAY,
         PHONE_TEL, EMAIL, SOCIAL_LINKS, whatsappUrl } from "@/lib/constants";
```
رقم الواتساب: `966568997316` · العرض: `0568997316` · النطاق: `https://asoulaldiafa.com`
**أي رقم أو رابط مكتوب يدوياً في صفحة = PR مرفوض.**

## 1.5 عقد الصور
```ts
import { TEAM_IMAGES, PRODUCT_IMAGES, SETUP_IMAGES,
         DATES_IMAGES, DRINKS_IMAGES, HERO_IMAGES } from "@/lib/images";
```
- كل `<Image>` يجب أن يحمل `alt` **عربي وصفي** يحوي كلمة مفتاحية طبيعية.
- Hero: `priority` + `sizes="100vw"` · باقي الصور: `loading="lazy"`.

## 1.6 عقد المحتوى — الحد الأدنى لكل صفحة
| العنصر | الحد الأدنى |
|---|---|
| عدد الكلمات | **700 كلمة** (صفحات الأحياء: 550) |
| عدد أقسام H2 | 5 |
| عدد أسئلة FAQ | 6 |
| عدد الصور | 4 |
| روابط داخلية خارجة | 5 |
| المحتوى الفريد مقابل أي صفحة شقيقة | **≥ 40%** |
| الكلمة المفتاحية في أول 100 كلمة | إلزامي |

---

# 2. هيكل الفريق — 10 مطورين

| # | الاسم الكودي | التخصص | المخرجات الرئيسية |
|---|---|---|---|
| **D1** | 🏛️ **Architect / Lead** | البنية + السكيما + المراجعة | المرحلة 0 كاملة · مراجعة كل PR · حارس القواعد |
| **D2** | 🔥 **Seasonal** | صفحات المواسم | 4 صفحات (اليوم الوطني · العروض · التأسيس · الأعياد) |
| **D3** | 🛎️ **Services A** | خدمات جديدة (نصف) | 4 صفحات (نسائي · زمزم · عزاء · تخرج) |
| **D4** | 🏢 **Services B** | خدمات جديدة (نصف) | 3 صفحات (شركات · تمور وحلويات · VIP) |
| **D5** | 🗺️ **Geo Engine** | محرك خدمة×مدينة | 20 صفحة + توسعة `localPages.ts` |
| **D6** | 📍 **Districts A** | أحياء جدة | 10 صفحات أحياء |
| **D7** | 📍 **Districts B** | أحياء ينبع + المحرك | 6 صفحات + مسار `[district]` الديناميكي |
| **D8** | ✍️ **Content Authority** | المقالات والمدوّنة | 12 صفحة + نظام المقالات |
| **D9** | 🖼️ **Visual Assets** | خط أنابيب الصور | 240 أصل بصري + سكربتات المعالجة |
| **D10** | ✅ **QA / SEO / Perf** | الجودة والقياس | بوابات CI · اختبارات · Lighthouse · Search Console |

---

# 3. 🔒 مصفوفة ملكية الملفات (File Ownership Matrix)
> **هذا أهم جدول في الوثيقة.** لا يعدّل أحد ملفاً ليس ملكه. المخالفة = تعارض دمج مضمون.

| الملف / المجلد | المالك الحصري | ملاحظة |
|---|---|---|
| `src/lib/schema.ts` | **D1** فقط | القلب. الآخرون يستهلكون فقط. |
| `src/lib/constants.ts` | **D1** فقط | |
| `src/components/LocalServicePage.tsx` | **D1** فقط | طلبات التعديل عبر Issue |
| `src/components/SEO.tsx` | **D1** فقط | |
| `src/app/sitemap.ts` | **D1** فقط | كل مطور يفتح Issue لإضافة مساراته |
| `src/app/contact/**` | **D1** | إزالة قسم الفروع |
| `src/lib/seasonalContent.tsx` 🆕 | **D2** | ملف جديد يخصّه |
| `src/app/national-day/**` `offers` `founding-day` `eid-offers` | **D2** | |
| `src/lib/serviceHubs.ts` | **مشترك D3+D4** ⚠️ | انظر §3.1 بروتوكول الملف المشترك |
| `src/lib/hubContent.tsx` | **مشترك D3+D4** ⚠️ | نفس البروتوكول |
| `src/app/qahwajiat-mubasherat` `saqya-zamzam` `diyafa-aza` `diyafa-takharruj` | **D3** | |
| `src/app/diyafa-shirkat` `rukn-tumur-halawiyat` `istiqbal-vip` | **D4** | |
| `src/lib/localPages.ts` | **D5** فقط | D6/D7 يقرأون `districts` منه |
| `src/lib/localContent.tsx` | **D5** فقط | |
| `src/app/[serviceCity]/**` | **D5** | |
| `src/lib/districtContent.tsx` 🆕 | **مشترك D6+D7** ⚠️ | |
| `src/lib/districts.ts` 🆕 | **D7** | البيانات |
| `src/app/hayy/[district]/**` 🆕 | **D7** | المحرك · D6 يزوّد المحتوى |
| `src/lib/articles/**` 🆕 | **D8** | ملف لكل مقال — صفر تعارض |
| `src/app/articles/**` 🆕 | **D8** | |
| `public/images/**` | **D9** فقط | لا يرفع أحد صورة غيره |
| `src/lib/images.ts` | **D9** فقط | |
| `scripts/**` 🆕 | **D9** | سكربتات المعالجة |
| `tests/**` `.github/workflows/**` | **D10** فقط | |
| `package.json` `next.config` `tailwind.config` | **D1** فقط | |

## 3.1 بروتوكول الملف المشترك (لـ `serviceHubs.ts` و `hubContent.tsx` و `districtContent.tsx`)
لتفادي تعارض الدمج على ملف واحد بين مطورَين:
1. **كل مطور يضيف مفاتيحه في نهاية الكائن فقط** — ممنوع إعادة ترتيب أو تنسيق المفاتيح الموجودة.
2. ضع علامة قسم قبل مفاتيحك:
   ```ts
   // ─── D3 SERVICES ─── (لا تعدّل تحت هذا الخط إن لم تكن D3)
   ```
3. **ادمج `main` في فرعك يومياً** قبل بدء العمل: `git pull --rebase origin main`
4. إن حصل تعارض → **يفوز من دفع أولاً**، والثاني يعيد تطبيق مفاتيحه فقط.

---

# 4. Git — نظام الفروع والالتزام

## 4.1 تسمية الفروع
```
feat/<dev-id>/<phase>-<short-desc>
```
أمثلة: `feat/d2/p1-national-day` · `feat/d6/p4-jeddah-abhur` · `fix/d1/p0-remove-fake-branches`

## 4.2 رسائل الـCommit (Conventional Commits — إلزامي)
```
<type>(<scope>): <وصف بالعربي أو الإنجليزي>

feat(national-day): add National Day 96 landing page with offer schema
fix(schema): replace LocalBusiness with ProfessionalService + GeoCircle
content(articles): add pricing guide article for Jeddah
chore(images): optimize 50 source webp assets into 3 crops
```
الأنواع المسموحة: `feat` `fix` `content` `chore` `docs` `test` `perf` `refactor`

## 4.3 دورة العمل اليومية
```bash
git checkout main && git pull origin main
git checkout -b feat/d6/p4-jeddah-abhur
# ...اشتغل...
npm run typecheck && npm run lint && npm run build && npx vitest run
git add -A && git commit -m "content(districts): add Abhur North district page"
git push -u origin feat/d6/p4-jeddah-abhur
# افتح PR → main
```

## 4.4 ✅ قائمة فحص الـPR (تُلصق في وصف كل PR)
```markdown
### PR Checklist — أصول الضيافة V3
- [ ] `npm run typecheck` → 0 errors
- [ ] `npm run lint` → 0 errors
- [ ] `npm run build` → success
- [ ] `npx vitest run` → all pass
- [ ] R1: لا صورة مولّدة بالذكاء الاصطناعي
- [ ] R2: لا كلمة «فرع/فروع/مقرنا/زورونا»
- [ ] R4: كل صورة مسحوبة موثّقة في `docs/IMAGE_LICENSES.md`
- [ ] R5: لا `LocalBusiness` في أي JSON-LD
- [ ] R7: لم أعدّل ملفاً خارج ملكيتي
- [ ] المحتوى ≥ 700 كلمة (أحياء: 550)
- [ ] ≥ 6 أسئلة FAQ + JSON-LD لها
- [ ] كل `<Image>` عنده `alt` عربي وصفي
- [ ] ≥ 5 روابط داخلية خارجة
- [ ] فتحت Issue لـ D1 لإضافة المسار في `sitemap.ts`
- [ ] Lighthouse (mobile) ≥ 90 على الصفحة الجديدة
```

## 4.5 قواعد المراجعة
- **D1 مراجع إلزامي** على كل PR يمسّ schema أو بنية.
- **D10 مراجع إلزامي** على كل PR فيه صفحة جديدة (فحص SEO والأداء).
- **مراجعان مطلوبان** لأي PR يمسّ ملفاً مشتركاً.
- PR أكبر من **800 سطر** = يُرفض ويُقسّم.

---

# 5. 🎫 بطاقات المهام — تفصيل لكل مطور

## ═══ D1 · 🏛️ Architect / Lead ═══
### المهمة P0-1 — إزالة الفروع الوهمية (أولوية قصوى · يوم 1)
**الملفات:** `src/lib/schema.ts` · `src/app/contact/ContactClient.tsx` · `src/lib/hubContent.tsx` · `src/lib/localPages.ts`

**الخطوات الدقيقة:**
1. **احذف** `export const BRANCHES` بالكامل (`schema.ts:40-73`).
2. **أعد كتابة** `generateLocalBusinessSchema()` → `generateProfessionalServiceSchema()`:
```ts
export function generateProfessionalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    description:
      "أصول الضيافة — خدمات ضيافة فاخرة متنقّلة في السعودية. قهوجيين وصبّابين ومباشرين بزي تراثي، قهوة عربية وتمور، نصل إلى موقع مناسبتك.",
    url: SITE_URL,
    telephone: PHONE_TEL,
    email: EMAIL,
    priceRange: "$$",
    image: `${SITE_URL}/images/hero/hero-desktop.webp`,
    // ⚠️ لا address — نحن Service Area Business بلا مقر يزوره العميل
    serviceArea: SERVICE_AREAS.map((a) => ({
      "@type": "GeoCircle",
      geoMidpoint: { "@type": "GeoCoordinates", latitude: a.lat, longitude: a.lng },
      geoRadius: a.radiusKm * 1000,
      name: a.ar,
    })),
    areaServed: SERVICE_AREAS.map((a) => ({ "@type": "City", name: a.ar })),
    sameAs: Object.values(SOCIAL_LINKS),
  };
}
```
3. **أنشئ** بديل `BRANCHES`:
```ts
/** مناطق الخدمة — نصل إليها، ولا نملك فيها مقرات. */
export const SERVICE_AREAS = [
  { ar: "جدة",             region: "منطقة مكة المكرمة",     lat: 21.485811, lng: 39.192505, radiusKm: 45 },
  { ar: "ينبع",            region: "منطقة المدينة المنورة", lat: 24.089500, lng: 38.063400, radiusKm: 40 },
  { ar: "بدر",             region: "منطقة المدينة المنورة", lat: 23.779000, lng: 38.790000, radiusKm: 35 },
  { ar: "المدينة المنورة", region: "منطقة المدينة المنورة", lat: 24.470901, lng: 39.612236, radiusKm: 40 },
  { ar: "مكة المكرمة",     region: "منطقة مكة المكرمة",     lat: 21.389082, lng: 39.857910, radiusKm: 40 },
] as const;
```
4. **`ContactClient.tsx`:** بدّل `id="branches"` → `id="service-areas"`، والعنوان → **«مناطق نخدمها»**، واستورد `SERVICE_AREAS` بدل `BRANCHES`. **احذف روابط `mapUrl`** (لا يوجد موقع يُزار).
5. **`hubContent.tsx:56`** — النص الجديد بالضبط:
> «أينما كانت مناسبتك في السعودية، فريقنا يصل إليك. نحن **مزوّد خدمة ضيافة متنقّل** — نغطّي جدة وينبع البحر والصناعية وبدر والمدينة المنورة ومكة المكرمة، ننتقل بفريقنا وعدّتنا الكاملة إلى موقعك، فلا تحتاج للذهاب إلى أي مكان.»
6. **`localPages.ts:59`** (يُنسّق مع D5) — احذف «موطن فرعنا الرئيسي» → «من أكثر المدن التي نخدمها — نغطّي ينبع البحر والصناعية والهيئة الملكية بوصول سريع.»
7. **حدّث** `src/lib/schema.test.ts` — أضف اختبارَين:
   - `expect(JSON.stringify(schema)).not.toContain("LocalBusiness")`
   - `expect(schema).not.toHaveProperty("address")`

**تعريف الإنجاز:**
- `grep -rn "BRANCHES\|LocalBusiness\|فروع\|فرعنا" src/` → **صفر نتائج**
- `npx vitest run` → أخضر · اختبار Rich Results على `ProfessionalService` → صالح

### المهمة P0-2 — بنية تحتية للفريق (يوم 2)
- ملف `CODEOWNERS` يطابق §3
- حماية فرع `main`: PR إلزامي + مراجعة + CI أخضر
- 10 قوالب Issue (واحد لكل مطور) + قالب PR
- **بوابة CI: سكربت `scripts/guard.mjs`** يفشل البناء عند:
  `LocalBusiness` · `BRANCHES` · «فرع/فروع/مقرنا» · صورة غير موثّقة في `IMAGE_LICENSES.md`

### المهمة P0-3 — Google Business Profile
- تحويل الملف إلى **Service Area Business** — **إخفاء العنوان** وتحديد مناطق الخدمة الخمس.
- التحقق من Search Console + ربط GA4 (`G-TLRS7CGGGY`).

---

## ═══ D2 · 🔥 Seasonal — 4 صفحات ═══
> ⏰ **`/national-day` موعد نهائي صارم: 25 أغسطس 2026.** لا تأجيل.

| المسار | H1 | الاستهداف |
|---|---|---|
| `/national-day` | ضيافة اليوم الوطني السعودي 96 — عروض خاصة | «ضيافة اليوم الوطني» «قهوجيين اليوم الوطني» «ركن قهوة اليوم الوطني جدة» |
| `/offers` | عروض وباقات ضيافة أصول الضيافة | «عروض ضيافة» «باقات قهوجيين» |
| `/founding-day` | ضيافة يوم التأسيس | «ضيافة يوم التأسيس» |
| `/eid-offers` | ضيافة الأعياد | «ضيافة العيد» «قهوجيين العيد» |

**متطلبات خاصة بـ `/national-day`:**
- `Offer` schema مع `validFrom: 2026-08-25` · `validThrough: 2026-09-30` · `priceCurrency: "SAR"`
- **عدّاد تنازلي** لـ 23 سبتمبر (`"use client"` — المكوّن الوحيد المسموح له)
- ≥3 باقات مسعّرة بوضوح · ≥8 أسئلة FAQ · واتساب برسالة مخصصة: «أرغب بعرض اليوم الوطني»
- ألوان: أخضر سعودي `#006C35` **كلمسة فقط** فوق الهوية الذهبية/الداكنة — لا تكسر الهوية
- صور: من `SETUP_IMAGES` + `PRODUCT_IMAGES` معالجة من D9 بتدرّج وطني
- **بعد الموسم:** لا تحذف الصفحة — حوّلها لأرشيف واحتفظ بالـURL (يبني سلطة سنوية)

---

## ═══ D3 · 🛎️ Services A — 4 صفحات ═══
| المسار | H1 | ملاحظة حرجة |
|---|---|---|
| `/qahwajiat-mubasherat` | قهوجيات ومباشرات وصبّابات للمناسبات النسائية | 🔴 **أهم فجوة تنافسية.** يستهدف «قهوجيات» «صبابات» «مباشرات» «ضيافة نسائية». نبرة محترمة تماماً. استخدم صور فريق نسائي فقط إن توفّرت — وإلا صور تجهيزات ومنتجات. |
| `/saqya-zamzam` | خدمة سقاية زمزم للمناسبات والأعزية | نبرة وقورة. لا تسويق مبالغ. |
| `/diyafa-aza` | ضيافة العزاء والمجالس | 🕊️ **نبرة رصينة تعزيتية — ممنوع أي لغة احتفالية أو إيموجي.** خدمة سريعة الاستجابة. |
| `/diyafa-takharruj` | ضيافة حفلات التخرج | موسمي: مايو–يوليو. |

---

## ═══ D4 · 🏢 Services B — 3 صفحات ═══
| المسار | H1 | ملاحظة |
|---|---|---|
| `/diyafa-shirkat` | ضيافة الشركات والمقرات والاجتماعات | B2B: عقود شهرية، فواتير ضريبية، سجل تجاري، اتفاقية مستوى خدمة |
| `/rukn-tumur-halawiyat` | ركن التمور والحلويات العربية | استخدم `DATES_IMAGES` (7 صور) |
| `/istiqbal-vip` | استقبال كبار الشخصيات والوفود الرسمية | بروتوكول، سرّية، فريق مخصص |

---

## ═══ D5 · 🗺️ Geo Engine — 20 صفحة ═══
**وسّع `localPages.ts` من خدمتين إلى 6:**
```ts
export const SERVICES = [
  "sababin-qahwa",       // موجودة
  "diyafa-munasabat",    // موجودة
  "qahwajiin",           // جديدة
  "rukn-qahwa",          // جديدة
  "diyafa-aaras",        // جديدة
  "qahwajiat",           // جديدة — نسائي محلي
] as const;
```
`6 خدمات × 5 مدن = 30 مسار` (10 موجودة) ⇒ **20 جديدة** عبر `generateStaticParams` (لا ملفات يدوية).

🔴 **الخطر الأكبر عليك: التكرار.** عندك 30 صفحة من قالب واحد. الإلزام:
- **لكل مدينة** فقرة سياق حقيقية: قاعات معروفة، زمن وصول، طبيعة الطلب فيها.
- **لكل خدمة** أقسام H2 مختلفة فعلاً — لا تعيد نفس الهيكل.
- استخدم مصفوفات مختلفة: `whyUs` و `faqs` و `packages` تختلف بالمدينة **والخدمة** معاً.
- **D10 سيقيس التشابه آلياً.** أي صفحتين تشابههما >60% → الـPR مرفوض.

---

## ═══ D6 + D7 · 📍 Districts — 16 صفحة (الفجوة الذهبية 💎) ═══
> اكتشاف الدراسة: **لا منافس واحد يملك صفحات أحياء حقيقية.** هذه أسهل انتصاراتنا.

**D7 يبني المحرك أولاً (أسبوع 7):** `src/lib/districts.ts` + `src/app/hayy/[district]/page.tsx` بـ `generateStaticParams` + `dynamicParams = false`.
**نمط الرابط:** `/hayy/<district-slug>-<city-slug>` مثال: `/hayy/abhur-shamaliya-jeddah`

**D6 — جدة (10):** أبحر الشمالية · الشاطئ · الحمراء · الروضة · الصفا · الخالدية · السلامة · الحمدانية · الزهراء · النعيم
**D7 — ينبع (6):** ينبع البحر · ينبع الصناعية · الهيئة الملكية · النواة · الصبيب · شربا

🔴 **شرط عدم العقوبة — كل صفحة حي يجب أن تحوي محتوى حقيقياً فريداً:**
| العنصر | مطلوب |
|---|---|
| معالم الحي | ≥3 معالم حقيقية بالاسم |
| قاعات/منتجعات/استراحات في الحي | ≥2 بالاسم |
| زمن وصول تقديري | رقم واقعي |
| ملاحظة لوجستية حقيقية | مثل: مواقف، مداخل، ازدحام أوقات معينة |
| فقرة سياق فريدة | ≥150 كلمة لا تتكرر في أي حي آخر |
| أحياء مجاورة | روابط داخلية |

**تحذير:** صفحة حي فيها نص عام + اسم مبدّل = **Doorway Page**. أفضل 6 صفحات أحياء ممتازة من 16 صفحة ضعيفة. **لو حي ما عندك عنه محتوى حقيقي — لا تنشره.**

---

## ═══ D8 · ✍️ Content Authority — 12 صفحة ═══
**ابنِ نظام مقالات أولاً:** `src/lib/articles/<slug>.tsx` (ملف لكل مقال = صفر تعارض) + `src/app/articles/[slug]/page.tsx` + فهرس `/articles`.

| # | المقال | الطول | ملاحظة |
|---|---|---|---|
| 1 | كم يكلف قهوجي في جدة؟ دليل الأسعار 2026 | 1500 | 🥇 أعلى نية شرائية |
| 2 | كم قهوجي أحتاج حسب عدد الضيوف؟ | 1000 | + **حاسبة تفاعلية** (`"use client"`) |
| 3 | الفرق بين القهوجي والمباشر والصبّاب | 900 | |
| 4 | آداب صبّ القهوة العربية في المناسبات السعودية | 1200 | محتوى ثقافي = روابط خلفية |
| 5 | كيف تجهز ركن قهوة عربية فاخر | 1100 | + `HowTo` schema |
| 6 | تجهيز ضيافة عزاء — الدليل الكامل | 1000 | نبرة رصينة |
| 7 | أفضل 10 قاعات أفراح في جدة وكيف نخدمها | 1400 | 🥈 يجذب باحثي القاعات |
| 8 | ضيافة اليوم الوطني — أفكار وتنسيقات | 1000 | ⏰ قبل 25 أغسطس |
| 9 | أنواع القهوة العربية والفرق بينها | 1000 | |
| 10 | جدول زمني لتجهيز ضيافة حفل زفاف | 1100 | + `HowTo` schema |
| 11 | أخطاء شائعة في ضيافة المناسبات | 900 | |
| 12 | فهرس `/articles` | — | صفحة الفهرس |

**كل مقال:** `Article` schema + `author` + `datePublished` + جدول محتويات + ≥5 روابط داخلية لصفحات الخدمة + CTA واتساب في المنتصف والنهاية.

---

## ═══ D9 · 🖼️ Visual Assets — 240 أصل ═══
> 🔴 **R1: صفر توليد بالذكاء الاصطناعي. إن ولّدت صورة واحدة، يُرفض عملك كله.**

### الطبقة 1 — تحسين الـ50 الحالية (أسبوع 1–3)
اكتب `scripts/optimize-images.mjs` بمكتبة `sharp`:
```
لكل صورة من الـ50:
  ├─ رفع دقة إن <1600px
  ├─ تدرّج لوني موحّد (Gold/Dark brand grade)
  ├─ إزالة تشويش + زيادة حدة
  ├─ 3 قصّات: 16:9 (هيرو) · 4:5 (موبايل) · 1:1 (مصغرة)
  ├─ AVIF + WebP لكل قصّة
  └─ أحجام متجاوبة: 640 / 1080 / 1920
```
⇒ **~180 ملف مخرَج**

### الطبقة 2 — السحب المرخّص (أسبوع 3–6)
- **مسموح فقط:** Creative Commons / Public Domain / Unsplash / Pexels / Openverse
- **ممنوع منعاً باتاً:** Getty · Shutterstock · Alamy · iStock · Adobe Stock · Freepik Premium
- **كل صورة تُسجَّل إلزامياً في `docs/IMAGE_LICENSES.md`:**
  ```
  | الملف | المصدر (URL) | الرخصة | تاريخ السحب | التعديلات المطبقة |
  ```
- صورة بلا سجل = **CI يفشل** (بوابة D1).

### الطبقة 3 — التعديل كي لا تتطابق (إلزامي على كل صورة مسحوبة)
`scripts/dedupe-images.mjs` — **5 تعديلات على الأقل لكل صورة:**
1. إعادة قصّ/تأطير مختلف (تغيير التكوين، ليس مجرد تصغير)
2. تدرّج ألوان هوية العلامة (ذهبي/داكن)
3. طبقة حبيبات فيلم خفيفة
4. قلب أفقي حين يكون مناسباً
5. عنصر هوية (ختم/زخرفة) + إعادة ترميز (تغيير البصمة الرقمية)

⚠️ **تنبيه صريح:** التعديل يمنع التطابق البصري لكنه **لا يلغي حقوق الملكية**. لذلك الطبقة 2 مقيّدة بالمصادر المرخّصة فقط. الاعتماد الأساسي يبقى على الـ50 صورة الأصلية.

### مسؤوليات إضافية
- تحديث `src/lib/images.ts` بالمسارات الجديدة
- **كتابة `alt` عربي وصفي لكل أصل** (D9 مسؤول عن قاموس الـalt، لا كل مطور على حدة)
- ميزانية الحجم: **لا صورة تتجاوز 200KB** بعد المعالجة

---

## ═══ D10 · ✅ QA / SEO / Perf ═══
### الأسبوع 1 — بناء البوابات
`.github/workflows/ci.yml`:
```yaml
jobs: typecheck · lint · build · vitest · guard-rules · lighthouse-ci
```
`scripts/guard.mjs` — يفشل عند:
- ❌ `LocalBusiness` أو `BRANCHES` في أي مكان
- ❌ «فرع» / «فروع» / «مقرنا» / «زورونا في»
- ❌ `<Image>` بلا `alt`
- ❌ رقم هاتف/واتساب مكتوب يدوياً خارج `constants.ts`
- ❌ صورة في `public/images/` غير مسجّلة في `IMAGE_LICENSES.md`
- ❌ صفحة أقل من 700 كلمة (أحياء 550)
- ❌ صفحة بلا JSON-LD
- ❌ **تشابه >60% بين صفحتين** (كاشف تكرار)

### مستمر
- Playwright E2E لكل صفحة جديدة (تحمّل · H1 موجود · واتساب يعمل · JSON-LD صالح)
- Lighthouse mobile ≥90 في الأربعة
- رفع Sitemap لـ Search Console بعد كل مرحلة
- **تقرير أسبوعي:** صفحات مفهرسة · الترتيب لكل كلمة · نقرات · Core Web Vitals

---

# 6. 🗓️ الجدول الزمني — 13 أسبوع

```
الأسبوع │ D1   D2    D3   D4   D5   D6   D7   D8   D9   D10
────────┼───────────────────────────────────────────────────
  W1    │ P0🔴 ND🔥  بحث  بحث  خطة  بحث  محرك بحث  L1🖼️ CI
  W2    │ مراجعة ND🔥 s1  s1   —    —    —    نظام L1   بوابات
  W3    │ مراجعة عروض s2  s2  توسعة —   —    a1   L1+L2 اختبار
────────┼──── 🚩 بوابة 1: /national-day منشورة (25 أغسطس) ────
  W4    │ مراجعة تأسيس s3 s3  محتوى —   —    a2   L2   قياس
  W5    │ مراجعة أعياد s4 —   10صفحة بحث بحث a3   L2   قياس
  W6    │ مراجعة أرشفة — —   10صفحة إعداد محرك a4  L2+L3 قياس
────────┼──── 🚩 بوابة 2: 11 خدمة + 20 صفحة مدينة ────
  W7    │ مراجعة دعم دعم دعم صقل  h1-4 محرك a5   L3   تدقيق
  W8    │ مراجعة —   —   —   صقل  h5-8 y1-3 a6  L3   تدقيق
  W9    │ مراجعة —   —   —   —    h9-10 y4-6 a7 L3   تدقيق
────────┼──── 🚩 بوابة 3: 16 صفحة حي ────
  W10   │ مراجعة —   —   —   —    مراجعة مراجعة a8-9 صقل تقرير
  W11   │ مراجعة —   —   —   —    —    —    a10-11 صقل تقرير
  W12   │ مراجعة —   —   —   —    —    —    a12   صقل تقرير
────────┼──── 🚩 بوابة 4: 12 مقال ────
  W13   │ 🎯 الكل: صفحات الثقة (6) + تدقيق شامل + إطلاق نهائي
```

## البوابات الأربع (Gates) — لا تُتخطّى
| البوابة | الموعد | المعيار |
|---|---|---|
| 🚩 **G1** | **25 أغسطس** | `/national-day` منشورة + مفهرسة + المرحلة 0 مكتملة 100% |
| 🚩 **G2** | نهاية W6 | 11 صفحة خدمة + 30 صفحة مدينة · كلها Lighthouse ≥90 |
| 🚩 **G3** | نهاية W9 | 16 صفحة حي · كاشف التكرار أخضر |
| 🚩 **G4** | نهاية W12 | 12 مقال · كل الصفحات مفهرسة في Search Console |

---

# 7. ⚠️ سجل المخاطر

| # | الخطر | الاحتمال | الأثر | التخفيف |
|---|---|---|---|---|
| M1 | فوات موسم اليوم الوطني | عالٍ | قاتل | D2 يبدأ **اليوم 1**، G1 بوابة صارمة، لا مهام أخرى له قبلها |
| M2 | عقوبة تكرار محتوى من 46 صفحة قالبية | عالٍ | قاتل | كاشف تشابه آلي عند D10 · قاعدة 40% فريد · رفض PR |
| M3 | مطور يستخدم توليد AI للصور سراً | متوسط | عالٍ | D9 المالك الحصري لـ`public/images` · سجل رخص إلزامي · بوابة CI |
| M4 | تعارض دمج على الملفات المشتركة | عالٍ | متوسط | بروتوكول §3.1 · rebase يومي · `CODEOWNERS` |
| M5 | صورة محمية بحقوق تتسرب | متوسط | عالٍ | قائمة منع صريحة · سجل رخص · مراجعة D1 |
| M6 | تضخّم الموقع 21→86 صفحة يضعف السلطة | متوسط | عالٍ | نشر تدريجي عبر البوابات · ربط داخلي كثيف · جودة قبل كمية |
| M7 | مطور يترقّي Next/React ويكسر البناء | منخفض | عالٍ | R6 + قفل الإصدارات + `package.json` ملك D1 حصراً |
| M8 | صفحات الأحياء تُقرأ كـ Doorway | متوسط | قاتل | معايير §D6/D7 الست · **لا تنشر حي بلا محتوى حقيقي** |

---

# 8. 📊 مقاييس النجاح

| المقياس | الآن | بعد 3 أشهر | بعد 6 أشهر |
|---|---|---|---|
| صفحات مفهرسة | ~10 | 86 | 86 |
| إجمالي الكلمات | 5,010 | 60,000 | 75,000 |
| متوسط كلمات/صفحة | 238 | 700+ | 850+ |
| ترتيب «قهوجيين جدة» | خارج 100 | أول 20 | أول 5 |
| ترتيب «قهوجيين ينبع» | ؟ | **أول 3** | **#1** |
| كلمات في أول 10 | ~2 | 25 | 60 |
| Lighthouse موبايل | ؟ | ≥90 | ≥95 |
| استفسارات واتساب/شهر | خط أساس | ×3 | ×6 |

---

# 9. 🚀 برومبت الإطلاق — انسخه وأرسله للفريق

```
أنت المطور [Dx] في فريق من 10 مطورين على مشروع «أصول الضيافة V3».

المستودع: github.com/MoTechSys/osoul-aldiafa-v3 (فرع main)
اقرأ أولاً وبالكامل:
  1. docs/WORK_ORDER_V3.md      ← أمر التشغيل (هذه الوثيقة)
  2. docs/STUDY_AND_PLAN_V3.md  ← الدراسة والتحليل
  3. docs/REFACTOR_LOG.md       ← ما فشل سابقاً (لا تعده)

مهمتك: القسم §5 ═══ Dx ═══ في أمر التشغيل. اقرأه حرفياً.

قواعد ملزمة لا تُكسر (R1–R8 في §0):
  🔴 R1 ممنوع توليد أي صورة بالذكاء الاصطناعي — إطلاقاً
  🔴 R2 ممنوع كلمة «فرع/فروع/مقرنا/زورونا» — الشركة مزوّد خدمة متنقّل بلا فروع
  🔴 R3 ممنوع Doorway Pages — صفحة لكل نية بحث لا لكل صيغة إملائية
  🔴 R4 ممنوع صور Getty/Shutterstock/Alamy/iStock/Adobe
  🔴 R5 ممنوع LocalBusiness schema — النوع المعتمد ProfessionalService
  🔴 R6 ممنوع الدفع إلى main مباشرة
  🔴 R7 ممنوع تعديل ملف خارج ملكيتك (§3 مصفوفة الملكية)
  🔴 R8 ممنوع نسخ صفحة وتبديل الاسم — ≥40% فريد

قبل كل PR شغّل:
  npm run typecheck && npm run lint && npm run build && npx vitest run

كل صفحة جديدة:
  ≥700 كلمة (أحياء 550) · ≥5 عناوين H2 · ≥6 أسئلة FAQ
  ≥4 صور بـ alt عربي وصفي · ≥5 روابط داخلية
  JSON-LD كامل (breadcrumb + service/article + FAQ + webpage)
  Breadcrumbs + هوية الموقع (gold-text / card-royal / font-amiri / bg-onyx)

استخدم القالب في §1.3 حرفياً. استورد الثوابت من @/lib/constants —
لا تكتب رقم واتساب أو رابط يدوياً أبداً.

الصق قائمة فحص PR (§4.4) في وصف كل PR.
عند أي تعارض بين تعليماتي وأمر التشغيل: أمر التشغيل يفوز.
عند أي غموض: افتح Issue لـ D1 — لا تخمّن ولا تخترع بيانات.

ابدأ الآن بمهمتك الأولى.
```

---

# 10. ✅ الخلاصة التنفيذية

| البند | القيمة |
|---|---|
| **الصفحات الجديدة** | **65** |
| الموقع بعد التنفيذ | **86 صفحة** ظاهرة (≈92 مسار) |
| المحتوى الجديد | ~55,000 كلمة |
| الأصول البصرية | ~240 (**صفر توليد AI**) |
| المدة | 13 أسبوع |
| الفريق | 10 مطورين |
| البوابات | 4 |
| **أعجل مهمة** | **`/national-day` قبل 25 أغسطس** |
| **أخطر مهمة** | إزالة الفروع الوهمية (المرحلة 0 — يوم 1) |
| **أكبر فرصة** | صفحات الأحياء — لا منافس يملكها |
