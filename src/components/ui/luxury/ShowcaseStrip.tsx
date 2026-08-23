import Image from "next/image";
import Link from "next/link";
import GoldRule from "./GoldRule";
import { imageAlt } from "@/lib/images";

/**
 * شريط عرض «من أعمالنا» / «من تقديماتنا».
 * ينزل مع الصفحة شوية شوية بين الأقسام.
 *
 * قاعدة الجوال (طلب صاحب المشروع): لا نضع الصورة كاملة بعرض الشاشة
 * في كل مرة — نُنوّع: بطاقة واحدة كبيرة، ثم ٢×٢، ثم واحدة.
 * التخطيط `feature` يجعل أول صورة كبيرة وباقي الصور ٢×٢ حولها.
 */

export type ShowcaseItem = {
  src: string;
  caption: string;
  /** رابط الصفحة التي تخصّ هذه الصورة */
  href?: string;
};

export type ShowcaseStripProps = {
  label: string;
  title: string;
  intro?: string;
  items: ShowcaseItem[];
  /** رابط زر «شاهد الكل» */
  moreHref: string;
  moreLabel?: string;
  /** feature = أولى كبيرة + الباقي ٢×٢ | even = كل البطاقات بنفس الحجم ٢×٢ */
  layout?: "feature" | "even";
  className?: string;
};

function Tile({
  item,
  big = false,
  sizes,
}: {
  item: ShowcaseItem;
  big?: boolean;
  sizes: string;
}) {
  const inner = (
    <>
      {/* لوح خلفي — سماكة */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-[1.4rem] -translate-x-1.5 translate-y-1.5 md:-translate-x-2 md:translate-y-2 bg-[linear-gradient(205deg,#C5A059_0%,#7d5c2a_50%,#2a2012_100%)] opacity-85"
      />
      <div className="relative rounded-[1.35rem] p-[2px] bg-[linear-gradient(205deg,#F0DFB8_0%,#C5A059_34%,#8E6A31_68%,#433216_100%)] shadow-[-3px_5px_10px_rgba(26,18,10,0.45),-12px_22px_44px_rgba(10,8,4,0.55)]">
        <div className="relative overflow-hidden rounded-[1.2rem] bg-[#0d0b08]">
          <div className={`relative w-full ${big ? "aspect-[4/5]" : "aspect-[3/4]"}`}>
            <Image
              src={item.src}
              alt={imageAlt(item.src, item.caption)}
              fill
              sizes={sizes}
              className="object-cover"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(178deg,transparent_44%,rgba(8,6,4,0.5)_72%,rgba(6,5,3,0.92)_100%)]"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(212deg,rgba(255,252,244,0.12)_0%,transparent_28%)]"
            />
            {/* التسمية */}
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
              <p
                className={`font-amiri font-bold text-pearl leading-[1.4] ${
                  big ? "text-lg sm:text-xl" : "text-[0.95rem] sm:text-base"
                }`}
                style={{ textShadow: "-1px 2px 6px rgba(0,0,0,0.85)" }}
              >
                {item.caption}
              </p>
              {item.href ? (
                <span className="mt-1.5 inline-flex items-center gap-1 text-[0.72rem] font-bold text-[#E2C68E]">
                  اذهب للصفحة <span aria-hidden>←</span>
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (item.href) {
    return (
      <li className="relative isolate">
        <Link
          href={item.href}
          className="group relative block transition-transform duration-500 hover:-translate-y-1.5 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E2C68E] rounded-[1.4rem]"
        >
          {inner}
        </Link>
      </li>
    );
  }
  return <li className="relative isolate">{inner}</li>;
}

export default function ShowcaseStrip({
  label,
  title,
  intro,
  items,
  moreHref,
  moreLabel = "شاهد الكل",
  layout = "feature",
  className = "",
}: ShowcaseStripProps) {
  const [first, ...rest] = items;

  return (
    <section className={`relative px-4 py-16 sm:py-24 ${className}`}>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_8%,rgba(197,160,89,0.11),transparent_62%)]"
      />
      <div className="relative mx-auto max-w-7xl">
        <p className="text-center text-[0.72rem] font-semibold tracking-[0.42em] text-[#E2C68E]">
          ✦ {label} ✦
        </p>
        <h2 className="mt-3 text-center font-amiri text-3xl font-bold leading-[1.35] text-pearl sm:text-4xl">
          {title}
        </h2>
        {intro ? (
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-[1.95] text-pearl/75 sm:text-base">
            {intro}
          </p>
        ) : null}
        <GoldRule className="mx-auto mt-6" />

        {layout === "feature" && first ? (
          <div className="mt-12 grid gap-6 lg:grid-cols-5 lg:gap-8">
            {/* الصورة الكبيرة — بعرض الشاشة في الجوال */}
            <ul className="lg:col-span-2 grid grid-cols-1">
              <Tile
                item={first}
                big
                sizes="(max-width:1024px) 94vw, 38vw"
              />
            </ul>
            {/* الباقي ٢×٢ */}
            <ul className="lg:col-span-3 grid grid-cols-2 gap-5 sm:gap-6 lg:gap-7">
              {rest.map((it) => (
                <Tile
                  key={it.src}
                  item={it}
                  sizes="(max-width:640px) 46vw, (max-width:1024px) 46vw, 26vw"
                />
              ))}
            </ul>
          </div>
        ) : (
          <ul className="mt-12 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4 lg:gap-7">
            {items.map((it) => (
              <Tile
                key={it.src}
                item={it}
                sizes="(max-width:640px) 46vw, (max-width:1024px) 46vw, 23vw"
              />
            ))}
          </ul>
        )}

        <div className="mt-10 text-center">
          <Link
            href={moreHref}
            className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/50 bg-[#1a1610]/60 px-8 py-3.5 text-sm font-semibold tracking-wide text-[#E2C68E] transition-colors duration-300 hover:bg-[#241f16] motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2C68E]"
          >
            {moreLabel}
            <span aria-hidden>←</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
