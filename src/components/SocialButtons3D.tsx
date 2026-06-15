"use client";

/**
 * SocialButtons3D — large, luxurious 3D social buttons (TikTok / Instagram /
 * Snapchat). Brand-matched (gold + onyx), with depth (layered shadow + sheen),
 * lift-on-hover, press-on-tap, and reduced-motion support.
 */

import { motion, useReducedMotion } from "motion/react";
import { SOCIAL_LINKS } from "@/lib/constants";

type Social = {
  key: string;
  label: string;
  href: string;
  brand: string;
  icon: React.ReactNode;
};

const SOCIALS: Social[] = [
  {
    key: "instagram",
    label: "انستقرام",
    href: SOCIAL_LINKS.instagram,
    brand: "#E1306C",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7 sm:w-8 sm:h-8">
        <rect x="2" y="2" width="20" height="20" rx="5.5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: "tiktok",
    label: "تيك توك",
    href: SOCIAL_LINKS.tiktok,
    brand: "#25F4EE",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 sm:w-8 sm:h-8">
        <path d="M16.6 5.82a4.28 4.28 0 01-1.06-2.82h-3.2v12.74a2.42 2.42 0 11-2.42-2.42c.18 0 .36.02.53.06V8.1a5.66 5.66 0 00-.53-.03 5.66 5.66 0 105.66 5.66V8.9a7.5 7.5 0 004.34 1.39V7.08a4.28 4.28 0 01-3.32-1.26z" />
      </svg>
    ),
  },
  {
    key: "snapchat",
    label: "سناب شات",
    href: SOCIAL_LINKS.snapchat,
    brand: "#FFFC00",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 sm:w-8 sm:h-8">
        <path d="M12 2c2.5 0 4.3 1.9 4.4 4.4.03.7 0 1.4-.04 2 .3.16.7.12 1.1-.06.6-.25 1.3.6.8 1.2-.4.5-1 .7-1.6.9-.2.06-.3.1-.3.3.1.8 1 2.5 2.7 3.1.3.1.5.4.4.7-.2.6-1.3.8-1.9.9-.1.3-.1.7-.3.8-.2.1-.7 0-1.2 0-.6 0-1.2.1-1.7.5-.6.4-1.2.9-2.4.9s-1.8-.5-2.4-.9c-.5-.4-1.1-.5-1.7-.5-.5 0-1 .1-1.2 0-.2-.1-.2-.5-.3-.8-.6-.1-1.7-.3-1.9-.9-.1-.3.1-.6.4-.7 1.7-.6 2.6-2.3 2.7-3.1 0-.2-.1-.24-.3-.3-.6-.2-1.2-.4-1.6-.9-.5-.6.2-1.45.8-1.2.4.18.8.22 1.1.06-.04-.6-.07-1.3-.04-2C7.7 3.9 9.5 2 12 2z" />
      </svg>
    ),
  },
];

export function SocialButtons3D() {
  const reduce = useReducedMotion();

  return (
    <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7">
      {SOCIALS.map((s, i) => (
        <motion.a
          key={s.key}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          initial={false}
          whileHover={reduce ? undefined : { y: -6, scale: 1.06 }}
          whileTap={reduce ? undefined : { scale: 0.94, y: -2 }}
          transition={{ type: "spring", stiffness: 380, damping: 18, delay: i * 0.02 }}
          className="group relative flex flex-col items-center gap-2.5"
        >
          {/* 3D coin button */}
          <span
            className="relative flex items-center justify-center rounded-2xl"
            style={{
              width: "76px",
              height: "76px",
              background: "linear-gradient(145deg, #1c1813 0%, #0a0a0a 100%)",
              border: "1px solid rgba(197,160,89,0.45)",
              color: "#C5A059",
              boxShadow:
                "0 10px 24px -6px rgba(0,0,0,0.7), 0 4px 10px -2px rgba(0,0,0,0.6), inset 0 1px 0 rgba(197,160,89,0.35), inset 0 -3px 8px rgba(0,0,0,0.6)",
            }}
          >
            {/* golden sheen */}
            <span
              aria-hidden
              className="absolute inset-0 rounded-2xl opacity-60 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(120% 80% at 30% 10%, rgba(226,198,142,0.28) 0%, transparent 55%)",
              }}
            />
            {/* brand-tinted glow on hover */}
            <span
              aria-hidden
              className="absolute -inset-1 rounded-3xl opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-60"
              style={{ background: s.brand }}
            />
            <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">
              {s.icon}
            </span>
          </span>
          <span className="text-pearl/65 text-xs sm:text-sm font-medium transition-colors duration-300 group-hover:text-gold-bright">
            {s.label}
          </span>
        </motion.a>
      ))}
    </div>
  );
}
