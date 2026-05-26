"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const variants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "article" | "section";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[Tag];

  if (reduce) {
    const StaticTag = Tag as React.ElementType;
    return <StaticTag className={className}>{children}</StaticTag>;
  }

  return (
    <MotionTag
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.65, 0.3, 0.95] }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

export function Eyebrow({
  number,
  children,
}: {
  number?: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-center gap-4 font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-accent">
      {number && (
        <span className="text-text-subtle tabular-nums">{number}</span>
      )}
      <span aria-hidden className="h-px w-10 bg-accent" />
      <span>{children}</span>
    </div>
  );
}

export function SectionHeading({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`font-display text-4xl font-bold leading-[1.02] tracking-tight text-text md:text-6xl lg:text-7xl ${className ?? ""}`}
    >
      {children}
    </h2>
  );
}
