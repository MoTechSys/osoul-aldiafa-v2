/**
 * ServiceAreas — Server Component.
 * Internal-linking section: links the homepage to every (service × city)
 * page with descriptive Arabic anchor text. Fixes the crawl-path / PageRank
 * gap where Home had zero direct links to the local landing pages.
 */

import Link from "next/link";
import { LOCAL_PAGES, CITIES, SERVICES, localSlug } from "@/lib/localPages";

export function ServiceAreas() {
  return (
    <section
      aria-labelledby="service-areas-heading"
      className="py-16 sm:py-24 bg-onyx"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2
          id="service-areas-heading"
          className="gold-text font-amiri text-3xl sm:text-4xl text-center mb-4"
        >
          خدماتنا في مدن المملكة
        </h2>
        <p className="text-pearl/70 text-center mb-12 max-w-2xl mx-auto leading-relaxed">
          نصل إليك أينما كانت مناسبتك — اختر خدمتك ومدينتك لمعرفة التفاصيل
          والباقات والأسعار التقديرية.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {LOCAL_PAGES.map((p) => {
            const slug = localSlug(p.service, p.city);
            const service = SERVICES[p.service];
            const city = CITIES[p.city];
            if (!service || !city) return null;
            return (
              <Link
                key={slug}
                href={`/${slug}`}
                className="block p-4 rounded-lg border border-gold/20 bg-gold/5 hover:border-gold/60 hover:bg-gold/10 transition text-center"
              >
                <span className="block text-gold-bright text-sm font-bold mb-1">
                  {service.ar}
                </span>
                <span className="block text-pearl/80 text-xs">
                  في {city.ar}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
