import { Metadata } from "next";
import PrivacyClient from "./PrivacyClient";
import { generatePageMetadata } from "@/components/SEO";
import {
  generateBreadcrumbSchema,
  generateWebPageSchema,
  jsonLd,
} from "@/lib/schema";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = generatePageMetadata({
  title: "سياسة الخصوصية — كيف نتعامل مع بياناتك",
  description:
    "سياسة خصوصية أصول الضيافة بوضوح: ما نجمعه من بيانات وما لا نجمعه، ولماذا، ومدة الحفظ، ومع من نشاركه، وحقوقك في الاطلاع والتصحيح والحذف في أي وقت.",
  path: "/privacy",
  keywords: ["سياسة الخصوصية", "خصوصية أصول الضيافة", "حماية البيانات"],
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "الرئيسية", url: SITE_URL },
  { name: "سياسة الخصوصية", url: `${SITE_URL}/privacy` },
]);

const webPageSchema = generateWebPageSchema({
  name: "سياسة الخصوصية - أصول الضيافة",
  description:
    "ما نجمعه من بيانات وما لا نجمعه، وغرض الاستخدام، ومدة الحفظ، وحقوقك عليها.",
  url: `${SITE_URL}/privacy`,
});

export default function PrivacyPage() {
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
      <PrivacyClient />
    </>
  );
}
