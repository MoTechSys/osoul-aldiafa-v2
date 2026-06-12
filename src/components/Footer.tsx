"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { DallahLogo } from "@/components/DallahLogo";
import { navLinks, useWhatsAppUrl, WA_NUMBER, WA_DISPLAY } from "@/components/Navbar";

export default function Footer() {
  const waUrl = useWhatsAppUrl();

  return (
    <footer
      className="relative pt-16 pb-32 md:pb-16 overflow-hidden"
      role="contentinfo"
      style={{
        background: "linear-gradient(180deg, #0a0a0a 0%, #050505 100%)",
        borderTop: "1px solid rgba(212, 175, 55, 0.18)",
      }}
    >
      {/* decorative dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, #C5A059 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* top ornament line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5) 50%, transparent)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <DallahLogo size={64} />
              <div>
                <p className="gold-text font-amiri" style={{ fontSize: "1.35rem", fontWeight: 700 }}>أصول الضيافة</p>
                <p className="text-gold/55" style={{ fontSize: "0.62rem", letterSpacing: "0.3em" }}>ASOUL AL-DIAFA · ROYAL HOSPITALITY</p>
              </div>
            </div>
            <p className="text-pearl/55 text-sm leading-relaxed max-w-sm">
              نُحيي أصول الضيافة العربية الأصيلة بفريق صبّابين بزي تراثي، قهوة عربية وتمور فاخرة — تجربة ضيافة تليق بأرقى المناسبات في جميع مناطق المملكة.
            </p>

            <div className="flex gap-3 mt-5">
              <motion.a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="واتساب"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-11 h-11 rounded-full flex items-center justify-center min-h-[44px]"
                style={{ background: "#25D36614", border: "1px solid #25D36633", color: "#25D366" }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                </svg>
              </motion.a>
              <motion.a
                href={`tel:+${WA_NUMBER}`}
                aria-label="اتصل بنا"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-11 h-11 rounded-full flex items-center justify-center min-h-[44px]"
                style={{ background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.30)", color: "#C5A059" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </motion.a>
              <motion.a
                href="mailto:info@asoulaldiafa.com"
                aria-label="بريد إلكتروني"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-11 h-11 rounded-full flex items-center justify-center min-h-[44px]"
                style={{ background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.30)", color: "#C5A059" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </motion.a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-gold mb-4 font-amiri" style={{ fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.1em" }}>روابط سريعة</h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-pearl/55 text-sm hover:text-gold-bright transition-colors duration-200 flex items-center gap-2 group min-h-[36px]"
                  >
                    <span className="w-3 h-px bg-gold/35 group-hover:w-5 group-hover:bg-gold transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-gold mb-4 font-amiri" style={{ fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.1em" }}>معلومات التواصل</h3>
            <div className="space-y-3">
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-pearl/55 text-sm hover:text-gold-bright transition-colors duration-200 group min-h-[36px]">
                <span className="mt-0.5 flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#25D366]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                </span>
                <span dir="ltr">+966 56 899 7316</span>
              </a>
              <a href={`tel:+${WA_NUMBER}`} className="flex items-start gap-3 text-pearl/55 text-sm hover:text-gold-bright transition-colors duration-200 min-h-[36px]">
                <span className="mt-0.5 flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </span>
                <span dir="ltr">{WA_DISPLAY}</span>
              </a>
              <a href="mailto:info@asoulaldiafa.com" className="flex items-start gap-3 text-pearl/55 text-sm hover:text-gold-bright transition-colors duration-200 min-h-[36px]">
                <span className="mt-0.5 flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                </span>
                <span>info@asoulaldiafa.com</span>
              </a>
              <div className="flex items-start gap-3 text-pearl/55 text-sm min-h-[36px]">
                <span className="mt-0.5 flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                </span>
                <span>نخدم جميع مناطق المملكة العربية السعودية</span>
              </div>
            </div>

            <h3 className="text-gold mb-3 mt-6 font-amiri" style={{ fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.1em" }}>خدماتنا</h3>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "قهوجيين ومباشرين", href: "/qahwajiin-mubasherin" },
                { label: "ركن قهوة عربية", href: "/rukn-qahwa-arabiya" },
                { label: "ضيافة أعراس", href: "/diyafa-aaras" },
                { label: "ضيافة مؤتمرات", href: "/diyafa-mutamarat" },
                { label: "تجهيز ضيافة حفلات", href: "/tajheez-diyafa-haflat" },
              ].map((s) => (
                <Link key={s.href} href={s.href} className="text-pearl/55 text-xs px-2 py-1 rounded-full hover:text-gold-bright transition-colors" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.12)" }}>{s.label}</Link>
              ))}
            </div>
          </div>

          {/* خدماتنا حسب المدينة — روابط داخلية لصفحات الـ SEO المحلية */}
          <div>
            <h3 className="text-gold mb-4 font-amiri" style={{ fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.1em" }}>صبابين قهوة حسب المدينة</h3>
            <ul className="space-y-2.5">
              {[
                { label: "صبابين قهوة جدة", href: "/sababin-qahwa-jeddah" },
                { label: "صبابين قهوة ينبع", href: "/sababin-qahwa-yanbu" },
                { label: "صبابين قهوة بدر", href: "/sababin-qahwa-badr" },
                { label: "صبابين قهوة المدينة المنورة", href: "/sababin-qahwa-madinah" },
                { label: "صبابين قهوة مكة", href: "/sababin-qahwa-makkah" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-pearl/55 text-sm hover:text-gold-bright transition-colors duration-200 flex items-center gap-2 group min-h-[36px]">
                    <span className="w-3 h-px bg-gold/35 group-hover:w-5 group-hover:bg-gold transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="text-gold mb-3 mt-6 font-amiri" style={{ fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.1em" }}>ضيافة مناسبات حسب المدينة</h3>
            <ul className="space-y-2.5">
              {[
                { label: "ضيافة مناسبات جدة", href: "/diyafa-munasabat-jeddah" },
                { label: "ضيافة مناسبات ينبع", href: "/diyafa-munasabat-yanbu" },
                { label: "ضيافة مناسبات بدر", href: "/diyafa-munasabat-badr" },
                { label: "ضيافة مناسبات المدينة", href: "/diyafa-munasabat-madinah" },
                { label: "ضيافة مناسبات مكة", href: "/diyafa-munasabat-makkah" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-pearl/55 text-sm hover:text-gold-bright transition-colors duration-200 flex items-center gap-2 group min-h-[36px]">
                    <span className="w-3 h-px bg-gold/35 group-hover:w-5 group-hover:bg-gold transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: "1px solid rgba(212,175,55,0.10)" }}>
          <p className="text-pearl/35 text-xs">© {new Date().getFullYear()} أصول الضيافة. جميع الحقوق محفوظة.</p>
          <p className="text-pearl/40 text-xs">
            تطوير وتصميم{" "}
            <a
              href="https://wa.me/967770941666"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold/70 font-medium transition-colors duration-200"
            >
              م. معين العبّاسي
            </a>
          </p>
          <p className="text-gold/35 text-xs" style={{ letterSpacing: "0.1em" }}>ASOUL AL-DIAFA · ROYAL HOSPITALITY · KSA</p>
        </div>
      </div>
    </footer>
  );
}
