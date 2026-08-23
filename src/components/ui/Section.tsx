import { type ReactNode } from "react";

/**
 * ui/Section — غلاف القسم الموحّد: إيقاع مسافات ثابت (py-20/28)،
 * حاوية بعرض أقصى واحد، وعنوان قسم اختياري بالزخرفة الذهبية.
 * خادمي بالكامل (لا حركة هنا — الحركة مسؤولية المحتوى إن لزم).
 */

type SectionProps = {
  children: ReactNode;
  label?: string;
  title?: ReactNode;
  tight?: boolean;
  className?: string;
  id?: string;
};

export default function Section({
  children,
  label,
  title,
  tight = false,
  className = "",
  id,
}: SectionProps) {
  return (
    <section id={id} className={`${tight ? "py-14 sm:py-20" : "py-20 sm:py-28"} px-4 relative ${className}`}>
      <div className="max-w-7xl mx-auto">
        {label && (
          <p
            className="text-gold-bright text-center mb-3"
            style={{ fontSize: "0.72rem", letterSpacing: "0.45em", fontWeight: 600 }}
          >
            ✦ {label} ✦
          </p>
        )}
        {title && (
          <h2
            className="text-pearl text-center font-amiri mb-10"
            style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 700, lineHeight: 1.25 }}
          >
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
}
