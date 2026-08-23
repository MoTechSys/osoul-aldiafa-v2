import { metal } from "../tokens";

/**
 * ui/luxury/GoldRule — الفاصل المعدني: خط شعرة ذهبي + معيّن مركزي منحوت.
 *
 * الفاصل الرخيص: <hr> بلون واحد.
 * الفاصل الفاخر: تدرّج يتلاشى للطرفين (فيبدو مرسومًا بريشة لا مقصوصًا)
 * + عنصر مركزي صغير له حجم مجسّم (bevel داخلي) يكسر رتابة الخط.
 */

type GoldRuleProps = {
  /** العنصر المركزي */
  ornament?: "diamond" | "dot" | "star" | "none";
  /** العرض الأقصى */
  width?: "sm" | "md" | "full";
  className?: string;
};

const WIDTHS = { sm: "max-w-[9rem]", md: "max-w-sm", full: "max-w-none" };

export default function GoldRule({
  ornament = "diamond",
  width = "md",
  className = "",
}: GoldRuleProps) {
  return (
    <div
      aria-hidden
      className={"flex items-center justify-center gap-3 mx-auto w-full " + WIDTHS[width] + " " + className}
    >
      <span className={"h-px flex-1 " + metal.hairline} />

      {ornament === "diamond" && (
        // معيّن منحوت: bevel داخلي أبيض أعلى-يمين + ظل بُنّي أسفل-يسار
        <span
          className={
            "block h-2 w-2 rotate-45 shrink-0 " + metal.polished + " " +
            "shadow-[inset_-0.5px_0.5px_0_rgba(255,255,255,0.65),inset_0.5px_-0.5px_0_rgba(26,18,10,0.6),-1px_1px_4px_rgba(26,18,10,0.7),0_0_8px_rgba(197,160,89,0.45)]"
          }
        />
      )}
      {ornament === "dot" && (
        <span
          className={
            "block h-[7px] w-[7px] rounded-full shrink-0 " + metal.polished + " " +
            "shadow-[inset_-0.5px_0.5px_0_rgba(255,255,255,0.7),-1px_1px_3px_rgba(26,18,10,0.7),0_0_7px_rgba(197,160,89,0.5)]"
          }
        />
      )}
      {ornament === "star" && (
        <span
          className="shrink-0 text-[0.6rem] leading-none text-gold-bright"
          style={{ filter: "drop-shadow(-0.5px 1px 1.5px rgba(26,18,10,0.8)) drop-shadow(0 0 6px rgba(197,160,89,0.5))" }}
        >
          ✦
        </span>
      )}

      <span className={"h-px flex-1 " + metal.hairline} />
    </div>
  );
}
