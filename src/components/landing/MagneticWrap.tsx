"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { ReactNode } from "react";

const MAX_PULL = 10;

export function MagneticWrap({
  children,
  strength = 0.22,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 20, mass: 0.4 });

  if (reduce) {
    return <span className="inline-flex">{children}</span>;
  }

  return (
    <motion.span
      style={{ x: sx, y: sy }}
      className="inline-flex"
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * strength;
        const dy = (e.clientY - cy) * strength;
        x.set(Math.max(-MAX_PULL, Math.min(MAX_PULL, dx)));
        y.set(Math.max(-MAX_PULL, Math.min(MAX_PULL, dy)));
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
