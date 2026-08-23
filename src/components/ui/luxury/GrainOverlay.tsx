/**
 * ui/luxury/GrainOverlay — طبقة حبيبات فيلمية (film grain).
 *
 * السر الذي يفصل «الأسود الرقمي» عن «الأسود السينمائي»:
 * السطح الداكن المصمت في الشاشات يظهر ميتًا. طبقة ضوضاء بـ2% شفافية
 * تُعطي السطح **نسيجًا** — تُقرأ كورق فاخر أو معدن مصنفر، لا كفراغ.
 *
 * التنفيذ: feTurbulence داخل SVG data-URI ⇒ ~0.4KB، بلا صورة، بلا JS.
 * pointer-events-none ⇒ لا يعترض أي تفاعل. aria-hidden ⇒ خارج شجرة a11y.
 */

type GrainOverlayProps = {
  /** شدة الحبيبات */
  intensity?: "subtle" | "medium";
  className?: string;
};

const GRAIN_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140">' +
  '<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/>' +
  '<feColorMatrix type="saturate" values="0"/></filter>' +
  '<rect width="140" height="140" filter="url(#n)"/></svg>';

const GRAIN = `data:image/svg+xml;utf8,${encodeURIComponent(GRAIN_SVG)}`;

export default function GrainOverlay({ intensity = "subtle", className = "" }: GrainOverlayProps) {
  return (
    <div
      aria-hidden
      className={"pointer-events-none absolute inset-0 z-[1] mix-blend-overlay " + className}
      style={{
        backgroundImage: `url("${GRAIN}")`,
        backgroundRepeat: "repeat",
        opacity: intensity === "subtle" ? 0.035 : 0.06,
      }}
    />
  );
}
