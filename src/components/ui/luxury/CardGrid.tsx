import { type ReactNode } from "react";

/**
 * شبكة بطاقات مرنة — تحكم صريح بعدد الأعمدة في كل مقاس.
 * القاعدة الحاكمة: صور المشروع كلها عمودية (٩٠٠×١٢٠٠).
 * لذلك في الجوال لا نضغط أكثر من عمودين أبداً، والافتراضي عمود واحد
 * حتى تظهر الصورة بعرض الشاشة كاملاً — «كبيرة» كما طُلب.
 */

export type GridCols = 1 | 2 | 3 | 4;

const BASE: Record<GridCols, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};
const SM: Record<GridCols, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
};
const LG: Record<GridCols, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

export type CardGridProps = {
  children: ReactNode;
  /** أعمدة الجوال — ١ (صورة عرض الشاشة) أو ٢ */
  cols?: GridCols;
  /** أعمدة التابلت */
  smCols?: GridCols;
  /** أعمدة الشاشة الكبيرة */
  lgCols?: GridCols;
  className?: string;
  as?: "ul" | "div";
};

export default function CardGrid({
  children,
  cols = 1,
  smCols = 2,
  lgCols = 3,
  className = "",
  as: Tag = "ul",
}: CardGridProps) {
  // فراغ أوسع رأسياً لأن الألواح الخلفية تبرز ٤ بكسل خارج البطاقة
  const gap =
    cols === 1
      ? "gap-12 sm:gap-10 lg:gap-x-10 lg:gap-y-16"
      : "gap-5 sm:gap-8 lg:gap-x-10 lg:gap-y-14";

  return (
    <Tag
      className={`grid ${BASE[cols]} ${SM[smCols]} ${LG[lgCols]} ${gap} ${className}`}
    >
      {children}
    </Tag>
  );
}
