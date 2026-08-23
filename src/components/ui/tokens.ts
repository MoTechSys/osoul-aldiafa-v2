/**
 * ui/tokens.ts — مصدر الحقيقة الوحيد لرموز نظام التصميم الفاخر.
 *
 * قاعدة التباين الحاكمة (درس fix/contrast-a11y):
 * كل رمز نص هنا مقيس فوق الخلفية الفعلية بعد كل تراكيب الشفافية —
 * لا شفافيات حرة للنص خارج هذه الرموز.
 *
 * القياسات (WCAG relative luminance فوق onyx #141210):
 *   pearl كامل  = 15.1:1   · pearl/85 = 11.9:1 · pearl/75 = 9.45:1
 *   gold كامل   = 7.61:1   · gold/80  = 5.28:1
 *   gold-bright = 11.3:1   · gold-deep كامل = 4.95:1
 * كل ما دون ذلك زخرفي فقط (حدود · فواصل · خلفيات).
 */

// ─── رموز النص المقيسة (آمنة WCAG AA فوق الخلفيات الداكنة) ───
export const text = {
  /** نص أساسي — عناوين ومتن رئيسي (15.1:1) */
  primary: "text-pearl",
  /** نص ثانوي — أوصاف وفقرات (11.9:1) */
  secondary: "text-pearl/85",
  /** نص خافت — تسميات وحواشٍ، الحد الأدنى المعتمد (9.45:1) */
  muted: "text-pearl/75",
  /** ذهبي بارز — تسميات الأقسام والعلامات (11.3:1) */
  goldBright: "text-gold-bright",
  /** ذهبي — نص ذهبي عادي؛ لا تستخدم أخف منه للنص (7.61:1) */
  gold: "text-gold",
  /** ذهبي هادئ للعلامات اللاتينية الصغيرة (5.28:1) */
  goldSoft: "text-gold/80",
} as const;

// ─── التدرجات الذهبية الناعمة ───
export const gradients = {
  /** التدرج الملكي — للأزرار الأساسية والعناصر البطولية */
  royal: "bg-gradient-to-l from-gold-deep via-gold to-gold-bright",
  /** لمعة خفيفة — لخلفيات البطاقات المميزة */
  sheen: "bg-gradient-to-br from-gold/15 via-transparent to-gold/5",
  /** خط زخرفي متلاشي الطرفين */
  rule: "bg-gradient-to-l from-transparent via-gold/60 to-transparent",
} as const;

// ─── الظلال الطبقية (فخامة هادئة — لا ظلال ثقيلة) ───
export const shadows = {
  /** بطاقة مرتفعة قليلًا */
  card: "shadow-[0_2px_12px_rgba(0,0,0,0.35),0_8px_32px_rgba(0,0,0,0.25)]",
  /** عنصر بارز (CTA) مع هالة ذهبية خافتة */
  glow: "shadow-[0_4px_20px_rgba(197,160,89,0.25),0_2px_8px_rgba(0,0,0,0.4)]",
  /** ارتفاع عند التحويم */
  hover: "shadow-[0_6px_24px_rgba(197,160,89,0.3),0_12px_48px_rgba(0,0,0,0.35)]",
} as const;

// ─── شبكة المسافات المتسقة (إيقاع 8px) ───
export const spacing = {
  section: "py-20 sm:py-28",
  sectionTight: "py-14 sm:py-20",
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
} as const;

// ─── أهداف اللمس (WCAG 2.5.8: ≥24px، وأزرارنا الأساسية 48px) ───
export const touch = {
  /** الحد الأدنى لأي هدف تفاعلي ثانوي */
  min: "min-h-6 min-w-6",
  /** الأزرار الأساسية */
  button: "min-h-12",
} as const;

// ═══════════════════════════════════════════════════════════════════
//  LUXURY v2 — رموز الفخامة المستخرجة من تحليل المراجع بكسل-بكسل
//
//  ثلاثة تصحيحات جوهرية عن v1، كل واحد مُثبَت من قياس المراجع:
//
//  1) الظل الأسود الصافي rgba(0,0,0,…) يُقرأ «رخيصًا».
//     الظل الفاخر مُشبَّع بحرارة المادة: rgba(26,18,10,…) — بُنّي داكن،
//     فيبدو الظل صادرًا عن جسم ذهبي لا عن ثقب أسود.
//
//  2) كل المراجع مُضاءة من أعلى-اليسار. موقع عربي RTL يجب أن يُضاء
//     من أعلى-اليمين، وإلا ارتدّت العين: الظل يذهب للـ«خلف» بصريًا.
//     ⇒ إزاحة الظل السالبة على X: ‎-4px‎ لا ‎+4px‎.
//
//  3) البطاقة الداكنة الفاخرة بلا حدود. تُعرَّف بفرق سطوع ~4% فقط
//     عن الخلفية. الحد الذهبي الظاهر (border-gold/15) يخفض الفخامة.
//     ⇒ نستخدم حد بعرض 1px بلون فاتح 6% كحافة ضوء، لا كإطار.
// ═══════════════════════════════════════════════════════════════════

