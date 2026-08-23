import { type ReactNode } from "react";
import { depth, ease } from "../tokens";

/**
 * ui/luxury/AmberFrame — إطار الصورة الفاخر بحد ذهبي معدني حقيقي.
 *
 * لماذا لا border-gold؟ الحد اللوني المصمت مسطّح. الفخامة تحتاج
 * حدًّا **متدرّجًا** يبدأ فاتحًا أعلى-يمين ويعتم أسفل-يسار — تمامًا
 * كحافة معدن مصقول تحت مصدر ضوء. نُنجزه بطبقة تدرّج تحت الصورة
 * بحشوة padding، فتظهر كإطار معدني بلا border-image (توافق أوسع).
 *
 * خادمي بالكامل. الحركة كلها CSS داخل motion-safe.
 */

type AmberFrameProps = {
  children: ReactNode;
  /** سماكة الإطار المعدني */
  weight?: "hair" | "thin" | "bold";
  /** الانحناء */
  radius?: "md" | "lg" | "xl";
  /** هالة كهرمانية خلفية */
  glow?: boolean;
  className?: string;
};

const W = { hair: "p-px", thin: "p-[2px]", bold: "p-[3px]" };
const R = {
  md: ["rounded-[1.15rem]", "rounded-[1.05rem]"],
  lg: ["rounded-[1.75rem]", "rounded-[1.62rem]"],
  xl: ["rounded-[2.25rem]", "rounded-[2.1rem]"],
};

export default function AmberFrame({
  children,
  weight = "thin",
  radius = "lg",
  glow = true,
  className = "",
}: AmberFrameProps) {
  const [ro, ri] = R[radius];

  return (
    <div className={"group relative " + className}>
      {glow && (
        <div
          aria-hidden
          className={
            "pointer-events-none absolute -inset-5 -z-10 opacity-45 blur-2xl " +
            "bg-[radial-gradient(55%_45%_at_80%_15%,rgba(197,160,89,0.4),transparent_72%)] " +
            "transition-opacity duration-700 group-hover:opacity-100 " + ease.luxe
          }
        />
      )}

      {/* الإطار المعدني: تدرّج 5 محطات — فاتح أعلى-يمين، غامق أسفل-يسار */}
      <div
        className={
          W[weight] + " " + ro + " " + depth.s2 + " " +
          "bg-[linear-gradient(205deg,#F5E7C4_0%,#D9B978_18%,#C5A059_38%,#8E6A31_68%,#5E4620_100%)] " +
          "transition-[box-shadow] duration-700 " + ease.luxe
        }
      >
        {/* الحشوة الداخلية الداكنة — تفصل الصورة عن المعدن (مثل mat اللوحة) */}
        <div className={ri + " overflow-hidden bg-[#0d0b08] relative"}>
          {children}
          {/* بريق زجاجي على الصورة — أعلى-يمين */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(210deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.03)_22%,transparent_45%)]"
          />
          {/* vignette دافئ — يسحب العين للمركز */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(115%_95%_at_50%_45%,transparent_52%,rgba(20,18,16,0.5)_100%)]"
          />
        </div>
      </div>
    </div>
  );
}
