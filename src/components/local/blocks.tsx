/**
 * D6.1 — نظام الأقسام المتغيّرة لصفحات المدن.
 *
 * كل صفحة مدينة تصف محتواها كمصفوفة `LocalPageBlock[]` مرتّبة بحرّية:
 * تستطيع كل مدينة إسقاط أقسام، وإعادة ترتيبها، وإدراج أقسام نصية حرّة —
 * وهذا هو الأساس البنيوي الذي يسمح لـ D3 بكسر تشابه القالب (97% ← <60%).
 *
 * Server Components فقط — لا "use client": كل المحتوى مرئي في SSR.
 * ❌ لا يولّد أي صفحة أحياء (R3) — كتلة chips نصّ داخل صفحة المدينة فقط.
 */

import Image from "next/image";
import Link from "next/link";
import { Button, Card, Badge, LinkCard, CardGrid, ShowcaseStrip } from "@/components/ui";
import { imageAlt } from "@/lib/images";

export type Package = { name: string; desc: string; features: string[] };
export type FAQ = { question: string; answer: string };

/** كتلة واحدة في صفحة مدينة — النوع يحدد الشكل، والحقول تحدد المحتوى. */
export type LocalPageBlock =
  | { type: "prose"; h2: string; body: string }
  | { type: "imageProse"; h2: string; body: string; img?: string; imgAlt?: string; flip?: boolean }
  | { type: "chips"; h2: string; lead?: string; items: string[] }
  | { type: "packages"; h2: string; packages: Package[]; note?: string }
  | { type: "bullets"; h2: string; items: string[] }
  | { type: "gallery"; h2: string; images: { src: string; alt: string }[] }
  | { type: "faq"; h2: string; faqs: FAQ[] }
  | { type: "links"; h2: string; links: { label: string; href: string }[] }
  | {
      /** شبكة بطاقات ثلاثية الأبعاد، كل بطاقة بزر انتقال + واتساب */
      type: "linkCards";
      h2: string;
      lead?: string;
      cards: {
        src: string;
        title: string;
        body?: string;
        tag?: string;
        href: string;
        cta?: string;
        waMessage?: string;
      }[];
      /** أعمدة الجوال — ١ (صورة كبيرة) أو ٢ */
      cols?: 1 | 2;
      lgCols?: 2 | 3 | 4;
    }
  | {
      /** شريط «من أعمالنا» / «من تقديماتنا» — أولى كبيرة والباقي ٢×٢ */
      type: "showcase";
      label: string;
      h2: string;
      lead?: string;
      items: { src: string; caption: string; href?: string }[];
      moreHref: string;
      moreLabel?: string;
      layout?: "feature" | "even";
    }
  | { type: "cta"; h2: string; body: string; buttonLabel: string; href: string };

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-gold-bright font-amiri text-2xl sm:text-3xl font-bold mb-4">{children}</h2>
);

export function RenderBlock({ block }: { block: LocalPageBlock }) {
  switch (block.type) {
    case "prose":
      return (
        <section>
          <H2>{block.h2}</H2>
          <p className="text-pearl/80 leading-loose whitespace-pre-line">{block.body}</p>
        </section>
      );

    case "imageProse":
      return (
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className={block.flip ? "md:order-2" : ""}>
            <H2>{block.h2}</H2>
            <p className="text-pearl/80 leading-loose whitespace-pre-line">{block.body}</p>
          </div>
          {block.img && (
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden card-royal">
              <Image
                src={block.img}
                alt={block.imgAlt || block.h2}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          )}
        </section>
      );

    case "chips":
      return (
        <section>
          <H2>{block.h2}</H2>
          {block.lead && <p className="text-pearl/80 leading-loose mb-4">{block.lead}</p>}
          <div className="flex flex-wrap gap-2">
            {block.items.map((d) => (
              <Badge key={d}>{d}</Badge>
            ))}
          </div>
        </section>
      );

    case "packages":
      return (
        <section>
          <h2 className="text-gold-bright font-amiri text-2xl sm:text-3xl font-bold mb-6">{block.h2}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {block.packages.map((p) => (
              <Card key={p.name} className="p-6">
                <h3 className="text-pearl font-amiri text-xl font-bold mb-2">{p.name}</h3>
                <p className="text-pearl/75 text-sm mb-4 leading-relaxed">{p.desc}</p>
                <ul className="space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-pearl/85 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
          {block.note && <p className="text-pearl/60 text-sm mt-6 leading-relaxed">{block.note}</p>}
        </section>
      );

    case "bullets":
      return (
        <section>
          <H2>{block.h2}</H2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {block.items.map((w) => (
              <li key={w} className="flex items-start gap-2 text-pearl/80 leading-relaxed">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                {w}
              </li>
            ))}
          </ul>
        </section>
      );

    case "gallery":
      if (block.images.length === 0) return null;
      return (
        <section>
          <h2 className="text-gold-bright font-amiri text-2xl sm:text-3xl font-bold mb-6">{block.h2}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {block.images.map((g, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden card-royal">
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      );

    case "faq":
      return (
        <section>
          <h2 className="text-gold-bright font-amiri text-2xl sm:text-3xl font-bold mb-6">{block.h2}</h2>
          <div className="space-y-3">
            {block.faqs.map((f) => (
              <details key={f.question} className="card-royal rounded-xl p-5 group">
                <summary className="cursor-pointer text-pearl font-semibold list-none flex items-center justify-between">
                  {f.question}
                  <span className="text-gold group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-pearl/75 text-sm leading-relaxed mt-3">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      );

    case "links":
      return (
        <section>
          <H2>{block.h2}</H2>
          <div className="flex flex-wrap gap-3">
            {block.links.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="px-4 py-2 rounded-full bg-gold/10 border border-gold/25 text-pearl/85 hover:bg-gold/20 transition text-sm"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </section>
      );

    case "linkCards":
      return (
        <section>
          <H2>{block.h2}</H2>
          {block.lead ? (
            <p className="text-pearl/80 leading-loose mb-8">{block.lead}</p>
          ) : null}
          <CardGrid
            cols={block.cols ?? 1}
            smCols={2}
            lgCols={block.lgCols ?? 3}
          >
            {block.cards.map((c, i) => (
              <LinkCard
                key={c.href + c.src}
                as="li"
                src={c.src}
                alt={imageAlt(c.src, c.title)}
                title={c.title}
                body={c.body}
                tag={c.tag}
                href={c.href}
                cta={c.cta}
                waMessage={c.waMessage}
                tilt={i % 2 === 0 ? "right" : "left"}
                sizes={
                  (block.cols ?? 1) === 1
                    ? "(max-width:640px) 94vw, (max-width:1024px) 46vw, 31vw"
                    : "(max-width:640px) 46vw, (max-width:1024px) 46vw, 31vw"
                }
              />
            ))}
          </CardGrid>
        </section>
      );

    case "showcase":
      return (
        <ShowcaseStrip
          className="!py-0"
          label={block.label}
          title={block.h2}
          intro={block.lead}
          items={block.items}
          moreHref={block.moreHref}
          moreLabel={block.moreLabel}
          layout={block.layout}
        />
      );

    case "cta":
      return (
        <section className="text-center card-royal rounded-3xl p-10">
          <h2 className="gold-text font-amiri text-2xl sm:text-3xl font-bold mb-3">{block.h2}</h2>
          <p className="text-pearl/75 mb-6 max-w-xl mx-auto leading-relaxed">{block.body}</p>
          <Button href={block.href}>{block.buttonLabel}</Button>
        </section>
      );
  }
}
