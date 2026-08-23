import { Metadata } from "next";
import Image from "next/image";
import {
  PhotoCard3D,
  Slab3D,
  GoldRule,
  Capsule3D,
  Sculpt,
  GrainOverlay,
  metal,
  text,
} from "@/components/ui";
import { CLEAN_IMAGES, HERO_SAFE, imageAlt } from "@/lib/images";
import { whatsappUrl, PHONE_TEL, WHATSAPP_DISPLAY } from "@/lib/constants";

/**
 * /luxe-demo — صفحة معاينة.
 * ⚠️ noindex, nofollow — خارج الـsitemap وخارج خطة الـ38 صفحة.
 */
export const metadata: Metadata = {
  title: "معاينة نظام الفخامة | أصول الضيافة",
  description: "صفحة معاينة داخلية لنظام التصميم الفاخر — غير مفهرسة.",
  robots: { index: false, follow: false, nocache: true },
};

/* ── المحتوى: كل بطاقة لها صورة حقيقية من مناسباتنا ─────────── */

const PILLARS = [
  {
    src: "/images/products/product-9.webp",
    title: "قهوة تُدَق يوم مناسبتك",
    body: "بن محمّص وهيل يُدَقّان صباح المناسبة، ويُصَبّان من دلة ذهبية على يد صبّاب يعرف المراسم: من كبير المجلس، بيمينه، ثلاث مرّات.",
    tag: "طازجة في اليوم",
  },
  {
    src: "/images/team/team-9.webp",
    title: "صبّابون بالزي السعودي الكامل",
    body: "بشت مطرّز، شماغ مكوي، وقفازات بيضاء. لا يدخل أحد من الفريق مناسبتك بزي ناقص — ولا مرّة واحدة.",
    tag: "زي موحّد",
  },
  {
    src: "/images/dates/dates-6.webp",
    title: "أبراج تمر تُصوَّر قبل أن تُؤكل",
    body: "تمر محشوّ بالفستق واللوز وجوز الهند، يُبنى برجًا مزيّنًا بالورد فوق طبق مزخرف. ضيوفك سيرفعون جوّالاتهم قبل أيديهم.",
    tag: "تنسيق بصري",
  },
  {
    src: "/images/setups/setup-10.webp",
    title: "محطة شاي ومشروبات جاهزة",
    body: "أباريق زجاجية على قواعد فضية، شاي أحمر بالنعناع والزعفران، وأكواب مرتّبة — كل شيء واقف في مكانه قبل وصول أول ضيف.",
    tag: "قبل أول ضيف",
  },
  {
    src: "/images/setups/setup-7.webp",
    title: "فناجين بنقش النخلة والسيفين",
    body: "صواني ذهبية وفناجين بالشعار الوطني وأكواب مذهّبة. كل قطعة تُغسل وتُلمَّع وتُغلَّف قبل النقل، وتُفتح أمامك في الموقع.",
    tag: "مُلمَّعة ومغلّفة",
  },
  {
    src: "/images/products/product-10.webp",
    title: "بخور يُدار في وقته الصحيح",
    body: "مباخر نحاسية وذهبية تُدار على الضيوف بعد القهوة وقبل الانصراف — كما يُفعل في المجلس السعودي، لا كما يُفعل صدفة.",
    tag: "على الأصول",
  },
];

const PROMISES = [
  { icon: "clock" as const, t: "نصل قبل الموعد", d: "الفريق في موقعك بوقت يكفي لتجهيز الركن كاملًا قبل أول ضيف." },
  { icon: "shield" as const, t: "أدوات تُفتح أمامك", d: "كل قطعة مغلّفة من عندنا، تُفتح في موقعك — تشوف نظافتها بعينك." },
  { icon: "crown" as const, t: "رجال ونساء", d: "فريق رجالي وفريق نسائي، كل مناسبة تُخدَم بالفريق المناسب لها." },
  { icon: "star" as const, t: "تسعيرة لمناسبتك", d: "لا قائمة جاهزة — نقيس مناسبتك ونعطيك رقمًا يخصّها وحدها." },
];

const PRICE_DRIVERS = [
  { k: "عدد ضيوفك", v: "يحدّد عدد الصبّابين وكمية القهوة والفناجين" },
  { k: "نوع المناسبة", v: "عرس · عزاء · مؤتمر · استراحة · مولود" },
  { k: "مدة الخدمة", v: "استقبال قصير أم خدمة مستمرة طوال الحفل" },
  { k: "المدينة", v: "جدة · ينبع · المدينة · مكة · بدر" },
  { k: "مستوى التجهيز", v: "ركن أساسي أم بوفيه متكامل بأبراج تمر ومحطة مشروبات" },
];

