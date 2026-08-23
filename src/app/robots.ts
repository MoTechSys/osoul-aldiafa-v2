import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/private/"],
      },
    ],
    // خريطتان: الصفحات + الصور. جوجل يسمح بإعلان أكثر من خريطة في robots.txt،
    // وخريطة الصور منفصلة لأن Next 14.2.35 لا يدعم وسوم الصور في sitemap.ts.
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/sitemap-images.xml`],
  };
}
