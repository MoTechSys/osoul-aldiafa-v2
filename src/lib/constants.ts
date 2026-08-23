/**
 * ثوابت الموقع المركزية — أصول الضيافة
 * Central site constants — Asoul Al-Diafa
 */

export const SITE_URL = "https://asoulaldiafa.com";

export const SITE_NAME = "أصول الضيافة";
export const SITE_NAME_EN = "Asoul Al-Diafa";

/** رقم واتساب — صيغة دولية بدون + (للروابط wa.me) */
export const WHATSAPP_NUMBER = "966568997316";
/** رقم العرض المحلي */
export const WHATSAPP_DISPLAY = "0568997316";
/** صيغة الاتصال (tel:) */
export const PHONE_TEL = "+966568997316";

/**
 * البريد الرسمي — أكّده المالك في 22 أغسطس 2026:
 * «البريد غيّره إلى asoulaldiafa@gmail.com لأننا غيّرناه».
 * ملاحظة على الفرق الحرفي: القديم كان يبدأ بحرف o (osoul) والجديد بحرف a
 * (asoul) ليطابق الدومين asoulaldiafa.com والحسابات الاجتماعية
 * (@asoulaldiafa) — فالتطابق الحرفي بين الدومين والبريد إشارة كيان
 * (entity signal) تستخدمها جوجل لربط الأعمال بملفّها التجاري.
 * هذا الثابت هو المصدر الوحيد للبريد: أي ظهور حرفي للبريد في أي ملف آخر
 * يُعَدّ خطأً لأنه سيتخلّف عن التحديث القادم.
 */
export const EMAIL = "asoulaldiafa@gmail.com";

// Official social profiles — username matches the domain (asoulaldiafa).
// Used in Footer buttons + Schema.org sameAs (entity verification / Local SEO).
export const SOCIAL_LINKS = {
  tiktok: "https://www.tiktok.com/@asoulaldiafa",
  instagram: "https://www.instagram.com/asoulaldiafa",
  snapchat: "https://www.snapchat.com/add/asoulaldiafa",
  x: "https://x.com/asoulaldiafa",
  // فيسبوك: الرابط المُعطى كان رابط مشاركة (‎/share/18EvHR29Ck/‎) — روابط
  // المشاركة مؤقتة وتحمل معاملات تتبّع، ولا تصلح لـ sameAs في Schema.org
  // لأن جوجل يحتاج عنوانًا ثابتًا للربط بين الكيانات.
  // حُلَّ إلى العنوان الأساسي بمعرّف الصفحة الرقمي (تأكيد ثلاثي:
  // إعادة توجيه facebookexternalhit + إعادة توجيه سفاري الجوال + mbasic).
  // معرّف الصفحة: 61593483666341 · الاسم: «أصول الضيافة قهوجيين وصبابين»
  facebook: "https://www.facebook.com/profile.php?id=61593483666341",
} as const;

/** رابط واتساب جاهز مع رسالة افتراضية */
export function whatsappUrl(message = "مرحباً، أرغب بالاستفسار عن خدمات أصول الضيافة."): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * م-١ — صورة معاينة الرابط (OG).
 * الملف المحلي سليم (٥٥٬١٥٢ بايت، أقصى إضاءة ٢٥٣٫٣) لكن الإنتاج كان يخدم لقطة
 * قديمة (١٣٬٤٦٩ بايت، أقصى إضاءة ٤٤٫٣ = مستحيل ظهور نصّ) وبصمتها MD5 تساوي نسخة
 * ٥ يونيو. وترويسة الإنتاج `cache-control: immutable, max-age=31536000` تعني أن
 * العنوان نفسه يبقى مخزَّنًا سنةً عند فيسبوك/واتساب، فإعادة النشر وحدها لا تكفي.
 * لذلك نضيف بصمة الملف إلى العنوان ليراه الزاحف عنوانًا جديدًا فيعيد جلبه.
 * تُحدَّث البصمة عند كل تغيير فعلي للصورة.
 */
export const OG_IMAGE_URL = `${SITE_URL}/og-image.jpg?v=cb6e68e05e`;
