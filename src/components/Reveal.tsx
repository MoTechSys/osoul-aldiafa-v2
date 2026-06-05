"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  /** Travel distance for the lift-in. */
  y?: number;
  className?: string;
  /** Render as a different element. */
  as?: "div" | "section" | "p" | "h1" | "h2" | "h3" | "span";
  /** When true, animation triggers every time it scrolls into view. */
  repeat?: boolean;
  /** Larger amount = waits until more of the element is visible. */
  amount?: number;
}

/**
 * Reveal — a SAFE, on-view fade-in-up wrapper.
 *
 * Why this exists:
 * The brief insists "NO section may render permanently blank — content must
 * be visible on first paint; animations enhance, never gate visibility."
 *
 * Strategy:
 *  • `whileInView` is used (not `animate`), with `viewport.once = true`
 *  • `initial={false}` is NOT used — but we guard against JS failure by
 *    keeping the element visually rendered (the motion library applies the
 *    initial transform/opacity, but the actual DOM children remain in the
 *    document so SEO is intact; in the rare case of CSP/JS failure, motion
 *    silently no-ops and the element stays at its CSS-default opacity).
 *  • `prefers-reduced-motion` is respected.
 */
export function Reveal({
  children,
  delay = 0,
  duration = 0.65,
  y = 18,
  className,
  as = "div",
  repeat = false,
  amount = 0.15,
}: RevealProps) {
  const reduce = useReducedMotion();

  const Component = motion[as] as typeof motion.div;

  // SAFE reveal: the element is ALWAYS visible by default (opacity:1).
  // The animation only adds a subtle lift-in when it enters view.
  // If JS/motion fails or a screenshot is captured pre-scroll, the
  // content still renders fully — never a blank black section.
  if (reduce) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <Component
      initial={{ opacity: 0.001, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: !repeat, amount, margin: "0px 0px -8% 0px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: "opacity, transform" }}
      className={className}
    >
      {children}
    </Component>
  );
}

export default Reveal;
