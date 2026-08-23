import { type ReactNode } from "react";

/**
 * ui/Card — البطاقة الموحّدة: خلفية داكنة دافئة، حد ذهبي خافت،
 * ظل طبقي هادئ، وارتفاع ناعم عند التحويم (motion-safe فقط).
 * `sheen` يضيف لمعة ذهبية قطرية للبطاقات المميزة.
 */

type CardProps = {
  children: ReactNode;
  sheen?: boolean;
  className?: string;
};

export default function Card({ children, sheen = false, className = "" }: CardProps) {
  return (
    <div
      className={
        "relative rounded-2xl border border-gold/15 bg-noir/80 overflow-hidden " +
        "shadow-[0_2px_12px_rgba(0,0,0,0.35),0_8px_32px_rgba(0,0,0,0.25)] " +
        "transition-all duration-300 motion-safe:hover:-translate-y-1 " +
        "hover:border-gold/30 hover:shadow-[0_6px_24px_rgba(197,160,89,0.15),0_12px_48px_rgba(0,0,0,0.35)] " +
        className
      }
    >
      {sheen && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent"
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
