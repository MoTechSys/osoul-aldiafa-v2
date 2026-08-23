import { type ReactNode } from "react";
import { ease } from "../tokens";

/**
 * ui/luxury/Slab3D — لوح محفور بعمق ثابت، لبطاقات النص.
 *
 * لا يعتمد على التحويم: السماكة موجودة في اللقطة الساكنة عبر
 * لوح خلفي مُزاح + حرف معدني سفلي + حافة ضوء علوية.
 * هذا ما يجعل اللوح «قطعة» لا «مستطيل».
 */

type Slab3DProps = {
  children: ReactNode;
  /** يرفع الحدّة: إطار معدني كامل بدل الحد الشعري */
  feature?: boolean;
  className?: string;
  as?: "div" | "li" | "article" | "section";
};

export default function Slab3D({
  children,
  feature = false,
  className = "",
  as: Tag = "div",
}: Slab3DProps) {
  return (
    <Tag className={"group relative " + className}>
      {/* اللوح الخلفي — سماكة مرئية أسفل-يسار */}
      <span
        aria-hidden
        className={
          "pointer-events-none absolute inset-0 -z-10 rounded-[1.6rem] " +
          "-translate-x-2 translate-y-2 md:-translate-x-2.5 md:translate-y-2.5 " +
          "bg-[linear-gradient(205deg,#3a2f1d_0%,#1a150e_50%,#0a0806_100%)] " +
          "shadow-[-8px_14px_30px_rgba(26,18,10,0.55)]"
        }
      />

      <div
        className={
          "relative h-full rounded-[1.55rem] " +
          (feature ? "p-[2px] bg-[linear-gradient(205deg,#E2C68E_0%,#C5A059_30%,#8E6A31_62%,#4d3a1a_100%)] " : "") +
          "shadow-[-2px_3px_6px_rgba(26,18,10,0.5),-10px_20px_42px_rgba(26,18,10,0.45)] " +
          "transition-transform duration-[900ms] " + ease.luxe + " " +
          "motion-safe:group-hover:-translate-y-1.5"
        }
      >
        <div
          className={
            "relative h-full overflow-hidden rounded-[1.45rem] " +
            "bg-[linear-gradient(200deg,#1c1811_0%,#141109_58%,#0d0b07_100%)] " +
            (feature ? "" : "border border-white/[0.05] ") +
            "shadow-[inset_-1.5px_1.5px_2px_rgba(255,255,255,0.07),inset_2px_-2px_4px_rgba(26,18,10,0.8)]"
          }
        >
          {/* حافة الضوء العليا */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white/[0.09] to-white/[0.26]"
          />
          {/* حافة يمنى رأسية */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-white/[0.2] via-white/[0.04] to-transparent"
          />
          {/* هالة كهرمانية داخلية أعلى-يمين */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(78%_58%_at_88%_0%,rgba(197,160,89,0.13),transparent_62%)]"
          />
          <div className="relative">{children}</div>
        </div>
      </div>
    </Tag>
  );
}
