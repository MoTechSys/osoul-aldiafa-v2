import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

/**
 * حزمة AEO (2026-08-29): قاعدة `*` كانت تسمح فعليًا لكل الزواحف، لكن السماح
 * الصريح باسم كل زاحف AI يحقق أمرين:
 *  ١) توثيق مقصود — أي تعديل مستقبلي على `*` لا يحجب محركات الإجابة بالخطأ.
 *  ٢) إشارة صريحة لا لبس فيها للزواحف التي تفسّر غياب قاعدتها بحذر.
 * الزواحف: GPTBot + OAI-SearchBot (OpenAI/ChatGPT) · Google-Extended (Gemini/
 * AI Overviews التدريبي) · PerplexityBot · ClaudeBot + anthropic-ai (Anthropic).
 * نفس disallow في كل قاعدة — المسارات الخاصة تبقى خاصة للجميع.
 */
const PRIVATE_PATHS = ["/api/", "/admin/", "/private/"];

const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "Google-Extended",
  "PerplexityBot",
  "ClaudeBot",
  "anthropic-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: PRIVATE_PATHS,
      })),
    ],
    // خريطتان: الصفحات + الصور. جوجل يسمح بإعلان أكثر من خريطة في robots.txt،
    // وخريطة الصور منفصلة لأن Next 14.2.35 لا يدعم وسوم الصور في sitemap.ts.
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/sitemap-images.xml`],
  };
}
