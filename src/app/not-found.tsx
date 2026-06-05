import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الصفحة غير موجودة - 404",
  description:
    "عذراً، الصفحة التي تبحث عنها غير موجودة. يمكنك العودة للصفحة الرئيسية.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "var(--gradient-vignette)" }}
      />
      <div className="text-center max-w-xl relative z-10">
        <p
          className="text-gold-bright mb-4"
          style={{ fontSize: "0.72rem", letterSpacing: "0.45em", fontWeight: 600 }}
        >
          ✦ خطأ ٤٠٤ ✦
        </p>
        <h1
          className="gold-text font-amiri mb-4"
          style={{
            fontSize: "clamp(5rem, 16vw, 10rem)",
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "0.04em",
          }}
        >
          404
        </h1>
        <div className="ornament-line mx-auto" style={{ width: 120 }} />
        <h2
          className="text-pearl mt-6 mb-3 font-amiri"
          style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 700 }}
        >
          الصفحة غير موجودة
        </h2>
        <p className="text-pearl/55 text-sm mb-9 leading-relaxed max-w-sm mx-auto">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها — لنعد بك إلى أصول الضيافة.
        </p>
        <Link
          href="/"
          className="gold-button inline-flex items-center gap-3 px-9 py-4 rounded-full text-sm tracking-widest"
        >
          <span aria-hidden>→</span>
          <span>العودة للرئيسية</span>
        </Link>
      </div>
    </div>
  );
}
