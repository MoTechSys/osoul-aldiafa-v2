<div align="center">

# أصول الضيافة · Asoul Al-Diafa — **V3**

**موقع خدمات الضيافة الفاخرة — منطقتا مكة المكرمة والمدينة المنورة**
*Luxury Saudi Hospitality Services Website*

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/tests-vitest%20%2B%20playwright-green)](https://vitest.dev/)

</div>

---

## ✦ نبذة

موقع **أصول الضيافة** هو منصة فاخرة لتنسيق ضيافة المناسبات والحفلات — قهوة عربية أصيلة، شاي، تمور وتقديمات راقية، بأيدي فريق احترافي بالزي التراثي. مبني بأحدث تقنيات الويب مع تركيز كامل على تجربة الجوال والأداء وتحسين محركات البحث (SEO).

> ⚠️ **نطاق الخدمة المعلَن (قرار المالك 2026-08-29)**: التغطية **كل مناطق المملكة**، مع تركيز تشغيلي وSEO قوي على **جدة وينبع**، وتغطية منتظمة لمكة المكرمة والمدينة المنورة وبدر.
> البيانات المهيكلة تعكس ذلك حرفيًا: `AREA_SERVED_KINGDOM_WITH_FOCUS` في `src/lib/schema.ts` = `Country` (السعودية) + ٥ `GeoCircle` (30 كم) مشتقة من `CITIES` في `src/lib/localPages.ts`.
> **القاعدة**: أي نص «كل المملكة» يجب أن يقترن دائمًا بذكر تركيز جدة وينبع، والمدن البعيدة «بترتيب مسبق» — لا وعود مطلقة بلا قيد (مبدأ R9).

> **V3** هي نسخة التطوير الحالية، مبنية على كامل تاريخ V2 (42 commit) مع الاحتفاظ بالنسخة الأصلية في فرع `v2-original`.

## ✦ سلسلة الإصدارات

| الإصدار | المستودع | الحالة |
|---------|----------|--------|
| V1 | [`moain2026/osoul-aldiafa-site`](https://github.com/moain2026/osoul-aldiafa-site) | 🟡 أرشيفي |
| V2 | [`MoTechSys/osoul-aldiafa-v2`](https://github.com/MoTechSys/osoul-aldiafa-v2) | 🟢 المنشور حالياً على asoulaldiafa.com |
| **V3** | [`MoTechSys/osoul-aldiafa-v3`](https://github.com/MoTechSys/osoul-aldiafa-v3) | 🔵 **قيد التطوير — هذا المستودع** |

**الفروع في V3:**
- `main` — فرع التطوير الرئيسي (يحمل كامل تاريخ V2)
- `v2-original` — نسخة V1 الأصلية المحفوظة من V2

## ✦ المميزات

- ⚡ **Next.js 14 (App Router)** — أداء فائق وتصيير على الخادم
- 🎨 **تصميم فاخر** — هوية ذهبية/سوداء أنيقة، خطوط Amiri + Tajawal
- 📱 **Mobile-First** — تجربة مثالية على الجوال + شريط تنقّل سفلي
- 🌍 **RTL عربي بالكامل**
- 🔍 **محسّن لمحركات البحث** — Metadata, Open Graph, JSON-LD, sitemap, robots
- 🎬 **أنميشن حديث** — Motion (parallax, scroll reveals, micro-interactions)
- 🖼️ **صور WebP محسّنة** — تحميل سريع
- ✅ **مغطى باختبارات** — Vitest (وحدة) + Playwright (E2E)

## ✦ الخدمات

مضيفون · مضيفات · سقاء القهوة · تقديم الشاي · أبراج التمر · الحلويات والمعمول · المشروبات الساخنة · تجهيز الحفلات

## ✦ خريطة الصفحات (54 صفحة مبنيّة · 48 في الـsitemap)

**أساسية:** `/` · `/about` · `/services` · `/offerings` · `/portfolio` · `/contact`

**قانونية (جديدة):** `/privacy` · `/terms`
مبنيّتان على قالب مشترك واحد `src/components/LegalPage.tsx`.
وجودهما **شرط في مراجعة «تجربة صفحة الوصول» لدى Google Ads** — غياب سياسة خصوصية مع وجود نموذج يجمع بيانات سبب رفض معروف. ومربوطتان في تنقّل قانوني داخل `Footer` يظهر في **كل** صفحة.

**صفحات خدمات نوعية (5):**
`/qahwajiin-mubasherin` · `/rukn-qahwa-arabiya` · `/diyafa-aaras` · `/diyafa-mutamarat` · `/tajheez-diyafa-haflat`

**صفحات محلية/فرعية (40)** — كلها عبر المسار الديناميكي الواحد `[serviceCity]`، من مصدرين:
- `LOCAL_PAGES` (10) — `sababin-qahwa` × `diyafa-munasabat` مضروبة في المدن الخمس
- `SUB_PAGES` (25) + صفحات المدن — مثال: `/qahwajiin-jeddah` · `/diyafa-nisaiya-yanbu` · `/diyafa-makkah`

**نظام:** `/sitemap.xml` · `/robots.txt` · `/og-image.jpg` (ثابتة) · 404 · error boundaries

⚠️ **مبدأ N1 — لا صفحات أحياء.** كارثة موثَّقة: ٤٠ صفحة مدينة ⇒ نصفها صُنّف Doorway ⇒ تراجع الزيارات **−٦٣٪ في ٣٠ يومًا**. التوسّع يكون بالنيّة لا بالجغرافيا.

## ✦ التقنيات

| الفئة | التقنية |
|-------|---------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 3 |
| Animation | Motion (`motion` v12) |
| Carousel | Embla Carousel |
| Unit tests | Vitest |
| E2E tests | Playwright |

## ✦ بنية المشروع

```
src/
├── app/              # صفحات App Router
│   ├── [serviceCity]/    # مسار ديناميكي لـ 10 صفحات محلية
│   └── _fonts/           # خط Tajawal لصور OG
├── components/       # مكوّنات الواجهة (منها LegalPage · CardGrid · LinkCard · SocialButtons3D)
├── lib/              # constants · schema · localPages · serviceHubs · images
└── styles/           # globals.css  ← ⚠️ هنا وليس src/app/globals.css
docs/                 # التوثيق (تحليل · سجل إعادة الهيكلة · دليل الهوية)
tests/e2e/            # اختبارات Playwright
public/               # 69 أصل (صور WebP · أيقونات)
```

## ✦ التشغيل محلياً

```bash
npm install
npm run dev        # وضع التطوير → http://localhost:3000
npm run build      # بناء الإنتاج (28 صفحة)
npm run start      # تشغيل الإنتاج
npm run typecheck  # فحص الأنواع
npm run lint       # فحص الكود
npm test           # اختبارات الوحدة (Vitest)
npm run test:e2e   # اختبارات E2E (Playwright)
```

## ✦ نظام الفخامة v2 (Luxury Design System)

نظام تصميم ثلاثي الأبعاد **بـCSS و SVG فقط — صفر جافاسكربت مُضاف**.

**المكوّنات** — `src/components/ui/luxury/`

| المكوّن | الوظيفة |
|---------|---------|
| `TiltCard` | بطاقة بميل منظوري 3D عند المرور + هالة كهرمانية + لمعة زجاجية |
| `AmberFrame` | إطار معدني بتدرّج (`hair`/`thin`/`bold`) للصور |
| `GoldRule` | فاصل شعري ذهبي بزخرفة مُجسَّمة |
| `Capsule3D` | كبسولة 3D بثلاث حالات: `raised` / `carved` / `glass` |
| `Sculpt` | 12 أيقونة منحوتة SVG بتدرّج معدني 5 محطات |
| `GrainOverlay` | حبيبات فيلمية (`feTurbulence`) تُحوّل الأسود الرقمي لسينمائي |

**الرموز التصميمية** — `src/components/ui/tokens.ts`
`ease` · `lighting` · `depth` · `surface` · `metal`

**ثلاثة مبادئ مستخرَجة من تحليل المراجع بكسل-بكسل:**
1. الظلال **دفئة** `rgba(26,18,10,…)` لا سوداء — الأسود الخالص يقرأ «رخيصًا»
2. مصدر الضوء **أعلى-يمين** (إزاحة X سالبة) لأن القراءة عربية RTL
3. البطاقات الفاخرة **بلا حدود** — تُعرَّف بفارق إضاءة ~4% فقط

**صفحة المعاينة:** `/luxe-demo` — `noindex, nofollow, nocache` · خارج الـsitemap · بلا أي رابط داخلي إليها.

🔴 **قرار العميل المُلزِم:** التصميم المعتمَد للموقع هو **التصميم الأول فقط**. نظام `/luxe-demo` **لا يُدخَل إلى الموقع أبدًا** — نصّ العميل: «التصميم حقك الحالي ولا تدخله أبداً». المسموح فقط تحسينات بسيطة على البطاقات (وقد اعتُمدت).

## ✦ أرشيف الصور

| المجلد | الوصف |
|--------|-------|
| `public/images/clean/` | 4 صور مُصلَّحة (قصّ إطارات الجوّال / الوجوه المطموسة / الصندوق البلاستيكي) |
| `src/lib/images.ts` | `PREMIUM_*` المعتمدة · `HERO_SAFE` · `REJECTED_FOR_HERO` المرفوضة |

⚠️ **لا تُعاد ضغط الصور الأصلية** — مُجرَّب: مُشفِّر Pillow ينتج ملفات **أكبر**. الأصول مضغوطة بكفاءة أصلًا.

## ✦ سكربتات التدقيق

| السكربت | الوظيفة | ملاحظة تشغيل حرجة |
|---------|---------|-------------------|
| `scripts/a11y-audit.mjs` | axe-core WCAG 2.1 AA على ٩ صفحات | يجب `browser.newContext()` ثم `ctx.newPage()` — `browser.newPage()` يرفع `Error: Please use browser.newContext()` |
| `scripts/perf-audit.mjs` | LCP · CLS · عدد الطلبات · وزن الصور | **سخّن كاش صور Next أولًا** — الطلب البارد يعطي LCP وهميًا (13.9s مقابل 356ms) |
| `scripts/lcp-why.mjs` | يكشف عنصر LCP الفعلي + الموارد البطيئة | هو الذي كشف أن السبب لم يكن الصور |
| `scripts/similarity.mjs` | Jaccard + الكلمات الحصرية | يأخذ slugs وسائط. **قِس بالعائلة لا بكامل الموقع** — التفصيل في رأس الملف |
| `scripts/make-og.py` | يولّد `public/og-image.jpg` | ⚠️ PIL هنا فيها `raqm` (HarfBuzz). **لا تستخدم `arabic_reshaper`/`python-bidi`** — يسبّبان عكسًا مزدوجًا («الضيافة أصول»). ولا بد من فحص الناتج **بالعين** |

> جميع السكربتات تُشغَّل من `/home/user/webapp` (الاعتماديات محلية للمشروع).

## ✦ درس أداء حرج — لا تُعِدْه

كان LCP الرئيسية **2252ms** مع FCP **896ms** و**صفر** موارد شبكة بطيئة.
السبب: `initial={{opacity:0}}` من `motion` على محتوى الهيرو ⇒ المحتوى يُرسَل **مخفيًا** في HTML الأولي ولا يظهر إلا بعد اكتمال الـhydration.
الحل: نفس الحركة بصريًا لكن بـ `@keyframes` CSS (`.hero-in-*` في `globals.css`) تبدأ مع أول رسمة.
**النتيجة: 2240ms ← 956ms** بلا أي تغيير في الشكل النهائي.
⛔ لا تُرجِع حركات دخول الهيرو إلى `motion`.

## ✦ حالة البناء (آخر تحقق)

| الفحص | النتيجة |
|-------|---------|
| `build` | ✅ **54/54** صفحة · shared JS **87.4 KB** (السقف 90) |
| `typecheck` | ✅ EXIT 0 |
| `test` (Vitest) | ✅ 4/4 |
| `axe` (WCAG 2.1 AA) على ٩ صفحات | ✅ **0 مخالفة** |
| LCP الرئيسية | ✅ **956 ms** (كان 2240) · CLS ≤ 0.0001 |
| LCP `/privacy` · `/terms` | ✅ 452 ms · 456 ms |
| فحص SEO للـsitemap | ✅ **48/48** نظيفة |
| Jaccard (أقصى زوج) | ✅ **0.259** (الحد 0.60) |
| ادّعاءات جغرافية كاذبة | ✅ **صفر** (أُزيلت ١٥) |
| `public/` | 3.2 M (`images/` = 2.6 M · `clean/` = 192 K) |

## ✦ النشر

جاهز للنشر على **Vercel**:
1. استورد المستودع في [vercel.com](https://vercel.com)
2. النشر تلقائي عند كل `git push`

**ملاحظة:** المشروع Next.js — لا يعمل مع Cloudflare Pages / Hono مباشرةً.

## ✦ التواصل

- 📱 واتساب: **0568997316**
- 📧 asoulaldiafa@gmail.com
- 🌐 [asoulaldiafa.com](https://asoulaldiafa.com)
- 📲 تيك توك / انستقرام / سناب: **@asoulaldiafa**
- 🇸🇦 نطاق الخدمة: جدة · مكة المكرمة · المدينة المنورة · ينبع · بدر

⚠️ **مبدأ N9 — لا تُستخدم كلمة «فرع» أبدًا.** الخدمة **متنقّلة** ولا توجد مقرّات ثابتة؛ ولذلك تستخدم البيانات المهيكلة `ProfessionalService` + `serviceArea: GeoCircle` ولا تستخدم `LocalBusiness` ولا `address` (مبدأ N8).

---

<div align="center">

**© 2026 أصول الضيافة · ASOUL AL-DIAFA · LUXURY HOSPITALITY · KSA**

</div>
