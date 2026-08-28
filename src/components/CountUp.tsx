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
  // SSR / no-JS / pre-hydration: render the FINAL value in the server HTML so
  // Googlebot and users without executed JS always see the real number (never 0).
  // `value` starts at `to` (matches SSR → no hydration mismatch, no flash).
  const [value, setValue] = useState(to);
  // Was the element ALREADY visible on the very first client render? If so, the
  // user has already seen `to`, so replaying a 0→to count-up would be a visible
  // 7→0→7 flicker (review objection). We capture the initial visibility once and
  // only run the count-up flourish for elements that were still below the fold
  // (the user scrolls to them fresh, so 0→to reads as an intentional count-up).
  const seenAtMountRef = useRef<boolean | null>(null);

  // Capture initial visibility synchronously on mount via the element's rect —
  // `useInView`'s first value is async (observer hasn't fired yet), so relying
  // on it would misclassify above-fold elements. This runs once.
  useEffect(() => {
    if (seenAtMountRef.current !== null) return;
    const el = ref.current;
    if (!el) {
      seenAtMountRef.current = false;
      return;
    }
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    seenAtMountRef.current = rect.top < vh && rect.bottom > 0;
  }, []);

  useEffect(() => {
    if (!inView) return;
    // If it was on-screen at mount, never regress the value: keep `to`.
    if (seenAtMountRef.current) return;
    // Respect reduced motion — keep the SSR value, no animation.
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    // Fresh below-the-fold element: play the count-up from `from` to `to`.
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
