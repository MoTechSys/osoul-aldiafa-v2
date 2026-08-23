// Brand mark for أصول الضيافة — uses the client-supplied logo.
// Renamed semantics retained for backwards compatibility with imports.
//
// الأداء (CLS): كان هذا المكوّن يستخدم <img> خامًا بلا width/height، فلا يعرف
// المتصفح مقاس الصورة قبل تحميلها ويقع إزاحة تخطيط (Layout Shift) في الـNavbar
// والفوتر — وهما ظاهران في كل صفحة. الآن نستخدم next/image بأبعاد صريحة.
//
// الحجم: الأصل logo.webp هو 512×512 بحجم ٧٣ ك.ب، ويُعرض فعليًا بـ40–64px.
// نستخدم logo-192.webp (١٥ ك.ب) وهو أكبر ٣× من أكبر مقاس عرض — كافٍ لشاشات
// الكثافة العالية (‎3x‎) وبلا إسراف.
import Image from "next/image";

/**
 * @param size    مقاس الشعار بالبكسل.
 * @param alt     نص بديل. الافتراضي "" (زخرفي) لأن كل مواضع الاستخدام الحالية
 *                (Navbar، Footer) تكتب «أصول الضيافة» نصًّا بجانب الشعار مباشرة،
 *                فوصفه يجعل قارئ الشاشة ينطق الاسم مرتين.
 *                المرجع: W3C WAI Images Tutorial — Decorative Images، المثال 3
 *                (Image with adjacent text alternative): «already sufficiently
 *                described by the adjacent text … a null (empty) alt value can
 *                be used». مرّر نصًّا صريحًا إن استُخدم الشعار وحده بلا نص مجاور.
 */
export function DallahLogo({ size = 40, alt = "" }: { size?: number; alt?: string }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <Image
        src="/logo-192.webp"
        alt={alt}
        width={size}
        height={size}
        priority
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
}
