import { type ReactNode } from "react";
import { ease } from "../tokens";

/**
 * ui/luxury/Capsule3D — الكبسولة المجسّمة (شارة / زر / وسم).
 *
 * مستخرجة حرفيًا من المراجع: الكبسولة الفاخرة ليست مستطيلًا ملوّنًا،
 * بل **جسم له سماكة**. السماكة تُصنع بـ:
 *   inset-shadow أبيض على الحافة العليا-اليمنى (ضوء يلمس الحد)
 *   + inset-shadow بُنّي على الحافة السفلى-اليسرى (الحد في الظل)
 *   + ظل خارجي دافئ (الجسم يرتفع عن السطح)
 *
 * ثلاثة أنماط:
 *   raised  — بارزة معدنية (CTA / وسم مميّز) — نص داكن على ذهب
 *   carved  — منقورة داخل السطح (وسم هادئ) — نص لؤلؤي
 *   glass   — زجاج مطفي (وسم فوق صورة) — نص لؤلؤي
 *
 * التباين: raised = onyx على gold (7.6:1 معكوسًا) · carved/glass = pearl/85 (11.9:1)
 */

type Capsule3DProps = {
  children: ReactNode;
  variant?: "raised" | "carved" | "glass";
  size?: "sm" | "md";
  /** أيقونة أو رمز يُعرض قبل النص */
  icon?: ReactNode;
  className?: string;
  /** يُصيّر كـ<a> إن مُرّر href */
  href?: string;
};

const SIZES = {
  sm: "px-3 py-1.5 text-[0.78rem] gap-1.5",
  md: "px-5 py-2.5 text-sm gap-2 min-h-11",
};

const VARIANTS = {
  raised:
    "text-onyx font-bold " +
    "bg-[linear-gradient(200deg,#F0DCAE_0%,#E2C68E_20%,#C5A059_52%,#A67C37_80%,#8E6A31_100%)] " +
    "shadow-[inset_-1px_1px_0_rgba(255,255,255,0.55),inset_1px_-1px_0_rgba(94,70,32,0.55)," +
    "-2px_3px_7px_rgba(26,18,10,0.55),0_0_14px_rgba(197,160,89,0.22)] " +
    "motion-safe:hover:-translate-y-0.5 hover:brightness-[1.07] " +
    "motion-safe:hover:shadow-[inset_-1px_1px_0_rgba(255,255,255,0.6),inset_1px_-1px_0_rgba(94,70,32,0.5)," +
    "-3px_5px_12px_rgba(26,18,10,0.55),0_0_22px_rgba(197,160,89,0.34)]",
  carved:
    "text-pearl/85 bg-[#121009] border border-white/[0.045] " +
    "shadow-[inset_-1px_1px_1.5px_rgba(255,255,255,0.09),inset_2px_-2px_3px_rgba(26,18,10,0.75)] " +
    "hover:text-pearl hover:border-white/[0.1]",
  glass:
    "text-pearl/85 bg-[#1a1610]/60 backdrop-blur-md border border-white/[0.09] " +
    "shadow-[inset_-1px_1px_0_rgba(255,255,255,0.14),-1px_2px_8px_rgba(26,18,10,0.5)] " +
    "hover:text-pearl hover:bg-[#1a1610]/75",
};

export default function Capsule3D({
  children,
  variant = "carved",
  size = "sm",
  icon,
  className = "",
  href,
}: Capsule3DProps) {
  const cls =
    "inline-flex items-center justify-center rounded-full whitespace-nowrap " +
    "transition-all duration-500 " + ease.luxe + " " +
    SIZES[size] + " " + VARIANTS[variant] + " " + className;

  const inner = (
    <>
      {icon && <span aria-hidden className="shrink-0 inline-flex">{icon}</span>}
      <span>{children}</span>
    </>
  );

  if (href) {
    const ext = href.startsWith("http");
    return (
      <a
        href={href}
        className={cls + " focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-gold-bright"}
        {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }

  return <span className={cls}>{inner}</span>;
}
