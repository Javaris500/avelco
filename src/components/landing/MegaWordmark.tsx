"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

const LETTERS = ["a", "v", "e", "l"];

export function MegaWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });
  const reduce = useReducedMotion();
  const periodDelay = LETTERS.length * 0.09 + 0.08;
  const ruleDelay = periodDelay + 0.25;

  return (
    <div
      ref={ref}
      aria-label="Avel"
      className="flex select-none flex-col items-center"
    >
      <div
        aria-hidden
        className="relative inline-flex items-baseline font-display font-bold leading-[0.82] tracking-[-0.06em] text-text"
        style={{ fontSize: "clamp(3.5rem, 13vw, 10rem)" }}
      >
        {LETTERS.map((letter, i) => (
          <motion.span
            key={i}
            initial={reduce ? false : { opacity: 0, y: 60 }}
            animate={reduce || inView ? { opacity: 1, y: 0 } : undefined}
            transition={{
              duration: 0.85,
              delay: i * 0.09,
              ease: [0.2, 0.65, 0.3, 0.95],
            }}
            className="inline-block"
          >
            {letter}
          </motion.span>
        ))}
        {/* Accent period — the mark detail */}
        <motion.span
          initial={reduce ? false : { opacity: 0, scale: 0.3 }}
          animate={reduce || inView ? { opacity: 1, scale: 1 } : undefined}
          transition={{
            duration: 0.5,
            delay: periodDelay,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          className="ml-[0.04em] inline-block text-accent"
          style={{ textShadow: "0 0 24px rgb(0 146 202 / 0.45)" }}
        >
          .
        </motion.span>
      </div>

      {/* Centered accent rule beneath — draws in after the wordmark lands */}
      <motion.div
        aria-hidden
        initial={reduce ? false : { scaleX: 0, opacity: 0 }}
        animate={reduce || inView ? { scaleX: 1, opacity: 1 } : undefined}
        transition={{
          duration: 0.8,
          delay: ruleDelay,
          ease: "easeOut",
        }}
        className="mt-4 h-px w-40 origin-center bg-gradient-to-r from-accent/0 via-accent to-accent/0"
      />
    </div>
  );
}
