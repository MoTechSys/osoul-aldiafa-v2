import type { Metadata, Viewport } from "next";
import { Tajawal, Amiri } from "next/font/google";
import "@/styles/globals.css";
import BottomNav from "@/components/BottomNav";
import { Analytics } from "@/components/Analytics";
import {
  generateProfessionalServiceSchema,
  generateWebSiteSchema,
  generateOrganizationSchema, jsonLd } from "@/lib/schema";

import { SITE_URL, OG_IMAGE_URL } from "@/lib/constants";

// م-١ — «صورة معاينة الرابط تظهر سوداء عند المشاركة».
// السبب الجذري مُثبَت بالقياس، وهو ليس عيبًا في الصورة:
//   • الملف المحلي public/og-image.jpg = ٥٥٬١٥٢ بايت، أقصى إضاءة ٢٥٣٫٣ (نصّ واضح ✅)
//   • الملف الذي يخدمه الإنتاج      = ١٣٬٤٦٩ بايت، أقصى إضاءة ٤٤٫٣، ولا بكسل فوق ١٠٠
//     ⇒ مستحيل رياضيًا أن يظهر فيه نصّ. بصمة MD5 له تساوي بصمة نسخة ٥ يونيو تمامًا.
// أي: الإنتاج ينشر لقطة قديمة، وترويسته `cache-control: immutable, max-age=31536000`
// تعني أن العنوان نفسه يبقى مخزَّنًا سنةً كاملة عند فيسبوك/واتساب وكل زاحف.
// لذلك لا يكفي إعادة النشر: نضيف بصمة الملف إلى العنوان حتى يراه الزاحف عنوانًا
// جديدًا فيُعيد جلبه. تُحدَّث هذه البصمة عند كل تغيير فعلي للصورة.
// افتراضي الـlayout يبقى الصورة القديمة عمدًا: أي صفحة لا تُعرّف صورتها
// (مثل /luxe-demo أو أي صفحة مستقبلية خارج manifest) ترث الـfallback لا صورة
// الرئيسية — وإلا نشرنا صورة خاطئة على صفحات لم يطلبها المالك.
const LAYOUT_OG = OG_IMAGE_URL;

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  // أداء: أُسقط الوزن 800 — قياس شامل (grep extrabold/fontWeight:800 على
  // src/ كاملًا) أثبت أنه غير مستخدم في أي موضع، وكان يُحمَّل ويُعمل له
  // preload في كل صفحة بلا مستهلك. الأوزان الباقية كلها مستخدمة فعلًا.
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-tajawal",
  preload: true,
});

// Switched secondary font from Cairo → Amiri for a fresh, more traditional/serif feel
const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-amiri",
  preload: true,
});

