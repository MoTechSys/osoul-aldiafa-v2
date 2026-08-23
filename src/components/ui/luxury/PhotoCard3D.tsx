import Image from "next/image";
import { type ReactNode } from "react";
import { ease } from "../tokens";

/**
 * ui/luxury/PhotoCard3D — بطاقة صورة مُجسَّمة *في حالتها الساكنة*.
 *
 * الدرس الذي بُنيت عليه: البطاقة السابقة كانت تميل عند التحويم فقط،
 * والتحويم لا وجود له في الجوال ولا في لقطة الشاشة. فالعميل يرى سطحًا
 * مسطّحًا. هنا العمق **ثابت** ومرئي قبل أي تفاعل:
 *
 *   1) لوحان خلفيان مُزاحان أسفل-يسار  ⇒ سماكة مرئية (رصّة أطباق)
 *   2) شريط معدني أسفل الوجه            ⇒ حرف البطاقة المادي
 *   3) ميل منظوري ثابت + preserve-3d    ⇒ الجسم في الفضاء لا على الشاشة
 *   4) لوح العنوان بـtranslateZ          ⇒ يطفو *فوق* الصورة فعليًا
 *   5) ظل دافئ مُزاح سالبًا في X          ⇒ الضوء من أعلى-اليمين (RTL)
 *
 * صفر جافاسكربت. الحركة كلها CSS داخل motion-safe.
 */

type PhotoCard3DProps = {
  src: string;
  alt: string;
  title: string;
  body?: string;
  tag?: string;
  /** اتجاه الميل الثابت */
  tilt?: "right" | "left" | "none";
  /** نسبة الصورة — الافتراضي عمودي كبير (كل صور الأرشيف عمودية 3:4) */
  ratio?: string;
  priority?: boolean;
  sizes?: string;
  /** محتوى إضافي أسفل النص */
  footer?: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
};

/* الميل: صغير في الجوال (لا نضيّع العرض) ثم قويّ في الشاشات الأوسع */
const TILT = {
  right:
    "[transform:perspective(1500px)_rotateY(-3deg)_rotateX(1.5deg)] " +
    "md:[transform:perspective(1500px)_rotateY(-9deg)_rotateX(4deg)]",
  left:
    "[transform:perspective(1500px)_rotateY(3deg)_rotateX(1.5deg)] " +
    "md:[transform:perspective(1500px)_rotateY(9deg)_rotateX(4deg)]",
  none: "[transform:perspective(1500px)_rotateX(1.5deg)]",
} as const;

