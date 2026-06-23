"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * One-time mount entrance for an app workspace: the sidebar slides in from the
 * left while the main panel settles up. Kept short and quiet — this is a working
 * surface, not a landing page. Honors prefers-reduced-motion.
 */
export function DashboardSidebar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: reduce ? 0 : -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function DashboardPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.45, ease: EASE, delay: reduce ? 0 : 0.1 }}
    >
      {children}
    </motion.div>
  );
}
