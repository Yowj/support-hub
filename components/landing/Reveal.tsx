"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Shared scroll-reveal motion language for the landing page.
 * Engineered easing (easeOutExpo) + short rises — precise, not bouncy.
 * All primitives degrade to an instant fade when prefers-reduced-motion is set.
 */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const VIEWPORT = { once: true, margin: "-80px" } as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

/** Single block that fades and rises into view on scroll. */
export function Reveal({ children, className, delay = 0, y = 24 }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: reduce ? 0 : 0.6, ease: EASE, delay: reduce ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}

interface RevealGroupProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}

/** Container whose RevealItem children animate in sequence. */
export function RevealGroup({
  children,
  className,
  stagger = 0.07,
  delay = 0,
}: RevealGroupProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

interface RevealItemProps {
  children: ReactNode;
  className?: string;
  y?: number;
}

/** A single staggered child — must be nested inside a RevealGroup. */
export function RevealItem({ children, className, y = 20 }: RevealItemProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : y },
        show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.55, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}
