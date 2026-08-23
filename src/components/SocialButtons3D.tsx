"use client";

/**
 * SocialButtons3D — أزرار التواصل الاجتماعي بعمق ثلاثي الأبعاد.
 *
 * تعديل بأمر المالك (س٦)، وكل بند منه سبب مُقاس لا ذوق:
 *  ١) كانت ٣ منصّات فقط (انستقرام/تيك توك/سناب) مع أن `SOCIAL_LINKS`
 *     تحتوي ٥ روابط موثّقة ⇒ أُضيفت X وفيسبوك، فلا يبقى حساب مخفيًا.
 *  ٢) كانت `flex-wrap` مع مربّع 76px: خمسة أزرار بهذا القياس تنكسر إلى
 *     سطرين على شاشة 390px ⇒ صرنا `flex-nowrap` وصغّرنا المربّع إلى
 *     52px (و46px تحت 360px) فتُوضع الخمسة في **صف واحد** مضمونًا.
 *  ٣) كان لون كل منصّة يظهر عند `group-hover` فقط ⇒ على الجوّال (وهو
 *     ٩٥٪ من الزوّار) لا يوجد hover أصلًا، فكانت الأزرار كلها ذهبية
 *     متشابهة ولا يُميّز الزائر انستقرام من تيك توك. الآن اللون **ثابت**
 *     في الحدود والأيقونة والهالة، ويزداد سطوعًا عند اللمس/المرور.
 */

import { motion, useReducedMotion } from "motion/react";
import { SOCIAL_LINKS } from "@/lib/constants";

type Social = {
  key: string;
  label: string;
  href: string;
  brand: string;
  icon: React.ReactNode;
};

const SOCIALS: Social[] = [
  {
    key: "instagram",
    label: "انستقرام",
    href: SOCIAL_LINKS.instagram,
    brand: "#E1306C",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[22px] h-[22px] sm:w-6 sm:h-6">
        <rect x="2" y="2" width="20" height="20" rx="5.5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: "tiktok",
    label: "تيك توك",
    href: SOCIAL_LINKS.tiktok,
    brand: "#25F4EE",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px] sm:w-6 sm:h-6">
        <path d="M16.6 5.82a4.28 4.28 0 01-1.06-2.82h-3.2v12.74a2.42 2.42 0 11-2.42-2.42c.18 0 .36.02.53.06V8.1a5.66 5.66 0 00-.53-.03 5.66 5.66 0 105.66 5.66V8.9a7.5 7.5 0 004.34 1.39V7.08a4.28 4.28 0 01-3.32-1.26z" />
      </svg>
    ),
  },
  {
    key: "snapchat",
    label: "سناب شات",
    href: SOCIAL_LINKS.snapchat,
    // الأصفر الرسمي #FFFC00 على خلفية سوداء يكاد يعمي العين ولا يقرأ
    // بوصفه «لونًا»؛ خفّضناه درجة نحو الذهبي كما فعلنا في صفحة /links.
    brand: "#FFC800",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px] sm:w-6 sm:h-6">
        <path d="M12 2c2.5 0 4.3 1.9 4.4 4.4.03.7 0 1.4-.04 2 .3.16.7.12 1.1-.06.6-.25 1.3.6.8 1.2-.4.5-1 .7-1.6.9-.2.06-.3.1-.3.3.1.8 1 2.5 2.7 3.1.3.1.5.4.4.7-.2.6-1.3.8-1.9.9-.1.3-.1.7-.3.8-.2.1-.7 0-1.2 0-.6 0-1.2.1-1.7.5-.6.4-1.2.9-2.4.9s-1.8-.5-2.4-.9c-.5-.4-1.1-.5-1.7-.5-.5 0-1 .1-1.2 0-.2-.1-.2-.5-.3-.8-.6-.1-1.7-.3-1.9-.9-.1-.3.1-.6.4-.7 1.7-.6 2.6-2.3 2.7-3.1 0-.2-.1-.24-.3-.3-.6-.2-1.2-.4-1.6-.9-.5-.6.2-1.45.8-1.2.4.18.8.22 1.1.06-.04-.6-.07-1.3-.04-2C7.7 3.9 9.5 2 12 2z" />
      </svg>
    ),
  },
  {
    key: "x",
    label: "إكس",
    href: SOCIAL_LINKS.x,
    // هوية X سوداء، وهي غير مرئية على خلفية سوداء ⇒ رمادي فاتح.
    brand: "#B8B8B8",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]">
        <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.63l-5.2-6.8-5.94 6.8H1.74l7.53-8.6L1.11 2.25h6.8l4.83 6.38 5.5-6.38zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64z" />
      </svg>
    ),
  },
  {
    key: "facebook",
    label: "فيسبوك",
    href: SOCIAL_LINKS.facebook,
    brand: "#1877F2",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px] sm:w-6 sm:h-6">
        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.45 2.91h-2.33V22C18.34 21.24 22 17.08 22 12.06z" />
      </svg>
    ),
  },
];