export default function PhotoCard3D({
  src,
  alt,
  title,
  body,
  tag,
  tilt = "right",
  ratio = "aspect-[4/5] sm:aspect-[3/4]",
  priority = false,
  sizes = "(max-width:640px) 94vw, (max-width:1024px) 46vw, 31vw",
  footer,
  className = "",
  as: Tag = "div",
}: PhotoCard3DProps) {
  return (
    <Tag className={"group relative " + className}>
      {/* الهالة الكهرمانية — دفء يفصل الجسم عن السواد */}
      <span
        aria-hidden
        className={
          "pointer-events-none absolute -inset-8 -z-20 blur-3xl opacity-40 " +
          "bg-[radial-gradient(58%_46%_at_76%_16%,rgba(197,160,89,0.34),transparent_72%)] " +
          "transition-opacity duration-1000 group-hover:opacity-90 " + ease.luxe
        }
      />

      {/* اللوح الخلفي الثاني — أعمق إزاحة، أغمق لون */}
      <span
        aria-hidden
        className={
          "pointer-events-none absolute inset-0 -z-10 rounded-[1.9rem] " +
          "-translate-x-3 translate-y-3 md:-translate-x-4 md:translate-y-4 " +
          "bg-[#08070500] bg-[linear-gradient(205deg,#241f16,#0b0906)] " +
          "shadow-[-10px_18px_38px_rgba(26,18,10,0.55)]"
        }
      />
      {/* اللوح الخلفي الأول — حافة معدنية ضيقة تظهر كسماكة ذهبية */}
      <span
        aria-hidden
        className={
          "pointer-events-none absolute inset-0 -z-10 rounded-[1.82rem] " +
          "-translate-x-1.5 translate-y-1.5 md:-translate-x-2 md:translate-y-2 " +
          "bg-[linear-gradient(205deg,#C5A059_0%,#8E6A31_45%,#4a3719_100%)] opacity-90"
        }
      />

      {/* الجسم — preserve-3d ليطفو لوح العنوان داخله فعليًا */}
      <div
        className={
          "relative [transform-style:preserve-3d] [will-change:transform] " +
          TILT[tilt] + " " +
          "transition-transform duration-[1100ms] " + ease.luxe + " " +
          "motion-safe:group-hover:[transform:perspective(1500px)_rotateY(0deg)_rotateX(0deg)_translateY(-10px)_scale(1.025)]"
        }
      >
        {/* حرف البطاقة السفلي — سماكة مادية */}
        <span
          aria-hidden
          className={
            "pointer-events-none absolute -bottom-[7px] inset-x-3 h-[9px] rounded-b-[1.2rem] " +
            "bg-[linear-gradient(180deg,#8E6A31_0%,#5b451f_55%,#2a2012_100%)] " +
            "shadow-[-6px_10px_20px_rgba(26,18,10,0.7)]"
          }
        />

        {/* الإطار المعدني */}
        <div
          className={
            "relative rounded-[1.75rem] p-[2.5px] " +
            "bg-[linear-gradient(205deg,#F5E7C4_0%,#D9B978_16%,#C5A059_36%,#8E6A31_66%,#4d3a1a_100%)] " +
            "shadow-[-3px_4px_8px_rgba(26,18,10,0.55),-14px_26px_54px_rgba(26,18,10,0.5),-26px_48px_92px_rgba(26,18,10,0.32)]"
          }
        >
          <div className="relative overflow-hidden rounded-[1.6rem] bg-[#0d0b08]">
            {/* الصورة — كبيرة، عمودية، بلا قصّ يفقدها معناها */}
            <div className={"relative w-full " + ratio}>
              <Image
                src={src}
                alt={alt}
                fill
                sizes={sizes}
                priority={priority}
                className={
                  "object-cover object-center " +
                  "transition-transform duration-[1600ms] motion-safe:group-hover:scale-[1.07] " + ease.luxe
                }
              />
            </div>

            {/* تعتيم أسفل الصورة — ليجلس النص على سواد لا على تفاصيل */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-[linear-gradient(to_top,#0b0906_4%,rgba(11,9,6,0.92)_34%,rgba(11,9,6,0.45)_66%,transparent_100%)]"
            />
            {/* بريق زجاجي أعلى-يمين — يوهم بسطح لامع أمام الصورة */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(212deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.035)_20%,transparent_44%)]"
            />
            {/* حافة ضوء داخلية */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white/20 to-white/40"
            />

            {/* لوح النص الطافي — translateZ يجعله *أمام* الصورة في الفضاء.
                تكبير المنظور غير منتظم على سطح مُدوَّر، فلا يكفي counter-scale
                واحد: نخفض الرفع إلى 22px، نعاكسه بـscale، ونُزيح اللوح داخليًا
                (inset-x-3) حتى لا يخرج النص عن الإطار — preserve-3d يُعطّل قصّ الأب. */}
            <div
              className={
                "absolute inset-x-3 bottom-0 p-4 sm:p-5 " +
                "[transform:translateZ(22px)_scale(0.955)] [transform-origin:bottom_center] " +
                "[transform-style:preserve-3d]"
              }
            >
              {tag && (
                <span
                  className={
                    "inline-block mb-2.5 px-3 py-1 rounded-full text-[0.68rem] font-bold tracking-wider text-onyx " +
                    "bg-[linear-gradient(150deg,#85642E_0%,#C5A059_28%,#F0DCAE_47%,#C5A059_62%,#8E6A31_100%)] " +
                    "shadow-[inset_-0.5px_0.5px_0_rgba(255,255,255,0.55),-2px_3px_8px_rgba(26,18,10,0.75)]"
                  }
                >
                  {tag}
                </span>
              )}
              <h3 className="font-amiri text-pearl text-2xl sm:text-[1.6rem] font-bold leading-[1.35] [text-shadow:-1px_2px_6px_rgba(0,0,0,0.85)]">
                {title}
              </h3>
              {body && (
                <p className="mt-2 text-[0.92rem] leading-[1.85] text-pearl/85 [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]">
                  {body}
                </p>
              )}
              {footer}
            </div>
          </div>
        </div>
      </div>
    </Tag>
  );
}
