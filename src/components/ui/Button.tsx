import Link from "next/link";
import { type ReactNode } from "react";

/**
 * ui/Button — الزر الموحّد للنظام الفاخر.
 * ثلاثة أنماط فقط (الاتساق قبل التنويع):
 *   primary  — ذهبي مصمت بنص داكن، CTA الرئيسي (تباين 7.6:1 معكوسًا)
 *   outline  — حد ذهبي وامتلاء عند التحويم، CTA الثانوي
 *   ghost    — نص ذهبي بلا إطار، روابط داخل المحتوى
 * كلها ≥48px هدف لمس، focus-visible ذهبي، وحركة تحويم هادئة.
 */

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
  ariaLabel?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 min-h-12 px-7 py-3 rounded-full " +
  "text-sm font-bold transition-all duration-300 " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-gold-bright " +
  "motion-safe:hover:-translate-y-0.5";

const variants = {
  primary:
    "bg-gold text-onyx hover:brightness-110 " +
    "shadow-[0_4px_20px_rgba(197,160,89,0.25),0_2px_8px_rgba(0,0,0,0.4)] " +
    "hover:shadow-[0_6px_24px_rgba(197,160,89,0.35),0_12px_48px_rgba(0,0,0,0.35)]",
  outline:
    "border border-gold/40 text-pearl hover:bg-gold/10 hover:border-gold/70",
  ghost: "text-gold-bright hover:text-gold py-2",
};

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
  ariaLabel,
}: ButtonProps) {
  const external = href.startsWith("http") || href.startsWith("https");
  // tel:/mailto: ليست مسارات تنقّل — تُعرض كوصلة عادية بلا router وبلا نافذة جديدة
  const protocolLink = href.startsWith("tel:") || href.startsWith("mailto:");
  const cls = `${base} ${variants[variant]} ${className}`;
  if (protocolLink) {
    return (
      <a href={href} className={cls} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }
  if (external) {
    return (
      <a href={href} className={cls} aria-label={ariaLabel} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
