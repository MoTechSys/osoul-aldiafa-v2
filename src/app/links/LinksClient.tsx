"use client";

// ═══════════════════════════════════════════════════════════════════
//  صفحة الروابط الفاخرة — /links
//
//  نُقلت من حزمة تصميم المالك «Luxury Links» مع أربعة تحسينات جوهرية
//  في الكود، كلٌّ منها مبنيّ على عيب مُقاس لا على تفضيل:
//
//  ١) الأصل كان يحمّل React development + ReactDOM development +
//     Babel standalone من unpkg ويترجم JSX **في متصفّح الزائر**.
//     ذلك وحده ≈ ١٫٥ ميجابايت JS قبل ظهور أي بطاقة، وترجمةٌ لحظية
//     تشغل المعالج. هنا: صفر JS إضافي — الصفحة تُبنى ثابتة (SSG)
//     ويُرسل HTML جاهز.
//
//  ٢) الأصل كان يستخدم Math.random() داخل الرسم لتوليد ١٤ جزيء غبار.
//     هذا بالضبط نوع العطل الذي أثبتناه في Hero.tsx: الخادم يولّد
//     أرقامًا، والمتصفّح يولّد غيرها، فتتباعد الشجرتان (React #418/#422).
//     هنا: المواضع مشتقّة حسابيًا من الفهرس (ثابتة تمامًا).
//
//  ٣) الأصل كان يبني كل حركة بـ useState + onMouseMove (إعادة رسم
//     لكل حركة فأرة). هنا: CSS :hover + transform — يعمل على خيط
//     التركيب لا على خيط JS، وبلا إعادة رسم أصلًا.
//
//  ٤) الأصل كان بالحركة دائمًا. هنا: كل حركة داخل @media
//     (prefers-reduced-motion: no-preference) في globals.css، فمن
//     يطلب تقليل الحركة يحصل على صفحة ساكنة تمامًا — دون أي شرط
//     JSX (الذي كان سبب عطل الصفحة الرئيسية).
// ═══════════════════════════════════════════════════════════════════

import Image from "next/image";
import Link from "next/link";
import { LINK_PLATFORMS } from "@/lib/linksPlatforms";
import { PHONE_TEL, WHATSAPP_DISPLAY, EMAIL } from "@/lib/constants";

/**
 * حبيبات الغبار الذهبي — مواضع حتمية.
 *
 * الأصل: `Math.random()` (خطر تباعد hydration مُثبَت).
 * البديل: أعداد أوّلية مضروبة ومُقسَّمة بالباقي — تُعطي توزيعًا يبدو
 * عشوائيًا للعين لكنه متطابق بين الخادم والمتصفّح بايتًا ببايت.
 */
const DUST = Array.from({ length: 12 }, (_, i) => ({
  left: `${(i * 37 + 7) % 96}%`,
  delay: `${((i * 13) % 90) / 10}s`,
  duration: `${11 + ((i * 7) % 9)}s`,
  size: i % 3 === 0 ? 2.5 : 1.5,
}));

