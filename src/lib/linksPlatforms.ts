// ═══════════════════════════════════════════════════════════════════
//  منصّات صفحة الروابط (/links)
//
//  الأصل: حزمة تصميم «Luxury Links» التي أرسلها المالك (٢٢ أغسطس ٢٠٢٦).
//  نُقلت من React عبر CDN + Babel-in-browser إلى Next.js أصلي.
//
//  قاعدة القبول (أمر المالك، حرفيًا):
//    «البطاقات اللي ما فيش معانا روابط لها مثل لينكد إن ويوتيوب
//     أخفيها لا تظهر بدقة، وتُكاد من الكود والرابط»
//
//  ما حُذف من الكود كليًا — لا عَلَم، لا تعليق، لا أصل صورة:
//    • youtube   — كان href: '#'  (لا قناة)
//    • linkedin  — كان href: '#'  (لا صفحة)
//    • telegram  — كان href: 'https://t.me/asoulaldiafa' وهو رابط
//      **غير موثَّق**: لا يوجد في SOCIAL_LINKS التي تحققنا منها ثلاث مرات.
//      نشر حساب غير مؤكَّد أسوأ من عدم نشره: زائر يضغطه فيجد لا شيء،
//      أو — أخطر — يجد حسابًا لا يملكه المالك. يُضاف فورًا عند التحقق.
//
//  كل رابط أدناه مصدره src/lib/constants.ts (المصدر الوحيد للحقيقة)،
//  فلا يمكن أن يتباعد رقمُ واتساب هنا عن بقية الموقع.
// ═══════════════════════════════════════════════════════════════════

import {
  SOCIAL_LINKS,
  SITE_URL,
  WHATSAPP_DISPLAY,
  whatsappUrl,
} from "@/lib/constants";

export interface LinkPlatform {
  /** معرّف ثابت — يُستخدم مفتاحًا في React وفي اسم ملف الأيقونة */
  readonly id: string;
  /** الاسم اللاتيني (السطر الأول، خط Cormorant) */
  readonly nameEn: string;
  /** الاسم العربي (بجانبه بخط أصغر) */
  readonly nameAr: string;
  /** المُعرِّف الظاهر (السطر الثاني الصغير) */
  readonly handle: string;
  /** أيقونة WebP مضغوطة — 256×256، ≤ 17KB */
  readonly icon: string;
  /** لون المنصّة — يُلوِّن حدّ البطاقة وتوهّجها */
  readonly tint: string;
  /** ظلّ اللون بشفافية — للتوهّج الخارجي */
  readonly shadow: string;
  /** الرابط الفعلي — لا يُقبل '#' أبدًا (انظر الحاجز أدناه) */
  readonly href: string;
  /** نصّ بديل وصفي للأيقونة (a11y) */
  readonly alt: string;
}

const RAW: readonly LinkPlatform[] = [
  {
    id: "whatsapp",
    nameEn: "WhatsApp",
    nameAr: "واتساب",
    handle: WHATSAPP_DISPLAY,
    icon: "/images/links/icon-whatsapp.webp",
    tint: "#25D366",
    shadow: "rgba(37, 211, 102, 0.35)",
    href: whatsappUrl("مرحباً، وصلتكم من صفحة الروابط. أرغب بالاستفسار عن خدمات الضيافة."),
    alt: "أيقونة واتساب ثلاثية الأبعاد — للتواصل المباشر مع أصول الضيافة",
  },
  {
    id: "instagram",
    nameEn: "Instagram",
    nameAr: "انستقرام",
    handle: "@asoulaldiafa",
    icon: "/images/links/icon-instagram.webp",
    tint: "#E4405F",
    shadow: "rgba(228, 64, 95, 0.35)",
    href: SOCIAL_LINKS.instagram,
    alt: "أيقونة انستقرام ثلاثية الأبعاد — حساب أصول الضيافة",
  },
  {
    id: "tiktok",
    nameEn: "TikTok",
    nameAr: "تيك توك",
    handle: "@asoulaldiafa",
    icon: "/images/links/icon-tiktok.webp",
    tint: "#FF0050",
    shadow: "rgba(255, 0, 80, 0.35)",
    href: SOCIAL_LINKS.tiktok,
    alt: "أيقونة تيك توك ثلاثية الأبعاد — حساب أصول الضيافة",
  },
  {
    id: "snapchat",
    nameEn: "Snapchat",
    nameAr: "سناب شات",
    handle: "@asoulaldiafa",
    icon: "/images/links/icon-snapchat.webp",
    tint: "#FFC800",
    shadow: "rgba(255, 200, 0, 0.32)",
    alt: "أيقونة سناب شات ثلاثية الأبعاد — حساب أصول الضيافة",
    href: SOCIAL_LINKS.snapchat,
  },
  {
    id: "x",
    nameEn: "X",
    nameAr: "إكس",
    handle: "@asoulaldiafa",
    icon: "/images/links/icon-x.webp",
    // اللون الأصلي كان #888 (رمادي بلا هوية). أسود إكس الرسمي لا يُرى على
    // خلفية سوداء، فاخترنا فضّيًا فاتحًا يُبرز الحدّ ويحفظ حياد العلامة.
    tint: "#B8B8B8",
    shadow: "rgba(220, 220, 220, 0.22)",
    href: SOCIAL_LINKS.x,
    alt: "أيقونة منصة إكس ثلاثية الأبعاد — حساب أصول الضيافة",
  },
  {
    id: "facebook",
    nameEn: "Facebook",
    nameAr: "فيسبوك",
    handle: "asoulaldiafa",
    icon: "/images/links/icon-facebook.webp",
    tint: "#1877F2",
    shadow: "rgba(24, 119, 242, 0.35)",
    href: SOCIAL_LINKS.facebook,
    alt: "أيقونة فيسبوك ثلاثية الأبعاد — صفحة أصول الضيافة",
  },
  {
    id: "website",
    nameEn: "Website",
    nameAr: "الموقع",
    handle: "asoulaldiafa.com",
    icon: "/images/links/icon-website.webp",
    tint: "#D4AF37",
    shadow: "rgba(212, 175, 55, 0.4)",
    href: SITE_URL,
    alt: "أيقونة كرة أرضية ذهبية ثلاثية الأبعاد — الموقع الرسمي لأصول الضيافة",
  },
];

/**
 * حاجز وقت البناء ضد عودة الخطأ نفسه.
 *
 * التصميم الأصلي احتوى بطاقتين href='#'. حذفناهما، لكن الحذف اليدوي
 * يمكن أن يُنقض بإضافة لاحقة سهوًا. هذا الفلتر يجعل القاعدة تنفَّذ
 * بالكود لا بالذاكرة: أي مدخل بلا رابط حقيقي (مطلق، http/https)
 * يُسقَط قبل أن يُرسم — فيستحيل ظهور بطاقة ميّتة للزائر.
 */
export const LINK_PLATFORMS: readonly LinkPlatform[] = RAW.filter(
  (p) => /^https?:\/\/.+/.test(p.href)
);

/** يُستخدم في اختبار الوحدة والتحقق البصري */
export const LINK_PLATFORMS_COUNT = LINK_PLATFORMS.length;
