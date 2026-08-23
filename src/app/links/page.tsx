import type { Metadata } from "next";
import LinksClient from "./LinksClient";
import "./links.css";
import { generatePageMetadata } from "@/components/SEO";
import {
  generateBreadcrumbSchema,
  generateWebPageSchema,
  jsonLd,
} from "@/lib/schema";
import { SITE_URL, SITE_NAME, WHATSAPP_DISPLAY } from "@/lib/constants";
import { LINK_PLATFORMS } from "@/lib/linksPlatforms";

export const metadata: Metadata = generatePageMetadata({
  title: "روابط التواصل السريعة",
  description:
    `كل قنوات التواصل مع ${SITE_NAME} في صفحة واحدة: واتساب ${WHATSAPP_DISPLAY} وانستقرام وتيك توك وسناب شات وفيسبوك — اختر الأنسب لك واحصل على استشارة مجانية.`,
  path: "/links",
  keywords: [
    "روابط أصول الضيافة",
    "حسابات أصول الضيافة",
    "واتساب قهوجيين",
    "تواصل قهوجيين وصبابين",
  ],
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "الرئيسية", url: SITE_URL },
  { name: "روابط التواصل", url: `${SITE_URL}/links` },
]);

const webPageSchema = generateWebPageSchema({
  name: `روابط التواصل - ${SITE_NAME}`,
  description: `صفحة تجمع كل قنوات التواصل الرسمية لـ${SITE_NAME}`,
  url: `${SITE_URL}/links`,
});

/**
 * ProfilePage + sameAs — لماذا هذا المخطَّط تحديدًا؟
 *
 * صفحة الروابط هي أنسب مكان في الموقع لتصريح `sameAs` لمحركات البحث:
 * فهي تعدّ الحسابات الرسمية صراحةً، فيتحقّق التطابق بين ما يقرأه
 * الزائر وما يقرأه الزاحف. وبما أن القائمة تُشتق من LINK_PLATFORMS
 * نفسها، يستحيل أن يظهر في المخطَّط حساب غير معروض للزائر أو العكس —
 * وهذا يحسم مبدئيًا مخالفة «بيانات منظَّمة لا تطابق الصفحة».
 *
 * ملاحظة مقصودة: يوتيوب ولينكد إن وتيليجرام غائبة هنا كما هي غائبة
 * في الواجهة — لأن الغياب في مكان واحد فقط هو ما يُعدّ تضليلًا.
 */
const profileSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/links#profile`,
  url: `${SITE_URL}/links`,
  name: `روابط التواصل - ${SITE_NAME}`,
  inLanguage: "ar-SA",
  mainEntity: {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    sameAs: LINK_PLATFORMS.filter((p) => p.id !== "whatsapp" && p.id !== "website").map(
      (p) => p.href
    ),
  },
};

export default function LinksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(profileSchema) }}
      />
      <LinksClient />
    </>
  );
}
