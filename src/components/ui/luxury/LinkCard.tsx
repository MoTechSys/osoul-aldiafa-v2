import Image from "next/image";
import Link from "next/link";
import { PHONE_TEL, whatsappUrl } from "@/lib/constants";

/**
 * بطاقة صورة + عنوان + زر انتقال مباشر لصفحتها + واتساب/اتصال.
 * عمق ثلاثي الأبعاد ثابت (بلا hover) — يعمل على الجوال وفي الصور الثابتة.
 * مكوّن سيرفر: صفر جافاسكربت.
 */

export type LinkCardProps = {
  src: string;
  alt: string;
  title: string;
  body?: string;
  tag?: string;
  /** رابط الصفحة الرئيسية لهذه الخدمة/المدينة */
  href: string;
  /** نص زر الانتقال */
  cta?: string;
  /** رسالة واتساب مخصّصة لهذه البطاقة */
  waMessage?: string;
  /** إظهار زر الاتصال بجانب واتساب */
  showCall?: boolean;
  tilt?: "right" | "left" | "none";
  ratio?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  as?: "div" | "li" | "article";
};

const TILT = {
  right:
    "[transform:perspective(1500px)_rotateY(-2.5deg)_rotateX(1.2deg)] " +
    "md:[transform:perspective(1500px)_rotateY(-7deg)_rotateX(3deg)]",
  left:
    "[transform:perspective(1500px)_rotateY(2.5deg)_rotateX(1.2deg)] " +
    "md:[transform:perspective(1500px)_rotateY(7deg)_rotateX(3deg)]",
  none: "[transform:perspective(1500px)_rotateX(1.2deg)]",
} as const;

