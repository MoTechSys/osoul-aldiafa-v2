"use client";

import { useState, useEffect, Suspense } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { DallahLogo } from "@/components/DallahLogo";
import { WHATSAPP_NUMBER as WA_NUMBER, WHATSAPP_DISPLAY as WA_DISPLAY } from "@/lib/constants";

const navLinks = [
  { href: "/", label: "الرئيسية", icon: "⌂" },
  { href: "/services", label: "خدماتنا", icon: "◈" },
  { href: "/offerings", label: "تقديماتنا", icon: "☕" },
  { href: "/portfolio", label: "معرض الأعمال", icon: "◻" },
  { href: "/about", label: "من نحن", icon: "✦" },
  { href: "/contact", label: "تواصل معنا", icon: "✉" },
];

function useWhatsAppUrl() {
  const pathname = usePathname() ?? "/";
  const messages: Record<string, string> = {
    "/services":  "السلام عليكم، أرغب في الاستفسار عن خدمات أصول الضيافة.",
    "/offerings": "السلام عليكم، أرغب في الاستفسار عن تقديمات أصول الضيافة.",
    "/portfolio": "السلام عليكم، رأيت أعمالكم وأود الاستفسار عن باقات الضيافة.",
    "/about":     "السلام عليكم، تعرفت على أصول الضيافة وأود الاستفسار عن خدماتكم.",
    "/contact":   "السلام عليكم، أود التواصل معكم للاستفسار عن خدمات الضيافة.",
  };
  const msg = messages[pathname] ?? "السلام عليكم، أرغب في حجز خدمات أصول الضيافة.";
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export { navLinks, useWhatsAppUrl, WA_NUMBER, WA_DISPLAY };

function NavbarContent() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollDir, setScrollDir] = useState<"up" | "down">("up");
  const pathname = usePathname() ?? "/";
  const waUrl = useWhatsAppUrl();

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 40);
        if (Math.abs(y - lastY) > 4) setScrollDir(y > lastY ? "down" : "up");
        lastY = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => pathname === href;

  return (
    <motion.header
      initial={false}
      animate={{
        y: scrolled && scrollDir === "down" ? -90 : 0,
        backgroundColor: scrolled
          ? "rgba(10, 10, 10, 0.92)"
          : "rgba(10,10,10,0)",
      }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backdropFilter: scrolled ? "blur(22px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(22px) saturate(180%)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(197, 160, 89, 0.22)"
          : "1px solid rgba(197, 160, 89, 0)",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.5)" : "none",
        paddingTop: "env(safe-area-inset-top, 0)",
      }}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 group min-h-[44px]"
          aria-label="الصفحة الرئيسية - أصول الضيافة"
        >
          <motion.div
            whileHover={{ rotate: -4, scale: 1.06 }}
            transition={{ type: "spring", stiffness: 320 }}
            className="relative"
          >
            <DallahLogo size={48} />
            <motion.div
              className="absolute -inset-1 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(197,160,89,0.20) 0%, transparent 70%)",
              }}
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              aria-hidden
            />
          </motion.div>
          <div className="block">
            <span
              className="block gold-text font-amiri"
              style={{ fontSize: "1.18rem", fontWeight: 700, lineHeight: 1.1 }}
            >
              أصول الضيافة
            </span>
            <span
              className="block text-gold/55"
              style={{ fontSize: "0.6rem", letterSpacing: "0.3em" }}
            >
              OSOUL AL-DIAFA
            </span>
          </div>
        </Link>

        <nav
          className="hidden lg:flex items-center gap-1"
          role="navigation"
          aria-label="التنقل الرئيسي"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 min-h-[44px] flex items-center ${
                isActive(link.href)
                  ? "text-gold-bright"
                  : "text-pearl/70 hover:text-gold-bright"
              }`}
              style={{ fontWeight: isActive(link.href) ? 700 : 400 }}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {isActive(link.href) && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: "rgba(197, 160, 89, 0.12)",
                    border: "1px solid rgba(197, 160, 89, 0.28)",
                  }}
                  transition={{ type: "spring", duration: 0.4 }}
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <motion.a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm gold-button"
            aria-label="احجز عبر واتساب"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
              aria-hidden
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
            </svg>
            احجز عبر واتساب
          </motion.a>
        </div>
      </div>
    </motion.header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarContent />
    </Suspense>
  );
}
