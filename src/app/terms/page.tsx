import { Metadata } from "next";
import TermsClient from "./TermsClient";
import { generatePageMetadata } from "@/components/SEO";
import {
  generateBreadcrumbSchema,
  generateWebPageSchema,
  jsonLd,
} from "@/lib/schema";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = generatePageMetadata({
  title: "الشروط والأحكام — شروط التعامل بوضوح",
  description:
    "شروط التعامل مع أصول الضيافة: نطاق الخدمة والتغطية الفعلية، مسار الطلب والتأكيد، كيف يُبنى السعر، التزاماتنا والتزاماتك، وسياسة التعديل والإلغاء بإنصاف.",
  path: "/terms",
  keywords: ["الشروط والأحكام", "شروط الخدمة", "سياسة الإلغاء"],
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "الرئيسية", url: SITE_URL },
  { name: "الشروط والأحكام", url: `${SITE_URL}/terms` },
]);

const webPageSchema = generateWebPageSchema({
  name: "الشروط والأحكام - أصول الضيافة",
  description:
    "نطاق الخدمة، مسار الطلب، كيفية بناء السعر، الالتزامات المتبادلة، والتعديل والإلغاء.",
  url: `${SITE_URL}/terms`,
});

export default function TermsPage() {
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
      <TermsClient />
    </>
  );
}
