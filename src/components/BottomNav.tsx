"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { WHATSAPP_NUMBER as WA_NUMBER, WHATSAPP_DISPLAY as WA_DISPLAY, whatsappUrl } from "@/lib/constants";

const WA_URL = whatsappUrl("السلام عليكم، أرغب بالاستفسار عن خدمات أصول الضيافة.");

type SideItem = {
  href: string;
  label: string;
  icon: (p: { active?: boolean }) => JSX.Element;
};

const leftItems: SideItem[] = [
  { href: "/", label: "الرئيسية", icon: HomeIcon },
  { href: "/services", label: "خدماتنا", icon: ServicesIcon },
];

const rightItems: SideItem[] = [
  { href: "/portfolio", label: "المعرض", icon: GalleryIcon },
  { href: "/about", label: "من نحن", icon: UserIcon },
];

const fullMenu = [
  { href: "/", label: "الرئيسية", icon: "⌂" },
  { href: "/services", label: "خدماتنا", icon: "◈" },
  { href: "/offerings", label: "تقديماتنا", icon: "☕" },
  { href: "/portfolio", label: "معرض الأعمال", icon: "◻" },
  { href: "/about", label: "من نحن", icon: "✦" },
  { href: "/contact", label: "تواصل معنا", icon: "✉" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while menu is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/";
      return pathname?.startsWith(href);
    },
    [pathname]
  );

  return (
    <>
      <nav className="osoul-bottomnav" aria-label="التنقل السفلي">
        <div className="osoul-bottomnav__bar">
          {leftItems.map((it) => {
            const Icon = it.icon;
            const active = isActive(it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`osoul-bottomnav__item${active ? " is-active" : ""}`}
                aria-current={active ? "page" : undefined}
                aria-label={it.label}
              >
                <Icon active={active} />
                <span>{it.label}</span>
              </Link>
            );
          })}

          {/* Center MENU button */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="osoul-bottomnav__center"
            aria-label="فتح القائمة"
            aria-expanded={open}
            aria-controls="osoul-mobile-menu"
          >
            <motion.span
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 18,
                delay: 0.15,
              }}
              className="osoul-bottomnav__centerInner"
            >
              <MenuGridIcon />
            </motion.span>
            <span className="osoul-bottomnav__centerLabel">القائمة</span>
          </button>

          {rightItems.map((it) => {
            const Icon = it.icon;
            const active = isActive(it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`osoul-bottomnav__item${active ? " is-active" : ""}`}
                aria-current={active ? "page" : undefined}
                aria-label={it.label}
              >
                <Icon active={active} />
                <span>{it.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Full-screen mobile menu sheet */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="osoul-menu__scrim"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              key="sheet"
              role="dialog"
              aria-modal="true"
              aria-label="القائمة الرئيسية"
              id="osoul-mobile-menu"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 320 }}
              className="osoul-menu__sheet"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="إغلاق القائمة"
                className="osoul-menu__close"
              >
                ✕
              </button>

              <div className="osoul-menu__handle" />

              <div className="osoul-menu__brand">
                <Image
                  src="/logo.webp"
                  alt="أصول الضيافة"
                  width={64}
                  height={64}
                  className="osoul-menu__logo"
                />
                <div>
                  <p className="gold-text font-amiri osoul-menu__brandTitle">
                    أصول الضيافة
                  </p>
                  <p className="osoul-menu__brandSub">
                    ASOUL AL-DIAFA · SINCE 2017
                  </p>
                </div>
              </div>

              <nav
                className="osoul-menu__grid"
                aria-label="القائمة الرئيسية - شبكة الصفحات"
              >
                {fullMenu.map((m, i) => {
                  const active = isActive(m.href);
                  return (
                    <motion.div
                      key={m.href}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06 + i * 0.04 }}
                    >
                      <Link
                        href={m.href}
                        onClick={() => setOpen(false)}
                        className={`osoul-menu__tile${
                          active ? " is-active" : ""
                        }`}
                        aria-current={active ? "page" : undefined}
                      >
                        <span className="osoul-menu__tileIcon">{m.icon}</span>
                        <span className="osoul-menu__tileLabel">{m.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="osoul-menu__cta">
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="osoul-menu__ctaWa"
                  aria-label="تواصل عبر واتساب"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                  </svg>
                  <span>واتساب</span>
                  <span className="osoul-menu__ctaPhone" dir="ltr">
                    {WA_DISPLAY}
                  </span>
                </a>
                <a
                  href={`tel:+${WA_NUMBER}`}
                  className="osoul-menu__ctaCall"
                  aria-label="اتصل بنا"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>اتصال</span>
                </a>
              </div>

              <p className="osoul-menu__foot">
                © {new Date().getFullYear()} أصول الضيافة · جميع الحقوق محفوظة
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------- icons ---------- */
function HomeIcon({ active }: { active?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M5 10.5V20h14v-9.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ServicesIcon({ active }: { active?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <circle
        cx="5"
        cy="6"
        r="1.4"
        fill={active ? "currentColor" : "none"}
      />
      <circle
        cx="5"
        cy="12"
        r="1.4"
        fill={active ? "currentColor" : "none"}
      />
      <circle
        cx="5"
        cy="18"
        r="1.4"
        fill={active ? "currentColor" : "none"}
      />
      <path d="M9.5 6h10M9.5 12h10M9.5 18h10" strokeLinecap="round" />
    </svg>
  );
}
function GalleryIcon({ active }: { active?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <circle cx="8.5" cy="9" r="1.4" fill="currentColor" stroke="none" />
      <path
        d="m4 18 5-5 4 4 3-3 4 4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function UserIcon({ active }: { active?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <circle cx="12" cy="8" r="3.6" />
      <path
        d="M4.5 20c0-3.8 3.4-6 7.5-6s7.5 2.2 7.5 6"
        strokeLinecap="round"
      />
    </svg>
  );
}
/* Premium grid/menu icon — clearly says "open the menu" */
function MenuGridIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="28"
      height="28"
      fill="none"
      stroke="#1a1408"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
    </svg>
  );
}