export function SocialButtons3D() {
  const reduce = useReducedMotion();

  return (
    // `flex-nowrap` تضمن الصف الواحد الذي أمر به المالك.
    // `justify-center` مع فراغات مضبوطة: 5×52 + 4×14 = 316px < 358px
    // (عرض 390px ناقص هوامش الصفحة) ⇒ لا انكسار ولا تمرير أفقي.
    <div className="flex flex-nowrap items-start justify-center gap-3 sm:gap-5">
      {SOCIALS.map((s, i) => (
        <motion.a
          key={s.key}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          initial={false}
          whileHover={reduce ? undefined : { y: -5, scale: 1.07 }}
          whileTap={reduce ? undefined : { scale: 0.93, y: -1 }}
          transition={{ type: "spring", stiffness: 380, damping: 18, delay: i * 0.02 }}
          className="group relative flex flex-col items-center gap-1.5 sm:gap-2"
        >
          {/* الزر: أصغر من السابق (76 ← 52) ليتّسع الصف الواحد لخمسة */}
          <span
            className="relative flex items-center justify-center rounded-xl sm:rounded-2xl w-[46px] h-[46px] sm:w-[52px] sm:h-[52px]"
            style={{
              background: "linear-gradient(145deg, #1c1813 0%, #0a0a0a 100%)",
              // اللون **ثابت** لا عند المرور فقط: حدٌّ بلون المنصّة بشفافية
              // ٥٥٪ يبقى متناغمًا مع الذهبي ولا يصرخ.
              border: `1px solid ${s.brand}8C`,
              color: s.brand,
              boxShadow: `0 8px 20px -6px rgba(0,0,0,0.7), 0 3px 8px -2px rgba(0,0,0,0.6), inset 0 1px 0 ${s.brand}40, inset 0 -3px 8px rgba(0,0,0,0.6)`,
            }}
          >
            {/* لمعة ذهبية عامة تحفظ وحدة الهوية */}
            <span
              aria-hidden
              className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-60 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(120% 80% at 30% 10%, rgba(226,198,142,0.24) 0%, transparent 55%)",
              }}
            />
            {/* هالة المنصّة: ظاهرة دائمًا (0.28) وتزداد عند المرور/اللمس.
                هذا هو جوهر أمر المالك — اللون يُرى على الجوّال بلا hover. */}
            <span
              aria-hidden
              className="absolute -inset-[3px] rounded-2xl blur-md opacity-[0.28] transition-opacity duration-300 group-hover:opacity-60"
              style={{ background: s.brand }}
            />
            <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">
              {s.icon}
            </span>
          </span>
          <span className="text-pearl/65 text-[10px] sm:text-xs font-medium leading-tight whitespace-nowrap transition-colors duration-300 group-hover:text-gold-bright">
            {s.label}
          </span>
        </motion.a>
      ))}
    </div>
  );
}
