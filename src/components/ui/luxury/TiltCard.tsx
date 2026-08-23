import { type ReactNode } from "react";
import { depth, surface, ease } from "../tokens";

/**
 * ui/luxury/TiltCard — بطاقة ثلاثية الأبعاد بميل حقيقي.
 *
 * الفخامة هنا من أربع طبقات فيزيائية، لا من زخرفة:
 *   1) perspective + rotateY على الأب  ⇒ ميل مجسّم عند التحويم
 *   2) ظل دافئ مُضاء من أعلى-اليمين     ⇒ الجسم «فوق» السطح لا «على» السطح
 *   3) حافة ضوء 1px بيضاء 25%           ⇒ سماكة مادية للحد
 *   4) هالة كهرمانية خلفية               ⇒ دفء يفصل الجسم عن السواد
 *
 * صفر جافاسكربت — CSS transform خالص (لا onMouseMove).
 * يحترم prefers-reduced-motion عبر motion-safe:.
 */

type TiltCardProps = {
  children: ReactNode;
  /** اتجاه الميل: يمين (افتراضي RTL) أو يسار */
  tilt?: "right" | "left" | "none";
  /** هالة كهرمانية خلف البطاقة */
  glow?: boolean;
  className?: string;
  as?: "div" | "article" | "li";
};

export default function TiltCard({
  children,
  tilt = "right",
  glow = true,
  className = "",
  as: Tag = "div",
}: TiltCardProps) {
  const rot =
    tilt === "right"
      ? "motion-safe:group-hover:[transform:perspective(1400px)_rotateY(-5deg)_rotateX(2.5deg)_translateY(-6px)_scale(1.012)]"
      : tilt === "left"
      ? "motion-safe:group-hover:[transform:perspective(1400px)_rotateY(5deg)_rotateX(2.5deg)_translateY(-6px)_scale(1.012)]"
      : "motion-safe:group-hover:[transform:translateY(-6px)_scale(1.012)]";

  return (
    <Tag className={"group relative " + className}>
      {/* الهالة الكهرمانية — خلف البطاقة، تتوسّع عند التحويم */}
      {glow && (
        <div
          aria-hidden
          className={
            "pointer-events-none absolute -inset-6 -z-10 opacity-0 blur-2xl " +
            "bg-[radial-gradient(60%_50%_at_78%_18%,rgba(197,160,89,0.3),transparent_70%)] " +
            "transition-opacity duration-700 group-hover:opacity-100 " + ease.luxe
          }
        />
      )}

      <div
        className={
          "relative h-full overflow-hidden " +
          surface.squircle + " " + surface.card + " " + depth.s2 + " " +
          "[transform-style:preserve-3d] [will-change:transform] " +
          "transition-[transform,box-shadow,border-color] duration-700 " + ease.luxe + " " +
          rot + " " +
          "group-hover:border-white/[0.11] motion-safe:group-hover:" + depth.s3.replace("shadow-[", "shadow-[")
        }
      >
        {/* حافة الضوء العليا-اليمنى — سماكة مادية للحد */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white/10 to-white/[0.28]"
        />
        {/* حافة الضوء اليمنى الرأسية */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-white/[0.22] via-white/[0.05] to-transparent"
        />
        {/* انعكاس زجاجي مائل يتحرّك عند التحويم */}
        <span
          aria-hidden
          className={
            "pointer-events-none absolute -inset-y-8 -left-1/3 w-1/3 rotate-12 " +
            "bg-gradient-to-r from-transparent via-white/[0.055] to-transparent " +
            "transition-transform duration-1000 motion-safe:group-hover:translate-x-[420%] " + ease.luxe
          }
        />
        <div className="relative">{children}</div>
      </div>
    </Tag>
  );
}