/* ── الصفحة ───────────────────────────────────────────────── */

export default function LuxeDemoPage() {
  return (
    <main className="relative bg-[#0d0b08] overflow-hidden">
      <GrainOverlay intensity="subtle" className="fixed" />

      {/* ═══ 1) البطل — صورة عمودية ضخمة في الجوال ═══ */}
      <section className="relative overflow-hidden">
        {/* الجوال: الصورة تأخذ 62vh فوق النص — كبيرة ومؤثّرة كما في المراجع.
            الحاسوب: خلفية كاملة والنص فوقها. */}
        <div aria-hidden className="absolute inset-0 hidden md:block">
          <Image
            src={HERO_SAFE.desktop}
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-[linear-gradient(255deg,rgba(13,11,8,0.55)_0%,rgba(13,11,8,0.84)_46%,rgba(13,11,8,0.97)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(85%_70%_at_88%_8%,rgba(197,160,89,0.22),transparent_62%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0d0b08] to-transparent" />
        </div>

        {/* صورة الجوال — ضخمة، عمودية، بحافة معدنية سفلية */}
        <div className="relative md:hidden">
          <div className="relative h-[62vh] min-h-[26rem] w-full">
            <Image
              src={HERO_SAFE.mobile}
              alt={imageAlt(HERO_SAFE.mobile)}
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              className="object-cover object-center"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(80%_60%_at_82%_12%,rgba(197,160,89,0.2),transparent_64%)]"
            />
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,#0d0b08_2%,rgba(13,11,8,0.85)_38%,transparent_100%)]"
            />
          </div>
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[3px] bg-[linear-gradient(90deg,transparent,#C5A059_22%,#F0DCAE_50%,#C5A059_78%,transparent)]"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 md:py-32">
          <div className="max-w-3xl">
            <Capsule3D variant="glass">ضيافة المناسبات — غرب السعودية</Capsule3D>

            <h1
              className="font-amiri mt-7 leading-[1.42]"
              style={{ fontSize: "clamp(2.4rem, 7vw, 5rem)", fontWeight: 700 }}
            >
              <span className="block text-pearl">ضيافة سعودية</span>
              <span className={"block pb-[0.12em] " + metal.textClip}>على الأصول</span>
            </h1>

            <div className="mt-7 max-w-xl">
              <GoldRule ornament="diamond" width="sm" className="!mx-0 !justify-start" />
            </div>

            <p className={"mt-7 max-w-2xl leading-[1.95] text-lg " + text.secondary}>
              صبّابون بالزي السعودي، دلال ذهبية، أبراج تمر، ومحطات شاي — نجهّز
              مناسبتك في جدة وينبع والمدينة ومكة وبدر. أرسل عدد ضيوفك ونوع
              المناسبة، توصلك تسعيرتك اليوم.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Capsule3D
                variant="raised"
                size="md"
                href={whatsappUrl("مرحباً، أرغب بتسعيرة ضيافة لمناسبتي.")}
                icon={<Sculpt name="dallah" size={17} uid="c1" />}
              >
                اطلب تسعيرة مناسبتك
              </Capsule3D>
              <Capsule3D variant="glass" size="md" href={`tel:${PHONE_TEL}`}>
                {WHATSAPP_DISPLAY}
              </Capsule3D>
            </div>

            <ul className="mt-11 flex flex-wrap gap-2.5">
              {["جدة", "ينبع", "المدينة", "مكة", "بدر", "رجال ونساء"].map((c) => (
                <li key={c}>
                  <Capsule3D variant="carved">{c}</Capsule3D>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ═══ 2) الأعمدة الستة — بطاقات صور مُجسَّمة ═══ */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-20">
            <p
              className={"mb-4 " + text.goldBright}
              style={{ fontSize: "0.72rem", letterSpacing: "0.45em", fontWeight: 600 }}
            >
              ✦ ما يصل إلى مناسبتك ✦
            </p>
            <h2
              className="font-amiri text-pearl leading-[1.4]"
              style={{ fontSize: "clamp(1.9rem, 5vw, 3rem)", fontWeight: 700 }}
            >
              ستة أشياء تفرق بين ضيافة وضيافة
            </h2>
            <GoldRule ornament="diamond" width="md" className="mt-7" />
          </header>

          {/* الجوال: عمود واحد وصور كبيرة · الحاسوب: ثلاثة أعمدة */}
          <ul className="grid gap-12 sm:gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-16">
            {PILLARS.map((p, i) => (
              <PhotoCard3D
                key={p.src}
                as="li"
                src={p.src}
                alt={imageAlt(p.src)}
                title={p.title}
                body={p.body}
                tag={p.tag}
                tilt={i % 2 === 0 ? "right" : "left"}
              />
            ))}
          </ul>
        </div>
      </section>

      {/* ═══ 3) لوحة كبيرة — صورة واحدة ضخمة + وعودنا ═══ */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div aria-hidden className="absolute inset-0 opacity-[0.05]">
          <Image src={CLEAN_IMAGES.goldTexture} alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#0d0b08] via-transparent to-[#0d0b08]" />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-16 lg:items-center">
            {/* الصورة البطلة — ضخمة في كل المقاسات */}
            <PhotoCard3D
              src="/images/team/team-5.webp"
              alt={imageAlt("/images/team/team-5.webp")}
              title="صينية الاستكانات تدور على ضيوفك"
              body="مباشر بالبشت المطرّز والقفاز الأبيض — يمشي بين ضيوفك ولا ينتظر أن يُطلَب منه."
              tag="خدمة متحرّكة"
              tilt="right"
              ratio="aspect-[4/5]"
              sizes="(max-width:1024px) 94vw, 47vw"
            />

            <div>
              <p
                className={"mb-4 " + text.goldBright}
                style={{ fontSize: "0.72rem", letterSpacing: "0.45em", fontWeight: 600 }}
              >
                ✦ وعودنا لك ✦
              </p>
              <h2
                className="font-amiri text-pearl leading-[1.4] mb-6"
                style={{ fontSize: "clamp(1.8rem, 4.6vw, 2.7rem)", fontWeight: 700 }}
              >
                أربعة أشياء لا نتراجع عنها
              </h2>
              <p className={"leading-[1.95] mb-10 " + text.secondary}>
                هذه ليست مزايا إضافية — هذا الحد الأدنى الذي نخدم به كل مناسبة،
                صغيرة كانت أو كبيرة.
              </p>

              <ul className="grid gap-5 sm:grid-cols-2">
                {PROMISES.map((s, i) => (
                  <Slab3D key={s.t} as="li">
                    <div className="p-6">
                      <div className="mb-4">
                        <Sculpt name={s.icon} size={30} uid={`pr${i}`} />
                      </div>
                      <h3 className="font-amiri text-pearl text-lg font-bold mb-2">{s.t}</h3>
                      <p className={"text-sm leading-[1.85] " + text.muted}>{s.d}</p>
                    </div>
                  </Slab3D>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 4) شريط صور عمودية كبيرة — من مناسبات نفّذناها ═══ */}
      <section className="relative py-24 sm:py-32">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <header className="text-center mb-20">
            <p
              className={"mb-4 " + text.goldBright}
              style={{ fontSize: "0.72rem", letterSpacing: "0.45em", fontWeight: 600 }}
            >
              ✦ من مناسباتنا ✦
            </p>
            <h2
              className="font-amiri text-pearl leading-[1.4]"
              style={{ fontSize: "clamp(1.9rem, 5vw, 3rem)", fontWeight: 700 }}
            >
              صور من تجهيزات نفّذناها فعلًا
            </h2>
            <p className={"mt-5 max-w-lg mx-auto leading-[1.9] " + text.muted}>
              ما تراه هنا من مناسبات حقيقية لعملائنا — لا صور مُشترَاة ولا مُولَّدة.
            </p>
            <GoldRule ornament="dot" width="md" className="mt-7" />
          </header>

          <ul className="grid gap-12 sm:gap-9 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { src: CLEAN_IMAGES.dallahRow, t: "صف الدلال والبراريد", d: "واقفة وجاهزة قبل بداية الحفل" },
              { src: "/images/products/product-3.webp", t: "دلال ومباخر ذهبية", d: "طقم كامل لركن القهوة" },
              { src: CLEAN_IMAGES.datesTower, t: "طبق التمر المحشو", d: "فستق وجوز هند على طبق مزخرف" },
              { src: "/images/drinks/drink-2.webp", t: "أباريق الشاي الزجاجية", d: "شاي وزعفران مع تنسيق ورد" },
            ].map((im, i) => (
              <PhotoCard3D
                key={im.src}
                as="li"
                src={im.src}
                alt={imageAlt(im.src)}
                title={im.t}
                body={im.d}
                tilt={i % 2 === 0 ? "left" : "right"}
                ratio="aspect-[4/5]"
                sizes="(max-width:640px) 94vw, (max-width:1024px) 46vw, 23vw"
              />
            ))}
          </ul>
        </div>
      </section>

      {/* ═══ 5) التسعيرة — بلا محاضرة ═══ */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Slab3D feature>
            <div className="p-7 sm:p-14">
              <header className="text-center mb-11">
                <h2
                  className="font-amiri text-pearl leading-[1.4]"
                  style={{ fontSize: "clamp(1.7rem, 4.5vw, 2.6rem)", fontWeight: 700 }}
                >
                  تسعيرتك تُبنى على مناسبتك
                </h2>
                <p className={"mt-5 max-w-xl mx-auto leading-[1.95] " + text.secondary}>
                  خمس معلومات تكفينا لنعطيك رقمًا دقيقًا:
                </p>
              </header>

              <ul className="space-y-3">
                {PRICE_DRIVERS.map((d, i) => (
                  <li
                    key={d.k}
                    className={
                      "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 p-5 rounded-2xl " +
                      "bg-[#0f0c08] border border-white/[0.04] " +
                      "shadow-[inset_-1px_1px_1px_rgba(255,255,255,0.05),inset_1.5px_-1.5px_2px_rgba(26,18,10,0.6)]"
                    }
                  >
                    <span className="flex items-center gap-3 sm:w-48 shrink-0">
                      <span
                        aria-hidden
                        className={
                          "inline-flex items-center justify-center h-8 w-8 shrink-0 rounded-full text-[0.75rem] font-bold text-onyx " +
                          metal.polished +
                          " shadow-[inset_-0.5px_0.5px_0_rgba(255,255,255,0.55),-2px_3px_7px_rgba(26,18,10,0.7)]"
                        }
                      >
                        {i + 1}
                      </span>
                      <strong className={"font-bold " + text.goldBright}>{d.k}</strong>
                    </span>
                    <span className={"text-sm leading-[1.85] " + text.secondary}>{d.v}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-12 text-center">
                <GoldRule ornament="diamond" width="sm" className="mb-9" />
                <Capsule3D
                  variant="raised"
                  size="md"
                  href={whatsappUrl(
                    "مرحباً، أرغب بتسعيرة ضيافة. عدد الضيوف: ... · نوع المناسبة: ... · المدينة: ..."
                  )}
                  icon={<Sculpt name="dallah" size={17} uid="c2" />}
                >
                  أرسل تفاصيل مناسبتك
                </Capsule3D>
              </div>
            </div>
          </Slab3D>
        </div>
      </section>

      {/* ═══ 6) الخاتمة ═══ */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0">
          <Image
            src="/images/products/product-9.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(255deg,rgba(13,11,8,0.78)_0%,rgba(13,11,8,0.92)_60%,rgba(13,11,8,0.98)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(75%_65%_at_85%_10%,rgba(197,160,89,0.18),transparent_60%)]" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center px-4 py-28 sm:py-36">
          <h2
            className="font-amiri leading-[1.45]"
            style={{ fontSize: "clamp(1.9rem, 5.5vw, 3.4rem)", fontWeight: 700 }}
          >
            <span className="block text-pearl">مناسبتك تستحق</span>
            <span className={"block pb-[0.12em] " + metal.textClip}>ضيافة على الأصول</span>
          </h2>
          <GoldRule ornament="diamond" width="sm" className="my-9" />
          <p className={"max-w-xl mx-auto leading-[1.95] mb-11 " + text.secondary}>
            جدة · ينبع · المدينة · مكة · بدر — خدمة للرجال والنساء، بفريق بالزي
            السعودي الموحّد وأدوات مُلمَّعة ومُغلَّفة.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Capsule3D
              variant="raised"
              size="md"
              href={whatsappUrl("مرحباً، أرغب بتسعيرة ضيافة لمناسبتي.")}
              icon={<Sculpt name="dallah" size={17} uid="c3" />}
            >
              تواصل معنا الآن
            </Capsule3D>
            <Capsule3D variant="glass" size="md" href={`tel:${PHONE_TEL}`}>
              {WHATSAPP_DISPLAY}
            </Capsule3D>
          </div>
        </div>
      </section>
    </main>
  );
}
