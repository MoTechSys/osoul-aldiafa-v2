import { MetadataRoute } from "next";
import { LOCAL_PAGES, localSlug } from "@/lib/localPages";

const SITE_URL = "https://asoulaldiafa.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const coreRoutes = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/services", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/offerings", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/portfolio", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
  ];

  // صفحات (خدمة × مدينة) — أولوية عالية لاستهداف الكلمات المحلية
  const localRoutes = LOCAL_PAGES.map((p) => ({
    path: `/${localSlug(p.service, p.city)}`,
    priority: 0.9,
    changeFrequency: "weekly" as const,
  }));

  return [...coreRoutes, ...localRoutes].map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