export default function LinkCard({
  src,
  alt,
  title,
  body,
  tag,
  href,
  cta = "اعرف التفاصيل",
  waMessage,
  showCall = false,
  tilt = "right",
  ratio = "aspect-[4/5] sm:aspect-[3/4]",
  priority = false,
  sizes = "(max-width:640px) 94vw, (max-width:1024px) 46vw, 31vw",
  className = "",
  as: Tag = "div",
}: LinkCardProps) {
  return (
    <Tag className={`relative isolate ${className}`}>
      {/* هالة عنبرية دافئة */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-8 -z-20 rounded-[3rem] bg-[radial-gradient(ellipse_at_75%_15%,rgba(197,160,89,0.20),transparent_68%)] blur-3xl"
      />

      {/* لوح خلفي ٢ — يعطي سماكة */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-[1.9rem] -translate-x-3 translate-y-3 md:-translate-x-4 md:translate-y-4 bg-[linear-gradient(205deg,#241f16,#0b0906)] shadow-[-10px_18px_38px_rgba(26,18,10,0.55)]"
      />
      {/* لوح خلفي ١ — حرف معدني */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-[1.85rem] -translate-x-1.5 translate-y-1.5 md:-translate-x-2 md:translate-y-2 bg-[linear-gradient(205deg,#C5A059_0%,#8E6A31_45%,#4a3719_100%)] opacity-90"
      />

      <div
        className={
          "relative [transform-style:preserve-3d] transition-transform duration-700 " +
          "[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] " +
          "motion-reduce:transition-none " +
          TILT[tilt]
        }
      >
        {/* شريط الحرف السفلي */}
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-[7px] inset-x-3 h-[9px] rounded-b-[1.2rem] bg-[linear-gradient(180deg,#8E6A31_0%,#5b451f_55%,#2a2012_100%)]"
        />

        {/* الإطار المعدني */}
        <div className="relative rounded-[1.8rem] p-[2.5px] bg-[linear-gradient(205deg,#F5E7C4_0%,#D9B978_16%,#C5A059_36%,#8E6A31_66%,#4d3a1a_100%)] shadow-[-3px_4px_8px_rgba(26,18,10,0.45),-14px_26px_54px_rgba(12,9,5,0.6),-26px_48px_92px_rgba(8,6,3,0.5)]">
          <div className="relative overflow-hidden rounded-[1.6rem] bg-[#0d0b08]">
            {/* الصورة */}
            <div className={`relative w-full ${ratio}`}>
              <Image
                src={src}
                alt={alt}
                fill
                priority={priority}
                sizes={sizes}
                className="object-cover"
              />
              {/* حجاب سفلي لقراءة النص */}
              <span
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(178deg,transparent_34%,rgba(8,6,4,0.55)_64%,rgba(6,5,3,0.93)_100%)]"
              />
              {/* لمعة زجاجية */}
              <span
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(212deg,rgba(255,252,244,0.14)_0%,transparent_26%,transparent_74%,rgba(0,0,0,0.22)_100%)]"
              />
              {/* حرف ضوء أعلى */}
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,246,226,0.5),transparent)]"
              />
            </div>

            {/* النص + الأزرار */}
            <div className="relative p-4 sm:p-5 bg-[linear-gradient(200deg,#191510_0%,#110e09_60%,#0b0906_100%)]">
              {tag ? (
                <span
                  className="inline-block mb-2.5 rounded-full px-3 py-1 text-[0.68rem] font-bold text-onyx"
                  style={{
                    background:
                      "linear-gradient(205deg,#F5E7C4 0%,#D9B978 22%,#C5A059 52%,#8E6A31 100%)",
                  }}
                >
                  {tag}
                </span>
              ) : null}

              <h3 className="font-amiri text-pearl text-xl sm:text-[1.5rem] font-bold leading-[1.4] pb-[0.08em]">
                {title}
              </h3>

              {body ? (
                <p className="mt-2 text-sm leading-[1.85] text-pearl/80">{body}</p>
              ) : null}

              {/* أزرار الانتقال */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Link
                  href={href}
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[0.82rem] font-bold text-onyx transition-transform duration-300 hover:scale-[1.04] motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2C68E]"
                  style={{
                    background:
                      "linear-gradient(205deg,#F5E7C4 0%,#E2C68E 20%,#C5A059 55%,#A67C37 100%)",
                    boxShadow:
                      "0 2px 0 rgba(255,250,238,0.5) inset, -3px 5px 12px rgba(20,14,8,0.55)",
                  }}
                >
                  {cta}
                  <span aria-hidden>←</span>
                </Link>

                <a
                  href={whatsappUrl(waMessage ?? `مرحباً، أرغب بالاستفسار عن: ${title}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`تواصل عبر واتساب بخصوص ${title}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#C5A059]/45 bg-[#1a1610]/70 px-3.5 py-2.5 text-[0.82rem] font-semibold text-[#E2C68E] transition-colors duration-300 hover:bg-[#241f16] motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2C68E]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.13-.42-2.15-1.33-.8-.71-1.33-1.59-1.48-1.89-.15-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.03 1.01-1.03 2.46s1.06 2.86 1.21 3.06c.15.2 2.06 3.2 5.02 4.37 2.46.97 2.96.78 3.5.73.53-.05 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.27-.2-.57-.35zM12.04 2C6.55 2 2.1 6.45 2.1 11.94c0 1.76.46 3.4 1.27 4.84L2 22l5.34-1.4a9.9 9.9 0 004.7 1.2c5.49 0 9.94-4.45 9.94-9.94S17.53 2 12.04 2zm0 18.03c-1.5 0-2.9-.4-4.11-1.11l-.29-.17-3.05.8.81-2.98-.19-.31a8.06 8.06 0 01-1.24-4.32c0-4.46 3.62-8.08 8.08-8.08s8.07 3.62 8.07 8.08-3.62 8.09-8.08 8.09z" />
                  </svg>
                  واتساب
                </a>

                {showCall ? (
                  <a
                    href={`tel:${PHONE_TEL}`}
                    aria-label={`اتصل بنا بخصوص ${title}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#C5A059]/45 bg-[#1a1610]/70 px-3.5 py-2.5 text-[0.82rem] font-semibold text-[#E2C68E] transition-colors duration-300 hover:bg-[#241f16] motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2C68E]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                    اتصال
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Tag>
  );
}