/** حِدَّة الانتقال: منحنى الخروج الفاخر (سريع البداية، هادئ النهاية) */
export const ease = {
  /** الانتقال الأساسي — كل حركة فاخرة تستخدمه */
  luxe: "[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
  /** ارتداد ناعم للعناصر التفاعلية */
  spring: "[transition-timing-function:cubic-bezier(0.34,1.4,0.64,1)]",
} as const;

/** الإضاءة: مصدر الضوء أعلى-يمين (صحيح لـ RTL) */
export const lighting = {
  /** لمعة حافة عليا-يمنى — تُحاكي انعكاس ضوء على معدن */
  edge:
    "before:absolute before:inset-x-0 before:top-0 before:h-px " +
    "before:bg-gradient-to-l before:from-transparent before:via-white/12 before:to-white/25",
  /** هالة كهرمانية خلفية — الدفء الذي يفصل العنصر عن السواد */
  backlight:
    "after:absolute after:-z-10 after:inset-0 " +
    "after:bg-[radial-gradient(120%_80%_at_85%_0%,rgba(197,160,89,0.16),transparent_60%)]",
} as const;

/**
 * ظلال دافئة مُضاءة من اليمين — الفرق الجوهري عن shadows في v1.
 * rgba(26,18,10) = #1A120A بُنّي داكن ⇒ ظل «مادي» لا ظل «فراغ».
 */
export const depth = {
  /** مستوى 1 — بطاقة تلامس السطح */
  s1: "shadow-[-1px_1px_2px_rgba(26,18,10,0.45),-2px_4px_10px_rgba(26,18,10,0.35)]",
  /** مستوى 2 — البطاقة الافتراضية */
  s2: "shadow-[-2px_2px_4px_rgba(26,18,10,0.5),-6px_12px_28px_rgba(26,18,10,0.42),-12px_24px_56px_rgba(26,18,10,0.28)]",
  /** مستوى 3 — عنصر مرفوع (تحويم) + دفء ذهبي */
  s3:
    "shadow-[-3px_3px_6px_rgba(26,18,10,0.5),-10px_20px_44px_rgba(26,18,10,0.45)," +
    "-20px_40px_80px_rgba(26,18,10,0.3),0_0_36px_rgba(197,160,89,0.12)]",
  /** غائر — يُستخدم للحُفَر والكبسولات المنقورة (bevel داخلي) */
  inset:
    "shadow-[inset_-1px_1px_1px_rgba(255,255,255,0.09),inset_2px_-2px_3px_rgba(26,18,10,0.6)]",
  /** بارز — الكبسولة ثلاثية الأبعاد */
  emboss:
    "shadow-[inset_-1px_1px_0_rgba(255,255,255,0.22),inset_1px_-1px_0_rgba(26,18,10,0.45)," +
    "-2px_3px_8px_rgba(26,18,10,0.5)]",
} as const;

/** أسطح البطاقات: بلا إطار ذهبي — فرق سطوع ~4% + حافة ضوء 1px */
export const surface = {
  /** السطح الأساسي الفاخر */
  card: "bg-[#191510] border border-white/[0.055]",
  /** سطح أغمق للتباين الداخلي */
  well: "bg-[#100d09] border border-white/[0.035]",
  /** سطح زجاجي — يحتاج خلفية غنية تحته */
  glass: "bg-[#191510]/70 backdrop-blur-xl border border-white/[0.07]",
  /** نصف قطر «الاسكويركل» — الانحناء الفاخر (أكبر من rounded-2xl) */
  squircle: "rounded-[1.75rem]",
  squircleSm: "rounded-[1.15rem]",
} as const;

/** المعدن: تدرّجات الذهب المصقول ذات الـ4 محطّات (لا محطتين) */
export const metal = {
  /** ذهب مصقول — 4 محطات تخلق «خط الانعكاس» الذي يصنع الإحساس المعدني */
  polished:
    "bg-[linear-gradient(150deg,#85642E_0%,#C5A059_28%,#F0DCAE_47%,#C5A059_62%,#8E6A31_100%)]",
  /** ذهب مطفي — للأسطح الكبيرة حيث المصقول يُبهِر */
  brushed:
    "bg-[linear-gradient(160deg,#A67C37_0%,#C5A059_45%,#B08F4C_70%,#8E6A31_100%)]",
  /** نص ذهبي معدني (يُطبَّق مع bg-clip-text) */
  textClip:
    "bg-[linear-gradient(150deg,#A67C37_0%,#E2C68E_38%,#F5E7C4_52%,#D9B978_66%,#A67C37_100%)] " +
    "bg-clip-text text-transparent",
  /** خط فاصل معدني رقيق */
  hairline:
    "bg-[linear-gradient(90deg,transparent,rgba(197,160,89,0.15)_15%,rgba(242,224,184,0.75)_50%,rgba(197,160,89,0.15)_85%,transparent)]",
} as const;