export default function LinksClient() {
  return (
    <main className="links-page" dir="rtl">
      {/* ── الخلفية: نسيج جلدي داكن تحت تدرّج معتم ── */}
      <div className="links-bg" aria-hidden="true">
        <Image
          src="/images/links/bg-texture.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={70}
          style={{ objectFit: "cover" }}
        />
        <div className="links-bg-veil" />
      </div>

      {/* ── حبيبات الغبار الذهبي (تُخفى عند تقليل الحركة) ── */}
      <div className="links-dust" aria-hidden="true">
        {DUST.map((d, i) => (
          <span
            key={i}
            style={{
              left: d.left,
              width: d.size,
              height: d.size,
              animationDelay: d.delay,
              animationDuration: d.duration,
            }}
          />
        ))}
      </div>

      <div className="links-shell">
        {/* ═══ الترويسة ═══ */}
        <header className="links-header">
          {/* الشعار الحقيقي — لا حرفًا نائبًا.
              الأصل في التصميم كان حرف "B" لعلامة وهمية (MAISON NOIR)،
              ثم وضعتُ حرف «أ» مؤقتًا، وذلك كان قصورًا: العلامة لها شعار
              حقيقي (دلّة متوّجة تسكب في فنجان داخل إطار منقوش).
              اقتطعنا الشعار الدائري وحده من `/logo.webp` عند حدوده
              المُقاسة بالبكسل (121–390 × 92–363) واستثنينا كلمة «أصول
              الضيافة» المرسومة أسفله — لأن الاسم مكتوب أصلًا في <h1>
              تحت الشعار، فإدراجه في الصورة يعني تكراره مرتين.
              الحجم: 224px لعرضٍ فعلي 74px ⇒ يكفي كثافة ٣× بلا تنقيط. */}
          <div className="links-monogram">
            <span className="links-monogram-inner">
              <Image
                src="/images/links/emblem-osoul.webp"
                alt="شعار أصول الضيافة: دلة قهوة عربية متوّجة تسكب في فنجان داخل إطار دائري منقوش"
                width={224}
                height={224}
                quality={90}
                priority
                sizes="74px"
              />
            </span>
          </div>

          <h1 className="links-title">أصول الضيافة</h1>

          <div className="links-ornament" aria-hidden="true">
            <i />
            <b />
            <i />
          </div>

          {/* الأصل: "SECURE · EXCLUSIVE · TIMELESS" — شعار عام لا يخصّ
              أحدًا. استبدلناه بوصف الخدمة الحقيقي. */}
          <p className="links-tagline">قهوجيين · صبّابين · ضيافة فاخرة</p>

          <p className="links-sub">
            اختر وسيلة التواصل الأنسب لك — الردّ خلال دقائق، والاستشارة مجانية.
          </p>
        </header>

        {/* ═══ البطاقات ═══ */}
        <nav className="links-list" aria-label="قنوات التواصل مع أصول الضيافة">
          {LINK_PLATFORMS.map((p, i) => (
            <a
              key={p.id}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="links-card"
              style={
                {
                  "--tint": p.tint,
                  "--glow": p.shadow,
                  "--i": i,
                } as React.CSSProperties
              }
            >
              <span className="links-card-shimmer" aria-hidden="true" />

              <span className="links-card-icon">
                <Image
                  src={p.icon}
                  alt={p.alt}
                  width={56}
                  height={56}
                  quality={88}
                  // أول ثلاث أيقونات داخل الشاشة الأولى دائمًا
                  loading={i < 3 ? "eager" : "lazy"}
                  sizes="56px"
                />
              </span>

              <span className="links-card-text">
                <span className="links-card-name">
                  <span className="links-card-en">{p.nameEn}</span>
                  <span className="links-card-ar">— {p.nameAr}</span>
                </span>
                <span className="links-card-handle" dir="ltr">
                  {p.handle}
                </span>
              </span>

              <span className="links-card-chev" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M8 2 L4 6 L8 10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>
          ))}
        </nav>

        {/* ═══ اتصال مباشر — إضافة على الأصل ═══
            التصميم الأصلي كان بطاقات فقط. أضفنا زرّ الاتصال الهاتفي:
            جزء من الزوّار (خاصة كبار السن ومنظّمي المناسبات المستعجلين)
            يفضّلون المكالمة على الكتابة، وإغفال الهاتف يعني فقدانهم. */}
        <div className="links-call">
          <a href={`tel:${PHONE_TEL}`} className="links-call-btn">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span dir="ltr">{WHATSAPP_DISPLAY}</span>
          </a>
          <a href={`mailto:${EMAIL}`} className="links-mail">
            {EMAIL}
          </a>
        </div>

        {/* ═══ التذييل ═══ */}
        <footer className="links-footer">
          <div className="links-badge">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M6 1 L2 3 V6.5 C2 8.5 4 10.5 6 11 C8 10.5 10 8.5 10 6.5 V3 L6 1Z"
                stroke="currentColor"
                strokeWidth="0.9"
                fill="none"
              />
            </svg>
            {/* الأصل: "Verified · Exclusive" بالإنجليزية لجمهور عربي.
                عرّبناها وربطناها بحقيقة قابلة للتحقق: سنة التأسيس. */}
            <span>حسابات رسمية موثّقة · منذ ٢٠١٧</span>
          </div>

          <nav className="links-nav" aria-label="روابط الموقع">
            <Link href="/">الرئيسية</Link>
            <span aria-hidden="true">·</span>
            <Link href="/services">خدماتنا</Link>
            <span aria-hidden="true">·</span>
            <Link href="/portfolio">أعمالنا</Link>
            <span aria-hidden="true">·</span>
            <Link href="/contact">تواصل معنا</Link>
          </nav>

          {/* سنة ثابتة مقصودة: `new Date()` في مكوّن عميل يجعل الصفحة
              معتمدة على وقت التشغيل ويخالف نصّ HTML المبنيّ مسبقًا. */}
          <p className="links-rights">جميع الحقوق محفوظة © ٢٠٢٦ أصول الضيافة</p>
        </footer>
      </div>
    </main>
  );
}
