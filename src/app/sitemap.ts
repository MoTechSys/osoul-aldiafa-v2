import { MetadataRoute } from "next";
import { LOCAL_PAGES, localSlug } from "@/lib/localPages";
import { SERVICE_HUB_SLUGS } from "@/lib/serviceHubs";

const SITE_URL = "https://asoulaldiafa.com";

// Static publish date. Update manually when content is meaningfully edited.
// Do NOT use `new Date()` here — it makes every URL appear "just modified" on
// every build, which causes Google to lose trust in lastmod and crawl less.
const PUBLISHED = "2026-06-15";

export default function sitemap(): MetadataRoute.Sitemap {

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

  const hubRoutes = SERVICE_HUB_SLUGS.map((slug) => ({
    path: `/${slug}`,
    priority: 0.85,
    changeFrequency: "weekly" as const,
  }));

  return [...coreRoutes, ...hubRoutes, ...localRoutes].map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: PUBLISHED,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
