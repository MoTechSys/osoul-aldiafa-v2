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

export const EMAIL = "osoulaldiafa@gmail.com";

// Official social profiles — username matches the domain (asoulaldiafa).
// Used in Footer buttons + Schema.org sameAs (entity verification / Local SEO).
export const SOCIAL_LINKS = {
  tiktok: "https://www.tiktok.com/@asoulaldiafa",
  instagram: "https://www.instagram.com/asoulaldiafa",
  snapchat: "https://www.snapchat.com/add/asoulaldiafa",
} as const;

/** رابط واتساب جاهز مع رسالة افتراضية */
export function whatsappUrl(message = "مرحباً، أرغب بالاستفسار عن خدمات أصول الضيافة."): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
