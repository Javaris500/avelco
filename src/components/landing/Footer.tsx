"use client";

import Link from "next/link";
import { MagneticWrap } from "./MagneticWrap";
import { MegaWordmark } from "./MegaWordmark";
import { Reveal } from "./Reveal";
import { useBooking } from "@/components/booking/BookingContext";

export function Footer() {
  const { setOpen } = useBooking();
  return (
    <footer className="relative isolate overflow-hidden border-t border-border bg-bg">
      {/* Top accent hairline */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent/0 via-accent/50 to-accent/0"
      />

      {/* Soft ambient glow tucked behind the wordmark */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/2 size-[60rem] -translate-x-1/2 translate-y-1/3 rounded-full bg-accent/[0.05] blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 pt-28 md:pt-40">
        {/* Closing manifesto line */}
        <Reveal className="text-center">
          <p
            className="mx-auto max-w-4xl font-display font-medium leading-[1.05] tracking-tight text-text"
            style={{ fontSize: "clamp(1.75rem, 4vw, 3.25rem)" }}
          >
            No retainers. No surprises.{" "}
            <span className="italic-emph">Just product</span>.
          </p>
        </Reveal>

        {/* Status pulse + CTA echo */}
        <Reveal
          delay={0.15}
          className="mt-14 flex flex-col items-center justify-between gap-8 md:mt-20 md:flex-row md:items-center"
        >
          <div className="flex items-center gap-3">
            <span aria-hidden className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent/50" />
              <span className="relative inline-flex size-2.5 rounded-full bg-accent shadow-[0_0_10px_2px_rgb(0_146_202_/_0.55)]" />
            </span>
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-text-muted">
              Currently booking 2026 sprints
            </span>
          </div>
          <MagneticWrap strength={0.3}>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-accent/50 bg-accent-soft px-8 py-4 font-display text-base font-medium tracking-tight text-text transition-[background-color,border-color,color,box-shadow] duration-300 ease-out hover:border-accent hover:bg-accent hover:text-bg hover:shadow-[0_0_32px_4px_rgb(0_146_202_/_0.4)]"
            >
              <span className="relative">Ready to ship</span>
              <span
                aria-hidden
                className="relative inline-flex transition-transform duration-300 ease-out group-hover:translate-x-1.5"
              >
                →
              </span>
            </button>
          </MagneticWrap>
        </Reveal>
      </div>

      {/* Mega wordmark — anchors the page close */}
      <div className="mt-24 md:mt-32 px-6">
        <MegaWordmark />
      </div>

      {/* Sub-nav row — section index recap */}
      <div className="mt-20 border-t border-border md:mt-24">
        <nav
          aria-label="Page sections"
          className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-7 gap-y-3 px-6 py-6 font-mono text-[10px] uppercase tracking-[0.25em] text-text-subtle"
        >
          <a className="hover:text-text" href="#problem">
            01 Problem
          </a>
          <a className="hover:text-text" href="#services">
            02 Services
          </a>
          <a className="hover:text-text" href="#the-system">
            03 System
          </a>
          <a className="hover:text-text" href="#faq">
            04 FAQ
          </a>
          <a className="hover:text-text" href="#cta">
            05 Book
          </a>
        </nav>
      </div>

      {/* Meta strip + legal — the very bottom */}
      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-6 py-6 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-text-subtle">
            <span className="text-text-muted">Avel LLC</span>
            <span aria-hidden>·</span>
            <span>United States</span>
            <span aria-hidden>·</span>
            <span>Est. 2026</span>
            <span aria-hidden>·</span>
            <span>Remote</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-text-subtle">
            <Link className="hover:text-text" href="/privacy">
              Privacy
            </Link>
            <Link className="hover:text-text" href="/terms">
              Terms
            </Link>
            <span>© 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
