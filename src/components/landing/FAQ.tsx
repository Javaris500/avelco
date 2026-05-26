"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Eyebrow, Reveal, SectionHeading } from "./Reveal";

const ITEMS: { q: string; a: string }[] = [
  {
    q: "You're a new firm. Why no portfolio?",
    a: 'Avel is new. The system behind it isn\'t. The infrastructure was built before the doors opened — the proof ships in production for our first clients. If "established firm with logos" is your filter, we\'re not the fit yet.',
  },
  {
    q: "What if my project doesn't fit a tier?",
    a: "Most do — you'd be surprised how much ships in one or two focused weeks. If yours genuinely doesn't, we scope a custom build using the same fixed-price structure. Never hourly.",
  },
  {
    q: "What if you miss the deadline?",
    a: "Deadlines are part of the contract. If we miss, you stop paying until we ship. No extensions, no excuses.",
  },
  {
    q: "What if I want to change something mid-build?",
    a: 'Small adjustments inside the locked scope are part of the process. Changes that expand scope go in the next sprint, at the next sprint\'s price. This is what prevents the "two-month project that takes a year" problem.',
  },
  {
    q: "Who owns the code?",
    a: "You do. Full handoff at delivery — repo, infrastructure, documentation. We don't keep keys.",
  },
  {
    q: "Do you offer ongoing support or retainers?",
    a: "No. Avel ships products and hands them off. If you need more work later, book another sprint.",
  },
];

function Item({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const id = `faq-${index}`;

  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        className="group -mx-4 flex w-full items-center justify-between gap-6 rounded-lg px-4 py-6 text-left transition-colors duration-150 ease-out hover:bg-accent-soft"
      >
        <span className="flex items-center gap-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-subtle tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-display text-lg font-medium tracking-tight text-text md:text-xl">
            {q}
          </span>
        </span>
        <span
          aria-hidden
          className={`grid size-8 shrink-0 place-items-center rounded-full border border-border text-lg leading-none text-accent transition-transform duration-200 ${
            open ? "rotate-45 border-accent/60" : ""
          }`}
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={reduce ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="max-w-3xl pb-6 pl-[3.75rem] pr-12 leading-relaxed text-text-muted">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="mx-auto w-full max-w-6xl px-6 py-28 md:py-44">
      <Reveal>
        <Eyebrow number="04">FAQ</Eyebrow>
        <SectionHeading className="max-w-3xl">
          Before you <span className="italic-emph">book</span>.
        </SectionHeading>
      </Reveal>
      <Reveal delay={0.1} className="mt-16 max-w-3xl">
        <div className="border-t border-border">
          {ITEMS.map((item, i) => (
            <Item key={item.q} q={item.q} a={item.a} index={i} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
