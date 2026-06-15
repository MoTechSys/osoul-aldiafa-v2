"use client";

/**
 * RevealOnScroll — leaf client component that isolates the motion library.
 * Wrap any server-rendered content to add a scroll-triggered fade/slide-in.
 * The content is always present in SSR HTML (initial={false}) — only the
 * animation runs after hydration, so SEO/Googlebot never sees hidden text.
 */

import { motion, useReducedMotion } from "motion/react";
import type { ElementType, ReactNode } from "react";

export function RevealOnScroll({
  children,
  delay = 0,
  as = "div",
  className,
}: {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      initial={false}
      whileInView={{ opacity: [0, 1], y: [24, 0] }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.32, 0.72, 0, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
