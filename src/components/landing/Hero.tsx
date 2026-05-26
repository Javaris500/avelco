"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { MagneticWrap } from "./MagneticWrap";
import { useBooking } from "@/components/booking/BookingContext";

type Token = { text: string; italic?: boolean; trailing?: string };

const HEADLINE: Token[] = [
  { text: "Most" },
  { text: "software" },
  { text: "firms" },
  { text: "sell" },
  { text: "time", italic: true, trailing: "." },
  { text: "We" },
  { text: "sell" },
  { text: "finished", italic: true },
  { text: "products", italic: true, trailing: "." },
];

export function Hero() {
  const reduce = useReducedMotion();
  const { setOpen } = useBooking();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const gradientY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const taglineDelay = 0;
  const headlineStart = 0.35;
  const wordStagger = 0.08;
  const subheadDelay = headlineStart + HEADLINE.length * wordStagger + 0.1;
  const ctaDelay = subheadDelay + 0.2;

  return (
    <section
      ref={ref}
      aria-label="Hero"
      className="relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden"
    >
      {/* Slow radial gradient field with parallax */}
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: gradientY }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-1/3 left-[10%] size-[60rem] rounded-full bg-accent/10 blur-3xl animate-hero-drift-a" />
        <div className="absolute -bottom-1/3 right-[5%] size-[55rem] rounded-full bg-accent/[0.06] blur-3xl animate-hero-drift-b" />
      </motion.div>

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-28 text-center md:py-36">
        {/* Designed tagline */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: -8 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: taglineDelay, ease: "easeOut" }}
          className="mb-16 flex items-baseline justify-center gap-6"
        >
          <span
            aria-hidden
            className="relative inline-block h-px w-14 self-center bg-gradient-to-r from-accent/0 via-accent to-accent/0"
          >
            <span className="absolute left-1/2 -top-[3px] -translate-x-1/2 size-[7px] rounded-full bg-accent shadow-[0_0_12px_2px_rgb(0_146_202_/_0.6)]" />
          </span>
          <p className="font-display text-2xl font-medium leading-none tracking-tight text-text md:text-3xl">
            Built with <span className="italic-emph">intent</span>.
          </p>
          <span
            aria-hidden
            className="inline-block h-px w-14 self-center bg-gradient-to-r from-accent via-accent to-accent/0"
          />
        </motion.div>

        {/* Headline */}
        <h1
          className="mx-auto max-w-5xl font-display font-bold leading-[1.01] tracking-tight text-text"
          style={{ fontSize: "clamp(2.75rem, 9vw, 8.5rem)" }}
        >
          {HEADLINE.map((token, i) => (
            <motion.span
              key={`${token.text}-${i}`}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                delay: headlineStart + i * wordStagger,
                ease: [0.2, 0.65, 0.3, 0.95],
              }}
              className="mr-[0.22em] inline-block"
            >
              {token.italic ? (
                <span className="italic-emph">{token.text}</span>
              ) : (
                token.text
              )}
              {token.trailing}
            </motion.span>
          ))}
        </h1>

        {/* Subhead */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: subheadDelay, ease: "easeOut" }}
          className="mx-auto mt-10 max-w-2xl text-lg text-text-muted md:text-xl"
        >
          AI agents. Chatbots. On-site builds. Fixed price, shipped in weeks.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: ctaDelay, ease: "easeOut" }}
          className="mt-12 flex flex-wrap items-center justify-center gap-5"
        >
          <MagneticWrap>
            <Button onClick={() => setOpen(true)} size="lg">
              Book a call →
            </Button>
          </MagneticWrap>
          <a
            href="#services"
            className="text-sm text-text-muted underline-offset-4 hover:text-text hover:underline"
          >
            See what we build
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={reduce ? undefined : { opacity: 1 }}
        transition={{ duration: 1, delay: ctaDelay + 0.4 }}
        aria-hidden
        className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-text-subtle"
      >
        Scroll
      </motion.div>
    </section>
  );
}