export const metadata: Metadata = {
  // D1.1: لا template للعلامة — كل صفحة مسؤولة عن عنوانها الكامل (يمنع تكرار العلامة)
  title: "أصول الضيافة | قهوجيين وصبابين وضيافة فاخرة في السعودية",
  description:
    // حاجز-1 (مراجعة 22 أغسطس 2026) — تصحيح مع تحفّظ:
    // ادّعى التقرير الخارجي «تناقضًا مُثبَتًا» بين هذا الوصف والصفحات، وهذا
    // غير دقيق: المدن الخمس في CITIES كلها فعلًا داخل منطقتَي مكة المكرمة
    // والمدينة المنورة (جدة/مكة ← منطقة مكة · المدينة/ينبع/بدر ← منطقة
    // المدينة)، فالعبارة كانت صحيحة إداريًا لا متناقضة.
    // لكن الخلل حقيقي من زاوية أخرى: اسم «جدة» — أكبر مدننا سكانيًا وأكبر
    // مصدر طلب متوقّع — لم يكن مذكورًا نصًّا في الوصف، فمن يبحث «قهوجيين
    // جدة» لا يجد أي تطابق لفظي في مقتطف الصفحة الرئيسية. الحل: تسمية
    // المدن الخمس صراحةً مع إبقاء ذكر المنطقتين، فتُجمع دقّة الانتماء
    // الإداري مع التطابق اللفظي للبحث. الطول 141 حرفًا (داخل حدّ مقتطف
    // جوجل ~155-160 حرفًا فلا يُقتطع).
    // قرار المالك 2026-08-29: التغطية كل المملكة، والتركيز اللفظي/SEO على
    // جدة وينبع تحديدًا (تتصدران الجملة = أعلى وزن في المقتطف).
    // حاجز-1 ما زال قائمًا: هذا الوصف يجب أن يطابق page.tsx حرفيًا.
    "قهوجيين وصبّابين قهوة عربية وتمور فاخرة بزي تراثي في جدة وينبع — نخدم كل مناطق المملكة، ومكة والمدينة وبدر بانتظام. استشارة مجانية قبل الحجز.",
  // D1.6: مختصرة عمداً — بلا وزن سيو منذ 2009
  keywords: ["أصول الضيافة", "قهوجيين", "صبابين قهوة", "ضيافة سعودية", "Asoul Al-Diafa"],
  metadataBase: new URL(SITE_URL),
  verification: {
    google:
      process.env.NEXT_PUBLIC_GSC_VERIFICATION ||
      "3MZ4yQ5xBdUOSJPm5nWsBKXyKNcKAiiPEW3SqCoFWHQ",
  },
  alternates: {
    canonical: SITE_URL,
    // `languages` omitted: the site is monolingual Arabic. Declaring an
    // ar-SA alternate that points to the same URL is unnecessary and can
    // mislead Google. Re-add only if real translated routes (e.g. /en) exist.
  },
  openGraph: {
    type: "website",
    siteName: "أصول الضيافة",
    locale: "ar_SA",
    title: "أصول الضيافة | خدمات الضيافة الفاخرة في المملكة",
    description:
      "نحيي أصول الضيافة العربية الأصيلة بفريق صبّابين بزي تراثي وقهوة عربية وتمور فاخرة في جدة وينبع، ونصل إلى كل مناطق المملكة.",
    url: SITE_URL,
    // صور الرئيسية من og-manifest (JPEG أولًا للتوافق مع واتساب، ثم WebP).
    images: [
      {
        url: LAYOUT_OG,
        width: 1200,
        height: 630,
        alt: "أصول الضيافة - خدمات الضيافة الفاخرة",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    // حساب X الرسمي (أكّده المالك 2026-08-29) — نفس اسم الدومين: @asoulaldiafa.
    // site = الحساب الناشر، creator = صاحب المحتوى؛ يربطان أي مشاركة للموقع
    // على X ببطاقة غنية منسوبة للحساب الرسمي (إشارة كيان إضافية).
    site: "@asoulaldiafa",
    creator: "@asoulaldiafa",
    title: "أصول الضيافة | خدمات الضيافة الفاخرة",
    description:
      "نحيي أصول الضيافة العربية الأصيلة في جدة وينبع وكل مناطق المملكة",
    images: [LAYOUT_OG],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.json",
  // م-١٦ — الأيقونات: كانت `/icon.svg` (وأشقاؤها الستة) تحمل شعار «كيف الضيافة»
  // — وهو موقع آخر يملكه العميل — لا شعار أصول الضيافة. أُثبت ذلك بالبكسل:
  // ارتباط الصورة بمرجع KEIF = 1.0000 مقابل 0.4788 لمرجع أصول الضيافة.
  // لذلك حُذفت ملفّات SVG الستة، وأُعيد توليد المجموعة كاملةً من الشعار الرسمي
  // (logo.webp: دلّة متوّجة تسكب في فنجان). الترتيب هنا مقصود: الأصغر أولًا
  // ليختار المتصفح 32px لشريط التبويب بدل تصغير 512px وطمس التفاصيل.
  // تحديث لاحق: الفافيكونات الآن «الوسم الدائري فقط» بخلفية شفافة (بدون النص
  // العربي غير المقروء بالأحجام الصغيرة، وبدون مربع أسود في التبويبات الداكنة).
  // أُعيدت /icon.svg بنسخة صحيحة (وسم أصول الضيافة) وأُدرجت هنا مجددًا.
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon.ico" }],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "أصول الضيافة",
    "mobile-web-app-capable": "yes",
    "application-name": "أصول الضيافة",
    "format-detection": "telephone=no",
  },
  category: "hospitality",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  // maximumScale removed: capping zoom violates WCAG 2.1 SC 1.4.4 (Resize Text).
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`scroll-smooth ${tajawal.variable} ${amiri.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd(generateOrganizationSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd(generateProfessionalServiceSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd(generateWebSiteSchema()),
          }}
        />
      </head>
      <body className="bg-noir text-pearl antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[100] focus:px-6 focus:py-3 focus:rounded-full focus:text-noir focus:font-bold focus:outline-none"
          style={{ background: "linear-gradient(135deg, #C5A059, #E2C68E)" }}
        >
          تخطي إلى المحتوى الرئيسي
        </a>
        {children}
        <BottomNav />
        <Analytics />
      </body>
    </html>
  );
}
