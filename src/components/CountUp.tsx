"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "motion/react";

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** If true, format Arabic-Indic digits */
  arabicDigits?: boolean;
}

const arabicMap = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
function toArabic(n: number) {
  return String(Math.round(n))
    .split("")
    .map((ch) => (/[0-9]/.test(ch) ? arabicMap[Number(ch)] : ch))
    .join("");
}

export default function CountUp({
  to,
  from = 0,
  duration = 1.6,
  prefix = "",
  suffix = "",
  className,
  arabicDigits = false,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!inView) return;
    // Respect reduced motion
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setValue(to);
      return;
    }
    const controls = animate(from, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, from, to, duration]);

  const display = arabicDigits ? toArabic(value) : String(Math.round(value));
  return (
    <span ref={ref} className={className} aria-label={`${prefix}${to}${suffix}`}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
