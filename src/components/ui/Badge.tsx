import { type ReactNode } from "react";

/**
 * ui/Badge — الشارة الموحّدة: كبسولة ذهبية خافتة لوسم الخدمات
 * والمدن والفئات. النص pearl/85 (11.9:1) — آمن دائمًا.
 */

type BadgeProps = {
  children: ReactNode;
  active?: boolean;
  className?: string;
};

export default function Badge({ children, active = false, className = "" }: BadgeProps) {
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm " +
        (active
          ? "bg-gold text-onyx font-bold "
          : "bg-gold/10 border border-gold/20 text-pearl/85 ") +
        className
      }
    >
      {children}
    </span>
  );
}
